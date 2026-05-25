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
            $limitParam = $this->request->getGet('limit');
            if ($limitParam === 'all' || $limitParam === null || $limitParam === '') {
                $limit = null;
            } else {
                $limit = (int)$limitParam;
                if ($limit <= 0) {
                    $limit = null;
                }
            }
            $offset = $this->request->getGet('offset') ? (int)$this->request->getGet('offset') : 0;
            $sortBy = $this->request->getGet('sort_by') ?: 'id';
            $sortOrder = $this->request->getGet('sort_order') ?: 'ASC';

            $filters = [
                'id_sale_type' => $this->request->getGet('id_sale_type'),
                'id_agency' => $this->request->getGet('id_agency'),
                'id_company' => $this->request->getGet('id_company'),
                'id_customer_type' => $this->request->getGet('id_customer_type'),
                'id_operation_type' => $this->request->getGet('id_operation_type'),
                'id_document_type' => $this->request->getGet('id_document_type'),
                'required' => $this->request->getGet('required') !== null ? (int)$this->request->getGet('required') : null,
                'enabled' => $this->request->getGet('enabled') !== null ? (int)$this->request->getGet('enabled') : null
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
                    'limit' => $limit ?? 'all',
                    'offset' => $offset,
                    'count' => count($documentos)
                ]
            ]);

        } catch (\Exception $e) {

            // Log adicional para debugging
            if ($e->getCode() !== 0) {

            }
            
            // Intentar obtener más información del error si es un error de base de datos
            if (method_exists($e, 'getSqlMessage')) {

            }
            
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener documentos requeridos: ' . $e->getMessage(),
                'error_details' => [
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'code' => $e->getCode()
                ]
            ])->setStatusCode(500);
        }
    }

    /**
     * Obtener un documento requerido por ID
     */
    public function show($id = null)
    {
        try {
            // Log para debug

            // Obtener el ID de la URI si no viene como parámetro
            if (!$id || $id === '') {
                // Intentar obtener de los segmentos de la URI usando getSegment
                $uriSegments = $this->request->getUri()->getSegments();

                // Buscar el segmento después de 'documento-requerido' o 'api/documento-requerido'
                $foundIndex = false;
                foreach ($uriSegments as $index => $segment) {
                    if ($segment === 'documento-requerido' && isset($uriSegments[$index + 1])) {
                        $potentialId = $uriSegments[$index + 1];
                        if (is_numeric($potentialId)) {
                            $id = (int)$potentialId;

                            break;
                        }
                    }
                }
                
                // Si aún no tenemos ID, intentar desde el último segmento
                if (!$id && !empty($uriSegments)) {
                    $lastSegment = end($uriSegments);
                    if (is_numeric($lastSegment)) {
                        $id = (int)$lastSegment;

                    }
                }
            }
            
            if (!$id) {

                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID del documento requerido es requerido'
                ])->setStatusCode(400);
            }

            // Convertir a entero para asegurar consistencia
            $id = (int)$id;

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
            
            if (!$this->validateRequiredFields($data)) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Todos los campos requeridos deben estar presentes'
                ])->setStatusCode(400);
            }

            if ($this->documentoRequeridoModel->existsDocumentoRequerido(
                $data['id_sale_type'], 
                $data['id_agency'], 
                $data['id_customer_type'], 
                $data['id_operation_type'], 
                $data['id_document_type']
            )) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Ya existe un documento requerido para esta configuración'
                ])->setStatusCode(400);
            }

            $userId = $this->getCurrentUserId();
            if (!$userId) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Autenticación requerida para realizar esta acción'
                ])->setStatusCode(401);
            }
            $data['id_last_user_update'] = $userId;
            $result = $this->documentoRequeridoModel->createDocumentoRequerido($data);
            
            if ($result) {
                $documentoCreado = $this->documentoRequeridoModel->getDocumentosRequeridosWithRelations([
                    'id_sale_type' => $data['id_sale_type'],
                    'id_agency' => $data['id_agency'],
                    'id_customer_type' => $data['id_customer_type'],
                    'id_operation_type' => $data['id_operation_type']
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
            // Obtener el ID de la URI si no viene como parámetro (similar a show)
            if (!$id) {
                $uriSegments = $this->request->getUri()->getSegments();
                foreach ($uriSegments as $index => $segment) {
                    if ($segment === 'documento-requerido' && isset($uriSegments[$index + 1])) {
                        $potentialId = $uriSegments[$index + 1];
                        if (is_numeric($potentialId)) {
                            $id = (int)$potentialId;
                            break;
                        }
                    }
                }
                if (!$id && !empty($uriSegments)) {
                    $lastSegment = end($uriSegments);
                    if (is_numeric($lastSegment)) {
                        $id = (int)$lastSegment;
                    }
                }
            }
            
            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID del documento requerido es requerido'
                ])->setStatusCode(400);
            }

            $userId = $this->getCurrentUserId();
            if (!$userId) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Autenticación requerida para realizar esta acción'
                ])->setStatusCode(401);
            }

            $data = $this->request->getJSON(true);
            
            // Log para debug

            // Verificar si el documento existe y obtenerlo con sus relaciones
            $existingDocumento = $this->documentoRequeridoModel->findWithRelations($id);
            if (!$existingDocumento) {

                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Documento requerido no encontrado'
                ])->setStatusCode(404);
            }
            
            // Log para debug

            // Determinar si solo se está actualizando Enabled
            // Si solo viene Enabled, o si todos los demás campos son iguales a los existentes
            $isOnlyEnabledUpdate = false;
            
            // Normalizar valores para comparación (convertir a string para comparación consistente)
            $normalizeValue = function($value) {
                return (string)$value;
            };
            
            if (count($data) === 1 && isset($data['enabled'])) {
                $isOnlyEnabledUpdate = true;
            } else {
                $configFieldsMatch = true;
                $configFields = ['id_sale_type', 'id_agency', 'id_customer_type', 'id_operation_type', 'id_document_type'];
                foreach ($configFields as $field) {
                    if (isset($data[$field])) {
                        $requestValue = $normalizeValue($data[$field]);
                        $existingValue = isset($existingDocumento[$field]) ? $normalizeValue($existingDocumento[$field]) : null;
                        if ($requestValue !== $existingValue) {
                            $configFieldsMatch = false;
                            break;
                        }
                    }
                }
                if ($configFieldsMatch && isset($data['enabled'])) {
                    $isOnlyEnabledUpdate = true;
                }
            }

            if (!$isOnlyEnabledUpdate && isset($data['id_sale_type']) && isset($data['id_agency']) && 
                isset($data['id_customer_type']) && isset($data['id_operation_type']) && 
                isset($data['id_document_type'])) {
                
                $configChanged = (
                    $normalizeValue($data['id_sale_type']) !== $normalizeValue($existingDocumento['id_sale_type'] ?? '') ||
                    $normalizeValue($data['id_agency']) !== $normalizeValue($existingDocumento['id_agency'] ?? '') ||
                    $normalizeValue($data['id_customer_type']) !== $normalizeValue($existingDocumento['id_customer_type'] ?? '') ||
                    $normalizeValue($data['id_operation_type']) !== $normalizeValue($existingDocumento['id_operation_type'] ?? '') ||
                    $normalizeValue($data['id_document_type']) !== $normalizeValue($existingDocumento['id_document_type'] ?? '')
                );
                
                if ($configChanged) {
                    if ($this->documentoRequeridoModel->existsDocumentoRequerido(
                        $data['id_sale_type'], 
                        $data['id_agency'], 
                        $data['id_customer_type'], 
                        $data['id_operation_type'], 
                        $data['id_document_type'],
                        $id
                    )) {

                        return $this->response->setJSON([
                            'success' => false,
                            'message' => 'Ya existe un documento requerido para esta configuración'
                        ])->setStatusCode(400);
                    }
                }
            }

            // Si solo se actualiza Enabled, preparar datos mínimos y actualizar directamente configuration_process
            if ($isOnlyEnabledUpdate) {
                $enabledValue = $data['enabled'] === '1' || $data['enabled'] === 1 ? 1 : 0;
                
                $configProcessModel = new \App\Models\ConfigurationProcessModel();
                $configProcessId = $existingDocumento['id_configuration_process'] ?? null;
                
                if ($configProcessId) {
                    $updateResult = $configProcessModel->update($configProcessId, [
                        'enabled' => $enabledValue,
                        'update_date' => date('Y-m-d H:i:s'),
                        'id_last_user_update' => $userId
                    ]);
                    
                    if ($updateResult) {

                        // Obtener el documento actualizado con relaciones
                        $documentoActualizado = $this->documentoRequeridoModel->getDocumentosRequeridosWithRelations([
                            'id' => $id
                        ]);
                        
                        return $this->response->setJSON([
                            'success' => true,
                            'message' => 'Estado del documento requerido actualizado exitosamente',
                            'data' => $documentoActualizado[0] ?? $existingDocumento
                        ]);
                    } else {

                        return $this->response->setJSON([
                            'success' => false,
                            'message' => 'Error al actualizar el estado'
                        ])->setStatusCode(500);
                    }
                } else {

                    return $this->response->setJSON([
                        'success' => false,
                        'message' => 'No se encontró la configuración de proceso asociada'
                    ])->setStatusCode(400);
                }
            }
            
            $updateData = $data;
            $updateData['id_last_user_update'] = $userId;

            $result = $this->documentoRequeridoModel->updateDocumentoRequerido($id, $updateData);
            
            if ($result) {
                // Si se actualizó el estado Enabled, actualizar también el configuration_process
                if (isset($updateData['enabled'])) {
                    $configProcessModel = new \App\Models\ConfigurationProcessModel();
                    $configProcessId = $existingDocumento['id_configuration_process'] ?? null;
                    
                    if ($configProcessId) {
                        $configProcessModel->update($configProcessId, [
                            'enabled' => $updateData['enabled'] === '1' || $updateData['enabled'] === 1 ? 1 : 0,
                            'update_date' => date('Y-m-d H:i:s'),
                            'id_last_user_update' => $userId
                        ]);
                    }
                }
                
                // Obtener el documento actualizado con relaciones
                $documentoActualizado = $this->documentoRequeridoModel->getDocumentosRequeridosWithRelations([
                    'id' => $id
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
                $docId = $documento['id'] ?? null;
                if (!$docId) {
                    $errors[] = 'Cada documento debe tener id';
                    $success = false;
                    continue;
                }

                $result = $this->documentoRequeridoModel->update($docId, []);
                
                if (!$result) {
                    $errors[] = "Error al actualizar documento ID {$docId}";
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

            $sourceFilters = [
                'id_sale_type' => $source['id_sale_type'] ?? null,
                'id_agency' => $source['id_agency'] ?? null,
                'id_customer_type' => $source['id_customer_type'] ?? null,
                'id_operation_type' => $source['id_operation_type'] ?? null
            ];
            $sourceFilters = array_filter($sourceFilters);
            $documentosFuente = $this->documentoRequeridoModel->getDocumentosRequeridos($sourceFilters);

            if (empty($documentosFuente)) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'No hay documentos en la configuración fuente para duplicar'
                ])->setStatusCode(400);
            }

            $targetProcess = $target['id_sale_type'] ?? null;
            $targetAgency = $target['id_agency'] ?? null;
            $targetCustomerType = $target['id_customer_type'] ?? null;
            $targetOperationType = $target['id_operation_type'] ?? null;

            $duplicados = 0;
            $errors = [];

            foreach ($documentosFuente as $documento) {
                $idDocType = $documento['id_document_type'] ?? null;
                if ($this->documentoRequeridoModel->existsDocumentoRequerido(
                    $targetProcess, 
                    $targetAgency, 
                    $targetCustomerType, 
                    $targetOperationType, 
                    $idDocType
                )) {
                    $errors[] = "El documento {$idDocType} ya existe en la configuración destino";
                    continue;
                }

                $duplicateData = [
                    'id_sale_type' => $targetProcess,
                    'id_agency' => $targetAgency,
                    'id_customer_type' => $targetCustomerType,
                    'id_operation_type' => $targetOperationType,
                    'id_document_type' => $idDocType
                ];

                $result = $this->documentoRequeridoModel->createDocumentoRequerido($duplicateData);
                if ($result) {
                    $duplicados++;
                } else {
                    $docId = $documento['id'] ?? '?';
                    $errors[] = "Error al duplicar documento ID {$docId}";
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

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al duplicar configuración: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    private function validateRequiredFields($data)
    {
        $required = ['id_sale_type', 'id_agency', 'id_customer_type', 'id_operation_type', 'id_document_type'];
        foreach ($required as $field) {
            if (!isset($data[$field]) || $data[$field] === '' || $data[$field] === null) {
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
        $result = $this->documentoRequeridoModel->select('MAX(id) as max_id')->get()->getRow();
        return $result && $result->max_id ? (int)$result->max_id : 0;
    }

}
