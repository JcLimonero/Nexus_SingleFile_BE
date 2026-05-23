<?php

namespace Tests\Unit\Filters;

use App\Filters\ThrottleAuthFilter;
use CodeIgniter\HTTP\IncomingRequest;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\HTTP\URI;
use CodeIgniter\HTTP\UserAgent;
use CodeIgniter\Test\CIUnitTestCase;
use Config\App;
use Config\Services;

/**
 * @internal
 */
final class ThrottleAuthFilterTest extends CIUnitTestCase
{
    private ThrottleAuthFilter $filter;

    protected function setUp(): void
    {
        parent::setUp();
        $this->filter = new ThrottleAuthFilter();
        // Cache file system para que el Throttler tenga storage entre asserciones del mismo test
        Services::cache()->clean();
    }

    public function testOptionsPreflightSkipsThrottle(): void
    {
        $req = $this->makeRequest('OPTIONS', '/api/auth/login');
        $this->assertNull($this->filter->before($req));
    }

    public function testWithinLimitPassesThrough(): void
    {
        $req = $this->makeRequest('POST', '/api/auth/login');
        // El filter NO ejecuta el next, simplemente devuelve null si pasa.
        $this->assertNull($this->filter->before($req));
    }

    public function testExceedingLimitReturns429(): void
    {
        // IP única para aislar el bucket de otros tests del mismo run
        $req = $this->makeRequest('POST', '/api/auth/login', '203.0.113.99');

        // 10 hits permitidos por minuto. El 11° debe ser bloqueado.
        for ($i = 0; $i < 10; $i++) {
            $this->assertNull($this->filter->before($req), "Iteración $i debería pasar");
        }

        $blocked = $this->filter->before($req);
        $this->assertInstanceOf(ResponseInterface::class, $blocked);
        $this->assertSame(429, $blocked->getStatusCode());
        $this->assertNotEmpty($blocked->getHeaderLine('Retry-After'));

        $body = json_decode($blocked->getBody(), true);
        $this->assertFalse($body['success']);
        $this->assertStringContainsString('Reintenta', $body['message']);
    }

    public function testDifferentIpsHaveSeparateBuckets(): void
    {
        $req1 = $this->makeRequest('POST', '/api/auth/login', '10.0.0.1');
        $req2 = $this->makeRequest('POST', '/api/auth/login', '10.0.0.2');

        // Agotar bucket de IP 1
        for ($i = 0; $i < 10; $i++) {
            $this->filter->before($req1);
        }
        $this->assertInstanceOf(ResponseInterface::class, $this->filter->before($req1));

        // IP 2 sigue libre
        $this->assertNull($this->filter->before($req2));
    }

    private function makeRequest(string $method, string $path, string $ip = '127.0.0.1'): IncomingRequest
    {
        $uri = new URI('http://example.com' . $path);
        $req = new class (new App(), $uri, '', new UserAgent(), $ip) extends IncomingRequest {
            private string $ipStub;
            public function __construct($app, $uri, $body, $ua, string $ip)
            {
                parent::__construct($app, $uri, $body, $ua);
                $this->ipStub = $ip;
            }
            public function getIPAddress(): string
            {
                return $this->ipStub;
            }
        };
        $req->setMethod($method);
        return $req;
    }
}
