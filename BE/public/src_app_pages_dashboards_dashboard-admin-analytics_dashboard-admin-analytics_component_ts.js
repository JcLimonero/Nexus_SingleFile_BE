"use strict";
(self["webpackChunkvex"] = self["webpackChunkvex"] || []).push([["src_app_pages_dashboards_dashboard-admin-analytics_dashboard-admin-analytics_component_ts"],{

/***/ 4134:
/*!**************************************************************!*\
  !*** ./src/app/core/services/real-time-analytics.service.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RealTimeAnalyticsService: () => (/* binding */ RealTimeAnalyticsService)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ 58071);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 72513);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ 74520);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 61699);



class RealTimeAnalyticsService {
  constructor() {
    this.socket = null;
    this.connectionStatus = new rxjs__WEBPACK_IMPORTED_MODULE_0__.BehaviorSubject(false);
    this.metricsSubject = new rxjs__WEBPACK_IMPORTED_MODULE_1__.Subject();
    this.statsSubject = new rxjs__WEBPACK_IMPORTED_MODULE_0__.BehaviorSubject(null);
    this.connectionStatus$ = this.connectionStatus.asObservable();
    this.metrics$ = this.metricsSubject.asObservable();
    this.stats$ = this.statsSubject.asObservable();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.initializeConnection();
  }
  initializeConnection() {
    try {
      // En un entorno real, usarías el WebSocket del backend
      // Por ahora simulamos la conexión
      this.simulateConnection();
    } catch (error) {
      console.error('Error initializing WebSocket connection:', error);
      this.scheduleReconnect();
    }
  }
  simulateConnection() {
    // Simulamos una conexión exitosa
    this.connectionStatus.next(true);
    // Simulamos métricas en tiempo real
    this.startSimulation();
  }
  startSimulation() {
    // Simulamos eventos cada 5-10 segundos
    setInterval(() => {
      if (this.connectionStatus.value) {
        this.simulateRandomMetric();
        this.updateStats();
      }
    }, Math.random() * 5000 + 5000);
  }
  simulateRandomMetric() {
    const types = ['document', 'process', 'user', 'system'];
    const actions = ['created', 'updated', 'deleted', 'status_changed'];
    const type = types[Math.floor(Math.random() * types.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const metric = {
      id: this.generateId(),
      type,
      action,
      data: this.generateMetricData(type, action),
      timestamp: new Date()
    };
    this.metricsSubject.next(metric);
  }
  generateMetricData(type, action) {
    switch (type) {
      case 'document':
        return {
          documentId: Math.floor(Math.random() * 1000),
          documentType: 'Contrato',
          agency: 'Agencia Central',
          status: action === 'status_changed' ? 'completed' : 'pending'
        };
      case 'process':
        return {
          processId: Math.floor(Math.random() * 1000),
          processName: 'Proceso de Aprobación',
          agency: 'Agencia Central',
          status: action === 'status_changed' ? 'completed' : 'in_progress'
        };
      case 'user':
        return {
          userId: Math.floor(Math.random() * 100),
          username: 'usuario' + Math.floor(Math.random() * 100),
          action: action,
          timestamp: new Date()
        };
      case 'system':
        return {
          metric: 'performance',
          value: Math.floor(Math.random() * 100),
          threshold: 80
        };
      default:
        return {};
    }
  }
  updateStats() {
    const stats = {
      documents: {
        total: Math.floor(Math.random() * 1000) + 500,
        today: Math.floor(Math.random() * 50) + 10,
        pending: Math.floor(Math.random() * 100) + 20,
        completed: Math.floor(Math.random() * 800) + 200
      },
      processes: {
        total: Math.floor(Math.random() * 500) + 200,
        active: Math.floor(Math.random() * 50) + 10,
        completed: Math.floor(Math.random() * 400) + 100,
        averageTime: Math.floor(Math.random() * 120) + 30
      },
      users: {
        online: Math.floor(Math.random() * 20) + 5,
        total: Math.floor(Math.random() * 100) + 50,
        activeToday: Math.floor(Math.random() * 30) + 10
      },
      system: {
        uptime: 99.9,
        responseTime: Math.floor(Math.random() * 50) + 100,
        memoryUsage: Math.floor(Math.random() * 20) + 60
      }
    };
    this.statsSubject.next(stats);
  }
  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
  scheduleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.initializeConnection();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
      this.connectionStatus.next(false);
    }
  }
  // Métodos públicos
  connect() {
    if (!this.connectionStatus.value) {
      this.reconnectAttempts = 0;
      this.initializeConnection();
    }
  }
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.connectionStatus.next(false);
  }
  sendMessage(message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }
  subscribeToMetric(type) {
    return this.metrics$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.filter)(metric => metric.type === type));
  }
  getCurrentStats() {
    return this.statsSubject.value;
  }
  isConnected() {
    return this.connectionStatus.value;
  }
  static #_ = this.ɵfac = function RealTimeAnalyticsService_Factory(t) {
    return new (t || RealTimeAnalyticsService)();
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({
    token: RealTimeAnalyticsService,
    factory: RealTimeAnalyticsService.ɵfac,
    providedIn: 'root'
  });
}

/***/ }),

/***/ 41826:
/*!**************************************************************************************************************!*\
  !*** ./src/app/pages/dashboards/components/widgets/widget-agency-metrics/widget-agency-metrics.component.ts ***!
  \**************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WidgetAgencyMetricsComponent: () => (/* binding */ WidgetAgencyMetricsComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/card */ 18497);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/progress-spinner */ 33910);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 72513);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 20274);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _core_services_analytics_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../core/services/analytics.service */ 908);











function WidgetAgencyMetricsComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "mat-spinner", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function WidgetAgencyMetricsComponent_div_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 6)(1, "mat-icon", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "error");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r1.error);
  }
}
function WidgetAgencyMetricsComponent_div_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 8)(1, "mat-card", 9)(2, "div", 10)(3, "div", 11)(4, "div", 12)(5, "mat-icon", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, "event_available");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "div", 14)(8, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](11, "Expedientes");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](13, "Hoy");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "mat-card", 9)(15, "div", 10)(16, "div", 11)(17, "div", 18)(18, "mat-icon", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](19, "calendar_month");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](20, "div", 14)(21, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](22);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](23, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](24, "Expedientes");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](25, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](26);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](27, "mat-card", 9)(28, "div", 10)(29, "div", 11)(30, "div", 20)(31, "mat-icon", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](32, "trending_up");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](33, "div", 14)(34, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](35);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](36, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](37, "Expedientes");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](38, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](39, "Total");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r2.agencyMetrics.todayCases);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r2.agencyMetrics.monthlyCases);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r2.getMonthName());
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r2.agencyMetrics.totalCases);
  }
}
class WidgetAgencyMetricsComponent {
  constructor(analyticsService) {
    this.analyticsService = analyticsService;
    this.agencyId = null;
    this.showDetails = true;
    this.compact = false;
    this.agencyMetrics = null;
    this.loading = true;
    this.error = null;
    this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__.Subject();
  }
  ngOnInit() {
    this.loadAgencyMetrics();
  }
  ngOnChanges(changes) {
    console.log('🏢 AgencyMetrics ngOnChanges called with changes:', changes);
    if (changes['agencyId'] && !changes['agencyId'].firstChange) {
      console.log('🏢 AgencyMetrics: Agency changed, triggering data reload');
      console.log('🏢 AgencyMetrics: New agencyId:', this.agencyId);
      this.loadAgencyMetrics();
    }
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  loadAgencyMetrics() {
    this.loading = true;
    this.error = null;
    // Solo aplicar filtro de agencia, ignorar filtros de fecha
    const filters = this.agencyId ? {
      agencyId: this.agencyId
    } : undefined;
    console.log('🏢 AgencyMetrics: Loading agency metrics with filters:', filters);
    console.log('🏢 AgencyMetrics: Current agencyId:', this.agencyId);
    console.log('🏢 AgencyMetrics: Filters object:', filters);
    this.analyticsService.getAgencyMetrics(filters).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_3__.takeUntil)(this.destroy$)).subscribe({
      next: metrics => {
        console.log('🏢 AgencyMetrics: Received metrics:', metrics);
        this.agencyMetrics = metrics;
        this.loading = false;
      },
      error: error => {
        console.error('🏢 AgencyMetrics: Error loading agency metrics:', error);
        this.error = 'Error al cargar métricas de agencia';
        this.loading = false;
      }
    });
  }
  refresh() {
    this.loadAgencyMetrics();
  }
  getMonthName() {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return months[new Date().getMonth()];
  }
  static #_ = this.ɵfac = function WidgetAgencyMetricsComponent_Factory(t) {
    return new (t || WidgetAgencyMetricsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_core_services_analytics_service__WEBPACK_IMPORTED_MODULE_0__.AnalyticsService));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: WidgetAgencyMetricsComponent,
    selectors: [["vex-widget-agency-metrics"]],
    inputs: {
      agencyId: "agencyId",
      showDetails: "showDetails",
      compact: "compact"
    },
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵNgOnChangesFeature"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵStandaloneFeature"]],
    decls: 4,
    vars: 3,
    consts: [[1, "widget-agency-metrics"], ["class", "flex justify-center items-center h-32", 4, "ngIf"], ["class", "text-center text-red-600 p-4", 4, "ngIf"], ["class", "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", 4, "ngIf"], [1, "flex", "justify-center", "items-center", "h-32"], ["diameter", "40"], [1, "text-center", "text-red-600", "p-4"], [1, "text-red-500", "mb-2"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-4"], [1, "metric-card"], [1, "flex", "items-center", "space-x-4", "p-4"], [1, "flex-shrink-0"], [1, "w-12", "h-12", "bg-green-100", "rounded-lg", "flex", "items-center", "justify-center"], [1, "text-green-600", "text-2xl"], [1, "flex-1", "min-w-0"], [1, "text-2xl", "font-bold", "text-blue-500"], [1, "text-sm", "font-medium", "text-gray-700"], [1, "text-xs", "text-gray-500"], [1, "w-12", "h-12", "bg-red-100", "rounded-lg", "flex", "items-center", "justify-center"], [1, "text-red-600", "text-2xl"], [1, "w-12", "h-12", "bg-orange-100", "rounded-lg", "flex", "items-center", "justify-center"], [1, "text-orange-600", "text-2xl"]],
    template: function WidgetAgencyMetricsComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, WidgetAgencyMetricsComponent_div_1_Template, 2, 0, "div", 1)(2, WidgetAgencyMetricsComponent_div_2_Template, 5, 1, "div", 2)(3, WidgetAgencyMetricsComponent_div_3_Template, 40, 4, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.error);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.agencyMetrics && !ctx.loading);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgIf, _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__.MatIcon, _angular_material_card__WEBPACK_IMPORTED_MODULE_6__.MatCardModule, _angular_material_card__WEBPACK_IMPORTED_MODULE_6__.MatCard, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_7__.MatProgressSpinnerModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_7__.MatProgressSpinner],
    styles: [".widget-agency-metrics[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%] {\n  transition-property: all;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 200ms\n}\n.widget-agency-metrics[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%]:hover {\n  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n  transform: translateY(-2px)\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvZGFzaGJvYXJkcy9jb21wb25lbnRzL3dpZGdldHMvd2lkZ2V0LWFnZW5jeS1tZXRyaWNzL3dpZGdldC1hZ2VuY3ktbWV0cmljcy5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFSTtFQUFBLHdCQUFBO0VBQUEsd0RBQUE7RUFBQTtBQUFBO0FBQUE7RUFBQSw2RUFBQTtFQUFBLGlHQUFBO0VBQUEsdUdBQUE7RUFHRTtBQUhGIiwic291cmNlc0NvbnRlbnQiOlsiLndpZGdldC1hZ2VuY3ktbWV0cmljcyB7XG4gIC5tZXRyaWMtY2FyZCB7XG4gICAgQGFwcGx5IHRyYW5zaXRpb24tYWxsIGR1cmF0aW9uLTIwMCBob3ZlcjpzaGFkb3ctbWQ7XG4gICAgXG4gICAgJjpob3ZlciB7XG4gICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTJweCk7XG4gICAgfVxuICB9XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
  });
}

/***/ }),

/***/ 28519:
/*!***************************************************************************************************!*\
  !*** ./src/app/pages/dashboards/dashboard-admin-analytics/dashboard-admin-analytics.component.ts ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DashboardAdminAnalyticsComponent: () => (/* binding */ DashboardAdminAnalyticsComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/card */ 18497);
/* harmony import */ var _angular_material_tabs__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material/tabs */ 60989);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/snack-bar */ 49409);
/* harmony import */ var _components_widgets_widget_agency_metrics_widget_agency_metrics_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../components/widgets/widget-agency-metrics/widget-agency-metrics.component */ 41826);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/material/form-field */ 51333);
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/material/select */ 96355);
/* harmony import */ var _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/material/datepicker */ 82226);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @angular/material/input */ 10026);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/material/core */ 55309);
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @angular/material/tooltip */ 60702);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/forms */ 28849);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs */ 72513);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! rxjs */ 20274);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _core_services_analytics_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../core/services/analytics.service */ 908);
/* harmony import */ var _core_services_agency_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../core/services/agency.service */ 92883);
/* harmony import */ var _core_services_default_agency_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../core/services/default-agency.service */ 44907);
/* harmony import */ var _core_services_user_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../core/services/user.service */ 63934);
/* harmony import */ var _core_services_auth_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../core/services/auth.service */ 90304);
/* harmony import */ var _core_services_real_time_analytics_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../core/services/real-time-analytics.service */ 4134);



































const _c0 = ["userSelect"];
function DashboardAdminAnalyticsComponent_mat_option_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "mat-option", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const agency_r16 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("value", agency_r16.Id);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", agency_r16.Name, " ");
  }
}
function DashboardAdminAnalyticsComponent_mat_hint_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "mat-hint");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, "Cargando...");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
}
function DashboardAdminAnalyticsComponent_mat_hint_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "mat-hint");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, "Sin agencias");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
}
function DashboardAdminAnalyticsComponent_mat_option_20_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "mat-option", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const user_r17 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("value", user_r17.Id);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", user_r17.Name, " ");
  }
}
function DashboardAdminAnalyticsComponent_mat_hint_21_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "mat-hint");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, "Cargando...");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
}
function DashboardAdminAnalyticsComponent_mat_hint_22_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "mat-hint");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, "Sin usuarios");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
}
function DashboardAdminAnalyticsComponent_mat_hint_23_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "mat-hint");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, "Filtro deshabilitado para su rol");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
}
function DashboardAdminAnalyticsComponent_button_44_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "button", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function DashboardAdminAnalyticsComponent_button_44_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r19);
      const ctx_r18 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r18.clearDateRange());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](1, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](2, "clear");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
}
function DashboardAdminAnalyticsComponent_button_45_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "button", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function DashboardAdminAnalyticsComponent_button_45_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r21);
      const ctx_r20 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r20.clearAgencyFilter());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](1, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](2, "clear");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
}
function DashboardAdminAnalyticsComponent_button_46_Template(rf, ctx) {
  if (rf & 1) {
    const _r23 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "button", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function DashboardAdminAnalyticsComponent_button_46_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r23);
      const ctx_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r22.clearUserFilter());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](1, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](2, "clear");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
}
function DashboardAdminAnalyticsComponent_button_47_Template(rf, ctx) {
  if (rf & 1) {
    const _r25 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "button", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function DashboardAdminAnalyticsComponent_button_47_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r25);
      const ctx_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r24.clearAllFilters());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](1, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](2, "refresh");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
}
function DashboardAdminAnalyticsComponent_div_48_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 28)(1, "mat-form-field", 29)(2, "mat-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](3, "Inicio");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](4, "input", 30)(5, "mat-datepicker-toggle", 31)(6, "mat-datepicker", null, 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](8, "mat-form-field", 29)(9, "mat-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](10, "Fin");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](11, "input", 33)(12, "mat-datepicker-toggle", 31)(13, "mat-datepicker", null, 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const _r26 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](7);
    const _r27 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("matDatepicker", _r26);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("for", _r26);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("matDatepicker", _r27);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("for", _r27);
  }
}
function DashboardAdminAnalyticsComponent_div_49_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 35)(1, "div", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](2, "mat-icon", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](3, "p", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](4, "Cargando datos de administraci\u00F3n...");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
  }
}
function DashboardAdminAnalyticsComponent_div_50_Template(rf, ctx) {
  if (rf & 1) {
    const _r29 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](1, "mat-icon", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](2, "p", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](4, "button", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function DashboardAdminAnalyticsComponent_div_50_Template_button_click_4_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r29);
      const ctx_r28 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r28.refreshData());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](5, " Reintentar ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](ctx_r14.error);
  }
}
const _c1 = () => ({
  warning: 95,
  critical: 90
});
const _c2 = () => ({
  warning: 200,
  critical: 500
});
const _c3 = () => ({
  warning: 80,
  critical: 90
});
const _c4 = () => ({
  warning: 70,
  critical: 85
});
function DashboardAdminAnalyticsComponent_div_51_Template(rf, ctx) {
  if (rf & 1) {
    const _r31 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div")(1, "mat-tab-group", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("selectedIndexChange", function DashboardAdminAnalyticsComponent_div_51_Template_mat_tab_group_selectedIndexChange_1_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r31);
      const ctx_r30 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r30.selectedTab = $event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](2, "mat-tab", 44)(3, "div", 45)(4, "mat-card", 46)(5, "mat-card-header")(6, "mat-card-title", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](7, "mat-icon", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](8, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](9, "Salud del Sistema");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](10, "mat-card-content", 48)(11, "div", 49)(12, "span", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](13, "Uptime");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](14, "span", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](15);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](16, "div", 49)(17, "span", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](18, "Tiempo de Respuesta");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](19, "span", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](20);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](21, "div", 49)(22, "span", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](23, "Uso de Memoria");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](24, "span", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](25);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](26, "div", 49)(27, "span", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](28, "Uso de CPU");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](29, "span", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](30);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](31, "mat-card", 52)(32, "mat-card-header")(33, "mat-card-title", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](34, "mat-icon", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](35, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](36, "Seguridad");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](37, "mat-card-content", 48)(38, "div", 49)(39, "span", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](40, "Logins Fallidos");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](41, "span", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](42);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](43, "div", 49)(44, "span", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](45, "Actividad Sospechosa");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](46, "span", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](47);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](48, "div", 49)(49, "span", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](50, "IPs Bloqueadas");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](51, "span", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](52);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](53, "div", 49)(54, "span", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](55, "\u00DAltimo Escaneo");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](56, "span", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](57);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](58, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](59, "mat-card", 57)(60, "mat-card-header")(61, "mat-card-title", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](62, "mat-icon", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](63, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](64, "Rendimiento");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](65, "mat-card-content", 48)(66, "div", 49)(67, "span", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](68, "Tiempo Promedio");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](69, "span", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](70);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](71, "div", 49)(72, "span", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](73, "Usuarios Concurrentes");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](74, "span", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](75);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](76, "div", 49)(77, "span", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](78, "Conexiones DB");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](79, "span", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](80);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](81, "div", 49)(82, "span", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](83, "Cache Hit Rate");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](84, "span", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](85);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](86, "mat-card", 60)(87, "mat-card-header")(88, "mat-card-title", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](89, "mat-icon", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](90, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](91, "Negocio");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](92, "mat-card-content", 48)(93, "div", 49)(94, "span", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](95, "Ingresos Totales");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](96, "span", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](97);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](98, "div", 49)(99, "span", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](100, "Crecimiento Mensual");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](101, "span", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](102);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](103, "div", 49)(104, "span", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](105, "Satisfacci\u00F3n");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](106, "span", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](107);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](108, "div", 49)(109, "span", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](110, "Tickets Soporte");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](111, "span", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](112);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](113, "mat-tab", 63)(114, "div", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](115, "vex-widget-agency-metrics", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const ctx_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("selectedIndex", ctx_r15.selectedTab);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵclassMap"](ctx_r15.getHealthStatusColor(ctx_r15.adminMetrics.systemHealth.uptime, _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpureFunction0"](30, _c1)));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", ctx_r15.adminMetrics.systemHealth.uptime, "% ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵclassMap"](ctx_r15.getHealthStatusColor(ctx_r15.adminMetrics.systemHealth.responseTime, _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpureFunction0"](31, _c2)));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", ctx_r15.adminMetrics.systemHealth.responseTime, "ms ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵclassMap"](ctx_r15.getHealthStatusColor(ctx_r15.adminMetrics.systemHealth.memoryUsage, _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpureFunction0"](32, _c3)));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", ctx_r15.adminMetrics.systemHealth.memoryUsage, "% ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵclassMap"](ctx_r15.getHealthStatusColor(ctx_r15.adminMetrics.systemHealth.cpuUsage, _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpureFunction0"](33, _c4)));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", ctx_r15.adminMetrics.systemHealth.cpuUsage, "% ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](ctx_r15.adminMetrics.securityMetrics.failedLogins);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](ctx_r15.adminMetrics.securityMetrics.suspiciousActivity);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](ctx_r15.adminMetrics.securityMetrics.blockedIPs);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind2"](58, 27, ctx_r15.adminMetrics.securityMetrics.lastSecurityScan, "short"));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"]("", ctx_r15.adminMetrics.performanceMetrics.averageLoadTime, "s");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](ctx_r15.adminMetrics.performanceMetrics.peakConcurrentUsers);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](ctx_r15.adminMetrics.performanceMetrics.databaseConnections);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"]("", ctx_r15.adminMetrics.performanceMetrics.cacheHitRate, "%");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](ctx_r15.formatCurrency(ctx_r15.adminMetrics.businessMetrics.totalRevenue));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"]("+", ctx_r15.adminMetrics.businessMetrics.monthlyGrowth, "%");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"]("", ctx_r15.adminMetrics.businessMetrics.customerSatisfaction, "/5");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](ctx_r15.adminMetrics.businessMetrics.supportTickets);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("agencyId", ctx_r15.selectedAgencyId)("showDetails", true);
  }
}
class DashboardAdminAnalyticsComponent {
  constructor(analyticsService, agencyService, defaultAgencyService, userService, authService, realTimeService, snackBar, changeDetector) {
    this.analyticsService = analyticsService;
    this.agencyService = agencyService;
    this.defaultAgencyService = defaultAgencyService;
    this.userService = userService;
    this.authService = authService;
    this.realTimeService = realTimeService;
    this.snackBar = snackBar;
    this.changeDetector = changeDetector;
    this.dashboardData = null;
    this.loading = true;
    this.error = null;
    this.currentFilters = {};
    this.selectedAgencyId = null;
    this.selectedDateRange = null;
    this.selectedUserId = null;
    this.showManualDateInputs = false;
    this.agencies = [];
    this.users = [];
    this.activeDateRange = null;
    this.currentUser = null;
    this.isUserFilterDisabled = false;
    this.selectedTab = 0;
    // Métricas específicas para administradores
    this.adminMetrics = {
      systemHealth: {
        uptime: 99.9,
        responseTime: 150,
        memoryUsage: 65,
        cpuUsage: 45,
        diskUsage: 78
      },
      securityMetrics: {
        failedLogins: 12,
        suspiciousActivity: 3,
        blockedIPs: 5,
        lastSecurityScan: new Date()
      },
      performanceMetrics: {
        averageLoadTime: 1.2,
        peakConcurrentUsers: 156,
        databaseConnections: 23,
        cacheHitRate: 94.5
      },
      businessMetrics: {
        totalRevenue: 125000,
        monthlyGrowth: 12.5,
        customerSatisfaction: 4.6,
        supportTickets: 45
      }
    };
    this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_8__.Subject();
    this.dateRangeForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_9__.FormGroup({
      startDate: new _angular_forms__WEBPACK_IMPORTED_MODULE_9__.FormControl(null),
      endDate: new _angular_forms__WEBPACK_IMPORTED_MODULE_9__.FormControl(null)
    });
  }
  ngOnInit() {
    console.log('🚀 Iniciando DashboardAdminAnalyticsComponent...');
    // Cargar usuario actual PRIMERO
    this.loadCurrentUser();
    // Luego cargar datos del dashboard
    this.loadDashboardData();
    this.loadAgencies();
    this.initializeRealTimeConnection();
    // Establecer "Este mes" como período por defecto
    this.setThisMonth();
    // Suscribirse a cambios en el formulario de fechas
    this.dateRangeForm.valueChanges.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_10__.takeUntil)(this.destroy$)).subscribe(() => {
      this.onDateRangeChange();
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  loadDashboardData() {
    this.loading = true;
    this.error = null;
    this.analyticsService.getDashboardData(this.currentFilters).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_10__.takeUntil)(this.destroy$)).subscribe({
      next: data => {
        this.dashboardData = data;
        this.loading = false;
      },
      error: error => {
        console.error('Error loading admin dashboard data:', error);
        this.error = 'Error al cargar datos del dashboard de administración';
        this.loading = false;
      }
    });
  }
  initializeRealTimeConnection() {
    this.realTimeService.connect();
  }
  onAgencyChange(agencyId) {
    console.log('🏢 onAgencyChange llamado con agencyId:', agencyId);
    this.selectedAgencyId = agencyId;
    this.currentFilters = {
      ...this.currentFilters,
      agencyId: agencyId || undefined
    };
    // Cargar usuarios para la agencia seleccionada
    this.loadUsers(agencyId);
    // Verificar si el usuario actual existe y es gerente/admin
    console.log('🔍 Verificando usuario actual en onAgencyChange:', this.currentUser);
    console.log('🔍 isManagerOrAdmin result:', this.isManagerOrAdmin(this.currentUser));
    // Si el usuario es gerente o administrador, seleccionar automáticamente "Todos los usuarios"
    if (this.isManagerOrAdmin(this.currentUser)) {
      console.log('👑 Usuario es gerente/admin, seleccionando "Todos los usuarios" al cambiar agencia');
      this.selectedUserId = null;
      this.currentFilters = {
        ...this.currentFilters,
        userId: undefined
      };
      console.log('👑 selectedUserId establecido a null al cambiar agencia');
      console.log('👑 currentFilters después del cambio:', this.currentFilters);
    } else {
      console.log('👤 Usuario NO es gerente/admin, no se aplica selección automática');
    }
    this.loadDashboardData();
  }
  onDateRangeChange() {
    const formValue = this.dateRangeForm.value;
    const dateRange = {
      startDate: formValue.startDate,
      endDate: formValue.endDate
    };
    if (this.isValidDateRange(dateRange)) {
      this.selectedDateRange = dateRange;
      this.currentFilters = {
        ...this.currentFilters,
        dateRange: dateRange
      };
      this.loadDashboardData();
    } else {
      this.selectedDateRange = null;
      this.currentFilters = {
        ...this.currentFilters,
        dateRange: undefined
      };
      this.loadDashboardData();
    }
  }
  isValidDateRange(dateRange) {
    if (!dateRange.startDate || !dateRange.endDate) {
      return false;
    }
    return dateRange.startDate <= dateRange.endDate;
  }
  loadAgencies() {
    console.log('🏢 Cargando agencias asignadas al usuario...');
    this.defaultAgencyService.obtenerAgencias().pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_10__.takeUntil)(this.destroy$)).subscribe({
      next: agencias => {
        console.log('🏢 Agencias asignadas al usuario:', agencias);
        this.agencies = agencias;
        // Establecer agencia predeterminada
        setTimeout(() => {
          this.defaultAgencyService.establecerAgenciaPredeterminada(true).subscribe({
            next: agenciaId => {
              if (agenciaId) {
                console.log('✅ Agencia predeterminada establecida:', agenciaId);
                this.selectedAgencyId = agenciaId;
                this.onAgencyChange(agenciaId);
              } else {
                console.warn('⚠️ No se pudo establecer agencia predeterminada');
              }
            },
            error: error => {
              console.error('❌ Error estableciendo agencia predeterminada:', error);
              // Si falla, intentar seleccionar la primera agencia disponible
              if (this.agencies.length > 0) {
                const primeraAgencia = this.agencies[0];
                console.log('🔄 Seleccionando primera agencia disponible como fallback:', primeraAgencia);
                this.selectedAgencyId = primeraAgencia.Id;
                this.onAgencyChange(primeraAgencia.Id);
              }
            }
          });
        }, 100);
      },
      error: error => {
        console.error('🏢 Error cargando agencias:', error);
        this.agencies = [];
        this.snackBar.open('Error al cargar las agencias', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }
  loadUsers(agencyId) {
    console.log('👥 Cargando usuarios para agencia:', agencyId);
    this.userService.getUsersByAgency(agencyId || undefined).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_10__.takeUntil)(this.destroy$)).subscribe({
      next: response => {
        console.log('👥 Respuesta de usuarios:', response);
        if (response.success && response.data && response.data.users) {
          this.users = response.data.users;
          console.log('👥 Usuarios cargados:', this.users.length);
          // Verificar si debemos aplicar selección automática para administradores
          if (this.isManagerOrAdmin(this.currentUser)) {
            console.log('👑 Aplicando selección automática después de cargar usuarios');
            setTimeout(() => {
              // Estrategia diferente: cambiar temporalmente el valor y luego establecerlo a null
              this.selectedUserId = -1; // Valor temporal que no existe
              this.changeDetector.detectChanges();
              setTimeout(() => {
                this.selectedUserId = null;
                this.currentFilters = {
                  ...this.currentFilters,
                  userId: undefined
                };
                console.log('👑 selectedUserId establecido a null después de cargar usuarios');
                console.log('👑 currentFilters actualizado después de cargar usuarios:', this.currentFilters);
                // Forzar detección de cambios para actualizar el dropdown
                this.changeDetector.detectChanges();
                console.log('🔄 Change detection ejecutado para actualizar dropdown');
                // Forzar actualización del mat-select directamente
                if (this.userSelect) {
                  this.userSelect.writeValue(null);
                  console.log('🔄 MatSelect writeValue(null) ejecutado');
                }
              }, 50);
            }, 100);
          }
        } else {
          console.warn('👥 Respuesta de usuarios no válida:', response);
          this.users = [];
        }
      },
      error: error => {
        console.error('👥 Error cargando usuarios:', error);
        this.users = [];
        this.snackBar.open('Error al cargar los usuarios', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }
  loadCurrentUser() {
    console.log('👤 Cargando información del usuario actual...');
    // Obtener usuario actual del servicio de autenticación
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      console.log('👤 Usuario actual:', this.currentUser);
      console.log('👤 Role ID:', this.currentUser.role_id);
      console.log('👤 Role Name:', this.currentUser.role_name);
      // Verificar si el usuario es asesor u operador
      this.isUserFilterDisabled = this.isAdvisorOrOperator(this.currentUser);
      console.log('🔒 isUserFilterDisabled:', this.isUserFilterDisabled);
      if (this.isUserFilterDisabled) {
        console.log('🔒 Usuario es asesor u operador, deshabilitando filtro de usuario');
        // Seleccionar automáticamente el usuario actual
        this.selectedUserId = parseInt(this.currentUser.id);
        this.onUserChange(this.selectedUserId);
      } else if (this.isManagerOrAdmin(this.currentUser)) {
        console.log('👑 Usuario es gerente o administrador, seleccionando "Todos los usuarios"');
        // Seleccionar automáticamente "Todos los usuarios"
        this.selectedUserId = null;
        console.log('👑 selectedUserId establecido a:', this.selectedUserId);
        this.onUserChange(null);
        console.log('👑 onUserChange(null) ejecutado');
      } else {
        console.log('👤 Usuario con rol no reconocido, no se aplica selección automática');
      }
    } else {
      console.warn('👤 No se pudo obtener información del usuario actual');
    }
  }
  isAdvisorOrOperator(user) {
    if (!user || !user.role_name) {
      return false;
    }
    const roleName = user.role_name.toLowerCase();
    return roleName.includes('asesor') || roleName.includes('operador');
  }
  isManagerOrAdmin(user) {
    if (!user) {
      return false;
    }
    // Verificar por role_id (admin tiene role_id = '7')
    if (user.role_id === '7' || user.role_id === 7) {
      console.log('👑 Usuario identificado como admin por role_id:', user.role_id);
      return true;
    }
    // Verificar por role_name
    if (user.role_name) {
      const roleName = user.role_name.toLowerCase();
      const isManagerOrAdmin = roleName.includes('gerente') || roleName.includes('administrador') || roleName.includes('admin');
      if (isManagerOrAdmin) {
        console.log('👑 Usuario identificado como gerente/admin por role_name:', user.role_name);
      }
      return isManagerOrAdmin;
    }
    return false;
  }
  hasAgencies() {
    return Array.isArray(this.agencies) && this.agencies.length > 0;
  }
  hasUsers() {
    return Array.isArray(this.users) && this.users.length > 0;
  }
  trackByUserId(index, user) {
    return user?.Id || index;
  }
  onUserChange(userId) {
    console.log('🔄 onUserChange llamado con userId:', userId);
    this.selectedUserId = userId;
    console.log('🔄 selectedUserId actualizado a:', this.selectedUserId);
    this.currentFilters = {
      ...this.currentFilters,
      userId: userId || undefined
    };
    console.log('🔄 currentFilters actualizado:', this.currentFilters);
    this.loadDashboardData();
  }
  // Método para verificar el estado actual del filtro
  getCurrentUserFilterState() {
    console.log('🔍 Estado actual del filtro de usuario:');
    console.log('  - selectedUserId:', this.selectedUserId);
    console.log('  - isUserFilterDisabled:', this.isUserFilterDisabled);
    console.log('  - users.length:', this.users.length);
    console.log('  - currentUser.role_id:', this.currentUser?.role_id);
    console.log('  - currentUser.role_name:', this.currentUser?.role_name);
  }
  clearUserFilter() {
    this.selectedUserId = null;
    this.onUserChange(null);
  }
  trackByAgencyId(index, agency) {
    return agency?.Id || index;
  }
  clearAgencyFilter() {
    this.selectedAgencyId = null;
    this.onAgencyChange(null);
  }
  hasDateRange() {
    return this.selectedDateRange !== null && this.selectedDateRange.startDate !== null && this.selectedDateRange.endDate !== null;
  }
  toggleManualDateInputs() {
    this.showManualDateInputs = !this.showManualDateInputs;
  }
  clearDateRange() {
    this.dateRangeForm.patchValue({
      startDate: null,
      endDate: null
    });
    this.selectedDateRange = null;
    this.activeDateRange = null;
    this.currentFilters = {
      ...this.currentFilters,
      dateRange: undefined
    };
    this.loadDashboardData();
  }
  setLast7Days() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);
    this.dateRangeForm.patchValue({
      startDate,
      endDate
    });
    this.activeDateRange = '7d';
  }
  setLast30Days() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);
    this.dateRangeForm.patchValue({
      startDate,
      endDate
    });
    this.activeDateRange = '30d';
  }
  setLast90Days() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 90);
    this.dateRangeForm.patchValue({
      startDate,
      endDate
    });
    this.activeDateRange = '90d';
  }
  setThisMonth() {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    this.dateRangeForm.patchValue({
      startDate,
      endDate
    });
    this.activeDateRange = 'thisMonth';
  }
  setLastMonth() {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endDate = new Date(now.getFullYear(), now.getMonth(), 0);
    this.dateRangeForm.patchValue({
      startDate,
      endDate
    });
    this.activeDateRange = 'lastMonth';
  }
  setThisYear() {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), 0, 1);
    const endDate = new Date(now.getFullYear(), 11, 31);
    this.dateRangeForm.patchValue({
      startDate,
      endDate
    });
    this.activeDateRange = 'thisYear';
  }
  searchData() {
    console.log('🔍 Buscando con filtros actuales:', this.currentFilters);
    this.loadDashboardData();
  }
  hasAnyFilter() {
    return this.selectedAgencyId !== null || this.selectedUserId !== null || this.hasDateRange();
  }
  clearAllFilters() {
    console.log('🧹 Limpiando todos los filtros');
    // Limpiar agencia
    this.selectedAgencyId = null;
    // Limpiar usuario
    this.selectedUserId = null;
    // Limpiar fechas
    this.dateRangeForm.patchValue({
      startDate: null,
      endDate: null
    });
    this.selectedDateRange = null;
    this.activeDateRange = null;
    // Limpiar filtros
    this.currentFilters = {};
    // Recargar datos
    this.loadDashboardData();
    this.snackBar.open('Todos los filtros han sido limpiados', 'Cerrar', {
      duration: 2000
    });
  }
  onFiltersChange(filters) {
    this.currentFilters = filters;
    this.loadDashboardData();
  }
  onExportRequest(event) {
    this.analyticsService.exportAnalytics(event.format, event.filters).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_10__.takeUntil)(this.destroy$)).subscribe({
      next: blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `admin-analytics-report.${event.format === 'pdf' ? 'pdf' : 'xlsx'}`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.snackBar.open(`Reporte de administración exportado como ${event.format.toUpperCase()}`, 'Cerrar', {
          duration: 3000
        });
      },
      error: error => {
        console.error('Error exporting admin analytics:', error);
        this.snackBar.open('Error al exportar el reporte de administración', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }
  refreshData() {
    this.loadDashboardData();
  }
  getHealthStatusColor(metric, thresholds) {
    if (metric >= thresholds.critical) return 'text-red-600';
    if (metric >= thresholds.warning) return 'text-yellow-600';
    return 'text-green-600';
  }
  getHealthStatusIcon(metric, thresholds) {
    if (metric >= thresholds.critical) return 'mat:error';
    if (metric >= thresholds.warning) return 'mat:warning';
    return 'mat:check_circle';
  }
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  formatCurrency(amount) {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }
  static #_ = this.ɵfac = function DashboardAdminAnalyticsComponent_Factory(t) {
    return new (t || DashboardAdminAnalyticsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_core_services_analytics_service__WEBPACK_IMPORTED_MODULE_1__.AnalyticsService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_core_services_agency_service__WEBPACK_IMPORTED_MODULE_2__.AgencyService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_core_services_default_agency_service__WEBPACK_IMPORTED_MODULE_3__.DefaultAgencyService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_core_services_user_service__WEBPACK_IMPORTED_MODULE_4__.UserService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_core_services_auth_service__WEBPACK_IMPORTED_MODULE_5__.AuthService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_core_services_real_time_analytics_service__WEBPACK_IMPORTED_MODULE_6__.RealTimeAnalyticsService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_11__.MatSnackBar), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_7__.ChangeDetectorRef));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineComponent"]({
    type: DashboardAdminAnalyticsComponent,
    selectors: [["vex-dashboard-admin-analytics"]],
    viewQuery: function DashboardAdminAnalyticsComponent_Query(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵviewQuery"](_c0, 5);
      }
      if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵloadQuery"]()) && (ctx.userSelect = _t.first);
      }
    },
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵStandaloneFeature"]],
    decls: 52,
    vars: 39,
    consts: [[1, "w-full", "p-6", "space-y-4"], [1, "bg-white", "rounded-lg", "shadow-sm", "border", "border-gray-200", "p-4", "w-full"], [1, "flex", "items-center", "justify-between", "gap-4", "w-full"], [1, "flex", "items-center", "space-x-4"], ["appearance", "outline", 1, "min-w-48"], [3, "value", "disabled", "selectionChange"], [3, "value"], [3, "value", 4, "ngFor", "ngForOf", "ngForTrackBy"], [4, "ngIf"], ["appearance", "outline", 1, "min-w-96"], ["userSelect", ""], [1, "flex", "items-center", "space-x-2"], [1, "flex", "flex-wrap", "gap-1"], ["mat-stroked-button", "", "size", "small", 1, "text-xs", "px-2", "py-1", 3, "click"], ["mat-icon-button", "", "size", "small", 1, "toggle-button", 3, "matTooltip", "click"], [1, "arrow-icon"], ["mat-icon-button", "", "color", "primary", "size", "small", "matTooltip", "Buscar con filtros actuales", 3, "click"], ["mat-icon-button", "", "color", "warn", "size", "small", "matTooltip", "Limpiar filtro de fechas", 3, "click", 4, "ngIf"], ["mat-icon-button", "", "color", "warn", "size", "small", "matTooltip", "Limpiar filtro de agencia", 3, "click", 4, "ngIf"], ["mat-icon-button", "", "color", "warn", "size", "small", "matTooltip", "Limpiar filtro de usuario", 3, "click", 4, "ngIf"], ["mat-icon-button", "", "color", "warn", "size", "small", "matTooltip", "Limpiar todos los filtros", 3, "click", 4, "ngIf"], ["class", "grid grid-cols-2 gap-2 mt-4 manual-date-inputs", 4, "ngIf"], ["class", "flex justify-center py-12", 4, "ngIf"], ["class", "bg-red-50 border border-red-200 rounded-lg p-6 text-center", 4, "ngIf"], ["mat-icon-button", "", "color", "warn", "size", "small", "matTooltip", "Limpiar filtro de fechas", 3, "click"], ["mat-icon-button", "", "color", "warn", "size", "small", "matTooltip", "Limpiar filtro de agencia", 3, "click"], ["mat-icon-button", "", "color", "warn", "size", "small", "matTooltip", "Limpiar filtro de usuario", 3, "click"], ["mat-icon-button", "", "color", "warn", "size", "small", "matTooltip", "Limpiar todos los filtros", 3, "click"], [1, "grid", "grid-cols-2", "gap-2", "mt-4", "manual-date-inputs"], ["appearance", "outline", 1, "compact-field"], ["matInput", "", "formControlName", "startDate", "placeholder", "Fecha inicio", 3, "matDatepicker"], ["matSuffix", "", 3, "for"], ["startPicker", ""], ["matInput", "", "formControlName", "endDate", "placeholder", "Fecha fin", 3, "matDatepicker"], ["endPicker", ""], [1, "flex", "justify-center", "py-12"], [1, "text-center"], ["svgIcon", "mat:hourglass_empty", 1, "text-4xl", "text-gray-400", "mb-4"], [1, "text-gray-600"], [1, "bg-red-50", "border", "border-red-200", "rounded-lg", "p-6", "text-center"], ["svgIcon", "mat:error", 1, "text-red-500", "mb-2"], [1, "text-red-600"], ["mat-button", "", "color", "primary", 3, "click"], [1, "admin-tabs", 3, "selectedIndex", "selectedIndexChange"], ["label", "Sistema"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-6", "mt-6"], [1, "system-health-card"], ["svgIcon", "mat:health_and_safety", 1, "text-green-600"], [1, "space-y-4"], [1, "flex", "justify-between", "items-center"], [1, "text-sm", "text-gray-600"], [1, "font-semibold"], [1, "security-metrics-card"], ["svgIcon", "mat:security", 1, "text-red-600"], [1, "font-semibold", "text-red-600"], [1, "font-semibold", "text-yellow-600"], [1, "text-xs", "text-gray-500"], [1, "performance-metrics-card"], ["svgIcon", "mat:speed", 1, "text-blue-600"], [1, "font-semibold", "text-green-600"], [1, "business-metrics-card"], ["svgIcon", "mat:trending_up", 1, "text-purple-600"], [1, "font-semibold", "text-blue-600"], ["label", "Detalladas"], [1, "mt-6"], [3, "agencyId", "showDetails"]],
    template: function DashboardAdminAnalyticsComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "mat-form-field", 4)(5, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](6, "Agencia");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](7, "mat-select", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("selectionChange", function DashboardAdminAnalyticsComponent_Template_mat_select_selectionChange_7_listener($event) {
          return ctx.onAgencyChange($event.value);
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](8, "mat-option", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](9, "Todas las agencias");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](10, DashboardAdminAnalyticsComponent_mat_option_10_Template, 2, 2, "mat-option", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](11, DashboardAdminAnalyticsComponent_mat_hint_11_Template, 2, 0, "mat-hint", 8)(12, DashboardAdminAnalyticsComponent_mat_hint_12_Template, 2, 0, "mat-hint", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](13, "mat-form-field", 9)(14, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](15, "Usuario");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](16, "mat-select", 5, 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("selectionChange", function DashboardAdminAnalyticsComponent_Template_mat_select_selectionChange_16_listener($event) {
          return ctx.onUserChange($event.value);
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](18, "mat-option", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](19, "Todos los usuarios");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](20, DashboardAdminAnalyticsComponent_mat_option_20_Template, 2, 2, "mat-option", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](21, DashboardAdminAnalyticsComponent_mat_hint_21_Template, 2, 0, "mat-hint", 8)(22, DashboardAdminAnalyticsComponent_mat_hint_22_Template, 2, 0, "mat-hint", 8)(23, DashboardAdminAnalyticsComponent_mat_hint_23_Template, 2, 0, "mat-hint", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](24, "div", 11)(25, "div", 12)(26, "button", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function DashboardAdminAnalyticsComponent_Template_button_click_26_listener() {
          return ctx.setLast7Days();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](27, " 7d ");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](28, "button", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function DashboardAdminAnalyticsComponent_Template_button_click_28_listener() {
          return ctx.setLast30Days();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](29, " 30d ");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](30, "button", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function DashboardAdminAnalyticsComponent_Template_button_click_30_listener() {
          return ctx.setLast90Days();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](31, " 90d ");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](32, "button", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function DashboardAdminAnalyticsComponent_Template_button_click_32_listener() {
          return ctx.setThisMonth();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](33, " Este mes ");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](34, "button", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function DashboardAdminAnalyticsComponent_Template_button_click_34_listener() {
          return ctx.setLastMonth();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](35, " Mes pasado ");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](36, "button", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function DashboardAdminAnalyticsComponent_Template_button_click_36_listener() {
          return ctx.setThisYear();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](37, " Este a\u00F1o ");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](38, "button", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function DashboardAdminAnalyticsComponent_Template_button_click_38_listener() {
          return ctx.toggleManualDateInputs();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](39, "mat-icon", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](40);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](41, "button", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function DashboardAdminAnalyticsComponent_Template_button_click_41_listener() {
          return ctx.searchData();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](42, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](43, "search");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](44, DashboardAdminAnalyticsComponent_button_44_Template, 3, 0, "button", 17)(45, DashboardAdminAnalyticsComponent_button_45_Template, 3, 0, "button", 18)(46, DashboardAdminAnalyticsComponent_button_46_Template, 3, 0, "button", 19)(47, DashboardAdminAnalyticsComponent_button_47_Template, 3, 0, "button", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](48, DashboardAdminAnalyticsComponent_div_48_Template, 15, 4, "div", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](49, DashboardAdminAnalyticsComponent_div_49_Template, 5, 0, "div", 22)(50, DashboardAdminAnalyticsComponent_div_50_Template, 6, 1, "div", 23)(51, DashboardAdminAnalyticsComponent_div_51_Template, 116, 34, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("value", ctx.selectedAgencyId)("disabled", ctx.loading || !ctx.hasAgencies());
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("value", null);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngForOf", ctx.agencies)("ngForTrackBy", ctx.trackByAgencyId);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", !ctx.loading && !ctx.hasAgencies());
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("value", ctx.selectedUserId)("disabled", ctx.loading || !ctx.hasUsers() || ctx.isUserFilterDisabled);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("value", null);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngForOf", ctx.users)("ngForTrackBy", ctx.trackByUserId);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", !ctx.loading && !ctx.hasUsers());
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.isUserFilterDisabled);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵclassProp"]("mat-primary", ctx.activeDateRange === "7d");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵclassProp"]("mat-primary", ctx.activeDateRange === "30d");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵclassProp"]("mat-primary", ctx.activeDateRange === "90d");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵclassProp"]("mat-primary", ctx.activeDateRange === "thisMonth");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵclassProp"]("mat-primary", ctx.activeDateRange === "lastMonth");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵclassProp"]("mat-primary", ctx.activeDateRange === "thisYear");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("matTooltip", ctx.showManualDateInputs ? "Ocultar fechas manuales" : "Mostrar fechas manuales");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵclassProp"]("expanded", ctx.showManualDateInputs);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", ctx.showManualDateInputs ? "keyboard_arrow_up" : "keyboard_arrow_down", " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.hasDateRange());
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.selectedAgencyId);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.selectedUserId);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.hasAnyFilter());
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.showManualDateInputs);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.error);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", !ctx.loading && !ctx.error);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_12__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_12__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_12__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_12__.DatePipe, _angular_material_icon__WEBPACK_IMPORTED_MODULE_13__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_13__.MatIcon, _angular_material_button__WEBPACK_IMPORTED_MODULE_14__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_14__.MatButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_14__.MatIconButton, _angular_material_card__WEBPACK_IMPORTED_MODULE_15__.MatCardModule, _angular_material_card__WEBPACK_IMPORTED_MODULE_15__.MatCard, _angular_material_card__WEBPACK_IMPORTED_MODULE_15__.MatCardContent, _angular_material_card__WEBPACK_IMPORTED_MODULE_15__.MatCardHeader, _angular_material_card__WEBPACK_IMPORTED_MODULE_15__.MatCardTitle, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_16__.MatTabsModule, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_16__.MatTab, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_16__.MatTabGroup, _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_11__.MatSnackBarModule, _components_widgets_widget_agency_metrics_widget_agency_metrics_component__WEBPACK_IMPORTED_MODULE_0__.WidgetAgencyMetricsComponent, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_17__.MatFormFieldModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_17__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_17__.MatLabel, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_17__.MatHint, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_17__.MatSuffix, _angular_material_select__WEBPACK_IMPORTED_MODULE_18__.MatSelectModule, _angular_material_select__WEBPACK_IMPORTED_MODULE_18__.MatSelect, _angular_material_core__WEBPACK_IMPORTED_MODULE_19__.MatOption, _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_20__.MatDatepickerModule, _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_20__.MatDatepicker, _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_20__.MatDatepickerInput, _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_20__.MatDatepickerToggle, _angular_material_input__WEBPACK_IMPORTED_MODULE_21__.MatInputModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_21__.MatInput, _angular_material_core__WEBPACK_IMPORTED_MODULE_19__.MatNativeDateModule, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_22__.MatTooltipModule, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_22__.MatTooltip, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.FormControlName],
    styles: [".admin-analytics-dashboard[_ngcontent-%COMP%]   .admin-tabs[_ngcontent-%COMP%]   .mat-tab-group[_ngcontent-%COMP%]   .mat-tab-header[_ngcontent-%COMP%] {\n  border-bottom: 2px solid #e5e7eb;\n}\n.admin-analytics-dashboard[_ngcontent-%COMP%]   .admin-tabs[_ngcontent-%COMP%]   .mat-tab-group[_ngcontent-%COMP%]   .mat-tab-label[_ngcontent-%COMP%] {\n  font-weight: 500;\n  color: #6b7280;\n}\n.admin-analytics-dashboard[_ngcontent-%COMP%]   .admin-tabs[_ngcontent-%COMP%]   .mat-tab-group[_ngcontent-%COMP%]   .mat-tab-label.mat-tab-label-active[_ngcontent-%COMP%] {\n  color: #3b82f6;\n  font-weight: 600;\n}\n.admin-analytics-dashboard[_ngcontent-%COMP%]   .system-health-card[_ngcontent-%COMP%], .admin-analytics-dashboard[_ngcontent-%COMP%]   .security-metrics-card[_ngcontent-%COMP%], .admin-analytics-dashboard[_ngcontent-%COMP%]   .performance-metrics-card[_ngcontent-%COMP%], .admin-analytics-dashboard[_ngcontent-%COMP%]   .business-metrics-card[_ngcontent-%COMP%] {\n  transition: all 0.2s ease-in-out;\n}\n.admin-analytics-dashboard[_ngcontent-%COMP%]   .system-health-card[_ngcontent-%COMP%]:hover, .admin-analytics-dashboard[_ngcontent-%COMP%]   .security-metrics-card[_ngcontent-%COMP%]:hover, .admin-analytics-dashboard[_ngcontent-%COMP%]   .performance-metrics-card[_ngcontent-%COMP%]:hover, .admin-analytics-dashboard[_ngcontent-%COMP%]   .business-metrics-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);\n}\n.admin-analytics-dashboard[_ngcontent-%COMP%]   .metric-value[_ngcontent-%COMP%] {\n  font-family: \"Monaco\", \"Menlo\", \"Ubuntu Mono\", monospace;\n  font-weight: 600;\n}\n.admin-analytics-dashboard[_ngcontent-%COMP%]   .status-indicator[_ngcontent-%COMP%] {\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  display: inline-block;\n  margin-right: 8px;\n}\n.admin-analytics-dashboard[_ngcontent-%COMP%]   .status-indicator.healthy[_ngcontent-%COMP%] {\n  background-color: #10b981;\n  animation: _ngcontent-%COMP%_pulse-green 2s infinite;\n}\n.admin-analytics-dashboard[_ngcontent-%COMP%]   .status-indicator.warning[_ngcontent-%COMP%] {\n  background-color: #f59e0b;\n  animation: _ngcontent-%COMP%_pulse-yellow 2s infinite;\n}\n.admin-analytics-dashboard[_ngcontent-%COMP%]   .status-indicator.critical[_ngcontent-%COMP%] {\n  background-color: #ef4444;\n  animation: _ngcontent-%COMP%_pulse-red 2s infinite;\n}\n@keyframes _ngcontent-%COMP%_pulse-green {\n  0%, 100% {\n    opacity: 1;\n    transform: scale(1);\n  }\n  50% {\n    opacity: 0.7;\n    transform: scale(1.1);\n  }\n}\n@keyframes _ngcontent-%COMP%_pulse-yellow {\n  0%, 100% {\n    opacity: 1;\n    transform: scale(1);\n  }\n  50% {\n    opacity: 0.7;\n    transform: scale(1.1);\n  }\n}\n@keyframes _ngcontent-%COMP%_pulse-red {\n  0%, 100% {\n    opacity: 1;\n    transform: scale(1);\n  }\n  50% {\n    opacity: 0.7;\n    transform: scale(1.1);\n  }\n}\n.admin-analytics-dashboard[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%] {\n  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);\n  border: 1px solid #e2e8f0;\n}\n.admin-analytics-dashboard[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%]:hover {\n  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);\n}\n.admin-analytics-dashboard[_ngcontent-%COMP%]   .real-time-section[_ngcontent-%COMP%] {\n  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);\n  border: 1px solid #f59e0b;\n  border-radius: 8px;\n  padding: 16px;\n}\n.admin-analytics-dashboard[_ngcontent-%COMP%]   .loading-state[_ngcontent-%COMP%] {\n  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);\n  background-size: 200% 100%;\n  animation: _ngcontent-%COMP%_loading 1.5s infinite;\n}\n@keyframes _ngcontent-%COMP%_loading {\n  0% {\n    background-position: 200% 0;\n  }\n  100% {\n    background-position: -200% 0;\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvZGFzaGJvYXJkcy9kYXNoYm9hcmQtYWRtaW4tYW5hbHl0aWNzL2Rhc2hib2FyZC1hZG1pbi1hbmFseXRpY3MuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR007RUFDRSxnQ0FBQTtBQUZSO0FBS007RUFDRSxnQkFBQTtFQUNBLGNBQUE7QUFIUjtBQUtRO0VBQ0UsY0FBQTtFQUNBLGdCQUFBO0FBSFY7QUFTRTs7OztFQUlFLGdDQUFBO0FBUEo7QUFTSTs7OztFQUNFLDJCQUFBO0VBQ0EseUNBQUE7QUFKTjtBQVFFO0VBQ0Usd0RBQUE7RUFDQSxnQkFBQTtBQU5KO0FBU0U7RUFDRSxVQUFBO0VBQ0EsV0FBQTtFQUNBLGtCQUFBO0VBQ0EscUJBQUE7RUFDQSxpQkFBQTtBQVBKO0FBU0k7RUFDRSx5QkFBQTtFQUNBLGtDQUFBO0FBUE47QUFVSTtFQUNFLHlCQUFBO0VBQ0EsbUNBQUE7QUFSTjtBQVdJO0VBQ0UseUJBQUE7RUFDQSxnQ0FBQTtBQVROO0FBYUU7RUFDRTtJQUNFLFVBQUE7SUFDQSxtQkFBQTtFQVhKO0VBYUU7SUFDRSxZQUFBO0lBQ0EscUJBQUE7RUFYSjtBQUNGO0FBY0U7RUFDRTtJQUNFLFVBQUE7SUFDQSxtQkFBQTtFQVpKO0VBY0U7SUFDRSxZQUFBO0lBQ0EscUJBQUE7RUFaSjtBQUNGO0FBZUU7RUFDRTtJQUNFLFVBQUE7SUFDQSxtQkFBQTtFQWJKO0VBZUU7SUFDRSxZQUFBO0lBQ0EscUJBQUE7RUFiSjtBQUNGO0FBZ0JFO0VBQ0UsNkRBQUE7RUFDQSx5QkFBQTtBQWRKO0FBZ0JJO0VBQ0UsNkRBQUE7QUFkTjtBQWtCRTtFQUNFLDZEQUFBO0VBQ0EseUJBQUE7RUFDQSxrQkFBQTtFQUNBLGFBQUE7QUFoQko7QUFtQkU7RUFDRSx5RUFBQTtFQUNBLDBCQUFBO0VBQ0EsZ0NBQUE7QUFqQko7QUFvQkU7RUFDRTtJQUNFLDJCQUFBO0VBbEJKO0VBb0JFO0lBQ0UsNEJBQUE7RUFsQko7QUFDRiIsInNvdXJjZXNDb250ZW50IjpbIi5hZG1pbi1hbmFseXRpY3MtZGFzaGJvYXJkIHtcbiAgLmFkbWluLXRhYnMge1xuICAgIC5tYXQtdGFiLWdyb3VwIHtcbiAgICAgIC5tYXQtdGFiLWhlYWRlciB7XG4gICAgICAgIGJvcmRlci1ib3R0b206IDJweCBzb2xpZCAjZTVlN2ViO1xuICAgICAgfVxuICAgICAgXG4gICAgICAubWF0LXRhYi1sYWJlbCB7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgIGNvbG9yOiAjNmI3MjgwO1xuICAgICAgICBcbiAgICAgICAgJi5tYXQtdGFiLWxhYmVsLWFjdGl2ZSB7XG4gICAgICAgICAgY29sb3I6ICMzYjgyZjY7XG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC5zeXN0ZW0taGVhbHRoLWNhcmQsXG4gIC5zZWN1cml0eS1tZXRyaWNzLWNhcmQsXG4gIC5wZXJmb3JtYW5jZS1tZXRyaWNzLWNhcmQsXG4gIC5idXNpbmVzcy1tZXRyaWNzLWNhcmQge1xuICAgIHRyYW5zaXRpb246IGFsbCAwLjJzIGVhc2UtaW4tb3V0O1xuICAgIFxuICAgICY6aG92ZXIge1xuICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0ycHgpO1xuICAgICAgYm94LXNoYWRvdzogMCA4cHggMjVweCByZ2JhKDAsIDAsIDAsIDAuMSk7XG4gICAgfVxuICB9XG5cbiAgLm1ldHJpYy12YWx1ZSB7XG4gICAgZm9udC1mYW1pbHk6ICdNb25hY28nLCAnTWVubG8nLCAnVWJ1bnR1IE1vbm8nLCBtb25vc3BhY2U7XG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgfVxuXG4gIC5zdGF0dXMtaW5kaWNhdG9yIHtcbiAgICB3aWR0aDogOHB4O1xuICAgIGhlaWdodDogOHB4O1xuICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgbWFyZ2luLXJpZ2h0OiA4cHg7XG4gICAgXG4gICAgJi5oZWFsdGh5IHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICMxMGI5ODE7XG4gICAgICBhbmltYXRpb246IHB1bHNlLWdyZWVuIDJzIGluZmluaXRlO1xuICAgIH1cbiAgICBcbiAgICAmLndhcm5pbmcge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2Y1OWUwYjtcbiAgICAgIGFuaW1hdGlvbjogcHVsc2UteWVsbG93IDJzIGluZmluaXRlO1xuICAgIH1cbiAgICBcbiAgICAmLmNyaXRpY2FsIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICNlZjQ0NDQ7XG4gICAgICBhbmltYXRpb246IHB1bHNlLXJlZCAycyBpbmZpbml0ZTtcbiAgICB9XG4gIH1cblxuICBAa2V5ZnJhbWVzIHB1bHNlLWdyZWVuIHtcbiAgICAwJSwgMTAwJSB7XG4gICAgICBvcGFjaXR5OiAxO1xuICAgICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgICB9XG4gICAgNTAlIHtcbiAgICAgIG9wYWNpdHk6IDAuNztcbiAgICAgIHRyYW5zZm9ybTogc2NhbGUoMS4xKTtcbiAgICB9XG4gIH1cblxuICBAa2V5ZnJhbWVzIHB1bHNlLXllbGxvdyB7XG4gICAgMCUsIDEwMCUge1xuICAgICAgb3BhY2l0eTogMTtcbiAgICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gICAgfVxuICAgIDUwJSB7XG4gICAgICBvcGFjaXR5OiAwLjc7XG4gICAgICB0cmFuc2Zvcm06IHNjYWxlKDEuMSk7XG4gICAgfVxuICB9XG5cbiAgQGtleWZyYW1lcyBwdWxzZS1yZWQge1xuICAgIDAlLCAxMDAlIHtcbiAgICAgIG9wYWNpdHk6IDE7XG4gICAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICAgIH1cbiAgICA1MCUge1xuICAgICAgb3BhY2l0eTogMC43O1xuICAgICAgdHJhbnNmb3JtOiBzY2FsZSgxLjEpO1xuICAgIH1cbiAgfVxuXG4gIC5tZXRyaWMtY2FyZCB7XG4gICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDEzNWRlZywgI2Y4ZmFmYyAwJSwgI2YxZjVmOSAxMDAlKTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjZTJlOGYwO1xuICAgIFxuICAgICY6aG92ZXIge1xuICAgICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDEzNWRlZywgI2YxZjVmOSAwJSwgI2UyZThmMCAxMDAlKTtcbiAgICB9XG4gIH1cblxuICAucmVhbC10aW1lLXNlY3Rpb24ge1xuICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxMzVkZWcsICNmZWYzYzcgMCUsICNmZGU2OGEgMTAwJSk7XG4gICAgYm9yZGVyOiAxcHggc29saWQgI2Y1OWUwYjtcbiAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgcGFkZGluZzogMTZweDtcbiAgfVxuXG4gIC5sb2FkaW5nLXN0YXRlIHtcbiAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoOTBkZWcsICNmMGYwZjAgMjUlLCAjZTBlMGUwIDUwJSwgI2YwZjBmMCA3NSUpO1xuICAgIGJhY2tncm91bmQtc2l6ZTogMjAwJSAxMDAlO1xuICAgIGFuaW1hdGlvbjogbG9hZGluZyAxLjVzIGluZmluaXRlO1xuICB9XG5cbiAgQGtleWZyYW1lcyBsb2FkaW5nIHtcbiAgICAwJSB7XG4gICAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAyMDAlIDA7XG4gICAgfVxuICAgIDEwMCUge1xuICAgICAgYmFja2dyb3VuZC1wb3NpdGlvbjogLTIwMCUgMDtcbiAgICB9XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
  });
}

/***/ })

}]);
//# sourceMappingURL=src_app_pages_dashboards_dashboard-admin-analytics_dashboard-admin-analytics_component_ts.js.map