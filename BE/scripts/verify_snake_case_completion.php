<?php
/**
 * Verificar que todas las referencias estén en snake_case
 */

echo "=== VERIFICACIÓN DE CONVERSIÓN A SNAKE_CASE ===\n\n";

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

sort($tables);

echo "📊 Tablas en la base de datos (" . count($tables) . "):\n";
echo str_repeat("=", 60) . "\n";

$nonSnakeCase = [];
foreach ($tables as $table) {
    // Verificar si tiene mayúsculas o no tiene guiones bajos cuando debería
    if (preg_match('/[A-Z]/', $table)) {
        $nonSnakeCase[] = $table;
        echo "⚠️  $table (tiene mayúsculas)\n";
    } elseif (!preg_match('/[a-z]+(_[a-z]+)+/', $table) && strlen($table) > 8) {
        // Tablas simples de una palabra están bien (file, user, etc.)
        // Pero si es compuesta debería tener guiones bajos
        if (preg_match('/[a-z]{8,}/', $table)) {
            // Verificar si es una palabra compuesta sin guiones bajos
            $nonSnakeCase[] = $table;
            echo "⚠️  $table (posible palabra compuesta sin guiones bajos)\n";
        } else {
            echo "✅ $table\n";
        }
    } else {
        echo "✅ $table\n";
    }
}

echo "\n" . str_repeat("=", 60) . "\n";

if (empty($nonSnakeCase)) {
    echo "✅ Todas las tablas están en snake_case o son palabras simples\n";
} else {
    echo "⚠️  Tablas que pueden necesitar conversión: " . count($nonSnakeCase) . "\n";
}

$mysqli->close();
