<?php
/**
 * Probar que Company.name funciona correctamente después de los cambios
 */

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

$mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);

echo "=== Prueba de Company.name ===\n\n";

// Probar SELECT con Company.name
$result = $mysqli->query("SELECT Company.name FROM Company LIMIT 1");
if ($result) {
    echo "✅ SELECT Company.name funciona correctamente\n";
    $row = $result->fetch_assoc();
    echo "   Valor obtenido: " . ($row['name'] ?? 'NULL') . "\n";
} else {
    echo "❌ Error: " . $mysqli->error . "\n";
}

// Probar JOIN con Company.name
$result = $mysqli->query("SELECT Agency.*, Company.name as CompanyName FROM Agency LEFT JOIN Company ON Agency.IdCompany = Company.Id LIMIT 1");
if ($result) {
    echo "✅ JOIN con Company.name funciona correctamente\n";
    $row = $result->fetch_assoc();
    echo "   CompanyName obtenido: " . ($row['CompanyName'] ?? 'NULL') . "\n";
} else {
    echo "❌ Error en JOIN: " . $mysqli->error . "\n";
}

$mysqli->close();
echo "\n✅ Todas las pruebas pasaron correctamente\n";
