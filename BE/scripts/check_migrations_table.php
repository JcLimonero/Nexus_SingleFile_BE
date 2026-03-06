<?php
/**
 * Verificar estructura y contenido de la tabla migrations
 */

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

$mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);

if ($mysqli->connect_error) {
    die("❌ Error: " . $mysqli->connect_error . "\n");
}

echo "=== INFORMACIÓN SOBRE LA TABLA migrations ===\n\n";

// Verificar si existe la tabla
$result = $mysqli->query("SHOW TABLES LIKE 'migrations'");
if ($result && $result->num_rows > 0) {
    echo "✅ La tabla 'migrations' existe\n\n";
    
    // Mostrar estructura
    echo "📋 ESTRUCTURA DE LA TABLA:\n";
    echo str_repeat("=", 60) . "\n";
    $result = $mysqli->query("DESCRIBE migrations");
    while ($row = $result->fetch_assoc()) {
        echo sprintf("%-20s %-20s %-10s %-10s\n", 
            $row['Field'], 
            $row['Type'], 
            $row['Null'], 
            $row['Key']
        );
    }
    
    // Mostrar contenido
    echo "\n📊 CONTENIDO DE LA TABLA:\n";
    echo str_repeat("=", 60) . "\n";
    $result = $mysqli->query("SELECT * FROM migrations ORDER BY time DESC LIMIT 20");
    if ($result && $result->num_rows > 0) {
        echo sprintf("%-50s %-20s\n", "Migration", "Time");
        echo str_repeat("-", 70) . "\n";
        while ($row = $result->fetch_assoc()) {
            echo sprintf("%-50s %-20s\n", 
                $row['version'] ?? $row['migration'] ?? 'N/A', 
                $row['time'] ?? 'N/A'
            );
        }
        echo "\nTotal de migraciones registradas: " . $result->num_rows . "\n";
    } else {
        echo "La tabla está vacía (no hay migraciones registradas aún)\n";
    }
    
    echo "\n💡 PROPÓSITO:\n";
    echo str_repeat("=", 60) . "\n";
    echo "La tabla 'migrations' es utilizada por CodeIgniter para:\n";
    echo "1. Rastrear qué archivos de migración ya se han ejecutado\n";
    echo "2. Evitar ejecutar la misma migración dos veces\n";
    echo "3. Mantener un historial de cambios en la base de datos\n";
    echo "4. Permitir rollback de migraciones si es necesario\n\n";
    echo "Cuando ejecutas 'php spark migrate', CodeIgniter:\n";
    echo "- Lee los archivos de migración en app/Database/Migrations/\n";
    echo "- Compara con los registros en la tabla 'migrations'\n";
    echo "- Ejecuta solo las migraciones que aún no se han aplicado\n";
    echo "- Registra las migraciones ejecutadas en esta tabla\n";
    
} else {
    echo "⚠️  La tabla 'migrations' no existe\n";
    echo "Se creará automáticamente la primera vez que ejecutes 'php spark migrate'\n";
}

$mysqli->close();
