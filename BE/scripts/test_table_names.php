<?php
/**
 * Script para probar acceso a tablas con diferentes capitalizaciones
 */

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

$mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);

if ($mysqli->connect_error) {
    die("Error: " . $mysqli->connect_error . "\n");
}

echo "=== Prueba de Acceso a Tablas ===\n\n";

// Probar diferentes variantes de nombres
$variants = [
    'CostumerType',
    'costumertype',
    'CUSTOMERTYPE',
    'customertype'
];

foreach ($variants as $variant) {
    echo "Probando: $variant\n";
    $result = $mysqli->query("SELECT COUNT(*) as count FROM `$variant` LIMIT 1");
    if ($result) {
        $row = $result->fetch_assoc();
        echo "  ✅ Acceso exitoso - Registros: {$row['count']}\n";
    } else {
        echo "  ❌ Error: " . $mysqli->error . "\n";
    }
    echo "\n";
}

// Verificar columnas de ConfigurationProcess
echo "--- Columnas de ConfigurationProcess ---\n";
$result = $mysqli->query("SHOW COLUMNS FROM ConfigurationProcess");
while ($row = $result->fetch_assoc()) {
    if (stripos($row['Field'], 'customer') !== false || stripos($row['Field'], 'costumer') !== false) {
        echo "  Encontrada: {$row['Field']}\n";
    }
}

$mysqli->close();
