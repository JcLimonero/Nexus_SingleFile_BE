<?php

namespace App\Models;

use CodeIgniter\Model;

class CustomerTypeModel extends Model
{
    protected $table            = 'customer_type';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'id', 'name', 'enabled', 'registration_date', 'update_date', 'id_last_user_update'
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

    // Validation (snake_case)
    protected $validationRules      = [
        'name' => 'required|max_length[600]'
    ];
    protected $validationMessages   = [
        'name' => [
            'required' => 'El nombre del tipo de cliente es requerido',
            'max_length' => 'El nombre del tipo de cliente no puede exceder 600 caracteres',
            'is_unique' => 'Ya existe un tipo de cliente con este nombre'
        ]
    ];
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    // Callbacks
    protected $allowCallbacks = false;
    protected $beforeInsert   = [];
    protected $afterInsert    = [];
    protected $beforeUpdate   = [];
    protected $afterUpdate    = [];
    protected $beforeFind     = [];
    protected $afterFind      = [];
    protected $beforeDelete   = [];
    protected $afterDelete    = [];

    /**
     * Obtener tipos de cliente activos
     */
    public function getActiveCustomerTypes()
    {
        return $this->where('enabled', 1)->orderBy('name', 'ASC')->findAll();
    }

    /**
     * Obtener tipo de cliente por nombre
     */
    public function getCustomerTypeByName($name)
    {
        return $this->where('name', $name)->first();
    }

    /**
     * Cambiar estado del tipo de cliente
     */
    public function toggleStatus($id)
    {
        $customerType = $this->find($id);
        if (!$customerType) {
            return false;
        }

        $enabled = $customerType['enabled'] ?? $customerType['Enabled'] ?? 1;
        $newStatus = $enabled == 1 ? 0 : 1;
        return $this->update($id, ['enabled' => $newStatus]);
    }
}
