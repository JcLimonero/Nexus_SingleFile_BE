<?php
/**
 * Insertar roles de usuario en la tabla user_role
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== INSERTAR ROLES DE USUARIO ===\n\n";

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

echo "Base de datos: {$db['database']}\n";
echo "Host: {$db['hostname']}\n\n";

// Roles a insertar
$roles = [
    ['Id' => 1, 'Name' => 'Asesor'],
    ['Id' => 2, 'Name' => 'Operador Integracion'],
    ['Id' => 3, 'Name' => 'Operador Liquidacion'],
    ['Id' => 4, 'Name' => 'Operador Liberacion'],
    ['Id' => 5, 'Name' => 'Coordinador De Operacion'],
    ['Id' => 6, 'Name' => 'Gerente'],
    ['Id' => 7, 'Name' => 'Administrador'],
    ['Id' => 8, 'Name' => 'Soporte'],
    ['Id' => 9, 'Name' => 'Auditoria'],
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
    
    echo "🔄 Insertando/Actualizando roles...\n";
    echo str_repeat("-", 60) . "\n";
    
    foreach ($roles as $role) {
        $id = $role['Id'];
        $name = $role['Name'];
        
        // Verificar si el rol ya existe
        $checkQuery = $mysqli->prepare("SELECT Id, Name FROM user_role WHERE Id = ?");
        $checkQuery->bind_param("i", $id);
        $checkQuery->execute();
        $result = $checkQuery->get_result();
        $exists = $result->fetch_assoc();
        $checkQuery->close();
        
        if ($exists) {
            // Actualizar si existe
            $updateQuery = $mysqli->prepare("UPDATE user_role SET Name = ?, UpdateDate = NOW() WHERE Id = ?");
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
            $insertQuery = $mysqli->prepare("INSERT INTO user_role (Id, Name, Enabled, RegistrationDate, UpdateDate) VALUES (?, ?, 1, NOW(), NOW())");
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
    echo "✅ Roles insertados: $insertedCount\n";
    echo "🔄 Roles actualizados: $updatedCount\n";
    echo "❌ Errores: $errorCount\n\n";
    
    // Mostrar todos los roles
    echo "📋 ROLES EN LA BASE DE DATOS:\n";
    echo str_repeat("=", 60) . "\n";
    $result = $mysqli->query("SELECT Id, Name, Enabled FROM user_role ORDER BY Id");
    while ($row = $result->fetch_assoc()) {
        $status = $row['Enabled'] ? '✅' : '❌';
        echo sprintf("%s ID %d: %s\n", $status, $row['Id'], $row['Name']);
    }
    
    $mysqli->close();
    
    echo "\n✅ Proceso completado\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
