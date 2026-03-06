-- ============================================================================
-- MIGRACIÓN 061: Corregir id_last_user_update en user_activity_logs
-- ============================================================================
-- El DEFAULT 0 provoca error FK: user.id no tiene registro con id=0.
-- La FK permite NULL (ON DELETE SET NULL). Cambiar default a NULL.
-- ============================================================================

-- Corregir filas existentes con 0 (inválido para FK)
UPDATE `user_activity_logs` SET `id_last_user_update` = NULL WHERE `id_last_user_update` = 0;

-- Cambiar columna: permitir NULL y default NULL
ALTER TABLE `user_activity_logs`
  MODIFY COLUMN `id_last_user_update` BIGINT NULL DEFAULT NULL;

SELECT 'Migración 061 completada: id_last_user_update en user_activity_logs corregido' AS status;
