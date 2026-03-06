-- ============================================================================
-- MIGRACIÓN 004: Agregar Índices Compuestos Optimizados
-- ============================================================================
-- Descripción: Agrega índices compuestos para mejorar performance de queries frecuentes
-- Prioridad: ALTA
-- Fecha: 2026-02-27
-- ============================================================================

-- Índice 1: File - Búsquedas por agencia + estado + fecha (query más común)
-- Usado en: Files::getByAgency(), Analytics, Reportes
-- Eliminar índice si existe (ignorar error si no existe)
SET @sql = 'DROP INDEX `IDX_File_Agency_State_Date` ON `File`';
SET @ignore_error = 0;
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
CREATE INDEX `IDX_File_Agency_State_Date` 
    ON `File` (`IdAgency`, `IdCurrentState`, `RegistrationDate` DESC);

-- Índice 2: File - Búsquedas por cliente + proceso
-- Usado en: Queries que filtran por cliente y proceso
SET @sql = 'DROP INDEX `IDX_File_Client_Process` ON `File`';
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
CREATE INDEX `IDX_File_Client_Process` 
    ON `File` (`IdClient`, `IdProcess`);

-- Índice 3: File - Búsquedas por cliente + agencia + estado
-- Usado en: Validacion, Files por cliente y agencia
SET @sql = 'DROP INDEX `IDX_File_Client_Agency_State` ON `File`';
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
CREATE INDEX `IDX_File_Client_Agency_State` 
    ON `File` (`IdClient`, `IdAgency`, `IdCurrentState`);

-- Índice 4: ConfigurationProcess - Índice único para evitar duplicados
-- Ya existe un índice compuesto, pero este asegura unicidad
SET @sql = 'DROP INDEX `IDX_Config_Unique` ON `ConfigurationProcess`';
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
CREATE UNIQUE INDEX `IDX_Config_Unique` 
    ON `ConfigurationProcess` (`IdProcess`, `IdAgency`, `IdCustomerType`, `IdOperationType`);

-- Índice 5: DocumentByFile - Búsquedas por file + estado
-- Usado en: DocumentModel, queries de documentos por estado
SET @sql = 'DROP INDEX `IDX_DocumentByFile_File_Status` ON `DocumentByFile`';
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
CREATE INDEX `IDX_DocumentByFile_File_Status` 
    ON `DocumentByFile` (`IdFile`, `IdCurrentStatus`);

-- Índice 6: DocumentByFile - Búsquedas por tipo + estado
-- Usado en: Filtros por tipo de documento y estado
SET @sql = 'DROP INDEX `IDX_DocumentByFile_Type_Status` ON `DocumentByFile`';
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
CREATE INDEX `IDX_DocumentByFile_Type_Status` 
    ON `DocumentByFile` (`IdDocumentType`, `IdCurrentStatus`);

-- Índice 7: DocumentByFile - Búsquedas por file + tipo
-- Usado en: Verificar si un documento específico existe para un file
SET @sql = 'DROP INDEX `IDX_DocumentByFile_File_Type` ON `DocumentByFile`';
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
CREATE INDEX `IDX_DocumentByFile_File_Type` 
    ON `DocumentByFile` (`IdFile`, `IdDocumentType`);

-- Índice 8: Client_Total_Relation - Búsqueda por dealer + agencia (ya existe pero verificar)
-- El índice WDIDX_Client_Total_Relation_IdTotalDealerIdAgency ya existe
-- Agregar uno adicional para búsquedas inversas si es necesario

-- Índice 9: File - Búsquedas por OrderTotal (para JOINs con OrderByCar)
-- Usado en: JOINs frecuentes con OrderByCar
SET @sql = 'DROP INDEX `IDX_File_OrderTotal` ON `File`';
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
CREATE INDEX `IDX_File_OrderTotal` 
    ON `File` (`IdOrderTotal`);

-- Índice 10: File - Búsquedas por fecha de registro (para analytics y reportes)
-- Ya existe índice en RegistrationDate, pero agregar uno compuesto con estado
SET @sql = 'DROP INDEX `IDX_File_Date_State` ON `File`';
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
CREATE INDEX `IDX_File_Date_State` 
    ON `File` (`RegistrationDate` DESC, `IdCurrentState`);

SELECT 'Migración 004 completada: Índices compuestos agregados' AS status;
