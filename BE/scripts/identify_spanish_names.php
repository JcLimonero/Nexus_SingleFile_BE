<?php
/**
 * Identificar nombres de tablas y columnas en español
 */

echo "=== IDENTIFICACIÓN DE NOMBRES EN ESPAÑOL ===\n\n";

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

$mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);

if ($mysqli->connect_error) {
    die("❌ Error: " . $mysqli->connect_error . "\n");
}

// Palabras en español comunes
$spanishWords = [
    'expedientes' => 'files',
    'corregir' => 'correct',
    'beneficiario' => 'beneficiary',
    'geolog' => 'geo_log',
    'rol' => 'role',
    'modelo' => 'model',
    'asesor' => 'advisor',
];

// Obtener todas las tablas
$result = $mysqli->query("SHOW TABLES");
$tables = [];
while ($row = $result->fetch_array()) {
    $tables[] = $row[0];
}

sort($tables);

echo "📋 TABLAS CON NOMBRES EN ESPAÑOL:\n";
echo str_repeat("=", 80) . "\n\n";

$tablesToRename = [];

foreach ($tables as $table) {
    $hasSpanish = false;
    $suggestedName = $table;
    
    // Verificar palabras en español
    foreach ($spanishWords as $spanish => $english) {
        if (stripos($table, $spanish) !== false) {
            $hasSpanish = true;
            $suggestedName = str_ireplace($spanish, $english, $suggestedName);
        }
    }
    
    // Verificaciones específicas
    if (stripos($table, 'expedientes') !== false) {
        $hasSpanish = true;
        if ($table === 'expedientes_corregir') {
            $suggestedName = 'files_to_correct';
        }
    }
    
    if (stripos($table, 'beneficiario') !== false) {
        $hasSpanish = true;
        if ($table === 'file_pld_beneficiario_final') {
            $suggestedName = 'file_pld_beneficial_owner';
        }
    }
    
    if (stripos($table, 'rol') !== false && stripos($table, 'role') === false) {
        $hasSpanish = true;
        if ($table === 'user_rol') {
            $suggestedName = 'user_role';
        }
    }
    
    if ($hasSpanish) {
        echo "⚠️  $table → $suggestedName\n";
        $tablesToRename[$table] = $suggestedName;
    }
}

// Verificar columnas en español
echo "\n📋 COLUMNAS CON NOMBRES EN ESPAÑOL:\n";
echo str_repeat("=", 80) . "\n\n";

$columnsToRename = [];

// Tablas principales a verificar
$tablesToCheck = ['order_by_car', 'file_pld_beneficiario_final', 'user_rol'];

foreach ($tablesToCheck as $tableName) {
    $result = $mysqli->query("SHOW COLUMNS FROM `$tableName`");
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $column = $row['Field'];
            $hasSpanish = false;
            $suggestedName = $column;
            
            // Verificar palabras en español
            if (stripos($column, 'Modelo') !== false) {
                $hasSpanish = true;
                $suggestedName = str_ireplace('Modelo', 'Model', $column);
            }
            if (stripos($column, 'Asesor') !== false) {
                $hasSpanish = true;
                $suggestedName = str_ireplace('Asesor', 'Advisor', $column);
            }
            if (stripos($column, 'Rol') !== false && stripos($column, 'Role') === false) {
                $hasSpanish = true;
                $suggestedName = str_ireplace('Rol', 'Role', $column);
            }
            
            if ($hasSpanish) {
                echo "⚠️  $tableName.$column → $tableName.$suggestedName\n";
                if (!isset($columnsToRename[$tableName])) {
                    $columnsToRename[$tableName] = [];
                }
                $columnsToRename[$tableName][$column] = $suggestedName;
            }
        }
    }
}

echo "\n" . str_repeat("=", 80) . "\n";
echo "📊 RESUMEN:\n";
echo str_repeat("=", 80) . "\n";
echo "Tablas a renombrar: " . count($tablesToRename) . "\n";
echo "Tablas con columnas a renombrar: " . count($columnsToRename) . "\n";

$mysqli->close();
