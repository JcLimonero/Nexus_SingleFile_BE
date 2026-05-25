<?php

namespace App\Database\CentralMigrations;

use CodeIgniter\Database\Migration;

/**
 * Replaces the per-tenant `config` table — every tenant's config rows now live
 * in central, scoped by id_tenant. This is what TenantConfigService reads from.
 */
class CreateCentralTenantConfigTable extends Migration
{
    protected $DBGroup = 'central';

    public function up()
    {
        $this->forge->addField([
            'id' => ['type' => 'BIGINT', 'unsigned' => true, 'auto_increment' => true],
            'id_tenant'    => ['type' => 'BIGINT', 'unsigned' => true, 'null' => false],
            'config_key'   => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => false],
            'config_value' => ['type' => 'TEXT', 'null' => true],
            'category'     => ['type' => 'VARCHAR', 'constraint' => 100, 'null' => true],
            'sensitive'    => ['type' => 'TINYINT', 'constraint' => 1, 'default' => 0],
            'updated_at' => [
                'type' => 'DATETIME',
                'default' => new \CodeIgniter\Database\RawSql('CURRENT_TIMESTAMP'),
                'extra' => 'ON UPDATE CURRENT_TIMESTAMP',
            ],
        ]);
        $this->forge->addPrimaryKey('id');
        $this->forge->addUniqueKey(['id_tenant', 'config_key']);
        $this->forge->addKey('category');
        $this->forge->addForeignKey('id_tenant', 'tenant', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('tenant_config', true);
    }

    public function down()
    {
        $this->forge->dropTable('tenant_config', true);
    }
}
