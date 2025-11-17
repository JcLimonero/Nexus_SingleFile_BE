<?php
/**
 * Script para probar la conexión usando CodeIgniter Database
 * Simula cómo CodeIgniter se conecta a la base de datos
 */

// Cargar CodeIgniter
define('ROOTPATH', __DIR__ . '/../');
require_once ROOTPATH . 'vendor/autoload.php';

echo "=== Prueba de Conexión CodeIgniter ===\n\n";

try {
    // Cargar configuración de CodeIgniter
    $config = new \Config\Database();
    
    echo "Configuración cargada:\n";
    echo "  Hostname: " . $config->default['hostname'] . "\n";
    echo "  Usuario: " . $config->default['username'] . "\n";
    echo "  Base de datos: " . $config->default['database'] . "\n";
    echo "  Puerto: " . $config->default['port'] . "\n\n";
    
    echo "Intentando conectar usando CodeIgniter Database...\n";
    
    // Intentar conectar usando CodeIgniter
    $db = \Config\Database::connect();
    
    echo "✅ Conexión exitosa usando CodeIgniter!\n\n";
    
    // Probar una consulta simple
    $query = $db->query("SELECT DATABASE() as current_db, USER() as current_user");
    $result = $query->getRowArray();
    
    echo "Información de conexión:\n";
    echo "  Base de datos actual: " . $result['current_db'] . "\n";
    echo "  Usuario actual: " . $result['current_user'] . "\n\n";
    
    // Probar consulta a la tabla User
    echo "Probando consulta a tabla User...\n";
    $userQuery = $db->table('User')->limit(1)->get();
    if ($userQuery) {
        echo "✅ Consulta a tabla User exitosa!\n";
        $user = $userQuery->getRowArray();
        if ($user) {
            echo "  Usuario encontrado: " . ($user['Name'] ?? 'N/A') . "\n";
        }
    }
    
    $db->close();
    
    echo "\n✅ Todas las pruebas pasaron correctamente!\n";
    
} catch (\Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "\nDetalles del error:\n";
    echo "  Tipo: " . get_class($e) . "\n";
    
    if ($e->getPrevious()) {
        echo "  Error anterior: " . $e->getPrevious()->getMessage() . "\n";
    }
    
    // Verificar si es el error de autenticación
    if (strpos($e->getMessage(), 'auth_gssapi_client') !== false || 
        strpos($e->getMessage(), 'caching_sha2_password') !== false) {
        echo "\n⚠️  PROBLEMA DETECTADO: Método de autenticación incompatible\n";
        echo "\n💡 SOLUCIÓN:\n";
        echo "   Ejecuta en el servidor MySQL (192.168.190.140):\n";
        echo "   ALTER USER 'vgd_testing'@'%' IDENTIFIED WITH mysql_native_password BY '00@DealerSolutions';\n";
        echo "   FLUSH PRIVILEGES;\n";
    }
    
    exit(1);
}

