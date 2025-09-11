<?php
namespace App\Services;

use CodeIgniter\Database\BaseConnection;

class AgencyService
{
    protected $db;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }

    /**
     * Convertir ID de agencia externo a interno
     */
    public function getAgencyInternalId($agencyId)
    {
        error_log("=== CONVIRTIENDO ID AGENCIA ===");
        error_log("ID recibido: " . $agencyId);
        
        // Primero intentar como ID externo (IdAgency)
        $agency = $this->db->table('Agency')
            ->where('IdAgency', $agencyId)
            ->get()
            ->getRowArray();
            
        if ($agency) {
            error_log("Agencia encontrada por IdAgency: $agencyId, Id interno: " . $agency['Id']);
            return $agency['Id'];
        }
        
        // Si no se encuentra, intentar como ID interno
        $agency = $this->db->table('Agency')
            ->where('Id', $agencyId)
            ->get()
            ->getRowArray();
            
        if ($agency) {
            error_log("Agencia encontrada por Id interno: $agencyId, IdAgency: " . $agency['IdAgency']);
            return $agency['Id'];
        }
        
        error_log("Agencia no encontrada para ID: $agencyId");
        return $agencyId; // Fallback al valor original
    }

    /**
     * Buscar agencia por ID externo
     */
    public function getAgencyByExternalId($externalAgencyId)
    {
        error_log("=== BUSCANDO AGENCIA POR ID EXTERNO ===");
        error_log("IdAgency externo: " . $externalAgencyId);
        
        $agency = $this->db->table('Agency')
            ->where('IdAgency', $externalAgencyId)
            ->get()
            ->getRowArray();
            
        if ($agency) {
            error_log("Agencia encontrada: " . json_encode($agency));
            return $agency;
        }
        
        error_log("Agencia no encontrada para IdAgency: $externalAgencyId");
        return null;
    }

    /**
     * Validar que la agencia existe
     */
    public function validateAgencyExists($agencyId)
    {
        $agency = $this->db->table('Agency')
            ->where('Id', $agencyId)
            ->get()
            ->getRowArray();
            
        return $agency !== null;
    }

    /**
     * Obtener todas las agencias habilitadas
     */
    public function getEnabledAgencies()
    {
        return $this->db->table('Agency')
            ->where('Enabled', 1)
            ->orderBy('Name', 'ASC')
            ->get()
            ->getResultArray();
    }

    /**
     * Obtener agencia por ID interno
     */
    public function getAgencyById($agencyId)
    {
        return $this->db->table('Agency')
            ->where('Id', $agencyId)
            ->get()
            ->getRowArray();
    }
}
