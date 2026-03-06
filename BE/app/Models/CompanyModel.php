<?php

namespace App\Models;

use CodeIgniter\Model;

class CompanyModel extends Model
{
    protected $table = 'company';
    protected $primaryKey = 'Id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $allowedFields = ['Id', 'name', 'RegistrationDate', 'UpdateDate', 'IdLastUserUpdate', 'Enabled', 'AgencyConnection'];
    
    // Dates
    protected $useTimestamps = false;
    protected $dateFormat = 'datetime';
    protected $createdField = 'RegistrationDate';
    protected $updatedField = 'UpdateDate';
    protected $deletedField = 'deleted_at';

    /**
     * Obtener todas las compañías ordenadas por nombre
     */
    public function getAllCompanies($sortBy = 'name', $sortOrder = 'ASC')
    {
        return $this->orderBy($sortBy, $sortOrder)->findAll();
    }

    /**
     * Obtener compañía por ID
     */
    public function getCompanyById($id)
    {
        return $this->find($id);
    }
}
