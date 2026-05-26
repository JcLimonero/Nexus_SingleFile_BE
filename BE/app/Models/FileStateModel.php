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
 *   1 Integración   nav=1, upload=1, terminal=0
 *   2 Liquidación   nav=1, upload=1, terminal=0  (requires_payment_voucher=1)
 *   3 Liberación    nav=1, upload=0, terminal=0
 *   4 Liberado      nav=0, upload=0, terminal=1
 *   5 Cancelado     nav=0, upload=0, terminal=1
 *   6 Excepción     nav=0, upload=0, terminal=1
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
        'id_last_user_update',
    ];

    protected $useTimestamps  = false;
    protected $createdField   = 'registration_date';
    protected $updatedField   = 'update_date';

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

    /** Returns only navigable phases (excluye terminales). Para sidebar dinámico. */
    public function getNavigable(): array
    {
        return $this->where('enabled', 1)
            ->where('is_navigable', 1)
            ->orderBy('id', 'ASC')
            ->findAll();
    }
}
