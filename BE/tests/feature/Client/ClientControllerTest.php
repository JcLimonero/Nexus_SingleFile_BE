<?php

namespace Tests\Feature\Client;

use Tests\Support\FeatureApiTestCase;

/**
 * Tests para App\Controllers\Api\Client (3 endpoints — alta complejidad: SQL
 * custom + filtros AML + 4+ joins, 1755 hits desde FE).
 */
final class ClientControllerTest extends FeatureApiTestCase
{
    private const BASE = '/api/client';

    /**
     * @dataProvider provideAllEndpoints
     */
    public function testEndpointRequiresAuth(string $method, string $path): void
    {
        $resp = $this->callApiNoAuth($method, self::BASE . $path);
        $body = $this->decodeJson($resp);
        $this->assertFalse($body['success'] ?? true,
            "$method $path debería rechazar sin auth");
    }

    /**
     * @dataProvider provideAllEndpoints
     */
    public function testEndpointRespondsWithJsonShape(string $method, string $path): void
    {
        $resp = $this->callApi($method, self::BASE . $path);
        $this->assertJsonShape($resp, "$method $path");
    }

    public static function provideAllEndpoints(): array
    {
        return [
            'GET list'               => ['GET', '/list'],
            'GET search'             => ['GET', '/search'],
            'GET 1/expedientes'      => ['GET', '/1/expedientes'],
        ];
    }
}
