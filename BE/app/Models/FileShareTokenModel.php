<?php

namespace App\Models;

use CodeIgniter\Model;

class FileShareTokenModel extends Model
{
    protected $table = 'file_share_token';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = [
        'id_file', 'token', 'expiration_date', 'enabled',
        'registration_date', 'update_date', 'id_last_user_update'
    ];

    protected $useTimestamps = false;
    protected $dateFormat = 'datetime';
    protected $createdField = 'registration_date';
    protected $updatedField = 'update_date';

    /**
     * Generar o obtener token para un expediente
     */
    public function getOrCreateToken(int $idFile, ?string $expirationDate = null): ?array
    {
        $existing = $this->where('id_file', $idFile)->first();
        if ($existing) {
            $enabled = $existing['enabled'] ?? $existing['Enabled'] ?? 0;
            $expDate = $existing['expiration_date'] ?? $existing['ExpirationDate'] ?? null;
            if ($enabled && (!$expDate || strtotime($expDate) >= time())) {
                return $this->normalizeTokenRow($existing);
            }
            // Token expirado o deshabilitado: renovar con nuevo UUID
            $token = $this->generateUUID();
            $rowId = $existing['id'] ?? $existing['Id'] ?? null;
            $this->update($rowId, [
                'token' => $token,
                'expiration_date' => $expirationDate,
                'enabled' => 1
            ]);
            return $this->normalizeTokenRow($this->find($rowId));
        }

        $token = $this->generateUUID();
        $data = [
            'id_file' => $idFile,
            'token' => $token,
            'expiration_date' => $expirationDate,
            'enabled' => 1
        ];
        $id = $this->insert($data);
        return $id ? $this->normalizeTokenRow($this->find($id)) : null;
    }

    /**
     * Normalizar fila para compatibilidad (IdFile, Token, etc.)
     */
    private function normalizeTokenRow(array $row): array
    {
        return array_merge($row, [
            'IdFile' => $row['id_file'] ?? $row['IdFile'] ?? null,
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

    private function generateUUID(): string
    {
        return sprintf(
            '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }
}
