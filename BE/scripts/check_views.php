<?php
/**
 * Verificar qué vistas existen en la base de datos y cuáles se usan en el código
 */

echo "=== Verificación de Vistas en Base de Datos ===\n\n";

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

$mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);

if ($mysqli->connect_error) {
    die("Error: " . $mysqli->connect_error . "\n");
}

// Obtener todas las vistas de la base de datos
$result = $mysqli->query("SHOW FULL TABLES WHERE Table_type = 'VIEW'");
$views = [];
while ($row = $result->fetch_array()) {
    $views[] = $row[0];
}

echo "Vistas encontradas en la BD (" . count($views) . "):\n";
foreach ($views as $view) {
    echo "  - $view\n";
}

echo "\n";

// Buscar posibles nombres de vistas en el código (patrones comunes)
$possibleViews = [
    'v_', 'vw_', 'view_', '_view', '_View', 'View'
];

// Verificar si hay tablas que podrían ser vistas
$allTables = $mysqli->query("SHOW FULL TABLES");
echo "Todas las tablas y vistas:\n";
$tableTypes = [];
while ($row = $allTables->fetch_array()) {
    $tableName = $row[0];
    $tableType = $row[1];
    if ($tableType === 'VIEW') {
        echo "  [VIEW] $tableName\n";
    } else {
        echo "  [TABLE] $tableName\n";
    }
    $tableTypes[$tableName] = $tableType;
}

$mysqli->close();
