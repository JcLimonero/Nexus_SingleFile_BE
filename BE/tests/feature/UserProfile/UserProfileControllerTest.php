<?php

namespace Tests\Feature\UserProfile;

use Tests\Support\FeatureApiTestCase;

final class UserProfileControllerTest extends FeatureApiTestCase
{
    private const BASE = '/api/user/profile';

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
            'GET getProfile'         => ['GET',    '/'],
            'PUT default-agency'     => ['PUT',    '/default-agency'],
            'POST upload-image'      => ['POST',   '/upload-image'],
            'DELETE remove-image'    => ['DELETE', '/remove-image'],
            'GET image/1'            => ['GET',    '/image/1'],
        ];
    }
}
