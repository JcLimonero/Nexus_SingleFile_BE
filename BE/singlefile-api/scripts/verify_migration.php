<?php

/**
 * Script simple para verificar la migración de contraseñas
 */

// Cargar CodeIgniter de manera simple
require_once __DIR__ . '/../vendor/autoload.php';

// Configurar el entorno básico
putenv('CI_ENVIRONMENT=development');

// Cargar configuración de base de datos
$dbConfig = require __DIR__ . '/../app/Config/Database.php';

try {
    // Conectar a la base de datos
    $db = new mysqli(
        $dbConfig->default['hostname'],
        $dbConfig->default['username'],
        $dbConfig->default['password'],
        $dbConfig->default['database']
    );
    
    if ($db->connect_error) {
        throw new Exception("Error de conexión: " . $db->connect_error);
    }
    
    echo "=== VERIFICACIÓN DE MIGRACIÓN DE CONTRASEÑAS ===\n\n";
    
    // Verificar estructura de la tabla User
    $result = $db->query("DESCRIBE User");
    if (!$result) {
        throw new Exception("Error al describir tabla User: " . $db->error);
    }
    
    echo "📋 Estructura de la tabla User:\n";
    $hasPasswordField = false;
    $hasMigrationField = false;
    
    while ($row = $result->fetch_assoc()) {
        echo "  - {$row['Field']}: {$row['Type']} {$row['Null']} {$row['Key']}\n";
        
        if ($row['Field'] === 'Pass') {
            $hasPasswordField = true;
            if (strpos($row['Type'], '255') !== false) {
                echo "    ✅ Campo Pass actualizado a VARCHAR(255)\n";
            } else {
                echo "    ⚠️  Campo Pass aún es {$row['Type']}\n";
            }
        }
        
        if ($row['Field'] === 'password_migrated') {
            $hasMigrationField = true;
            echo "    ✅ Campo password_migrated creado\n";
        }
    }
    
    echo "\n";
    
    // Verificar estado de migración
    if ($hasMigrationField) {
        $result = $db->query("SELECT COUNT(*) as total, SUM(password_migrated) as migrated FROM User");
        if ($result) {
            $row = $result->fetch_assoc();
            $total = $row['total'];
            $migrated = $row['migrated'];
            $pending = $total - $migrated;
            
            echo "📊 Estado de migración:\n";
            echo "  - Total de usuarios: {$total}\n";
            echo "  - Contraseñas migradas: {$migrated}\n";
            echo "  - Pendientes de migración: {$pending}\n";
            echo "  - Porcentaje completado: " . ($total > 0 ? round(($migrated / $total) * 100, 2) : 0) . "%\n";
            
            if ($pending > 0) {
                echo "\n🔄 Ejecutando migración automática...\n";
                
                $result = $db->query("SELECT Id, User, Pass FROM User WHERE password_migrated = 0 OR password_migrated IS NULL");
                $migratedCount = 0;
                
                while ($user = $result->fetch_assoc()) {
                    $hashedPassword = password_hash($user['Pass'], PASSWORD_DEFAULT);
                    
                    $updateQuery = "UPDATE User SET Pass = ?, password_migrated = 1, UpdateDate = NOW() WHERE Id = ?";
                    $stmt = $db->prepare($updateQuery);
                    $stmt->bind_param("si", $hashedPassword, $user['Id']);
                    
                    if ($stmt->execute()) {
                        echo "  ✅ Usuario {$user['User']} (ID: {$user['Id']}) migrado\n";
                        $migratedCount++;
                    } else {
                        echo "  ❌ Error migrando usuario {$user['User']}: " . $stmt->error . "\n";
                    }
                    
                    $stmt->close();
                }
                
                echo "\n🎉 Migración completada: {$migratedCount} usuarios procesados\n";
            } else {
                echo "\n✅ ¡Todas las contraseñas ya están migradas!\n";
            }
        }
    }
    
    echo "\n🔒 Verificación de seguridad:\n";
    
    // Verificar que las contraseñas estén encriptadas
    $result = $db->query("SELECT Id, User, Pass FROM User LIMIT 3");
    if ($result) {
        echo "  Muestras de contraseñas:\n";
        while ($user = $result->fetch_assoc()) {
            $isHashed = password_get_info($user['Pass'])['algoName'] !== 'unknown';
            $status = $isHashed ? "✅ Encriptada" : "❌ Texto plano";
            echo "    - {$user['User']}: {$status}\n";
        }
    }
    
    $db->close();
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
