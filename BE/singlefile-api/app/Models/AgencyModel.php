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
        'IdLastUserUpdate', 'Enabled', 'SubFix', 'IdAgency'
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
    protected $validationRules = [];
    protected $validationMessages = [];
    protected $skipValidation = false;
    protected $cleanValidationRules = true;

    // Callbacks
    protected $allowCallbacks = true;
    protected $beforeInsert = [];
    protected $afterInsert = [];
    protected $beforeUpdate = [];
    protected $afterUpdate = [];
    protected $beforeFind = [];
    protected $afterFind = [];
    protected $beforeDelete = [];
    protected $afterDelete = [];

    /**
     * Obtener todas las agencias habilitadas
     */
    public function getAllEnabledAgencies()
    {
        return $this->where('Enabled', 1)
                    ->orderBy('Name', 'ASC')
                    ->findAll();
    }

    /**
     * Obtener todas las agencias (incluyendo deshabilitadas)
     */
    public function getAllAgencies()
    {
        return $this->orderBy('Name', 'ASC')
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
     * Obtener agencias por nombre (búsqueda parcial)
     */
    public function getAgenciesByName($name)
    {
        return $this->like('Name', $name)
                    ->where('Enabled', 1)
                    ->orderBy('Name', 'ASC')
                    ->findAll();
    }

    /**
     * Obtener agencias por región (SubFix)
     */
    public function getAgenciesByRegion($region)
    {
        return $this->where('SubFix', $region)
                    ->where('Enabled', 1)
                    ->orderBy('Name', 'ASC')
                    ->findAll();
    }

    /**
     * Contar total de agencias habilitadas
     */
    public function countEnabledAgencies()
    {
        return $this->where('Enabled', 1)->countAllResults();
    }

    /**
     * Contar total de agencias
     */
    public function countAllAgencies()
    {
        return $this->countAllResults();
    }
}
