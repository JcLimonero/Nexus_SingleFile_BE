<?php
// Script temporal para probar la API de documentos requeridos
header('Content-Type: application/json');

// Configuración de la base de datos
$host = 'localhost';
$dbname = 'singlefile';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Simular los filtros que se envían desde el frontend
    $IdProcess = $_GET['IdProcess'] ?? '1';
    $IdAgency = $_GET['IdAgency'] ?? '1';
    $IdCostumerType = $_GET['IdCostumerType'] ?? '1';
    $IdOperationType = $_GET['IdOperationType'] ?? '1';
    
    echo "Filtros recibidos:\n";
    echo "IdProcess: $IdProcess\n";
    echo "IdAgency: $IdAgency\n";
    echo "IdCostumerType: $IdCostumerType\n";
    echo "IdOperationType: $IdOperationType\n\n";
    
    // Consulta para obtener documentos requeridos
    $sql = "SELECT * FROM ConfigurationProcess_DocumentType 
            WHERE IdProcess = ? AND IdAgency = ? AND IdCostumerType = ? AND IdOperationType = ?";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$IdProcess, $IdAgency, $IdCostumerType, $IdOperationType]);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "Documentos encontrados: " . count($results) . "\n";
    echo "Datos:\n";
    print_r($results);
    
    // También verificar la tabla completa
    echo "\n\nTabla completa ConfigurationProcess_DocumentType:\n";
    $stmt2 = $pdo->query("SELECT * FROM ConfigurationProcess_DocumentType LIMIT 10");
    $allResults = $stmt2->fetchAll(PDO::FETCH_ASSOC);
    print_r($allResults);
    
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
