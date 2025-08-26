<?php
/**
 * Script para verificar el conteo real de procesos en la base de datos
 * y comparar con lo que devuelve el modelo
 */

require_once __DIR__ . '/../vendor/autoload.php';

use CodeIgniter\Config\Services;

// Inicializar CodeIgniter
$app = require_once __DIR__ . '/../spark';

try {
    $db = \Config\Database::connect();
    
    echo "=== VERIFICACIÓN DE PROCESOS ===\n\n";
    
    // 1. Conteo directo en la base de datos
    echo "1. CONTEOS DIRECTOS EN LA BASE DE DATOS:\n";
    echo "----------------------------------------\n";
    
    // Total de procesos
    $result = $db->query("SELECT COUNT(*) as total FROM Process");
    $total = $result->getRow()->total;
    echo "Total de procesos: {$total}\n";
    
    // Procesos habilitados
    $result = $db->query("SELECT COUNT(*) as enabled FROM Process WHERE Enabled = 1");
    $enabled = $result->getRow()->enabled;
    echo "Procesos habilitados: {$enabled}\n";
    
    // Procesos deshabilitados
    $result = $db->query("SELECT COUNT(*) as disabled FROM Process WHERE Enabled = 0");
    $disabled = $result->getRow()->disabled;
    echo "Procesos deshabilitados: {$disabled}\n\n";
    
    // 2. Verificar si hay algún filtro global
    echo "2. VERIFICACIÓN DE FILTROS GLOBALES:\n";
    echo "-----------------------------------\n";
    
    // Verificar si hay algún filtro en el modelo base
    echo "Verificando si hay filtros en el modelo base...\n";
    
    // 3. Probar el modelo directamente
    echo "\n3. PRUEBA DEL MODELO DIRECTAMENTE:\n";
    echo "--------------------------------\n";
    
    $processModel = new \App\Models\ProcessModel();
    
    // Probar getAllProcessesWithUser
    $allProcesses = $processModel->getAllProcessesWithUser();
    echo "getAllProcessesWithUser(): " . count($allProcesses) . " procesos\n";
    
    // Probar countAllProcesses
    $totalCount = $processModel->countAllProcesses();
    echo "countAllProcesses(): {$totalCount} procesos\n";
    
    // Probar getAllEnabledProcessesWithUser
    $enabledProcesses = $processModel->getAllEnabledProcessesWithUser();
    echo "getAllEnabledProcessesWithUser(): " . count($enabledProcesses) . " procesos\n";
    
    // Probar getAllDisabledProcessesWithUser
    $disabledProcesses = $processModel->getAllDisabledProcessesWithUser();
    echo "getAllDisabledProcessesWithUser(): " . count($disabledProcesses) . " procesos\n";
    
    // 4. Verificar si hay algún problema con el JOIN
    echo "\n4. VERIFICACIÓN DEL JOIN:\n";
    echo "-------------------------\n";
    
    // Probar query manual con JOIN
    $query = $db->query("
        SELECT Process.*, User.Name as LastUserUpdateName 
        FROM Process 
        LEFT JOIN User ON Process.IdLastUserUpdate = User.Id 
        ORDER BY Process.Name ASC
    ");
    $manualResult = $query->getResultArray();
    echo "Query manual con JOIN: " . count($manualResult) . " procesos\n";
    
    // 5. Verificar si hay algún problema con el campo Enabled
    echo "\n5. VERIFICACIÓN DEL CAMPO ENABLED:\n";
    echo "--------------------------------\n";
    
    // Verificar tipos de datos
    $result = $db->query("SELECT DISTINCT Enabled, COUNT(*) as count FROM Process GROUP BY Enabled");
    $enabledTypes = $result->getResultArray();
    
    foreach ($enabledTypes as $type) {
        echo "Enabled = '{$type['Enabled']}' (tipo: " . gettype($type['Enabled']) . "): {$type['count']} procesos\n";
    }
    
    // 6. Resumen
    echo "\n6. RESUMEN:\n";
    echo "-----------\n";
    echo "Base de datos directa: {$total} procesos\n";
    echo "Modelo getAllProcessesWithUser: " . count($allProcesses) . " procesos\n";
    echo "Modelo countAllProcesses: {$totalCount} procesos\n";
    echo "Query manual con JOIN: " . count($manualResult) . " procesos\n";
    
    if ($total != count($allProcesses)) {
        echo "\n⚠️  PROBLEMA DETECTADO: El modelo no está devolviendo todos los procesos\n";
        echo "   Diferencia: " . ($total - count($allProcesses)) . " procesos faltantes\n";
    } else {
        echo "\n✅ El modelo está devolviendo todos los procesos correctamente\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}
