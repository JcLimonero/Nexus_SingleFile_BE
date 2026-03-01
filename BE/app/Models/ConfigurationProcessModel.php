<?php

namespace App\Models;

use CodeIgniter\Model;

class configuration_processModel extends Model
{
    protected $table            = 'configuration_process';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = false;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'id', 'id_process', 'id_agency', 'id_customer_type', 'id_operation_type', 
        'enabled', 'registration_date', 'update_date', 'id_last_user_update'
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
        'id_process' => 'required|integer',
        'id_agency' => 'required|integer',
        'id_customer_type' => 'required|integer',
        'id_operation_type' => 'required|integer'
    ];
    
    protected $validationMessages   = [
        'id_process' => [
            'required' => 'El ID del proceso es requerido',
            'integer' => 'El ID del proceso debe ser un número válido'
        ],
        'id_agency' => [
            'required' => 'El ID de la agencia es requerido',
            'integer' => 'El ID de la agencia debe ser un número válido'
        ],
        'id_customer_type' => [
            'required' => 'El ID del tipo de cliente es requerido',
            'integer' => 'El ID del tipo de cliente debe ser un número válido'
        ],
        'id_operation_type' => [
            'required' => 'El ID del tipo de operación es requerido',
            'integer' => 'El ID del tipo de operación debe ser un número válido'
        ]
    ];
    
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    // Callbacks
    protected $allowCallbacks = true;
    protected $beforeInsert   = ['generateId', 'setTimestamps'];
    protected $afterInsert    = [];
    protected $beforeUpdate   = ['setUpdateTimestamp'];
    protected $afterUpdate    = [];
    protected $beforeFind     = [];
    protected $afterFind      = [];
    protected $beforeDelete   = [];
    protected $afterDelete    = [];

    /**
     * Generar ID único para nueva configuración
     */
    protected function generateId(array $data)
    {
        if (empty($data['data']['id'])) {
            $data['data']['id'] = $this->getNextId();
        }
        return $data;
    }

    /**
     * Establecer timestamps al crear
     */
    protected function setTimestamps(array $data)
    {
        $data['data']['registration_date'] = date('Y-m-d H:i:s');
        $data['data']['update_date'] = date('Y-m-d H:i:s');
        return $data;
    }

    /**
     * Establecer timestamp de actualización
     */
    protected function setUpdateTimestamp(array $data)
    {
        $data['data']['update_date'] = date('Y-m-d H:i:s');
        return $data;
    }

    /**
     * Obtener el siguiente ID disponible
     */
    private function getNextId()
    {
        $lastConfig = $this->orderBy('id', 'DESC')->first();
        if ($lastConfig) {
            return (int)$lastConfig['id'] + 1;
        }
        return 1;
    }

    /**
     * Obtener configuración por parámetros
     */
    public function getConfigurationByParams($idProcess, $idAgency, $idCustomerType, $idOperationType)
    {
        return $this->where('id_process', $idProcess)
                    ->where('id_agency', $idAgency)
                    ->where('id_customer_type', $idCustomerType)
                    ->where('id_operation_type', $idOperationType)
                    ->first();
    }

    /**
     * Obtener o crear configuración de proceso
     */
    public function getOrCreateConfiguration($idProcess, $idAgency, $idCustomerType, $idOperationType)
    {
        // Buscar configuración existente
        $config = $this->getConfigurationByParams($idProcess, $idAgency, $idCustomerType, $idOperationType);
        
        if ($config) {
            return $config['id'];
        }
        
        // Crear nueva configuración
        $insertData = [
            'id_process' => $idProcess,
            'id_agency' => $idAgency,
            'id_customer_type' => $idCustomerType,
            'id_operation_type' => $idOperationType,
            'enabled' => 1,
            'id_last_user_update' => 1 // TODO: Obtener ID del usuario actual
        ];
        
        $this->insert($insertData);
        return $this->getInsertID();
    }

    /**
     * Obtener todas las configuraciones activas
     */
    public function getActiveConfigurations()
    {
        return $this->where('enabled', 1)
                    ->orderBy('id', 'ASC')
                    ->findAll();
    }

    /**
     * Cambiar estado de la configuración
     */
    public function toggleStatus($id)
    {
        $config = $this->find($id);
        if (!$config) {
            return false;
        }

        $newStatus = $config['enabled'] == 1 ? 0 : 1;
        return $this->update($id, ['enabled' => $newStatus]);
    }
}
