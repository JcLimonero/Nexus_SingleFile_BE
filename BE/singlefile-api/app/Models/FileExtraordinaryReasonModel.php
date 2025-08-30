<?php

namespace App\Models;

use CodeIgniter\Model;

class FileExtraordinaryReasonModel extends Model
{
    protected $table            = 'File_Extraordinary_Reasons';
    protected $primaryKey       = 'Id';
    protected $useAutoIncrement = false;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'Id', 'Name', 'IdTypeReason', 'Enabled', 'RegistrationDate', 'UpdateDate', 'IdLastUserUpdate'
    ];

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

    // Timestamps
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'RegistrationDate';
    protected $updatedField  = 'UpdateDate';

    /**
     * Obtener motivos activos
     */
    public function getActiveFileExtraordinaryReasons()
    {
        $results = $this->where('Enabled', 1)->orderBy('Name', 'ASC')->findAll();
        
        // Agregar descripción del tipo de razón
        foreach ($results as &$result) {
            $result['TypeReasonLabel'] = $result['IdTypeReason'] == 2 ? 'Excepción' : 'Cancelación';
        }
        
        return $results;
    }

    /**
     * Obtener motivo por nombre
     */
    public function getFileExtraordinaryReasonByName($name)
    {
        return $this->where('Name', $name)->first();
    }

    /**
     * Obtener motivos con filtros
     */
    public function getFileExtraordinaryReasonsWithFilters($filters = [])
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
            $result['TypeReasonLabel'] = $result['IdTypeReason'] == 2 ? 'Excepción' : 'Cancelación';
        }
        
        return $results;
    }

    /**
     * Contar motivos con filtros
     */
    public function countFileExtraordinaryReasonsWithFilters($filters = [])
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
    public function getFileExtraordinaryReasonStats()
    {
        $builder = $this->builder();
        
        $total = $builder->countAllResults();
        
        // Contar por tipo de razón
        $typeReasonStats = $this->db->table('File_Extraordinary_Reasons')
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
    public function searchFileExtraordinaryReasons($searchTerm, $limit = 10)
    {
        $results = $this->like('Name', $searchTerm)
                    ->orderBy('Name', 'ASC')
                    ->limit($limit)
                    ->findAll();
        
        // Agregar descripción del tipo de razón
        foreach ($results as &$result) {
            $result['TypeReasonLabel'] = $result['IdTypeReason'] == 2 ? 'Excepción' : 'Cancelación';
        }
        
        return $results;
    }

    /**
     * Cambiar estado del motivo
     */
    public function toggleStatus($id)
    {
        $fileExtraordinaryReason = $this->find($id);
        if (!$fileExtraordinaryReason) {
            return false;
        }

        $newStatus = $fileExtraordinaryReason['Enabled'] == 1 ? 0 : 1;
        return $this->update($id, ['Enabled' => $newStatus]);
    }
}
