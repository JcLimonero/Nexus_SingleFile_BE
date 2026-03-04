<?php

/**
 * Script para ejecutar la migración de campos de imagen de usuario
 * Agrega los campos ProfileImage e ImageType a la tabla User
 */

echo "=== EJECUTANDO MIGRACIÓN DE IMAGEN DE USUARIO ===\n\n";

try {
    // Cargar CodeIgniter
    require_once __DIR__ . '/../vendor/autoload.php';
    
    // Configurar el entorno
    putenv('CI_ENVIRONMENT=development');
    
    // Conectar a la base de datos
    $hostname = 'localhost';
    $username = 'root';
    $password_db = '00@Limonero';
    $database = 'NexFile_db';
    
    $db = new mysqli($hostname, $username, $password_db, $database);
    
    if ($db->connect_error) {
        throw new Exception("Error de conexión: " . $db->connect_error);
    }
    
    echo "✅ Conexión a base de datos exitosa\n\n";
    
    // Verificar estructura actual de la tabla User
    echo "🔍 Verificando estructura actual de la tabla User...\n";
    
    $result = $db->query("DESCRIBE User");
    $columns = [];
    while ($row = $result->fetch_assoc()) {
        $columns[] = $row['Field'];
    }
    
    echo "Columnas actuales: " . implode(', ', $columns) . "\n\n";
    
    // Verificar si ya existen los campos
    $hasProfileImage = in_array('ProfileImage', $columns);
    $hasImageType = in_array('ImageType', $columns);
    
    if ($hasProfileImage && $hasImageType) {
        echo "✅ Los campos ProfileImage e ImageType ya existen en la tabla User\n";
        echo "No es necesario ejecutar la migración\n";
        exit(0);
    }
    
    // Agregar campo ProfileImage si no existe
    if (!$hasProfileImage) {
        echo "➕ Agregando campo ProfileImage...\n";
        
        $sql = "ALTER TABLE User ADD COLUMN ProfileImage VARCHAR(500) NULL DEFAULT NULL COMMENT 'Ruta o URL de la imagen de perfil del usuario'";
        
        if ($db->query($sql)) {
            echo "✅ Campo ProfileImage agregado exitosamente\n";
        } else {
            throw new Exception("Error al agregar ProfileImage: " . $db->error);
        }
    }
    
    // Agregar campo ImageType si no existe
    if (!$hasImageType) {
        echo "➕ Agregando campo ImageType...\n";
        
        $sql = "ALTER TABLE User ADD COLUMN ImageType VARCHAR(50) NULL DEFAULT NULL COMMENT 'Tipo de imagen (jpg, png, webp, etc.)'";
        
        if ($db->query($sql)) {
            echo "✅ Campo ImageType agregado exitosamente\n";
        } else {
            throw new Exception("Error al agregar ImageType: " . $db->error);
        }
    }
    
    // Verificar estructura final
    echo "\n🔍 Verificando estructura final de la tabla User...\n";
    
    $result = $db->query("DESCRIBE User");
    $finalColumns = [];
    while ($row = $result->fetch_assoc()) {
        $finalColumns[] = $row['Field'];
    }
    
    echo "Columnas finales: " . implode(', ', $finalColumns) . "\n\n";
    
    // Crear directorio para imágenes de perfil
    echo "📁 Creando directorio para imágenes de perfil...\n";
    
    $uploadPath = __DIR__ . '/../writable/uploads/profile_images/';
    if (!is_dir($uploadPath)) {
        if (mkdir($uploadPath, 0755, true)) {
            echo "✅ Directorio creado exitosamente: {$uploadPath}\n";
        } else {
            echo "⚠️  No se pudo crear el directorio: {$uploadPath}\n";
            echo "   Asegúrate de que el directorio writable tenga permisos de escritura\n";
        }
    } else {
        echo "✅ El directorio ya existe: {$uploadPath}\n";
    }
    
    echo "\n🎉 MIGRACIÓN COMPLETADA EXITOSAMENTE\n";
    echo "La tabla User ahora incluye campos para almacenar imágenes de perfil\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
    exit(1);
} finally {
    if (isset($db)) {
        $db->close();
    }
}

echo "\n=== FIN DE LA MIGRACIÓN ===\n";
