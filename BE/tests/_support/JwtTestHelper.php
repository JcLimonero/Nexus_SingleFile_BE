<?php

namespace Tests\Support;

use Firebase\JWT\JWT;

/**
 * Genera JWTs válidos para tests sin tener que pasar por Auth::login().
 *
 * Usa el mismo JWT_SECRET / TTL que el runtime real, así que el token resultante
 * pasa por JwtAuthFilter sin modificaciones.
 */
trait JwtTestHelper
{
    /**
     * Genera un access token válido para el user indicado.
     *
     * @param array $overrides  Claims a sobreescribir (user_id, email, role_id, exp, type)
     */
    protected function makeJwt(array $overrides = []): string
    {
        $secret = env('JWT_SECRET', '');
        if (strlen($secret) < 32) {
            throw new \RuntimeException('JWT_SECRET no configurado en .env de tests');
        }

        $now = time();
        $payload = array_merge([
            'iss'     => 'NexFile-api',
            'aud'     => 'NexFile-client',
            'iat'     => $now,
            'exp'     => $now + (int) env('JWT_ACCESS_TTL', 10800),
            'user_id' => 1,
            'email'   => 'test@nexfile.test',
            'role_id' => 7,
            'type'    => 'access',
        ], $overrides);

        return JWT::encode($payload, $secret, 'HS256');
    }

    /**
     * Token expirado — debería ser rechazado con 401.
     */
    protected function makeExpiredJwt(array $overrides = []): string
    {
        return $this->makeJwt(array_merge($overrides, [
            'iat' => time() - 7200,
            'exp' => time() - 3600,
        ]));
    }

    /**
     * Token firmado con secret incorrecto — debería ser rechazado con 401.
     */
    protected function makeJwtWithWrongSecret(array $overrides = []): string
    {
        $now = time();
        $payload = array_merge([
            'iss'     => 'NexFile-api',
            'aud'     => 'NexFile-client',
            'iat'     => $now,
            'exp'     => $now + 3600,
            'user_id' => 1,
            'email'   => 'test@nexfile.test',
            'role_id' => 7,
            'type'    => 'access',
        ], $overrides);

        return JWT::encode($payload, str_repeat('x', 64), 'HS256');
    }

    /**
     * Devuelve el header Authorization listo para feature tests.
     */
    protected function authHeader(array $overrides = []): array
    {
        return ['Authorization' => 'Bearer ' . $this->makeJwt($overrides)];
    }
}
