<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Traits\DeletesFileDependents;
use App\Traits\SnakeKeys;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;
use App\Models\UserActivityLogModel;
use App\Models\DocumentModel;

class Validacion extends BaseController
{
    use DeletesFileDependents;
    use SnakeKeys;

    protected $db;
    protected $userActivityLogModel;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
        $this->userActivityLogModel = new UserActivityLogModel();
    }

    /**
     * Obtener ID del tipo de documento de Liquidación desde la tabla config.
     * Retorna null si no está configurado (config_key: id_document_type_liquidacion).
     */
    private function getConfigDocumentTypeLiquidacion(): ?int
    {
        try {
            $row = $this->db->table('config')
                ->select('config_value')
                ->where('config_key', 'id_document_type_liquidacion')
                ->get()
                ->getRowArray();
            if ($row && !empty(trim($row['config_value'] ?? ''))) {
                return (int) $row['config_value'];
            }
        } catch (\Throwable $e) {
            // Tabla config puede no existir
        }
        return null;
    }

    /**
     * Registrar actividad en el log
     */
    private function logActivity($action, $description, $changeDetails = null, $entityId = null)
    {
        try {
            $currentUser = $this->getAuthenticatedUser();
            $userId = $currentUser['user_id'] ?? 'sistema';
            $username = $currentUser['email'] ?? 'sistema';
            if (empty($username) || $username === 'sistema') {
                $authModel = new \App\Models\AuthModel();
                $userRow = $authModel->getUserById($userId);
                $username = $userRow['User'] ?? $userRow['Name'] ?? (string) $userId;
            }

            $logData = [
                'user_id' => (string) $userId,
                'username' => $username,
                'action' => $action,
                'description' => $description,
                'change_details' => $changeDetails ? json_encode($changeDetails) : null
            ];

            $this->userActivityLogModel->createLog($logData);
        } catch (\Exception $e) {
            error_log("Error logging activity: " . $e->getMessage());
        }
    }

    /**
     * Endpoint de diagnóstico para verificar por qué un pedido no aparece
     * GET /api/validacion/diagnostico?idFile=15460&id_agency=5&idProcess=?
     */
    public function diagnosticoPedido()
    {
        try {
            $idFile = $this->request->getGet('idFile');
            $id_agency = $this->request->getGet('id_agency');
            $idProcess = $this->request->getGet('idProcess');
            $idDMS = $this->request->getGet('IdDMS'); // Parámetro opcional para verificar relación específica

            if (!$idFile) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El parámetro idFile es requerido',
                    'data' => null
                ])->setStatusCode(400);
            }
            if ($r = $this->requireFileAccess($idFile)) return $r;

            // Obtener información básica del pedido
            $fileInfo = $this->db->query("
                SELECT 
                    f.id as idFile,
                    f.id_agency,
                    f.id_sale_type,
                    f.id_client,
                    f.id_current_expedient_state,
                    f.id_order_total as ndPedido,
                    a.name as agencia,
                    p.name as proceso,
                    p.enabled as proceso_habilitado,
                    fs.name as estado_actual
                FROM expedient f
                INNER JOIN agency a ON f.id_agency = a.id
                INNER JOIN process p ON f.id_sale_type = p.id
                INNER JOIN expedient_state fs ON f.id_current_expedient_state = fs.id
                WHERE f.id = ?
            ", [$idFile])->getRowArray();

            if (!$fileInfo) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El pedido no existe',
                    'data' => null
                ])->setStatusCode(404);
            }

            // Verificar relación ClientTotalRelation
            // File.id_client apunta a Client.id, NO a ClientHeader.id
            $idClient = (int) ($fileInfo['id_client'] ?? $fileInfo['IdClient'] ?? 0);
            $idAgencyFile = (int) ($fileInfo['id_agency'] ?? $fileInfo['IdAgency'] ?? 0);
            
            // Obtener el ClientHeader.id desde Client.id
            $headerClientInfo = $this->db->query("
                SELECT id FROM client_header WHERE id_client = ?
                LIMIT 1
            ", [$idClient])->getRowArray();
            
            $idClientHeader = $headerClientInfo ? (int) ($headerClientInfo['id'] ?? $headerClientInfo['id'] ?? 0) : null;
            
            error_log("=== DIAGNÓSTICO FILE {$idFile} ===");
            error_log("File.id_client (Client.id): {$idClient}");
            error_log("ClientHeader.id encontrado: " . ($idClientHeader ?? 'NULL'));
            error_log("File.id_agency: {$idAgencyFile}");
            error_log("id_dms recibido como parámetro: " . ($idDMS ?? 'NULL'));
            
            // Si se pasa id_dms como parámetro, buscar directamente por ese valor
            if ($idDMS) {
                $idDMSTrimmed = trim((string) $idDMS);
                error_log("🔍 Buscando relación por id_dms={$idDMSTrimmed} e id_agency={$idAgencyFile}");
                
                $relacion = $this->db->query("
                    SELECT 
                        ctr.id,
                        ctr.id_agency,
                        ctr.id_dms,
                        ctr.id_client_header,
                        a.name as nombre_agencia
                    FROM client_dms_relation ctr
                    INNER JOIN agency a ON ctr.id_agency = a.id
                    WHERE TRIM(ctr.id_dms) = ?
                    AND ctr.id_agency = ?
                ", [$idDMSTrimmed, $idAgencyFile])->getRowArray();
                
                if ($relacion) {
                    $relacionIdClientHeader = $relacion['id_client_header'] ?? $relacion['idClientHeader'] ?? null;
                    error_log("✅ Relación encontrada por id_dms={$idDMSTrimmed} e id_agency={$idAgencyFile}");
                    error_log("   id_client_header de la relación: {$relacionIdClientHeader}");
                    error_log("   id_client_header del file: {$idClientHeader}");
                    
                    if ($relacionIdClientHeader == $idClientHeader) {
                        error_log("✅ La relación pertenece al mismo ClientHeader del file");
                    } else {
                        error_log("⚠️ La relación pertenece a un ClientHeader diferente (id={$relacionIdClientHeader})");
                    }
                } else {
                    error_log("❌ No se encontró relación con id_dms={$idDMSTrimmed} e id_agency={$idAgencyFile}");
                }
            } else {
                // Si no se pasa id_dms, buscar por ClientHeader.id e id_agency
                if ($idClientHeader) {
                    error_log("🔍 Buscando relación por ClientHeader.id={$idClientHeader} e id_agency={$idAgencyFile}");
                    
                    $relacion = $this->db->query("
                        SELECT 
                            ctr.id,
                            ctr.id_agency,
                            ctr.id_dms,
                            ctr.id_client_header,
                            a.name as nombre_agencia
                        FROM client_header hc
                        INNER JOIN client_dms_relation ctr ON ctr.id_client_header = hc.id
                        INNER JOIN agency a ON ctr.id_agency = a.id
                        WHERE hc.id = ?
                        AND ctr.id_agency = ?
                    ", [$idClientHeader, $idAgencyFile])->getRowArray();
                    
                    if ($relacion) {
                        error_log("✅ Relación encontrada por ClientHeader.id: " . json_encode($relacion));
                    }
                } else {
                    error_log("⚠️ No se encontró ClientHeader para Client.id={$idClient}");
                }
            }
            
            // Si no se encuentra, buscar por IdDMS
            if (!$relacion) {
                error_log("⚠️ Relación NO encontrada por ClientHeader.id={$idClientHeader} y IdAgency={$idAgencyFile}");
                
                // Prioridad 1: Si se pasa IdDMS como parámetro, usarlo
                $ndCliente = null;
                if ($idDMS) {
                    $ndCliente = trim((string) $idDMS);
                    error_log("✅ Usando IdDMS del parámetro: {$ndCliente}");
                } else {
                    // Prioridad 2: Obtener el id_dms de cualquier relación de este ClientHeader
                    $ndClienteDelFile = $this->db->query("
                        SELECT ctr.id_dms 
                        FROM client_dms_relation ctr 
                        WHERE ctr.id_client_header = ? 
                        LIMIT 1
                    ", [$idClientHeader])->getRowArray();
                    
                    if ($ndClienteDelFile && !empty($ndClienteDelFile['id_dms'] ?? $ndClienteDelFile['IdDMS'] ?? null)) {
                        $ndCliente = trim($ndClienteDelFile['id_dms'] ?? $ndClienteDelFile['IdDMS'] ?? '');
                        error_log("⚠️ Usando id_dms de relación existente del ClientHeader: {$ndCliente}");
                    }
                }
                
                if ($ndCliente) {
                    error_log("Buscando relación alternativa por id_dms={$ndCliente} e id_agency={$idAgencyFile}");
                    
                    // Buscar por id_dms e id_agency
                    $relacion = $this->db->query("
                        SELECT 
                            ctr.id,
                            ctr.id_agency,
                            ctr.id_dms,
                            ctr.id_client_header,
                            a.name as nombre_agencia
                        FROM client_dms_relation ctr
                        INNER JOIN agency a ON ctr.id_agency = a.id
                        WHERE TRIM(ctr.id_dms) = ?
                        AND ctr.id_agency = ?
                    ", [$ndCliente, $idAgencyFile])->getRowArray();
                    
                    if ($relacion) {
                        error_log("✅ Relación encontrada por id_dms: " . json_encode($relacion));
                        // Verificar si el id_client_header de la relación coincide con el del file
                        $relacionIdClientHeader = $relacion['id_client_header'] ?? $relacion['idClientHeader'] ?? null;
                        if ($relacionIdClientHeader != $idClientHeader) {
                            error_log("⚠️ ADVERTENCIA: El id_client_header de la relación ({$relacionIdClientHeader}) NO coincide con el del file ({$idClientHeader})");
                            // Aún así, consideramos que existe la relación si el id_dms y id_agency coinciden
                        }
                    } else {
                        error_log("❌ No se encontró relación con id_dms={$ndCliente} e id_agency={$idAgencyFile}");
                    }
                }
            } else {
                error_log("✅ Relación encontrada por ClientHeader.id: " . json_encode($relacion));
            }
            
            // Si aún no se encuentra, mostrar información de diagnóstico
            if (!$relacion) {
                error_log("❌ Relación NO encontrada después de todos los intentos");
                
                // Verificar si existe ClientHeader con ese ID
                $headerClientExists = $this->db->query("
                    SELECT id, id_client FROM client_header WHERE id = ?
                ", [$idClientHeader])->getRowArray();
                error_log("ClientHeader existe: " . ($headerClientExists ? json_encode($headerClientExists) : 'NO'));
                
                // Verificar todas las relaciones de ese ClientHeader
                $todasRelacionesClientHeader = $this->db->query("
                    SELECT ctr.id, ctr.id_agency, ctr.id_dms, ctr.id_client_header, a.name as nombre_agencia
                    FROM client_dms_relation ctr
                    INNER JOIN agency a ON ctr.id_agency = a.id
                    WHERE ctr.id_client_header = ?
                ", [$idClientHeader])->getResultArray();
                error_log("Todas las relaciones de ClientHeader {$idClientHeader}: " . json_encode($todasRelacionesClientHeader));
                
                // Buscar todas las relaciones con id_agency para ver si hay alguna con el mismo cliente
                $relacionesAgencia = $this->db->query("
                    SELECT ctr.id, ctr.id_agency, ctr.id_dms, ctr.id_client_header, a.name as nombre_agencia
                    FROM client_dms_relation ctr
                    INNER JOIN agency a ON ctr.id_agency = a.id
                    WHERE ctr.id_agency = ?
                ", [$idAgencyFile])->getResultArray();
                error_log("Total de relaciones con id_agency={$idAgencyFile}: " . count($relacionesAgencia));
            }

            // Verificar todas las relaciones del cliente (usando ClientHeader.id del file)
            $todasRelaciones = [];
            if ($idClientHeader) {
                $todasRelaciones = $this->db->query("
                    SELECT 
                        ctr.id,
                        ctr.id_agency,
                        ctr.id_dms,
                        ctr.id_client_header,
                        a.name as nombre_agencia
                    FROM client_header hc
                    INNER JOIN client_dms_relation ctr ON ctr.id_client_header = hc.id
                    INNER JOIN agency a ON ctr.id_agency = a.id
                    WHERE hc.id = ?
                ", [$idClientHeader])->getResultArray();
            } else {
                error_log("⚠️ No se puede buscar relaciones porque no se encontró ClientHeader para Client.id={$idClient}");
            }
            
            // También buscar directamente por id_dms si se proporciona como parámetro
            $relacionPorNdCliente = null;
            if ($idDMS) {
                $idDMSTrimmed = trim((string) $idDMS);
                $relacionPorNdCliente = $this->db->query("
                    SELECT 
                        ctr.id,
                        ctr.id_agency,
                        ctr.id_dms,
                        ctr.id_client_header,
                        a.name as nombre_agencia
                    FROM client_dms_relation ctr
                    INNER JOIN agency a ON ctr.id_agency = a.id
                    WHERE TRIM(ctr.id_dms) = ?
                    AND ctr.id_agency = ?
                ", [$idDMSTrimmed, $idAgencyFile])->getResultArray();
                
                error_log("Relaciones encontradas por id_dms='{$idDMSTrimmed}' e id_agency={$idAgencyFile}: " . json_encode($relacionPorNdCliente));
            }
            
            // Verificar si alguna de estas relaciones tiene el mismo idClientHeader que el file
            if ($relacionPorNdCliente && count($relacionPorNdCliente) > 0) {
                $relacionEncontrada = $relacionPorNdCliente[0];
                if ($relacionEncontrada['idClientHeader'] == $idClientHeader) {
                    error_log("✅ La relación con IdDMS='99282' e IdAgency=3 SÍ pertenece al ClientHeader.id={$idClientHeader} del file");
                    // Si no se encontró antes, usar esta relación
                    if (!$relacion) {
                        $relacion = $relacionEncontrada;
                        error_log("✅ Usando relación encontrada por IdDMS: " . json_encode($relacion));
                    }
                } else {
                    error_log("⚠️ La relación con IdDMS='99282' e IdAgency=3 pertenece a ClientHeader.id={$relacionEncontrada['idClientHeader']}, pero el file tiene ClientHeader.id={$idClientHeader}");
                    error_log("⚠️ Esto significa que el file está asociado a un ClientHeader diferente al que tiene la relación con la agencia 3");
                }
            }

            // Verificar condiciones del query de validación
            // Para tener_relacion_cliente_agencia, verificar si:
            // 1. Se encontró relación directa por ClientHeader.id e IdAgency, O
            // 2. Existe una relación con IdDMS e IdAgency (aunque el ClientHeader sea diferente)
            $tieneRelacion = false;
            if ($relacion) {
                // Si la relación encontrada tiene el mismo idClientHeader que el file, es válida
                if ($relacion['idClientHeader'] == $idClientHeader) {
                    $tieneRelacion = true;
                } else {
                    // Si el idClientHeader es diferente, verificar si hay alguna relación del ClientHeader del file con esa agencia
                    $relacionDelFile = $this->db->query("
                        SELECT 1 
                        FROM client_dms_relation ctr 
                        WHERE ctr.id_client_header = ? 
                        AND ctr.id_agency = ?
                    ", [$idClientHeader, $idAgencyFile])->getRowArray();
                    $tieneRelacion = $relacionDelFile !== null;
                }
            }
            
            // Convertir parámetros a enteros para comparación correcta
            $idAgencyInt = $id_agency ? (int) $id_agency : null;
            $idProcessInt = $idProcess ? (int) $idProcess : null;
            $fileIdAgency = (int) ($fileInfo['id_agency'] ?? $fileInfo['IdAgency'] ?? 0);
            $fileIdProcess = (int) ($fileInfo['id_sale_type'] ?? $fileInfo['IdProcess'] ?? 0);
            
            // Evaluar condiciones
            // Agencia: solo se evalúa si se pasa el parámetro
            $condicionAgencia = $idAgencyInt ? ($fileIdAgency == $idAgencyInt) : null;
            
            // Proceso: siempre se evalúa desde el File, pero si se pasa el parámetro, se compara
            // Si no se pasa el parámetro, se muestra el IdProcess del file
            if ($idProcessInt) {
                $condicionProceso = $fileIdProcess == $idProcessInt;
            } else {
                // Si no se pasa el parámetro, mostrar el IdProcess del file (siempre true porque es el proceso del file)
                $condicionProceso = true; // El file siempre tiene su proceso
            }
            
            $cumpleCondiciones = [
                'agencia' => $condicionAgencia,
                'proceso' => $condicionProceso,
                'proceso_id' => $fileIdProcess, // Agregar el IdProcess del file para referencia
                'proceso_habilitado' => $fileInfo['proceso_habilitado'] == 1,
                'no_cancelado' => ($fileInfo['id_current_expedient_state'] ?? $fileInfo['IdCurrentState'] ?? 0) != 5,
                'tiene_relacion_cliente_agencia' => $tieneRelacion
            ];
            
            // Agregar información adicional para debugging
            error_log("=== EVALUACIÓN DE CONDICIONES ===");
            error_log("id_agency recibido: " . ($id_agency ?? 'NULL') . " (tipo: " . gettype($id_agency) . ")");
            error_log("id_agency convertido: " . ($idAgencyInt ?? 'NULL'));
            error_log("File.IdAgency: {$fileIdAgency}");
            error_log("Condición agencia: " . ($condicionAgencia === null ? 'NULL' : ($condicionAgencia ? 'TRUE' : 'FALSE')));
            error_log("idProcess recibido: " . ($idProcess ?? 'NULL') . " (tipo: " . gettype($idProcess) . ")");
            error_log("idProcess convertido: " . ($idProcessInt ?? 'NULL'));
            error_log("File.IdProcess: {$fileIdProcess}");
            error_log("Condición proceso: " . ($condicionProceso ? 'TRUE' : 'FALSE'));

            // Obtener IdDMS del file si existe relación
            $idDMSDelFile = null;
            if ($todasRelaciones && count($todasRelaciones) > 0) {
                // Buscar IdDMS de la relación con la agencia del file
                foreach ($todasRelaciones as $rel) {
                    if ($rel['IdAgency'] == $idAgencyFile) {
                        $idDMSDelFile = $rel['IdDMS'];
                        break;
                    }
                }
                // Si no se encuentra con la agencia del file, usar el primero disponible
                if (!$idDMSDelFile && count($todasRelaciones) > 0) {
                    $idDMSDelFile = $todasRelaciones[0]['IdDMS'];
                }
            }
            
            return $this->response->setJSON([
                'success' => true,
                'message' => 'Diagnóstico completado',
                'data' => [
                    'pedido' => $fileInfo,
                    'relacion_requerida' => $relacion,
                    'todas_relaciones' => $todasRelaciones,
                    'idDMS' => $idDMSDelFile, // Agregar IdDMS encontrado
                    'relacion_por_idDMS' => $relacionPorNdCliente, // Relación encontrada por parámetro IdDMS
                    'condiciones' => $cumpleCondiciones,
                    'apareceria_en_validacion' => 
                        (!$id_agency || $cumpleCondiciones['agencia']) &&
                        (!$idProcess || $cumpleCondiciones['proceso']) &&
                        $cumpleCondiciones['proceso_habilitado'] &&
                        $cumpleCondiciones['no_cancelado'] &&
                        $cumpleCondiciones['tiene_relacion_cliente_agencia']
                ]
            ]);

        } catch (\Exception $e) {
            error_log("Error en Validacion::diagnosticoPedido: " . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }

    /**
     * Listar expedientes que requieren corrección desde la tabla expedients_to_correct.
     * Solo administrador (role_id = 7).
     * GET /api/clients-validation/expedientes-corregir
     */
    public function expedientesCorregir()
    {
        try {
            if (!$this->isCurrentUserAdmin()) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Acceso denegado. Solo administradores.',
                    'data' => null
                ])->setStatusCode(403);
            }

            $rows = $this->db->query("
                SELECT ec.id, ec.id_expedient, ec.id_agency, ec.nd_dms, ec.api_result, ec.created_at,
                       a.name as nombreAgencia
                FROM expedients_to_correct ec
                INNER JOIN agency a ON a.id = ec.id_agency
                    WHERE  (ec.api_result IS NULL OR NOT JSON_CONTAINS(ec.api_result, 'true', '$.success')) 
                ORDER BY ec.id_agency ASC, ec.id ASC
            ")->getResultArray();

            $porAgencia = [];
            $totalGeneral = 0;

            foreach ($rows as $row) {
                $id_agency = (int) $row['id_agency'];
                if (!isset($porAgencia[$id_agency])) {
                    $porAgencia[$id_agency] = [
                        'id_agency' => $id_agency,
                        'nombreAgencia' => $row['nombreAgencia'] ?? '',
                        'total' => 0,
                        'expedientes' => []
                    ];
                }

                $apiResult = null;
                if (!empty($row['api_result'])) {
                    $decoded = json_decode($row['api_result'], true);
                    $apiResult = is_array($decoded) ? $decoded : ['raw' => $row['api_result']];
                }

                $porAgencia[$id_agency]['expedientes'][] = [
                    'id' => (int) $row['id'],
                    'idFile' => (int) $row['id_expedient'],
                    'id_agency' => $id_agency,
                    'ndCliente' => $row['nd_dms'] ?? '',
                    'api_result' => $apiResult,
                    'created_at' => $row['created_at'] ?? null,
                    'tipoReparacion' => 'repairClientRelation'
                ];
                $porAgencia[$id_agency]['total']++;
                $totalGeneral++;
            }

            ksort($porAgencia);

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Expedientes a corregir desde tabla expedients_to_correct',
                'data' => [
                    'porAgencia' => array_values($porAgencia),
                    'totalGeneral' => $totalGeneral
                ]
            ]);
        } catch (\Exception $e) {
            error_log("Error en Validacion::expedientesCorregir: " . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }

    /**
     * Ejecutar la reparación de expedientes pendientes.
     * Solo administrador.
     * GET /api/clients-validation/expedientes-corregir/auto-reparar
     * Query: ?todos=1 para reparar todos (en lotes de 50 hasta terminar).
     */
    public function autoRepararExpedientes()
    {
        try {
            if (!$this->isCurrentUserAdmin()) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Acceso denegado. Solo administradores.',
                    'data' => null
                ])->setStatusCode(403);
            }

            $todos = filter_var($this->request->getGet('todos'), FILTER_VALIDATE_BOOLEAN);
            $limit = 50;

            $reparadosTotal = 0;
            $erroresTotal = [];

            do {
                $rows = $this->db->query("
                    SELECT ec.id, ec.id_expedient, ec.id_agency, ec.nd_dms
                    FROM expedients_to_correct ec
                    WHERE ec.api_result IS NULL and ec.id_agency = 9
                    ORDER BY (ec.id_agency IN (20, 21, 22)) DESC, ec.id_agency ASC, ec.id ASC
                    LIMIT ?
                ", [$limit])->getResultArray();

                foreach ($rows as $row) {
                    $result = $this->ejecutarReparacionClientRelation(
                        trim((string) ($row['nd_dms'] ?? '')),
                        (int) $row['id_agency'],
                        (int) $row['id_expedient']
                    );
                    if ($result['success']) {
                        $reparadosTotal++;
                    } else {
                        $erroresTotal[] = [
                            'id_expedient' => (int) $row['id_expedient'],
                            'nd_dms' => $row['nd_dms'],
                            'mensaje' => $result['message']
                        ];
                    }
                }
            } while ($todos && count($rows) === $limit);

            return $this->response->setJSON([
                'success' => true,
                'message' => "Reparación completada: {$reparadosTotal} reparado(s), " . count($erroresTotal) . " error(es)",
                'data' => [
                    'reparados' => $reparadosTotal,
                    'errores' => $erroresTotal,
                    'total_procesados' => $reparadosTotal + count($erroresTotal)
                ]
            ]);
        } catch (\Exception $e) {
            error_log("Error en Validacion::autoRepararExpedientes: " . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }

    /**
     * Ejecutar la reparación de File.IdClient para un expediente.
     * Retorna ['success' => bool, 'idClient' => int|null, 'message' => string].
     */
    private function ejecutarReparacionClientRelation(string $nd_dms, int $id_agency, int $id_expedient): array
    {
        try {
            if ($nd_dms === '') {
                $this->guardarErrorExpediente($id_expedient, $id_agency, $nd_dms, 'nd_dms vacío');
                return ['success' => false, 'idClient' => null, 'message' => 'nd_dms vacío'];
            }

            $row = $this->db->query("
                SELECT idCliente FROM view_client_relations
                WHERE TRIM(ndCliente) = ? AND id_agency = ?
                LIMIT 1
            ", [$nd_dms, $id_agency])->getRowArray();

            $idClientVal = $row['idCliente'] ?? null;
            if (!$row || empty($idClientVal)) {
                $msg = 'No se encontró relación en view_client_relations';
                $this->guardarErrorExpediente($id_expedient, $id_agency, $nd_dms, $msg);
                return ['success' => false, 'idClient' => null, 'message' => $msg];
            }

            $idClient = (int) $idClientVal;
            $this->db->table('expedient')->where('id', $id_expedient)->update(['id_client' => $idClient]);
            if ($this->db->affectedRows() === 0) {
                $msg = 'No se actualizó ningún expediente';
                $this->guardarErrorExpediente($id_expedient, $id_agency, $nd_dms, $msg);
                return ['success' => false, 'idClient' => null, 'message' => $msg];
            }

            $this->db->query("
                UPDATE expedients_to_correct SET api_result = ?
                WHERE id_expedient = ? AND id_agency = ? AND nd_dms = ?
            ", [json_encode(['success' => true, 'idClient' => $idClient]), $id_expedient, $id_agency, $nd_dms]);

            return ['success' => true, 'idClient' => $idClient, 'message' => 'OK'];
        } catch (\Throwable $e) {
            $msg = $e->getMessage();

            $this->guardarErrorExpediente($id_expedient, $id_agency, $nd_dms, $msg, $e);
            return ['success' => false, 'idClient' => null, 'message' => $msg];
        }
    }

    /**
     * Guardar error en expedients_to_correct.api_result con request y detalle del error.
     */
    private function guardarErrorExpediente(int $id_expedient, int $id_agency, string $nd_dms, string $message, ?\Throwable $e = null): void
    {
        $payload = [
            'success' => false,
            'message' => $message,
            'request' => [
                'nd_dms' => $nd_dms,
                'id_agency' => $id_agency,
                'id_expedient' => $id_expedient
            ]
        ];
        if ($e !== null) {
            $payload['errorCode'] = $e->getCode();
            $payload['errorDetail'] = $e->getMessage();
            $payload['errorFile'] = basename($e->getFile());
            $payload['errorLine'] = $e->getLine();
            if ($e->getPrevious()) {
                $prev = $e->getPrevious();
                $payload['errorPrevious'] = $prev->getMessage();
                $payload['errorPreviousCode'] = $prev->getCode();
            }
        }
        try {
            $this->db->query("
                UPDATE expedients_to_correct SET api_result = ?
                WHERE id_expedient = ? AND id_agency = ? AND nd_dms = ?
            ", [json_encode($payload), $id_expedient, $id_agency, $nd_dms]);
        } catch (\Throwable $e2) {

        }
    }

    /**
     * Llamar API Nexfile orders (DWH) y devolver array de pedidos.
     */
    private function callNexFileorderslastest(string $agencyConnection, string $ndCliente): array
    {
        $baseUrl = $this->getNexfileBaseUrl();
        if (empty($baseUrl)) {
            return [];
        }

        $url = rtrim($baseUrl, '/') . '/nexfile/orders?'
            . 'customer_dms=' . urlencode($ndCliente)
            . '&connection_string=' . urlencode($agencyConnection)
            . '&perpage=1000';

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false
        ]);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($response === false || $httpCode >= 400) {
            return [];
        }

        $data = json_decode($response, true);
        $ordersData = null;

        if (is_array($data)) {
            $ordersData = $data;
        } elseif ($data && isset($data['data']) && is_array($data['data'])) {
            $ordersData = $data['data'];
        } elseif ($data && isset($data['data']['orders']) && is_array($data['data']['orders'])) {
            $ordersData = $data['data']['orders'];
        } elseif ($data && isset($data['orders']) && is_array($data['orders'])) {
            $ordersData = $data['orders'];
        } elseif ($data && isset($data['data']['data']) && is_array($data['data']['data'])) {
            $ordersData = $data['data']['data'];
        } elseif ($data && isset($data['data']['results']) && is_array($data['data']['results'])) {
            $ordersData = $data['data']['results'];
        } elseif ($data && isset($data['results']) && is_array($data['results'])) {
            $ordersData = $data['results'];
        }

        if (!$ordersData || !is_array($ordersData)) {
            return [];
        }

        $orders = [];
        foreach ($ordersData as $o) {
            $orderDms = $o['numeroPedido'] ?? $o['orderNumber'] ?? $o['id'] ?? $o['order_dms'] ?? $o['orderDMS'] ?? $o['OrderDMS'] ?? null;
            if ($orderDms !== null && $orderDms !== '') {
                $orders[] = array_merge($o, ['order_dms' => trim((string) $orderDms)]);
            }
        }
        return $orders;
    }

    private function getNexfileBaseUrl(): string
    {
        $url = getenv('NEXFILE_BASE_URL');
        if (!empty($url)) {
            return rtrim($url, '/');
        }
        $row = $this->db->table('config')
            ->select('config_value')
            ->where('category', 'group_api_url')
            ->where('config_key', 'nexfile_base_url')
            ->get()
            ->getRowArray();
        $val = trim($row['config_value'] ?? '');
        return !empty($val) ? rtrim($val, '/') : '';
    }

    /**
     * Reparar relación ClientTotalRelation faltante para un File.
     * Si el pedido no aparece en validación por falta de relación cliente-agencia,
     * este endpoint la crea.
     * POST /api/clients-validation/reparar-relacion
     * Body: { "idFile": 15460 }
     */
    public function repararRelacion()
    {
        try {
            $data = $this->request->getJSON(true) ?? [];
            $idFile = $data['idFile'] ?? $this->request->getGet('idFile');
            if (!$idFile) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El parámetro idFile es requerido',
                    'data' => null
                ])->setStatusCode(400);
            }
            $idFile = (int) $idFile;
            if ($r = $this->requireFileAccess($idFile)) return $r;

            $file = $this->db->query("
                SELECT f.id, f.id_client, f.id_agency
                FROM expedient f
                WHERE f.id = ?
            ", [$idFile])->getRowArray();
            if (!$file) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El pedido no existe',
                    'data' => null
                ])->setStatusCode(404);
            }

            // File.id_client apunta a Client.id, NO a ClientHeader.id
            $idClient = (int) ($file['id_client'] ?? $file['IdClient'] ?? 0);
            $id_agency = (int) ($file['id_agency'] ?? $file['IdAgency'] ?? 0);
            
            // Obtener el ClientHeader.id desde Client.id
            $headerClientInfo = $this->db->query("
                SELECT id FROM client_header WHERE id_client = ?
                LIMIT 1
            ", [$idClient])->getRowArray();
            
            if (!$headerClientInfo) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'No se encontró ClientHeader para el cliente del pedido',
                    'data' => null
                ])->setStatusCode(404);
            }
            
            $idClientHeader = (int) ($headerClientInfo['id'] ?? $headerClientInfo['id'] ?? 0);

            $existe = $this->db->query("
                SELECT 1 FROM client_dms_relation ctr
                WHERE ctr.id_client_header = ? AND ctr.id_agency = ?
            ", [$idClientHeader, $id_agency])->getRowArray();
            if ($existe) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'La relación ya existe; no se requiere reparación',
                    'data' => ['idFile' => $idFile, 'idClientHeader' => $idClientHeader, 'IdAgency' => $id_agency]
                ]);
            }

            // Buscar id_dms de cualquier relación de este ClientHeader
            $otro = $this->db->query("
                SELECT ctr.id_dms FROM client_dms_relation ctr
                WHERE ctr.id_client_header = ?
                LIMIT 1
            ", [$idClientHeader])->getRowArray();
            $idDMS = $otro ? trim((string) ($otro['id_dms'] ?? $otro['IdDMS'] ?? '')) : '';
            
            // Si no se encontró id_dms, buscar si existe una relación con la agencia del file
            // Esto es útil cuando el cliente tiene relación con otra agencia pero necesita relación con esta
            if (empty($idDMS)) {
                // Primero intentar buscar por el mismo cliente (mismo ClientHeader.id_client) pero con otra relación
                $headerClientInfo = $this->db->query("
                    SELECT id_client FROM client_header WHERE id = ?
                ", [$idClientHeader])->getRowArray();
                
                if ($headerClientInfo) {
                    // Buscar si hay otro ClientHeader del mismo cliente que tenga relación con esta agencia
                    $otroClientHeader = $this->db->query("
                        SELECT hc2.id, ctr.id_dms
                        FROM client_header hc2
                        INNER JOIN client_dms_relation ctr ON ctr.id_client_header = hc2.id
                        WHERE hc2.id_client = ?
                        AND ctr.id_agency = ?
                        LIMIT 1
                    ", [$headerClientInfo['id_client'] ?? $headerClientInfo['IdClient'] ?? 0, $id_agency])->getRowArray();
                    
                    if ($otroClientHeader && !empty($otroClientHeader['id_dms'] ?? $otroClientHeader['IdDMS'] ?? null)) {
                        $idDMS = trim((string) ($otroClientHeader['id_dms'] ?? $otroClientHeader['IdDMS'] ?? ''));
                        error_log("✅ Encontrado id_dms '{$idDMS}' de otro ClientHeader del mismo cliente con relación a agencia {$id_agency}");
                    } else {
                        // Si no hay otro ClientHeader, buscar cualquier relación con esta agencia para usar su id_dms
                        $relacionAgencia = $this->db->query("
                            SELECT ctr.id_dms 
                            FROM client_dms_relation ctr
                            WHERE ctr.id_agency = ?
                            LIMIT 1
                        ", [$id_agency])->getRowArray();
                        
                        if ($relacionAgencia && !empty($relacionAgencia['id_dms'] ?? $relacionAgencia['IdDMS'] ?? null)) {
                            $idDMS = trim((string) ($relacionAgencia['id_dms'] ?? $relacionAgencia['IdDMS'] ?? ''));
                            error_log("⚠️ Usando IdDMS '{$idDMS}' de otra relación con la misma agencia {$id_agency}");
                        }
                    }
                }
            }

            $nextIdRow = $this->db->query("SELECT COALESCE(MAX(id), 0) + 1 AS nextId FROM client_dms_relation")->getRowArray();
            $nextId = (int) ($nextIdRow['nextId'] ?? 1);

            $this->db->table('client_dms_relation')->insert([
                'id' => $nextId,
                'idClientHeader' => $idClientHeader,
                'IdAgency' => $id_agency,
                'IdDMS' => $idDMS
            ]);

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Relación cliente-agencia creada correctamente',
                'data' => [
                    'idFile' => $idFile,
                    'idRelation' => $nextId,
                    'idClientHeader' => $idClientHeader,
                    'IdAgency' => $id_agency,
                    'IdDMS' => $idDMS ?: '(vacío)'
                ]
            ]);
        } catch (\Exception $e) {
            error_log("Error en Validacion::repararRelacion: " . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }

    /**
     * Obtener datos de clientes y procesos para la tabla de validación
     * GET /api/validacion/clientes
     */
    public function getClientes()
    {
        try {
            // Obtener parámetros de la petición
            $id_agency = $this->request->getGet('id');
            $idProcess = $this->request->getGet('idProcess');
            $showCancelledParam = $this->request->getGet('showCancelled');
            $showCancelled = ($showCancelledParam === 'true');
            
            
            $page = (int) $this->request->getGet('page') ?: 1;
            $limit = (int) $this->request->getGet('limit') ?: 10;
            $offset = ($page - 1) * $limit;

            // id (agencia) opcional: si no viene o está vacío, "Todas las agencias"
            // idProcess opcional: si no viene o está vacío, "Todos los procesos"
            $filtrarPorAgencia = $id_agency !== null && $id_agency !== '';
            $filtrarPorProceso = $idProcess !== null && $idProcess !== '';

            // Query principal usando SQL directo para evitar problemas con Query Builder
            // PRIORIDAD: El pedido (File) debe pertenecer a la agencia seleccionada
            // El cliente debe estar relacionado con la agencia del pedido a través de ClientTotalRelation
            $sql = "
                SELECT 
                    f.id as idFile,
                    COALESCE(
                        (SELECT ctr1.id_dms 
                         FROM client_dms_relation ctr1 
                         WHERE ctr1.id_client_header = hc.id 
                         AND ctr1.id_agency = f.id_agency 
                         LIMIT 1),
                        (SELECT ctr2.id_dms 
                         FROM client_dms_relation ctr2 
                         WHERE ctr2.id_client_header = hc.id 
                         LIMIT 1),
                        ''
                    ) as ndCliente,
                    f.id_order_total as ndPedido,
                    COALESCE(
                        NULLIF(TRIM(c.razon_social), ''),
                        TRIM(CONCAT(COALESCE(c.name, ''), ' ', COALESCE(c.last_name, ''), ' ', COALESCE(c.mother_last_name, '')))
                    ) as cliente,
                    ct.name as tipoCliente,
                    f.id_customer_type as idCustomerType,
                    p.name as proceso,
                    ot.name as operacion,
                    a.name as agencia,
                    f.id_agency as id_agency,
                    f.registration_date as registro,
                    fs.name as fase,
                    f.id_current_expedient_state,
                    CASE 
                        WHEN f.id_current_expedient_state IN (4, 6) THEN f.update_date
                        ELSE f.agend_date
                    END as fechaLiberacion,
                    CASE 
                        WHEN EXISTS (
                            SELECT 1 
                            FROM expedient_document dbf 
                            INNER JOIN document_status dfs ON dbf.id_current_document_status = dfs.id 
                            WHERE dbf.id_expedient = f.id 
                            AND dfs.id = 2
                        ) THEN 1 
                        ELSE 0 
                    END as tieneDocumentosPendientes,
                    (
                        SELECT COUNT(*) 
                        FROM expedient_document dbfPend
                        WHERE dbfPend.id_expedient = f.id
                        AND dbfPend.enabled = 1
                        AND dbfPend.id_current_document_status <> 4
                    ) as documentosNoAprobados,
                    COALESCE(obc1.vin, obc2.vin) as vin,
                    COALESCE(obc1.model, obc2.model) as modelo,
                    COALESCE(obc1.year, obc2.year) as year,
                    COALESCE(obc1.car_type, obc2.car_type) as version,
                    COALESCE(obc1.amount, obc2.amount) as montoUnidad,
                    /* Aviso confid.: Sí solo si existe registro en expedient_pld con aviso_privacidad_entregado=1; No si no existe registro o no está entregado */
                    (SELECT CASE WHEN EXISTS (
                        SELECT 1 FROM expedient_pld fp_aviso
                        WHERE fp_aviso.id_expedient = f.id
                        AND COALESCE(fp_aviso.aviso_privacidad_entregado, 0) = 1
                    ) THEN 1 ELSE 0 END) as avisoConfidencialidadAceptado,
                    (
                        SELECT COUNT(*) 
                        FROM expedient_pld_beneficial_owner bf 
                        WHERE bf.id_expedient = f.id AND COALESCE(bf.enabled, 1) = 1
                    ) + CASE WHEN COALESCE(fp.beneficiario_final_capturado, 0) = 1 THEN 1 ELSE 0 END as cantidadBeneficiarios,
                    (
                        SELECT COALESCE(SUM(bf2.porcentaje_participacion), 0) 
                        FROM expedient_pld_beneficial_owner bf2 
                        WHERE bf2.id_expedient = f.id AND COALESCE(bf2.enabled, 1) = 1
                    ) + COALESCE(fp.beneficiario_final_porcentaje, 0) as porcentajeBeneficiarios
                FROM expedient f
                LEFT JOIN expedient_pld fp ON fp.id_expedient = f.id
                INNER JOIN client_header hc ON hc.id_client = f.id_client
                INNER JOIN client c ON hc.id_client = c.id
                INNER JOIN process p ON f.id_sale_type = p.id
                INNER JOIN operation_type ot ON f.id_operation = ot.id
                LEFT JOIN customer_type ct ON f.id_customer_type = ct.id
                INNER JOIN expedient_state fs ON f.id_current_expedient_state = fs.id
                INNER JOIN agency a ON f.id_agency = a.id
                LEFT JOIN `order` obc1 ON obc1.id = f.id_order
                LEFT JOIN (
                    SELECT obc2a.id_dms,
                        obc2a.id_agency,
                        obc2a.vin,
                        obc2a.model,
                        obc2a.year,
                        obc2a.car_type,
                        obc2a.amount
                    FROM `order` obc2a
                    INNER JOIN (
                        SELECT id_dms, id_agency, MAX(COALESCE(registration_date, '1900-01-01')) as MaxDate
                        FROM `order`
                        GROUP BY id_dms, id_agency
                    ) obc2b ON obc2a.id_dms = obc2b.id_dms
                        AND obc2a.id_agency = obc2b.id_agency
                        AND COALESCE(obc2a.registration_date, '1900-01-01') = obc2b.MaxDate
                ) obc2 ON f.id_order IS NULL
                    AND obc2.id_dms = f.id_order_total
                    AND obc2.id_agency = f.id_agency
                WHERE 1=1
                " . ($filtrarPorAgencia ? " AND f.id_agency = ?" : "") . "
                AND p.enabled = 1
                AND EXISTS (
                    SELECT 1 
                    FROM client_dms_relation ctr_check 
                    WHERE ctr_check.id_client_header = hc.id 
                    AND ctr_check.id_agency = f.id_agency
                )
            ";

            $params = [];
            if ($filtrarPorAgencia) {
                $params[] = $id_agency;
            }
            if ($filtrarPorProceso) {
                $sql .= " AND f.id_sale_type = ?";
                $params[] = $idProcess;
            }
            
            // Aplicar filtro de pedidos cancelados 
            if ($showCancelled) {
                $sql .= " AND f.id_current_expedient_state = 5";
            } else {
                $sql .= " AND f.id_current_expedient_state != 5";
            }
            
            // LIMIT y OFFSET deben ser valores directos, no parámetros preparados
            $limit = (int) $limit;
            $offset = (int) $offset;
            $sql .= " ORDER BY tieneDocumentosPendientes DESC, ndCliente ASC, ndPedido ASC LIMIT {$limit} OFFSET {$offset}";

            // Ejecutar query principal
            $query = $this->db->query($sql, $params);
            $results = $query->getResultArray();

            // Asegurar avisoConfidencialidadAceptado y mapear id_current_expedient_state → IdCurrentState para el frontend
            foreach ($results as &$row) {
                $idFile = (int) ($row['idFile'] ?? 0);
                $check = $this->db->query(
                    'SELECT 1 FROM expedient_pld WHERE id_expedient = ? AND COALESCE(aviso_privacidad_entregado, 0) = 1 LIMIT 1',
                    [$idFile]
                )->getRow();
                $row['avisoConfidencialidadAceptado'] = $check ? 1 : 0;
                // Frontend espera IdCurrentState (PascalCase); backend devuelve id_current_expedient_state (snake_case)
                $row['IdCurrentState'] = $row['id_current_expedient_state'] ?? null;
            }
            unset($row);

            // Query para contar total de registros
            $countSql = "
                SELECT COUNT(*) as total
                FROM expedient f
                INNER JOIN client_header hc ON hc.id_client = f.id_client
                INNER JOIN client c ON hc.id_client = c.id
                INNER JOIN process p ON f.id_sale_type = p.id
                INNER JOIN operation_type ot ON f.id_operation = ot.id
                INNER JOIN expedient_state fs ON f.id_current_expedient_state = fs.id
                WHERE 1=1
                " . ($filtrarPorAgencia ? " AND f.id_agency = ?" : "") . "
                AND p.enabled = 1
                AND EXISTS (
                    SELECT 1 
                    FROM client_dms_relation ctr_check 
                    WHERE ctr_check.id_client_header = hc.id 
                    AND ctr_check.id_agency = f.id_agency
                )
            ";
            $countParams = [];
            if ($filtrarPorAgencia) {
                $countParams[] = $id_agency;
            }
            if ($filtrarPorProceso) {
                $countSql .= " AND f.id_sale_type = ?";
                $countParams[] = $idProcess;
            }
            if ($showCancelled) {
                $countSql .= " AND f.id_current_expedient_state = 5";
            } else {
                $countSql .= " AND f.id_current_expedient_state != 5";
            }

            $countQuery = $this->db->query($countSql, $countParams);
            $totalResult = $countQuery->getRowArray();
            $total = $totalResult ? $totalResult['total'] : 0;

            // Calcular información de paginación
            $totalPages = ceil($total / $limit);
            $hasNextPage = $page < $totalPages;
            $hasPrevPage = $page > 1;

            // Preparar respuesta
            $response = [
                'success' => true,
                'message' => 'Datos obtenidos exitosamente',
                'data' => [
                    'clientes' => $this->snakeKeys($results),
                    'pagination' => [
                        'currentPage' => $page,
                        'totalPages' => $totalPages,
                        'totalRecords' => $total,
                        'recordsPerPage' => $limit,
                        'hasNextPage' => $hasNextPage,
                        'hasPrevPage' => $hasPrevPage
                    ]
                ]
            ];

            return $this->response->setJSON($response);

        } catch (\Exception $e) {
            // Log del error
            error_log("Error en Validacion::getClientes: " . $e->getMessage());
            
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }

    /**
     * Cancelar pedido
     * POST /api/clients-validation/cancelar-pedido
     */
    public function cancelarPedido()
    {
        try {
            $data = $this->request->getJSON(true);
            
            // Validar datos requeridos
            if (empty($data['clienteId']) || empty($data['motivoId']) || empty($data['comentario'])) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Los parámetros clienteId, motivoId y comentario son requeridos',
                    'data' => null
                ])->setStatusCode(400);
            }
            
            $clienteId = $data['clienteId'];
            $motivoId = $data['motivoId'];
            $comentario = $data['comentario'];
            if ($r = $this->requireFileAccess($clienteId)) return $r;

            // Actualizar el registro en la tabla File
            $updateData = [
                'id_current_expedient_state' => 5, // Estado cancelado
                'description' => $comentario,
                'update_date' => date('Y-m-d H:i:s'),
                'id_last_user_update' => 1 // TODO: Obtener el ID del usuario actual
            ];
            
            $result = $this->db->table('expedient')
                ->where('id', $clienteId)
                ->update($updateData);
            
            if ($result) {
                // Registrar actividad en el log
                $this->logActivity(
                    'CANCELAR_PEDIDO',
                    "Pedido {$clienteId} cancelado",
                    [
                        'cliente_id' => $clienteId,
                        'motivo_id' => $motivoId,
                        'comentario' => $comentario,
                        'estado_anterior' => 'Activo',
                        'estado_nuevo' => 'Cancelado',
                        'fecha_cancelacion' => $updateData['update_date']
                    ],
                    $clienteId
                );

                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Pedido cancelado exitosamente',
                    'data' => [
                        'clienteId' => $clienteId,
                        'motivoId' => $motivoId,
                        'comentario' => $comentario,
                        'fechaCancelacion' => $updateData['update_date']
                    ]
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'No se pudo cancelar el pedido',
                    'data' => null
                ])->setStatusCode(500);
            }
            
        } catch (\Exception $e) {
            error_log("Error en Validacion::cancelarPedido: " . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }

    /**
     * Crear excepción en pedido
     * POST /api/clients-validation/excepcion-pedido
     */
    public function excepcionPedido()
    {
        try {
            $data = $this->request->getJSON(true);
            
            // Validar datos requeridos
            if (empty($data['clienteId']) || empty($data['motivoId']) || empty($data['comentario'])) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Los parámetros clienteId, motivoId y comentario son requeridos',
                    'data' => null
                ])->setStatusCode(400);
            }
            
            $clienteId = $data['clienteId'];
            $motivoId = $data['motivoId'];
            $comentario = $data['comentario'];
            if ($r = $this->requireFileAccess($clienteId)) return $r;

            // Actualizar el registro en la tabla File
            $updateData = [
                'id_current_expedient_state' => 6, // Estado excepción
                'description' => $comentario,
                'update_date' => date('Y-m-d H:i:s'),
                'id_last_user_update' => $this->getCurrentUserId() ?? 1
            ];
            
            $result = $this->db->table('expedient')
                ->where('id', $clienteId)
                ->update($updateData);
            
            if ($result) {
                // Registrar actividad en el log
                $this->logActivity(
                    'CREAR_EXCEPCION',
                    "Excepción creada para pedido {$clienteId}",
                    [
                        'cliente_id' => $clienteId,
                        'motivo_id' => $motivoId,
                        'comentario' => $comentario,
                        'estado_anterior' => 'Activo',
                        'estado_nuevo' => 'Liberado por Excepción',
                        'fecha_excepcion' => $updateData['update_date']
                    ],
                    $clienteId
                );

                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Excepción creada exitosamente',
                    'data' => [
                        'clienteId' => $clienteId,
                        'motivoId' => $motivoId,
                        'comentario' => $comentario,
                        'fechaExcepcion' => $updateData['update_date']
                    ]
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'No se pudo crear la excepción',
                    'data' => null
                ])->setStatusCode(500);
            }
            
        } catch (\Exception $e) {
            error_log("Error en Validacion::excepcionPedido: " . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }

    /**
     * Eliminar pedido y sus relaciones
     * DELETE /api/clients-validation/eliminar-pedido
     */
    public function eliminarPedido()
    {
        try {
            // Obtener datos del request (fallback para DELETE con body - getJSON puede fallar)
            $rawBody = $this->request->getBody();
            $data = $this->request->getJSON(true);
            if ($data === null && !empty($rawBody)) {
                $data = json_decode($rawBody, true);
            }
            
            // Validar datos requeridos
            if (empty($data['clienteId'])) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El parámetro clienteId es requerido',
                    'data' => null
                ])->setStatusCode(400);
            }
            
            $clienteId = (int) $data['clienteId'];
            if ($r = $this->requireFileAccess($clienteId)) return $r;

            // Verificar que el expediente exista
            $existe = $this->db->table('expedient')->where('id', $clienteId)->countAllResults();
            if ($existe === 0) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'No se encontró el pedido con el ID especificado',
                    'data' => null
                ])->setStatusCode(404);
            }
            
            $this->db->transStart();

            $this->deleteFileDependents($clienteId);

            $this->db->query("DELETE FROM expedient_document WHERE id_expedient = ?", [$clienteId]);

            $this->db->query("DELETE FROM expedient WHERE id = ?", [$clienteId]);
            $fileDeleted = $this->db->affectedRows();

            if ($this->db->transStatus() === false || $fileDeleted === 0) {
                $this->db->transRollback();
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'No se pudo eliminar el pedido',
                    'data' => null
                ])->setStatusCode(500);
            }
            
            // Confirmar transacción
            $this->db->transComplete();
            
            // Registrar actividad en el log
            $this->logActivity(
                'ELIMINAR_PEDIDO',
                "Pedido {$clienteId} eliminado permanentemente",
                [
                    'cliente_id' => $clienteId,
                    'accion' => 'Eliminación completa',
                    'tablas_afectadas' => ['expedient', 'expedient_document'],
                    'fecha_eliminacion' => date('Y-m-d H:i:s')
                ],
                $clienteId
            );
            
            return $this->response->setJSON([
                'success' => true,
                'message' => 'Pedido eliminado exitosamente',
                'data' => [
                    'clienteId' => $clienteId,
                    'fechaEliminacion' => date('Y-m-d H:i:s')
                ]
            ]);
            
        } catch (\Exception $e) {
            $this->db->transRollback();
            error_log("Error en Validacion::eliminarPedido: " . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }

    /**
     * Cambiar estatus del pedido
     * PUT /api/clients-validation/cambiar-estatus
     */
    public function cambiarEstatus()
    {
        try {
            // Obtener datos del request
            $rawBody = $this->request->getBody();
            $data = $this->request->getJSON(true);
            
            // Log para debugging
            error_log("=== DEBUG cambiarEstatus ===");
            error_log("Raw body: " . $rawBody);
            error_log("Parsed data: " . json_encode($data));
            
            // Si getJSON falla, intentar parsear manualmente
            if ($data === null && !empty($rawBody)) {
                $data = json_decode($rawBody, true);
                error_log("Re-parsed data: " . json_encode($data));
            }
            
            // Validar que se recibieron datos
            if ($data === null || !is_array($data)) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'No se recibieron datos válidos en el request',
                    'data' => ['raw_body' => $rawBody]
                ])->setStatusCode(400);
            }
            
            // Validar datos requeridos
            if (empty($data['clienteId']) || empty($data['nuevoIdCurrentState'])) {
                error_log("Datos faltantes - clienteId: " . (isset($data['clienteId']) ? $data['clienteId'] : 'no definido') . ", nuevoIdCurrentState: " . (isset($data['nuevoIdCurrentState']) ? $data['nuevoIdCurrentState'] : 'no definido'));
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Los parámetros clienteId y nuevoIdCurrentState son requeridos',
                    'data' => ['received_data' => $data]
                ])->setStatusCode(400);
            }
            
            $clienteId = (int) $data['clienteId'];
            $nuevoIdCurrentState = (int) $data['nuevoIdCurrentState'];
            if ($r = $this->requireFileAccess($clienteId)) return $r;
            
            error_log("=== DEBUG cambiarEstatus ===");
            error_log("clienteId: {$clienteId}, nuevoIdCurrentState: {$nuevoIdCurrentState}");
            
            // Primero, obtener todos los estados disponibles para debugging
            $todosEstadosQuery = $this->db->table('expedient_state')
                ->select('id, Name')
                ->get();
            $todosEstados = $todosEstadosQuery->getResultArray();
            error_log("Todos los estados disponibles en expedient_state: " . json_encode($todosEstados));

            // Verificar que el estado existe en la tabla expedient_state por ID
            $estadoQuery = $this->db->table('expedient_state')
                ->select('id, name')
                ->where('id', $nuevoIdCurrentState)
                ->get();
            $estado = $estadoQuery->getRowArray();

            error_log("Estado encontrado por ID {$nuevoIdCurrentState}: " . json_encode($estado));

            if (!$estado) {
                $estadosDisponibles = array_map(function($e) {
                    return "ID: {$e['id']} - {$e['Name']}";
                }, $todosEstados);
                
                return $this->response->setJSON([
                    'success' => false,
                    'message' => "El estado seleccionado (ID: {$nuevoIdCurrentState}) no existe en la base de datos. Estados disponibles: " . implode(', ', $estadosDisponibles),
                    'data' => [
                        'estado_solicitado' => $nuevoIdCurrentState,
                        'estados_disponibles' => $todosEstados
                    ]
                ])->setStatusCode(400);
            }
            
            // Obtener el nombre del estado solo para logging/mensajes
            $nombreEstado = $estado['name'] ?? 'ID: ' . $nuevoIdCurrentState;
            
            // Actualizar el registro en la tabla File
            $updateData = [
                'id_current_expedient_state' => $nuevoIdCurrentState,
                'update_date' => date('Y-m-d H:i:s'),
                'id_last_user_update' => $this->getCurrentUserId() ?? 1
            ];
            
            $result = $this->db->table('expedient')
                ->where('id', $clienteId)
                ->update($updateData);
            
            if ($result) {
                // Registrar actividad en el log
                $this->logActivity(
                    'CAMBIAR_ESTATUS',
                    "Estatus del pedido {$clienteId} cambiado a {$nombreEstado}",
                    [
                        'cliente_id' => $clienteId,
                        'estado_anterior_id' => null, // TODO: Obtener estado anterior
                        'estado_nuevo_id' => $nuevoIdCurrentState,
                        'estado_nuevo_nombre' => $nombreEstado,
                        'fecha_cambio' => $updateData['update_date']
                    ],
                    $clienteId
                );
                
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Estatus cambiado exitosamente',
                    'data' => [
                        'clienteId' => $clienteId,
                        'nuevoIdCurrentState' => $nuevoIdCurrentState,
                        'nombreEstado' => $nombreEstado,
                        'fechaCambio' => $updateData['update_date']
                    ]
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'No se pudo cambiar el estatus del pedido',
                    'data' => null
                ])->setStatusCode(500);
            }
            
        } catch (\Exception $e) {
            error_log("Error en Validacion::cambiarEstatus: " . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }

    /**
     * Obtener estadísticas de estados para la agencia y proceso seleccionados
     * GET /api/validacion/estadisticas
     */
    public function getEstadisticas()
    {
        try {
            $id_agency = $this->request->getGet('id');
            $idProcess = $this->request->getGet('idProcess');

            if (!$id_agency || !$idProcess) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Los parámetros id e idProcess son requeridos',
                    'data' => null
                ])->setStatusCode(400);
            }

            $query = $this->db->table('expedient f')
                ->select('fs.name as estado, COUNT(*) as cantidad')
                ->join('process p', 'f.id_sale_type = p.id', 'inner')
                ->join('expedient_state fs', 'f.id_current_expedient_state = fs.id', 'inner')
                ->where('f.id_agency', $id_agency)
                ->where('f.id_sale_type', $idProcess)
                ->where('p.enabled', 1)
                ->groupBy('f.id_current_expedient_state, fs.name')
                ->orderBy('f.id_current_expedient_state');

            $results = $query->get()->getResultArray();

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Estadísticas obtenidas exitosamente',
                'data' => $results
            ]);

        } catch (\Exception $e) {
            error_log("Error en Validacion::getEstadisticas: " . $e->getMessage());
            
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }

    /**
     * Obtener documentos de un archivo específico
     * GET /api/validacion/documentos?idFile=123
     */
    public function getDocumentos()
    {
        try {
            // Obtener parámetros de la petición
            $idFile = $this->request->getGet('idFile');

            // Validar parámetros requeridos
            if (!$idFile) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El parámetro idFile es requerido',
                    'data' => null
                ])->setStatusCode(400);
            }
            if ($r = $this->requireFileAccess($idFile)) return $r;

            // requerido: si el documento está en configuration_process_document_type para este expediente, es requerido (1).
            // Si no, usar dt.required del document_type (por defecto 1).
            $query = $this->db->table('expedient_document dbf')
                ->select('
                    dbf.id as idFileDocument,
                    dbf.id as idDocumentByFile,
                    dbf.id_document_type as idDocumentType,
                    p.name as proceso,
                    fs.name as fase,
                    dbf.name as documento,
                    dt.name as tipoDocumento,
                    dbf.comment as comentario,
                    dbf.registration_date as fecha,
                    u.name as asignado,
                    COALESCE(
                        (SELECT 1 FROM configuration_process_document_type cpd
                         INNER JOIN configuration_process cp ON cp.id = cpd.id_configuration_process AND cp.enabled = 1
                         WHERE cpd.id_document_type = dbf.id_document_type
                           AND cp.id_sale_type = f.id_sale_type
                           AND cp.id_agency = f.id_agency
                           AND COALESCE(cp.id_customer_type, 0) = COALESCE(f.id_customer_type, 0)
                           AND COALESCE(cp.id_operation_type, 0) = COALESCE(f.id_operation, 0)
                         LIMIT 1),
                        dt.required,
                        1
                    ) as requerido,
                    dfs.id as idEstatus,
                    dfs.name as EstatusName,
                    dt.req_expiration as ReqExpiration,
                    dbf.expiration_date as fechaExpiracion,
                    dbf.id_document_container as documentContainer,
                    dt.available_to_client as DisponibleCliente,
                    COALESCE(lrd.amount, 0) as receiptAmount,
                    lrd.id_payment_method as idPaymentMethod,
                    pm.name as paymentMethodName,
                    lrd.payment_date as paymentDate,
                    lrd.registration_date as registrationDate
                ')
                ->join('expedient f', 'dbf.id_expedient = f.id', 'inner')
                ->join('process p', 'f.id_sale_type = p.id', 'inner')
                ->join('document_type dt', 'dbf.id_document_type = dt.id', 'inner')
                ->join('expedient_state fs', 'dt.id_sale_type = fs.id', 'inner')
                ->join('document_status dfs', 'dbf.id_current_document_status = dfs.id', 'inner')
                ->join('user u', 'dbf.id_last_user_update = u.id', 'left')
                ->join('liquidation_receipt_detail lrd', 'lrd.id_expedient_document = dbf.id AND lrd.id_expedient = dbf.id_expedient', 'left')
                ->join('payment_method pm', 'pm.id = lrd.id_payment_method', 'left')
                ->where('dbf.id_expedient', $idFile)
                ->where('dbf.enabled', 1)
                ->orderBy('p.name', 'ASC')
                ->orderBy('fs.name', 'ASC')
                ->orderBy('dt.name', 'ASC');

            // Log del query generado para debugging
                       
            $results = $query->get()->getResultArray();
            $idDocumentTypeLiquidacion = $this->getConfigDocumentTypeLiquidacion();

            $responseData = [
                'success' => true,
                'message' => 'Documentos obtenidos exitosamente',
                'data' => $results,
                'idDocumentTypeLiquidacion' => $idDocumentTypeLiquidacion
            ];

            // Incluir monto del expediente y suma de comprobantes para validación de avance a liberación
            $expedientAmount = 0.0;
            $totalReceiptAmount = 0.0;
            $file = $this->db->table('expedient')
                ->select('id, id_order, id_order_total, id_agency')
                ->where('id', $idFile)
                ->get()
                ->getRowArray();
            if ($file) {
                if (!empty($file['id_order'])) {
                    $orderRow = $this->db->table('order')->select('amount')->where('id', $file['id_order'])->get()->getRowArray();
                    $expedientAmount = (float) ($orderRow['amount'] ?? 0);
                } elseif (!empty($file['id_order_total']) && !empty($file['id_agency'])) {
                    $orderRow = $this->db->query("
                        SELECT obc2a.amount FROM `order` obc2a
                        INNER JOIN (SELECT id_dms, id_agency, MAX(COALESCE(registration_date, '1900-01-01')) AS MaxDate FROM `order` GROUP BY id_dms, id_agency) obc2b
                        ON obc2a.id_dms = obc2b.id_dms AND obc2a.id_agency = obc2b.id_agency AND COALESCE(obc2a.registration_date, '1900-01-01') = obc2b.MaxDate
                        WHERE obc2a.id_dms = ? AND obc2a.id_agency = ?
                    ", [$file['id_order_total'], $file['id_agency']])->getRowArray();
                    $expedientAmount = (float) ($orderRow['amount'] ?? 0);
                }
                try {
                    $sumRow = $this->db->query("
                        SELECT COALESCE(SUM(lrd.amount), 0) AS total FROM liquidation_receipt_detail lrd
                        INNER JOIN expedient_document fd ON fd.id = lrd.id_expedient_document AND fd.enabled = 1
                        WHERE lrd.id_expedient = ?
                    ", [$idFile])->getRowArray();
                    $totalReceiptAmount = (float) ($sumRow['total'] ?? 0);
                } catch (\Exception $e) {
                    // Tabla puede no existir
                }
            }
            $responseData['expedientAmount'] = $expedientAmount;
            $responseData['totalReceiptAmount'] = $totalReceiptAmount;

            return $this->response->setJSON($this->snakeKeys($responseData));

        } catch (\Exception $e) {
            error_log("Error en Validacion::getDocumentos: " . $e->getMessage());
            
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }

    /**
     * Crear un documento adicional de Liquidación para un expediente
     * POST /api/clients-validation/documentos/liquidacion
     * Body: { idFile, monto, id_payment_method, fecha_pago? }
     */
    public function agregarDocumentoLiquidacion()
    {
        try {
            $data = $this->request->getJSON(true);

            if (empty($data['idFile'])) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El parámetro idFile es requerido',
                    'data' => null
                ])->setStatusCode(400);
            }

            if (!isset($data['monto']) || $data['monto'] === '' || $data['monto'] === null) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El monto del comprobante es requerido',
                    'data' => null
                ])->setStatusCode(400);
            }

            if (empty($data['id_payment_method'])) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El tipo de pago es requerido',
                    'data' => null
                ])->setStatusCode(400);
            }

            $monto = (float) $data['monto'];
            if ($monto <= 0) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El monto debe ser mayor a cero',
                    'data' => null
                ])->setStatusCode(400);
            }

            $idPaymentMethod = (int) $data['id_payment_method'];
            $idFile = (int) $data['idFile'];
            if ($r = $this->requireFileAccess($idFile)) return $r;
            $documentTypeId = $this->getConfigDocumentTypeLiquidacion();
            if ($documentTypeId === null) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Configure id_document_type_liquidacion en la tabla config',
                    'data' => null
                ])->setStatusCode(500);
            }

            // Verificar que el expediente exista y obtener monto del pedido
            $file = $this->db->table('expedient')
                ->select('id, id_order, id_order_total, id_agency')
                ->where('id', $idFile)
                ->get()
                ->getRowArray();

            if (!$file) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El expediente especificado no existe',
                    'data' => null
                ])->setStatusCode(404);
            }

            // Obtener monto del expediente (order.amount)
            $montoExpediente = 0.0;
            if (!empty($file['id_order'])) {
                $orderRow = $this->db->table('order')
                    ->select('amount')
                    ->where('id', $file['id_order'])
                    ->get()
                    ->getRowArray();
                $montoExpediente = (float) ($orderRow['amount'] ?? 0);
            } elseif (!empty($file['id_order_total']) && !empty($file['id_agency'])) {
                $orderRow = $this->db->query("
                    SELECT obc2a.amount
                    FROM `order` obc2a
                    INNER JOIN (
                        SELECT id_dms, id_agency, MAX(COALESCE(registration_date, '1900-01-01')) AS MaxDate
                        FROM `order`
                        GROUP BY id_dms, id_agency
                    ) obc2b ON obc2a.id_dms = obc2b.id_dms
                        AND obc2a.id_agency = obc2b.id_agency
                        AND COALESCE(obc2a.registration_date, '1900-01-01') = obc2b.MaxDate
                    WHERE obc2a.id_dms = ? AND obc2a.id_agency = ?
                ", [$file['id_order_total'], $file['id_agency']])->getRowArray();
                $montoExpediente = (float) ($orderRow['amount'] ?? 0);
            }

            // Suma actual de comprobantes de liquidación del expediente
            try {
                $sumRow = $this->db->query("
                    SELECT COALESCE(SUM(lrd.amount), 0) AS total
                    FROM liquidation_receipt_detail lrd
                    INNER JOIN expedient_document fd ON fd.id = lrd.id_expedient_document AND fd.enabled = 1
                    WHERE lrd.id_expedient = ? AND fd.id_document_type = ?
                ", [$idFile, $documentTypeId])->getRowArray();
            } catch (\Exception $e) {
                error_log("Error consultando liquidation_receipt_detail: " . $e->getMessage());
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'La tabla liquidation_receipt_detail no existe. Ejecute la migración 051: BE/DB/migrations/051_create_liquidation_receipt_detail.sql',
                    'data' => null
                ])->setStatusCode(500);
            }
            $sumaActual = (float) ($sumRow['total'] ?? 0);

            if (($sumaActual + $monto) > $montoExpediente) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'La suma de los montos de los comprobantes no puede superar el monto del expediente ($' . number_format($montoExpediente, 2) . '). Suma actual: $' . number_format($sumaActual, 2),
                    'data' => null
                ])->setStatusCode(400);
            }

            // Obtener el nombre base del tipo de documento
            $documentType = $this->db->table('document_type')
                ->select('name')
                ->where('id', $documentTypeId)
                ->get()
                ->getRowArray();

            if (!$documentType) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El tipo de documento de liquidación no está configurado',
                    'data' => null
                ])->setStatusCode(500);
            }

            $baseName = trim($documentType['name'] ?? $documentType['Name'] ?? 'Liquidación');
            if ($baseName === '') {
                $baseName = 'Liquidación';
            }

            // Obtener documentos existentes de liquidación para calcular el consecutivo
            $existingDocuments = $this->db->table('expedient_document')
                ->select('name')
                ->where('id_expedient', $idFile)
                ->where('id_document_type', $documentTypeId)
                ->orderBy('id', 'ASC')
                ->get()
                ->getResultArray();

            $maxCounter = 0;
            foreach ($existingDocuments as $existing) {
                $name = trim($existing['name'] ?? '');
                if ($name === '') {
                    continue;
                }

                if (preg_match('/(\d+)\s*$/', $name, $matches)) {
                    $maxCounter = max($maxCounter, (int) $matches[1]);
                }
            }

            $nextCounter = $maxCounter + 1;
            $documentName = trim($baseName . ' ' . $nextCounter);

            // Garantizar que no exista un documento con el mismo nombre
            while ($this->db->table('expedient_document')
                ->where('id_expedient', $idFile)
                ->where('name', $documentName)
                ->countAllResults() > 0) {
                $nextCounter++;
                $documentName = trim($baseName . ' ' . $nextCounter);
            }

            // Obtener siguiente ID manualmente
            $nextIdRow = $this->db->query("SELECT COALESCE(MAX(id), 0) + 1 AS nextId FROM expedient_document")
                ->getRowArray();
            $nextId = (int) ($nextIdRow['nextId'] ?? 1);

            $currentUserId = $this->getCurrentUserId() ?? 1;
            $now = date('Y-m-d H:i:s');

            // Fecha real del pago (para PLD): opcional, si no se envía se usa hoy
            $paymentDate = null;
            if (!empty($data['fecha_pago'])) {
                $parsed = date_parse($data['fecha_pago']);
                if ($parsed['error_count'] === 0 && checkdate($parsed['month'] ?? 0, $parsed['day'] ?? 0, $parsed['year'] ?? 0)) {
                    $paymentDate = $data['fecha_pago'];
                }
            }
            if ($paymentDate === null) {
                $paymentDate = date('Y-m-d');
            }

            $documentData = [
                'id' => $nextId,
                'name' => $documentName,
                'comment' => null,
                'expiration_date' => null,
                'path_document' => null,
                'enabled' => 1,
                'registration_date' => $now,
                'update_date' => $now,
                'last_user_update' => $currentUserId,
                'id_last_user_update' => $currentUserId,
                'id_expedient' => $idFile,
                'id_validation' => null,
                'id_document_type' => $documentTypeId,
                'id_current_document_status' => 1,
                'id_document_error' => null
            ];

            if (!$this->db->table('expedient_document')->insert($documentData)) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'No se pudo crear el documento de liquidación',
                    'data' => null
                ])->setStatusCode(500);
            }

            // Insertar detalle de comprobante (monto, método de pago, fecha real del pago)
            try {
                $this->db->table('liquidation_receipt_detail')->insert([
                'id_expedient_document' => $nextId,
                'id_expedient' => $idFile,
                'amount' => $monto,
                'id_payment_method' => $idPaymentMethod,
                'payment_date' => $paymentDate,
                'registration_date' => $now,
                'update_date' => $now,
                'id_last_user_update' => $currentUserId
            ]);
            } catch (\Exception $e) {
                error_log("Error insertando liquidation_receipt_detail: " . $e->getMessage());
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al guardar el detalle del comprobante. Verifique que la tabla liquidation_receipt_detail existe (ejecute la migración 051). Detalle: ' . $e->getMessage(),
                    'data' => null
                ])->setStatusCode(500);
            }

            $this->logActivity(
                'AGREGAR_DOCUMENTO_LIQUIDACION',
                "Documento de liquidación agregado al expediente {$idFile}",
                [
                    'file_id' => $idFile,
                    'pedido' => $file['id_order_total'] ?? null,
                    'document_type_id' => $documentTypeId,
                    'document_name' => $documentName,
                    'consecutivo' => $nextCounter
                ],
                $idFile
            );

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Documento de liquidación agregado correctamente',
                'data' => [
                    'idFileDocument' => $nextId,
                    'documentName' => $documentName,
                    'consecutivo' => $nextCounter
                ]
            ]);
        } catch (\Exception $e) {
            error_log("Error en Validacion::agregarDocumentoLiquidacion: " . $e->getMessage());

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }

    /**
     * Validar documento - cambiar estatus de "3" a "4"
     * POST /api/clients-validation/validar-documento
     */
    public function validarDocumento()
    {
        try {
            $data = $this->request->getJSON(true);
            
            // Validar datos requeridos
            if (empty($data['idFileDocument'])) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El parámetro idFileDocument es requerido',
                    'data' => null
                ])->setStatusCode(400);
            }
            
            $idFileDocument = $data['idFileDocument'];

            // Verificar que el documento existe y tiene estatus "3"
            $documento = $this->db->table('expedient_document')
                ->where('id', $idFileDocument)
                ->where('id_current_document_status', 3)
                ->get()
                ->getRowArray();

            if (!$documento) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El documento no existe o no está listo para validar',
                    'data' => null
                ])->setStatusCode(400);
            }
            if ($r = $this->requireFileAccess((int) ($documento['id_expedient'] ?? 0))) return $r;
            
            // Actualizar el estatus del documento a "4" (Validado y aprobado)
            $updateData = [
                'id_current_document_status' => 4,
                'update_date' => date('Y-m-d H:i:s'),
                'id_last_user_update' => 1 // TODO: Obtener el ID del usuario actual
            ];
            
            $result = $this->db->table('expedient_document')
                ->where('id', $idFileDocument)
                ->update($updateData);
            
            if ($result) {
                // Registrar actividad en el log (incluir file_id para historial por expediente)
                $idFile = $documento['id_expedient'] ?? null;
                $this->logActivity(
                    'VALIDAR_DOCUMENTO',
                    "Documento {$idFileDocument} validado",
                    [
                        'file_id' => $idFile,
                        'documento_id' => $idFileDocument,
                        'estado_anterior' => 'Listo para validar (3)',
                        'estado_nuevo' => 'Validado y aprobado (4)',
                        'fecha_validacion' => $updateData['update_date']
                    ],
                    $idFile
                );

                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Documento validado exitosamente',
                    'data' => [
                        'idFileDocument' => $idFileDocument,
                        'estadoAnterior' => 3,
                        'estadoNuevo' => 4,
                        'fechaValidacion' => $updateData['update_date']
                    ]
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'No se pudo validar el documento',
                    'data' => null
                ])->setStatusCode(500);
            }
            
        } catch (\Exception $e) {
            error_log("Error en Validacion::validarDocumento: " . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }

    /**
     * Aprobar/Rechazar documento - cambiar estatus a "4" (aprobado) o "5" (rechazado)
     * POST /api/clients-validation/aprobar-documento
     */
    public function aprobarDocumento()
    {
        try {
            $data = $this->request->getJSON(true);
            
            // Aceptar idFileDocument o idDocumentByFile (frontend usa idDocumentByFile)
            $idFileDocument = $data['idFileDocument'] ?? $data['idDocumentByFile'] ?? null;
            if (empty($idFileDocument) || empty($data['nuevoEstatus'])) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Los parámetros idFileDocument (o idDocumentByFile) y nuevoEstatus son requeridos',
                    'data' => null
                ])->setStatusCode(400);
            }
            $nuevoEstatus = $data['nuevoEstatus'];
            $comentario = $data['comentario'] ?? null;
            $fechaExpiracion = $data['fechaExpiracion'] ?? null;
            $monto = isset($data['monto']) ? (float) $data['monto'] : null;
            $idPaymentMethod = isset($data['id_payment_method']) ? (int) $data['id_payment_method'] : null;
            $fechaPago = $data['fecha_pago'] ?? null;

            // Validar que el nuevo estatus sea válido (4 = Aprobado, 5 = Rechazado)
            if (!in_array($nuevoEstatus, [4, 5])) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El nuevo estatus debe ser 4 (Aprobado) o 5 (Rechazado)',
                    'data' => null
                ])->setStatusCode(400);
            }
            
            // Obtener información del usuario actual
            $currentUser = $this->getAuthenticatedUser();
            if (!$currentUser) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'token de autorización requerido',
                    'data' => null
                ])->setStatusCode(401);
            }
            
            // Verificar que el documento existe
            $documento = $this->db->table('expedient_document')
                ->where('id', $idFileDocument)
                ->get()
                ->getRowArray();

            if (!$documento) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El documento no existe',
                    'data' => null
                ])->setStatusCode(400);
            }
            if ($r = $this->requireFileAccess((int) ($documento['id_expedient'] ?? 0))) return $r;


            // Verificar permisos según el rol del usuario
            $userRoleId = $currentUser['role_id'];
            $currentStatus = $documento['id_current_document_status'];
            
            // Lógica de permisos:
            // - Usuarios normales: solo pueden aprobar/rechazar documentos con estatus "3" (en revisión)
            // - Gerentes (6) y Administradores (7): pueden rechazar documentos aprobados (estatus "4")
            if ($userRoleId == '6' || $userRoleId == '7') {
                // Gerentes y administradores pueden rechazar documentos aprobados
                if ($nuevoEstatus == 5 && $currentStatus == 4) {
                    // Permitir rechazar documento aprobado
                } elseif ($currentStatus != 3) {
                    return $this->response->setJSON([
                        'success' => false,
                        'message' => 'Solo se pueden aprobar/rechazar documentos en revisión (estatus 3)',
                        'data' => null
                    ])->setStatusCode(400);
                }
            } else {
                // Usuarios normales solo pueden trabajar con documentos en revisión
                if ($currentStatus != 3) {
                    return $this->response->setJSON([
                        'success' => false,
                        'message' => 'El documento no está listo para aprobar/rechazar',
                        'data' => null
                    ])->setStatusCode(400);
                }
            }
            
            // Actualizar el estatus del documento
            $updateData = [
                'id_current_document_status' => $nuevoEstatus,
                'update_date' => date('Y-m-d H:i:s'),
                'id_last_user_update' => $currentUser['user_id']
            ];
            
            // Si hay comentario, actualizarlo también
            if ($comentario) {
                $updateData['comment'] = $comentario;
            }
            
            // Si hay fecha de expiración, actualizarla también
            if ($fechaExpiracion) {
                $updateData['expiration_date'] = $fechaExpiracion;
            }

            // Documentos de liquidación: al aprobar, requerir monto y método de pago e insertar/actualizar liquidation_receipt_detail
            $idFile = (int) ($documento['id_expedient'] ?? 0);
            $idDocumentType = (int) ($documento['id_document_type'] ?? 0);
            $documentTypeLiquidacion = $this->getConfigDocumentTypeLiquidacion();

            if ($nuevoEstatus == 4 && $documentTypeLiquidacion !== null && $idDocumentType === $documentTypeLiquidacion) {
                if ($monto === null || $monto <= 0) {
                    return $this->response->setJSON([
                        'success' => false,
                        'message' => 'El monto del comprobante es requerido para documentos de liquidación',
                        'data' => null
                    ])->setStatusCode(400);
                }
                if (empty($idPaymentMethod)) {
                    return $this->response->setJSON([
                        'success' => false,
                        'message' => 'El tipo de pago es requerido para documentos de liquidación',
                        'data' => null
                    ])->setStatusCode(400);
                }

                // Obtener monto del expediente
                $file = $this->db->table('expedient')->select('id, id_order, id_order_total, id_agency')->where('id', $idFile)->get()->getRowArray();
                $montoExpediente = 0.0;
                if ($file) {
                    if (!empty($file['id_order'])) {
                        $orderRow = $this->db->table('order')->select('amount')->where('id', $file['id_order'])->get()->getRowArray();
                        $montoExpediente = (float) ($orderRow['amount'] ?? 0);
                    } elseif (!empty($file['id_order_total']) && !empty($file['id_agency'])) {
                        $orderRow = $this->db->query("
                            SELECT obc2a.amount FROM `order` obc2a
                            INNER JOIN (SELECT id_dms, id_agency, MAX(COALESCE(registration_date, '1900-01-01')) AS MaxDate FROM `order` GROUP BY id_dms, id_agency) obc2b
                            ON obc2a.id_dms = obc2b.id_dms AND obc2a.id_agency = obc2b.id_agency AND COALESCE(obc2a.registration_date, '1900-01-01') = obc2b.MaxDate
                            WHERE obc2a.id_dms = ? AND obc2a.id_agency = ?
                        ", [$file['id_order_total'], $file['id_agency']])->getRowArray();
                        $montoExpediente = (float) ($orderRow['amount'] ?? 0);
                    }
                }

                $sumRow = $this->db->query("
                    SELECT COALESCE(SUM(lrd.amount), 0) AS total FROM liquidation_receipt_detail lrd
                    INNER JOIN expedient_document fd ON fd.id = lrd.id_expedient_document AND fd.enabled = 1
                    WHERE lrd.id_expedient = ? AND fd.id_document_type = ?
                ", [$idFile, $documentTypeLiquidacion])->getRowArray();
                $sumaActual = (float) ($sumRow['total'] ?? 0);

                $existingLrd = $this->db->table('liquidation_receipt_detail')
                    ->where('id_expedient_document', $idFileDocument)
                    ->where('id_expedient', $idFile)
                    ->get()->getRowArray();
                $montoAnterior = $existingLrd ? (float) ($existingLrd['amount'] ?? 0) : 0;
                $sumaParaValidar = $sumaActual - $montoAnterior + $monto;

                if ($sumaParaValidar > $montoExpediente) {
                    return $this->response->setJSON([
                        'success' => false,
                        'message' => 'La suma de los comprobantes no puede superar el monto del expediente ($' . number_format($montoExpediente, 2) . ')',
                        'data' => null
                    ])->setStatusCode(400);
                }

                $now = date('Y-m-d H:i:s');
                $currentUserId = $this->getCurrentUserId() ?? 1;

                // Fecha real del pago (para PLD): opcional, si no se envía se usa hoy
                $paymentDate = null;
                if (!empty($fechaPago)) {
                    $parsed = date_parse($fechaPago);
                    if ($parsed['error_count'] === 0 && checkdate($parsed['month'] ?? 0, $parsed['day'] ?? 0, $parsed['year'] ?? 0)) {
                        $paymentDate = $fechaPago;
                    }
                }
                if ($paymentDate === null) {
                    $paymentDate = date('Y-m-d');
                }

                $lrdUpdateData = [
                    'amount' => $monto,
                    'id_payment_method' => $idPaymentMethod,
                    'payment_date' => $paymentDate,
                    'update_date' => $now,
                    'id_last_user_update' => $currentUserId
                ];
                if ($existingLrd) {
                    $this->db->table('liquidation_receipt_detail')
                        ->where('id_expedient_document', $idFileDocument)
                        ->where('id_expedient', $idFile)
                        ->update($lrdUpdateData);
                } else {
                    $this->db->table('liquidation_receipt_detail')->insert(array_merge($lrdUpdateData, [
                        'id_expedient_document' => $idFileDocument,
                        'id_expedient' => $idFile,
                        'registration_date' => $now,
                    ]));
                }
            }
            
            $result = $this->db->table('expedient_document')
                ->where('id', $idFileDocument)
                ->update($updateData);
            
            if ($result) {
                $estadoAnterior = 'Listo para validar (3)';
                $estadoNuevo = $nuevoEstatus == 4 ? 'Aprobado (4)' : 'Rechazado (5)';
                $accion = $nuevoEstatus == 4 ? 'APROBAR_DOCUMENTO' : 'RECHAZAR_DOCUMENTO';
                $mensaje = $nuevoEstatus == 4 ? 'Documento aprobado exitosamente' : 'Documento rechazado exitosamente';
                
                // Registrar actividad en el log (incluir file_id para historial por expediente)
                $idFile = $documento['id_expedient'] ?? null;
                $this->logActivity(
                    $accion,
                    "Documento {$idFileDocument} " . ($nuevoEstatus == 4 ? 'aprobado' : 'rechazado'),
                    [
                        'file_id' => $idFile,
                        'documento_id' => $idFileDocument,
                        'estado_anterior' => $estadoAnterior,
                        'estado_nuevo' => $estadoNuevo,
                        'comentario' => $comentario,
                        'fecha_procesamiento' => $updateData['update_date']
                    ],
                    $idFile
                );

                return $this->response->setJSON([
                    'success' => true,
                    'message' => $mensaje,
                    'data' => [
                        'idFileDocument' => $idFileDocument,
                        'estadoAnterior' => 3,
                        'estadoNuevo' => $nuevoEstatus,
                        'comentario' => $comentario,
                        'fechaExpiracion' => $fechaExpiracion,
                        'fechaProcesamiento' => $updateData['update_date']
                    ]
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'No se pudo procesar el documento',
                    'data' => null
                ])->setStatusCode(500);
            }
            
        } catch (\Exception $e) {
            error_log("Error en Validacion::aprobarDocumento: " . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }

    /**
     * Preparar documento para validación - cambiar estatus de "2" a "3"
     * POST /api/clients-validation/preparar-documento
     */
    public function prepararDocumento()
    {
        try {
            $data = $this->request->getJSON(true);
            
            // Aceptar idFileDocument o idDocumentByFile (frontend usa idDocumentByFile)
            $idFileDocument = $data['idFileDocument'] ?? $data['idDocumentByFile'] ?? null;
            if (empty($idFileDocument)) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El parámetro idFileDocument (o idDocumentByFile) es requerido',
                    'data' => null
                ])->setStatusCode(400);
            }
            
            // Verificar que el documento existe y tiene estatus "2"
            $documento = $this->db->table('expedient_document')
                ->where('id', $idFileDocument)
                ->where('id_current_document_status', 2)
                ->get()
                ->getRowArray();

            if (!$documento) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El documento no existe o no está pendiente de validación',
                    'data' => null
                ])->setStatusCode(400);
            }
            if ($r = $this->requireFileAccess((int) ($documento['id_expedient'] ?? 0))) return $r;
            
            // Actualizar el estatus del documento a "3" (Listo para validar)
            $updateData = [
                'id_current_document_status' => 3,
                'update_date' => date('Y-m-d H:i:s'),
                'id_last_user_update' => 1 // TODO: Obtener el ID del usuario actual
            ];
            
            $result = $this->db->table('expedient_document')
                ->where('id', $idFileDocument)
                ->update($updateData);
            
            if ($result) {
                // Registrar actividad en el log (incluir file_id para historial por expediente)
                $idFile = $documento['id_expedient'] ?? null;
                $this->logActivity(
                    'PREPARAR_DOCUMENTO',
                    "Documento {$idFileDocument} preparado para validación",
                    [
                        'file_id' => $idFile,
                        'documento_id' => $idFileDocument,
                        'estado_anterior' => 'Pendiente de validación (2)',
                        'estado_nuevo' => 'Listo para validar (3)',
                        'fecha_preparacion' => $updateData['update_date']
                    ],
                    $idFile
                );

                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Documento preparado para validación exitosamente',
                    'data' => [
                        'idFileDocument' => $idFileDocument,
                        'estadoAnterior' => 2,
                        'estadoNuevo' => 3,
                        'fechaPreparacion' => $updateData['update_date']
                    ]
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'No se pudo preparar el documento',
                    'data' => null
                ])->setStatusCode(500);
            }
            
        } catch (\Exception $e) {
            error_log("Error en Validacion::prepararDocumento: " . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }

    /**
     * Imprimir identificación de cliente - genera PDF vía PDF Generator API
     * GET /api/clients-validation/imprimir-identificacion?idFile=123
     */
    public function imprimirIdentificacionCliente()
    {
        try {
            $idFile = (int) $this->request->getGet('idFile');
            if (!$idFile) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El parámetro idFile es requerido',
                    'data' => null
                ])->setStatusCode(400);
            }
            if ($r = $this->requireFileAccess($idFile)) return $r;

            // Obtener datos del cliente (incluye campos de Client para template identificación)
            $cliente = $this->db->query("
                SELECT 
                    f.id as idFile,
                    f.id_client as idClient,
                    COALESCE(
                        (SELECT ctr1.id_dms FROM client_dms_relation ctr1 
                         WHERE ctr1.id_client_header = hc.id AND ctr1.id_agency = f.id_agency LIMIT 1),
                        (SELECT ctr2.id_dms FROM client_dms_relation ctr2 
                         WHERE ctr2.id_client_header = hc.id LIMIT 1),
                        ''
                    ) as ndCliente,
                    f.id_order_total as ndPedido,
                    COALESCE(NULLIF(TRIM(c.razon_social), ''), 
                        TRIM(CONCAT(COALESCE(c.name, ''), ' ', COALESCE(c.last_name, ''), ' ', COALESCE(c.mother_last_name, '')))
                    ) as cliente,
                    c.name as nombre,
                    c.last_name as apellidoPaterno,
                    c.mother_last_name as apellidoMaterno,
                    c.RFC as rfc,
                    c.CURP as curp,
                    c.email as email,
                    c.tel_number as telefono,
                    c.tel_number2 as telefono2,
                    c.razon_social as razonSocial,
                    c.tipo_cliente as client_tipo_cliente,
                    cid.nombre as cid_nombre,
                    cid.apellido_paterno as cid_apellido_paterno,
                    cid.apellido_materno as cid_apellido_materno,
                    cid.razon_social as cid_razon_social,
                    cid.rfc as cid_rfc,
                    cid.curp as cid_curp,
                    cid.email as cid_email,
                    cid.telefono as cid_telefono,
                    cid.telefono2 as cid_telefono2,
                    cid.calle as cid_calle,
                    cid.numero_exterior as cid_numero_exterior,
                    cid.numero_interior as cid_numero_interior,
                    cid.colonia as cid_colonia,
                    cid.codigo_postal as cid_codigo_postal,
                    cid.ciudad as cid_ciudad,
                    cid.municipio as cid_municipio,
                    cid.pais as cid_pais,
                    cid.fecha_nacimiento as cid_fecha_nacimiento,
                    cid.pais_nacimiento as cid_pais_nacimiento,
                    cid.pais_nacionalidad as cid_pais_nacionalidad,
                    cid.autoridad_emite as cid_autoridad_emite,
                    cid.fecha_constituccion as cid_fecha_constituccion,
                    cid.actividad_giro as cid_actividad_giro,
                    f.id_customer_type as id_customer_type,
                    ct.name as tipoCliente,
                    p.name as proceso,
                    ot.name as operacion,
                    a.name as agencia,
                    co.name as company_name,
                    fs.name as fase,
                    COALESCE(obc1.vin, obc2.vin) as vin,
                    COALESCE(obc1.model, obc2.model) as modelo,
                    COALESCE(obc1.year, obc2.year) as year,
                    COALESCE(obc1.car_type, obc2.car_type) as version
                FROM expedient f
                INNER JOIN client_header hc ON hc.id_client = f.id_client
                INNER JOIN client c ON hc.id_client = c.id
                INNER JOIN process p ON f.id_sale_type = p.id
                INNER JOIN operation_type ot ON f.id_operation = ot.id
                LEFT JOIN customer_type ct ON f.id_customer_type = ct.id
                INNER JOIN expedient_state fs ON f.id_current_expedient_state = fs.id
                INNER JOIN agency a ON f.id_agency = a.id
                LEFT JOIN company co ON a.id_company = co.id
                LEFT JOIN `order` obc1 ON obc1.id = f.id_order
                LEFT JOIN (
                    SELECT obc2a.id_dms, obc2a.id_agency, obc2a.vin, obc2a.model, obc2a.year, obc2a.car_type
                    FROM `order` obc2a
                    INNER JOIN (
                        SELECT id_dms, id_agency, MAX(COALESCE(registration_date, '1900-01-01')) as MaxDate
                        FROM `order` GROUP BY id_dms, id_agency
                    ) obc2b ON obc2a.id_dms = obc2b.id_dms
                        AND obc2a.id_agency = obc2b.id_agency
                        AND COALESCE(obc2a.registration_date, '1900-01-01') = obc2b.MaxDate
                ) obc2 ON f.id_order IS NULL AND obc2.id_dms = f.id_order_total AND obc2.id_agency = f.id_agency
                LEFT JOIN client_identification_data cid ON cid.id_client = c.id AND cid.enabled = 1
                WHERE f.id = ?
            ", [$idFile])->getRowArray();

            if (!$cliente) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Cliente/pedido no encontrado',
                    'data' => null
                ])->setStatusCode(404);
            }

            // Merge: client_identification_data sobreescribe client cuando tiene valor
            $m = function ($cid, $client) {
                $v = trim($cid ?? '');
                return $v !== '' ? $v : (string) ($client ?? '');
            };
            $mDate = function ($cid) {
                if (empty($cid)) return '';
                return is_string($cid) ? $cid : date('Y-m-d', strtotime($cid));
            };
            $nombre = $m($cliente['cid_nombre'] ?? null, $cliente['nombre'] ?? null);
            $apellidoPaterno = $m($cliente['cid_apellido_paterno'] ?? null, $cliente['apellidoPaterno'] ?? null);
            $apellidoMaterno = $m($cliente['cid_apellido_materno'] ?? null, $cliente['apellidoMaterno'] ?? null);
            $razonSocial = $m($cliente['cid_razon_social'] ?? null, $cliente['razonSocial'] ?? null);
            $rfc = $m($cliente['cid_rfc'] ?? null, $cliente['rfc'] ?? null);

            // Usar solo client.tipo_cliente: 1 = persona física, 2 = persona moral
            $clientTipoClienteId = (int) ($cliente['client_tipo_cliente'] ?? 0);
            if ($clientTipoClienteId !== 1 && $clientTipoClienteId !== 2) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Formato no definido para el tipo de cliente. Configure tipo_cliente en el cliente (1=Persona Física, 2=Persona Moral).',
                    'data' => null
                ])->setStatusCode(400);
            }
            $isClienteMoral = ($clientTipoClienteId === 2);
            $curp = $m($cliente['cid_curp'] ?? null, $cliente['curp'] ?? null);
            $email = $m($cliente['cid_email'] ?? null, $cliente['email'] ?? null);
            $telefono = $m($cliente['cid_telefono'] ?? null, $cliente['telefono'] ?? null);
            $telefono2 = $m($cliente['cid_telefono2'] ?? null, $cliente['telefono2'] ?? null);
            $clienteNombre = $razonSocial ?: trim("{$nombre} {$apellidoPaterno} {$apellidoMaterno}");
            $calle = (string) ($cliente['cid_calle'] ?? '');
            $numeroExt = (string) ($cliente['cid_numero_exterior'] ?? '');
            $numeroInt = (string) ($cliente['cid_numero_interior'] ?? '');
            $colonia = (string) ($cliente['cid_colonia'] ?? '');
            $cp = (string) ($cliente['cid_codigo_postal'] ?? '');
            $ciudad = (string) ($cliente['cid_ciudad'] ?? '');
            $municipio = (string) ($cliente['cid_municipio'] ?? '');
            $pais = (string) ($cliente['cid_pais'] ?? '');
            $fechaNac = $mDate($cliente['cid_fecha_nacimiento'] ?? null);
            $paisNac = (string) ($cliente['cid_pais_nacimiento'] ?? '');
            $paisNacionalidad = (string) ($cliente['cid_pais_nacionalidad'] ?? '');
            $autoridadEmite = (string) ($cliente['cid_autoridad_emite'] ?? '');
            $fechaConst = $mDate($cliente['cid_fecha_constituccion'] ?? null);
            $actividadGiro = (string) ($cliente['cid_actividad_giro'] ?? '');
            $companyName = trim((string) ($cliente['company_name'] ?? ''));

            if ($isClienteMoral) {
                // Cliente moral: nombre del cliente = denominación o razón social
                $nombreClienteMoral = trim($razonSocial) !== '' ? $razonSocial : trim("{$nombre} {$apellidoPaterno} {$apellidoMaterno}");
                $templateName = 'moral';
                $templateData = [
                    'actividad_giro_mercantil_u_objeto_social_row_1' => $actividadGiro,
                    'apellido_materno_row_1' => $apellidoMaterno,
                    'apellido_paterno_row_1' => $apellidoPaterno,
                    'autoridad_que_la_emite_row_1' => $autoridadEmite,
                    'c_digo_postal_row_1' => $cp,
                    'c_u_r_p_row_1' => $curp,
                    'calle_avenida_o_v_a_row_1' => $calle,
                    'ciudad_poblaci_n_o_entidad_federativa_row_1' => $ciudad,
                    'colonia_o_urbanizaci_n_row_1' => $colonia,
                    'correo_el_ctronico_row_1' => $email,
                    'demarcaci_n_pol_tica_o_municipio_row_1' => $municipio,
                    'denominaci_n_o_raz_n_social_de_la_empresa_que_elabora_el_formato_row_1' => $companyName,
                    'denominaci_n_o_raz_n_social_row_1' => $nombreClienteMoral,
                    'en_caso_de_relaci_n_de_negocios_actividad_ocupaci_n_o_giro_al_que_se_dedique_row_1' => $actividadGiro,
                    'extensi_n_en_su_caso_row_1' => $numeroInt,
                    'extranjero' => '',
                    'fecha_de_constituci_n_row_1' => $fechaConst,
                    'fecha_de_elaboraci_n_del_formato_row_1' => date('Y-m-d'),
                    'fecha_de_nacimiento_row_1' => $fechaNac,
                    'n_mero_exterior_row_1' => $numeroExt,
                    'n_mero_interior_en_su_caso_row_1' => $numeroInt,
                    'n_mero_o_folio_row_1' => (string) ($cliente['ndPedido'] ?? ''),
                    'n_mero_telef_nico_con_clave_lada_row_1' => $telefono ?: $telefono2,
                    'nacional' => '',
                    'nombre_completo_y_firma_del_representante_o_apoderado_legal' => '',
                    'nombre_de_la_identificaci_n_row_1' => '',
                    'nombre_s_sin_abreviaturas_row_1' => $nombreClienteMoral,
                    'nombre_y_firma_del_funcionario_o_empleado_que_realiz_el_cotejo' => '',
                    'pa_s_de_nacimiento_row_1' => $paisNac,
                    'pa_s_de_nacionalidad_row_1' => $paisNacionalidad,
                    'pa_s_row_1' => $pais,
                    'r_f_c_row_1' => $rfc,
                ];
            } else {
                // Cliente físico (id_customer_type = 1)
                $templateName = 'fisica';
                $templateData = [
                    'apellido_materno_row_1' => $apellidoMaterno,
                    'apellido_paterno_row_1' => $apellidoPaterno,
                    'autoridad_que_la_emite_row_1' => $autoridadEmite,
                    'c_digo_postal_row_1' => $cp,
                    'c_u_r_p_row_1' => $curp,
                    'calle_avenida_o_v_a_row_1' => $calle,
                    'ciudad_poblaci_n_o_entidad_federativa_row_1' => $ciudad,
                    'colonia_o_urbanizaci_n_row_1' => $colonia,
                    'correo_el_ctronico_row_1' => $email,
                    'demarcaci_n_pol_tica_o_municipio_row_1' => $municipio,
                    'denominaci_n_o_raz_n_social_de_la_empresa_que_elabora_el_formato_row_1' => $companyName,
                    'en_caso_de_relaci_n_de_negocios_actividad_ocupaci_n_o_giro_al_que_se_dedique_row_1' => '',
                    'extensi_n_en_su_caso_row_1' => $numeroInt,
                    'extranjero' => '',
                    'fecha_de_elaboraci_n_del_formato_row_1' => date('Y-m-d'),
                    'fecha_de_nacimiento_row_1' => $fechaNac,
                    'n_mero_exterior_row_1' => $numeroExt,
                    'n_mero_interior_en_su_caso_row_1' => $numeroInt,
                    'n_mero_o_folio_row_1' => (string) ($cliente['ndPedido'] ?? ''),
                    'n_mero_telef_nico_con_clave_lada_row_1' => $telefono ?: $telefono2,
                    'nacional' => '',
                    'no_existe_un_due_o_beneficiario_o_beneficiario_controlador_en_la_presente_operaci_n' => '',
                    'nombre_completo_y_firma_del_cliente' => $clienteNombre,
                    'nombre_de_la_identificaci_n_row_1' => '',
                    'nombre_s_sin_abreviaturas_row_1' => $nombre,
                    'nombre_y_firma_del_funcionario_o_empleado_que_realiz_el_cotejo' => '',
                    'pa_s_de_nacimiento_row_1' => $paisNac,
                    'pa_s_de_nacionalidad_row_1' => $paisNacionalidad,
                    'pa_s_row_1' => $pais,
                    'r_f_c_row_1' => $rfc,
                    's_existe_un_due_o_beneficiario_o_beneficiario_controlador_en_la_presente_operaci_n' => '',
                ];
            }

            // Cache de 1h por (templateName, hash(datos)) — evita re-render al reabrir el PDF.
            $cache = \Config\Services::cache();
            $cacheKey = 'pdfgen_v2_' . $templateName . '_' . md5(json_encode($templateData));
            $body = $cache->get($cacheKey);

            if ($body === null) {
                $renderer = new \App\Libraries\PdfTemplateRenderer();
                $body = $renderer->render($templateName, $templateData);
                $cache->save($cacheKey, $body, 3600);
            }

            $filename = 'identificacion_cliente_' . ($clienteNombre ?: $idFile) . '_' . date('Y-m-d') . '.pdf';
            $filename = preg_replace('/[^a-zA-Z0-9_\-\.]/', '_', $filename);

            return $this->response
                ->setHeader('Content-Type', 'application/pdf')
                ->setHeader('Content-Disposition', 'attachment; filename="' . $filename . '"')
                ->setBody($body);

        } catch (\Exception $e) {
            error_log("Error en Validacion::imprimirIdentificacionCliente: " . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al generar identificación: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }

    /**
     * POST /api/clients-validation/generar-token-miniportal
     * Generar enlace único para Miniportal (requiere auth)
     */
    public function generarTokenMiniportal()
    {
        try {
            $currentUser = $this->getAuthenticatedUser();
            if (!$currentUser) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'token de autorización requerido'
                ])->setStatusCode(401);
            }

            $data = $this->request->getJSON(true) ?? $this->request->getPost();
            $idFile = (int) ($data['idFile'] ?? $data['id_expedient'] ?? 0);
            if ($idFile && ($r = $this->requireFileAccess($idFile))) return $r;
            if (!$idFile) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'idFile es requerido'
                ])->setStatusCode(400);
            }

            $shareTokenModel = new \App\Models\FileShareTokenModel();
            $userId = (int) ($currentUser['user_id'] ?? 0);
            $tokenData = $shareTokenModel->getOrCreateToken($idFile, null, $userId);
            if (!$tokenData) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'No se pudo generar el token'
                ])->setStatusCode(500);
            }

            // URL del frontend donde está desplegada la app Angular (miniportal en /consulta/:token)
            // Configurar miniportal.frontendUrl o app.frontendUrl en .env de producción
            $frontendUrl = env('miniportal.frontendUrl', env('app.frontendUrl', 'http://localhost:4200'));
            $miniportalUrl = rtrim($frontendUrl, '/') . '/consulta/' . $tokenData['token'];

            $this->logActivity('GENERAR_TOKEN_MINIPORTAL', "token Miniportal generado para expediente {$idFile}", [
                'file_id' => $idFile,
                'token' => $tokenData['token']
            ], $idFile);

            return $this->response->setJSON([
                'success' => true,
                'data' => [
                    'token' => $tokenData['token'],
                    'url' => $miniportalUrl,
                    'idFile' => $idFile
                ]
            ]);
        } catch (\Exception $e) {
            error_log("Validacion::generarTokenMiniportal - " . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al generar el token: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Obtener datos de identificación para edición (merge: client_identification_data si existe, si no client)
     * GET /api/clients-validation/datos-identificacion?idFile=123
     */
    public function getDatosIdentificacion()
    {
        try {
            $currentUser = $this->getAuthenticatedUser();
            if (!$currentUser) {
                return $this->response->setJSON(['success' => false, 'message' => 'token de autorización requerido'])->setStatusCode(401);
            }
            $idFile = (int) $this->request->getGet('idFile');
            if (!$idFile) {
                return $this->response->setJSON(['success' => false, 'message' => 'idFile es requerido'])->setStatusCode(400);
            }
            $row = $this->db->query("
                SELECT
                    f.id_client as idClient,
                    f.id_customer_type as idCustomerType,
                    c.name as nombre,
                    c.last_name as apellido_paterno,
                    c.mother_last_name as apellido_materno,
                    c.razon_social,
                    c.RFC as rfc,
                    c.CURP as curp,
                    c.email,
                    c.tel_number as telefono,
                    c.tel_number2 as telefono2,
                    cid.nombre as cid_nombre,
                    cid.apellido_paterno as cid_apellido_paterno,
                    cid.apellido_materno as cid_apellido_materno,
                    cid.razon_social as cid_razon_social,
                    cid.rfc as cid_rfc,
                    cid.curp as cid_curp,
                    cid.email as cid_email,
                    cid.telefono as cid_telefono,
                    cid.telefono2 as cid_telefono2,
                    cid.calle,
                    cid.numero_exterior,
                    cid.numero_interior,
                    cid.colonia,
                    cid.codigo_postal,
                    cid.ciudad,
                    cid.municipio,
                    cid.pais,
                    cid.fecha_nacimiento,
                    cid.pais_nacimiento,
                    cid.pais_nacionalidad,
                    cid.autoridad_emite,
                    cid.fecha_constituccion,
                    cid.actividad_giro
                FROM expedient f
                INNER JOIN client_header hc ON hc.id_client = f.id_client
                INNER JOIN client c ON hc.id_client = c.id
                LEFT JOIN client_identification_data cid ON cid.id_client = c.id AND cid.enabled = 1
                WHERE f.id = ?
            ", [$idFile])->getRowArray();
            if (!$row) {
                return $this->response->setJSON(['success' => false, 'message' => 'Expediente no encontrado'])->setStatusCode(404);
            }
            $merge = function ($cid, $client) {
                $v = trim($cid ?? '');
                return $v !== '' ? $v : trim($client ?? '');
            };
            $mergeDate = function ($cid, $client) {
                if (!empty($cid)) {
                    return is_string($cid) ? $cid : date('Y-m-d', strtotime($cid));
                }
                return !empty($client) ? (is_string($client) ? $client : date('Y-m-d', strtotime($client))) : null;
            };
            $data = [
                'idClient' => (int) $row['idClient'],
                'idCustomerType' => (int) ($row['idCustomerType'] ?? 0),
                'nombre' => $merge($row['cid_nombre'] ?? null, $row['nombre'] ?? null),
                'apellido_paterno' => $merge($row['cid_apellido_paterno'] ?? null, $row['apellido_paterno'] ?? null),
                'apellido_materno' => $merge($row['cid_apellido_materno'] ?? null, $row['apellido_materno'] ?? null),
                'razon_social' => $merge($row['cid_razon_social'] ?? null, $row['razon_social'] ?? null),
                'rfc' => $merge($row['cid_rfc'] ?? null, $row['rfc'] ?? null),
                'curp' => $merge($row['cid_curp'] ?? null, $row['curp'] ?? null),
                'email' => $merge($row['cid_email'] ?? null, $row['email'] ?? null),
                'telefono' => $merge($row['cid_telefono'] ?? null, $row['telefono'] ?? null),
                'telefono2' => $merge($row['cid_telefono2'] ?? null, $row['telefono2'] ?? null),
                'calle' => trim($row['calle'] ?? ''),
                'numero_exterior' => trim($row['numero_exterior'] ?? ''),
                'numero_interior' => trim($row['numero_interior'] ?? ''),
                'colonia' => trim($row['colonia'] ?? ''),
                'codigo_postal' => trim($row['codigo_postal'] ?? ''),
                'ciudad' => trim($row['ciudad'] ?? ''),
                'municipio' => trim($row['municipio'] ?? ''),
                'pais' => trim($row['pais'] ?? ''),
                'fecha_nacimiento' => $mergeDate($row['fecha_nacimiento'] ?? null, null),
                'pais_nacimiento' => trim($row['pais_nacimiento'] ?? ''),
                'pais_nacionalidad' => trim($row['pais_nacionalidad'] ?? ''),
                'autoridad_emite' => trim($row['autoridad_emite'] ?? ''),
                'fecha_constituccion' => $mergeDate($row['fecha_constituccion'] ?? null, null),
                'actividad_giro' => trim($row['actividad_giro'] ?? ''),
            ];
            return $this->response->setJSON(['success' => true, 'data' => $data]);
        } catch (\Exception $e) {
            error_log("Validacion::getDatosIdentificacion - " . $e->getMessage());
            return $this->response->setJSON(['success' => false, 'message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    /**
     * Guardar datos de identificación en client_identification_data
     * PUT /api/clients-validation/datos-identificacion
     * Body: { idClient o idFile, ...campos }
     */
    public function saveDatosIdentificacion()
    {
        try {
            $currentUser = $this->getAuthenticatedUser();
            if (!$currentUser) {
                return $this->response->setJSON(['success' => false, 'message' => 'token de autorización requerido'])->setStatusCode(401);
            }
            $data = $this->request->getJSON(true) ?? $this->request->getPost();
            $idClient = (int) ($data['idClient'] ?? $data['id_client'] ?? 0);
            $idFile = (int) ($data['idFile'] ?? $data['id_expedient'] ?? 0);
            if ($idFile && ($r = $this->requireFileAccess($idFile))) return $r;
            if (!$idClient && $idFile) {
                $row = $this->db->table('expedient')->select('id_client')->where('id', $idFile)->get()->getRowArray();
                $idClient = (int) ($row['id_client'] ?? 0);
            }
            if (!$idClient) {
                return $this->response->setJSON(['success' => false, 'message' => 'idClient o idFile es requerido'])->setStatusCode(400);
            }
            $userId = $currentUser['user_id'] ?? null;
            $fields = [
                'nombre', 'apellido_paterno', 'apellido_materno', 'razon_social', 'rfc', 'curp',
                'email', 'telefono', 'telefono2', 'calle', 'numero_exterior', 'numero_interior',
                'colonia', 'codigo_postal', 'ciudad', 'municipio', 'pais',
                'fecha_nacimiento', 'pais_nacimiento', 'pais_nacionalidad', 'autoridad_emite',
                'fecha_constituccion', 'actividad_giro'
            ];
            $toSave = [];
            foreach ($fields as $f) {
                $v = $data[$f] ?? null;
                if ($v !== null && $v !== '') {
                    if (in_array($f, ['fecha_nacimiento', 'fecha_constituccion'])) {
                        $toSave[$f] = is_string($v) ? $v : date('Y-m-d', strtotime($v));
                    } else {
                        $toSave[$f] = trim((string) $v);
                    }
                } else {
                    $toSave[$f] = null;
                }
            }
            $toSave['id_last_user_update'] = $userId;
            $toSave['update_date'] = date('Y-m-d H:i:s');
            $toSave['enabled'] = 1;
            $existing = $this->db->table('client_identification_data')
                ->where('id_client', $idClient)
                ->get()
                ->getRowArray();
            if ($existing) {
                $this->db->table('client_identification_data')
                    ->where('id_client', $idClient)
                    ->update($toSave);
                $this->logActivity('UPDATE_DATOS_IDENTIFICACION', "Datos de identificación actualizados para cliente {$idClient}", ['idClient' => $idClient], $idClient);
            } else {
                $toSave['id_client'] = $idClient;
                $toSave['registration_date'] = date('Y-m-d H:i:s');
                $this->db->table('client_identification_data')->insert($toSave);
                $this->logActivity('CREATE_DATOS_IDENTIFICACION', "Datos de identificación creados para cliente {$idClient}", ['idClient' => $idClient], $idClient);
            }
            return $this->response->setJSON(['success' => true, 'data' => ['idClient' => $idClient]]);
        } catch (\Exception $e) {
            error_log("Validacion::saveDatosIdentificacion - " . $e->getMessage());
            return $this->response->setJSON(['success' => false, 'message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    /**
     * Obtener datos del cliente del expediente (para copiar como beneficiario)
     */
    public function getClienteDetalle()
    {
        try {
            $currentUser = $this->getAuthenticatedUser();
            if (!$currentUser) {
                return $this->response->setJSON(['success' => false, 'message' => 'token de autorización requerido'])->setStatusCode(401);
            }
            $idFile = (int) $this->request->getGet('idFile');
            if (!$idFile) {
                return $this->response->setJSON(['success' => false, 'message' => 'idFile es requerido'])->setStatusCode(400);
            }
            if ($r = $this->requireFileAccess($idFile)) return $r;
            $row = $this->db->query("
                SELECT
                    COALESCE(NULLIF(TRIM(c.razon_social), ''),
                        TRIM(CONCAT(COALESCE(c.name, ''), ' ', COALESCE(c.last_name, ''), ' ', COALESCE(c.mother_last_name, '')))
                    ) as cliente,
                    c.RFC as rfc,
                    c.CURP as curp
                FROM expedient f
                INNER JOIN client_header hc ON hc.id_client = f.id_client
                INNER JOIN client c ON hc.id_client = c.id
                WHERE f.id = ?
            ", [$idFile])->getRowArray();
            if (!$row) {
                return $this->response->setJSON(['success' => false, 'message' => 'Expediente no encontrado'])->setStatusCode(404);
            }
            return $this->response->setJSON([
                'success' => true,
                'data' => [
                    'cliente' => trim($row['cliente'] ?? ''),
                    'rfc' => trim($row['rfc'] ?? '') ?: null,
                    'curp' => trim($row['curp'] ?? '') ?: null
                ]
            ]);
        } catch (\Exception $e) {
            error_log("Validacion::getClienteDetalle - " . $e->getMessage());
            return $this->response->setJSON(['success' => false, 'message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    /**
     * Obtener beneficiarios finales de un expediente
     */
    public function getBeneficiarios()
    {
        try {
            $currentUser = $this->getAuthenticatedUser();
            if (!$currentUser) {
                return $this->response->setJSON(['success' => false, 'message' => 'token de autorización requerido'])->setStatusCode(401);
            }
            $idFile = (int) $this->request->getGet('idFile');
            if (!$idFile) {
                return $this->response->setJSON(['success' => false, 'message' => 'idFile es requerido'])->setStatusCode(400);
            }
            if ($r = $this->requireFileAccess($idFile)) return $r;
            $model = new \App\Models\FilePldBeneficiarioFinalModel();
            $beneficiarios = $model->getByFile($idFile);
            return $this->response->setJSON(['success' => true, 'data' => $beneficiarios]);
        } catch (\Exception $e) {
            error_log("Validacion::getBeneficiarios - " . $e->getMessage());
            return $this->response->setJSON(['success' => false, 'message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    /**
     * Agregar beneficiario final a un expediente
     */
    public function addBeneficiario()
    {
        try {
            $currentUser = $this->getAuthenticatedUser();
            if (!$currentUser) {
                return $this->response->setJSON(['success' => false, 'message' => 'token de autorización requerido'])->setStatusCode(401);
            }
            $data = $this->request->getJSON(true) ?? $this->request->getPost();
            $idFile = (int) ($data['idFile'] ?? $data['id_expedient'] ?? 0);
            $nombre = trim($data['nombre'] ?? $data['nombre'] ?? '');
            if (!$idFile || !$nombre) {
                return $this->response->setJSON(['success' => false, 'message' => 'idFile y nombre son requeridos'])->setStatusCode(400);
            }
            if ($r = $this->requireFileAccess($idFile)) return $r;
            $rfc = trim($data['rfc'] ?? $data['RFC'] ?? '') ?: null;
            $curp = trim($data['curp'] ?? $data['CURP'] ?? '') ?: null;
            $porcentaje = isset($data['porcentajeParticipacion']) ? (float) $data['porcentajeParticipacion'] : null;
            if ($porcentaje !== null && ($porcentaje < 0 || $porcentaje > 100)) {
                return $this->response->setJSON(['success' => false, 'message' => 'El porcentaje debe estar entre 0 y 100'])->setStatusCode(400);
            }
            $model = new \App\Models\FilePldBeneficiarioFinalModel();
            if ($porcentaje !== null) {
                $existentes = $model->getByFile($idFile);
                $sumaActual = array_sum(array_map(fn($b) => (float) ($b['porcentaje_participacion'] ?? 0), $existentes));
                if ($sumaActual + $porcentaje > 100) {
                    return $this->response->setJSON([
                        'success' => false,
                        'message' => 'La suma de porcentajes no puede superar 100%. Actual: ' . round($sumaActual, 1) . '%'
                    ])->setStatusCode(400);
                }
            }
            $userId = (int) ($currentUser['user_id'] ?? $currentUser['id'] ?? 0);
            $id = $model->add($idFile, $nombre, $rfc, $curp, $porcentaje, $userId > 0 ? $userId : null);
            if (!$id) {
                return $this->response->setJSON(['success' => false, 'message' => 'No se pudo agregar el beneficiario'])->setStatusCode(500);
            }
            $this->logActivity('AGREGAR_BENEFICIARIO', "Beneficiario agregado al expediente {$idFile}", ['idFile' => $idFile, 'nombre' => $nombre], $idFile);
            return $this->response->setJSON(['success' => true, 'data' => ['id' => $id]]);
        } catch (\Exception $e) {
            error_log("Validacion::addBeneficiario - " . $e->getMessage());
            return $this->response->setJSON(['success' => false, 'message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    /**
     * Eliminar beneficiario final
     */
    public function deleteBeneficiario($id)
    {
        try {
            $currentUser = $this->getAuthenticatedUser();
            if (!$currentUser) {
                return $this->response->setJSON(['success' => false, 'message' => 'token de autorización requerido'])->setStatusCode(401);
            }
            $id = (int) $id;
            if (!$id) {
                return $this->response->setJSON(['success' => false, 'message' => 'ID de beneficiario inválido'])->setStatusCode(400);
            }
            $model = new \App\Models\FilePldBeneficiarioFinalModel();
            if (!$model->remove($id)) {
                return $this->response->setJSON(['success' => false, 'message' => 'No se encontró el beneficiario'])->setStatusCode(404);
            }
            return $this->response->setJSON(['success' => true]);
        } catch (\Exception $e) {
            error_log("Validacion::deleteBeneficiario - " . $e->getMessage());
            return $this->response->setJSON(['success' => false, 'message' => $e->getMessage()])->setStatusCode(500);
        }
    }

    /**
     * Descargar todos los archivos del expediente en un ZIP
     * GET /api/clients-validation/descargar-expediente-zip/(:num)
     */
    public function descargarExpedienteZip($idFile)
    {
        try {
            $currentUser = $this->getAuthenticatedUser();
            if (!$currentUser) {
                return $this->response->setJSON(['success' => false, 'message' => 'token de autorización requerido'])->setStatusCode(401);
            }
            $idFile = (int) $idFile;
            if (!$idFile) {
                return $this->response->setJSON(['success' => false, 'message' => 'ID de expediente inválido'])->setStatusCode(400);
            }
            if ($r = $this->requireFileAccess($idFile)) return $r;

            $docs = $this->db->table('expedient_document dbf')
                ->select('dbf.id_document_container as documentContainer, p.name as proceso, fs.name as fase, dt.name as tipoDocumento, dbf.name as documento')
                ->join('expedient f', 'dbf.id_expedient = f.id', 'inner')
                ->join('process p', 'f.id_sale_type = p.id', 'inner')
                ->join('document_type dt', 'dbf.id_document_type = dt.id', 'inner')
                ->join('expedient_state fs', 'dt.id_sale_type = fs.id', 'inner')
                ->where('dbf.id_expedient', $idFile)
                ->where('dbf.enabled', 1)
                ->where('dbf.id_document_container IS NOT NULL')
                ->where('dbf.id_document_container !=', '')
                ->orderBy('p.name', 'ASC')
                ->orderBy('fs.name', 'ASC')
                ->orderBy('dt.name', 'ASC')
                ->get()
                ->getResultArray();

            if (empty($docs)) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'No hay documentos con archivos para descargar en este expediente'
                ])->setStatusCode(404);
            }

            $b2 = new \App\Controllers\Api\BackblazeDirectUpload();
            $zip = new \ZipArchive();
            $tmpPath = sys_get_temp_dir() . '/expediente_' . $idFile . '_' . uniqid() . '.zip';
            if ($zip->open($tmpPath, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) !== true) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'No se pudo crear el archivo ZIP'
                ])->setStatusCode(500);
            }

            $usedNames = [];
            foreach ($docs as $idx => $doc) {
                $container = $doc['documentContainer'] ?? $doc['documentcontainer'] ?? ($doc['id_document_container'] ?? null);
                if (empty($container)) {
                    continue;
                }
                $fetched = $b2->fetchFileContent($container);
                if (!$fetched || empty($fetched['content'])) {
                    continue;
                }
                $base = preg_replace('/[^a-zA-Z0-9_-]/', '_', $doc['proceso'] ?? '') . '_' .
                    preg_replace('/[^a-zA-Z0-9_-]/', '_', $doc['fase'] ?? '') . '_' .
                    preg_replace('/[^a-zA-Z0-9_-]/', '_', $doc['tipoDocumento'] ?? $doc['documento'] ?? 'doc');
                $ext = pathinfo($fetched['fileName'], PATHINFO_EXTENSION);
                if ($ext) {
                    $base .= '.' . $ext;
                } else {
                    $base .= '.' . (pathinfo($doc['documento'] ?? 'doc', PATHINFO_EXTENSION) ?: 'pdf');
                }
                $zipName = $base;
                $count = 0;
                while (isset($usedNames[$zipName])) {
                    $count++;
                    $zipName = pathinfo($base, PATHINFO_FILENAME) . '_' . $count . (pathinfo($base, PATHINFO_EXTENSION) ? '.' . pathinfo($base, PATHINFO_EXTENSION) : '');
                }
                $usedNames[$zipName] = true;
                $zip->addFromString($zipName, $fetched['content']);
            }
            $numFiles = $zip->numFiles;
            $zip->close();

            if ($numFiles === 0) {
                @unlink($tmpPath);
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'No se pudieron cargar los archivos desde el almacenamiento'
                ])->setStatusCode(500);
            }

            $zipContent = file_get_contents($tmpPath);
            @unlink($tmpPath);
            $fileName = 'expediente_' . $idFile . '_' . date('Y-m-d') . '.zip';
            return $this->response
                ->setHeader('Content-Type', 'application/zip')
                ->setHeader('Content-Disposition', 'attachment; filename="' . $fileName . '"')
                ->setBody($zipContent);
        } catch (\Exception $e) {
            error_log("Validacion::descargarExpedienteZip - " . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al generar el ZIP: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }
}
