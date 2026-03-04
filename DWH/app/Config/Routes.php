<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

// OPTIONS para CORS preflight
$routes->options('nexfile/(:any)', static function () {
    $response = service('response');
    $request = service('request');
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
    return $response->setStatusCode(200);
});

// APIs Nexfile - DWH
$routes->group('nexfile', ['namespace' => 'App\Controllers\Api'], static function ($routes) {
    $routes->get('customers', 'Nexfile::customers');
    $routes->get('orders', 'Nexfile::orders');
    $routes->get('invoices', 'Nexfile::invoices');
});

$routes->get('/', 'Home::index');
