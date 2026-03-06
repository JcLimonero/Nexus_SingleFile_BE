<?php
/**
 * Verificar si la columna IdTotalDealer existe y necesita renombrarse a IdDMS
 */

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

$mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);

if ($mysqli->connect_error) {
    die("❌ Error: " . $mysqli->connect_error . "\n");
}

echo "=== VERIFICACIÓN DE COLUMNA IdTotalDealer ===\n\n";

// Verificar estructura de ClientTotalRelation
$result = $mysqli->query("SHOW COLUMNS FROM ClientTotalRelation");
$columns = [];
while ($row = $result->fetch_assoc()) {
    $columns[] = $row['Field'];
    echo "Columna encontrada: {$row['Field']} ({$row['Type']})\n";
}

echo "\n";

if (in_array('IdTotalDealer', $columns)) {
    echo "⚠️  La columna 'IdTotalDealer' existe y necesita renombrarse a 'IdDMS'\n";
    echo "   Se requiere ejecutar: ALTER TABLE ClientTotalRelation CHANGE COLUMN IdTotalDealer IdDMS ...\n";
} elseif (in_array('IdDMS', $columns)) {
    echo "✅ La columna ya se llama 'IdDMS'\n";
} else {
    echo "❌ No se encontró ninguna de las columnas (IdTotalDealer o IdDMS)\n";
}

// Verificar también OrderByCar
echo "\n=== VERIFICACIÓN DE COLUMNA EN OrderByCar ===\n";
$result = $mysqli->query("SHOW COLUMNS FROM OrderByCar");
$columnsOrder = [];
while ($row = $result->fetch_assoc()) {
    $columnsOrder[] = $row['Field'];
    echo "Columna encontrada: {$row['Field']} ({$row['Type']})\n";
}

echo "\n";

if (in_array('IdTotalDealer', $columnsOrder)) {
    echo "⚠️  La columna 'IdTotalDealer' existe en OrderByCar y necesita renombrarse a 'IdDMS'\n";
} elseif (in_array('IdDMS', $columnsOrder)) {
    echo "✅ La columna en OrderByCar ya se llama 'IdDMS'\n";
} else {
    echo "ℹ️  No se encontró IdTotalDealer o IdDMS en OrderByCar\n";
}

$mysqli->close();
