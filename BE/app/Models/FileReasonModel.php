<?php

namespace App\Models;

use CodeIgniter\Model;

class FileReasonModel extends Model
{
    protected $table            = 'File_Reasons';
    protected $primaryKey       = 'Id';
    protected $useAutoIncrement = false;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'Id', 'Name', 'IdTypeReason', 'Enabled', 'RegistrationDate', 'UpdateDate', 'IdLastUserUpdate'
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

    // Validation
    protected $validationRules      = [
        'Name' => 'required|max_length[500]'
    ];
    protected $validationMessages   = [
        'Name' => [
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
    public function getActiveFileReasons()
    {
        $results = $this->where('Enabled', 1)->orderBy('Name', 'ASC')->findAll();
        
        // Agregar descripción del tipo de razón
        foreach ($results as &$result) {
            $result['TypeReasonLabel'] = $result['IdTypeReason'] == 4 ? 'Aprobación' : 'Rechazo';
        }
        
        return $results;
    }



    /**
     * Obtener motivo por nombre
     */
    public function getFileReasonByName($name)
    {
        return $this->where('Name', $name)->first();
    }

    /**
     * Obtener motivos con filtros
     */
    public function getFileReasonsWithFilters($filters = [])
    {
        $builder = $this->builder();
        
        // Aplicar filtros
        if (!empty($filters['search'])) {
            $builder->like('Name', $filters['search']);
        }

        if (isset($filters['id_type_reason']) && $filters['id_type_reason'] !== '') {
            $builder->where('IdTypeReason', $filters['id_type_reason']);
        }

        // Ordenamiento
        $sortBy = $filters['sort_by'] ?? 'Name';
        $sortOrder = $filters['sort_order'] ?? 'ASC';
        $builder->orderBy($sortBy, $sortOrder);

        // Paginación
        if (isset($filters['limit']) && $filters['limit'] !== null) {
            $builder->limit($filters['limit']);
        }
        
        if (isset($filters['offset']) && $filters['offset'] !== null) {
            $builder->offset($filters['offset']);
        }

        $results = $builder->get()->getResultArray();
        
        // Agregar descripción del tipo de razón
        foreach ($results as &$result) {
            $result['TypeReasonLabel'] = $result['IdTypeReason'] == 4 ? 'Aprobación' : 'Rechazo';
        }
        
        return $results;
    }

    /**
     * Contar motivos con filtros
     */
    public function countFileReasonsWithFilters($filters = [])
    {
        $builder = $this->builder();
        
        // Aplicar filtros
        if (!empty($filters['search'])) {
            $builder->like('Name', $filters['search']);
        }

        if (isset($filters['id_type_reason']) && $filters['id_type_reason'] !== '') {
            $builder->where('IdTypeReason', $filters['id_type_reason']);
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
        
        // Contar por tipo de razón
        $typeReasonStats = $this->db->table('File_Reasons')
            ->select('IdTypeReason, COUNT(*) as count')
            ->groupBy('IdTypeReason')
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
        $results = $this->like('Name', $searchTerm)
                    ->orderBy('Name', 'ASC')
                    ->limit($limit)
                    ->findAll();
        
        // Agregar descripción del tipo de razón
        foreach ($results as &$result) {
            $result['TypeReasonLabel'] = $result['IdTypeReason'] == 4 ? 'Aprobación' : 'Rechazo';
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

        $newStatus = $fileReason['Enabled'] == 1 ? 0 : 1;
        return $this->update($id, ['Enabled' => $newStatus]);
    }
}
