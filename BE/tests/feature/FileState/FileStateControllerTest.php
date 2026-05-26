<?php

namespace Tests\Feature\FileState;

use Tests\Support\FeatureApiTestCase;

final class FileStateControllerTest extends FeatureApiTestCase
{
    private const BASE = '/api/file-state';

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

    /**
     * GET /api/file-state/active solo devuelve fases con is_navigable=1
     * (no debería devolver Liberado, Cancelado, Liberado por Excepción).
     *
     * Antes filtraba por whereIn('name', [...]) hardcoded — frágil. Ahora
     * usa el flag semántico. Este test garantiza que el cambio no regrese
     * accidentalmente.
     */
    public function testActiveExcludesTerminalStates(): void
    {
        $resp = $this->callApi('GET', self::BASE . '/active');
        $body = $this->decodeJson($resp);

        $this->assertTrue($body['success'] ?? false);
        $states = $body['data']['file_states'] ?? [];

        $ids = array_map(static fn($s) => (int) $s['id'], $states);
        $this->assertContains(1, $ids, 'Integración debe estar (is_navigable=1)');
        $this->assertContains(2, $ids, 'Liquidación debe estar (is_navigable=1)');
        $this->assertContains(3, $ids, 'Liberación debe estar (is_navigable=1)');
        $this->assertNotContains(4, $ids, 'Liberado NO debe estar (terminal)');
        $this->assertNotContains(5, $ids, 'Cancelado NO debe estar (terminal)');
        $this->assertNotContains(6, $ids, 'Liberado por Excepción NO debe estar (terminal)');

        // Todos los devueltos tienen is_navigable=1.
        foreach ($states as $s) {
            $this->assertEquals(1, (int) ($s['is_navigable'] ?? 0),
                "id={$s['id']} ({$s['name']}) no debería aparecer sin is_navigable=1");
        }
    }
}
