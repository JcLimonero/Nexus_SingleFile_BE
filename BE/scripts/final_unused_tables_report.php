<?php
/**
 * Reporte final de tablas no utilizadas con verificación manual
 */

echo "=== REPORTE FINAL: TABLAS NO UTILIZADAS ===\n\n";

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

$mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);

if ($mysqli->connect_error) {
    die("❌ Error de conexión: " . $mysqli->connect_error . "\n");
}

// Obtener todas las tablas
$result = $mysqli->query("SHOW TABLES");
$tablesInDB = [];
while ($row = $result->fetch_array()) {
    $tablesInDB[] = $row[0];
}

$mysqli->close();

// Tablas verificadas manualmente como NO USADAS
$confirmedUnused = [
    'appversion' => [
        'status' => 'No usado',
        'category' => 'Configuración Externa',
        'recommendation' => 'Puede ser útil para control de versiones de app, pero no se usa actualmente'
    ],
    'bank' => [
        'status' => 'No usado',
        'category' => 'Configuración Externa',
        'recommendation' => 'Puede ser para catálogo de bancos, no implementado'
    ],
    'cfdi' => [
        'status' => 'No usado',
        'category' => 'Configuración Externa',
        'recommendation' => 'Puede ser para catálogo CFDI, no implementado'
    ],
    'file_extraordinary_events' => [
        'status' => 'No usado',
        'category' => 'Futuro/Planeado',
        'recommendation' => 'Parece ser para eventos extraordinarios, funcionalidad no implementada'
    ],
    'file_extraordinary_type' => [
        'status' => 'No usado',
        'category' => 'Futuro/Planeado',
        'recommendation' => 'Relacionada con file_extraordinary_events, no implementada'
    ],
    'file_release_steps' => [
        'status' => 'No usado',
        'category' => 'Futuro/Planeado',
        'recommendation' => 'Parece ser para pasos de liberación de expedientes, no implementado'
    ],
    'file_tracking' => [
        'status' => 'No usado',
        'category' => 'Futuro/Planeado',
        'recommendation' => 'Tracking de archivos, funcionalidad no implementada'
    ],
    'insurancecarrier' => [
        'status' => 'No usado',
        'category' => 'Configuración Externa',
        'recommendation' => 'Catálogo de aseguradoras, no implementado'
    ],
    'smtp_configurator' => [
        'status' => 'No usado',
        'category' => 'Configuración Externa',
        'recommendation' => 'Configuración SMTP en BD, pero se usa configuración en archivos'
    ],
    'tracking_file' => [
        'status' => 'No usado',
        'category' => 'Legacy/Deprecated',
        'recommendation' => 'Parece ser legacy, posiblemente reemplazado por otra funcionalidad'
    ],
    'tracking_operation' => [
        'status' => 'No usado',
        'category' => 'Legacy/Deprecated',
        'recommendation' => 'Parece ser legacy, posiblemente reemplazado por otra funcionalidad'
    ],
    'view_all_relations' => [
        'status' => 'No usado',
        'category' => 'Vista No Implementada',
        'recommendation' => 'Vista creada pero no utilizada en código'
    ],
    'view_files' => [
        'status' => 'No usado',
        'category' => 'Vista No Implementada',
        'recommendation' => 'Vista creada pero no utilizada en código'
    ],
    'view_files_by_client' => [
        'status' => 'No usado',
        'category' => 'Vista No Implementada',
        'recommendation' => 'Vista creada pero no utilizada en código'
    ]
];

// Tablas que SÍ se usan (verificadas manualmente)
$confirmedUsed = [
    'documentfile_error' => 'Usada en DocumentModel.php para JOINs con DocumentByFile',
    'activitylog' => 'Usada en Routes.php (puede ser diferente de user_activity_logs)',
    'migrations' => 'Tabla del sistema CodeIgniter',
    'view_client_company_amount' => 'Usada en Config/AML.php para cálculos de montos'
];

// Remover documentfile_error de la lista de no usadas si estaba ahí
if (isset($confirmedUnused['documentfile_error'])) {
    unset($confirmedUnused['documentfile_error']);
}

echo str_repeat("=", 80) . "\n";
echo "❌ TABLAS CONFIRMADAS COMO NO UTILIZADAS (" . count($confirmedUnused) . "):\n";
echo str_repeat("=", 80) . "\n\n";

foreach ($confirmedUnused as $table => $info) {
    echo "📋 $table\n";
    echo "   Categoría: {$info['category']}\n";
    echo "   Estado: {$info['status']}\n";
    echo "   Recomendación: {$info['recommendation']}\n\n";
}

echo str_repeat("=", 80) . "\n";
echo "✅ TABLAS QUE SÍ SE USAN (verificadas manualmente):\n";
echo str_repeat("=", 80) . "\n\n";

foreach ($confirmedUsed as $table => $reason) {
    echo "✅ $table\n";
    echo "   Razón: $reason\n\n";
}

echo str_repeat("=", 80) . "\n";
echo "📊 RESUMEN:\n";
echo str_repeat("=", 80) . "\n";
echo "Total de tablas en BD: " . count($tablesInDB) . "\n";
echo "Tablas en uso: " . (count($tablesInDB) - count($confirmedUnused)) . "\n";
echo "Tablas no usadas: " . count($confirmedUnused) . "\n\n";

echo "💡 RECOMENDACIONES POR CATEGORÍA:\n\n";

$byCategory = [];
foreach ($confirmedUnused as $table => $info) {
    $cat = $info['category'];
    if (!isset($byCategory[$cat])) {
        $byCategory[$cat] = [];
    }
    $byCategory[$cat][] = $table;
}

foreach ($byCategory as $category => $tables) {
    echo "📁 $category (" . count($tables) . " tablas):\n";
    foreach ($tables as $table) {
        echo "   - $table\n";
    }
    
    switch ($category) {
        case 'Legacy/Deprecated':
            echo "   → Acción: Considerar eliminación después de verificar que no hay datos importantes\n\n";
            break;
        case 'Futuro/Planeado':
            echo "   → Acción: Mantener si hay planes de implementar estas funcionalidades\n\n";
            break;
        case 'Configuración Externa':
            echo "   → Acción: Mantener si pueden usarse en otros sistemas o futuras integraciones\n\n";
            break;
        case 'Vista No Implementada':
            echo "   → Acción: Evaluar si se necesitarán, si no, considerar eliminación\n\n";
            break;
        default:
            echo "   → Acción: Revisar caso por caso\n\n";
    }
}

echo str_repeat("=", 80) . "\n";
echo "🎯 ACCIONES SUGERIDAS:\n";
echo str_repeat("=", 80) . "\n";
echo "1. ELIMINAR (si no hay datos importantes):\n";
echo "   - tracking_file\n";
echo "   - tracking_operation\n";
echo "   - view_all_relations (si no se planea usar)\n";
echo "   - view_files (si no se planea usar)\n";
echo "   - view_files_by_client (si no se planea usar)\n\n";

echo "2. MANTENER (para futuro):\n";
echo "   - file_extraordinary_events\n";
echo "   - file_extraordinary_type\n";
echo "   - file_release_steps\n";
echo "   - file_tracking\n\n";

echo "3. EVALUAR:\n";
echo "   - appversion, bank, cfdi, insurancecarrier, smtp_configurator\n";
echo "   → Verificar si se usarán en otros sistemas o integraciones futuras\n";
