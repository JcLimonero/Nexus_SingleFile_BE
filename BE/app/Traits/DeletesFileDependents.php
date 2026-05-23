<?php

namespace App\Traits;

/**
 * Borra registros dependientes de expedient (file) en orden inverso al de las FK.
 * Reemplaza el patrón inseguro `SET FOREIGN_KEY_CHECKS = 0`.
 *
 * El controller que use este trait debe exponer `$this->db` (CodeIgniter DB).
 */
trait DeletesFileDependents
{
    /**
     * @param int|string $fileId  id del expedient
     */
    protected function deleteFileDependents($fileId): void
    {
        // PLD: beneficiarios y geo logs cuelgan del file_pld, así que van antes
        $pldIds = $this->db->table('file_pld')
            ->select('id')
            ->where('id_file', $fileId)
            ->get()
            ->getResultArray();

        if (!empty($pldIds)) {
            $ids = array_column($pldIds, 'id');
            $this->db->table('file_pld_beneficiario_final')
                ->whereIn('id_file_pld', $ids)
                ->delete();
            $this->db->table('file_pld_geo_log')
                ->whereIn('id_file_pld', $ids)
                ->delete();
            $this->db->table('file_pld')
                ->where('id_file', $fileId)
                ->delete();
        }

        // Tokens de share / miniportal
        $this->db->table('file_share_token')
            ->where('id_file', $fileId)
            ->delete();

        // Razones / motivos extraordinarios
        $this->db->table('file_extraordinary_reason')
            ->where('id_file', $fileId)
            ->delete();
        $this->db->table('file_reason')
            ->where('id_file', $fileId)
            ->delete();
    }
}
