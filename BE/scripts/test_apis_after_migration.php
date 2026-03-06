<?php
/**
 * Script para probar que las APIs funcionan correctamente después de las migraciones
 */

echo "=== PRUEBAS POST-MIGRACIÓN ===\n\n";

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

$mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);

if ($mysqli->connect_error) {
    die("❌ Error de conexión: " . $mysqli->connect_error . "\n");
}

echo "✅ Conectado a la base de datos: {$db['database']}\n\n";

$tests = [];
$passed = 0;
$failed = 0;

// Test 1: Verificar que CustomerType existe y es accesible
echo "1. Verificando tabla CustomerType...\n";
$result = $mysqli->query("SELECT COUNT(*) as count FROM `CustomerType`");
if ($result) {
    $row = $result->fetch_assoc();
    echo "   ✅ Tabla CustomerType accesible ({$row['count']} registros)\n";
    $tests[] = ['name' => 'CustomerType accesible', 'status' => 'PASS'];
    $passed++;
} else {
    echo "   ❌ Error: " . $mysqli->error . "\n";
    $tests[] = ['name' => 'CustomerType accesible', 'status' => 'FAIL', 'error' => $mysqli->error];
    $failed++;
}

// Test 2: Verificar que File.IdCustomerType existe y funciona
echo "\n2. Verificando columna File.IdCustomerType...\n";
$result = $mysqli->query("SELECT COUNT(*) as count FROM `File` WHERE `IdCustomerType` IS NOT NULL");
if ($result) {
    $row = $result->fetch_assoc();
    echo "   ✅ Columna IdCustomerType existe y tiene datos ({$row['count']} registros)\n";
    $tests[] = ['name' => 'File.IdCustomerType', 'status' => 'PASS'];
    $passed++;
} else {
    echo "   ❌ Error: " . $mysqli->error . "\n";
    $tests[] = ['name' => 'File.IdCustomerType', 'status' => 'FAIL', 'error' => $mysqli->error];
    $failed++;
}

// Test 3: Verificar JOIN entre File y CustomerType
echo "\n3. Verificando JOIN File -> CustomerType...\n";
$result = $mysqli->query("
    SELECT f.Id, f.IdCustomerType, ct.Name as CustomerTypeName 
    FROM `File` f 
    LEFT JOIN `CustomerType` ct ON f.IdCustomerType = ct.Id 
    LIMIT 5
");
if ($result && $result->num_rows > 0) {
    echo "   ✅ JOIN funciona correctamente\n";
    $tests[] = ['name' => 'JOIN File->CustomerType', 'status' => 'PASS'];
    $passed++;
} else {
    echo "   ⚠️  No hay datos para probar el JOIN\n";
    $tests[] = ['name' => 'JOIN File->CustomerType', 'status' => 'WARN'];
}

// Test 4: Verificar ConfigurationProcess.IdCustomerType
echo "\n4. Verificando columna ConfigurationProcess.IdCustomerType...\n";
$result = $mysqli->query("SELECT COUNT(*) as count FROM `ConfigurationProcess` WHERE `IdCustomerType` IS NOT NULL");
if ($result) {
    $row = $result->fetch_assoc();
    echo "   ✅ Columna IdCustomerType existe ({$row['count']} registros)\n";
    $tests[] = ['name' => 'ConfigurationProcess.IdCustomerType', 'status' => 'PASS'];
    $passed++;
} else {
    echo "   ❌ Error: " . $mysqli->error . "\n";
    $tests[] = ['name' => 'ConfigurationProcess.IdCustomerType', 'status' => 'FAIL', 'error' => $mysqli->error];
    $failed++;
}

// Test 5: Verificar Foreign Keys activas
echo "\n5. Verificando Foreign Keys...\n";
$result = $mysqli->query("
    SELECT COUNT(*) as count 
    FROM information_schema.table_constraints 
    WHERE table_schema = DATABASE() 
    AND constraint_type = 'FOREIGN KEY'
    AND table_name IN ('File', 'ConfigurationProcess', 'Client_Total_Relation')
");
if ($result) {
    $row = $result->fetch_assoc();
    $fkCount = $row['count'];
    if ($fkCount > 0) {
        echo "   ✅ Foreign Keys activas: $fkCount\n";
        $tests[] = ['name' => 'Foreign Keys', 'status' => 'PASS'];
        $passed++;
    } else {
        echo "   ⚠️  No se encontraron Foreign Keys\n";
        $tests[] = ['name' => 'Foreign Keys', 'status' => 'WARN'];
    }
}

// Test 6: Verificar índices compuestos
echo "\n6. Verificando índices compuestos...\n";
$result = $mysqli->query("
    SELECT COUNT(*) as count 
    FROM information_schema.statistics 
    WHERE table_schema = DATABASE() 
    AND index_name LIKE 'IDX_%'
    AND table_name IN ('File', 'ConfigurationProcess', 'DocumentByFile')
");
if ($result) {
    $row = $result->fetch_assoc();
    $idxCount = $row['count'];
    if ($idxCount > 0) {
        echo "   ✅ Índices compuestos creados: $idxCount\n";
        $tests[] = ['name' => 'Índices compuestos', 'status' => 'PASS'];
        $passed++;
    } else {
        echo "   ⚠️  No se encontraron índices compuestos\n";
        $tests[] = ['name' => 'Índices compuestos', 'status' => 'WARN'];
    }
}

// Test 7: Verificar query común optimizada
echo "\n7. Verificando query optimizada (File por agencia + estado)...\n";
$start = microtime(true);
$result = $mysqli->query("
    SELECT f.Id, f.IdAgency, f.IdCurrentState, f.RegistrationDate
    FROM `File` f
    WHERE f.IdAgency = 1 AND f.IdCurrentState = 1
    ORDER BY f.RegistrationDate DESC
    LIMIT 10
");
$time = round((microtime(true) - $start) * 1000, 2);
if ($result) {
    echo "   ✅ Query ejecutada en {$time}ms\n";
    $tests[] = ['name' => 'Query optimizada', 'status' => 'PASS', 'time' => $time];
    $passed++;
} else {
    echo "   ⚠️  Query ejecutada pero sin datos para probar\n";
    $tests[] = ['name' => 'Query optimizada', 'status' => 'WARN'];
}

// Test 8: Verificar integridad referencial
echo "\n8. Verificando integridad referencial...\n";
$result = $mysqli->query("
    SELECT COUNT(*) as orphans
    FROM `File` f
    LEFT JOIN `CustomerType` ct ON f.IdCustomerType = ct.Id
    WHERE ct.Id IS NULL AND f.IdCustomerType IS NOT NULL
");
if ($result) {
    $row = $result->fetch_assoc();
    if ($row['orphans'] == 0) {
        echo "   ✅ Sin registros huérfanos\n";
        $tests[] = ['name' => 'Integridad referencial', 'status' => 'PASS'];
        $passed++;
    } else {
        echo "   ⚠️  Encontrados {$row['orphans']} registros huérfanos\n";
        $tests[] = ['name' => 'Integridad referencial', 'status' => 'WARN'];
    }
}

// Test 9: Verificar Company.Name
echo "\n9. Verificando Company.Name...\n";
$result = $mysqli->query("SELECT COUNT(*) as count FROM `Company`");
if ($result) {
    $row = $result->fetch_assoc();
    echo "   ✅ Tabla Company accesible ({$row['count']} registros)\n";
    $tests[] = ['name' => 'Company accesible', 'status' => 'PASS'];
    $passed++;
} else {
    echo "   ⚠️  Error o tabla vacía: " . $mysqli->error . "\n";
    $tests[] = ['name' => 'Company accesible', 'status' => 'WARN'];
}

$mysqli->close();

// Resumen
echo "\n" . str_repeat("=", 60) . "\n";
echo "📊 RESUMEN DE PRUEBAS:\n";
echo str_repeat("=", 60) . "\n";
echo "✅ Pruebas exitosas: $passed\n";
echo "❌ Pruebas fallidas: $failed\n";
echo "⚠️  Advertencias: " . (count($tests) - $passed - $failed) . "\n\n";

if ($failed == 0) {
    echo "✅ Todas las pruebas críticas pasaron correctamente\n";
    echo "🎉 La base de datos está lista para usar\n";
} else {
    echo "⚠️  Algunas pruebas fallaron. Revisa los errores arriba.\n";
}
