<?php

/**
 * Script para probar las credenciales directamente
 * y verificar si el problema está en la lógica o en el servidor
 */

echo "=== PRUEBA DIRECTA DE CREDENCIALES ===\n\n";

try {
    // Cargar CodeIgniter
    require_once __DIR__ . '/../vendor/autoload.php';
    
    // Configurar el entorno
    putenv('CI_ENVIRONMENT=development');
    
    // Conectar a la base de datos usando la configuración que configuraste
    $hostname = 'localhost';
    $username = 'root';
    $password_db = '00@Limonero'; // La contraseña que configuraste
    $database = 'singlefile_db';
    
    echo "🔌 Conectando a la base de datos...\n";
    echo "  - Host: {$hostname}\n";
    echo "  - Usuario: {$username}\n";
    echo "  - Base de datos: {$database}\n\n";
    
    $db = new mysqli($hostname, $username, $password_db, $database);
    
    if ($db->connect_error) {
        throw new Exception("Error de conexión: " . $db->connect_error);
    }
    
    echo "✅ Conexión a base de datos exitosa\n\n";
    
    // Probar las credenciales que me diste
    $email = "carlos.limon@nexusqtech.com";
    $password = "00@Limonero";
    
    echo "🔐 Probando credenciales:\n";
    echo "  - Email: {$email}\n";
    echo "  - Password: {$password}\n\n";
    
    // Buscar usuario por email exacto
    $stmt = $db->prepare("SELECT Id, Name, User, Pass, UserPass, Mail, Enabled FROM User WHERE Mail = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo "❌ Usuario no encontrado con email: {$email}\n\n";
        
        // Buscar usuarios con email similar
        echo "🔍 Buscando usuarios con email similar...\n";
        $stmt = $db->prepare("SELECT Id, Name, User, Pass, UserPass, Mail, Enabled FROM User WHERE Mail LIKE ?");
        $searchTerm = '%carlos.limon%';
        $stmt->bind_param("s", $searchTerm);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            echo "❌ No se encontraron usuarios con email similar a carlos.limon\n";
        } else {
            echo "✅ Usuarios encontrados con email similar:\n\n";
            while ($user = $result->fetch_assoc()) {
                echo "ID: " . $user['Id'] . "\n";
                echo "Nombre: " . $user['Name'] . "\n";
                echo "Usuario: " . $user['User'] . "\n";
                echo "Email: " . $user['Mail'] . "\n";
                echo "UserPass: " . $user['UserPass'] . "\n";
                echo "Enabled: " . ($user['Enabled'] ? 'Sí' : 'No') . "\n";
                echo "---\n";
            }
        }
    } else {
        echo "✅ Usuario encontrado:\n";
        $user = $result->fetch_assoc();
        echo "  - ID: {$user['Id']}\n";
        echo "  - Nombre: {$user['Name']}\n";
        echo "  - Usuario: {$user['User']}\n";
        echo "  - Email: {$user['Mail']}\n";
        echo "  - UserPass: {$user['UserPass']}\n";
        echo "  - Enabled: " . ($user['Enabled'] ? 'Sí' : 'No') . "\n\n";
        
        // Verificar contraseña
        echo "🔒 Verificando contraseña...\n";
        
        // Primero verificar si la contraseña está en UserPass
        if ($user['UserPass'] === $password) {
            echo "✅ Contraseña verificada en campo UserPass\n";
        } else {
            echo "❌ Contraseña no coincide en campo UserPass\n";
        }
        
        // Verificar si la contraseña está encriptada en Pass
        if (password_verify($password, $user['Pass'])) {
            echo "✅ Contraseña verificada en campo Pass (encriptada)\n";
        } else {
            echo "❌ Contraseña no coincide en campo Pass (encriptada)\n";
        }
        
        // Verificar si el usuario está habilitado
        if ($user['Enabled'] == 1) {
            echo "✅ Usuario está habilitado\n";
        } else {
            echo "❌ Usuario NO está habilitado (Enabled = 0)\n";
        }
    }
    
    $stmt->close();
    $db->close();
    
    echo "\n🎯 CONCLUSIÓN:\n";
    echo "Si las credenciales no coinciden exactamente, ese es el problema del error 403.\n";
    echo "El error 403 indica que la autenticación falló, no un problema de servidor.\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
