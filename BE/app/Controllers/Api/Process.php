<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\ProcessModel;
use CodeIgniter\HTTP\ResponseInterface;

class Process extends BaseController
{
    protected $processModel;
    
    public function __construct()
    {
        $this->processModel = new ProcessModel();
    }
    
    /**
     * GET /api/sale-type
     * Obtener todos los procesos con filtros y paginación
     */
    public function index()
    {
        try {
            // Verificar autenticación
            $currentUser = $this->getAuthenticatedUser();
            if (!$currentUser) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Token de autorización requerido'
                ])->setStatusCode(401);
            }

            // Obtener parámetros de consulta
            $enabled = $this->request->getGet('enabled');
            $search = $this->request->getGet('search');
            $limit = $this->request->getGet('limit') ? (int)$this->request->getGet('limit') : null;
            $offset = $this->request->getGet('offset') ? (int)$this->request->getGet('offset') : 0;
            $sortBy = $this->request->getGet('sort_by') ?: 'Name';
            $sortOrder = $this->request->getGet('sort_order') ?: 'ASC';
            
            // Validar parámetros de ordenamiento (mapear a snake_case para el modelo)
            $allowedSortFields = ['Name', 'RegistrationDate', 'UpdateDate'];
            if (!in_array($sortBy, $allowedSortFields)) {
                $sortBy = 'Name';
            }
            // El modelo manejará el mapeo internamente
            
            $sortOrder = strtoupper($sortOrder) === 'DESC' ? 'DESC' : 'ASC';
            
            // Obtener procesos según los filtros (siempre con información del usuario)
            if ($search) {
                // Para búsqueda, siempre incluir todos los procesos (habilitados y deshabilitados)
                $processes = $this->processModel->getProcessesByNameWithUser($search, $sortBy, $sortOrder, false);
            } else {
                // Para listado general, respetar el parámetro enabled
                if ($enabled === 'true') {
                    $processes = $this->processModel->getAllEnabledProcessesWithUser($sortBy, $sortOrder);
                } elseif ($enabled === 'false') {
                    $processes = $this->processModel->getAllDisabledProcessesWithUser($sortBy, $sortOrder);
                } else {
                    // Si no se especifica enabled, traer todos los procesos
                    $processes = $this->processModel->getAllProcessesWithUser($sortBy, $sortOrder);
                }
            }
            
            // Filtrar procesos según el rol del usuario
            $isAdmin = $this->isCurrentUserAdmin();
            
            if (!$isAdmin) {
                // Si no es administrador, filtrar solo los procesos asignados al usuario
                $userId = $currentUser['user_id'];
                $db = \Config\Database::connect();
                
                // Obtener IDs de procesos asignados al usuario (usar snake_case)
                $userProcesses = $db->table('sale_type_user')
                    ->select('id_sale_type')
                    ->where('id_user', $userId)
                    ->get()
                    ->getResultArray();
                
                $allowedProcessIds = array_column($userProcesses, 'id_sale_type');
                
                // Filtrar los procesos obtenidos (compatibilidad con ambos formatos)
                if (!empty($allowedProcessIds)) {
                    $processes = array_filter($processes, function($process) use ($allowedProcessIds) {
                        $processId = $process['id'] ?? $process['Id'] ?? null;
                        return $processId !== null && in_array($processId, $allowedProcessIds);
                    });
                    // CRÍTICO: Reindexar el array después de array_filter para evitar que JSON lo serialice como objeto
                    $processes = array_values($processes);
                } else {
                    // Si no tiene procesos asignados, retornar array vacío
                    $processes = [];
                }
            }
            
            // Aplicar paginación si se especifica
            if ($limit) {
                $processes = array_slice($processes, $offset, $limit);
                // Reindexar después de array_slice por seguridad
                $processes = array_values($processes);
            }
            
            // Contar total de registros según el filtro aplicado y los permisos del usuario
            if ($isAdmin) {
                // Administrador ve todos los procesos
                if ($enabled === 'true') {
                    $total = $this->processModel->countEnabledProcesses();
                } elseif ($enabled === 'false') {
                    $total = $this->processModel->countDisabledProcesses();
                } else {
                    $total = $this->processModel->countAllProcesses();
                }
            } else {
                // Usuario normal ve solo los procesos asignados
                $userId = $currentUser['user_id'];
                $db = \Config\Database::connect();
                
                $builder = $db->table('sale_type_user pu')
                    ->join('sale_type p', 'p.id = pu.id_sale_type', 'inner')
                    ->where('pu.id_user', $userId);
                
                if ($enabled === 'true') {
                    $builder->where('p.enabled', 1);
                } elseif ($enabled === 'false') {
                    $builder->where('p.enabled', 0);
                }
                
                $total = $builder->countAllResults();
            }
            
            return $this->response
                ->setStatusCode(200)
                ->setJSON([
                    'success' => true,
                    'message' => 'Procesos obtenidos exitosamente',
                    'data' => [
                        'processes' => $processes,
                        'total' => $total,
                        'limit' => $limit,
                        'offset' => $offset,
                        'count' => count($processes),
                        'sort_by' => $sortBy,
                        'sort_order' => $sortOrder,
                        'filter_enabled' => $enabled
                    ]
                ]);
                
        } catch (\Exception $e) {
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'success' => false,
                    'message' => 'Error interno del servidor',
                    'error' => $e->getMessage()
                ]);
        }
    }
    
    /**
     * POST /api/sale-type
     * Crear nuevo proceso
     */
    public function create()
    {
        try {
            // Obtener datos del request
            $data = $this->request->getJSON(true);
            
            // Validar datos requeridos
            if (empty($data['Name'])) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'message' => 'El campo Name es requerido'
                    ]);
            }
            
            // Validar que el nombre no esté duplicado
            if ($this->processModel->isNameDuplicate($data['Name'])) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Ya existe un proceso con ese nombre'
                    ]);
            }
            

            
            // Preparar datos para inserción (mapear PascalCase a snake_case)
            $processData = [
                'name' => trim($data['Name'] ?? $data['name'] ?? ''),
                'enabled' => isset($data['Enabled']) ? (int)$data['Enabled'] : (isset($data['enabled']) ? (int)$data['enabled'] : 1),
                'registration_date' => date('Y-m-d H:i:s'),
                'update_date' => date('Y-m-d H:i:s'),
                'id_last_user_update' => $this->getCurrentUserId() ?? 0
            ];
            
            // Insertar proceso
            $processId = $this->processModel->insert($processData);
            
            if ($processId) {
                // Obtener el proceso creado
                $newProcess = $this->processModel->find($processId);
                
                return $this->response
                    ->setStatusCode(201)
                    ->setJSON([
                        'success' => true,
                        'message' => 'Proceso creado exitosamente',
                        'data' => $newProcess
                    ]);
            } else {
                return $this->response
                    ->setStatusCode(500)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Error al crear el proceso'
                    ]);
            }
            
        } catch (\Exception $e) {
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'success' => false,
                    'message' => 'Error interno del servidor',
                    'error' => $e->getMessage()
                ]);
        }
    }
    
    /**
     * GET /api/sale-type/{id}
     * Obtener proceso por ID
     */
    public function show($id = null)
    {
        try {
            if (!$id) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'message' => 'ID de proceso requerido'
                    ]);
            }
            
            // Siempre incluir información del usuario que modificó
            $process = $this->processModel->getProcessByIdWithUser($id);
            
            if (!$process) {
                return $this->response
                    ->setStatusCode(404)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Proceso no encontrado'
                    ]);
            }
            
            return $this->response
                ->setStatusCode(200)
                ->setJSON([
                    'success' => true,
                    'message' => 'Proceso obtenido exitosamente',
                    'data' => $process
                ]);
                
        } catch (\Exception $e) {
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'success' => false,
                    'message' => 'Error interno del servidor',
                    'error' => $e->getMessage()
                ]);
        }
    }
    
    /**
     * PUT /api/sale-type/{id}
     * Actualizar proceso existente
     */
    public function update($id = null)
    {
        try {
            if (!$id) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'message' => 'ID de proceso requerido'
                    ]);
            }
            
            // Verificar que el proceso existe
            $existingProcess = $this->processModel->find($id);
            if (!$existingProcess) {
                return $this->response
                    ->setStatusCode(404)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Proceso no encontrado'
                    ]);
            }
            
            // Obtener datos del request
            $data = $this->request->getJSON(true);
            
            // Validar datos requeridos
            if (empty($data['Name'])) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'message' => 'El campo Name es requerido'
                    ]);
            }
            

            
            // Validar que el nombre no esté duplicado (excluyendo el proceso actual)
            if ($this->processModel->isNameDuplicate($data['Name'], $id)) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Ya existe otro proceso con ese nombre'
                    ]);
            }
            

            
            // Preparar datos para actualización (snake_case)
            $updateData = [];
            if (isset($data['Name']) || isset($data['name'])) {
                $updateData['name'] = trim($data['Name'] ?? $data['name'] ?? '');
            }
            if (isset($data['Enabled']) || isset($data['enabled'])) {
                $updateData['enabled'] = isset($data['Enabled']) ? (int)$data['Enabled'] : (int)$data['enabled'];
            } else {
                // Si no se especifica, mantener el valor actual
                $updateData['enabled'] = $existingProcess['enabled'] ?? $existingProcess['Enabled'] ?? 1;
            }
            $updateData['update_date'] = date('Y-m-d H:i:s');
            $updateData['id_last_user_update'] = $this->getCurrentUserId() ?? 0;
            
            // Actualizar proceso
            if ($this->processModel->update($id, $updateData)) {
                // Obtener el proceso actualizado
                $updatedProcess = $this->processModel->find($id);
                
                return $this->response
                    ->setStatusCode(200)
                    ->setJSON([
                        'success' => true,
                        'message' => 'Proceso actualizado exitosamente',
                        'data' => $updatedProcess
                    ]);
            } else {
                return $this->response
                    ->setStatusCode(500)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Error al actualizar el proceso'
                    ]);
            }
            
        } catch (\Exception $e) {
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'success' => false,
                    'message' => 'Error interno del servidor',
                    'error' => $e->getMessage()
                ]);
        }
    }
    
    /**
     * DELETE /api/sale-type/{id}
     * Eliminar proceso (soft delete o hard delete)
     */
    public function delete($id = null)
    {
        try {
            if (!$id) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'message' => 'ID de proceso requerido'
                    ]);
            }
            
            // Debug: verificar la petición

            // Verificar que el proceso existe
            $existingProcess = $this->processModel->find($id);
            if (!$existingProcess) {

                return $this->response
                    ->setStatusCode(404)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Proceso no encontrado'
                    ]);
            }
            
            $processName = $existingProcess['name'] ?? $existingProcess['Name'] ?? 'N/A';

            // Obtener parámetros de la petición
            $forceDelete = $this->request->getGet('force') === 'true';

            if ($forceDelete) {
                // Hard delete - eliminar permanentemente

                if ($this->processModel->delete($id)) {

                    return $this->response
                        ->setStatusCode(200)
                        ->setJSON([
                            'success' => true,
                            'message' => 'Proceso eliminado permanentemente'
                        ]);
                } else {

                    return $this->response
                        ->setStatusCode(500)
                        ->setJSON([
                            'success' => false,
                            'message' => 'Error al eliminar el proceso'
                        ]);
                }
            } else {
                // Soft delete - deshabilitar (snake_case)
                $updateData = [
                    'enabled' => 0,
                    'update_date' => date('Y-m-d H:i:s'),
                    'id_last_user_update' => $this->getCurrentUserId() ?? 0
                ];
                
                if ($this->processModel->update($id, $updateData)) {
                    return $this->response
                        ->setStatusCode(200)
                        ->setJSON([
                            'success' => true,
                            'message' => 'Proceso deshabilitado exitosamente'
                        ]);
                } else {
                    return $this->response
                        ->setStatusCode(500)
                        ->setJSON([
                            'success' => false,
                            'message' => 'Error al deshabilitar el proceso'
                        ]);
                }
            }
            
        } catch (\Exception $e) {
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'success' => false,
                    'message' => 'Error interno del servidor',
                    'error' => $e->getMessage()
                ]);
        }
    }
    
    /**
     * PATCH /api/sale-type/{id}/estado
     * Cambiar estado de habilitación de un proceso
     */
    public function toggleStatus($id = null)
    {
        try {
            if (!$id) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'message' => 'ID de proceso requerido'
                    ]);
            }
            
            // Verificar que el proceso existe
            $existingProcess = $this->processModel->find($id);
            if (!$existingProcess) {
                return $this->response
                    ->setStatusCode(404)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Proceso no encontrado'
                    ]);
            }
            
            // Cambiar estado (compatibilidad con ambos formatos)
            $currentStatus = $existingProcess['enabled'] ?? $existingProcess['Enabled'] ?? 0;
            $newStatus = $currentStatus ? 0 : 1;
            $statusText = $newStatus ? 'habilitado' : 'deshabilitado';
            
            $updateData = [
                'enabled' => $newStatus,
                'update_date' => date('Y-m-d H:i:s'),
                'id_last_user_update' => $this->getCurrentUserId() ?? 0
            ];
            
            if ($this->processModel->update($id, $updateData)) {
                return $this->response
                    ->setStatusCode(200)
                    ->setJSON([
                        'success' => true,
                        'message' => "Proceso {$statusText} exitosamente",
                        'data' => [
                            'id' => $id,
                            'enabled' => $newStatus,
                            'status_text' => $statusText
                        ]
                    ]);
            } else {
                return $this->response
                    ->setStatusCode(500)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Error al cambiar el estado del proceso'
                    ]);
            }
            
        } catch (\Exception $e) {
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'success' => false,
                    'message' => 'Error interno del servidor',
                    'error' => $e->getMessage()
                ]);
        }
    }
    
    /**
     * GET /api/sale-type/search
     * Buscar procesos por nombre
     */
    public function search()
    {
        try {
            $search = $this->request->getGet('q');
            
            if (!$search || strlen($search) < 2) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Término de búsqueda debe tener al menos 2 caracteres'
                    ]);
            }
            
            $processes = $this->processModel->getProcessesByNameWithUser($search);
            
            return $this->response
                ->setStatusCode(200)
                ->setJSON([
                    'success' => true,
                    'message' => 'Búsqueda completada',
                    'data' => [
                        'processes' => $processes,
                        'search_term' => $search,
                        'count' => count($processes)
                    ]
                ]);
                
        } catch (\Exception $e) {
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'success' => false,
                    'message' => 'Error interno del servidor',
                    'error' => $e->getMessage()
                ]);
        }
    }
    
    /**
     * GET /api/sale-type/stats
     * Obtener estadísticas de procesos
     */
    public function stats()
    {
        try {
            // Obtener filtros de la petición
            $filters = [
                'start_date' => $this->request->getGet('start_date'),
                'end_date' => $this->request->getGet('end_date'),
                'agency_id' => $this->request->getGet('agency_id'),
                'user_id' => $this->request->getGet('user_id')
            ];

            // Método simplificado para debug
            $total = $this->processModel->countAllResults();
            $enabled = $this->processModel->where('Enabled', 1)->countAllResults();
            $disabled = $this->processModel->where('Enabled', 0)->countAllResults();

            $stats = [
                'total' => $total,
                'enabled' => $enabled,
                'disabled' => $disabled
            ];

            return $this->response
                ->setStatusCode(200)
                ->setJSON([
                    'success' => true,
                    'message' => 'Estadísticas obtenidas exitosamente',
                    'data' => $stats
                ]);
                
        } catch (\Exception $e) {

            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'success' => false,
                    'message' => 'Error interno del servidor',
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
        }
    }
    
    /**
     * Método auxiliar para obtener el ID del usuario actual
     * Ahora utiliza la funcionalidad del BaseController
     */
    protected function getCurrentUserId()
    {
        return parent::getCurrentUserId();
    }
}
