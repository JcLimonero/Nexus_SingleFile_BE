-- ============================================================================
-- MIGRACIÓN 024: Renombrar document_type de MAYÚSCULAS a Title Case
-- ============================================================================
-- Descripción: Convierte los nombres de los tipos de documento de 
--              MAYÚSCULAS a formato Title Case (primera letra mayúscula)
-- Prioridad: MEDIA
-- Fecha: 2026-02-28
-- ============================================================================

-- Nota: Este script debe ejecutarse usando el script PHP:
--       scripts/rename_document_type_to_title_case.php
--       
--       El script PHP aplica lógica inteligente para:
--       - Mantener acrónimos en mayúsculas (RFC, CURP, CFDI, VGD, REPUVE, PROFECO, KIA)
--       - Convertir preposiciones a minúsculas (de, del, la, el, y, etc.)
--       - Capitalizar la primera letra de cada palabra

-- Ejemplos de cambios aplicados:
-- 'IDENTIFICACION OFICIAL' → 'Identificacion Oficial'
-- 'CEDULA FISCAL' → 'Cedula Fiscal'
-- 'LEY ANTILAVADO' → 'Ley Antilavado'
-- 'COMPROBANTE DE DOMICILIO' → 'Comprobante de Domicilio'
-- 'CARTA DE ADJUDICACION' → 'Carta de Adjudicacion'
-- 'RFC' → 'RFC' (sin cambios, acrónimo)
-- 'CURP' → 'CURP' (sin cambios, acrónimo)

SELECT 'Migración 024: Usar script PHP rename_document_type_to_title_case.php para ejecutar' AS status;
