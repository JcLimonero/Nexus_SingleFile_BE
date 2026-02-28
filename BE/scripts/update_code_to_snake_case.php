<?php
/**
 * Actualizar código para usar nombres de tablas en snake_case
 */

echo "=== ACTUALIZACIÓN DE CÓDIGO A SNAKE_CASE ===\n\n";

// Mapeo de nombres antiguos (PascalCase) a nuevos (snake_case)
$nameMapping = [
    // Tablas principales
    'ActivityLog' => 'activity_log',
    'AgencyUser' => 'agency_user',
    'ClientTotalRelation' => 'client_total_relation',
    'ConfigurationProcess' => 'configuration_process',
    'ConfigurationProcessDocumentType' => 'configuration_process_document_type',
    'CustomerType' => 'customer_type',
    'DocumentByFile' => 'document_by_file',
    'DocumentFileError' => 'document_file_error',
    'DocumentFileStatus' => 'document_file_status',
    'DocumentType' => 'document_type',
    'ExpedientesCorregir' => 'expedientes_corregir',
    'FileExtraordinaryReasons' => 'file_extraordinary_reasons',
    'FilePld' => 'file_pld',
    'FilePldBeneficiarioFinal' => 'file_pld_beneficiario_final',
    'FilePldGeoLog' => 'file_pld_geo_log',
    'FileReasons' => 'file_reasons',
    'FileShareToken' => 'file_share_token',
    'FileStatus' => 'file_status',
    'FileSubStatus' => 'file_sub_status',
    'HeaderClient' => 'header_client',
    'OperationType' => 'operation_type',
    'OrderByCar' => 'order_by_car',
    'ProcessUser' => 'process_user',
    'UserActivityLogs' => 'user_activity_logs',
    'UserRefreshToken' => 'user_refresh_token',
    'UserRol' => 'user_rol',
    
    // Tablas simples (ya en minúsculas pero sin guiones)
    'Agency' => 'agency',
    'Client' => 'client',
    'Company' => 'company',
    'File' => 'file',
    'Process' => 'process',
    'User' => 'user',
    'Migrations' => 'migrations',
    
    // Vistas
    'ViewAllRelations' => 'view_all_relations',
    'ViewClient' => 'view_client',
    'ViewClientCompanyAmount' => 'view_client_company_amount',
    'ViewClientRelations' => 'view_client_relations',
    'ViewDocumentName' => 'view_document_name',
    'ViewFiles' => 'view_files',
    'ViewFilesByClient' => 'view_files_by_client',
];

$codebasePath = __DIR__ . '/../app';
$filesUpdated = 0;

$iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($codebasePath)
);

foreach ($iterator as $file) {
    if ($file->isFile() && $file->getExtension() === 'php') {
        $filePath = $file->getPathname();
        $content = file_get_contents($filePath);
        $originalContent = $content;
        
        foreach ($nameMapping as $oldName => $newName) {
            // Reemplazar en diferentes contextos
            $content = str_replace("'$oldName'", "'$newName'", $content);
            $content = str_replace('"$oldName"', '"$newName"', $content);
            $content = str_replace("`$oldName`", "`$newName`", $content);
            $content = str_replace("table('$oldName'", "table('$newName'", $content);
            $content = str_replace('table("$oldName"', 'table("$newName"', $content);
            $content = str_replace("JOIN $oldName", "JOIN $newName", $content);
            $content = str_replace("FROM $oldName", "FROM $newName", $content);
            $content = str_replace("INNER JOIN $oldName", "INNER JOIN $newName", $content);
            $content = str_replace("LEFT JOIN $oldName", "LEFT JOIN $newName", $content);
            $content = str_replace("RIGHT JOIN $oldName", "RIGHT JOIN $newName", $content);
            // Para modelos: protected $table = '...'
            $content = str_replace("\$table = '$oldName'", "\$table = '$newName'", $content);
            $content = str_replace("\$table            = '$oldName'", "\$table            = '$newName'", $content);
        }
        
        if ($content !== $originalContent) {
            file_put_contents($filePath, $content);
            $relativePath = str_replace(__DIR__ . '/../', '', $filePath);
            echo "✅ Actualizado: $relativePath\n";
            $filesUpdated++;
        }
    }
}

echo "\n" . str_repeat("=", 60) . "\n";
echo "📊 RESUMEN:\n";
echo str_repeat("=", 60) . "\n";
echo "Archivos actualizados: $filesUpdated\n";
echo "✅ Proceso completado\n";
