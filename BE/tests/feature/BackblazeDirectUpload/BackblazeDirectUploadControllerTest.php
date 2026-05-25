<?php

namespace Tests\Feature\BackblazeDirectUpload;

use Tests\Support\FeatureApiTestCase;

final class BackblazeDirectUploadControllerTest extends FeatureApiTestCase
{
    private const BASE = '/api/backblaze';

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
            'POST upload'          => ['POST', '/upload'],
            'POST direct-upload'   => ['POST', '/direct-upload'],
            'GET get-private-url'  => ['GET',  '/get-private-url'],
            'GET download'         => ['GET',  '/download'],
        ];
    }
}
