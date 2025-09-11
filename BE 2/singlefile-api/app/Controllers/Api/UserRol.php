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
            $builder = $db->table('UserRol ur');
            
            $builder->select('ur.Id, ur.Name, ur.Enabled, ur.RegistrationDate, ur.UpdateDate');

            // Aplicar filtros
            if ($enabled !== null && $enabled !== '') {
                $builder->where('ur.Enabled', $enabled);
            }

            if ($search) {
                $builder->like('ur.Name', $search);
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
            $existingRole = $this->userRolModel->where('Name', $data['Name'])->first();
            if ($existingRole) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Ya existe un rol con este nombre'
                ])->setStatusCode(400);
            }

            $data['Enabled'] = $data['Enabled'] ?? 1;
            $data['RegistrationDate'] = date('Y-m-d H:i:s');
            $data['UpdateDate'] = date('Y-m-d H:i:s');

            // Insertar rol
            $roleId = $this->userRolModel->insert($data);

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
            if (isset($data['Name']) && $data['Name'] !== $existingRole['Name']) {
                $duplicateRole = $this->userRolModel->where('Name', $data['Name'])->where('Id !=', $id)->first();
                if ($duplicateRole) {
                    return $this->response->setJSON([
                        'success' => false,
                        'message' => 'Ya existe un rol con este nombre'
                    ])->setStatusCode(400);
                }
            }

            $data['UpdateDate'] = date('Y-m-d H:i:s');

            // Actualizar rol
            $updated = $this->userRolModel->update($id, $data);

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
            $newStatus = $existingRole['Enabled'] == 1 ? 0 : 1;
            $updated = $this->userRolModel->update($id, [
                'Enabled' => $newStatus,
                'UpdateDate' => date('Y-m-d H:i:s')
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
                ->like('Name', $query)
                ->orderBy('Name', 'ASC')
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
            $activeRoles = $this->userRolModel->where('Enabled', 1)->countAllResults();
            $inactiveRoles = $this->userRolModel->where('Enabled', 0)->countAllResults();

            // Contar usuarios por rol
            $db = \Config\Database::connect();
            $rolesWithUserCount = $db->query("
                SELECT ur.Id, ur.Name, ur.Enabled, COUNT(u.Id) as UserCount
                FROM UserRol ur
                LEFT JOIN User u ON u.IdUserRol = ur.Id
                GROUP BY ur.Id, ur.Name, ur.Enabled
                ORDER BY UserCount DESC, ur.Name ASC
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
