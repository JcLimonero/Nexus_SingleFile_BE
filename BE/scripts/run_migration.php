<?php

/**
 * Script para ejecutar la migración de la tabla de logs de actividad
 * Ejecutar desde la línea de comandos: php scripts/run_migration.php
 */

// Incluir el autoloader de CodeIgniter
require_once __DIR__ . '/../vendor/autoload.php';

// Configurar el entorno
$environment = 'development'; // Cambiar a 'production' en producción

// Cargar la configuración de la base de datos
$config = new \Config\Database();
$db = \Config\Database::connect();

echo "=== Ejecutando Migración de Logs de Actividad ===\n";
echo "Base de datos: " . $db->database . "\n";
echo "Host: " . $db->hostname . "\n";
echo "Usuario: " . $db->username . "\n\n";

try {
    // Verificar si la tabla ya existe
    $tableExists = $db->tableExists('user_activity_logs');
    
    if ($tableExists) {
        echo "❌ La tabla 'user_activity_logs' ya existe.\n";
        echo "¿Deseas eliminarla y recrearla? (y/n): ";
        $handle = fopen("php://stdin", "r");
        $line = fgets($handle);
        fclose($handle);
        
        if (trim($line) !== 'y') {
            echo "Operación cancelada.\n";
            exit(0);
        }
        
        echo "Eliminando tabla existente...\n";
        $db->query("DROP TABLE IF EXISTS user_activity_logs");
        echo "✅ Tabla eliminada.\n\n";
    }
    
    // Crear la tabla manualmente
    echo "Creando tabla 'user_activity_logs'...\n";
    
    $sql = "
    CREATE TABLE `user_activity_logs` (
        `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
        `user_id` varchar(255) NOT NULL,
        `username` varchar(255) NOT NULL,
        `action` varchar(255) NOT NULL,
        `description` text DEFAULT NULL,
        `ip_address` varchar(45) DEFAULT NULL,
        `user_agent` text DEFAULT NULL,
        `url` varchar(500) DEFAULT NULL,
        `method` varchar(10) DEFAULT NULL,
        `request_data` text DEFAULT NULL,
        `response_status` int(3) DEFAULT NULL,
        `execution_time` float DEFAULT NULL,
        `created_at` datetime NOT NULL,
        `updated_at` datetime NOT NULL,
        PRIMARY KEY (`id`),
        KEY `user_id` (`user_id`),
        KEY `action` (`action`),
        KEY `created_at` (`created_at`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ";
    
    $db->query($sql);
    echo "✅ Tabla 'user_activity_logs' creada exitosamente.\n\n";
    
    // Verificar que la tabla se creó correctamente
    $tableExists = $db->tableExists('user_activity_logs');
    if ($tableExists) {
        echo "✅ Verificación: La tabla existe en la base de datos.\n";
        
        // Mostrar estructura de la tabla
        $result = $db->query("DESCRIBE user_activity_logs");
        echo "\n📋 Estructura de la tabla:\n";
        echo str_repeat("-", 60) . "\n";
        printf("%-20s %-15s %-10s %-8s %-8s\n", "Campo", "Tipo", "Null", "Key", "Default");
        echo str_repeat("-", 60) . "\n";
        
        foreach ($result->getResultArray() as $row) {
            printf("%-20s %-15s %-10s %-8s %-8s\n", 
                $row['Field'], 
                $row['Type'], 
                $row['Null'], 
                $row['Key'], 
                $row['Default'] ?? 'NULL'
            );
        }
        
        // Insertar un registro de prueba
        echo "\n🧪 Insertando registro de prueba...\n";
        $testData = [
            'user_id' => 'test_user',
            'username' => 'Usuario de Prueba',
            'action' => 'SYSTEM_INIT',
            'description' => 'Inicialización del sistema de logs',
            'ip_address' => '127.0.0.1',
            'user_agent' => 'Script de Migración',
            'url' => '/system/init',
            'method' => 'GET',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ];
        
        $db->table('user_activity_logs')->insert($testData);
        echo "✅ Registro de prueba insertado.\n";
        
        // Verificar el registro insertado
        $count = $db->table('user_activity_logs')->countAllResults();
        echo "📊 Total de registros en la tabla: {$count}\n";
        
    } else {
        echo "❌ Error: La tabla no se creó correctamente.\n";
        exit(1);
    }
    
    echo "\n🎉 ¡Migración completada exitosamente!\n";
    echo "La tabla 'user_activity_logs' está lista para usar.\n";
    
} catch (Exception $e) {
    echo "❌ Error durante la migración: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
    exit(1);
}
