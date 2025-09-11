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
    public function validateConfigurationExists($processId, $costumerTypeId, $operationTypeId, $agencyId)
    {
        error_log("=== VALIDANDO CONFIGURACIÓN ===");
        error_log("IdProcess: " . $processId);
        error_log("IdCostumerType: " . $costumerTypeId);
        error_log("IdOperationType: " . $operationTypeId);
        error_log("IdAgency: " . $agencyId);
        
        $sql = "SELECT COUNT(*) as count 
                FROM ConfigurationProcess 
                WHERE IdProcess = ? 
                AND IdCostumerType = ? 
                AND IdOperationType = ? 
                AND IdAgency = ? 
                AND Enabled = 1";

        error_log("Query SQL: " . $sql);
        error_log("Parámetros: " . json_encode([$processId, $costumerTypeId, $operationTypeId, $agencyId]));

        $query = $this->db->query($sql, [$processId, $costumerTypeId, $operationTypeId, $agencyId]);
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
                    cp.IdProcess,
                    p.Name as ProcessName,
                    cp.IdCostumerType,
                    ct.Name as CostumerTypeName,
                    cp.IdOperationType,
                    ot.Name as OperationTypeName,
                    cp.IdAgency,
                    a.Name as AgencyName
                FROM ConfigurationProcess cp
                INNER JOIN Process p ON cp.IdProcess = p.Id
                INNER JOIN CostumerType ct ON cp.IdCostumerType = ct.Id
                INNER JOIN OperationType ot ON cp.IdOperationType = ot.Id
                INNER JOIN Agency a ON cp.IdAgency = a.Id
                WHERE cp.IdAgency = ? 
                AND cp.Enabled = 1
                AND p.Enabled = 1
                AND ct.Enabled = 1
                AND ot.Enabled = 1
                ORDER BY p.Name, ct.Name, ot.Name";

        $query = $this->db->query($sql, [$agencyId]);
        return $query->getResultArray();
    }

    /**
     * Obtener procesos habilitados por agencia
     */
    public function getProcessesByAgency($agencyId)
    {
        $sql = "SELECT DISTINCT p.Id, p.Name
                FROM Process p
                INNER JOIN ConfigurationProcess cp ON p.Id = cp.IdProcess
                WHERE cp.IdAgency = ? 
                AND cp.Enabled = 1
                AND p.Enabled = 1
                ORDER BY p.Name";

        $query = $this->db->query($sql, [$agencyId]);
        return $query->getResultArray();
    }

    /**
     * Obtener tipos de cliente habilitados por proceso y agencia
     */
    public function getCostumerTypesByProcessAndAgency($processId, $agencyId)
    {
        $sql = "SELECT DISTINCT ct.Id, ct.Name
                FROM CostumerType ct
                INNER JOIN ConfigurationProcess cp ON ct.Id = cp.IdCostumerType
                WHERE cp.IdProcess = ? 
                AND cp.IdAgency = ? 
                AND cp.Enabled = 1
                AND ct.Enabled = 1
                ORDER BY ct.Name";

        $query = $this->db->query($sql, [$processId, $agencyId]);
        return $query->getResultArray();
    }

    /**
     * Obtener tipos de operación habilitados por proceso, tipo de cliente y agencia
     */
    public function getOperationTypesByProcessCostumerTypeAndAgency($processId, $costumerTypeId, $agencyId)
    {
        $sql = "SELECT DISTINCT ot.Id, ot.Name
                FROM OperationType ot
                INNER JOIN ConfigurationProcess cp ON ot.Id = cp.IdOperationType
                WHERE cp.IdProcess = ? 
                AND cp.IdCostumerType = ? 
                AND cp.IdAgency = ? 
                AND cp.Enabled = 1
                AND ot.Enabled = 1
                ORDER BY ot.Name";

        $query = $this->db->query($sql, [$processId, $costumerTypeId, $agencyId]);
        return $query->getResultArray();
    }

    /**
     * Obtener todas las configuraciones habilitadas
     */
    public function getAllEnabledConfigurations()
    {
        $sql = "SELECT cp.*, p.Name as ProcessName, ct.Name as CostumerTypeName, 
                       ot.Name as OperationTypeName, a.Name as AgencyName
                FROM ConfigurationProcess cp
                INNER JOIN Process p ON cp.IdProcess = p.Id
                INNER JOIN CostumerType ct ON cp.IdCostumerType = ct.Id
                INNER JOIN OperationType ot ON cp.IdOperationType = ot.Id
                INNER JOIN Agency a ON cp.IdAgency = a.Id
                WHERE cp.Enabled = 1
                AND p.Enabled = 1
                AND ct.Enabled = 1
                AND ot.Enabled = 1
                ORDER BY a.Name, p.Name, ct.Name, ot.Name";

        $query = $this->db->query($sql);
        return $query->getResultArray();
    }

    /**
     * Crear nueva configuración
     */
    public function createConfiguration($processId, $costumerTypeId, $operationTypeId, $agencyId, $userId)
    {
        $data = [
            'IdProcess' => $processId,
            'IdCostumerType' => $costumerTypeId,
            'IdOperationType' => $operationTypeId,
            'IdAgency' => $agencyId,
            'Enabled' => 1,
            'RegistrationDate' => date('Y-m-d H:i:s'),
            'UpdateDate' => date('Y-m-d H:i:s'),
            'IdLastUserUpdate' => $userId
        ];

        $this->db->table('ConfigurationProcess')->insert($data);
        return $this->db->insertID();
    }

    /**
     * Habilitar/deshabilitar configuración
     */
    public function toggleConfiguration($configurationId, $enabled, $userId)
    {
        $data = [
            'Enabled' => $enabled ? 1 : 0,
            'UpdateDate' => date('Y-m-d H:i:s'),
            'IdLastUserUpdate' => $userId
        ];

        return $this->db->table('ConfigurationProcess')
            ->where('Id', $configurationId)
            ->update($data);
    }
}

