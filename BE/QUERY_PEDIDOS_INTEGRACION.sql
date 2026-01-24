-- Query utilizado para obtener pedidos en integración
-- Endpoint: GET /api/files/by-agency-client
-- Método: Files::getByAgency()

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
WHERE a.IdAgency = ?                    -- Parámetro: agencyId
  AND fs.Id = ?                         -- Parámetro: statusId (1 para Integración)
  AND EXISTS (
      SELECT 1
      FROM HeaderClient hc 
      INNER JOIN Client_Total_Relation ctr ON hc.Id = ctr.idHeaderClient 
      WHERE hc.Id = f.IdClient 
        AND TRIM(ctr.IdTotalDealer) = ? -- Parámetro: ndCliente
        AND ctr.IdAgency = f.IdAgency   -- IMPORTANTE: Filtrar por agencia para evitar duplicados entre agencias
  )
ORDER BY f.RegistrationDate DESC;

-- NOTAS IMPORTANTES: 
-- 1. El JOIN con OrderByCar usa: f.IdOrderTotal = obc.IdTotalDealer
--    Esto es CORRECTO y permite obtener los datos de año, modelo, versión y VIN
--    Si los campos aparecen vacíos, verifica que existan registros en OrderByCar
--    con IdTotalDealer que coincida con IdOrderTotal de la tabla File
--
-- 2. CRÍTICO: La condición ctr.IdAgency = f.IdAgency en el subquery es esencial
--    porque IdTotalDealer (ndCliente) puede repetirse entre diferentes agencias.
--    Sin este filtro, podrías obtener pedidos de clientes de otras agencias que
--    compartan el mismo IdTotalDealer (cada dealer tiene su propio DMS con sus propios números).
