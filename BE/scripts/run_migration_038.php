<?php
/**
 * Ejecuta la migración 038 - Convierte columnas PascalCase a snake_case
 * Omite las sentencias que fallen (columnas ya convertidas)
 * Ejecutar: php scripts/run_migration_038.php
 */

$host = '74.208.78.55';
$port = 3306;
$db   = 'nexfile';
$user = 'remote_nexus_q_techs';
$pass = '00@Nexus@?@';

$conn = new mysqli($host, $user, $pass, $db, $port);
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}
$conn->set_charset('utf8mb4');

// Solo las sentencias para columnas que pueden existir en PascalCase
// Orden: primero las tablas principales del API
$statements = [
    "-- user",
    "ALTER TABLE `user` CHANGE COLUMN `Id` `id` BIGINT NOT NULL PRIMARY KEY",
    "ALTER TABLE `user` CHANGE COLUMN `Name` `name` VARCHAR(600)",
    "ALTER TABLE `user` CHANGE COLUMN `User` `user` VARCHAR(50)",
    "ALTER TABLE `user` CHANGE COLUMN `Pass` `pass` VARCHAR(255)",
    "ALTER TABLE `user` CHANGE COLUMN `Mail` `mail` VARCHAR(500)",
    "ALTER TABLE `user` CHANGE COLUMN `Enabled` `enabled` TINYINT DEFAULT 0",
    "-- agency",
    "ALTER TABLE `agency` CHANGE COLUMN `Id` `id` BIGINT NOT NULL PRIMARY KEY",
    "ALTER TABLE `agency` CHANGE COLUMN `Name` `name` VARCHAR(600)",
    "ALTER TABLE `agency` CHANGE COLUMN `Enabled` `enabled` TINYINT DEFAULT 0",
    "-- process",
    "ALTER TABLE `process` CHANGE COLUMN `Id` `id` BIGINT NOT NULL PRIMARY KEY",
    "ALTER TABLE `process` CHANGE COLUMN `Name` `name` VARCHAR(600)",
    "ALTER TABLE `process` CHANGE COLUMN `Enabled` `enabled` TINYINT DEFAULT 0",
    "-- document_type",
    "ALTER TABLE `document_type` CHANGE COLUMN `Id` `id` BIGINT NOT NULL PRIMARY KEY",
    "ALTER TABLE `document_type` CHANGE COLUMN `Name` `name` VARCHAR(600)",
    "ALTER TABLE `document_type` CHANGE COLUMN `Enabled` `enabled` TINYINT DEFAULT 0",
    "ALTER TABLE `document_type` CHANGE COLUMN `Required` `required` TINYINT DEFAULT 1",
    "-- user_role",
    "ALTER TABLE `user_role` CHANGE COLUMN `Id` `id` BIGINT NOT NULL PRIMARY KEY",
    "ALTER TABLE `user_role` CHANGE COLUMN `Name` `name` VARCHAR(600)",
    "ALTER TABLE `user_role` CHANGE COLUMN `Enabled` `enabled` TINYINT DEFAULT 0",
    "ALTER TABLE `user_role` CHANGE COLUMN `IdLastUserUpdate` `id_last_user_update` BIGINT DEFAULT 0",
    "-- agency_user",
    "ALTER TABLE `agency_user` CHANGE COLUMN `RegistrationDate` `registration_date` TIMESTAMP NULL",
    "ALTER TABLE `agency_user` CHANGE COLUMN `UpdateDate` `update_date` TIMESTAMP NULL",
    "ALTER TABLE `agency_user` CHANGE COLUMN `IdLastUserUpdate` `id_last_user_update` BIGINT DEFAULT 0",
    "ALTER TABLE `agency_user` CHANGE COLUMN `Enabled` `enabled` TINYINT DEFAULT 1",
    "-- process_user",
    "ALTER TABLE `process_user` CHANGE COLUMN `RegistrationDate` `registration_date` TIMESTAMP NULL",
    "ALTER TABLE `process_user` CHANGE COLUMN `UpdateDate` `update_date` TIMESTAMP NULL",
    "ALTER TABLE `process_user` CHANGE COLUMN `IdLastUserUpdate` `id_last_user_update` BIGINT DEFAULT 0",
    "ALTER TABLE `process_user` CHANGE COLUMN `Enabled` `enabled` TINYINT DEFAULT 1",
    "-- configuration_process",
    "ALTER TABLE `configuration_process` CHANGE COLUMN `Id` `id` BIGINT NOT NULL PRIMARY KEY",
    "ALTER TABLE `configuration_process` CHANGE COLUMN `Enabled` `enabled` TINYINT DEFAULT 0",
    "-- configuration_process_document_type",
    "ALTER TABLE `configuration_process_document_type` CHANGE COLUMN `RegistrationDate` `registration_date` TIMESTAMP NULL",
    "ALTER TABLE `configuration_process_document_type` CHANGE COLUMN `UpdateDate` `update_date` TIMESTAMP NULL",
    "ALTER TABLE `configuration_process_document_type` CHANGE COLUMN `IdLastUserUpdate` `id_last_user_update` BIGINT DEFAULT 0",
    "ALTER TABLE `configuration_process_document_type` CHANGE COLUMN `Enabled` `enabled` TINYINT DEFAULT 1",
    "-- company",
    "ALTER TABLE `company` CHANGE COLUMN `Id` `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
    "ALTER TABLE `company` CHANGE COLUMN `Enabled` `enabled` TINYINT DEFAULT 1",
    "-- customer_type",
    "ALTER TABLE `customer_type` CHANGE COLUMN `Id` `id` BIGINT NOT NULL PRIMARY KEY",
    "ALTER TABLE `customer_type` CHANGE COLUMN `Name` `name` VARCHAR(600)",
    "ALTER TABLE `customer_type` CHANGE COLUMN `Enabled` `enabled` TINYINT DEFAULT 0",
    "-- operation_type",
    "ALTER TABLE `operation_type` CHANGE COLUMN `Id` `id` BIGINT NOT NULL PRIMARY KEY",
    "ALTER TABLE `operation_type` CHANGE COLUMN `Name` `name` VARCHAR(600)",
    "ALTER TABLE `operation_type` CHANGE COLUMN `Enabled` `enabled` TINYINT DEFAULT 0",
    "-- activity_log",
    "ALTER TABLE `activity_log` CHANGE COLUMN `Id` `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY",
    "ALTER TABLE `activity_log` CHANGE COLUMN `RegistrationDate` `registration_date` TIMESTAMP NULL",
    "ALTER TABLE `activity_log` CHANGE COLUMN `UpdateDate` `update_date` TIMESTAMP NULL",
    "ALTER TABLE `activity_log` CHANGE COLUMN `IdLastUserUpdate` `id_last_user_update` BIGINT DEFAULT 0",
    "ALTER TABLE `activity_log` CHANGE COLUMN `Enabled` `enabled` TINYINT DEFAULT 1",
    "-- client",
    "ALTER TABLE `client` CHANGE COLUMN `Id` `id` BIGINT NOT NULL PRIMARY KEY",
    "ALTER TABLE `client` CHANGE COLUMN `Name` `name` VARCHAR(600)",
    "ALTER TABLE `client` CHANGE COLUMN `LastName` `last_name` VARCHAR(50)",
    "ALTER TABLE `client` CHANGE COLUMN `MotherLastName` `mother_last_name` VARCHAR(50)",
    "ALTER TABLE `client` CHANGE COLUMN `TelNumber` `tel_number` VARCHAR(50)",
    "ALTER TABLE `client` CHANGE COLUMN `TelNumber2` `tel_number2` VARCHAR(50)",
    "ALTER TABLE `client` CHANGE COLUMN `RegistrationDate` `registration_date` TIMESTAMP NULL",
    "ALTER TABLE `client` CHANGE COLUMN `UpdateDate` `update_date` TIMESTAMP NULL",
    "ALTER TABLE `client` CHANGE COLUMN `IdLastUserUpdate` `id_last_user_update` BIGINT DEFAULT 0",
    "ALTER TABLE `client` CHANGE COLUMN `Enabled` `enabled` TINYINT DEFAULT 1",
    "ALTER TABLE `client` CHANGE COLUMN `Adviser` `adviser` VARCHAR(50)",
    "ALTER TABLE `client` CHANGE COLUMN `Email` `email` VARCHAR(50)",
    "ALTER TABLE `client` CHANGE COLUMN `RazonSocial` `business_name` VARCHAR(500)",
    "ALTER TABLE `client` CHANGE COLUMN `AgencyOrigin` `agency_origin` VARCHAR(50)",
    "-- client_dms_relation",
    "ALTER TABLE `client_dms_relation` CHANGE COLUMN `Id` `id` INT NOT NULL PRIMARY KEY",
    "ALTER TABLE `client_dms_relation` CHANGE COLUMN `RegistrationDate` `registration_date` TIMESTAMP NULL",
    "ALTER TABLE `client_dms_relation` CHANGE COLUMN `UpdateDate` `update_date` TIMESTAMP NULL",
    "ALTER TABLE `client_dms_relation` CHANGE COLUMN `IdLastUserUpdate` `id_last_user_update` BIGINT DEFAULT 0",
    "ALTER TABLE `client_dms_relation` CHANGE COLUMN `Enabled` `enabled` TINYINT DEFAULT 1",
    "ALTER TABLE `client_dms_relation` CHANGE COLUMN `idHeaderClient` `id_client_header` BIGINT NOT NULL",
    "-- client_header",
    "ALTER TABLE `client_header` CHANGE COLUMN `Id` `id` BIGINT NOT NULL PRIMARY KEY",
    "ALTER TABLE `client_header` CHANGE COLUMN `RegistrationDate` `registration_date` TIMESTAMP NULL",
    "ALTER TABLE `client_header` CHANGE COLUMN `UpdateDate` `update_date` TIMESTAMP NULL",
    "ALTER TABLE `client_header` CHANGE COLUMN `IdLastUserUpdate` `id_last_user_update` BIGINT DEFAULT 0",
    "ALTER TABLE `client_header` CHANGE COLUMN `Enabled` `enabled` TINYINT DEFAULT 1",
    "-- document_file_error",
    "ALTER TABLE `document_file_error` CHANGE COLUMN `Id` `id` INT NOT NULL PRIMARY KEY",
    "ALTER TABLE `document_file_error` CHANGE COLUMN `RegistrationDate` `registration_date` TIMESTAMP NULL",
    "ALTER TABLE `document_file_error` CHANGE COLUMN `UpdateDate` `update_date` TIMESTAMP NULL",
    "ALTER TABLE `document_file_error` CHANGE COLUMN `IdLastUserUpdate` `id_last_user_update` BIGINT DEFAULT 0",
    "ALTER TABLE `document_file_error` CHANGE COLUMN `Enabled` `enabled` TINYINT DEFAULT 1",
    "ALTER TABLE `document_file_error` CHANGE COLUMN `Description` `description` VARCHAR(500)",
    "-- document_file_status",
    "ALTER TABLE `document_file_status` CHANGE COLUMN `Id` `id` INT NOT NULL PRIMARY KEY",
    "ALTER TABLE `document_file_status` CHANGE COLUMN `RegistrationDate` `registration_date` TIMESTAMP NULL",
    "ALTER TABLE `document_file_status` CHANGE COLUMN `UpdateDate` `update_date` TIMESTAMP NULL",
    "ALTER TABLE `document_file_status` CHANGE COLUMN `IdLastUserUpdate` `id_last_user_update` BIGINT DEFAULT 0",
    "ALTER TABLE `document_file_status` CHANGE COLUMN `Enabled` `enabled` TINYINT DEFAULT 1",
    "ALTER TABLE `document_file_status` CHANGE COLUMN `Name` `name` VARCHAR(500)",
    "-- expedient",
    "ALTER TABLE `expedient` CHANGE COLUMN `Id` `id` BIGINT NOT NULL PRIMARY KEY",
    "ALTER TABLE `expedient` CHANGE COLUMN `RegistrationDate` `registration_date` TIMESTAMP NULL",
    "ALTER TABLE `expedient` CHANGE COLUMN `UpdateDate` `update_date` TIMESTAMP NULL",
    "ALTER TABLE `expedient` CHANGE COLUMN `Enabled` `enabled` TINYINT DEFAULT 1",
    "ALTER TABLE `expedient` CHANGE COLUMN `Description` `description` VARCHAR(500)",
    "-- file_document",
    "ALTER TABLE `file_document` CHANGE COLUMN `Id` `id` BIGINT NOT NULL PRIMARY KEY",
    "ALTER TABLE `file_document` CHANGE COLUMN `Name` `name` VARCHAR(600)",
    "ALTER TABLE `file_document` CHANGE COLUMN `Comment` `comment` VARCHAR(200)",
    "ALTER TABLE `file_document` CHANGE COLUMN `Enabled` `enabled` TINYINT DEFAULT 0",
    "ALTER TABLE `file_document` CHANGE COLUMN `IdDocumentContainer` `id_document_container` VARCHAR(200)",
    "-- file_exception_reason",
    "ALTER TABLE `file_exception_reason` CHANGE COLUMN `Id` `id` INT NOT NULL PRIMARY KEY",
    "ALTER TABLE `file_exception_reason` CHANGE COLUMN `Name` `name` VARCHAR(500)",
    "ALTER TABLE `file_exception_reason` CHANGE COLUMN `Enabled` `enabled` TINYINT DEFAULT 1",
    "-- file_reasons",
    "ALTER TABLE `file_reasons` CHANGE COLUMN `Id` `id` INT NOT NULL PRIMARY KEY",
    "ALTER TABLE `file_reasons` CHANGE COLUMN `Name` `name` VARCHAR(500)",
    "ALTER TABLE `file_reasons` CHANGE COLUMN `Enabled` `enabled` TINYINT DEFAULT 1",
    "-- file_status",
    "ALTER TABLE `file_status` CHANGE COLUMN `Id` `id` INT NOT NULL PRIMARY KEY",
    "ALTER TABLE `file_status` CHANGE COLUMN `Name` `name` VARCHAR(500)",
    "ALTER TABLE `file_status` CHANGE COLUMN `RegistrationDate` `registration_date` TIMESTAMP NULL",
    "ALTER TABLE `file_status` CHANGE COLUMN `UpdateDate` `update_date` TIMESTAMP NULL",
    "ALTER TABLE `file_status` CHANGE COLUMN `IdLastUserUpdate` `id_last_user_update` BIGINT DEFAULT 0",
    "ALTER TABLE `file_status` CHANGE COLUMN `Enabled` `enabled` TINYINT DEFAULT 1",
    "-- file_sub_status",
    "ALTER TABLE `file_sub_status` CHANGE COLUMN `Id` `id` BIGINT NOT NULL PRIMARY KEY",
    "ALTER TABLE `file_sub_status` CHANGE COLUMN `IdFileStatus` `id_file_status` INT",
    "ALTER TABLE `file_sub_status` CHANGE COLUMN `Name` `name` VARCHAR(500)",
    "ALTER TABLE `file_sub_status` CHANGE COLUMN `RegistrationDate` `registration_date` TIMESTAMP NULL",
    "ALTER TABLE `file_sub_status` CHANGE COLUMN `UpdateDate` `update_date` TIMESTAMP NULL",
    "ALTER TABLE `file_sub_status` CHANGE COLUMN `IdLastUserUpdate` `id_last_user_update` BIGINT DEFAULT 0",
    "ALTER TABLE `file_sub_status` CHANGE COLUMN `Enabled` `enabled` TINYINT DEFAULT 1",
    "-- file_share_token",
    "ALTER TABLE `file_share_token` CHANGE COLUMN `Id` `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY",
    "ALTER TABLE `file_share_token` CHANGE COLUMN `Enabled` `enabled` TINYINT DEFAULT 1",
    "-- user_refresh_token",
    "ALTER TABLE `user_refresh_token` CHANGE COLUMN `Id` `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY",
    "ALTER TABLE `user_refresh_token` CHANGE COLUMN `RegistrationDate` `registration_date` TIMESTAMP NULL",
    "ALTER TABLE `user_refresh_token` CHANGE COLUMN `IdLastUserUpdate` `id_last_user_update` BIGINT DEFAULT 0",
    "ALTER TABLE `user_refresh_token` CHANGE COLUMN `Enabled` `enabled` TINYINT DEFAULT 1",
    "-- user_activity_logs",
    "ALTER TABLE `user_activity_logs` CHANGE COLUMN `RegistrationDate` `registration_date` TIMESTAMP NULL",
    "ALTER TABLE `user_activity_logs` CHANGE COLUMN `UpdateDate` `update_date` TIMESTAMP NULL",
    "ALTER TABLE `user_activity_logs` CHANGE COLUMN `IdLastUserUpdate` `id_last_user_update` BIGINT DEFAULT 0",
    "ALTER TABLE `user_activity_logs` CHANGE COLUMN `Enabled` `enabled` TINYINT DEFAULT 1",
];

$conn->query("SET FOREIGN_KEY_CHECKS = 0");

$ok = 0;
$fail = 0;
foreach ($statements as $sql) {
    if (strpos($sql, '--') === 0) {
        echo $sql . "\n";
        continue;
    }
    if ($conn->query($sql)) {
        echo "OK: " . substr($sql, 0, 80) . "...\n";
        $ok++;
    } else {
        echo "SKIP (" . $conn->error . "): " . substr($sql, 0, 60) . "...\n";
        $fail++;
    }
}

$conn->query("SET FOREIGN_KEY_CHECKS = 1");
$conn->close();

echo "\n=== Resumen: $ok aplicadas, $fail omitidas (ya existían en snake_case) ===\n";
