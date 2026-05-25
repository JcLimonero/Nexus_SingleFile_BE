<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\UserModel;
use App\Traits\SnakeKeys;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

class User extends BaseController
{
    use SnakeKeys;

    protected $userModel;

    public function __construct()
    {
        $this->userModel = new UserModel();
    }

    /**
     * Listar todos los usuarios con paginación y filtros
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

            // Construir la consulta - versión simplificada para debugging
            $db = \Config\Database::connect();
            $builder = $db->table('user u');
            
            $builder->select('u.id, u.name, u.user, u.mail, u.enabled, u.id_user_role, u.default_agency, u.registration_date, u.update_date, u.id_last_user_update, ur.name as LastUserUpdateName, a.name as AgencyName')
                ->join('user ur', 'ur.id = u.id_last_user_update', 'left')
                ->join('agency a', 'a.id = u.default_agency', 'left');

            // Aplicar filtros
            if ($enabled !== null && $enabled !== '') {
                $builder->where('u.enabled', $enabled);
            }

            if ($search) {
                $builder->groupStart()
                    ->like('u.name', $search)
                    ->orLike('u.user', $search)
                    ->orLike('u.mail', $search)
                    ->groupEnd();
            }

            // Aplicar ordenamiento (mapear PascalCase a snake_case)
            $sortFieldMap = [
                'Name' => 'name',
                'User' => 'username',
                'Mail' => 'email',
                'RegistrationDate' => 'registration_date',
                'UpdateDate' => 'update_date'
            ];
            $sortField = $sortFieldMap[$sortBy] ?? $sortBy;
            
            // Validar que el campo sea seguro (solo permitir campos válidos)
            $allowedFields = ['id', 'name', 'username', 'mail', 'enabled', 'id_user_role', 'default_agency', 'registration_date', 'update_date'];
            if (!in_array($sortField, $allowedFields)) {
                $sortField = 'name';
            }
            
            // Obtener total de registros antes de aplicar límite
            $total = $builder->countAllResults(false);
            
            // Reconstruir el builder para obtener los datos
            $builder = $db->table('user u');
            $builder->select('u.id, u.name, u.user, u.mail, u.enabled, u.id_user_role, u.default_agency, u.registration_date, u.update_date, u.id_last_user_update, ur.name as LastUserUpdateName, a.name as AgencyName')
                ->join('user ur', 'ur.id = u.id_last_user_update', 'left')
                ->join('agency a', 'a.id = u.default_agency', 'left');
            
            // Aplicar filtros nuevamente
            if ($enabled !== null && $enabled !== '') {
                $builder->where('u.enabled', $enabled);
            }
            if ($search) {
                $builder->groupStart()
                    ->like('u.name', $search)
                    ->orLike('u.user', $search)
                    ->orLike('u.mail', $search)
                    ->groupEnd();
            }
            
            // Aplicar ordenamiento
            $builder->orderBy("u.$sortField", $sortOrder);

            // Obtener datos paginados o todos los registros
            if ($limit !== null) {
                $users = $builder->limit($limit, $offset)->get()->getResultArray();
            } else {
                $users = $builder->get()->getResultArray();
            }

            return $this->response->setJSON($this->snakeKeys([
                'success' => true,
                'message' => 'Usuarios obtenidos exitosamente',
                'data' => [
                    'users' => $users,
                    'total' => $total,
                    'limit' => $limit ?? 'all',
                    'offset' => $offset,
                    'count' => count($users),
                    'sort_by' => $sortBy,
                    'sort_order' => $sortOrder,
                    'filter_enabled' => $enabled
                ]
            ]));

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener usuarios: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Crear un nuevo usuario (solo admin).
     */
    public function create()
    {
        if ($r = $this->requireAdmin()) return $r;

        try {
            $data = $this->request->getJSON(true);

            // Validar campos requeridos (compatibilidad con PascalCase y snake_case)
            $requiredFields = [
                'name' => ['name', 'Name'],
                'user' => ['username', 'User'],
                'email' => ['email', 'Mail'],
                'pass' => ['pass', 'Pass'],
                'id_user_role' => ['id_user_role', 'IdUserRole'],
                'default_agency' => ['default_agency', 'DefaultAgency']
            ];
            
            foreach ($requiredFields as $fieldKey => $fieldVariants) {
                $hasValue = false;
                foreach ($fieldVariants as $variant) {
                    if (!empty($data[$variant])) {
                        $hasValue = true;
                        break;
                    }
                }
                if (!$hasValue) {
                    return $this->response->setJSON([
                        'success' => false,
                        'message' => "El campo {$fieldVariants[1]} es requerido"
                    ])->setStatusCode(400);
                }
            }

            // Verificar si el username ya existe
            $existingUser = $this->userModel->where('username', $data['user'] ?? $data['User'] ?? null)->first();
            if ($existingUser) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El nombre de usuario ya existe'
                ])->setStatusCode(400);
            }

            // Verificar si el email ya existe
            $existingEmail = $this->userModel->where('email', $data['email'] ?? $data['email'] ?? null)->first();
            if ($existingEmail) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El correo electrónico ya existe'
                ])->setStatusCode(400);
            }

            // Generar el siguiente ID manualmente (snake_case)
            $db = \Config\Database::connect();
            $maxIdQuery = $db->query("SELECT MAX(id) as max_id FROM user");
            $maxIdResult = $maxIdQuery->getRow();
            $nextId = ($maxIdResult->max_id ?? 0) + 1;
            
            // Preparar datos para inserción (mapear PascalCase a snake_case)
            $userData = [
                'id' => $nextId,
                'name' => trim($data['Name'] ?? $data['name'] ?? ''),
                'user' => trim($data['User'] ?? $data['user'] ?? ''),
                'email' => trim($data['email'] ?? $data['email'] ?? ''),
                'id_user_role' => isset($data['IdUserRole']) ? (int)$data['IdUserRole'] : (isset($data['id_user_role']) ? (int)$data['id_user_role'] : 0),
                'default_agency' => isset($data['DefaultAgency']) ? (int)$data['DefaultAgency'] : (isset($data['default_agency']) ? (int)$data['default_agency'] : 0),
                'enabled' => isset($data['Enabled']) ? (int)$data['Enabled'] : (isset($data['enabled']) ? (int)$data['enabled'] : 1),
                'registration_date' => date('Y-m-d H:i:s'),
                'update_date' => date('Y-m-d H:i:s'),
                'id_last_user_update' => $this->getCurrentUserId() ?? 0
            ];
            
            // Hash de la contraseña
            $passValue = $data['Pass'] ?? $data['pass'] ?? '';
            if (!empty($passValue)) {
                $userData['pass'] = password_hash($passValue, PASSWORD_DEFAULT);
                $userData['password_migrated'] = 1;
            }
            
            $data = $userData;

            // Insertar usuario
            $userId = $this->userModel->insert($data);

            if ($userId) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Usuario creado exitosamente',
                    'data' => ['id' => $userId]
                ])->setStatusCode(201);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al crear usuario'
                ])->setStatusCode(500);
            }

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al crear usuario: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Mostrar un usuario específico
     */
    public function show($id = null)
    {
        try {
            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID de usuario requerido'
                ])->setStatusCode(400);
            }

            $db = \Config\Database::connect();
            $builder = $db->table('user u');
            
            $user = $builder
                ->select('u.id, u.name, u.user, u.mail, u.enabled, u.id_user_role, u.default_agency, u.registration_date, u.update_date, u.id_last_user_update, ur.name as LastUserUpdateName, a.name as AgencyName')
                ->join('user ur', 'ur.id = u.id_last_user_update', 'left')
                ->join('agency a', 'a.id = u.default_agency', 'left')
                ->where('u.id', $id)
                ->get()
                ->getRowArray();

            if (!$user) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Usuario no encontrado'
                ])->setStatusCode(404);
            }

            return $this->response->setJSON($this->snakeKeys([
                'success' => true,
                'message' => 'Usuario obtenido exitosamente',
                'data' => $user
            ]));

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener usuario: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Actualizar un usuario.
     * Cualquier usuario puede actualizar SUS propios datos básicos (name, mail).
     * Solo admin puede tocar role_id / enabled / default_agency de otros usuarios.
     */
    public function update($id = null)
    {
        try {
            $authUserId = $this->getCurrentUserId();
            if (!$authUserId) {
                return $this->response->setStatusCode(401)->setJSON(['success' => false, 'message' => 'No autenticado']);
            }

            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID de usuario requerido'
                ])->setStatusCode(400);
            }

            $isSelfUpdate = ((int) $authUserId === (int) $id);
            if (!$isSelfUpdate && !$this->isCurrentUserAdmin()) {
                return $this->response->setStatusCode(403)->setJSON([
                    'success' => false,
                    'message' => 'Solo admin puede modificar a otros usuarios'
                ]);
            }

            $data = $this->request->getJSON(true);

            // Si no es admin, sanitiza campos sensibles que NO puede tocar en su propio perfil
            if (!$this->isCurrentUserAdmin()) {
                foreach (['id_user_role', 'IdUserRole', 'enabled', 'Enabled', 'default_agency', 'DefaultAgency'] as $k) {
                    unset($data[$k]);
                }
            }

            // Verificar si el usuario existe (asegurar que incluye id)
            $existingUser = $this->userModel->select('id, name, user, mail, pass, enabled, id_user_role, default_agency, registration_date, update_date')->find($id);
            $existingUserId = $existingUser['id'] ?? $existingUser['Id'] ?? null;
            if (!$existingUser || !isset($existingUserId)) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Usuario no encontrado'
                ])->setStatusCode(404);
            }

            // Verificar username único (si se está cambiando)
            $userValue = $data['user'] ?? $data['User'] ?? null;
            $existingUserValue = $existingUser['user'] ?? $existingUser['User'] ?? null;
            if (isset($userValue) && $userValue !== $existingUserValue) {
                $duplicateUser = $this->userModel->where('username', $userValue)->where('id !=', $id)->first();
                if ($duplicateUser) {
                    return $this->response->setJSON([
                        'success' => false,
                        'message' => 'El nombre de usuario ya existe'
                    ])->setStatusCode(400);
                }
            }

            // Verificar email único (si se está cambiando)
            $mailValue = $data['email'] ?? $data['email'] ?? null;
            $existingMailValue = $existingUser['email'] ?? $existingUser['Mail'] ?? null;
            if (isset($mailValue) && $mailValue !== $existingMailValue) {
                $duplicateEmail = $this->userModel->where('email', $mailValue)->where('id !=', $id)->first();
                if ($duplicateEmail) {
                    return $this->response->setJSON([
                        'success' => false,
                        'message' => 'El correo electrónico ya existe'
                    ])->setStatusCode(400);
                }
            }

            // Preparar datos para actualización (mapear PascalCase a snake_case)
            $updateData = [];
            
            if (isset($data['Name']) || isset($data['name'])) {
                $updateData['name'] = trim($data['Name'] ?? $data['name'] ?? '');
            }
            if (isset($data['User']) || isset($data['user'])) {
                $updateData['user'] = trim($data['User'] ?? $data['user'] ?? '');
            }
            if (isset($data['email']) || isset($data['email'])) {
                $updateData['email'] = trim($data['email'] ?? $data['email'] ?? '');
            }
            if (isset($data['Pass']) || isset($data['pass'])) {
                $passValue = $data['Pass'] ?? $data['pass'] ?? null;
                if (!empty($passValue)) {
                    $updateData['pass'] = password_hash($passValue, PASSWORD_DEFAULT);
                    $updateData['password_migrated'] = 1;
                }
            }
            if (isset($data['Enabled']) || isset($data['enabled'])) {
                $updateData['enabled'] = isset($data['Enabled']) ? (int)$data['Enabled'] : (int)$data['enabled'];
            }
            if (isset($data['IdUserRole']) || isset($data['id_user_role'])) {
                $updateData['id_user_role'] = isset($data['IdUserRole']) ? (int)$data['IdUserRole'] : (int)$data['id_user_role'];
            }
            if (isset($data['DefaultAgency']) || isset($data['default_agency'])) {
                $updateData['default_agency'] = isset($data['DefaultAgency']) ? (int)$data['DefaultAgency'] : (int)$data['default_agency'];
            }
            
            $updateData['update_date'] = date('Y-m-d H:i:s');
            $updateData['id_last_user_update'] = $this->getCurrentUserId() ?? 0;

            // Actualizar usuario
            $updated = $this->userModel->update($id, $updateData);

            if ($updated) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Usuario actualizado exitosamente'
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al actualizar usuario'
                ])->setStatusCode(500);
            }

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al actualizar usuario: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Lógica interna para verificar si un usuario puede eliminarse
     * @return array ['canDelete' => bool, 'relations' => string[]]
     */
    private function checkUserCanDelete($userId): array
    {
        $db = \Config\Database::connect();
        $relations = [];

        // Agencias asignadas (agency_user FK)
        if ($db->tableExists('agency_user')) {
            $agencyCount = $db->table('agency_user')->where('id_user', $userId)->countAllResults();
            if ($agencyCount > 0) {
                $relations[] = 'agencias asignadas';
            }
        }

        // Procesos asignados (process_user FK)
        if ($db->tableExists('sale_type_user')) {
            $processCount = $db->table('sale_type_user')->where('id_user', $userId)->countAllResults();
            if ($processCount > 0) {
                $relations[] = 'procesos asignados';
            }
        }

        // Expedientes: como vendedor (id_seller) o último actualizador (id_last_user_update)
        $expedientCount = $db->table('expedient')
            ->where('id_seller', $userId)
            ->orWhere('id_last_user_update', $userId)
            ->countAllResults();
        if ($expedientCount > 0) {
            $relations[] = 'expedientes';
        }

        // Documentos: último actualizador
        $docCount = $db->table('file_document')
            ->where('id_last_user_update', $userId)
            ->countAllResults();
        if ($docCount > 0) {
            $relations[] = 'documentos';
        }

        // Órdenes: último actualizador
        if ($db->tableExists('order')) {
            $orderCount = $db->table('order')
                ->where('id_last_user_update', $userId)
                ->countAllResults();
            if ($orderCount > 0) {
                $relations[] = 'órdenes';
            }
        }

        // Registros en user como id_last_user_update
        $userAsUpdater = $db->table('user')->where('id_last_user_update', $userId)->countAllResults();
        if ($userAsUpdater > 0) {
            $relations[] = 'registros de usuario';
        }

        return ['canDelete' => empty($relations), 'relations' => $relations];
    }

    /**
     * Verificar si un usuario puede eliminarse (no tiene relaciones que lo impidan)
     * GET /api/user/{id}/can-delete
     * Retorna: { success, canDelete, relations: ['expedientes', 'documentos', ...] }
     */
    public function canDelete($id = null)
    {
        try {
            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID de usuario requerido'
                ])->setStatusCode(400);
            }

            $existingUser = $this->userModel->select('id')->find($id);
            $userId = $existingUser['id'] ?? $existingUser['Id'] ?? null;
            if (!$existingUser || $userId === null) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Usuario no encontrado',
                    'canDelete' => false,
                    'relations' => []
                ])->setStatusCode(404);
            }

            $result = $this->checkUserCanDelete($userId);

            return $this->response->setJSON([
                'success' => true,
                'canDelete' => $result['canDelete'],
                'relations' => $result['relations']
            ]);
        } catch (\Exception $e) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al verificar: ' . $e->getMessage(),
                'canDelete' => false,
                'relations' => []
            ])->setStatusCode(500);
        }
    }

    /**
     * Deshabilitar un usuario (enabled = 0) — solo admin.
     * PATCH /api/user/{id}/disable
     */
    public function disable($id = null)
    {
        if ($r = $this->requireAdmin()) return $r;

        try {
            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID de usuario requerido'
                ])->setStatusCode(400);
            }

            $existingUser = $this->userModel->select('id, enabled')->find($id);
            $userId = $existingUser['id'] ?? $existingUser['Id'] ?? null;
            if (!$existingUser || $userId === null) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Usuario no encontrado'
                ])->setStatusCode(404);
            }

            $updated = $this->userModel->update($id, [
                'id' => $id,
                'enabled' => '0',
                'update_date' => date('Y-m-d H:i:s')
            ]);

            if ($updated) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Usuario deshabilitado exitosamente',
                    'data' => ['enabled' => '0']
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al deshabilitar usuario'
                ])->setStatusCode(500);
            }
        } catch (\Exception $e) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al deshabilitar usuario: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Eliminar un usuario (solo admin).
     */
    public function delete($id = null)
    {
        if ($r = $this->requireAdmin()) return $r;

        try {
            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID de usuario requerido'
                ])->setStatusCode(400);
            }

            // Verificar si el usuario existe (incluyendo Id explícitamente)
            $existingUser = $this->userModel->select('id')->find($id);
            $userId = $existingUser['id'] ?? $existingUser['Id'] ?? null;
            if (!$existingUser || $userId === null) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Usuario no encontrado'
                ])->setStatusCode(404);
            }

            // Verificar que no tenga relaciones antes de eliminar
            $checkResult = $this->checkUserCanDelete($userId);
            if (!$checkResult['canDelete']) {
                $relations = $checkResult['relations'];
                $relationsText = implode(', ', $relations);
                return $this->response->setJSON([
                    'success' => false,
                    'message' => "No se puede eliminar el usuario porque tiene {$relationsText}. Considere deshabilitarlo en su lugar."
                ])->setStatusCode(400);
            }

            // Eliminar usuario
            $deleted = $this->userModel->delete($id);

            if ($deleted) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Usuario eliminado exitosamente'
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al eliminar usuario'
                ])->setStatusCode(500);
            }

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al eliminar usuario: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Cambiar estado del usuario (activar/desactivar)
     */
    public function toggleStatus($id = null)
    {
        try {
            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID de usuario requerido'
                ])->setStatusCode(400);
            }

            // Verificar si el usuario existe (incluyendo id explícitamente)
            $existingUser = $this->userModel->select('id, enabled')->find($id);
            $userId = $existingUser['id'] ?? $existingUser['Id'] ?? null;
            if (!$existingUser || $userId === null) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Usuario no encontrado'
                ])->setStatusCode(404);
            }

            // Cambiar estado
            $newStatus = ($existingUser['enabled'] ?? $existingUser['Enabled'] ?? '0') === '1' ? '0' : '1';
            $updated = $this->userModel->update($id, [
                'id' => $id,
                'enabled' => $newStatus,
                'update_date' => date('Y-m-d H:i:s')
            ]);

            if ($updated) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Estado del usuario cambiado exitosamente',
                    'data' => ['enabled' => $newStatus]
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al cambiar estado del usuario'
                ])->setStatusCode(500);
            }

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al cambiar estado del usuario: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Cambiar contraseña del usuario
     */
    public function changePassword($id = null)
    {
        try {
            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID de usuario requerido'
                ])->setStatusCode(400);
            }

            $data = $this->request->getJSON(true);
            $newPassword = $data['new_password'] ?? null;

            if (!$newPassword) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Nueva contraseña requerida'
                ])->setStatusCode(400);
            }

            // Verificar si el usuario existe (incluyendo Id explícitamente)
            $existingUser = $this->userModel->select('id, name, user, mail, enabled')->find($id);
            $userId = $existingUser['id'] ?? $existingUser['Id'] ?? null;
            if (!$existingUser || $userId === null) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Usuario no encontrado'
                ])->setStatusCode(404);
            }

            // Hash de la nueva contraseña
            $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

            // Actualizar contraseña (incluyendo Id en los datos)
            $updated = $this->userModel->update($id, [
                'id' => $id,
                'pass' => $hashedPassword,
                'password_migrated' => 1,
                'update_date' => date('Y-m-d H:i:s')
            ]);

            if ($updated) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Contraseña cambiada exitosamente'
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al cambiar contraseña'
                ])->setStatusCode(500);
            }

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al cambiar contraseña: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Resetear contraseña del usuario
     */
    public function resetPassword($id = null)
    {
        try {
            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID de usuario requerido'
                ])->setStatusCode(400);
            }

            // Verificar si el usuario existe (incluyendo Id explícitamente)
            $existingUser = $this->userModel->select('id, name, user, mail, enabled')->find($id);
            $userId = $existingUser['id'] ?? $existingUser['Id'] ?? null;
            if (!$existingUser || $userId === null) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Usuario no encontrado'
                ])->setStatusCode(404);
            }

            // Generar contraseña temporal
            $tempPassword = bin2hex(random_bytes(8));
            $hashedPassword = password_hash($tempPassword, PASSWORD_DEFAULT);

            // Actualizar contraseña (incluyendo Id en los datos)
            $updated = $this->userModel->update($id, [
                'id' => $id,
                'pass' => $hashedPassword,
                'password_migrated' => 1,
                'update_date' => date('Y-m-d H:i:s')
            ]);

            if ($updated) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Contraseña reseteada exitosamente',
                    'data' => ['temp_password' => $tempPassword]
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al resetear contraseña'
                ])->setStatusCode(500);
            }

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al resetear contraseña: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Buscar usuarios
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

            $db = \Config\Database::connect();
            $builder = $db->table('user u');
            
            $users = $builder
                ->select('u.id, u.name, u.user, u.mail, u.enabled, u.id_user_role, u.default_agency, a.name as AgencyName')
                ->join('agency a', 'a.id = u.default_agency', 'left')
                ->groupStart()
                    ->like('u.name', $query)
                    ->orLike('u.user', $query)
                    ->orLike('u.mail', $query)
                    ->groupEnd()
                ->orderBy('u.name', 'ASC')
                ->get()
                ->getResultArray();

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Búsqueda realizada exitosamente',
                'data' => [
                    'users' => $users,
                    'count' => count($users),
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
     * Obtener estadísticas de usuarios
     */
    public function stats()
    {
        try {
            $totalUsers = $this->userModel->countAllResults();
            $activeUsers = $this->userModel->where('enabled', '1')->countAllResults();
            $inactiveUsers = $this->userModel->where('enabled', '0')->countAllResults();

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Estadísticas obtenidas exitosamente',
                'data' => [
                    'total_users' => $totalUsers,
                    'active_users' => $activeUsers,
                    'inactive_users' => $inactiveUsers
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
     * Verificar disponibilidad de username
     */
    public function checkUsernameAvailability()
    {
        try {
            $username = $this->request->getGet('username');
            
            if (!$username) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Username requerido'
                ])->setStatusCode(400);
            }

            $existingUser = $this->userModel->where('username', $username)->first();
            $available = !$existingUser;

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Verificación realizada exitosamente',
                'data' => [
                    'username' => $username,
                    'available' => $available
                ]
            ]);

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error en la verificación: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Verificar disponibilidad de email
     */
    public function checkEmailAvailability()
    {
        try {
            $email = $this->request->getGet('email');
            
            if (!$email) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Email requerido'
                ])->setStatusCode(400);
            }

            $existingUser = $this->userModel->where('email', $email)->first();
            $available = !$existingUser;

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Verificación realizada exitosamente',
                'data' => [
                    'email' => $email,
                    'available' => $available
                ]
            ]);

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error en la verificación: ' . $e->getMessage()
            ])->setStatusCode(500);
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
