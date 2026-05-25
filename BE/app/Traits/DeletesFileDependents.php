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
        // PLD: beneficial owners y geo logs FK directo a expedient.id (id_expedient)
        $this->db->table('expedient_pld_beneficial_owner')
            ->where('id_expedient', $fileId)
            ->delete();
        $this->db->table('expedient_pld_geo_log')
            ->where('id_expedient', $fileId)
            ->delete();

        // expedient_pld.id_expedient es ON DELETE SET NULL, por lo que hay que
        // borrarlo explícitamente antes que el expediente para evitar huérfanos.
        $this->db->table('expedient_pld')
            ->where('id_expedient', $fileId)
            ->delete();

        // Tokens de share / miniportal
        $this->db->table('expedient_share_token')
            ->where('id_expedient', $fileId)
            ->delete();
    }
}
