<?php
/**
 * Actualizar todos los nombres de companies y agencies a venta de autos
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== ACTUALIZAR A NOMBRES DE VENTA DE AUTOS ===\n\n";

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

echo "Base de datos: {$db['database']}\n";
echo "Host: {$db['hostname']}\n\n";

// Companies (Razones Sociales) - Solo venta de autos
$companies = [
    1 => 'Concesionaria Automotriz del Norte',
    2 => 'Grupo Automotriz Central',
    3 => 'Distribuidora de Vehículos Premium',
    4 => 'Concesionaria Automotriz del Sur',
];

// Agencies - Solo venta de autos
$agencies = [
    1 => 'Agencia Norte - Venta de Autos Nuevos',
    2 => 'Agencia Norte - Venta de Autos Usados',
    3 => 'Agencia Premium - Showroom',
    4 => 'Agencia Sur - Venta de Autos',
    5 => 'Agencia Sur - Venta de Camionetas',
    6 => 'Agencia Sur - Venta de Motos',
    7 => 'Agencia Sur - Venta de Vehículos Comerciales',
    8 => 'Agencia Sur - Venta de Autos de Lujo',
];

// Distribución de agencies por company
$distribution = [
    1 => [1, 2],      // Primera compañía: 2 agencias
    3 => [3],         // Tercera compañía: 1 agencia
    4 => [4, 5, 6, 7, 8], // Cuarta compañía: 5 agencias
];

try {
    $mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);
    
    if ($mysqli->connect_error) {
        die("❌ Error de conexión: " . $mysqli->connect_error . "\n");
    }
    
    echo "✅ Conectado a la base de datos\n\n";
    
    // Actualizar companies
    echo "🔄 Actualizando compañías (companies)...\n";
    echo str_repeat("-", 60) . "\n";
    
    $companiesUpdated = 0;
    foreach ($companies as $id => $name) {
        $updateQuery = $mysqli->prepare("UPDATE company SET name = ?, UpdateDate = NOW() WHERE Id = ?");
        $updateQuery->bind_param("si", $name, $id);
        if ($updateQuery->execute() && $updateQuery->affected_rows > 0) {
            echo "✅ Company ID $id: '$name'\n";
            $companiesUpdated++;
        }
        $updateQuery->close();
    }
    
    // Actualizar agencies
    echo "\n🔄 Actualizando agencias (agencies)...\n";
    echo str_repeat("-", 60) . "\n";
    
    $agenciesUpdated = 0;
    foreach ($agencies as $id => $name) {
        // Determinar a qué compañía pertenece según la distribución
        $idCompany = null;
        foreach ($distribution as $companyId => $agencyIds) {
            if (in_array($id, $agencyIds)) {
                $idCompany = $companyId;
                break;
            }
        }
        
        if ($idCompany) {
            $updateQuery = $mysqli->prepare("UPDATE agency SET Name = ?, IdCompany = ?, UpdateDate = NOW() WHERE Id = ?");
            $updateQuery->bind_param("sii", $name, $idCompany, $id);
            if ($updateQuery->execute() && $updateQuery->affected_rows > 0) {
                echo "✅ Agency ID $id: '$name' → Company ID $idCompany\n";
                $agenciesUpdated++;
            }
            $updateQuery->close();
        }
    }
    
    // Mostrar resumen
    echo "\n" . str_repeat("=", 60) . "\n";
    echo "📊 RESUMEN:\n";
    echo str_repeat("=", 60) . "\n";
    echo "✅ Companies actualizadas: $companiesUpdated\n";
    echo "✅ Agencies actualizadas: $agenciesUpdated\n\n";
    
    // Mostrar companies
    echo "📋 COMPAÑÍAS (COMPANIES) - VENTA DE AUTOS:\n";
    echo str_repeat("=", 80) . "\n";
    $result = $mysqli->query("SELECT Id, name, Enabled FROM company ORDER BY Id");
    while ($row = $result->fetch_assoc()) {
        $status = $row['Enabled'] ? '✅' : '❌';
        echo sprintf("%s ID %d: %s\n", $status, $row['Id'], $row['name']);
    }
    
    // Mostrar agencias agrupadas por compañía
    echo "\n📋 AGENCIAS POR COMPAÑÍA - VENTA DE AUTOS:\n";
    echo str_repeat("=", 80) . "\n";
    
    foreach ($distribution as $companyId => $agencyIds) {
        $companyQuery = $mysqli->prepare("SELECT name FROM company WHERE Id = ?");
        $companyQuery->bind_param("i", $companyId);
        $companyQuery->execute();
        $companyResult = $companyQuery->get_result();
        $company = $companyResult->fetch_assoc();
        $companyQuery->close();
        
        $companyName = $company['name'] ?? "Company $companyId";
        $agencyCount = count($agencyIds);
        
        echo "\n$companyName (ID: $companyId): $agencyCount agencia(s)\n";
        echo str_repeat("-", 80) . "\n";
        
        foreach ($agencyIds as $idx => $agencyId) {
            $agencyQuery = $mysqli->prepare("SELECT Name, Enabled FROM agency WHERE Id = ?");
            $agencyQuery->bind_param("i", $agencyId);
            $agencyQuery->execute();
            $agencyResult = $agencyQuery->get_result();
            $agency = $agencyResult->fetch_assoc();
            $agencyQuery->close();
            
            if ($agency) {
                $status = $agency['Enabled'] ? '✅' : '❌';
                echo sprintf("  %s %d. ID %d: %s\n", $status, $idx + 1, $agencyId, $agency['Name']);
            }
        }
    }
    
    // Mostrar todas las agencias
    echo "\n📋 TODAS LAS AGENCIAS - VENTA DE AUTOS:\n";
    echo str_repeat("=", 80) . "\n";
    $result = $mysqli->query("SELECT a.Id, a.Name, a.IdCompany, c.name as CompanyName, a.Enabled FROM agency a LEFT JOIN company c ON a.IdCompany = c.Id ORDER BY a.Id");
    while ($row = $result->fetch_assoc()) {
        $companyName = $row['CompanyName'] ?? 'Sin compañía';
        $status = $row['Enabled'] ? '✅' : '❌';
        echo sprintf("%s ID %d: %-45s → %s (ID: %d)\n", 
            $status,
            $row['Id'], 
            $row['Name'], 
            $companyName,
            $row['IdCompany']
        );
    }
    
    $mysqli->close();
    
    echo "\n✅ Proceso completado\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
