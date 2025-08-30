<?php
// Script para verificar usuarios disponibles en la base de datos

$host = 'localhost';
$dbname = 'singlefile_db';
$username = 'root';
$password = '00@Limonero';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "✅ Conexión a la base de datos exitosa\n\n";

    // Verificar usuarios disponibles
    echo "👥 USUARIOS DISPONIBLES EN LA BASE DE DATOS:\n";
    echo "=============================================\n";
    
    $stmt = $pdo->query("SELECT Id, Name, User, Mail, Enabled FROM User WHERE Enabled = 1 LIMIT 10");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($users)) {
        echo "❌ No hay usuarios habilitados en la base de datos\n";
    } else {
        foreach ($users as $user) {
            echo "  - ID: {$user['Id']} | Nombre: {$user['Name']} | Usuario: {$user['User']} | Email: {$user['Mail']} | Habilitado: {$user['Enabled']}\n";
        }
    }
    
    echo "\n";

    // Verificar si hay algún usuario con contraseña simple
    echo "🔑 VERIFICANDO CONTRASEÑAS SIMPLES:\n";
    echo "===================================\n";
    
    $stmt = $pdo->query("SELECT Id, Name, User, Pass FROM User WHERE Enabled = 1 AND (Pass = 'admin' OR Pass = 'admin123' OR Pass = 'password' OR Pass = '123456') LIMIT 5");
    $simplePasswords = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($simplePasswords)) {
        echo "❌ No se encontraron usuarios con contraseñas simples\n";
    } else {
        foreach ($simplePasswords as $user) {
            echo "  - ID: {$user['Id']} | Nombre: {$user['Name']} | Usuario: {$user['User']} | Contraseña: {$user['Pass']}\n";
        }
    }

} catch (PDOException $e) {
    echo "❌ Error de base de datos: " . $e->getMessage() . "\n";
    exit(1);
} catch (Exception $e) {
    echo "❌ Error general: " . $e->getMessage() . "\n";
    exit(1);
}

echo "\n✅ Verificación de usuarios completada\n";
?>
