<?php
/**
 * Script para corregir todas las referencias de tablas a snake_case
 * Corrige referencias de User, Agency, Process, OperationType, Company, etc.
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "═══════════════════════════════════════════════════════════════════════════════\n";
echo "  CORRECCIÓN DE REFERENCIAS DE TABLAS\n";
echo "═══════════════════════════════════════════════════════════════════════════════\n\n";

$baseDir = __DIR__ . '/../app';

// Mapeo de cambios: [patrón antiguo] => [patrón nuevo]
$replacements = [
    // Tablas con mayúsculas → snake_case
    "'User u'" => "'user u'",
    '"User u"' => '"user u"',
    '`User u`' => '`user u`',
    "table('User" => "table('user",
    'table("User' => 'table("user',
    
    "'User ur'" => "'user ur'",
    '"User ur"' => '"user ur"',
    '`User ur`' => '`user ur`',
    
    "'Agency a'" => "'agency a'",
    '"Agency a"' => '"agency a"',
    '`Agency a`' => '`agency a`',
    "table('Agency" => "table('agency",
    'table("Agency' => 'table("agency',
    
    "'Process" => "'process",
    '"Process' => '"process',
    '`Process' => '`process',
    "table('Process" => "table('process",
    'table("Process' => 'table("process',
    
    "'OperationType" => "'operation_type",
    '"OperationType' => '"operation_type',
    '`OperationType' => '`operation_type',
    "table('OperationType" => "table('operation_type",
    'table("OperationType' => 'table("operation_type',
    
    "'Company" => "'company",
    '"Company' => '"company',
    '`Company' => '`company',
    "table('Company" => "table('company",
    'table("Company' => 'table("company',
    
    "'ConfigurationProcess" => "'configuration_process",
    '"ConfigurationProcess' => '"configuration_process',
    '`ConfigurationProcess' => '`configuration_process',
    "table('ConfigurationProcess" => "table('configuration_process",
    'table("ConfigurationProcess' => 'table("configuration_process',
    
    // Referencias de columnas con punto
    'User.Id' => 'user.Id',
    'User.Name' => 'user.Name',
    'User.Mail' => 'user.Mail',
    'User.User' => 'user.user',
    'User.Enabled' => 'user.Enabled',
    'u.User' => 'u.user',
    
    'Agency.Id' => 'agency.Id',
    'Agency.Name' => 'agency.Name',
    'Agency.Enabled' => 'agency.Enabled',
    'Agency.IdCompany' => 'agency.IdCompany',
    'Agency.IdAgencyDMS' => 'agency.IdAgencyDMS',
    
    'Process.Id' => 'process.Id',
    'Process.Name' => 'process.Name',
    'Process.Enabled' => 'process.Enabled',
    'Process.RegistrationDate' => 'process.RegistrationDate',
    
    'OperationType.Id' => 'operation_type.Id',
    'OperationType.Name' => 'operation_type.Name',
    'OperationType.Enabled' => 'operation_type.Enabled',
    
    'Company.Id' => 'company.Id',
    'Company.name' => 'company.name',
    
    'ConfigurationProcess' => 'configuration_process',
    
    // JOINs
    "join('User" => "join('user",
    'join("User' => 'join("user',
    "join('Agency" => "join('agency",
    'join("Agency' => 'join("agency',
    "join('Process" => "join('process",
    'join("Process' => 'join("process',
    "join('OperationType" => "join('operation_type",
    'join("OperationType' => 'join("operation_type',
    "join('Company" => "join('company",
    'join("Company' => 'join("company',
    "join('ConfigurationProcess" => "join('configuration_process",
    'join("ConfigurationProcess' => 'join("configuration_process',
    
    // JOINs con condiciones
    "= User.Id" => "= user.Id",
    "= Agency.Id" => "= agency.Id",
    "= Process.Id" => "= process.Id",
    "= OperationType.Id" => "= operation_type.Id",
    "= Company.Id" => "= company.Id",
    "= ConfigurationProcess" => "= configuration_process",
    
    // FROM
    "FROM User" => "FROM user",
    "FROM Agency" => "FROM agency",
    "FROM Process" => "FROM process",
    "FROM OperationType" => "FROM operation_type",
    "FROM Company" => "FROM company",
    "FROM ConfigurationProcess" => "FROM configuration_process",
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
