#!/usr/bin/env php
<?php
/**
 * Ejecuta la migración 010 (agregar release_date a nexfile_invoices)
 *
 * Uso: php scripts/run-migration-010.php
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

// Agregar release_date (puede fallar si ya existe)
$ok = $mysqli->query("ALTER TABLE nexfile_invoices ADD COLUMN release_date DATE NULL");
if (!$ok && $mysqli->errno !== 1060) {
    fwrite(STDERR, "Error ALTER TABLE: " . $mysqli->error . "\n");
    exit(1);
}
if ($mysqli->errno === 1060) {
    echo "Columna release_date ya existe.\n";
} else {
    echo "Columna release_date agregada.\n";
}

$mysqli->query("DROP VIEW IF EXISTS view_single_file_orders");
$mysqli->query("CREATE VIEW view_single_file_orders AS SELECT * FROM nexfile_invoices");
if ($mysqli->error) {
    fwrite(STDERR, "Error recreando vista: " . $mysqli->error . "\n");
    exit(1);
}
echo "Vista view_single_file_orders recreada.\n";

$mysqli->close();
echo "Migración 010 ejecutada correctamente.\n";
