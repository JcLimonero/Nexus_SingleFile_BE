<?php
$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

$mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);
$result = $mysqli->query('SHOW COLUMNS FROM client_dms_relation');
echo "Columnas en client_dms_relation:\n";
while($row = $result->fetch_assoc()) {
    echo "  - " . $row['Field'] . "\n";
}
$mysqli->close();
