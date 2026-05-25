<?php

namespace App\Models;

use CodeIgniter\Model;

/**
 * Model para expedient_pld - datos PLD/AML por expediente.
 * Usado por Miniportal para registrar aviso de privacidad aceptado.
 */
class FilePldModel extends Model
{
    protected $table = 'expedient_pld';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = [
        'id_expedient', 'privacy_notice_delivered', 'privacy_notice_date', 'privacy_notice_method',
        'privacy_notice_signature', 'geolocation_captured', 'geolocation_latitude', 'geolocation_longitude',
        'geolocation_date', 'geolocation_origin'
    ];

    protected $useTimestamps = false;
    protected $dateFormat = 'datetime';

    /**
     * Verificar si el aviso de privacidad ya fue aceptado para este expediente
     */
    public function hasAvisoAceptado(int $idFile): bool
    {
        $row = $this->where('id_expedient', $idFile)->first();
        return $row && !empty($row['privacy_notice_delivered']);
    }

    /**
     * Registrar aceptación del aviso desde Miniportal
     */
    public function recordAvisoMiniportal(int $idFile, ?string $signatureData = null): bool
    {
        $row = $this->where('id_expedient', $idFile)->first();
        $now = date('Y-m-d H:i:s');

        if ($row) {
            return (bool) $this->update($row['id'], [
                'privacy_notice_delivered' => 1,
                'privacy_notice_date' => $now,
                'privacy_notice_method' => 'Miniportal',
                'privacy_notice_signature' => $signatureData
            ]);
        }

        return (bool) $this->insert([
            'id_expedient' => $idFile,
            'privacy_notice_delivered' => 1,
            'privacy_notice_date' => $now,
            'privacy_notice_method' => 'Miniportal',
            'privacy_notice_signature' => $signatureData
        ]);
    }
}
