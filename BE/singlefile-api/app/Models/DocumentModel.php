<?php

namespace App\Models;

use CodeIgniter\Model;

class DocumentModel extends Model
{
    protected $table            = 'DocumentByFile';
    protected $primaryKey       = 'Id';
    protected $useAutoIncrement = false;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'Id', 'Name', 'Comment', 'ExperationDate', 'PathDocument', 'Enabled', 
        'RegistrationDate', 'UpdateDate', 'LastUserUpdate', 'IdLastUserUpdate',
        'IdFile', 'IdValidation', 'IdDocumentType', 'IdCurrentStatus', 'IdDocumentError'
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
        $builder = $this->db->table('DocumentByFile d');
        
        $builder->select('
            d.Id,
            d.Name,
            d.Comment,
            d.ExperationDate,
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
            dt.IdProcessType,
            dt.IdSubProcess,
            dfs.Description as CurrentStatusDescription,
            dfe.Description as DocumentErrorDescription,
            u.Name as LastUserUpdateName,
            f.Id as FileId,
            f.Description as FileDescription,
            f.IdCurrentState as FileCurrentState,
            fs.Description as FileStatusDescription,
            fss.Name as ProcessTypeName,
            sp.Name as SubProcessName
        ');

        // JOINs para obtener las descripciones
        $builder->join('DocumentType dt', 'dt.Id = d.IdDocumentType', 'left');
        $builder->join('DocumentFile_Status dfs', 'dfs.Id = d.IdCurrentStatus', 'left');
        $builder->join('DocumentFile_Error dfe', 'dfe.Id = d.IdDocumentError', 'left');
        $builder->join('User u', 'u.Id = d.IdLastUserUpdate', 'left');
        $builder->join('File f', 'f.Id = d.IdFile', 'left');
        $builder->join('File_Status fs', 'fs.Id = f.IdCurrentState', 'left');
        // JOIN para obtener el tipo de proceso desde File_SubStatus
        $builder->join('File_SubStatus fss', 'fss.Id = dt.IdProcessType', 'left');
        // JOIN para obtener el subproceso
        $builder->join('Process sp', 'sp.Id = dt.IdSubProcess', 'left');

        // Aplicar filtros
        if (!empty($filters['enabled'])) {
            $builder->where('d.Enabled', $filters['enabled']);
        }

        if (!empty($filters['document_type'])) {
            $builder->where('d.IdDocumentType', $filters['document_type']);
        }

        if (!empty($filters['current_status'])) {
            $builder->where('d.IdCurrentStatus', $filters['current_status']);
        }

        if (!empty($filters['file_id'])) {
            $builder->where('d.IdFile', $filters['file_id']);
        }

        if (!empty($filters['process_type'])) {
            $builder->where('dt.IdProcessType', $filters['process_type']);
        }

        if (!empty($filters['sub_process'])) {
            $builder->where('dt.IdSubProcess', $filters['sub_process']);
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

        // Ordenamiento
        $sortBy = $filters['sort_by'] ?? 'RegistrationDate';
        $sortOrder = $filters['sort_order'] ?? 'DESC';
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
        $builder = $this->db->table('DocumentByFile d');
        
        $builder->join('DocumentType dt', 'dt.Id = d.IdDocumentType', 'left');
        $builder->join('File f', 'f.Id = d.IdFile', 'left');
        $builder->join('File_SubStatus fss', 'fss.Id = dt.IdProcessType', 'left');
        $builder->join('Process sp', 'sp.Id = dt.IdSubProcess', 'left');

        // Aplicar los mismos filtros que en getDocumentsWithRelations
        if (!empty($filters['enabled'])) {
            $builder->where('d.Enabled', $filters['enabled']);
        }

        if (!empty($filters['document_type'])) {
            $builder->where('d.IdDocumentType', $filters['document_type']);
        }

        if (!empty($filters['current_status'])) {
            $builder->where('d.IdCurrentStatus', $filters['current_status']);
        }

        if (!empty($filters['file_id'])) {
            $builder->where('d.IdFile', $filters['file_id']);
        }

        if (!empty($filters['process_type'])) {
            $builder->where('dt.IdProcessType', $filters['process_type']);
        }

        if (!empty($filters['sub_process'])) {
            $builder->where('dt.IdSubProcess', $filters['sub_process']);
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
        $builder = $this->db->table('DocumentByFile d');
        
        $builder->select('
            d.Id,
            d.Name,
            d.Comment,
            d.ExperationDate,
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
            dfs.Description as CurrentStatusDescription,
            dfe.Description as DocumentErrorDescription,
            u.Name as LastUserUpdateName,
            f.Id as FileId,
            f.Description as FileDescription,
            f.IdCurrentState as FileCurrentState,
            fs.Description as FileStatusDescription
        ');

        $builder->join('DocumentType dt', 'dt.Id = d.IdDocumentType', 'left');
        $builder->join('DocumentFile_Status dfs', 'dfs.Id = d.IdCurrentStatus', 'left');
        $builder->join('DocumentFile_Error dfe', 'dfe.Id = d.IdDocumentError', 'left');
        $builder->join('User u', 'u.Id = d.IdLastUserUpdate', 'left');
        $builder->join('File f', 'f.Id = d.IdFile', 'left');
        $builder->join('File_Status fs', 'fs.Id = f.IdCurrentState', 'left');
        
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
    public function getDocumentStats()
    {
        $total = $this->countAll();
        $enabled = $this->where('Enabled', 1)->countAllResults();
        $disabled = $this->where('Enabled', 0)->countAllResults();
        
        // Estadísticas por tipo de documento
        $byType = $this->db->table('DocumentByFile d')
            ->select('dt.Name as DocumentType, COUNT(*) as Count')
            ->join('DocumentType dt', 'dt.Id = d.IdDocumentType', 'left')
            ->groupBy('d.IdDocumentType, dt.Name')
            ->orderBy('Count', 'DESC')
            ->get()
            ->getResultArray();

        // Estadísticas por estado
        $byStatus = $this->db->table('DocumentByFile d')
            ->select('dfs.Description as Status, COUNT(*) as Count')
            ->join('DocumentFile_Status dfs', 'dfs.Id = d.IdCurrentStatus', 'left')
            ->groupBy('d.IdCurrentStatus, dfs.Description')
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
    }
}
