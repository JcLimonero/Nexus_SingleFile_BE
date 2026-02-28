<?php
/**
 * Crear razones sociales (companies) y agencias (agencies) con nombres genéricos
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== CREAR COMPANIES Y AGENCIES ===\n\n";

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

echo "Base de datos: {$db['database']}\n";
echo "Host: {$db['hostname']}\n\n";

// Nombres genéricos para companies (razones sociales)
$companies = [
    ['Id' => 1, 'name' => 'Company Alpha'],
    ['Id' => 2, 'name' => 'Company Beta'],
    ['Id' => 3, 'name' => 'Company Gamma'],
    ['Id' => 4, 'name' => 'Company Delta'],
];

// Nombres genéricos para agencies
$agencies = [
    ['Id' => 1, 'Name' => 'Agency North', 'IdCompany' => 1],
    ['Id' => 2, 'Name' => 'Agency South', 'IdCompany' => 2],
    ['Id' => 3, 'Name' => 'Agency East', 'IdCompany' => 3],
    ['Id' => 4, 'Name' => 'Agency West', 'IdCompany' => 4],
];

try {
    $mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);
    
    if ($mysqli->connect_error) {
        die("❌ Error de conexión: " . $mysqli->connect_error . "\n");
    }
    
    echo "✅ Conectado a la base de datos\n\n";
    
    // Crear companies
    echo "🔄 Creando razones sociales (companies)...\n";
    echo str_repeat("-", 60) . "\n";
    
    $companiesCreated = 0;
    foreach ($companies as $company) {
        $id = $company['Id'];
        $name = $company['name'];
        
        // Verificar si existe
        $checkQuery = $mysqli->prepare("SELECT Id FROM company WHERE Id = ?");
        $checkQuery->bind_param("i", $id);
        $checkQuery->execute();
        $result = $checkQuery->get_result();
        $exists = $result->fetch_assoc();
        $checkQuery->close();
        
        if ($exists) {
            // Actualizar
            $updateQuery = $mysqli->prepare("UPDATE company SET name = ? WHERE Id = ?");
            $updateQuery->bind_param("si", $name, $id);
            if ($updateQuery->execute()) {
                echo "✅ Company ID $id: Actualizado '$name'\n";
                $companiesCreated++;
            }
            $updateQuery->close();
        } else {
            // Insertar
            $insertQuery = $mysqli->prepare("INSERT INTO company (Id, name) VALUES (?, ?)");
            $insertQuery->bind_param("is", $id, $name);
            if ($insertQuery->execute()) {
                echo "✅ Company ID $id: Creado '$name'\n";
                $companiesCreated++;
            } else {
                echo "❌ Company ID $id: Error - " . $insertQuery->error . "\n";
            }
            $insertQuery->close();
        }
    }
    
    // Crear agencies
    echo "\n🔄 Creando agencias (agencies)...\n";
    echo str_repeat("-", 60) . "\n";
    
    $agenciesCreated = 0;
    foreach ($agencies as $agency) {
        $id = $agency['Id'];
        $name = $agency['Name'];
        $idCompany = $agency['IdCompany'];
        
        // Verificar si existe
        $checkQuery = $mysqli->prepare("SELECT Id FROM agency WHERE Id = ?");
        $checkQuery->bind_param("i", $id);
        $checkQuery->execute();
        $result = $checkQuery->get_result();
        $exists = $result->fetch_assoc();
        $checkQuery->close();
        
        if ($exists) {
            // Actualizar
            $updateQuery = $mysqli->prepare("UPDATE agency SET Name = ?, IdCompany = ?, Enabled = 1, RegistrationDate = NOW(), UpdateDate = NOW() WHERE Id = ?");
            $updateQuery->bind_param("sii", $name, $idCompany, $id);
            if ($updateQuery->execute()) {
                echo "✅ Agency ID $id: Actualizado '$name' (Company: $idCompany)\n";
                $agenciesCreated++;
            }
            $updateQuery->close();
        } else {
            // Insertar
            $insertQuery = $mysqli->prepare("INSERT INTO agency (Id, Name, IdCompany, Enabled, RegistrationDate, UpdateDate) VALUES (?, ?, ?, 1, NOW(), NOW())");
            $insertQuery->bind_param("isi", $id, $name, $idCompany);
            if ($insertQuery->execute()) {
                echo "✅ Agency ID $id: Creado '$name' (Company: $idCompany)\n";
                $agenciesCreated++;
            } else {
                echo "❌ Agency ID $id: Error - " . $insertQuery->error . "\n";
            }
            $insertQuery->close();
        }
    }
    
    // Mostrar resumen
    echo "\n" . str_repeat("=", 60) . "\n";
    echo "📊 RESUMEN:\n";
    echo str_repeat("=", 60) . "\n";
    echo "✅ Companies creadas/actualizadas: $companiesCreated\n";
    echo "✅ Agencies creadas/actualizadas: $agenciesCreated\n\n";
    
    // Mostrar companies
    echo "📋 RAZONES SOCIALES (COMPANIES):\n";
    echo str_repeat("=", 60) . "\n";
    $result = $mysqli->query("SELECT Id, name FROM company ORDER BY Id");
    while ($row = $result->fetch_assoc()) {
        echo "ID {$row['Id']}: {$row['name']}\n";
    }
    
    // Mostrar agencies con su company
    echo "\n📋 AGENCIAS:\n";
    echo str_repeat("=", 60) . "\n";
    $result = $mysqli->query("SELECT a.Id, a.Name, a.IdCompany, c.name as CompanyName FROM agency a LEFT JOIN company c ON a.IdCompany = c.Id ORDER BY a.Id");
    while ($row = $result->fetch_assoc()) {
        $companyName = $row['CompanyName'] ?? 'Sin compañía';
        echo "ID {$row['Id']}: {$row['Name']} → Company: {$companyName} (ID: {$row['IdCompany']})\n";
    }
    
    $mysqli->close();
    
    echo "\n✅ Proceso completado\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
