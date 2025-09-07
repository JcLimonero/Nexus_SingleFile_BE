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
            $status = $this->request->getGet('status');
            $limit = (int) $this->request->getGet('limit') ?: 50;

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
            if ($status && trim($status) !== '') {
                $sql .= " AND fs.Name = ?";
                $params[] = $status;
            }

            $sql .= " ORDER BY f.RegistrationDate DESC LIMIT ?";
            $params[] = $limit;

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
}
