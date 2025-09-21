<?php

// Script de prueba para el API de importación de clientes de Vanguardia

// Datos de prueba basados en la respuesta de Vanguardia
$testData = [
    'idAgency' => '10017',
    'ndDMS' => '555',
    'bussines_name' => 'CLIENTE FINAL HONDA',
    'name' => 'FINAL',
    'paternal_surname' => 'HONDA',
    'maternal_surname' => 'TEST',
    'rfc' => '',
    'curp' => ' ',
    'phone' => '5553333333',
    'mobile_phone' => '5553333334',
    'mail' => 'final.honda@vanguardia.com'
];

// URL del API
$url = 'http://localhost:8080/api/vanguardia-client-import/import';

// Configurar cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($testData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

echo "🚀 Probando importación de cliente de Vanguardia...\n";
echo "📋 Datos de prueba:\n";
echo json_encode($testData, JSON_PRETTY_PRINT) . "\n\n";

// Ejecutar la petición
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);

curl_close($ch);

echo "📊 Respuesta del servidor:\n";
echo "HTTP Code: " . $httpCode . "\n";

if ($error) {
    echo "❌ Error cURL: " . $error . "\n";
} else {
    echo "📄 Respuesta:\n";
    $responseData = json_decode($response, true);
    echo json_encode($responseData, JSON_PRETTY_PRINT) . "\n";
    
    if ($httpCode === 200 && isset($responseData['success']) && $responseData['success']) {
        echo "✅ Cliente importado exitosamente!\n";
        echo "🆔 ID del cliente: " . $responseData['data']['idCliente'] . "\n";
        echo "👤 Nombre: " . $responseData['data']['cliente'] . "\n";
    } else {
        echo "❌ Error en la importación\n";
    }
}
