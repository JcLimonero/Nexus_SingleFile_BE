-- Script SQL simple para actualizar la tabla File_Reasons
-- Ejecutar directamente en la base de datos

-- Agregar campos de auditoría
ALTER TABLE `File_Reasons` 
ADD COLUMN `Enabled` TINYINT DEFAULT 1 COMMENT 'Estado del motivo de rechazo: 1=Habilitado, 0=Deshabilitado';

ALTER TABLE `File_Reasons` 
ADD COLUMN `RegistrationDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro';

ALTER TABLE `File_Reasons` 
ADD COLUMN `UpdateDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última modificación';

ALTER TABLE `File_Reasons` 
ADD COLUMN `IdLastUserUpdate` BIGINT DEFAULT 0 COMMENT 'ID del último usuario que modificó el registro';

-- Crear índices para mejorar el rendimiento
CREATE INDEX `idx_file_reasons_enabled` ON `File_Reasons` (`Enabled`);
CREATE INDEX `idx_file_reasons_registration_date` ON `File_Reasons` (`RegistrationDate`);
CREATE INDEX `idx_file_reasons_update_date` ON `File_Reasons` (`UpdateDate`);
CREATE INDEX `idx_file_reasons_last_user_update` ON `File_Reasons` (`IdLastUserUpdate`);

-- Actualizar registros existentes
UPDATE `File_Reasons` 
SET 
    `Enabled` = 1,
    `RegistrationDate` = CURRENT_TIMESTAMP,
    `UpdateDate` = CURRENT_TIMESTAMP,
    `IdLastUserUpdate` = 0
WHERE `Enabled` IS NULL 
   OR `RegistrationDate` IS NULL 
   OR `UpdateDate` IS NULL 
   OR `IdLastUserUpdate` IS NULL;
