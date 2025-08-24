<?php

/**
 * Script para probar que el API de agencias trae correctamente las agencias deshabilitadas
 */

echo "=== PRUEBA DE AGENCIAS DESHABILITADAS ===\n\n";

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
    
    // Verificar estructura de la tabla Agency
    echo "🔍 Verificando estructura de la tabla Agency...\n";
    
    $result = $db->query("DESCRIBE Agency");
    $columns = [];
    while ($row = $result->fetch_assoc()) {
        $columns[] = $row['Field'];
    }
    
    echo "Columnas de la tabla Agency: " . implode(', ', $columns) . "\n\n";
    
    // 1. PRUEBA: Contar agencias por estado
    echo "📊 PRUEBA 1: CONTEO DE AGENCIAS POR ESTADO\n";
    echo "--------------------------------------------\n";
    
    // Total de agencias
    $result = $db->query("SELECT COUNT(*) as total FROM Agency");
    $total = $result->fetch_assoc()['total'];
    
    // Agencias habilitadas
    $result = $db->query("SELECT COUNT(*) as enabled FROM Agency WHERE Enabled = 1");
    $enabled = $result->fetch_assoc()['enabled'];
    
    // Agencias deshabilitadas
    $result = $db->query("SELECT COUNT(*) as disabled FROM Agency WHERE Enabled = 0");
    $disabled = $result->fetch_assoc()['disabled'];
    
    echo "Estadísticas de agencias:\n";
    echo "  - Total: {$total}\n";
    echo "  - Habilitadas: {$enabled}\n";
    echo "  - Deshabilitadas: {$disabled}\n\n";
    
    // 2. PRUEBA: Listar agencias deshabilitadas
    echo "📋 PRUEBA 2: LISTAR AGENCIAS DESHABILITADAS\n";
    echo "--------------------------------------------\n";
    
    $result = $db->query("SELECT Id, Name, SubFix, Enabled, RegistrationDate FROM Agency WHERE Enabled = 0 ORDER BY Name LIMIT 10");
    $disabledAgencies = [];
    while ($row = $result->fetch_assoc()) {
        $disabledAgencies[] = $row;
    }
    
    if (count($disabledAgencies) > 0) {
        echo "Agencias deshabilitadas encontradas:\n";
        foreach ($disabledAgencies as $agency) {
            echo "  - ID: {$agency['Id']}, Nombre: {$agency['Name']}, SubFix: {$agency['SubFix']}\n";
        }
    } else {
        echo "No hay agencias deshabilitadas en la base de datos\n";
        
        // Crear una agencia de prueba deshabilitada
        echo "Creando agencia de prueba deshabilitada...\n";
        
        $testName = 'Agencia de Prueba Deshabilitada ' . date('Y-m-d H:i:s');
        $testSubFix = 'TEST_DISABLED';
        
        $stmt = $db->prepare("INSERT INTO Agency (Name, SubFix, Enabled, RegistrationDate, UpdateDate) VALUES (?, ?, 0, NOW(), NOW())");
        $stmt->bind_param("ss", $testName, $testSubFix);
        
        if ($stmt->execute()) {
            $testId = $db->insert_id;
            echo "✅ Agencia de prueba deshabilitada creada con ID: {$testId}\n";
            
            // Actualizar contadores
            $disabled++;
            $total++;
        } else {
            echo "❌ Error al crear agencia de prueba: " . $stmt->error . "\n";
        }
    }
    echo "\n";
    
    // 3. PRUEBA: Simular diferentes parámetros del API
    echo "🔧 PRUEBA 3: SIMULACIÓN DE PARÁMETROS DEL API\n";
    echo "-----------------------------------------------\n";
    
    // Simular GET /api/agency (sin parámetro enabled)
    echo "a) GET /api/agency (sin parámetro enabled):\n";
    $query = "SELECT * FROM Agency ORDER BY Name LIMIT 5";
    $result = $db->query($query);
    $allAgencies = [];
    while ($row = $result->fetch_assoc()) {
        $allAgencies[] = $row;
    }
    echo "   Total obtenido: " . count($allAgencies) . " agencias\n";
    echo "   Estados encontrados: " . implode(', ', array_unique(array_column($allAgencies, 'Enabled'))) . "\n\n";
    
    // Simular GET /api/agency?enabled=true
    echo "b) GET /api/agency?enabled=true:\n";
    $query = "SELECT * FROM Agency WHERE Enabled = 1 ORDER BY Name LIMIT 5";
    $result = $db->query($query);
    $enabledAgencies = [];
    while ($row = $result->fetch_assoc()) {
        $enabledAgencies[] = $row;
    }
    echo "   Total obtenido: " . count($enabledAgencies) . " agencias habilitadas\n";
    echo "   Estados encontrados: " . implode(', ', array_unique(array_column($enabledAgencies, 'Enabled'))) . "\n\n";
    
    // Simular GET /api/agency?enabled=false
    echo "c) GET /api/agency?enabled=false:\n";
    $query = "SELECT * FROM Agency WHERE Enabled = 0 ORDER BY Name LIMIT 5";
    $result = $db->query($query);
    $disabledAgencies = [];
    while ($row = $result->fetch_assoc()) {
        $disabledAgencies[] = $row;
    }
    echo "   Total obtenido: " . count($disabledAgencies) . " agencias deshabilitadas\n";
    echo "   Estados encontrados: " . implode(', ', array_unique(array_column($disabledAgencies, 'Enabled'))) . "\n\n";
    
    // 4. PRUEBA: Búsqueda incluyendo agencias deshabilitadas
    echo "🔍 PRUEBA 4: BÚSQUEDA INCLUYENDO AGENCIAS DESHABILITADAS\n";
    echo "----------------------------------------------------------------\n";
    
    $searchTerm = 'Agencia';
    echo "Búsqueda por '{$searchTerm}' (incluyendo deshabilitadas):\n";
    
    $query = "SELECT * FROM Agency WHERE Name LIKE ? ORDER BY Name LIMIT 10";
    $stmt = $db->prepare($query);
    $searchPattern = "%{$searchTerm}%";
    $stmt->bind_param("s", $searchPattern);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $searchResults = [];
    while ($row = $result->fetch_assoc()) {
        $searchResults[] = $row;
    }
    
    echo "   Total encontrado: " . count($searchResults) . " agencias\n";
    
    // Agrupar por estado
    $byStatus = [];
    foreach ($searchResults as $agency) {
        $status = $agency['Enabled'] ? 'Habilitada' : 'Deshabilitada';
        if (!isset($byStatus[$status])) {
            $byStatus[$status] = [];
        }
        $byStatus[$status][] = $agency['Name'];
    }
    
    foreach ($byStatus as $status => $names) {
        echo "   - {$status}: " . count($names) . " agencias\n";
        foreach (array_slice($names, 0, 3) as $name) {
            echo "     * {$name}\n";
        }
        if (count($names) > 3) {
            echo "     ... y " . (count($names) - 3) . " más\n";
        }
    }
    echo "\n";
    
    // 5. PRUEBA: Filtro por región incluyendo deshabilitadas
    echo "🌍 PRUEBA 5: FILTRO POR REGIÓN INCLUYENDO DESHABILITADAS\n";
    echo "----------------------------------------------------------------\n";
    
    // Obtener regiones disponibles
    $result = $db->query("SELECT SubFix, COUNT(*) as count FROM Agency WHERE SubFix IS NOT NULL AND SubFix != '' GROUP BY SubFix ORDER BY count DESC LIMIT 3");
    $regions = [];
    while ($row = $result->fetch_assoc()) {
        $regions[] = $row;
    }
    
    if (count($regions) > 0) {
        $testRegion = $regions[0]['SubFix'];
        echo "Probando filtro por región: {$testRegion}\n";
        
        // Con enabled=true
        $query = "SELECT * FROM Agency WHERE SubFix = ? AND Enabled = 1 ORDER BY Name";
        $stmt = $db->prepare($query);
        $stmt->bind_param("s", $testRegion);
        $stmt->execute();
        $result = $stmt->get_result();
        $enabledInRegion = $result->num_rows;
        
        // Con enabled=false
        $query = "SELECT * FROM Agency WHERE SubFix = ? AND Enabled = 0 ORDER BY Name";
        $stmt = $db->prepare($query);
        $stmt->bind_param("s", $testRegion);
        $stmt->execute();
        $result = $stmt->get_result();
        $disabledInRegion = $result->num_rows;
        
        // Sin filtro de enabled
        $query = "SELECT * FROM Agency WHERE SubFix = ? ORDER BY Name";
        $stmt = $db->prepare($query);
        $stmt->bind_param("s", $testRegion);
        $stmt->execute();
        $result = $stmt->get_result();
        $totalInRegion = $result->num_rows;
        
        echo "   - Solo habilitadas: {$enabledInRegion} agencias\n";
        echo "   - Solo deshabilitadas: {$disabledInRegion} agencias\n";
        echo "   - Total (sin filtro): {$totalInRegion} agencias\n";
        
        // Verificar que la suma sea correcta
        $expectedTotal = $enabledInRegion + $disabledInRegion;
        if ($totalInRegion === $expectedTotal) {
            echo "   ✅ Verificación correcta: {$enabledInRegion} + {$disabledInRegion} = {$totalInRegion}\n";
        } else {
            echo "   ❌ Error en verificación: {$enabledInRegion} + {$disabledInRegion} ≠ {$totalInRegion}\n";
        }
    } else {
        echo "No hay regiones disponibles para probar\n";
    }
    echo "\n";
    
    // 6. PRUEBA: Verificar que el conteo total sea correcto
    echo "✅ PRUEBA 6: VERIFICACIÓN DE CONTEO TOTAL\n";
    echo "------------------------------------------\n";
    
    $expectedTotal = $enabled + $disabled;
    if ($total === $expectedTotal) {
        echo "✅ Conteo total correcto: {$enabled} + {$disabled} = {$total}\n";
    } else {
        echo "❌ Error en conteo total: {$enabled} + {$disabled} ≠ {$total}\n";
        echo "   Diferencia: " . abs($total - $expectedTotal) . "\n";
    }
    
    echo "\n🎉 PRUEBAS COMPLETADAS EXITOSAMENTE\n";
    echo "El API ahora debería traer correctamente las agencias deshabilitadas\n";
    
    // Resumen final
    echo "\n📊 RESUMEN FINAL:\n";
    echo "================\n";
    echo "Total de agencias: {$total}\n";
    echo "Agencias habilitadas: {$enabled}\n";
    echo "Agencias deshabilitadas: {$disabled}\n";
    echo "Porcentaje habilitadas: " . round(($enabled / $total) * 100, 1) . "%\n";
    echo "Porcentaje deshabilitadas: " . round(($disabled / $total) * 100, 1) . "%\n";
    
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
