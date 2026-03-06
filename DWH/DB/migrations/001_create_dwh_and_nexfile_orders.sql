-- ============================================================================
-- MIGRACIÓN 001: Crear BD dwh y tabla nexfile_orders
-- ============================================================================
-- Origen: vista single_file_orders_latest (vgd_dwh_prod)
-- Alternativa: single_file_order_lasted (cambiar todas las referencias si aplica)
-- Tabla: nexfile_orders - 20 registros por agencia
-- Agencias: 99999, 88888, 1356, 1, 10017, 2, 10082, 2003
-- Requiere: MySQL 8+ (ROW_NUMBER)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS dwh
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_520_ci;

USE dwh;

-- Crear tabla con estructura de la vista + columna auxiliar _rn
DROP TABLE IF EXISTS nexfile_orders;
CREATE TABLE nexfile_orders AS
SELECT *, 0 AS _rn FROM vgd_dwh_prod.single_file_orders_latest WHERE 1 = 0;

-- Poblar con 20 registros por agencia (la vista usa idAgency)
INSERT INTO nexfile_orders
SELECT * FROM (
  SELECT
    v.*,
    ROW_NUMBER() OVER (
      PARTITION BY v.idAgency
      ORDER BY v.order_dms
    ) AS _rn
  FROM vgd_dwh_prod.single_file_orders_latest v
  WHERE v.idAgency IN (99999, 88888, 1356, 1, 10017, 2, 10082, 2003)
) ranked
WHERE _rn <= 20;

-- Eliminar columna auxiliar
ALTER TABLE nexfile_orders DROP COLUMN _rn;

-- Índices útiles
CREATE INDEX idx_nexfile_orders_id_agency ON nexfile_orders(idAgency);
