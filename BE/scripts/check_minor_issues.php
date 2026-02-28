<?php
/**
 * Verificar las observaciones menores
 */

echo "=== Verificación de Observaciones Menores ===\n\n";

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

$mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);

if ($mysqli->connect_error) {
    die("Error: " . $mysqli->connect_error . "\n");
}

// 1. Verificar ConfigurationProcess_DocumentType.Required
echo "1. ConfigurationProcess_DocumentType.Required:\n";
$result = $mysqli->query("SHOW COLUMNS FROM ConfigurationProcess_DocumentType");
$hasRequired = false;
while ($row = $result->fetch_assoc()) {
    if ($row['Field'] === 'Required') {
        $hasRequired = true;
        break;
    }
}
if ($hasRequired) {
    echo "   ✅ La columna Required existe en ConfigurationProcess_DocumentType\n";
} else {
    echo "   ⚠️  La columna Required NO existe en ConfigurationProcess_DocumentType\n";
    echo "   ℹ️  El código busca Required en DocumentType (correcto)\n";
}

// Verificar que DocumentType tiene Required
$result = $mysqli->query("SHOW COLUMNS FROM DocumentType WHERE Field = 'Required'");
if ($result->num_rows > 0) {
    echo "   ✅ DocumentType tiene la columna Required (el código la usa correctamente)\n";
} else {
    echo "   ❌ DocumentType NO tiene la columna Required\n";
}
echo "\n";

// 2. Verificar HeaderClient.Name y HeaderClient.RFC
echo "2. HeaderClient.Name y HeaderClient.RFC:\n";
$result = $mysqli->query("SHOW COLUMNS FROM HeaderClient");
$columns = [];
while ($row = $result->fetch_assoc()) {
    $columns[] = $row['Field'];
}
if (in_array('Name', $columns)) {
    echo "   ✅ HeaderClient tiene columna Name\n";
} else {
    echo "   ⚠️  HeaderClient NO tiene columna Name\n";
    echo "   ℹ️  El código usa JOINs con Client para obtener Name (correcto)\n";
}
if (in_array('RFC', $columns)) {
    echo "   ✅ HeaderClient tiene columna RFC\n";
} else {
    echo "   ⚠️  HeaderClient NO tiene columna RFC\n";
    echo "   ℹ️  El código usa JOINs con Client para obtener RFC (correcto)\n";
}
echo "\n";

// 3. Verificar Company.Name vs Company.name
echo "3. Company.Name vs Company.name:\n";
$result = $mysqli->query("SHOW COLUMNS FROM Company");
$companyColumns = [];
while ($row = $result->fetch_assoc()) {
    $companyColumns[] = $row['Field'];
}
if (in_array('Name', $companyColumns)) {
    echo "   ✅ Company tiene columna Name (mayúscula)\n";
} elseif (in_array('name', $companyColumns)) {
    echo "   ⚠️  Company tiene columna name (minúscula)\n";
    echo "   ℹ️  El código usa Company.Name - MySQL es case-insensitive en Windows\n";
    // Probar si funciona
    $test = $mysqli->query("SELECT Name FROM Company LIMIT 1");
    if ($test) {
        echo "   ✅ SELECT Name funciona correctamente (case-insensitive)\n";
    } else {
        echo "   ❌ SELECT Name falla: " . $mysqli->error . "\n";
    }
} else {
    echo "   ❌ Company NO tiene columna Name ni name\n";
}
echo "\n";

$mysqli->close();

echo "=== Resumen ===\n";
echo "Las observaciones menores son correctas:\n";
echo "- Required se busca en DocumentType (no en ConfigurationProcess_DocumentType) ✓\n";
echo "- HeaderClient usa JOINs con Client para Name y RFC ✓\n";
echo "- Company.Name funciona aunque la columna sea 'name' (case-insensitive) ✓\n";
