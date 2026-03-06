<?php
/**
 * Corrige columnas Id -> id (sin redefinir PRIMARY KEY)
 * Ejecutar: php scripts/fix_id_columns.php
 */

$host = '74.208.78.55';
$port = 3306;
$db   = 'nexfile';
$user = 'remote_nexus_q_techs';
$pass = '00@Nexus@?@';

$conn = new mysqli($host, $user, $pass, $db, $port);
if ($conn->connect_error) die("Error: " . $conn->connect_error);
$conn->set_charset('utf8mb4');

// CHANGE sin PRIMARY KEY - la columna conserva su rol de PK
$tables = [
    'user' => 'BIGINT NOT NULL',
    'agency' => 'BIGINT NOT NULL',
    'process' => 'BIGINT NOT NULL',
    'document_type' => 'BIGINT NOT NULL',
    'user_role' => 'BIGINT NOT NULL',
    'configuration_process' => 'BIGINT NOT NULL',
    'company' => 'INT NOT NULL AUTO_INCREMENT',
    'customer_type' => 'BIGINT NOT NULL',
    'operation_type' => 'BIGINT NOT NULL',
    'activity_log' => 'INT NOT NULL',
    'client' => 'BIGINT NOT NULL',
    'client_dms_relation' => 'INT NOT NULL',
    'client_header' => 'BIGINT NOT NULL',
    'expedient' => 'BIGINT NOT NULL',
    'file_document' => 'BIGINT NOT NULL',
    'file_exception_reason' => 'INT NOT NULL',
    'file_reasons' => 'INT NOT NULL',
    'file_sub_status' => 'BIGINT NOT NULL',
    'file_share_token' => 'BIGINT NOT NULL',
    'user_refresh_token' => 'INT UNSIGNED NOT NULL',
];

foreach ($tables as $table => $type) {
    $sql = "ALTER TABLE `$table` CHANGE COLUMN `Id` `id` $type";
    if ($conn->query($sql)) {
        echo "OK: $table.Id -> id\n";
    } else {
        echo "SKIP $table: " . $conn->error . "\n";
    }
}

$conn->close();
echo "Listo.\n";
