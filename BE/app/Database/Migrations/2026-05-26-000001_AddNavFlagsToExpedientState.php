<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

/**
 * Separa los 3 roles que la tabla expedient_state confunde hoy:
 *   - lifecycle state (el expediente está acá ahora)
 *   - navegable phase (página visible en sidebar)
 *   - upload-allowed phase (en este estado se pueden cargar documentos)
 *
 * Sin esto, el endpoint Phase::activeForUser muestra fases terminales
 * (Cancelado/Liberado) como navegables, y los 4 endpoints de upload
 * permiten subir documentos contra cualquier estado del expediente.
 *
 * Patrón idéntico a 2026-05-25-000006_AddRequiresPaymentVoucherToFileState.
 */
class AddNavFlagsToExpedientState extends Migration
{
    public function up()
    {
        $columns = $this->db->getFieldNames('expedient_state');

        if (!in_array('is_navigable', $columns, true)) {
            $this->forge->addColumn('expedient_state', [
                'is_navigable' => [
                    'type'       => 'TINYINT',
                    'constraint' => 1,
                    'default'    => 1,
                    'null'       => false,
                    'after'      => 'requires_payment_voucher',
                ],
            ]);
        }

        if (!in_array('allows_document_upload', $columns, true)) {
            $this->forge->addColumn('expedient_state', [
                'allows_document_upload' => [
                    'type'       => 'TINYINT',
                    'constraint' => 1,
                    'default'    => 0,
                    'null'       => false,
                    'after'      => 'is_navigable',
                ],
            ]);
        }

        if (!in_array('is_terminal', $columns, true)) {
            $this->forge->addColumn('expedient_state', [
                'is_terminal' => [
                    'type'       => 'TINYINT',
                    'constraint' => 1,
                    'default'    => 0,
                    'null'       => false,
                    'after'      => 'allows_document_upload',
                ],
            ]);
        }

        // Backfill por id canónico (los 6 ids son fijos en data.sql).
        $this->db->query('UPDATE `expedient_state` SET `is_navigable`=1, `allows_document_upload`=1, `is_terminal`=0 WHERE `id`=1'); // Integración
        $this->db->query('UPDATE `expedient_state` SET `is_navigable`=1, `allows_document_upload`=1, `is_terminal`=0 WHERE `id`=2'); // Liquidación
        $this->db->query('UPDATE `expedient_state` SET `is_navigable`=1, `allows_document_upload`=0, `is_terminal`=0 WHERE `id`=3'); // Liberación
        $this->db->query('UPDATE `expedient_state` SET `is_navigable`=0, `allows_document_upload`=0, `is_terminal`=1 WHERE `id`=4'); // Liberado
        $this->db->query('UPDATE `expedient_state` SET `is_navigable`=0, `allows_document_upload`=0, `is_terminal`=1 WHERE `id`=5'); // Cancelado
        $this->db->query('UPDATE `expedient_state` SET `is_navigable`=0, `allows_document_upload`=0, `is_terminal`=1 WHERE `id`=6'); // Liberado por Excepción
    }

    public function down()
    {
        $columns = $this->db->getFieldNames('expedient_state');
        foreach (['is_terminal', 'allows_document_upload', 'is_navigable'] as $col) {
            if (in_array($col, $columns, true)) {
                $this->forge->dropColumn('expedient_state', $col);
            }
        }
    }
}
