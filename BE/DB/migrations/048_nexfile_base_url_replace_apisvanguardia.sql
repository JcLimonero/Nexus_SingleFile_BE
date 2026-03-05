-- ============================================================================
-- MIGRACIÓN 048: Reemplazar api_base_url por nexfile_base_url (DWH)
-- ============================================================================
-- Elimina referencias a apisvanguardia. El proxy Nexfile usa DWH.
-- Configura nexfile_base_url (ej: http://localhost:8082 en dev, http://host:8101 en prod)
-- Fecha: 2026-03-04
-- ============================================================================

-- Añadir nexfile_base_url
INSERT INTO `config` (`config_key`, `config_value`, `category`, `description`, `sensitive`, `registration_date`, `update_date`) VALUES
('nexfile_base_url', 'http://localhost:8082', 'group_api_url', 'URL base del DWH Nexfile (customers, orders, invoices)', 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE 
  config_value = COALESCE(NULLIF(TRIM(config_value), ''), 'http://localhost:8082'),
  description = VALUES(description),
  update_date = NOW();

-- Eliminar api_base_url de group_api_url (referencia a apisvanguardia)
DELETE FROM `config` WHERE `category` = 'group_api_url' AND `config_key` = 'api_base_url';
