-- ============================================================================
-- MIGRACIÓN 012: Agregar columna agency_connection a nexfile_customers y nexfile_invoices
-- ============================================================================
-- agency_connection: tipo de conexión según id_agency (agencyDms)
-- Ej: 99999/88888->GeelyConnection, 1/2->KiaConnection, 1356->AudiConnection, etc.
-- ============================================================================

USE dwh;

ALTER TABLE nexfile_customers ADD COLUMN agency_connection VARCHAR(50) NULL;
ALTER TABLE nexfile_invoices ADD COLUMN agency_connection VARCHAR(50) NULL;

DROP VIEW IF EXISTS view_single_file_orders;
CREATE VIEW view_single_file_orders AS SELECT * FROM nexfile_invoices;
