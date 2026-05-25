<?php

namespace App\Database\CentralMigrations;

use CodeIgniter\Database\Migration;

class CreateCentralSuperAdminUserTable extends Migration
{
    protected $DBGroup = 'central';

    public function up()
    {
        $this->forge->addField([
            'id' => ['type' => 'BIGINT', 'unsigned' => true, 'auto_increment' => true],
            'email'         => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => false],
            'password_hash' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => false],
            'name'          => ['type' => 'VARCHAR', 'constraint' => 200, 'null' => true],
            'enabled'       => ['type' => 'TINYINT', 'constraint' => 1, 'default' => 1],
            'created_at' => [
                'type' => 'DATETIME',
                'default' => new \CodeIgniter\Database\RawSql('CURRENT_TIMESTAMP'),
            ],
        ]);
        $this->forge->addPrimaryKey('id');
        $this->forge->addUniqueKey('email');
        $this->forge->createTable('super_admin_user', true);
    }

    public function down()
    {
        $this->forge->dropTable('super_admin_user', true);
    }
}
