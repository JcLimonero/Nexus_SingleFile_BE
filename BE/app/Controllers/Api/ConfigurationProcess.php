<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\ConfigurationProcessModel;
use CodeIgniter\HTTP\ResponseInterface;

class ConfigurationProcess extends BaseController
{
    protected $configurationProcessModel;
    
    public function __construct()
    {
        $this->configurationProcessModel = new ConfigurationProcessModel();
    }
    
    /**
     * GET /api/configuration-process/enabled
     * Obtener todas las configuraciones habilitadas con detalles completos
     */
    public function getEnabledConfigurations()
    {
        try {
            // Verificar autenticación
            $currentUser = $this->getAuthenticatedUser();
            if (!$currentUser) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Token de autorización requerido'
                ])->setStatusCode(401);
            }

            // Obtener parámetros de consulta
            $agencyId = $this->request->getGet('agencyId');
            
            // Construir la consulta SQL
            $db = \Config\Database::connect();
            $builder = $db->table('ConfigurationProcess cp');
            
            $builder->select('
                cp.Id as configurationId,
                cp.IdProcess,
                p.Name as processName,
                cp.IdAgency,
                a.Name as agencyName,
                cp.IdCostumerType,
                ct.Name as costumerTypeName,
                cp.IdOperationType,
                ot.Name as operationTypeName,
                cp.Enabled,
                cp.RegistrationDate,
                cp.UpdateDate
            ')
            ->join('Process p', 'p.Id = cp.IdProcess', 'left')
            ->join('Agency a', 'a.Id = cp.IdAgency', 'left')
            ->join('CostumerType ct', 'ct.Id = cp.IdCostumerType', 'left')
            ->join('OperationType ot', 'ot.Id = cp.IdOperationType', 'left')
            ->where('cp.Enabled', 1)
            ->orderBy('p.Name', 'ASC')
            ->orderBy('ct.Name', 'ASC')
            ->orderBy('ot.Name', 'ASC');

            // Aplicar filtro por agencia si se proporciona
            if ($agencyId) {
                $builder->where('cp.IdAgency', $agencyId);
            }

            $configurations = $builder->get()->getResultArray();

            // Organizar los datos por categorías para facilitar el uso en cascada
            $organizedData = [
                'processes' => [],
                'costumerTypes' => [],
                'operationTypes' => [],
                'configurations' => $configurations
            ];

            // Extraer procesos únicos
            $processIds = [];
            foreach ($configurations as $config) {
                if (!in_array($config['IdProcess'], $processIds)) {
                    $processIds[] = $config['IdProcess'];
                    $organizedData['processes'][] = [
                        'Id' => $config['IdProcess'],
                        'Name' => $config['processName']
                    ];
                }
            }

            // Extraer tipos de cliente únicos
            $costumerTypeIds = [];
            foreach ($configurations as $config) {
                if (!in_array($config['IdCostumerType'], $costumerTypeIds)) {
                    $costumerTypeIds[] = $config['IdCostumerType'];
                    $organizedData['costumerTypes'][] = [
                        'Id' => $config['IdCostumerType'],
                        'Name' => $config['costumerTypeName']
                    ];
                }
            }

            // Extraer tipos de operación únicos
            $operationTypeIds = [];
            foreach ($configurations as $config) {
                if (!in_array($config['IdOperationType'], $operationTypeIds)) {
                    $operationTypeIds[] = $config['IdOperationType'];
                    $organizedData['operationTypes'][] = [
                        'Id' => $config['IdOperationType'],
                        'Name' => $config['operationTypeName']
                    ];
                }
            }

            return $this->response->setJSON([
                'success' => true,
                'data' => $organizedData,
                'message' => 'Configuraciones habilitadas obtenidas exitosamente'
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en getEnabledConfigurations: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/configuration-process/enabled-by-agency/{agencyId}
     * Obtener configuraciones habilitadas filtradas por agencia
     */
    public function getEnabledConfigurationsByAgency($agencyId)
    {
        try {
            // Verificar autenticación
            $currentUser = $this->getAuthenticatedUser();
            if (!$currentUser) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Token de autorización requerido'
                ])->setStatusCode(401);
            }

            if (!$agencyId) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID de agencia requerido'
                ])->setStatusCode(400);
            }

            // Construir la consulta SQL
            $db = \Config\Database::connect();
            $builder = $db->table('ConfigurationProcess cp');
            
            $builder->select('
                cp.Id as configurationId,
                cp.IdProcess,
                p.Name as processName,
                cp.IdAgency,
                a.Name as agencyName,
                cp.IdCostumerType,
                ct.Name as costumerTypeName,
                cp.IdOperationType,
                ot.Name as operationTypeName,
                cp.Enabled,
                cp.RegistrationDate,
                cp.UpdateDate
            ')
            ->join('Process p', 'p.Id = cp.IdProcess', 'left')
            ->join('Agency a', 'a.Id = cp.IdAgency', 'left')
            ->join('CostumerType ct', 'ct.Id = cp.IdCostumerType', 'left')
            ->join('OperationType ot', 'ot.Id = cp.IdOperationType', 'left')
            ->where('cp.Enabled', 1)
            ->where('cp.IdAgency', $agencyId)
            ->orderBy('p.Name', 'ASC')
            ->orderBy('ct.Name', 'ASC')
            ->orderBy('ot.Name', 'ASC');

            $configurations = $builder->get()->getResultArray();

            // Organizar los datos por categorías para facilitar el uso en cascada
            $organizedData = [
                'processes' => [],
                'costumerTypes' => [],
                'operationTypes' => [],
                'configurations' => $configurations
            ];

            // Extraer procesos únicos
            $processIds = [];
            foreach ($configurations as $config) {
                if (!in_array($config['IdProcess'], $processIds)) {
                    $processIds[] = $config['IdProcess'];
                    $organizedData['processes'][] = [
                        'Id' => $config['IdProcess'],
                        'Name' => $config['processName']
                    ];
                }
            }

            // Extraer tipos de cliente únicos
            $costumerTypeIds = [];
            foreach ($configurations as $config) {
                if (!in_array($config['IdCostumerType'], $costumerTypeIds)) {
                    $costumerTypeIds[] = $config['IdCostumerType'];
                    $organizedData['costumerTypes'][] = [
                        'Id' => $config['IdCostumerType'],
                        'Name' => $config['costumerTypeName']
                    ];
                }
            }

            // Extraer tipos de operación únicos
            $operationTypeIds = [];
            foreach ($configurations as $config) {
                if (!in_array($config['IdOperationType'], $operationTypeIds)) {
                    $operationTypeIds[] = $config['IdOperationType'];
                    $organizedData['operationTypes'][] = [
                        'Id' => $config['IdOperationType'],
                        'Name' => $config['operationTypeName']
                    ];
                }
            }

            return $this->response->setJSON([
                'success' => true,
                'data' => $organizedData,
                'message' => 'Configuraciones habilitadas obtenidas exitosamente para la agencia'
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en getEnabledConfigurationsByAgency: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ])->setStatusCode(500);
        }
    }
}
