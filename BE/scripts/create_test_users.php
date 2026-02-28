<?php
/**
 * Crear usuarios de prueba con diferentes roles y permisos
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== CREAR USUARIOS DE PRUEBA ===\n\n";

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

echo "Base de datos: {$db['database']}\n";
echo "Host: {$db['hostname']}\n\n";

// Función para hashear password
function hashPassword($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}

// Usuarios a crear
$users = [
    // Administrador - acceso a todo
    [
        'Id' => 1,
        'Name' => 'Administrador Sistema',
        'user' => 'admin',
        'Pass' => hashPassword('admin123'),
        'Mail' => 'admin@sistema.com',
        'IdUserRol' => 7, // Administrador
        'DefaultAgency' => 1,
        'agencies' => [1, 2, 3, 4, 5, 6, 7, 8], // Todas las agencias
        'processes' => [1, 2, 3], // Todos los procesos
    ],
    
    // Soporte
    [
        'Id' => 2,
        'Name' => 'Soporte Técnico',
        'user' => 'soporte',
        'Pass' => hashPassword('soporte123'),
        'Mail' => 'soporte@sistema.com',
        'IdUserRol' => 8, // Soporte
        'DefaultAgency' => 1,
        'agencies' => [1, 2, 3, 4, 5, 6, 7, 8], // Todas las agencias
        'processes' => [1, 2, 3], // Todos los procesos
    ],
    
    // Auditor
    [
        'Id' => 3,
        'Name' => 'Auditor Sistema',
        'user' => 'auditor',
        'Pass' => hashPassword('auditor123'),
        'Mail' => 'auditor@sistema.com',
        'IdUserRol' => 9, // Auditoria
        'DefaultAgency' => 1,
        'agencies' => [1, 2, 3, 4, 5, 6, 7, 8], // Todas las agencias (solo lectura)
        'processes' => [1, 2, 3], // Todos los procesos (solo lectura)
    ],
    
    // Gerente
    [
        'Id' => 4,
        'Name' => 'Gerente General',
        'user' => 'gerente',
        'Pass' => hashPassword('gerente123'),
        'Mail' => 'gerente@sistema.com',
        'IdUserRol' => 6, // Gerente
        'DefaultAgency' => 1,
        'agencies' => [1, 2, 3, 4], // Primeras 4 agencias
        'processes' => [1, 2, 3], // Todos los procesos
    ],
    
    // Coordinador de Operación
    [
        'Id' => 5,
        'Name' => 'Coordinador Operación',
        'user' => 'coordinador',
        'Pass' => hashPassword('coord123'),
        'Mail' => 'coordinador@sistema.com',
        'IdUserRol' => 5, // Coordinador De Operación
        'DefaultAgency' => 4,
        'agencies' => [4, 5, 6, 7, 8], // Agencias del Sur
        'processes' => [1, 2, 3], // Todos los procesos
    ],
    
    // Asesor 1 - Solo agencia Norte (autos nuevos)
    [
        'Id' => 6,
        'Name' => 'Asesor Norte Autos Nuevos',
        'user' => 'asesor1',
        'Pass' => hashPassword('asesor123'),
        'Mail' => 'asesor1@sistema.com',
        'IdUserRol' => 1, // Asesor
        'DefaultAgency' => 1,
        'agencies' => [1], // Solo agencia Norte - Autos Nuevos
        'processes' => [1], // Solo proceso Autos Nuevos
    ],
    
    // Asesor 2 - Agencia Norte (ambas) y proceso Autos Nuevos y Seminuevos
    [
        'Id' => 7,
        'Name' => 'Asesor Norte Completo',
        'user' => 'asesor2',
        'Pass' => hashPassword('asesor123'),
        'Mail' => 'asesor2@sistema.com',
        'IdUserRol' => 1, // Asesor
        'DefaultAgency' => 1,
        'agencies' => [1, 2], // Agencias Norte (Nuevos y Usados)
        'processes' => [1, 2], // Autos Nuevos y Seminuevos
    ],
    
    // Asesor 3 - Agencia Premium y proceso Autos Nuevos
    [
        'Id' => 8,
        'Name' => 'Asesor Premium',
        'user' => 'asesor3',
        'Pass' => hashPassword('asesor123'),
        'Mail' => 'asesor3@sistema.com',
        'IdUserRol' => 1, // Asesor
        'DefaultAgency' => 3,
        'agencies' => [3], // Agencia Premium
        'processes' => [1], // Solo Autos Nuevos
    ],
    
    // Asesor 4 - Múltiples agencias Sur y proceso Motos Nuevos
    [
        'Id' => 9,
        'Name' => 'Asesor Sur Motos',
        'user' => 'asesor4',
        'Pass' => hashPassword('asesor123'),
        'Mail' => 'asesor4@sistema.com',
        'IdUserRol' => 1, // Asesor
        'DefaultAgency' => 6,
        'agencies' => [4, 5, 6], // Agencias Sur (Autos, Camionetas, Motos)
        'processes' => [3], // Solo Motos Nuevos
    ],
    
    // Asesor 5 - Varias agencias y todos los procesos
    [
        'Id' => 10,
        'Name' => 'Asesor Multiagencia',
        'user' => 'asesor5',
        'Pass' => hashPassword('asesor123'),
        'Mail' => 'asesor5@sistema.com',
        'IdUserRol' => 1, // Asesor
        'DefaultAgency' => 4,
        'agencies' => [1, 3, 4, 7], // Varias agencias
        'processes' => [1, 2, 3], // Todos los procesos
    ],
];

try {
    $mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);
    
    if ($mysqli->connect_error) {
        die("❌ Error de conexión: " . $mysqli->connect_error . "\n");
    }
    
    echo "✅ Conectado a la base de datos\n\n";
    
    $usersCreated = 0;
    $usersUpdated = 0;
    $errors = [];
    
    echo "🔄 Creando/Actualizando usuarios...\n";
    echo str_repeat("-", 80) . "\n";
    
    foreach ($users as $userData) {
        $id = $userData['Id'];
        $name = $userData['Name'];
        $username = $userData['user'];
        $password = $userData['Pass'];
        $email = $userData['Mail'];
        $roleId = $userData['IdUserRol'];
        $defaultAgency = $userData['DefaultAgency'];
        $agencies = $userData['agencies'] ?? [];
        $processes = $userData['processes'] ?? [];
        
        // Verificar si el usuario ya existe
        $checkQuery = $mysqli->prepare("SELECT Id, Name FROM user WHERE Id = ?");
        $checkQuery->bind_param("i", $id);
        $checkQuery->execute();
        $result = $checkQuery->get_result();
        $exists = $result->fetch_assoc();
        $checkQuery->close();
        
        if ($exists) {
            // Actualizar usuario
            $updateQuery = $mysqli->prepare("UPDATE user SET Name = ?, user = ?, Pass = ?, Mail = ?, IdUserRol = ?, DefaultAgency = ?, password_migrated = 1, UpdateDate = NOW() WHERE Id = ?");
            $updateQuery->bind_param("ssssiii", $name, $username, $password, $email, $roleId, $defaultAgency, $id);
            
            if ($updateQuery->execute()) {
                echo "✅ Usuario ID $id: Actualizado '$name' (Rol: $roleId)\n";
                $usersUpdated++;
            } else {
                echo "❌ Usuario ID $id: Error al actualizar - " . $updateQuery->error . "\n";
                $errors[] = "Usuario $id: " . $updateQuery->error;
            }
            $updateQuery->close();
        } else {
            // Insertar usuario
            $insertQuery = $mysqli->prepare("INSERT INTO user (Id, Name, user, Pass, Mail, IdUserRol, DefaultAgency, Enabled, password_migrated, RegistrationDate, UpdateDate) VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1, NOW(), NOW())");
            $insertQuery->bind_param("issssii", $id, $name, $username, $password, $email, $roleId, $defaultAgency);
            
            if ($insertQuery->execute()) {
                echo "✅ Usuario ID $id: Creado '$name' (Rol: $roleId)\n";
                $usersCreated++;
            } else {
                echo "❌ Usuario ID $id: Error al insertar - " . $insertQuery->error . "\n";
                $errors[] = "Usuario $id: " . $insertQuery->error;
                continue; // Saltar asignaciones si no se creó el usuario
            }
            $insertQuery->close();
        }
        
        // Asignar agencias
        if (!empty($agencies)) {
            // Eliminar asignaciones existentes
            $deleteQuery = $mysqli->prepare("DELETE FROM agency_user WHERE IdUser = ?");
            $deleteQuery->bind_param("i", $id);
            $deleteQuery->execute();
            $deleteQuery->close();
            
            // Insertar nuevas asignaciones
            foreach ($agencies as $agencyId) {
                $assignQuery = $mysqli->prepare("INSERT INTO agency_user (IdUser, IdAgency) VALUES (?, ?)");
                $assignQuery->bind_param("ii", $id, $agencyId);
                if ($assignQuery->execute()) {
                    // Silencioso, solo mostrar si hay error
                } else {
                    echo "  ⚠️  Error asignando agencia $agencyId\n";
                }
                $assignQuery->close();
            }
            echo "  → Asignadas " . count($agencies) . " agencia(s)\n";
        }
        
        // Asignar procesos
        if (!empty($processes)) {
            // Eliminar asignaciones existentes
            $deleteQuery = $mysqli->prepare("DELETE FROM process_user WHERE IdUser = ?");
            $deleteQuery->bind_param("i", $id);
            $deleteQuery->execute();
            $deleteQuery->close();
            
            // Insertar nuevas asignaciones
            foreach ($processes as $processId) {
                $assignQuery = $mysqli->prepare("INSERT INTO process_user (IdUser, IdProcess) VALUES (?, ?)");
                $assignQuery->bind_param("ii", $id, $processId);
                if ($assignQuery->execute()) {
                    // Silencioso, solo mostrar si hay error
                } else {
                    echo "  ⚠️  Error asignando proceso $processId\n";
                }
                $assignQuery->close();
            }
            echo "  → Asignados " . count($processes) . " proceso(s)\n";
        }
        
        echo "\n";
    }
    
    // Mostrar resumen
    echo str_repeat("=", 80) . "\n";
    echo "📊 RESUMEN:\n";
    echo str_repeat("=", 80) . "\n";
    echo "✅ Usuarios creados: $usersCreated\n";
    echo "🔄 Usuarios actualizados: $usersUpdated\n";
    if (!empty($errors)) {
        echo "❌ Errores: " . count($errors) . "\n";
        foreach ($errors as $error) {
            echo "  - $error\n";
        }
    }
    
    // Mostrar todos los usuarios con sus asignaciones
    echo "\n📋 USUARIOS CREADOS:\n";
    echo str_repeat("=", 80) . "\n";
    
    $result = $mysqli->query("
        SELECT u.Id, u.Name, u.user, u.Mail, u.IdUserRol, ur.Name as RoleName, u.DefaultAgency
        FROM user u
        LEFT JOIN user_role ur ON u.IdUserRol = ur.Id
        ORDER BY u.Id
    ");
    
    while ($user = $result->fetch_assoc()) {
        $userId = $user['Id'];
        $roleName = $user['RoleName'] ?? 'Sin rol';
        
        echo sprintf("\n👤 ID %d: %s (%s)\n", $userId, $user['Name'], $user['user']);
        echo sprintf("   Email: %s | Rol: %s (ID: %d)\n", $user['Mail'], $roleName, $user['IdUserRol']);
        echo sprintf("   Agencia por defecto: %d\n", $user['DefaultAgency']);
        
        // Obtener agencias asignadas
        $agencyQuery = $mysqli->prepare("SELECT a.Id, a.Name FROM agency_user au JOIN agency a ON au.IdAgency = a.Id WHERE au.IdUser = ?");
        $agencyQuery->bind_param("i", $userId);
        $agencyQuery->execute();
        $agencyResult = $agencyQuery->get_result();
        $assignedAgencies = [];
        while ($agency = $agencyResult->fetch_assoc()) {
            $assignedAgencies[] = "{$agency['Name']} (ID: {$agency['Id']})";
        }
        $agencyQuery->close();
        
        if (!empty($assignedAgencies)) {
            echo "   Agencias asignadas: " . implode(', ', $assignedAgencies) . "\n";
        }
        
        // Obtener procesos asignados
        $processQuery = $mysqli->prepare("SELECT p.Id, p.Name FROM process_user pu JOIN process p ON pu.IdProcess = p.Id WHERE pu.IdUser = ?");
        $processQuery->bind_param("i", $userId);
        $processQuery->execute();
        $processResult = $processQuery->get_result();
        $assignedProcesses = [];
        while ($process = $processResult->fetch_assoc()) {
            $assignedProcesses[] = "{$process['Name']} (ID: {$process['Id']})";
        }
        $processQuery->close();
        
        if (!empty($assignedProcesses)) {
            echo "   Procesos asignados: " . implode(', ', $assignedProcesses) . "\n";
        }
    }
    
    $mysqli->close();
    
    echo "\n✅ Proceso completado\n";
    echo "\n🔑 CONTRASEÑAS:\n";
    echo "Todos los usuarios tienen la contraseña: 'password123'\n";
    echo "(Excepto admin: 'admin123', soporte: 'soporte123', etc.)\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
