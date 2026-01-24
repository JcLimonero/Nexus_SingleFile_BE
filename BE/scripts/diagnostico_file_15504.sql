-- Script de diagnóstico para File ID 15504 en agencia Renault (id 5)
-- Ejecuta este script completo en tu base de datos MySQL

-- ============================================================================
-- PASO 1: Información básica del File 15504
-- ============================================================================
SELECT 
    '=== INFORMACIÓN DEL FILE 15504 ===' as seccion,
    f.Id as idFile,
    f.IdOrderTotal as ndPedido,
    f.IdAgency,
    a.Name as nombreAgencia,
    f.IdProcess,
    p.Name as nombreProceso,
    p.Enabled as procesoHabilitado,
    f.IdCurrentState,
    fs.Name as estado,
    f.IdClient as idHeaderClient,
    CASE 
        WHEN f.IdAgency = 5 THEN '✅ File pertenece a Renault (id 5)'
        ELSE CONCAT('❌ File pertenece a otra agencia: ', f.IdAgency)
    END as verificacion_agencia,
    CASE 
        WHEN p.Enabled = 1 THEN '✅ Proceso está habilitado'
        ELSE '❌ Proceso NO está habilitado - ESTE ES UN PROBLEMA'
    END as verificacion_proceso,
    CASE 
        WHEN f.IdCurrentState != 5 THEN '✅ File NO está cancelado'
        ELSE '❌ File está cancelado - NO aparecerá en validación'
    END as verificacion_estado
FROM File f
LEFT JOIN Agency a ON f.IdAgency = a.Id
LEFT JOIN Process p ON f.IdProcess = p.Id
LEFT JOIN File_Status fs ON f.IdCurrentState = fs.Id
WHERE f.Id = 15504;

-- ============================================================================
-- PASO 2: Verificar HeaderClient y Client asociados
-- ============================================================================
SELECT 
    '=== HEADERCLIENT Y CLIENT ===' as seccion,
    f.Id as idFile,
    f.IdClient as idHeaderClient,
    hc.Id as headerClientExiste,
    hc.IdClient as idClient,
    c.Id as clientExiste,
    c.Name,
    c.LastName,
    c.RazonSocial,
    CASE 
        WHEN hc.Id IS NULL THEN '❌ NO EXISTE HeaderClient - PROBLEMA CRÍTICO'
        WHEN c.Id IS NULL THEN '❌ NO EXISTE Client - PROBLEMA CRÍTICO'
        ELSE '✅ HeaderClient y Client existen'
    END as verificacion
FROM File f
LEFT JOIN HeaderClient hc ON f.IdClient = hc.Id
LEFT JOIN Client c ON hc.IdClient = c.Id
WHERE f.Id = 15504;

-- ============================================================================
-- PASO 3: Verificar Client_Total_Relation para la agencia del File (Renault id 5)
-- ============================================================================
SELECT 
    '=== VERIFICAR Client_Total_Relation PARA AGENCIA DEL FILE ===' as seccion,
    f.Id as idFile,
    f.IdAgency as agenciaDelFile,
    a.Name as nombreAgenciaFile,
    hc.Id as idHeaderClient,
    ctr.Id as ctrId,
    ctr.IdAgency as ctrAgency,
    ctr.IdTotalDealer as ndCliente,
    a2.Name as nombreAgenciaCTR,
    CASE 
        WHEN ctr.Id IS NULL THEN '❌ NO EXISTE Client_Total_Relation para agencia 5 (Renault) - ESTE ES EL PROBLEMA'
        WHEN ctr.IdAgency = f.IdAgency THEN '✅ EXISTE Client_Total_Relation con la misma agencia del File'
        ELSE CONCAT('⚠️ EXISTE Client_Total_Relation pero con otra agencia: ', ctr.IdAgency)
    END as resultado
FROM File f
INNER JOIN Agency a ON f.IdAgency = a.Id
LEFT JOIN HeaderClient hc ON f.IdClient = hc.Id
LEFT JOIN Client_Total_Relation ctr ON hc.Id = ctr.idHeaderClient 
    AND ctr.IdAgency = f.IdAgency
LEFT JOIN Agency a2 ON ctr.IdAgency = a2.Id
WHERE f.Id = 15504;

-- ============================================================================
-- PASO 4: Verificar TODAS las relaciones Client_Total_Relation del HeaderClient
-- ============================================================================
SELECT 
    '=== TODAS LAS RELACIONES Client_Total_Relation DEL HEADERCLIENT ===' as seccion,
    f.Id as idFile,
    f.IdAgency as agenciaDelFile,
    hc.Id as idHeaderClient,
    ctr.Id as ctrId,
    ctr.IdAgency as ctrAgency,
    ctr.IdTotalDealer as ndCliente,
    a.Name as nombreAgencia,
    CASE 
        WHEN ctr.IdAgency = f.IdAgency THEN '✅ Esta es la relación requerida'
        ELSE '⚠️ Relación para otra agencia'
    END as verificacion
FROM File f
LEFT JOIN HeaderClient hc ON f.IdClient = hc.Id
LEFT JOIN Client_Total_Relation ctr ON hc.Id = ctr.idHeaderClient
LEFT JOIN Agency a ON ctr.IdAgency = a.Id
WHERE f.Id = 15504
ORDER BY ctr.IdAgency;

-- ============================================================================
-- PASO 5: Simular el query de validación para ver si el file aparecería
-- ============================================================================
SELECT 
    '=== SIMULACIÓN DEL QUERY DE VALIDACIÓN ===' as seccion,
    f.Id as idFile,
    f.IdAgency,
    f.IdProcess,
    p.Enabled as procesoHabilitado,
    f.IdCurrentState,
    CASE 
        WHEN f.IdAgency = 5 THEN '✅'
        ELSE '❌'
    END as cumple_agencia,
    CASE 
        WHEN p.Enabled = 1 THEN '✅'
        ELSE '❌'
    END as cumple_proceso_habilitado,
    CASE 
        WHEN f.IdCurrentState != 5 THEN '✅'
        ELSE '❌'
    END as cumple_no_cancelado,
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM Client_Total_Relation ctr_check 
            WHERE ctr_check.idHeaderClient = hc.Id 
            AND ctr_check.IdAgency = f.IdAgency
        ) THEN '✅'
        ELSE '❌ NO EXISTE Client_Total_Relation - ESTE ES EL PROBLEMA'
    END as cumple_relacion_cliente,
    CASE 
        WHEN f.IdAgency = 5 
            AND p.Enabled = 1 
            AND f.IdCurrentState != 5
            AND EXISTS (
                SELECT 1 
                FROM Client_Total_Relation ctr_check 
                WHERE ctr_check.idHeaderClient = hc.Id 
                AND ctr_check.IdAgency = f.IdAgency
            ) THEN '✅ APARECERÍA EN VALIDACIÓN'
        ELSE '❌ NO APARECERÍA EN VALIDACIÓN'
    END as resultado_final
FROM File f
INNER JOIN HeaderClient hc ON f.IdClient = hc.Id
INNER JOIN Process p ON f.IdProcess = p.Id
WHERE f.Id = 15504;

-- ============================================================================
-- PASO 6: SOLUCIÓN - Crear la relación faltante (si es necesario)
-- ============================================================================
-- Si el problema es que NO EXISTE Client_Total_Relation para agencia 5:
-- 
-- 1. Primero verifica si existe alguna relación para obtener el IdTotalDealer:
SELECT 
    '=== OBTENER IdTotalDealer PARA CREAR RELACIÓN ===' as seccion,
    hc.Id as idHeaderClient,
    ctr.IdTotalDealer,
    ctr.IdAgency,
    a.Name as nombreAgencia
FROM File f
INNER JOIN HeaderClient hc ON f.IdClient = hc.Id
LEFT JOIN Client_Total_Relation ctr ON hc.Id = ctr.idHeaderClient
LEFT JOIN Agency a ON ctr.IdAgency = a.Id
WHERE f.Id = 15504
LIMIT 1;

-- 2. Si existe un IdTotalDealer, ejecuta este INSERT (reemplaza 'ND_CLIENTE' con el valor real):
/*
INSERT INTO Client_Total_Relation (Id, idHeaderClient, IdAgency, IdTotalDealer)
SELECT 
    COALESCE(MAX(Id), 0) + 1 as nextId,
    hc.Id as idHeaderClient,
    5 as IdAgency,  -- Renault
    COALESCE(
        (SELECT ctr2.IdTotalDealer 
         FROM Client_Total_Relation ctr2 
         WHERE ctr2.idHeaderClient = hc.Id 
         LIMIT 1),
        'ND_CLIENTE'  -- Reemplaza con el ND real del cliente
    ) as IdTotalDealer
FROM File f
INNER JOIN HeaderClient hc ON f.IdClient = hc.Id
CROSS JOIN (SELECT COALESCE(MAX(Id), 0) as maxId FROM Client_Total_Relation) as max_ctr
WHERE f.Id = 15504
AND NOT EXISTS (
    SELECT 1 
    FROM Client_Total_Relation ctr_check 
    WHERE ctr_check.idHeaderClient = hc.Id 
    AND ctr_check.IdAgency = 5
);
*/
