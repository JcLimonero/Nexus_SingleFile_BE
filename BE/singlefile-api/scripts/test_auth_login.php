<?php

// Script para probar el endpoint de login
// Uso: php test_auth_login.php

// Configuración
$baseUrl = 'http://localhost:8080';
$endpoint = '/api/auth/login';

// Datos de prueba
$testData = [
    'email' => 'carlos.limon@nexusqtech.com',
    'password' => 'admin'
];

echo "🧪 Probando endpoint de login...\n";
echo "📍 URL: {$baseUrl}{$endpoint}\n";
echo "📧 Email: {$testData['email']}\n";
echo "🔑 Password: {$testData['password']}\n\n";

// Crear contexto de la petición
$context = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => [
            'Content-Type: application/json',
            'Accept: application/json'
        ],
        'content' => json_encode($testData)
    ]
]);

// Realizar petición
$response = file_get_contents($baseUrl . $endpoint, false, $context);

if ($response === false) {
    echo "❌ Error: No se pudo conectar al servidor\n";
    echo "💡 Verifica que el servidor esté ejecutándose en {$baseUrl}\n";
    exit(1);
}

// Obtener headers de respuesta
$responseHeaders = $http_response_header ?? [];
$statusLine = $responseHeaders[0] ?? 'Unknown';

echo "📡 Status: {$statusLine}\n";
echo "📋 Headers:\n";
foreach ($responseHeaders as $header) {
    if ($header !== $statusLine) {
        echo "   {$header}\n";
    }
}

echo "\n📄 Respuesta:\n";
$decodedResponse = json_decode($response, true);

if (json_last_error() === JSON_ERROR_NONE) {
    echo "✅ JSON válido\n";
    echo "📊 Estructura de la respuesta:\n";
    print_r($decodedResponse);
} else {
    echo "❌ Error decodificando JSON: " . json_last_error_msg() . "\n";
    echo "📄 Respuesta raw:\n";
    echo $response . "\n";
}

echo "\n🔍 Análisis:\n";
if (isset($decodedResponse['success'])) {
    if ($decodedResponse['success']) {
        echo "✅ Login exitoso\n";
        echo "👤 Usuario: " . ($decodedResponse['user']['name'] ?? 'N/A') . "\n";
        echo "🔑 Access Token: " . (isset($decodedResponse['access_token']) ? 'Presente' : 'Ausente') . "\n";
        echo "🔄 Refresh Token: " . (isset($decodedResponse['refresh_token']) ? 'Presente' : 'Ausente') . "\n";
        echo "⏰ Expira en: " . ($decodedResponse['expires_in'] ?? 'N/A') . " segundos\n";
    } else {
        echo "❌ Login fallido\n";
        echo "💬 Mensaje: " . ($decodedResponse['message'] ?? 'N/A') . "\n";
    }
} else {
    echo "❓ Respuesta no reconocida\n";
}
