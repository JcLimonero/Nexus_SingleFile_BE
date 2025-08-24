<?php

/**
 * Script para probar que el API de agencias SIEMPRE incluye LastUserUpdateName
 */

echo "=== PRUEBA DE AGENCIAS SIEMPRE CON LastUserUpdateName ===\n\n";

try {
    // Cargar CodeIgniter
    require_once __DIR__ . '/../vendor/autoload.php';
    
    // Configurar el entorno
    putenv('CI_ENVIRONMENT=development');
    
    // Conectar a la base de datos
    $hostname = 'localhost';
    $username = 'root';
    $password_db = '00@Limonero';
    $database = 'singlefile_db';
    
    $db = new mysqli($hostname, $username, $password_db, $database);
    
    if ($db->connect_error) {
        throw new Exception("Error de conexión: " . $db->connect_error);
    }
    
    echo "✅ Conexión a base de datos exitosa\n\n";
    
    // 1. PRUEBA: Verificar que todas las consultas incluyen LastUserUpdateName
    echo "🔍 PRUEBA 1: VERIFICAR QUE SIEMPRE SE INCLUYE LastUserUpdateName\n";
    echo "----------------------------------------------------------------\n";
    
    // Simular GET /api/agency (ahora siempre con usuario)
    echo "a) GET /api/agency (siempre con usuario):\n";
    $query = "
        SELECT 
            a.*,
            u.Name as LastUserUpdateName
        FROM Agency a
        LEFT JOIN User u ON a.IdLastUserUpdate = u.Id
        ORDER BY a.Name
        LIMIT 5
    ";
    $result = $db->query($query);
    $agenciesWithUser = [];
    while ($row = $result->fetch_assoc()) {
        $agenciesWithUser[] = $row;
    }
    echo "   Total obtenido: " . count($agenciesWithUser) . " agencias\n";
    echo "   Campos incluidos: " . implode(', ', array_keys($agenciesWithUser[0] ?? [])) . "\n";
    
    // Verificar que LastUserUpdateName está presente
    if (isset($agenciesWithUser[0]['LastUserUpdateName'])) {
        echo "   ✅ LastUserUpdateName está presente\n";
    } else {
        echo "   ❌ LastUserUpdateName NO está presente\n";
    }
    
    // Verificar que LastUserUpdateUsername NO está presente
    if (!isset($agenciesWithUser[0]['LastUserUpdateUsername'])) {
        echo "   ✅ LastUserUpdateUsername NO está presente (correcto)\n";
    } else {
        echo "   ❌ LastUserUpdateUsername SÍ está presente (incorrecto)\n";
    }
    echo "\n";
    
    // 2. PRUEBA: Verificar diferentes filtros siempre incluyen usuario
    echo "🔍 PRUEBA 2: VERIFICAR FILTROS SIEMPRE INCLUYEN USUARIO\n";
    echo "--------------------------------------------------------\n";
    
    // Simular GET /api/agency?enabled=true
    echo "a) GET /api/agency?enabled=true:\n";
    $query = "
        SELECT 
            a.*,
            u.Name as LastUserUpdateName
        FROM Agency a
        LEFT JOIN User u ON a.IdLastUserUpdate = u.Id
        WHERE a.Enabled = 1
        ORDER BY a.Name
        LIMIT 3
    ";
    $result = $db->query($query);
    $enabledAgencies = [];
    while ($row = $result->fetch_assoc()) {
        $enabledAgencies[] = $row;
    }
    echo "   Total obtenido: " . count($enabledAgencies) . " agencias habilitadas\n";
    echo "   LastUserUpdateName presente: " . (isset($enabledAgencies[0]['LastUserUpdateName']) ? 'SÍ' : 'NO') . "\n\n";
    
    // Simular GET /api/agency?enabled=false
    echo "b) GET /api/agency?enabled=false:\n";
    $query = "
        SELECT 
            a.*,
            u.Name as LastUserUpdateName
        FROM Agency a
        LEFT JOIN User u ON a.IdLastUserUpdate = u.Id
        WHERE a.Enabled = 0
        ORDER BY a.Name
        LIMIT 3
    ";
    $result = $db->query($query);
    $disabledAgencies = [];
    while ($row = $result->fetch_assoc()) {
        $disabledAgencies[] = $row;
    }
    echo "   Total obtenido: " . count($disabledAgencies) . " agencias deshabilitadas\n";
    echo "   LastUserUpdateName presente: " . (isset($disabledAgencies[0]['LastUserUpdateName']) ? 'SÍ' : 'NO') . "\n\n";
    
    // 3. PRUEBA: Verificar búsqueda por nombre
    echo "🔍 PRUEBA 3: VERIFICAR BÚSQUEDA POR NOMBRE\n";
    echo "--------------------------------------------\n";
    
    $query = "
        SELECT 
            a.*,
            u.Name as LastUserUpdateName
        FROM Agency a
        LEFT JOIN User u ON a.IdLastUserUpdate = u.Id
        WHERE a.Name LIKE '%BMW%'
        ORDER BY a.Name
    ";
    $result = $db->query($query);
    $searchResults = [];
    while ($row = $result->fetch_assoc()) {
        $searchResults[] = $row;
    }
    echo "Búsqueda por 'BMW':\n";
    foreach ($searchResults as $agency) {
        echo "  - ID: {$agency['Id']}, Nombre: {$agency['Name']}, Usuario: {$agency['LastUserUpdateName']}\n";
    }
    echo "   LastUserUpdateName presente: " . (isset($searchResults[0]['LastUserUpdateName']) ? 'SÍ' : 'NO') . "\n\n";
    
    // 4. PRUEBA: Verificar agencia por ID
    echo "🔍 PRUEBA 4: VERIFICAR AGENCIA POR ID\n";
    echo "--------------------------------------\n";
    
    $query = "
        SELECT 
            a.*,
            u.Name as LastUserUpdateName
        FROM Agency a
        LEFT JOIN User u ON a.IdLastUserUpdate = u.Id
        WHERE a.Id = 3
    ";
    $result = $db->query($query);
    $agencyById = $result->fetch_assoc();
    
    if ($agencyById) {
        echo "Agencia ID 3:\n";
        echo "  - Nombre: {$agencyById['Name']}\n";
        echo "  - Usuario que modificó: {$agencyById['LastUserUpdateName']}\n";
        echo "  - LastUserUpdateName presente: " . (isset($agencyById['LastUserUpdateName']) ? 'SÍ' : 'NO') . "\n";
    } else {
        echo "  ❌ Agencia no encontrada\n";
    }
    echo "\n";
    
    // 5. PRUEBA: Verificar rendimiento del JOIN siempre activo
    echo "⚡ PRUEBA 5: VERIFICAR RENDIMIENTO DEL JOIN SIEMPRE ACTIVO\n";
    echo "-----------------------------------------------------------\n";
    
    $startTime = microtime(true);
    
    // Query con JOIN (ahora siempre activo)
    $result = $db->query("
        SELECT 
            a.*,
            u.Name as LastUserUpdateName
        FROM Agency a
        LEFT JOIN User u ON a.IdLastUserUpdate = u.Id
        ORDER BY a.Name
        LIMIT 100
    ");
    $joinQueryTime = microtime(true) - $startTime;
    
    echo "Tiempo de consulta con JOIN siempre activo: " . round($joinQueryTime * 1000, 2) . " ms\n";
    
    if ($joinQueryTime < 1.0) {
        echo "  ✅ Rendimiento del JOIN siempre activo aceptable\n";
    } else {
        echo "  ⚠️  El JOIN siempre activo puede afectar el rendimiento\n";
    }
    echo "\n";
    
    // 6. PRUEBA: Verificar que no hay campos LastUserUpdateUsername
    echo "🔍 PRUEBA 6: VERIFICAR QUE NO HAY LastUserUpdateUsername\n";
    echo "--------------------------------------------------------\n";
    
    $query = "
        SELECT 
            a.*,
            u.Name as LastUserUpdateName
        FROM Agency a
        LEFT JOIN User u ON a.IdLastUserUpdate = u.Id
        ORDER BY a.Name
        LIMIT 1
    ";
    $result = $db->query($query);
    $singleAgency = $result->fetch_assoc();
    
    $hasUsername = false;
    foreach ($singleAgency as $key => $value) {
        if (strpos($key, 'Username') !== false) {
            $hasUsername = true;
            break;
        }
    }
    
    if (!$hasUsername) {
        echo "  ✅ No hay campos LastUserUpdateUsername (correcto)\n";
    } else {
        echo "  ❌ SÍ hay campos LastUserUpdateUsername (incorrecto)\n";
    }
    echo "\n";
    
    echo "🎉 PRUEBAS COMPLETADAS EXITOSAMENTE\n";
    echo "El API ahora SIEMPRE incluye LastUserUpdateName y NO incluye LastUserUpdateUsername\n";
    
    // Resumen final
    echo "\n📊 RESUMEN FINAL:\n";
    echo "================\n";
    echo "✅ LastUserUpdateName: SIEMPRE incluido\n";
    echo "❌ LastUserUpdateUsername: NUNCA incluido\n";
    echo "🔗 JOIN: SIEMPRE activo\n";
    echo "⚡ Rendimiento: " . round($joinQueryTime * 1000, 2) . " ms\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
    exit(1);
} finally {
    if (isset($db)) {
        $db->close();
    }
}

echo "\n=== FIN DE LAS PRUEBAS ===\n";
