<?php

/**
 * Script para verificar el estado de Enabled en la tabla DocumentType
 * Ejecutar: php test_document_type_enabled.php
 */

// Cargar CodeIgniter
require_once __DIR__ . '/../spark';

// Verificar que no se esté ejecutando como comando de spark
if (php_sapi_name() === 'cli' && isset($argv[0]) && basename($argv[0]) === 'spark') {
    echo "Este script debe ejecutarse directamente con PHP, no con spark\n";
    exit(1);
}

// Crear instancia del modelo
$documentTypeModel = new \App\Models\DocumentTypeModel();

echo "🔍 Verificando estado de Enabled en DocumentType\n";
echo "==============================================\n\n";

// Obtener todos los tipos de documento
$allDocumentTypes = $documentTypeModel->findAll();

echo "📊 Total de registros en DocumentType: " . count($allDocumentTypes) . "\n\n";

// Contar por estado
$enabledCount = 0;
$disabledCount = 0;

foreach ($allDocumentTypes as $docType) {
    if ($docType['Enabled'] == 1) {
        $enabledCount++;
    } else {
        $disabledCount++;
    }
}

echo "✅ Registros con Enabled = 1: $enabledCount\n";
echo "❌ Registros con Enabled = 0: $disabledCount\n\n";

// Mostrar algunos ejemplos
echo "📋 Ejemplos de registros:\n";
echo "------------------------\n";

$count = 0;
foreach ($allDocumentTypes as $docType) {
    if ($count >= 5) break; // Solo mostrar los primeros 5
    
    echo "ID: {$docType['Id']} | Nombre: {$docType['Name']} | Enabled: {$docType['Enabled']} | Tipo: " . gettype($docType['Enabled']) . "\n";
    $count++;
}

echo "\n";

// Verificar usando el método del modelo
echo "🔍 Usando getDocumentTypesWithRelations():\n";
echo "-------------------------------------------\n";

$documentTypesWithRelations = $documentTypeModel->getDocumentTypesWithRelations();

echo "📊 Total de registros con relaciones: " . count($documentTypesWithRelations) . "\n\n";

$enabledWithRelations = 0;
$disabledWithRelations = 0;

foreach ($documentTypesWithRelations as $docType) {
    if ($docType['Enabled'] == 1) {
        $enabledWithRelations++;
    } else {
        $disabledWithRelations++;
    }
}

echo "✅ Con relaciones - Enabled = 1: $enabledWithRelations\n";
echo "❌ Con relaciones - Enabled = 0: $disabledWithRelations\n\n";

// Mostrar algunos ejemplos con relaciones
echo "📋 Ejemplos con relaciones:\n";
echo "---------------------------\n";

$count = 0;
foreach ($documentTypesWithRelations as $docType) {
    if ($count >= 5) break;
    
    echo "ID: {$docType['Id']} | Nombre: {$docType['Name']} | Enabled: {$docType['Enabled']} | Tipo: " . gettype($docType['Enabled']) . "\n";
    $count++;
}

echo "\n";

// Verificar directamente en la base de datos
echo "🔍 Verificación directa en la base de datos:\n";
echo "--------------------------------------------\n";

$db = \Config\Database::connect();
$query = $db->query("SELECT Id, Name, Enabled FROM DocumentType LIMIT 5");
$results = $query->getResultArray();

echo "📋 Consulta directa SQL:\n";
foreach ($results as $row) {
    echo "ID: {$row['Id']} | Nombre: {$row['Name']} | Enabled: {$row['Enabled']} | Tipo: " . gettype($row['Enabled']) . "\n";
}

echo "\n✅ Script completado\n";
