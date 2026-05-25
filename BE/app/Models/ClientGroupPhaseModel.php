<?php

namespace App\Models;

use CodeIgniter\Model;

class ClientGroupPhaseModel extends Model
{
    protected $table         = 'client_group_phase';
    protected $primaryKey    = 'id';
    protected $returnType    = 'array';
    protected $useAutoIncrement = true;
    protected $protectFields = true;
    protected $allowedFields = [
        'id_client_group',
        'id_expedient_state',
        'display_order',
        'enabled',
    ];

    protected $useTimestamps  = false;
    protected $createdField   = 'registration_date';
    protected $updatedField   = 'update_date';

    /** Replace the entire phase assignment for one client_group, in order. */
    public function setPhasesForGroup(int $idClientGroup, array $items): void
    {
        $this->db->transStart();
        $this->where('id_client_group', $idClientGroup)->delete();
        foreach (array_values($items) as $i => $it) {
            $this->insert([
                'id_client_group' => $idClientGroup,
                'id_expedient_state'   => $it['id_expedient_state'] ?? $it['idFileState'] ?? null,
                'display_order'   => $it['display_order'] ?? $it['displayOrder'] ?? $i,
                'enabled'         => $it['enabled'] ?? 1,
            ]);
        }
        $this->db->transComplete();
    }

    public function getPhasesForGroup(int $idClientGroup): array
    {
        return $this->select('client_group_phase.*, fs.name as phase_name, fs.enabled as phase_enabled, fs.requires_payment_voucher')
            ->join('expedient_state fs', 'fs.id = client_group_phase.id_expedient_state', 'left')
            ->where('client_group_phase.id_client_group', $idClientGroup)
            ->orderBy('client_group_phase.display_order', 'ASC')
            ->findAll();
    }
}
