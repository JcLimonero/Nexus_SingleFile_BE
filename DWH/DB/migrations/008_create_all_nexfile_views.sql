-- ============================================================================
-- MIGRACIÓN 008: Crear todas las vistas Nexfile en dwh
-- ============================================================================
-- La API Nexfile usa 3 vistas. Cuando database=dwh, deben existir en dwh:
--   - view_single_file_client  -> nexfile_customers (customers API)
--   - single_file_orders_latest -> nexfile_orders (orders API)
--   - view_single_file_orders  -> nexfile_invoices (invoices API)
-- Requiere: nexfile_customers, nexfile_orders, nexfile_invoices pobladas
-- Para usar: database en app/Config/database-config.json = "dwh"
-- ============================================================================

USE dwh;

-- Customers
DROP VIEW IF EXISTS view_single_file_client;
CREATE VIEW view_single_file_client AS SELECT * FROM nexfile_customers;

-- Orders (la API usa single_file_orders_latest, no view_single_file_orders)
DROP VIEW IF EXISTS single_file_orders_latest;
CREATE VIEW single_file_orders_latest AS SELECT * FROM nexfile_orders;

-- Invoices
DROP VIEW IF EXISTS view_single_file_orders;
CREATE VIEW view_single_file_orders AS SELECT * FROM nexfile_invoices;
