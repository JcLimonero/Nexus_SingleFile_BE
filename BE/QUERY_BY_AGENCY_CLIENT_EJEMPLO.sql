-- Query SQL que se ejecuta para:
-- GET /api/files/by-agency-client?agencyId=10082&ndCliente=200945&statusId=1
--
-- Método: Files::getByAgency()
-- Parámetros:
--   - agencyId = 10082
--   - ndCliente = 200945
--   - statusId = 1

SELECT 
    f.Id as fileId,
    f.IdOrderTotal as numeroPedido,
    f.IdInventary as numeroInventario,
    p.Name as proceso,
    ot.Name as operacion,
    ct.Name as tipoCliente,
    obc.CarType as version,
    obc.Year as year,
    obc.Modelo as modelo,
    obc.VIN as vin,
    a.Name as agencia,
    f.RegistrationDate as fechaRegistro,
    fs.Name as estatus
FROM File f
LEFT JOIN Process p ON f.IdProcess = p.Id
LEFT JOIN OperationType ot ON f.IdOperation = ot.Id
LEFT JOIN CostumerType ct ON f.IdCostumerType = ct.Id
LEFT JOIN Agency a ON f.IdAgency = a.Id
LEFT JOIN File_Status fs ON f.IdCurrentState = fs.Id
LEFT JOIN OrderByCar obc ON f.IdOrderTotal = obc.IdTotalDealer
WHERE a.IdAgency = 10082
  AND fs.Id = 1
  AND f.IdClient IN (
      SELECT hc.Id 
      FROM HeaderClient hc 
      INNER JOIN Client_Total_Relation ctr ON hc.Id = ctr.idHeaderClient 
      WHERE ctr.IdTotalDealer = '200945'
  )
ORDER BY f.RegistrationDate DESC;

-- Explicación del query:
-- 1. Selecciona todos los campos necesarios de File y las tablas relacionadas
-- 2. LEFT JOIN con OrderByCar para obtener datos del vehículo (año, modelo, versión, VIN)
-- 3. Filtra por:
--    - Agencia (IdAgency = 10082)
--    - Estado/Status (Id = 1, que corresponde a "Integración")
--    - Cliente (ndCliente = 200945 a través de la relación HeaderClient -> Client_Total_Relation)
-- 4. Ordena por fecha de registro descendente (más recientes primero)
--
-- El JOIN clave es: LEFT JOIN OrderByCar obc ON f.IdOrderTotal = obc.IdTotalDealer
-- Este JOIN obtiene los datos del vehículo cuando existe un registro en OrderByCar
-- donde el campo IdTotalDealer coincide con el IdOrderTotal del File.
