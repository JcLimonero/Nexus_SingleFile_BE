-- ============================================================================
-- MIGRACIÓN 039: Convertir tabla order a snake_case
-- ============================================================================
-- Descripción: Convierte las columnas de la tabla order de PascalCase a snake_case
-- Prioridad: ALTA
-- Fecha: 2026-02-27
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================================
-- Tabla: order
-- ============================================================================
ALTER TABLE `order` CHANGE COLUMN `Id` `id` BIGINT NOT NULL PRIMARY KEY;
ALTER TABLE `order` CHANGE COLUMN `Number` `number` VARCHAR(50);
ALTER TABLE `order` CHANGE COLUMN `CarType` `car_type` VARCHAR(200);
ALTER TABLE `order` CHANGE COLUMN `Year` `year` INT DEFAULT 0;
ALTER TABLE `order` CHANGE COLUMN `VIN` `vin` VARCHAR(50);
ALTER TABLE `order` CHANGE COLUMN `RegistrationDate` `registration_date` TIMESTAMP NULL;
ALTER TABLE `order` CHANGE COLUMN `UpdateDate` `update_date` TIMESTAMP NULL;
ALTER TABLE `order` CHANGE COLUMN `IdLastUserUpdate` `id_last_user_update` BIGINT DEFAULT 0;
ALTER TABLE `order` CHANGE COLUMN `Enabled` `enabled` TINYINT(1) DEFAULT 1;
ALTER TABLE `order` CHANGE COLUMN `Model` `model` VARCHAR(200);
ALTER TABLE `order` CHANGE COLUMN `Advisor` `advisor` VARCHAR(200);
ALTER TABLE `order` CHANGE COLUMN `IdDMS` `id_dms` VARCHAR(50);
ALTER TABLE `order` CHANGE COLUMN `idAgency` `id_agency` VARCHAR(100);
-- amount ya está en snake_case

SET FOREIGN_KEY_CHECKS = 1;

SELECT 'Migración 039 completada: Tabla order convertida a snake_case' AS status;
