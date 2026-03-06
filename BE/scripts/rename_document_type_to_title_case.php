<?php
/**
 * Renombrar registros de document_type de MAYÚSCULAS a Title Case
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== RENOMBRAR DOCUMENT_TYPE A TITLE CASE ===\n\n";

$configFile = __DIR__ . '/../app/Config/database-config.json';
$config = json_decode(file_get_contents($configFile), true);
$db = $config['database'];

echo "Base de datos: {$db['database']}\n";
echo "Host: {$db['hostname']}\n\n";

/**
 * Convertir texto a Title Case (primera letra de cada palabra en mayúscula)
 * Maneja casos especiales como acrónimos y palabras cortas
 */
function toTitleCase($text) {
    if (empty($text)) {
        return $text;
    }
    
    // Lista de palabras que deben permanecer en mayúsculas (acrónimos)
    $acronyms = ['ID', 'RFC', 'CURP', 'CFDI', 'PDI', 'VGD', 'REPUVE', 'AISE', 'PROFECO', 'KIA', 'IF'];
    
    // Lista de palabras que deben permanecer en minúsculas (preposiciones, artículos)
    $lowercaseWords = ['de', 'del', 'la', 'el', 'y', 'o', 'a', 'en', 'por', 'para', 'con', 'sin'];
    
    // Convertir a minúsculas primero
    $text = mb_strtolower($text, 'UTF-8');
    
    // Dividir en palabras
    $words = preg_split('/\s+/', trim($text));
    $result = [];
    
    foreach ($words as $index => $word) {
        $word = trim($word);
        if (empty($word)) {
            continue;
        }
        
        // Verificar si es un acrónimo conocido
        $isAcronym = false;
        foreach ($acronyms as $acronym) {
            if (mb_strtoupper($word, 'UTF-8') === $acronym) {
                $result[] = $acronym;
                $isAcronym = true;
                break;
            }
        }
        
        if ($isAcronym) {
            continue;
        }
        
        // Primera palabra siempre en mayúscula
        // Palabras intermedias en minúsculas si están en la lista
        if ($index > 0 && in_array($word, $lowercaseWords)) {
            $result[] = $word;
        } else {
            // Capitalizar primera letra
            $result[] = mb_strtoupper(mb_substr($word, 0, 1, 'UTF-8'), 'UTF-8') . 
                       mb_substr($word, 1, null, 'UTF-8');
        }
    }
    
    return implode(' ', $result);
}

try {
    $mysqli = new mysqli($db['hostname'], $db['username'], $db['password'], $db['database'], $db['port']);
    
    if ($mysqli->connect_error) {
        die("❌ Error de conexión: " . $mysqli->connect_error . "\n");
    }
    
    echo "✅ Conectado a la base de datos\n\n";
    
    // Obtener todos los registros
    echo "📋 Obteniendo registros de 'document_type'...\n";
    $records = $mysqli->query("SELECT Id, Name FROM document_type ORDER BY Id");
    
    if (!$records) {
        die("❌ Error al obtener registros: " . $mysqli->error . "\n");
    }
    
    $totalRecords = $records->num_rows;
    echo "✅ Encontrados $totalRecords registros\n\n";
    
    if ($totalRecords == 0) {
        echo "⚠️  No hay registros para renombrar\n";
        $mysqli->close();
        exit(0);
    }
    
    echo "🔄 Renombrando registros...\n";
    echo str_repeat("=", 80) . "\n";
    
    $updatedCount = 0;
    $skippedCount = 0;
    $errorCount = 0;
    
    while ($row = $records->fetch_assoc()) {
        $originalName = $row['Name'];
        $newName = toTitleCase($originalName);
        
        // Solo actualizar si el nombre cambió
        if ($originalName === $newName) {
            echo "⏭️  ID {$row['Id']}: Sin cambios - '$originalName'\n";
            $skippedCount++;
            continue;
        }
        
        // Actualizar el nombre
        $updateQuery = $mysqli->prepare("UPDATE document_type SET Name = ?, UpdateDate = NOW() WHERE Id = ?");
        $updateQuery->bind_param("si", $newName, $row['Id']);
        
        if ($updateQuery->execute()) {
            echo "✅ ID {$row['Id']}: '$originalName' → '$newName'\n";
            $updatedCount++;
        } else {
            echo "❌ ID {$row['Id']}: Error al actualizar - " . $updateQuery->error . "\n";
            $errorCount++;
        }
        $updateQuery->close();
    }
    
    echo "\n" . str_repeat("=", 80) . "\n";
    echo "📊 RESUMEN:\n";
    echo str_repeat("=", 80) . "\n";
    echo "✅ Actualizados: $updatedCount\n";
    echo "⏭️  Sin cambios: $skippedCount\n";
    echo "❌ Errores: $errorCount\n";
    echo "📋 Total procesados: " . ($updatedCount + $skippedCount + $errorCount) . "\n\n";
    
    // Mostrar algunos ejemplos de los cambios
    echo "📋 EJEMPLOS DE REGISTROS RENOMBRADOS:\n";
    echo str_repeat("=", 80) . "\n";
    $samples = $mysqli->query("
        SELECT Id, Name 
        FROM document_type 
        ORDER BY Id 
        LIMIT 20
    ");
    
    if ($samples && $samples->num_rows > 0) {
        echo sprintf("%-5s %-60s\n", "ID", "Nombre");
        echo str_repeat("-", 65) . "\n";
        while ($sample = $samples->fetch_assoc()) {
            echo sprintf("%-5s %-60s\n",
                $sample['Id'],
                $sample['Name']
            );
        }
    }
    
    $mysqli->close();
    
    echo "\n✅ Proceso completado\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
