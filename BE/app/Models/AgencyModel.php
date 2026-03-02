<?php

namespace App\Models;

use CodeIgniter\Model;

class AgencyModel extends Model
{
    protected $table = 'agency';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = false;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = [
        'id', 'name', 'id_company', 'registration_date', 'update_date', 
        'id_last_user_update', 'enabled', 'id_agency_dms', 'agency_connection'
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
        'id_company' => 'permit_empty|integer',
        'id_agency_dms' => 'permit_empty|max_length[50]',
        'enabled' => 'permit_empty|in_list[0,1]'
    ];
    
    protected $validationMessages = [
        'name' => [
            'required' => 'El nombre de la agencia es requerido',
            'min_length' => 'El nombre debe tener al menos 3 caracteres',
            'max_length' => 'El nombre no puede exceder 600 caracteres'
        ],

        'id_agency_dms' => [
            'max_length' => 'El id_agency_dms no puede exceder 50 caracteres'
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
     * Generar ID único para nueva agencia
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
        $result = $this->select('MAX(id) as max_id')->first();
        return ($result['max_id'] ?? 0) + 1;
    }

    /**
     * Obtener todas las agencias habilitadas
     */
    public function getAllEnabledAgencies($sortBy = 'Name', $sortOrder = 'ASC')
    {
        // Mapear campos a snake_case
        $sortFieldMap = [
            'Name' => 'name',
            'RegistrationDate' => 'registration_date',
            'UpdateDate' => 'update_date'
        ];
        $sortField = $sortFieldMap[$sortBy] ?? 'name';
        
        return $this->where('enabled', 1)
                    ->orderBy($sortField, $sortOrder)
                    ->findAll();
    }

    /**
     * Obtener todas las agencias habilitadas con información del usuario
     */
    public function getAllEnabledAgenciesWithUser($sortBy = 'Name', $sortOrder = 'ASC')
    {
        // Mapear campos a snake_case
        $sortFieldMap = [
            'Name' => 'name',
            'RegistrationDate' => 'registration_date',
            'UpdateDate' => 'update_date'
        ];
        $sortField = $sortFieldMap[$sortBy] ?? 'name';
        
        return $this->select('agency.*, u.name as LastUserUpdateName, company.name as CompanyName, company.agency_connection as agency_connection')
                    ->join('user u', 'agency.id_last_user_update = u.id', 'left')
                    ->join('company', 'agency.id_company = company.id', 'left')
                    ->where('agency.enabled', 1)
                    ->orderBy($sortField === 'companyName' ? 'company.name' : "agency.{$sortField}", $sortOrder)
                    ->findAll();
    }

    /**
     * Obtener todas las agencias deshabilitadas
     */
    public function getAllDisabledAgencies($sortBy = 'Name', $sortOrder = 'ASC')
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
     * Obtener todas las agencias deshabilitadas con información del usuario
     */
    public function getAllDisabledAgenciesWithUser($sortBy = 'Name', $sortOrder = 'ASC')
    {
        // Mapear campos a snake_case
        $sortFieldMap = [
            'Name' => 'name',
            'RegistrationDate' => 'registration_date',
            'UpdateDate' => 'update_date'
        ];
        $sortField = $sortFieldMap[$sortBy] ?? 'name';
        
        return $this->select('agency.*, u.name as LastUserUpdateName, company.name as CompanyName, company.agency_connection as agency_connection')
                    ->join('user u', 'agency.id_last_user_update = u.id', 'left')
                    ->join('company', 'agency.id_company = company.id', 'left')
                    ->where('agency.enabled', 0)
                    ->orderBy($sortField === 'companyName' ? 'company.name' : "agency.{$sortField}", $sortOrder)
                    ->findAll();
    }

    /**
     * Obtener todas las agencias (incluyendo deshabilitadas)
     */
    public function getAllAgencies($sortBy = 'Name', $sortOrder = 'ASC')
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
     * Obtener todas las agencias con información del usuario
     */
    public function getAllAgenciesWithUser($sortBy = 'Name', $sortOrder = 'ASC')
    {
        // Mapear campos a snake_case
        $sortFieldMap = [
            'Name' => 'name',
            'RegistrationDate' => 'registration_date',
            'UpdateDate' => 'update_date'
        ];
        $sortField = $sortFieldMap[$sortBy] ?? 'name';
        
        return $this->select('agency.*, u.name as LastUserUpdateName, company.name as CompanyName, company.agency_connection as agency_connection')
                    ->join('user u', 'agency.id_last_user_update = u.id', 'left')
                    ->join('company', 'agency.id_company = company.id', 'left')
                    ->orderBy($sortField === 'companyName' ? 'company.name' : "agency.{$sortField}", $sortOrder)
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
        return $this->select('agency.*, u.name as LastUserUpdateName, company.name as CompanyName, company.agency_connection as agency_connection')
                    ->join('user u', 'agency.id_last_user_update = u.id', 'left')
                    ->join('company', 'agency.id_company = company.id', 'left')
                    ->where('agency.id', $id)
                    ->first();
    }

    /**
     * Obtener agencias por nombre (búsqueda parcial)
     */
    public function getAgenciesByName($name, $sortBy = 'Name', $sortOrder = 'ASC', $enabledOnly = true)
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
     * Obtener agencias por nombre con información del usuario
     */
    public function getAgenciesByNameWithUser($name, $sortBy = 'Name', $sortOrder = 'ASC', $enabledOnly = true)
    {
        // Mapear campos a snake_case
        $sortFieldMap = [
            'Name' => 'name',
            'RegistrationDate' => 'registration_date',
            'UpdateDate' => 'update_date'
        ];
        $sortField = $sortFieldMap[$sortBy] ?? 'name';
        
        $query = $this->select('agency.*, u.name as LastUserUpdateName, company.name as CompanyName, company.agency_connection as agency_connection')
                      ->join('user u', 'agency.id_last_user_update = u.id', 'left')
                      ->join('company', 'agency.id_company = company.id', 'left')
                      ->like('agency.name', $name);
        
        if ($enabledOnly) {
            $query->where('agency.enabled', 1);
        }
        
        return $query->orderBy($sortField === 'companyName' ? 'company.name' : "agency.{$sortField}", $sortOrder)->findAll();
    }

    /**
     * Obtener agencias por región (IdAgencyDMS)
     */
    public function getAgenciesByRegion($region, $sortBy = 'Name', $sortOrder = 'ASC', $enabledOnly = true)
    {
        // Mapear campos a snake_case
        $sortFieldMap = [
            'Name' => 'name',
            'RegistrationDate' => 'registration_date',
            'UpdateDate' => 'update_date'
        ];
        $sortField = $sortFieldMap[$sortBy] ?? 'name';
        
        $query = $this->where('id_agency_dms', $region);
        
        if ($enabledOnly) {
            $query->where('enabled', 1);
        }
        
        return $query->orderBy($sortField, $sortOrder)->findAll();
    }

    /**
     * Obtener agencias por región con información del usuario
     */
    public function getAgenciesByRegionWithUser($region, $sortBy = 'Name', $sortOrder = 'ASC', $enabledOnly = true)
    {
        // Mapear campos a snake_case
        $sortFieldMap = [
            'Name' => 'name',
            'RegistrationDate' => 'registration_date',
            'UpdateDate' => 'update_date'
        ];
        $sortField = $sortFieldMap[$sortBy] ?? 'name';
        
        $query = $this->select('agency.*, u.name as LastUserUpdateName, company.name as CompanyName, company.agency_connection as agency_connection')
                      ->join('user u', 'agency.id_last_user_update = u.id', 'left')
                      ->join('company', 'agency.id_company = company.id', 'left')
                      ->where('agency.id_agency_dms', $region);
        
        if ($enabledOnly) {
            $query->where('agency.enabled', 1);
        }
        
        return $query->orderBy($sortField === 'companyName' ? 'company.name' : "agency.{$sortField}", $sortOrder)->findAll();
    }

    /**
     * Contar total de agencias habilitadas
     */
    public function countEnabledAgencies()
    {
        return $this->where('enabled', 1)->countAllResults();
    }

    /**
     * Contar total de agencias deshabilitadas
     */
    public function countDisabledAgencies()
    {
        return $this->where('enabled', 0)->countAllResults();
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
        $query = $this->where('name', $name);
        
        if ($excludeId) {
            $query->where('id !=', $excludeId);
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
            $query->like('name', $filters['name']);
        }
        
        // Filtro por región deshabilitado - columna SubFix removida
        
        if (isset($filters['enabled'])) {
            $query->where('enabled', $filters['enabled']);
        }
        
        if (!empty($filters['date_from'])) {
            $query->where('registration_date >=', $filters['date_from']);
        }
        
        if (!empty($filters['date_to'])) {
            $query->where('registration_date <=', $filters['date_to']);
        }
        
        // Mapear campos a snake_case
        $sortFieldMap = [
            'Name' => 'name',
            'RegistrationDate' => 'registration_date',
            'UpdateDate' => 'update_date'
        ];
        $sortField = $sortFieldMap[$sortBy] ?? 'name';
        
        // Aplicar ordenamiento
        $query->orderBy($sortField, $sortOrder);
        
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
        // Mapear campos a snake_case
        $sortFieldMap = [
            'Name' => 'name',
            'RegistrationDate' => 'registration_date',
            'UpdateDate' => 'update_date'
        ];
        $sortField = $sortFieldMap[$sortBy] ?? 'name';
        
        return $this->select('agency.*, u.name as LastUserUpdateName')
                    ->join('user u', 'agency.id_last_user_update = u.id', 'left')
                    ->orderBy("agency.{$sortField}", $sortOrder)
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
        return $this->orderBy('registration_date', 'DESC')
                    ->limit($limit)
                    ->findAll();
    }

    /**
     * Obtener agencias recientemente actualizadas
     */
    public function getRecentlyUpdatedAgencies($limit = 10)
    {
        return $this->orderBy('update_date', 'DESC')
                    ->limit($limit)
                    ->findAll();
    }

    /**
     * Activar/desactivar agencia
     */
    public function toggleAgencyStatus($id, $status)
    {
        return $this->update($id, [
            'enabled' => $status,
            'update_date' => date('Y-m-d H:i:s')
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
        
        return $this->whereIn('id', $ids)->findAll();
    }

    /**
     * Verificar si una agencia existe y está habilitada
     */
    public function isAgencyActive($id)
    {
        $agency = $this->where('id', $id)
                       ->where('enabled', 1)
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
            $query->like('name', $filters['name']);
        }
        
        // Filtro por región deshabilitado - columna SubFix removida
        
        if (isset($filters['enabled'])) {
            $query->where('enabled', $filters['enabled']);
        }
        
        if (!empty($filters['date_from'])) {
            $query->where('registration_date >=', $filters['date_from']);
        }
        
        if (!empty($filters['date_to'])) {
            $query->where('registration_date <=', $filters['date_to']);
        }
        
        return $query->countAllResults();
    }
}
