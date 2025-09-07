<?php

namespace App\Models;

use CodeIgniter\Model;

class ProcessModel extends Model
{
    protected $table = 'Process';
    protected $primaryKey = 'Id';
    protected $useAutoIncrement = false;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = [
        'Id', 'Name', 'RegistrationDate', 'UpdateDate', 
        'IdLastUserUpdate', 'Enabled'
    ];

    protected bool $allowEmptyInserts = false;
    protected bool $updateOnlyChanged = true;

    protected array $casts = [];
    protected array $castHandlers = [];

    // Dates
    protected $useTimestamps = false;
    protected $dateFormat = 'datetime';
    protected $createdField = 'RegistrationDate';
    protected $updatedField = 'UpdateDate';
    protected $deletedField = 'deleted_at';

    // Validation
    protected $validationRules = [
        'Name' => 'required|min_length[3]|max_length[600]',
        'Enabled' => 'permit_empty|in_list[0,1]'
    ];
    
    protected $validationMessages = [
        'Name' => [
            'required' => 'El nombre del proceso es requerido',
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
        if (empty($data['data']['Id'])) {
            $data['data']['Id'] = $this->getNextId();
        }
        return $data;
    }

    /**
     * Establecer timestamps al crear
     */
    protected function setTimestamps(array $data)
    {
        $data['data']['RegistrationDate'] = date('Y-m-d H:i:s');
        $data['data']['UpdateDate'] = date('Y-m-d H:i:s');
        return $data;
    }

    /**
     * Establecer timestamp de actualización
     */
    protected function setUpdateTimestamp(array $data)
    {
        $data['data']['UpdateDate'] = date('Y-m-d H:i:s');
        return $data;
    }

    /**
     * Obtener el siguiente ID disponible
     */
    private function getNextId()
    {
        $lastProcess = $this->orderBy('Id', 'DESC')->first();
        if ($lastProcess) {
            return (int)$lastProcess['Id'] + 1;
        }
        return 1;
    }

    /**
     * Obtener todos los procesos
     */
    public function getAllProcesses($sortBy = 'Name', $sortOrder = 'ASC')
    {
        return $this->orderBy($sortBy, $sortOrder)
                    ->findAll();
    }

    /**
     * Obtener todos los procesos con información del usuario
     */
    public function getAllProcessesWithUser($sortBy = 'Name', $sortOrder = 'ASC')
    {
        return $this->select('Process.*, User.Name as LastUserUpdateName')
                    ->join('User', 'Process.IdLastUserUpdate = User.Id', 'left')
                    ->orderBy("Process.{$sortBy}", $sortOrder)
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
        return $this->select('Process.*, User.Name as LastUserUpdateName')
                    ->join('User', 'Process.IdLastUserUpdate = User.Id', 'left')
                    ->where('Process.Id', $id)
                    ->first();
    }

    /**
     * Obtener procesos por nombre (búsqueda parcial)
     */
    public function getProcessesByName($name, $sortBy = 'Name', $sortOrder = 'ASC', $enabledOnly = true)
    {
        $query = $this->like('Name', $name);
        
        if ($enabledOnly) {
            $query->where('Enabled', 1);
        }
        
        return $query->orderBy($sortBy, $sortOrder)->findAll();
    }

    /**
     * Obtener procesos por nombre con información del usuario
     */
    public function getProcessesByNameWithUser($name, $sortBy = 'Name', $sortOrder = 'ASC', $enabledOnly = true)
    {
        $query = $this->select('Process.*, User.Name as LastUserUpdateName')
                      ->join('User', 'Process.IdLastUserUpdate = User.Id', 'left')
                      ->like('Process.Name', $name);
        
        if ($enabledOnly) {
            $query->where('Process.Enabled', 1);
        }
        
        return $query->orderBy("Process.{$sortBy}", $sortOrder)->findAll();
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
        return $this->select('Process.*, User.Name as LastUserUpdateName')
                    ->join('User', 'Process.IdLastUserUpdate = User.Id', 'left')
                    ->where('Process.Enabled', 1)
                    ->orderBy("Process.{$sortBy}", $sortOrder)
                    ->findAll();
    }

    /**
     * Obtener todos los procesos deshabilitados
     */
    public function getAllDisabledProcesses($sortBy = 'Name', $sortOrder = 'ASC')
    {
        return $this->where('Enabled', 0)
                    ->orderBy($sortBy, $sortOrder)
                    ->findAll();
    }

    /**
     * Obtener todos los procesos deshabilitados con información del usuario
     */
    public function getAllDisabledProcessesWithUser($sortBy = 'Name', $sortOrder = 'ASC')
    {
        return $this->select('Process.*, User.Name as LastUserUpdateName')
                    ->join('User', 'Process.IdLastUserUpdate = User.Id', 'left')
                    ->where('Process.Enabled', 0)
                    ->orderBy("Process.{$sortBy}", $sortOrder)
                    ->findAll();
    }

    /**
     * Contar total de procesos habilitados
     */
    public function countEnabledProcesses()
    {
        return $this->where('Enabled', 1)->countAllResults();
    }

    /**
     * Contar total de procesos deshabilitados
     */
    public function countDisabledProcesses()
    {
        return $this->where('Enabled', 0)->countAllResults();
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
        $query = $this->where('Name', trim($name));
        
        if ($excludeId) {
            $query->where('Id !=', $excludeId);
        }
        
        return $query->countAllResults() > 0;
    }



    /**
     * Obtener procesos por estado
     */
    public function getProcessesByStatus($enabled, $sortBy = 'Name', $sortOrder = 'ASC')
    {
        return $this->where('Enabled', $enabled)
                    ->orderBy($sortBy, $sortOrder)
                    ->findAll();
    }

    /**
     * Obtener procesos por estado con información del usuario
     */
    public function getProcessesByStatusWithUser($enabled, $sortBy = 'Name', $sortOrder = 'ASC')
    {
        return $this->select('Process.*, User.Name as LastUserUpdateName')
                    ->join('User', 'Process.IdLastUserUpdate = User.Id', 'left')
                    ->where('Process.Enabled', $enabled)
                    ->orderBy("Process.{$sortBy}", $sortOrder)
                    ->findAll();
    }

    /**
     * Obtener estadísticas de procesos
     */
    public function getProcessStats($filters = [])
    {
        $builder = $this->builder();
        
        // Aplicar filtros básicos
        if (!empty($filters['start_date'])) {
            $builder->where('RegistrationDate >=', $filters['start_date']);
        }
        if (!empty($filters['end_date'])) {
            $builder->where('RegistrationDate <=', $filters['end_date']);
        }
        if (!empty($filters['user_id'])) {
            $builder->where('IdLastUserUpdate', $filters['user_id']);
        }

        $total = $builder->countAllResults(false);
        
        // Resetear el builder para las siguientes consultas
        $builder = $this->builder();
        if (!empty($filters['start_date'])) {
            $builder->where('RegistrationDate >=', $filters['start_date']);
        }
        if (!empty($filters['end_date'])) {
            $builder->where('RegistrationDate <=', $filters['end_date']);
        }
        if (!empty($filters['user_id'])) {
            $builder->where('IdLastUserUpdate', $filters['user_id']);
        }
        
        $enabled = $builder->where('Enabled', 1)->countAllResults(false);
        
        $builder = $this->builder();
        if (!empty($filters['start_date'])) {
            $builder->where('RegistrationDate >=', $filters['start_date']);
        }
        if (!empty($filters['end_date'])) {
            $builder->where('RegistrationDate <=', $filters['end_date']);
        }
        if (!empty($filters['user_id'])) {
            $builder->where('IdLastUserUpdate', $filters['user_id']);
        }
        
        $disabled = $builder->where('Enabled', 0)->countAllResults(false);

        return [
            'total' => $total,
            'enabled' => $enabled,
            'disabled' => $disabled
        ];
    }
}
