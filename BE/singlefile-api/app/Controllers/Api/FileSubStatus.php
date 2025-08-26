<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

class FileSubStatus extends BaseController
{
    protected $db;
    
    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }
    
    /**
     * GET /api/file-sub-status
     * Obtener todos los subestados de archivo con filtros
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
            $enabled = $this->request->getGet('enabled');
            $search = $this->request->getGet('search');
            $sortBy = $this->request->getGet('sort_by') ?? 'Name';
            $sortOrder = $this->request->getGet('sort_order') ?? 'ASC';

            $builder = $this->db->table('File_SubStatus fss');
            $builder->select('fss.*');

            // Aplicar filtros
            if (!empty($enabled)) {
                $builder->where('fss.Enabled', $enabled);
            }

            if (!empty($search)) {
                $builder->like('fss.Name', $search);
            }

            // Ordenamiento
            $builder->orderBy("fss.$sortBy", $sortOrder);

            $results = $builder->get()->getResultArray();

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Subestados de archivo obtenidos exitosamente',
                'data' => [
                    'file_sub_statuses' => $results,
                    'count' => count($results)
                ]
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en FileSubStatus::index: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener subestados de archivo: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/file-sub-status/active
     * Obtener solo los subestados de archivo activos
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

            $builder = $this->db->table('File_SubStatus fss');
            $builder->select('fss.*');
            $builder->where('fss.Enabled', '1');
            $builder->orderBy('fss.Name', 'ASC');

            $results = $builder->get()->getResultArray();

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Subestados de archivo activos obtenidos exitosamente',
                'data' => [
                    'file_sub_statuses' => $results,
                    'count' => count($results)
                ]
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en FileSubStatus::active: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener subestados de archivo activos: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/file-sub-status/{id}
     * Obtener un subestado de archivo específico por ID
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

            $builder = $this->db->table('File_SubStatus fss');
            $builder->select('fss.*');
            $builder->where('fss.Id', $id);

            $result = $builder->get()->getRowArray();

            if (!$result) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Subestado de archivo no encontrado'
                ])->setStatusCode(404);
            }

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Subestado de archivo obtenido exitosamente',
                'data' => $result
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en FileSubStatus::show: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener subestado de archivo: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }
}
