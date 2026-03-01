<?php
/**
 * Ejecuta la migración 041: vista view_client_company_amount_6m
 */
$sqlFile = __DIR__ . '/../DB/migrations/041_view_client_company_amount_6m.sql';
$sql = file_get_contents($sqlFile);

// Usar .env o variables de entorno para conexión
$host = getenv('database.default.hostname') ?: '127.0.0.1';
$db   = getenv('database.default.database') ?: 'nexfile';
$user = getenv('database.default.username') ?: 'root';
$pass = getenv('database.default.password') ?: '';

try {
    $pdo = new PDO("mysql:host={$host};dbname={$db};charset=utf8mb4", $user, $pass);
    $pdo->exec($sql);
    echo "Migración 041 ejecutada correctamente. Vista view_client_company_amount_6m creada.\n";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
