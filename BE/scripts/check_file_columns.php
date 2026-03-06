<?php
$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

$mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);

$result = $mysqli->query('SHOW COLUMNS FROM File');
echo "Columnas de File relacionadas con customer/costumer:\n";
while($row = $result->fetch_assoc()) {
    if(stripos($row['Field'], 'customer') !== false || stripos($row['Field'], 'costumer') !== false) {
        echo "  - {$row['Field']}\n";
    }
}
$mysqli->close();
