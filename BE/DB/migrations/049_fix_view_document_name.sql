-- ============================================================================
-- MIGRACIÓN 049: Corregir vista view_document_name
-- ============================================================================
-- La vista referenciaba tablas/columnas antiguas (PascalCase).
-- Actualizar a snake_case: file_document, document_type.
-- ============================================================================

DROP VIEW IF EXISTS `view_document_name`;

CREATE VIEW `view_document_name` AS
SELECT
    fd.`id` AS IdFileDocument,
    fd.`id_file` AS IdFile,
    COALESCE(dt.`name`, fd.`name`) AS file_name_original
FROM `file_document` fd
LEFT JOIN `document_type` dt ON fd.`id_document_type` = dt.`id`
WHERE fd.`enabled` = 1;
