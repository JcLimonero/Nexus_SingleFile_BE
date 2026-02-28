-- ============================================================================
-- MIGRACIÓN 015: Insertar Tipos de Operación
-- ============================================================================
-- Descripción: Inserta los tipos básicos de operación para venta de autos
-- Prioridad: ALTA
-- Fecha: 2026-02-27
-- ============================================================================

-- Insertar tipos de operación con IDs específicos
INSERT INTO `operation_type` (`Id`, `Name`, `Enabled`, `RegistrationDate`, `UpdateDate`) VALUES
(1, 'Contado', 1, NOW(), NOW()),
(2, 'Financiamiento', 1, NOW(), NOW()),
(3, 'Arrendamiento', 1, NOW(), NOW()),
(4, 'Autofinanciamiento', 1, NOW(), NOW()),
(5, 'Credito Interno', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `Name` = VALUES(`Name`),
    `UpdateDate` = NOW();

SELECT 'Migración 015 completada: Tipos de operación insertados' AS status;
