-- ============================================================================
-- MIGRACIÓN 026: Limpiar document_type y Corregir IdLastUserUpdate
-- ============================================================================
-- Descripción: 
--   1. Elimina registros con IdProcessType = -1
--   2. Corrige IdLastUserUpdate inválidos (IDs que no existen en user)
--   3. Reindexa IDs de forma consecutiva
-- Prioridad: ALTA
-- Fecha: 2026-02-28
-- ============================================================================

-- Nota: Este script debe ejecutarse usando el script PHP:
--       scripts/clean_document_type_and_check_users.php
--       
--       El script PHP realiza:
--       1. Eliminación de registros con IdProcessType = -1
--       2. Identificación de IdLastUserUpdate inválidos
--       3. Corrección de IdLastUserUpdate inválidos (poner en 0)
--       4. Reindexación de IDs de forma consecutiva

-- Registros eliminados (IdProcessType = -1):
-- - Factura de Origen (autos Usados)
-- - Documento-prueba-diagonal
-- - Prueba-diagonal
-- - Documento-diagonal
-- - Pru-diagonal

-- Registros corregidos (IdLastUserUpdate inválido):
-- - Ley Antilavado (461 → 0)
-- - Pago Placas Tramites (461 → 0)
-- - Acta de Asamblea (461 → 0)

SELECT 'Migración 026: Usar script PHP clean_document_type_and_check_users.php para ejecutar' AS status;
