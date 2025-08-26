<?php
/**
 * Script para probar el API de procesos y verificar los datos devueltos
 */

require_once __DIR__ . '/../vendor/autoload.php';

// Inicializar CodeIgniter
$app = require_once __DIR__ . '/../spark';

try {
    echo "=== PRUEBA DEL API DE PROCESOS ===\n\n";
    
    // 1. Verificar datos en la base de datos directamente
    echo "1. DATOS EN LA BASE DE DATOS:\n";
    echo "--------------------------------\n";
    
    $db = \Config\Database::connect();
    
    $result = $db->query("SELECT Id, Name, Enabled, RegistrationDate FROM Process ORDER BY Name");
    $processes = $result->getResultArray();
    
    foreach ($processes as $process) {
        echo "ID: {$process['Id']}, Nombre: {$process['Name']}, Enabled: {$process['Enabled']} (tipo: " . gettype($process['Enabled']) . ")\n";
    }
    
    echo "\n";
    
    // 2. Probar el modelo directamente
    echo "2. PRUEBA DEL MODELO:\n";
    echo "----------------------\n";
    
    $processModel = new \App\Models\ProcessModel();
    
    $allProcesses = $processModel->getAllProcessesWithUser();
    echo "getAllProcessesWithUser(): " . count($allProcesses) . " procesos\n";
    
    foreach ($allProcesses as $process) {
        echo "ID: {$process['Id']}, Nombre: {$process['Name']}, Enabled: {$process['Enabled']} (tipo: " . gettype($process['Enabled']) . ")\n";
    }
    
    echo "\n";
    
    // 3. Simular una llamada al API
    echo "3. SIMULACIÓN DE LLAMADA AL API:\n";
    echo "--------------------------------\n";
    
    // Crear una instancia del controlador
    $processController = new \App\Controllers\Api\Process();
    
    // Simular request
    $request = new \CodeIgniter\HTTP\IncomingRequest(
        new \Config\App(),
        new \CodeIgniter\HTTP\URI(),
        null,
        new \CodeIgniter\HTTP\UserAgent()
    );
    
    // Simular usuario autenticado (admin)
    $reflection = new ReflectionClass($processController);
    $requestProperty = $reflection->getProperty('request');
    $requestProperty->setAccessible(true);
    $requestProperty->setValue($processController, $request);
    
    // Simular método getAuthenticatedUser
    $getAuthenticatedUserMethod = $reflection->getMethod('getAuthenticatedUser');
    $getAuthenticatedUserMethod->setAccessible(true);
    
    // Mock del usuario autenticado
    $mockUser = [
        'user_id' => 1,
        'email' => 'admin@test.com',
        'role_id' => 1
    ];
    
    // Crear un mock del método
    $mockMethod = function() use ($mockUser) {
        return $mockUser;
    };
    
    // Asignar el mock
    $getAuthenticatedUserMethod->setAccessible(true);
    
    echo "Usuario simulado: " . json_encode($mockUser) . "\n";
    
    // 4. Verificar tipos de datos
    echo "\n4. VERIFICACIÓN DE TIPOS:\n";
    echo "-------------------------\n";
    
    foreach ($allProcesses as $process) {
        $enabledType = gettype($process['Enabled']);
        $enabledValue = $process['Enabled'];
        $enabledBool = (bool)$process['Enabled'];
        
        echo "Proceso: {$process['Name']}\n";
        echo "  Enabled (raw): {$enabledValue} (tipo: {$enabledType})\n";
        echo "  Enabled (bool): " . ($enabledBool ? 'true' : 'false') . "\n";
        echo "  Enabled === 1: " . ($process['Enabled'] === 1 ? 'true' : 'false') . "\n";
        echo "  Enabled == 1: " . ($process['Enabled'] == 1 ? 'true' : 'false') . "\n";
        echo "\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}
