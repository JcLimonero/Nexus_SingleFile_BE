<?php
/**
 * Script de prueba para verificar el modelo FileExtraordinaryReasonModel
 * Ejecutar desde la raíz del proyecto: php scripts/test_extraordinary_reason_model.php
 */

// Cargar CodeIgniter
require_once 'vendor/autoload.php';

// Configurar el entorno
putenv('CI_ENVIRONMENT=development');

// Inicializar CodeIgniter
$app = require_once 'spark';

try {
    echo "🧪 Iniciando prueba del modelo FileExtraordinaryReasonModel...\n\n";
    
    // Crear instancia del modelo
    $model = new \App\Models\FileExtraordinaryReasonModel();
    
    echo "✅ Modelo creado exitosamente\n";
    
    // Probar método findAll
    echo "🔍 Probando método findAll()...\n";
    $allReasons = $model->findAll();
    echo "✅ findAll() ejecutado. Registros encontrados: " . count($allReasons) . "\n";
    
    // Probar método getActiveFileExtraordinaryReasons
    echo "🔍 Probando método getActiveFileExtraordinaryReasons()...\n";
    $activeReasons = $model->getActiveFileExtraordinaryReasons();
    echo "✅ getActiveFileExtraordinaryReasons() ejecutado. Registros activos: " . count($activeReasons) . "\n";
    
    // Probar método getFileExtraordinaryReasonStats
    echo "🔍 Probando método getFileExtraordinaryReasonStats()...\n";
    $stats = $model->getFileExtraordinaryReasonStats();
    echo "✅ getFileExtraordinaryReasonStats() ejecutado. Total: " . $stats['total_reasons'] . "\n";
    
    // Probar inserción de un registro de prueba
    echo "🔍 Probando inserción de registro de prueba...\n";
    $testData = [
        'Name' => 'Motivo de prueba ' . date('Y-m-d H:i:s'),
        'IdTypeReason' => 2, // Excepción
        'Enabled' => 1,
        'RegistrationDate' => date('Y-m-d H:i:s'),
        'UpdateDate' => date('Y-m-d H:i:s'),
        'IdLastUserUpdate' => 0
    ];
    
    $insertResult = $model->insert($testData);
    if ($insertResult) {
        $insertedId = $model->insertID();
        echo "✅ Inserción exitosa. ID generado: " . $insertedId . "\n";
        
        // Eliminar el registro de prueba
        echo "🧹 Eliminando registro de prueba...\n";
        $deleteResult = $model->delete($insertedId);
        if ($deleteResult) {
            echo "✅ Registro de prueba eliminado exitosamente\n";
        } else {
            echo "⚠️  No se pudo eliminar el registro de prueba\n";
        }
    } else {
        echo "❌ Error en la inserción\n";
        echo "Errores: " . print_r($model->errors(), true) . "\n";
    }
    
    echo "\n🎉 Todas las pruebas completadas exitosamente!\n";
    
} catch (Exception $e) {
    echo "❌ Error durante la prueba: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}
