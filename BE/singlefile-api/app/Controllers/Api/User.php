<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\UserModel;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

class User extends BaseController
{
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

            // Construir la consulta - versión simplificada para debugging
            $db = \Config\Database::connect();
            $builder = $db->table('User u');
            
            $builder->select('u.Id, u.Name, u.User, u.Mail, u.Enabled, u.IdUserRol, u.DefaultAgency, u.RegistrationDate, u.UpdateDate, u.IdLastUserUpdate, ur.Name as LastUserUpdateName')
                ->join('User ur', 'ur.Id = u.IdLastUserUpdate', 'left');

            // Aplicar filtros
            if ($enabled !== null && $enabled !== '') {
                $builder->where('u.Enabled', $enabled);
            }

            if ($search) {
                $builder->groupStart()
                    ->like('u.Name', $search)
                    ->orLike('u.User', $search)
                    ->orLike('u.Mail', $search)
                ->groupEnd();
            }

            // Aplicar ordenamiento
            $builder->orderBy("u.$sortBy", $sortOrder);

            // Obtener total de registros
            $total = $builder->countAllResults(false);

            // Obtener datos paginados o todos los registros
            if ($limit !== null) {
                $users = $builder->limit($limit, $offset)->get()->getResultArray();
            } else {
                $users = $builder->get()->getResultArray();
            }

            return $this->response->setJSON([
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
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en User::index: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener usuarios: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Crear un nuevo usuario
     */
    public function create()
    {
        try {
            $data = $this->request->getJSON(true);

            // Validar campos requeridos
            $requiredFields = ['Name', 'User', 'Mail', 'Pass', 'IdUserRol', 'DefaultAgency'];
            foreach ($requiredFields as $field) {
                if (empty($data[$field])) {
                    return $this->response->setJSON([
                        'success' => false,
                        'message' => "El campo $field es requerido"
                    ])->setStatusCode(400);
                }
            }

            // Verificar si el username ya existe
            $existingUser = $this->userModel->where('User', $data['User'])->first();
            if ($existingUser) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El nombre de usuario ya existe'
                ])->setStatusCode(400);
            }

            // Verificar si el email ya existe
            $existingEmail = $this->userModel->where('Mail', $data['Mail'])->first();
            if ($existingEmail) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El correo electrónico ya existe'
                ])->setStatusCode(400);
            }

            // Hash de la contraseña
            $data['Pass'] = password_hash($data['Pass'], PASSWORD_DEFAULT);
            $data['password_migrated'] = 1;
            $data['Enabled'] = $data['Enabled'] ?? '1';
            $data['RegistrationDate'] = date('Y-m-d H:i:s');
            $data['UpdateDate'] = date('Y-m-d H:i:s');

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
            log_message('error', 'Error en User::create: ' . $e->getMessage());
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
            $builder = $db->table('User u');
            
            $user = $builder
                ->select('u.Id, u.Name, u.User, u.Mail, u.Enabled, u.IdUserRol, u.DefaultAgency, u.RegistrationDate, u.UpdateDate, u.IdLastUserUpdate, ur.Name as LastUserUpdateName')
                ->join('User ur', 'ur.Id = u.IdLastUserUpdate', 'left')
                ->where('u.Id', $id)
                ->get()
                ->getRowArray();

            if (!$user) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Usuario no encontrado'
                ])->setStatusCode(404);
            }

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Usuario obtenido exitosamente',
                'data' => $user
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en User::show: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener usuario: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Actualizar un usuario
     */
    public function update($id = null)
    {
        try {
            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID de usuario requerido'
                ])->setStatusCode(400);
            }

            $data = $this->request->getJSON(true);

            // Verificar si el usuario existe
            $existingUser = $this->userModel->find($id);
            if (!$existingUser) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Usuario no encontrado'
                ])->setStatusCode(404);
            }

            // Verificar username único (si se está cambiando)
            if (isset($data['User']) && $data['User'] !== $existingUser['User']) {
                $duplicateUser = $this->userModel->where('User', $data['User'])->where('Id !=', $id)->first();
                if ($duplicateUser) {
                    return $this->response->setJSON([
                        'success' => false,
                        'message' => 'El nombre de usuario ya existe'
                    ])->setStatusCode(400);
                }
            }

            // Verificar email único (si se está cambiando)
            if (isset($data['Mail']) && $data['Mail'] !== $existingUser['Mail']) {
                $duplicateEmail = $this->userModel->where('Mail', $data['Mail'])->where('Id !=', $id)->first();
                if ($duplicateEmail) {
                    return $this->response->setJSON([
                        'success' => false,
                        'message' => 'El correo electrónico ya existe'
                    ])->setStatusCode(400);
                }
            }

            // Hash de la contraseña si se proporciona
            if (isset($data['Pass']) && !empty($data['Pass'])) {
                $data['Pass'] = password_hash($data['Pass'], PASSWORD_DEFAULT);
                $data['password_migrated'] = 1;
            }

            $data['UpdateDate'] = date('Y-m-d H:i:s');

            // Actualizar usuario
            $updated = $this->userModel->update($id, $data);

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
            log_message('error', 'Error en User::update: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al actualizar usuario: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Eliminar un usuario
     */
    public function delete($id = null)
    {
        try {
            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID de usuario requerido'
                ])->setStatusCode(400);
            }

            // Verificar si el usuario existe
            $existingUser = $this->userModel->find($id);
            if (!$existingUser) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Usuario no encontrado'
                ])->setStatusCode(404);
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
            log_message('error', 'Error en User::delete: ' . $e->getMessage());
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

            // Verificar si el usuario existe
            $existingUser = $this->userModel->find($id);
            if (!$existingUser) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Usuario no encontrado'
                ])->setStatusCode(404);
            }

            // Cambiar estado
            $newStatus = $existingUser['Enabled'] === '1' ? '0' : '1';
            $updated = $this->userModel->update($id, [
                'Enabled' => $newStatus,
                'UpdateDate' => date('Y-m-d H:i:s')
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
            log_message('error', 'Error en User::toggleStatus: ' . $e->getMessage());
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

            // Verificar si el usuario existe
            $existingUser = $this->userModel->find($id);
            if (!$existingUser) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Usuario no encontrado'
                ])->setStatusCode(404);
            }

            // Hash de la nueva contraseña
            $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

            // Actualizar contraseña
            $updated = $this->userModel->update($id, [
                'Pass' => $hashedPassword,
                'password_migrated' => 1,
                'UpdateDate' => date('Y-m-d H:i:s')
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
            log_message('error', 'Error en User::changePassword: ' . $e->getMessage());
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

            // Verificar si el usuario existe
            $existingUser = $this->userModel->find($id);
            if (!$existingUser) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Usuario no encontrado'
                ])->setStatusCode(404);
            }

            // Generar contraseña temporal
            $tempPassword = bin2hex(random_bytes(8));
            $hashedPassword = password_hash($tempPassword, PASSWORD_DEFAULT);

            // Actualizar contraseña
            $updated = $this->userModel->update($id, [
                'Pass' => $hashedPassword,
                'password_migrated' => 1,
                'UpdateDate' => date('Y-m-d H:i:s')
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
            log_message('error', 'Error en User::resetPassword: ' . $e->getMessage());
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

            $users = $this->userModel
                ->select('Id, Name, User, Mail, Enabled, IdUserRol, DefaultAgency')
                ->groupStart()
                    ->like('Name', $query)
                    ->orLike('User', $query)
                    ->orLike('Mail', $query)
                ->groupEnd()
                ->orderBy('Name', 'ASC')
                ->findAll();

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
            log_message('error', 'Error en User::search: ' . $e->getMessage());
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
            $activeUsers = $this->userModel->where('Enabled', '1')->countAllResults();
            $inactiveUsers = $this->userModel->where('Enabled', '0')->countAllResults();

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
            log_message('error', 'Error en User::stats: ' . $e->getMessage());
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

            $existingUser = $this->userModel->where('User', $username)->first();
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
            log_message('error', 'Error en User::checkUsernameAvailability: ' . $e->getMessage());
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

            $existingUser = $this->userModel->where('Mail', $email)->first();
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
            log_message('error', 'Error en User::checkEmailAvailability: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error en la verificación: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }
}
