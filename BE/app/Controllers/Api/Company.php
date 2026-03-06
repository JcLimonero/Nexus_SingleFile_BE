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
        try {
            $currentUser = $this->getAuthenticatedUser();
            if (!$currentUser) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Token de autorización requerido'
                ])->setStatusCode(401);
            }

            $data = $this->request->getJSON(true);
            if (empty(trim($data['Name'] ?? ''))) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El nombre de la compañía es requerido'
                ])->setStatusCode(400);
            }

            $id = $this->companyModel->insert([
                'Name' => trim($data['Name'])
            ]);

            if ($id) {
                $company = $this->companyModel->find($id);
                return $this->response->setStatusCode(201)->setJSON([
                    'success' => true,
                    'message' => 'Compañía creada exitosamente',
                    'data' => $company
                ]);
            }

            return $this->response->setStatusCode(500)->setJSON([
                'success' => false,
                'message' => 'Error al crear la compañía'
            ]);
        } catch (\Exception $e) {
            return $this->response->setStatusCode(500)->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ]);
        }
    }
}
