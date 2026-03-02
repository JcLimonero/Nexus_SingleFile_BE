-- ============================================================================
-- MIGRACIÓN 050: Aumentar id_document_container para fileId de Backblaze B2
-- ============================================================================
-- El fileId de Backblaze puede superar 100 caracteres. Asegurar que la columna
-- permita almacenar el ID completo (necesario para recuperar el archivo).
-- ============================================================================

ALTER TABLE `file_document`
  MODIFY COLUMN `id_document_container` VARCHAR(200) NULL DEFAULT NULL;
