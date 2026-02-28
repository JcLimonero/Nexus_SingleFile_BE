-- ============================================================================
-- MIGRACIÓN 032: Convertir file_reasons de MAYÚSCULAS a Title Case
-- ============================================================================
-- Descripción: Convierte los nombres de los motivos de MAYÚSCULAS a formato 
--              Title Case (primera letra de cada palabra en mayúscula)
-- Prioridad: MEDIA
-- Fecha: 2026-02-28
-- ============================================================================

-- Actualizar nombres a Title Case
UPDATE `file_reasons` SET `Name` = 'Documento Vencido', `UpdateDate` = NOW() WHERE `Id` = 1;
UPDATE `file_reasons` SET `Name` = 'Documento No Legible', `UpdateDate` = NOW() WHERE `Id` = 2;
UPDATE `file_reasons` SET `Name` = 'Dcto. Vencido y No Legible', `UpdateDate` = NOW() WHERE `Id` = 3;
UPDATE `file_reasons` SET `Name` = 'Dcto. No Correspondiente', `UpdateDate` = NOW() WHERE `Id` = 4;
UPDATE `file_reasons` SET `Name` = 'Informacion No Corresponde', `UpdateDate` = NOW() WHERE `Id` = 5;
UPDATE `file_reasons` SET `Name` = 'Documento Incompleto', `UpdateDate` = NOW() WHERE `Id` = 6;
UPDATE `file_reasons` SET `Name` = 'Firma No Coincide', `UpdateDate` = NOW() WHERE `Id` = 7;
UPDATE `file_reasons` SET `Name` = 'Corrección de Expediente', `UpdateDate` = NOW() WHERE `Id` = 8;

-- Verificar actualización
SELECT 'Migración 032 completada: Motivos convertidos a Title Case' AS status;
SELECT Id, Name FROM `file_reasons` ORDER BY Id;
