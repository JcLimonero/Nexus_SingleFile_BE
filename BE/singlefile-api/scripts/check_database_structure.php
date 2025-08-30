<?php
// Script para verificar la estructura de la base de datos
// y analizar las tablas necesarias para la API de validación

// Configuración de la base de datos
$host = 'localhost';
$dbname = 'singlefile_db';
$username = 'root';
$password = '00@Limonero';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "✅ Conexión a la base de datos exitosa\n\n";

    // 1. Mostrar todas las tablas existentes
    echo "📋 TABLAS EXISTENTES EN LA BASE DE DATOS:\n";
    echo "==========================================\n";
    
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    if (empty($tables)) {
        echo "❌ No hay tablas en la base de datos\n";
        exit(1);
    }
    
    foreach ($tables as $table) {
        echo "  - $table\n";
    }
    
    echo "\n📊 Total de tablas: " . count($tables) . "\n\n";

    // 2. Analizar tablas relevantes para la API de validación
    echo "🔍 ANÁLISIS DE TABLAS RELEVANTES PARA VALIDACIÓN:\n";
    echo "==================================================\n";
    
    $relevantTables = [
        'Clientes', 'Customers', 'Cliente', 'Customer',
        'Pedidos', 'Orders', 'Pedido', 'Order',
        'Procesos', 'Processes', 'Process',
        'Operaciones', 'Operations', 'Operation',
        'Estados', 'Status', 'Estados_Proceso', 'Process_Status',
        'Fases', 'Phases', 'Fases_Proceso', 'Process_Phases'
    ];
    
    foreach ($relevantTables as $tableName) {
        $stmt = $pdo->query("SHOW TABLES LIKE '$tableName'");
        if ($stmt->rowCount() > 0) {
            echo "✅ Tabla encontrada: $tableName\n";
            
            // Mostrar estructura de la tabla
            $stmt = $pdo->query("DESCRIBE `$tableName`");
            $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo "   Estructura:\n";
            foreach ($columns as $column) {
                echo "     - {$column['Field']}: {$column['Type']} ({$column['Null']})\n";
            }
            
            // Mostrar algunos datos de ejemplo
            $stmt = $pdo->query("SELECT * FROM `$tableName` LIMIT 3");
            $sampleData = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            if (!empty($sampleData)) {
                echo "   Datos de ejemplo:\n";
                foreach ($sampleData as $row) {
                    echo "     " . json_encode($row, JSON_UNESCAPED_UNICODE) . "\n";
                }
            }
            echo "\n";
        }
    }
    
    // 3. Buscar tablas que puedan contener información de clientes
    echo "🔍 BUSCANDO TABLAS CON INFORMACIÓN DE CLIENTES:\n";
    echo "===============================================\n";
    
    $clientTables = [];
    foreach ($tables as $table) {
        $stmt = $pdo->query("SHOW COLUMNS FROM `$table` LIKE '%cliente%'");
        if ($stmt->rowCount() > 0) {
            $clientTables[] = $table;
            echo "✅ Tabla $table contiene campos relacionados con clientes\n";
        }
        
        $stmt = $pdo->query("SHOW COLUMNS FROM `$table` LIKE '%customer%'");
        if ($stmt->rowCount() > 0) {
            $clientTables[] = $table;
            echo "✅ Tabla $table contiene campos relacionados con customers\n";
        }
    }
    
    // 4. Buscar tablas que puedan contener información de procesos
    echo "\n🔍 BUSCANDO TABLAS CON INFORMACIÓN DE PROCESOS:\n";
    echo "================================================\n";
    
    $processTables = [];
    foreach ($tables as $table) {
        $stmt = $pdo->query("SHOW COLUMNS FROM `$table` LIKE '%proceso%'");
        if ($stmt->rowCount() > 0) {
            $processTables[] = $table;
            echo "✅ Tabla $table contiene campos relacionados con procesos\n";
        }
        
        $stmt = $pdo->query("SHOW COLUMNS FROM `$table` LIKE '%process%'");
        if ($stmt->rowCount() > 0) {
            $processTables[] = $table;
            echo "✅ Tabla $table contiene campos relacionados con processes\n";
        }
    }
    
    // 5. Mostrar relaciones potenciales
    echo "\n🔗 RELACIONES POTENCIALES IDENTIFICADAS:\n";
    echo "=======================================\n";
    
    foreach ($tables as $table) {
        $stmt = $pdo->query("SHOW CREATE TABLE `$table`");
        $createTable = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (strpos($createTable['Create Table'], 'FOREIGN KEY') !== false) {
            echo "🔗 Tabla $table tiene foreign keys:\n";
            echo "   " . $createTable['Create Table'] . "\n\n";
        }
    }
    
    // 6. Recomendaciones para la API
    echo "\n💡 RECOMENDACIONES PARA LA API DE VALIDACIÓN:\n";
    echo "=============================================\n";
    
    if (!empty($clientTables)) {
        echo "✅ Tablas de clientes disponibles: " . implode(', ', array_unique($clientTables)) . "\n";
    } else {
        echo "❌ No se encontraron tablas específicas de clientes\n";
        echo "   Recomendación: Crear tabla 'Clientes' o 'Customers'\n";
    }
    
    if (!empty($processTables)) {
        echo "✅ Tablas de procesos disponibles: " . implode(', ', array_unique($processTables)) . "\n";
    } else {
        echo "❌ No se encontraron tablas específicas de procesos\n";
        echo "   Recomendación: Crear tabla 'Procesos' o 'Processes'\n";
    }
    
    echo "\n📝 PRÓXIMOS PASOS:\n";
    echo "1. Revisar la estructura de las tablas encontradas\n";
    echo "2. Identificar campos necesarios para la API\n";
    echo "3. Crear tablas faltantes si es necesario\n";
    echo "4. Establecer relaciones entre tablas\n";
    echo "5. Implementar el endpoint en el backend\n";

} catch (PDOException $e) {
    echo "❌ Error de base de datos: " . $e->getMessage() . "\n";
    exit(1);
} catch (Exception $e) {
    echo "❌ Error general: " . $e->getMessage() . "\n";
    exit(1);
}

echo "\n✅ Análisis de base de datos completado\n";
?>
