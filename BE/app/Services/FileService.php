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
     * Crear file desde datos de Vanguardia
     */
    public function createFileFromVanguardia($data)
    {
        try {
            error_log("=== INICIO FileService::createFileFromVanguardia ===");
            error_log("Datos recibidos: " . json_encode($data));

            // Validar datos requeridos
            $requiredFields = ['order', 'process', 'costumerType', 'operationType', 'clientId', 'agencyId'];
            foreach ($requiredFields as $field) {
                if (!isset($data[$field])) {
                    throw new \Exception("Campo requerido: $field");
                }
            }

            $order = $data['order'];
            $process = $data['process'];
            $costumerType = $data['costumerType'];
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
            error_log("Tipo Cliente: " . $costumerType['Id']);
            error_log("Tipo Operación: " . $operationType['Id']);
            error_log("Agencia Interna: " . $internalAgencyId);
            
            $configurationExists = $this->configurationService->validateConfigurationExists(
                $process['Id'], 
                $costumerType['Id'], 
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

            // Crear o verificar usuario asesor antes de crear el File
            error_log("=== CREANDO/VERIFICANDO USUARIO ASESOR ===");
            $sellerId = $this->userService->getOrCreateSeller($order['ndConsultant'] ?? null);
            error_log("IdSeller obtenido/creado: " . $sellerId);
            
            if (!$sellerId) {
                throw new \Exception('Error al crear o encontrar usuario asesor');
            }

            // Iniciar transacción
            $this->db->transStart();

            // Crear file
            $fileId = $this->createFile($order, $process, $costumerType, $operationType, $client->Id, $internalAgencyId, $data['userId'], $sellerId);

            if (!$fileId) {
                $this->db->transRollback();
                throw new \Exception('Error al crear el file');
            }

            // Crear documentos asociados
            $documentsCreated = $this->createFileDocuments($fileId, $process['Id'], $costumerType['Id'], $operationType['Id'], $internalAgencyId, $data['userId']);

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
            error_log("❌ Error en FileService::createFileFromVanguardia: " . $e->getMessage());
            
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
    private function createFile($order, $process, $costumerType, $operationType, $clientId, $internalAgencyId, $userId, $sellerId)
    {
        $currentDate = date('Y-m-d H:i:s');
        
        error_log("=== CREANDO FILE CON SELLER ID: " . $sellerId . " ===");
        
        $fileData = [
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
        error_log("=== CREANDO DOCUMENTOS PARA FILE ID: " . $fileId . " ===");
        
        // Obtener documentos requeridos para esta configuración
        $requiredDocuments = $this->getRequiredDocuments($processId, $costumerTypeId, $operationTypeId, $agencyId);
        
        if (empty($requiredDocuments)) {
            error_log("No hay documentos requeridos para esta configuración");
            return true;
        }

        $documentsCreated = 0;
        $currentDate = date('Y-m-d H:i:s');

        foreach ($requiredDocuments as $document) {
            $documentData = [
                'IdFile' => $fileId,
                'IdDocumentType' => $document['IdDocumentType'],
                'IdCurrentState' => 1, // Pendiente
                'RegistrationDate' => $currentDate,
                'UpdateDate' => $currentDate,
                'IdLastUserUpdate' => $userId
            ];

            $this->db->table('FileDocument')->insert($documentData);
            $documentsCreated++;
        }

        error_log("Documentos creados: " . $documentsCreated);
        return $documentsCreated;
    }

    /**
     * Obtener documentos requeridos para una configuración
     */
    private function getRequiredDocuments($processId, $costumerTypeId, $operationTypeId, $agencyId)
    {
        $sql = "SELECT DISTINCT dt.Id as IdDocumentType
                FROM DocumentType dt
                INNER JOIN ProcessDocumentType pdt ON dt.Id = pdt.IdDocumentType
                WHERE pdt.IdProcess = ? 
                AND pdt.IdCostumerType = ? 
                AND pdt.IdOperationType = ? 
                AND pdt.IdAgency = ?
                AND pdt.Enabled = 1
                AND dt.Enabled = 1";

        $query = $this->db->query($sql, [$processId, $costumerTypeId, $operationTypeId, $agencyId]);
        return $query->getResultArray();
    }

    /**
     * Buscar cliente por ID externo
     */
    private function getClientByExternalId($externalClientId)
    {
        error_log("=== BUSCANDO CLIENTE POR ID EXTERNO ===");
        error_log("ID externo: " . $externalClientId);
        
        $sql = "SELECT hc.Id 
                FROM HeaderClient hc
                INNER JOIN Client_Total_Relation ctr ON hc.Id = ctr.idHeaderClient
                WHERE ctr.IdTotalDealer = ?";
        
        error_log("SQL: " . $sql);
        error_log("Parámetros: " . json_encode([$externalClientId]));
        
        $query = $this->db->query($sql, [$externalClientId]);
        $result = $query->getRow();
        
        error_log("Resultado query: " . json_encode($result));
        error_log("DB error: " . ($this->db->error()['message'] ?? 'No error'));
        
        return $result;
    }
}
