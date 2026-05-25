<?php

namespace App\Models;

use CodeIgniter\Model;

class TenantModel extends Model
{
    protected $table         = 'tenant';
    protected $primaryKey    = 'id';
    protected $returnType    = 'array';
    protected $useAutoIncrement = true;
    protected $protectFields = true;
    protected $allowedFields = [
        'slug',
        'name',
        'status',
        'db_host',
        'db_port',
        'db_name',
        'db_username',
        'db_password_encrypted',
        'created_by_super_admin',
    ];

    protected $validationRules = [
        'slug' => 'required|alpha_dash|min_length[2]|max_length[50]|is_unique[tenant.slug,id,{id}]',
        'name' => 'required|min_length[2]|max_length[200]',
        'db_host' => 'required',
        'db_name' => 'required|alpha_dash',
        'db_username' => 'required',
    ];

    public function findBySlug(string $slug): ?array
    {
        return $this->where('slug', $slug)->first() ?: null;
    }
}
