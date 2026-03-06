<?php
/**
 * Actualizar nombres de tablas en el código a PascalCase
 */

echo "=== ACTUALIZACIÓN DE NOMBRES DE TABLAS EN CÓDIGO ===\n\n";

// Mapeo de nombres antiguos a nuevos (PascalCase)
$nameMapping = [
    // Relaciones
    'Agency_User' => 'AgencyUser',
    'Process_User' => 'ProcessUser',
    'Client_Total_Relation' => 'ClientTotalRelation',
    
    // Status y SubStatus
    'File_Status' => 'FileStatus',
    'File_SubStatus' => 'FileSubStatus',
    'DocumentFile_Status' => 'DocumentFileStatus',
    
    // Reasons
    'File_Reasons' => 'FileReasons',
    'File_Extraordinary_Reasons' => 'FileExtraordinaryReasons',
    
    // Tokens
    'User_RefreshToken' => 'UserRefreshToken',
    
    // Configuration
    'ConfigurationProcess_DocumentType' => 'ConfigurationProcessDocumentType',
    
    // Vistas (mantener View prefix pero sin guiones bajos)
    'view_client' => 'ViewClient',
    'view_client_relations' => 'ViewClientRelations',
    'view_client_company_amount' => 'ViewClientCompanyAmount',
    'view_document_name' => 'ViewDocumentName',
    'view_files' => 'ViewFiles',
    'view_files_by_client' => 'ViewFilesByClient',
    'view_all_relations' => 'ViewAllRelations',
];

$codebasePath = __DIR__ . '/../app';
$filesUpdated = 0;
$replacementsMade = 0;

$iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($codebasePath)
);

foreach ($iterator as $file) {
    if ($file->isFile() && $file->getExtension() === 'php') {
        $filePath = $file->getPathname();
        $content = file_get_contents($filePath);
        $originalContent = $content;
        
        foreach ($nameMapping as $oldName => $newName) {
            // Buscar diferentes variantes del nombre
            $patterns = [
                // En comillas simples
                "/'$oldName'/",
                "/'$oldName\s/",
                "/'$oldName`/",
                // En comillas dobles
                "/\"$oldName\"/",
                // Con backticks
                "/`$oldName`/",
                // En table()
                "/table\(['\"]$oldName['\"]/",
                // En JOINs
                "/JOIN\s+['\"]?$oldName['\"]?/i",
                // En FROM
                "/FROM\s+['\"]?$oldName['\"]?/i",
            ];
            
            $replacements = [
                "'$newName'",
                "'$newName ",
                "'$newName`",
                "\"$newName\"",
                "`$newName`",
                "table('$newName'",
                "JOIN `$newName`",
                "FROM `$newName`",
            ];
            
            foreach ($patterns as $index => $pattern) {
                $content = preg_replace($pattern, $replacements[$index], $content);
            }
        }
        
        if ($content !== $originalContent) {
            file_put_contents($filePath, $content);
            $relativePath = str_replace(__DIR__ . '/../', '', $filePath);
            echo "✅ Actualizado: $relativePath\n";
            $filesUpdated++;
            $replacementsMade += substr_count($originalContent, '_') - substr_count($content, '_');
        }
    }
}

echo "\n" . str_repeat("=", 60) . "\n";
echo "📊 RESUMEN:\n";
echo str_repeat("=", 60) . "\n";
echo "Archivos actualizados: $filesUpdated\n";
echo "✅ Proceso completado\n";
