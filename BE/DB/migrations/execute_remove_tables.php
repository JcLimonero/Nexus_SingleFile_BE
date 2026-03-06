<?php
/**
 * Script para eliminar tablas no utilizadas de forma segura
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== ELIMINACIÓN DE TABLAS NO UTILIZADAS ===\n\n";

$configFile = __DIR__ . '/../../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

echo "Base de datos: {$db['database']}\n";
echo "Host: {$db['hostname']}\n\n";

// Tablas a eliminar
$tablesToRemove = [
    // Configuración Externa
    'appversion',
    'bank',
    'cfdi',
    'insurancecarrier',
    'smtp_configurator',
    // Futuro/Planeado
    'file_extraordinary_events',
    'file_extraordinary_type',
    'file_release_steps',
    'file_tracking',
    // Legacy/Deprecated
    'tracking_file',
    'tracking_operation'
];

echo "⚠️  TABLAS QUE SE ELIMINARÁN (" . count($tablesToRemove) . "):\n";
echo str_repeat("-", 60) . "\n";
foreach ($tablesToRemove as $table) {
    echo "  - $table\n";
}
echo "\n";

// Conectar a la base de datos
try {
    $mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);
    
    if ($mysqli->connect_error) {
        die("❌ Error de conexión: " . $mysqli->connect_error . "\n");
    }
    
    echo "✅ Conectado a la base de datos\n\n";
    
    // Verificar qué tablas existen antes de eliminar
    echo "🔍 Verificando tablas existentes...\n";
    $existingTables = [];
    foreach ($tablesToRemove as $table) {
        $result = $mysqli->query("SHOW TABLES LIKE '$table'");
        if ($result && $result->num_rows > 0) {
            $existingTables[] = $table;
            // Verificar si tiene datos
            $countResult = $mysqli->query("SELECT COUNT(*) as count FROM `$table`");
            if ($countResult) {
                $row = $countResult->fetch_assoc();
                $count = $row['count'];
                echo "  ✅ $table existe (" . ($count > 0 ? "$count registros" : "vacía") . ")\n";
            }
        } else {
            echo "  ⚠️  $table no existe (saltando)\n";
        }
    }
    
    if (empty($existingTables)) {
        echo "\n✅ No hay tablas para eliminar (todas ya fueron eliminadas o no existen)\n";
        $mysqli->close();
        exit(0);
    }
    
    echo "\n📊 Total de tablas a eliminar: " . count($existingTables) . "\n\n";
    
    // Eliminar tablas
    echo "🗑️  Eliminando tablas...\n";
    echo str_repeat("-", 60) . "\n";
    
    $deletedCount = 0;
    $errorCount = 0;
    $errors = [];
    
    foreach ($existingTables as $table) {
        echo "Eliminando: $table... ";
        
        // Primero eliminar foreign keys si existen
        $fkResult = $mysqli->query("
            SELECT CONSTRAINT_NAME 
            FROM information_schema.table_constraints 
            WHERE table_schema = DATABASE() 
            AND table_name = '$table' 
            AND constraint_type = 'FOREIGN KEY'
        ");
        
        while ($fkRow = $fkResult->fetch_assoc()) {
            $fkName = $fkRow['CONSTRAINT_NAME'];
            $mysqli->query("ALTER TABLE `$table` DROP FOREIGN KEY `$fkName`");
        }
        
        // Eliminar la tabla
        if ($mysqli->query("DROP TABLE IF EXISTS `$table`")) {
            echo "✅ Eliminada\n";
            $deletedCount++;
        } else {
            echo "❌ Error: " . $mysqli->error . "\n";
            $errors[] = "$table: " . $mysqli->error;
            $errorCount++;
        }
    }
    
    echo "\n" . str_repeat("=", 60) . "\n";
    echo "📊 RESUMEN:\n";
    echo str_repeat("=", 60) . "\n";
    echo "✅ Tablas eliminadas: $deletedCount\n";
    echo "❌ Errores: $errorCount\n\n";
    
    if (!empty($errors)) {
        echo "⚠️  Errores encontrados:\n";
        foreach ($errors as $error) {
            echo "  - $error\n";
        }
        echo "\n";
    }
    
    // Verificar que se eliminaron
    echo "🔍 Verificando eliminación...\n";
    $stillExists = [];
    foreach ($tablesToRemove as $table) {
        $result = $mysqli->query("SHOW TABLES LIKE '$table'");
        if ($result && $result->num_rows > 0) {
            $stillExists[] = $table;
        }
    }
    
    if (empty($stillExists)) {
        echo "✅ Todas las tablas fueron eliminadas correctamente\n";
    } else {
        echo "⚠️  Las siguientes tablas aún existen:\n";
        foreach ($stillExists as $table) {
            echo "  - $table\n";
        }
    }
    
    // Mostrar tablas restantes
    $result = $mysqli->query("SHOW TABLES");
    $remainingTables = [];
    while ($row = $result->fetch_array()) {
        $remainingTables[] = $row[0];
    }
    
    echo "\n📊 Total de tablas restantes en BD: " . count($remainingTables) . "\n";
    
    $mysqli->close();
    
    echo "\n✅ Proceso completado\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
