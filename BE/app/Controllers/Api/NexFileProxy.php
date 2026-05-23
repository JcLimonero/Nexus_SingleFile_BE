<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;

/**
 * Proxy para APIs Nexfile (DWH).
 * Reenvía peticiones al DWH local o configurado (nexfile/customers, orders, invoices).
 */
class NexFileProxy extends BaseController
{
    /**
     * Proxy para búsqueda de clientes
     * GET /api/vgd/NexFilecustomer -> DWH /nexfile/customers
     */
    public function searchClients()
    {
        return $this->proxyToNexfile('customers');
    }

    /**
     * Proxy para facturas/pedidos DMS (NexFileinvoices)
     * GET /api/vgd/NexFileinvoices -> DWH /nexfile/invoices
     */
    public function NexFileInvoices()
    {
        return $this->proxyToNexfile('invoices');
    }

    /**
     * Proxy para búsqueda de pedidos
     * GET /api/vgd/NexFileorderslastest -> DWH /nexfile/orders
     */
    public function searchOrders()
    {
        return $this->proxyToNexfile('orders');
    }

    // Cache TTL para respuestas exitosas del DWH (segundos)
    private const CACHE_TTL = 300; // 5 min

    // Circuit breaker: abre tras N fallos consecutivos en CB_WINDOW segundos
    private const CB_THRESHOLD = 5;
    private const CB_WINDOW    = 60;
    private const CB_OPEN_FOR  = 30; // cuánto queda abierto antes de medio-abrir

    /**
     * Reenvía la petición al DWH Nexfile (customers, orders, invoices)
     * con cache de 5min en respuestas 2xx y circuit breaker básico.
     */
    private function proxyToNexfile(string $endpoint)
    {
        $cache = \Config\Services::cache();

        try {
            $baseUrl = $this->getNexfileBaseUrl();
            if (empty($baseUrl)) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Configura nexfile_base_url en la tabla config (category group_api_url) o la variable de entorno NEXFILE_BASE_URL'
                ])->setStatusCode(500);
            }

            // Circuit breaker: si está abierto, cortocircuita
            if ($cache->get('nexfile_cb_open')) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Servicio DWH temporalmente no disponible. Reintenta en unos segundos.'
                ])->setStatusCode(503);
            }

            $params = $this->request->getGet();
            ksort($params); // estabiliza la cache key
            $queryString = http_build_query($params);
            $cacheKey = 'nexfile_' . $endpoint . '_' . md5($queryString);

            $cached = $cache->get($cacheKey);
            if ($cached !== null) {
                return $this->response->setJSON($cached['body'])->setStatusCode($cached['status']);
            }

            $url = rtrim($baseUrl, '/') . '/nexfile/' . $endpoint . ($queryString ? '?' . $queryString : '');

            $headers = ['Content-Type: application/json'];
            $token = $this->getNexfileProviderToken();
            if (!empty($token)) {
                $headers[] = 'X-Provider-Token: ' . $token;
            }

            $ch = curl_init($url);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HTTPHEADER => $headers,
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_SSL_VERIFYHOST => false,
                CURLOPT_CONNECTTIMEOUT => 5,
                CURLOPT_TIMEOUT => 15, // bajado de 60 — no debe bloquear workers tanto tiempo
            ]);
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $error = curl_error($ch);
            curl_close($ch);

            if ($error) {
                $this->registerFailure($cache);
                throw new \Exception("cURL Error: {$error}");
            }

            $body = json_decode($response, true) ?? ['error' => 'Invalid response'];

            // Solo cacheamos respuestas exitosas
            if ($httpCode >= 200 && $httpCode < 300) {
                $cache->save($cacheKey, ['body' => $body, 'status' => $httpCode], self::CACHE_TTL);
                $this->resetFailures($cache);
            } elseif ($httpCode >= 500) {
                $this->registerFailure($cache);
            }

            return $this->response->setJSON($body)->setStatusCode($httpCode);
        } catch (\Exception $e) {
            error_log("Error en NexFileProxy::{$endpoint}: " . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al consultar Nexfile'
            ])->setStatusCode(502);
        }
    }

    private function registerFailure($cache): void
    {
        $count = (int) $cache->get('nexfile_cb_fail') + 1;
        $cache->save('nexfile_cb_fail', $count, self::CB_WINDOW);
        if ($count >= self::CB_THRESHOLD) {
            $cache->save('nexfile_cb_open', true, self::CB_OPEN_FOR);
        }
    }

    private function resetFailures($cache): void
    {
        $cache->delete('nexfile_cb_fail');
    }

    private function getNexfileBaseUrl(): string
    {
        $url = getenv('NEXFILE_BASE_URL');
        if (!empty($url)) {
            return rtrim($url, '/');
        }
        $db = \Config\Database::connect();
        $row = $db->table('config')
            ->select('config_value')
            ->where('category', 'group_api_url')
            ->where('config_key', 'nexfile_base_url')
            ->get()
            ->getRowArray();
        $val = trim($row['config_value'] ?? '');
        if (!empty($val)) {
            return rtrim($val, '/');
        }
        return '';
    }

    private function getNexfileProviderToken(): string
    {
        $token = getenv('NEXFILE_PROVIDER_TOKEN');
        if (!empty($token)) {
            return trim($token);
        }
        $db = \Config\Database::connect();
        $row = $db->table('config')
            ->select('config_value')
            ->where('category', 'group_api_url')
            ->where('config_key', 'nexfile_provider_token')
            ->get()
            ->getRowArray();
        $val = trim($row['config_value'] ?? '');
        return $val;
    }
}
