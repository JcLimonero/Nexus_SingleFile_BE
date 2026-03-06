-- ============================================================================
-- MIGRACIÓN 011: Insertar Roles de Usuario
-- ============================================================================
-- Descripción: Inserta los roles básicos del sistema en la tabla user_role
-- Prioridad: ALTA
-- Fecha: 2026-02-27
-- ============================================================================

-- Insertar roles con IDs específicos y nombres en formato Title Case
INSERT INTO `user_role` (`Id`, `Name`, `Enabled`, `RegistrationDate`, `UpdateDate`) VALUES
(1, 'Asesor', 1, NOW(), NOW()),
(2, 'Operador Integracion', 1, NOW(), NOW()),
(3, 'Operador Liquidacion', 1, NOW(), NOW()),
(4, 'Operador Liberacion', 1, NOW(), NOW()),
(5, 'Coordinador De Operacion', 1, NOW(), NOW()),
(6, 'Gerente', 1, NOW(), NOW()),
(7, 'Administrador', 1, NOW(), NOW()),
(8, 'Soporte', 1, NOW(), NOW()),
(9, 'Auditoria', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    `Name` = VALUES(`Name`),
    `UpdateDate` = NOW();

SELECT 'Migración 011 completada: Roles de usuario insertados' AS status;
