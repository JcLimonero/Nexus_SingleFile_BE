<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateProcessTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'Id' => [
                'type' => 'VARCHAR',
                'constraint' => 50,
                'null' => false,
            ],
            'Name' => [
                'type' => 'VARCHAR',
                'constraint' => 100,
                'null' => false,
            ],
            'Code' => [
                'type' => 'VARCHAR',
                'constraint' => 20,
                'null' => false,
            ],
            'Description' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'Enabled' => [
                'type' => 'TINYINT',
                'constraint' => 1,
                'default' => 1,
                'null' => false,
            ],
            'RegistrationDate' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'UpdateDate' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'IdLastUserUpdate' => [
                'type' => 'VARCHAR',
                'constraint' => 50,
                'null' => true,
            ],
        ]);

        $this->forge->addKey('Id', true);
        $this->forge->addUniqueKey('Code');
        $this->forge->addUniqueKey('Name');
        $this->forge->createTable('Process');
    }

    public function down()
    {
        $this->forge->dropTable('Process');
    }
}
