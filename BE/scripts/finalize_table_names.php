<?php
/**
 * Verificar y documentar nombres finales de tablas
 */

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

$mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);

if ($mysqli->connect_error) {
    die("❌ Error: " . $mysqli->connect_error . "\n");
}

echo "=== NOMBRES FINALES DE TABLAS ===\n\n";

// Obtener todas las tablas
$result = $mysqli->query("SHOW TABLES");
$tables = [];
while ($row = $result->fetch_array()) {
    $tables[] = $row[0];
}

sort($tables);

echo "📊 Total de tablas: " . count($tables) . "\n\n";

// Crear mapeo: nombre almacenado (minúsculas) → nombre a usar en código (PascalCase)
$nameMapping = [];

foreach ($tables as $table) {
    // Convertir a PascalCase
    $pascalCase = str_replace('_', '', ucwords($table, '_'));
    $nameMapping[$table] = $pascalCase;
}

echo "📝 MAPEO: Nombre en BD → Nombre a usar en código\n";
echo str_repeat("=", 80) . "\n\n";

foreach ($nameMapping as $dbName => $codeName) {
    if ($dbName !== $codeName) {
        echo "$dbName → $codeName\n";
    } else {
        echo "$dbName (ya correcto)\n";
    }
}

echo "\n" . str_repeat("=", 80) . "\n";
echo "💡 NOTA IMPORTANTE:\n";
echo str_repeat("=", 80) . "\n";
echo "MySQL está configurado con lower_case_table_names=1\n";
echo "Esto significa que los nombres se almacenan en minúsculas en el sistema de archivos,\n";
echo "pero puedes usar PascalCase en las queries con backticks:\n";
echo "  SELECT * FROM `CustomerType`  -- Funciona aunque se almacene como 'customertype'\n";
echo "\n";
echo "El código debe usar nombres en PascalCase para consistencia.\n";

$mysqli->close();
