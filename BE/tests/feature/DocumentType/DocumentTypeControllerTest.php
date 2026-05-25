<?php

namespace Tests\Feature\DocumentType;

use Tests\Support\FeatureApiTestCase;

final class DocumentTypeControllerTest extends FeatureApiTestCase
{
    private const BASE = '/api/document-type';

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
            'GET list'                          => ['GET',    '/'],
            'POST create'                       => ['POST',   '/'],
            'GET search'                        => ['GET',    '/search'],
            'GET stats'                         => ['GET',    '/stats'],
            'GET active'                        => ['GET',    '/active'],
            'GET configs-to-add/1'              => ['GET',    '/1/configurations-to-add'],
            'POST add-to-configs/1'             => ['POST',   '/1/add-to-configurations'],
            'GET configs/1'                     => ['GET',    '/1/configurations'],
            'DELETE config/1/1'                 => ['DELETE', '/1/configuration/1'],
            'GET show/999999'                   => ['GET',    '/999999'],
            'PUT update/999999'                 => ['PUT',    '/999999'],
            'DELETE 999999'                     => ['DELETE', '/999999'],
            'PATCH toggle/999999'               => ['PATCH',  '/999999/toggle-status'],
        ];
    }
}
