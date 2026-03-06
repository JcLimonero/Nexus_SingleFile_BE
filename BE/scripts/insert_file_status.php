<?php
/**
 * Insertar estados de archivo (file_status)
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== INSERTAR ESTADOS DE ARCHIVO ===\n\n";

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
    
    // Estados a insertar
    $statuses = [
        'Integración',
        'Liquidación',
        'Liberación',
        'Liberado',
        'Cancelado',
        'Liberado por Excepción'
    ];
    
    echo "📋 ESTADOS A INSERTAR:\n";
    echo str_repeat("=", 60) . "\n";
    foreach ($statuses as $index => $status) {
        echo sprintf("%d. %s\n", $index + 1, $status);
    }
    echo "\n";
    
    // Obtener el máximo ID actual
    $maxIdResult = $mysqli->query("SELECT MAX(Id) as max_id FROM file_status");
    $maxIdRow = $maxIdResult->fetch_assoc();
    $nextId = ($maxIdRow['max_id'] ?? 0) + 1;
    
    echo "🔍 ID inicial para nuevos registros: $nextId\n\n";
    
    echo "🔄 Insertando estados...\n";
    echo str_repeat("=", 60) . "\n";
    
    $insertedCount = 0;
    $skippedCount = 0;
    $errorCount = 0;
    
    foreach ($statuses as $statusName) {
        // Verificar si ya existe
        $checkQuery = $mysqli->prepare("SELECT Id FROM file_status WHERE Name = ?");
        $checkQuery->bind_param("s", $statusName);
        $checkQuery->execute();
        $result = $checkQuery->get_result();
        $exists = $result->fetch_assoc();
        $checkQuery->close();
        
        if ($exists) {
            echo "⚠️  '$statusName' ya existe (ID: {$exists['Id']}) - Saltando\n";
            $skippedCount++;
            continue;
        }
        
        // Insertar nuevo estado
        $insertQuery = $mysqli->prepare("INSERT INTO file_status (Id, Name) VALUES (?, ?)");
        $insertQuery->bind_param("is", $nextId, $statusName);
        
        if ($insertQuery->execute()) {
            echo "✅ ID $nextId: '$statusName' insertado\n";
            $insertedCount++;
            $nextId++;
        } else {
            echo "❌ Error insertando '$statusName': " . $insertQuery->error . "\n";
            $errorCount++;
        }
        $insertQuery->close();
    }
    
    echo "\n" . str_repeat("=", 60) . "\n";
    echo "📊 RESUMEN:\n";
    echo str_repeat("=", 60) . "\n";
    echo "✅ Insertados: $insertedCount\n";
    echo "⚠️  Omitidos (ya existían): $skippedCount\n";
    echo "❌ Errores: $errorCount\n\n";
    
    // Mostrar todos los estados actuales
    echo "📋 ESTADOS ACTUALES EN LA BASE DE DATOS:\n";
    echo str_repeat("=", 60) . "\n";
    $allStatuses = $mysqli->query("SELECT Id, Name FROM file_status ORDER BY Id");
    if ($allStatuses && $allStatuses->num_rows > 0) {
        echo sprintf("%-5s %-50s\n", "ID", "Nombre");
        echo str_repeat("-", 55) . "\n";
        while ($status = $allStatuses->fetch_assoc()) {
            echo sprintf("%-5s %-50s\n", $status['Id'], $status['Name']);
        }
    } else {
        echo "No hay estados registrados\n";
    }
    
    $mysqli->close();
    
    echo "\n✅ Proceso completado\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
