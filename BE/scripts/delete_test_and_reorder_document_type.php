<?php
/**
 * Eliminar registros con "Test" y reordenar document_type alfabéticamente
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== ELIMINAR 'TEST' Y REORDENAR DOCUMENT_TYPE ALFABÉTICAMENTE ===\n\n";

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

echo "Base de datos: {$db['database']}\n";
echo "Host: {$db['hostname']}\n\n";

try {
    $mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);
    
    if ($mysqli->connect_error) {
        die("❌ Error de conexión: " . $mysqli->connect_error . "\n");
    }
    
    echo "✅ Conectado a la base de datos\n\n";
    
    // Iniciar transacción
    $mysqli->begin_transaction();
    
    // Deshabilitar foreign key checks temporalmente
    $mysqli->query("SET FOREIGN_KEY_CHECKS = 0");
    
    // Paso 1: Buscar y eliminar registros con "Test"
    echo "📋 Paso 1: Buscando registros con 'Test'...\n";
    $testRecords = $mysqli->query("
        SELECT Id, Name 
        FROM document_type 
        WHERE Name LIKE '%Test%' OR Name LIKE '%test%' OR Name LIKE '%TEST%'
        ORDER BY Id
    ");
    
    $deletedIds = [];
    if ($testRecords && $testRecords->num_rows > 0) {
        echo "✅ Encontrados " . $testRecords->num_rows . " registros con 'Test'\n";
        while ($row = $testRecords->fetch_assoc()) {
            $deletedIds[] = $row['Id'];
            echo "   - ID {$row['Id']}: '{$row['Name']}'\n";
        }
        
        // Eliminar registros
        $idsStr = implode(',', $deletedIds);
        $deleteQuery = "DELETE FROM document_type WHERE Id IN ($idsStr)";
        if ($mysqli->query($deleteQuery)) {
            echo "✅ Eliminados " . count($deletedIds) . " registros\n\n";
        } else {
            throw new Exception("Error al eliminar registros: " . $mysqli->error);
        }
    } else {
        echo "⚠️  No se encontraron registros con 'Test'\n\n";
    }
    
    // Paso 2: Obtener todos los registros restantes ordenados alfabéticamente
    echo "📋 Paso 2: Obteniendo registros ordenados alfabéticamente...\n";
    $allRecords = $mysqli->query("
        SELECT Id, Name, IdSubProcess, IdProcessType, Required, ReqExpiration, 
               DocumentAutoUpload, AvailableToClient, Enabled, RegistrationDate, 
               UpdateDate, IdLastUserUpdate
        FROM document_type 
        ORDER BY Name ASC
    ");
    
    if (!$allRecords) {
        throw new Exception("Error al obtener registros: " . $mysqli->error);
    }
    
    $records = [];
    while ($row = $allRecords->fetch_assoc()) {
        $records[] = $row;
    }
    
    $totalRecords = count($records);
    echo "✅ Total de registros a reordenar: $totalRecords\n\n";
    
    // Paso 3: Crear tabla temporal con los nuevos IDs
    echo "📋 Paso 3: Creando tabla temporal para mapeo de IDs...\n";
    $mysqli->query("DROP TEMPORARY TABLE IF EXISTS temp_document_type_mapping");
    $mysqli->query("
        CREATE TEMPORARY TABLE temp_document_type_mapping (
            old_id BIGINT,
            new_id BIGINT,
            PRIMARY KEY (old_id)
        )
    ");
    
    // Insertar mapeo de IDs
    $newId = 1;
    $insertMapping = $mysqli->prepare("INSERT INTO temp_document_type_mapping (old_id, new_id) VALUES (?, ?)");
    foreach ($records as $record) {
        $insertMapping->bind_param("ii", $record['Id'], $newId);
        $insertMapping->execute();
        $newId++;
    }
    $insertMapping->close();
    echo "✅ Mapeo de IDs creado\n\n";
    
    // Paso 4: Actualizar foreign keys en otras tablas que referencian document_type
    echo "📋 Paso 4: Actualizando referencias en otras tablas...\n";
    
    // Buscar tablas que tienen foreign keys a document_type
    $fkTables = $mysqli->query("
        SELECT TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE REFERENCED_TABLE_SCHEMA = '{$db['database']}'
        AND REFERENCED_TABLE_NAME = 'document_type'
        AND REFERENCED_COLUMN_NAME = 'Id'
    ");
    
    $updatedRefs = 0;
    if ($fkTables && $fkTables->num_rows > 0) {
        while ($fk = $fkTables->fetch_assoc()) {
            $tableName = $fk['TABLE_NAME'];
            $columnName = $fk['COLUMN_NAME'];
            
            echo "   - Actualizando $tableName.$columnName...\n";
            
            // Actualizar referencias usando el mapeo
            $updateRefs = $mysqli->query("
                UPDATE $tableName t
                INNER JOIN temp_document_type_mapping m ON t.$columnName = m.old_id
                SET t.$columnName = m.new_id
            ");
            
            if ($updateRefs) {
                $updatedRefs += $mysqli->affected_rows;
            } else {
                echo "     ⚠️  Error al actualizar $tableName: " . $mysqli->error . "\n";
            }
        }
    }
    echo "✅ Referencias actualizadas: $updatedRefs\n\n";
    
    // Paso 5: Eliminar todos los registros y reinsertarlos con nuevos IDs
    echo "📋 Paso 5: Reinsertando registros con nuevos IDs...\n";
    
    // Eliminar todos los registros
    $mysqli->query("DELETE FROM document_type");
    
    // Reinsertar con nuevos IDs ordenados alfabéticamente
    $insertQuery = $mysqli->prepare("
        INSERT INTO document_type 
        (Id, Name, IdSubProcess, IdProcessType, Required, ReqExpiration, 
         DocumentAutoUpload, AvailableToClient, Enabled, RegistrationDate, 
         UpdateDate, IdLastUserUpdate)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $insertedCount = 0;
    foreach ($records as $record) {
        $newId = $insertedCount + 1;
        $insertQuery->bind_param(
            "isiiiiiiisss",
            $newId,
            $record['Name'],
            $record['IdSubProcess'],
            $record['IdProcessType'],
            $record['Required'],
            $record['ReqExpiration'],
            $record['DocumentAutoUpload'],
            $record['AvailableToClient'],
            $record['Enabled'],
            $record['RegistrationDate'],
            $record['UpdateDate'],
            $record['IdLastUserUpdate']
        );
        
        if ($insertQuery->execute()) {
            $insertedCount++;
        } else {
            throw new Exception("Error al insertar registro: " . $insertQuery->error);
        }
    }
    $insertQuery->close();
    
    echo "✅ Reinsertados $insertedCount registros\n\n";
    
    // Restaurar foreign key checks
    $mysqli->query("SET FOREIGN_KEY_CHECKS = 1");
    
    // Confirmar transacción
    $mysqli->commit();
    
    echo "📊 RESUMEN:\n";
    echo str_repeat("=", 80) . "\n";
    echo "✅ Registros eliminados (con 'Test'): " . count($deletedIds) . "\n";
    echo "✅ Registros reordenados: $insertedCount\n";
    echo "✅ Referencias actualizadas: $updatedRefs\n\n";
    
    // Mostrar primeros y últimos registros ordenados
    echo "📋 PRIMEROS 10 REGISTROS (ordenados alfabéticamente):\n";
    echo str_repeat("=", 80) . "\n";
    $firstRecords = $mysqli->query("SELECT Id, Name FROM document_type ORDER BY Name ASC LIMIT 10");
    if ($firstRecords && $firstRecords->num_rows > 0) {
        echo sprintf("%-5s %-60s\n", "ID", "Name");
        echo str_repeat("-", 65) . "\n";
        while ($row = $firstRecords->fetch_assoc()) {
            echo sprintf("%-5s %-60s\n", $row['Id'], $row['Name']);
        }
    }
    
    echo "\n📋 ÚLTIMOS 10 REGISTROS (ordenados alfabéticamente):\n";
    echo str_repeat("=", 80) . "\n";
    $lastRecords = $mysqli->query("SELECT Id, Name FROM document_type ORDER BY Name DESC LIMIT 10");
    if ($lastRecords && $lastRecords->num_rows > 0) {
        echo sprintf("%-5s %-60s\n", "ID", "Name");
        echo str_repeat("-", 65) . "\n";
        while ($row = $lastRecords->fetch_assoc()) {
            echo sprintf("%-5s %-60s\n", $row['Id'], $row['Name']);
        }
    }
    
    $mysqli->close();
    
    echo "\n✅ Proceso completado exitosamente\n";
    
} catch (Exception $e) {
    if (isset($mysqli)) {
        $mysqli->rollback();
        $mysqli->query("SET FOREIGN_KEY_CHECKS = 1");
    }
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
