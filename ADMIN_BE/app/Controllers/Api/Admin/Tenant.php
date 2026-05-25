<?php

namespace App\Controllers\Api\Admin;

use App\Controllers\BaseAdminController;
use App\Models\TenantModel;
use App\Libraries\TenantSecretBox;

class Tenant extends BaseAdminController
{
    private TenantModel $model;

    public function __construct()
    {
        $this->model = new TenantModel();
    }

    public function index()
    {
        $rows = $this->model->orderBy('slug', 'ASC')->findAll();
        // Never leak the encrypted password to clients
        foreach ($rows as &$r) unset($r['db_password_encrypted']);
        unset($r);
        return $this->response->setJSON([
            'success' => true,
            'data' => ['tenants' => $rows],
        ]);
    }

    public function show(int $id)
    {
        $row = $this->model->find($id);
        if (!$row) return $this->response->setJSON(['success' => false, 'message' => 'No encontrado'])->setStatusCode(404);
        unset($row['db_password_encrypted']);
        return $this->response->setJSON(['success' => true, 'data' => ['tenant' => $row]]);
    }

    public function create()
    {
        $sa = $this->getSuperAdmin();
        $data = $this->request->getJSON(true) ?? [];

        $required = ['slug', 'name', 'db_host', 'db_name', 'db_username', 'db_password'];
        foreach ($required as $f) {
            if (empty($data[$f])) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => "Campo requerido: {$f}",
                ])->setStatusCode(400);
            }
        }

        try {
            $box = new TenantSecretBox();
            $encrypted = $box->encrypt($data['db_password']);
        } catch (\Throwable $e) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Encryption failed: ' . $e->getMessage(),
            ])->setStatusCode(500);
        }

        $insert = [
            'slug'        => $data['slug'],
            'name'        => $data['name'],
            'status'      => $data['status'] ?? 'active',
            'db_host'     => $data['db_host'],
            'db_port'     => (int) ($data['db_port'] ?? 3306),
            'db_name'     => $data['db_name'],
            'db_username' => $data['db_username'],
            'db_password_encrypted' => $encrypted,
            'created_by_super_admin' => $sa['sub_id'] ?? null,
        ];
        $id = $this->model->insert($insert, true);
        if (!$id) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Validación fallida',
                'errors' => $this->model->errors(),
            ])->setStatusCode(422);
        }
        $row = $this->model->find($id);
        unset($row['db_password_encrypted']);
        return $this->response->setJSON([
            'success' => true,
            'data' => ['tenant' => $row],
        ])->setStatusCode(201);
    }

    public function setStatus(int $id)
    {
        $sa = $this->getSuperAdmin();
        $row = $this->model->find($id);
        if (!$row) return $this->response->setJSON(['success' => false, 'message' => 'No encontrado'])->setStatusCode(404);

        $data = $this->request->getJSON(true) ?? [];
        $newStatus = $data['status'] ?? null;
        if (!in_array($newStatus, ['active', 'grace', 'readonly', 'suspended', 'terminated'], true)) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'status inválido',
            ])->setStatusCode(400);
        }
        $reason = $data['reason'] ?? null;

        $db = \Config\Database::connect();
        $db->transStart();
        $this->model->update($id, ['status' => $newStatus]);
        $db->table('tenant_status_history')->insert([
            'id_tenant' => $id,
            'status_from' => $row['status'],
            'status_to' => $newStatus,
            'changed_by_super_admin' => $sa['sub_id'] ?? null,
            'reason' => $reason,
        ]);
        $db->transComplete();

        return $this->response->setJSON([
            'success' => true,
            'data' => ['tenant' => $this->model->find($id)],
        ]);
    }
}
