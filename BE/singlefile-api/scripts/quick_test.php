<?php
/**
 * Script de prueba rápida para la API de documentos
 * Ejecutar: php quick_test.php
 */

echo "🚀 PRUEBA RÁPIDA DE LA API DE DOCUMENTOS\n";
echo "========================================\n\n";

// Configuración
$baseUrl = 'http://localhost:3500/api/clients-validation';

// Función para hacer request HTTP
function makeRequest($url, $description) {
    echo "🔍 $description\n";
    echo "   URL: $url\n";
    
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => 'Content-Type: application/json',
            'timeout' => 10
        ]
    ]);
    
    $response = @file_get_contents($url, false, $context);
    
    if ($response === false) {
        echo "   ❌ Error de conexión\n";
        return false;
    }
    
    $data = json_decode($response, true);
    if ($data) {
        echo "   ✅ Respuesta recibida\n";
        echo "   📊 Success: " . ($data['success'] ? 'true' : 'false') . "\n";
        if (isset($data['message'])) {
            echo "   📝 Mensaje: " . $data['message'] . "\n";
        }
        if (isset($data['data']) && is_array($data['data'])) {
            echo "   📄 Documentos: " . count($data['data']) . "\n";
        }
    } else {
        echo "   ⚠️ Respuesta no es JSON válido\n";
        echo "   📄 Raw: " . substr($response, 0, 200) . "...\n";
    }
    
    echo "\n";
    return $data;
}

// Pruebas
echo "1️⃣ Probando endpoint de clientes...\n";
$clientes = makeRequest("$baseUrl/clientes?id=999&idProcess=999", "GET /clientes");

echo "2️⃣ Probando endpoint de documentos (caso exitoso)...\n";
$documentos = makeRequest("$baseUrl/documentos?clienteId=999&pedidoId=999", "GET /documentos con parámetros válidos");

echo "3️⃣ Probando endpoint de documentos (sin parámetros)...\n";
$error1 = makeRequest("$baseUrl/documentos", "GET /documentos sin parámetros");

echo "4️⃣ Probando endpoint de documentos (solo clienteId)...\n";
$error2 = makeRequest("$baseUrl/documentos?clienteId=999", "GET /documentos solo con clienteId");

echo "5️⃣ Probando endpoint de estadísticas...\n";
$estadisticas = makeRequest("$baseUrl/estadisticas?id=999&idProcess=999", "GET /estadisticas");

// Resumen
echo "📊 RESUMEN DE PRUEBAS:\n";
echo "======================\n";

$tests = [
    'Clientes' => $clientes,
    'Documentos (válido)' => $documentos,
    'Documentos (sin params)' => $error1,
    'Documentos (solo clienteId)' => $error2,
    'Estadísticas' => $estadisticas
];

foreach ($tests as $name => $result) {
    if ($result === false) {
        echo "❌ $name: Error de conexión\n";
    } elseif ($result && isset($result['success'])) {
        $status = $result['success'] ? '✅' : '⚠️';
        echo "$status $name: " . ($result['success'] ? 'OK' : 'Error esperado') . "\n";
    } else {
        echo "❓ $name: Respuesta inesperada\n";
    }
}

echo "\n🎯 RESULTADO:\n";
if ($documentos && $documentos['success'] && isset($documentos['data'])) {
    echo "✅ La API está funcionando correctamente\n";
    echo "📄 Se encontraron " . count($documentos['data']) . " documentos\n";
} else {
    echo "❌ La API no está funcionando correctamente\n";
    echo "💡 Verifica:\n";
    echo "   - Que el servidor esté corriendo en puerto 3500\n";
    echo "   - Que las rutas estén configuradas\n";
    echo "   - Que haya datos de prueba en la BD\n";
}
?>

