<?php

namespace App\Models;

use CodeIgniter\Model;

class OperationTypeModel extends Model
{
    protected $table = 'operation_type';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = [
        'id', 'name', 'registration_date', 'update_date',
        'id_last_user_update', 'enabled'
    ];

    // Validation
    protected $validationRules = [
        'name' => 'required|min_length[3]|max_length[600]',
        'enabled' => 'permit_empty|in_list[0,1]'
    ];

    protected $validationMessages = [
        'name' => [
            'required' => 'El nombre del tipo de operación es requerido',
            'min_length' => 'El nombre debe tener al menos 3 caracteres',
            'max_length' => 'El nombre no puede exceder 600 caracteres'
        ],
        'enabled' => [
            'in_list' => 'El estado debe ser 0 o 1'
        ]
    ];

    protected $skipValidation = false;
    protected $cleanValidationRules = true;

    // Callbacks
    protected $beforeInsert = ['setTimestamps'];
    protected $beforeUpdate = ['setUpdateTimestamp'];

    protected function setTimestamps(array $data): array
    {
        $data['data']['registration_date'] = date('Y-m-d H:i:s');
        $data['data']['update_date'] = date('Y-m-d H:i:s');
        return $data;
    }

    protected function setUpdateTimestamp(array $data): array
    {
        $data['data']['update_date'] = date('Y-m-d H:i:s');
        return $data;
    }

    private function mapSortField($sortBy)
    {
        $map = ['Name' => 'name', 'RegistrationDate' => 'registration_date', 'UpdateDate' => 'update_date', 'Id' => 'id', 'Enabled' => 'enabled'];
        return $map[$sortBy] ?? 'name';
    }

    // Métodos para obtener tipos de operación con información del usuario (snake_case)
    public function getAllOperationTypesWithUser($sortBy = 'Name', $sortOrder = 'ASC')
    {
        $field = $this->mapSortField($sortBy);
        return $this->select('operation_type.*, u.name as last_user_update_name')
                    ->join('user u', 'operation_type.id_last_user_update = u.id', 'left')
                    ->orderBy("operation_type.{$field}", $sortOrder)
                    ->findAll();
    }

    public function getOperationTypeByIdWithUser($id)
    {
        return $this->select('operation_type.*, u.name as last_user_update_name')
                    ->join('user u', 'operation_type.id_last_user_update = u.id', 'left')
                    ->where('operation_type.id', $id)
                    ->first();
    }

    public function getOperationTypesByNameWithUser($search, $sortBy = 'Name', $sortOrder = 'ASC', $enabledOnly = true)
    {
        $field = $this->mapSortField($sortBy);
        $query = $this->select('operation_type.*, u.name as last_user_update_name')
                      ->join('user u', 'operation_type.id_last_user_update = u.id', 'left')
                      ->like('operation_type.name', $search);

        if ($enabledOnly) {
            $query->where('operation_type.enabled', 1);
        }

        return $query->orderBy("operation_type.{$field}", $sortOrder)->findAll();
    }

    // Métodos para obtener tipos de operación por estado (snake_case)
    public function getAllEnabledOperationTypes($sortBy = 'Name', $sortOrder = 'ASC')
    {
        $field = $this->mapSortField($sortBy);
        return $this->where('enabled', 1)
                    ->orderBy($field, $sortOrder)
                    ->findAll();
    }

    public function getAllEnabledOperationTypesWithUser($sortBy = 'Name', $sortOrder = 'ASC')
    {
        $field = $this->mapSortField($sortBy);
        return $this->select('operation_type.*, u.name as last_user_update_name')
                    ->join('user u', 'operation_type.id_last_user_update = u.id', 'left')
                    ->where('operation_type.enabled', 1)
                    ->orderBy("operation_type.{$field}", $sortOrder)
                    ->findAll();
    }

    public function getAllDisabledOperationTypes($sortBy = 'Name', $sortOrder = 'ASC')
    {
        $field = $this->mapSortField($sortBy);
        return $this->where('enabled', 0)
                    ->orderBy($field, $sortOrder)
                    ->findAll();
    }

    public function getAllDisabledOperationTypesWithUser($sortBy = 'Name', $sortOrder = 'ASC')
    {
        $field = $this->mapSortField($sortBy);
        return $this->select('operation_type.*, u.name as last_user_update_name')
                    ->join('user u', 'operation_type.id_last_user_update = u.id', 'left')
                    ->where('operation_type.enabled', 0)
                    ->orderBy("operation_type.{$field}", $sortOrder)
                    ->findAll();
    }

    // Métodos de conteo
    public function countEnabledOperationTypes()
    {
        return $this->where('enabled', 1)->countAllResults();
    }

    public function countDisabledOperationTypes()
    {
        return $this->where('enabled', 0)->countAllResults();
    }

    public function countAllOperationTypes()
    {
        return $this->countAllResults();
    }

    // Verificar si el nombre está duplicado
    public function isNameDuplicate($name, $excludeId = null)
    {
        $query = $this->where('name', trim($name));
        
        if ($excludeId) {
            $query->where('id !=', $excludeId);
        }
        
        return $query->countAllResults() > 0;
    }

    // Obtener tipos de operación por estado
    public function getOperationTypesByStatus($enabled, $sortBy = 'Name', $sortOrder = 'ASC')
    {
        $field = $this->mapSortField($sortBy);
        return $this->where('enabled', $enabled)
                    ->orderBy($field, $sortOrder)
                    ->findAll();
    }

    public function getOperationTypesByStatusWithUser($enabled, $sortBy = 'Name', $sortOrder = 'ASC')
    {
        $field = $this->mapSortField($sortBy);
        return $this->select('operation_type.*, u.name as last_user_update_name')
                    ->join('user u', 'operation_type.id_last_user_update = u.id', 'left')
                    ->where('operation_type.enabled', $enabled)
                    ->orderBy("operation_type.{$field}", $sortOrder)
                    ->findAll();
    }
}
