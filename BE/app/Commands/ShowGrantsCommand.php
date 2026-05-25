<?php

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use Config\Database;

class ShowGrantsCommand extends BaseCommand
{
    protected $group       = 'Tenant';
    protected $name        = 'tenant:show-grants';
    protected $description = 'Show GRANTS for the default-connection MySQL user.';

    public function run(array $params)
    {
        $db = Database::connect();
        $rows = $db->query('SHOW GRANTS')->getResultArray();
        foreach ($rows as $r) {
            foreach ($r as $g) CLI::write($g);
        }
        return EXIT_SUCCESS;
    }
}
