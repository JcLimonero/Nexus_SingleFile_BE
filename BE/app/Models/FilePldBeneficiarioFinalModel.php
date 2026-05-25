<?php

namespace App\Models;

use CodeIgniter\Model;

/**
 * Model para file_pld_beneficiariofinal - beneficiarios finales por expediente.
 */
class FilePldBeneficiarioFinalModel extends Model
{
    protected $table = 'expedient_pld_beneficial_owner';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = [
        'id_expedient', 'name', 'RFC', 'CURP', 'participation_percentage', 'id_last_user_update'
    ];

    protected $useTimestamps = false;
    protected $dateFormat = 'datetime';

    public function getByFile(int $idFile): array
    {
        return $this->where('id_expedient', $idFile)->orderBy('id', 'ASC')->findAll();
    }

    /**
     * @param int|null $idLastUserUpdate ID del usuario (requerido por FK en BD)
     */
    public function add(int $idFile, string $nombre, ?string $rfc = null, ?string $curp = null, ?float $porcentaje = null, ?int $idLastUserUpdate = null): ?int
    {
        $data = [
            'id_expedient' => $idFile,
            'name' => $nombre,
            'RFC' => $rfc,
            'CURP' => $curp,
            'participation_percentage' => $porcentaje,
            'id_last_user_update' => $idLastUserUpdate
        ];
        return $this->insert($data);
    }

    public function remove(int $id): bool
    {
        $row = $this->find($id);
        return $row ? (bool) $this->delete($id) : false;
    }
}
