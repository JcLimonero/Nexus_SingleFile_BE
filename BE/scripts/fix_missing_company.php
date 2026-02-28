<?php
/**
 * Crear la company faltante (ID 17)
 */

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

$mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);

if ($mysqli->connect_error) {
    die("❌ Error: " . $mysqli->connect_error . "\n");
}

echo "=== CREAR COMPANY FALTANTE ===\n\n";

// Crear Company 17
$insertQuery = $mysqli->prepare("INSERT INTO company (Id, name) VALUES (17, 'Company Romeo') ON DUPLICATE KEY UPDATE name = 'Company Romeo'");
if ($insertQuery->execute()) {
    echo "✅ Company ID 17: 'Company Romeo' creada\n";
} else {
    echo "⚠️  Company ID 17: " . $insertQuery->error . "\n";
}
$insertQuery->close();

// Verificar todas las companies
echo "\n📋 TODAS LAS COMPANIES:\n";
echo str_repeat("=", 60) . "\n";
$result = $mysqli->query("SELECT Id, name FROM company ORDER BY Id");
$total = 0;
while ($row = $result->fetch_assoc()) {
    echo "ID {$row['Id']}: {$row['name']}\n";
    $total++;
}
echo "\nTotal: $total companies\n";

$mysqli->close();
