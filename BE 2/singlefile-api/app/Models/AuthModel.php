<?php

namespace App\Models;

use CodeIgniter\Model;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthModel extends Model
{
    protected $table = 'User';
    protected $primaryKey = 'Id';
    protected $allowedFields = ['Name', 'User', 'Pass', 'Mail', 'Enabled', 'IdUserRol'];
    
    // Configuración de JWT
    private $jwtSecret = 'singlefile-secret-key-2025';
    private $jwtExpiration = 3600; // 1 hora
    private $refreshTokenExpiration = 2592000; // 30 días
    
    /**
     * Autenticar usuario por email y contraseña
     */
    public function authenticate($email, $password)
    {
        try {
            // Buscar usuario por email con JOIN a UserRol para obtener la descripción del rol
            $user = $this->select('User.*, UserRol.Name as RoleName')
                        ->join('UserRol', 'User.IdUserRol = UserRol.Id', 'left')
                        ->where('User.Mail', $email)
                        ->where('User.Enabled', 1)
                        ->get()
                        ->getRowArray();
            
            if (!$user) {
                return [
                    'success' => false,
                    'message' => 'Usuario no encontrado o deshabilitado'
                ];
            }
            
            // Verificar contraseña
            if ($this->verifyPassword($password, $user['Pass'], $user['UserPass'])) {
                // Generar token JWT
                $accessToken = $this->generateAccessToken($user);
                $refreshToken = $this->generateRefreshToken($user);
                
                // Guardar refresh token en la base de datos
                $this->saveRefreshToken($user['Id'], $refreshToken);
                
                return [
                    'success' => true,
                    'message' => 'Login exitoso',
                    'user' => [
                        'id' => $user['Id'],
                        'name' => $user['Name'],
                        'email' => $user['Mail'],
                        'username' => $user['User'],
                        'role_id' => $user['IdUserRol'],
                        'role_name' => $user['RoleName'] ?? 'Sin rol asignado',
                        'enabled' => $user['Enabled'],
                        'profile_image' => $user['ProfileImage'] ?? null,
                        'image_type' => $user['ImageType'] ?? null
                    ],
                    'access_token' => $accessToken,
                    'refresh_token' => $refreshToken,
                    'expires_in' => $this->jwtExpiration
                ];
            }
            
            return [
                'success' => false,
                'message' => 'Contraseña incorrecta'
            ];
            
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Error en autenticación: ' . $e->getMessage()
            ];
            }
    }
    
    /**
     * Verificar contraseña (compatible con texto plano, hash y UserPass)
     */
    private function verifyPassword($inputPassword, $storedPassword, $userPass = null)
    {
        // Si la contraseña almacenada es un hash
        if (password_verify($inputPassword, $storedPassword)) {
            return true;
        }
        
        // Si la contraseña almacenada está en texto plano (migración)
        if ($inputPassword === $storedPassword) {
            // Actualizar la contraseña a hash automáticamente
            // Nota: $user['Id'] no está disponible en este contexto
            // Se manejará en el método authenticate
            return true;
        }
        
        // Verificar en el campo UserPass (formato: "usuario,contraseña")
        if ($userPass && !empty($userPass)) {
            $parts = explode(',', $userPass);
            foreach ($parts as $part) {
                $part = trim($part);
                if ($inputPassword === $part) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    /**
     * Generar JWT access token
     */
    private function generateAccessToken($user)
    {
        $payload = [
            'iss' => 'singlefile-api', // Emisor
            'aud' => 'singlefile-client', // Audiencia
            'iat' => time(), // Tiempo de emisión
            'exp' => time() + $this->jwtExpiration, // Expiración
            'user_id' => $user['Id'],
            'email' => $user['Mail'],
            'role_id' => $user['IdUserRol'],
            'type' => 'access'
        ];
        
        return JWT::encode($payload, $this->jwtSecret, 'HS256');
    }
    
    /**
     * Generar JWT refresh token
     */
    private function generateRefreshToken($user)
    {
        $payload = [
            'iss' => 'singlefile-api', // Emisor
            'aud' => 'singlefile-client', // Audiencia
            'iat' => time(), // Tiempo de emisión
            'exp' => time() + $this->refreshTokenExpiration, // Expiración más larga
            'user_id' => $user['Id'],
            'email' => $user['Mail'],
            'role_id' => $user['IdUserRol'],
            'type' => 'refresh'
        ];
        
        return JWT::encode($payload, $this->jwtSecret, 'HS256');
    }
    
    /**
     * Guardar refresh token en la base de datos
     */
    private function saveRefreshToken($userId, $refreshToken)
    {
        try {
            $db = \Config\Database::connect();
            
            // Verificar si ya existe un refresh token para este usuario
            $existingToken = $db->table('User_RefreshToken')
                ->where('IdUser', $userId)
                ->get()
                ->getRowArray();
            
            if ($existingToken) {
                // Actualizar token existente
                $db->table('User_RefreshToken')
                    ->where('IdUser', $userId)
                    ->update([
                        'RefreshToken' => $refreshToken,
                        'ExpirationDate' => date('Y-m-d H:i:s', time() + $this->refreshTokenExpiration),
                        'UpdateDate' => date('Y-m-d H:i:s')
                    ]);
            } else {
                // Insertar nuevo token
                $db->table('User_RefreshToken')->insert([
                    'IdUser' => $userId,
                    'RefreshToken' => $refreshToken,
                    'ExpirationDate' => date('Y-m-d H:i:s', time() + $this->refreshTokenExpiration),
                    'CreatedDate' => date('Y-m-d H:i:s'),
                    'UpdateDate' => date('Y-m-d H:i:s')
                ]);
            }
            
            return true;
        } catch (\Exception $e) {
            // Log del error pero no fallar la autenticación
            log_message('error', 'Error guardando refresh token: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Renovar access token usando refresh token
     */
    public function refreshAccessToken($refreshToken)
    {
        try {
            // Verificar que el refresh token sea válido
            $decoded = JWT::decode($refreshToken, new Key($this->jwtSecret, 'HS256'));
            
            // Verificar que sea un refresh token
            if ($decoded->type !== 'refresh') {
                return [
                    'success' => false,
                    'message' => 'Token inválido: no es un refresh token'
                ];
            }
            
            // Verificar que el token esté en la base de datos
            $db = \Config\Database::connect();
            $storedToken = $db->table('User_RefreshToken')
                ->where('IdUser', $decoded->user_id)
                ->where('RefreshToken', $refreshToken)
                ->where('ExpirationDate >', date('Y-m-d H:i:s'))
                ->get()
                ->getRowArray();
            
            if (!$storedToken) {
                return [
                    'success' => false,
                    'message' => 'Refresh token no válido o expirado'
                ];
            }
            
            // Obtener información del usuario
            $user = $this->find($decoded->user_id);
            if (!$user || $user['Enabled'] != 1) {
                return [
                    'success' => false,
                    'message' => 'Usuario no encontrado o deshabilitado'
                ];
            }
            
            // Generar nuevo access token
            $newAccessToken = $this->generateAccessToken($user);
            
            return [
                'success' => true,
                'message' => 'Token renovado exitosamente',
                'access_token' => $newAccessToken,
                'expires_in' => $this->jwtExpiration
            ];
            
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Error renovando token: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Revocar refresh token (logout)
     */
    public function revokeRefreshToken($userId)
    {
        try {
            $db = \Config\Database::connect();
            $db->table('User_RefreshToken')
                ->where('IdUser', $userId)
                ->delete();
            
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }
    
    /**
     * Verificar JWT token
     */
    public function verifyJWT($token)
    {
        try {
            $decoded = JWT::decode($token, new Key($this->jwtSecret, 'HS256'));
            return [
                'success' => true,
                'data' => $decoded
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Token inválido: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Actualizar contraseña a hash (para migración)
     */
    public function updatePasswordToHash($userId, $plainPassword)
    {
        try {
            $hashedPassword = password_hash($plainPassword, PASSWORD_DEFAULT);
            
            $this->update($userId, [
                'Pass' => $hashedPassword,
                'password_migrated' => 1,
                'UpdateDate' => date('Y-m-d H:i:s')
            ]);
            
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }
    
    /**
     * Obtener usuario por ID
     */
    public function getUserById($userId)
    {
        return $this->find($userId);
    }
    
    /**
     * Verificar si el usuario está habilitado
     */
    public function isUserEnabled($userId)
    {
        $user = $this->find($userId);
        return $user && $user['Enabled'] == 1;
    }
}
