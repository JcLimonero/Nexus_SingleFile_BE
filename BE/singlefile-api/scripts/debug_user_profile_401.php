<?php
/**
 * Script para diagnosticar por qué /api/user/profile devuelve 401
 * Mientras que otros endpoints funcionan correctamente
 */

// Configuración
$baseUrl = 'http://localhost:8080';
$loginEndpoint = '/api/auth/login';
$profileEndpoint = '/api/user/profile';
$testEndpoint = '/api/agency'; // Endpoint que sabemos que funciona

// Credenciales de prueba
$loginData = [
    'email' => 'carlos.limon@nexusqtech.com',
    'password' => 'admin123'
];

echo "🔍 Diagnóstico del endpoint /api/user/profile\n";
echo "============================================\n\n";

// Paso 1: Login para obtener token
echo "1️⃣ Intentando login...\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $baseUrl . $loginEndpoint);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($loginData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "   HTTP Code: $httpCode\n";
echo "   Response: $response\n\n";

if ($httpCode !== 200) {
    echo "❌ Login falló. Probando con contraseña diferente...\n";
    
    // Probar con contraseña diferente
    $loginData['password'] = 'admin';
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $baseUrl . $loginEndpoint);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($loginData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json'
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    echo "   HTTP Code (segundo intento): $httpCode\n";
    echo "   Response (segundo intento): $response\n\n";
    
    if ($httpCode !== 200) {
        echo "❌ Login falló en ambos intentos. No podemos continuar.\n";
        exit(1);
    }
}

$loginResult = json_decode($response, true);
if (!isset($loginResult['access_token'])) {
    echo "❌ No se obtuvo token del login.\n";
    exit(1);
}

$token = $loginResult['access_token'];
echo "✅ Login exitoso. Token obtenido.\n\n";

// Paso 2: Probar endpoint que sabemos que funciona
echo "2️⃣ Probando endpoint que funciona (/api/agency)...\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $baseUrl . $testEndpoint);
curl_setopt($ch, CURLOPT_HTTPGET, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $token,
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "   HTTP Code: $httpCode\n";
echo "   Response: " . substr($response, 0, 200) . "...\n\n";

if ($httpCode !== 200) {
    echo "❌ Endpoint de prueba también falló. Problema general de autenticación.\n";
    exit(1);
}

echo "✅ Endpoint de prueba funciona correctamente.\n\n";

// Paso 3: Probar endpoint problemático con más detalle
echo "3️⃣ Probando endpoint problemático (/api/user/profile)...\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $baseUrl . $profileEndpoint);
curl_setopt($ch, CURLOPT_HTTPGET, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $token,
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_VERBOSE, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

echo "   HTTP Code: $httpCode\n";
echo "   cURL Error: " . ($error ?: 'Ninguno') . "\n";
echo "   Response: $response\n\n";

if ($httpCode === 401) {
    echo "🔍 Análisis del error 401:\n";
    echo "   - El token es válido (otro endpoint funciona)\n";
    echo "   - El problema está en el endpoint específico\n";
    echo "   - Posibles causas:\n";
    echo "     1. Middleware de autenticación específico para este endpoint\n";
    echo "     2. Problema en el método getUserIdFromToken()\n";
    echo "     3. Validación adicional de permisos\n";
    echo "     4. Problema en la ruta o configuración\n\n";
    
    echo "💡 Recomendaciones:\n";
    echo "   1. Verificar el middleware de autenticación en Routes.php\n";
    echo "   2. Revisar el método getUserIdFromToken() en UserProfile.php\n";
    echo "   3. Verificar que la ruta esté correctamente configurada\n";
    echo "   4. Revisar logs del backend para más detalles\n";
} else {
    echo "✅ Endpoint de perfil funciona correctamente.\n";
}

echo "\n🏁 Diagnóstico completado.\n";
?>
