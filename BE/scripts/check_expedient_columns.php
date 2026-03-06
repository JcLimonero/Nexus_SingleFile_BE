<?php
$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

$mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);

$result = $mysqli->query('SHOW COLUMNS FROM expedient');
echo "Columnas en tabla expedient:\n";
echo str_repeat("=", 60) . "\n";
while($row = $result->fetch_assoc()) {
    echo sprintf("%-30s %-20s\n", $row['Field'], $row['Type']);
}

$mysqli->close();
