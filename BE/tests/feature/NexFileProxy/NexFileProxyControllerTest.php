<?php

namespace Tests\Feature\NexFileProxy;

use Tests\Support\FeatureApiTestCase;

final class NexFileProxyControllerTest extends FeatureApiTestCase
{
    private const BASE = '/api/vgd';

    /** @dataProvider provideAllEndpoints */
    public function testEndpointRequiresAuth(string $path): void
    {
        $resp = $this->callApiNoAuth('GET', self::BASE . $path);
        $body = $this->decodeJson($resp);
        $this->assertFalse($body['success'] ?? true, "GET $path no-auth");
    }

    /** @dataProvider provideAllEndpoints */
    public function testEndpointRespondsWithJsonShape(string $path): void
    {
        $resp = $this->callApi('GET', self::BASE . $path);
        $body = $this->decodeJson($resp);
        $this->assertArrayHasKey('success', $body);
        if (!($body['success'] ?? false)) {
            fwrite(STDERR, "  ⚠ GET $path → " . ($body['message'] ?? '') . "\n");
        }
    }

    public static function provideAllEndpoints(): array
    {
        return [
            'GET NexFileorderslastest'  => ['/NexFileorderslastest'],
            'GET NexFileinvoices'       => ['/NexFileinvoices'],
            'GET NexFilecustomer'       => ['/NexFilecustomer'],
        ];
    }
}
