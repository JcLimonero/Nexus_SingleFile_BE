<?php
/**
 * Ejecuta la migración 052: actualizar vista view_client_company_amount_6m
 * Solo suma montos con método de pago "Depósito en efectivo" (id: 1)
 */
$sqlFile = __DIR__ . '/../DB/migrations/052_view_client_company_amount_6m_efectivo.sql';
$sql = file_get_contents($sqlFile);

$host = getenv('database.default.hostname') ?: '127.0.0.1';
$db   = getenv('database.default.database') ?: 'nexfile';
$user = getenv('database.default.username') ?: 'root';
$pass = getenv('database.default.password') ?: '';

try {
    $pdo = new PDO("mysql:host={$host};dbname={$db};charset=utf8mb4", $user, $pass);
    $pdo->exec($sql);
    echo "Migración 052 ejecutada correctamente. Vista view_client_company_amount_6m actualizada (solo depósito en efectivo).\n";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
