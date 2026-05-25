<?php

namespace Tests\Feature\Documents;

use Tests\Support\FeatureApiTestCase;

/**
 * Tests para App\Controllers\Api\Documents (5 endpoints).
 */
final class DocumentsControllerTest extends FeatureApiTestCase
{
    private const BASE = '/api/documents';

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
            'GET required'           => ['GET',  '/required'],
            'GET missing-liberation' => ['GET',  '/missing-liberation'],
            'GET get-file-name'      => ['GET',  '/get-file-name'],
            'POST upload'            => ['POST', '/upload'],
            'POST add-to-file'       => ['POST', '/add-to-file'],
        ];
    }
}
