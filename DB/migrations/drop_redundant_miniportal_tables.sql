-- Eliminar tablas redundantes del Miniportal (se usan file_pld y file_pld_geolog)
-- Ejecutar solo si ya creó File_ShareToken_Acceptance y File_ShareToken_GeoLog

DROP TABLE IF EXISTS `File_ShareToken_GeoLog`;
DROP TABLE IF EXISTS `File_ShareToken_Acceptance`;
