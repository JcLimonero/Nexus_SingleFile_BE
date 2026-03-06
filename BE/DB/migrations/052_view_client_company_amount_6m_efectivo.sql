-- ============================================================================
-- MIGRACIÓN 052: Actualizar vista view_client_company_amount_6m
-- ============================================================================
-- Solo suma montos de documentos de liquidación con método de pago
-- "Depósito en efectivo" (id_payment_method = 1) para el cálculo de alerta PLD.
-- Requiere: migraciones 042 (payment_method) y 051 (liquidation_receipt_detail).
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
WHERE f.registration_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
GROUP BY c.id, a.id_company
HAVING SUM(COALESCE(lrd.amount, 0)) > 0;
