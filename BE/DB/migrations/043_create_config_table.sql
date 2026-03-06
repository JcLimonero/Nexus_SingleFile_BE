-- ============================================================================
-- MIGRACIÓN 043: Crear tabla config (configuración del sistema)
-- ============================================================================
-- Descripción: Almacena configuración clave-valor para:
--   - APIs de Backblaze B2 (almacenamiento)
--   - APIs para obtener pedidos
--   - IDs de tipos de documento (ej. liquidación)
-- ============================================================================

CREATE TABLE IF NOT EXISTS `config` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `config_key` varchar(255) NOT NULL,
  `config_value` text,
  `category` varchar(100) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `sensitive` tinyint DEFAULT 0,
  `registration_date` timestamp NULL DEFAULT NULL,
  `update_date` timestamp NULL DEFAULT NULL,
  `id_last_user_update` bigint DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_config_key` (`config_key`),
  KEY `idx_config_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Backblaze B2
INSERT INTO `config` (`config_key`, `config_value`, `category`, `description`, `sensitive`, `registration_date`, `update_date`) VALUES
('backblaze_key_id', '', 'backblaze', 'Backblaze B2: Key ID (Application Key)', 1, NOW(), NOW()),
('backblaze_application_key', '', 'backblaze', 'Backblaze B2: Application Key (secreto)', 1, NOW(), NOW()),
('backblaze_bucket_id', '', 'backblaze', 'Backblaze B2: Bucket ID', 0, NOW(), NOW()),
('backblaze_bucket_name', '', 'backblaze', 'Backblaze B2: Nombre del bucket', 0, NOW(), NOW()),
('backblaze_endpoint', 'https://s3.us-west-002.backblazeb2.com', 'backblaze', 'Backblaze B2: Endpoint S3-compatible (opcional)', 0, NOW(), NOW());

-- API de pedidos
INSERT INTO `config` (`config_key`, `config_value`, `category`, `description`, `sensitive`, `registration_date`, `update_date`) VALUES
('orders_api_url', '', 'orders_api', 'URL base del API para obtener pedidos', 0, NOW(), NOW()),
('orders_api_key', '', 'orders_api', 'API Key o token de autenticación para pedidos', 1, NOW(), NOW()),
('orders_api_user', '', 'orders_api', 'Usuario del API de pedidos (si aplica)', 0, NOW(), NOW()),
('orders_api_password', '', 'orders_api', 'Contraseña del API de pedidos (si aplica)', 1, NOW(), NOW());

-- Tipos de documento (IDs de catálogos)
INSERT INTO `config` (`config_key`, `config_value`, `category`, `description`, `sensitive`, `registration_date`, `update_date`) VALUES
('id_document_type_liquidacion', '46', 'document_types', 'ID del tipo de documento de Liquidación en document_type (no editable/eliminable)', 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE config_value = '46', description = VALUES(description), update_date = NOW();
