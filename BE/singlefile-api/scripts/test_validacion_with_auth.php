<?php
// Script para probar el endpoint de validación con autenticación
// Primero hace login y luego prueba los endpoints

$baseUrl = 'http://localhost:8080/api/clients-validation';

echo "🔐 PROBANDO ENDPOINTS DE CLIENTS-VALIDATION CON AUTENTICACIÓN\n";
echo "============================================================\n\n";

// 1. Hacer login para obtener token
echo "1️⃣ HACIENDO LOGIN PARA OBTENER TOKEN\n";
echo "------------------------------------\n";

$loginData = [
    'email' => 'carlos.limon@nexusqtech.com',
    'password' => 'admin123'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $baseUrl . '/auth/login');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($loginData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: $httpCode\n";
echo "Response:\n";
$loginResponse = json_decode($response, true);
if ($loginResponse) {
    echo json_encode($loginResponse, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
} else {
    echo $response;
}

if (!$loginResponse || !isset($loginResponse['data']['access_token'])) {
    echo "\n❌ No se pudo obtener el token de acceso\n";
    exit(1);
}

$token = $loginResponse['data']['access_token'];
echo "\n✅ Token obtenido: " . substr($token, 0, 50) . "...\n\n";

// 2. Probar endpoint de clientes con token
echo "2️⃣ PROBANDO GET /api/clients-validation/clientes CON TOKEN\n";
echo "--------------------------------------------------------\n";

$url = $baseUrl . '/clientes?idAgency=1&idProcess=1&page=1&limit=5';
echo "URL: $url\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json',
    'Authorization: Bearer ' . $token
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: $httpCode\n";
echo "Response:\n";
$responseData = json_decode($response, true);
if ($responseData) {
    echo json_encode($responseData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
} else {
    echo $response;
}
echo "\n\n";

// 3. Probar endpoint de estadísticas con token
echo "3️⃣ PROBANDO GET /api/clients-validation/estadisticas CON TOKEN\n";
echo "------------------------------------------------------------\n";

$url = $baseUrl . '/estadisticas?idAgency=1&idProcess=1';
echo "URL: $url\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json',
    'Authorization: Bearer ' . $token
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: $httpCode\n";
echo "Response:\n";
$responseData = json_decode($response, true);
if ($responseData) {
    echo json_encode($responseData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
} else {
    echo $response;
}
echo "\n\n";

// 4. Probar endpoint de documentos con token
echo "4️⃣ PROBANDO GET /api/clients-validation/documentos/286 CON TOKEN\n";
echo "----------------------------------------------------------------\n";

$url = $baseUrl . '/documentos/286';
echo "URL: $url\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json',
    'Authorization: Bearer ' . $token
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: $httpCode\n";
echo "Response:\n";
$responseData = json_decode($response, true);
if ($responseData) {
    echo json_encode($responseData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
} else {
    echo $response;
}
echo "\n\n";

echo "✅ Pruebas con autenticación completadas\n";
?>
