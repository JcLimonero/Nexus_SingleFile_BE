-- Agrega display_order para ordenar fases navegables en sidebar (modo legacy_all).
-- Mirrors BE/app/Database/Migrations/2026-05-26-000003_AddDisplayOrderToExpedientState.php
-- Idempotente: safe to re-run.

SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'expedient_state'
      AND COLUMN_NAME = 'display_order');
SET @sql := IF(@col_exists = 0,
    'ALTER TABLE `expedient_state` ADD COLUMN `display_order` INT NULL DEFAULT NULL AFTER `is_system`',
    'SELECT ''display_order already exists''');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Backfill: solo navegables, incrementos de 10 (espacio para insertar).
UPDATE `expedient_state` SET `display_order` = 10   WHERE `id` = 1; -- Integración
UPDATE `expedient_state` SET `display_order` = 20   WHERE `id` = 2; -- Liquidación
UPDATE `expedient_state` SET `display_order` = 30   WHERE `id` = 3; -- Liberación
UPDATE `expedient_state` SET `display_order` = NULL WHERE `id` IN (4, 5, 6); -- terminales
