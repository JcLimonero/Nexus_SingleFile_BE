<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateUserRefreshTokenTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'Id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'auto_increment' => true,
            ],
            'IdUser' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
            ],
            'RefreshToken' => [
                'type' => 'TEXT',
                'null' => false,
            ],
            'ExpirationDate' => [
                'type' => 'DATETIME',
                'null' => false,
            ],
            'CreatedDate' => [
                'type' => 'DATETIME',
                'null' => false,
                'default' => 'CURRENT_TIMESTAMP',
            ],
            'UpdateDate' => [
                'type' => 'DATETIME',
                'null' => false,
                'default' => 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
            ],
        ]);

        $this->forge->addKey('Id', true);
        $this->forge->addKey('IdUser');
        $this->forge->addKey('RefreshToken', false, false, 'idx_refresh_token');
        
        // Agregar foreign key
        $this->forge->addForeignKey('IdUser', 'User', 'Id', 'CASCADE', 'CASCADE');
        
        $this->forge->createTable('User_RefreshToken');
    }

    public function down()
    {
        $this->forge->dropTable('User_RefreshToken');
    }
}
