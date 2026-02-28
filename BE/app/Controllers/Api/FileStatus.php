<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

class FileStatus extends BaseController
{
    protected $db;
    
    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }
    
    /**
     * GET /api/file-status
     * Obtener todos los estados de archivo con filtros
     */
    public function index()
    {
        try {
            // Verificar autenticación
            $currentUser = $this->getAuthenticatedUser();
            if (!$currentUser) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Token de autorización requerido'
                ])->setStatusCode(401);
            }

            // Obtener parámetros de consulta
            $search = $this->request->getGet('search');
            $sortBy = $this->request->getGet('sort_by') ?? 'Name';
            $sortOrder = $this->request->getGet('sort_order') ?? 'ASC';

            $builder = $this->db->table('file_status fs');
            $builder->select('fs.*');

            // Aplicar filtros de búsqueda
            if (!empty($search)) {
                $builder->like('fs.Name', $search);
            }

            // Ordenamiento
            $builder->orderBy("fs.$sortBy", $sortOrder);

            $results = $builder->get()->getResultArray();

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Estados de archivo obtenidos exitosamente',
                'data' => [
                    'file_statuses' => $results,
                    'count' => count($results)
                ]
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en FileStatus::index: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener estados de archivo: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/file-status/active
     * Obtener solo las fases específicas: Integración, Liquidación y Liberación
     */
    public function active()
    {
        try {
            // Verificar autenticación
            $currentUser = $this->getAuthenticatedUser();
            if (!$currentUser) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Token de autorización requerido'
                ])->setStatusCode(401);
            }

            $builder = $this->db->table('file_status fs');
            $builder->select('fs.*');
            // Filtrar solo las fases específicas requeridas (fases activas del proceso)
            $builder->whereIn('fs.Name', ['Integración', 'Liquidación', 'Liberación']);
            $builder->orderBy('fs.Name', 'ASC');

            $results = $builder->get()->getResultArray();

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Fases específicas obtenidas exitosamente',
                'data' => [
                    'file_statuses' => $results,
                    'count' => count($results)
                ]
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en FileStatus::active: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener fases específicas: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/file-status/{id}
     * Obtener un estado de archivo específico por ID
     */
    public function show($id = null)
    {
        try {
            // Verificar autenticación
            $currentUser = $this->getAuthenticatedUser();
            if (!$currentUser) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Token de autorización requerido'
                ])->setStatusCode(401);
            }

            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID requerido'
                ])->setStatusCode(400);
            }

            $builder = $this->db->table('file_status fs');
            $builder->select('fs.*');
            $builder->where('fs.Id', $id);

            $result = $builder->get()->getRowArray();

            if (!$result) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Estado de archivo no encontrado'
                ])->setStatusCode(404);
            }

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Estado de archivo obtenido exitosamente',
                'data' => $result
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en FileStatus::show: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener fase: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }
}
