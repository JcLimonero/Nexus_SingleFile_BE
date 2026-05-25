<?php

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use Config\Database;

/**
 * Selectively copies catalog rows, roles + RBAC, and the admin user from the
 * current source DB into a target DB whose schema was already cloned via
 * db:clone-schema. Idempotent (truncate-then-insert per table).
 *
 * Usage:
 *   php spark db:seed-config --target=Nexfile_Config
 *   php spark db:seed-config --target=Nexfile_Config --admin-email=admin@x.com
 *
 * Tables copied (matches plan toasty-herding-nebula.md):
 *   Catálogos básicos : process, customer_type, operation_type, payment_method, file_state
 *   Documentos        : tipo_documento, documento_requerido, motivo_rechazo, tipo_cliente
 *   Roles + RBAC      : role, plus any *_role / role_* / permission* / module* table that exists
 *   Usuario admin     : user rows matching role name 'admin' (case-insensitive) OR --admin-email
 */
class SeedConfigDbCommand extends BaseCommand
{
    protected $group       = 'Database';
    protected $name        = 'db:seed-config';
    protected $description = 'Seed the target Config DB with catalogs, roles, and the admin user.';
    protected $usage       = 'db:seed-config --target=<dbname> [--admin-email=<email>] [--dry-run]';
    protected $options     = [
        '--target'      => 'Target database name (required)',
        '--admin-email' => 'Specific admin user email to copy (default: any user whose role name matches "admin")',
        '--dry-run'     => 'Print counts without writing',
    ];

    private const CATALOGS = [
        // Catálogos básicos
        'process',
        'customer_type',
        'operation_type',
        'payment_method',
        'file_state',
        'file_sub_state',
        // Documentos y motivos
        'document_type',
        'configuration_process_document_type',
        'file_reasons',
    ];

    /** Role/RBAC table name candidates — copied if present on the source schema. */
    private const RBAC_CANDIDATES = [
        'user_role',
        'role',
        'permission',
        'module',
        'role_permission',
        'role_module',
        'permission_role',
        'module_role',
    ];

    public function run(array $params)
    {
        $target = (string) (CLI::getOption('target') ?? $params['target'] ?? '');
        if ($target === '' || !preg_match('/^[A-Za-z0-9_]+$/', $target)) {
            CLI::error('--target=<dbname> is required (alnum + underscore only)');
            return EXIT_ERROR;
        }
        $adminEmail = CLI::getOption('admin-email') ?: null;
        $dryRun = (bool) CLI::getOption('dry-run');

        $source = Database::connect();
        $sourceName = $source->getDatabase();
        if ($sourceName === $target) {
            CLI::error('Source and target must differ');
            return EXIT_ERROR;
        }

        $config = config('Database');
        $targetConfig = $config->default;
        $targetConfig['database'] = $target;
        $targetDb = Database::connect($targetConfig, false);

        CLI::write("Source: {$sourceName}", 'cyan');
        CLI::write("Target: {$target}" . ($dryRun ? ' [DRY-RUN]' : ''), 'cyan');
        CLI::newLine();

        $targetDb->query('SET FOREIGN_KEY_CHECKS = 0');

        // 1) Catálogos
        CLI::write('--- Catálogos ---', 'white');
        foreach (self::CATALOGS as $t) {
            $this->copyTable($source, $sourceName, $targetDb, $target, $t, null, $dryRun);
        }

        // 2) RBAC (solo las que existan en source)
        CLI::newLine();
        CLI::write('--- Roles / RBAC ---', 'white');
        $existingRbac = [];
        foreach (self::RBAC_CANDIDATES as $t) {
            if ($source->tableExists($t)) {
                $existingRbac[] = $t;
            }
        }
        if (!$existingRbac) {
            CLI::write('  (no RBAC tables found in source)', 'yellow');
        }
        foreach ($existingRbac as $t) {
            $this->copyTable($source, $sourceName, $targetDb, $target, $t, null, $dryRun);
        }

        // 3) Usuario admin
        CLI::newLine();
        CLI::write('--- Usuario admin ---', 'white');
        if (!$source->tableExists('user')) {
            CLI::write('  user table not present on source — skipping', 'yellow');
        } else {
            $where = $this->buildAdminWhere($source, $adminEmail);
            if ($where === null) {
                CLI::write('  No admin user matched — skipping', 'yellow');
            } else {
                $this->copyTable($source, $sourceName, $targetDb, $target, 'user', $where, $dryRun);
            }
        }

        $targetDb->query('SET FOREIGN_KEY_CHECKS = 1');
        CLI::newLine();
        CLI::write('Seed complete.', 'green');
        return EXIT_SUCCESS;
    }

    /**
     * @param string|null $whereSql  Optional raw WHERE clause (without the WHERE keyword)
     */
    private function copyTable($source, string $sourceName, $targetDb, string $target, string $table, ?string $whereSql, bool $dryRun): void
    {
        if (!$source->tableExists($table)) {
            CLI::write("  - {$table} (not in source, skipped)", 'yellow');
            return;
        }
        if (!$targetDb->tableExists($table)) {
            CLI::write("  - {$table} (not in target schema, skipped — run db:clone-schema first)", 'yellow');
            return;
        }

        $whereClause = $whereSql ? " WHERE {$whereSql}" : '';
        $countRow = $source->query("SELECT COUNT(*) AS c FROM `{$sourceName}`.`{$table}`{$whereClause}")->getRowArray();
        $count = (int) ($countRow['c'] ?? 0);

        if ($dryRun) {
            CLI::write("  · {$table}: would copy {$count} rows", 'cyan');
            return;
        }

        $targetDb->query("TRUNCATE TABLE `{$target}`.`{$table}`");
        if ($count > 0) {
            $targetDb->query("INSERT INTO `{$target}`.`{$table}` SELECT * FROM `{$sourceName}`.`{$table}`{$whereClause}");
        }
        CLI::write("  + {$table}: {$count} rows", 'green');
    }

    /**
     * Build a WHERE clause to select admin user(s) from the source user table.
     * Returns null if no admin can be identified.
     */
    private function buildAdminWhere($source, ?string $adminEmail): ?string
    {
        if ($adminEmail) {
            $escaped = $source->escape($adminEmail);
            return "email = {$escaped}";
        }

        // Discover the admin role id by name (case-insensitive, allows variants like 'Administrador')
        $roleTable = $source->tableExists('user_role') ? 'user_role'
                   : ($source->tableExists('role') ? 'role' : null);
        if ($roleTable === null) {
            CLI::write('  ! user_role/role table missing — pass --admin-email instead', 'red');
            return null;
        }
        $rows = $source->query("SELECT id FROM {$roleTable} WHERE LOWER(name) LIKE '%admin%'")->getResultArray();
        if (!$rows) {
            CLI::write('  ! no role matched %admin% — pass --admin-email instead', 'red');
            return null;
        }
        $ids = array_map(static fn($r) => $source->escape($r['id']), $rows);
        $idList = implode(',', $ids);
        return "id_role IN ({$idList})";
    }
}
