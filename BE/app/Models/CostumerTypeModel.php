<?php

namespace App\Models;

use CodeIgniter\Model;

class CostumerTypeModel extends Model
{
    protected $table            = 'CostumerType';
    protected $primaryKey       = 'Id';
    protected $useAutoIncrement = false;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'Id', 'Name', 'Enabled', 'RegistrationDate', 'UpdateDate', 'IdLastUserUpdate'
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
        'Name' => 'required|max_length[600]'
    ];
    protected $validationMessages   = [
        'Name' => [
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
    public function getActiveCostumerTypes()
    {
        return $this->where('Enabled', 1)->orderBy('Name', 'ASC')->findAll();
    }

    /**
     * Obtener tipo de cliente por nombre
     */
    public function getCostumerTypeByName($name)
    {
        return $this->where('Name', $name)->first();
    }

    /**
     * Cambiar estado del tipo de cliente
     */
    public function toggleStatus($id)
    {
        $costumerType = $this->find($id);
        if (!$costumerType) {
            return false;
        }

        $newStatus = $costumerType['Enabled'] == 1 ? 0 : 1;
        return $this->update($id, ['Enabled' => $newStatus]);
    }
}
