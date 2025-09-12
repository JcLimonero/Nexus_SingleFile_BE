<?php

// Configuración de base de datos
$host = 'localhost';
$dbname = 'singlefile_db';
$username = 'root';
$password = '00@Limonero';

try {
    echo "🚀 Conectando a la base de datos...\n";
    
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✅ Conexión exitosa\n";
    echo "🔍 Buscando cliente con ndCliente = '38'...\n";
    
    // Buscar cliente con número exacto 38
    $sql = "SELECT * FROM view_client WHERE ndCliente = '38'";
    $stmt = $pdo->query($sql);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($results) > 0) {
        echo "✅ Cliente encontrado:\n";
        foreach ($results as $client) {
            echo "   - ID Cliente: {$client['idCliente']}\n";
            echo "   - Número Cliente: {$client['ndCliente']}\n";
            echo "   - Nombre: {$client['cliente']}\n";
            echo "   - Razón Social: {$client['razonSocial']}\n";
            echo "   - Agencia: {$client['idAgency']}\n";
            echo "   - RFC: {$client['rfc']}\n";
            echo "   - Email: {$client['email']}\n";
            echo "   ---\n";
        }
    } else {
        echo "❌ No se encontró cliente con ndCliente = '38'\n";
        
        // Buscar clientes que contengan 38
        echo "🔍 Buscando clientes que contengan '38' en ndCliente...\n";
        $sql2 = "SELECT * FROM view_client WHERE ndCliente LIKE '%38%' LIMIT 10";
        $stmt2 = $pdo->query($sql2);
        $results2 = $stmt2->fetchAll(PDO::FETCH_ASSOC);
        
        if (count($results2) > 0) {
            echo "📋 Clientes que contienen '38':\n";
            foreach ($results2 as $client) {
                echo "   - ID: {$client['idCliente']}, Número: {$client['ndCliente']}, Nombre: {$client['cliente']}, Agencia: {$client['idAgency']}\n";
            }
        } else {
            echo "❌ No se encontraron clientes que contengan '38'\n";
        }
    }
    
    // Verificar agencias disponibles
    echo "\n🏢 Verificando agencias disponibles...\n";
    $sql3 = "SELECT DISTINCT idAgency FROM view_client ORDER BY idAgency";
    $stmt3 = $pdo->query($sql3);
    $agencies = $stmt3->fetchAll(PDO::FETCH_COLUMN);
    
    echo "📊 Agencias con clientes:\n";
    foreach ($agencies as $agency) {
        $countSql = "SELECT COUNT(*) as count FROM view_client WHERE idAgency = ?";
        $countStmt = $pdo->prepare($countSql);
        $countStmt->execute([$agency]);
        $count = $countStmt->fetch(PDO::FETCH_ASSOC)['count'];
        echo "   - Agencia {$agency}: {$count} clientes\n";
    }
    
} catch (PDOException $e) {
    echo "❌ Error de base de datos: " . $e->getMessage() . "\n";
    exit(1);
}
