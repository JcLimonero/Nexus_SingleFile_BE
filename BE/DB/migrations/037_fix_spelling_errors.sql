-- ============================================================================
-- MIGRACIÓN 037: Corregir errores de ortografía en tablas y columnas
-- ============================================================================
-- Descripción: Corrige errores de ortografía en nombres de tablas y columnas
-- Prioridad: ALTA
-- Fecha: 2026-02-28
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Corregir CostumerType → CustomerType (tabla)
-- Nota: La tabla ya existe como 'customer_type' en snake_case, pero el código usa 'CostumerType'
-- Verificamos primero si existe como 'CostumerType' o 'customer_type'
SET @tableExists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES 
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'CostumerType');
SET @tableExistsSnake = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES 
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'customer_type');

-- Si existe CostumerType, renombrar a CustomerType
SET @sql = IF(@tableExists > 0, 
    'RENAME TABLE `CostumerType` TO `CustomerType`',
    'SELECT "Tabla CostumerType no existe, ya está como customer_type" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 2. Corregir IdCostumerType → IdCustomerType en todas las tablas
-- ConfigurationProcess
SET @colExists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'configuration_process' 
    AND COLUMN_NAME = 'IdCostumerType');
SET @sql = IF(@colExists > 0,
    'ALTER TABLE `configuration_process` CHANGE COLUMN `IdCostumerType` `IdCustomerType` BIGINT DEFAULT 0',
    'SELECT "Columna IdCostumerType no existe en configuration_process" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- File
SET @colExists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'file' 
    AND COLUMN_NAME = 'IdCostumerType');
SET @sql = IF(@colExists > 0,
    'ALTER TABLE `file` CHANGE COLUMN `IdCostumerType` `IdCustomerType` BIGINT',
    'SELECT "Columna IdCostumerType no existe en file" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 3. Corregir ExperationDate → ExpirationDate en DocumentByFile
SET @colExists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'document_by_file' 
    AND COLUMN_NAME = 'ExperationDate');
SET @sql = IF(@colExists > 0,
    'ALTER TABLE `document_by_file` CHANGE COLUMN `ExperationDate` `ExpirationDate` TIMESTAMP NULL',
    'SELECT "Columna ExperationDate no existe en document_by_file" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 4. Corregir IdInventary → IdInventory en File
SET @colExists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'file' 
    AND COLUMN_NAME = 'IdInventary');
SET @sql = IF(@colExists > 0,
    'ALTER TABLE `file` CHANGE COLUMN `IdInventary` `IdInventory` VARCHAR(50)',
    'SELECT "Columna IdInventary no existe en file" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 5. Corregir OtuputDate → OutputDate en File_Tracking
SET @colExists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'file_tracking' 
    AND COLUMN_NAME = 'OtuputDate');
SET @sql = IF(@colExists > 0,
    'ALTER TABLE `file_tracking` CHANGE COLUMN `OtuputDate` `OutputDate` TIMESTAMP NULL',
    'SELECT "Columna OtuputDate no existe en file_tracking" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 6. Corregir File_Release_Steaps → File_Release_Steps
SET @tableExists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES 
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'File_Release_Steaps');
SET @sql = IF(@tableExists > 0,
    'RENAME TABLE `File_Release_Steaps` TO `File_Release_Steps`',
    'SELECT "Tabla File_Release_Steaps no existe" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET FOREIGN_KEY_CHECKS = 1;

SELECT 'Migración 037 completada: Errores de ortografía corregidos' AS status;
