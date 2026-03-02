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
            $builder = $db->table('configuration_process cp');
            
            $builder->select('
                cp.id as configuration_id,
                cp.id_process,
                p.name as process_name,
                cp.id_agency,
                a.name as agency_name,
                cp.id_customer_type,
                ct.name as customer_type_name,
                cp.id_operation_type,
                ot.name as operation_type_name,
                cp.enabled,
                cp.registration_date,
                cp.update_date
            ')
            ->join('process p', 'p.id = cp.id_process', 'left')
            ->join('agency a', 'a.id = cp.id_agency', 'left')
            ->join('customer_type ct', 'ct.id = cp.id_customer_type', 'left')
            ->join('operation_type ot', 'ot.id = cp.id_operation_type', 'left')
            ->where('cp.enabled', 1)
            ->orderBy('p.name', 'ASC')
            ->orderBy('ct.name', 'ASC')
            ->orderBy('ot.name', 'ASC');

            // Aplicar filtro por agencia si se proporciona
            if ($agencyId) {
                $builder->where('cp.id_agency', $agencyId);
            }

            $configurations = $builder->get()->getResultArray();

            // Organizar los datos por categorías para facilitar el uso en cascada
            $organizedData = [
                'processes' => [],
                'customerTypes' => [],
                'operationTypes' => [],
                'configurations' => $configurations
            ];

            // Extraer procesos únicos
            $processIds = [];
            foreach ($configurations as $config) {
                if (!in_array($config['id_process'], $processIds)) {
                    $processIds[] = $config['id_process'];
                    $organizedData['processes'][] = [
                        'id' => $config['id_process'],
                        'name' => $config['process_name']
                    ];
                }
            }

            // Extraer tipos de cliente únicos
            $customerTypeIds = [];
            foreach ($configurations as $config) {
                if (!in_array($config['id_customer_type'], $customerTypeIds)) {
                    $customerTypeIds[] = $config['id_customer_type'];
                    $organizedData['customerTypes'][] = [
                        'id' => $config['id_customer_type'],
                        'name' => $config['customer_type_name']
                    ];
                }
            }

            // Extraer tipos de operación únicos
            $operationTypeIds = [];
            foreach ($configurations as $config) {
                if (!in_array($config['id_operation_type'], $operationTypeIds)) {
                    $operationTypeIds[] = $config['id_operation_type'];
                    $organizedData['operationTypes'][] = [
                        'id' => $config['id_operation_type'],
                        'name' => $config['operation_type_name']
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
            $builder = $db->table('configuration_process cp');
            
            $builder->select('
                cp.id as configuration_id,
                cp.id_process,
                p.name as process_name,
                cp.id_agency,
                a.name as agency_name,
                cp.id_customer_type,
                ct.name as customer_type_name,
                cp.id_operation_type,
                ot.name as operation_type_name,
                cp.enabled,
                cp.registration_date,
                cp.update_date
            ')
            ->join('process p', 'p.id = cp.id_process', 'left')
            ->join('agency a', 'a.id = cp.id_agency', 'left')
            ->join('customer_type ct', 'ct.id = cp.id_customer_type', 'left')
            ->join('operation_type ot', 'ot.id = cp.id_operation_type', 'left')
            ->where('cp.enabled', 1)
            ->where('cp.id_agency', $agencyId)
            ->orderBy('p.name', 'ASC')
            ->orderBy('ct.name', 'ASC')
            ->orderBy('ot.name', 'ASC');

            $configurations = $builder->get()->getResultArray();

            // Organizar los datos por categorías para facilitar el uso en cascada
            // Incluir costumerTypes (typo usado en FE) y Id/Name para compatibilidad
            $organizedData = [
                'processes' => [],
                'customerTypes' => [],
                'costumerTypes' => [],
                'operationTypes' => [],
                'configurations' => []
            ];

            // Normalizar configuraciones con Id/Name (PascalCase) para compatibilidad FE
            foreach ($configurations as $config) {
                $organizedData['configurations'][] = [
                    'id' => $config['configuration_id'],
                    'Id' => $config['configuration_id'],
                    'id_process' => $config['id_process'],
                    'IdProcess' => $config['id_process'],
                    'id_customer_type' => $config['id_customer_type'],
                    'IdCostumerType' => $config['id_customer_type'],
                    'id_operation_type' => $config['id_operation_type'],
                    'IdOperationType' => $config['id_operation_type'],
                ];
            }

            // Extraer procesos únicos
            $processIds = [];
            foreach ($configurations as $config) {
                if (!in_array($config['id_process'], $processIds)) {
                    $processIds[] = $config['id_process'];
                    $organizedData['processes'][] = [
                        'id' => $config['id_process'],
                        'Id' => $config['id_process'],
                        'name' => $config['process_name'],
                        'Name' => $config['process_name']
                    ];
                }
            }

            // Extraer tipos de cliente únicos
            $customerTypeIds = [];
            foreach ($configurations as $config) {
                if (!in_array($config['id_customer_type'], $customerTypeIds)) {
                    $customerTypeIds[] = $config['id_customer_type'];
                    $item = [
                        'id' => $config['id_customer_type'],
                        'Id' => $config['id_customer_type'],
                        'name' => $config['customer_type_name'],
                        'Name' => $config['customer_type_name']
                    ];
                    $organizedData['customerTypes'][] = $item;
                    $organizedData['costumerTypes'][] = $item;
                }
            }

            // Extraer tipos de operación únicos
            $operationTypeIds = [];
            foreach ($configurations as $config) {
                if (!in_array($config['id_operation_type'], $operationTypeIds)) {
                    $operationTypeIds[] = $config['id_operation_type'];
                    $organizedData['operationTypes'][] = [
                        'id' => $config['id_operation_type'],
                        'Id' => $config['id_operation_type'],
                        'name' => $config['operation_type_name'],
                        'Name' => $config['operation_type_name']
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
