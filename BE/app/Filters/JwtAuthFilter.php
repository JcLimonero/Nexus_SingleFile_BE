<?php

namespace App\Filters;

use App\Models\AuthModel;
use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

/**
 * Valida JWT en el header Authorization antes de que la request llegue al controller.
 *
 * Se aplica a `api/*` globalmente (Config/Filters.php). Las rutas públicas se
 * declaran abajo en PUBLIC_PATHS y se saltan sin validación.
 *
 * Si pasa, deja el payload decodificado en `$_REQUEST['_auth_user']` para que
 * BaseController::getAuthenticatedUser() / nuevos helpers puedan leerlo sin
 * re-verificar.
 */
class JwtAuthFilter implements FilterInterface
{
    /**
     * Rutas públicas (sin JWT). Strings exactos o patrones tipo regex.
     * Las que terminan en `/` o `*` se interpretan como prefijos.
     */
    private const PUBLIC_PATHS = [
        // Login / refresh / migración
        'api/auth/login',
        'api/auth/refresh',
        'api/auth/update-email',
        'api/auth/verify',
        // Miniportal — autorizado vía token-share en el segment
        'api/miniportal/*',
        // Config público (URLs de servicios para el bootstrap del FE)
        'api/config/group_api_url',
        'api/config/activity-log-enabled',
        'api/config/branding',
    ];

    public function before(RequestInterface $request, $arguments = null)
    {
        // OPTIONS preflight ya lo maneja el filtro CORS
        if (strtoupper($request->getMethod()) === 'OPTIONS') {
            return;
        }

        $path = ltrim($request->getUri()->getPath(), '/');

        if ($this->isPublic($path)) {
            return;
        }

        $authHeader = $request->getHeader('Authorization');
        if (!$authHeader || !$authHeader->getValue()) {
            return $this->unauthorized('Falta header Authorization');
        }

        $token = trim(preg_replace('/^Bearer\s+/i', '', $authHeader->getValue()));
        if ($token === '') {
            return $this->unauthorized('Token vacío');
        }

        $result = (new AuthModel())->verifyJWT($token);
        if (!($result['success'] ?? false)) {
            return $this->unauthorized($result['message'] ?? 'Token inválido');
        }

        // Inyecta payload para uso downstream (sin reverificar)
        $_REQUEST['_auth_user'] = $result['data'] ?? null;
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // no-op
    }

    private function isPublic(string $path): bool
    {
        foreach (self::PUBLIC_PATHS as $pattern) {
            if (str_ends_with($pattern, '*')) {
                $prefix = substr($pattern, 0, -1);
                if (str_starts_with($path, $prefix)) {
                    return true;
                }
            } elseif ($path === $pattern) {
                return true;
            }
        }
        return false;
    }

    private function unauthorized(string $message): ResponseInterface
    {
        return service('response')
            ->setStatusCode(401)
            ->setJSON(['success' => false, 'message' => $message]);
    }
}
