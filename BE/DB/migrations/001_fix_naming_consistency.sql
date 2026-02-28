-- ============================================================================
-- MIGRACIÓN 001: Corrección de Consistencia en Nombres
-- ============================================================================
-- Descripción: Corrige nombres inconsistentes de tablas y columnas
-- Prioridad: ALTA
-- Fecha: 2026-02-27
-- ============================================================================

-- Paso 1: Renombrar tabla customertype a CustomerType (si existe como customertype)
-- Nota: Verificar primero si la tabla existe con el nombre actual
SET @table_exists = (
    SELECT COUNT(*) 
    FROM information_schema.tables 
    WHERE table_schema = DATABASE() 
    AND table_name = 'customertype'
);

SET @sql = IF(@table_exists > 0,
    'RENAME TABLE `customertype` TO `CustomerType`',
    'SELECT "Tabla customertype no existe, saltando renombrado" AS message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Paso 2: Corregir nombre de columna IdCostumerType a IdCustomerType en ConfigurationProcess
-- Primero verificar si la columna existe con el nombre incorrecto
SET @col_exists = (
    SELECT COUNT(*) 
    FROM information_schema.columns 
    WHERE table_schema = DATABASE() 
    AND table_name = 'ConfigurationProcess' 
    AND column_name = 'IdCostumerType'
);

SET @sql = IF(@col_exists > 0,
    'ALTER TABLE `ConfigurationProcess` CHANGE COLUMN `IdCostumerType` `IdCustomerType` BIGINT DEFAULT 0',
    'SELECT "Columna IdCostumerType no existe en ConfigurationProcess, saltando cambio" AS message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Paso 3: Corregir nombre de columna IdCostumerType a IdCustomerType en File
SET @col_exists = (
    SELECT COUNT(*) 
    FROM information_schema.columns 
    WHERE table_schema = DATABASE() 
    AND table_name = 'File' 
    AND column_name = 'IdCostumerType'
);

SET @sql = IF(@col_exists > 0,
    'ALTER TABLE `File` CHANGE COLUMN `IdCostumerType` `IdCustomerType` BIGINT',
    'SELECT "Columna IdCostumerType no existe en File, saltando cambio" AS message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Paso 4: Actualizar índices que referencian IdCostumerType
-- Eliminar índice antiguo si existe
DROP INDEX IF EXISTS `WDIDX_ConfigurationProcess_IdCostumerType` ON `ConfigurationProcess`;
DROP INDEX IF EXISTS `WDIDX_File_IdCostumerType` ON `File`;

-- Crear índices con el nombre correcto
CREATE INDEX IF NOT EXISTS `IDX_ConfigurationProcess_IdCustomerType` 
    ON `ConfigurationProcess` (`IdCustomerType`);
CREATE INDEX IF NOT EXISTS `IDX_File_IdCustomerType` 
    ON `File` (`IdCustomerType`);

-- Paso 5: Corregir Company.name a Company.Name (si existe como name)
SET @col_exists = (
    SELECT COUNT(*) 
    FROM information_schema.columns 
    WHERE table_schema = DATABASE() 
    AND table_name = 'Company' 
    AND column_name = 'name'
);

SET @sql = IF(@col_exists > 0,
    'ALTER TABLE `Company` CHANGE COLUMN `name` `Name` VARCHAR(100) NULL',
    'SELECT "Columna name no existe en Company, saltando cambio" AS message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT 'Migración 001 completada: Nombres corregidos' AS status;
