<?php

    namespace App\Models;

use CodeIgniter\Model;

class DocumentoRequeridoModel extends Model
{
    protected $table            = 'configuration_process_document_type';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = false;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'id', 'id_document_type', 'id_configuration_process', 'id_last_user_update'
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
    protected $deletedField  = 'deleted_at';

    // Validation (snake_case)
    protected $validationRules      = [
        'id_document_type' => 'required|integer',
        'id_configuration_process' => 'required|integer'
    ];
    
    protected $validationMessages   = [
        'id_document_type' => [
            'required' => 'El ID del tipo de documento es requerido',
            'integer' => 'El ID del tipo de documento debe ser un número válido'
        ],
        'id_configuration_process' => [
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
        if (empty($data['data']['id'])) {
            $data['data']['id'] = $this->getNextId();
        }
        return $data;
    }

    /**
     * Obtener el siguiente ID disponible
     */
    private function getNextId()
    {
        $lastDoc = $this->orderBy('id', 'DESC')->first();
        if ($lastDoc) {
            return (int)$lastDoc['id'] + 1;
        }
        return 1;
    }

    /**
     * Obtener documentos requeridos con filtros y paginación
     */
    public function getDocumentosRequeridos($filters = [], $limit = null, $offset = null, $sortBy = 'id', $sortOrder = 'ASC')
    {
        try {
            // Usar db->table() directamente para tener más control sobre el alias
            $builder = $this->db->table('configuration_process_document_type cpd');
            
            // Seleccionar campos con joins
            $builder->select('
            cpd.id,
            cpd.id_document_type,
            cpd.id_configuration_process,
            cp.id_sale_type,
            cp.id_agency,
            cp.id_operation_type,
            cp.id_customer_type,
            cp.enabled,
            cp.registration_date,
            cp.update_date,
            cp.id_last_user_update,
            p.name as proceso_name,
            a.name as agencia_name,
            ot.name as tipo_operacion_name,
            ct.name as tipo_cliente_name,
            dt.name as tipo_documento_name,
            dt.required,
            dt.req_expiration,
            dt.id_sale_type,
            dt.id_sub_sale_type,
            fs.name as process_type_name,
            sp.name as sub_process_name
            ');
            
            // Joins con tablas relacionadas
            $builder->join('configuration_process cp', 'cp.id = cpd.id_configuration_process', 'left');
            $builder->join('process p', 'p.id = cp.id_sale_type', 'left');
            $builder->join('agency a', 'a.id = cp.id_agency', 'left');
            $builder->join('operation_type ot', 'ot.id = cp.id_operation_type', 'left');
            $builder->join('customer_type ct', 'ct.id = cp.id_customer_type', 'left');
            $builder->join('document_type dt', 'dt.id = cpd.id_document_type', 'left');
            $builder->join('file_state fs', 'fs.id = dt.id_sale_type', 'left');
            $builder->join('file_sub_state sp', 'sp.id = dt.id_sub_sale_type', 'left');
            
            if (!empty($filters['id_sale_type'])) {
                $builder->where('cp.id_sale_type', $filters['id_sale_type']);
            }
            if (!empty($filters['id_agency'])) {
                $builder->where('cp.id_agency', $filters['id_agency']);
            }
            if (!empty($filters['id_company'])) {
                $builder->where('a.id_company', $filters['id_company']);
            }
            if (!empty($filters['id_customer_type'])) {
                $builder->where('cp.id_customer_type', $filters['id_customer_type']);
            }
            if (!empty($filters['id_operation_type'])) {
                $builder->where('cp.id_operation_type', $filters['id_operation_type']);
            }
            if (!empty($filters['id_document_type'])) {
                $builder->where('cpd.id_document_type', $filters['id_document_type']);
            }
            if (isset($filters['enabled']) && $filters['enabled'] !== null) {
                $builder->where('cp.enabled', $filters['enabled']);
            }
            if (!empty($filters['id'])) {
                $builder->where('cpd.id', $filters['id']);
            }
            
            $sortFieldMap = [
                'id' => 'cpd.id',
                'name' => 'dt.name',
                'proceso_name' => 'p.name',
                'agencia_name' => 'a.name',
                'tipo_operacion_name' => 'ot.name',
                'tipo_cliente_name' => 'ct.name',
                'tipo_documento_name' => 'dt.name',
                'enabled' => 'cp.enabled',
                'registration_date' => 'cp.registration_date',
                'update_date' => 'cp.update_date'
            ];
            
            // Usar el campo mapeado o el campo original si no está en el mapa
            $actualSortField = isset($sortFieldMap[$sortBy]) ? $sortFieldMap[$sortBy] : 'cpd.id';
            $sortOrder = strtoupper($sortOrder) === 'DESC' ? 'DESC' : 'ASC';
            $builder->orderBy($actualSortField, $sortOrder);
            
            // Aplicar paginación
            if (isset($limit) && $limit !== null && $limit !== 'all') {
                $limit = (int)$limit;
                if ($limit > 0) {
                    $offset = $offset ?? 0;
                    $builder->limit($limit, $offset);
                }
            }
            
            $result = $builder->get()->getResultArray();
            return $result;
        
        } catch (\CodeIgniter\Database\Exceptions\DatabaseException $e) {

            throw $e;
        } catch (\Exception $e) {

            throw $e;
        }
    }

    /**
     * Contar documentos requeridos con filtros
     */
    public function countDocumentosRequeridos($filters = [])
    {
        $builder = $this->db->table('configuration_process_document_type cpd');
        $builder->join('configuration_process cp', 'cp.id = cpd.id_configuration_process', 'left');
        
        // Aplicar filtros (mapear nombres de filtros PascalCase a snake_case)
        if (!empty($filters['id_sale_type'])) {
            $builder->where('cp.id_sale_type', $filters['id_sale_type']);
        }
        if (!empty($filters['id_agency'])) {
            $builder->where('cp.id_agency', $filters['id_agency']);
        }
        if (!empty($filters['id_company'])) {
            $builder->join('agency a', 'a.id = cp.id_agency', 'left');
            $builder->where('a.id_company', $filters['id_company']);
        }
        if (!empty($filters['id_customer_type'])) {
            $builder->where('cp.id_customer_type', $filters['id_customer_type']);
        }
        if (!empty($filters['id_operation_type'])) {
            $builder->where('cp.id_operation_type', $filters['id_operation_type']);
        }
        if (!empty($filters['id_document_type'])) {
            $builder->where('cpd.id_document_type', $filters['id_document_type']);
        }
        if (isset($filters['enabled']) && $filters['enabled'] !== null) {
            $builder->where('cp.enabled', $filters['enabled']);
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
        $configuracionesCount = $this->db->table('configuration_process')
                                        ->where('enabled', 1)
                                        ->countAllResults();
        
        // Contar procesos únicos
        $procesosCount = $this->db->table('configuration_process')
                                 ->select('COUNT(DISTINCT id_sale_type) as count')
                                 ->where('enabled', 1)
                                 ->get()
                                 ->getRow()->count;
        
        // Contar agencias únicas
        $agenciasCount = $this->db->table('configuration_process')
                                 ->select('COUNT(DISTINCT id_agency) as count')
                                 ->where('enabled', 1)
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
    public function getOrCreateconfiguration_process($idProcess, $idAgency, $idCustomerType, $idOperationType, $userId = null)
    {
        $configProcessModel = new \App\Models\ConfigurationProcessModel();
        return $configProcessModel->getOrCreateConfiguration($idProcess, $idAgency, $idCustomerType, $idOperationType, $userId);
    }

    /**
     * Obtener un documento requerido por ID con todas sus relaciones
     */
    public function findWithRelations($id)
    {
        $builder = $this->db->table('configuration_process_document_type cpd');
        
        $builder->select('
            cpd.id,
            cpd.id_document_type,
            cpd.id_configuration_process,
            cp.id_sale_type,
            cp.id_agency,
            cp.id_operation_type,
            cp.id_customer_type,
            cp.enabled,
            cp.registration_date,
            cp.update_date
        ');
        
        $builder->join('configuration_process cp', 'cp.id = cpd.id_configuration_process', 'left');
        $builder->where('cpd.id', $id);
        
        $result = $builder->get()->getRowArray();
        return $result ?: null;
    }

    /**
     * Verificar si ya existe un documento requerido para la configuración
     */
    public function existsDocumentoRequerido($idProcess, $idAgency, $idCustomerType, $idOperationType, $idDocumentType, $excludeId = null)
    {
        $builder = $this->db->table('configuration_process_document_type cpd');
        $builder->join('configuration_process cp', 'cp.id = cpd.id_configuration_process', 'left');
        
        $builder->where('cp.id_sale_type', $idProcess)
                ->where('cp.id_agency', $idAgency)
                ->where('cp.id_customer_type', $idCustomerType)
                ->where('cp.id_operation_type', $idOperationType)
                ->where('cpd.id_document_type', $idDocumentType);
        
        if ($excludeId) {
            $builder->where('cpd.id !=', $excludeId);
        }
        
        return $builder->countAllResults() > 0;
    }

    /**
     * Obtener documentos requeridos con información de relaciones
     */
    public function getDocumentosRequeridosWithRelations($filters = [], $limit = null, $offset = null, $sortBy = 'id', $sortOrder = 'ASC')
    {
        return $this->getDocumentosRequeridos($filters, $limit, $offset, $sortBy, $sortOrder);
    }

    /**
     * Crear documento requerido
     */
    public function createDocumentoRequerido($data)
    {
        $userId = $data['id_last_user_update'] ?? null;
        $idConfigProcess = $this->getOrCreateconfiguration_process(
            $data['id_sale_type'] ?? 0,
            $data['id_agency'] ?? 0,
            $data['id_customer_type'] ?? 0,
            $data['id_operation_type'] ?? 0,
            $userId
        );
        
        $insertData = [
            'id_document_type' => $data['id_document_type'] ?? null,
            'id_configuration_process' => $idConfigProcess,
            'id_last_user_update' => $userId ?? 1
        ];
        
        return $this->insert($insertData);
    }

    /**
     * Actualizar documento requerido
     */
    public function updateDocumentoRequerido($id, $data)
    {
        if (isset($data['id_sale_type']) || isset($data['id_agency']) || isset($data['id_customer_type']) || isset($data['id_operation_type'])) {
            $userId = $data['id_last_user_update'] ?? null;
            $idConfigProcess = $this->getOrCreateconfiguration_process(
                $data['id_sale_type'] ?? 0,
                $data['id_agency'] ?? 0,
                $data['id_customer_type'] ?? 0,
                $data['id_operation_type'] ?? 0,
                $userId
            );
            
            $data['id_configuration_process'] = $idConfigProcess;
        }
        
        $updateData = [];
        if (isset($data['id_document_type'])) {
            $updateData['id_document_type'] = $data['id_document_type'];
        }
        if (isset($data['id_configuration_process'])) {
            $updateData['id_configuration_process'] = $data['id_configuration_process'];
        }
        
        if (isset($data['enabled']) && empty($updateData)) {
            // Saltar validación ya que no estamos actualizando nada en esta tabla
            return true; // Permitir que el controlador actualice configuration_process
        }
        
        // Si hay datos para actualizar, usar update con skipValidation para actualizaciones parciales
        if (!empty($updateData)) {
            // Temporalmente desactivar validación para permitir actualizaciones parciales
            $originalSkipValidation = $this->skipValidation;
            $this->skipValidation = true;
            
            $result = $this->update($id, $updateData);
            
            // Restaurar configuración de validación
            $this->skipValidation = $originalSkipValidation;
            
            return $result;
        }
        
        return false;
    }
}
