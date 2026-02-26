<?php

namespace App\Models;

use CodeIgniter\Model;

/**
 * Modelo para file_pld_geolog - registro de geolocalización por acción.
 * Usado por Miniportal con Origen='Miniportal'.
 */
class FilePldGeoLogModel extends Model
{
    protected $table = 'file_pld_geolog';
    protected $primaryKey = 'Id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = [
        'IdFile', 'Latitud', 'Longitud', 'Accion', 'Origen'
    ];

    protected $useTimestamps = false;
    protected $dateFormat = 'datetime';

    /**
     * Registrar geolocalización desde Miniportal
     */
    public function log(int $idFile, float $latitud, float $longitud, ?string $accion = null): ?int
    {
        return $this->insert([
            'IdFile' => $idFile,
            'Latitud' => $latitud,
            'Longitud' => $longitud,
            'Accion' => $accion ?? 'ver_expediente',
            'Origen' => 'Miniportal'
        ]);
    }
}
