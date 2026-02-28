<?php
/**
 * Script para revisar todas las foreign keys en la base de datos
 * Verifica que todas las referencias sean correctas después de la migración
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "═══════════════════════════════════════════════════════════════════════════════\n";
echo "  REVISIÓN COMPLETA DE FOREIGN KEYS\n";
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
    
    // Obtener todas las foreign keys
    $query = "
        SELECT 
            kcu.TABLE_SCHEMA,
            kcu.TABLE_NAME,
            kcu.COLUMN_NAME,
            kcu.CONSTRAINT_NAME,
            kcu.REFERENCED_TABLE_SCHEMA,
            kcu.REFERENCED_TABLE_NAME,
            kcu.REFERENCED_COLUMN_NAME,
            rc.UPDATE_RULE,
            rc.DELETE_RULE
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu
        INNER JOIN INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS rc
            ON kcu.CONSTRAINT_SCHEMA = rc.CONSTRAINT_SCHEMA
            AND kcu.CONSTRAINT_NAME = rc.CONSTRAINT_NAME
        WHERE kcu.TABLE_SCHEMA = ?
            AND kcu.REFERENCED_TABLE_NAME IS NOT NULL
        ORDER BY kcu.TABLE_NAME, kcu.CONSTRAINT_NAME, kcu.ORDINAL_POSITION
    ";
    
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param('s', $db['database']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $foreignKeys = [];
    $issues = [];
    $tableStats = [];
    
    while ($row = $result->fetch_assoc()) {
        $fk = [
            'table' => $row['TABLE_NAME'],
            'column' => $row['COLUMN_NAME'],
            'constraint' => $row['CONSTRAINT_NAME'],
            'ref_table' => $row['REFERENCED_TABLE_NAME'],
            'ref_column' => $row['REFERENCED_COLUMN_NAME'],
            'update_rule' => $row['UPDATE_RULE'],
            'delete_rule' => $row['DELETE_RULE']
        ];
        
        $foreignKeys[] = $fk;
        
        // Estadísticas por tabla
        if (!isset($tableStats[$fk['table']])) {
            $tableStats[$fk['table']] = 0;
        }
        $tableStats[$fk['table']]++;
        
        // Verificar que la tabla referenciada existe
        $refTableExists = $mysqli->query("
            SELECT COUNT(*) as count 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_SCHEMA = '{$db['database']}' 
            AND TABLE_NAME = '{$fk['ref_table']}'
        ")->fetch_assoc()['count'];
        
        if ($refTableExists == 0) {
            $issues[] = [
                'type' => 'ERROR',
                'message' => "Tabla referenciada '{$fk['ref_table']}' no existe",
                'fk' => $fk
            ];
        }
        
        // Verificar que la columna referenciada existe
        if ($refTableExists > 0) {
            $refColExists = $mysqli->query("
                SELECT COUNT(*) as count 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_SCHEMA = '{$db['database']}' 
                AND TABLE_NAME = '{$fk['ref_table']}' 
                AND COLUMN_NAME = '{$fk['ref_column']}'
            ")->fetch_assoc()['count'];
            
            if ($refColExists == 0) {
                $issues[] = [
                    'type' => 'ERROR',
                    'message' => "Columna referenciada '{$fk['ref_table']}.{$fk['ref_column']}' no existe",
                    'fk' => $fk
                ];
            }
        }
        
        // Verificar que la columna local existe
        $localColExists = $mysqli->query("
            SELECT COUNT(*) as count 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = '{$db['database']}' 
            AND TABLE_NAME = '{$fk['table']}' 
            AND COLUMN_NAME = '{$fk['column']}'
        ")->fetch_assoc()['count'];
        
        if ($localColExists == 0) {
            $issues[] = [
                'type' => 'ERROR',
                'message' => "Columna local '{$fk['table']}.{$fk['column']}' no existe",
                'fk' => $fk
            ];
        }
        
        // Verificar tipos de datos compatibles
        if ($localColExists > 0 && $refTableExists > 0) {
            $localColInfo = $mysqli->query("
                SELECT DATA_TYPE, COLUMN_TYPE, IS_NULLABLE
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_SCHEMA = '{$db['database']}' 
                AND TABLE_NAME = '{$fk['table']}' 
                AND COLUMN_NAME = '{$fk['column']}'
            ")->fetch_assoc();
            
            $refColInfo = $mysqli->query("
                SELECT DATA_TYPE, COLUMN_TYPE, IS_NULLABLE
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_SCHEMA = '{$db['database']}' 
                AND TABLE_NAME = '{$fk['ref_table']}' 
                AND COLUMN_NAME = '{$fk['ref_column']}'
            ")->fetch_assoc();
            
            if ($localColInfo && $refColInfo) {
                // Verificar compatibilidad de tipos
                if ($localColInfo['DATA_TYPE'] !== $refColInfo['DATA_TYPE']) {
                    $issues[] = [
                        'type' => 'WARNING',
                        'message' => "Tipos de datos incompatibles: {$fk['table']}.{$fk['column']} ({$localColInfo['DATA_TYPE']}) vs {$fk['ref_table']}.{$fk['ref_column']} ({$refColInfo['DATA_TYPE']})",
                        'fk' => $fk
                    ];
                }
                
                // Verificar NULL - si la FK tiene DELETE SET NULL, la columna debe permitir NULL
                if ($fk['delete_rule'] === 'SET NULL' && $localColInfo['IS_NULLABLE'] === 'NO') {
                    $issues[] = [
                        'type' => 'WARNING',
                        'message' => "FK con DELETE SET NULL pero columna '{$fk['table']}.{$fk['column']}' no permite NULL",
                        'fk' => $fk
                    ];
                }
            }
        }
    }
    
    $stmt->close();
    
    // Mostrar resumen
    echo "═══════════════════════════════════════════════════════════════════════════════\n";
    echo "RESUMEN\n";
    echo "═══════════════════════════════════════════════════════════════════════════════\n";
    echo "Total de Foreign Keys encontradas: " . count($foreignKeys) . "\n";
    echo "Tablas con Foreign Keys: " . count($tableStats) . "\n";
    echo "Problemas encontrados: " . count($issues) . "\n";
    echo "\n";
    
    // Mostrar estadísticas por tabla
    echo "═══════════════════════════════════════════════════════════════════════════════\n";
    echo "ESTADÍSTICAS POR TABLA\n";
    echo "═══════════════════════════════════════════════════════════════════════════════\n";
    arsort($tableStats);
    foreach ($tableStats as $table => $count) {
        echo sprintf("  %-40s %3d FK(s)\n", $table, $count);
    }
    echo "\n";
    
    // Mostrar todas las foreign keys agrupadas por tabla
    echo "═══════════════════════════════════════════════════════════════════════════════\n";
    echo "FOREIGN KEYS DETALLADAS\n";
    echo "═══════════════════════════════════════════════════════════════════════════════\n";
    
    $currentTable = '';
    foreach ($foreignKeys as $fk) {
        if ($currentTable !== $fk['table']) {
            if ($currentTable !== '') {
                echo "\n";
            }
            $currentTable = $fk['table'];
            echo "\n📋 Tabla: {$fk['table']}\n";
            echo str_repeat("-", 80) . "\n";
        }
        
        echo sprintf(
            "  FK: %-35s | Columna: %-25s → %s.%s (%s/%s)\n",
            $fk['constraint'],
            $fk['column'],
            $fk['ref_table'],
            $fk['ref_column'],
            $fk['update_rule'],
            $fk['delete_rule']
        );
    }
    echo "\n";
    
    // Mostrar problemas encontrados
    if (count($issues) > 0) {
        echo "═══════════════════════════════════════════════════════════════════════════════\n";
        echo "PROBLEMAS ENCONTRADOS\n";
        echo "═══════════════════════════════════════════════════════════════════════════════\n";
        
        $errors = array_filter($issues, function($i) { return $i['type'] === 'ERROR'; });
        $warnings = array_filter($issues, function($i) { return $i['type'] === 'WARNING'; });
        
        if (count($errors) > 0) {
            echo "\n❌ ERRORES (" . count($errors) . "):\n";
            echo str_repeat("-", 80) . "\n";
            foreach ($errors as $issue) {
                echo "  ❌ {$issue['message']}\n";
                echo "     Tabla: {$issue['fk']['table']}\n";
                echo "     Columna: {$issue['fk']['column']}\n";
                echo "     FK: {$issue['fk']['constraint']}\n";
                echo "     Referencia: {$issue['fk']['ref_table']}.{$issue['fk']['ref_column']}\n";
                echo "\n";
            }
        }
        
        if (count($warnings) > 0) {
            echo "\n⚠️  ADVERTENCIAS (" . count($warnings) . "):\n";
            echo str_repeat("-", 80) . "\n";
            foreach ($warnings as $issue) {
                echo "  ⚠️  {$issue['message']}\n";
                echo "     Tabla: {$issue['fk']['table']}\n";
                echo "     Columna: {$issue['fk']['column']}\n";
                echo "     FK: {$issue['fk']['constraint']}\n";
                echo "     Referencia: {$issue['fk']['ref_table']}.{$issue['fk']['ref_column']}\n";
                echo "\n";
            }
        }
    } else {
        echo "═══════════════════════════════════════════════════════════════════════════════\n";
        echo "✅ NO SE ENCONTRARON PROBLEMAS\n";
        echo "═══════════════════════════════════════════════════════════════════════════════\n";
    }
    
    // Verificar foreign keys que deberían existir después de la migración
    echo "\n";
    echo "═══════════════════════════════════════════════════════════════════════════════\n";
    echo "VERIFICACIÓN DE FOREIGN KEYS ESPERADAS POST-MIGRACIÓN\n";
    echo "═══════════════════════════════════════════════════════════════════════════════\n";
    
    $expectedFKs = [
        ['table' => 'file_document', 'column' => 'IdFile', 'ref_table' => 'expedient', 'ref_column' => 'Id'],
        ['table' => 'file_pld', 'column' => 'IdFile', 'ref_table' => 'expedient', 'ref_column' => 'Id'],
        ['table' => 'expedient', 'column' => 'IdOrder', 'ref_table' => 'order', 'ref_column' => 'Id'],
        ['table' => 'expedient', 'column' => 'IdClient', 'ref_table' => 'client_header', 'ref_column' => 'Id'],
        ['table' => 'expedient', 'column' => 'IdCustomerType', 'ref_table' => 'customer_type', 'ref_column' => 'Id'],
        ['table' => 'file_document', 'column' => 'IdDocumentType', 'ref_table' => 'document_type', 'ref_column' => 'Id'],
        ['table' => 'file_document', 'column' => 'IdLastUserUpdate', 'ref_table' => 'user', 'ref_column' => 'Id'],
    ];
    
    foreach ($expectedFKs as $expected) {
        $exists = false;
        foreach ($foreignKeys as $fk) {
            if ($fk['table'] === $expected['table'] && 
                $fk['column'] === $expected['column'] &&
                $fk['ref_table'] === $expected['ref_table'] &&
                $fk['ref_column'] === $expected['ref_column']) {
                $exists = true;
                break;
            }
        }
        
        $status = $exists ? '✅' : '❌';
        echo sprintf(
            "%s %s.%s → %s.%s\n",
            $status,
            $expected['table'],
            $expected['column'],
            $expected['ref_table'],
            $expected['ref_column']
        );
    }
    
    echo "\n";
    echo "═══════════════════════════════════════════════════════════════════════════════\n";
    echo "✅ Revisión completada\n";
    echo "═══════════════════════════════════════════════════════════════════════════════\n";
    
    $mysqli->close();
    
} catch (Exception $e) {
    echo "\n❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
    exit(1);
}
