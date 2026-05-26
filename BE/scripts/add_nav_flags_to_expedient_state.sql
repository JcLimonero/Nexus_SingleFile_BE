-- Add navigation/upload/terminal flags to expedient_state.
-- Mirrors BE/app/Database/Migrations/2026-05-26-000001_AddNavFlagsToExpedientState.php
-- Idempotente: safe to re-run on tenants already provisioned.
-- Apply via the PHP wrapper pattern in BE/scripts/ (lee creds del .env).

-- 1. is_navigable (default 1 — preserva comportamiento previo)
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'expedient_state'
      AND COLUMN_NAME = 'is_navigable');
SET @sql := IF(@col_exists = 0,
    'ALTER TABLE `expedient_state` ADD COLUMN `is_navigable` TINYINT(1) NOT NULL DEFAULT 1 AFTER `requires_payment_voucher`',
    'SELECT ''is_navigable already exists''');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 2. allows_document_upload (default 0 — estricto)
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'expedient_state'
      AND COLUMN_NAME = 'allows_document_upload');
SET @sql := IF(@col_exists = 0,
    'ALTER TABLE `expedient_state` ADD COLUMN `allows_document_upload` TINYINT(1) NOT NULL DEFAULT 0 AFTER `is_navigable`',
    'SELECT ''allows_document_upload already exists''');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 3. is_terminal (default 0)
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'expedient_state'
      AND COLUMN_NAME = 'is_terminal');
SET @sql := IF(@col_exists = 0,
    'ALTER TABLE `expedient_state` ADD COLUMN `is_terminal` TINYINT(1) NOT NULL DEFAULT 0 AFTER `allows_document_upload`',
    'SELECT ''is_terminal already exists''');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 4. Backfill por id canónico (los 6 ids son fijos en data.sql).
UPDATE `expedient_state` SET `is_navigable`=1, `allows_document_upload`=1, `is_terminal`=0 WHERE `id`=1; -- Integración
UPDATE `expedient_state` SET `is_navigable`=1, `allows_document_upload`=1, `is_terminal`=0 WHERE `id`=2; -- Liquidación
UPDATE `expedient_state` SET `is_navigable`=1, `allows_document_upload`=0, `is_terminal`=0 WHERE `id`=3; -- Liberación
UPDATE `expedient_state` SET `is_navigable`=0, `allows_document_upload`=0, `is_terminal`=1 WHERE `id`=4; -- Liberado
UPDATE `expedient_state` SET `is_navigable`=0, `allows_document_upload`=0, `is_terminal`=1 WHERE `id`=5; -- Cancelado
UPDATE `expedient_state` SET `is_navigable`=0, `allows_document_upload`=0, `is_terminal`=1 WHERE `id`=6; -- Liberado por Excepción
