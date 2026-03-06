-- ============================================================================
-- MIGRACIÓN 006: Eliminar Tablas No Utilizadas
-- ============================================================================
-- Descripción: Elimina tablas de configuración externa, futuro/planeado y legacy
-- Prioridad: MEDIA
-- Fecha: 2026-02-27
-- ============================================================================
-- ADVERTENCIA: Este script elimina tablas permanentemente
-- Hacer backup antes de ejecutar
-- ============================================================================

-- Tablas de Configuración Externa (5)
-- appversion, bank, cfdi, insurancecarrier, smtp_configurator

-- Tablas de Futuro/Planeado (4)
-- file_extraordinary_events, file_extraordinary_type, file_release_steps, file_tracking

-- Tablas Legacy/Deprecated (2)
-- tracking_file, tracking_operation

-- ============================================================================
-- ELIMINAR TABLAS DE CONFIGURACIÓN EXTERNA
-- ============================================================================

DROP TABLE IF EXISTS `appversion`;
DROP TABLE IF EXISTS `bank`;
DROP TABLE IF EXISTS `cfdi`;
DROP TABLE IF EXISTS `insurancecarrier`;
DROP TABLE IF EXISTS `smtp_configurator`;

-- ============================================================================
-- ELIMINAR TABLAS DE FUTURO/PLANEADO
-- ============================================================================

DROP TABLE IF EXISTS `file_extraordinary_events`;
DROP TABLE IF EXISTS `file_extraordinary_type`;
DROP TABLE IF EXISTS `file_release_steps`;
DROP TABLE IF EXISTS `file_tracking`;

-- ============================================================================
-- ELIMINAR TABLAS LEGACY/DEPRECATED
-- ============================================================================

DROP TABLE IF EXISTS `tracking_file`;
DROP TABLE IF EXISTS `tracking_operation`;

-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================

SELECT 'Migración 006 completada: Tablas no utilizadas eliminadas' AS status;
SELECT 'Total de tablas eliminadas: 11' AS summary;
