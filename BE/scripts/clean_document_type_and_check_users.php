<?php
/**
 * Eliminar registros con IdProcessType = -1 y revisar IdLastUserUpdate
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== LIMPIAR DOCUMENT_TYPE Y REVISAR USUARIOS ===\n\n";

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
    
    // Paso 1: Identificar registros con IdProcessType = -1
    echo "🔍 PASO 1: Identificando registros con IdProcessType = -1...\n";
    echo str_repeat("=", 80) . "\n";
    
    $recordsToDelete = $mysqli->query("
        SELECT Id, Name, IdProcessType, IdLastUserUpdate 
        FROM document_type 
        WHERE IdProcessType = -1
        ORDER BY Id
    ");
    
    $idsToDelete = [];
    if ($recordsToDelete && $recordsToDelete->num_rows > 0) {
        echo sprintf("%-5s %-50s %-15s %-15s\n", "ID", "Nombre", "IdProcessType", "IdLastUserUpdate");
        echo str_repeat("-", 85) . "\n";
        while ($row = $recordsToDelete->fetch_assoc()) {
            $idsToDelete[] = $row['Id'];
            echo sprintf("%-5s %-50s %-15s %-15s\n",
                $row['Id'],
                substr($row['Name'], 0, 48),
                $row['IdProcessType'],
                $row['IdLastUserUpdate'] ?? 'NULL'
            );
        }
        echo "\n✅ Encontrados " . count($idsToDelete) . " registros con IdProcessType = -1\n\n";
    } else {
        echo "✅ No se encontraron registros con IdProcessType = -1\n\n";
    }
    
    // Paso 2: Eliminar registros con IdProcessType = -1
    if (!empty($idsToDelete)) {
        echo "🗑️  PASO 2: Eliminando registros con IdProcessType = -1...\n";
        echo str_repeat("=", 80) . "\n";
        
        $placeholders = str_repeat('?,', count($idsToDelete) - 1) . '?';
        $deleteStmt = $mysqli->prepare("DELETE FROM document_type WHERE Id IN ($placeholders)");
        $deleteStmt->bind_param(str_repeat('i', count($idsToDelete)), ...$idsToDelete);
        
        if ($deleteStmt->execute()) {
            $deletedCount = $deleteStmt->affected_rows;
            echo "✅ Eliminados $deletedCount registros\n\n";
        } else {
            echo "❌ Error al eliminar: " . $deleteStmt->error . "\n\n";
        }
        $deleteStmt->close();
    }
    
    // Paso 3: Obtener todos los IDs de usuarios existentes
    echo "🔍 PASO 3: Obteniendo IDs de usuarios existentes...\n";
    $userIds = $mysqli->query("SELECT Id FROM user ORDER BY Id");
    $validUserIds = [];
    while ($user = $userIds->fetch_assoc()) {
        $validUserIds[] = $user['Id'];
    }
    echo "✅ Encontrados " . count($validUserIds) . " usuarios válidos\n";
    echo "   IDs válidos: " . implode(', ', array_slice($validUserIds, 0, 20)) . 
         (count($validUserIds) > 20 ? '...' : '') . "\n\n";
    
    // Paso 4: Identificar registros con IdLastUserUpdate inválido
    echo "🔍 PASO 4: Identificando registros con IdLastUserUpdate inválido...\n";
    echo str_repeat("=", 80) . "\n";
    
    $allRecords = $mysqli->query("
        SELECT Id, Name, IdLastUserUpdate 
        FROM document_type 
        ORDER BY Id
    ");
    
    $invalidRecords = [];
    $nullRecords = [];
    
    while ($record = $allRecords->fetch_assoc()) {
        $idLastUserUpdate = $record['IdLastUserUpdate'];
        
        // Verificar si es NULL o 0 (0 es válido como "sin usuario")
        if ($idLastUserUpdate === null || $idLastUserUpdate == 0) {
            $nullRecords[] = $record;
            continue;
        }
        
        // Verificar si el ID existe en la tabla user
        if (!in_array($idLastUserUpdate, $validUserIds)) {
            $invalidRecords[] = $record;
        }
    }
    
    if (!empty($invalidRecords)) {
        echo "⚠️  Encontrados " . count($invalidRecords) . " registros con IdLastUserUpdate inválido:\n\n";
        echo sprintf("%-5s %-50s %-20s\n", "ID", "Nombre", "IdLastUserUpdate");
        echo str_repeat("-", 75) . "\n";
        foreach ($invalidRecords as $record) {
            echo sprintf("%-5s %-50s %-20s\n",
                $record['Id'],
                substr($record['Name'], 0, 48),
                $record['IdLastUserUpdate']
            );
        }
        echo "\n";
    } else {
        echo "✅ No se encontraron registros con IdLastUserUpdate inválido\n\n";
    }
    
    if (!empty($nullRecords)) {
        echo "ℹ️  Encontrados " . count($nullRecords) . " registros con IdLastUserUpdate NULL o 0 (válidos)\n\n";
    }
    
    // Paso 5: Corregir IdLastUserUpdate inválidos
    if (!empty($invalidRecords)) {
        echo "🔧 PASO 5: Corrigiendo IdLastUserUpdate inválidos...\n";
        echo str_repeat("=", 80) . "\n";
        
        $mysqli->begin_transaction();
        
        try {
            $correctedCount = 0;
            $errorCount = 0;
            
            foreach ($invalidRecords as $record) {
                // Poner IdLastUserUpdate en 0 (sin usuario asignado)
                $updateStmt = $mysqli->prepare("
                    UPDATE document_type 
                    SET IdLastUserUpdate = 0, UpdateDate = NOW() 
                    WHERE Id = ?
                ");
                $updateStmt->bind_param("i", $record['Id']);
                
                if ($updateStmt->execute()) {
                    echo "✅ ID {$record['Id']}: '{$record['Name']}' - IdLastUserUpdate {$record['IdLastUserUpdate']} → 0\n";
                    $correctedCount++;
                } else {
                    echo "❌ ID {$record['Id']}: Error - " . $updateStmt->error . "\n";
                    $errorCount++;
                }
                $updateStmt->close();
            }
            
            $mysqli->commit();
            
            echo "\n" . str_repeat("=", 80) . "\n";
            echo "📊 RESUMEN DE CORRECCIÓN:\n";
            echo str_repeat("=", 80) . "\n";
            echo "✅ Corregidos: $correctedCount\n";
            echo "❌ Errores: $errorCount\n\n";
            
        } catch (Exception $e) {
            $mysqli->rollback();
            throw $e;
        }
    }
    
    // Paso 6: Reindexar IDs si se eliminaron registros
    if (!empty($idsToDelete)) {
        echo "🔄 PASO 6: Reindexando IDs...\n";
        echo str_repeat("=", 80) . "\n";
        
        $remainingRecords = $mysqli->query("SELECT Id, Name FROM document_type ORDER BY Id");
        $remaining = [];
        while ($row = $remainingRecords->fetch_assoc()) {
            $remaining[] = $row;
        }
        
        $mysqli->begin_transaction();
        
        try {
            $newId = 1;
            $reindexedCount = 0;
            
            foreach ($remaining as $record) {
                $oldId = $record['Id'];
                
                if ($oldId != $newId) {
                    $updateStmt = $mysqli->prepare("UPDATE document_type SET Id = ? WHERE Id = ?");
                    $updateStmt->bind_param("ii", $newId, $oldId);
                    
                    if ($updateStmt->execute()) {
                        echo "✅ ID $oldId → $newId: {$record['Name']}\n";
                        $reindexedCount++;
                    } else {
                        throw new Exception("Error al actualizar ID $oldId: " . $updateStmt->error);
                    }
                    $updateStmt->close();
                }
                
                $newId++;
            }
            
            // Reiniciar AUTO_INCREMENT
            $maxId = $mysqli->query("SELECT MAX(Id) as max_id FROM document_type")->fetch_assoc()['max_id'];
            $nextId = ($maxId ?? 0) + 1;
            $mysqli->query("ALTER TABLE document_type AUTO_INCREMENT = $nextId");
            
            $mysqli->commit();
            
            echo "\n✅ Reindexación completada: $reindexedCount IDs reasignados\n";
            echo "🔢 Próximo ID disponible: $nextId\n\n";
            
        } catch (Exception $e) {
            $mysqli->rollback();
            throw $e;
        }
    }
    
    // Resumen final
    echo str_repeat("=", 80) . "\n";
    echo "📊 RESUMEN FINAL:\n";
    echo str_repeat("=", 80) . "\n";
    
    $finalCount = $mysqli->query("SELECT COUNT(*) as total FROM document_type")->fetch_assoc();
    echo "📋 Total de registros en document_type: {$finalCount['total']}\n";
    
    $invalidCount = $mysqli->query("
        SELECT COUNT(*) as total 
        FROM document_type dt
        LEFT JOIN user u ON dt.IdLastUserUpdate = u.Id
        WHERE dt.IdLastUserUpdate IS NOT NULL 
        AND dt.IdLastUserUpdate != 0
        AND u.Id IS NULL
    ")->fetch_assoc();
    
    echo "✅ Registros con IdLastUserUpdate válido: " . 
         ($finalCount['total'] - ($invalidCount['total'] ?? 0)) . "\n";
    
    if (($invalidCount['total'] ?? 0) > 0) {
        echo "⚠️  Registros con IdLastUserUpdate inválido: {$invalidCount['total']}\n";
    } else {
        echo "✅ Todos los IdLastUserUpdate son válidos\n";
    }
    
    $mysqli->close();
    
    echo "\n✅ Proceso completado\n";
    
} catch (Exception $e) {
    if (isset($mysqli)) {
        if ($mysqli->in_transaction) {
            $mysqli->rollback();
        }
    }
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
