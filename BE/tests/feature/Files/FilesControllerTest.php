<?php

namespace Tests\Feature\Files;

use Tests\Support\FeatureApiTestCase;

/**
 * Tests para App\Controllers\Api\Files (9 endpoints).
 */
final class FilesControllerTest extends FeatureApiTestCase
{
    private const BASE = '/api/files';

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
            'GET by-client'              => ['GET',  '/by-client'],
            'GET by-agency-client'       => ['GET',  '/by-agency-client'],
            'POST create-from-NexFile'   => ['POST', '/create-from-NexFile'],
            'POST create-from-NexFile-new'=> ['POST', '/create-from-NexFile-new'],
            'POST check-existing-orders' => ['POST', '/check-existing-orders'],
            'POST repair-client-relation'=> ['POST', '/repair-client-relation'],
            'POST delete'                => ['POST', '/delete'],
            'POST compare-dms-orders'    => ['POST', '/compare-dms-orders'],
        ];
    }
}
