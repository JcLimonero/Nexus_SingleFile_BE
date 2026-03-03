-- ============================================================================
-- MIGRACIÓN 058: Agregar config activity_log_enabled
-- ============================================================================
-- Habilita/deshabilita el registro de logs de actividad de usuarios.
-- Si el usuario es Demo (role_id 15), siempre se considera activo en el frontend.
-- ============================================================================

INSERT INTO `config` (`config_key`, `config_value`, `category`, `description`, `sensitive`, `registration_date`, `update_date`) VALUES
('activity_log_enabled', '0', 'activity_log', 'Habilita el registro de logs de actividad de usuarios (1=activado, 0=desactivado). Usuario Demo siempre tiene activo.', 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE
    `config_value` = COALESCE(VALUES(`config_value`), `config_value`),
    `description` = VALUES(`description`),
    `update_date` = NOW();
