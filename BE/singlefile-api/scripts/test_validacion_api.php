<?php
// Script para probar el endpoint de validación
// Simula las llamadas HTTP que hará el frontend

$baseUrl = 'http://localhost:3500/api/validacion';

echo "🧪 PROBANDO ENDPOINTS DE VALIDACIÓN\n";
echo "===================================\n\n";

// 1. Probar endpoint de clientes
echo "1️⃣ PROBANDO GET /api/validacion/clientes\n";
echo "----------------------------------------\n";

$url = $baseUrl . '/clientes?idAgency=1&idProcess=1&page=1&limit=5';
echo "URL: $url\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
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
$responseData = json_decode($response, true);
if ($responseData) {
    echo json_encode($responseData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
} else {
    echo $response;
}
echo "\n\n";

// 2. Probar endpoint de estadísticas
echo "2️⃣ PROBANDO GET /api/validacion/estadisticas\n";
echo "---------------------------------------------\n";

$url = $baseUrl . '/estadisticas?idAgency=1&idProcess=1';
echo "URL: $url\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
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
$responseData = json_decode($response, true);
if ($responseData) {
    echo json_encode($responseData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
} else {
    echo $response;
}
echo "\n\n";

// 3. Probar endpoint de documentos
echo "3️⃣ PROBANDO GET /api/validacion/documentos/286\n";
echo "-----------------------------------------------\n";

$url = $baseUrl . '/documentos/286';
echo "URL: $url\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
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
$responseData = json_decode($response, true);
if ($responseData) {
    echo json_encode($responseData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
} else {
    echo $response;
}
echo "\n\n";

// 4. Probar con parámetros inválidos
echo "4️⃣ PROBANDO CON PARÁMETROS INVÁLIDOS\n";
echo "-------------------------------------\n";

$url = $baseUrl . '/clientes';
echo "URL: $url (sin parámetros)\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
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
$responseData = json_decode($response, true);
if ($responseData) {
    echo json_encode($responseData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
} else {
    echo $response;
}
echo "\n\n";

echo "✅ Pruebas completadas\n";
?>
