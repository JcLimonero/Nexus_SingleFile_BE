#!/usr/bin/env php
<?php
/**
 * Ejecuta la migración 013 (tabla api_providers para control de tokens)
 * Crea un proveedor por defecto "nexus-be" con token generado.
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

$sql = "CREATE TABLE IF NOT EXISTS api_providers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  provider_name VARCHAR(100) NOT NULL,
  provider_code VARCHAR(50) NOT NULL UNIQUE,
  token VARCHAR(255) NOT NULL,
  enabled TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_token (token(64)),
  INDEX idx_enabled (enabled)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

if (!$mysqli->query($sql)) {
    fwrite(STDERR, "Error creando tabla: " . $mysqli->error . "\n");
    exit(1);
}
echo "Tabla api_providers creada.\n";

$r = $mysqli->query("SELECT 1 FROM api_providers WHERE provider_code='nexus-be' LIMIT 1");
if ($r && $r->num_rows > 0) {
    echo "Proveedor nexus-be ya existe.\n";
} else {
    $token = bin2hex(random_bytes(32));
    $name = $mysqli->real_escape_string('Nexus Backend');
    $code = $mysqli->real_escape_string('nexus-be');
    $tokenEsc = $mysqli->real_escape_string($token);
    $mysqli->query("INSERT INTO api_providers (provider_name, provider_code, token, enabled) VALUES ('$name', '$code', '$tokenEsc', 1)");
    if ($mysqli->error) {
        fwrite(STDERR, "Error insertando: " . $mysqli->error . "\n");
        exit(1);
    }
    echo "Proveedor nexus-be creado.\n";
    echo "\nToken para configurar en el BE (NEXFILE_PROVIDER_TOKEN o tabla config):\n";
    echo $token . "\n\n";
}

$mysqli->close();
echo "Migración 013 ejecutada correctamente.\n";
