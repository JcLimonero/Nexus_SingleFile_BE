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
        'id_expedient', 'aviso_privacidad_entregado', 'aviso_privacidad_fecha', 'aviso_privacidad_metodo',
        'aviso_privacidad_firma', 'geolocalizacion_capturada', 'geolocalizacion_latitud', 'geolocalizacion_longitud',
        'geolocalizacion_fecha', 'geolocalizacion_origen'
    ];

    protected $useTimestamps = false;
    protected $dateFormat = 'datetime';

    /**
     * Verificar si el aviso de privacidad ya fue aceptado para este expediente
     */
    public function hasAvisoAceptado(int $idFile): bool
    {
        $row = $this->where('id_expedient', $idFile)->first();
        return $row && !empty($row['aviso_privacidad_entregado']);
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
                'aviso_privacidad_entregado' => 1,
                'aviso_privacidad_fecha' => $now,
                'aviso_privacidad_metodo' => 'Miniportal',
                'aviso_privacidad_firma' => $signatureData
            ]);
        }

        return (bool) $this->insert([
            'id_expedient' => $idFile,
            'aviso_privacidad_entregado' => 1,
            'aviso_privacidad_fecha' => $now,
            'aviso_privacidad_metodo' => 'Miniportal',
            'aviso_privacidad_firma' => $signatureData
        ]);
    }
}
