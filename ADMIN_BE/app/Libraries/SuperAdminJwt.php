<?php

namespace App\Libraries;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use RuntimeException;

/**
 * JWT issuer + validator for super-admin sessions. Realm is COMPLETELY
 * separate from the tenant BE's JWT — different secret, different audience.
 */
class SuperAdminJwt
{
    private string $secret;
    private int $ttl;

    public function __construct()
    {
        $this->secret = (string) env('SUPER_ADMIN_JWT_SECRET', '');
        if (strlen($this->secret) < 32) {
            throw new RuntimeException('SUPER_ADMIN_JWT_SECRET missing or too short (need ≥32 bytes).');
        }
        $this->ttl = (int) env('SUPER_ADMIN_JWT_TTL', 7200);
    }

    public function issue(array $user): string
    {
        $now = time();
        $payload = [
            'iss'   => 'NexFile-admin',
            'aud'   => 'NexFile-admin-client',
            'iat'   => $now,
            'exp'   => $now + $this->ttl,
            'sub_id'=> (int) $user['id'],
            'email' => $user['email'],
            'realm' => 'super_admin',
        ];
        return JWT::encode($payload, $this->secret, 'HS256');
    }

    /** Returns the decoded payload as an array, or null if invalid. */
    public function verify(string $token): ?array
    {
        try {
            $decoded = JWT::decode($token, new Key($this->secret, 'HS256'));
            $arr = json_decode(json_encode($decoded), true);
            if (($arr['realm'] ?? null) !== 'super_admin') return null;
            return $arr;
        } catch (\Throwable $e) {
            return null;
        }
    }
}
