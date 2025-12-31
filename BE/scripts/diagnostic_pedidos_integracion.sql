-- Script de diagnóstico para verificar datos de pedidos en integración
-- Reemplaza los valores según tu caso:
-- SET @agencyId = 10082;
-- SET @ndCliente = '200945';
-- SET @statusId = 1;

-- 1. Verificar files existentes para el cliente y agencia
SELECT 
    f.Id as fileId,
    f.IdOrderTotal as numeroPedido,
    f.IdInventary as numeroInventario,
    f.IdAgency as idAgency,
    f.IdCurrentState as idCurrentState,
    fs.Name as estatus,
    '=== File data ===' as seccion
FROM File f
LEFT JOIN File_Status fs ON f.IdCurrentState = fs.Id
LEFT JOIN Agency a ON f.IdAgency = a.Id
WHERE a.IdAgency = 10082  -- Cambia por tu agencyId
  AND fs.Id = 1            -- Cambia por tu statusId
  AND f.IdClient IN (
      SELECT hc.Id 
      FROM HeaderClient hc 
      INNER JOIN Client_Total_Relation ctr ON hc.Id = ctr.idHeaderClient 
      WHERE ctr.IdTotalDealer = '200945'  -- Cambia por tu ndCliente
  )
ORDER BY f.RegistrationDate DESC;

-- 2. Verificar registros en OrderByCar que coincidan con los files
SELECT 
    obc.Id,
    obc.Number as numeroPedido,
    obc.IdTotalDealer,
    obc.idagency,
    obc.Year as year,
    obc.Modelo as modelo,
    obc.CarType as version,
    obc.VIN as vin,
    '=== OrderByCar data ===' as seccion
FROM OrderByCar obc
WHERE obc.Number IN (
    SELECT f.IdOrderTotal
    FROM File f
    LEFT JOIN Agency a ON f.IdAgency = a.Id
    LEFT JOIN File_Status fs ON f.IdCurrentState = fs.Id
    WHERE a.IdAgency = 10082  -- Cambia por tu agencyId
      AND fs.Id = 1            -- Cambia por tu statusId
      AND f.IdClient IN (
          SELECT hc.Id 
          FROM HeaderClient hc 
          INNER JOIN Client_Total_Relation ctr ON hc.Id = ctr.idHeaderClient 
          WHERE ctr.IdTotalDealer = '200945'  -- Cambia por tu ndCliente
      )
)
ORDER BY obc.Number;

-- 3. Query completo con JOIN para ver si hay coincidencias
SELECT 
    f.Id as fileId,
    f.IdOrderTotal as numeroPedido,
    f.IdInventary as numeroInventario,
    obc.Number as orderByCarNumber,
    obc.Year as year,
    obc.Modelo as modelo,
    obc.CarType as version,
    obc.VIN as vin,
    CASE 
        WHEN obc.Id IS NULL THEN '❌ NO HAY COINCIDENCIA EN OrderByCar'
        ELSE '✅ HAY COINCIDENCIA'
    END as estado_coincidencia,
    '=== JOIN Result ===' as seccion
FROM File f
LEFT JOIN Agency a ON f.IdAgency = a.Id
LEFT JOIN File_Status fs ON f.IdCurrentState = fs.Id
LEFT JOIN OrderByCar obc ON f.IdOrderTotal = obc.Number
WHERE a.IdAgency = 10082  -- Cambia por tu agencyId
  AND fs.Id = 1            -- Cambia por tu statusId
  AND f.IdClient IN (
      SELECT hc.Id 
      FROM HeaderClient hc 
      INNER JOIN Client_Total_Relation ctr ON hc.Id = ctr.idHeaderClient 
      WHERE ctr.IdTotalDealer = '200945'  -- Cambia por tu ndCliente
  )
ORDER BY f.RegistrationDate DESC;

-- 4. Verificar todos los campos de OrderByCar para un número de pedido específico
-- (Reemplaza '21093' con un número de pedido que veas en los resultados anteriores)
SELECT 
    obc.*,
    '=== OrderByCar completo ===' as seccion
FROM OrderByCar obc
WHERE obc.Number = '21093'  -- Cambia por un número de pedido real
   OR obc.IdTotalDealer = '21093'
LIMIT 10;

-- 5. Verificar si hay diferencias de tipo de dato entre File.IdOrderTotal y OrderByCar.Number
SELECT 
    'File.IdOrderTotal samples' as tipo,
    f.IdOrderTotal,
    CAST(f.IdOrderTotal AS CHAR) as as_char,
    LENGTH(f.IdOrderTotal) as length,
    '=== Data Type Check ===' as seccion
FROM File f
LEFT JOIN Agency a ON f.IdAgency = a.Id
LEFT JOIN File_Status fs ON f.IdCurrentState = fs.Id
WHERE a.IdAgency = 10082
  AND fs.Id = 1
  AND f.IdClient IN (
      SELECT hc.Id 
      FROM HeaderClient hc 
      INNER JOIN Client_Total_Relation ctr ON hc.Id = ctr.idHeaderClient 
      WHERE ctr.IdTotalDealer = '200945'
  )
LIMIT 5;

SELECT 
    'OrderByCar.Number samples' as tipo,
    obc.Number,
    CAST(obc.Number AS CHAR) as as_char,
    LENGTH(obc.Number) as length,
    '=== Data Type Check ===' as seccion
FROM OrderByCar obc
WHERE obc.Number IN (
    SELECT f.IdOrderTotal
    FROM File f
    LEFT JOIN Agency a ON f.IdAgency = a.Id
    LEFT JOIN File_Status fs ON f.IdCurrentState = fs.Id
    WHERE a.IdAgency = 10082
      AND fs.Id = 1
      AND f.IdClient IN (
          SELECT hc.Id 
          FROM HeaderClient hc 
          INNER JOIN Client_Total_Relation ctr ON hc.Id = ctr.idHeaderClient 
          WHERE ctr.IdTotalDealer = '200945'
      )
)
LIMIT 5;
