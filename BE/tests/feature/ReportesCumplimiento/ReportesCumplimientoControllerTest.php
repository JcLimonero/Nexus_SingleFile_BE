<?php

namespace Tests\Feature\ReportesCumplimiento;

use Tests\Support\FeatureApiTestCase;

/**
 * Tests para App\Controllers\Api\ReportesCumplimiento (6 endpoints).
 */
final class ReportesCumplimientoControllerTest extends FeatureApiTestCase
{
    private const BASE = '/api/compliance-reports';

    /**
     * @dataProvider provideAllEndpoints
     */
    public function testEndpointRequiresAuth(string $path): void
    {
        $resp = $this->callApiNoAuth('GET', self::BASE . $path);
        $body = $this->decodeJson($resp);
        $this->assertFalse($body['success'] ?? true,
            "GET $path debería rechazar sin auth");
    }

    /**
     * @dataProvider provideAllEndpoints
     */
    public function testEndpointRespondsWithJsonShape(string $path): void
    {
        $resp = $this->callApi('GET', self::BASE . $path);
        $this->assertJsonShape($resp, "GET $path");
    }

    public static function provideAllEndpoints(): array
    {
        return [
            'dashboard'                  => ['/dashboard'],
            'cases-pld-alert'            => ['/cases-pld-alert'],
            'summary-by-agency'          => ['/summary-by-agency'],
            'pending-documents'          => ['/pending-documents'],
            'cases-without-beneficiary'  => ['/cases-without-beneficiary'],
            'cases-without-notice'       => ['/cases-without-notice'],
        ];
    }
}
