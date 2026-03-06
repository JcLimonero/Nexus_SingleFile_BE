-- ============================================================================
-- MIGRACIÓN 064: Agregar umbral 6420 UMA para reportar a fin de mes
-- ============================================================================
-- aml_umbral_reportar_uma: Operaciones que superen 6420 UMA deben reportarse
-- a final de mes ante la autoridad.
-- ============================================================================

INSERT INTO `config` (`config_key`, `config_value`, `category`, `description`, `sensitive`, `registration_date`, `update_date`) VALUES
('aml_umbral_reportar_uma', '6420', 'aml', 'Umbral para reportar a fin de mes (UMA). Operaciones que superen este monto por cliente/compañía deben reportarse ante la autoridad.', 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE
  config_value = VALUES(config_value),
  description = VALUES(description),
  update_date = NOW();
