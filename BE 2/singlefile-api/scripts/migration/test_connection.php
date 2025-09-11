<?php

require_once __DIR__ . '/config.php';

echo "🧪 Probando conexión a MySQL...\n\n";

try {
    $mysql_config = getConfig('mysql');
    
    echo "📋 Configuración MySQL:\n";
    echo "  Host: " . $mysql_config['host'] . "\n";
    echo "  Puerto: " . $mysql_config['port'] . "\n";
    echo "  Base de datos: " . $mysql_config['database'] . "\n";
    echo "  Usuario: " . $mysql_config['username'] . "\n";
    echo "  Contraseña: [OCULTA]\n\n";
    
    $dsn = "mysql:host={$mysql_config['host']};port={$mysql_config['port']};dbname={$mysql_config['database']};charset=utf8mb4";
    
    echo "🔌 Intentando conectar...\n";
    $pdo = new PDO($dsn, $mysql_config['username'], $mysql_config['password']);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✅ Conexión exitosa!\n";
    
    // Probar query
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM Agency");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "📊 Registros en tabla Agency: " . $result['total'] . "\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
