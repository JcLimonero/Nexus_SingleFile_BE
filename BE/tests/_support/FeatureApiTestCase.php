<?php

namespace Tests\Support;

use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\FeatureTestTrait;

/**
 * Base para tests de endpoints HTTP del API.
 *
 *   class MyControllerTest extends FeatureApiTestCase {
 *     public function testIt() {
 *       $resp = $this->call('GET', '/api/foo', ['headers' => $this->authHeader()]);
 *       $resp->assertOK()->assertJSONExact(['success' => true]);
 *     }
 *   }
 *
 * Notas:
 * - El BE conecta a `nexfile_tenant_test8` (default group). Los tests son contra
 *   esa DB live — diseñá los asserts para no depender de IDs específicos.
 * - JwtAuthFilter está activo en `api/*`. Usá `$this->authHeader()` para auth válida.
 * - TenantGateFilter NO corre en tests (multitenant disabled por defecto).
 */
abstract class FeatureApiTestCase extends CIUnitTestCase
{
    use FeatureTestTrait;
    use JwtTestHelper;

    /**
     * Usar el DB group 'default' (live MySQL configurado en .env) en lugar del
     * 'tests' (SQLite in-memory por default). Los tests son contra el schema
     * real del tenant — si fuesen destructivos, deberían correr en otra DB.
     */
    protected $DBGroup = 'default';

    /**
     * Reset state acumulado de FeatureTestTrait entre calls.
     * withHeaders()/withBody() hacen array_merge, no reemplazo — sin esto
     * un test no-auth recibe el Bearer del test anterior.
     */
    protected function resetRequestState(): void
    {
        $this->headers = [];
        $this->bodyFormat = '';
        $this->requestBody = '';
    }

    /**
     * Llama un endpoint JSON con auth válida.
     *
     * Wrapper sobre withHeaders()->withBody()->call() — los métodos de
     * FeatureTestTrait son chainable y NO aceptan headers/body via params.
     */
    protected function callApi(string $method, string $path, ?array $body = null, array $extraHeaders = []): \CodeIgniter\Test\TestResponse
    {
        $this->resetRequestState();
        $headers = array_merge([
            'Authorization' => 'Bearer ' . $this->makeJwt(),
            'Accept'        => 'application/json',
            'Content-Type'  => 'application/json',
        ], $extraHeaders);

        $instance = $this->withHeaders($headers);
        if ($body !== null) {
            $instance = $instance->withBody(json_encode($body));
        }
        return $instance->call($method, $path);
    }

    /**
     * Llama un endpoint SIN auth — para verificar que JwtAuthFilter lo rechaza.
     */
    protected function callApiNoAuth(string $method, string $path, ?array $body = null): \CodeIgniter\Test\TestResponse
    {
        $this->resetRequestState();
        $headers = ['Accept' => 'application/json'];
        if ($body !== null) {
            $headers['Content-Type'] = 'application/json';
        }
        $instance = $this->withHeaders($headers);
        if ($body !== null) {
            $instance = $instance->withBody(json_encode($body));
        }
        return $instance->call($method, $path);
    }

    /**
     * Versión raw del wrapper para sobreescribir el header de Authorization
     * (p.ej. para enviar tokens inválidos/expirados sin que callApi() agregue
     * uno válido encima).
     */
    protected function callApiWithAuthHeader(string $method, string $path, string $bearer, ?array $body = null): \CodeIgniter\Test\TestResponse
    {
        $this->resetRequestState();
        $headers = [
            'Authorization' => $bearer,  // p.ej. "Bearer foo" o "Bearer "
            'Accept'        => 'application/json',
        ];
        if ($body !== null) {
            $headers['Content-Type'] = 'application/json';
        }
        $instance = $this->withHeaders($headers);
        if ($body !== null) {
            $instance = $instance->withBody(json_encode($body));
        }
        return $instance->call($method, $path);
    }

    /**
     * Helper común: decodea response JSON o falla con mensaje claro.
     */
    protected function decodeJson(\CodeIgniter\Test\TestResponse $resp): array
    {
        $body = $resp->getJSON();
        $decoded = json_decode($body, true);
        $this->assertNotNull($decoded, "Response no es JSON válido. Body: " . substr((string) $body, 0, 300));
        return $decoded;
    }
}
