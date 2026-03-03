-- ============================================================================
-- MIGRACIÓN 054: Crear tabla client_identification_data
-- ============================================================================
-- Almacena datos editables del formulario de identificación por cliente.
-- Merge: si existe registro guardado se usa; si no, se usan datos de client.
-- Fecha: 2026-03-03
-- ============================================================================

CREATE TABLE IF NOT EXISTS `client_identification_data` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `id_client` BIGINT NOT NULL,
    `nombre` VARCHAR(255) NULL,
    `apellido_paterno` VARCHAR(100) NULL,
    `apellido_materno` VARCHAR(100) NULL,
    `razon_social` VARCHAR(500) NULL,
    `rfc` VARCHAR(50) NULL,
    `curp` VARCHAR(50) NULL,
    `email` VARCHAR(255) NULL,
    `telefono` VARCHAR(50) NULL,
    `telefono2` VARCHAR(50) NULL,
    `calle` VARCHAR(255) NULL,
    `numero_exterior` VARCHAR(50) NULL,
    `numero_interior` VARCHAR(50) NULL,
    `colonia` VARCHAR(255) NULL,
    `codigo_postal` VARCHAR(20) NULL,
    `ciudad` VARCHAR(255) NULL,
    `municipio` VARCHAR(255) NULL,
    `pais` VARCHAR(100) NULL,
    `fecha_nacimiento` DATE NULL,
    `pais_nacimiento` VARCHAR(100) NULL,
    `pais_nacionalidad` VARCHAR(100) NULL,
    `autoridad_emite` VARCHAR(255) NULL,
    `fecha_constituccion` DATE NULL,
    `actividad_giro` VARCHAR(500) NULL,
    `registration_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `update_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `id_last_user_update` BIGINT NULL,
    `enabled` TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_id_client` (`id_client`),
    CONSTRAINT `fk_cid_client` FOREIGN KEY (`id_client`) REFERENCES `client` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
