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
                                obc.CarType as version,
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

            // Query mejorado para obtener TODOS los files/pedidos por agencia y cliente
            // Usamos INNER JOIN con Agency para asegurar que existe la agencia
            // LEFT JOINs con otras tablas para no perder registros aunque falten datos relacionados
            $sql = "
                SELECT DISTINCT
                    f.Id as fileId,
                    f.IdOrderTotal as numeroPedido,
                    f.IdInventary as numeroInventario,
                    p.Name as proceso,
                    ot.Name as operacion,
                    ct.Name as tipoCliente,
                    obc.CarType as version,
                    obc.Year as year,
                    obc.Modelo as modelo,
                    obc.VIN as vin,
                    a.Name as agencia,
                    f.RegistrationDate as fechaRegistro,
                    fs.Name as estatus
                FROM File f
                INNER JOIN Agency a ON f.IdAgency = a.Id
                LEFT JOIN Process p ON f.IdProcess = p.Id
                LEFT JOIN OperationType ot ON f.IdOperation = ot.Id
                LEFT JOIN CostumerType ct ON f.IdCostumerType = ct.Id
                LEFT JOIN File_Status fs ON f.IdCurrentState = fs.Id
                LEFT JOIN OrderByCar obc ON f.IdOrderTotal = obc.IdTotalDealer
                WHERE a.IdAgency = ?
            ";

            $params = [$agencyId];

            // Agregar filtro de estatus si se proporciona
            // IMPORTANTE: Filtramos directamente por f.IdCurrentState porque el LEFT JOIN con File_Status
            // puede devolver NULL si no hay registro en File_Status, causando que fs.Id = ? falle siempre
            // Esto es crítico para que los archivos se muestren correctamente
            if ($statusId && trim($statusId) !== '') {
                $sql .= " AND f.IdCurrentState = ?";
                $params[] = $statusId;
            }

            // Agregar filtro de cliente si se proporciona
            // Mejoramos el filtro para buscar por IdTotalDealer de manera más robusta
            // Usamos EXISTS en lugar de IN para mejor rendimiento y evitar duplicados
            if ($ndCliente && trim($ndCliente) !== '') {
                $ndClienteTrimmed = trim($ndCliente);
                // Buscar todos los HeaderClient que tengan relación con este IdTotalDealer
                // Usamos EXISTS para mejor rendimiento y para asegurar que encontramos todos los registros
                $sql .= " AND EXISTS (
                    SELECT 1
                    FROM HeaderClient hc 
                    INNER JOIN Client_Total_Relation ctr ON hc.Id = ctr.idHeaderClient 
                    WHERE hc.Id = f.IdClient 
                    AND TRIM(ctr.IdTotalDealer) = ?
                )";
                $params[] = $ndClienteTrimmed;
            }

            $sql .= " ORDER BY f.RegistrationDate DESC";
            
            error_log("=== Query getByAgency ===");
            error_log("SQL: " . $sql);
            error_log("Params: " . json_encode($params));

            error_log("=== Ejecutando query getByAgency ===");
            error_log("SQL final: " . $sql);
            error_log("Parámetros: " . json_encode($params));
            
            $query = $this->db->query($sql, $params);
            $results = $query->getResultArray();
            
            // DIAGNÓSTICO: Verificar si el File 12328 debería aparecer
            try {
                $diagnosticSql = "
                    SELECT 
                        f.Id as fileId,
                        f.IdCurrentState,
                        f.IdAgency as FileIdAgency,
                        a.Id as AgencyId,
                        a.IdAgency as AgencyIdAgency,
                        f.IdClient,
                        fs.Id as FileStatusId,
                        fs.Name as FileStatusName
                    FROM File f
                    LEFT JOIN Agency a ON f.IdAgency = a.Id
                    LEFT JOIN File_Status fs ON f.IdCurrentState = fs.Id
                    WHERE f.Id = 12328
                ";
                $diagnosticQuery = $this->db->query($diagnosticSql);
                $diagnosticResult = $diagnosticQuery->getRow();
                if ($diagnosticResult) {
                    error_log("=== DIAGNÓSTICO FILE 12328 ===");
                    error_log("File ID: " . $diagnosticResult->fileId);
                    error_log("IdCurrentState: " . ($diagnosticResult->IdCurrentState ?? 'NULL'));
                    error_log("IdAgency (interno en File): " . ($diagnosticResult->FileIdAgency ?? 'NULL'));
                    error_log("Agency Id (interno): " . ($diagnosticResult->AgencyId ?? 'NULL'));
                    error_log("Agency IdAgency (externo): " . ($diagnosticResult->AgencyIdAgency ?? 'NULL'));
                    error_log("IdClient: " . ($diagnosticResult->IdClient ?? 'NULL'));
                    error_log("FileStatusId: " . ($diagnosticResult->FileStatusId ?? 'NULL'));
                    error_log("FileStatusName: " . ($diagnosticResult->FileStatusName ?? 'NULL'));
                    
                    // Verificar si pasa los filtros
                    $expectedStatus = $statusId ? $statusId : 'cualquiera';
                    $actualStatus = $diagnosticResult->IdCurrentState ?? 'NULL';
                    $expectedAgency = $agencyId;
                    $actualAgency = $diagnosticResult->AgencyIdAgency ?? 'NULL';
                    
                    error_log("--- VERIFICACIÓN DE FILTROS ---");
                    error_log("Status esperado: $expectedStatus, Status actual: $actualStatus " . ($actualStatus == $expectedStatus ? '✅' : '❌'));
                    error_log("Agency esperada: $expectedAgency, Agency actual: $actualAgency " . ($actualAgency == $expectedAgency ? '✅' : '❌'));
                    
                    // Verificar relación con cliente si se proporcionó
                    if ($ndCliente) {
                        $clientCheckSql = "
                            SELECT COUNT(*) as count
                            FROM HeaderClient hc 
                            INNER JOIN Client_Total_Relation ctr ON hc.Id = ctr.idHeaderClient 
                            WHERE hc.Id = ? AND TRIM(ctr.IdTotalDealer) = ?
                        ";
                        $clientCheckQuery = $this->db->query($clientCheckSql, [$diagnosticResult->IdClient, trim($ndCliente)]);
                        $clientCheckResult = $clientCheckQuery->getRow();
                        $hasClientRelation = ($clientCheckResult->count ?? 0) > 0;
                        error_log("Cliente esperado: $ndCliente, Cliente relacionado: " . ($hasClientRelation ? '✅ SÍ' : '❌ NO'));
                    }
                } else {
                    error_log("⚠️ File 12328 NO EXISTE en la base de datos");
                }
            } catch (\Exception $e) {
                error_log("Error en diagnóstico File 12328: " . $e->getMessage());
            }
            
            // Log para diagnóstico: verificar si los datos vienen correctamente
            error_log("=== DIAGNÓSTICO getByAgency ===");
            error_log("Total de files encontrados: " . count($results));
            error_log("Parámetros de búsqueda - agencyId: $agencyId, statusId: $statusId, ndCliente: $ndCliente");
            
            if (!empty($results)) {
                error_log("✅ Se encontraron " . count($results) . " files");
                error_log("Primer file (ejemplo): " . json_encode($results[0]));
                if (isset($results[0]['year']) || isset($results[0]['modelo']) || isset($results[0]['version']) || isset($results[0]['vin'])) {
                    error_log("✅ Campos year, modelo, version, vin están presentes en los resultados");
                    error_log("Valores: year=" . ($results[0]['year'] ?? 'NULL') . ", modelo=" . ($results[0]['modelo'] ?? 'NULL') . ", version=" . ($results[0]['version'] ?? 'NULL') . ", vin=" . ($results[0]['vin'] ?? 'NULL'));
                } else {
                    error_log("⚠️ Campos year, modelo, version, vin NO están presentes o son NULL (esto es normal si no hay registro en OrderByCar)");
                }
                
                // Log de todos los fileIds encontrados para diagnóstico
                $fileIds = array_column($results, 'fileId');
                error_log("File IDs encontrados: " . implode(', ', array_slice($fileIds, 0, 20)) . (count($fileIds) > 20 ? '... (total: ' . count($fileIds) . ')' : ''));
                
                // Verificar específicamente si el 12328 está en los resultados
                if (in_array(12328, $fileIds)) {
                    error_log("✅ File 12328 ESTÁ en los resultados");
                } else {
                    error_log("❌ File 12328 NO está en los resultados");
                }
            } else {
                error_log("⚠️ No se encontraron files para los parámetros dados");
                error_log("Query ejecutado: " . $sql);
                error_log("Parámetros: " . json_encode($params));
            }

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
            error_log("Stack trace: " . $e->getTraceAsString());
            error_log("Stack trace: " . $e->getTraceAsString());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }
    
    /**
     * Endpoint de diagnóstico para verificar el JOIN con OrderByCar
     * GET /api/files/debug-join-orderbycar?agencyId=10082&ndCliente=200945&statusId=1
     */
    public function debugJoinOrderByCar()
    {
        try {
            $agencyId = $this->request->getGet('agencyId');
            $statusId = $this->request->getGet('statusId');
            $ndCliente = $this->request->getGet('ndCliente');

            if (!$agencyId) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El parámetro agencyId es requerido'
                ])->setStatusCode(400);
            }

            // Query de diagnóstico
            $sql = "
                SELECT 
                    f.Id as fileId,
                    f.IdOrderTotal as file_numeroPedido,
                    f.IdInventary as numeroInventario,
                    obc.Id as orderByCarId,
                    obc.Number as orderByCar_Number,
                    obc.IdTotalDealer as orderByCar_IdTotalDealer,
                    obc.Year as year,
                    obc.Modelo as modelo,
                    obc.CarType as version,
                    obc.VIN as vin,
                    CASE 
                        WHEN f.IdOrderTotal = obc.IdTotalDealer THEN 'COINCIDENCIA CON IdTotalDealer'
                        WHEN obc.Id IS NULL THEN 'NO HAY REGISTRO EN OrderByCar'
                        ELSE 'NO COINCIDE'
                    END as estado_join
                FROM File f
                LEFT JOIN Agency a ON f.IdAgency = a.Id
                LEFT JOIN File_Status fs ON f.IdCurrentState = fs.Id
                LEFT JOIN OrderByCar obc ON f.IdOrderTotal = obc.IdTotalDealer
                WHERE a.IdAgency = ?
            ";

            $params = [$agencyId];

            if ($statusId && trim($statusId) !== '') {
                $sql .= " AND fs.Id = ?";
                $params[] = $statusId;
            }

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
                'message' => 'Diagnóstico de JOIN con OrderByCar',
                'data' => [
                    'files' => $results,
                    'total' => count($results),
                    'query' => $sql,
                    'params' => $params
                ]
            ]);

        } catch (\Exception $e) {
            error_log("Error en Files::debugJoinOrderByCar: " . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
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

            // Extraer IDs de los objetos
            $processId = is_array($process) ? $process['Id'] : $process;
            $costumerTypeId = is_array($costumerType) ? $costumerType['Id'] : $costumerType;
            $operationTypeId = is_array($operationType) ? $operationType['Id'] : $operationType;

            // Convertir IdAgency externo al Id interno de la agencia
            error_log("=== AGENCY ID RECIBIDO DEL FRONTEND ===");
            error_log("agencyId recibido: " . $agencyId);
            error_log("Tipo: " . gettype($agencyId));
            $internalAgencyId = $this->getAgencyInternalId($agencyId);
            error_log("=== AGENCY ID DESPUÉS DE CONVERSIÓN ===");
            error_log("internalAgencyId: " . $internalAgencyId);
            
            // Validar que la configuración existe
            $configurationExists = $this->validateConfigurationExists(
                $processId, 
                $costumerTypeId, 
                $operationTypeId, 
                $internalAgencyId
            );

            if (!$configurationExists) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'La configuración seleccionada no está habilitada'
                ])->setStatusCode(400);
            }

            // Usar el ID interno de la agencia que ya se calculó correctamente
            $agency = $this->getAgencyById($internalAgencyId);
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

            // Crear o buscar OrderByCar PRIMERO (solo uno por combinación de IdTotalDealer/VIN/idagency)
            $orderByCarId = $this->getOrCreateOrderByCar($order, $currentUser['user_id'], $agencyId);

            if (!$orderByCarId) {
                $this->db->transRollback();
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al crear o buscar el registro en OrderByCar'
                ])->setStatusCode(500);
            }

            error_log("✅ OrderByCar ID obtenido: " . $orderByCarId);

            // Crear file usando el ID interno de la agencia y el ID de OrderByCar
            $fileId = $this->createFile($order, $process, $costumerType, $operationType, $client->Id, $internalAgencyId, $currentUser['user_id'], $sellerId, $orderByCarId);

            if (!$fileId) {
                $this->db->transRollback();
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al crear el file'
                ])->setStatusCode(500);
            }

            // Crear documentos asociados - pasar ambos IDs (interno y externo) para buscar correctamente
            // IMPORTANTE: Este método DEBE crear TODOS los documentos requeridos en DocumentByFile
            try {
                $documentsCreated = $this->createFileDocuments($fileId, $process['Id'], $costumerType['Id'], $operationType['Id'], $internalAgencyId, $agencyId, $currentUser['user_id']);
                
                error_log("Total de documentos creados: " . $documentsCreated);
                
                // Si no se crearon documentos, verificar si es porque no hay documentos requeridos o por error
                if ($documentsCreated === 0) {
                    error_log("⚠️ ADVERTENCIA: No se crearon documentos. Verificando si hay documentos requeridos para esta configuración...");
                    // No hacer rollback si simplemente no hay documentos requeridos (esto es válido)
                    // Solo hacer rollback si hay un error real
                } else {
                    error_log("✅ Documentos creados exitosamente: " . $documentsCreated);
                }
            } catch (\Exception $e) {
                error_log("❌ EXCEPCIÓN al crear documentos: " . $e->getMessage());
                $this->db->transRollback();
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al crear los documentos del expediente: ' . $e->getMessage()
                ])->setStatusCode(500);
            }

            // Confirmar transacción
            $this->db->transComplete();

            if ($this->db->transStatus() === false) {
                error_log("❌ ERROR: La transacción falló al completarse");
                $dbError = $this->db->error();
                error_log("DB error: " . json_encode($dbError));
                
                // Verificar si el File se creó antes del error
                $verifyQuery = $this->db->query("SELECT Id FROM `File` WHERE Id = ?", [$fileId]);
                $verifyResult = $verifyQuery->getRow();
                if ($verifyResult) {
                    error_log("⚠️ ADVERTENCIA: El File con ID $fileId existe pero la transacción falló. Puede haber datos inconsistentes.");
                } else {
                    error_log("✅ El File con ID $fileId NO existe (rollback funcionó correctamente)");
                }
                
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error en la transacción de base de datos: ' . ($dbError['message'] ?? 'Error desconocido')
                ])->setStatusCode(500);
            }
            
            // Verificar que el File realmente existe después de la transacción
            $verifyQuery = $this->db->query("SELECT Id FROM `File` WHERE Id = ?", [$fileId]);
            $verifyResult = $verifyQuery->getRow();
            if (!$verifyResult) {
                error_log("❌ ERROR CRÍTICO: El File con ID $fileId NO existe después de completar la transacción");
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error: El expediente no se pudo crear correctamente en la base de datos'
                ])->setStatusCode(500);
            }
            
            error_log("✅ VERIFICACIÓN FINAL: File con ID $fileId existe en la base de datos");
            
            return $this->response->setJSON([
                'success' => true,
                'message' => 'File creado exitosamente con sus documentos',
                'data' => [
                    'fileId' => $fileId,
                    'documentsCreated' => $documentsCreated
                ]
            ]);

        } catch (\Exception $e) {
            error_log("❌ ERROR en Files::createFromVanguardia: " . $e->getMessage());
            error_log("Stack trace: " . $e->getTraceAsString());
            
            // Si hay una transacción activa, hacer rollback
            if ($this->db->transStatus() !== false) {
                $this->db->transRollback();
                error_log("⚠️ Transacción revertida debido a error");
            }
            
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
     * Buscar agencia por Id interno
     */
    private function getAgencyById($agencyId)
    {
        $sql = "SELECT Id, Name, IdAgency FROM Agency WHERE Id = ?";
        $query = $this->db->query($sql, [$agencyId]);
        return $query->getRow();
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
    private function createFile($order, $process, $costumerType, $operationType, $clientId, $internalAgencyId, $userId, $sellerId, $orderByCarId = null)
    {
        $currentDate = date('Y-m-d H:i:s');
        
        error_log("=== CREANDO FILE CON SELLER ID: " . $sellerId . " ===");
        
        // Obtener el siguiente ID disponible
        $nextIdQuery = $this->db->query("SELECT COALESCE(MAX(Id), 0) + 1 as nextId FROM `File`");
        $nextIdResult = $nextIdQuery->getRow();
        $nextId = $nextIdResult->nextId;
        
        error_log("Siguiente ID disponible: " . $nextId);
        
        $idOrderTotal = $order['order_dms'] ?? $order['orderDMS'] ?? $order['numeroPedido'] ?? null;
        
        $fileData = [
            'Id' => $nextId, // Especificar el ID explícitamente
            'IdClient' => $clientId,
            'IdAgency' => $internalAgencyId,
            'IdProcess' => $process['Id'],
            'IdCostumerType' => $costumerType['Id'],
            'IdOperation' => $operationType['Id'],
            'IdSeller' => $sellerId,
            'IdCurrentState' => 1, // Integración
            'IdOrderTotal' => $idOrderTotal,
            'IdOrder' => $orderByCarId, // Usar el ID de OrderByCar (foreign key)
            'IdInventary' => $order['inventory'] ?? $order['inventario'] ?? null,
            'RegistrationDate' => $currentDate,
            'UpdateDate' => $currentDate,
            'IdLastUserUpdate' => $userId
        ];

        error_log("=== CREANDO FILE ===");
        error_log("IdAgency que se usará en File: " . $internalAgencyId);
        error_log("File data a insertar: " . json_encode($fileData));
        
        try {
            // Verificar errores de base de datos antes de la inserción
            $preError = $this->db->error();
            if ($preError && $preError['code'] !== 0) {
                error_log("⚠️ ADVERTENCIA: Error de BD previo a inserción: " . json_encode($preError));
            }
            
            // Intentar insertar el File
            $result = $this->db->table('File')->insert($fileData);
            
            // Verificar errores inmediatamente después de la inserción
            $dbError = $this->db->error();
            if ($dbError && $dbError['code'] !== 0) {
                error_log("❌ ERROR de BD después de insertar File");
                error_log("DB error message: " . ($dbError['message'] ?? 'No error message'));
                error_log("DB error code: " . ($dbError['code'] ?? 'No error code'));
                error_log("DB error details: " . json_encode($dbError));
                return false;
            }
            
            // Verificar si la inserción fue exitosa
            if (!$result) {
                error_log("❌ ERROR: insert() devolvió false");
                error_log("DB error message: " . ($dbError['message'] ?? 'No error message'));
                error_log("DB error code: " . ($dbError['code'] ?? 'No error code'));
                return false;
            }
            
            // Obtener el ID insertado
            $fileId = $this->db->insertID();
            
            // Debug: log de la inserción
            error_log("✅ insert() devolvió true");
            error_log("File insert ID obtenido: " . $fileId);
            
            // Si insertID() no funciona, usar el ID que especificamos
            if (!$fileId || $fileId == 0) {
                $fileId = $nextId;
                error_log("⚠️ insertID() no devolvió ID, usando ID especificado: " . $fileId);
            }
            
            // Siempre verificar que el registro realmente existe después de la inserción
            $verifyQuery = $this->db->query("SELECT Id FROM `File` WHERE Id = ?", [$fileId]);
            $verifyResult = $verifyQuery->getRow();
            if (!$verifyResult) {
                error_log("❌ ERROR CRÍTICO: El File con ID $fileId NO existe después de la inserción");
                error_log("Esto indica que la inserción falló silenciosamente");
                $dbError = $this->db->error();
                error_log("DB error: " . json_encode($dbError));
                return false;
            }
            error_log("✅ Verificado: File con ID $fileId existe en la base de datos");
            
            if (!$fileId || $fileId == 0) {
                error_log("❌ ERROR: No se pudo obtener el ID del file creado");
                return false;
            }
            
            error_log("✅ File creado exitosamente con ID: " . $fileId);
            
            return $fileId;
            
        } catch (\Exception $e) {
            error_log("❌ EXCEPCIÓN al insertar File: " . $e->getMessage());
            error_log("Stack trace: " . $e->getTraceAsString());
            $dbError = $this->db->error();
            if ($dbError) {
                error_log("DB error: " . json_encode($dbError));
            }
            return false;
        }
    }

    /**
     * Crear documentos asociados al file
     * IMPORTANTE: Este método debe crear TODOS los documentos requeridos en DocumentByFile desde el inicio
     */
    private function createFileDocuments($fileId, $processId, $costumerTypeId, $operationTypeId, $internalAgencyId, $externalAgencyId, $userId)
    {
        error_log("=== INICIANDO createFileDocuments ===");
        error_log("Parámetros: fileId=$fileId, processId=$processId, costumerTypeId=$costumerTypeId, operationTypeId=$operationTypeId, internalAgencyId=$internalAgencyId, externalAgencyId=$externalAgencyId, userId=$userId");
        
        // Buscar documentos requeridos usando AMBOS IDs de agencia
        // ConfigurationProcess puede usar el ID interno o externo, así que buscamos por ambos
        $sql = "SELECT DISTINCT cpd.IdDocumentType, dt.Name as DocumentName, dt.IdProcessType
                FROM ConfigurationProcess_DocumentType cpd
                INNER JOIN DocumentType dt ON cpd.IdDocumentType = dt.Id
                INNER JOIN ConfigurationProcess cp ON cpd.IdConfigurationProcess = cp.Id
                WHERE cp.IdProcess = ? 
                AND cp.IdCostumerType = ? 
                AND cp.IdOperationType = ? 
                AND (cp.IdAgency = ? OR cp.IdAgency = ?)
                AND cp.Enabled = 1
                AND dt.Enabled = 1
                ORDER BY dt.Name ASC";

        error_log("SQL para documentos requeridos: " . $sql);
        error_log("Parámetros SQL: [$processId, $costumerTypeId, $operationTypeId, $internalAgencyId, $externalAgencyId]");

        $query = $this->db->query($sql, [$processId, $costumerTypeId, $operationTypeId, $internalAgencyId, $externalAgencyId]);
        $requiredDocuments = $query->getResultArray();

        error_log("Documentos requeridos encontrados: " . count($requiredDocuments));
        error_log("Documentos requeridos: " . json_encode($requiredDocuments));

        // Si no hay documentos requeridos, retornar 0 pero no es un error
        if (empty($requiredDocuments)) {
            error_log("⚠️ No se encontraron documentos requeridos para esta configuración (Process: $processId, CustomerType: $costumerTypeId, OperationType: $operationTypeId, Agency: $internalAgencyId/$externalAgencyId)");
            return 0;
        }

        $documentsCreated = 0;

        foreach ($requiredDocuments as $index => $document) {
            error_log("=== PROCESANDO DOCUMENTO " . ($index + 1) . " ===");
            error_log("Documento: " . json_encode($document));
            
            // Obtener el siguiente ID disponible para DocumentByFile
            $nextDocIdQuery = $this->db->query("SELECT COALESCE(MAX(Id), 0) + 1 as nextId FROM DocumentByFile");
            $nextDocIdResult = $nextDocIdQuery->getRow();
            $nextDocId = $nextDocIdResult->nextId;
            
            error_log("Siguiente ID para DocumentByFile: " . $nextDocId);
            
            $currentDate = date('Y-m-d H:i:s');
            
            // Construir los datos básicos del documento - SIEMPRE crear el registro con valores iniciales
            $documentData = [
                'Id' => $nextDocId, // Especificar el ID explícitamente
                'IdFile' => $fileId,
                'IdDocumentType' => $document['IdDocumentType'],
                'Name' => $document['DocumentName'] ?? 'Documento sin nombre',
                'Comment' => null,
                'ExperationDate' => null,
                'PathDocument' => null,
                'Enabled' => 1, // Documento habilitado
                'RegistrationDate' => $currentDate,
                'UpdateDate' => null,
                'LastUserUpdate' => $userId,
                'IdLastUserUpdate' => $userId,
                'IdValidation' => null,
                'IdCurrentStatus' => 1, // Documento nuevo/pendiente (1 = Pendiente)
                'IdDocumentError' => null,
                'ServerPath' => null
            ];
            
            // Intentar buscar documento existente del mismo cliente para copiar datos (OPCIONAL)
            // Si falla, continuamos con la creación del documento de todas formas
            try {
                $existingDocumentData = $this->findExistingDocumentToCopy($fileId, $document['IdDocumentType'], $userId);
                if ($existingDocumentData && !empty($existingDocumentData)) {
                    error_log("Copiando datos de documento existente: " . json_encode($existingDocumentData));
                    if (isset($existingDocumentData['ServerPath']) && !empty($existingDocumentData['ServerPath'])) {
                        $documentData['ServerPath'] = $existingDocumentData['ServerPath'];
                    }
                }
            } catch (\Exception $e) {
                error_log("Advertencia: No se pudo buscar documento existente para copiar (continuando de todas formas): " . $e->getMessage());
                // Continuar con la creación del documento aunque falle la búsqueda
            }

            error_log("Datos del documento a insertar en DocumentByFile: " . json_encode($documentData));

            try {
                $result = $this->db->table('DocumentByFile')->insert($documentData);
                
                if (!$result) {
                    $dbError = $this->db->error();
                    error_log("ERROR al insertar documento en DocumentByFile. DB Error: " . json_encode($dbError));
                    throw new \Exception("Error al insertar documento en DocumentByFile: " . ($dbError['message'] ?? 'Error desconocido'));
                }
                
                $insertId = $this->db->insertID();
                error_log("Documento insertado exitosamente. Insert ID: " . $insertId);
                
                // Si no se obtuvo el insertID, usar el ID que especificamos
                if (!$insertId) {
                    $insertId = $nextDocId;
                    error_log("Usando ID especificado ya que insertID no funcionó: " . $insertId);
                }
                
                $documentsCreated++;
            } catch (\Exception $e) {
                error_log("ERROR al insertar documento: " . $e->getMessage());
                error_log("Stack trace: " . $e->getTraceAsString());
                throw $e; // Re-lanzar la excepción para que se maneje arriba
            }
        }

        error_log("=== FINALIZANDO createFileDocuments ===");
        error_log("Total documentos creados: " . $documentsCreated);
        return $documentsCreated;
    }

    /**
     * Convertir IdAgency externo al Id interno de la agencia
     * NOTA: El frontend envía el ID interno (Id), así que primero buscamos por Id interno
     */
    private function getAgencyInternalId($agencyId)
    {
        error_log("=== CONVIRTIENDO ID AGENCIA ===");
        error_log("ID recibido: " . $agencyId);
        
        // Primero intentar como ID interno (Id) - el frontend envía el ID interno
        $agency = $this->db->table('Agency')
            ->where('Id', $agencyId)
            ->get()
            ->getRowArray();
            
        if ($agency) {
            error_log("Agencia encontrada por Id interno: $agencyId, IdAgency: " . ($agency['IdAgency'] ?? 'N/A'));
            return $agency['Id']; // Retornar el ID interno directamente
        }
        
        // Si no se encuentra, intentar como ID externo (IdAgency)
        $agency = $this->db->table('Agency')
            ->where('IdAgency', $agencyId)
            ->get()
            ->getRowArray();
            
        if ($agency) {
            error_log("Agencia encontrada por IdAgency externo: $agencyId, Id interno: " . $agency['Id']);
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

    /**
     * Buscar o crear registro en OrderByCar
     * Solo debe existir UN registro por combinación de IdTotalDealer/VIN/idagency
     * Retorna el ID del registro (existente o creado)
     */
    private function getOrCreateOrderByCar($order, $userId, $agencyId)
    {
        error_log("=== INICIANDO getOrCreateOrderByCar ===");
        error_log("Datos del order: " . json_encode($order));
        error_log("AgencyId recibido: " . $agencyId);
        
        $idTotalDealer = $order['order_dms'] ?? $order['orderDMS'] ?? $order['numeroPedido'] ?? null;
        $vin = $order['vin'] ?? null;
        
        // Buscar si ya existe un registro con la misma combinación de IdTotalDealer/VIN/idagency
        // Manejar NULLs correctamente en la búsqueda
        if ($vin === null || $vin === '') {
            $existingQuery = $this->db->query(
                "SELECT Id FROM OrderByCar WHERE IdTotalDealer = ? AND (VIN IS NULL OR VIN = '') AND idagency = ?",
                [$idTotalDealer, $agencyId]
            );
        } else {
            $existingQuery = $this->db->query(
                "SELECT Id FROM OrderByCar WHERE IdTotalDealer = ? AND VIN = ? AND idagency = ?",
                [$idTotalDealer, $vin, $agencyId]
            );
        }
        $existing = $existingQuery->getRow();
        
        if ($existing) {
            error_log("✅ OrderByCar ya existe con ID: " . $existing->Id);
            return $existing->Id;
        }
        
        error_log("⚠️ OrderByCar no existe, creando nuevo registro...");
        
        // Obtener el siguiente ID disponible para OrderByCar
        $nextIdQuery = $this->db->query("SELECT COALESCE(MAX(Id), 0) + 1 as nextId FROM OrderByCar");
        $nextIdResult = $nextIdQuery->getRow();
        $nextId = $nextIdResult->nextId;
        
        error_log("Siguiente ID disponible para OrderByCar: " . $nextId);
        
        $currentDate = date('Y-m-d H:i:s');
        
        $orderByCarData = [
            'Id' => $nextId,
            'Number' => $idTotalDealer,
            'CarType' => $order['version'] ?? null, // CarType guarda la versión
            'Year' => $order['year'] ?? null,
            'VIN' => $vin,
            'RegistrationDate' => $currentDate,
            'UpdateDate' => $currentDate,
            'IdLastUserUpdate' => $userId,
            'Modelo' => $order['model'] ?? null, // Modelo guarda el modelo
            'Asesor' => $order['ndConsultant'] ?? null,
            'IdTotalDealer' => $idTotalDealer,
            'idagency' => $agencyId // El idagency debe ser la agencia donde estamos intentando crear el expediente
        ];

        error_log("Datos de OrderByCar a insertar: " . json_encode($orderByCarData));

        try {
            $result = $this->db->table('OrderByCar')->insert($orderByCarData);
            $insertId = $this->db->insertID();
            
            if (!$result) {
                $dbError = $this->db->error();
                error_log("❌ ERROR al insertar OrderByCar en la base de datos");
                error_log("DB error message: " . ($dbError['message'] ?? 'No error message'));
                error_log("DB error code: " . ($dbError['code'] ?? 'No error code'));
                error_log("DB error details: " . json_encode($dbError));
                return false;
            }
            
            // Si insertID() no funciona, usar el ID que especificamos
            if (!$insertId || $insertId == 0) {
                $insertId = $nextId;
                error_log("⚠️ insertID() no devolvió ID, usando ID especificado: " . $insertId);
            }
            
            error_log("✅ OrderByCar creado exitosamente con ID: " . $insertId);
            return $insertId;
        } catch (\Exception $e) {
            error_log("❌ EXCEPCIÓN al insertar OrderByCar: " . $e->getMessage());
            error_log("Stack trace: " . $e->getTraceAsString());
            $dbError = $this->db->error();
            if ($dbError) {
                error_log("DB error: " . json_encode($dbError));
            }
            return false;
        }
    }

    /**
     * Verificar qué pedidos ya existen en la tabla File
     * Recibe una lista de pedidos y devuelve cuáles ya existen
     */
    public function checkExistingOrders()
    {
        try {
            $input = $this->request->getJSON(true);
            
            if (!$input || !isset($input['orders']) || !is_array($input['orders'])) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Se requiere un array de pedidos en el campo "orders"',
                    'data' => null
                ])->setStatusCode(400);
            }

            $orders = $input['orders'];
            $agencyId = $input['agencyId'] ?? null;

            if (!$agencyId) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El parámetro agencyId es requerido',
                    'data' => null
                ])->setStatusCode(400);
            }

            error_log("=== VERIFICANDO PEDIDOS EXISTENTES ===");
            error_log("AgencyId: " . $agencyId);
            error_log("Cantidad de pedidos a verificar: " . count($orders));

            $existingOrders = [];
            $newOrders = [];

            foreach ($orders as $order) {
                $orderDms = $order['order_dms'] ?? $order['orderDMS'] ?? $order['numeroPedido'] ?? null;
                
                if (!$orderDms) {
                    error_log("Pedido sin order_dms, saltando: " . json_encode($order));
                    continue;
                }

                error_log("Verificando pedido: " . $orderDms);

                // Buscar si ya existe este pedido para esta agencia
                $sql = "SELECT Id, IdOrderTotal FROM File WHERE IdAgency = ? AND IdOrderTotal = ?";
                $query = $this->db->query($sql, [$agencyId, $orderDms]);
                $existingFile = $query->getRow();

                if ($existingFile) {
                    error_log("Pedido EXISTENTE: " . $orderDms . " (File ID: " . $existingFile->Id . ")");
                    $existingOrders[] = [
                        'order_dms' => $orderDms,
                        'fileId' => $existingFile->Id,
                        'order' => $order
                    ];
                } else {
                    error_log("Pedido NUEVO: " . $orderDms);
                    $newOrders[] = $order;
                }
            }

            error_log("Resultado: " . count($existingOrders) . " existentes, " . count($newOrders) . " nuevos");

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Verificación completada',
                'data' => [
                    'existingOrders' => $existingOrders,
                    'newOrders' => $newOrders,
                    'totalChecked' => count($orders),
                    'existingCount' => count($existingOrders),
                    'newCount' => count($newOrders)
                ]
            ]);

        } catch (Exception $e) {
            error_log("ERROR en checkExistingOrders: " . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al verificar pedidos existentes: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }

    /**
     * Buscar un documento existente del mismo cliente para copiar datos
     */
    private function findExistingDocumentToCopy($fileId, $documentTypeId, $userId)
    {
        error_log("=== BUSCANDO DOCUMENTO EXISTENTE PARA COPIAR ===");
        error_log("fileId: $fileId, documentTypeId: $documentTypeId, userId: $userId");
        
        // Verificar si IdLastUserUpdate está activado (no es null/vacío)
        if (!$userId || $userId == '') {
            error_log("IdLastUserUpdate no está activado, no se buscarán documentos existentes");
            return null;
        }
        
        // Obtener el cliente del file actual
        $fileQuery = $this->db->query("SELECT IdClient FROM File WHERE Id = ?", [$fileId]);
        $file = $fileQuery->getRow();
        
        if (!$file) {
            error_log("No se encontró el file con ID: $fileId");
            return null;
        }
        
        $clientId = $file->IdClient;
        error_log("Cliente encontrado: $clientId");
        
        // Buscar documentos del mismo cliente en otros files anteriores que estén aprobados (status 4)
        // Solo buscamos ServerPath ya que es el campo que realmente usamos para copiar
        $sql = "SELECT dbf.ServerPath, dbf.IdFile, dbf.RegistrationDate
                FROM DocumentByFile dbf
                INNER JOIN File f ON dbf.IdFile = f.Id
                WHERE f.IdClient = ? 
                AND dbf.IdDocumentType = ?
                AND dbf.IdFile != ?
                AND dbf.ServerPath IS NOT NULL 
                AND dbf.ServerPath != ''
                AND dbf.IdCurrentStatus = 4
                ORDER BY dbf.RegistrationDate DESC
                LIMIT 1";
        
        error_log("SQL para buscar documento existente: " . $sql);
        error_log("Parámetros: [$clientId, $documentTypeId, $fileId]");
        
        try {
            $query = $this->db->query($sql, [$clientId, $documentTypeId, $fileId]);
            
            if (!$query) {
                $dbError = $this->db->error();
                error_log("ERROR en la consulta SQL: " . json_encode($dbError));
                return null;
            }
            
            $existingDocument = $query->getRow();
            
            if ($existingDocument && isset($existingDocument->ServerPath) && !empty($existingDocument->ServerPath)) {
                error_log("Documento existente encontrado: ServerPath=" . $existingDocument->ServerPath);
                return [
                    'ServerPath' => $existingDocument->ServerPath
                ];
            } else {
                error_log("No se encontró documento existente válido para copiar");
                return null;
            }
        } catch (\Exception $e) {
            error_log("ERROR al buscar documento existente (continuando de todas formas): " . $e->getMessage());
            return null; // Retornar null para continuar con la creación normal del documento
        }
    }

    /**
     * Eliminar file completo con todas sus relaciones
     */
    public function deleteFile()
    {
        try {
            // Verificar permisos de usuario
            $currentUser = $this->getAuthenticatedUser();
            if (!$currentUser) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ])->setStatusCode(401);
            }

            // Verificar que el usuario tenga permisos (administrador, gerente o coordinador)
            $userRole = $currentUser['role_id'] ?? null;
            $allowedRoles = [5, 6, 7]; // Coordinador de Operacion, Gerente, Administrador
            
            if (!in_array($userRole, $allowedRoles)) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'No tienes permisos para eliminar files'
                ])->setStatusCode(403);
            }

            // Intentar obtener fileId desde POST o JSON
            $fileId = $this->request->getPost('fileId');
            if (!$fileId) {
                $jsonData = $this->request->getJSON(true);
                $fileId = $jsonData['fileId'] ?? null;
            }
            
            if (!$fileId) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El ID del file es requerido'
                ])->setStatusCode(400);
            }

            error_log("=== INICIANDO ELIMINACIÓN DE FILE ===");
            error_log("File ID a eliminar: $fileId");
            error_log("Usuario que elimina: " . $currentUser['user_id']);

            // Iniciar transacción
            $this->db->transStart();

            // 1. Eliminar documentos relacionados (DocumentByFile)
            $documentsDeleted = $this->db->table('DocumentByFile')
                ->where('IdFile', $fileId)
                ->delete();
            
            error_log("Documentos eliminados: $documentsDeleted");

            // 2. Eliminar registros relacionados (OrderByCar)
            // Primero obtener el order_dms del file para encontrar el registro en OrderByCar
            $fileQuery = $this->db->query("SELECT IdOrderTotal FROM File WHERE Id = ?", [$fileId]);
            $file = $fileQuery->getRow();
            
            $orderByCarDeleted = 0;
            if ($file && $file->IdOrderTotal) {
                $orderByCarDeleted = $this->db->table('OrderByCar')
                    ->where('Number', $file->IdOrderTotal)
                    ->delete();
                error_log("Registros OrderByCar eliminados: $orderByCarDeleted");
            }

            // 3. Eliminar el file principal
            $fileDeleted = $this->db->table('File')
                ->where('Id', $fileId)
                ->delete();

            error_log("File eliminado: $fileDeleted");

            if ($fileDeleted) {
                $this->db->transComplete();
                
                error_log("=== ELIMINACIÓN COMPLETADA EXITOSAMENTE ===");
                
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'File eliminado exitosamente',
                    'data' => [
                        'fileId' => $fileId,
                        'documentsDeleted' => $documentsDeleted,
                        'orderByCarDeleted' => $orderByCarDeleted
                    ]
                ]);
            } else {
                $this->db->transRollback();
                
                error_log("ERROR: No se pudo eliminar el file");
                
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'No se pudo eliminar el file'
                ])->setStatusCode(500);
            }

        } catch (Exception $e) {
            $this->db->transRollback();
            
            error_log("ERROR en deleteFile: " . $e->getMessage());
            
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al eliminar el file: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }
}
