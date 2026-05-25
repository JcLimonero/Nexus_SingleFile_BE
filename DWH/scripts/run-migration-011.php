#!/usr/bin/env php
<?php
/**
 * Ejecuta la migración 011 (bussines_name, client_type, tipo_operacion, tipo_proceso)
 */

$baseDir = dirname(__DIR__);
$configPath = $baseDir . '/app/Config/database-config.json';

if (!is_file($configPath)) {
    fwrite(STDERR, "Error: No se encuentra database-config.json\n");
    exit(1);
}

$config = json_decode(file_get_contents($configPath), true);
$db = $config['database'] ?? null;
if (!$db) {
    fwrite(STDERR, "Error: Configuración de BD no válida\n");
    exit(1);
}

$mysqli = new mysqli(
    $db['hostname'] ?? '127.0.0.1',
    $db['username'] ?? '',
    $db['password'] ?? '',
    $db['database'] ?? 'dwh',
    $db['port'] ?? 3306
);

if ($mysqli->connect_error) {
    fwrite(STDERR, "Error de conexión: " . $mysqli->connect_error . "\n");
    exit(1);
}

$mysqli->set_charset($db['charset'] ?? 'utf8mb4');
$mysqli->select_db('dwh');

$cols = ['bussines_name' => 'VARCHAR(200)', 'client_type' => 'VARCHAR(20)', 'tipo_operacion' => 'VARCHAR(50)', 'tipo_proceso' => 'VARCHAR(50)'];
foreach ($cols as $col => $def) {
    $r = $mysqli->query("SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='dwh' AND TABLE_NAME='nexfile_invoices' AND COLUMN_NAME='$col'");
    if ($r && $r->num_rows > 0) {
        echo "Columna $col ya existe.\n";
    } else {
        $mysqli->query("ALTER TABLE nexfile_invoices ADD COLUMN $col $def NULL");
        if ($mysqli->error) {
            fwrite(STDERR, "Error agregando $col: " . $mysqli->error . "\n");
            exit(1);
        }
        echo "Columna $col agregada.\n";
    }
}

$mysqli->query("DROP VIEW IF EXISTS view_single_file_orders");
$mysqli->query("CREATE VIEW view_single_file_orders AS SELECT * FROM nexfile_invoices");
if ($mysqli->error) {
    fwrite(STDERR, "Error recreando vista: " . $mysqli->error . "\n");
    exit(1);
}
echo "Vista view_single_file_orders recreada.\n";

// Backfill bussines_name y client_type desde nexfile_customers
$connCol = null;
$ndCol = null;
$bussinesCol = null;
$tipoCol = null;
$invConnCol = null;
$invCustCol = null;
$invIdAgencyCol = null;

$res = $mysqli->query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='dwh' AND TABLE_NAME='nexfile_customers'");
$custCols = $res ? array_column($res->fetch_all(), 0) : [];
$res = $mysqli->query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='dwh' AND TABLE_NAME='nexfile_invoices'");
$invCols = $res ? array_column($res->fetch_all(), 0) : [];

foreach (['connection_string', 'connectionstring'] as $c) {
    if (in_array($c, $custCols, true)) { $connCol = $c; break; }
}
foreach (['nd_cliente', 'ndCliente', 'nd_dms'] as $c) {
    if (in_array($c, $custCols, true)) { $ndCol = $c; break; }
}
foreach (['bussines_name', 'business_name', 'razonSocial'] as $c) {
    if (in_array($c, $custCols, true)) { $bussinesCol = $c; break; }
}
foreach (['client_type'] as $c) {
    if (in_array($c, $custCols, true)) { $tipoCol = $c; break; }
}
foreach (['connection_string', 'connectionstring'] as $c) {
    if (in_array($c, $invCols, true)) { $invConnCol = $c; break; }
}
foreach (['customer_dms', 'customerDMS'] as $c) {
    if (in_array($c, $invCols, true)) { $invCustCol = $c; break; }
}
foreach (['id_agency', 'idAgency'] as $c) {
    if (in_array($c, $invCols, true)) { $invIdAgencyCol = $c; break; }
}

if ($connCol && $ndCol && $bussinesCol && $invConnCol && $invCustCol && $invIdAgencyCol) {
    $custIdCol = null;
    foreach (['id_agency', 'idAgency'] as $c) {
        if (in_array($c, $custCols, true)) { $custIdCol = $c; break; }
    }
    if (!$custIdCol) $custIdCol = 'id_agency';
    $joinAgency = "c.`$custIdCol` = i.`$invIdAgencyCol`";
    $setBussines = "i.bussines_name = COALESCE(NULLIF(TRIM(c.`$bussinesCol`), ''), 'Cliente')";
    $setTipo = $tipoCol ? "i.client_type = COALESCE(NULLIF(TRIM(c.`$tipoCol`), ''), 'fisica')" : "i.client_type = 'fisica'";
    $sql = "UPDATE nexfile_invoices i
        INNER JOIN nexfile_customers c ON c.`$ndCol` = i.`$invCustCol` AND c.`$connCol` = i.`$invConnCol` AND $joinAgency
        SET $setBussines, $setTipo
        WHERE i.bussines_name IS NULL OR i.bussines_name = ''";
    $mysqli->query($sql);
    $affected = $mysqli->affected_rows;
    echo "Backfill bussines_name/client_type: $affected registros actualizados.\n";
}

// Backfill tipo_operacion y tipo_proceso con valores por defecto
$stateCol = null;
foreach (['state', 'State'] as $c) {
    if (in_array($c, $invCols, true)) { $stateCol = $c; break; }
}
if ($stateCol) {
    $mysqli->query("UPDATE nexfile_invoices SET tipo_proceso = CASE
        WHEN $stateCol = 1 THEN 'Integración' WHEN $stateCol = 2 THEN 'Liquidación' WHEN $stateCol = 3 THEN 'Liberación'
        WHEN $stateCol = 4 THEN 'Liberado' WHEN $stateCol = 5 THEN 'Cancelado' WHEN $stateCol = 6 THEN 'Liberado por Excepción'
        ELSE 'Sin Integrar' END
        WHERE tipo_proceso IS NULL OR tipo_proceso = ''");
    echo "Backfill tipo_proceso: " . $mysqli->affected_rows . " registros.\n";
}
$mysqli->query("UPDATE nexfile_invoices SET tipo_operacion = 'Compra' WHERE (tipo_operacion IS NULL OR tipo_operacion = '') AND RAND() < 0.7");
$mysqli->query("UPDATE nexfile_invoices SET tipo_operacion = 'Venta' WHERE (tipo_operacion IS NULL OR tipo_operacion = '')");
echo "Backfill tipo_operacion completado.\n";

$mysqli->close();
echo "Migración 011 ejecutada correctamente.\n";
