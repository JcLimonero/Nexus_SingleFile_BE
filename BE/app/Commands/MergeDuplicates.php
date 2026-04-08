<?php

declare(strict_types=1);

namespace App\Commands;

use App\Services\FileMergeService;
use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use Config\Database;
use Throwable;

/**
 * Unifica expedientes duplicados (CLI, sin JWT).
 *
 * php spark merge:duplicates "HONDA GALERIAS" 35851
 * php spark merge:duplicates "HONDA GALERIAS" 35851 --dry-run
 */
class MergeDuplicates extends BaseCommand
{
    protected $group = 'Files';

    protected $name = 'merge:duplicates';

    protected $description = 'Unifica expedientes duplicados por nombre de agencia y número de pedido DMS (IdOrderTotal).';

    protected $usage = 'merge:duplicates <agencyName> <idOrderTotal> [options]';

    /** @var array<string, string> */
    protected $arguments = [
        'agencyName' => 'Nombre exacto de la agencia (ej. HONDA GALERIAS)',
        'idOrderTotal' => 'Número de pedido DMS (ej. 35851)',
    ];

    /** @var array<string, string> */
    protected $options = [
        '--dry-run' => 'Solo simular, sin cambios en base de datos',
    ];

    public function run(array $params)
    {
        $agencyName = $params[0] ?? null;
        $idOrderTotal = isset($params[1]) ? trim((string) $params[1]) : '';

        if ($agencyName === null || $agencyName === '') {
            CLI::error('Uso: php spark merge:duplicates <agencyName> <idOrderTotal> [--dry-run]');

            return;
        }

        if ($idOrderTotal === '') {
            CLI::error('idOrderTotal es requerido (segundo argumento).');

            return;
        }

        $dryRun = CLI::getOption('dry-run') !== null;

        $db = Database::connect();
        $agency = $db->query(
            'SELECT Id, Name, IdAgency FROM Agency WHERE LOWER(TRIM(Name)) = LOWER(TRIM(?)) LIMIT 1',
            [trim((string) $agencyName)]
        )->getRowArray();

        if (! $agency) {
            CLI::error('Agencia no encontrada: ' . $agencyName);

            return;
        }

        CLI::write('Agencia: ' . ($agency['Name'] ?? '') . ' (Id interno=' . ($agency['Id'] ?? '') . ', IdAgency DMS=' . ($agency['IdAgency'] ?? '') . ')', 'yellow');
        CLI::write('Pedido DMS: ' . $idOrderTotal . ($dryRun ? ' [DRY-RUN]' : ''), 'yellow');
        CLI::newLine();

        try {
            $svc = new FileMergeService($db);
            $result = $svc->mergeForAgencyOrder((int) $agency['Id'], $idOrderTotal, $dryRun, 0);

            CLI::write($result['message'], $result['success'] ? 'green' : 'red');
            CLI::newLine();
            CLI::write(json_encode($result['data'] ?? null, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            CLI::newLine();
        } catch (Throwable $e) {
            CLI::error($e->getMessage());
            CLI::error($e->getFile() . ':' . $e->getLine());
        }
    }
}
