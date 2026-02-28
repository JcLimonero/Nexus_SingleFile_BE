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

            // No hay en client_total_relation por ND: buscar en Client por RFC del API.
            // Si existe cliente con ese RFC, insertar HeaderClient + ClientTotalRelation
            // (usar el Client con RegistrationDate más reciente).
            $rfcFromApi = trim($vanguardiaData['rfc'] ?? '');
            if ($rfcFromApi !== '') {
                $clientByRfc = $this->findClientByRfc($rfcFromApi);
                if ($clientByRfc) {
                    error_log("✅ Cliente existe por RFC; insertando HeaderClient + Client_Total_Relation para nd " . $vanguardiaData['ndDMS']);
                    $this->db->transStart();
                    try {
                        $headerClientId = $this->insertHeaderClient($clientByRfc['Id']);
                        if (!$headerClientId) {
                            throw new \Exception('Error al insertar en tabla HeaderClient');
                        }
                        $relationId = $this->insertClientTotalRelation($headerClientId, $vanguardiaData);
                        if (!$relationId) {
                            throw new \Exception('Error al insertar en tabla ClientTotalRelation');
                        }
                        $this->db->transComplete();
                        if ($this->db->transStatus() === false) {
                            throw new \Exception('Error en la transacción de base de datos');
                        }
                        $created = $this->getCreatedClient($clientByRfc['Id'], $headerClientId, $relationId);
                        return $this->response->setJSON([
                            'success' => true,
                            'message' => 'Cliente vinculado por RFC; se creó HeaderClient y ClientTotalRelation',
                            'data' => $created
                        ]);
                    } catch (\Exception $e) {
                        $this->db->transRollback();
                        throw $e;
                    }
                }
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
                
                // Verificar si este cliente tiene la relación con el ndDMS y idAgency específicos
                $idAgencyInternal = $this->getAgencyIdFromIdAgency($vanguardiaData['idAgency']);
                $hasRelation = $this->checkClientTotalRelation($existingByRazonSocial['idCliente'], $vanguardiaData['ndDMS'], $idAgencyInternal);
                
                if ($hasRelation) {
                    // El cliente existe y tiene la relación, retornarlo
                    error_log("✅ Cliente existe y tiene la relación con ndDMS {$vanguardiaData['ndDMS']} y idAgency {$idAgencyInternal}");
                    $existingClientFull = $this->getClientByRazonSocial($razonSocial);
                    if ($existingClientFull) {
                        return $this->response->setJSON([
                            'success' => true,
                            'message' => 'Cliente ya existe en el sistema local',
                            'data' => $existingClientFull
                        ]);
                    }
                } else {
                    // El cliente existe pero NO tiene la relación, crear la relación
                    error_log("⚠️ Cliente existe pero NO tiene relación con ndDMS {$vanguardiaData['ndDMS']} y idAgency {$idAgencyInternal}, creando relación");
                    $this->db->transStart();
                    try {
                        // Obtener el HeaderClient del cliente existente
                        $headerClient = $this->db->table('header_client')
                            ->where('IdClient', $existingByRazonSocial['idCliente'])
                            ->get()
                            ->getRowArray();
                        
                        if (!$headerClient) {
                            // Si no tiene HeaderClient, crearlo
                            $headerClientId = $this->insertHeaderClient($existingByRazonSocial['idCliente']);
                        } else {
                            $headerClientId = $headerClient['Id'];
                        }
                        
                        // Crear la relación ClientTotalRelation
                        $relationId = $this->insertClientTotalRelation($headerClientId, $vanguardiaData);
                        if (!$relationId) {
                            throw new \Exception('Error al insertar en tabla ClientTotalRelation');
                        }
                        
                        $this->db->transComplete();
                        if ($this->db->transStatus() === false) {
                            throw new \Exception('Error en la transacción de base de datos');
                        }
                        
                        // Obtener el cliente actualizado con la nueva relación
                        $created = $this->getCreatedClient($existingByRazonSocial['idCliente'], $headerClientId, $relationId);
                        return $this->response->setJSON([
                            'success' => true,
                            'message' => 'Cliente existente vinculado con nuevo ndDMS; se creó ClientTotalRelation',
                            'data' => $created
                        ]);
                    } catch (\Exception $e) {
                        $this->db->transRollback();
                        throw $e;
                    }
                }
            }
            
            // Verificar también si el RazonSocial con el ndDMS ya existe
            $razonSocialWithNdDMS = $razonSocial . ' (' . $vanguardiaData['ndDMS'] . ')';
            $existingByRazonSocialModified = $this->checkExistingClientByRazonSocial($razonSocialWithNdDMS);
            if ($existingByRazonSocialModified) {
                error_log("⚠️ Ya existe cliente con RazonSocial modificado '{$razonSocialWithNdDMS}'");
                
                // Verificar si tiene la relación
                $idAgencyInternal = $this->getAgencyIdFromIdAgency($vanguardiaData['idAgency']);
                $hasRelation = $this->checkClientTotalRelation($existingByRazonSocialModified['idCliente'], $vanguardiaData['ndDMS'], $idAgencyInternal);
                
                if ($hasRelation) {
                    error_log("✅ Cliente existe y tiene la relación");
                    $existingClientFull = $this->getClientByRazonSocial($razonSocialWithNdDMS);
                    if ($existingClientFull) {
                        return $this->response->setJSON([
                            'success' => true,
                            'message' => 'Cliente ya existe en el sistema local',
                            'data' => $existingClientFull
                        ]);
                    }
                } else {
                    // Crear la relación si no existe
                    error_log("⚠️ Cliente existe pero NO tiene relación, creando relación");
                    $this->db->transStart();
                    try {
                        $headerClient = $this->db->table('header_client')
                            ->where('IdClient', $existingByRazonSocialModified['idCliente'])
                            ->get()
                            ->getRowArray();
                        
                        if (!$headerClient) {
                            $headerClientId = $this->insertHeaderClient($existingByRazonSocialModified['idCliente']);
                        } else {
                            $headerClientId = $headerClient['Id'];
                        }
                        
                        $relationId = $this->insertClientTotalRelation($headerClientId, $vanguardiaData);
                        $this->db->transComplete();
                        
                        $created = $this->getCreatedClient($existingByRazonSocialModified['idCliente'], $headerClientId, $relationId);
                        return $this->response->setJSON([
                            'success' => true,
                            'message' => 'Cliente existente vinculado con nuevo ndDMS; se creó ClientTotalRelation',
                            'data' => $created
                        ]);
                    } catch (\Exception $e) {
                        $this->db->transRollback();
                        throw $e;
                    }
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

            // 3. Insertar en tabla ClientTotalRelation
            $relationId = $this->insertClientTotalRelation($headerClientId, $vanguardiaData);
            if (!$relationId) {
                throw new \Exception('Error al insertar cliente en tabla ClientTotalRelation');
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
    private function checkExistingClient($ndDMS, $idAgencyVanguardia)
    {
        $idAgencyInternal = $this->getAgencyIdFromIdAgency($idAgencyVanguardia);
        error_log("=== Verificando si cliente existe ===");
        error_log("ndDMS: {$ndDMS}, idAgency (internal): {$idAgencyInternal}");
        
        // Buscar cliente por ndDMS y agencia (sin requerir que tenga File)
        $sql = "
            SELECT 
                c.Id as idCliente,
                ctr.IdDMS as ndCliente,
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
            FROM client c
            INNER JOIN header_client hc ON c.Id = hc.IdClient
            INNER JOIN client_total_relation ctr ON hc.Id = ctr.idHeaderClient
            WHERE ctr.IdDMS = ? AND ctr.IdAgency = ?
        ";

        $query = $this->db->query($sql, [$ndDMS, $idAgencyInternal]);
        $result = $query->getRowArray();

        if ($result) {
            error_log("✅ Cliente YA existe por ndDMS: " . json_encode($result));
            return $result;
        }

        error_log("ℹ️ Cliente NO existe por ndDMS, se procederá a crearlo");
        return null;
    }

    /**
     * Verificar si un cliente tiene una relación Client_Total_Relation específica
     */
    private function checkClientTotalRelation($clientId, $ndDMS, $idAgency)
    {
        error_log("=== Verificando relación Client_Total_Relation ===");
        error_log("clientId: {$clientId}, ndDMS: {$ndDMS}, idAgency: {$idAgency}");
        
        $sql = "
            SELECT ctr.Id
            FROM header_client hc
            INNER JOIN client_total_relation ctr ON hc.Id = ctr.idHeaderClient
            WHERE hc.IdClient = ? 
            AND ctr.IdDMS = ? 
            AND ctr.IdAgency = ?
            LIMIT 1
        ";
        
        $query = $this->db->query($sql, [$clientId, $ndDMS, $idAgency]);
        $result = $query->getRowArray();
        
        if ($result) {
            error_log("✅ Relación existe");
            return true;
        }
        
        error_log("ℹ️ Relación NO existe");
        return false;
    }

    /**
     * Buscar cliente en tabla Client por RFC (el de RegistrationDate más reciente).
     * Usado cuando no hay coincidencia por nd en client_total_relation pero sí existe
     * un cliente con el mismo RFC que devuelve el API.
     */
    private function findClientByRfc($rfc)
    {
        $rfcTrimmed = trim((string) ($rfc ?? ''));
        if ($rfcTrimmed === '') {
            return null;
        }
        error_log("🔍 Buscando cliente por RFC: {$rfcTrimmed}");
        $sql = "
            SELECT c.Id, c.Name, c.LastName, c.MotherLastName, c.RFC, c.Email, c.TelNumber,
                   c.TelNumber2, c.RazonSocial, c.CURP, c.Adviser, c.AgencyOrigin,
                   c.RegistrationDate, c.UpdateDate
            FROM client c
            WHERE TRIM(c.RFC) = ?
            ORDER BY c.RegistrationDate DESC
            LIMIT 1
        ";
        $query = $this->db->query($sql, [$rfcTrimmed]);
        $result = $query->getRowArray();
        if ($result) {
            error_log("✅ Cliente encontrado por RFC (RegistrationDate más reciente): Id=" . $result['Id']);
        } else {
            error_log("ℹ️ No hay cliente en Client con RFC: {$rfcTrimmed}");
        }
        return $result ?: null;
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
            FROM client c
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
                ctr.IdDMS as ndCliente,
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
            FROM client c
            INNER JOIN header_client hc ON c.Id = hc.IdClient
            INNER JOIN client_total_relation ctr ON hc.Id = ctr.idHeaderClient
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

        $result = $this->db->table('client')->insert($clientData);
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
        $query = $this->db->query("SELECT MAX(Id) as max_id FROM client");
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

        $result = $this->db->table('header_client')->insert($headerData);
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
            'IdDMS' => $vanguardiaData['ndDMS'],
            'IdAgency' => $agencyId
        ];

        $result = $this->db->table('client_total_relation')->insert($relationData);
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
        $query = $this->db->query("SELECT MAX(Id) as max_id FROM header_client");
        $result = $query->getRow();
        return ($result->max_id ?? 0) + 1;
    }

    /**
     * Obtener el siguiente ID disponible para Client_Total_Relation
     */
    private function getNextClientTotalRelationId()
    {
        $query = $this->db->query("SELECT MAX(Id) as max_id FROM client_total_relation");
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
        $query = $this->db->query("SELECT MAX(Id) as max_id FROM file");
        $result = $query->getRow();
        return ($result->max_id ?? 0) + 1;
    }

    /**
     * Obtener el Id interno de la agencia desde IdAgency externo o Id interno.
     * Busca primero por Id interno, luego por IdAgency externo en la tabla Agency.
     */
    private function getAgencyIdFromIdAgency($idAgency)
    {
        error_log("=== CONVIRTIENDO ID AGENCIA EN VanguardiaClientImport ===");
        error_log("ID recibido: " . $idAgency . " (tipo: " . gettype($idAgency) . ")");
        
        // Convertir a string para comparación
        $idAgencyStr = (string) $idAgency;
        
        // Primero intentar como ID interno (Id) - el frontend puede enviar el ID interno
        $agency = $this->db->table('agency')
            ->where('Id', $idAgencyStr)
            ->get()
            ->getRowArray();
            
        if ($agency) {
            error_log("✅ Agencia encontrada por Id interno: {$idAgencyStr}, IdAgencyDMS externo: " . ($agency['IdAgencyDMS'] ?? 'N/A'));
            return (int) $agency['Id']; // Retornar el ID interno
        }
        
        // Si no se encuentra, intentar como ID externo (IdAgencyDMS)
        $agency = $this->db->table('agency')
            ->where('IdAgencyDMS', $idAgencyStr)
            ->get()
            ->getRowArray();
            
        if ($agency) {
            error_log("✅ Agencia encontrada por IdAgencyDMS externo: {$idAgencyStr}, Id interno: " . $agency['Id']);
            return (int) $agency['Id'];
        }
        
        error_log("⚠️ Agencia NO encontrada para ID: {$idAgencyStr}, usando valor original como fallback");
        // Fallback: intentar usar el valor como ID interno directamente
        return is_numeric($idAgencyStr) ? (int) $idAgencyStr : 1;
    }

    /**
     * Obtener el cliente creado con todos sus datos
     */
    private function getCreatedClient($clientId, $headerClientId, $relationId)
    {
        $sql = "
            SELECT 
                c.Id as idCliente,
                ctr.IdDMS as ndCliente,
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
            FROM client c
            INNER JOIN header_client hc ON c.Id = hc.IdClient
            INNER JOIN client_total_relation ctr ON hc.Id = ctr.idHeaderClient
            WHERE c.Id = ? AND hc.Id = ? AND ctr.Id = ?
        ";

        $query = $this->db->query($sql, [$clientId, $headerClientId, $relationId]);
        return $query->getRowArray();
    }
}
