<?php
/**
 * Verificar si hay vistas que puedan estar interfiriendo y proporcionar SQL exacto
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== VERIFICACIÓN DE VISTAS Y SQL PARA ACTUALIZAR MAIL ===\n\n";

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

try {
    $mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);
    
    if ($mysqli->connect_error) {
        die("❌ Error de conexión: " . $mysqli->connect_error . "\n");
    }
    
    echo "✅ Conectado a la base de datos\n\n";
    
    // Verificar si hay vistas relacionadas con 'user'
    echo "👁️  VISTAS RELACIONADAS CON 'user':\n";
    echo str_repeat("=", 80) . "\n";
    $views = $mysqli->query("
        SELECT TABLE_NAME, VIEW_DEFINITION
        FROM INFORMATION_SCHEMA.VIEWS
        WHERE TABLE_SCHEMA = '{$db['database']}'
        AND (TABLE_NAME LIKE '%user%' OR VIEW_DEFINITION LIKE '%user%')
    ");
    
    if ($views && $views->num_rows > 0) {
        echo "⚠️  Se encontraron vistas que podrían estar interfiriendo:\n\n";
        while ($view = $views->fetch_assoc()) {
            echo "Vista: {$view['TABLE_NAME']}\n";
            echo "Definición: " . substr($view['VIEW_DEFINITION'], 0, 200) . "...\n\n";
        }
    } else {
        echo "✅ No hay vistas relacionadas con 'user'\n";
    }
    
    echo "\n";
    
    // Obtener todos los usuarios con sus emails actuales
    echo "📋 USUARIOS Y SUS EMAILS ACTUALES:\n";
    echo str_repeat("=", 80) . "\n";
    $users = $mysqli->query("SELECT Id, Name, Mail FROM user ORDER BY Id");
    if ($users && $users->num_rows > 0) {
        echo sprintf("%-5s %-40s %-50s\n", "ID", "Nombre", "Email");
        echo str_repeat("-", 95) . "\n";
        while ($user = $users->fetch_assoc()) {
            echo sprintf("%-5s %-40s %-50s\n", 
                $user['Id'], 
                substr($user['Name'], 0, 38),
                $user['Mail'] ?? 'NULL'
            );
        }
    }
    
    echo "\n\n";
    
    // Proporcionar SQL exacto para actualizar
    echo "💡 SQL PARA ACTUALIZAR EMAIL:\n";
    echo str_repeat("=", 80) . "\n";
    echo "Para actualizar el email de un usuario específico, usa:\n\n";
    echo "UPDATE `user` SET `Mail` = 'nuevo_email@nexusqtech.com', `UpdateDate` = NOW() WHERE `Id` = [ID_DEL_USUARIO];\n\n";
    echo "Ejemplo para el usuario con ID 1:\n";
    echo "UPDATE `user` SET `Mail` = 'admin@nexusqtech.com', `UpdateDate` = NOW() WHERE `Id` = 1;\n\n";
    
    echo "Para actualizar múltiples usuarios a la vez:\n";
    echo "UPDATE `user` SET `Mail` = REPLACE(`Mail`, '@sistema.com', '@nexusqtech.com'), `UpdateDate` = NOW() WHERE `Mail` LIKE '%@sistema.com';\n\n";
    
    echo "⚠️  IMPORTANTE:\n";
    echo "   - Asegúrate de estar editando la tabla 'user' y NO una vista\n";
    echo "   - Verifica que el campo 'Mail' no esté en modo solo lectura en tu herramienta\n";
    echo "   - Si usas phpMyAdmin, asegúrate de estar en la pestaña 'SQL' o 'Editar'\n";
    echo "   - Si usas MySQL Workbench, verifica que no haya una transacción pendiente\n";
    echo "   - Si usas DBeaver u otra herramienta, verifica los permisos de edición\n\n";
    
    // Verificar si hay algún problema con el charset del campo Mail
    echo "🔤 VERIFICACIÓN DE CHARSET DEL CAMPO MAIL:\n";
    echo str_repeat("=", 80) . "\n";
    $fieldInfo = $mysqli->query("
        SELECT 
            COLUMN_NAME,
            CHARACTER_SET_NAME,
            COLLATION_NAME,
            COLUMN_TYPE
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = '{$db['database']}'
        AND TABLE_NAME = 'user'
        AND COLUMN_NAME = 'Mail'
    ")->fetch_assoc();
    
    if ($fieldInfo) {
        echo "Campo: {$fieldInfo['COLUMN_NAME']}\n";
        echo "Tipo: {$fieldInfo['COLUMN_TYPE']}\n";
        echo "Charset: " . ($fieldInfo['CHARACTER_SET_NAME'] ?? 'N/A') . "\n";
        echo "Collation: " . ($fieldInfo['COLLATION_NAME'] ?? 'N/A') . "\n";
    }
    
    echo "\n";
    
    // Crear un script SQL listo para usar
    echo "📝 SCRIPT SQL LISTO PARA EJECUTAR:\n";
    echo str_repeat("=", 80) . "\n";
    echo "-- Actualizar email de un usuario específico\n";
    echo "-- Reemplaza [ID] y [NUEVO_EMAIL] con los valores correctos\n";
    echo "UPDATE `user` SET `Mail` = '[NUEVO_EMAIL]', `UpdateDate` = NOW() WHERE `Id` = [ID];\n\n";
    
    echo "-- Ejemplo: Actualizar email del usuario con ID 1\n";
    echo "-- UPDATE `user` SET `Mail` = 'admin@nexusqtech.com', `UpdateDate` = NOW() WHERE `Id` = 1;\n\n";
    
    echo "-- Verificar el cambio\n";
    echo "-- SELECT Id, Name, Mail FROM `user` WHERE `Id` = [ID];\n\n";
    
    $mysqli->close();
    
    echo "✅ Verificación completada\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
