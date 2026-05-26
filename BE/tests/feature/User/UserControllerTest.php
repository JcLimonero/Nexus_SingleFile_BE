<?php

namespace Tests\Feature\User;

use Tests\Support\FeatureApiTestCase;

/**
 * Tests para App\Controllers\Api\User (14 endpoints).
 */
final class UserControllerTest extends FeatureApiTestCase
{
    private const BASE = '/api/user';

    /**
     * @dataProvider provideAllEndpoints
     */
    public function testEndpointRequiresAuth(string $method, string $path): void
    {
        $resp = $this->callApiNoAuth($method, self::BASE . $path);
        $body = $this->decodeJson($resp);
        $this->assertFalse($body['success'] ?? true,
            "$method $path debería rechazar sin auth — body: " . substr(json_encode($body), 0, 200));
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
            'GET list'                 => ['GET',    '/'],
            'POST create'              => ['POST',   '/'],
            'GET search'               => ['GET',    '/search'],
            'GET stats'                => ['GET',    '/stats'],
            'GET show/1'               => ['GET',    '/1'],
            'PUT update/1'             => ['PUT',    '/1'],
            'DELETE 999999'            => ['DELETE', '/999999'],
            'GET can-delete/1'         => ['GET',    '/1/can-delete'],
            'PATCH disable/999999'     => ['PATCH',  '/999999/disable'],
            'PATCH toggle/999999'      => ['PATCH',  '/999999/toggle-status'],
            'POST change-pwd/999999'   => ['POST',   '/999999/change-password'],
            'POST reset-pwd/999999'    => ['POST',   '/999999/reset-password'],
            'GET check-username'       => ['GET',    '/check-username'],
            'GET check-email'          => ['GET',    '/check-email'],
        ];
    }
}
