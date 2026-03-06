<?php
/**
 * Revisar columnas de trazabilidad en todas las tablas
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== REVISIÓN DE COLUMNAS DE TRAZABILIDAD ===\n\n";

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
    
    // Columnas de trazabilidad estándar
    $traceabilityColumns = [
        'RegistrationDate' => false,
        'UpdateDate' => false,
        'IdLastUserUpdate' => false,
        'Enabled' => false
    ];
    
    // Obtener todas las tablas (excluyendo vistas)
    $tablesResult = $mysqli->query("
        SELECT TABLE_NAME 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_SCHEMA = '{$db['database']}' 
        AND TABLE_TYPE = 'BASE TABLE'
        ORDER BY TABLE_NAME
    ");
    $tables = [];
    while ($row = $tablesResult->fetch_assoc()) {
        $tables[] = $row['TABLE_NAME'];
    }
    
    echo "📊 Total de tablas encontradas: " . count($tables) . "\n\n";
    
    $results = [];
    $tablesWithAllColumns = [];
    $tablesWithSomeColumns = [];
    $tablesWithoutColumns = [];
    
    foreach ($tables as $table) {
        // Obtener columnas de la tabla
        $columnsResult = $mysqli->query("DESCRIBE `$table`");
        if (!$columnsResult) {
            echo "⚠️  Error al obtener columnas de $table: " . $mysqli->error . "\n";
            continue;
        }
        
        $columns = [];
        while ($col = $columnsResult->fetch_assoc()) {
            $columns[] = $col['Field'];
        }
        
        // Verificar qué columnas de trazabilidad tiene
        $hasColumns = [];
        foreach ($traceabilityColumns as $colName => $value) {
            $hasColumns[$colName] = in_array($colName, $columns);
        }
        
        $hasAll = true;
        $hasSome = false;
        foreach ($hasColumns as $colName => $has) {
            if (!$has) {
                $hasAll = false;
            } else {
                $hasSome = true;
            }
        }
        
        $results[$table] = [
            'columns' => $hasColumns,
            'hasAll' => $hasAll,
            'hasSome' => $hasSome
        ];
        
        if ($hasAll) {
            $tablesWithAllColumns[] = $table;
        } elseif ($hasSome) {
            $tablesWithSomeColumns[] = $table;
        } else {
            $tablesWithoutColumns[] = $table;
        }
    }
    
    // Mostrar resumen
    echo "📋 RESUMEN:\n";
    echo str_repeat("=", 80) . "\n";
    echo "✅ Tablas con TODAS las columnas de trazabilidad: " . count($tablesWithAllColumns) . "\n";
    echo "⚠️  Tablas con ALGUNAS columnas de trazabilidad: " . count($tablesWithSomeColumns) . "\n";
    echo "❌ Tablas SIN columnas de trazabilidad: " . count($tablesWithoutColumns) . "\n\n";
    
    // Mostrar tablas con todas las columnas
    if (!empty($tablesWithAllColumns)) {
        echo "✅ TABLAS CON TODAS LAS COLUMNAS DE TRAZABILIDAD:\n";
        echo str_repeat("=", 80) . "\n";
        foreach ($tablesWithAllColumns as $table) {
            echo "  - $table\n";
        }
        echo "\n";
    }
    
    // Mostrar tablas con algunas columnas
    if (!empty($tablesWithSomeColumns)) {
        echo "⚠️  TABLAS CON ALGUNAS COLUMNAS DE TRAZABILIDAD:\n";
        echo str_repeat("=", 80) . "\n";
        foreach ($tablesWithSomeColumns as $table) {
            $cols = $results[$table]['columns'];
            $missing = [];
            $present = [];
            foreach ($cols as $colName => $has) {
                if ($has) {
                    $present[] = $colName;
                } else {
                    $missing[] = $colName;
                }
            }
            echo "  - $table\n";
            echo "    Tiene: " . implode(', ', $present) . "\n";
            echo "    Faltan: " . (empty($missing) ? 'Ninguna' : implode(', ', $missing)) . "\n";
        }
        echo "\n";
    }
    
    // Mostrar tablas sin columnas
    if (!empty($tablesWithoutColumns)) {
        echo "❌ TABLAS SIN COLUMNAS DE TRAZABILIDAD:\n";
        echo str_repeat("=", 80) . "\n";
        foreach ($tablesWithoutColumns as $table) {
            echo "  - $table\n";
        }
        echo "\n";
    }
    
    // Generar reporte detallado
    echo "📄 REPORTE DETALLADO POR TABLA:\n";
    echo str_repeat("=", 80) . "\n";
    echo sprintf("%-40s %-15s %-15s %-20s %-10s\n", 
        "Tabla", 
        "RegistrationDate", 
        "UpdateDate", 
        "IdLastUserUpdate", 
        "Enabled"
    );
    echo str_repeat("-", 100) . "\n";
    
    foreach ($results as $table => $info) {
        $cols = $info['columns'];
        echo sprintf("%-40s %-15s %-15s %-20s %-10s\n",
            substr($table, 0, 38),
            $cols['RegistrationDate'] ? '✓' : '✗',
            $cols['UpdateDate'] ? '✓' : '✗',
            $cols['IdLastUserUpdate'] ? '✓' : '✗',
            $cols['Enabled'] ? '✓' : '✗'
        );
    }
    
    echo "\n";
    
    // Generar SQL para agregar columnas faltantes
    echo "🔧 SQL PARA AGREGAR COLUMNAS FALTANTES:\n";
    echo str_repeat("=", 80) . "\n";
    
    $sqlStatements = [];
    
    foreach ($results as $table => $info) {
        if ($info['hasAll']) {
            continue; // Saltar tablas que ya tienen todas las columnas
        }
        
        $cols = $info['columns'];
        $alterStatements = [];
        
        if (!$cols['RegistrationDate']) {
            $alterStatements[] = "ADD COLUMN `RegistrationDate` TIMESTAMP NULL DEFAULT NULL";
        }
        if (!$cols['UpdateDate']) {
            $alterStatements[] = "ADD COLUMN `UpdateDate` TIMESTAMP NULL DEFAULT NULL";
        }
        if (!$cols['IdLastUserUpdate']) {
            $alterStatements[] = "ADD COLUMN `IdLastUserUpdate` BIGINT NULL DEFAULT 0";
        }
        if (!$cols['Enabled']) {
            $alterStatements[] = "ADD COLUMN `Enabled` TINYINT(1) NULL DEFAULT 1";
        }
        
        if (!empty($alterStatements)) {
            $sqlStatements[] = "-- Tabla: $table";
            $sqlStatements[] = "ALTER TABLE `$table`";
            $sqlStatements[] = "  " . implode(",\n  ", $alterStatements) . ";";
            $sqlStatements[] = "";
        }
    }
    
    if (!empty($sqlStatements)) {
        echo implode("\n", $sqlStatements);
    } else {
        echo "✅ Todas las tablas tienen las columnas de trazabilidad necesarias\n";
    }
    
    $mysqli->close();
    
    echo "\n✅ Revisión completada\n";
    
    // Guardar reporte en archivo
    $reportFile = __DIR__ . '/traceability_report_' . date('Y-m-d_His') . '.txt';
    $reportContent = ob_get_contents();
    file_put_contents($reportFile, $reportContent);
    echo "\n📄 Reporte guardado en: $reportFile\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
