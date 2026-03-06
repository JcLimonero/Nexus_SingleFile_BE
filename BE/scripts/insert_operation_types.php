<?php
/**
 * Insertar tipos de operación
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== INSERTAR TIPOS DE OPERACIÓN ===\n\n";

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

echo "Base de datos: {$db['database']}\n";
echo "Host: {$db['hostname']}\n\n";

// Tipos de operación a insertar
$operationTypes = [
    ['Id' => 1, 'Name' => 'Contado'],
    ['Id' => 2, 'Name' => 'Financiamiento'],
    ['Id' => 3, 'Name' => 'Arrendamiento'],
    ['Id' => 4, 'Name' => 'Autofinanciamiento'],
    ['Id' => 5, 'Name' => 'Credito Interno'],
];

try {
    $mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);
    
    if ($mysqli->connect_error) {
        die("❌ Error de conexión: " . $mysqli->connect_error . "\n");
    }
    
    echo "✅ Conectado a la base de datos\n\n";
    
    $insertedCount = 0;
    $updatedCount = 0;
    $errorCount = 0;
    
    echo "🔄 Insertando/Actualizando tipos de operación...\n";
    echo str_repeat("-", 60) . "\n";
    
    foreach ($operationTypes as $type) {
        $id = $type['Id'];
        $name = $type['Name'];
        
        // Verificar si el tipo ya existe
        $checkQuery = $mysqli->prepare("SELECT Id, Name FROM operation_type WHERE Id = ?");
        $checkQuery->bind_param("i", $id);
        $checkQuery->execute();
        $result = $checkQuery->get_result();
        $exists = $result->fetch_assoc();
        $checkQuery->close();
        
        if ($exists) {
            // Actualizar si existe
            $updateQuery = $mysqli->prepare("UPDATE operation_type SET Name = ?, UpdateDate = NOW() WHERE Id = ?");
            $updateQuery->bind_param("si", $name, $id);
            
            if ($updateQuery->execute()) {
                echo "✅ ID $id: Actualizado '$name'\n";
                $updatedCount++;
            } else {
                echo "❌ ID $id: Error al actualizar - " . $updateQuery->error . "\n";
                $errorCount++;
            }
            $updateQuery->close();
        } else {
            // Insertar si no existe
            $insertQuery = $mysqli->prepare("INSERT INTO operation_type (Id, Name, Enabled, RegistrationDate, UpdateDate) VALUES (?, ?, 1, NOW(), NOW())");
            $insertQuery->bind_param("is", $id, $name);
            
            if ($insertQuery->execute()) {
                echo "✅ ID $id: Insertado '$name'\n";
                $insertedCount++;
            } else {
                echo "❌ ID $id: Error al insertar - " . $insertQuery->error . "\n";
                $errorCount++;
            }
            $insertQuery->close();
        }
    }
    
    echo "\n" . str_repeat("=", 60) . "\n";
    echo "📊 RESUMEN:\n";
    echo str_repeat("=", 60) . "\n";
    echo "✅ Tipos insertados: $insertedCount\n";
    echo "🔄 Tipos actualizados: $updatedCount\n";
    echo "❌ Errores: $errorCount\n\n";
    
    // Mostrar todos los tipos de operación
    echo "📋 TIPOS DE OPERACIÓN EN LA BASE DE DATOS:\n";
    echo str_repeat("=", 60) . "\n";
    $result = $mysqli->query("SELECT Id, Name, Enabled, RegistrationDate FROM operation_type ORDER BY Id");
    while ($row = $result->fetch_assoc()) {
        $status = $row['Enabled'] ? '✅' : '❌';
        $date = $row['RegistrationDate'] ? date('Y-m-d H:i:s', strtotime($row['RegistrationDate'])) : 'N/A';
        echo sprintf("%s ID %d: %-30s (Registrado: %s)\n", 
            $status, 
            $row['Id'], 
            $row['Name'],
            $date
        );
    }
    
    $mysqli->close();
    
    echo "\n✅ Proceso completado\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
