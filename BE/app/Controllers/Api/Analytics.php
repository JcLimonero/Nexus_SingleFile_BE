<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\DocumentModel;
use App\Models\ProcessModel;
use App\Models\AgencyModel;
use App\Models\UserModel;
use App\Models\UserActivityLogModel;
use CodeIgniter\HTTP\ResponseInterface;

class Analytics extends BaseController
{
    protected $documentModel;
    protected $processModel;
    protected $agencyModel;
    protected $userModel;
    protected $userActivityLogModel;
    private static $cache = []; // Cache estático para la sesión

    public function __construct()
    {
        $this->documentModel = new DocumentModel();
        $this->processModel = new ProcessModel();
        $this->agencyModel = new AgencyModel();
        $this->userModel = new UserModel();
        $this->userActivityLogModel = new UserActivityLogModel();
    }
    
    /**
     * Obtener datos del cache o ejecutar función
     */
    private function getCached($key, $callback, $ttl = 60)
    {
        // Verificar si existe en cache y no ha expirado
        if (isset(self::$cache[$key]) && (time() - self::$cache[$key]['time']) < $ttl) {
            error_log("✅ Cache HIT para: {$key}");
            return self::$cache[$key]['data'];
        }
        
        // No está en cache o expiró, ejecutar callback
        error_log("❌ Cache MISS para: {$key}, ejecutando query...");
        $data = $callback();
        
        // Guardar en cache
        self::$cache[$key] = [
            'data' => $data,
            'time' => time()
        ];
        
        return $data;
    }

    /**
     * GET /api/analytics/dashboard
     * Obtener datos completos del dashboard de analytics
     * Cache: 60 segundos para reducir carga en la BD
     */
    public function getDashboardData()
    {
        try {
            $filters = $this->getFiltersFromRequest();
            $cacheKey = 'analytics_dashboard_' . md5(json_encode($filters));

            $data = cache()->get($cacheKey);
            if ($data !== null) {
                return $this->response->setJSON([
                    'success' => true,
                    'data' => $data,
                    'cached' => true
                ]);
            }

            $data = [
                'userActivity' => $this->getUserActivityStats($filters),
                'documents' => $this->getDocumentStatsData($filters),
                'processes' => $this->getProcessStatsData($filters),
                'agencies' => $this->getAgencyStatsData($filters),
                'system' => $this->getSystemMetricsData($filters)
            ];

            cache()->save($cacheKey, $data, 60);

            return $this->response->setJSON([
                'success' => true,
                'data' => $data
            ]);

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener datos del dashboard',
                'error' => $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/analytics/widget-document-statistics
     * Obtener estadísticas de documentos (cache 30s)
     */
    public function getDocumentStats()
    {
        try {
            $filters = $this->getFiltersFromRequest();
            $cacheKey = 'analytics_docs_' . md5(json_encode($filters));
            $data = cache()->get($cacheKey);
            if ($data === null) {
                $data = $this->getDocumentStatsData($filters);
                cache()->save($cacheKey, $data, 30);
            }
            return $this->response->setJSON(['success' => true, 'data' => $data]);
        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ])->setStatusCode(500);
        }
    }

    /**
     * Obtener datos de estadísticas de documentos (para dashboard y widget)
     * Aplica filtros a todas las subconsultas para consistencia
     */
    private function getDocumentStatsData(array $filters): array
    {
        $db = \Config\Database::connect();

        $applyFilters = function ($builder) use ($filters) {
            if (!empty($filters['start_date'])) {
                $builder->where('d.registration_date >=', $filters['start_date']);
            }
            if (!empty($filters['end_date'])) {
                $builder->where('d.registration_date <=', $filters['end_date']);
            }
            if (!empty($filters['agency_id'])) {
                $builder->join('expedient f', '`f`.`id` = `d`.`id_expedient`', 'inner', false)
                    ->where('f.id_agency', $filters['agency_id']);
            }
            if (!empty($filters['document_type_id'])) {
                $builder->where('d.id_document_type', $filters['document_type_id']);
            }
            return $builder;
        };

        $builder = $applyFilters($db->table('expedient_document d'));
        $totalDocuments = $builder->countAllResults(false);

        $builder = $applyFilters($db->table('expedient_document d'));
        $documentsByType = $builder->select('dt.name as type, COUNT(*) as count')
            ->join('document_type dt', '`dt`.`id` = `d`.`id_document_type`', 'left', false)
            ->groupBy('dt.name')
            ->get()->getResultArray();

        $builder = $applyFilters($db->table('expedient_document d'));
        $documentsByStatus = $builder->select('d.id_current_document_status as status, COUNT(*) as count')
            ->groupBy('d.id_current_document_status')
            ->get()->getResultArray();

        $builder = $db->table('expedient_document d')
            ->join('expedient f', '`f`.`id` = `d`.`id_expedient`', 'inner', false)
            ->join('agency a', '`a`.`id` = `f`.`id_agency`', 'inner', false);
        if (!empty($filters['start_date'])) $builder->where('d.registration_date >=', $filters['start_date']);
        if (!empty($filters['end_date'])) $builder->where('d.registration_date <=', $filters['end_date']);
        if (!empty($filters['agency_id'])) $builder->where('f.id_agency', $filters['agency_id']);
        if (!empty($filters['document_type_id'])) $builder->where('d.id_document_type', $filters['document_type_id']);
        $documentsByAgency = $builder->select('a.name as agency, COUNT(*) as count')
            ->groupBy('a.name')
            ->orderBy('count', 'DESC')
            ->limit(10)
            ->get()->getResultArray();

        $builder = $applyFilters($db->table('expedient_document d'));
        $builder->where('d.registration_date >=', date('Y-m-01', strtotime('-12 months')));
        $monthlyTrend = $builder->select("DATE_FORMAT(d.registration_date, '%Y-%m') as month, COUNT(*) as count")
            ->groupBy('month')
            ->orderBy('month', 'ASC')
            ->get()->getResultArray();

        return [
            'totalDocuments' => $totalDocuments,
            'documentsByType' => $documentsByType,
            'documentsByStatus' => $documentsByStatus,
            'documentsByAgency' => $documentsByAgency,
            'monthlyTrend' => $monthlyTrend
        ];
    }

    /**
     * GET /api/analytics/widget-process-statistics
     * Obtener estadísticas de procesos
     */
    public function getProcessStats()
    {
        try {
            $filters = $this->getFiltersFromRequest();
            $data = $this->getProcessStatsData($filters);
            return $this->response->setJSON(['success' => true, 'data' => $data]);
        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ])->setStatusCode(500);
        }
    }

    private function getProcessStatsData(array $filters): array
    {
        $hasAgencyFilter = !empty($filters['agency_id']);
        $agencyId = $hasAgencyFilter ? $filters['agency_id'] : null;
        $db = \Config\Database::connect();

        // Construir consulta base para total de procesos
            $totalBuilder = $db->table('sale_type');
            
            // Si hay filtro de agencia, hacer JOIN con configuration_process usando alias único
            if ($hasAgencyFilter) {
                $totalBuilder->distinct()
                    ->select('process.*')
                    ->join('configuration_process cp1', 'cp1.id_sale_type = process.id', 'inner')
                    ->where('cp1.id_agency', $agencyId)
                    ->where('cp1.enabled', 1);
            }
            
            // Aplicar filtros de fecha (snake_case)
            if (!empty($filters['start_date'])) {
                $totalBuilder->where('process.registration_date >=', $filters['start_date']);
            }
            if (!empty($filters['end_date'])) {
                $totalBuilder->where('process.registration_date <=', $filters['end_date']);
            }

            // Estadísticas básicas
            $totalProcesses = $totalBuilder->countAllResults(false);

            // Procesos por estado (snake_case)
            $statusBuilder = $db->table('sale_type');
            if ($hasAgencyFilter) {
                $statusBuilder->distinct()
                    ->select('process.enabled as status, COUNT(DISTINCT process.id) as count')
                    ->join('configuration_process cp2', 'cp2.id_sale_type = process.id', 'inner')
                    ->where('cp2.id_agency', $agencyId)
                    ->where('cp2.enabled', 1);
            } else {
                $statusBuilder->select('process.enabled as status, COUNT(*) as count');
            }
            
            if (!empty($filters['start_date'])) {
                $statusBuilder->where('process.registration_date >=', $filters['start_date']);
            }
            if (!empty($filters['end_date'])) {
                $statusBuilder->where('process.registration_date <=', $filters['end_date']);
            }
            
            $statusBuilder->groupBy('process.enabled');
            $processesByStatus = $statusBuilder->get()->getResultArray();

            // Procesos por agencia (simplificado - la tabla Process no tiene relación directa con agencias)
            $processesByAgency = [];

            // Tiempo promedio de procesamiento (simplificado)
            $averageProcessingTime = 0;

            // Tendencia mensual - usar alias diferente
            $trendBuilder = $db->table('sale_type');
            if ($hasAgencyFilter) {
                $trendBuilder->distinct()
                    ->select("DATE_FORMAT(process.registration_date, '%Y-%m') as month, COUNT(DISTINCT process.id) as count")
                    ->join('configuration_process cp3', 'cp3.id_sale_type = process.id', 'inner')
                    ->where('cp3.id_agency', $agencyId)
                    ->where('cp3.enabled', 1)
                    ->where('process.registration_date >=', date('Y-m-01', strtotime('-12 months')));
            } else {
                $trendBuilder->select("DATE_FORMAT(process.registration_date, '%Y-%m') as month, COUNT(*) as count")
                    ->where('process.registration_date >=', date('Y-m-01', strtotime('-12 months')));
            }
            
            if (!empty($filters['start_date'])) {
                $trendBuilder->where('process.registration_date >=', $filters['start_date']);
            }
            if (!empty($filters['end_date'])) {
                $trendBuilder->where('process.registration_date <=', $filters['end_date']);
            }
            
            $trendBuilder->groupBy('month')
                ->orderBy('month', 'ASC');
            $monthlyTrend = $trendBuilder->get()->getResultArray();

            return [
                'totalProcesses' => $totalProcesses,
                'processesByStatus' => array_values($processesByStatus),
                'processesByAgency' => $processesByAgency,
                'averageProcessingTime' => $averageProcessingTime,
                'monthlyTrend' => array_values($monthlyTrend)
            ];
    }

    /**
     * GET /api/analytics/agencies/stats
     * Obtener estadísticas de agencias
     */
    public function getAgencyStats()
    {
        try {
            $filters = $this->getFiltersFromRequest();
            $data = $this->getAgencyStatsData($filters);
            return $this->response->setJSON(['success' => true, 'data' => $data]);
        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ])->setStatusCode(500);
        }
    }

    private function getAgencyStatsData(array $filters): array
    {
        $totalAgencies = $this->agencyModel->countAllResults();
        $activeAgencies = $this->agencyModel->where('enabled', 1)->countAllResults();
        $agenciesByStatus = $this->agencyModel->builder()
            ->select('enabled as status, COUNT(*) as count')
            ->groupBy('enabled')
            ->get()
            ->getResultArray();
        $topAgencies = $this->agencyModel->builder()
            ->select('name as agency, id as id')
            ->orderBy('name', 'ASC')
            ->limit(10)
            ->get()
            ->getResultArray();
        return [
            'totalAgencies' => $totalAgencies,
            'activeAgencies' => $activeAgencies,
            'agenciesByStatus' => $agenciesByStatus,
            'topAgencies' => $topAgencies
        ];
    }

    /**
     * GET /api/analytics/system/metrics
     * Obtener métricas del sistema (snake_case: enabled)
     */
    public function getSystemMetrics()
    {
        try {
            $data = $this->getSystemMetricsData();
            return $this->response->setJSON(['success' => true, 'data' => $data]);
        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ])->setStatusCode(500);
        }
    }

    private function getSystemMetricsData(): array
    {
        $totalUsers = $this->userModel->countAllResults();
        $activeUsers = $this->userModel->where('enabled', 1)->countAllResults();
        $totalDocuments = $this->documentModel->countAllResults();
        $totalProcesses = $this->processModel->countAllResults();
        $totalAgencies = $this->agencyModel->countAllResults();
        return [
            'totalUsers' => $totalUsers,
            'activeUsers' => $activeUsers,
            'totalDocuments' => $totalDocuments,
            'totalProcesses' => $totalProcesses,
            'totalAgencies' => $totalAgencies,
            'systemUptime' => 99.9,
            'averageResponseTime' => 150
        ];
    }

    /**
     * GET /api/analytics/agency-metrics
     * Obtener métricas específicas de agencia (solo aplica filtro de agencia)
     */
    public function getAgencyMetrics()
    {
        try {
            $filters = $this->getFiltersFromRequest();
            $agencyId = $filters['agency_id'] ?? null;
            $userId = $filters['user_id'] ?? null;
            
            // Crear key de cache basado en filtros
            $cacheKey = 'agency_metrics_' . ($agencyId ?? 'all') . '_user_' . ($userId ?? 'all');
            
            // Usar cache con TTL de 30 segundos
            $data = $this->getCached($cacheKey, function() use ($agencyId, $userId) {
                $db = \Config\Database::connect();
                
                // Configurar zona horaria de Guadalajara (GMT-6)
                
                // Calcular rangos de fechas para usar índices
                $today = date('Y-m-d');
                $todayStart = $today . ' 00:00:00';
                $todayEnd = $today . ' 23:59:59';
                
                $currentYear = date('Y');
                $currentMonth = date('m');
                $monthStart = $currentYear . '-' . $currentMonth . '-01 00:00:00';
                $monthEnd = $currentYear . '-' . $currentMonth . '-' . date('t', strtotime($monthStart)) . ' 23:59:59';
                
                // OPTIMIZACIÓN: Una sola query con agregaciones condicionales
                $query = $db->table('expedient')
                    ->select('
                        SUM(CASE WHEN registration_date >= "' . $todayStart . '" AND registration_date <= "' . $todayEnd . '" THEN 1 ELSE 0 END) as todayCases,
                        SUM(CASE WHEN registration_date >= "' . $monthStart . '" AND registration_date <= "' . $monthEnd . '" THEN 1 ELSE 0 END) as monthlyCases,
                        COUNT(*) as totalCases
                    ', false);
                
                // Aplicar filtro de agencia si existe
                if ($agencyId && $agencyId !== 'null' && $agencyId !== null) {
                    $query->where('id_agency', $agencyId);
                }
                
                $fileMetrics = $query->get()->getRowArray();
                
                // Usuarios únicos que tienen acceso a la agencia seleccionada (DISTINCT para no duplicar si un usuario tiene varias agencias)
                $totalUsersQuery = $db->table('agency_user')->select('COUNT(DISTINCT id_user) as total', false);
                if ($agencyId && $agencyId !== 'null' && $agencyId !== null) {
                    $totalUsersQuery->where('id_agency', $agencyId);
                }
                $totalUsersRow = $totalUsersQuery->get()->getRowArray();
                $totalUsers = (int)($totalUsersRow['total'] ?? 0);

                // Nombre del mes actual
                $monthNames = [
                    1 => 'Enero', 2 => 'Febrero', 3 => 'Marzo', 4 => 'Abril',
                    5 => 'Mayo', 6 => 'Junio', 7 => 'Julio', 8 => 'Agosto',
                    9 => 'Septiembre', 10 => 'Octubre', 11 => 'Noviembre', 12 => 'Diciembre'
                ];
                $monthlyName = $monthNames[date('n')]; // Mes actual

                return [
                    'todayCases' => (int)($fileMetrics['todayCases'] ?? 0),
                    'monthlyCases' => (int)($fileMetrics['monthlyCases'] ?? 0),
                    'totalCases' => (int)($fileMetrics['totalCases'] ?? 0),
                    'totalUsers' => $totalUsers,
                    'monthlyAgencyCases' => (int)($fileMetrics['monthlyCases'] ?? 0), // Es lo mismo que monthlyCases
                    'monthlyName' => $monthlyName
                ];
            }, 30); // Cache por 30 segundos

            return $this->response->setJSON([
                'success' => true,
                'data' => $data
            ]);

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener métricas de agencia',
                'error' => $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/analytics/trend-data
     * Obtener datos de tendencia por mes para un año específico
     */
    public function getTrendData()
    {
        try {
            $filters = $this->getFiltersFromRequest();
            $year = $filters['year'] ?? date('Y');
            $agencyId = $filters['agency_id'] ?? null;
            $idSeller = $filters['idSeller'] ?? null;

            // Configurar zona horaria de Guadalajara (GMT-6)

            $db = \Config\Database::connect();

            // OPTIMIZACIÓN: Una sola query con GROUP BY en lugar de 36 queries
            // Calcular rangos de fechas para el año completo
            $yearStart = $year . '-01-01 00:00:00';
            $yearEnd = $year . '-12-31 23:59:59';
            
            // Inicializar arrays para los 12 meses
            $entregados = array_fill(0, 12, 0);
            $canceladas = array_fill(0, 12, 0);
            $proceso = array_fill(0, 12, 0);
            
            // Query optimizada: una sola consulta con GROUP BY
            $query = $db->table('expedient')
                ->select('
                    MONTH(registration_date) as month,
                    SUM(CASE WHEN id_current_expedient_state IN (4, 6) THEN 1 ELSE 0 END) as entregados,
                    SUM(CASE WHEN id_current_expedient_state = 5 THEN 1 ELSE 0 END) as canceladas,
                    SUM(CASE WHEN id_current_expedient_state IN (1, 2, 3) THEN 1 ELSE 0 END) as proceso
                ', false)
                ->where('registration_date >=', $yearStart)
                ->where('registration_date <=', $yearEnd)
                ->groupBy('MONTH(registration_date)');
            
            if ($agencyId && $agencyId !== 'null' && $agencyId !== null) {
                $query->where('id_agency', $agencyId);
            }
            
            if ($idSeller && $idSeller !== 'null' && $idSeller !== null) {
                $query->where('id_seller', $idSeller);
            }
            
            $results = $query->get()->getResultArray();
            
            // Procesar resultados
            foreach ($results as $row) {
                $monthIndex = (int)$row['month'] - 1; // Convertir a índice 0-11
                $entregados[$monthIndex] = (int)$row['entregados'];
                $canceladas[$monthIndex] = (int)$row['canceladas'];
                $proceso[$monthIndex] = (int)$row['proceso'];
            }

            $data = [
                'entregados' => $entregados,
                'canceladas' => $canceladas,
                'proceso' => $proceso,
                'year' => $year,
                'agency_id' => $agencyId
            ];

            return $this->response->setJSON(['success' => true, 'data' => $data]);

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener datos de tendencia',
                'error' => $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/analytics/distribution-metrics
     * Obtener métricas de distribución de expedientes del mes actual
     */
    public function getDistributionMetrics()
    {
        try {
            $filters = $this->getFiltersFromRequest();
            $agencyId = $filters['agency_id'] ?? null;
            
            // Crear key de cache
            $cacheKey = 'distribution_metrics_' . ($agencyId ?? 'all');
            
            // Usar cache con TTL de 30 segundos
            $data = $this->getCached($cacheKey, function() use ($agencyId) {
                // Configurar zona horaria de Guadalajara (GMT-6)

                $db = \Config\Database::connect();

            // OPTIMIZACIÓN: Una sola query con agregaciones condicionales
            $monthStart = date('Y-m-01 00:00:00');
            $monthEnd = date('Y-m-t 23:59:59');
            $query = $db->table('expedient')
                ->select('
                    SUM(CASE WHEN id_current_expedient_state IN (4, 6) THEN 1 ELSE 0 END) as entregados,
                    SUM(CASE WHEN id_current_expedient_state = 5 THEN 1 ELSE 0 END) as canceladas,
                    SUM(CASE WHEN id_current_expedient_state IN (1, 2, 3) THEN 1 ELSE 0 END) as proceso
                ', false)
                ->where('registration_date >=', $monthStart)
                ->where('registration_date <=', $monthEnd);

            if ($agencyId && $agencyId !== 'null' && $agencyId !== null) {
                $query->where('id_agency', $agencyId);
            }

            $row = $query->get()->getRowArray();
            $entregados = (int)($row['entregados'] ?? 0);
            $canceladas = (int)($row['canceladas'] ?? 0);
            $proceso = (int)($row['proceso'] ?? 0);

            // Total de expedientes del mes
            $total = $entregados + $canceladas + $proceso;

            // Calcular porcentajes
            $entregadosPorcentaje = $total > 0 ? round(($entregados / $total) * 100, 1) : 0;
            $canceladasPorcentaje = $total > 0 ? round(($canceladas / $total) * 100, 1) : 0;
            $procesoPorcentaje = $total > 0 ? round(($proceso / $total) * 100, 1) : 0;

                return [
                    'entregados' => [
                        'total' => $entregados,
                        'porcentaje' => $entregadosPorcentaje
                    ],
                    'canceladas' => [
                        'total' => $canceladas,
                        'porcentaje' => $canceladasPorcentaje
                    ],
                    'proceso' => [
                        'total' => $proceso,
                        'porcentaje' => $procesoPorcentaje
                    ],
                    'total' => $total,
                    'month' => date('F'),
                    'year' => date('Y'),
                    'agency_id' => $agencyId
                ];
            }, 30); // Cache por 30 segundos

            return $this->response->setJSON(['success' => true, 'data' => $data]);

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener métricas de distribución',
                'error' => $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/analytics/debug-file-state
     * Endpoint de debug para verificar los estados de los archivos
     */
    public function debugFileState()
    {
        try {
            $db = \Config\Database::connect();

            // Verificar si existe la tabla expedient_state
            $fileStatusExists = $db->tableExists('expedient_state');

            $data = [
                'file_status_table_exists' => $fileStatusExists
            ];

            if ($fileStatusExists) {
                // Obtener todos los estados disponibles
                $statuses = $db->table('expedient_state')->get()->getResultArray();
                $data['file_states'] = $statuses;
            }

            // Obtener distribución de estados en la tabla File
            $currentStates = $db->table('expedient')
                ->select('id_current_expedient_state, COUNT(*) as count')
                ->groupBy('id_current_expedient_state')
                ->orderBy('count', 'DESC')
                ->get()
                ->getResultArray();

            $data['current_states_distribution'] = $currentStates;

            // Obtener algunos ejemplos de archivos con diferentes estados
            $sampleFiles = $db->table('expedient')
                ->select('id, id_current_expedient_state, registration_date, close_date')
                ->limit(10)
                ->get()
                ->getResultArray();

            $data['sample_files'] = $sampleFiles;

            return $this->response->setJSON(['success' => true, 'data' => $data]);

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener información de estados',
                'error' => $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/analytics/debug-trend-january-2025
     * Endpoint de debug específico para enero 2025
     */
    public function debugTrendJanuary2025()
    {
        try {
            $db = \Config\Database::connect();
            
            // Configurar zona horaria de Guadalajara (GMT-6)

            // Consulta base para enero 2025
            $baseQuery = $db->table('expedient')
                ->where('YEAR(registration_date)', 2025)
                ->where('MONTH(registration_date)', 1);

            // Total de archivos en enero 2025
            $totalFiles = $baseQuery->countAllResults();

            // Expedientes entregados (estados 4 "Liberado" y 6 "Liberado por Excepción")
            $entregadosQuery = clone $baseQuery;
            $entregados = $entregadosQuery->whereIn('id_current_expedient_state', [4, 6])->countAllResults();

            // Expedientes cancelados (estado 5 "Cancelado")
            $canceladasQuery = clone $baseQuery;
            $canceladas = $canceladasQuery->where('id_current_expedient_state', 5)->countAllResults();

            // Expedientes en proceso (estados 1 "Integración", 2 "Liquidación", 3 "Liberación")
            $procesoQuery = clone $baseQuery;
            $proceso = $procesoQuery->whereIn('id_current_expedient_state', [1, 2, 3])->countAllResults();

            // Distribución por estado
            $distributionByState = $db->table('expedient')
                ->select('id_current_expedient_state, COUNT(*) as count')
                ->where('YEAR(registration_date)', 2025)
                ->where('MONTH(registration_date)', 1)
                ->groupBy('id_current_expedient_state')
                ->orderBy('count', 'DESC')
                ->get()
                ->getResultArray();

            // Algunos ejemplos de archivos de enero 2025
            $sampleFiles = $db->table('expedient')
                ->select('id, id_current_expedient_state, registration_date, close_date')
                ->where('YEAR(registration_date)', 2025)
                ->where('MONTH(registration_date)', 1)
                ->limit(10)
                ->get()
                ->getResultArray();

            $data = [
                'total_files_january_2025' => $totalFiles,
                'entregados' => $entregados,
                'canceladas' => $canceladas,
                'proceso' => $proceso,
                'distribution_by_state' => $distributionByState,
                'sample_files' => $sampleFiles
            ];

            return $this->response->setJSON(['success' => true, 'data' => $data]);

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener información de enero 2025',
                'error' => $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/analytics/debug-sql-queries
     * Endpoint para mostrar las consultas SQL exactas
     */
    public function debugSqlQueries()
    {
        try {
            $db = \Config\Database::connect();
            
            // Configurar zona horaria de Guadalajara (GMT-6)

            // Consulta para expedientes entregados en enero 2025
            $entregados = $db->table('expedient')
                ->where('YEAR(registration_date)', 2025)
                ->where('MONTH(registration_date)', 1)
                ->whereIn('id_current_expedient_state', [4, 6])
                ->countAllResults();

            // Consulta para distribución por estado
            $distributionByState = $db->table('expedient')
                ->select('id_current_expedient_state, COUNT(*) as count')
                ->where('YEAR(registration_date)', 2025)
                ->where('MONTH(registration_date)', 1)
                ->groupBy('id_current_expedient_state')
                ->orderBy('count', 'DESC')
                ->get()
                ->getResultArray();

            // Mostrar las consultas SQL manualmente
            $sqlQueries = [
                'entregados_query' => "SELECT COUNT(*) FROM `expedient` WHERE YEAR(registration_date) = 2025 AND MONTH(registration_date) = 1 AND id_current_expedient_state IN (4, 6)",
                'distribution_query' => "SELECT id_current_expedient_state, COUNT(*) as count FROM `expedient` WHERE YEAR(registration_date) = 2025 AND MONTH(registration_date) = 1 GROUP BY id_current_expedient_state ORDER BY count DESC"
            ];

            $data = [
                'entregados_january_2025' => $entregados,
                'distribution_by_state' => $distributionByState,
                'sql_queries' => $sqlQueries
            ];

            return $this->response->setJSON(['success' => true, 'data' => $data]);

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener consultas SQL',
                'error' => $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/analytics/debug-file-structure
     * Endpoint de debug para verificar la estructura de la tabla File
     */
    public function debugFileStructure()
    {
        try {
            $db = \Config\Database::connect();
            
            // Verificar si la tabla File existe
            $tables = $db->listTables();
            $fileTableExists = in_array('expedient', $tables) || in_array('expedient', $tables);
            
            $result = [
                'file_table_exists' => $fileTableExists,
                'available_tables' => $tables,
                'file_table_name' => null,
                'file_table_structure' => null,
                'file_sample_data' => null,
                'file_count' => 0
            ];
            
            if ($fileTableExists) {
                // Determinar el nombre correcto de la tabla
                $tableName = in_array('expedient', $tables) ? 'expedient' : 'expedient';
                $result['file_table_name'] = $tableName;
                
                // Obtener estructura de la tabla
                $result['file_table_structure'] = $db->getFieldNames($tableName);
                
                // Contar registros
                $result['file_count'] = $db->table($tableName)->countAllResults();
                
                // Obtener datos de muestra
                $result['file_sample_data'] = $db->table($tableName)->limit(3)->get()->getResultArray();
            }
            
            return $this->response->setJSON([
                'success' => true,
                'data' => $result
            ]);
            
        } catch (\Exception $e) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al verificar estructura de File',
                'error' => $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/analytics/debug-server-date
     * Endpoint de debug para verificar la fecha del servidor
     */
    public function debugServerDate()
    {
        try {
            // Configurar zona horaria de Guadalajara (GMT-6)
            
            $result = [
                'server_date_Y_m_d' => date('Y-m-d'),
                'server_date_Y' => date('Y'),
                'server_date_m' => date('m'),
                'server_date_d' => date('d'),
                'server_datetime' => date('Y-m-d H:i:s'),
                'server_timezone' => date_default_timezone_get(),
                'php_date_function_test' => [
                    'date_Y_m_d' => date('Y-m-d'),
                    'date_Y' => date('Y'),
                    'date_m' => date('m'),
                    'date_d' => date('d'),
                    'date_n' => date('n'),
                    'date_j' => date('j')
                ]
            ];
            
            return $this->response->setJSON(['success' => true, 'data' => $result]);
            
        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener fecha del servidor',
                'error' => $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/analytics/debug-today-files
     * Endpoint de debug para verificar expedientes del día actual
     */
    public function debugTodayFiles()
    {
        try {
            $db = \Config\Database::connect();
            
            // Verificar expedientes del día actual según el servidor
            $todayServer = date('Y-m-d');
            $todayFiles = $db->table('expedient')
                ->where('DATE(registration_date)', $todayServer)
                ->get()
                ->getResultArray();
            
            // Verificar expedientes del día 6 de septiembre específicamente
            $september6Files = $db->table('expedient')
                ->where('DATE(registration_date)', '2025-09-06')
                ->get()
                ->getResultArray();
            
            // Verificar expedientes del día 7 de septiembre específicamente
            $september7Files = $db->table('expedient')
                ->where('DATE(registration_date)', '2025-09-07')
                ->get()
                ->getResultArray();
            
            $result = [
                'server_date' => $todayServer,
                'today_files_count' => count($todayFiles),
                'today_files' => $todayFiles,
                'september_6_files_count' => count($september6Files),
                'september_6_files' => $september6Files,
                'september_7_files_count' => count($september7Files),
                'september_7_files' => $september7Files,
                'recent_files_sample' => $db->table('expedient')
                    ->orderBy('registration_date', 'DESC')
                    ->limit(10)
                    ->get()
                    ->getResultArray()
            ];
            
            return $this->response->setJSON(['success' => true, 'data' => $result]);
            
        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener expedientes del día',
                'error' => $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/analytics/debug-agency-users
     * Endpoint de debug para verificar la relación entre agencias y usuarios
     */
    public function debugAgencyUsers()
    {
        try {
            $db = \Config\Database::connect();
            
            // Verificar estructura de la tabla Agency_User
            $agencyUserStructure = $db->getFieldData('agency_user');
            
            // Verificar estructura de la tabla User
            $userStructure = $db->getFieldData('user');
            
            // Obtener algunos registros de ejemplo
            $agencyUserSample = $db->table('agency_user')->limit(5)->get()->getResultArray();
            $userSample = $db->table('user')->limit(5)->get()->getResultArray();
            
            // Contar usuarios por agencia
            $usersByAgency = $db->table('agency_user')
                ->select('id_agency, COUNT(*) as user_count')
                ->groupBy('id_agency')
                ->get()
                ->getResultArray();
            
            $result = [
                'agency_user_structure' => $agencyUserStructure,
                'user_structure' => $userStructure,
                'agency_user_sample' => $agencyUserSample,
                'user_sample' => $userSample,
                'users_by_agency' => $usersByAgency,
                'total_agency_user_relations' => $db->table('agency_user')->countAllResults(),
                'total_users' => $db->table('user')->countAllResults()
            ];
            
            return $this->response->setJSON(['success' => true, 'data' => $result]);
            
        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener información de agencias y usuarios',
                'error' => $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/analytics/debug-file-dates
     * Endpoint de debug para verificar las fechas más recientes en la tabla File
     */
    public function debugFileDates()
    {
        try {
            $db = \Config\Database::connect();
            
            // Obtener la fecha más reciente
            $latestDate = $db->table('expedient')
                ->selectMax('registration_date')
                ->get()
                ->getRowArray();
            
            // Obtener la fecha más antigua
            $oldestDate = $db->table('expedient')
                ->selectMin('registration_date')
                ->get()
                ->getRowArray();
            
            // Contar registros por año
            $yearlyCount = $db->table('expedient')
                ->select('YEAR(registration_date) as year, COUNT(*) as count')
                ->groupBy('YEAR(registration_date)')
                ->orderBy('year', 'DESC')
                ->get()
                ->getResultArray();
            
            // Contar registros por mes del año actual
            $currentYear = date('Y');
            $monthlyCount = $db->table('expedient')
                ->select('MONTH(registration_date) as month, COUNT(*) as count')
                ->where('YEAR(registration_date)', $currentYear)
                ->groupBy('MONTH(registration_date)')
                ->orderBy('month', 'ASC')
                ->get()
                ->getResultArray();
            
            $result = [
                'latest_date' => $latestDate['registration_date'] ?? null,
                'oldest_date' => $oldestDate['registration_date'] ?? null,
                'yearly_counts' => $yearlyCount,
                'current_year_monthly_counts' => $monthlyCount,
                'current_year' => $currentYear,
                'current_month' => date('m'),
                'current_month_name' => date('F')
            ];
            
            return $this->response->setJSON([
                'success' => true,
                'data' => $result
            ]);
            
        } catch (\Exception $e) {
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al verificar fechas de File',
                'error' => $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/analytics/export
     * Exportar datos de analytics
     */
    public function exportAnalytics()
    {
        try {
            $format = $this->request->getGet('format') ?? 'pdf';
            $filters = $this->getFiltersFromRequest();

            $data = [
                'userActivity' => $this->getUserActivityStats($filters),
                'documents' => $this->getDocumentStatsData($filters),
                'processes' => $this->getProcessStatsData($filters),
                'agencies' => $this->getAgencyStatsData($filters),
                'system' => $this->getSystemMetricsData(),
                'filters' => $filters,
                'generated_at' => date('Y-m-d H:i:s')
            ];

            if ($format === 'pdf') {
                return $this->generatePdfReport($data);
            } elseif ($format === 'excel') {
                return $this->generateExcelReport($data);
            } else {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'Formato no soportado'
                ])->setStatusCode(400);
            }

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al exportar datos',
                'error' => $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Obtener estadísticas de actividad de usuarios
     */
    private function getUserActivityStats($filters = [])
    {
        try {
            $stats = $this->userActivityLogModel->getLogStats(
                $filters['user_id'] ?? null,
                $filters['start_date'] ?? null,
                $filters['end_date'] ?? null
            );

            return $stats;

        } catch (\Exception $e) {

            return [];
        }
    }

    /**
     * Obtener filtros de la petición
     */
    private function getFiltersFromRequest()
    {
        $filters = [
            'start_date' => $this->request->getGet('start_date'),
            'end_date' => $this->request->getGet('end_date'),
            'user_id' => $this->request->getGet('user_id'),
            'idSeller' => $this->request->getGet('idSeller'),
            'agency_id' => $this->request->getGet('agency_id'),
            'process_id' => $this->request->getGet('process_id'),
            'document_type_id' => $this->request->getGet('document_type_id'),
            'year' => $this->request->getGet('year'),
            'range' => $this->request->getGet('range'),
            'current_month' => $this->request->getGet('current_month'),
            'liberated_only' => $this->request->getGet('liberated_only'),
            'registration_start_date' => $this->request->getGet('registration_start_date'),
            'registration_end_date' => $this->request->getGet('registration_end_date'),
            'liberation_start_date' => $this->request->getGet('liberation_start_date'),
            'liberation_end_date' => $this->request->getGet('liberation_end_date')
        ];

        // Multi-tenant guard. Si NO es admin:
        //   - Y pidió agency_id que NO le pertenece → borrar (queries serán vacías).
        //   - Y NO pidió agency_id → forzar a la primera de sus agencias permitidas
        //     para evitar enumeración cross-agencia. Si no tiene ninguna → -1 (no rows).
        $allowed = $this->getAllowedAgencyIds();
        $filters['allowed_agency_ids'] = $allowed; // null = admin (sin restricción)
        if ($allowed !== null) {
            if (!empty($filters['agency_id'])) {
                if (!in_array((int) $filters['agency_id'], $allowed, true)) {
                    $filters['agency_id'] = empty($allowed) ? -1 : $allowed[0];
                    $filters['_access_denied'] = true;
                }
            } else {
                $filters['agency_id'] = empty($allowed) ? -1 : $allowed[0];
            }
        }

        return $filters;
    }

    /**
     * Generar reporte PDF
     */
    private function generatePdfReport($data)
    {
        // Aquí implementarías la generación de PDF usando una librería como TCPDF o DomPDF
        // Por ahora retornamos un placeholder
        $filename = 'analytics-report-' . date('Y-m-d-H-i-s') . '.pdf';
        
        return $this->response
            ->setHeader('Content-Type', 'application/pdf')
            ->setHeader('Content-Disposition', 'attachment; filename="' . $filename . '"')
            ->setBody('PDF content placeholder');
    }

    /**
     * GET /api/analytics/widget-process-distribution
     * Obtener distribución de expedientes por proceso
     */
    public function getProcessDistribution()
    {
        try {
            $filters = $this->getFiltersFromRequest();
            $agencyId = $filters['agency_id'] ?? null;
            $idSeller = $filters['idSeller'] ?? null;

            $db = \Config\Database::connect();

            // Consulta para obtener distribución por proceso
            $query = $db->table('expedient f')
                ->select('p.name as processName, COUNT(f.id) as totalCases')
                ->join('process p', 'f.id_sale_type = p.id', 'left')
                ->groupBy('p.id, p.name')
                ->orderBy('totalCases', 'DESC');

            // Aplicar filtros
            if ($agencyId && $agencyId !== 'null' && $agencyId !== null) {
                $query->where('f.id_agency', $agencyId);
            }
            
            if ($idSeller && $idSeller !== 'null' && $idSeller !== null) {
                $query->where('f.id_seller', $idSeller);
            }

            $results = $query->get()->getResultArray();

            // Calcular total para porcentajes
            $totalCases = array_sum(array_column($results, 'totalCases'));

            // Formatear datos con porcentajes
            $processDistribution = [];
            foreach ($results as $row) {
                $percentage = $totalCases > 0 ? round(($row['totalCases'] / $totalCases) * 100, 1) : 0;
                
                $processDistribution[] = [
                    'processName' => $row['processName'] ?: 'Sin Proceso',
                    'totalCases' => (int)$row['totalCases'],
                    'percentage' => $percentage
                ];
            }

            return $this->response->setJSON([
                'success' => true,
                'data' => $processDistribution
            ]);

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener distribución por proceso',
                'error' => $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/analytics/widget-status-distribution
     * Obtener distribución de expedientes por estatus
     */
    public function getStatusDistribution()
    {
        try {
            $filters = $this->getFiltersFromRequest();
            $agencyId = $filters['agency_id'] ?? null;
            $idSeller = $filters['idSeller'] ?? null;

            $db = \Config\Database::connect();

            // Consulta para obtener distribución por estatus
            $query = $db->table('expedient f')
                ->select('fs.name as statusName, COUNT(f.id) as totalCases')
                ->join('expedient_state fs', 'f.id_current_expedient_state = fs.id', 'left')
                ->groupBy('fs.id, fs.name')
                ->orderBy('totalCases', 'DESC');

            // Aplicar filtros
            if ($agencyId && $agencyId !== 'null' && $agencyId !== null) {
                $query->where('f.id_agency', $agencyId);
            }
            
            if ($idSeller && $idSeller !== 'null' && $idSeller !== null) {
                $query->where('f.id_seller', $idSeller);
            }

            $results = $query->get()->getResultArray();

            // Calcular total para porcentajes
            $totalCases = array_sum(array_column($results, 'totalCases'));

            // Formatear datos con porcentajes
            $statusDistribution = [];
            foreach ($results as $row) {
                $percentage = $totalCases > 0 ? round(($row['totalCases'] / $totalCases) * 100, 1) : 0;
                
                $statusDistribution[] = [
                    'statusName' => $row['statusName'] ?: 'Sin Estatus',
                    'totalCases' => (int)$row['totalCases'],
                    'percentage' => $percentage
                ];
            }

            return $this->response->setJSON([
                'success' => true,
                'data' => $statusDistribution
            ]);

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener distribución por estatus',
                'error' => $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/analytics/widget-current-month-status
     * Obtener distribución de expedientes por estatus del mes actual
     */
    public function getCurrentMonthStatusDistribution()
    {
        try {
            $filters = $this->getFiltersFromRequest();
            $agencyId = $filters['agency_id'] ?? null;
            $idSeller = $filters['idSeller'] ?? null;

            // Configurar zona horaria de Guadalajara (GMT-6)

            $db = \Config\Database::connect();

            // Obtener mes y año actual
            $currentYear = date('Y');
            $currentMonth = date('n'); // Mes sin ceros iniciales (1-12)
            
            // Calcular rangos de fechas para usar índices
            $monthStart = $currentYear . '-' . str_pad($currentMonth, 2, '0', STR_PAD_LEFT) . '-01 00:00:00';
            $monthEnd = $currentYear . '-' . str_pad($currentMonth, 2, '0', STR_PAD_LEFT) . '-' . date('t', strtotime($monthStart)) . ' 23:59:59';

            // OPTIMIZACIÓN: Usar rangos de fechas en lugar de funciones de fecha
            $query = $db->table('expedient f')
                ->select('fs.name as statusName, COUNT(f.id) as totalCases')
                ->join('expedient_state fs', 'f.id_current_expedient_state = fs.id', 'left')
                ->where('f.registration_date >=', $monthStart)
                ->where('f.registration_date <=', $monthEnd)
                ->groupBy('fs.id, fs.name')
                ->orderBy('totalCases', 'DESC');

            // Aplicar filtros
            if ($agencyId && $agencyId !== 'null' && $agencyId !== null) {
                $query->where('f.id_agency', $agencyId);
            }
            
            if ($idSeller && $idSeller !== 'null' && $idSeller !== null) {
                $query->where('f.id_seller', $idSeller);
            }

            $results = $query->get()->getResultArray();

            // Calcular total para porcentajes
            $totalCases = array_sum(array_column($results, 'totalCases'));

            // Formatear datos con porcentajes
            $statusDistribution = [];
            foreach ($results as $row) {
                $percentage = $totalCases > 0 ? round(($row['totalCases'] / $totalCases) * 100, 1) : 0;
                
                $statusDistribution[] = [
                    'statusName' => $row['statusName'] ?: 'Sin Estatus',
                    'totalCases' => (int)$row['totalCases'],
                    'percentage' => $percentage
                ];
            }

            return $this->response->setJSON([
                'success' => true,
                'data' => $statusDistribution
            ]);

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener distribución por estatus del mes actual',
                'error' => $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/analytics/widget-previous-months
     * Obtener datos de meses anteriores al actual
     */
    public function getPreviousMonthsData()
    {
        try {
            $filters = $this->getFiltersFromRequest();
            $agencyId = $filters['agency_id'] ?? null;
            $idSeller = $filters['idSeller'] ?? null;
            $monthsToShow = $filters['months_to_show'] ?? 6;

            // Configurar zona horaria de Guadalajara (GMT-6)

            $db = \Config\Database::connect();

            // Obtener mes y año actual
            $currentYear = date('Y');
            $currentMonth = date('n'); // Mes sin ceros iniciales (1-12)

            $previousMonthsData = [];
            $monthNames = [
                1 => 'Enero', 2 => 'Febrero', 3 => 'Marzo', 4 => 'Abril',
                5 => 'Mayo', 6 => 'Junio', 7 => 'Julio', 8 => 'Agosto',
                9 => 'Septiembre', 10 => 'Octubre', 11 => 'Noviembre', 12 => 'Diciembre'
            ];

            // OPTIMIZACIÓN: Calcular el rango de fechas para todos los meses anteriores
            // Calcular fecha de inicio (mesesToShow meses atrás)
            $startDate = date('Y-m-01', strtotime("-{$monthsToShow} months"));
            $endDate = date('Y-m-t 23:59:59', strtotime('-1 month')); // Fin del mes pasado
            
            // OPTIMIZACIÓN: Una sola query con GROUP BY en lugar de múltiples queries
            $query = $db->table('expedient f')
                ->select('
                    YEAR(f.registration_date) as year,
                    MONTH(f.registration_date) as month,
                    COUNT(f.id) as totalCases,
                    SUM(CASE WHEN f.id_current_expedient_state IN (4, 6) THEN 1 ELSE 0 END) as deliveredCases,
                    SUM(CASE WHEN f.id_current_expedient_state = 2 THEN 1 ELSE 0 END) as inProcessCases,
                    SUM(CASE WHEN f.id_current_expedient_state = 3 THEN 1 ELSE 0 END) as cancelledCases
                ')
                ->where('f.registration_date >=', $startDate . ' 00:00:00')
                ->where('f.registration_date <=', $endDate)
                ->groupBy('YEAR(f.registration_date), MONTH(f.registration_date)')
                ->orderBy('YEAR(f.registration_date)', 'DESC')
                ->orderBy('MONTH(f.registration_date)', 'DESC');

            // Aplicar filtros
            if ($agencyId && $agencyId !== 'null' && $agencyId !== null) {
                $query->where('f.id_agency', $agencyId);
            }
            
            if ($idSeller && $idSeller !== 'null' && $idSeller !== null) {
                $query->where('f.id_seller', $idSeller);
            }

            $results = $query->get()->getResultArray();
            
            // Procesar resultados
            foreach ($results as $row) {
                $targetYear = (int)$row['year'];
                $targetMonth = (int)$row['month'];
                
                $previousMonthsData[] = [
                    'month' => $monthNames[$targetMonth],
                    'year' => $targetYear,
                    'totalCases' => (int)($row['totalCases'] ?? 0),
                    'deliveredCases' => (int)($row['deliveredCases'] ?? 0),
                    'inProcessCases' => (int)($row['inProcessCases'] ?? 0),
                    'cancelledCases' => (int)($row['cancelledCases'] ?? 0)
                ];
            }

            // Ordenar por fecha (más reciente primero)
            usort($previousMonthsData, function($a, $b) {
                if ($a['year'] == $b['year']) {
                    return $b['month'] <=> $a['month'];
                }
                return $b['year'] <=> $a['year'];
            });

            return $this->response->setJSON([
                'success' => true,
                'data' => $previousMonthsData
            ]);

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener datos de meses anteriores',
                'error' => $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/analytics/widget-historical-status
     * Obtener distribución de expedientes por estatus en todo el tiempo excepto el mes actual
     */
    public function getHistoricalStatusDistribution()
    {
        try {
            $filters = $this->getFiltersFromRequest();
            $agencyId = $filters['agency_id'] ?? null;
            $idSeller = $filters['idSeller'] ?? null;

            // Configurar zona horaria de Guadalajara (GMT-6)

            $db = \Config\Database::connect();

            // Obtener mes y año actual
            $currentYear = date('Y');
            $currentMonth = date('n'); // Mes sin ceros iniciales (1-12)

            $query = $db->table('expedient f')
                ->select('fs.name as statusName, COUNT(f.id) as totalCases')
                ->join('expedient_state fs', 'f.id_current_expedient_state = fs.id', 'left')
                ->groupBy('fs.id, fs.name')
                ->orderBy('totalCases', 'DESC');

            // OPTIMIZACIÓN: Excluir el mes actual usando rangos de fechas
            $monthStart = $currentYear . '-' . str_pad($currentMonth, 2, '0', STR_PAD_LEFT) . '-01 00:00:00';
            $monthEnd = $currentYear . '-' . str_pad($currentMonth, 2, '0', STR_PAD_LEFT) . '-' . date('t', strtotime($monthStart)) . ' 23:59:59';
            $query->where('NOT (f.registration_date >= "' . $monthStart . '" AND f.registration_date <= "' . $monthEnd . '")');

            // Aplicar filtros
            if ($agencyId && $agencyId !== 'null' && $agencyId !== null) {
                $query->where('f.id_agency', $agencyId);
            }
            
            if ($idSeller && $idSeller !== 'null' && $idSeller !== null) {
                $query->where('f.id_seller', $idSeller);
            }

            $results = $query->get()->getResultArray();
            $totalCases = array_sum(array_column($results, 'totalCases'));
            $statusDistribution = [];
            
            foreach ($results as $row) {
                $percentage = $totalCases > 0 ? round(($row['totalCases'] / $totalCases) * 100, 1) : 0;
                $statusDistribution[] = [
                    'statusName' => $row['statusName'] ?: 'Sin Estatus',
                    'totalCases' => (int)$row['totalCases'],
                    'percentage' => $percentage
                ];
            }

            return $this->response->setJSON([
                'success' => true,
                'data' => $statusDistribution
            ]);

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener distribución histórica por estatus',
                'error' => $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * Generar reporte Excel
     */
    private function generateExcelReport($data)
    {
        // Aquí implementarías la generación de Excel usando una librería como PhpSpreadsheet
        // Por ahora retornamos un placeholder
        $filename = 'analytics-report-' . date('Y-m-d-H-i-s') . '.xlsx';
        
        return $this->response
            ->setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            ->setHeader('Content-Disposition', 'attachment; filename="' . $filename . '"')
            ->setBody('Excel content placeholder');
    }

    /**
     * GET /api/advisor-distribution
     * Obtener distribución de expedientes por advisor para el mes actual
     */
    public function getAdvisorDistribution()
    {
        try {
            $filters = $this->getFiltersFromRequest();
            $agencyId = $filters['agency_id'] ?? null;
            $userId = $filters['user_id'] ?? null;

            // Configurar zona horaria de Guadalajara (GMT-6)

            $db = \Config\Database::connect();

            // Obtener mes y año actual
            $currentYear = date('Y');
            $currentMonth = date('n'); // Mes sin ceros iniciales (1-12)
            
            // OPTIMIZACIÓN: Usar rangos de fechas
            $monthStart = $currentYear . '-' . str_pad($currentMonth, 2, '0', STR_PAD_LEFT) . '-01 00:00:00';
            $monthEnd = $currentYear . '-' . str_pad($currentMonth, 2, '0', STR_PAD_LEFT) . '-' . date('t', strtotime($monthStart)) . ' 23:59:59';
            
            // OPTIMIZACIÓN: Usar id_current_expedient_state directamente en lugar de JOIN con expedient_state
            // Nota: 'user' es palabra reservada en MySQL, usar backticks explícitos
            $query = $db->table('expedient f')
                ->select('u.name as advisorName, 
                         SUM(CASE WHEN f.id_current_expedient_state IN (4, 6) THEN 1 ELSE 0 END) as approved,
                         SUM(CASE WHEN f.id_current_expedient_state IN (1, 2, 3) THEN 1 ELSE 0 END) as pending,
                         SUM(CASE WHEN f.id_current_expedient_state = 5 THEN 1 ELSE 0 END) as rejected,
                         COUNT(f.id) as total')
                ->join('`user` u', 'f.id_seller = u.id', 'left')
                ->where('f.registration_date >=', $monthStart)
                ->where('f.registration_date <=', $monthEnd)
                ->groupBy('u.id, u.name')
                ->having('total > 0')
                ->orderBy('total', 'DESC');

            // Aplicar filtros
            if ($agencyId && $agencyId !== 'null' && $agencyId !== null) {
                $query->where('f.id_agency', $agencyId);
            }
            
            if ($userId && $userId !== 'null' && $userId !== null) {
                $query->where('f.id_seller', $userId);
            }

            $results = $query->get()->getResultArray();
            $advisorDistribution = [];
            
            foreach ($results as $row) {
                $advisorDistribution[] = [
                    'advisorName' => $row['advisorName'] ?: 'Sin Asesor',
                    'approved' => (int)$row['approved'],
                    'pending' => (int)$row['pending'],
                    'rejected' => (int)$row['rejected'],
                    'total' => (int)$row['total']
                ];
            }

            return $this->response->setJSON([
                'success' => true,
                'data' => $advisorDistribution
            ]);

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener distribución de asesores: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/analytics/weekly-data
     * Obtener datos de expedientes por día de la semana actual
     */
    public function getWeeklyData()
    {
        try {
            $filters = $this->getFiltersFromRequest();
            $agencyId = $filters['agency_id'] ?? null;
            $userId = $filters['user_id'] ?? null;

            // Configurar zona horaria de Guadalajara (GMT-6)

            $db = \Config\Database::connect();

            // Obtener el lunes de la semana actual
            $currentDate = date('Y-m-d');
            $dayOfWeek = date('N', strtotime($currentDate)); // 1 = lunes, 7 = domingo
            $mondayOfWeek = date('Y-m-d', strtotime('-' . ($dayOfWeek - 1) . ' days', strtotime($currentDate)));
            $sundayOfWeek = date('Y-m-d', strtotime('+' . (7 - $dayOfWeek) . ' days', strtotime($currentDate)));

            // OPTIMIZACIÓN: Usar rangos de fechas completas en lugar de DATE()
            $mondayStart = $mondayOfWeek . ' 00:00:00';
            $sundayEnd = $sundayOfWeek . ' 23:59:59';
            
            $query = $db->table('expedient f')
                ->select('DATE(f.registration_date) as day, 
                         DAYNAME(f.registration_date) as dayName,
                         COUNT(f.id) as count')
                ->where('f.registration_date >=', $mondayStart)
                ->where('f.registration_date <=', $sundayEnd)
                ->groupBy('DATE(f.registration_date), DAYNAME(f.registration_date)')
                ->orderBy('DATE(f.registration_date)', 'ASC');

            // Aplicar filtros
            if ($agencyId && $agencyId !== 'null' && $agencyId !== null) {
                $query->where('f.id_agency', $agencyId);
            }
            
            if ($userId && $userId !== 'null' && $userId !== null) {
                $query->where('f.id_seller', $userId);
            }

            $results = $query->get()->getResultArray();
            
            // Crear array con todos los días de la semana
            $daysOfWeek = [
                'Monday' => 'Lunes',
                'Tuesday' => 'Martes', 
                'Wednesday' => 'Miércoles',
                'Thursday' => 'Jueves',
                'Friday' => 'Viernes',
                'Saturday' => 'Sábado',
                'Sunday' => 'Domingo'
            ];

            $weeklyData = [];
            $currentMonday = strtotime($mondayOfWeek);
            
            for ($i = 0; $i < 7; $i++) {
                $currentDay = date('Y-m-d', strtotime('+' . $i . ' days', $currentMonday));
                $dayName = date('l', strtotime($currentDay)); // Nombre en inglés
                $dayNameSpanish = $daysOfWeek[$dayName];
                
                // Buscar si hay datos para este día
                $dayData = null;
                foreach ($results as $row) {
                    if ($row['day'] === $currentDay) {
                        $dayData = $row;
                        break;
                    }
                }
                
                $weeklyData[] = [
                    'day' => $currentDay,
                    'dayName' => $dayNameSpanish,
                    'count' => $dayData ? (int)$dayData['count'] : 0
                ];
            }

            return $this->response->setJSON([
                'success' => true,
                'data' => $weeklyData
            ]);

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener datos semanales: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/analytics/attention-period
     * Obtener datos de período de atención de expedientes basado en la diferencia entre attentiondate y closedate
     */
    public function getAttentionPeriod()
    {
        try {
            $filters = $this->getFiltersFromRequest();
            $agencyId = $filters['agency_id'] ?? null;
            $userId = $filters['user_id'] ?? null;

            // Configurar zona horaria de Guadalajara (GMT-6)

            $db = \Config\Database::connect();

            // Primero verificar si existen expedientes con registration_date
            $countQuery = $db->table('expedient f')
                ->select('COUNT(f.id) as total')
                ->where('f.registration_date IS NOT NULL');

            if ($agencyId && $agencyId !== 'null' && $agencyId !== null) {
                $countQuery->where('f.id_agency', $agencyId);
            }
            
            if ($userId && $userId !== 'null' && $userId !== null) {
                $countQuery->where('f.id_seller', $userId);
            }

            $totalCount = $countQuery->get()->getRowArray();

            // Si no hay datos, retornar rangos vacíos
            if ($totalCount['total'] == 0) {
                $finalData = [
                    ['range' => '0-5', 'label' => '0 - 5 Días', 'count' => 0, 'color' => '#10b981'],
                    ['range' => '5-10', 'label' => '5 - 10 Días', 'count' => 0, 'color' => '#f59e0b'],
                    ['range' => '10-15', 'label' => '10 - 15 Días', 'count' => 0, 'color' => '#f97316'],
                    ['range' => '15+', 'label' => '> 15 Días', 'count' => 0, 'color' => '#ef4444']
                ];

                return $this->response->setJSON([
                    'success' => true,
                    'data' => $finalData
                ]);
            }

        // OPTIMIZACIÓN: Reducir JOINs innecesarios - solo necesitamos Process para verificar enabled
        $query = $db->table('expedient f')
            ->join('process p', 'f.id_sale_type = p.id', 'inner')
            ->select('
                CASE 
                    WHEN DATEDIFF(COALESCE(f.close_date, CURDATE()), f.registration_date) <= 5 THEN "0-5"
                    WHEN DATEDIFF(COALESCE(f.close_date, CURDATE()), f.registration_date) <= 10 THEN "5-10"
                    WHEN DATEDIFF(COALESCE(f.close_date, CURDATE()), f.registration_date) <= 15 THEN "10-15"
                    ELSE "15+"
                END as period_range,
                CASE 
                    WHEN DATEDIFF(COALESCE(f.close_date, CURDATE()), f.registration_date) <= 5 THEN "0 - 5 Días"
                    WHEN DATEDIFF(COALESCE(f.close_date, CURDATE()), f.registration_date) <= 10 THEN "5 - 10 Días"
                    WHEN DATEDIFF(COALESCE(f.close_date, CURDATE()), f.registration_date) <= 15 THEN "10 - 15 Días"
                    ELSE "> 15 Días"
                END as period_label,
                COUNT(f.id) as count
            ')
            ->where('f.registration_date IS NOT NULL')
            ->where('COALESCE(f.close_date, CURDATE()) >= f.registration_date')
            ->whereNotIn('f.id_current_expedient_state', [4, 6])  // ← EXCLUIR PEDIDOS LIBERADOS (4=Liberado, 6=Liberado por Excepción)
            ->where('p.enabled', 1)
            ->groupBy('period_range, period_label')
            ->orderBy('period_range', 'ASC');

            // Aplicar filtros
            if ($agencyId && $agencyId !== 'null' && $agencyId !== null) {
                $query->where('f.id_agency', $agencyId);
            }
            
            if ($userId && $userId !== 'null' && $userId !== null) {
                $query->where('f.id_seller', $userId);
            }

            $results = $query->get()->getResultArray();

            // Definir colores para cada rango
            $colors = [
                '0-5' => '#10b981',    // Verde
                '5-10' => '#f59e0b',   // Amarillo/Naranja
                '10-15' => '#f97316',  // Naranja
                '15+' => '#ef4444'     // Rojo
            ];

            $attentionData = [];
            
            foreach ($results as $row) {
                $attentionData[] = [
                    'range' => $row['period_range'],
                    'label' => $row['period_label'],
                    'count' => (int)$row['count'],
                    'color' => $colors[$row['period_range']] ?? '#6b7280'
                ];
            }

            // Asegurar que todos los rangos estén presentes, incluso con 0 casos
            $allRanges = [
                ['range' => '0-5', 'label' => '0 - 5 Días', 'color' => '#10b981'],
                ['range' => '5-10', 'label' => '5 - 10 Días', 'color' => '#f59e0b'],
                ['range' => '10-15', 'label' => '10 - 15 Días', 'color' => '#f97316'],
                ['range' => '15+', 'label' => '> 15 Días', 'color' => '#ef4444']
            ];

            $finalData = [];
            foreach ($allRanges as $range) {
                $found = false;
                foreach ($attentionData as $item) {
                    if ($item['range'] === $range['range']) {
                        $finalData[] = $item;
                        $found = true;
                        break;
                    }
                }
                if (!$found) {
                    $finalData[] = [
                        'range' => $range['range'],
                        'label' => $range['label'],
                        'count' => 0,
                        'color' => $range['color']
                    ];
                }
            }

            return $this->response->setJSON([
                'success' => true,
                'data' => $finalData
            ]);

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener datos de período de atención: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/analytics/current-month-attention
     * Obtener datos de período de atención de expedientes del mes actual
     */
    public function getCurrentMonthAttention()
    {
        try {
            $filters = $this->getFiltersFromRequest();
            $agencyId = $filters['agency_id'] ?? null;
            $userId = $filters['user_id'] ?? null;

            // Configurar zona horaria de Guadalajara (GMT-6)

            $db = \Config\Database::connect();

            // Obtener mes y año actual
            $currentYear = date('Y');
            $currentMonth = date('n'); // Mes sin ceros iniciales (1-12)

            // OPTIMIZACIÓN: Usar rangos de fechas
            $monthStart = $currentYear . '-' . str_pad($currentMonth, 2, '0', STR_PAD_LEFT) . '-01 00:00:00';
            $monthEnd = $currentYear . '-' . str_pad($currentMonth, 2, '0', STR_PAD_LEFT) . '-' . date('t', strtotime($monthStart)) . ' 23:59:59';
            
            // Primero verificar si existen expedientes con registration_date del mes actual
            $countQuery = $db->table('expedient f')
                ->select('COUNT(f.id) as total')
                ->where('f.registration_date IS NOT NULL')
                ->where('f.registration_date >=', $monthStart)
                ->where('f.registration_date <=', $monthEnd);

            if ($agencyId && $agencyId !== 'null' && $agencyId !== null) {
                $countQuery->where('f.id_agency', $agencyId);
            }
            
            if ($userId && $userId !== 'null' && $userId !== null) {
                $countQuery->where('f.id_seller', $userId);
            }

            $totalCount = $countQuery->get()->getRowArray();

            // Si no hay datos, retornar rangos vacíos
            if ($totalCount['total'] == 0) {
                $finalData = [
                    ['range' => '0-5', 'label' => '0 - 5 Días', 'count' => 0, 'color' => '#10b981'],
                    ['range' => '5-10', 'label' => '5 - 10 Días', 'count' => 0, 'color' => '#f59e0b'],
                    ['range' => '10-15', 'label' => '10 - 15 Días', 'count' => 0, 'color' => '#f97316'],
                    ['range' => '15+', 'label' => '> 15 Días', 'count' => 0, 'color' => '#ef4444']
                ];

                return $this->response->setJSON([
                    'success' => true,
                    'data' => $finalData
                ]);
            }

            // OPTIMIZACIÓN: Reducir JOINs innecesarios y usar rangos de fechas
            // Solo necesitamos JOIN con Process para verificar enabled, el resto se puede simplificar
            $query = $db->table('expedient f')
                ->join('process p', 'f.id_sale_type = p.id', 'inner')
                ->select('
                    CASE 
                        WHEN DATEDIFF(COALESCE(f.close_date, CURDATE()), f.registration_date) <= 5 THEN "0-5"
                        WHEN DATEDIFF(COALESCE(f.close_date, CURDATE()), f.registration_date) <= 10 THEN "5-10"
                        WHEN DATEDIFF(COALESCE(f.close_date, CURDATE()), f.registration_date) <= 15 THEN "10-15"
                        ELSE "15+"
                    END as period_range,
                    CASE 
                        WHEN DATEDIFF(COALESCE(f.close_date, CURDATE()), f.registration_date) <= 5 THEN "0 - 5 Días"
                        WHEN DATEDIFF(COALESCE(f.close_date, CURDATE()), f.registration_date) <= 10 THEN "5 - 10 Días"
                        WHEN DATEDIFF(COALESCE(f.close_date, CURDATE()), f.registration_date) <= 15 THEN "10 - 15 Días"
                        ELSE "> 15 Días"
                    END as period_label,
                    COUNT(f.id) as count
                ')
                ->where('f.registration_date IS NOT NULL')
                ->where('f.registration_date >=', $monthStart)
                ->where('f.registration_date <=', $monthEnd)
                ->where('COALESCE(f.close_date, CURDATE()) >= f.registration_date')
                ->whereNotIn('f.id_current_expedient_state', [4, 6])  // ← EXCLUIR PEDIDOS LIBERADOS (4=Liberado, 6=Liberado por Excepción)
                ->where('p.enabled', 1)
                ->groupBy('period_range, period_label')
                ->orderBy('period_range', 'ASC');

            // Aplicar filtros
            if ($agencyId && $agencyId !== 'null' && $agencyId !== null) {
                $query->where('f.id_agency', $agencyId);
            }
            
            if ($userId && $userId !== 'null' && $userId !== null) {
                $query->where('f.id_seller', $userId);
            }

            $results = $query->get()->getResultArray();

            // Definir colores para cada rango
            $colors = [
                '0-5' => '#10b981',    // Verde
                '5-10' => '#f59e0b',   // Amarillo/Naranja
                '10-15' => '#f97316',  // Naranja
                '15+' => '#ef4444'     // Rojo
            ];

            $attentionData = [];
            
            foreach ($results as $row) {
                $attentionData[] = [
                    'range' => $row['period_range'],
                    'label' => $row['period_label'],
                    'count' => (int)$row['count'],
                    'color' => $colors[$row['period_range']] ?? '#6b7280'
                ];
            }

            // Asegurar que todos los rangos estén presentes, incluso con 0 casos
            $allRanges = [
                ['range' => '0-5', 'label' => '0 - 5 Días', 'color' => '#10b981'],
                ['range' => '5-10', 'label' => '5 - 10 Días', 'color' => '#f59e0b'],
                ['range' => '10-15', 'label' => '10 - 15 Días', 'color' => '#f97316'],
                ['range' => '15+', 'label' => '> 15 Días', 'color' => '#ef4444']
            ];

            $finalData = [];
            foreach ($allRanges as $range) {
                $found = false;
                foreach ($attentionData as $item) {
                    if ($item['range'] === $range['range']) {
                        $finalData[] = $item;
                        $found = true;
                        break;
                    }
                }
                if (!$found) {
                    $finalData[] = [
                        'range' => $range['range'],
                        'label' => $range['label'],
                        'count' => 0,
                        'color' => $range['color']
                    ];
                }
            }

            return $this->response->setJSON([
                'success' => true,
                'data' => $finalData
            ]);

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener datos de período de atención del mes actual: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/analytics/current-month-liberated
     * Obtener datos de expedientes liberados del mes actual
     */
    public function getCurrentMonthLiberated()
    {
        try {
            $filters = $this->getFiltersFromRequest();
            $agencyId = $filters['agency_id'] ?? null;
            $userId = $filters['user_id'] ?? null;

            // Configurar zona horaria de Guadalajara (GMT-6)

            $db = \Config\Database::connect();

            // Obtener mes y año actual
            $currentYear = date('Y');
            $currentMonth = date('n'); // Mes sin ceros iniciales (1-12)

            // OPTIMIZACIÓN: Usar rangos de fechas en lugar de funciones de fecha
            $monthStart = $currentYear . '-' . str_pad($currentMonth, 2, '0', STR_PAD_LEFT) . '-01 00:00:00';
            $monthEnd = $currentYear . '-' . str_pad($currentMonth, 2, '0', STR_PAD_LEFT) . '-' . date('t', strtotime($monthStart)) . ' 23:59:59';
            
            // OPTIMIZACIÓN: Usar id_current_expedient_state directamente en lugar de JOIN con expedient_state
            $query = $db->table('expedient f')
                ->select('COUNT(f.id) as total')
                ->where('f.registration_date IS NOT NULL')
                ->where('f.registration_date >=', $monthStart)
                ->where('f.registration_date <=', $monthEnd)
                ->whereIn('f.id_current_expedient_state', [4, 6]); // 4 = Liberado, 6 = Liberado por Excepción

            // Aplicar filtros
            if ($agencyId && $agencyId !== 'null' && $agencyId !== null) {
                $query->where('f.id_agency', $agencyId);
            }

            if ($userId && $userId !== 'null' && $userId !== null) {
                $query->where('f.id_seller', $userId);
            }

            $result = $query->get()->getRowArray();
            $total = (int)($result['total'] ?? 0);

            // Obtener nombre del mes
            $monthNames = [
                1 => 'Enero', 2 => 'Febrero', 3 => 'Marzo', 4 => 'Abril',
                5 => 'Mayo', 6 => 'Junio', 7 => 'Julio', 8 => 'Agosto',
                9 => 'Septiembre', 10 => 'Octubre', 11 => 'Noviembre', 12 => 'Diciembre'
            ];
            $monthName = $monthNames[$currentMonth];

            $data = [
                'total' => $total,
                'month' => $monthName,
                'year' => $currentYear
            ];

            return $this->response->setJSON([
                'success' => true,
                'data' => $data
            ]);

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener datos de expedientes liberados del mes actual: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/analytics/total-liberated
     * Obtener datos de expedientes liberados totales (toda la historia)
     */
    public function getTotalLiberated()
    {
        try {
            $filters = $this->getFiltersFromRequest();
            $agencyId = $filters['agency_id'] ?? null;
            $userId = $filters['user_id'] ?? null;

            // Configurar zona horaria de Guadalajara (GMT-6)

            $db = \Config\Database::connect();

            // Consulta para obtener expedientes liberados de toda la historia
            $query = $db->table('expedient f')
                ->join('expedient_state fs', 'f.id_current_expedient_state = fs.id', 'inner')
                ->select('COUNT(f.id) as total')
                ->where('f.registration_date IS NOT NULL')
                ->where('fs.name', 'Liberado');

            // Aplicar filtros
            if ($agencyId && $agencyId !== 'null' && $agencyId !== null) {
                $query->where('f.id_agency', $agencyId);
            }

            if ($userId && $userId !== 'null' && $userId !== null) {
                $query->where('f.id_seller', $userId);
            }

            $result = $query->get()->getRowArray();
            $total = (int)($result['total'] ?? 0);

            $data = [
                'total' => $total
            ];

            return $this->response->setJSON([
                'success' => true,
                'data' => $data
            ]);

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener datos de expedientes liberados totales: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/analytics/orders-by-attention-period
     * Obtener pedidos específicos por rango de período de atención
     */
    public function getOrdersByAttentionPeriod()
    {
        try {
        $filters = $this->getFiltersFromRequest();
        $range = $filters['range'] ?? null;
        $agencyId = $filters['agency_id'] ?? null;
        $userId = $filters['user_id'] ?? null;
        $currentMonth = $filters['current_month'] ?? null;
        $liberatedOnly = $filters['liberated_only'] ?? null; // ← NUEVO PARÁMETRO

            if (!$range) {
                return $this->response->setJSON([
                    'success' => false,
                    'message' => 'El parámetro range es requerido'
                ])->setStatusCode(400);
            }

            // Configurar zona horaria de Guadalajara (GMT-6)

            $db = \Config\Database::connect();

            // Construir condición WHERE para el rango de días usando registration_date y close_date (o fecha actual si es NULL)
            $dayCondition = '';
            switch ($range) {
                case '0-5':
                    $dayCondition = 'DATEDIFF(COALESCE(f.close_date, CURDATE()), f.registration_date) <= 5';
                    break;
                case '5-10':
                    $dayCondition = 'DATEDIFF(COALESCE(f.close_date, CURDATE()), f.registration_date) > 5 AND DATEDIFF(COALESCE(f.close_date, CURDATE()), f.registration_date) <= 10';
                    break;
                case '10-15':
                    $dayCondition = 'DATEDIFF(COALESCE(f.close_date, CURDATE()), f.registration_date) > 10 AND DATEDIFF(COALESCE(f.close_date, CURDATE()), f.registration_date) <= 15';
                    break;
                case '15+':
                    $dayCondition = 'DATEDIFF(COALESCE(f.close_date, CURDATE()), f.registration_date) > 15';
                    break;
                default:
                    return $this->response->setJSON([
                        'success' => false,
                        'message' => 'Rango de días no válido'
                    ])->setStatusCode(400);
            }

            $sql = "
                SELECT 
                    f.id as idFile,
                    MIN(ctr.id_dms) as ndCliente,
                    f.id_order as ndPedido,
                    TRIM(CONCAT(COALESCE(c.name, ''), ' ', COALESCE(c.last_name, ''), ' ', COALESCE(c.mother_last_name, ''))) as cliente,
                    p.name as proceso,
                    ot.name as operacion,
                    fs.name as fase,
                    f.registration_date as fechaAtencion,
                    f.close_date as fechaCierre,
                    DATEDIFF(COALESCE(f.close_date, CURDATE()), f.registration_date) as diasAtencion,
                    fs.name as estado
                FROM expedient f
                INNER JOIN expedient_state fs ON f.id_current_expedient_state = fs.id
                INNER JOIN client_header hc ON hc.id_client = f.id_client
                INNER JOIN client c ON hc.id_client = c.id
                INNER JOIN process p ON f.id_sale_type = p.id
                INNER JOIN operation_type ot ON f.id_operation = ot.id
                INNER JOIN client_dms_relation ctr ON hc.id = ctr.id_client_header
            WHERE f.registration_date IS NOT NULL
            AND COALESCE(f.close_date, CURDATE()) >= f.registration_date
            AND {$dayCondition}
            AND p.enabled = 1
            AND ((c.name IS NOT NULL AND c.name != '') OR (c.last_name IS NOT NULL AND c.last_name != '') OR (c.mother_last_name IS NOT NULL AND c.mother_last_name != ''))
        ";

        // Agregar filtro de mes si se especifica
        if ($currentMonth === 'true') {
            $currentYear = date('Y');
            $currentMonthNum = date('n');
            $sql .= " AND YEAR(f.registration_date) = {$currentYear} AND MONTH(f.registration_date) = {$currentMonthNum}";
        }

        // Agregar filtro de pedidos liberados si se especifica
        if ($liberatedOnly === 'true') {
            $sql .= " AND fs.name = 'Liberado'";
        } else {
            $sql .= " AND fs.name != 'Liberado'";
        }

        $params = [];

            // Aplicar filtros de agencia y usuario
            if ($agencyId && $agencyId !== 'null' && $agencyId !== null) {
                $sql .= " AND f.id_agency = ?";
                $params[] = $agencyId;
            }
            
            if ($userId && $userId !== 'null' && $userId !== null) {
                $sql .= " AND f.id_seller = ?";
                $params[] = $userId;
            }

            $sql .= " GROUP BY f.id ORDER BY f.close_date DESC";

            $query = $db->query($sql, $params);
            $results = $query->getResultArray();

            return $this->response->setJSON([
                'success' => true,
                'data' => $results
            ]);

        } catch (\Exception $e) {

            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener pedidos por período de atención: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }
}
