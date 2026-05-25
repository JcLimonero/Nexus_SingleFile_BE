<?php

namespace App\Commands\Expedientes;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;

/**
 * Repara automáticamente los primeros 10 expedientes pendientes en expedients_to_correct.
 * Ejecutar con cron: php spark expedientes:auto-reparar
 */
class AutoReparar extends BaseCommand
{
    protected $group = 'Expedientes';
    protected $name = 'expedientes:auto-reparar';
    protected $description = 'Repara los primeros 10 expedientes pendientes (api_result IS NULL)';
    protected $usage = 'expedientes:auto-reparar [limit]';

    public function run(array $params)
    {
        $limit = (int) ($params[0] ?? 10);
        $limit = $limit > 0 ? $limit : 10;

        $db = \Config\Database::connect();
        $rows = $db->query("
            SELECT ec.id, ec.idExpediente, ec.idAgency, ec.ndDMS
            FROM expedients_to_correct ec
            WHERE ec.api_result IS NULL OR NOT JSON_CONTAINS(ec.api_result, 'true', '$.success')
            ORDER BY (ec.idAgency IN (20, 21, 22)) DESC, ec.idAgency ASC, ec.id ASC
            LIMIT ?
        ", [$limit])->getResultArray();

        if (empty($rows)) {
            CLI::write('No hay expedientes pendientes de reparar.', 'green');
            return;
        }

        CLI::write("Procesando " . count($rows) . " expediente(s)...", 'yellow');
        $reparados = 0;
        $errores = 0;

        foreach ($rows as $row) {
            $result = $this->ejecutarReparacion($db, $row);
            if ($result) {
                $reparados++;
                CLI::write("  ✓ Expediente {$row['idExpediente']} reparado", 'green');
            } else {
                $errores++;
                CLI::write("  ✗ Expediente {$row['idExpediente']} - error", 'red');
            }
        }

        CLI::write("Completado: {$reparados} reparado(s), {$errores} error(es)", 'cyan');
    }

    private function guardarError($db, array $row, string $message, ?\Throwable $e = null): void
    {
        $ndDMS = $row['ndDMS'] ?? '';
        $idAgency = (int) $row['idAgency'];
        $idExpediente = (int) $row['idExpediente'];
        $payload = [
            'success' => false,
            'message' => $message,
            'request' => [
                'ndDMS' => $ndDMS,
                'idAgency' => $idAgency,
                'idExpediente' => $idExpediente
            ]
        ];
        if ($e !== null) {
            $payload['errorCode'] = $e->getCode();
            $payload['errorDetail'] = $e->getMessage();
            $payload['errorFile'] = basename($e->getFile());
            $payload['errorLine'] = $e->getLine();
            if ($e->getPrevious()) {
                $prev = $e->getPrevious();
                $payload['errorPrevious'] = $prev->getMessage();
                $payload['errorPreviousCode'] = $prev->getCode();
            }
        }
        try {
            $db->query("UPDATE expedients_to_correct SET api_result = ? WHERE idExpediente = ? AND idAgency = ? AND ndDMS = ?",
                [json_encode($payload), $idExpediente, $idAgency, $ndDMS]);
        } catch (\Throwable $e2) {
            // ignorar
        }
    }

    private function ejecutarReparacion($db, array $row): bool
    {
        try {
            $ndDMS = trim((string) ($row['ndDMS'] ?? ''));
            $idAgency = (int) $row['idAgency'];
            $idExpediente = (int) $row['idExpediente'];

            if ($ndDMS === '') {
                $this->guardarError($db, $row, 'ndDMS vacío');
                return false;
            }

            $vcr = $db->query("SELECT idCliente FROM view_client_relations WHERE TRIM(ndCliente) = ? AND idAgency = ? LIMIT 1",
                [$ndDMS, $idAgency])->getRowArray();

            if (!$vcr || empty($vcr['idCliente'])) {
                $this->guardarError($db, $row, 'No encontrado en view_client_relations');
                return false;
            }

            $idClient = (int) $vcr['idCliente'];
            $db->table('expedient')->where('Id', $idExpediente)->update(['IdClient' => $idClient]);
            if ($db->affectedRows() === 0) {
                $this->guardarError($db, $row, 'File no actualizado');
                return false;
            }

            $db->query("UPDATE expedients_to_correct SET api_result = ? WHERE idExpediente = ? AND idAgency = ? AND ndDMS = ?",
                [json_encode(['success' => true, 'idClient' => $idClient]), $idExpediente, $idAgency, $ndDMS]);

            return true;
        } catch (\Throwable $e) {
            $this->guardarError($db, $row, $e->getMessage(), $e);
            return false;
        }
    }
}
