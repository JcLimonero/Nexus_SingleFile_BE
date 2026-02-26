-- Tabla de beneficiarios finales por expediente (PLD - Persona Moral)
-- Requerida para cumplimiento AML cuando el cliente es persona moral

CREATE TABLE IF NOT EXISTS `file_pld_beneficiariofinal` (
    `Id` BIGINT NOT NULL AUTO_INCREMENT,
    `IdFile` BIGINT NOT NULL COMMENT 'FK a File.Id - expediente',
    `Nombre` VARCHAR(255) NOT NULL COMMENT 'Nombre completo del beneficiario final',
    `RFC` VARCHAR(20) NULL,
    `CURP` VARCHAR(18) NULL,
    `PorcentajeParticipacion` DECIMAL(5,2) NULL COMMENT 'Porcentaje de participación (0-100)',
    PRIMARY KEY (`Id`),
    KEY `idx_beneficiariofinal_idfile` (`IdFile`),
    CONSTRAINT `fk_beneficiariofinal_file` FOREIGN KEY (`IdFile`) REFERENCES `File` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Beneficiarios finales por expediente (PLD/AML)';
