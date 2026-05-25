<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

/**
 * Central DB — tenant registry. Each row represents a paying SaaS customer.
 * The `db_*` fields tell the tenant BE which database to connect to for that
 * tenant's data; `db_password_encrypted` is encrypted with TenantSecretBox.
 */
class CreateCentralTenantTable extends Migration
{
    // runs against default group, which already points at nexfile_central

    public function up()
    {
        $this->forge->addField([
            'id' => ['type' => 'BIGINT', 'unsigned' => true, 'auto_increment' => true],
            'slug' => [
                'type' => 'VARCHAR',
                'constraint' => 50,
                'null' => false,
                'comment' => 'Subdomain identifier, e.g. "vw" for vw.nexfile.app',
            ],
            'name' => ['type' => 'VARCHAR', 'constraint' => 200, 'null' => false],
            'status' => [
                'type' => 'ENUM',
                'constraint' => ['active', 'grace', 'readonly', 'suspended', 'terminated'],
                'default' => 'active',
                'null' => false,
            ],
            'db_host'     => ['type' => 'VARCHAR', 'constraint' => 100, 'null' => false],
            'db_port'     => ['type' => 'INT', 'default' => 3306],
            'db_name'     => ['type' => 'VARCHAR', 'constraint' => 100, 'null' => false],
            'db_username' => ['type' => 'VARCHAR', 'constraint' => 100, 'null' => false],
            'db_password_encrypted' => ['type' => 'TEXT', 'null' => false],
            'created_at' => [
                'type' => 'DATETIME',
                'default' => new \CodeIgniter\Database\RawSql('CURRENT_TIMESTAMP'),
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'default' => new \CodeIgniter\Database\RawSql('CURRENT_TIMESTAMP'),
                'extra' => 'ON UPDATE CURRENT_TIMESTAMP',
            ],
            'created_by_super_admin' => ['type' => 'BIGINT', 'unsigned' => true, 'null' => true],
        ]);
        $this->forge->addPrimaryKey('id');
        $this->forge->addUniqueKey('slug');
        $this->forge->addKey('status');
        $this->forge->createTable('tenant', true);
    }

    public function down()
    {
        $this->forge->dropTable('tenant', true);
    }
}
