-- Script SQL para crear la tabla de logs de actividad de usuarios
-- Ejecutar este script directamente en tu base de datos MySQL/MariaDB

-- Crear la tabla si no existe
CREATE TABLE IF NOT EXISTS `user_activity_logs` (
    `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `user_id` varchar(255) NOT NULL COMMENT 'ID del usuario que realizó la acción',
    `username` varchar(255) NOT NULL COMMENT 'Nombre de usuario',
    `action` varchar(255) NOT NULL COMMENT 'Tipo de acción realizada',
    `description` text DEFAULT NULL COMMENT 'Descripción detallada de la acción',
    `ip_address` varchar(45) DEFAULT NULL COMMENT 'Dirección IP del usuario',
    `user_agent` text DEFAULT NULL COMMENT 'User Agent del navegador',
    `url` varchar(500) DEFAULT NULL COMMENT 'URL de la acción',
    `method` varchar(10) DEFAULT NULL COMMENT 'Método HTTP utilizado',
    `request_data` text DEFAULT NULL COMMENT 'Datos de la petición (sanitizados)',
    `response_status` int(3) DEFAULT NULL COMMENT 'Código de estado de la respuesta HTTP',
    `execution_time` float DEFAULT NULL COMMENT 'Tiempo de ejecución en milisegundos',
    `created_at` datetime NOT NULL COMMENT 'Fecha y hora de creación del log',
    `updated_at` datetime NOT NULL COMMENT 'Fecha y hora de última actualización',
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_action` (`action`),
    KEY `idx_created_at` (`created_at`),
    KEY `idx_user_action` (`user_id`, `action`),
    KEY `idx_ip_address` (`ip_address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Logs de actividad de usuarios en la plataforma';

-- Insertar registro de prueba
INSERT INTO `user_activity_logs` (
    `user_id`, 
    `username`, 
    `action`, 
    `description`, 
    `ip_address`, 
    `user_agent`, 
    `url`, 
    `method`, 
    `created_at`, 
    `updated_at`
) VALUES (
    'system',
    'Sistema',
    'SYSTEM_INIT',
    'Inicialización del sistema de logs de actividad',
    '127.0.0.1',
    'Script SQL',
    '/system/init',
    'GET',
    NOW(),
    NOW()
);

-- Verificar que la tabla se creó correctamente
SELECT 
    TABLE_NAME,
    TABLE_ROWS,
    DATA_LENGTH,
    INDEX_LENGTH,
    (DATA_LENGTH + INDEX_LENGTH) AS TOTAL_SIZE
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'user_activity_logs';

-- Mostrar la estructura de la tabla
DESCRIBE `user_activity_logs`;

-- Mostrar el registro de prueba
SELECT * FROM `user_activity_logs` LIMIT 1;
