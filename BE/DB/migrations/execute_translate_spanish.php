<?php
/**
 * Traducir nombres en español a inglés
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== TRADUCCIÓN DE NOMBRES EN ESPAÑOL A INGLÉS ===\n\n";

$configFile = __DIR__ . '/../../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

echo "Base de datos: {$db['database']}\n";
echo "Host: {$db['hostname']}\n\n";

// Mapeo de tablas
$tableRenameMap = [
    'expedientes_corregir' => 'files_to_correct',
    'file_pld_beneficiario_final' => 'file_pld_beneficial_owner',
    'user_rol' => 'user_role',
];

// Mapeo de columnas
$columnRenameMap = [
    'order_by_car' => [
        'Modelo' => 'Model',
        'Asesor' => 'Advisor',
    ],
];

try {
    $mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);
    
    if ($mysqli->connect_error) {
        die("❌ Error de conexión: " . $mysqli->connect_error . "\n");
    }
    
    echo "✅ Conectado a la base de datos\n\n";
    
    // Renombrar tablas
    echo "🔄 Renombrando tablas...\n";
    echo str_repeat("-", 60) . "\n";
    
    $renamedTables = 0;
    foreach ($tableRenameMap as $oldName => $newName) {
        $result = $mysqli->query("SHOW TABLES LIKE '$oldName'");
        if ($result && $result->num_rows > 0) {
            echo "Renombrando tabla: $oldName → $newName... ";
            if ($mysqli->query("RENAME TABLE `$oldName` TO `$newName`")) {
                echo "✅\n";
                $renamedTables++;
            } else {
                echo "❌ Error: " . $mysqli->error . "\n";
            }
        } else {
            echo "⚠️  Tabla $oldName no existe (saltando)\n";
        }
    }
    
    // Renombrar columnas
    echo "\n🔄 Renombrando columnas...\n";
    echo str_repeat("-", 60) . "\n";
    
    $renamedColumns = 0;
    foreach ($columnRenameMap as $tableName => $columns) {
        foreach ($columns as $oldColumn => $newColumn) {
            // Obtener información de la columna
            $result = $mysqli->query("SHOW COLUMNS FROM `$tableName` WHERE Field = '$oldColumn'");
            if ($result && $result->num_rows > 0) {
                $colInfo = $result->fetch_assoc();
                $colType = $colInfo['Type'];
                $isNull = $colInfo['Null'] === 'YES' ? 'NULL' : 'NOT NULL';
                $default = $colInfo['Default'] !== null ? "DEFAULT '{$colInfo['Default']}'" : '';
                
                echo "Renombrando columna: $tableName.$oldColumn → $tableName.$newColumn... ";
                $sql = "ALTER TABLE `$tableName` CHANGE COLUMN `$oldColumn` `$newColumn` {$colType} {$isNull} {$default}";
                
                if ($mysqli->query($sql)) {
                    echo "✅\n";
                    $renamedColumns++;
                } else {
                    echo "❌ Error: " . $mysqli->error . "\n";
                }
            } else {
                echo "⚠️  Columna $tableName.$oldColumn no existe (saltando)\n";
            }
        }
    }
    
    echo "\n" . str_repeat("=", 60) . "\n";
    echo "📊 RESUMEN:\n";
    echo str_repeat("=", 60) . "\n";
    echo "✅ Tablas renombradas: $renamedTables\n";
    echo "✅ Columnas renombradas: $renamedColumns\n";
    
    $mysqli->close();
    
    echo "\n✅ Proceso completado\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
