<?php

namespace App\Models;

use CodeIgniter\Model;

/**
 * expedient_state separa 3 conceptos previamente colapsados en la misma fila:
 *
 *   1. lifecycle state — el expediente puede estar acá ahora (id_current_expedient_state)
 *   2. navegable phase — aparece en sidebar del FE (is_navigable=1)
 *   3. upload-allowed phase — se pueden cargar documentos en este estado (allows_document_upload=1)
 *
 * Estados típicos (id canónico):
 *   1 Integración   nav=1, upload=1, terminal=0, system=1
 *   2 Liquidación   nav=1, upload=1, terminal=0, system=1  (requires_payment_voucher=1)
 *   3 Liberación    nav=1, upload=0, terminal=0
 *   4 Liberado      nav=0, upload=0, terminal=1
 *   5 Cancelado     nav=0, upload=0, terminal=1
 *   6 Excepción     nav=0, upload=0, terminal=1
 *
 * Las fases marcadas is_system=1 (Integración + Liquidación) NO son editables
 * vía Model API — los callbacks beforeUpdate/beforeDelete rechazan cualquier
 * intento. Esto protege contra:
 *   - rename del nombre (rompe breadcrumbs hardcoded)
 *   - disable (enabled=0) — sin Integración no se crean expedientes nuevos
 *   - delete — rompe FKs en expedient.id_current_expedient_state
 *
 * NOTA: la protección solo aplica al ir vía $model->update()/delete().
 * SQL crudo (`$db->query("DELETE FROM expedient_state ...")`) lo bypassea —
 * el flag is_system es contrato semántico, no constraint hard.
 */
class FileStateModel extends Model
{
    protected $table         = 'expedient_state';
    protected $primaryKey    = 'id';
    protected $returnType    = 'array';
    protected $useAutoIncrement = true;
    protected $protectFields = true;
    protected $allowedFields = [
        'name',
        'enabled',
        'requires_payment_voucher',
        'is_navigable',
        'allows_document_upload',
        'is_terminal',
        'is_system',
        'display_order',
        'id_last_user_update',
    ];

    protected $useTimestamps  = false;
    protected $createdField   = 'registration_date';
    protected $updatedField   = 'update_date';

    // Callbacks que protegen las fases base del sistema.
    protected $allowCallbacks = true;
    protected $beforeUpdate   = ['guardSystemPhase'];
    protected $beforeDelete   = ['guardSystemPhaseDelete'];

    public function getActive(): array
    {
        return $this->where('enabled', 1)->orderBy('id', 'ASC')->findAll();
    }

    /**
     * Returns the expedient_state row(s) marked as the payment-voucher phase.
     * In the standard config there should be exactly one. Returns an array
     * so callers can decide between first(), exists check, etc.
     */
    public function getVoucherPhases(): array
    {
        return $this->where('requires_payment_voucher', 1)
            ->where('enabled', 1)
            ->findAll();
    }

    /** Convenience for callers that historically used the hardcoded `=== '2'` check. */
    public function isVoucherPhaseId($id): bool
    {
        if ($id === null || $id === '') return false;
        $row = $this->find((int) $id);
        return !empty($row) && (int) ($row['requires_payment_voucher'] ?? 0) === 1;
    }

    /**
     * Returns true if the state with $id allows document uploads.
     * Usado por requireExpedientAllowsUpload() en BaseController.
     */
    public function allowsUpload($id): bool
    {
        if ($id === null || $id === '') return false;
        $row = $this->find((int) $id);
        return !empty($row) && (int) ($row['allows_document_upload'] ?? 0) === 1;
    }

    /**
     * Returns only navigable phases (excluye terminales). Para sidebar dinámico.
     * Ordenadas por display_order (incrementos de 10 para insertar entre fases
     * sin renumerar). Fallback ASC por id cuando display_order es NULL o hay ties.
     */
    public function getNavigable(): array
    {
        return $this->where('enabled', 1)
            ->where('is_navigable', 1)
            ->orderBy('display_order', 'ASC')
            ->orderBy('id', 'ASC')
            ->findAll();
    }

    /** Returns true si la fase está marcada is_system=1 (Integración, Liquidación). */
    public function isSystemPhase($id): bool
    {
        if ($id === null || $id === '') return false;
        $row = $this->find((int) $id);
        return !empty($row) && (int) ($row['is_system'] ?? 0) === 1;
    }

    /**
     * beforeUpdate callback. Rechaza cualquier cambio sobre fases is_system=1.
     * CI4 invoca con $data = ['id' => ..., 'data' => [...]].
     */
    protected function guardSystemPhase(array $data): array
    {
        $id = $data['id'][0] ?? $data['id'] ?? null;
        if ($id !== null && $this->isSystemPhase($id)) {
            $row = $this->find((int) $id);
            throw new \RuntimeException(
                "La fase '{$row['name']}' es del sistema y no puede modificarse "
                . "(rename, disable, ni cambio de flags). is_system=1."
            );
        }
        return $data;
    }

    /**
     * beforeDelete callback. Rechaza el delete sobre fases is_system=1.
     * CI4 invoca con $data = ['id' => [...], 'purge' => bool].
     */
    protected function guardSystemPhaseDelete(array $data): array
    {
        $ids = (array) ($data['id'] ?? []);
        foreach ($ids as $id) {
            if ($this->isSystemPhase($id)) {
                $row = $this->find((int) $id);
                throw new \RuntimeException(
                    "La fase '{$row['name']}' es del sistema y no puede eliminarse. "
                    . "is_system=1."
                );
            }
        }
        return $data;
    }
}
