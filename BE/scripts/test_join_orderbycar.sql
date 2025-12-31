-- Query de prueba para verificar el JOIN entre File y OrderByCar
-- Usa este query directamente en tu base de datos para diagnosticar

-- Reemplaza estos valores según tu caso de prueba:
-- agencyId: 10082
-- ndCliente: 200945
-- statusId: 1

SELECT 
    f.Id as fileId,
    f.IdOrderTotal as file_numeroPedido,
    f.IdInventary as numeroInventario,
    -- Verificar OrderByCar
    obc.Id as orderByCarId,
    obc.Number as orderByCar_Number,
    obc.IdTotalDealer as orderByCar_IdTotalDealer,
    -- Datos del vehículo
    obc.Year as year,
    obc.Modelo as modelo,
    obc.CarType as version,
    obc.VIN as vin,
    -- Verificar coincidencia
    CASE 
        WHEN f.IdOrderTotal = obc.Number THEN '✅ COINCIDENCIA EXACTA'
        WHEN f.IdOrderTotal = obc.IdTotalDealer THEN '⚠️ Coincide con IdTotalDealer pero no con Number'
        WHEN obc.Id IS NULL THEN '❌ NO HAY REGISTRO EN OrderByCar'
        ELSE '❌ NO COINCIDE'
    END as estado_join
FROM File f
LEFT JOIN Process p ON f.IdProcess = p.Id
LEFT JOIN OperationType ot ON f.IdOperation = ot.Id
LEFT JOIN CostumerType ct ON f.IdCostumerType = ct.Id
LEFT JOIN Agency a ON f.IdAgency = a.Id
LEFT JOIN File_Status fs ON f.IdCurrentState = fs.Id
LEFT JOIN OrderByCar obc ON f.IdOrderTotal = obc.Number  -- Probando con Number
WHERE a.IdAgency = 10082                    -- Cambia este valor
  AND fs.Id = 1                             -- Cambia este valor
  AND f.IdClient IN (
      SELECT hc.Id 
      FROM HeaderClient hc 
      INNER JOIN Client_Total_Relation ctr ON hc.Id = ctr.idHeaderClient 
      WHERE ctr.IdTotalDealer = '200945'    -- Cambia este valor
  )
ORDER BY f.RegistrationDate DESC;

-- También probar con IdTotalDealer por si acaso:
SELECT 
    f.Id as fileId,
    f.IdOrderTotal as file_numeroPedido,
    obc.Number as orderByCar_Number,
    obc.IdTotalDealer as orderByCar_IdTotalDealer,
    obc.Year as year,
    obc.Modelo as modelo,
    obc.CarType as version,
    obc.VIN as vin,
    CASE 
        WHEN f.IdOrderTotal = obc.IdTotalDealer THEN '✅ COINCIDENCIA CON IdTotalDealer'
        ELSE '❌ NO COINCIDE'
    END as estado_join
FROM File f
LEFT JOIN Agency a ON f.IdAgency = a.Id
LEFT JOIN File_Status fs ON f.IdCurrentState = fs.Id
LEFT JOIN OrderByCar obc ON f.IdOrderTotal = obc.IdTotalDealer  -- Probando con IdTotalDealer
WHERE a.IdAgency = 10082
  AND fs.Id = 1
  AND f.IdClient IN (
      SELECT hc.Id 
      FROM HeaderClient hc 
      INNER JOIN Client_Total_Relation ctr ON hc.Id = ctr.idHeaderClient 
      WHERE ctr.IdTotalDealer = '200945'
  )
ORDER BY f.RegistrationDate DESC;
