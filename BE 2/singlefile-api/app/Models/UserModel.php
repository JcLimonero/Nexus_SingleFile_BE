<?php

namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model
{
    protected $table            = 'User';
    protected $primaryKey       = 'Id';
    protected $useAutoIncrement = false;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'Id', 'Name', 'User', 'Pass', 'Mail', 'Enabled', 'IdUserRol',
        'RegistrationDate', 'UpdateDate', 'IdLastUserUpdate',
        'IdUserTotal', 'DefaultAgency', 'password_migrated',
        'profile_image', 'image_type', 'image_size'
    ];

    protected bool $allowEmptyInserts = false;
    protected bool $updateOnlyChanged = true;

    protected array $casts = [];
    protected array $castHandlers = [];

    // Dates
    protected $useTimestamps = false;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'RegistrationDate';
    protected $updatedField  = 'UpdateDate';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules      = [];
    protected $validationMessages   = [];
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    // Callbacks
    protected $allowCallbacks = true;
    protected $beforeInsert   = ['hashPassword'];
    protected $afterInsert    = [];
    protected $beforeUpdate   = ['hashPassword'];
    protected $afterUpdate    = [];
    protected $beforeFind     = [];
    protected $afterFind      = [];
    protected $beforeDelete   = [];
    protected $afterDelete    = [];

    /**
     * Hash de contraseña antes de insertar/actualizar
     */
    protected function hashPassword(array $data)
    {
        // Solo hashear si se está actualizando el campo Pass
        if (isset($data['data']['Pass']) && !empty($data['data']['Pass'])) {
            // Verificar si ya es un hash (no hashear de nuevo)
            if (!password_get_info($data['data']['Pass'])['algoName']) {
                $data['data']['Pass'] = password_hash($data['data']['Pass'], PASSWORD_DEFAULT);
                $data['data']['password_migrated'] = 1;
            }
        }
        
        return $data;
    }

    /**
     * Verificar contraseña
     */
    public function verifyPassword($userId, $plainPassword)
    {
        $user = $this->find($userId);
        if (!$user) {
            return false;
        }
        
        return password_verify($plainPassword, $user['Pass']);
    }

    /**
     * Cambiar contraseña de usuario
     */
    public function changePassword($userId, $newPassword)
    {
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        
        return $this->update($userId, [
            'Pass' => $hashedPassword,
            'password_migrated' => 1,
            'UpdateDate' => date('Y-m-d H:i:s'),
            'IdLastUserUpdate' => session()->get('user_id') ?? 0
        ]);
    }

    /**
     * Obtener usuarios que aún no han migrado sus contraseñas
     */
    public function getUsersWithPlainPasswords()
    {
        return $this->where('password_migrated', 0)->findAll();
    }

    /**
     * Forzar migración de contraseña específica
     */
    public function forcePasswordMigration($userId, $plainPassword)
    {
        $hashedPassword = password_hash($plainPassword, PASSWORD_DEFAULT);
        
        return $this->update($userId, [
            'Pass' => $hashedPassword,
            'password_migrated' => 1,
            'UpdateDate' => date('Y-m-d H:i:s')
        ]);
    }

    /**
     * Verificar si un usuario tiene contraseña migrada
     */
    public function isPasswordMigrated($userId)
    {
        $user = $this->find($userId);
        return $user && $user['password_migrated'] == 1;
    }

    /**
     * Actualizar imagen de perfil del usuario
     */
    public function updateProfileImage($userId, $imageData, $imageType, $imageSize)
    {
        return $this->update($userId, [
            'profile_image' => $imageData,
            'image_type' => $imageType,
            'image_size' => $imageSize,
            'UpdateDate' => date('Y-m-d H:i:s'),
            'IdLastUserUpdate' => session()->get('user_id') ?? 0
        ]);
    }

    /**
     * Eliminar imagen de perfil del usuario
     */
    public function removeProfileImage($userId)
    {
        return $this->update($userId, [
            'profile_image' => null,
            'image_type' => null,
            'image_size' => null,
            'UpdateDate' => date('Y-m-d H:i:s'),
            'IdLastUserUpdate' => session()->get('user_id') ?? 0
        ]);
    }

    /**
     * Obtener imagen de perfil del usuario
     */
    public function getProfileImage($userId)
    {
        $user = $this->select('profile_image, image_type, image_size')->find($userId);
        return $user ? [
            'image' => $user['profile_image'],
            'type' => $user['image_type'],
            'size' => $user['image_size']
        ] : null;
    }

    /**
     * Verificar si un usuario tiene imagen de perfil
     */
    public function hasProfileImage($userId)
    {
        $user = $this->select('profile_image')->find($userId);
        return $user && !empty($user['profile_image']);
    }
}
