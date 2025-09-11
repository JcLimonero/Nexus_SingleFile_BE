<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\UserActivityLogModel;
use CodeIgniter\HTTP\ResponseInterface;

class UserActivityLog extends BaseController
{
    protected $userActivityLogModel;

    public function __construct()
    {
        $this->userActivityLogModel = new UserActivityLogModel();
    }

    /**
     * GET /api/user-activity-logs
     * Obtener todos los logs con filtros
     */
    public function index()
    {
        try {
            $filters = [
                'user_id' => $this->request->getGet('user_id'),
                'action' => $this->request->getGet('action'),
                'start_date' => $this->request->getGet('start_date'),
                'end_date' => $this->request->getGet('end_date'),
                'change_details' => $this->request->getGet('change_details'),
            ];

            $limit = (int) $this->request->getGet('limit') ?: 100;
            $offset = (int) $this->request->getGet('offset') ?: 0;

            // Limitar el máximo de registros por petición
            if ($limit > 1000) {
                $limit = 1000;
            }

            $logs = $this->userActivityLogModel->getAllLogs($limit, $offset, $filters);
            $total = $this->userActivityLogModel->countLogsWithFilters($filters);

            return $this->response->setJSON([
                'success' => true,
                'data' => $logs,
                'pagination' => [
                    'total' => $total,
                    'limit' => $limit,
                    'offset' => $offset,
                    'has_more' => $total > ($offset + $limit)
                ]
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en UserActivityLog::index: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener los logs de actividad',
                'error' => $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/user-activity-logs/user/{userId}
     * Obtener logs de un usuario específico
     */
    public function getUserLogs($userId = null)
    {
        try {
            if (!$userId) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID de usuario requerido'
                ])->setStatusCode(400);
            }

            $limit = (int) $this->request->getGet('limit') ?: 100;
            $offset = (int) $this->request->getGet('offset') ?: 0;

            $logs = $this->userActivityLogModel->getLogsByUser($userId, $limit, $offset);

            return $this->response->setJSON([
                'success' => true,
                'data' => $logs,
                'user_id' => $userId
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en UserActivityLog::getUserLogs: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener los logs del usuario',
                'error' => $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/user-activity-logs/action/{action}
     * Obtener logs por acción específica
     */
    public function getActionLogs($action = null)
    {
        try {
            if (!$action) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Acción requerida'
                ])->setStatusCode(400);
            }

            $limit = (int) $this->request->getGet('limit') ?: 100;
            $offset = (int) $this->request->getGet('offset') ?: 0;

            $logs = $this->userActivityLogModel->getLogsByAction($action, $limit, $offset);

            return $this->response->setJSON([
                'success' => true,
                'data' => $logs,
                'action' => $action
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en UserActivityLog::getActionLogs: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener los logs de la acción',
                'error' => $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/user-activity-logs/stats
     * Obtener estadísticas de logs
     */
    public function getStats()
    {
        try {
            $userId = $this->request->getGet('user_id');
            $startDate = $this->request->getGet('start_date');
            $endDate = $this->request->getGet('end_date');

            $stats = $this->userActivityLogModel->getLogStats($userId, $startDate, $endDate);

            return $this->response->setJSON([
                'success' => true,
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en UserActivityLog::getStats: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener las estadísticas',
                'error' => $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * POST /api/user-activity-logs
     * Crear un nuevo log de actividad
     */
    public function create()
    {
        try {
            $data = $this->request->getJSON(true);

            // Validar datos requeridos
            if (empty($data['user_id']) || empty($data['username']) || empty($data['action'])) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'user_id, username y action son requeridos'
                ])->setStatusCode(400);
            }

            // Solo guardar los campos esenciales
            // Los campos técnicos como IP, URL, método, etc. se han removido

            $logId = $this->userActivityLogModel->createLog($data);

            if ($logId) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Log de actividad creado exitosamente',
                    'data' => ['id' => $logId]
                ])->setStatusCode(201);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al crear el log de actividad'
                ])->setStatusCode(500);
            }

        } catch (\Exception $e) {
            log_message('error', 'Error en UserActivityLog::create: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al crear el log de actividad',
                'error' => $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * DELETE /api/user-activity-logs/clean
     * Limpiar logs antiguos
     */
    public function cleanOldLogs()
    {
        try {
            $days = (int) $this->request->getGet('days') ?: 90;
            
            if ($days < 30) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'No se pueden eliminar logs de menos de 30 días'
                ])->setStatusCode(400);
            }

            $deletedCount = $this->userActivityLogModel->cleanOldLogs($days);

            return $this->response->setJSON([
                'success' => true,
                'message' => "Se eliminaron {$deletedCount} logs antiguos (más de {$days} días)",
                'deleted_count' => $deletedCount
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en UserActivityLog::cleanOldLogs: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al limpiar logs antiguos',
                'error' => $e->getMessage()
            ])->setStatusCode(500);
        }
    }
}
