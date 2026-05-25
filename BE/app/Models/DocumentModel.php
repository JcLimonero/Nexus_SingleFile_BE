<?php

namespace App\Models;

use CodeIgniter\Model;

class DocumentModel extends Model
{
    protected $table            = 'expedient_document';
    protected $primaryKey       = 'Id';
    protected $useAutoIncrement = false;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'id', 'name', 'comment', 'expiration_date', 'path_document', 'enabled', 
        'registration_date', 'update_date', 'last_user_update', 'id_last_user_update',
        'id_expedient', 'id_validation', 'id_document_type', 'id_current_document_status', 'id_document_error'
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
        'Name' => 'required|max_length[600]',
        'IdDocumentType' => 'required|integer',
        'IdFile' => 'required|integer'
    ];
    protected $validationMessages   = [
        'Name' => [
            'required' => 'El nombre del documento es requerido',
            'max_length' => 'El nombre del documento no puede exceder 600 caracteres'
        ],
        'IdDocumentType' => [
            'required' => 'El tipo de documento es requerido',
            'integer' => 'El tipo de documento debe ser un número válido'
        ],
        'IdFile' => [
            'required' => 'El archivo es requerido',
            'integer' => 'El archivo debe ser un número válido'
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
     * Obtener documentos con todas las relaciones
     */
    public function getDocumentsWithRelations($filters = [])
    {
        $builder = $this->db->table('expedient_document d');
        
        $builder->select('
            d.id,
            d.name,
            d.comment,
            d.expiration_date,
            d.path_document,
            d.enabled,
            d.registration_date,
            d.update_date,
            d.id_last_user_update,
            d.id_expedient,
            d.id_validation,
            d.id_document_type,
            d.id_current_document_status,
            d.id_document_error,
            dt.name as document_type_name,
            dt.id_sale_type,
            dt.id_sub_sale_type,
            dfs.name as current_status_description,
            dfe.description as document_error_description,
            u.name as last_user_update_name,
            f.id as file_id,
            f.description as file_description,
            f.id_current_expedient_state as file_current_state,
            fs.name as file_status_description,
            fss.name as process_type_name,
            sp.name as sub_process_name
        ');

        // JOINs para obtener las descripciones
        $builder->join('document_type dt', 'dt.id = d.id_document_type', 'left');
        $builder->join('document_status dfs', 'dfs.id = d.id_current_document_status', 'left');
        $builder->join('document_error dfe', 'dfe.id = d.id_document_error', 'left');
        $builder->join('user u', 'u.id = d.id_last_user_update', 'left');
        $builder->join('expedient f', 'f.id = d.id_expedient', 'left');
        $builder->join('expedient_state fs', 'fs.id = f.id_current_expedient_state', 'left');
        // JOIN para obtener el tipo de proceso desde expedient_sub_state
        $builder->join('expedient_sub_state fss', 'fss.id = dt.id_sale_type', 'left');
        // JOIN para obtener el subproceso
        $builder->join('sale_type sp', 'sp.id = dt.id_sub_sale_type', 'left');

        // Aplicar filtros
        if (!empty($filters['enabled'])) {
            $builder->where('d.enabled', $filters['enabled']);
        }

        if (!empty($filters['document_type'])) {
            $builder->where('d.id_document_type', $filters['document_type']);
        }

        if (!empty($filters['current_status'])) {
            $builder->where('d.id_current_document_status', $filters['current_status']);
        }

        if (!empty($filters['file_id'])) {
            $builder->where('d.id_expedient', $filters['file_id']);
        }

        if (!empty($filters['process_type'])) {
            $builder->where('dt.id_sale_type', $filters['process_type']);
        }

        if (!empty($filters['sub_process'])) {
            $builder->where('dt.id_sub_sale_type', $filters['sub_process']);
        }

        if (!empty($filters['search'])) {
            $builder->groupStart();
            $builder->like('d.name', $filters['search']);
            $builder->orLike('d.comment', $filters['search']);
            $builder->orLike('dt.name', $filters['search']);
            $builder->orLike('fss.name', $filters['search']);
            $builder->orLike('sp.name', $filters['search']);
            $builder->groupEnd();
        }

        // Ordenamiento (mapear PascalCase a snake_case)
        $sortBy = $filters['sort_by'] ?? 'registration_date';
        $sortOrder = $filters['sort_order'] ?? 'DESC';
        
        // Mapear campos de ordenamiento
        $sortFieldMap = [
            'Id' => 'id',
            'RegistrationDate' => 'registration_date',
            'UpdateDate' => 'update_date',
            'Name' => 'name',
            'Enabled' => 'enabled'
        ];
        
        if (isset($sortFieldMap[$sortBy])) {
            $sortBy = $sortFieldMap[$sortBy];
        }
        
        $builder->orderBy("d.$sortBy", $sortOrder);

        // Paginación
        if (!empty($filters['limit'])) {
            $offset = $filters['offset'] ?? 0;
            $builder->limit($filters['limit'], $offset);
        }

        return $builder->get()->getResultArray();
    }

    /**
     * Contar documentos con filtros
     */
    public function countDocumentsWithFilters($filters = [])
    {
        $builder = $this->db->table('expedient_document d');
        
        $builder->join('document_type dt', 'dt.id = d.id_document_type', 'left');
        $builder->join('expedient f', 'f.id = d.id_expedient', 'left');
        $builder->join('expedient_sub_state fss', 'fss.id = dt.id_sale_type', 'left');
        $builder->join('sale_type sp', 'sp.id = dt.id_sub_sale_type', 'left');

        // Aplicar los mismos filtros que en getDocumentsWithRelations
        if (!empty($filters['enabled'])) {
            $builder->where('d.enabled', $filters['enabled']);
        }

        if (!empty($filters['document_type'])) {
            $builder->where('d.id_document_type', $filters['document_type']);
        }

        if (!empty($filters['current_status'])) {
            $builder->where('d.id_current_document_status', $filters['current_status']);
        }

        if (!empty($filters['file_id'])) {
            $builder->where('d.id_expedient', $filters['file_id']);
        }

        if (!empty($filters['process_type'])) {
            $builder->where('dt.id_sale_type', $filters['process_type']);
        }

        if (!empty($filters['sub_process'])) {
            $builder->where('dt.id_sub_sale_type', $filters['sub_process']);
        }

        if (!empty($filters['search'])) {
            $builder->groupStart();
            $builder->like('d.Name', $filters['search']);
            $builder->orLike('d.Comment', $filters['search']);
            $builder->orLike('dt.Name', $filters['search']);
            $builder->orLike('fss.Name', $filters['search']);
            $builder->orLike('sp.Name', $filters['search']);
            $builder->groupEnd();
        }

        return $builder->countAllResults();
    }

    /**
     * Obtener documento específico con relaciones
     */
    public function getDocumentWithRelations($id)
    {
        $result = $this->getDocumentsWithRelations(['limit' => 1]);
        $builder = $this->db->table('expedient_document d');
        
        $builder->select('
            d.Id,
            d.Name,
            d.Comment,
            d.ExpirationDate,
            d.PathDocument,
            d.Enabled,
            d.RegistrationDate,
            d.UpdateDate,
            d.IdLastUserUpdate,
            d.IdFile,
            d.IdValidation,
            d.IdDocumentType,
            d.IdCurrentStatus,
            d.IdDocumentError,
            dt.Name as DocumentTypeName,
            dfs.Name as CurrentStatusDescription,
            dfe.Description as DocumentErrorDescription,
            u.Name as LastUserUpdateName,
            f.Id as FileId,
            f.Description as FileDescription,
            f.IdCurrentState as FileCurrentState,
            fs.Name as FileStateDescription
        ');

        $builder->join('document_type dt', 'dt.Id = d.IdDocumentType', 'left');
        $builder->join('document_status dfs', 'dfs.Id = d.IdCurrentStatus', 'left');
        $builder->join('document_error dfe', 'dfe.Id = d.IdDocumentError', 'left');
        $builder->join('user u', 'u.Id = d.IdLastUserUpdate', 'left');
        $builder->join('expedient f', 'f.Id = d.IdFile', 'left');
        $builder->join('expedient_state fs', 'fs.Id = f.IdCurrentState', 'left');
        
        $builder->where('d.Id', $id);

        return $builder->get()->getRowArray();
    }

    /**
     * Obtener documentos por archivo
     */
    public function getDocumentsByFile($fileId)
    {
        return $this->getDocumentsWithRelations(['file_id' => $fileId]);
    }

    /**
     * Obtener documentos activos
     */
    public function getActiveDocuments()
    {
        return $this->getDocumentsWithRelations(['enabled' => 1]);
    }

    /**
     * Cambiar estado del documento
     */
    public function toggleStatus($id)
    {
        $document = $this->find($id);
        if (!$document) {
            return false;
        }

        $newStatus = $document['Enabled'] == 1 ? 0 : 1;
        return $this->update($id, ['Enabled' => $newStatus]);
    }

    /**
     * Obtener estadísticas de documentos
     */
    public function getDocumentStats($filters = [])
    {
        try {
            $builder = $this->builder();
            
            // Aplicar filtros básicos (snake_case)
            if (!empty($filters['start_date'])) {
                $builder->where('registration_date >=', $filters['start_date']);
            }
            if (!empty($filters['end_date'])) {
                $builder->where('registration_date <=', $filters['end_date']);
            }
            if (!empty($filters['document_type_id'])) {
                $builder->where('id_document_type', $filters['document_type_id']);
            }
            if (!empty($filters['user_id'])) {
                $builder->where('id_last_user_update', $filters['user_id']);
            }

            $total = $builder->countAllResults(false);
            
            $builder = $this->builder();
            if (!empty($filters['start_date'])) {
                $builder->where('registration_date >=', $filters['start_date']);
            }
            if (!empty($filters['end_date'])) {
                $builder->where('registration_date <=', $filters['end_date']);
            }
            if (!empty($filters['document_type_id'])) {
                $builder->where('id_document_type', $filters['document_type_id']);
            }
            if (!empty($filters['user_id'])) {
                $builder->where('id_last_user_update', $filters['user_id']);
            }
            
            $enabled = $builder->where('enabled', 1)->countAllResults(false);
            
            $builder = $this->builder();
            if (!empty($filters['start_date'])) {
                $builder->where('registration_date >=', $filters['start_date']);
            }
            if (!empty($filters['end_date'])) {
                $builder->where('registration_date <=', $filters['end_date']);
            }
            if (!empty($filters['document_type_id'])) {
                $builder->where('id_document_type', $filters['document_type_id']);
            }
            if (!empty($filters['user_id'])) {
                $builder->where('id_last_user_update', $filters['user_id']);
            }
            
            $disabled = $builder->where('enabled', 0)->countAllResults(false);
            
            // Estadísticas por tipo de documento
            $byTypeBuilder = $this->db->table('expedient_document d')
                ->select('dt.name as DocumentType, COUNT(*) as Count')
                ->join('document_type dt', '`dt`.`id` = `d`.`id_document_type`', 'left', false);
                
            if (!empty($filters['start_date'])) {
                $byTypeBuilder->where('d.registration_date >=', $filters['start_date']);
            }
            if (!empty($filters['end_date'])) {
                $byTypeBuilder->where('d.registration_date <=', $filters['end_date']);
            }
            if (!empty($filters['document_type_id'])) {
                $byTypeBuilder->where('d.id_document_type', $filters['document_type_id']);
            }
            if (!empty($filters['user_id'])) {
                $byTypeBuilder->where('d.id_last_user_update', $filters['user_id']);
            }
            
            $byType = $byTypeBuilder->groupBy('d.id_document_type, dt.name')
                ->orderBy('Count', 'DESC')
                ->get()
                ->getResultArray();

            // Estadísticas por estado (snake_case)
            $byStatusBuilder = $this->db->table('expedient_document d')
                ->select('dfs.name as Status, COUNT(*) as Count')
                ->join('document_status dfs', '`dfs`.`id` = `d`.`id_current_document_status`', 'left', false);
                
            if (!empty($filters['start_date'])) {
                $byStatusBuilder->where('d.registration_date >=', $filters['start_date']);
            }
            if (!empty($filters['end_date'])) {
                $byStatusBuilder->where('d.registration_date <=', $filters['end_date']);
            }
            if (!empty($filters['document_type_id'])) {
                $byStatusBuilder->where('d.id_document_type', $filters['document_type_id']);
            }
            if (!empty($filters['user_id'])) {
                $byStatusBuilder->where('d.id_last_user_update', $filters['user_id']);
            }
            
            $byStatus = $byStatusBuilder->groupBy('d.id_current_document_status, dfs.name')
                ->orderBy('Count', 'DESC')
                ->get()
                ->getResultArray();

            return [
                'total' => $total,
                'enabled' => $enabled,
                'disabled' => $disabled,
                'by_type' => $byType,
                'by_status' => $byStatus
            ];
            
        } catch (\Exception $e) {

            throw $e;
        }
    }
}
