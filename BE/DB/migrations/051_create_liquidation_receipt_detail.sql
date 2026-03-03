-- ============================================================================
-- MIGRACIÓN 051: Crear tabla liquidation_receipt_detail
-- ============================================================================
-- Descripción: Detalle de comprobantes de liquidación (monto y método de pago)
-- ============================================================================

CREATE TABLE IF NOT EXISTS `liquidation_receipt_detail` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `id_file_document` bigint NOT NULL,
  `id_file` bigint NOT NULL,
  `amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `id_payment_method` bigint NOT NULL,
  `registration_date` timestamp NULL DEFAULT NULL,
  `update_date` timestamp NULL DEFAULT NULL,
  `id_last_user_update` bigint DEFAULT 0,
  `enabled` tinyint DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_lrd_id_file_document` (`id_file_document`),
  KEY `idx_lrd_id_file` (`id_file`),
  KEY `idx_lrd_id_payment_method` (`id_payment_method`),
  CONSTRAINT `fk_lrd_file_document` FOREIGN KEY (`id_file_document`) REFERENCES `file_document` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_lrd_expedient` FOREIGN KEY (`id_file`) REFERENCES `expedient` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_lrd_payment_method` FOREIGN KEY (`id_payment_method`) REFERENCES `payment_method` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
