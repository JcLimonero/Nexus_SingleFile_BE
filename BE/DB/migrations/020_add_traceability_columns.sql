-- ============================================================================
-- MIGRACIÓN 020: Agregar Columnas de Trazabilidad a Todas las Tablas
-- ============================================================================
-- Descripción: Agrega las columnas de trazabilidad (RegistrationDate, 
--              UpdateDate, IdLastUserUpdate, Enabled) a las tablas que 
--              no las tienen
-- Prioridad: ALTA
-- Fecha: 2026-02-28
-- ============================================================================

-- Tablas que necesitan TODAS las columnas de trazabilidad
-- ============================================================================

-- activity_log
ALTER TABLE `activity_log`
  ADD COLUMN `RegistrationDate` TIMESTAMP NULL DEFAULT NULL AFTER `Id`,
  ADD COLUMN `UpdateDate` TIMESTAMP NULL DEFAULT NULL AFTER `RegistrationDate`,
  ADD COLUMN `IdLastUserUpdate` BIGINT NULL DEFAULT 0 AFTER `UpdateDate`,
  ADD COLUMN `Enabled` TINYINT(1) NULL DEFAULT 1 AFTER `IdLastUserUpdate`;

-- agency_user
ALTER TABLE `agency_user`
  ADD COLUMN `RegistrationDate` TIMESTAMP NULL DEFAULT NULL AFTER `IdAgency`,
  ADD COLUMN `UpdateDate` TIMESTAMP NULL DEFAULT NULL AFTER `RegistrationDate`,
  ADD COLUMN `IdLastUserUpdate` BIGINT NULL DEFAULT 0 AFTER `UpdateDate`,
  ADD COLUMN `Enabled` TINYINT(1) NULL DEFAULT 1 AFTER `IdLastUserUpdate`;

-- client_total_relation
ALTER TABLE `client_total_relation`
  ADD COLUMN `RegistrationDate` TIMESTAMP NULL DEFAULT NULL AFTER `IdDMS`,
  ADD COLUMN `UpdateDate` TIMESTAMP NULL DEFAULT NULL AFTER `RegistrationDate`,
  ADD COLUMN `IdLastUserUpdate` BIGINT NULL DEFAULT 0 AFTER `UpdateDate`,
  ADD COLUMN `Enabled` TINYINT(1) NULL DEFAULT 1 AFTER `IdLastUserUpdate`;

-- configuration_process_document_type
ALTER TABLE `configuration_process_document_type`
  ADD COLUMN `RegistrationDate` TIMESTAMP NULL DEFAULT NULL AFTER `IdDocumentType`,
  ADD COLUMN `UpdateDate` TIMESTAMP NULL DEFAULT NULL AFTER `RegistrationDate`,
  ADD COLUMN `IdLastUserUpdate` BIGINT NULL DEFAULT 0 AFTER `UpdateDate`,
  ADD COLUMN `Enabled` TINYINT(1) NULL DEFAULT 1 AFTER `IdLastUserUpdate`;

-- document_file_error
ALTER TABLE `document_file_error`
  ADD COLUMN `RegistrationDate` TIMESTAMP NULL DEFAULT NULL AFTER `Id`,
  ADD COLUMN `UpdateDate` TIMESTAMP NULL DEFAULT NULL AFTER `RegistrationDate`,
  ADD COLUMN `IdLastUserUpdate` BIGINT NULL DEFAULT 0 AFTER `UpdateDate`,
  ADD COLUMN `Enabled` TINYINT(1) NULL DEFAULT 1 AFTER `IdLastUserUpdate`;

-- document_file_status
ALTER TABLE `document_file_status`
  ADD COLUMN `RegistrationDate` TIMESTAMP NULL DEFAULT NULL AFTER `Id`,
  ADD COLUMN `UpdateDate` TIMESTAMP NULL DEFAULT NULL AFTER `RegistrationDate`,
  ADD COLUMN `IdLastUserUpdate` BIGINT NULL DEFAULT 0 AFTER `UpdateDate`,
  ADD COLUMN `Enabled` TINYINT(1) NULL DEFAULT 1 AFTER `IdLastUserUpdate`;

-- file_status
ALTER TABLE `file_status`
  ADD COLUMN `RegistrationDate` TIMESTAMP NULL DEFAULT NULL AFTER `Name`,
  ADD COLUMN `UpdateDate` TIMESTAMP NULL DEFAULT NULL AFTER `RegistrationDate`,
  ADD COLUMN `IdLastUserUpdate` BIGINT NULL DEFAULT 0 AFTER `UpdateDate`,
  ADD COLUMN `Enabled` TINYINT(1) NULL DEFAULT 1 AFTER `IdLastUserUpdate`;

-- file_sub_status (tiene Name, no Description)
ALTER TABLE `file_sub_status`
  ADD COLUMN `RegistrationDate` TIMESTAMP NULL DEFAULT NULL AFTER `Name`,
  ADD COLUMN `UpdateDate` TIMESTAMP NULL DEFAULT NULL AFTER `RegistrationDate`,
  ADD COLUMN `IdLastUserUpdate` BIGINT NULL DEFAULT 0 AFTER `UpdateDate`,
  ADD COLUMN `Enabled` TINYINT(1) NULL DEFAULT 1 AFTER `IdLastUserUpdate`;

-- files_to_correct (tiene id, idExpediente, created_at, updated_at)
ALTER TABLE `files_to_correct`
  ADD COLUMN `RegistrationDate` TIMESTAMP NULL DEFAULT NULL AFTER `updated_at`,
  ADD COLUMN `UpdateDate` TIMESTAMP NULL DEFAULT NULL AFTER `RegistrationDate`,
  ADD COLUMN `IdLastUserUpdate` BIGINT NULL DEFAULT 0 AFTER `UpdateDate`,
  ADD COLUMN `Enabled` TINYINT(1) NULL DEFAULT 1 AFTER `IdLastUserUpdate`;

-- header_client
ALTER TABLE `header_client`
  ADD COLUMN `RegistrationDate` TIMESTAMP NULL DEFAULT NULL AFTER `IdClient`,
  ADD COLUMN `UpdateDate` TIMESTAMP NULL DEFAULT NULL AFTER `RegistrationDate`,
  ADD COLUMN `IdLastUserUpdate` BIGINT NULL DEFAULT 0 AFTER `UpdateDate`,
  ADD COLUMN `Enabled` TINYINT(1) NULL DEFAULT 1 AFTER `IdLastUserUpdate`;

-- process_user
ALTER TABLE `process_user`
  ADD COLUMN `RegistrationDate` TIMESTAMP NULL DEFAULT NULL AFTER `IdProcess`,
  ADD COLUMN `UpdateDate` TIMESTAMP NULL DEFAULT NULL AFTER `RegistrationDate`,
  ADD COLUMN `IdLastUserUpdate` BIGINT NULL DEFAULT 0 AFTER `UpdateDate`,
  ADD COLUMN `Enabled` TINYINT(1) NULL DEFAULT 1 AFTER `IdLastUserUpdate`;

-- user_activity_logs
ALTER TABLE `user_activity_logs`
  ADD COLUMN `RegistrationDate` TIMESTAMP NULL DEFAULT NULL AFTER `Id`,
  ADD COLUMN `UpdateDate` TIMESTAMP NULL DEFAULT NULL AFTER `RegistrationDate`,
  ADD COLUMN `IdLastUserUpdate` BIGINT NULL DEFAULT 0 AFTER `UpdateDate`,
  ADD COLUMN `Enabled` TINYINT(1) NULL DEFAULT 1 AFTER `IdLastUserUpdate`;

-- Tablas que necesitan ALGUNAS columnas de trazabilidad
-- ============================================================================

-- client (falta Enabled)
ALTER TABLE `client`
  ADD COLUMN `Enabled` TINYINT(1) NULL DEFAULT 1 AFTER `IdLastUserUpdate`;

-- file (falta Enabled)
ALTER TABLE `file`
  ADD COLUMN `Enabled` TINYINT(1) NULL DEFAULT 1 AFTER `IdLastUserUpdate`;

-- file_pld (falta Enabled)
ALTER TABLE `file_pld`
  ADD COLUMN `Enabled` TINYINT(1) NULL DEFAULT 1 AFTER `IdLastUserUpdate`;

-- file_pld_beneficial_owner (faltan UpdateDate, IdLastUserUpdate, Enabled)
ALTER TABLE `file_pld_beneficial_owner`
  ADD COLUMN `UpdateDate` TIMESTAMP NULL DEFAULT NULL AFTER `RegistrationDate`,
  ADD COLUMN `IdLastUserUpdate` BIGINT NULL DEFAULT 0 AFTER `UpdateDate`,
  ADD COLUMN `Enabled` TINYINT(1) NULL DEFAULT 1 AFTER `IdLastUserUpdate`;

-- file_pld_geo_log (faltan UpdateDate, IdLastUserUpdate, Enabled)
ALTER TABLE `file_pld_geo_log`
  ADD COLUMN `UpdateDate` TIMESTAMP NULL DEFAULT NULL AFTER `RegistrationDate`,
  ADD COLUMN `IdLastUserUpdate` BIGINT NULL DEFAULT 0 AFTER `UpdateDate`,
  ADD COLUMN `Enabled` TINYINT(1) NULL DEFAULT 1 AFTER `IdLastUserUpdate`;

-- order_by_car (falta Enabled)
ALTER TABLE `order_by_car`
  ADD COLUMN `Enabled` TINYINT(1) NULL DEFAULT 1 AFTER `IdLastUserUpdate`;

-- user_refresh_token (faltan RegistrationDate, IdLastUserUpdate, Enabled)
ALTER TABLE `user_refresh_token`
  ADD COLUMN `RegistrationDate` TIMESTAMP NULL DEFAULT NULL AFTER `IdUser`,
  ADD COLUMN `IdLastUserUpdate` BIGINT NULL DEFAULT 0 AFTER `UpdateDate`,
  ADD COLUMN `Enabled` TINYINT(1) NULL DEFAULT 1 AFTER `IdLastUserUpdate`;

-- user_role (falta IdLastUserUpdate)
ALTER TABLE `user_role`
  ADD COLUMN `IdLastUserUpdate` BIGINT NULL DEFAULT 0 AFTER `UpdateDate`;

-- NOTA: La tabla 'migrations' se omite intencionalmente ya que es una tabla
--       del sistema de migraciones de CodeIgniter y no requiere trazabilidad

SELECT 'Migración 020 completada: Columnas de trazabilidad agregadas' AS status;
