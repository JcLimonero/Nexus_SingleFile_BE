<?php

namespace Config;

use CodeIgniter\Config\Filters as BaseFilters;
use CodeIgniter\Filters\Cors;
use App\Filters\SuperAdminJwtFilter;

class Filters extends BaseFilters
{
    public array $aliases = [
        'cors'       => Cors::class,
        'admin_jwt'  => SuperAdminJwtFilter::class,
    ];

    public array $required = [
        'before' => [],
        'after'  => [],
    ];

    public array $globals = [
        'before' => [
            'cors',
        ],
        'after' => [],
    ];

    public array $methods = [];

    public array $filters = [
        'admin_jwt' => [
            'before' => ['api/admin/*'],
        ],
    ];
}
