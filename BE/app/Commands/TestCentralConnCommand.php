<?php

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use Config\Database;

class TestCentralConnCommand extends BaseCommand
{
    protected $group       = 'Tenant';
    protected $name        = 'tenant:test-central';
    protected $description = 'Verify BE can connect to the central DB via the central group.';

    public function run(array $params)
    {
        try {
            $db = Database::connect('central');
            $row = $db->query('SELECT COUNT(*) AS n FROM super_admin_user')->getRowArray();
            CLI::write('OK central connection. super_admin_user rows: ' . $row['n'], 'green');
            $row2 = $db->query('SELECT COUNT(*) AS n FROM tenant')->getRowArray();
            CLI::write('tenant rows: ' . $row2['n'], 'cyan');
        } catch (\Throwable $e) {
            CLI::error('FAILED: ' . $e->getMessage());
            return EXIT_ERROR;
        }
        return EXIT_SUCCESS;
    }
}
