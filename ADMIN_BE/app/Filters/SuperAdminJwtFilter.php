<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use App\Libraries\SuperAdminJwt;

/**
 * Validates super-admin JWT for /api/admin/* (except /api/admin/auth/login).
 */
class SuperAdminJwtFilter implements FilterInterface
{
    private const PUBLIC_PATHS = [
        'api/admin/auth/login',
    ];

    public function before(RequestInterface $request, $arguments = null)
    {
        if (strtoupper($request->getMethod()) === 'OPTIONS') return;

        $path = ltrim($request->getUri()->getPath(), '/');
        if (str_starts_with($path, 'index.php/')) $path = substr($path, 10);
        if (in_array($path, self::PUBLIC_PATHS, true)) return;

        $auth = $request->getHeader('Authorization');
        if (!$auth || !$auth->getValue()) {
            return $this->unauthorized('Falta header Authorization');
        }
        $value = $auth->getValue();
        if (!preg_match('/^Bearer\s+(.+)$/i', $value, $m)) {
            return $this->unauthorized('Authorization debe ser Bearer <token>');
        }

        $jwt = new SuperAdminJwt();
        $payload = $jwt->verify($m[1]);
        if (!$payload) return $this->unauthorized('Token inválido o expirado');

        $_REQUEST['_super_admin'] = $payload;
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null) {}

    private function unauthorized(string $msg)
    {
        return service('response')
            ->setStatusCode(401)
            ->setJSON(['success' => false, 'message' => $msg]);
    }
}
