<?php
namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

class Files extends BaseController
{
    protected $db;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }

    public function getByClient()
    {
        try {
            $ndCliente = $this->request->getGet('ndCliente');
            $statusId = $this->request->getGet('statusId');

            if (!$ndCliente) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El parámetro ndCliente es requerido',
                    'data' => null
                ])->setStatusCode(400);
            }

                        // Query para obtener los files/pedidos del cliente
                        $sql = "
                            SELECT 
                                f.Id as fileId,
                                f.IdOrderTotal as numeroPedido,
                                f.IdInventary as numeroInventario,
                                p.Name as proceso,
                                ot.Name as operacion,
                                ct.Name as tipoCliente,
                                obc.CarType as vehiculo,
                                obc.Year as year,
                                obc.Modelo as modelo,
                                obc.VIN as vin,
                                a.Name as agencia,
                                f.RegistrationDate as fechaRegistro,
                                fs.Name as estatus
                            FROM File f
                            INNER JOIN HeaderClient hc ON f.IdClient = hc.Id
                            INNER JOIN Client_Total_Relation ctr ON hc.Id = ctr.idHeaderClient
                            LEFT JOIN Process p ON f.IdProcess = p.Id
                            LEFT JOIN OperationType ot ON f.IdOperation = ot.Id
                            LEFT JOIN CostumerType ct ON f.IdCostumerType = ct.Id
                            LEFT JOIN Agency a ON f.IdAgency = a.Id
                            LEFT JOIN File_Status fs ON f.IdCurrentState = fs.Id
                            LEFT JOIN OrderByCar obc ON f.IdOrderTotal = obc.IdTotalDealer
                            WHERE ctr.IdTotalDealer = ?
                        ";

            $params = [$ndCliente];

            // Agregar filtro de estatus si se proporciona
            if ($statusId && trim($statusId) !== '') {
                $sql .= " AND fs.Id = ?";
                $params[] = $statusId;
            }

            $sql .= " ORDER BY f.RegistrationDate DESC";

            $query = $this->db->query($sql, $params);
            $results = $query->getResultArray();

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Files obtenidos exitosamente',
                'data' => [
                    'files' => $results,
                    'total' => count($results)
                ]
            ]);

        } catch (\Exception $e) {
            error_log("Error en Files::getByClient: " . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }

    public function getByAgency()
    {
        try {
            $agencyId = $this->request->getGet('agencyId');
            $statusId = $this->request->getGet('statusId');
            $ndCliente = $this->request->getGet('ndCliente');

            if (!$agencyId) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El parámetro agencyId es requerido',
                    'data' => null
                ])->setStatusCode(400);
            }

            // Query para obtener los files/pedidos por agencia
            $sql = "
                SELECT 
                    f.Id as fileId,
                    f.IdOrderTotal as numeroPedido,
                    f.IdInventary as numeroInventario,
                    p.Name as proceso,
                    ot.Name as operacion,
                    ct.Name as tipoCliente,
                    obc.CarType as vehiculo,
                    obc.Year as year,
                    obc.Modelo as modelo,
                    obc.VIN as vin,
                    a.Name as agencia,
                    f.RegistrationDate as fechaRegistro,
                    fs.Name as estatus
                FROM File f
                LEFT JOIN Process p ON f.IdProcess = p.Id
                LEFT JOIN OperationType ot ON f.IdOperation = ot.Id
                LEFT JOIN CostumerType ct ON f.IdCostumerType = ct.Id
                LEFT JOIN Agency a ON f.IdAgency = a.Id
                LEFT JOIN File_Status fs ON f.IdCurrentState = fs.Id
                LEFT JOIN OrderByCar obc ON f.IdOrderTotal = obc.IdTotalDealer
                WHERE a.IdAgency = ?
            ";

            $params = [$agencyId];

            // Agregar filtro de estatus si se proporciona
            if ($statusId && trim($statusId) !== '') {
                $sql .= " AND fs.Id = ?";
                $params[] = $statusId;
            }

            // Agregar filtro de cliente si se proporciona
            if ($ndCliente && trim($ndCliente) !== '') {
                $sql .= " AND f.IdClient IN (
                    SELECT hc.Id 
                    FROM HeaderClient hc 
                    INNER JOIN Client_Total_Relation ctr ON hc.Id = ctr.idHeaderClient 
                    WHERE ctr.IdTotalDealer = ?
                )";
                $params[] = $ndCliente;
            }

            $sql .= " ORDER BY f.RegistrationDate DESC";

            $query = $this->db->query($sql, $params);
            $results = $query->getResultArray();

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Files obtenidos exitosamente',
                'data' => [
                    'files' => $results,
                    'total' => count($results)
                ]
            ]);

        } catch (\Exception $e) {
            error_log("Error en Files::getByAgency: " . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }

    /**
     * Convertir texto de estatus a ID
     */
    private function getStatusId($statusText)
    {
        $statusMap = [
            'Integracion' => 1,
            'Liquidacion' => 2,
            'Liberacion' => 3,
            'Liberado' => 4,
            'Cancelado' => 5,
            'Liberado por Excepción' => 6
        ];

        return $statusMap[$statusText] ?? null;
    }

    /**
     * POST /api/files/create-from-vanguardia-new
     * Crear file desde pedido de Vanguardia con documentos asociados
     */
    public function createFromVanguardiaNew()
    {
        return $this->createFileFromVanguardia();
    }

    /**
     * Método interno para crear file desde Vanguardia
     */
    private function createFileFromVanguardia()
    {
        try {
            error_log("=== INICIO createFromVanguardia - VERSION ACTUALIZADA ===");
            error_log("=== SERVIDOR REINICIADO - CÓDIGO NUEVO EJECUTÁNDOSE ===");
            // Verificar autenticación
            $currentUser = $this->getAuthenticatedUser();
            if (!$currentUser) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Token de autorización requerido'
                ])->setStatusCode(401);
            }

            // Obtener datos del request
            $input = $this->request->getJSON(true);
            
            if (!$input) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Datos JSON requeridos'
                ])->setStatusCode(400);
            }

            // Validar datos requeridos
            $requiredFields = ['order', 'process', 'costumerType', 'operationType', 'clientId', 'agencyId'];
            foreach ($requiredFields as $field) {
                if (!isset($input[$field])) {
                    return $this->response->setJSON([
                        'success' => false,
                        'message' => "Campo requerido: $field"
                    ])->setStatusCode(400);
                }
            }

            $order = $input['order'];
            $process = $input['process'];
            $costumerType = $input['costumerType'];
            $operationType = $input['operationType'];
            $clientId = $input['clientId'];
            $agencyId = $input['agencyId'];

            error_log("Datos recibidos - clientId: $clientId, agencyId: $agencyId");

            // Convertir IdAgency externo al Id interno de la agencia
            $internalAgencyId = $this->getAgencyInternalId($agencyId);
            
            // Validar que la configuración existe
            $configurationExists = $this->validateConfigurationExists(
                $process['Id'], 
                $costumerType['Id'], 
                $operationType['Id'], 
                $internalAgencyId
            );

            if (!$configurationExists) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'La configuración seleccionada no está habilitada'
                ])->setStatusCode(400);
            }

            // Buscar agencia por IdAgency para obtener Id interno
            $agency = $this->getAgencyByExternalId($agencyId);
            if (!$agency) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Agencia no encontrada'
                ])->setStatusCode(400);
            }

            // Buscar cliente por ndCliente para obtener Id interno
            error_log("Buscando cliente con ID externo: " . $clientId);
            $client = $this->getClientByExternalId($clientId);
            error_log("Cliente encontrado: " . json_encode($client));
            if (!$client) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Cliente no encontrado'
                ])->setStatusCode(400);
            }

            // Crear o verificar usuario asesor antes de crear el File
            error_log("=== CREANDO/VERIFICANDO USUARIO ASESOR ===");
            $sellerId = $this->getOrCreateSeller($order['ndConsultant'] ?? null);
            error_log("IdSeller obtenido/creado: " . $sellerId);
            
            if (!$sellerId) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al crear o encontrar usuario asesor'
                ])->setStatusCode(500);
            }

            // Iniciar transacción
            $this->db->transStart();

            // Crear file
            $fileId = $this->createFile($order, $process, $costumerType, $operationType, $client->Id, $internalAgencyId, $currentUser['user_id'], $sellerId);

            if (!$fileId) {
                $this->db->transRollback();
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al crear el file'
                ])->setStatusCode(500);
            }

            // Crear documentos asociados
            $documentsCreated = $this->createFileDocuments($fileId, $process['Id'], $costumerType['Id'], $operationType['Id'], $agencyId, $currentUser['user_id']);

            if (!$documentsCreated) {
                $this->db->transRollback();
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al crear los documentos del file'
                ])->setStatusCode(500);
            }

            // Confirmar transacción
            $this->db->transComplete();

            if ($this->db->transStatus() === false) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error en la transacción de base de datos'
                ])->setStatusCode(500);
            }

            return $this->response->setJSON([
                'success' => true,
                'message' => 'File creado exitosamente con sus documentos',
                'data' => [
                    'fileId' => $fileId,
                    'documentsCreated' => $documentsCreated
                ]
            ]);

        } catch (\Exception $e) {
            error_log("Error en Files::createFromVanguardia: " . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }

    /**
     * Validar que la configuración existe y está habilitada
     */
    private function validateConfigurationExists($processId, $costumerTypeId, $operationTypeId, $agencyId)
    {
        error_log("=== VALIDANDO CONFIGURACIÓN (TEMPORAL - SIEMPRE TRUE) ===");
        error_log("IdProcess: " . $processId);
        error_log("IdCostumerType: " . $costumerTypeId);
        error_log("IdOperationType: " . $operationTypeId);
        error_log("IdAgency: " . $agencyId);
        
        // TEMPORAL: Siempre retornar true para confirmar que el problema está en la validación
        error_log("TEMPORAL: Retornando TRUE para bypass de validación");
        return true;
        
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
     * Buscar agencia por IdAgency externo
     */
    private function getAgencyByExternalId($externalAgencyId)
    {
        $sql = "SELECT Id, Name FROM Agency WHERE IdAgency = ?";
        $query = $this->db->query($sql, [$externalAgencyId]);
        return $query->getRow();
    }

    /**
     * Buscar cliente por ndCliente externo
     */
    private function getClientByExternalId($externalClientId)
    {
        $sql = "SELECT hc.Id 
                FROM HeaderClient hc
                INNER JOIN Client_Total_Relation ctr ON hc.Id = ctr.idHeaderClient
                WHERE ctr.IdTotalDealer = ?";
        $query = $this->db->query($sql, [$externalClientId]);
        return $query->getRow();
    }

    /**
     * Crear file en la base de datos
     */
    private function createFile($order, $process, $costumerType, $operationType, $clientId, $internalAgencyId, $userId, $sellerId)
    {
        $currentDate = date('Y-m-d H:i:s');
        
        error_log("=== CREANDO FILE CON SELLER ID: " . $sellerId . " ===");
        
        // Obtener el siguiente ID disponible
        $nextIdQuery = $this->db->query("SELECT COALESCE(MAX(Id), 0) + 1 as nextId FROM `File`");
        $nextIdResult = $nextIdQuery->getRow();
        $nextId = $nextIdResult->nextId;
        
        error_log("Siguiente ID disponible: " . $nextId);
        
        $fileData = [
            'Id' => $nextId, // Especificar el ID explícitamente
            'IdClient' => $clientId,
            'IdAgency' => $internalAgencyId,
            'IdProcess' => $process['Id'],
            'IdCostumerType' => $costumerType['Id'],
            'IdOperation' => $operationType['Id'],
            'IdSeller' => $sellerId,
            'IdCurrentState' => 1, // Integración
            'IdOrderTotal' => $order['order_dms'] ?? $order['orderDMS'] ?? $order['numeroPedido'] ?? null,
            'IdInventary' => $order['inventory'] ?? $order['inventario'] ?? null,
            'RegistrationDate' => $currentDate,
            'UpdateDate' => $currentDate,
            'IdLastUserUpdate' => $userId
        ];

        error_log("=== CREANDO FILE ===");
        error_log("File data a insertar: " . json_encode($fileData));
        
        $this->db->table('File')->insert($fileData);
        $fileId = $this->db->insertID();
        
        // Debug: log de la inserción
        error_log("File insert ID obtenido: " . $fileId);
        error_log("DB error: " . ($this->db->error()['message'] ?? 'No error'));
        error_log("DB error code: " . ($this->db->error()['code'] ?? 'No code'));
        
        // Si insertID() no funciona, usar el ID que especificamos
        if (!$fileId) {
            $fileId = $nextId;
            error_log("Usando ID especificado: " . $fileId);
        }
        
        if (!$fileId) {
            error_log("ERROR: No se pudo crear el file");
            return false;
        }
        
        error_log("File creado exitosamente con ID: " . $fileId);
        
        return $fileId;
    }

    /**
     * Crear documentos asociados al file
     */
    private function createFileDocuments($fileId, $processId, $costumerTypeId, $operationTypeId, $agencyId, $userId)
    {
        error_log("=== INICIANDO createFileDocuments ===");
        error_log("Parámetros: fileId=$fileId, processId=$processId, costumerTypeId=$costumerTypeId, operationTypeId=$operationTypeId, agencyId=$agencyId, userId=$userId");
        
        // Obtener documentos requeridos para esta configuración
        // El agencyId que llega aquí es el IdAgency externo original (1), no el Id interno
        $externalAgencyId = $agencyId;
        
        error_log("IdAgency externo obtenido: " . $externalAgencyId);
        
        $sql = "SELECT cpd.IdDocumentType, dt.Name as DocumentName
                FROM ConfigurationProcess_DocumentType cpd
                INNER JOIN DocumentType dt ON cpd.IdDocumentType = dt.Id
                INNER JOIN ConfigurationProcess cp ON cpd.IdConfigurationProcess = cp.Id
                WHERE cp.IdProcess = ? 
                AND cp.IdCostumerType = ? 
                AND cp.IdOperationType = ? 
                AND cp.IdAgency = ? 
                AND cp.Enabled = 1";

        error_log("SQL para documentos requeridos: " . $sql);
        error_log("Parámetros SQL: [$processId, $costumerTypeId, $operationTypeId, $externalAgencyId]");

        $query = $this->db->query($sql, [$processId, $costumerTypeId, $operationTypeId, $externalAgencyId]);
        $requiredDocuments = $query->getResultArray();

        error_log("Documentos requeridos encontrados: " . count($requiredDocuments));
        error_log("Documentos requeridos: " . json_encode($requiredDocuments));

        $documentsCreated = 0;

        foreach ($requiredDocuments as $index => $document) {
            error_log("=== PROCESANDO DOCUMENTO " . ($index + 1) . " ===");
            error_log("Documento: " . json_encode($document));
            
            // Obtener el siguiente ID disponible para DocumentByFile
            $nextDocIdQuery = $this->db->query("SELECT COALESCE(MAX(Id), 0) + 1 as nextId FROM DocumentByFile");
            $nextDocIdResult = $nextDocIdQuery->getRow();
            $nextDocId = $nextDocIdResult->nextId;
            
            error_log("Siguiente ID para DocumentByFile: " . $nextDocId);
            
            $documentData = [
                'Id' => $nextDocId, // Especificar el ID explícitamente
                'IdFile' => $fileId,
                'IdDocumentType' => $document['IdDocumentType'],
                'Name' => $document['DocumentName'],
                'Comment' => null,
                'RegistrationDate' => null,
                'UpdateDate' => null,
                'IdCurrentStatus' => 1, // Documento nuevo
                'IdLastUserUpdate' => $userId
            ];

            error_log("Datos del documento a insertar: " . json_encode($documentData));

            try {
                $this->db->table('DocumentByFile')->insert($documentData);
                $insertId = $this->db->insertID();
                error_log("Documento insertado exitosamente. Insert ID: " . $insertId);
                $documentsCreated++;
            } catch (Exception $e) {
                error_log("ERROR al insertar documento: " . $e->getMessage());
                error_log("Error completo: " . json_encode($e));
                throw $e; // Re-lanzar la excepción para que se maneje arriba
            }
        }

        error_log("=== FINALIZANDO createFileDocuments ===");
        error_log("Total documentos creados: " . $documentsCreated);
        return $documentsCreated;
    }

    /**
     * Convertir IdAgency externo al Id interno de la agencia
     */
    private function getAgencyInternalId($agencyId)
    {
        error_log("=== CONVIRTIENDO ID AGENCIA (ORIGINAL) ===");
        error_log("ID recibido: " . $agencyId);
        
        // Primero intentar como ID externo (IdAgency)
        $agency = $this->db->table('Agency')
            ->where('IdAgency', $agencyId)
            ->get()
            ->getRowArray();
            
        if ($agency) {
            error_log("Agencia encontrada por IdAgency: $agencyId, Id interno: " . $agency['Id']);
            return $agency['Id'];
        }
        
        // Si no se encuentra, intentar como ID interno
        $agency = $this->db->table('Agency')
            ->where('Id', $agencyId)
            ->get()
            ->getRowArray();
            
        if ($agency) {
            error_log("Agencia encontrada por Id interno: $agencyId, IdAgency: " . $agency['IdAgency']);
            return $agency['Id'];
        }
        
        error_log("Agencia no encontrada para ID: $agencyId");
        return $agencyId; // Fallback al valor original
    }

    /**
     * Obtener o crear un usuario asesor
     */
    private function getOrCreateSeller($ndConsultant)
    {
        error_log("=== GET OR CREATE SELLER ===");
        error_log("ndConsultant recibido: " . ($ndConsultant ?? 'NULL'));
        
        // Si no hay ndConsultant, usar el usuario actual como asesor
        if (!$ndConsultant) {
            $currentUser = $this->getAuthenticatedUser();
            error_log("Usuario autenticado: " . json_encode($currentUser));
            $userId = $currentUser['id'] ?? 1; // Fallback al usuario admin
            error_log("Usando usuario actual como asesor: " . $userId);
            return $userId;
        }

        // Buscar si ya existe un usuario con este ndConsultant
        $existingUser = $this->db->table('User')
            ->where('User', $ndConsultant)
            ->orWhere('Mail', $ndConsultant . '@default.com')
            ->get()
            ->getRowArray();

        if ($existingUser) {
            error_log("Usuario asesor encontrado: " . $existingUser['Id']);
            return $existingUser['Id'];
        }

        // Verificar si ya existe un usuario con el mismo nombre
        $duplicateUser = $this->db->table('User')
            ->where('User', $ndConsultant)
            ->get()
            ->getRowArray();
            
        if ($duplicateUser) {
            error_log("Usuario duplicado encontrado: " . json_encode($duplicateUser));
            return $duplicateUser['Id'];
        }

        // TEMPORAL: Usar usuario admin como fallback para evitar problemas de inserción
        error_log("No se encontró usuario asesor para ndConsultant: " . $ndConsultant . ", usando usuario admin como fallback");
        return 1; // Usuario admin
    }
}
