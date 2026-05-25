<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

/**
 * Junction: which workflow phases (file_state rows: Integración, Liquidación,
 * Liberación, …) apply to a client_group, and in what display order.
 */
class CreateClientGroupPhaseTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => ['type' => 'BIGINT', 'unsigned' => true, 'auto_increment' => true],
            'id_client_group' => ['type' => 'BIGINT', 'unsigned' => true, 'null' => false],
            'id_file_state'   => ['type' => 'BIGINT', 'unsigned' => true, 'null' => false],
            'display_order'   => ['type' => 'INT', 'default' => 0],
            'enabled'         => ['type' => 'TINYINT', 'constraint' => 1, 'default' => 1],
            'registration_date' => [
                'type' => 'DATETIME',
                'default' => new \CodeIgniter\Database\RawSql('CURRENT_TIMESTAMP'),
            ],
            'update_date' => [
                'type' => 'DATETIME',
                'default' => new \CodeIgniter\Database\RawSql('CURRENT_TIMESTAMP'),
                'extra' => 'ON UPDATE CURRENT_TIMESTAMP',
            ],
        ]);
        $this->forge->addPrimaryKey('id');
        $this->forge->addUniqueKey(['id_client_group', 'id_file_state']);
        $this->forge->addKey('id_file_state');
        $this->forge->addForeignKey('id_client_group', 'client_group', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('client_group_phase', true);
    }

    public function down()
    {
        $this->forge->dropTable('client_group_phase', true);
    }
}
