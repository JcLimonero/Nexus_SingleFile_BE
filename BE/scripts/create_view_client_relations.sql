-- Vista para relaciones cliente-agencia con datos completos del cliente.
-- Usada por client-search/search y repair-client-relation.
CREATE OR REPLACE VIEW view_client_relations AS
SELECT
    hc.IdClient AS idCliente,
    COALESCE(ctr.IdTotalDealer, '') AS ndCliente,
    TRIM(CONCAT(COALESCE(c.Name, ''), ' ', COALESCE(c.LastName, ''), ' ', COALESCE(c.MotherLastName, ''))) AS cliente,
    hc.Id AS IdHeaderClient,
    c.Name AS nombre,
    c.LastName AS apellidoPaterno,
    c.MotherLastName AS apellidoMaterno,
    c.RFC AS rfc,
    c.Email AS email,
    c.TelNumber AS telefono,
    c.TelNumber2 AS telefono2,
    c.RazonSocial AS razonSocial,
    c.CURP AS curp,
    c.Adviser AS asesor,
    c.AgencyOrigin AS agenciaOrigen,
    c.RegistrationDate AS fechaRegistro,
    c.UpdateDate AS fechaActualizacion,
    ctr.IdAgency AS idAgency
FROM HeaderClient hc
INNER JOIN Client_Total_Relation ctr ON hc.Id = ctr.idHeaderClient
INNER JOIN Client c ON c.Id = hc.IdClient;
