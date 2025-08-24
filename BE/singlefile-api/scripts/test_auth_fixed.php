<?php

/**
 * Script para probar la autenticación corregida
 * Simula exactamente lo que hace la API
 */

echo "=== PRUEBA DE AUTENTICACIÓN CORREGIDA ===\n\n";

try {
    // Cargar CodeIgniter
    require_once __DIR__ . '/../vendor/autoload.php';
    
    // Configurar el entorno
    putenv('CI_ENVIRONMENT=development');
    
    // Conectar a la base de datos
    $hostname = 'localhost';
    $username = 'root';
    $password_db = '00@Limonero';
    $database = 'singlefile_db';
    
    $db = new mysqli($hostname, $username, $password_db, $database);
    
    if ($db->connect_error) {
        throw new Exception("Error de conexión: " . $db->connect_error);
    }
    
    echo "✅ Conexión a base de datos exitosa\n\n";
    
    // Simular la lógica del AuthModel
    $email = "carlos.limon@nexusqtech.com";
    $password = "00@Limonero";
    
    echo "🔐 Probando autenticación:\n";
    echo "  - Email: {$email}\n";
    echo "  - Password: {$password}\n\n";
    
    // Buscar usuario por email
    $stmt = $db->prepare("SELECT Id, Name, User, Pass, UserPass, Mail, Enabled, IdUserRol FROM User WHERE Mail = ? AND Enabled = 1");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo "❌ Usuario no encontrado o deshabilitado\n";
        exit(1);
    }
    
    $user = $result->fetch_assoc();
    echo "✅ Usuario encontrado:\n";
    echo "  - ID: {$user['Id']}\n";
    echo "  - Nombre: {$user['Name']}\n";
    echo "  - Usuario: {$user['User']}\n";
    echo "  - Email: {$user['Mail']}\n";
    echo "  - UserPass: {$user['UserPass']}\n";
    echo "  - Enabled: " . ($user['Enabled'] ? 'Sí' : 'No') . "\n";
    echo "  - Rol ID: {$user['IdUserRol']}\n\n";
    
    // Simular el método verifyPassword corregido
    echo "🔒 Verificando contraseña...\n";
    
    $authenticated = false;
    
    // 1. Verificar si la contraseña está encriptada en Pass
    if (password_verify($password, $user['Pass'])) {
        echo "✅ Contraseña verificada en campo Pass (encriptada)\n";
        $authenticated = true;
    }
    
    // 2. Verificar si la contraseña está en texto plano
    if ($password === $user['Pass']) {
        echo "✅ Contraseña verificada en campo Pass (texto plano)\n";
        $authenticated = true;
    }
    
    // 3. Verificar en el campo UserPass (formato: "usuario,contraseña")
    if (!$authenticated && !empty($user['UserPass'])) {
        $parts = explode(',', $user['UserPass']);
        foreach ($parts as $part) {
            $part = trim($part);
            if ($password === $part) {
                echo "✅ Contraseña verificada en campo UserPass: \"{$part}\"\n";
                $authenticated = true;
                break;
            }
        }
    }
    
    if ($authenticated) {
        echo "\n🎉 ¡AUTENTICACIÓN EXITOSA!\n";
        echo "El usuario puede hacer login correctamente.\n";
        
        // Simular generación de token JWT
        echo "\n🎫 Generando token de sesión...\n";
        
        $payload = [
            'user_id' => $user['Id'],
            'email' => $user['Mail'],
            'username' => $user['User'],
            'role_id' => $user['IdUserRol'],
            'exp' => time() + 3600
        ];
        
        echo "✅ Token generado (simulado):\n";
        echo "  - User ID: {$payload['user_id']}\n";
        echo "  - Email: {$payload['email']}\n";
        echo "  - Username: {$payload['username']}\n";
        echo "  - Role ID: {$payload['role_id']}\n";
        echo "  - Expira: " . date('Y-m-d H:i:s', $payload['exp']) . "\n\n";
        
        echo "🎯 CONCLUSIÓN:\n";
        echo "La autenticación está funcionando correctamente.\n";
        echo "El error 403 en Postman debe ser por otro motivo.\n";
        
    } else {
        echo "\n❌ AUTENTICACIÓN FALLIDA\n";
        echo "La contraseña no coincide con ningún campo.\n";
        
        echo "\n🔍 ANÁLISIS:\n";
        echo "Campo Pass (encriptado): " . substr($user['Pass'], 0, 20) . "...\n";
        echo "Campo UserPass: \"{$user['UserPass']}\"\n";
        echo "Contraseña ingresada: \"{$password}\"\n";
    }
    
    $stmt->close();
    $db->close();
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
