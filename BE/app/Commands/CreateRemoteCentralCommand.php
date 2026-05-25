<?php

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use Config\Database;

/**
 * One-shot: CREATE DATABASE nexfile_central on whatever server the default
 * connection points to. Idempotent. Use this when you want the central DB
 * on the same MySQL server as the tenant BE (typical SaaS layout).
 */
class CreateRemoteCentralCommand extends BaseCommand
{
    protected $group       = 'Tenant';
    protected $name        = 'tenant:create-central';
    protected $description = 'CREATE DATABASE nexfile_central on the default connection server.';

    public function run(array $params)
    {
        $db = Database::connect();
        $host = $db->getDatabase();
        try {
            $db->query('CREATE DATABASE IF NOT EXISTS `nexfile_central` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
            CLI::write('+ nexfile_central created (or already existed) on server reachable from default group', 'green');
        } catch (\Throwable $e) {
            CLI::error('Failed: ' . $e->getMessage());
            return EXIT_ERROR;
        }
        return EXIT_SUCCESS;
    }
}
