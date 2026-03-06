<?php
/**
 * Crear companies adicionales y asociarlas a agencies según distribución:
 * - Agency 1: 10 companies
 * - Agency 2: 1 company
 * - Agency 3: 6 companies
 * - Agency 4: (resto o sin asignar)
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== CREAR COMPANIES CON DISTRIBUCIÓN ===\n\n";

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

echo "Base de datos: {$db['database']}\n";
echo "Host: {$db['hostname']}\n\n";

// Companies adicionales (ya tenemos 4, necesitamos más para la distribución)
// Total necesario: 10 + 1 + 6 = 17 companies
// Ya tenemos: 4
// Necesitamos crear: 13 más (IDs 5-17)

$additionalCompanies = [];
for ($i = 5; $i <= 17; $i++) {
    $additionalCompanies[] = [
        'Id' => $i,
        'name' => "Company " . chr(64 + ($i % 26) + 1) . ($i > 26 ? floor($i / 26) : '') // Genera nombres como Company E, Company F, etc.
    ];
}

// Mejor usar nombres más descriptivos
$companyNames = [
    5 => 'Company Echo',
    6 => 'Company Foxtrot',
    7 => 'Company Golf',
    8 => 'Company Hotel',
    9 => 'Company India',
    10 => 'Company Juliet',
    11 => 'Company Kilo',
    12 => 'Company Lima',
    13 => 'Company Mike',
    14 => 'Company November',
    15 => 'Company Oscar',
    16 => 'Company Papa',
    17 => 'Company Quebec',
];

// Actualizar con nombres descriptivos
foreach ($companyNames as $id => $name) {
    foreach ($additionalCompanies as &$company) {
        if ($company['Id'] == $id) {
            $company['name'] = $name;
            break;
        }
    }
}

// Distribución de companies a agencies
// Agency 1: Companies 1-10 (10 companies)
// Agency 2: Company 11 (1 company)
// Agency 3: Companies 12-17 (6 companies)
// Agency 4: Sin companies adicionales (ya tiene Company 4)

$distribution = [
    1 => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // Agency 1: 10 companies
    2 => [11],                              // Agency 2: 1 company
    3 => [12, 13, 14, 15, 16, 17],         // Agency 3: 6 companies
    4 => [4],                               // Agency 4: mantiene su company original
];

try {
    $mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);
    
    if ($mysqli->connect_error) {
        die("❌ Error de conexión: " . $mysqli->connect_error . "\n");
    }
    
    echo "✅ Conectado a la base de datos\n\n";
    
    // Crear companies adicionales
    echo "🔄 Creando companies adicionales...\n";
    echo str_repeat("-", 60) . "\n";
    
    $companiesCreated = 0;
    foreach ($additionalCompanies as $company) {
        $id = $company['Id'];
        $name = $company['name'];
        
        $insertQuery = $mysqli->prepare("INSERT INTO company (Id, name) VALUES (?, ?) ON DUPLICATE KEY UPDATE name = ?");
        $insertQuery->bind_param("iss", $id, $name, $name);
        if ($insertQuery->execute()) {
            echo "✅ Company ID $id: '$name'\n";
            $companiesCreated++;
        } else {
            echo "⚠️  Company ID $id: " . $insertQuery->error . "\n";
        }
        $insertQuery->close();
    }
    
    // Actualizar agencies con la distribución correcta
    echo "\n🔄 Actualizando distribución de companies en agencies...\n";
    echo str_repeat("-", 60) . "\n";
    
    // Para cada agency, asignar la primera company de su lista como IdCompany principal
    // Nota: En el esquema actual, cada agency solo puede tener un IdCompany
    // Si necesitas múltiples companies por agency, necesitarías una tabla de relación
    
    foreach ($distribution as $agencyId => $companyIds) {
        if (!empty($companyIds)) {
            $primaryCompanyId = $companyIds[0]; // Usar la primera como principal
            
            $updateQuery = $mysqli->prepare("UPDATE agency SET IdCompany = ? WHERE Id = ?");
            $updateQuery->bind_param("ii", $primaryCompanyId, $agencyId);
            if ($updateQuery->execute()) {
                $companyCount = count($companyIds);
                echo "✅ Agency ID $agencyId: Asignada Company ID $primaryCompanyId (Total companies en distribución: $companyCount)\n";
            }
            $updateQuery->close();
        }
    }
    
    // Mostrar resumen
    echo "\n" . str_repeat("=", 60) . "\n";
    echo "📊 RESUMEN:\n";
    echo str_repeat("=", 60) . "\n";
    echo "✅ Companies adicionales creadas: $companiesCreated\n\n";
    
    // Mostrar distribución
    echo "📋 DISTRIBUCIÓN DE COMPANIES POR AGENCY:\n";
    echo str_repeat("=", 60) . "\n";
    
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
        echo "  Companies IDs: " . implode(', ', $companyIds) . "\n";
        
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
        echo "  Nombres: " . implode(', ', $companyNamesList) . "\n";
    }
    
    // Mostrar todas las companies
    echo "\n📋 TODAS LAS COMPANIES:\n";
    echo str_repeat("=", 60) . "\n";
    $result = $mysqli->query("SELECT Id, name FROM company ORDER BY Id");
    $totalCompanies = 0;
    while ($row = $result->fetch_assoc()) {
        echo "ID {$row['Id']}: {$row['name']}\n";
        $totalCompanies++;
    }
    echo "\nTotal: $totalCompanies companies\n";
    
    $mysqli->close();
    
    echo "\n✅ Proceso completado\n";
    echo "\n⚠️  NOTA: Cada agency solo puede tener un IdCompany asignado.\n";
    echo "   Si necesitas múltiples companies por agency, considera crear una tabla de relación.\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
