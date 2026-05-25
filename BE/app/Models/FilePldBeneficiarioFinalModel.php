<?php

namespace App\Models;

use CodeIgniter\Model;

/**
 * Model para file_pld_beneficiariofinal - beneficiarios finales por expediente.
 */
class FilePldBeneficiarioFinalModel extends Model
{
    protected $table = 'expedient_pld_beneficial_owner';
    protected $primaryKey = 'Id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = [
        'IdFile', 'Nombre', 'RFC', 'CURP', 'PorcentajeParticipacion', 'IdLastUserUpdate'
    ];

    protected $useTimestamps = false;
    protected $dateFormat = 'datetime';

    public function getByFile(int $idFile): array
    {
        return $this->where('IdFile', $idFile)->orderBy('Id', 'ASC')->findAll();
    }

    /**
     * @param int|null $idLastUserUpdate ID del usuario (requerido por FK en BD)
     */
    public function add(int $idFile, string $nombre, ?string $rfc = null, ?string $curp = null, ?float $porcentaje = null, ?int $idLastUserUpdate = null): ?int
    {
        $data = [
            'IdFile' => $idFile,
            'Nombre' => $nombre,
            'RFC' => $rfc,
            'CURP' => $curp,
            'PorcentajeParticipacion' => $porcentaje,
            'IdLastUserUpdate' => $idLastUserUpdate
        ];
        return $this->insert($data);
    }

    public function remove(int $id): bool
    {
        $row = $this->find($id);
        return $row ? (bool) $this->delete($id) : false;
    }
}
