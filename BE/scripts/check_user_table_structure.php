<?php
/**
 * Revisar estructura completa de la tabla user para identificar restricciones
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== REVISIÓN DE ESTRUCTURA DE TABLA USER ===\n\n";

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
    
    // 1. Ver estructura de la tabla
    echo "📋 ESTRUCTURA DE LA TABLA 'user':\n";
    echo str_repeat("=", 80) . "\n";
    $result = $mysqli->query("DESCRIBE user");
    if ($result) {
        echo sprintf("%-25s %-15s %-10s %-10s %-15s %-10s\n", "Campo", "Tipo", "Null", "Key", "Default", "Extra");
        echo str_repeat("-", 80) . "\n";
        while ($row = $result->fetch_assoc()) {
            echo sprintf("%-25s %-15s %-10s %-10s %-15s %-10s\n", 
                $row['Field'], 
                $row['Type'], 
                $row['Null'], 
                $row['Key'], 
                $row['Default'] ?? 'NULL', 
                $row['Extra'] ?? ''
            );
        }
    }
    
    echo "\n\n";
    
    // 2. Ver índices
    echo "🔑 ÍNDICES DE LA TABLA 'user':\n";
    echo str_repeat("=", 80) . "\n";
    $result = $mysqli->query("SHOW INDEXES FROM user");
    if ($result) {
        $indexes = [];
        while ($row = $result->fetch_assoc()) {
            $indexName = $row['Key_name'];
            if (!isset($indexes[$indexName])) {
                $indexes[$indexName] = [
                    'name' => $indexName,
                    'unique' => $row['Non_unique'] == 0 ? 'YES' : 'NO',
                    'columns' => []
                ];
            }
            $indexes[$indexName]['columns'][] = $row['Column_name'];
        }
        
        foreach ($indexes as $index) {
            echo sprintf("Nombre: %s | Único: %s | Columnas: %s\n", 
                $index['name'], 
                $index['unique'], 
                implode(', ', $index['columns'])
            );
        }
    }
    
    echo "\n\n";
    
    // 3. Ver constraints (foreign keys)
    echo "🔗 FOREIGN KEYS DE LA TABLA 'user':\n";
    echo str_repeat("=", 80) . "\n";
    $result = $mysqli->query("
        SELECT 
            CONSTRAINT_NAME,
            COLUMN_NAME,
            REFERENCED_TABLE_NAME,
            REFERENCED_COLUMN_NAME
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = '{$db['database']}'
        AND TABLE_NAME = 'user'
        AND REFERENCED_TABLE_NAME IS NOT NULL
    ");
    
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            echo sprintf("Constraint: %s\n", $row['CONSTRAINT_NAME']);
            echo sprintf("  Columna: %s\n", $row['COLUMN_NAME']);
            echo sprintf("  Referencia: %s.%s\n", $row['REFERENCED_TABLE_NAME'], $row['REFERENCED_COLUMN_NAME']);
            echo "\n";
        }
    } else {
        echo "No hay foreign keys definidas\n";
    }
    
    echo "\n";
    
    // 4. Ver triggers
    echo "⚡ TRIGGERS DE LA TABLA 'user':\n";
    echo str_repeat("=", 80) . "\n";
    $result = $mysqli->query("
        SELECT 
            TRIGGER_NAME,
            EVENT_MANIPULATION,
            EVENT_OBJECT_TABLE,
            ACTION_STATEMENT,
            ACTION_TIMING
        FROM INFORMATION_SCHEMA.TRIGGERS
        WHERE TRIGGER_SCHEMA = '{$db['database']}'
        AND EVENT_OBJECT_TABLE = 'user'
    ");
    
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            echo sprintf("Trigger: %s\n", $row['TRIGGER_NAME']);
            echo sprintf("  Evento: %s %s\n", $row['ACTION_TIMING'], $row['EVENT_MANIPULATION']);
            echo sprintf("  Tabla: %s\n", $row['EVENT_OBJECT_TABLE']);
            echo sprintf("  Acción: %s\n", substr($row['ACTION_STATEMENT'], 0, 200));
            echo "\n";
        }
    } else {
        echo "No hay triggers definidos\n";
    }
    
    echo "\n";
    
    // 5. Verificar si Mail tiene algún constraint especial
    echo "📧 VERIFICACIÓN ESPECÍFICA DEL CAMPO 'Mail':\n";
    echo str_repeat("=", 80) . "\n";
    
    // Ver si hay unique constraint en Mail
    $result = $mysqli->query("
        SELECT 
            CONSTRAINT_NAME,
            COLUMN_NAME
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = '{$db['database']}'
        AND TABLE_NAME = 'user'
        AND COLUMN_NAME = 'Mail'
    ");
    
    if ($result && $result->num_rows > 0) {
        echo "Constraints en el campo Mail:\n";
        while ($row = $result->fetch_assoc()) {
            echo sprintf("  - %s\n", $row['CONSTRAINT_NAME']);
        }
    } else {
        echo "No hay constraints específicos en el campo Mail\n";
    }
    
    echo "\n";
    
    // 6. Intentar un UPDATE de prueba para ver el error exacto
    echo "🧪 PRUEBA DE ACTUALIZACIÓN:\n";
    echo str_repeat("=", 80) . "\n";
    
    // Obtener un usuario de prueba
    $testUser = $mysqli->query("SELECT Id, Mail FROM user LIMIT 1")->fetch_assoc();
    if ($testUser) {
        echo "Usuario de prueba: ID {$testUser['Id']}, Email actual: {$testUser['Mail']}\n";
        echo "Intentando actualizar a: test@nexusqtech.com\n";
        
        $testEmail = 'test@nexusqtech.com';
        $updateQuery = $mysqli->prepare("UPDATE user SET Mail = ? WHERE Id = ?");
        $updateQuery->bind_param("si", $testEmail, $testUser['Id']);
        
        if ($updateQuery->execute()) {
            echo "✅ UPDATE exitoso\n";
            // Revertir el cambio
            $revertQuery = $mysqli->prepare("UPDATE user SET Mail = ? WHERE Id = ?");
            $revertQuery->bind_param("si", $testUser['Mail'], $testUser['Id']);
            $revertQuery->execute();
            $revertQuery->close();
            echo "✅ Cambio revertido\n";
        } else {
            echo "❌ Error en UPDATE: " . $updateQuery->error . "\n";
            echo "   Código de error: " . $updateQuery->errno . "\n";
        }
        $updateQuery->close();
    }
    
    $mysqli->close();
    
    echo "\n✅ Revisión completada\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
