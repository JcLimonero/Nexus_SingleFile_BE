<?php
/**
 * Eliminar registros específicos de document_type y reiniciar índices
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== ELIMINAR REGISTROS Y REINICIAR ÍNDICES ===\n\n";

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
    
    // Nombres de registros a eliminar
    $namesToDelete = [
        'Anexo 3 Solicitud de Expedicion de CFDI',
        'Recibos de Pago (deloitte)',
        'Pdi2',
        'Doctos_salida',
        'REPUVE 2',
        'Lista Negra 1',
        'Lista Negra KIA',
        'Factura KIA',
        'Ley Antilavado KIA',
        'PROFECO KIA',
        'Recibos de Pago KIA',
        'Factura 2',
        'Uso de CFDI 1'
    ];
    
    echo "📋 REGISTROS A ELIMINAR:\n";
    echo str_repeat("=", 80) . "\n";
    foreach ($namesToDelete as $index => $name) {
        echo sprintf("%d. %s\n", $index + 1, $name);
    }
    echo "\n";
    
    // Paso 1: Identificar IDs de los registros a eliminar
    echo "🔍 Identificando IDs de registros a eliminar...\n";
    $idsToDelete = [];
    $placeholders = str_repeat('?,', count($namesToDelete) - 1) . '?';
    $stmt = $mysqli->prepare("SELECT Id, Name FROM document_type WHERE Name IN ($placeholders)");
    $stmt->bind_param(str_repeat('s', count($namesToDelete)), ...$namesToDelete);
    $stmt->execute();
    $result = $stmt->get_result();
    
    while ($row = $result->fetch_assoc()) {
        $idsToDelete[] = $row['Id'];
        echo "  - ID {$row['Id']}: {$row['Name']}\n";
    }
    $stmt->close();
    
    if (empty($idsToDelete)) {
        echo "⚠️  No se encontraron registros para eliminar\n";
        $mysqli->close();
        exit(0);
    }
    
    echo "\n✅ Encontrados " . count($idsToDelete) . " registros para eliminar\n\n";
    
    // Paso 2: Deshabilitar foreign key checks temporalmente
    echo "🔧 Deshabilitando verificaciones de foreign keys...\n";
    $mysqli->query("SET FOREIGN_KEY_CHECKS = 0");
    
    // Paso 3: Eliminar los registros
    echo "\n🗑️  Eliminando registros...\n";
    echo str_repeat("=", 80) . "\n";
    
    $deletedCount = 0;
    $deletePlaceholders = str_repeat('?,', count($idsToDelete) - 1) . '?';
    $deleteStmt = $mysqli->prepare("DELETE FROM document_type WHERE Id IN ($deletePlaceholders)");
    $deleteStmt->bind_param(str_repeat('i', count($idsToDelete)), ...$idsToDelete);
    
    if ($deleteStmt->execute()) {
        $deletedCount = $deleteStmt->affected_rows;
        echo "✅ Eliminados $deletedCount registros\n";
    } else {
        echo "❌ Error al eliminar: " . $deleteStmt->error . "\n";
    }
    $deleteStmt->close();
    
    // Paso 4: Obtener todos los registros restantes ordenados por ID actual
    echo "\n📋 Obteniendo registros restantes...\n";
    $remainingRecords = $mysqli->query("SELECT Id, Name FROM document_type ORDER BY Id");
    $remaining = [];
    while ($row = $remainingRecords->fetch_assoc()) {
        $remaining[] = $row;
    }
    
    echo "✅ Encontrados " . count($remaining) . " registros restantes\n\n";
    
    // Paso 5: Reasignar IDs de forma consecutiva
    echo "🔄 Reasignando IDs de forma consecutiva...\n";
    echo str_repeat("=", 80) . "\n";
    
    $mysqli->begin_transaction();
    
    try {
        $newId = 1;
        $reindexedCount = 0;
        
        foreach ($remaining as $record) {
            $oldId = $record['Id'];
            
            if ($oldId != $newId) {
                // Actualizar el ID
                $updateStmt = $mysqli->prepare("UPDATE document_type SET Id = ? WHERE Id = ?");
                $updateStmt->bind_param("ii", $newId, $oldId);
                
                if ($updateStmt->execute()) {
                    echo "✅ ID $oldId → $newId: {$record['Name']}\n";
                    $reindexedCount++;
                } else {
                    throw new Exception("Error al actualizar ID $oldId: " . $updateStmt->error);
                }
                $updateStmt->close();
            } else {
                echo "⏭️  ID $oldId: Sin cambios - {$record['Name']}\n";
            }
            
            $newId++;
        }
        
        // Reiniciar el AUTO_INCREMENT
        $maxId = $mysqli->query("SELECT MAX(Id) as max_id FROM document_type")->fetch_assoc()['max_id'];
        $nextId = ($maxId ?? 0) + 1;
        $mysqli->query("ALTER TABLE document_type AUTO_INCREMENT = $nextId");
        
        $mysqli->commit();
        
        echo "\n" . str_repeat("=", 80) . "\n";
        echo "📊 RESUMEN:\n";
        echo str_repeat("=", 80) . "\n";
        echo "🗑️  Registros eliminados: $deletedCount\n";
        echo "🔄 IDs reasignados: $reindexedCount\n";
        echo "📋 Total de registros restantes: " . count($remaining) . "\n";
        echo "🔢 Próximo ID disponible: $nextId\n\n";
        
    } catch (Exception $e) {
        $mysqli->rollback();
        throw $e;
    }
    
    // Rehabilitar foreign key checks
    $mysqli->query("SET FOREIGN_KEY_CHECKS = 1");
    
    // Mostrar algunos registros finales
    echo "📋 PRIMEROS 20 REGISTROS DESPUÉS DE REINDEXACIÓN:\n";
    echo str_repeat("=", 80) . "\n";
    $finalRecords = $mysqli->query("SELECT Id, Name FROM document_type ORDER BY Id LIMIT 20");
    if ($finalRecords && $finalRecords->num_rows > 0) {
        echo sprintf("%-5s %-60s\n", "ID", "Nombre");
        echo str_repeat("-", 65) . "\n";
        while ($record = $finalRecords->fetch_assoc()) {
            echo sprintf("%-5s %-60s\n", $record['Id'], $record['Name']);
        }
    }
    
    // Verificar que los IDs son consecutivos
    echo "\n🔍 Verificando consecutividad de IDs...\n";
    $checkQuery = $mysqli->query("
        SELECT 
            MIN(Id) as min_id,
            MAX(Id) as max_id,
            COUNT(*) as total,
            MAX(Id) - MIN(Id) + 1 as expected_count
        FROM document_type
    ");
    $check = $checkQuery->fetch_assoc();
    
    if ($check['total'] == $check['expected_count']) {
        echo "✅ Los IDs son consecutivos (desde {$check['min_id']} hasta {$check['max_id']})\n";
    } else {
        echo "⚠️  Los IDs NO son completamente consecutivos\n";
        echo "   Total: {$check['total']}, Esperado: {$check['expected_count']}\n";
    }
    
    $mysqli->close();
    
    echo "\n✅ Proceso completado\n";
    
} catch (Exception $e) {
    if (isset($mysqli)) {
        $mysqli->query("SET FOREIGN_KEY_CHECKS = 1");
        if ($mysqli->in_transaction) {
            $mysqli->rollback();
        }
    }
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
