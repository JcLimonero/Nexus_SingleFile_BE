<?php
/**
 * Script para probar la conexión usando mysqli con el mismo estilo que CodeIgniter
 * Esto ayuda a identificar el problema de autenticación
 */

echo "=== Prueba de Conexión estilo CodeIgniter ===\n\n";

$hostname = '192.168.190.140';
$username = 'vgd_testing';
$password = '00@DealerSolutions';
$database = 'NexFile_db';
$port = 3306;

echo "Configuración:\n";
echo "  Hostname: $hostname\n";
echo "  Usuario: $username\n";
echo "  Base de datos: $database\n";
echo "  Puerto: $port\n\n";

echo "Intentando conectar usando mysqli_init() (como CodeIgniter)...\n";

try {
    // Inicializar mysqli como lo hace CodeIgniter
    $mysqli = mysqli_init();
    
    // Configurar opciones como CodeIgniter
    mysqli_report(MYSQLI_REPORT_ALL & ~MYSQLI_REPORT_INDEX);
    $mysqli->options(MYSQLI_OPT_CONNECT_TIMEOUT, 10);
    
    // Intentar conectar
    $connected = @$mysqli->real_connect(
        $hostname,
        $username,
        $password,
        $database,
        $port,
        '',
        0  // Sin flags especiales
    );
    
    if (!$connected) {
        $error = mysqli_connect_error();
        $errno = mysqli_connect_errno();
        
        echo "❌ Error de conexión:\n";
        echo "  Mensaje: $error\n";
        echo "  Código: $errno\n\n";
        
        if (strpos($error, 'auth_gssapi_client') !== false || 
            strpos($error, 'caching_sha2_password') !== false) {
            echo "⚠️  PROBLEMA IDENTIFICADO: Método de autenticación incompatible\n";
            echo "\n💡 SOLUCIÓN REQUERIDA:\n";
            echo "   El usuario '$username' en el servidor MySQL necesita cambiar\n";
            echo "   su método de autenticación a mysql_native_password.\n\n";
            echo "   Ejecuta en el servidor MySQL ($hostname):\n";
            echo "   ALTER USER '$username'@'%' IDENTIFIED WITH mysql_native_password BY '$password';\n";
            echo "   FLUSH PRIVILEGES;\n\n";
            echo "   O si el usuario está restringido a una IP específica:\n";
            echo "   ALTER USER '$username'@'192.168.190.140' IDENTIFIED WITH mysql_native_password BY '$password';\n";
            echo "   FLUSH PRIVILEGES;\n";
        }
        
        exit(1);
    }
    
    echo "✅ Conexión exitosa!\n\n";
    
    // Probar consulta
    $result = $mysqli->query("SELECT DATABASE() as db, USER() as user");
    if ($result) {
        $row = $result->fetch_assoc();
        echo "Base de datos: " . $row['db'] . "\n";
        echo "Usuario: " . $row['user'] . "\n\n";
    }
    
    // Probar consulta a User
    echo "Probando consulta a tabla User...\n";
    $result = $mysqli->query("SELECT COUNT(*) as total FROM User LIMIT 1");
    if ($result) {
        $row = $result->fetch_assoc();
        echo "✅ Tabla User accesible. Total de registros: " . $row['total'] . "\n";
    }
    
    $mysqli->close();
    
    echo "\n✅ Todas las pruebas pasaron!\n";
    echo "   La conexión funciona correctamente.\n";
    
} catch (Exception $e) {
    echo "❌ Excepción: " . $e->getMessage() . "\n";
    exit(1);
}

