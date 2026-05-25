<?php

namespace App\Models;

use CodeIgniter\Model;

/**
 * Model para file_pld_geolog - registro de geolocalización por acción.
 * Usado por Miniportal con origen='Miniportal'.
 */
class FilePldGeoLogModel extends Model
{
    protected $table = 'expedient_pld_geo_log';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = [
        'id_expedient', 'latitud', 'longitud', 'accion', 'origen', 'id_last_user_update'
    ];

    protected $useTimestamps = false;
    protected $dateFormat = 'datetime';

    /**
     * Registrar geolocalización desde Miniportal (sin usuario autenticado).
     * id_last_user_update = NULL para evitar violación de FK (no existe user id=0).
     */
    public function log(int $idFile, float $latitud, float $longitud, ?string $accion = null): ?int
    {
        return $this->insert([
            'id_expedient' => $idFile,
            'latitud' => $latitud,
            'longitud' => $longitud,
            'accion' => $accion ?? 'ver_expediente',
            'origen' => 'Miniportal',
            'id_last_user_update' => null
        ]);
    }
}
