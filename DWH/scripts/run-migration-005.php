#!/usr/bin/env php
<?php
/**
 * Ejecuta la migración 005 (quitar columna chassis de nexfile_orders)
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
    'dwh',
    $db['port'] ?? 3306
);

if ($mysqli->connect_error) {
    fwrite(STDERR, "Error de conexión: " . $mysqli->connect_error . "\n");
    exit(1);
}
$mysqli->set_charset($db['charset'] ?? 'utf8mb4');

$r = $mysqli->query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'dwh' AND TABLE_NAME = 'nexfile_orders' AND COLUMN_NAME = 'chassis'");
if ($r && $r->fetch_assoc()) {
    if ($mysqli->query("ALTER TABLE nexfile_orders DROP COLUMN chassis")) {
        echo "Columna chassis eliminada.\n";
    } else {
        fwrite(STDERR, "Error: " . $mysqli->error . "\n");
        exit(1);
    }
} else {
    echo "Columna chassis no existe, omitiendo.\n";
}

// Asegurar que inventory acepte 10 dígitos
if ($mysqli->query("ALTER TABLE nexfile_orders MODIFY COLUMN inventory VARCHAR(15)")) {
    echo "Columna inventory ajustada a VARCHAR(15).\n";
} else {
    echo "Nota: " . $mysqli->error . "\n";
}

$mysqli->close();
echo "Migración 005 completada.\n";
