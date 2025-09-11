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
                                obc.CarType as vehiculo,
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

            // Query para obtener los files/pedidos por agencia
            $sql = "
                SELECT 
                    f.Id as fileId,
                    f.IdOrderTotal as numeroPedido,
                    f.IdInventary as numeroInventario,
                    p.Name as proceso,
                    ot.Name as operacion,
                    ct.Name as tipoCliente,
                    obc.CarType as vehiculo,
                    obc.Year as year,
                    obc.Modelo as modelo,
                    obc.VIN as vin,
                    a.Name as agencia,
                    f.RegistrationDate as fechaRegistro,
                    fs.Name as estatus
                FROM File f
                LEFT JOIN Process p ON f.IdProcess = p.Id
                LEFT JOIN OperationType ot ON f.IdOperation = ot.Id
                LEFT JOIN CostumerType ct ON f.IdCostumerType = ct.Id
                LEFT JOIN Agency a ON f.IdAgency = a.Id
                LEFT JOIN File_Status fs ON f.IdCurrentState = fs.Id
                LEFT JOIN OrderByCar obc ON f.IdOrderTotal = obc.IdTotalDealer
                WHERE a.IdAgency = ?
            ";

            $params = [$agencyId];

            // Agregar filtro de estatus si se proporciona
            if ($statusId && trim($statusId) !== '') {
                $sql .= " AND fs.Id = ?";
                $params[] = $statusId;
            }

            // Agregar filtro de cliente si se proporciona
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
                'message' => 'Files obtenidos exitosamente',
                'data' => [
                    'files' => $results,
                    'total' => count($results)
                ]
            ]);

        } catch (\Exception $e) {
            error_log("Error en Files::getByAgency: " . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'data' => null
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
}
