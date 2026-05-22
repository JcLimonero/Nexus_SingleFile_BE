<?php

namespace App\Controllers\Api;

use App\Constants\FileState;
use App\Controllers\BaseController;
use App\Models\AgencyModel;
use App\Models\DocumentModel;
use App\Models\ProcessModel;
use App\Models\UserActivityLogModel;
use App\Models\UserModel;
use CodeIgniter\HTTP\ResponseInterface;

class Analytics extends BaseController
{
    protected $documentModel;
    protected $processModel;
    protected $agencyModel;
    protected $userModel;
    protected $userActivityLogModel;
    protected $cache;
    protected $db;

    private const CACHE_TTL_SHORT       = 30;
    private const ORDERS_DEFAULT_LIMIT  = 500;
    private const ORDERS_MAX_LIMIT      = 5000;

    private const MONTH_NAMES_ES = [
        1 => 'Enero',     2 => 'Febrero',  3 => 'Marzo',     4 => 'Abril',
        5 => 'Mayo',      6 => 'Junio',    7 => 'Julio',     8 => 'Agosto',
        9 => 'Septiembre',10 => 'Octubre', 11 => 'Noviembre',12 => 'Diciembre',
    ];

    private const ATTENTION_RANGES = [
        ['range' => '0-5',   'label' => '0 - 5 Días',   'color' => '#10b981'],
        ['range' => '5-10',  'label' => '5 - 10 Días',  'color' => '#f59e0b'],
        ['range' => '10-15', 'label' => '10 - 15 Días', 'color' => '#f97316'],
        ['range' => '15+',   'label' => '> 15 Días',    'color' => '#ef4444'],
    ];

    private const DAYS_OF_WEEK_ES = [
        'Monday'    => 'Lunes',
        'Tuesday'   => 'Martes',
        'Wednesday' => 'Miércoles',
        'Thursday'  => 'Jueves',
        'Friday'    => 'Viernes',
        'Saturday'  => 'Sábado',
        'Sunday'    => 'Domingo',
    ];

    public function __construct()
    {
        $this->documentModel        = new DocumentModel();
        $this->processModel         = new ProcessModel();
        $this->agencyModel          = new AgencyModel();
        $this->userModel            = new UserModel();
        $this->userActivityLogModel = new UserActivityLogModel();
        $this->cache                = \Config\Services::cache();
        $this->db                   = \Config\Database::connect();
    }

    // =================================================================
    // Endpoints públicos
    // =================================================================

    /**
     * GET /api/analytics/dashboard
     */
    public function getDashboardData()
    {
        try {
            $filters = $this->getFiltersFromRequest();

            $data = [
                'userActivity' => $this->fetchUserActivityStats($filters),
                'documents'    => $this->fetchDocumentStats($filters),
                'processes'    => $this->fetchProcessStats($filters),
                'agencies'     => $this->fetchAgencyStats(),
                'system'       => $this->fetchSystemMetrics(),
            ];

            return $this->response->setJSON(['success' => true, 'data' => $data]);
        } catch (\Throwable $e) {
            return $this->errorResponse($e, 'Error al obtener datos del dashboard', 'getDashboardData');
        }
    }

    /**
     * GET /api/analytics/widget-document-statistics
     */
    public function getDocumentStats()
    {
        try {
            $data = $this->fetchDocumentStats($this->getFiltersFromRequest());
            return $this->response->setJSON(['success' => true, 'data' => $data]);
        } catch (\Throwable $e) {
            return $this->errorResponse($e, 'Error al obtener estadísticas de documentos', 'getDocumentStats');
        }
    }

    /**
     * GET /api/analytics/widget-process-statistics
     */
    public function getProcessStats()
    {
        try {
            $data = $this->fetchProcessStats($this->getFiltersFromRequest());
            return $this->response->setJSON(['success' => true, 'data' => $data]);
        } catch (\Throwable $e) {
            return $this->errorResponse($e, 'Error al obtener estadísticas de procesos', 'getProcessStats');
        }
    }

    /**
     * GET /api/analytics/widget-agency-statistics
     */
    public function getAgencyStats()
    {
        try {
            $data = $this->fetchAgencyStats();
            return $this->response->setJSON(['success' => true, 'data' => $data]);
        } catch (\Throwable $e) {
            return $this->errorResponse($e, 'Error al obtener estadísticas de agencias', 'getAgencyStats');
        }
    }

    /**
     * GET /api/analytics/widget-system-overview-metrics
     */
    public function getSystemMetrics()
    {
        try {
            $data = $this->fetchSystemMetrics();
            return $this->response->setJSON(['success' => true, 'data' => $data]);
        } catch (\Throwable $e) {
            return $this->errorResponse($e, 'Error al obtener métricas del sistema', 'getSystemMetrics');
        }
    }

    /**
     * GET /api/analytics/widget-agency-specific-metrics
     */
    public function getAgencyMetrics()
    {
        try {
            $filters  = $this->getFiltersFromRequest();
            $agencyId = $this->normalizeId($filters['agency_id'] ?? null);

            $cacheKey = 'analytics.agency_metrics.' . ($agencyId ?? 'all');
            $data     = $this->cache->get($cacheKey);

            if ($data === null) {
                $data = $this->computeAgencyMetrics($agencyId);
                $this->cache->save($cacheKey, $data, self::CACHE_TTL_SHORT);
            }

            return $this->response->setJSON(['success' => true, 'data' => $data]);
        } catch (\Throwable $e) {
            return $this->errorResponse($e, 'Error al obtener métricas de agencia', 'getAgencyMetrics');
        }
    }

    /**
     * GET /api/analytics/widget-file-trend-chart
     */
    public function getTrendData()
    {
        try {
            $filters  = $this->getFiltersFromRequest();
            $year     = (int) ($filters['year'] ?? date('Y'));
            $agencyId = $this->normalizeId($filters['agency_id'] ?? null);
            $sellerId = $this->normalizeId($filters['idSeller'] ?? null);

            $yearStart = sprintf('%04d-01-01 00:00:00', $year);
            $yearEnd   = sprintf('%04d-12-31 23:59:59', $year);

            $entregados = array_fill(0, 12, 0);
            $canceladas = array_fill(0, 12, 0);
            $proceso    = array_fill(0, 12, 0);

            $deliveredList = implode(',', FileState::DELIVERED_STATES);
            $inProcessList = implode(',', FileState::IN_PROCESS_STATES);

            $query = $this->db->table('File')
                ->select(
                    "MONTH(RegistrationDate) as month,
                     SUM(CASE WHEN IdCurrentState IN ($deliveredList) THEN 1 ELSE 0 END) as entregados,
                     SUM(CASE WHEN IdCurrentState = " . FileState::CANCELED . " THEN 1 ELSE 0 END) as canceladas,
                     SUM(CASE WHEN IdCurrentState IN ($inProcessList) THEN 1 ELSE 0 END) as proceso",
                    false
                )
                ->where('RegistrationDate >=', $yearStart)
                ->where('RegistrationDate <=', $yearEnd)
                ->groupBy('MONTH(RegistrationDate)');

            if ($agencyId !== null) {
                $query->where('IdAgency', $agencyId);
            }
            if ($sellerId !== null) {
                $query->where('idSeller', $sellerId);
            }

            foreach ($query->get()->getResultArray() as $row) {
                $monthIndex = (int) $row['month'] - 1;
                $entregados[$monthIndex] = (int) $row['entregados'];
                $canceladas[$monthIndex] = (int) $row['canceladas'];
                $proceso[$monthIndex]    = (int) $row['proceso'];
            }

            return $this->response->setJSON([
                'success' => true,
                'data'    => [
                    'entregados' => $entregados,
                    'canceladas' => $canceladas,
                    'proceso'    => $proceso,
                    'year'       => $year,
                    'agency_id'  => $agencyId,
                ],
            ]);
        } catch (\Throwable $e) {
            return $this->errorResponse($e, 'Error al obtener datos de tendencia', 'getTrendData');
        }
    }

    /**
     * GET /api/analytics/widget-file-distribution-metrics
     */
    public function getDistributionMetrics()
    {
        try {
            $filters  = $this->getFiltersFromRequest();
            $agencyId = $this->normalizeId($filters['agency_id'] ?? null);

            $cacheKey = 'analytics.distribution_metrics.' . ($agencyId ?? 'all');
            $data     = $this->cache->get($cacheKey);

            if ($data === null) {
                $data = $this->computeDistributionMetrics($agencyId);
                $this->cache->save($cacheKey, $data, self::CACHE_TTL_SHORT);
            }

            return $this->response->setJSON(['success' => true, 'data' => $data]);
        } catch (\Throwable $e) {
            return $this->errorResponse($e, 'Error al obtener métricas de distribución', 'getDistributionMetrics');
        }
    }

    /**
     * GET /api/analytics/widget-process-distribution
     */
    public function getProcessDistribution()
    {
        try {
            $filters = $this->getFiltersFromRequest();

            $query = $this->db->table('File f')
                ->select('p.Name as processName, COUNT(f.Id) as totalCases')
                ->join('Process p', 'f.IdProcess = p.Id', 'left')
                ->groupBy('p.Id, p.Name')
                ->orderBy('totalCases', 'DESC');

            $this->applyAgencyAndSellerFilters($query, $filters, 'f', 'idSeller');

            $results = $query->get()->getResultArray();
            $total   = array_sum(array_column($results, 'totalCases'));

            $distribution = [];
            foreach ($results as $row) {
                $cases       = (int) $row['totalCases'];
                $percentage  = $total > 0 ? round(($cases / $total) * 100, 1) : 0;
                $distribution[] = [
                    'processName' => $row['processName'] ?: 'Sin Proceso',
                    'totalCases'  => $cases,
                    'percentage'  => $percentage,
                ];
            }

            return $this->response->setJSON(['success' => true, 'data' => $distribution]);
        } catch (\Throwable $e) {
            return $this->errorResponse($e, 'Error al obtener distribución por proceso', 'getProcessDistribution');
        }
    }

    /**
     * GET /api/analytics/widget-status-distribution
     */
    public function getStatusDistribution()
    {
        try {
            $filters = $this->getFiltersFromRequest();

            $query = $this->db->table('File f')
                ->select('fs.Name as statusName, COUNT(f.Id) as totalCases')
                ->join('File_Status fs', 'f.IdCurrentState = fs.Id', 'left')
                ->groupBy('fs.Id, fs.Name')
                ->orderBy('totalCases', 'DESC');

            $this->applyAgencyAndSellerFilters($query, $filters, 'f', 'idSeller');

            return $this->response->setJSON([
                'success' => true,
                'data'    => $this->buildStatusDistribution($query->get()->getResultArray()),
            ]);
        } catch (\Throwable $e) {
            return $this->errorResponse($e, 'Error al obtener distribución por estatus', 'getStatusDistribution');
        }
    }

    /**
     * GET /api/analytics/widget-current-month-status
     */
    public function getCurrentMonthStatusDistribution()
    {
        try {
            $filters                  = $this->getFiltersFromRequest();
            [$monthStart, $monthEnd]  = $this->currentMonthRange();

            $query = $this->db->table('File f')
                ->select('fs.Name as statusName, COUNT(f.Id) as totalCases')
                ->join('File_Status fs', 'f.IdCurrentState = fs.Id', 'left')
                ->where('f.RegistrationDate >=', $monthStart)
                ->where('f.RegistrationDate <=', $monthEnd)
                ->groupBy('fs.Id, fs.Name')
                ->orderBy('totalCases', 'DESC');

            $this->applyAgencyAndSellerFilters($query, $filters, 'f', 'idSeller');

            return $this->response->setJSON([
                'success' => true,
                'data'    => $this->buildStatusDistribution($query->get()->getResultArray()),
            ]);
        } catch (\Throwable $e) {
            return $this->errorResponse($e, 'Error al obtener distribución por estatus del mes actual', 'getCurrentMonthStatusDistribution');
        }
    }

    /**
     * GET /api/analytics/widget-previous-months
     */
    public function getPreviousMonthsData()
    {
        try {
            $filters       = $this->getFiltersFromRequest();
            $monthsToShow  = (int) ($filters['months_to_show'] ?? 6);

            $startDate = date('Y-m-01 00:00:00', strtotime("-{$monthsToShow} months"));
            $endDate   = date('Y-m-t 23:59:59', strtotime('-1 month'));

            $query = $this->db->table('File f')
                ->select(
                    'YEAR(f.RegistrationDate) as year,
                     MONTH(f.RegistrationDate) as month,
                     COUNT(f.Id) as totalCases,
                     SUM(CASE WHEN f.IdCurrentState IN (' . implode(',', FileState::DELIVERED_STATES) . ') THEN 1 ELSE 0 END) as deliveredCases,
                     SUM(CASE WHEN f.IdCurrentState = ' . FileState::LIQUIDATION . ' THEN 1 ELSE 0 END) as inProcessCases,
                     SUM(CASE WHEN f.IdCurrentState = ' . FileState::RELEASE . ' THEN 1 ELSE 0 END) as cancelledCases',
                    false
                )
                ->where('f.RegistrationDate >=', $startDate)
                ->where('f.RegistrationDate <=', $endDate)
                ->groupBy('YEAR(f.RegistrationDate), MONTH(f.RegistrationDate)')
                ->orderBy('YEAR(f.RegistrationDate)', 'DESC')
                ->orderBy('MONTH(f.RegistrationDate)', 'DESC');

            $this->applyAgencyAndSellerFilters($query, $filters, 'f', 'idSeller');

            $rows = $query->get()->getResultArray();
            $data = [];
            foreach ($rows as $row) {
                $data[] = [
                    'month'           => self::MONTH_NAMES_ES[(int) $row['month']] ?? '',
                    'year'            => (int) $row['year'],
                    'totalCases'      => (int) ($row['totalCases'] ?? 0),
                    'deliveredCases'  => (int) ($row['deliveredCases'] ?? 0),
                    'inProcessCases'  => (int) ($row['inProcessCases'] ?? 0),
                    'cancelledCases'  => (int) ($row['cancelledCases'] ?? 0),
                ];
            }

            usort($data, fn($a, $b) => $a['year'] === $b['year']
                ? $b['month'] <=> $a['month']
                : $b['year'] <=> $a['year']);

            return $this->response->setJSON(['success' => true, 'data' => $data]);
        } catch (\Throwable $e) {
            return $this->errorResponse($e, 'Error al obtener datos de meses anteriores', 'getPreviousMonthsData');
        }
    }

    /**
     * GET /api/analytics/widget-historical-status
     */
    public function getHistoricalStatusDistribution()
    {
        try {
            $filters                 = $this->getFiltersFromRequest();
            [$monthStart, $monthEnd] = $this->currentMonthRange();

            $query = $this->db->table('File f')
                ->select('fs.Name as statusName, COUNT(f.Id) as totalCases')
                ->join('File_Status fs', 'f.IdCurrentState = fs.Id', 'left')
                ->groupStart()
                    ->where('f.RegistrationDate <', $monthStart)
                    ->orWhere('f.RegistrationDate >', $monthEnd)
                ->groupEnd()
                ->groupBy('fs.Id, fs.Name')
                ->orderBy('totalCases', 'DESC');

            $this->applyAgencyAndSellerFilters($query, $filters, 'f', 'idSeller');

            return $this->response->setJSON([
                'success' => true,
                'data'    => $this->buildStatusDistribution($query->get()->getResultArray()),
            ]);
        } catch (\Throwable $e) {
            return $this->errorResponse($e, 'Error al obtener distribución histórica por estatus', 'getHistoricalStatusDistribution');
        }
    }

    /**
     * GET /api/analytics/advisor-distribution
     */
    public function getAdvisorDistribution()
    {
        try {
            $filters                 = $this->getFiltersFromRequest();
            [$monthStart, $monthEnd] = $this->currentMonthRange();

            $deliveredList = implode(',', FileState::DELIVERED_STATES);
            $inProcessList = implode(',', FileState::IN_PROCESS_STATES);

            $query = $this->db->table('File f')
                ->select(
                    "u.Name as advisorName,
                     SUM(CASE WHEN f.IdCurrentState IN ($deliveredList) THEN 1 ELSE 0 END) as approved,
                     SUM(CASE WHEN f.IdCurrentState IN ($inProcessList) THEN 1 ELSE 0 END) as pending,
                     SUM(CASE WHEN f.IdCurrentState = " . FileState::CANCELED . " THEN 1 ELSE 0 END) as rejected,
                     COUNT(f.Id) as total",
                    false
                )
                ->join('User u', 'f.idSeller = u.Id', 'left')
                ->where('f.RegistrationDate >=', $monthStart)
                ->where('f.RegistrationDate <=', $monthEnd)
                ->groupBy('u.Id, u.Name')
                ->having('total > 0')
                ->orderBy('total', 'DESC');

            $this->applyAgencyAndSellerFilters($query, $filters, 'f', 'user_id');

            $rows = $query->get()->getResultArray();
            $out  = [];
            foreach ($rows as $row) {
                $out[] = [
                    'advisorName' => $row['advisorName'] ?: 'Sin Asesor',
                    'approved'    => (int) $row['approved'],
                    'pending'     => (int) $row['pending'],
                    'rejected'    => (int) $row['rejected'],
                    'total'       => (int) $row['total'],
                ];
            }

            return $this->response->setJSON(['success' => true, 'data' => $out]);
        } catch (\Throwable $e) {
            return $this->errorResponse($e, 'Error al obtener distribución de asesores', 'getAdvisorDistribution');
        }
    }

    /**
     * GET /api/analytics/weekly-data
     */
    public function getWeeklyData()
    {
        try {
            $filters = $this->getFiltersFromRequest();

            $today        = date('Y-m-d');
            $dayOfWeek    = (int) date('N', strtotime($today));
            $mondayDate   = date('Y-m-d', strtotime('-' . ($dayOfWeek - 1) . ' days', strtotime($today)));
            $sundayDate   = date('Y-m-d', strtotime('+' . (7 - $dayOfWeek) . ' days', strtotime($today)));
            $mondayStart  = $mondayDate . ' 00:00:00';
            $sundayEnd    = $sundayDate . ' 23:59:59';

            $query = $this->db->table('File f')
                ->select('DATE(f.RegistrationDate) as day,
                          DAYNAME(f.RegistrationDate) as dayName,
                          COUNT(f.Id) as count')
                ->where('f.RegistrationDate >=', $mondayStart)
                ->where('f.RegistrationDate <=', $sundayEnd)
                ->groupBy('DATE(f.RegistrationDate), DAYNAME(f.RegistrationDate)')
                ->orderBy('DATE(f.RegistrationDate)', 'ASC');

            $this->applyAgencyAndSellerFilters($query, $filters, 'f', 'user_id');

            $byDay = [];
            foreach ($query->get()->getResultArray() as $row) {
                $byDay[$row['day']] = (int) $row['count'];
            }

            $mondayTs = strtotime($mondayDate);
            $weekly   = [];
            for ($i = 0; $i < 7; $i++) {
                $dayDate    = date('Y-m-d', strtotime("+{$i} days", $mondayTs));
                $dayNameEn  = date('l', strtotime($dayDate));
                $weekly[]   = [
                    'day'     => $dayDate,
                    'dayName' => self::DAYS_OF_WEEK_ES[$dayNameEn] ?? $dayNameEn,
                    'count'   => $byDay[$dayDate] ?? 0,
                ];
            }

            return $this->response->setJSON(['success' => true, 'data' => $weekly]);
        } catch (\Throwable $e) {
            return $this->errorResponse($e, 'Error al obtener datos semanales', 'getWeeklyData');
        }
    }

    /**
     * GET /api/analytics/attention-period
     */
    public function getAttentionPeriod()
    {
        try {
            $filters = $this->getFiltersFromRequest();

            $totalQuery = $this->db->table('File f')
                ->where('f.RegistrationDate IS NOT NULL');
            $this->applyAgencyAndSellerFilters($totalQuery, $filters, 'f', 'user_id');
            if ($totalQuery->countAllResults() === 0) {
                return $this->response->setJSON(['success' => true, 'data' => $this->emptyAttentionRanges()]);
            }

            $query = $this->buildAttentionPeriodQuery($filters);
            return $this->response->setJSON([
                'success' => true,
                'data'    => $this->buildAttentionData($query->get()->getResultArray()),
            ]);
        } catch (\Throwable $e) {
            return $this->errorResponse($e, 'Error al obtener datos de período de atención', 'getAttentionPeriod');
        }
    }

    /**
     * GET /api/analytics/current-month-attention
     */
    public function getCurrentMonthAttention()
    {
        try {
            $filters                 = $this->getFiltersFromRequest();
            [$monthStart, $monthEnd] = $this->currentMonthRange();

            $totalQuery = $this->db->table('File f')
                ->where('f.RegistrationDate IS NOT NULL')
                ->where('f.RegistrationDate >=', $monthStart)
                ->where('f.RegistrationDate <=', $monthEnd);
            $this->applyAgencyAndSellerFilters($totalQuery, $filters, 'f', 'user_id');
            if ($totalQuery->countAllResults() === 0) {
                return $this->response->setJSON(['success' => true, 'data' => $this->emptyAttentionRanges()]);
            }

            $query = $this->buildAttentionPeriodQuery($filters, $monthStart, $monthEnd);
            return $this->response->setJSON([
                'success' => true,
                'data'    => $this->buildAttentionData($query->get()->getResultArray()),
            ]);
        } catch (\Throwable $e) {
            return $this->errorResponse($e, 'Error al obtener datos de período de atención del mes actual', 'getCurrentMonthAttention');
        }
    }

    /**
     * GET /api/analytics/current-month-liberated
     */
    public function getCurrentMonthLiberated()
    {
        try {
            $filters                 = $this->getFiltersFromRequest();
            [$monthStart, $monthEnd] = $this->currentMonthRange();

            $query = $this->db->table('File f')
                ->select('COUNT(f.Id) as total')
                ->where('f.RegistrationDate IS NOT NULL')
                ->where('f.RegistrationDate >=', $monthStart)
                ->where('f.RegistrationDate <=', $monthEnd)
                ->whereIn('f.IdCurrentState', FileState::DELIVERED_STATES);

            $this->applyAgencyAndSellerFilters($query, $filters, 'f', 'user_id');

            $total = (int) ($query->get()->getRowArray()['total'] ?? 0);

            return $this->response->setJSON([
                'success' => true,
                'data'    => [
                    'total' => $total,
                    'month' => self::MONTH_NAMES_ES[(int) date('n')],
                    'year'  => (int) date('Y'),
                ],
            ]);
        } catch (\Throwable $e) {
            return $this->errorResponse($e, 'Error al obtener datos de expedientes liberados del mes actual', 'getCurrentMonthLiberated');
        }
    }

    /**
     * GET /api/analytics/total-liberated
     *
     * Cuenta únicamente FileState::RELEASED (4). El código anterior usaba
     * `fs.Name = 'Liberado'` con JOIN; esto preserva esa semántica sin JOIN.
     */
    public function getTotalLiberated()
    {
        try {
            $filters = $this->getFiltersFromRequest();

            $query = $this->db->table('File f')
                ->select('COUNT(f.Id) as total')
                ->where('f.RegistrationDate IS NOT NULL')
                ->where('f.IdCurrentState', FileState::RELEASED);

            $this->applyAgencyAndSellerFilters($query, $filters, 'f', 'user_id');

            $total = (int) ($query->get()->getRowArray()['total'] ?? 0);
            return $this->response->setJSON(['success' => true, 'data' => ['total' => $total]]);
        } catch (\Throwable $e) {
            return $this->errorResponse($e, 'Error al obtener datos de expedientes liberados totales', 'getTotalLiberated');
        }
    }

    /**
     * GET /api/analytics/orders-by-attention-period
     */
    public function getOrdersByAttentionPeriod()
    {
        try {
            $filters        = $this->getFiltersFromRequest();
            $range          = $filters['range'] ?? null;
            $agencyId       = $this->normalizeId($filters['agency_id'] ?? null);
            $sellerId       = $this->normalizeId($filters['user_id'] ?? null);
            $currentMonth   = ($filters['current_month'] ?? null) === 'true';
            $liberatedOnly  = ($filters['liberated_only'] ?? null) === 'true';

            if (!$range) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El parámetro range es requerido',
                ])->setStatusCode(400);
            }

            $dayCondition = $this->attentionRangeCondition($range);
            if ($dayCondition === null) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Rango de días no válido',
                ])->setStatusCode(400);
            }

            $limit  = max(1, min(self::ORDERS_MAX_LIMIT, (int) ($this->request->getGet('limit') ?? self::ORDERS_DEFAULT_LIMIT)));
            $offset = max(0, (int) ($this->request->getGet('offset') ?? 0));

            // El JOIN antes era f.IdCurrentState = fs.IdClient (typo). Es fs.Id.
            $sql = "
                SELECT
                    f.Id as idFile,
                    MIN(ctr.IdTotalDealer) as ndCliente,
                    f.IdOrder as ndPedido,
                    TRIM(CONCAT(COALESCE(c.Name, ''), ' ', COALESCE(c.LastName, ''), ' ', COALESCE(c.MotherLastName, ''))) as cliente,
                    p.Name as proceso,
                    ot.Name as operacion,
                    fs.Name as fase,
                    f.RegistrationDate as fechaAtencion,
                    f.CloseDate as fechaCierre,
                    DATEDIFF(COALESCE(f.CloseDate, CURDATE()), f.RegistrationDate) as diasAtencion,
                    fs.Name as estado
                FROM File f
                INNER JOIN File_Status fs ON f.IdCurrentState = fs.Id
                INNER JOIN HeaderClient hc ON hc.IdClient = f.IdClient
                INNER JOIN Client c ON hc.IdClient = c.Id
                INNER JOIN Process p ON f.IdProcess = p.Id
                INNER JOIN OperationType ot ON f.IdOperation = ot.Id
                INNER JOIN Client_Total_Relation ctr ON hc.Id = ctr.idHeaderClient
                WHERE f.RegistrationDate IS NOT NULL
                  AND COALESCE(f.CloseDate, CURDATE()) >= f.RegistrationDate
                  AND {$dayCondition}
                  AND p.Enabled = 1
                  AND ((c.Name IS NOT NULL AND c.Name != '')
                       OR (c.LastName IS NOT NULL AND c.LastName != '')
                       OR (c.MotherLastName IS NOT NULL AND c.MotherLastName != ''))
            ";

            $params = [];

            if ($currentMonth) {
                [$monthStart, $monthEnd] = $this->currentMonthRange();
                $sql .= ' AND f.RegistrationDate >= ? AND f.RegistrationDate <= ?';
                $params[] = $monthStart;
                $params[] = $monthEnd;
            }

            $sql .= $liberatedOnly
                ? " AND fs.Name = 'Liberado'"
                : " AND fs.Name != 'Liberado'";

            if ($agencyId !== null) {
                $sql .= ' AND f.IdAgency = ?';
                $params[] = $agencyId;
            }
            if ($sellerId !== null) {
                $sql .= ' AND f.idSeller = ?';
                $params[] = $sellerId;
            }

            $sql .= ' GROUP BY f.Id ORDER BY f.CloseDate DESC LIMIT ? OFFSET ?';
            $params[] = $limit;
            $params[] = $offset;

            $results = $this->db->query($sql, $params)->getResultArray();

            return $this->response->setJSON([
                'success'    => true,
                'data'       => $results,
                'pagination' => [
                    'limit'  => $limit,
                    'offset' => $offset,
                    'count'  => count($results),
                ],
            ]);
        } catch (\Throwable $e) {
            return $this->errorResponse($e, 'Error al obtener pedidos por período de atención', 'getOrdersByAttentionPeriod');
        }
    }

    /**
     * GET /api/analytics/export
     *
     * Pendiente de implementación real. Las versiones anteriores devolvían
     * cadenas placeholder con headers de PDF/Excel, lo que confundía al cliente.
     */
    public function exportAnalytics()
    {
        return $this->response->setJSON([
            'success' => false,
            'message' => 'Exportación no implementada. Pendiente de integración con TCPDF/DomPDF y PhpSpreadsheet.',
        ])->setStatusCode(501);
    }

    // =================================================================
    // Lógica privada (devuelve arrays para reuso desde getDashboardData)
    // =================================================================

    private function fetchUserActivityStats(array $filters): array
    {
        try {
            return $this->userActivityLogModel->getLogStats(
                $filters['user_id']    ?? null,
                $filters['start_date'] ?? null,
                $filters['end_date']   ?? null,
            ) ?: [];
        } catch (\Throwable $e) {
            log_message('error', 'Analytics::fetchUserActivityStats: ' . $e->getMessage());
            return [];
        }
    }

    private function fetchDocumentStats(array $filters): array
    {
        $builder = $this->documentModel->builder();

        if (!empty($filters['start_date'])) {
            $builder->where('RegistrationDate >=', $filters['start_date']);
        }
        if (!empty($filters['end_date'])) {
            $builder->where('RegistrationDate <=', $filters['end_date']);
        }
        $agencyId = $this->normalizeId($filters['agency_id'] ?? null);
        if ($agencyId !== null) {
            $builder->join('File f', 'f.Id = DocumentByFile.IdFile')
                    ->where('f.IdAgency', $agencyId);
        }
        if (!empty($filters['document_type_id'])) {
            $builder->where('IdDocumentType', $filters['document_type_id']);
        }

        $totalDocuments = $builder->countAllResults(false);

        $documentsByType = $this->documentModel->builder()
            ->select('dt.Name as type, COUNT(*) as count')
            ->join('DocumentType dt', 'dt.Id = DocumentByFile.IdDocumentType')
            ->groupBy('dt.Name')
            ->get()->getResultArray();

        $documentsByStatus = $this->documentModel->builder()
            ->select('IdCurrentStatus as status, COUNT(*) as count')
            ->groupBy('IdCurrentStatus')
            ->get()->getResultArray();

        $documentsByAgency = $this->documentModel->builder()
            ->select('a.Name as agency, COUNT(*) as count')
            ->join('File f', 'f.Id = DocumentByFile.IdFile')
            ->join('Agency a', 'a.Id = f.IdAgency')
            ->groupBy('a.Name')
            ->orderBy('count', 'DESC')
            ->limit(10)
            ->get()->getResultArray();

        $monthlyTrend = $this->documentModel->builder()
            ->select("DATE_FORMAT(RegistrationDate, '%Y-%m') as month, COUNT(*) as count")
            ->where('RegistrationDate >=', date('Y-m-01', strtotime('-12 months')))
            ->groupBy('month')
            ->orderBy('month', 'ASC')
            ->get()->getResultArray();

        return [
            'totalDocuments'    => $totalDocuments,
            'documentsByType'   => $documentsByType,
            'documentsByStatus' => $documentsByStatus,
            'documentsByAgency' => $documentsByAgency,
            'monthlyTrend'      => $monthlyTrend,
        ];
    }

    private function fetchProcessStats(array $filters): array
    {
        $agencyId       = $this->normalizeId($filters['agency_id'] ?? null);
        $hasAgencyScope = $agencyId !== null;

        $configureBase = function ($builder, string $cpAlias) use ($hasAgencyScope, $agencyId, $filters) {
            if ($hasAgencyScope) {
                $builder->distinct()
                    ->join("ConfigurationProcess {$cpAlias}", "{$cpAlias}.IdProcess = Process.Id", 'inner')
                    ->where("{$cpAlias}.IdAgency", $agencyId)
                    ->where("{$cpAlias}.Enabled", 1);
            }
            if (!empty($filters['start_date'])) {
                $builder->where('Process.RegistrationDate >=', $filters['start_date']);
            }
            if (!empty($filters['end_date'])) {
                $builder->where('Process.RegistrationDate <=', $filters['end_date']);
            }
        };

        $totalBuilder = $this->db->table('Process');
        if ($hasAgencyScope) {
            $totalBuilder->select('Process.*');
        }
        $configureBase($totalBuilder, 'cp1');
        $totalProcesses = $totalBuilder->countAllResults(false);

        $statusBuilder = $this->db->table('Process');
        if ($hasAgencyScope) {
            $statusBuilder->select('Process.Enabled as status, COUNT(DISTINCT Process.Id) as count');
        } else {
            $statusBuilder->select('Process.Enabled as status, COUNT(*) as count');
        }
        $configureBase($statusBuilder, 'cp2');
        $statusBuilder->groupBy('Process.Enabled');
        $processesByStatus = array_values($statusBuilder->get()->getResultArray());

        $trendBuilder = $this->db->table('Process');
        if ($hasAgencyScope) {
            $trendBuilder->select("DATE_FORMAT(Process.RegistrationDate, '%Y-%m') as month, COUNT(DISTINCT Process.Id) as count");
        } else {
            $trendBuilder->select("DATE_FORMAT(Process.RegistrationDate, '%Y-%m') as month, COUNT(*) as count");
        }
        $trendBuilder->where('Process.RegistrationDate >=', date('Y-m-01', strtotime('-12 months')));
        $configureBase($trendBuilder, 'cp3');
        $trendBuilder->groupBy('month')->orderBy('month', 'ASC');
        $monthlyTrend = array_values($trendBuilder->get()->getResultArray());

        return [
            'totalProcesses'        => $totalProcesses,
            'processesByStatus'     => $processesByStatus,
            'processesByAgency'     => [],   // Sin relación directa Process→Agency en el schema actual.
            'averageProcessingTime' => null, // Requiere campos de inicio/fin que aún no se modelan.
            'monthlyTrend'          => $monthlyTrend,
        ];
    }

    private function fetchAgencyStats(): array
    {
        $totalAgencies  = $this->agencyModel->countAllResults();
        $activeAgencies = $this->agencyModel->where('Enabled', 1)->countAllResults();

        $agenciesByStatus = $this->agencyModel->builder()
            ->select('Enabled as status, COUNT(*) as count')
            ->groupBy('Enabled')
            ->get()->getResultArray();

        $topAgencies = $this->agencyModel->builder()
            ->select('Name as agency, Id as id')
            ->orderBy('Name', 'ASC')
            ->limit(10)
            ->get()->getResultArray();

        return [
            'totalAgencies'    => $totalAgencies,
            'activeAgencies'   => $activeAgencies,
            'agenciesByStatus' => $agenciesByStatus,
            'topAgencies'      => $topAgencies,
        ];
    }

    private function fetchSystemMetrics(): array
    {
        return [
            'totalUsers'          => $this->userModel->countAllResults(),
            'activeUsers'         => $this->userModel->where('Enabled', 1)->countAllResults(),
            'totalDocuments'      => $this->documentModel->countAllResults(),
            'totalProcesses'      => $this->processModel->countAllResults(),
            'totalAgencies'       => $this->agencyModel->countAllResults(),
            // Requieren integración con monitoreo (Grafana/Prometheus/logs). Antes
            // se devolvían constantes inventadas (99.9 / 150) que el FE pisaba.
            'systemUptime'        => null,
            'averageResponseTime' => null,
        ];
    }

    private function computeAgencyMetrics(?int $agencyId): array
    {
        $today      = date('Y-m-d');
        $todayStart = $today . ' 00:00:00';
        $todayEnd   = $today . ' 23:59:59';
        [$monthStart, $monthEnd] = $this->currentMonthRange();

        $query = $this->db->table('File')
            ->select(sprintf(
                'SUM(CASE WHEN RegistrationDate >= %s AND RegistrationDate <= %s THEN 1 ELSE 0 END) AS todayCases,
                 SUM(CASE WHEN RegistrationDate >= %s AND RegistrationDate <= %s THEN 1 ELSE 0 END) AS monthlyCases,
                 COUNT(*) AS totalCases',
                $this->db->escape($todayStart),
                $this->db->escape($todayEnd),
                $this->db->escape($monthStart),
                $this->db->escape($monthEnd),
            ), false);

        if ($agencyId !== null) {
            $query->where('IdAgency', $agencyId);
        }
        $fileMetrics = $query->get()->getRowArray();

        $usersQuery = $this->db->table('Agency_User');
        if ($agencyId !== null) {
            $usersQuery->where('IdAgency', $agencyId);
        }
        $totalUsers = $usersQuery->countAllResults();

        $monthlyCases = (int) ($fileMetrics['monthlyCases'] ?? 0);

        return [
            'todayCases'          => (int) ($fileMetrics['todayCases'] ?? 0),
            'monthlyCases'        => $monthlyCases,
            'totalCases'          => (int) ($fileMetrics['totalCases'] ?? 0),
            'totalUsers'          => $totalUsers,
            'monthlyAgencyCases'  => $monthlyCases,
            'monthlyName'         => self::MONTH_NAMES_ES[(int) date('n')],
        ];
    }

    private function computeDistributionMetrics(?int $agencyId): array
    {
        [$monthStart, $monthEnd] = $this->currentMonthRange();

        $deliveredList = implode(',', FileState::DELIVERED_STATES);
        $inProcessList = implode(',', FileState::IN_PROCESS_STATES);

        $query = $this->db->table('File')
            ->select(
                "SUM(CASE WHEN IdCurrentState IN ($deliveredList) THEN 1 ELSE 0 END) AS entregados,
                 SUM(CASE WHEN IdCurrentState = " . FileState::CANCELED . " THEN 1 ELSE 0 END) AS canceladas,
                 SUM(CASE WHEN IdCurrentState IN ($inProcessList) THEN 1 ELSE 0 END) AS proceso",
                false
            )
            ->where('RegistrationDate >=', $monthStart)
            ->where('RegistrationDate <=', $monthEnd);

        if ($agencyId !== null) {
            $query->where('IdAgency', $agencyId);
        }

        $row = $query->get()->getRowArray() ?: [];
        $entregados = (int) ($row['entregados'] ?? 0);
        $canceladas = (int) ($row['canceladas'] ?? 0);
        $proceso    = (int) ($row['proceso'] ?? 0);
        $total      = $entregados + $canceladas + $proceso;

        $pct = fn(int $n) => $total > 0 ? round(($n / $total) * 100, 1) : 0;

        return [
            'entregados' => ['total' => $entregados, 'porcentaje' => $pct($entregados)],
            'canceladas' => ['total' => $canceladas, 'porcentaje' => $pct($canceladas)],
            'proceso'    => ['total' => $proceso,    'porcentaje' => $pct($proceso)],
            'total'      => $total,
            'month'      => date('F'),
            'year'       => (int) date('Y'),
            'agency_id'  => $agencyId,
        ];
    }

    // =================================================================
    // Helpers compartidos
    // =================================================================

    private function getFiltersFromRequest(): array
    {
        return [
            'start_date'                => $this->request->getGet('start_date'),
            'end_date'                  => $this->request->getGet('end_date'),
            'user_id'                   => $this->request->getGet('user_id'),
            'idSeller'                  => $this->request->getGet('idSeller'),
            'agency_id'                 => $this->request->getGet('agency_id'),
            'process_id'                => $this->request->getGet('process_id'),
            'document_type_id'          => $this->request->getGet('document_type_id'),
            'year'                      => $this->request->getGet('year'),
            'range'                     => $this->request->getGet('range'),
            'current_month'             => $this->request->getGet('current_month'),
            'liberated_only'            => $this->request->getGet('liberated_only'),
            'months_to_show'            => $this->request->getGet('months_to_show'),
            'registration_start_date'   => $this->request->getGet('registration_start_date'),
            'registration_end_date'     => $this->request->getGet('registration_end_date'),
            'liberation_start_date'     => $this->request->getGet('liberation_start_date'),
            'liberation_end_date'       => $this->request->getGet('liberation_end_date'),
        ];
    }

    /**
     * Aplica filtros agencia/vendedor a un query builder. $sellerKey indica
     * de qué clave del array $filters leer el id (algunos endpoints usan
     * 'idSeller', otros 'user_id'). Pasa null para no aplicar filtro de vendedor.
     */
    private function applyAgencyAndSellerFilters($query, array $filters, string $alias, ?string $sellerKey): void
    {
        $agencyId = $this->normalizeId($filters['agency_id'] ?? null);
        if ($agencyId !== null) {
            $query->where("{$alias}.IdAgency", $agencyId);
        }
        if ($sellerKey !== null) {
            $sellerId = $this->normalizeId($filters[$sellerKey] ?? null);
            if ($sellerId !== null) {
                $query->where("{$alias}.idSeller", $sellerId);
            }
        }
    }

    /**
     * Convierte un valor proveniente de query string en int o null,
     * manejando los casos 'null', 'undefined', vacío y no numérico.
     */
    private function normalizeId($value): ?int
    {
        if (empty($value) || $value === 'null' || $value === 'undefined') {
            return null;
        }
        if (!is_numeric($value)) {
            return null;
        }
        return (int) $value;
    }

    /**
     * @return array{0:string,1:string} [monthStart, monthEnd]
     */
    private function monthRange(int $year, int $month): array
    {
        $monthStart = sprintf('%04d-%02d-01 00:00:00', $year, $month);
        $monthEnd   = date('Y-m-t 23:59:59', strtotime($monthStart));
        return [$monthStart, $monthEnd];
    }

    private function currentMonthRange(): array
    {
        return $this->monthRange((int) date('Y'), (int) date('n'));
    }

    private function buildStatusDistribution(array $rows): array
    {
        $total = array_sum(array_column($rows, 'totalCases'));
        $out   = [];
        foreach ($rows as $row) {
            $cases      = (int) $row['totalCases'];
            $percentage = $total > 0 ? round(($cases / $total) * 100, 1) : 0;
            $out[]      = [
                'statusName' => $row['statusName'] ?: 'Sin Estatus',
                'totalCases' => $cases,
                'percentage' => $percentage,
            ];
        }
        return $out;
    }

    private function emptyAttentionRanges(): array
    {
        $out = [];
        foreach (self::ATTENTION_RANGES as $r) {
            $out[] = [
                'range' => $r['range'],
                'label' => $r['label'],
                'count' => 0,
                'color' => $r['color'],
            ];
        }
        return $out;
    }

    private function buildAttentionData(array $rows): array
    {
        $byRange = [];
        foreach ($rows as $row) {
            $byRange[$row['period_range']] = (int) $row['count'];
        }
        $out = [];
        foreach (self::ATTENTION_RANGES as $r) {
            $out[] = [
                'range' => $r['range'],
                'label' => $r['label'],
                'count' => $byRange[$r['range']] ?? 0,
                'color' => $r['color'],
            ];
        }
        return $out;
    }

    private function buildAttentionPeriodQuery(array $filters, ?string $monthStart = null, ?string $monthEnd = null)
    {
        $deliveredList = implode(',', FileState::DELIVERED_STATES);

        $query = $this->db->table('File f')
            ->join('Process p', 'f.IdProcess = p.Id', 'inner')
            ->select('
                CASE
                    WHEN DATEDIFF(COALESCE(f.CloseDate, CURDATE()), f.RegistrationDate) <= 5 THEN "0-5"
                    WHEN DATEDIFF(COALESCE(f.CloseDate, CURDATE()), f.RegistrationDate) <= 10 THEN "5-10"
                    WHEN DATEDIFF(COALESCE(f.CloseDate, CURDATE()), f.RegistrationDate) <= 15 THEN "10-15"
                    ELSE "15+"
                END as period_range,
                CASE
                    WHEN DATEDIFF(COALESCE(f.CloseDate, CURDATE()), f.RegistrationDate) <= 5 THEN "0 - 5 Días"
                    WHEN DATEDIFF(COALESCE(f.CloseDate, CURDATE()), f.RegistrationDate) <= 10 THEN "5 - 10 Días"
                    WHEN DATEDIFF(COALESCE(f.CloseDate, CURDATE()), f.RegistrationDate) <= 15 THEN "10 - 15 Días"
                    ELSE "> 15 Días"
                END as period_label,
                COUNT(f.Id) as count
            ', false)
            ->where('f.RegistrationDate IS NOT NULL')
            ->where('COALESCE(f.CloseDate, CURDATE()) >= f.RegistrationDate')
            ->whereNotIn('f.IdCurrentState', FileState::DELIVERED_STATES)
            ->where('p.Enabled', 1)
            ->groupBy('period_range, period_label')
            ->orderBy('period_range', 'ASC');

        if ($monthStart !== null && $monthEnd !== null) {
            $query->where('f.RegistrationDate >=', $monthStart)
                  ->where('f.RegistrationDate <=', $monthEnd);
        }

        $this->applyAgencyAndSellerFilters($query, $filters, 'f', 'user_id');

        return $query;
    }

    private function attentionRangeCondition(string $range): ?string
    {
        switch ($range) {
            case '0-5':
                return 'DATEDIFF(COALESCE(f.CloseDate, CURDATE()), f.RegistrationDate) <= 5';
            case '5-10':
                return 'DATEDIFF(COALESCE(f.CloseDate, CURDATE()), f.RegistrationDate) > 5 AND DATEDIFF(COALESCE(f.CloseDate, CURDATE()), f.RegistrationDate) <= 10';
            case '10-15':
                return 'DATEDIFF(COALESCE(f.CloseDate, CURDATE()), f.RegistrationDate) > 10 AND DATEDIFF(COALESCE(f.CloseDate, CURDATE()), f.RegistrationDate) <= 15';
            case '15+':
                return 'DATEDIFF(COALESCE(f.CloseDate, CURDATE()), f.RegistrationDate) > 15';
            default:
                return null;
        }
    }

    private function errorResponse(\Throwable $e, string $message, string $context): ResponseInterface
    {
        log_message('error', "Analytics::{$context}: " . $e->getMessage());
        log_message('error', 'Trace: ' . $e->getTraceAsString());
        return $this->response->setJSON([
            'success' => false,
            'message' => $message,
        ])->setStatusCode(500);
    }
}
