<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

class CompanyClientImport extends BaseController
{
    protected $db;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }

    /**
     * Importar cliente del Grupo al sistema local
     * POST /api/company-client-import/import
     */
    public function import()
    {
        try {
            $companyData = $this->request->getJSON(true);

            if (!$companyData) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Datos de cliente del Grupo requeridos',
                    'data' => null
                ])->setStatusCode(400);
            }

            $requiredFields = ['idAgency', 'ndDMS'];
            foreach ($requiredFields as $field) {
                if (!isset($companyData[$field]) || empty($companyData[$field])) {
                    return $this->response->setJSON([
                        'success' => false,
                        'message' => "Campo requerido faltante: {$field}",
                        'data' => null
                    ])->setStatusCode(400);
                }
            }

            error_log("=== CompanyClientImport::import - Datos recibidos ===");
            error_log("name: " . ($companyData['name'] ?? 'NULL'));
            error_log("bussines_name: " . ($companyData['bussines_name'] ?? 'NULL'));

            if (empty($companyData['name']) && !empty($companyData['bussines_name'])) {
                $companyData['name'] = $companyData['bussines_name'];
                $companyData['paternal_surname'] = $companyData['paternal_surname'] ?? '';
                $companyData['maternal_surname'] = $companyData['maternal_surname'] ?? '';
            }

            if (empty($companyData['name']) && empty($companyData['bussines_name'])) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Se requiere al menos name o bussines_name',
                    'data' => null
                ])->setStatusCode(400);
            }

            $existingClient = $this->checkExistingClient($companyData['ndDMS'], $companyData['idAgency']);
            if ($existingClient) {
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Cliente ya existe en el sistema local',
                    'data' => $existingClient
                ]);
            }

            $rfcFromApi = trim($companyData['rfc'] ?? '');
            if ($rfcFromApi !== '') {
                $clientByRfc = $this->findClientByRfc($rfcFromApi);
                if ($clientByRfc) {
                    $this->db->transStart();
                    try {
                        $headerClientId = $this->insertClientHeader($clientByRfc['id'] ?? $clientByRfc['Id']);
                        if (!$headerClientId) throw new \Exception('Error al insertar en tabla ClientHeader');
                        $relationId = $this->insertClientTotalRelation($headerClientId, $companyData);
                        if (!$relationId) throw new \Exception('Error al insertar en tabla ClientTotalRelation');
                        $this->db->transComplete();
                        if ($this->db->transStatus() === false) throw new \Exception('Error en la transacción');
                        $created = $this->getCreatedClient($clientByRfc['id'] ?? $clientByRfc['Id'], $headerClientId, $relationId);
                        return $this->response->setJSON([
                            'success' => true,
                            'message' => 'Cliente vinculado por RFC; se creó ClientHeader y ClientTotalRelation',
                            'data' => $created
                        ]);
                    } catch (\Exception $e) {
                        $this->db->transRollback();
                        throw $e;
                    }
                }
            }

            $razonSocial = !empty($companyData['bussines_name'])
                ? $companyData['bussines_name']
                : trim(($companyData['name'] ?? '') . ' ' . ($companyData['paternal_surname'] ?? '') . ' ' . ($companyData['maternal_surname'] ?? ''));

            $existingByRazonSocial = $this->checkExistingClientByRazonSocial($razonSocial);
            if ($existingByRazonSocial) {
                $idAgencyInternal = $this->getAgencyIdFromIdAgency($companyData['idAgency']);
                $hasRelation = $this->checkClientTotalRelation($existingByRazonSocial['idCliente'], $companyData['ndDMS'], $idAgencyInternal);

                if ($hasRelation) {
                    $existingClientFull = $this->getClientByRazonSocial($razonSocial);
                    if ($existingClientFull) {
                        return $this->response->setJSON([
                            'success' => true,
                            'message' => 'Cliente ya existe en el sistema local',
                            'data' => $existingClientFull
                        ]);
                    }
                } else {
                    $this->db->transStart();
                    try {
                        $headerClient = $this->db->table('client_header')
                            ->where('id_client', $existingByRazonSocial['idCliente'])
                            ->get()->getRowArray();
                        $headerClientId = $headerClient ? ($headerClient['id'] ?? $headerClient['Id']) : $this->insertClientHeader($existingByRazonSocial['idCliente']);
                        $relationId = $this->insertClientTotalRelation($headerClientId, $companyData);
                        if (!$relationId) throw new \Exception('Error al insertar en tabla ClientTotalRelation');
                        $this->db->transComplete();
                        if ($this->db->transStatus() === false) throw new \Exception('Error en la transacción');
                        $created = $this->getCreatedClient($existingByRazonSocial['idCliente'], $headerClientId, $relationId);
                        return $this->response->setJSON([
                            'success' => true,
                            'message' => 'Cliente existente vinculado con nuevo ndDMS; se creó ClientTotalRelation',
                            'data' => $created
                        ]);
                    } catch (\Exception $e) {
                        $this->db->transRollback();
                        throw $e;
                    }
                }
            }

            $razonSocialWithNdDMS = $razonSocial . ' (' . $companyData['ndDMS'] . ')';
            $existingByRazonSocialModified = $this->checkExistingClientByRazonSocial($razonSocialWithNdDMS);
            if ($existingByRazonSocialModified) {
                $idAgencyInternal = $this->getAgencyIdFromIdAgency($companyData['idAgency']);
                $hasRelation = $this->checkClientTotalRelation($existingByRazonSocialModified['idCliente'], $companyData['ndDMS'], $idAgencyInternal);

                if ($hasRelation) {
                    $existingClientFull = $this->getClientByRazonSocial($razonSocialWithNdDMS);
                    if ($existingClientFull) {
                        return $this->response->setJSON([
                            'success' => true,
                            'message' => 'Cliente ya existe en el sistema local',
                            'data' => $existingClientFull
                        ]);
                    }
                } else {
                    $this->db->transStart();
                    try {
                        $headerClient = $this->db->table('client_header')
                            ->where('id_client', $existingByRazonSocialModified['idCliente'])
                            ->get()->getRowArray();
                        $headerClientId = $headerClient ? ($headerClient['id'] ?? $headerClient['Id']) : $this->insertClientHeader($existingByRazonSocialModified['idCliente']);
                        $relationId = $this->insertClientTotalRelation($headerClientId, $companyData);
                        $this->db->transComplete();
                        $created = $this->getCreatedClient($existingByRazonSocialModified['idCliente'], $headerClientId, $relationId);
                        return $this->response->setJSON([
                            'success' => true,
                            'message' => 'Cliente existente vinculado con nuevo ndDMS; se creó ClientTotalRelation',
                            'data' => $created
                        ]);
                    } catch (\Exception $e) {
                        $this->db->transRollback();
                        throw $e;
                    }
                }
            }

            if ($existingByRazonSocial) {
                $companyData['razonSocial_modified'] = $razonSocialWithNdDMS;
            }

            $this->db->transStart();
            $clientId = $this->insertClient($companyData);
            if (!$clientId) throw new \Exception('Error al insertar cliente en tabla Client');
            $headerClientId = $this->insertClientHeader($clientId);
            if (!$headerClientId) throw new \Exception('Error al insertar cliente en tabla ClientHeader');
            $relationId = $this->insertClientTotalRelation($headerClientId, $companyData);
            if (!$relationId) throw new \Exception('Error al insertar cliente en tabla ClientTotalRelation');
            $this->db->transComplete();

            if ($this->db->transStatus() === false) {
                throw new \Exception('Error en la transacción de base de datos');
            }

            $createdClient = $this->getCreatedClient($clientId, $headerClientId, $relationId);

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Cliente importado exitosamente desde el Grupo',
                'data' => $createdClient
            ]);

        } catch (\Exception $e) {
            $this->db->transRollback();
            error_log("Error en CompanyClientImport::import: " . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'data' => null
            ])->setStatusCode(500);
        }
    }

    private function checkExistingClient($ndDMS, $idAgencyNexFile)
    {
        $idAgencyInternal = $this->getAgencyIdFromIdAgency($idAgencyNexFile);
        $sql = "
            SELECT c.id as idCliente, ctr.id_dms as ndCliente,
                TRIM(CONCAT(COALESCE(c.name, ''), ' ', COALESCE(c.last_name, ''), ' ', COALESCE(c.mother_last_name, ''))) as cliente,
                c.name as nombre, c.last_name as apellidoPaterno, c.mother_last_name as apellidoMaterno,
                c.RFC as rfc, c.email as email, c.tel_number as telefono, c.tel_number2 as telefono2,
                c.razon_social as razonSocial, c.CURP as curp, c.adviser as asesor, c.agency_origin as agenciaOrigen,
                c.registration_date as fechaRegistro, c.update_date as fechaActualizacion,
                ctr.id_agency as idAgency, hc.id as headerClientId
            FROM client c
            INNER JOIN client_header hc ON c.id = hc.id_client
            INNER JOIN client_dms_relation ctr ON hc.id = ctr.id_client_header
            WHERE ctr.id_dms = ? AND ctr.id_agency = ?
        ";
        $result = $this->db->query($sql, [$ndDMS, $idAgencyInternal])->getRowArray();
        return $result ?: null;
    }

    private function checkClientTotalRelation($clientId, $ndDMS, $idAgency)
    {
        $sql = "SELECT ctr.id FROM client_header hc INNER JOIN client_dms_relation ctr ON hc.id = ctr.id_client_header
                WHERE hc.id_client = ? AND ctr.id_dms = ? AND ctr.id_agency = ? LIMIT 1";
        return $this->db->query($sql, [$clientId, $ndDMS, $idAgency])->getRowArray() ? true : false;
    }

    private function findClientByRfc($rfc)
    {
        $rfcTrimmed = trim((string) ($rfc ?? ''));
        if ($rfcTrimmed === '') return null;
        $sql = "SELECT c.id FROM client c WHERE TRIM(c.RFC) = ? ORDER BY c.registration_date DESC LIMIT 1";
        return $this->db->query($sql, [$rfcTrimmed])->getRowArray() ?: null;
    }

    private function checkExistingClientByRazonSocial($razonSocial)
    {
        $sql = "SELECT c.id as idCliente FROM client c WHERE c.razon_social = ? LIMIT 1";
        return $this->db->query($sql, [$razonSocial])->getRowArray() ?: null;
    }

    private function getClientByRazonSocial($razonSocial)
    {
        $sql = "
            SELECT c.id as idCliente, ctr.id_dms as ndCliente,
                TRIM(CONCAT(COALESCE(c.name, ''), ' ', COALESCE(c.last_name, ''), ' ', COALESCE(c.mother_last_name, ''))) as cliente,
                c.name as nombre, c.last_name as apellidoPaterno, c.mother_last_name as apellidoMaterno,
                c.RFC as rfc, c.email as email, c.tel_number as telefono, c.tel_number2 as telefono2,
                c.razon_social as razonSocial, c.CURP as curp, c.adviser as asesor, c.agency_origin as agenciaOrigen,
                c.registration_date as fechaRegistro, c.update_date as fechaActualizacion,
                ctr.id_agency as idAgency, hc.id as headerClientId
            FROM client c INNER JOIN client_header hc ON c.id = hc.id_client
            INNER JOIN client_dms_relation ctr ON hc.id = ctr.id_client_header
            WHERE c.razon_social = ? LIMIT 1
        ";
        return $this->db->query($sql, [$razonSocial])->getRowArray() ?: null;
    }

    private function insertClient($companyData)
    {
        $razonSocial = isset($companyData['razonSocial_modified'])
            ? $companyData['razonSocial_modified']
            : (!empty($companyData['bussines_name']) ? $companyData['bussines_name']
                : trim(($companyData['name'] ?? '') . ' ' . ($companyData['paternal_surname'] ?? '') . ' ' . ($companyData['maternal_surname'] ?? '')));
        $existingClient = $this->checkExistingClientByRazonSocial($razonSocial);
        if ($existingClient) throw new \Exception("Cliente con RazonSocial '{$razonSocial}' ya existe en el sistema.");
        $nextId = ($this->db->query("SELECT MAX(id) as max_id FROM client")->getRow()->max_id ?? 0) + 1;
        $clientData = [
            'id' => $nextId, 'name' => $companyData['name'] ?? '', 'last_name' => $companyData['paternal_surname'] ?? '',
            'mother_last_name' => $companyData['maternal_surname'] ?? '', 'RFC' => $companyData['rfc'] ?? '',
            'CURP' => $companyData['curp'] ?? '', 'tel_number' => $companyData['phone'] ?? '',
            'tel_number2' => $companyData['mobile_phone'] ?? '', 'email' => $companyData['mail'] ?? '',
            'razon_social' => $razonSocial, 'tipo_cliente' => $this->normalizeTipoClienteForDb($companyData['tipo_cliente'] ?? null), 'adviser' => '',
            'agency_origin' => $companyData['idAgency'] ?? '',
            'registration_date' => date('Y-m-d H:i:s'), 'update_date' => date('Y-m-d H:i:s'), 'id_last_user_update' => $this->getCurrentUserId() ?? 1
        ];
        if (!$this->db->table('client')->insert($clientData)) throw new \Exception('Error al insertar en tabla Client');
        return $nextId;
    }

    private function insertClientHeader($clientId)
    {
        $nextId = ($this->db->query("SELECT MAX(id) as max_id FROM client_header")->getRow()->max_id ?? 0) + 1;
        $headerData = [
            'id' => $nextId,
            'id_client' => $clientId,
            'registration_date' => date('Y-m-d H:i:s'),
            'update_date' => date('Y-m-d H:i:s'),
            'id_last_user_update' => $this->getCurrentUserId() ?? 1,
            'enabled' => 1
        ];
        $result = $this->db->table('client_header')->insert($headerData);
        if (!$result) {
            throw new \Exception('Error al insertar en ClientHeader: ' . json_encode($this->db->error()));
        }
        return $nextId;
    }

    private function insertClientTotalRelation($headerClientId, $companyData)
    {
        $nextId = ($this->db->query("SELECT MAX(id) as max_id FROM client_dms_relation")->getRow()->max_id ?? 0) + 1;
        $agencyId = $this->getAgencyIdFromIdAgency($companyData['idAgency']);
        $relationData = [
            'id' => $nextId,
            'id_client_header' => $headerClientId,
            'id_dms' => $companyData['ndDMS'],
            'id_agency' => $agencyId,
            'registration_date' => date('Y-m-d H:i:s'),
            'update_date' => date('Y-m-d H:i:s'),
            'id_last_user_update' => $this->getCurrentUserId() ?? 1,
            'enabled' => 1
        ];
        $result = $this->db->table('client_dms_relation')->insert($relationData);
        if (!$result) {
            throw new \Exception('Error al insertar en ClientDMSRelation: ' . json_encode($this->db->error()));
        }
        return $nextId;
    }

    private function getAgencyIdFromIdAgency($idAgency)
    {
        $idAgencyStr = (string) $idAgency;
        $agency = $this->db->table('agency')->where('id', $idAgencyStr)->get()->getRowArray();
        if ($agency) return (int) ($agency['id'] ?? $agency['Id']);
        $agency = $this->db->table('agency')->where('id_agency_dms', $idAgencyStr)->get()->getRowArray();
        if ($agency) return (int) ($agency['id'] ?? $agency['Id']);
        return is_numeric($idAgencyStr) ? (int) $idAgencyStr : 1;
    }

    private function getCreatedClient($clientId, $headerClientId, $relationId)
    {
        $sql = "
            SELECT c.id as idCliente, ctr.id_dms as ndCliente,
                TRIM(CONCAT(COALESCE(c.name, ''), ' ', COALESCE(c.last_name, ''), ' ', COALESCE(c.mother_last_name, ''))) as cliente,
                c.name as nombre, c.last_name as apellidoPaterno, c.mother_last_name as apellidoMaterno,
                c.RFC as rfc, c.email as email, c.tel_number as telefono, c.tel_number2 as telefono2,
                c.razon_social as razonSocial, c.CURP as curp, c.tipo_cliente as tipoCliente, c.adviser as asesor, c.agency_origin as agenciaOrigen,
                c.registration_date as fechaRegistro, c.update_date as fechaActualizacion,
                hc.id as headerClientId, ctr.id as relationId
            FROM client c INNER JOIN client_header hc ON c.id = hc.id_client
            INNER JOIN client_dms_relation ctr ON hc.id = ctr.id_client_header
            WHERE c.id = ? AND hc.id = ? AND ctr.id = ?
        ";
        return $this->db->query($sql, [$clientId, $headerClientId, $relationId])->getRowArray();
    }

    /** Convierte tipo_cliente a ID: 'fisica'/'moral' -> 1/2, 1/2 se mantienen */
    private function normalizeTipoClienteForDb($value): ?int
    {
        if ($value === null || $value === '') return null;
        $t = strtolower(trim((string) $value));
        if ($t === 'moral') return 2;
        if ($t === 'fisica') return 1;
        if ($t === '1' || $t === '2') return (int) $t;
        return is_numeric($value) ? (int) $value : null;
    }
}
