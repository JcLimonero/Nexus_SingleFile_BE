<?php

namespace App\Models;

use CodeIgniter\Model;

class ClientGroupModel extends Model
{
    protected $table         = 'client_group';
    protected $primaryKey    = 'id';
    protected $returnType    = 'array';
    protected $useAutoIncrement = true;
    protected $protectFields = true;
    protected $allowedFields = [
        'name',
        'description',
        'enabled',
        'id_last_user_update',
    ];

    protected $useTimestamps  = false;
    protected $createdField   = 'registration_date';
    protected $updatedField   = 'update_date';

    protected $validationRules = [
        'name'    => 'required|min_length[2]|max_length[200]|is_unique[client_group.name,id,{id}]',
        'enabled' => 'permit_empty|in_list[0,1]',
    ];
    protected $validationMessages = [
        'name' => [
            'required'  => 'El nombre del grupo es requerido',
            'is_unique' => 'Ya existe un grupo con este nombre',
        ],
    ];
}
