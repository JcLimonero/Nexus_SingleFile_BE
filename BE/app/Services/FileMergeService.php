<?php

declare(strict_types=1);

namespace App\Services;

use CodeIgniter\Database\BaseConnection;
use RuntimeException;
use Throwable;

/**
 * Unifica expedientes duplicados (misma agencia + IdOrderTotal).
 * Principal: fase más avanzada; 5 (Cancelado) no compite como principal (rango 0).
 * Secundarios descartados: migración de documentos y IdCurrentState = 5 (Cancelado).
 */
class FileMergeService
{
    public function __construct(private BaseConnection $db)
    {
    }

    /**
     * @return array{success: bool, message: string, data: array|null}
     */
    public function mergeForAgencyOrder(int $agencyInternalId, string $idOrderTotal, bool $dryRun, int $userId): array
    {
        $files = $this->db->query(
            'SELECT * FROM File WHERE IdAgency = ? AND TRIM(CAST(IdOrderTotal AS CHAR)) = ?',
            [$agencyInternalId, $idOrderTotal]
        )->getResultArray();

        // No considerar expedientes ya en Cancelado (5): ya fueron descartados en unificación previa
        $files = array_values(array_filter(
            $files,
            static fn (array $f): bool => (int) ($f['IdCurrentState'] ?? 0) !== 5
        ));

        if (count($files) < 2) {
            return [
                'success' => true,
                'message' => 'No hay expedientes duplicados para este pedido y agencia (menos de 2 registros).',
                'data' => [
                    'agencyId' => $agencyInternalId,
                    'idOrderTotal' => $idOrderTotal,
                    'filesFound' => count($files),
                    'principalFileId' => isset($files[0]) ? (int) $files[0]['Id'] : null,
                    'operations' => [],
                ],
            ];
        }

        usort($files, function ($a, $b) {
            $ra = $this->filePhaseRank((int) ($a['IdCurrentState'] ?? 0));
            $rb = $this->filePhaseRank((int) ($b['IdCurrentState'] ?? 0));
            if ($rb !== $ra) {
                return $rb <=> $ra;
            }
            $da = strtotime((string) ($a['UpdateDate'] ?? $a['RegistrationDate'] ?? '1970-01-01'));
            $dbt = strtotime((string) ($b['UpdateDate'] ?? $b['RegistrationDate'] ?? '1970-01-01'));
            if ($dbt !== $da) {
                return $dbt <=> $da;
            }

            return (int) $b['Id'] <=> (int) $a['Id'];
        });

        $principal = $files[0];
        $secondaries = array_slice($files, 1);
        $principalId = (int) $principal['Id'];

        $data = [
            'agencyId' => $agencyInternalId,
            'idOrderTotal' => $idOrderTotal,
            'dryRun' => $dryRun,
            'principalFileId' => $principalId,
            'principalIdCurrentState' => $principal['IdCurrentState'] ?? null,
            'secondaryFileIds' => array_map(static fn ($r) => (int) $r['Id'], $secondaries),
            'documentOperations' => [],
            'canceledFileIds' => [],
        ];

        if ($dryRun) {
            foreach ($secondaries as $sec) {
                $sid = (int) $sec['Id'];
                $data['documentOperations'][] = [
                    'secondaryFileId' => $sid,
                    'operations' => $this->migrateDocumentsMergeSecondaryIntoPrincipal($principalId, $sid, true),
                ];
            }

            return [
                'success' => true,
                'message' => 'Simulación: sin cambios en base de datos. Revise documentOperations y secondaryFileIds.',
                'data' => $data,
            ];
        }

        $this->db->transStart();

        try {
            foreach ($secondaries as $sec) {
                $sid = (int) $sec['Id'];
                $ops = $this->migrateDocumentsMergeSecondaryIntoPrincipal($principalId, $sid, false);
                $data['documentOperations'][] = [
                    'secondaryFileId' => $sid,
                    'operations' => $ops,
                ];

                $this->runQueryOrFail(
                    'UPDATE File SET IdCurrentState = 5, UpdateDate = NOW(), IdLastUserUpdate = ? WHERE Id = ?',
                    [$userId > 0 ? $userId : null, $sid]
                );
                $data['canceledFileIds'][] = $sid;
            }

            if ($this->db->transStatus() === false) {
                $dbErr = $this->db->error();
                $mysqliHint = $this->mysqliDriverError();
                log_message('error', 'FileMergeService: consulta falló en transacción: ' . json_encode($dbErr) . ' ' . $mysqliHint);
                $this->db->transRollback();
                throw new RuntimeException(
                    'Error en consulta (transacción revertida): ' . json_encode($dbErr, JSON_UNESCAPED_UNICODE)
                    . ($mysqliHint !== '' ? ' | ' . $mysqliHint : '')
                );
            }

            $this->db->transComplete();

            if ($this->db->transStatus() === false) {
                $dbErr = $this->db->error();
                $mysqliHint = $this->mysqliDriverError();
                log_message('error', 'FileMergeService: commit fallido: ' . json_encode($dbErr) . ' ' . $mysqliHint);
                throw new RuntimeException(
                    'No se pudo confirmar la transacción: ' . json_encode($dbErr, JSON_UNESCAPED_UNICODE)
                    . ($mysqliHint !== '' ? ' | ' . $mysqliHint : '')
                );
            }

            return [
                'success' => true,
                'message' => 'Unificación completada: expediente principal conservado; duplicados descartados en Cancelado (IdCurrentState = 5).',
                'data' => $data,
            ];
        } catch (Throwable $e) {
            $this->db->transRollback();

            throw $e;
        }
    }

    private function filePhaseRank(int $state): int
    {
        // Tope del flujo “normal”: 4 Liberado. 6 sigue por debajo de 4; 5 (Cancelado) no compite (0).
        return match ($state) {
            4 => 100,
            6 => 95,
            3 => 60,
            2 => 50,
            1 => 40,
            5 => 0,
            default => 25,
        };
    }

    private function documentRowHasUpload(array $row): bool
    {
        $s = trim((string) ($row['ServerPath'] ?? ''));
        $p = trim((string) ($row['PathDocument'] ?? ''));

        return $s !== '' || $p !== '';
    }

    /**
     * FKs como IdDocumentError no admiten 0; valores inválidos se envían como NULL.
     */
    private function sanitizeNullableFkInt(mixed $value): ?int
    {
        if ($value === null || $value === '' || $value === false) {
            return null;
        }
        $i = (int) $value;

        return $i > 0 ? $i : null;
    }

    /**
     * CI4 a veces no rellena error() cuando mysqli falla dentro de transacción.
     */
    private function mysqliDriverError(): string
    {
        $c = $this->db->connID ?? null;
        if ($c instanceof \mysqli && $c->errno !== 0) {
            return 'mysqli errno ' . $c->errno . ': ' . $c->error;
        }

        return '';
    }

    /**
     * @param array<int|string|float|null> $binds
     */
    private function runQueryOrFail(string $sql, array $binds = []): void
    {
        $r = $this->db->query($sql, $binds);
        if ($r === false) {
            $dbErr = $this->db->error();
            $hint = $this->mysqliDriverError();
            throw new RuntimeException(
                'Consulta falló: ' . json_encode($dbErr, JSON_UNESCAPED_UNICODE)
                . ($hint !== '' ? ' | ' . $hint : '')
                . ' SQL: ' . substr($sql, 0, 500)
            );
        }
    }

    /**
     * @param array<int|string|float|null> $binds
     * @return list<array<string, mixed>>
     */
    private function fetchAllOrFail(string $sql, array $binds = []): array
    {
        $r = $this->db->query($sql, $binds);
        if ($r === false) {
            $dbErr = $this->db->error();
            $hint = $this->mysqliDriverError();
            throw new RuntimeException(
                'SELECT falló: ' . json_encode($dbErr, JSON_UNESCAPED_UNICODE)
                . ($hint !== '' ? ' | ' . $hint : '')
                . ' SQL: ' . substr($sql, 0, 500)
            );
        }

        return $r->getResultArray();
    }

    /**
     * @param array<int|string|float|null> $binds
     * @return array<string, mixed>|null
     */
    private function fetchRowOrFail(string $sql, array $binds = []): ?array
    {
        $r = $this->db->query($sql, $binds);
        if ($r === false) {
            $dbErr = $this->db->error();
            $hint = $this->mysqliDriverError();
            throw new RuntimeException(
                'SELECT falló: ' . json_encode($dbErr, JSON_UNESCAPED_UNICODE)
                . ($hint !== '' ? ' | ' . $hint : '')
                . ' SQL: ' . substr($sql, 0, 500)
            );
        }

        $row = $r->getRowArray();

        return $row ?: null;
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function migrateDocumentsMergeSecondaryIntoPrincipal(int $principalFileId, int $secondaryFileId, bool $dryRun): array
    {
        $log = [];
        $docs = $this->fetchAllOrFail(
            'SELECT * FROM DocumentByFile WHERE IdFile = ? ORDER BY Id ASC',
            [$secondaryFileId]
        );

        foreach ($docs as $doc) {
            $docId = (int) $doc['Id'];
            $typeId = $doc['IdDocumentType'] ?? null;

            if ($typeId === null || $typeId === '') {
                if (! $dryRun) {
                    $this->runQueryOrFail(
                        'UPDATE DocumentByFile SET IdFile = ?, UpdateDate = NOW() WHERE Id = ?',
                        [$principalFileId, $docId]
                    );
                }
                $log[] = ['action' => 'move_to_principal', 'documentId' => $docId, 'note' => 'sin IdDocumentType'];
                continue;
            }

            $principalDoc = $this->fetchRowOrFail(
                'SELECT * FROM DocumentByFile WHERE IdFile = ? AND IdDocumentType = ? LIMIT 1',
                [$principalFileId, $typeId]
            );

            if (! $principalDoc) {
                if (! $dryRun) {
                    $this->runQueryOrFail(
                        'UPDATE DocumentByFile SET IdFile = ?, UpdateDate = NOW() WHERE Id = ?',
                        [$principalFileId, $docId]
                    );
                }
                $log[] = ['action' => 'move_to_principal', 'documentId' => $docId, 'idDocumentType' => $typeId];
                continue;
            }

            $principalPid = (int) $principalDoc['Id'];
            $principalHasUpload = $this->documentRowHasUpload($principalDoc);
            $secondaryHasUpload = $this->documentRowHasUpload($doc);

            if (! $principalHasUpload && $secondaryHasUpload) {
                if (! $dryRun) {
                    $this->runQueryOrFail(
                        'UPDATE DocumentByFile SET ServerPath = ?, PathDocument = ?, IdCurrentStatus = ?, IdDocumentError = ?, Comment = ?, ExperationDate = ?, Name = ?, UpdateDate = NOW(), IdLastUserUpdate = ? WHERE Id = ?',
                        [
                            $doc['ServerPath'] ?? null,
                            $doc['PathDocument'] ?? null,
                            $this->sanitizeNullableFkInt($doc['IdCurrentStatus'] ?? null),
                            $this->sanitizeNullableFkInt($doc['IdDocumentError'] ?? null),
                            $doc['Comment'] ?? null,
                            $doc['ExperationDate'] ?? null,
                            $doc['Name'] ?? null,
                            $this->sanitizeNullableFkInt($doc['IdLastUserUpdate'] ?? null),
                            $principalPid,
                        ]
                    );
                    $this->runQueryOrFail('DELETE FROM DocumentByFile WHERE Id = ?', [$docId]);
                }
                $log[] = ['action' => 'merged_content_into_principal', 'fromDocumentId' => $docId, 'principalDocumentId' => $principalPid, 'idDocumentType' => $typeId];
                continue;
            }

            if (! $dryRun) {
                $this->runQueryOrFail('DELETE FROM DocumentByFile WHERE Id = ?', [$docId]);
            }
            $log[] = ['action' => 'removed_duplicate_row', 'documentId' => $docId, 'idDocumentType' => $typeId];
        }

        return $log;
    }
}
