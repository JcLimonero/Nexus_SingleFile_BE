-- Script de diagnóstico para verificar por qué el registro con IdOrderTotal = 35348
-- no aparece en el listado de validación
-- 
-- INSTRUCCIONES:
-- 1. Reemplaza los valores de @idAgency y @idProcess según la agencia González Gallo
-- 2. Ejecuta este script completo en tu base de datos
-- 3. Revisa cada sección para identificar el problema

-- ============================================================================
-- CONFIGURACIÓN: Cambia estos valores según tu caso
-- ============================================================================
SET @idOrderTotal = 35348;
SET @idAgency = NULL;  -- Cambia por el ID de la agencia González Gallo
SET @idProcess = NULL;  -- Cambia por el ID del proceso que estás usando

-- Si no conoces los IDs, primero ejecuta estas consultas para encontrarlos:
-- SELECT Id, Name FROM Agency WHERE Name LIKE '%González Gallo%' OR Name LIKE '%Gonzalez Gallo%';
-- SELECT Id, Name FROM Process WHERE Enabled = 1;

-- ============================================================================
-- PASO 1: Verificar si el File existe
-- ============================================================================
SELECT 
    '=== PASO 1: Verificar File ===' as seccion,
    f.Id as fileId,
    f.IdOrderTotal as numeroPedido,
    f.IdAgency as idAgency,
    f.IdProcess as idProcess,
    f.IdClient as idClient,
    f.IdCurrentState as idCurrentState,
    f.RegistrationDate as fechaRegistro,
    CASE 
        WHEN f.Id IS NULL THEN '❌ NO EXISTE el File con IdOrderTotal = 35348'
        ELSE '✅ EXISTE el File'
    END as resultado
FROM File f
WHERE f.IdOrderTotal = @idOrderTotal
LIMIT 1;

-- ============================================================================
-- PASO 2: Verificar información completa del File
-- ============================================================================
SELECT 
    '=== PASO 2: Información completa del File ===' as seccion,
    f.Id,
    f.IdOrderTotal,
    f.IdAgency,
    a.Name as nombreAgencia,
    f.IdProcess,
    p.Name as nombreProceso,
    p.Enabled as procesoHabilitado,
    f.IdClient,
    f.IdCurrentState,
    fs.Name as nombreEstado,
    f.RegistrationDate,
    f.AgendDate as fechaLiberacion
FROM File f
LEFT JOIN Agency a ON f.IdAgency = a.Id
LEFT JOIN Process p ON f.IdProcess = p.Id
LEFT JOIN File_Status fs ON f.IdCurrentState = fs.Id
WHERE f.IdOrderTotal = @idOrderTotal
LIMIT 1;

-- ============================================================================
-- PASO 3: Verificar si la agencia coincide
-- ============================================================================
SELECT 
    '=== PASO 3: Verificar Agencia ===' as seccion,
    f.IdAgency as agenciaDelFile,
    @idAgency as agenciaEsperada,
    CASE 
        WHEN @idAgency IS NULL THEN '⚠️ No se especificó @idAgency - Ejecuta primero: SET @idAgency = X;'
        WHEN f.IdAgency = @idAgency THEN '✅ COINCIDE'
        ELSE '❌ NO COINCIDE - El File pertenece a otra agencia'
    END as resultado
FROM File f
WHERE f.IdOrderTotal = @idOrderTotal
LIMIT 1;

-- ============================================================================
-- PASO 4: Verificar si el proceso coincide y está habilitado
-- ============================================================================
SELECT 
    '=== PASO 4: Verificar Proceso ===' as seccion,
    f.IdProcess as procesoDelFile,
    p.Name as nombreProceso,
    p.Enabled as procesoHabilitado,
    @idProcess as procesoEsperado,
    CASE 
        WHEN @idProcess IS NULL THEN '⚠️ No se especificó @idProcess - Ejecuta primero: SET @idProcess = X;'
        WHEN f.IdProcess != @idProcess THEN '❌ NO COINCIDE - El File pertenece a otro proceso'
        WHEN p.Enabled != 1 THEN '❌ COINCIDE pero NO está HABILITADO (p.Enabled = 0)'
        ELSE '✅ COINCIDE y está HABILITADO'
    END as resultado
FROM File f
LEFT JOIN Process p ON f.IdProcess = p.Id
WHERE f.IdOrderTotal = @idOrderTotal
LIMIT 1;

-- ============================================================================
-- PASO 5: Verificar el estado (si está cancelado)
-- ============================================================================
SELECT 
    '=== PASO 5: Verificar Estado ===' as seccion,
    f.IdCurrentState,
    fs.Name as nombreEstado,
    CASE 
        WHEN f.IdCurrentState = 5 THEN '❌ ESTÁ CANCELADO - No aparecerá en el listado (a menos que showCancelled=true)'
        WHEN f.IdCurrentState = 6 THEN '⚠️ Es EXCEPCIÓN - Aparecerá en el listado'
        ELSE '✅ Estado normal - Aparecerá en el listado'
    END as resultado
FROM File f
LEFT JOIN File_Status fs ON f.IdCurrentState = fs.Id
WHERE f.IdOrderTotal = @idOrderTotal
LIMIT 1;

-- ============================================================================
-- PASO 6: Verificar HeaderClient
-- ============================================================================
SELECT 
    '=== PASO 6: Verificar HeaderClient ===' as seccion,
    f.IdClient as idHeaderClient,
    hc.Id as headerClientExiste,
    CASE 
        WHEN hc.Id IS NULL THEN '❌ NO EXISTE HeaderClient - Esto causaría un INNER JOIN fallido'
        ELSE '✅ EXISTE HeaderClient'
    END as resultado
FROM File f
LEFT JOIN HeaderClient hc ON f.IdClient = hc.Id
WHERE f.IdOrderTotal = @idOrderTotal
LIMIT 1;

-- ============================================================================
-- PASO 7: Verificar Client_Total_Relation para la agencia del File
-- ============================================================================
SELECT 
    '=== PASO 7: Verificar Client_Total_Relation ===' as seccion,
    f.IdAgency as agenciaDelFile,
    ctr.IdTotalDealer,
    ctr.IdAgency as ctrAgency,
    CASE 
        WHEN ctr.Id IS NULL THEN '❌ NO EXISTE Client_Total_Relation para esta agencia - ESTE ES EL PROBLEMA PRINCIPAL'
        ELSE '✅ EXISTE Client_Total_Relation'
    END as resultado
FROM File f
LEFT JOIN HeaderClient hc ON f.IdClient = hc.Id
LEFT JOIN Client_Total_Relation ctr ON hc.Id = ctr.idHeaderClient 
    AND ctr.IdAgency = f.IdAgency
WHERE f.IdOrderTotal = @idOrderTotal
LIMIT 1;

-- ============================================================================
-- PASO 8: Verificar el subquery cliente_correcto
-- ============================================================================
SELECT 
    '=== PASO 8: Verificar subquery cliente_correcto ===' as seccion,
    cliente_correcto.ClientId,
    cliente_correcto.Name,
    cliente_correcto.LastName,
    cliente_correcto.IdTotalDealer,
    CASE 
        WHEN cliente_correcto.ClientId IS NULL THEN '❌ El subquery cliente_correcto NO encuentra el registro - ESTE ES EL PROBLEMA'
        ELSE '✅ El subquery cliente_correcto encuentra el registro'
    END as resultado
FROM File f
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
    WHERE ctr_main.IdAgency = f.IdAgency
    GROUP BY ctr_main.IdTotalDealer, ctr_main.IdAgency, c_main.Id, c_main.Name, c_main.LastName, c_main.MotherLastName, c_main.RazonSocial
) cliente_correcto ON COALESCE(ctr.IdTotalDealer, '') = cliente_correcto.IdTotalDealer 
    AND cliente_correcto.IdAgency = f.IdAgency
WHERE f.IdOrderTotal = @idOrderTotal
LIMIT 1;

-- ============================================================================
-- PASO 9: Simular el query completo (sin LIMIT/OFFSET) para ver si aparece
-- ============================================================================
-- NOTA: Esta consulta requiere que @idAgency y @idProcess estén definidos
SELECT 
    '=== PASO 9: Query completo (simulación) ===' as seccion,
    f.Id as idFile,
    COALESCE(ctr.IdTotalDealer, '') as ndCliente,
    f.IdOrderTotal as ndPedido,
    COALESCE(
        NULLIF(TRIM(cliente_correcto.RazonSocial), ''),
        TRIM(CONCAT(COALESCE(cliente_correcto.Name, ''), ' ', COALESCE(cliente_correcto.LastName, ''), ' ', COALESCE(cliente_correcto.MotherLastName, '')))
    ) as cliente,
    p.Name as proceso,
    CASE 
        WHEN f.IdOrderTotal = @idOrderTotal THEN '✅ ESTE ES EL REGISTRO BUSCADO'
        ELSE 'Otro registro'
    END as identificacion
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
    WHERE ctr_main.IdAgency = @idAgency
    GROUP BY ctr_main.IdTotalDealer, ctr_main.IdAgency, c_main.Id, c_main.Name, c_main.LastName, c_main.MotherLastName, c_main.RazonSocial
) cliente_correcto ON COALESCE(ctr.IdTotalDealer, '') = cliente_correcto.IdTotalDealer 
    AND cliente_correcto.IdAgency = f.IdAgency
WHERE f.IdAgency = @idAgency
AND f.IdProcess = @idProcess
AND f.IdOrderTotal = @idOrderTotal
AND p.Enabled = 1
AND f.IdCurrentState != 5
AND cliente_correcto.ClientId IS NOT NULL;

-- ============================================================================
-- PASO 10: Verificar si hay otros Files con el mismo IdOrderTotal
-- ============================================================================
SELECT 
    '=== PASO 10: Otros Files con el mismo IdOrderTotal ===' as seccion,
    f.Id,
    f.IdAgency,
    a.Name as nombreAgencia,
    f.IdProcess,
    p.Name as nombreProceso,
    f.IdCurrentState,
    fs.Name as estado
FROM File f
LEFT JOIN Agency a ON f.IdAgency = a.Id
LEFT JOIN Process p ON f.IdProcess = p.Id
LEFT JOIN File_Status fs ON f.IdCurrentState = fs.Id
WHERE f.IdOrderTotal = @idOrderTotal
ORDER BY f.IdAgency, f.IdProcess;

-- ============================================================================
-- RESUMEN Y SOLUCIÓN
-- ============================================================================
-- Si el problema es que NO EXISTE Client_Total_Relation para la agencia:
-- 
-- SOLUCIÓN 1: Crear la relación faltante
-- INSERT INTO Client_Total_Relation (idHeaderClient, IdAgency, IdTotalDealer, ...)
-- SELECT hc.Id, f.IdAgency, 'VALOR_ND_CLIENTE', ...
-- FROM File f
-- INNER JOIN HeaderClient hc ON f.IdClient = hc.Id
-- WHERE f.IdOrderTotal = 35348;
--
-- SOLUCIÓN 2: Modificar el query para que no requiera cliente_correcto.ClientId IS NOT NULL
-- (pero esto podría mostrar registros sin cliente válido)
