<?php

namespace App\Models;

use CodeIgniter\Model;

class DocumentTypeModel extends Model
{
    protected $table            = 'DocumentType';
    protected $primaryKey       = 'Id';
    protected $useAutoIncrement = false;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'Id', 'Name', 'Enabled', 'RegistrationDate', 'UpdateDate', 'IdLastUserUpdate',
        'ReqExpiration', 'IdProcessType', 'Required', 'IdSubProcess'
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
            'required' => 'El nombre del tipo de documento es requerido',
            'max_length' => 'El nombre del tipo de documento no puede exceder 600 caracteres',
            'is_unique' => 'Ya existe un tipo de documento con este nombre'
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
     * Obtener tipos de documento activos
     */
    public function getActiveDocumentTypes()
    {
        return $this->where('Enabled', 1)->orderBy('Name', 'ASC')->findAll();
    }

    /**
     * Obtener tipo de documento por nombre
     */
    public function getDocumentTypeByName($name)
    {
        return $this->where('Name', $name)->first();
    }

    /**
     * Cambiar estado del tipo de documento
     */
    public function toggleStatus($id)
    {
        $documentType = $this->find($id);
        if (!$documentType) {
            return false;
        }

        $newStatus = $documentType['Enabled'] == 1 ? 0 : 1;
        return $this->update($id, ['Enabled' => $newStatus]);
    }

    /**
     * Obtener tipos de documento con relaciones
     */
    public function getDocumentTypesWithRelations($filters = [])
    {
        $builder = $this->db->table('DocumentType dt');
        
        $builder->select('
            dt.Id,
            dt.Name,
            dt.Enabled,
            dt.RegistrationDate,
            dt.UpdateDate,
            dt.IdLastUserUpdate,
            dt.ReqExpiration,
            dt.IdProcessType,
            dt.Required,
            dt.IdSubProcess,
            u.Name as LastUserUpdateName,
            fs.Name as ProcessTypeName,
            sp.Name as SubProcessName
        ');

        // JOINs para obtener las descripciones
        $builder->join('User u', 'u.Id = dt.IdLastUserUpdate', 'left');
        $builder->join('`File_Status` fs', 'fs.Id = dt.IdProcessType', 'left');
        $builder->join('Process sp', 'sp.Id = dt.IdSubProcess', 'left');

        // Aplicar filtros
        if (!empty($filters['enabled'])) {
            $builder->where('dt.Enabled', $filters['enabled']);
        }

        if (!empty($filters['required'])) {
            $builder->where('dt.Required', $filters['required']);
        }

        if (!empty($filters['req_expiration'])) {
            $builder->where('dt.ReqExpiration', $filters['req_expiration']);
        }

        if (!empty($filters['process_type'])) {
            $builder->where('dt.IdProcessType', $filters['process_type']);
        }

        if (!empty($filters['phase'])) {
            $builder->where('fs.Name', $filters['phase']);
        }

        if (!empty($filters['search'])) {
            $builder->groupStart();
            $builder->like('dt.Name', $filters['search']);
            $builder->orLike('fs.Name', $filters['search']);
            $builder->orLike('sp.Name', $filters['search']);
            $builder->groupEnd();
        }

        // Ordenamiento
        $sortBy = $filters['sort_by'] ?? 'Name';
        $sortOrder = $filters['sort_order'] ?? 'ASC';
        $builder->orderBy("dt.$sortBy", $sortOrder);

        // Paginación
        if (!empty($filters['limit'])) {
            $offset = $filters['offset'] ?? 0;
            $builder->limit($filters['limit'], $offset);
        }

        return $builder->get()->getResultArray();
    }

    /**
     * Contar tipos de documento con filtros
     */
    public function countDocumentTypesWithFilters($filters = [])
    {
        $builder = $this->db->table('DocumentType dt');
        
        $builder->join('`File_Status` fs', 'fs.Id = dt.IdProcessType', 'left');
        $builder->join('Process sp', 'sp.Id = dt.IdSubProcess', 'left');

        // Aplicar los mismos filtros
        if (!empty($filters['enabled'])) {
            $builder->where('dt.Enabled', $filters['enabled']);
        }

        if (!empty($filters['required'])) {
            $builder->where('dt.Required', $filters['required']);
        }

        if (!empty($filters['req_expiration'])) {
            $builder->where('dt.ReqExpiration', $filters['req_expiration']);
        }

        if (!empty($filters['process_type'])) {
            $builder->where('dt.IdProcessType', $filters['process_type']);
        }

        if (!empty($filters['phase'])) {
            $builder->where('fs.Name', $filters['phase']);
        }

        if (!empty($filters['search'])) {
            $builder->groupStart();
            $builder->like('dt.Name', $filters['search']);
            $builder->orLike('fs.Name', $filters['search']);
            $builder->orLike('sp.Name', $filters['search']);
            $builder->groupEnd();
        }

        return $builder->countAllResults();
    }

    /**
     * Obtener tipo de documento específico con relaciones
     */
    public function getDocumentTypeWithRelations($id)
    {
        $builder = $this->db->table('DocumentType dt');
        
        $builder->select('
            dt.Id,
            dt.Name,
            dt.Enabled,
            dt.RegistrationDate,
            dt.UpdateDate,
            dt.IdLastUserUpdate,
            dt.ReqExpiration,
            dt.IdProcessType,
            dt.Required,
            dt.IdSubProcess,
            u.Name as LastUserUpdateName,
            fs.Name as ProcessTypeName,
            sp.Name as SubProcessName
        ');

        $builder->join('User u', 'u.Id = dt.IdLastUserUpdate', 'left');
        $builder->join('`File_Status` fs', 'fs.Id = dt.IdProcessType', 'left');
        $builder->join('Process sp', 'sp.Id = dt.IdSubProcess', 'left');
        
        $builder->where('dt.Id', $id);

        return $builder->get()->getRowArray();
    }
}
