<?php

namespace Tests\Feature\Phase;

use Tests\Support\FeatureApiTestCase;

final class PhaseControllerTest extends FeatureApiTestCase
{
    private const BASE = '/api/phase';

    public function testActiveForUserRequiresAuth(): void
    {
        $resp = $this->callApiNoAuth('GET', self::BASE . '/active-for-user');
        $body = $this->decodeJson($resp);
        $this->assertFalse($body['success'] ?? true);
    }

    public function testActiveForUserReturnsJsonShape(): void
    {
        $resp = $this->callApi('GET', self::BASE . '/active-for-user');
        $this->assertJsonShape($resp, "GET /active-for-user");
    }

    /**
     * El branch legacy_all NO debe devolver estados terminales (Liberado,
     * Cancelado, Liberado por Excepción) como páginas navegables del sidebar.
     * Hasta el fix, devolvía los 6 — incluido los 3 terminales.
     */
    public function testLegacyAllExcludesTerminalStates(): void
    {
        $resp = $this->callApi('GET', self::BASE . '/active-for-user');
        $body = $this->decodeJson($resp);
        $this->assertTrue($body['success'] ?? false);

        $phases = $body['data']['phases'] ?? [];
        $stateIds = array_column($phases, 'id_expedient_state');

        // Estados navegables (deben estar):
        $this->assertContains(1, $stateIds, 'Integración debe ser navegable');
        $this->assertContains(2, $stateIds, 'Liquidación debe ser navegable');
        $this->assertContains(3, $stateIds, 'Liberación debe ser navegable');

        // Estados terminales (NO deben aparecer):
        $this->assertNotContains(4, $stateIds, 'Liberado no debería ser navegable');
        $this->assertNotContains(5, $stateIds, 'Cancelado no debería ser navegable');
        $this->assertNotContains(6, $stateIds, 'Liberado por Excepción no debería ser navegable');
    }

    /**
     * La response shape incluye los nuevos flags para que el FE pueda
     * gatear el botón "Cargar comprobante" por allows_document_upload
     * en vez de requires_payment_voucher (los conceptos están separados).
     */
    public function testPhaseResponseIncludesUploadFlag(): void
    {
        $resp = $this->callApi('GET', self::BASE . '/active-for-user');
        $body = $this->decodeJson($resp);

        $phases = $body['data']['phases'] ?? [];
        $this->assertNotEmpty($phases, 'al menos una fase debería estar disponible');
        $first = $phases[0];

        $this->assertArrayHasKey('allows_document_upload', $first);
        $this->assertArrayHasKey('is_terminal', $first);
        $this->assertArrayHasKey('requires_payment_voucher', $first);
    }

    /**
     * El branch legacy_all debe devolver las fases ordenadas por
     * expedient_state.display_order (10=Integración, 20=Liquidación,
     * 30=Liberación). Aún si el admin cambia ese orden vía SQL, el
     * endpoint lo respeta.
     */
    public function testLegacyAllOrdersByDisplayOrder(): void
    {
        $resp = $this->callApi('GET', self::BASE . '/active-for-user');
        $body = $this->decodeJson($resp);

        $stateIds = array_column($body['data']['phases'], 'id_expedient_state');

        // Con el backfill default (10/20/30) Integración → Liquidación → Liberación.
        $this->assertSame([1, 2, 3], $stateIds,
            'legacy_all debe ordenar por display_order de expedient_state');
    }
}
