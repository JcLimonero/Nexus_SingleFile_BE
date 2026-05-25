<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

/**
 * One row per tenant tracks the current billing period and the grace-period
 * timeline. TenantLifecycleCommand reads/writes here as time advances.
 */
class CreateCentralTenantSubscriptionTable extends Migration
{
    // runs against default group, which already points at nexfile_central

    public function up()
    {
        $this->forge->addField([
            'id' => ['type' => 'BIGINT', 'unsigned' => true, 'auto_increment' => true],
            'id_tenant'  => ['type' => 'BIGINT', 'unsigned' => true, 'null' => false],
            'plan'       => ['type' => 'VARCHAR', 'constraint' => 50, 'default' => 'standard'],
            'current_period_start' => ['type' => 'DATETIME', 'null' => true],
            'current_period_end'   => ['type' => 'DATETIME', 'null' => true],
            'grace_started_at'     => ['type' => 'DATETIME', 'null' => true],
            'readonly_started_at'  => ['type' => 'DATETIME', 'null' => true],
            'suspended_at'         => ['type' => 'DATETIME', 'null' => true],
            'last_payment_at'      => ['type' => 'DATETIME', 'null' => true],
            'next_billing_at'      => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addPrimaryKey('id');
        $this->forge->addUniqueKey('id_tenant');
        $this->forge->addForeignKey('id_tenant', 'tenant', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('tenant_subscription', true);
    }

    public function down()
    {
        $this->forge->dropTable('tenant_subscription', true);
    }
}
