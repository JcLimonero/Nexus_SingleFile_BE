-- ============================================================================
-- MIGRACIÓN 035: Eliminar "Test" y reordenar document_type alfabéticamente
-- ============================================================================
-- Descripción: Elimina registros con "Test" en document_type y reordena 
--              todos los registros restantes alfabéticamente por nombre,
--              reindexando los IDs consecutivamente
-- Prioridad: MEDIA
-- Fecha: 2026-02-28
-- ============================================================================
-- NOTA: Esta migración debe ejecutarse usando el script PHP correspondiente
--       debido a la complejidad de actualizar foreign keys y reindexar IDs
-- ============================================================================

-- Verificar registros con "Test"
SELECT Id, Name FROM document_type 
WHERE Name LIKE '%Test%' OR Name LIKE '%test%' OR Name LIKE '%TEST%'
ORDER BY Id;

-- Verificar total de registros antes de eliminar
SELECT COUNT(*) as total_before FROM document_type;

-- Eliminar registros con "Test"
DELETE FROM document_type 
WHERE Name LIKE '%Test%' OR Name LIKE '%test%' OR Name LIKE '%TEST%';

-- Verificar total después de eliminar
SELECT COUNT(*) as total_after FROM document_type;

-- Ver registros ordenados alfabéticamente (sin reindexar)
SELECT Id, Name FROM document_type ORDER BY Name ASC LIMIT 10;

-- NOTA: Para reindexar los IDs manteniendo el orden alfabético y actualizar
--       todas las foreign keys, ejecutar el script PHP:
--       BE/scripts/delete_test_and_reorder_document_type.php
