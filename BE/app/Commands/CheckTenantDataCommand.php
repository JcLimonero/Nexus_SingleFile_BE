<?php

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use Config\Database;

class CheckTenantDataCommand extends BaseCommand
{
    protected $group       = 'Tenant';
    protected $name        = 'tenant:check-data';
    protected $description = 'Count rows in each table of a DB (sanity before dropping).';
    protected $usage       = 'tenant:check-data --db=<name>';
    protected $options     = ['--db' => 'Database to inspect'];

    public function run(array $params)
    {
        $target = (string) (CLI::getOption('db') ?? '');
        if (!preg_match('/^[A-Za-z0-9_]+$/', $target)) {
            CLI::error('invalid --db');
            return EXIT_ERROR;
        }
        $cfg = config('Database')->default;
        $cfg['database'] = $target;
        $db = Database::connect($cfg, false);
        $tables = $db->query(
            "SELECT TABLE_NAME FROM information_schema.TABLES
             WHERE TABLE_SCHEMA = ? AND TABLE_TYPE='BASE TABLE'
             ORDER BY TABLE_NAME",
            [$target]
        )->getResultArray();
        $totalRows = 0;
        foreach ($tables as $t) {
            $name = $t['TABLE_NAME'];
            $c = $db->query("SELECT COUNT(*) AS n FROM `{$name}`")->getRowArray();
            $n = (int) $c['n'];
            $totalRows += $n;
            if ($n > 0) CLI::write("  {$name}: {$n} rows", 'cyan');
        }
        CLI::newLine();
        CLI::write("Total: {$totalRows} rows across " . count($tables) . " tables", 'green');
        return EXIT_SUCCESS;
    }
}
