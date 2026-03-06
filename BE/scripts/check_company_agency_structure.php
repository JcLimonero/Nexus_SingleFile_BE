<?php
/**
 * Verificar estructura de tablas company y agency
 */

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

$mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);

if ($mysqli->connect_error) {
    die("❌ Error: " . $mysqli->connect_error . "\n");
}

echo "=== ESTRUCTURA DE TABLAS ===\n\n";

// Estructura de company
echo "📋 TABLA company:\n";
echo str_repeat("=", 60) . "\n";
$result = $mysqli->query("DESCRIBE company");
while ($row = $result->fetch_assoc()) {
    echo sprintf("%-20s %-20s %-10s\n", $row['Field'], $row['Type'], $row['Null']);
}

// Estructura de agency
echo "\n📋 TABLA agency:\n";
echo str_repeat("=", 60) . "\n";
$result = $mysqli->query("DESCRIBE agency");
while ($row = $result->fetch_assoc()) {
    echo sprintf("%-20s %-20s %-10s\n", $row['Field'], $row['Type'], $row['Null']);
}

// Verificar datos existentes
echo "\n📊 DATOS EXISTENTES:\n";
echo str_repeat("=", 60) . "\n";
$result = $mysqli->query("SELECT COUNT(*) as total FROM company");
$row = $result->fetch_assoc();
echo "Companies existentes: " . $row['total'] . "\n";

$result = $mysqli->query("SELECT COUNT(*) as total FROM agency");
$row = $result->fetch_assoc();
echo "Agencies existentes: " . $row['total'] . "\n";

$mysqli->close();
