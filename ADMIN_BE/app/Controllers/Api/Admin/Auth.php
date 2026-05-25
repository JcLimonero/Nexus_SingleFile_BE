<?php

namespace App\Controllers\Api\Admin;

use App\Controllers\BaseAdminController;
use App\Models\SuperAdminUserModel;
use App\Libraries\SuperAdminJwt;

class Auth extends BaseAdminController
{
    public function login()
    {
        $data = $this->request->getJSON(true) ?? [];
        $email    = trim((string) ($data['email']    ?? ''));
        $password = (string) ($data['password'] ?? '');
        if ($email === '' || $password === '') {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'email y password son requeridos',
            ])->setStatusCode(400);
        }

        $model = new SuperAdminUserModel();
        $user = $model->findByEmail($email);
        if (!$user || !$model->verifyPassword($user, $password)) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Credenciales inválidas',
            ])->setStatusCode(401);
        }

        $token = (new SuperAdminJwt())->issue($user);

        return $this->response->setJSON([
            'success' => true,
            'data' => [
                'access_token' => $token,
                'user' => [
                    'id'    => (int) $user['id'],
                    'email' => $user['email'],
                    'name'  => $user['name'] ?? null,
                ],
            ],
        ]);
    }
}
