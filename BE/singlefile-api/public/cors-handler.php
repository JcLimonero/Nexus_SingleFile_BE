<?php
/**
 * CORS Handler - Maneja peticiones OPTIONS directamente
 * Este archivo se ejecuta antes que CodeIgniter para manejar CORS
 */

// Verificar si es una petición OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Configurar headers CORS
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
    header('Access-Control-Max-Age: 7200');
    header('Content-Length: 0');
    header('Content-Type: text/plain');
    
    // Responder con código 200 OK
    http_response_code(200);
    exit();
}

// Si no es OPTIONS, continuar con el flujo normal
// Incluir el index.php de CodeIgniter
require_once __DIR__ . '/index.php';
