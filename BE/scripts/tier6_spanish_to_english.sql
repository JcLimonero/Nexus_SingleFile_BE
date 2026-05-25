-- Tier 6 — Spanish → English column renames
-- Applied to: baseline schema (DB/baseline/v1.0/schema.sql)
-- To apply to an existing tenant (e.g. nexfile_tenant_test8), run this script.
-- Idempotent: safe to re-run (uses CHANGE COLUMN which fails noisily if column
-- already renamed — wrap each in EXISTS check if needed).

USE nexfile_tenant_test8;

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- Table: client (2 cols)
-- ============================================================
ALTER TABLE `client` CHANGE COLUMN `razon_social` `business_name` VARCHAR(500) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL;
ALTER TABLE `client` CHANGE COLUMN `tipo_cliente` `client_type` BIGINT DEFAULT NULL;

-- ============================================================
-- Table: client_identification_data (20 cols, RFC/CURP preserved)
-- ============================================================
ALTER TABLE `client_identification_data` CHANGE COLUMN `nombre` `name` VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL;
ALTER TABLE `client_identification_data` CHANGE COLUMN `apellido_paterno` `last_name` VARCHAR(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL;
ALTER TABLE `client_identification_data` CHANGE COLUMN `apellido_materno` `mother_last_name` VARCHAR(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL;
ALTER TABLE `client_identification_data` CHANGE COLUMN `razon_social` `business_name` VARCHAR(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL;
ALTER TABLE `client_identification_data` CHANGE COLUMN `telefono` `tel_number` VARCHAR(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL;
ALTER TABLE `client_identification_data` CHANGE COLUMN `telefono2` `tel_number2` VARCHAR(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL;
ALTER TABLE `client_identification_data` CHANGE COLUMN `calle` `street` VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL;
ALTER TABLE `client_identification_data` CHANGE COLUMN `numero_exterior` `external_number` VARCHAR(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL;
ALTER TABLE `client_identification_data` CHANGE COLUMN `numero_interior` `internal_number` VARCHAR(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL;
ALTER TABLE `client_identification_data` CHANGE COLUMN `colonia` `neighborhood` VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL;
ALTER TABLE `client_identification_data` CHANGE COLUMN `codigo_postal` `postal_code` VARCHAR(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL;
ALTER TABLE `client_identification_data` CHANGE COLUMN `ciudad` `city` VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL;
ALTER TABLE `client_identification_data` CHANGE COLUMN `municipio` `municipality` VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL;
ALTER TABLE `client_identification_data` CHANGE COLUMN `pais` `country` VARCHAR(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL;
ALTER TABLE `client_identification_data` CHANGE COLUMN `fecha_nacimiento` `birth_date` DATE DEFAULT NULL;
ALTER TABLE `client_identification_data` CHANGE COLUMN `pais_nacimiento` `birth_country` VARCHAR(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL;
ALTER TABLE `client_identification_data` CHANGE COLUMN `pais_nacionalidad` `nationality_country` VARCHAR(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL;
ALTER TABLE `client_identification_data` CHANGE COLUMN `autoridad_emite` `issuing_authority` VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL;
ALTER TABLE `client_identification_data` CHANGE COLUMN `fecha_constituccion` `incorporation_date` DATE DEFAULT NULL;
ALTER TABLE `client_identification_data` CHANGE COLUMN `actividad_giro` `business_activity` VARCHAR(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL;

-- ============================================================
-- Table: expedient_pld (22 cols + COMMENTs translated)
-- ============================================================
ALTER TABLE `expedient_pld` CHANGE COLUMN `aviso_privacidad_entregado` `privacy_notice_delivered` TINYINT(1) DEFAULT '0' COMMENT '1=Yes, 0=No';
ALTER TABLE `expedient_pld` CHANGE COLUMN `aviso_privacidad_fecha` `privacy_notice_date` DATETIME DEFAULT NULL COMMENT 'Delivery/acceptance date';
ALTER TABLE `expedient_pld` CHANGE COLUMN `aviso_privacidad_metodo` `privacy_notice_method` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL COMMENT 'In-person, Digital, Mail, Miniportal';
ALTER TABLE `expedient_pld` CHANGE COLUMN `aviso_privacidad_firma` `privacy_notice_signature` VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL COMMENT 'Path or reference to digital signature';
ALTER TABLE `expedient_pld` CHANGE COLUMN `requiere_beneficiario_final` `requires_beneficial_owner` TINYINT(1) DEFAULT '0' COMMENT '1=Applies, 0=Not applicable';
ALTER TABLE `expedient_pld` CHANGE COLUMN `beneficiario_final_capturado` `beneficial_owner_captured` TINYINT(1) DEFAULT '0' COMMENT '1=Yes, 0=Pending';
ALTER TABLE `expedient_pld` CHANGE COLUMN `beneficiario_final_nombre` `beneficial_owner_name` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL;
ALTER TABLE `expedient_pld` CHANGE COLUMN `beneficiario_final_rfc` `beneficial_owner_rfc` VARCHAR(13) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL;
ALTER TABLE `expedient_pld` CHANGE COLUMN `beneficiario_final_curp` `beneficial_owner_curp` VARCHAR(18) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL;
ALTER TABLE `expedient_pld` CHANGE COLUMN `beneficiario_final_porcentaje` `beneficial_owner_percentage` DECIMAL(5,2) DEFAULT NULL COMMENT 'Participation percentage';
ALTER TABLE `expedient_pld` CHANGE COLUMN `beneficiario_final_fecha_captura` `beneficial_owner_capture_date` DATETIME DEFAULT NULL;
ALTER TABLE `expedient_pld` CHANGE COLUMN `proveedor_recursos_capturado` `funds_source_captured` TINYINT(1) DEFAULT '0' COMMENT '1=Yes, 0=Pending';
ALTER TABLE `expedient_pld` CHANGE COLUMN `proveedor_recursos_descripcion` `funds_source_description` VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL COMMENT 'Description of funds origin';
ALTER TABLE `expedient_pld` CHANGE COLUMN `proveedor_recursos_fecha_captura` `funds_source_capture_date` DATETIME DEFAULT NULL;
ALTER TABLE `expedient_pld` CHANGE COLUMN `tipo_identificacion` `identification_type` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL COMMENT 'CIF, CSF or NULL if not applicable';
ALTER TABLE `expedient_pld` CHANGE COLUMN `geolocalizacion_capturada` `geolocation_captured` TINYINT(1) DEFAULT '0' COMMENT '1=Yes, 0=No';
ALTER TABLE `expedient_pld` CHANGE COLUMN `geolocalizacion_latitud` `geolocation_latitude` DECIMAL(10,8) DEFAULT NULL;
ALTER TABLE `expedient_pld` CHANGE COLUMN `geolocalizacion_longitud` `geolocation_longitude` DECIMAL(11,8) DEFAULT NULL;
ALTER TABLE `expedient_pld` CHANGE COLUMN `geolocalizacion_fecha` `geolocation_date` DATETIME DEFAULT NULL;
ALTER TABLE `expedient_pld` CHANGE COLUMN `geolocalizacion_origen` `geolocation_origin` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL COMMENT 'Miniportal, App, Agency';
ALTER TABLE `expedient_pld` CHANGE COLUMN `expediente_pld_completo` `expedient_pld_complete` TINYINT(1) DEFAULT '0' COMMENT '1=Complete, 0=Incomplete';
ALTER TABLE `expedient_pld` CHANGE COLUMN `expediente_pld_completo_fecha` `expedient_pld_complete_date` DATETIME DEFAULT NULL COMMENT 'When it was marked complete';

-- ============================================================
-- Table: expedient_pld_beneficial_owner (2 cols, RFC/CURP preserved)
-- ============================================================
ALTER TABLE `expedient_pld_beneficial_owner` CHANGE COLUMN `nombre` `name` VARCHAR(255) NOT NULL;
ALTER TABLE `expedient_pld_beneficial_owner` CHANGE COLUMN `porcentaje_participacion` `participation_percentage` DECIMAL(5,2) DEFAULT NULL;

-- ============================================================
-- Table: expedient_pld_geo_log (4 cols)
-- ============================================================
ALTER TABLE `expedient_pld_geo_log` CHANGE COLUMN `latitud` `latitude` DECIMAL(10,8) NOT NULL;
ALTER TABLE `expedient_pld_geo_log` CHANGE COLUMN `longitud` `longitude` DECIMAL(11,8) NOT NULL;
ALTER TABLE `expedient_pld_geo_log` CHANGE COLUMN `accion` `action` VARCHAR(100) DEFAULT NULL COMMENT 'Accept notice, Upload document, Sign';
ALTER TABLE `expedient_pld_geo_log` CHANGE COLUMN `origen` `origin` VARCHAR(50) DEFAULT NULL COMMENT 'Miniportal, App';

-- ============================================================
-- View: view_client_relations — update to reference renamed columns
-- ============================================================
DROP VIEW IF EXISTS `view_client_relations`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY INVOKER VIEW `view_client_relations` AS
  SELECT `hc`.`id_client` AS `idCliente`,
         COALESCE(`ctr`.`id_dms`, '') AS `ndCliente`,
         TRIM(CONCAT(COALESCE(`c`.`name`, ''), ' ', COALESCE(`c`.`last_name`, ''), ' ', COALESCE(`c`.`mother_last_name`, ''))) AS `cliente`,
         `hc`.`id` AS `IdClientHeader`,
         `c`.`name` AS `nombre`,
         `c`.`last_name` AS `apellidoPaterno`,
         `c`.`mother_last_name` AS `apellidoMaterno`,
         `c`.`RFC` AS `rfc`,
         `c`.`email` AS `email`,
         `c`.`tel_number` AS `telefono`,
         `c`.`tel_number2` AS `telefono2`,
         `c`.`business_name` AS `razonSocial`,
         `c`.`CURP` AS `curp`,
         `c`.`client_type` AS `tipoCliente`,
         `c`.`adviser` AS `asesor`,
         `c`.`agency_origin` AS `agenciaOrigen`,
         `c`.`registration_date` AS `fechaRegistro`,
         `c`.`update_date` AS `fechaActualizacion`,
         `ctr`.`id_agency` AS `id_agency`
  FROM ((`client_header` `hc`
    JOIN `client_dms_relation` `ctr` ON ((`hc`.`id` = `ctr`.`id_client_header`)))
    JOIN `client` `c` ON ((`c`.`id` = `hc`.`id_client`)));

SET FOREIGN_KEY_CHECKS = 1;
