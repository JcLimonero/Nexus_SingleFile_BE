<?php

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use Config\Database;

/**
 * Audits a tenant DB for FK-like columns that point to non-existent parents
 * (orphan rows). Each candidate is a column the schema treats as a foreign key
 * by convention (id_*, Id*) but where no actual CONSTRAINT was declared in the
 * legacy `nexfile` dump.
 *
 * The audit is the prerequisite of `tenant:add-fks`: every orphan must be
 * cleaned up before adding the FK constraint (otherwise the ALTER fails with
 * "Cannot add or update a child row").
 *
 * Usage:
 *   php spark tenant:audit-orphans --db nexfile_tenant_test8
 *   php spark tenant:audit-orphans --db nexfile_tenant_test8 --fix-zeros  # nullify id_* = 0 audit cols
 */
class AuditOrphansCommand extends BaseCommand
{
    protected $group       = 'Tenant';
    protected $name        = 'tenant:audit-orphans';
    protected $description = 'Find FK-like columns with rows pointing to non-existent parents.';
    protected $usage       = 'tenant:audit-orphans --db <name> [--fix-zeros]';
    protected $options     = [
        '--db'         => 'Target database name (required, e.g. nexfile_tenant_test8)',
        '--fix-zeros'  => 'For audit-trail columns with value=0, set NULL (safe, reversible)',
    ];

    /**
     * Each row: [child_table, child_col, parent_table, parent_col, suggested_action]
     * Action codes:
     *   'set_null' — UPDATE child SET col = NULL WHERE col matches no parent
     *   'delete'   — DELETE FROM child WHERE col matches no parent (use with care)
     *   'investigate' — print but don't auto-suggest
     *
     * Order matters only for human readability; the audit is independent per row.
     */
    private const CANDIDATES = [
        // === Categoría A — Phase A junctions / columns we own ===
        ['client_group_process', 'id_process',          'process',      'id', 'delete'],
        ['client_group_phase',   'id_file_state',       'file_state',   'id', 'delete'],
        ['client_group_phase',   'id_client_group',     'client_group', 'id', 'delete'],
        ['company',              'id_client_group',     'client_group', 'id', 'set_null'],
        ['client_group',         'id_last_user_update', 'user',         'id', 'set_null'],

        // === Categoría B — Legacy hierarchy (need orphan check + cleanup) ===
        // NOTE: `id_type_reason` en file_reasons / file_exception_reason apunta
        // a una tabla `type_reason` que NUNCA existió en el schema (feature
        // legacy abandonada). No agregamos FK; solo nullify los zeros.
        ['agency',                     'id_company',          'company', 'id', 'set_null'],
        ['document_type',              'id_process_type',     'process', 'id', 'set_null'],
        ['document_type',              'id_sub_process',      'process', 'id', 'set_null'],
        ['liquidation_receipt_detail', 'id_last_user_update', 'user',    'id', 'set_null'],
        ['client_identification_data', 'id_last_user_update', 'user',    'id', 'set_null'],
        ['config',                     'id_last_user_update', 'user',    'id', 'set_null'],
        ['payment_method',             'id_last_user_update', 'user',    'id', 'set_null'],
    ];

    public function run(array $params)
    {
        $db = (string) (CLI::getOption('db') ?? '');
        $fixZeros = (bool) CLI::getOption('fix-zeros');
        if ($db === '' || !preg_match('/^[A-Za-z0-9_]+$/', $db)) {
            CLI::error('--db <name> requerido (alfanumérico + underscore)');
            return EXIT_ERROR;
        }

        $cfg = config('Database')->default;
        $conn = Database::connect(array_merge($cfg, ['database' => $db]), false);

        CLI::write("Auditando huérfanos en `{$db}`…", 'white');
        CLI::newLine();

        $totalOrphans = 0;
        $totalZeros = 0;
        $issues = [];

        foreach (self::CANDIDATES as [$child, $childCol, $parent, $parentCol, $action]) {
            // Verify both tables/cols exist before querying
            try {
                $exists = $conn->query(
                    "SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ? LIMIT 1",
                    [$db, $child, $childCol]
                )->getRow();
                if (!$exists) {
                    CLI::write(sprintf("  %-50s SKIP (column does not exist)", "{$child}.{$childCol}"), 'yellow');
                    continue;
                }
            } catch (\Throwable $e) {
                CLI::error(sprintf("  %-50s ERR %s", "{$child}.{$childCol}", substr($e->getMessage(), 0, 60)));
                continue;
            }

            // Count total non-null + non-zero rows in child
            try {
                $total = (int) $conn->query(
                    "SELECT COUNT(*) AS n FROM `{$child}` WHERE `{$childCol}` IS NOT NULL AND `{$childCol}` <> 0"
                )->getRow()->n;

                $zeros = (int) $conn->query(
                    "SELECT COUNT(*) AS n FROM `{$child}` WHERE `{$childCol}` = 0"
                )->getRow()->n;

                $orphans = (int) $conn->query(
                    "SELECT COUNT(*) AS n FROM `{$child}` c
                     LEFT JOIN `{$parent}` p ON c.`{$childCol}` = p.`{$parentCol}`
                     WHERE c.`{$childCol}` IS NOT NULL AND c.`{$childCol}` <> 0 AND p.`{$parentCol}` IS NULL"
                )->getRow()->n;
            } catch (\Throwable $e) {
                CLI::error(sprintf("  %-50s ERR %s", "{$child}.{$childCol}", substr($e->getMessage(), 0, 60)));
                continue;
            }

            $status = ($orphans === 0 && $zeros === 0) ? 'OK' :
                      (($orphans > 0) ? 'ORPHAN' : 'ZEROS');
            $color  = $status === 'OK' ? 'green' : ($status === 'ORPHAN' ? 'red' : 'yellow');

            CLI::write(sprintf(
                "  %-50s -> %-18s : rows=%-4d zeros=%-3d orphans=%-3d [%s]",
                "{$child}.{$childCol}", $parent, $total, $zeros, $orphans, $status
            ), $color);

            if ($orphans > 0 || $zeros > 0) {
                $issues[] = compact('child', 'childCol', 'parent', 'parentCol', 'action', 'orphans', 'zeros');
                $totalOrphans += $orphans;
                $totalZeros += $zeros;
            }
        }

        CLI::newLine();
        CLI::write(sprintf(
            "=== Resumen: %d huérfanos reales, %d ceros (id=0 sin parent) ===",
            $totalOrphans, $totalZeros
        ), $totalOrphans + $totalZeros === 0 ? 'green' : 'yellow');

        if (!$issues) {
            CLI::write("✔ Sin issues. Esta DB está lista para `tenant:add-fks`.", 'green');
            return EXIT_SUCCESS;
        }

        // Print suggested cleanup SQL
        CLI::newLine();
        CLI::write("=== Sugerencia de cleanup (revisar antes de correr) ===", 'white');
        foreach ($issues as $i) {
            $cleanupSql = $this->buildCleanupSql($i);
            foreach ($cleanupSql as $sql) CLI::write("  {$sql}", 'cyan');
        }

        if ($fixZeros && $totalZeros > 0) {
            CLI::newLine();
            CLI::write("Aplicando --fix-zeros: nulifico todos los `id_*` = 0 de columnas con action=set_null…", 'white');
            $applied = 0;
            foreach ($issues as $i) {
                if ($i['zeros'] > 0 && $i['action'] === 'set_null') {
                    $sql = "UPDATE `{$i['child']}` SET `{$i['childCol']}` = NULL WHERE `{$i['childCol']}` = 0";
                    try {
                        $conn->query($sql);
                        $applied += $i['zeros'];
                        CLI::write("  · {$i['child']}.{$i['childCol']}: {$i['zeros']} filas a NULL", 'green');
                    } catch (\Throwable $e) {
                        CLI::error("  ! {$i['child']}.{$i['childCol']}: " . substr($e->getMessage(), 0, 80));
                    }
                }
            }
            CLI::write("✓ {$applied} filas nullificadas. Re-corre el audit sin --fix-zeros para confirmar.", 'green');
        }

        return EXIT_SUCCESS;
    }

    /**
     * For each issue, suggest 1-2 SQL statements to clean it up.
     * The user authorizes them individually before any apply.
     */
    private function buildCleanupSql(array $i): array
    {
        $sqls = [];
        if ($i['zeros'] > 0) {
            if ($i['action'] === 'set_null') {
                $sqls[] = "UPDATE `{$i['child']}` SET `{$i['childCol']}` = NULL WHERE `{$i['childCol']}` = 0; -- {$i['zeros']} filas (audit-trail con id=0)";
            } else {
                $sqls[] = "DELETE FROM `{$i['child']}` WHERE `{$i['childCol']}` = 0; -- {$i['zeros']} filas (junction con id=0)";
            }
        }
        if ($i['orphans'] > 0) {
            if ($i['action'] === 'set_null') {
                $sqls[] = "UPDATE `{$i['child']}` c LEFT JOIN `{$i['parent']}` p ON c.`{$i['childCol']}` = p.`{$i['parentCol']}` SET c.`{$i['childCol']}` = NULL WHERE c.`{$i['childCol']}` IS NOT NULL AND p.`{$i['parentCol']}` IS NULL; -- {$i['orphans']} huérfanos";
            } elseif ($i['action'] === 'delete') {
                $sqls[] = "DELETE c FROM `{$i['child']}` c LEFT JOIN `{$i['parent']}` p ON c.`{$i['childCol']}` = p.`{$i['parentCol']}` WHERE c.`{$i['childCol']}` IS NOT NULL AND p.`{$i['parentCol']}` IS NULL; -- {$i['orphans']} huérfanos";
            } else {
                $sqls[] = "-- investigate: SELECT * FROM `{$i['child']}` c LEFT JOIN `{$i['parent']}` p ON c.`{$i['childCol']}` = p.`{$i['parentCol']}` WHERE c.`{$i['childCol']}` IS NOT NULL AND p.`{$i['parentCol']}` IS NULL; -- {$i['orphans']} huérfanos";
            }
        }
        return $sqls;
    }
}
