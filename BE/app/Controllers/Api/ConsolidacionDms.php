<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

/**
 * Consolidación DMS - Ordenes del DWH con estatus en Nexfile.
 * Una sola llamada para múltiples agencias, filtro por release_date.
 * GET /api/consolidacion-dms/pedidos?id_agencies=1,2,3&release_date_from=2025-11-01&release_date_to=2026-01-31&page=1&limit=50
 */
class ConsolidacionDms extends BaseController
{
    public function pedidos(): ResponseInterface
    {
        try {
            $idAgenciesRaw = $this->request->getGet('id_agencies');
            $releaseDateFrom = $this->request->getGet('release_date_from');
            $releaseDateTo = $this->request->getGet('release_date_to');
            $page = max(1, (int) ($this->request->getGet('page') ?: 1));
            $limit = min(500, max(1, (int) ($this->request->getGet('limit') ?: 50)));
            $filterEstatus = $this->request->getGet('filter_estatus'); // -1=all, 0=sin integrar, 1-6=state

            $agencyIds = array_filter(array_map('trim', explode(',', (string) $idAgenciesRaw)));
            if (empty($agencyIds)) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Parámetro id_agencies requerido (comma-separated)',
                ])->setStatusCode(400);
            }

            $baseUrl = $this->getNexfileBaseUrl();
            if (empty($baseUrl)) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Configura nexfile_base_url o NEXFILE_BASE_URL',
                ])->setStatusCode(500);
            }

            $agencyNames = [];
            $agencyNamesRaw = $this->request->getGet('agency_names');
            if ($agencyNamesRaw) {
                foreach (explode(';', $agencyNamesRaw) as $pair) {
                    $eq = strpos($pair, '=');
                    if ($eq !== false) {
                        $k = trim(substr($pair, 0, $eq));
                        $v = trim(urldecode(substr($pair, $eq + 1)));
                        if ($k !== '') {
                            $agencyNames[$k] = $v;
                        }
                    }
                }
            }

            $url = rtrim($baseUrl, '/') . '/nexfile/invoices?'
                . 'id_agencies=' . urlencode(implode(',', $agencyIds))
                . '&page=1&limit=10000';
            if ($releaseDateFrom !== null && $releaseDateFrom !== '') {
                $url .= '&release_date_from=' . urlencode($releaseDateFrom);
            }
            if ($releaseDateTo !== null && $releaseDateTo !== '') {
                $url .= '&release_date_to=' . urlencode($releaseDateTo);
            }

            $allRows = [];
            $resp = $this->httpGet($url);
            if ($resp && isset($resp['data']) && is_array($resp['data'])) {
                foreach ($resp['data'] as $row) {
                    $idAgency = $row['id_agency'] ?? $row['idAgency'] ?? '';
                    if (!empty($agencyNames[$idAgency])) {
                        $row['agency_name'] = $agencyNames[$idAgency];
                    }
                    $allRows[] = $row;
                }
            }

            if ($filterEstatus !== null && $filterEstatus !== '' && (int) $filterEstatus >= 0) {
                $estatusVal = (int) $filterEstatus;
                $allRows = array_filter($allRows, function ($row) use ($estatusVal) {
                    $v = $row['state'] ?? $row['State'] ?? null;
                    if ($estatusVal === 0) {
                        return $v === null || $v === '' || $v === 0 || $v === '0';
                    }
                    $num = is_numeric($v) ? (int) $v : null;
                    return $num !== null && $num === $estatusVal;
                });
                $allRows = array_values($allRows);
            }

            $total = count($allRows);
            $offset = ($page - 1) * $limit;
            $paged = array_slice($allRows, $offset, $limit);

            return $this->response->setJSON([
                'success' => true,
                'data' => $paged,
                'total' => $total,
                'page' => $page,
                'limit' => $limit,
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'ConsolidacionDms::pedidos - ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => $e->getMessage(),
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
        return !empty($val) ? rtrim($val, '/') : '';
    }

    private function httpGet(string $url): ?array
    {
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
        ]);
        $response = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($response === false || $code >= 400) {
            return null;
        }
        return json_decode($response, true);
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
        return trim($row['config_value'] ?? '');
    }
}
