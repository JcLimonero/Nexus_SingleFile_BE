-- Marca fases base del sistema (Integración + Liquidación) como is_system=1.
-- Mirrors BE/app/Database/Migrations/2026-05-26-000002_AddIsSystemToExpedientState.php
-- Idempotente: safe to re-run.

SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'expedient_state'
      AND COLUMN_NAME = 'is_system');
SET @sql := IF(@col_exists = 0,
    'ALTER TABLE `expedient_state` ADD COLUMN `is_system` TINYINT(1) NOT NULL DEFAULT 0 AFTER `is_terminal`',
    'SELECT ''is_system already exists''');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Backfill: solo Integración (1) y Liquidación (2).
-- Las otras 4 (Liberación, Liberado, Cancelado, Liberado por Excepción)
-- NO son system — el admin puede removerlas si cambia el flujo.
UPDATE `expedient_state` SET `is_system` = 1 WHERE `id` IN (1, 2);
UPDATE `expedient_state` SET `is_system` = 0 WHERE `id` NOT IN (1, 2);
