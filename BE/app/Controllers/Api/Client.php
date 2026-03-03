<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;
use Config\AML;

class Client extends BaseController
{
    protected $db;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }

    /**
     * Obtener ID del tipo de documento de Liquidación desde la tabla config.
     */
    private function getConfigDocumentTypeLiquidacion(): ?int
    {
        try {
            $row = $this->db->table('config')
                ->select('config_value')
                ->where('config_key', 'id_document_type_liquidacion')
                ->get()
                ->getRowArray();
            if ($row && !empty(trim($row['config_value'] ?? ''))) {
                return (int) $row['config_value'];
            }
        } catch (\Throwable $e) {
            // Tabla config puede no existir
        }
        return null;
    }

    /**
     * Listar clientes con expediente para módulo Mesa de Control > Clientes.
     * Solo gerentes (6) y administradores (7). Solo clientes que tengan al menos un File.
     * GET /api/client/list
     * Params: search (cliente/ndCliente), idAgency (opcional), limit, offset
     */
    public function list()
    {
        try {
            $currentUser = $this->getAuthenticatedUser();
            if (!$currentUser) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Token de autorización requerido'
                ])->setStatusCode(401);
            }

            $roleId = (int) ($currentUser['role_id'] ?? 0);
            if (!in_array($roleId, [6, 7], true)) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Acceso denegado. Solo gerentes y administradores pueden ver este módulo.'
                ])->setStatusCode(403);
            }

            $search = trim((string) $this->request->getGet('search'));
            $idAgency = $this->request->getGet('idAgency');
            $idCompany = $this->request->getGet('idCompany');
            $onlyAmlUmbral = $this->request->getGet('onlyAmlUmbral') === '1' || $this->request->getGet('onlyAmlUmbral') === 'true';
            $limit = (int) ($this->request->getGet('limit') ?: 100);
            $offset = (int) ($this->request->getGet('offset') ?: 0);
            $limit = max(1, min(500, $limit));
            $offset = max(0, $offset);

            $amlConfig = config(AML::class);
            $umbral = $amlConfig->getUmbralMonto();
            $vistaAML = $amlConfig->vistaMontos;

            $sql = "
                SELECT
                    c.id as idCliente,
                    MIN(ctr.id_dms) as ndCliente,
                    ANY_VALUE(COALESCE(NULLIF(TRIM(c.razon_social), ''), TRIM(CONCAT(COALESCE(c.name, ''), ' ', COALESCE(c.last_name, ''), ' ', COALESCE(c.mother_last_name, ''))))) as cliente,
                    MIN(hc.id) as idClientHeader,
                    (EXISTS (
                        SELECT 1 FROM {$vistaAML} aml
                        WHERE aml.idCliente = c.id AND aml.totalMonto >= ?
                    )) as excedeUmbralAML
                FROM client c
                INNER JOIN client_header hc ON hc.id_client = c.id
                INNER JOIN client_dms_relation ctr ON hc.id = ctr.id_client_header
                INNER JOIN expedient f ON f.id_client = c.id AND f.id_agency = ctr.id_agency
                INNER JOIN agency a_ag ON a_ag.id = ctr.id_agency
                WHERE 1=1
            ";
            $params = [$umbral];

            if ($idCompany !== null && $idCompany !== '') {
                $sql .= " AND a_ag.id_company = ?";
                $params[] = (int) $idCompany;
            }

            if ($idAgency !== null && $idAgency !== '') {
                $sql .= " AND ctr.id_agency = ?";
                $params[] = (int) $idAgency;
            }

            if ($onlyAmlUmbral) {
                $sql .= " AND EXISTS (
                    SELECT 1 FROM {$vistaAML} aml2
                    WHERE aml2.idCliente = c.id AND aml2.totalMonto >= ?
                )";
                $params[] = $umbral;
            }

            if ($search !== '') {
                $pattern = "%{$search}%";
                $sql .= " AND (
                    ctr.id_dms LIKE ?
                    OR c.razon_social LIKE ?
                    OR TRIM(CONCAT(COALESCE(c.name, ''), ' ', COALESCE(c.last_name, ''), ' ', COALESCE(c.mother_last_name, ''))) LIKE ?
                    OR c.name LIKE ?
                    OR c.last_name LIKE ?
                    OR c.mother_last_name LIKE ?
                )";
                $params[] = $pattern;
                $params[] = $pattern;
                $params[] = $pattern;
                $params[] = $pattern;
                $params[] = $pattern;
                $params[] = $pattern;
            }

            $sql .= " GROUP BY c.id";

            $countSql = "SELECT COUNT(*) as total FROM ($sql) AS sub";
            $countQuery = $this->db->query($countSql, $params);
            $total = (int) ($countQuery->getRow()->total ?? 0);

            $sql .= " ORDER BY cliente ASC LIMIT ? OFFSET ?";
            $params[] = $limit;
            $params[] = $offset;

            $query = $this->db->query($sql, $params);
            $clientes = $query->getResultArray();

            // Asegurar que excedeUmbralAML sea boolean y compatibilidad idHeaderClient (frontend espera este nombre)
            foreach ($clientes as &$cli) {
                $cli['excedeUmbralAML'] = (bool) (int) ($cli['excedeUmbralAML'] ?? 0);
                $cli['idHeaderClient'] = $cli['idClientHeader'] ?? $cli['id_header_client'] ?? null;
            }
            unset($cli);

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Clientes obtenidos exitosamente',
                'data' => [
                    'clientes' => $clientes,
                    'total' => $total,
                    'limit' => $limit,
                    'offset' => $offset,
                    'amlUmbral' => $umbral
                ]
            ]);
        } catch (\Exception $e) {
            error_log("Client::list - " . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }

    /**
     * Obtener expedientes de un cliente agrupados por Cliente/Compañía/Agencia.
     * GET /api/client/:idClientHeader/expedientes
     */
    public function expedientes($idClientHeader = null)
    {
        try {
            $currentUser = $this->getAuthenticatedUser();
            if (!$currentUser) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Token de autorización requerido'
                ])->setStatusCode(401);
            }

            $roleId = (int) ($currentUser['role_id'] ?? 0);
            if (!in_array($roleId, [6, 7], true)) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Acceso denegado.'
                ])->setStatusCode(403);
            }

            if (!$idClientHeader) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID de ClientHeader requerido'
                ])->setStatusCode(400);
            }

            $idClientHeader = (int) $idClientHeader;

            $sql = "
                SELECT
                    f.id as idFile,
                    f.id_order_total as ndPedido,
                    f.registration_date as registro,
                    fs.name as estatus,
                    p.name as proceso,
                    ot.name as operacion,
                    ct.name as tipoCliente,
                    a.name as agencia,
                    a.id as idAgency,
                    co.name as compania,
                    c.id as idCliente,
                    ANY_VALUE(COALESCE(NULLIF(TRIM(c.razon_social), ''), TRIM(CONCAT(COALESCE(c.name, ''), ' ', COALESCE(c.last_name, ''), ' ', COALESCE(c.mother_last_name, ''))))) as cliente,
                    MAX(ctr.id_dms) as ndCliente,
                    MAX(COALESCE(obc1.amount, obc2.Amount)) as monto
                FROM client_header hc
                INNER JOIN client c ON c.id = hc.id_client
                INNER JOIN client_dms_relation ctr ON hc.id = ctr.id_client_header
                INNER JOIN expedient f ON f.id_client = c.id AND f.id_agency = ctr.id_agency
                LEFT JOIN `order` obc1 ON obc1.id = f.id_order
                LEFT JOIN (
                    SELECT obc2a.id_dms, obc2a.id_agency, obc2a.amount as Amount
                    FROM `order` obc2a
                    INNER JOIN (
                        SELECT id_dms, id_agency, MAX(COALESCE(registration_date, '1900-01-01')) as MaxDate
                        FROM `order`
                        GROUP BY id_dms, id_agency
                    ) obc2b ON obc2a.id_dms = obc2b.id_dms
                        AND obc2a.id_agency = obc2b.id_agency
                        AND COALESCE(obc2a.registration_date, '1900-01-01') = obc2b.MaxDate
                ) obc2 ON f.id_order IS NULL
                    AND obc2.id_dms = f.id_order_total
                    AND obc2.id_agency = f.id_agency
                INNER JOIN agency a ON a.id = f.id_agency
                LEFT JOIN company co ON a.id_company = co.id
                LEFT JOIN process p ON f.id_process = p.id
                LEFT JOIN operation_type ot ON f.id_operation = ot.id
                LEFT JOIN customer_type ct ON f.id_customer_type = ct.id
                LEFT JOIN file_status fs ON f.id_current_state = fs.id
                WHERE hc.id = ?
                GROUP BY f.id, f.id_order_total, f.registration_date, fs.name, p.name, ot.name, ct.name, a.name, a.id, co.name, c.id
                ORDER BY co.name ASC, a.name ASC, f.registration_date DESC
            ";

            $query = $this->db->query($sql, [$idClientHeader]);
            $expedientes = $query->getResultArray();

            // Obtener documentos de liquidación por expediente (monto, tipo pago, documentContainer)
            $idDocumentTypeLiquidacion = $this->getConfigDocumentTypeLiquidacion();
            if ($idDocumentTypeLiquidacion && !empty($expedientes)) {
                $idFiles = array_column($expedientes, 'idFile');
                $placeholders = implode(',', array_fill(0, count($idFiles), '?'));
                $sqlLiq = "
                    SELECT
                        dbf.id_file as idFile,
                        dbf.id as idFileDocument,
                        dbf.name as documento,
                        dbf.id_document_container as documentContainer,
                        COALESCE(lrd.amount, 0) as monto,
                        lrd.id_payment_method as idPaymentMethod,
                        pm.name as tipoPago,
                        lrd.payment_date as fechaPago
                    FROM file_document dbf
                    LEFT JOIN liquidation_receipt_detail lrd ON lrd.id_file_document = dbf.id AND lrd.id_file = dbf.id_file
                    LEFT JOIN payment_method pm ON pm.id = lrd.id_payment_method
                    WHERE dbf.id_file IN ({$placeholders})
                    AND dbf.id_document_type = ?
                    AND dbf.enabled = 1
                    ORDER BY dbf.id_file, dbf.id
                ";
                $paramsLiq = array_merge($idFiles, [$idDocumentTypeLiquidacion]);
                try {
                    $docsLiq = $this->db->query($sqlLiq, $paramsLiq)->getResultArray();
                    $docsPorFile = [];
                    foreach ($docsLiq as $doc) {
                        $idF = (int) $doc['idFile'];
                        if (!isset($docsPorFile[$idF])) {
                            $docsPorFile[$idF] = [];
                        }
                        $docsPorFile[$idF][] = [
                            'idFileDocument' => (int) $doc['idFileDocument'],
                            'documento' => $doc['documento'] ?? '',
                            'monto' => (float) ($doc['monto'] ?? 0),
                            'idPaymentMethod' => isset($doc['idPaymentMethod']) ? (int) $doc['idPaymentMethod'] : null,
                            'tipoPago' => $doc['tipoPago'] ?? '—',
                            'documentContainer' => $doc['documentContainer'] ?? null,
                            'fechaPago' => $doc['fechaPago'] ?? null
                        ];
                    }
                    foreach ($expedientes as &$exp) {
                        $exp['documentosLiquidacion'] = $docsPorFile[(int) $exp['idFile']] ?? [];
                    }
                    unset($exp);
                } catch (\Exception $e) {
                    error_log("Client::expedientes - Error cargando docs liquidación: " . $e->getMessage());
                    foreach ($expedientes as &$exp) {
                        $exp['documentosLiquidacion'] = [];
                    }
                    unset($exp);
                }
            } else {
                foreach ($expedientes as &$exp) {
                    $exp['documentosLiquidacion'] = [];
                }
                unset($exp);
            }

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Expedientes obtenidos exitosamente',
                'data' => [
                    'expedientes' => $expedientes,
                    'total' => count($expedientes)
                ]
            ]);
        } catch (\Exception $e) {
            error_log("Client::expedientes - " . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }

    /**
     * Buscar clientes por agencia, número de cliente y nombre
     * GET /api/client/search
     */
    public function search()
    {
        try {
            // Obtener parámetros de la petición
            $idAgency = $this->request->getGet('id');
            $searchTerm = $this->request->getGet('search');
            $limit = (int) $this->request->getGet('limit') ?: 50;

            // Validar parámetros requeridos
            if (!$idAgency) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El parámetro id (agencia) es requerido',
                    'data' => null
                ])->setStatusCode(400);
            }

            // Query simplificado - Solo información del cliente
            $sql = "
                SELECT 
                    c.id as idCliente,
                    ctr.id_dms as ndCliente,
                    COALESCE(NULLIF(TRIM(c.razon_social), ''), TRIM(CONCAT(COALESCE(c.name, ''), ' ', COALESCE(c.last_name, ''), ' ', COALESCE(c.mother_last_name, '')))) as cliente,
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
                    c.update_date as fechaActualizacion
                FROM client c
                INNER JOIN client_header hc ON c.id = hc.id_client
                INNER JOIN client_dms_relation ctr ON hc.id = ctr.id_client_header
                INNER JOIN expedient f ON f.id_client = c.id
                WHERE f.id_agency = ?
                AND ((c.name IS NOT NULL AND c.name != '') OR (c.last_name IS NOT NULL AND c.last_name != '') OR (c.mother_last_name IS NOT NULL AND c.mother_last_name != ''))
            ";
            
            $params = [$idAgency];
            
            // Aplicar filtro de búsqueda si se proporciona
            if ($searchTerm && trim($searchTerm) !== '') {
                $searchTerm = trim($searchTerm);
                
                // Si es un número, buscar también por ID de cliente directamente
                if (is_numeric($searchTerm)) {
                    $sql .= " AND (
                        ctr.id_dms LIKE ? 
                        OR TRIM(CONCAT(COALESCE(c.name, ''), ' ', COALESCE(c.last_name, ''), ' ', COALESCE(c.mother_last_name, ''))) LIKE ?
                        OR c.id = ?
                    )";
                    
                    $searchPattern = "%{$searchTerm}%";
                    $params[] = $searchPattern;
                    $params[] = $searchPattern;
                    $params[] = (int)$searchTerm;
                } else {
                    $sql .= " AND (
                        ctr.id_dms LIKE ? 
                        OR TRIM(CONCAT(COALESCE(c.name, ''), ' ', COALESCE(c.last_name, ''), ' ', COALESCE(c.mother_last_name, ''))) LIKE ?
                    )";
                    
                    $searchPattern = "%{$searchTerm}%";
                    $params[] = $searchPattern;
                    $params[] = $searchPattern;
                }
            }
            
            $sql .= " GROUP BY c.id, ctr.id_dms, c.name, c.last_name, c.mother_last_name, c.RFC, c.email, c.tel_number, c.tel_number2, c.razon_social, c.CURP, c.adviser, c.agency_origin, c.registration_date, c.update_date";
            $sql .= " ORDER BY ndCliente ASC LIMIT ?";
            $params[] = $limit;

            // Debug: Log de la consulta
            error_log("Client::search - SQL: " . $sql);
            error_log("Client::search - Params: " . json_encode($params));
            
            // Ejecutar query
            $query = $this->db->query($sql, $params);
            $results = $query->getResultArray();
            
            // Debug: Log de resultados
            error_log("Client::search - Results count: " . count($results));

            // Debug: Si no hay resultados, hacer una consulta más simple
            if (empty($results) && $searchTerm) {
                $debugSql = "
                    SELECT 
                        c.id as idCliente,
                        c.name as nombre,
                        c.last_name as apellidoPaterno,
                        c.mother_last_name as apellidoMaterno
                    FROM client c
                    WHERE c.id = ?
                ";
                
                $debugQuery = $this->db->query($debugSql, [$searchTerm]);
                $debugResults = $debugQuery->getResultArray();
                
                error_log("Client::search - Debug query results: " . json_encode($debugResults));
            }

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Clientes obtenidos exitosamente',
                'data' => [
                    'clientes' => $results,
                    'total' => count($results)
                ]
            ]);

        } catch (\Exception $e) {
            error_log("Error en Client::search: " . $e->getMessage());
            
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }
}
