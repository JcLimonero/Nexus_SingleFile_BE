<?php

namespace App\Libraries;

use Config\Database;

/**
 * Builds a CI4 database connection for the given tenant row, decrypting the
 * stored DB password on the fly with TenantSecretBox. Caches per-slug so
 * repeated lookups within one request reuse the same connection.
 */
class TenantConnection
{
    /** @var array<string, \CodeIgniter\Database\BaseConnection> */
    private static array $connections = [];

    public static function forTenant(array $tenant)
    {
        $slug = $tenant['slug'] ?? null;
        if (!$slug) throw new \RuntimeException('Tenant row missing slug');
        if (isset(self::$connections[$slug])) return self::$connections[$slug];

        $box = new TenantSecretBox();
        $password = $box->decrypt((string) ($tenant['db_password_encrypted'] ?? ''));

        $cfg = config('Database')->default;
        $cfg['hostname'] = $tenant['db_host'] ?? $cfg['hostname'];
        $cfg['port']     = (int) ($tenant['db_port'] ?? $cfg['port']);
        $cfg['database'] = $tenant['db_name'] ?? '';
        $cfg['username'] = $tenant['db_username'] ?? '';
        $cfg['password'] = $password;

        $conn = Database::connect($cfg, false);
        self::$connections[$slug] = $conn;
        return $conn;
    }
}
