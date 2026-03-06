-- ============================================================================
-- MIGRACIÓN 003: Crear tabla nexfile_invoices y vista view_single_file_orders
-- ============================================================================
-- Origen: vista view_single_file_orders (vgd_dwh_prod)
-- La tabla se puebla con populate-nexfile-invoices.php (60% match nexfile_orders, 40% no match)
-- La vista permite que la API lea de nexfile_invoices cuando la BD es dwh
-- Requiere: nexfile_orders poblada (migración 001)
-- ============================================================================

USE dwh;

-- Crear tabla con estructura de la vista
DROP TABLE IF EXISTS nexfile_invoices;
CREATE TABLE nexfile_invoices AS
SELECT * FROM vgd_dwh_prod.view_single_file_orders WHERE 1 = 0;

-- Columna id para primary key
ALTER TABLE nexfile_invoices ADD COLUMN id BIGINT AUTO_INCREMENT PRIMARY KEY FIRST;

-- Vista para que la API (cuando BD=dwh) lea de nexfile_invoices sin cambiar código
DROP VIEW IF EXISTS view_single_file_orders;
CREATE VIEW view_single_file_orders AS SELECT * FROM nexfile_invoices;

-- Índices (ajustar nombres de columna si la vista usa id_agency, orderDMS, etc.)
-- CREATE INDEX idx_nexfile_invoices_id_agency ON nexfile_invoices(idAgency);
