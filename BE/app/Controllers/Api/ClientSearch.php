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
     * Buscar clientes usando la vista view_client_relations
     * Búsqueda por ndCliente e idAgency
     * GET /api/client-search/search
     */
    public function search()
    {
        try {
            $idAgency = $this->request->getGet('idAgency');
            $searchTerm = $this->request->getGet('search');
            $limit = (int) $this->request->getGet('limit') ?: 50;

            if (!$idAgency) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El parámetro idAgency es requerido',
                    'data' => null
                ])->setStatusCode(400);
            }

            $sql = "
                SELECT idCliente, ndCliente, cliente, IdClientHeader,
                    nombre, apellidoPaterno, apellidoMaterno, rfc, email, telefono, telefono2,
                    razonSocial, curp, tipoCliente, asesor, agenciaOrigen, fechaRegistro, fechaActualizacion, idAgency
                FROM view_client_relations
                WHERE idAgency = ?
            ";
            $params = [$idAgency];

            if ($searchTerm !== null && trim($searchTerm) !== '') {
                $searchTerm = trim($searchTerm);
                $sql .= " AND TRIM(ndCliente) LIKE ?";
                $params[] = "%{$searchTerm}%";
            }

            $sql .= " ORDER BY ndCliente ASC LIMIT ?";
            $params[] = $limit;

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
                    hc.id_client AS idCliente,
                    COALESCE(ctr.id_dms, '') AS ndCliente,
                    TRIM(CONCAT(COALESCE(c.name, ''), ' ', COALESCE(c.last_name, ''), ' ', COALESCE(c.mother_last_name, ''))) AS cliente,
                    hc.id AS IdClientHeader,
                    c.name AS nombre,
                    c.last_name AS apellidoPaterno,
                    c.mother_last_name AS apellidoMaterno,
                    c.RFC AS rfc,
                    c.email AS email,
                    c.tel_number AS telefono,
                    c.tel_number2 AS telefono2,
                    c.business_name AS razonSocial,
                    c.CURP AS curp,
                    c.client_type AS tipoCliente,
                    c.adviser AS asesor,
                    c.agency_origin AS agenciaOrigen,
                    c.registration_date AS fechaRegistro,
                    c.update_date AS fechaActualizacion,
                    ctr.id_agency AS idAgency
                FROM client_header hc
                INNER JOIN client_dms_relation ctr ON hc.id = ctr.id_client_header
                INNER JOIN client c ON c.id = hc.id_client
                WHERE ctr.id_dms = ? AND ctr.id_agency = ?
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
                    hc.id_client AS idCliente,
                    COALESCE(ctr.id_dms, '') AS ndCliente,
                    TRIM(CONCAT(COALESCE(c.name, ''), ' ', COALESCE(c.last_name, ''), ' ', COALESCE(c.mother_last_name, ''))) AS cliente,
                    hc.id AS IdClientHeader,
                    c.name AS nombre,
                    c.last_name AS apellidoPaterno,
                    c.mother_last_name AS apellidoMaterno,
                    c.RFC AS rfc,
                    c.email AS email,
                    c.tel_number AS telefono,
                    c.tel_number2 AS telefono2,
                    c.business_name AS razonSocial,
                    c.CURP AS curp,
                    c.client_type AS tipoCliente,
                    c.adviser AS asesor,
                    c.agency_origin AS agenciaOrigen,
                    c.registration_date AS fechaRegistro,
                    c.update_date AS fechaActualizacion,
                    ctr.id_agency AS idAgency
                FROM client_header hc
                INNER JOIN client_dms_relation ctr ON hc.id = ctr.id_client_header
                INNER JOIN client c ON c.id = hc.id_client
                WHERE ctr.id_agency = ?
                ORDER BY ctr.id_dms ASC
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
