<?php

namespace App\Models;

use CodeIgniter\Model;

class SuperAdminUserModel extends Model
{
    protected $table         = 'super_admin_user';
    protected $primaryKey    = 'id';
    protected $returnType    = 'array';
    protected $useAutoIncrement = true;
    protected $protectFields = true;
    protected $allowedFields = ['email', 'password_hash', 'name', 'enabled'];

    public function findByEmail(string $email): ?array
    {
        return $this->where('email', $email)->where('enabled', 1)->first() ?: null;
    }

    public function verifyPassword(array $user, string $password): bool
    {
        return password_verify($password, $user['password_hash'] ?? '');
    }
}
