-- ============================================================================
-- MIGRACIÓN 017: Actualizar Dominio de Emails de Usuarios
-- ============================================================================
-- Descripción: Actualiza el dominio de emails de @sistemas.com a @nexusqtech.com
-- Prioridad: MEDIA
-- Fecha: 2026-02-27
-- ============================================================================

-- Actualizar dominio de emails (maneja tanto @sistema.com como @sistemas.com)
UPDATE `user` 
SET `Mail` = REPLACE(REPLACE(`Mail`, '@sistemas.com', '@nexusqtech.com'), '@sistema.com', '@nexusqtech.com'),
    `UpdateDate` = NOW()
WHERE `Mail` LIKE '%@sistema.com' OR `Mail` LIKE '%@sistemas.com';

SELECT 'Migración 017 completada: Dominio de emails actualizado' AS status;
