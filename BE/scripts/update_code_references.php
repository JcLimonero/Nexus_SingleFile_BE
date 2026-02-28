<?php
/**
 * Script para actualizar referencias de tablas y columnas en el código
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "═══════════════════════════════════════════════════════════════════════════════\n";
echo "  ACTUALIZAR REFERENCIAS EN CÓDIGO\n";
echo "═══════════════════════════════════════════════════════════════════════════════\n\n";

$baseDir = __DIR__ . '/../app';

// Mapeo de cambios: [patrón antiguo] => [patrón nuevo]
$replacements = [
    // Tablas
    "'document_by_file'" => "'file_document'",
    '"document_by_file"' => '"file_document"',
    '`document_by_file`' => '`file_document`',
    'document_by_file' => 'file_document',
    
    "'order_by_car'" => "'order'",
    '"order_by_car"' => '"order"',
    '`order_by_car`' => '`order`',
    'order_by_car' => 'order',
    
    "'header_client'" => "'client_header'",
    '"header_client"' => '"client_header"',
    '`header_client`' => '`client_header`',
    'header_client' => 'client_header',
    
    "'client_total_relation'" => "'client_dms_relation'",
    '"client_total_relation"' => '"client_dms_relation"',
    '`client_total_relation`' => '`client_dms_relation`',
    'client_total_relation' => 'client_dms_relation',
    
    "'file_extraordinary_events'" => "'file_exception'",
    '"file_extraordinary_events"' => '"file_exception"',
    '`file_extraordinary_events`' => '`file_exception`',
    'file_extraordinary_events' => 'file_exception',
    
    "'file_extraordinary_reasons'" => "'file_exception_reason'",
    '"file_extraordinary_reasons"' => '"file_exception_reason"',
    '`file_extraordinary_reasons`' => '`file_exception_reason`',
    'file_extraordinary_reasons' => 'file_exception_reason',
    
    "'file_extraordinary_type'" => "'file_exception_type'",
    '"file_extraordinary_type"' => '"file_exception_type"',
    '`file_extraordinary_type`' => '`file_exception_type`',
    'file_extraordinary_type' => 'file_exception_type',
    
    "'file_tracking'" => "'file_history'",
    '"file_tracking"' => '"file_history"',
    '`file_tracking`' => '`file_history`',
    'file_tracking' => 'file_history',
    
    "'smtp_configurator'" => "'smtp_config'",
    '"smtp_configurator"' => '"smtp_config"',
    '`smtp_configurator`' => '`smtp_config`',
    'smtp_configurator' => 'smtp_config',
    
    // Tabla File → Expedient (solo cuando es nombre de tabla, no en nombres de columnas)
    "'file'" => "'expedient'", // En comillas simples
    '"file"' => '"expedient"', // En comillas dobles
    '`file`' => '`expedient`', // En backticks
    ' FROM file ' => ' FROM expedient ',
    ' JOIN file ' => ' JOIN expedient ',
    ' INNER JOIN file ' => ' INNER JOIN expedient ',
    ' LEFT JOIN file ' => ' LEFT JOIN expedient ',
    ' RIGHT JOIN file ' => ' RIGHT JOIN expedient ',
    ' UPDATE file ' => ' UPDATE expedient ',
    ' INSERT INTO file ' => ' INSERT INTO expedient ',
    ' DELETE FROM file ' => ' DELETE FROM expedient ',
    ' table(\'file\')' => " table('expedient')",
    ' table("file")' => ' table("expedient")',
    
    // Columnas
    'ExperationDate' => 'ExpirationDate',
    'Experation' => 'Expiration',
    'IdInventary' => 'IdInventory',
    'IdInventary' => 'IdInventory',
    'OtuputDate' => 'OutputDate',
    'IdCostumerType' => 'IdCustomerType',
    'IdCostumer' => 'IdCustomer',
    'costumerType' => 'customerType',
    'costumer_type' => 'customer_type',
    'CostumerType' => 'CustomerType',
    
    // Nombres de clases/variables (solo cuando sea apropiado)
    'File_Extraordinary_Events' => 'FileException',
    'File_Extraordinary_Reasons' => 'FileExceptionReason',
    'File_Extraordinary_Type' => 'FileExceptionType',
    'File_Tracking' => 'FileHistory',
    'OrderByCar' => 'Order',
    'DocumentByFile' => 'FileDocument',
    'HeaderClient' => 'ClientHeader',
    'Client_Total_Relation' => 'ClientDMSRelation',
];

// Archivos a procesar
$files = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($baseDir),
    RecursiveIteratorIterator::SELF_FIRST
);

$processedFiles = 0;
$totalReplacements = 0;

foreach ($files as $file) {
    if ($file->isFile() && $file->getExtension() === 'php') {
        $filePath = $file->getRealPath();
        $content = file_get_contents($filePath);
        $originalContent = $content;
        $fileReplacements = 0;
        
        foreach ($replacements as $old => $new) {
            $count = 0;
            $content = str_replace($old, $new, $content, $count);
            $fileReplacements += $count;
        }
        
        if ($content !== $originalContent) {
            file_put_contents($filePath, $content);
            $processedFiles++;
            $totalReplacements += $fileReplacements;
            echo "✅ $filePath ($fileReplacements cambios)\n";
        }
    }
}

echo "\n";
echo "═══════════════════════════════════════════════════════════════════════════════\n";
echo "✅ Proceso completado\n";
echo "   Archivos procesados: $processedFiles\n";
echo "   Total de reemplazos: $totalReplacements\n";
echo "═══════════════════════════════════════════════════════════════════════════════\n";
