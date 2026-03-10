<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\HTTP\ResponseInterface;

class NexFileClientImport extends ResourceController
{
    protected $db;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }

    /**
     * Importar cliente de NexFile al sistema local
     * POST /api/NexFile-client-import/import
     */
    public function import()
    {
        try {
            // Obtener datos del cliente de NexFile
            $NexFileData = $this->request->getJSON(true);
            
            if (!$NexFileData) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Datos de cliente de NexFile requeridos',
                    'data' => null
                ])->setStatusCode(400);
            }

            // Validar datos requeridos básicos
            $requiredFields = ['idAgency', 'ndDMS'];
            foreach ($requiredFields as $field) {
                if (!isset($NexFileData[$field]) || empty($NexFileData[$field])) {
                    return $this->response->setJSON([
                        'success' => false,
                        'message' => "Campo requerido faltante: {$field}",
                        'data' => null
                    ])->setStatusCode(400);
                }
            }

            // Logging de datos recibidos
            error_log("=== NexFileClientImport::import - Datos recibidos ===");
            error_log("name: " . ($NexFileData['name'] ?? 'NULL'));
            error_log("bussines_name: " . ($NexFileData['bussines_name'] ?? 'NULL'));
            error_log("paternal_surname: " . ($NexFileData['paternal_surname'] ?? 'NULL'));
            error_log("maternal_surname: " . ($NexFileData['maternal_surname'] ?? 'NULL'));

            // Si name viene vacío, usar bussines_name como fallback
            if (empty($NexFileData['name']) && !empty($NexFileData['bussines_name'])) {
                error_log("⚠️ Campo 'name' vacío, usando 'bussines_name' como fallback");
                $NexFileData['name'] = $NexFileData['bussines_name'];
                $NexFileData['paternal_surname'] = $NexFileData['paternal_surname'] ?? '';
                $NexFileData['maternal_surname'] = $NexFileData['maternal_surname'] ?? '';
                error_log("✅ Nuevo valor de 'name': " . $NexFileData['name']);
            }

            // Validar que al menos tengamos un nombre (name o bussines_name)
            if (empty($NexFileData['name']) && empty($NexFileData['bussines_name'])) {
                error_log("❌ Error: No se proporcionó ni name ni bussines_name");
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Se requiere al menos name o bussines_name',
                    'data' => null
                ])->setStatusCode(400);
            }

            // Verificar si el cliente ya existe por ndDMS
            $existingClient = $this->checkExistingClient($NexFileData['ndDMS'], $NexFileData['idAgency']);
            if ($existingClient) {
                error_log("✅ Cliente encontrado por ndDMS, retornando datos existentes");
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Cliente ya existe en el sistema local',
                    'data' => $existingClient
                ]);
            }

            // No hay en client_dms_relation por ND: buscar en Client por RFC del API.
            // Si existe cliente con ese RFC, insertar ClientHeader + ClientTotalRelation
            // (usar el Client con RegistrationDate más reciente).
            $rfcFromApi = trim($NexFileData['rfc'] ?? '');
            if ($rfcFromApi !== '') {
                $clientByRfc = $this->findClientByRfc($rfcFromApi);
                if ($clientByRfc) {
                    error_log("✅ Cliente existe por RFC; insertando ClientHeader + ClientDMSRelation para nd " . $NexFileData['ndDMS']);
                    $this->db->transStart();
                    try {
                        $headerClientId = $this->insertClientHeader($clientByRfc['Id']);
                        if (!$headerClientId) {
                            throw new \Exception('Error al insertar en tabla ClientHeader');
                        }
                        $relationId = $this->insertClientTotalRelation($headerClientId, $NexFileData);
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
                            'message' => 'Cliente vinculado por RFC; se creó ClientHeader y ClientTotalRelation',
                            'data' => $created
                        ]);
                    } catch (\Exception $e) {
                        $this->db->transRollback();
                        throw $e;
                    }
                }
            }

            // Verificar si existe cliente con la misma RazonSocial (para evitar duplicados)
            $razonSocial = !empty($NexFileData['bussines_name']) 
                ? $NexFileData['bussines_name'] 
                : trim(($NexFileData['name'] ?? '') . ' ' . 
                       ($NexFileData['paternal_surname'] ?? '') . ' ' . 
                       ($NexFileData['maternal_surname'] ?? ''));
            
            // Verificar si existe cliente con el RazonSocial original
            $existingByRazonSocial = $this->checkExistingClientByRazonSocial($razonSocial);
            if ($existingByRazonSocial) {
                error_log("⚠️ Ya existe cliente con RazonSocial '{$razonSocial}'");
                
                // Verificar si este cliente tiene la relación con el ndDMS y idAgency específicos
                $idAgencyInternal = $this->getAgencyIdFromIdAgency($NexFileData['idAgency']);
                $hasRelation = $this->checkClientTotalRelation($existingByRazonSocial['idCliente'], $NexFileData['ndDMS'], $idAgencyInternal);
                
                if ($hasRelation) {
                    // El cliente existe y tiene la relación, retornarlo
                    error_log("✅ Cliente existe y tiene la relación con ndDMS {$NexFileData['ndDMS']} y idAgency {$idAgencyInternal}");
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
                    error_log("⚠️ Cliente existe pero NO tiene relación con ndDMS {$NexFileData['ndDMS']} y idAgency {$idAgencyInternal}, creando relación");
                    $this->db->transStart();
                    try {
                        // Obtener el ClientHeader del cliente existente
                        $headerClient = $this->db->table('client_header')
                            ->where('id_client', $existingByRazonSocial['idCliente'])
                            ->get()
                            ->getRowArray();
                        
                        if (!$headerClient) {
                            // Si no tiene ClientHeader, crearlo
                            $headerClientId = $this->insertClientHeader($existingByRazonSocial['idCliente']);
                        } else {
                            $headerClientId = $headerClient['id'] ?? $headerClient['Id'];
                        }
                        
                        // Crear la relación ClientTotalRelation
                        $relationId = $this->insertClientTotalRelation($headerClientId, $NexFileData);
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
            $razonSocialWithNdDMS = $razonSocial . ' (' . $NexFileData['ndDMS'] . ')';
            $existingByRazonSocialModified = $this->checkExistingClientByRazonSocial($razonSocialWithNdDMS);
            if ($existingByRazonSocialModified) {
                error_log("⚠️ Ya existe cliente con RazonSocial modificado '{$razonSocialWithNdDMS}'");
                
                // Verificar si tiene la relación
                $idAgencyInternal = $this->getAgencyIdFromIdAgency($NexFileData['idAgency']);
                $hasRelation = $this->checkClientTotalRelation($existingByRazonSocialModified['idCliente'], $NexFileData['ndDMS'], $idAgencyInternal);
                
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
                        $headerClient = $this->db->table('client_header')
                            ->where('id_client', $existingByRazonSocialModified['idCliente'])
                            ->get()
                            ->getRowArray();
                        
                        if (!$headerClient) {
                            $headerClientId = $this->insertClientHeader($existingByRazonSocialModified['idCliente']);
                        } else {
                            $headerClientId = $headerClient['id'] ?? $headerClient['Id'];
                        }
                        
                        $relationId = $this->insertClientTotalRelation($headerClientId, $NexFileData);
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
                $NexFileData['razonSocial_modified'] = $razonSocialWithNdDMS;
                error_log("✅ Usando RazonSocial modificado: {$razonSocialWithNdDMS}");
            }

            // Iniciar transacción
            $this->db->transStart();

            // 1. Insertar en tabla Client
            $clientId = $this->insertClient($NexFileData);
            if (!$clientId) {
                throw new \Exception('Error al insertar cliente en tabla Client');
            }

            // 2. Insertar en tabla ClientHeader
            $headerClientId = $this->insertClientHeader($clientId);
            if (!$headerClientId) {
                throw new \Exception('Error al insertar cliente en tabla ClientHeader');
            }

            // 3. Insertar en tabla ClientTotalRelation
            $relationId = $this->insertClientTotalRelation($headerClientId, $NexFileData);
            if (!$relationId) {
                throw new \Exception('Error al insertar cliente en tabla ClientTotalRelation');
            }

            // 4. Crear un archivo básico para que el cliente aparezca en la vista
            // Temporalmente comentado para debug
            // $fileId = $this->createBasicFile($headerClientId, $NexFileData);
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
                'message' => 'Cliente importado exitosamente desde NexFile',
                'data' => $createdClient
            ]);

        } catch (\Exception $e) {
            // Rollback automático en caso de error
            $this->db->transRollback();
            
            error_log("Error en NexFileClientImport::import: " . $e->getMessage());
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
    private function checkExistingClient($ndDMS, $idAgencyNexFile)
    {
        $idAgencyInternal = $this->getAgencyIdFromIdAgency($idAgencyNexFile);
        error_log("=== Verificando si cliente existe ===");
        error_log("ndDMS: {$ndDMS}, idAgency (internal): {$idAgencyInternal}");
        
        // Buscar cliente por ndDMS y agencia (sin requerir que tenga File)
        $sql = "
            SELECT 
                c.id as idCliente,
                ctr.id_dms as ndCliente,
                TRIM(CONCAT(COALESCE(c.name, ''), ' ', COALESCE(c.last_name, ''), ' ', COALESCE(c.mother_last_name, ''))) as cliente,
                c.name as nombre,
                c.last_name as apellidoPaterno,
                c.mother_last_name as apellidoMaterno,
                c.RFC as rfc,
                c.email as email,
                c.tel_number as telefono,
                c.tel_number2 as telefono2,
                c.razon_social as razonSocial,
                c.CURP as curp,
                c.adviser as asesor,
                c.agency_origin as agenciaOrigen,
                c.registration_date as fechaRegistro,
                c.update_date as fechaActualizacion,
                ctr.id_agency as idAgency,
                hc.id as headerClientId
            FROM client c
            INNER JOIN client_header hc ON c.id = hc.id_client
            INNER JOIN client_dms_relation ctr ON hc.id = ctr.id_client_header
            WHERE ctr.id_dms = ? AND ctr.id_agency = ?
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
     * Verificar si un cliente tiene una relación ClientDMSRelation específica
     */
    private function checkClientTotalRelation($clientId, $ndDMS, $idAgency)
    {
        error_log("=== Verificando relación ClientDMSRelation ===");
        error_log("clientId: {$clientId}, ndDMS: {$ndDMS}, idAgency: {$idAgency}");
        
        $sql = "
            SELECT ctr.id
            FROM client_header hc
            INNER JOIN client_dms_relation ctr ON hc.id = ctr.id_client_header
            WHERE hc.id_client = ? 
            AND ctr.id_dms = ? 
            AND ctr.id_agency = ?
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
     * Usado cuando no hay coincidencia por nd en client_dms_relation pero sí existe
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
            SELECT c.id, c.name, c.last_name, c.mother_last_name, c.RFC, c.email, c.tel_number,
                   c.tel_number2, c.razon_social, c.CURP, c.adviser, c.agency_origin,
                   c.registration_date, c.update_date
            FROM client c
            WHERE TRIM(c.RFC) = ?
            ORDER BY c.registration_date DESC
            LIMIT 1
        ";
        $query = $this->db->query($sql, [$rfcTrimmed]);
        $result = $query->getRowArray();
        if ($result) {
            error_log("✅ Cliente encontrado por RFC (registration_date más reciente): id=" . ($result['id'] ?? $result['Id'] ?? 'N/A'));
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
                c.id as idCliente,
                ctr.id_dms as ndCliente,
                TRIM(CONCAT(COALESCE(c.name, ''), ' ', COALESCE(c.last_name, ''), ' ', COALESCE(c.mother_last_name, ''))) as cliente,
                c.name as nombre,
                c.last_name as apellidoPaterno,
                c.mother_last_name as apellidoMaterno,
                c.RFC as rfc,
                c.email as email,
                c.tel_number as telefono,
                c.tel_number2 as telefono2,
                c.razon_social as razonSocial,
                c.CURP as curp,
                c.adviser as asesor,
                c.agency_origin as agenciaOrigen,
                c.registration_date as fechaRegistro,
                c.update_date as fechaActualizacion,
                ctr.id_agency as idAgency,
                hc.id as headerClientId
            FROM client c
            INNER JOIN client_header hc ON c.id = hc.id_client
            INNER JOIN client_dms_relation ctr ON hc.id = ctr.id_client_header
            WHERE c.razon_social = ?
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
    private function insertClient($NexFileData)
    {
        // Determinar RazonSocial - usar el modificado si existe, sino construirlo
        $razonSocial = isset($NexFileData['razonSocial_modified']) 
            ? $NexFileData['razonSocial_modified']
            : (!empty($NexFileData['bussines_name']) 
                ? $NexFileData['bussines_name'] 
                : trim(($NexFileData['name'] ?? '') . ' ' . 
                       ($NexFileData['paternal_surname'] ?? '') . ' ' . 
                       ($NexFileData['maternal_surname'] ?? '')));
        
        // Verificar una última vez si el RazonSocial ya existe antes de insertar
        $existingClient = $this->checkExistingClientByRazonSocial($razonSocial);
        if ($existingClient) {
            error_log("⚠️ Cliente con RazonSocial '{$razonSocial}' ya existe, no se puede insertar");
            throw new \Exception("Cliente con RazonSocial '{$razonSocial}' ya existe en el sistema. No se puede importar.");
        }
        
        // Obtener el siguiente ID disponible
        $nextId = $this->getNextClientId();
        
        $clientData = [
            'id' => $nextId,
            'name' => $NexFileData['name'] ?? '',
            'last_name' => $NexFileData['paternal_surname'] ?? '',
            'mother_last_name' => $NexFileData['maternal_surname'] ?? '',
            'RFC' => $NexFileData['rfc'] ?? '',
            'CURP' => $NexFileData['curp'] ?? '',
            'tel_number' => $NexFileData['phone'] ?? '',
            'tel_number2' => $NexFileData['mobile_phone'] ?? '',
            'email' => $NexFileData['mail'] ?? '',
            'razon_social' => $razonSocial,
            'tipo_cliente' => $this->normalizeTipoClienteForDb($NexFileData['tipo_cliente'] ?? null),
            'adviser' => '', // Se puede asignar después
            'agency_origin' => $NexFileData['idAgency'] ?? '',
            'registration_date' => date('Y-m-d H:i:s'),
            'update_date' => date('Y-m-d H:i:s'),
            'id_last_user_update' => 1 // Usuario sistema
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
        $query = $this->db->query("SELECT MAX(id) as max_id FROM client");
        $result = $query->getRow();
        return ($result->max_id ?? 0) + 1;
    }

    /**
     * Insertar cliente en tabla ClientHeader
     */
    private function insertClientHeader($clientId)
    {
        // Obtener el siguiente ID disponible
        $nextId = $this->getNextClientHeaderId();
        
        $headerData = [
            'id' => $nextId,
            'id_client' => $clientId
        ];

        $result = $this->db->table('client_header')->insert($headerData);
        if (!$result) {
            throw new \Exception('Error al insertar en tabla ClientHeader: ' . json_encode($this->db->error()));
        }
        return $nextId;
    }

    /**
     * Insertar cliente en tabla ClientDMSRelation
     */
    private function insertClientTotalRelation($headerClientId, $NexFileData)
    {
        // Obtener el siguiente ID disponible
        $nextId = $this->getNextClientTotalRelationId();
        
        // Obtener el ID interno de la agencia
        $agencyId = $this->getAgencyIdFromIdAgency($NexFileData['idAgency']);
        
        $relationData = [
            'id' => $nextId,
            'id_client_header' => $headerClientId,
            'id_dms' => $NexFileData['ndDMS'],
            'id_agency' => $agencyId
        ];

        $result = $this->db->table('client_dms_relation')->insert($relationData);
        if (!$result) {
            throw new \Exception('Error al insertar en tabla ClientDMSRelation: ' . json_encode($this->db->error()));
        }
        return $nextId;
    }

    /**
     * Obtener el siguiente ID disponible para ClientHeader
     */
    private function getNextClientHeaderId()
    {
        $query = $this->db->query("SELECT MAX(id) as max_id FROM client_header");
        $result = $query->getRow();
        return ($result->max_id ?? 0) + 1;
    }

    /**
     * Obtener el siguiente ID disponible para ClientDMSRelation
     */
    private function getNextClientTotalRelationId()
    {
        $query = $this->db->query("SELECT MAX(id) as max_id FROM client_dms_relation");
        $result = $query->getRow();
        return ($result->max_id ?? 0) + 1;
    }

    /**
     * Crear un archivo básico para que el cliente aparezca en la vista
     */
    private function createBasicFile($headerClientId, $NexFileData)
    {
        // Obtener el siguiente ID disponible
        $nextId = $this->getNextFileId();
        
        // Obtener el IdAgency correcto (convertir de string a int)
        $idAgency = $this->getAgencyIdFromIdAgency($NexFileData['idAgency']);
        
        // Usar SQL directo para evitar problemas con la estructura de la tabla
        $sql = "
            INSERT INTO expedient (
                id, id_client, id_customer_type, id_operation, id_process, 
                registration_date, update_date, last_user_update, id_agency, 
                id_seller, id_last_user_update, id_current_state, attention_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ";
        
        $params = [
            $nextId,
            $headerClientId,
            1, // IdCustomerType por defecto
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
        $query = $this->db->query("SELECT MAX(id) as max_id FROM expedient");
        $result = $query->getRow();
        return ($result->max_id ?? 0) + 1;
    }

    /**
     * Obtener el Id interno de la agencia desde IdAgency externo o Id interno.
     * Busca primero por Id interno, luego por IdAgency externo en la tabla Agency.
     */
    private function getAgencyIdFromIdAgency($idAgency)
    {
        error_log("=== CONVIRTIENDO ID AGENCIA EN NexFileClientImport ===");
        error_log("ID recibido: " . $idAgency . " (tipo: " . gettype($idAgency) . ")");
        
        // Convertir a string para comparación
        $idAgencyStr = (string) $idAgency;
        
        // Primero intentar como ID interno (Id) - el frontend puede enviar el ID interno
        $agency = $this->db->table('agency')
            ->where('id', $idAgencyStr)
            ->get()
            ->getRowArray();
            
        if ($agency) {
            error_log("✅ Agencia encontrada por Id interno: {$idAgencyStr}, IdAgencyDMS externo: " . ($agency['IdAgencyDMS'] ?? 'N/A'));
            return (int) ($agency['id'] ?? $agency['Id']); // Retornar el ID interno
        }
        
        // Si no se encuentra, intentar como ID externo (id_agency_dms)
        $agency = $this->db->table('agency')
            ->where('id_agency_dms', $idAgencyStr)
            ->get()
            ->getRowArray();
            
        if ($agency) {
            error_log("✅ Agencia encontrada por IdAgencyDMS externo: {$idAgencyStr}, Id interno: " . $agency['Id']);
            return (int) ($agency['id'] ?? $agency['Id']);
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
                c.id as idCliente,
                ctr.id_dms as ndCliente,
                TRIM(CONCAT(COALESCE(c.name, ''), ' ', COALESCE(c.last_name, ''), ' ', COALESCE(c.mother_last_name, ''))) as cliente,
                c.name as nombre,
                c.last_name as apellidoPaterno,
                c.mother_last_name as apellidoMaterno,
                c.RFC as rfc,
                c.email as email,
                c.tel_number as telefono,
                c.tel_number2 as telefono2,
                c.razon_social as razonSocial,
                c.CURP as curp,
                c.tipo_cliente as tipoCliente,
                c.adviser as asesor,
                c.agency_origin as agenciaOrigen,
                c.registration_date as fechaRegistro,
                c.update_date as fechaActualizacion,
                hc.id as headerClientId,
                ctr.id as relationId
            FROM client c
            INNER JOIN client_header hc ON c.id = hc.id_client
            INNER JOIN client_dms_relation ctr ON hc.id = ctr.id_client_header
            WHERE c.id = ? AND hc.id = ? AND ctr.id = ?
        ";

        $query = $this->db->query($sql, [$clientId, $headerClientId, $relationId]);
        return $query->getRowArray();
    }

    /** Convierte tipo_cliente a ID: 'fisica'/'moral' -> 1/2, 1/2 se mantienen */
    private function normalizeTipoClienteForDb($value): ?int
    {
        if ($value === null || $value === '') return null;
        $t = strtolower(trim((string) $value));
        if ($t === 'moral') return 2;
        if ($t === 'fisica') return 1;
        if ($t === '1' || $t === '2') return (int) $t;
        return is_numeric($value) ? (int) $value : null;
    }
}
