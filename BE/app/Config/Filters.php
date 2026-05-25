<?php

namespace Config;

use CodeIgniter\Config\Filters as BaseFilters;
use CodeIgniter\Filters\Cors;
use CodeIgniter\Filters\CSRF;
use CodeIgniter\Filters\DebugToolbar;
use CodeIgniter\Filters\ForceHTTPS;
use CodeIgniter\Filters\Honeypot;
use CodeIgniter\Filters\InvalidChars;
use CodeIgniter\Filters\PageCache;
use CodeIgniter\Filters\PerformanceMetrics;
use CodeIgniter\Filters\SecureHeaders;
use App\Filters\CustomCors;
use App\Filters\JwtAuthFilter;
use App\Filters\ResponseSnakeCaseFilter;
use App\Filters\TenantGateFilter;
use App\Filters\ThrottleAuthFilter;

class Filters extends BaseFilters
{
    /**
     * Configures aliases for Filter classes to
     * make reading things nicer and simpler.
     *
     * @var array<string, class-string|list<class-string>>
     *
     * [filter_name => classname]
     * or [filter_name => [classname1, classname2, ...]]
     */
    public array $aliases = [
        'csrf'          => CSRF::class,
        'toolbar'       => DebugToolbar::class,
        'honeypot'      => Honeypot::class,
        'invalidchars'  => InvalidChars::class,
        'secureheaders' => SecureHeaders::class,
        'cors'          => Cors::class,
        'customcors'    => CustomCors::class,
        'jwt'           => JwtAuthFilter::class,
        'tenant_gate'   => TenantGateFilter::class,
        'throttle_auth' => ThrottleAuthFilter::class,
        'snake_resp'    => ResponseSnakeCaseFilter::class,
        'forcehttps'    => ForceHTTPS::class,
        'pagecache'     => PageCache::class,
        'performance'   => PerformanceMetrics::class,
    ];

    /**
     * List of special required filters.
     *
     * The filters listed here are special. They are applied before and after
     * other kinds of filters, and always applied even if a route does not exist.
     *
     * Filters set by default provide framework functionality. If removed,
     * those functions will no longer work.
     *
     * @see https://codeigniter.com/user_guide/incoming/filters.html#provided-filters
     *
     * @var array{before: list<string>, after: list<string>}
     */
    public array $required = [
        'before' => [
            // 'forcehttps', // Force Global Secure Requests - Comentado para desarrollo
            // 'pagecache',  // Web Page Caching - Comentado para desarrollo
        ],
        'after' => [
            // 'pagecache',   // Web Page Caching - Comentado para desarrollo
            // 'performance', // Performance Metrics - Comentado para desarrollo
            // 'toolbar',     // Debug Toolbar - Comentado para desarrollo
        ],
    ];

    /**
     * List of filter aliases that are always
     * applied before and after every request.
     *
     * @var array{
     *     before: array<string, array{except: list<string>|string}>|list<string>,
     *     after: array<string, array{except: list<string>|string}>|list<string>
     * }
     */
    public array $globals = [
        'before' => [
            'cors',  // Maneja preflight OPTIONS y headers CORS
            // 'honeypot',
            // 'csrf',
            // 'invalidchars',
        ],
        'after' => [
            // 'customcors', // Desactivado - usa el filtro 'cors' de CodeIgniter
            // 'honeypot',
            // 'secureheaders',
            // 'cors',
        ],
    ];

    /**
     * List of filter aliases that works on a
     * particular HTTP method (GET, POST, etc.).
     *
     * Example:
     * 'POST' => ['foo', 'bar']
     *
     * If you use this, you should disable auto-routing because auto-routing
     * permits any HTTP method to access a controller. Accessing the controller
     * with a method you don't expect could bypass the filter.
     *
     * @var array<string, list<string>>
     */
    public array $methods = [];

    /**
     * List of filter aliases that should run on any
     * before or after URI patterns.
     *
     * Example:
     * 'isLoggedIn' => ['before' => ['account/*', 'profiles/*']]
     *
     * @var array<string, array<string, list<string>>>
     */
    public array $filters = [
        // Tenant license gate — runs before JWT. No-op when MULTITENANT_ENABLED=false.
        'tenant_gate' => [
            'before' => ['api/*'],
            'after'  => ['api/*'],
        ],
        'jwt' => [
            'before' => ['api/*'],
        ],
        'throttle_auth' => [
            'before' => ['api/auth/login', 'api/auth/refresh', 'api/password/*'],
        ],
        // No-op a menos que RESPONSE_SNAKE_CASE=true en .env. Cuando se active,
        // normaliza claves JSON de TODAS las responses /api/* a snake_case.
        'snake_resp' => [
            'after' => ['api/*'],
        ],
    ];
}
