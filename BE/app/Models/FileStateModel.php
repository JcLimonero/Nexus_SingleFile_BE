<?php

namespace App\Models;

use CodeIgniter\Model;

/**
 * expedient_state holds the workflow phases (Integración, Liquidación, Liberación)
 * plus terminal states (Liberado, Cancelado, Liberado por Excepción).
 *
 * The flag `requires_payment_voucher` marks which phase receives payment
 * receipts — historically hardcoded as id=2 (Liquidación). Driven by config
 * now so each deployment can move it.
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
}
