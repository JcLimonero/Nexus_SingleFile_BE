<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\AgencyModel;
use CodeIgniter\HTTP\ResponseInterface;

class Agency extends BaseController
{
    protected $agencyModel;
    
    public function __construct()
    {
        $this->agencyModel = new AgencyModel();
    }
    
    /**
     * GET /api/agency
     * Obtener todas las agencias
     */
    public function index()
    {
        try {
            // Obtener parámetros de consulta
            $enabledOnly = $this->request->getGet('enabled') !== 'false';
            $search = $this->request->getGet('search');
            $region = $this->request->getGet('region');
            $limit = $this->request->getGet('limit') ? (int)$this->request->getGet('limit') : null;
            $offset = $this->request->getGet('offset') ? (int)$this->request->getGet('offset') : 0;
            
            // Obtener agencias según los filtros
            if ($search) {
                $agencies = $this->agencyModel->getAgenciesByName($search);
            } elseif ($region) {
                $agencies = $this->agencyModel->getAgenciesByRegion($region);
            } elseif ($enabledOnly) {
                $agencies = $this->agencyModel->getAllEnabledAgencies();
            } else {
                $agencies = $this->agencyModel->getAllAgencies();
            }
            
            // Aplicar paginación si se especifica
            if ($limit) {
                $agencies = array_slice($agencies, $offset, $limit);
            }
            
            // Contar total de registros
            $total = $enabledOnly ? 
                $this->agencyModel->countEnabledAgencies() : 
                $this->agencyModel->countAllAgencies();
            
            return $this->response
                ->setStatusCode(200)
                ->setJSON([
                    'success' => true,
                    'message' => 'Agencias obtenidas exitosamente',
                    'data' => [
                        'agencies' => $agencies,
                        'total' => $total,
                        'limit' => $limit,
                        'offset' => $offset,
                        'count' => count($agencies)
                    ]
                ]);
                
        } catch (\Exception $e) {
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'success' => false,
                    'message' => 'Error interno del servidor',
                    'error' => $e->getMessage()
                ]);
        }
    }
    
    /**
     * GET /api/agency/{id}
     * Obtener agencia por ID
     */
    public function show($id = null)
    {
        try {
            if (!$id) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'message' => 'ID de agencia requerido'
                    ]);
            }
            
            $agency = $this->agencyModel->getAgencyById($id);
            
            if (!$agency) {
                return $this->response
                    ->setStatusCode(404)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Agencia no encontrada'
                    ]);
            }
            
            return $this->response
                ->setStatusCode(200)
                ->setJSON([
                    'success' => true,
                    'message' => 'Agencia obtenida exitosamente',
                    'data' => $agency
                ]);
                
        } catch (\Exception $e) {
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'success' => false,
                    'message' => 'Error interno del servidor',
                    'error' => $e->getMessage()
                ]);
        }
    }
    
    /**
     * GET /api/agency/search
     * Buscar agencias por nombre
     */
    public function search()
    {
        try {
            $search = $this->request->getGet('q');
            
            if (!$search || strlen($search) < 2) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'success' => false,
                        'message' => 'Término de búsqueda debe tener al menos 2 caracteres'
                    ]);
            }
            
            $agencies = $this->agencyModel->getAgenciesByName($search);
            
            return $this->response
                ->setStatusCode(200)
                ->setJSON([
                    'success' => true,
                    'message' => 'Búsqueda completada',
                    'data' => [
                        'agencies' => $agencies,
                        'search_term' => $search,
                        'count' => count($agencies)
                    ]
                ]);
                
        } catch (\Exception $e) {
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'success' => false,
                    'message' => 'Error interno del servidor',
                    'error' => $e->getMessage()
                ]);
        }
    }
    
    /**
     * GET /api/agency/regions
     * Obtener todas las regiones disponibles
     */
    public function regions()
    {
        try {
            $regions = $this->agencyModel
                ->select('SubFix')
                ->where('SubFix IS NOT NULL')
                ->where('SubFix !=', '')
                ->where('Enabled', 1)
                ->groupBy('SubFix')
                ->orderBy('SubFix', 'ASC')
                ->findAll();
            
            $regionList = array_column($regions, 'SubFix');
            
            return $this->response
                ->setStatusCode(200)
                ->setJSON([
                    'success' => true,
                    'message' => 'Regiones obtenidas exitosamente',
                    'data' => [
                        'regions' => $regionList,
                        'count' => count($regionList)
                    ]
                ]);
                
        } catch (\Exception $e) {
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'success' => false,
                    'message' => 'Error interno del servidor',
                    'error' => $e->getMessage()
                ]);
        }
    }
}
