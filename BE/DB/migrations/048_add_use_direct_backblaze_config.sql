-- ============================================================================
-- MIGRACIÓN 048: Config use_direct_backblaze_upload (subida directa a B2)
-- ============================================================================
-- Cuando use_direct_backblaze_upload = 1, el frontend usará /api/backblaze/direct-upload
-- en lugar de la API de NexFile para subir archivos.
-- Fecha: 2026-03-02
-- ============================================================================

INSERT INTO `config` (`config_key`, `config_value`, `category`, `description`, `sensitive`, `registration_date`, `update_date`) VALUES
('use_direct_backblaze_upload', '1', 'group_api_url', 'Usar subida directa a Backblaze B2 (1=si, 0=no, usa NexFile)', 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE 
  config_value = VALUES(config_value),
  description = VALUES(description),
  update_date = NOW();
