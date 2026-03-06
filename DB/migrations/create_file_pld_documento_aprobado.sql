-- Tabla para registrar aprobación de documentos por el cliente en Miniportal
-- Una vez aprobado, el documento no puede ser modificado (reemplazado) por el cliente

CREATE TABLE IF NOT EXISTS `file_pld_documento_aprobado` (
    `Id` BIGINT NOT NULL AUTO_INCREMENT,
    `IdDocumentByFile` BIGINT NOT NULL COMMENT 'FK a DocumentByFile.Id',
    `IdFile` BIGINT NOT NULL COMMENT 'FK a File.Id - expediente',
    `AprobadoCliente` TINYINT(1) DEFAULT 1 COMMENT '1=Aprobado por cliente',
    `FechaAprobacion` DATETIME NULL,
    PRIMARY KEY (`Id`),
    UNIQUE KEY `uk_doc_aprobado_iddocumentbyfile` (`IdDocumentByFile`),
    KEY `idx_doc_aprobado_idfile` (`IdFile`),
    CONSTRAINT `fk_doc_aprobado_documentbyfile` FOREIGN KEY (`IdDocumentByFile`) REFERENCES `DocumentByFile` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `fk_doc_aprobado_file` FOREIGN KEY (`IdFile`) REFERENCES `File` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Documentos aprobados por el cliente en Miniportal - no se pueden modificar';
