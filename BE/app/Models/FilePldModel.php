<?php

namespace App\Models;

use CodeIgniter\Model;

/**
 * Model para file_pld - datos PLD/AML por expediente.
 * Usado por Miniportal para registrar aviso de privacidad aceptado.
 */
class FilePldModel extends Model
{
    protected $table = 'file_pld';
    protected $primaryKey = 'Id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = [
        'IdFile', 'AvisoPrivacidadEntregado', 'AvisoPrivacidadFecha', 'AvisoPrivacidadMetodo',
        'AvisoPrivacidadFirma', 'GeolocalizacionCapturada', 'GeolocalizacionLatitud', 'GeolocalizacionLongitud',
        'GeolocalizacionFecha', 'GeolocalizacionOrigen'
    ];

    protected $useTimestamps = false;
    protected $dateFormat = 'datetime';

    /**
     * Verificar si el aviso de privacidad ya fue aceptado para este expediente
     */
    public function hasAvisoAceptado(int $idFile): bool
    {
        $row = $this->where('IdFile', $idFile)->first();
        return $row && !empty($row['AvisoPrivacidadEntregado']);
    }

    /**
     * Registrar aceptación del aviso desde Miniportal
     */
    public function recordAvisoMiniportal(int $idFile, ?string $signatureData = null): bool
    {
        $row = $this->where('IdFile', $idFile)->first();
        $now = date('Y-m-d H:i:s');

        if ($row) {
            return (bool) $this->update($row['Id'], [
                'AvisoPrivacidadEntregado' => 1,
                'AvisoPrivacidadFecha' => $now,
                'AvisoPrivacidadMetodo' => 'Miniportal',
                'AvisoPrivacidadFirma' => $signatureData
            ]);
        }

        return (bool) $this->insert([
            'IdFile' => $idFile,
            'AvisoPrivacidadEntregado' => 1,
            'AvisoPrivacidadFecha' => $now,
            'AvisoPrivacidadMetodo' => 'Miniportal',
            'AvisoPrivacidadFirma' => $signatureData
        ]);
    }
}
