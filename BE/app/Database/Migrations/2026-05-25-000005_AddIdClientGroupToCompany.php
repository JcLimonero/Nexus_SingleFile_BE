<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

/**
 * Links each razón social (company) to its parent client_group.
 * Nullable for backwards compatibility — existing companies have no group
 * until an admin assigns one (or the WIZARD provisions a fresh tenant).
 */
class AddIdClientGroupToCompany extends Migration
{
    public function up()
    {
        // Skip if column already present
        $columns = $this->db->getFieldNames('company');
        if (in_array('id_client_group', $columns, true)) {
            return;
        }
        $this->forge->addColumn('company', [
            'id_client_group' => [
                'type' => 'BIGINT',
                'unsigned' => true,
                'null' => true,
                'after' => 'id',
            ],
        ]);
        $this->db->query('CREATE INDEX `idx_company_client_group` ON `company` (`id_client_group`)');
    }

    public function down()
    {
        $columns = $this->db->getFieldNames('company');
        if (!in_array('id_client_group', $columns, true)) {
            return;
        }
        $this->db->query('DROP INDEX `idx_company_client_group` ON `company`');
        $this->forge->dropColumn('company', 'id_client_group');
    }
}
