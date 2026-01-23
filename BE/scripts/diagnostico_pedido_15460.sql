-- Script de diagnóstico para el pedido con idFile = 15460
-- Verificar por qué no aparece en la pantalla de validación con reanult (id:5) y autos nuevos

-- 1. Verificar información básica del pedido
SELECT 
    f.Id as idFile,
    f.IdAgency,
    f.IdProcess,
    f.IdClient,
    f.IdCurrentState,
    f.IdOrderTotal as ndPedido,
    a.Name as agencia,
    p.Name as proceso,
    p.Enabled as proceso_habilitado,
    fs.Name as estado_actual
FROM File f
INNER JOIN Agency a ON f.IdAgency = a.Id
INNER JOIN Process p ON f.IdProcess = p.Id
INNER JOIN File_Status fs ON f.IdCurrentState = fs.Id
WHERE f.Id = 15460;

-- 2. Verificar si el cliente tiene relación con la agencia del pedido
SELECT 
    f.Id as idFile,
    f.IdAgency as agencia_pedido,
    f.IdClient,
    hc.Id as idHeaderClient,
    ctr.IdAgency as agencia_relacion,
    ctr.IdTotalDealer as ndCliente
FROM File f
INNER JOIN HeaderClient hc ON f.IdClient = hc.Id
LEFT JOIN Client_Total_Relation ctr ON ctr.idHeaderClient = hc.Id AND ctr.IdAgency = f.IdAgency
WHERE f.Id = 15460;

-- 3. Verificar todas las relaciones del cliente con agencias
SELECT 
    f.Id as idFile,
    f.IdAgency as agencia_pedido,
    hc.Id as idHeaderClient,
    ctr.IdAgency as agencia_relacion,
    a.Name as nombre_agencia_relacion,
    ctr.IdTotalDealer as ndCliente
FROM File f
INNER JOIN HeaderClient hc ON f.IdClient = hc.Id
LEFT JOIN Client_Total_Relation ctr ON ctr.idHeaderClient = hc.Id
LEFT JOIN Agency a ON ctr.IdAgency = a.Id
WHERE f.Id = 15460;

-- 4. Verificar si el pedido cumple todas las condiciones del query de validación
-- (simulando el query del controlador)
SELECT 
    f.Id as idFile,
    f.IdAgency,
    f.IdProcess,
    f.IdCurrentState,
    p.Enabled as proceso_habilitado,
    CASE 
        WHEN f.IdAgency = 5 THEN '✅ Cumple: IdAgency = 5'
        ELSE '❌ NO cumple: IdAgency != 5 (es ' || f.IdAgency || ')'
    END as condicion_agencia,
    CASE 
        WHEN p.Enabled = 1 THEN '✅ Cumple: Proceso habilitado'
        ELSE '❌ NO cumple: Proceso deshabilitado'
    END as condicion_proceso,
    CASE 
        WHEN f.IdCurrentState != 5 THEN '✅ Cumple: No está cancelado'
        ELSE '❌ NO cumple: Está cancelado (IdCurrentState = 5)'
    END as condicion_estado,
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM Client_Total_Relation ctr_check 
            WHERE ctr_check.idHeaderClient = hc.Id 
            AND ctr_check.IdAgency = f.IdAgency
        ) THEN '✅ Cumple: Tiene relación cliente-agencia'
        ELSE '❌ NO cumple: NO tiene relación cliente-agencia'
    END as condicion_relacion
FROM File f
INNER JOIN HeaderClient hc ON f.IdClient = hc.Id
INNER JOIN Process p ON f.IdProcess = p.Id
WHERE f.Id = 15460;

-- 5. Verificar qué proceso es "autos nuevos" y su ID
SELECT 
    Id,
    Name,
    Enabled
FROM Process
WHERE Name LIKE '%autos nuevos%' OR Name LIKE '%Autos Nuevos%' OR Name LIKE '%AUTOS NUEVOS%'
ORDER BY Id;

-- 6. Verificar si el pedido 15460 tiene el proceso correcto
SELECT 
    f.Id as idFile,
    f.IdProcess,
    p.Name as nombre_proceso,
    CASE 
        WHEN p.Name LIKE '%autos nuevos%' OR p.Name LIKE '%Autos Nuevos%' OR p.Name LIKE '%AUTOS NUEVOS%' 
        THEN '✅ Es proceso de autos nuevos'
        ELSE '❌ NO es proceso de autos nuevos (es: ' || p.Name || ')'
    END as es_autos_nuevos
FROM File f
INNER JOIN Process p ON f.IdProcess = p.Id
WHERE f.Id = 15460;
