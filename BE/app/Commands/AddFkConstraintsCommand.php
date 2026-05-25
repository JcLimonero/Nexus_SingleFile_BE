<?php

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use Config\Database;

/**
 * Aplica las FK integrity additions del baseline v1.0 a un tenant DB ya
 * provisionado. Es idempotente (skip si la constraint ya existe).
 *
 * Pre-requisito: correr `tenant:audit-orphans --db <name>` y aplicar los
 * cleanups sugeridos. Si quedan huérfanos, los ALTER van a fallar con
 * MySQL 1452 "Cannot add or update a child row".
 *
 * Usage:
 *   php spark tenant:add-fks --db nexfile_tenant_test8
 *   php spark tenant:add-fks --db nexfile_tenant_test8 --dry-run
 */
class AddFkConstraintsCommand extends BaseCommand
{
    protected $group       = 'Tenant';
    protected $name        = 'tenant:add-fks';
    protected $description = 'Aplica las FK integrity additions del baseline a un tenant existente.';
    protected $usage       = 'tenant:add-fks --db <name> [--dry-run]';
    protected $options     = [
        '--db'      => 'Target database name (required)',
        '--dry-run' => 'Solo imprime las ALTERs sin aplicarlas',
    ];

    /**
     * Pairs of [pre-alter (type alignment) or constraint-add, constraint_name_for_idempotency_check].
     * For type-alignment ALTERs we pass null in the second slot — they re-run idempotently
     * because MySQL no-ops a MODIFY to the same type/null/default.
     */
    private const STATEMENTS = [
        // Type alignment (no constraint name — idempotent by nature)
        ['ALTER TABLE `client_group_phase` MODIFY `id_file_state` INT NOT NULL', null],
        ['ALTER TABLE `agency`             MODIFY `id_company`    INT DEFAULT NULL', null],

        // Categoría A (Phase A, clean)
        ['ALTER TABLE `client_group`         ADD CONSTRAINT `fk_cg_last_user_update`   FOREIGN KEY (`id_last_user_update`) REFERENCES `user` (`id`)          ON DELETE SET NULL ON UPDATE CASCADE', 'fk_cg_last_user_update'],
        ['ALTER TABLE `client_group_process` ADD CONSTRAINT `fk_cgp_process`           FOREIGN KEY (`id_process`)          REFERENCES `process` (`id`)       ON DELETE CASCADE',                       'fk_cgp_process'],
        ['ALTER TABLE `client_group_phase`   ADD CONSTRAINT `fk_cgph_file_state`       FOREIGN KEY (`id_file_state`)       REFERENCES `file_state` (`id`)    ON DELETE CASCADE',                       'fk_cgph_file_state'],
        ['ALTER TABLE `company`              ADD CONSTRAINT `fk_company_client_group`  FOREIGN KEY (`id_client_group`)     REFERENCES `client_group` (`id`)  ON DELETE SET NULL ON UPDATE CASCADE',     'fk_company_client_group'],

        // Categoría B (legacy hierarchy, post-cleanup)
        ['ALTER TABLE `agency`                     ADD CONSTRAINT `fk_agency_company`                  FOREIGN KEY (`id_company`)          REFERENCES `company` (`id`) ON DELETE SET NULL ON UPDATE CASCADE', 'fk_agency_company'],
        ['ALTER TABLE `document_type`              ADD CONSTRAINT `fk_document_type_process_type`      FOREIGN KEY (`id_process_type`)     REFERENCES `process` (`id`) ON DELETE SET NULL ON UPDATE CASCADE', 'fk_document_type_process_type'],
        ['ALTER TABLE `document_type`              ADD CONSTRAINT `fk_document_type_sub_process`       FOREIGN KEY (`id_sub_process`)      REFERENCES `process` (`id`) ON DELETE SET NULL ON UPDATE CASCADE', 'fk_document_type_sub_process'],
        ['ALTER TABLE `liquidation_receipt_detail` ADD CONSTRAINT `fk_lrd_last_user_update`            FOREIGN KEY (`id_last_user_update`) REFERENCES `user` (`id`)    ON DELETE SET NULL ON UPDATE CASCADE', 'fk_lrd_last_user_update'],
        ['ALTER TABLE `client_identification_data` ADD CONSTRAINT `fk_cid_last_user_update`            FOREIGN KEY (`id_last_user_update`) REFERENCES `user` (`id`)    ON DELETE SET NULL ON UPDATE CASCADE', 'fk_cid_last_user_update'],
        ['ALTER TABLE `config`                     ADD CONSTRAINT `fk_config_last_user_update`         FOREIGN KEY (`id_last_user_update`) REFERENCES `user` (`id`)    ON DELETE SET NULL ON UPDATE CASCADE', 'fk_config_last_user_update'],
        ['ALTER TABLE `payment_method`             ADD CONSTRAINT `fk_payment_method_last_user_update` FOREIGN KEY (`id_last_user_update`) REFERENCES `user` (`id`)    ON DELETE SET NULL ON UPDATE CASCADE', 'fk_payment_method_last_user_update'],
    ];

    public function run(array $params)
    {
        $db = (string) (CLI::getOption('db') ?? '');
        $dryRun = (bool) CLI::getOption('dry-run');
        if ($db === '' || !preg_match('/^[A-Za-z0-9_]+$/', $db)) {
            CLI::error('--db <name> requerido (alfanumérico + underscore)');
            return EXIT_ERROR;
        }

        $cfg = config('Database')->default;
        $conn = Database::connect(array_merge($cfg, ['database' => $db]), false);

        // Get already-declared FK names so we skip them
        $existing = $conn->query(
            "SELECT CONSTRAINT_NAME FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA = ? AND CONSTRAINT_TYPE = 'FOREIGN KEY'",
            [$db]
        )->getResultArray();
        $existingNames = array_column($existing, 'CONSTRAINT_NAME');

        CLI::write("Aplicando FK additions a `{$db}`" . ($dryRun ? ' [DRY-RUN]' : '') . '…', 'white');
        CLI::newLine();

        $applied = $skipped = $failed = 0;
        foreach (self::STATEMENTS as [$sql, $constraintName]) {
            if ($constraintName !== null && in_array($constraintName, $existingNames, true)) {
                CLI::write("  · {$constraintName} ya existe — skip", 'yellow');
                $skipped++;
                continue;
            }

            if ($dryRun) {
                CLI::write("  · {$sql}", 'cyan');
                continue;
            }

            try {
                $conn->query($sql);
                $label = $constraintName ?? '(type alignment)';
                CLI::write("  ✓ {$label}", 'green');
                $applied++;
            } catch (\Throwable $e) {
                $label = $constraintName ?? '(type alignment)';
                CLI::error("  ✗ {$label}: " . substr($e->getMessage(), 0, 110));
                $failed++;
            }
        }

        CLI::newLine();
        CLI::write(
            "=== Resumen: {$applied} aplicadas, {$skipped} ya existían, {$failed} fallaron ===",
            $failed === 0 ? 'green' : 'red'
        );

        if ($failed > 0) {
            CLI::write("Tip: corre `php spark tenant:audit-orphans --db {$db}` para identificar huérfanos preexistentes.", 'yellow');
            return EXIT_ERROR;
        }
        return EXIT_SUCCESS;
    }
}
