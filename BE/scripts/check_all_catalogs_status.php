<?php
/**
 * Verificar estado de todos los catálogos necesarios para inserción inicial
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== VERIFICAR ESTADO DE CATÁLOGOS ===\n\n";

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

echo "Base de datos: {$db['database']}\n";
echo "Host: {$db['hostname']}\n\n";

// Catálogos principales necesarios para inserción de clientes
$catalogs = [
    'company' => 'Empresas',
    'agency' => 'Agencias',
    'customer_type' => 'Tipos de Cliente',
    'operation_type' => 'Tipos de Operación',
    'process' => 'Procesos',
    'user_role' => 'Roles de Usuario',
    'file_status' => 'Estados de Archivo',
    'file_sub_status' => 'Sub-Estados de Archivo',
    'file_reasons' => 'Motivos de Archivo',
    'file_extraordinary_reasons' => 'Motivos Extraordinarios',
    'document_type' => 'Tipos de Documento',
    'document_file_status' => 'Estados de Documento',
    'document_file_error' => 'Errores de Documento',
];

try {
    $mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);
    
    if ($mysqli->connect_error) {
        die("❌ Error de conexión: " . $mysqli->connect_error . "\n");
    }
    
    echo "✅ Conectado a la base de datos\n\n";
    
    echo "📊 ESTADO DE CATÁLOGOS:\n";
    echo str_repeat("=", 80) . "\n";
    echo sprintf("%-35s %-10s %-35s\n", "Catálogo", "Registros", "Estado");
    echo str_repeat("-", 80) . "\n";
    
    $emptyCatalogs = [];
    $populatedCatalogs = [];
    
    foreach ($catalogs as $table => $label) {
        // Verificar si la tabla existe
        $tableExists = $mysqli->query("
            SELECT COUNT(*) as count 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_SCHEMA = '{$db['database']}' 
            AND TABLE_NAME = '$table'
        ");
        
        if ($tableExists && $tableExists->fetch_assoc()['count'] > 0) {
            // Contar registros
            $result = $mysqli->query("SELECT COUNT(*) as count FROM `$table`");
            if ($result) {
                $count = $result->fetch_assoc()['count'];
                $status = $count > 0 ? "✅ Poblado" : "⚠️  Vacío";
                
                echo sprintf("%-35s %-10s %-35s\n", $label, $count, $status);
                
                if ($count == 0) {
                    $emptyCatalogs[$table] = $label;
                } else {
                    $populatedCatalogs[$table] = ['label' => $label, 'count' => $count];
                }
            } else {
                echo sprintf("%-35s %-10s %-35s\n", $label, "ERROR", "❌ Error al consultar");
            }
        } else {
            echo sprintf("%-35s %-10s %-35s\n", $label, "N/A", "❌ Tabla no existe");
        }
    }
    
    echo "\n" . str_repeat("=", 80) . "\n";
    echo "📋 RESUMEN:\n";
    echo str_repeat("=", 80) . "\n";
    
    echo "\n✅ CATÁLOGOS POBLADOS (" . count($populatedCatalogs) . "):\n";
    foreach ($populatedCatalogs as $table => $info) {
        echo "   - {$info['label']}: {$info['count']} registros\n";
    }
    
    if (!empty($emptyCatalogs)) {
        echo "\n⚠️  CATÁLOGOS VACÍOS (" . count($emptyCatalogs) . "):\n";
        foreach ($emptyCatalogs as $table => $label) {
            echo "   - $label ($table)\n";
        }
    } else {
        echo "\n✅ Todos los catálogos están poblados\n";
    }
    
    // Verificar catálogos adicionales que podrían ser necesarios
    echo "\n" . str_repeat("=", 80) . "\n";
    echo "🔍 VERIFICANDO CATÁLOGOS ADICIONALES...\n";
    echo str_repeat("=", 80) . "\n";
    
    $additionalCatalogs = [
        'configuration_process' => 'Configuraciones de Proceso',
        'configuration_process_document_type' => 'Configuración Proceso-Documento',
    ];
    
    foreach ($additionalCatalogs as $table => $label) {
        $tableExists = $mysqli->query("
            SELECT COUNT(*) as count 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_SCHEMA = '{$db['database']}' 
            AND TABLE_NAME = '$table'
        ");
        
        if ($tableExists && $tableExists->fetch_assoc()['count'] > 0) {
            $result = $mysqli->query("SELECT COUNT(*) as count FROM `$table`");
            if ($result) {
                $count = $result->fetch_assoc()['count'];
                echo sprintf("%-35s %-10s %-35s\n", $label, $count, $count > 0 ? "✅ Poblado" : "⚠️  Vacío");
            }
        }
    }
    
    // Mostrar algunos ejemplos de datos clave
    echo "\n" . str_repeat("=", 80) . "\n";
    echo "📋 EJEMPLOS DE DATOS EN CATÁLOGOS CLAVE:\n";
    echo str_repeat("=", 80) . "\n";
    
    // Customer Types
    echo "\n🔹 Tipos de Cliente:\n";
    $result = $mysqli->query("SELECT Id, Name FROM customer_type ORDER BY Id LIMIT 5");
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            echo "   ID {$row['Id']}: {$row['Name']}\n";
        }
    }
    
    // Operation Types
    echo "\n🔹 Tipos de Operación:\n";
    $result = $mysqli->query("SELECT Id, Name FROM operation_type ORDER BY Id LIMIT 5");
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            echo "   ID {$row['Id']}: {$row['Name']}\n";
        }
    }
    
    // Processes
    echo "\n🔹 Procesos:\n";
    $result = $mysqli->query("SELECT Id, Name FROM process ORDER BY Id LIMIT 5");
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            echo "   ID {$row['Id']}: {$row['Name']}\n";
        }
    }
    
    // File Status
    echo "\n🔹 Estados de Archivo:\n";
    $result = $mysqli->query("SELECT Id, Name FROM file_status ORDER BY Id LIMIT 5");
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            echo "   ID {$row['Id']}: {$row['Name']}\n";
        }
    }
    
    $mysqli->close();
    
    echo "\n✅ Verificación completada\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
