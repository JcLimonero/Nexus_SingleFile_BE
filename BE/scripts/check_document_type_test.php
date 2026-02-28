<?php
/**
 * Verificar registros con "Test" en document_type
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== VERIFICAR REGISTROS CON 'TEST' EN DOCUMENT_TYPE ===\n\n";

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
    
    // Buscar registros con "Test" (case insensitive)
    echo "📋 REGISTROS QUE CONTIENEN 'TEST':\n";
    echo str_repeat("=", 80) . "\n";
    $testRecords = $mysqli->query("
        SELECT Id, Name 
        FROM document_type 
        WHERE Name LIKE '%Test%' OR Name LIKE '%test%' OR Name LIKE '%TEST%'
        ORDER BY Id
    ");
    
    if ($testRecords && $testRecords->num_rows > 0) {
        echo sprintf("%-5s %-60s\n", "ID", "Name");
        echo str_repeat("-", 65) . "\n";
        $testIds = [];
        while ($row = $testRecords->fetch_assoc()) {
            echo sprintf("%-5s %-60s\n", $row['Id'], $row['Name']);
            $testIds[] = $row['Id'];
        }
        echo "\nTotal encontrados: " . $testRecords->num_rows . "\n";
        echo "IDs a eliminar: " . implode(', ', $testIds) . "\n";
    } else {
        echo "⚠️  No se encontraron registros con 'Test'\n";
    }
    
    echo "\n";
    
    // Mostrar total de registros actuales
    $totalResult = $mysqli->query("SELECT COUNT(*) as total FROM document_type");
    $total = $totalResult->fetch_assoc()['total'];
    echo "📊 Total de registros en document_type: $total\n";
    
    $mysqli->close();
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
