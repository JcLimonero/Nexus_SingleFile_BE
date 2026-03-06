<?php
$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

$mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);

$result = $mysqli->query("SHOW TABLES LIKE '%ProcessDocument%'");
echo "Tablas ProcessDocument:\n";
while($row = $result->fetch_array()) {
    echo "  - {$row[0]}\n";
    $cols = $mysqli->query("SHOW COLUMNS FROM `{$row[0]}`");
    echo "    Columnas:\n";
    while($c = $cols->fetch_assoc()) {
        echo "      {$c['Field']} ({$c['Type']})\n";
    }
}
$mysqli->close();
