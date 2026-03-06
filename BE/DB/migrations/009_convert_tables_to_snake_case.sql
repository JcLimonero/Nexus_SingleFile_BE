-- ============================================================================
-- MIGRACIÓN 009: Convertir nombres de tablas a snake_case
-- ============================================================================
-- Descripción: Convierte todos los nombres de tablas a snake_case (lowercase con guiones bajos)
-- Prioridad: ALTA
-- Fecha: 2026-02-27
-- ============================================================================

-- Tablas principales
RENAME TABLE `activitylog` TO `activity_log`;
RENAME TABLE `agencyuser` TO `agency_user`;
RENAME TABLE `clienttotalrelation` TO `client_total_relation`;
RENAME TABLE `configurationprocess` TO `configuration_process`;
RENAME TABLE `configurationprocessdocumenttype` TO `configuration_process_document_type`;
RENAME TABLE `customertype` TO `customer_type`;
RENAME TABLE `documentbyfile` TO `document_by_file`;
RENAME TABLE `documentfileerror` TO `document_file_error`;
RENAME TABLE `documentfilestatus` TO `document_file_status`;
RENAME TABLE `documenttype` TO `document_type`;
RENAME TABLE `expedientescorregir` TO `expedientes_corregir`;
RENAME TABLE `fileextraordinaryreasons` TO `file_extraordinary_reasons`;
RENAME TABLE `filepld` TO `file_pld`;
RENAME TABLE `filepldbeneficiariofinal` TO `file_pld_beneficiario_final`;
RENAME TABLE `filepldgeolog` TO `file_pld_geo_log`;
RENAME TABLE `filereasons` TO `file_reasons`;
RENAME TABLE `filesharetoken` TO `file_share_token`;
RENAME TABLE `filestatus` TO `file_status`;
RENAME TABLE `filesubstatus` TO `file_sub_status`;
RENAME TABLE `headerclient` TO `header_client`;
RENAME TABLE `operationtype` TO `operation_type`;
RENAME TABLE `orderbycar` TO `order_by_car`;
RENAME TABLE `processuser` TO `process_user`;
RENAME TABLE `useractivitylogs` TO `user_activity_logs`;
RENAME TABLE `userrefreshtoken` TO `user_refresh_token`;
RENAME TABLE `userrol` TO `user_rol`;

-- Vistas
RENAME TABLE `viewallrelations` TO `view_all_relations`;
RENAME TABLE `viewclient` TO `view_client`;
RENAME TABLE `viewclientcompanyamount` TO `view_client_company_amount`;
RENAME TABLE `viewclientrelations` TO `view_client_relations`;
RENAME TABLE `viewdocumentname` TO `view_document_name`;
RENAME TABLE `viewfiles` TO `view_files`;
RENAME TABLE `viewfilesbyclient` TO `view_files_by_client`;

SELECT 'Migración 009 completada: Tablas convertidas a snake_case' AS status;
