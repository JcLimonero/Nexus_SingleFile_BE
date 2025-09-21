<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\FileExtraordinaryReasonModel;

class FileExtraordinaryReason extends ResourceController
{
    protected $fileExtraordinaryReasonModel;

    public function __construct()
    {
        $this->fileExtraordinaryReasonModel = new FileExtraordinaryReasonModel();
    }

    /**
     * GET /api/file-extraordinary-reason
     * Obtener todos los motivos extraordinarios con filtros y paginación
     */
    public function index()
    {
        try {
            $filters = [
                'search' => $this->request->getGet('search'),
                'id_type_reason' => $this->request->getGet('id_type_reason'),
                'sort_by' => $this->request->getGet('sort_by'),
                'sort_order' => $this->request->getGet('sort_order'),
                'limit' => $this->request->getGet('limit'),
                'offset' => $this->request->getGet('offset')
            ];

            $motivos = $this->fileExtraordinaryReasonModel->getFileExtraordinaryReasonsWithFilters($filters);
            $total = $this->fileExtraordinaryReasonModel->countFileExtraordinaryReasonsWithFilters($filters);

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Motivos extraordinarios obtenidos exitosamente',
                'data' => [
                    'file_extraordinary_reasons' => $motivos,
                    'total' => $total
                ]
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en FileExtraordinaryReason::index: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener los motivos extraordinarios: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * POST /api/file-extraordinary-reason
     * Crear un nuevo motivo extraordinario
     */
    public function create()
    {
        error_log('=== INICIO DEL MÉTODO CREATE ===');
        try {
            $data = $this->request->getJSON(true);
            
            // Debug: Log de los datos recibidos
            error_log('Datos recibidos en create: ' . json_encode($data));
            
            // Validar datos requeridos
            if (empty($data['Name'])) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El nombre del motivo es requerido'
                ])->setStatusCode(400);
            }
            
            // Formatear nombre a mayúsculas y minúsculas
            $data['Name'] = $this->formatName($data['Name']);
            
            // Validar IdTypeReason
            if (!isset($data['IdTypeReason']) || !in_array($data['IdTypeReason'], [1, 2])) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El tipo de razón debe ser 1 (Cancelación) o 2 (Excepción)'
                ])->setStatusCode(400);
            }

            // Verificar si ya existe un motivo con el mismo nombre
            $existingReason = $this->fileExtraordinaryReasonModel->getFileExtraordinaryReasonByName($data['Name']);
            if ($existingReason) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Ya existe un motivo con este nombre'
                ])->setStatusCode(400);
            }

            // Generar ID único manualmente (ya que la tabla no tiene AUTO_INCREMENT)
            $maxId = $this->fileExtraordinaryReasonModel->select('Id')->orderBy('Id', 'DESC')->first();
            $data['Id'] = ($maxId ? $maxId['Id'] : 0) + 1;
            
            error_log('Max ID encontrado: ' . ($maxId ? $maxId['Id'] : 'NULL'));
            error_log('Nuevo ID generado: ' . $data['Id']);
            error_log('Tipo de ID: ' . gettype($data['Id']));
            
            // Establecer valores por defecto
            $data['Enabled'] = (int)($data['Enabled'] ?? 1);
            $data['IdTypeReason'] = (int)$data['IdTypeReason'];
            $data['RegistrationDate'] = date('Y-m-d H:i:s');
            $data['UpdateDate'] = date('Y-m-d H:i:s');
            $data['IdLastUserUpdate'] = (int)($data['IdLastUserUpdate'] ?? 0);
            
            error_log('Datos preparados para inserción: ' . json_encode($data));
            
            // Insertar el nuevo motivo con ID generado manualmente
            $result = $this->fileExtraordinaryReasonModel->insert($data);
            
            error_log('Resultado de inserción: ' . json_encode($result));
            
            if ($result) {
                error_log('Inserción exitosa, preparando respuesta');
                
                $responseData = [
                    'success' => true,
                    'message' => 'Motivo extraordinario creado exitosamente',
                    'data' => [
                        'id' => $data['Id'] ?? 'No definido',
                        'name' => $data['Name'] ?? 'No definido',
                        'id_type_reason' => $data['IdTypeReason'] ?? 0
                    ]
                ];
                
                error_log('Respuesta preparada: ' . json_encode($responseData));
                
                return $this->response->setJSON($responseData)->setStatusCode(201);
            } else {
                // Obtener el último error de la base de datos
                $dbError = $this->db->error();
                $errorMessage = 'Error al crear el motivo extraordinario';
                
                if (!empty($dbError['message'])) {
                    $errorMessage .= ': ' . $dbError['message'];
                }
                
                return $this->response->setJSON([
                    'success' => false,
                    'message' => $errorMessage,
                    'debug_info' => [
                        'db_error' => $dbError,
                        'data_sent' => $data,
                        'insert_result' => $result
                    ]
                ])->setStatusCode(500);
            }

        } catch (\Exception $e) {
            error_log('Error en FileExtraordinaryReason::create: ' . $e->getMessage());
            error_log('Stack trace: ' . $e->getTraceAsString());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'debug_info' => [
                    'exception_message' => $e->getMessage(),
                    'exception_file' => $e->getFile(),
                    'exception_line' => $e->getLine(),
                    'stack_trace' => $e->getTraceAsString()
                ]
            ])->setStatusCode(500);
        }
    }
    
    /**
     * GET /api/file-extraordinary-reason/:id
     * Obtener un motivo extraordinario específico
     */
    public function show($id = null)
    {
        try {
            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID del motivo extraordinario requerido'
                ])->setStatusCode(400);
            }

            $fileExtraordinaryReason = $this->fileExtraordinaryReasonModel->find($id);
            
            if (!$fileExtraordinaryReason) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Motivo extraordinario no encontrado'
                ])->setStatusCode(404);
            }

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Motivo extraordinario obtenido exitosamente',
                'data' => $fileExtraordinaryReason
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en FileExtraordinaryReason::show: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener el motivo extraordinario: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }
    
    /**
     * PUT /api/file-extraordinary-reason/:id
     * Actualizar un motivo extraordinario existente
     */
    public function update($id = null)
    {
        try {
            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID del motivo extraordinario requerido'
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
            
            // Formatear nombre a mayúsculas y minúsculas
            $data['Name'] = $this->formatName($data['Name']);

            // Verificar si existe el motivo
            $existingReason = $this->fileExtraordinaryReasonModel->find($id);
            if (!$existingReason) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Motivo extraordinario no encontrado'
                ])->setStatusCode(404);
            }

            // Verificar si ya existe otro motivo con el mismo nombre
            $duplicateReason = $this->fileExtraordinaryReasonModel->where('Name', $data['Name'])
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
            
            // Actualizar el motivo
            $result = $this->fileExtraordinaryReasonModel->update($id, $data);
            
            if ($result) {
                // Obtener el motivo actualizado para devolver todos los campos
                $updatedReason = $this->fileExtraordinaryReasonModel->find($id);
                
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Motivo extraordinario actualizado exitosamente',
                    'data' => $updatedReason
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al actualizar el motivo extraordinario'
                ])->setStatusCode(500);
            }

        } catch (\Exception $e) {
            log_message('error', 'Error en FileExtraordinaryReason::update: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }
    
    /**
     * DELETE /api/file-extraordinary-reason/:id
     * Eliminar un motivo extraordinario
     */
    public function delete($id = null)
    {
        try {
            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID del motivo extraordinario requerido'
                ])->setStatusCode(400);
            }

            // Verificar si existe el motivo extraordinario
            $existingReason = $this->fileExtraordinaryReasonModel->find($id);
            if (!$existingReason) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Motivo extraordinario no encontrado'
                ])->setStatusCode(404);
            }

            // Eliminar el motivo extraordinario
            $result = $this->fileExtraordinaryReasonModel->delete($id);
            
            if ($result) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Motivo extraordinario eliminado exitosamente',
                    'data' => [
                        'id' => $id,
                        'name' => $existingReason['Name']
                    ]
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al eliminar el motivo extraordinario'
                ])->setStatusCode(500);
            }

        } catch (\Exception $e) {
            log_message('error', 'Error en FileExtraordinaryReason::delete: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/file-extraordinary-reason/search
     * Buscar motivos extraordinarios
     */
    public function search()
    {
        try {
            $query = $this->request->getGet('q');
            $limit = $this->request->getGet('limit') ?? 10;

            if (empty($query)) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Término de búsqueda requerido'
                ])->setStatusCode(400);
            }

            $results = $this->fileExtraordinaryReasonModel->searchFileExtraordinaryReasons($query, $limit);

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Búsqueda realizada exitosamente',
                'data' => $results
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en FileExtraordinaryReason::search: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error en la búsqueda: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/file-extraordinary-reason/stats
     * Obtener estadísticas de motivos extraordinarios
     */
    public function stats()
    {
        try {
            $stats = $this->fileExtraordinaryReasonModel->getFileExtraordinaryReasonStats();

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Estadísticas obtenidas exitosamente',
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en FileExtraordinaryReason::stats: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener estadísticas: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/file-extraordinary-reason/active
     * Obtener motivos extraordinarios activos
     */
    public function active()
    {
        try {
            $activeReasons = $this->fileExtraordinaryReasonModel->getActiveFileExtraordinaryReasons();

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Motivos extraordinarios activos obtenidos exitosamente',
                'data' => $activeReasons
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en FileExtraordinaryReason::active: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener motivos activos: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * PATCH /api/file-extraordinary-reason/:id/toggle-status
     * Cambiar estado del motivo extraordinario
     */
    public function toggleStatus($id = null)
    {
        try {
            if (!$id) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID del motivo extraordinario requerido'
                ])->setStatusCode(400);
            }

            $result = $this->fileExtraordinaryReasonModel->toggleStatus($id);
            
            if ($result) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Estado del motivo extraordinario cambiado exitosamente'
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al cambiar el estado del motivo extraordinario'
                ])->setStatusCode(500);
            }

        } catch (\Exception $e) {
            log_message('error', 'Error en FileExtraordinaryReason::toggleStatus: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Generar ID único
     */
    private function generateUniqueId()
    {
        return time() . rand(1000, 9999);
    }
    
    /**
     * Formatear nombre a mayúsculas y minúsculas
     * Ejemplo: "hola mundo" -> "Hola Mundo"
     */
    private function formatName($name) {
        if (empty($name)) return $name;
        
        // Convertir a minúsculas y luego capitalizar cada palabra
        return ucwords(strtolower(trim($name)));
    }
}
