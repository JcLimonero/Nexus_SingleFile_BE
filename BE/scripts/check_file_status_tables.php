<?php
/**
 * Verificar estructura de file_status y file_sub_status
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== VERIFICAR ESTRUCTURA DE FILE_STATUS Y FILE_SUB_STATUS ===\n\n";

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

try {
    $mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);
    
    if ($mysqli->connect_error) {
        die("❌ Error de conexión: " . $mysqli->connect_error . "\n");
    }
    
    echo "✅ Conectado a la base de datos\n\n";
    
    // Ver estructura de file_status
    echo "📋 ESTRUCTURA DE 'file_status':\n";
    echo str_repeat("=", 80) . "\n";
    $result = $mysqli->query("DESCRIBE file_status");
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
    
    // Ver datos de file_status
    echo "📊 DATOS EN 'file_status':\n";
    echo str_repeat("=", 80) . "\n";
    $statuses = $mysqli->query("SELECT Id, Name FROM file_status ORDER BY Id");
    if ($statuses && $statuses->num_rows > 0) {
        echo sprintf("%-5s %-50s\n", "ID", "Nombre");
        echo str_repeat("-", 55) . "\n";
        while ($status = $statuses->fetch_assoc()) {
            echo sprintf("%-5s %-50s\n", $status['Id'], $status['Name']);
        }
    } else {
        echo "No hay estados registrados\n";
    }
    
    echo "\n";
    
    // Ver estructura de file_sub_status
    echo "📋 ESTRUCTURA DE 'file_sub_status':\n";
    echo str_repeat("=", 80) . "\n";
    $result = $mysqli->query("DESCRIBE file_sub_status");
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
    
    // Ver datos de file_sub_status
    echo "📊 DATOS EN 'file_sub_status':\n";
    echo str_repeat("=", 80) . "\n";
    $subStatuses = $mysqli->query("SELECT Id, Name FROM file_sub_status ORDER BY Id");
    if ($subStatuses && $subStatuses->num_rows > 0) {
        echo sprintf("%-5s %-50s\n", "ID", "Nombre");
        echo str_repeat("-", 55) . "\n";
        while ($subStatus = $subStatuses->fetch_assoc()) {
            echo sprintf("%-5s %-50s\n", $subStatus['Id'], $subStatus['Name']);
        }
    } else {
        echo "No hay sub-estados registrados\n";
    }
    
    echo "\n";
    
    // Verificar foreign keys existentes
    echo "🔗 FOREIGN KEYS EN 'file_sub_status':\n";
    echo str_repeat("=", 80) . "\n";
    $fks = $mysqli->query("
        SELECT 
            CONSTRAINT_NAME,
            COLUMN_NAME,
            REFERENCED_TABLE_NAME,
            REFERENCED_COLUMN_NAME
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = '{$db['database']}'
        AND TABLE_NAME = 'file_sub_status'
        AND REFERENCED_TABLE_NAME IS NOT NULL
    ");
    
    if ($fks && $fks->num_rows > 0) {
        while ($fk = $fks->fetch_assoc()) {
            echo sprintf("Constraint: %s\n", $fk['CONSTRAINT_NAME']);
            echo sprintf("  Columna: %s\n", $fk['COLUMN_NAME']);
            echo sprintf("  Referencia: %s.%s\n", $fk['REFERENCED_TABLE_NAME'], $fk['REFERENCED_COLUMN_NAME']);
            echo "\n";
        }
    } else {
        echo "No hay foreign keys definidas\n";
    }
    
    $mysqli->close();
    
    echo "✅ Verificación completada\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
