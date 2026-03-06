<?php
/**
 * Script para renombrar foreign keys que aún tienen nombres antiguos
 * después de la migración de nombres de tablas
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "═══════════════════════════════════════════════════════════════════════════════\n";
echo "  RENOMBRAR FOREIGN KEYS PARA CONSISTENCIA\n";
echo "═══════════════════════════════════════════════════════════════════════════════\n\n";

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

try {
    $mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);
    
    if ($mysqli->connect_error) {
        die("❌ Error de conexión: " . $mysqli->connect_error . "\n");
    }
    
    echo "✅ Conectado a la base de datos: {$db['database']}\n\n";
    
    // Mapeo de foreign keys a renombrar: [tabla] => [nombre_antiguo => nombre_nuevo]
    $fkRenames = [
        'client_dms_relation' => [
            'FK_client_total_relation_IdLastUserUpdate' => 'FK_client_dms_relation_IdLastUserUpdate'
        ],
        'order' => [
            'FK_order_by_car_IdLastUserUpdate' => 'FK_order_IdLastUserUpdate'
        ],
        'file_document' => [
            'FK_document_by_file_IdLastUserUpdate' => 'FK_file_document_IdLastUserUpdate'
        ],
        'file_exception_reason' => [
            'FK_file_extraordinary_reasons_IdLastUserUpdate' => 'FK_file_exception_reason_IdLastUserUpdate'
        ],
        'client_header' => [
            'FK_header_client_IdLastUserUpdate' => 'FK_client_header_IdLastUserUpdate'
        ],
        'expedient' => [
            'FK_file_IdLastUserUpdate' => 'FK_expedient_IdLastUserUpdate'
        ]
    ];
    
    $mysqli->begin_transaction();
    $mysqli->query("SET FOREIGN_KEY_CHECKS = 0");
    
    $renamed = 0;
    $skipped = 0;
    
    foreach ($fkRenames as $table => $renames) {
        echo "📋 Tabla: $table\n";
        echo str_repeat("-", 80) . "\n";
        
        foreach ($renames as $oldName => $newName) {
            // Verificar si la FK existe
            $fkExists = $mysqli->query("
                SELECT COUNT(*) as count 
                FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
                WHERE TABLE_SCHEMA = '{$db['database']}' 
                AND TABLE_NAME = '$table' 
                AND CONSTRAINT_NAME = '$oldName'
            ")->fetch_assoc()['count'];
            
            if ($fkExists == 0) {
                echo "   ⏭️  FK '$oldName' no existe, omitiendo\n";
                $skipped++;
                continue;
            }
            
            // Verificar si el nuevo nombre ya existe
            $newExists = $mysqli->query("
                SELECT COUNT(*) as count 
                FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
                WHERE TABLE_SCHEMA = '{$db['database']}' 
                AND TABLE_NAME = '$table' 
                AND CONSTRAINT_NAME = '$newName'
            ")->fetch_assoc()['count'];
            
            if ($newExists > 0) {
                echo "   ⏭️  FK '$newName' ya existe, omitiendo renombrado\n";
                $skipped++;
                continue;
            }
            
            // Obtener información de la FK para recrearla
            $fkInfo = $mysqli->query("
                SELECT 
                    kcu.COLUMN_NAME,
                    kcu.REFERENCED_TABLE_NAME,
                    kcu.REFERENCED_COLUMN_NAME,
                    rc.UPDATE_RULE,
                    rc.DELETE_RULE
                FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu
                INNER JOIN INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS rc
                    ON kcu.CONSTRAINT_SCHEMA = rc.CONSTRAINT_SCHEMA
                    AND kcu.CONSTRAINT_NAME = rc.CONSTRAINT_NAME
                WHERE kcu.TABLE_SCHEMA = '{$db['database']}' 
                    AND kcu.TABLE_NAME = '$table' 
                    AND kcu.CONSTRAINT_NAME = '$oldName'
                LIMIT 1
            ")->fetch_assoc();
            
            if (!$fkInfo) {
                echo "   ⚠️  No se pudo obtener información de '$oldName'\n";
                $skipped++;
                continue;
            }
            
            // Eliminar FK antigua
            $dropSql = "ALTER TABLE `$table` DROP FOREIGN KEY `$oldName`";
            if (!$mysqli->query($dropSql)) {
                echo "   ❌ Error eliminando FK '$oldName': " . $mysqli->error . "\n";
                $skipped++;
                continue;
            }
            
            // Crear FK con nuevo nombre
            $createSql = "ALTER TABLE `$table` 
                         ADD CONSTRAINT `$newName` 
                         FOREIGN KEY (`{$fkInfo['COLUMN_NAME']}`) 
                         REFERENCES `{$fkInfo['REFERENCED_TABLE_NAME']}` (`{$fkInfo['REFERENCED_COLUMN_NAME']}`) 
                         ON DELETE {$fkInfo['DELETE_RULE']} 
                         ON UPDATE {$fkInfo['UPDATE_RULE']}";
            
            if ($mysqli->query($createSql)) {
                echo "   ✅ Renombrada: '$oldName' → '$newName'\n";
                $renamed++;
            } else {
                echo "   ❌ Error creando FK '$newName': " . $mysqli->error . "\n";
                // Intentar restaurar la FK antigua
                $mysqli->query("ALTER TABLE `$table` 
                               ADD CONSTRAINT `$oldName` 
                               FOREIGN KEY (`{$fkInfo['COLUMN_NAME']}`) 
                               REFERENCES `{$fkInfo['REFERENCED_TABLE_NAME']}` (`{$fkInfo['REFERENCED_COLUMN_NAME']}`) 
                               ON DELETE {$fkInfo['DELETE_RULE']} 
                               ON UPDATE {$fkInfo['UPDATE_RULE']}");
                $skipped++;
            }
        }
        echo "\n";
    }
    
    $mysqli->query("SET FOREIGN_KEY_CHECKS = 1");
    $mysqli->commit();
    
    echo "═══════════════════════════════════════════════════════════════════════════════\n";
    echo "RESUMEN\n";
    echo "═══════════════════════════════════════════════════════════════════════════════\n";
    echo "Foreign Keys renombradas: $renamed\n";
    echo "Foreign Keys omitidas: $skipped\n";
    echo "\n";
    echo "✅ Proceso completado\n";
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
