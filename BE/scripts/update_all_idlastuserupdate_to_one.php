<?php
/**
 * Actualizar todos los IdLastUserUpdate a 1 en todas las tablas
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== ACTUALIZAR IdLastUserUpdate A 1 ===\n\n";

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
    
    // Verificar que el usuario con ID 1 existe
    echo "🔍 Verificando usuario con ID 1...\n";
    $userCheck = $mysqli->query("SELECT Id, Name FROM user WHERE Id = 1");
    if ($userCheck->num_rows == 0) {
        die("❌ No existe un usuario con ID 1. Por favor, crea un usuario primero.\n");
    }
    $user = $userCheck->fetch_assoc();
    echo "✅ Usuario encontrado: ID 1 - {$user['Name']}\n\n";
    
    // Encontrar todas las tablas con columna IdLastUserUpdate
    echo "🔍 Buscando tablas con columna IdLastUserUpdate...\n";
    echo str_repeat("=", 80) . "\n";
    
    $dbName = $mysqli->real_escape_string($db['database']);
    $tablesQuery = $mysqli->query("
        SELECT TABLE_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = '$dbName'
        AND COLUMN_NAME = 'IdLastUserUpdate'
        ORDER BY TABLE_NAME
    ");
    
    if (!$tablesQuery) {
        die("❌ Error en consulta: " . $mysqli->error . "\n");
    }
    
    $tablesWithColumn = [];
    while ($row = $tablesQuery->fetch_assoc()) {
        $tablesWithColumn[] = $row['TABLE_NAME'];
        echo "  - {$row['TABLE_NAME']}\n";
    }
    
    echo "\n✅ Encontradas " . count($tablesWithColumn) . " tablas con IdLastUserUpdate\n\n";
    
    if (empty($tablesWithColumn)) {
        echo "⚠️  No se encontraron tablas con IdLastUserUpdate\n";
        $mysqli->close();
        exit(0);
    }
    
    // Actualizar IdLastUserUpdate a 1 en todas las tablas
    echo "🔄 Actualizando IdLastUserUpdate a 1...\n";
    echo str_repeat("=", 80) . "\n";
    
    $totalUpdated = 0;
    $totalErrors = 0;
    $targetUserId = 1;
    
    foreach ($tablesWithColumn as $table) {
        // Contar registros que necesitan actualización
        $countQuery = $mysqli->query("
            SELECT COUNT(*) as total 
            FROM `$table` 
            WHERE IdLastUserUpdate IS NULL 
            OR IdLastUserUpdate = 0 
            OR IdLastUserUpdate != $targetUserId
        ");
        $count = $countQuery->fetch_assoc();
        $recordsToUpdate = $count['total'];
        
        if ($recordsToUpdate == 0) {
            echo "⏭️  $table: Todos los registros ya tienen IdLastUserUpdate = $targetUserId\n";
            continue;
        }
        
        // Actualizar IdLastUserUpdate a 1
        $updateQuery = $mysqli->query("
            UPDATE `$table` 
            SET IdLastUserUpdate = $targetUserId, UpdateDate = NOW() 
            WHERE IdLastUserUpdate IS NULL 
            OR IdLastUserUpdate = 0 
            OR IdLastUserUpdate != $targetUserId
        ");
        
        if ($updateQuery) {
            $affectedRows = $mysqli->affected_rows;
            echo "✅ $table: $affectedRows registros actualizados\n";
            $totalUpdated += $affectedRows;
        } else {
            echo "❌ $table: Error - " . $mysqli->error . "\n";
            $totalErrors++;
        }
    }
    
    echo "\n" . str_repeat("=", 80) . "\n";
    echo "📊 RESUMEN:\n";
    echo str_repeat("=", 80) . "\n";
    echo "✅ Total de registros actualizados: $totalUpdated\n";
    echo "❌ Errores: $totalErrors\n";
    echo "📋 Tablas procesadas: " . count($tablesWithColumn) . "\n\n";
    
    // Verificación: Contar registros con IdLastUserUpdate = 1 por tabla
    echo "🔍 VERIFICACIÓN: Registros con IdLastUserUpdate = 1\n";
    echo str_repeat("=", 80) . "\n";
    echo sprintf("%-40s %-15s %-15s\n", "Tabla", "Total", "IdLastUserUpdate=1");
    echo str_repeat("-", 70) . "\n";
    
    $totalRecords = 0;
    $totalWithId1 = 0;
    
    foreach ($tablesWithColumn as $table) {
        $totalQuery = $mysqli->query("SELECT COUNT(*) as total FROM `$table`");
        $total = $totalQuery->fetch_assoc()['total'];
        
        $id1Query = $mysqli->query("
            SELECT COUNT(*) as total 
            FROM `$table` 
            WHERE IdLastUserUpdate = $targetUserId
        ");
        $id1 = $id1Query->fetch_assoc()['total'];
        
        $totalRecords += $total;
        $totalWithId1 += $id1;
        
        echo sprintf("%-40s %-15s %-15s\n",
            substr($table, 0, 38),
            $total,
            $id1
        );
    }
    
    echo str_repeat("-", 70) . "\n";
    echo sprintf("%-40s %-15s %-15s\n",
        "TOTAL",
        $totalRecords,
        $totalWithId1
    );
    
    // Verificar si hay registros con IdLastUserUpdate diferente de 1
    echo "\n🔍 Verificando registros con IdLastUserUpdate != 1 o NULL...\n";
    echo str_repeat("=", 80) . "\n";
    
    $remainingIssues = [];
    foreach ($tablesWithColumn as $table) {
        $issueQuery = $mysqli->query("
            SELECT COUNT(*) as total 
            FROM `$table` 
            WHERE (IdLastUserUpdate IS NULL OR IdLastUserUpdate != $targetUserId)
            AND IdLastUserUpdate != 0
        ");
        $issues = $issueQuery->fetch_assoc()['total'];
        
        if ($issues > 0) {
            $remainingIssues[] = ['table' => $table, 'count' => $issues];
        }
    }
    
    if (empty($remainingIssues)) {
        echo "✅ Todos los registros tienen IdLastUserUpdate = $targetUserId o NULL/0\n";
    } else {
        echo "⚠️  Tablas con registros que aún no tienen IdLastUserUpdate = $targetUserId:\n";
        foreach ($remainingIssues as $issue) {
            echo "   - {$issue['table']}: {$issue['count']} registros\n";
        }
    }
    
    $mysqli->close();
    
    echo "\n✅ Proceso completado\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
