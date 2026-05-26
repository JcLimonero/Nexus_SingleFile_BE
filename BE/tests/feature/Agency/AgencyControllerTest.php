<?php

namespace Tests\Feature\Agency;

use Tests\Support\FeatureApiTestCase;

/**
 * Tests para App\Controllers\Api\Agency (9 endpoints).
 */
final class AgencyControllerTest extends FeatureApiTestCase
{
    private const BASE = '/api/agency';

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
            'GET list'              => ['GET',    '/'],
            'POST create'           => ['POST',   '/'],
            'GET search'            => ['GET',    '/search'],
            'GET stats'             => ['GET',    '/stats'],
            'GET show/999999'       => ['GET',    '/999999'],
            'PUT update/999999'     => ['PUT',    '/999999'],
            'DELETE 999999'         => ['DELETE', '/999999'],
            'PATCH toggle/999999'   => ['PATCH',  '/999999/toggle-status'],
        ];
    }
}
