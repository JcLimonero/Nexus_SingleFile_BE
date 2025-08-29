<?php
/**
 * Script de prueba para verificar la tabla de logs de actividad
 * Ejecutar: php scripts/test_logs_table.php
 */

echo "=== Probando Tabla de Logs de Actividad ===\n\n";

// Configuración de la base de datos (ajustar según tu configuración)
$host = 'localhost';
$dbname = 'singlefile_db'; // Nombre de la base de datos del proyecto
$username = 'root';         // Usuario de BD
$password = '00@Limonero';  // Contraseña de BD

try {
    // Conectar a la base de datos
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✅ Conectado a la base de datos: $dbname\n\n";
    
    // 1. Verificar que la tabla existe
    echo "1. Verificando existencia de la tabla...\n";
    $stmt = $pdo->query("SHOW TABLES LIKE 'user_activity_logs'");
    if ($stmt->rowCount() > 0) {
        echo "   ✅ Tabla 'user_activity_logs' existe\n";
    } else {
        echo "   ❌ Tabla 'user_activity_logs' NO existe\n";
        echo "   💡 Ejecuta primero el script de creación de tabla\n";
        exit(1);
    }
    
    // 2. Mostrar estructura de la tabla
    echo "\n2. Estructura de la tabla:\n";
    $stmt = $pdo->query("DESCRIBE user_activity_logs");
    echo "   " . str_repeat("-", 60) . "\n";
    printf("   %-20s %-15s %-10s %-8s %-8s\n", "Campo", "Tipo", "Null", "Key", "Default");
    echo "   " . str_repeat("-", 60) . "\n";
    
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        printf("   %-20s %-15s %-10s %-8s %-8s\n", 
            $row['Field'], 
            $row['Type'], 
            $row['Null'], 
            $row['Key'], 
            $row['Default'] ?? 'NULL'
        );
    }
    
    // 3. Contar registros existentes
    echo "\n3. Contando registros existentes...\n";
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM user_activity_logs");
    $count = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    echo "   📊 Total de registros: $count\n";
    
    // 4. Insertar registros de prueba
    echo "\n4. Insertando registros de prueba...\n";
    
    $testLogs = [
        [
            'user_id' => 'test_user_1',
            'username' => 'Usuario Prueba 1',
            'action' => 'LOGIN',
            'description' => 'Inicio de sesión exitoso',
            'change_details' => 'Usuario inició sesión en el sistema desde navegador web'
        ],
        [
            'user_id' => 'test_user_2',
            'username' => 'Usuario Prueba 2',
            'action' => 'CREATE',
            'description' => 'Creación de nuevo documento',
            'change_details' => 'Creación de documento con campos: nombre, tipo, contenido'
        ],
        [
            'user_id' => 'test_user_1',
            'username' => 'Usuario Prueba 1',
            'action' => 'UPDATE',
            'description' => 'Actualización de perfil',
            'change_details' => 'Actualización de perfil en campos: nombre, email, teléfono'
        ]
    ];
    
    $insertSql = "
    INSERT INTO `user_activity_logs` (
        `user_id`, `username`, `action`, `description`, 
        `change_details`, `created_at`, `updated_at`
    ) VALUES (
        :user_id, :username, :action, :description,
        :change_details, NOW(), NOW()
    )
    ";
    
    $stmt = $pdo->prepare($insertSql);
    $inserted = 0;
    
    foreach ($testLogs as $log) {
        try {
            $stmt->execute($log);
            $inserted++;
            echo "   ✅ Registro insertado: {$log['action']} por {$log['username']}\n";
        } catch (Exception $e) {
            echo "   ❌ Error insertando: {$log['action']} - {$e->getMessage()}\n";
        }
    }
    
    echo "   📝 Total de registros insertados: $inserted\n";
    
    // 5. Probar consultas
    echo "\n5. Probando consultas...\n";
    
    // Contar total después de inserción
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM user_activity_logs");
    $newCount = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    echo "   📊 Total después de inserción: $newCount\n";
    
    // Buscar por usuario
    $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM user_activity_logs WHERE user_id = ?");
    $stmt->execute(['test_user_1']);
    $userCount = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    echo "   👤 Logs del usuario test_user_1: $userCount\n";
    
    // Buscar por acción
    $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM user_activity_logs WHERE action = ?");
    $stmt->execute(['LOGIN']);
    $actionCount = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    echo "   🔍 Logs de acción LOGIN: $actionCount\n";
    
    // Buscar por detalles del cambio
    $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM user_activity_logs WHERE change_details LIKE ?");
    $stmt->execute(['%perfil%']);
    $detailsCount = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    echo "   📝 Logs con detalles que contienen 'perfil': $detailsCount\n";
    
    // 6. Mostrar algunos registros
    echo "\n6. Mostrando últimos 3 registros:\n";
    $stmt = $pdo->query("
        SELECT user_id, username, action, description, change_details, created_at 
        FROM user_activity_logs 
        ORDER BY created_at DESC 
        LIMIT 3
    ");
    
    echo "   " . str_repeat("-", 100) . "\n";
    printf("   %-15s %-20s %-10s %-25s %-30s %-20s\n", "User ID", "Username", "Action", "Description", "Change Details", "Created At");
    echo "   " . str_repeat("-", 100) . "\n";
    
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        printf("   %-15s %-20s %-10s %-25s %-30s %-20s\n", 
            substr($row['user_id'], 0, 14),
            substr($row['username'], 0, 19),
            $row['action'],
            substr($row['description'], 0, 24),
            substr($row['change_details'], 0, 29),
            $row['created_at']
        );
    }
    
    echo "\n🎉 ¡Pruebas completadas exitosamente!\n";
    echo "La tabla de logs de actividad está funcionando correctamente.\n";
    
} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "\n💡 Asegúrate de:\n";
    echo "1. Tener MySQL/MariaDB ejecutándose\n";
    echo "2. Tener la base de datos '$dbname' creada\n";
    echo "3. Tener las credenciales correctas\n";
    echo "4. Haber ejecutado el script de creación de tabla\n";
}
