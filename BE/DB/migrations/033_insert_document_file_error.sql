-- ============================================================================
-- MIGRACIÓN 033: Insertar motivos de error en document_file_error
-- ============================================================================
-- Descripción: Inserta los mismos motivos de error que se agregaron a 
--              file_reasons en la tabla document_file_error
-- Prioridad: MEDIA
-- Fecha: 2026-02-28
-- ============================================================================

-- Insertar motivos de error de documentos (usando INSERT IGNORE para evitar duplicados)
-- Nota: Los nombres están en Title Case (no en MAYÚSCULAS)
INSERT IGNORE INTO `document_file_error` 
(`Id`, `Description`, `RegistrationDate`, `UpdateDate`, `IdLastUserUpdate`, `Enabled`) 
VALUES
(1, 'Documento Vencido', NOW(), NOW(), 1, 1),
(2, 'Documento No Legible', NOW(), NOW(), 1, 1),
(3, 'Dcto. Vencido y No Legible', NOW(), NOW(), 1, 1),
(4, 'Dcto. No Correspondiente', NOW(), NOW(), 1, 1),
(5, 'Informacion No Corresponde', NOW(), NOW(), 1, 1),
(6, 'Documento Incompleto', NOW(), NOW(), 1, 1),
(7, 'Firma No Coincide', NOW(), NOW(), 1, 1),
(8, 'Corrección de Expediente', NOW(), NOW(), 1, 1);

-- Verificar inserción
SELECT 'Migración 033 completada: Motivos de error insertados en document_file_error' AS status;
SELECT Id, Description, Enabled FROM `document_file_error` ORDER BY Id;
