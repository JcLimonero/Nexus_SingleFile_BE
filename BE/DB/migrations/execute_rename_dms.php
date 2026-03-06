<?php
/**
 * Ejecutar migración para renombrar IdTotalDealer a IdDMS
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== RENOMBRAR IdTotalDealer A IdDMS ===\n\n";

$configFile = __DIR__ . '/../../app/Config/database-config.json';
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
    
    // Verificar columnas actuales
    echo "🔍 Verificando columnas actuales...\n";
    
    // ClientTotalRelation
    $result = $mysqli->query("SHOW COLUMNS FROM ClientTotalRelation LIKE 'IdTotalDealer'");
    if ($result && $result->num_rows > 0) {
        echo "  ⚠️  ClientTotalRelation.IdTotalDealer existe\n";
        
        // Obtener tipo de dato
        $result = $mysqli->query("SHOW COLUMNS FROM ClientTotalRelation WHERE Field = 'IdTotalDealer'");
        $colInfo = $result->fetch_assoc();
        $colType = $colInfo['Type'];
        $isNull = $colInfo['Null'] === 'YES' ? 'NULL' : 'NOT NULL';
        $default = $colInfo['Default'] !== null ? "DEFAULT '{$colInfo['Default']}'" : '';
        
        echo "  Renombrando ClientTotalRelation.IdTotalDealer → IdDMS... ";
        $sql = "ALTER TABLE `ClientTotalRelation` CHANGE COLUMN `IdTotalDealer` `IdDMS` {$colType} {$isNull} {$default}";
        
        if ($mysqli->query($sql)) {
            echo "✅\n";
        } else {
            echo "❌ Error: " . $mysqli->error . "\n";
        }
    } else {
        echo "  ✅ ClientTotalRelation.IdTotalDealer ya no existe (o ya se renombró)\n";
    }
    
    // OrderByCar
    $result = $mysqli->query("SHOW COLUMNS FROM OrderByCar LIKE 'IdTotalDealer'");
    if ($result && $result->num_rows > 0) {
        echo "  ⚠️  OrderByCar.IdTotalDealer existe\n";
        
        // Obtener tipo de dato
        $result = $mysqli->query("SHOW COLUMNS FROM OrderByCar WHERE Field = 'IdTotalDealer'");
        $colInfo = $result->fetch_assoc();
        $colType = $colInfo['Type'];
        $isNull = $colInfo['Null'] === 'YES' ? 'NULL' : 'NOT NULL';
        $default = $colInfo['Default'] !== null ? "DEFAULT '{$colInfo['Default']}'" : '';
        
        echo "  Renombrando OrderByCar.IdTotalDealer → IdDMS... ";
        $sql = "ALTER TABLE `OrderByCar` CHANGE COLUMN `IdTotalDealer` `IdDMS` {$colType} {$isNull} {$default}";
        
        if ($mysqli->query($sql)) {
            echo "✅\n";
        } else {
            echo "❌ Error: " . $mysqli->error . "\n";
        }
    } else {
        echo "  ✅ OrderByCar.IdTotalDealer ya no existe (o ya se renombró)\n";
    }
    
    // Verificación final
    echo "\n🔍 Verificación final...\n";
    $result = $mysqli->query("SHOW COLUMNS FROM ClientTotalRelation WHERE Field = 'IdDMS'");
    if ($result && $result->num_rows > 0) {
        echo "  ✅ ClientTotalRelation.IdDMS existe\n";
    } else {
        echo "  ❌ ClientTotalRelation.IdDMS NO existe\n";
    }
    
    $result = $mysqli->query("SHOW COLUMNS FROM OrderByCar WHERE Field = 'IdDMS'");
    if ($result && $result->num_rows > 0) {
        echo "  ✅ OrderByCar.IdDMS existe\n";
    } else {
        echo "  ❌ OrderByCar.IdDMS NO existe\n";
    }
    
    $mysqli->close();
    
    echo "\n✅ Proceso completado\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
