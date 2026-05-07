-- =============================================================================
-- API keys externas genéricas (tabla Integration_ApiKey)
-- Ejecutar: mysql -u USUARIO -p NOMBRE_BASE < scripts/integration_api_key_setup.sql
-- O dentro de mysql: SOURCE /ruta/al/proyecto/BE/scripts/integration_api_key_setup.sql;
-- =============================================================================

-- 1) Opción A: ya tenías la tabla antigua solo con nombre "liquidaciones"
SET @have_legacy := (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'Liquidacion_Integration_ApiKey'
);
SET @have_new := (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'Integration_ApiKey'
);

-- Renombrar solo si existe la vieja y no la nueva (evitar error)
SET @sql_rename := IF(
    @have_legacy > 0 AND @have_new = 0,
    'RENAME TABLE `Liquidacion_Integration_ApiKey` TO `Integration_ApiKey`',
    'SELECT ''rename omitido'' AS info'
);
PREPARE stmt FROM @sql_rename;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 2) Opción B: crear desde cero si no existe ninguna de las dos
CREATE TABLE IF NOT EXISTS `Integration_ApiKey` (
    `Id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(200) NOT NULL,
    `KeyHash` VARCHAR(64) NOT NULL COMMENT 'SHA-256 hex of the API key (never store plain key)',
    `Enabled` TINYINT(1) UNSIGNED NOT NULL DEFAULT 1,
    `CreatedDate` DATETIME NOT NULL,
    `LastUsedDate` DATETIME DEFAULT NULL,
    PRIMARY KEY (`Id`),
    UNIQUE KEY `uq_integration_apikey_hash` (`KeyHash`),
    KEY `idx_integration_apikey_enabled` (`Enabled`)
) DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- 3) Insertar ejemplo (solo si ese hash NO existe ya)
--    Clave en texto plano: CAMBIA_ESTA_FRASE_SEGURA
--    El hash debe ser SHA2 en hex (64 caracteres), igual que en PHP: hash('sha256', plain)
INSERT INTO `Integration_ApiKey` (`Name`, `KeyHash`, `Enabled`, `CreatedDate`)
SELECT 'Demo integración externa',
       SHA2('CAMBIA_ESTA_FRASE_SEGURA', 256),
       1,
       NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM `Integration_ApiKey` LIMIT 1
);

-- Opcional: descomenta para insertar otra fila cuando ya haya registros:
-- INSERT INTO `Integration_ApiKey` (`Name`, `KeyHash`, `Enabled`, `CreatedDate`)
-- VALUES ('Otro cliente', SHA2('OTRA_CLAVE_SECRETA', 256), 1, NOW());
