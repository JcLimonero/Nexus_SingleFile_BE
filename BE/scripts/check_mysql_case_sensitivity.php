<?php
/**
 * Verificar configuración de case sensitivity de MySQL
 */

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

$mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);

if ($mysqli->connect_error) {
    die("❌ Error: " . $mysqli->connect_error . "\n");
}

echo "=== VERIFICACIÓN DE CASE SENSITIVITY EN MYSQL ===\n\n";

// Verificar variable lower_case_table_names
$result = $mysqli->query("SHOW VARIABLES LIKE 'lower_case_table_names'");
if ($result) {
    $row = $result->fetch_assoc();
    $value = $row['Value'] ?? 'unknown';
    echo "lower_case_table_names: $value\n";
    echo "\n";
    
    if ($value == '1' || $value == '2') {
        echo "⚠️  MySQL está configurado para convertir nombres a minúsculas\n";
        echo "   Esto significa que los nombres se almacenan en minúsculas\n";
        echo "   pero podemos usar PascalCase en las queries con backticks\n\n";
    }
}

// Probar crear una tabla con PascalCase
echo "🧪 Probando creación de tabla con PascalCase...\n";
$testTable = 'TestPascalCaseTable';
$mysqli->query("DROP TABLE IF EXISTS `$testTable`");
$result = $mysqli->query("CREATE TABLE `$testTable` (id INT PRIMARY KEY)");

if ($result) {
    // Verificar cómo se almacenó
    $check = $mysqli->query("SHOW TABLES LIKE '$testTable'");
    if ($check && $check->num_rows > 0) {
        $row = $check->fetch_array();
        $storedName = $row[0];
        echo "  Tabla creada como: $storedName\n";
        
        if ($storedName === strtolower($testTable)) {
            echo "  ⚠️  MySQL convirtió el nombre a minúsculas\n";
            echo "  💡 Solución: Usar backticks en queries, nombres se almacenan en minúsculas\n";
        } else {
            echo "  ✅ El nombre se mantuvo en PascalCase\n";
        }
    }
    
    $mysqli->query("DROP TABLE IF EXISTS `$testTable`");
}

// Verificar tablas actuales
echo "\n📋 Verificando nombres actuales de tablas...\n";
$result = $mysqli->query("SHOW TABLES");
$tables = [];
while ($row = $result->fetch_array()) {
    $tables[] = $row[0];
}

echo "Total de tablas: " . count($tables) . "\n";
echo "Ejemplos de nombres actuales:\n";
foreach (array_slice($tables, 0, 10) as $table) {
    echo "  - $table\n";
}

$mysqli->close();
