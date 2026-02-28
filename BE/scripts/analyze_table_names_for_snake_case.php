<?php
/**
 * Analizar nombres de tablas para convertir a snake_case
 */

echo "=== ANÁLISIS DE TABLAS PARA CONVERTIR A SNAKE_CASE ===\n\n";

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

$mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);

if ($mysqli->connect_error) {
    die("❌ Error: " . $mysqli->connect_error . "\n");
}

// Función para convertir PascalCase a snake_case
function pascalToSnakeCase($str) {
    // Insertar guión bajo antes de letras mayúsculas (excepto la primera)
    $result = preg_replace('/([a-z])([A-Z])/', '$1_$2', $str);
    // Convertir a minúsculas
    return strtolower($result);
}

// Obtener todas las tablas
$result = $mysqli->query("SHOW TABLES");
$tables = [];
while ($row = $result->fetch_array()) {
    $tables[] = $row[0];
}

sort($tables);

echo "📊 Total de tablas: " . count($tables) . "\n\n";

// Identificar tablas que necesitan conversión (PascalCase sin guiones bajos)
$renameMap = [];

foreach ($tables as $table) {
    // Si tiene mayúsculas y no tiene guiones bajos, necesita conversión
    if (preg_match('/[A-Z]/', $table) && strpos($table, '_') === false) {
        $snakeCase = pascalToSnakeCase($table);
        if ($snakeCase !== $table) {
            $renameMap[$table] = $snakeCase;
        }
    }
}

echo "📝 MAPEO DE CAMBIOS PROPUESTOS:\n";
echo str_repeat("=", 80) . "\n\n";

foreach ($renameMap as $oldName => $newName) {
    echo "$oldName → $newName\n";
}

echo "\n" . str_repeat("=", 80) . "\n";
echo "Total de tablas a renombrar: " . count($renameMap) . "\n";

$mysqli->close();
