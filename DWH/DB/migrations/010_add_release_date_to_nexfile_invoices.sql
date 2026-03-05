-- ============================================================================
-- MIGRACIÓN 010: Agregar columna release_date a nexfile_invoices
-- ============================================================================
-- release_date: fecha de liberación del pedido (para filtros por rango de fechas)
-- La vista view_single_file_orders hereda la columna automáticamente
-- ============================================================================

USE dwh;

-- Agregar release_date (ejecutar una sola vez; si ya existe, ignorar el error)
ALTER TABLE nexfile_invoices ADD COLUMN release_date DATE NULL;

-- Recrear la vista para incluir la nueva columna
DROP VIEW IF EXISTS view_single_file_orders;
CREATE VIEW view_single_file_orders AS SELECT * FROM nexfile_invoices;
