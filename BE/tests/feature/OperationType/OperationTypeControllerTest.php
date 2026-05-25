<?php

namespace Tests\Feature\OperationType;

use Tests\Support\FeatureApiTestCase;

final class OperationTypeControllerTest extends FeatureApiTestCase
{
    private const BASE = '/api/operation-type';

    /** @dataProvider provideAllEndpoints */
    public function testEndpointRequiresAuth(string $method, string $path): void
    {
        $resp = $this->callApiNoAuth($method, self::BASE . $path);
        $body = $this->decodeJson($resp);
        $this->assertFalse($body['success'] ?? true, "$method $path no-auth");
    }

    /** @dataProvider provideAllEndpoints */
    public function testEndpointRespondsWithJsonShape(string $method, string $path): void
    {
        $resp = $this->callApi($method, self::BASE . $path, $method !== 'GET' ? [] : null);
        $body = $this->decodeJson($resp);
        $this->assertArrayHasKey('success', $body);
        if (!($body['success'] ?? false)) {
            fwrite(STDERR, "  ⚠ $method $path → " . ($body['message'] ?? '') . "\n");
        }
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
