<?php
/**
 * Script maestro para crear base de datos completa
 * 
 * Uso:
 *   php create_database_complete.php --host=localhost --user=root --pass=password --database=nexfile --port=3306 --mode=demo
 *   php create_database_complete.php --host=localhost --user=root --pass=password --database=nexfile --port=3306 --mode=minimal
 * 
 * Modos:
 *   - demo: Crea BD completa con todos los catálogos, usuarios demo, empresas y agencias
 *   - minimal: Solo crea usuarios básicos (Administrador Sistema y Soporte Técnico), sin empresas/agencias
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);
set_time_limit(600); // 10 minutos máximo

// Parsear argumentos de línea de comandos
$options = getopt('', ['host:', 'user:', 'pass:', 'database:', 'port:', 'mode:']);

$host = $options['host'] ?? 'localhost';
$user = $options['user'] ?? 'root';
$pass = $options['pass'] ?? '';
$database = $options['database'] ?? 'nexfile';
$port = isset($options['port']) ? (int)$options['port'] : 3306;
$mode = $options['mode'] ?? 'demo';

// Validar modo
if (!in_array($mode, ['demo', 'minimal'])) {
    die("❌ Modo inválido. Use 'demo' o 'minimal'\n");
}

echo "═══════════════════════════════════════════════════════════════════════════════\n";
echo "  CREAR BASE DE DATOS COMPLETA\n";
echo "═══════════════════════════════════════════════════════════════════════════════\n\n";
echo "Host: $host\n";
echo "Usuario: $user\n";
echo "Base de datos: $database\n";
echo "Puerto: $port\n";
echo "Modo: $mode\n";
echo "Fecha: " . date('Y-m-d H:i:s') . "\n\n";

// Incluir helpers
require_once __DIR__ . '/helpers/title_case_helper.php';

// Función para hashear password
function hashPassword($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}

try {
    // Conectar sin seleccionar base de datos primero
    $mysqli = new mysqli($host, $user, $pass, '', $port);
    
    if ($mysqli->connect_error) {
        die("❌ Error de conexión: " . $mysqli->connect_error . "\n");
    }
    
    echo "✅ Conectado al servidor MySQL\n\n";
    
    // Crear base de datos si no existe
    echo "📋 Paso 1: Crear base de datos...\n";
    $mysqli->query("CREATE DATABASE IF NOT EXISTS `$database` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "✅ Base de datos '$database' creada/seleccionada\n\n";
    
    // Seleccionar la base de datos
    $mysqli->select_db($database);
    
    // Deshabilitar foreign key checks temporalmente
    $mysqli->query("SET FOREIGN_KEY_CHECKS = 0");
    
    // Paso 2: Crear todas las tablas
    echo "📋 Paso 2: Crear estructura de tablas...\n";
    require_once __DIR__ . '/create_database_schema.php';
    createDatabaseSchema($mysqli);
    echo "✅ Estructura de tablas creada\n\n";
    
    // Paso 3: Insertar catálogos básicos (siempre)
    echo "📋 Paso 3: Insertar catálogos básicos...\n";
    require_once __DIR__ . '/create_database_catalogs.php';
    insertBasicCatalogs($mysqli);
    echo "✅ Catálogos básicos insertados\n\n";
    
    // Paso 4: Insertar usuarios según el modo
    echo "📋 Paso 4: Insertar usuarios...\n";
    require_once __DIR__ . '/create_database_users.php';
    
    if ($mode === 'demo') {
        insertDemoUsers($mysqli);
        echo "✅ Usuarios demo insertados\n\n";
        
        // Paso 5: Insertar empresas y agencias (solo en modo demo)
        echo "📋 Paso 5: Insertar empresas y agencias...\n";
        require_once __DIR__ . '/create_database_companies.php';
        insertDemoCompanies($mysqli);
        echo "✅ Empresas y agencias insertadas\n\n";
    } else {
        insertMinimalUsers($mysqli);
        echo "✅ Usuarios básicos insertados\n\n";
    }
    
    // Restaurar foreign key checks
    $mysqli->query("SET FOREIGN_KEY_CHECKS = 1");
    
    // Verificación final
    echo "📋 Paso 6: Verificación final...\n";
    verifyDatabase($mysqli, $mode);
    
    $mysqli->close();
    
    echo "\n";
    echo "═══════════════════════════════════════════════════════════════════════════════\n";
    echo "✅ ¡Base de datos creada exitosamente!\n";
    echo "═══════════════════════════════════════════════════════════════════════════════\n";
    
    if ($mode === 'minimal') {
        echo "\n🔑 USUARIOS CREADOS:\n";
        echo "   - Administrador Sistema (admin / admin123)\n";
        echo "   - Soporte Técnico (soporte / soporte123)\n";
    }
    
} catch (Exception $e) {
    echo "\n❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
    exit(1);
}

/**
 * Verificar estado de la base de datos
 */
function verifyDatabase($mysqli, $mode) {
    echo "\n📊 VERIFICACIÓN:\n";
    echo str_repeat("-", 80) . "\n";
    
    // Contar tablas
    $tables = $mysqli->query("SHOW TABLES");
    $tableCount = $tables->num_rows;
    echo "✅ Tablas creadas: $tableCount\n";
    
    // Contar catálogos
    $catalogs = [
        'user_role' => 'Roles',
        'customer_type' => 'Tipos de Cliente',
        'operation_type' => 'Tipos de Operación',
        'process' => 'Procesos',
        'file_status' => 'Estados de Archivo',
        'file_reasons' => 'Motivos de Archivo',
        'document_file_status' => 'Estados de Documento',
    ];
    
    foreach ($catalogs as $table => $label) {
        $result = $mysqli->query("SELECT COUNT(*) as count FROM `$table`");
        if ($result) {
            $count = $result->fetch_assoc()['count'];
            echo "✅ $label: $count registros\n";
        }
    }
    
    // Contar usuarios
    $result = $mysqli->query("SELECT COUNT(*) as count FROM `user`");
    $userCount = $result->fetch_assoc()['count'];
    echo "✅ Usuarios: $userCount registros\n";
    
    // Contar empresas y agencias (solo en modo demo)
    if ($mode === 'demo') {
        $result = $mysqli->query("SELECT COUNT(*) as count FROM `company`");
        $companyCount = $result->fetch_assoc()['count'];
        echo "✅ Empresas: $companyCount registros\n";
        
        $result = $mysqli->query("SELECT COUNT(*) as count FROM `agency`");
        $agencyCount = $result->fetch_assoc()['count'];
        echo "✅ Agencias: $agencyCount registros\n";
    }
}
