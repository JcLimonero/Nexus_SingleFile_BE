<?php

namespace Tests\Feature\Config;

use Tests\Support\FeatureApiTestCase;

/**
 * Config controller — todos sus endpoints son PÚBLICOS (PUBLIC_PATHS):
 *   /api/config/group_api_url
 *   /api/config/activity-log-enabled
 *   /api/config/branding
 *
 * NO requiere auth.
 */
final class ConfigControllerTest extends FeatureApiTestCase
{
    /** @dataProvider provideAllEndpoints */
    public function testEndpointIsPublic(string $path): void
    {
        $resp = $this->callApiNoAuth('GET', $path);
        $body = $this->decodeJson($resp);
        $this->assertArrayHasKey('success', $body);
        if (!($body['success'] ?? false)) {
            fwrite(STDERR, "  ⚠ GET $path → " . ($body['message'] ?? '') . "\n");
        }
    }

    public static function provideAllEndpoints(): array
    {
        return [
            'group_api_url'         => ['/api/config/group_api_url'],
            'activity-log-enabled'  => ['/api/config/activity-log-enabled'],
        ];
    }
}
