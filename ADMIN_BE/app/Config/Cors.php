<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

/**
 * CORS for ADMIN_BE — locked to admin.nexfile.app and dev port.
 * Override via CORS_ALLOWED_ORIGINS env (comma-separated).
 */
class Cors extends BaseConfig
{
    /**
     * @var array{
     *      allowedOrigins: list<string>,
     *      allowedOriginsPatterns: list<string>,
     *      supportsCredentials: bool,
     *      allowedHeaders: list<string>,
     *      exposedHeaders: list<string>,
     *      allowedMethods: list<string>,
     *      maxAge: int,
     *  }
     */
    public array $default = [
        'allowedOrigins'         => ['http://localhost:4400'],
        'allowedOriginsPatterns' => [],
        'supportsCredentials'    => true,
        'allowedHeaders'         => ['Content-Type', 'Authorization', 'X-Requested-With'],
        'exposedHeaders'         => [],
        'allowedMethods'         => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        'maxAge'                 => 7200,
    ];

    public function __construct()
    {
        parent::__construct();
        $envOrigins = (string) env('CORS_ALLOWED_ORIGINS', '');
        if ($envOrigins !== '') {
            $this->default['allowedOrigins'] = array_values(array_filter(array_map('trim', explode(',', $envOrigins))));
        }
    }
}
