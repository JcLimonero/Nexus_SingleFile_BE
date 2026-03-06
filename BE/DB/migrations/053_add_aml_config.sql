-- ============================================================================
-- MIGRACIÓN 053: Agregar configuración AML (umbral UMA y valor UMA) en config
-- ============================================================================
-- Descripción: Mueve umbralUMA y valorUMA desde código a la tabla config.
--   - aml_umbral_uma: Umbral en unidades UMA (3210 según normativa PLD)
--   - aml_valor_uma: Valor diario de la UMA en pesos MXN (actualizar cuando INEGI publique)
-- Fecha: 2026-03-02
-- ============================================================================

INSERT INTO `config` (`config_key`, `config_value`, `category`, `description`, `sensitive`, `registration_date`, `update_date`) VALUES
('aml_umbral_uma', '3210', 'aml', 'Umbral AML en unidades UMA (normativa PLD). Operaciones que superen este monto por cliente/compañía activan alerta.', 0, NOW(), NOW()),
('aml_valor_uma', '113.14', 'aml', 'Valor diario de la UMA en pesos MXN. Actualizar cuando INEGI publique nuevo valor (vigente feb 2025 - ene 2026).', 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE 
  config_value = VALUES(config_value),
  description = VALUES(description),
  update_date = NOW();
