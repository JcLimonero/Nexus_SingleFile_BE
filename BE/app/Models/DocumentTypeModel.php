<?php

namespace App\Models;

use CodeIgniter\Model;

class DocumentTypeModel extends Model
{
    protected $table            = 'document_type';
    protected $primaryKey       = 'Id';
    protected $useAutoIncrement = false;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'Id', 'Name', 'Enabled', 'RegistrationDate', 'UpdateDate', 'IdLastUserUpdate',
        'ReqExpiration', 'IdProcessType', 'Required', 'IdSubProcess', 'AvailableToClient'
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
            cpd.Id as IdConfigurationProcessDocumentType,
            cpd.IdDocumentType,
            cp.Id as IdConfigurationProcess,
            cp.IdProcess,
            cp.IdAgency,
            cp.IdCustomerType,
            cp.IdOperationType,
            CAST(cp.Enabled AS UNSIGNED) as ConfigurationEnabled,
            p.Name as ProcesoName,
            a.Name as AgenciaName,
            ct.Name as TipoClienteName,
            ot.Name as TipoOperacionName
        ');
        
        $builder->join('ConfigurationProcess cp', 'cp.Id = cpd.IdConfigurationProcess', 'inner');
        $builder->join('Process p', 'p.Id = cp.IdProcess', 'left');
        // INNER JOIN: excluir configuraciones donde la agencia es N/A (nombre nulo, vacío o literal "N/A")
        $builder->join(
            'Agency a',
            'a.Id = cp.IdAgency AND a.Name IS NOT NULL AND TRIM(a.Name) != "" AND UPPER(TRIM(a.Name)) != "N/A"',
            'inner'
        );
        $builder->join('customertype ct', 'ct.Id = cp.IdCustomerType', 'left');
        $builder->join('OperationType ot', 'ot.Id = cp.IdOperationType', 'left');
        
        // Usar comparación estricta - asegurar que el tipo de dato coincida
        $builder->where('cpd.IdDocumentType', $documentTypeId);
        
        // Excluir también por IdAgency nulo o 0 (redundante con INNER JOIN pero explícito)
        $builder->where('cp.IdAgency IS NOT NULL');
        $builder->where('cp.IdAgency !=', 0);
        
        $builder->orderBy('a.Name', 'ASC');
        $builder->orderBy('p.Name', 'ASC');
        
        $result = $builder->get()->getResultArray();
        
        // Validación adicional: filtrar resultados para asegurar que todos pertenezcan al documento correcto
        $filteredResult = [];
        foreach ($result as $row) {
            $rowDocTypeId = (int)($row['IdDocumentType'] ?? 0);
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
            dt.AvailableToClient,
            u.Name as LastUserUpdateName,
            fs.Name as ProcessTypeName,
            sp.Name as SubProcessName
        ');

        // JOINs para obtener las descripciones
        $builder->join('User u', 'u.Id = dt.IdLastUserUpdate', 'left');
        $builder->join('`file_status` fs', 'fs.Id = dt.IdProcessType', 'left'); // Tipo de proceso
        $builder->join('`file_sub_status` sp', 'sp.Id = dt.IdSubProcess', 'left'); // Subestado de archivo

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
        $builder = $this->db->table('document_type dt');
        
        $builder->join('`file_status` fs', 'fs.Id = dt.IdProcessType', 'left');
        $builder->join('`file_sub_status` sp', 'sp.Id = dt.IdSubProcess', 'left');

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
        $builder = $this->db->table('document_type dt');
        
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
            dt.AvailableToClient,
            u.Name as LastUserUpdateName,
            fs.Name as ProcessTypeName,
            sp.Name as SubProcessName
        ');

        $builder->join('User u', 'u.Id = dt.IdLastUserUpdate', 'left');
        $builder->join('`file_status` fs', 'fs.Id = dt.IdProcessType', 'left'); // Tipo de proceso
        $builder->join('`file_sub_status` sp', 'sp.Id = dt.IdSubProcess', 'left'); // Subestado de archivo
        
        $builder->where('dt.Id', $id);

        return $builder->get()->getRowArray();
    }
}
