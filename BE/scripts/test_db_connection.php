<?php
/**
 * Script para validar la conexión a la base de datos
 * Lee la configuración desde el archivo database-config.json
 * 
 * Uso: php scripts/test_db_connection.php
 */

echo "=== Validación de Conexión a Base de Datos ===\n\n";

// Obtener la ruta del archivo de configuración
$configFile = __DIR__ . '/../app/Config/database-config.json';

if (!file_exists($configFile)) {
    echo "❌ Error: No se encontró el archivo de configuración: $configFile\n";
    exit(1);
}

// Cargar configuración desde el archivo JSON
$configContent = file_get_contents($configFile);
$config = json_decode($configContent, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo "❌ Error al decodificar el archivo JSON: " . json_last_error_msg() . "\n";
    exit(1);
}

if (!isset($config['database'])) {
    echo "❌ Error: No se encontró la configuración de base de datos en el archivo\n";
    exit(1);
}

$db = $config['database'];
$hostname = $db['hostname'] ?? 'localhost';
$port = $db['port'] ?? 3306;
$username = $db['username'] ?? 'root';
$password = $db['password'] ?? '';
$database = $db['database'] ?? '';

echo "Datos de conexión (desde archivo de configuración):\n";
echo "  Servidor: $hostname\n";
echo "  Puerto: $port\n";
echo "  Usuario: $username\n";
echo "  Base de datos: $database\n\n";

echo "Intentando conectar...\n";

try {
    // Intentar conexión
    $mysqli = @new mysqli($hostname, $username, $password, $database, $port);
    
    // Verificar errores de conexión
    if ($mysqli->connect_error) {
        echo "❌ Error de conexión: " . $mysqli->connect_error . "\n";
        echo "   Código de error: " . $mysqli->connect_errno . "\n\n";
        
        // Información adicional sobre el error
        if ($mysqli->connect_errno == 1045) {
            echo "   ⚠️  Error de autenticación: Usuario o contraseña incorrectos\n";
        } elseif ($mysqli->connect_errno == 2002) {
            echo "   ⚠️  Error de conexión: No se puede conectar al servidor\n";
            echo "   💡 Verifica que el servidor esté accesible desde esta ubicación\n";
        } elseif (strpos($mysqli->connect_error, 'auth_gssapi_client') !== false || 
                   strpos($mysqli->connect_error, 'caching_sha2_password') !== false) {
            echo "   ⚠️  Error de método de autenticación: MySQL requiere mysql_native_password\n";
            echo "   💡 Solución: Ejecuta en MySQL:\n";
            echo "      ALTER USER '$username'@'%' IDENTIFIED WITH mysql_native_password BY '$password';\n";
            echo "      FLUSH PRIVILEGES;\n";
        }
        
        exit(1);
    }
    
    echo "✅ Conexión exitosa!\n\n";
    
    // Obtener información del servidor
    echo "Información del servidor:\n";
    echo "  Versión MySQL: " . $mysqli->server_info . "\n";
    echo "  Versión del cliente: " . $mysqli->client_info . "\n";
    echo "  Host info: " . $mysqli->host_info . "\n";
    echo "  Protocolo: " . $mysqli->protocol_version . "\n\n";
    
    // Verificar que la base de datos existe y es accesible
    echo "Verificando acceso a la base de datos '$database'...\n";
    
    $result = $mysqli->query("SELECT DATABASE() as current_db");
    if ($result) {
        $row = $result->fetch_assoc();
        echo "  Base de datos actual: " . $row['current_db'] . "\n";
    }
    
    // Listar algunas tablas para verificar acceso
    echo "\nListando tablas disponibles...\n";
    $result = $mysqli->query("SHOW TABLES");
    if ($result) {
        $tableCount = 0;
        while ($row = $result->fetch_array()) {
            $tableCount++;
            if ($tableCount <= 10) {
                echo "  - " . $row[0] . "\n";
            }
        }
        if ($tableCount > 10) {
            echo "  ... y " . ($tableCount - 10) . " tablas más\n";
        }
        echo "\nTotal de tablas: $tableCount\n";
    } else {
        echo "  ⚠️  No se pudieron listar las tablas: " . $mysqli->error . "\n";
    }
    
    // Verificar permisos del usuario
    echo "\nVerificando permisos del usuario...\n";
    $result = $mysqli->query("SHOW GRANTS FOR CURRENT_USER()");
    if ($result) {
        while ($row = $result->fetch_array()) {
            echo "  " . $row[0] . "\n";
        }
    }
    
    // Cerrar conexión
    $mysqli->close();
    
    echo "\n✅ Validación completada exitosamente!\n";
    echo "   La conexión a la base de datos funciona correctamente.\n";
    echo "   Las APIs deberían poder conectarse sin problemas.\n";
    
} catch (Exception $e) {
    echo "❌ Excepción: " . $e->getMessage() . "\n";
    exit(1);
}

