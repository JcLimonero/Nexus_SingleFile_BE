<?php
/**
 * Insertar procesos de venta de autos
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== INSERTAR PROCESOS DE VENTA DE AUTOS ===\n\n";

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

echo "Base de datos: {$db['database']}\n";
echo "Host: {$db['hostname']}\n\n";

// Procesos a insertar
$processes = [
    ['Id' => 1, 'Name' => 'Autos Nuevos'],
    ['Id' => 2, 'Name' => 'Autos Seminuevos'],
    ['Id' => 3, 'Name' => 'Motos Nuevos'],
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
    
    echo "🔄 Insertando/Actualizando procesos...\n";
    echo str_repeat("-", 60) . "\n";
    
    foreach ($processes as $process) {
        $id = $process['Id'];
        $name = $process['Name'];
        
        // Verificar si el proceso ya existe
        $checkQuery = $mysqli->prepare("SELECT Id, Name FROM process WHERE Id = ?");
        $checkQuery->bind_param("i", $id);
        $checkQuery->execute();
        $result = $checkQuery->get_result();
        $exists = $result->fetch_assoc();
        $checkQuery->close();
        
        if ($exists) {
            // Actualizar si existe
            $updateQuery = $mysqli->prepare("UPDATE process SET Name = ?, UpdateDate = NOW() WHERE Id = ?");
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
            $insertQuery = $mysqli->prepare("INSERT INTO process (Id, Name, Enabled, RegistrationDate, UpdateDate) VALUES (?, ?, 1, NOW(), NOW())");
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
    echo "✅ Procesos insertados: $insertedCount\n";
    echo "🔄 Procesos actualizados: $updatedCount\n";
    echo "❌ Errores: $errorCount\n\n";
    
    // Mostrar todos los procesos
    echo "📋 PROCESOS EN LA BASE DE DATOS:\n";
    echo str_repeat("=", 60) . "\n";
    $result = $mysqli->query("SELECT Id, Name, Enabled, RegistrationDate FROM process ORDER BY Id");
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
