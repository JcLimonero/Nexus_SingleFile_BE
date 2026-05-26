<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

/**
 * Marca las fases base del sistema (Integración + Liquidación) como
 * is_system=1 para que el Model API rechace su delete/disable/rename.
 *
 * Por qué solo estas dos:
 *   id=1 Integración → entry-point del workflow. Sin esta, no se pueden
 *                      crear expedientes nuevos.
 *   id=2 Liquidación → fase configurada como voucher
 *                      (requires_payment_voucher=1). Hay código que
 *                      asume este id existe (config.id_document_type_liquidacion,
 *                      etc.).
 *
 * Las otras 4 (Liberación, Liberado, Cancelado, Liberado por Excepción)
 * NO se marcan — son removibles por el admin si decide cambiar el flujo.
 */
class AddIsSystemToExpedientState extends Migration
{
    public function up()
    {
        $columns = $this->db->getFieldNames('expedient_state');

        if (!in_array('is_system', $columns, true)) {
            $this->forge->addColumn('expedient_state', [
                'is_system' => [
                    'type'       => 'TINYINT',
                    'constraint' => 1,
                    'default'    => 0,
                    'null'       => false,
                    'after'      => 'is_terminal',
                ],
            ]);
        }

        // Backfill: solo Integración (1) y Liquidación (2).
        $this->db->query('UPDATE `expedient_state` SET `is_system` = 1 WHERE `id` IN (1, 2)');
    }

    public function down()
    {
        $columns = $this->db->getFieldNames('expedient_state');
        if (in_array('is_system', $columns, true)) {
            $this->forge->dropColumn('expedient_state', 'is_system');
        }
    }
}
