<?php
/**
 * Insertar sub-estados de archivo relacionados con Liberación
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== INSERTAR SUB-ESTADOS DE ARCHIVO ===\n\n";

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
    
    // Obtener el ID del estado "Liberación"
    $liberacionQuery = $mysqli->query("SELECT Id FROM file_status WHERE Name = 'Liberación'");
    $liberacion = $liberacionQuery->fetch_assoc();
    
    if (!$liberacion) {
        die("❌ No se encontró el estado 'Liberación' en file_status\n");
    }
    
    $idLiberacion = $liberacion['Id'];
    echo "📋 Estado 'Liberación' encontrado con ID: $idLiberacion\n\n";
    
    // Sub-estados a insertar
    $subStatuses = [
        'Placas',
        'Seguro',
        'Accesorio',
        'PDI',
        'Detallado',
        'Entrega Unidad'
    ];
    
    echo "📋 SUB-ESTADOS A INSERTAR:\n";
    echo str_repeat("=", 60) . "\n";
    foreach ($subStatuses as $index => $subStatus) {
        echo sprintf("%d. %s (IdFileStatus: %d)\n", $index + 1, $subStatus, $idLiberacion);
    }
    echo "\n";
    
    // Obtener el máximo ID actual
    $maxIdResult = $mysqli->query("SELECT MAX(Id) as max_id FROM file_sub_status");
    $maxIdRow = $maxIdResult->fetch_assoc();
    $nextId = ($maxIdRow['max_id'] ?? 0) + 1;
    
    echo "🔍 ID inicial para nuevos registros: $nextId\n\n";
    
    echo "🔄 Insertando sub-estados...\n";
    echo str_repeat("=", 60) . "\n";
    
    $insertedCount = 0;
    $skippedCount = 0;
    $errorCount = 0;
    
    foreach ($subStatuses as $subStatusName) {
        // Verificar si ya existe
        $checkQuery = $mysqli->prepare("SELECT Id FROM file_sub_status WHERE Name = ?");
        $checkQuery->bind_param("s", $subStatusName);
        $checkQuery->execute();
        $result = $checkQuery->get_result();
        $exists = $result->fetch_assoc();
        $checkQuery->close();
        
        if ($exists) {
            // Actualizar el IdFileStatus si existe pero no tiene relación
            $updateQuery = $mysqli->prepare("UPDATE file_sub_status SET IdFileStatus = ? WHERE Id = ?");
            $updateQuery->bind_param("ii", $idLiberacion, $exists['Id']);
            if ($updateQuery->execute()) {
                echo "✅ ID {$exists['Id']}: '$subStatusName' actualizado con IdFileStatus = $idLiberacion\n";
                $insertedCount++;
            } else {
                echo "⚠️  ID {$exists['Id']}: '$subStatusName' ya existe pero error al actualizar - " . $updateQuery->error . "\n";
                $skippedCount++;
            }
            $updateQuery->close();
            continue;
        }
        
        // Insertar nuevo sub-estado
        $insertQuery = $mysqli->prepare("
            INSERT INTO file_sub_status 
            (Id, IdFileStatus, Name, RegistrationDate, UpdateDate, Enabled) 
            VALUES (?, ?, ?, NOW(), NOW(), 1)
        ");
        $insertQuery->bind_param("iis", $nextId, $idLiberacion, $subStatusName);
        
        if ($insertQuery->execute()) {
            echo "✅ ID $nextId: '$subStatusName' insertado (IdFileStatus: $idLiberacion)\n";
            $insertedCount++;
            $nextId++;
        } else {
            echo "❌ Error insertando '$subStatusName': " . $insertQuery->error . "\n";
            $errorCount++;
        }
        $insertQuery->close();
    }
    
    echo "\n" . str_repeat("=", 60) . "\n";
    echo "📊 RESUMEN:\n";
    echo str_repeat("=", 60) . "\n";
    echo "✅ Insertados/Actualizados: $insertedCount\n";
    echo "⚠️  Omitidos: $skippedCount\n";
    echo "❌ Errores: $errorCount\n\n";
    
    // Mostrar todos los sub-estados relacionados con Liberación
    echo "📋 SUB-ESTADOS RELACIONADOS CON 'LIBERACIÓN':\n";
    echo str_repeat("=", 80) . "\n";
    $allSubStatuses = $mysqli->query("
        SELECT 
            fss.Id,
            fss.Name AS SubStatusName,
            fs.Name AS StatusName,
            fss.IdFileStatus,
            fss.Enabled
        FROM file_sub_status fss
        LEFT JOIN file_status fs ON fss.IdFileStatus = fs.Id
        WHERE fss.IdFileStatus = $idLiberacion
        ORDER BY fss.Id
    ");
    
    if ($allSubStatuses && $allSubStatuses->num_rows > 0) {
        echo sprintf("%-5s %-30s %-25s %-15s %-10s\n", "ID", "Sub-Estado", "Estado Principal", "IdFileStatus", "Enabled");
        echo str_repeat("-", 85) . "\n";
        while ($subStatus = $allSubStatuses->fetch_assoc()) {
            echo sprintf("%-5s %-30s %-25s %-15s %-10s\n", 
                $subStatus['Id'], 
                $subStatus['SubStatusName'],
                $subStatus['StatusName'],
                $subStatus['IdFileStatus'],
                $subStatus['Enabled']
            );
        }
    } else {
        echo "No hay sub-estados relacionados con Liberación\n";
    }
    
    $mysqli->close();
    
    echo "\n✅ Proceso completado\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
