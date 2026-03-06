<?php
/**
 * Ejecutar migraciones directamente sin confirmación interactiva
 * 
 * Uso: php execute_migrations.php
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
echo "Host: {$db['hostname']}\n";
echo "Usuario: {$db['username']}\n\n";

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
    $mysqli->query("SET SQL_SAFE_UPDATES = 0");
    
    $migrations = [
        '001_fix_naming_consistency.sql' => 'Corrección de Consistencia en Nombres',
        '002_add_not_null_constraints.sql' => 'Agregar Constraints NOT NULL',
        '003_add_foreign_keys.sql' => 'Agregar Foreign Keys',
        '004_add_composite_indexes_simple.sql' => 'Agregar Índices Compuestos'
    ];
    
    $successCount = 0;
    $errorCount = 0;
    $errors = [];
    
    foreach ($migrations as $file => $description) {
        $filePath = __DIR__ . '/' . $file;
        
        if (!file_exists($filePath)) {
            echo "⚠️  Archivo no encontrado: $file\n";
            $errorCount++;
            continue;
        }
        
        echo "📄 Ejecutando: $description ($file)\n";
        echo str_repeat("-", 60) . "\n";
        
        $sql = file_get_contents($filePath);
        
        // Ejecutar el SQL completo usando multi_query
        if ($mysqli->multi_query($sql)) {
            do {
                if ($result = $mysqli->store_result()) {
                    // Mostrar resultados de SELECT si los hay
                    while ($row = $result->fetch_assoc()) {
                        foreach ($row as $key => $value) {
                            if (strpos($value, '✅') !== false || strpos($value, '❌') !== false) {
                                echo "  $value\n";
                            }
                        }
                    }
                    $result->free();
                }
            } while ($mysqli->next_result());
            
            if ($mysqli->error && $mysqli->errno != 0) {
                // Algunos errores son esperados (ej: índice ya existe, FK ya existe)
                if (strpos($mysqli->error, 'Duplicate key name') === false &&
                    strpos($mysqli->error, 'already exists') === false &&
                    strpos($mysqli->error, 'Duplicate foreign key') === false &&
                    strpos($mysqli->error, 'Cannot add foreign key') === false) {
                    echo "  ⚠️  Advertencia: " . $mysqli->error . "\n";
                    $errors[] = "$file: " . $mysqli->error;
                }
            }
            
            echo "  ✅ Migración completada\n\n";
            $successCount++;
        } else {
            echo "  ❌ Error: " . $mysqli->error . "\n\n";
            $errors[] = "$file: " . $mysqli->error;
            $errorCount++;
        }
    }
    
    // Restaurar verificación de foreign keys
    $mysqli->query("SET FOREIGN_KEY_CHECKS = 1");
    $mysqli->query("SET SQL_SAFE_UPDATES = 1");
    
    echo str_repeat("=", 60) . "\n";
    echo "📊 RESUMEN:\n";
    echo "  ✅ Migraciones exitosas: $successCount\n";
    echo "  ❌ Migraciones con errores: $errorCount\n\n";
    
    if (!empty($errors)) {
        echo "⚠️  Errores encontrados:\n";
        foreach ($errors as $error) {
            echo "  - $error\n";
        }
        echo "\n";
    }
    
    if ($errorCount === 0) {
        echo "✅ Todas las migraciones se ejecutaron correctamente\n";
        echo "📋 Ejecuta el script de verificación: php verify_migrations.php\n";
    } else {
        echo "⚠️  Revisa los errores arriba\n";
    }
    
    $mysqli->close();
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
