<?php

namespace Tests\Feature\UserProfileImage;

use Tests\Support\FeatureApiTestCase;

final class UserProfileImageControllerTest extends FeatureApiTestCase
{
    private const BASE = '/api/user/profile-image';

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
            'POST upload'      => ['POST',   '/upload'],
            'GET get'          => ['GET',    '/get'],
            'GET get/1'        => ['GET',    '/get/1'],
            'GET info'         => ['GET',    '/info'],
            'GET info/1'       => ['GET',    '/info/1'],
            'DELETE remove'    => ['DELETE', '/remove'],
        ];
    }
}
