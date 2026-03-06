<?php
/**
 * Insertar motivos de corrección de expediente (file_reasons)
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== INSERTAR MOTIVOS DE FILE_REASONS ===\n\n";

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

echo "Base de datos: {$db['database']}\n";
echo "Host: {$db['hostname']}\n\n";

try {
    $mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);
    
    if ($mysqli->connect_error) {
        die("❌ Error de conexión: " . $mysqli->connect_error . "\n");
    }
    
    echo "✅ Conectado a la base de datos\n\n";
    
    // Incluir helper de Title Case
    require_once __DIR__ . '/helpers/title_case_helper.php';
    
    // Motivos a insertar (se convertirán automáticamente a Title Case)
    $reasonsRaw = [
        'DOCUMENTO VENCIDO',
        'DOCUMENTO NO LEGIBLE',
        'DCTO. VENCIDO Y NO LEGIBLE',
        'DCTO. NO CORRESPONDIENTE',
        'INFORMACION NO CORRESPONDE',
        'DOCUMENTO INCOMPLETO',
        'FIRMA NO COINCIDE',
        'CORRECCIÓN DE EXPEDIENTE'
    ];
    
    // Convertir a Title Case automáticamente
    $reasons = array_map('toTitleCase', $reasonsRaw);
    
    echo "📋 MOTIVOS A INSERTAR:\n";
    echo str_repeat("=", 60) . "\n";
    foreach ($reasons as $index => $reason) {
        echo sprintf("%d. %s\n", $index + 1, $reason);
    }
    echo "\n";
    
    // Obtener el máximo ID actual
    $maxIdResult = $mysqli->query("SELECT MAX(Id) as max_id FROM file_reasons");
    $maxIdRow = $maxIdResult->fetch_assoc();
    $nextId = ($maxIdRow['max_id'] ?? 0) + 1;
    
    // Si el máximo es 0, empezar desde 1
    if ($nextId == 0) {
        $nextId = 1;
    }
    
    echo "🔍 ID inicial para nuevos registros: $nextId\n\n";
    
    echo "🔄 Insertando motivos...\n";
    echo str_repeat("=", 60) . "\n";
    
    $insertedCount = 0;
    $skippedCount = 0;
    $errorCount = 0;
    $idLastUserUpdate = 1; // Usuario administrador
    
    foreach ($reasons as $reasonName) {
        // Verificar si ya existe
        $checkQuery = $mysqli->prepare("SELECT Id FROM file_reasons WHERE Name = ?");
        $checkQuery->bind_param("s", $reasonName);
        $checkQuery->execute();
        $result = $checkQuery->get_result();
        $exists = $result->fetch_assoc();
        $checkQuery->close();
        
        if ($exists) {
            echo "⚠️  '$reasonName' ya existe (ID: {$exists['Id']}) - Saltando\n";
            $skippedCount++;
            continue;
        }
        
        // Insertar nuevo motivo
        $insertQuery = $mysqli->prepare("
            INSERT INTO file_reasons 
            (Id, Name, IdTypeReason, Enabled, RegistrationDate, UpdateDate, IdLastUserUpdate) 
            VALUES (?, ?, 0, 1, NOW(), NOW(), ?)
        ");
        $insertQuery->bind_param("isi", $nextId, $reasonName, $idLastUserUpdate);
        
        if ($insertQuery->execute()) {
            echo "✅ ID $nextId: '$reasonName' insertado\n";
            $insertedCount++;
            $nextId++;
        } else {
            echo "❌ Error insertando '$reasonName': " . $insertQuery->error . "\n";
            $errorCount++;
        }
        $insertQuery->close();
    }
    
    echo "\n" . str_repeat("=", 60) . "\n";
    echo "📊 RESUMEN:\n";
    echo str_repeat("=", 60) . "\n";
    echo "✅ Insertados: $insertedCount\n";
    echo "⚠️  Omitidos (ya existían): $skippedCount\n";
    echo "❌ Errores: $errorCount\n\n";
    
    // Mostrar todos los motivos actuales
    echo "📋 MOTIVOS ACTUALES EN LA BASE DE DATOS:\n";
    echo str_repeat("=", 80) . "\n";
    $allReasons = $mysqli->query("SELECT Id, Name, Enabled FROM file_reasons ORDER BY Id");
    if ($allReasons && $allReasons->num_rows > 0) {
        echo sprintf("%-5s %-60s %-10s\n", "ID", "Nombre", "Enabled");
        echo str_repeat("-", 75) . "\n";
        while ($reason = $allReasons->fetch_assoc()) {
            echo sprintf("%-5s %-60s %-10s\n", 
                $reason['Id'], 
                $reason['Name'],
                $reason['Enabled']
            );
        }
    } else {
        echo "No hay motivos registrados\n";
    }
    
    $mysqli->close();
    
    echo "\n✅ Proceso completado\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
