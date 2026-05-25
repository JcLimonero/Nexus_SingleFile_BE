<?php

namespace Tests\Feature;

use Tests\Support\FeatureApiTestCase;

/**
 * Sanity check del FeatureApiTestCase + JwtTestHelper.
 * Si esto falla, todos los demás tests fallan también.
 */
final class FoundationSanityTest extends FeatureApiTestCase
{
    public function testCanGenerateValidJwt(): void
    {
        $token = $this->makeJwt();
        $this->assertNotEmpty($token);
        $this->assertCount(3, explode('.', $token), 'JWT debe tener 3 partes');
    }

    public function testAuthLoginRejectsMissingCredentials(): void
    {
        // Auth::login() es público — pasa por PUBLIC_PATHS en JwtAuthFilter
        $resp = $this->callApiNoAuth('POST', '/api/auth/login', []);
        $resp->assertStatus(400);

        $body = $this->decodeJson($resp);
        $this->assertFalse($body['success']);
        $this->assertStringContainsString('requeridos', $body['message']);
    }

    public function testProtectedEndpointRejectsNoAuth(): void
    {
        $resp = $this->callApiNoAuth('GET', '/api/clients-validation/clientes');
        $resp->assertStatus(401);
    }

    public function testProtectedEndpointAcceptsValidJwt(): void
    {
        // Cualquier endpoint protegido — solo verificamos que NO sea 401
        // (puede ser 200, 400, 404 o 500, pero no 401 = auth pasó)
        $resp = $this->callApi('GET', '/api/clients-validation/clientes');
        $this->assertNotSame(401, $resp->getStatusCode(),
            'JWT válido no debería ser rechazado por auth filter');
    }
}
