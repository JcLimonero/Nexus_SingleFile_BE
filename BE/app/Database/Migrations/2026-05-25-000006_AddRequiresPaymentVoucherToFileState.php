<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

/**
 * Adds a boolean flag on expedient_state to mark which phase is the one that
 * receives payment vouchers (today hardcoded as id=2 / Liquidación). Lets
 * each deployment mark a different phase by name without code changes.
 */
class AddRequiresPaymentVoucherToFileState extends Migration
{
    public function up()
    {
        $columns = $this->db->getFieldNames('expedient_state');
        if (in_array('requires_payment_voucher', $columns, true)) {
            return;
        }
        $this->forge->addColumn('expedient_state', [
            'requires_payment_voucher' => [
                'type' => 'TINYINT',
                'constraint' => 1,
                'default' => 0,
                'null' => false,
                'after' => 'enabled',
            ],
        ]);

        // Backfill: mark phase id=2 (the hardcoded Liquidación) as the voucher phase
        // so existing behavior is preserved without code-level changes.
        $this->db->query('UPDATE `expedient_state` SET `requires_payment_voucher` = 1 WHERE `id` = 2');
    }

    public function down()
    {
        $columns = $this->db->getFieldNames('expedient_state');
        if (!in_array('requires_payment_voucher', $columns, true)) {
            return;
        }
        $this->forge->dropColumn('expedient_state', 'requires_payment_voucher');
    }
}
