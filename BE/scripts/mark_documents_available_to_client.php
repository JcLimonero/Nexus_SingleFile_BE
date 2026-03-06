<?php
/**
 * Marcar documentos como disponibles para cliente (AvailableToClient = 1)
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== MARCAR DOCUMENTOS DISPONIBLES PARA CLIENTE ===\n\n";

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
    
    // Documentos a marcar como disponibles para cliente
    $documentsToMark = [
        'Identificacion Oficial',
        'CURP',
        'RFC',
        'Constancia de Situación Fiscal',
        'Comprobante de Domicilio',
        'Formato de Uso de CFDI',
        'Acta Constitutiva',
        'Poder de Representante Legal',
        'Identificacion Oficial Apoderado',
        'Beneficiario Controlador',
        'Carta Compromiso de Pago',
        'Factura Original Endosada',
        'Refrendos Consecutivos Ultimos 5 Años', // Posiblemente "Refrendos Pagados"
        'Constancia de Verificacion Vehicular'
    ];
    
    echo "📋 DOCUMENTOS A MARCAR COMO DISPONIBLES PARA CLIENTE:\n";
    echo str_repeat("=", 80) . "\n";
    foreach ($documentsToMark as $index => $doc) {
        echo sprintf("%d. %s\n", $index + 1, $doc);
    }
    echo "\n";
    
    // Paso 1: Identificar los documentos en la base de datos
    echo "🔍 Identificando documentos en la base de datos...\n";
    echo str_repeat("=", 80) . "\n";
    
    $foundDocuments = [];
    $notFoundDocuments = [];
    
    foreach ($documentsToMark as $docName) {
        // Buscar coincidencia exacta o similar
        $stmt = $mysqli->prepare("SELECT Id, Name, AvailableToClient FROM document_type WHERE Name = ?");
        $stmt->bind_param("s", $docName);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $doc = $result->fetch_assoc();
            $foundDocuments[] = [
                'Id' => $doc['Id'],
                'Name' => $doc['Name'],
                'CurrentValue' => $doc['AvailableToClient']
            ];
            echo "✅ Encontrado: ID {$doc['Id']} - '{$doc['Name']}' (Actual: {$doc['AvailableToClient']})\n";
        } else {
            // Intentar búsqueda parcial
            $likeName = "%$docName%";
            $stmt2 = $mysqli->prepare("SELECT Id, Name, AvailableToClient FROM document_type WHERE Name LIKE ?");
            $stmt2->bind_param("s", $likeName);
            $stmt2->execute();
            $result2 = $stmt2->get_result();
            
            if ($result2->num_rows > 0) {
                $doc = $result2->fetch_assoc();
                $foundDocuments[] = [
                    'Id' => $doc['Id'],
                    'Name' => $doc['Name'],
                    'CurrentValue' => $doc['AvailableToClient']
                ];
                echo "✅ Encontrado (parcial): ID {$doc['Id']} - '{$doc['Name']}' (Actual: {$doc['AvailableToClient']})\n";
            } else {
                $notFoundDocuments[] = $docName;
                echo "⚠️  No encontrado: '$docName'\n";
            }
            $stmt2->close();
        }
        $stmt->close();
    }
    
    echo "\n";
    echo "📊 RESUMEN DE BÚSQUEDA:\n";
    echo "  ✅ Encontrados: " . count($foundDocuments) . "\n";
    echo "  ⚠️  No encontrados: " . count($notFoundDocuments) . "\n";
    
    if (!empty($notFoundDocuments)) {
        echo "\n⚠️  DOCUMENTOS NO ENCONTRADOS:\n";
        foreach ($notFoundDocuments as $doc) {
            echo "   - $doc\n";
        }
        echo "\n💡 Verificando nombres similares...\n";
        
        // Mostrar todos los documentos disponibles para ayudar a identificar
        $allDocs = $mysqli->query("SELECT Id, Name FROM document_type ORDER BY Name");
        echo "\n📋 DOCUMENTOS DISPONIBLES EN LA BASE DE DATOS:\n";
        echo str_repeat("-", 80) . "\n";
        while ($doc = $allDocs->fetch_assoc()) {
            echo sprintf("ID %3d: %s\n", $doc['Id'], $doc['Name']);
        }
    }
    
    if (empty($foundDocuments)) {
        echo "\n⚠️  No se encontraron documentos para actualizar\n";
        $mysqli->close();
        exit(0);
    }
    
    // Paso 2: Actualizar AvailableToClient = 1
    echo "\n🔄 Actualizando AvailableToClient = 1...\n";
    echo str_repeat("=", 80) . "\n";
    
    $updatedCount = 0;
    $alreadySetCount = 0;
    $errorCount = 0;
    
    foreach ($foundDocuments as $doc) {
        // Solo actualizar si no está ya en 1
        if ($doc['CurrentValue'] == 1) {
            echo "⏭️  ID {$doc['Id']}: '{$doc['Name']}' ya está marcado (AvailableToClient = 1)\n";
            $alreadySetCount++;
            continue;
        }
        
        $updateStmt = $mysqli->prepare("
            UPDATE document_type 
            SET AvailableToClient = 1, UpdateDate = NOW() 
            WHERE Id = ?
        ");
        $updateStmt->bind_param("i", $doc['Id']);
        
        if ($updateStmt->execute()) {
            echo "✅ ID {$doc['Id']}: '{$doc['Name']}' marcado como disponible para cliente\n";
            $updatedCount++;
        } else {
            echo "❌ ID {$doc['Id']}: Error - " . $updateStmt->error . "\n";
            $errorCount++;
        }
        $updateStmt->close();
    }
    
    echo "\n" . str_repeat("=", 80) . "\n";
    echo "📊 RESUMEN:\n";
    echo str_repeat("=", 80) . "\n";
    echo "✅ Actualizados: $updatedCount\n";
    echo "⏭️  Ya estaban marcados: $alreadySetCount\n";
    echo "❌ Errores: $errorCount\n";
    echo "📋 Total procesados: " . ($updatedCount + $alreadySetCount + $errorCount) . "\n\n";
    
    // Paso 3: Mostrar documentos marcados como disponibles para cliente
    echo "📋 DOCUMENTOS MARCADOS COMO DISPONIBLES PARA CLIENTE:\n";
    echo str_repeat("=", 80) . "\n";
    $availableDocs = $mysqli->query("
        SELECT Id, Name, AvailableToClient 
        FROM document_type 
        WHERE AvailableToClient = 1 
        ORDER BY Name
    ");
    
    if ($availableDocs && $availableDocs->num_rows > 0) {
        echo sprintf("%-5s %-60s %-10s\n", "ID", "Nombre", "Disponible");
        echo str_repeat("-", 75) . "\n";
        while ($doc = $availableDocs->fetch_assoc()) {
            echo sprintf("%-5s %-60s %-10s\n",
                $doc['Id'],
                $doc['Name'],
                $doc['AvailableToClient'] ? 'Sí' : 'No'
            );
        }
        echo "\n📊 Total de documentos disponibles para cliente: " . $availableDocs->num_rows . "\n";
    }
    
    $mysqli->close();
    
    echo "\n✅ Proceso completado\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
