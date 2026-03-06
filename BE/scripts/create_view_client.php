<?php

require_once __DIR__ . '/../vendor/autoload.php';

use CodeIgniter\Config\Services;

// Configurar CodeIgniter
$config = new \Config\Database();
$db = \Config\Database::connect();

try {
    echo "🚀 Creando vista view_client...\n";
    
    // Leer el archivo SQL
    $sqlFile = __DIR__ . '/create_view_client.sql';
    if (!file_exists($sqlFile)) {
        throw new Exception("Archivo SQL no encontrado: $sqlFile");
    }
    
    $sql = file_get_contents($sqlFile);
    
    // Ejecutar la consulta
    $result = $db->query($sql);
    
    if ($result) {
        echo "✅ Vista view_client creada exitosamente\n";
        echo "📋 Columnas disponibles:\n";
        echo "   - idCliente: ID interno del cliente\n";
        echo "   - ndCliente: Número de cliente (para búsquedas numéricas)\n";
        echo "   - cliente: Nombre completo concatenado\n";
        echo "   - nombre: Nombre del cliente\n";
        echo "   - apellidoPaterno: Apellido paterno\n";
        echo "   - apellidoMaterno: Apellido materno\n";
        echo "   - rfc: RFC del cliente\n";
        echo "   - email: Email del cliente\n";
        echo "   - telefono: Teléfono principal\n";
        echo "   - telefono2: Teléfono secundario\n";
        echo "   - razonSocial: Razón social (para búsquedas de texto)\n";
        echo "   - curp: CURP del cliente\n";
        echo "   - asesor: Asesor asignado\n";
        echo "   - agenciaOrigen: Agencia de origen\n";
        echo "   - fechaRegistro: Fecha de registro\n";
        echo "   - fechaActualizacion: Fecha de actualización\n";
        echo "   - idAgency: ID de la agencia (filtro obligatorio)\n";
        
        // Verificar que la vista se creó correctamente
        $checkQuery = $db->query("SHOW TABLES LIKE 'view_client'");
        if ($checkQuery->getNumRows() > 0) {
            echo "✅ Vista verificada en la base de datos\n";
        } else {
            echo "⚠️  Advertencia: La vista no se encontró después de la creación\n";
        }
        
    } else {
        throw new Exception("Error al ejecutar la consulta SQL");
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "🔍 Detalles del error:\n";
    echo "   - Archivo: " . $e->getFile() . "\n";
    echo "   - Línea: " . $e->getLine() . "\n";
    exit(1);
}

echo "\n🎯 Próximos pasos:\n";
echo "   1. Probar el endpoint: GET /api/client-search/search?id=1&search=38\n";
echo "   2. Verificar que encuentra el cliente 38 en la agencia Geely\n";
echo "   3. Probar búsquedas de texto en razonSocial\n";
echo "   4. Revisar los logs del servidor para debugging\n";
