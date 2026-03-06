-- ============================================================================
-- MIGRACIÓN 059: Agregar columna tipo_cliente a tabla client
-- ============================================================================
-- Valores: 'fisica' (persona física) | 'moral' (persona moral)
-- Fecha: 2026-03-03
-- ============================================================================

ALTER TABLE `client` ADD COLUMN `tipo_cliente` VARCHAR(10) NULL DEFAULT NULL;
