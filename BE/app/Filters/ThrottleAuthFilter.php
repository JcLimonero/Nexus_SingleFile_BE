<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Config\Services;

/**
 * Rate-limit defensivo para endpoints de auth (login, refresh, password reset).
 * Cubre brute-force básico: 10 intentos por minuto por IP.
 *
 * Aplicar en Config/Filters.php $filters:
 *   'throttle_auth' => ['before' => ['api/auth/login', 'api/auth/refresh']]
 */
class ThrottleAuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        if (strtoupper($request->getMethod()) === 'OPTIONS') {
            return;
        }

        $throttler = Services::throttler();
        $ip = $request->getIPAddress() ?: 'unknown';
        $key = 'auth_' . str_replace(['.', ':'], '_', $ip);

        // 10 hits por 60 segundos
        if (!$throttler->check($key, 10, MINUTE)) {
            $retryAfter = (int) ceil($throttler->getTokenTime());
            return service('response')
                ->setStatusCode(429)
                ->setHeader('Retry-After', (string) $retryAfter)
                ->setJSON([
                    'success' => false,
                    'message' => 'Demasiados intentos. Reintenta en ' . $retryAfter . 's.'
                ]);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // no-op
    }
}
