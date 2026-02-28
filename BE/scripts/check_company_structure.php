<?php
/**
 * Verificar estructura actual de la tabla company
 */

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

$mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);

if ($mysqli->connect_error) {
    die("❌ Error: " . $mysqli->connect_error . "\n");
}

echo "=== ESTRUCTURA ACTUAL DE LA TABLA company ===\n\n";

$result = $mysqli->query("DESCRIBE company");
echo "📋 COLUMNAS ACTUALES:\n";
echo str_repeat("=", 80) . "\n";
printf("%-25s %-20s %-10s %-10s %-15s\n", "Campo", "Tipo", "Null", "Key", "Default");
echo str_repeat("-", 80) . "\n";

$existingColumns = [];
while ($row = $result->fetch_assoc()) {
    printf("%-25s %-20s %-10s %-10s %-15s\n", 
        $row['Field'], 
        $row['Type'], 
        $row['Null'], 
        $row['Key'],
        $row['Default'] ?? 'NULL'
    );
    $existingColumns[] = $row['Field'];
}

echo "\n📊 COLUMNAS EXISTENTES: " . implode(', ', $existingColumns) . "\n";

// Verificar qué columnas faltan
$requiredColumns = [
    'RegistrationDate' => "TIMESTAMP NULL DEFAULT NULL",
    'UpdateDate' => "TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP",
    'IdLastUserUpdate' => "BIGINT NULL DEFAULT NULL",
    'Enabled' => "TINYINT DEFAULT 1"
];

echo "\n📋 COLUMNAS A AGREGAR:\n";
echo str_repeat("=", 80) . "\n";

$columnsToAdd = [];
foreach ($requiredColumns as $column => $definition) {
    if (!in_array($column, $existingColumns)) {
        echo "⚠️  Falta: $column ($definition)\n";
        $columnsToAdd[$column] = $definition;
    } else {
        echo "✅ Existe: $column\n";
    }
}

$mysqli->close();
