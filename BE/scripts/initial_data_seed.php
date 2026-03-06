<?php
/**
 * Script maestro para inserción inicial de datos (catálogos)
 * Este script ejecuta todos los scripts de inserción en el orden correcto
 * para preparar la base de datos para la inserción de clientes
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "═══════════════════════════════════════════════════════════════════════════════\n";
echo "  SCRIPT DE INSERCIÓN INICIAL DE DATOS (CATÁLOGOS)\n";
echo "═══════════════════════════════════════════════════════════════════════════════\n\n";

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

echo "Base de datos: {$db['database']}\n";
echo "Host: {$db['hostname']}\n";
echo "Fecha: " . date('Y-m-d H:i:s') . "\n\n";

// Scripts a ejecutar en orden
$scripts = [
    [
        'file' => 'insert_user_roles.php',
        'name' => 'Roles de Usuario',
        'description' => 'Inserta los roles del sistema (Administrador, Soporte, Auditor, etc.)'
    ],
    [
        'file' => 'reset_and_create_companies_agencies.php',
        'name' => 'Empresas y Agencias',
        'description' => 'Crea empresas y agencias iniciales',
        'alternative' => 'create_companies_and_agencies.php'
    ],
    [
        'file' => 'insert_processes.php',
        'name' => 'Procesos',
        'description' => 'Inserta procesos (Autos Nuevos, Autos Seminuevos, Motos Nuevos)'
    ],
    [
        'file' => 'insert_customer_types.php',
        'name' => 'Tipos de Cliente',
        'description' => 'Inserta tipos de cliente (Persona Física, Persona Moral)'
    ],
    [
        'file' => 'insert_operation_types.php',
        'name' => 'Tipos de Operación',
        'description' => 'Inserta tipos de operación (Contado, Financiamiento, etc.)'
    ],
    [
        'file' => 'insert_file_status.php',
        'name' => 'Estados de Archivo',
        'description' => 'Inserta estados de archivo (Integración, Liquidación, Liberación, etc.)'
    ],
    [
        'file' => 'insert_file_sub_status.php',
        'name' => 'Sub-Estados de Archivo',
        'description' => 'Inserta sub-estados de archivo relacionados con Liberación'
    ],
    [
        'file' => 'insert_file_reasons.php',
        'name' => 'Motivos de Archivo',
        'description' => 'Inserta motivos de corrección de archivos'
    ],
    [
        'file' => 'insert_file_extraordinary_reasons.php',
        'name' => 'Motivos Extraordinarios',
        'description' => 'Inserta motivos extraordinarios para excepciones y cancelaciones'
    ],
    [
        'file' => 'insert_document_file_status.php',
        'name' => 'Estados de Documento',
        'description' => 'Inserta estados de documentos (Nuevo, Cargado, Aprobado, etc.)'
    ],
    [
        'file' => 'insert_document_file_error.php',
        'name' => 'Errores de Documento',
        'description' => 'Inserta motivos de error de documentos'
    ],
    [
        'file' => 'create_test_users.php',
        'name' => 'Usuarios de Prueba',
        'description' => 'Crea usuarios de prueba con diferentes roles y permisos',
        'optional' => true
    ],
];

$totalScripts = count($scripts);
$executedScripts = 0;
$skippedScripts = 0;
$failedScripts = 0;
$errors = [];

echo "📋 Scripts a ejecutar: $totalScripts\n";
echo str_repeat("=", 80) . "\n\n";

foreach ($scripts as $index => $script) {
    $scriptNumber = $index + 1;
    $scriptPath = __DIR__ . '/' . $script['file'];
    
    echo "[" . str_pad($scriptNumber, 2, '0', STR_PAD_LEFT) . "/$totalScripts] ";
    echo "{$script['name']}\n";
    echo str_repeat("-", 80) . "\n";
    echo "📝 {$script['description']}\n";
    
    // Verificar si existe el script o su alternativa
    if (!file_exists($scriptPath) && isset($script['alternative'])) {
        $scriptPath = __DIR__ . '/' . $script['alternative'];
        echo "   ℹ️  Usando script alternativo: {$script['alternative']}\n";
    }
    
    if (!file_exists($scriptPath)) {
        echo "⚠️  Script no encontrado: {$script['file']}\n";
        if (isset($script['optional']) && $script['optional']) {
            echo "   (Opcional - omitido)\n";
            $skippedScripts++;
        } else {
            echo "   ❌ ERROR: Script requerido no encontrado\n";
            $failedScripts++;
            $errors[] = "Script requerido no encontrado: {$script['file']}";
        }
    } else {
        echo "🔄 Ejecutando script...\n\n";
        
        // Ejecutar script
        $output = [];
        $returnCode = 0;
        exec("php \"$scriptPath\" 2>&1", $output, $returnCode);
        
        // Mostrar salida
        foreach ($output as $line) {
            echo "   $line\n";
        }
        
        if ($returnCode === 0) {
            echo "\n✅ Script ejecutado exitosamente\n";
            $executedScripts++;
        } else {
            echo "\n❌ Script falló con código de salida: $returnCode\n";
            $failedScripts++;
            $errors[] = "Script falló: {$script['file']} (código: $returnCode)";
        }
    }
    
    echo "\n";
}

// Resumen final
echo str_repeat("=", 80) . "\n";
echo "📊 RESUMEN FINAL\n";
echo str_repeat("=", 80) . "\n";
echo "✅ Scripts ejecutados exitosamente: $executedScripts\n";
echo "⏭️  Scripts omitidos (opcionales/no encontrados): $skippedScripts\n";
echo "❌ Scripts fallidos: $failedScripts\n";
echo "📋 Total procesados: " . ($executedScripts + $skippedScripts + $failedScripts) . "\n\n";

if (!empty($errors)) {
    echo "⚠️  ERRORES ENCONTRADOS:\n";
    foreach ($errors as $error) {
        echo "   - $error\n";
    }
    echo "\n";
}

// Verificar estado final de catálogos
echo str_repeat("=", 80) . "\n";
echo "🔍 VERIFICANDO ESTADO FINAL DE CATÁLOGOS\n";
echo str_repeat("=", 80) . "\n";

require_once __DIR__ . '/check_all_catalogs_status.php';

echo "\n";
if ($failedScripts === 0) {
    echo "✅ ¡Proceso completado exitosamente!\n";
    echo "   La base de datos está lista para insertar clientes.\n";
} else {
    echo "⚠️  Proceso completado con errores.\n";
    echo "   Revisa los errores anteriores antes de continuar.\n";
    exit(1);
}
