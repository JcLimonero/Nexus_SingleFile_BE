<?php
/**
 * Estandarizar nombres de tablas a PascalCase
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== ESTANDARIZACIÓN DE NOMBRES DE TABLAS ===\n\n";

$configFile = __DIR__ . '/../../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

echo "Base de datos: {$db['database']}\n";
echo "Host: {$db['hostname']}\n\n";

// Mapeo de cambios: snake_case/lowercase → PascalCase
$renameMap = [
    // Relaciones
    'agency_user' => 'AgencyUser',
    'process_user' => 'ProcessUser',
    'client_total_relation' => 'ClientTotalRelation',
    
    // Configuración
    'configurationprocess' => 'ConfigurationProcess',
    'configurationprocess_documenttype' => 'ConfigurationProcessDocumentType',
    
    // Documentos
    'documentbyfile' => 'DocumentByFile',
    'documenttype' => 'DocumentType',
    'documentfile_status' => 'DocumentFileStatus',
    'documentfile_error' => 'DocumentFileError',
    
    // File
    'file_status' => 'FileStatus',
    'file_substatus' => 'FileSubStatus',
    'file_reasons' => 'FileReasons',
    'file_extraordinary_reasons' => 'FileExtraordinaryReasons',
    'file_sharetoken' => 'FileShareToken',
    'file_pld' => 'FilePld',
    'file_pld_geolog' => 'FilePldGeoLog',
    'file_pld_beneficiariofinal' => 'FilePldBeneficiarioFinal',
    
    // Cliente
    'client' => 'Client',
    'headerclient' => 'HeaderClient',
    
    // Proceso
    'process' => 'Process',
    'operationtype' => 'OperationType',
    
    // Agencia
    'agency' => 'Agency',
    
    // Compañía
    'company' => 'Company',
    
    // Orden
    'orderbycar' => 'OrderByCar',
    
    // Usuario
    'userrol' => 'UserRol',
    'user_refreshtoken' => 'UserRefreshToken',
    'user_activity_logs' => 'UserActivityLogs',
    
    // Sistema
    'migrations' => 'Migrations',
    'activitylog' => 'ActivityLog',
    
    // Expedientes
    'expedientes_corregir' => 'ExpedientesCorregir',
    
    // Vistas
    'view_all_relations' => 'ViewAllRelations',
    'view_client' => 'ViewClient',
    'view_client_company_amount' => 'ViewClientCompanyAmount',
    'view_client_relations' => 'ViewClientRelations',
    'view_document_name' => 'ViewDocumentName',
    'view_files' => 'ViewFiles',
    'view_files_by_client' => 'ViewFilesByClient',
];

echo "📋 Tablas a renombrar: " . count($renameMap) . "\n\n";

try {
    $mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);
    
    if ($mysqli->connect_error) {
        die("❌ Error de conexión: " . $mysqli->connect_error . "\n");
    }
    
    echo "✅ Conectado a la base de datos\n\n";
    
    $renamedCount = 0;
    $skippedCount = 0;
    $errorCount = 0;
    $errors = [];
    
    echo "🔄 Renombrando tablas...\n";
    echo str_repeat("-", 60) . "\n";
    
    foreach ($renameMap as $oldName => $newName) {
        // Verificar si la tabla existe
        $result = $mysqli->query("SHOW TABLES LIKE '$oldName'");
        
        if ($result && $result->num_rows > 0) {
            // Verificar si el nuevo nombre ya existe
            $checkNew = $mysqli->query("SHOW TABLES LIKE '$newName'");
            
            if ($checkNew && $checkNew->num_rows > 0) {
                echo "⚠️  $oldName → $newName (ya existe, saltando)\n";
                $skippedCount++;
            } else {
                echo "Renombrando: $oldName → $newName... ";
                
                if ($mysqli->query("RENAME TABLE `$oldName` TO `$newName`")) {
                    echo "✅\n";
                    $renamedCount++;
                } else {
                    echo "❌ Error: " . $mysqli->error . "\n";
                    $errors[] = "$oldName → $newName: " . $mysqli->error;
                    $errorCount++;
                }
            }
        } else {
            echo "⚠️  $oldName no existe (saltando)\n";
            $skippedCount++;
        }
    }
    
    echo "\n" . str_repeat("=", 60) . "\n";
    echo "📊 RESUMEN:\n";
    echo str_repeat("=", 60) . "\n";
    echo "✅ Tablas renombradas: $renamedCount\n";
    echo "⚠️  Saltadas: $skippedCount\n";
    echo "❌ Errores: $errorCount\n\n";
    
    if (!empty($errors)) {
        echo "⚠️  Errores encontrados:\n";
        foreach ($errors as $error) {
            echo "  - $error\n";
        }
        echo "\n";
    }
    
    // Verificar resultado final
    echo "🔍 Verificando nombres finales...\n";
    $result = $mysqli->query("SHOW TABLES");
    $finalTables = [];
    while ($row = $result->fetch_array()) {
        $finalTables[] = $row[0];
    }
    
    $nonStandard = [];
    foreach ($finalTables as $table) {
        // Verificar si está en PascalCase (empieza con mayúscula y no tiene guiones bajos en minúsculas)
        if (!preg_match('/^[A-Z][a-zA-Z0-9]*$/', $table) && strpos($table, '_') === false) {
            // Permitir algunas excepciones como vistas que empiezan con View
            if (strpos(strtolower($table), 'view') !== 0) {
                $nonStandard[] = $table;
            }
        }
    }
    
    if (empty($nonStandard)) {
        echo "✅ Todas las tablas están en PascalCase\n";
    } else {
        echo "⚠️  Tablas que aún no están en PascalCase:\n";
        foreach ($nonStandard as $table) {
            echo "  - $table\n";
        }
    }
    
    echo "\n📊 Total de tablas en BD: " . count($finalTables) . "\n";
    
    $mysqli->close();
    
    echo "\n✅ Proceso completado\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
