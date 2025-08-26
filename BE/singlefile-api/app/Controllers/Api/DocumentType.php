<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\DocumentTypeModel;
use CodeIgniter\HTTP\ResponseInterface;

class DocumentType extends BaseController
{
    protected $documentTypeModel;
    
    public function __construct()
    {
        $this->documentTypeModel = new DocumentTypeModel();
    }
    
    /**
     * GET /api/document-type
     * Obtener todos los tipos de documento con filtros y paginación
     */
    public function index()
    {
        try {
            $page = $this->request->getGet('page') ?? 1;
            $limit = $this->request->getGet('limit') ?? null;
            $enabled = $this->request->getGet('enabled');
            $search = $this->request->getGet('search');
            $phase = $this->request->getGet('phase');
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
                'enabled' => $enabled,
                'search' => $search,
                'phase' => $phase,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
                'limit' => $limit,
                'offset' => $offset
            ];

            // Obtener tipos de documento con relaciones
            $documentTypes = $this->documentTypeModel->getDocumentTypesWithRelations($filters);

            // Contar total de registros
            $total = $this->documentTypeModel->countDocumentTypesWithFilters($filters);

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Tipos de documento obtenidos exitosamente',
                'data' => [
                    'document_types' => $documentTypes,
                    'total' => $total,
                    'limit' => $limit ?? 'all',
                    'offset' => $offset,
                    'count' => count($documentTypes),
                    'sort_by' => $sortBy,
                    'sort_order' => $sortOrder,
                    'filter_enabled' => $enabled
                ]
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en DocumentType::index: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener tipos de documento: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }
    
    /**
     * POST /api/document-type
     * Crear un nuevo tipo de documento
     */
    public function create()
    {
        try {
            $data = $this->request->getJSON(true);
            
            // Validar datos requeridos
            if (!isset($data['Name']) || empty(trim($data['Name']))) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El nombre del tipo de documento es requerido'
                ])->setStatusCode(400);
            }

            // Verificar si ya existe un tipo de documento con el mismo nombre
            $existing = $this->documentTypeModel->getDocumentTypeByName($data['Name']);
            if ($existing) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Ya existe un tipo de documento con este nombre'
                ])->setStatusCode(400);
            }

            // Generar ID único
            $maxId = $this->getMaxId();
            $newId = $maxId + 1;

            // Preparar datos para insertar
            $insertData = [
                'Id' => $newId,
                'Name' => trim($data['Name']),
                'Enabled' => isset($data['Enabled']) ? (int)$data['Enabled'] : 1,
                'ReqExpiration' => isset($data['ReqExpiration']) ? (int)$data['ReqExpiration'] : 0,
                'IdProcessType' => isset($data['IdProcessType']) ? (int)$data['IdProcessType'] : 0,
                'Required' => isset($data['Required']) ? (int)$data['Required'] : 1,
                'IdSubProcess' => isset($data['IdSubProcess']) ? (int)$data['IdSubProcess'] : 0,
                'RegistrationDate' => date('Y-m-d H:i:s'),
                'UpdateDate' => null,
                'IdLastUserUpdate' => $this->getCurrentUserId() ?? 0
            ];

            // Insertar el nuevo tipo de documento
            $result = $this->documentTypeModel->insert($insertData);
            
            if ($result) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Tipo de documento creado exitosamente',
                    'data' => [
                        'id' => $newId,
                        'document_type' => $insertData
                    ]
                ])->setStatusCode(201);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al crear el tipo de documento',
                    'errors' => $this->documentTypeModel->errors()
                ])->setStatusCode(400);
            }

        } catch (\Exception $e) {
            log_message('error', 'Error en DocumentType::create: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al crear tipo de documento: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/document-type/{id}
     * Obtener un tipo de documento específico
     */
    public function show($id = null)
    {
        try {
            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID del tipo de documento requerido'
                ])->setStatusCode(400);
            }

            $documentType = $this->documentTypeModel->getDocumentTypeWithRelations($id);
            
            if (!$documentType) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Tipo de documento no encontrado'
                ])->setStatusCode(404);
            }

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Tipo de documento obtenido exitosamente',
                'data' => [
                    'document_type' => $documentType
                ]
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en DocumentType::show: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener tipo de documento: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * PUT /api/document-type/{id}
     * Actualizar un tipo de documento
     */
    public function update($id = null)
    {
        try {
            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID del tipo de documento requerido'
                ])->setStatusCode(400);
            }

            $documentType = $this->documentTypeModel->find($id);
            if (!$documentType) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Tipo de documento no encontrado'
                ])->setStatusCode(404);
            }

            $data = $this->request->getJSON(true);
            
            // Validar datos requeridos
            if (!isset($data['Name']) || empty(trim($data['Name']))) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El nombre del tipo de documento es requerido'
                ])->setStatusCode(400);
            }

            // Verificar si ya existe otro tipo de documento con el mismo nombre
            $existing = $this->documentTypeModel->getDocumentTypeByName($data['Name']);
            if ($existing && $existing['Id'] != $id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Ya existe un tipo de documento con este nombre'
                ])->setStatusCode(400);
            }

            // Preparar datos para actualizar
            $updateData = [
                'Name' => trim($data['Name']),
                'Enabled' => isset($data['Enabled']) ? (int)$data['Enabled'] : $documentType['Enabled'],
                'ReqExpiration' => isset($data['ReqExpiration']) ? (int)$data['ReqExpiration'] : $documentType['ReqExpiration'],
                'IdProcessType' => isset($data['IdProcessType']) ? (int)$data['IdProcessType'] : $documentType['IdProcessType'],
                'Required' => isset($data['Required']) ? (int)$data['Required'] : $documentType['Required'],
                'IdSubProcess' => isset($data['IdSubProcess']) ? (int)$data['IdSubProcess'] : $documentType['IdSubProcess'],
                'UpdateDate' => date('Y-m-d H:i:s'),
                'IdLastUserUpdate' => $this->getCurrentUserId() ?? 0
            ];

            // Actualizar el tipo de documento
            $result = $this->documentTypeModel->update($id, $updateData);
            
            if ($result) {
                $updatedDocumentType = $this->documentTypeModel->getDocumentTypeWithRelations($id);
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Tipo de documento actualizado exitosamente',
                    'data' => [
                        'document_type' => $updatedDocumentType
                    ]
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al actualizar el tipo de documento',
                    'errors' => $this->documentTypeModel->errors()
                ])->setStatusCode(400);
            }

        } catch (\Exception $e) {
            log_message('error', 'Error en DocumentType::update: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al actualizar tipo de documento: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * DELETE /api/document-type/{id}
     * Eliminar un tipo de documento
     */
    public function delete($id = null)
    {
        try {
            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID del tipo de documento requerido'
                ])->setStatusCode(400);
            }

            $documentType = $this->documentTypeModel->find($id);
            if (!$documentType) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Tipo de documento no encontrado'
                ])->setStatusCode(404);
            }

            // Eliminar el tipo de documento
            $result = $this->documentTypeModel->delete($id);
            
            if ($result) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Tipo de documento eliminado exitosamente'
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al eliminar el tipo de documento'
                ])->setStatusCode(500);
            }

        } catch (\Exception $e) {
            log_message('error', 'Error en DocumentType::delete: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al eliminar tipo de documento: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * PATCH /api/document-type/{id}/toggle-status
     * Cambiar estado (habilitado/deshabilitado) de un tipo de documento
     */
    public function toggleStatus($id = null)
    {
        try {
            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID del tipo de documento requerido'
                ])->setStatusCode(400);
            }

            $documentType = $this->documentTypeModel->find($id);
            if (!$documentType) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Tipo de documento no encontrado'
                ])->setStatusCode(404);
            }

            $newStatus = $documentType['Enabled'] == 1 ? 0 : 1;
            $updateData = [
                'Enabled' => $newStatus,
                'UpdateDate' => date('Y-m-d H:i:s'),
                'IdLastUserUpdate' => $this->getCurrentUserId() ?? 0
            ];

            $result = $this->documentTypeModel->update($id, $updateData);
            
            if ($result) {
                $status = $newStatus == 1 ? 'habilitado' : 'deshabilitado';
                return $this->response->setJSON([
                    'success' => true,
                    'message' => "Tipo de documento $status exitosamente",
                    'data' => [
                        'id' => $id,
                        'enabled' => $newStatus
                    ]
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al cambiar estado del tipo de documento'
                ])->setStatusCode(500);
            }

        } catch (\Exception $e) {
            log_message('error', 'Error en DocumentType::toggleStatus: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al cambiar estado: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/document-type/active
     * Obtener solo los tipos de documento activos
     */
    public function active()
    {
        try {
            $documentTypes = $this->documentTypeModel->getActiveDocumentTypes();

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Tipos de documento activos obtenidos exitosamente',
                'data' => [
                    'document_types' => $documentTypes,
                    'count' => count($documentTypes)
                ]
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en DocumentType::active: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener tipos de documento activos: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/document-type/search
     * Buscar tipos de documento por nombre
     */
    public function search()
    {
        try {
            $query = $this->request->getGet('q');
            $limit = $this->request->getGet('limit') ?? 10;
            
            if (!$query) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Parámetro de búsqueda requerido'
                ])->setStatusCode(400);
            }

            $documentTypes = $this->documentTypeModel
                ->like('Name', $query)
                ->where('Enabled', 1)
                ->limit($limit)
                ->findAll();

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Búsqueda realizada exitosamente',
                'data' => [
                    'document_types' => $documentTypes,
                    'count' => count($documentTypes),
                    'query' => $query
                ]
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en DocumentType::search: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error en búsqueda: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/document-type/stats
     * Obtener estadísticas de los tipos de documento
     */
    public function stats()
    {
        try {
            $total = $this->documentTypeModel->countAll();
            $enabled = $this->documentTypeModel->where('Enabled', 1)->countAllResults();
            $disabled = $this->documentTypeModel->where('Enabled', 0)->countAllResults();

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Estadísticas obtenidas exitosamente',
                'data' => [
                    'total' => $total,
                    'enabled' => $enabled,
                    'disabled' => $disabled,
                    'enabled_percentage' => $total > 0 ? round(($enabled / $total) * 100, 2) : 0
                ]
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en DocumentType::stats: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener estadísticas: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Método auxiliar para obtener el máximo ID
     */
    private function getMaxId()
    {
        $db = \Config\Database::connect();
        $query = $db->query('SELECT MAX(Id) as max_id FROM DocumentType');
        $result = $query->getRow();
        return $result ? (int)$result->max_id : 0;
    }

    /**
     * Método auxiliar para obtener el ID del usuario actual
     * Ahora utiliza la funcionalidad del BaseController
     */
    protected function getCurrentUserId()
    {
        return parent::getCurrentUserId();
    }
}
