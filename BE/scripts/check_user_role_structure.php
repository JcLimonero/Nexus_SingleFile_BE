<?php
/**
 * Verificar estructura de la tabla user_role
 */

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

$mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);

if ($mysqli->connect_error) {
    die("❌ Error: " . $mysqli->connect_error . "\n");
}

echo "=== ESTRUCTURA DE LA TABLA user_role ===\n\n";

// Verificar estructura
$result = $mysqli->query("DESCRIBE user_role");
if ($result) {
    echo "📋 COLUMNAS:\n";
    echo str_repeat("=", 60) . "\n";
    while ($row = $result->fetch_assoc()) {
        echo sprintf("%-20s %-20s %-10s %-10s %s\n", 
            $row['Field'], 
            $row['Type'], 
            $row['Null'], 
            $row['Key'],
            $row['Default'] ?? 'NULL'
        );
    }
}

// Verificar datos existentes
echo "\n📊 DATOS EXISTENTES:\n";
echo str_repeat("=", 60) . "\n";
$result = $mysqli->query("SELECT * FROM user_role ORDER BY Id");
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        echo "ID: {$row['Id']}, Name: {$row['Name']}, Enabled: " . ($row['Enabled'] ?? 'N/A') . "\n";
    }
} else {
    echo "La tabla está vacía\n";
}

$mysqli->close();
