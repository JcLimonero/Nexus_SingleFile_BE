<?php

namespace App\Models;

use CodeIgniter\Model;

class UserRolModel extends Model
{
    protected $table            = 'user_role';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'name', 'enabled', 'registration_date', 'update_date'
    ];

    protected bool $allowEmptyInserts = false;
    protected bool $updateOnlyChanged = true;

    protected array $casts = [];
    protected array $castHandlers = [];

    // Dates
    protected $useTimestamps = false;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'registration_date';
    protected $updatedField  = 'update_date';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules      = [
        'name' => 'required|max_length[600]|is_unique[user_role.name,id,{id}]'
    ];
    protected $validationMessages   = [
        'name' => [
            'required' => 'El nombre del rol es requerido',
            'max_length' => 'El nombre del rol no puede exceder 600 caracteres',
            'is_unique' => 'Ya existe un rol con este nombre'
        ]
    ];
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    // Callbacks
    protected $allowCallbacks = true;
    protected $beforeInsert   = ['setTimestamps'];
    protected $afterInsert    = [];
    protected $beforeUpdate   = ['setTimestamps'];
    protected $afterUpdate    = [];
    protected $beforeFind     = [];
    protected $afterFind      = [];
    protected $beforeDelete   = [];
    protected $afterDelete    = [];

    /**
     * Establecer timestamps antes de insertar/actualizar
     */
    protected function setTimestamps(array $data)
    {
        $currentTime = date('Y-m-d H:i:s');
        
        if ($data['method'] === 'insert') {
            $data['data']['registration_date'] = $currentTime;
        }
        
        $data['data']['update_date'] = $currentTime;
        
        return $data;
    }

    /**
     * Obtener roles activos
     */
    public function getActiveRoles()
    {
        return $this->where('enabled', 1)->orderBy('name', 'ASC')->findAll();
    }

    /**
     * Obtener rol por nombre
     */
    public function getRoleByName($name)
    {
        return $this->where('name', $name)->first();
    }

    /**
     * Verificar si un rol está siendo usado por algún usuario
     */
    public function isRoleInUse($roleId)
    {
        $db = \Config\Database::connect();
        $userCount = $db->table('user')->where('id_user_role', $roleId)->countAllResults();
        return $userCount > 0;
    }

    /**
     * Cambiar estado del rol
     */
    public function toggleStatus($id)
    {
        $role = $this->find($id);
        if (!$role) {
            return false;
        }

        $newStatus = ($role['enabled'] ?? 0) == 1 ? 0 : 1;
        return $this->update($id, ['enabled' => $newStatus]);
    }
}
