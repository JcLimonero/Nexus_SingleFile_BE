<?php

namespace App\Filters;

use App\Traits\SnakeKeys;
use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

/**
 * Filtro after que normaliza claves JSON a snake_case en TODAS las responses
 * de la API. Activo solo cuando RESPONSE_SNAKE_CASE=true en .env.
 *
 * Útil para enforce el contrato API en un solo punto, sin tener que envolver
 * cada controller en `snakeKeys(...)`. El switch existe porque cualquier
 * cliente FE que lea camelCase directo (sin fallback) se rompe al instante;
 * activarlo cuando el FE ya esté migrado.
 */
class ResponseSnakeCaseFilter implements FilterInterface
{
    use SnakeKeys;

    public function before(RequestInterface $request, $arguments = null)
    {
        // no-op
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        if (env('RESPONSE_SNAKE_CASE', 'false') !== 'true') {
            return;
        }

        $contentType = $response->getHeaderLine('Content-Type');
        if (!str_contains(strtolower($contentType), 'application/json')) {
            return;
        }

        $body = $response->getBody();
        if (!is_string($body) || $body === '') {
            return;
        }

        $decoded = json_decode($body, true);
        if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
            return;
        }

        $normalized = $this->snakeKeys($decoded);
        $response->setBody(json_encode($normalized, JSON_UNESCAPED_UNICODE));
    }
}
