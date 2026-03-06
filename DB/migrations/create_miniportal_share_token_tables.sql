-- Miniportal: token único por expediente (acceso sin login)
-- Aceptación del aviso y geolocalización se registran en file_pld y file_pld_geolog

CREATE TABLE IF NOT EXISTS `File_ShareToken` (
    `Id` BIGINT NOT NULL AUTO_INCREMENT,
    `IdFile` BIGINT NOT NULL COMMENT 'FK a File.Id - expediente',
    `Token` CHAR(36) NOT NULL COMMENT 'UUID único para acceso al miniportal',
    `ExpirationDate` DATETIME NULL COMMENT 'Fecha de expiración del token (NULL = sin expiración)',
    `Enabled` TINYINT(1) DEFAULT 1 COMMENT '1=Activo, 0=Revocado',
    `RegistrationDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `UpdateDate` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `IdLastUserUpdate` BIGINT NULL,
    PRIMARY KEY (`Id`),
    UNIQUE KEY `uk_share_token_token` (`Token`),
    UNIQUE KEY `uk_share_token_idfile` (`IdFile`),
    KEY `idx_share_token_enabled` (`Enabled`),
    CONSTRAINT `fk_share_token_file` FOREIGN KEY (`IdFile`) REFERENCES `File` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Token único por expediente para acceso al Miniportal';
