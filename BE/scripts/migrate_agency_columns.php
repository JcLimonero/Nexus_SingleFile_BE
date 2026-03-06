<?php
/**
 * Migrar columnas de agency:
 * 1. Renombrar IdAgency a IdAgencyDMS en agency
 * 2. Mover AgencyConnection de agency a company
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== MIGRAR COLUMNAS DE AGENCY ===\n\n";

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
    
    $mysqli->begin_transaction();
    
    // Paso 1: Verificar datos actuales
    echo "📋 Paso 1: Verificando datos actuales...\n";
    
    // Verificar si hay datos en AgencyConnection
    $agencyConnResult = $mysqli->query("
        SELECT a.Id, a.AgencyConnection, a.IdCompany 
        FROM agency a 
        WHERE a.AgencyConnection IS NOT NULL AND a.AgencyConnection != ''
        LIMIT 10
    ");
    
    $agencyConnections = [];
    if ($agencyConnResult && $agencyConnResult->num_rows > 0) {
        echo "   Encontradas " . $agencyConnResult->num_rows . " agencias con AgencyConnection\n";
        while ($row = $agencyConnResult->fetch_assoc()) {
            $agencyConnections[] = $row;
            echo "   - Agencia ID {$row['Id']}: Company {$row['IdCompany']} -> Connection: {$row['AgencyConnection']}\n";
        }
    } else {
        echo "   ⚠️  No se encontraron agencias con AgencyConnection\n";
    }
    
    echo "\n";
    
    // Paso 2: Agregar columna AgencyConnection a company si no existe
    echo "📋 Paso 2: Agregando columna AgencyConnection a company...\n";
    
    $checkCompanyCol = $mysqli->query("SHOW COLUMNS FROM company LIKE 'AgencyConnection'");
    if ($checkCompanyCol->num_rows == 0) {
        $mysqli->query("ALTER TABLE company ADD COLUMN AgencyConnection VARCHAR(50) NULL AFTER Enabled");
        echo "   ✅ Columna AgencyConnection agregada a company\n";
    } else {
        echo "   ⏭️  Columna AgencyConnection ya existe en company\n";
    }
    
    // Paso 3: Migrar datos de AgencyConnection de agency a company
    echo "\n📋 Paso 3: Migrando datos de AgencyConnection...\n";
    
    if (!empty($agencyConnections)) {
        // Agrupar por IdCompany
        $companyConnections = [];
        foreach ($agencyConnections as $conn) {
            $companyId = $conn['IdCompany'];
            if ($companyId && !isset($companyConnections[$companyId])) {
                $companyConnections[$companyId] = $conn['AgencyConnection'];
            }
        }
        
        // Actualizar company con AgencyConnection
        foreach ($companyConnections as $companyId => $connection) {
            $updateQuery = $mysqli->prepare("UPDATE company SET AgencyConnection = ? WHERE Id = ?");
            $updateQuery->bind_param("si", $connection, $companyId);
            if ($updateQuery->execute()) {
                echo "   ✅ Company ID $companyId actualizada con AgencyConnection: $connection\n";
            } else {
                throw new Exception("Error al actualizar company ID $companyId: " . $updateQuery->error);
            }
            $updateQuery->close();
        }
    } else {
        echo "   ⏭️  No hay datos para migrar\n";
    }
    
    // Paso 4: Renombrar IdAgency a IdAgencyDMS en agency
    echo "\n📋 Paso 4: Renombrando IdAgency a IdAgencyDMS en agency...\n";
    
    $checkNewCol = $mysqli->query("SHOW COLUMNS FROM agency LIKE 'IdAgencyDMS'");
    if ($checkNewCol->num_rows == 0) {
        // Verificar si existe IdAgency
        $checkOldCol = $mysqli->query("SHOW COLUMNS FROM agency LIKE 'IdAgency'");
        if ($checkOldCol->num_rows > 0) {
            $mysqli->query("ALTER TABLE agency CHANGE COLUMN IdAgency IdAgencyDMS VARCHAR(50) NULL");
            echo "   ✅ Columna IdAgency renombrada a IdAgencyDMS\n";
        } else {
            echo "   ⚠️  Columna IdAgency no existe, creando IdAgencyDMS...\n";
            $mysqli->query("ALTER TABLE agency ADD COLUMN IdAgencyDMS VARCHAR(50) NULL AFTER Enabled");
            echo "   ✅ Columna IdAgencyDMS creada\n";
        }
    } else {
        echo "   ⏭️  Columna IdAgencyDMS ya existe\n";
    }
    
    // Paso 5: Eliminar columna AgencyConnection de agency
    echo "\n📋 Paso 5: Eliminando columna AgencyConnection de agency...\n";
    
    $checkAgencyConn = $mysqli->query("SHOW COLUMNS FROM agency LIKE 'AgencyConnection'");
    if ($checkAgencyConn->num_rows > 0) {
        $mysqli->query("ALTER TABLE agency DROP COLUMN AgencyConnection");
        echo "   ✅ Columna AgencyConnection eliminada de agency\n";
    } else {
        echo "   ⏭️  Columna AgencyConnection ya no existe en agency\n";
    }
    
    $mysqli->commit();
    
    echo "\n" . str_repeat("=", 80) . "\n";
    echo "✅ Migración completada exitosamente\n";
    echo str_repeat("=", 80) . "\n";
    
    // Verificación final
    echo "\n📋 Verificación final:\n";
    echo str_repeat("-", 80) . "\n";
    
    // Verificar estructura de agency
    $agencyCols = $mysqli->query("SHOW COLUMNS FROM agency");
    echo "Columnas en agency:\n";
    while ($col = $agencyCols->fetch_assoc()) {
        echo "   - {$col['Field']} ({$col['Type']})\n";
    }
    
    echo "\n";
    
    // Verificar estructura de company
    $companyCols = $mysqli->query("SHOW COLUMNS FROM company");
    echo "Columnas en company:\n";
    while ($col = $companyCols->fetch_assoc()) {
        echo "   - {$col['Field']} ({$col['Type']})\n";
    }
    
    $mysqli->close();
    
} catch (Exception $e) {
    if (isset($mysqli)) {
        $mysqli->rollback();
    }
    echo "\n❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
