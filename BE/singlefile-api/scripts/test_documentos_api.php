<?php
/**
 * Script para probar la API de documentos de validación
 * Ejecutar desde la línea de comandos: php test_documentos_api.php
 */

// Configuración de la base de datos para obtener datos de prueba
$host = 'localhost';
$dbname = 'singlefile_db';
$username = 'root';
$password = '00@Limonero';

try {
    // Crear conexión PDO
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✅ Conexión a la base de datos establecida\n\n";
    
    // 1. Obtener datos de prueba de la base de datos
    echo "🔍 OBTENIENDO DATOS DE PRUEBA:\n";
    echo "================================\n";
    
    // Obtener un cliente y pedido de ejemplo
    $stmt = $pdo->query("
        SELECT 
            f.Id as clienteId,
            f.IdOrder as pedidoId,
            c.Name as clienteName,
            p.Name as procesoName
        FROM File f
        JOIN HeaderClient hc ON f.IdClient = hc.Id
        JOIN Client c ON hc.IdClient = c.Id
        JOIN Process p ON f.IdProcess = p.Id
        WHERE f.IdAgency = 1 
        AND f.IdProcess = 1
        LIMIT 1
    ");
    
    $clienteEjemplo = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$clienteEjemplo) {
        echo "❌ No se encontraron clientes de ejemplo\n";
        exit(1);
    }
    
    echo "✅ Cliente de ejemplo encontrado:\n";
    echo "   - ID Cliente: {$clienteEjemplo['clienteId']}\n";
    echo "   - ID Pedido: {$clienteEjemplo['pedidoId']}\n";
    echo "   - Nombre: {$clienteEjemplo['clienteName']}\n";
    echo "   - Proceso: {$clienteEjemplo['procesoName']}\n\n";
    
    // 2. Verificar que existan documentos para este cliente
    echo "📄 VERIFICANDO DOCUMENTOS DEL CLIENTE:\n";
    echo "=====================================\n";
    
    $stmt = $pdo->prepare("
        SELECT COUNT(*) as total
        FROM DocumentByFile dbf
        JOIN File f ON dbf.IdFile = f.Id
        WHERE f.Id = ? AND f.IdOrder = ?
    ");
    
    $stmt->execute([$clienteEjemplo['clienteId'], $clienteEjemplo['pedidoId']]);
    $totalDocumentos = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    echo "📊 Total de documentos encontrados: {$totalDocumentos}\n\n";
    
    if ($totalDocumentos == 0) {
        echo "⚠️ No hay documentos para este cliente/pedido\n";
        echo "   Esto puede ser normal si el cliente es nuevo\n\n";
    }
    
    // 3. Probar la API directamente
    echo "🌐 PROBANDO LA API DE DOCUMENTOS:\n";
    echo "=================================\n";
    
    $baseUrl = 'http://localhost:3500/api/clients-validation';
    $clienteId = $clienteEjemplo['clienteId'];
    $pedidoId = $clienteEjemplo['pedidoId'];
    
    echo "🔗 URL de prueba: {$baseUrl}/documentos?clienteId={$clienteId}&pedidoId={$pedidoId}\n\n";
    
    // Crear contexto de stream para la petición HTTP
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => [
                'Content-Type: application/json',
                'Accept: application/json'
            ],
            'timeout' => 30
        ]
    ]);
    
    // Realizar petición HTTP
    $url = "{$baseUrl}/documentos?clienteId={$clienteId}&pedidoId={$pedidoId}";
    $response = file_get_contents($url, false, $context);
    
    if ($response === false) {
        echo "❌ Error al conectar con la API\n";
        echo "   Verifica que el servidor esté corriendo en el puerto 3500\n";
        echo "   Verifica que la ruta esté configurada correctamente\n\n";
    } else {
        echo "✅ Respuesta de la API recibida\n";
        echo "📄 Contenido de la respuesta:\n";
        echo "-----------------------------\n";
        echo $response . "\n\n";
        
        // Decodificar JSON para verificar estructura
        $data = json_decode($response, true);
        if ($data) {
            echo "🔍 ANÁLISIS DE LA RESPUESTA:\n";
            echo "============================\n";
            
            if (isset($data['success'])) {
                echo "✅ Campo 'success': " . ($data['success'] ? 'true' : 'false') . "\n";
            }
            
            if (isset($data['message'])) {
                echo "📝 Mensaje: {$data['message']}\n";
            }
            
            if (isset($data['data']) && is_array($data['data'])) {
                echo "📊 Datos: " . count($data['data']) . " documentos\n";
                
                if (count($data['data']) > 0) {
                    echo "🔍 Primer documento:\n";
                    $primerDoc = $data['data'][0];
                    foreach ($primerDoc as $key => $value) {
                        echo "   - {$key}: " . (is_bool($value) ? ($value ? 'true' : 'false') : $value) . "\n";
                    }
                }
            }
        } else {
            echo "❌ La respuesta no es un JSON válido\n";
        }
    }
    
    // 4. Probar casos de error
    echo "\n🧪 PROBANDO CASOS DE ERROR:\n";
    echo "============================\n";
    
    // Caso 1: Sin parámetros
    echo "🔍 Caso 1: Sin parámetros\n";
    $urlError1 = "{$baseUrl}/documentos";
    $responseError1 = file_get_contents($urlError1, false, $context);
    
    if ($responseError1 !== false) {
        $dataError1 = json_decode($responseError1, true);
        if ($dataError1 && isset($dataError1['success'])) {
            echo "   ✅ Respuesta de error recibida: " . ($dataError1['success'] ? 'true' : 'false') . "\n";
            echo "   📝 Mensaje: " . ($dataError1['message'] ?? 'N/A') . "\n";
        }
    }
    
    // Caso 2: Solo clienteId
    echo "🔍 Caso 2: Solo clienteId\n";
    $urlError2 = "{$baseUrl}/documentos?clienteId={$clienteId}";
    $responseError2 = file_get_contents($urlError2, false, $context);
    
    if ($responseError2 !== false) {
        $dataError2 = json_decode($responseError2, true);
        if ($dataError2 && isset($dataError2['success'])) {
            echo "   ✅ Respuesta de error recibida: " . ($dataError2['success'] ? 'true' : 'false') . "\n";
            echo "   📝 Mensaje: " . ($dataError2['message'] ?? 'N/A') . "\n";
        }
    }
    
    // Caso 3: Solo pedidoId
    echo "🔍 Caso 3: Solo pedidoId\n";
    $urlError3 = "{$baseUrl}/documentos?pedidoId={$pedidoId}";
    $responseError3 = file_get_contents($urlError3, false, $context);
    
    if ($responseError3 !== false) {
        $dataError3 = json_decode($urlError3, true);
        if ($dataError3 && isset($dataError3['success'])) {
            echo "   ✅ Respuesta de error recibida: " . ($dataError3['success'] ? 'true' : 'false') . "\n";
            echo "   📝 Mensaje: " . ($dataError3['message'] ?? 'N/A') . "\n";
        }
    }
    
    echo "\n✅ Pruebas completadas\n";
    
} catch (PDOException $e) {
    echo "❌ Error de base de datos: " . $e->getMessage() . "\n";
} catch (Exception $e) {
    echo "❌ Error general: " . $e->getMessage() . "\n";
}
?>

