<?php

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use Config\Database;

/**
 * One-shot helper to apply the file_status → expedient_state rename against a
 * specific DB (sandbox or production) without going through the full CI4
 * migration runner — useful when the target DB has a mixed history of raw SQL
 * migrations and CI4 migrations that don't all replay cleanly.
 *
 * Usage:
 *   php spark db:rename-file-status --target=Nexfile_Config
 *   php spark db:rename-file-status --target=nexfile --confirm
 *
 * Without --confirm, only previews what would be renamed.
 */
class RenameFileStatusOnDbCommand extends BaseCommand
{
    protected $group       = 'Database';
    protected $name        = 'db:rename-file-status';
    protected $description = 'Applies RENAME TABLE file_status → expedient_state on the given DB.';
    protected $usage       = 'db:rename-file-status --target=<dbname> [--confirm]';
    protected $options     = [
        '--target'  => 'Target database name (required)',
        '--confirm' => 'Actually execute (without it, dry-run)',
    ];

    public function run(array $params)
    {
        $target = (string) (CLI::getOption('target') ?? $params['target'] ?? '');
        if ($target === '' || !preg_match('/^[A-Za-z0-9_]+$/', $target)) {
            CLI::error('--target=<dbname> is required (alnum + underscore only)');
            return EXIT_ERROR;
        }
        $confirm = (bool) CLI::getOption('confirm');

        $config = config('Database');
        $cfg = $config->default;
        $cfg['database'] = $target;
        $db = Database::connect($cfg, false);

        $renames = [
            ['file_status',     'expedient_state'],
            ['file_sub_status', 'expedient_sub_state'],
        ];

        foreach ($renames as [$from, $to]) {
            $fromExists = $db->tableExists($from);
            $toExists   = $db->tableExists($to);

            if ($toExists && !$fromExists) {
                CLI::write("  · {$from} → {$to}: already renamed (target exists)", 'yellow');
                continue;
            }
            if (!$fromExists) {
                CLI::write("  · {$from}: source missing — skipping", 'yellow');
                continue;
            }
            if ($toExists && $fromExists) {
                CLI::error("  ! Both {$from} and {$to} exist on {$target} — manual cleanup required");
                continue;
            }
            if (!$confirm) {
                CLI::write("  · would RENAME `{$from}` TO `{$to}`", 'cyan');
                continue;
            }
            $db->query("RENAME TABLE `{$from}` TO `{$to}`");
            CLI::write("  + RENAME `{$from}` TO `{$to}`", 'green');
        }

        if (!$confirm) {
            CLI::write('Dry-run. Re-run with --confirm to apply.', 'white');
        }
        return EXIT_SUCCESS;
    }
}
