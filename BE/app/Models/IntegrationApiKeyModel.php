<?php

declare(strict_types=1);

namespace App\Models;

use CodeIgniter\Model;

class IntegrationApiKeyModel extends Model
{
    protected $table             = 'Integration_ApiKey';
    protected $primaryKey       = 'Id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'Name', 'KeyHash', 'Enabled', 'CreatedDate', 'LastUsedDate',
    ];

    protected $useTimestamps = false;

    public static function hashKey(string $plainKey): string
    {
        return hash('sha256', $plainKey);
    }

    public function findEnabledByPlainKey(string $plainKey): ?array
    {
        $row = $this->where('KeyHash', self::hashKey($plainKey))
            ->where('Enabled', 1)
            ->first();

        return $row ?: null;
    }

    public function findEnabledByKeyHash(string $keyHash): ?array
    {
        $row = $this->where('KeyHash', $keyHash)
            ->where('Enabled', 1)
            ->first();

        return $row ?: null;
    }

    public function markUsed(int $id): void
    {
        $this->update($id, [
            'LastUsedDate' => date('Y-m-d H:i:s'),
        ]);
    }
}
