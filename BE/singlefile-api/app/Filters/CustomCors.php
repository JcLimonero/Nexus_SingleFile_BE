<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class CustomCors implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        // No hacer nada antes de la petición
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Solo agregar headers CORS si no existen ya
        if (!$response->hasHeader('Access-Control-Allow-Origin')) {
            $response->setHeader('Access-Control-Allow-Origin', 'http://localhost:402');
            $response->setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
            $response->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
            $response->setHeader('Access-Control-Allow-Credentials', 'true');
            $response->setHeader('Access-Control-Max-Age', '7200');
        }
        
        return $response;
    }
}
