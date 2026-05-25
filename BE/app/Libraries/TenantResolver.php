<?php

namespace App\Libraries;

use Config\Database;

/**
 * Resolves the current request's tenant by extracting the subdomain from the
 * Host header and looking it up in the central DB.
 *
 * Multitenancy is gated by env('MULTITENANT_ENABLED'). When off, resolve()
 * returns null and callers fall back to the legacy single-tenant `nexfile` DB.
 *
 * Lookups are cached in a per-process static map for the lifetime of the
 * request (CI4 isn't long-lived, so no TTL is needed yet — when we move to
 * FrankenPHP / Octane we'll swap this for the CI4 Cache service).
 */
class TenantResolver
{
    /** @var array<string, array<string,mixed>|null> */
    private static array $cache = [];

    public static function isEnabled(): bool
    {
        $v = env('MULTITENANT_ENABLED', 'false');
        return $v === true || $v === '1' || $v === 'true';
    }

    public static function extractSlug(string $host): ?string
    {
        // Strip port if present
        $host = preg_replace('/:\d+$/', '', strtolower(trim($host)));
        if ($host === '' || $host === null) return null;

        // localhost/IP — no tenant
        if ($host === 'localhost' || filter_var($host, FILTER_VALIDATE_IP)) return null;

        $parts = explode('.', $host);
        // Need at least subdomain.domain.tld (3 parts), otherwise no tenant slug.
        if (count($parts) < 3) return null;

        // Reserved subdomains (admin, api, www, etc.) are NOT tenant slugs.
        $reserved = ['www', 'admin', 'api', 'app', 'cdn', 'static', 'assets'];
        $sub = $parts[0];
        if (in_array($sub, $reserved, true)) return null;

        // Sanity: slug must look like a tenant identifier
        if (!preg_match('/^[a-z0-9][a-z0-9_-]{0,49}$/', $sub)) return null;

        return $sub;
    }

    /**
     * Look up the tenant row by slug. Returns null if not found or if
     * multi-tenancy is disabled. Result is cached for the rest of the request.
     */
    public static function resolveBySlug(string $slug): ?array
    {
        if (!self::isEnabled()) return null;
        if (array_key_exists($slug, self::$cache)) return self::$cache[$slug];

        try {
            $db = Database::connect('central');
            $row = $db->table('tenant')->where('slug', $slug)->get()->getRowArray();
            self::$cache[$slug] = $row ?: null;
        } catch (\Throwable $e) {
            log_message('error', 'TenantResolver: central DB unreachable: ' . $e->getMessage());
            self::$cache[$slug] = null;
        }
        return self::$cache[$slug];
    }

    /**
     * Convenience: resolve directly from the HTTP request host header.
     * Returns null if multi-tenancy is disabled, host has no subdomain, or
     * the slug doesn't match any active tenant.
     */
    public static function resolveFromHost(string $host): ?array
    {
        $slug = self::extractSlug($host);
        return $slug ? self::resolveBySlug($slug) : null;
    }
}
