-- ============================================================================
-- MIGRACIÓN 038: Convertir nombres de columnas a snake_case
-- ============================================================================
-- Descripción: Convierte todos los nombres de columnas de PascalCase a snake_case
-- Prioridad: ALTA
-- Fecha: 2026-02-28
-- ============================================================================
-- ⚠️ ADVERTENCIA: Esta migración es muy grande y afecta muchas tablas
-- Ejecutar en ambiente de desarrollo primero y hacer backup completo
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================================
-- Tabla: document_type
-- ============================================================================
ALTER TABLE `document_type` CHANGE COLUMN `Id` `id` BIGINT PRIMARY KEY AUTO_INCREMENT;
ALTER TABLE `document_type` CHANGE COLUMN `Name` `name` VARCHAR(600) UNIQUE;
ALTER TABLE `document_type` CHANGE COLUMN `Enabled` `enabled` TINYINT DEFAULT 0;
ALTER TABLE `document_type` CHANGE COLUMN `RegistrationDate` `registration_date` TIMESTAMP NULL;
ALTER TABLE `document_type` CHANGE COLUMN `UpdateDate` `update_date` TIMESTAMP NULL;
ALTER TABLE `document_type` CHANGE COLUMN `IdLastUserUpdate` `id_last_user_update` BIGINT DEFAULT 0;
ALTER TABLE `document_type` CHANGE COLUMN `ReqExpiration` `req_expiration` TINYINT DEFAULT 0;
ALTER TABLE `document_type` CHANGE COLUMN `IdProcessType` `id_process_type` BIGINT DEFAULT 0;
ALTER TABLE `document_type` CHANGE COLUMN `Required` `required` TINYINT DEFAULT 1;
ALTER TABLE `document_type` CHANGE COLUMN `IdSubProcess` `id_sub_process` BIGINT DEFAULT 0;
ALTER TABLE `document_type` CHANGE COLUMN `AvailableToClient` `available_to_client` TINYINT DEFAULT 0;
ALTER TABLE `document_type` CHANGE COLUMN `DocumentAutoUpload` `document_auto_upload` TINYINT DEFAULT 1;

-- ============================================================================
-- Tabla: configuration_process_document_type
-- ============================================================================
ALTER TABLE `configuration_process_document_type` CHANGE COLUMN `Id` `id` INTEGER PRIMARY KEY AUTO_INCREMENT;
ALTER TABLE `configuration_process_document_type` CHANGE COLUMN `IdDocumentType` `id_document_type` BIGINT NOT NULL;
ALTER TABLE `configuration_process_document_type` CHANGE COLUMN `IdConfigurationProcess` `id_configuration_process` BIGINT NOT NULL;
ALTER TABLE `configuration_process_document_type` CHANGE COLUMN `Idconfiguration_process` `id_configuration_process` BIGINT NOT NULL;

-- ============================================================================
-- Tabla: configuration_process
-- ============================================================================
ALTER TABLE `configuration_process` CHANGE COLUMN `Id` `id` BIGINT PRIMARY KEY AUTO_INCREMENT;
ALTER TABLE `configuration_process` CHANGE COLUMN `IdProcess` `id_process` BIGINT DEFAULT 0;
ALTER TABLE `configuration_process` CHANGE COLUMN `IdAgency` `id_agency` BIGINT DEFAULT 0;
ALTER TABLE `configuration_process` CHANGE COLUMN `IdCustomerType` `id_customer_type` BIGINT DEFAULT 0;
ALTER TABLE `configuration_process` CHANGE COLUMN `IdOperationType` `id_operation_type` BIGINT DEFAULT 0;
ALTER TABLE `configuration_process` CHANGE COLUMN `Enabled` `enabled` TINYINT DEFAULT 0;
ALTER TABLE `configuration_process` CHANGE COLUMN `RegistrationDate` `registration_date` TIMESTAMP NULL;
ALTER TABLE `configuration_process` CHANGE COLUMN `UpdateDate` `update_date` TIMESTAMP NULL;
ALTER TABLE `configuration_process` CHANGE COLUMN `IdLastUserUpdate` `id_last_user_update` BIGINT DEFAULT 0;

-- ============================================================================
-- Tabla: file_document (document_by_file)
-- ============================================================================
ALTER TABLE `file_document` CHANGE COLUMN `Id` `id` BIGINT PRIMARY KEY AUTO_INCREMENT;
ALTER TABLE `file_document` CHANGE COLUMN `Name` `name` VARCHAR(600);
ALTER TABLE `file_document` CHANGE COLUMN `Comment` `comment` VARCHAR(200);
ALTER TABLE `file_document` CHANGE COLUMN `ExpirationDate` `expiration_date` TIMESTAMP NULL;
ALTER TABLE `file_document` CHANGE COLUMN `PathDocument` `path_document` VARCHAR(500);
ALTER TABLE `file_document` CHANGE COLUMN `Enabled` `enabled` TINYINT DEFAULT 0;
ALTER TABLE `file_document` CHANGE COLUMN `RegistrationDate` `registration_date` TIMESTAMP NULL;
ALTER TABLE `file_document` CHANGE COLUMN `UpdateDate` `update_date` TIMESTAMP NULL;
ALTER TABLE `file_document` CHANGE COLUMN `LastUserUpdate` `last_user_update` BIGINT DEFAULT 0;
ALTER TABLE `file_document` CHANGE COLUMN `IdLastUserUpdate` `id_last_user_update` BIGINT DEFAULT 0;
ALTER TABLE `file_document` CHANGE COLUMN `IdFile` `id_file` BIGINT DEFAULT 0;
ALTER TABLE `file_document` CHANGE COLUMN `IdValidation` `id_validation` VARCHAR(50);
ALTER TABLE `file_document` CHANGE COLUMN `IdDocumentType` `id_document_type` BIGINT;
ALTER TABLE `file_document` CHANGE COLUMN `IdCurrentStatus` `id_current_status` INTEGER;
ALTER TABLE `file_document` CHANGE COLUMN `IdDocumentError` `id_document_error` INTEGER;
ALTER TABLE `file_document` CHANGE COLUMN `ServerPath` `server_path` VARCHAR(50);

-- ============================================================================
-- Tabla: expedient (file)
-- ============================================================================
ALTER TABLE `expedient` CHANGE COLUMN `Id` `id` BIGINT PRIMARY KEY AUTO_INCREMENT;
ALTER TABLE `expedient` CHANGE COLUMN `IdClient` `id_client` BIGINT;
ALTER TABLE `expedient` CHANGE COLUMN `IdOrder` `id_order` BIGINT;
ALTER TABLE `expedient` CHANGE COLUMN `IdCustomerType` `id_customer_type` BIGINT;
ALTER TABLE `expedient` CHANGE COLUMN `IdOperation` `id_operation` BIGINT DEFAULT 0;
ALTER TABLE `expedient` CHANGE COLUMN `IdProcess` `id_process` BIGINT;
ALTER TABLE `expedient` CHANGE COLUMN `IdAgency` `id_agency` BIGINT;
ALTER TABLE `expedient` CHANGE COLUMN `IdSeller` `id_seller` BIGINT;
ALTER TABLE `expedient` CHANGE COLUMN `IdCurrentState` `id_current_state` INTEGER DEFAULT 0;
ALTER TABLE `expedient` CHANGE COLUMN `IdOrderTotal` `id_order_total` VARCHAR(50);
ALTER TABLE `expedient` CHANGE COLUMN `IdInventory` `id_inventory` VARCHAR(50);
ALTER TABLE `expedient` CHANGE COLUMN `LastUserUpdate` `last_user_update` BIGINT DEFAULT 0;
ALTER TABLE `expedient` CHANGE COLUMN `IdLastUserUpdate` `id_last_user_update` BIGINT DEFAULT 0;
ALTER TABLE `expedient` CHANGE COLUMN `RegistrationDate` `registration_date` TIMESTAMP NULL;
ALTER TABLE `expedient` CHANGE COLUMN `UpdateDate` `update_date` TIMESTAMP NULL;
ALTER TABLE `expedient` CHANGE COLUMN `Description` `description` VARCHAR(500);
ALTER TABLE `expedient` CHANGE COLUMN `AttentionDate` `attention_date` DATE NULL;
ALTER TABLE `expedient` CHANGE COLUMN `CloseDate` `close_date` DATE NULL;
ALTER TABLE `expedient` CHANGE COLUMN `AgendHour` `agend_hour` TIME NULL;
ALTER TABLE `expedient` CHANGE COLUMN `AgendDate` `agend_date` DATE NULL;

-- ============================================================================
-- Tabla: user
-- ============================================================================
ALTER TABLE `user` CHANGE COLUMN `Id` `id` BIGINT PRIMARY KEY AUTO_INCREMENT;
ALTER TABLE `user` CHANGE COLUMN `Name` `name` VARCHAR(200);
ALTER TABLE `user` CHANGE COLUMN `User` `user` VARCHAR(100) UNIQUE;
ALTER TABLE `user` CHANGE COLUMN `Pass` `pass` VARCHAR(255);
ALTER TABLE `user` CHANGE COLUMN `Mail` `mail` VARCHAR(200);
ALTER TABLE `user` CHANGE COLUMN `Enabled` `enabled` TINYINT DEFAULT 0;
ALTER TABLE `user` CHANGE COLUMN `IdUserRol` `id_user_rol` BIGINT DEFAULT 0;
ALTER TABLE `user` CHANGE COLUMN `IdUserTotal` `id_user_total` BIGINT DEFAULT 0;
ALTER TABLE `user` CHANGE COLUMN `DefaultAgency` `default_agency` BIGINT DEFAULT 0;
ALTER TABLE `user` CHANGE COLUMN `RegistrationDate` `registration_date` TIMESTAMP NULL;
ALTER TABLE `user` CHANGE COLUMN `UpdateDate` `update_date` TIMESTAMP NULL;
ALTER TABLE `user` CHANGE COLUMN `IdLastUserUpdate` `id_last_user_update` BIGINT DEFAULT 0;
ALTER TABLE `user` CHANGE COLUMN `UserPass` `user_pass` VARCHAR(255);
ALTER TABLE `user` CHANGE COLUMN `password_migrated` `password_migrated` TINYINT DEFAULT 0;

-- ============================================================================
-- Tabla: agency
-- ============================================================================
ALTER TABLE `agency` CHANGE COLUMN `Id` `id` BIGINT PRIMARY KEY AUTO_INCREMENT;
ALTER TABLE `agency` CHANGE COLUMN `Name` `name` VARCHAR(200);
ALTER TABLE `agency` CHANGE COLUMN `IdCompany` `id_company` BIGINT;
ALTER TABLE `agency` CHANGE COLUMN `IdAgencyDMS` `id_agency_dms` VARCHAR(50);
ALTER TABLE `agency` CHANGE COLUMN `Enabled` `enabled` TINYINT DEFAULT 0;
ALTER TABLE `agency` CHANGE COLUMN `RegistrationDate` `registration_date` TIMESTAMP NULL;
ALTER TABLE `agency` CHANGE COLUMN `UpdateDate` `update_date` TIMESTAMP NULL;
ALTER TABLE `agency` CHANGE COLUMN `IdLastUserUpdate` `id_last_user_update` BIGINT DEFAULT 0;

-- ============================================================================
-- Tabla: process
-- ============================================================================
ALTER TABLE `process` CHANGE COLUMN `Id` `id` BIGINT PRIMARY KEY AUTO_INCREMENT;
ALTER TABLE `process` CHANGE COLUMN `Name` `name` VARCHAR(200);
ALTER TABLE `process` CHANGE COLUMN `Enabled` `enabled` TINYINT DEFAULT 0;
ALTER TABLE `process` CHANGE COLUMN `RegistrationDate` `registration_date` TIMESTAMP NULL;
ALTER TABLE `process` CHANGE COLUMN `UpdateDate` `update_date` TIMESTAMP NULL;
ALTER TABLE `process` CHANGE COLUMN `IdLastUserUpdate` `id_last_user_update` BIGINT DEFAULT 0;

-- ============================================================================
-- Tabla: operation_type
-- ============================================================================
ALTER TABLE `operation_type` CHANGE COLUMN `Id` `id` BIGINT PRIMARY KEY AUTO_INCREMENT;
ALTER TABLE `operation_type` CHANGE COLUMN `Name` `name` VARCHAR(200);
ALTER TABLE `operation_type` CHANGE COLUMN `Enabled` `enabled` TINYINT DEFAULT 0;
ALTER TABLE `operation_type` CHANGE COLUMN `RegistrationDate` `registration_date` TIMESTAMP NULL;
ALTER TABLE `operation_type` CHANGE COLUMN `UpdateDate` `update_date` TIMESTAMP NULL;
ALTER TABLE `operation_type` CHANGE COLUMN `IdLastUserUpdate` `id_last_user_update` BIGINT DEFAULT 0;

-- ============================================================================
-- Tabla: customer_type
-- ============================================================================
ALTER TABLE `customer_type` CHANGE COLUMN `Id` `id` BIGINT PRIMARY KEY AUTO_INCREMENT;
ALTER TABLE `customer_type` CHANGE COLUMN `Name` `name` VARCHAR(600) UNIQUE;
ALTER TABLE `customer_type` CHANGE COLUMN `Enabled` `enabled` TINYINT DEFAULT 0;
ALTER TABLE `customer_type` CHANGE COLUMN `RegistrationDate` `registration_date` TIMESTAMP NULL;
ALTER TABLE `customer_type` CHANGE COLUMN `UpdateDate` `update_date` TIMESTAMP NULL;
ALTER TABLE `customer_type` CHANGE COLUMN `IdLastUserUpdate` `id_last_user_update` BIGINT DEFAULT 0;

-- ============================================================================
-- Tabla: file_status
-- ============================================================================
ALTER TABLE `file_status` CHANGE COLUMN `Id` `id` INTEGER PRIMARY KEY AUTO_INCREMENT;
ALTER TABLE `file_status` CHANGE COLUMN `Name` `name` VARCHAR(500);

-- ============================================================================
-- Tabla: file_sub_status
-- ============================================================================
ALTER TABLE `file_sub_status` CHANGE COLUMN `Id` `id` INTEGER PRIMARY KEY AUTO_INCREMENT;
ALTER TABLE `file_sub_status` CHANGE COLUMN `Name` `name` VARCHAR(500);

-- ============================================================================
-- Tabla: document_file_status
-- ============================================================================
ALTER TABLE `document_file_status` CHANGE COLUMN `Id` `id` INTEGER PRIMARY KEY AUTO_INCREMENT;
ALTER TABLE `document_file_status` CHANGE COLUMN `Description` `description` VARCHAR(500);
ALTER TABLE `document_file_status` CHANGE COLUMN `Name` `name` VARCHAR(500);

-- ============================================================================
-- Tabla: document_file_error
-- ============================================================================
ALTER TABLE `document_file_error` CHANGE COLUMN `Id` `id` INTEGER PRIMARY KEY AUTO_INCREMENT;
ALTER TABLE `document_file_error` CHANGE COLUMN `Description` `description` VARCHAR(500);

-- ============================================================================
-- Tabla: order_by_car
-- ============================================================================
ALTER TABLE `order_by_car` CHANGE COLUMN `Id` `id` BIGINT PRIMARY KEY AUTO_INCREMENT;
ALTER TABLE `order_by_car` CHANGE COLUMN `IdDMS` `id_dms` VARCHAR(50);
ALTER TABLE `order_by_car` CHANGE COLUMN `CarType` `car_type` VARCHAR(200);
ALTER TABLE `order_by_car` CHANGE COLUMN `Year` `year` INT;
ALTER TABLE `order_by_car` CHANGE COLUMN `Model` `model` VARCHAR(200);
ALTER TABLE `order_by_car` CHANGE COLUMN `VIN` `vin` VARCHAR(200);
ALTER TABLE `order_by_car` CHANGE COLUMN `RegistrationDate` `registration_date` TIMESTAMP NULL;
ALTER TABLE `order_by_car` CHANGE COLUMN `UpdateDate` `update_date` TIMESTAMP NULL;
ALTER TABLE `order_by_car` CHANGE COLUMN `IdLastUserUpdate` `id_last_user_update` BIGINT DEFAULT 0;

-- ============================================================================
-- Tabla: client_dms_relation
-- ============================================================================
ALTER TABLE `client_dms_relation` CHANGE COLUMN `Id` `id` BIGINT PRIMARY KEY AUTO_INCREMENT;
ALTER TABLE `client_dms_relation` CHANGE COLUMN `IdAgency` `id_agency` BIGINT;
ALTER TABLE `client_dms_relation` CHANGE COLUMN `IdDMS` `id_dms` VARCHAR(50);
ALTER TABLE `client_dms_relation` CHANGE COLUMN `idClientHeader` `id_client_header` BIGINT;

-- ============================================================================
-- Tabla: client_header (header_client)
-- ============================================================================
ALTER TABLE `client_header` CHANGE COLUMN `Id` `id` BIGINT PRIMARY KEY AUTO_INCREMENT;
ALTER TABLE `client_header` CHANGE COLUMN `IdClient` `id_client` BIGINT;

-- ============================================================================
-- Tabla: user_refresh_token
-- ============================================================================
ALTER TABLE `user_refresh_token` CHANGE COLUMN `Id` `id` BIGINT PRIMARY KEY AUTO_INCREMENT;
ALTER TABLE `user_refresh_token` CHANGE COLUMN `IdUser` `id_user` BIGINT NOT NULL;
ALTER TABLE `user_refresh_token` CHANGE COLUMN `RefreshToken` `refresh_token` TEXT NOT NULL;
ALTER TABLE `user_refresh_token` CHANGE COLUMN `ExpirationDate` `expiration_date` TIMESTAMP NULL;
ALTER TABLE `user_refresh_token` CHANGE COLUMN `CreatedDate` `created_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `user_refresh_token` CHANGE COLUMN `UpdateDate` `update_date` TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP;

-- ============================================================================
-- Tabla: user_role (user_rol)
-- ============================================================================
ALTER TABLE `user_role` CHANGE COLUMN `Id` `id` BIGINT PRIMARY KEY AUTO_INCREMENT;
ALTER TABLE `user_role` CHANGE COLUMN `Name` `name` VARCHAR(200);
ALTER TABLE `user_role` CHANGE COLUMN `Enabled` `enabled` TINYINT DEFAULT 0;
ALTER TABLE `user_role` CHANGE COLUMN `RegistrationDate` `registration_date` TIMESTAMP NULL;
ALTER TABLE `user_role` CHANGE COLUMN `UpdateDate` `update_date` TIMESTAMP NULL;

-- ============================================================================
-- Tabla: company
-- ============================================================================
ALTER TABLE `company` CHANGE COLUMN `Id` `id` BIGINT PRIMARY KEY AUTO_INCREMENT;
ALTER TABLE `company` CHANGE COLUMN `name` `name` VARCHAR(100);
ALTER TABLE `company` CHANGE COLUMN `Name` `name` VARCHAR(100);
ALTER TABLE `company` CHANGE COLUMN `Enabled` `enabled` TINYINT DEFAULT 0;
ALTER TABLE `company` CHANGE COLUMN `RegistrationDate` `registration_date` TIMESTAMP NULL;
ALTER TABLE `company` CHANGE COLUMN `UpdateDate` `update_date` TIMESTAMP NULL;
ALTER TABLE `company` CHANGE COLUMN `IdLastUserUpdate` `id_last_user_update` BIGINT DEFAULT 0;
ALTER TABLE `company` CHANGE COLUMN `AgencyConnection` `agency_connection` VARCHAR(500);

-- ============================================================================
-- Tabla: file_reasons
-- ============================================================================
ALTER TABLE `file_reasons` CHANGE COLUMN `Id` `id` BIGINT PRIMARY KEY AUTO_INCREMENT;
ALTER TABLE `file_reasons` CHANGE COLUMN `Name` `name` VARCHAR(500);
ALTER TABLE `file_reasons` CHANGE COLUMN `IdTypeReason` `id_type_reason` INTEGER;
ALTER TABLE `file_reasons` CHANGE COLUMN `Enabled` `enabled` TINYINT DEFAULT 0;
ALTER TABLE `file_reasons` CHANGE COLUMN `RegistrationDate` `registration_date` TIMESTAMP NULL;
ALTER TABLE `file_reasons` CHANGE COLUMN `UpdateDate` `update_date` TIMESTAMP NULL;
ALTER TABLE `file_reasons` CHANGE COLUMN `IdLastUserUpdate` `id_last_user_update` BIGINT DEFAULT 0;

-- ============================================================================
-- Tabla: file_exception_reason (file_extraordinary_reasons)
-- ============================================================================
ALTER TABLE `file_exception_reason` CHANGE COLUMN `Id` `id` BIGINT PRIMARY KEY AUTO_INCREMENT;
ALTER TABLE `file_exception_reason` CHANGE COLUMN `Name` `name` VARCHAR(500);
ALTER TABLE `file_exception_reason` CHANGE COLUMN `IdTypeReason` `id_type_reason` INTEGER;
ALTER TABLE `file_exception_reason` CHANGE COLUMN `Enabled` `enabled` TINYINT DEFAULT 0;
ALTER TABLE `file_exception_reason` CHANGE COLUMN `RegistrationDate` `registration_date` TIMESTAMP NULL;
ALTER TABLE `file_exception_reason` CHANGE COLUMN `UpdateDate` `update_date` TIMESTAMP NULL;
ALTER TABLE `file_exception_reason` CHANGE COLUMN `IdLastUserUpdate` `id_last_user_update` BIGINT DEFAULT 0;

-- ============================================================================
-- Tabla: file_share_token
-- ============================================================================
ALTER TABLE `file_share_token` CHANGE COLUMN `Id` `id` BIGINT PRIMARY KEY AUTO_INCREMENT;
ALTER TABLE `file_share_token` CHANGE COLUMN `IdFile` `id_file` BIGINT NOT NULL;
ALTER TABLE `file_share_token` CHANGE COLUMN `Token` `token` VARCHAR(255) UNIQUE NOT NULL;
ALTER TABLE `file_share_token` CHANGE COLUMN `ExpirationDate` `expiration_date` TIMESTAMP NULL;
ALTER TABLE `file_share_token` CHANGE COLUMN `Enabled` `enabled` TINYINT DEFAULT 1;
ALTER TABLE `file_share_token` CHANGE COLUMN `RegistrationDate` `registration_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `file_share_token` CHANGE COLUMN `UpdateDate` `update_date` TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP;
ALTER TABLE `file_share_token` CHANGE COLUMN `IdLastUserUpdate` `id_last_user_update` BIGINT DEFAULT 0;

-- ============================================================================
-- Tabla: agency_user
-- ============================================================================
ALTER TABLE `agency_user` CHANGE COLUMN `Id` `id` BIGINT PRIMARY KEY AUTO_INCREMENT;
ALTER TABLE `agency_user` CHANGE COLUMN `IdUser` `id_user` BIGINT NOT NULL;
ALTER TABLE `agency_user` CHANGE COLUMN `IdAgency` `id_agency` BIGINT NOT NULL;

-- ============================================================================
-- Tabla: process_user
-- ============================================================================
ALTER TABLE `process_user` CHANGE COLUMN `Id` `id` BIGINT PRIMARY KEY AUTO_INCREMENT;
ALTER TABLE `process_user` CHANGE COLUMN `IdUser` `id_user` BIGINT NOT NULL;
ALTER TABLE `process_user` CHANGE COLUMN `IdProcess` `id_process` BIGINT NOT NULL;

SET FOREIGN_KEY_CHECKS = 1;

SELECT 'Migración 038 completada: Nombres de columnas convertidos a snake_case' AS status;
