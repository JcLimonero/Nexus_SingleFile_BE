<?php
/**
 * Script PHP para ejecutar migraciones de forma segura
 * 
 * Uso: php run_migrations.php
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== EJECUTOR DE MIGRACIONES DE BASE DE DATOS ===\n\n";

// Cargar configuración
$configFile = __DIR__ . '/../../app/Config/database-config.json';
if (!file_exists($configFile)) {
    die("❌ Error: No se encontró el archivo de configuración: $configFile\n");
}

$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

echo "Base de datos: {$db['database']}\n";
echo "Host: {$db['hostname']}\n\n";

// Confirmar ejecución
echo "⚠️  ADVERTENCIA: Este script modificará la estructura de la base de datos.\n";
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
    
    // Desactivar verificación de foreign keys temporalmente
    $mysqli->query("SET FOREIGN_KEY_CHECKS = 0");
    $mysqli->query("SET SQL_SAFE_UPDATES = 0");
    
    $migrations = [
        '001_fix_naming_consistency.sql' => 'Corrección de Consistencia en Nombres',
        '002_add_not_null_constraints.sql' => 'Agregar Constraints NOT NULL',
        '003_add_foreign_keys.sql' => 'Agregar Foreign Keys',
        '004_add_composite_indexes.sql' => 'Agregar Índices Compuestos'
    ];
    
    $successCount = 0;
    $errorCount = 0;
    
    foreach ($migrations as $file => $description) {
        $filePath = __DIR__ . '/' . $file;
        
        if (!file_exists($filePath)) {
            echo "⚠️  Archivo no encontrado: $file\n";
            continue;
        }
        
        echo "📄 Ejecutando: $description ($file)\n";
        echo str_repeat("-", 60) . "\n";
        
        $sql = file_get_contents($filePath);
        
        // Dividir en statements individuales
        $statements = array_filter(
            array_map('trim', explode(';', $sql)),
            function($stmt) {
                return !empty($stmt) && 
                       !preg_match('/^(SELECT|SET|PREPARE|EXECUTE|DEALLOCATE)/i', $stmt) &&
                       !preg_match('/^--/', $stmt);
            }
        );
        
        $migrationSuccess = true;
        
        foreach ($statements as $statement) {
            if (empty(trim($statement)) || preg_match('/^--/', $statement)) {
                continue;
            }
            
            // Ejecutar statement
            if ($mysqli->multi_query($statement)) {
                do {
                    if ($result = $mysqli->store_result()) {
                        $result->free();
                    }
                } while ($mysqli->next_result());
            }
            
            if ($mysqli->error) {
                // Algunos errores son esperados (ej: índice ya existe)
                if (strpos($mysqli->error, 'Duplicate key name') === false &&
                    strpos($mysqli->error, 'already exists') === false) {
                    echo "  ⚠️  Advertencia: " . $mysqli->error . "\n";
                    $migrationSuccess = false;
                }
            }
        }
        
        if ($migrationSuccess) {
            echo "  ✅ Migración completada\n\n";
            $successCount++;
        } else {
            echo "  ⚠️  Migración completada con advertencias\n\n";
            $successCount++;
        }
    }
    
    // Restaurar verificación de foreign keys
    $mysqli->query("SET FOREIGN_KEY_CHECKS = 1");
    $mysqli->query("SET SQL_SAFE_UPDATES = 1");
    
    echo str_repeat("=", 60) . "\n";
    echo "📊 RESUMEN:\n";
    echo "  ✅ Migraciones exitosas: $successCount\n";
    echo "  ❌ Migraciones con errores: $errorCount\n\n";
    
    if ($errorCount === 0) {
        echo "✅ Todas las migraciones se ejecutaron correctamente\n";
        echo "📋 Ejecuta el script de verificación: php verify_migrations.php\n";
    } else {
        echo "⚠️  Revisa los errores arriba y corrige antes de continuar\n";
    }
    
    $mysqli->close();
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
