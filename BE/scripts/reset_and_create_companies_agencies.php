<?php
/**
 * Borrar datos existentes y crear nuevas compañías y agencias
 * - 3 compañías (companies)
 * - Primera compañía: 2 agencias
 * - Tercera compañía: 1 agencia
 * - Cuarta compañía: 5 agencias (crearemos 4 compañías en total)
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== RESETEAR Y CREAR COMPAÑÍAS Y AGENCIAS ===\n\n";

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

echo "Base de datos: {$db['database']}\n";
echo "Host: {$db['hostname']}\n\n";

try {
    $mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);
    
    if ($mysqli->connect_error) {
        die("❌ Error de conexión: " . $mysqli->connect_error . "\n");
    }
    
    echo "✅ Conectado a la base de datos\n\n";
    
    // Desactivar verificación de foreign keys temporalmente
    $mysqli->query("SET FOREIGN_KEY_CHECKS = 0");
    
    // Borrar todas las agencias primero (porque tienen FK a company)
    echo "🗑️  Borrando agencias existentes...\n";
    $mysqli->query("DELETE FROM agency");
    $deletedAgencies = $mysqli->affected_rows;
    echo "   ✅ Borradas $deletedAgencies agencias\n";
    
    // Borrar todas las companies
    echo "🗑️  Borrando compañías existentes...\n";
    $mysqli->query("DELETE FROM company");
    $deletedCompanies = $mysqli->affected_rows;
    echo "   ✅ Borradas $deletedCompanies compañías\n\n";
    
    // Reactivar verificación de foreign keys
    $mysqli->query("SET FOREIGN_KEY_CHECKS = 1");
    
    // Crear 3 compañías (pero el usuario menciona 4ta, así que crearé 4)
    echo "🔄 Creando compañías (companies)...\n";
    echo str_repeat("-", 60) . "\n";
    
    $companies = [
        1 => 'Concesionaria Automotriz del Norte',
        2 => 'Grupo Automotriz Central',
        3 => 'Distribuidora de Vehículos Premium',
        4 => 'Talleres Mecánicos Especializados',
    ];
    
    $companiesCreated = 0;
    foreach ($companies as $id => $name) {
        $insertQuery = $mysqli->prepare("INSERT INTO company (Id, name) VALUES (?, ?)");
        $insertQuery->bind_param("is", $id, $name);
        if ($insertQuery->execute()) {
            echo "✅ Company ID $id: '$name'\n";
            $companiesCreated++;
        } else {
            echo "❌ Company ID $id: Error - " . $insertQuery->error . "\n";
        }
        $insertQuery->close();
    }
    
    // Crear agencias según distribución:
    // Primera compañía (ID 1): 2 agencias
    // Tercera compañía (ID 3): 1 agencia
    // Cuarta compañía (ID 4): 5 agencias
    echo "\n🔄 Creando agencias (agencies)...\n";
    echo str_repeat("-", 60) . "\n";
    
    $agencies = [
        // Primera compañía (ID 1): 2 agencias
        ['Id' => 1, 'Name' => 'Agencia Norte - Venta de Autos', 'IdCompany' => 1],
        ['Id' => 2, 'Name' => 'Agencia Norte - Servicio Técnico', 'IdCompany' => 1],
        
        // Tercera compañía (ID 3): 1 agencia
        ['Id' => 3, 'Name' => 'Agencia Premium - Showroom', 'IdCompany' => 3],
        
        // Cuarta compañía (ID 4): 5 agencias
        ['Id' => 4, 'Name' => 'Taller Mecánico Central', 'IdCompany' => 4],
        ['Id' => 5, 'Name' => 'Taller de Carrocería', 'IdCompany' => 4],
        ['Id' => 6, 'Name' => 'Taller de Transmisiones', 'IdCompany' => 4],
        ['Id' => 7, 'Name' => 'Centro de Mantenimiento', 'IdCompany' => 4],
        ['Id' => 8, 'Name' => 'Servicio Express', 'IdCompany' => 4],
    ];
    
    $agenciesCreated = 0;
    foreach ($agencies as $agency) {
        $id = $agency['Id'];
        $name = $agency['Name'];
        $idCompany = $agency['IdCompany'];
        
        $insertQuery = $mysqli->prepare("INSERT INTO agency (Id, Name, IdCompany, Enabled, RegistrationDate, UpdateDate) VALUES (?, ?, ?, 1, NOW(), NOW())");
        $insertQuery->bind_param("isi", $id, $name, $idCompany);
        if ($insertQuery->execute()) {
            echo "✅ Agency ID $id: '$name' → Company ID $idCompany\n";
            $agenciesCreated++;
        } else {
            echo "❌ Agency ID $id: Error - " . $insertQuery->error . "\n";
        }
        $insertQuery->close();
    }
    
    // Mostrar resumen
    echo "\n" . str_repeat("=", 60) . "\n";
    echo "📊 RESUMEN:\n";
    echo str_repeat("=", 60) . "\n";
    echo "✅ Companies creadas: $companiesCreated\n";
    echo "✅ Agencies creadas: $agenciesCreated\n\n";
    
    // Mostrar companies
    echo "📋 COMPAÑÍAS (COMPANIES):\n";
    echo str_repeat("=", 60) . "\n";
    $result = $mysqli->query("SELECT Id, name FROM company ORDER BY Id");
    while ($row = $result->fetch_assoc()) {
        echo sprintf("ID %d: %s\n", $row['Id'], $row['name']);
    }
    
    // Mostrar agencias agrupadas por compañía
    echo "\n📋 AGENCIAS POR COMPAÑÍA:\n";
    echo str_repeat("=", 60) . "\n";
    
    $result = $mysqli->query("
        SELECT c.Id as CompanyId, c.name as CompanyName, 
               COUNT(a.Id) as AgencyCount,
               GROUP_CONCAT(a.Id ORDER BY a.Id) as AgencyIds
        FROM company c
        LEFT JOIN agency a ON c.Id = a.IdCompany
        GROUP BY c.Id, c.name
        ORDER BY c.Id
    ");
    
    while ($row = $result->fetch_assoc()) {
        $companyId = $row['CompanyId'];
        $companyName = $row['CompanyName'];
        $agencyCount = $row['AgencyCount'] ?? 0;
        
        echo "\n$companyName (ID: $companyId): $agencyCount agencia(s)\n";
        
        if ($agencyCount > 0) {
            $agencyIds = explode(',', $row['AgencyIds']);
            $agencyQuery = $mysqli->prepare("SELECT Id, Name FROM agency WHERE IdCompany = ? ORDER BY Id");
            $agencyQuery->bind_param("i", $companyId);
            $agencyQuery->execute();
            $agencyResult = $agencyQuery->get_result();
            
            $idx = 1;
            while ($agency = $agencyResult->fetch_assoc()) {
                echo "  $idx. ID {$agency['Id']}: {$agency['Name']}\n";
                $idx++;
            }
            $agencyQuery->close();
        }
    }
    
    // Mostrar todas las agencias
    echo "\n📋 TODAS LAS AGENCIAS:\n";
    echo str_repeat("=", 60) . "\n";
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
    
    $mysqli->close();
    
    echo "\n✅ Proceso completado\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
