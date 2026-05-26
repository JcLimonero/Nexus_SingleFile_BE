<?php

namespace Tests\Feature\UserProcess;

use Tests\Support\FeatureApiTestCase;

final class UserProcessControllerTest extends FeatureApiTestCase
{
    private const BASE = '/api/user';

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
            'GET processes/1'         => ['GET',    '/1/processes'],
            'POST processes/1'        => ['POST',   '/1/processes'],
            'DELETE processes/1'      => ['DELETE', '/1/processes'],
            'DELETE processes/1/1'    => ['DELETE', '/1/processes/1'],
            'GET processes/1/stats'   => ['GET',    '/1/processes/stats'],
        ];
    }
}
