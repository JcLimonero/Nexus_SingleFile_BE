<?php

/**
 * Script de prueba para verificar la autenticación con contraseñas encriptadas
 */

// Cargar CodeIgniter
require_once __DIR__ . '/../vendor/autoload.php';

// Configurar el entorno
putenv('CI_ENVIRONMENT=development');

try {
    // Cargar configuración
    $paths = new \App\Config\Paths();
    $paths->systemDirectory = __DIR__ . '/../vendor/codeigniter4/framework/system';
    $paths->appDirectory = __DIR__ . '/../app';
    $paths->writableDirectory = __DIR__ . '/../writable';
    
    // Cargar la base de datos
    $db = \Config\Database::connect();
    
    echo "=== PRUEBA DE AUTENTICACIÓN CON CONTRASEÑAS ENCRIPTADAS ===\n\n";
    
    // Obtener algunos usuarios para probar
    $users = $db->table('User')
                ->select('Id, User, Pass, password_migrated')
                ->where('Enabled', 1)
                ->limit(3)
                ->get()
                ->getResultArray();
    
    echo "📋 Usuarios de prueba:\n";
    foreach ($users as $user) {
        echo "  - ID: {$user['Id']}, Usuario: {$user['User']}\n";
        echo "    Contraseña migrada: " . ($user['password_migrated'] ? '✅ Sí' : '❌ No') . "\n";
        
        // Verificar si la contraseña está encriptada
        $isHashed = password_get_info($user['Pass'])['algoName'] !== 'unknown';
        echo "    Contraseña encriptada: " . ($isHashed ? '✅ Sí' : '❌ No') . "\n";
        
        if ($isHashed) {
            echo "    Algoritmo: " . password_get_info($user['Pass'])['algoName'] . "\n";
        }
        echo "\n";
    }
    
    // Probar verificación de contraseña
    echo "🔐 Prueba de verificación de contraseña:\n";
    
    // Usar la contraseña original del usuario admin (que debería ser "admin")
    $testPassword = "admin";
    $adminUser = $db->table('User')->where('User', 'admin')->first();
    
    if ($adminUser) {
        echo "  Probando contraseña '{$testPassword}' para usuario 'admin'...\n";
        
        if (password_verify($testPassword, $adminUser['Pass'])) {
            echo "  ✅ Contraseña verificada correctamente\n";
        } else {
            echo "  ❌ Contraseña incorrecta\n";
        }
    }
    
    // Verificar estado general de migración
    echo "\n📊 Estado general de migración:\n";
    $result = $db->query("SELECT COUNT(*) as total, SUM(password_migrated) as migrated FROM User");
    if ($result) {
        $row = $result->fetch_assoc();
        $total = $row['total'];
        $migrated = $row['migrated'];
        $pending = $total - $migrated;
        
        echo "  - Total de usuarios: {$total}\n";
        echo "  - Contraseñas migradas: {$migrated}\n";
        echo "  - Pendientes de migración: {$pending}\n";
        echo "  - Porcentaje completado: " . ($total > 0 ? round(($migrated / $total) * 100, 2) : 0) . "%\n";
    }
    
    echo "\n🎉 ¡Prueba completada exitosamente!\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
    exit(1);
}
