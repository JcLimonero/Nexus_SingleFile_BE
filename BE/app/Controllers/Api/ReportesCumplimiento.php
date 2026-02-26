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
            $umbral = (float) $amlConfig->umbralAnualPorCompania;
            $vistaAML = $amlConfig->vistaMontos;
            $anioActual = (int) date('Y');
            $idAgency = $this->request->getGet('idAgency');
            $limit = (int) ($this->request->getGet('limit') ?: 200);
            $offset = (int) ($this->request->getGet('offset') ?: 0);
            $limit = max(1, min(500, $limit));

            $sql = "
                SELECT
                    c.Id as idCliente,
                    MIN(ctr.IdTotalDealer) as ndCliente,
                    ANY_VALUE(COALESCE(NULLIF(TRIM(c.RazonSocial), ''), TRIM(CONCAT(COALESCE(c.Name, ''), ' ', COALESCE(c.LastName, ''), ' ', COALESCE(c.MotherLastName, ''))))) as cliente,
                    aml.totalMonto,
                    aml.idCompany,
                    aml.anio
                FROM Client c
                INNER JOIN HeaderClient hc ON hc.IdClient = c.Id
                INNER JOIN Client_Total_Relation ctr ON hc.Id = ctr.idHeaderClient
                INNER JOIN {$vistaAML} aml ON aml.idCliente = c.Id AND aml.anio = ? AND aml.totalMonto >= ?
                INNER JOIN File f ON f.IdClient = c.Id AND f.IdAgency = ctr.IdAgency
                WHERE 1=1
            ";
            $params = [$anioActual, $umbral];

            if ($idAgency !== null && $idAgency !== '') {
                $sql .= " AND ctr.IdAgency = ?";
                $params[] = (int) $idAgency;
            }

            $sql .= " GROUP BY c.Id, aml.totalMonto, aml.idCompany, aml.anio ORDER BY aml.totalMonto DESC";

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
                    'anio' => $anioActual
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
            $idAgency = $this->request->getGet('idAgency');
            $anio = (int) ($this->request->getGet('anio') ?: date('Y'));
            $mes = $this->request->getGet('mes'); // opcional

            $sql = "
                SELECT
                    co.Id as idCompany,
                    COALESCE(NULLIF(TRIM(co.Name), ''), 'Sin razón social') as razonSocial,
                    a.Id as idAgency,
                    a.Name as nombreAgencia,
                    f.IdCurrentState as idEstado,
                    fs.Name as nombreEstado,
                    COUNT(*) as total
                FROM File f
                INNER JOIN Agency a ON f.IdAgency = a.Id
                LEFT JOIN Company co ON a.IdCompany = co.Id
                LEFT JOIN File_Status fs ON f.IdCurrentState = fs.Id
                WHERE YEAR(f.RegistrationDate) = ?
            ";
            $params = [$anio];

            if ($idAgency !== null && $idAgency !== '') {
                $sql .= " AND f.IdAgency = ?";
                $params[] = (int) $idAgency;
            }
            if ($mes !== null && $mes !== '') {
                $sql .= " AND MONTH(f.RegistrationDate) = ?";
                $params[] = (int) $mes;
            }

            $sql .= " GROUP BY co.Id, co.Name, a.Id, a.Name, f.IdCurrentState, fs.Name ORDER BY razonSocial, a.Name, f.IdCurrentState";

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
            $idAgency = $this->request->getGet('idAgency');

            $sql = "
                SELECT
                    a.Id as idAgency,
                    a.Name as nombreAgencia,
                    dbf.IdCurrentStatus as idEstatus,
                    dfs.Name as nombreEstatus,
                    COUNT(*) as total
                FROM DocumentByFile dbf
                INNER JOIN File f ON dbf.IdFile = f.Id
                INNER JOIN Agency a ON f.IdAgency = a.Id
                LEFT JOIN DocumentFile_Status dfs ON dbf.IdCurrentStatus = dfs.Id
                WHERE dbf.IdCurrentStatus IN (1, 2, 3)
                AND f.IdCurrentState NOT IN (5)
            ";
            $params = [];

            if ($idAgency !== null && $idAgency !== '') {
                $sql .= " AND f.IdAgency = ?";
                $params[] = (int) $idAgency;
            }

            $sql .= " GROUP BY a.Id, a.Name, dbf.IdCurrentStatus, dfs.Name ORDER BY a.Name, dbf.IdCurrentStatus";

            $query = $this->db->query($sql, $params);
            $rows = $query->getResultArray();

            $porAgencia = [];
            foreach ($rows as $r) {
                $key = $r['idAgency'];
                if (!isset($porAgencia[$key])) {
                    $porAgencia[$key] = [
                        'idAgency' => $r['idAgency'],
                        'nombreAgencia' => $r['nombreAgencia'],
                        'porEstatus' => [],
                        'total' => 0
                    ];
                }
                $porAgencia[$key]['porEstatus'][] = [
                    'idEstatus' => $r['idEstatus'],
                    'nombreEstatus' => $r['nombreEstatus'] ?? 'Sin estatus',
                    'total' => (int) $r['total']
                ];
                $porAgencia[$key]['total'] += (int) $r['total'];
            }

            return $this->response->setJSON([
                'success' => true,
                'data' => [
                    'agencias' => array_values($porAgencia)
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
     * Expedientes de persona moral (IdCostumerType=3) sin beneficiarios finales capturados.
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
            $idAgency = $this->request->getGet('idAgency');
            $anio = (int) ($this->request->getGet('anio') ?: date('Y'));
            $limit = (int) ($this->request->getGet('limit') ?: 25);
            $offset = (int) ($this->request->getGet('offset') ?: 0);
            $limit = max(1, min(100, $limit));

            $sql = "
                SELECT
                    f.Id as idFile,
                    f.IdOrderTotal as ndPedido,
                    COALESCE(NULLIF(TRIM(c.RazonSocial), ''),
                        TRIM(CONCAT(COALESCE(c.Name, ''), ' ', COALESCE(c.LastName, ''), ' ', COALESCE(c.MotherLastName, '')))
                    ) as cliente,
                    ct.Name as tipoCliente,
                    a.Name as agencia,
                    p.Name as proceso,
                    fs.Name as fase,
                    f.RegistrationDate as registro
                FROM File f
                INNER JOIN HeaderClient hc ON hc.IdClient = f.IdClient
                INNER JOIN Client c ON hc.IdClient = c.Id
                LEFT JOIN CostumerType ct ON f.IdCostumerType = ct.Id
                INNER JOIN Agency a ON f.IdAgency = a.Id
                INNER JOIN Process p ON f.IdProcess = p.Id
                INNER JOIN File_Status fs ON f.IdCurrentState = fs.Id
                WHERE f.IdCostumerType = 3
                AND f.IdCurrentState NOT IN (5)
                AND YEAR(f.RegistrationDate) = ?
                AND NOT EXISTS (
                    SELECT 1 FROM file_pld_beneficiariofinal bf WHERE bf.IdFile = f.Id
                )
            ";
            $params = [$anio];

            if ($idAgency !== null && $idAgency !== '') {
                $sql .= " AND f.IdAgency = ?";
                $params[] = (int) $idAgency;
            }

            $sql .= " ORDER BY f.RegistrationDate DESC";

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
            $idAgency = $this->request->getGet('idAgency');
            $anioParam = $this->request->getGet('anio');
            $anio = $anioParam !== null && $anioParam !== '' ? (int) $anioParam : 0;

            $sql = "
                SELECT
                    f.Id as idFile,
                    f.IdOrderTotal as ndPedido,
                    COALESCE(NULLIF(TRIM(c.RazonSocial), ''),
                        TRIM(CONCAT(COALESCE(c.Name, ''), ' ', COALESCE(c.LastName, ''), ' ', COALESCE(c.MotherLastName, '')))
                    ) as cliente,
                    ct.Name as tipoCliente,
                    a.Name as agencia,
                    p.Name as proceso,
                    fs.Name as fase,
                    f.RegistrationDate as registro
                FROM File f
                INNER JOIN HeaderClient hc ON hc.IdClient = f.IdClient
                INNER JOIN Client c ON hc.IdClient = c.Id
                LEFT JOIN CostumerType ct ON f.IdCostumerType = ct.Id
                INNER JOIN Agency a ON f.IdAgency = a.Id
                INNER JOIN Process p ON f.IdProcess = p.Id
                INNER JOIN File_Status fs ON f.IdCurrentState = fs.Id
                WHERE f.IdCurrentState NOT IN (5)
                AND NOT EXISTS (
                    SELECT 1 FROM file_pld fp
                    WHERE fp.IdFile = f.Id AND fp.AvisoPrivacidadEntregado = 1
                )
            ";
            $params = [];

            if ($anio > 0) {
                $sql .= " AND YEAR(f.RegistrationDate) = ?";
                $params[] = $anio;
            }

            if ($idAgency !== null && $idAgency !== '') {
                $sql .= " AND f.IdAgency = ?";
                $params[] = (int) $idAgency;
            }

            $sql .= " ORDER BY f.RegistrationDate DESC";

            try {
                $query = $this->db->query($sql, $params);
                $rows = $query->getResultArray();
            } catch (\Exception $sub) {
                if (strpos($sub->getMessage(), "doesn't exist") !== false || strpos($sub->getMessage(), 'exist') !== false) {
                    $sqlFallback = "
                        SELECT
                            f.Id as idFile,
                            f.IdOrderTotal as ndPedido,
                            COALESCE(NULLIF(TRIM(c.RazonSocial), ''),
                                TRIM(CONCAT(COALESCE(c.Name, ''), ' ', COALESCE(c.LastName, ''), ' ', COALESCE(c.MotherLastName, '')))
                            ) as cliente,
                            ct.Name as tipoCliente,
                            a.Name as agencia,
                            p.Name as proceso,
                            fs.Name as fase,
                            f.RegistrationDate as registro
                        FROM File f
                        INNER JOIN HeaderClient hc ON hc.IdClient = f.IdClient
                        INNER JOIN Client c ON hc.IdClient = c.Id
                        LEFT JOIN CostumerType ct ON f.IdCostumerType = ct.Id
                        INNER JOIN Agency a ON f.IdAgency = a.Id
                        INNER JOIN Process p ON f.IdProcess = p.Id
                        INNER JOIN File_Status fs ON f.IdCurrentState = fs.Id
                        WHERE f.IdCurrentState NOT IN (5)
                    ";
                    $paramsFallback = [];
                    if ($anio > 0) {
                        $sqlFallback .= " AND YEAR(f.RegistrationDate) = ?";
                        $paramsFallback[] = $anio;
                    }
                    if ($idAgency !== null && $idAgency !== '') {
                        $sqlFallback .= " AND f.IdAgency = ?";
                        $paramsFallback[] = (int) $idAgency;
                    }
                    $sqlFallback .= " ORDER BY f.RegistrationDate DESC";
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
                    'total' => count($rows),
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
            $umbral = (float) $amlConfig->umbralAnualPorCompania;
            $vistaAML = $amlConfig->vistaMontos;
            $anioActual = (int) date('Y');

            // Conteo de clientes con alerta AML
            $sqlAml = "SELECT COUNT(DISTINCT idCliente) as total FROM {$vistaAML} WHERE anio = ? AND totalMonto >= ?";
            $qAml = $this->db->query($sqlAml, [$anioActual, $umbral]);
            $clientesAlertaAml = (int) ($qAml->getRow()->total ?? 0);

            // Total de expedientes activos (no cancelados) en el año
            $sqlFiles = "SELECT COUNT(*) as total FROM File WHERE YEAR(RegistrationDate) = ? AND IdCurrentState != 5";
            $qFiles = $this->db->query($sqlFiles, [$anioActual]);
            $expedientesActivos = (int) ($qFiles->getRow()->total ?? 0);

            // Documentos pendientes de validación
            $sqlDoc = "
                SELECT COUNT(*) as total FROM DocumentByFile dbf
                INNER JOIN File f ON dbf.IdFile = f.Id
                WHERE dbf.IdCurrentStatus IN (1, 2, 3) AND f.IdCurrentState NOT IN (5)
            ";
            $qDoc = $this->db->query($sqlDoc);
            $documentosPendientes = (int) ($qDoc->getRow()->total ?? 0);

            // Expedientes persona moral sin beneficiarios (año actual)
            $sqlBenef = "
                SELECT COUNT(*) as total FROM File f
                WHERE f.IdCostumerType = 3 AND f.IdCurrentState NOT IN (5)
                AND YEAR(f.RegistrationDate) = ?
                AND NOT EXISTS (SELECT 1 FROM file_pld_beneficiariofinal bf WHERE bf.IdFile = f.Id)
            ";
            $qBenef = $this->db->query($sqlBenef, [$anioActual]);
            $expedientesSinBeneficiario = (int) ($qBenef->getRow()->total ?? 0);

            // Expedientes sin aviso de privacidad aceptado (año actual)
            $sqlAviso = "
                SELECT COUNT(*) as total FROM File f
                WHERE f.IdCurrentState NOT IN (5) AND YEAR(f.RegistrationDate) = ?
                AND NOT EXISTS (SELECT 1 FROM file_pld fp WHERE fp.IdFile = f.Id AND fp.AvisoPrivacidadEntregado = 1)
            ";
            $qAviso = $this->db->query($sqlAviso, [$anioActual]);
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
                    'anio' => $anioActual
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
