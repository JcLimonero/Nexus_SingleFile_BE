-- ============================================================================
-- MIGRACIÓN 030: Actualizar todos los IdLastUserUpdate a 1
-- ============================================================================
-- Descripción: Actualiza todos los campos IdLastUserUpdate a 1 en todas 
--              las tablas que tienen esta columna
-- Prioridad: MEDIA
-- Fecha: 2026-02-28
-- ============================================================================

-- Nota: Este script debe ejecutarse usando el script PHP:
--       scripts/update_all_idlastuserupdate_to_one.php
--       
--       El script PHP actualiza todas las tablas automáticamente

-- Ejemplo de actualización para cada tabla:
-- UPDATE `{tabla}` 
-- SET IdLastUserUpdate = 1, UpdateDate = NOW() 
-- WHERE IdLastUserUpdate IS NULL 
--    OR IdLastUserUpdate = 0 
--    OR IdLastUserUpdate != 1;

-- Tablas actualizadas (32 tablas):
-- activity_log, agency, agency_user, client, client_total_relation,
-- company, configuration_process, configuration_process_document_type,
-- customer_type, document_by_file, document_file_error, document_file_status,
-- document_type, file, file_extraordinary_reasons, file_pld,
-- file_pld_beneficial_owner, file_pld_geo_log, file_reasons, file_share_token,
-- file_status, file_sub_status, files_to_correct, header_client,
-- operation_type, order_by_car, process, process_user, user,
-- user_activity_logs, user_refresh_token, user_role

SELECT 'Migración 030: Usar script PHP update_all_idlastuserupdate_to_one.php para ejecutar' AS status;
