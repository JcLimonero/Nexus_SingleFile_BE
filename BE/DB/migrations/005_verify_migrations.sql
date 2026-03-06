-- ============================================================================
-- SCRIPT DE VERIFICACIÓN POST-MIGRACIÓN
-- ============================================================================
-- Descripción: Verifica que todas las migraciones se aplicaron correctamente
-- Fecha: 2026-02-27
-- ============================================================================

SELECT '=== VERIFICACIÓN POST-MIGRACIÓN ===' AS section;

-- 1. Verificar nombres corregidos
SELECT '1. Verificando nombres corregidos...' AS check_step;

SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'CustomerType')
        THEN '✅ Tabla CustomerType existe'
        ELSE '❌ Tabla CustomerType NO existe'
    END AS customer_type_table;

SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'ConfigurationProcess' AND column_name = 'IdCustomerType')
        THEN '✅ Columna IdCustomerType existe en ConfigurationProcess'
        ELSE '❌ Columna IdCustomerType NO existe en ConfigurationProcess'
    END AS config_customer_type_column;

SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'File' AND column_name = 'IdCustomerType')
        THEN '✅ Columna IdCustomerType existe en File'
        ELSE '❌ Columna IdCustomerType NO existe en File'
    END AS file_customer_type_column;

-- 2. Verificar constraints NOT NULL
SELECT '2. Verificando constraints NOT NULL...' AS check_step;

SELECT 
    table_name,
    column_name,
    is_nullable,
    CASE 
        WHEN is_nullable = 'NO' THEN '✅ NOT NULL aplicado'
        ELSE '⚠️ Permite NULL'
    END AS status
FROM information_schema.columns
WHERE table_schema = DATABASE()
AND table_name IN ('File', 'ConfigurationProcess', 'Client_Total_Relation', 'HeaderClient', 'DocumentByFile')
AND column_name IN ('IdClient', 'IdAgency', 'IdProcess', 'IdCustomerType', 'IdOperationType', 'IdTotalDealer', 'idHeaderClient', 'IdFile', 'IdDocumentType', 'IdCurrentStatus')
ORDER BY table_name, column_name;

-- 3. Verificar Foreign Keys
SELECT '3. Verificando Foreign Keys...' AS check_step;

SELECT 
    tc.table_name,
    tc.constraint_name,
    kcu.column_name,
    ccu.table_name AS referenced_table,
    ccu.column_name AS referenced_column,
    '✅ FK existe' AS status
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu 
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_schema = DATABASE()
AND tc.constraint_type = 'FOREIGN KEY'
AND tc.table_name IN ('File', 'ConfigurationProcess', 'Client_Total_Relation')
ORDER BY tc.table_name, tc.constraint_name;

-- 4. Verificar Índices Compuestos
SELECT '4. Verificando Índices Compuestos...' AS check_step;

SELECT 
    table_name,
    index_name,
    GROUP_CONCAT(column_name ORDER BY seq_in_index SEPARATOR ', ') AS columns,
    '✅ Índice existe' AS status
FROM information_schema.statistics
WHERE table_schema = DATABASE()
AND index_name LIKE 'IDX_%'
AND table_name IN ('File', 'ConfigurationProcess', 'DocumentByFile')
GROUP BY table_name, index_name
ORDER BY table_name, index_name;

-- 5. Verificar integridad de datos (sin huérfanos)
SELECT '5. Verificando integridad de datos...' AS check_step;

SELECT 
    'File.IdCustomerType huérfanos' AS check_type,
    COUNT(*) AS orphan_count
FROM `File` f
LEFT JOIN `CustomerType` ct ON f.IdCustomerType = ct.Id
WHERE ct.Id IS NULL
UNION ALL
SELECT 
    'ConfigurationProcess.IdCustomerType huérfanos' AS check_type,
    COUNT(*) AS orphan_count
FROM `ConfigurationProcess` cp
LEFT JOIN `CustomerType` ct ON cp.IdCustomerType = ct.Id
WHERE ct.Id IS NULL
UNION ALL
SELECT 
    'Client_Total_Relation.idHeaderClient huérfanos' AS check_type,
    COUNT(*) AS orphan_count
FROM `Client_Total_Relation` ctr
LEFT JOIN `HeaderClient` hc ON ctr.idHeaderClient = hc.Id
WHERE hc.Id IS NULL;

SELECT '=== VERIFICACIÓN COMPLETADA ===' AS section;
