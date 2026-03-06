<?php
/**
 * Verificar que las tablas fueron eliminadas y las vistas se mantuvieron
 */

echo "=== VERIFICACIÓN POST-ELIMINACIÓN ===\n\n";

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

$mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);

if ($mysqli->connect_error) {
    die("❌ Error: " . $mysqli->connect_error . "\n");
}

// Tablas que deberían haber sido eliminadas
$removedTables = [
    'appversion',
    'bank',
    'cfdi',
    'insurancecarrier',
    'smtp_configurator',
    'file_extraordinary_events',
    'file_extraordinary_type',
    'file_release_steps',
    'file_tracking',
    'tracking_file',
    'tracking_operation'
];

// Vistas que deberían mantenerse
$viewsToKeep = [
    'view_all_relations',
    'view_files',
    'view_files_by_client'
];

echo "🔍 Verificando tablas eliminadas...\n";
$stillExists = [];
foreach ($removedTables as $table) {
    $result = $mysqli->query("SHOW TABLES LIKE '$table'");
    if ($result && $result->num_rows > 0) {
        $stillExists[] = $table;
    }
}

if (empty($stillExists)) {
    echo "✅ Todas las tablas fueron eliminadas correctamente\n\n";
} else {
    echo "⚠️  Las siguientes tablas aún existen:\n";
    foreach ($stillExists as $table) {
        echo "  - $table\n";
    }
    echo "\n";
}

echo "🔍 Verificando vistas mantenidas...\n";
$viewsExist = [];
foreach ($viewsToKeep as $view) {
    $result = $mysqli->query("SHOW FULL TABLES WHERE Table_type = 'VIEW' AND Tables_in_" . $db['database'] . " = '$view'");
    if ($result && $result->num_rows > 0) {
        $viewsExist[] = $view;
        echo "  ✅ $view existe\n";
    } else {
        echo "  ⚠️  $view no existe\n";
    }
}

// Contar tablas y vistas restantes
$result = $mysqli->query("SHOW TABLES");
$allTables = [];
while ($row = $result->fetch_array()) {
    $allTables[] = $row[0];
}

$result = $mysqli->query("SHOW FULL TABLES WHERE Table_type = 'VIEW'");
$allViews = [];
while ($row = $result->fetch_array()) {
    $allViews[] = $row[0];
}

echo "\n" . str_repeat("=", 60) . "\n";
echo "📊 RESUMEN FINAL:\n";
echo str_repeat("=", 60) . "\n";
echo "Total de tablas en BD: " . count($allTables) . "\n";
echo "Total de vistas en BD: " . count($allViews) . "\n";
echo "Tablas eliminadas: " . (11 - count($stillExists)) . "\n";
echo "Vistas mantenidas: " . count($viewsExist) . " / " . count($viewsToKeep) . "\n";

$mysqli->close();
