<?php

namespace App\Models;

use CodeIgniter\Model;

class AgencyModel extends Model
{
    protected $table = 'Agency';
    protected $primaryKey = 'Id';
    protected $useAutoIncrement = false;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = [
        'Id', 'Name', 'RegistrationDate', 'UpdateDate', 
        'IdLastUserUpdate', 'Enabled', 'IdAgency'
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
        'IdAgency' => 'permit_empty|max_length[50]',
        'Enabled' => 'permit_empty|in_list[0,1]'
    ];
    
    protected $validationMessages = [
        'Name' => [
            'required' => 'El nombre de la agencia es requerido',
            'min_length' => 'El nombre debe tener al menos 3 caracteres',
            'max_length' => 'El nombre no puede exceder 600 caracteres'
        ],

        'IdAgency' => [
            'max_length' => 'El IdAgency no puede exceder 50 caracteres'
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
     * Generar ID único para nueva agencia
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
        $result = $this->select('MAX(Id) as max_id')->first();
        return ($result['max_id'] ?? 0) + 1;
    }

    /**
     * Obtener todas las agencias habilitadas
     */
    public function getAllEnabledAgencies($sortBy = 'Name', $sortOrder = 'ASC')
    {
        return $this->where('Enabled', 1)
                    ->orderBy($sortBy, $sortOrder)
                    ->findAll();
    }

    /**
     * Obtener todas las agencias habilitadas con información del usuario
     */
    public function getAllEnabledAgenciesWithUser($sortBy = 'Name', $sortOrder = 'ASC')
    {
        return $this->select('Agency.*, User.Name as LastUserUpdateName')
                    ->join('User', 'Agency.IdLastUserUpdate = User.Id', 'left')
                    ->where('Agency.Enabled', 1)
                    ->orderBy("Agency.{$sortBy}", $sortOrder)
                    ->findAll();
    }

    /**
     * Obtener todas las agencias deshabilitadas
     */
    public function getAllDisabledAgencies($sortBy = 'Name', $sortOrder = 'ASC')
    {
        return $this->where('Enabled', 0)
                    ->orderBy($sortBy, $sortOrder)
                    ->findAll();
    }

    /**
     * Obtener todas las agencias deshabilitadas con información del usuario
     */
    public function getAllDisabledAgenciesWithUser($sortBy = 'Name', $sortOrder = 'ASC')
    {
        return $this->select('Agency.*, User.Name as LastUserUpdateName')
                    ->join('User', 'Agency.IdLastUserUpdate = User.Id', 'left')
                    ->where('Agency.Enabled', 0)
                    ->orderBy("Agency.{$sortBy}", $sortOrder)
                    ->findAll();
    }

    /**
     * Obtener todas las agencias (incluyendo deshabilitadas)
     */
    public function getAllAgencies($sortBy = 'Name', $sortOrder = 'ASC')
    {
        return $this->orderBy($sortBy, $sortOrder)
                    ->findAll();
    }

    /**
     * Obtener todas las agencias con información del usuario
     */
    public function getAllAgenciesWithUser($sortBy = 'Name', $sortOrder = 'ASC')
    {
        return $this->select('Agency.*, User.Name as LastUserUpdateName')
                    ->join('User', 'Agency.IdLastUserUpdate = User.Id', 'left')
                    ->orderBy("Agency.{$sortBy}", $sortOrder)
                    ->findAll();
    }

    /**
     * Obtener agencia por ID
     */
    public function getAgencyById($id)
    {
        return $this->find($id);
    }

    /**
     * Obtener agencia por ID con información del usuario
     */
    public function getAgencyByIdWithUser($id)
    {
        return $this->select('Agency.*, User.Name as LastUserUpdateName')
                    ->join('User', 'Agency.IdLastUserUpdate = User.Id', 'left')
                    ->where('Agency.Id', $id)
                    ->first();
    }

    /**
     * Obtener agencias por nombre (búsqueda parcial)
     */
    public function getAgenciesByName($name, $sortBy = 'Name', $sortOrder = 'ASC', $enabledOnly = true)
    {
        $query = $this->like('Name', $name);
        
        if ($enabledOnly) {
            $query->where('Enabled', 1);
        }
        
        return $query->orderBy($sortBy, $sortOrder)->findAll();
    }

    /**
     * Obtener agencias por nombre con información del usuario
     */
    public function getAgenciesByNameWithUser($name, $sortBy = 'Name', $sortOrder = 'ASC', $enabledOnly = true)
    {
        $query = $this->select('Agency.*, User.Name as LastUserUpdateName')
                      ->join('User', 'Agency.IdLastUserUpdate = User.Id', 'left')
                      ->like('Agency.Name', $name);
        
        if ($enabledOnly) {
            $query->where('Agency.Enabled', 1);
        }
        
        return $query->orderBy("Agency.{$sortBy}", $sortOrder)->findAll();
    }

    /**
     * Obtener agencias por región (IdAgency)
     */
    public function getAgenciesByRegion($region, $sortBy = 'Name', $sortOrder = 'ASC', $enabledOnly = true)
    {
        $query = $this->where('IdAgency', $region);
        
        if ($enabledOnly) {
            $query->where('Enabled', 1);
        }
        
        return $query->orderBy($sortBy, $sortOrder)->findAll();
    }

    /**
     * Obtener agencias por región con información del usuario
     */
    public function getAgenciesByRegionWithUser($region, $sortBy = 'Name', $sortOrder = 'ASC', $enabledOnly = true)
    {
        $query = $this->select('Agency.*, User.Name as LastUserUpdateName')
                      ->join('User', 'Agency.IdLastUserUpdate = User.Id', 'left')
                      ->where('Agency.IdAgency', $region);
        
        if ($enabledOnly) {
            $query->where('Agency.Enabled', 1);
        }
        
        return $query->orderBy("Agency.{$sortBy}", $sortOrder)->findAll();
    }

    /**
     * Contar total de agencias habilitadas
     */
    public function countEnabledAgencies()
    {
        return $this->where('Enabled', 1)->countAllResults();
    }

    /**
     * Contar total de agencias deshabilitadas
     */
    public function countDisabledAgencies()
    {
        return $this->where('Enabled', 0)->countAllResults();
    }

    /**
     * Contar total de agencias
     */
    public function countAllAgencies()
    {
        return $this->countAllResults();
    }

    /**
     * Verificar si existe una agencia con el mismo nombre
     */
    public function isNameDuplicate($name, $excludeId = null)
    {
        $query = $this->where('Name', $name);
        
        if ($excludeId) {
            $query->where('Id !=', $excludeId);
        }
        
        return $query->countAllResults() > 0;
    }

    /**
     * Buscar agencias con filtros avanzados
     */
    public function searchAgencies($filters = [], $sortBy = 'Name', $sortOrder = 'ASC', $limit = null, $offset = 0)
    {
        $query = $this->builder();
        
        // Aplicar filtros
        if (!empty($filters['name'])) {
            $query->like('Name', $filters['name']);
        }
        
        // Filtro por región deshabilitado - columna SubFix removida
        
        if (isset($filters['enabled'])) {
            $query->where('Enabled', $filters['enabled']);
        }
        
        if (!empty($filters['date_from'])) {
            $query->where('RegistrationDate >=', $filters['date_from']);
        }
        
        if (!empty($filters['date_to'])) {
            $query->where('RegistrationDate <=', $filters['date_to']);
        }
        
        // Aplicar ordenamiento
        $query->orderBy($sortBy, $sortOrder);
        
        // Aplicar paginación
        if ($limit) {
            $query->limit($limit, $offset);
        }
        
        return $query->get()->getResultArray();
    }

    /**
     * Obtener agencias con información de usuario que las actualizó
     */
    public function getAgenciesWithUserInfo($sortBy = 'Name', $sortOrder = 'ASC')
    {
        return $this->select('Agency.*, User.Name as LastUserUpdateName')
                    ->join('User', 'Agency.IdLastUserUpdate = User.Id', 'left')
                    ->orderBy($sortBy, $sortOrder)
                    ->findAll();
    }

    /**
     * Obtener estadísticas de agencias por región
     * NOTA: Método deshabilitado - columna SubFix removida
     */
    public function getAgencyStatsByRegion()
    {
        return [];
    }

    /**
     * Obtener agencias recientemente creadas
     */
    public function getRecentAgencies($limit = 10)
    {
        return $this->orderBy('RegistrationDate', 'DESC')
                    ->limit($limit)
                    ->findAll();
    }

    /**
     * Obtener agencias recientemente actualizadas
     */
    public function getRecentlyUpdatedAgencies($limit = 10)
    {
        return $this->orderBy('UpdateDate', 'DESC')
                    ->limit($limit)
                    ->findAll();
    }

    /**
     * Activar/desactivar agencia
     */
    public function toggleAgencyStatus($id, $status)
    {
        return $this->update($id, [
            'Enabled' => $status,
            'UpdateDate' => date('Y-m-d H:i:s')
        ]);
    }

    /**
     * Obtener agencias por IDs específicos
     */
    public function getAgenciesByIds($ids)
    {
        if (empty($ids)) {
            return [];
        }
        
        return $this->whereIn('Id', $ids)->findAll();
    }

    /**
     * Verificar si una agencia existe y está habilitada
     */
    public function isAgencyActive($id)
    {
        $agency = $this->where('Id', $id)
                       ->where('Enabled', 1)
                       ->first();
        
        return $agency !== null;
    }

    /**
     * Obtener agencias con paginación
     */
    public function getAgenciesPaginated($page = 1, $perPage = 20, $filters = [], $sortBy = 'Name', $sortOrder = 'ASC')
    {
        $offset = ($page - 1) * $perPage;
        
        $agencies = $this->searchAgencies($filters, $sortBy, $sortOrder, $perPage, $offset);
        $total = $this->getFilteredCount($filters);
        
        return [
            'agencies' => $agencies,
            'total' => $total,
            'per_page' => $perPage,
            'current_page' => $page,
            'total_pages' => ceil($total / $perPage),
            'has_next' => $page < ceil($total / $perPage),
            'has_prev' => $page > 1
        ];
    }

    /**
     * Contar agencias con filtros aplicados
     */
    private function getFilteredCount($filters = [])
    {
        $query = $this->builder();
        
        if (!empty($filters['name'])) {
            $query->like('Name', $filters['name']);
        }
        
        // Filtro por región deshabilitado - columna SubFix removida
        
        if (isset($filters['enabled'])) {
            $query->where('Enabled', $filters['enabled']);
        }
        
        if (!empty($filters['date_from'])) {
            $query->where('RegistrationDate >=', $filters['date_from']);
        }
        
        if (!empty($filters['date_to'])) {
            $query->where('RegistrationDate <=', $filters['date_to']);
        }
        
        return $query->countAllResults();
    }
}
