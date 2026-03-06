<?php
/**
 * Insertar estados de documento (document_file_status)
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== INSERTAR ESTADOS DE DOCUMENT_FILE_STATUS ===\n\n";

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
        'Documento Nuevo',
        'Documento Cargado',
        'Documento en Revisión',
        'Documento Aprobado',
        'Documento Rechazado',
        'Documento Caduco'
    ];
    
    echo "📋 ESTADOS A INSERTAR:\n";
    echo str_repeat("=", 60) . "\n";
    foreach ($statuses as $index => $status) {
        echo sprintf("%d. %s\n", $index + 1, $status);
    }
    echo "\n";
    
    // Obtener el máximo ID actual
    $maxIdResult = $mysqli->query("SELECT MAX(Id) as max_id FROM document_file_status");
    $maxIdRow = $maxIdResult->fetch_assoc();
    $nextId = ($maxIdRow['max_id'] ?? 0) + 1;
    
    // Si el máximo es 0, empezar desde 1
    if ($nextId == 0) {
        $nextId = 1;
    }
    
    echo "🔍 ID inicial para nuevos registros: $nextId\n\n";
    
    echo "🔄 Insertando estados...\n";
    echo str_repeat("=", 60) . "\n";
    
    $insertedCount = 0;
    $skippedCount = 0;
    $errorCount = 0;
    
    foreach ($statuses as $statusName) {
        // Verificar si ya existe
        $checkQuery = $mysqli->prepare("SELECT Id FROM document_file_status WHERE Name = ?");
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
        
        // Insertar nuevo estado (IdLastUserUpdate como NULL para evitar problemas con foreign key)
        $idLastUserUpdate = null;
        $insertQuery = $mysqli->prepare("
            INSERT INTO document_file_status 
            (Id, Name, RegistrationDate, UpdateDate, IdLastUserUpdate, Enabled) 
            VALUES (?, ?, NOW(), NOW(), ?, 1)
        ");
        $insertQuery->bind_param("isi", $nextId, $statusName, $idLastUserUpdate);
        
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
    echo str_repeat("=", 80) . "\n";
    $allStatuses = $mysqli->query("SELECT Id, Name, Enabled FROM document_file_status ORDER BY Id");
    if ($allStatuses && $allStatuses->num_rows > 0) {
        echo sprintf("%-5s %-60s %-10s\n", "ID", "Nombre", "Enabled");
        echo str_repeat("-", 75) . "\n";
        while ($status = $allStatuses->fetch_assoc()) {
            echo sprintf("%-5s %-60s %-10s\n", 
                $status['Id'], 
                $status['Name'],
                $status['Enabled']
            );
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
