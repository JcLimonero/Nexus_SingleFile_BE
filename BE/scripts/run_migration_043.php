<?php
/**
 * Ejecuta la migración 043: tabla config (configuración del sistema)
 */
$sqlFile = __DIR__ . '/../DB/migrations/043_create_config_table.sql';
$sql = file_get_contents($sqlFile);

$host = getenv('database.default.hostname') ?: '127.0.0.1';
$db   = getenv('database.default.database') ?: 'nexfile';
$user = getenv('database.default.username') ?: 'root';
$pass = getenv('database.default.password') ?: '';

try {
    $pdo = new PDO("mysql:host={$host};dbname={$db};charset=utf8mb4", $user, $pass);
    $pdo->exec($sql);
    echo "Migración 043 ejecutada correctamente. Tabla config creada con claves de Backblaze, Orders API y document_types.\n";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
