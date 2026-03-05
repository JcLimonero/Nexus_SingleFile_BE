<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;

/**
 * Proxy para APIs Nexfile (DWH).
 * Reenvía peticiones al DWH local o configurado (nexfile/customers, orders, invoices).
 */
class VanguardiaProxy extends BaseController
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

    /**
     * Reenvía la petición al DWH Nexfile (customers, orders, invoices).
     */
    private function proxyToNexfile(string $endpoint)
    {
        try {
            $baseUrl = $this->getNexfileBaseUrl();
            if (empty($baseUrl)) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Configura nexfile_base_url en la tabla config (category group_api_url) o la variable de entorno NEXFILE_BASE_URL'
                ])->setStatusCode(500);
            }

            $params = $this->request->getGet();
            $queryString = http_build_query($params);
            $url = rtrim($baseUrl, '/') . '/nexfile/' . $endpoint . ($queryString ? '?' . $queryString : '');

            $ch = curl_init($url);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_SSL_VERIFYHOST => false
            ]);
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $error = curl_error($ch);
            curl_close($ch);

            if ($error) {
                throw new \Exception("cURL Error: {$error}");
            }

            $body = json_decode($response, true) ?? ['error' => 'Invalid response'];
            return $this->response->setJSON($body)->setStatusCode($httpCode);
        } catch (\Exception $e) {
            error_log("Error en VanguardiaProxy::{$endpoint}: " . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al consultar Nexfile: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
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
}

