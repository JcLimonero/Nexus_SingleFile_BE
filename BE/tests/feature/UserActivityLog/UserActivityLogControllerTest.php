<?php

namespace Tests\Feature\UserActivityLog;

use Tests\Support\FeatureApiTestCase;

/**
 * Tests para App\Controllers\Api\UserActivityLog (7 endpoints).
 */
final class UserActivityLogControllerTest extends FeatureApiTestCase
{
    private const BASE = '/api/user-activity-logs';

    /**
     * @dataProvider provideAllEndpoints
     */
    public function testEndpointRequiresAuth(string $method, string $path): void
    {
        $resp = $this->callApiNoAuth($method, self::BASE . $path);
        $body = $this->decodeJson($resp);
        $this->assertFalse($body['success'] ?? true,
            "$method $path debería rechazar sin auth");
    }

    /**
     * @dataProvider provideAllEndpoints
     */
    public function testEndpointRespondsWithJsonShape(string $method, string $path): void
    {
        $resp = $this->callApi($method, self::BASE . $path, $method !== 'GET' ? [] : null);
        $body = $this->decodeJson($resp);
        $this->assertArrayHasKey('success', $body,
            "$method $path debe responder JSON con 'success'. Body: " . substr(json_encode($body), 0, 300));

        if (!($body['success'] ?? false)) {
            fwrite(STDERR, "  ⚠ $method $path → success=false: " . ($body['message'] ?? '') . "\n");
        }
    }

    public static function provideAllEndpoints(): array
    {
        return [
            'GET /'                  => ['GET',    '/'],
            'POST /'                 => ['POST',   '/'],
            'GET expediente/1'       => ['GET',    '/expediente/1'],
            'GET user/admin'         => ['GET',    '/user/admin'],
            'GET action/LOGIN'       => ['GET',    '/action/LOGIN'],
            'GET stats'              => ['GET',    '/stats'],
            'DELETE clean'           => ['DELETE', '/clean'],
        ];
    }
}
