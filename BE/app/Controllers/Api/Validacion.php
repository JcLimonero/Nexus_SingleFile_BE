<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;
use App\Models\UserActivityLogModel;
use App\Models\DocumentModel;

class Validacion extends BaseController
{
    protected $db;
    protected $userActivityLogModel;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
        $this->userActivityLogModel = new UserActivityLogModel();
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
     * GET /api/validacion/diagnostico?idFile=15460&idAgency=5&idProcess=?
     */
    public function diagnosticoPedido()
    {
        try {
            $idFile = $this->request->getGet('idFile');
            $idAgency = $this->request->getGet('idAgency');
            $idProcess = $this->request->getGet('idProcess');
            $idDMS = $this->request->getGet('IdDMS'); // Parámetro opcional para verificar relación específica

            if (!$idFile) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El parámetro idFile es requerido',
                    'data' => null
                ])->setStatusCode(400);
            }

            // Obtener información básica del pedido
            $fileInfo = $this->db->query("
                SELECT 
                    f.Id as idFile,
                    f.IdAgency,
                    f.IdProcess,
                    f.IdClient,
                    f.IdCurrentState,
                    f.IdOrderTotal as ndPedido,
                    a.Name as agencia,
                    p.Name as proceso,
                    p.Enabled as proceso_habilitado,
                    fs.Name as estado_actual
                FROM expedient f
                INNER JOIN agency a ON f.IdAgency = a.Id
                INNER JOIN process p ON f.IdProcess = p.Id
                INNER JOIN file_status fs ON f.IdCurrentState = fs.Id
                WHERE f.Id = ?
            ", [$idFile])->getRowArray();

            if (!$fileInfo) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El pedido no existe',
                    'data' => null
                ])->setStatusCode(404);
            }

            // Verificar relación ClientTotalRelation
            // File.IdClient apunta a Client.Id, NO a ClientHeader.Id
            $idClient = (int) $fileInfo['IdClient'];
            $idAgencyFile = (int) $fileInfo['IdAgency'];
            
            // Obtener el ClientHeader.Id desde Client.Id
            $headerClientInfo = $this->db->query("
                SELECT Id FROM client_header WHERE IdClient = ?
                LIMIT 1
            ", [$idClient])->getRowArray();
            
            $idClientHeader = $headerClientInfo ? (int) $headerClientInfo['Id'] : null;
            
            error_log("=== DIAGNÓSTICO FILE {$idFile} ===");
            error_log("File.IdClient (Client.Id): {$idClient}");
            error_log("ClientHeader.Id encontrado: " . ($idClientHeader ?? 'NULL'));
            error_log("File.IdAgency: {$idAgencyFile}");
            error_log("IdDMS recibido como parámetro: " . ($idDMS ?? 'NULL'));
            
            // Si se pasa IdDMS como parámetro, buscar directamente por ese valor
            if ($idDMS) {
                $idDMSTrimmed = trim((string) $idDMS);
                error_log("🔍 Buscando relación por IdDMS={$idDMSTrimmed} e IdAgency={$idAgencyFile}");
                
                $relacion = $this->db->query("
                    SELECT 
                        ctr.Id,
                        ctr.IdAgency,
                        ctr.IdDMS,
                        ctr.idClientHeader,
                        a.Name as nombre_agencia
                    FROM client_dms_relation ctr
                    INNER JOIN agency a ON ctr.IdAgency = a.Id
                    WHERE TRIM(ctr.IdDMS) = ?
                    AND ctr.IdAgency = ?
                ", [$idDMSTrimmed, $idAgencyFile])->getRowArray();
                
                if ($relacion) {
                    error_log("✅ Relación encontrada por IdDMS={$idDMSTrimmed} e IdAgency={$idAgencyFile}");
                    error_log("   idClientHeader de la relación: {$relacion['idClientHeader']}");
                    error_log("   idClientHeader del file: {$idClientHeader}");
                    
                    if ($relacion['idClientHeader'] == $idClientHeader) {
                        error_log("✅ La relación pertenece al mismo ClientHeader del file");
                    } else {
                        error_log("⚠️ La relación pertenece a un ClientHeader diferente (Id={$relacion['idClientHeader']})");
                    }
                } else {
                    error_log("❌ No se encontró relación con IdDMS={$idDMSTrimmed} e IdAgency={$idAgencyFile}");
                }
            } else {
                // Si no se pasa IdDMS, buscar por ClientHeader.Id e IdAgency
                if ($idClientHeader) {
                    error_log("🔍 Buscando relación por ClientHeader.Id={$idClientHeader} e IdAgency={$idAgencyFile}");
                    
                    $relacion = $this->db->query("
                        SELECT 
                            ctr.Id,
                            ctr.IdAgency,
                            ctr.IdDMS,
                            ctr.idClientHeader,
                            a.Name as nombre_agencia
                        FROM client_header hc
                        INNER JOIN client_dms_relation ctr ON ctr.idClientHeader = hc.Id
                        INNER JOIN agency a ON ctr.IdAgency = a.Id
                        WHERE hc.Id = ?
                        AND ctr.IdAgency = ?
                    ", [$idClientHeader, $idAgencyFile])->getRowArray();
                    
                    if ($relacion) {
                        error_log("✅ Relación encontrada por ClientHeader.Id: " . json_encode($relacion));
                    }
                } else {
                    error_log("⚠️ No se encontró ClientHeader para Client.Id={$idClient}");
                }
            }
            
            // Si no se encuentra, buscar por IdDMS
            if (!$relacion) {
                error_log("⚠️ Relación NO encontrada por ClientHeader.Id={$idClientHeader} y IdAgency={$idAgencyFile}");
                
                // Prioridad 1: Si se pasa IdDMS como parámetro, usarlo
                $ndCliente = null;
                if ($idDMS) {
                    $ndCliente = trim((string) $idDMS);
                    error_log("✅ Usando IdDMS del parámetro: {$ndCliente}");
                } else {
                    // Prioridad 2: Obtener el IdDMS de cualquier relación de este ClientHeader
                    $ndClienteDelFile = $this->db->query("
                        SELECT ctr.IdDMS 
                        FROM client_dms_relation ctr 
                        WHERE ctr.idClientHeader = ? 
                        LIMIT 1
                    ", [$idClientHeader])->getRowArray();
                    
                    if ($ndClienteDelFile && !empty($ndClienteDelFile['IdDMS'])) {
                        $ndCliente = trim($ndClienteDelFile['IdDMS']);
                        error_log("⚠️ Usando IdDMS de relación existente del ClientHeader: {$ndCliente}");
                    }
                }
                
                if ($ndCliente) {
                    error_log("Buscando relación alternativa por IdDMS={$ndCliente} e IdAgency={$idAgencyFile}");
                    
                    // Buscar por IdDMS e IdAgency
                    $relacion = $this->db->query("
                        SELECT 
                            ctr.Id,
                            ctr.IdAgency,
                            ctr.IdDMS,
                            ctr.idClientHeader,
                            a.Name as nombre_agencia
                        FROM client_dms_relation ctr
                        INNER JOIN agency a ON ctr.IdAgency = a.Id
                        WHERE TRIM(ctr.IdDMS) = ?
                        AND ctr.IdAgency = ?
                    ", [$ndCliente, $idAgencyFile])->getRowArray();
                    
                    if ($relacion) {
                        error_log("✅ Relación encontrada por IdDMS: " . json_encode($relacion));
                        // Verificar si el idClientHeader de la relación coincide con el del file
                        if ($relacion['idClientHeader'] != $idClientHeader) {
                            error_log("⚠️ ADVERTENCIA: El idClientHeader de la relación ({$relacion['idClientHeader']}) NO coincide con el del file ({$idClientHeader})");
                            // Aún así, consideramos que existe la relación si el IdDMS y IdAgency coinciden
                        }
                    } else {
                        error_log("❌ No se encontró relación con IdDMS={$ndCliente} e IdAgency={$idAgencyFile}");
                    }
                }
            } else {
                error_log("✅ Relación encontrada por ClientHeader.Id: " . json_encode($relacion));
            }
            
            // Si aún no se encuentra, mostrar información de diagnóstico
            if (!$relacion) {
                error_log("❌ Relación NO encontrada después de todos los intentos");
                
                // Verificar si existe ClientHeader con ese ID
                $headerClientExists = $this->db->query("
                    SELECT Id, IdClient FROM client_header WHERE Id = ?
                ", [$idClientHeader])->getRowArray();
                error_log("ClientHeader existe: " . ($headerClientExists ? json_encode($headerClientExists) : 'NO'));
                
                // Verificar todas las relaciones de ese ClientHeader
                $todasRelacionesClientHeader = $this->db->query("
                    SELECT ctr.Id, ctr.IdAgency, ctr.IdDMS, ctr.idClientHeader, a.Name as nombre_agencia
                    FROM client_dms_relation ctr
                    INNER JOIN agency a ON ctr.IdAgency = a.Id
                    WHERE ctr.idClientHeader = ?
                ", [$idClientHeader])->getResultArray();
                error_log("Todas las relaciones de ClientHeader {$idClientHeader}: " . json_encode($todasRelacionesClientHeader));
                
                // Buscar todas las relaciones con IdAgency = 3 para ver si hay alguna con el mismo cliente
                $relacionesAgencia3 = $this->db->query("
                    SELECT ctr.Id, ctr.IdAgency, ctr.IdDMS, ctr.idClientHeader, a.Name as nombre_agencia
                    FROM client_dms_relation ctr
                    INNER JOIN agency a ON ctr.IdAgency = a.Id
                    WHERE ctr.IdAgency = ?
                ", [$idAgencyFile])->getResultArray();
                error_log("Total de relaciones con IdAgency={$idAgencyFile}: " . count($relacionesAgencia3));
            }

            // Verificar todas las relaciones del cliente (usando ClientHeader.Id del file)
            $todasRelaciones = [];
            if ($idClientHeader) {
                $todasRelaciones = $this->db->query("
                    SELECT 
                        ctr.Id,
                        ctr.IdAgency,
                        ctr.IdDMS,
                        ctr.idClientHeader,
                        a.Name as nombre_agencia
                    FROM client_header hc
                    INNER JOIN client_dms_relation ctr ON ctr.idClientHeader = hc.Id
                    INNER JOIN agency a ON ctr.IdAgency = a.Id
                    WHERE hc.Id = ?
                ", [$idClientHeader])->getResultArray();
            } else {
                error_log("⚠️ No se puede buscar relaciones porque no se encontró ClientHeader para Client.Id={$idClient}");
            }
            
            // También buscar directamente por IdDMS si se proporciona como parámetro
            $relacionPorNdCliente = null;
            if ($idDMS) {
                $idDMSTrimmed = trim((string) $idDMS);
                $relacionPorNdCliente = $this->db->query("
                    SELECT 
                        ctr.Id,
                        ctr.IdAgency,
                        ctr.IdDMS,
                        ctr.idClientHeader,
                        a.Name as nombre_agencia
                    FROM client_dms_relation ctr
                    INNER JOIN agency a ON ctr.IdAgency = a.Id
                    WHERE TRIM(ctr.IdDMS) = ?
                    AND ctr.IdAgency = ?
                ", [$idDMSTrimmed, $idAgencyFile])->getResultArray();
                
                error_log("Relaciones encontradas por IdDMS='{$idDMSTrimmed}' e IdAgency={$idAgencyFile}: " . json_encode($relacionPorNdCliente));
            }
            
            // Verificar si alguna de estas relaciones tiene el mismo idClientHeader que el file
            if ($relacionPorNdCliente && count($relacionPorNdCliente) > 0) {
                $relacionEncontrada = $relacionPorNdCliente[0];
                if ($relacionEncontrada['idClientHeader'] == $idClientHeader) {
                    error_log("✅ La relación con IdDMS='99282' e IdAgency=3 SÍ pertenece al ClientHeader.Id={$idClientHeader} del file");
                    // Si no se encontró antes, usar esta relación
                    if (!$relacion) {
                        $relacion = $relacionEncontrada;
                        error_log("✅ Usando relación encontrada por IdDMS: " . json_encode($relacion));
                    }
                } else {
                    error_log("⚠️ La relación con IdDMS='99282' e IdAgency=3 pertenece a ClientHeader.Id={$relacionEncontrada['idClientHeader']}, pero el file tiene ClientHeader.Id={$idClientHeader}");
                    error_log("⚠️ Esto significa que el file está asociado a un ClientHeader diferente al que tiene la relación con la agencia 3");
                }
            }

            // Verificar condiciones del query de validación
            // Para tener_relacion_cliente_agencia, verificar si:
            // 1. Se encontró relación directa por ClientHeader.Id e IdAgency, O
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
                        WHERE ctr.idClientHeader = ? 
                        AND ctr.IdAgency = ?
                    ", [$idClientHeader, $idAgencyFile])->getRowArray();
                    $tieneRelacion = $relacionDelFile !== null;
                }
            }
            
            // Convertir parámetros a enteros para comparación correcta
            $idAgencyInt = $idAgency ? (int) $idAgency : null;
            $idProcessInt = $idProcess ? (int) $idProcess : null;
            $fileIdAgency = (int) $fileInfo['IdAgency'];
            $fileIdProcess = (int) $fileInfo['IdProcess'];
            
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
                'no_cancelado' => $fileInfo['IdCurrentState'] != 5,
                'tiene_relacion_cliente_agencia' => $tieneRelacion
            ];
            
            // Agregar información adicional para debugging
            error_log("=== EVALUACIÓN DE CONDICIONES ===");
            error_log("idAgency recibido: " . ($idAgency ?? 'NULL') . " (tipo: " . gettype($idAgency) . ")");
            error_log("idAgency convertido: " . ($idAgencyInt ?? 'NULL'));
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
                        (!$idAgency || $cumpleCondiciones['agencia']) &&
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
     * Listar expedientes que requieren corrección desde la tabla files_to_correct.
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
                SELECT ec.id, ec.idExpediente, ec.idAgency, ec.ndDMS, ec.api_result, ec.created_at,
                       a.Name as nombreAgencia
                FROM files_to_correct ec
                INNER JOIN agency a ON a.Id = ec.idAgency
                    WHERE  (ec.api_result IS NULL OR NOT JSON_CONTAINS(ec.api_result, 'true', '$.success')) 
                ORDER BY ec.idAgency ASC, ec.id ASC
            ")->getResultArray();

            $porAgencia = [];
            $totalGeneral = 0;

            foreach ($rows as $row) {
                $idAgency = (int) $row['idAgency'];
                if (!isset($porAgencia[$idAgency])) {
                    $porAgencia[$idAgency] = [
                        'idAgency' => $idAgency,
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

                $porAgencia[$idAgency]['expedientes'][] = [
                    'id' => (int) $row['id'],
                    'idFile' => (int) $row['idExpediente'],
                    'idAgency' => $idAgency,
                    'ndCliente' => $row['ndDMS'] ?? '',
                    'api_result' => $apiResult,
                    'created_at' => $row['created_at'] ?? null,
                    'tipoReparacion' => 'repairClientRelation'
                ];
                $porAgencia[$idAgency]['total']++;
                $totalGeneral++;
            }

            ksort($porAgencia);

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Expedientes a corregir desde tabla files_to_correct',
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
                    SELECT ec.id, ec.idExpediente, ec.idAgency, ec.ndDMS
                    FROM files_to_correct ec
                    WHERE ec.api_result IS NULL and ec.idAgency = 9
                    ORDER BY (ec.idAgency IN (20, 21, 22)) DESC, ec.idAgency ASC, ec.id ASC
                    LIMIT ?
                ", [$limit])->getResultArray();

                foreach ($rows as $row) {
                    $result = $this->ejecutarReparacionClientRelation(
                        trim((string) ($row['ndDMS'] ?? '')),
                        (int) $row['idAgency'],
                        (int) $row['idExpediente']
                    );
                    if ($result['success']) {
                        $reparadosTotal++;
                    } else {
                        $erroresTotal[] = [
                            'idExpediente' => (int) $row['idExpediente'],
                            'ndDMS' => $row['ndDMS'],
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
    private function ejecutarReparacionClientRelation(string $ndDMS, int $idAgency, int $idExpediente): array
    {
        try {
            if ($ndDMS === '') {
                $this->guardarErrorExpediente($idExpediente, $idAgency, $ndDMS, 'ndDMS vacío');
                return ['success' => false, 'idClient' => null, 'message' => 'ndDMS vacío'];
            }

            $row = $this->db->query("
                SELECT idCliente FROM view_client_relations
                WHERE TRIM(ndCliente) = ? AND idAgency = ?
                LIMIT 1
            ", [$ndDMS, $idAgency])->getRowArray();

            $idClientVal = $row['idCliente'] ?? null;
            if (!$row || empty($idClientVal)) {
                $msg = 'No se encontró relación en view_client_relations';
                $this->guardarErrorExpediente($idExpediente, $idAgency, $ndDMS, $msg);
                return ['success' => false, 'idClient' => null, 'message' => $msg];
            }

            $idClient = (int) $idClientVal;
            $this->db->table('expedient')->where('Id', $idExpediente)->update(['IdClient' => $idClient]);
            if ($this->db->affectedRows() === 0) {
                $msg = 'No se actualizó ningún expediente';
                $this->guardarErrorExpediente($idExpediente, $idAgency, $ndDMS, $msg);
                return ['success' => false, 'idClient' => null, 'message' => $msg];
            }

            log_message('info', "autoRepararExpedientes: File.Id={$idExpediente} actualizado con IdClient={$idClient}");

            $this->db->query("
                UPDATE files_to_correct SET api_result = ?
                WHERE idExpediente = ? AND idAgency = ? AND ndDMS = ?
            ", [json_encode(['success' => true, 'idClient' => $idClient]), $idExpediente, $idAgency, $ndDMS]);

            return ['success' => true, 'idClient' => $idClient, 'message' => 'OK'];
        } catch (\Throwable $e) {
            $msg = $e->getMessage();
            log_message('error', "ejecutarReparacionClientRelation: expediente {$idExpediente} - {$msg}");
            $this->guardarErrorExpediente($idExpediente, $idAgency, $ndDMS, $msg, $e);
            return ['success' => false, 'idClient' => null, 'message' => $msg];
        }
    }

    /**
     * Guardar error en files_to_correct.api_result con request y detalle del error.
     */
    private function guardarErrorExpediente(int $idExpediente, int $idAgency, string $ndDMS, string $message, ?\Throwable $e = null): void
    {
        $payload = [
            'success' => false,
            'message' => $message,
            'request' => [
                'ndDMS' => $ndDMS,
                'idAgency' => $idAgency,
                'idExpediente' => $idExpediente
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
                UPDATE files_to_correct SET api_result = ?
                WHERE idExpediente = ? AND idAgency = ? AND ndDMS = ?
            ", [json_encode($payload), $idExpediente, $idAgency, $ndDMS]);
        } catch (\Throwable $e2) {
            log_message('error', 'No se pudo registrar error en files_to_correct: ' . $e2->getMessage());
        }
    }

    /**
     * Llamar API singlefileorderslastest y devolver array de pedidos.
     */
    private function callSinglefileorderslastest(string $agencyConnection, string $ndCliente): array
    {
        $vanguardiaBaseUrl = 'https://apisvanguardia.com:400';
        $vanguardiaToken = 'b26e88c4-ddbe-4adb-a214-4667f454824a';

        $url = $vanguardiaBaseUrl . '/vgd/singlefileorderslastest?'
            . 'customerDMS=' . urlencode($ndCliente)
            . '&connectionstring=' . urlencode($agencyConnection)
            . '&perpage=1000';

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'X-Provider-Token: ' . $vanguardiaToken,
                'Content-Type: application/json'
            ],
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

            $file = $this->db->query("
                SELECT f.Id, f.IdClient, f.IdAgency
                FROM expedient f
                WHERE f.Id = ?
            ", [$idFile])->getRowArray();
            if (!$file) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El pedido no existe',
                    'data' => null
                ])->setStatusCode(404);
            }

            // File.IdClient apunta a Client.Id, NO a ClientHeader.Id
            $idClient = (int) $file['IdClient'];
            $idAgency = (int) $file['IdAgency'];
            
            // Obtener el ClientHeader.Id desde Client.Id
            $headerClientInfo = $this->db->query("
                SELECT Id FROM client_header WHERE IdClient = ?
                LIMIT 1
            ", [$idClient])->getRowArray();
            
            if (!$headerClientInfo) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'No se encontró ClientHeader para el cliente del pedido',
                    'data' => null
                ])->setStatusCode(404);
            }
            
            $idClientHeader = (int) $headerClientInfo['Id'];

            $existe = $this->db->query("
                SELECT 1 FROM client_dms_relation ctr
                WHERE ctr.idClientHeader = ? AND ctr.IdAgency = ?
            ", [$idClientHeader, $idAgency])->getRowArray();
            if ($existe) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'La relación ya existe; no se requiere reparación',
                    'data' => ['idFile' => $idFile, 'idClientHeader' => $idClientHeader, 'IdAgency' => $idAgency]
                ]);
            }

            // Buscar IdDMS de cualquier relación de este ClientHeader
            $otro = $this->db->query("
                SELECT ctr.IdDMS FROM client_dms_relation ctr
                WHERE ctr.idClientHeader = ?
                LIMIT 1
            ", [$idClientHeader])->getRowArray();
            $idDMS = $otro ? trim((string) ($otro['IdDMS'] ?? '')) : '';
            
            // Si no se encontró IdDMS, buscar si existe una relación con la agencia del file
            // Esto es útil cuando el cliente tiene relación con otra agencia pero necesita relación con esta
            if (empty($idDMS)) {
                // Primero intentar buscar por el mismo cliente (mismo ClientHeader.IdClient) pero con otra relación
                $headerClientInfo = $this->db->query("
                    SELECT IdClient FROM client_header WHERE Id = ?
                ", [$idClientHeader])->getRowArray();
                
                if ($headerClientInfo) {
                    // Buscar si hay otro ClientHeader del mismo cliente que tenga relación con esta agencia
                    $otroClientHeader = $this->db->query("
                        SELECT hc2.Id, ctr.IdDMS
                        FROM client_header hc2
                        INNER JOIN client_dms_relation ctr ON ctr.idClientHeader = hc2.Id
                        WHERE hc2.IdClient = ?
                        AND ctr.IdAgency = ?
                        LIMIT 1
                    ", [$headerClientInfo['IdClient'], $idAgency])->getRowArray();
                    
                    if ($otroClientHeader && !empty($otroClientHeader['IdDMS'])) {
                        $idDMS = trim((string) $otroClientHeader['IdDMS']);
                        error_log("✅ Encontrado IdDMS '{$idDMS}' de otro ClientHeader del mismo cliente con relación a agencia {$idAgency}");
                    } else {
                        // Si no hay otro ClientHeader, buscar cualquier relación con esta agencia para usar su IdDMS
                        $relacionAgencia = $this->db->query("
                            SELECT ctr.IdDMS 
                            FROM client_dms_relation ctr
                            WHERE ctr.IdAgency = ?
                            LIMIT 1
                        ", [$idAgency])->getRowArray();
                        
                        if ($relacionAgencia && !empty($relacionAgencia['IdDMS'])) {
                            $idDMS = trim((string) $relacionAgencia['IdDMS']);
                            error_log("⚠️ Usando IdDMS '{$idDMS}' de otra relación con la misma agencia {$idAgency}");
                        }
                    }
                }
            }

            $nextIdRow = $this->db->query("SELECT COALESCE(MAX(Id), 0) + 1 AS nextId FROM client_dms_relation")->getRowArray();
            $nextId = (int) ($nextIdRow['nextId'] ?? 1);

            $this->db->table('client_dms_relation')->insert([
                'Id' => $nextId,
                'idClientHeader' => $idClientHeader,
                'IdAgency' => $idAgency,
                'IdDMS' => $idDMS
            ]);

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Relación cliente-agencia creada correctamente',
                'data' => [
                    'idFile' => $idFile,
                    'idRelation' => $nextId,
                    'idClientHeader' => $idClientHeader,
                    'IdAgency' => $idAgency,
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
            $idAgency = $this->request->getGet('id');
            $idProcess = $this->request->getGet('idProcess');
            $showCancelledParam = $this->request->getGet('showCancelled');
            $showCancelled = ($showCancelledParam === 'true');
            
            
            $page = (int) $this->request->getGet('page') ?: 1;
            $limit = (int) $this->request->getGet('limit') ?: 10;
            $offset = ($page - 1) * $limit;

            // Validar parámetros requeridos (idProcess opcional: si no viene, "Todos los procesos")
            if (!$idAgency) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El parámetro id (agencia) es requerido',
                    'data' => null
                ])->setStatusCode(400);
            }

            $filtrarPorProceso = $idProcess !== null && $idProcess !== '';

            // Query principal usando SQL directo para evitar problemas con Query Builder
            // PRIORIDAD: El pedido (File) debe pertenecer a la agencia seleccionada
            // El cliente debe estar relacionado con la agencia del pedido a través de ClientTotalRelation
            $sql = "
                SELECT 
                    f.Id as idFile,
                    COALESCE(
                        (SELECT ctr1.IdDMS 
                         FROM client_dms_relation ctr1 
                         WHERE ctr1.idClientHeader = hc.Id 
                         AND ctr1.IdAgency = f.IdAgency 
                         LIMIT 1),
                        (SELECT ctr2.IdDMS 
                         FROM client_dms_relation ctr2 
                         WHERE ctr2.idClientHeader = hc.Id 
                         LIMIT 1),
                        ''
                    ) as ndCliente,
                    f.IdOrderTotal as ndPedido,
                    COALESCE(
                        NULLIF(TRIM(c.RazonSocial), ''),
                        TRIM(CONCAT(COALESCE(c.Name, ''), ' ', COALESCE(c.LastName, ''), ' ', COALESCE(c.MotherLastName, '')))
                    ) as cliente,
                    ct.Name as tipoCliente,
                    f.IdCustomerType as idCustomerType,
                    p.Name as proceso,
                    ot.Name as operacion,
                    a.Name as agencia,
                    f.IdAgency as idAgency,
                    f.RegistrationDate as registro,
                    fs.Name as fase,
                    f.IdCurrentState,
                    CASE 
                        WHEN f.IdCurrentState IN (4, 6) THEN f.UpdateDate
                        ELSE f.AgendDate
                    END as fechaLiberacion,
                    CASE 
                        WHEN EXISTS (
                            SELECT 1 
                            FROM file_document dbf 
                            INNER JOIN document_file_status dfs ON dbf.IdCurrentStatus = dfs.Id 
                            WHERE dbf.IdFile = f.Id 
                            AND dfs.Id = 2
                        ) THEN 1 
                        ELSE 0 
                    END as tieneDocumentosPendientes,
                    (
                        SELECT COUNT(*) 
                        FROM file_document dbfPend
                        WHERE dbfPend.IdFile = f.Id
                        AND dbfPend.Enabled = 1
                        AND dbfPend.IdCurrentStatus <> 4
                    ) as documentosNoAprobados,
                    COALESCE(obc1.VIN, obc2.VIN) as vin,
                    COALESCE(obc1.Model, obc2.Model) as modelo,
                    COALESCE(obc1.Year, obc2.Year) as year,
                    COALESCE(obc1.CarType, obc2.CarType) as version
                FROM expedient f
                INNER JOIN client_header hc ON hc.IdClient = f.IdClient
                INNER JOIN client c ON hc.IdClient = c.Id
                INNER JOIN process p ON f.IdProcess = p.Id
                INNER JOIN operation_type ot ON f.IdOperation = ot.Id
                LEFT JOIN customer_type ct ON f.IdCustomerType = ct.Id
                INNER JOIN file_status fs ON f.IdCurrentState = fs.Id
                INNER JOIN agency a ON f.IdAgency = a.Id
                LEFT JOIN order obc1 ON obc1.Id = f.IdOrder
                LEFT JOIN (
                    SELECT obc2a.IdDMS,
                        obc2a.idagency,
                        obc2a.VIN,
                        obc2a.Model,
                        obc2a.Year,
                        obc2a.CarType
                    FROM order obc2a
                    INNER JOIN (
                        SELECT IdDMS, idagency, MAX(COALESCE(RegistrationDate, '1900-01-01')) as MaxDate
                        FROM order
                        GROUP BY IdDMS, idagency
                    ) obc2b ON obc2a.IdDMS = obc2b.IdDMS
                        AND obc2a.idagency = obc2b.idagency
                        AND COALESCE(obc2a.RegistrationDate, '1900-01-01') = obc2b.MaxDate
                ) obc2 ON f.IdOrder IS NULL
                    AND obc2.IdDMS = f.IdOrderTotal
                    AND obc2.idagency = f.IdAgency
                WHERE f.IdAgency = ?
                AND p.Enabled = 1
                AND EXISTS (
                    SELECT 1 
                    FROM client_dms_relation ctr_check 
                    WHERE ctr_check.idClientHeader = hc.Id 
                    AND ctr_check.IdAgency = f.IdAgency
                )
            ";

            $params = [$idAgency];
            if ($filtrarPorProceso) {
                $sql .= " AND f.IdProcess = ?";
                $params[] = $idProcess;
            }
            
            // Aplicar filtro de pedidos cancelados 
            if ($showCancelled) {
                $sql .= " AND f.IdCurrentState = 5";
            } else {
                $sql .= " AND f.IdCurrentState != 5";
            }
            
            // LIMIT y OFFSET deben ser valores directos, no parámetros preparados
            $limit = (int) $limit;
            $offset = (int) $offset;
            $sql .= " ORDER BY tieneDocumentosPendientes DESC, ndCliente ASC, ndPedido ASC LIMIT {$limit} OFFSET {$offset}";

            // Ejecutar query principal
            $query = $this->db->query($sql, $params);
            $results = $query->getResultArray();

            // Query para contar total de registros
            $countSql = "
                SELECT COUNT(*) as total
                FROM expedient f
                INNER JOIN client_header hc ON hc.IdClient = f.IdClient
                INNER JOIN client c ON hc.IdClient = c.Id
                INNER JOIN process p ON f.IdProcess = p.Id
                INNER JOIN operation_type ot ON f.IdOperation = ot.Id
                INNER JOIN file_status fs ON f.IdCurrentState = fs.Id
                WHERE f.IdAgency = ?
                AND p.Enabled = 1
                AND EXISTS (
                    SELECT 1 
                    FROM client_dms_relation ctr_check 
                    WHERE ctr_check.idClientHeader = hc.Id 
                    AND ctr_check.IdAgency = f.IdAgency
                )
            ";
            $countParams = [$idAgency];
            if ($filtrarPorProceso) {
                $countSql .= " AND f.IdProcess = ?";
                $countParams[] = $idProcess;
            }
            if ($showCancelled) {
                $countSql .= " AND f.IdCurrentState = 5";
            } else {
                $countSql .= " AND f.IdCurrentState != 5";
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
                    'clientes' => $results,
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
            
            // Actualizar el registro en la tabla File
            $updateData = [
                'IdCurrentState' => 5, // Estado cancelado
                'Description' => $comentario,
                'UpdateDate' => date('Y-m-d H:i:s'),
                'IdLastUserUpdate' => 1 // TODO: Obtener el ID del usuario actual
            ];
            
            $result = $this->db->table('expedient')
                ->where('Id', $clienteId)
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
                        'fecha_cancelacion' => $updateData['UpdateDate']
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
                        'fechaCancelacion' => $updateData['UpdateDate']
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
            
            // Actualizar el registro en la tabla File
            $updateData = [
                'IdCurrentState' => 6, // Estado excepción
                'Description' => $comentario,
                'UpdateDate' => date('Y-m-d H:i:s'),
                'IdLastUserUpdate' => 1 // TODO: Obtener el ID del usuario actual
            ];
            
            $result = $this->db->table('expedient')
                ->where('Id', $clienteId)
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
                        'fecha_excepcion' => $updateData['UpdateDate']
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
                        'fechaExcepcion' => $updateData['UpdateDate']
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
            $data = $this->request->getJSON(true);
            
            // Validar datos requeridos
            if (empty($data['clienteId'])) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El parámetro clienteId es requerido',
                    'data' => null
                ])->setStatusCode(400);
            }
            
            $clienteId = $data['clienteId'];
            
            // Iniciar transacción para asegurar consistencia
            $this->db->transStart();
            
            // 1. Eliminar documentos relacionados (FileDocument)
            $this->db->table('file_document')
                ->where('IdFile', $clienteId)
                ->delete();
            
            // 2. Eliminar el registro principal de File
            $result = $this->db->table('expedient')
                ->where('Id', $clienteId)
                ->delete();
            
            // Verificar si la transacción fue exitosa
            if ($this->db->transStatus() === false || !$result) {
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
                    'tablas_afectadas' => ['expedient', 'file_document'],
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
            // Rollback en caso de error
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
            
            error_log("=== DEBUG cambiarEstatus ===");
            error_log("clienteId: {$clienteId}, nuevoIdCurrentState: {$nuevoIdCurrentState}");
            
            // Primero, obtener todos los estados disponibles para debugging
            $todosEstadosQuery = $this->db->table('file_status')
                ->select('Id, Name')
                ->get();
            $todosEstados = $todosEstadosQuery->getResultArray();
            error_log("Todos los estados disponibles en file_status: " . json_encode($todosEstados));

            // Verificar que el estado existe en la tabla file_status por ID
            $estadoQuery = $this->db->table('file_status')
                ->select('Id, Name')
                ->where('Id', $nuevoIdCurrentState)
                ->get();
            $estado = $estadoQuery->getRowArray();

            error_log("Estado encontrado por ID {$nuevoIdCurrentState}: " . json_encode($estado));

            if (!$estado) {
                $estadosDisponibles = array_map(function($e) {
                    return "ID: {$e['Id']} - {$e['Name']}";
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
            $nombreEstado = $estado['Name'] ?? 'ID: ' . $nuevoIdCurrentState;
            
            // Actualizar el registro en la tabla File
            $updateData = [
                'IdCurrentState' => $nuevoIdCurrentState,
                'UpdateDate' => date('Y-m-d H:i:s'),
                'IdLastUserUpdate' => 1 // TODO: Obtener el ID del usuario actual
            ];
            
            $result = $this->db->table('expedient')
                ->where('Id', $clienteId)
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
                        'fecha_cambio' => $updateData['UpdateDate']
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
                        'fechaCambio' => $updateData['UpdateDate']
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
            $idAgency = $this->request->getGet('id');
            $idProcess = $this->request->getGet('idProcess');

            if (!$idAgency || !$idProcess) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Los parámetros id e idProcess son requeridos',
                    'data' => null
                ])->setStatusCode(400);
            }

            $query = $this->db->table('expedient f')
                ->select('fs.Name as estado, COUNT(*) as cantidad')
                ->join('process p', 'f.IdProcess = p.Id', 'inner')
                ->join('file_status fs', 'f.IdCurrentState = fs.Id', 'inner')
                ->where('f.IdAgency', $idAgency)
                ->where('f.IdProcess', $idProcess)
                ->where('p.Enabled', 1)
                ->groupBy('f.IdCurrentState, fs.Name')
                ->orderBy('f.IdCurrentState');

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

            $query = $this->db->table('file_document dbf')
                ->select('
                    dbf.Id as idFileDocument,
                    p.Name as proceso,
                    fs.Name as fase,
                    dbf.Name as documento,
                    dt.Name as tipoDocumento,
                    dbf.Comment as comentario,
                    dbf.RegistrationDate as fecha,
                    u.Name as asignado,
                    dt.Required as requerido,
                    dfs.Id as idEstatus,
                    dfs.Name as EstatusName,
                    dt.ReqExpiration as ReqExpiration,
                    dbf.ExpirationDate as fechaExpiracion,
                    dbf.IdDocumentContainer as documentContainer,
                    dt.AvailableToClient as DisponibleCliente
                ')
                ->join('expedient f', 'dbf.IdFile = f.Id', 'inner')
                ->join('process p', 'f.IdProcess = p.Id', 'inner')
                ->join('document_type dt', 'dbf.IdDocumentType = dt.Id', 'inner')
                ->join('file_status fs', 'dt.IdProcessType = fs.Id', 'inner')
                ->join('document_file_status dfs', 'dbf.IdCurrentStatus = dfs.Id', 'inner')
                ->join('user u', 'dbf.IdLastUserUpdate = u.Id', 'left')
                ->where('dbf.IdFile', $idFile)
                ->where('dbf.Enabled', 1)
                ->orderBy('p.Name', 'ASC')
                ->orderBy('fs.Name', 'ASC')
                ->orderBy('dt.Name', 'ASC');

            // Log del query generado para debugging
            error_log("=== DEBUG getDocumentos ===");
            error_log("idFile: " . $idFile);
            error_log("Query SQL: " . $query->getCompiledSelect(false));
            
            $results = $query->get()->getResultArray();
            
            error_log("Resultados encontrados: " . count($results));
            if (count($results) > 0) {
                error_log("Primer resultado: " . json_encode($results[0]));
            }

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Documentos obtenidos exitosamente',
                'data' => $results
            ]);

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

            $idFile = (int) $data['idFile'];
            $documentTypeId = 21; // document_type de Liquidación

            // Verificar que el expediente exista
            $file = $this->db->table('expedient')
                ->select('Id, IdOrderTotal')
                ->where('Id', $idFile)
                ->get()
                ->getRowArray();

            if (!$file) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El expediente especificado no existe',
                    'data' => null
                ])->setStatusCode(404);
            }

            // Obtener el nombre base del tipo de documento
            $documentType = $this->db->table('document_type')
                ->select('Name')
                ->where('Id', $documentTypeId)
                ->get()
                ->getRowArray();

            if (!$documentType) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El tipo de documento de liquidación no está configurado',
                    'data' => null
                ])->setStatusCode(500);
            }

            $baseName = trim($documentType['Name'] ?? 'Liquidación');
            if ($baseName === '') {
                $baseName = 'Liquidación';
            }

            // Obtener documentos existentes de liquidación para calcular el consecutivo
            $existingDocuments = $this->db->table('file_document')
                ->select('Name')
                ->where('IdFile', $idFile)
                ->where('IdDocumentType', $documentTypeId)
                ->orderBy('Id', 'ASC')
                ->get()
                ->getResultArray();

            $maxCounter = 0;
            foreach ($existingDocuments as $existing) {
                $name = trim($existing['Name'] ?? '');
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
            while ($this->db->table('file_document')
                ->where('IdFile', $idFile)
                ->where('Name', $documentName)
                ->countAllResults() > 0) {
                $nextCounter++;
                $documentName = trim($baseName . ' ' . $nextCounter);
            }

            // Obtener siguiente ID manualmente
            $nextIdRow = $this->db->query("SELECT COALESCE(MAX(Id), 0) + 1 AS nextId FROM file_document")
                ->getRowArray();
            $nextId = (int) ($nextIdRow['nextId'] ?? 1);

            $currentUserId = $this->getCurrentUserId() ?? 1;
            $now = date('Y-m-d H:i:s');

            $documentModel = new DocumentModel();
            $documentData = [
                'Id' => $nextId,
                'Name' => $documentName,
                'Comment' => null,
                'ExpirationDate' => null,
                'PathDocument' => null,
                'Enabled' => 1,
                'RegistrationDate' => $now,
                'UpdateDate' => $now,
                'LastUserUpdate' => $currentUserId,
                'IdLastUserUpdate' => $currentUserId,
                'IdFile' => $idFile,
                'IdValidation' => null,
                'IdDocumentType' => $documentTypeId,
                'IdCurrentStatus' => 1,
                'IdDocumentError' => null
            ];

            if (!$documentModel->insert($documentData)) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'No se pudo crear el documento de liquidación',
                    'data' => [
                        'errors' => $documentModel->errors()
                    ]
                ])->setStatusCode(500);
            }

            $this->logActivity(
                'AGREGAR_DOCUMENTO_LIQUIDACION',
                "Documento de liquidación agregado al expediente {$idFile}",
                [
                    'file_id' => $idFile,
                    'pedido' => $file['IdOrderTotal'] ?? null,
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
            $documento = $this->db->table('file_document')
                ->where('Id', $idFileDocument)
                ->where('IdCurrentStatus', 3)
                ->get()
                ->getRowArray();
            
            if (!$documento) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El documento no existe o no está listo para validar',
                    'data' => null
                ])->setStatusCode(400);
            }
            
            // Actualizar el estatus del documento a "4" (Validado y aprobado)
            $updateData = [
                'IdCurrentStatus' => 4,
                'UpdateDate' => date('Y-m-d H:i:s'),
                'IdLastUserUpdate' => 1 // TODO: Obtener el ID del usuario actual
            ];
            
            $result = $this->db->table('file_document')
                ->where('Id', $idFileDocument)
                ->update($updateData);
            
            if ($result) {
                // Registrar actividad en el log (incluir file_id para historial por expediente)
                $idFile = $documento['IdFile'] ?? null;
                $this->logActivity(
                    'VALIDAR_DOCUMENTO',
                    "Documento {$idFileDocument} validado",
                    [
                        'file_id' => $idFile,
                        'documento_id' => $idFileDocument,
                        'estado_anterior' => 'Listo para validar (3)',
                        'estado_nuevo' => 'Validado y aprobado (4)',
                        'fecha_validacion' => $updateData['UpdateDate']
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
                        'fechaValidacion' => $updateData['UpdateDate']
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
            
            // Validar datos requeridos
            if (empty($data['idFileDocument']) || empty($data['nuevoEstatus'])) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Los parámetros idFileDocument y nuevoEstatus son requeridos',
                    'data' => null
                ])->setStatusCode(400);
            }
            
            $idFileDocument = $data['idFileDocument'];
            $nuevoEstatus = $data['nuevoEstatus'];
            $comentario = $data['comentario'] ?? null;
            $fechaExpiracion = $data['fechaExpiracion'] ?? null;
            
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
                    'message' => 'Token de autorización requerido',
                    'data' => null
                ])->setStatusCode(401);
            }
            
            // Verificar que el documento existe
            $documento = $this->db->table('file_document')
                ->where('Id', $idFileDocument)
                ->get()
                ->getRowArray();
            
            if (!$documento) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El documento no existe',
                    'data' => null
                ])->setStatusCode(400);
            }
            
            // Verificar permisos según el rol del usuario
            $userRoleId = $currentUser['role_id'];
            $currentStatus = $documento['IdCurrentStatus'];
            
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
                'IdCurrentStatus' => $nuevoEstatus,
                'UpdateDate' => date('Y-m-d H:i:s'),
                'IdLastUserUpdate' => $currentUser['user_id']
            ];
            
            // Si hay comentario, actualizarlo también
            if ($comentario) {
                $updateData['Comment'] = $comentario;
            }
            
            // Si hay fecha de expiración, actualizarla también
            if ($fechaExpiracion) {
                $updateData['ExpirationDate'] = $fechaExpiracion;
            }
            
            $result = $this->db->table('file_document')
                ->where('Id', $idFileDocument)
                ->update($updateData);
            
            if ($result) {
                $estadoAnterior = 'Listo para validar (3)';
                $estadoNuevo = $nuevoEstatus == 4 ? 'Aprobado (4)' : 'Rechazado (5)';
                $accion = $nuevoEstatus == 4 ? 'APROBAR_DOCUMENTO' : 'RECHAZAR_DOCUMENTO';
                $mensaje = $nuevoEstatus == 4 ? 'Documento aprobado exitosamente' : 'Documento rechazado exitosamente';
                
                // Registrar actividad en el log (incluir file_id para historial por expediente)
                $idFile = $documento['IdFile'] ?? null;
                $this->logActivity(
                    $accion,
                    "Documento {$idFileDocument} " . ($nuevoEstatus == 4 ? 'aprobado' : 'rechazado'),
                    [
                        'file_id' => $idFile,
                        'documento_id' => $idFileDocument,
                        'estado_anterior' => $estadoAnterior,
                        'estado_nuevo' => $estadoNuevo,
                        'comentario' => $comentario,
                        'fecha_procesamiento' => $updateData['UpdateDate']
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
                        'fechaProcesamiento' => $updateData['UpdateDate']
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
            
            // Validar datos requeridos
            if (empty($data['idFileDocument'])) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El parámetro idFileDocument es requerido',
                    'data' => null
                ])->setStatusCode(400);
            }
            
            $idFileDocument = $data['idFileDocument'];
            
            // Verificar que el documento existe y tiene estatus "2"
            $documento = $this->db->table('file_document')
                ->where('Id', $idFileDocument)
                ->where('IdCurrentStatus', 2)
                ->get()
                ->getRowArray();
            
            if (!$documento) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El documento no existe o no está pendiente de validación',
                    'data' => null
                ])->setStatusCode(400);
            }
            
            // Actualizar el estatus del documento a "3" (Listo para validar)
            $updateData = [
                'IdCurrentStatus' => 3,
                'UpdateDate' => date('Y-m-d H:i:s'),
                'IdLastUserUpdate' => 1 // TODO: Obtener el ID del usuario actual
            ];
            
            $result = $this->db->table('file_document')
                ->where('Id', $idFileDocument)
                ->update($updateData);
            
            if ($result) {
                // Registrar actividad en el log (incluir file_id para historial por expediente)
                $idFile = $documento['IdFile'] ?? null;
                $this->logActivity(
                    'PREPARAR_DOCUMENTO',
                    "Documento {$idFileDocument} preparado para validación",
                    [
                        'file_id' => $idFile,
                        'documento_id' => $idFileDocument,
                        'estado_anterior' => 'Pendiente de validación (2)',
                        'estado_nuevo' => 'Listo para validar (3)',
                        'fecha_preparacion' => $updateData['UpdateDate']
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
                        'fechaPreparacion' => $updateData['UpdateDate']
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

            $config = config('PdfGenerator');
            if (empty($config->apiKey) || empty($config->apiSecret) || empty($config->workspaceEmail)) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'PDF Generator no está configurado. Verifique pdfGenerator.apiKey, pdfGenerator.apiSecret y pdfGenerator.workspaceEmail en .env',
                    'data' => null
                ])->setStatusCode(500);
            }

            // Obtener datos del cliente (incluye campos de Client para template identificación)
            $cliente = $this->db->query("
                SELECT 
                    f.Id as idFile,
                    COALESCE(
                        (SELECT ctr1.IdDMS FROM client_dms_relation ctr1 
                         WHERE ctr1.idClientHeader = hc.Id AND ctr1.IdAgency = f.IdAgency LIMIT 1),
                        (SELECT ctr2.IdDMS FROM client_dms_relation ctr2 
                         WHERE ctr2.idClientHeader = hc.Id LIMIT 1),
                        ''
                    ) as ndCliente,
                    f.IdOrderTotal as ndPedido,
                    COALESCE(NULLIF(TRIM(c.RazonSocial), ''), 
                        TRIM(CONCAT(COALESCE(c.Name, ''), ' ', COALESCE(c.LastName, ''), ' ', COALESCE(c.MotherLastName, '')))
                    ) as cliente,
                    c.Name as nombre,
                    c.LastName as apellidoPaterno,
                    c.MotherLastName as apellidoMaterno,
                    c.RFC as rfc,
                    c.CURP as curp,
                    c.Email as email,
                    c.TelNumber as telefono,
                    c.TelNumber2 as telefono2,
                    c.RazonSocial as razonSocial,
                    f.IdCustomerType as idCustomerType,
                    ct.Name as tipoCliente,
                    p.Name as proceso,
                    ot.Name as operacion,
                    a.Name as agencia,
                    fs.Name as fase,
                    COALESCE(obc1.VIN, obc2.VIN) as vin,
                    COALESCE(obc1.Model, obc2.Model) as modelo,
                    COALESCE(obc1.Year, obc2.Year) as year,
                    COALESCE(obc1.CarType, obc2.CarType) as version
                FROM expedient f
                INNER JOIN client_header hc ON hc.IdClient = f.IdClient
                INNER JOIN client c ON hc.IdClient = c.Id
                INNER JOIN process p ON f.IdProcess = p.Id
                INNER JOIN operation_type ot ON f.IdOperation = ot.Id
                LEFT JOIN customer_type ct ON f.IdCustomerType = ct.Id
                INNER JOIN file_status fs ON f.IdCurrentState = fs.Id
                INNER JOIN agency a ON f.IdAgency = a.Id
                LEFT JOIN order obc1 ON obc1.Id = f.IdOrder
                LEFT JOIN (
                    SELECT obc2a.IdDMS, obc2a.idagency, obc2a.VIN, obc2a.Model, obc2a.Year, obc2a.CarType
                    FROM order obc2a
                    INNER JOIN (
                        SELECT IdDMS, idagency, MAX(COALESCE(RegistrationDate, '1900-01-01')) as MaxDate
                        FROM order GROUP BY IdDMS, idagency
                    ) obc2b ON obc2a.IdDMS = obc2b.IdDMS
                        AND obc2a.idagency = obc2b.idagency
                        AND COALESCE(obc2a.RegistrationDate, '1900-01-01') = obc2b.MaxDate
                ) obc2 ON f.IdOrder IS NULL AND obc2.IdDMS = f.IdOrderTotal AND obc2.idagency = f.IdAgency
                WHERE f.Id = ?
            ", [$idFile])->getRowArray();

            if (!$cliente) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Cliente/pedido no encontrado',
                    'data' => null
                ])->setStatusCode(404);
            }

            $idCustomerType = (int) ($cliente['idCustomerType'] ?? 0);
            $isClienteMoral = ($idCustomerType === 3);

            if ($isClienteMoral) {
                // Template 1606181 - Cliente moral (IdCustomerType = 3)
                $templateId = (int) $config->templateIdIdentificacionMoral;
                $templateData = [
                    'actividad_giro_mercantil_u_objeto_social_row_1' => '',
                    'apellido_materno_row_1' => (string) ($cliente['apellidoMaterno'] ?? ''),
                    'apellido_paterno_row_1' => (string) ($cliente['apellidoPaterno'] ?? ''),
                    'autoridad_que_la_emite_row_1' => '',
                    'c_digo_postal_row_1' => '',
                    'c_u_r_p_row_1' => (string) ($cliente['curp'] ?? ''),
                    'calle_avenida_o_v_a_row_1' => '',
                    'ciudad_poblaci_n_o_entidad_federativa_row_1' => '',
                    'colonia_o_urbanizaci_n_row_1' => '',
                    'correo_el_ctronico_row_1' => (string) ($cliente['email'] ?? ''),
                    'demarcaci_n_pol_tica_o_municipio_row_1' => '',
                    'denominaci_n_o_raz_n_social_de_la_empresa_que_elabora_el_formato_row_1' => '',
                    'denominaci_n_o_raz_n_social_row_1' => (string) ($cliente['razonSocial'] ?? $cliente['cliente'] ?? ''),
                    'en_caso_de_relaci_n_de_negocios_actividad_ocupaci_n_o_giro_al_que_se_dedique_row_1' => '',
                    'extensi_n_en_su_caso_row_1' => '',
                    'extranjero' => '',
                    'fecha_de_constituci_n_row_1' => '',
                    'fecha_de_elaboraci_n_del_formato_row_1' => date('Y-m-d'),
                    'fecha_de_nacimiento_row_1' => '',
                    'n_mero_exterior_row_1' => '',
                    'n_mero_interior_en_su_caso_row_1' => '',
                    'n_mero_o_folio_row_1' => (string) ($cliente['ndPedido'] ?? ''),
                    'n_mero_telef_nico_con_clave_lada_row_1' => (string) ($cliente['telefono'] ?? $cliente['telefono2'] ?? ''),
                    'nacional' => '',
                    'nombre_completo_y_firma_del_representante_o_apoderado_legal' => '',
                    'nombre_de_la_identificaci_n_row_1' => '',
                    'nombre_s_sin_abreviaturas_row_1' => (string) ($cliente['nombre'] ?? ''),
                    'nombre_y_firma_del_funcionario_o_empleado_que_realiz_el_cotejo' => '',
                    'pa_s_de_nacimiento_row_1' => '',
                    'pa_s_de_nacionalidad_row_1' => '',
                    'pa_s_row_1' => '',
                    'r_f_c_row_1' => (string) ($cliente['rfc'] ?? ''),
                ];
            } else {
                // Template 1606176 - Cliente físico (IdCustomerType != 3)
                $templateId = (int) $config->templateIdIdentificacionFisico;
                $templateData = [
                    'apellido_materno_row_1' => (string) ($cliente['apellidoMaterno'] ?? ''),
                    'apellido_paterno_row_1' => (string) ($cliente['apellidoPaterno'] ?? ''),
                    'autoridad_que_la_emite_row_1' => '',
                    'c_digo_postal_row_1' => '',
                    'c_u_r_p_row_1' => (string) ($cliente['curp'] ?? ''),
                    'calle_avenida_o_v_a_row_1' => '',
                    'ciudad_poblaci_n_o_entidad_federativa_row_1' => '',
                    'colonia_o_urbanizaci_n_row_1' => '',
                    'correo_el_ctronico_row_1' => (string) ($cliente['email'] ?? ''),
                    'demarcaci_n_pol_tica_o_municipio_row_1' => '',
                    'denominaci_n_o_raz_n_social_de_la_empresa_que_elabora_el_formato_row_1' => '',
                    'en_caso_de_relaci_n_de_negocios_actividad_ocupaci_n_o_giro_al_que_se_dedique_row_1' => '',
                    'extensi_n_en_su_caso_row_1' => '',
                    'extranjero' => '',
                    'fecha_de_elaboraci_n_del_formato_row_1' => date('Y-m-d'),
                    'fecha_de_nacimiento_row_1' => '',
                    'n_mero_exterior_row_1' => '',
                    'n_mero_interior_en_su_caso_row_1' => '',
                    'n_mero_o_folio_row_1' => (string) ($cliente['ndPedido'] ?? ''),
                    'n_mero_telef_nico_con_clave_lada_row_1' => (string) ($cliente['telefono'] ?? $cliente['telefono2'] ?? ''),
                    'nacional' => '',
                    'no_existe_un_due_o_beneficiario_o_beneficiario_controlador_en_la_presente_operaci_n' => '',
                    'nombre_completo_y_firma_del_cliente' => (string) ($cliente['cliente'] ?? ''),
                    'nombre_de_la_identificaci_n_row_1' => '',
                    'nombre_s_sin_abreviaturas_row_1' => (string) ($cliente['nombre'] ?? ''),
                    'nombre_y_firma_del_funcionario_o_empleado_que_realiz_el_cotejo' => '',
                    'pa_s_de_nacimiento_row_1' => '',
                    'pa_s_de_nacionalidad_row_1' => '',
                    'pa_s_row_1' => '',
                    'r_f_c_row_1' => (string) ($cliente['rfc'] ?? ''),
                    's_existe_un_due_o_beneficiario_o_beneficiario_controlador_en_la_presente_operaci_n' => '',
                ];
            }

            // Generar JWT para PDF Generator API
            $jwt = $this->generatePdfGeneratorJwt($config->apiKey, $config->apiSecret, $config->workspaceEmail);

            // Llamar a PDF Generator API - merge con template
            $client = \Config\Services::curlrequest();
            $response = $client->request('POST', $config->baseUrl . '/documents/generate', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $jwt,
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/pdf',
                ],
                'json' => [
                    'template' => [
                        'id' => $templateId,
                        'data' => $templateData,
                    ],
                    'output' => 'expedient',
                ],
                'http_errors' => false,
            ]);

            $statusCode = $response->getStatusCode();
            $body = $response->getBody();

            if ($statusCode !== 200 && $statusCode !== 201) {
                $errorBody = $response->getBody();
                error_log("PDF Generator API error ($statusCode): " . $errorBody);
                $apiMessage = 'Error al generar el PDF';
                $decoded = json_decode($errorBody, true);
                if (!empty($decoded['message'])) {
                    $apiMessage = $decoded['message'];
                } elseif ($statusCode === 401) {
                    $apiMessage = 'Credenciales inválidas. Verifique API Key y Secret en .env';
                } elseif ($statusCode === 404) {
                    $apiMessage = 'Template no accesible. Verifique que el workspace (email en .env) tenga acceso al template ' . $templateId . ' en PDF Generator API.';
                }
                return $this->response->setJSON([
                    'success' => false,
                    'message' => $apiMessage,
                    'data' => null
                ])->setStatusCode(500);
            }

            $filename = 'identificacion_cliente_' . ($cliente['cliente'] ?? $idFile) . '_' . date('Y-m-d') . '.pdf';
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

    private function generatePdfGeneratorJwt(string $apiKey, string $apiSecret, string $workspaceEmail): string
    {
        $header = ['alg' => 'HS256', 'typ' => 'JWT'];
        $payload = [
            'iss' => $apiKey,
            'sub' => $workspaceEmail,
            'exp' => time() + 60,
        ];
        $headerB64 = $this->base64UrlEncode(json_encode($header));
        $payloadB64 = $this->base64UrlEncode(json_encode($payload));
        $signature = hash_hmac('sha256', $headerB64 . '.' . $payloadB64, $apiSecret, true);
        $signatureB64 = $this->base64UrlEncode($signature);
        return $headerB64 . '.' . $payloadB64 . '.' . $signatureB64;
    }

    private function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
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
                    'message' => 'Token de autorización requerido'
                ])->setStatusCode(401);
            }

            $data = $this->request->getJSON(true) ?? $this->request->getPost();
            $idFile = (int) ($data['idFile'] ?? $data['id_file'] ?? 0);
            if (!$idFile) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'idFile es requerido'
                ])->setStatusCode(400);
            }

            $shareTokenModel = new \App\Models\FileShareTokenModel();
            $tokenData = $shareTokenModel->getOrCreateToken($idFile);
            if (!$tokenData) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'No se pudo generar el token'
                ])->setStatusCode(500);
            }

            $frontendUrl = env('miniportal.frontendUrl', env('app.frontendUrl', 'http://localhost:4200'));
            $miniportalUrl = rtrim($frontendUrl, '/') . '/consulta/' . $tokenData['Token'];

            $this->logActivity('GENERAR_TOKEN_MINIPORTAL', "Token Miniportal generado para expediente {$idFile}", [
                'file_id' => $idFile,
                'token' => $tokenData['Token']
            ], $idFile);

            return $this->response->setJSON([
                'success' => true,
                'data' => [
                    'token' => $tokenData['Token'],
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
     * Obtener datos del cliente del expediente (para copiar como beneficiario)
     */
    public function getClienteDetalle()
    {
        try {
            $currentUser = $this->getAuthenticatedUser();
            if (!$currentUser) {
                return $this->response->setJSON(['success' => false, 'message' => 'Token de autorización requerido'])->setStatusCode(401);
            }
            $idFile = (int) $this->request->getGet('idFile');
            if (!$idFile) {
                return $this->response->setJSON(['success' => false, 'message' => 'idFile es requerido'])->setStatusCode(400);
            }
            $row = $this->db->query("
                SELECT
                    COALESCE(NULLIF(TRIM(c.RazonSocial), ''),
                        TRIM(CONCAT(COALESCE(c.Name, ''), ' ', COALESCE(c.LastName, ''), ' ', COALESCE(c.MotherLastName, '')))
                    ) as cliente,
                    c.RFC as rfc,
                    c.CURP as curp
                FROM expedient f
                INNER JOIN client_header hc ON hc.IdClient = f.IdClient
                INNER JOIN client c ON hc.IdClient = c.Id
                WHERE f.Id = ?
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
                return $this->response->setJSON(['success' => false, 'message' => 'Token de autorización requerido'])->setStatusCode(401);
            }
            $idFile = (int) $this->request->getGet('idFile');
            if (!$idFile) {
                return $this->response->setJSON(['success' => false, 'message' => 'idFile es requerido'])->setStatusCode(400);
            }
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
                return $this->response->setJSON(['success' => false, 'message' => 'Token de autorización requerido'])->setStatusCode(401);
            }
            $data = $this->request->getJSON(true) ?? $this->request->getPost();
            $idFile = (int) ($data['idFile'] ?? $data['id_file'] ?? 0);
            $nombre = trim($data['nombre'] ?? $data['Nombre'] ?? '');
            if (!$idFile || !$nombre) {
                return $this->response->setJSON(['success' => false, 'message' => 'idFile y nombre son requeridos'])->setStatusCode(400);
            }
            $rfc = trim($data['rfc'] ?? $data['RFC'] ?? '') ?: null;
            $curp = trim($data['curp'] ?? $data['CURP'] ?? '') ?: null;
            $porcentaje = isset($data['porcentajeParticipacion']) ? (float) $data['porcentajeParticipacion'] : null;
            if ($porcentaje !== null && ($porcentaje < 0 || $porcentaje > 100)) {
                return $this->response->setJSON(['success' => false, 'message' => 'El porcentaje debe estar entre 0 y 100'])->setStatusCode(400);
            }
            $model = new \App\Models\FilePldBeneficiarioFinalModel();
            if ($porcentaje !== null) {
                $existentes = $model->getByFile($idFile);
                $sumaActual = array_sum(array_map(fn($b) => (float) ($b['PorcentajeParticipacion'] ?? 0), $existentes));
                if ($sumaActual + $porcentaje > 100) {
                    return $this->response->setJSON([
                        'success' => false,
                        'message' => 'La suma de porcentajes no puede superar 100%. Actual: ' . round($sumaActual, 1) . '%'
                    ])->setStatusCode(400);
                }
            }
            $id = $model->add($idFile, $nombre, $rfc, $curp, $porcentaje);
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
                return $this->response->setJSON(['success' => false, 'message' => 'Token de autorización requerido'])->setStatusCode(401);
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
}
