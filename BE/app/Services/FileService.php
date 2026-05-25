<?php
namespace App\Services;

use CodeIgniter\Database\BaseConnection;

class FileService
{
    protected $db;
    protected $agencyService;
    protected $userService;
    protected $configurationService;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
        $this->agencyService = new AgencyService();
        $this->userService = new UserService();
        $this->configurationService = new ConfigurationService();
    }

    /**
     * Crear file desde datos de NexFile
     */
    public function createFileFromNexFile($data)
    {
        try {
            error_log("=== INICIO FileService::createFileFromNexFile ===");
            error_log("Datos recibidos: " . json_encode($data));

            // Validar datos requeridos
            $requiredFields = ['order', 'process', 'customerType', 'operationType', 'clientId', 'agencyId'];
            foreach ($requiredFields as $field) {
                if (!isset($data[$field])) {
                    throw new \Exception("Campo requerido: $field");
                }
            }

            $order = $data['order'];
            $process = $data['process'];
            $customerType = $data['customerType'];
            $operationType = $data['operationType'];
            $clientId = $data['clientId'];
            $agencyId = $data['agencyId'];

            error_log("Datos procesados - clientId: $clientId, agencyId: $agencyId");

            // Convertir IdAgency externo al Id interno de la agencia
            error_log("=== CONVIRTIENDO AGENCY ID ===");
            error_log("AgencyId recibido: " . $agencyId);
            $internalAgencyId = $this->agencyService->getAgencyInternalId($agencyId);
            error_log("AgencyId interno obtenido: " . $internalAgencyId);
            
            // Validar que la configuración existe
            error_log("=== VALIDANDO CONFIGURACIÓN ===");
            error_log("Proceso: " . $process['Id']);
            error_log("Tipo Cliente: " . $customerType['Id']);
            error_log("Tipo Operación: " . $operationType['Id']);
            error_log("Agencia Interna: " . $internalAgencyId);
            
            $configurationExists = $this->configurationService->validateConfigurationExists(
                $process['Id'], 
                $customerType['Id'], 
                $operationType['Id'], 
                $internalAgencyId
            );

            error_log("Configuración válida: " . ($configurationExists ? 'SÍ' : 'NO'));

            if (!$configurationExists) {
                error_log("❌ CONFIGURACIÓN NO VÁLIDA - LANZANDO EXCEPCIÓN");
                throw new \Exception('La configuración seleccionada no está habilitada');
            }
            
            error_log("✅ CONFIGURACIÓN VÁLIDA - CONTINUANDO");

            // Buscar agencia por IdAgency para obtener Id interno
            $agency = $this->agencyService->getAgencyByExternalId($agencyId);
            if (!$agency) {
                throw new \Exception('Agencia no encontrada');
            }

            // Buscar cliente por ndCliente para obtener Id interno
            error_log("Buscando cliente con ID externo: " . $clientId);
            $client = $this->getClientByExternalId($clientId);
            error_log("Cliente encontrado: " . json_encode($client));
            if (!$client) {
                error_log("❌ Cliente no encontrado para ID externo: " . $clientId);
                throw new \Exception('Cliente no encontrado');
            }

            // Crear o verificar usuario advisor antes de crear el File
            error_log("=== CREANDO/VERIFICANDO USUARIO ASESOR ===");
            $sellerId = $this->userService->getOrCreateSeller($order['ndConsultant'] ?? null);
            error_log("IdSeller obtenido/creado: " . $sellerId);
            
            if (!$sellerId) {
                throw new \Exception('Error al crear o encontrar usuario asesor');
            }

            // Iniciar transacción
            $this->db->transStart();

            // Crear file
            $fileId = $this->createFile($order, $process, $customerType, $operationType, $client->Id, $internalAgencyId, $data['userId'], $sellerId);

            if (!$fileId) {
                $this->db->transRollback();
                throw new \Exception('Error al crear el file');
            }

            // Crear documentos asociados
            $documentsCreated = $this->createFileDocuments($fileId, $process['Id'], $customerType['Id'], $operationType['Id'], $internalAgencyId, $data['userId']);

            if (!$documentsCreated) {
                $this->db->transRollback();
                throw new \Exception('Error al crear documentos del file');
            }

            // Confirmar transacción
            $this->db->transComplete();

            if ($this->db->transStatus() === false) {
                throw new \Exception('Error en la transacción de base de datos');
            }

            error_log("✅ File creado exitosamente con ID: " . $fileId);

            return [
                'success' => true,
                'message' => 'File creado exitosamente',
                'data' => [
                    'fileId' => $fileId,
                    'documentsCreated' => $documentsCreated
                ]
            ];

        } catch (\Exception $e) {
            error_log("❌ Error en FileService::createFileFromNexFile: " . $e->getMessage());
            
            if ($this->db->transStatus() !== false) {
                $this->db->transRollback();
            }

            return [
                'success' => false,
                'message' => $e->getMessage(),
                'data' => null
            ];
        }
    }

    /**
     * Crear file en la base de datos
     */
    private function createFile($order, $process, $customerType, $operationType, $clientId, $internalAgencyId, $userId, $sellerId)
    {
        $currentDate = date('Y-m-d H:i:s');
        
        error_log("=== CREANDO FILE CON SELLER ID: " . $sellerId . " ===");
        
        $idOrderTotal = $order['order_dms'] ?? $order['orderDMS'] ?? $order['numeroPedido'] ?? null;
        
        $fileData = [
            'id_client' => $clientId,
            'id_agency' => $internalAgencyId,
            'id_sale_type' => $process['id'] ?? $process['Id'] ?? null,
            'id_customer_type' => $customerType['id'] ?? $customerType['Id'] ?? null,
            'id_operation' => $operationType['id'] ?? $operationType['Id'] ?? null,
            'id_seller' => $sellerId,
            'id_current_state' => 1, // Integración
            'id_order_total' => $idOrderTotal,
            // id_order debe ser el ID de Order (foreign key), no id_order_total
            // Si no se proporciona orderByCarId, no se asigna (NULL por defecto)
            'id_inventory' => $order['inventory'] ?? $order['inventario'] ?? null,
            'registration_date' => $currentDate,
            'update_date' => $currentDate,
            'id_last_user_update' => $userId
        ];

        error_log("=== CREANDO FILE ===");
        error_log("File data a insertar: " . json_encode($fileData));
        
        $this->db->table('expedient')->insert($fileData);
        $fileId = $this->db->insertID();
        
        // Debug: log de la inserción
        error_log("File insert ID obtenido: " . $fileId);
        error_log("DB error: " . ($this->db->error()['message'] ?? 'No error'));
        error_log("DB error code: " . ($this->db->error()['code'] ?? 'No code'));
        
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
    private function createFileDocuments($fileId, $processId, $customerTypeId, $operationTypeId, $agencyId, $userId)
    {
        error_log("=== CREANDO DOCUMENTOS PARA FILE ID: " . $fileId . " ===");
        
        // Obtener documentos requeridos para esta configuración
        $requiredDocuments = $this->getRequiredDocuments($processId, $customerTypeId, $operationTypeId, $agencyId);
        
        if (empty($requiredDocuments)) {
            error_log("No hay documentos requeridos para esta configuración");
            return true;
        }

        $documentsCreated = 0;
        $currentDate = date('Y-m-d H:i:s');

        foreach ($requiredDocuments as $document) {
            $documentData = [
                'id_file' => $fileId,
                'id_document_type' => $document['id_document_type'] ?? $document['IdDocumentType'] ?? null,
                'id_current_state' => 1, // Pendiente
                'registration_date' => $currentDate,
                'update_date' => $currentDate,
                'id_last_user_update' => $userId
            ];

            $this->db->table('file_document')->insert($documentData);
            $documentsCreated++;
        }

        error_log("Documentos creados: " . $documentsCreated);
        return $documentsCreated;
    }

    /**
     * Obtener documentos requeridos para una configuración
     */
    private function getRequiredDocuments($processId, $customerTypeId, $operationTypeId, $agencyId)
    {
        $sql = "SELECT DISTINCT dt.id as id_document_type
                FROM document_type dt
                INNER JOIN configuration_process_document_type cpd ON dt.id = cpd.id_document_type
                INNER JOIN configuration_process cp ON cpd.id_configuration_process = cp.id
                WHERE cp.id_sale_type = ? 
                AND cp.id_customer_type = ? 
                AND cp.id_operation_type = ? 
                AND cp.id_agency = ?
                AND cp.enabled = 1
                AND dt.enabled = 1";

        $query = $this->db->query($sql, [$processId, $customerTypeId, $operationTypeId, $agencyId]);
        return $query->getResultArray();
    }

    /**
     * Buscar cliente por ID externo
     */
    private function getClientByExternalId($externalClientId)
    {
        error_log("=== BUSCANDO CLIENTE POR ID EXTERNO ===");
        error_log("ID externo: " . $externalClientId);
        
        $sql = "SELECT hc.id 
                FROM client_header hc
                INNER JOIN client_dms_relation ctr ON hc.id = ctr.id_client_header
                WHERE ctr.id_dms = ?";
        
        error_log("SQL: " . $sql);
        error_log("Parámetros: " . json_encode([$externalClientId]));
        
        $query = $this->db->query($sql, [$externalClientId]);
        $result = $query->getRow();
        
        error_log("Resultado query: " . json_encode($result));
        error_log("DB error: " . ($this->db->error()['message'] ?? 'No error'));
        
        return $result;
    }
}
