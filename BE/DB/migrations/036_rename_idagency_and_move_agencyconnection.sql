-- ============================================================================
-- MIGRACIÓN 036: Renombrar IdAgency a IdAgencyDMS y mover AgencyConnection
-- ============================================================================
-- Descripción: 
--   1. Renombra IdAgency a IdAgencyDMS en la tabla agency
--   2. Mueve AgencyConnection de agency a company
-- Prioridad: ALTA
-- Fecha: 2026-02-28
-- ============================================================================

-- Paso 1: Agregar columna AgencyConnection a company si no existe
ALTER TABLE `company` 
ADD COLUMN IF NOT EXISTS `AgencyConnection` VARCHAR(50) NULL AFTER `Enabled`;

-- Paso 2: Migrar datos de AgencyConnection de agency a company
-- (Solo si hay datos para migrar)
UPDATE `company` c
INNER JOIN (
    SELECT DISTINCT IdCompany, AgencyConnection 
    FROM `agency` 
    WHERE AgencyConnection IS NOT NULL AND AgencyConnection != ''
) a ON c.Id = a.IdCompany
SET c.AgencyConnection = a.AgencyConnection
WHERE c.AgencyConnection IS NULL;

-- Paso 3: Renombrar IdAgency a IdAgencyDMS en agency
ALTER TABLE `agency` 
CHANGE COLUMN `IdAgency` `IdAgencyDMS` VARCHAR(50) NULL;

-- Paso 4: Eliminar columna AgencyConnection de agency
ALTER TABLE `agency` 
DROP COLUMN IF EXISTS `AgencyConnection`;

-- Verificar cambios
SELECT 'Migración 036 completada' AS status;
SELECT 'agency' AS tabla, COLUMN_NAME, COLUMN_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'agency' 
AND COLUMN_NAME IN ('IdAgencyDMS', 'AgencyConnection')
UNION ALL
SELECT 'company' AS tabla, COLUMN_NAME, COLUMN_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'company' 
AND COLUMN_NAME = 'AgencyConnection';
