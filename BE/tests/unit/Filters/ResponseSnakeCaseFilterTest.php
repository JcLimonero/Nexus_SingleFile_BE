<?php

namespace Tests\Unit\Filters;

use App\Filters\ResponseSnakeCaseFilter;
use CodeIgniter\HTTP\IncomingRequest;
use CodeIgniter\HTTP\Response;
use CodeIgniter\HTTP\URI;
use CodeIgniter\HTTP\UserAgent;
use CodeIgniter\Test\CIUnitTestCase;
use Config\App;

/**
 * @internal
 */
final class ResponseSnakeCaseFilterTest extends CIUnitTestCase
{
    private ResponseSnakeCaseFilter $filter;

    protected function setUp(): void
    {
        parent::setUp();
        $this->filter = new ResponseSnakeCaseFilter();
        // Asegurar que cada test arranca con la env limpia
        putenv('RESPONSE_SNAKE_CASE');
        unset($_ENV['RESPONSE_SNAKE_CASE'], $_SERVER['RESPONSE_SNAKE_CASE']);
    }

    public function testDoesNothingWhenFlagDisabled(): void
    {
        $this->setFlag('false');

        $req = $this->makeRequest();
        $resp = $this->makeJsonResponse(['fileId' => 1, 'numeroPedido' => 'A']);
        $original = $resp->getBody();

        $this->filter->after($req, $resp);

        $this->assertSame($original, $resp->getBody(), 'Body no debe cambiar con flag off');
    }

    public function testNormalizesJsonResponseWhenFlagEnabled(): void
    {
        $this->setFlag('true');

        $req = $this->makeRequest();
        $resp = $this->makeJsonResponse([
            'fileId' => 1,
            'numeroPedido' => 'A',
            'nested' => ['IdFile' => 5, 'Name' => 'X'],
        ]);

        $this->filter->after($req, $resp);

        $body = json_decode($resp->getBody(), true);
        $this->assertSame([
            'file_id' => 1,
            'numero_pedido' => 'A',
            'nested' => ['id_file' => 5, 'name' => 'X'],
        ], $body);
    }

    public function testSkipsNonJsonContentType(): void
    {
        $this->setFlag('true');

        $req = $this->makeRequest();
        $resp = service('response');
        $resp->setContentType('text/html');
        $resp->setBody('<html><body>fooBar</body></html>');
        $original = $resp->getBody();

        $this->filter->after($req, $resp);

        $this->assertSame($original, $resp->getBody(), 'HTML no debe ser tocado');
    }

    public function testSkipsEmptyBody(): void
    {
        $this->setFlag('true');

        $req = $this->makeRequest();
        $resp = $this->makeJsonResponse([]);
        $resp->setBody('');

        $this->filter->after($req, $resp);

        $this->assertSame('', $resp->getBody());
    }

    public function testSkipsInvalidJson(): void
    {
        $this->setFlag('true');

        $req = $this->makeRequest();
        $resp = service('response');
        $resp->setContentType('application/json');
        $resp->setBody('not-json-{{');

        $this->filter->after($req, $resp);

        $this->assertSame('not-json-{{', $resp->getBody());
    }

    private function setFlag(string $value): void
    {
        // CI4 env() lee $_ENV, $_SERVER y getenv() — cubrir todos.
        $_ENV['RESPONSE_SNAKE_CASE'] = $value;
        $_SERVER['RESPONSE_SNAKE_CASE'] = $value;
        putenv("RESPONSE_SNAKE_CASE={$value}");
    }

    private function makeRequest(): IncomingRequest
    {
        $uri = new URI('http://example.com/api/x');
        $req = new IncomingRequest(new App(), $uri, '', new UserAgent());
        $req->setMethod('GET');
        return $req;
    }

    private function makeJsonResponse(array $payload): Response
    {
        $resp = service('response');
        $resp->setContentType('application/json');
        $resp->setBody(json_encode($payload));
        return $resp;
    }
}
