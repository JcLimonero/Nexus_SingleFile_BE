#!/usr/bin/env php
<?php
/**
 * Ejecuta la migración 006 (homologar columnas a snake_case)
 * Renombra columnas camelCase a snake_case en nexfile_orders, nexfile_customers, nexfile_invoices
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
    'dwh',
    $db['port'] ?? 3306
);

if ($mysqli->connect_error) {
    fwrite(STDERR, "Error de conexión: " . $mysqli->connect_error . "\n");
    exit(1);
}
$mysqli->set_charset($db['charset'] ?? 'utf8mb4');

$renames = [
    'nexfile_orders' => [
        ['idAgency', 'id_agency', 'VARCHAR(10)'],
        ['consultantName', 'consultant_name', 'VARCHAR(100)'],
        ['ndConsultant', 'nd_consultant', 'VARCHAR(20)'],
        ['customerDMS', 'customer_dms', 'VARCHAR(20)'],
        ['connectionstring', 'connection_string', 'VARCHAR(100)'],
    ],
    'nexfile_customers' => [
        ['idAgency', 'id_agency', 'INT'],
        ['ndDMS', 'nd_cliente', 'VARCHAR(50)'],
        ['connectionstring', 'connection_string', 'VARCHAR(100)'],
    ],
    'nexfile_invoices' => [
        ['idAgency', 'id_agency', 'INT'],
        ['consultantName', 'consultant_name', 'VARCHAR(100)'],
        ['ndConsultant', 'nd_consultant', 'VARCHAR(20)'],
        ['customerDMS', 'customer_dms', 'VARCHAR(50)'],
    ],
];

foreach ($renames as $table => $cols) {
    foreach ($cols as [$old, $new, $type]) {
        $r = $mysqli->query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'dwh' AND TABLE_NAME = '$table' AND COLUMN_NAME = '$old'");
        if ($r && $r->fetch_assoc()) {
            $sql = "ALTER TABLE $table CHANGE COLUMN `$old` `$new` $type";
            if ($mysqli->query($sql)) {
                echo "OK $table: $old -> $new\n";
            } else {
                echo "Error $table $old: " . $mysqli->error . "\n";
            }
        } else {
            echo "Skip $table.$old (no existe)\n";
        }
    }
}

$mysqli->close();
echo "Migración 006 completada.\n";
