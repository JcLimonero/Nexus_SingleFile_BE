<?php

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use Config\Database;

/**
 * Repair tenant DBs created by an early WIZARD whose migrations.ts used
 * `BIGINT UNSIGNED` for PKs. The source nexfile schema uses plain `BIGINT`,
 * so cloning the remaining tables fails on FK incompatibility.
 *
 * This command:
 *  1. ALTERs every WIZARD-created table's id + id_last_user_update + id_client_group
 *     columns from BIGINT UNSIGNED → BIGINT (signed).
 *  2. Re-runs db:clone-schema to fill the missing tables (now FKs match).
 *
 * Idempotent: ALTERing to the same type is a no-op; clone-schema skips
 * tables that already exist.
 *
 * Usage: php spark tenant:fix-schema --target=<dbname>
 */
class FixTenantSchemaCommand extends BaseCommand
{
    protected $group       = 'Tenant';
    protected $name        = 'tenant:fix-schema';
    protected $description = 'ALTER BIGINT UNSIGNED → BIGINT on WIZARD tables so source FKs match.';
    protected $usage       = 'tenant:fix-schema --target=<dbname>';
    protected $options     = ['--target' => 'Tenant DB name (required)'];

    /** Tables created by the WIZARD migrations.ts that need their id type relaxed. */
    private const WIZARD_TABLES = [
        'user', 'user_role', 'agency', 'company', 'process',
        'expedient_state', 'expedient_sub_state', 'customer_type', 'operation_type',
        'payment_method', 'document_type', 'expedient_reason',
        'document_error', 'expedient_exception_reason',
        'client_group', 'client_group_sale_type', 'client_group_phase',
    ];

    /** Columns that should be BIGINT (signed, nullable) wherever they appear. */
    private const NULLABLE_BIGINT_COLS = [
        'id_last_user_update', 'id_client_group', 'id_company', 'id_user_role',
        'default_agency',
    ];

    public function run(array $params)
    {
        $target = (string) (CLI::getOption('target') ?? '');
        if (!preg_match('/^[A-Za-z0-9_]+$/', $target)) {
            CLI::error('--target=<dbname> required');
            return EXIT_ERROR;
        }
        $cfg = config('Database')->default;
        $cfg['database'] = $target;
        $db = Database::connect($cfg, false);

        $db->query('SET FOREIGN_KEY_CHECKS = 0');

        foreach (self::WIZARD_TABLES as $t) {
            if (!$db->tableExists($t)) continue;
            $cols = $db->query(
                "SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, EXTRA
                 FROM information_schema.COLUMNS
                 WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?",
                [$target, $t]
            )->getResultArray();
            $byName = [];
            foreach ($cols as $c) $byName[$c['COLUMN_NAME']] = $c;

            // 1. Fix the PK `id` column if it's BIGINT UNSIGNED
            if (isset($byName['id']) && stripos($byName['id']['COLUMN_TYPE'], 'unsigned') !== false) {
                try {
                    $db->query("ALTER TABLE `{$t}` MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT");
                    CLI::write("  ~ {$t}.id BIGINT UNSIGNED → BIGINT", 'green');
                } catch (\Throwable $e) {
                    CLI::write("  ! {$t}.id: " . $e->getMessage(), 'red');
                }
            }

            // 2. Fix nullable BIGINT FK-style columns (no auto_increment, allow NULL)
            foreach (self::NULLABLE_BIGINT_COLS as $col) {
                if (!isset($byName[$col])) continue;
                if (stripos($byName[$col]['COLUMN_TYPE'], 'unsigned') === false) continue;
                try {
                    $db->query("ALTER TABLE `{$t}` MODIFY `{$col}` BIGINT NULL");
                    CLI::write("  ~ {$t}.{$col} BIGINT UNSIGNED → BIGINT", 'green');
                } catch (\Throwable $e) {
                    CLI::write("  ! {$t}.{$col}: " . $e->getMessage(), 'red');
                }
            }
        }

        $db->query('SET FOREIGN_KEY_CHECKS = 1');
        CLI::newLine();
        CLI::write('Schema types normalized. Now run:', 'cyan');
        CLI::write("  php spark db:clone-schema --target {$target}", 'white');
        CLI::write("  php spark db:apply-phase-a --target {$target}", 'white');
        return EXIT_SUCCESS;
    }
}
