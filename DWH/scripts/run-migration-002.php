#!/usr/bin/env php
<?php
/**
 * Ejecuta la migración 002 (convertir columnas de nexfile_customers a VARCHAR)
 * Requerido para que anonymize-nexfile-customers.php pueda guardar datos de texto
 *
 * Uso: php scripts/run-migration-002.php
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

$alters = [
    "ALTER TABLE nexfile_customers MODIFY COLUMN bussines_name VARCHAR(200)",
    "ALTER TABLE nexfile_customers MODIFY COLUMN name VARCHAR(100)",
    "ALTER TABLE nexfile_customers MODIFY COLUMN paternal_surname VARCHAR(100)",
    "ALTER TABLE nexfile_customers MODIFY COLUMN maternal_surname VARCHAR(100)",
    "ALTER TABLE nexfile_customers MODIFY COLUMN rfc VARCHAR(20)",
    "ALTER TABLE nexfile_customers MODIFY COLUMN curp VARCHAR(20)",
    "ALTER TABLE nexfile_customers MODIFY COLUMN phone VARCHAR(20)",
    "ALTER TABLE nexfile_customers MODIFY COLUMN mobile_phone VARCHAR(20)",
    "ALTER TABLE nexfile_customers MODIFY COLUMN mail VARCHAR(150)",
];

foreach ($alters as $sql) {
    if ($mysqli->query($sql)) {
        echo "OK: " . preg_replace('/.*COLUMN (\w+).*/', '$1', $sql) . "\n";
    } else {
        fwrite(STDERR, "Error: " . $mysqli->error . "\n");
        exit(1);
    }
}

$mysqli->close();
echo "Migración 002 completada. Ejecutar: php scripts/anonymize-nexfile-customers.php\n";
