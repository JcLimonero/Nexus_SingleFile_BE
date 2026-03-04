#!/usr/bin/env php
<?php
/**
 * Ejecuta la migración 004 (alterar nexfile_invoices para anonimización)
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

$alters = [
    "MODIFY COLUMN vin VARCHAR(20) NULL",
    "MODIFY COLUMN chassis VARCHAR(20) NULL",
    "MODIFY COLUMN model VARCHAR(100) NULL",
    "MODIFY COLUMN version VARCHAR(50) NULL",
    "MODIFY COLUMN external_color VARCHAR(50) NULL",
    "MODIFY COLUMN internal_color VARCHAR(50) NULL",
    "MODIFY COLUMN consultantName VARCHAR(100) NULL",
    "MODIFY COLUMN ndConsultant VARCHAR(20) NULL",
    "MODIFY COLUMN customerDMS VARCHAR(50) NULL",
    "MODIFY COLUMN connectionstring VARCHAR(100) NULL",
    "MODIFY COLUMN amount DECIMAL(15,2) NULL",
    "MODIFY COLUMN inventory VARCHAR(15) NULL",
];

foreach ($alters as $mod) {
    $col = preg_replace('/^MODIFY COLUMN (\w+).*/', '$1', $mod);
    $sql = "ALTER TABLE nexfile_invoices $mod";
    try {
        if ($mysqli->query($sql)) {
            echo "OK: $col\n";
        } else {
            echo "Skip $col: " . $mysqli->error . "\n";
        }
    } catch (mysqli_sql_exception $e) {
        echo "Skip $col: " . $e->getMessage() . "\n";
    }
}

$mysqli->close();
echo "Migración 004 completada.\n";
