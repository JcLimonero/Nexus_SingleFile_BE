<?php

namespace App\Models;

use CodeIgniter\Model;

class ConfigurationProcessModel extends Model
{
    protected $table            = 'ConfigurationProcess';
    protected $primaryKey       = 'Id';
    protected $useAutoIncrement = false;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'Id', 'IdProcess', 'IdAgency', 'IdCostumerType', 'IdOperationType', 
        'Enabled', 'RegistrationDate', 'UpdateDate', 'IdLastUserUpdate'
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
        'IdProcess' => 'required|integer',
        'IdAgency' => 'required|integer',
        'IdCostumerType' => 'required|integer',
        'IdOperationType' => 'required|integer'
    ];
    
    protected $validationMessages   = [
        'IdProcess' => [
            'required' => 'El ID del proceso es requerido',
            'integer' => 'El ID del proceso debe ser un número válido'
        ],
        'IdAgency' => [
            'required' => 'El ID de la agencia es requerido',
            'integer' => 'El ID de la agencia debe ser un número válido'
        ],
        'IdCostumerType' => [
            'required' => 'El ID del tipo de cliente es requerido',
            'integer' => 'El ID del tipo de cliente debe ser un número válido'
        ],
        'IdOperationType' => [
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
        if (empty($data['data']['Id'])) {
            $data['data']['Id'] = $this->getNextId();
        }
        return $data;
    }

    /**
     * Establecer timestamps al crear
     */
    protected function setTimestamps(array $data)
    {
        $data['data']['RegistrationDate'] = date('Y-m-d H:i:s');
        $data['data']['UpdateDate'] = date('Y-m-d H:i:s');
        return $data;
    }

    /**
     * Establecer timestamp de actualización
     */
    protected function setUpdateTimestamp(array $data)
    {
        $data['data']['UpdateDate'] = date('Y-m-d H:i:s');
        return $data;
    }

    /**
     * Obtener el siguiente ID disponible
     */
    private function getNextId()
    {
        $lastConfig = $this->orderBy('Id', 'DESC')->first();
        if ($lastConfig) {
            return (int)$lastConfig['Id'] + 1;
        }
        return 1;
    }

    /**
     * Obtener configuración por parámetros
     */
    public function getConfigurationByParams($idProcess, $idAgency, $idCostumerType, $idOperationType)
    {
        return $this->where('IdProcess', $idProcess)
                    ->where('IdAgency', $idAgency)
                    ->where('IdCostumerType', $idCostumerType)
                    ->where('IdOperationType', $idOperationType)
                    ->first();
    }

    /**
     * Obtener o crear configuración de proceso
     */
    public function getOrCreateConfiguration($idProcess, $idAgency, $idCostumerType, $idOperationType)
    {
        // Buscar configuración existente
        $config = $this->getConfigurationByParams($idProcess, $idAgency, $idCostumerType, $idOperationType);
        
        if ($config) {
            return $config['Id'];
        }
        
        // Crear nueva configuración
        $insertData = [
            'IdProcess' => $idProcess,
            'IdAgency' => $idAgency,
            'IdCostumerType' => $idCostumerType,
            'IdOperationType' => $idOperationType,
            'Enabled' => 1,
            'IdLastUserUpdate' => 1 // TODO: Obtener ID del usuario actual
        ];
        
        $this->insert($insertData);
        return $this->getInsertID();
    }

    /**
     * Obtener todas las configuraciones activas
     */
    public function getActiveConfigurations()
    {
        return $this->where('Enabled', 1)
                    ->orderBy('Id', 'ASC')
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

        $newStatus = $config['Enabled'] == 1 ? 0 : 1;
        return $this->update($id, ['Enabled' => $newStatus]);
    }
}
