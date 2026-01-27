<?php
/**
 * Script para reparar la relación Client_Total_Relation del File ID 15504
 * Ejecutar desde la línea de comandos: php scripts/reparar_relacion_15504.php
 */

echo "═══════════════════════════════════════════════════════════════\n";
echo "  REPARAR RELACIÓN CLIENT_AGENCIA PARA FILE 15504\n";
echo "═══════════════════════════════════════════════════════════════\n\n";

// Configuración de conexión
$hostname = '192.168.190.140';
$port = 3306;
$username = 'vgd_testing';
$password = '00@DealerSolutions';
$database = 'single_file';

try {
    // Intentar conectar
    $mysqli = @new mysqli($hostname, $username, $password, $database, $port);
    
    if ($mysqli->connect_error) {
        // Intentar con el otro nombre de base de datos
        $database = 'singlefile_db';
        $mysqli = @new mysqli($hostname, $username, $password, $database, $port);
        
        if ($mysqli->connect_error) {
            throw new Exception("Error de conexión: " . $mysqli->connect_error);
        }
    }
    
    $mysqli->set_charset("utf8mb4");
    
    $idFile = 15504;
    
    // 1. Obtener información del File
    echo "1. Obteniendo información del File $idFile...\n";
    $sql = "SELECT f.Id, f.IdClient, f.IdAgency FROM File f WHERE f.Id = ?";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param('i', $idFile);
    $stmt->execute();
    $result = $stmt->get_result();
    $file = $result->fetch_assoc();
    $stmt->close();
    
    if (!$file) {
        throw new Exception("El File $idFile no existe");
    }
    
    // File.IdClient = Client.Id (convención del proyecto). Resolver HeaderClient.Id para Client_Total_Relation.
    $idClient = (int) $file['IdClient'];
    $idAgency = (int) $file['IdAgency'];
    $idHeaderClient = null;
    $sqlHc = "SELECT hc.Id FROM HeaderClient hc WHERE hc.IdClient = ? LIMIT 1";
    $stmtHc = $mysqli->prepare($sqlHc);
    $stmtHc->bind_param('i', $idClient);
    $stmtHc->execute();
    $resHc = $stmtHc->get_result();
    if ($rowHc = $resHc->fetch_assoc()) {
        $idHeaderClient = (int) $rowHc['Id'];
    }
    $stmtHc->close();
    if ($idHeaderClient === null) {
        throw new Exception("No existe HeaderClient para Client.Id = $idClient (File.IdClient). No se puede crear Client_Total_Relation.");
    }
    
    echo "   ✅ File encontrado:\n";
    echo "      - Client ID (File.IdClient): $idClient\n";
    echo "      - HeaderClient ID (para relación): $idHeaderClient\n";
    echo "      - Agencia ID: $idAgency\n\n";
    
    // 2. Verificar si ya existe la relación
    echo "2. Verificando si ya existe la relación...\n";
    $sql = "SELECT 1 FROM Client_Total_Relation ctr WHERE ctr.idHeaderClient = ? AND ctr.IdAgency = ?";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param('ii', $idHeaderClient, $idAgency);
    $stmt->execute();
    $result = $stmt->get_result();
    $existe = $result->fetch_assoc();
    $stmt->close();
    
    if ($existe) {
        echo "   ✅ La relación ya existe. No se requiere reparación.\n";
        $mysqli->close();
        exit(0);
    }
    
    echo "   ⚠️  La relación NO existe. Se creará.\n\n";
    
    // 3. Obtener IdTotalDealer de otra relación existente
    echo "3. Obteniendo IdTotalDealer de relación existente...\n";
    $sql = "SELECT ctr.IdTotalDealer FROM Client_Total_Relation ctr WHERE ctr.idHeaderClient = ? LIMIT 1";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param('i', $idHeaderClient);
    $stmt->execute();
    $result = $stmt->get_result();
    $otro = $result->fetch_assoc();
    $stmt->close();
    
    $idTotalDealer = $otro ? trim((string) ($otro['IdTotalDealer'] ?? '')) : '';
    
    if ($idTotalDealer) {
        echo "   ✅ IdTotalDealer encontrado: $idTotalDealer\n\n";
    } else {
        echo "   ⚠️  No se encontró IdTotalDealer. Se usará vacío.\n\n";
    }
    
    // 4. Obtener el siguiente ID
    echo "4. Obteniendo siguiente ID disponible...\n";
    $sql = "SELECT COALESCE(MAX(Id), 0) + 1 AS nextId FROM Client_Total_Relation";
    $result = $mysqli->query($sql);
    $row = $result->fetch_assoc();
    $nextId = (int) ($row['nextId'] ?? 1);
    echo "   ✅ Siguiente ID: $nextId\n\n";
    
    // 5. Crear la relación
    echo "5. Creando la relación Client_Total_Relation...\n";
    $sql = "INSERT INTO Client_Total_Relation (Id, idHeaderClient, IdAgency, IdTotalDealer) VALUES (?, ?, ?, ?)";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param('iiis', $nextId, $idHeaderClient, $idAgency, $idTotalDealer);
    
    if ($stmt->execute()) {
        echo "   ✅ Relación creada exitosamente!\n";
        echo "      - ID Relación: $nextId\n";
        echo "      - HeaderClient ID: $idHeaderClient\n";
        echo "      - Agencia ID: $idAgency\n";
        echo "      - IdTotalDealer: " . ($idTotalDealer ?: '(vacío)') . "\n\n";
    } else {
        throw new Exception("Error al crear la relación: " . $stmt->error);
    }
    $stmt->close();
    
    // 6. Verificar que se creó correctamente
    echo "6. Verificando que la relación se creó correctamente...\n";
    $sql = "SELECT ctr.Id, ctr.idHeaderClient, ctr.IdAgency, ctr.IdTotalDealer, a.Name as nombreAgencia 
            FROM Client_Total_Relation ctr 
            LEFT JOIN Agency a ON ctr.IdAgency = a.Id 
            WHERE ctr.Id = ?";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param('i', $nextId);
    $stmt->execute();
    $result = $stmt->get_result();
    $verificacion = $result->fetch_assoc();
    $stmt->close();
    
    if ($verificacion) {
        echo "   ✅ Verificación exitosa:\n";
        echo "      - ID: " . $verificacion['Id'] . "\n";
        echo "      - Agencia: " . ($verificacion['nombreAgencia'] ?? 'N/A') . " (ID: " . $verificacion['IdAgency'] . ")\n";
        echo "      - HeaderClient: " . $verificacion['idHeaderClient'] . "\n";
        echo "      - IdTotalDealer: " . ($verificacion['IdTotalDealer'] ?: '(vacío)') . "\n\n";
    }
    
    $mysqli->close();
    
    echo "═══════════════════════════════════════════════════════════════\n";
    echo "  ✅ REPARACIÓN COMPLETADA EXITOSAMENTE\n";
    echo "═══════════════════════════════════════════════════════════════\n\n";
    echo "El File 15504 ahora debería aparecer en la ventana de validación\n";
    echo "cuando tengas Renault seleccionado.\n";
    
} catch (\Exception $e) {
    echo "❌ ERROR: " . $e->getMessage() . "\n";
    if (isset($mysqli)) {
        $mysqli->close();
    }
    exit(1);
}
