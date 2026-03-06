<?php

namespace App\Models;

use CodeIgniter\Model;

class ProcessModel extends Model
{
    protected $table = 'process';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = false;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = [
        'id', 'name', 'registration_date', 'update_date', 
        'id_last_user_update', 'enabled'
    ];

    protected bool $allowEmptyInserts = false;
    protected bool $updateOnlyChanged = true;

    protected array $casts = [];
    protected array $castHandlers = [];

    // Dates
    protected $useTimestamps = false;
    protected $dateFormat = 'datetime';
    protected $createdField = 'registration_date';
    protected $updatedField = 'update_date';
    protected $deletedField = 'deleted_at';

    // Validation
    protected $validationRules = [
        'name' => 'required|min_length[3]|max_length[600]',
        'enabled' => 'permit_empty|in_list[0,1]'
    ];
    
    protected $validationMessages = [
        'name' => [
            'required' => 'El nombre del proceso es requerido',
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
    protected $allowCallbacks = true;
    protected $beforeInsert = ['generateId', 'setTimestamps'];
    protected $afterInsert = [];
    protected $beforeUpdate = ['setUpdateTimestamp'];
    protected $afterUpdate = [];
    protected $beforeFind = [];
    protected $afterFind = [];
    protected $beforeDelete = [];
    protected $afterDelete = [];

    /**
     * Generar ID único para nuevo proceso
     */
    protected function generateId(array $data)
    {
        if (empty($data['data']['id']) && empty($data['data']['Id'])) {
            $data['data']['id'] = $this->getNextId();
        } elseif (!empty($data['data']['Id']) && empty($data['data']['id'])) {
            // Compatibilidad: si viene Id, convertir a id
            $data['data']['id'] = $data['data']['Id'];
            unset($data['data']['Id']);
        }
        return $data;
    }

    /**
     * Establecer timestamps al crear
     */
    protected function setTimestamps(array $data)
    {
        $currentTime = date('Y-m-d H:i:s');
        // Compatibilidad con ambos formatos
        if (!isset($data['data']['registration_date']) && !isset($data['data']['RegistrationDate'])) {
            $data['data']['registration_date'] = $currentTime;
        }
        if (!isset($data['data']['update_date']) && !isset($data['data']['UpdateDate'])) {
            $data['data']['update_date'] = $currentTime;
        }
        return $data;
    }

    /**
     * Establecer timestamp de actualización
     */
    protected function setUpdateTimestamp(array $data)
    {
        $currentTime = date('Y-m-d H:i:s');
        // Compatibilidad con ambos formatos
        if (!isset($data['data']['update_date']) && !isset($data['data']['UpdateDate'])) {
            $data['data']['update_date'] = $currentTime;
        }
        return $data;
    }

    /**
     * Obtener el siguiente ID disponible
     */
    private function getNextId()
    {
        $lastProcess = $this->orderBy('id', 'DESC')->first();
        if ($lastProcess) {
            $lastId = $lastProcess['id'] ?? $lastProcess['Id'] ?? 0;
            return (int)$lastId + 1;
        }
        return 1;
    }

    /**
     * Obtener todos los procesos
     */
    public function getAllProcesses($sortBy = 'Name', $sortOrder = 'ASC')
    {
        // Mapear campos a snake_case
        $sortFieldMap = [
            'Name' => 'name',
            'RegistrationDate' => 'registration_date',
            'UpdateDate' => 'update_date'
        ];
        $sortField = $sortFieldMap[$sortBy] ?? 'name';
        
        return $this->orderBy($sortField, $sortOrder)
                    ->findAll();
    }

    /**
     * Obtener todos los procesos con información del usuario
     */
    public function getAllProcessesWithUser($sortBy = 'Name', $sortOrder = 'ASC')
    {
        // Mapear campos de ordenamiento a snake_case
        $sortFieldMap = [
            'Name' => 'name',
            'RegistrationDate' => 'registration_date',
            'UpdateDate' => 'update_date'
        ];
        $sortField = $sortFieldMap[$sortBy] ?? 'name';
        
        return $this->select('process.*, u.name as LastUserUpdateName')
                    ->join('user u', 'process.id_last_user_update = u.id', 'left')
                    ->orderBy("process.{$sortField}", $sortOrder)
                    ->findAll();
    }

    /**
     * Obtener proceso por ID
     */
    public function getProcessById($id)
    {
        return $this->find($id);
    }

    /**
     * Obtener proceso por ID con información del usuario
     */
    public function getProcessByIdWithUser($id)
    {
        return $this->select('process.*, u.name as LastUserUpdateName')
                    ->join('user u', 'process.id_last_user_update = u.id', 'left')
                    ->where('process.id', $id)
                    ->first();
    }

    /**
     * Obtener procesos por nombre (búsqueda parcial)
     */
    public function getProcessesByName($name, $sortBy = 'Name', $sortOrder = 'ASC', $enabledOnly = true)
    {
        // Mapear campos a snake_case
        $sortFieldMap = [
            'Name' => 'name',
            'RegistrationDate' => 'registration_date',
            'UpdateDate' => 'update_date'
        ];
        $sortField = $sortFieldMap[$sortBy] ?? 'name';
        
        $query = $this->like('name', $name);
        
        if ($enabledOnly) {
            $query->where('enabled', 1);
        }
        
        return $query->orderBy($sortField, $sortOrder)->findAll();
    }

    /**
     * Obtener procesos por nombre con información del usuario
     */
    public function getProcessesByNameWithUser($name, $sortBy = 'Name', $sortOrder = 'ASC', $enabledOnly = true)
    {
        // Mapear campos de ordenamiento a snake_case
        $sortFieldMap = [
            'Name' => 'name',
            'RegistrationDate' => 'registration_date',
            'UpdateDate' => 'update_date'
        ];
        $sortField = $sortFieldMap[$sortBy] ?? 'name';
        
        $query = $this->select('process.*, u.name as LastUserUpdateName')
                      ->join('user u', 'process.id_last_user_update = u.id', 'left')
                      ->like('process.name', $name);
        
        if ($enabledOnly) {
            $query->where('process.enabled', 1);
        }
        
        return $query->orderBy("process.{$sortField}", $sortOrder)->findAll();
    }

    /**
     * Obtener todos los procesos habilitados
     */
    public function getAllEnabledProcesses($sortBy = 'Name', $sortOrder = 'ASC')
    {
        return $this->where('Enabled', 1)
                    ->orderBy($sortBy, $sortOrder)
                    ->findAll();
    }

    /**
     * Obtener todos los procesos habilitados con información del usuario
     */
    public function getAllEnabledProcessesWithUser($sortBy = 'Name', $sortOrder = 'ASC')
    {
        // Mapear campos de ordenamiento a snake_case
        $sortFieldMap = [
            'Name' => 'name',
            'RegistrationDate' => 'registration_date',
            'UpdateDate' => 'update_date'
        ];
        $sortField = $sortFieldMap[$sortBy] ?? 'name';
        
        return $this->select('process.*, u.name as LastUserUpdateName')
                    ->join('user u', 'process.id_last_user_update = u.id', 'left')
                    ->where('process.enabled', 1)
                    ->orderBy("process.{$sortField}", $sortOrder)
                    ->findAll();
    }

    /**
     * Obtener todos los procesos deshabilitados
     */
    public function getAllDisabledProcesses($sortBy = 'Name', $sortOrder = 'ASC')
    {
        // Mapear campos a snake_case
        $sortFieldMap = [
            'Name' => 'name',
            'RegistrationDate' => 'registration_date',
            'UpdateDate' => 'update_date'
        ];
        $sortField = $sortFieldMap[$sortBy] ?? 'name';
        
        return $this->where('enabled', 0)
                    ->orderBy($sortField, $sortOrder)
                    ->findAll();
    }

    /**
     * Obtener todos los procesos deshabilitados con información del usuario
     */
    public function getAllDisabledProcessesWithUser($sortBy = 'Name', $sortOrder = 'ASC')
    {
        // Mapear campos de ordenamiento a snake_case
        $sortFieldMap = [
            'Name' => 'name',
            'RegistrationDate' => 'registration_date',
            'UpdateDate' => 'update_date'
        ];
        $sortField = $sortFieldMap[$sortBy] ?? 'name';
        
        return $this->select('process.*, u.name as LastUserUpdateName')
                    ->join('user u', 'process.id_last_user_update = u.id', 'left')
                    ->where('process.enabled', 0)
                    ->orderBy("process.{$sortField}", $sortOrder)
                    ->findAll();
    }

    /**
     * Contar total de procesos habilitados
     */
    public function countEnabledProcesses()
    {
        return $this->where('enabled', 1)->countAllResults();
    }

    /**
     * Contar total de procesos deshabilitados
     */
    public function countDisabledProcesses()
    {
        return $this->where('enabled', 0)->countAllResults();
    }

    /**
     * Contar total de procesos
     */
    public function countAllProcesses()
    {
        return $this->countAllResults();
    }

    /**
     * Verificar si el nombre está duplicado
     */
    public function isNameDuplicate($name, $excludeId = null)
    {
        $query = $this->where('name', trim($name));
        
        if ($excludeId) {
            $query->where('id !=', $excludeId);
        }
        
        return $query->countAllResults() > 0;
    }

    /**
     * Obtener procesos por estado
     */
    public function getProcessesByStatus($enabled, $sortBy = 'Name', $sortOrder = 'ASC')
    {
        return $this->where('enabled', $enabled)
                    ->orderBy($sortBy, $sortOrder)
                    ->findAll();
    }

    /**
     * Obtener procesos por estado con información del usuario
     */
    public function getProcessesByStatusWithUser($enabled, $sortBy = 'Name', $sortOrder = 'ASC')
    {
        // Mapear campos a snake_case
        $sortFieldMap = [
            'Name' => 'name',
            'RegistrationDate' => 'registration_date',
            'UpdateDate' => 'update_date'
        ];
        $sortField = $sortFieldMap[$sortBy] ?? 'name';
        
        return $this->select('process.*, u.name as LastUserUpdateName')
                    ->join('user u', 'process.id_last_user_update = u.id', 'left')
                    ->where('process.enabled', $enabled)
                    ->orderBy("process.{$sortField}", $sortOrder)
                    ->findAll();
    }

    /**
     * Obtener estadísticas de procesos
     */
    public function getProcessStats($filters = [])
    {
        $builder = $this->builder();
        
        // Aplicar filtros básicos (snake_case)
        if (!empty($filters['start_date'])) {
            $builder->where('registration_date >=', $filters['start_date']);
        }
        if (!empty($filters['end_date'])) {
            $builder->where('registration_date <=', $filters['end_date']);
        }
        if (!empty($filters['user_id'])) {
            $builder->where('id_last_user_update', $filters['user_id']);
        }

        $total = $builder->countAllResults(false);
        
        // Resetear el builder para las siguientes consultas
        $builder = $this->builder();
        if (!empty($filters['start_date'])) {
            $builder->where('registration_date >=', $filters['start_date']);
        }
        if (!empty($filters['end_date'])) {
            $builder->where('registration_date <=', $filters['end_date']);
        }
        if (!empty($filters['user_id'])) {
            $builder->where('id_last_user_update', $filters['user_id']);
        }
        
        $enabled = $builder->where('enabled', 1)->countAllResults(false);
        
        $builder = $this->builder();
        if (!empty($filters['start_date'])) {
            $builder->where('registration_date >=', $filters['start_date']);
        }
        if (!empty($filters['end_date'])) {
            $builder->where('registration_date <=', $filters['end_date']);
        }
        if (!empty($filters['user_id'])) {
            $builder->where('id_last_user_update', $filters['user_id']);
        }
        
        $disabled = $builder->where('enabled', 0)->countAllResults(false);

        return [
            'total' => $total,
            'enabled' => $enabled,
            'disabled' => $disabled
        ];
    }
}
