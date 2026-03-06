-- ============================================================================
-- MIGRACIÓN 007: Crear vista view_single_file_client en dwh
-- ============================================================================
-- La API Nexfile lee de view_single_file_client. Cuando la BD configurada es
-- vgd_dwh_prod, usa la vista de producción. Para desarrollo local con datos
-- anonimizados en dwh.nexfile_customers, esta vista permite que la API lea
-- de nexfile_customers sin cambiar código.
-- Requiere: nexfile_customers poblada (populate-nexfile-customers.php)
-- Para usar: cambiar database en app/Config/database-config.json a "dwh"
-- ============================================================================

USE dwh;

DROP VIEW IF EXISTS view_single_file_client;
CREATE VIEW view_single_file_client AS SELECT * FROM nexfile_customers;
