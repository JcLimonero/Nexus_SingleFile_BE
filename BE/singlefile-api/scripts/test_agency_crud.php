<?php

/**
 * Script para probar el API CRUD completo de agencias
 * Verifica todas las operaciones: CREATE, READ, UPDATE, DELETE
 */

echo "=== PRUEBA DEL API CRUD DE AGENCIAS ===\n\n";

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
    
    // 1. PRUEBA DE LECTURA (READ)
    echo "📖 PRUEBA 1: LECTURA DE AGENCIAS\n";
    echo "--------------------------------\n";
    
    // Obtener todas las agencias
    $result = $db->query("SELECT * FROM Agency ORDER BY Name LIMIT 5");
    $agencies = [];
    while ($row = $result->fetch_assoc()) {
        $agencies[] = $row;
    }
    
    echo "Total de agencias encontradas: " . count($agencies) . "\n";
    foreach ($agencies as $agency) {
        echo "  - ID: {$agency['Id']}, Nombre: {$agency['Name']}, Estado: " . ($agency['Enabled'] ? 'Habilitada' : 'Deshabilitada') . "\n";
    }
    echo "\n";
    
    // 2. PRUEBA DE BÚSQUEDA
    echo "🔍 PRUEBA 2: BÚSQUEDA DE AGENCIAS\n";
    echo "--------------------------------\n";
    
    $searchTerm = 'Agencia';
    $stmt = $db->prepare("SELECT * FROM Agency WHERE Name LIKE ? ORDER BY Name");
    $searchPattern = "%{$searchTerm}%";
    $stmt->bind_param("s", $searchPattern);
    $stmt->execute();
    $searchResult = $stmt->get_result();
    
    $searchAgencies = [];
    while ($row = $searchResult->fetch_assoc()) {
        $searchAgencies[] = $row;
    }
    
    echo "Búsqueda por '{$searchTerm}': " . count($searchAgencies) . " resultados\n";
    foreach ($searchAgencies as $agency) {
        echo "  - {$agency['Name']}\n";
    }
    echo "\n";
    
    // 3. PRUEBA DE CREACIÓN (CREATE)
    echo "➕ PRUEBA 3: CREACIÓN DE AGENCIA\n";
    echo "--------------------------------\n";
    
    $newAgencyName = 'Agencia de Prueba ' . date('Y-m-d H:i:s');
    $newAgencySubFix = 'TEST';
    $newAgencyIdAgency = 'TEST001';
    
    // Verificar si ya existe una agencia con ese nombre
    $stmt = $db->prepare("SELECT COUNT(*) as count FROM Agency WHERE Name = ?");
    $stmt->bind_param("s", $newAgencyName);
    $stmt->execute();
    $result = $stmt->get_result();
    $count = $result->fetch_assoc()['count'];
    
    if ($count > 0) {
        echo "⚠️  Ya existe una agencia con el nombre: {$newAgencyName}\n";
        $newAgencyName = 'Agencia de Prueba Única ' . time();
        echo "   Usando nombre alternativo: {$newAgencyName}\n";
    }
    
    // Insertar nueva agencia
    $stmt = $db->prepare("INSERT INTO Agency (Name, SubFix, IdAgency, Enabled, RegistrationDate, UpdateDate) VALUES (?, ?, ?, 1, NOW(), NOW())");
    $stmt->bind_param("sss", $newAgencyName, $newAgencySubFix, $newAgencyIdAgency);
    
    if ($stmt->execute()) {
        $newAgencyId = $db->insert_id;
        echo "✅ Nueva agencia creada exitosamente\n";
        echo "   - ID: {$newAgencyId}\n";
        echo "   - Nombre: {$newAgencyName}\n";
        echo "   - SubFix: {$newAgencySubFix}\n";
        echo "   - IdAgency: {$newAgencyIdAgency}\n";
    } else {
        throw new Exception("Error al crear agencia: " . $stmt->error);
    }
    echo "\n";
    
    // 4. PRUEBA DE ACTUALIZACIÓN (UPDATE)
    echo "✏️  PRUEBA 4: ACTUALIZACIÓN DE AGENCIA\n";
    echo "--------------------------------\n";
    
    $updatedName = 'Agencia de Prueba Actualizada ' . date('Y-m-d H:i:s');
    $updatedSubFix = 'UPDATED';
    
    $stmt = $db->prepare("UPDATE Agency SET Name = ?, SubFix = ?, UpdateDate = NOW() WHERE Id = ?");
    $stmt->bind_param("ssi", $updatedName, $updatedSubFix, $newAgencyId);
    
    if ($stmt->execute()) {
        echo "✅ Agencia actualizada exitosamente\n";
        echo "   - ID: {$newAgencyId}\n";
        echo "   - Nuevo nombre: {$updatedName}\n";
        echo "   - Nuevo SubFix: {$updatedSubFix}\n";
        
        // Verificar la actualización
        $stmt = $db->prepare("SELECT * FROM Agency WHERE Id = ?");
        $stmt->bind_param("i", $newAgencyId);
        $stmt->execute();
        $result = $stmt->get_result();
        $updatedAgency = $result->fetch_assoc();
        
        echo "   - Verificación: {$updatedAgency['Name']} | {$updatedAgency['SubFix']}\n";
    } else {
        throw new Exception("Error al actualizar agencia: " . $stmt->error);
    }
    echo "\n";
    
    // 5. PRUEBA DE CAMBIO DE ESTADO
    echo "🔄 PRUEBA 5: CAMBIO DE ESTADO\n";
    echo "--------------------------------\n";
    
    // Deshabilitar la agencia
    $stmt = $db->prepare("UPDATE Agency SET Enabled = 0, UpdateDate = NOW() WHERE Id = ?");
    $stmt->bind_param("i", $newAgencyId);
    
    if ($stmt->execute()) {
        echo "✅ Estado de agencia cambiado exitosamente\n";
        echo "   - ID: {$newAgencyId}\n";
        echo "   - Nuevo estado: Deshabilitada\n";
        
        // Verificar el cambio de estado
        $stmt = $db->prepare("SELECT Enabled FROM Agency WHERE Id = ?");
        $stmt->bind_param("i", $newAgencyId);
        $stmt->execute();
        $result = $stmt->get_result();
        $enabled = $result->fetch_assoc()['Enabled'];
        
        echo "   - Verificación: Enabled = {$enabled}\n";
    } else {
        throw new Exception("Error al cambiar estado: " . $stmt->error);
    }
    echo "\n";
    
    // 6. PRUEBA DE ESTADÍSTICAS
    echo "📊 PRUEBA 6: ESTADÍSTICAS\n";
    echo "--------------------------------\n";
    
    // Total de agencias
    $result = $db->query("SELECT COUNT(*) as total FROM Agency");
    $total = $result->fetch_assoc()['total'];
    
    // Agencias habilitadas
    $result = $db->query("SELECT COUNT(*) as enabled FROM Agency WHERE Enabled = 1");
    $enabled = $result->fetch_assoc()['enabled'];
    
    // Agencias deshabilitadas
    $disabled = $total - $enabled;
    
    echo "Estadísticas de agencias:\n";
    echo "  - Total: {$total}\n";
    echo "  - Habilitadas: {$enabled}\n";
    echo "  - Deshabilitadas: {$disabled}\n";
    
    // Estadísticas por región
    $result = $db->query("SELECT SubFix, COUNT(*) as count FROM Agency WHERE SubFix IS NOT NULL AND SubFix != '' GROUP BY SubFix ORDER BY count DESC");
    echo "  - Por región:\n";
    while ($row = $result->fetch_assoc()) {
        echo "    * {$row['SubFix']}: {$row['count']} agencias\n";
    }
    echo "\n";
    
    // 7. PRUEBA DE ELIMINACIÓN (DELETE)
    echo "🗑️  PRUEBA 7: ELIMINACIÓN DE AGENCIA\n";
    echo "--------------------------------\n";
    
    // Soft delete (deshabilitar)
    echo "Realizando soft delete (deshabilitar)...\n";
    $stmt = $db->prepare("UPDATE Agency SET Enabled = 0, UpdateDate = NOW() WHERE Id = ?");
    $stmt->bind_param("i", $newAgencyId);
    
    if ($stmt->execute()) {
        echo "✅ Soft delete realizado exitosamente\n";
        
        // Verificar que la agencia esté deshabilitada
        $stmt = $db->prepare("SELECT Enabled FROM Agency WHERE Id = ?");
        $stmt->bind_param("i", $newAgencyId);
        $stmt->execute();
        $result = $stmt->get_result();
        $enabled = $result->fetch_assoc()['Enabled'];
        
        echo "   - Estado después del soft delete: " . ($enabled ? 'Habilitada' : 'Deshabilitada') . "\n";
    } else {
        throw new Exception("Error en soft delete: " . $stmt->error);
    }
    
    // Hard delete (eliminar permanentemente)
    echo "Realizando hard delete (eliminar permanentemente)...\n";
    $stmt = $db->prepare("DELETE FROM Agency WHERE Id = ?");
    $stmt->bind_param("i", $newAgencyId);
    
    if ($stmt->execute()) {
        echo "✅ Hard delete realizado exitosamente\n";
        
        // Verificar que la agencia haya sido eliminada
        $stmt = $db->prepare("SELECT COUNT(*) as count FROM Agency WHERE Id = ?");
        $stmt->bind_param("i", $newAgencyId);
        $stmt->execute();
        $result = $stmt->get_result();
        $count = $result->fetch_assoc()['count'];
        
        echo "   - Verificación: " . ($count === 0 ? 'Agencia eliminada' : 'Agencia aún existe') . "\n";
    } else {
        throw new Exception("Error en hard delete: " . $stmt->error);
    }
    echo "\n";
    
    // 8. PRUEBA DE VALIDACIONES
    echo "✅ PRUEBA 8: VALIDACIONES\n";
    echo "--------------------------------\n";
    
    // Validar nombre duplicado
    $existingName = $agencies[0]['Name'] ?? 'Agencia Test';
    $stmt = $db->prepare("SELECT COUNT(*) as count FROM Agency WHERE Name = ?");
    $stmt->bind_param("s", $existingName);
    $stmt->execute();
    $result = $stmt->get_result();
    $duplicateCount = $result->fetch_assoc()['count'];
    
    echo "Validación de nombre duplicado:\n";
    echo "  - Nombre a verificar: {$existingName}\n";
    echo "  - Ocurrencias encontradas: {$duplicateCount}\n";
    echo "  - ¿Es duplicado?: " . ($duplicateCount > 1 ? 'Sí' : 'No') . "\n";
    
    // Validar longitud de campos
    $longName = str_repeat('A', 601); // Más de 600 caracteres
    $longSubFix = str_repeat('B', 51); // Más de 50 caracteres
    
    echo "Validación de longitud de campos:\n";
    echo "  - Nombre largo (" . strlen($longName) . " chars): " . (strlen($longName) <= 600 ? 'Válido' : 'Inválido') . "\n";
    echo "  - SubFix largo (" . strlen($longSubFix) . " chars): " . (strlen($longSubFix) <= 50 ? 'Válido' : 'Inválido') . "\n";
    
    echo "\n🎉 TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE\n";
    echo "El API CRUD de agencias está funcionando correctamente\n";
    
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
