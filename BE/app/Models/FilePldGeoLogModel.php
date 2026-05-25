<?php

namespace App\Models;

use CodeIgniter\Model;

/**
 * Model para file_pld_geolog - registro de geolocalización por acción.
 * Usado por Miniportal con Origen='Miniportal'.
 */
class FilePldGeoLogModel extends Model
{
    protected $table = 'expedient_pld_geo_log';
    protected $primaryKey = 'Id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = [
        'IdFile', 'Latitud', 'Longitud', 'Accion', 'Origen', 'IdLastUserUpdate'
    ];

    protected $useTimestamps = false;
    protected $dateFormat = 'datetime';

    /**
     * Registrar geolocalización desde Miniportal (sin usuario autenticado).
     * IdLastUserUpdate = NULL para evitar violación de FK (no existe user id=0).
     */
    public function log(int $idFile, float $latitud, float $longitud, ?string $accion = null): ?int
    {
        return $this->insert([
            'IdFile' => $idFile,
            'Latitud' => $latitud,
            'Longitud' => $longitud,
            'Accion' => $accion ?? 'ver_expediente',
            'Origen' => 'Miniportal',
            'IdLastUserUpdate' => null
        ]);
    }
}
