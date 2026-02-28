-- ============================================================================
-- MIGRACIÓN 019: Insertar Estados de Archivo (file_status)
-- ============================================================================
-- Descripción: Inserta los estados de archivo requeridos
-- Prioridad: MEDIA
-- Fecha: 2026-02-27
-- ============================================================================

-- Insertar estados de archivo (usando INSERT IGNORE para evitar duplicados)
INSERT IGNORE INTO `file_status` (`Id`, `Name`) VALUES
(1, 'Integración'),
(2, 'Liquidación'),
(3, 'Liberación'),
(4, 'Liberado'),
(5, 'Cancelado'),
(6, 'Liberado por Excepción');

-- Verificar inserción
SELECT 'Migración 019 completada: Estados de archivo insertados' AS status;
SELECT Id, Name FROM `file_status` ORDER BY Id;
