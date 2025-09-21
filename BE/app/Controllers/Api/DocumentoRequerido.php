<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\DocumentoRequeridoModel;
use CodeIgniter\HTTP\ResponseInterface;

class DocumentoRequerido extends BaseController
{
    protected $documentoRequeridoModel;

    public function __construct()
    {
        $this->documentoRequeridoModel = new DocumentoRequeridoModel();
    }

    /**
     * Obtener todos los documentos requeridos con filtros y paginación
     */
    public function index()
    {
        try {
            // Obtener parámetros de la petición
            $limit = $this->request->getGet('limit') ? (int)$this->request->getGet('limit') : null;
            $offset = $this->request->getGet('offset') ? (int)$this->request->getGet('offset') : 0;
            $sortBy = $this->request->getGet('sort_by') ?: 'Id';
            $sortOrder = $this->request->getGet('sort_order') ?: 'ASC';

            // Construir filtros
            $filters = [
                'IdProcess' => $this->request->getGet('IdProcess'),
                'IdAgency' => $this->request->getGet('IdAgency'),
                'IdCostumerType' => $this->request->getGet('IdCostumerType'),
                'IdOperationType' => $this->request->getGet('IdOperationType'),
                'IdDocumentType' => $this->request->getGet('IdDocumentType'),
                'Required' => $this->request->getGet('Required') !== null ? (int)$this->request->getGet('Required') : null,
                'Enabled' => $this->request->getGet('Enabled') !== null ? (int)$this->request->getGet('Enabled') : null
            ];
            
            // Solo aplicar filtro de Enabled si se especifica explícitamente
            // Por defecto mostrar todos los registros (activos e inactivos)

            // Remover filtros vacíos
            $filters = array_filter($filters, function($value) {
                return $value !== null && $value !== '';
            });

            // Obtener documentos con relaciones
            $documentos = $this->documentoRequeridoModel->getDocumentosRequeridosWithRelations(
                $filters, $limit, $offset, $sortBy, $sortOrder
            );

            // Contar total de documentos con filtros
            $total = $this->documentoRequeridoModel->countDocumentosRequeridos($filters);

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Documentos requeridos obtenidos exitosamente',
                'data' => [
                    'documentos' => $documentos,
                    'total' => $total,
                    'limit' => $limit,
                    'offset' => $offset,
                    'count' => count($documentos)
                ]
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en DocumentoRequerido::index: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener documentos requeridos: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Obtener un documento requerido por ID
     */
    public function show($id = null)
    {
        try {
            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID del documento requerido es requerido'
                ])->setStatusCode(400);
            }

            $documento = $this->documentoRequeridoModel->find($id);
            
            if (!$documento) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Documento requerido no encontrado'
                ])->setStatusCode(404);
            }

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Documento requerido obtenido exitosamente',
                'data' => $documento
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en DocumentoRequerido::show: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener documento requerido: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Crear un nuevo documento requerido
     */
    public function create()
    {
        try {
            $data = $this->request->getJSON(true);
            
            // Validar datos requeridos
            if (!$this->validateRequiredFields($data)) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Todos los campos requeridos deben estar presentes'
                ])->setStatusCode(400);
            }

            // Verificar si ya existe un documento requerido para la misma configuración
            if ($this->documentoRequeridoModel->existsDocumentoRequerido(
                $data['IdProcess'], 
                $data['IdAgency'], 
                $data['IdCostumerType'], 
                $data['IdOperationType'], 
                $data['IdDocumentType']
            )) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Ya existe un documento requerido para esta configuración'
                ])->setStatusCode(400);
            }

            // Crear el documento requerido usando el modelo
            $result = $this->documentoRequeridoModel->createDocumentoRequerido($data);
            
            if ($result) {
                // Obtener el documento creado con relaciones
                $documentoCreado = $this->documentoRequeridoModel->getDocumentosRequeridosWithRelations([
                    'IdProcess' => $data['IdProcess'],
                    'IdAgency' => $data['IdAgency'],
                    'IdCostumerType' => $data['IdCostumerType'],
                    'IdOperationType' => $data['IdOperationType']
                ]);
                
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Documento requerido creado exitosamente',
                    'data' => $documentoCreado[0] ?? $data
                ])->setStatusCode(201);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al crear documento requerido'
                ])->setStatusCode(500);
            }

        } catch (\Exception $e) {
            log_message('error', 'Error en DocumentoRequerido::create: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al crear documento requerido: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Actualizar un documento requerido existente
     */
    public function update($id = null)
    {
        try {
            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID del documento requerido es requerido'
                ])->setStatusCode(400);
            }

            $data = $this->request->getJSON(true);
            
            // Verificar si el documento existe
            $existingDocumento = $this->documentoRequeridoModel->find($id);
            if (!$existingDocumento) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Documento requerido no encontrado'
                ])->setStatusCode(404);
            }

            // Verificar si ya existe otro documento requerido para la misma configuración
            if (isset($data['IdProcess']) && isset($data['IdAgency']) && 
                isset($data['IdCostumerType']) && isset($data['IdOperationType']) && 
                isset($data['IdDocumentType'])) {
                
                if ($this->documentoRequeridoModel->existsDocumentoRequerido(
                    $data['IdProcess'], 
                    $data['IdAgency'], 
                    $data['IdCostumerType'], 
                    $data['IdOperationType'], 
                    $data['IdDocumentType'],
                    $id
                )) {
                    return $this->response->setJSON([
                        'success' => false,
                        'message' => 'Ya existe un documento requerido para esta configuración'
                    ])->setStatusCode(400);
                }
            }

            // Actualizar el documento requerido usando el modelo
            $result = $this->documentoRequeridoModel->updateDocumentoRequerido($id, $data);
            
            if ($result) {
                // Obtener el documento actualizado con relaciones
                $documentoActualizado = $this->documentoRequeridoModel->getDocumentosRequeridosWithRelations([
                    'Id' => $id
                ]);
                
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Documento requerido actualizado exitosamente',
                    'data' => $documentoActualizado[0] ?? $existingDocumento
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al actualizar documento requerido'
                ])->setStatusCode(500);
            }

        } catch (\Exception $e) {
            log_message('error', 'Error en DocumentoRequerido::update: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al actualizar documento requerido: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Eliminar un documento requerido
     */
    public function delete($id = null)
    {
        try {
            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID del documento requerido es requerido'
                ])->setStatusCode(400);
            }

            // Verificar si el documento existe
            $existingDocumento = $this->documentoRequeridoModel->find($id);
            if (!$existingDocumento) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Documento requerido no encontrado'
                ])->setStatusCode(404);
            }

            // Eliminar el documento requerido
            $result = $this->documentoRequeridoModel->delete($id);
            
            if ($result) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Documento requerido eliminado exitosamente'
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al eliminar documento requerido'
                ])->setStatusCode(500);
            }

        } catch (\Exception $e) {
            log_message('error', 'Error en DocumentoRequerido::delete: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al eliminar documento requerido: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Obtener estadísticas de documentos requeridos
     */
    public function stats()
    {
        try {
            $stats = $this->documentoRequeridoModel->getDocumentosRequeridosStats();
            
            return $this->response->setJSON([
                'success' => true,
                'message' => 'Estadísticas obtenidas exitosamente',
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en DocumentoRequerido::stats: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener estadísticas: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Reordenar documentos requeridos
     */
    public function reorder()
    {
        try {
            $data = $this->request->getJSON(true);
            
            if (!isset($data['documentos']) || !is_array($data['documentos'])) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Se requiere un array de documentos con IDs'
                ])->setStatusCode(400);
            }

            $success = true;
            $errors = [];

            foreach ($data['documentos'] as $index => $documento) {
                if (!isset($documento['Id'])) {
                    $errors[] = 'Cada documento debe tener Id';
                    $success = false;
                    continue;
                }

                // En la nueva estructura, el orden se maneja por el índice en la lista
                // No hay campo de orden específico, pero podemos actualizar la configuración si es necesario
                $result = $this->documentoRequeridoModel->update($documento['Id'], []);
                
                if (!$result) {
                    $errors[] = "Error al actualizar documento ID {$documento['Id']}";
                    $success = false;
                }
            }

            if ($success) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Documentos reordenados exitosamente'
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al reordenar algunos documentos',
                    'errors' => $errors
                ])->setStatusCode(500);
            }

        } catch (\Exception $e) {
            log_message('error', 'Error en DocumentoRequerido::reorder: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al reordenar documentos: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Duplicar configuración de documentos requeridos
     */
    public function duplicate()
    {
        try {
            $data = $this->request->getJSON(true);
            
            if (!isset($data['source']) || !isset($data['target'])) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Se requieren las configuraciones source y target'
                ])->setStatusCode(400);
            }

            $source = $data['source'];
            $target = $data['target'];

            // Obtener documentos de la configuración fuente
            $documentosFuente = $this->documentoRequeridoModel->getDocumentosRequeridos([
                'IdProcess' => $source['IdProcess'],
                'IdAgency' => $source['IdAgency'],
                'IdCostumerType' => $source['IdCostumerType'],
                'IdOperationType' => $source['IdOperationType']
            ]);

            if (empty($documentosFuente)) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'No hay documentos en la configuración fuente para duplicar'
                ])->setStatusCode(400);
            }

            $duplicados = 0;
            $errors = [];

            foreach ($documentosFuente as $documento) {
                // Verificar si ya existe en la configuración destino
                if ($this->documentoRequeridoModel->existsDocumentoRequerido(
                    $target['IdProcess'], 
                    $target['IdAgency'], 
                    $target['IdCostumerType'], 
                    $target['IdOperationType'], 
                    $documento['IdDocumentType']
                )) {
                    $errors[] = "El documento {$documento['IdDocumentType']} ya existe en la configuración destino";
                    continue;
                }

                // Crear documento duplicado usando el modelo
                $duplicateData = [
                    'IdProcess' => $target['IdProcess'],
                    'IdAgency' => $target['IdAgency'],
                    'IdCostumerType' => $target['IdCostumerType'],
                    'IdOperationType' => $target['IdOperationType'],
                    'IdDocumentType' => $documento['IdDocumentType']
                ];

                $result = $this->documentoRequeridoModel->createDocumentoRequerido($duplicateData);
                if ($result) {
                    $duplicados++;
                } else {
                    $errors[] = "Error al duplicar documento ID {$documento['Id']}";
                }
            }

            if ($duplicados > 0) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => "Se duplicaron {$duplicados} documentos exitosamente",
                    'data' => [
                        'duplicados' => $duplicados,
                        'errors' => $errors
                    ]
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'No se pudo duplicar ningún documento',
                    'errors' => $errors
                ])->setStatusCode(500);
            }

        } catch (\Exception $e) {
            log_message('error', 'Error en DocumentoRequerido::duplicate: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al duplicar configuración: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Validar campos requeridos
     */
    private function validateRequiredFields($data)
    {
        $requiredFields = ['IdProcess', 'IdAgency', 'IdCostumerType', 'IdOperationType', 'IdDocumentType'];
        
        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                return false;
            }
        }
        
        return true;
    }

    /**
     * Obtener ID máximo
     */
    private function getMaxId()
    {
        $result = $this->documentoRequeridoModel->select('MAX(Id) as max_id')->get()->getRow();
        return $result && $result->max_id ? (int)$result->max_id : 0;
    }

    /**
     * Obtener ID del usuario actual
     */
    protected function getCurrentUserId()
    {
        // TODO: Implementar obtención del ID del usuario actual desde la sesión
        return 1; // Por ahora retornar 1 como usuario por defecto
    }
}
