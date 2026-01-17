-- Script de diagnóstico SIMPLIFICADO para IdOrderTotal = 35348
-- Ejecuta este script completo en tu base de datos MySQL

-- ============================================================================
-- PASO 1: Buscar el File y obtener información básica
-- ============================================================================
SELECT 
    '=== INFORMACIÓN DEL FILE ===' as seccion,
    f.Id,
    f.IdOrderTotal,
    f.IdAgency,
    a.Name as nombreAgencia,
    f.IdProcess,
    p.Name as nombreProceso,
    p.Enabled as procesoHabilitado,
    f.IdCurrentState,
    fs.Name as estado,
    f.IdClient as idHeaderClient
FROM File f
LEFT JOIN Agency a ON f.IdAgency = a.Id
LEFT JOIN Process p ON f.IdProcess = p.Id
LEFT JOIN File_Status fs ON f.IdCurrentState = fs.Id
WHERE f.IdOrderTotal = 35348;

-- ============================================================================
-- PASO 2: Verificar si existe Client_Total_Relation para la agencia del File
-- ============================================================================
SELECT 
    '=== VERIFICAR Client_Total_Relation ===' as seccion,
    f.IdAgency,
    a.Name as nombreAgencia,
    hc.Id as idHeaderClient,
    ctr.Id as ctrId,
    ctr.IdTotalDealer,
    CASE 
        WHEN ctr.Id IS NULL THEN '❌ NO EXISTE Client_Total_Relation - ESTE ES EL PROBLEMA'
        ELSE '✅ EXISTE Client_Total_Relation'
    END as resultado
FROM File f
INNER JOIN Agency a ON f.IdAgency = a.Id
LEFT JOIN HeaderClient hc ON f.IdClient = hc.Id
LEFT JOIN Client_Total_Relation ctr ON hc.Id = ctr.idHeaderClient 
    AND ctr.IdAgency = f.IdAgency
WHERE f.IdOrderTotal = 35348;

-- ============================================================================
-- PASO 3: Verificar el subquery cliente_correcto (el que causa el filtro)
-- ============================================================================
SELECT 
    '=== VERIFICAR subquery cliente_correcto ===' as seccion,
    f.IdAgency,
    a.Name as nombreAgencia,
    cliente_correcto.ClientId,
    cliente_correcto.IdTotalDealer,
    cliente_correcto.Name as nombreCliente,
    CASE 
        WHEN cliente_correcto.ClientId IS NULL THEN '❌ NO encuentra registro - Por eso NO aparece en el listado'
        ELSE '✅ Encuentra registro'
    END as resultado
FROM File f
INNER JOIN Agency a ON f.IdAgency = a.Id
LEFT JOIN HeaderClient hc ON f.IdClient = hc.Id
LEFT JOIN Client_Total_Relation ctr ON hc.Id = ctr.idHeaderClient 
    AND ctr.IdAgency = f.IdAgency
LEFT JOIN (
    SELECT 
        ctr_main.IdTotalDealer,
        ctr_main.IdAgency,
        c_main.Id as ClientId,
        c_main.Name,
        c_main.LastName,
        c_main.MotherLastName,
        c_main.RazonSocial
    FROM Client_Total_Relation ctr_main
    INNER JOIN HeaderClient hc_main ON ctr_main.idHeaderClient = hc_main.Id
    INNER JOIN Client c_main ON hc_main.IdClient = c_main.Id
    WHERE ctr_main.IdAgency = (SELECT IdAgency FROM File WHERE IdOrderTotal = 35348 LIMIT 1)
    GROUP BY ctr_main.IdTotalDealer, ctr_main.IdAgency, c_main.Id, c_main.Name, c_main.LastName, c_main.MotherLastName, c_main.RazonSocial
) cliente_correcto ON COALESCE(ctr.IdTotalDealer, '') = cliente_correcto.IdTotalDealer 
    AND cliente_correcto.IdAgency = f.IdAgency
WHERE f.IdOrderTotal = 35348;

-- ============================================================================
-- PASO 4: Simular el query completo del API para ver si aparece
-- ============================================================================
SELECT 
    '=== SIMULACIÓN DEL QUERY COMPLETO ===' as seccion,
    f.Id as idFile,
    COALESCE(ctr.IdTotalDealer, '') as ndCliente,
    f.IdOrderTotal as ndPedido,
    COALESCE(
        NULLIF(TRIM(cliente_correcto.RazonSocial), ''),
        TRIM(CONCAT(COALESCE(cliente_correcto.Name, ''), ' ', COALESCE(cliente_correcto.LastName, ''), ' ', COALESCE(cliente_correcto.MotherLastName, '')))
    ) as cliente,
    p.Name as proceso,
    fs.Name as fase,
    CASE 
        WHEN cliente_correcto.ClientId IS NULL THEN '❌ NO APARECERÁ (cliente_correcto.ClientId IS NULL)'
        WHEN f.IdCurrentState = 5 THEN '❌ NO APARECERÁ (está cancelado)'
        WHEN p.Enabled != 1 THEN '❌ NO APARECERÁ (proceso no habilitado)'
        ELSE '✅ APARECERÍA en el listado'
    END as resultado
FROM File f
INNER JOIN HeaderClient hc ON f.IdClient = hc.Id
INNER JOIN Process p ON f.IdProcess = p.Id
INNER JOIN OperationType ot ON f.IdOperation = ot.Id
INNER JOIN File_Status fs ON f.IdCurrentState = fs.Id
LEFT JOIN Client_Total_Relation ctr ON hc.Id = ctr.idHeaderClient 
    AND ctr.IdAgency = f.IdAgency
LEFT JOIN (
    SELECT 
        ctr_main.IdTotalDealer,
        ctr_main.IdAgency,
        c_main.Id as ClientId,
        c_main.Name,
        c_main.LastName,
        c_main.MotherLastName,
        c_main.RazonSocial
    FROM Client_Total_Relation ctr_main
    INNER JOIN HeaderClient hc_main ON ctr_main.idHeaderClient = hc_main.Id
    INNER JOIN Client c_main ON hc_main.IdClient = c_main.Id
    WHERE ctr_main.IdAgency = (SELECT IdAgency FROM File WHERE IdOrderTotal = 35348 LIMIT 1)
    GROUP BY ctr_main.IdTotalDealer, ctr_main.IdAgency, c_main.Id, c_main.Name, c_main.LastName, c_main.MotherLastName, c_main.RazonSocial
) cliente_correcto ON COALESCE(ctr.IdTotalDealer, '') = cliente_correcto.IdTotalDealer 
    AND cliente_correcto.IdAgency = f.IdAgency
WHERE f.IdOrderTotal = 35348
AND p.Enabled = 1
AND f.IdCurrentState != 5
AND cliente_correcto.ClientId IS NOT NULL;

-- ============================================================================
-- PASO 5: Verificar si hay relación Client_Total_Relation para OTRA agencia
-- (por si el File está asociado a una agencia diferente)
-- ============================================================================
SELECT 
    '=== Client_Total_Relation para OTRAS agencias ===' as seccion,
    ctr.IdAgency,
    a.Name as nombreAgencia,
    ctr.IdTotalDealer,
    c.Name as nombreCliente,
    ctr.idHeaderClient
FROM File f
INNER JOIN HeaderClient hc ON f.IdClient = hc.Id
INNER JOIN Client_Total_Relation ctr ON hc.Id = ctr.idHeaderClient
INNER JOIN Agency a ON ctr.IdAgency = a.Id
INNER JOIN Client c ON hc.IdClient = c.Id
WHERE f.IdOrderTotal = 35348;

-- ============================================================================
-- SOLUCIÓN SUGERIDA (si el problema es falta de Client_Total_Relation)
-- ============================================================================
-- Si el PASO 2 muestra que NO EXISTE Client_Total_Relation para la agencia del File,
-- puedes crear la relación con este query (ajusta los valores según necesites):
--
-- INSERT INTO Client_Total_Relation (idHeaderClient, IdAgency, IdTotalDealer, ...)
-- SELECT 
--     f.IdClient as idHeaderClient,
--     f.IdAgency,
--     'ND_CLIENTE_AQUI' as IdTotalDealer,
--     -- ... otros campos requeridos
-- FROM File f
-- WHERE f.IdOrderTotal = 35348
-- AND NOT EXISTS (
--     SELECT 1 FROM Client_Total_Relation ctr 
--     WHERE ctr.idHeaderClient = f.IdClient 
--     AND ctr.IdAgency = f.IdAgency
-- );
