<?php

namespace App\Controllers;

use CodeIgniter\Controller;
use CodeIgniter\HTTP\CLIRequest;
use CodeIgniter\HTTP\IncomingRequest;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;
use App\Models\AuthModel;

/**
 * Class BaseController
 *
 * BaseController provides a convenient place for loading components
 * and performing functions that are needed by all your controllers.
 * Extend this class in any new controllers:
 *     class Home extends BaseController
 *
 * For security be sure to declare any new methods as protected or private.
 */
abstract class BaseController extends Controller
{
    /**
     * Instance of the main Request object.
     *
     * @var CLIRequest|IncomingRequest
     */
    protected $request;

    /**
     * An array of helpers to be loaded automatically upon
     * class instantiation. These helpers will be available
     * to all other controllers that extend BaseController.
     *
     * @var list<string>
     */
    protected $helpers = [];

    /**
     * Be sure to declare properties for any property fetch you initialized.
     * The creation of dynamic property is deprecated in PHP 8.2.
     */
    // protected $session;

    /**
     * @return void
     */
    public function initController(RequestInterface $request, ResponseInterface $response, LoggerInterface $logger)
    {
        // Do Not Edit This Line
        parent::initController($request, $response, $logger);

        // Preload any models, libraries, etc, here.

        // E.g.: $this->session = service('session');
    }

    /**
     * Obtener información del usuario autenticado desde el token JWT
     */
    protected function getAuthenticatedUser()
    {
        try {
            // Obtener token del header Authorization
            $authHeader = $this->request->getHeader('Authorization');
            if (!$authHeader) {
                return null;
            }

            $token = str_replace('Bearer ', '', $authHeader->getValue());
            if (!$token) {
                return null;
            }

            // Verificar token
            $authModel = new AuthModel();
            $result = $authModel->verifyJWT($token);
            
            if ($result['success']) {
                return [
                    'user_id' => $result['data']->user_id,
                    'email' => $result['data']->email,
                    'role_id' => $result['data']->role_id
                ];
            }

            return null;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Verificar si el usuario actual es administrador
     */
    protected function isCurrentUserAdmin()
    {
        $user = $this->getAuthenticatedUser();
        if (!$user) {
            return false;
        }

        // Asumiendo que el rol de administrador tiene ID = 1
        // Puedes ajustar esto según tu estructura de roles
        return $user['role_id'] == 1;
    }

    /**
     * Obtener ID del usuario actual
     */
    protected function getCurrentUserId()
    {
        $user = $this->getAuthenticatedUser();
        return $user ? $user['user_id'] : null;
    }

    /**
     * Obtener rol del usuario actual
     */
    protected function getCurrentUserRoleId()
    {
        $user = $this->getAuthenticatedUser();
        return $user ? $user['role_id'] : null;
    }
}
