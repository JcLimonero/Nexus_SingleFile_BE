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
    echo "🚀 Creando vista view_client...\n";
    
    // Primero eliminar la vista si existe
    $dropSql = "DROP VIEW IF EXISTS view_client";
    $pdo->exec($dropSql);
    echo "🗑️  Vista anterior eliminada (si existía)\n";
    
    // Crear la nueva vista
    $createSql = "
    CREATE VIEW view_client AS
    SELECT 
        c.Id as idCliente,
        ctr.IdTotalDealer as ndCliente,
        TRIM(CONCAT(COALESCE(c.Name, ''), ' ', COALESCE(c.LastName, ''), ' ', COALESCE(c.MotherLastName, ''))) as cliente,
        c.Name as nombre,
        c.LastName as apellidoPaterno,
        c.MotherLastName as apellidoMaterno,
        c.RFC as rfc,
        c.Email as email,
        c.TelNumber as telefono,
        c.TelNumber2 as telefono2,
        c.RazonSocial as razonSocial,
        c.CURP as curp,
        c.Adviser as asesor,
        c.AgencyOrigin as agenciaOrigen,
        c.RegistrationDate as fechaRegistro,
        c.UpdateDate as fechaActualizacion,
        f.IdAgency as idAgency
    FROM Client c
    INNER JOIN HeaderClient hc ON c.Id = hc.IdClient
    INNER JOIN Client_Total_Relation ctr ON hc.Id = ctr.idHeaderClient
    INNER JOIN File f ON hc.Id = f.IdClient
    WHERE ((c.Name IS NOT NULL AND c.Name != '') 
        OR (c.LastName IS NOT NULL AND c.LastName != '') 
        OR (c.MotherLastName IS NOT NULL AND c.MotherLastName != ''))
    ";
    
    $pdo->exec($createSql);
    echo "✅ Vista view_client creada exitosamente\n";
    
    // Verificar la estructura de la vista
    echo "📋 Verificando estructura de la vista...\n";
    $describeQuery = $pdo->query("DESCRIBE view_client");
    $columns = $describeQuery->fetchAll(PDO::FETCH_ASSOC);
    
    echo "📊 Columnas de la vista:\n";
    foreach ($columns as $column) {
        echo "   - {$column['Field']}: {$column['Type']}\n";
    }
    
    // Probar la vista con una consulta simple
    echo "🧪 Probando la vista...\n";
    $testQuery = $pdo->query("SELECT COUNT(*) as total FROM view_client LIMIT 1");
    $result = $testQuery->fetch(PDO::FETCH_ASSOC);
    echo "📈 Total de registros en la vista: {$result['total']}\n";
    
    if ($result['total'] > 0) {
        echo "✅ Vista funcionando correctamente\n";
    } else {
        echo "⚠️  Advertencia: La vista no tiene registros\n";
    }
    
} catch (PDOException $e) {
    echo "❌ Error de base de datos: " . $e->getMessage() . "\n";
    echo "🔍 Detalles:\n";
    echo "   - Código: " . $e->getCode() . "\n";
    echo "   - Archivo: " . $e->getFile() . "\n";
    echo "   - Línea: " . $e->getLine() . "\n";
    exit(1);
} catch (Exception $e) {
    echo "❌ Error general: " . $e->getMessage() . "\n";
    exit(1);
}

echo "\n🎯 Próximos pasos:\n";
echo "   1. Probar el endpoint: GET /api/client-search/search?id=1&search=38\n";
echo "   2. Verificar que encuentra el cliente 38 en la agencia Geely\n";
echo "   3. Probar búsquedas de texto en razonSocial\n";
echo "   4. Revisar los logs del servidor para debugging\n";
