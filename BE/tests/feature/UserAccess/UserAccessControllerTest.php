<?php

namespace Tests\Feature\UserAccess;

use Tests\Support\FeatureApiTestCase;

/**
 * UserAccess routes están bajo /api/user/{id}/access — comparten prefix
 * con User controller.
 */
final class UserAccessControllerTest extends FeatureApiTestCase
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
            'GET access/1'      => ['GET',    '/1/access'],
            'PUT access/1'      => ['PUT',    '/1/access'],
            'DELETE access/1'   => ['DELETE', '/1/access'],
        ];
    }
}
