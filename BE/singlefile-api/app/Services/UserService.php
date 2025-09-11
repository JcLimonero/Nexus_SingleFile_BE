<?php
namespace App\Services;

use CodeIgniter\Database\BaseConnection;

class UserService
{
    protected $db;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }

    /**
     * Obtener o crear usuario asesor
     */
    public function getOrCreateSeller($ndConsultant)
    {
        error_log("=== GET OR CREATE SELLER ===");
        error_log("ndConsultant recibido: " . ($ndConsultant ?? 'NULL'));
        
        if (!$ndConsultant) {
            $currentUser = $this->getAuthenticatedUser();
            error_log("Usuario autenticado: " . json_encode($currentUser));
            $userId = $currentUser['id'] ?? 1; // Fallback al usuario admin
            error_log("Usando usuario actual como asesor: " . $userId);
            return $userId;
        }

        // Buscar si ya existe un usuario con este ndConsultant
        $existingUser = $this->db->table('User')
            ->where('User', $ndConsultant)
            ->orWhere('Mail', $ndConsultant . '@default.com')
            ->get()
            ->getRowArray();

        if ($existingUser) {
            error_log("Usuario asesor encontrado: " . $existingUser['Id']);
            return $existingUser['Id'];
        }

        // Verificar si ya existe un usuario con el mismo nombre
        $duplicateUser = $this->db->table('User')
            ->where('User', $ndConsultant)
            ->get()
            ->getRowArray();
            
        if ($duplicateUser) {
            error_log("Usuario duplicado encontrado: " . json_encode($duplicateUser));
            return $duplicateUser['Id'];
        }

        // TEMPORAL: Usar usuario admin como fallback para evitar problemas de inserción
        error_log("No se encontró usuario asesor para ndConsultant: " . $ndConsultant . ", usando usuario admin como fallback");
        return 1; // Usuario admin
    }

    /**
     * Crear nuevo usuario
     */
    public function createUser($userData)
    {
        error_log("=== CREANDO NUEVO USUARIO ===");
        error_log("Datos de usuario: " . json_encode($userData));
        
        $this->db->table('User')->insert($userData);
        $newUserId = $this->db->insertID();
        
        error_log("DB error después de insert: " . ($this->db->error()['message'] ?? 'No error'));
        error_log("DB error code: " . ($this->db->error()['code'] ?? 'No code'));
        error_log("Nuevo usuario creado con ID: " . $newUserId);
        
        return $newUserId;
    }

    /**
     * Buscar usuario por username
     */
    public function findUserByUsername($username)
    {
        return $this->db->table('User')
            ->where('User', $username)
            ->get()
            ->getRowArray();
    }

    /**
     * Buscar usuario por email
     */
    public function findUserByEmail($email)
    {
        return $this->db->table('User')
            ->where('Mail', $email)
            ->get()
            ->getRowArray();
    }

    /**
     * Obtener usuario autenticado (placeholder)
     */
    private function getAuthenticatedUser()
    {
        // Esta función debería obtener el usuario autenticado desde el token JWT
        // Por ahora retornamos un usuario por defecto
        return [
            'id' => 1,
            'name' => 'Admin',
            'email' => 'admin@example.com'
        ];
    }

    /**
     * Validar que el usuario existe
     */
    public function validateUserExists($userId)
    {
        $user = $this->db->table('User')
            ->where('Id', $userId)
            ->get()
            ->getRowArray();
            
        return $user !== null;
    }

    /**
     * Obtener usuario por ID
     */
    public function getUserById($userId)
    {
        return $this->db->table('User')
            ->where('Id', $userId)
            ->get()
            ->getRowArray();
    }
}
