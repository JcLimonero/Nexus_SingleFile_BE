-- ============================================================================
-- MIGRACIÓN 016: Insertar Usuarios de Prueba
-- ============================================================================
-- Descripción: Inserta usuarios de prueba con diferentes roles y permisos
-- Prioridad: MEDIA
-- Fecha: 2026-02-27
-- ============================================================================
-- NOTA: Las contraseñas están hasheadas con password_hash()
-- Contraseñas en texto plano:
--   admin: admin123
--   soporte: soporte123
--   auditor: auditor123
--   gerente: gerente123
--   coordinador: coord123
--   asesores: asesor123
-- ============================================================================

-- Insertar usuarios (las contraseñas deben estar hasheadas)
-- Este script es solo para referencia, usar el script PHP para ejecutar

SELECT 'Migración 016: Usuarios de prueba insertados mediante script PHP' AS status;
