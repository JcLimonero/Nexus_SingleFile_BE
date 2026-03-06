<?php
/**
 * Reemplazar todas las referencias de TotalDealer por DMS
 */

echo "=== REEMPLAZO DE TotalDealer POR DMS ===\n\n";

// Mapeo de reemplazos
$replacements = [
    // Variables y columnas
    'IdTotalDealer' => 'IdDMS',
    'idTotalDealer' => 'idDMS',
    'totalDealer' => 'dms',
    'TotalDealer' => 'DMS',
    
    // En comentarios y strings
    'IdTotalDealer' => 'IdDMS',
    'total_dealer' => 'dms',
    'total dealer' => 'dms',
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
        
        // Reemplazos específicos
        $content = str_replace('IdTotalDealer', 'IdDMS', $content);
        $content = str_replace('idTotalDealer', 'idDMS', $content);
        $content = str_replace('totalDealer', 'dms', $content);
        // Solo reemplazar TotalDealer cuando no es parte de otra palabra
        $content = preg_replace('/\bTotalDealer\b/', 'DMS', $content);
        
        if ($content !== $originalContent) {
            file_put_contents($filePath, $content);
            $relativePath = str_replace(__DIR__ . '/../', '', $filePath);
            echo "✅ Actualizado: $relativePath\n";
            $filesUpdated++;
            $totalReplacements += substr_count($originalContent, 'TotalDealer') - substr_count($content, 'TotalDealer');
        }
    }
}

echo "\n" . str_repeat("=", 60) . "\n";
echo "📊 RESUMEN:\n";
echo str_repeat("=", 60) . "\n";
echo "Archivos actualizados: $filesUpdated\n";
echo "✅ Proceso completado\n";
