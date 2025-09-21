<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;
use App\Models\UserActivityLogModel;

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

            // Validar parámetros requeridos
            if (!$idAgency || !$idProcess) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Los parámetros id e idProcess son requeridos',
                    'data' => null
                ])->setStatusCode(400);
            }

            // Query principal usando SQL directo para evitar problemas con Query Builder
            $sql = "
                SELECT 
                    f.Id as idFile,
                    MIN(ctr.IdTotalDealer) as ndCliente,
                    f.IdOrderTotal as ndPedido,
                    TRIM(CONCAT(COALESCE(c.Name, ''), ' ', COALESCE(c.LastName, ''), ' ', COALESCE(c.MotherLastName, ''))) as cliente,
                    p.Name as proceso,
                    ot.Name as operacion,
                    f.RegistrationDate as registro,
                    fs.Name as fase,
                    f.IdCurrentState,
                    f.AgendDate as fechaLiberacion,
                    CASE 
                        WHEN EXISTS (
                            SELECT 1 
                            FROM DocumentByFile dbf 
                            INNER JOIN DocumentFile_Status dfs ON dbf.IdCurrentStatus = dfs.Id 
                            WHERE dbf.IdFile = f.Id 
                            AND dfs.Id = 2
                        ) THEN 1 
                        ELSE 0 
                    END as tieneDocumentosPendientes
                FROM File f
                INNER JOIN HeaderClient hc ON f.IdClient = hc.Id
                INNER JOIN Client c ON hc.IdClient = c.Id
                INNER JOIN Process p ON f.IdProcess = p.Id
                INNER JOIN OperationType ot ON f.IdOperation = ot.Id
                INNER JOIN File_Status fs ON f.IdCurrentState = fs.Id
                INNER JOIN Client_Total_Relation ctr ON hc.Id = ctr.idHeaderClient
                WHERE f.IdAgency = ?
                AND f.IdProcess = ?
                AND p.Enabled = 1
                AND ((c.Name IS NOT NULL AND c.Name != '') OR (c.LastName IS NOT NULL AND c.LastName != '') OR (c.MotherLastName IS NOT NULL AND c.MotherLastName != ''))
                GROUP BY f.Id, f.IdOrderTotal, c.Name, c.LastName, c.MotherLastName, p.Name, ot.Name, f.RegistrationDate, fs.Name, f.IdCurrentState, f.AgendDate
            ";
            
            $params = [$idAgency, $idProcess];
            
            // Aplicar filtro de pedidos cancelados 
            if ($showCancelled) {
                $sql .= " AND f.IdCurrentState = 5";
            } else {
                // Cuando no se muestran cancelados, excluir solo cancelados (5), pero mostrar excepciones (6)
                $sql .= " AND f.IdCurrentState != 5";
            }
            
            $sql .= " ORDER BY tieneDocumentosPendientes DESC, ndCliente ASC, ndPedido ASC LIMIT ? OFFSET ?";
            $params[] = $limit;
            $params[] = $offset;

            // Ejecutar query principal
            $query = $this->db->query($sql, $params);
            $results = $query->getResultArray();

            // Query para contar total de registros usando SQL directo
            $countSql = "
                SELECT COUNT(*) as total
                FROM File f
                INNER JOIN HeaderClient hc ON f.IdClient = hc.Id
                INNER JOIN Client c ON hc.IdClient = c.Id
                INNER JOIN Process p ON f.IdProcess = p.Id
                INNER JOIN OperationType ot ON f.IdOperation = ot.Id
                INNER JOIN File_Status fs ON f.IdCurrentState = fs.Id
                WHERE f.IdAgency = ?
                AND f.IdProcess = ?
                AND p.Enabled = 1
                AND ((c.Name IS NOT NULL AND c.Name != '') OR (c.LastName IS NOT NULL AND c.LastName != '') OR (c.MotherLastName IS NOT NULL AND c.MotherLastName != ''))
            ";
            
            $countParams = [$idAgency, $idProcess];
            
            // Aplicar el mismo filtro de pedidos cancelados a la query de conteo
            if ($showCancelled) {
                $countSql .= " AND f.IdCurrentState = 5";
            } else {
                // Cuando no se muestran cancelados, excluir solo cancelados (5), pero mostrar excepciones (6)
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
            $data = $this->request->getJSON(true);
            
            // Validar datos requeridos
            if (empty($data['clienteId']) || empty($data['nuevoIdCurrentState'])) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Los parámetros clienteId y nuevoIdCurrentState son requeridos',
                    'data' => null
                ])->setStatusCode(400);
            }
            
            $clienteId = $data['clienteId'];
            $nuevoIdCurrentState = $data['nuevoIdCurrentState'];
            
            // Validar que el nuevo estado sea válido
            $estadosValidos = [1, 4, 7]; // Integración, Liberación, Liquidación
            if (!in_array($nuevoIdCurrentState, $estadosValidos)) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El estado seleccionado no es válido',
                    'data' => null
                ])->setStatusCode(400);
            }
            
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
                // Obtener el nombre del nuevo estado
                $estadoQuery = $this->db->table('File_Status')
                    ->where('Id', $nuevoIdCurrentState)
                    ->get();
                $estadoResult = $estadoQuery->getRowArray();
                $nombreEstado = $estadoResult ? $estadoResult['Name'] : 'Desconocido';
                
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
                    dt.Name as documento,
                    dbf.Comment as comentario,
                    dbf.RegistrationDate as fecha,
                    u.Name as asignado,
                    dt.Required as requerido,
                    dfs.Id as idEstatus,
                    dfs.Name as EstatusName,
                    dt.ReqExpiration as ReqExpiration,
                    dbf.ExperationDate as fechaExpiracion
                ')
                ->join('File f', 'dbf.IdFile = f.Id', 'inner')
                ->join('Process p', 'f.IdProcess = p.Id', 'inner')
                ->join('DocumentType dt', 'dbf.IdDocumentType = dt.Id', 'inner')
                ->join('File_Status fs', 'dt.IdProcessType = fs.Id', 'inner')
                ->join('DocumentFile_Status dfs', 'dbf.IdCurrentStatus = dfs.Id', 'inner')
                ->join('User u', 'dbf.IdLastUserUpdate = u.Id', 'left')
                ->where('dbf.IdFile', $idFile)
                ->orderBy('p.Name', 'ASC')
                ->orderBy('fs.Name', 'ASC')
                ->orderBy('dt.Name', 'ASC');

            $results = $query->get()->getResultArray();

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
