<?php

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use Config\Database;

/**
 * Apply only the Phase A migrations (client_group, junctions, company FK,
 * file_state flag) against a specific DB. Bypasses the CI4 migrations table
 * for sandbox DBs whose history doesn't replay cleanly.
 *
 * Usage:
 *   php spark db:apply-phase-a --target=Nexfile_Config
 */
class ApplyPhaseAMigrationsCommand extends BaseCommand
{
    protected $group       = 'Database';
    protected $name        = 'db:apply-phase-a';
    protected $description = 'Apply Phase A (procesos configurables) migrations on the given DB.';
    protected $usage       = 'db:apply-phase-a --target=<dbname>';
    protected $options     = ['--target' => 'Target database name (required)'];

    public function run(array $params)
    {
        $target = (string) (CLI::getOption('target') ?? $params['target'] ?? '');
        if ($target === '' || !preg_match('/^[A-Za-z0-9_]+$/', $target)) {
            CLI::error('--target=<dbname> is required');
            return EXIT_ERROR;
        }

        $config = config('Database');
        $cfg = $config->default;
        $cfg['database'] = $target;
        $db = Database::connect($cfg, false);

        // 1) client_group
        if (!$db->tableExists('client_group')) {
            $db->query('CREATE TABLE `client_group` (
                `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                `name` VARCHAR(200) NOT NULL,
                `description` TEXT NULL,
                `enabled` TINYINT(1) NOT NULL DEFAULT 1,
                `registration_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
                `update_date` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                `id_last_user_update` BIGINT UNSIGNED NULL,
                PRIMARY KEY (`id`),
                UNIQUE KEY `name` (`name`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci');
            CLI::write('+ client_group', 'green');
        } else {
            CLI::write('· client_group (exists)', 'yellow');
        }

        // 2) client_group_process
        if (!$db->tableExists('client_group_sale_type')) {
            $db->query('CREATE TABLE `client_group_sale_type` (
                `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                `id_client_group` BIGINT UNSIGNED NOT NULL,
                `id_sale_type` BIGINT UNSIGNED NOT NULL,
                `display_order` INT DEFAULT 0,
                `enabled` TINYINT(1) DEFAULT 1,
                `registration_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
                `update_date` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (`id`),
                UNIQUE KEY `uq_group_process` (`id_client_group`, `id_sale_type`),
                KEY `idx_id_process` (`id_sale_type`),
                CONSTRAINT `fk_cgp_client_group` FOREIGN KEY (`id_client_group`) REFERENCES `client_group` (`id`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci');
            CLI::write('+ client_group_process', 'green');
        } else {
            CLI::write('· client_group_process (exists)', 'yellow');
        }

        // 3) client_group_phase
        if (!$db->tableExists('client_group_phase')) {
            $db->query('CREATE TABLE `client_group_phase` (
                `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                `id_client_group` BIGINT UNSIGNED NOT NULL,
                `id_file_state` BIGINT UNSIGNED NOT NULL,
                `display_order` INT DEFAULT 0,
                `enabled` TINYINT(1) DEFAULT 1,
                `registration_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
                `update_date` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (`id`),
                UNIQUE KEY `uq_group_phase` (`id_client_group`, `id_file_state`),
                KEY `idx_id_file_state` (`id_file_state`),
                CONSTRAINT `fk_cgph_client_group` FOREIGN KEY (`id_client_group`) REFERENCES `client_group` (`id`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci');
            CLI::write('+ client_group_phase', 'green');
        } else {
            CLI::write('· client_group_phase (exists)', 'yellow');
        }

        // 4) company.id_client_group
        $companyCols = $db->getFieldNames('company');
        if (!in_array('id_client_group', $companyCols, true)) {
            $db->query('ALTER TABLE `company` ADD COLUMN `id_client_group` BIGINT UNSIGNED NULL AFTER `id`');
            $db->query('CREATE INDEX `idx_company_client_group` ON `company` (`id_client_group`)');
            CLI::write('+ company.id_client_group', 'green');
        } else {
            CLI::write('· company.id_client_group (exists)', 'yellow');
        }

        // 5) file_state.requires_payment_voucher
        $fsCols = $db->getFieldNames('file_state');
        if (!in_array('requires_payment_voucher', $fsCols, true)) {
            $db->query('ALTER TABLE `file_state` ADD COLUMN `requires_payment_voucher` TINYINT(1) NOT NULL DEFAULT 0 AFTER `enabled`');
            $db->query('UPDATE `file_state` SET `requires_payment_voucher` = 1 WHERE `id` = 2');
            CLI::write('+ file_state.requires_payment_voucher (Liquidación backfilled)', 'green');
        } else {
            CLI::write('· file_state.requires_payment_voucher (exists)', 'yellow');
        }

        CLI::newLine();
        CLI::write('Done.', 'green');
        return EXIT_SUCCESS;
    }
}
