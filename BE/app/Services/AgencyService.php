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
        
        // Primero intentar como ID externo (id_agency_dms)
        $agency = $this->db->table('agency')
            ->where('id_agency_dms', $agencyId)
            ->get()
            ->getRowArray();
            
        if ($agency) {
            error_log("Agencia encontrada por id_agency_dms: $agencyId, Id interno: " . ($agency['id'] ?? $agency['Id'] ?? 'N/A'));
            return $agency['id'] ?? $agency['Id'] ?? null;
        }
        
        // Si no se encuentra, intentar como ID interno
        $agency = $this->db->table('agency')
            ->where('id', $agencyId)
            ->get()
            ->getRowArray();
            
        if ($agency) {
            error_log("Agencia encontrada por Id interno: $agencyId, id_agency_dms: " . ($agency['id_agency_dms'] ?? $agency['IdAgencyDMS'] ?? 'N/A'));
            return $agency['id'] ?? $agency['Id'] ?? null;
        }
        
        error_log("Agencia no encontrada para ID: $agencyId");
        return $agencyId; // Fallback al valor original
    }

    /**
     * Buscar agencia por ID externo (IdAgencyDMS)
     */
    public function getAgencyByExternalId($externalAgencyId)
    {
        error_log("=== BUSCANDO AGENCIA POR ID EXTERNO ===");
        error_log("IdAgencyDMS externo: " . $externalAgencyId);
        
        $agency = $this->db->table('agency')
            ->where('id_agency_dms', $externalAgencyId)
            ->get()
            ->getRowArray();
            
        if ($agency) {
            error_log("Agencia encontrada: " . json_encode($agency));
            return $agency;
        }
        
        error_log("Agencia no encontrada para IdAgencyDMS: $externalAgencyId");
        return null;
    }

    /**
     * Validar que la agencia existe
     */
    public function validateAgencyExists($agencyId)
    {
        $agency = $this->db->table('agency')
            ->where('id', $agencyId)
            ->get()
            ->getRowArray();
            
        return $agency !== null;
    }

    /**
     * Obtener todas las agencias habilitadas
     */
    public function getEnabledAgencies()
    {
        return $this->db->table('agency')
            ->where('enabled', 1)
            ->orderBy('name', 'ASC')
            ->get()
            ->getResultArray();
    }

    /**
     * Obtener agencia por ID interno
     */
    public function getAgencyById($agencyId)
    {
        return $this->db->table('agency')
            ->where('id', $agencyId)
            ->get()
            ->getRowArray();
    }
}
