<?php

/**
 * Script para probar el login con información del rol
 * Verifica que se incluya la descripción del rol desde la tabla UserRol
 */

echo "=== PRUEBA DE LOGIN CON INFORMACIÓN DEL ROL ===\n\n";

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
    
    // Simular la lógica del AuthModel con JOIN
    $email = "carlos.limon@nexusqtech.com";
    $password = "00@Limonero";
    
    echo "🔐 Probando login con información del rol:\n";
    echo "  - Email: {$email}\n";
    echo "  - Password: {$password}\n\n";
    
    // Buscar usuario por email con JOIN a UserRol
    $query = "
        SELECT 
            u.Id, 
            u.Name, 
            u.User, 
            u.Pass, 
            u.UserPass, 
            u.Mail, 
            u.Enabled, 
            u.IdUserRol,
            ur.Name as RoleName
        FROM User u
        LEFT JOIN UserRol ur ON u.IdUserRol = ur.Id
        WHERE u.Mail = ? AND u.Enabled = 1
    ";
    
    $stmt = $db->prepare($query);
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
    echo "  - Rol ID: {$user['IdUserRol']}\n";
    echo "  - Nombre del Rol: " . ($user['RoleName'] ?? 'Sin rol asignado') . "\n\n";
    
    // Verificar contraseña
    echo "🔒 Verificando contraseña...\n";
    
    $authenticated = false;
    
    // 1. Verificar si la contraseña está encriptada en Pass
    if (password_verify($password, $user['Pass'])) {
        echo "✅ Contraseña verificada (hash bcrypt)\n";
        $authenticated = true;
    }
    // 2. Verificar si la contraseña está en texto plano
    elseif ($password === $user['Pass']) {
        echo "✅ Contraseña verificada (texto plano)\n";
        $authenticated = true;
    }
    // 3. Verificar en el campo UserPass
    elseif ($user['UserPass'] && !empty($user['UserPass'])) {
        $parts = explode(',', $user['UserPass']);
        foreach ($parts as $part) {
            $part = trim($part);
            if ($password === $part) {
                echo "✅ Contraseña verificada (UserPass)\n";
                $authenticated = true;
                break;
            }
        }
    }
    
    if ($authenticated) {
        echo "\n🎉 AUTENTICACIÓN EXITOSA\n";
        echo "📋 Información del usuario:\n";
        echo "  - ID: {$user['Id']}\n";
        echo "  - Nombre: {$user['Name']}\n";
        echo "  - Email: {$user['Mail']}\n";
        echo "  - Usuario: {$user['User']}\n";
        echo "  - Rol ID: {$user['IdUserRol']}\n";
        echo "  - Nombre del Rol: " . ($user['RoleName'] ?? 'Sin rol asignado') . "\n";
        echo "  - Estado: " . ($user['Enabled'] ? 'Habilitado' : 'Deshabilitado') . "\n";
        
        // Simular la respuesta que se enviaría al frontend
        echo "\n📤 Respuesta simulada al frontend:\n";
        echo json_encode([
            'success' => true,
            'message' => 'Login exitoso',
            'user' => [
                'id' => $user['Id'],
                'name' => $user['Name'],
                'email' => $user['Mail'],
                'username' => $user['User'],
                'role_id' => $user['IdUserRol'],
                'role_name' => $user['RoleName'] ?? 'Sin rol asignado',
                'enabled' => $user['Enabled']
            ]
        ], JSON_PRETTY_PRINT);
        
    } else {
        echo "❌ Contraseña incorrecta\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
} finally {
    if (isset($db)) {
        $db->close();
    }
}

echo "\n=== FIN DE LA PRUEBA ===\n";
