<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\AgencyModel;
use CodeIgniter\HTTP\ResponseInterface;

class Agency extends BaseController
{
    protected $agencyModel;
    
    public function __construct()
    {
        $this->agencyModel = new AgencyModel();
    }
    
    /**
     * GET /api/agency
     * Obtener todas las agencias con filtros y paginación
     */
    public function index()
    {
        try {
            // Obtener parámetros de consulta
            $enabled = $this->request->getGet('enabled');
            $search = $this->request->getGet('search');
            $region = $this->request->getGet('region');
            $limit = $this->request->getGet('limit') ? (int)$this->request->getGet('limit') : null;
            $offset = $this->request->getGet('offset') ? (int)$this->request->getGet('offset') : 0;
            $sortBy = $this->request->getGet('sort_by') ?: 'Name';
            $sortOrder = $this->request->getGet('sort_order') ?: 'ASC';
            
            // Validar parámetros de ordenamiento
            $allowedSortFields = ['Name', 'IdAgency', 'RegistrationDate', 'UpdateDate'];
            if (!in_array($sortBy, $allowedSortFields)) {
                $sortBy = 'Name';
            }
            
            $sortOrder = strtoupper($sortOrder) === 'DESC' ? 'DESC' : 'ASC';
            
            // Obtener agencias según los filtros (siempre con información del usuario)
            if ($search) {
                // Para búsqueda, siempre incluir todas las agencias (habilitadas y deshabilitadas)
                $agencies = $this->agencyModel->getAgenciesByNameWithUser($search, $sortBy, $sortOrder, false);
            } elseif ($region) {
                // Para filtro por región, respetar el parámetro enabled
                if ($enabled === 'true') {
                    $agencies = $this->agencyModel->getAgenciesByRegionWithUser($region, $sortBy, $sortOrder, true);
                } elseif ($enabled === 'false') {
                    $agencies = $this->agencyModel->getAgenciesByRegionWithUser($region, $sortBy, $sortOrder, false);
                } else {
                    $agencies = $this->agencyModel->getAgenciesByRegionWithUser($region, $sortBy, $sortOrder, false);
                }
            } else {
                // Para listado general, respetar el parámetro enabled
                if ($enabled === 'true') {
                    $agencies = $this->agencyModel->getAllEnabledAgenciesWithUser($sortBy, $sortOrder);
                } elseif ($enabled === 'false') {
                    $agencies = $this->agencyModel->getAllDisabledAgenciesWithUser($sortBy, $sortOrder);
                } else {
                    // Si no se especifica enabled, traer todas las agencias
                    $agencies = $this->agencyModel->getAllAgenciesWithUser($sortBy, $sortOrder);
                }
            }
            
            // Aplicar paginación si se especifica
            if ($limit) {
                $agencies = array_slice($agencies, $offset, $limit);
            }
            
            // Contar total de registros según el filtro aplicado
            if ($enabled === 'true') {
                $total = $this->agencyModel->countEnabledAgencies();
            } elseif ($enabled === 'false') {
                $total = $this->agencyModel->countDisabledAgencies();
            } else {
                $total = $this->agencyModel->countAllAgencies();
            }
            
            return $this->response
                ->setStatusCode(200)
                ->setJSON([
                    'success' => true,
                    'message' => 'Agencias obtenidas exitosamente',
                    'data' => [
                        'agencies' => $agencies,
                        'total' => $total,
                        'limit' => $limit,
                        'offset' => $offset,
                        'count' => count($agencies),
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
     * POST /api/agency
     * Crear nueva agencia
     */
    public function create()
    {
        try {
            // Obtener datos del request
            $data = $this->request->getJSON(true);
            
            // Validar datos requeridos
            $requiredFields = ['Name'];
            foreach ($requiredFields as $field) {
                if (empty($data[$field])) {
                    return $this->response
                        ->setStatusCode(400)
                        ->setJSON([
                            'success' => false,
                            'message' => "El campo '{$field}' es requerido"
                        ]);
                }
            }
            
            // Validar que el nombre no esté duplicado
            if ($this->agencyModel->isNameDuplicate($data['Name'])) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Ya existe una agencia con ese nombre'
                    ]);
            }
            
            // Preparar datos para inserción
            $agencyData = [
                'Name' => trim($data['Name']),
                'SubFix' => $data['SubFix'] ?? null,
                'IdAgency' => $data['IdAgency'] ?? null,
                'Enabled' => $data['Enabled'] ?? 1,
                'RegistrationDate' => date('Y-m-d H:i:s'),
                'UpdateDate' => date('Y-m-d H:i:s'),
                'IdLastUserUpdate' => $this->getCurrentUserId() ?? 0
            ];
            
            // Insertar agencia
            $agencyId = $this->agencyModel->insert($agencyData);
            
            if ($agencyId) {
                // Obtener la agencia creada
                $newAgency = $this->agencyModel->find($agencyId);
                
                return $this->response
                    ->setStatusCode(201)
                    ->setJSON([
                        'success' => true,
                        'message' => 'Agencia creada exitosamente',
                        'data' => $newAgency
                    ]);
            } else {
                return $this->response
                    ->setStatusCode(500)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Error al crear la agencia'
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
     * GET /api/agency/{id}
     * Obtener agencia por ID
     */
    public function show($id = null)
    {
        try {
            if (!$id) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'message' => 'ID de agencia requerido'
                    ]);
            }
            
            // Siempre incluir información del usuario que modificó
            $agency = $this->agencyModel->getAgencyByIdWithUser($id);
            
            if (!$agency) {
                return $this->response
                    ->setStatusCode(404)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Agencia no encontrada'
                    ]);
            }
            
            return $this->response
                ->setStatusCode(200)
                ->setJSON([
                    'success' => true,
                    'message' => 'Agencia obtenida exitosamente',
                    'data' => $agency
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
     * PUT /api/agency/{id}
     * Actualizar agencia existente
     */
    public function update($id = null)
    {
        try {
            if (!$id) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'message' => 'ID de agencia requerido'
                    ]);
            }
            
            // Verificar que la agencia existe
            $existingAgency = $this->agencyModel->find($id);
            if (!$existingAgency) {
                return $this->response
                    ->setStatusCode(404)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Agencia no encontrada'
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
            
            // Validar que el nombre no esté duplicado (excluyendo la agencia actual)
            if ($this->agencyModel->isNameDuplicate($data['Name'], $id)) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Ya existe otra agencia con ese nombre'
                    ]);
            }
            
            // Preparar datos para actualización
            $updateData = [
                'Name' => trim($data['Name']),
                'SubFix' => $data['SubFix'] ?? $existingAgency['SubFix'],
                'IdAgency' => $data['IdAgency'] ?? $existingAgency['IdAgency'],
                'Enabled' => isset($data['Enabled']) ? (int)$data['Enabled'] : $existingAgency['Enabled'],
                'UpdateDate' => date('Y-m-d H:i:s'),
                'IdLastUserUpdate' => $this->getCurrentUserId() ?? 0
            ];
            
            // Actualizar agencia
            if ($this->agencyModel->update($id, $updateData)) {
                // Obtener la agencia actualizada
                $updatedAgency = $this->agencyModel->find($id);
                
                return $this->response
                    ->setStatusCode(200)
                    ->setJSON([
                        'success' => true,
                        'message' => 'Agencia actualizada exitosamente',
                        'data' => $updatedAgency
                    ]);
            } else {
                return $this->response
                    ->setStatusCode(500)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Error al actualizar la agencia'
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
     * DELETE /api/agency/{id}
     * Eliminar agencia (soft delete o hard delete)
     */
    public function delete($id = null)
    {
        try {
            if (!$id) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'message' => 'ID de agencia requerido'
                    ]);
            }
            
            // Verificar que la agencia existe
            $existingAgency = $this->agencyModel->find($id);
            if (!$existingAgency) {
                return $this->response
                    ->setStatusCode(404)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Agencia no encontrada'
                    ]);
            }
            
            // Obtener parámetros de la petición
            $forceDelete = $this->request->getGet('force') === 'true';
            
            if ($forceDelete) {
                // Hard delete - eliminar permanentemente
                if ($this->agencyModel->delete($id)) {
                    return $this->response
                        ->setStatusCode(200)
                        ->setJSON([
                            'success' => true,
                            'message' => 'Agencia eliminada permanentemente'
                        ]);
                } else {
                    return $this->response
                        ->setStatusCode(500)
                        ->setJSON([
                            'success' => false,
                            'message' => 'Error al eliminar la agencia'
                        ]);
                }
            } else {
                // Soft delete - deshabilitar
                $updateData = [
                    'Enabled' => 0,
                    'UpdateDate' => date('Y-m-d H:i:s'),
                    'IdLastUserUpdate' => $this->getCurrentUserId() ?? 0
                ];
                
                if ($this->agencyModel->update($id, $updateData)) {
                    return $this->response
                        ->setStatusCode(200)
                        ->setJSON([
                            'success' => true,
                            'message' => 'Agencia deshabilitada exitosamente'
                        ]);
                } else {
                    return $this->response
                        ->setStatusCode(500)
                        ->setJSON([
                            'success' => false,
                            'message' => 'Error al deshabilitar la agencia'
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
     * PATCH /api/agency/{id}/toggle-status
     * Cambiar estado de habilitación de una agencia
     */
    public function toggleStatus($id = null)
    {
        try {
            if (!$id) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'message' => 'ID de agencia requerido'
                    ]);
            }
            
            // Verificar que la agencia existe
            $existingAgency = $this->agencyModel->find($id);
            if (!$existingAgency) {
                return $this->response
                    ->setStatusCode(404)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Agencia no encontrada'
                    ]);
            }
            
            // Cambiar estado
            $newStatus = $existingAgency['Enabled'] ? 0 : 1;
            $statusText = $newStatus ? 'habilitada' : 'deshabilitada';
            
            $updateData = [
                'Enabled' => $newStatus,
                'UpdateDate' => date('Y-m-d H:i:s'),
                'IdLastUserUpdate' => $this->getCurrentUserId() ?? 0
            ];
            
            if ($this->agencyModel->update($id, $updateData)) {
                return $this->response
                    ->setStatusCode(200)
                    ->setJSON([
                        'success' => true,
                        'message' => "Agencia {$statusText} exitosamente",
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
                        'message' => 'Error al cambiar el estado de la agencia'
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
     * GET /api/agency/search
     * Buscar agencias por nombre
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
            
            $agencies = $this->agencyModel->getAgenciesByName($search);
            
            return $this->response
                ->setStatusCode(200)
                ->setJSON([
                    'success' => true,
                    'message' => 'Búsqueda completada',
                    'data' => [
                        'agencies' => $agencies,
                        'search_term' => $search,
                        'count' => count($agencies)
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
     * GET /api/agency/regions
     * Obtener todas las regiones disponibles
     */
    public function regions()
    {
        try {
            $regions = $this->agencyModel
                ->select('SubFix')
                ->where('SubFix IS NOT NULL')
                ->where('SubFix !=', '')
                ->where('Enabled', 1)
                ->groupBy('SubFix')
                ->orderBy('SubFix', 'ASC')
                ->findAll();
            
            $regionList = array_column($regions, 'SubFix');
            
            return $this->response
                ->setStatusCode(200)
                ->setJSON([
                    'success' => true,
                    'message' => 'Regiones obtenidas exitosamente',
                    'data' => [
                        'regions' => $regionList,
                        'count' => count($regionList)
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
     * GET /api/agency/stats
     * Obtener estadísticas de agencias
     */
    public function stats()
    {
        try {
            $totalAgencies = $this->agencyModel->countAllAgencies();
            $enabledAgencies = $this->agencyModel->countEnabledAgencies();
            $disabledAgencies = $totalAgencies - $enabledAgencies;
            
            // Contar agencias por región
            $regions = $this->agencyModel
                ->select('SubFix, COUNT(*) as count')
                ->where('SubFix IS NOT NULL')
                ->where('SubFix !=', '')
                ->where('Enabled', 1)
                ->groupBy('SubFix')
                ->orderBy('count', 'DESC')
                ->findAll();
            
            return $this->response
                ->setStatusCode(200)
                ->setJSON([
                    'success' => true,
                    'message' => 'Estadísticas obtenidas exitosamente',
                    'data' => [
                        'total' => $totalAgencies,
                        'enabled' => $enabledAgencies,
                        'disabled' => $disabledAgencies,
                        'regions' => $regions
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
    private function getCurrentUserId()
    {
        // Aquí implementarías la lógica para extraer el user_id del token JWT
        // Por ahora retornamos null para que se implemente según tu sistema
        return null;
    }
}
