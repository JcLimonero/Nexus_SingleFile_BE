<?php

namespace App\Models;

use CodeIgniter\Model;

class OperationTypeModel extends Model
{
    protected $table = 'OperationType';
    protected $primaryKey = 'Id';
    protected $useAutoIncrement = false;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = [
        'Id', 'Name', 'RegistrationDate', 'UpdateDate', 
        'IdLastUserUpdate', 'Enabled'
    ];

    // Validation
    protected $validationRules = [
        'Name' => 'required|min_length[3]|max_length[600]',
        'Enabled' => 'permit_empty|in_list[0,1]'
    ];

    protected $validationMessages = [
        'Name' => [
            'required' => 'El nombre del tipo de operación es requerido',
            'min_length' => 'El nombre debe tener al menos 3 caracteres',
            'max_length' => 'El nombre no puede exceder 600 caracteres'
        ],
        'Enabled' => [
            'in_list' => 'El estado debe ser 0 o 1'
        ]
    ];

    protected $skipValidation = false;
    protected $cleanValidationRules = true;

    // Callbacks
    protected $beforeInsert = ['generateId', 'setTimestamps'];
    protected $beforeUpdate = ['setUpdateTimestamp'];

    protected function generateId(array $data): array
    {
        if (!isset($data['data']['Id']) || empty($data['data']['Id'])) {
            $data['data']['Id'] = $this->generateUniqueId();
        }
        return $data;
    }

    protected function setTimestamps(array $data): array
    {
        $data['data']['RegistrationDate'] = date('Y-m-d H:i:s');
        $data['data']['UpdateDate'] = date('Y-m-d H:i:s');
        return $data;
    }

    protected function setUpdateTimestamp(array $data): array
    {
        $data['data']['UpdateDate'] = date('Y-m-d H:i:s');
        return $data;
    }

    private function generateUniqueId(): string
    {
        do {
            $id = 'OT' . str_pad(mt_rand(1, 999999), 6, '0', STR_PAD_LEFT);
        } while ($this->where('Id', $id)->countAllResults() > 0);
        
        return $id;
    }

    // Métodos para obtener tipos de operación con información del usuario
    public function getAllOperationTypesWithUser($sortBy = 'Name', $sortOrder = 'ASC')
    {
        return $this->select('OperationType.*, User.Name as LastUserUpdateName')
                    ->join('User', 'OperationType.IdLastUserUpdate = User.Id', 'left')
                    ->orderBy("OperationType.{$sortBy}", $sortOrder)
                    ->findAll();
    }

    public function getOperationTypeByIdWithUser($id)
    {
        return $this->select('OperationType.*, User.Name as LastUserUpdateName')
                    ->join('User', 'OperationType.IdLastUserUpdate = User.Id', 'left')
                    ->where('OperationType.Id', $id)
                    ->first();
    }

    public function getOperationTypesByNameWithUser($search, $sortBy = 'Name', $sortOrder = 'ASC', $enabledOnly = true)
    {
        $query = $this->select('OperationType.*, User.Name as LastUserUpdateName')
                      ->join('User', 'OperationType.IdLastUserUpdate = User.Id', 'left')
                      ->like('OperationType.Name', $search);

        if ($enabledOnly) {
            $query->where('OperationType.Enabled', 1);
        }

        return $query->orderBy("OperationType.{$sortBy}", $sortOrder)->findAll();
    }

    // Métodos para obtener tipos de operación por estado
    public function getAllEnabledOperationTypes($sortBy = 'Name', $sortOrder = 'ASC')
    {
        return $this->where('Enabled', 1)
                    ->orderBy($sortBy, $sortOrder)
                    ->findAll();
    }

    public function getAllEnabledOperationTypesWithUser($sortBy = 'Name', $sortOrder = 'ASC')
    {
        return $this->select('OperationType.*, User.Name as LastUserUpdateName')
                    ->join('User', 'OperationType.IdLastUserUpdate = User.Id', 'left')
                    ->where('OperationType.Enabled', 1)
                    ->orderBy("OperationType.{$sortBy}", $sortOrder)
                    ->findAll();
    }

    public function getAllDisabledOperationTypes($sortBy = 'Name', $sortOrder = 'ASC')
    {
        return $this->where('Enabled', 0)
                    ->orderBy($sortBy, $sortOrder)
                    ->findAll();
    }

    public function getAllDisabledOperationTypesWithUser($sortBy = 'Name', $sortOrder = 'ASC')
    {
        return $this->select('OperationType.*, User.Name as LastUserUpdateName')
                    ->join('User', 'OperationType.IdLastUserUpdate = User.Id', 'left')
                    ->where('OperationType.Enabled', 0)
                    ->orderBy("OperationType.{$sortBy}", $sortOrder)
                    ->findAll();
    }

    // Métodos de conteo
    public function countEnabledOperationTypes()
    {
        return $this->where('Enabled', 1)->countAllResults();
    }

    public function countDisabledOperationTypes()
    {
        return $this->where('Enabled', 0)->countAllResults();
    }

    public function countAllOperationTypes()
    {
        return $this->countAllResults();
    }

    // Verificar si el nombre está duplicado
    public function isNameDuplicate($name, $excludeId = null)
    {
        $query = $this->where('Name', trim($name));
        
        if ($excludeId) {
            $query->where('Id !=', $excludeId);
        }
        
        return $query->countAllResults() > 0;
    }

    // Obtener tipos de operación por estado
    public function getOperationTypesByStatus($enabled, $sortBy = 'Name', $sortOrder = 'ASC')
    {
        return $this->where('Enabled', $enabled)
                    ->orderBy($sortBy, $sortOrder)
                    ->findAll();
    }

    public function getOperationTypesByStatusWithUser($enabled, $sortBy = 'Name', $sortOrder = 'ASC')
    {
        return $this->select('OperationType.*, User.Name as LastUserUpdateName')
                    ->join('User', 'OperationType.IdLastUserUpdate = User.Id', 'left')
                    ->where('OperationType.Enabled', $enabled)
                    ->orderBy("OperationType.{$sortBy}", $sortOrder)
                    ->findAll();
    }
}
