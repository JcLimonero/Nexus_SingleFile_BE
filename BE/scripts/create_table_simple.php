<?php
/**
 * Script simple para crear la tabla de logs de actividad
 * Ejecutar: php scripts/create_table_simple.php
 */

echo "Creando tabla de logs de actividad...\n";

// Configuración de la base de datos (ajustar según tu configuración)
$host = 'localhost';
$dbname = 'singlefile_db'; // Nombre de la base de datos del proyecto
$username = 'root';         // Usuario de BD
$password = '00@Limonero';  // Contraseña de BD

try {
    // Conectar a la base de datos
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✅ Conectado a la base de datos: $dbname\n";
    
    // SQL para crear la tabla
    $sql = "
    CREATE TABLE IF NOT EXISTS `user_activity_logs` (
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
        KEY `idx_user_id` (`user_id`),
        KEY `idx_action` (`action`),
        KEY `idx_created_at` (`created_at`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ";
    
    // Ejecutar la creación de la tabla
    $pdo->exec($sql);
    echo "✅ Tabla 'user_activity_logs' creada exitosamente\n";
    
    // Insertar registro de prueba
    $insertSql = "
    INSERT INTO `user_activity_logs` (
        `user_id`, `username`, `action`, `description`, 
        `ip_address`, `user_agent`, `url`, `method`, 
        `created_at`, `updated_at`
    ) VALUES (
        'system', 'Sistema', 'SYSTEM_INIT', 
        'Inicialización del sistema de logs de actividad',
        '127.0.0.1', 'Script PHP', '/system/init', 'GET',
        NOW(), NOW()
    )
    ";
    
    $pdo->exec($insertSql);
    echo "✅ Registro de prueba insertado\n";
    
    // Verificar que la tabla existe
    $stmt = $pdo->query("SHOW TABLES LIKE 'user_activity_logs'");
    if ($stmt->rowCount() > 0) {
        echo "✅ Verificación: La tabla existe en la base de datos\n";
        
        // Contar registros
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM user_activity_logs");
        $count = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
        echo "📊 Total de registros: $count\n";
        
        echo "\n🎉 ¡Tabla creada exitosamente!\n";
        echo "El sistema de logs de actividad está listo para usar.\n";
    }
    
} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "\n💡 Asegúrate de:\n";
    echo "1. Tener MySQL/MariaDB ejecutándose\n";
    echo "2. Crear la base de datos '$dbname' si no existe\n";
    echo "3. Tener las credenciales correctas de la base de datos\n";
    echo "4. Tener permisos para crear tablas\n";
}
