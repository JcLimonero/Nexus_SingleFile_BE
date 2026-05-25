#!/usr/bin/env php
<?php
/**
 * Migración 009: client_type y homologación snake_case en nexfile_customers
 *
 * - Agrega columna client_type ('fisica' | 'moral') si no existe
 * - Renombra columnas camelCase a snake_case
 * - Asigna client_type: 'moral' si bussines_name tiene valor, 'fisica' si no
 *
 * Uso: php scripts/run-migration-009.php
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

function columnExists(mysqli $db, string $table, string $col): bool {
    $r = $db->query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'dwh' AND TABLE_NAME = '$table' AND COLUMN_NAME = '$col'");
    return $r && $r->fetch_assoc();
}

$renames = [
    ['razonSocial', 'bussines_name', 'VARCHAR(200)'],
    ['business_name', 'bussines_name', 'VARCHAR(200)'],
    ['nombre', 'name', 'VARCHAR(100)'],
    ['apellidoPaterno', 'paternal_surname', 'VARCHAR(100)'],
    ['last_name', 'paternal_surname', 'VARCHAR(100)'],
    ['apellidoMaterno', 'maternal_surname', 'VARCHAR(100)'],
    ['mother_last_name', 'maternal_surname', 'VARCHAR(100)'],
    ['telefono', 'phone', 'VARCHAR(20)'],
    ['telefono2', 'mobile_phone', 'VARCHAR(20)'],
    ['email', 'mail', 'VARCHAR(150)'],
];

// 1. Agregar client_type si no existe
if (!columnExists($mysqli, 'nexfile_customers', 'client_type')) {
    if ($mysqli->query("ALTER TABLE nexfile_customers ADD COLUMN client_type VARCHAR(10) DEFAULT NULL")) {
        echo "OK: Columna client_type agregada.\n";
    } else {
        fwrite(STDERR, "Error agregando client_type: " . $mysqli->error . "\n");
    }
} else {
    echo "Skip: client_type ya existe.\n";
}

// 2. Renombrar columnas camelCase a snake_case (solo si la vieja existe y la nueva no)
foreach ($renames as [$old, $new, $type]) {
    if (columnExists($mysqli, 'nexfile_customers', $old) && !columnExists($mysqli, 'nexfile_customers', $new)) {
        $oldEsc = $mysqli->real_escape_string($old);
        $newEsc = $mysqli->real_escape_string($new);
        if ($mysqli->query("ALTER TABLE nexfile_customers CHANGE COLUMN `$oldEsc` `$newEsc` $type")) {
            echo "OK: $old -> $new\n";
        } else {
            echo "Error $old: " . $mysqli->error . "\n";
        }
    }
}

// 3. Asignar client_type: 'moral' si bussines_name tiene valor, 'fisica' si no
$bussinesCol = columnExists($mysqli, 'nexfile_customers', 'bussines_name') ? 'bussines_name' : null;
if ($bussinesCol && columnExists($mysqli, 'nexfile_customers', 'client_type')) {
    $mysqli->query("UPDATE nexfile_customers SET client_type = CASE WHEN TRIM(COALESCE($bussinesCol, '')) != '' THEN 'moral' ELSE 'fisica' END WHERE client_type IS NULL OR client_type = ''");
    $affected = $mysqli->affected_rows;
    echo "OK: client_type asignado a $affected registros.\n";
}

$mysqli->close();
echo "Migración 009 completada.\n";
