-- ============================================================================
-- MIGRACIÓN 040: Corregir vista view_client_company_amount
-- ============================================================================
-- La vista usa tablas/columnas renombradas (order, snake_case).
-- Ejecutar después de la migración 039.
-- ============================================================================

DROP VIEW IF EXISTS view_client_company_amount;

CREATE VIEW view_client_company_amount AS
SELECT
    c.id AS idCliente,
    a.id_company AS idCompany,
    YEAR(f.registration_date) AS anio,
    SUM(COALESCE(obc1.amount, obc2.amount, 0)) AS totalMonto
FROM expedient f
INNER JOIN client c ON f.id_client = c.id
INNER JOIN agency a ON f.id_agency = a.id
LEFT JOIN `order` obc1 ON obc1.id = f.id_order
LEFT JOIN (
    SELECT obc2a.id_dms, obc2a.id_agency, obc2a.amount
    FROM `order` obc2a
    INNER JOIN (
        SELECT id_dms, id_agency, MAX(COALESCE(registration_date, '1900-01-01')) AS MaxDate
        FROM `order`
        GROUP BY id_dms, id_agency
    ) obc2b ON obc2a.id_dms = obc2b.id_dms
        AND obc2a.id_agency = obc2b.id_agency
        AND COALESCE(obc2a.registration_date, '1900-01-01') = obc2b.MaxDate
) obc2 ON f.id_order IS NULL
    AND obc2.id_dms = f.id_order_total
    AND obc2.id_agency = f.id_agency
GROUP BY c.id, a.id_company, YEAR(f.registration_date)
HAVING SUM(COALESCE(obc1.amount, obc2.amount, 0)) > 0;
