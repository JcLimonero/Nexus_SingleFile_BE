<?php
/**
 * Script maestro para ejecutar todas las migraciones de renombrado
 * 
 * Este script ejecuta las migraciones en orden correcto:
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
    
    // Paso 1: Corregir errores de ortografía
    echo "📋 Paso 1: Corregir errores de ortografía...\n";
    echo str_repeat("-", 80) . "\n";
    executeMigrationFile($mysqli, __DIR__ . '/../DB/migrations/037_fix_spelling_errors.sql');
    echo "✅ Errores de ortografía corregidos\n\n";
    
    // Paso 2: Renombrar tablas poco claras
    echo "📋 Paso 2: Renombrar tablas poco claras...\n";
    echo str_repeat("-", 80) . "\n";
    executeMigrationFile($mysqli, __DIR__ . '/../DB/migrations/038_rename_unclear_tables.sql');
    echo "✅ Tablas renombradas\n\n";
    
    // Paso 3: Corregir tipos de datos
    echo "📋 Paso 3: Corregir tipos de datos y columnas...\n";
    echo str_repeat("-", 80) . "\n";
    executeMigrationFile($mysqli, __DIR__ . '/../DB/migrations/039_fix_column_types_and_names.sql');
    echo "✅ Tipos de datos corregidos\n\n";
    
    // Paso 4: Actualizar foreign keys
    echo "📋 Paso 4: Actualizar foreign keys...\n";
    echo str_repeat("-", 80) . "\n";
    updateForeignKeys($mysqli);
    echo "✅ Foreign keys actualizadas\n\n";
    
    $mysqli->commit();
    
    echo "═══════════════════════════════════════════════════════════════════════════════\n";
    echo "✅ ¡Migración completada exitosamente!\n";
    echo "═══════════════════════════════════════════════════════════════════════════════\n";
    
    $mysqli->close();
    
} catch (Exception $e) {
    if (isset($mysqli)) {
        $mysqli->rollback();
    }
    echo "\n❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
    exit(1);
}

/**
 * Ejecutar archivo SQL de migración
 */
function executeMigrationFile($mysqli, $filePath) {
    if (!file_exists($filePath)) {
        echo "⚠️  Archivo no encontrado: $filePath\n";
        return;
    }
    
    $sql = file_get_contents($filePath);
    
    // Dividir en statements individuales
    $statements = array_filter(
        array_map('trim', explode(';', $sql)),
        function($stmt) {
            return !empty($stmt) && 
                   !preg_match('/^(--|SET|PREPARE|EXECUTE|DEALLOCATE)/i', $stmt) &&
                   !preg_match('/^SELECT.*AS (status|message)/i', $stmt);
        }
    );
    
    foreach ($statements as $statement) {
        if (empty(trim($statement))) continue;
        
        // Ejecutar statement
        if (!$mysqli->query($statement)) {
            // Algunos errores son esperados (tablas/columnas que no existen)
            if (strpos($mysqli->error, 'doesn\'t exist') === false && 
                strpos($mysqli->error, 'Unknown column') === false) {
                throw new Exception("Error ejecutando SQL: " . $mysqli->error . "\nSQL: " . substr($statement, 0, 100));
            }
        }
    }
}

/**
 * Actualizar foreign keys después de renombrar tablas
 */
function updateForeignKeys($mysqli) {
    // Lista de foreign keys que necesitan actualizarse
    $fkUpdates = [
        // Foreign keys que referencian 'file' → 'expedient'
        [
            'table' => 'file_document',
            'column' => 'IdFile',
            'ref_table' => 'expedient',
            'ref_column' => 'Id',
            'name' => 'FK_file_document_IdFile'
        ],
        [
            'table' => 'file_history',
            'column' => 'IdFile',
            'ref_table' => 'expedient',
            'ref_column' => 'Id',
            'name' => 'FK_file_history_IdFile'
        ],
        [
            'table' => 'file_exception',
            'column' => 'IdFile',
            'ref_table' => 'expedient',
            'ref_column' => 'Id',
            'name' => 'FK_file_exception_IdFile'
        ],
        [
            'table' => 'file_release_steps',
            'column' => 'IdFile',
            'ref_table' => 'expedient',
            'ref_column' => 'Id',
            'name' => 'FK_file_release_steps_IdFile'
        ],
        [
            'table' => 'file_pld',
            'column' => 'IdFile',
            'ref_table' => 'expedient',
            'ref_column' => 'Id',
            'name' => 'FK_file_pld_IdFile'
        ],
        [
            'table' => 'expedient',
            'column' => 'IdOrder',
            'ref_table' => 'order',
            'ref_column' => 'Id',
            'name' => 'FK_expedient_IdOrder'
        ],
        [
            'table' => 'expedient',
            'column' => 'IdClient',
            'ref_table' => 'client_header',
            'ref_column' => 'Id',
            'name' => 'FK_expedient_IdClient'
        ],
    ];
    
    foreach ($fkUpdates as $fk) {
        // Verificar si la tabla existe
        $tableExists = $mysqli->query("
            SELECT COUNT(*) as count 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_SCHEMA = DATABASE() 
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
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = '{$fk['table']}' 
            AND COLUMN_NAME = '{$fk['column']}'
        ")->fetch_assoc()['count'];
        
        if ($colExists == 0) {
            echo "   ⏭️  Columna {$fk['table']}.{$fk['column']} no existe, omitiendo FK\n";
            continue;
        }
        
        // Eliminar FK existente si existe
        $fkExists = $mysqli->query("
            SELECT COUNT(*) as count 
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = '{$fk['table']}' 
            AND COLUMN_NAME = '{$fk['column']}'
            AND REFERENCED_TABLE_NAME IS NOT NULL
        ")->fetch_assoc()['count'];
        
        if ($fkExists > 0) {
            // Obtener nombre real de la FK
            $fkNameResult = $mysqli->query("
                SELECT CONSTRAINT_NAME 
                FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
                WHERE TABLE_SCHEMA = DATABASE() 
                AND TABLE_NAME = '{$fk['table']}' 
                AND COLUMN_NAME = '{$fk['column']}'
                AND REFERENCED_TABLE_NAME IS NOT NULL
                LIMIT 1
            ");
            
            if ($fkNameResult && $fkName = $fkNameResult->fetch_assoc()['CONSTRAINT_NAME']) {
                $mysqli->query("ALTER TABLE `{$fk['table']}` DROP FOREIGN KEY `$fkName`");
                echo "   ✅ FK eliminada: $fkName\n";
            }
        }
        
        // Crear nueva FK
        $createFk = "ALTER TABLE `{$fk['table']}` 
                     ADD CONSTRAINT `{$fk['name']}` 
                     FOREIGN KEY (`{$fk['column']}`) 
                     REFERENCES `{$fk['ref_table']}` (`{$fk['ref_column']}) 
                     ON DELETE SET NULL ON UPDATE CASCADE";
        
        if ($mysqli->query($createFk)) {
            echo "   ✅ FK creada: {$fk['name']}\n";
        } else {
            echo "   ⚠️  Error creando FK {$fk['name']}: " . $mysqli->error . "\n";
        }
    }
}
