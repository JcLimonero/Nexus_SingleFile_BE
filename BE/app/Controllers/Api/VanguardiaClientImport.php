<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\HTTP\ResponseInterface;

class VanguardiaClientImport extends ResourceController
{
    protected $db;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }

    /**
     * Importar cliente de Vanguardia al sistema local
     * POST /api/vanguardia-client-import/import
     */
    public function import()
    {
        try {
            // Obtener datos del cliente de Vanguardia
            $vanguardiaData = $this->request->getJSON(true);
            
            if (!$vanguardiaData) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Datos de cliente de Vanguardia requeridos',
                    'data' => null
                ])->setStatusCode(400);
            }

            // Validar datos requeridos
            $requiredFields = ['idAgency', 'ndDMS', 'name', 'paternal_surname', 'maternal_surname'];
            foreach ($requiredFields as $field) {
                if (!isset($vanguardiaData[$field]) || empty($vanguardiaData[$field])) {
                    return $this->response->setJSON([
                        'success' => false,
                        'message' => "Campo requerido faltante: {$field}",
                        'data' => null
                    ])->setStatusCode(400);
                }
            }

            // Verificar si el cliente ya existe
            $existingClient = $this->checkExistingClient($vanguardiaData['ndDMS'], $vanguardiaData['idAgency']);
            if ($existingClient) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Cliente ya existe en el sistema local',
                    'data' => $existingClient
                ]);
            }

            // Iniciar transacción
            $this->db->transStart();

            // 1. Insertar en tabla Client
            $clientId = $this->insertClient($vanguardiaData);
            if (!$clientId) {
                throw new \Exception('Error al insertar cliente en tabla Client');
            }

            // 2. Insertar en tabla HeaderClient
            $headerClientId = $this->insertHeaderClient($clientId);
            if (!$headerClientId) {
                throw new \Exception('Error al insertar cliente en tabla HeaderClient');
            }

            // 3. Insertar en tabla Client_Total_Relation
            $relationId = $this->insertClientTotalRelation($headerClientId, $vanguardiaData);
            if (!$relationId) {
                throw new \Exception('Error al insertar cliente en tabla Client_Total_Relation');
            }

            // 4. Crear un archivo básico para que el cliente aparezca en la vista
            // Temporalmente comentado para debug
            // $fileId = $this->createBasicFile($headerClientId, $vanguardiaData);
            // if (!$fileId) {
            //     throw new \Exception('Error al crear archivo básico para el cliente');
            // }

            // Confirmar transacción
            $this->db->transComplete();

            if ($this->db->transStatus() === false) {
                throw new \Exception('Error en la transacción de base de datos');
            }

            // Obtener el cliente creado
            $createdClient = $this->getCreatedClient($clientId, $headerClientId, $relationId);

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Cliente importado exitosamente desde Vanguardia',
                'data' => $createdClient
            ]);

        } catch (\Exception $e) {
            // Rollback automático en caso de error
            $this->db->transRollback();
            
            error_log("Error en VanguardiaClientImport::import: " . $e->getMessage());
            error_log("Stack trace: " . $e->getTraceAsString());
            error_log("Database error: " . json_encode($this->db->error()));
            
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }

    /**
     * Verificar si el cliente ya existe
     */
    private function checkExistingClient($ndDMS, $idAgency)
    {
        $sql = "
            SELECT 
                c.Id as idCliente,
                ctr.IdTotalDealer as ndCliente,
                TRIM(CONCAT(COALESCE(c.Name, ''), ' ', COALESCE(c.LastName, ''), ' ', COALESCE(c.MotherLastName, ''))) as cliente,
                c.Name as nombre,
                c.LastName as apellidoPaterno,
                c.MotherLastName as apellidoMaterno,
                c.RFC as rfc,
                c.Email as email,
                c.TelNumber as telefono,
                c.TelNumber2 as telefono2,
                c.RazonSocial as razonSocial,
                c.CURP as curp,
                c.Adviser as asesor,
                c.AgencyOrigin as agenciaOrigen,
                c.RegistrationDate as fechaRegistro,
                c.UpdateDate as fechaActualizacion,
                f.IdAgency as idAgency
            FROM Client c
            INNER JOIN HeaderClient hc ON c.Id = hc.IdClient
            INNER JOIN Client_Total_Relation ctr ON hc.Id = ctr.idHeaderClient
            INNER JOIN File f ON hc.Id = f.IdClient
            WHERE ctr.IdTotalDealer = ? AND f.IdAgency = ?
        ";

        $query = $this->db->query($sql, [$ndDMS, $idAgency]);
        $result = $query->getRowArray();

        return $result ?: null;
    }

    /**
     * Insertar cliente en tabla Client
     */
    private function insertClient($vanguardiaData)
    {
        // Obtener el siguiente ID disponible
        $nextId = $this->getNextClientId();
        
        $clientData = [
            'Id' => $nextId,
            'Name' => $vanguardiaData['name'] ?? '',
            'LastName' => $vanguardiaData['paternal_surname'] ?? '',
            'MotherLastName' => $vanguardiaData['maternal_surname'] ?? '',
            'RFC' => $vanguardiaData['rfc'] ?? '',
            'CURP' => $vanguardiaData['curp'] ?? '',
            'TelNumber' => $vanguardiaData['phone'] ?? '',
            'TelNumber2' => $vanguardiaData['mobile_phone'] ?? '',
            'Email' => $vanguardiaData['mail'] ?? '',
            'RazonSocial' => ($vanguardiaData['bussines_name'] ?? '') . ' (Vanguardia)',
            'Adviser' => '', // Se puede asignar después
            'AgencyOrigin' => $vanguardiaData['idAgency'] ?? '',
            'RegistrationDate' => date('Y-m-d H:i:s'),
            'UpdateDate' => date('Y-m-d H:i:s'),
            'IdLastUserUpdate' => 1 // Usuario sistema
        ];

        $result = $this->db->table('Client')->insert($clientData);
        if (!$result) {
            throw new \Exception('Error al insertar en tabla Client: ' . json_encode($this->db->error()));
        }
        return $nextId;
    }

    /**
     * Obtener el siguiente ID disponible para Client
     */
    private function getNextClientId()
    {
        $query = $this->db->query("SELECT MAX(Id) as max_id FROM Client");
        $result = $query->getRow();
        return ($result->max_id ?? 0) + 1;
    }

    /**
     * Insertar cliente en tabla HeaderClient
     */
    private function insertHeaderClient($clientId)
    {
        // Obtener el siguiente ID disponible
        $nextId = $this->getNextHeaderClientId();
        
        $headerData = [
            'Id' => $nextId,
            'IdClient' => $clientId
        ];

        $result = $this->db->table('HeaderClient')->insert($headerData);
        if (!$result) {
            throw new \Exception('Error al insertar en tabla HeaderClient: ' . json_encode($this->db->error()));
        }
        return $nextId;
    }

    /**
     * Insertar cliente en tabla Client_Total_Relation
     */
    private function insertClientTotalRelation($headerClientId, $vanguardiaData)
    {
        // Obtener el siguiente ID disponible
        $nextId = $this->getNextClientTotalRelationId();
        
        // Obtener el ID interno de la agencia
        $agencyId = $this->getAgencyIdFromIdAgency($vanguardiaData['idAgency']);
        
        $relationData = [
            'Id' => $nextId,
            'idHeaderClient' => $headerClientId,
            'IdTotalDealer' => $vanguardiaData['ndDMS'],
            'IdAgency' => $agencyId
        ];

        $result = $this->db->table('Client_Total_Relation')->insert($relationData);
        if (!$result) {
            throw new \Exception('Error al insertar en tabla Client_Total_Relation: ' . json_encode($this->db->error()));
        }
        return $nextId;
    }

    /**
     * Obtener el siguiente ID disponible para HeaderClient
     */
    private function getNextHeaderClientId()
    {
        $query = $this->db->query("SELECT MAX(Id) as max_id FROM HeaderClient");
        $result = $query->getRow();
        return ($result->max_id ?? 0) + 1;
    }

    /**
     * Obtener el siguiente ID disponible para Client_Total_Relation
     */
    private function getNextClientTotalRelationId()
    {
        $query = $this->db->query("SELECT MAX(Id) as max_id FROM Client_Total_Relation");
        $result = $query->getRow();
        return ($result->max_id ?? 0) + 1;
    }

    /**
     * Crear un archivo básico para que el cliente aparezca en la vista
     */
    private function createBasicFile($headerClientId, $vanguardiaData)
    {
        // Obtener el siguiente ID disponible
        $nextId = $this->getNextFileId();
        
        // Obtener el IdAgency correcto (convertir de string a int)
        $idAgency = $this->getAgencyIdFromIdAgency($vanguardiaData['idAgency']);
        
        // Usar SQL directo para evitar problemas con la estructura de la tabla
        $sql = "
            INSERT INTO File (
                Id, IdClient, IdCostumerType, IdOperation, IdProcess, 
                RegistrationDate, UpdateDate, LastUserUpdate, IdAgency, 
                IdSeller, IdLastUserUpdate, IdCurrentState, AttentionDate
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ";
        
        $params = [
            $nextId,
            $headerClientId,
            1, // IdCostumerType por defecto
            1, // IdOperation por defecto
            1, // IdProcess por defecto (Gestión de Clientes)
            date('Y-m-d H:i:s'), // RegistrationDate
            date('Y-m-d H:i:s'), // UpdateDate
            1, // LastUserUpdate
            $idAgency, // IdAgency
            1, // IdSeller por defecto
            1, // IdLastUserUpdate
            1, // IdCurrentState inicial
            date('Y-m-d') // AttentionDate
        ];

        $this->db->query($sql, $params);
        return $nextId;
    }

    /**
     * Obtener el siguiente ID disponible para File
     */
    private function getNextFileId()
    {
        $query = $this->db->query("SELECT MAX(Id) as max_id FROM File");
        $result = $query->getRow();
        return ($result->max_id ?? 0) + 1;
    }

    /**
     * Obtener el IdAgency correcto desde IdAgency de Vanguardia
     */
    private function getAgencyIdFromIdAgency($idAgency)
    {
        // Mapeo de IdAgency de Vanguardia a Id de Agency en el sistema local
        $mapping = [
            '10017' => 1, // HONDA GALERIAS
            '99999' => 24, // GEELY GALERIAS
            '10082' => 2, // Otra agencia
            // Agregar más mapeos según sea necesario
        ];
        
        return $mapping[$idAgency] ?? 1; // Por defecto agencia 1
    }

    /**
     * Obtener el cliente creado con todos sus datos
     */
    private function getCreatedClient($clientId, $headerClientId, $relationId)
    {
        $sql = "
            SELECT 
                c.Id as idCliente,
                ctr.IdTotalDealer as ndCliente,
                TRIM(CONCAT(COALESCE(c.Name, ''), ' ', COALESCE(c.LastName, ''), ' ', COALESCE(c.MotherLastName, ''))) as cliente,
                c.Name as nombre,
                c.LastName as apellidoPaterno,
                c.MotherLastName as apellidoMaterno,
                c.RFC as rfc,
                c.Email as email,
                c.TelNumber as telefono,
                c.TelNumber2 as telefono2,
                c.RazonSocial as razonSocial,
                c.CURP as curp,
                c.Adviser as asesor,
                c.AgencyOrigin as agenciaOrigen,
                c.RegistrationDate as fechaRegistro,
                c.UpdateDate as fechaActualizacion,
                hc.Id as headerClientId,
                ctr.Id as relationId
            FROM Client c
            INNER JOIN HeaderClient hc ON c.Id = hc.IdClient
            INNER JOIN Client_Total_Relation ctr ON hc.Id = ctr.idHeaderClient
            WHERE c.Id = ? AND hc.Id = ? AND ctr.Id = ?
        ";

        $query = $this->db->query($sql, [$clientId, $headerClientId, $relationId]);
        return $query->getRowArray();
    }
}
