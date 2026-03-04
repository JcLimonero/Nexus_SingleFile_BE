<?php
/**
 * Corregir AUTO_INCREMENT en file_share_token
 * Error: Duplicate entry '0' for key 'file_share_token.PRIMARY'
 *
 * Ejecutar desde la raíz del proyecto BE:
 *   php scripts/fix_file_share_token_auto_increment.php
 *
 * Usa variables de entorno o .env (hostname, database, username, password)
 */
$baseDir = dirname(__DIR__);
chdir($baseDir);

// Cargar .env si existe
if (file_exists($baseDir . '/.env')) {
    $lines = file($baseDir . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (preg_match('/^([^=]+)=(.*)$/', $line, $m)) {
            putenv(trim($m[1]) . '=' . trim($m[2], " \t\n\r\0\x0B\"'"));
        }
    }
}

$host = getenv('database.default.hostname') ?: '127.0.0.1';
$name = getenv('database.default.database') ?: 'single_file';
$user = getenv('database.default.username') ?: 'root';
$pass = getenv('database.default.password') ?: 'root';
$port = (int) (getenv('database.default.port') ?: 3306);

$conn = new mysqli($host, $user, $pass, $name, $port);
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error . "\n");
}
$conn->set_charset('utf8mb4');

echo "Conectado a: $name@$host\n";

$sql = "ALTER TABLE `file_share_token` MODIFY COLUMN `id` BIGINT NOT NULL AUTO_INCREMENT";
if ($conn->query($sql)) {
    echo "OK: AUTO_INCREMENT agregado a file_share_token.id\n";
} else {
    echo "Error: " . $conn->error . "\n";
    exit(1);
}
