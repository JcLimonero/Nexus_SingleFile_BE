-- ============================================================================
-- MIGRACIÓN 009: tipo_cliente y homologación snake_case en nexfile_customers
-- ============================================================================
-- - Agrega columna tipo_cliente ('fisica' | 'moral')
-- - Renombra columnas camelCase restantes a snake_case
-- - Asigna tipo_cliente: 'moral' si bussines_name tiene valor, 'fisica' si no
-- Ejecutar: php scripts/run-migration-009.php
-- ============================================================================

USE dwh;

-- El script run-migration-009.php ejecuta la lógica (ADD COLUMN condicional, renames, UPDATE)
