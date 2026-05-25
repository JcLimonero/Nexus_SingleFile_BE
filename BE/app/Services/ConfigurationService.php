<?php
namespace App\Services;

use CodeIgniter\Database\BaseConnection;

class ConfigurationService
{
    protected $db;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }

    /**
     * Validar que la configuración existe y está habilitada
     */
    public function validateConfigurationExists($processId, $customerTypeId, $operationTypeId, $agencyId)
    {
        error_log("=== VALIDANDO CONFIGURACIÓN ===");
        error_log("IdProcess: " . $processId);
        error_log("IdCustomerType: " . $customerTypeId);
        error_log("IdOperationType: " . $operationTypeId);
        error_log("IdAgency: " . $agencyId);
        
        $sql = "SELECT COUNT(*) as count 
                FROM configuration_process 
                WHERE id_sale_type = ? 
                AND id_customer_type = ? 
                AND id_operation_type = ? 
                AND id_agency = ? 
                AND enabled = 1";

        error_log("Query SQL: " . $sql);
        error_log("Parámetros: " . json_encode([$processId, $customerTypeId, $operationTypeId, $agencyId]));

        $query = $this->db->query($sql, [$processId, $customerTypeId, $operationTypeId, $agencyId]);
        $result = $query->getRow();

        error_log("Resultado del query: " . json_encode($result));
        error_log("Count encontrado: " . $result->count);
        error_log("Configuración válida: " . ($result->count > 0 ? 'SÍ' : 'NO'));

        return $result->count > 0;
    }

    /**
     * Obtener configuraciones habilitadas por agencia
     */
    public function getEnabledConfigurationsByAgency($agencyId)
    {
        $sql = "SELECT DISTINCT 
                    cp.id_sale_type,
                    p.name as ProcessName,
                    cp.id_customer_type,
                    ct.name as CustomerTypeName,
                    cp.id_operation_type,
                    ot.name as OperationTypeName,
                    cp.id_agency,
                    a.name as AgencyName
                FROM configuration_process cp
                INNER JOIN sale_type p ON cp.id_sale_type = p.id
                INNER JOIN customer_type ct ON cp.id_customer_type = ct.id
                INNER JOIN operation_type ot ON cp.id_operation_type = ot.id
                INNER JOIN agency a ON cp.id_agency = a.id
                WHERE cp.id_agency = ?
                AND cp.enabled = 1
                AND p.enabled = 1
                AND ct.enabled = 1
                AND ot.enabled = 1
                ORDER BY p.name, ct.name, ot.name";

        $query = $this->db->query($sql, [$agencyId]);
        return $query->getResultArray();
    }

    /**
     * Obtener procesos habilitados por agencia
     */
    public function getProcessesByAgency($agencyId)
    {
        $sql = "SELECT DISTINCT p.id, p.name
                FROM sale_type p
                INNER JOIN configuration_process cp ON p.id = cp.id_sale_type
                WHERE cp.id_agency = ? 
                AND cp.enabled = 1
                AND p.enabled = 1
                ORDER BY p.name";

        $query = $this->db->query($sql, [$agencyId]);
        return $query->getResultArray();
    }

    /**
     * Obtener tipos de cliente habilitados por proceso y agencia
     */
    public function getCustomerTypesByProcessAndAgency($processId, $agencyId)
    {
        $sql = "SELECT DISTINCT ct.id, ct.name
                FROM customer_type ct
                INNER JOIN configuration_process cp ON ct.id = cp.id_customer_type
                WHERE cp.id_sale_type = ? 
                AND cp.id_agency = ? 
                AND cp.enabled = 1
                AND ct.enabled = 1
                ORDER BY ct.name";

        $query = $this->db->query($sql, [$processId, $agencyId]);
        return $query->getResultArray();
    }

    /**
     * Obtener tipos de operación habilitados por proceso, tipo de cliente y agencia
     */
    public function getOperationTypesByProcessCustomerTypeAndAgency($processId, $customerTypeId, $agencyId)
    {
        $sql = "SELECT DISTINCT ot.id, ot.name
                FROM operation_type ot
                INNER JOIN configuration_process cp ON ot.id = cp.id_operation_type
                WHERE cp.id_sale_type = ? 
                AND cp.id_customer_type = ? 
                AND cp.id_agency = ? 
                AND cp.enabled = 1
                AND ot.enabled = 1
                ORDER BY ot.name";

        $query = $this->db->query($sql, [$processId, $customerTypeId, $agencyId]);
        return $query->getResultArray();
    }

    /**
     * Obtener todas las configuraciones habilitadas
     */
    public function getAllEnabledConfigurations()
    {
        $sql = "SELECT cp.*, p.name as ProcessName, ct.name as CustomerTypeName, 
                       ot.name as OperationTypeName, a.name as AgencyName
                FROM configuration_process cp
                INNER JOIN sale_type p ON cp.id_sale_type = p.id
                INNER JOIN customer_type ct ON cp.id_customer_type = ct.id
                INNER JOIN operation_type ot ON cp.id_operation_type = ot.id
                INNER JOIN agency a ON cp.id_agency = a.id
                WHERE cp.enabled = 1
                AND p.enabled = 1
                AND ct.enabled = 1
                AND ot.enabled = 1
                ORDER BY a.name, p.name, ct.name, ot.name";

        $query = $this->db->query($sql);
        return $query->getResultArray();
    }

    /**
     * Crear nueva configuración
     */
    public function createConfiguration($processId, $customerTypeId, $operationTypeId, $agencyId, $userId)
    {
        $data = [
            'id_sale_type' => $processId,
            'id_customer_type' => $customerTypeId,
            'id_operation_type' => $operationTypeId,
            'id_agency' => $agencyId,
            'enabled' => 1,
            'registration_date' => date('Y-m-d H:i:s'),
            'update_date' => date('Y-m-d H:i:s'),
            'id_last_user_update' => $userId
        ];

        $this->db->table('configuration_process')->insert($data);
        return $this->db->insertID();
    }

    /**
     * Habilitar/deshabilitar configuración
     */
    public function toggleConfiguration($configurationId, $enabled, $userId)
    {
        $data = [
            'enabled' => $enabled ? 1 : 0,
            'update_date' => date('Y-m-d H:i:s'),
            'id_last_user_update' => $userId
        ];

        return $this->db->table('configuration_process')
            ->where('id', $configurationId)
            ->update($data);
    }
}

