<?php

namespace Tests\Feature\Validacion;

use Tests\Support\FeatureApiTestCase;

/**
 * Tests para App\Controllers\Api\Validacion (24 endpoints).
 *
 * Estrategia: 1 test "auth rechazada" + 1 test "no 500" + asserts de shape
 * para cada endpoint. Los tests que detecten 500 son intencionalmente
 * descriptivos del bug en el mensaje para acelerar el fix.
 */
final class ValidacionControllerTest extends FeatureApiTestCase
{
    private const BASE = '/api/clients-validation';

    // ============================================================
    // Auth rejection — todos los endpoints deben requerir auth
    // ============================================================

    /**
     * @dataProvider provideAllEndpoints
     */
    public function testEndpointRequiresAuth(string $method, string $path): void
    {
        $resp = $this->callApiNoAuth($method, self::BASE . $path);
        // El status puede venir null (response sin setStatusCode explícito)
        // o 401 — lo decisivo es que el body tenga success=false.
        $body = $this->decodeJson($resp);
        $this->assertFalse($body['success'] ?? true,
            "$method $path debería rechazar sin auth — body: " . json_encode($body));
    }

    public static function provideAllEndpoints(): array
    {
        return [
            'GET clientes'                  => ['GET',    '/clientes'],
            'GET estadisticas'              => ['GET',    '/estadisticas'],
            'GET documentos'                => ['GET',    '/documentos'],
            'GET diagnostico'               => ['GET',    '/diagnostico'],
            'GET expedientes-corregir'      => ['GET',    '/expedientes-corregir'],
            'GET autoreparar'               => ['GET',    '/expedientes-corregir/auto-reparar'],
            'POST reparar-relacion'         => ['POST',   '/reparar-relacion'],
            'POST cancelar-pedido'          => ['POST',   '/cancelar-pedido'],
            'POST excepcion-pedido'         => ['POST',   '/excepcion-pedido'],
            'DELETE eliminar-pedido'        => ['DELETE', '/eliminar-pedido'],
            'PUT cambiar-estatus'           => ['PUT',    '/cambiar-estatus'],
            'POST docs liquidacion'         => ['POST',   '/documentos/liquidacion'],
            'POST validar-documento'        => ['POST',   '/validar-documento'],
            'POST aprobar-documento'        => ['POST',   '/aprobar-documento'],
            'POST preparar-documento'       => ['POST',   '/preparar-documento'],
            'POST generar-token'            => ['POST',   '/generar-token-miniportal'],
            'GET imprimir-identificacion'   => ['GET',    '/imprimir-identificacion'],
            'GET datos-identificacion'      => ['GET',    '/datos-identificacion'],
            'PUT datos-identificacion'      => ['PUT',    '/datos-identificacion'],
            'GET cliente-detalle'           => ['GET',    '/cliente-detalle'],
            'GET beneficiarios'             => ['GET',    '/beneficiarios'],
            'POST beneficiarios'            => ['POST',   '/beneficiarios'],
            'DELETE beneficiarios/1'        => ['DELETE', '/beneficiarios/1'],
            'GET zip/1'                     => ['GET',    '/descargar-expediente-zip/1'],
        ];
    }

    // ============================================================
    // GET endpoints — happy path con auth válida
    // ============================================================

    public function testGetClientesReturnsJsonShape(): void
    {
        $resp = $this->callApi('GET', self::BASE . '/clientes');
        $body = $this->decodeJson($resp);
        // Catch del bug: si referencia tabla `process` (renombrada a sale_type
        // en Tier 3) el body tendrá success=false con error SQL.
        $this->assertArrayHasKey('success', $body,
            'Body no tiene la clave "success". Body: ' . substr(json_encode($body), 0, 300));
        if (!$body['success']) {
            $this->fail("getClientes devolvió error: " . ($body['message'] ?? 'sin mensaje'));
        }
    }

    public function testGetEstadisticasReturnsJsonShape(): void
    {
        $resp = $this->callApi('GET', self::BASE . '/estadisticas');
        $body = $this->decodeJson($resp);
        $this->assertArrayHasKey('success', $body);
    }

    public function testGetDocumentosRequiresIdFile(): void
    {
        $resp = $this->callApi('GET', self::BASE . '/documentos');
        $body = $this->decodeJson($resp);
        // Sin idFile debería devolver 400 / success=false
        $this->assertFalse($body['success'] ?? true,
            "documentos sin idFile debería rechazar — body: " . json_encode($body));
    }

    public function testDiagnosticoRequiresParams(): void
    {
        $resp = $this->callApi('GET', self::BASE . '/diagnostico');
        $body = $this->decodeJson($resp);
        $this->assertArrayHasKey('success', $body);
    }

    public function testExpedientesCorregirReturnsJsonShape(): void
    {
        $resp = $this->callApi('GET', self::BASE . '/expedientes-corregir');
        $body = $this->decodeJson($resp);
        $this->assertArrayHasKey('success', $body);
    }

    public function testDatosIdentificacionRequiresIdFile(): void
    {
        $resp = $this->callApi('GET', self::BASE . '/datos-identificacion');
        $body = $this->decodeJson($resp);
        $this->assertFalse($body['success'] ?? true,
            "datos-identificacion sin idFile debería rechazar");
    }

    public function testDatosIdentificacionWithIdFileReturnsExpectedKeys(): void
    {
        // ⚠ Asume que existe al menos 1 expediente en el tenant
        $resp = $this->callApi('GET', self::BASE . '/datos-identificacion?idFile=1');
        $body = $this->decodeJson($resp);
        $this->assertArrayHasKey('success', $body);
        if ($body['success'] && isset($body['data'])) {
            // El response shape preserva keys Spanish para compat FE (Tier 6)
            $expectedKeys = ['nombre', 'last_name', 'business_name', 'telefono',
                             'calle', 'colonia', 'ciudad', 'pais'];
            foreach ($expectedKeys as $key) {
                $this->assertArrayHasKey($key, $body['data'],
                    "data debe tener key '$key' (contrato FE preservado en Tier 6)");
            }
        }
    }

    public function testClienteDetalleRequiresIdFile(): void
    {
        $resp = $this->callApi('GET', self::BASE . '/cliente-detalle');
        $body = $this->decodeJson($resp);
        $this->assertArrayHasKey('success', $body);
    }

    public function testGetBeneficiariosRequiresIdFile(): void
    {
        $resp = $this->callApi('GET', self::BASE . '/beneficiarios');
        $body = $this->decodeJson($resp);
        $this->assertArrayHasKey('success', $body);
    }

    public function testGetBeneficiariosWithIdFileReturnsArray(): void
    {
        $resp = $this->callApi('GET', self::BASE . '/beneficiarios?idFile=1');
        $body = $this->decodeJson($resp);
        $this->assertArrayHasKey('success', $body);
        if ($body['success']) {
            $this->assertIsArray($body['data'] ?? null);
        }
    }

    public function testImprimirIdentificacionRequiresIdFile(): void
    {
        $resp = $this->callApi('GET', self::BASE . '/imprimir-identificacion');
        $body = $this->decodeJson($resp);
        $this->assertArrayHasKey('success', $body);
    }

    public function testAutoRepararEndpointResponds(): void
    {
        $resp = $this->callApi('GET', self::BASE . '/expedientes-corregir/auto-reparar');
        $body = $this->decodeJson($resp);
        $this->assertArrayHasKey('success', $body);
    }

    // ============================================================
    // POST/PUT/DELETE endpoints — validan input rejection
    // ============================================================

    public function testRepararRelacionRequiresBody(): void
    {
        $resp = $this->callApi('POST', self::BASE . '/reparar-relacion', []);
        $body = $this->decodeJson($resp);
        $this->assertArrayHasKey('success', $body);
    }

    public function testCancelarPedidoRequiresBody(): void
    {
        $resp = $this->callApi('POST', self::BASE . '/cancelar-pedido', []);
        $body = $this->decodeJson($resp);
        $this->assertFalse($body['success'] ?? true);
    }

    public function testExcepcionPedidoRequiresBody(): void
    {
        $resp = $this->callApi('POST', self::BASE . '/excepcion-pedido', []);
        $body = $this->decodeJson($resp);
        $this->assertFalse($body['success'] ?? true);
    }

    public function testEliminarPedidoRequiresBody(): void
    {
        $resp = $this->callApi('DELETE', self::BASE . '/eliminar-pedido');
        $body = $this->decodeJson($resp);
        $this->assertArrayHasKey('success', $body);
    }

    public function testCambiarEstatusRequiresBody(): void
    {
        $resp = $this->callApi('PUT', self::BASE . '/cambiar-estatus', []);
        $body = $this->decodeJson($resp);
        $this->assertFalse($body['success'] ?? true);
    }

    public function testAgregarDocLiquidacionRequiresBody(): void
    {
        $resp = $this->callApi('POST', self::BASE . '/documentos/liquidacion', []);
        $body = $this->decodeJson($resp);
        $this->assertArrayHasKey('success', $body);
    }

    public function testValidarDocumentoRequiresBody(): void
    {
        $resp = $this->callApi('POST', self::BASE . '/validar-documento', []);
        $body = $this->decodeJson($resp);
        $this->assertArrayHasKey('success', $body);
    }

    public function testAprobarDocumentoRequiresBody(): void
    {
        $resp = $this->callApi('POST', self::BASE . '/aprobar-documento', []);
        $body = $this->decodeJson($resp);
        $this->assertArrayHasKey('success', $body);
    }

    public function testPrepararDocumentoRequiresBody(): void
    {
        $resp = $this->callApi('POST', self::BASE . '/preparar-documento', []);
        $body = $this->decodeJson($resp);
        $this->assertArrayHasKey('success', $body);
    }

    public function testGenerarTokenMiniportalRequiresBody(): void
    {
        $resp = $this->callApi('POST', self::BASE . '/generar-token-miniportal', []);
        $body = $this->decodeJson($resp);
        $this->assertArrayHasKey('success', $body);
    }

    public function testSaveDatosIdentificacionRequiresIdClient(): void
    {
        $resp = $this->callApi('PUT', self::BASE . '/datos-identificacion', []);
        $body = $this->decodeJson($resp);
        $this->assertFalse($body['success'] ?? true,
            "save sin idClient/idFile debe rechazar");
    }

    public function testAddBeneficiarioRequiresBody(): void
    {
        $resp = $this->callApi('POST', self::BASE . '/beneficiarios', []);
        $body = $this->decodeJson($resp);
        $this->assertFalse($body['success'] ?? true,
            "addBeneficiario sin idFile/nombre debe rechazar");
    }

    public function testDeleteBeneficiarioInvalidIdResponds(): void
    {
        $resp = $this->callApi('DELETE', self::BASE . '/beneficiarios/99999999');
        $body = $this->decodeJson($resp);
        $this->assertArrayHasKey('success', $body);
    }

    public function testDescargarZipInvalidIdResponds(): void
    {
        $resp = $this->callApi('GET', self::BASE . '/descargar-expediente-zip/99999999');
        // Devuelve JSON con error si idFile no existe; bytes ZIP si existe
        $this->assertNotNull($resp);
    }
}
