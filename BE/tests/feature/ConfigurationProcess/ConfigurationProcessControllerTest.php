<?php

namespace Tests\Feature\ConfigurationProcess;

use Tests\Support\FeatureApiTestCase;

final class ConfigurationProcessControllerTest extends FeatureApiTestCase
{
    private const BASE = '/api/configuration-process';

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
        $this->assertJsonShape($resp, "GET $path");
    }

    public static function provideAllEndpoints(): array
    {
        return [
            'GET enabled'              => ['/enabled'],
            'GET enabled-by-agency/1'  => ['/enabled-by-agency/1'],
        ];
    }
}
