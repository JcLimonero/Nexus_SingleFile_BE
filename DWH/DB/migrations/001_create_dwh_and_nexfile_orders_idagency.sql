-- ============================================================================
-- VARIANTE: Si la vista usa idAgency (camelCase) en lugar de id_agency
-- ============================================================================
-- Usar este archivo si 001_create_dwh_and_nexfile_orders.sql falla con
-- "Unknown column 'id_agency'"
-- ============================================================================

CREATE DATABASE IF NOT EXISTS dwh
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_520_ci;

USE dwh;

DROP TABLE IF EXISTS nexfile_orders;
CREATE TABLE nexfile_orders AS
SELECT *, 0 AS _rn FROM vgd_dwh_prod.single_file_orders_latest WHERE 1 = 0;

INSERT INTO nexfile_orders
SELECT * FROM (
  SELECT
    v.*,
    ROW_NUMBER() OVER (
      PARTITION BY v.idAgency
      ORDER BY COALESCE(v.id, v.order_dms, v.numeroPedido, 0)
    ) AS _rn
  FROM vgd_dwh_prod.single_file_orders_latest v
  WHERE v.idAgency IN (99999, 88888, 1356, 1, 10017, 2, 10082, 2003)
) ranked
WHERE _rn <= 20;

ALTER TABLE nexfile_orders DROP COLUMN _rn;
CREATE INDEX idx_nexfile_orders_id_agency ON nexfile_orders(idAgency);
