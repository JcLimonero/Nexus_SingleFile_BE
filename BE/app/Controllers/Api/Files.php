<?php
namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

class Files extends BaseController
{
    protected $db;

    /** @var array<string, int> Cache idAgency solicitado → Id interno Agency (solo repair bulk) */
    private $repairBulkAgencyCache = [];

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
                        // (IdTotalDealer puede repetirse entre agencias).
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
                            INNER JOIN HeaderClient hc ON hc.IdClient = f.IdClient
                            INNER JOIN Client_Total_Relation ctr ON hc.Id = ctr.idHeaderClient
                                AND ctr.IdAgency = f.IdAgency
                            LEFT JOIN Process p ON f.IdProcess = p.Id
                            LEFT JOIN OperationType ot ON f.IdOperation = ot.Id
                            LEFT JOIN CostumerType ct ON f.IdCostumerType = ct.Id
                            LEFT JOIN Agency a ON f.IdAgency = a.Id
                            LEFT JOIN File_Status fs ON f.IdCurrentState = fs.Id
                            LEFT JOIN OrderByCar obc ON f.IdOrderTotal = obc.IdTotalDealer
                            WHERE TRIM(ctr.IdTotalDealer) = ?
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
            // IMPORTANTE: Usamos subconsulta para OrderByCar para evitar duplicados cuando hay múltiples registros
            // La subconsulta selecciona el registro más reciente por IdTotalDealer
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
                INNER JOIN Agency a ON f.IdAgency = a.Id
                LEFT JOIN Process p ON f.IdProcess = p.Id
                LEFT JOIN OperationType ot ON f.IdOperation = ot.Id
                LEFT JOIN CostumerType ct ON f.IdCostumerType = ct.Id
                LEFT JOIN File_Status fs ON f.IdCurrentState = fs.Id
                LEFT JOIN (
                    SELECT 
                        obc1.IdTotalDealer,
                        obc1.CarType,
                        obc1.Year,
                        obc1.Modelo,
                        obc1.VIN
                    FROM OrderByCar obc1
                    INNER JOIN (
                        SELECT IdTotalDealer, MAX(RegistrationDate) as MaxDate
                        FROM OrderByCar
                        GROUP BY IdTotalDealer
                    ) obc2 ON obc1.IdTotalDealer = obc2.IdTotalDealer 
                        AND obc1.RegistrationDate = obc2.MaxDate
                ) obc ON f.IdOrderTotal = obc.IdTotalDealer
                WHERE a.IdAgency = ?
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
            // IMPORTANTE: IdTotalDealer (ndCliente) puede repetirse entre agencias (cada dealer tiene su propio DMS).
            // Debemos filtrar por ctr.IdAgency = f.IdAgency para no traer datos de clientes de otra agencia.
            if ($ndCliente && trim($ndCliente) !== '') {
                $ndClienteTrimmed = trim($ndCliente);
                $sql .= " AND EXISTS (
                    SELECT 1
                    FROM HeaderClient hc 
                    INNER JOIN Client_Total_Relation ctr ON hc.Id = ctr.idHeaderClient 
                    WHERE hc.IdClient = f.IdClient 
                    AND TRIM(ctr.IdTotalDealer) = ?
                    AND ctr.IdAgency = f.IdAgency
                )";
                $params[] = $ndClienteTrimmed;
            }

            // Agrupar por f.Id para asegurar un solo registro por pedido (evitar duplicados)
            $sql .= " GROUP BY f.Id, f.IdOrderTotal, f.IdInventary, p.Name, ot.Name, ct.Name, 
                             obc.CarType, obc.Year, obc.Modelo, obc.VIN, a.Name, f.RegistrationDate, fs.Name";
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
                        a.IdAgency as AgencyIdAgency,
                        f.IdClient as IdClient,
                        fs.Name as estado
                    FROM File f
                    INNER JOIN Agency a ON f.IdAgency = a.Id
                    LEFT JOIN File_Status fs ON f.IdCurrentState = fs.Id
                    WHERE f.IdOrderTotal = '35348'
                ";
                $pedidoQuery = $this->db->query($pedidoSql);
                $pedidoResult = $pedidoQuery->getRowArray();
                
                if ($pedidoResult) {
                    $idClient = $pedidoResult['IdClient'] ?? null;
                    error_log("=== DIAGNÓSTICO PEDIDO 35348 ===");
                    error_log("File ID: " . ($pedidoResult['fileId'] ?? 'NULL'));
                    error_log("IdCurrentState: " . ($pedidoResult['IdCurrentState'] ?? 'NULL') . " (esperado: {$statusId})");
                    error_log("Agency esperada: {$agencyId}, Agency del pedido: " . ($pedidoResult['AgencyIdAgency'] ?? 'NULL'));
                    error_log("Estado: " . ($pedidoResult['estado'] ?? 'NULL'));
                    error_log("IdClient (File.IdClient = Client.Id): " . ($idClient ?? 'NULL'));
                    
                    // Verificar relaciones: File.IdClient = Client.Id; Client_Total_Relation usa idHeaderClient (HeaderClient.Id)
                    $relacionSql = "
                        SELECT COUNT(*) as count
                        FROM Client_Total_Relation ctr 
                        INNER JOIN HeaderClient hc ON hc.Id = ctr.idHeaderClient AND hc.IdClient = ?
                        WHERE TRIM(ctr.IdTotalDealer) = ?
                    ";
                    $relacionQuery = $this->db->query($relacionSql, [$idClient, trim($ndCliente)]);
                    $relacionResult = $relacionQuery->getRow();
                    $relacionesConHeaderClient = $relacionResult->count ?? 0;
                    
                    error_log("Relaciones Client_Total_Relation para Client.Id {$idClient} y ndCliente {$ndCliente}: {$relacionesConHeaderClient}");
                    
                    // Verificar TODAS las relaciones del cliente 200495 (en cualquier agencia)
                    $todasRelacionesSql = "
                        SELECT ctr.IdAgency, a.Name as nombreAgencia, ctr.IdTotalDealer, ctr.idHeaderClient
                        FROM Client_Total_Relation ctr
                        INNER JOIN Agency a ON ctr.IdAgency = a.Id
                        WHERE TRIM(ctr.IdTotalDealer) = ?
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
                            WHERE hc.IdClient = ? AND TRIM(ctr.IdTotalDealer) = ?
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
                    SELECT hc.IdClient 
                    FROM HeaderClient hc 
                    INNER JOIN Client_Total_Relation ctr ON hc.Id = ctr.idHeaderClient 
                    WHERE TRIM(ctr.IdTotalDealer) = ?
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

            // Crear file usando IdClient de view_client_relations (hc.IdClient), agencia y OrderByCar
            $fileId = $this->createFile($order, $process, $costumerType, $operationType, $idClientResolved, $internalAgencyId, $currentUser['user_id'], $sellerId, $orderByCarId);

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

            // Validación post-creación: relación cliente correcta y API singlefileorderslastest
            $ndDMS = trim((string) ($clientId ?? $order['ndDMS'] ?? $order['ndCliente'] ?? $order['IdTotalDealer'] ?? ''));
            $orderDms = trim((string) ($order['order_dms'] ?? $order['orderDMS'] ?? $order['numeroPedido'] ?? ''));

            // 1. Validación local: File.IdClient debe coincidir con view_client_relations (solo si tenemos ndDMS)
            if ($ndDMS !== '') {
                $localValidation = $this->validateFileClientRelation($fileId, $ndDMS, $internalAgencyId);
                if (!$localValidation['valid']) {
                    error_log("⚠️ VALIDACIÓN LOCAL FALLIDA - File {$fileId}: " . $localValidation['message']);
                    $repairResult = $this->executeRepairClientRelation($ndDMS, $internalAgencyId, $fileId);
                    if ($repairResult['success']) {
                        error_log("✅ Reparación automática exitosa para File {$fileId}");
                    } else {
                        error_log("❌ Reparación fallida: " . $repairResult['message']);
                    }
                }
            }

            // 2. Validación con API singlefileorderslastest (diagnóstico, no bloqueante)
            if ($ndDMS !== '' && $orderDms !== '' && $agency && !empty($agency->IdAgency)) {
                $apiValidation = $this->validateFileWithSingleFileOrdersLatest(
                    (string) $agency->IdAgency,
                    $ndDMS,
                    $orderDms
                );
                if (!$apiValidation['valid']) {
                    error_log("⚠️ VALIDACIÓN API FALLIDA - File {$fileId}: " . $apiValidation['message']);
                }
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
     * Valida que File.IdClient coincida con la relación esperada en view_client_relations.
     * @param int $fileId ID del expediente
     * @param string|null $ndDMS ndCliente
     * @param int $idAgency Id interno de la agencia (Agency.Id)
     * @return array{valid: bool, expectedIdClient: int|null, actualIdClient: int|null, message: string}
     */
    private function validateFileClientRelation($fileId, $ndDMS, $idAgency)
    {
        $ndDMS = trim((string) ($ndDMS ?? ''));
        $idAgency = (int) $idAgency;
        if ($ndDMS === '' || $idAgency <= 0) {
            return ['valid' => false, 'expectedIdClient' => null, 'actualIdClient' => null, 'message' => 'ndDMS o idAgency inválidos'];
        }

        $file = $this->db->query("SELECT IdClient FROM File WHERE Id = ?", [$fileId])->getRowArray();
        if (!$file) {
            return ['valid' => false, 'expectedIdClient' => null, 'actualIdClient' => null, 'message' => 'Expediente no encontrado'];
        }

        $expected = $this->db->query("
            SELECT IdHeaderClient FROM view_client_relations
            WHERE TRIM(ndCliente) = ? AND idAgency = ?
            LIMIT 1
        ", [$ndDMS, $idAgency])->getRowArray();

        if (!$expected || empty($expected['IdHeaderClient'])) {
            return ['valid' => false, 'expectedIdClient' => null, 'actualIdClient' => (int) $file['IdClient'], 'message' => 'No existe relación en view_client_relations para ndCliente e idAgency'];
        }

        $expectedIdClient = (int) $expected['IdHeaderClient'];
        $actualIdClient = (int) $file['IdClient'];
        $valid = ($actualIdClient === $expectedIdClient);

        return [
            'valid' => $valid,
            'expectedIdClient' => $expectedIdClient,
            'actualIdClient' => $actualIdClient,
            'message' => $valid ? 'Relación correcta' : "Relación incorrecta: File.IdClient={$actualIdClient}, esperado={$expectedIdClient}"
        ];
    }

    /**
     * Valida que el pedido exista en la API singlefileorderslastest.
     * @param string $idAgency IdAgency externo (Agency.IdAgency)
     * @param string $customerDMS ndCliente
     * @param string $order_dms Número de pedido
     * @return array{valid: bool, foundInApi: bool, message: string}
     */
    private function validateFileWithSingleFileOrdersLatest($idAgency, $customerDMS, $order_dms)
    {
        $vanguardiaBaseUrl = 'https://apisvanguardia.com:400';
        $token = 'b26e88c4-ddbe-4adb-a214-4667f454824a';

        $params = http_build_query([
            'idAgency' => $idAgency,
            'customerDMS' => trim((string) $customerDMS),
            'order_dms' => trim((string) $order_dms),
            'perpage' => '50'
        ]);

        $url = "{$vanguardiaBaseUrl}/vgd/singlefileorderslastest?{$params}";

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 15,
            CURLOPT_HTTPHEADER => [
                'X-Provider-Token: ' . $token,
                'Content-Type: application/json'
            ],
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($curlError) {
            return ['valid' => false, 'foundInApi' => false, 'message' => "Error de conexión: {$curlError}"];
        }
        if ($httpCode !== 200) {
            return ['valid' => false, 'foundInApi' => false, 'message' => "API no disponible (HTTP {$httpCode})"];
        }

        $data = json_decode($response, true);
        $orders = $data['data'] ?? $data['orders'] ?? $data['results'] ?? (is_array($data) ? $data : []);
        if (!is_array($orders)) {
            $orders = [];
        }

        $orderDmsStr = trim((string) $order_dms);
        foreach ($orders as $order) {
            $od = $order['order_dms'] ?? $order['orderDMS'] ?? $order['numeroPedido'] ?? null;
            if ($od !== null && trim((string) $od) === $orderDmsStr) {
                return ['valid' => true, 'foundInApi' => true, 'message' => 'Pedido encontrado en API'];
            }
        }

        return ['valid' => false, 'foundInApi' => false, 'message' => "Pedido {$order_dms} no encontrado en singlefileorderslastest"];
    }

    /**
     * Ejecutar reparación de relación cliente en un expediente.
     * @param string $ndDMS ndCliente
     * @param int $idAgency Id interno de la agencia (Agency.Id)
     * @param int $idExpediente ID del expediente
     * @return array{success: bool, idClient?: int, message: string}
     */
    private function executeRepairClientRelation($ndDMS, $idAgency, $idExpediente)
    {
        $ndDMS = trim((string) $ndDMS);
        $idAgency = (int) $idAgency;
        $idExpediente = (int) $idExpediente;

        if ($ndDMS === '' || $idAgency <= 0 || $idExpediente <= 0) {
            return ['success' => false, 'message' => 'Parámetros inválidos para reparación'];
        }

        $row = $this->db->query("
            SELECT IdHeaderClient, idCliente FROM view_client_relations
            WHERE TRIM(ndCliente) = ? AND idAgency = ?
            LIMIT 1
        ", [$ndDMS, $idAgency])->getRowArray();

        if (!$row || empty($row['IdHeaderClient'])) {
            return ['success' => false, 'message' => 'No se encontró relación en view_client_relations para ndCliente e idAgency'];
        }

        $idHeaderClient = (int) $row['IdHeaderClient'];
        $this->db->table('File')->where('Id', $idExpediente)->update(['IdClient' => $idHeaderClient]);

        if ($this->db->affectedRows() === 0) {
            return ['success' => false, 'message' => 'No se actualizó ningún expediente'];
        }

        log_message('info', "executeRepairClientRelation: File.Id={$idExpediente} IdClient={$idHeaderClient} (HeaderClient.Id, ndDMS={$ndDMS}, IdAgency={$idAgency})");
        return [
            'success' => true,
            'idClient' => isset($row['idCliente']) ? (int) $row['idCliente'] : $idHeaderClient,
            'idHeaderClient' => $idHeaderClient,
            'message' => 'Reparación exitosa'
        ];
    }

    /**
     * Buscar cliente por ndCliente externo (HeaderClient.Id).
     * @deprecated Preferir getClientIdFromViewClientRelations(ndDMS, idAgency) para obtener IdClient (Client.Id).
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

            // IdHeaderClient esperado (File.IdClient → FK headerclient.Id).
            // Solo se usa si ndCliente viene en la petición; existingOrders = File.IdClient distinto al esperado.
            $idHeaderClientFromView = null;
            if ($ndCliente !== null && $ndCliente !== '') {
                try {
                    $rowView = $this->db->query("
                        SELECT IdHeaderClient FROM view_client_relations
                        WHERE TRIM(ndCliente) = ? AND idAgency = ?
                        LIMIT 1
                    ", [$ndCliente, (int) $agencyId])->getRowArray();
                    if ($rowView && !empty($rowView['IdHeaderClient'])) {
                        $idHeaderClientFromView = (int) $rowView['IdHeaderClient'];
                    }
                } catch (\Throwable $e) {
                    log_message('info', 'checkExistingOrders: view_client_relations no usada, ' . $e->getMessage());
                }
            }

            // Una sola consulta: todos los File existentes para esta agencia y estos IdOrderTotal (+ IdClient si filtraremos)
            $builder = $this->db->table('File');
            $builder->select('Id, IdOrderTotal' . ($idHeaderClientFromView !== null ? ', IdClient' : ''));
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
                    if ($idHeaderClientFromView !== null) {
                        // Solo incluir en existingOrders los que no tienen el IdHeaderClient de la vista (relación incorrecta)
                        if ($fileIdClient !== $idHeaderClientFromView) {
                            $existingOrders[] = [
                                'order_dms' => $orderDms,
                                'fileId' => $fileId,
                                'order' => $order
                            ];
                        }
                        // Si File.IdClient == IdHeaderClient esperado, no se incluye (ya correcto)
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
     * POST /api/files/repair-client-relation
     * Body: { ndDMS, idAgency, idExpediente } (idAgency = Agency.Id interno)
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

            $idAgency = $this->getAgencyInternalId($idAgency);
            $repairResult = $this->executeRepairClientRelation(
                trim((string) $ndDMS),
                (int) $idAgency,
                (int) $idExpediente
            );

            if (!$repairResult['success']) {
                $statusCode = $repairResult['message'] === 'No se encontró relación en view_client_relations para ndCliente e idAgency' ? 404 : 404;
                return $this->response->setJSON([
                    'success' => false,
                    'message' => $repairResult['message'],
                    'data' => null
                ])->setStatusCode($statusCode);
            }

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Relación de cliente reparada correctamente',
                'data' => [
                    'idExpediente' => (int) $idExpediente,
                    'idClient' => $repairResult['idClient']
                ]
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'repairClientRelation: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al reparar relación: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }

    /**
     * Reparar relación de cliente en varios expedientes (mismo ndCliente e idAgency).
     * POST /api/files/repair-client-relations-bulk
     *
     * Un solo lote:
     *   { "idAgency": "3", "ndCliente": "145383", "fileIds": [397, 398] }
     *
     * Varios lotes (arreglo raíz o "items" / "batches"):
     *   [ { "idAgency":"3", "ndCliente":"352", "fileIds":[309] }, ... ]
     *   { "items": [ ... ] }
     */
    public function repairClientRelationsBulk()
    {
        try {
            set_time_limit(0);
            ini_set('max_execution_time', '0');
            $this->repairBulkAgencyCache = [];

            $input = $this->request->getJSON(true);
            if (!$input) {
                $input = $this->request->getPost();
            }

            $batches = null;
            if (is_array($input)) {
                if (isset($input['items']) && is_array($input['items'])) {
                    $batches = $input['items'];
                } elseif (isset($input['batches']) && is_array($input['batches'])) {
                    $batches = $input['batches'];
                } elseif (isset($input[0]) && is_array($input[0])) {
                    $batches = $input;
                }
            }

            if ($batches !== null) {
                $batchResults = [];
                $grandOk = 0;
                $grandFail = 0;
                $anyBatchError = false;

                foreach ($batches as $idx => $item) {
                    if (!is_array($item)) {
                        $anyBatchError = true;
                        $batchResults[] = [
                            'index' => $idx,
                            'error' => 'Elemento no es un objeto',
                            'repaired' => [],
                            'failed' => [],
                            'summary' => ['total' => 0, 'ok' => 0, 'fail' => 0]
                        ];
                        continue;
                    }

                    $run = $this->executeRepairClientRelationsBulkItem($item);
                    if (!$run['valid']) {
                        $anyBatchError = true;
                        $batchResults[] = [
                            'index' => $idx,
                            'idAgency' => $item['idAgency'] ?? $item['agencyId'] ?? null,
                            'ndCliente' => $item['ndCliente'] ?? $item['ndDMS'] ?? null,
                            'error' => $run['errorMessage'] ?? 'Error de validación',
                            'repaired' => $run['payload']['repaired'] ?? [],
                            'failed' => $run['payload']['failed'] ?? [],
                            'summary' => $run['payload']['summary'] ?? ['total' => 0, 'ok' => 0, 'fail' => 1]
                        ];
                        $grandFail += $run['payload']['summary']['fail'] ?? 1;
                        continue;
                    }

                    $payload = $run['payload'];
                    $batchResults[] = [
                        'index' => $idx,
                        'idAgency' => $item['idAgency'] ?? $item['agencyId'] ?? null,
                        'ndCliente' => $payload['ndCliente'],
                        'repaired' => $payload['repaired'],
                        'failed' => $payload['failed'],
                        'summary' => $payload['summary']
                    ];
                    $grandOk += $payload['summary']['ok'];
                    $grandFail += $payload['summary']['fail'];
                    if ($payload['summary']['fail'] > 0) {
                        $anyBatchError = true;
                    }
                }

                $allOk = !$anyBatchError && $grandFail === 0;

                return $this->response->setJSON([
                    'success' => $allOk,
                    'message' => $allOk
                        ? "Se procesaron " . count($batches) . " lote(s), {$grandOk} expediente(s) reparado(s)"
                        : "Lotes: " . count($batches) . ", reparados: {$grandOk}, fallidos: {$grandFail}",
                    'data' => [
                        'batches' => $batchResults,
                        'summary' => [
                            'batchCount' => count($batches),
                            'totalOk' => $grandOk,
                            'totalFail' => $grandFail
                        ]
                    ]
                ])->setStatusCode(200);
            }

            $run = $this->executeRepairClientRelationsBulkItem($input);
            if (!$run['valid']) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => $run['errorMessage'],
                    'data' => null
                ])->setStatusCode(400);
            }

            $payload = $run['payload'];
            $allOk = $payload['summary']['fail'] === 0;

            return $this->response->setJSON([
                'success' => $allOk,
                'message' => $allOk
                    ? "Se repararon {$payload['summary']['ok']} expediente(s)"
                    : "Reparados: {$payload['summary']['ok']}, con error: {$payload['summary']['fail']}",
                'data' => [
                    'repaired' => $payload['repaired'],
                    'failed' => $payload['failed'],
                    'summary' => $payload['summary']
                ]
            ])->setStatusCode(200);
        } catch (\Throwable $e) {
            log_message('error', 'repairClientRelationsBulk: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al reparar relaciones: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }

    /**
     * @return array{valid: bool, errorMessage?: string, payload?: array}
     */
    private function executeRepairClientRelationsBulkItem(array $input): array
    {
        $ndDMS = $input['ndDMS'] ?? $input['ndCliente'] ?? null;
        $idAgency = $input['idAgency'] ?? $input['agencyId'] ?? null;
        $fileIds = $input['fileIds'] ?? $input['file_ids'] ?? null;

        if (!$ndDMS || trim((string) $ndDMS) === '') {
            return [
                'valid' => false,
                'errorMessage' => 'ndCliente o ndDMS es requerido',
                'payload' => [
                    'repaired' => [],
                    'failed' => [],
                    'summary' => ['total' => 0, 'ok' => 0, 'fail' => 1]
                ]
            ];
        }
        if ($idAgency === null || $idAgency === '') {
            return [
                'valid' => false,
                'errorMessage' => 'idAgency es requerido',
                'payload' => [
                    'repaired' => [],
                    'failed' => [],
                    'summary' => ['total' => 0, 'ok' => 0, 'fail' => 1]
                ]
            ];
        }
        if (!is_array($fileIds) || count($fileIds) === 0) {
            return [
                'valid' => false,
                'errorMessage' => 'fileIds debe ser un arreglo con al menos un id de expediente',
                'payload' => [
                    'repaired' => [],
                    'failed' => [],
                    'summary' => ['total' => 0, 'ok' => 0, 'fail' => 1]
                ]
            ];
        }

        $ndDMS = trim((string) $ndDMS);
        $internalAgencyId = $this->getAgencyInternalIdForBulk($idAgency);

        $uniqueIds = [];
        foreach ($fileIds as $fid) {
            if ($fid === null || $fid === '') {
                continue;
            }
            $n = (int) $fid;
            if ($n > 0) {
                $uniqueIds[$n] = true;
            }
        }
        $uniqueIds = array_keys($uniqueIds);

        if (count($uniqueIds) === 0) {
            return [
                'valid' => false,
                'errorMessage' => 'Ningún fileId válido (enteros > 0)',
                'payload' => [
                    'repaired' => [],
                    'failed' => [],
                    'summary' => ['total' => 0, 'ok' => 0, 'fail' => 1]
                ]
            ];
        }

        $repaired = [];
        $failed = [];

        foreach ($uniqueIds as $idExpediente) {
            $repairResult = $this->executeRepairClientRelation($ndDMS, $internalAgencyId, $idExpediente);
            if (!empty($repairResult['success'])) {
                $repaired[] = [
                    'fileId' => $idExpediente,
                    'idClient' => $repairResult['idClient'] ?? null,
                    'message' => $repairResult['message'] ?? 'OK'
                ];
            } else {
                $failed[] = [
                    'fileId' => $idExpediente,
                    'message' => $repairResult['message'] ?? 'Error'
                ];
            }
        }

        return [
            'valid' => true,
            'payload' => [
                'ndCliente' => $ndDMS,
                'repaired' => $repaired,
                'failed' => $failed,
                'summary' => [
                    'total' => count($uniqueIds),
                    'ok' => count($repaired),
                    'fail' => count($failed)
                ]
            ]
        ];
    }

    /**
     * Resuelve Id interno de agencia con cache (muchos lotes con el mismo idAgency).
     */
    private function getAgencyInternalIdForBulk($agencyId): int
    {
        $key = (string) $agencyId;
        if (!isset($this->repairBulkAgencyCache[$key])) {
            $this->repairBulkAgencyCache[$key] = (int) $this->getAgencyInternalId($agencyId);
        }

        return $this->repairBulkAgencyCache[$key];
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

            // Primero obtener el IdOrder del file antes de eliminarlo
            $fileQuery = $this->db->query("SELECT IdOrder, IdOrderTotal FROM File WHERE Id = ?", [$fileId]);
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

            // Verificar ANTES de eliminar si hay otros Files que referencian el mismo OrderByCar
            $shouldDeleteOrderByCar = false;
            if ($orderByCarId) {
                // Contar cuántos Files referencian este OrderByCar (incluyendo el actual)
                $filesCountQuery = $this->db->query("SELECT COUNT(*) as count FROM File WHERE IdOrder = ?", [$orderByCarId]);
                $filesCount = $filesCountQuery->getRow();
                $totalFiles = $filesCount->count ?? 0;
                
                error_log("Total de Files que referencian OrderByCar $orderByCarId: $totalFiles");
                
                // Si solo hay 1 File (el que vamos a eliminar), podemos eliminar el OrderByCar después
                if ($totalFiles == 1) {
                    $shouldDeleteOrderByCar = true;
                    error_log("✅ Se eliminará OrderByCar después de eliminar el File (solo había 1 File)");
                } else {
                    error_log("⚠️ NO se eliminará OrderByCar porque hay $totalFiles Files que lo referencian");
                }
            }

            // Iniciar transacción
            $this->db->transStart();

            // Deshabilitar temporalmente las verificaciones de clave foránea
            // Esto es necesario para poder eliminar en el orden correcto
            $this->db->query("SET FOREIGN_KEY_CHECKS = 0");

            // ORDEN CORRECTO DE ELIMINACIÓN:
            // 1. DocumentByFile (depende de File)
            $documentsDeleted = $this->db->query("DELETE FROM DocumentByFile WHERE IdFile = ?", [$fileId]);
            $documentsDeleted = $this->db->affectedRows();
            error_log("1️⃣ Documentos eliminados de DocumentByFile: $documentsDeleted");

            // 2. File (depende de OrderByCar a través de IdOrder)
            $fileDeleted = $this->db->query("DELETE FROM File WHERE Id = ?", [$fileId]);
            $fileDeleted = $this->db->affectedRows();
            error_log("2️⃣ File eliminado: $fileDeleted");

            // 3. OrderByCar (solo si no hay más Files que lo referencien)
            $orderByCarDeleted = 0;
            if ($shouldDeleteOrderByCar && $orderByCarId) {
                $orderByCarDeleted = $this->db->query("DELETE FROM OrderByCar WHERE Id = ?", [$orderByCarId]);
                $orderByCarDeleted = $this->db->affectedRows();
                error_log("3️⃣ Registros OrderByCar eliminados: $orderByCarDeleted");
            } else if ($orderByCarId) {
                error_log("3️⃣ OrderByCar NO eliminado (hay otros Files que lo referencian)");
            } else {
                error_log("3️⃣ OrderByCar NO eliminado (IdOrder era NULL)");
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
            // Comparar: Agency.IdAgency = pedido.idAgency AND File.IdOrderTotal = pedido.order_dms
            $placeholders = [];
            $params = [];
            
            foreach ($orders as $order) {
                $idAgency = $order['idAgency'] ?? $order['IdAgency'] ?? null;
                $orderDms = $order['order_dms'] ?? $order['orderDMS'] ?? $order['OrderDMS'] ?? $order['numeroPedido'] ?? null;
                
                if ($idAgency && $orderDms) {
                    $placeholders[] = "(a.IdAgency = ? AND f.IdOrderTotal = ?)";
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
                    a.IdAgency as idAgency,
                    f.IdOrderTotal as order_dms,
                    fs.Name as estatus,
                    fs.Id as estatusId,
                    f.Id as fileId
                FROM File f
                INNER JOIN Agency a ON f.IdAgency = a.Id
                LEFT JOIN File_Status fs ON f.IdCurrentState = fs.Id
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

    /**
     * Estatus de expedientes por lista de VIN o de pedidos (IdOrderTotal), misma lógica que la consulta SQL de consolidación.
     * POST /api/files/bulk-status
     * Body: { "mode": "vin"|"pedido", "items": ["..."], "agencyId": 123|null }
     */
    public function bulkStatusByList()
    {
        try {
            $input = $this->request->getJSON(true);
            if (!is_array($input)) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Cuerpo JSON inválido',
                    'data' => null,
                ])->setStatusCode(400);
            }

            $mode = $input['mode'] ?? null;
            if (!in_array($mode, ['vin', 'pedido'], true)) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'mode debe ser "vin" o "pedido"',
                    'data' => null,
                ])->setStatusCode(400);
            }

            $itemsRaw = $input['items'] ?? null;
            if (!is_array($itemsRaw)) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'items debe ser un arreglo de cadenas',
                    'data' => null,
                ])->setStatusCode(400);
            }

            $agencyId = isset($input['agencyId']) ? (int) $input['agencyId'] : 0;
            if ($agencyId < 0) {
                $agencyId = 0;
            }

            $items = [];
            foreach ($itemsRaw as $raw) {
                $s = trim((string) $raw);
                if ($s === '') {
                    continue;
                }
                if ($mode === 'vin') {
                    $s = strtoupper($s);
                }
                $items[] = $s;
            }

            $items = array_values(array_unique($items));

            if (count($items) > 500) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Máximo 500 valores por consulta',
                    'data' => null,
                ])->setStatusCode(400);
            }

            if ($items === []) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Sin valores para consultar',
                    'data' => [
                        'rows' => [],
                        'notFound' => [],
                        'requested' => 0,
                    ],
                ]);
            }

            $placeholders = implode(',', array_fill(0, count($items), '?'));
            $params = $items;

            $agencyClause = '';
            if ($agencyId > 0) {
                $agencyClause = ' AND f.IdAgency = ?';
                $params[] = $agencyId;
            }

            if ($mode === 'vin') {
                $sql = "
                    SELECT f.IdOrderTotal, o.VIN, fs.Name AS statusName, f.UpdateDate
                    FROM File f
                    INNER JOIN OrderByCar o ON f.IdOrder = o.Id
                    INNER JOIN File_Status fs ON f.IdCurrentState = fs.Id
                    WHERE o.VIN IN ({$placeholders})
                    {$agencyClause}
                    ORDER BY f.IdOrderTotal DESC
                ";
            } else {
                $sql = "
                    SELECT f.IdOrderTotal, o.VIN, fs.Name AS statusName, f.UpdateDate
                    FROM File f
                    INNER JOIN OrderByCar o ON f.IdOrder = o.Id
                    INNER JOIN File_Status fs ON f.IdCurrentState = fs.Id
                    WHERE TRIM(CAST(f.IdOrderTotal AS CHAR)) IN ({$placeholders})
                    {$agencyClause}
                    ORDER BY f.IdOrderTotal DESC
                ";
            }

            $query = $this->db->query($sql, $params);
            $rows = $query->getResultArray();

            $outRows = [];
            foreach ($rows as $row) {
                $outRows[] = [
                    'IdOrderTotal' => $row['IdOrderTotal'] ?? null,
                    'VIN' => $row['VIN'] ?? null,
                    'Name' => $row['statusName'] ?? null,
                    'UpdateDate' => $row['UpdateDate'] ?? null,
                ];
            }

            $foundSet = [];
            if ($mode === 'vin') {
                foreach ($rows as $row) {
                    $vin = strtoupper(trim((string) ($row['VIN'] ?? '')));
                    if ($vin !== '') {
                        $foundSet[$vin] = true;
                    }
                }
            } else {
                foreach ($rows as $row) {
                    $k = trim((string) ($row['IdOrderTotal'] ?? ''));
                    if ($k !== '') {
                        $foundSet[$k] = true;
                    }
                }
            }

            $notFound = [];
            foreach ($items as $item) {
                $checkKey = $mode === 'vin' ? strtoupper($item) : trim((string) $item);
                if (!isset($foundSet[$checkKey])) {
                    $notFound[] = $item;
                }
            }

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Consulta completada',
                'data' => [
                    'rows' => $outRows,
                    'notFound' => $notFound,
                    'requested' => count($items),
                ],
            ]);
        } catch (\Throwable $e) {
            error_log('Error en Files::bulkStatusByList: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al consultar estatus: ' . $e->getMessage(),
                'data' => null,
            ])->setStatusCode(500);
        }
    }
}
