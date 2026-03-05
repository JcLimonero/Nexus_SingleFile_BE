<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

/**
 * Valida el token del proveedor para las APIs Nexfile.
 * Header: X-Provider-Token o Authorization: Bearer <token>
 */
class ProviderTokenFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        if (getenv('DWH_PROVIDER_TOKEN_REQUIRED') === '0' || getenv('DWH_PROVIDER_TOKEN_REQUIRED') === 'false') {
            return $request;
        }

        $token = $request->getHeaderLine('X-Provider-Token');
        if (empty($token) && preg_match('/^Bearer\s+(.+)$/i', $request->getHeaderLine('Authorization'), $m)) {
            $token = trim($m[1]);
        }

        if (empty($token)) {
            return service('response')
                ->setJSON(['success' => false, 'message' => 'Se requiere X-Provider-Token o Authorization: Bearer <token>'])
                ->setStatusCode(401);
        }

        try {
            $db = \Config\Database::connect();
            $row = $db->table('api_providers')
                ->select('id, provider_name')
                ->where('token', $token)
                ->where('enabled', 1)
                ->get()
                ->getRowArray();
        } catch (\Throwable $e) {
            log_message('error', 'ProviderTokenFilter: ' . $e->getMessage());
            return service('response')
                ->setJSON(['success' => false, 'message' => 'Error validando token'])
                ->setStatusCode(500);
        }

        if (!$row) {
            return service('response')
                ->setJSON(['success' => false, 'message' => 'Token inválido o proveedor deshabilitado'])
                ->setStatusCode(403);
        }

        $request->provider = $row;
        return $request;
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        return $response;
    }
}
