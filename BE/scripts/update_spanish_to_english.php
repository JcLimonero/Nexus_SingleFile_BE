<?php
/**
 * Actualizar código para usar nombres en inglés
 */

echo "=== ACTUALIZACIÓN DE CÓDIGO A INGLÉS ===\n\n";

// Mapeo de cambios
$replacements = [
    // Tablas
    'expedientes_corregir' => 'files_to_correct',
    'file_pld_beneficiario_final' => 'file_pld_beneficial_owner',
    'user_rol' => 'user_role',
    'UserRol' => 'user_role',
    'User_Rol' => 'user_role',
    
    // Columnas
    'Modelo' => 'Model',
    'modelo' => 'model',
    'Asesor' => 'Advisor',
    'asesor' => 'advisor',
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
            // Para modelos: protected $table = '...'
            $content = str_replace("\$table = '$oldName'", "\$table = '$newName'", $content);
            $content = str_replace("\$table            = '$oldName'", "\$table            = '$newName'", $content);
            // Para columnas en SELECT
            $content = str_replace(".$oldName", ".$newName", $content);
            $content = str_replace(" $oldName ", " $newName ", $content);
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
