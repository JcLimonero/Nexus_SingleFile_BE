-- ============================================================================
-- MIGRACIÓN 008: Renombrar IdTotalDealer a IdDMS
-- ============================================================================
-- Descripción: Renombra las columnas IdTotalDealer a IdDMS para hacer el código más genérico
-- Prioridad: ALTA
-- Fecha: 2026-02-27
-- ============================================================================

-- Renombrar columna en ClientTotalRelation
ALTER TABLE `ClientTotalRelation` 
CHANGE COLUMN `IdTotalDealer` `IdDMS` VARCHAR(50) NULL DEFAULT NULL;

-- Renombrar columna en OrderByCar
ALTER TABLE `OrderByCar` 
CHANGE COLUMN `IdTotalDealer` `IdDMS` VARCHAR(50) NULL DEFAULT NULL;

-- Actualizar índices si existen
-- Nota: Los índices se actualizarán automáticamente con el cambio de nombre de columna

SELECT 'Migración 008 completada: Columnas IdTotalDealer renombradas a IdDMS' AS status;
