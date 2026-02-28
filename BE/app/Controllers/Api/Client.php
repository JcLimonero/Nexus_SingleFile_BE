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
            $onlyAmlUmbral = $this->request->getGet('onlyAmlUmbral') === '1' || $this->request->getGet('onlyAmlUmbral') === 'true';
            $limit = (int) ($this->request->getGet('limit') ?: 100);
            $offset = (int) ($this->request->getGet('offset') ?: 0);
            $limit = max(1, min(500, $limit));
            $offset = max(0, $offset);

            $amlConfig = config(AML::class);
            $umbral = (float) $amlConfig->umbralAnualPorCompania;
            $vistaAML = $amlConfig->vistaMontos;
            $anioActual = (int) date('Y');

            $sql = "
                SELECT
                    c.Id as idCliente,
                    MIN(ctr.IdDMS) as ndCliente,
                    ANY_VALUE(COALESCE(NULLIF(TRIM(c.RazonSocial), ''), TRIM(CONCAT(COALESCE(c.Name, ''), ' ', COALESCE(c.LastName, ''), ' ', COALESCE(c.MotherLastName, ''))))) as cliente,
                    MIN(hc.Id) as idHeaderClient,
                    (EXISTS (
                        SELECT 1 FROM {$vistaAML} aml
                        WHERE aml.idCliente = c.Id AND aml.anio = ? AND aml.totalMonto >= ?
                    )) as excedeUmbralAML
                FROM client c
                INNER JOIN header_client hc ON hc.IdClient = c.Id
                INNER JOIN client_total_relation ctr ON hc.Id = ctr.idHeaderClient
                INNER JOIN file f ON f.IdClient = c.Id AND f.IdAgency = ctr.IdAgency
                WHERE 1=1
            ";
            $params = [$anioActual, $umbral];

            if ($idAgency !== null && $idAgency !== '') {
                $sql .= " AND ctr.IdAgency = ?";
                $params[] = (int) $idAgency;
            }

            if ($onlyAmlUmbral) {
                $sql .= " AND EXISTS (
                    SELECT 1 FROM {$vistaAML} aml2
                    WHERE aml2.idCliente = c.Id AND aml2.anio = ? AND aml2.totalMonto >= ?
                )";
                $params[] = $anioActual;
                $params[] = $umbral;
            }

            if ($search !== '') {
                $pattern = "%{$search}%";
                $sql .= " AND (
                    ctr.IdDMS LIKE ?
                    OR c.RazonSocial LIKE ?
                    OR TRIM(CONCAT(COALESCE(c.Name, ''), ' ', COALESCE(c.LastName, ''), ' ', COALESCE(c.MotherLastName, ''))) LIKE ?
                    OR c.Name LIKE ?
                    OR c.LastName LIKE ?
                    OR c.MotherLastName LIKE ?
                )";
                $params[] = $pattern;
                $params[] = $pattern;
                $params[] = $pattern;
                $params[] = $pattern;
                $params[] = $pattern;
                $params[] = $pattern;
            }

            $sql .= " GROUP BY c.Id";

            $countSql = "SELECT COUNT(*) as total FROM ($sql) AS sub";
            $countQuery = $this->db->query($countSql, $params);
            $total = (int) ($countQuery->getRow()->total ?? 0);

            $sql .= " ORDER BY cliente ASC LIMIT ? OFFSET ?";
            $params[] = $limit;
            $params[] = $offset;

            $query = $this->db->query($sql, $params);
            $clientes = $query->getResultArray();

            // Asegurar que excedeUmbralAML sea boolean (MySQL puede devolver "0"/"1" como string)
            foreach ($clientes as &$cli) {
                $cli['excedeUmbralAML'] = (bool) (int) ($cli['excedeUmbralAML'] ?? 0);
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
     * GET /api/client/:idHeaderClient/expedientes
     */
    public function expedientes($idHeaderClient = null)
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

            if (!$idHeaderClient) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID de HeaderClient requerido'
                ])->setStatusCode(400);
            }

            $idHeaderClient = (int) $idHeaderClient;

            $sql = "
                SELECT
                    f.Id as idFile,
                    f.IdOrderTotal as ndPedido,
                    f.RegistrationDate as registro,
                    fs.Name as estatus,
                    p.Name as proceso,
                    ot.Name as operacion,
                    ct.Name as tipoCliente,
                    a.Name as agencia,
                    a.Id as idAgency,
                    co.Name as compania,
                    c.Id as idCliente,
                    ANY_VALUE(COALESCE(NULLIF(TRIM(c.RazonSocial), ''), TRIM(CONCAT(COALESCE(c.Name, ''), ' ', COALESCE(c.LastName, ''), ' ', COALESCE(c.MotherLastName, ''))))) as cliente,
                    MAX(ctr.IdDMS) as ndCliente,
                    MAX(COALESCE(obc1.Amount, obc2.Amount)) as monto
                FROM header_client hc
                INNER JOIN client c ON c.Id = hc.IdClient
                INNER JOIN client_total_relation ctr ON hc.Id = ctr.idHeaderClient
                INNER JOIN file f ON f.IdClient = c.Id AND f.IdAgency = ctr.IdAgency
                LEFT JOIN order_by_car obc1 ON obc1.Id = f.IdOrder
                LEFT JOIN (
                    SELECT obc2a.IdDMS, obc2a.idagency, obc2a.Amount
                    FROM order_by_car obc2a
                    INNER JOIN (
                        SELECT IdDMS, idagency, MAX(COALESCE(RegistrationDate, '1900-01-01')) as MaxDate
                        FROM order_by_car
                        GROUP BY IdDMS, idagency
                    ) obc2b ON obc2a.IdDMS = obc2b.IdDMS
                        AND obc2a.idagency = obc2b.idagency
                        AND COALESCE(obc2a.RegistrationDate, '1900-01-01') = obc2b.MaxDate
                ) obc2 ON f.IdOrder IS NULL
                    AND obc2.IdDMS = f.IdOrderTotal
                    AND obc2.idagency = f.IdAgency
                INNER JOIN agency a ON a.Id = f.IdAgency
                LEFT JOIN company co ON a.IdCompany = co.Id
                LEFT JOIN process p ON f.IdProcess = p.Id
                LEFT JOIN operation_type ot ON f.IdOperation = ot.Id
                LEFT JOIN customertype ct ON f.IdCustomerType = ct.Id
                LEFT JOIN file_status fs ON f.IdCurrentState = fs.Id
                WHERE hc.Id = ?
                GROUP BY f.Id, f.IdOrderTotal, f.RegistrationDate, fs.Name, p.Name, ot.Name, ct.Name, a.Name, a.Id, co.Name, c.Id
                ORDER BY co.Name ASC, a.Name ASC, f.RegistrationDate DESC
            ";

            $query = $this->db->query($sql, [$idHeaderClient]);
            $expedientes = $query->getResultArray();

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
                    c.Id as idCliente,
                    ctr.IdDMS as ndCliente,
                    COALESCE(NULLIF(TRIM(c.RazonSocial), ''), TRIM(CONCAT(COALESCE(c.Name, ''), ' ', COALESCE(c.LastName, ''), ' ', COALESCE(c.MotherLastName, '')))) as cliente,
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
                    c.UpdateDate as fechaActualizacion
                FROM client c
                INNER JOIN header_client hc ON c.Id = hc.IdClient
                INNER JOIN client_total_relation ctr ON hc.Id = ctr.idHeaderClient
                INNER JOIN file f ON f.IdClient = c.Id
                WHERE f.IdAgency = ?
                AND ((c.Name IS NOT NULL AND c.Name != '') OR (c.LastName IS NOT NULL AND c.LastName != '') OR (c.MotherLastName IS NOT NULL AND c.MotherLastName != ''))
            ";
            
            $params = [$idAgency];
            
            // Aplicar filtro de búsqueda si se proporciona
            if ($searchTerm && trim($searchTerm) !== '') {
                $searchTerm = trim($searchTerm);
                
                // Si es un número, buscar también por ID de cliente directamente
                if (is_numeric($searchTerm)) {
                    $sql .= " AND (
                        ctr.IdDMS LIKE ? 
                        OR TRIM(CONCAT(COALESCE(c.Name, ''), ' ', COALESCE(c.LastName, ''), ' ', COALESCE(c.MotherLastName, ''))) LIKE ?
                        OR c.Id = ?
                    )";
                    
                    $searchPattern = "%{$searchTerm}%";
                    $params[] = $searchPattern;
                    $params[] = $searchPattern;
                    $params[] = (int)$searchTerm;
                } else {
                    $sql .= " AND (
                        ctr.IdDMS LIKE ? 
                        OR TRIM(CONCAT(COALESCE(c.Name, ''), ' ', COALESCE(c.LastName, ''), ' ', COALESCE(c.MotherLastName, ''))) LIKE ?
                    )";
                    
                    $searchPattern = "%{$searchTerm}%";
                    $params[] = $searchPattern;
                    $params[] = $searchPattern;
                }
            }
            
            $sql .= " GROUP BY c.Id, ctr.IdDMS, c.Name, c.LastName, c.MotherLastName, c.RFC, c.Email, c.TelNumber, c.TelNumber2, c.RazonSocial, c.CURP, c.Adviser, c.AgencyOrigin, c.RegistrationDate, c.UpdateDate";
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
                        c.Id as idCliente,
                        c.Name as nombre,
                        c.LastName as apellidoPaterno,
                        c.MotherLastName as apellidoMaterno
                    FROM client c
                    WHERE c.Id = ?
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
