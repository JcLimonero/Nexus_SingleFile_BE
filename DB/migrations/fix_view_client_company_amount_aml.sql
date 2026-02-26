-- Corregir vista AML: Amount NULL se trata como 0. Solo incluye clientes con totalMonto > 0.
-- Ejecutar: mysql -u usuario -p base_datos < fix_view_client_company_amount_aml.sql

CREATE OR REPLACE VIEW view_client_company_amount AS
SELECT
    c.Id AS idCliente,
    a.IdCompany AS idCompany,
    YEAR(f.RegistrationDate) AS anio,
    SUM(COALESCE(obc1.Amount, obc2.Amount, 0)) AS totalMonto
FROM File f
INNER JOIN Client c ON f.IdClient = c.Id
INNER JOIN Agency a ON f.IdAgency = a.Id
LEFT JOIN OrderByCar obc1 ON obc1.Id = f.IdOrder
LEFT JOIN (
    SELECT obc2a.IdTotalDealer, obc2a.idagency, obc2a.Amount
    FROM OrderByCar obc2a
    INNER JOIN (
        SELECT IdTotalDealer, idagency, MAX(COALESCE(RegistrationDate, '1900-01-01')) as MaxDate
        FROM OrderByCar
        GROUP BY IdTotalDealer, idagency
    ) obc2b ON obc2a.IdTotalDealer = obc2b.IdTotalDealer
        AND obc2a.idagency = obc2b.idagency
        AND COALESCE(obc2a.RegistrationDate, '1900-01-01') = obc2b.MaxDate
) obc2 ON f.IdOrder IS NULL
    AND obc2.IdTotalDealer = f.IdOrderTotal
    AND obc2.idagency = f.IdAgency
GROUP BY c.Id, a.IdCompany, YEAR(f.RegistrationDate)
HAVING SUM(COALESCE(obc1.Amount, obc2.Amount, 0)) > 0;

