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

        $db = \Config\Database::connect();
        $sub = $db->table('tenant_subscription')->where('id_tenant', $id)->get()->getRowArray();
        $cfg = $db->table('tenant_config')->where('id_tenant', $id)->orderBy('category')->orderBy('config_key')->get()->getResultArray();
        // Never return the actual value for sensitive entries — only signal that it's set
        foreach ($cfg as &$c) {
            if ((int) ($c['sensitive'] ?? 0) === 1 && !empty($c['config_value'])) {
                $c['config_value'] = '••••••••';
                $c['_has_value'] = true;
            } else {
                $c['_has_value'] = $c['config_value'] !== null && $c['config_value'] !== '';
            }
        }
        unset($c);
        $hist = $db->table('tenant_status_history')
            ->where('id_tenant', $id)
            ->orderBy('changed_at', 'DESC')
            ->limit(100)
            ->get()->getResultArray();

        return $this->response->setJSON([
            'success' => true,
            'data' => [
                'tenant' => $row,
                'subscription' => $sub,
                'config' => $cfg,
                'status_history' => $hist,
            ],
        ]);
    }

    /**
     * Bulk upsert of tenant_config rows. Body shape:
     *   { entries: [{ config_key, config_value, category?, sensitive? }, …] }
     * Sentinel "••••••••" (8 bullets) is treated as "leave existing value
     * unchanged" so sensitive entries can be edited without re-typing.
     */
    public function setConfig(int $id)
    {
        if (!$this->model->find($id)) {
            return $this->response->setJSON(['success' => false, 'message' => 'No encontrado'])->setStatusCode(404);
        }
        $payload = $this->request->getJSON(true) ?? [];
        $entries = $payload['entries'] ?? [];
        if (!is_array($entries)) {
            return $this->response->setJSON(['success' => false, 'message' => 'entries debe ser array'])->setStatusCode(400);
        }
        $db = \Config\Database::connect();
        $upserted = 0;
        foreach ($entries as $e) {
            $key = trim((string) ($e['config_key'] ?? ''));
            if ($key === '') continue;
            $val = (string) ($e['config_value'] ?? '');
            // Preserve existing if sentinel is sent
            if ($val === '••••••••') {
                $existing = $db->table('tenant_config')
                    ->where('id_tenant', $id)
                    ->where('config_key', $key)
                    ->get()->getRowArray();
                if ($existing) $val = $existing['config_value'];
                else continue;
            }
            $row = [
                'id_tenant'    => $id,
                'config_key'   => $key,
                'config_value' => $val,
                'category'     => $e['category']  ?? null,
                'sensitive'    => (int) ($e['sensitive'] ?? 0),
            ];
            $db->query(
                'INSERT INTO tenant_config (id_tenant, config_key, config_value, category, sensitive)
                 VALUES (?, ?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE config_value = VALUES(config_value),
                                         category = VALUES(category),
                                         sensitive = VALUES(sensitive)',
                [$row['id_tenant'], $row['config_key'], $row['config_value'], $row['category'], $row['sensitive']]
            );
            $upserted++;
        }
        return $this->response->setJSON(['success' => true, 'data' => ['upserted' => $upserted]]);
    }

    /**
     * Extend the current subscription period by N days (POST body: {days: 30}).
     * Also moves tenant back to 'active' if it was in grace/readonly/suspended
     * and clears the *_started_at timestamps.
     */
    public function extendSubscription(int $id)
    {
        $sa = $this->getSuperAdmin();
        $row = $this->model->find($id);
        if (!$row) return $this->response->setJSON(['success' => false, 'message' => 'No encontrado'])->setStatusCode(404);

        $payload = $this->request->getJSON(true) ?? [];
        $days = (int) ($payload['days'] ?? 30);
        if ($days < 1 || $days > 3650) {
            return $this->response->setJSON(['success' => false, 'message' => 'days debe ser 1-3650'])->setStatusCode(400);
        }

        $db = \Config\Database::connect();
        $db->transStart();
        $sub = $db->table('tenant_subscription')->where('id_tenant', $id)->get()->getRowArray();
        // Anchor on max(now, current_period_end) so backdated subs still get the full extension
        $base = $sub && $sub['current_period_end'] ? max(strtotime($sub['current_period_end']), time()) : time();
        $newEnd = date('Y-m-d H:i:s', $base + $days * 86400);
        if ($sub) {
            $db->table('tenant_subscription')->where('id_tenant', $id)->update([
                'current_period_end' => $newEnd,
                'next_billing_at'    => $newEnd,
                'last_payment_at'    => date('Y-m-d H:i:s'),
                'grace_started_at'   => null,
                'readonly_started_at'=> null,
                'suspended_at'       => null,
            ]);
        } else {
            $db->table('tenant_subscription')->insert([
                'id_tenant' => $id,
                'plan' => 'standard',
                'current_period_start' => date('Y-m-d H:i:s'),
                'current_period_end' => $newEnd,
                'next_billing_at' => $newEnd,
                'last_payment_at' => date('Y-m-d H:i:s'),
            ]);
        }

        // If tenant was in a non-active state, snap back to active and audit
        if (in_array($row['status'], ['grace', 'readonly', 'suspended', 'terminated'], true)) {
            $this->model->update($id, ['status' => 'active']);
            $db->table('tenant_status_history')->insert([
                'id_tenant' => $id,
                'status_from' => $row['status'],
                'status_to' => 'active',
                'changed_by_super_admin' => $sa['sub_id'] ?? null,
                'reason' => "Subscription extended by {$days} days",
            ]);
        }

        $db->transComplete();
        return $this->response->setJSON(['success' => true, 'data' => [
            'new_period_end' => $newEnd,
            'tenant' => $this->model->find($id),
        ]]);
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
