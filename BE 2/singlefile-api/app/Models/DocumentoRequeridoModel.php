<?php

    namespace App\Models;

use CodeIgniter\Model;

class DocumentoRequeridoModel extends Model
{
    protected $table            = 'ConfigurationProcess_DocumentType';
    protected $primaryKey       = 'Id';
    protected $useAutoIncrement = false;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'Id', 'IdDocumentType', 'IdConfigurationProcess'
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
        'IdDocumentType' => 'required|integer',
        'IdConfigurationProcess' => 'required|integer'
    ];
    
    protected $validationMessages   = [
        'IdDocumentType' => [
            'required' => 'El ID del tipo de documento es requerido',
            'integer' => 'El ID del tipo de documento debe ser un número válido'
        ],
        'IdConfigurationProcess' => [
            'required' => 'El ID de la configuración del proceso es requerido',
            'integer' => 'El ID de la configuración del proceso debe ser un número válido'
        ]
    ];
    
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    // Callbacks
    protected $allowCallbacks = true;
    protected $beforeInsert   = ['generateId'];
    protected $afterInsert    = [];
    protected $beforeUpdate   = [];
    protected $afterUpdate    = [];
    protected $beforeFind     = [];
    protected $afterFind      = [];
    protected $beforeDelete   = [];
    protected $afterDelete    = [];

    /**
     * Generar ID único para nuevo documento requerido
     */
    protected function generateId(array $data)
    {
        if (empty($data['data']['Id'])) {
            $data['data']['Id'] = $this->getNextId();
        }
        return $data;
    }

    /**
     * Obtener el siguiente ID disponible
     */
    private function getNextId()
    {
        $lastDoc = $this->orderBy('Id', 'DESC')->first();
        if ($lastDoc) {
            return (int)$lastDoc['Id'] + 1;
        }
        return 1;
    }

    /**
     * Obtener documentos requeridos con filtros y paginación
     */
    public function getDocumentosRequeridos($filters = [], $limit = null, $offset = null, $sortBy = 'Id', $sortOrder = 'ASC')
    {
        $builder = $this->builder('ConfigurationProcess_DocumentType cpd');
        
        // Seleccionar campos con joins
        $builder->select('
            cpd.Id,
            cpd.IdDocumentType,
            cpd.IdConfigurationProcess,
            cp.IdProcess,
            cp.IdAgency,
            cp.IdOperationType,
            cp.IdCostumerType,
            cp.Enabled,
            cp.RegistrationDate,
            cp.UpdateDate,
            cp.IdLastUserUpdate,
            p.Name as ProcesoName,
            a.Name as AgenciaName,
            ot.Name as TipoOperacionName,
            ct.Name as TipoClienteName,
            dt.Name as TipoDocumentoName,
            dt.Required,
            dt.ReqExpiration
        ');
        
        // Joins con tablas relacionadas
        $builder->join('ConfigurationProcess cp', 'cp.Id = cpd.IdConfigurationProcess', 'left');
        $builder->join('Process p', 'p.Id = cp.IdProcess', 'left');
        $builder->join('Agency a', 'a.Id = cp.IdAgency', 'left');
        $builder->join('OperationType ot', 'ot.Id = cp.IdOperationType', 'left');
        $builder->join('CostumerType ct', 'ct.Id = cp.IdCostumerType', 'left');
        $builder->join('DocumentType dt', 'dt.Id = cpd.IdDocumentType', 'left');
        
        // Aplicar filtros
        if (!empty($filters['IdProcess'])) {
            $builder->where('cp.IdProcess', $filters['IdProcess']);
        }
        if (!empty($filters['IdAgency'])) {
            $builder->where('cp.IdAgency', $filters['IdAgency']);
        }
        if (!empty($filters['IdCostumerType'])) {
            $builder->where('cp.IdCostumerType', $filters['IdCostumerType']);
        }
        if (!empty($filters['IdOperationType'])) {
            $builder->where('cp.IdOperationType', $filters['IdOperationType']);
        }
        if (!empty($filters['IdDocumentType'])) {
            $builder->where('cpd.IdDocumentType', $filters['IdDocumentType']);
        }
        // Solo aplicar filtro de Enabled si se especifica explícitamente
        if (isset($filters['Enabled']) && $filters['Enabled'] !== null) {
            $builder->where('cp.Enabled', $filters['Enabled']);
        }
        
        // Aplicar ordenamiento
        $builder->orderBy($sortBy, $sortOrder);
        
        // Aplicar paginación
        if ($limit !== null) {
            $builder->limit($limit);
        }
        if ($offset !== null) {
            $builder->offset($offset);
        }
        
        return $builder->get()->getResultArray();
    }

    /**
     * Contar documentos requeridos con filtros
     */
    public function countDocumentosRequeridos($filters = [])
    {
        $builder = $this->builder('ConfigurationProcess_DocumentType cpd');
        $builder->join('ConfigurationProcess cp', 'cp.Id = cpd.IdConfigurationProcess', 'left');
        
        // Aplicar filtros
        if (!empty($filters['IdProcess'])) {
            $builder->where('cp.IdProcess', $filters['IdProcess']);
        }
        if (!empty($filters['IdAgency'])) {
            $builder->where('cp.IdAgency', $filters['IdAgency']);
        }
        if (!empty($filters['IdCostumerType'])) {
            $builder->where('cp.IdCostumerType', $filters['IdCostumerType']);
        }
        if (!empty($filters['IdOperationType'])) {
            $builder->where('cp.IdOperationType', $filters['IdOperationType']);
        }
        if (!empty($filters['IdDocumentType'])) {
            $builder->where('cpd.IdDocumentType', $filters['IdDocumentType']);
        }
        // Solo aplicar filtro de Enabled si se especifica explícitamente
        if (isset($filters['Enabled']) && $filters['Enabled'] !== null) {
            $builder->where('cp.Enabled', $filters['Enabled']);
        }
        
        return $builder->countAllResults();
    }

    /**
     * Obtener estadísticas de documentos requeridos
     */
    public function getDocumentosRequeridosStats()
    {
        $total = $this->countAllResults();
        
        // Contar configuraciones únicas
        $configuracionesCount = $this->db->table('ConfigurationProcess')
                                        ->where('Enabled', 1)
                                        ->countAllResults();
        
        // Contar procesos únicos
        $procesosCount = $this->db->table('ConfigurationProcess')
                                 ->select('COUNT(DISTINCT IdProcess) as count')
                                 ->where('Enabled', 1)
                                 ->get()
                                 ->getRow()->count;
        
        // Contar agencias únicas
        $agenciasCount = $this->db->table('ConfigurationProcess')
                                 ->select('COUNT(DISTINCT IdAgency) as count')
                                 ->where('Enabled', 1)
                                 ->get()
                                 ->getRow()->count;
        
        return [
            'total_documentos' => $total,
            'configuraciones_activas' => $configuracionesCount,
            'procesos_count' => $procesosCount,
            'agencias_count' => $agenciasCount
        ];
    }

    /**
     * Obtener o crear configuración de proceso
     */
    public function getOrCreateConfigurationProcess($idProcess, $idAgency, $idCostumerType, $idOperationType)
    {
        // Usar el modelo ConfigurationProcessModel
        $configProcessModel = new \App\Models\ConfigurationProcessModel();
        return $configProcessModel->getOrCreateConfiguration($idProcess, $idAgency, $idCostumerType, $idOperationType);
    }

    /**
     * Verificar si ya existe un documento requerido para la configuración
     */
    public function existsDocumentoRequerido($idProcess, $idAgency, $idCostumerType, $idOperationType, $idDocumentType, $excludeId = null)
    {
        $builder = $this->db->table('ConfigurationProcess_DocumentType cpd');
        $builder->join('ConfigurationProcess cp', 'cp.Id = cpd.IdConfigurationProcess', 'left');
        
        $builder->where('cp.IdProcess', $idProcess)
                ->where('cp.IdAgency', $idAgency)
                ->where('cp.IdCostumerType', $idCostumerType)
                ->where('cp.IdOperationType', $idOperationType)
                ->where('cpd.IdDocumentType', $idDocumentType);
        
        if ($excludeId) {
            $builder->where('cpd.Id !=', $excludeId);
        }
        
        return $builder->countAllResults() > 0;
    }

    /**
     * Obtener documentos requeridos con información de relaciones
     */
    public function getDocumentosRequeridosWithRelations($filters = [], $limit = null, $offset = null)
    {
        return $this->getDocumentosRequeridos($filters, $limit, $offset);
    }

    /**
     * Crear documento requerido
     */
    public function createDocumentoRequerido($data)
    {
        // Obtener o crear configuración de proceso
        $idConfigProcess = $this->getOrCreateConfigurationProcess(
            $data['IdProcess'],
            $data['IdAgency'],
            $data['IdCostumerType'],
            $data['IdOperationType']
        );
        
        // Insertar en la tabla de relación
        $insertData = [
            'IdDocumentType' => $data['IdDocumentType'],
            'IdConfigurationProcess' => $idConfigProcess
        ];
        
        return $this->insert($insertData);
    }

    /**
     * Actualizar documento requerido
     */
    public function updateDocumentoRequerido($id, $data)
    {
        // Si se cambia la configuración, crear nueva o usar existente
        if (isset($data['IdProcess']) || isset($data['IdAgency']) || 
            isset($data['IdCostumerType']) || isset($data['IdOperationType'])) {
            
            $idConfigProcess = $this->getOrCreateConfigurationProcess(
                $data['IdProcess'] ?? $data['IdProcess'],
                $data['IdAgency'] ?? $data['IdAgency'],
                $data['IdCostumerType'] ?? $data['IdCostumerType'],
                $data['IdOperationType'] ?? $data['IdOperationType']
            );
            
            $data['IdConfigurationProcess'] = $idConfigProcess;
        }
        
        // Actualizar solo los campos permitidos
        $updateData = [];
        if (isset($data['IdDocumentType'])) $updateData['IdDocumentType'] = $data['IdDocumentType'];
        if (isset($data['IdConfigurationProcess'])) $updateData['IdConfigurationProcess'] = $data['IdConfigurationProcess'];
        
        return $this->update($id, $updateData);
    }
}
