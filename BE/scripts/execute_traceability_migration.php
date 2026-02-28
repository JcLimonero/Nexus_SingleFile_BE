<?php
/**
 * Ejecutar migración de columnas de trazabilidad
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== EJECUTAR MIGRACIÓN DE TRAZABILIDAD ===\n\n";

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

echo "Base de datos: {$db['database']}\n";
echo "Host: {$db['hostname']}\n\n";

try {
    $mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);
    
    if ($mysqli->connect_error) {
        die("❌ Error de conexión: " . $mysqli->connect_error . "\n");
    }
    
    echo "✅ Conectado a la base de datos\n\n";
    
    // Leer el archivo SQL
    $sqlFile = __DIR__ . '/../DB/migrations/020_add_traceability_columns.sql';
    if (!file_exists($sqlFile)) {
        die("❌ Archivo SQL no encontrado: $sqlFile\n");
    }
    
    $sql = file_get_contents($sqlFile);
    
    // Dividir en líneas y procesar
    $lines = explode("\n", $sql);
    $statements = [];
    $currentStatement = '';
    
    foreach ($lines as $line) {
        $line = trim($line);
        
        // Saltar comentarios y líneas vacías
        if (empty($line) || preg_match('/^--/', $line) || preg_match('/^SELECT/', $line)) {
            continue;
        }
        
        $currentStatement .= $line . " ";
        
        // Si la línea termina con ;, tenemos un statement completo
        if (substr(rtrim($line), -1) === ';') {
            $stmt = trim($currentStatement);
            if (!empty($stmt) && preg_match('/ALTER TABLE/i', $stmt)) {
                $statements[] = $stmt;
            }
            $currentStatement = '';
        }
    }
    
    echo "🔄 Ejecutando " . count($statements) . " statements...\n";
    echo str_repeat("=", 80) . "\n";
    
    $successCount = 0;
    $errorCount = 0;
    $skippedCount = 0;
    
    foreach ($statements as $index => $statement) {
        // Extraer el nombre de la tabla del ALTER TABLE
        if (preg_match('/ALTER TABLE `([^`]+)`/i', $statement, $matches)) {
            $tableName = $matches[1];
            
            // Verificar si las columnas ya existen antes de agregarlas
            $columnsResult = $mysqli->query("DESCRIBE `$tableName`");
            if (!$columnsResult) {
                echo "⚠️  Error al verificar tabla $tableName: " . $mysqli->error . "\n";
                $skippedCount++;
                continue;
            }
            
            $existingColumns = [];
            while ($col = $columnsResult->fetch_assoc()) {
                $existingColumns[] = $col['Field'];
            }
            
            // Verificar si alguna de las columnas a agregar ya existe
            $columnsToAdd = [];
            if (preg_match_all('/ADD COLUMN `([^`]+)`/', $statement, $colMatches)) {
                $columnsToAdd = $colMatches[1];
            }
            
            $allExist = true;
            foreach ($columnsToAdd as $colToAdd) {
                if (!in_array($colToAdd, $existingColumns)) {
                    $allExist = false;
                    break;
                }
            }
            
            if ($allExist && !empty($columnsToAdd)) {
                echo "⏭️  Tabla '$tableName': Todas las columnas ya existen - Saltando\n";
                $skippedCount++;
                continue;
            }
            
            // Ejecutar el ALTER TABLE
            if ($mysqli->query($statement . ';')) {
                echo "✅ Tabla '$tableName': Columnas agregadas exitosamente\n";
                $successCount++;
            } else {
                echo "❌ Tabla '$tableName': Error - " . $mysqli->error . "\n";
                $errorCount++;
            }
        }
    }
    
    echo "\n" . str_repeat("=", 80) . "\n";
    echo "📊 RESUMEN:\n";
    echo str_repeat("=", 80) . "\n";
    echo "✅ Exitosos: $successCount\n";
    echo "⏭️  Omitidos (ya existían): $skippedCount\n";
    echo "❌ Errores: $errorCount\n\n";
    
    $mysqli->close();
    
    echo "✅ Migración completada\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
