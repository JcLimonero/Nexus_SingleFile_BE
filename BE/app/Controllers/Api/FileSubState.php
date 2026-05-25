<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

class FileSubState extends BaseController
{
    protected $db;
    
    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }
    
    /**
     * GET /api/file-sub-state
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
            $search = $this->request->getGet('search');
            $sortBy = $this->request->getGet('sort_by') ?? 'name';
            $sortOrder = $this->request->getGet('sort_order') ?? 'ASC';

            $builder = $this->db->table('file_sub_state fss');
            $builder->select('fss.*');

            // Aplicar filtros
            // No filtrar por enabled ya que la tabla no tiene esa columna
            if (!empty($search)) {
                $builder->like('fss.name', $search);
            }

            // Ordenamiento (snake_case)
            $allowedSort = ['id', 'name', 'id_file_state', 'registration_date', 'update_date'];
            if (!in_array(strtolower($sortBy), $allowedSort)) {
                $sortBy = 'name';
            }
            $builder->orderBy("fss.$sortBy", $sortOrder);

            $results = $builder->get()->getResultArray();

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Subestados de archivo obtenidos exitosamente',
                'data' => [
                    'file_sub_states' => $results,
                    'count' => count($results)
                ]
            ]);

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener subestados de archivo: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/file-sub-state/active
     * Obtener todos los subestados de archivo (la tabla no tiene columna Enabled)
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

            $idFileState = $this->request->getGet('id_file_state');
            $builder = $this->db->table('file_sub_state fss');
            $builder->select('fss.*');
            if ($idFileState !== null && $idFileState !== '') {
                $builder->where('fss.id_file_state', (int) $idFileState);
            }
            $builder->orderBy('fss.name', 'ASC');

            $results = $builder->get()->getResultArray();

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Subestados de archivo obtenidos exitosamente',
                'data' => [
                    'file_sub_states' => $results,
                    'count' => count($results)
                ]
            ]);

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener subestados de archivo: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/file-sub-state/{id}
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

            $builder = $this->db->table('file_sub_state fss');
            $builder->select('fss.*');
            $builder->where('fss.id', $id);

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

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener subestado de archivo: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }
}
