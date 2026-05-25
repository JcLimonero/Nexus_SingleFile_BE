<?php

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use Config\Database;

/**
 * Clones the schema of the current database into a new target database on the
 * same MySQL server. No data is copied by default; pass --with-data to seed
 * specific tables (catalogs + roles + admin user).
 *
 * Usage:
 *   php spark db:clone-schema --target=Nexfile_Config
 *   php spark db:clone-schema --target=Nexfile_Config --with-seed
 *
 * The companion seed step lives in db:seed-config (see SeedConfigDbCommand).
 */
class CloneSchemaCommand extends BaseCommand
{
    protected $group       = 'Database';
    protected $name        = 'db:clone-schema';
    protected $description = 'Clone the schema of the source DB to a target DB on the same server.';
    protected $usage       = 'db:clone-schema --target=<dbname> [--drop-target]';
    protected $options     = [
        '--target'      => 'Target database name (required)',
        '--drop-target' => 'DROP DATABASE on target first (DESTRUCTIVE)',
    ];

    public function run(array $params)
    {
        $target = (string) (CLI::getOption('target') ?? $params['target'] ?? '');
        if ($target === '') {
            CLI::error('--target is required');
            return EXIT_ERROR;
        }
        if (!preg_match('/^[A-Za-z0-9_]+$/', $target)) {
            CLI::error('Invalid target name (alnum + underscore only)');
            return EXIT_ERROR;
        }

        $dropFirst = (bool) CLI::getOption('drop-target');

        $source = Database::connect();
        $sourceName = $source->getDatabase();
        if ($sourceName === $target) {
            CLI::error('Source and target must differ');
            return EXIT_ERROR;
        }

        CLI::write("Source DB : {$sourceName}", 'cyan');
        CLI::write("Target DB : {$target}", 'cyan');

        if ($dropFirst) {
            CLI::write("Dropping {$target} first...", 'yellow');
            $source->query("DROP DATABASE IF EXISTS `{$target}`");
        }

        // Create target if missing
        $source->query("CREATE DATABASE IF NOT EXISTS `{$target}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        CLI::write("Target database ensured.", 'green');

        // Open a second connection to the target, reusing the same credentials
        $config = config('Database');
        $targetConfig = $config->default;
        $targetConfig['database'] = $target;
        $targetDb = Database::connect($targetConfig, false);

        // Disable FK checks during schema clone (so creation order doesn't matter)
        $targetDb->query('SET FOREIGN_KEY_CHECKS = 0');

        // Discover base tables vs views via information_schema
        $sourceName = $source->getDatabase();
        $rows = $source->query(
            "SELECT TABLE_NAME, TABLE_TYPE FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?",
            [$sourceName]
        )->getResultArray();

        $baseTables = [];
        $views = [];
        foreach ($rows as $r) {
            if (($r['TABLE_TYPE'] ?? '') === 'VIEW') {
                $views[] = $r['TABLE_NAME'];
            } else {
                $baseTables[] = $r['TABLE_NAME'];
            }
        }

        CLI::write('Base tables: ' . count($baseTables) . ' | Views: ' . count($views), 'cyan');

        $created = 0;
        $skipped = 0;
        // 1) Base tables
        foreach ($baseTables as $table) {
            if ($targetDb->tableExists($table)) {
                CLI::write("  - {$table} (exists, skipped)", 'yellow');
                $skipped++;
                continue;
            }
            $row = $source->query("SHOW CREATE TABLE `{$table}`")->getRowArray();
            $ddl = $row['Create Table'] ?? null;
            if (!$ddl) {
                CLI::write("  ! {$table} (no DDL returned)", 'red');
                continue;
            }
            try {
                $targetDb->query($ddl);
                CLI::write("  + {$table}", 'green');
                $created++;
            } catch (\Throwable $e) {
                CLI::write("  ! {$table}: " . $e->getMessage(), 'red');
            }
        }

        // 2) Views — use SHOW CREATE VIEW and strip DEFINER to avoid permission issues on target
        foreach ($views as $view) {
            if ($targetDb->tableExists($view)) {
                CLI::write("  - {$view} (view exists, skipped)", 'yellow');
                $skipped++;
                continue;
            }
            $row = $source->query("SHOW CREATE VIEW `{$view}`")->getRowArray();
            $ddl = $row['Create View'] ?? null;
            if (!$ddl) {
                CLI::write("  ! {$view} (no view DDL)", 'red');
                continue;
            }
            // Strip the DEFINER clause + SQL SECURITY to avoid cross-DB permission issues
            $ddl = preg_replace('/DEFINER\s*=\s*`[^`]+`@`[^`]+`\s*/i', '', $ddl);
            $ddl = preg_replace('/SQL\s+SECURITY\s+DEFINER\s*/i', 'SQL SECURITY INVOKER ', $ddl);
            // Rewrite db-qualified references from source DB to target DB
            $ddl = str_replace("`{$sourceName}`.", "`{$target}`.", $ddl);
            try {
                $targetDb->query($ddl);
                CLI::write("  + view {$view}", 'green');
                $created++;
            } catch (\Throwable $e) {
                CLI::write("  ! view {$view}: " . $e->getMessage(), 'red');
            }
        }

        $targetDb->query('SET FOREIGN_KEY_CHECKS = 1');

        CLI::newLine();
        CLI::write("Done. Created: {$created}, Skipped: {$skipped}", 'green');
        return EXIT_SUCCESS;
    }
}
