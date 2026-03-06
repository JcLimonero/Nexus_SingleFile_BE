<?php
/**
 * Insertar motivos extraordinarios en file_extraordinary_reasons
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== INSERTAR MOTIVOS EN FILE_EXTRAORDINARY_REASONS ===\n\n";

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

echo "Base de datos: {$db['database']}\n";
echo "Host: {$db['hostname']}\n\n";

// Incluir helper de Title Case
require_once __DIR__ . '/helpers/title_case_helper.php';

// Motivos a insertar (se convertirán automáticamente a Title Case)
// Nota: Corregido "Opini?n" a "Opinión"
$reasonsRaw = [
    'ERROR DATOS CLIENTE',
    'Error en Fecha',
    'Error en Domicilio',
    'Error en Precio',
    'ERROR EN RFC',
    'ERROR EN DATOS VEHICULO',
    'Error en el Sistema',
    'ERROR EN USO CFDI',
    'Error por Adenda',
    'Venta Caida',
    'CREDITO NO AUTORIZADO',
    'No Pago',
    'Cambio de Opinión de Cliente', // Corregido de "Opini?n"
    'No Llego la Unidad',
    'AUTORIZACION DE DIRECCION',
    'VENTA DE SOCIO',
    'CIERRE DE MES',
    'AUTORIZACION DIR. MARCA'
];

// Convertir a Title Case automáticamente
$reasons = array_map('toTitleCase', $reasonsRaw);

try {
    $mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);
    
    if ($mysqli->connect_error) {
        die("❌ Error de conexión: " . $mysqli->connect_error . "\n");
    }
    
    echo "✅ Conectado a la base de datos\n\n";
    
    // Verificar registros existentes
    echo "📋 Verificando registros existentes...\n";
    $existing = $mysqli->query("SELECT Id, Name FROM file_extraordinary_reasons ORDER BY Id");
    $existingReasons = [];
    if ($existing && $existing->num_rows > 0) {
        while ($row = $existing->fetch_assoc()) {
            $existingReasons[$row['Name']] = $row['Id'];
        }
        echo "✅ Encontrados " . count($existingReasons) . " registros existentes\n\n";
    } else {
        echo "✅ No hay registros existentes\n\n";
    }
    
    // Obtener el siguiente ID disponible
    $maxIdResult = $mysqli->query("SELECT MAX(Id) as maxId FROM file_extraordinary_reasons");
    $maxId = 0;
    if ($maxIdResult && $row = $maxIdResult->fetch_assoc()) {
        $maxId = (int)$row['maxId'];
    }
    $nextId = $maxId + 1;
    
    echo "🔄 Insertando motivos...\n";
    echo str_repeat("=", 80) . "\n";
    
    $insertedCount = 0;
    $skippedCount = 0;
    $errorCount = 0;
    
    foreach ($reasons as $reasonName) {
        // Verificar si ya existe
        if (isset($existingReasons[$reasonName])) {
            echo "⏭️  Ya existe: '$reasonName' (ID: {$existingReasons[$reasonName]})\n";
            $skippedCount++;
            continue;
        }
        
        // Insertar nuevo motivo
        $insertQuery = $mysqli->prepare("
            INSERT INTO file_extraordinary_reasons 
            (Id, Name, IdTypeReason, Enabled, RegistrationDate, UpdateDate, IdLastUserUpdate) 
            VALUES (?, ?, ?, 1, NOW(), NOW(), ?)
        ");
        
        $idTypeReason = null; // NULL por defecto
        $idLastUserUpdate = 1; // Administrador Sistema
        $insertQuery->bind_param("isii", $nextId, $reasonName, $idTypeReason, $idLastUserUpdate);
        
        if ($insertQuery->execute()) {
            echo "✅ ID $nextId: '$reasonName'\n";
            $insertedCount++;
            $nextId++;
        } else {
            echo "❌ Error al insertar '$reasonName': " . $insertQuery->error . "\n";
            $errorCount++;
        }
        $insertQuery->close();
    }
    
    echo "\n" . str_repeat("=", 80) . "\n";
    echo "📊 RESUMEN:\n";
    echo str_repeat("=", 80) . "\n";
    echo "✅ Insertados: $insertedCount\n";
    echo "⏭️  Omitidos (ya existían): $skippedCount\n";
    echo "❌ Errores: $errorCount\n";
    echo "📋 Total procesados: " . ($insertedCount + $skippedCount + $errorCount) . "\n\n";
    
    // Mostrar todos los motivos actuales
    echo "📋 MOTIVOS EN FILE_EXTRAORDINARY_REASONS:\n";
    echo str_repeat("=", 80) . "\n";
    $allReasons = $mysqli->query("SELECT Id, Name, IdTypeReason, Enabled FROM file_extraordinary_reasons ORDER BY Id");
    if ($allReasons && $allReasons->num_rows > 0) {
        echo sprintf("%-5s %-60s %-15s %-10s\n", "ID", "Name", "IdTypeReason", "Enabled");
        echo str_repeat("-", 90) . "\n";
        while ($reason = $allReasons->fetch_assoc()) {
            echo sprintf("%-5s %-60s %-15s %-10s\n",
                $reason['Id'],
                $reason['Name'],
                $reason['IdTypeReason'] ?? 'NULL',
                $reason['Enabled']
            );
        }
    }
    
    $mysqli->close();
    
    echo "\n✅ Proceso completado\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
