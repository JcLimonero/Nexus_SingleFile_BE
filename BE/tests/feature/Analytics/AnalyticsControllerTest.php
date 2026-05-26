<?php

namespace Tests\Feature\Analytics;

use Tests\Support\FeatureApiTestCase;

/**
 * Tests para App\Controllers\Api\Analytics (21 endpoints — widgets del dashboard).
 *
 * Todos los endpoints son GET, todos requieren auth. Estos endpoints son los
 * más expuestos al usuario (cargan al abrir el dashboard) → si "truenan" se
 * nota inmediato.
 */
final class AnalyticsControllerTest extends FeatureApiTestCase
{
    private const BASE = '/api/analytics';

    /**
     * @dataProvider provideAllEndpoints
     */
    public function testEndpointRequiresAuth(string $path): void
    {
        $resp = $this->callApiNoAuth('GET', self::BASE . $path);
        $body = $this->decodeJson($resp);
        $this->assertFalse($body['success'] ?? true,
            "GET $path debería rechazar sin auth — body: " . substr(json_encode($body), 0, 200));
    }

    /**
     * @dataProvider provideAllEndpoints
     */
    public function testEndpointRespondsWithJsonShape(string $path): void
    {
        // /export devuelve binario (PDF), no JSON — skip
        if ($path === '/export') {
            $resp = $this->callApi('GET', self::BASE . $path);
            $this->assertNotEmpty((string) $resp->getJSON(),
                "GET /export debe devolver algún body (PDF/binary)");
            return;
        }

        $resp = $this->callApi('GET', self::BASE . $path);
        $this->assertJsonShape($resp, "GET $path");
    }

    public static function provideAllEndpoints(): array
    {
        return [
            'dashboard'                      => ['/dashboard'],
            'widget-document-statistics'     => ['/widget-document-statistics'],
            'widget-process-statistics'      => ['/widget-process-statistics'],
            'widget-agency-statistics'       => ['/widget-agency-statistics'],
            'widget-agency-specific-metrics' => ['/widget-agency-specific-metrics'],
            'widget-file-trend-chart'        => ['/widget-file-trend-chart'],
            'widget-file-distribution'       => ['/widget-file-distribution-metrics'],
            'widget-process-distribution'    => ['/widget-process-distribution'],
            'widget-status-distribution'     => ['/widget-status-distribution'],
            'widget-current-month-status'    => ['/widget-current-month-status'],
            'widget-previous-months'         => ['/widget-previous-months'],
            'widget-historical-status'       => ['/widget-historical-status'],
            'advisor-distribution'           => ['/advisor-distribution'],
            'weekly-data'                    => ['/weekly-data'],
            'attention-period'               => ['/attention-period'],
            'current-month-attention'        => ['/current-month-attention'],
            'current-month-liberated'        => ['/current-month-liberated'],
            'total-liberated'                => ['/total-liberated'],
            'orders-by-attention-period'     => ['/orders-by-attention-period'],
            'widget-system-overview'         => ['/widget-system-overview-metrics'],
            'export'                         => ['/export'],
        ];
    }
}
