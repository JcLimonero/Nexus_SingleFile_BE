<?php

namespace App\Models;

use CodeIgniter\Model;

class FileExtraordinaryReasonModel extends Model
{
    protected $table            = 'expedient_exception_reason';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'id', 'name', 'id_type_reason', 'enabled', 'registration_date', 'update_date', 'id_last_user_update'
    ];

    // Validation
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

    // Timestamps
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'registration_date';
    protected $updatedField  = 'update_date';

    /**
     * Obtener motivos activos
     */
    public function getActiveFileExtraordinaryReasons()
    {
        $results = $this->where('enabled', 1)->orderBy('name', 'ASC')->findAll();
        
        // Agregar descripción del tipo de razón y aliases para compatibilidad con frontend
        foreach ($results as &$result) {
            $idType = $result['id_type_reason'] ?? $result['IdTypeReason'] ?? 0;
            $result['TypeReasonLabel'] = $idType == 2 ? 'Excepción' : 'Cancelación';
            $result['IdTypeReason'] = $idType;
            $result['Id'] = $result['id'] ?? $result['Id'] ?? null;
            $result['Name'] = $result['name'] ?? $result['Name'] ?? '';
            $result['Enabled'] = $result['enabled'] ?? $result['Enabled'] ?? 1;
        }
        
        return $results;
    }

    /**
     * Obtener motivo por nombre
     */
    public function getFileExtraordinaryReasonByName($name)
    {
        return $this->where('name', $name)->first();
    }

    /**
     * Obtener motivos con filtros
     */
    public function getFileExtraordinaryReasonsWithFilters($filters = [])
    {
        $builder = $this->builder();
        
        // Aplicar filtros
        if (!empty($filters['search'])) {
            $builder->like('name', $filters['search']);
        }

        if (isset($filters['id_type_reason']) && $filters['id_type_reason'] !== '') {
            $builder->where('id_type_reason', $filters['id_type_reason']);
        }

        // Ordenamiento
        $sortBy = $filters['sort_by'] ?? 'name';
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
        
        // Agregar descripción del tipo de razón y aliases para compatibilidad con frontend
        foreach ($results as &$result) {
            $idType = $result['id_type_reason'] ?? $result['IdTypeReason'] ?? 0;
            $result['TypeReasonLabel'] = $idType == 2 ? 'Excepción' : 'Cancelación';
            $result['IdTypeReason'] = $idType;
            $result['Id'] = $result['id'] ?? $result['Id'] ?? null;
            $result['Name'] = $result['name'] ?? $result['Name'] ?? '';
            $result['Enabled'] = $result['enabled'] ?? $result['Enabled'] ?? 1;
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
    public function getFileExtraordinaryReasonStats()
    {
        $builder = $this->builder();
        
        $total = $builder->countAllResults();
        
        // Contar por tipo de razón
        $typeReasonStats = $this->db->table('expedient_exception_reason')
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
    public function searchFileExtraordinaryReasons($searchTerm, $limit = 10)
    {
        $results = $this->like('name', $searchTerm)
                    ->orderBy('name', 'ASC')
                    ->limit($limit)
                    ->findAll();
        
        // Agregar descripción del tipo de razón y aliases para compatibilidad con frontend
        foreach ($results as &$result) {
            $idType = $result['id_type_reason'] ?? $result['IdTypeReason'] ?? 0;
            $result['TypeReasonLabel'] = $idType == 2 ? 'Excepción' : 'Cancelación';
            $result['IdTypeReason'] = $idType;
            $result['Id'] = $result['id'] ?? $result['Id'] ?? null;
            $result['Name'] = $result['name'] ?? $result['Name'] ?? '';
            $result['Enabled'] = $result['enabled'] ?? $result['Enabled'] ?? 1;
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

        $enabled = $fileExtraordinaryReason['enabled'] ?? $fileExtraordinaryReason['Enabled'] ?? 1;
        $newStatus = $enabled == 1 ? 0 : 1;
        return $this->update($id, ['enabled' => $newStatus]);
    }
}
