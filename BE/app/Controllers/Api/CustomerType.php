<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\CustomerTypeModel;
use CodeIgniter\HTTP\ResponseInterface;

class CustomerType extends BaseController
{
    protected $customerTypeModel;
    
    public function __construct()
    {
        $this->customerTypeModel = new CustomerTypeModel();
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

            // Validar campos permitidos para ordenamiento (snake_case)
            $sortFieldMap = ['Id' => 'id', 'Name' => 'name', 'Enabled' => 'enabled', 'RegistrationDate' => 'registration_date', 'UpdateDate' => 'update_date', 'IdLastUserUpdate' => 'id_last_user_update'];
            $sortField = $sortFieldMap[$sortBy] ?? 'name';

            // Validar orden
            $sortOrder = strtoupper($sortOrder) === 'DESC' ? 'DESC' : 'ASC';

            // Si no se especifica límite o es 0, obtener todos los registros
            if ($limit === null || $limit == 0 || $limit == 'all') {
                $limit = null;
                $offset = 0;
                $page = 1;
            } else {
                $limit = (int)$limit;
                $offset = ($page - 1) * $limit;
            }

            // Construir la consulta (snake_case)
            $db = \Config\Database::connect();
            $builder = $db->table('customer_type ct');
            
            $builder->select('ct.id, ct.name, ct.enabled, ct.registration_date, ct.update_date, ct.id_last_user_update, u.name as last_user_update_name')
                ->join('user u', 'u.id = ct.id_last_user_update', 'left');

            // Aplicar filtros
            if ($enabled !== null && $enabled !== '') {
                $builder->where('ct.enabled', $enabled);
            }

            if ($search) {
                $builder->like('ct.name', $search);
            }

            // Aplicar ordenamiento
            $builder->orderBy("ct.$sortField", $sortOrder);

            // Obtener total de registros
            $total = $builder->countAllResults(false);

            // Obtener datos paginados o todos los registros
            if ($limit !== null) {
                $customerTypes = $builder->limit($limit, $offset)->get()->getResultArray();
            } else {
                $customerTypes = $builder->get()->getResultArray();
            }

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Tipos de cliente obtenidos exitosamente',
                'data' => [
                    'costumer_types' => $customerTypes,
                    'total' => $total,
                    'limit' => $limit ?? 'all',
                    'offset' => $offset,
                    'count' => count($customerTypes),
                    'sort_by' => $sortBy,
                    'sort_order' => $sortOrder,
                    'filter_enabled' => $enabled
                ]
            ]);

        } catch (\Exception $e) {

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
            
            $name = $data['name'] ?? $data['Name'] ?? null;
            if (empty($name)) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El nombre del tipo de cliente es requerido'
                ])->setStatusCode(400);
            }
            
            $existingType = $this->customerTypeModel->where('name', $name)->first();
            if ($existingType) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Ya existe un tipo de cliente con este nombre'
                ])->setStatusCode(400);
            }

            $insertData = [
                'name' => trim($name),
                'enabled' => $data['enabled'] ?? $data['Enabled'] ?? 1,
                'registration_date' => date('Y-m-d H:i:s'),
                'update_date' => date('Y-m-d H:i:s'),
                'id_last_user_update' => session()->get('user_id') ?? 0
            ];
            
            $typeId = $this->customerTypeModel->insert($insertData);
            
            if ($typeId) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Tipo de cliente creado exitosamente',
                    'data' => ['id' => $typeId]
                ])->setStatusCode(201);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al crear tipo de cliente'
                ])->setStatusCode(500);
            }
            
        } catch (\Exception $e) {

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
            $builder = $db->table('customer_type ct');
            
            $customerType = $builder
                ->select('ct.id, ct.name, ct.enabled, ct.registration_date, ct.update_date, ct.id_last_user_update, u.name as last_user_update_name')
                ->join('user u', 'u.id = ct.id_last_user_update', 'left')
                ->where('ct.id', $id)
                ->get()
                ->getRowArray();
            
            if (!$customerType) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Tipo de cliente no encontrado'
                ])->setStatusCode(404);
            }
            
            return $this->response->setJSON([
                'success' => true,
                'message' => 'Tipo de cliente obtenido exitosamente',
                'data' => $customerType
            ]);
            
        } catch (\Exception $e) {

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
            $existingType = $this->customerTypeModel->find($id);
            if (!$existingType) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Tipo de cliente no encontrado'
                ])->setStatusCode(404);
            }
            
            // Verificar nombre único (si se está cambiando)
            $newName = $data['name'] ?? $data['Name'] ?? null;
            $existingName = $existingType['name'] ?? $existingType['Name'] ?? null;
            if ($newName !== null && $newName !== $existingName) {
                $duplicateType = $this->customerTypeModel->where('name', $newName)->where('id !=', $id)->first();
                if ($duplicateType) {
                    return $this->response->setJSON([
                        'success' => false,
                        'message' => 'Ya existe un tipo de cliente con este nombre'
                    ])->setStatusCode(400);
                }
            }
            
            $updatePayload = [
                'name' => $newName ?? $existingName,
                'enabled' => $data['enabled'] ?? $data['Enabled'] ?? $existingType['enabled'] ?? $existingType['Enabled'] ?? 1,
                'update_date' => date('Y-m-d H:i:s'),
                'id_last_user_update' => session()->get('user_id') ?? 0
            ];
            
            // Actualizar tipo de cliente (snake_case)
            $updated = $this->customerTypeModel->update($id, $updatePayload);
            
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
            $existingType = $this->customerTypeModel->find($id);
            if (!$existingType) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Tipo de cliente no encontrado'
                ])->setStatusCode(404);
            }
            
            // Eliminar tipo de cliente
            $deleted = $this->customerTypeModel->delete($id);
            
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
            $existingType = $this->customerTypeModel->find($id);
            if (!$existingType) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Tipo de cliente no encontrado'
                ])->setStatusCode(404);
            }
            
            // Cambiar estado (snake_case)
            $enabled = $existingType['enabled'] ?? $existingType['Enabled'] ?? 1;
            $newStatus = $enabled == 1 ? 0 : 1;
            $updated = $this->customerTypeModel->update($id, [
                'enabled' => $newStatus,
                'update_date' => date('Y-m-d H:i:s'),
                'id_last_user_update' => session()->get('user_id') ?? 0
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
            
            $customerTypes = $this->customerTypeModel
                ->like('name', $query)
                ->orderBy('name', 'ASC')
                ->findAll();
            
            return $this->response->setJSON([
                'success' => true,
                'message' => 'Búsqueda realizada exitosamente',
                'data' => [
                    'costumer_types' => $customerTypes,
                    'count' => count($customerTypes),
                    'query' => $query
                ]
            ]);
            
        } catch (\Exception $e) {

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
            $totalTypes = $this->customerTypeModel->countAllResults();
            $activeTypes = $this->customerTypeModel->where('enabled', 1)->countAllResults();
            $inactiveTypes = $this->customerTypeModel->where('enabled', 0)->countAllResults();
            
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
            $customerTypes = $this->customerTypeModel->getActiveCustomerTypes();

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Tipos de cliente activos obtenidos exitosamente',
                'data' => $customerTypes
            ]);

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener tipos de cliente activos: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }
}
