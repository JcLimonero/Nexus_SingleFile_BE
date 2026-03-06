<?php
/**
 * Copiar datos de documenttype (single_file) a document_type (nexfile)
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== COPIAR DATOS DE DOCUMENTTYPE ===\n\n";

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

echo "Base de datos origen: single_file\n";
echo "Base de datos destino: nexfile\n";
echo "Host: {$db['hostname']}\n\n";

try {
    $mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], '', $db['port']);
    
    if ($mysqli->connect_error) {
        die("❌ Error de conexión: " . $mysqli->connect_error . "\n");
    }
    
    echo "✅ Conectado al servidor\n\n";
    
    // Seleccionar base de datos origen
    $mysqli->select_db('single_file');
    
    // Obtener todos los registros de documenttype
    echo "📋 Obteniendo registros de 'documenttype'...\n";
    $sourceRecords = $mysqli->query("SELECT * FROM documenttype ORDER BY Id");
    
    if (!$sourceRecords) {
        die("❌ Error al obtener registros: " . $mysqli->error . "\n");
    }
    
    $totalRecords = $sourceRecords->num_rows;
    echo "✅ Encontrados $totalRecords registros\n\n";
    
    if ($totalRecords == 0) {
        echo "⚠️  No hay registros para copiar\n";
        $mysqli->close();
        exit(0);
    }
    
    // Seleccionar base de datos destino
    $mysqli->select_db('nexfile');
    
    echo "🔄 Copiando registros a 'document_type'...\n";
    echo str_repeat("=", 80) . "\n";
    
    $insertedCount = 0;
    $updatedCount = 0;
    $skippedCount = 0;
    $errorCount = 0;
    
    // Valor máximo para considerar IdSubProcess como inválido (poner en 0)
    $maxValidSubProcess = 1000000; // Ajustar según necesidad
    
    while ($row = $sourceRecords->fetch_assoc()) {
        // Normalizar IdSubProcess: si es NULL, muy grande o inválido, poner en 0
        $idSubProcess = $row['IdSubProcess'];
        if ($idSubProcess === null || 
            $idSubProcess === '' || 
            $idSubProcess > $maxValidSubProcess ||
            $idSubProcess < 0) {
            $idSubProcess = 0;
        }
        
        // Verificar si el registro ya existe por ID
        $checkQuery = $mysqli->prepare("SELECT Id FROM document_type WHERE Id = ?");
        $checkQuery->bind_param("i", $row['Id']);
        $checkQuery->execute();
        $exists = $checkQuery->get_result()->fetch_assoc();
        $checkQuery->close();
        
        if ($exists) {
            // Actualizar registro existente
            $updateQuery = $mysqli->prepare("
                UPDATE document_type SET
                    Name = ?,
                    RegistrationDate = ?,
                    UpdateDate = ?,
                    Enabled = ?,
                    IdLastUserUpdate = ?,
                    ReqExpiration = ?,
                    IdProcessType = ?,
                    Required = ?,
                    IdSubProcess = ?,
                    DocumentAutoUpload = ?,
                    AvailableToClient = ?
                WHERE Id = ?
            ");
            
            $updateQuery->bind_param(
                "sssiiiiiiiii",
                $row['Name'],
                $row['RegistrationDate'],
                $row['UpdateDate'],
                $row['Enabled'],
                $row['IdLastUserUpdate'],
                $row['ReqExpiration'],
                $row['IdProcessType'],
                $row['Required'],
                $idSubProcess,
                $row['DocumentAutoUpload'],
                $row['AvailableToClient'],
                $row['Id']
            );
            
            if ($updateQuery->execute()) {
                echo "🔄 ID {$row['Id']}: '{$row['Name']}' actualizado (IdSubProcess: $idSubProcess)\n";
                $updatedCount++;
            } else {
                echo "❌ ID {$row['Id']}: Error al actualizar - " . $updateQuery->error . "\n";
                $errorCount++;
            }
            $updateQuery->close();
        } else {
            // Insertar nuevo registro
            $insertQuery = $mysqli->prepare("
                INSERT INTO document_type (
                    Id, Name, RegistrationDate, UpdateDate, Enabled, 
                    IdLastUserUpdate, ReqExpiration, IdProcessType, 
                    Required, IdSubProcess, DocumentAutoUpload, AvailableToClient
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            
            $insertQuery->bind_param(
                "isssiiiiiiii",
                $row['Id'],
                $row['Name'],
                $row['RegistrationDate'],
                $row['UpdateDate'],
                $row['Enabled'],
                $row['IdLastUserUpdate'],
                $row['ReqExpiration'],
                $row['IdProcessType'],
                $row['Required'],
                $idSubProcess,
                $row['DocumentAutoUpload'],
                $row['AvailableToClient']
            );
            
            if ($insertQuery->execute()) {
                echo "✅ ID {$row['Id']}: '{$row['Name']}' insertado (IdSubProcess: $idSubProcess)\n";
                $insertedCount++;
            } else {
                // Si falla por nombre duplicado, intentar actualizar
                if (strpos($insertQuery->error, 'Duplicate entry') !== false && 
                    strpos($insertQuery->error, 'Name') !== false) {
                    echo "⚠️  ID {$row['Id']}: '{$row['Name']}' ya existe por nombre - Saltando\n";
                    $skippedCount++;
                } else {
                    echo "❌ ID {$row['Id']}: Error al insertar - " . $insertQuery->error . "\n";
                    $errorCount++;
                }
            }
            $insertQuery->close();
        }
    }
    
    echo "\n" . str_repeat("=", 80) . "\n";
    echo "📊 RESUMEN:\n";
    echo str_repeat("=", 80) . "\n";
    echo "✅ Insertados: $insertedCount\n";
    echo "🔄 Actualizados: $updatedCount\n";
    echo "⚠️  Omitidos: $skippedCount\n";
    echo "❌ Errores: $errorCount\n";
    echo "📋 Total procesados: " . ($insertedCount + $updatedCount + $skippedCount + $errorCount) . "\n\n";
    
    // Verificar resultado final
    $finalCount = $mysqli->query("SELECT COUNT(*) as total FROM document_type")->fetch_assoc();
    echo "📊 Total de registros en 'document_type' después de la copia: {$finalCount['total']}\n\n";
    
    // Mostrar algunos registros con IdSubProcess normalizado
    echo "📋 EJEMPLOS DE REGISTROS COPIADOS (con IdSubProcess normalizado):\n";
    echo str_repeat("=", 80) . "\n";
    $samples = $mysqli->query("
        SELECT Id, Name, IdProcessType, IdSubProcess, Enabled 
        FROM document_type 
        WHERE IdSubProcess > 0 
        LIMIT 5
    ");
    
    if ($samples && $samples->num_rows > 0) {
        echo sprintf("%-5s %-40s %-15s %-15s %-10s\n", "ID", "Nombre", "IdProcessType", "IdSubProcess", "Enabled");
        echo str_repeat("-", 85) . "\n";
        while ($sample = $samples->fetch_assoc()) {
            echo sprintf("%-5s %-40s %-15s %-15s %-10s\n",
                $sample['Id'],
                substr($sample['Name'], 0, 38),
                $sample['IdProcessType'],
                $sample['IdSubProcess'],
                $sample['Enabled']
            );
        }
    }
    
    echo "\n";
    
    // Mostrar registros con IdSubProcess = 0
    $zeroSubProcess = $mysqli->query("SELECT COUNT(*) as total FROM document_type WHERE IdSubProcess = 0")->fetch_assoc();
    echo "📊 Registros con IdSubProcess = 0: {$zeroSubProcess['total']}\n";
    
    $mysqli->close();
    
    echo "\n✅ Proceso completado\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
