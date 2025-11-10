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

            // Construir la consulta usando la vista view_client
            $sql = "
                SELECT DISTINCT
                    vc.Id as idCliente,
                    vc.ndClient as ndCliente,
                    TRIM(CONCAT(COALESCE(vc.Name, ''), ' ', COALESCE(vc.LastName, ''), ' ', COALESCE(vc.MotherLastName, ''))) as cliente,
                    vc.Name as nombre,
                    vc.LastName as apellidoPaterno,
                    vc.MotherLastName as apellidoMaterno,
                    vc.RFC as rfc,
                    vc.Email as email,
                    vc.TelNumber as telefono,
                    vc.TelNumber2 as telefono2,
                    vc.RazonSocial as razonSocial,
                    vc.CURP as curp,
                    vc.Adviser as asesor,
                    vc.AgencyOrigin as agenciaOrigen,
                    vc.RegistrationDate as fechaRegistro,
                    vc.UpdateDate as fechaActualizacion,
                    vc.idAgency as idAgency
            ";

            $joins = "";
            $conditions = " WHERE vc.idAgency = ?";
            $params = [$idAgency];

            if ($statusId !== null) {
                $joins .= " INNER JOIN HeaderClient hc_status ON hc_status.IdClient = vc.Id";
                $joins .= " INNER JOIN File f ON f.IdClient = hc_status.Id";
                $conditions .= " AND f.IdAgency = ? AND f.IdCurrentState = ?";
                $params[] = $idAgency;
                $params[] = $statusId;
            }

            $sql .= " FROM view_client vc" . $joins . $conditions;
            
            // Aplicar filtro de búsqueda si se proporciona
            if ($searchTerm && trim($searchTerm) !== '') {
                $searchTerm = trim($searchTerm);
                
                // Si es un número, buscar en ndClient (número de cliente)
                if (is_numeric($searchTerm)) {
                    $sql .= " AND vc.ndClient LIKE ?";
                    $searchPattern = "%{$searchTerm}%";
                    $params[] = $searchPattern;
                } else {
                    // Si es texto, buscar en RazonSocial (nombre/razón social)
                    $sql .= " AND vc.RazonSocial LIKE ?";
                    $searchPattern = "%{$searchTerm}%";
                    $params[] = $searchPattern;
                }
            }

            // Filtrar por estado de file si se proporciona
            if ($statusId !== null) {
                $sql .= " AND EXISTS (
                    SELECT 1 
                    FROM HeaderClient hc
                    INNER JOIN File f ON f.IdClient = hc.Id
                    WHERE hc.IdClient = vc.Id
                        AND f.IdAgency = vc.idAgency
                        AND f.IdCurrentState = ?
                )";
                $params[] = $statusId;
            }
            
            $sql .= " ORDER BY vc.ndClient ASC LIMIT ?";
            $params[] = $limit;

            // Debug: Log de la consulta
            error_log("ClientSearch::search - SQL: " . $sql);
            error_log("ClientSearch::search - Params: " . json_encode($params));
            
            // Ejecutar query
            $query = $this->db->query($sql, $params);
            $results = $query->getResultArray();
            
            // Debug: Log de resultados
            error_log("ClientSearch::search - Results count: " . count($results));

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Clientes obtenidos exitosamente',
                'data' => [
                    'clientes' => $results,
                    'total' => count($results)
                ]
            ]);

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
