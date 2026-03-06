-- Script para optimizar índices de Analytics
-- Ejecutar este script en la base de datos para mejorar el rendimiento de las queries de analytics

-- Índice compuesto para queries que filtran por RegistrationDate y IdAgency
-- Esto mejora significativamente getAgencyMetrics, getTrendData, etc.
CREATE INDEX IF NOT EXISTS `IDX_File_RegistrationDate_IdAgency` 
ON `File` (`RegistrationDate`, `IdAgency`);

-- Índice compuesto para queries que filtran por RegistrationDate, IdAgency e IdCurrentState
-- Esto mejora getTrendData, getCurrentMonthStatusDistribution, etc.
CREATE INDEX IF NOT EXISTS `IDX_File_RegistrationDate_IdAgency_IdCurrentState` 
ON `File` (`RegistrationDate`, `IdAgency`, `IdCurrentState`);

-- Índice compuesto para queries que filtran por RegistrationDate e idSeller
-- Esto mejora queries con filtro de usuario
CREATE INDEX IF NOT EXISTS `IDX_File_RegistrationDate_idSeller` 
ON `File` (`RegistrationDate`, `idSeller`);

-- Índice compuesto para queries que filtran por RegistrationDate, IdAgency e idSeller
-- Esto mejora queries con ambos filtros
CREATE INDEX IF NOT EXISTS `IDX_File_RegistrationDate_IdAgency_idSeller` 
ON `File` (`RegistrationDate`, `IdAgency`, `idSeller`);

-- Índice para CloseDate (usado en getAttentionPeriod)
CREATE INDEX IF NOT EXISTS `IDX_File_CloseDate` 
ON `File` (`CloseDate`);

-- Índice compuesto para queries de atención que usan RegistrationDate y CloseDate
CREATE INDEX IF NOT EXISTS `IDX_File_RegistrationDate_CloseDate` 
ON `File` (`RegistrationDate`, `CloseDate`);

-- Verificar índices creados
SHOW INDEX FROM `File` WHERE Key_name LIKE 'IDX_File%';
