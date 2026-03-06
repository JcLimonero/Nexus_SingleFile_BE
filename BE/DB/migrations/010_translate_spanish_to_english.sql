-- ============================================================================
-- MIGRACIÓN 010: Traducir nombres en español a inglés
-- ============================================================================
-- Descripción: Renombra tablas y columnas que están en español a inglés
-- Prioridad: ALTA
-- Fecha: 2026-02-27
-- ============================================================================

-- Renombrar tablas
RENAME TABLE `expedientes_corregir` TO `files_to_correct`;
RENAME TABLE `file_pld_beneficiario_final` TO `file_pld_beneficial_owner`;
RENAME TABLE `user_rol` TO `user_role`;

-- Renombrar columnas en order_by_car
ALTER TABLE `order_by_car` 
CHANGE COLUMN `Modelo` `Model` VARCHAR(200) NULL DEFAULT NULL;

ALTER TABLE `order_by_car` 
CHANGE COLUMN `Asesor` `Advisor` VARCHAR(200) NULL DEFAULT NULL;

SELECT 'Migración 010 completada: Nombres en español traducidos a inglés' AS status;
