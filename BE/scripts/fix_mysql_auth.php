<?php
/**
 * Script para solucionar el error de autenticación MySQL
 * Error: "The server requested authentication method unknown to the client [auth_gssapi_client]"
 * 
 * Este script intenta cambiar el método de autenticación del usuario a mysql_native_password
 * que es compatible con PHP MySQLi
 * 
 * Uso: php scripts/fix_mysql_auth.php
 */

// Configuración - Ajusta según tu entorno
$hostname = 'localhost';
$username = 'root';
$password = '00@Limonero';
$targetUser = 'root';
$targetHost = 'localhost';

echo "=== Solucionando problema de autenticación MySQL ===\n\n";

try {
    // Conectar como administrador
    $mysqli = new mysqli($hostname, $username, $password);
    
    if ($mysqli->connect_error) {
        die("Error de conexión: " . $mysqli->connect_error . "\n");
    }
    
    echo "✓ Conectado a MySQL\n";
    
    // Verificar método de autenticación actual
    $result = $mysqli->query("SELECT user, host, plugin FROM mysql.user WHERE user = '$targetUser' AND host = '$targetHost'");
    
    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo "Método de autenticación actual: " . ($row['plugin'] ?? 'N/A') . "\n\n";
        
        // Cambiar a mysql_native_password
        $sql = "ALTER USER '$targetUser'@'$targetHost' IDENTIFIED WITH mysql_native_password BY '$password'";
        
        if ($mysqli->query($sql)) {
            echo "✓ Método de autenticación cambiado a mysql_native_password\n";
            
            // Aplicar cambios
            $mysqli->query("FLUSH PRIVILEGES");
            echo "✓ Privilegios actualizados\n\n";
            
            // Verificar cambio
            $result = $mysqli->query("SELECT user, host, plugin FROM mysql.user WHERE user = '$targetUser' AND host = '$targetHost'");
            if ($result && $result->num_rows > 0) {
                $row = $result->fetch_assoc();
                echo "Nuevo método de autenticación: " . ($row['plugin'] ?? 'N/A') . "\n";
            }
        } else {
            echo "✗ Error al cambiar método de autenticación: " . $mysqli->error . "\n";
        }
    } else {
        echo "✗ Usuario '$targetUser'@'$targetHost' no encontrado\n";
    }
    
    $mysqli->close();
    echo "\n✓ Proceso completado\n";
    
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
    exit(1);
}

