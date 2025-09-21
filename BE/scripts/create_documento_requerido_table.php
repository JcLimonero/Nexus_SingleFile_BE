<?php
/**
 * Script para crear la tabla DocumentoRequerido
 * Ejecutar desde la línea de comandos: php create_documento_requerido_table.php
 */

// Configuración de la base de datos
$host = 'localhost';
$dbname = 'singlefile_db';
$username = 'root';
$password = '00@Limonero';

try {
    // Crear conexión PDO
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✅ Conexión a la base de datos establecida\n";
    
    // SQL para crear la tabla
    $sql = "
    CREATE TABLE IF NOT EXISTS `DocumentoRequerido` (
      `Id` int(11) NOT NULL AUTO_INCREMENT,
      `IdProceso` int(11) NOT NULL COMMENT 'ID del proceso asociado',
      `IdAgencia` int(11) NOT NULL COMMENT 'ID de la agencia asociada',
      `IdTipoCliente` int(11) NOT NULL COMMENT 'ID del tipo de cliente',
      `IdTipoOperacion` int(11) NOT NULL COMMENT 'ID del tipo de operación',
      `IdTipoDocumento` int(11) NOT NULL COMMENT 'ID del tipo de documento',
      `Orden` int(11) NOT NULL DEFAULT 1 COMMENT 'Orden de presentación del documento',
      `Requerido` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Si el documento es obligatorio (1=Sí, 0=No)',
      `RequiereExpiracion` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Si requiere fecha de expiración (1=Sí, 0=No)',
      `Comentarios` text DEFAULT NULL COMMENT 'Comentarios adicionales sobre el documento',
      `Enabled` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Estado del documento (1=Activo, 0=Inactivo)',
      `RegistrationDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de registro',
      `UpdateDate` datetime DEFAULT NULL COMMENT 'Fecha de última actualización',
      `IdLastUserUpdate` int(11) DEFAULT NULL COMMENT 'ID del último usuario que actualizó',
      PRIMARY KEY (`Id`),
      UNIQUE KEY `uk_configuracion_documento` (`IdProceso`, `IdAgencia`, `IdTipoCliente`, `IdTipoOperacion`, `IdTipoDocumento`),
      KEY `idx_proceso` (`IdProceso`),
      KEY `idx_agencia` (`IdAgencia`),
      KEY `idx_tipo_cliente` (`IdTipoCliente`),
      KEY `idx_tipo_operacion` (`IdTipoOperacion`),
      KEY `idx_tipo_documento` (`IdTipoDocumento`),
      KEY `idx_orden` (`Orden`),
      KEY `idx_enabled` (`Enabled`),
      KEY `idx_registration_date` (`RegistrationDate`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Configuración de documentos requeridos por proceso, agencia, tipo de cliente y tipo de operación';
    ";
    
    // Ejecutar la creación de la tabla
    $pdo->exec($sql);
    echo "✅ Tabla DocumentoRequerido creada exitosamente\n";
    
    // Verificar si la tabla existe
    $stmt = $pdo->query("SHOW TABLES LIKE 'DocumentoRequerido'");
    if ($stmt->rowCount() > 0) {
        echo "✅ Verificación: La tabla DocumentoRequerido existe\n";
    } else {
        echo "❌ Error: La tabla DocumentoRequerido no se creó correctamente\n";
        exit(1);
    }
    
    // Mostrar la estructura de la tabla
    echo "\n📋 Estructura de la tabla DocumentoRequerido:\n";
    $stmt = $pdo->query("DESCRIBE DocumentoRequerido");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo str_pad("Campo", 20) . str_pad("Tipo", 25) . str_pad("Nulo", 8) . str_pad("Llave", 8) . str_pad("Default", 15) . "Extra\n";
    echo str_repeat("-", 80) . "\n";
    
    foreach ($columns as $column) {
        echo str_pad($column['Field'], 20) . 
             str_pad($column['Type'], 25) . 
             str_pad($column['Null'], 8) . 
             str_pad($column['Key'], 8) . 
             str_pad($column['Default'] ?? 'NULL', 15) . 
             $column['Extra'] . "\n";
    }
    
    // Insertar datos de ejemplo
    echo "\n📝 Insertando datos de ejemplo...\n";
    
    $insertSql = "
    INSERT INTO `DocumentoRequerido` (
      `IdProceso`, `IdAgencia`, `IdTipoCliente`, `IdTipoOperacion`, `IdTipoDocumento`, 
      `Orden`, `Requerido`, `RequiereExpiracion`, `Comentarios`, `Enabled`
    ) VALUES 
    (1, 1, 1, 1, 1, 1, 1, 1, 'Documento obligatorio para el proceso', 1),
    (1, 1, 1, 1, 2, 2, 1, 0, 'Segundo documento requerido', 1),
    (1, 1, 2, 1, 1, 1, 1, 1, 'Documento para tipo de cliente diferente', 1),
    (2, 1, 1, 1, 1, 1, 1, 0, 'Documento para proceso diferente', 1)
    ";
    
    try {
        $pdo->exec($insertSql);
        echo "✅ Datos de ejemplo insertados exitosamente\n";
    } catch (PDOException $e) {
        echo "⚠️  Advertencia: No se pudieron insertar los datos de ejemplo: " . $e->getMessage() . "\n";
        echo "   Esto puede ser normal si las tablas referenciadas no existen o los IDs no coinciden\n";
    }
    
    // Mostrar estadísticas básicas
    echo "\n📊 Estadísticas de la tabla:\n";
    try {
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM DocumentoRequerido");
        $total = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
        echo "   Total de registros: $total\n";
        
        if ($total > 0) {
            $stmt = $pdo->query("
                SELECT 
                    COUNT(*) as total_documentos,
                    SUM(Requerido) as documentos_requeridos,
                    SUM(RequiereExpiracion) as documentos_con_expiracion,
                    COUNT(DISTINCT IdProceso) as procesos_unicos,
                    COUNT(DISTINCT IdAgencia) as agencias_unicas
                FROM DocumentoRequerido 
                WHERE Enabled = 1
            ");
            $stats = $stmt->fetch(PDO::FETCH_ASSOC);
            
            echo "   Documentos requeridos: " . ($stats['documentos_requeridos'] ?? 0) . "\n";
            echo "   Documentos con expiración: " . ($stats['documentos_con_expiracion'] ?? 0) . "\n";
            echo "   Procesos únicos: " . ($stats['procesos_unicos'] ?? 0) . "\n";
            echo "   Agencias únicas: " . ($stats['agencias_unicas'] ?? 0) . "\n";
        }
    } catch (PDOException $e) {
        echo "   No se pudieron obtener las estadísticas: " . $e->getMessage() . "\n";
    }
    
    // Verificar índices
    echo "\n🔍 Verificando índices:\n";
    try {
        $stmt = $pdo->query("SHOW INDEX FROM DocumentoRequerido");
        $indexes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($indexes as $index) {
            $keyName = $index['Key_name'];
            $columnName = $index['Column_name'];
            $nonUnique = $index['Non_unique'] ? 'No único' : 'Único';
            
            echo "   Índice: $keyName en columna $columnName ($nonUnique)\n";
        }
    } catch (PDOException $e) {
        echo "   No se pudieron verificar los índices: " . $e->getMessage() . "\n";
    }
    
    echo "\n🎉 Script ejecutado exitosamente!\n";
    echo "   La tabla DocumentoRequerido está lista para usar.\n";
    
} catch (PDOException $e) {
    echo "❌ Error de base de datos: " . $e->getMessage() . "\n";
    exit(1);
} catch (Exception $e) {
    echo "❌ Error general: " . $e->getMessage() . "\n";
    exit(1);
}
?>
