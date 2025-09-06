<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

class Validacion extends BaseController
{
    protected $db;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }

    /**
     * Obtener datos de clientes y procesos para la tabla de validación
     * GET /api/validacion/clientes
     */
    public function getClientes()
    {
        try {
            // Obtener parámetros de la petición
            $idAgency = $this->request->getGet('id');
            $idProcess = $this->request->getGet('idProcess');
            $page = (int) $this->request->getGet('page') ?: 1;
            $limit = (int) $this->request->getGet('limit') ?: 10;
            $offset = ($page - 1) * $limit;

            // Validar parámetros requeridos
            if (!$idAgency || !$idProcess) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Los parámetros id e idProcess son requeridos',
                    'data' => null
                ])->setStatusCode(400);
            }

            // Query principal usando Query Builder
            $query = $this->db->table('File f')
                ->select('
                    f.Id as ndCliente,
                    f.IdOrder as ndPedido,
                    TRIM(CONCAT(COALESCE(c.Name, ""), " ", COALESCE(c.LastName, ""), " ", COALESCE(c.MotherLastName, ""))) as cliente,
                    p.Name as proceso,
                    ot.Name as operacion,
                    f.RegistrationDate as registro,
                    fs.Name as fase,
                    f.IdCurrentState
                ')
                ->join('HeaderClient hc', 'f.IdClient = hc.Id', 'inner')
                ->join('Client c', 'hc.IdClient = c.Id', 'inner')
                ->join('Process p', 'f.IdProcess = p.Id', 'inner')
                ->join('OperationType ot', 'f.IdOperation = ot.Id', 'inner')
                ->join('File_Status fs', 'f.IdCurrentState = fs.Id', 'inner')
                ->where('f.IdAgency', $idAgency)
                ->where('f.IdProcess', $idProcess)
                ->where('p.Enabled', 1)
                ->where('(c.Name IS NOT NULL AND c.Name != "") OR (c.LastName IS NOT NULL AND c.LastName != "") OR (c.MotherLastName IS NOT NULL AND c.MotherLastName != "")')
                ->orderBy('f.RegistrationDate', 'DESC')
                ->limit($limit, $offset);

            // Ejecutar query principal
            $results = $query->get()->getResultArray();

            // Query para contar total de registros
            $countQuery = $this->db->table('File f')
                ->select('COUNT(*) as total')
                ->join('HeaderClient hc', 'f.IdClient = hc.Id', 'inner')
                ->join('Client c', 'hc.IdClient = c.Id', 'inner')
                ->join('Process p', 'f.IdProcess = p.Id', 'inner')
                ->join('OperationType ot', 'f.IdOperation = ot.Id', 'inner')
                ->join('File_Status fs', 'f.IdCurrentState = fs.Id', 'inner')
                ->where('f.IdAgency', $idAgency)
                ->where('f.IdProcess', $idProcess)
                ->where('p.Enabled', 1)
                ->where('(c.Name IS NOT NULL AND c.Name != "") OR (c.LastName IS NOT NULL AND c.LastName != "") OR (c.MotherLastName IS NOT NULL AND c.MotherLastName != "")');

            $totalResult = $countQuery->get()->getRowArray();
            $total = $totalResult ? $totalResult['total'] : 0;

            // Calcular información de paginación
            $totalPages = ceil($total / $limit);
            $hasNextPage = $page < $totalPages;
            $hasPrevPage = $page > 1;

            // Preparar respuesta
            $response = [
                'success' => true,
                'message' => 'Datos obtenidos exitosamente',
                'data' => [
                    'clientes' => $results,
                    'pagination' => [
                        'currentPage' => $page,
                        'totalPages' => $totalPages,
                        'totalRecords' => $total,
                        'recordsPerPage' => $limit,
                        'hasNextPage' => $hasNextPage,
                        'hasPrevPage' => $hasPrevPage
                    ]
                ]
            ];

            return $this->response->setJSON($response);

        } catch (\Exception $e) {
            // Log del error
            error_log("Error en Validacion::getClientes: " . $e->getMessage());
            
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }

    /**
     * Obtener estadísticas de estados para la agencia y proceso seleccionados
     * GET /api/validacion/estadisticas
     */
    public function getEstadisticas()
    {
        try {
            $idAgency = $this->request->getGet('id');
            $idProcess = $this->request->getGet('idProcess');

            if (!$idAgency || !$idProcess) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Los parámetros id e idProcess son requeridos',
                    'data' => null
                ])->setStatusCode(400);
            }

            $query = $this->db->table('File f')
                ->select('fs.Name as estado, COUNT(*) as cantidad')
                ->join('Process p', 'f.IdProcess = p.Id', 'inner')
                ->join('File_Status fs', 'f.IdCurrentState = fs.Id', 'inner')
                ->where('f.IdAgency', $idAgency)
                ->where('f.IdProcess', $idProcess)
                ->where('p.Enabled', 1)
                ->groupBy('f.IdCurrentState, fs.Name')
                ->orderBy('f.IdCurrentState');

            $results = $query->get()->getResultArray();

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Estadísticas obtenidas exitosamente',
                'data' => $results
            ]);

        } catch (\Exception $e) {
            error_log("Error en Validacion::getEstadisticas: " . $e->getMessage());
            
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }

    /**
     * Obtener documentos de un cliente y pedido específicos
     * GET /api/validacion/documentos?clienteId=123&pedidoId=456
     */
    public function getDocumentos()
    {
        try {
            // Obtener parámetros de la petición
            $clienteId = $this->request->getGet('clienteId');
            $pedidoId = $this->request->getGet('pedidoId');

            // Validar parámetros requeridos
            if (!$clienteId || !$pedidoId) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Los parámetros clienteId y pedidoId son requeridos',
                    'data' => null
                ])->setStatusCode(400);
            }

            $query = $this->db->table('DocumentByFile dbf')
                ->select('
                    p.Name as proceso,
                    fs.Name as fase,
                    dt.Name as documento,
                    dbf.Comment as comentario,
                    dbf.RegistrationDate as fecha,
                    u.Name as asignado,
                    CASE WHEN dbf.Enabled = 1 THEN 1 ELSE 0 END as requerido,
                    dbf.IdCurrentStatus as idEstatus
                ')
                ->join('File f', 'dbf.IdFile = f.Id', 'inner')
                ->join('Process p', 'f.IdProcess = p.Id', 'inner')
                ->join('DocumentType dt', 'dbf.IdDocumentType = dt.Id', 'inner')
                ->join('File_Status fs', 'dbf.IdCurrentStatus = fs.Id', 'inner')
                ->join('User u', 'dbf.IdLastUserUpdate = u.Id', 'left')
                ->where('f.Id', $clienteId)
                ->where('f.IdOrder', $pedidoId)
                ->orderBy('dbf.RegistrationDate', 'DESC');

            $results = $query->get()->getResultArray();

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Documentos obtenidos exitosamente',
                'data' => $results
            ]);

        } catch (\Exception $e) {
            error_log("Error en Validacion::getDocumentos: " . $e->getMessage());
            
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }
}
