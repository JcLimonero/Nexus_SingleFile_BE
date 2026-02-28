<?php
/**
 * Verificar que las columnas usadas en el código coincidan con las de las vistas
 */

echo "=== Verificación de Columnas en Vistas ===\n\n";

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

$mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);

if ($mysqli->connect_error) {
    die("Error: " . $mysqli->connect_error . "\n");
}

// Verificar view_client - columnas usadas en ClientSearch.php
echo "=== view_client ===\n";
echo "Columnas usadas en código:\n";
echo "  - Id, ndClient, Name, LastName, MotherLastName, RFC, Email, TelNumber, TelNumber2\n";
echo "  - RazonSocial, CURP, Adviser, AgencyOrigin, RegistrationDate, UpdateDate, idAgency\n\n";

$result = $mysqli->query("DESCRIBE view_client");
$columns = [];
while ($row = $result->fetch_assoc()) {
    $columns[] = $row['Field'];
}

echo "Columnas en la vista:\n";
foreach ($columns as $col) {
    echo "  - $col\n";
}

// Verificar diferencias
$codeColumns = ['Id', 'ndClient', 'Name', 'LastName', 'MotherLastName', 'RFC', 'Email', 
                'TelNumber', 'TelNumber2', 'RazonSocial', 'CURP', 'Adviser', 'AgencyOrigin', 
                'RegistrationDate', 'UpdateDate', 'idAgency'];

echo "\nVerificación:\n";
foreach ($codeColumns as $col) {
    if (in_array($col, $columns)) {
        echo "  ✅ $col existe\n";
    } else {
        echo "  ❌ $col NO existe\n";
    }
}

// Verificar view_client_relations
echo "\n=== view_client_relations ===\n";
$result = $mysqli->query("DESCRIBE view_client_relations");
$columns = [];
while ($row = $result->fetch_assoc()) {
    $columns[] = $row['Field'];
}

echo "Columnas en la vista:\n";
foreach ($columns as $col) {
    echo "  - $col\n";
}

// Verificar view_document_name
echo "\n=== view_document_name ===\n";
$result = $mysqli->query("DESCRIBE view_document_name");
$columns = [];
while ($row = $result->fetch_assoc()) {
    $columns[] = $row['Field'];
}

echo "Columnas en la vista:\n";
foreach ($columns as $col) {
    echo "  - $col\n";
}

$codeColumns = ['IdDocumentByFile', 'IdFile', 'file_name_original'];
echo "\nVerificación:\n";
foreach ($codeColumns as $col) {
    if (in_array($col, $columns)) {
        echo "  ✅ $col existe\n";
    } else {
        echo "  ❌ $col NO existe\n";
    }
}

$mysqli->close();
