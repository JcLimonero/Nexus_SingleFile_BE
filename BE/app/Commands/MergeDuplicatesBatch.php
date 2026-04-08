<?php

declare(strict_types=1);

namespace App\Commands;

use App\Services\FileMergeService;
use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use Config\Database;
use Throwable;

/**
 * Procesa muchas unificaciones desde un archivo (una pareja agencia|pedido por línea).
 *
 * php spark merge:duplicates:batch writable/merge_batch_pairs.txt
 */
class MergeDuplicatesBatch extends BaseCommand
{
    protected $group = 'Files';

    protected $name = 'merge:duplicates:batch';

    protected $description = 'Unifica expedientes en lote leyendo agencia|pedido por línea desde un archivo.';

    protected $usage = 'merge:duplicates:batch <path/to/file.txt>

El archivo debe tener una línea por registro:
  Nombre de agencia|número de pedido DMS
  Ej: BMW|PV230788
  Ej: AUDI CENTER GALERIAS|13311';

    public function run(array $params)
    {
        $path = $params[0] ?? null;
        if ($path === null || $path === '') {
            CLI::error('Uso: php spark merge:duplicates:batch <ruta-archivo> [--dry-run]');

            return;
        }

        if (! is_file($path) || ! is_readable($path)) {
            CLI::error('No se puede leer el archivo: ' . $path);

            return;
        }

        $dryRun = CLI::getOption('dry-run') !== null;
        $db = Database::connect();

        CLI::write($dryRun ? 'MODO DRY-RUN (sin escrituras)' : 'MODO EJECUCIÓN', $dryRun ? 'yellow' : 'green');
        CLI::newLine();

        $lines = file($path, FILE_IGNORE_NEW_LINES);
        if ($lines === false) {
            CLI::error('No se pudo leer el archivo.');

            return;
        }

        $n = 0;
        $ok = 0;
        $warn = 0;
        $err = 0;

        foreach ($lines as $lineNum => $rawLine) {
            $line = trim($rawLine);
            if ($line === '' || str_starts_with($line, '#')) {
                continue;
            }

            $parts = explode('|', $line, 2);
            if (count($parts) < 2) {
                CLI::write(sprintf('SKIP línea %d (formato: agencia|pedido): %s', $lineNum + 1, $line), 'yellow');
                ++$warn;
                continue;
            }

            $agencyName = trim($parts[0]);
            $idOrderTotal = trim($parts[1]);
            if ($agencyName === '' || $idOrderTotal === '') {
                ++$warn;
                continue;
            }

            ++$n;
            CLI::write("[{$n}] {$agencyName} / {$idOrderTotal} ... ", 'white');

            $agency = $db->query(
                'SELECT Id, Name FROM Agency WHERE LOWER(TRIM(Name)) = LOWER(TRIM(?)) LIMIT 1',
                [$agencyName]
            )->getRowArray();

            if (! $agency) {
                CLI::write('ERR agencia no encontrada', 'red');
                ++$err;
                continue;
            }

            try {
                $svc = new FileMergeService($db);
                $result = $svc->mergeForAgencyOrder((int) $agency['Id'], $idOrderTotal, $dryRun, 0);
                $data = $result['data'] ?? [];
                $principal = $data['principalFileId'] ?? null;
                $secondaryCount = isset($data['secondaryFileIds']) ? count($data['secondaryFileIds']) : 0;
                $canceledCount = isset($data['canceledFileIds']) ? count($data['canceledFileIds']) : 0;

                if (str_contains($result['message'] ?? '', 'menos de 2 registros')) {
                    CLI::write("OK sin duplicados principal={$principal}", 'cyan');
                } else {
                    CLI::write("OK principal={$principal} secundarios={$secondaryCount} cancelados (5)={$canceledCount}", 'green');
                    ++$ok;
                }
            } catch (Throwable $e) {
                CLI::write('EXC ' . $e->getMessage(), 'red');
                ++$err;
            }
        }

        CLI::newLine();
        CLI::write("Resumen: procesadas con datos {$n}, merges con duplicados {$ok}, advertencias/skip {$warn}, errores {$err}", 'yellow');
    }
}
