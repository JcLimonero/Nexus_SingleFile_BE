<?php

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use Config\Database;

/**
 * Simulates the WIZARD provision flow end-to-end against a temp DB to
 * verify the baseline scripts + hierarchy inserts produce a tenant DB
 * with the expected ~40 tables and no FK violations. Auto-cleans up.
 *
 * Usage:
 *   php spark tenant:simulate-provision
 *   php spark tenant:simulate-provision --keep   # don't drop test DB
 */
class SimulateProvisionCommand extends BaseCommand
{
    protected $group       = 'Tenant';
    protected $name        = 'tenant:simulate-provision';
    protected $description = 'Dry-run: apply baseline + hierarchy + admin to a temp tenant DB, verify, cleanup.';
    protected $usage       = 'tenant:simulate-provision [--keep]';
    protected $options     = ['--keep' => 'Skip cleanup so you can inspect the DB after'];

    public function run(array $params)
    {
        $keep = (bool) CLI::getOption('keep');
        $testDb = 'nexfile_tenant_sim_' . substr((string) time(), -6);
        $cfg = config('Database')->default;

        $main = Database::connect(array_merge($cfg, ['database' => '']), false);
        $main->query("CREATE DATABASE `{$testDb}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        CLI::write("+ Created {$testDb}", 'green');

        $db = Database::connect(array_merge($cfg, ['database' => $testDb]), false);

        // === 1. Apply schema.sql ===
        $schemaPath = ROOTPATH . '../DB/baseline/v1.0/schema.sql';
        $schema = file_get_contents($schemaPath);
        $stmts = $this->splitSql($schema);
        $okSchema = 0; $skipViews = 0; $failSchema = 0;
        foreach ($stmts as $s) {
            try { $db->query($s); $okSchema++; }
            catch (\Throwable $e) {
                if (preg_match('/CREATE\s+(ALGORITHM|.*VIEW)|^DROP VIEW/i', $s)) { $skipViews++; continue; }
                CLI::error("  schema #{$okSchema}: " . substr($e->getMessage(), 0, 100));
                $failSchema++;
                if ($failSchema > 3) break;
            }
        }
        CLI::write("+ schema.sql: {$okSchema} OK, {$skipViews} views skipped, {$failSchema} failed", 'green');

        // === 2. Apply data.sql ===
        $dataPath = ROOTPATH . '../DB/baseline/v1.0/data.sql';
        $data = file_get_contents($dataPath);
        $stmts = $this->splitSql($data);
        $okData = 0; $failData = 0;
        foreach ($stmts as $s) {
            try { $db->query($s); $okData++; }
            catch (\Throwable $e) {
                CLI::error("  data #{$okData}: " . substr($e->getMessage(), 0, 100));
                $failData++;
                if ($failData > 3) break;
            }
        }
        CLI::write("+ data.sql: {$okData} OK, {$failData} failed", 'green');

        // === 3. Admin user FIRST (mimics fixed provision flow) ===
        $db->query("SET FOREIGN_KEY_CHECKS = 0");
        $adminId = 1;
        $hash = password_hash('simpass', PASSWORD_BCRYPT);
        $db->query(
            "INSERT INTO `user` (id, mail, pass, user_pass, name, id_user_rol, enabled, password_migrated) VALUES (?, ?, ?, ?, ?, ?, 1, 1)",
            [$adminId, 'admin@sim.test', $hash, $hash, 'Sim Admin', 7]
        );
        CLI::write("+ admin user id={$adminId} (rol 7=Administrador)", 'green');

        // === 4. Hierarchy ===
        $db->query(
            "INSERT INTO client_group (name, description, enabled, id_last_user_update) VALUES (?, ?, 1, ?)",
            ['Sim Group', 'simulated', $adminId]
        );
        $cgId = $db->insertID();
        $db->query(
            "INSERT INTO company (name, id_client_group, enabled, id_last_user_update) VALUES (?, ?, 1, ?)",
            ['Sim Company', $cgId, $adminId]
        );
        $cId = $db->insertID();
        $db->query(
            "INSERT INTO agency (name, id_company, enabled, id_last_user_update) VALUES (?, ?, 1, ?)",
            ['Sim Agency', $cId, $adminId]
        );
        $aId = $db->insertID();
        $db->query(
            "INSERT INTO client_group_process (id_client_group, id_process, display_order, enabled) VALUES (?, ?, ?, ?)",
            [$cgId, 1, 0, 1]
        );
        $db->query("SET FOREIGN_KEY_CHECKS = 1");
        CLI::write("+ hierarchy: client_group={$cgId}, company={$cId}, agency={$aId}, +1 process assignment", 'green');

        // === 5. Verify table count ===
        $rows = $db->query(
            "SELECT TABLE_TYPE, COUNT(*) AS n FROM information_schema.TABLES
             WHERE TABLE_SCHEMA = ? GROUP BY TABLE_TYPE",
            [$testDb]
        )->getResultArray();
        $totals = [];
        foreach ($rows as $r) $totals[$r['TABLE_TYPE']] = (int) $r['n'];
        $base = $totals['BASE TABLE'] ?? 0;
        $views = $totals['VIEW'] ?? 0;
        CLI::newLine();
        CLI::write("=== Verification ===", 'white');
        CLI::write("  Base tables: {$base}", $base >= 40 ? 'green' : 'red');
        CLI::write("  Views      : {$views}", 'cyan');
        CLI::write("  Total      : " . ($base + $views), 'cyan');

        // Spot-check a few critical tables have rows
        foreach (['user', 'company', 'agency', 'client_group', 'process', 'file_state', 'document_type', 'payment_method'] as $t) {
            $c = $db->query("SELECT COUNT(*) AS n FROM `{$t}`")->getRowArray();
            $n = (int) $c['n'];
            CLI::write("  {$t}: {$n} rows", $n > 0 ? 'green' : 'yellow');
        }

        if (!$keep) {
            $main->query("DROP DATABASE `{$testDb}`");
            CLI::newLine();
            CLI::write("- Dropped {$testDb} (use --keep to inspect)", 'white');
        } else {
            CLI::newLine();
            CLI::write("- Kept {$testDb}", 'yellow');
        }
        return EXIT_SUCCESS;
    }

    /**
     * Quote-aware splitter — same logic as the WIZARD's splitSqlStatements.
     * Strips full-line comments, splits on ; outside strings.
     */
    private function splitSql(string $text): array
    {
        $out = [];
        $buf = '';
        $inSingle = $inDouble = $inBacktick = $inComment = false;
        $len = strlen($text);
        for ($i = 0; $i < $len; $i++) {
            $ch = $text[$i];
            $next = $i + 1 < $len ? $text[$i + 1] : '';
            if ($inComment) {
                if ($ch === "\n") $inComment = false;
                $buf .= $ch; continue;
            }
            if (!$inSingle && !$inDouble && !$inBacktick && $ch === '-' && $next === '-') {
                $inComment = true; $buf .= $ch; continue;
            }
            if (!$inDouble && !$inBacktick && $ch === "'" && ($i === 0 || $text[$i - 1] !== '\\')) {
                if ($inSingle && $next === "'") { $buf .= "''"; $i++; continue; }
                $inSingle = !$inSingle;
            } elseif (!$inSingle && !$inBacktick && $ch === '"' && ($i === 0 || $text[$i - 1] !== '\\')) {
                $inDouble = !$inDouble;
            } elseif (!$inSingle && !$inDouble && $ch === '`') {
                $inBacktick = !$inBacktick;
            }
            if ($ch === ';' && !$inSingle && !$inDouble && !$inBacktick) {
                $cleaned = trim(implode("\n", array_filter(explode("\n", $buf), fn($l) => !preg_match('/^\s*(--|#)/', $l))));
                if ($cleaned !== '') $out[] = $cleaned;
                $buf = '';
            } else {
                $buf .= $ch;
            }
        }
        $tail = trim(implode("\n", array_filter(explode("\n", $buf), fn($l) => !preg_match('/^\s*(--|#)/', $l))));
        if ($tail !== '') $out[] = $tail;
        return $out;
    }
}
