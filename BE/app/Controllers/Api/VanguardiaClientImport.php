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

            // Validar datos requeridos básicos
            $requiredFields = ['idAgency', 'ndDMS'];
            foreach ($requiredFields as $field) {
                if (!isset($vanguardiaData[$field]) || empty($vanguardiaData[$field])) {
                    return $this->response->setJSON([
                        'success' => false,
                        'message' => "Campo requerido faltante: {$field}",
                        'data' => null
                    ])->setStatusCode(400);
                }
            }

            // Logging de datos recibidos
            error_log("=== VanguardiaClientImport::import - Datos recibidos ===");
            error_log("name: " . ($vanguardiaData['name'] ?? 'NULL'));
            error_log("bussines_name: " . ($vanguardiaData['bussines_name'] ?? 'NULL'));
            error_log("paternal_surname: " . ($vanguardiaData['paternal_surname'] ?? 'NULL'));
            error_log("maternal_surname: " . ($vanguardiaData['maternal_surname'] ?? 'NULL'));

            // Si name viene vacío, usar bussines_name como fallback
            if (empty($vanguardiaData['name']) && !empty($vanguardiaData['bussines_name'])) {
                error_log("⚠️ Campo 'name' vacío, usando 'bussines_name' como fallback");
                $vanguardiaData['name'] = $vanguardiaData['bussines_name'];
                $vanguardiaData['paternal_surname'] = $vanguardiaData['paternal_surname'] ?? '';
                $vanguardiaData['maternal_surname'] = $vanguardiaData['maternal_surname'] ?? '';
                error_log("✅ Nuevo valor de 'name': " . $vanguardiaData['name']);
            }

            // Validar que al menos tengamos un nombre (name o bussines_name)
            if (empty($vanguardiaData['name']) && empty($vanguardiaData['bussines_name'])) {
                error_log("❌ Error: No se proporcionó ni name ni bussines_name");
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Se requiere al menos name o bussines_name',
                    'data' => null
                ])->setStatusCode(400);
            }

            // Verificar si el cliente ya existe por ndDMS
            $existingClient = $this->checkExistingClient($vanguardiaData['ndDMS'], $vanguardiaData['idAgency']);
            if ($existingClient) {
                error_log("✅ Cliente encontrado por ndDMS, retornando datos existentes");
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Cliente ya existe en el sistema local',
                    'data' => $existingClient
                ]);
            }

            // Verificar si existe cliente con la misma RazonSocial (para evitar duplicados)
            $razonSocial = !empty($vanguardiaData['bussines_name']) 
                ? $vanguardiaData['bussines_name'] 
                : trim(($vanguardiaData['name'] ?? '') . ' ' . 
                       ($vanguardiaData['paternal_surname'] ?? '') . ' ' . 
                       ($vanguardiaData['maternal_surname'] ?? ''));
            
            // Verificar si existe cliente con el RazonSocial original
            $existingByRazonSocial = $this->checkExistingClientByRazonSocial($razonSocial);
            if ($existingByRazonSocial) {
                error_log("⚠️ Ya existe cliente con RazonSocial '{$razonSocial}'");
                error_log("✅ Retornando cliente existente en lugar de crear uno nuevo");
                
                // Retornar el cliente existente completo
                $existingClientFull = $this->getClientByRazonSocial($razonSocial);
                if ($existingClientFull) {
                    return $this->response->setJSON([
                        'success' => true,
                        'message' => 'Cliente ya existe en el sistema local',
                        'data' => $existingClientFull
                    ]);
                }
            }
            
            // Verificar también si el RazonSocial con el ndDMS ya existe
            $razonSocialWithNdDMS = $razonSocial . ' (' . $vanguardiaData['ndDMS'] . ')';
            $existingByRazonSocialModified = $this->checkExistingClientByRazonSocial($razonSocialWithNdDMS);
            if ($existingByRazonSocialModified) {
                error_log("⚠️ Ya existe cliente con RazonSocial modificado '{$razonSocialWithNdDMS}'");
                error_log("✅ Retornando cliente existente en lugar de crear uno nuevo");
                
                // Retornar el cliente existente completo
                $existingClientFull = $this->getClientByRazonSocial($razonSocialWithNdDMS);
                if ($existingClientFull) {
                    return $this->response->setJSON([
                        'success' => true,
                        'message' => 'Cliente ya existe en el sistema local',
                        'data' => $existingClientFull
                    ]);
                }
            }
            
            // Si no existe ninguno, preparar el RazonSocial para la inserción
            if ($existingByRazonSocial) {
                // Si el original existe pero el modificado no, usar el modificado
                $vanguardiaData['razonSocial_modified'] = $razonSocialWithNdDMS;
                error_log("✅ Usando RazonSocial modificado: {$razonSocialWithNdDMS}");
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
        error_log("=== Verificando si cliente existe ===");
        error_log("ndDMS: {$ndDMS}, idAgency: {$idAgency}");
        
        // Buscar cliente por ndDMS y agencia (sin requerir que tenga File)
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
                ctr.IdAgency as idAgency,
                hc.Id as headerClientId
            FROM Client c
            INNER JOIN HeaderClient hc ON c.Id = hc.IdClient
            INNER JOIN Client_Total_Relation ctr ON hc.Id = ctr.idHeaderClient
            WHERE ctr.IdTotalDealer = ? AND ctr.IdAgency = ?
        ";

        $query = $this->db->query($sql, [$ndDMS, $idAgency]);
        $result = $query->getRowArray();

        if ($result) {
            error_log("✅ Cliente YA existe por ndDMS: " . json_encode($result));
            return $result;
        }

        error_log("ℹ️ Cliente NO existe por ndDMS, se procederá a crearlo");
        return null;
    }
    
    /**
     * Verificar si existe cliente por RazonSocial (para evitar duplicados)
     */
    private function checkExistingClientByRazonSocial($razonSocial)
    {
        error_log("🔍 Verificando si existe cliente por RazonSocial: {$razonSocial}");
        
        $sql = "
            SELECT 
                c.Id as idCliente,
                c.RazonSocial as razonSocial,
                c.Name as nombre,
                c.LastName as apellidoPaterno,
                c.MotherLastName as apellidoMaterno
            FROM Client c
            WHERE c.RazonSocial = ?
            LIMIT 1
        ";

        $query = $this->db->query($sql, [$razonSocial]);
        $result = $query->getRowArray();

        if ($result) {
            error_log("⚠️ Ya existe cliente con RazonSocial: " . json_encode($result));
        }

        return $result ?: null;
    }

    /**
     * Obtener cliente completo por RazonSocial
     */
    private function getClientByRazonSocial($razonSocial)
    {
        error_log("🔍 Obteniendo cliente completo por RazonSocial: {$razonSocial}");
        
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
                ctr.IdAgency as idAgency,
                hc.Id as headerClientId
            FROM Client c
            INNER JOIN HeaderClient hc ON c.Id = hc.IdClient
            INNER JOIN Client_Total_Relation ctr ON hc.Id = ctr.idHeaderClient
            WHERE c.RazonSocial = ?
            LIMIT 1
        ";

        $query = $this->db->query($sql, [$razonSocial]);
        $result = $query->getRowArray();

        if ($result) {
            error_log("✅ Cliente encontrado por RazonSocial: " . json_encode($result));
        } else {
            error_log("ℹ️ No se encontró cliente con RazonSocial: {$razonSocial}");
        }

        return $result ?: null;
    }

    /**
     * Insertar cliente en tabla Client
     */
    private function insertClient($vanguardiaData)
    {
        // Determinar RazonSocial - usar el modificado si existe, sino construirlo
        $razonSocial = isset($vanguardiaData['razonSocial_modified']) 
            ? $vanguardiaData['razonSocial_modified']
            : (!empty($vanguardiaData['bussines_name']) 
                ? $vanguardiaData['bussines_name'] 
                : trim(($vanguardiaData['name'] ?? '') . ' ' . 
                       ($vanguardiaData['paternal_surname'] ?? '') . ' ' . 
                       ($vanguardiaData['maternal_surname'] ?? '')));
        
        // Verificar una última vez si el RazonSocial ya existe antes de insertar
        $existingClient = $this->checkExistingClientByRazonSocial($razonSocial);
        if ($existingClient) {
            error_log("⚠️ Cliente con RazonSocial '{$razonSocial}' ya existe, no se puede insertar");
            throw new \Exception("Cliente con RazonSocial '{$razonSocial}' ya existe en el sistema. No se puede importar.");
        }
        
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
            'RazonSocial' => $razonSocial,
            'Adviser' => '', // Se puede asignar después
            'AgencyOrigin' => $vanguardiaData['idAgency'] ?? '',
            'RegistrationDate' => date('Y-m-d H:i:s'),
            'UpdateDate' => date('Y-m-d H:i:s'),
            'IdLastUserUpdate' => 1 // Usuario sistema
        ];

        error_log("=== Datos a insertar en Client ===");
        error_log(json_encode($clientData, JSON_PRETTY_PRINT));

        $result = $this->db->table('Client')->insert($clientData);
        if (!$result) {
            $error = $this->db->error();
            // Si es un error de duplicado, intentar obtener el cliente existente
            if (isset($error['code']) && $error['code'] == 1062) {
                error_log("⚠️ Error de duplicado detectado, buscando cliente existente");
                $existingClientFull = $this->getClientByRazonSocial($razonSocial);
                if ($existingClientFull) {
                    throw new \Exception("Cliente con RazonSocial '{$razonSocial}' ya existe en el sistema. No se puede importar.");
                }
            }
            throw new \Exception('Error al insertar en tabla Client: ' . json_encode($error));
        }
        
        error_log("✅ Cliente insertado con ID: " . $nextId);
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
