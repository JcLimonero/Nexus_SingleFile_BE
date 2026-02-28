<?php
/**
 * Verificar estructura de tablas agency y company
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== VERIFICAR ESTRUCTURA DE AGENCY Y COMPANY ===\n\n";

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
    
    // Ver estructura de agency
    echo "📋 ESTRUCTURA DE 'agency':\n";
    echo str_repeat("=", 80) . "\n";
    $result = $mysqli->query("DESCRIBE agency");
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
    
    // Ver estructura de company
    echo "📋 ESTRUCTURA DE 'company':\n";
    echo str_repeat("=", 80) . "\n";
    $result = $mysqli->query("DESCRIBE company");
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
    
    $mysqli->close();
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
