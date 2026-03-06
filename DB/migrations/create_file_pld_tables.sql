-- Tablas PLD para aviso de privacidad y geolocalización (Miniportal)
-- Si no existen, crearlas para que el reporte de expedientes sin aviso funcione

CREATE TABLE IF NOT EXISTS `file_pld` (
    `Id` BIGINT NOT NULL AUTO_INCREMENT,
    `IdFile` BIGINT NOT NULL COMMENT 'FK a File.Id - expediente',
    `AvisoPrivacidadEntregado` TINYINT(1) DEFAULT 0 COMMENT '1=Aceptado, 0=No',
    `AvisoPrivacidadFecha` DATETIME NULL,
    `AvisoPrivacidadMetodo` VARCHAR(100) NULL COMMENT 'Miniportal, Agencia, etc.',
    `AvisoPrivacidadFirma` TEXT NULL,
    `GeolocalizacionCapturada` TINYINT(1) DEFAULT 0,
    `GeolocalizacionLatitud` DECIMAL(10,8) NULL,
    `GeolocalizacionLongitud` DECIMAL(11,8) NULL,
    `GeolocalizacionFecha` DATETIME NULL,
    `GeolocalizacionOrigen` VARCHAR(100) NULL,
    PRIMARY KEY (`Id`),
    UNIQUE KEY `uk_file_pld_idfile` (`IdFile`),
    CONSTRAINT `fk_file_pld_file` FOREIGN KEY (`IdFile`) REFERENCES `File` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Datos PLD por expediente - aviso privacidad, geolocalización';

CREATE TABLE IF NOT EXISTS `file_pld_geolog` (
    `Id` BIGINT NOT NULL AUTO_INCREMENT,
    `IdFile` BIGINT NOT NULL COMMENT 'FK a File.Id',
    `Latitud` DECIMAL(10,8) NULL,
    `Longitud` DECIMAL(11,8) NULL,
    `Accion` VARCHAR(200) NULL COMMENT 'Aceptar aviso, Ver documento, etc.',
    `Origen` VARCHAR(100) NULL DEFAULT 'Miniportal',
    PRIMARY KEY (`Id`),
    KEY `idx_geolog_idfile` (`IdFile`),
    CONSTRAINT `fk_geolog_file` FOREIGN KEY (`IdFile`) REFERENCES `File` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Registro de geolocalización por acción PLD';
