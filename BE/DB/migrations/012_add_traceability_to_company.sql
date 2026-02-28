-- ============================================================================
-- MIGRACIÓN 012: Agregar Columnas de Trazabilidad a Company
-- ============================================================================
-- Descripción: Agrega RegistrationDate, UpdateDate, IdLastUserUpdate y Enabled
-- Prioridad: ALTA
-- Fecha: 2026-02-27
-- ============================================================================

-- Agregar columnas de trazabilidad y Enabled
ALTER TABLE `company` 
ADD COLUMN `RegistrationDate` TIMESTAMP NULL DEFAULT NULL AFTER `name`,
ADD COLUMN `UpdateDate` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP AFTER `RegistrationDate`,
ADD COLUMN `IdLastUserUpdate` BIGINT NULL DEFAULT NULL AFTER `UpdateDate`,
ADD COLUMN `Enabled` TINYINT DEFAULT 1 AFTER `IdLastUserUpdate`;

-- Actualizar registros existentes con fecha de registro
UPDATE `company` SET `RegistrationDate` = NOW() WHERE `RegistrationDate` IS NULL;
UPDATE `company` SET `UpdateDate` = NOW() WHERE `UpdateDate` IS NULL;
UPDATE `company` SET `Enabled` = 1 WHERE `Enabled` IS NULL;

SELECT 'Migración 012 completada: Columnas de trazabilidad agregadas a company' AS status;
