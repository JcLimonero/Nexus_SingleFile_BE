<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

class UserProcess extends BaseController
{
    /**
     * GET /api/user/{userId}/processes
     * Obtener procesos asignados a un usuario
     */
    public function getUserProcesses($userId = null)
    {
        try {
            if (!$userId) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID de usuario requerido'
                ])->setStatusCode(400);
            }

            $db = \Config\Database::connect();
            
            // Obtener procesos asignados al usuario con información del proceso
            $builder = $db->table('process_user pu');
            $processes = $builder
                ->select('pu.id_process, p.name as process_name, p.enabled')
                ->join('process p', 'p.id = pu.id_process', 'inner')
                ->where('pu.id_user', $userId)
                ->orderBy('p.name', 'ASC')
                ->get()
                ->getResultArray();

            // Extraer solo los IDs para la respuesta
            $processIds = array_column($processes, 'id_process');

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Procesos del usuario obtenidos exitosamente',
                'data' => [
                    'processes' => $processIds,
                    'processes_details' => $processes,
                    'count' => count($processes)
                ]
            ]);

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener procesos del usuario: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * POST /api/user/{userId}/processes
     * Asignar procesos a un usuario
     */
    public function assignProcesses($userId = null)
    {
        try {
            if (!$userId) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID de usuario requerido'
                ])->setStatusCode(400);
            }

            $data = $this->request->getJSON(true);
            
            if (!isset($data['processes']) || !is_array($data['processes'])) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Array de procesos requerido'
                ])->setStatusCode(400);
            }

            $db = \Config\Database::connect();

            // Verificar que el usuario existe (snake_case)
            $userExists = $db->table('user')->where('id', $userId)->countAllResults() > 0;
            if (!$userExists) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Usuario no encontrado'
                ])->setStatusCode(404);
            }

            // Iniciar transacción
            $db->transStart();

            // Eliminar todas las asignaciones existentes del usuario (snake_case)
            $db->table('process_user')->where('id_user', $userId)->delete();

            // Insertar las nuevas asignaciones
            $insertData = [];
            foreach ($data['processes'] as $processId) {
                $processExists = $db->table('process')->where('id', $processId)->countAllResults() > 0;
                if ($processExists) {
                    $insertData[] = [
                        'id_user' => $userId,
                        'id_process' => $processId
                    ];
                }
            }

            if (!empty($insertData)) {
                $db->table('process_user')->insertBatch($insertData);
            }

            // Completar transacción
            $db->transComplete();

            if ($db->transStatus() === false) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al asignar procesos'
                ])->setStatusCode(500);
            }

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Procesos asignados exitosamente',
                'data' => [
                    'user_id' => $userId,
                    'assigned_processes' => count($insertData)
                ]
            ]);

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al asignar procesos: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * DELETE /api/user/{userId}/processes/{processId}
     * Remover un proceso específico de un usuario
     */
    public function removeProcess($userId = null, $processId = null)
    {
        try {
            if (!$userId || !$processId) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID de usuario y proceso requeridos'
                ])->setStatusCode(400);
            }

            $db = \Config\Database::connect();

            // Verificar que la asignación existe (snake_case)
            $exists = $db->table('process_user')
                ->where('id_user', $userId)
                ->where('id_process', $processId)
                ->countAllResults() > 0;

            if (!$exists) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Asignación no encontrada'
                ])->setStatusCode(404);
            }

            // Eliminar la asignación
            $deleted = $db->table('process_user')
                ->where('id_user', $userId)
                ->where('id_process', $processId)
                ->delete();

            if ($deleted) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Proceso removido exitosamente'
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al remover proceso'
                ])->setStatusCode(500);
            }

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al remover proceso: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * DELETE /api/user/{userId}/processes
     * Remover todos los procesos de un usuario
     */
    public function removeAllProcesses($userId = null)
    {
        try {
            if (!$userId) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID de usuario requerido'
                ])->setStatusCode(400);
            }

            $db = \Config\Database::connect();

            // Eliminar todas las asignaciones del usuario
            $deleted = $db->table('process_user')->where('id_user', $userId)->delete();

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Todos los procesos removidos exitosamente',
                'data' => [
                    'user_id' => $userId,
                    'removed_count' => $db->affectedRows()
                ]
            ]);

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al remover procesos: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/user/{userId}/processes/stats
     * Obtener estadísticas de procesos asignados a un usuario
     */
    public function getStats($userId = null)
    {
        try {
            if (!$userId) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID de usuario requerido'
                ])->setStatusCode(400);
            }

            $db = \Config\Database::connect();

            // Contar procesos asignados (snake_case)
            $totalAssigned = $db->table('process_user')->where('id_user', $userId)->countAllResults();
            
            // Contar procesos activos asignados
            $activeAssigned = $db->table('process_user pu')
                ->join('process p', 'p.id = pu.id_process', 'inner')
                ->where('pu.id_user', $userId)
                ->where('p.enabled', 1)
                ->countAllResults();

            // Contar total de procesos disponibles
            $totalAvailable = $db->table('process')->countAllResults();
            $activeAvailable = $db->table('process')->where('enabled', 1)->countAllResults();

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Estadísticas obtenidas exitosamente',
                'data' => [
                    'user_id' => $userId,
                    'assigned' => [
                        'total' => $totalAssigned,
                        'active' => $activeAssigned,
                        'inactive' => $totalAssigned - $activeAssigned
                    ],
                    'available' => [
                        'total' => $totalAvailable,
                        'active' => $activeAvailable,
                        'inactive' => $totalAvailable - $activeAvailable
                    ],
                    'coverage_percentage' => $totalAvailable > 0 ? round(($totalAssigned / $totalAvailable) * 100, 2) : 0
                ]
            ]);

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener estadísticas: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }
}

