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
            $sortBy = $this->request->getGet('sort_by') ?: 'Id';
            $sortOrder = $this->request->getGet('sort_order') ?: 'ASC';

            // Construir filtros (aceptar snake_case y PascalCase para compatibilidad FE/BE)
            $filters = [
                'IdProcess' => $this->request->getGet('id_process') ?? $this->request->getGet('IdProcess'),
                'IdAgency' => $this->request->getGet('id_agency') ?? $this->request->getGet('IdAgency'),
                'IdCustomerType' => $this->request->getGet('id_customer_type') ?? $this->request->getGet('IdCustomerType'),
                'IdOperationType' => $this->request->getGet('id_operation_type') ?? $this->request->getGet('IdOperationType'),
                'IdDocumentType' => $this->request->getGet('id_document_type') ?? $this->request->getGet('IdDocumentType'),
                'Required' => $this->request->getGet('required') !== null ? (int)$this->request->getGet('required') : ($this->request->getGet('Required') !== null ? (int)$this->request->getGet('Required') : null),
                'Enabled' => $this->request->getGet('enabled') !== null ? (int)$this->request->getGet('enabled') : ($this->request->getGet('Enabled') !== null ? (int)$this->request->getGet('Enabled') : null)
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
            log_message('error', 'Error en DocumentoRequerido::index: ' . $e->getMessage());
            log_message('error', 'File: ' . $e->getFile() . ' Line: ' . $e->getLine());
            log_message('error', 'Stack trace: ' . $e->getTraceAsString());
            
            // Log adicional para debugging
            if ($e->getCode() !== 0) {
                log_message('error', 'Error code: ' . $e->getCode());
            }
            
            // Intentar obtener más información del error si es un error de base de datos
            if (method_exists($e, 'getSqlMessage')) {
                log_message('error', 'SQL Error: ' . $e->getSqlMessage());
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
            log_message('info', "DocumentoRequerido::show - ID recibido como parámetro: " . var_export($id, true));
            log_message('info', "DocumentoRequerido::show - Tipo de ID: " . gettype($id));
            log_message('info', "DocumentoRequerido::show - URI completa: " . $this->request->getUri()->getPath());
            log_message('info', "DocumentoRequerido::show - Segmentos URI: " . json_encode($this->request->getUri()->getSegments()));
            
            // Obtener el ID de la URI si no viene como parámetro
            if (!$id || $id === '') {
                // Intentar obtener de los segmentos de la URI usando getSegment
                $uriSegments = $this->request->getUri()->getSegments();
                log_message('info', "DocumentoRequerido::show - Total segmentos: " . count($uriSegments));
                
                // Buscar el segmento después de 'documento-requerido' o 'api/documento-requerido'
                $foundIndex = false;
                foreach ($uriSegments as $index => $segment) {
                    if ($segment === 'documento-requerido' && isset($uriSegments[$index + 1])) {
                        $potentialId = $uriSegments[$index + 1];
                        if (is_numeric($potentialId)) {
                            $id = (int)$potentialId;
                            log_message('info', "DocumentoRequerido::show - ID extraído después de 'documento-requerido': {$id}");
                            break;
                        }
                    }
                }
                
                // Si aún no tenemos ID, intentar desde el último segmento
                if (!$id && !empty($uriSegments)) {
                    $lastSegment = end($uriSegments);
                    if (is_numeric($lastSegment)) {
                        $id = (int)$lastSegment;
                        log_message('info', "DocumentoRequerido::show - ID extraído del último segmento: {$id}");
                    }
                }
            }
            
            if (!$id) {
                log_message('error', "DocumentoRequerido::show - ID no proporcionado");
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID del documento requerido es requerido'
                ])->setStatusCode(400);
            }

            // Convertir a entero para asegurar consistencia
            $id = (int)$id;
            log_message('info', "DocumentoRequerido::show - Buscando documento con ID: {$id}");

            $documento = $this->documentoRequeridoModel->find($id);
            
            if (!$documento) {
                log_message('warning', "DocumentoRequerido::show - Documento con ID {$id} no encontrado");
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Documento requerido no encontrado'
                ])->setStatusCode(404);
            }

            log_message('info', "DocumentoRequerido::show - Documento encontrado: " . json_encode($documento));
            
            return $this->response->setJSON([
                'success' => true,
                'message' => 'Documento requerido obtenido exitosamente',
                'data' => $documento
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en DocumentoRequerido::show: ' . $e->getMessage());
            log_message('error', 'Stack trace: ' . $e->getTraceAsString());
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
                $data['IdCustomerType'], 
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
                    'IdCustomerType' => $data['IdCustomerType'],
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

            $data = $this->request->getJSON(true);
            
            // Log para debug
            log_message('info', "DocumentoRequerido::update - ID: {$id}, Data recibida: " . json_encode($data));
            
            // Verificar si el documento existe y obtenerlo con sus relaciones
            $existingDocumento = $this->documentoRequeridoModel->findWithRelations($id);
            if (!$existingDocumento) {
                log_message('error', "DocumentoRequerido::update - Documento con ID {$id} no encontrado");
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Documento requerido no encontrado'
                ])->setStatusCode(404);
            }
            
            // Log para debug
            log_message('info', "DocumentoRequerido::update - Documento existente: " . json_encode($existingDocumento));

            // Determinar si solo se está actualizando Enabled
            // Si solo viene Enabled, o si todos los demás campos son iguales a los existentes
            $isOnlyEnabledUpdate = false;
            
            // Normalizar valores para comparación (convertir a string para comparación consistente)
            $normalizeValue = function($value) {
                return (string)$value;
            };
            
            if (count($data) === 1 && isset($data['Enabled'])) {
                // Caso 1: Solo viene Enabled en el request
                $isOnlyEnabledUpdate = true;
                log_message('info', "DocumentoRequerido::update - Solo viene Enabled en el request");
            } else {
                // Caso 2: Vienen otros campos, verificar si son iguales a los existentes
                $configFieldsMatch = true;
                
                // Comparar cada campo de configuración (ignorar 'Id' y 'Enabled' del request)
                $configFields = ['IdProcess', 'IdAgency', 'IdCustomerType', 'IdOperationType', 'IdDocumentType'];
                foreach ($configFields as $field) {
                    if (isset($data[$field])) {
                        $requestValue = $normalizeValue($data[$field]);
                        $existingValue = isset($existingDocumento[$field]) ? $normalizeValue($existingDocumento[$field]) : null;
                        
                        if ($requestValue !== $existingValue) {
                            $configFieldsMatch = false;
                            log_message('info', "DocumentoRequerido::update - Campo {$field} difiere: Request={$requestValue}, Existing={$existingValue}");
                            break;
                        }
                    }
                }
                
                // Si los campos de configuración coinciden y viene Enabled, es solo actualización de Enabled
                if ($configFieldsMatch && isset($data['Enabled'])) {
                    $isOnlyEnabledUpdate = true;
                    log_message('info', "DocumentoRequerido::update - Campos de configuración coinciden, solo se actualiza Enabled");
                }
            }
            
            log_message('info', "DocumentoRequerido::update - Es solo actualización de Enabled: " . ($isOnlyEnabledUpdate ? 'Sí' : 'No'));
            
            // Verificar si ya existe otro documento requerido para la misma configuración
            // Solo si se están actualizando los campos de configuración (no solo Enabled)
            if (!$isOnlyEnabledUpdate && isset($data['IdProcess']) && isset($data['IdAgency']) && 
                isset($data['IdCustomerType']) && isset($data['IdOperationType']) && 
                isset($data['IdDocumentType'])) {
                
                // Verificar si los valores realmente están cambiando
                $configChanged = (
                    $normalizeValue($data['IdProcess']) !== $normalizeValue($existingDocumento['IdProcess']) ||
                    $normalizeValue($data['IdAgency']) !== $normalizeValue($existingDocumento['IdAgency']) ||
                    $normalizeValue($data['IdCustomerType']) !== $normalizeValue($existingDocumento['IdCustomerType']) ||
                    $normalizeValue($data['IdOperationType']) !== $normalizeValue($existingDocumento['IdOperationType']) ||
                    $normalizeValue($data['IdDocumentType']) !== $normalizeValue($existingDocumento['IdDocumentType'])
                );
                
                log_message('info', "DocumentoRequerido::update - Configuración cambió: " . ($configChanged ? 'Sí' : 'No'));
                
                // Solo validar duplicados si la configuración realmente está cambiando
                if ($configChanged) {
                    if ($this->documentoRequeridoModel->existsDocumentoRequerido(
                        $data['IdProcess'], 
                        $data['IdAgency'], 
                        $data['IdCustomerType'], 
                        $data['IdOperationType'], 
                        $data['IdDocumentType'],
                        $id
                    )) {
                        log_message('warning', "DocumentoRequerido::update - Ya existe un documento con esta configuración");
                        return $this->response->setJSON([
                            'success' => false,
                            'message' => 'Ya existe un documento requerido para esta configuración'
                        ])->setStatusCode(400);
                    }
                }
            }

            // Si solo se actualiza Enabled, preparar datos mínimos y actualizar directamente configuration_process
            if ($isOnlyEnabledUpdate) {
                $enabledValue = $data['Enabled'] === '1' || $data['Enabled'] === 1 ? 1 : 0;
                log_message('info', "DocumentoRequerido::update - Actualizando solo Enabled a: {$enabledValue}");
                
                // Actualizar directamente el configuration_process relacionado
                $configProcessModel = new \App\Models\configuration_processModel();
                $configProcessId = $existingDocumento['Idconfiguration_process'] ?? null;
                
                if ($configProcessId) {
                    $updateResult = $configProcessModel->update($configProcessId, [
                        'enabled' => $enabledValue,
                        'update_date' => date('Y-m-d H:i:s'),
                        'id_last_user_update' => $this->getCurrentUserId() ?? 0
                    ]);
                    
                    if ($updateResult) {
                        log_message('info', "DocumentoRequerido::update - configuration_process actualizado exitosamente");
                        // Obtener el documento actualizado con relaciones
                        $documentoActualizado = $this->documentoRequeridoModel->getDocumentosRequeridosWithRelations([
                            'Id' => $id
                        ]);
                        
                        return $this->response->setJSON([
                            'success' => true,
                            'message' => 'Estado del documento requerido actualizado exitosamente',
                            'data' => $documentoActualizado[0] ?? $existingDocumento
                        ]);
                    } else {
                        log_message('error', "DocumentoRequerido::update - Error al actualizar configuration_process");
                        return $this->response->setJSON([
                            'success' => false,
                            'message' => 'Error al actualizar el estado'
                        ])->setStatusCode(500);
                    }
                } else {
                    log_message('error', "DocumentoRequerido::update - No se encontró Idconfiguration_process");
                    return $this->response->setJSON([
                        'success' => false,
                        'message' => 'No se encontró la configuración de proceso asociada'
                    ])->setStatusCode(400);
                }
            }
            
            // Si no es solo Enabled, usar el flujo normal de actualización
            $updateData = $data;

            // Actualizar el documento requerido usando el modelo
            $result = $this->documentoRequeridoModel->updateDocumentoRequerido($id, $updateData);
            
            if ($result) {
                // Si se actualizó el estado Enabled, actualizar también el configuration_process
                if (isset($updateData['Enabled'])) {
                    $configProcessModel = new \App\Models\configuration_processModel();
                    $configProcessId = $existingDocumento['Idconfiguration_process'] ?? null;
                    
                    if ($configProcessId) {
                        $configProcessModel->update($configProcessId, [
                            'enabled' => $updateData['Enabled'] === '1' || $updateData['Enabled'] === 1 ? 1 : 0,
                            'update_date' => date('Y-m-d H:i:s'),
                            'id_last_user_update' => $this->getCurrentUserId() ?? 0
                        ]);
                    }
                }
                
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
                'IdCustomerType' => $source['IdCustomerType'],
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
                    $target['IdCustomerType'], 
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
                    'IdCustomerType' => $target['IdCustomerType'],
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
        $requiredFields = ['IdProcess', 'IdAgency', 'IdCustomerType', 'IdOperationType', 'IdDocumentType'];
        
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
