<?php
/**
 * Script PHP para verificar que las migraciones se aplicaron correctamente
 * 
 * Uso: php verify_migrations.php
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== VERIFICACIÓN POST-MIGRACIÓN ===\n\n";

// Cargar configuración
$configFile = __DIR__ . '/../../app/Config/database-config.json';
if (!file_exists($configFile)) {
    die("❌ Error: No se encontró el archivo de configuración: $configFile\n");
}

$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

// Conectar a la base de datos
try {
    $mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);
    
    if ($mysqli->connect_error) {
        die("❌ Error de conexión: " . $mysqli->connect_error . "\n");
    }
    
    echo "✅ Conectado a la base de datos: {$db['database']}\n\n";
    
    $checks = [
        'Nombres corregidos' => [
            "SELECT CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'CustomerType') THEN '✅ Tabla CustomerType existe' ELSE '❌ Tabla CustomerType NO existe' END AS status",
            "SELECT CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'ConfigurationProcess' AND column_name = 'IdCustomerType') THEN '✅ Columna IdCustomerType existe en ConfigurationProcess' ELSE '❌ Columna IdCustomerType NO existe' END AS status",
            "SELECT CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'File' AND column_name = 'IdCustomerType') THEN '✅ Columna IdCustomerType existe en File' ELSE '❌ Columna IdCustomerType NO existe' END AS status"
        ],
        'Foreign Keys' => [
            "SELECT COUNT(*) AS total_fks FROM information_schema.table_constraints WHERE table_schema = DATABASE() AND constraint_type = 'FOREIGN KEY' AND table_name IN ('File', 'ConfigurationProcess', 'Client_Total_Relation')"
        ],
        'Índices Compuestos' => [
            "SELECT COUNT(*) AS total_indexes FROM information_schema.statistics WHERE table_schema = DATABASE() AND index_name LIKE 'IDX_%' AND table_name IN ('File', 'ConfigurationProcess', 'DocumentByFile')"
        ]
    ];
    
    foreach ($checks as $category => $queries) {
        echo "📋 Verificando: $category\n";
        echo str_repeat("-", 60) . "\n";
        
        foreach ($queries as $query) {
            $result = $mysqli->query($query);
            if ($result) {
                while ($row = $result->fetch_assoc()) {
                    foreach ($row as $key => $value) {
                        if ($key === 'status') {
                            echo "  $value\n";
                        } else {
                            echo "  $key: $value\n";
                        }
                    }
                }
                $result->free();
            } else {
                echo "  ⚠️  Error en query: " . $mysqli->error . "\n";
            }
        }
        echo "\n";
    }
    
    // Verificar integridad de datos
    echo "📋 Verificando integridad de datos (sin huérfanos)\n";
    echo str_repeat("-", 60) . "\n";
    
    $integrityChecks = [
        'File.IdCustomerType huérfanos' => "SELECT COUNT(*) AS count FROM `File` f LEFT JOIN `CustomerType` ct ON f.IdCustomerType = ct.Id WHERE ct.Id IS NULL",
        'ConfigurationProcess.IdCustomerType huérfanos' => "SELECT COUNT(*) AS count FROM `ConfigurationProcess` cp LEFT JOIN `CustomerType` ct ON cp.IdCustomerType = ct.Id WHERE ct.Id IS NULL",
        'Client_Total_Relation.idHeaderClient huérfanos' => "SELECT COUNT(*) AS count FROM `Client_Total_Relation` ctr LEFT JOIN `HeaderClient` hc ON ctr.idHeaderClient = hc.Id WHERE hc.Id IS NULL"
    ];
    
    foreach ($integrityChecks as $check => $query) {
        $result = $mysqli->query($query);
        if ($result) {
            $row = $result->fetch_assoc();
            $count = $row['count'] ?? 0;
            if ($count == 0) {
                echo "  ✅ $check: 0 (OK)\n";
            } else {
                echo "  ⚠️  $check: $count (Revisar datos)\n";
            }
            $result->free();
        }
    }
    
    echo "\n";
    echo "=== VERIFICACIÓN COMPLETADA ===\n";
    
    $mysqli->close();
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
