<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\ClientGroupModel;
use App\Models\ClientGroupProcessModel;
use App\Models\ClientGroupPhaseModel;

/**
 * Routes:
 *   GET    /api/client-group                          list
 *   POST   /api/client-group                          create
 *   GET    /api/client-group/{id}                     detail
 *   PUT    /api/client-group/{id}                     update
 *   PATCH  /api/client-group/{id}/estado              toggle enabled
 *   GET    /api/client-group/{id}/processes           list assigned processes (ordered)
 *   PUT    /api/client-group/{id}/processes           bulk-replace process assignment
 *   GET    /api/client-group/{id}/phases              list assigned phases (ordered)
 *   PUT    /api/client-group/{id}/phases              bulk-replace phase assignment
 */
class ClientGroup extends BaseController
{
    private ClientGroupModel $model;
    private ClientGroupProcessModel $procJunction;
    private ClientGroupPhaseModel $phaseJunction;

    public function __construct()
    {
        $this->model = new ClientGroupModel();
        $this->procJunction = new ClientGroupProcessModel();
        $this->phaseJunction = new ClientGroupPhaseModel();
    }

    private function requireAuth(): ?array
    {
        $user = $this->getAuthenticatedUser();
        if (!$user) {
            $this->response->setJSON([
                'success' => false,
                'message' => 'Token de autorización requerido',
            ])->setStatusCode(401);
        }
        return $user;
    }

    public function index()
    {
        if (!$this->requireAuth()) return $this->response;
        $enabled = $this->request->getGet('enabled');
        $q = $this->model->orderBy('name', 'ASC');
        if ($enabled !== null && $enabled !== '') {
            $q->where('enabled', (int) $enabled);
        }
        return $this->response->setJSON([
            'success' => true,
            'data' => ['client_groups' => $q->findAll()],
        ]);
    }

    public function show(int $id)
    {
        if (!$this->requireAuth()) return $this->response;
        $row = $this->model->find($id);
        if (!$row) return $this->response->setJSON(['success' => false, 'message' => 'No encontrado'])->setStatusCode(404);
        return $this->response->setJSON(['success' => true, 'data' => ['client_group' => $row]]);
    }

    public function create()
    {
        if (!$user = $this->requireAuth()) return $this->response;
        $data = $this->request->getJSON(true) ?? [];
        $data['id_last_user_update'] = $user['user_id'] ?? null;
        $id = $this->model->insert($data, true);
        if (!$id) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Validación fallida',
                'errors' => $this->model->errors(),
            ])->setStatusCode(422);
        }
        return $this->response->setJSON([
            'success' => true,
            'data' => ['client_group' => $this->model->find($id)],
        ])->setStatusCode(201);
    }

    public function update(int $id)
    {
        if (!$user = $this->requireAuth()) return $this->response;
        if (!$this->model->find($id)) {
            return $this->response->setJSON(['success' => false, 'message' => 'No encontrado'])->setStatusCode(404);
        }
        $data = $this->request->getJSON(true) ?? [];
        $data['id_last_user_update'] = $user['user_id'] ?? null;
        if (!$this->model->update($id, $data)) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Validación fallida',
                'errors' => $this->model->errors(),
            ])->setStatusCode(422);
        }
        return $this->response->setJSON([
            'success' => true,
            'data' => ['client_group' => $this->model->find($id)],
        ]);
    }

    public function toggleEnabled(int $id)
    {
        if (!$user = $this->requireAuth()) return $this->response;
        $row = $this->model->find($id);
        if (!$row) return $this->response->setJSON(['success' => false, 'message' => 'No encontrado'])->setStatusCode(404);
        $new = $row['enabled'] ? 0 : 1;
        $this->model->update($id, ['enabled' => $new, 'id_last_user_update' => $user['user_id'] ?? null]);
        return $this->response->setJSON([
            'success' => true,
            'data' => ['client_group' => $this->model->find($id)],
        ]);
    }

    public function processes(int $id)
    {
        if (!$this->requireAuth()) return $this->response;
        if (!$this->model->find($id)) return $this->response->setJSON(['success' => false, 'message' => 'No encontrado'])->setStatusCode(404);
        return $this->response->setJSON([
            'success' => true,
            'data' => ['processes' => $this->procJunction->getProcessesForGroup($id)],
        ]);
    }

    public function setProcesses(int $id)
    {
        if (!$this->requireAuth()) return $this->response;
        if (!$this->model->find($id)) return $this->response->setJSON(['success' => false, 'message' => 'No encontrado'])->setStatusCode(404);
        $payload = $this->request->getJSON(true);
        $items = $payload['processes'] ?? $payload ?? [];
        if (!is_array($items)) return $this->response->setJSON(['success' => false, 'message' => 'Payload inválido'])->setStatusCode(400);
        $this->procJunction->setProcessesForGroup($id, $items);
        return $this->response->setJSON([
            'success' => true,
            'data' => ['processes' => $this->procJunction->getProcessesForGroup($id)],
        ]);
    }

    public function phases(int $id)
    {
        if (!$this->requireAuth()) return $this->response;
        if (!$this->model->find($id)) return $this->response->setJSON(['success' => false, 'message' => 'No encontrado'])->setStatusCode(404);
        return $this->response->setJSON([
            'success' => true,
            'data' => ['phases' => $this->phaseJunction->getPhasesForGroup($id)],
        ]);
    }

    public function setPhases(int $id)
    {
        if (!$this->requireAuth()) return $this->response;
        if (!$this->model->find($id)) return $this->response->setJSON(['success' => false, 'message' => 'No encontrado'])->setStatusCode(404);
        $payload = $this->request->getJSON(true);
        $items = $payload['phases'] ?? $payload ?? [];
        if (!is_array($items)) return $this->response->setJSON(['success' => false, 'message' => 'Payload inválido'])->setStatusCode(400);
        $this->phaseJunction->setPhasesForGroup($id, $items);
        return $this->response->setJSON([
            'success' => true,
            'data' => ['phases' => $this->phaseJunction->getPhasesForGroup($id)],
        ]);
    }
}
