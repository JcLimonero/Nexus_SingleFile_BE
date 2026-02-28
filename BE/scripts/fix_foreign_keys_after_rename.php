<?php
/**
 * Corregir foreign keys después de renombrar tablas
 * Ajusta las columnas para permitir NULL donde sea necesario para las FKs
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "═══════════════════════════════════════════════════════════════════════════════\n";
echo "  CORREGIR FOREIGN KEYS DESPUÉS DE RENOMBRAR TABLAS\n";
echo "═══════════════════════════════════════════════════════════════════════════════\n\n";

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

try {
    $mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);
    
    if ($mysqli->connect_error) {
        die("❌ Error de conexión: " . $mysqli->connect_error . "\n");
    }
    
    echo "✅ Conectado a la base de datos\n\n";
    
    $mysqli->begin_transaction();
    $mysqli->query("SET FOREIGN_KEY_CHECKS = 0");
    
    // Ajustar columnas para permitir NULL donde sea necesario
    echo "📋 Ajustando columnas para foreign keys...\n";
    echo str_repeat("-", 80) . "\n";
    
    // file_document.IdFile - permitir NULL
    echo "   → Ajustando file_document.IdFile...\n";
    $colInfo = $mysqli->query("
        SELECT IS_NULLABLE 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = '{$db['database']}' 
        AND TABLE_NAME = 'file_document' 
        AND COLUMN_NAME = 'IdFile'
    ")->fetch_assoc();
    
    if ($colInfo && $colInfo['IS_NULLABLE'] === 'NO') {
        $mysqli->query("ALTER TABLE `file_document` MODIFY COLUMN `IdFile` BIGINT NULL DEFAULT 0");
        echo "   ✅ Columna ajustada para permitir NULL\n";
    } else {
        echo "   ⏭️  Columna ya permite NULL\n";
    }
    
    // file_pld.IdFile - permitir NULL
    echo "   → Ajustando file_pld.IdFile...\n";
    $colInfo = $mysqli->query("
        SELECT IS_NULLABLE 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = '{$db['database']}' 
        AND TABLE_NAME = 'file_pld' 
        AND COLUMN_NAME = 'IdFile'
    ")->fetch_assoc();
    
    if ($colInfo && $colInfo['IS_NULLABLE'] === 'NO') {
        $mysqli->query("ALTER TABLE `file_pld` MODIFY COLUMN `IdFile` BIGINT NULL");
        echo "   ✅ Columna ajustada para permitir NULL\n";
    } else {
        echo "   ⏭️  Columna ya permite NULL\n";
    }
    
    // expedient.IdClient - permitir NULL
    echo "   → Ajustando expedient.IdClient...\n";
    $colInfo = $mysqli->query("
        SELECT IS_NULLABLE 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = '{$db['database']}' 
        AND TABLE_NAME = 'expedient' 
        AND COLUMN_NAME = 'IdClient'
    ")->fetch_assoc();
    
    if ($colInfo && $colInfo['IS_NULLABLE'] === 'NO') {
        $mysqli->query("ALTER TABLE `expedient` MODIFY COLUMN `IdClient` BIGINT NULL");
        echo "   ✅ Columna ajustada para permitir NULL\n";
    } else {
        echo "   ⏭️  Columna ya permite NULL\n";
    }
    
    echo "\n";
    
    // Crear foreign keys
    echo "📋 Creando foreign keys...\n";
    echo str_repeat("-", 80) . "\n";
    
    $fks = [
        [
            'table' => 'file_document',
            'column' => 'IdFile',
            'ref_table' => 'expedient',
            'ref_column' => 'Id',
            'name' => 'FK_file_document_IdFile'
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
            'column' => 'IdClient',
            'ref_table' => 'client_header',
            'ref_column' => 'Id',
            'name' => 'FK_expedient_IdClient'
        ],
    ];
    
    foreach ($fks as $fk) {
        // Verificar si FK ya existe
        $fkExists = $mysqli->query("
            SELECT COUNT(*) as count 
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
            WHERE TABLE_SCHEMA = '{$db['database']}' 
            AND TABLE_NAME = '{$fk['table']}' 
            AND COLUMN_NAME = '{$fk['column']}'
            AND REFERENCED_TABLE_NAME = '{$fk['ref_table']}'
        ")->fetch_assoc()['count'];
        
        if ($fkExists > 0) {
            echo "   ⏭️  FK {$fk['name']} ya existe\n";
            continue;
        }
        
        // Crear FK
        $sql = "ALTER TABLE `{$fk['table']}` 
                ADD CONSTRAINT `{$fk['name']}` 
                FOREIGN KEY (`{$fk['column']}`) 
                REFERENCES `{$fk['ref_table']}` (`{$fk['ref_column']}`) 
                ON DELETE SET NULL ON UPDATE CASCADE";
        
        if ($mysqli->query($sql)) {
            echo "   ✅ FK creada: {$fk['name']}\n";
        } else {
            echo "   ⚠️  Error creando FK {$fk['name']}: " . $mysqli->error . "\n";
        }
    }
    
    $mysqli->query("SET FOREIGN_KEY_CHECKS = 1");
    $mysqli->commit();
    
    echo "\n";
    echo "═══════════════════════════════════════════════════════════════════════════════\n";
    echo "✅ Foreign keys corregidas\n";
    echo "═══════════════════════════════════════════════════════════════════════════════\n";
    
    $mysqli->close();
    
} catch (Exception $e) {
    if (isset($mysqli)) {
        $mysqli->rollback();
        $mysqli->query("SET FOREIGN_KEY_CHECKS = 1");
    }
    echo "\n❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
