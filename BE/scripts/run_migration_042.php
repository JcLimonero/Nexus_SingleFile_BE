<?php
/**
 * Ejecuta la migración 042: tabla payment_method (métodos de pago)
 */
$sqlFile = __DIR__ . '/../DB/migrations/042_create_payment_method.sql';
$sql = file_get_contents($sqlFile);

$host = getenv('database.default.hostname') ?: '127.0.0.1';
$db   = getenv('database.default.database') ?: 'nexfile';
$user = getenv('database.default.username') ?: 'root';
$pass = getenv('database.default.password') ?: '';

try {
    $pdo = new PDO("mysql:host={$host};dbname={$db};charset=utf8mb4", $user, $pass);
    $pdo->exec($sql);
    echo "Migración 042 ejecutada correctamente. Tabla payment_method creada con 10 métodos de pago.\n";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
