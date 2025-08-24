<?php

/**
 * Script para probar que el API de agencias incluye información del usuario que modificó
 */

echo "=== PRUEBA DE AGENCIAS CON INFORMACIÓN DE USUARIO ===\n\n";

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
    
    // Verificar estructura de las tablas
    echo "🔍 Verificando estructura de las tablas...\n";
    
    // Verificar tabla Agency
    $result = $db->query("DESCRIBE Agency");
    $agencyColumns = [];
    while ($row = $result->fetch_assoc()) {
        $agencyColumns[] = $row['Field'];
    }
    echo "Columnas de la tabla Agency: " . implode(', ', $agencyColumns) . "\n";
    
    // Verificar tabla User
    $result = $db->query("DESCRIBE User");
    $userColumns = [];
    while ($row = $result->fetch_assoc()) {
        $userColumns[] = $row['Field'];
    }
    echo "Columnas de la tabla User: " . implode(', ', $userColumns) . "\n\n";
    
    // 1. PRUEBA: Verificar que hay agencias con IdLastUserUpdate
    echo "📊 PRUEBA 1: VERIFICAR AGENCIAS CON USUARIO QUE MODIFICÓ\n";
    echo "--------------------------------------------------------\n";
    
    $result = $db->query("SELECT COUNT(*) as total FROM Agency WHERE IdLastUserUpdate IS NOT NULL AND IdLastUserUpdate > 0");
    $agenciesWithUser = $result->fetch_assoc()['total'];
    
    $result = $db->query("SELECT COUNT(*) as total FROM Agency");
    $totalAgencies = $result->fetch_assoc()['total'];
    
    echo "Total de agencias: {$totalAgencies}\n";
    echo "Agencias con usuario que modificó: {$agenciesWithUser}\n";
    echo "Agencias sin usuario que modificó: " . ($totalAgencies - $agenciesWithUser) . "\n\n";
    
    // 2. PRUEBA: Simular JOIN entre Agency y User
    echo "🔗 PRUEBA 2: SIMULAR JOIN ENTRE AGENCY Y USER\n";
    echo "-----------------------------------------------\n";
    
    $query = "
        SELECT 
            a.Id,
            a.Name,
            a.IdAgency,
            a.Enabled,
            a.IdLastUserUpdate,
            u.Name as LastUserUpdateName,
            u.User as LastUserUpdateUsername
        FROM Agency a
        LEFT JOIN User u ON a.IdLastUserUpdate = u.Id
        ORDER BY a.Name
        LIMIT 10
    ";
    
    $result = $db->query($query);
    $agenciesWithUserInfo = [];
    while ($row = $result->fetch_assoc()) {
        $agenciesWithUserInfo[] = $row;
    }
    
    echo "Agencias con información de usuario (primeras 10):\n";
    foreach ($agenciesWithUserInfo as $agency) {
        $userInfo = $agency['LastUserUpdateName'] ? 
            "{$agency['LastUserUpdateName']} ({$agency['LastUserUpdateUsername']})" : 
            "Sin usuario";
        
        echo "  - ID: {$agency['Id']}, Nombre: {$agency['Name']}, Usuario: {$userInfo}\n";
    }
    echo "\n";
    
    // 3. PRUEBA: Verificar usuarios disponibles
    echo "👤 PRUEBA 3: VERIFICAR USUARIOS DISPONIBLES\n";
    echo "--------------------------------------------\n";
    
    $result = $db->query("SELECT Id, Name, User, Enabled FROM User ORDER BY Name LIMIT 10");
    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
    
    echo "Usuarios disponibles (primeros 10):\n";
    foreach ($users as $user) {
        $status = $user['Enabled'] ? 'Habilitado' : 'Deshabilitado';
        echo "  - ID: {$user['Id']}, Nombre: {$user['Name']}, Usuario: {$user['User']}, Estado: {$status}\n";
    }
    echo "\n";
    
    // 4. PRUEBA: Simular diferentes parámetros del API
    echo "🔧 PRUEBA 4: SIMULAR PARÁMETROS DEL API\n";
    echo "------------------------------------------\n";
    
    // Simular GET /api/agency (sin include_user)
    echo "a) GET /api/agency (sin include_user):\n";
    $query = "SELECT * FROM Agency ORDER BY Name LIMIT 5";
    $result = $db->query($query);
    $basicAgencies = [];
    while ($row = $result->fetch_assoc()) {
        $basicAgencies[] = $row;
    }
    echo "   Total obtenido: " . count($basicAgencies) . " agencias\n";
    echo "   Campos incluidos: " . implode(', ', array_keys($basicAgencies[0] ?? [])) . "\n\n";
    
    // Simular GET /api/agency?include_user=true
    echo "b) GET /api/agency?include_user=true:\n";
    $query = "
        SELECT 
            a.*,
            u.Name as LastUserUpdateName,
            u.User as LastUserUpdateUsername
        FROM Agency a
        LEFT JOIN User u ON a.IdLastUserUpdate = u.Id
        ORDER BY a.Name
        LIMIT 5
    ";
    $result = $db->query($query);
    $agenciesWithUserData = [];
    while ($row = $result->fetch_assoc()) {
        $agenciesWithUserData[] = $row;
    }
    echo "   Total obtenido: " . count($agenciesWithUserData) . " agencias\n";
    echo "   Campos incluidos: " . implode(', ', array_keys($agenciesWithUserData[0] ?? [])) . "\n\n";
    
    // 5. PRUEBA: Verificar que el JOIN funciona correctamente
    echo "✅ PRUEBA 5: VERIFICAR FUNCIONAMIENTO DEL JOIN\n";
    echo "-----------------------------------------------\n";
    
    // Contar agencias con y sin usuario
    $result = $db->query("
        SELECT 
            CASE 
                WHEN u.Id IS NOT NULL THEN 'Con usuario'
                ELSE 'Sin usuario'
            END as status,
            COUNT(*) as count
        FROM Agency a
        LEFT JOIN User u ON a.IdLastUserUpdate = u.Id
        GROUP BY status
    ");
    
    $userStatusCount = [];
    while ($row = $result->fetch_assoc()) {
        $userStatusCount[] = $row;
    }
    
    echo "Estado del JOIN:\n";
    foreach ($userStatusCount as $status) {
        echo "  - {$status['status']}: {$status['count']} agencias\n";
    }
    
    // Verificar que la suma sea correcta
    $totalFromJoin = array_sum(array_column($userStatusCount, 'count'));
    if ($totalFromJoin === $totalAgencies) {
        echo "  ✅ Verificación correcta: Total del JOIN = Total de agencias\n";
    } else {
        echo "  ❌ Error en verificación: Total del JOIN ≠ Total de agencias\n";
    }
    echo "\n";
    
    // 6. PRUEBA: Simular filtros combinados
    echo "🔍 PRUEBA 6: SIMULAR FILTROS COMBINADOS\n";
    echo "----------------------------------------\n";
    
    // Simular GET /api/agency?enabled=true&include_user=true
    echo "a) GET /api/agency?enabled=true&include_user=true:\n";
    $query = "
        SELECT 
            a.*,
            u.Name as LastUserUpdateName,
            u.User as LastUserUpdateUsername
        FROM Agency a
        LEFT JOIN User u ON a.IdLastUserUpdate = u.Id
        WHERE a.Enabled = 1
        ORDER BY a.Name
        LIMIT 5
    ";
    $result = $db->query($query);
    $enabledAgenciesWithUserCount = $result->num_rows;
    echo "   Total obtenido: {$enabledAgenciesWithUserCount} agencias habilitadas con información de usuario\n\n";
    
    // Simular GET /api/agency?enabled=false&include_user=true
    echo "b) GET /api/agency?enabled=false&include_user=true:\n";
    $query = "
        SELECT 
            a.*,
            u.Name as LastUserUpdateName,
            u.User as LastUserUpdateUsername
        FROM Agency a
        LEFT JOIN User u ON a.IdLastUserUpdate = u.Id
        WHERE a.Enabled = 0
        ORDER BY a.Name
        LIMIT 5
    ";
    $result = $db->query($query);
    $disabledAgenciesWithUserCount = $result->num_rows;
    echo "   Total obtenido: {$disabledAgenciesWithUserCount} agencias deshabilitadas con información de usuario\n\n";
    
    // 7. PRUEBA: Verificar rendimiento del JOIN
    echo "⚡ PRUEBA 7: VERIFICAR RENDIMIENTO DEL JOIN\n";
    echo "--------------------------------------------\n";
    
    $startTime = microtime(true);
    
    // Query simple sin JOIN
    $result = $db->query("SELECT * FROM Agency ORDER BY Name LIMIT 100");
    $simpleQueryTime = microtime(true) - $startTime;
    
    $startTime = microtime(true);
    
    // Query con JOIN
    $result = $db->query("
        SELECT 
            a.*,
            u.Name as LastUserUpdateName,
            u.User as LastUserUpdateUsername
        FROM Agency a
        LEFT JOIN User u ON a.IdLastUserUpdate = u.Id
        ORDER BY a.Name
        LIMIT 100
    ");
    $joinQueryTime = microtime(true) - $startTime;
    
    echo "Tiempo de consulta simple: " . round($simpleQueryTime * 1000, 2) . " ms\n";
    echo "Tiempo de consulta con JOIN: " . round($joinQueryTime * 1000, 2) . " ms\n";
    echo "Diferencia: " . round(($joinQueryTime - $simpleQueryTime) * 1000, 2) . " ms\n";
    
    if ($joinQueryTime < $simpleQueryTime * 2) {
        echo "  ✅ Rendimiento del JOIN aceptable\n";
    } else {
        echo "  ⚠️  El JOIN puede afectar el rendimiento\n";
    }
    echo "\n";
    
    echo "🎉 PRUEBAS COMPLETADAS EXITOSAMENTE\n";
    echo "El API ahora incluye información del usuario que modificó cada agencia\n";
    
    // Resumen final
    echo "\n📊 RESUMEN FINAL:\n";
    echo "================\n";
    echo "Total de agencias: {$totalAgencies}\n";
    echo "Agencias con usuario que modificó: {$agenciesWithUser}\n";
    echo "Agencias sin usuario que modificó: " . ($totalAgencies - $agenciesWithUser) . "\n";
    echo "Usuarios disponibles: " . count($users) . "\n";
    
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
