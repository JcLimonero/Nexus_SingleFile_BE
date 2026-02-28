<?php
/**
 * Analizar nombres de tablas para estandarización
 */

echo "=== ANÁLISIS DE NOMBRES DE TABLAS ===\n\n";

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

$mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);

if ($mysqli->connect_error) {
    die("❌ Error: " . $mysqli->connect_error . "\n");
}

// Obtener todas las tablas
$result = $mysqli->query("SHOW TABLES");
$tables = [];
while ($row = $result->fetch_array()) {
    $tables[] = $row[0];
}

echo "📊 Total de tablas: " . count($tables) . "\n\n";

// Analizar patrones
$patterns = [
    'PascalCase' => [],
    'snake_case' => [],
    'camelCase' => [],
    'UPPERCASE' => [],
    'lowercase' => [],
    'Mixed' => []
];

foreach ($tables as $table) {
    if (preg_match('/^[A-Z][a-zA-Z0-9]*$/', $table) && !strpos($table, '_')) {
        $patterns['PascalCase'][] = $table;
    } elseif (preg_match('/^[a-z]+(_[a-z]+)+$/', $table)) {
        $patterns['snake_case'][] = $table;
    } elseif (preg_match('/^[a-z][a-zA-Z0-9]*$/', $table) && !strpos($table, '_')) {
        $patterns['camelCase'][] = $table;
    } elseif (preg_match('/^[A-Z_]+$/', $table)) {
        $patterns['UPPERCASE'][] = $table;
    } elseif (preg_match('/^[a-z_]+$/', $table)) {
        $patterns['lowercase'][] = $table;
    } else {
        $patterns['Mixed'][] = $table;
    }
}

echo "📋 PATRONES ENCONTRADOS:\n";
echo str_repeat("=", 60) . "\n";

foreach ($patterns as $pattern => $tablesInPattern) {
    if (!empty($tablesInPattern)) {
        echo "\n$pattern (" . count($tablesInPattern) . "):\n";
        foreach ($tablesInPattern as $table) {
            echo "  - $table\n";
        }
    }
}

// Proponer estándar
echo "\n" . str_repeat("=", 60) . "\n";
echo "💡 PROPUESTA DE ESTÁNDAR:\n";
echo str_repeat("=", 60) . "\n";
echo "Estilo recomendado: PascalCase (ej: CustomerType, FileStatus)\n";
echo "Razón: Consistente con CodeIgniter y más legible\n\n";

// Generar mapeo de cambios
echo "📝 MAPEO DE CAMBIOS PROPUESTOS:\n";
echo str_repeat("=", 60) . "\n\n";

$renameMap = [];

foreach ($tables as $table) {
    // Convertir snake_case a PascalCase
    if (strpos($table, '_') !== false || strtolower($table) === $table) {
        $newName = str_replace('_', '', ucwords($table, '_'));
        if ($newName !== $table) {
            $renameMap[$table] = $newName;
        }
    }
}

foreach ($renameMap as $old => $new) {
    echo "  $old → $new\n";
}

$mysqli->close();
