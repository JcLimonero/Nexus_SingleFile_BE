-- ============================================================================
-- MIGRACIÓN 013: Insertar Procesos de Venta de Autos
-- ============================================================================
-- Descripción: Inserta los procesos básicos del sistema
-- Prioridad: ALTA
-- Fecha: 2026-02-27
-- ============================================================================

-- Insertar procesos con IDs específicos
INSERT INTO `process` (`Id`, `Name`, `Enabled`, `RegistrationDate`, `UpdateDate`) VALUES
(1, 'Autos Nuevos', 1, NOW(), NOW()),
(2, 'Autos Seminuevos', 1, NOW(), NOW()),
(3, 'Motos Nuevos', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `Name` = VALUES(`Name`),
    `UpdateDate` = NOW();

SELECT 'Migración 013 completada: Procesos de venta de autos insertados' AS status;
