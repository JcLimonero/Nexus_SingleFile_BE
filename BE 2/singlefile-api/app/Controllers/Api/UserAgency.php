<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

class UserAgency extends BaseController
{
    /**
     * GET /api/user/{userId}/agencies
     * Obtener agencias asignadas a un usuario
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

            $db = \Config\Database::connect();
            
            // Obtener agencias asignadas al usuario con información de la agencia
            $builder = $db->table('Agency_User au');
            $agencies = $builder
                ->select('au.IdAgency, a.Name as AgencyName, a.Enabled')
                ->join('Agency a', 'a.Id = au.IdAgency', 'inner')
                ->where('au.IdUser', $userId)
                ->orderBy('a.Name', 'ASC')
                ->get()
                ->getResultArray();

            // Extraer solo los IDs para la respuesta
            $agencyIds = array_column($agencies, 'IdAgency');

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

            // Eliminar todas las asignaciones existentes del usuario
            $db->table('Agency_User')->where('IdUser', $userId)->delete();

            // Insertar las nuevas asignaciones
            $insertData = [];
            foreach ($data['agencies'] as $agencyId) {
                // Verificar que la agencia existe
                $agencyExists = $db->table('Agency')->where('Id', $agencyId)->countAllResults() > 0;
                if ($agencyExists) {
                    $insertData[] = [
                        'IdUser' => $userId,
                        'IdAgency' => $agencyId
                    ];
                }
            }

            if (!empty($insertData)) {
                $db->table('Agency_User')->insertBatch($insertData);
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

            // Verificar que la asignación existe
            $exists = $db->table('Agency_User')
                ->where('IdUser', $userId)
                ->where('IdAgency', $agencyId)
                ->countAllResults() > 0;

            if (!$exists) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Asignación no encontrada'
                ])->setStatusCode(404);
            }

            // Eliminar la asignación
            $deleted = $db->table('Agency_User')
                ->where('IdUser', $userId)
                ->where('IdAgency', $agencyId)
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
            $deleted = $db->table('Agency_User')->where('IdUser', $userId)->delete();

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

            // Contar agencias asignadas
            $totalAssigned = $db->table('Agency_User')->where('IdUser', $userId)->countAllResults();
            
            // Contar agencias activas asignadas
            $activeAssigned = $db->table('Agency_User au')
                ->join('Agency a', 'a.Id = au.IdAgency', 'inner')
                ->where('au.IdUser', $userId)
                ->where('a.Enabled', 1)
                ->countAllResults();

            // Contar total de agencias disponibles
            $totalAvailable = $db->table('Agency')->countAllResults();
            $activeAvailable = $db->table('Agency')->where('Enabled', 1)->countAllResults();

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

