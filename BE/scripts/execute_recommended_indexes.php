<?php
/**
 * Script para ejecutar la creación de índices recomendados
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "═══════════════════════════════════════════════════════════════════════════════\n";
echo "  CREAR ÍNDICES RECOMENDADOS\n";
echo "═══════════════════════════════════════════════════════════════════════════════\n\n";

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

try {
    $mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);
    
    if ($mysqli->connect_error) {
        die("❌ Error de conexión: " . $mysqli->connect_error . "\n");
    }
    
    echo "✅ Conectado a la base de datos: {$db['database']}\n\n";
    
    // Leer el script SQL
    $sqlFile = __DIR__ . '/create_recommended_indexes.sql';
    if (!file_exists($sqlFile)) {
        die("❌ Archivo SQL no encontrado: $sqlFile\n");
    }
    
    $sql = file_get_contents($sqlFile);
    
    // Dividir en statements individuales, manejando múltiples líneas
    $lines = explode("\n", $sql);
    $statements = [];
    $currentStatement = '';
    
    foreach ($lines as $line) {
        $line = trim($line);
        
        // Saltar comentarios y líneas vacías
        if (empty($line) || preg_match('/^--/', $line) || preg_match('/^\/\*/', $line)) {
            continue;
        }
        
        $currentStatement .= ' ' . $line;
        
        // Si la línea termina con punto y coma, tenemos un statement completo
        if (substr(rtrim($line), -1) === ';') {
            $stmt = trim($currentStatement);
            if (!empty($stmt) && preg_match('/CREATE\s+(UNIQUE\s+)?INDEX/i', $stmt)) {
                $statements[] = $stmt;
            }
            $currentStatement = '';
        }
    }
    
    $created = 0;
    $skipped = 0;
    $errors = 0;
    
    echo "═══════════════════════════════════════════════════════════════════════════════\n";
    echo "EJECUTANDO CREACIÓN DE ÍNDICES\n";
    echo "═══════════════════════════════════════════════════════════════════════════════\n\n";
    
    foreach ($statements as $statement) {
        if (empty(trim($statement))) continue;
        
        // Extraer nombre del índice de la declaración
        if (preg_match('/CREATE\s+(UNIQUE\s+)?INDEX\s+`?([^`\s]+)`?/i', $statement, $matches)) {
            $indexName = $matches[2];
            
            // Extraer nombre de tabla
            if (preg_match('/ON\s+`?([^`\s]+)`?/i', $statement, $tableMatches)) {
                $tableName = $tableMatches[1];
                
                // Verificar si el índice ya existe
                $checkQuery = "
                    SELECT COUNT(*) as count 
                    FROM INFORMATION_SCHEMA.STATISTICS 
                    WHERE TABLE_SCHEMA = '{$db['database']}' 
                    AND TABLE_NAME = '$tableName' 
                    AND INDEX_NAME = '$indexName'
                ";
                
                $checkResult = $mysqli->query($checkQuery);
                $exists = $checkResult && $checkResult->fetch_assoc()['count'] > 0;
                
                if ($exists) {
                    echo "⏭️  Índice ya existe: `$indexName` en tabla `$tableName`\n";
                    $skipped++;
                } else {
                    // Ejecutar CREATE INDEX
                    if ($mysqli->query($statement)) {
                        echo "✅ Índice creado: `$indexName` en tabla `$tableName`\n";
                        $created++;
                    } else {
                        echo "❌ Error creando índice `$indexName`: " . $mysqli->error . "\n";
                        $errors++;
                    }
                }
            }
        }
    }
    
    echo "\n";
    echo "═══════════════════════════════════════════════════════════════════════════════\n";
    echo "RESUMEN\n";
    echo "═══════════════════════════════════════════════════════════════════════════════\n";
    echo "Índices creados: $created\n";
    echo "Índices omitidos (ya existían): $skipped\n";
    echo "Errores: $errors\n";
    echo "\n";
    
    if ($created > 0) {
        echo "✅ Proceso completado exitosamente\n";
    } else if ($skipped > 0 && $errors == 0) {
        echo "✅ Todos los índices ya existían\n";
    }
    
    echo "═══════════════════════════════════════════════════════════════════════════════\n";
    
    $mysqli->close();
    
} catch (Exception $e) {
    echo "\n❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
    exit(1);
}
