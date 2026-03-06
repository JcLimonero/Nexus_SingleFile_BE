-- ============================================================================
-- MIGRACIÓN 002: Agregar Constraints NOT NULL en Columnas Críticas
-- ============================================================================
-- Descripción: Agrega NOT NULL a columnas críticas para integridad de datos
-- Prioridad: ALTA
-- Fecha: 2026-02-27
-- ============================================================================
-- NOTA: Este script puede fallar si existen registros con valores NULL.
-- Ejecutar primero: SELECT para verificar datos NULL antes de aplicar.

-- Verificar datos NULL antes de aplicar constraints
SELECT 'Verificando datos NULL en File...' AS check_step;
SELECT COUNT(*) AS null_idclient FROM `File` WHERE `IdClient` IS NULL;
SELECT COUNT(*) AS null_idagency FROM `File` WHERE `IdAgency` IS NULL;
SELECT COUNT(*) AS null_idprocess FROM `File` WHERE `IdProcess` IS NULL;
SELECT COUNT(*) AS null_idcustomertype FROM `File` WHERE `IdCustomerType` IS NULL;

-- Tabla File: Columnas críticas
-- Nota: Si hay NULLs, actualizar primero con valores por defecto o eliminar registros inválidos

-- IdClient: NO puede ser NULL (un File siempre debe tener un cliente)
ALTER TABLE `File` 
    MODIFY COLUMN `IdClient` BIGINT NOT NULL;

-- IdAgency: NO puede ser NULL
ALTER TABLE `File` 
    MODIFY COLUMN `IdAgency` BIGINT NOT NULL;

-- IdProcess: NO puede ser NULL
ALTER TABLE `File` 
    MODIFY COLUMN `IdProcess` BIGINT NOT NULL;

-- IdCustomerType: NO puede ser NULL (ya corregido el nombre en migración 001)
ALTER TABLE `File` 
    MODIFY COLUMN `IdCustomerType` BIGINT NOT NULL;

-- IdCurrentState: NO puede ser NULL, con default 0
ALTER TABLE `File` 
    MODIFY COLUMN `IdCurrentState` INTEGER NOT NULL DEFAULT 0;

-- RegistrationDate: NO puede ser NULL, con default CURRENT_TIMESTAMP
ALTER TABLE `File` 
    MODIFY COLUMN `RegistrationDate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- UpdateDate: Puede ser NULL inicialmente, pero se actualiza automáticamente
ALTER TABLE `File` 
    MODIFY COLUMN `UpdateDate` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP;

-- Tabla ConfigurationProcess: Columnas críticas
SELECT 'Verificando datos NULL en ConfigurationProcess...' AS check_step;
SELECT COUNT(*) AS null_idprocess FROM `ConfigurationProcess` WHERE `IdProcess` IS NULL;
SELECT COUNT(*) AS null_idagency FROM `ConfigurationProcess` WHERE `IdAgency` IS NULL;
SELECT COUNT(*) AS null_idcustomertype FROM `ConfigurationProcess` WHERE `IdCustomerType` IS NULL;
SELECT COUNT(*) AS null_idoperationtype FROM `ConfigurationProcess` WHERE `IdOperationType` IS NULL;

ALTER TABLE `ConfigurationProcess` 
    MODIFY COLUMN `IdProcess` BIGINT NOT NULL;

ALTER TABLE `ConfigurationProcess` 
    MODIFY COLUMN `IdAgency` BIGINT NOT NULL;

ALTER TABLE `ConfigurationProcess` 
    MODIFY COLUMN `IdCustomerType` BIGINT NOT NULL;

ALTER TABLE `ConfigurationProcess` 
    MODIFY COLUMN `IdOperationType` BIGINT NOT NULL;

-- Tabla Client_Total_Relation: Columnas críticas
SELECT 'Verificando datos NULL en Client_Total_Relation...' AS check_step;
SELECT COUNT(*) AS null_idtotaldealer FROM `Client_Total_Relation` WHERE `IdTotalDealer` IS NULL;
SELECT COUNT(*) AS null_idagency FROM `Client_Total_Relation` WHERE `IdAgency` IS NULL;
SELECT COUNT(*) AS null_idheaderclient FROM `Client_Total_Relation` WHERE `idHeaderClient` IS NULL;

ALTER TABLE `Client_Total_Relation` 
    MODIFY COLUMN `IdTotalDealer` VARCHAR(50) NOT NULL;

ALTER TABLE `Client_Total_Relation` 
    MODIFY COLUMN `IdAgency` BIGINT NOT NULL;

ALTER TABLE `Client_Total_Relation` 
    MODIFY COLUMN `idHeaderClient` BIGINT NOT NULL;

-- Tabla HeaderClient: Columnas críticas
SELECT 'Verificando datos NULL en HeaderClient...' AS check_step;
SELECT COUNT(*) AS null_idclient FROM `HeaderClient` WHERE `IdClient` IS NULL;

ALTER TABLE `HeaderClient` 
    MODIFY COLUMN `IdClient` BIGINT NOT NULL;

-- Tabla Client: Corregir UpdateDate de VARCHAR a TIMESTAMP
SELECT 'Corrigiendo tipo de UpdateDate en Client...' AS check_step;
ALTER TABLE `Client` 
    MODIFY COLUMN `UpdateDate` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP;

-- Tabla DocumentByFile: Columnas críticas
SELECT 'Verificando datos NULL en DocumentByFile...' AS check_step;
SELECT COUNT(*) AS null_idfile FROM `DocumentByFile` WHERE `IdFile` IS NULL;
SELECT COUNT(*) AS null_iddocumenttype FROM `DocumentByFile` WHERE `IdDocumentType` IS NULL;

ALTER TABLE `DocumentByFile` 
    MODIFY COLUMN `IdFile` BIGINT NOT NULL;

ALTER TABLE `DocumentByFile` 
    MODIFY COLUMN `IdDocumentType` BIGINT NOT NULL;

ALTER TABLE `DocumentByFile` 
    MODIFY COLUMN `IdCurrentStatus` INTEGER NOT NULL DEFAULT 1;

ALTER TABLE `DocumentByFile` 
    MODIFY COLUMN `RegistrationDate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

SELECT 'Migración 002 completada: Constraints NOT NULL agregados' AS status;
