<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

class UserAccess extends BaseController
{
    /**
     * GET /api/user/{userId}/access
     * Obtener todos los accesos de un usuario (agencias y procesos)
     */
    public function getUserAccess($userId = null)
    {
        try {
            if (!$userId) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID de usuario requerido'
                ])->setStatusCode(400);
            }

            $db = \Config\Database::connect();

            // Obtener agencias asignadas (snake_case)
            $agencies = $db->table('agency_user au')
                ->select('au.id_agency, a.name as agency_name, a.enabled')
                ->join('agency a', 'a.id = au.id_agency', 'inner')
                ->where('au.id_user', $userId)
                ->orderBy('a.name', 'ASC')
                ->get()
                ->getResultArray();

            // Obtener procesos asignados (snake_case)
            $processes = $db->table('process_user pu')
                ->select('pu.id_sale_type, p.name as process_name, p.enabled')
                ->join('sale_type p', 'p.id = pu.id_sale_type', 'inner')
                ->where('pu.id_user', $userId)
                ->orderBy('p.name', 'ASC')
                ->get()
                ->getResultArray();

            // Extraer IDs
            $agencyIds = array_column($agencies, 'id_agency');
            $processIds = array_column($processes, 'id_sale_type');

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Accesos del usuario obtenidos exitosamente',
                'data' => [
                    'agencies' => $agencyIds,
                    'processes' => $processIds,
                    'agencies_details' => $agencies,
                    'processes_details' => $processes,
                    'summary' => [
                        'total_agencies' => count($agencies),
                        'total_processes' => count($processes),
                        'active_agencies' => count(array_filter($agencies, fn($a) => ($a['enabled'] ?? $a['Enabled'] ?? 0) == 1)),
                        'active_processes' => count(array_filter($processes, fn($p) => ($p['enabled'] ?? $p['Enabled'] ?? 0) == 1))
                    ]
                ]
            ]);

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener accesos del usuario: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * PUT /api/user/{userId}/access
     * Actualizar todos los accesos de un usuario (agencias y procesos)
     */
    public function updateUserAccess($userId = null)
    {
        if ($r = $this->requireAdmin()) return $r;

        try {
            if (!$userId) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID de usuario requerido'
                ])->setStatusCode(400);
            }

            $data = $this->request->getJSON(true);
            
            $agencies = $data['agencies'] ?? [];
            $processes = $data['processes'] ?? [];

            if (!is_array($agencies) || !is_array($processes)) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Arrays de agencias y procesos requeridos'
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

            // id_last_user_update: FK requiere valor existente en user(id). Usar usuario actual o NULL.
            $currentUserId = $this->getCurrentUserId();

            // Iniciar transacción
            $db->transStart();

            // Actualizar agencias (snake_case)
            $db->table('agency_user')->where('id_user', $userId)->delete();
            $agencyInsertData = [];
            foreach ($agencies as $agencyId) {
                $agencyExists = $db->table('agency')->where('id', $agencyId)->countAllResults() > 0;
                if ($agencyExists) {
                    $row = [
                        'id_user' => $userId,
                        'id_agency' => $agencyId
                    ];
                    $row['id_last_user_update'] = $currentUserId;
                    $agencyInsertData[] = $row;
                }
            }
            if (!empty($agencyInsertData)) {
                $db->table('agency_user')->insertBatch($agencyInsertData);
            }

            // Actualizar procesos (snake_case)
            $db->table('sale_type_user')->where('id_user', $userId)->delete();
            $processInsertData = [];
            foreach ($processes as $processId) {
                $processExists = $db->table('sale_type')->where('id', $processId)->countAllResults() > 0;
                if ($processExists) {
                    $row = [
                        'id_user' => $userId,
                        'id_sale_type' => $processId
                    ];
                    $row['id_last_user_update'] = $currentUserId;
                    $processInsertData[] = $row;
                }
            }
            if (!empty($processInsertData)) {
                $db->table('sale_type_user')->insertBatch($processInsertData);
            }

            // Completar transacción
            $db->transComplete();

            if ($db->transStatus() === false) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al actualizar accesos'
                ])->setStatusCode(500);
            }

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Accesos actualizados exitosamente',
                'data' => [
                    'user_id' => $userId,
                    'assigned_agencies' => count($agencyInsertData),
                    'assigned_processes' => count($processInsertData)
                ]
            ]);

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al actualizar accesos: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * DELETE /api/user/{userId}/access
     * Eliminar todos los accesos de un usuario
     */
    public function clearUserAccess($userId = null)
    {
        if ($r = $this->requireAdmin()) return $r;

        try {
            if (!$userId) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID de usuario requerido'
                ])->setStatusCode(400);
            }

            $db = \Config\Database::connect();

            // Iniciar transacción
            $db->transStart();

            // Eliminar todas las asignaciones (snake_case)
            $agenciesRemoved = $db->table('agency_user')->where('id_user', $userId)->delete();
            $agenciesCount = $db->affectedRows();
            
            $processesRemoved = $db->table('sale_type_user')->where('id_user', $userId)->delete();
            $processesCount = $db->affectedRows();

            // Completar transacción
            $db->transComplete();

            if ($db->transStatus() === false) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al eliminar accesos'
                ])->setStatusCode(500);
            }

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Todos los accesos eliminados exitosamente',
                'data' => [
                    'user_id' => $userId,
                    'removed_agencies' => $agenciesCount,
                    'removed_processes' => $processesCount
                ]
            ]);

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al eliminar accesos: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }
}

