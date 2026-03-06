<?php
/**
 * Script de diagnóstico para verificar qué columnas existen en las tablas
 * que pueden haber cambiado de nombre
 * 
 * Uso: php scripts/diagnose_table_columns.php
 */

require __DIR__ . '/../vendor/autoload.php';

// Cargar configuración de CodeIgniter
$pathsConfig = new \Config\Paths();
$bootstrap = rtrim($pathsConfig->systemDirectory, '\\/ ') . '/bootstrap.php';
require realpath($bootstrap) ?: $bootstrap;

echo "=== Diagnóstico de Columnas en Tablas ===\n\n";

$db = \Config\Database::connect();

// Tablas a verificar
$tablesToCheck = [
    'File_Status',
    'DocumentFile_Status', 
    'DocumentFile_Error',
    'File',
    'File_Reasons',
    'File_Extraordinary_Reasons'
];

foreach ($tablesToCheck as $tableName) {
    echo "--- Tabla: $tableName ---\n";
    
    // Verificar si la tabla existe
    if (!$db->tableExists($tableName)) {
        echo "  ⚠️  La tabla no existe\n\n";
        continue;
    }
    
    // Obtener columnas de la tabla
    $fields = $db->getFieldData($tableName);
    
    echo "  Columnas encontradas:\n";
    $hasDescription = false;
    $hasName = false;
    
    foreach ($fields as $field) {
        $fieldName = $field->name;
        echo "    - $fieldName (" . $field->type . ")\n";
        
        if (strtolower($fieldName) === 'description') {
            $hasDescription = true;
        }
        if (strtolower($fieldName) === 'name') {
            $hasName = true;
        }
    }
    
    // Verificar si tiene Description o Name
    if ($hasDescription && $hasName) {
        echo "  ✅ Tiene AMBAS columnas: Description y Name\n";
    } elseif ($hasDescription) {
        echo "  ⚠️  Solo tiene Description (puede necesitar cambio a Name)\n";
    } elseif ($hasName) {
        echo "  ✅ Solo tiene Name (ya actualizado)\n";
    }
    
    echo "\n";
}

echo "=== Diagnóstico completado ===\n";
