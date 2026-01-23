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
            // Obtener información del usuario desde el token JWT
            $userId = 1; // TODO: Obtener del token JWT
            $username = 'admin'; // TODO: Obtener del token JWT
            
            $logData = [
                'user_id' => $userId,
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
                FROM File f
                INNER JOIN Agency a ON f.IdAgency = a.Id
                INNER JOIN Process p ON f.IdProcess = p.Id
                INNER JOIN File_Status fs ON f.IdCurrentState = fs.Id
                WHERE f.Id = ?
            ", [$idFile])->getRowArray();

            if (!$fileInfo) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El pedido no existe',
                    'data' => null
                ])->setStatusCode(404);
            }

            // Verificar relación Client_Total_Relation
            $relacion = $this->db->query("
                SELECT 
                    ctr.Id,
                    ctr.IdAgency,
                    ctr.IdTotalDealer,
                    a.Name as nombre_agencia
                FROM HeaderClient hc
                INNER JOIN Client_Total_Relation ctr ON ctr.idHeaderClient = hc.Id
                INNER JOIN Agency a ON ctr.IdAgency = a.Id
                WHERE hc.Id = ?
                AND ctr.IdAgency = ?
            ", [$fileInfo['IdClient'], $fileInfo['IdAgency']])->getRowArray();

            // Verificar todas las relaciones del cliente
            $todasRelaciones = $this->db->query("
                SELECT 
                    ctr.Id,
                    ctr.IdAgency,
                    ctr.IdTotalDealer,
                    a.Name as nombre_agencia
                FROM HeaderClient hc
                INNER JOIN Client_Total_Relation ctr ON ctr.idHeaderClient = hc.Id
                INNER JOIN Agency a ON ctr.IdAgency = a.Id
                WHERE hc.Id = ?
            ", [$fileInfo['IdClient']])->getResultArray();

            // Verificar condiciones del query de validación
            $cumpleCondiciones = [
                'agencia' => $idAgency ? ($fileInfo['IdAgency'] == $idAgency) : null,
                'proceso' => $idProcess ? ($fileInfo['IdProcess'] == $idProcess) : null,
                'proceso_habilitado' => $fileInfo['proceso_habilitado'] == 1,
                'no_cancelado' => $fileInfo['IdCurrentState'] != 5,
                'tiene_relacion_cliente_agencia' => $relacion !== null
            ];

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Diagnóstico completado',
                'data' => [
                    'pedido' => $fileInfo,
                    'relacion_requerida' => $relacion,
                    'todas_relaciones' => $todasRelaciones,
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
     * Reparar relación Client_Total_Relation faltante para un File.
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
                FROM File f
                WHERE f.Id = ?
            ", [$idFile])->getRowArray();
            if (!$file) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El pedido no existe',
                    'data' => null
                ])->setStatusCode(404);
            }

            $idHeaderClient = (int) $file['IdClient'];
            $idAgency = (int) $file['IdAgency'];

            $existe = $this->db->query("
                SELECT 1 FROM Client_Total_Relation ctr
                WHERE ctr.idHeaderClient = ? AND ctr.IdAgency = ?
            ", [$idHeaderClient, $idAgency])->getRowArray();
            if ($existe) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'La relación ya existe; no se requiere reparación',
                    'data' => ['idFile' => $idFile, 'idHeaderClient' => $idHeaderClient, 'IdAgency' => $idAgency]
                ]);
            }

            $otro = $this->db->query("
                SELECT ctr.IdTotalDealer FROM Client_Total_Relation ctr
                WHERE ctr.idHeaderClient = ?
                LIMIT 1
            ", [$idHeaderClient])->getRowArray();
            $idTotalDealer = $otro ? trim((string) ($otro['IdTotalDealer'] ?? '')) : '';

            $nextIdRow = $this->db->query("SELECT COALESCE(MAX(Id), 0) + 1 AS nextId FROM Client_Total_Relation")->getRowArray();
            $nextId = (int) ($nextIdRow['nextId'] ?? 1);

            $this->db->table('Client_Total_Relation')->insert([
                'Id' => $nextId,
                'idHeaderClient' => $idHeaderClient,
                'IdAgency' => $idAgency,
                'IdTotalDealer' => $idTotalDealer
            ]);

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Relación cliente-agencia creada correctamente',
                'data' => [
                    'idFile' => $idFile,
                    'idRelation' => $nextId,
                    'idHeaderClient' => $idHeaderClient,
                    'IdAgency' => $idAgency,
                    'IdTotalDealer' => $idTotalDealer ?: '(vacío)'
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
            // El cliente debe estar relacionado con la agencia del pedido a través de Client_Total_Relation
            $sql = "
                SELECT 
                    f.Id as idFile,
                    COALESCE(
                        (SELECT ctr1.IdTotalDealer 
                         FROM Client_Total_Relation ctr1 
                         WHERE ctr1.idHeaderClient = hc.Id 
                         AND ctr1.IdAgency = f.IdAgency 
                         LIMIT 1),
                        (SELECT ctr2.IdTotalDealer 
                         FROM Client_Total_Relation ctr2 
                         WHERE ctr2.idHeaderClient = hc.Id 
                         LIMIT 1),
                        ''
                    ) as ndCliente,
                    f.IdOrderTotal as ndPedido,
                    COALESCE(
                        NULLIF(TRIM(c.RazonSocial), ''),
                        TRIM(CONCAT(COALESCE(c.Name, ''), ' ', COALESCE(c.LastName, ''), ' ', COALESCE(c.MotherLastName, '')))
                    ) as cliente,
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
                            FROM DocumentByFile dbf 
                            INNER JOIN DocumentFile_Status dfs ON dbf.IdCurrentStatus = dfs.Id 
                            WHERE dbf.IdFile = f.Id 
                            AND dfs.Id = 2
                        ) THEN 1 
                        ELSE 0 
                    END as tieneDocumentosPendientes,
                    (
                        SELECT COUNT(*) 
                        FROM DocumentByFile dbfPend
                        WHERE dbfPend.IdFile = f.Id
                        AND dbfPend.Enabled = 1
                        AND dbfPend.IdCurrentStatus <> 4
                    ) as documentosNoAprobados
                FROM File f
                INNER JOIN HeaderClient hc ON f.IdClient = hc.Id
                INNER JOIN Client c ON hc.IdClient = c.Id
                INNER JOIN Process p ON f.IdProcess = p.Id
                INNER JOIN OperationType ot ON f.IdOperation = ot.Id
                INNER JOIN File_Status fs ON f.IdCurrentState = fs.Id
                INNER JOIN Agency a ON f.IdAgency = a.Id
                WHERE f.IdAgency = ?
                AND p.Enabled = 1
                AND EXISTS (
                    SELECT 1 
                    FROM Client_Total_Relation ctr_check 
                    WHERE ctr_check.idHeaderClient = hc.Id 
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
            
            $sql .= " ORDER BY tieneDocumentosPendientes DESC, ndCliente ASC, ndPedido ASC LIMIT ? OFFSET ?";
            $params[] = $limit;
            $params[] = $offset;

            // Ejecutar query principal
            $query = $this->db->query($sql, $params);
            $results = $query->getResultArray();

            // Query para contar total de registros
            $countSql = "
                SELECT COUNT(*) as total
                FROM File f
                INNER JOIN HeaderClient hc ON f.IdClient = hc.Id
                INNER JOIN Client c ON hc.IdClient = c.Id
                INNER JOIN Process p ON f.IdProcess = p.Id
                INNER JOIN OperationType ot ON f.IdOperation = ot.Id
                INNER JOIN File_Status fs ON f.IdCurrentState = fs.Id
                WHERE f.IdAgency = ?
                AND p.Enabled = 1
                AND ((c.Name IS NOT NULL AND c.Name != '') OR (c.LastName IS NOT NULL AND c.LastName != '') OR (c.MotherLastName IS NOT NULL AND c.MotherLastName != ''))
                AND EXISTS (
                    SELECT 1 
                    FROM Client_Total_Relation ctr_check 
                    WHERE ctr_check.idHeaderClient = hc.Id 
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
            
            $result = $this->db->table('File')
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
            
            $result = $this->db->table('File')
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
            
            // 1. Eliminar documentos relacionados (DocumentByFile)
            $this->db->table('DocumentByFile')
                ->where('IdFile', $clienteId)
                ->delete();
            
            // 2. Eliminar el registro principal de File
            $result = $this->db->table('File')
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
                    'tablas_afectadas' => ['File', 'DocumentByFile'],
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
            $todosEstadosQuery = $this->db->table('File_Status')
                ->select('Id, Name')
                ->get();
            $todosEstados = $todosEstadosQuery->getResultArray();
            error_log("Todos los estados disponibles en File_Status: " . json_encode($todosEstados));
            
            // Verificar que el estado existe en la tabla File_Status por ID
            $estadoQuery = $this->db->table('File_Status')
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
            
            $result = $this->db->table('File')
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

            $query = $this->db->table('File f')
                ->select('fs.Name as estado, COUNT(*) as cantidad')
                ->join('Process p', 'f.IdProcess = p.Id', 'inner')
                ->join('File_Status fs', 'f.IdCurrentState = fs.Id', 'inner')
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

            $query = $this->db->table('DocumentByFile dbf')
                ->select('
                    dbf.Id as idDocumentByFile,
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
                    dbf.ExperationDate as fechaExpiracion,
                    dbf.IdDocumentContainer as documentContainer,
                    dt.AvailableToClient as DisponibleCliente
                ')
                ->join('File f', 'dbf.IdFile = f.Id', 'inner')
                ->join('Process p', 'f.IdProcess = p.Id', 'inner')
                ->join('DocumentType dt', 'dbf.IdDocumentType = dt.Id', 'inner')
                ->join('File_Status fs', 'dt.IdProcessType = fs.Id', 'inner')
                ->join('DocumentFile_Status dfs', 'dbf.IdCurrentStatus = dfs.Id', 'inner')
                ->join('User u', 'dbf.IdLastUserUpdate = u.Id', 'left')
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
            $documentTypeId = 21; // DocumentType de Liquidación

            // Verificar que el expediente exista
            $file = $this->db->table('File')
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
            $documentType = $this->db->table('DocumentType')
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
            $existingDocuments = $this->db->table('DocumentByFile')
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
            while ($this->db->table('DocumentByFile')
                ->where('IdFile', $idFile)
                ->where('Name', $documentName)
                ->countAllResults() > 0) {
                $nextCounter++;
                $documentName = trim($baseName . ' ' . $nextCounter);
            }

            // Obtener siguiente ID manualmente
            $nextIdRow = $this->db->query("SELECT COALESCE(MAX(Id), 0) + 1 AS nextId FROM DocumentByFile")
                ->getRowArray();
            $nextId = (int) ($nextIdRow['nextId'] ?? 1);

            $currentUserId = $this->getCurrentUserId() ?? 1;
            $now = date('Y-m-d H:i:s');

            $documentModel = new DocumentModel();
            $documentData = [
                'Id' => $nextId,
                'Name' => $documentName,
                'Comment' => null,
                'ExperationDate' => null,
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
                    'idDocumentByFile' => $nextId,
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
            if (empty($data['idDocumentByFile'])) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El parámetro idDocumentByFile es requerido',
                    'data' => null
                ])->setStatusCode(400);
            }
            
            $idDocumentByFile = $data['idDocumentByFile'];
            
            // Verificar que el documento existe y tiene estatus "3"
            $documento = $this->db->table('DocumentByFile')
                ->where('Id', $idDocumentByFile)
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
            
            $result = $this->db->table('DocumentByFile')
                ->where('Id', $idDocumentByFile)
                ->update($updateData);
            
            if ($result) {
                // Registrar actividad en el log
                $this->logActivity(
                    'VALIDAR_DOCUMENTO',
                    "Documento {$idDocumentByFile} validado",
                    [
                        'documento_id' => $idDocumentByFile,
                        'estado_anterior' => 'Listo para validar (3)',
                        'estado_nuevo' => 'Validado y aprobado (4)',
                        'fecha_validacion' => $updateData['UpdateDate']
                    ],
                    $idDocumentByFile
                );

                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Documento validado exitosamente',
                    'data' => [
                        'idDocumentByFile' => $idDocumentByFile,
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
            if (empty($data['idDocumentByFile']) || empty($data['nuevoEstatus'])) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Los parámetros idDocumentByFile y nuevoEstatus son requeridos',
                    'data' => null
                ])->setStatusCode(400);
            }
            
            $idDocumentByFile = $data['idDocumentByFile'];
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
            $documento = $this->db->table('DocumentByFile')
                ->where('Id', $idDocumentByFile)
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
                $updateData['ExperationDate'] = $fechaExpiracion;
            }
            
            $result = $this->db->table('DocumentByFile')
                ->where('Id', $idDocumentByFile)
                ->update($updateData);
            
            if ($result) {
                $estadoAnterior = 'Listo para validar (3)';
                $estadoNuevo = $nuevoEstatus == 4 ? 'Aprobado (4)' : 'Rechazado (5)';
                $accion = $nuevoEstatus == 4 ? 'APROBAR_DOCUMENTO' : 'RECHAZAR_DOCUMENTO';
                $mensaje = $nuevoEstatus == 4 ? 'Documento aprobado exitosamente' : 'Documento rechazado exitosamente';
                
                // Registrar actividad en el log
                $this->logActivity(
                    $accion,
                    "Documento {$idDocumentByFile} " . ($nuevoEstatus == 4 ? 'aprobado' : 'rechazado'),
                    [
                        'documento_id' => $idDocumentByFile,
                        'estado_anterior' => $estadoAnterior,
                        'estado_nuevo' => $estadoNuevo,
                        'comentario' => $comentario,
                        'fecha_procesamiento' => $updateData['UpdateDate']
                    ],
                    $idDocumentByFile
                );

                return $this->response->setJSON([
                    'success' => true,
                    'message' => $mensaje,
                    'data' => [
                        'idDocumentByFile' => $idDocumentByFile,
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
            if (empty($data['idDocumentByFile'])) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El parámetro idDocumentByFile es requerido',
                    'data' => null
                ])->setStatusCode(400);
            }
            
            $idDocumentByFile = $data['idDocumentByFile'];
            
            // Verificar que el documento existe y tiene estatus "2"
            $documento = $this->db->table('DocumentByFile')
                ->where('Id', $idDocumentByFile)
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
            
            $result = $this->db->table('DocumentByFile')
                ->where('Id', $idDocumentByFile)
                ->update($updateData);
            
            if ($result) {
                // Registrar actividad en el log
                $this->logActivity(
                    'PREPARAR_DOCUMENTO',
                    "Documento {$idDocumentByFile} preparado para validación",
                    [
                        'documento_id' => $idDocumentByFile,
                        'estado_anterior' => 'Pendiente de validación (2)',
                        'estado_nuevo' => 'Listo para validar (3)',
                        'fecha_preparacion' => $updateData['UpdateDate']
                    ],
                    $idDocumentByFile
                );

                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Documento preparado para validación exitosamente',
                    'data' => [
                        'idDocumentByFile' => $idDocumentByFile,
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
}
