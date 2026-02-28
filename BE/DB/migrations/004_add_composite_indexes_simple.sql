-- ============================================================================
-- MIGRACIÓN 004: Agregar Índices Compuestos Optimizados (Versión Simple)
-- ============================================================================
-- Descripción: Agrega índices compuestos para mejorar performance de queries frecuentes
-- Prioridad: ALTA
-- Fecha: 2026-02-27
-- ============================================================================
-- Nota: Esta versión no intenta eliminar índices existentes, solo los crea
-- Si el índice ya existe, se mostrará un error que puede ignorarse

-- Índice 1: File - Búsquedas por agencia + estado + fecha (query más común)
CREATE INDEX `IDX_File_Agency_State_Date` 
    ON `File` (`IdAgency`, `IdCurrentState`, `RegistrationDate` DESC);

-- Índice 2: File - Búsquedas por cliente + proceso
CREATE INDEX `IDX_File_Client_Process` 
    ON `File` (`IdClient`, `IdProcess`);

-- Índice 3: File - Búsquedas por cliente + agencia + estado
CREATE INDEX `IDX_File_Client_Agency_State` 
    ON `File` (`IdClient`, `IdAgency`, `IdCurrentState`);

-- Índice 4: ConfigurationProcess - Índice único para evitar duplicados
CREATE UNIQUE INDEX `IDX_Config_Unique` 
    ON `ConfigurationProcess` (`IdProcess`, `IdAgency`, `IdCustomerType`, `IdOperationType`);

-- Índice 5: DocumentByFile - Búsquedas por file + estado
CREATE INDEX `IDX_DocumentByFile_File_Status` 
    ON `DocumentByFile` (`IdFile`, `IdCurrentStatus`);

-- Índice 6: DocumentByFile - Búsquedas por tipo + estado
CREATE INDEX `IDX_DocumentByFile_Type_Status` 
    ON `DocumentByFile` (`IdDocumentType`, `IdCurrentStatus`);

-- Índice 7: DocumentByFile - Búsquedas por file + tipo
CREATE INDEX `IDX_DocumentByFile_File_Type` 
    ON `DocumentByFile` (`IdFile`, `IdDocumentType`);

-- Índice 9: File - Búsquedas por OrderTotal (para JOINs con OrderByCar)
CREATE INDEX `IDX_File_OrderTotal` 
    ON `File` (`IdOrderTotal`);

-- Índice 10: File - Búsquedas por fecha de registro (para analytics y reportes)
CREATE INDEX `IDX_File_Date_State` 
    ON `File` (`RegistrationDate` DESC, `IdCurrentState`);

SELECT 'Migración 004 completada: Índices compuestos agregados' AS status;
