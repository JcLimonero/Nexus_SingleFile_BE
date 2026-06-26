<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\CompanyModel;
use CodeIgniter\HTTP\ResponseInterface;

class Company extends BaseController
{
    protected $companyModel;

    public function __construct()
    {
        $this->companyModel = new CompanyModel();
    }

    /**
     * GET /api/company
     * Obtener todas las compañías (para dropdowns, etc.)
     */
    public function index()
    {
        try {
            $currentUser = $this->getAuthenticatedUser();
            if (!$currentUser) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Token de autorización requerido'
                ])->setStatusCode(401);
            }

            $companies = $this->companyModel->getAllCompanies();

            return $this->response->setStatusCode(200)->setJSON([
                'success' => true,
                'message' => 'Compañías obtenidas exitosamente',
                'data' => [
                    'companies' => $companies,
                    'total' => count($companies)
                ]
            ]);
        } catch (\Exception $e) {

            return $this->response->setStatusCode(500)->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * POST /api/company
     * Crear nueva compañía
     */
    public function create()
    {
        // Modelo de cobro por agencia → companies se gestionan exclusivamente
        // desde el operador del WIZARD para mantener consistencia con el
        // recuento billable. Cliente no puede crear razones sociales propias.
        return $this->responseClientWriteBlocked('razones sociales');
    }
}
