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
    
    // Rutas de tipos de documento (CRUD)
    $routes->group('document-type', function($routes) {
        $routes->get('/', 'DocumentType::index');
        $routes->post('/', 'DocumentType::create');
        $routes->get('search', 'DocumentType::search');
        $routes->get('stats', 'DocumentType::stats');
        $routes->get('active', 'DocumentType::active');
        $routes->get('(:num)', 'DocumentType::show/$1');
        $routes->put('(:num)', 'DocumentType::update/$1');
        $routes->delete('(:num)', 'DocumentType::delete/$1');
        $routes->patch('(:num)/toggle-status', 'DocumentType::toggleStatus/$1');
    });

    // Rutas de documentos requeridos
    $routes->group('documento-requerido', function($routes) {
        $routes->get('/', 'DocumentoRequerido::index');
        $routes->post('/', 'DocumentoRequerido::create');
        $routes->get('stats', 'DocumentoRequerido::stats');
        $routes->put('reorder', 'DocumentoRequerido::reorder');
        $routes->post('duplicate', 'DocumentoRequerido::duplicate');
        $routes->get('(:num)', 'DocumentoRequerido::show/$1');
        $routes->put('(:num)', 'DocumentoRequerido::update/$1');
        $routes->delete('(:num)', 'DocumentoRequerido::delete/$1');
    });

    // Rutas de logs de actividad de usuarios
    $routes->group('user-activity-logs', function($routes) {
        $routes->get('/', 'UserActivityLog::index');
        $routes->post('/', 'UserActivityLog::create');
        $routes->get('user/(:any)', 'UserActivityLog::getUserLogs/$1');
        $routes->get('action/(:any)', 'UserActivityLog::getActionLogs/$1');
        $routes->get('stats', 'UserActivityLog::getStats');
        $routes->delete('clean', 'UserActivityLog::cleanOldLogs');
    });
    
    // Rutas de estados de archivo (File_Status)
    $routes->group('file-status', function($routes) {
        $routes->get('/', 'FileStatus::index');
        $routes->get('active', 'FileStatus::active');
        $routes->get('(:num)', 'FileStatus::show/$1');
    });
    
    // Rutas de subestados de archivo (File_SubStatus)
    $routes->group('file-sub-status', function($routes) {
        $routes->get('/', 'FileSubStatus::index');
        $routes->get('active', 'FileSubStatus::active');
        $routes->get('(:num)', 'FileSubStatus::show/$1');
    });
    
    // Rutas de motivos (File_Reasons)
    $routes->group('file-reason', function($routes) {
        $routes->get('/', 'FileReason::index');
        $routes->post('/', 'FileReason::create');
        $routes->get('search', 'FileReason::search');
        $routes->get('stats', 'FileReason::stats');
        $routes->get('active', 'FileReason::active');
        $routes->get('(:num)', 'FileReason::show/$1');
        $routes->put('(:num)', 'FileReason::update/$1');
        $routes->delete('(:num)', 'FileReason::delete/$1');
        $routes->patch('(:num)/toggle-status', 'FileReason::toggleStatus/$1');
    });
    
    // Rutas de motivos extraordinarios (File_Extraordinary_Reasons)
    $routes->group('file-extraordinary-reason', function($routes) {
        $routes->get('/', 'FileExtraordinaryReason::index');
        $routes->post('/', 'FileExtraordinaryReason::create');
        $routes->get('search', 'FileExtraordinaryReason::search');
        $routes->get('stats', 'FileExtraordinaryReason::stats');
        $routes->get('active', 'FileExtraordinaryReason::active');
        $routes->get('(:num)', 'FileExtraordinaryReason::show/$1');
        $routes->put('(:num)', 'FileExtraordinaryReason::update/$1');
        $routes->delete('(:num)', 'FileExtraordinaryReason::delete/$1');
        $routes->patch('(:num)/toggle-status', 'FileExtraordinaryReason::toggleStatus/$1');
    });
    
    // Rutas de documentos (CRUD)
    $routes->group('document', function($routes) {
        $routes->get('/', 'Document::index');
        $routes->post('/', 'Document::create');
        $routes->get('search', 'Document::search');
        $routes->get('stats', 'Document::stats');
        $routes->get('by-file/(:num)', 'Document::getByFile/$1');
        $routes->get('(:num)', 'Document::show/$1');
        $routes->put('(:num)', 'Document::update/$1');
        $routes->delete('(:num)', 'Document::delete/$1');
        $routes->patch('(:num)/toggle-status', 'Document::toggleStatus/$1');
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
        
        // Rutas de accesos consolidados
        $routes->get('(:num)/access', 'UserAccess::getUserAccess/$1');
        $routes->put('(:num)/access', 'UserAccess::updateUserAccess/$1');
        $routes->delete('(:num)/access', 'UserAccess::clearUserAccess/$1');
        
        // Rutas específicas de agencias
        $routes->get('(:num)/agencies', 'UserAgency::getUserAgencies/$1');
        $routes->post('(:num)/agencies', 'UserAgency::assignAgencies/$1');
        $routes->delete('(:num)/agencies', 'UserAgency::removeAllAgencies/$1');
        $routes->delete('(:num)/agencies/(:num)', 'UserAgency::removeAgency/$1/$2');
        $routes->get('(:num)/agencies/stats', 'UserAgency::getStats/$1');
        
        // Rutas específicas de procesos
        $routes->get('(:num)/processes', 'UserProcess::getUserProcesses/$1');
        $routes->post('(:num)/processes', 'UserProcess::assignProcesses/$1');
        $routes->delete('(:num)/processes', 'UserProcess::removeAllProcesses/$1');
        $routes->delete('(:num)/processes/(:num)', 'UserProcess::removeProcess/$1/$2');
        $routes->get('(:num)/processes/stats', 'UserProcess::getStats/$1');
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
        $routes->get('/', 'UserProfile::getProfile');
        $routes->post('upload-image', 'UserProfile::uploadImage');
        $routes->delete('remove-image', 'UserProfile::removeImage');
        $routes->get('image/(:num)', 'UserProfile::getProfileImage/$1');
    });

    // Rutas para imágenes de perfil (nuevo controlador)
    $routes->group('user/profile-image', function($routes) {
        $routes->post('upload', 'UserProfileImage::uploadProfileImage');
        $routes->get('get', 'UserProfileImage::getProfileImage');
        $routes->get('get/(:num)', 'UserProfileImage::getProfileImage/$1');
        $routes->get('info', 'UserProfileImage::getProfileImageInfo');
        $routes->get('info/(:num)', 'UserProfileImage::getProfileImageInfo/$1');
        $routes->delete('remove', 'UserProfileImage::removeProfileImage');
    });

    // Rutas de validación de clientes (Mesa de Control)
    $routes->group('clients-validation', function($routes) {
        $routes->get('clientes', 'Validacion::getClientes');
        $routes->get('estadisticas', 'Validacion::getEstadisticas');
        $routes->get('documentos', 'Validacion::getDocumentos');
        $routes->post('cancelar-pedido', 'Validacion::cancelarPedido');
        $routes->post('excepcion-pedido', 'Validacion::excepcionPedido');
        $routes->delete('eliminar-pedido', 'Validacion::eliminarPedido');
        $routes->put('cambiar-estatus', 'Validacion::cambiarEstatus');
    });
});

// Ruta por defecto
$routes->get('/', 'Home::index');
