<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;

class PaymentMethod extends BaseController
{
    protected $db;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }

    /**
     * GET /api/payment-method
     * Lista los métodos de pago activos para uso en liquidaciones
     */
    public function index()
    {
        try {
            $rows = $this->db->table('payment_method')
                ->select('id, name')
                ->where('enabled', 1)
                ->orderBy('name', 'ASC')
                ->get()
                ->getResultArray();

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Métodos de pago obtenidos exitosamente',
                'data' => ['paymentMethods' => $rows]
            ]);
        } catch (\Exception $e) {
            error_log("Error en PaymentMethod::index: " . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }
}
