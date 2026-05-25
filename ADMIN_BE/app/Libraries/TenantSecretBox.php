<?php

namespace App\Libraries;

use RuntimeException;

/**
 * MIRROR of BE/app/Libraries/TenantSecretBox.php.
 *
 * Both apps must use the SAME TENANT_DB_ENCRYPTION_KEY env value because
 * passwords encrypted by ADMIN_BE are decrypted by the tenant BE on each
 * request. Keep the implementation byte-identical with BE/'s copy.
 */
class TenantSecretBox
{
    private const VERSION = 'v1';
    private const CIPHER  = 'aes-256-gcm';

    private string $key;

    public function __construct(?string $rawKeyHex = null)
    {
        $hex = $rawKeyHex ?? (string) env('TENANT_DB_ENCRYPTION_KEY', '');
        if (!preg_match('/^[0-9a-fA-F]{64}$/', $hex)) {
            throw new RuntimeException(
                'TENANT_DB_ENCRYPTION_KEY must be a 64-char hex string (32 bytes).'
            );
        }
        $this->key = hex2bin($hex);
    }

    public function encrypt(string $plaintext): string
    {
        $nonce = random_bytes(12);
        $tag   = '';
        $ct    = openssl_encrypt($plaintext, self::CIPHER, $this->key, OPENSSL_RAW_DATA, $nonce, $tag);
        if ($ct === false) throw new RuntimeException('openssl_encrypt failed');
        return self::VERSION . '.' . base64_encode($nonce . $tag . $ct);
    }

    public function decrypt(string $envelope): string
    {
        $parts = explode('.', $envelope, 2);
        if (count($parts) !== 2 || $parts[0] !== self::VERSION) {
            throw new RuntimeException('Unknown ciphertext version');
        }
        $raw = base64_decode($parts[1], true);
        if ($raw === false || strlen($raw) < 28) throw new RuntimeException('Malformed ciphertext');
        $nonce = substr($raw, 0, 12);
        $tag   = substr($raw, 12, 16);
        $ct    = substr($raw, 28);
        $pt    = openssl_decrypt($ct, self::CIPHER, $this->key, OPENSSL_RAW_DATA, $nonce, $tag);
        if ($pt === false) throw new RuntimeException('Decryption failed (tag mismatch or wrong key)');
        return $pt;
    }
}
