<?php

// Script de prueba para el API de creación de files desde Vanguardia con datos reales

// Datos de prueba basados en la estructura real del frontend
$testData = [
    'order' => [
        'idAgency' => '99999',
        'order_dms' => '565',
        'year' => '2024',
        'model' => 'OKAVANGO',
        'version' => 'GF, SUV, 2.0 LTS., TURBO',
        'external_color' => 'NEGRO',
        'internal_color' => 'NEGRO',
        'vin' => 'L6TVX1S67RY011800',
        'consultantName' => 'RAUL IVAN PEREZ CEPEDA',
        'ndConsultant' => '57',
        'chassis' => '',
        'inventory' => '',
        'customerDMS' => '38'
    ],
    'process' => [
        'Id' => '1',
        'Name' => 'AUTOS NUEVOS'
    ],
    'costumerType' => [
        'Id' => '2',
        'Name' => 'PERSONA FISICA'
    ],
    'operationType' => [
        'Id' => '1',
        'Name' => 'CONTADO'
    ],
    'clientId' => '38',
    'agencyId' => 24
];

// URL del API
$url = 'http://localhost:8080/api/files/create-from-vanguardia-new';

// Configurar cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($testData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer test-token' // Token de prueba
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);

echo "🚀 Probando creación de file desde Vanguardia (DATOS REALES)...\n";
echo "📋 Datos de prueba:\n";
echo json_encode($testData, JSON_PRETTY_PRINT) . "\n\n";

// Ejecutar la petición
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);

curl_close($ch);

echo "📊 Respuesta del servidor:\n";
echo "HTTP Code: $httpCode\n";

if ($error) {
    echo "❌ Error cURL: $error\n";
} else {
    echo "📄 Respuesta:\n";
    $responseData = json_decode($response, true);
    echo json_encode($responseData, JSON_PRETTY_PRINT) . "\n";
    
    if ($httpCode === 200 && isset($responseData['success']) && $responseData['success']) {
        echo "✅ File creado exitosamente!\n";
        echo "🆔 ID del file: " . ($responseData['data']['fileId'] ?? 'N/A') . "\n";
    } else {
        echo "❌ Error en la creación del file\n";
        if (isset($responseData['message'])) {
            echo "💬 Mensaje: " . $responseData['message'] . "\n";
        }
    }
}

?>
