<?php
/**
 * Verificar emails actuales de usuarios
 */

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

$mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);

if ($mysqli->connect_error) {
    die("❌ Error: " . $mysqli->connect_error . "\n");
}

echo "=== EMAILS ACTUALES DE USUARIOS ===\n\n";

$result = $mysqli->query("SELECT Id, Name, Mail FROM user ORDER BY Id");
if ($result && $result->num_rows > 0) {
    echo "📋 USUARIOS Y SUS EMAILS:\n";
    echo str_repeat("=", 80) . "\n";
    while ($row = $result->fetch_assoc()) {
        echo sprintf("ID %2d: %-35s → %s\n", $row['Id'], $row['Name'], $row['Mail']);
    }
} else {
    echo "No hay usuarios en la base de datos\n";
}

$mysqli->close();
