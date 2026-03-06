<?php
/**
 * Ejecutar migración 038: Convertir nombres de columnas a snake_case
 * 
 * Uso: php execute_038_convert_columns.php
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== MIGRACIÓN 038: CONVERTIR COLUMNAS A SNAKE_CASE ===\n\n";

// Cargar configuración
$configFile = __DIR__ . '/../../app/Config/database-config.json';
if (!file_exists($configFile)) {
    die("❌ Error: No se encontró el archivo de configuración: $configFile\n");
}

$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

echo "Base de datos: {$db['database']}\n";
echo "Host: {$db['hostname']}\n";
echo "Usuario: {$db['username']}\n\n";

echo "⚠️  ADVERTENCIA: Esta migración modificará los nombres de todas las columnas.\n";
echo "¿Has hecho backup de la base de datos? (s/n): ";
$handle = fopen("php://stdin", "r");
$line = trim(fgets($handle));
if (strtolower($line) !== 's') {
    echo "❌ Migración cancelada. Por favor haz backup primero.\n";
    exit(1);
}
fclose($handle);

// Conectar a la base de datos
try {
    $mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);
    
    if ($mysqli->connect_error) {
        die("❌ Error de conexión: " . $mysqli->connect_error . "\n");
    }
    
    echo "✅ Conectado a la base de datos\n\n";
    
    // Configurar charset
    $mysqli->set_charset("utf8mb4");
    
    // Desactivar verificación de foreign keys temporalmente
    $mysqli->query("SET FOREIGN_KEY_CHECKS = 0");
    
    // Leer el archivo SQL
    $sqlFile = __DIR__ . '/038_convert_columns_to_snake_case.sql';
    if (!file_exists($sqlFile)) {
        die("❌ Error: No se encontró el archivo de migración: $sqlFile\n");
    }
    
    echo "📄 Leyendo archivo de migración...\n";
    $sql = file_get_contents($sqlFile);
    
    // Dividir en statements individuales (separados por punto y coma)
    $statements = array_filter(
        array_map('trim', explode(';', $sql)),
        function($stmt) {
            return !empty($stmt) && 
                   !preg_match('/^(SET|SELECT|PREPARE|EXECUTE|DEALLOCATE)/i', trim($stmt)) &&
                   !preg_match('/^--/', trim($stmt)) &&
                   strlen(trim($stmt)) > 10; // Ignorar statements muy cortos
        }
    );
    
    echo "📋 Statements a ejecutar: " . count($statements) . "\n\n";
    
    $successCount = 0;
    $errorCount = 0;
    $skippedCount = 0;
    $errors = [];
    
    echo "🔄 Ejecutando migración...\n";
    echo str_repeat("-", 60) . "\n";
    
    foreach ($statements as $index => $statement) {
        $statement = trim($statement);
        
        if (empty($statement) || preg_match('/^--/', $statement)) {
            continue;
        }
        
        // Extraer información del statement para mostrar progreso
        if (preg_match('/ALTER TABLE `([^`]+)` CHANGE COLUMN `([^`]+)` `([^`]+)`/', $statement, $matches)) {
            $table = $matches[1];
            $oldColumn = $matches[2];
            $newColumn = $matches[3];
            
            // Verificar si la columna ya tiene el nombre nuevo
            $checkQuery = "SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.COLUMNS 
                          WHERE TABLE_SCHEMA = DATABASE() 
                          AND TABLE_NAME = '$table' 
                          AND COLUMN_NAME = '$newColumn'";
            
            $checkResult = $mysqli->query($checkQuery);
            if ($checkResult) {
                $row = $checkResult->fetch_assoc();
                if ($row['count'] > 0) {
                    echo "⚠️  $table.$oldColumn → $newColumn (ya existe, saltando)\n";
                    $skippedCount++;
                    continue;
                }
            }
            
            echo "Renombrando: $table.$oldColumn → $newColumn... ";
        } else {
            echo "Ejecutando statement " . ($index + 1) . "... ";
        }
        
        // Ejecutar el statement
        if ($mysqli->query($statement)) {
            echo "✅\n";
            $successCount++;
        } else {
            // Algunos errores son esperados (ej: columna ya renombrada, no existe)
            $errorMsg = $mysqli->error;
            if (strpos($errorMsg, 'Duplicate column name') !== false ||
                strpos($errorMsg, "Unknown column") !== false ||
                strpos($errorMsg, "doesn't exist") !== false) {
                echo "⚠️  (advertencia: $errorMsg)\n";
                $skippedCount++;
            } else {
                echo "❌ Error: $errorMsg\n";
                $errors[] = "Statement " . ($index + 1) . ": $errorMsg";
                $errorCount++;
            }
        }
    }
    
    // Reactivar verificación de foreign keys
    $mysqli->query("SET FOREIGN_KEY_CHECKS = 1");
    
    echo "\n" . str_repeat("=", 60) . "\n";
    echo "📊 RESUMEN:\n";
    echo str_repeat("=", 60) . "\n";
    echo "✅ Columnas renombradas: $successCount\n";
    echo "⚠️  Saltadas: $skippedCount\n";
    echo "❌ Errores: $errorCount\n\n";
    
    if (!empty($errors)) {
        echo "⚠️  Errores encontrados:\n";
        foreach ($errors as $error) {
            echo "  - $error\n";
        }
        echo "\n";
    }
    
    if ($errorCount === 0) {
        echo "✅ Migración completada exitosamente\n";
    } else {
        echo "⚠️  Migración completada con errores. Revisa los mensajes arriba.\n";
    }
    
    $mysqli->close();
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
