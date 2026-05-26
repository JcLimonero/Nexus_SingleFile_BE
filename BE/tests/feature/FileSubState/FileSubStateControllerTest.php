<?php

namespace Tests\Feature\FileSubState;

use Tests\Support\FeatureApiTestCase;

final class FileSubStateControllerTest extends FeatureApiTestCase
{
    private const BASE = '/api/file-sub-state';

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
            'GET list'        => ['/'],
            'GET active'      => ['/active'],
            'GET show/1'      => ['/1'],
        ];
    }
}
