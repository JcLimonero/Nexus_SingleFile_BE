-- ============================================================================
-- MIGRACIÓN 047: Agregar api_base_url en group_api_url (URL base para APIs NexFile)
-- ============================================================================
-- Descripción: URL base (ej: https://[obsoleto - usar nexfile_base_url]) para construir
--   las URLs completas de las APIs. Se concatena con los paths de api_url, etc.
-- Fecha: 2026-03-02
-- ============================================================================

INSERT INTO `config` (`config_key`, `config_value`, `category`, `description`, `sensitive`, `registration_date`, `update_date`) VALUES
('api_base_url', 'https://[obsoleto - usar nexfile_base_url]', 'group_api_url', 'URL base para APIs NexFile/Backblaze', 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE 
  config_value = VALUES(config_value),
  description = VALUES(description),
  update_date = NOW();
