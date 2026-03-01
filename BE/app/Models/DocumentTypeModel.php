<?php

namespace App\Models;

use CodeIgniter\Model;

class DocumentTypeModel extends Model
{
    protected $table            = 'document_type';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = false;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'id', 'name', 'enabled', 'registration_date', 'update_date', 'id_last_user_update',
        'req_expiration', 'id_process_type', 'required', 'id_sub_process', 'available_to_client', 'document_auto_upload'
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

    // Validation
    protected $validationRules      = [
        'name' => 'required|max_length[600]'
    ];
    protected $validationMessages   = [
        'name' => [
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
        return $this->where('enabled', 1)->orderBy('name', 'ASC')->findAll();
    }

    /**
     * Obtener tipo de documento por nombre
     */
    public function getDocumentTypeByName($name)
    {
        return $this->where('name', $name)->first();
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

        $currentStatus = $documentType['enabled'] ?? $documentType['Enabled'] ?? 0;
        $newStatus = $currentStatus == 1 ? 0 : 1;
        return $this->update($id, ['enabled' => $newStatus]);
    }

    /**
     * Obtener configuraciones donde se usa un tipo de documento
     */
    public function getConfigurationsByDocumentType($documentTypeId)
    {
        // Asegurar que el ID sea un entero para la comparación
        $documentTypeId = (int)$documentTypeId;
        
        // Log para debug
        log_message('debug', "DocumentTypeModel::getConfigurationsByDocumentType - Buscando configuraciones para documento ID: {$documentTypeId}");
        
        $builder = $this->db->table('configuration_process_document_type cpd');
        
        $builder->select('
            cpd.id as id_configuration_process_document_type,
            cpd.id_document_type,
            cp.id as id_configuration_process,
            cp.id_process,
            cp.id_agency,
            cp.id_customer_type,
            cp.id_operation_type,
            CAST(cp.enabled AS UNSIGNED) as configuration_enabled,
            p.name as proceso_name,
            a.name as agencia_name,
            ct.name as tipo_cliente_name,
            ot.name as tipo_operacion_name
        ');
        
        $builder->join('configuration_process cp', 'cp.id = cpd.id_configuration_process', 'inner');
        $builder->join('process p', 'p.id = cp.id_process', 'left');
        // INNER JOIN: excluir configuraciones donde la agencia es N/A (nombre nulo, vacío o literal "N/A")
        $builder->join(
            'agency a',
            'a.id = cp.id_agency AND a.name IS NOT NULL AND TRIM(a.name) != "" AND UPPER(TRIM(a.name)) != "N/A"',
            'inner'
        );
        $builder->join('customer_type ct', 'ct.id = cp.id_customer_type', 'left');
        $builder->join('operation_type ot', 'ot.id = cp.id_operation_type', 'left');
        
        // Usar comparación estricta - asegurar que el tipo de dato coincida
        $builder->where('cpd.id_document_type', $documentTypeId);
        
        // Excluir también por id_agency nulo o 0 (redundante con INNER JOIN pero explícito)
        $builder->where('cp.id_agency IS NOT NULL');
        $builder->where('cp.id_agency !=', 0);
        
        $builder->orderBy('a.name', 'ASC');
        $builder->orderBy('p.name', 'ASC');
        
        try {
            $result = $builder->get()->getResultArray();
        } catch (\Exception $e) {
            log_message('error', "DocumentTypeModel::getConfigurationsByDocumentType - Error en consulta SQL para documento ID {$documentTypeId}: " . $e->getMessage());
            log_message('error', "DocumentTypeModel::getConfigurationsByDocumentType - Query: " . $builder->getCompiledSelect(false));
            return [];
        }
        
        // Validación adicional: filtrar resultados para asegurar que todos pertenezcan al documento correcto
        $filteredResult = [];
        foreach ($result as $row) {
            $rowDocTypeId = (int)($row['id_document_type'] ?? $row['IdDocumentType'] ?? 0);
            if ($rowDocTypeId === $documentTypeId) {
                $filteredResult[] = $row;
            } else {
                log_message('error', "DocumentTypeModel::getConfigurationsByDocumentType - Configuración con IdDocumentType incorrecto. Esperado: {$documentTypeId}, Encontrado: {$rowDocTypeId}, Row: " . json_encode($row));
            }
        }
        
        // Log para debug
        log_message('debug', "DocumentTypeModel::getConfigurationsByDocumentType - Encontradas " . count($result) . " configuraciones (después del query), " . count($filteredResult) . " después de validación para documento ID: {$documentTypeId}");
        if (count($filteredResult) > 0) {
            log_message('debug', "DocumentTypeModel::getConfigurationsByDocumentType - Primera configuración validada: " . json_encode($filteredResult[0]));
        }
        
        return $filteredResult;
    }

    /**
     * Obtener tipos de documento con relaciones
     */
    public function getDocumentTypesWithRelations($filters = [])
    {
        $builder = $this->db->table('document_type dt');
        
        $builder->select('
            dt.id,
            dt.name,
            dt.enabled,
            dt.registration_date,
            dt.update_date,
            dt.id_last_user_update,
            dt.req_expiration,
            dt.id_process_type,
            dt.required,
            dt.id_sub_process,
            dt.available_to_client,
            u.name as last_user_update_name,
            fs.name as process_type_name,
            sp.name as sub_process_name
        ');

        // JOINs para obtener las descripciones
        $builder->join('user u', 'u.id = dt.id_last_user_update', 'left');
        $builder->join('`file_status` fs', 'fs.id = dt.id_process_type', 'left'); // Tipo de proceso
        $builder->join('`file_sub_status` sp', 'sp.id = dt.id_sub_process', 'left'); // Subestado de archivo
        
        // Aplicar filtros
        if (!empty($filters['enabled'])) {
            $builder->where('dt.enabled', $filters['enabled']);
        }

        if (!empty($filters['required'])) {
            $builder->where('dt.required', $filters['required']);
        }

        if (!empty($filters['req_expiration'])) {
            $builder->where('dt.req_expiration', $filters['req_expiration']);
        }

        if (!empty($filters['process_type'])) {
            $builder->where('dt.id_process_type', $filters['process_type']);
        }

        if (!empty($filters['phase'])) {
            $builder->where('fs.name', $filters['phase']);
        }

        if (!empty($filters['search'])) {
            $builder->groupStart();
            $builder->like('dt.name', $filters['search']);
            $builder->orLike('fs.name', $filters['search']);
            $builder->orLike('sp.name', $filters['search']);
            $builder->groupEnd();
        }

        // Ordenamiento
        $sortBy = $filters['sort_by'] ?? 'name';
        $sortOrder = $filters['sort_order'] ?? 'ASC';
        
        // Validar campos permitidos para ordenamiento (mapear PascalCase a snake_case)
        $sortFieldMap = [
            'Id' => 'id',
            'Name' => 'name',
            'Enabled' => 'enabled',
            'RegistrationDate' => 'registration_date',
            'UpdateDate' => 'update_date',
            'IdLastUserUpdate' => 'id_last_user_update',
            'ReqExpiration' => 'req_expiration',
            'IdProcessType' => 'id_process_type',
            'Required' => 'required',
            'IdSubProcess' => 'id_sub_process',
            'AvailableToClient' => 'available_to_client'
        ];
        
        // Si viene en PascalCase, convertir a snake_case
        if (isset($sortFieldMap[$sortBy])) {
            $sortBy = $sortFieldMap[$sortBy];
        }
        
        // Validar campos permitidos para ordenamiento
        $allowedSortFields = ['id', 'name', 'enabled', 'registration_date', 'update_date', 'id_last_user_update', 'req_expiration', 'id_process_type', 'required', 'id_sub_process', 'available_to_client'];
        if (!in_array($sortBy, $allowedSortFields)) {
            $sortBy = 'name';
        }
        
        // Validar orden
        $sortOrder = strtoupper($sortOrder) === 'DESC' ? 'DESC' : 'ASC';
        
        $builder->orderBy("dt.$sortBy", $sortOrder);

        // Paginación
        if (isset($filters['limit']) && $filters['limit'] !== null && $filters['limit'] !== 'all') {
            $offset = $filters['offset'] ?? 0;
            $limit = (int)$filters['limit'];
            if ($limit > 0) {
                $builder->limit($limit, $offset);
            }
        }

        return $builder->get()->getResultArray();
    }

    /**
     * Contar tipos de documento con filtros
     */
    public function countDocumentTypesWithFilters($filters = [])
    {
        $builder = $this->db->table('document_type dt');
        
        $builder->join('`file_status` fs', 'fs.id = dt.id_process_type', 'left');
        $builder->join('`file_sub_status` sp', 'sp.id = dt.id_sub_process', 'left');

        // Aplicar los mismos filtros
        if (!empty($filters['enabled'])) {
            $builder->where('dt.enabled', $filters['enabled']);
        }

        if (!empty($filters['required'])) {
            $builder->where('dt.required', $filters['required']);
        }

        if (!empty($filters['req_expiration'])) {
            $builder->where('dt.req_expiration', $filters['req_expiration']);
        }

        if (!empty($filters['process_type'])) {
            $builder->where('dt.id_process_type', $filters['process_type']);
        }

        if (!empty($filters['phase'])) {
            $builder->where('fs.name', $filters['phase']);
        }

        if (!empty($filters['search'])) {
            $builder->groupStart();
            $builder->like('dt.name', $filters['search']);
            $builder->orLike('fs.name', $filters['search']);
            $builder->orLike('sp.name', $filters['search']);
            $builder->groupEnd();
        }

        return $builder->countAllResults();
    }

    /**
     * Obtener tipo de documento específico con relaciones
     */
    public function getDocumentTypeWithRelations($id)
    {
        $builder = $this->db->table('document_type dt');
        
        $builder->select('
            dt.id,
            dt.name,
            dt.enabled,
            dt.registration_date,
            dt.update_date,
            dt.id_last_user_update,
            dt.req_expiration,
            dt.id_process_type,
            dt.required,
            dt.id_sub_process,
            dt.available_to_client,
            u.name as last_user_update_name,
            fs.name as process_type_name,
            sp.name as sub_process_name
        ');

        $builder->join('user u', 'u.id = dt.id_last_user_update', 'left');
        $builder->join('`file_status` fs', 'fs.id = dt.id_process_type', 'left'); // Tipo de proceso
        $builder->join('`file_sub_status` sp', 'sp.id = dt.id_sub_process', 'left'); // Subestado de archivo
        
        $builder->where('dt.id', $id);

        return $builder->get()->getRowArray();
    }
}
