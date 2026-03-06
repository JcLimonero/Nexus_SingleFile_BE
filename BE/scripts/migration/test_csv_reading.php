<?php

/**
 * Script de Prueba - Lectura de CSV
 * Prueba la lectura del archivo Agency.csv
 */

// Ruta al archivo CSV
$csv_file = '/Users/jclimonero/Documents/Developer/NexFile/script/Agency.csv';

echo "🧪 Probando lectura del archivo CSV...\n\n";

// Verificar que el archivo existe
if (!file_exists($csv_file)) {
    echo "❌ Archivo CSV no encontrado: $csv_file\n";
    exit(1);
}

echo "✅ Archivo CSV encontrado: " . basename($csv_file) . "\n";
echo "📁 Ruta completa: $csv_file\n\n";

// Leer y mostrar contenido del CSV
try {
    $handle = fopen($csv_file, 'r');
    
    if ($handle === false) {
        throw new Exception("No se pudo abrir el archivo CSV");
    }
    
    // Leer encabezados
    $headers = fgetcsv($handle);
    if (!$headers) {
        throw new Exception("No se pudieron leer los encabezados del CSV");
    }
    
    echo "📋 Encabezados detectados:\n";
    foreach ($headers as $index => $header) {
        echo "  $index: $header\n";
    }
    echo "\n";
    
    // Leer primeras 5 filas de datos
    echo "📊 Primeras 5 filas de datos:\n";
    $row_count = 0;
    while (($row = fgetcsv($handle)) !== false && $row_count < 5) {
        $row_count++;
        echo "  Fila $row_count: " . implode(' | ', $row) . "\n";
    }
    
    fclose($handle);
    
    echo "\n✅ Lectura del CSV completada exitosamente\n";
    
} catch (Exception $e) {
    echo "❌ Error leyendo CSV: " . $e->getMessage() . "\n";
    exit(1);
}
