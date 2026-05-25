import * as crypto from 'crypto';

/**
 * TypeScript mirror of BE/app/Libraries/TenantSecretBox.php (and the
 * matching copy in ADMIN_BE). All three must produce envelopes that
 * the others can decrypt, so the format is fixed:
 *
 *   "v1." + base64(12-byte nonce || 16-byte tag || ciphertext)
 *
 * Key: 32 bytes, supplied as 64-char hex. Same env var name in all apps:
 *   TENANT_DB_ENCRYPTION_KEY
 */
const VERSION = 'v1';
const CIPHER = 'aes-256-gcm';

export function encryptTenantPassword(plaintext: string, hexKey: string): string {
  if (!/^[0-9a-fA-F]{64}$/.test(hexKey)) {
    throw new Error('TENANT_DB_ENCRYPTION_KEY must be a 64-char hex string (32 bytes)');
  }
  const key = Buffer.from(hexKey, 'hex');
  const nonce = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(CIPHER, key, nonce);
  const ct = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  const envelope = Buffer.concat([nonce, tag, ct]);
  return `${VERSION}.${envelope.toString('base64')}`;
}

export function decryptTenantPassword(envelope: string, hexKey: string): string {
  const [v, b64] = envelope.split('.', 2);
  if (v !== VERSION) throw new Error('Unknown ciphertext version');
  const raw = Buffer.from(b64, 'base64');
  if (raw.length < 28) throw new Error('Malformed ciphertext');
  const nonce = raw.subarray(0, 12);
  const tag = raw.subarray(12, 28);
  const ct = raw.subarray(28);
  const key = Buffer.from(hexKey, 'hex');
  const decipher = crypto.createDecipheriv(CIPHER, key, nonce);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ct), decipher.final()]).toString('utf8');
}

/**
 * bcrypt password hashing for the tenant's admin user. PHP's password_verify()
 * accepts bcrypt $2y$/$2b$/$2a$ hashes interchangeably, so the FE-generated
 * $2b$ hash works directly when verified by the tenant BE.
 */
export async function bcryptHash(plaintext: string, rounds = 12): Promise<string> {
  // bcryptjs is bundled (no native deps); we keep this isolated to allow
  // swapping to argon2 later without touching call sites.
  const bcrypt = await import('bcryptjs');
  return bcrypt.hash(plaintext, rounds);
}
