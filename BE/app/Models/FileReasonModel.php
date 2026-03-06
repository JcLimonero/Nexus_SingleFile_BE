<?php

namespace App\Models;

use CodeIgniter\Model;

class FileReasonModel extends Model
{
    protected $table            = 'file_reasons';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'id', 'name', 'id_type_reason', 'enabled', 'registration_date', 'update_date', 'id_last_user_update'
    ];

    protected bool $allowEmptyInserts = false;
    protected bool $updateOnlyChanged = true;

    protected array $casts = [];
    protected array $castHandlers = [];

    // Dates
    protected $useTimestamps = false;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'registration_date';
    protected $updatedField  = 'update_date';

    // Validation (snake_case)
    protected $validationRules      = [
        'name' => 'required|max_length[500]'
    ];
    protected $validationMessages   = [
        'name' => [
            'required' => 'El nombre del motivo es requerido',
            'max_length' => 'El nombre del motivo no puede exceder 500 caracteres'
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
     * Obtener motivos activos
     */
    private function mapSortField($sortBy)
    {
        $map = ['Name' => 'name', 'Id' => 'id', 'IdTypeReason' => 'id_type_reason', 'Enabled' => 'enabled', 'RegistrationDate' => 'registration_date', 'UpdateDate' => 'update_date'];
        return $map[$sortBy] ?? 'name';
    }

    public function getActiveFileReasons()
    {
        $results = $this->where('enabled', 1)->orderBy('name', 'ASC')->findAll();
        
        foreach ($results as &$result) {
            $idType = $result['id_type_reason'] ?? $result['IdTypeReason'] ?? 0;
            $result['type_reason_label'] = $idType == 4 ? 'Aprobación' : 'Rechazo';
        }
        
        return $results;
    }

    /**
     * Obtener motivo por nombre
     */
    public function getFileReasonByName($name)
    {
        return $this->where('name', $name)->first();
    }

    /**
     * Obtener motivos con filtros (snake_case)
     */
    public function getFileReasonsWithFilters($filters = [])
    {
        $builder = $this->builder();
        
        if (!empty($filters['search'])) {
            $builder->like('name', $filters['search']);
        }

        if (isset($filters['id_type_reason']) && $filters['id_type_reason'] !== '') {
            $builder->where('id_type_reason', $filters['id_type_reason']);
        }

        $sortBy = $this->mapSortField($filters['sort_by'] ?? 'Name');
        $sortOrder = $filters['sort_order'] ?? 'ASC';
        $builder->orderBy($sortBy, $sortOrder);

        if (isset($filters['limit']) && $filters['limit'] !== null) {
            $builder->limit($filters['limit']);
        }
        
        if (isset($filters['offset']) && $filters['offset'] !== null) {
            $builder->offset($filters['offset']);
        }

        $results = $builder->get()->getResultArray();
        
        foreach ($results as &$result) {
            $idType = $result['id_type_reason'] ?? $result['IdTypeReason'] ?? 0;
            $result['type_reason_label'] = $idType == 4 ? 'Aprobación' : 'Rechazo';
        }
        
        return $results;
    }

    /**
     * Contar motivos con filtros
     */
    public function countFileReasonsWithFilters($filters = [])
    {
        $builder = $this->builder();
        
        if (!empty($filters['search'])) {
            $builder->like('name', $filters['search']);
        }

        if (isset($filters['id_type_reason']) && $filters['id_type_reason'] !== '') {
            $builder->where('id_type_reason', $filters['id_type_reason']);
        }

        return $builder->countAllResults();
    }

    /**
     * Obtener estadísticas de motivos
     */
    public function getFileReasonStats()
    {
        $builder = $this->builder();
        
        $total = $builder->countAllResults();
        
        $typeReasonStats = $this->db->table('file_reasons')
            ->select('id_type_reason, COUNT(*) as count')
            ->groupBy('id_type_reason')
            ->get()
            ->getResultArray();

        return [
            'total_reasons' => $total,
            'type_reason_stats' => $typeReasonStats
        ];
    }

    /**
     * Buscar motivos
     */
    public function searchFileReasons($searchTerm, $limit = 10)
    {
        $results = $this->like('name', $searchTerm)
                    ->orderBy('name', 'ASC')
                    ->limit($limit)
                    ->findAll();
        
        foreach ($results as &$result) {
            $idType = $result['id_type_reason'] ?? $result['IdTypeReason'] ?? 0;
            $result['type_reason_label'] = $idType == 4 ? 'Aprobación' : 'Rechazo';
        }
        
        return $results;
    }

    /**
     * Cambiar estado del motivo de rechazo
     */
    public function toggleStatus($id)
    {
        $fileReason = $this->find($id);
        if (!$fileReason) {
            return false;
        }

        $enabled = $fileReason['enabled'] ?? $fileReason['Enabled'] ?? 1;
        $newStatus = $enabled == 1 ? 0 : 1;
        return $this->update($id, ['enabled' => $newStatus]);
    }
}
