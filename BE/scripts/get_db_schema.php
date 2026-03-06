<?php
/**
 * Script para obtener la estructura real de la base de datos
 * Ejecutar: php scripts/get_db_schema.php
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

$output = [];
$output[] = "=== ESTRUCTURA DE LA BASE DE DATOS NEXFILE ===\n";

// Obtener todas las tablas
$tables = [];
$result = $conn->query("SHOW TABLES");
while ($row = $result->fetch_row()) {
    $tables[] = $row[0];
}

foreach ($tables as $table) {
    $output[] = "\n--- Tabla: $table ---";
    
    $result = $conn->query("DESCRIBE `$table`");
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $output[] = "  " . $row['Field'] . " | " . $row['Type'] . " | " . $row['Null'] . " | " . $row['Key'] . " | " . ($row['Default'] ?? 'NULL') . " | " . $row['Extra'];
        }
    }
}

$conn->close();

$schema = implode("\n", $output);
file_put_contents(__DIR__ . '/../DB_SCHEMA_ACTUAL.txt', $schema);
echo $schema;
echo "\n\nSchema guardado en BE/DB_SCHEMA_ACTUAL.txt\n";
