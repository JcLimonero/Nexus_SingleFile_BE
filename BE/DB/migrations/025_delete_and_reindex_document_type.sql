-- ============================================================================
-- MIGRACIÓN 025: Eliminar Registros Específicos y Reiniciar Índices de document_type
-- ============================================================================
-- Descripción: Elimina registros específicos y reasigna IDs de forma consecutiva
-- Prioridad: ALTA
-- Fecha: 2026-02-28
-- ============================================================================

-- Nota: Este script debe ejecutarse usando el script PHP:
--       scripts/delete_and_reindex_document_type.php
--       
--       El script PHP realiza:
--       1. Eliminación de los registros especificados
--       2. Reasignación de IDs de forma consecutiva (1, 2, 3, ...)
--       3. Actualización del AUTO_INCREMENT

-- Registros eliminados:
-- - Anexo 3 Solicitud de Expedicion de CFDI
-- - Recibos de Pago (deloitte)
-- - Pdi2
-- - Doctos_salida
-- - REPUVE 2
-- - Lista Negra 1
-- - Lista Negra KIA
-- - Factura KIA
-- - Ley Antilavado KIA
-- - PROFECO KIA
-- - Recibos de Pago KIA
-- - Factura 2
-- - Uso de CFDI 1

SELECT 'Migración 025: Usar script PHP delete_and_reindex_document_type.php para ejecutar' AS status;
