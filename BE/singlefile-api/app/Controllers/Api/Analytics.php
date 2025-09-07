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
     * GET /api/analytics/documents/stats
     * Obtener estadísticas de documentos
     */
    public function getDocumentStats($filters = [])
    {
        try {
            $builder = $this->documentModel->builder();
            
            // Aplicar filtros
            if (!empty($filters['start_date'])) {
                $builder->where('created_at >=', $filters['start_date']);
            }
            if (!empty($filters['end_date'])) {
                $builder->where('created_at <=', $filters['end_date']);
            }
            if (!empty($filters['agency_id'])) {
                $builder->where('agency_id', $filters['agency_id']);
            }
            if (!empty($filters['document_type_id'])) {
                $builder->where('document_type_id', $filters['document_type_id']);
            }

            // Estadísticas básicas
            $totalDocuments = $builder->countAllResults(false);

            // Documentos por tipo
            $documentsByType = $this->documentModel->builder()
                ->select('dt.name as type, COUNT(*) as count')
                ->join('document_types dt', 'dt.id = documents.document_type_id')
                ->groupBy('dt.name')
                ->get()
                ->getResultArray();

            // Documentos por estado
            $documentsByStatus = $this->documentModel->builder()
                ->select('status, COUNT(*) as count')
                ->groupBy('status')
                ->get()
                ->getResultArray();

            // Documentos por agencia
            $documentsByAgency = $this->documentModel->builder()
                ->select('a.name as agency, COUNT(*) as count')
                ->join('agencies a', 'a.id = documents.agency_id')
                ->groupBy('a.name')
                ->orderBy('count', 'DESC')
                ->limit(10)
                ->get()
                ->getResultArray();

            // Tendencia mensual
            $monthlyTrend = $this->documentModel->builder()
                ->select("DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count")
                ->where('created_at >=', date('Y-m-01', strtotime('-12 months')))
                ->groupBy('month')
                ->orderBy('month', 'ASC')
                ->get()
                ->getResultArray();

            return [
                'totalDocuments' => $totalDocuments,
                'documentsByType' => $documentsByType,
                'documentsByStatus' => $documentsByStatus,
                'documentsByAgency' => $documentsByAgency,
                'monthlyTrend' => $monthlyTrend
            ];

        } catch (\Exception $e) {
            log_message('error', 'Error en Analytics::getDocumentStats: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * GET /api/analytics/processes/stats
     * Obtener estadísticas de procesos
     */
    public function getProcessStats($filters = [])
    {
        try {
            $builder = $this->processModel->builder();
            
            // Aplicar filtros
            if (!empty($filters['start_date'])) {
                $builder->where('created_at >=', $filters['start_date']);
            }
            if (!empty($filters['end_date'])) {
                $builder->where('created_at <=', $filters['end_date']);
            }
            if (!empty($filters['agency_id'])) {
                $builder->where('agency_id', $filters['agency_id']);
            }

            // Estadísticas básicas
            $totalProcesses = $builder->countAllResults(false);

            // Procesos por estado
            $processesByStatus = $this->processModel->builder()
                ->select('status, COUNT(*) as count')
                ->groupBy('status')
                ->get()
                ->getResultArray();

            // Procesos por agencia
            $processesByAgency = $this->processModel->builder()
                ->select('a.name as agency, COUNT(*) as count')
                ->join('agencies a', 'a.id = processes.agency_id')
                ->groupBy('a.name')
                ->orderBy('count', 'DESC')
                ->limit(10)
                ->get()
                ->getResultArray();

            // Tiempo promedio de procesamiento
            $averageProcessingTime = $this->processModel->builder()
                ->select('AVG(TIMESTAMPDIFF(MINUTE, created_at, updated_at)) as avg_time')
                ->where('status', 'completed')
                ->get()
                ->getRow()->avg_time ?? 0;

            // Tendencia mensual
            $monthlyTrend = $this->processModel->builder()
                ->select("DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count")
                ->where('created_at >=', date('Y-m-01', strtotime('-12 months')))
                ->groupBy('month')
                ->orderBy('month', 'ASC')
                ->get()
                ->getResultArray();

            return [
                'totalProcesses' => $totalProcesses,
                'processesByStatus' => $processesByStatus,
                'processesByAgency' => $processesByAgency,
                'averageProcessingTime' => (int)$averageProcessingTime,
                'monthlyTrend' => $monthlyTrend
            ];

        } catch (\Exception $e) {
            log_message('error', 'Error en Analytics::getProcessStats: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * GET /api/analytics/agencies/stats
     * Obtener estadísticas de agencias
     */
    public function getAgencyStats($filters = [])
    {
        try {
            // Estadísticas básicas
            $totalAgencies = $this->agencyModel->countAllResults();
            $activeAgencies = $this->agencyModel->where('status', 'active')->countAllResults();

            // Agencias por región
            $agenciesByRegion = $this->agencyModel->builder()
                ->select('region, COUNT(*) as count')
                ->groupBy('region')
                ->get()
                ->getResultArray();

            // Top agencias por rendimiento
            $topPerformingAgencies = $this->agencyModel->builder()
                ->select('a.name as agency, 
                         COUNT(DISTINCT d.id) as documents,
                         COUNT(DISTINCT p.id) as processes')
                ->join('documents d', 'd.agency_id = a.id', 'left')
                ->join('processes p', 'p.agency_id = a.id', 'left')
                ->groupBy('a.id, a.name')
                ->orderBy('documents', 'DESC')
                ->limit(10)
                ->get()
                ->getResultArray();

            return [
                'totalAgencies' => $totalAgencies,
                'activeAgencies' => $activeAgencies,
                'agenciesByRegion' => $agenciesByRegion,
                'topPerformingAgencies' => $topPerformingAgencies
            ];

        } catch (\Exception $e) {
            log_message('error', 'Error en Analytics::getAgencyStats: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * GET /api/analytics/system/metrics
     * Obtener métricas del sistema
     */
    public function getSystemMetrics($filters = [])
    {
        try {
            $totalUsers = $this->userModel->countAllResults();
            $activeUsers = $this->userModel->where('status', 'active')->countAllResults();
            $totalDocuments = $this->documentModel->countAllResults();
            $totalProcesses = $this->processModel->countAllResults();
            $totalAgencies = $this->agencyModel->countAllResults();

            return [
                'totalUsers' => $totalUsers,
                'activeUsers' => $activeUsers,
                'totalDocuments' => $totalDocuments,
                'totalProcesses' => $totalProcesses,
                'totalAgencies' => $totalAgencies,
                'systemUptime' => 99.9, // Esto debería calcularse desde logs del sistema
                'averageResponseTime' => 150 // Esto debería calcularse desde logs de performance
            ];

        } catch (\Exception $e) {
            log_message('error', 'Error en Analytics::getSystemMetrics: ' . $e->getMessage());
            throw $e;
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
            'agency_id' => $this->request->getGet('agency_id'),
            'process_id' => $this->request->getGet('process_id'),
            'document_type_id' => $this->request->getGet('document_type_id')
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
}
