<?php
/**
 * Verificar qué vistas se usan en el código y si existen en la BD
 */

echo "=== Verificación de Uso de Vistas ===\n\n";

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

$mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);

if ($mysqli->connect_error) {
    die("Error: " . $mysqli->connect_error . "\n");
}

// Obtener todas las vistas de la BD
$result = $mysqli->query("SHOW FULL TABLES WHERE Table_type = 'VIEW'");
$viewsInDB = [];
while ($row = $result->fetch_array()) {
    $viewsInDB[] = strtolower($row[0]);
}

echo "Vistas en la BD (" . count($viewsInDB) . "):\n";
foreach ($viewsInDB as $view) {
    echo "  ✅ $view\n";
}
echo "\n";

// Vistas que se usan en el código (según búsqueda anterior)
$viewsUsedInCode = [
    'view_client_relations',
    'view_document_name',
    'view_client',
    'view_files',
    'view_all_relations',
    'view_client_company_amount',
    'view_files_by_client'
];

echo "Vistas usadas en el código:\n";
$missingViews = [];
foreach ($viewsUsedInCode as $view) {
    $viewLower = strtolower($view);
    if (in_array($viewLower, $viewsInDB)) {
        echo "  ✅ $view - EXISTE\n";
    } else {
        echo "  ❌ $view - NO EXISTE\n";
        $missingViews[] = $view;
    }
}

echo "\n";

if (!empty($missingViews)) {
    echo "⚠️  VISTAS FALTANTES:\n";
    foreach ($missingViews as $view) {
        echo "   - $view\n";
    }
} else {
    echo "✅ Todas las vistas usadas en el código existen en la BD\n";
}

// Verificar estructura de vistas críticas
echo "\n=== Verificación de Estructura de Vistas Críticas ===\n\n";

$criticalViews = ['view_client_relations', 'view_document_name', 'view_client'];

foreach ($criticalViews as $view) {
    $viewLower = strtolower($view);
    if (in_array($viewLower, $viewsInDB)) {
        echo "Vista: $view\n";
        $result = $mysqli->query("DESCRIBE `$view`");
        if ($result) {
            echo "  Columnas:\n";
            while ($row = $result->fetch_assoc()) {
                echo "    - {$row['Field']} ({$row['Type']})\n";
            }
        } else {
            echo "  ⚠️  Error al describir: " . $mysqli->error . "\n";
        }
        echo "\n";
    }
}

$mysqli->close();
