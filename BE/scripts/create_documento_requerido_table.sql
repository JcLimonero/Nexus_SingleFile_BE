-- Script para crear la tabla DocumentoRequerido
-- Ejecutar este script en tu base de datos MySQL

-- Crear la tabla DocumentoRequerido
CREATE TABLE IF NOT EXISTS `DocumentoRequerido` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `IdProceso` int(11) NOT NULL COMMENT 'ID del proceso asociado',
  `IdAgencia` int(11) NOT NULL COMMENT 'ID de la agencia asociada',
  `IdTipoCliente` int(11) NOT NULL COMMENT 'ID del tipo de cliente',
  `IdTipoOperacion` int(11) NOT NULL COMMENT 'ID del tipo de operación',
  `IdTipoDocumento` int(11) NOT NULL COMMENT 'ID del tipo de documento',
  `Orden` int(11) NOT NULL DEFAULT 1 COMMENT 'Orden de presentación del documento',
  `Requerido` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Si el documento es obligatorio (1=Sí, 0=No)',
  `RequiereExpiracion` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Si requiere fecha de expiración (1=Sí, 0=No)',
  `Comentarios` text DEFAULT NULL COMMENT 'Comentarios adicionales sobre el documento',
  `Enabled` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Estado del documento (1=Activo, 0=Inactivo)',
  `RegistrationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de registro',
  `UpdateDate` datetime DEFAULT NULL COMMENT 'Fecha de última actualización',
  `IdLastUserUpdate` int(11) DEFAULT NULL COMMENT 'ID del último usuario que actualizó',
  PRIMARY KEY (`Id`),
  UNIQUE KEY `uk_configuracion_documento` (`IdProceso`, `IdAgencia`, `IdTipoCliente`, `IdTipoOperacion`, `IdTipoDocumento`),
  KEY `idx_proceso` (`IdProceso`),
  KEY `idx_agencia` (`IdAgencia`),
  KEY `idx_tipo_cliente` (`IdTipoCliente`),
  KEY `idx_tipo_operacion` (`IdTipoOperacion`),
  KEY `idx_tipo_documento` (`IdTipoDocumento`),
  KEY `idx_orden` (`Orden`),
  KEY `idx_enabled` (`Enabled`),
  KEY `idx_registration_date` (`RegistrationDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Configuración de documentos requeridos por proceso, agencia, tipo de cliente y tipo de operación';

-- Agregar restricciones de clave foránea (opcional, si las tablas referenciadas existen)
-- ALTER TABLE `DocumentoRequerido` ADD CONSTRAINT `fk_dr_proceso` FOREIGN KEY (`IdProceso`) REFERENCES `Proceso` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;
-- ALTER TABLE `DocumentoRequerido` ADD CONSTRAINT `fk_dr_agencia` FOREIGN KEY (`IdAgencia`) REFERENCES `Agency` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;
-- ALTER TABLE `DocumentoRequerido` ADD CONSTRAINT `fk_dr_tipo_cliente` FOREIGN KEY (`IdTipoCliente`) REFERENCES `CostumerType` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;
-- ALTER TABLE `DocumentoRequerido` ADD CONSTRAINT `fk_dr_tipo_operacion` FOREIGN KEY (`IdTipoOperacion`) REFERENCES `TipoOperacion` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;
-- ALTER TABLE `DocumentoRequerido` ADD CONSTRAINT `fk_dr_tipo_documento` FOREIGN KEY (`IdTipoDocumento`) REFERENCES `DocumentType` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Insertar algunos datos de ejemplo
INSERT INTO `DocumentoRequerido` (
  `IdProceso`, `IdAgencia`, `IdTipoCliente`, `IdTipoOperacion`, `IdTipoDocumento`, 
  `Orden`, `Requerido`, `RequiereExpiracion`, `Comentarios`, `Enabled`
) VALUES 
(1, 1, 1, 1, 1, 1, 1, 1, 'Documento obligatorio para el proceso', 1),
(1, 1, 1, 1, 2, 2, 1, 0, 'Segundo documento requerido', 1),
(1, 1, 2, 1, 1, 1, 1, 1, 'Documento para tipo de cliente diferente', 1),
(2, 1, 1, 1, 1, 1, 1, 0, 'Documento para proceso diferente', 1);

-- Verificar la estructura de la tabla
DESCRIBE `DocumentoRequerido`;

-- Mostrar los datos insertados
SELECT 
  dr.Id,
  dr.IdProceso,
  dr.IdAgencia,
  dr.IdTipoCliente,
  dr.IdTipoOperacion,
  dr.IdTipoDocumento,
  dr.Orden,
  dr.Requerido,
  dr.RequiereExpiracion,
  dr.Comentarios,
  dr.Enabled,
  dr.RegistrationDate
FROM `DocumentoRequerido` dr
ORDER BY dr.IdProceso, dr.IdAgencia, dr.IdTipoCliente, dr.IdTipoOperacion, dr.Orden;

-- Mostrar estadísticas básicas
SELECT 
  COUNT(*) as total_documentos,
  SUM(dr.Requerido) as documentos_requeridos,
  SUM(dr.RequiereExpiracion) as documentos_con_expiracion,
  COUNT(DISTINCT dr.IdProceso) as procesos_unicos,
  COUNT(DISTINCT dr.IdAgencia) as agencias_unicas
FROM `DocumentoRequerido` dr
WHERE dr.Enabled = 1;
