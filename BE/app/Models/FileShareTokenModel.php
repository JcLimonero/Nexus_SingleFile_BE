<?php

namespace App\Models;

use CodeIgniter\Model;

class FileShareTokenModel extends Model
{
    protected $table = 'File_ShareToken';
    protected $primaryKey = 'Id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = [
        'IdFile', 'Token', 'ExpirationDate', 'Enabled',
        'RegistrationDate', 'UpdateDate', 'IdLastUserUpdate'
    ];

    protected $useTimestamps = false;
    protected $dateFormat = 'datetime';
    protected $createdField = 'RegistrationDate';
    protected $updatedField = 'UpdateDate';

    /**
     * Generar o obtener token para un expediente
     */
    public function getOrCreateToken(int $idFile, ?string $expirationDate = null): ?array
    {
        $existing = $this->where('IdFile', $idFile)->first();
        if ($existing) {
            if ($existing['Enabled'] && (!$existing['ExpirationDate'] || strtotime($existing['ExpirationDate']) >= time())) {
                return $existing;
            }
            // Token expirado o deshabilitado: renovar con nuevo UUID
            $token = $this->generateUUID();
            $this->update($existing['Id'], [
                'Token' => $token,
                'ExpirationDate' => $expirationDate,
                'Enabled' => 1
            ]);
            return $this->find($existing['Id']);
        }

        $token = $this->generateUUID();
        $data = [
            'IdFile' => $idFile,
            'Token' => $token,
            'ExpirationDate' => $expirationDate,
            'Enabled' => 1
        ];
        $id = $this->insert($data);
        return $id ? $this->find($id) : null;
    }

    /**
     * Validar token y devolver datos del expediente
     */
    public function validateToken(string $token): ?array
    {
        $row = $this->where('Token', $token)->where('Enabled', 1)->first();
        if (!$row) {
            return null;
        }
        if ($row['ExpirationDate'] && strtotime($row['ExpirationDate']) < time()) {
            return null;
        }
        return $row;
    }

    /**
     * Revocar token
     */
    public function revokeToken(string $token): bool
    {
        $row = $this->where('Token', $token)->first();
        return $row ? (bool) $this->update($row['Id'], ['Enabled' => 0]) : false;
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
