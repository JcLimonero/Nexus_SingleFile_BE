-- ============================================================================
-- MIGRACIÓN 011: Agregar bussines_name, tipo_cliente, tipo_operacion, tipo_proceso
-- ============================================================================
-- Para Consolidación DMS: mostrar razón social, tipo cliente, tipo operación, tipo proceso
-- ============================================================================

USE dwh;

ALTER TABLE nexfile_invoices ADD COLUMN bussines_name VARCHAR(200) NULL;
ALTER TABLE nexfile_invoices ADD COLUMN tipo_cliente VARCHAR(20) NULL;
ALTER TABLE nexfile_invoices ADD COLUMN tipo_operacion VARCHAR(50) NULL;
ALTER TABLE nexfile_invoices ADD COLUMN tipo_proceso VARCHAR(50) NULL;

DROP VIEW IF EXISTS view_single_file_orders;
CREATE VIEW view_single_file_orders AS SELECT * FROM nexfile_invoices;
