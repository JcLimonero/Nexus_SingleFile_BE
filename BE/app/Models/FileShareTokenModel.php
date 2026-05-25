<?php

namespace App\Models;

use CodeIgniter\Model;

class FileShareTokenModel extends Model
{
    protected $table = 'expedient_share_token';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = [
        'id_expedient', 'token', 'expiration_date', 'enabled',
        'registration_date', 'update_date', 'id_last_user_update'
    ];

    protected $useTimestamps = false;
    protected $dateFormat = 'datetime';
    protected $createdField = 'registration_date';
    protected $updatedField = 'update_date';

    /**
     * Generar o obtener token para un expediente
     * @param int $idFile ID del expediente
     * @param string|null $expirationDate Fecha de expiración (opcional)
     * @param int|null $userId ID del usuario que genera el token (para id_last_user_update, evita FK con 0)
     */
    public function getOrCreateToken(int $idFile, ?string $expirationDate = null, ?int $userId = null): ?array
    {
        // Default a 7 días si no se especifica
        if ($expirationDate === null) {
            $expirationDate = date('Y-m-d H:i:s', time() + (7 * 24 * 60 * 60));
        }
        $existing = $this->where('id_expedient', $idFile)->first();
        if ($existing) {
            $enabled = $existing['enabled'] ?? $existing['Enabled'] ?? 0;
            $expDate = $existing['expiration_date'] ?? $existing['ExpirationDate'] ?? null;
            if ($enabled && (!$expDate || strtotime($expDate) >= time())) {
                return $this->normalizeTokenRow($existing);
            }
            // Token expirado o deshabilitado: renovar con nuevo UUID
            $token = $this->generateUUID();
            $rowId = $existing['id'] ?? $existing['Id'] ?? null;
            $updateData = [
                'token' => $token,
                'expiration_date' => $expirationDate,
                'enabled' => 1
            ];
            if ($userId !== null) {
                $updateData['id_last_user_update'] = $userId;
            }
            $this->update($rowId, $updateData);
            return $this->normalizeTokenRow($this->find($rowId));
        }

        $token = $this->generateUUID();
        $data = [
            'id_expedient' => $idFile,
            'token' => $token,
            'expiration_date' => $expirationDate,
            'enabled' => 1
        ];
        // id_last_user_update: siempre usar el id del usuario logueado cuando se proporciona
        $data['id_last_user_update'] = $userId ?? null;
        $id = $this->insert($data);
        return $id ? $this->normalizeTokenRow($this->find($id)) : null;
    }

    /**
     * Normalizar fila para compatibilidad (IdFile, Token, etc.)
     */
    private function normalizeTokenRow(array $row): array
    {
        return array_merge($row, [
            'IdFile' => $row['id_expedient'] ?? $row['IdFile'] ?? null,
            'Token' => $row['token'] ?? $row['Token'] ?? null,
            'ExpirationDate' => $row['expiration_date'] ?? $row['ExpirationDate'] ?? null,
            'Enabled' => $row['enabled'] ?? $row['Enabled'] ?? null,
        ]);
    }

    /**
     * Validar token y devolver datos del expediente
     */
    public function validateToken(string $token): ?array
    {
        $row = $this->where('token', $token)->where('enabled', 1)->first();
        if (!$row) {
            return null;
        }
        $expDate = $row['expiration_date'] ?? $row['ExpirationDate'] ?? null;
        if ($expDate && strtotime($expDate) < time()) {
            return null;
        }
        return $this->normalizeTokenRow($row);
    }

    /**
     * Revocar token
     */
    public function revokeToken(string $token): bool
    {
        $row = $this->where('token', $token)->first();
        if (!$row) {
            return false;
        }
        $rowId = $row['id'] ?? $row['Id'] ?? null;
        return $rowId ? (bool) $this->update($rowId, ['enabled' => 0]) : false;
    }

    /**
     * UUIDv4 criptográficamente seguro usando random_bytes (CSPRNG).
     * Reemplazo del mt_rand original que no servía para tokens secretos.
     */
    private function generateUUID(): string
    {
        $bytes = random_bytes(16);
        $bytes[6] = chr((ord($bytes[6]) & 0x0f) | 0x40); // version 4
        $bytes[8] = chr((ord($bytes[8]) & 0x3f) | 0x80); // variant 10
        $hex = bin2hex($bytes);
        return sprintf(
            '%s-%s-%s-%s-%s',
            substr($hex, 0, 8),
            substr($hex, 8, 4),
            substr($hex, 12, 4),
            substr($hex, 16, 4),
            substr($hex, 20, 12)
        );
    }
}
