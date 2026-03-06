<?php
/**
 * Verificar estructura de documenttype (single_file) y document_type (nexfile)
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== VERIFICAR ESTRUCTURA DE TABLAS DOCUMENT TYPE ===\n\n";

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

echo "Base de datos origen: single_file\n";
echo "Base de datos destino: nexfile\n";
echo "Host: {$db['hostname']}\n\n";

try {
    $mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], '', $db['port']);
    
    if ($mysqli->connect_error) {
        die("❌ Error de conexión: " . $mysqli->connect_error . "\n");
    }
    
    echo "✅ Conectado al servidor\n\n";
    
    // Verificar estructura de documenttype en single_file
    echo "📋 ESTRUCTURA DE 'documenttype' EN 'single_file':\n";
    echo str_repeat("=", 80) . "\n";
    $mysqli->select_db('single_file');
    $result = $mysqli->query("DESCRIBE documenttype");
    if ($result) {
        echo sprintf("%-30s %-20s %-10s %-10s %-15s\n", "Campo", "Tipo", "Null", "Key", "Default");
        echo str_repeat("-", 85) . "\n";
        while ($row = $result->fetch_assoc()) {
            echo sprintf("%-30s %-20s %-10s %-10s %-15s\n", 
                $row['Field'], 
                $row['Type'], 
                $row['Null'], 
                $row['Key'], 
                $row['Default'] ?? 'NULL'
            );
        }
    }
    
    echo "\n";
    
    // Contar registros en documenttype
    $countResult = $mysqli->query("SELECT COUNT(*) as total FROM documenttype");
    $count = $countResult->fetch_assoc();
    echo "📊 Total de registros en 'documenttype': {$count['total']}\n\n";
    
    // Ver algunos registros de ejemplo
    echo "📋 EJEMPLOS DE REGISTROS EN 'documenttype':\n";
    echo str_repeat("=", 80) . "\n";
    $samples = $mysqli->query("SELECT * FROM documenttype LIMIT 5");
    if ($samples && $samples->num_rows > 0) {
        $firstRow = true;
        while ($row = $samples->fetch_assoc()) {
            if ($firstRow) {
                echo "Columnas: " . implode(', ', array_keys($row)) . "\n\n";
                $firstRow = false;
            }
            echo "ID: {$row['Id']}\n";
            foreach ($row as $key => $value) {
                if ($key !== 'Id') {
                    echo "  $key: " . ($value ?? 'NULL') . "\n";
                }
            }
            echo "\n";
        }
    }
    
    echo "\n";
    
    // Verificar estructura de document_type en nexfile
    echo "📋 ESTRUCTURA DE 'document_type' EN 'nexfile':\n";
    echo str_repeat("=", 80) . "\n";
    $mysqli->select_db('nexfile');
    $result = $mysqli->query("DESCRIBE document_type");
    if ($result) {
        echo sprintf("%-30s %-20s %-10s %-10s %-15s\n", "Campo", "Tipo", "Null", "Key", "Default");
        echo str_repeat("-", 85) . "\n";
        while ($row = $result->fetch_assoc()) {
            echo sprintf("%-30s %-20s %-10s %-10s %-15s\n", 
                $row['Field'], 
                $row['Type'], 
                $row['Null'], 
                $row['Key'], 
                $row['Default'] ?? 'NULL'
            );
        }
    }
    
    echo "\n";
    
    // Contar registros en document_type
    $countResult = $mysqli->query("SELECT COUNT(*) as total FROM document_type");
    $count = $countResult->fetch_assoc();
    echo "📊 Total de registros en 'document_type': {$count['total']}\n\n";
    
    // Ver algunos registros de ejemplo
    echo "📋 EJEMPLOS DE REGISTROS EN 'document_type':\n";
    echo str_repeat("=", 80) . "\n";
    $samples = $mysqli->query("SELECT * FROM document_type LIMIT 5");
    if ($samples && $samples->num_rows > 0) {
        $firstRow = true;
        while ($row = $samples->fetch_assoc()) {
            if ($firstRow) {
                echo "Columnas: " . implode(', ', array_keys($row)) . "\n\n";
                $firstRow = false;
            }
            echo "ID: {$row['Id']}\n";
            foreach ($row as $key => $value) {
                if ($key !== 'Id') {
                    echo "  $key: " . ($value ?? 'NULL') . "\n";
                }
            }
            echo "\n";
        }
    }
    
    $mysqli->close();
    
    echo "✅ Verificación completada\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
