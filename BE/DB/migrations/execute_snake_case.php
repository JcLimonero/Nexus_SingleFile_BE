<?php
/**
 * Convertir nombres de tablas a snake_case
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== CONVERSIÓN DE TABLAS A SNAKE_CASE ===\n\n";

$configFile = __DIR__ . '/../../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

echo "Base de datos: {$db['database']}\n";
echo "Host: {$db['hostname']}\n\n";

// Mapeo de cambios
$renameMap = [
    // Tablas principales
    'activitylog' => 'activity_log',
    'agencyuser' => 'agency_user',
    'clienttotalrelation' => 'client_total_relation',
    'configurationprocess' => 'configuration_process',
    'configurationprocessdocumenttype' => 'configuration_process_document_type',
    'customertype' => 'customer_type',
    'documentbyfile' => 'document_by_file',
    'documentfileerror' => 'document_file_error',
    'documentfilestatus' => 'document_file_status',
    'documenttype' => 'document_type',
    'expedientescorregir' => 'expedientes_corregir',
    'fileextraordinaryreasons' => 'file_extraordinary_reasons',
    'filepld' => 'file_pld',
    'filepldbeneficiariofinal' => 'file_pld_beneficiario_final',
    'filepldgeolog' => 'file_pld_geo_log',
    'filereasons' => 'file_reasons',
    'filesharetoken' => 'file_share_token',
    'filestatus' => 'file_status',
    'filesubstatus' => 'file_sub_status',
    'headerclient' => 'header_client',
    'operationtype' => 'operation_type',
    'orderbycar' => 'order_by_car',
    'processuser' => 'process_user',
    'useractivitylogs' => 'user_activity_logs',
    'userrefreshtoken' => 'user_refresh_token',
    'userrol' => 'user_rol',
    
    // Vistas
    'viewallrelations' => 'view_all_relations',
    'viewclient' => 'view_client',
    'viewclientcompanyamount' => 'view_client_company_amount',
    'viewclientrelations' => 'view_client_relations',
    'viewdocumentname' => 'view_document_name',
    'viewfiles' => 'view_files',
    'viewfilesbyclient' => 'view_files_by_client',
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
    
    $mysqli->close();
    
    echo "✅ Proceso completado\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
