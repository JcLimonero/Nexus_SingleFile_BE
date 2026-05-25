<?php

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use App\Models\SuperAdminUserModel;

/**
 * Creates (or resets) a super-admin user.
 *
 * Usage:
 *   php spark super-admin:seed --email=root@nexusqtech.com --password=secret
 *   php spark super-admin:seed --email=root@nexusqtech.com --password=secret --name="Carlos"
 */
class SeedSuperAdminCommand extends BaseCommand
{
    protected $group       = 'Tenant';
    protected $name        = 'super-admin:seed';
    protected $description = 'Create or reset a super-admin user.';
    protected $usage       = 'super-admin:seed --email=<email> --password=<pass> [--name=<name>]';
    protected $options     = [
        '--email'    => 'Super-admin email (required)',
        '--password' => 'Super-admin password (required)',
        '--name'     => 'Display name (optional)',
    ];

    public function run(array $params)
    {
        $email    = (string) (CLI::getOption('email')    ?? '');
        $password = (string) (CLI::getOption('password') ?? '');
        $name     = (string) (CLI::getOption('name')     ?? '');
        if ($email === '' || $password === '') {
            CLI::error('--email and --password are required');
            return EXIT_ERROR;
        }

        $model = new SuperAdminUserModel();
        $hash = password_hash($password, PASSWORD_BCRYPT);
        $existing = $model->where('email', $email)->first();
        if ($existing) {
            $model->update($existing['id'], [
                'password_hash' => $hash,
                'name' => $name ?: ($existing['name'] ?? null),
                'enabled' => 1,
            ]);
            CLI::write("Updated super-admin: {$email}", 'green');
        } else {
            $model->insert([
                'email' => $email,
                'password_hash' => $hash,
                'name' => $name ?: null,
                'enabled' => 1,
            ]);
            CLI::write("Created super-admin: {$email}", 'green');
        }
        return EXIT_SUCCESS;
    }
}
