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
     * Obtener información del usuario autenticado desde el token JWT.
     * Si JwtAuthFilter ya validó el token, reusa el payload sin reverificar.
     */
    protected function getAuthenticatedUser()
    {
        try {
            // Fast path: JwtAuthFilter ya validó
            if (!empty($_REQUEST['_auth_user'])) {
                $payload = $_REQUEST['_auth_user'];
                return [
                    'user_id' => $payload->user_id ?? null,
                    'email'   => $payload->email ?? null,
                    'role_id' => $payload->role_id ?? null,
                ];
            }

            $authHeader = $this->request->getHeader('Authorization');
            if (!$authHeader) {
                return null;
            }

            $token = str_replace('Bearer ', '', $authHeader->getValue());
            if (!$token) {
                return null;
            }

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

        // Administrador = 7, Soporte = 8, Demo = 15 (admin sin mostrar IDs en frontend)
        return in_array((int) $user['role_id'], [7, 8, 15], true);
    }

    /**
     * Verificar si el usuario tiene un rol específico
     */
    protected function hasUserRole($roleId)
    {
        $user = $this->getAuthenticatedUser();
        if (!$user) {
            return false;
        }

        return $user['role_id'] == $roleId;
    }

    /**
     * Verificar si el usuario tiene permisos de administrador o un rol específico
     */
    protected function isUserAdminOrRole($roleId)
    {
        return $this->isCurrentUserAdmin() || $this->hasUserRole($roleId);
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

    /**
     * Devuelve un response 403 si el usuario actual no es admin, null si todo OK.
     * Uso:   if ($r = $this->requireAdmin()) return $r;
     */
    protected function requireAdmin()
    {
        if (!$this->isCurrentUserAdmin()) {
            return $this->response
                ->setStatusCode(403)
                ->setJSON([
                    'success' => false,
                    'message' => 'Requiere permisos de administrador'
                ]);
        }
        return null;
    }

    /**
     * Bloquea una operación que solo puede ejecutar el operador del WIZARD
     * desde la administración central (no desde la app web del tenant).
     *
     * Aplica a creación/eliminación/toggle de companies y agencies — el modelo
     * de cobro es por agencia, así que el cliente no puede modificar el
     * conteo billable. El operador edita estas tablas vía MySQL directo
     * desde el WIZARD; este endpoint no tiene super-admin "real" que pueda
     * bypasear, sólo es un bloqueo absoluto para clientes.
     *
     * Uso:  return $this->responseClientWriteBlocked('agency');
     */
    protected function responseClientWriteBlocked(string $resource)
    {
        return $this->response
            ->setStatusCode(403)
            ->setJSON([
                'success' => false,
                'message' => "La creación/eliminación de $resource está deshabilitada para clientes. Solicita el cambio al operador del wizard."
            ]);
    }

    /**
     * IDs de agencias a las que el usuario tiene acceso (incluye su default_agency
     * + las asignadas en agency_user). Admin = null (sin filtro).
     *
     * @return int[]|null  array vacío si no tiene ninguna, null si es admin
     */
    protected function getAllowedAgencyIds(): ?array
    {
        if ($this->isCurrentUserAdmin()) {
            return null;
        }
        $userId = $this->getCurrentUserId();
        if (!$userId) {
            return [];
        }

        $db = \Config\Database::connect();

        $rows = $db->table('agency_user')
            ->select('id_agency')
            ->where('id_user', $userId)
            ->get()
            ->getResultArray();
        $ids = array_map('intval', array_column($rows, 'id_agency'));

        $defaultRow = $db->table('user')
            ->select('default_agency')
            ->where('id', $userId)
            ->get()
            ->getRowArray();
        if (!empty($defaultRow['default_agency'])) {
            $ids[] = (int) $defaultRow['default_agency'];
        }

        return array_values(array_unique(array_filter($ids)));
    }

    /**
     * Verifica que el expediente pertenezca a una agencia accesible para el usuario.
     */
    protected function userCanAccessFile($fileId): bool
    {
        if ($this->isCurrentUserAdmin()) {
            return true;
        }
        $allowed = $this->getAllowedAgencyIds();
        if ($allowed === null) {
            return true; // admin
        }
        if (empty($allowed)) {
            return false;
        }

        $row = \Config\Database::connect()
            ->table('expedient')
            ->select('id_agency')
            ->where('id', (int) $fileId)
            ->get()
            ->getRowArray();

        return $row && in_array((int) $row['id_agency'], $allowed, true);
    }

    /**
     * Devuelve 403 si el user no puede acceder al expediente. null si OK.
     */
    protected function requireFileAccess($fileId)
    {
        if (!$this->userCanAccessFile($fileId)) {
            return $this->response
                ->setStatusCode(403)
                ->setJSON([
                    'success' => false,
                    'message' => 'No tienes acceso a este expediente'
                ]);
        }
        return null;
    }

    /**
     * Devuelve 409 si el expediente está en un estado que NO permite carga
     * de documentos (Liberado, Cancelado, etc. — cualquier estado con
     * allows_document_upload=0). 404 si el expediente no existe. null si OK.
     *
     * Patrón de uso: `if ($r = $this->requireExpedientAllowsUpload($idFile)) return $r;`
     *
     * Reusable en los 4 endpoints de upload: Documents, Validacion::agregarDocumentoLiquidacion,
     * Miniportal y BackblazeDirectUpload. Lo que cada uno valida adicionalmente
     * (auth, available_to_client, etc.) es ortogonal a este check.
     */
    protected function requireExpedientAllowsUpload($fileId)
    {
        $row = \Config\Database::connect()->query(
            'SELECT fs.allows_document_upload, fs.name AS state_name
             FROM expedient e
             INNER JOIN expedient_state fs ON fs.id = e.id_current_expedient_state
             WHERE e.id = ?',
            [(int) $fileId]
        )->getRowArray();

        if (!$row) {
            return $this->response
                ->setStatusCode(404)
                ->setJSON([
                    'success' => false,
                    'message' => 'Expediente no existe',
                ]);
        }

        if ((int) $row['allows_document_upload'] !== 1) {
            return $this->response
                ->setStatusCode(409)
                ->setJSON([
                    'success' => false,
                    'message' => "El expediente está en estado '{$row['state_name']}' y no admite carga de documentos",
                ]);
        }

        return null;
    }

    /**
     * Wrap exceptions: en production devuelve mensaje genérico al cliente
     * (sin getMessage / trace) y loggea el detalle real al stderr / writable/logs.
     *
     * Uso:  catch (\Throwable $e) { return $this->serverError($e, 'No se pudo guardar'); }
     */
    protected function serverError(\Throwable $e, string $userMessage = 'Error interno del servidor'): ResponseInterface
    {
        $correlationId = bin2hex(random_bytes(6));
        log_message('error', "[corr:{$correlationId}] {$e->getMessage()}\n{$e->getTraceAsString()}");

        $body = [
            'success' => false,
            'message' => $userMessage,
            'correlation_id' => $correlationId,
        ];

        if (ENVIRONMENT !== 'production') {
            $body['debug'] = [
                'exception' => get_class($e),
                'message'   => $e->getMessage(),
                'file'      => $e->getFile() . ':' . $e->getLine(),
            ];
        }

        return $this->response->setStatusCode(500)->setJSON($body);
    }
}
