<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateIntegrationApiKeyTable extends Migration
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
            'Name' => [
                'type' => 'VARCHAR',
                'constraint' => 200,
                'null' => false,
            ],
            'KeyHash' => [
                'type' => 'VARCHAR',
                'constraint' => 64,
                'null' => false,
                'comment' => 'SHA-256 hex of the API key (never store plain key)',
            ],
            'Enabled' => [
                'type' => 'TINYINT',
                'constraint' => 1,
                'unsigned' => true,
                'default' => 1,
            ],
            'CreatedDate' => [
                'type' => 'DATETIME',
                'null' => false,
            ],
            'LastUsedDate' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);

        $this->forge->addKey('Id', true);
        $this->forge->addKey('KeyHash', false, true, 'uq_integration_apikey_hash');
        $this->forge->addKey('Enabled', false, false, 'idx_integration_apikey_enabled');

        $this->forge->createTable('Integration_ApiKey');
    }

    public function down()
    {
        $this->forge->dropTable('Integration_ApiKey');
    }
}
