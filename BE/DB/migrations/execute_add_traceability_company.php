<?php
/**
 * Agregar columnas de trazabilidad a la tabla company
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== AGREGAR COLUMNAS DE TRAZABILIDAD A COMPANY ===\n\n";

$configFile = __DIR__ . '/../../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

echo "Base de datos: {$db['database']}\n";
echo "Host: {$db['hostname']}\n\n";

try {
    $mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);
    
    if ($mysqli->connect_error) {
        die("❌ Error de conexión: " . $mysqli->connect_error . "\n");
    }
    
    echo "✅ Conectado a la base de datos\n\n";
    
    // Verificar columnas existentes
    $result = $mysqli->query("SHOW COLUMNS FROM company");
    $existingColumns = [];
    while ($row = $result->fetch_assoc()) {
        $existingColumns[] = $row['Field'];
    }
    
    echo "🔍 Verificando columnas existentes...\n";
    echo "Columnas actuales: " . implode(', ', $existingColumns) . "\n\n";
    
    // Agregar columnas que faltan
    $columnsToAdd = [
        'RegistrationDate' => "ALTER TABLE `company` ADD COLUMN `RegistrationDate` TIMESTAMP NULL DEFAULT NULL AFTER `name`",
        'UpdateDate' => "ALTER TABLE `company` ADD COLUMN `UpdateDate` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP AFTER `RegistrationDate`",
        'IdLastUserUpdate' => "ALTER TABLE `company` ADD COLUMN `IdLastUserUpdate` BIGINT NULL DEFAULT NULL AFTER `UpdateDate`",
        'Enabled' => "ALTER TABLE `company` ADD COLUMN `Enabled` TINYINT DEFAULT 1 AFTER `IdLastUserUpdate`",
    ];
    
    echo "🔄 Agregando columnas...\n";
    echo str_repeat("-", 60) . "\n";
    
    $columnsAdded = 0;
    foreach ($columnsToAdd as $columnName => $sql) {
        if (!in_array($columnName, $existingColumns)) {
            echo "Agregando columna: $columnName... ";
            if ($mysqli->query($sql)) {
                echo "✅\n";
                $columnsAdded++;
            } else {
                echo "❌ Error: " . $mysqli->error . "\n";
            }
        } else {
            echo "⚠️  Columna $columnName ya existe (saltando)\n";
        }
    }
    
    // Actualizar registros existentes
    echo "\n🔄 Actualizando registros existentes...\n";
    echo str_repeat("-", 60) . "\n";
    
    $updateQuery = "UPDATE `company` SET `RegistrationDate` = NOW() WHERE `RegistrationDate` IS NULL";
    if ($mysqli->query($updateQuery)) {
        $affected = $mysqli->affected_rows;
        echo "✅ Actualizados $affected registros con RegistrationDate\n";
    }
    
    $updateQuery = "UPDATE `company` SET `UpdateDate` = NOW() WHERE `UpdateDate` IS NULL";
    if ($mysqli->query($updateQuery)) {
        $affected = $mysqli->affected_rows;
        echo "✅ Actualizados $affected registros con UpdateDate\n";
    }
    
    $updateQuery = "UPDATE `company` SET `Enabled` = 1 WHERE `Enabled` IS NULL";
    if ($mysqli->query($updateQuery)) {
        $affected = $mysqli->affected_rows;
        echo "✅ Actualizados $affected registros con Enabled = 1\n";
    }
    
    // Verificar estructura final
    echo "\n🔍 Verificando estructura final...\n";
    echo str_repeat("=", 80) . "\n";
    $result = $mysqli->query("DESCRIBE company");
    printf("%-25s %-25s %-10s %-10s\n", "Campo", "Tipo", "Null", "Default");
    echo str_repeat("-", 80) . "\n";
    while ($row = $result->fetch_assoc()) {
        printf("%-25s %-25s %-10s %-10s\n", 
            $row['Field'], 
            $row['Type'], 
            $row['Null'],
            $row['Default'] ?? 'NULL'
        );
    }
    
    echo "\n" . str_repeat("=", 60) . "\n";
    echo "📊 RESUMEN:\n";
    echo str_repeat("=", 60) . "\n";
    echo "✅ Columnas agregadas: $columnsAdded\n";
    
    $mysqli->close();
    
    echo "\n✅ Proceso completado\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
