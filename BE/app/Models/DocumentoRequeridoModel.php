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
        'id', 'id_document_type', 'id_configuration_process'
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
    public function getDocumentosRequeridos($filters = [], $limit = null, $offset = null, $sortBy = 'Id', $sortOrder = 'ASC')
    {
        try {
            // Usar db->table() directamente para tener más control sobre el alias
            $builder = $this->db->table('configuration_process_document_type cpd');
            
            // Seleccionar campos con joins
            $builder->select('
            cpd.id,
            cpd.id_document_type,
            cpd.id_configuration_process,
            cp.id_process,
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
            dt.id_process_type,
            dt.id_sub_process,
            fs.name as process_type_name,
            sp.name as sub_process_name
            ');
            
            // Joins con tablas relacionadas
            $builder->join('configuration_process cp', 'cp.id = cpd.id_configuration_process', 'left');
            $builder->join('process p', 'p.id = cp.id_process', 'left');
            $builder->join('agency a', 'a.id = cp.id_agency', 'left');
            $builder->join('operation_type ot', 'ot.id = cp.id_operation_type', 'left');
            $builder->join('customer_type ct', 'ct.id = cp.id_customer_type', 'left');
            $builder->join('document_type dt', 'dt.id = cpd.id_document_type', 'left');
            $builder->join('file_status fs', 'fs.id = dt.id_process_type', 'left');
            $builder->join('file_sub_status sp', 'sp.id = dt.id_sub_process', 'left');
            
            // Aplicar filtros (mapear nombres de filtros PascalCase a snake_case)
            if (!empty($filters['IdProcess'])) {
                $builder->where('cp.id_process', $filters['IdProcess']);
            }
            if (!empty($filters['IdAgency'])) {
                $builder->where('cp.id_agency', $filters['IdAgency']);
            }
            if (!empty($filters['IdCustomerType'])) {
                $builder->where('cp.id_customer_type', $filters['IdCustomerType']);
            }
            if (!empty($filters['IdOperationType'])) {
                $builder->where('cp.id_operation_type', $filters['IdOperationType']);
            }
            if (!empty($filters['IdDocumentType'])) {
                $builder->where('cpd.id_document_type', $filters['IdDocumentType']);
            }
            // Solo aplicar filtro de Enabled si se especifica explícitamente
            if (isset($filters['Enabled']) && $filters['Enabled'] !== null) {
                $builder->where('cp.enabled', $filters['Enabled']);
            }
            
            // Validar y aplicar ordenamiento
            // Mapear campos de ordenamiento a sus columnas reales o alias (snake_case)
            $sortFieldMap = [
                'Id' => 'cpd.id',
                'id' => 'cpd.id',
                'Name' => 'dt.name',
                'name' => 'dt.name',
                'ProcesoName' => 'p.name',
                'proceso_name' => 'p.name',
                'AgenciaName' => 'a.name',
                'agencia_name' => 'a.name',
                'TipoOperacionName' => 'ot.name',
                'tipo_operacion_name' => 'ot.name',
                'TipoClienteName' => 'ct.name',
                'tipo_cliente_name' => 'ct.name',
                'TipoDocumentoName' => 'dt.name',
                'tipo_documento_name' => 'dt.name',
                'Enabled' => 'cp.enabled',
                'enabled' => 'cp.enabled',
                'RegistrationDate' => 'cp.registration_date',
                'registration_date' => 'cp.registration_date',
                'UpdateDate' => 'cp.update_date',
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
            log_message('error', 'Database error in getDocumentosRequeridos: ' . $e->getMessage());
            log_message('error', 'SQL: ' . ($this->db->getLastQuery() ?: 'No query available'));
            throw $e;
        } catch (\Exception $e) {
            log_message('error', 'General error in getDocumentosRequeridos: ' . $e->getMessage());
            log_message('error', 'File: ' . $e->getFile() . ' Line: ' . $e->getLine());
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
        if (!empty($filters['IdProcess'])) {
            $builder->where('cp.id_process', $filters['IdProcess']);
        }
        if (!empty($filters['IdAgency'])) {
            $builder->where('cp.id_agency', $filters['IdAgency']);
        }
        if (!empty($filters['IdCustomerType'])) {
            $builder->where('cp.id_customer_type', $filters['IdCustomerType']);
        }
        if (!empty($filters['IdOperationType'])) {
            $builder->where('cp.id_operation_type', $filters['IdOperationType']);
        }
        if (!empty($filters['IdDocumentType'])) {
            $builder->where('cpd.id_document_type', $filters['IdDocumentType']);
        }
        // Solo aplicar filtro de Enabled si se especifica explícitamente
        if (isset($filters['Enabled']) && $filters['Enabled'] !== null) {
            $builder->where('cp.enabled', $filters['Enabled']);
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
                                 ->select('COUNT(DISTINCT id_process) as count')
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
    public function getOrCreateconfiguration_process($idProcess, $idAgency, $idCustomerType, $idOperationType)
    {
        // Usar el model configuration_processModel
        $configProcessModel = new \App\Models\configuration_processModel();
        return $configProcessModel->getOrCreateConfiguration($idProcess, $idAgency, $idCustomerType, $idOperationType);
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
            cp.id_process,
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
        
        $builder->where('cp.id_process', $idProcess)
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
    public function getDocumentosRequeridosWithRelations($filters = [], $limit = null, $offset = null, $sortBy = 'Id', $sortOrder = 'ASC')
    {
        return $this->getDocumentosRequeridos($filters, $limit, $offset, $sortBy, $sortOrder);
    }

    /**
     * Crear documento requerido
     */
    public function createDocumentoRequerido($data)
    {
        // Obtener o crear configuración de proceso
        $idConfigProcess = $this->getOrCreateconfiguration_process(
            $data['IdProcess'] ?? $data['id_process'] ?? 0,
            $data['IdAgency'] ?? $data['id_agency'] ?? 0,
            $data['IdCustomerType'] ?? $data['id_customer_type'] ?? 0,
            $data['IdOperationType'] ?? $data['id_operation_type'] ?? 0
        );
        
        // Insertar en la tabla de relación (mapear a snake_case)
        $insertData = [
            'id_document_type' => $data['IdDocumentType'] ?? $data['id_document_type'] ?? null,
            'id_configuration_process' => $idConfigProcess
        ];
        
        return $this->insert($insertData);
    }

    /**
     * Actualizar documento requerido
     */
    public function updateDocumentoRequerido($id, $data)
    {
        // Si se cambia la configuración, crear nueva o usar existente
        if (isset($data['IdProcess']) || isset($data['id_process']) || isset($data['IdAgency']) || isset($data['id_agency']) ||
            isset($data['IdCustomerType']) || isset($data['id_customer_type']) || isset($data['IdOperationType']) || isset($data['id_operation_type'])) {
            
            $idConfigProcess = $this->getOrCreateconfiguration_process(
                $data['IdProcess'] ?? $data['id_process'] ?? 0,
                $data['IdAgency'] ?? $data['id_agency'] ?? 0,
                $data['IdCustomerType'] ?? $data['id_customer_type'] ?? 0,
                $data['IdOperationType'] ?? $data['id_operation_type'] ?? 0
            );
            
            $data['id_configuration_process'] = $idConfigProcess;
        }
        
        // Actualizar solo los campos permitidos de configuration_process_document_type
        // Nota: Enabled está en configuration_process, no en configuration_process_document_type
        // El controlador se encargará de actualizar configuration_process si se envía Enabled
        $updateData = [];
        if (isset($data['IdDocumentType']) || isset($data['id_document_type'])) {
            $updateData['id_document_type'] = $data['IdDocumentType'] ?? $data['id_document_type'];
        }
        if (isset($data['id_configuration_process']) || isset($data['Idconfiguration_process'])) {
            $updateData['id_configuration_process'] = $data['id_configuration_process'] ?? $data['Idconfiguration_process'];
        }
        
        // Si solo se está actualizando Enabled, no hay nada que actualizar en esta tabla
        // pero aún así retornamos true para que el controlador pueda actualizar configuration_process
        if (isset($data['Enabled']) && empty($updateData)) {
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
