<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

// Manejar solicitudes OPTIONS para CORS
$routes->options('(:any)', function() {
    return '';
});

// Rutas de la API
$routes->group('api', ['namespace' => 'App\Controllers\Api'], function($routes) {
    
    // Manejar OPTIONS para todas las rutas de API
    $routes->options('(:any)', function() {
        return '';
    });
    
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
    
    // Rutas de procesos
    $routes->group('process', function($routes) {
        $routes->get('/', 'Process::index');
        $routes->post('/', 'Process::create');
        $routes->get('search', 'Process::search');
        $routes->get('stats', 'Process::stats');
        $routes->get('(:num)', 'Process::show/$1');
        $routes->put('(:num)', 'Process::update/$1');
        $routes->delete('(:num)', 'Process::delete/$1');
        $routes->patch('(:num)/estado', 'Process::toggleStatus/$1');
    });

    $routes->group('operation-type', function($routes) {
        $routes->get('/', 'OperationType::index');
        $routes->post('/', 'OperationType::create');
        $routes->get('search', 'OperationType::search');
        $routes->get('stats', 'OperationType::stats');
        $routes->get('(:num)', 'OperationType::show/$1');
        $routes->put('(:num)', 'OperationType::update/$1');
        $routes->delete('(:num)', 'OperationType::delete/$1');
        $routes->patch('(:num)/estado', 'OperationType::toggleStatus/$1');
    });

    // Rutas de tipos de cliente (CRUD)
    $routes->group('costumer-type', function($routes) {
        $routes->get('/', 'CostumerType::index');
        $routes->post('/', 'CostumerType::create');
        $routes->get('search', 'CostumerType::search');
        $routes->get('stats', 'CostumerType::stats');
        $routes->get('active', 'CostumerType::active');
        $routes->get('(:num)', 'CostumerType::show/$1');
        $routes->put('(:num)', 'CostumerType::update/$1');
        $routes->delete('(:num)', 'CostumerType::delete/$1');
        $routes->patch('(:num)/toggle-status', 'CostumerType::toggleStatus/$1');
    });
    
    // Rutas de usuarios (CRUD)
    $routes->group('user', function($routes) {
        $routes->get('/', 'User::index');
        $routes->post('/', 'User::create');
        $routes->get('search', 'User::search');
        $routes->get('stats', 'User::stats');
        $routes->get('(:num)', 'User::show/$1');
        $routes->put('(:num)', 'User::update/$1');
        $routes->delete('(:num)', 'User::delete/$1');
        $routes->patch('(:num)/toggle-status', 'User::toggleStatus/$1');
        $routes->post('(:num)/change-password', 'User::changePassword/$1');
        $routes->post('(:num)/reset-password', 'User::resetPassword/$1');
        $routes->get('check-username', 'User::checkUsernameAvailability');
        $routes->get('check-email', 'User::checkEmailAvailability');
    });
    
    // Rutas de roles de usuario (CRUD)
    $routes->group('user-role', function($routes) {
        $routes->get('/', 'UserRol::index');
        $routes->post('/', 'UserRol::create');
        $routes->get('search', 'UserRol::search');
        $routes->get('stats', 'UserRol::stats');
        $routes->get('active', 'UserRol::active');
        $routes->get('(:num)', 'UserRol::show/$1');
        $routes->put('(:num)', 'UserRol::update/$1');
        $routes->delete('(:num)', 'UserRol::delete/$1');
        $routes->patch('(:num)/toggle-status', 'UserRol::toggleStatus/$1');
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
