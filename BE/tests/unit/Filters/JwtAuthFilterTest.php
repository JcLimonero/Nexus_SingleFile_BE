<?php

namespace Tests\Unit\Filters;

use App\Filters\JwtAuthFilter;
use CodeIgniter\HTTP\Header;
use CodeIgniter\HTTP\IncomingRequest;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\HTTP\URI;
use CodeIgniter\HTTP\UserAgent;
use CodeIgniter\Test\CIUnitTestCase;
use Config\App;

/**
 * Asegura que JwtAuthFilter:
 *   - acepta OPTIONS sin chequear,
 *   - acepta rutas públicas declaradas en PUBLIC_PATHS,
 *   - rechaza con 401 cuando falta Authorization o tiene token inválido.
 *
 * No verifica integración con el modelo JWT (requeriría stub más profundo).
 *
 * @internal
 */
final class JwtAuthFilterTest extends CIUnitTestCase
{
    private JwtAuthFilter $filter;

    protected function setUp(): void
    {
        parent::setUp();
        $this->filter = new JwtAuthFilter();
    }

    public function testOptionsPreflightPassesWithoutAuthCheck(): void
    {
        $req = $this->makeRequest('OPTIONS', '/api/some/endpoint');
        $result = $this->filter->before($req);

        // Sin retornar ResponseInterface = pasa
        $this->assertNull($result);
    }

    public function testPublicPathSkipsAuthCheck(): void
    {
        $req = $this->makeRequest('POST', '/api/auth/login');
        $result = $this->filter->before($req);

        $this->assertNull($result);
    }

    public function testPublicPrefixSkipsAuthCheck(): void
    {
        // miniportal/* es prefix match
        $req = $this->makeRequest('GET', '/api/miniportal/abc-token-123');
        $result = $this->filter->before($req);

        $this->assertNull($result);
    }

    public function testMissingAuthorizationHeaderReturns401(): void
    {
        $req = $this->makeRequest('GET', '/api/validacion/clientes');
        $result = $this->filter->before($req);

        $this->assertInstanceOf(ResponseInterface::class, $result);
        $this->assertSame(401, $result->getStatusCode());

        $body = json_decode($result->getBody(), true);
        $this->assertFalse($body['success']);
    }

    public function testEmptyBearerReturns401(): void
    {
        $req = $this->makeRequest('GET', '/api/validacion/clientes', ['Authorization' => 'Bearer ']);
        $result = $this->filter->before($req);

        $this->assertInstanceOf(ResponseInterface::class, $result);
        $this->assertSame(401, $result->getStatusCode());
    }

    public function testInvalidTokenReturns401(): void
    {
        $req = $this->makeRequest('GET', '/api/validacion/clientes', [
            'Authorization' => 'Bearer not-a-valid-jwt'
        ]);
        $result = $this->filter->before($req);

        $this->assertInstanceOf(ResponseInterface::class, $result);
        $this->assertSame(401, $result->getStatusCode());

        $body = json_decode($result->getBody(), true);
        $this->assertFalse($body['success']);
    }

    public function testAfterIsNoop(): void
    {
        $req = $this->makeRequest('GET', '/api/any');
        $resp = service('response');
        $this->assertNull($this->filter->after($req, $resp));
    }

    private function makeRequest(string $method, string $path, array $headers = []): IncomingRequest
    {
        $uri = new URI('http://example.com' . $path);
        $req = new IncomingRequest(new App(), $uri, '', new UserAgent());
        $req->setMethod($method);

        foreach ($headers as $name => $value) {
            $req->setHeader($name, $value);
        }
        return $req;
    }
}
