<?php

/**
 * Script para probar la autenticación directamente
 * Simula el proceso de login sin necesidad del servidor web
 */

echo "=== PRUEBA DIRECTA DE AUTENTICACIÓN ===\n\n";

try {
    // Cargar CodeIgniter de manera simple
    require_once __DIR__ . '/../vendor/autoload.php';
    
    // Configurar el entorno
    putenv('CI_ENVIRONMENT=development');
    
    // Cargar configuración de base de datos
    $dbConfig = require __DIR__ . '/../app/Config/Database.php';
    
    // Conectar a la base de datos
    $db = new mysqli(
        $dbConfig->default['hostname'],
        $dbConfig->default['username'],
        $dbConfig->default['password'],
        $dbConfig->default['database']
    );
    
    if ($db->connect_error) {
        throw new Exception("Error de conexión: " . $db->connect_error);
    }
    
    echo "✅ Conexión a base de datos exitosa\n\n";
    
    // Simular login del usuario admin
    $email = "carlos.limon@nexxus.com.mx"; // Email del admin
    $password = "admin"; // Contraseña original
    
    echo "🔐 Probando login para usuario admin:\n";
    echo "  - Email: {$email}\n";
    echo "  - Contraseña: {$password}\n\n";
    
    // Buscar usuario por email
    $stmt = $db->prepare("SELECT Id, Name, User, Pass, Enabled, IdUserRol FROM User WHERE Mail = ? AND Enabled = 1");
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
    echo "  - Rol ID: {$user['IdUserRol']}\n";
    echo "  - Habilitado: " . ($user['Enabled'] ? 'Sí' : 'No') . "\n\n";
    
    // Verificar contraseña
    echo "🔒 Verificando contraseña...\n";
    
    if (password_verify($password, $user['Pass'])) {
        echo "✅ Contraseña verificada correctamente\n";
        
        // Simular generación de JWT (sin la librería real)
        echo "🎫 Generando token de sesión...\n";
        
        // Crear payload simple (esto es solo para demostración)
        $payload = [
            'user_id' => $user['Id'],
            'email' => $email,
            'username' => $user['User'],
            'role_id' => $user['IdUserRol'],
            'exp' => time() + 3600 // 1 hora
        ];
        
        echo "✅ Token generado (simulado):\n";
        echo "  - User ID: {$payload['user_id']}\n";
        echo "  - Email: {$payload['email']}\n";
        echo "  - Username: {$payload['username']}\n";
        echo "  - Role ID: {$payload['role_id']}\n";
        echo "  - Expira: " . date('Y-m-d H:i:s', $payload['exp']) . "\n\n";
        
        echo "🎉 ¡LOGIN EXITOSO!\n";
        echo "El sistema de autenticación está funcionando correctamente con contraseñas encriptadas.\n";
        
    } else {
        echo "❌ Contraseña incorrecta\n";
        echo "Esto puede indicar que la contraseña no se migró correctamente.\n";
        
        // Verificar el hash almacenado
        echo "\n🔍 Información del hash almacenado:\n";
        $hashInfo = password_get_info($user['Pass']);
        echo "  - Algoritmo: " . ($hashInfo['algoName'] !== 'unknown' ? $hashInfo['algoName'] : 'Desconocido') . "\n";
        echo "  - Costo: " . $hashInfo['options']['cost'] . "\n";
        echo "  - Hash: " . substr($user['Pass'], 0, 20) . "...\n";
    }
    
    $stmt->close();
    $db->close();
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
    exit(1);
}
