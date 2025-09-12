-- Crear vista view_client para búsquedas eficientes de clientes
CREATE OR REPLACE VIEW view_client AS
SELECT 
    c.Id as idCliente,
    ctr.IdTotalDealer as ndCliente,
    TRIM(CONCAT(COALESCE(c.Name, ''), ' ', COALESCE(c.LastName, ''), ' ', COALESCE(c.MotherLastName, ''))) as cliente,
    c.Name as nombre,
    c.LastName as apellidoPaterno,
    c.MotherLastName as apellidoMaterno,
    c.RFC as rfc,
    c.Email as email,
    c.TelNumber as telefono,
    c.TelNumber2 as telefono2,
    c.RazonSocial as razonSocial,
    c.CURP as curp,
    c.Adviser as asesor,
    c.AgencyOrigin as agenciaOrigen,
    c.RegistrationDate as fechaRegistro,
    c.UpdateDate as fechaActualizacion,
    f.IdAgency as idAgency
FROM Client c
INNER JOIN HeaderClient hc ON c.Id = hc.IdClient
INNER JOIN Client_Total_Relation ctr ON hc.Id = ctr.idHeaderClient
INNER JOIN File f ON hc.Id = f.IdClient
WHERE ((c.Name IS NOT NULL AND c.Name != '') 
    OR (c.LastName IS NOT NULL AND c.LastName != '') 
    OR (c.MotherLastName IS NOT NULL AND c.MotherLastName != ''));
