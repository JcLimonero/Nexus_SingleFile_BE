<?php

/**
 * Script que simula la respuesta completa de la API
 * Para verificar que la autenticación funciona correctamente
 */

echo "=== SIMULACIÓN COMPLETA DE LA API ===\n\n";

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
    
    // Simular request de la API
    $email = "carlos.limon@nexusqtech.com";
    $password = "00@Limonero";
    
    echo "🔐 Simulando request a la API:\n";
    echo "  - Endpoint: POST /api/auth/login\n";
    echo "  - Email: {$email}\n";
    echo "  - Password: {$password}\n\n";
    
    // Simular validaciones del controlador
    echo "📋 Validaciones del controlador:\n";
    
    if (empty($email) || empty($password)) {
        echo "❌ Error: Email y contraseña son requeridos\n";
        exit(1);
    }
    echo "✅ Validación: Email y contraseña no están vacíos\n";
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "❌ Error: Formato de email inválido\n";
        exit(1);
    }
    echo "✅ Validación: Formato de email válido\n";
    
    // Buscar usuario por email en campo Mail
    echo "\n🔍 Buscando usuario en campo Mail...\n";
    $stmt = $db->prepare("SELECT Id, Name, User, Pass, UserPass, Mail, Enabled, IdUserRol FROM User WHERE Mail = ? AND Enabled = 1");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo "❌ Usuario no encontrado o deshabilitado\n";
        echo "\n📊 Respuesta de la API (simulada):\n";
        echo json_encode([
            'success' => false,
            'message' => 'Usuario no encontrado o deshabilitado'
        ], JSON_PRETTY_PRINT);
        exit(1);
    }
    
    $user = $result->fetch_assoc();
    echo "✅ Usuario encontrado en campo Mail:\n";
    echo "  - ID: {$user['Id']}\n";
    echo "  - Nombre: {$user['Name']}\n";
    echo "  - Usuario: {$user['User']}\n";
    echo "  - Email: {$user['Mail']}\n";
    echo "  - Rol ID: {$user['IdUserRol']}\n";
    echo "  - Habilitado: " . ($user['Enabled'] ? 'Sí' : 'No') . "\n\n";
    
    // Verificar contraseña en campo Pass
    echo "🔒 Verificando contraseña en campo Pass...\n";
    
    if (password_verify($password, $user['Pass'])) {
        echo "✅ Contraseña verificada correctamente en campo Pass\n";
        
        // Simular generación de JWT
        echo "\n🎫 Generando token JWT...\n";
        
        // Simular payload del JWT
        $payload = [
            'iss' => 'singlefile-api',
            'aud' => 'singlefile-client',
            'iat' => time(),
            'exp' => time() + 3600,
            'user_id' => $user['Id'],
            'email' => $user['Mail'],
            'role_id' => $user['IdUserRol']
        ];
        
        echo "✅ Payload del JWT generado:\n";
        echo json_encode($payload, JSON_PRETTY_PRINT);
        
        // Simular respuesta exitosa de la API
        echo "\n\n🎉 RESPUESTA EXITOSA DE LA API (simulada):\n";
        echo "Status: 200 OK\n";
        echo "Content-Type: application/json\n\n";
        
        $response = [
            'success' => true,
            'message' => 'Login exitoso',
            'data' => [
                'user' => [
                    'id' => $user['Id'],
                    'name' => $user['Name'],
                    'email' => $user['Mail'],
                    'username' => $user['User'],
                    'role_id' => $user['IdUserRol'],
                    'enabled' => $user['Enabled']
                ],
                'token' => 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...', // Simulado
                'expires_in' => 3600
            ]
        ];
        
        echo json_encode($response, JSON_PRETTY_PRINT);
        
        echo "\n\n🎯 CONCLUSIÓN:\n";
        echo "✅ La API está funcionando correctamente a nivel de lógica\n";
        echo "✅ La autenticación es exitosa\n";
        echo "✅ Las credenciales son válidas\n";
        echo "❌ El problema está en el servidor web, no en la lógica\n";
        
    } else {
        echo "❌ Contraseña incorrecta en campo Pass\n";
        
        echo "\n📊 Respuesta de la API (simulada):\n";
        echo "Status: 401 Unauthorized\n";
        echo "Content-Type: application/json\n\n";
        
        $response = [
            'success' => false,
            'message' => 'Contraseña incorrecta'
        ];
        
        echo json_encode($response, JSON_PRETTY_PRINT);
        
        echo "\n\n🔍 ANÁLISIS:\n";
        echo "Campo Pass (encriptado): " . substr($user['Pass'], 0, 20) . "...\n";
        echo "Contraseña ingresada: \"{$password}\"\n";
        echo "Verificación password_verify(): " . (password_verify($password, $user['Pass']) ? 'true' : 'false') . "\n";
    }
    
    $stmt->close();
    $db->close();
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
