<?php

namespace Tests\Feature\UserAgency;

use Tests\Support\FeatureApiTestCase;

final class UserAgencyControllerTest extends FeatureApiTestCase
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
        $body = $this->decodeJson($resp);
        $this->assertArrayHasKey('success', $body);
        if (!($body['success'] ?? false)) {
            fwrite(STDERR, "  ⚠ $method $path → " . ($body['message'] ?? '') . "\n");
        }
    }

    public static function provideAllEndpoints(): array
    {
        return [
            'GET agencies/1'             => ['GET',    '/1/agencies'],
            'POST agencies/1'            => ['POST',   '/1/agencies'],
            'DELETE agencies/1'          => ['DELETE', '/1/agencies'],
            'DELETE agencies/1/1'        => ['DELETE', '/1/agencies/1'],
            'GET agencies/1/stats'       => ['GET',    '/1/agencies/stats'],
            'GET agencies-batch'         => ['GET',    '/agencies-batch'],
        ];
    }
}
