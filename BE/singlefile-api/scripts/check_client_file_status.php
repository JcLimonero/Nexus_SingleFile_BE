<?php
// Script para verificar la estructura real de Client y File_Status
// y entender cómo hacer el join correcto

$host = 'localhost';
$dbname = 'singlefile_db';
$username = 'root';
$password = '00@Limonero';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "✅ Conexión a la base de datos exitosa\n\n";

    // 1. Verificar estructura de Client
    echo "🔍 ESTRUCTURA DE LA TABLA CLIENT:\n";
    echo "==================================\n";
    
    $stmt = $pdo->query("DESCRIBE Client");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($columns as $column) {
        echo "  - {$column['Field']}: {$column['Type']} ({$column['Null']})\n";
    }
    
    // Mostrar algunos datos de ejemplo
    $stmt = $pdo->query("SELECT * FROM Client LIMIT 3");
    $sampleData = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (!empty($sampleData)) {
        echo "\n  Datos de ejemplo:\n";
        foreach ($sampleData as $row) {
            echo "    " . json_encode($row, JSON_UNESCAPED_UNICODE) . "\n";
        }
    }
    
    echo "\n";

    // 2. Verificar estructura de File_Status
    echo "🔍 ESTRUCTURA DE LA TABLA FILE_STATUS:\n";
    echo "======================================\n";
    
    $stmt = $pdo->query("DESCRIBE File_Status");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($columns as $column) {
        echo "  - {$column['Field']}: {$column['Type']} ({$column['Null']})\n";
    }
    
    // Mostrar todos los estados disponibles
    $stmt = $pdo->query("SELECT * FROM File_Status ORDER BY Id");
    $statusData = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (!empty($statusData)) {
        echo "\n  Estados disponibles:\n";
        foreach ($statusData as $status) {
            echo "    - ID: {$status['Id']} | Nombre: {$status['Name']}\n";
        }
    }
    
    echo "\n";

    // 3. Verificar estructura de File_SubStatus
    echo "🔍 ESTRUCTURA DE LA TABLA FILE_SUBSTATUS:\n";
    echo "=========================================\n";
    
    $stmt = $pdo->query("DESCRIBE File_SubStatus");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($columns as $column) {
        echo "  - {$column['Field']}: {$column['Type']} ({$column['Null']})\n";
    }
    
    // Mostrar sub-estados disponibles
    $stmt = $pdo->query("SELECT * FROM File_SubStatus ORDER BY Id");
    $subStatusData = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (!empty($subStatusData)) {
        echo "\n  Sub-estados disponibles:\n";
        foreach ($subStatusData as $subStatus) {
            echo "    - ID: {$subStatus['Id']} | Nombre: {$subStatus['Name']}\n";
        }
    }
    
    echo "\n";

    // 4. Probar query con join real
    echo "🔍 PROBANDO QUERY CON JOIN REAL:\n";
    echo "================================\n";
    
    $query = "
        SELECT 
            f.Id as ndCliente,
            f.IdOrder as ndPedido,
            c.Name as cliente,
            p.Name as proceso,
            ot.Name as operacion,
            fs.Name as estado_actual,
            f.IdCurrentState,
            f.RegistrationDate as registro
        FROM File f
        INNER JOIN HeaderClient hc ON f.IdClient = hc.Id
        INNER JOIN Client c ON hc.IdClient = c.Id
        INNER JOIN Process p ON f.IdProcess = p.Id
        INNER JOIN OperationType ot ON f.IdOperation = ot.Id
        INNER JOIN File_Status fs ON f.IdCurrentState = fs.Id
        WHERE f.IdAgency = 1
        LIMIT 5
    ";
    
    try {
        $stmt = $pdo->query($query);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        if (!empty($results)) {
            echo "  Query ejecutado exitosamente. Resultados:\n";
            foreach ($results as $row) {
                echo "    " . json_encode($row, JSON_UNESCAPED_UNICODE) . "\n";
            }
        } else {
            echo "  Query ejecutado pero no hay resultados\n";
        }
    } catch (Exception $e) {
        echo "  ❌ Error en el query: " . $e->getMessage() . "\n";
    }
    
    echo "\n";

    // 5. Verificar si hay campo Enabled en Client
    echo "🔍 VERIFICANDO CAMPO ENABLED EN CLIENT:\n";
    echo "=======================================\n";
    
    $stmt = $pdo->query("SHOW COLUMNS FROM Client LIKE 'Enabled'");
    if ($stmt->rowCount() > 0) {
        echo "  ✅ El campo 'Enabled' existe en Client\n";
    } else {
        echo "  ❌ El campo 'Enabled' NO existe en Client\n";
        echo "  ✅ No necesitamos filtrar por Enabled en Client\n";
    }
    
    echo "\n";

} catch (PDOException $e) {
    echo "❌ Error de base de datos: " . $e->getMessage() . "\n";
    exit(1);
} catch (Exception $e) {
    echo "❌ Error general: " . $e->getMessage() . "\n";
    exit(1);
}

echo "✅ Verificación de estructura completada\n";
?>
