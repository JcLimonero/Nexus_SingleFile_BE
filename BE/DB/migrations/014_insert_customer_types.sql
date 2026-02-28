-- ============================================================================
-- MIGRACIÓN 014: Insertar Tipos de Cliente
-- ============================================================================
-- Descripción: Inserta los tipos básicos de cliente (Persona Física y Persona Moral)
-- Prioridad: ALTA
-- Fecha: 2026-02-27
-- ============================================================================

-- Insertar tipos de cliente con IDs específicos
INSERT INTO `customer_type` (`Id`, `Name`, `Enabled`, `RegistrationDate`, `UpdateDate`) VALUES
(1, 'Persona Física', 1, NOW(), NOW()),
(2, 'Persona Moral', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `Name` = VALUES(`Name`),
    `UpdateDate` = NOW();

SELECT 'Migración 014 completada: Tipos de cliente insertados' AS status;
