<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

/**
 * Config - Endpoint público para obtener configuración del frontend
 * GET /api/config/group_api_url - Retorna URLs Vanguardia/Backblaze desde la tabla config (sin auth)
 */
class Config extends BaseController
{
    private const VANGUARDIA_DEFAULTS = [
        'api_base_url' => 'https://apisvanguardia.com:400',
        'api_url' => '/vgd/singlefilecustomer',
        'orders_api_url' => '/vgd/singlefileorderslastest',
        'invoices_api_url' => '/vgd/singlefileinvoices',
        'upload_api_url' => '/backblaze/upload',
    ];

    /**
     * GET /api/config/group_api_url
     * Retorna URLs completas de APIs externas (Vanguardia, Backblaze) desde la tabla config.
     * Construye URLs como: api_base_url + path (ej: https://apisvanguardia.com:400/vgd/singlefilecustomer)
     * Público - no requiere autenticación (necesario para bootstrap del frontend)
     */
    public function groupApiUrl()
    {
        try {
            $db = \Config\Database::connect();
            $rows = $db->table('config')
                ->select('config_key, config_value, category')
                ->where('category', 'group_api_url')
                ->get()
                ->getResultArray();

            $raw = self::VANGUARDIA_DEFAULTS;
            foreach ($rows as $row) {
                if (isset($raw[$row['config_key']])) {
                    $val = trim($row['config_value'] ?? '');
                    $raw[$row['config_key']] = $val ?: $raw[$row['config_key']];
                }
            }

            $base = rtrim($raw['api_base_url'] ?? '', '/');

            // Siempre usar la API propia de esta aplicación para subidas (direct-upload a Backblaze)
            $uploadBase = rtrim($this->request->getUri()->getBaseURL(), '/');
            $uploadApiUrl = $uploadBase . '/api/backblaze/direct-upload';

            $data = [
                'api_url' => $base . $this->ensureLeadingSlash($raw['api_url'] ?? '/vgd/singlefilecustomer'),
                'orders_api_url' => $base . $this->ensureLeadingSlash($raw['orders_api_url'] ?? '/vgd/singlefileorderslastest'),
                'invoices_api_url' => $base . $this->ensureLeadingSlash($raw['invoices_api_url'] ?? '/vgd/singlefileinvoices'),
                'upload_api_url' => $uploadApiUrl,
            ];

            return $this->response->setJSON([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {

            $base = rtrim(self::VANGUARDIA_DEFAULTS['api_base_url'], '/');
            $uploadBase = rtrim($this->request->getUri()->getBaseURL(), '/');
            $fallback = [
                'api_url' => $base . '/vgd/singlefilecustomer',
                'orders_api_url' => $base . '/vgd/singlefileorderslastest',
                'invoices_api_url' => $base . '/vgd/singlefileinvoices',
                'upload_api_url' => $uploadBase . '/api/backblaze/direct-upload',
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

    private function ensureLeadingSlash(string $path): string
    {
        return $path !== '' && $path[0] !== '/' ? '/' . $path : $path;
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
