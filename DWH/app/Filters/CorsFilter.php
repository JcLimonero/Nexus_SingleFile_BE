<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class CorsFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        if ($request->getMethod() === 'options') {
            $response = service('response');
            $this->addCorsHeaders($response, $request);
            return $response->setStatusCode(200);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        $this->addCorsHeaders($response, $request);
        return $response;
    }

    private function addCorsHeaders(ResponseInterface $response, RequestInterface $request): void
    {
        if ($response->hasHeader('Access-Control-Allow-Origin')) {
            return;
        }
        $origin = $request->getHeaderLine('Origin');
        $allowed = ['http://localhost:3600', 'http://localhost:4200', 'http://localhost:402'];
        if ($origin && (in_array($origin, $allowed, true) || preg_match('#\Ahttp://(localhost|127\.0\.0\.1):\d+\z#', $origin))) {
            $response->setHeader('Access-Control-Allow-Origin', $origin);
        } else {
            $response->setHeader('Access-Control-Allow-Origin', '*');
        }
        $response->setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        $response->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, X-Provider-Token');
        $response->setHeader('Access-Control-Max-Age', '7200');
    }
}
