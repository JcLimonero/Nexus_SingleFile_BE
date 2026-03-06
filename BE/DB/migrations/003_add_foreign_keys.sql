-- ============================================================================
-- MIGRACIÓN 003: Agregar Foreign Keys Faltantes
-- ============================================================================
-- Descripción: Agrega foreign keys para integridad referencial
-- Prioridad: ALTA
-- Fecha: 2026-02-27
-- ============================================================================
-- NOTA: Este script puede fallar si existen registros huérfanos.
-- Ejecutar primero queries de verificación para encontrar datos inconsistentes.

-- Verificar datos huérfanos antes de agregar FKs
SELECT 'Verificando datos huérfanos...' AS check_step;

-- File.IdClient -> Client.Id (a través de HeaderClient)
SELECT COUNT(*) AS orphan_files_client 
FROM `File` f
LEFT JOIN `HeaderClient` hc ON f.IdClient = hc.IdClient
WHERE hc.Id IS NULL AND f.IdClient IS NOT NULL;

-- File.IdCustomerType -> CustomerType.Id
SELECT COUNT(*) AS orphan_files_customertype 
FROM `File` f
LEFT JOIN `CustomerType` ct ON f.IdCustomerType = ct.Id
WHERE ct.Id IS NULL AND f.IdCustomerType IS NOT NULL;

-- ConfigurationProcess.IdCustomerType -> CustomerType.Id
SELECT COUNT(*) AS orphan_config_customertype 
FROM `ConfigurationProcess` cp
LEFT JOIN `CustomerType` ct ON cp.IdCustomerType = ct.Id
WHERE ct.Id IS NULL AND cp.IdCustomerType IS NOT NULL;

-- ConfigurationProcess.IdAgency -> Agency.Id
SELECT COUNT(*) AS orphan_config_agency 
FROM `ConfigurationProcess` cp
LEFT JOIN `Agency` a ON cp.IdAgency = a.Id
WHERE a.Id IS NULL AND cp.IdAgency IS NOT NULL;

-- Client_Total_Relation.idHeaderClient -> HeaderClient.Id
SELECT COUNT(*) AS orphan_ctr_headerclient 
FROM `Client_Total_Relation` ctr
LEFT JOIN `HeaderClient` hc ON ctr.idHeaderClient = hc.Id
WHERE hc.Id IS NULL AND ctr.idHeaderClient IS NOT NULL;

-- Client_Total_Relation.IdAgency -> Agency.Id
SELECT COUNT(*) AS orphan_ctr_agency 
FROM `Client_Total_Relation` ctr
LEFT JOIN `Agency` a ON ctr.IdAgency = a.Id
WHERE a.Id IS NULL AND ctr.IdAgency IS NOT NULL;

-- Agregar Foreign Keys (solo si no existen)

-- File.IdCustomerType -> CustomerType.Id
-- Primero eliminar FK antigua si existe con nombre diferente
SET @fk_exists = (
    SELECT COUNT(*) 
    FROM information_schema.table_constraints 
    WHERE table_schema = DATABASE() 
    AND table_name = 'File' 
    AND constraint_type = 'FOREIGN KEY'
    AND constraint_name LIKE '%CustomerType%'
);

SET @sql = IF(@fk_exists = 0,
    'ALTER TABLE `File` ADD CONSTRAINT `FK_File_CustomerType` 
        FOREIGN KEY (`IdCustomerType`) REFERENCES `CustomerType`(`Id`) 
        ON DELETE RESTRICT ON UPDATE CASCADE',
    'SELECT "FK File->CustomerType ya existe" AS message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ConfigurationProcess.IdCustomerType -> CustomerType.Id
SET @fk_exists = (
    SELECT COUNT(*) 
    FROM information_schema.table_constraints 
    WHERE table_schema = DATABASE() 
    AND table_name = 'ConfigurationProcess' 
    AND constraint_type = 'FOREIGN KEY'
    AND constraint_name LIKE '%CustomerType%'
);

SET @sql = IF(@fk_exists = 0,
    'ALTER TABLE `ConfigurationProcess` ADD CONSTRAINT `FK_Config_CustomerType` 
        FOREIGN KEY (`IdCustomerType`) REFERENCES `CustomerType`(`Id`) 
        ON DELETE RESTRICT ON UPDATE CASCADE',
    'SELECT "FK ConfigurationProcess->CustomerType ya existe" AS message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ConfigurationProcess.IdAgency -> Agency.Id
SET @fk_exists = (
    SELECT COUNT(*) 
    FROM information_schema.table_constraints 
    WHERE table_schema = DATABASE() 
    AND table_name = 'ConfigurationProcess' 
    AND constraint_type = 'FOREIGN KEY'
    AND constraint_name LIKE '%Agency%'
);

SET @sql = IF(@fk_exists = 0,
    'ALTER TABLE `ConfigurationProcess` ADD CONSTRAINT `FK_Config_Agency` 
        FOREIGN KEY (`IdAgency`) REFERENCES `Agency`(`Id`) 
        ON DELETE RESTRICT ON UPDATE CASCADE',
    'SELECT "FK ConfigurationProcess->Agency ya existe" AS message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ConfigurationProcess.IdProcess -> Process.Id
SET @fk_exists = (
    SELECT COUNT(*) 
    FROM information_schema.table_constraints 
    WHERE table_schema = DATABASE() 
    AND table_name = 'ConfigurationProcess' 
    AND constraint_type = 'FOREIGN KEY'
    AND constraint_name LIKE '%Process%'
);

SET @sql = IF(@fk_exists = 0,
    'ALTER TABLE `ConfigurationProcess` ADD CONSTRAINT `FK_Config_Process` 
        FOREIGN KEY (`IdProcess`) REFERENCES `Process`(`Id`) 
        ON DELETE RESTRICT ON UPDATE CASCADE',
    'SELECT "FK ConfigurationProcess->Process ya existe" AS message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ConfigurationProcess.IdOperationType -> OperationType.Id
SET @fk_exists = (
    SELECT COUNT(*) 
    FROM information_schema.table_constraints 
    WHERE table_schema = DATABASE() 
    AND table_name = 'ConfigurationProcess' 
    AND constraint_type = 'FOREIGN KEY'
    AND constraint_name LIKE '%OperationType%'
);

SET @sql = IF(@fk_exists = 0,
    'ALTER TABLE `ConfigurationProcess` ADD CONSTRAINT `FK_Config_OperationType` 
        FOREIGN KEY (`IdOperationType`) REFERENCES `OperationType`(`Id`) 
        ON DELETE RESTRICT ON UPDATE CASCADE',
    'SELECT "FK ConfigurationProcess->OperationType ya existe" AS message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Client_Total_Relation.idHeaderClient -> HeaderClient.Id
SET @fk_exists = (
    SELECT COUNT(*) 
    FROM information_schema.table_constraints 
    WHERE table_schema = DATABASE() 
    AND table_name = 'Client_Total_Relation' 
    AND constraint_type = 'FOREIGN KEY'
    AND constraint_name LIKE '%HeaderClient%'
);

SET @sql = IF(@fk_exists = 0,
    'ALTER TABLE `Client_Total_Relation` ADD CONSTRAINT `FK_CTR_HeaderClient` 
        FOREIGN KEY (`idHeaderClient`) REFERENCES `HeaderClient`(`Id`) 
        ON DELETE CASCADE ON UPDATE CASCADE',
    'SELECT "FK Client_Total_Relation->HeaderClient ya existe" AS message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Client_Total_Relation.IdAgency -> Agency.Id
SET @fk_exists = (
    SELECT COUNT(*) 
    FROM information_schema.table_constraints 
    WHERE table_schema = DATABASE() 
    AND table_name = 'Client_Total_Relation' 
    AND constraint_type = 'FOREIGN KEY'
    AND constraint_name LIKE '%Agency%'
);

SET @sql = IF(@fk_exists = 0,
    'ALTER TABLE `Client_Total_Relation` ADD CONSTRAINT `FK_CTR_Agency` 
        FOREIGN KEY (`IdAgency`) REFERENCES `Agency`(`Id`) 
        ON DELETE RESTRICT ON UPDATE CASCADE',
    'SELECT "FK Client_Total_Relation->Agency ya existe" AS message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT 'Migración 003 completada: Foreign Keys agregados' AS status;
