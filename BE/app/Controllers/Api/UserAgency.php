<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

class UserAgency extends BaseController
{
    /**
     * GET /api/user/{userId}/agencies
     * Obtener agencias asignadas a un usuario
     * Admin (7), Soporte (8) y Demo (15) tienen acceso a todas las agencias
     */
    public function getUserAgencies($userId = null)
    {
        try {
            if (!$userId) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID de usuario requerido'
                ])->setStatusCode(400);
            }

            $currentUser = $this->getAuthenticatedUser();
            $db = \Config\Database::connect();

            // Admin, Soporte y Demo tienen acceso a todas las agencias
            $isAdminOrDemo = $currentUser && (int) $currentUser['user_id'] === (int) $userId && $this->isCurrentUserAdmin();
            if ($isAdminOrDemo) {
                $agencies = $db->table('agency a')
                    ->select('a.id as id_agency, a.name as agency_name, a.enabled')
                    ->where('a.enabled', 1)
                    ->orderBy('a.name', 'ASC')
                    ->get()
                    ->getResultArray();
                $agencyIds = array_column($agencies, 'id_agency');
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Agencias del usuario obtenidas exitosamente',
                    'data' => [
                        'agencies' => $agencyIds,
                        'agencies_details' => $agencies,
                        'count' => count($agencies)
                    ]
                ]);
            }

            // Obtener agencias asignadas al usuario con información de la agencia
            $builder = $db->table('agency_user au');
            $agencies = $builder
                ->select('au.id_agency, a.name as agency_name, a.enabled')
                ->join('agency a', 'a.id = au.id_agency', 'inner')
                ->where('au.id_user', $userId)
                ->orderBy('a.name', 'ASC')
                ->get()
                ->getResultArray();

            // Extraer solo los IDs para la respuesta
            $agencyIds = array_column($agencies, 'id_agency');

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Agencias del usuario obtenidas exitosamente',
                'data' => [
                    'agencies' => $agencyIds,
                    'agencies_details' => $agencies,
                    'count' => count($agencies)
                ]
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en UserAgency::getUserAgencies: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener agencias del usuario: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * POST /api/user/{userId}/agencies
     * Asignar agencias a un usuario
     */
    public function assignAgencies($userId = null)
    {
        try {
            if (!$userId) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID de usuario requerido'
                ])->setStatusCode(400);
            }

            $data = $this->request->getJSON(true);
            
            if (!isset($data['agencies']) || !is_array($data['agencies'])) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Array de agencias requerido'
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
            $db->table('agency_user')->where('id_user', $userId)->delete();

            // Insertar las nuevas asignaciones
            $insertData = [];
            foreach ($data['agencies'] as $agencyId) {
                $agencyExists = $db->table('agency')->where('id', $agencyId)->countAllResults() > 0;
                if ($agencyExists) {
                    $insertData[] = [
                        'id_user' => $userId,
                        'id_agency' => $agencyId
                    ];
                }
            }

            if (!empty($insertData)) {
                $db->table('agency_user')->insertBatch($insertData);
            }

            // Completar transacción
            $db->transComplete();

            if ($db->transStatus() === false) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al asignar agencias'
                ])->setStatusCode(500);
            }

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Agencias asignadas exitosamente',
                'data' => [
                    'user_id' => $userId,
                    'assigned_agencies' => count($insertData)
                ]
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en UserAgency::assignAgencies: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al asignar agencias: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * DELETE /api/user/{userId}/agencies/{agencyId}
     * Remover una agencia específica de un usuario
     */
    public function removeAgency($userId = null, $agencyId = null)
    {
        try {
            if (!$userId || !$agencyId) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'ID de usuario y agencia requeridos'
                ])->setStatusCode(400);
            }

            $db = \Config\Database::connect();

            // Verificar que la asignación existe (snake_case)
            $exists = $db->table('agency_user')
                ->where('id_user', $userId)
                ->where('id_agency', $agencyId)
                ->countAllResults() > 0;

            if (!$exists) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Asignación no encontrada'
                ])->setStatusCode(404);
            }

            // Eliminar la asignación
            $deleted = $db->table('agency_user')
                ->where('id_user', $userId)
                ->where('id_agency', $agencyId)
                ->delete();

            if ($deleted) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Agencia removida exitosamente'
                ]);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Error al remover agencia'
                ])->setStatusCode(500);
            }

        } catch (\Exception $e) {
            log_message('error', 'Error en UserAgency::removeAgency: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al remover agencia: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * DELETE /api/user/{userId}/agencies
     * Remover todas las agencias de un usuario
     */
    public function removeAllAgencies($userId = null)
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
            $deleted = $db->table('agency_user')->where('id_user', $userId)->delete();

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Todas las agencias removidas exitosamente',
                'data' => [
                    'user_id' => $userId,
                    'removed_count' => $db->affectedRows()
                ]
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en UserAgency::removeAllAgencies: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al remover agencias: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/user/agencies-batch?user_ids=1,2,3
     * Obtener agencias asignadas a múltiples usuarios en una sola llamada
     */
    public function getUsersAgenciesBatch()
    {
        try {
            $userIds = $this->request->getGet('user_ids');
            
            if (!$userIds) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Parámetro user_ids requerido'
                ])->setStatusCode(400);
            }

            // Convertir string de IDs a array
            $userIdArray = array_map('trim', explode(',', $userIds));
            
            if (empty($userIdArray)) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Lista de IDs de usuario vacía'
                ])->setStatusCode(400);
            }

            $db = \Config\Database::connect();
            
            // Obtener agencias asignadas a todos los usuarios especificados
            $builder = $db->table('agency_user au');
            $agencies = $builder
                ->select('au.id_user, au.id_agency, a.name as agency_name, a.enabled')
                ->join('agency a', 'a.id = au.id_agency', 'inner')
                ->whereIn('au.id_user', $userIdArray)
                ->orderBy('au.id_user', 'ASC')
                ->orderBy('a.name', 'ASC')
                ->get()
                ->getResultArray();

            // Organizar los datos por usuario
            $result = [];
            foreach ($userIdArray as $userId) {
                $userAgencies = array_filter($agencies, function($agency) use ($userId) {
                    return $agency['id_user'] == $userId;
                });
                
                $agencyIds = array_column($userAgencies, 'id_agency');
                $agenciesDetails = array_values($userAgencies);
                
                $result[$userId] = [
                    'agencies' => $agencyIds,
                    'agencies_details' => $agenciesDetails,
                    'count' => count($agencyIds)
                ];
            }

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Agencias de usuarios obtenidas exitosamente',
                'data' => $result,
                'total_users' => count($userIdArray),
                'total_assignments' => count($agencies)
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en UserAgency::getUsersAgenciesBatch: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener agencias de usuarios: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/user/{userId}/agencies/stats
     * Obtener estadísticas de agencias asignadas a un usuario
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

            // Contar agencias asignadas (snake_case)
            $totalAssigned = $db->table('agency_user')->where('id_user', $userId)->countAllResults();
            
            // Contar agencias activas asignadas
            $activeAssigned = $db->table('agency_user au')
                ->join('agency a', 'a.id = au.id_agency', 'inner')
                ->where('au.id_user', $userId)
                ->where('a.enabled', 1)
                ->countAllResults();

            // Contar total de agencias disponibles
            $totalAvailable = $db->table('agency')->countAllResults();
            $activeAvailable = $db->table('agency')->where('enabled', 1)->countAllResults();

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
            log_message('error', 'Error en UserAgency::getStats: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener estadísticas: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }
}

