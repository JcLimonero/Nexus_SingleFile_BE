<?php
/**
 * Verificar estructura de tablas user, agency_user, process_user
 */

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

$mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);

if ($mysqli->connect_error) {
    die("❌ Error: " . $mysqli->connect_error . "\n");
}

echo "=== ESTRUCTURA DE TABLAS DE USUARIO ===\n\n";

// Estructura de user
echo "📋 TABLA user:\n";
echo str_repeat("=", 60) . "\n";
$result = $mysqli->query("DESCRIBE user");
while ($row = $result->fetch_assoc()) {
    echo sprintf("%-25s %-20s %-10s\n", $row['Field'], $row['Type'], $row['Null']);
}

// Estructura de agency_user
echo "\n📋 TABLA agency_user:\n";
echo str_repeat("=", 60) . "\n";
$result = $mysqli->query("DESCRIBE agency_user");
while ($row = $result->fetch_assoc()) {
    echo sprintf("%-25s %-20s %-10s\n", $row['Field'], $row['Type'], $row['Null']);
}

// Estructura de process_user
echo "\n📋 TABLA process_user:\n";
echo str_repeat("=", 60) . "\n";
$result = $mysqli->query("DESCRIBE process_user");
while ($row = $result->fetch_assoc()) {
    echo sprintf("%-25s %-20s %-10s\n", $row['Field'], $row['Type'], $row['Null']);
}

// Verificar roles disponibles
echo "\n📋 ROLES DISPONIBLES:\n";
echo str_repeat("=", 60) . "\n";
$result = $mysqli->query("SELECT Id, Name FROM user_role ORDER BY Id");
while ($row = $result->fetch_assoc()) {
    echo "ID {$row['Id']}: {$row['Name']}\n";
}

// Verificar agencias disponibles
echo "\n📋 AGENCIAS DISPONIBLES:\n";
echo str_repeat("=", 60) . "\n";
$result = $mysqli->query("SELECT Id, Name FROM agency ORDER BY Id");
while ($row = $result->fetch_assoc()) {
    echo "ID {$row['Id']}: {$row['Name']}\n";
}

// Verificar procesos disponibles
echo "\n📋 PROCESOS DISPONIBLES:\n";
echo str_repeat("=", 60) . "\n";
$result = $mysqli->query("SELECT Id, Name FROM process ORDER BY Id");
while ($row = $result->fetch_assoc()) {
    echo "ID {$row['Id']}: {$row['Name']}\n";
}

$mysqli->close();
