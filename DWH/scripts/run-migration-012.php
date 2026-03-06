#!/usr/bin/env php
<?php
/**
 * Ejecuta la migración 012 (agency_connection en nexfile_customers y nexfile_invoices)
 * Pobla agency_connection según id_agency (agencyDms)
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

// Mapeo id_agency (agencyDms) -> agency_connection
$agencyConnection = [
    '99999' => 'GeelyConnection', '88888' => 'GeelyConnection',
    '1356' => 'AudiConnection', '1' => 'KiaConnection', '2' => 'KiaConnection', '1000' => 'KiaConnection',
    '10017' => 'HondaConnection', '10082' => 'HondaConnection', '10202' => 'HondaConnection',
    '63' => 'HondaConnection', '2003' => 'HondaConnection',
    '48410047' => 'QuiterConnection', '9001' => 'OmodaConnection', '9002' => 'OmodaConnection',
    '9000' => 'OmodaConnection', '187' => 'ChireyConnection', '73001' => 'MotonovaConnection',
    '70012' => 'MotonovaConnection', '10018' => 'BMWConnection',
];

// Agregar agency_connection a nexfile_customers
$r = $mysqli->query("SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='dwh' AND TABLE_NAME='nexfile_customers' AND COLUMN_NAME='agency_connection'");
if ($r && $r->num_rows > 0) {
    echo "Columna agency_connection ya existe en nexfile_customers.\n";
} else {
    $mysqli->query("ALTER TABLE nexfile_customers ADD COLUMN agency_connection VARCHAR(50) NULL");
    if ($mysqli->error) {
        fwrite(STDERR, "Error: " . $mysqli->error . "\n");
        exit(1);
    }
    echo "Columna agency_connection agregada a nexfile_customers.\n";
}

// Agregar agency_connection a nexfile_invoices
$r = $mysqli->query("SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='dwh' AND TABLE_NAME='nexfile_invoices' AND COLUMN_NAME='agency_connection'");
if ($r && $r->num_rows > 0) {
    echo "Columna agency_connection ya existe en nexfile_invoices.\n";
} else {
    $mysqli->query("ALTER TABLE nexfile_invoices ADD COLUMN agency_connection VARCHAR(50) NULL");
    if ($mysqli->error) {
        fwrite(STDERR, "Error: " . $mysqli->error . "\n");
        exit(1);
    }
    echo "Columna agency_connection agregada a nexfile_invoices.\n";
}

// Obtener columna id_agency en cada tabla (nexfile_customers usa idAgency, nexfile_invoices usa id_agency)
$agencyColMap = ['nexfile_customers' => 'idAgency', 'nexfile_invoices' => 'id_agency'];
$agencyCols = [];
foreach (['nexfile_customers', 'nexfile_invoices'] as $tbl) {
    $res = $mysqli->query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='dwh' AND TABLE_NAME='$tbl' AND COLUMN_NAME IN ('id_agency','idAgency','IdAgency')");
    $row = $res ? $res->fetch_assoc() : null;
    $agencyCols[$tbl] = $row ? $row['COLUMN_NAME'] : ($agencyColMap[$tbl] ?? 'id_agency');
}

// Poblar nexfile_customers
$ac = $agencyCols['nexfile_customers'];
$cases = [];
foreach ($agencyConnection as $id => $conn) {
    $idEsc = $mysqli->real_escape_string($id);
    $connEsc = $mysqli->real_escape_string($conn);
    $cases[] = "WHEN `$ac` = '$idEsc' THEN '$connEsc'";
}
$casesSql = implode(' ', $cases);
$default = $mysqli->real_escape_string('KiaConnection');
$mysqli->query("UPDATE nexfile_customers SET agency_connection = CASE $casesSql ELSE '$default' END");
echo "nexfile_customers: " . $mysqli->affected_rows . " registros actualizados.\n";

// Poblar nexfile_invoices
$ac = $agencyCols['nexfile_invoices'];
$cases = [];
foreach ($agencyConnection as $id => $conn) {
    $idEsc = $mysqli->real_escape_string($id);
    $connEsc = $mysqli->real_escape_string($conn);
    $cases[] = "WHEN `$ac` = '$idEsc' THEN '$connEsc'";
}
$casesSql = implode(' ', $cases);
$mysqli->query("UPDATE nexfile_invoices SET agency_connection = CASE $casesSql ELSE '$default' END");
echo "nexfile_invoices: " . $mysqli->affected_rows . " registros actualizados.\n";

// Recrear vistas
$mysqli->query("DROP VIEW IF EXISTS view_single_file_client");
$mysqli->query("CREATE VIEW view_single_file_client AS SELECT * FROM nexfile_customers");
$mysqli->query("DROP VIEW IF EXISTS view_single_file_orders");
$mysqli->query("CREATE VIEW view_single_file_orders AS SELECT * FROM nexfile_invoices");
if ($mysqli->error) {
    fwrite(STDERR, "Error recreando vistas: " . $mysqli->error . "\n");
    exit(1);
}
echo "Vistas recreadas.\n";

$mysqli->close();
echo "Migración 012 ejecutada correctamente.\n";
