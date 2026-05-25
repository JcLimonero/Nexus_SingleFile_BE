<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

/**
 * Top-level entity in the new hierarchy: grupo de cliente → company → agency.
 * One client_group owns N companies and dictates which phases/processes apply.
 */
class CreateClientGroupTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type' => 'BIGINT',
                'unsigned' => true,
                'auto_increment' => true,
            ],
            'name' => [
                'type' => 'VARCHAR',
                'constraint' => 200,
                'null' => false,
            ],
            'description' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'enabled' => [
                'type' => 'TINYINT',
                'constraint' => 1,
                'default' => 1,
                'null' => false,
            ],
            'registration_date' => [
                'type' => 'DATETIME',
                'default' => new \CodeIgniter\Database\RawSql('CURRENT_TIMESTAMP'),
            ],
            'update_date' => [
                'type' => 'DATETIME',
                'default' => new \CodeIgniter\Database\RawSql('CURRENT_TIMESTAMP'),
                'extra' => 'ON UPDATE CURRENT_TIMESTAMP',
            ],
            'id_last_user_update' => [
                'type' => 'BIGINT',
                'unsigned' => true,
                'null' => true,
            ],
        ]);
        $this->forge->addPrimaryKey('id');
        $this->forge->addUniqueKey('name');
        $this->forge->createTable('client_group', true);
    }

    public function down()
    {
        $this->forge->dropTable('client_group', true);
    }
}
