<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\CostumerTypeModel;
use CodeIgniter\HTTP\ResponseInterface;

class CostumerType extends BaseController
{
    protected $costumerTypeModel;
    
    public function __construct()
    {
        $this->costumerTypeModel = new CostumerTypeModel();
    }
    
    /**
     * GET /api/costumer-type
     * Obtener todos los tipos de cliente con filtros y paginación
     */
    public function index()
    {
        try {
            $page = $this->request->getGet('page') ?? 1;
            $limit = $this->request->getGet('limit') ?? null;
            $enabled = $this->request->getGet('enabled');
            $search = $this->request->getGet('search');
            $sortBy = $this->request->getGet('sort_by') ?? 'Name';
            $sortOrder = $this->request->getGet('sort_order') ?? 'ASC';

            // Si no se especifica límite o es 0, obtener todos los registros
            if ($limit === null || $limit == 0 || $limit == 'all') {
                $limit = null;
                $offset = 0;
                $page = 1;
            } else {
                $limit = (int)$limit;
                $offset = ($page - 1) * $limit;
            }

            // Construir la consulta
            $db = \Config\Database::connect();
            $builder = $db->table('CostumerType ct');
            
            $builder->select('ct.Id, ct.Name, ct.Enabled, ct.RegistrationDate, ct.UpdateDate, ct.IdLastUserUpdate, u.Name as LastUserUpdateName')
                ->join('User u', 'u.Id = ct.IdLastUserUpdate', 'left');

            // Aplicar filtros
            if ($enabled !== null && $enabled !== '') {
                $builder->where('ct.Enabled', $enabled);
            }

            if ($search) {
                $builder->like('ct.Name', $search);
            }

            // Aplicar ordenamiento
            $builder->orderBy("ct.$sortBy", $sortOrder);

            // Obtener total de registros
            $total = $builder->countAllResults(false);

            // Obtener datos paginados o todos los registros
            if ($limit !== null) {
                $costumerTypes = $builder->limit($limit, $offset)->get()->getResultArray();
            } else {
                $costumerTypes = $builder->get()->getResultArray();
            }

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Tipos de cliente obtenidos exitosamente',
                'data' => [
                    'costumer_types' => $costumerTypes,
                    'total' => $total,
                    'limit' => $limit ?? 'all',
                    'offset' => $offset,
                    'count' => count($costumerTypes),
                    'sort_by' => $sortBy,
                    'sort_order' => $sortOrder,
                    'filter_enabled' => $enabled
                ]
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en CostumerType::index: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener tipos de cliente: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }
    
    /**
     * POST /api/costumer-type
     * Crear un nuevo tipo de cliente
     */
    public function create()
    {
        try {
            $data = $this->request->getJSON(true);
            
            // Validar campos requeridos
            if (empty($data['Name'])) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El nombre del tipo de cliente es requerido'
                ])->setStatusCode(400);
            }
            
            // Verificar si el nombre ya existe
            $existingType = $this->costumerTypeModel->where('Name', $data['Name'])->first();
            if ($existingType) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Ya existe un tipo de cliente con este nombre'
                ])->setStatusCode(400);
            }

            // Generar el siguiente ID manualmente
            $db = \Config\Database::connect();
            $maxIdQuery = $db->query("SELECT MAX(Id) as max_id FROM CostumerType");
            $maxIdResult = $maxIdQuery->getRow();
            $nextId = ($maxIdResult->max_id ?? 0) + 1;
            
            $data['Id'] = $nextId;
            $data['Enabled'] = $data['Enabled'] ?? 1;
            $data['RegistrationDate'] = date('Y-m-d H:i:s');
            $data['UpdateDate'] = date('Y-m-d H:i:s');
            $data['IdLastUserUpdate'] = session()->get('user_id') ?? 0;
            
            // Insertar tipo de cliente
            $typeId = $this->costumerTypeModel->insert($data);
            
            if ($typeId) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Tipo de cliente creado exitosamente',
                    'data' => ['id' => $nextId]
                ])->setStatusCode(201);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al crear tipo de cliente'
                ])->setStatusCode(500);
            }
            
        } catch (\Exception $e) {
            log_message('error', 'Error en CostumerType::create: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al crear tipo de cliente: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }
    
    /**
     * GET /api/costumer-type/{id}
     * Obtener un tipo de cliente específico
     */
    public function show($id = null)
    {
        try {
            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID de tipo de cliente requerido'
                ])->setStatusCode(400);
            }
            
            $db = \Config\Database::connect();
            $builder = $db->table('CostumerType ct');
            
            $costumerType = $builder
                ->select('ct.Id, ct.Name, ct.Enabled, ct.RegistrationDate, ct.UpdateDate, ct.IdLastUserUpdate, u.Name as LastUserUpdateName')
                ->join('User u', 'u.Id = ct.IdLastUserUpdate', 'left')
                ->where('ct.Id', $id)
                ->get()
                ->getRowArray();
            
            if (!$costumerType) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Tipo de cliente no encontrado'
                ])->setStatusCode(404);
            }
            
            return $this->response->setJSON([
                'success' => true,
                'message' => 'Tipo de cliente obtenido exitosamente',
                'data' => $costumerType
            ]);
            
        } catch (\Exception $e) {
            log_message('error', 'Error en CostumerType::show: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener tipo de cliente: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }
    
    /**
     * PUT /api/costumer-type/{id}
     * Actualizar un tipo de cliente
     */
    public function update($id = null)
    {
        try {
            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID de tipo de cliente requerido'
                ])->setStatusCode(400);
            }
            
            $data = $this->request->getJSON(true);
            
            // Verificar si el tipo de cliente existe
            $existingType = $this->costumerTypeModel->find($id);
            if (!$existingType) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Tipo de cliente no encontrado'
                ])->setStatusCode(404);
            }
            
            // Verificar nombre único (si se está cambiando)
            if (isset($data['Name']) && $data['Name'] !== $existingType['Name']) {
                $duplicateType = $this->costumerTypeModel->where('Name', $data['Name'])->where('Id !=', $id)->first();
                if ($duplicateType) {
                    return $this->response->setJSON([
                        'success' => false,
                        'message' => 'Ya existe un tipo de cliente con este nombre'
                    ])->setStatusCode(400);
                }
            }
            
            $data['UpdateDate'] = date('Y-m-d H:i:s');
            $data['IdLastUserUpdate'] = session()->get('user_id') ?? 0;
            
            // Actualizar tipo de cliente
            $updated = $this->costumerTypeModel->update($id, $data);
            
            if ($updated) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Tipo de cliente actualizado exitosamente'
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al actualizar tipo de cliente'
                ])->setStatusCode(500);
            }
            
        } catch (\Exception $e) {
            log_message('error', 'Error en CostumerType::update: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al actualizar tipo de cliente: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }
    
    /**
     * DELETE /api/costumer-type/{id}
     * Eliminar un tipo de cliente
     */
    public function delete($id = null)
    {
        try {
            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID de tipo de cliente requerido'
                ])->setStatusCode(400);
            }
            
            // Verificar si el tipo de cliente existe
            $existingType = $this->costumerTypeModel->find($id);
            if (!$existingType) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Tipo de cliente no encontrado'
                ])->setStatusCode(404);
            }
            
            // Eliminar tipo de cliente
            $deleted = $this->costumerTypeModel->delete($id);
            
            if ($deleted) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Tipo de cliente eliminado exitosamente'
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al eliminar tipo de cliente'
                ])->setStatusCode(500);
            }
            
        } catch (\Exception $e) {
            log_message('error', 'Error en CostumerType::delete: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al eliminar tipo de cliente: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }
    
    /**
     * PATCH /api/costumer-type/{id}/toggle-status
     * Cambiar estado del tipo de cliente
     */
    public function toggleStatus($id = null)
    {
        try {
            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID de tipo de cliente requerido'
                ])->setStatusCode(400);
            }
            
            // Verificar si el tipo de cliente existe
            $existingType = $this->costumerTypeModel->find($id);
            if (!$existingType) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Tipo de cliente no encontrado'
                ])->setStatusCode(404);
            }
            
            // Cambiar estado
            $newStatus = $existingType['Enabled'] == 1 ? 0 : 1;
            $updated = $this->costumerTypeModel->update($id, [
                'Enabled' => $newStatus,
                'UpdateDate' => date('Y-m-d H:i:s'),
                'IdLastUserUpdate' => session()->get('user_id') ?? 0
            ]);
            
            if ($updated) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Estado del tipo de cliente cambiado exitosamente',
                    'data' => ['enabled' => $newStatus]
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al cambiar estado del tipo de cliente'
                ])->setStatusCode(500);
            }
            
        } catch (\Exception $e) {
            log_message('error', 'Error en CostumerType::toggleStatus: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al cambiar estado del tipo de cliente: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }
    
    /**
     * GET /api/costumer-type/search
     * Buscar tipos de cliente
     */
    public function search()
    {
        try {
            $query = $this->request->getGet('q');
            
            if (!$query) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Término de búsqueda requerido'
                ])->setStatusCode(400);
            }
            
            $costumerTypes = $this->costumerTypeModel
                ->like('Name', $query)
                ->orderBy('Name', 'ASC')
                ->findAll();
            
            return $this->response->setJSON([
                'success' => true,
                'message' => 'Búsqueda realizada exitosamente',
                'data' => [
                    'costumer_types' => $costumerTypes,
                    'count' => count($costumerTypes),
                    'query' => $query
                ]
            ]);
            
        } catch (\Exception $e) {
            log_message('error', 'Error en CostumerType::search: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error en la búsqueda: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }
    
    /**
     * GET /api/costumer-type/stats
     * Obtener estadísticas de tipos de cliente
     */
    public function stats()
    {
        try {
            $totalTypes = $this->costumerTypeModel->countAllResults();
            $activeTypes = $this->costumerTypeModel->where('Enabled', 1)->countAllResults();
            $inactiveTypes = $this->costumerTypeModel->where('Enabled', 0)->countAllResults();
            
            return $this->response->setJSON([
                'success' => true,
                'message' => 'Estadísticas obtenidas exitosamente',
                'data' => [
                    'total_types' => $totalTypes,
                    'active_types' => $activeTypes,
                    'inactive_types' => $inactiveTypes
                ]
            ]);
            
        } catch (\Exception $e) {
            log_message('error', 'Error en CostumerType::stats: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener estadísticas: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/costumer-type/active
     * Obtener tipos de cliente activos (para selects/dropdowns)
     */
    public function active()
    {
        try {
            $costumerTypes = $this->costumerTypeModel->getActiveCostumerTypes();

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Tipos de cliente activos obtenidos exitosamente',
                'data' => $costumerTypes
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en CostumerType::active: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener tipos de cliente activos: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }
}
