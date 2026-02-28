<?php
/**
 * Actualizar dominio de emails de usuarios de @sistemas.com a @nexusqtech.com
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== ACTUALIZAR DOMINIO DE EMAILS ===\n\n";

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
    
    // Buscar usuarios con @sistema.com o @sistemas.com
    echo "🔍 Buscando usuarios con dominios a actualizar...\n";
    echo str_repeat("-", 60) . "\n";
    
    $result = $mysqli->query("SELECT Id, Name, Mail FROM user WHERE Mail LIKE '%@sistema.com' OR Mail LIKE '%@sistemas.com'");
    $usersToUpdate = [];
    
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $usersToUpdate[] = $row;
            echo sprintf("ID %d: %s → %s\n", $row['Id'], $row['Name'], $row['Mail']);
        }
    } else {
        echo "No se encontraron usuarios con dominios @sistema.com o @sistemas.com\n";
    }
    
    if (empty($usersToUpdate)) {
        echo "\n✅ No hay usuarios para actualizar\n";
        $mysqli->close();
        exit(0);
    }
    
    echo "\n🔄 Actualizando emails...\n";
    echo str_repeat("-", 60) . "\n";
    
    $updatedCount = 0;
    $errorCount = 0;
    
    foreach ($usersToUpdate as $user) {
        $userId = $user['Id'];
        $oldEmail = $user['Mail'];
        // Reemplazar ambos posibles dominios
        $newEmail = str_replace(['@sistemas.com', '@sistema.com'], '@nexusqtech.com', $oldEmail);
        
        // Verificar si el nuevo email ya existe
        $checkQuery = $mysqli->prepare("SELECT Id FROM user WHERE Mail = ? AND Id != ?");
        $checkQuery->bind_param("si", $newEmail, $userId);
        $checkQuery->execute();
        $result = $checkQuery->get_result();
        $exists = $result->fetch_assoc();
        $checkQuery->close();
        
        if ($exists) {
            echo "⚠️  ID $userId: El email $newEmail ya existe (saltando)\n";
            continue;
        }
        
        // Actualizar email
        $updateQuery = $mysqli->prepare("UPDATE user SET Mail = ?, UpdateDate = NOW() WHERE Id = ?");
        $updateQuery->bind_param("si", $newEmail, $userId);
        
        if ($updateQuery->execute()) {
            echo "✅ ID $userId: $oldEmail → $newEmail\n";
            $updatedCount++;
        } else {
            echo "❌ ID $userId: Error - " . $updateQuery->error . "\n";
            $errorCount++;
        }
        $updateQuery->close();
    }
    
    echo "\n" . str_repeat("=", 60) . "\n";
    echo "📊 RESUMEN:\n";
    echo str_repeat("=", 60) . "\n";
    echo "✅ Emails actualizados: $updatedCount\n";
    echo "❌ Errores: $errorCount\n\n";
    
    // Mostrar usuarios actualizados
    echo "📋 USUARIOS CON NUEVO DOMINIO:\n";
    echo str_repeat("=", 60) . "\n";
    $result = $mysqli->query("SELECT Id, Name, Mail FROM user WHERE Mail LIKE '%@nexusqtech.com' ORDER BY Id");
    while ($row = $result->fetch_assoc()) {
        echo sprintf("ID %d: %s → %s\n", $row['Id'], $row['Name'], $row['Mail']);
    }
    
    $mysqli->close();
    
    echo "\n✅ Proceso completado\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
