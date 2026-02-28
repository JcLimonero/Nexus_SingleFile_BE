<?php
/**
 * Script de verificación de migración
 */

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

$mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);

$result = $mysqli->query('SHOW TABLES');
$tables = [];
while($row = $result->fetch_array()) {
    $tables[] = $row[0];
}

echo "Tablas renombradas verificadas:\n";
foreach(['expedient', 'order', 'file_document', 'client_header', 'client_dms_relation', 'file_exception_reason'] as $t) {
    echo (in_array($t, $tables) ? '✅' : '❌') . ' ' . $t . "\n";
}

$mysqli->close();
