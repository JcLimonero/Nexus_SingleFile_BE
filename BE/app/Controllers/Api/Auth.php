<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\AuthModel;
use CodeIgniter\HTTP\ResponseInterface;

class Auth extends BaseController
{
    protected $authModel;
    
    public function __construct()
    {
        $this->authModel = new AuthModel();
    }
    
    /**
     * POST /api/auth/login
     * Login de usuario
     * Soporta login por email (nuevo) o username (antiguo)
     */
    public function login()
    {
        try {
            // Obtener datos del request
            $identifier = $this->request->getPost('email') ?? $this->request->getPost('username') ?? $this->request->getJSON()->email ?? $this->request->getJSON()->username ?? null;
            $password = $this->request->getPost('password') ?? $this->request->getJSON()->password ?? null;
            
            // Validar datos requeridos
            if (empty($identifier) || empty($password)) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Email/Usuario y contraseña son requeridos'
                    ]);
            }
            
            // Intentar autenticación (soporta email o username)
            $result = $this->authModel->authenticate($identifier, $password);
            
            if ($result['success']) {
                // Login exitoso
                return $this->response
                    ->setStatusCode(200)
                    ->setJSON([
                        'success' => true,
                        'message' => $result['message'],
                        'login_method' => $result['login_method'] ?? 'email',
                        'user' => $result['user'],
                        'access_token' => $result['access_token'],
                        'refresh_token' => $result['refresh_token'],
                        'expires_in' => $result['expires_in']
                    ]);
            } else {
                // Verificar si requiere completar email
                if (isset($result['requires_email']) && $result['requires_email']) {
                    return $this->response
                        ->setStatusCode(200) // 200 porque la autenticación fue exitosa, solo falta email
                        ->setJSON([
                            'success' => false,
                            'requires_email' => true,
                            'message' => $result['message'],
                            'user_id' => $result['user_id'],
                            'username' => $result['username'],
                            'name' => $result['name']
                        ]);
                }
                
                // Login fallido
                return $this->response
                    ->setStatusCode(401)
                    ->setJSON([
                        'success' => false,
                        'message' => $result['message']
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
     * POST /api/auth/update-email
     * Actualizar email de usuario durante la migración
     */
    public function updateEmail()
    {
        try {
            // Obtener datos del request
            $data = $this->request->getJSON(true) ?? $this->request->getPost();
            $userId = $data['user_id'] ?? null;
            $email = $data['email'] ?? null;
            $password = $data['password'] ?? null;
            
            // Validar datos requeridos
            if (empty($userId) || empty($email) || empty($password)) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'message' => 'ID de usuario, email y contraseña son requeridos'
                    ]);
            }
            
            // Actualizar email
            $result = $this->authModel->updateUserEmail($userId, $email, $password);
            
            if ($result['success']) {
                return $this->response
                    ->setStatusCode(200)
                    ->setJSON([
                        'success' => true,
                        'message' => $result['message']
                    ]);
            } else {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'message' => $result['message']
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
     * POST /api/auth/verify
     * Verificar token JWT
     */
    public function verify()
    {
        try {
            // Obtener token del header Authorization
            $authHeader = $this->request->getHeader('Authorization');
            if (!$authHeader) {
                return $this->response
                    ->setStatusCode(401)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Token de autorización requerido'
                    ]);
            }
            
            $token = str_replace('Bearer ', '', $authHeader->getValue());
            
            if (empty($token)) {
                return $this->response
                    ->setStatusCode(401)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Token inválido'
                    ]);
            }
            
            // Verificar token
            $result = $this->authModel->verifyJWT($token);
            
            if ($result['success']) {
                // Token válido
                return $this->response
                    ->setStatusCode(200)
                    ->setJSON([
                        'success' => true,
                        'message' => 'Token válido',
                        'data' => [
                            'user_id' => $result['data']->user_id,
                            'email' => $result['data']->email,
                            'role_id' => $result['data']->role_id,
                            'exp' => $result['data']->exp
                        ]
                    ]);
            } else {
                // Token inválido
                return $this->response
                    ->setStatusCode(401)
                    ->setJSON([
                        'success' => false,
                        'message' => $result['message']
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
     * POST /api/auth/refresh
     * Renovar access token usando refresh token
     */
    public function refresh()
    {
        try {
            $refreshToken = $this->request->getPost('refresh_token') ?? $this->request->getJSON()->refresh_token ?? null;
            
            if (!$refreshToken) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Refresh token requerido'
                ])->setStatusCode(400);
            }
            
            $authModel = new AuthModel();
            $result = $authModel->refreshAccessToken($refreshToken);
            
            if ($result['success']) {
                return $this->response->setJSON($result);
            } else {
                return $this->response->setJSON($result)->setStatusCode(401);
            }
            
        } catch (\Exception $e) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor'
            ])->setStatusCode(500);
        }
    }
    
    /**
     * POST /api/auth/logout
     * Cerrar sesión y revocar refresh token
     */
    public function logout()
    {
        try {
            // Obtener usuario autenticado
            $currentUser = $this->getAuthenticatedUser();
            if (!$currentUser) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ])->setStatusCode(401);
            }
            
            // Revocar refresh token
            $authModel = new AuthModel();
            $authModel->revokeRefreshToken($currentUser['user_id']);
            
            return $this->response->setJSON([
                'success' => true,
                'message' => 'Logout exitoso'
            ]);
            
        } catch (\Exception $e) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error en logout'
            ])->setStatusCode(500);
        }
    }
}
