<?php
/**
 * Script completo para verificar que todas las tablas y columnas necesarias existan en la BD
 * 
 * Uso: php scripts/verify_database_objects.php
 */

echo "=== Verificación Completa de Objetos en Base de Datos ===\n\n";

// Cargar configuración desde JSON
$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

$mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);

if ($mysqli->connect_error) {
    die("❌ Error de conexión: " . $mysqli->connect_error . "\n");
}

echo "✅ Conectado a la base de datos: {$db['database']}\n\n";

// Lista completa de tablas que se usan en el código
$requiredTables = [
    // Tablas principales
    'User',
    'UserRol',
    'Agency',
    'Agency_User',
    'Process',
    'Process_User',
    'File',
    'File_Status',
    'File_SubStatus',
    'File_Reasons',
    'File_Extraordinary_Reasons',
    'DocumentByFile',
    'DocumentType',
    'DocumentFile_Status',
    'DocumentFile_Error',
    'ConfigurationProcess',
    'ConfigurationProcess_DocumentType',
    'Client',
    'HeaderClient',
    'Client_Total_Relation',
    'OrderByCar',
    'OperationType',
    'customertype',
    'Company',
    
    // Tablas de autenticación y tokens
    'User_RefreshToken',
    'File_ShareToken',
    
    // Tablas PLD
    'file_pld',
    'file_pld_geolog',
    'file_pld_beneficiariofinal',
    'file_pld_documento_aprobado',
    
    // Tablas de logs
    'user_activity_logs',
    
    // Tablas alternativas (pueden no existir)
    'clients',
    'files',
    
    // Otras tablas
    'Bank',
    'CFDI',
    'AppVersion',
    'Tracking_File',
    'Tracking_Operation',
    'smtp_configurator',
];

// Columnas críticas que deben existir en cada tabla
$requiredColumns = [
    'User' => ['Id', 'Name', 'User', 'Pass', 'Mail', 'Enabled', 'IdUserRol', 'RegistrationDate', 'UpdateDate'],
    'UserRol' => ['Id', 'Name', 'Enabled', 'RegistrationDate', 'UpdateDate'],
    'Agency' => ['Id', 'Name', 'Enabled', 'IdCompany', 'RegistrationDate', 'UpdateDate'],
    'Agency_User' => ['IdUser', 'IdAgency'],
    'Process' => ['Id', 'Name', 'Enabled', 'RegistrationDate', 'UpdateDate'],
    'Process_User' => ['IdUser', 'IdProcess'],
    'File' => ['Id', 'IdClient', 'IdOrder', 'IdOperation', 'IdProcess', 'IdAgency', 'IdCurrentState', 'Description', 'RegistrationDate', 'UpdateDate'],
    'File_Status' => ['Id', 'Name'],
    'File_SubStatus' => ['Id', 'Name'],
    'File_Reasons' => ['Id', 'Name', 'IdTypeReason', 'Enabled'],
    'File_Extraordinary_Reasons' => ['Id', 'Name', 'IdTypeReason', 'Enabled'],
    'DocumentByFile' => ['Id', 'IdFile', 'IdDocumentType', 'IdCurrentStatus', 'RegistrationDate', 'UpdateDate'],
    'DocumentType' => ['Id', 'Name', 'IdProcessType', 'IdSubProcess'],
    'DocumentFile_Status' => ['Id', 'Name'],
    'DocumentFile_Error' => ['Id', 'Description'],
    'ConfigurationProcess' => ['Id', 'IdCustomerType', 'IdOperationType', 'IdAgency', 'IdProcess', 'Enabled'],
    'ConfigurationProcess_DocumentType' => ['Id', 'IdConfigurationProcess', 'IdDocumentType', 'Required'],
    'Client' => ['Id', 'Name', 'RFC', 'RegistrationDate'],
    'HeaderClient' => ['Id', 'Name', 'RFC'],
    'Client_Total_Relation' => ['Id', 'IdTotalDealer', 'IdAgency', 'idHeaderClient'],
    'OrderByCar' => ['Id', 'Number', 'VIN', 'IdTotalDealer'],
    'OperationType' => ['Id', 'Name', 'Enabled'],
    'CostumerType' => ['Id', 'Name', 'Enabled'],
    'Company' => ['Id', 'Name'],
];

$missingTables = [];
$missingColumns = [];
$allGood = true;

echo "Verificando tablas...\n";
echo str_repeat("=", 80) . "\n\n";

foreach ($requiredTables as $table) {
    $result = $mysqli->query("SHOW TABLES LIKE '$table'");
    
    if ($result && $result->num_rows > 0) {
        echo "✅ Tabla '$table' existe\n";
        
        // Verificar columnas si están definidas
        if (isset($requiredColumns[$table])) {
            $columnsResult = $mysqli->query("SHOW COLUMNS FROM `$table`");
            $existingColumns = [];
            while ($row = $columnsResult->fetch_assoc()) {
                $existingColumns[] = $row['Field'];
            }
            
            $missingCols = [];
            foreach ($requiredColumns[$table] as $col) {
                if (!in_array($col, $existingColumns)) {
                    $missingCols[] = $col;
                }
            }
            
            if (!empty($missingCols)) {
                echo "   ⚠️  Columnas faltantes: " . implode(', ', $missingCols) . "\n";
                $missingColumns[$table] = $missingCols;
                $allGood = false;
            } else {
                echo "   ✅ Todas las columnas requeridas existen\n";
            }
        }
    } else {
        echo "❌ Tabla '$table' NO existe\n";
        $missingTables[] = $table;
        $allGood = false;
    }
}

echo "\n" . str_repeat("=", 80) . "\n";
echo "RESUMEN\n";
echo str_repeat("=", 80) . "\n\n";

if (empty($missingTables) && empty($missingColumns)) {
    echo "✅ TODAS las tablas y columnas requeridas existen en la base de datos.\n";
} else {
    if (!empty($missingTables)) {
        echo "❌ TABLAS FALTANTES (" . count($missingTables) . "):\n";
        foreach ($missingTables as $table) {
            echo "   - $table\n";
        }
        echo "\n";
    }
    
    if (!empty($missingColumns)) {
        echo "⚠️  COLUMNAS FALTANTES:\n";
        foreach ($missingColumns as $table => $cols) {
            echo "   Tabla '$table':\n";
            foreach ($cols as $col) {
                echo "      - $col\n";
            }
        }
        echo "\n";
    }
}

// Verificar columnas específicas que cambiaron de nombre
echo "\n" . str_repeat("=", 80) . "\n";
echo "VERIFICACIÓN DE CAMBIOS DE NOMBRES\n";
echo str_repeat("=", 80) . "\n\n";

$nameChangeChecks = [
    'File_Reasons' => ['Name' => true, 'Description' => false],
    'File_Extraordinary_Reasons' => ['Name' => true, 'Comment' => false],
    'File_Status' => ['Name' => true, 'Description' => false],
    'DocumentFile_Status' => ['Name' => true, 'Description' => false],
];

foreach ($nameChangeChecks as $table => $checks) {
    $result = $mysqli->query("SHOW COLUMNS FROM `$table`");
    if ($result) {
        $columns = [];
        while ($row = $result->fetch_assoc()) {
            $columns[] = $row['Field'];
        }
        
        echo "Tabla '$table':\n";
        foreach ($checks as $col => $shouldExist) {
            $exists = in_array($col, $columns);
            if ($shouldExist && $exists) {
                echo "   ✅ Columna '$col' existe (correcto)\n";
            } elseif ($shouldExist && !$exists) {
                echo "   ❌ Columna '$col' NO existe (debería existir)\n";
                $allGood = false;
            } elseif (!$shouldExist && !$exists) {
                echo "   ✅ Columna '$col' no existe (correcto - fue renombrada)\n";
            } elseif (!$shouldExist && $exists) {
                echo "   ⚠️  Columna '$col' existe pero debería haber sido renombrada\n";
                $allGood = false;
            }
        }
        echo "\n";
    }
}

$mysqli->close();

echo str_repeat("=", 80) . "\n";
if ($allGood) {
    echo "✅ VERIFICACIÓN COMPLETA: Todos los objetos necesarios existen correctamente.\n";
    exit(0);
} else {
    echo "❌ VERIFICACIÓN COMPLETA: Se encontraron problemas. Revisa el reporte arriba.\n";
    exit(1);
}
