<?php
/**
 * Ejecuta la migración 039 - Convierte tabla order a snake_case
 * Ejecutar: php scripts/run_migration_039.php
 * Desde el directorio BE: php scripts/run_migration_039.php
 */

// Cargar configuración de CodeIgniter
chdir(__DIR__ . '/..');
if (!file_exists('app/Config/Database.php')) {
    die("Error: Ejecutar desde el directorio BE o verificar rutas.\n");
}

// Cargar .env si existe
if (file_exists('.env')) {
    $env = parse_ini_file('.env');
    $host = $env['database.default.hostname'] ?? '127.0.0.1';
    $port = $env['database.default.port'] ?? 3306;
    $db   = $env['database.default.database'] ?? 'nexfile';
    $user = $env['database.default.username'] ?? 'root';
    $pass = $env['database.default.password'] ?? '';
} else {
    $host = '127.0.0.1';
    $port = 3306;
    $db   = 'nexfile';
    $user = 'root';
    $pass = '';
}

echo "=== Migración 039: Tabla order → snake_case ===\n";
echo "DB: $db @ $host\n\n";

$conn = new mysqli($host, $user, $pass, $db, $port);
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error . "\n");
}
$conn->set_charset('utf8mb4');

$statements = [
    "SET FOREIGN_KEY_CHECKS = 0",
    "ALTER TABLE `order` CHANGE COLUMN `Id` `id` BIGINT NOT NULL PRIMARY KEY",
    "ALTER TABLE `order` CHANGE COLUMN `Number` `number` VARCHAR(50)",
    "ALTER TABLE `order` CHANGE COLUMN `CarType` `car_type` VARCHAR(200)",
    "ALTER TABLE `order` CHANGE COLUMN `Year` `year` INT DEFAULT 0",
    "ALTER TABLE `order` CHANGE COLUMN `VIN` `vin` VARCHAR(50)",
    "ALTER TABLE `order` CHANGE COLUMN `RegistrationDate` `registration_date` TIMESTAMP NULL",
    "ALTER TABLE `order` CHANGE COLUMN `UpdateDate` `update_date` TIMESTAMP NULL",
    "ALTER TABLE `order` CHANGE COLUMN `IdLastUserUpdate` `id_last_user_update` BIGINT DEFAULT 0",
    "ALTER TABLE `order` CHANGE COLUMN `Enabled` `enabled` TINYINT(1) DEFAULT 1",
    "ALTER TABLE `order` CHANGE COLUMN `Model` `model` VARCHAR(200)",
    "ALTER TABLE `order` CHANGE COLUMN `Advisor` `advisor` VARCHAR(200)",
    "ALTER TABLE `order` CHANGE COLUMN `IdDMS` `id_dms` VARCHAR(50)",
    "ALTER TABLE `order` CHANGE COLUMN `idAgency` `id_agency` VARCHAR(100)",
    "SET FOREIGN_KEY_CHECKS = 1",
];

$ok = 0;
$fail = 0;
foreach ($statements as $sql) {
    if ($conn->query($sql)) {
        echo "OK: " . substr($sql, 0, 70) . "...\n";
        $ok++;
    } else {
        echo "ERROR (" . $conn->error . "): " . substr($sql, 0, 50) . "...\n";
        $fail++;
    }
}

$conn->close();

echo "\n=== Resumen: $ok aplicadas, $fail omitidas ===\n";
if ($fail > 0) {
    exit(1);
}
echo "✅ Migración 039 completada.\n";
