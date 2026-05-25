<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

// OPTIONS preflight stubs so CORS filter sees a 2xx for any /api/* path
$routes->options('(:any)', static fn() => service('response')->setStatusCode(200));

$routes->group('api/admin', static function ($routes) {
    $routes->group('auth', static function ($routes) {
        $routes->post('login', 'Api\Admin\Auth::login');
    });

    $routes->group('tenants', static function ($routes) {
        $routes->get('/',                              'Api\Admin\Tenant::index');
        $routes->post('/',                             'Api\Admin\Tenant::create');
        $routes->get('(:num)',                         'Api\Admin\Tenant::show/$1');
        $routes->patch('(:num)/status',                'Api\Admin\Tenant::setStatus/$1');
        $routes->put('(:num)/config',                  'Api\Admin\Tenant::setConfig/$1');
        $routes->post('(:num)/extend-subscription',    'Api\Admin\Tenant::extendSubscription/$1');
    });
});

// Health/info endpoint (no auth needed)
$routes->get('/', static function () {
    return service('response')->setJSON([
        'app' => 'NexFile Admin BE',
        'version' => '0.1.0',
    ]);
});
