-- ============================================================================
-- MIGRACIÓN 029: Insertar Estados de Documento (document_file_status)
-- ============================================================================
-- Descripción: Inserta los estados de documento requeridos
-- Prioridad: MEDIA
-- Fecha: 2026-02-28
-- ============================================================================

-- Insertar estados de documento (usando INSERT IGNORE para evitar duplicados)
INSERT IGNORE INTO `document_file_status` 
(`Id`, `Name`, `RegistrationDate`, `UpdateDate`, `IdLastUserUpdate`, `Enabled`) 
VALUES
(1, 'Documento Nuevo', NOW(), NOW(), NULL, 1),
(2, 'Documento Cargado', NOW(), NOW(), NULL, 1),
(3, 'Documento en Revisión', NOW(), NOW(), NULL, 1),
(4, 'Documento Aprobado', NOW(), NOW(), NULL, 1),
(5, 'Documento Rechazado', NOW(), NOW(), NULL, 1),
(6, 'Documento Caduco', NOW(), NOW(), NULL, 1);

-- Verificar inserción
SELECT 'Migración 029 completada: Estados de documento insertados' AS status;
SELECT Id, Name, Enabled FROM `document_file_status` ORDER BY Id;
