<?php
/**
 * Verificar estructura de file_reasons
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== VERIFICAR ESTRUCTURA DE FILE_REASONS ===\n\n";

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

echo "Base de datos: {$db['database']}\n";
echo "Host: {$db['hostname']}\n\n";

try {
    $mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);
    
    if ($mysqli->connect_error) {
        die("❌ Error de conexión: " . $mysqli->connect_error . "\n");
    }
    
    echo "✅ Conectado a la base de datos\n\n";
    
    // Ver estructura de la tabla
    echo "📋 ESTRUCTURA DE 'file_reasons':\n";
    echo str_repeat("=", 80) . "\n";
    $result = $mysqli->query("DESCRIBE file_reasons");
    if ($result) {
        echo sprintf("%-25s %-20s %-10s %-10s %-15s\n", "Campo", "Tipo", "Null", "Key", "Default");
        echo str_repeat("-", 80) . "\n";
        while ($row = $result->fetch_assoc()) {
            echo sprintf("%-25s %-20s %-10s %-10s %-15s\n", 
                $row['Field'], 
                $row['Type'], 
                $row['Null'], 
                $row['Key'], 
                $row['Default'] ?? 'NULL'
            );
        }
    }
    
    echo "\n";
    
    // Ver motivos actuales
    echo "📊 MOTIVOS ACTUALES:\n";
    echo str_repeat("=", 80) . "\n";
    $reasons = $mysqli->query("SELECT * FROM file_reasons ORDER BY Id");
    if ($reasons && $reasons->num_rows > 0) {
        echo sprintf("%-5s %-60s %-10s\n", "ID", "Nombre", "Enabled");
        echo str_repeat("-", 75) . "\n";
        while ($reason = $reasons->fetch_assoc()) {
            echo sprintf("%-5s %-60s %-10s\n", 
                $reason['Id'], 
                $reason['Name'] ?? $reason['Description'] ?? 'N/A',
                $reason['Enabled'] ?? 'N/A'
            );
        }
    } else {
        echo "No hay motivos registrados\n";
    }
    
    $mysqli->close();
    
    echo "\n✅ Verificación completada\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
