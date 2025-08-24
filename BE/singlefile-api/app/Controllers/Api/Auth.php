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
     */
    public function login()
    {
        try {
            // Obtener datos del request
            $email = $this->request->getPost('email') ?? $this->request->getJSON()->email ?? null;
            $password = $this->request->getPost('password') ?? $this->request->getJSON()->password ?? null;
            
            // Validar datos requeridos
            if (empty($email) || empty($password)) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Email y contraseña son requeridos'
                    ]);
            }
            
            // Validar formato de email
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Formato de email inválido'
                    ]);
            }
            
            // Intentar autenticación
            $result = $this->authModel->authenticate($email, $password);
            
            if ($result['success']) {
                // Login exitoso
                return $this->response
                    ->setStatusCode(200)
                    ->setJSON([
                        'success' => true,
                        'message' => $result['message'],
                        'data' => [
                            'user' => $result['user'],
                            'token' => $result['token'],
                            'expires_in' => 3600
                        ]
                    ]);
            } else {
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
     * Renovar token JWT
     */
    public function refresh()
    {
        try {
            // Obtener token actual
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
            
            // Verificar token actual
            $result = $this->authModel->verifyJWT($token);
            
            if (!$result['success']) {
                return $this->response
                    ->setStatusCode(401)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Token inválido'
                    ]);
            }
            
            // Obtener usuario y generar nuevo token
            $user = $this->authModel->getUserById($result['data']->user_id);
            
            if (!$user || !$this->authModel->isUserEnabled($user['Id'])) {
                return $this->response
                    ->setStatusCode(401)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Usuario no encontrado o deshabilitado'
                    ]);
            }
            
            // Generar nuevo token
            $newToken = $this->authModel->generateJWT($user);
            
            return $this->response
                ->setStatusCode(200)
                ->setJSON([
                    'success' => true,
                    'message' => 'Token renovado exitosamente',
                    'data' => [
                        'token' => $newToken,
                        'expires_in' => 3600
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
     * POST /api/auth/logout
     * Logout de usuario (invalidar token)
     */
    public function logout()
    {
        // En JWT, el logout se maneja del lado del cliente
        // Aquí podrías implementar una blacklist de tokens si es necesario
        
        return $this->response
            ->setStatusCode(200)
            ->setJSON([
                'success' => true,
                'message' => 'Logout exitoso'
            ]);
    }
}
