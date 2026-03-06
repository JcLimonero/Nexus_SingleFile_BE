<?php
/**
 * Ejecuta la migración 044: corregir vista view_client_relations
 * Actualiza la vista para usar tablas/columnas en snake_case.
 */
$sqlFile = __DIR__ . '/../DB/migrations/044_fix_view_client_relations.sql';
$sql = file_get_contents($sqlFile);

// Cargar .env si existe (CodeIgniter)
$envPath = __DIR__ . '/../.env';
if (file_exists($envPath)) {
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (strpos($line, '=') !== false) {
            list($key, $val) = explode('=', $line, 2);
            $key = trim($key);
            $val = trim($val, " \t\n\r\0\x0B\"'");
            if (!getenv($key)) putenv("$key=$val");
        }
    }
}

$host = getenv('database.default.hostname') ?: getenv('DB_HOST') ?: '127.0.0.1';
$db   = getenv('database.default.database') ?: getenv('DB_DATABASE') ?: 'nexfile';
$user = getenv('database.default.username') ?: getenv('DB_USERNAME') ?: 'root';
$pass = getenv('database.default.password') ?: getenv('DB_PASSWORD') ?: '';

try {
    $pdo = new PDO("mysql:host={$host};dbname={$db};charset=utf8mb4", $user, $pass);
    $pdo->exec($sql);
    echo "Migración 044 ejecutada correctamente. Vista view_client_relations actualizada.\n";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
