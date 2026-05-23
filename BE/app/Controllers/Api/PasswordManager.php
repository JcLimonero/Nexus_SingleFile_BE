<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\UserModel;
use CodeIgniter\HTTP\ResponseInterface;

class PasswordManager extends BaseController
{
    protected $userModel;
    
    public function __construct()
    {
        $this->userModel = new UserModel();
    }
    
    /**
     * POST /api/password/change
     * Cambiar contraseña de usuario.
     * Solo el dueño de la cuenta o un admin pueden hacerlo.
     */
    public function changePassword()
    {
        try {
            $authUserId = $this->getCurrentUserId();
            if (!$authUserId) {
                return $this->response->setStatusCode(401)->setJSON(['success' => false, 'message' => 'No autenticado']);
            }

            $data = $this->request->getJSON();

            $userId = $data->user_id ?? null;
            $currentPassword = $data->current_password ?? null;

            // Solo dueño o admin pueden cambiar contraseña ajena
            if ((int) $userId !== (int) $authUserId && !$this->isCurrentUserAdmin()) {
                return $this->response->setStatusCode(403)->setJSON([
                    'success' => false,
                    'message' => 'No puedes cambiar la contraseña de otro usuario'
                ]);
            }
            $newPassword = $data->new_password ?? null;
            $confirmPassword = $data->confirm_password ?? null;
            
            // Validar datos requeridos
            if (empty($userId) || empty($currentPassword) || empty($newPassword) || empty($confirmPassword)) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Todos los campos son requeridos'
                    ]);
            }
            
            // Verificar que las contraseñas nuevas coincidan
            if ($newPassword !== $confirmPassword) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Las contraseñas nuevas no coinciden'
                    ]);
            }
            
            // Verificar contraseña actual
            if (!$this->userModel->verifyPassword($userId, $currentPassword)) {
                return $this->response
                    ->setStatusCode(401)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Contraseña actual incorrecta'
                    ]);
            }
            
            // Validar fortaleza de la nueva contraseña
            if (strlen($newPassword) < 8) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'message' => 'La contraseña debe tener al menos 8 caracteres'
                    ]);
            }
            
            // Cambiar contraseña
            if ($this->userModel->changePassword($userId, $newPassword)) {
                return $this->response
                    ->setStatusCode(200)
                    ->setJSON([
                        'success' => true,
                        'message' => 'Contraseña cambiada exitosamente'
                    ]);
            } else {
                return $this->response
                    ->setStatusCode(500)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Error al cambiar la contraseña'
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
     * POST /api/password/reset
     * Reset de contraseña por administrador
     */
    public function resetPassword()
    {
        if ($r = $this->requireAdmin()) return $r;

        try {
            $data = $this->request->getJSON();

            $userId = $data->user_id ?? null;
            $newPassword = $data->new_password ?? null;

            if (empty($userId) || empty($newPassword)) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'message' => 'user_id y new_password son requeridos'
                    ]);
            }
            
            // Validar fortaleza de la nueva contraseña
            if (strlen($newPassword) < 8) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'message' => 'La contraseña debe tener al menos 8 caracteres'
                    ]);
            }
            
            // Cambiar contraseña
            if ($this->userModel->changePassword($userId, $newPassword)) {
                return $this->response
                    ->setStatusCode(200)
                    ->setJSON([
                        'success' => true,
                        'message' => 'Contraseña reseteada exitosamente'
                    ]);
            } else {
                return $this->response
                    ->setStatusCode(500)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Error al resetear la contraseña'
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
     * GET /api/password/migration-status
     * Obtener estado de migración de contraseñas
     */
    public function getMigrationStatus()
    {
        try {
            $usersWithPlainPasswords = $this->userModel->getUsersWithPlainPasswords();
            $totalUsers = $this->userModel->countAll();
            $migratedUsers = $totalUsers - count($usersWithPlainPasswords);
            
            return $this->response
                ->setStatusCode(200)
                ->setJSON([
                    'success' => true,
                    'data' => [
                        'total_users' => $totalUsers,
                        'migrated_users' => $migratedUsers,
                        'pending_migration' => count($usersWithPlainPasswords),
                        'migration_percentage' => $totalUsers > 0 ? round(($migratedUsers / $totalUsers) * 100, 2) : 0
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
     * POST /api/password/force-migration
     * Forzar migración de contraseña específica
     */
    public function forceMigration()
    {
        if ($r = $this->requireAdmin()) return $r;

        try {
            $data = $this->request->getJSON();
            
            $userId = $data->user_id ?? null;
            $plainPassword = $data->plain_password ?? null;
            
            // Validar datos requeridos
            if (empty($userId) || empty($plainPassword)) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'message' => 'ID de usuario y contraseña son requeridos'
                    ]);
            }
            
            // Forzar migración
            if ($this->userModel->forcePasswordMigration($userId, $plainPassword)) {
                return $this->response
                    ->setStatusCode(200)
                    ->setJSON([
                        'success' => true,
                        'message' => 'Contraseña migrada exitosamente'
                    ]);
            } else {
                return $this->response
                    ->setStatusCode(500)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Error al migrar la contraseña'
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
}
