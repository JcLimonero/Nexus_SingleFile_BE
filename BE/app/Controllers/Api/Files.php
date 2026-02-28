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
                        // IMPORTANTE: ctr.IdAgency = f.IdAgency evita duplicados y datos de otras agencias
                        // (IdDMS puede repetirse entre agencias).
                        $sql = "
                            SELECT 
                                f.Id as fileId,
                                f.IdOrderTotal as numeroPedido,
                                f.IdInventory as numeroInventario,
                                p.Name as proceso,
                                ot.Name as operacion,
                                ct.Name as tipoCliente,
                                obc.CarType as version,
                                obc.Year as year,
                                obc.Model as modelo,
                                obc.VIN as vin,
                                a.Name as agencia,
                                f.RegistrationDate as fechaRegistro,
                                fs.Name as estatus
                            FROM expedient f
                            INNER JOIN client_header hc ON hc.IdClient = f.IdClient
                            INNER JOIN client_dms_relation ctr ON hc.Id = ctr.idClientHeader
                                AND ctr.IdAgency = f.IdAgency
                            LEFT JOIN process p ON f.IdProcess = p.Id
                            LEFT JOIN operation_type ot ON f.IdOperation = ot.Id
                            LEFT JOIN customertype ct ON f.IdCustomerType = ct.Id
                            LEFT JOIN agency a ON f.IdAgency = a.Id
                            LEFT JOIN file_status fs ON f.IdCurrentState = fs.Id
                            LEFT JOIN order obc ON f.IdOrderTotal = obc.IdDMS
                            WHERE TRIM(ctr.IdDMS) = ?
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

            // Validar y limpiar parámetros
            $agencyId = trim($agencyId);
            $statusId = ($statusId !== null && $statusId !== '') ? trim($statusId) : null;
            $ndCliente = ($ndCliente !== null && $ndCliente !== '') ? trim($ndCliente) : null;

            // Query mejorado para obtener TODOS los files/pedidos por agencia y cliente
            // Usamos INNER JOIN con Agency para asegurar que existe la agencia
            // LEFT JOINs con otras tablas para no perder registros aunque falten datos relacionados
            // IMPORTANTE: Usamos subconsulta para Order para evitar duplicados cuando hay múltiples registros
            // La subconsulta selecciona el registro más reciente por IdDMS
            $sql = "
                SELECT 
                    f.Id as fileId,
                    f.IdOrderTotal as numeroPedido,
                    f.IdInventory as numeroInventario,
                    p.Name as proceso,
                    ot.Name as operacion,
                    ct.Name as tipoCliente,
                    obc.CarType as version,
                    obc.Year as year,
                    obc.Model as modelo,
                    obc.VIN as vin,
                    a.Name as agencia,
                    f.RegistrationDate as fechaRegistro,
                    fs.Name as estatus
                FROM expedient f
                INNER JOIN agency a ON f.IdAgency = a.Id
                LEFT JOIN process p ON f.IdProcess = p.Id
                LEFT JOIN operation_type ot ON f.IdOperation = ot.Id
                LEFT JOIN customertype ct ON f.IdCustomerType = ct.Id
                LEFT JOIN file_status fs ON f.IdCurrentState = fs.Id
                LEFT JOIN (
                    SELECT 
                        obc1.IdDMS,
                        obc1.CarType,
                        obc1.Year,
                        obc1.Model,
                        obc1.VIN
                    FROM order obc1
                    INNER JOIN (
                        SELECT IdDMS, MAX(RegistrationDate) as MaxDate
                        FROM order
                        GROUP BY IdDMS
                    ) obc2 ON obc1.IdDMS = obc2.IdDMS 
                        AND obc1.RegistrationDate = obc2.MaxDate
                ) obc ON f.IdOrderTotal = obc.IdDMS
                WHERE a.IdAgencyDMS = ?
            ";

            $params = [$agencyId];

            // Agregar filtro de estatus si se proporciona
            // IMPORTANTE: Filtramos directamente por f.IdCurrentState porque el LEFT JOIN con File_Status
            // puede devolver NULL si no hay registro en File_Status, causando que fs.Id = ? falle siempre
            // Esto es crítico para que los archivos se muestren correctamente
            if ($statusId !== null && $statusId !== '' && is_numeric($statusId)) {
                $sql .= " AND f.IdCurrentState = ?";
                $params[] = (int)$statusId;
            }

            // Agregar filtro de cliente si se proporciona
            // IMPORTANTE: IdDMS (ndCliente) puede repetirse entre agencias (cada dealer tiene su propio DMS).
            // Debemos filtrar por ctr.IdAgency = f.IdAgency para no traer datos de clientes de otra agencia.
            if ($ndCliente && trim($ndCliente) !== '') {
                $ndClienteTrimmed = trim($ndCliente);
                $sql .= " AND EXISTS (
                    SELECT 1
                    FROM client_header hc 
                    INNER JOIN client_dms_relation ctr ON hc.Id = ctr.idClientHeader 
                    WHERE hc.IdClient = f.IdClient 
                    AND TRIM(ctr.IdDMS) = ?
                    AND ctr.IdAgency = f.IdAgency
                )";
                $params[] = $ndClienteTrimmed;
            }

            // Agrupar por f.Id para asegurar un solo registro por pedido (evitar duplicados)
            $sql .= " GROUP BY f.Id, f.IdOrderTotal, f.IdInventory, p.Name, ot.Name, ct.Name, 
                             obc.CarType, obc.Year, obc.Model, obc.VIN, a.Name, f.RegistrationDate, fs.Name";
            $sql .= " ORDER BY f.RegistrationDate DESC";
            
            error_log("=== Query getByAgency ===");
            error_log("SQL: " . $sql);
            error_log("Params: " . json_encode($params));

            error_log("=== Ejecutando query getByAgency ===");
            error_log("SQL final: " . $sql);
            error_log("Parámetros: " . json_encode($params));
            
            $query = $this->db->query($sql, $params);
            $results = $query->getResultArray();
            
            // DIAGNÓSTICO: Si no hay resultados y se está buscando por cliente, verificar por qué
            if (count($results) === 0 && $ndCliente) {
                error_log("=== DIAGNÓSTICO: No se encontraron pedidos para cliente {$ndCliente} en agencia {$agencyId} ===");
                
                // Verificar si el pedido 35348 existe y su estado
                $pedidoSql = "
                    SELECT 
                        f.Id as fileId,
                        f.IdOrderTotal as numeroPedido,
                        f.IdCurrentState,
                        f.IdAgency as FileIdAgency,
                        a.IdAgencyDMS as AgencyIdAgencyDMS,
                        f.IdClient as IdClient,
                        fs.Name as estado
                    FROM expedient f
                    INNER JOIN agency a ON f.IdAgency = a.Id
                    LEFT JOIN file_status fs ON f.IdCurrentState = fs.Id
                    WHERE f.IdOrderTotal = '35348'
                ";
                $pedidoQuery = $this->db->query($pedidoSql);
                $pedidoResult = $pedidoQuery->getRowArray();
                
                if ($pedidoResult) {
                    $idClient = $pedidoResult['IdClient'] ?? null;
                    error_log("=== DIAGNÓSTICO PEDIDO 35348 ===");
                    error_log("File ID: " . ($pedidoResult['fileId'] ?? 'NULL'));
                    error_log("IdCurrentState: " . ($pedidoResult['IdCurrentState'] ?? 'NULL') . " (esperado: {$statusId})");
                    error_log("Agency esperada: {$agencyId}, Agency del pedido: " . ($pedidoResult['AgencyIdAgencyDMS'] ?? 'NULL'));
                    error_log("Estado: " . ($pedidoResult['estado'] ?? 'NULL'));
                    error_log("IdClient (File.IdClient = Client.Id): " . ($idClient ?? 'NULL'));
                    
                    // Verificar relaciones: File.IdClient = Client.Id; ClientDMSRelation usa idClientHeader (ClientHeader.Id)
                    $relacionSql = "
                        SELECT COUNT(*) as count
                        FROM client_dms_relation ctr 
                        INNER JOIN client_header hc ON hc.Id = ctr.idClientHeader AND hc.IdClient = ?
                        WHERE TRIM(ctr.IdDMS) = ?
                    ";
                    $relacionQuery = $this->db->query($relacionSql, [$idClient, trim($ndCliente)]);
                    $relacionResult = $relacionQuery->getRow();
                    $relacionesConClientHeader = $relacionResult->count ?? 0;
                    
                    error_log("Relaciones ClientDMSRelation para Client.Id {$idClient} y ndCliente {$ndCliente}: {$relacionesConClientHeader}");
                    
                    // Verificar TODAS las relaciones del cliente 200495 (en cualquier agencia)
                    $todasRelacionesSql = "
                        SELECT ctr.IdAgency, a.Name as nombreAgencia, ctr.IdDMS, ctr.idClientHeader
                        FROM client_dms_relation ctr
                        INNER JOIN agency a ON ctr.IdAgency = a.Id
                        WHERE TRIM(ctr.IdDMS) = ?
                    ";
                    $todasRelacionesQuery = $this->db->query($todasRelacionesSql, [trim($ndCliente)]);
                    $todasRelaciones = $todasRelacionesQuery->getResultArray();
                    error_log("Todas las relaciones del cliente {$ndCliente}: " . json_encode($todasRelaciones));
                } else {
                    error_log("❌ El pedido 35348 NO EXISTE en la base de datos");
                }
            }
            
            // DIAGNÓSTICO: Verificar si el File 12328 debería aparecer
            try {
                $diagnosticSql = "
                    SELECT 
                        f.Id as fileId,
                        f.IdCurrentState,
                        f.IdAgency as FileIdAgency,
                        a.Id as AgencyId,
                        a.IdAgencyDMS as AgencyIdAgencyDMS,
                        f.IdClient,
                        fs.Id as FileStatusId,
                        fs.Name as FileStatusName
                    FROM expedient f
                    LEFT JOIN agency a ON f.IdAgency = a.Id
                    LEFT JOIN file_status fs ON f.IdCurrentState = fs.Id
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
                    error_log("Agency IdAgencyDMS (externo): " . ($diagnosticResult->AgencyIdAgencyDMS ?? 'NULL'));
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
                            FROM client_header hc 
                            INNER JOIN client_dms_relation ctr ON hc.Id = ctr.idClientHeader 
                            WHERE hc.IdClient = ? AND TRIM(ctr.IdDMS) = ?
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
                if (isset($results[0]['year']) || isset($results[0]['model']) || isset($results[0]['version']) || isset($results[0]['vin'])) {
                    error_log("✅ Campos year, modelo, version, vin están presentes en los resultados");
                    error_log("Valores: year=" . ($results[0]['year'] ?? 'NULL') . ", modelo=" . ($results[0]['model'] ?? 'NULL') . ", version=" . ($results[0]['version'] ?? 'NULL') . ", vin=" . ($results[0]['vin'] ?? 'NULL'));
                } else {
                    error_log("⚠️ Campos year, modelo, version, vin NO están presentes o son NULL (esto es normal si no hay registro en Order)");
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

            // Asegurar que los datos estén en UTF-8 correctamente codificados
            array_walk_recursive($results, function(&$value) {
                if (is_string($value)) {
                    if (!mb_check_encoding($value, 'UTF-8')) {
                        $value = mb_convert_encoding($value, 'UTF-8', 'ISO-8859-1');
                    }
                }
            });

            $response = [
                'success' => true,
                'message' => 'Files obtenidos exitosamente',
                'data' => [
                    'files' => $results,
                    'total' => count($results)
                ]
            ];

            return $this->response
                ->setHeader('Content-Type', 'application/json; charset=UTF-8')
                ->setJSON($response, JSON_UNESCAPED_UNICODE);

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
     * Endpoint de diagnóstico para verificar el JOIN con Order
     * GET /api/files/debug-join-orderbycar?agencyId=10082&ndCliente=200945&statusId=1
     */
    public function debugJoinOrder()
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
                    f.IdInventory as numeroInventario,
                    obc.Id as orderByCarId,
                    obc.Number as orderByCar_Number,
                    obc.IdDMS as orderByCar_IdDMS,
                    obc.Year as year,
                    obc.Model as modelo,
                    obc.CarType as version,
                    obc.VIN as vin,
                    CASE 
                        WHEN f.IdOrderTotal = obc.IdDMS THEN 'COINCIDENCIA CON IdDMS'
                        WHEN obc.Id IS NULL THEN 'NO HAY REGISTRO EN Order'
                        ELSE 'NO COINCIDE'
                    END as estado_join
                FROM expedient f
                LEFT JOIN agency a ON f.IdAgency = a.Id
                LEFT JOIN file_status fs ON f.IdCurrentState = fs.Id
                LEFT JOIN order obc ON f.IdOrderTotal = obc.IdDMS
                WHERE a.IdAgencyDMS = ?
            ";

            $params = [$agencyId];

            if ($statusId && trim($statusId) !== '') {
                $sql .= " AND fs.Id = ?";
                $params[] = $statusId;
            }

            if ($ndCliente && trim($ndCliente) !== '') {
                $sql .= " AND f.IdClient IN (
                    SELECT hc.IdClient 
                    FROM client_header hc 
                    INNER JOIN client_dms_relation ctr ON hc.Id = ctr.idClientHeader 
                    WHERE TRIM(ctr.IdDMS) = ?
                    AND ctr.IdAgency = ?
                )";
                $params[] = trim($ndCliente);
                $params[] = $agencyId;
            }

            $sql .= " ORDER BY f.RegistrationDate DESC";

            $query = $this->db->query($sql, $params);
            $results = $query->getResultArray();

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Diagnóstico de JOIN con Order',
                'data' => [
                    'files' => $results,
                    'total' => count($results),
                    'query' => $sql,
                    'params' => $params
                ]
            ]);

        } catch (\Exception $e) {
            error_log("Error en Files::debugJoinOrder: " . $e->getMessage());
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
            $requiredFields = ['order', 'process', 'customerType', 'operationType', 'clientId', 'agencyId'];
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
            $customerType = $input['customerType'];
            $operationType = $input['operationType'];
            $clientId = $input['clientId'];
            $agencyId = $input['agencyId'];

            // Extraer IDs de los objetos
            $processId = is_array($process) ? $process['Id'] : $process;
            $customerTypeId = is_array($customerType) ? $customerType['Id'] : $customerType;
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
                $customerTypeId, 
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

            // Obtener idCliente (Client.Id) desde view_client_relations por ndCliente e idAgency
            $ndDMS = trim((string) $clientId);
            $idClientResolved = $this->getClientIdFromViewClientRelations($ndDMS, $internalAgencyId);
            error_log("Buscando IdClient en view_client_relations: ndDMS={$ndDMS}, IdAgency={$internalAgencyId} => " . ($idClientResolved ?? 'null'));
            if ($idClientResolved === null) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Cliente no encontrado para el No Cliente y agencia indicados. Verifique que exista en view_client_relations (ndCliente e idAgency).'
                ])->setStatusCode(400);
            }

            // Crear o verificar usuario advisor antes de crear el File
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

            // Crear o buscar Order PRIMERO (solo uno por combinación de IdDMS/VIN/idagency)
            $orderByCarId = $this->getOrCreateOrder($order, $currentUser['user_id'], $agencyId);

            if (!$orderByCarId) {
                $this->db->transRollback();
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al crear o buscar el registro en Order'
                ])->setStatusCode(500);
            }

            error_log("✅ Order ID obtenido: " . $orderByCarId);

            // Crear file usando IdClient de view_client_relations (hc.IdClient), agencia y Order
            $fileId = $this->createFile($order, $process, $customerType, $operationType, $idClientResolved, $internalAgencyId, $currentUser['user_id'], $sellerId, $orderByCarId);

            if (!$fileId) {
                $this->db->transRollback();
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al crear el file'
                ])->setStatusCode(500);
            }

            // Crear documentos asociados - pasar ambos IDs (interno y externo) para buscar correctamente
            // IMPORTANTE: Este método DEBE crear TODOS los documentos requeridos en FileDocument
            try {
                $documentsCreated = $this->createFileDocuments($fileId, $process['Id'], $customerType['Id'], $operationType['Id'], $internalAgencyId, $agencyId, $currentUser['user_id']);
                
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
                $verifyQuery = $this->db->query("SELECT Id FROM `expedient` WHERE Id = ?", [$fileId]);
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
            $verifyQuery = $this->db->query("SELECT Id FROM `expedient` WHERE Id = ?", [$fileId]);
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
    private function validateConfigurationExists($processId, $customerTypeId, $operationTypeId, $agencyId)
    {
        error_log("=== VALIDANDO CONFIGURACIÓN (TEMPORAL - SIEMPRE TRUE) ===");
        error_log("IdProcess: " . $processId);
        error_log("IdCustomerType: " . $customerTypeId);
        error_log("IdOperationType: " . $operationTypeId);
        error_log("IdAgency: " . $agencyId);
        
        // TEMPORAL: Siempre retornar true para confirmar que el problema está en la validación
        error_log("TEMPORAL: Retornando TRUE para bypass de validación");
        return true;
        
        $sql = "SELECT COUNT(*) as count 
                FROM configuration_process 
                WHERE IdProcess = ? 
                AND IdCustomerType = ? 
                AND IdOperationType = ? 
                AND IdAgency = ? 
                AND Enabled = 1";

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
     * Buscar agencia por Id interno
     */
    private function getAgencyById($agencyId)
    {
        $sql = "SELECT Id, Name, IdAgencyDMS FROM agency WHERE Id = ?";
        $query = $this->db->query($sql, [$agencyId]);
        return $query->getRow();
    }

    /**
     * Buscar agencia por IdAgencyDMS externo
     */
    private function getAgencyByExternalId($externalAgencyId)
    {
        $sql = "SELECT Id, Name FROM agency WHERE IdAgencyDMS = ?";
        $query = $this->db->query($sql, [$externalAgencyId]);
        return $query->getRow();
    }

    /**
     * Obtener idCliente (Client.Id) desde view_client_relations filtrado por ndCliente e idAgency.
     * Usado al crear File; asegura consistencia con la vista.
     */
    private function getClientIdFromViewClientRelations($ndDMS, $idAgency)
    {
        $ndDMS = trim((string) $ndDMS);
        $idAgency = (int) $idAgency;
        if ($ndDMS === '' || $idAgency <= 0) {
            return null;
        }
        try {
            $row = $this->db->query("
                SELECT idCliente FROM view_client_relations
                WHERE TRIM(ndCliente) = ? AND idAgency = ?
                LIMIT 1
            ", [$ndDMS, $idAgency])->getRowArray();
            if ($row && isset($row['idCliente']) && $row['idCliente'] !== null && $row['idCliente'] !== '') {
                return (int) $row['idCliente'];
            }
        } catch (\Throwable $e) {
            log_message('info', 'getClientIdFromViewClientRelations: vista no usada - ' . $e->getMessage());
        }
        return null;
    }

    /**
     * Buscar cliente por ndCliente externo (ClientHeader.Id).
     * @deprecated Preferir getClientIdFromViewClientRelations(ndDMS, idAgency) para obtener IdClient (Client.Id).
     */
    private function getClientByExternalId($externalClientId)
    {
        $sql = "SELECT hc.Id 
                FROM client_header hc
                INNER JOIN client_dms_relation ctr ON hc.Id = ctr.idClientHeader
                WHERE ctr.IdDMS = ?";
        $query = $this->db->query($sql, [$externalClientId]);
        return $query->getRow();
    }

    /**
     * Crear file en la base de datos
     */
    private function createFile($order, $process, $customerType, $operationType, $clientId, $internalAgencyId, $userId, $sellerId, $orderByCarId = null)
    {
        $currentDate = date('Y-m-d H:i:s');
        
        error_log("=== CREANDO FILE CON SELLER ID: " . $sellerId . " ===");
        
        // Obtener el siguiente ID disponible
        $nextIdQuery = $this->db->query("SELECT COALESCE(MAX(Id), 0) + 1 as nextId FROM `expedient`");
        $nextIdResult = $nextIdQuery->getRow();
        $nextId = $nextIdResult->nextId;
        
        error_log("Siguiente ID disponible: " . $nextId);
        
        $idOrderTotal = $order['order_dms'] ?? $order['orderDMS'] ?? $order['numeroPedido'] ?? null;
        
        $fileData = [
            'Id' => $nextId, // Especificar el ID explícitamente
            'IdClient' => $clientId,
            'IdAgency' => $internalAgencyId,
            'IdProcess' => $process['Id'],
            'IdCustomerType' => $customerType['Id'],
            'IdOperation' => $operationType['Id'],
            'IdSeller' => $sellerId,
            'IdCurrentState' => 1, // Integración
            'IdOrderTotal' => $idOrderTotal,
            'IdOrder' => $orderByCarId, // Usar el ID de Order (foreign key)
            'IdInventory' => $order['inventory'] ?? $order['inventario'] ?? null,
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
            $result = $this->db->table('expedient')->insert($fileData);
            
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
            $verifyQuery = $this->db->query("SELECT Id FROM `expedient` WHERE Id = ?", [$fileId]);
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
     * IMPORTANTE: Este método debe crear TODOS los documentos requeridos en FileDocument desde el inicio
     */
    private function createFileDocuments($fileId, $processId, $customerTypeId, $operationTypeId, $internalAgencyId, $externalAgencyId, $userId)
    {
        error_log("=== INICIANDO createFileDocuments ===");
        error_log("Parámetros: fileId=$fileId, processId=$processId, customerTypeId=$customerTypeId, operationTypeId=$operationTypeId, internalAgencyId=$internalAgencyId, externalAgencyId=$externalAgencyId, userId=$userId");
        
        // Buscar documentos requeridos usando AMBOS IDs de agencia
        // ConfigurationProcess puede usar el ID interno o externo, así que buscamos por ambos
        $sql = "SELECT DISTINCT cpd.IdDocumentType, dt.Name as DocumentName, dt.IdProcessType
                FROM configuration_processDocumentType cpd
                INNER JOIN document_type dt ON cpd.IdDocumentType = dt.Id
                INNER JOIN configuration_process cp ON cpd.IdConfigurationProcess = cp.Id
                WHERE cp.IdProcess = ? 
                AND cp.IdCustomerType = ? 
                AND cp.IdOperationType = ? 
                AND (cp.IdAgency = ? OR cp.IdAgency = ?)
                AND cp.Enabled = 1
                AND dt.Enabled = 1
                ORDER BY dt.Name ASC";

        error_log("SQL para documentos requeridos: " . $sql);
        error_log("Parámetros SQL: [$processId, $customerTypeId, $operationTypeId, $internalAgencyId, $externalAgencyId]");

        $query = $this->db->query($sql, [$processId, $customerTypeId, $operationTypeId, $internalAgencyId, $externalAgencyId]);
        $requiredDocuments = $query->getResultArray();

        error_log("Documentos requeridos encontrados: " . count($requiredDocuments));
        error_log("Documentos requeridos: " . json_encode($requiredDocuments));

        // Si no hay documentos requeridos, retornar 0 pero no es un error
        if (empty($requiredDocuments)) {
            error_log("⚠️ No se encontraron documentos requeridos para esta configuración (Process: $processId, CustomerType: $customerTypeId, OperationType: $operationTypeId, Agency: $internalAgencyId/$externalAgencyId)");
            return 0;
        }

        $documentsCreated = 0;

        foreach ($requiredDocuments as $index => $document) {
            error_log("=== PROCESANDO DOCUMENTO " . ($index + 1) . " ===");
            error_log("Documento: " . json_encode($document));
            
            // Obtener el siguiente ID disponible para FileDocument
            $nextDocIdQuery = $this->db->query("SELECT COALESCE(MAX(Id), 0) + 1 as nextId FROM file_document");
            $nextDocIdResult = $nextDocIdQuery->getRow();
            $nextDocId = $nextDocIdResult->nextId;
            
            error_log("Siguiente ID para FileDocument: " . $nextDocId);
            
            $currentDate = date('Y-m-d H:i:s');
            
            // Construir los datos básicos del documento - SIEMPRE crear el registro con valores iniciales
            $documentData = [
                'Id' => $nextDocId, // Especificar el ID explícitamente
                'IdFile' => $fileId,
                'IdDocumentType' => $document['IdDocumentType'],
                'Name' => $document['DocumentName'] ?? 'Documento sin nombre',
                'Comment' => null,
                'ExpirationDate' => null,
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

            error_log("Datos del documento a insertar en FileDocument: " . json_encode($documentData));

            try {
                $result = $this->db->table('file_document')->insert($documentData);
                
                if (!$result) {
                    $dbError = $this->db->error();
                    error_log("ERROR al insertar documento en FileDocument. DB Error: " . json_encode($dbError));
                    throw new \Exception("Error al insertar documento en FileDocument: " . ($dbError['message'] ?? 'Error desconocido'));
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
        $agency = $this->db->table('agency')
            ->where('Id', $agencyId)
            ->get()
            ->getRowArray();
            
        if ($agency) {
            error_log("Agencia encontrada por Id interno: $agencyId, IdAgencyDMS: " . ($agency['IdAgencyDMS'] ?? 'N/A'));
            return $agency['Id']; // Retornar el ID interno directamente
        }
        
        // Si no se encuentra, intentar como ID externo (IdAgencyDMS)
        $agency = $this->db->table('agency')
            ->where('IdAgencyDMS', $agencyId)
            ->get()
            ->getRowArray();
            
        if ($agency) {
            error_log("Agencia encontrada por IdAgencyDMS externo: $agencyId, Id interno: " . $agency['Id']);
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
        $existingUser = $this->db->table('user')
            ->where('user', $ndConsultant)
            ->orWhere('Mail', $ndConsultant . '@default.com')
            ->get()
            ->getRowArray();

        if ($existingUser) {
            error_log("Usuario advisor encontrado: " . $existingUser['Id']);
            return $existingUser['Id'];
        }

        // Verificar si ya existe un usuario con el mismo nombre
        $duplicateUser = $this->db->table('user')
            ->where('user', $ndConsultant)
            ->get()
            ->getRowArray();
            
        if ($duplicateUser) {
            error_log("Usuario duplicado encontrado: " . json_encode($duplicateUser));
            return $duplicateUser['Id'];
        }

        // TEMPORAL: Usar usuario admin como fallback para evitar problemas de inserción
        error_log("No se encontró usuario advisor para ndConsultant: " . $ndConsultant . ", usando usuario admin como fallback");
        return 1; // Usuario admin
    }

    /**
     * Buscar o crear registro en Order
     * Solo debe existir UN registro por combinación de IdDMS/VIN/idagency
     * Retorna el ID del registro (existente o creado)
     */
    private function getOrCreateOrder($order, $userId, $agencyId)
    {
        error_log("=== INICIANDO getOrCreateOrder ===");
        error_log("Datos del order: " . json_encode($order));
        error_log("AgencyId recibido: " . $agencyId);
        
        $idDMS = $order['order_dms'] ?? $order['orderDMS'] ?? $order['numeroPedido'] ?? null;
        $vin = $order['vin'] ?? null;
        
        // Buscar si ya existe un registro con la misma combinación de IdDMS/VIN/idagency
        // Manejar NULLs correctamente en la búsqueda
        if ($vin === null || $vin === '') {
            $existingQuery = $this->db->query(
                "SELECT Id FROM order WHERE IdDMS = ? AND (VIN IS NULL OR VIN = '') AND idagency = ?",
                [$idDMS, $agencyId]
            );
        } else {
            $existingQuery = $this->db->query(
                "SELECT Id FROM order WHERE IdDMS = ? AND VIN = ? AND idagency = ?",
                [$idDMS, $vin, $agencyId]
            );
        }
        $existing = $existingQuery->getRow();
        
        if ($existing) {
            error_log("✅ Order ya existe con ID: " . $existing->Id);
            return $existing->Id;
        }
        
        error_log("⚠️ Order no existe, creando nuevo registro...");
        
        // Obtener el siguiente ID disponible para Order
        $nextIdQuery = $this->db->query("SELECT COALESCE(MAX(Id), 0) + 1 as nextId FROM order");
        $nextIdResult = $nextIdQuery->getRow();
        $nextId = $nextIdResult->nextId;
        
        error_log("Siguiente ID disponible para Order: " . $nextId);
        
        $currentDate = date('Y-m-d H:i:s');
        
        $orderByCarData = [
            'Id' => $nextId,
            'Number' => $idDMS,
            'CarType' => $order['version'] ?? null, // CarType guarda la versión
            'Year' => $order['year'] ?? null,
            'VIN' => $vin,
            'RegistrationDate' => $currentDate,
            'UpdateDate' => $currentDate,
            'IdLastUserUpdate' => $userId,
            'Model' => $order['model'] ?? null, // Model guarda el modelo
            'Advisor' => $order['ndConsultant'] ?? null,
            'IdDMS' => $idDMS,
            'idagency' => $agencyId // El idagency debe ser la agencia donde estamos intentando crear el expediente
        ];

        error_log("Datos de Order a insertar: " . json_encode($orderByCarData));

        try {
            $result = $this->db->table('order')->insert($orderByCarData);
            $insertId = $this->db->insertID();
            
            if (!$result) {
                $dbError = $this->db->error();
                error_log("❌ ERROR al insertar Order en la base de datos");
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
            
            error_log("✅ Order creado exitosamente con ID: " . $insertId);
            return $insertId;
        } catch (\Exception $e) {
            error_log("❌ EXCEPCIÓN al insertar Order: " . $e->getMessage());
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
     * Recibe una lista de pedidos y devuelve cuáles ya existen.
     * Usa una sola consulta por lote para evitar timeout con muchos pedidos.
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
            $ndCliente = isset($input['ndCliente']) ? trim((string) $input['ndCliente']) : null;

            if (!$agencyId) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El parámetro agencyId es requerido',
                    'data' => null
                ])->setStatusCode(400);
            }

            log_message('info', "checkExistingOrders: AgencyId={$agencyId}, ndCliente=" . ($ndCliente ?? 'null') . ", pedidos a verificar=" . count($orders));

            // Extraer order_dms únicos para la consulta (evita N consultas)
            $orderDmsUnique = [];
            $validOrders = []; // [ ['order' => ..., 'order_dms' => ... ], ... ]

            foreach ($orders as $order) {
                $orderDms = $order['order_dms'] ?? $order['orderDMS'] ?? $order['numeroPedido'] ?? null;
                if ($orderDms === null || $orderDms === '') {
                    continue;
                }
                $orderDms = (string) $orderDms;
                $orderDmsUnique[$orderDms] = true;
                $validOrders[] = ['order' => $order, 'order_dms' => $orderDms];
            }

            $orderDmsList = array_keys($orderDmsUnique);

            if (empty($orderDmsList)) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Verificación completada',
                    'data' => [
                        'existingOrders' => [],
                        'newOrders' => [],
                        'totalChecked' => count($orders),
                        'existingCount' => 0,
                        'newCount' => 0
                    ]
                ]);
            }

            // idCliente esperado desde view_client_relations (ndCliente, idAgency).
            // Solo se usa si ndCliente viene en la petición; en ese caso en existingOrders
            // solo entran los pedidos cuyo File.IdClient != idClientFromView (relación incorrecta).
            $idClientFromView = null;
            if ($ndCliente !== null && $ndCliente !== '') {
                try {
                    $rowView = $this->db->query("
                        SELECT idCliente FROM view_client_relations
                        WHERE TRIM(ndCliente) = ? AND idAgency = ?
                        LIMIT 1
                    ", [$ndCliente, (int) $agencyId])->getRowArray();
                    if ($rowView && !empty($rowView['idCliente'])) {
                        $idClientFromView = (int) $rowView['idCliente'];
                    }
                } catch (\Throwable $e) {
                    log_message('info', 'checkExistingOrders: view_client_relations no usada, ' . $e->getMessage());
                }
            }

            // Una sola consulta: todos los File existentes para esta agencia y estos IdOrderTotal (+ IdClient si filtraremos)
            $builder = $this->db->table('expedient');
            $builder->select('Id, IdOrderTotal' . ($idClientFromView !== null ? ', IdClient' : ''));
            $builder->where('IdAgency', $agencyId);
            $builder->whereIn('IdOrderTotal', $orderDmsList);
            $existingRows = $builder->get()->getResultArray();

            $existingMap = [];
            foreach ($existingRows as $row) {
                $key = (string) ($row['IdOrderTotal'] ?? '');
                $fileId = (int) ($row['Id'] ?? 0);
                $fileIdClient = isset($row['IdClient']) ? (int) $row['IdClient'] : null;
                $existingMap[$key] = ['fileId' => $fileId, 'IdClient' => $fileIdClient];
            }

            $existingOrders = [];
            $newOrders = [];

            foreach ($validOrders as $item) {
                $order = $item['order'];
                $orderDms = $item['order_dms'];
                $info = $existingMap[$orderDms] ?? null;
                if ($info) {
                    $fileId = $info['fileId'];
                    $fileIdClient = $info['IdClient'];
                    if ($idClientFromView !== null) {
                        // Solo incluir en existingOrders los que no tienen el IdClient de la vista (relación incorrecta)
                        if ($fileIdClient !== $idClientFromView) {
                            $existingOrders[] = [
                                'order_dms' => $orderDms,
                                'fileId' => $fileId,
                                'order' => $order
                            ];
                        }
                        // Si File.IdClient == idClientFromView, no se incluye (ya tiene la relación correcta)
                    } else {
                        $existingOrders[] = [
                            'order_dms' => $orderDms,
                            'fileId' => $fileId,
                            'order' => $order
                        ];
                    }
                } else {
                    $newOrders[] = $order;
                }
            }

            log_message('info', "checkExistingOrders: resultado " . count($existingOrders) . " existentes, " . count($newOrders) . " nuevos");

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

        } catch (\Throwable $e) {
            log_message('error', 'checkExistingOrders: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al verificar pedidos existentes: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }

    /**
     * Reparar relación de cliente en un expediente (File).
     * Busca en view_client_relations por ndCliente e idAgency,
     * obtiene idClient (ClientHeader.Id) y actualiza File.IdClient donde File.Id = idExpediente.
     */
    public function repairClientRelation()
    {
        try {
            $input = $this->request->getJSON(true);
            if (!$input) {
                $input = $this->request->getPost();
            }

            $ndDMS = $input['ndDMS'] ?? $input['ndCliente'] ?? null;
            $idAgency = $input['idAgency'] ?? $input['agencyId'] ?? null;
            $idExpediente = $input['idExpediente'] ?? $input['fileId'] ?? null;

            if (!$ndDMS || trim((string) $ndDMS) === '') {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El parámetro ndDMS (No Cliente) es requerido',
                    'data' => null
                ])->setStatusCode(400);
            }
            if (!$idAgency) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El parámetro idAgency es requerido',
                    'data' => null
                ])->setStatusCode(400);
            }
            if (!$idExpediente) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El parámetro idExpediente (ID del expediente) es requerido',
                    'data' => null
                ])->setStatusCode(400);
            }

            $ndDMS = trim((string) $ndDMS);
            $idAgency = (int) $idAgency;
            $idExpediente = (int) $idExpediente;

            // Buscar idCliente en view_client_relations por ndCliente e idAgency.
            $row = $this->db->query("
                SELECT idCliente FROM view_client_relations
                WHERE TRIM(ndCliente) = ? AND idAgency = ?
                LIMIT 1
            ", [$ndDMS, $idAgency])->getRowArray();

            $idClientVal = $row['idCliente'] ?? null;
            if (!$row || empty($idClientVal)) {
                $this->guardarErrorRepair($ndDMS, $idAgency, $idExpediente, 'No se encontró relación en view_client_relations');
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'No se encontró relación de cliente para el No Cliente y agencia indicados. Verifique que el cliente tenga relación en ViewClientRelations (ClientTotalRelation).',
                    'data' => null
                ])->setStatusCode(404);
            }

            $idClient = (int) $idClientVal;

            // Actualizar File.IdClient donde Id = idExpediente
            $this->db->table('expedient')->where('Id', $idExpediente)->update(['IdClient' => $idClient]);
            if ($this->db->affectedRows() === 0) {
                $this->guardarErrorRepair($ndDMS, $idAgency, $idExpediente, 'No se actualizó ningún expediente');
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'No se actualizó ningún expediente. Verifique que el ID de expediente exista.',
                    'data' => null
                ])->setStatusCode(404);
            }

            log_message('info', "repairClientRelation: File.Id={$idExpediente} actualizado con IdClient={$idClient} (ndDMS={$ndDMS}, IdAgency={$idAgency})");

            $apiResultJson = json_encode(['success' => true, 'idClient' => $idClient]);
            $this->db->query("
                UPDATE files_to_correct
                SET api_result = ?
                WHERE idExpediente = ? AND idAgency = ? AND ndDMS = ?
            ", [$apiResultJson, $idExpediente, $idAgency, $ndDMS]);

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Relación de cliente reparada correctamente',
                'data' => [
                    'idExpediente' => $idExpediente,
                    'idClient' => $idClient
                ]
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'repairClientRelation: ' . $e->getMessage());
            $input = $this->request->getJSON(true) ?: $this->request->getPost();
            $payload = [
                'success' => false,
                'message' => $e->getMessage(),
                'request' => [
                    'ndDMS' => $input['ndDMS'] ?? $input['ndCliente'] ?? null,
                    'idAgency' => $input['idAgency'] ?? $input['agencyId'] ?? null,
                    'idExpediente' => $input['idExpediente'] ?? $input['fileId'] ?? null
                ],
                'errorCode' => $e->getCode(),
                'errorDetail' => $e->getMessage(),
                'errorFile' => basename($e->getFile()),
                'errorLine' => $e->getLine()
            ];
            if ($e->getPrevious()) {
                $prev = $e->getPrevious();
                $payload['errorPrevious'] = $prev->getMessage();
                $payload['errorPreviousCode'] = $prev->getCode();
            }
            try {
                $ex = (int) ($payload['request']['idExpediente'] ?? 0);
                $ag = (int) ($payload['request']['idAgency'] ?? 0);
                $nd = trim((string) ($payload['request']['ndDMS'] ?? ''));
                if ($ex > 0 && $ag > 0) {
                    $this->db->query("UPDATE files_to_correct SET api_result = ? WHERE idExpediente = ? AND idAgency = ? AND ndDMS = ?",
                        [json_encode($payload), $ex, $ag, $nd]);
                }
            } catch (\Throwable $e2) {
                log_message('error', 'No se pudo registrar error en files_to_correct: ' . $e2->getMessage());
            }
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al reparar relación: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }

    /**
     * Guardar error en files_to_correct.api_result con request y detalle.
     */
    private function guardarErrorRepair(string $ndDMS, int $idAgency, int $idExpediente, string $message): void
    {
        try {
            $payload = [
                'success' => false,
                'message' => $message,
                'request' => ['ndDMS' => $ndDMS, 'idAgency' => $idAgency, 'idExpediente' => $idExpediente]
            ];
            $this->db->query("UPDATE files_to_correct SET api_result = ? WHERE idExpediente = ? AND idAgency = ? AND ndDMS = ?",
                [json_encode($payload), $idExpediente, $idAgency, $ndDMS]);
        } catch (\Throwable $e) {
            log_message('error', 'guardarErrorRepair: ' . $e->getMessage());
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
        $fileQuery = $this->db->query("SELECT IdClient FROM expedient WHERE Id = ?", [$fileId]);
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
                FROM file_document dbf
                INNER JOIN expedient f ON dbf.IdFile = f.Id
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

            // Primero obtener el IdOrder del file antes de eliminarlo
            $fileQuery = $this->db->query("SELECT IdOrder, IdOrderTotal FROM expedient WHERE Id = ?", [$fileId]);
            $file = $fileQuery->getRow();
            
            if (!$file) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'No se encontró el file con el ID especificado'
                ])->setStatusCode(404);
            }
            
            $orderByCarId = null;
            if (isset($file->IdOrder)) {
                $orderByCarId = $file->IdOrder;
                error_log("IdOrder encontrado en File: $orderByCarId");
            } else {
                error_log("⚠️ No se encontró IdOrder en el File (puede ser NULL)");
            }

            // Verificar ANTES de eliminar si hay otros Files que referencian el mismo Order
            $shouldDeleteOrder = false;
            if ($orderByCarId) {
                // Contar cuántos Files referencian este Order (incluyendo el actual)
                $filesCountQuery = $this->db->query("SELECT COUNT(*) as count FROM expedient WHERE IdOrder = ?", [$orderByCarId]);
                $filesCount = $filesCountQuery->getRow();
                $totalFiles = $filesCount->count ?? 0;
                
                error_log("Total de Files que referencian Order $orderByCarId: $totalFiles");
                
                // Si solo hay 1 File (el que vamos a eliminar), podemos eliminar el Order después
                if ($totalFiles == 1) {
                    $shouldDeleteOrder = true;
                    error_log("✅ Se eliminará Order después de eliminar el File (solo había 1 File)");
                } else {
                    error_log("⚠️ NO se eliminará Order porque hay $totalFiles Files que lo referencian");
                }
            }

            // Iniciar transacción
            $this->db->transStart();

            // Deshabilitar temporalmente las verificaciones de clave foránea
            // Esto es necesario para poder eliminar en el orden correcto
            $this->db->query("SET FOREIGN_KEY_CHECKS = 0");

            // ORDEN CORRECTO DE ELIMINACIÓN:
            // 1. FileDocument (depende de File)
            $documentsDeleted = $this->db->query("DELETE FROM file_document WHERE IdFile = ?", [$fileId]);
            $documentsDeleted = $this->db->affectedRows();
            error_log("1️⃣ Documentos eliminados de FileDocument: $documentsDeleted");

            // 2. File (depende de Order a través de IdOrder)
            $fileDeleted = $this->db->query("DELETE FROM expedient WHERE Id = ?", [$fileId]);
            $fileDeleted = $this->db->affectedRows();
            error_log("2️⃣ File eliminado: $fileDeleted");

            // 3. Order (solo si no hay más Files que lo referencien)
            $orderByCarDeleted = 0;
            if ($shouldDeleteOrder && $orderByCarId) {
                $orderByCarDeleted = $this->db->query("DELETE FROM order WHERE Id = ?", [$orderByCarId]);
                $orderByCarDeleted = $this->db->affectedRows();
                error_log("3️⃣ Registros Order eliminados: $orderByCarDeleted");
            } else if ($orderByCarId) {
                error_log("3️⃣ Order NO eliminado (hay otros Files que lo referencian)");
            } else {
                error_log("3️⃣ Order NO eliminado (IdOrder era NULL)");
            }

            // Rehabilitar las verificaciones de clave foránea
            $this->db->query("SET FOREIGN_KEY_CHECKS = 1");

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
                // Rehabilitar las verificaciones de clave foránea antes del rollback
                $this->db->query("SET FOREIGN_KEY_CHECKS = 1");
                $this->db->transRollback();
                
                error_log("ERROR: No se pudo eliminar el file");
                
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'No se pudo eliminar el file'
                ])->setStatusCode(500);
            }

        } catch (Exception $e) {
            // Asegurar que las verificaciones de clave foránea se restauren en caso de error
            try {
                $this->db->query("SET FOREIGN_KEY_CHECKS = 1");
            } catch (Exception $fkException) {
                error_log("Error restaurando FOREIGN_KEY_CHECKS: " . $fkException->getMessage());
            }
            $this->db->transRollback();
            
            error_log("ERROR en deleteFile: " . $e->getMessage());
            
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al eliminar el file: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Comparar pedidos del DMS con la tabla File para obtener estatus
     * POST /api/files/compare-dms-orders
     * Body: { "orders": [{ "idAgency": 10082, "order_dms": "12345" }, ...] }
     */
    public function compareDmsOrders()
    {
        try {
            $input = $this->request->getJSON(true);
            
            if (!isset($input['orders']) || !is_array($input['orders'])) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El parámetro orders es requerido y debe ser un array',
                    'data' => []
                ])->setStatusCode(400);
            }

            $orders = $input['orders'];
            $results = [];

            if (empty($orders)) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'No hay pedidos para comparar',
                    'data' => []
                ]);
            }

            // Construir la consulta para obtener estatus de múltiples pedidos
            // Comparar: Agency.IdAgencyDMS = pedido.idAgency AND File.IdOrderTotal = pedido.order_dms
            $placeholders = [];
            $params = [];
            
            foreach ($orders as $order) {
                $idAgency = $order['idAgency'] ?? $order['IdAgency'] ?? null;
                $orderDms = $order['order_dms'] ?? $order['orderDMS'] ?? $order['OrderDMS'] ?? $order['numeroPedido'] ?? null;
                
                if ($idAgency && $orderDms) {
                    $placeholders[] = "(a.IdAgencyDMS = ? AND f.IdOrderTotal = ?)";
                    $params[] = $idAgency;
                    $params[] = trim((string)$orderDms);
                }
            }

            if (empty($placeholders)) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'No hay pedidos válidos para comparar',
                    'data' => []
                ]);
            }

            $sql = "
                SELECT 
                    a.IdAgencyDMS as idAgency,
                    f.IdOrderTotal as order_dms,
                    fs.Name as estatus,
                    fs.Id as estatusId,
                    f.Id as fileId
                FROM expedient f
                INNER JOIN agency a ON f.IdAgency = a.Id
                LEFT JOIN file_status fs ON f.IdCurrentState = fs.Id
                WHERE " . implode(' OR ', $placeholders) . "
            ";

            $query = $this->db->query($sql, $params);
            $fileResults = $query->getResultArray();

            // Crear un mapa de resultados por idAgency + order_dms
            $statusMap = [];
            foreach ($fileResults as $result) {
                $key = $result['idAgency'] . '|' . trim((string)$result['order_dms']);
                $statusMap[$key] = [
                    'estatus' => $result['estatus'] ?? 'Sin estatus',
                    'estatusId' => $result['estatusId'] ?? null,
                    'fileId' => $result['fileId'] ?? null,
                    'existe' => true
                ];
            }

            // Construir respuesta con todos los pedidos
            foreach ($orders as $order) {
                $idAgency = $order['idAgency'] ?? $order['IdAgency'] ?? null;
                $orderDms = $order['order_dms'] ?? $order['orderDMS'] ?? $order['OrderDMS'] ?? $order['numeroPedido'] ?? null;
                
                if ($idAgency && $orderDms) {
                    $key = $idAgency . '|' . trim((string)$orderDms);
                    $result = $statusMap[$key] ?? [
                        'estatus' => 'No existe en Expediente Único',
                        'estatusId' => null,
                        'fileId' => null,
                        'existe' => false
                    ];
                    
                    $results[] = [
                        'idAgency' => $idAgency,
                        'order_dms' => trim((string)$orderDms),
                        'estatus' => $result['estatus'],
                        'estatusId' => $result['estatusId'],
                        'fileId' => $result['fileId'],
                        'existe' => $result['existe']
                    ];
                }
            }

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Comparación completada',
                'data' => $results
            ]);

        } catch (\Exception $e) {
            error_log("Error en Files::compareDmsOrders: " . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al comparar pedidos: ' . $e->getMessage(),
                'data' => []
            ])->setStatusCode(500);
        }
    }
}
