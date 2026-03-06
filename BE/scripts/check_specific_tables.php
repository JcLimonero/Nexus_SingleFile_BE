<?php
/**
 * Script para verificar columnas específicas de tablas problemáticas
 */

echo "=== Verificación Detallada de Tablas Problemáticas ===\n\n";

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

$mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);

if ($mysqli->connect_error) {
    die("Error de conexión: " . $mysqli->connect_error . "\n");
}

$tablesToCheck = [
    'ConfigurationProcess',
    'ConfigurationProcess_DocumentType',
    'HeaderClient',
    'Company',
    'CostumerType'
];

foreach ($tablesToCheck as $table) {
    echo "--- Tabla: $table ---\n";
    
    $result = $mysqli->query("SHOW TABLES LIKE '$table'");
    if (!$result || $result->num_rows == 0) {
        echo "  ❌ La tabla NO existe\n\n";
        continue;
    }
    
    echo "  ✅ La tabla existe\n";
    echo "  Columnas:\n";
    
    $columnsResult = $mysqli->query("SHOW COLUMNS FROM `$table`");
    while ($row = $columnsResult->fetch_assoc()) {
        $nullable = $row['Null'] === 'YES' ? 'NULL' : 'NOT NULL';
        $default = $row['Default'] !== null ? " DEFAULT '{$row['Default']}'" : '';
        echo "    - {$row['Field']} ({$row['Type']}) $nullable$default\n";
    }
    echo "\n";
}

// Verificar si CostumerType existe con otro nombre
echo "--- Búsqueda de variantes de CostumerType ---\n";
$result = $mysqli->query("SHOW TABLES LIKE '%Customer%' OR SHOW TABLES LIKE '%Costumer%'");
$tables = [];
$result = $mysqli->query("SHOW TABLES");
while ($row = $result->fetch_array()) {
    $tableName = $row[0];
    if (stripos($tableName, 'customer') !== false || stripos($tableName, 'costumer') !== false) {
        $tables[] = $tableName;
    }
}

if (!empty($tables)) {
    echo "  Tablas encontradas con 'customer' o 'costumer':\n";
    foreach ($tables as $table) {
        echo "    - $table\n";
    }
} else {
    echo "  ⚠️  No se encontraron tablas relacionadas\n";
}

$mysqli->close();
