-- ============================================================================
-- MIGRACIÓN 063: Vista view_client_company_amount_6m_total
-- ============================================================================
-- Suma montos de TODOS los métodos de pago (efectivo, transferencia, etc.)
-- en los últimos 6 meses. Usada para:
--   - Requiere atención: expediente > 3210 UMA (sin importar tipo de pago)
--   - Reportar a fin de mes: expediente > 6420 UMA
-- Requiere: migración 051 (liquidation_receipt_detail), 056 (payment_date).
-- ============================================================================

CREATE OR REPLACE VIEW view_client_company_amount_6m_total AS
SELECT
    c.id AS idCliente,
    a.id_company AS idCompany,
    SUM(COALESCE(lrd.amount, 0)) AS totalMonto
FROM expedient f
INNER JOIN client c ON f.id_client = c.id
INNER JOIN agency a ON f.id_agency = a.id
INNER JOIN liquidation_receipt_detail lrd ON lrd.id_file = f.id
INNER JOIN file_document fd ON fd.id = lrd.id_file_document AND fd.enabled = 1
WHERE COALESCE(lrd.payment_date, DATE(lrd.registration_date), DATE(f.registration_date)) >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
GROUP BY c.id, a.id_company
HAVING SUM(COALESCE(lrd.amount, 0)) > 0;
