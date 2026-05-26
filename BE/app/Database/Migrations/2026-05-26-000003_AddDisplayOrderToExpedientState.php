<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

/**
 * Agrega `display_order` a expedient_state para definir el orden de las
 * fases navegables en el sidebar del FE cuando el usuario está en modo
 * legacy_all (sin client_group asignado).
 *
 * Aplica SOLO a is_navigable=1. Las terminales quedan con NULL — no se
 * usan en el sidebar.
 *
 * Mantiene consistencia con `client_group_phase.display_order` (mismo
 * nombre y tipo) — cuando hay un client_group, el orden viene de la
 * junction. Cuando NO hay group, viene de esta columna.
 *
 * Backfill usa incrementos de 10 para dejar espacio si en el futuro se
 * inserta una fase intermedia sin renumerar todas.
 */
class AddDisplayOrderToExpedientState extends Migration
{
    public function up()
    {
        $columns = $this->db->getFieldNames('expedient_state');

        if (!in_array('display_order', $columns, true)) {
            $this->forge->addColumn('expedient_state', [
                'display_order' => [
                    'type'       => 'INT',
                    'null'       => true,
                    'default'    => null,
                    'after'      => 'is_system',
                ],
            ]);
        }

        // Backfill: solo navegables, incrementos de 10.
        $this->db->query('UPDATE `expedient_state` SET `display_order` = 10 WHERE `id` = 1'); // Integración
        $this->db->query('UPDATE `expedient_state` SET `display_order` = 20 WHERE `id` = 2'); // Liquidación
        $this->db->query('UPDATE `expedient_state` SET `display_order` = 30 WHERE `id` = 3'); // Liberación
        $this->db->query('UPDATE `expedient_state` SET `display_order` = NULL WHERE `id` IN (4, 5, 6)'); // terminales
    }

    public function down()
    {
        $columns = $this->db->getFieldNames('expedient_state');
        if (in_array('display_order', $columns, true)) {
            $this->forge->dropColumn('expedient_state', 'display_order');
        }
    }
}
