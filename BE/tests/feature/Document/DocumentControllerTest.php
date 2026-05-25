<?php

namespace Tests\Feature\Document;

use Tests\Support\FeatureApiTestCase;

/**
 * Tests para App\Controllers\Api\Document (9 endpoints) — el controller más
 * usado del sistema (2083 hits en FE).
 */
final class DocumentControllerTest extends FeatureApiTestCase
{
    private const BASE = '/api/document';

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
            'GET list'              => ['GET',    '/'],
            'POST create'           => ['POST',   '/'],
            'GET search'            => ['GET',    '/search'],
            'GET stats'             => ['GET',    '/stats'],
            'GET by-file/1'         => ['GET',    '/by-file/1'],
            'GET show/999999'       => ['GET',    '/999999'],
            'PUT update/999999'     => ['PUT',    '/999999'],
            'DELETE 999999'         => ['DELETE', '/999999'],
            'PATCH toggle/999999'   => ['PATCH',  '/999999/toggle-status'],
        ];
    }
}
