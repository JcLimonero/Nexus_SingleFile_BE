<?php

namespace Tests\Feature\CompanyClientImport;

use Tests\Support\FeatureApiTestCase;

/**
 * CompanyClientImport tiene 2 rutas que apuntan al mismo controller:
 *   POST /api/company-client-import/import
 *   POST /api/NexFile-client-import/import   (alias legacy)
 */
final class CompanyClientImportControllerTest extends FeatureApiTestCase
{
    /** @dataProvider provideAllEndpoints */
    public function testEndpointRequiresAuth(string $path): void
    {
        $resp = $this->callApiNoAuth('POST', $path);
        $body = $this->decodeJson($resp);
        $this->assertFalse($body['success'] ?? true, "POST $path no-auth");
    }

    /** @dataProvider provideAllEndpoints */
    public function testEndpointRespondsWithJsonShape(string $path): void
    {
        $resp = $this->callApi('POST', $path, []);
        $body = $this->decodeJson($resp);
        $this->assertArrayHasKey('success', $body);
        if (!($body['success'] ?? false)) {
            fwrite(STDERR, "  ⚠ POST $path → " . ($body['message'] ?? '') . "\n");
        }
    }

    public static function provideAllEndpoints(): array
    {
        return [
            'company-client-import'  => ['/api/company-client-import/import'],
            'NexFile alias'          => ['/api/NexFile-client-import/import'],
        ];
    }
}
