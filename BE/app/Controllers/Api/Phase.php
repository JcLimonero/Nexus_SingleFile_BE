<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\ClientGroupPhaseModel;

/**
 * Routes:
 *   GET /api/phase/active-for-user
 *     Resolves the current user's tenant chain
 *       user.default_agency → agency.id_company → company.id_client_group → client_group_phase
 *     and returns the phases assigned to that group, ordered by display_order.
 *     Each row is enriched with the expedient_state.name and requires_payment_voucher flag.
 *
 * Fallback: if the user has no agency, the company has no group, or the group has
 * no phase assignments, we return ALL active rows of expedient_state (legacy single-set
 * behavior). This keeps the endpoint useful before any group is configured.
 */
class Phase extends BaseController
{
    private ClientGroupPhaseModel $junction;

    public function __construct()
    {
        $this->junction = new ClientGroupPhaseModel();
    }

    public function activeForUser()
    {
        $user = $this->getAuthenticatedUser();
        if (!$user) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Token de autorización requerido',
            ])->setStatusCode(401);
        }

        $userId = (int) ($user['user_id'] ?? 0);
        $db = \Config\Database::connect();

        // Resolve user → agency → company → client_group
        $row = $db->query('
            SELECT u.default_agency, a.id_company, c.id_client_group
            FROM `user` u
            LEFT JOIN agency a  ON a.id = u.default_agency
            LEFT JOIN company c ON c.id = a.id_company
            WHERE u.id = ?
        ', [$userId])->getRowArray();

        $idClientGroup = (int) ($row['id_client_group'] ?? 0);
        $source = 'group';
        $phases = [];

        if ($idClientGroup > 0) {
            $phases = $this->junction->getPhasesForGroup($idClientGroup);
        }

        // Fallback if no group assignment exists yet.
        // Filtra is_navigable=1 para no mostrar fases terminales (Liberado,
        // Cancelado, Excepción) como páginas navegables — son estados del
        // lifecycle pero no son páginas del sidebar.
        if (!$phases) {
            $source = 'legacy_all';
            $phases = $db->table('expedient_state')
                ->select('id, name, enabled, requires_payment_voucher, allows_document_upload, is_terminal')
                ->where('enabled', 1)
                ->where('is_navigable', 1)
                ->orderBy('id', 'ASC')
                ->get()
                ->getResultArray();
            // Normalize shape so FE has consistent fields
            $phases = array_map(static function ($p, $i) {
                return [
                    'id' => null,
                    'id_client_group' => null,
                    'id_expedient_state' => (int) $p['id'],
                    'display_order' => $i,
                    'enabled' => (int) ($p['enabled'] ?? 1),
                    'phase_name' => $p['name'],
                    'phase_enabled' => (int) ($p['enabled'] ?? 1),
                    'requires_payment_voucher' => (int) ($p['requires_payment_voucher'] ?? 0),
                    'allows_document_upload' => (int) ($p['allows_document_upload'] ?? 0),
                    'is_terminal' => (int) ($p['is_terminal'] ?? 0),
                ];
            }, $phases, array_keys($phases));
        }

        return $this->response->setJSON([
            'success' => true,
            'data' => [
                'source' => $source,                 // 'group' | 'legacy_all'
                'id_client_group' => $idClientGroup ?: null,
                'phases' => $phases,
            ],
        ]);
    }
}
