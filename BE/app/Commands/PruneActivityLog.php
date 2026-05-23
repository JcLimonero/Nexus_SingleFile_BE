<?php

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;

/**
 * Borra registros de user_activity_log más viejos que N días (90 por default).
 *
 * Uso:
 *   php spark activity-log:prune              # 90 días
 *   php spark activity-log:prune --days=30    # custom
 *
 * Programar en cron diariamente (ej. Railway cron, 03:00 UTC):
 *   0 3 * * *  php spark activity-log:prune
 */
class PruneActivityLog extends BaseCommand
{
    protected $group       = 'Maintenance';
    protected $name        = 'activity-log:prune';
    protected $description = 'Borra entradas viejas de user_activity_log';
    protected $usage       = 'activity-log:prune [--days=N]';
    protected $arguments   = [];
    protected $options     = ['--days' => 'Días a conservar (default 90)'];

    public function run(array $params)
    {
        $days = (int) ($params['days'] ?? CLI::getOption('days') ?? 90);
        if ($days < 1) {
            CLI::error('--days debe ser >= 1');
            return EXIT_ERROR;
        }

        $threshold = date('Y-m-d H:i:s', time() - ($days * 86400));

        $db = \Config\Database::connect();

        // Sanity check antes de borrar
        $count = (int) $db->table('user_activity_log')
            ->where('registration_date <', $threshold)
            ->countAllResults();

        if ($count === 0) {
            CLI::write("Nada que purgar (umbral: {$threshold}).", 'yellow');
            return EXIT_SUCCESS;
        }

        CLI::write("Purgando {$count} entradas anteriores a {$threshold}...");

        $start = microtime(true);
        $db->table('user_activity_log')
            ->where('registration_date <', $threshold)
            ->delete();
        $elapsed = round(microtime(true) - $start, 2);

        CLI::write("Borradas {$count} filas en {$elapsed}s.", 'green');
        return EXIT_SUCCESS;
    }
}
