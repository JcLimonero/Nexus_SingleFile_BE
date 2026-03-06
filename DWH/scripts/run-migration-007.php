#!/usr/bin/env php
<?php
/**
 * Ejecuta la migración 007 (crear vista view_single_file_client en dwh)
 *
 * Uso: php scripts/run-migration-007.php
 * O desde raíz del proyecto: php DWH/scripts/run-migration-007.php
 *
 * Requiere: nexfile_customers poblada (populate-nexfile-customers.php)
 * Para que la API devuelva clientes locales: database en database-config.json = "dwh"
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
    $db['database'] ?? 'vgd_dwh_prod',
    $db['port'] ?? 3306
);

if ($mysqli->connect_error) {
    fwrite(STDERR, "Error de conexión: " . $mysqli->connect_error . "\n");
    exit(1);
}

$mysqli->set_charset($db['charset'] ?? 'utf8mb4');

$sqlFile = $baseDir . '/DB/migrations/007_create_view_single_file_client.sql';
if (!is_file($sqlFile)) {
    fwrite(STDERR, "Error: No se encuentra la migración\n");
    exit(1);
}

$sql = file_get_contents($sqlFile);
$sql = preg_replace('/--[^\n]*\n/', "\n", $sql);

if ($mysqli->multi_query($sql)) {
    do {
        if ($result = $mysqli->store_result()) {
            $result->free();
        }
        echo ".";
    } while ($mysqli->next_result());
}

if ($mysqli->error) {
    fwrite(STDERR, "\nError MySQL: " . $mysqli->error . "\n");
    exit(1);
}
echo "\nMigración 007 ejecutada correctamente.\n";

$mysqli->select_db('dwh');
$count = $mysqli->query("SELECT COUNT(*) as c FROM nexfile_customers")->fetch_assoc()['c'] ?? 0;
echo "Registros en nexfile_customers: $count\n";
echo "Para que GET /nexfile/customers use datos locales, cambiar 'database' en database-config.json a \"dwh\".\n";
$mysqli->close();
