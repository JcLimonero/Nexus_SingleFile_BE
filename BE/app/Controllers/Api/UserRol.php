<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\UserRolModel;
use CodeIgniter\HTTP\ResponseInterface;

class UserRol extends BaseController
{
    protected $userRolModel;

    public function __construct()
    {
        $this->userRolModel = new UserRolModel();
    }

    /**
     * Listar todos los roles con paginación y filtros
     */
    public function index()
    {
        try {
            $page = $this->request->getGet('page') ?? 1;
            $limit = $this->request->getGet('limit') ?? null;
            $enabled = $this->request->getGet('enabled');
            $search = $this->request->getGet('search');
            $sortBy = $this->request->getGet('sort_by') ?? 'name';
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
            $builder = $db->table('user_role ur');
            
            $builder->select('ur.id, ur.name, ur.enabled, ur.registration_date, ur.update_date');

            // Aplicar filtros
            if ($enabled !== null && $enabled !== '') {
                $builder->where('ur.enabled', $enabled);
            }

            if ($search) {
                $builder->like('ur.name', $search);
            }

            // Aplicar ordenamiento
            $builder->orderBy("ur.$sortBy", $sortOrder);

            // Obtener total de registros
            $total = $builder->countAllResults(false);

            // Obtener datos paginados o todos los registros
            if ($limit !== null) {
                $roles = $builder->limit($limit, $offset)->get()->getResultArray();
            } else {
                $roles = $builder->get()->getResultArray();
            }

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Roles obtenidos exitosamente',
                'data' => [
                    'roles' => $roles,
                    'total' => $total,
                    'limit' => $limit ?? 'all',
                    'offset' => $offset,
                    'count' => count($roles),
                    'sort_by' => $sortBy,
                    'sort_order' => $sortOrder,
                    'filter_enabled' => $enabled
                ]
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en UserRol::index: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener roles: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Crear un nuevo rol
     */
    public function create()
    {
        try {
            $data = $this->request->getJSON(true);

            // Validar campos requeridos
            if (empty($data['Name'])) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El nombre del rol es requerido'
                ])->setStatusCode(400);
            }

            // Verificar si el nombre ya existe
            $existingRole = $this->userRolModel->where('name', $data['Name'] ?? $data['name'] ?? '')->first();
            if ($existingRole) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Ya existe un rol con este nombre'
                ])->setStatusCode(400);
            }

            $insertData = [
                'name' => trim($data['Name'] ?? $data['name'] ?? ''),
                'enabled' => $data['Enabled'] ?? $data['enabled'] ?? 1,
                'registration_date' => date('Y-m-d H:i:s'),
                'update_date' => date('Y-m-d H:i:s')
            ];
            $roleId = $this->userRolModel->insert($insertData);

            if ($roleId) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Rol creado exitosamente',
                    'data' => ['id' => $roleId]
                ])->setStatusCode(201);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al crear rol'
                ])->setStatusCode(500);
            }

        } catch (\Exception $e) {
            log_message('error', 'Error en UserRol::create: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al crear rol: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Mostrar un rol específico
     */
    public function show($id = null)
    {
        try {
            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID de rol requerido'
                ])->setStatusCode(400);
            }

            $role = $this->userRolModel->find($id);

            if (!$role) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Rol no encontrado'
                ])->setStatusCode(404);
            }

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Rol obtenido exitosamente',
                'data' => $role
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en UserRol::show: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener rol: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Actualizar un rol
     */
    public function update($id = null)
    {
        try {
            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID de rol requerido'
                ])->setStatusCode(400);
            }

            $data = $this->request->getJSON(true);

            // Verificar si el rol existe
            $existingRole = $this->userRolModel->find($id);
            if (!$existingRole) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Rol no encontrado'
                ])->setStatusCode(404);
            }

            // Verificar nombre único (si se está cambiando)
            $newName = $data['Name'] ?? $data['name'] ?? null;
            $existingName = $existingRole['name'] ?? $existingRole['Name'] ?? null;
            if ($newName !== null && $newName !== $existingName) {
                $duplicateRole = $this->userRolModel->where('name', $newName)->where('id !=', $id)->first();
                if ($duplicateRole) {
                    return $this->response->setJSON([
                        'success' => false,
                        'message' => 'Ya existe un rol con este nombre'
                    ])->setStatusCode(400);
                }
            }

            $updateData = [];
            if (isset($data['Name']) || isset($data['name'])) {
                $updateData['name'] = trim($data['Name'] ?? $data['name'] ?? '');
            }
            if (isset($data['Enabled']) || isset($data['enabled'])) {
                $updateData['enabled'] = (int)($data['Enabled'] ?? $data['enabled'] ?? 1);
            }
            $updateData['update_date'] = date('Y-m-d H:i:s');

            $updated = $this->userRolModel->update($id, $updateData);

            if ($updated) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Rol actualizado exitosamente'
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al actualizar rol'
                ])->setStatusCode(500);
            }

        } catch (\Exception $e) {
            log_message('error', 'Error en UserRol::update: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al actualizar rol: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Eliminar un rol
     */
    public function delete($id = null)
    {
        try {
            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID de rol requerido'
                ])->setStatusCode(400);
            }

            // Verificar si el rol existe
            $existingRole = $this->userRolModel->find($id);
            if (!$existingRole) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Rol no encontrado'
                ])->setStatusCode(404);
            }

            // Verificar si el rol está siendo usado por algún usuario
            if ($this->userRolModel->isRoleInUse($id)) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'No se puede eliminar el rol porque está siendo usado por uno o más usuarios'
                ])->setStatusCode(400);
            }

            // Eliminar rol
            $deleted = $this->userRolModel->delete($id);

            if ($deleted) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Rol eliminado exitosamente'
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al eliminar rol'
                ])->setStatusCode(500);
            }

        } catch (\Exception $e) {
            log_message('error', 'Error en UserRol::delete: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al eliminar rol: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Cambiar estado del rol (activar/desactivar)
     */
    public function toggleStatus($id = null)
    {
        try {
            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID de rol requerido'
                ])->setStatusCode(400);
            }

            // Verificar si el rol existe
            $existingRole = $this->userRolModel->find($id);
            if (!$existingRole) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Rol no encontrado'
                ])->setStatusCode(404);
            }

            // Cambiar estado
            $currentEnabled = $existingRole['enabled'] ?? $existingRole['Enabled'] ?? 0;
            $newStatus = $currentEnabled == 1 ? 0 : 1;
            $updated = $this->userRolModel->update($id, [
                'enabled' => $newStatus,
                'update_date' => date('Y-m-d H:i:s')
            ]);

            if ($updated) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Estado del rol cambiado exitosamente',
                    'data' => ['enabled' => $newStatus]
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al cambiar estado del rol'
                ])->setStatusCode(500);
            }

        } catch (\Exception $e) {
            log_message('error', 'Error en UserRol::toggleStatus: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al cambiar estado del rol: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Buscar roles
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

            $roles = $this->userRolModel
                ->like('name', $query)
                ->orderBy('name', 'ASC')
                ->findAll();

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Búsqueda realizada exitosamente',
                'data' => [
                    'roles' => $roles,
                    'count' => count($roles),
                    'query' => $query
                ]
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en UserRol::search: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error en la búsqueda: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Obtener estadísticas de roles
     */
    public function stats()
    {
        try {
            $totalRoles = $this->userRolModel->countAllResults();
            $activeRoles = $this->userRolModel->where('enabled', 1)->countAllResults();
            $inactiveRoles = $this->userRolModel->where('enabled', 0)->countAllResults();

            // Contar usuarios por rol
            $db = \Config\Database::connect();
            $rolesWithUserCount = $db->query("
                SELECT ur.id, ur.name, ur.enabled, COUNT(u.id) as UserCount
                FROM user_role ur
                LEFT JOIN user u ON u.id_user_rol = ur.id
                GROUP BY ur.id, ur.name, ur.enabled
                ORDER BY UserCount DESC, ur.name ASC
            ")->getResultArray();

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Estadísticas obtenidas exitosamente',
                'data' => [
                    'total_roles' => $totalRoles,
                    'active_roles' => $activeRoles,
                    'inactive_roles' => $inactiveRoles,
                    'roles_with_user_count' => $rolesWithUserCount
                ]
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en UserRol::stats: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener estadísticas: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Obtener roles activos (para selects/dropdowns)
     */
    public function active()
    {
        try {
            $roles = $this->userRolModel->getActiveRoles();

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Roles activos obtenidos exitosamente',
                'data' => $roles
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en UserRol::active: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener roles activos: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }
}
