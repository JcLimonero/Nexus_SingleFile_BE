<?php
/**
 * Diagnóstico: verificar qué tablas de cliente existen en la BD
 * Ejecutar: php scripts/check_client_tables.php
 */
$envPath = __DIR__ . '/../.env';
if (file_exists($envPath)) {
    foreach (file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (strpos(trim($line), '#') === 0 || strpos($line, '=') === false) continue;
        list($k, $v) = explode('=', $line, 2);
        $k = trim($k); $v = trim($v, " \t\n\r\0\x0B\"'");
        if (!getenv($k)) putenv("$k=$v");
    }
}
$host = getenv('database.default.hostname') ?: getenv('DB_HOST') ?: '127.0.0.1';
$db   = getenv('database.default.database') ?: getenv('DB_DATABASE') ?: 'nexfile';
$user = getenv('database.default.username') ?: getenv('DB_USERNAME') ?: 'root';
$pass = getenv('database.default.password') ?: getenv('DB_PASSWORD') ?: '';

try {
    $pdo = new PDO("mysql:host={$host};dbname={$db};charset=utf8mb4", $user, $pass);
} catch (PDOException $e) {
    echo "Error conexión: " . $e->getMessage() . "\n";
    exit(1);
}

$tables = ['client', 'client_header', 'client_dms_relation', 'client_total_relation'];

echo "=== Tablas existentes ===\n";
$stmt = $pdo->query("SHOW TABLES");
$existing = [];
while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
    $existing[] = $row[0];
}
foreach ($tables as $t) {
    $found = in_array($t, $existing) ? '✓' : ' ';
    echo "  [{$found}] {$t}\n";
}

echo "\n=== Columnas de tabla client ===\n";
$t = in_array('client', $existing) ? 'client' : null;
if ($t) {
    $stmt = $pdo->query("DESCRIBE `{$t}`");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) echo "  " . $row['Field'] . "\n";
} else echo "  (no existe client/Client)\n";

echo "\n=== Columnas de client_dms_relation o client_total_relation ===\n";
$tr = in_array('client_dms_relation', $existing) ? 'client_dms_relation' : 
      (in_array('client_total_relation', $existing) ? 'client_total_relation' : null);
if ($tr) {
    $stmt = $pdo->query("DESCRIBE `{$tr}`");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) echo "  " . $row['Field'] . "\n";
} else echo "  (no existe)\n";
