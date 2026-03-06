-- ============================================================================
-- MIGRACIÓN 042: Crear tabla payment_method (métodos de pago)
-- ============================================================================
-- Descripción: Tabla catálogo de métodos de pago para operaciones
-- ============================================================================

CREATE TABLE IF NOT EXISTS `payment_method` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(600) NOT NULL,
  `registration_date` timestamp NULL DEFAULT NULL,
  `update_date` timestamp NULL DEFAULT NULL,
  `id_last_user_update` bigint DEFAULT 0,
  `enabled` tinyint DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_payment_method_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar métodos de pago
INSERT INTO `payment_method` (`name`, `registration_date`, `update_date`, `id_last_user_update`, `enabled`) VALUES
('Depósito en efectivo en ventanilla bancaria', NOW(), NOW(), 0, 1),
('Transferencia electrónica (SPEI)', NOW(), NOW(), 0, 1),
('Transferencia interbancaria programada', NOW(), NOW(), 0, 1),
('Cheque de caja', NOW(), NOW(), 0, 1),
('Cheque certificado', NOW(), NOW(), 0, 1),
('Pago referenciado (línea de captura)', NOW(), NOW(), 0, 1),
('Transferencia desde cuenta empresarial (persona moral)', NOW(), NOW(), 0, 1),
('Pago mixto (enganche + transferencia + crédito)', NOW(), NOW(), 0, 1),
('Depósito en corresponsales bancarios (Oxxo, farmacias, etc.)', NOW(), NOW(), 0, 1),
('Desembolso de crédito bancario directo a la agencia', NOW(), NOW(), 0, 1);
