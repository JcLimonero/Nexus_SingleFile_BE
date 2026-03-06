<?php
/**
 * Listar todas las tablas con sus nombres actuales
 */

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

$mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);

if ($mysqli->connect_error) {
    die("❌ Error: " . $mysqli->connect_error . "\n");
}

echo "=== LISTADO DE TODAS LAS TABLAS ===\n\n";

$result = $mysqli->query("SHOW TABLES");
$tables = [];
while ($row = $result->fetch_array()) {
    $tables[] = $row[0];
}

sort($tables);

foreach ($tables as $table) {
    echo "- $table\n";
}

echo "\nTotal: " . count($tables) . " tablas\n";

$mysqli->close();
