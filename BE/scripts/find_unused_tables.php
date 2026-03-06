<?php
/**
 * Script para encontrar tablas que no se usan en el código
 */

echo "=== ANÁLISIS DE TABLAS NO UTILIZADAS ===\n\n";

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

$mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);

if ($mysqli->connect_error) {
    die("❌ Error de conexión: " . $mysqli->connect_error . "\n");
}

echo "✅ Conectado a la base de datos: {$db['database']}\n\n";

// Obtener todas las tablas de la BD
$result = $mysqli->query("SHOW TABLES");
$tablesInDB = [];
while ($row = $result->fetch_array()) {
    $tablesInDB[] = $row[0];
}

echo "📊 Total de tablas en BD: " . count($tablesInDB) . "\n\n";

// Obtener todas las vistas también
$result = $mysqli->query("SHOW FULL TABLES WHERE Table_type = 'VIEW'");
$viewsInDB = [];
while ($row = $result->fetch_array()) {
    $viewsInDB[] = $row[0];
}

echo "📊 Total de vistas en BD: " . count($viewsInDB) . "\n\n";

$mysqli->close();

// Buscar referencias en el código
echo "🔍 Buscando referencias en el código...\n\n";

$codebasePath = __DIR__ . '/../app';
$usedTables = [];
$unusedTables = [];

foreach ($tablesInDB as $table) {
    $tableLower = strtolower($table);
    $tableVariants = [
        $table,
        $tableLower,
        '`' . $table . '`',
        "'" . $table . "'",
        '"' . $table . '"',
        str_replace('_', '', $table),
        str_replace('_', ' ', $table)
    ];
    
    $found = false;
    $foundIn = [];
    
    // Buscar en archivos PHP
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($codebasePath)
    );
    
    foreach ($iterator as $file) {
        if ($file->isFile() && $file->getExtension() === 'php') {
            $content = file_get_contents($file->getPathname());
            
            foreach ($tableVariants as $variant) {
                // Buscar patrones comunes de uso de tablas
                $patterns = [
                    "/->table\(['\"]" . preg_quote($variant, '/') . "['\"]/i",
                    "/protected\s+\\\$table\s*=\s*['\"]" . preg_quote($variant, '/') . "['\"]/i",
                    "/FROM\s+[`'\"]?" . preg_quote($variant, '/') . "[`'\"]?/i",
                    "/JOIN\s+[`'\"]?" . preg_quote($variant, '/') . "[`'\"]?/i",
                    "/INTO\s+[`'\"]?" . preg_quote($variant, '/') . "[`'\"]?/i",
                    "/UPDATE\s+[`'\"]?" . preg_quote($variant, '/') . "[`'\"]?/i",
                    "/DELETE\s+FROM\s+[`'\"]?" . preg_quote($variant, '/') . "[`'\"]?/i",
                    "/SHOW\s+TABLES\s+LIKE\s+['\"]" . preg_quote($variant, '/') . "['\"]/i",
                ];
                
                foreach ($patterns as $pattern) {
                    if (preg_match($pattern, $content)) {
                        $found = true;
                        $relativePath = str_replace(__DIR__ . '/../', '', $file->getPathname());
                        if (!in_array($relativePath, $foundIn)) {
                            $foundIn[] = $relativePath;
                        }
                        break 2;
                    }
                }
            }
        }
    }
    
    if ($found) {
        $usedTables[$table] = $foundIn;
    } else {
        $unusedTables[] = $table;
    }
}

// Mostrar resultados
echo str_repeat("=", 80) . "\n";
echo "📋 TABLAS UTILIZADAS EN EL CÓDIGO (" . count($usedTables) . "):\n";
echo str_repeat("=", 80) . "\n";

foreach ($usedTables as $table => $files) {
    echo "✅ $table\n";
    if (count($files) <= 3) {
        foreach ($files as $file) {
            echo "   - $file\n";
        }
    } else {
        foreach (array_slice($files, 0, 3) as $file) {
            echo "   - $file\n";
        }
        echo "   ... y " . (count($files) - 3) . " archivo(s) más\n";
    }
    echo "\n";
}

echo str_repeat("=", 80) . "\n";
echo "⚠️  TABLAS NO UTILIZADAS EN EL CÓDIGO (" . count($unusedTables) . "):\n";
echo str_repeat("=", 80) . "\n";

if (empty($unusedTables)) {
    echo "✅ No se encontraron tablas sin usar\n";
} else {
    foreach ($unusedTables as $table) {
        echo "❌ $table\n";
    }
}

echo "\n";

// Verificar vistas también
echo str_repeat("=", 80) . "\n";
echo "📋 VISTAS EN LA BASE DE DATOS (" . count($viewsInDB) . "):\n";
echo str_repeat("=", 80) . "\n";

$usedViews = [];
$unusedViews = [];

foreach ($viewsInDB as $view) {
    $found = false;
    
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($codebasePath)
    );
    
    foreach ($iterator as $file) {
        if ($file->isFile() && $file->getExtension() === 'php') {
            $content = file_get_contents($file->getPathname());
            
            $patterns = [
                "/FROM\s+[`'\"]?" . preg_quote($view, '/') . "[`'\"]?/i",
                "/JOIN\s+[`'\"]?" . preg_quote($view, '/') . "[`'\"]?/i",
            ];
            
            foreach ($patterns as $pattern) {
                if (preg_match($pattern, $content)) {
                    $found = true;
                    break 2;
                }
            }
        }
    }
    
    if ($found) {
        $usedViews[] = $view;
    } else {
        $unusedViews[] = $view;
    }
}

foreach ($usedViews as $view) {
    echo "✅ $view (usada)\n";
}

if (!empty($unusedViews)) {
    echo "\n⚠️  Vistas no utilizadas:\n";
    foreach ($unusedViews as $view) {
        echo "❌ $view\n";
    }
}

echo "\n" . str_repeat("=", 80) . "\n";
echo "📊 RESUMEN:\n";
echo "  Tablas en BD: " . count($tablesInDB) . "\n";
echo "  Tablas usadas: " . count($usedTables) . "\n";
echo "  Tablas no usadas: " . count($unusedTables) . "\n";
echo "  Vistas en BD: " . count($viewsInDB) . "\n";
echo "  Vistas usadas: " . count($usedViews) . "\n";
echo "  Vistas no usadas: " . count($unusedViews) . "\n";
