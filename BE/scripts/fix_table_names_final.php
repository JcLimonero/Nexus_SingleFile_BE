<?php
/**
 * Actualizar nombres de tablas en el código a PascalCase
 */

echo "=== ACTUALIZACIÓN FINAL DE NOMBRES DE TABLAS ===\n\n";

// Mapeo de nombres antiguos a nuevos (PascalCase)
$replacements = [
    // Relaciones
    "Agency_User" => "AgencyUser",
    "Process_User" => "ProcessUser",
    "Client_Total_Relation" => "ClientTotalRelation",
    
    // Status y SubStatus
    "File_Status" => "FileStatus",
    "File_SubStatus" => "FileSubStatus",
    "DocumentFile_Status" => "DocumentFileStatus",
    
    // Reasons
    "File_Reasons" => "FileReasons",
    "File_Extraordinary_Reasons" => "FileExtraordinaryReasons",
    
    // Tokens
    "User_RefreshToken" => "UserRefreshToken",
    
    // Configuration
    "ConfigurationProcess_DocumentType" => "ConfigurationProcessDocumentType",
];

$codebasePath = __DIR__ . '/../app';
$filesUpdated = 0;
$totalReplacements = 0;

$iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($codebasePath)
);

foreach ($iterator as $file) {
    if ($file->isFile() && $file->getExtension() === 'php') {
        $filePath = $file->getPathname();
        $content = file_get_contents($filePath);
        $originalContent = $content;
        
        foreach ($replacements as $oldName => $newName) {
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
        }
        
        if ($content !== $originalContent) {
            file_put_contents($filePath, $content);
            $relativePath = str_replace(__DIR__ . '/../', '', $filePath);
            echo "✅ Actualizado: $relativePath\n";
            $filesUpdated++;
            $totalReplacements += substr_count($originalContent, '_') - substr_count($content, '_');
        }
    }
}

echo "\n" . str_repeat("=", 60) . "\n";
echo "📊 RESUMEN:\n";
echo str_repeat("=", 60) . "\n";
echo "Archivos actualizados: $filesUpdated\n";
echo "✅ Proceso completado\n";
