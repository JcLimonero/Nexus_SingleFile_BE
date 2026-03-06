<?php
/**
 * Verificar estructura de document_file_status
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== VERIFICAR ESTRUCTURA DE DOCUMENT_FILE_STATUS ===\n\n";

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
    echo "📋 ESTRUCTURA DE 'document_file_status':\n";
    echo str_repeat("=", 80) . "\n";
    $result = $mysqli->query("DESCRIBE document_file_status");
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
    
    // Ver estados actuales
    echo "📊 ESTADOS ACTUALES:\n";
    echo str_repeat("=", 80) . "\n";
    $statuses = $mysqli->query("SELECT * FROM document_file_status ORDER BY Id");
    if ($statuses && $statuses->num_rows > 0) {
        echo sprintf("%-5s %-50s %-10s\n", "ID", "Nombre", "Enabled");
        echo str_repeat("-", 65) . "\n";
        while ($status = $statuses->fetch_assoc()) {
            echo sprintf("%-5s %-50s %-10s\n", 
                $status['Id'], 
                $status['Name'] ?? $status['Description'] ?? 'N/A',
                $status['Enabled'] ?? 'N/A'
            );
        }
    } else {
        echo "No hay estados registrados\n";
    }
    
    $mysqli->close();
    
    echo "\n✅ Verificación completada\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
