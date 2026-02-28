<?php
/**
 * Prueba detallada de actualización del campo Mail
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== PRUEBA DETALLADA DE ACTUALIZACIÓN DE MAIL ===\n\n";

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

echo "Base de datos: {$db['database']}\n";
echo "Usuario: {$db['username']}\n";
echo "Host: {$db['hostname']}\n\n";

try {
    $mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);
    
    if ($mysqli->connect_error) {
        die("❌ Error de conexión: " . $mysqli->connect_error . "\n");
    }
    
    echo "✅ Conectado a la base de datos\n\n";
    
    // Verificar permisos del usuario actual
    echo "🔐 VERIFICACIÓN DE PERMISOS:\n";
    echo str_repeat("=", 80) . "\n";
    $result = $mysqli->query("SHOW GRANTS");
    if ($result) {
        while ($row = $result->fetch_row()) {
            echo $row[0] . "\n";
        }
    }
    
    echo "\n";
    
    // Obtener usuario de prueba
    $testUser = $mysqli->query("SELECT Id, Name, Mail FROM user WHERE Id = 1")->fetch_assoc();
    if (!$testUser) {
        die("❌ No se encontró usuario con ID 1\n");
    }
    
    echo "👤 USUARIO DE PRUEBA:\n";
    echo str_repeat("=", 80) . "\n";
    echo "ID: {$testUser['Id']}\n";
    echo "Nombre: {$testUser['Name']}\n";
    echo "Email actual: {$testUser['Mail']}\n\n";
    
    $originalEmail = $testUser['Mail'];
    $testEmail = 'test_update@nexusqtech.com';
    
    // Prueba 1: UPDATE simple
    echo "🧪 PRUEBA 1: UPDATE simple\n";
    echo str_repeat("-", 80) . "\n";
    $update1 = $mysqli->prepare("UPDATE user SET Mail = ? WHERE Id = ?");
    $update1->bind_param("si", $testEmail, $testUser['Id']);
    
    if ($update1->execute()) {
        echo "✅ UPDATE exitoso\n";
        $affected = $update1->affected_rows;
        echo "   Filas afectadas: $affected\n";
        
        // Verificar el cambio
        $verify = $mysqli->query("SELECT Mail FROM user WHERE Id = {$testUser['Id']}")->fetch_assoc();
        echo "   Email después del UPDATE: {$verify['Mail']}\n";
        
        // Revertir
        $revert1 = $mysqli->prepare("UPDATE user SET Mail = ? WHERE Id = ?");
        $revert1->bind_param("si", $originalEmail, $testUser['Id']);
        $revert1->execute();
        $revert1->close();
        echo "✅ Cambio revertido\n";
    } else {
        echo "❌ Error: " . $update1->error . "\n";
        echo "   Código: " . $update1->errno . "\n";
    }
    $update1->close();
    
    echo "\n";
    
    // Prueba 2: UPDATE con UpdateDate
    echo "🧪 PRUEBA 2: UPDATE con UpdateDate\n";
    echo str_repeat("-", 80) . "\n";
    $update2 = $mysqli->prepare("UPDATE user SET Mail = ?, UpdateDate = NOW() WHERE Id = ?");
    $update2->bind_param("si", $testEmail, $testUser['Id']);
    
    if ($update2->execute()) {
        echo "✅ UPDATE exitoso\n";
        $affected = $update2->affected_rows;
        echo "   Filas afectadas: $affected\n";
        
        // Revertir
        $revert2 = $mysqli->prepare("UPDATE user SET Mail = ? WHERE Id = ?");
        $revert2->bind_param("si", $originalEmail, $testUser['Id']);
        $revert2->execute();
        $revert2->close();
        echo "✅ Cambio revertido\n";
    } else {
        echo "❌ Error: " . $update2->error . "\n";
        echo "   Código: " . $update2->errno . "\n";
    }
    $update2->close();
    
    echo "\n";
    
    // Prueba 3: UPDATE directo sin prepared statement
    echo "🧪 PRUEBA 3: UPDATE directo (sin prepared statement)\n";
    echo str_repeat("-", 80) . "\n";
    $sql = "UPDATE user SET Mail = '" . $mysqli->real_escape_string($testEmail) . "' WHERE Id = {$testUser['Id']}";
    echo "SQL: $sql\n";
    
    if ($mysqli->query($sql)) {
        echo "✅ UPDATE exitoso\n";
        echo "   Filas afectadas: " . $mysqli->affected_rows . "\n";
        
        // Revertir
        $revertSql = "UPDATE user SET Mail = '" . $mysqli->real_escape_string($originalEmail) . "' WHERE Id = {$testUser['Id']}";
        $mysqli->query($revertSql);
        echo "✅ Cambio revertido\n";
    } else {
        echo "❌ Error: " . $mysqli->error . "\n";
        echo "   Código: " . $mysqli->errno . "\n";
    }
    
    echo "\n";
    
    // Prueba 4: Verificar si hay locks en la tabla
    echo "🔒 VERIFICACIÓN DE LOCKS:\n";
    echo str_repeat("-", 80) . "\n";
    $locks = $mysqli->query("SHOW OPEN TABLES WHERE In_use > 0");
    if ($locks && $locks->num_rows > 0) {
        echo "⚠️  Tablas bloqueadas encontradas:\n";
        while ($lock = $locks->fetch_assoc()) {
            echo "   - {$lock['Table']} (Database: {$lock['Database']})\n";
        }
    } else {
        echo "✅ No hay tablas bloqueadas\n";
    }
    
    echo "\n";
    
    // Prueba 5: Verificar transacciones activas
    echo "💳 VERIFICACIÓN DE TRANSACCIONES:\n";
    echo str_repeat("-", 80) . "\n";
    $autocommit = $mysqli->query("SELECT @@autocommit")->fetch_row()[0];
    echo "Autocommit: " . ($autocommit ? "ON" : "OFF") . "\n";
    
    // Prueba 6: Intentar con transacción
    echo "\n🧪 PRUEBA 4: UPDATE dentro de transacción\n";
    echo str_repeat("-", 80) . "\n";
    $mysqli->autocommit(false);
    
    try {
        $update3 = $mysqli->prepare("UPDATE user SET Mail = ? WHERE Id = ?");
        $update3->bind_param("si", $testEmail, $testUser['Id']);
        
        if ($update3->execute()) {
            echo "✅ UPDATE exitoso en transacción\n";
            $mysqli->rollback();
            echo "✅ Transacción revertida\n";
        } else {
            echo "❌ Error: " . $update3->error . "\n";
            $mysqli->rollback();
        }
        $update3->close();
    } catch (Exception $e) {
        $mysqli->rollback();
        echo "❌ Excepción: " . $e->getMessage() . "\n";
    }
    
    $mysqli->autocommit(true);
    
    echo "\n";
    
    // Información adicional
    echo "📊 INFORMACIÓN ADICIONAL:\n";
    echo str_repeat("=", 80) . "\n";
    $version = $mysqli->query("SELECT VERSION()")->fetch_row()[0];
    echo "Versión MySQL: $version\n";
    
    $charset = $mysqli->get_charset();
    echo "Charset: {$charset->charset}\n";
    echo "Collation: {$charset->collation}\n";
    
    $mysqli->close();
    
    echo "\n✅ Todas las pruebas completadas\n";
    echo "\n💡 Si todas las pruebas fueron exitosas pero aún no puedes actualizar desde tu herramienta:\n";
    echo "   1. Verifica que estés usando el mismo usuario de base de datos\n";
    echo "   2. Verifica que no haya una sesión de transacción abierta\n";
    echo "   3. Intenta refrescar la conexión en tu herramienta\n";
    echo "   4. Verifica que no haya un trigger o stored procedure que no se muestre aquí\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
