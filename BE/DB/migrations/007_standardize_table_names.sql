-- ============================================================================
-- MIGRACIÓN 007: Estandarizar Nombres de Tablas a PascalCase
-- ============================================================================
-- Descripción: Convierte todos los nombres de tablas a PascalCase (estilo inglés)
-- Prioridad: ALTA
-- Fecha: 2026-02-27
-- ============================================================================
-- Estándar: PascalCase (ej: CustomerType, FileStatus, AgencyUser)
-- ============================================================================

-- Tablas principales (ya en PascalCase o casi)
-- CustomerType ya está correcto
-- File ya está correcto
-- User ya está correcto

-- Convertir snake_case y lowercase a PascalCase

-- Tablas de relaciones
RENAME TABLE `agency_user` TO `AgencyUser`;
RENAME TABLE `process_user` TO `ProcessUser`;
RENAME TABLE `client_total_relation` TO `ClientTotalRelation`;

-- Tablas de configuración
RENAME TABLE `configurationprocess` TO `ConfigurationProcess`;
RENAME TABLE `configurationprocess_documenttype` TO `ConfigurationProcessDocumentType`;

-- Tablas de documentos
RENAME TABLE `documentbyfile` TO `DocumentByFile`;
RENAME TABLE `documenttype` TO `DocumentType`;
RENAME TABLE `documentfile_status` TO `DocumentFileStatus`;
RENAME TABLE `documentfile_error` TO `DocumentFileError`;

-- Tablas de File
RENAME TABLE `file_status` TO `FileStatus`;
RENAME TABLE `file_substatus` TO `FileSubStatus`;
RENAME TABLE `file_reasons` TO `FileReasons`;
RENAME TABLE `file_extraordinary_reasons` TO `FileExtraordinaryReasons`;
RENAME TABLE `file_sharetoken` TO `FileShareToken`;
RENAME TABLE `file_pld` TO `FilePld`;
RENAME TABLE `file_pld_geolog` TO `FilePldGeoLog`;
RENAME TABLE `file_pld_beneficiariofinal` TO `FilePldBeneficiarioFinal`;

-- Tablas de cliente
RENAME TABLE `client` TO `Client`;
RENAME TABLE `headerclient` TO `HeaderClient`;

-- Tablas de proceso
RENAME TABLE `process` TO `Process`;
RENAME TABLE `operationtype` TO `OperationType`;

-- Tablas de agencia
RENAME TABLE `agency` TO `Agency`;

-- Tablas de compañía
RENAME TABLE `company` TO `Company`;

-- Tablas de orden
RENAME TABLE `orderbycar` TO `OrderByCar`;

-- Tablas de usuario
RENAME TABLE `userrol` TO `UserRol`;
RENAME TABLE `user_refreshtoken` TO `UserRefreshToken`;
RENAME TABLE `user_activity_logs` TO `UserActivityLogs`;

-- Tablas de sistema
RENAME TABLE `migrations` TO `Migrations`;
RENAME TABLE `activitylog` TO `ActivityLog`;

-- Tablas de expedientes
RENAME TABLE `expedientes_corregir` TO `ExpedientesCorregir`;

-- Vistas (mantener prefijo view_ pero capitalizar)
RENAME TABLE `view_all_relations` TO `ViewAllRelations`;
RENAME TABLE `view_client` TO `ViewClient`;
RENAME TABLE `view_client_company_amount` TO `ViewClientCompanyAmount`;
RENAME TABLE `view_client_relations` TO `ViewClientRelations`;
RENAME TABLE `view_document_name` TO `ViewDocumentName`;
RENAME TABLE `view_files` TO `ViewFiles`;
RENAME TABLE `view_files_by_client` TO `ViewFilesByClient`;

SELECT 'Migración 007 completada: Nombres de tablas estandarizados a PascalCase' AS status;
