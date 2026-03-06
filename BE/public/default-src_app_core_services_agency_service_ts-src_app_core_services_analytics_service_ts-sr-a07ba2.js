"use strict";
(self["webpackChunkvex"] = self["webpackChunkvex"] || []).push([["default-src_app_core_services_agency_service_ts-src_app_core_services_analytics_service_ts-sr-a07ba2"],{

/***/ 92883:
/*!*************************************************!*\
  !*** ./src/app/core/services/agency.service.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AgencyService: () => (/* binding */ AgencyService)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ 54860);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ 79736);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _api_base_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api-base.service */ 14461);





class AgencyService {
  constructor(http, apiBaseService) {
    this.http = http;
    this.apiBaseService = apiBaseService;
    this.API_URL = 'agency';
  }
  /**
   * Obtener todas las agencias con filtros y paginación
   */
  getAgencies(params = {}) {
    let httpParams = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpParams();
    if (params.enabled !== undefined) {
      httpParams = httpParams.set('enabled', params.enabled.toString());
    }
    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }
    if (params.limit) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }
    if (params.offset) {
      httpParams = httpParams.set('offset', params.offset.toString());
    }
    if (params.sort_by) {
      httpParams = httpParams.set('sort_by', params.sort_by);
    }
    if (params.sort_order) {
      httpParams = httpParams.set('sort_order', params.sort_order);
    }
    const url = this.apiBaseService.buildApiUrl(this.API_URL);
    console.log('🏢 AgencyService - URL construida:', url);
    console.log('🏢 AgencyService - Parámetros:', httpParams);
    return this.http.get(url, {
      params: httpParams
    });
  }
  /**
   * Obtener agencias con paginación avanzada
   */
  getAgenciesPaginated(page = 1, perPage = 20, filters = {}, sortBy = 'Name', sortOrder = 'ASC') {
    const offset = (page - 1) * perPage;
    let httpParams = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpParams().set('limit', perPage.toString()).set('offset', offset.toString()).set('sort_by', sortBy).set('sort_order', sortOrder);
    // Aplicar filtros
    if (filters.name) {
      httpParams = httpParams.set('search', filters.name);
    }
    if (filters.enabled !== undefined) {
      httpParams = httpParams.set('enabled', filters.enabled.toString());
    }
    return this.http.get(this.apiBaseService.buildApiUrl(this.API_URL), {
      params: httpParams
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => {
      if (response.success && response.data) {
        const totalPages = Math.ceil(response.data.total / perPage);
        return {
          agencies: response.data.agencies,
          total: response.data.total,
          per_page: perPage,
          current_page: page,
          total_pages: totalPages,
          has_next: page < totalPages,
          has_prev: page > 1
        };
      }
      throw new Error(response.message || 'Error al obtener agencias');
    }));
  }
  /**
   * Obtener agencia por ID
   */
  getAgencyById(id) {
    return this.http.get(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}`);
  }
  /**
   * Crear nueva agencia
   */
  createAgency(agency) {
    return this.http.post(this.apiBaseService.buildApiUrl(this.API_URL), agency);
  }
  /**
   * Actualizar agencia existente
   */
  updateAgency(id, agency) {
    return this.http.put(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}`, agency);
  }
  /**
   * Eliminar agencia (soft delete por defecto)
   */
  deleteAgency(id, force = false) {
    const params = force ? new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpParams().set('force', 'true') : new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpParams();
    return this.http.delete(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}`, {
      params
    });
  }
  /**
   * Cambiar estado de habilitación de una agencia
   */
  toggleAgencyStatus(id) {
    return this.http.patch(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}/toggle-status`, {});
  }
  /**
   * Buscar agencias por nombre
   */
  searchAgencies(query) {
    const params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpParams().set('q', query);
    return this.http.get(`${this.apiBaseService.buildApiUrl(this.API_URL)}/search`, {
      params
    });
  }
  /**
   * Obtener estadísticas de agencias
   */
  getAgencyStats() {
    return this.http.get(`${this.apiBaseService.buildApiUrl(this.API_URL)}/stats`);
  }
  /**
   * Obtener agencias habilitadas (para dropdowns, etc.)
   */
  getEnabledAgencies() {
    return this.getAgencies({
      enabled: true,
      sort_by: 'Name',
      sort_order: 'ASC'
    });
  }
  /**
   * Validar datos de agencia antes de enviar
   */
  validateAgencyData(agency) {
    const errors = [];
    if (!agency.Name || agency.Name.trim().length < 3) {
      errors.push('El nombre debe tener al menos 3 caracteres');
    }
    if (agency.Name && agency.Name.length > 600) {
      errors.push('El nombre no puede exceder 600 caracteres');
    }
    if (agency.IdAgency && agency.IdAgency.length > 50) {
      errors.push('El IdAgency no puede exceder 50 caracteres');
    }
    if (agency.Enabled !== undefined && ![0, 1].includes(agency.Enabled)) {
      errors.push('El estado debe ser 0 o 1');
    }
    return {
      valid: errors.length === 0,
      errors
    };
  }
  /**
   * Preparar datos de agencia para envío
   */
  prepareAgencyData(agency, isUpdate = false) {
    const preparedData = {};
    if (agency.Name) {
      preparedData.Name = agency.Name.trim();
    }
    if (agency.IdAgency !== undefined) {
      preparedData.IdAgency = agency.IdAgency || undefined;
    }
    if (agency.IdAgency !== undefined) {
      preparedData.IdAgency = agency.IdAgency || undefined;
    }
    if (agency.Enabled !== undefined) {
      preparedData.Enabled = agency.Enabled;
    }
    return preparedData;
  }
  /**
   * Mapear respuesta de agencia a interfaz local
   */
  mapAgencyResponse(response) {
    return {
      Id: response.Id,
      Name: response.Name,
      IdAgency: response.IdAgency || undefined,
      Enabled: response.Enabled,
      RegistrationDate: response.RegistrationDate || undefined,
      UpdateDate: response.UpdateDate || undefined,
      IdLastUserUpdate: response.IdLastUserUpdate || undefined,
      LastUserUpdateName: response.LastUserUpdateName || undefined
    };
  }
  /**
   * Mapear múltiples respuestas de agencias
   */
  mapAgenciesResponse(response) {
    return response.map(agency => this.mapAgencyResponse(agency));
  }
  static #_ = this.ɵfac = function AgencyService_Factory(t) {
    return new (t || AgencyService)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpClient), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_api_base_service__WEBPACK_IMPORTED_MODULE_0__.ApiBaseService));
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({
    token: AgencyService,
    factory: AgencyService.ɵfac,
    providedIn: 'root'
  });
}

/***/ }),

/***/ 908:
/*!****************************************************!*\
  !*** ./src/app/core/services/analytics.service.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AnalyticsService: () => (/* binding */ AnalyticsService)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common/http */ 54860);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 58071);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 33839);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs */ 12235);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ 79736);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ 13738);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ 2389);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs */ 84980);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../environments/environment */ 20553);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ 61699);







class AnalyticsService {
  constructor(http) {
    this.http = http;
    this.baseUrl = `${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiBaseUrl}/api`;
    // Subjects para manejar estado reactivo
    this.filtersSubject = new rxjs__WEBPACK_IMPORTED_MODULE_1__.BehaviorSubject({});
    this.filters$ = this.filtersSubject.asObservable();
  }
  // Métodos para manejar filtros
  setFilters(filters) {
    this.filtersSubject.next(filters);
  }
  getFilters() {
    return this.filtersSubject.value;
  }
  clearFilters() {
    this.filtersSubject.next({});
  }
  // Métodos para obtener estadísticas de actividad de usuarios
  getUserActivityStats(filters) {
    const params = this.buildParams(filters);
    return this.http.get(`${this.baseUrl}/user-activity-logs/stats`, {
      params
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => response.data || response), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.tap)(data => console.log('User Activity Stats:', data)));
  }
  getUserActivityLogs(filters, limit = 100, offset = 0) {
    const params = this.buildParams(filters);
    params.set('limit', limit.toString());
    params.set('offset', offset.toString());
    return this.http.get(`${this.baseUrl}/user-activity-logs`, {
      params
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => response.data || response), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.tap)(data => console.log('User Activity Logs:', data)));
  }
  // Métodos para obtener estadísticas de documentos
  getDocumentStats(filters) {
    const params = this.buildParams(filters);
    return this.http.get(`${this.baseUrl}/analytics/widget-document-statistics`, {
      params
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => response.data || response), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.tap)(data => console.log('Document Stats:', data)));
  }
  // Métodos para obtener estadísticas de procesos
  getProcessStats(filters) {
    const params = this.buildParams(filters);
    return this.http.get(`${this.baseUrl}/analytics/widget-process-statistics`, {
      params
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => response.data || response), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.tap)(data => console.log('Process Stats:', data)));
  }
  // Métodos para obtener estadísticas de agencias
  getAgencyStats(filters) {
    const params = this.buildParams(filters);
    return this.http.get(`${this.baseUrl}/analytics/widget-agency-statistics`, {
      params
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => response.data || response), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.tap)(data => console.log('Agency Stats:', data)));
  }
  // Métodos para obtener métricas específicas de agencia
  getAgencyMetrics(filters) {
    const params = this.buildParams(filters);
    console.log('🔧 AnalyticsService: getAgencyMetrics called with filters:', filters);
    console.log('🔧 AnalyticsService: Built params:', params.toString());
    console.log('🔧 AnalyticsService: Full URL:', `${this.baseUrl}/analytics/widget-agency-specific-metrics?${params.toString()}`);
    return this.http.get(`${this.baseUrl}/analytics/widget-agency-specific-metrics`, {
      params
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => response.data || response), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.tap)(data => console.log('🔧 AnalyticsService: Received Agency Metrics:', data)));
  }
  getDistributionMetrics(filters) {
    const params = this.buildParams(filters);
    return this.http.get(`${this.baseUrl}/analytics/widget-file-distribution-metrics`, {
      params
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => response.data || response), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.tap)(data => console.log('Distribution Metrics:', data)));
  }
  getProcessDistribution(filters) {
    const params = this.buildParams(filters);
    console.log('🔧 AnalyticsService: getProcessDistribution called with filters:', filters);
    console.log('🔧 AnalyticsService: Built params:', params.toString());
    console.log('🔧 AnalyticsService: Full URL:', `${this.baseUrl}/analytics/widget-process-distribution?${params.toString()}`);
    return this.http.get(`${this.baseUrl}/analytics/widget-process-distribution`, {
      params
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => response.data || response), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.tap)(data => console.log('🔧 AnalyticsService: Received Process Distribution:', data)));
  }
  getStatusDistribution(filters) {
    const params = this.buildParams(filters);
    console.log('🔧 AnalyticsService: getStatusDistribution called with filters:', filters);
    console.log('🔧 AnalyticsService: Built params:', params.toString());
    console.log('🔧 AnalyticsService: Full URL:', `${this.baseUrl}/analytics/widget-status-distribution?${params.toString()}`);
    return this.http.get(`${this.baseUrl}/analytics/widget-status-distribution`, {
      params
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => response.data || response), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.tap)(data => console.log('🔧 AnalyticsService: Received Status Distribution:', data)));
  }
  getCurrentMonthStatusDistribution(filters) {
    const params = this.buildParams(filters);
    console.log('🔧 AnalyticsService: getCurrentMonthStatusDistribution called with filters:', filters);
    console.log('🔧 AnalyticsService: Built params:', params.toString());
    console.log('🔧 AnalyticsService: Full URL:', `${this.baseUrl}/analytics/widget-current-month-status?${params.toString()}`);
    return this.http.get(`${this.baseUrl}/analytics/widget-current-month-status`, {
      params
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => response.data || response), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.tap)(data => console.log('🔧 AnalyticsService: Received Current Month Status Distribution:', data)));
  }
  getPreviousMonthsData(filters) {
    const params = this.buildParams(filters);
    console.log('🔧 AnalyticsService: getPreviousMonthsData called with filters:', filters);
    console.log('🔧 AnalyticsService: Built params:', params.toString());
    console.log('🔧 AnalyticsService: Full URL:', `${this.baseUrl}/analytics/widget-previous-months?${params.toString()}`);
    return this.http.get(`${this.baseUrl}/analytics/widget-previous-months`, {
      params
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => response.data || response), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.tap)(data => console.log('🔧 AnalyticsService: Received Previous Months Data:', data)));
  }
  getHistoricalStatusDistribution(filters) {
    const params = this.buildParams(filters);
    console.log('🔧 AnalyticsService: getHistoricalStatusDistribution called with filters:', filters);
    console.log('🔧 AnalyticsService: Built params:', params.toString());
    console.log('🔧 AnalyticsService: Full URL:', `${this.baseUrl}/analytics/widget-historical-status?${params.toString()}`);
    return this.http.get(`${this.baseUrl}/analytics/widget-historical-status`, {
      params
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => response.data || response), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.tap)(data => console.log('🔧 AnalyticsService: Received Historical Status Distribution:', data)));
  }
  getTrendData(filters) {
    const params = this.buildParams(filters);
    return this.http.get(`${this.baseUrl}/analytics/widget-file-trend-chart`, {
      params
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => response.data || response), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.tap)(data => console.log('Trend Data:', data)));
  }
  // Métodos para obtener métricas del sistema
  getSystemMetrics() {
    return (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.combineLatest)([this.http.get(`${this.baseUrl}/analytics/widget-system-overview-metrics`), this.http.get(`${this.baseUrl}/analytics/widget-document-statistics`), this.http.get(`${this.baseUrl}/analytics/widget-process-statistics`), this.http.get(`${this.baseUrl}/analytics/widget-agency-statistics`)]).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(([userStats, docStats, processStats, agencyStats]) => {
      return {
        totalUsers: userStats.data?.totalUsers || 0,
        activeUsers: userStats.data?.activeUsers || 0,
        totalDocuments: docStats.data?.totalDocuments || 0,
        totalProcesses: processStats.data?.totalProcesses || 0,
        totalAgencies: agencyStats.data?.totalAgencies || 0,
        systemUptime: 99.9,
        averageResponseTime: 150 // Esto debería venir del backend
      };
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.tap)(data => console.log('System Metrics:', data)));
  }
  // Método para obtener datos combinados del dashboard
  getDashboardData(filters) {
    return (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.combineLatest)([this.getUserActivityStats(filters), this.getDocumentStats(filters), this.getProcessStats(filters), this.getAgencyStats(filters), this.getSystemMetrics()]).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(([userActivity, documents, processes, agencies, system]) => ({
      userActivity,
      documents,
      processes,
      agencies,
      system
    })));
  }
  // Método para exportar datos
  exportAnalytics(format, filters) {
    const params = this.buildParams(filters);
    params.set('format', format);
    return this.http.get(`${this.baseUrl}/analytics/export`, {
      params,
      responseType: 'blob'
    });
  }
  // Método auxiliar para construir parámetros de consulta
  buildParams(filters) {
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_5__.HttpParams();
    if (filters) {
      // Manejar filtros de fecha (prioridad: dateRange > startDate/endDate individuales)
      if (filters.dateRange && filters.dateRange.startDate && filters.dateRange.endDate) {
        params = params.set('start_date', filters.dateRange.startDate.toISOString().split('T')[0]);
        params = params.set('end_date', filters.dateRange.endDate.toISOString().split('T')[0]);
      } else {
        if (filters.startDate) params = params.set('start_date', filters.startDate);
        if (filters.endDate) params = params.set('end_date', filters.endDate);
      }
      if (filters.userId) params = params.set('user_id', filters.userId.toString());
      if (filters.agencyId) params = params.set('agency_id', filters.agencyId.toString());
      if (filters.agency_id) params = params.set('agency_id', filters.agency_id.toString()); // Agregado para compatibilidad
      if (filters.idSeller) params = params.set('idSeller', filters.idSeller.toString()); // Agregado para trend chart
      if (filters.year) params = params.set('year', filters.year.toString()); // Agregado para trend chart
      if (filters.processId) params = params.set('process_id', filters.processId.toString());
      if (filters.documentTypeId) params = params.set('document_type_id', filters.documentTypeId.toString());
    }
    return params;
  }
  // Método para obtener distribución de expedientes por asesor
  getAdvisorDistribution(agencyId, userId) {
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_5__.HttpParams();
    if (agencyId) {
      params = params.set('agency_id', agencyId);
    }
    if (userId) {
      params = params.set('user_id', userId);
    }
    return this.http.get(`${this.baseUrl}/analytics/advisor-distribution`, {
      params
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => {
      if (response && response.success && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_6__.catchError)(error => {
      console.error('Error en getAdvisorDistribution:', error);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_7__.of)([]);
    }));
  }
  getWeeklyData(agencyId, userId) {
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_5__.HttpParams();
    if (agencyId) {
      params = params.set('agency_id', agencyId);
    }
    if (userId) {
      params = params.set('user_id', userId);
    }
    return this.http.get(`${this.baseUrl}/analytics/weekly-data`, {
      params
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => {
      if (response && response.success && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_6__.catchError)(error => {
      console.error('Error en getWeeklyData:', error);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_7__.of)([]);
    }));
  }
  getAttentionPeriodData(agencyId, userId) {
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_5__.HttpParams();
    if (agencyId) {
      params = params.set('agency_id', agencyId);
    }
    if (userId) {
      params = params.set('user_id', userId);
    }
    return this.http.get(`${this.baseUrl}/analytics/attention-period`, {
      params
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => {
      if (response && response.success && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_6__.catchError)(error => {
      console.error('Error en getAttentionPeriodData:', error);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_7__.of)([]);
    }));
  }
  getCurrentMonthAttentionData(agencyId, userId) {
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_5__.HttpParams();
    if (agencyId) {
      params = params.set('agency_id', agencyId);
    }
    if (userId) {
      params = params.set('user_id', userId);
    }
    return this.http.get(`${this.baseUrl}/analytics/current-month-attention`, {
      params
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => {
      if (response && response.success && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_6__.catchError)(error => {
      console.error('Error en getCurrentMonthAttentionData:', error);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_7__.of)([]);
    }));
  }
  /**
   * Obtener datos de expedientes liberados del mes actual
   */
  getCurrentMonthLiberated(agencyId, userId) {
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_5__.HttpParams();
    if (agencyId) {
      params = params.set('agency_id', agencyId);
    }
    if (userId) {
      params = params.set('user_id', userId);
    }
    return this.http.get(`${this.baseUrl}/analytics/current-month-liberated`, {
      params
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => {
      if (response && response.success && response.data) {
        return response.data;
      }
      return {
        total: 0,
        month: '',
        year: new Date().getFullYear()
      };
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_6__.catchError)(error => {
      console.error('Error en getCurrentMonthLiberated:', error);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_7__.of)({
        total: 0,
        month: '',
        year: new Date().getFullYear()
      });
    }));
  }
  /**
   * Obtener datos de expedientes liberados totales (toda la historia)
   */
  getTotalLiberated(agencyId, userId) {
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_5__.HttpParams();
    if (agencyId) {
      params = params.set('agency_id', agencyId);
    }
    if (userId) {
      params = params.set('user_id', userId);
    }
    return this.http.get(`${this.baseUrl}/analytics/total-liberated`, {
      params
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => {
      if (response && response.success && response.data) {
        return response.data;
      }
      return {
        total: 0
      };
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_6__.catchError)(error => {
      console.error('Error en getTotalLiberated:', error);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_7__.of)({
        total: 0
      });
    }));
  }
  getOrdersByAttentionPeriod(range, agencyId, userId, currentMonth, liberatedOnly) {
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_5__.HttpParams();
    params = params.set('range', range);
    if (agencyId) {
      params = params.set('agency_id', agencyId);
    }
    if (userId) {
      params = params.set('user_id', userId);
    }
    if (currentMonth) {
      params = params.set('current_month', 'true');
    }
    if (liberatedOnly) {
      params = params.set('liberated_only', 'true');
    }
    return this.http.get(`${this.baseUrl}/analytics/orders-by-attention-period`, {
      params
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => {
      if (response && response.success && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_6__.catchError)(error => {
      console.error('Error en getOrdersByAttentionPeriod:', error);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_7__.of)([]);
    }));
  }
  // Métodos para obtener datos en tiempo real (para futuras implementaciones con WebSockets)
  getRealTimeMetrics() {
    // Esto se implementará cuando agreguemos WebSockets
    return new rxjs__WEBPACK_IMPORTED_MODULE_8__.Observable(observer => {
      // Placeholder para implementación futura
      observer.next({});
    });
  }
  // Método para obtener métricas de rendimiento
  getPerformanceMetrics() {
    return this.http.get(`${this.baseUrl}/analytics/performance`).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => response.data || response), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.tap)(data => console.log('Performance Metrics:', data)));
  }
  static #_ = this.ɵfac = function AnalyticsService_Factory(t) {
    return new (t || AnalyticsService)(_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_5__.HttpClient));
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefineInjectable"]({
    token: AnalyticsService,
    factory: AnalyticsService.ɵfac,
    providedIn: 'root'
  });
}

/***/ }),

/***/ 44907:
/*!*********************************************************!*\
  !*** ./src/app/core/services/default-agency.service.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DefaultAgencyService: () => (/* binding */ DefaultAgencyService)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 58071);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 12235);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ 79736);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ 13738);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../environments/environment */ 20553);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common/http */ 54860);





class DefaultAgencyService {
  constructor(http) {
    this.http = http;
    this.apiUrl = _environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiBaseUrl;
    // BehaviorSubject para mantener el estado de la agencia seleccionada
    this.selectedAgencySubject = new rxjs__WEBPACK_IMPORTED_MODULE_1__.BehaviorSubject(null);
    this.selectedAgency$ = this.selectedAgencySubject.asObservable();
    // BehaviorSubject para mantener el estado de las agencias disponibles
    this.agenciasSubject = new rxjs__WEBPACK_IMPORTED_MODULE_1__.BehaviorSubject([]);
    this.agencias$ = this.agenciasSubject.asObservable();
  }
  /**
   * Obtener agencias disponibles
   */
  obtenerAgencias() {
    return this.http.get(`${this.apiUrl}/api/agency`).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => {
      if (response && response.success && response.data && response.data.agencies) {
        return response.data.agencies;
      }
      if (Array.isArray(response)) {
        return response;
      }
      if (response && response.agencies && Array.isArray(response.agencies)) {
        return response.agencies;
      }
      return [];
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.tap)(agencias => {
      this.agenciasSubject.next(agencias);
    }));
  }
  /**
   * Obtener agencia predeterminada del usuario
   */
  obtenerAgenciaUsuario() {
    return this.http.get(`${this.apiUrl}/api/user/profile`).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => {
      if (response && response.success && response.data) {
        return response.data.DefaultAgency;
      }
      return null;
    }));
  }
  /**
   * Obtener la agencia predeterminada del usuario con reintentos
   */
  obtenerAgenciaUsuarioConReintentos(maxReintentos = 3, delayMs = 1000) {
    return new rxjs__WEBPACK_IMPORTED_MODULE_4__.Observable(observer => {
      let intentos = 0;
      const intentarObtener = () => {
        intentos++;
        console.log(`🔄 DefaultAgencyService - Intento ${intentos} de obtener agencia predeterminada del usuario`);
        this.obtenerAgenciaUsuario().subscribe({
          next: defaultAgencyId => {
            console.log(`✅ DefaultAgencyService - Agencia predeterminada obtenida exitosamente en intento ${intentos}:`, defaultAgencyId);
            observer.next(defaultAgencyId);
            observer.complete();
          },
          error: error => {
            console.warn(`⚠️ DefaultAgencyService - Intento ${intentos} falló:`, error);
            console.error(`🔍 DefaultAgencyService - Detalles del error:`, {
              status: error.status,
              statusText: error.statusText,
              message: error.message,
              error: error.error
            });
            if (intentos < maxReintentos) {
              console.log(`🔄 DefaultAgencyService - Reintentando en ${delayMs}ms... (${intentos}/${maxReintentos})`);
              setTimeout(intentarObtener, delayMs);
            } else {
              console.error(`❌ DefaultAgencyService - Todos los ${maxReintentos} intentos fallaron`);
              observer.error(error);
            }
          }
        });
      };
      intentarObtener();
    });
  }
  /**
   * Establecer agencia predeterminada del usuario
   * @param autoSelect Si es true, selecciona automáticamente una agencia
   * @returns Observable<number | null> que devuelve el ID de la agencia seleccionada
   */
  establecerAgenciaPredeterminada(autoSelect = true) {
    return new rxjs__WEBPACK_IMPORTED_MODULE_4__.Observable(observer => {
      console.log('🔄 DefaultAgencyService - Iniciando establecimiento de agencia predeterminada...');
      console.log('📊 DefaultAgencyService - Agencias disponibles en el servicio:', this.agenciasSubject.value);
      // Intentar obtener la agencia predeterminada con reintentos
      this.obtenerAgenciaUsuarioConReintentos().subscribe({
        next: defaultAgencyId => {
          console.log('👤 DefaultAgencyService - Agencia predeterminada del usuario obtenida:', defaultAgencyId);
          let agenciaSeleccionada = null;
          if (defaultAgencyId && this.agenciasSubject.value.length > 0) {
            // Buscar la agencia predeterminada del usuario en la lista
            const agenciaPredeterminada = this.agenciasSubject.value.find(ag => ag.Id === defaultAgencyId);
            if (agenciaPredeterminada) {
              console.log('✅ DefaultAgencyService - Agencia predeterminada del usuario encontrada:', agenciaPredeterminada);
              agenciaSeleccionada = defaultAgencyId;
            } else {
              // Si no se encuentra la agencia predeterminada, seleccionar la primera
              if (autoSelect) {
                console.log('⚠️ DefaultAgencyService - Agencia predeterminada del usuario no encontrada, seleccionando primera agencia');
                agenciaSeleccionada = this.agenciasSubject.value[0].Id;
                console.log('🔍 DefaultAgencyService - Primera agencia de la lista:', this.agenciasSubject.value[0]);
              }
            }
          } else {
            // Si el usuario no tiene agencia predeterminada, seleccionar la primera de la lista
            if (autoSelect && this.agenciasSubject.value.length > 0) {
              console.log('ℹ️ DefaultAgencyService - Usuario sin agencia predeterminada, seleccionando primera agencia de la lista');
              agenciaSeleccionada = this.agenciasSubject.value[0].Id;
              console.log('🔍 DefaultAgencyService - Primera agencia de la lista:', this.agenciasSubject.value[0]);
            }
          }
          // Actualizar el BehaviorSubject
          if (agenciaSeleccionada) {
            console.log('🎯 DefaultAgencyService - Estableciendo agencia seleccionada:', agenciaSeleccionada);
            this.selectedAgencySubject.next(agenciaSeleccionada);
          }
          observer.next(agenciaSeleccionada);
          observer.complete();
        },
        error: error => {
          console.error('❌ DefaultAgencyService - Error obteniendo agencia predeterminada después de reintentos:', error);
          console.warn('⚠️ DefaultAgencyService - No se pudo obtener agencia predeterminada, seleccionando primera agencia de la lista');
          // En caso de error, seleccionar la primera agencia disponible si está habilitado
          let agenciaSeleccionada = null;
          if (autoSelect && this.agenciasSubject.value.length > 0) {
            agenciaSeleccionada = this.agenciasSubject.value[0].Id;
            console.log('ℹ️ DefaultAgencyService - Seleccionada primera agencia por defecto:', agenciaSeleccionada);
            console.log('🔍 DefaultAgencyService - Primera agencia de la lista:', this.agenciasSubject.value[0]);
            this.selectedAgencySubject.next(agenciaSeleccionada);
          }
          observer.next(agenciaSeleccionada);
          observer.complete();
        }
      });
    });
  }
  /**
   * Seleccionar una agencia específica
   */
  seleccionarAgencia(agenciaId) {
    this.selectedAgencySubject.next(agenciaId);
  }
  /**
   * Obtener la agencia actualmente seleccionada
   */
  getAgenciaSeleccionada() {
    return this.selectedAgencySubject.value;
  }
  /**
   * Obtener las agencias disponibles
   */
  getAgencias() {
    return this.agenciasSubject.value;
  }
  /**
   * Limpiar la selección de agencia
   */
  limpiarSeleccion() {
    this.selectedAgencySubject.next(null);
  }
  /**
   * Verificar si una agencia está habilitada
   */
  esAgenciaHabilitada(agencia) {
    return agencia && this.esHabilitado(agencia.Enabled);
  }
  /**
   * Método de utilidad para validar estado habilitado de cualquier campo
   */
  esHabilitado(valor) {
    if (valor === null || valor === undefined) {
      return false;
    }
    // Convertir a string para comparación segura
    const valorStr = String(valor).toLowerCase();
    return valorStr === 'true' || valorStr === '1' || valorStr === 'enabled';
  }
  /**
   * Obtener agencias habilitadas
   */
  getAgenciasHabilitadas() {
    return this.agenciasSubject.value.filter(ag => this.esAgenciaHabilitada(ag));
  }
  /**
   * Obtener agencias por estado (habilitadas o deshabilitadas)
   */
  getAgenciasPorEstado(habilitadas = true) {
    return this.agenciasSubject.value.filter(ag => this.esAgenciaHabilitada(ag) === habilitadas);
  }
  /**
   * Verificar si hay agencias disponibles
   */
  tieneAgencias() {
    return this.agenciasSubject.value.length > 0;
  }
  /**
   * Verificar si hay agencias habilitadas
   */
  tieneAgenciasHabilitadas() {
    return this.getAgenciasHabilitadas().length > 0;
  }
  static #_ = this.ɵfac = function DefaultAgencyService_Factory(t) {
    return new (t || DefaultAgencyService)(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_6__.HttpClient));
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineInjectable"]({
    token: DefaultAgencyService,
    factory: DefaultAgencyService.ɵfac,
    providedIn: 'root'
  });
}

/***/ }),

/***/ 63934:
/*!***********************************************!*\
  !*** ./src/app/core/services/user.service.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UserService: () => (/* binding */ UserService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ 54860);
/* harmony import */ var _api_base_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api-base.service */ 14461);



class UserService {
  constructor(http, apiBaseService) {
    this.http = http;
    this.apiBaseService = apiBaseService;
    this.API_URL = 'user';
  }
  getUsers(limit) {
    const params = limit ? `?limit=${limit}` : '';
    return this.http.get(`${this.apiBaseService.buildApiUrl(this.API_URL)}${params}`);
  }
  getAllUsers() {
    return this.http.get(this.apiBaseService.buildApiUrl(this.API_URL));
  }
  getUsersByStatus(enabled) {
    return this.http.get(`${this.apiBaseService.buildApiUrl(this.API_URL)}?enabled=${enabled}`);
  }
  getUserById(id) {
    return this.http.get(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}`);
  }
  createUser(user) {
    return this.http.post(this.apiBaseService.buildApiUrl(this.API_URL), user);
  }
  updateUser(id, user) {
    return this.http.put(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}`, user);
  }
  deleteUser(id) {
    return this.http.delete(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}`);
  }
  toggleStatus(id) {
    return this.http.patch(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}/toggle-status`, {});
  }
  changePassword(id, newPassword) {
    return this.http.post(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}/change-password`, {
      new_password: newPassword
    });
  }
  resetPassword(id) {
    return this.http.post(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}/reset-password`, {});
  }
  searchUsers(query) {
    return this.http.get(`${this.apiBaseService.buildApiUrl(this.API_URL)}/search?q=${query}`);
  }
  getStats() {
    return this.http.get(`${this.apiBaseService.buildApiUrl(this.API_URL)}/stats`);
  }
  checkUsernameAvailability(username) {
    return this.http.get(`${this.apiBaseService.buildApiUrl(this.API_URL)}/check-username?username=${username}`);
  }
  checkEmailAvailability(email) {
    return this.http.get(`${this.apiBaseService.buildApiUrl(this.API_URL)}/check-email?email=${email}`);
  }
  // Métodos para obtener datos de referencia
  getUserRoles() {
    return this.http.get(this.apiBaseService.buildApiUrl('user-role'));
  }
  getAgencies() {
    return this.http.get(this.apiBaseService.buildApiUrl('agency'));
  }
  // Obtener agencias asignadas a un usuario específico
  getUserAgencies(userId) {
    return this.http.get(`${this.apiBaseService.buildApiUrl('user')}/${userId}/agencies`);
  }
  // Obtener usuarios por agencia
  getUsersByAgency(agencyId) {
    const params = agencyId ? `?default_agency=${agencyId}` : '';
    return this.http.get(`${this.apiBaseService.buildApiUrl(this.API_URL)}${params}`);
  }
  static #_ = this.ɵfac = function UserService_Factory(t) {
    return new (t || UserService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpClient), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_api_base_service__WEBPACK_IMPORTED_MODULE_0__.ApiBaseService));
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
    token: UserService,
    factory: UserService.ɵfac,
    providedIn: 'root'
  });
}

/***/ })

}]);
//# sourceMappingURL=default-src_app_core_services_agency_service_ts-src_app_core_services_analytics_service_ts-sr-a07ba2.js.map