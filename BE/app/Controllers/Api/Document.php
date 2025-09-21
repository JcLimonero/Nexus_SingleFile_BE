<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\DocumentModel;
use CodeIgniter\HTTP\ResponseInterface;

class Document extends BaseController
{
    protected $documentModel;
    
    public function __construct()
    {
        $this->documentModel = new DocumentModel();
    }
    
    /**
     * GET /api/document
     * Obtener todos los documentos con filtros y paginación
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
            $page = $this->request->getGet('page') ?? 1;
            $limit = $this->request->getGet('limit') ?? null;
            $enabled = $this->request->getGet('enabled');
            $search = $this->request->getGet('search');
            $documentType = $this->request->getGet('document_type');
            $currentStatus = $this->request->getGet('current_status');
            $fileId = $this->request->getGet('file_id');
            $sortBy = $this->request->getGet('sort_by') ?? 'RegistrationDate';
            $sortOrder = $this->request->getGet('sort_order') ?? 'DESC';

            // Configurar paginación
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
                'document_type' => $documentType,
                'current_status' => $currentStatus,
                'file_id' => $fileId,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
                'limit' => $limit,
                'offset' => $offset
            ];

            // Obtener documentos con relaciones
            $documents = $this->documentModel->getDocumentsWithRelations($filters);

            // Contar total de registros
            $total = $this->documentModel->countDocumentsWithFilters($filters);

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Documentos obtenidos exitosamente',
                'data' => [
                    'documents' => $documents,
                    'total' => $total,
                    'limit' => $limit ?? 'all',
                    'offset' => $offset,
                    'count' => count($documents),
                    'sort_by' => $sortBy,
                    'sort_order' => $sortOrder,
                    'filters' => [
                        'enabled' => $enabled,
                        'document_type' => $documentType,
                        'current_status' => $currentStatus,
                        'file_id' => $fileId
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en Document::index: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener documentos: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }
    
    /**
     * POST /api/document
     * Crear un nuevo documento
     */
    public function create()
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

            $data = $this->request->getJSON(true);
            
            // Validar datos requeridos
            if (!isset($data['Name']) || empty(trim($data['Name']))) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El nombre del documento es requerido'
                ])->setStatusCode(400);
            }

            if (!isset($data['IdDocumentType']) || empty($data['IdDocumentType'])) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El tipo de documento es requerido'
                ])->setStatusCode(400);
            }

            if (!isset($data['IdFile']) || empty($data['IdFile'])) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El archivo es requerido'
                ])->setStatusCode(400);
            }

            // Generar ID único
            $maxId = $this->getMaxId();
            $newId = $maxId + 1;

            // Preparar datos para insertar
            $insertData = [
                'Id' => $newId,
                'Name' => trim($data['Name']),
                'Comment' => $data['Comment'] ?? null,
                'ExperationDate' => $data['ExperationDate'] ?? null,
                'PathDocument' => $data['PathDocument'] ?? null,
                'Enabled' => isset($data['Enabled']) ? (int)$data['Enabled'] : 1,
                'IdFile' => $data['IdFile'],
                'IdValidation' => $data['IdValidation'] ?? null,
                'IdDocumentType' => $data['IdDocumentType'],
                'IdCurrentStatus' => $data['IdCurrentStatus'] ?? 1,
                'IdDocumentError' => $data['IdDocumentError'] ?? null,
                'RegistrationDate' => date('Y-m-d H:i:s'),
                'UpdateDate' => null,
                'IdLastUserUpdate' => $currentUser['user_id'] ?? 0
            ];

            // Insertar el nuevo documento
            $result = $this->documentModel->insert($insertData);
            
            if ($result) {
                // Obtener el documento creado con relaciones
                $createdDocument = $this->documentModel->getDocumentWithRelations($newId);

                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Documento creado exitosamente',
                    'data' => [
                        'id' => $newId,
                        'document' => $createdDocument
                    ]
                ])->setStatusCode(201);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al crear el documento',
                    'errors' => $this->documentModel->errors()
                ])->setStatusCode(400);
            }

        } catch (\Exception $e) {
            log_message('error', 'Error en Document::create: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al crear documento: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/document/{id}
     * Obtener un documento específico con todas sus relaciones
     */
    public function show($id = null)
    {
        try {
            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID del documento requerido'
                ])->setStatusCode(400);
            }

            $document = $this->documentModel->getDocumentWithRelations($id);
            
            if (!$document) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Documento no encontrado'
                ])->setStatusCode(404);
            }

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Documento obtenido exitosamente',
                'data' => [
                    'document' => $document
                ]
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en Document::show: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener documento: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * PUT /api/document/{id}
     * Actualizar un documento
     */
    public function update($id = null)
    {
        try {
            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID del documento requerido'
                ])->setStatusCode(400);
            }

            // Verificar autenticación
            $currentUser = $this->getAuthenticatedUser();
            if (!$currentUser) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Token de autorización requerido'
                ])->setStatusCode(401);
            }

            $document = $this->documentModel->find($id);
            if (!$document) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Documento no encontrado'
                ])->setStatusCode(404);
            }

            $data = $this->request->getJSON(true);
            
            // Preparar datos para actualizar
            $updateData = [
                'Name' => isset($data['Name']) ? trim($data['Name']) : $document['Name'],
                'Comment' => $data['Comment'] ?? $document['Comment'],
                'ExperationDate' => $data['ExperationDate'] ?? $document['ExperationDate'],
                'PathDocument' => $data['PathDocument'] ?? $document['PathDocument'],
                'Enabled' => isset($data['Enabled']) ? (int)$data['Enabled'] : $document['Enabled'],
                'IdValidation' => $data['IdValidation'] ?? $document['IdValidation'],
                'IdDocumentType' => $data['IdDocumentType'] ?? $document['IdDocumentType'],
                'IdCurrentStatus' => $data['IdCurrentStatus'] ?? $document['IdCurrentStatus'],
                'IdDocumentError' => $data['IdDocumentError'] ?? $document['IdDocumentError'],
                'UpdateDate' => date('Y-m-d H:i:s'),
                'IdLastUserUpdate' => $currentUser['user_id'] ?? 0
            ];

            // Actualizar el documento
            $result = $this->documentModel->update($id, $updateData);
            
            if ($result) {
                $updatedDocument = $this->documentModel->getDocumentWithRelations($id);
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Documento actualizado exitosamente',
                    'data' => [
                        'document' => $updatedDocument
                    ]
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al actualizar el documento',
                    'errors' => $this->documentModel->errors()
                ])->setStatusCode(400);
            }

        } catch (\Exception $e) {
            log_message('error', 'Error en Document::update: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al actualizar documento: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * DELETE /api/document/{id}
     * Eliminar un documento
     */
    public function delete($id = null)
    {
        try {
            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID del documento requerido'
                ])->setStatusCode(400);
            }

            $document = $this->documentModel->find($id);
            if (!$document) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Documento no encontrado'
                ])->setStatusCode(404);
            }

            // Eliminar el documento
            $result = $this->documentModel->delete($id);
            
            if ($result) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Documento eliminado exitosamente'
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al eliminar el documento'
                ])->setStatusCode(500);
            }

        } catch (\Exception $e) {
            log_message('error', 'Error en Document::delete: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al eliminar documento: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * PATCH /api/document/{id}/toggle-status
     * Cambiar estado (habilitado/deshabilitado) de un documento
     */
    public function toggleStatus($id = null)
    {
        try {
            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID del documento requerido'
                ])->setStatusCode(400);
            }

            // Verificar autenticación
            $currentUser = $this->getAuthenticatedUser();
            if (!$currentUser) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Token de autorización requerido'
                ])->setStatusCode(401);
            }

            $document = $this->documentModel->find($id);
            if (!$document) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Documento no encontrado'
                ])->setStatusCode(404);
            }

            $newStatus = $document['Enabled'] == 1 ? 0 : 1;
            $updateData = [
                'Enabled' => $newStatus,
                'UpdateDate' => date('Y-m-d H:i:s'),
                'IdLastUserUpdate' => $currentUser['user_id'] ?? 0
            ];

            $result = $this->documentModel->update($id, $updateData);
            
            if ($result) {
                $status = $newStatus == 1 ? 'habilitado' : 'deshabilitado';
                return $this->response->setJSON([
                    'success' => true,
                    'message' => "Documento $status exitosamente",
                    'data' => [
                        'id' => $id,
                        'enabled' => $newStatus
                    ]
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al cambiar estado del documento'
                ])->setStatusCode(500);
            }

        } catch (\Exception $e) {
            log_message('error', 'Error en Document::toggleStatus: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al cambiar estado: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/document/by-file/{fileId}
     * Obtener todos los documentos de un archivo específico
     */
    public function getByFile($fileId = null)
    {
        try {
            if (!$fileId) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID del archivo requerido'
                ])->setStatusCode(400);
            }

            $documents = $this->documentModel->getDocumentsByFile($fileId);

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Documentos del archivo obtenidos exitosamente',
                'data' => [
                    'documents' => $documents,
                    'count' => count($documents),
                    'file_id' => $fileId
                ]
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en Document::getByFile: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener documentos del archivo: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/document/stats
     * Obtener estadísticas de los documentos
     */
    public function stats()
    {
        try {
            // Obtener filtros de la petición
            $filters = [
                'start_date' => $this->request->getGet('start_date'),
                'end_date' => $this->request->getGet('end_date'),
                'agency_id' => $this->request->getGet('agency_id'),
                'document_type_id' => $this->request->getGet('document_type_id'),
                'user_id' => $this->request->getGet('user_id')
            ];

            // Método simplificado para debug
            $total = $this->documentModel->countAllResults();
            $enabled = $this->documentModel->where('Enabled', 1)->countAllResults();
            $disabled = $this->documentModel->where('Enabled', 0)->countAllResults();

            $stats = [
                'total' => $total,
                'enabled' => $enabled,
                'disabled' => $disabled,
                'by_type' => [],
                'by_status' => []
            ];

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Estadísticas obtenidas exitosamente',
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en Document::stats: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener estadísticas: ' . $e->getMessage(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/document/search
     * Buscar documentos
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

            $filters = [
                'search' => $query,
                'limit' => $limit,
                'enabled' => 1
            ];

            $documents = $this->documentModel->getDocumentsWithRelations($filters);

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Búsqueda realizada exitosamente',
                'data' => [
                    'documents' => $documents,
                    'count' => count($documents),
                    'query' => $query
                ]
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en Document::search: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error en búsqueda: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Método auxiliar para obtener el máximo ID
     */
    private function getMaxId()
    {
        $db = \Config\Database::connect();
        $query = $db->query('SELECT MAX(Id) as max_id FROM DocumentByFile');
        $result = $query->getRow();
        return $result ? (int)$result->max_id : 0;
    }

    /**
     * Método auxiliar para obtener el ID del usuario actual
     */
    protected function getCurrentUserId()
    {
        return parent::getCurrentUserId();
    }
}
