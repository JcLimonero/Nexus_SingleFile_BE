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

            // Obtener agencias asignadas
            $agencies = $db->table('Agency_User au')
                ->select('au.IdAgency, a.Name as AgencyName, a.Enabled')
                ->join('Agency a', 'a.Id = au.IdAgency', 'inner')
                ->where('au.IdUser', $userId)
                ->orderBy('a.Name', 'ASC')
                ->get()
                ->getResultArray();

            // Obtener procesos asignados
            $processes = $db->table('Process_User pu')
                ->select('pu.IdProcess, p.Name as ProcessName, p.Enabled')
                ->join('Process p', 'p.Id = pu.IdProcess', 'inner')
                ->where('pu.IdUser', $userId)
                ->orderBy('p.Name', 'ASC')
                ->get()
                ->getResultArray();

            // Extraer IDs
            $agencyIds = array_column($agencies, 'IdAgency');
            $processIds = array_column($processes, 'IdProcess');

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
                        'active_agencies' => count(array_filter($agencies, fn($a) => $a['Enabled'] == 1)),
                        'active_processes' => count(array_filter($processes, fn($p) => $p['Enabled'] == 1))
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en UserAccess::getUserAccess: ' . $e->getMessage());
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

            // Verificar que el usuario existe
            $userExists = $db->table('User')->where('Id', $userId)->countAllResults() > 0;
            if (!$userExists) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Usuario no encontrado'
                ])->setStatusCode(404);
            }

            // Iniciar transacción
            $db->transStart();

            // Actualizar agencias
            $db->table('Agency_User')->where('IdUser', $userId)->delete();
            $agencyInsertData = [];
            foreach ($agencies as $agencyId) {
                $agencyExists = $db->table('Agency')->where('Id', $agencyId)->countAllResults() > 0;
                if ($agencyExists) {
                    $agencyInsertData[] = [
                        'IdUser' => $userId,
                        'IdAgency' => $agencyId
                    ];
                }
            }
            if (!empty($agencyInsertData)) {
                $db->table('Agency_User')->insertBatch($agencyInsertData);
            }

            // Actualizar procesos
            $db->table('Process_User')->where('IdUser', $userId)->delete();
            $processInsertData = [];
            foreach ($processes as $processId) {
                $processExists = $db->table('Process')->where('Id', $processId)->countAllResults() > 0;
                if ($processExists) {
                    $processInsertData[] = [
                        'IdUser' => $userId,
                        'IdProcess' => $processId
                    ];
                }
            }
            if (!empty($processInsertData)) {
                $db->table('Process_User')->insertBatch($processInsertData);
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
            log_message('error', 'Error en UserAccess::updateUserAccess: ' . $e->getMessage());
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

            // Eliminar todas las asignaciones
            $agenciesRemoved = $db->table('Agency_User')->where('IdUser', $userId)->delete();
            $agenciesCount = $db->affectedRows();
            
            $processesRemoved = $db->table('Process_User')->where('IdUser', $userId)->delete();
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
            log_message('error', 'Error en UserAccess::clearUserAccess: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al eliminar accesos: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }
}

