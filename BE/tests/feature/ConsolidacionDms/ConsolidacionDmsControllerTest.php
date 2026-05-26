<?php

namespace Tests\Feature\ConsolidacionDms;

use Tests\Support\FeatureApiTestCase;

final class ConsolidacionDmsControllerTest extends FeatureApiTestCase
{
    public function testPedidosRequiresAuth(): void
    {
        $resp = $this->callApiNoAuth('GET', '/api/consolidacion-dms/pedidos');
        $body = $this->decodeJson($resp);
        $this->assertFalse($body['success'] ?? true);
    }

    public function testPedidosRespondsWithJsonShape(): void
    {
        $resp = $this->callApi('GET', '/api/consolidacion-dms/pedidos');
        $this->assertJsonShape($resp, "GET /api/consolidacion-dms/pedidos");
    }
}
