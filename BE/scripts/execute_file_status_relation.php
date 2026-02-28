<?php
/**
 * Ejecutar migración de relación entre file_sub_status y file_status
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== EJECUTAR MIGRACIÓN DE RELACIÓN FILE_STATUS ===\n\n";

$configFile = __DIR__ . '/../app/Config/database-config.json';
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
    
    // Verificar si la columna ya existe
    $checkColumn = $mysqli->query("SHOW COLUMNS FROM file_sub_status LIKE 'IdFileStatus'");
    if ($checkColumn->num_rows > 0) {
        echo "⚠️  La columna 'IdFileStatus' ya existe en 'file_sub_status'\n";
        echo "   Verificando foreign key...\n\n";
    } else {
        // Agregar columna IdFileStatus
        echo "🔄 Agregando columna IdFileStatus...\n";
        $addColumn = $mysqli->query("
            ALTER TABLE `file_sub_status`
            ADD COLUMN `IdFileStatus` INT NULL DEFAULT NULL AFTER `Id`
        ");
        
        if ($addColumn) {
            echo "✅ Columna IdFileStatus agregada exitosamente\n\n";
        } else {
            die("❌ Error al agregar columna: " . $mysqli->error . "\n");
        }
    }
    
    // Verificar si el índice ya existe
    $checkIndex = $mysqli->query("
        SHOW INDEX FROM file_sub_status WHERE Key_name = 'IDX_file_sub_status_IdFileStatus'
    ");
    
    if ($checkIndex->num_rows == 0) {
        echo "🔄 Creando índice...\n";
        $createIndex = $mysqli->query("
            CREATE INDEX `IDX_file_sub_status_IdFileStatus` ON `file_sub_status` (`IdFileStatus`)
        ");
        
        if ($createIndex) {
            echo "✅ Índice creado exitosamente\n\n";
        } else {
            echo "⚠️  Error al crear índice: " . $mysqli->error . "\n";
            echo "   Continuando con la foreign key...\n\n";
        }
    } else {
        echo "✅ El índice ya existe\n\n";
    }
    
    // Verificar si la foreign key ya existe
    $checkFK = $mysqli->query("
        SELECT CONSTRAINT_NAME
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = '{$db['database']}'
        AND TABLE_NAME = 'file_sub_status'
        AND CONSTRAINT_NAME = 'FK_file_sub_status_file_status'
    ");
    
    if ($checkFK->num_rows == 0) {
        echo "🔄 Creando foreign key constraint...\n";
        
        // Primero eliminar cualquier foreign key existente con el mismo nombre (por si acaso)
        $dropFK = $mysqli->query("
            ALTER TABLE `file_sub_status`
            DROP FOREIGN KEY IF EXISTS `FK_file_sub_status_file_status`
        ");
        
        // Crear la foreign key
        $createFK = $mysqli->query("
            ALTER TABLE `file_sub_status`
            ADD CONSTRAINT `FK_file_sub_status_file_status`
            FOREIGN KEY (`IdFileStatus`) 
            REFERENCES `file_status` (`Id`)
            ON DELETE SET NULL
            ON UPDATE CASCADE
        ");
        
        if ($createFK) {
            echo "✅ Foreign key creada exitosamente\n\n";
        } else {
            die("❌ Error al crear foreign key: " . $mysqli->error . "\n");
        }
    } else {
        echo "✅ La foreign key ya existe\n\n";
    }
    
    // Verificar la estructura final
    echo "📋 ESTRUCTURA FINAL DE 'file_sub_status':\n";
    echo str_repeat("=", 80) . "\n";
    $result = $mysqli->query("DESCRIBE file_sub_status");
    if ($result) {
        echo sprintf("%-25s %-20s %-10s %-10s %-15s\n", "Campo", "Tipo", "Null", "Key", "Default");
        echo str_repeat("-", 80) . "\n";
        while ($row = $result->fetch_assoc()) {
            echo sprintf("%-25s %-20s %-10s %-10s %-15s\n", 
                $row['Field'], 
                $row['Type'], 
                $row['Null'], 
                $row['Key'], 
                $row['Default'] ?? 'NULL'
            );
        }
    }
    
    echo "\n";
    
    // Verificar foreign keys
    echo "🔗 FOREIGN KEYS EN 'file_sub_status':\n";
    echo str_repeat("=", 80) . "\n";
    $fks = $mysqli->query("
        SELECT 
            CONSTRAINT_NAME,
            COLUMN_NAME,
            REFERENCED_TABLE_NAME,
            REFERENCED_COLUMN_NAME
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = '{$db['database']}'
        AND TABLE_NAME = 'file_sub_status'
        AND REFERENCED_TABLE_NAME IS NOT NULL
    ");
    
    if ($fks && $fks->num_rows > 0) {
        while ($fk = $fks->fetch_assoc()) {
            echo sprintf("Constraint: %s\n", $fk['CONSTRAINT_NAME']);
            echo sprintf("  Columna: %s\n", $fk['COLUMN_NAME']);
            echo sprintf("  Referencia: %s.%s\n", $fk['REFERENCED_TABLE_NAME'], $fk['REFERENCED_COLUMN_NAME']);
            echo "\n";
        }
    } else {
        echo "⚠️  No se encontraron foreign keys\n";
    }
    
    $mysqli->close();
    
    echo "✅ Migración completada\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
