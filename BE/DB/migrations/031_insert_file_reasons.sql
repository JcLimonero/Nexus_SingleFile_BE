-- ============================================================================
-- MIGRACIÓN 031: Insertar Motivos de Corrección de Expediente (file_reasons)
-- ============================================================================
-- Descripción: Inserta los motivos de corrección de expediente requeridos
-- Prioridad: MEDIA
-- Fecha: 2026-02-28
-- ============================================================================

-- Insertar motivos de corrección (usando INSERT IGNORE para evitar duplicados)
-- Nota: Los nombres están en Title Case (no en MAYÚSCULAS)
INSERT IGNORE INTO `file_reasons` 
(`Id`, `Name`, `IdTypeReason`, `Enabled`, `RegistrationDate`, `UpdateDate`, `IdLastUserUpdate`) 
VALUES
(1, 'Documento Vencido', 0, 1, NOW(), NOW(), 1),
(2, 'Documento No Legible', 0, 1, NOW(), NOW(), 1),
(3, 'Dcto. Vencido y No Legible', 0, 1, NOW(), NOW(), 1),
(4, 'Dcto. No Correspondiente', 0, 1, NOW(), NOW(), 1),
(5, 'Informacion No Corresponde', 0, 1, NOW(), NOW(), 1),
(6, 'Documento Incompleto', 0, 1, NOW(), NOW(), 1),
(7, 'Firma No Coincide', 0, 1, NOW(), NOW(), 1),
(8, 'Corrección de Expediente', 0, 1, NOW(), NOW(), 1);

-- Verificar inserción
SELECT 'Migración 031 completada: Motivos de corrección insertados' AS status;
SELECT Id, Name, Enabled FROM `file_reasons` ORDER BY Id;
