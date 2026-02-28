<?php
/**
 * Análisis detallado de tablas no utilizadas
 */

echo "=== ANÁLISIS DETALLADO DE TABLAS NO UTILIZADAS ===\n\n";

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

// Tablas que el script anterior identificó como no usadas
$potentiallyUnused = [
    'activitylog',
    'appversion',
    'bank',
    'cfdi',
    'documentfile_error',
    'file_extraordinary_events',
    'file_extraordinary_type',
    'file_release_steps',
    'file_tracking',
    'insurancecarrier',
    'migrations',
    'smtp_configurator',
    'tracking_file',
    'tracking_operation',
    'view_all_relations',
    'view_client_company_amount',
    'view_files',
    'view_files_by_client'
];

echo "🔍 Verificando uso detallado de tablas potencialmente no usadas...\n\n";

$codebasePath = __DIR__ . '/../app';
$detailedAnalysis = [];

foreach ($potentiallyUnused as $table) {
    $tableLower = strtolower($table);
    $tableUpper = ucfirst(str_replace('_', '', ucwords($table, '_')));
    $tableCamel = str_replace('_', '', ucwords($table, '_'));
    
    // Variantes de búsqueda
    $searchTerms = [
        $table,
        $tableLower,
        $tableUpper,
        $tableCamel,
        str_replace('_', '', $table),
        str_replace('_', ' ', $table),
        '`' . $table . '`',
        "'" . $table . "'",
    ];
    
    $found = false;
    $foundIn = [];
    $usageType = [];
    
    // Buscar en código
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($codebasePath)
    );
    
    foreach ($iterator as $file) {
        if ($file->isFile() && $file->getExtension() === 'php') {
            $content = file_get_contents($file->getPathname());
            $relativePath = str_replace(__DIR__ . '/../', '', $file->getPathname());
            
            foreach ($searchTerms as $term) {
                // Patrones más específicos
                $patterns = [
                    'table' => "/->table\(['\"]" . preg_quote($term, '/') . "['\"]/i",
                    'protected_table' => "/protected\s+\\\$table\s*=\s*['\"]" . preg_quote($term, '/') . "['\"]/i",
                    'from' => "/FROM\s+[`'\"]?" . preg_quote($term, '/') . "[`'\"]?/i",
                    'join' => "/JOIN\s+[`'\"]?" . preg_quote($term, '/') . "[`'\"]?/i",
                    'into' => "/INTO\s+[`'\"]?[`'\"]?" . preg_quote($term, '/') . "[`'\"]?/i",
                    'update' => "/UPDATE\s+[`'\"]?" . preg_quote($term, '/') . "[`'\"]?/i",
                    'delete' => "/DELETE\s+FROM\s+[`'\"]?" . preg_quote($term, '/') . "[`'\"]?/i",
                    'config' => "/['\"]" . preg_quote($term, '/') . "['\"]/i",
                ];
                
                foreach ($patterns as $type => $pattern) {
                    if (preg_match($pattern, $content)) {
                        $found = true;
                        if (!in_array($relativePath, $foundIn)) {
                            $foundIn[] = $relativePath;
                            $usageType[$relativePath] = $type;
                        }
                        break 2;
                    }
                }
            }
        }
    }
    
    // Buscar también en archivos de configuración
    $configFiles = [
        __DIR__ . '/../app/Config/AML.php',
        __DIR__ . '/../app/Config/Email.php',
        __DIR__ . '/../app/Config/Routes.php',
    ];
    
    foreach ($configFiles as $configFile) {
        if (file_exists($configFile)) {
            $content = file_get_contents($configFile);
            foreach ($searchTerms as $term) {
                if (preg_match("/" . preg_quote($term, '/') . "/i", $content)) {
                    $found = true;
                    $relativePath = str_replace(__DIR__ . '/../', '', $configFile);
                    if (!in_array($relativePath, $foundIn)) {
                        $foundIn[] = $relativePath;
                        $usageType[$relativePath] = 'config';
                    }
                    break;
                }
            }
        }
    }
    
    $detailedAnalysis[$table] = [
        'found' => $found,
        'files' => $foundIn,
        'usage_type' => $usageType
    ];
}

// Mostrar resultados
echo str_repeat("=", 80) . "\n";
echo "📋 ANÁLISIS DETALLADO:\n";
echo str_repeat("=", 80) . "\n\n";

$actuallyUnused = [];
$actuallyUsed = [];

foreach ($detailedAnalysis as $table => $info) {
    if ($info['found']) {
        $actuallyUsed[$table] = $info;
        echo "✅ $table - EN USO\n";
        foreach ($info['files'] as $file) {
            $type = $info['usage_type'][$file] ?? 'unknown';
            echo "   - $file ($type)\n";
        }
        echo "\n";
    } else {
        $actuallyUnused[] = $table;
    }
}

echo str_repeat("=", 80) . "\n";
echo "❌ TABLAS REALMENTE NO UTILIZADAS (" . count($actuallyUnused) . "):\n";
echo str_repeat("=", 80) . "\n";

if (empty($actuallyUnused)) {
    echo "✅ Todas las tablas están en uso\n";
} else {
    foreach ($actuallyUnused as $table) {
        echo "❌ $table\n";
    }
}

// Verificar si son tablas de sistema o legacy
echo "\n" . str_repeat("=", 80) . "\n";
echo "📝 CLASIFICACIÓN DE TABLAS NO USADAS:\n";
echo str_repeat("=", 80) . "\n\n";

$classification = [
    'Sistema/Infraestructura' => ['migrations'],
    'Legacy/Deprecated' => ['activitylog', 'tracking_file', 'tracking_operation'],
    'Futuro/Planeado' => ['file_extraordinary_events', 'file_extraordinary_type', 'file_release_steps', 'file_tracking'],
    'Configuración Externa' => ['bank', 'cfdi', 'insurancecarrier', 'smtp_configurator', 'appversion'],
    'Vistas No Implementadas' => ['view_all_relations', 'view_files', 'view_files_by_client']
];

foreach ($classification as $category => $tables) {
    $foundInCategory = array_intersect($actuallyUnused, $tables);
    if (!empty($foundInCategory)) {
        echo "📁 $category:\n";
        foreach ($foundInCategory as $table) {
            echo "   - $table\n";
        }
        echo "\n";
    }
}

echo str_repeat("=", 80) . "\n";
echo "📊 RESUMEN FINAL:\n";
echo str_repeat("=", 80) . "\n";
echo "Total de tablas en BD: " . count($tablesInDB) . "\n";
echo "Tablas en uso: " . (count($tablesInDB) - count($actuallyUnused)) . "\n";
echo "Tablas no usadas: " . count($actuallyUnused) . "\n";
echo "\n";
echo "💡 RECOMENDACIONES:\n";
echo "1. Tablas de sistema (migrations): Mantener\n";
echo "2. Tablas legacy: Considerar migración o eliminación después de verificar\n";
echo "3. Tablas de configuración externa: Pueden usarse en otros sistemas\n";
echo "4. Vistas no implementadas: Evaluar si se necesitarán en el futuro\n";
