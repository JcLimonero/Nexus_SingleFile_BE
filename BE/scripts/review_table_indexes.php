<?php
/**
 * Script para revisar índices de todas las tablas y recomendar índices faltantes
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "═══════════════════════════════════════════════════════════════════════════════\n";
echo "  REVISIÓN DE ÍNDICES Y RECOMENDACIONES\n";
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
    $fkQuery = "
        SELECT 
            kcu.TABLE_NAME,
            kcu.COLUMN_NAME,
            kcu.REFERENCED_TABLE_NAME
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu
        WHERE kcu.TABLE_SCHEMA = ?
            AND kcu.REFERENCED_TABLE_NAME IS NOT NULL
        ORDER BY kcu.TABLE_NAME, kcu.COLUMN_NAME
    ";
    
    $stmt = $mysqli->prepare($fkQuery);
    $stmt->bind_param('s', $db['database']);
    $stmt->execute();
    $fkResult = $stmt->get_result();
    
    $foreignKeys = [];
    while ($row = $fkResult->fetch_assoc()) {
        $table = $row['TABLE_NAME'];
        if (!isset($foreignKeys[$table])) {
            $foreignKeys[$table] = [];
        }
        $foreignKeys[$table][] = $row['COLUMN_NAME'];
    }
    $stmt->close();
    
    // Obtener todos los índices existentes
    $indexQuery = "
        SELECT 
            TABLE_NAME,
            INDEX_NAME,
            COLUMN_NAME,
            SEQ_IN_INDEX,
            NON_UNIQUE
        FROM INFORMATION_SCHEMA.STATISTICS
        WHERE TABLE_SCHEMA = ?
        ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX
    ";
    
    $stmt = $mysqli->prepare($indexQuery);
    $stmt->bind_param('s', $db['database']);
    $stmt->execute();
    $indexResult = $stmt->get_result();
    
    $indexes = [];
    while ($row = $indexResult->fetch_assoc()) {
        $table = $row['TABLE_NAME'];
        $indexName = $row['INDEX_NAME'];
        
        if (!isset($indexes[$table])) {
            $indexes[$table] = [];
        }
        if (!isset($indexes[$table][$indexName])) {
            $indexes[$table][$indexName] = [
                'columns' => [],
                'unique' => $row['NON_UNIQUE'] == 0
            ];
        }
        $indexes[$table][$indexName]['columns'][] = $row['COLUMN_NAME'];
    }
    $stmt->close();
    
    // Verificar foreign keys sin índice
    $missingFKIndexes = [];
    foreach ($foreignKeys as $table => $columns) {
        foreach ($columns as $column) {
            $hasIndex = false;
            
            if (isset($indexes[$table])) {
                foreach ($indexes[$table] as $indexInfo) {
                    // Verificar si la columna es el primer elemento del índice
                    if (!empty($indexInfo['columns']) && $indexInfo['columns'][0] === $column) {
                        $hasIndex = true;
                        break;
                    }
                }
            }
            
            if (!$hasIndex) {
                if (!isset($missingFKIndexes[$table])) {
                    $missingFKIndexes[$table] = [];
                }
                $missingFKIndexes[$table][] = $column;
            }
        }
    }
    
    // Recomendaciones específicas basadas en análisis del código
    $recommendations = [
        'HIGH' => [],
        'MEDIUM' => [],
        'LOW' => []
    ];
    
    // Función helper para verificar si existe un índice
    $indexExists = function($table, $columns) use ($indexes) {
        if (!isset($indexes[$table])) {
            return false;
        }
        foreach ($indexes[$table] as $indexInfo) {
            if ($indexInfo['columns'] === $columns) {
                return true;
            }
        }
        return false;
    };
    
    // ALTA PRIORIDAD: Índices compuestos para expedient
    if (!$indexExists('expedient', ['IdAgency', 'IdCurrentState', 'RegistrationDate'])) {
        $recommendations['HIGH'][] = [
            'table' => 'expedient',
            'columns' => ['IdAgency', 'IdCurrentState', 'RegistrationDate'],
            'type' => 'DESC',
            'reason' => 'Query más común: búsquedas por agencia + estado + fecha'
        ];
    }
    
    if (!$indexExists('expedient', ['IdClient', 'IdAgency', 'IdCurrentState'])) {
        $recommendations['HIGH'][] = [
            'table' => 'expedient',
            'columns' => ['IdClient', 'IdAgency', 'IdCurrentState'],
            'reason' => 'Búsquedas por cliente + agencia + estado'
        ];
    }
    
    if (!$indexExists('expedient', ['IdClient', 'IdProcess'])) {
        $recommendations['HIGH'][] = [
            'table' => 'expedient',
            'columns' => ['IdClient', 'IdProcess'],
            'reason' => 'Búsquedas por cliente + proceso'
        ];
    }
    
    if (!$indexExists('expedient', ['IdOrderTotal'])) {
        $recommendations['HIGH'][] = [
            'table' => 'expedient',
            'columns' => ['IdOrderTotal'],
            'reason' => 'JOINs frecuentes con tabla order'
        ];
    }
    
    if (!$indexExists('expedient', ['RegistrationDate', 'IdCurrentState'])) {
        $recommendations['HIGH'][] = [
            'table' => 'expedient',
            'columns' => ['RegistrationDate', 'IdCurrentState'],
            'type' => 'DESC',
            'reason' => 'Analytics y reportes por fecha + estado'
        ];
    }
    
    // ALTA PRIORIDAD: Índices compuestos para file_document
    if (!$indexExists('file_document', ['IdFile', 'IdCurrentStatus'])) {
        $recommendations['HIGH'][] = [
            'table' => 'file_document',
            'columns' => ['IdFile', 'IdCurrentStatus'],
            'reason' => 'Búsquedas por expediente + estado del documento'
        ];
    }
    
    if (!$indexExists('file_document', ['IdFile', 'IdDocumentType'])) {
        $recommendations['HIGH'][] = [
            'table' => 'file_document',
            'columns' => ['IdFile', 'IdDocumentType'],
            'reason' => 'Búsquedas por expediente + tipo de documento'
        ];
    }
    
    if (!$indexExists('file_document', ['IdDocumentType', 'IdCurrentStatus'])) {
        $recommendations['HIGH'][] = [
            'table' => 'file_document',
            'columns' => ['IdDocumentType', 'IdCurrentStatus'],
            'reason' => 'Búsquedas por tipo + estado'
        ];
    }
    
    // ALTA PRIORIDAD: Índices para client_dms_relation
    if (!$indexExists('client_dms_relation', ['IdDMS', 'IdAgency'])) {
        $recommendations['HIGH'][] = [
            'table' => 'client_dms_relation',
            'columns' => ['IdDMS', 'IdAgency'],
            'unique' => true,
            'reason' => 'Índice único para prevenir duplicados y búsquedas frecuentes'
        ];
    }
    
    if (!$indexExists('client_dms_relation', ['idClientHeader', 'IdAgency'])) {
        $recommendations['HIGH'][] = [
            'table' => 'client_dms_relation',
            'columns' => ['idClientHeader', 'IdAgency'],
            'reason' => 'Búsquedas por ClientHeader + Agency'
        ];
    }
    
    if (!$indexExists('client_dms_relation', ['IdDMS'])) {
        $recommendations['HIGH'][] = [
            'table' => 'client_dms_relation',
            'columns' => ['IdDMS'],
            'reason' => 'Búsquedas frecuentes por IdDMS'
        ];
    }
    
    // ALTA PRIORIDAD: Índices para order
    if (!$indexExists('order', ['IdDMS', 'idagency', 'RegistrationDate'])) {
        $recommendations['HIGH'][] = [
            'table' => 'order',
            'columns' => ['IdDMS', 'idagency', 'RegistrationDate'],
            'type' => 'DESC',
            'reason' => 'Búsquedas por IdDMS + agencia + fecha'
        ];
    }
    
    // MEDIA PRIORIDAD: Índices adicionales para expedient
    if (!$indexExists('expedient', ['RegistrationDate'])) {
        $recommendations['MEDIUM'][] = [
            'table' => 'expedient',
            'columns' => ['RegistrationDate'],
            'type' => 'DESC',
            'reason' => 'Analytics con filtros de fecha'
        ];
    }
    
    if (!$indexExists('expedient', ['CloseDate'])) {
        $recommendations['MEDIUM'][] = [
            'table' => 'expedient',
            'columns' => ['CloseDate'],
            'reason' => 'Búsquedas por fecha de cierre'
        ];
    }
    
    if (!$indexExists('expedient', ['RegistrationDate', 'CloseDate'])) {
        $recommendations['MEDIUM'][] = [
            'table' => 'expedient',
            'columns' => ['RegistrationDate', 'CloseDate'],
            'reason' => 'Analytics con ambas fechas'
        ];
    }
    
    // MEDIA PRIORIDAD: Índices para file_document
    if (!$indexExists('file_document', ['ExpirationDate'])) {
        $recommendations['MEDIUM'][] = [
            'table' => 'file_document',
            'columns' => ['ExpirationDate'],
            'reason' => 'Búsquedas por fecha de expiración'
        ];
    }
    
    if (!$indexExists('file_document', ['Enabled'])) {
        $recommendations['MEDIUM'][] = [
            'table' => 'file_document',
            'columns' => ['Enabled'],
            'reason' => 'Filtros por documentos activos'
        ];
    }
    
    // Mostrar resumen
    echo "═══════════════════════════════════════════════════════════════════════════════\n";
    echo "RESUMEN\n";
    echo "═══════════════════════════════════════════════════════════════════════════════\n";
    echo "Total de tablas con índices: " . count($indexes) . "\n";
    echo "Foreign keys sin índice: " . array_sum(array_map('count', $missingFKIndexes)) . "\n";
    echo "Recomendaciones de alta prioridad: " . count($recommendations['HIGH']) . "\n";
    echo "Recomendaciones de media prioridad: " . count($recommendations['MEDIUM']) . "\n";
    echo "\n";
    
    // Mostrar foreign keys sin índice
    if (count($missingFKIndexes) > 0) {
        echo "═══════════════════════════════════════════════════════════════════════════════\n";
        echo "⚠️  FOREIGN KEYS SIN ÍNDICE (ALTA PRIORIDAD)\n";
        echo "═══════════════════════════════════════════════════════════════════════════════\n";
        foreach ($missingFKIndexes as $table => $columns) {
            echo "\n📋 Tabla: $table\n";
            echo str_repeat("-", 80) . "\n";
            foreach ($columns as $col) {
                echo "   ❌ Columna: $col\n";
            }
        }
        echo "\n";
    }
    
    // Generar script SQL
    $sqlScript = "-- ============================================================================\n";
    $sqlScript .= "-- SCRIPT DE CREACIÓN DE ÍNDICES RECOMENDADOS\n";
    $sqlScript .= "-- Generado automáticamente: " . date('Y-m-d H:i:s') . "\n";
    $sqlScript .= "-- ============================================================================\n\n";
    
    // Foreign keys sin índice
    if (count($missingFKIndexes) > 0) {
        $sqlScript .= "-- Foreign Keys sin índice (ALTA PRIORIDAD)\n";
        $sqlScript .= "-- ============================================================================\n\n";
        foreach ($missingFKIndexes as $table => $columns) {
            foreach ($columns as $col) {
                $idxName = "idx_{$table}_{$col}";
                $sqlScript .= "CREATE INDEX `$idxName` ON `$table` (`$col`);\n";
            }
        }
        $sqlScript .= "\n";
    }
    
    // Recomendaciones de alta prioridad
    if (count($recommendations['HIGH']) > 0) {
        $sqlScript .= "-- Índices de alta prioridad\n";
        $sqlScript .= "-- ============================================================================\n\n";
        foreach ($recommendations['HIGH'] as $rec) {
            $cols = implode('`, `', $rec['columns']);
            $idxName = "idx_" . $rec['table'] . "_" . implode("_", $rec['columns']);
            $desc = isset($rec['type']) && $rec['type'] === 'DESC' ? ' DESC' : '';
            $unique = isset($rec['unique']) && $rec['unique'] ? 'UNIQUE ' : '';
            
            $sqlScript .= "-- {$rec['reason']}\n";
            $sqlScript .= "CREATE {$unique}INDEX `$idxName` ON `{$rec['table']}` (`{$cols}`{$desc});\n\n";
        }
    }
    
    // Recomendaciones de media prioridad
    if (count($recommendations['MEDIUM']) > 0) {
        $sqlScript .= "-- Índices de prioridad media\n";
        $sqlScript .= "-- ============================================================================\n\n";
        foreach ($recommendations['MEDIUM'] as $rec) {
            $cols = implode('`, `', $rec['columns']);
            $idxName = "idx_" . $rec['table'] . "_" . implode("_", $rec['columns']);
            $desc = isset($rec['type']) && $rec['type'] === 'DESC' ? ' DESC' : '';
            
            $sqlScript .= "-- {$rec['reason']}\n";
            $sqlScript .= "CREATE INDEX `$idxName` ON `{$rec['table']}` (`{$cols}`{$desc});\n\n";
        }
    }
    
    // Guardar script SQL
    $sqlFile = __DIR__ . '/create_recommended_indexes.sql';
    file_put_contents($sqlFile, $sqlScript);
    
    // Mostrar recomendaciones
    if (count($recommendations['HIGH']) > 0 || count($recommendations['MEDIUM']) > 0) {
        echo "═══════════════════════════════════════════════════════════════════════════════\n";
        echo "RECOMENDACIONES DE ÍNDICES\n";
        echo "═══════════════════════════════════════════════════════════════════════════════\n";
        
        if (count($recommendations['HIGH']) > 0) {
            echo "\n🔴 ALTA PRIORIDAD (" . count($recommendations['HIGH']) . "):\n";
            echo str_repeat("=", 80) . "\n";
            foreach ($recommendations['HIGH'] as $rec) {
                echo "\n📋 Tabla: {$rec['table']}\n";
                echo "   Razón: {$rec['reason']}\n";
                $cols = implode(', ', $rec['columns']);
                echo "   Columnas: $cols\n";
            }
        }
        
        if (count($recommendations['MEDIUM']) > 0) {
            echo "\n🟡 PRIORIDAD MEDIA (" . count($recommendations['MEDIUM']) . "):\n";
            echo str_repeat("=", 80) . "\n";
            foreach ($recommendations['MEDIUM'] as $rec) {
                echo "\n📋 Tabla: {$rec['table']}\n";
                echo "   Razón: {$rec['reason']}\n";
                $cols = implode(', ', $rec['columns']);
                echo "   Columnas: $cols\n";
            }
        }
    }
    
    echo "\n";
    echo "═══════════════════════════════════════════════════════════════════════════════\n";
    echo "✅ Script SQL generado: create_recommended_indexes.sql\n";
    echo "═══════════════════════════════════════════════════════════════════════════════\n";
    
    $mysqli->close();
    
} catch (Exception $e) {
    echo "\n❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
    exit(1);
}
