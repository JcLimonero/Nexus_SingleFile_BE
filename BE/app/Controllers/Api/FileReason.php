<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\FileReasonModel;
use CodeIgniter\HTTP\ResponseInterface;

class FileReason extends BaseController
{
    protected $fileReasonModel;
    
    public function __construct()
    {
        $this->fileReasonModel = new FileReasonModel();
    }
    
    /**
     * GET /api/file-reason
     * Obtener todos los motivos de rechazo con filtros y paginación
     */
    public function index()
    {
        try {
            $page = $this->request->getGet('page') ?? 1;
            $limit = $this->request->getGet('limit') ?? null;
            $search = $this->request->getGet('search');
            $idTypeReason = $this->request->getGet('id_type_reason');
            $sortBy = $this->request->getGet('sort_by') ?? 'Name';
            $sortOrder = $this->request->getGet('sort_order') ?? 'ASC';

            // Si no se especifica límite o es 0, obtener todos los registros
            if ($limit === null || $limit == 0 || $limit == 'all') {
                $limit = null;
                $offset = 0;
                $page = 1;
            } else {
                $limit = (int)$limit;
                $offset = ($page - 1) * $limit;
            }

            // Preparar filtros
            $filters = [
                'search' => $search,
                'id_type_reason' => $idTypeReason,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
                'limit' => $limit,
                'offset' => $offset
            ];

            // Obtener motivos de rechazo con filtros
            $fileReasons = $this->fileReasonModel->getFileReasonsWithFilters($filters);

            // Contar total de registros
            $total = $this->fileReasonModel->countFileReasonsWithFilters($filters);

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Motivos de rechazo obtenidos exitosamente',
                'data' => [
                    'file_reasons' => $fileReasons,
                    'total' => $total,
                    'limit' => $limit ?? 'all',
                    'offset' => $offset,
                    'count' => count($fileReasons),
                    'sort_by' => $sortBy,
                    'sort_order' => $sortOrder
                ]
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en FileReason::index: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener motivos de rechazo: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }
    
    /**
     * POST /api/file-reason
     * Crear un nuevo motivo de rechazo
     */
    public function create()
    {
        try {
            $data = $this->request->getJSON(true);
            
            // Validar datos requeridos
            if (empty($data['Name'])) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El nombre del motivo es requerido'
                ])->setStatusCode(400);
            }

            // Verificar si ya existe un motivo con el mismo nombre
            $existingReason = $this->fileReasonModel->getFileReasonByName($data['Name']);
            if ($existingReason) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Ya existe un motivo de rechazo con esta descripción'
                ])->setStatusCode(400);
            }

            // Generar ID único
            $data['Id'] = $this->generateUniqueId();
            
            // Establecer valores por defecto
            $data['Enabled'] = $data['Enabled'] ?? 1;
            $data['RegistrationDate'] = date('Y-m-d H:i:s');
            $data['UpdateDate'] = date('Y-m-d H:i:s');
            $data['IdLastUserUpdate'] = $data['IdLastUserUpdate'] ?? 0;
            
            // Insertar el nuevo motivo
            $result = $this->fileReasonModel->insert($data);
            
            if ($result) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Motivo creado exitosamente',
                    'data' => [
                        'id' => $data['Id'],
                        'name' => $data['Name'],
                        'id_type_reason' => $data['IdTypeReason'] ?? 0
                    ]
                ])->setStatusCode(201);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al crear el motivo de rechazo'
                ])->setStatusCode(500);
            }

        } catch (\Exception $e) {
            log_message('error', 'Error en FileReason::create: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }
    
    /**
     * GET /api/file-reason/:id
     * Obtener un motivo de rechazo específico
     */
    public function show($id = null)
    {
        try {
            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID del motivo de rechazo requerido'
                ])->setStatusCode(400);
            }

            $fileReason = $this->fileReasonModel->find($id);
            
            if (!$fileReason) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Motivo de rechazo no encontrado'
                ])->setStatusCode(404);
            }

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Motivo de rechazo obtenido exitosamente',
                'data' => $fileReason
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en FileReason::show: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener el motivo de rechazo: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }
    
    /**
     * PUT /api/file-reason/:id
     * Actualizar un motivo de rechazo existente
     */
    public function update($id = null)
    {
        try {
            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID del motivo de rechazo requerido'
                ])->setStatusCode(400);
            }

            $data = $this->request->getJSON(true);
            
            // Validar datos requeridos
            if (empty($data['Name'])) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El nombre del motivo es requerido'
                ])->setStatusCode(400);
            }

            // Verificar si existe el motivo
            $existingReason = $this->fileReasonModel->find($id);
            if (!$existingReason) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Motivo no encontrado'
                ])->setStatusCode(404);
            }

            // Verificar si ya existe otro motivo con el mismo nombre
            $duplicateReason = $this->fileReasonModel->where('Name', $data['Name'])
                                                    ->where('Id !=', $id)
                                                    ->first();
            if ($duplicateReason) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Ya existe otro motivo con este nombre'
                ])->setStatusCode(400);
            }

            // Actualizar fecha de modificación
            $data['UpdateDate'] = date('Y-m-d H:i:s');
            
            // Actualizar el motivo de rechazo
            $result = $this->fileReasonModel->update($id, $data);
            
            if ($result) {
                // Obtener el motivo actualizado para devolver todos los campos
                $updatedReason = $this->fileReasonModel->find($id);
                
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Motivo actualizado exitosamente',
                    'data' => $updatedReason
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al actualizar el motivo de rechazo'
                ])->setStatusCode(500);
            }

        } catch (\Exception $e) {
            log_message('error', 'Error en FileReason::update: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }
    
    /**
     * DELETE /api/file-reason/:id
     * Eliminar un motivo de rechazo
     */
    public function delete($id = null)
    {
        try {
            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID del motivo de rechazo requerido'
                ])->setStatusCode(400);
            }

            // Verificar si existe el motivo de rechazo
            $existingReason = $this->fileReasonModel->find($id);
            if (!$existingReason) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Motivo de rechazo no encontrado'
                ])->setStatusCode(404);
            }

            // Eliminar el motivo de rechazo
            $result = $this->fileReasonModel->delete($id);
            
            if ($result) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Motivo eliminado exitosamente',
                    'data' => [
                        'id' => $id,
                        'name' => $existingReason['Name']
                    ]
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al eliminar el motivo de rechazo'
                ])->setStatusCode(500);
            }

        } catch (\Exception $e) {
            log_message('error', 'Error en FileReason::delete: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }
    
    /**
     * GET /api/file-reason/search
     * Buscar motivos de rechazo
     */
    public function search()
    {
        try {
            $searchTerm = $this->request->getGet('q');
            $limit = (int)($this->request->getGet('limit') ?? 10);

            if (empty($searchTerm)) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Término de búsqueda requerido'
                ])->setStatusCode(400);
            }

            $results = $this->fileReasonModel->searchFileReasons($searchTerm, $limit);

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Búsqueda completada exitosamente',
                'data' => [
                    'file_reasons' => $results,
                    'total' => count($results),
                    'search_term' => $searchTerm
                ]
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en FileReason::search: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error en la búsqueda: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }
    
    /**
     * GET /api/file-reason/stats
     * Obtener estadísticas de motivos de rechazo
     */
    public function stats()
    {
        try {
            $stats = $this->fileReasonModel->getFileReasonStats();

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Estadísticas obtenidas exitosamente',
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en FileReason::stats: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener estadísticas: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }
    
    /**
     * GET /api/file-reason/active
     * Obtener motivos activos
     */
    public function active()
    {
        try {
            $activeReasons = $this->fileReasonModel->getActiveFileReasons();

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Motivos activos obtenidos exitosamente',
                'data' => [
                    'file_reasons' => $activeReasons,
                    'total' => count($activeReasons)
                ]
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en FileReason::active: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener motivos activos: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }


    
    /**
     * PATCH /api/file-reason/:id/toggle-status
     * Cambiar estado del motivo de rechazo
     */
    public function toggleStatus($id = null)
    {
        try {
            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID del motivo de rechazo requerido'
                ])->setStatusCode(400);
            }

            // Verificar si existe el motivo de rechazo
            $existingReason = $this->fileReasonModel->find($id);
            if (!$existingReason) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Motivo de rechazo no encontrado'
                ])->setStatusCode(404);
            }

            // Cambiar estado
            $result = $this->fileReasonModel->toggleStatus($id);
            
            if ($result) {
                $newStatus = $existingReason['Enabled'] == 1 ? 0 : 1;
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Estado del motivo de rechazo cambiado exitosamente',
                    'data' => [
                        'id' => $id,
                        'enabled' => $newStatus,
                        'previous_status' => $existingReason['Enabled']
                    ]
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al cambiar el estado del motivo de rechazo'
                ])->setStatusCode(500);
            }

        } catch (\Exception $e) {
            log_message('error', 'Error en FileReason::toggleStatus: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Generar ID único para el motivo de rechazo
     */
    private function generateUniqueId()
    {
        $maxId = $this->fileReasonModel->selectMax('Id')->first();
        return ($maxId['Id'] ?? 0) + 1;
    }
}
