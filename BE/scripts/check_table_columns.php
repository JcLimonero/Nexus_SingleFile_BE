<?php
/**
 * Script simple para verificar columnas usando mysqli directamente
 */

echo "=== Verificación de Columnas en Tablas ===\n\n";

// Cargar configuración desde JSON
$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

$mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);

if ($mysqli->connect_error) {
    die("Error de conexión: " . $mysqli->connect_error . "\n");
}

$tables = ['File_Status', 'DocumentFile_Status', 'DocumentFile_Error', 'File', 'File_Reasons', 'File_Extraordinary_Reasons'];

foreach ($tables as $table) {
    echo "--- $table ---\n";
    
    $result = $mysqli->query("SHOW COLUMNS FROM `$table`");
    if (!$result) {
        echo "  ⚠️  Error: " . $mysqli->error . "\n\n";
        continue;
    }
    
    $hasDescription = false;
    $hasName = false;
    
    while ($row = $result->fetch_assoc()) {
        $fieldName = $row['Field'];
        if (strtolower($fieldName) === 'description') {
            $hasDescription = true;
        }
        if (strtolower($fieldName) === 'name') {
            $hasName = true;
        }
    }
    
    if ($hasDescription && $hasName) {
        echo "  ✅ Tiene Description y Name\n";
    } elseif ($hasDescription) {
        echo "  ⚠️  Solo tiene Description\n";
    } elseif ($hasName) {
        echo "  ✅ Solo tiene Name\n";
    }
    
    echo "\n";
}

$mysqli->close();
