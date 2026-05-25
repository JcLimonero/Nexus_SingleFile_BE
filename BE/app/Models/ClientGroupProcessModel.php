<?php

namespace App\Models;

use CodeIgniter\Model;

class ClientGroupProcessModel extends Model
{
    protected $table         = 'client_group_sale_type';
    protected $primaryKey    = 'id';
    protected $returnType    = 'array';
    protected $useAutoIncrement = true;
    protected $protectFields = true;
    protected $allowedFields = [
        'id_client_group',
        'id_sale_type',
        'display_order',
        'enabled',
    ];

    protected $useTimestamps  = false;
    protected $createdField   = 'registration_date';
    protected $updatedField   = 'update_date';

    /** Replace the entire process assignment for one client_group, in order. */
    public function setProcessesForGroup(int $idClientGroup, array $items): void
    {
        $this->db->transStart();
        $this->where('id_client_group', $idClientGroup)->delete();
        foreach (array_values($items) as $i => $it) {
            $this->insert([
                'id_client_group' => $idClientGroup,
                'id_sale_type'      => $it['id_sale_type'] ?? $it['idProcess'] ?? null,
                'display_order'   => $it['display_order'] ?? $it['displayOrder'] ?? $i,
                'enabled'         => $it['enabled'] ?? 1,
            ]);
        }
        $this->db->transComplete();
    }

    public function getProcessesForGroup(int $idClientGroup): array
    {
        return $this->select('client_group_process.*, p.name as process_name, p.enabled as process_enabled')
            ->join('sale_type p', 'p.id = client_group_process.id_sale_type', 'left')
            ->where('client_group_process.id_client_group', $idClientGroup)
            ->orderBy('client_group_process.display_order', 'ASC')
            ->findAll();
    }
}
