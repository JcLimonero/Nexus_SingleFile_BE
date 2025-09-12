<?php

// Script de prueba para el API de creación de files desde Vanguardia

// Datos de prueba para crear un file
$testData = [
    'order' => [
        'idOrder' => '12345',
        'orderNumber' => 'ORD-12345',
        'amount' => 50000.00,
        'status' => 'Integracion',
        'ndConsultant' => 'CONSULTANT001'
    ],
    'process' => 1, // ID del proceso
    'costumerType' => 1, // ID del tipo de cliente
    'operationType' => 1, // ID del tipo de operación
    'clientId' => '11122', // ID del cliente (ndCliente)
    'agencyId' => 24 // ID de la agencia (Id interno)
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

echo "🚀 Probando creación de file desde Vanguardia (CORREGIDO)...\n";
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
