<?php

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use Config\Database;

class CountTablesCommand extends BaseCommand
{
    protected $group       = 'Tenant';
    protected $name        = 'tenant:count-tables';
    protected $description = 'List + count tables for the given DB (default: connected one).';
    protected $usage       = 'tenant:count-tables [--db=<name>]';
    protected $options     = ['--db' => 'Database to inspect (default: from .env)'];

    public function run(array $params)
    {
        $target = (string) (CLI::getOption('db') ?? '');
        $db = Database::connect();
        $name = $target ?: $db->getDatabase();
        if (!preg_match('/^[A-Za-z0-9_]+$/', $name)) {
            CLI::error('invalid db name');
            return EXIT_ERROR;
        }
        $rows = $db->query(
            "SELECT TABLE_NAME FROM information_schema.TABLES
             WHERE TABLE_SCHEMA = ? AND TABLE_TYPE='BASE TABLE'
             ORDER BY TABLE_NAME",
            [$name]
        )->getResultArray();
        CLI::write("Tables in `{$name}`: " . count($rows), 'cyan');
        foreach ($rows as $r) CLI::write('  - ' . $r['TABLE_NAME']);
        return EXIT_SUCCESS;
    }
}
