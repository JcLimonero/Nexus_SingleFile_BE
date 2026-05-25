<?php

namespace Tests\Feature\ClientSearch;

use Tests\Support\FeatureApiTestCase;

final class ClientSearchControllerTest extends FeatureApiTestCase
{
    private const BASE = '/api/client-search';

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
            'GET search'         => ['/search'],
            'GET by-agency/1'    => ['/by-agency/1'],
            'GET show/999999'    => ['/999999'],
        ];
    }
}
