<?php

namespace App\Models;

use CodeIgniter\Model;

/**
 * Modelo para file_pld_beneficiariofinal - beneficiarios finales por expediente.
 */
class FilePldBeneficiarioFinalModel extends Model
{
    protected $table = 'FilePldBeneficiarioFinal';
    protected $primaryKey = 'Id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = [
        'IdFile', 'Nombre', 'RFC', 'CURP', 'PorcentajeParticipacion'
    ];

    protected $useTimestamps = false;
    protected $dateFormat = 'datetime';

    public function getByFile(int $idFile): array
    {
        return $this->where('IdFile', $idFile)->orderBy('Id', 'ASC')->findAll();
    }

    public function add(int $idFile, string $nombre, ?string $rfc = null, ?string $curp = null, ?float $porcentaje = null): ?int
    {
        return $this->insert([
            'IdFile' => $idFile,
            'Nombre' => $nombre,
            'RFC' => $rfc,
            'CURP' => $curp,
            'PorcentajeParticipacion' => $porcentaje
        ]);
    }

    public function remove(int $id): bool
    {
        $row = $this->find($id);
        return $row ? (bool) $this->delete($id) : false;
    }
}
