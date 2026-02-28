<?php
/**
 * Script maestro para ejecutar migración completa de nombres
 * 
 * Este script ejecuta todas las correcciones de nombres en orden:
 * 1. Corregir errores de ortografía
 * 2. Renombrar tablas poco claras
 * 3. Corregir tipos de datos
 * 4. Actualizar foreign keys
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);
set_time_limit(600);

echo "═══════════════════════════════════════════════════════════════════════════════\n";
echo "  MIGRACIÓN COMPLETA: CORRECCIÓN DE NOMBRES DE TABLAS Y COLUMNAS\n";
echo "═══════════════════════════════════════════════════════════════════════════════\n\n";

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

echo "Base de datos: {$db['database']}\n";
echo "Host: {$db['hostname']}\n";
echo "Fecha: " . date('Y-m-d H:i:s') . "\n\n";

try {
    $mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);
    
    if ($mysqli->connect_error) {
        die("❌ Error de conexión: " . $mysqli->connect_error . "\n");
    }
    
    echo "✅ Conectado a la base de datos\n\n";
    
    $mysqli->begin_transaction();
    $mysqli->query("SET FOREIGN_KEY_CHECKS = 0");
    
    // ============================================================================
    // PASO 1: CORREGIR ERRORES DE ORTOGRAFÍA
    // ============================================================================
    echo "📋 PASO 1: Corregir errores de ortografía\n";
    echo str_repeat("=", 80) . "\n";
    
    // 1.1 Corregir IdCostumerType → IdCustomerType en configuration_process
    echo "   → Corrigiendo IdCostumerType → IdCustomerType en configuration_process...\n";
    $colExists = $mysqli->query("
        SELECT COUNT(*) as count 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = '{$db['database']}' 
        AND TABLE_NAME = 'configuration_process' 
        AND COLUMN_NAME = 'IdCostumerType'
    ")->fetch_assoc()['count'];
    
    if ($colExists > 0) {
        $mysqli->query("ALTER TABLE `configuration_process` CHANGE COLUMN `IdCostumerType` `IdCustomerType` BIGINT DEFAULT 0");
        echo "   ✅ Columna corregida\n";
    } else {
        echo "   ⏭️  Columna ya corregida o no existe\n";
    }
    
    // 1.2 Corregir IdCostumerType → IdCustomerType en file
    echo "   → Corrigiendo IdCostumerType → IdCustomerType en file...\n";
    $colExists = $mysqli->query("
        SELECT COUNT(*) as count 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = '{$db['database']}' 
        AND TABLE_NAME = 'file' 
        AND COLUMN_NAME = 'IdCostumerType'
    ")->fetch_assoc()['count'];
    
    if ($colExists > 0) {
        $mysqli->query("ALTER TABLE `file` CHANGE COLUMN `IdCostumerType` `IdCustomerType` BIGINT");
        echo "   ✅ Columna corregida\n";
    } else {
        echo "   ⏭️  Columna ya corregida o no existe\n";
    }
    
    // 1.3 Corregir ExperationDate → ExpirationDate
    echo "   → Corrigiendo ExperationDate → ExpirationDate en document_by_file...\n";
    $colExists = $mysqli->query("
        SELECT COUNT(*) as count 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = '{$db['database']}' 
        AND TABLE_NAME = 'document_by_file' 
        AND COLUMN_NAME = 'ExperationDate'
    ")->fetch_assoc()['count'];
    
    if ($colExists > 0) {
        $mysqli->query("ALTER TABLE `document_by_file` CHANGE COLUMN `ExperationDate` `ExpirationDate` TIMESTAMP NULL");
        echo "   ✅ Columna corregida\n";
    } else {
        echo "   ⏭️  Columna ya corregida o no existe\n";
    }
    
    // 1.4 Corregir IdInventary → IdInventory
    echo "   → Corrigiendo IdInventary → IdInventory en file...\n";
    $colExists = $mysqli->query("
        SELECT COUNT(*) as count 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = '{$db['database']}' 
        AND TABLE_NAME = 'file' 
        AND COLUMN_NAME = 'IdInventary'
    ")->fetch_assoc()['count'];
    
    if ($colExists > 0) {
        $mysqli->query("ALTER TABLE `file` CHANGE COLUMN `IdInventary` `IdInventory` VARCHAR(50)");
        echo "   ✅ Columna corregida\n";
    } else {
        echo "   ⏭️  Columna ya corregida o no existe\n";
    }
    
    // 1.5 Corregir OtuputDate → OutputDate
    echo "   → Corrigiendo OtuputDate → OutputDate en file_tracking...\n";
    $colExists = $mysqli->query("
        SELECT COUNT(*) as count 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = '{$db['database']}' 
        AND TABLE_NAME = 'file_tracking' 
        AND COLUMN_NAME = 'OtuputDate'
    ")->fetch_assoc()['count'];
    
    if ($colExists > 0) {
        $mysqli->query("ALTER TABLE `file_tracking` CHANGE COLUMN `OtuputDate` `OutputDate` TIMESTAMP NULL");
        echo "   ✅ Columna corregida\n";
    } else {
        echo "   ⏭️  Columna ya corregida o no existe\n";
    }
    
    // 1.6 Corregir File_Release_Steaps → File_Release_Steps
    echo "   → Corrigiendo File_Release_Steaps → File_Release_Steps...\n";
    $tableExists = $mysqli->query("
        SELECT COUNT(*) as count 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_SCHEMA = '{$db['database']}' 
        AND TABLE_NAME = 'File_Release_Steaps'
    ")->fetch_assoc()['count'];
    
    if ($tableExists > 0) {
        $mysqli->query("RENAME TABLE `File_Release_Steaps` TO `File_Release_Steps`");
        echo "   ✅ Tabla renombrada\n";
    } else {
        echo "   ⏭️  Tabla ya renombrada o no existe\n";
    }
    
    echo "\n";
    
    // ============================================================================
    // PASO 2: RENOMBRAR TABLAS POCO CLARAS
    // ============================================================================
    echo "📋 PASO 2: Renombrar tablas poco claras\n";
    echo str_repeat("=", 80) . "\n";
    
    $tableRenames = [
        ['old' => 'file', 'new' => 'expedient', 'desc' => 'File → Expedient'],
        ['old' => 'order_by_car', 'new' => 'order', 'desc' => 'OrderByCar → Order'],
        ['old' => 'document_by_file', 'new' => 'file_document', 'desc' => 'DocumentByFile → FileDocument'],
        ['old' => 'header_client', 'new' => 'client_header', 'desc' => 'HeaderClient → ClientHeader'],
        ['old' => 'client_total_relation', 'new' => 'client_dms_relation', 'desc' => 'Client_Total_Relation → ClientDMSRelation'],
        ['old' => 'file_extraordinary_events', 'new' => 'file_exception', 'desc' => 'File_Extraordinary_Events → FileException'],
        ['old' => 'file_extraordinary_reasons', 'new' => 'file_exception_reason', 'desc' => 'File_Extraordinary_Reasons → FileExceptionReason'],
        ['old' => 'file_extraordinary_type', 'new' => 'file_exception_type', 'desc' => 'File_Extraordinary_Type → FileExceptionType'],
        ['old' => 'file_tracking', 'new' => 'file_history', 'desc' => 'File_Tracking → FileHistory'],
        ['old' => 'smtp_configurator', 'new' => 'smtp_config', 'desc' => 'smtp_configurator → SMTPConfig'],
    ];
    
    foreach ($tableRenames as $rename) {
        echo "   → {$rename['desc']}...\n";
        $tableExists = $mysqli->query("
            SELECT COUNT(*) as count 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_SCHEMA = '{$db['database']}' 
            AND TABLE_NAME = '{$rename['old']}'
        ")->fetch_assoc()['count'];
        
        if ($tableExists > 0) {
            $mysqli->query("RENAME TABLE `{$rename['old']}` TO `{$rename['new']}`");
            echo "   ✅ Tabla renombrada\n";
        } else {
            echo "   ⏭️  Tabla no existe o ya renombrada\n";
        }
    }
    
    echo "\n";
    
    // ============================================================================
    // PASO 3: CORREGIR TIPOS DE DATOS
    // ============================================================================
    echo "📋 PASO 3: Corregir tipos de datos\n";
    echo str_repeat("=", 80) . "\n";
    
    // 3.1 Corregir Client.UpdateDate de VARCHAR a TIMESTAMP
    echo "   → Corrigiendo Client.UpdateDate (VARCHAR → TIMESTAMP)...\n";
    $colInfo = $mysqli->query("
        SELECT DATA_TYPE 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = '{$db['database']}' 
        AND TABLE_NAME = 'client' 
        AND COLUMN_NAME = 'UpdateDate'
    ")->fetch_assoc();
    
    if ($colInfo && $colInfo['DATA_TYPE'] === 'varchar') {
        $mysqli->query("ALTER TABLE `client` CHANGE COLUMN `UpdateDate` `UpdateDate` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP");
        echo "   ✅ Tipo de dato corregido\n";
    } else {
        echo "   ⏭️  Tipo de dato ya correcto\n";
    }
    
    // 3.2 Eliminar IdTestg si existe
    echo "   → Eliminando columna IdTestg de file_history...\n";
    $colExists = $mysqli->query("
        SELECT COUNT(*) as count 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = '{$db['database']}' 
        AND TABLE_NAME = 'file_history' 
        AND COLUMN_NAME = 'IdTestg'
    ")->fetch_assoc()['count'];
    
    if ($colExists > 0) {
        $mysqli->query("ALTER TABLE `file_history` DROP COLUMN `IdTestg`");
        echo "   ✅ Columna eliminada\n";
    } else {
        echo "   ⏭️  Columna no existe\n";
    }
    
    echo "\n";
    
    // ============================================================================
    // PASO 4: ACTUALIZAR FOREIGN KEYS
    // ============================================================================
    echo "📋 PASO 4: Actualizar foreign keys\n";
    echo str_repeat("=", 80) . "\n";
    
    // Actualizar foreign keys que referencian tablas renombradas
    updateForeignKeys($mysqli, $db['database']);
    
    $mysqli->query("SET FOREIGN_KEY_CHECKS = 1");
    $mysqli->commit();
    
    echo "\n";
    echo "═══════════════════════════════════════════════════════════════════════════════\n";
    echo "✅ ¡Migración completada exitosamente!\n";
    echo "═══════════════════════════════════════════════════════════════════════════════\n";
    
    // Verificación final
    echo "\n📋 Verificación final:\n";
    echo str_repeat("-", 80) . "\n";
    
    $tables = $mysqli->query("SHOW TABLES");
    $tableList = [];
    while ($row = $tables->fetch_array()) {
        $tableList[] = $row[0];
    }
    
    echo "Total de tablas: " . count($tableList) . "\n";
    echo "\nTablas renombradas verificadas:\n";
    $renamedTables = ['expedient', 'order', 'file_document', 'client_header', 'client_dms_relation', 
                      'file_exception', 'file_exception_reason', 'file_exception_type', 'file_history', 'smtp_config'];
    foreach ($renamedTables as $table) {
        if (in_array($table, $tableList)) {
            echo "   ✅ $table\n";
        }
    }
    
    $mysqli->close();
    
} catch (Exception $e) {
    if (isset($mysqli)) {
        $mysqli->rollback();
        $mysqli->query("SET FOREIGN_KEY_CHECKS = 1");
    }
    echo "\n❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
    exit(1);
}

/**
 * Actualizar foreign keys después de renombrar tablas
 */
function updateForeignKeys($mysqli, $database) {
    // Lista de foreign keys que necesitan actualizarse
    $fkUpdates = [
        // Foreign keys que referencian 'file' → 'expedient'
        ['table' => 'file_document', 'column' => 'IdFile', 'ref_table' => 'expedient', 'ref_column' => 'Id'],
        ['table' => 'file_history', 'column' => 'IdFile', 'ref_table' => 'expedient', 'ref_column' => 'Id'],
        ['table' => 'file_exception', 'column' => 'IdFile', 'ref_table' => 'expedient', 'ref_column' => 'Id'],
        ['table' => 'file_release_steps', 'column' => 'IdFile', 'ref_table' => 'expedient', 'ref_column' => 'Id'],
        ['table' => 'file_pld', 'column' => 'IdFile', 'ref_table' => 'expedient', 'ref_column' => 'Id'],
        ['table' => 'expedient', 'column' => 'IdOrder', 'ref_table' => 'order', 'ref_column' => 'Id'],
        ['table' => 'expedient', 'column' => 'IdClient', 'ref_table' => 'client_header', 'ref_column' => 'Id'],
        ['table' => 'file_exception', 'column' => 'IdExtraordinaryReason', 'ref_table' => 'file_exception_reason', 'ref_column' => 'Id'],
        ['table' => 'file_exception_reason', 'column' => 'IdExtraordinaryType', 'ref_table' => 'file_exception_type', 'ref_column' => 'Id'],
        ['table' => 'file_exception', 'column' => 'IdExtraordinaryType', 'ref_table' => 'file_exception_type', 'ref_column' => 'Id'],
    ];
    
    foreach ($fkUpdates as $fk) {
        // Verificar si la tabla existe
        $tableExists = $mysqli->query("
            SELECT COUNT(*) as count 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_SCHEMA = '$database' 
            AND TABLE_NAME = '{$fk['table']}'
        ")->fetch_assoc()['count'];
        
        if ($tableExists == 0) {
            echo "   ⏭️  Tabla {$fk['table']} no existe, omitiendo FK\n";
            continue;
        }
        
        // Verificar si la columna existe
        $colExists = $mysqli->query("
            SELECT COUNT(*) as count 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = '$database' 
            AND TABLE_NAME = '{$fk['table']}' 
            AND COLUMN_NAME = '{$fk['column']}'
        ")->fetch_assoc()['count'];
        
        if ($colExists == 0) {
            echo "   ⏭️  Columna {$fk['table']}.{$fk['column']} no existe, omitiendo FK\n";
            continue;
        }
        
        // Verificar si la tabla referenciada existe
        $refTableExists = $mysqli->query("
            SELECT COUNT(*) as count 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_SCHEMA = '$database' 
            AND TABLE_NAME = '{$fk['ref_table']}'
        ")->fetch_assoc()['count'];
        
        if ($refTableExists == 0) {
            echo "   ⏭️  Tabla referenciada {$fk['ref_table']} no existe, omitiendo FK\n";
            continue;
        }
        
        // Obtener nombre de FK existente
        $fkNameResult = $mysqli->query("
            SELECT CONSTRAINT_NAME 
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
            WHERE TABLE_SCHEMA = '$database' 
            AND TABLE_NAME = '{$fk['table']}' 
            AND COLUMN_NAME = '{$fk['column']}'
            AND REFERENCED_TABLE_NAME IS NOT NULL
            LIMIT 1
        ");
        
        $fkName = null;
        if ($fkNameResult && $row = $fkNameResult->fetch_assoc()) {
            $fkName = $row['CONSTRAINT_NAME'];
        }
        
        // Eliminar FK existente si existe
        if ($fkName) {
            $mysqli->query("ALTER TABLE `{$fk['table']}` DROP FOREIGN KEY `$fkName`");
            echo "   ✅ FK eliminada: $fkName\n";
        }
        
        // Crear nueva FK
        $fkConstraintName = "FK_{$fk['table']}_{$fk['column']}";
        $createFk = "ALTER TABLE `{$fk['table']}` 
                     ADD CONSTRAINT `$fkConstraintName` 
                     FOREIGN KEY (`{$fk['column']}`) 
                     REFERENCES `{$fk['ref_table']}` (`{$fk['ref_column']}`) 
                     ON DELETE SET NULL ON UPDATE CASCADE";
        
        if ($mysqli->query($createFk)) {
            echo "   ✅ FK creada: $fkConstraintName\n";
        } else {
            // Algunos errores son esperados (FKs que ya existen o problemas de datos)
            if (strpos($mysqli->error, 'Duplicate key name') === false) {
                echo "   ⚠️  Error creando FK $fkConstraintName: " . $mysqli->error . "\n";
            }
        }
    }
}
