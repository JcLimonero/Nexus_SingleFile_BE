<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

/**
 * Renombra la tabla legada vinculada a liquidaciones al nombre genérico Integration_ApiKey.
 */
class RenameLiquidacionIntegrationApiKeyToIntegrationApiKey extends Migration
{
    public function up()
    {
        if (! $this->db->tableExists('Liquidacion_Integration_ApiKey')) {
            return;
        }
        if ($this->db->tableExists('Integration_ApiKey')) {
            return;
        }

        $this->forge->renameTable('Liquidacion_Integration_ApiKey', 'Integration_ApiKey');
    }

    public function down()
    {
        if (! $this->db->tableExists('Integration_ApiKey')) {
            return;
        }
        if ($this->db->tableExists('Liquidacion_Integration_ApiKey')) {
            return;
        }

        $this->forge->renameTable('Integration_ApiKey', 'Liquidacion_Integration_ApiKey');
    }
}
