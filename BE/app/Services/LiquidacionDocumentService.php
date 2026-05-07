<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\DocumentModel;
use CodeIgniter\Database\BaseConnection;
use RuntimeException;

class LiquidacionDocumentService
{
    public const DOCUMENT_TYPE_LIQUIDACION = 21;

    public function __construct(private BaseConnection $db)
    {
    }

    /**
     * @return array{outcome: 'none'|'one'|'many', ids: list<int>}
     */
    public function resolveFileIdByDmsAgencyAndOrder(string $idAgencyDms, string $ndPedido): array
    {
        $nd = trim($ndPedido);
        $ag = trim($idAgencyDms);
        if ($nd === '' || $ag === '') {
            return ['outcome' => 'none', 'ids' => []];
        }

        $rows = $this->db->query(
            'SELECT f.Id
             FROM File f
             INNER JOIN Agency a ON a.Id = f.IdAgency
             WHERE TRIM(CAST(f.IdOrderTotal AS CHAR)) = ?
               AND TRIM(CAST(a.IdAgency AS CHAR)) = ?',
            [$nd, $ag]
        )->getResultArray();

        $ids = array_map(static fn (array $r): int => (int) $r['Id'], $rows);
        if (count($ids) === 0) {
            return ['outcome' => 'none', 'ids' => []];
        }
        if (count($ids) > 1) {
            return ['outcome' => 'many', 'ids' => $ids];
        }

        return ['outcome' => 'one', 'ids' => $ids];
    }

    /**
     * Registro externo DocumentByFile (integración liquidación sin Backblaze).
     *
     * @return array{idDocumentByFile: int, documentName: string}
     */
    public function createLiquidacionDocumentExtern(int $idFile, string $documentNameRequested): array
    {
        $safeBase = trim($documentNameRequested);
        if ($safeBase === '') {
            throw new RuntimeException('El nombre del documento no puede estar vacío');
        }

        $documentName = $safeBase;
        $suffix       = 0;
        while ($this->db->table('DocumentByFile')
            ->where('IdFile', $idFile)
            ->where('Name', $documentName)
            ->countAllResults() > 0) {
            $suffix++;
            $documentName = $safeBase . '_' . $suffix;
        }

        $nextIdRow = $this->db->query('SELECT COALESCE(MAX(Id), 0) + 1 AS nextId FROM DocumentByFile')
            ->getRowArray();
        $nextId = (int) ($nextIdRow['nextId'] ?? 1);
        $now    = date('Y-m-d H:i:s');

        $row = [
            'Id'                  => $nextId,
            'Name'                => $documentName,
            'Comment'             => '',
            'ExperationDate'      => null,
            'PathDocument'        => '',
            'Enabled'             => 1,
            'RegistrationDate'    => $now,
            'UpdateDate'          => $now,
            'LastUserUpdate'      => 111,
            'IdLastUserUpdate'    => 111,
            'IdFile'              => $idFile,
            'IdValidation'        => '',
            'IdDocumentType'      => self::DOCUMENT_TYPE_LIQUIDACION,
            'IdCurrentStatus'     => 2,
            'IdDocumentError'     => 0,
            'ServerPath'          => '',
            'IdDocumentContainer' => '',
        ];

        if (!$this->db->table('DocumentByFile')->insert($row)) {
            throw new RuntimeException('No se pudo insertar el documento en DocumentByFile');
        }

        return [
            'idDocumentByFile' => $nextId,
            'documentName'     => $documentName,
        ];
    }

    public function normalizeCaja(string $caja): string
    {
        $s = trim($caja);
        $s = str_replace(' ', '_', $s);
        $s = (string) preg_replace('/[^A-Za-z0-9_-]/', '', $s);
        if (strlen($s) > 40) {
            $s = substr($s, 0, 40);
        }

        return $s;
    }

    /**
     * Nombre: Liquidacion_{caja}_{n} con n = count(docs liquidación) + 1.
     *
     * @return array{idDocumentByFile: int, documentName: string, consecutivo: int}
     */
    public function createLiquidacionDocumentForIntegration(int $idFile, string $cajaNormalized, int $userId): array
    {
        $documentTypeId = self::DOCUMENT_TYPE_LIQUIDACION;
        if ($cajaNormalized === '') {
            throw new RuntimeException('Caja inválida tras normalizar');
        }

        $count = (int) $this->db->table('DocumentByFile')
            ->where('IdFile', $idFile)
            ->where('IdDocumentType', $documentTypeId)
            ->countAllResults();

        $nextN       = $count + 1;
        $base        = 'Liquidacion_' . $cajaNormalized . '_';
        $documentName = $base . $nextN;

        while ($this->db->table('DocumentByFile')
            ->where('IdFile', $idFile)
            ->where('Name', $documentName)
            ->countAllResults() > 0) {
            $nextN++;
            $documentName = $base . $nextN;
        }

        $nextIdRow = $this->db->query('SELECT COALESCE(MAX(Id), 0) + 1 AS nextId FROM DocumentByFile')
            ->getRowArray();
        $nextId = (int) ($nextIdRow['nextId'] ?? 1);
        $now    = date('Y-m-d H:i:s');

        $documentModel = new DocumentModel();
        $documentData  = [
            'Id'               => $nextId,
            'Name'             => $documentName,
            'Comment'          => null,
            'ExperationDate'   => null,
            'PathDocument'     => null,
            'Enabled'          => 1,
            'RegistrationDate' => $now,
            'UpdateDate'       => $now,
            'LastUserUpdate'   => $userId,
            'IdLastUserUpdate' => $userId,
            'IdFile'           => $idFile,
            'IdValidation'     => null,
            'IdDocumentType'   => $documentTypeId,
            'IdCurrentStatus'  => 1,
            'IdDocumentError'  => null,
        ];

        if (!$documentModel->insert($documentData)) {
            throw new RuntimeException('No se pudo insertar el documento: ' . json_encode($documentModel->errors()));
        }

        return [
            'idDocumentByFile' => $nextId,
            'documentName'     => $documentName,
            'consecutivo'      => $nextN,
        ];
    }

    /**
     * Comportamiento histórico mesa de control: nombre del tipo de documento + consecutivo.
     *
     * @return array{idDocumentByFile: int, documentName: string, consecutivo: int, idOrderTotal: mixed}
     */
    public function createLiquidacionDocumentMesa(int $idFile, int $userId): array
    {
        $documentTypeId = self::DOCUMENT_TYPE_LIQUIDACION;

        $file = $this->db->table('File')
            ->select('Id, IdOrderTotal')
            ->where('Id', $idFile)
            ->get()
            ->getRowArray();

        if (!$file) {
            throw new RuntimeException('El expediente especificado no existe');
        }

        $documentType = $this->db->table('DocumentType')
            ->select('Name')
            ->where('Id', $documentTypeId)
            ->get()
            ->getRowArray();

        if (!$documentType) {
            throw new RuntimeException('El tipo de documento de liquidación no está configurado');
        }

        $baseName = trim($documentType['Name'] ?? 'Liquidación');
        if ($baseName === '') {
            $baseName = 'Liquidación';
        }

        $existingDocuments = $this->db->table('DocumentByFile')
            ->select('Name')
            ->where('IdFile', $idFile)
            ->where('IdDocumentType', $documentTypeId)
            ->orderBy('Id', 'ASC')
            ->get()
            ->getResultArray();

        $maxCounter = 0;
        foreach ($existingDocuments as $existing) {
            $name = trim($existing['Name'] ?? '');
            if ($name === '') {
                continue;
            }
            if (preg_match('/(\d+)\s*$/', $name, $matches)) {
                $maxCounter = max($maxCounter, (int) $matches[1]);
            }
        }

        $nextCounter  = $maxCounter + 1;
        $documentName = trim($baseName . ' ' . $nextCounter);

        while ($this->db->table('DocumentByFile')
            ->where('IdFile', $idFile)
            ->where('Name', $documentName)
            ->countAllResults() > 0) {
            $nextCounter++;
            $documentName = trim($baseName . ' ' . $nextCounter);
        }

        $nextIdRow = $this->db->query('SELECT COALESCE(MAX(Id), 0) + 1 AS nextId FROM DocumentByFile')
            ->getRowArray();
        $nextId = (int) ($nextIdRow['nextId'] ?? 1);
        $now    = date('Y-m-d H:i:s');

        $documentModel = new DocumentModel();
        $documentData  = [
            'Id'               => $nextId,
            'Name'             => $documentName,
            'Comment'          => null,
            'ExperationDate'   => null,
            'PathDocument'     => null,
            'Enabled'          => 1,
            'RegistrationDate' => $now,
            'UpdateDate'       => $now,
            'LastUserUpdate'   => $userId,
            'IdLastUserUpdate' => $userId,
            'IdFile'           => $idFile,
            'IdValidation'     => null,
            'IdDocumentType'   => $documentTypeId,
            'IdCurrentStatus'  => 1,
            'IdDocumentError'  => null,
        ];

        if (!$documentModel->insert($documentData)) {
            throw new RuntimeException('No se pudo insertar el documento: ' . json_encode($documentModel->errors()));
        }

        return [
            'idDocumentByFile' => $nextId,
            'documentName'     => $documentName,
            'consecutivo'      => $nextCounter,
            'idOrderTotal'     => $file['IdOrderTotal'] ?? null,
        ];
    }
}
