<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\OperationTypeModel;
use CodeIgniter\HTTP\ResponseInterface;

class OperationType extends BaseController
{
    protected $operationTypeModel;
    
    public function __construct()
    {
        $this->operationTypeModel = new OperationTypeModel();
    }
    
    /**
     * GET /api/operation-type
     * Obtener todos los tipos de operación con filtros y paginación
     */
    public function index()
    {
        try {
            // Obtener parámetros de consulta
            $enabled = $this->request->getGet('enabled');
            $search = $this->request->getGet('search');
            $limit = $this->request->getGet('limit') ? (int)$this->request->getGet('limit') : null;
            $offset = $this->request->getGet('offset') ? (int)$this->request->getGet('offset') : 0;
            $sortBy = $this->request->getGet('sort_by') ?: 'Name';
            $sortOrder = $this->request->getGet('sort_order') ?: 'ASC';
            
            // Validar parámetros de ordenamiento
            $allowedSortFields = ['Name', 'RegistrationDate', 'UpdateDate'];
            if (!in_array($sortBy, $allowedSortFields)) {
                $sortBy = 'Name';
            }
            
            $sortOrder = strtoupper($sortOrder) === 'DESC' ? 'DESC' : 'ASC';
            
            // Obtener tipos de operación según los filtros (siempre con información del usuario)
            if ($search) {
                // Para búsqueda, siempre incluir todos los tipos de operación (habilitados y deshabilitados)
                $operationTypes = $this->operationTypeModel->getOperationTypesByNameWithUser($search, $sortBy, $sortOrder, false);
            } else {
                // Para listado general, respetar el parámetro enabled
                if ($enabled === 'true') {
                    $operationTypes = $this->operationTypeModel->getAllEnabledOperationTypesWithUser($sortBy, $sortOrder);
                } elseif ($enabled === 'false') {
                    $operationTypes = $this->operationTypeModel->getAllDisabledOperationTypesWithUser($sortBy, $sortOrder);
                } else {
                    // Si no se especifica enabled, traer todos los tipos de operación
                    $operationTypes = $this->operationTypeModel->getAllOperationTypesWithUser($sortBy, $sortOrder);
                }
            }
            
            // Aplicar paginación si se especifica
            if ($limit) {
                $operationTypes = array_slice($operationTypes, $offset, $limit);
            }
            
            // Contar total de registros según el filtro aplicado
            if ($enabled === 'true') {
                $total = $this->operationTypeModel->countEnabledOperationTypes();
            } elseif ($enabled === 'false') {
                $total = $this->operationTypeModel->countDisabledOperationTypes();
            } else {
                $total = $this->operationTypeModel->countAllOperationTypes();
            }
            
            return $this->response
                ->setStatusCode(200)
                ->setJSON([
                    'success' => true,
                    'message' => 'Tipos de operación obtenidos exitosamente',
                    'data' => [
                        'operationTypes' => $operationTypes,
                        'total' => $total,
                        'limit' => $limit,
                        'offset' => $offset,
                        'count' => count($operationTypes),
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
     * POST /api/operation-type
     * Crear nuevo tipo de operación
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
            if ($this->operationTypeModel->isNameDuplicate($data['Name'])) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Ya existe un tipo de operación con ese nombre'
                    ]);
            }
            
            // Preparar datos para inserción
            $operationTypeData = [
                'Name' => trim($data['Name']),
                'Enabled' => $data['Enabled'] ?? 1,
                'RegistrationDate' => date('Y-m-d H:i:s'),
                'UpdateDate' => date('Y-m-d H:i:s'),
                'IdLastUserUpdate' => $this->getCurrentUserId() ?? 0
            ];
            
            // Insertar tipo de operación
            $operationTypeId = $this->operationTypeModel->insert($operationTypeData);
            
            if ($operationTypeId) {
                // Obtener el tipo de operación creado
                $newOperationType = $this->operationTypeModel->find($operationTypeId);
                
                return $this->response
                    ->setStatusCode(201)
                    ->setJSON([
                        'success' => true,
                        'message' => 'Tipo de operación creado exitosamente',
                        'data' => $newOperationType
                    ]);
            } else {
                return $this->response
                    ->setStatusCode(500)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Error al crear el tipo de operación'
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
     * GET /api/operation-type/{id}
     * Obtener tipo de operación por ID
     */
    public function show($id = null)
    {
        try {
            if (!$id) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'message' => 'ID de tipo de operación requerido'
                    ]);
            }
            
            $operationType = $this->operationTypeModel->getOperationTypeByIdWithUser($id);
            
            if (!$operationType) {
                return $this->response
                    ->setStatusCode(404)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Tipo de operación no encontrado'
                    ]);
            }
            
            return $this->response
                ->setStatusCode(200)
                ->setJSON([
                    'success' => true,
                    'message' => 'Tipo de operación obtenido exitosamente',
                    'data' => $operationType
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
     * PUT /api/operation-type/{id}
     * Actualizar tipo de operación existente
     */
    public function update($id = null)
    {
        try {
            if (!$id) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'message' => 'ID de tipo de operación requerido'
                    ]);
            }
            
            $existingOperationType = $this->operationTypeModel->find($id);
            
            if (!$existingOperationType) {
                return $this->response
                    ->setStatusCode(404)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Tipo de operación no encontrado'
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
            
            // Validar que el nombre no esté duplicado (excluyendo el tipo de operación actual)
            if ($this->operationTypeModel->isNameDuplicate($data['Name'], $id)) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Ya existe otro tipo de operación con ese nombre'
                    ]);
            }
            
            // Preparar datos para actualización
            $updateData = [
                'Name' => trim($data['Name']),
                'Enabled' => isset($data['Enabled']) ? (int)$data['Enabled'] : $existingOperationType['Enabled'],
                'UpdateDate' => date('Y-m-d H:i:s'),
                'IdLastUserUpdate' => $this->getCurrentUserId() ?? 0
            ];
            
            // Actualizar tipo de operación
            if ($this->operationTypeModel->update($id, $updateData)) {
                // Obtener el tipo de operación actualizado
                $updatedOperationType = $this->operationTypeModel->find($id);
                
                return $this->response
                    ->setStatusCode(200)
                    ->setJSON([
                        'success' => true,
                        'message' => 'Tipo de operación actualizado exitosamente',
                        'data' => $updatedOperationType
                    ]);
            } else {
                return $this->response
                    ->setStatusCode(500)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Error al actualizar el tipo de operación'
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
     * DELETE /api/operation-type/{id}
     * Eliminar tipo de operación (soft delete o hard delete)
     */
    public function delete($id = null)
    {
        try {
            if (!$id) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'message' => 'ID de tipo de operación requerido'
                    ]);
            }
            
            $operationType = $this->operationTypeModel->find($id);
            
            if (!$operationType) {
                return $this->response
                    ->setStatusCode(404)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Tipo de operación no encontrado'
                    ]);
            }
            
            // Soft delete - cambiar estado a deshabilitado
            $updateData = [
                'Enabled' => 0,
                'UpdateDate' => date('Y-m-d H:i:s'),
                'IdLastUserUpdate' => $this->getCurrentUserId() ?? 0
            ];
            
            if ($this->operationTypeModel->update($id, $updateData)) {
                return $this->response
                    ->setStatusCode(200)
                    ->setJSON([
                        'success' => true,
                        'message' => 'Tipo de operación deshabilitado exitosamente'
                    ]);
            } else {
                return $this->response
                    ->setStatusCode(500)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Error al deshabilitar el tipo de operación'
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
     * PATCH /api/operation-type/{id}/estado
     * Cambiar estado del tipo de operación (habilitar/deshabilitar)
     */
    public function toggleStatus($id = null)
    {
        try {
            if (!$id) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'message' => 'ID de tipo de operación requerido'
                    ]);
            }
            
            $operationType = $this->operationTypeModel->find($id);
            
            if (!$operationType) {
                return $this->response
                    ->setStatusCode(404)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Tipo de operación no encontrado'
                    ]);
            }
            
            // Cambiar estado
            $newStatus = $operationType['Enabled'] == 1 ? 0 : 1;
            $statusText = $newStatus == 1 ? 'habilitado' : 'deshabilitado';
            
            $updateData = [
                'Enabled' => $newStatus,
                'UpdateDate' => date('Y-m-d H:i:s'),
                'IdLastUserUpdate' => $this->getCurrentUserId() ?? 0
            ];
            
            if ($this->operationTypeModel->update($id, $updateData)) {
                return $this->response
                    ->setStatusCode(200)
                    ->setJSON([
                        'success' => true,
                        'message' => "Tipo de operación {$statusText} exitosamente"
                    ]);
            } else {
                return $this->response
                    ->setStatusCode(500)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Error al cambiar el estado del tipo de operación'
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
     * GET /api/operation-type/search
     * Buscar tipos de operación por nombre
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
            
            $operationTypes = $this->operationTypeModel->getOperationTypesByNameWithUser($search);
            
            return $this->response
                ->setStatusCode(200)
                ->setJSON([
                    'success' => true,
                    'message' => 'Búsqueda completada',
                    'data' => [
                        'operationTypes' => $operationTypes,
                        'search_term' => $search,
                        'count' => count($operationTypes)
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
     * GET /api/operation-type/stats
     * Obtener estadísticas de tipos de operación
     */
    public function stats()
    {
        try {
            $totalOperationTypes = $this->operationTypeModel->countAllOperationTypes();
            $enabledOperationTypes = $this->operationTypeModel->countEnabledOperationTypes();
            $disabledOperationTypes = $totalOperationTypes - $enabledOperationTypes;
            
            return $this->response
                ->setStatusCode(200)
                ->setJSON([
                    'success' => true,
                    'message' => 'Estadísticas obtenidas exitosamente',
                    'data' => [
                        'total' => $totalOperationTypes,
                        'enabled' => $enabledOperationTypes,
                        'disabled' => $disabledOperationTypes
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
     * Método auxiliar para obtener el ID del usuario actual
     * Implementar según tu lógica de autenticación
     */
    protected function getCurrentUserId()
    {
        // Aquí implementarías la lógica para extraer el user_id del token JWT
        // Por ahora retornamos null para que se implemente según tu sistema
        return null;
    }
}
