<?php

namespace App\Models;

use CodeIgniter\Model;

class UserRolModel extends Model
{
    protected $table            = 'UserRol';
    protected $primaryKey       = 'Id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'Name', 'Enabled', 'RegistrationDate', 'UpdateDate'
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
    protected $validationRules      = [
        'Name' => 'required|max_length[600]|is_unique[UserRol.Name,Id,{Id}]'
    ];
    protected $validationMessages   = [
        'Name' => [
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
            $data['data']['RegistrationDate'] = $currentTime;
        }
        
        $data['data']['UpdateDate'] = $currentTime;
        
        return $data;
    }

    /**
     * Obtener roles activos
     */
    public function getActiveRoles()
    {
        return $this->where('Enabled', 1)->orderBy('Name', 'ASC')->findAll();
    }

    /**
     * Obtener rol por nombre
     */
    public function getRoleByName($name)
    {
        return $this->where('Name', $name)->first();
    }

    /**
     * Verificar si un rol está siendo usado por algún usuario
     */
    public function isRoleInUse($roleId)
    {
        $db = \Config\Database::connect();
        $userCount = $db->table('User')->where('IdUserRol', $roleId)->countAllResults();
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

        $newStatus = $role['Enabled'] == 1 ? 0 : 1;
        return $this->update($id, ['Enabled' => $newStatus]);
    }
}
