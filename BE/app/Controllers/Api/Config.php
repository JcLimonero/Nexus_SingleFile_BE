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
                ->select('config_key, config_value')
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
            $data = [
                'api_url' => $base . $this->ensureLeadingSlash($raw['api_url'] ?? '/vgd/singlefilecustomer'),
                'orders_api_url' => $base . $this->ensureLeadingSlash($raw['orders_api_url'] ?? '/vgd/singlefileorderslastest'),
                'invoices_api_url' => $base . $this->ensureLeadingSlash($raw['invoices_api_url'] ?? '/vgd/singlefileinvoices'),
                'upload_api_url' => $base . $this->ensureLeadingSlash($raw['upload_api_url'] ?? '/backblaze/upload'),
            ];

            return $this->response->setJSON([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            log_message('error', 'Config::groupApiUrl - ' . $e->getMessage());
            $base = rtrim(self::VANGUARDIA_DEFAULTS['api_base_url'], '/');
            $fallback = [
                'api_url' => $base . '/vgd/singlefilecustomer',
                'orders_api_url' => $base . '/vgd/singlefileorderslastest',
                'invoices_api_url' => $base . '/vgd/singlefileinvoices',
                'upload_api_url' => $base . '/backblaze/upload',
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
}
