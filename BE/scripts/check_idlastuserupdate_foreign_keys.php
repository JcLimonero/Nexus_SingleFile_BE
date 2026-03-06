<?php
/**
 * Revisar y agregar foreign keys de IdLastUserUpdate hacia user
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== REVISAR FOREIGN KEYS DE IdLastUserUpdate ===\n\n";

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
    
    // Paso 1: Encontrar todas las tablas con columna IdLastUserUpdate
    echo "🔍 PASO 1: Buscando tablas con columna IdLastUserUpdate...\n";
    echo str_repeat("=", 80) . "\n";
    
    $dbName = $db['database'];
    $tablesQuery = $mysqli->query("
        SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = '$dbName'
        AND COLUMN_NAME = 'IdLastUserUpdate'
        ORDER BY TABLE_NAME
    ");
    
    if (!$tablesQuery) {
        die("❌ Error en consulta: " . $mysqli->error . "\n");
    }
    
    $tablesWithColumn = [];
    while ($row = $tablesQuery->fetch_assoc()) {
        $tablesWithColumn[] = $row['TABLE_NAME'];
        echo sprintf("  - %s (%s, NULL: %s)\n", 
            $row['TABLE_NAME'], 
            $row['DATA_TYPE'],
            $row['IS_NULLABLE']
        );
    }
    
    echo "\n✅ Encontradas " . count($tablesWithColumn) . " tablas con IdLastUserUpdate\n\n";
    
    if (empty($tablesWithColumn)) {
        echo "⚠️  No se encontraron tablas con IdLastUserUpdate\n";
        $mysqli->close();
        exit(0);
    }
    
    // Paso 2: Verificar foreign keys existentes
    echo "🔍 PASO 2: Verificando foreign keys existentes...\n";
    echo str_repeat("=", 80) . "\n";
    
    $tablesWithFK = [];
    $tablesWithoutFK = [];
    
    foreach ($tablesWithColumn as $table) {
        $fkQuery = $mysqli->query("
            SELECT 
                CONSTRAINT_NAME,
                COLUMN_NAME,
                REFERENCED_TABLE_NAME,
                REFERENCED_COLUMN_NAME
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
            WHERE TABLE_SCHEMA = '{$db['database']}'
            AND TABLE_NAME = '$table'
            AND COLUMN_NAME = 'IdLastUserUpdate'
            AND REFERENCED_TABLE_NAME = 'user'
        ");
        
        if ($fkQuery && $fkQuery->num_rows > 0) {
            $fk = $fkQuery->fetch_assoc();
            $tablesWithFK[] = [
                'table' => $table,
                'constraint' => $fk['CONSTRAINT_NAME']
            ];
            echo "✅ $table: Foreign key '{$fk['CONSTRAINT_NAME']}' existe\n";
        } else {
            $tablesWithoutFK[] = $table;
            echo "❌ $table: No tiene foreign key hacia user\n";
        }
    }
    
    echo "\n";
    echo "📊 RESUMEN:\n";
    echo "  ✅ Tablas CON foreign key: " . count($tablesWithFK) . "\n";
    echo "  ❌ Tablas SIN foreign key: " . count($tablesWithoutFK) . "\n\n";
    
    if (empty($tablesWithoutFK)) {
        echo "✅ Todas las tablas tienen foreign key hacia user\n";
        $mysqli->close();
        exit(0);
    }
    
    // Paso 3: Verificar que la tabla user existe y tiene la columna Id
    echo "🔍 PASO 3: Verificando tabla user...\n";
    echo str_repeat("=", 80) . "\n";
    
    $userTableExists = $mysqli->query("SHOW TABLES LIKE 'user'");
    if ($userTableExists->num_rows == 0) {
        die("❌ La tabla 'user' no existe\n");
    }
    
    $userIdColumn = $mysqli->query("SHOW COLUMNS FROM user WHERE Field = 'Id'");
    if ($userIdColumn->num_rows == 0) {
        die("❌ La tabla 'user' no tiene la columna 'Id'\n");
    }
    
    echo "✅ Tabla 'user' existe con columna 'Id'\n\n";
    
    // Paso 4: Crear foreign keys faltantes
    echo "🔧 PASO 4: Creando foreign keys faltantes...\n";
    echo str_repeat("=", 80) . "\n";
    
    $mysqli->query("SET FOREIGN_KEY_CHECKS = 0");
    
    $createdCount = 0;
    $errorCount = 0;
    
    foreach ($tablesWithoutFK as $table) {
        $constraintName = "FK_{$table}_IdLastUserUpdate";
        
        // Verificar si ya existe una constraint con ese nombre (por si acaso)
        $dbName = $db['database'];
        $checkConstraint = $mysqli->query("
            SELECT CONSTRAINT_NAME
            FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
            WHERE TABLE_SCHEMA = '$dbName'
            AND TABLE_NAME = '$table'
            AND CONSTRAINT_NAME = '$constraintName'
        ");
        
        if ($checkConstraint->num_rows > 0) {
            // Eliminar constraint existente si existe
            $mysqli->query("ALTER TABLE `$table` DROP FOREIGN KEY `$constraintName`");
        }
        
        // Crear la foreign key
        $createFK = $mysqli->query("
            ALTER TABLE `$table`
            ADD CONSTRAINT `$constraintName`
            FOREIGN KEY (`IdLastUserUpdate`) 
            REFERENCES `user` (`Id`)
            ON DELETE SET NULL
            ON UPDATE CASCADE
        ");
        
        if ($createFK) {
            echo "✅ $table: Foreign key '$constraintName' creada\n";
            $createdCount++;
        } else {
            echo "❌ $table: Error al crear foreign key - " . $mysqli->error . "\n";
            $errorCount++;
        }
    }
    
    $mysqli->query("SET FOREIGN_KEY_CHECKS = 1");
    
    echo "\n" . str_repeat("=", 80) . "\n";
    echo "📊 RESUMEN DE CREACIÓN:\n";
    echo str_repeat("=", 80) . "\n";
    echo "✅ Foreign keys creadas: $createdCount\n";
    echo "❌ Errores: $errorCount\n\n";
    
    // Paso 5: Verificación final
    echo "🔍 PASO 5: Verificación final...\n";
    echo str_repeat("=", 80) . "\n";
    
    $finalTablesWithoutFK = [];
    foreach ($tablesWithColumn as $table) {
        $dbName = $db['database'];
        $fkQuery = $mysqli->query("
            SELECT CONSTRAINT_NAME
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
            WHERE TABLE_SCHEMA = '$dbName'
            AND TABLE_NAME = '$table'
            AND COLUMN_NAME = 'IdLastUserUpdate'
            AND REFERENCED_TABLE_NAME = 'user'
        ");
        
        if ($fkQuery && $fkQuery->num_rows > 0) {
            $fk = $fkQuery->fetch_assoc();
            echo "✅ $table: Foreign key '{$fk['CONSTRAINT_NAME']}' verificada\n";
        } else {
            $finalTablesWithoutFK[] = $table;
            echo "❌ $table: Aún no tiene foreign key\n";
        }
    }
    
    echo "\n";
    
    if (empty($finalTablesWithoutFK)) {
        echo "✅ TODAS las tablas tienen foreign key hacia user\n";
    } else {
        echo "⚠️  " . count($finalTablesWithoutFK) . " tablas aún no tienen foreign key:\n";
        foreach ($finalTablesWithoutFK as $table) {
            echo "   - $table\n";
        }
    }
    
    // Mostrar todas las foreign keys creadas
    echo "\n📋 FOREIGN KEYS DE IdLastUserUpdate:\n";
    echo str_repeat("=", 80) . "\n";
    foreach ($tablesWithColumn as $table) {
        $fkQuery = $mysqli->query("
            SELECT 
                CONSTRAINT_NAME,
                COLUMN_NAME,
                REFERENCED_TABLE_NAME,
                REFERENCED_COLUMN_NAME
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
            WHERE TABLE_SCHEMA = '{$db['database']}'
            AND TABLE_NAME = '$table'
            AND COLUMN_NAME = 'IdLastUserUpdate'
            AND REFERENCED_TABLE_NAME = 'user'
        ");
        
        if ($fkQuery && $fkQuery->num_rows > 0) {
            $fk = $fkQuery->fetch_assoc();
            echo sprintf("%-40s → %s.%s (%s)\n",
                $table,
                $fk['REFERENCED_TABLE_NAME'],
                $fk['REFERENCED_COLUMN_NAME'],
                $fk['CONSTRAINT_NAME']
            );
        }
    }
    
    $mysqli->close();
    
    echo "\n✅ Proceso completado\n";
    
} catch (Exception $e) {
    if (isset($mysqli)) {
        $mysqli->query("SET FOREIGN_KEY_CHECKS = 1");
    }
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
