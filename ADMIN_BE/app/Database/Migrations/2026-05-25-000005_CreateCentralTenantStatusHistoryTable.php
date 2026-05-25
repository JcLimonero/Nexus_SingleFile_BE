<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateCentralTenantStatusHistoryTable extends Migration
{
    // runs against default group, which already points at nexfile_central

    public function up()
    {
        $this->forge->addField([
            'id' => ['type' => 'BIGINT', 'unsigned' => true, 'auto_increment' => true],
            'id_tenant'    => ['type' => 'BIGINT', 'unsigned' => true, 'null' => false],
            'status_from'  => ['type' => 'VARCHAR', 'constraint' => 50, 'null' => true],
            'status_to'    => ['type' => 'VARCHAR', 'constraint' => 50, 'null' => false],
            'changed_at'   => [
                'type' => 'DATETIME',
                'default' => new \CodeIgniter\Database\RawSql('CURRENT_TIMESTAMP'),
            ],
            'changed_by_super_admin' => ['type' => 'BIGINT', 'unsigned' => true, 'null' => true],
            'reason'       => ['type' => 'TEXT', 'null' => true],
        ]);
        $this->forge->addPrimaryKey('id');
        $this->forge->addKey('id_tenant');
        $this->forge->addForeignKey('id_tenant', 'tenant', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('tenant_status_history', true);
    }

    public function down()
    {
        $this->forge->dropTable('tenant_status_history', true);
    }
}
