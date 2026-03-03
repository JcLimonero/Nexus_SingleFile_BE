-- ============================================================================
-- MIGRACIÓN 057: Actualizar vista view_client_company_amount_6m para usar payment_date
-- ============================================================================
-- PLD debe filtrar por fecha real del pago (payment_date).
-- Si payment_date es NULL (registros antiguos), fallback a lrd.registration_date.
-- Requiere: migración 056 (payment_date en liquidation_receipt_detail).
-- ============================================================================

CREATE OR REPLACE VIEW view_client_company_amount_6m AS
SELECT
    c.id AS idCliente,
    a.id_company AS idCompany,
    SUM(COALESCE(lrd.amount, 0)) AS totalMonto
FROM expedient f
INNER JOIN client c ON f.id_client = c.id
INNER JOIN agency a ON f.id_agency = a.id
INNER JOIN liquidation_receipt_detail lrd ON lrd.id_file = f.id
    AND lrd.id_payment_method = 1
INNER JOIN file_document fd ON fd.id = lrd.id_file_document AND fd.enabled = 1
WHERE COALESCE(lrd.payment_date, DATE(lrd.registration_date), DATE(f.registration_date)) >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
GROUP BY c.id, a.id_company
HAVING SUM(COALESCE(lrd.amount, 0)) > 0;
