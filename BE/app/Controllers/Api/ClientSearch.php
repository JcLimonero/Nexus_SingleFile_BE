<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

class ClientSearch extends BaseController
{
    protected $db;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }

    /**
     * Buscar clientes usando la vista view_client
     * GET /api/client-search/search
     */
    public function search()
    {
        try {
            // Obtener parámetros de la petición
            $idAgency = $this->request->getGet('idAgency');
            $searchTerm = $this->request->getGet('search');
            $limit = (int) $this->request->getGet('limit') ?: 50;
            $statusIdParam = $this->request->getGet('statusId');
            $statusId = null;
            if ($statusIdParam !== null && $statusIdParam !== '') {
                if (!is_numeric($statusIdParam)) {
                    return $this->response->setJSON([
                        'success' => false,
                        'message' => 'El parámetro statusId debe ser numérico',
                        'data' => null
                    ])->setStatusCode(400);
                }
                $statusId = (int) $statusIdParam;
            }

            // Validar parámetros requeridos
            if (!$idAgency) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El parámetro idAgency es requerido',
                    'data' => null
                ])->setStatusCode(400);
            }

            // PRIORIDAD: El pedido debe pertenecer a la agencia seleccionada
            // Buscamos clientes que tengan pedidos en la agencia seleccionada
            // El cliente puede estar dado de alta en cualquier agencia, pero debe tener pedidos en la agencia seleccionada
            // Si hay statusId, también filtrar por ese estado
            
            // Construir query directo desde las tablas para tener más control
            // Usar la misma estructura que view_client pero con mejor lógica de búsqueda
            $sql = "
                SELECT DISTINCT
                    c.Id as idCliente,
                    COALESCE(
                        -- Prioridad 1: ndCliente de la agencia del pedido
                        (SELECT ctr1.IdTotalDealer 
                         FROM Client_Total_Relation ctr1 
                         WHERE ctr1.idHeaderClient = hc.Id 
                         AND ctr1.IdAgency = f.IdAgency 
                         LIMIT 1),
                        -- Prioridad 2: ndCliente de cualquier agencia del cliente
                        (SELECT ctr2.IdTotalDealer 
                         FROM Client_Total_Relation ctr2 
                         WHERE ctr2.idHeaderClient = hc.Id 
                         LIMIT 1),
                        ''
                    ) as ndCliente,
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
                    f.IdAgency as idAgency
                FROM Client c
                INNER JOIN HeaderClient hc ON c.Id = hc.IdClient
                INNER JOIN File f ON hc.Id = f.IdClient
                WHERE f.IdAgency = ?
                AND ((c.Name IS NOT NULL AND c.Name != '') 
                    OR (c.LastName IS NOT NULL AND c.LastName != '') 
                    OR (c.MotherLastName IS NOT NULL AND c.MotherLastName != ''))
            ";
            $params = [$idAgency];

            // Filtrar por estado de file si se proporciona
            if ($statusId !== null) {
                $sql .= " AND f.IdCurrentState = ?";
                $params[] = $statusId;
            }
            
            // Aplicar filtro de búsqueda si se proporciona
            if ($searchTerm && trim($searchTerm) !== '') {
                $searchTerm = trim($searchTerm);
                
                // Si es un número, buscar en ndCliente (en cualquier Client_Total_Relation del cliente)
                if (is_numeric($searchTerm)) {
                    $sql .= " AND EXISTS (
                        SELECT 1
                        FROM Client_Total_Relation ctr_search
                        WHERE ctr_search.idHeaderClient = hc.Id
                        AND TRIM(ctr_search.IdTotalDealer) LIKE ?
                    )";
                    $searchPattern = "%{$searchTerm}%";
                    $params[] = $searchPattern;
                } else {
                    // Si es texto, buscar en RazonSocial o nombre completo
                    $sql .= " AND (
                        c.RazonSocial LIKE ?
                        OR TRIM(CONCAT(COALESCE(c.Name, ''), ' ', COALESCE(c.LastName, ''), ' ', COALESCE(c.MotherLastName, ''))) LIKE ?
                    )";
                    $searchPattern = "%{$searchTerm}%";
                    $params[] = $searchPattern;
                    $params[] = $searchPattern;
                }
            }
            
            $sql .= " ORDER BY ndCliente ASC LIMIT ?";
            $params[] = $limit;

            // Debug: Log de la consulta
            error_log("ClientSearch::search - SQL: " . $sql);
            error_log("ClientSearch::search - Params: " . json_encode($params));
            
            // Ejecutar query
            $query = $this->db->query($sql, $params);
            $results = $query->getResultArray();
            
            // Asegurar que los datos estén en UTF-8 correctamente codificados
            array_walk_recursive($results, function(&$value) {
                if (is_string($value)) {
                    if (!mb_check_encoding($value, 'UTF-8')) {
                        $value = mb_convert_encoding($value, 'UTF-8', 'ISO-8859-1');
                    }
                }
            });
            
            // Debug: Log de resultados
            error_log("ClientSearch::search - Results count: " . count($results));

            $response = [
                'success' => true,
                'message' => 'Clientes obtenidos exitosamente',
                'data' => [
                    'clientes' => $results,
                    'total' => count($results)
                ]
            ];

            return $this->response
                ->setHeader('Content-Type', 'application/json; charset=UTF-8')
                ->setJSON($response, JSON_UNESCAPED_UNICODE);

        } catch (\Exception $e) {
            error_log("Error en ClientSearch::search: " . $e->getMessage());
            
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }

    /**
     * Obtener cliente por ID usando la vista
     * GET /api/client-search/{id}?agency={idAgency}
     */
    public function getById($id = null)
    {
        try {
            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID de cliente requerido',
                    'data' => null
                ])->setStatusCode(400);
            }

            // Obtener ID de agencia del parámetro
            $idAgency = $this->request->getGet('idAgency');
            if (!$idAgency) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El parámetro idAgency es requerido',
                    'data' => null
                ])->setStatusCode(400);
            }

            $sql = "
                SELECT 
                    Id as idCliente,
                    ndClient as ndCliente,
                    TRIM(CONCAT(COALESCE(Name, ''), ' ', COALESCE(LastName, ''), ' ', COALESCE(MotherLastName, ''))) as cliente,
                    Name as nombre,
                    LastName as apellidoPaterno,
                    MotherLastName as apellidoMaterno,
                    RFC as rfc,
                    Email as email,
                    TelNumber as telefono,
                    TelNumber2 as telefono2,
                    RazonSocial as razonSocial,
                    CURP as curp,
                    Adviser as asesor,
                    AgencyOrigin as agenciaOrigen,
                    RegistrationDate as fechaRegistro,
                    UpdateDate as fechaActualizacion,
                    idAgency
                FROM view_client
                WHERE ndClient = ? AND idAgency = ?
            ";
            
            $query = $this->db->query($sql, [$id, $idAgency]);
            $result = $query->getRowArray();

            if (!$result) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Cliente no encontrado',
                    'data' => null
                ])->setStatusCode(404);
            }

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Cliente obtenido exitosamente',
                'data' => [
                    'cliente' => $result
                ]
            ]);

        } catch (\Exception $e) {
            error_log("Error en ClientSearch::getById: " . $e->getMessage());
            
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }

    /**
     * Obtener todos los clientes de una agencia usando la vista
     * GET /api/client-search/by-agency/{idAgency}
     */
    public function getByAgency($idAgency = null)
    {
        try {
            if (!$idAgency) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID de agencia requerido',
                    'data' => null
                ])->setStatusCode(400);
            }

            $limit = (int) $this->request->getGet('limit') ?: 100;
            $offset = (int) $this->request->getGet('offset') ?: 0;

            $sql = "
                SELECT 
                    Id as idCliente,
                    ndClient as ndCliente,
                    TRIM(CONCAT(COALESCE(Name, ''), ' ', COALESCE(LastName, ''), ' ', COALESCE(MotherLastName, ''))) as cliente,
                    Name as nombre,
                    LastName as apellidoPaterno,
                    MotherLastName as apellidoMaterno,
                    RFC as rfc,
                    Email as email,
                    TelNumber as telefono,
                    TelNumber2 as telefono2,
                    RazonSocial as razonSocial,
                    CURP as curp,
                    Adviser as asesor,
                    AgencyOrigin as agenciaOrigen,
                    RegistrationDate as fechaRegistro,
                    UpdateDate as fechaActualizacion,
                    idAgency
                FROM view_client
                WHERE idAgency = ?
                ORDER BY ndClient ASC
                LIMIT ? OFFSET ?
            ";
            
            $query = $this->db->query($sql, [$idAgency, $limit, $offset]);
            $results = $query->getResultArray();

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Clientes obtenidos exitosamente',
                'data' => [
                    'clientes' => $results,
                    'total' => count($results),
                    'limit' => $limit,
                    'offset' => $offset
                ]
            ]);

        } catch (\Exception $e) {
            error_log("Error en ClientSearch::getByAgency: " . $e->getMessage());
            
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }
}
