-- Vista para alertas AML: total de operaciones por cliente, compañía y año.
-- Usada por el módulo Clientes para indicar cuándo un cliente supera el umbral.
-- Columnas esperadas: idCliente, idCompany, anio, totalMonto
--
-- IMPORTANTE: Usa la misma lógica de join que expedientes (id_order o id_order_total+id_agency)
-- para que el monto mostrado en detalle coincida con el usado para el umbral AML.
-- amount NULL se trata como 0. Solo incluye clientes con totalMonto > 0 (HAVING).
--
-- Actualizado para snake_case (tablas: expedient, client, agency, order)

CREATE OR REPLACE VIEW view_client_company_amount AS
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
