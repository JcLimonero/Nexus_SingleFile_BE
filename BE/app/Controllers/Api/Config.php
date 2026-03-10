<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

/**
 * Config - Endpoint público para obtener configuración del frontend
 * GET /api/config/group_api_url - Retorna URLs NexFile/Backblaze desde la tabla config (sin auth)
 */
class Config extends BaseController
{
    /**
     * GET /api/config/group_api_url
     * Retorna URLs del backend (proxy Nexfile, Backblaze) para el frontend.
     * Público - no requiere autenticación (necesario para bootstrap del frontend)
     */
    public function groupApiUrl()
    {
        try {
            $backendBase = rtrim($this->request->getUri()->getBaseURL(), '/');

            // Siempre usar la API propia de esta aplicación para subidas (direct-upload a Backblaze)
            $uploadApiUrl = $backendBase . '/api/backblaze/direct-upload';

            $data = [
                'api_url' => $backendBase . '/api/vgd/NexFilecustomer',
                'orders_api_url' => $backendBase . '/api/vgd/NexFileorderslastest',
                'invoices_api_url' => $backendBase . '/api/vgd/NexFileinvoices',
                'upload_api_url' => $uploadApiUrl,
            ];

            return $this->response->setJSON([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            $backendBase = rtrim($this->request->getUri()->getBaseURL(), '/');
            $fallback = [
                'api_url' => $backendBase . '/api/vgd/NexFilecustomer',
                'orders_api_url' => $backendBase . '/api/vgd/NexFileorderslastest',
                'invoices_api_url' => $backendBase . '/api/vgd/NexFileinvoices',
                'upload_api_url' => $backendBase . '/api/backblaze/direct-upload',
            ];
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'success' => false,
                    'message' => 'Error al obtener configuración',
                    'data' => $fallback
                ]);
        }
    }

    /**
     * GET /api/config/activity-log-enabled
     * Retorna si el registro de logs de actividad está habilitado (desde tabla config).
     * Público - no requiere autenticación (el frontend usa para decidir si enviar logs).
     */
    public function activityLogEnabled()
    {
        try {
            $db = \Config\Database::connect();
            $row = $db->table('config')
                ->select('config_value')
                ->where('config_key', 'activity_log_enabled')
                ->get()
                ->getRowArray();

            $val = trim($row['config_value'] ?? '0');
            $enabled = ($val === '1' || strtolower($val) === 'true');

            return $this->response->setJSON([
                'success' => true,
                'data' => ['activity_log_enabled' => $enabled]
            ]);
        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener configuración',
                'data' => ['activity_log_enabled' => false]
            ])->setStatusCode(500);
        }
    }
}
