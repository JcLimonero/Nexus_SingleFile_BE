<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateUserActivityLogs extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'auto_increment' => true,
            ],
            'user_id' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => false,
            ],
            'username' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => false,
            ],
            'action' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => false,
            ],
            'description' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'ip_address' => [
                'type' => 'VARCHAR',
                'constraint' => 45,
                'null' => true,
            ],
            'user_agent' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'url' => [
                'type' => 'VARCHAR',
                'constraint' => 500,
                'null' => true,
            ],
            'method' => [
                'type' => 'VARCHAR',
                'constraint' => 10,
                'null' => true,
            ],
            'request_data' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'response_status' => [
                'type' => 'INT',
                'constraint' => 3,
                'null' => true,
            ],
            'execution_time' => [
                'type' => 'FLOAT',
                'null' => true,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => false,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => false,
            ],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addKey('user_id');
        $this->forge->addKey('action');
        $this->forge->addKey('created_at');
        
        $this->forge->createTable('user_activity_logs');
    }

    public function down()
    {
        $this->forge->dropTable('user_activity_logs');
    }
}
