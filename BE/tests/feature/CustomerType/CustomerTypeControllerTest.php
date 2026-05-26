<?php

namespace Tests\Feature\CustomerType;

use Tests\Support\FeatureApiTestCase;

/**
 * Path prefix: /api/costumer-type (sic — typo en Routes.php, "costumer" en
 * vez de "customer". El controller se llama CustomerType correctamente).
 */
final class CustomerTypeControllerTest extends FeatureApiTestCase
{
    private const BASE = '/api/costumer-type';

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
            'GET list'              => ['GET',    '/'],
            'POST create'           => ['POST',   '/'],
            'GET search'            => ['GET',    '/search'],
            'GET stats'             => ['GET',    '/stats'],
            'GET active'            => ['GET',    '/active'],
            'GET show/999999'       => ['GET',    '/999999'],
            'PUT update/999999'     => ['PUT',    '/999999'],
            'DELETE 999999'         => ['DELETE', '/999999'],
            'PATCH toggle/999999'   => ['PATCH',  '/999999/toggle-status'],
        ];
    }
}
