<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use Config\AML;
use CodeIgniter\HTTP\ResponseInterface;

/**
 * Reportes para el Oficial de Cumplimiento (PLD/AML).
 * Requiere roles de gerente (6) o administrador (7).
 */
class ReportesCumplimiento extends BaseController
{
    protected $db;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }

    /**
     * Parsear idAgency: acepta valor único o lista separada por comas.
     * @return int[] Array de IDs de agencia (vacío si no hay filtro)
     */
    private function parseIdAgencyIds(): array
    {
        $raw = $this->request->getGet('idAgency');
        if ($raw === null || $raw === '') {
            return [];
        }
        $parts = is_array($raw) ? $raw : explode(',', (string) $raw);
        $ids = array_filter(array_map('intval', $parts));
        return array_values(array_unique($ids));
    }

    /**
     * Verificar que el usuario tenga permiso (gerente o administrador)
     */
    private function requireComplianceOfficer(): ?array
    {
        $currentUser = $this->getAuthenticatedUser();
        if (!$currentUser) {
            return null;
        }
        $roleId = (int) ($currentUser['role_id'] ?? 0);
        if (!in_array($roleId, [6, 7, 8], true)) {
            return null;
        }
        return $currentUser;
    }

    /**
     * GET /api/reportes-cumplimiento/expedientes-alerta-pld
     * Expedientes/clientes con operaciones que superan el umbral AML anual.
     */
    public function expedientesAlertaPld()
    {
        $user = $this->requireComplianceOfficer();
        if (!$user) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Acceso denegado. Solo gerentes y administradores pueden ver reportes de cumplimiento.'
            ])->setStatusCode(403);
        }

        try {
            $amlConfig = config(AML::class);
            $umbral = $amlConfig->getUmbralMonto();
            $vistaAML = $amlConfig->vistaMontos;
            $idAgencyIds = $this->parseIdAgencyIds();
            $idCompany = $this->request->getGet('idCompany');
            $limit = (int) ($this->request->getGet('limit') ?: 200);
            $offset = (int) ($this->request->getGet('offset') ?: 0);
            $limit = max(1, min(500, $limit));

            $sql = "
                SELECT
                    c.id as idCliente,
                    MIN(ctr.id_dms) as ndCliente,
                    ANY_VALUE(COALESCE(NULLIF(TRIM(c.razon_social), ''), TRIM(CONCAT(COALESCE(c.name, ''), ' ', COALESCE(c.last_name, ''), ' ', COALESCE(c.mother_last_name, ''))))) as cliente,
                    aml.totalMonto,
                    aml.idCompany
                FROM client c
                INNER JOIN client_header hc ON hc.id_client = c.id
                INNER JOIN client_dms_relation ctr ON hc.id = ctr.id_client_header
                INNER JOIN agency a_ag ON a_ag.id = ctr.id_agency
                INNER JOIN {$vistaAML} aml ON aml.idCliente = c.id AND aml.totalMonto >= ?
                INNER JOIN expedient f ON f.id_client = c.id AND f.id_agency = ctr.id_agency
                WHERE 1=1
            ";
            $params = [$umbral];

            if (!empty($idAgencyIds)) {
                $placeholders = implode(',', array_fill(0, count($idAgencyIds), '?'));
                $sql .= " AND ctr.id_agency IN ($placeholders)";
                $params = array_merge($params, $idAgencyIds);
            }
            if ($idCompany !== null && $idCompany !== '') {
                $sql .= " AND a_ag.id_company = ?";
                $params[] = (int) $idCompany;
            }

            $sql .= " GROUP BY c.id, aml.totalMonto, aml.idCompany ORDER BY aml.totalMonto DESC";

            $countSql = "SELECT COUNT(*) as total FROM ($sql) AS sub";
            $countQuery = $this->db->query($countSql, $params);
            $total = (int) ($countQuery->getRow()->total ?? 0);

            $sql .= " LIMIT ? OFFSET ?";
            $params[] = $limit;
            $params[] = $offset;

            $query = $this->db->query($sql, $params);
            $data = $query->getResultArray();

            return $this->response->setJSON([
                'success' => true,
                'data' => [
                    'expedientes' => $data,
                    'total' => $total,
                    'limit' => $limit,
                    'offset' => $offset,
                    'umbral' => $umbral,
                    'periodoMeses' => $amlConfig->periodoMeses
                ]
            ]);
        } catch (\Exception $e) {
            log_message('error', 'ReportesCumplimiento::expedientesAlertaPld - ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al generar el reporte',
                'error' => $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/reportes-cumplimiento/resumen-por-agencia
     * Resumen de expedientes por agencia y estado.
     */
    public function resumenPorAgencia()
    {
        $user = $this->requireComplianceOfficer();
        if (!$user) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Acceso denegado. Solo gerentes y administradores pueden ver reportes de cumplimiento.'
            ])->setStatusCode(403);
        }

        try {
            $idAgencyIds = $this->parseIdAgencyIds();
            $idCompany = $this->request->getGet('idCompany');
            $anio = (int) ($this->request->getGet('anio') ?: date('Y'));
            $mes = $this->request->getGet('mes'); // opcional

            $sql = "
                SELECT
                    co.id as idCompany,
                    COALESCE(NULLIF(TRIM(co.name), ''), 'Sin razón social') as razonSocial,
                    a.id as idAgency,
                    a.name as nombreAgencia,
                    f.id_current_state as idEstado,
                    fs.name as nombreEstado,
                    COUNT(*) as total
                FROM expedient f
                INNER JOIN agency a ON f.id_agency = a.id
                LEFT JOIN company co ON a.id_company = co.id
                LEFT JOIN file_status fs ON f.id_current_state = fs.id
                WHERE YEAR(f.registration_date) = ?
            ";
            $params = [$anio];

            if (!empty($idAgencyIds)) {
                $placeholders = implode(',', array_fill(0, count($idAgencyIds), '?'));
                $sql .= " AND f.id_agency IN ($placeholders)";
                $params = array_merge($params, $idAgencyIds);
            }
            if ($idCompany !== null && $idCompany !== '') {
                $sql .= " AND a.id_company = ?";
                $params[] = (int) $idCompany;
            }
            if ($mes !== null && $mes !== '') {
                $sql .= " AND MONTH(f.registration_date) = ?";
                $params[] = (int) $mes;
            }

            $sql .= " GROUP BY co.id, co.name, a.id, a.name, f.id_current_state, fs.name ORDER BY razonSocial, a.name, f.id_current_state";

            $query = $this->db->query($sql, $params);
            $rows = $query->getResultArray();

            // Agrupar por Razón Social / Agencia
            $porRazonSocialAgencia = [];
            foreach ($rows as $r) {
                $key = ($r['razonSocial'] ?? 'Sin razón social') . '|' . $r['idAgency'];
                if (!isset($porRazonSocialAgencia[$key])) {
                    $porRazonSocialAgencia[$key] = [
                        'razonSocial' => $r['razonSocial'] ?? 'Sin razón social',
                        'idCompany' => $r['idCompany'],
                        'idAgency' => $r['idAgency'],
                        'nombreAgencia' => $r['nombreAgencia'],
                        'porEstado' => [],
                        'total' => 0
                    ];
                }
                $porRazonSocialAgencia[$key]['porEstado'][] = [
                    'idEstado' => $r['idEstado'],
                    'nombreEstado' => $r['nombreEstado'] ?? 'Sin estado',
                    'total' => (int) $r['total']
                ];
                $porRazonSocialAgencia[$key]['total'] += (int) $r['total'];
            }

            return $this->response->setJSON([
                'success' => true,
                'data' => [
                    'grupos' => array_values($porRazonSocialAgencia),
                    'anio' => $anio,
                    'mes' => $mes ? (int) $mes : null
                ]
            ]);
        } catch (\Exception $e) {
            log_message('error', 'ReportesCumplimiento::resumenPorAgencia - ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al generar el reporte',
                'error' => $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/reportes-cumplimiento/documentos-pendientes
     * Documentos pendientes de validación (estatus 1, 2, 3) por agencia.
     */
    public function documentosPendientes()
    {
        $user = $this->requireComplianceOfficer();
        if (!$user) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Acceso denegado. Solo gerentes y administradores pueden ver reportes de cumplimiento.'
            ])->setStatusCode(403);
        }

        try {
            $idAgencyIds = $this->parseIdAgencyIds();
            $idCompany = $this->request->getGet('idCompany');

            $sql = "
                SELECT
                    co.id as idCompany,
                    COALESCE(NULLIF(TRIM(co.name), ''), 'Sin razón social') as razonSocial,
                    a.id as idAgency,
                    a.name as nombreAgencia,
                    dbf.id_current_status as idEstatus,
                    dfs.name as nombreEstatus,
                    COUNT(*) as total
                FROM file_document dbf
                INNER JOIN expedient f ON dbf.id_file = f.id
                INNER JOIN agency a ON f.id_agency = a.id
                LEFT JOIN company co ON a.id_company = co.id
                LEFT JOIN document_file_status dfs ON dbf.id_current_status = dfs.id
                WHERE dbf.id_current_status IN (1, 2, 3)
                AND f.id_current_state NOT IN (5)
            ";
            $params = [];

            if (!empty($idAgencyIds)) {
                $placeholders = implode(',', array_fill(0, count($idAgencyIds), '?'));
                $sql .= " AND f.id_agency IN ($placeholders)";
                $params = array_merge($params, $idAgencyIds);
            }
            if ($idCompany !== null && $idCompany !== '') {
                $sql .= " AND a.id_company = ?";
                $params[] = (int) $idCompany;
            }

            $sql .= " GROUP BY co.id, co.name, a.id, a.name, dbf.id_current_status, dfs.name ORDER BY razonSocial, a.name, dbf.id_current_status";

            $query = $this->db->query($sql, $params);
            $rows = $query->getResultArray();

            $porRazonSocialAgencia = [];
            foreach ($rows as $r) {
                $key = ($r['razonSocial'] ?? 'Sin razón social') . '|' . $r['idAgency'];
                if (!isset($porRazonSocialAgencia[$key])) {
                    $porRazonSocialAgencia[$key] = [
                        'razonSocial' => $r['razonSocial'] ?? 'Sin razón social',
                        'idCompany' => $r['idCompany'],
                        'idAgency' => $r['idAgency'],
                        'nombreAgencia' => $r['nombreAgencia'],
                        'porEstatus' => [],
                        'total' => 0
                    ];
                }
                $porRazonSocialAgencia[$key]['porEstatus'][] = [
                    'idEstatus' => $r['idEstatus'],
                    'nombreEstatus' => $r['nombreEstatus'] ?? 'Sin estatus',
                    'total' => (int) $r['total']
                ];
                $porRazonSocialAgencia[$key]['total'] += (int) $r['total'];
            }

            return $this->response->setJSON([
                'success' => true,
                'data' => [
                    'grupos' => array_values($porRazonSocialAgencia)
                ]
            ]);
        } catch (\Exception $e) {
            log_message('error', 'ReportesCumplimiento::documentosPendientes - ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al generar el reporte',
                'error' => $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/reportes-cumplimiento/expedientes-sin-beneficiario
     * Expedientes de persona moral (IdCustomerType=3) sin beneficiarios finales capturados.
     */
    public function expedientesSinBeneficiario()
    {
        $user = $this->requireComplianceOfficer();
        if (!$user) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Acceso denegado. Solo gerentes y administradores pueden ver reportes de cumplimiento.'
            ])->setStatusCode(403);
        }

        try {
            $idAgencyIds = $this->parseIdAgencyIds();
            $idCompany = $this->request->getGet('idCompany');
            $anio = (int) ($this->request->getGet('anio') ?: date('Y'));
            $limit = (int) ($this->request->getGet('limit') ?: 25);
            $offset = (int) ($this->request->getGet('offset') ?: 0);
            $limit = max(1, min(100, $limit));

            $sql = "
                SELECT
                    f.id as idFile,
                    f.id_order_total as ndPedido,
                    COALESCE(NULLIF(TRIM(c.razon_social), ''),
                        TRIM(CONCAT(COALESCE(c.name, ''), ' ', COALESCE(c.last_name, ''), ' ', COALESCE(c.mother_last_name, '')))
                    ) as cliente,
                    ct.name as tipoCliente,
                    a.name as agencia,
                    p.name as proceso,
                    fs.name as fase,
                    f.registration_date as registro
                FROM expedient f
                INNER JOIN client c ON f.id_client = c.id
                LEFT JOIN customer_type ct ON f.id_customer_type = ct.id
                INNER JOIN agency a ON f.id_agency = a.id
                INNER JOIN process p ON f.id_process = p.id
                INNER JOIN file_status fs ON f.id_current_state = fs.id
                WHERE f.id_customer_type = 3
                AND f.id_current_state NOT IN (5)
                AND YEAR(f.registration_date) = ?
                AND NOT EXISTS (
                    SELECT 1 FROM file_pld_beneficial_owner bf WHERE bf.IdFile = f.id
                )
            ";
            $params = [$anio];

            if (!empty($idAgencyIds)) {
                $placeholders = implode(',', array_fill(0, count($idAgencyIds), '?'));
                $sql .= " AND f.id_agency IN ($placeholders)";
                $params = array_merge($params, $idAgencyIds);
            }
            if ($idCompany !== null && $idCompany !== '') {
                $sql .= " AND a.id_company = ?";
                $params[] = (int) $idCompany;
            }

            $sql .= " ORDER BY f.registration_date DESC";

            $countSql = "SELECT COUNT(*) as total FROM ($sql) AS sub";
            $countQuery = $this->db->query($countSql, $params);
            $total = (int) ($countQuery->getRow()->total ?? 0);

            $sql .= " LIMIT ? OFFSET ?";
            $params[] = $limit;
            $params[] = $offset;

            $query = $this->db->query($sql, $params);
            $rows = $query->getResultArray();

            return $this->response->setJSON([
                'success' => true,
                'data' => [
                    'expedientes' => $rows,
                    'total' => $total,
                    'limit' => $limit,
                    'offset' => $offset,
                    'anio' => $anio
                ]
            ]);
        } catch (\Exception $e) {
            log_message('error', 'ReportesCumplimiento::expedientesSinBeneficiario - ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al generar el reporte',
                'error' => $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/reportes-cumplimiento/expedientes-sin-aviso
     * Expedientes sin aviso de privacidad aceptado.
     * Incluye: sin registro en file_pld, o con registro pero AvisoPrivacidadEntregado != 1.
     */
    public function expedientesSinAviso()
    {
        $user = $this->requireComplianceOfficer();
        if (!$user) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Acceso denegado. Solo gerentes y administradores pueden ver reportes de cumplimiento.'
            ])->setStatusCode(403);
        }

        try {
            $idAgencyIds = $this->parseIdAgencyIds();
            $idCompany = $this->request->getGet('idCompany');
            $anioParam = $this->request->getGet('anio');
            $anio = $anioParam !== null && $anioParam !== '' ? (int) $anioParam : 0;
            $limit = (int) ($this->request->getGet('limit') ?: 10);
            $offset = (int) ($this->request->getGet('offset') ?: 0);
            $limit = max(1, min(100, $limit));

            $sql = "
                SELECT
                    f.id as idFile,
                    f.id_order_total as ndPedido,
                    COALESCE(NULLIF(TRIM(c.razon_social), ''),
                        TRIM(CONCAT(COALESCE(c.name, ''), ' ', COALESCE(c.last_name, ''), ' ', COALESCE(c.mother_last_name, '')))
                    ) as cliente,
                    ct.name as tipoCliente,
                    a.name as agencia,
                    p.name as proceso,
                    fs.name as fase,
                    f.registration_date as registro
                FROM expedient f
                INNER JOIN client c ON f.id_client = c.id
                LEFT JOIN customer_type ct ON f.id_customer_type = ct.id
                INNER JOIN agency a ON f.id_agency = a.id
                INNER JOIN process p ON f.id_process = p.id
                INNER JOIN file_status fs ON f.id_current_state = fs.id
                WHERE f.id_current_state NOT IN (5)
                AND NOT EXISTS (
                    SELECT 1 FROM file_pld fp
                    WHERE fp.IdFile = f.id AND fp.AvisoPrivacidadEntregado = 1
                )
            ";
            $params = [];

            if ($anio > 0) {
                $sql .= " AND YEAR(f.registration_date) = ?";
                $params[] = $anio;
            }

            if (!empty($idAgencyIds)) {
                $placeholders = implode(',', array_fill(0, count($idAgencyIds), '?'));
                $sql .= " AND f.id_agency IN ($placeholders)";
                $params = array_merge($params, $idAgencyIds);
            }
            if ($idCompany !== null && $idCompany !== '') {
                $sql .= " AND a.id_company = ?";
                $params[] = (int) $idCompany;
            }

            $sql .= " ORDER BY f.registration_date DESC";

            try {
                $countSql = "SELECT COUNT(*) as total FROM ($sql) AS sub";
                $countQuery = $this->db->query($countSql, $params);
                $total = (int) ($countQuery->getRow()->total ?? 0);

                $sql .= " LIMIT ? OFFSET ?";
                $params[] = $limit;
                $params[] = $offset;

                $query = $this->db->query($sql, $params);
                $rows = $query->getResultArray();
            } catch (\Exception $sub) {
                if (strpos($sub->getMessage(), "doesn't exist") !== false || strpos($sub->getMessage(), 'exist') !== false) {
                    $sqlFallback = "
                        SELECT
                            f.id as idFile,
                            f.id_order_total as ndPedido,
                            COALESCE(NULLIF(TRIM(c.razon_social), ''),
                                TRIM(CONCAT(COALESCE(c.name, ''), ' ', COALESCE(c.last_name, ''), ' ', COALESCE(c.mother_last_name, '')))
                            ) as cliente,
                            ct.name as tipoCliente,
                            a.name as agencia,
                            p.name as proceso,
                            fs.name as fase,
                            f.registration_date as registro
                        FROM expedient f
                        INNER JOIN client c ON f.id_client = c.id
                        LEFT JOIN customer_type ct ON f.id_customer_type = ct.id
                        INNER JOIN agency a ON f.id_agency = a.id
                        INNER JOIN process p ON f.id_process = p.id
                        INNER JOIN file_status fs ON f.id_current_state = fs.id
                        WHERE f.id_current_state NOT IN (5)
                    ";
                    $paramsFallback = [];
                    if ($anio > 0) {
                        $sqlFallback .= " AND YEAR(f.registration_date) = ?";
                        $paramsFallback[] = $anio;
                    }
                    if (!empty($idAgencyIds)) {
                        $placeholders = implode(',', array_fill(0, count($idAgencyIds), '?'));
                        $sqlFallback .= " AND f.id_agency IN ($placeholders)";
                        $paramsFallback = array_merge($paramsFallback, $idAgencyIds);
                    }
                    $sqlFallback .= " ORDER BY f.registration_date DESC";

                    $countSqlFallback = "SELECT COUNT(*) as total FROM ($sqlFallback) AS sub";
                    $countQueryFallback = $this->db->query($countSqlFallback, $paramsFallback);
                    $total = (int) ($countQueryFallback->getRow()->total ?? 0);

                    $sqlFallback .= " LIMIT ? OFFSET ?";
                    $paramsFallback[] = $limit;
                    $paramsFallback[] = $offset;

                    $query = $this->db->query($sqlFallback, $paramsFallback);
                    $rows = $query->getResultArray();
                } else {
                    throw $sub;
                }
            }

            return $this->response->setJSON([
                'success' => true,
                'data' => [
                    'expedientes' => $rows,
                    'total' => $total,
                    'limit' => $limit,
                    'offset' => $offset,
                    'anio' => $anio
                ]
            ]);
        } catch (\Exception $e) {
            log_message('error', 'ReportesCumplimiento::expedientesSinAviso - ' . $e->getMessage());
            if (strpos($e->getMessage(), "doesn't exist") !== false) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'La tabla file_pld no existe. Ejecuta la migración: DB/migrations/create_file_pld_tables.sql',
                    'error' => $e->getMessage()
                ])->setStatusCode(500);
            }
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al generar el reporte',
                'error' => $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/reportes-cumplimiento/dashboard
     * Resumen ejecutivo para el Oficial de Cumplimiento.
     */
    public function dashboard()
    {
        $user = $this->requireComplianceOfficer();
        if (!$user) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Acceso denegado. Solo gerentes y administradores pueden ver reportes de cumplimiento.'
            ])->setStatusCode(403);
        }

        try {
            $amlConfig = config(AML::class);
            $umbral = $amlConfig->getUmbralMonto();
            $vistaAML = $amlConfig->vistaMontos;
            $idCompany = $this->request->getGet('idCompany');

            // Conteo de clientes con alerta AML (últimos 6 meses, umbral 3210 UMA)
            $sqlAml = "SELECT COUNT(DISTINCT idCliente) as total FROM {$vistaAML} WHERE totalMonto >= ?";
            $paramsAml = [$umbral];
            if ($idCompany !== null && $idCompany !== '') {
                $sqlAml .= " AND idCompany = ?";
                $paramsAml[] = (int) $idCompany;
            }
            $qAml = $this->db->query($sqlAml, $paramsAml);
            $clientesAlertaAml = (int) ($qAml->getRow()->total ?? 0);

            // Total de expedientes activos (no cancelados) en el año
            $sqlFiles = "SELECT COUNT(*) as total FROM expedient f INNER JOIN agency a ON f.id_agency = a.id WHERE YEAR(f.registration_date) = ? AND f.id_current_state != 5";
            $paramsFiles = [$anioActual];
            if ($idCompany !== null && $idCompany !== '') {
                $sqlFiles .= " AND a.id_company = ?";
                $paramsFiles[] = (int) $idCompany;
            }
            $qFiles = $this->db->query($sqlFiles, $paramsFiles);
            $expedientesActivos = (int) ($qFiles->getRow()->total ?? 0);

            // Documentos pendientes de validación
            $sqlDoc = "
                SELECT COUNT(*) as total FROM file_document dbf
                INNER JOIN expedient f ON dbf.id_file = f.id
                INNER JOIN agency a ON f.id_agency = a.id
                WHERE dbf.id_current_status IN (1, 2, 3) AND f.id_current_state NOT IN (5)
            ";
            $paramsDoc = [];
            if ($idCompany !== null && $idCompany !== '') {
                $sqlDoc .= " AND a.id_company = ?";
                $paramsDoc[] = (int) $idCompany;
            }
            $qDoc = $this->db->query($sqlDoc, $paramsDoc);
            $documentosPendientes = (int) ($qDoc->getRow()->total ?? 0);

            // Expedientes persona moral sin beneficiarios (año actual)
            $sqlBenef = "
                SELECT COUNT(*) as total FROM expedient f
                INNER JOIN agency a ON f.id_agency = a.id
                WHERE f.id_customer_type = 3 AND f.id_current_state NOT IN (5)
                AND YEAR(f.registration_date) = ?
                AND NOT EXISTS (SELECT 1 FROM file_pld_beneficial_owner bf WHERE bf.IdFile = f.id)
            ";
            $paramsBenef = [$anioActual];
            if ($idCompany !== null && $idCompany !== '') {
                $sqlBenef .= " AND a.id_company = ?";
                $paramsBenef[] = (int) $idCompany;
            }
            $qBenef = $this->db->query($sqlBenef, $paramsBenef);
            $expedientesSinBeneficiario = (int) ($qBenef->getRow()->total ?? 0);

            // Expedientes sin aviso de privacidad aceptado (año actual)
            $sqlAviso = "
                SELECT COUNT(*) as total FROM expedient f
                INNER JOIN agency a ON f.id_agency = a.id
                WHERE f.id_current_state NOT IN (5) AND YEAR(f.registration_date) = ?
                AND NOT EXISTS (SELECT 1 FROM file_pld fp WHERE fp.IdFile = f.id AND fp.AvisoPrivacidadEntregado = 1)
            ";
            $paramsAviso = [$anioActual];
            if ($idCompany !== null && $idCompany !== '') {
                $sqlAviso .= " AND a.id_company = ?";
                $paramsAviso[] = (int) $idCompany;
            }
            $qAviso = $this->db->query($sqlAviso, $paramsAviso);
            $expedientesSinAviso = (int) ($qAviso->getRow()->total ?? 0);

            return $this->response->setJSON([
                'success' => true,
                'data' => [
                    'clientesAlertaAml' => $clientesAlertaAml,
                    'expedientesActivos' => $expedientesActivos,
                    'documentosPendientes' => $documentosPendientes,
                    'expedientesSinBeneficiario' => $expedientesSinBeneficiario,
                    'expedientesSinAviso' => $expedientesSinAviso,
                    'umbralAml' => $umbral,
                    'periodoMeses' => $amlConfig->periodoMeses,
                    'umbralUMA' => $amlConfig->getUmbralUMA(),
                    'anio' => (int) date('Y')
                ]
            ]);
        } catch (\Exception $e) {
            log_message('error', 'ReportesCumplimiento::dashboard - ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al generar el dashboard',
                'error' => $e->getMessage()
            ])->setStatusCode(500);
        }
    }
}
