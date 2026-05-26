<?php

namespace Tests\Support;

use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\FeatureTestTrait;

/**
 * Base para tests de endpoints HTTP del API.
 *
 *   class MyControllerTest extends FeatureApiTestCase {
 *     public function testIt() {
 *       $resp = $this->call('GET', '/api/foo', ['headers' => $this->authHeader()]);
 *       $resp->assertOK()->assertJSONExact(['success' => true]);
 *     }
 *   }
 *
 * Notas:
 * - El BE conecta a `nexfile_tenant_test8` (default group). Los tests son contra
 *   esa DB live — diseñá los asserts para no depender de IDs específicos.
 * - JwtAuthFilter está activo en `api/*`. Usá `$this->authHeader()` para auth válida.
 * - TenantGateFilter NO corre en tests (multitenant disabled por defecto).
 */
abstract class FeatureApiTestCase extends CIUnitTestCase
{
    use FeatureTestTrait;
    use JwtTestHelper;

    /**
     * Usar el DB group 'default' (live MySQL configurado en .env) en lugar del
     * 'tests' (SQLite in-memory por default). Los tests son contra el schema
     * real del tenant — si fuesen destructivos, deberían correr en otra DB.
     */
    protected $DBGroup = 'default';

    /**
     * Reset state acumulado de FeatureTestTrait entre calls.
     * withHeaders()/withBody() hacen array_merge, no reemplazo — sin esto
     * un test no-auth recibe el Bearer del test anterior.
     */
    protected function resetRequestState(): void
    {
        $this->headers = [];
        $this->bodyFormat = '';
        $this->requestBody = '';
    }

    /**
     * Llama un endpoint JSON con auth válida.
     *
     * Wrapper sobre withHeaders()->withBody()->call() — los métodos de
     * FeatureTestTrait son chainable y NO aceptan headers/body via params.
     */
    protected function callApi(string $method, string $path, ?array $body = null, array $extraHeaders = []): \CodeIgniter\Test\TestResponse
    {
        $this->resetRequestState();
        $headers = array_merge([
            'Authorization' => 'Bearer ' . $this->makeJwt(),
            'Accept'        => 'application/json',
            'Content-Type'  => 'application/json',
        ], $extraHeaders);

        $instance = $this->withHeaders($headers);
        if ($body !== null) {
            $instance = $instance->withBody(json_encode($body));
        }
        return $instance->call($method, $path);
    }

    /**
     * Llama un endpoint SIN auth — para verificar que JwtAuthFilter lo rechaza.
     */
    protected function callApiNoAuth(string $method, string $path, ?array $body = null): \CodeIgniter\Test\TestResponse
    {
        $this->resetRequestState();
        $headers = ['Accept' => 'application/json'];
        if ($body !== null) {
            $headers['Content-Type'] = 'application/json';
        }
        $instance = $this->withHeaders($headers);
        if ($body !== null) {
            $instance = $instance->withBody(json_encode($body));
        }
        return $instance->call($method, $path);
    }

    /**
     * Versión raw del wrapper para sobreescribir el header de Authorization
     * (p.ej. para enviar tokens inválidos/expirados sin que callApi() agregue
     * uno válido encima).
     */
    protected function callApiWithAuthHeader(string $method, string $path, string $bearer, ?array $body = null): \CodeIgniter\Test\TestResponse
    {
        $this->resetRequestState();
        $headers = [
            'Authorization' => $bearer,  // p.ej. "Bearer foo" o "Bearer "
            'Accept'        => 'application/json',
        ];
        if ($body !== null) {
            $headers['Content-Type'] = 'application/json';
        }
        $instance = $this->withHeaders($headers);
        if ($body !== null) {
            $instance = $instance->withBody(json_encode($body));
        }
        return $instance->call($method, $path);
    }

    /**
     * Helper común: decodea response JSON o falla con mensaje claro.
     */
    protected function decodeJson(\CodeIgniter\Test\TestResponse $resp): array
    {
        $body = $resp->getJSON();
        $decoded = json_decode($body, true);
        $this->assertNotNull($decoded, "Response no es JSON válido. Body: " . substr((string) $body, 0, 300));
        return $decoded;
    }

    /**
     * Mensajes esperados (validación de input legítima o not-found con ID falso) —
     * NO son bugs, no deberían generar warning STDERR. Ampliá la regex si aparece
     * un mensaje legítimo nuevo. Si dudás, dejá que warne y lo evaluamos.
     */
    private const EXPECTED_VALIDATION_PATTERN = '/(?:(?:^|\W)(?:es |son )?requerid[oa]s?|(?:^|\W)no encontrad[oa]s?|(?:^|\W)debe (?:ser|tener|estar|contener)|inv[aá]lid[oa]?(?:[^a-z]|$)|no v[aá]lid[oa]?(?:[^a-z]|$)|Validaci[óo]n fallida|no (?:se )?(?:proporcion|recibi)[oó]\w*|array no vac[íi]o|no tiene imagen|formato inv[aá]lid|usuario no autenticad|no encontr[óo]|Acceso denegad|Se requiere|t[ée]rmino de b[úu]squeda|Permiso denegad|al menos \d|debe ser un|Demasiados intentos|Reintenta en|Error al (?:cambiar|actualizar|guardar|crear|eliminar) (?:el (?:estado|registro|item|elemento)|la )(?:[\w\s]+)?(?:$|\.|\W))/iu';

    /**
     * Verifica que la response JSON tiene shape `{success: bool, ...}` y, si
     * success=false, decide si es bug real (warning STDERR) o validación
     * legítima (silencio).
     *
     * Usar desde tests parametrizados:
     *   $this->assertJsonShape($resp, "$method $path");
     */
    protected function assertJsonShape(\CodeIgniter\Test\TestResponse $resp, string $context = ''): array
    {
        $body = $this->decodeJson($resp);
        $this->assertArrayHasKey('success', $body,
            "$context: response no tiene clave 'success'. Body: " . substr(json_encode($body), 0, 300));

        if (!($body['success'] ?? false)) {
            $msg = (string) ($body['message'] ?? '');
            if (!preg_match(self::EXPECTED_VALIDATION_PATTERN, $msg)) {
                fwrite(STDERR, "  ⚠ $context → success=false: $msg\n");
            }
        }
        return $body;
    }
}
