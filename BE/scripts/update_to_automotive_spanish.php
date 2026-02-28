<?php
/**
 * Actualizar companies y agencies con nombres en español relacionados con automotriz
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== ACTUALIZAR A NOMBRES AUTOMOTRICES EN ESPAÑOL ===\n\n";

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

echo "Base de datos: {$db['database']}\n";
echo "Host: {$db['hostname']}\n\n";

// Companies (Razones Sociales) - Sector Automotriz
$companies = [
    1 => 'Concesionaria Automotriz del Norte',
    2 => 'Distribuidora de Vehículos Premium',
    3 => 'Grupo Automotriz Central',
    4 => 'Talleres Mecánicos Especializados',
    5 => 'Agencia de Autos Usados',
    6 => 'Concesionaria de Motocicletas',
    7 => 'Distribuidora de Refacciones',
    8 => 'Centro de Servicio Automotriz',
    9 => 'Venta de Vehículos Comerciales',
    10 => 'Agencia de Autos Nuevos',
    11 => 'Taller de Carrocería y Pintura',
    12 => 'Concesionaria de Camiones',
    13 => 'Distribuidora de Neumáticos',
    14 => 'Centro de Mantenimiento Preventivo',
    15 => 'Agencia de Vehículos Eléctricos',
    16 => 'Taller de Transmisiones',
    17 => 'Concesionaria de Vehículos de Lujo',
];

// Agencies (Agencias) - Sector Automotriz
$agencies = [
    1 => 'Agencia Norte - Venta de Autos',
    2 => 'Agencia Sur - Servicio y Mantenimiento',
    3 => 'Agencia Este - Refacciones y Accesorios',
    4 => 'Agencia Oeste - Vehículos Comerciales',
];

try {
    $mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);
    
    if ($mysqli->connect_error) {
        die("❌ Error de conexión: " . $mysqli->connect_error . "\n");
    }
    
    echo "✅ Conectado a la base de datos\n\n";
    
    // Actualizar companies
    echo "🔄 Actualizando razones sociales (companies)...\n";
    echo str_repeat("-", 60) . "\n";
    
    $companiesUpdated = 0;
    foreach ($companies as $id => $name) {
        $updateQuery = $mysqli->prepare("UPDATE company SET name = ? WHERE Id = ?");
        $updateQuery->bind_param("si", $name, $id);
        if ($updateQuery->execute()) {
            if ($updateQuery->affected_rows > 0) {
                echo "✅ Company ID $id: '$name'\n";
                $companiesUpdated++;
            } else {
                // Si no existe, insertar
                $insertQuery = $mysqli->prepare("INSERT INTO company (Id, name) VALUES (?, ?)");
                $insertQuery->bind_param("is", $id, $name);
                if ($insertQuery->execute()) {
                    echo "✅ Company ID $id: Creado '$name'\n";
                    $companiesUpdated++;
                }
                $insertQuery->close();
            }
        }
        $updateQuery->close();
    }
    
    // Actualizar agencies
    echo "\n🔄 Actualizando agencias (agencies)...\n";
    echo str_repeat("-", 60) . "\n";
    
    $agenciesUpdated = 0;
    foreach ($agencies as $id => $name) {
        // Mantener la distribución: Agency 1 -> Company 1, Agency 2 -> Company 11, etc.
        $companyId = ($id == 1) ? 1 : (($id == 2) ? 11 : (($id == 3) ? 12 : 4));
        
        $updateQuery = $mysqli->prepare("UPDATE agency SET Name = ?, IdCompany = ?, UpdateDate = NOW() WHERE Id = ?");
        $updateQuery->bind_param("sii", $name, $companyId, $id);
        if ($updateQuery->execute()) {
            if ($updateQuery->affected_rows > 0) {
                echo "✅ Agency ID $id: '$name' → Company ID $companyId\n";
                $agenciesUpdated++;
            } else {
                // Si no existe, insertar
                $insertQuery = $mysqli->prepare("INSERT INTO agency (Id, Name, IdCompany, Enabled, RegistrationDate, UpdateDate) VALUES (?, ?, ?, 1, NOW(), NOW())");
                $insertQuery->bind_param("isi", $id, $name, $companyId);
                if ($insertQuery->execute()) {
                    echo "✅ Agency ID $id: Creado '$name' → Company ID $companyId\n";
                    $agenciesUpdated++;
                }
                $insertQuery->close();
            }
        }
        $updateQuery->close();
    }
    
    // Mostrar resumen
    echo "\n" . str_repeat("=", 60) . "\n";
    echo "📊 RESUMEN:\n";
    echo str_repeat("=", 60) . "\n";
    echo "✅ Companies actualizadas/creadas: $companiesUpdated\n";
    echo "✅ Agencies actualizadas/creadas: $agenciesUpdated\n\n";
    
    // Mostrar companies
    echo "📋 RAZONES SOCIALES (COMPANIES) - SECTOR AUTOMOTRIZ:\n";
    echo str_repeat("=", 80) . "\n";
    $result = $mysqli->query("SELECT Id, name FROM company ORDER BY Id");
    while ($row = $result->fetch_assoc()) {
        echo sprintf("ID %2d: %s\n", $row['Id'], $row['name']);
    }
    
    // Mostrar agencies con su company
    echo "\n📋 AGENCIAS - SECTOR AUTOMOTRIZ:\n";
    echo str_repeat("=", 80) . "\n";
    $result = $mysqli->query("SELECT a.Id, a.Name, a.IdCompany, c.name as CompanyName FROM agency a LEFT JOIN company c ON a.IdCompany = c.Id ORDER BY a.Id");
    while ($row = $result->fetch_assoc()) {
        $companyName = $row['CompanyName'] ?? 'Sin compañía';
        echo sprintf("ID %d: %-40s → %s (ID: %d)\n", 
            $row['Id'], 
            $row['Name'], 
            $companyName,
            $row['IdCompany']
        );
    }
    
    // Mostrar distribución
    echo "\n📋 DISTRIBUCIÓN DE COMPANIES POR AGENCY:\n";
    echo str_repeat("=", 80) . "\n";
    
    $distribution = [
        1 => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // Agency 1: 10 companies
        2 => [11],                              // Agency 2: 1 company
        3 => [12, 13, 14, 15, 16, 17],         // Agency 3: 6 companies
        4 => [4],                               // Agency 4: 1 company
    ];
    
    foreach ($distribution as $agencyId => $companyIds) {
        $agencyQuery = $mysqli->prepare("SELECT Name FROM agency WHERE Id = ?");
        $agencyQuery->bind_param("i", $agencyId);
        $agencyQuery->execute();
        $agencyResult = $agencyQuery->get_result();
        $agency = $agencyResult->fetch_assoc();
        $agencyQuery->close();
        
        $agencyName = $agency['Name'] ?? "Agency $agencyId";
        $companyCount = count($companyIds);
        
        echo "\n$agencyName (ID: $agencyId): $companyCount companies\n";
        
        // Mostrar nombres de las companies
        $companyNamesList = [];
        foreach ($companyIds as $companyId) {
            $companyQuery = $mysqli->prepare("SELECT name FROM company WHERE Id = ?");
            $companyQuery->bind_param("i", $companyId);
            $companyQuery->execute();
            $companyResult = $companyQuery->get_result();
            $company = $companyResult->fetch_assoc();
            $companyQuery->close();
            
            if ($company) {
                $companyNamesList[] = $company['name'];
            }
        }
        foreach ($companyNamesList as $idx => $name) {
            echo "  " . ($idx + 1) . ". $name\n";
        }
    }
    
    $mysqli->close();
    
    echo "\n✅ Proceso completado\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
