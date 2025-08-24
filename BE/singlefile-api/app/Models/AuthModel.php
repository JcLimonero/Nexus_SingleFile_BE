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
                        ->first();
            
            if (!$user) {
                return [
                    'success' => false,
                    'message' => 'Usuario no encontrado o deshabilitado'
                ];
            }
            
            // Verificar contraseña
            if ($this->verifyPassword($password, $user['Pass'], $user['UserPass'])) {
                // Generar token JWT
                $token = $this->generateJWT($user);
                
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
                        'enabled' => $user['Enabled']
                    ],
                    'token' => $token
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
     * Generar JWT token
     */
    private function generateJWT($user)
    {
        $payload = [
            'iss' => 'singlefile-api', // Emisor
            'aud' => 'singlefile-client', // Audiencia
            'iat' => time(), // Tiempo de emisión
            'exp' => time() + $this->jwtExpiration, // Expiración
            'user_id' => $user['Id'],
            'email' => $user['Mail'],
            'role_id' => $user['IdUserRol']
        ];
        
        return JWT::encode($payload, $this->jwtSecret, 'HS256');
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
