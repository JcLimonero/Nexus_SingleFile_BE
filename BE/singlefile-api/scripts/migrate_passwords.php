<?php

/**
 * Script para migrar contraseñas existentes a hash bcrypt
 * Ejecutar desde la línea de comandos: php scripts/migrate_passwords.php
 */

// Cargar CodeIgniter
require_once __DIR__ . '/../vendor/autoload.php';

// Configurar el entorno
$paths = new \App\Config\Paths();
$paths->systemDirectory = __DIR__ . '/../vendor/codeigniter4/framework/system';
$paths->appDirectory = __DIR__ . '/../app';
$paths->writableDirectory = __DIR__ . '/../writable';
$paths->testsDirectory = __DIR__ . '/../tests';
$paths->viewDirectory = __DIR__ . '/../app/Views';

// Cargar la base de datos
$db = \Config\Database::connect();

echo "=== MIGRACIÓN DE CONTRASEÑAS A HASH BCRYPT ===\n\n";

try {
    // Verificar si existe el campo password_migrated
    $fields = $db->getFieldNames('User');
    $hasMigrationField = in_array('password_migrated', $fields);
    
    if (!$hasMigrationField) {
        echo "❌ El campo 'password_migrated' no existe en la tabla User.\n";
        echo "Por favor, ejecuta primero la migración de base de datos:\n";
        echo "php spark migrate\n\n";
        exit(1);
    }
    
    // Obtener usuarios con contraseñas en texto plano
    $users = $db->table('User')
                ->select('Id, User, Pass, password_migrated')
                ->where('password_migrated', 0)
                ->get()
                ->getResultArray();
    
    if (empty($users)) {
        echo "✅ Todas las contraseñas ya han sido migradas a hash bcrypt.\n";
        exit(0);
    }
    
    echo "📊 Usuarios pendientes de migración: " . count($users) . "\n\n";
    
    $migratedCount = 0;
    $errorCount = 0;
    
    foreach ($users as $user) {
        echo "Migrando usuario ID {$user['Id']} ({$user['User']})... ";
        
        try {
            // Encriptar la contraseña
            $hashedPassword = password_hash($user['Pass'], PASSWORD_DEFAULT);
            
            // Actualizar en la base de datos
            $updated = $db->table('User')
                          ->where('Id', $user['Id'])
                          ->update([
                              'Pass' => $hashedPassword,
                              'password_migrated' => 1,
                              'UpdateDate' => date('Y-m-d H:i:s')
                          ]);
            
            if ($updated) {
                echo "✅ OK\n";
                $migratedCount++;
            } else {
                echo "❌ Error al actualizar\n";
                $errorCount++;
            }
            
        } catch (\Exception $e) {
            echo "❌ Error: " . $e->getMessage() . "\n";
            $errorCount++;
        }
    }
    
    echo "\n=== RESUMEN DE MIGRACIÓN ===\n";
    echo "✅ Usuarios migrados exitosamente: {$migratedCount}\n";
    echo "❌ Errores durante la migración: {$errorCount}\n";
    echo "📊 Total de usuarios procesados: " . count($users) . "\n\n";
    
    if ($errorCount > 0) {
        echo "⚠️  Algunos usuarios no pudieron ser migrados. Revisa los errores arriba.\n";
        exit(1);
    } else {
        echo "🎉 ¡Migración completada exitosamente!\n";
        echo "Todas las contraseñas ahora están encriptadas con bcrypt.\n";
        exit(0);
    }
    
} catch (\Exception $e) {
    echo "❌ Error fatal: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
    exit(1);
}
