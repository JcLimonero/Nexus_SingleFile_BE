<?php

namespace Tests\Feature\PasswordManager;

use Tests\Support\FeatureApiTestCase;

final class PasswordManagerControllerTest extends FeatureApiTestCase
{
    private const BASE = '/api/password';

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
            'POST change'              => ['POST', '/change'],
            'POST reset'               => ['POST', '/reset'],
            'GET migration-status'     => ['GET',  '/migration-status'],
            'POST force-migration'     => ['POST', '/force-migration'],
        ];
    }
}
