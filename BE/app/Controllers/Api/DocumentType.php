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
            $required = $this->request->getGet('required');
            $reqExpiration = $this->request->getGet('req_expiration');
            $sortBy = $this->request->getGet('sort_by') ?? 'name';
            $sortOrder = $this->request->getGet('sort_order') ?? 'ASC';

            // Validar campos permitidos para ordenamiento (snake_case)
            $allowedSortFields = ['id', 'name', 'enabled', 'registration_date', 'update_date', 'id_last_user_update', 'req_expiration', 'id_sale_type', 'required', 'id_sub_sale_type', 'available_to_client'];
            if (!in_array($sortBy, $allowedSortFields)) {
                $sortBy = 'name';
            }

            // Validar orden
            $sortOrder = strtoupper($sortOrder) === 'DESC' ? 'DESC' : 'ASC';

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
                'required' => $required,
                'req_expiration' => $reqExpiration,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
                'limit' => $limit,
                'offset' => $offset
            ];

            // Obtener tipos de documento con relaciones
            $documentTypes = $this->documentTypeModel->getDocumentTypesWithRelations($filters);

            // Obtener configuraciones para cada tipo de documento
            foreach ($documentTypes as &$docType) {
                try {
                    // Compatibilidad con ambos formatos (id o Id)
                    $docTypeId = $docType['id'] ?? $docType['Id'] ?? null;
                    if ($docTypeId === null) {
                        continue;
                    }
                    
                    $configurations = $this->documentTypeModel->getConfigurationsByDocumentType($docTypeId);
                    $configCount = count($configurations);
                    
                    // Asegurar que configuration_enabled e id_configuration_process_document_type sean enteros (snake_case)
                    foreach ($configurations as &$config) {
                        $config['configuration_enabled'] = (int)($config['configuration_enabled'] ?? $config['ConfigurationEnabled'] ?? 0);
                        $config['id_configuration_process_document_type'] = (int)($config['id_configuration_process_document_type'] ?? $config['Idconfiguration_processDocumentType'] ?? 0);
                    }
                    unset($config); // Liberar referencia
                    
                    $docType['configurations'] = $configurations;
                    $docType['configurationsCount'] = $configCount;
                    
                    // Log para debug si hay diferencia
                    if ($configCount > 0) {
                        $docTypeName = $docType['name'] ?? $docType['Name'] ?? 'N/A';

                    }
                } catch (\Exception $e) {
                    // Si hay un error al obtener configuraciones, continuar con array vacío
                    $docTypeId = $docType['id'] ?? $docType['Id'] ?? 'N/A';

                    $docType['configurations'] = [];
                    $docType['configurationsCount'] = 0;
                }
            }
            unset($docType); // Liberar referencia

            // Contar total de registros
            $total = $this->documentTypeModel->countDocumentTypesWithFilters($filters);

            $protectedId = $this->getProtectedDocumentTypeIdLiquidacion();
            $protectedIds = $protectedId !== null ? [$protectedId] : [];
            foreach ($documentTypes as &$dt) {
                $dt['protected'] = in_array((int)($dt['id'] ?? $dt['Id'] ?? 0), $protectedIds);
            }
            unset($dt);

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Tipos de documento obtenidos exitosamente',
                'data' => [
                    'document_types' => $documentTypes,
                    'protected_document_type_ids' => $protectedIds,
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

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener tipos de documento: ' . $e->getMessage(),
                'error' => [
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'trace' => explode("\n", $e->getTraceAsString())
                ]
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
            
            // Validar datos requeridos (acepta Name o name)
            $name = trim($data['Name'] ?? $data['name'] ?? '');
            if (empty($name)) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El nombre del tipo de documento es requerido'
                ])->setStatusCode(400);
            }

            // Verificar si ya existe un tipo de documento con el mismo nombre
            $existing = $this->documentTypeModel->getDocumentTypeByName($name);
            if ($existing) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Ya existe un tipo de documento con este nombre'
                ])->setStatusCode(400);
            }

            // Generar ID único
            $maxId = $this->getMaxId();
            $newId = $maxId + 1;

            // Preparar datos para insertar (mapear PascalCase del request a snake_case)
            $insertData = [
                'id' => $newId,
                'name' => trim($data['Name'] ?? $data['name'] ?? ''),
                'enabled' => isset($data['Enabled']) ? (int)$data['Enabled'] : (isset($data['enabled']) ? (int)$data['enabled'] : 1),
                'req_expiration' => isset($data['ReqExpiration']) ? (int)$data['ReqExpiration'] : (isset($data['req_expiration']) ? (int)$data['req_expiration'] : 0),
                'id_sale_type' => isset($data['IdProcessType']) ? (int)$data['IdProcessType'] : (isset($data['id_sale_type']) ? (int)$data['id_sale_type'] : 0),
                'required' => isset($data['Required']) ? (int)$data['Required'] : (isset($data['required']) ? (int)$data['required'] : 1),
                'id_sub_sale_type' => $this->normalizeIdSubProcess($data),
                'available_to_client' => isset($data['AvailableToClient']) ? (int)$data['AvailableToClient'] : (isset($data['available_to_client']) ? (int)$data['available_to_client'] : 1),
                'registration_date' => date('Y-m-d H:i:s'),
                'update_date' => null,
                'id_last_user_update' => $this->getCurrentUserId() ?? 0
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

            // Obtener configuraciones donde se usa este tipo de documento
            $configurations = $this->documentTypeModel->getConfigurationsByDocumentType($id);
            // Asegurar que configuration_enabled e id_configuration_process_document_type sean enteros (snake_case)
            foreach ($configurations as &$config) {
                $config['configuration_enabled'] = (int)($config['configuration_enabled'] ?? $config['ConfigurationEnabled'] ?? 0);
                $config['id_configuration_process_document_type'] = (int)($config['id_configuration_process_document_type'] ?? $config['Idconfiguration_processDocumentType'] ?? 0);
            }
            unset($config); // Liberar referencia
            $documentType['configurations'] = $configurations;
            $documentType['configurationsCount'] = count($configurations);

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Tipo de documento obtenido exitosamente',
                'data' => [
                    'document_type' => $documentType
                ]
            ]);

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener tipo de documento: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Obtener ID del tipo de documento de Liquidación desde config (protegido, no editable/eliminable).
     * Retorna null si no está configurado en la tabla config.
     */
    private function getProtectedDocumentTypeIdLiquidacion(): ?int
    {
        try {
            $row = $this->documentTypeModel->db->table('config')
                ->select('config_value')
                ->where('config_key', 'id_document_type_liquidacion')
                ->get()
                ->getRowArray();
            if ($row && !empty(trim($row['config_value'] ?? ''))) {
                return (int) $row['config_value'];
            }
        } catch (\Throwable $e) {
            // Tabla config puede no existir
        }
        return null;
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

            $idInt = (int) $id;
            $protectedId = $this->getProtectedDocumentTypeIdLiquidacion();
            if ($protectedId !== null && $idInt === $protectedId) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El tipo de documento de Liquidación no puede ser editado'
                ])->setStatusCode(403);
            }

            $documentType = $this->documentTypeModel->find($id);
            if (!$documentType) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Tipo de documento no encontrado'
                ])->setStatusCode(404);
            }

            $data = $this->request->getJSON(true);
            
            // Nombre: usar el enviado o el existente (permite actualizaciones parciales)
            $name = trim($data['Name'] ?? $data['name'] ?? '');
            if (empty($name)) {
                $name = trim($documentType['name'] ?? $documentType['Name'] ?? '');
            }
            if (empty($name)) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El nombre del tipo de documento es requerido'
                ])->setStatusCode(400);
            }

            // Verificar si ya existe otro tipo de documento con el mismo nombre
            $existing = $this->documentTypeModel->getDocumentTypeByName($name);
            $existingId = $existing['id'] ?? $existing['Id'] ?? null;
            if ($existing && $existingId != $id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Ya existe un tipo de documento con este nombre'
                ])->setStatusCode(400);
            }

            // Preparar datos para actualizar (snake_case)
            $updateData = [
                'name' => trim($data['Name'] ?? $data['name'] ?? ''),
                'enabled' => isset($data['Enabled']) ? (int)$data['Enabled'] : (isset($data['enabled']) ? (int)$data['enabled'] : ($documentType['enabled'] ?? $documentType['Enabled'] ?? 1)),
                'req_expiration' => isset($data['ReqExpiration']) ? (int)$data['ReqExpiration'] : (isset($data['req_expiration']) ? (int)$data['req_expiration'] : ($documentType['req_expiration'] ?? $documentType['ReqExpiration'] ?? 0)),
                'id_sale_type' => isset($data['IdProcessType']) ? (int)$data['IdProcessType'] : (isset($data['id_sale_type']) ? (int)$data['id_sale_type'] : ($documentType['id_sale_type'] ?? $documentType['IdProcessType'] ?? 0)),
                'required' => isset($data['Required']) ? (int)$data['Required'] : (isset($data['required']) ? (int)$data['required'] : ($documentType['required'] ?? $documentType['Required'] ?? 1)),
                'id_sub_sale_type' => $this->normalizeIdSubProcess($data, $documentType),
                'available_to_client' => isset($data['AvailableToClient']) ? (int)$data['AvailableToClient'] : (isset($data['available_to_client']) ? (int)$data['available_to_client'] : ($documentType['available_to_client'] ?? $documentType['AvailableToClient'] ?? 1)),
                'update_date' => date('Y-m-d H:i:s'),
                'id_last_user_update' => $this->getCurrentUserId() ?? 0
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

            $idInt = (int) $id;
            $protectedId = $this->getProtectedDocumentTypeIdLiquidacion();
            if ($protectedId !== null && $idInt === $protectedId) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El tipo de documento de Liquidación no puede ser eliminado'
                ])->setStatusCode(403);
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

            $idInt = (int) $id;
            $protectedId = $this->getProtectedDocumentTypeIdLiquidacion();
            if ($protectedId !== null && $idInt === $protectedId) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El tipo de documento de Liquidación no puede cambiar de estado'
                ])->setStatusCode(403);
            }

            $documentType = $this->documentTypeModel->find($id);
            if (!$documentType) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Tipo de documento no encontrado'
                ])->setStatusCode(404);
            }

            $newStatus = ($documentType['enabled'] ?? $documentType['Enabled'] ?? 0) == 1 ? 0 : 1;
            $updateData = [
                'enabled' => $newStatus,
                'update_date' => date('Y-m-d H:i:s'),
                'id_last_user_update' => $this->getCurrentUserId() ?? 0
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
                ->like('name', $query)
                ->where('enabled', 1)
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

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error en búsqueda: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/document-type/{id}/configurations
     * Obtener configuraciones donde se usa un tipo de documento específico
     */
    public function getConfigurations($id = null)
    {
        try {
            // Log del ID recibido antes de cualquier procesamiento

            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID del tipo de documento requerido'
                ])->setStatusCode(400);
            }

            // Asegurar que el ID sea un entero
            $documentTypeId = (int)$id;
            
            // Log después de la conversión

            // Verificar que el ID sea válido (mayor a 0)
            if ($documentTypeId <= 0) {

                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID del tipo de documento inválido'
                ])->setStatusCode(400);
            }
            
            // Verificar que el documento exista en la base de datos
            $documentType = $this->documentTypeModel->find($documentTypeId);
            if (!$documentType) {

                // Verificar cuál es el ID máximo en la base de datos
                $maxId = $this->getMaxId();

                return $this->response->setJSON([
                    'success' => false,
                    'message' => "Tipo de documento con ID {$documentTypeId} no encontrado. El ID máximo en la base de datos es {$maxId}."
                ])->setStatusCode(404);
            }

            // Log para debug
            $docTypeName = $documentType['name'] ?? $documentType['Name'] ?? 'N/A';

            $configurations = $this->documentTypeModel->getConfigurationsByDocumentType($documentTypeId);
            
            // Verificar que todas las configuraciones realmente pertenezcan al documento
            $filteredConfigurations = [];
            foreach ($configurations as $config) {
                $configDocTypeId = (int)($config['id_document_type'] ?? $config['IdDocumentType'] ?? 0);
                if ($configDocTypeId === $documentTypeId) {
                    $filteredConfigurations[] = $config;
                } else {

                }
            }
            $configurations = $filteredConfigurations;
            // Asegurar que configuration_enabled e id_configuration_process_document_type sean enteros (snake_case)
            foreach ($configurations as &$config) {
                $config['configuration_enabled'] = (int)($config['configuration_enabled'] ?? $config['ConfigurationEnabled'] ?? 0);
                $config['id_configuration_process_document_type'] = (int)($config['id_configuration_process_document_type'] ?? $config['Idconfiguration_processDocumentType'] ?? 0);
            }
            unset($config); // Liberar referencia

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Configuraciones obtenidas exitosamente',
                'data' => [
                    'document_type' => [
                        'id' => $documentType['id'] ?? $documentType['Id'] ?? null,
                        'name' => $documentType['name'] ?? $documentType['Name'] ?? null
                    ],
                    'configurations' => $configurations,
                    'count' => count($configurations)
                ]
            ]);

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener configuraciones: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * DELETE /api/document-type/{documentTypeId}/configuration/{configurationId}
     * Eliminar un tipo de documento de una configuración específica
     */
    public function deleteConfiguration($documentTypeId = null, $configurationId = null)
    {
        try {
            if (!$documentTypeId || !$configurationId) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID del tipo de documento y ID de la configuración son requeridos'
                ])->setStatusCode(400);
            }

            // Verificar que el tipo de documento existe
            $documentType = $this->documentTypeModel->find($documentTypeId);
            if (!$documentType) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Tipo de documento no encontrado'
                ])->setStatusCode(404);
            }

            // Verificar que la relación existe y pertenece al tipo de documento
            $documentoRequeridoModel = new \App\Models\DocumentoRequeridoModel();
            $relation = $documentoRequeridoModel->find($configurationId);
            
            if (!$relation) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Configuración no encontrada'
                ])->setStatusCode(404);
            }

            if (($relation['id_document_type'] ?? $relation['IdDocumentType'] ?? 0) != $documentTypeId) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'La configuración no pertenece al tipo de documento especificado'
                ])->setStatusCode(400);
            }

            // Eliminar la relación
            $result = $documentoRequeridoModel->delete($configurationId);
            
            if ($result) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Tipo de documento eliminado de la configuración exitosamente'
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al eliminar la configuración'
                ])->setStatusCode(500);
            }

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al eliminar configuración: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/document-type/{id}/configurations-to-add
     * Obtener configuraciones (configuration_process) donde este tipo de documento aún NO está asociado.
     * Sirve para agregar el documento a configuraciones de forma masiva.
     */
    public function getConfigurationsToAdd($documentTypeId = null)
    {
        try {
            $documentTypeId = (int) $documentTypeId;
            if ($documentTypeId <= 0) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID del tipo de documento es requerido'
                ])->setStatusCode(400);
            }
            $doc = $this->documentTypeModel->find($documentTypeId);
            if (!$doc) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Tipo de documento no encontrado'
                ])->setStatusCode(404);
            }
            $db = \Config\Database::connect();
            $sql = "
                SELECT cp.id as id_configuration_process, cp.id_sale_type, p.name as proceso_name,
                       cp.id_agency, a.name as agencia_name, cp.id_customer_type, ct.name as tipo_cliente_name,
                       cp.id_operation_type, ot.name as tipo_operacion_name, cp.enabled
                FROM configuration_process cp
                LEFT JOIN process p ON p.id = cp.id_sale_type
                INNER JOIN agency a ON a.id = cp.id_agency AND a.name IS NOT NULL AND TRIM(a.name) != ''
                LEFT JOIN customer_type ct ON ct.id = cp.id_customer_type
                LEFT JOIN operation_type ot ON ot.id = cp.id_operation_type
                WHERE cp.id NOT IN (
                    SELECT cpd.id_configuration_process
                    FROM configuration_process_document_type cpd
                    WHERE cpd.id_document_type = ?
                )
                ORDER BY p.name, a.name, ct.name, ot.name
            ";
            $query = $db->query($sql, [$documentTypeId]);
            $list = $query->getResultArray();
            return $this->response->setJSON([
                'success' => true,
                'data' => ['configurations' => $list, 'total' => count($list)],
                'message' => 'Configuraciones disponibles para agregar'
            ]);
        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener configuraciones: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * POST /api/document-type/{id}/add-to-configurations
     * Asocia este tipo de documento a las configuraciones indicadas (agregar masivo).
     * Body JSON: { "configurationIds": number[] }
     */
    public function addToConfigurations($documentTypeId = null)
    {
        try {
            $documentTypeId = (int) $documentTypeId;
            if ($documentTypeId <= 0) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID del tipo de documento es requerido'
                ])->setStatusCode(400);
            }
            $doc = $this->documentTypeModel->find($documentTypeId);
            if (!$doc) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Tipo de documento no encontrado'
                ])->setStatusCode(404);
            }
            $json = $this->request->getJSON(true);
            $configurationIds = $json['configurationIds'] ?? [];
            if (!is_array($configurationIds) || empty($configurationIds)) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Se requiere configurationIds (array no vacío)'
                ])->setStatusCode(400);
            }
            $configurationIds = array_map('intval', array_values(array_unique($configurationIds)));
            $documentoRequeridoModel = new \App\Models\DocumentoRequeridoModel();
            $added = 0;
            foreach ($configurationIds as $idConfig) {
                if ($idConfig <= 0) continue;
                $existe = $documentoRequeridoModel->where('id_document_type', $documentTypeId)->where('id_configuration_process', $idConfig)->first();
                if ($existe) continue;
                $documentoRequeridoModel->insert([
                    'id_document_type' => $documentTypeId,
                    'id_configuration_process' => $idConfig
                ]);
                $added++;
            }
            return $this->response->setJSON([
                'success' => true,
                'message' => $added ? "Se agregó el tipo de documento a {$added} configuración(es)." : 'Ninguna configuración nueva agregada.',
                'data' => ['added' => $added]
            ]);
        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al agregar a configuraciones: ' . $e->getMessage()
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
            $enabled = $this->documentTypeModel->where('enabled', 1)->countAllResults();
            $disabled = $this->documentTypeModel->where('enabled', 0)->countAllResults();

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

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener estadísticas: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Normaliza id_sub_sale_type: "Sin sub fase" (null, 0, '') se guarda como NULL en BD.
     * @param array $data Datos del request
     * @param array|null $documentType Registro actual (solo para update, cuando la clave no viene en data)
     */
    private function normalizeIdSubProcess(array $data, ?array $documentType = null): ?int
    {
        $keyExists = array_key_exists('id_sub_sale_type', $data) || array_key_exists('IdSubProcess', $data);
        $val = $data['id_sub_sale_type'] ?? $data['IdSubProcess'] ?? null;
        if (!$keyExists && $documentType !== null) {
            $val = $documentType['id_sub_sale_type'] ?? $documentType['IdSubProcess'] ?? null;
        }
        if ($val === null || $val === '' || $val === '0' || (is_numeric($val) && (int)$val === 0)) {
            return null;
        }
        $int = (int)$val;
        return $int > 0 ? $int : null;
    }

    /**
     * Método auxiliar para obtener el máximo ID
     */
    private function getMaxId()
    {
        $db = \Config\Database::connect();
        $query = $db->query('SELECT MAX(id) as max_id FROM document_type');
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
