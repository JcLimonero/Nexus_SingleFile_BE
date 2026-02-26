<?php

namespace App\Models;

use CodeIgniter\Model;

class CompanyModel extends Model
{
    protected $table = 'Company';
    protected $primaryKey = 'Id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $allowedFields = ['Id', 'Name'];

    /**
     * Obtener todas las compañías ordenadas por nombre
     */
    public function getAllCompanies($sortBy = 'Name', $sortOrder = 'ASC')
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
