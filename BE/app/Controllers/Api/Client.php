<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

class Client extends BaseController
{
    protected $db;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
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
                    ctr.IdTotalDealer as ndCliente,
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
                    c.UpdateDate as fechaActualizacion
                FROM Client c
                INNER JOIN HeaderClient hc ON c.Id = hc.IdClient
                INNER JOIN Client_Total_Relation ctr ON hc.Id = ctr.idHeaderClient
                INNER JOIN File f ON hc.Id = f.IdClient
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
                        ctr.IdTotalDealer LIKE ? 
                        OR TRIM(CONCAT(COALESCE(c.Name, ''), ' ', COALESCE(c.LastName, ''), ' ', COALESCE(c.MotherLastName, ''))) LIKE ?
                        OR c.Id = ?
                    )";
                    
                    $searchPattern = "%{$searchTerm}%";
                    $params[] = $searchPattern;
                    $params[] = $searchPattern;
                    $params[] = (int)$searchTerm;
                } else {
                    $sql .= " AND (
                        ctr.IdTotalDealer LIKE ? 
                        OR TRIM(CONCAT(COALESCE(c.Name, ''), ' ', COALESCE(c.LastName, ''), ' ', COALESCE(c.MotherLastName, ''))) LIKE ?
                    )";
                    
                    $searchPattern = "%{$searchTerm}%";
                    $params[] = $searchPattern;
                    $params[] = $searchPattern;
                }
            }
            
            $sql .= " GROUP BY c.Id, ctr.IdTotalDealer, c.Name, c.LastName, c.MotherLastName, c.RFC, c.Email, c.TelNumber, c.TelNumber2, c.RazonSocial, c.CURP, c.Adviser, c.AgencyOrigin, c.RegistrationDate, c.UpdateDate";
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
                    FROM Client c
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
