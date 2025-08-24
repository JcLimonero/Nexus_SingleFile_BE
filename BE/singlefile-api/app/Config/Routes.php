<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

// Rutas de la API
$routes->group('api', ['namespace' => 'App\Controllers\Api'], function($routes) {
    
        // Rutas de autenticación
    $routes->group('auth', function($routes) {
        $routes->post('login', 'Auth::login');
        $routes->post('verify', 'Auth::verify');
        $routes->post('refresh', 'Auth::refresh');
        $routes->post('logout', 'Auth::logout');
    });
    
    // Rutas de gestión de contraseñas
    $routes->group('password', function($routes) {
        $routes->post('change', 'PasswordManager::changePassword');
        $routes->post('reset', 'PasswordManager::resetPassword');
        $routes->get('migration-status', 'PasswordManager::getMigrationStatus');
        $routes->post('force-migration', 'PasswordManager::forceMigration');
    });
    
    // Rutas de agencias
    $routes->group('agency', function($routes) {
        $routes->get('/', 'Agency::index');
        $routes->post('/', 'Agency::create');
        $routes->get('search', 'Agency::search');
        $routes->get('regions', 'Agency::regions');
        $routes->get('stats', 'Agency::stats');
        $routes->get('(:num)', 'Agency::show/$1');
        $routes->put('(:num)', 'Agency::update/$1');
        $routes->delete('(:num)', 'Agency::delete/$1');
        $routes->patch('(:num)/toggle-status', 'Agency::toggleStatus/$1');
    });
    
    // Rutas de perfil de usuario
    $routes->group('user/profile', function($routes) {
        $routes->post('upload-image', 'UserProfile::uploadImage');
        $routes->delete('remove-image', 'UserProfile::removeImage');
        $routes->get('image/(:num)', 'UserProfile::getProfileImage/$1');
    });
});

// Ruta por defecto
$routes->get('/', 'Home::index');
