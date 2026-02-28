<?php
/**
 * Verificar estructura de tablas problemáticas
 */

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

$mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);

echo "=== ESTRUCTURA DE TABLAS PROBLEMÁTICAS ===\n\n";

// file_sub_status
echo "📋 file_sub_status:\n";
$result = $mysqli->query("DESCRIBE file_sub_status");
while ($row = $result->fetch_assoc()) {
    echo "  - {$row['Field']} ({$row['Type']})\n";
}

echo "\n";

// files_to_correct
echo "📋 files_to_correct:\n";
$result = $mysqli->query("DESCRIBE files_to_correct");
while ($row = $result->fetch_assoc()) {
    echo "  - {$row['Field']} ({$row['Type']})\n";
}

$mysqli->close();
