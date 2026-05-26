<?php

namespace Tests\Feature\Process;

use Tests\Support\FeatureApiTestCase;

/**
 * Tests para App\Controllers\Api\Process (8 endpoints).
 * Path prefix /api/sale-type/ — el controller se llama Process pero la ruta
 * fue renombrada en Tier 3 (process → sale_type) por el rename de la tabla.
 */
final class ProcessControllerTest extends FeatureApiTestCase
{
    private const BASE = '/api/sale-type';

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
        $resp = $this->callApi($method, self::BASE . $path, $method !== 'GET' ? [] : null);
        $this->assertJsonShape($resp, "$method $path");
    }

    public static function provideAllEndpoints(): array
    {
        return [
            'GET list'             => ['GET',    '/'],
            'POST create'          => ['POST',   '/'],
            'GET search'           => ['GET',    '/search'],
            'GET stats'            => ['GET',    '/stats'],
            'GET show/999999'      => ['GET',    '/999999'],
            'PUT update/999999'    => ['PUT',    '/999999'],
            'DELETE 999999'        => ['DELETE', '/999999'],
            'PATCH estado/999999'  => ['PATCH',  '/999999/estado'],
        ];
    }
}
