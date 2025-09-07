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

    public function __construct()
    {
        $this->documentModel = new DocumentModel();
        $this->processModel = new ProcessModel();
        $this->agencyModel = new AgencyModel();
        $this->userModel = new UserModel();
        $this->userActivityLogModel = new UserActivityLogModel();
    }

    /**
     * GET /api/analytics/dashboard
     * Obtener datos completos del dashboard de analytics
     */
    public function getDashboardData()
    {
        try {
            $filters = $this->getFiltersFromRequest();

            $data = [
                'userActivity' => $this->getUserActivityStats($filters),
                'documents' => $this->getDocumentStats($filters),
                'processes' => $this->getProcessStats($filters),
                'agencies' => $this->getAgencyStats($filters),
                'system' => $this->getSystemMetrics($filters)
            ];

            return $this->response->setJSON([
                'success' => true,
                'data' => $data
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en Analytics::getDashboardData: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener datos del dashboard',
                'error' => $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/analytics/widget-document-statistics
     * Obtener estadísticas de documentos
     */
    public function getDocumentStats()
    {
        try {
            $filters = $this->getFiltersFromRequest();
            
            // Debug: verificar que el modelo funciona
            log_message('debug', 'DocumentModel loaded: ' . get_class($this->documentModel));
            
            // Debug: verificar la tabla
            $tableName = $this->documentModel->table;
            log_message('debug', 'Table name: ' . $tableName);
            
            $builder = $this->documentModel->builder();
            
            // Aplicar filtros
            if (!empty($filters['start_date'])) {
                $builder->where('RegistrationDate >=', $filters['start_date']);
            }
            if (!empty($filters['end_date'])) {
                $builder->where('RegistrationDate <=', $filters['end_date']);
            }
            if (!empty($filters['agency_id'])) {
                $builder->join('File f', 'f.Id = DocumentByFile.IdFile')
                        ->where('f.IdAgency', $filters['agency_id']);
            }
            if (!empty($filters['document_type_id'])) {
                $builder->where('IdDocumentType', $filters['document_type_id']);
            }

            // Estadísticas básicas
            $totalDocuments = $builder->countAllResults(false);
            
            log_message('debug', 'Total documents: ' . $totalDocuments);

            // Documentos por tipo
            $documentsByType = $this->documentModel->builder()
                ->select('dt.Name as type, COUNT(*) as count')
                ->join('DocumentType dt', 'dt.Id = DocumentByFile.IdDocumentType')
                ->groupBy('dt.Name')
                ->get()
                ->getResultArray();

            // Documentos por estado
            $documentsByStatus = $this->documentModel->builder()
                ->select('IdCurrentStatus as status, COUNT(*) as count')
                ->groupBy('IdCurrentStatus')
                ->get()
                ->getResultArray();

            // Documentos por agencia
            $documentsByAgency = $this->documentModel->builder()
                ->select('a.Name as agency, COUNT(*) as count')
                ->join('File f', 'f.Id = DocumentByFile.IdFile')
                ->join('Agency a', 'a.Id = f.IdAgency')
                ->groupBy('a.Name')
                ->orderBy('count', 'DESC')
                ->limit(10)
                ->get()
                ->getResultArray();

            // Tendencia mensual
            $monthlyTrend = $this->documentModel->builder()
                ->select("DATE_FORMAT(RegistrationDate, '%Y-%m') as month, COUNT(*) as count")
                ->where('RegistrationDate >=', date('Y-m-01', strtotime('-12 months')))
                ->groupBy('month')
                ->orderBy('month', 'ASC')
                ->get()
                ->getResultArray();

            return $this->response->setJSON([
                'success' => true,
                'data' => [
                'totalDocuments' => $totalDocuments,
                'documentsByType' => $documentsByType,
                'documentsByStatus' => $documentsByStatus,
                'documentsByAgency' => $documentsByAgency,
                'monthlyTrend' => $monthlyTrend
                ]
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en Analytics::getDocumentStats: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/analytics/processes/stats
     * Obtener estadísticas de procesos
     */
    public function getProcessStats()
    {
        try {
            $filters = $this->getFiltersFromRequest();
            $builder = $this->processModel->builder();
            
            // Aplicar filtros
            if (!empty($filters['start_date'])) {
                $builder->where('RegistrationDate >=', $filters['start_date']);
            }
            if (!empty($filters['end_date'])) {
                $builder->where('RegistrationDate <=', $filters['end_date']);
            }
            if (!empty($filters['agency_id'])) {
                $builder->where('agency_id', $filters['agency_id']);
            }

            // Estadísticas básicas
            $totalProcesses = $builder->countAllResults(false);

            // Procesos por estado (usando Enabled)
            $processesByStatus = $this->processModel->builder()
                ->select('Enabled as status, COUNT(*) as count')
                ->groupBy('Enabled')
                ->get()
                ->getResultArray();

            // Procesos por agencia (simplificado - la tabla Process no tiene relación directa con agencias)
            $processesByAgency = [];

            // Tiempo promedio de procesamiento (simplificado)
            $averageProcessingTime = 0;

            // Tendencia mensual
            $monthlyTrend = $this->processModel->builder()
                ->select("DATE_FORMAT(RegistrationDate, '%Y-%m') as month, COUNT(*) as count")
                ->where('RegistrationDate >=', date('Y-m-01', strtotime('-12 months')))
                ->groupBy('month')
                ->orderBy('month', 'ASC')
                ->get()
                ->getResultArray();

            return $this->response->setJSON([
                'success' => true,
                'data' => [
                'totalProcesses' => $totalProcesses,
                'processesByStatus' => $processesByStatus,
                'processesByAgency' => $processesByAgency,
                    'averageProcessingTime' => $averageProcessingTime,
                'monthlyTrend' => $monthlyTrend
                ]
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en Analytics::getProcessStats: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/analytics/agencies/stats
     * Obtener estadísticas de agencias
     */
    public function getAgencyStats()
    {
        try {
            $filters = $this->getFiltersFromRequest();
            
            // Estadísticas básicas
            $totalAgencies = $this->agencyModel->countAllResults();
            $activeAgencies = $this->agencyModel->where('Enabled', 1)->countAllResults();

            // Agencias por estado (usando Enabled)
            $agenciesByStatus = $this->agencyModel->builder()
                ->select('Enabled as status, COUNT(*) as count')
                ->groupBy('Enabled')
                ->get()
                ->getResultArray();

            // Top agencias (simplificado - solo por nombre)
            $topAgencies = $this->agencyModel->builder()
                ->select('Name as agency, Id as id')
                ->orderBy('Name', 'ASC')
                ->limit(10)
                ->get()
                ->getResultArray();

            return $this->response->setJSON([
                'success' => true,
                'data' => [
                'totalAgencies' => $totalAgencies,
                'activeAgencies' => $activeAgencies,
                    'agenciesByStatus' => $agenciesByStatus,
                    'topAgencies' => $topAgencies
                ]
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en Analytics::getAgencyStats: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/analytics/system/metrics
     * Obtener métricas del sistema
     */
    public function getSystemMetrics()
    {
        try {
            $filters = $this->getFiltersFromRequest();
            
            $totalUsers = $this->userModel->countAllResults();
            $activeUsers = $this->userModel->where('Enabled', 1)->countAllResults();
            $totalDocuments = $this->documentModel->countAllResults();
            $totalProcesses = $this->processModel->countAllResults();
            $totalAgencies = $this->agencyModel->countAllResults();

            return $this->response->setJSON([
                'success' => true,
                'data' => [
                'totalUsers' => $totalUsers,
                'activeUsers' => $activeUsers,
                'totalDocuments' => $totalDocuments,
                'totalProcesses' => $totalProcesses,
                'totalAgencies' => $totalAgencies,
                'systemUptime' => 99.9, // Esto debería calcularse desde logs del sistema
                'averageResponseTime' => 150 // Esto debería calcularse desde logs de performance
                ]
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en Analytics::getSystemMetrics: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ])->setStatusCode(500);
        }
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

            // Expedientes de hoy (consulta directa a File)
            $db = \Config\Database::connect();
            
            // Configurar zona horaria de Guadalajara (GMT-6)
            date_default_timezone_set('America/Mexico_City');
            
            $todayCases = $db->table('File')
                ->where('DATE(RegistrationDate)', date('Y-m-d'));
            
            // Solo aplicar filtro de agencia si no es "todas las agencias"
            if ($agencyId && $agencyId !== 'null' && $agencyId !== null) {
                $todayCases->where('IdAgency', $agencyId);
            }
            
            $todayCases = $todayCases->countAllResults();

            // Expedientes del mes actual (consulta directa a File)
            $monthlyCases = $db->table('File')
                ->where('YEAR(RegistrationDate)', date('Y'))
                ->where('MONTH(RegistrationDate)', date('m'));
            
            // Solo aplicar filtro de agencia si no es "todas las agencias"
            if ($agencyId && $agencyId !== 'null' && $agencyId !== null) {
                $monthlyCases->where('IdAgency', $agencyId);
            }
            
            $monthlyCases = $monthlyCases->countAllResults();

            // Total de expedientes (consulta directa a File)
            $totalCases = $db->table('File');
            
            // Solo aplicar filtro de agencia si no es "todas las agencias"
            if ($agencyId && $agencyId !== 'null' && $agencyId !== null) {
                $totalCases->where('IdAgency', $agencyId);
            }
            
            $totalCases = $totalCases->countAllResults();

            // Expedientes del mes actual de la agencia seleccionada (consulta directa a File)
            $monthlyAgencyCases = $db->table('File')
                ->where('YEAR(RegistrationDate)', date('Y'))
                ->where('MONTH(RegistrationDate)', date('m'));
            
            // Solo aplicar filtro de agencia si no es "todas las agencias"
            if ($agencyId && $agencyId !== 'null' && $agencyId !== null) {
                $monthlyAgencyCases->where('IdAgency', $agencyId);
            }
            
            $monthlyAgencyCases = $monthlyAgencyCases->countAllResults();

            // Usuarios que tienen acceso a la agencia seleccionada
            $totalUsers = $db->table('Agency_User');
            
            // Solo aplicar filtro de agencia si no es "todas las agencias"
            if ($agencyId && $agencyId !== 'null' && $agencyId !== null) {
                $totalUsers->where('IdAgency', $agencyId);
            }
            
            $totalUsers = $totalUsers->countAllResults();

            // Nombre del mes actual
            $monthNames = [
                1 => 'Enero', 2 => 'Febrero', 3 => 'Marzo', 4 => 'Abril',
                5 => 'Mayo', 6 => 'Junio', 7 => 'Julio', 8 => 'Agosto',
                9 => 'Septiembre', 10 => 'Octubre', 11 => 'Noviembre', 12 => 'Diciembre'
            ];
            $monthlyName = $monthNames[date('n')]; // Mes actual

            $data = [
                'todayCases' => $todayCases,
                'monthlyCases' => $monthlyCases,
                'totalCases' => $totalCases,
                'totalUsers' => $totalUsers,
                'monthlyAgencyCases' => $monthlyAgencyCases,
                'monthlyName' => $monthlyName
            ];

            return $this->response->setJSON([
                'success' => true,
                'data' => $data
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en Analytics::getAgencyMetrics: ' . $e->getMessage());
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
            date_default_timezone_set('America/Mexico_City');

            $db = \Config\Database::connect();

            // Inicializar arrays para los 12 meses
            $entregados = array_fill(0, 12, 0);
            $canceladas = array_fill(0, 12, 0);
            $proceso = array_fill(0, 12, 0);

            // Consultar datos por mes para el año especificado
            for ($month = 1; $month <= 12; $month++) {
                $monthIndex = $month - 1; // Para el array (0-11)

                // Expedientes entregados (estados 4 "Liberado" y 6 "Liberado por Excepción")
                $entregadosQuery = $db->table('File')
                    ->where('YEAR(RegistrationDate)', $year)
                    ->where('MONTH(RegistrationDate)', $month)
                    ->whereIn('IdCurrentState', [4, 6]);
                
                if ($agencyId && $agencyId !== 'null' && $agencyId !== null) {
                    $entregadosQuery->where('IdAgency', $agencyId);
                }
                
                if ($idSeller && $idSeller !== 'null' && $idSeller !== null) {
                    $entregadosQuery->where('idSeller', $idSeller);
                }
                
                $entregados[$monthIndex] = $entregadosQuery->countAllResults();

                // Expedientes cancelados (estado 5 "Cancelado")
                $canceladasQuery = $db->table('File')
                    ->where('YEAR(RegistrationDate)', $year)
                    ->where('MONTH(RegistrationDate)', $month)
                    ->where('IdCurrentState', 5);
                
                if ($agencyId && $agencyId !== 'null' && $agencyId !== null) {
                    $canceladasQuery->where('IdAgency', $agencyId);
                }
                
                if ($idSeller && $idSeller !== 'null' && $idSeller !== null) {
                    $canceladasQuery->where('idSeller', $idSeller);
                }
                
                $canceladas[$monthIndex] = $canceladasQuery->countAllResults();

                // Expedientes en proceso (estados 1 "Integración", 2 "Liquidación", 3 "Liberación")
                $procesoQuery = $db->table('File')
                    ->where('YEAR(RegistrationDate)', $year)
                    ->where('MONTH(RegistrationDate)', $month)
                    ->whereIn('IdCurrentState', [1, 2, 3]);
                
                if ($agencyId && $agencyId !== 'null' && $agencyId !== null) {
                    $procesoQuery->where('IdAgency', $agencyId);
                }
                
                if ($idSeller && $idSeller !== 'null' && $idSeller !== null) {
                    $procesoQuery->where('idSeller', $idSeller);
                }
                
                $proceso[$monthIndex] = $procesoQuery->countAllResults();
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
            log_message('error', 'Error en Analytics::getTrendData: ' . $e->getMessage());
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

            // Configurar zona horaria de Guadalajara (GMT-6)
            date_default_timezone_set('America/Mexico_City');

            $db = \Config\Database::connect();

            // Base query para el mes actual
            $baseQuery = $db->table('File')
                ->where('YEAR(RegistrationDate)', date('Y'))
                ->where('MONTH(RegistrationDate)', date('m'));

            // Aplicar filtro de agencia si está presente
            if ($agencyId && $agencyId !== 'null' && $agencyId !== null) {
                $baseQuery->where('IdAgency', $agencyId);
            }

            // Expedientes entregados (estados 4 "Liberado" y 6 "Liberado por Excepción")
            $entregadosQuery = clone $baseQuery;
            $entregados = $entregadosQuery->whereIn('IdCurrentState', [4, 6])->countAllResults();

            // Expedientes cancelados (estado 5 "Cancelado")
            $canceladasQuery = clone $baseQuery;
            $canceladas = $canceladasQuery->where('IdCurrentState', 5)->countAllResults();

            // Expedientes en proceso (estados 1 "Integración", 2 "Liquidación", 3 "Liberación")
            $procesoQuery = clone $baseQuery;
            $proceso = $procesoQuery->whereIn('IdCurrentState', [1, 2, 3])->countAllResults();

            // Total de expedientes del mes
            $total = $entregados + $canceladas + $proceso;

            // Calcular porcentajes
            $entregadosPorcentaje = $total > 0 ? round(($entregados / $total) * 100, 1) : 0;
            $canceladasPorcentaje = $total > 0 ? round(($canceladas / $total) * 100, 1) : 0;
            $procesoPorcentaje = $total > 0 ? round(($proceso / $total) * 100, 1) : 0;

            $data = [
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

            return $this->response->setJSON(['success' => true, 'data' => $data]);

        } catch (\Exception $e) {
            log_message('error', 'Error en Analytics::getDistributionMetrics: ' . $e->getMessage());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener métricas de distribución',
                'error' => $e->getMessage()
            ])->setStatusCode(500);
        }
    }

    /**
     * GET /api/analytics/debug-file-status
     * Endpoint de debug para verificar los estados de los archivos
     */
    public function debugFileStatus()
    {
        try {
            $db = \Config\Database::connect();

            // Verificar si existe la tabla File_Status
            $fileStatusExists = $db->tableExists('File_Status');

            $data = [
                'file_status_table_exists' => $fileStatusExists
            ];

            if ($fileStatusExists) {
                // Obtener todos los estados disponibles
                $statuses = $db->table('File_Status')->get()->getResultArray();
                $data['file_statuses'] = $statuses;
            }

            // Obtener distribución de estados en la tabla File
            $currentStates = $db->table('File')
                ->select('IdCurrentState, COUNT(*) as count')
                ->groupBy('IdCurrentState')
                ->orderBy('count', 'DESC')
                ->get()
                ->getResultArray();

            $data['current_states_distribution'] = $currentStates;

            // Obtener algunos ejemplos de archivos con diferentes estados
            $sampleFiles = $db->table('File')
                ->select('Id, IdCurrentState, RegistrationDate, CloseDate')
                ->limit(10)
                ->get()
                ->getResultArray();

            $data['sample_files'] = $sampleFiles;

            return $this->response->setJSON(['success' => true, 'data' => $data]);

        } catch (\Exception $e) {
            log_message('error', 'Error en Analytics::debugFileStatus: ' . $e->getMessage());
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
            date_default_timezone_set('America/Mexico_City');

            // Consulta base para enero 2025
            $baseQuery = $db->table('File')
                ->where('YEAR(RegistrationDate)', 2025)
                ->where('MONTH(RegistrationDate)', 1);

            // Total de archivos en enero 2025
            $totalFiles = $baseQuery->countAllResults();

            // Expedientes entregados (estados 4 "Liberado" y 6 "Liberado por Excepción")
            $entregadosQuery = clone $baseQuery;
            $entregados = $entregadosQuery->whereIn('IdCurrentState', [4, 6])->countAllResults();

            // Expedientes cancelados (estado 5 "Cancelado")
            $canceladasQuery = clone $baseQuery;
            $canceladas = $canceladasQuery->where('IdCurrentState', 5)->countAllResults();

            // Expedientes en proceso (estados 1 "Integración", 2 "Liquidación", 3 "Liberación")
            $procesoQuery = clone $baseQuery;
            $proceso = $procesoQuery->whereIn('IdCurrentState', [1, 2, 3])->countAllResults();

            // Distribución por estado
            $distributionByState = $db->table('File')
                ->select('IdCurrentState, COUNT(*) as count')
                ->where('YEAR(RegistrationDate)', 2025)
                ->where('MONTH(RegistrationDate)', 1)
                ->groupBy('IdCurrentState')
                ->orderBy('count', 'DESC')
                ->get()
                ->getResultArray();

            // Algunos ejemplos de archivos de enero 2025
            $sampleFiles = $db->table('File')
                ->select('Id, IdCurrentState, RegistrationDate, CloseDate')
                ->where('YEAR(RegistrationDate)', 2025)
                ->where('MONTH(RegistrationDate)', 1)
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
            log_message('error', 'Error en Analytics::debugTrendJanuary2025: ' . $e->getMessage());
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
            date_default_timezone_set('America/Mexico_City');

            // Consulta para expedientes entregados en enero 2025
            $entregados = $db->table('File')
                ->where('YEAR(RegistrationDate)', 2025)
                ->where('MONTH(RegistrationDate)', 1)
                ->whereIn('IdCurrentState', [4, 6])
                ->countAllResults();

            // Consulta para distribución por estado
            $distributionByState = $db->table('File')
                ->select('IdCurrentState, COUNT(*) as count')
                ->where('YEAR(RegistrationDate)', 2025)
                ->where('MONTH(RegistrationDate)', 1)
                ->groupBy('IdCurrentState')
                ->orderBy('count', 'DESC')
                ->get()
                ->getResultArray();

            // Mostrar las consultas SQL manualmente
            $sqlQueries = [
                'entregados_query' => "SELECT COUNT(*) FROM `File` WHERE YEAR(RegistrationDate) = 2025 AND MONTH(RegistrationDate) = 1 AND IdCurrentState IN (4, 6)",
                'distribution_query' => "SELECT IdCurrentState, COUNT(*) as count FROM `File` WHERE YEAR(RegistrationDate) = 2025 AND MONTH(RegistrationDate) = 1 GROUP BY IdCurrentState ORDER BY count DESC"
            ];

            $data = [
                'entregados_january_2025' => $entregados,
                'distribution_by_state' => $distributionByState,
                'sql_queries' => $sqlQueries
            ];

            return $this->response->setJSON(['success' => true, 'data' => $data]);

        } catch (\Exception $e) {
            log_message('error', 'Error en Analytics::debugSqlQueries: ' . $e->getMessage());
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
            $fileTableExists = in_array('file', $tables) || in_array('File', $tables);
            
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
                $tableName = in_array('File', $tables) ? 'File' : 'file';
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
            date_default_timezone_set('America/Mexico_City');
            
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
            log_message('error', 'Error en Analytics::debugServerDate: ' . $e->getMessage());
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
            $todayFiles = $db->table('File')
                ->where('DATE(RegistrationDate)', $todayServer)
                ->get()
                ->getResultArray();
            
            // Verificar expedientes del día 6 de septiembre específicamente
            $september6Files = $db->table('File')
                ->where('DATE(RegistrationDate)', '2025-09-06')
                ->get()
                ->getResultArray();
            
            // Verificar expedientes del día 7 de septiembre específicamente
            $september7Files = $db->table('File')
                ->where('DATE(RegistrationDate)', '2025-09-07')
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
                'recent_files_sample' => $db->table('File')
                    ->orderBy('RegistrationDate', 'DESC')
                    ->limit(10)
                    ->get()
                    ->getResultArray()
            ];
            
            return $this->response->setJSON(['success' => true, 'data' => $result]);
            
        } catch (\Exception $e) {
            log_message('error', 'Error en Analytics::debugTodayFiles: ' . $e->getMessage());
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
            $agencyUserStructure = $db->getFieldData('Agency_User');
            
            // Verificar estructura de la tabla User
            $userStructure = $db->getFieldData('User');
            
            // Obtener algunos registros de ejemplo
            $agencyUserSample = $db->table('Agency_User')->limit(5)->get()->getResultArray();
            $userSample = $db->table('User')->limit(5)->get()->getResultArray();
            
            // Contar usuarios por agencia
            $usersByAgency = $db->table('Agency_User')
                ->select('IdAgency, COUNT(*) as user_count')
                ->groupBy('IdAgency')
                ->get()
                ->getResultArray();
            
            $result = [
                'agency_user_structure' => $agencyUserStructure,
                'user_structure' => $userStructure,
                'agency_user_sample' => $agencyUserSample,
                'user_sample' => $userSample,
                'users_by_agency' => $usersByAgency,
                'total_agency_user_relations' => $db->table('Agency_User')->countAllResults(),
                'total_users' => $db->table('User')->countAllResults()
            ];
            
            return $this->response->setJSON(['success' => true, 'data' => $result]);
            
        } catch (\Exception $e) {
            log_message('error', 'Error en Analytics::debugAgencyUsers: ' . $e->getMessage());
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
            $latestDate = $db->table('File')
                ->selectMax('RegistrationDate')
                ->get()
                ->getRowArray();
            
            // Obtener la fecha más antigua
            $oldestDate = $db->table('File')
                ->selectMin('RegistrationDate')
                ->get()
                ->getRowArray();
            
            // Contar registros por año
            $yearlyCount = $db->table('File')
                ->select('YEAR(RegistrationDate) as year, COUNT(*) as count')
                ->groupBy('YEAR(RegistrationDate)')
                ->orderBy('year', 'DESC')
                ->get()
                ->getResultArray();
            
            // Contar registros por mes del año actual
            $currentYear = date('Y');
            $monthlyCount = $db->table('File')
                ->select('MONTH(RegistrationDate) as month, COUNT(*) as count')
                ->where('YEAR(RegistrationDate)', $currentYear)
                ->groupBy('MONTH(RegistrationDate)')
                ->orderBy('month', 'ASC')
                ->get()
                ->getResultArray();
            
            $result = [
                'latest_date' => $latestDate['RegistrationDate'] ?? null,
                'oldest_date' => $oldestDate['RegistrationDate'] ?? null,
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
                'documents' => $this->getDocumentStats($filters),
                'processes' => $this->getProcessStats($filters),
                'agencies' => $this->getAgencyStats($filters),
                'system' => $this->getSystemMetrics($filters),
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
            log_message('error', 'Error en Analytics::exportAnalytics: ' . $e->getMessage());
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
            log_message('error', 'Error en Analytics::getUserActivityStats: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Obtener filtros de la petición
     */
    private function getFiltersFromRequest()
    {
        return [
            'start_date' => $this->request->getGet('start_date'),
            'end_date' => $this->request->getGet('end_date'),
            'user_id' => $this->request->getGet('user_id'),
            'idSeller' => $this->request->getGet('idSeller'),
            'agency_id' => $this->request->getGet('agency_id'),
            'process_id' => $this->request->getGet('process_id'),
            'document_type_id' => $this->request->getGet('document_type_id'),
            'year' => $this->request->getGet('year')
        ];
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
            $query = $db->table('File f')
                ->select('p.Name as processName, COUNT(f.Id) as totalCases')
                ->join('Process p', 'f.IdProcess = p.Id', 'left')
                ->groupBy('p.Id, p.Name')
                ->orderBy('totalCases', 'DESC');

            // Aplicar filtros
            if ($agencyId && $agencyId !== 'null' && $agencyId !== null) {
                $query->where('f.IdAgency', $agencyId);
            }
            
            if ($idSeller && $idSeller !== 'null' && $idSeller !== null) {
                $query->where('f.idSeller', $idSeller);
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
            log_message('error', 'Error en Analytics::getProcessDistribution: ' . $e->getMessage());
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
            $query = $db->table('File f')
                ->select('fs.Name as statusName, COUNT(f.Id) as totalCases')
                ->join('File_Status fs', 'f.IdCurrentState = fs.Id', 'left')
                ->groupBy('fs.Id, fs.Name')
                ->orderBy('totalCases', 'DESC');

            // Aplicar filtros
            if ($agencyId && $agencyId !== 'null' && $agencyId !== null) {
                $query->where('f.IdAgency', $agencyId);
            }
            
            if ($idSeller && $idSeller !== 'null' && $idSeller !== null) {
                $query->where('f.idSeller', $idSeller);
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
            log_message('error', 'Error en Analytics::getStatusDistribution: ' . $e->getMessage());
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
            date_default_timezone_set('America/Mexico_City');

            $db = \Config\Database::connect();

            // Obtener mes y año actual
            $currentYear = date('Y');
            $currentMonth = date('n'); // Mes sin ceros iniciales (1-12)

            // Consulta para obtener distribución por estatus del mes actual
            $query = $db->table('File f')
                ->select('fs.Name as statusName, COUNT(f.Id) as totalCases')
                ->join('File_Status fs', 'f.IdCurrentState = fs.Id', 'left')
                ->where('YEAR(f.RegistrationDate)', $currentYear)
                ->where('MONTH(f.RegistrationDate)', $currentMonth)
                ->groupBy('fs.Id, fs.Name')
                ->orderBy('totalCases', 'DESC');

            // Aplicar filtros
            if ($agencyId && $agencyId !== 'null' && $agencyId !== null) {
                $query->where('f.IdAgency', $agencyId);
            }
            
            if ($idSeller && $idSeller !== 'null' && $idSeller !== null) {
                $query->where('f.idSeller', $idSeller);
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
            log_message('error', 'Error en Analytics::getCurrentMonthStatusDistribution: ' . $e->getMessage());
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
            date_default_timezone_set('America/Mexico_City');

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

            // Generar datos para los meses anteriores
            for ($i = 1; $i <= $monthsToShow; $i++) {
                $targetMonth = $currentMonth - $i;
                $targetYear = $currentYear;

                // Ajustar año si el mes es negativo
                if ($targetMonth <= 0) {
                    $targetMonth += 12;
                    $targetYear--;
                }

                // Consulta para obtener datos del mes específico
                $query = $db->table('File f')
                    ->select('
                        COUNT(f.Id) as totalCases,
                        SUM(CASE WHEN f.IdCurrentState IN (4, 6) THEN 1 ELSE 0 END) as deliveredCases,
                        SUM(CASE WHEN f.IdCurrentState = 2 THEN 1 ELSE 0 END) as inProcessCases,
                        SUM(CASE WHEN f.IdCurrentState = 3 THEN 1 ELSE 0 END) as cancelledCases
                    ')
                    ->where('YEAR(f.RegistrationDate)', $targetYear)
                    ->where('MONTH(f.RegistrationDate)', $targetMonth);

                // Aplicar filtros
                if ($agencyId && $agencyId !== 'null' && $agencyId !== null) {
                    $query->where('f.IdAgency', $agencyId);
                }
                
                if ($idSeller && $idSeller !== 'null' && $idSeller !== null) {
                    $query->where('f.idSeller', $idSeller);
                }

                $result = $query->get()->getRowArray();

                $previousMonthsData[] = [
                    'month' => $monthNames[$targetMonth],
                    'year' => $targetYear,
                    'totalCases' => (int)($result['totalCases'] ?? 0),
                    'deliveredCases' => (int)($result['deliveredCases'] ?? 0),
                    'inProcessCases' => (int)($result['inProcessCases'] ?? 0),
                    'cancelledCases' => (int)($result['cancelledCases'] ?? 0)
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
            log_message('error', 'Error en Analytics::getPreviousMonthsData: ' . $e->getMessage());
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
            date_default_timezone_set('America/Mexico_City');

            $db = \Config\Database::connect();

            // Obtener mes y año actual
            $currentYear = date('Y');
            $currentMonth = date('n'); // Mes sin ceros iniciales (1-12)

            $query = $db->table('File f')
                ->select('fs.Name as statusName, COUNT(f.Id) as totalCases')
                ->join('File_Status fs', 'f.IdCurrentState = fs.Id', 'left')
                ->groupBy('fs.Id, fs.Name')
                ->orderBy('totalCases', 'DESC');

            // Excluir el mes actual
            $query->where('NOT (YEAR(f.RegistrationDate) = ' . $currentYear . ' AND MONTH(f.RegistrationDate) = ' . $currentMonth . ')');

            // Aplicar filtros
            if ($agencyId && $agencyId !== 'null' && $agencyId !== null) {
                $query->where('f.IdAgency', $agencyId);
            }
            
            if ($idSeller && $idSeller !== 'null' && $idSeller !== null) {
                $query->where('f.idSeller', $idSeller);
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
            log_message('error', 'Error en Analytics::getHistoricalStatusDistribution: ' . $e->getMessage());
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
     * Obtener distribución de expedientes por asesor para el mes actual
     */
    public function getAdvisorDistribution()
    {
        try {
            $filters = $this->getFiltersFromRequest();
            $agencyId = $filters['agency_id'] ?? null;
            $userId = $filters['user_id'] ?? null;

            // Configurar zona horaria de Guadalajara (GMT-6)
            date_default_timezone_set('America/Mexico_City');

            $db = \Config\Database::connect();

            // Obtener mes y año actual
            $currentYear = date('Y');
            $currentMonth = date('n'); // Mes sin ceros iniciales (1-12)

            $query = $db->table('File f')
                ->select('u.Name as advisorName, 
                         SUM(CASE WHEN fs.Name = "Entregado" OR fs.Name = "Liberado" OR fs.Name = "Completado" THEN 1 ELSE 0 END) as approved,
                         SUM(CASE WHEN fs.Name = "En Proceso" OR fs.Name = "Pendiente" OR fs.Name = "Liberación" OR fs.Name = "Integración" THEN 1 ELSE 0 END) as pending,
                         SUM(CASE WHEN fs.Name = "Cancelado" OR fs.Name = "Rechazado" THEN 1 ELSE 0 END) as rejected,
                         COUNT(f.Id) as total')
                ->join('File_Status fs', 'f.IdCurrentState = fs.Id', 'left')
                ->join('User u', 'f.idSeller = u.Id', 'left')
                ->where('YEAR(f.RegistrationDate)', $currentYear)
                ->where('MONTH(f.RegistrationDate)', $currentMonth)
                ->groupBy('u.Id, u.Name')
                ->having('total > 0')
                ->orderBy('total', 'DESC');

            // Aplicar filtros
            if ($agencyId && $agencyId !== 'null' && $agencyId !== null) {
                $query->where('f.IdAgency', $agencyId);
            }
            
            if ($userId && $userId !== 'null' && $userId !== null) {
                $query->where('f.idSeller', $userId);
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
            log_message('error', 'Error en getAdvisorDistribution: ' . $e->getMessage());
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
            date_default_timezone_set('America/Mexico_City');

            $db = \Config\Database::connect();

            // Obtener el lunes de la semana actual
            $currentDate = date('Y-m-d');
            $dayOfWeek = date('N', strtotime($currentDate)); // 1 = lunes, 7 = domingo
            $mondayOfWeek = date('Y-m-d', strtotime('-' . ($dayOfWeek - 1) . ' days', strtotime($currentDate)));
            $sundayOfWeek = date('Y-m-d', strtotime('+' . (7 - $dayOfWeek) . ' days', strtotime($currentDate)));

            $query = $db->table('File f')
                ->select('DATE(f.RegistrationDate) as day, 
                         DAYNAME(f.RegistrationDate) as dayName,
                         COUNT(f.Id) as count')
                ->where('DATE(f.RegistrationDate) >=', $mondayOfWeek)
                ->where('DATE(f.RegistrationDate) <=', $sundayOfWeek)
                ->groupBy('DATE(f.RegistrationDate), DAYNAME(f.RegistrationDate)')
                ->orderBy('DATE(f.RegistrationDate)', 'ASC');

            // Aplicar filtros
            if ($agencyId && $agencyId !== 'null' && $agencyId !== null) {
                $query->where('f.IdAgency', $agencyId);
            }
            
            if ($userId && $userId !== 'null' && $userId !== null) {
                $query->where('f.idSeller', $userId);
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
            log_message('error', 'Error en getWeeklyData: ' . $e->getMessage());
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

            log_message('info', 'getAttentionPeriod - agencyId: ' . $agencyId . ', userId: ' . $userId);

            // Configurar zona horaria de Guadalajara (GMT-6)
            date_default_timezone_set('America/Mexico_City');

            $db = \Config\Database::connect();

            // Primero verificar si existen expedientes con AttentionDate y CloseDate
            $countQuery = $db->table('File f')
                ->select('COUNT(f.Id) as total')
                ->where('f.AttentionDate IS NOT NULL')
                ->where('f.CloseDate IS NOT NULL')
                ->where('f.CloseDate >= f.AttentionDate');

            if ($agencyId && $agencyId !== 'null' && $agencyId !== null) {
                $countQuery->where('f.IdAgency', $agencyId);
            }
            
            if ($userId && $userId !== 'null' && $userId !== null) {
                $countQuery->where('f.idSeller', $userId);
            }

            $totalCount = $countQuery->get()->getRowArray();
            log_message('info', 'Total expedientes con fechas válidas: ' . $totalCount['total']);

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

            // Consulta principal con rangos
            $query = $db->table('File f')
                ->select('
                    CASE 
                        WHEN DATEDIFF(f.CloseDate, f.AttentionDate) <= 5 THEN "0-5"
                        WHEN DATEDIFF(f.CloseDate, f.AttentionDate) <= 10 THEN "5-10"
                        WHEN DATEDIFF(f.CloseDate, f.AttentionDate) <= 15 THEN "10-15"
                        ELSE "15+"
                    END as period_range,
                    CASE 
                        WHEN DATEDIFF(f.CloseDate, f.AttentionDate) <= 5 THEN "0 - 5 Días"
                        WHEN DATEDIFF(f.CloseDate, f.AttentionDate) <= 10 THEN "5 - 10 Días"
                        WHEN DATEDIFF(f.CloseDate, f.AttentionDate) <= 15 THEN "10 - 15 Días"
                        ELSE "> 15 Días"
                    END as period_label,
                    COUNT(f.Id) as count
                ')
                ->where('f.AttentionDate IS NOT NULL')
                ->where('f.CloseDate IS NOT NULL')
                ->where('f.CloseDate >= f.AttentionDate')
                ->groupBy('period_range, period_label')
                ->orderBy('period_range', 'ASC');

            // Aplicar filtros
            if ($agencyId && $agencyId !== 'null' && $agencyId !== null) {
                $query->where('f.IdAgency', $agencyId);
            }
            
            if ($userId && $userId !== 'null' && $userId !== null) {
                $query->where('f.idSeller', $userId);
            }

            $results = $query->get()->getResultArray();
            log_message('info', 'Resultados de la consulta: ' . json_encode($results));
            
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

            log_message('info', 'Datos finales: ' . json_encode($finalData));

            return $this->response->setJSON([
                'success' => true,
                'data' => $finalData
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en getAttentionPeriod: ' . $e->getMessage());
            log_message('error', 'Stack trace: ' . $e->getTraceAsString());
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

            log_message('info', 'getCurrentMonthAttention - agencyId: ' . $agencyId . ', userId: ' . $userId);

            // Configurar zona horaria de Guadalajara (GMT-6)
            date_default_timezone_set('America/Mexico_City');

            $db = \Config\Database::connect();

            // Obtener mes y año actual
            $currentYear = date('Y');
            $currentMonth = date('n'); // Mes sin ceros iniciales (1-12)

            // Primero verificar si existen expedientes con AttentionDate y CloseDate del mes actual
            $countQuery = $db->table('File f')
                ->select('COUNT(f.Id) as total')
                ->where('f.AttentionDate IS NOT NULL')
                ->where('f.CloseDate IS NOT NULL')
                ->where('f.CloseDate >= f.AttentionDate')
                ->where('YEAR(f.AttentionDate)', $currentYear)
                ->where('MONTH(f.AttentionDate)', $currentMonth);

            if ($agencyId && $agencyId !== 'null' && $agencyId !== null) {
                $countQuery->where('f.IdAgency', $agencyId);
            }
            
            if ($userId && $userId !== 'null' && $userId !== null) {
                $countQuery->where('f.idSeller', $userId);
            }

            $totalCount = $countQuery->get()->getRowArray();
            log_message('info', 'Total expedientes del mes actual con fechas válidas: ' . $totalCount['total']);

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

            // Consulta principal con rangos para el mes actual
            $query = $db->table('File f')
                ->select('
                    CASE 
                        WHEN DATEDIFF(f.CloseDate, f.AttentionDate) <= 5 THEN "0-5"
                        WHEN DATEDIFF(f.CloseDate, f.AttentionDate) <= 10 THEN "5-10"
                        WHEN DATEDIFF(f.CloseDate, f.AttentionDate) <= 15 THEN "10-15"
                        ELSE "15+"
                    END as period_range,
                    CASE 
                        WHEN DATEDIFF(f.CloseDate, f.AttentionDate) <= 5 THEN "0 - 5 Días"
                        WHEN DATEDIFF(f.CloseDate, f.AttentionDate) <= 10 THEN "5 - 10 Días"
                        WHEN DATEDIFF(f.CloseDate, f.AttentionDate) <= 15 THEN "10 - 15 Días"
                        ELSE "> 15 Días"
                    END as period_label,
                    COUNT(f.Id) as count
                ')
                ->where('f.AttentionDate IS NOT NULL')
                ->where('f.CloseDate IS NOT NULL')
                ->where('f.CloseDate >= f.AttentionDate')
                ->where('YEAR(f.AttentionDate)', $currentYear)
                ->where('MONTH(f.AttentionDate)', $currentMonth)
                ->groupBy('period_range, period_label')
                ->orderBy('period_range', 'ASC');

            // Aplicar filtros
            if ($agencyId && $agencyId !== 'null' && $agencyId !== null) {
                $query->where('f.IdAgency', $agencyId);
            }
            
            if ($userId && $userId !== 'null' && $userId !== null) {
                $query->where('f.idSeller', $userId);
            }

            $results = $query->get()->getResultArray();
            log_message('info', 'Resultados del mes actual: ' . json_encode($results));
            
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

            log_message('info', 'Datos finales del mes actual: ' . json_encode($finalData));

            return $this->response->setJSON([
                'success' => true,
                'data' => $finalData
            ]);

        } catch (\Exception $e) {
            log_message('error', 'Error en getCurrentMonthAttention: ' . $e->getMessage());
            log_message('error', 'Stack trace: ' . $e->getTraceAsString());
            return $this->response->setJSON([
                'success' => false,
                'message' => 'Error al obtener datos de período de atención del mes actual: ' . $e->getMessage()
            ])->setStatusCode(500);
        }
    }
}
