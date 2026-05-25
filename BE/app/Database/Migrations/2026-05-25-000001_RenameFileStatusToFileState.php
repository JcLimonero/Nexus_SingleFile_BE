<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

/**
 * Renames file_status → file_state and file_sub_status → file_sub_state.
 *
 * The column names (id_current_state, id_file_state, id_file_sub_status) are
 * left untouched on purpose — column renames are FK-coordinated and would touch
 * many more tables. Code searches by table name, not column name, for clarity.
 *
 * Why: file_status was semantically ambiguous — the rows are workflow phases
 * (Integración / Liquidación / Liberación) plus terminal states (Liberado /
 * Cancelado). Calling the table "state" is more accurate than "status".
 */
class RenameFileStatusToFileState extends Migration
{
    public function up()
    {
        // Use raw SQL because Forge::renameTable doesn't exist in this CI4 release.
        // Both renames are idempotent through the "IF EXISTS"-equivalent check below.
        if ($this->db->tableExists('file_status') && !$this->db->tableExists('file_state')) {
            $this->db->query('RENAME TABLE `file_status` TO `file_state`');
        }
        if ($this->db->tableExists('file_sub_status') && !$this->db->tableExists('file_sub_state')) {
            $this->db->query('RENAME TABLE `file_sub_status` TO `file_sub_state`');
        }
    }

    public function down()
    {
        if ($this->db->tableExists('file_state') && !$this->db->tableExists('file_status')) {
            $this->db->query('RENAME TABLE `file_state` TO `file_status`');
        }
        if ($this->db->tableExists('file_sub_state') && !$this->db->tableExists('file_sub_status')) {
            $this->db->query('RENAME TABLE `file_sub_state` TO `file_sub_status`');
        }
    }
}
