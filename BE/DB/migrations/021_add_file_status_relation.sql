-- ============================================================================
-- MIGRACIÓN 021: Agregar Relación entre file_sub_status y file_status
-- ============================================================================
-- Descripción: Agrega una foreign key de file_sub_status hacia file_status
-- Prioridad: MEDIA
-- Fecha: 2026-02-28
-- ============================================================================

-- Agregar columna IdFileStatus en file_sub_status
ALTER TABLE `file_sub_status`
  ADD COLUMN `IdFileStatus` INT NULL DEFAULT NULL AFTER `Id`;

-- Crear índice para mejorar el rendimiento de las consultas
CREATE INDEX `IDX_file_sub_status_IdFileStatus` ON `file_sub_status` (`IdFileStatus`);

-- Agregar foreign key constraint
ALTER TABLE `file_sub_status`
  ADD CONSTRAINT `FK_file_sub_status_file_status`
  FOREIGN KEY (`IdFileStatus`) 
  REFERENCES `file_status` (`Id`)
  ON DELETE SET NULL
  ON UPDATE CASCADE;

SELECT 'Migración 021 completada: Relación entre file_sub_status y file_status agregada' AS status;
