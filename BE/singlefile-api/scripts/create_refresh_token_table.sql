-- Crear tabla User_RefreshToken para manejo de refresh tokens
CREATE TABLE IF NOT EXISTS `User_RefreshToken` (
  `Id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `IdUser` bigint NOT NULL,
  `RefreshToken` text NOT NULL,
  `ExpirationDate` datetime NOT NULL,
  `CreatedDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdateDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `IdUser` (`IdUser`),
  KEY `idx_refresh_token` (`RefreshToken`(255)),
  CONSTRAINT `fk_user_refresh_token_user` FOREIGN KEY (`IdUser`) REFERENCES `User` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
