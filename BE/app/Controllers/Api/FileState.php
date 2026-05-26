<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

class FileState extends BaseController
{
    protected $db;
    
    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }
    
    /**
     * GET /api/file-state
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
            $sortBy = $this->request->getGet('sort_by') ?? 'name';
            $sortOrder = $this->request->getGet('sort_order') ?? 'ASC';

            $builder = $this->db->table('expedient_state fs');
            $builder->select('fs.*');

            // Aplicar filtros de búsqueda
            if (!empty($search)) {
                $builder->like('fs.name', $search);
            }

            // Ordenamiento (validar columnas permitidas)
            $allowedSort = ['id', 'name', 'registration_date', 'update_date', 'enabled'];
            if (!in_array($sortBy, $allowedSort)) {
                $sortBy = 'name';
            }
            $builder->orderBy("fs.$sortBy", $sortOrder);

            $results = $builder->get()->getResultArray();

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Estados de archivo obtenidos exitosamente',
                'data' => [
                    'file_states' => $results,
                    'count' => count($results)
                ]
            ]);

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener estados de archivo: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/file-state/active
     * Obtener fases navegables del workflow (las que aparecen en sidebar
     * y permiten asociar tipos de documento). Excluye terminales como
     * Liberado, Cancelado, Excepción.
     *
     * Antes filtraba por whereIn('name', ['Integración', 'Liquidación',
     * 'Liberación']) hardcoded — frágil si se renombra una fase. Ahora
     * usa el flag semántico is_navigable=1.
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

            $builder = $this->db->table('expedient_state fs');
            $builder->select('fs.*');
            // Solo fases navegables y activas — consistente con
            // Phase::activeForUser branch legacy_all.
            $builder->where('fs.is_navigable', 1);
            $builder->where('fs.enabled', 1);
            // Orden por display_order (incrementos de 10), fallback id.
            $builder->orderBy('fs.display_order', 'ASC');
            $builder->orderBy('fs.id', 'ASC');

            $results = $builder->get()->getResultArray();

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Fases navegables obtenidas exitosamente',
                'data' => [
                    'file_states' => $results,
                    'count' => count($results)
                ]
            ]);

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener fases navegables: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/file-state/{id}
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

            $builder = $this->db->table('expedient_state fs');
            $builder->select('fs.*');
            $builder->where('fs.id', $id);

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

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener fase: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }
}
