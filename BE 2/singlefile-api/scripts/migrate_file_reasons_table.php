<?php
/**
 * Script para migrar la tabla File_Reasons
 * Agregar campos estándar de auditoría como otros catálogos del sistema
 * 
 * Uso: php scripts/migrate_file_reasons_table.php
 */

// Configuración de la base de datos
$host = 'localhost';
$username = 'root';
$password = '00@Limonero';
$database = 'singlefile_db';

echo "=== Migración de Tabla File_Reasons ===\n\n";

try {
    // Conectar a la base de datos
    $pdo = new PDO("mysql:host=$host;dbname=$database;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✅ Conexión a la base de datos establecida\n\n";
    
    // Verificar si la tabla existe
    $stmt = $pdo->query("SHOW TABLES LIKE 'File_Reasons'");
    if ($stmt->rowCount() == 0) {
        echo "❌ La tabla File_Reasons no existe. Creando tabla...\n";
        
        $createTable = "
        CREATE TABLE `File_Reasons` (
            `Id` INTEGER PRIMARY KEY,
            `Description` VARCHAR(500),
            `IdTypeReason` BIGINT DEFAULT 0,
            `Enabled` TINYINT DEFAULT 1 COMMENT 'Estado del motivo de rechazo: 1=Habilitado, 0=Deshabilitado',
            `RegistrationDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
            `UpdateDate` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última modificación',
            `IdLastUserUpdate` BIGINT DEFAULT 0 COMMENT 'ID del último usuario que modificó el registro'
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Motivos de rechazo para archivos del sistema';
        ";
        
        $pdo->exec($createTable);
        echo "✅ Tabla File_Reasons creada exitosamente\n\n";
        
        // Insertar algunos datos de ejemplo
        $sampleData = [
            ['Description' => 'Documentación incompleta', 'IdTypeReason' => 1],
            ['Description' => 'Información incorrecta', 'IdTypeReason' => 2],
            ['Description' => 'Proceso no autorizado', 'IdTypeReason' => 3],
            ['Description' => 'Validación fallida', 'IdTypeReason' => 2],
            ['Description' => 'Requerimiento no cumplido', 'IdTypeReason' => 1]
        ];
        
        foreach ($sampleData as $data) {
            $stmt = $pdo->prepare("INSERT INTO File_Reasons (Id, Description, IdTypeReason) VALUES (?, ?, ?)");
            $id = $pdo->query("SELECT COALESCE(MAX(Id), 0) + 1 FROM File_Reasons")->fetchColumn();
            $stmt->execute([$id, $data['Description'], $data['IdTypeReason']]);
        }
        
        echo "✅ Datos de ejemplo insertados\n\n";
        
    } else {
        echo "✅ La tabla File_Reasons existe\n";
        
        // Verificar campos existentes
        $stmt = $pdo->query("DESCRIBE File_Reasons");
        $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        echo "Campos actuales: " . implode(', ', $columns) . "\n\n";
        
        // Agregar campo Enabled si no existe
        if (!in_array('Enabled', $columns)) {
            echo "➕ Agregando campo Enabled...\n";
            $pdo->exec("ALTER TABLE File_Reasons ADD COLUMN Enabled TINYINT DEFAULT 1 COMMENT 'Estado del motivo de rechazo: 1=Habilitado, 0=Deshabilitado'");
            echo "✅ Campo Enabled agregado\n";
        } else {
            echo "✅ Campo Enabled ya existe\n";
        }
        
        // Agregar campo RegistrationDate si no existe
        if (!in_array('RegistrationDate', $columns)) {
            echo "➕ Agregando campo RegistrationDate...\n";
            $pdo->exec("ALTER TABLE File_Reasons ADD COLUMN RegistrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro'");
            echo "✅ Campo RegistrationDate agregado\n";
        } else {
            echo "✅ Campo RegistrationDate ya existe\n";
        }
        
        // Agregar campo UpdateDate si no existe
        if (!in_array('UpdateDate', $columns)) {
            echo "➕ Agregando campo UpdateDate...\n";
            $pdo->exec("ALTER TABLE File_Reasons ADD COLUMN UpdateDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última modificación'");
            echo "✅ Campo UpdateDate agregado\n";
        } else {
            echo "✅ Campo UpdateDate ya existe\n";
        }
        
        // Agregar campo IdLastUserUpdate si no existe
        if (!in_array('IdLastUserUpdate', $columns)) {
            echo "➕ Agregando campo IdLastUserUpdate...\n";
            $pdo->exec("ALTER TABLE File_Reasons ADD COLUMN IdLastUserUpdate BIGINT DEFAULT 0 COMMENT 'ID del último usuario que modificó el registro'");
            echo "✅ Campo IdLastUserUpdate agregado\n";
        } else {
            echo "✅ Campo IdLastUserUpdate ya existe\n";
        }
        
        echo "\n";
    }
    
    // Crear índices para mejorar el rendimiento
    echo "🔍 Creando índices...\n";
    
    try {
        $pdo->exec("CREATE INDEX idx_file_reasons_enabled ON File_Reasons (Enabled)");
        echo "✅ Índice en Enabled creado\n";
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'Duplicate key name') !== false) {
            echo "✅ Índice en Enabled ya existe\n";
        } else {
            echo "⚠️  Error creando índice en Enabled: " . $e->getMessage() . "\n";
        }
    }
    
    try {
        $pdo->exec("CREATE INDEX idx_file_reasons_registration_date ON File_Reasons (RegistrationDate)");
        echo "✅ Índice en RegistrationDate creado\n";
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'Duplicate key name') !== false) {
            echo "✅ Índice en RegistrationDate ya existe\n";
        } else {
            echo "⚠️  Error creando índice en RegistrationDate: " . $e->getMessage() . "\n";
        }
    }
    
    try {
        $pdo->exec("CREATE INDEX idx_file_reasons_update_date ON File_Reasons (UpdateDate)");
        echo "✅ Índice en UpdateDate creado\n";
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'Duplicate key name') !== false) {
            echo "✅ Índice en UpdateDate ya existe\n";
        } else {
            echo "⚠️  Error creando índice en UpdateDate: " . $e->getMessage() . "\n";
        }
    }
    
    try {
        $pdo->exec("CREATE INDEX idx_file_reasons_last_user_update ON File_Reasons (IdLastUserUpdate)");
        echo "✅ Índice en IdLastUserUpdate creado\n";
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'Duplicate key name') !== false) {
            echo "✅ Índice en IdLastUserUpdate ya existe\n";
        } else {
            echo "⚠️  Error creando índice en IdLastUserUpdate: " . $e->getMessage() . "\n";
        }
    }
    
    echo "\n";
    
    // Actualizar registros existentes para establecer valores por defecto
    echo "🔄 Actualizando registros existentes...\n";
    
    $updateCount = $pdo->exec("
        UPDATE File_Reasons 
        SET 
            Enabled = 1,
            RegistrationDate = CURRENT_TIMESTAMP,
            UpdateDate = CURRENT_TIMESTAMP,
            IdLastUserUpdate = 0
        WHERE Enabled IS NULL 
           OR RegistrationDate IS NULL 
           OR UpdateDate IS NULL 
           OR IdLastUserUpdate IS NULL
    ");
    
    echo "✅ $updateCount registros actualizados\n\n";
    
    // Verificar la estructura final
    echo "📋 Estructura final de la tabla:\n";
    $stmt = $pdo->query("DESCRIBE File_Reasons");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($columns as $column) {
        printf("  %-20s %-20s %-10s %-10s %-10s\n", 
               $column['Field'], 
               $column['Type'], 
               $column['Null'], 
               $column['Key'], 
               $column['Default'] ?? 'NULL');
    }
    
    echo "\n";
    
    // Mostrar algunos registros de ejemplo
    echo "📊 Registros de ejemplo:\n";
    $stmt = $pdo->query("
        SELECT 
            Id,
            Description,
            IdTypeReason,
            Enabled,
            RegistrationDate,
            UpdateDate,
            IdLastUserUpdate
        FROM File_Reasons 
        LIMIT 5
    ");
    
    $reasons = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($reasons) > 0) {
        printf("%-5s %-30s %-15s %-8s %-20s %-20s %-15s\n", 
               'ID', 'Descripción', 'Tipo Razón', 'Estado', 'Fecha Registro', 'Última Modificación', 'Último Usuario');
        echo str_repeat('-', 120) . "\n";
        
        foreach ($reasons as $reason) {
            printf("%-5s %-30s %-15s %-8s %-20s %-20s %-15s\n", 
                   $reason['Id'],
                   substr($reason['Description'], 0, 28) . (strlen($reason['Description']) > 28 ? '..' : ''),
                   $reason['IdTypeReason'],
                   $reason['Enabled'] ? 'Activo' : 'Inactivo',
                   $reason['RegistrationDate'],
                   $reason['UpdateDate'],
                   $reason['IdLastUserUpdate'] ?: 'N/A');
        }
    } else {
        echo "No hay registros en la tabla\n";
    }
    
    echo "\n🎉 Migración completada exitosamente!\n";
    
} catch (PDOException $e) {
    echo "❌ Error de base de datos: " . $e->getMessage() . "\n";
    exit(1);
} catch (Exception $e) {
    echo "❌ Error general: " . $e->getMessage() . "\n";
    exit(1);
}
