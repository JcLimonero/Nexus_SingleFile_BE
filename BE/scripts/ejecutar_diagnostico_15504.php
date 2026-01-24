<?php
/**
 * Script para ejecutar diagnóstico del File ID 15504
 * Ejecutar desde la línea de comandos: php scripts/ejecutar_diagnostico_15504.php
 */

echo "═══════════════════════════════════════════════════════════════\n";
echo "  DIAGNÓSTICO DEL FILE ID 15504 (Renault)\n";
echo "═══════════════════════════════════════════════════════════════\n\n";

// Configuración de conexión
$hostname = '192.168.190.140';
$port = 3306;
$username = 'vgd_testing';
$password = '00@DealerSolutions';
$database = 'single_file'; // Intentar primero con single_file

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
    
    // Función helper para ejecutar queries
    function ejecutarQuery($mysqli, $sql, $params = []) {
        $stmt = $mysqli->prepare($sql);
        if (!$stmt) {
            throw new Exception("Error preparando query: " . $mysqli->error . "\nSQL: " . $sql);
        }
        
        if (!empty($params)) {
            // Determinar tipos de parámetros
            $types = '';
            foreach ($params as $param) {
                if (is_int($param)) {
                    $types .= 'i';
                } elseif (is_float($param)) {
                    $types .= 'd';
                } else {
                    $types .= 's';
                }
            }
            $stmt->bind_param($types, ...$params);
        }
        
        $stmt->execute();
        $result = $stmt->get_result();
        $rows = [];
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $rows[] = $row;
            }
        }
        $stmt->close();
        return $rows;
    }
    
    $idFile = 15504;
    
    // ============================================================================
    // PASO 1: Información básica del File 15504
    // ============================================================================
    echo "┌─────────────────────────────────────────────────────────────┐\n";
    echo "│ PASO 1: Información básica del File 15504                   │\n";
    echo "└─────────────────────────────────────────────────────────────┘\n";
    
    $sql1 = "
        SELECT 
            f.Id as idFile,
            f.IdOrderTotal as ndPedido,
            f.IdAgency,
            a.Name as nombreAgencia,
            f.IdProcess,
            p.Name as nombreProceso,
            p.Enabled as procesoHabilitado,
            f.IdCurrentState,
            fs.Name as estado,
            f.IdClient as idHeaderClient,
            CASE 
                WHEN f.IdAgency = 5 THEN '✅ File pertenece a Renault (id 5)'
                ELSE CONCAT('❌ File pertenece a otra agencia: ', f.IdAgency)
            END as verificacion_agencia,
            CASE 
                WHEN p.Enabled = 1 THEN '✅ Proceso está habilitado'
                ELSE '❌ Proceso NO está habilitado - ESTE ES UN PROBLEMA'
            END as verificacion_proceso,
            CASE 
                WHEN f.IdCurrentState != 5 THEN '✅ File NO está cancelado'
                ELSE '❌ File está cancelado - NO aparecerá en validación'
            END as verificacion_estado
        FROM File f
        LEFT JOIN Agency a ON f.IdAgency = a.Id
        LEFT JOIN Process p ON f.IdProcess = p.Id
        LEFT JOIN File_Status fs ON f.IdCurrentState = fs.Id
        WHERE f.Id = ?
    ";
    
    $results1 = ejecutarQuery($mysqli, $sql1, [$idFile]);
    $result1 = $results1[0] ?? null;
    
    if ($result1) {
        echo "  ID File: " . $result1['idFile'] . "\n";
        echo "  Número de Pedido: " . $result1['ndPedido'] . "\n";
        echo "  Agencia: " . $result1['nombreAgencia'] . " (ID: " . $result1['IdAgency'] . ")\n";
        echo "  Proceso: " . $result1['nombreProceso'] . " (ID: " . $result1['IdProcess'] . ")\n";
        echo "  Estado: " . $result1['estado'] . " (ID: " . $result1['IdCurrentState'] . ")\n";
        echo "  HeaderClient ID: " . $result1['idHeaderClient'] . "\n";
        echo "\n  Verificaciones:\n";
        echo "    " . $result1['verificacion_agencia'] . "\n";
        echo "    " . $result1['verificacion_proceso'] . "\n";
        echo "    " . $result1['verificacion_estado'] . "\n";
    } else {
        echo "  ❌ ERROR: El File 15504 no existe en la base de datos\n";
        exit(1);
    }
    
    echo "\n";
    
    // ============================================================================
    // PASO 2: Verificar HeaderClient y Client asociados
    // ============================================================================
    echo "┌─────────────────────────────────────────────────────────────┐\n";
    echo "│ PASO 2: Verificar HeaderClient y Client asociados          │\n";
    echo "└─────────────────────────────────────────────────────────────┘\n";
    
    $sql2 = "
        SELECT 
            f.Id as idFile,
            f.IdClient as idHeaderClient,
            hc.Id as headerClientExiste,
            hc.IdClient as idClient,
            c.Id as clientExiste,
            c.Name,
            c.LastName,
            c.RazonSocial,
            CASE 
                WHEN hc.Id IS NULL THEN '❌ NO EXISTE HeaderClient - PROBLEMA CRÍTICO'
                WHEN c.Id IS NULL THEN '❌ NO EXISTE Client - PROBLEMA CRÍTICO'
                ELSE '✅ HeaderClient y Client existen'
            END as verificacion
        FROM File f
        LEFT JOIN HeaderClient hc ON f.IdClient = hc.Id
        LEFT JOIN Client c ON hc.IdClient = c.Id
        WHERE f.Id = ?
    ";
    
    $results2 = ejecutarQuery($mysqli, $sql2, [$idFile]);
    $result2 = $results2[0] ?? null;
    
    if ($result2) {
        echo "  HeaderClient ID: " . ($result2['idHeaderClient'] ?? 'N/A') . "\n";
        echo "  HeaderClient existe: " . ($result2['headerClientExiste'] ? '✅ Sí' : '❌ No') . "\n";
        echo "  Client ID: " . ($result2['idClient'] ?? 'N/A') . "\n";
        echo "  Client existe: " . ($result2['clientExiste'] ? '✅ Sí' : '❌ No') . "\n";
        if ($result2['RazonSocial']) {
            echo "  Razón Social: " . $result2['RazonSocial'] . "\n";
        } else {
            echo "  Nombre: " . trim(($result2['Name'] ?? '') . ' ' . ($result2['LastName'] ?? '')) . "\n";
        }
        echo "\n  " . $result2['verificacion'] . "\n";
    }
    
    echo "\n";
    
    // ============================================================================
    // PASO 3: Verificar Client_Total_Relation para la agencia del File
    // ============================================================================
    echo "┌─────────────────────────────────────────────────────────────┐\n";
    echo "│ PASO 3: Verificar Client_Total_Relation para Renault       │\n";
    echo "└─────────────────────────────────────────────────────────────┘\n";
    
    $sql3 = "
        SELECT 
            f.Id as idFile,
            f.IdAgency as agenciaDelFile,
            a.Name as nombreAgenciaFile,
            hc.Id as idHeaderClient,
            ctr.Id as ctrId,
            ctr.IdAgency as ctrAgency,
            ctr.IdTotalDealer as ndCliente,
            a2.Name as nombreAgenciaCTR,
            CASE 
                WHEN ctr.Id IS NULL THEN '❌ NO EXISTE Client_Total_Relation para agencia 5 (Renault) - ESTE ES EL PROBLEMA'
                WHEN ctr.IdAgency = f.IdAgency THEN '✅ EXISTE Client_Total_Relation con la misma agencia del File'
                ELSE CONCAT('⚠️ EXISTE Client_Total_Relation pero con otra agencia: ', ctr.IdAgency)
            END as resultado
        FROM File f
        INNER JOIN Agency a ON f.IdAgency = a.Id
        LEFT JOIN HeaderClient hc ON f.IdClient = hc.Id
        LEFT JOIN Client_Total_Relation ctr ON hc.Id = ctr.idHeaderClient 
            AND ctr.IdAgency = f.IdAgency
        LEFT JOIN Agency a2 ON ctr.IdAgency = a2.Id
        WHERE f.Id = ?
    ";
    
    $results3 = ejecutarQuery($mysqli, $sql3, [$idFile]);
    $result3 = $results3[0] ?? null;
    
    if ($result3) {
        echo "  Agencia del File: " . $result3['nombreAgenciaFile'] . " (ID: " . $result3['agenciaDelFile'] . ")\n";
        echo "  HeaderClient ID: " . ($result3['idHeaderClient'] ?? 'N/A') . "\n";
        if ($result3['ctrId']) {
            echo "  ✅ Client_Total_Relation existe:\n";
            echo "     - ID Relación: " . $result3['ctrId'] . "\n";
            echo "     - Agencia: " . $result3['nombreAgenciaCTR'] . " (ID: " . $result3['ctrAgency'] . ")\n";
            echo "     - ND Cliente: " . ($result3['ndCliente'] ?? 'N/A') . "\n";
        } else {
            echo "  ❌ Client_Total_Relation NO EXISTE para esta agencia\n";
        }
        echo "\n  " . $result3['resultado'] . "\n";
    }
    
    echo "\n";
    
    // ============================================================================
    // PASO 4: Verificar TODAS las relaciones Client_Total_Relation
    // ============================================================================
    echo "┌─────────────────────────────────────────────────────────────┐\n";
    echo "│ PASO 4: Todas las relaciones Client_Total_Relation          │\n";
    echo "└─────────────────────────────────────────────────────────────┘\n";
    
    $sql4 = "
        SELECT 
            f.Id as idFile,
            f.IdAgency as agenciaDelFile,
            hc.Id as idHeaderClient,
            ctr.Id as ctrId,
            ctr.IdAgency as ctrAgency,
            ctr.IdTotalDealer as ndCliente,
            a.Name as nombreAgencia,
            CASE 
                WHEN ctr.IdAgency = f.IdAgency THEN '✅ Esta es la relación requerida'
                ELSE '⚠️ Relación para otra agencia'
            END as verificacion
        FROM File f
        LEFT JOIN HeaderClient hc ON f.IdClient = hc.Id
        LEFT JOIN Client_Total_Relation ctr ON hc.Id = ctr.idHeaderClient
        LEFT JOIN Agency a ON ctr.IdAgency = a.Id
        WHERE f.Id = ?
        ORDER BY ctr.IdAgency
    ";
    
    $results4 = ejecutarQuery($mysqli, $sql4, [$idFile]);
    
    if (empty($results4) || !$results4[0]['ctrId']) {
        echo "  ❌ No hay ninguna relación Client_Total_Relation para este HeaderClient\n";
    } else {
        echo "  Relaciones encontradas:\n";
        foreach ($results4 as $rel) {
            if ($rel['ctrId']) {
                echo "    - ID: " . $rel['ctrId'] . " | Agencia: " . ($rel['nombreAgencia'] ?? 'N/A') . " (ID: " . $rel['ctrAgency'] . ") | ND: " . ($rel['ndCliente'] ?? 'N/A') . " | " . $rel['verificacion'] . "\n";
            }
        }
    }
    
    echo "\n";
    
    // ============================================================================
    // PASO 5: Simular el query de validación
    // ============================================================================
    echo "┌─────────────────────────────────────────────────────────────┐\n";
    echo "│ PASO 5: Simulación del query de validación                  │\n";
    echo "└─────────────────────────────────────────────────────────────┘\n";
    
    $sql5 = "
        SELECT 
            f.Id as idFile,
            f.IdAgency,
            f.IdProcess,
            p.Enabled as procesoHabilitado,
            f.IdCurrentState,
            CASE 
                WHEN f.IdAgency = 5 THEN '✅'
                ELSE '❌'
            END as cumple_agencia,
            CASE 
                WHEN p.Enabled = 1 THEN '✅'
                ELSE '❌'
            END as cumple_proceso_habilitado,
            CASE 
                WHEN f.IdCurrentState != 5 THEN '✅'
                ELSE '❌'
            END as cumple_no_cancelado,
            CASE 
                WHEN EXISTS (
                    SELECT 1 
                    FROM Client_Total_Relation ctr_check 
                    WHERE ctr_check.idHeaderClient = hc.Id 
                    AND ctr_check.IdAgency = f.IdAgency
                ) THEN '✅'
                ELSE '❌ NO EXISTE Client_Total_Relation - ESTE ES EL PROBLEMA'
            END as cumple_relacion_cliente,
            CASE 
                WHEN f.IdAgency = 5 
                    AND p.Enabled = 1 
                    AND f.IdCurrentState != 5
                    AND EXISTS (
                        SELECT 1 
                        FROM Client_Total_Relation ctr_check 
                        WHERE ctr_check.idHeaderClient = hc.Id 
                        AND ctr_check.IdAgency = f.IdAgency
                    ) THEN '✅ APARECERÍA EN VALIDACIÓN'
                ELSE '❌ NO APARECERÍA EN VALIDACIÓN'
            END as resultado_final
        FROM File f
        INNER JOIN HeaderClient hc ON f.IdClient = hc.Id
        INNER JOIN Process p ON f.IdProcess = p.Id
        WHERE f.Id = ?
    ";
    
    $results5 = ejecutarQuery($mysqli, $sql5, [$idFile]);
    $result5 = $results5[0] ?? null;
    
    if ($result5) {
        echo "  Condiciones del query de validación:\n";
        echo "    Agencia = 5 (Renault): " . $result5['cumple_agencia'] . "\n";
        echo "    Proceso habilitado: " . $result5['cumple_proceso_habilitado'] . "\n";
        echo "    No cancelado: " . $result5['cumple_no_cancelado'] . "\n";
        echo "    Existe Client_Total_Relation: " . $result5['cumple_relacion_cliente'] . "\n";
        echo "\n  RESULTADO FINAL: " . $result5['resultado_final'] . "\n";
    }
    
    echo "\n";
    
    // ============================================================================
    // PASO 6: Obtener IdTotalDealer para crear relación
    // ============================================================================
    echo "┌─────────────────────────────────────────────────────────────┐\n";
    echo "│ PASO 6: Obtener IdTotalDealer para crear relación           │\n";
    echo "└─────────────────────────────────────────────────────────────┘\n";
    
    $sql6 = "
        SELECT 
            hc.Id as idHeaderClient,
            ctr.IdTotalDealer,
            ctr.IdAgency,
            a.Name as nombreAgencia
        FROM File f
        INNER JOIN HeaderClient hc ON f.IdClient = hc.Id
        LEFT JOIN Client_Total_Relation ctr ON hc.Id = ctr.idHeaderClient
        LEFT JOIN Agency a ON ctr.IdAgency = a.Id
        WHERE f.Id = ?
        LIMIT 1
    ";
    
    $results6 = ejecutarQuery($mysqli, $sql6, [$idFile]);
    $result6 = $results6[0] ?? null;
    
    if ($result6) {
        echo "  HeaderClient ID: " . ($result6['idHeaderClient'] ?? 'N/A') . "\n";
        if ($result6['IdTotalDealer']) {
            echo "  IdTotalDealer encontrado: " . $result6['IdTotalDealer'] . "\n";
            echo "  De la agencia: " . ($result6['nombreAgencia'] ?? 'N/A') . " (ID: " . ($result6['IdAgency'] ?? 'N/A') . ")\n";
            echo "\n  ✅ Se puede crear la relación usando este IdTotalDealer\n";
        } else {
            echo "  ⚠️ No se encontró IdTotalDealer en relaciones existentes\n";
            echo "  ⚠️ Será necesario proporcionar el ND del cliente manualmente\n";
        }
    }
    
    echo "\n";
    echo "═══════════════════════════════════════════════════════════════\n";
    echo "  DIAGNÓSTICO COMPLETADO\n";
    echo "═══════════════════════════════════════════════════════════════\n\n";
    
    // Resumen y recomendación
    if ($result3 && !$result3['ctrId']) {
        echo "🔧 SOLUCIÓN RECOMENDADA:\n";
        echo "   El problema es que falta la relación Client_Total_Relation.\n";
        echo "   Puedes repararla usando el endpoint:\n";
        echo "   POST /api/clients-validation/reparar-relacion\n";
        echo "   Body: { \"idFile\": 15504 }\n\n";
        echo "   O ejecutar el script SQL de reparación manualmente.\n";
    } else if ($result5 && strpos($result5['resultado_final'], 'NO APARECERÍA') !== false) {
        echo "⚠️  El file no aparecería en validación por alguna condición no cumplida.\n";
        echo "   Revisa los resultados anteriores para identificar el problema.\n";
    } else {
        echo "✅ El file debería aparecer en validación.\n";
        echo "   Si no aparece, puede ser un problema de caché o filtros adicionales.\n";
    }
    
    $mysqli->close();
    
} catch (\Exception $e) {
    echo "❌ ERROR: " . $e->getMessage() . "\n";
    echo "\nDetalles:\n";
    echo "  Tipo: " . get_class($e) . "\n";
    if ($e->getPrevious()) {
        echo "  Error anterior: " . $e->getPrevious()->getMessage() . "\n";
    }
    exit(1);
}
