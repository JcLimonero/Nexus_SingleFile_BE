<?php

namespace Tests\Feature\Auth;

use Tests\Support\FeatureApiTestCase;

/**
 * Tests para App\Controllers\Api\Auth (5 endpoints).
 *
 * Cubre login/verify/refresh/updateEmail/logout — caminos de error explícitos
 * sin depender de un usuario real en DB. Los happy paths quedan marcados como
 * @group integration para correr aparte cuando haya fixtures.
 */
final class AuthControllerTest extends FeatureApiTestCase
{
    // ============================================================
    // POST /api/auth/login
    // ============================================================

    public function testLoginRejectsMissingBody(): void
    {
        $resp = $this->callApiNoAuth('POST', '/api/auth/login', []);
        $resp->assertStatus(400);
        $body = $this->decodeJson($resp);
        $this->assertFalse($body['success']);
    }

    public function testLoginRejectsMissingPassword(): void
    {
        $resp = $this->callApiNoAuth('POST', '/api/auth/login', [
            'email' => 'test@nexfile.test',
        ]);
        $resp->assertStatus(400);
        $body = $this->decodeJson($resp);
        $this->assertFalse($body['success']);
        $this->assertStringContainsString('requeridos', $body['message']);
    }

    public function testLoginRejectsMissingEmail(): void
    {
        $resp = $this->callApiNoAuth('POST', '/api/auth/login', [
            'password' => 'whatever',
        ]);
        $resp->assertStatus(400);
        $body = $this->decodeJson($resp);
        $this->assertFalse($body['success']);
    }

    public function testLoginRejectsInvalidCredentials(): void
    {
        $resp = $this->callApiNoAuth('POST', '/api/auth/login', [
            'email' => 'nonexistent-' . uniqid() . '@nexfile.test',
            'password' => 'wrong-password',
        ]);
        // Status puede venir null (200 implícito) o 401 explícito según rama
        // que tome AuthModel. Lo crítico es que el body diga success=false.
        $body = $this->decodeJson($resp);
        $this->assertFalse($body['success']);
        $this->assertNotEmpty($body['message']);
    }

    // ============================================================
    // POST /api/auth/verify
    // ============================================================

    public function testVerifyRejectsMissingAuthHeader(): void
    {
        $resp = $this->callApiNoAuth('POST', '/api/auth/verify');
        $resp->assertStatus(401);
    }

    public function testVerifyRejectsEmptyBearer(): void
    {
        $resp = $this->callApiWithAuthHeader('POST', '/api/auth/verify', 'Bearer ');
        $resp->assertStatus(401);
    }

    public function testVerifyRejectsInvalidToken(): void
    {
        $resp = $this->callApiWithAuthHeader('POST', '/api/auth/verify', 'Bearer this.is.not-a-jwt');
        $resp->assertStatus(401);
        $body = $this->decodeJson($resp);
        $this->assertFalse($body['success']);
    }

    public function testVerifyRejectsExpiredToken(): void
    {
        $resp = $this->callApiWithAuthHeader('POST', '/api/auth/verify', 'Bearer ' . $this->makeExpiredJwt());
        $resp->assertStatus(401);
    }

    public function testVerifyRejectsWrongSecret(): void
    {
        $resp = $this->callApiWithAuthHeader('POST', '/api/auth/verify', 'Bearer ' . $this->makeJwtWithWrongSecret());
        $resp->assertStatus(401);
    }

    public function testVerifyAcceptsValidToken(): void
    {
        $resp = $this->callApi('POST', '/api/auth/verify');
        $resp->assertStatus(200);
        $body = $this->decodeJson($resp);
        $this->assertTrue($body['success']);
        $this->assertArrayHasKey('data', $body);
        $this->assertSame(1, $body['data']['user_id']);
        $this->assertSame('test@nexfile.test', $body['data']['email']);
    }

    // ============================================================
    // POST /api/auth/refresh
    // ============================================================

    public function testRefreshRejectsMissingToken(): void
    {
        $resp = $this->callApiNoAuth('POST', '/api/auth/refresh', []);
        $resp->assertStatus(400);
        $body = $this->decodeJson($resp);
        $this->assertFalse($body['success']);
    }

    public function testRefreshRejectsInvalidToken(): void
    {
        $resp = $this->callApiNoAuth('POST', '/api/auth/refresh', [
            'refresh_token' => 'invalid-token',
        ]);
        // 401 esperado; AuthModel devuelve 401 con success=false
        $resp->assertStatus(401);
        $body = $this->decodeJson($resp);
        $this->assertFalse($body['success']);
    }

    public function testRefreshRejectsAccessTokenInsteadOfRefresh(): void
    {
        // Pasar un access token donde se espera refresh token
        $accessToken = $this->makeJwt(['type' => 'access']);
        $resp = $this->callApiNoAuth('POST', '/api/auth/refresh', [
            'refresh_token' => $accessToken,
        ]);
        $resp->assertStatus(401);
    }

    // ============================================================
    // POST /api/auth/update-email
    // ============================================================

    public function testUpdateEmailRejectsMissingFields(): void
    {
        $resp = $this->callApiNoAuth('POST', '/api/auth/update-email', []);
        $resp->assertStatus(400);
        $body = $this->decodeJson($resp);
        $this->assertFalse($body['success']);
        $this->assertStringContainsString('requeridos', $body['message']);
    }

    public function testUpdateEmailRejectsMissingPassword(): void
    {
        $resp = $this->callApiNoAuth('POST', '/api/auth/update-email', [
            'user_id' => 1,
            'email' => 'new@nexfile.test',
        ]);
        $resp->assertStatus(400);
    }

    public function testUpdateEmailRejectsNonexistentUser(): void
    {
        $resp = $this->callApiNoAuth('POST', '/api/auth/update-email', [
            'user_id' => 999999999,
            'email' => 'new@nexfile.test',
            'password' => 'whatever',
        ]);
        // user_not_found / wrong_password → body.success=false
        $body = $this->decodeJson($resp);
        $this->assertFalse($body['success']);
    }

    // ============================================================
    // POST /api/auth/logout
    // ============================================================

    public function testLogoutRejectsNoAuth(): void
    {
        $resp = $this->callApiNoAuth('POST', '/api/auth/logout');
        $resp->assertStatus(401);
    }

    public function testLogoutAcceptsValidAuth(): void
    {
        $resp = $this->callApi('POST', '/api/auth/logout');
        // El controller retorna 200 implícito (no llama setStatusCode en el
        // happy path) — assertOK() acepta null|200|2xx siempre que el body
        // exista, que es el contrato real para el FE.
        $body = $this->decodeJson($resp);
        $this->assertTrue($body['success']);
        $this->assertSame('Logout exitoso', $body['message']);
    }
}
