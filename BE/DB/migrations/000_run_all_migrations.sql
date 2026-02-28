-- ============================================================================
-- SCRIPT MAESTRO: Ejecutar Todas las Migraciones en Orden
-- ============================================================================
-- Descripción: Ejecuta todas las migraciones de mejora de BD en orden
-- Prioridad: ALTA
-- Fecha: 2026-02-27
-- ============================================================================
-- INSTRUCCIONES:
-- 1. Hacer backup de la base de datos ANTES de ejecutar
-- 2. Ejecutar este script en un entorno de pruebas primero
-- 3. Verificar resultados antes de aplicar en producción
-- 4. Ejecutar cada migración individualmente si hay problemas
-- ============================================================================

-- Activar modo seguro para evitar errores silenciosos
SET SQL_SAFE_UPDATES = 0;
SET FOREIGN_KEY_CHECKS = 0;

-- Mostrar información de la base de datos
SELECT DATABASE() AS current_database;
SELECT NOW() AS migration_start_time;

-- ============================================================================
-- MIGRACIÓN 001: Corrección de Consistencia en Nombres
-- ============================================================================
SOURCE 001_fix_naming_consistency.sql;

-- ============================================================================
-- MIGRACIÓN 002: Agregar Constraints NOT NULL
-- ============================================================================
-- NOTA: Verificar datos NULL antes de ejecutar
SOURCE 002_add_not_null_constraints.sql;

-- ============================================================================
-- MIGRACIÓN 003: Agregar Foreign Keys
-- ============================================================================
-- NOTA: Verificar datos huérfanos antes de ejecutar
SOURCE 003_add_foreign_keys.sql;

-- ============================================================================
-- MIGRACIÓN 004: Agregar Índices Compuestos
-- ============================================================================
SOURCE 004_add_composite_indexes.sql;

-- Restaurar modo seguro
SET FOREIGN_KEY_CHECKS = 1;
SET SQL_SAFE_UPDATES = 1;

-- Mostrar resumen
SELECT 'Todas las migraciones completadas exitosamente' AS status;
SELECT NOW() AS migration_end_time;

-- Verificar estructura final
SELECT 'Verificando estructura final...' AS verification;
SHOW TABLES;
SELECT COUNT(*) AS total_foreign_keys 
FROM information_schema.table_constraints 
WHERE table_schema = DATABASE() 
AND constraint_type = 'FOREIGN KEY';
