<?php

namespace Tests\Feature\ClientGroup;

use Tests\Support\FeatureApiTestCase;

final class ClientGroupControllerTest extends FeatureApiTestCase
{
    private const BASE = '/api/client-group';

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
        $this->assertJsonShape($resp, "$method $path");
    }

    public static function provideAllEndpoints(): array
    {
        return [
            'GET list'             => ['GET',   '/'],
            'POST create'          => ['POST',  '/'],
            'GET show/1'           => ['GET',   '/1'],
            'PUT update/999999'    => ['PUT',   '/999999'],
            'PATCH estado/999999'  => ['PATCH', '/999999/estado'],
            'GET processes/1'      => ['GET',   '/1/processes'],
            'PUT processes/1'      => ['PUT',   '/1/processes'],
            'GET phases/1'         => ['GET',   '/1/phases'],
            'PUT phases/1'         => ['PUT',   '/1/phases'],
        ];
    }
}
