"use strict";
(self["webpackChunkvex"] = self["webpackChunkvex"] || []).push([["src_app_pages_procesos_integracion_integracion_component_ts"],{

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

/***/ 91427:
/*!*********************************************************************************!*\
  !*** ./src/app/pages/procesos/integracion/client-selection-dialog.component.ts ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ClientSelectionDialogComponent: () => (/* binding */ ClientSelectionDialogComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/dialog */ 17401);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_material_table__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/table */ 46798);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 61699);











function ClientSelectionDialogComponent_th_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "th", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "N\u00B0 Cliente");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function ClientSelectionDialogComponent_td_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "td", 19)(1, "div", 20)(2, "mat-icon", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "fingerprint");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "span", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const client_r10 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](client_r10.ndCliente);
  }
}
function ClientSelectionDialogComponent_th_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "th", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Cliente");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function ClientSelectionDialogComponent_td_15_div_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const client_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("Raz\u00F3n Social: ", client_r11.razonSocial, "");
  }
}
function ClientSelectionDialogComponent_td_15_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "td", 19)(1, "div", 23)(2, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](4, ClientSelectionDialogComponent_td_15_div_4_Template, 2, 1, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const client_r11 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](client_r11.cliente);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", client_r11.razonSocial && client_r11.razonSocial !== client_r11.cliente);
  }
}
function ClientSelectionDialogComponent_th_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "th", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "RFC");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function ClientSelectionDialogComponent_td_18_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const client_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](client_r14.rfc);
  }
}
function ClientSelectionDialogComponent_td_18_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Sin RFC");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function ClientSelectionDialogComponent_td_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "td", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, ClientSelectionDialogComponent_td_18_span_1_Template, 2, 1, "span", 27)(2, ClientSelectionDialogComponent_td_18_ng_template_2_Template, 2, 0, "ng-template", null, 28, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const client_r14 = ctx.$implicit;
    const _r17 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", client_r14.rfc)("ngIfElse", _r17);
  }
}
function ClientSelectionDialogComponent_th_20_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "th", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Email");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function ClientSelectionDialogComponent_td_21_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const client_r19 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](client_r19.email);
  }
}
function ClientSelectionDialogComponent_td_21_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Sin email");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function ClientSelectionDialogComponent_td_21_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "td", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, ClientSelectionDialogComponent_td_21_span_1_Template, 2, 1, "span", 27)(2, ClientSelectionDialogComponent_td_21_ng_template_2_Template, 2, 0, "ng-template", null, 30, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const client_r19 = ctx.$implicit;
    const _r22 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", client_r19.email)("ngIfElse", _r22);
  }
}
function ClientSelectionDialogComponent_tr_22_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "tr", 31);
  }
}
function ClientSelectionDialogComponent_tr_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r26 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "tr", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function ClientSelectionDialogComponent_tr_23_Template_tr_click_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r26);
      const row_r24 = restoredCtx.$implicit;
      const ctx_r25 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r25.selectClient(row_r24));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
class ClientSelectionDialogComponent {
  constructor(dialogRef, data) {
    this.dialogRef = dialogRef;
    this.data = data;
    this.displayedColumns = ['ndCliente', 'cliente', 'rfc', 'email'];
  }
  selectClient(client) {
    this.dialogRef.close(client);
  }
  onCancel() {
    this.dialogRef.close();
  }
  static #_ = this.ɵfac = function ClientSelectionDialogComponent_Factory(t) {
    return new (t || ClientSelectionDialogComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__.MatDialogRef), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__.MAT_DIALOG_DATA));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
    type: ClientSelectionDialogComponent,
    selectors: [["app-client-selection-dialog"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵStandaloneFeature"]],
    decls: 29,
    vars: 4,
    consts: [[1, "dialog-container"], ["mat-dialog-title", "", 1, "text-xl", "font-semibold", "mb-4"], [1, "mr-2"], ["mat-dialog-content", "", 1, "mb-6", "dialog-content"], [1, "text-gray-600", "mb-4", "client-info"], [1, "overflow-x-auto", "table-container"], ["mat-table", "", 1, "w-full", 3, "dataSource"], ["matColumnDef", "ndCliente"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "cliente"], ["matColumnDef", "rfc"], ["matColumnDef", "email"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", "class", "hover:bg-gray-50 cursor-pointer", 3, "click", 4, "matRowDef", "matRowDefColumns"], ["mat-dialog-actions", "", 1, "flex", "justify-end", "gap-2"], ["mat-button", "", 1, "text-sm", 3, "click"], [1, "mr-1", 2, "font-size", "16px"], ["mat-header-cell", ""], ["mat-cell", ""], [1, "flex", "items-center", "client-info"], [1, "mr-1", "text-blue-600", 2, "font-size", "14px"], [1, "font-medium"], [1, "client-info"], [1, "client-name"], ["class", "client-rfc", 4, "ngIf"], [1, "client-rfc"], ["class", "client-info", 4, "ngIf", "ngIfElse"], ["noRfc", ""], [1, "text-gray-400", "italic", "client-info"], ["noEmail", ""], ["mat-header-row", ""], ["mat-row", "", 1, "hover:bg-gray-50", "cursor-pointer", 3, "click"]],
    template: function ClientSelectionDialogComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "h2", 1)(2, "mat-icon", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "people");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, " Seleccionar Cliente ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 3)(6, "p", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "div", 5)(9, "table", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](10, 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](11, ClientSelectionDialogComponent_th_11_Template, 2, 0, "th", 8)(12, ClientSelectionDialogComponent_td_12_Template, 6, 1, "td", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](13, 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](14, ClientSelectionDialogComponent_th_14_Template, 2, 0, "th", 8)(15, ClientSelectionDialogComponent_td_15_Template, 5, 2, "td", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](16, 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](17, ClientSelectionDialogComponent_th_17_Template, 2, 0, "th", 8)(18, ClientSelectionDialogComponent_td_18_Template, 4, 2, "td", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](19, 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](20, ClientSelectionDialogComponent_th_20_Template, 2, 0, "th", 8)(21, ClientSelectionDialogComponent_td_21_Template, 4, 2, "td", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](22, ClientSelectionDialogComponent_tr_22_Template, 1, 0, "tr", 13)(23, ClientSelectionDialogComponent_tr_23_Template, 1, 0, "tr", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "div", 15)(25, "button", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function ClientSelectionDialogComponent_Template_button_click_25_listener() {
          return ctx.onCancel();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "mat-icon", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](27, "close");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](28, " Cancelar ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" Se encontraron ", ctx.data.clients.length, " clientes. Selecciona uno de la lista: ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("dataSource", ctx.data.clients);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("matHeaderRowDef", ctx.displayedColumns);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("matRowDefColumns", ctx.displayedColumns);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgIf, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__.MatDialogModule, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__.MatDialogTitle, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__.MatDialogActions, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__.MatDialogContent, _angular_material_button__WEBPACK_IMPORTED_MODULE_3__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_3__.MatButton, _angular_material_table__WEBPACK_IMPORTED_MODULE_4__.MatTableModule, _angular_material_table__WEBPACK_IMPORTED_MODULE_4__.MatTable, _angular_material_table__WEBPACK_IMPORTED_MODULE_4__.MatHeaderCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_4__.MatHeaderRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_4__.MatColumnDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_4__.MatCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_4__.MatRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_4__.MatHeaderCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_4__.MatCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_4__.MatHeaderRow, _angular_material_table__WEBPACK_IMPORTED_MODULE_4__.MatRow, _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__.MatIcon],
    styles: [".mat-mdc-dialog-container[_ngcontent-%COMP%] {\n                  --mdc-dialog-container-color: white;\n                }\n                \n                //[_ngcontent-%COMP%]   Contenedor[_ngcontent-%COMP%]   principal[_ngcontent-%COMP%]   del[_ngcontent-%COMP%]   di\u00E1logo[_ngcontent-%COMP%]   .dialog-container[_ngcontent-%COMP%] {\n                  width: calc(100% - 20px);\n                  height: calc(100% - 20px);\n                  margin: 10px;\n                  padding: 0;\n                  display: flex;\n                  flex-direction: column;\n                }\n                \n                //[_ngcontent-%COMP%]   Contenedor[_ngcontent-%COMP%]   de[_ngcontent-%COMP%]   contenido[_ngcontent-%COMP%]   .dialog-content[_ngcontent-%COMP%] {\n                  flex: 1;\n                  overflow: hidden;\n                  display: flex;\n                  flex-direction: column;\n                }\n                \n                //[_ngcontent-%COMP%]   Contenedor[_ngcontent-%COMP%]   de[_ngcontent-%COMP%]   la[_ngcontent-%COMP%]   tabla[_ngcontent-%COMP%]   .table-container[_ngcontent-%COMP%] {\n                  flex: 1;\n                  overflow: auto;\n                  min-height: 0;\n                }\n                \n                //   Estilos   espec\u00EDficos   para   las   tablas   (tomados   de   validaci\u00F3n)   [_nghost-%COMP%]     {\n      mat-table {\n        .mat-mdc-table {\n          border-collapse: separate !important;\n          border-spacing: 0 !important;\n          width: 100% !important;\n        }\n        \n        // Altura compacta para las filas\n        .mat-mdc-row {\n          min-height: 32px !important;\n          height: 32px !important;\n          max-height: 32px !important;\n          border-bottom: 1px solid rgba(0,0,0,.12) !important;\n          display: table-row !important;\n          cursor: pointer;\n          \n          &:hover {\n            background-color: #f1f5f9 !important;\n          }\n        }\n        \n        .mat-mdc-header-row {\n          min-height: 32px !important;\n          height: 32px !important;\n          max-height: 32px !important;\n          border-bottom: 1px solid rgba(0,0,0,.12) !important;\n          display: table-row !important;\n          background-color: #f8fafc !important;\n        }\n        \n        // Padding compacto para las celdas\n        .mat-mdc-cell {\n          padding: 4px 8px !important;\n          vertical-align: middle !important;\n          line-height: 1.2 !important;\n          font-size: 12px !important;\n          border: none !important;\n          height: 32px !important;\n          max-height: 32px !important;\n          overflow: hidden !important;\n          white-space: nowrap !important;\n          text-overflow: ellipsis !important;\n          text-align: left !important;\n        }\n        \n        .mat-mdc-header-cell {\n          padding: 4px 8px !important;\n          vertical-align: middle !important;\n          line-height: 1.2 !important;\n          font-size: 12px !important;\n          font-weight: 500 !important;\n          border: none !important;\n          height: 32px !important;\n          max-height: 32px !important;\n          overflow: hidden !important;\n          white-space: nowrap !important;\n          text-overflow: ellipsis !important;\n          text-align: left !important;\n        }\n        \n        // Eliminar cualquier espaciado extra\n        .mat-mdc-cell, .mat-mdc-header-cell {\n          margin: 0 !important;\n          border-spacing: 0 !important;\n        }\n      }\n      \n      // Estilos espec\u00EDficos para elementos que puedan estar causando diferencias\n      .mat-mdc-table-container {\n        overflow: hidden !important;\n      }\n      \n      .mat-mdc-table-wrapper {\n        overflow: hidden !important;\n      }\n      \n      // Estilos espec\u00EDficos para elementos internos\n      .mat-mdc-cell div,\n      .mat-mdc-cell span,\n      .mat-mdc-header-cell div,\n      .mat-mdc-header-cell span {\n        line-height: 1.2 !important;\n        margin: 0 !important;\n        padding: 0 !important;\n        font-size: 12px !important;\n      }\n    }\n    \n    //[_ngcontent-%COMP%]   Estilos[_ngcontent-%COMP%]   para[_ngcontent-%COMP%]   el[_ngcontent-%COMP%]   di\u00E1logo[_ngcontent-%COMP%]   .dialog-content[_ngcontent-%COMP%] {\n      max-height: 70vh;\n      overflow-y: auto;\n    }\n    \n    .client-info[_ngcontent-%COMP%] {\n      font-size: 12px;\n      line-height: 1.2;\n    }\n    \n    .client-name[_ngcontent-%COMP%] {\n      font-weight: 500;\n      color: #1f2937;\n    }\n    \n    .client-rfc[_ngcontent-%COMP%] {\n      color: #6b7280;\n      font-size: 11px;\n    }\n    \n    //   Estilos   espec\u00EDficos   para   columnas   [_nghost-%COMP%]     {\n      // Hacer la columna cliente m\u00E1s ancha\n      mat-table {\n        .mat-column-cliente {\n          min-width: 300px !important;\n          max-width: 400px !important;\n          width: 35% !important;\n        }\n        \n        .mat-column-ndCliente {\n          min-width: 120px !important;\n          width: 15% !important;\n        }\n        \n        .mat-column-rfc {\n          min-width: 150px !important;\n          width: 20% !important;\n        }\n        \n        .mat-column-email {\n          min-width: 200px !important;\n          width: 30% !important;\n        }\n      }\n    }\n  \n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvcHJvY2Vzb3MvaW50ZWdyYWNpb24vY2xpZW50LXNlbGVjdGlvbi1kaWFsb2cuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Z0JBQ2dCO2tCQUNFLG1DQUFtQztnQkFDckM7O2dCQUVBOztrQkFFRSx3QkFBd0I7a0JBQ3hCLHlCQUF5QjtrQkFDekIsWUFBWTtrQkFDWixVQUFVO2tCQUNWLGFBQWE7a0JBQ2Isc0JBQXNCO2dCQUN4Qjs7Z0JBRUE7O2tCQUVFLE9BQU87a0JBQ1AsZ0JBQWdCO2tCQUNoQixhQUFhO2tCQUNiLHNCQUFzQjtnQkFDeEI7O2dCQUVBOztrQkFFRSxPQUFPO2tCQUNQLGNBQWM7a0JBQ2QsYUFBYTtnQkFDZjs7Z0JBRUE7O01BRVY7UUFDRTtVQUNFLG9DQUFvQztVQUNwQyw0QkFBNEI7VUFDNUIsc0JBQXNCO1FBQ3hCOztRQUVBOztVQUVFLDJCQUEyQjtVQUMzQix1QkFBdUI7VUFDdkIsMkJBQTJCO1VBQzNCLG1EQUFtRDtVQUNuRCw2QkFBNkI7VUFDN0IsZUFBZTs7VUFFZjtZQUNFLG9DQUFvQztVQUN0QztRQUNGOztRQUVBO1VBQ0UsMkJBQTJCO1VBQzNCLHVCQUF1QjtVQUN2QiwyQkFBMkI7VUFDM0IsbURBQW1EO1VBQ25ELDZCQUE2QjtVQUM3QixvQ0FBb0M7UUFDdEM7O1FBRUE7O1VBRUUsMkJBQTJCO1VBQzNCLGlDQUFpQztVQUNqQywyQkFBMkI7VUFDM0IsMEJBQTBCO1VBQzFCLHVCQUF1QjtVQUN2Qix1QkFBdUI7VUFDdkIsMkJBQTJCO1VBQzNCLDJCQUEyQjtVQUMzQiw4QkFBOEI7VUFDOUIsa0NBQWtDO1VBQ2xDLDJCQUEyQjtRQUM3Qjs7UUFFQTtVQUNFLDJCQUEyQjtVQUMzQixpQ0FBaUM7VUFDakMsMkJBQTJCO1VBQzNCLDBCQUEwQjtVQUMxQiwyQkFBMkI7VUFDM0IsdUJBQXVCO1VBQ3ZCLHVCQUF1QjtVQUN2QiwyQkFBMkI7VUFDM0IsMkJBQTJCO1VBQzNCLDhCQUE4QjtVQUM5QixrQ0FBa0M7VUFDbEMsMkJBQTJCO1FBQzdCOztRQUVBOztVQUVFLG9CQUFvQjtVQUNwQiw0QkFBNEI7UUFDOUI7TUFDRjs7TUFFQTs7UUFFRSwyQkFBMkI7TUFDN0I7O01BRUE7UUFDRSwyQkFBMkI7TUFDN0I7O01BRUE7Ozs7O1FBS0UsMkJBQTJCO1FBQzNCLG9CQUFvQjtRQUNwQixxQkFBcUI7UUFDckIsMEJBQTBCO01BQzVCO0lBQ0Y7O0lBRUE7O01BRUUsZ0JBQWdCO01BQ2hCLGdCQUFnQjtJQUNsQjs7SUFFQTtNQUNFLGVBQWU7TUFDZixnQkFBZ0I7SUFDbEI7O0lBRUE7TUFDRSxnQkFBZ0I7TUFDaEIsY0FBYztJQUNoQjs7SUFFQTtNQUNFLGNBQWM7TUFDZCxlQUFlO0lBQ2pCOztJQUVBOztNQUVFOztRQUVFO1VBQ0UsMkJBQTJCO1VBQzNCLDJCQUEyQjtVQUMzQixxQkFBcUI7UUFDdkI7O1FBRUE7VUFDRSwyQkFBMkI7VUFDM0IscUJBQXFCO1FBQ3ZCOztRQUVBO1VBQ0UsMkJBQTJCO1VBQzNCLHFCQUFxQjtRQUN2Qjs7UUFFQTtVQUNFLDJCQUEyQjtVQUMzQixxQkFBcUI7UUFDdkI7TUFDRjtJQUNGIiwic291cmNlc0NvbnRlbnQiOlsiXG4gICAgICAgICAgICAgICAgLm1hdC1tZGMtZGlhbG9nLWNvbnRhaW5lciB7XG4gICAgICAgICAgICAgICAgICAtLW1kYy1kaWFsb2ctY29udGFpbmVyLWNvbG9yOiB3aGl0ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gQ29udGVuZWRvciBwcmluY2lwYWwgZGVsIGRpw4PCoWxvZ29cbiAgICAgICAgICAgICAgICAuZGlhbG9nLWNvbnRhaW5lciB7XG4gICAgICAgICAgICAgICAgICB3aWR0aDogY2FsYygxMDAlIC0gMjBweCk7XG4gICAgICAgICAgICAgICAgICBoZWlnaHQ6IGNhbGMoMTAwJSAtIDIwcHgpO1xuICAgICAgICAgICAgICAgICAgbWFyZ2luOiAxMHB4O1xuICAgICAgICAgICAgICAgICAgcGFkZGluZzogMDtcbiAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBDb250ZW5lZG9yIGRlIGNvbnRlbmlkb1xuICAgICAgICAgICAgICAgIC5kaWFsb2ctY29udGVudCB7XG4gICAgICAgICAgICAgICAgICBmbGV4OiAxO1xuICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBDb250ZW5lZG9yIGRlIGxhIHRhYmxhXG4gICAgICAgICAgICAgICAgLnRhYmxlLWNvbnRhaW5lciB7XG4gICAgICAgICAgICAgICAgICBmbGV4OiAxO1xuICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6IGF1dG87XG4gICAgICAgICAgICAgICAgICBtaW4taGVpZ2h0OiAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBFc3RpbG9zIGVzcGVjw4PCrWZpY29zIHBhcmEgbGFzIHRhYmxhcyAodG9tYWRvcyBkZSB2YWxpZGFjacODwrNuKVxuICAgIDpob3N0IDo6bmctZGVlcCB7XG4gICAgICBtYXQtdGFibGUge1xuICAgICAgICAubWF0LW1kYy10YWJsZSB7XG4gICAgICAgICAgYm9yZGVyLWNvbGxhcHNlOiBzZXBhcmF0ZSAhaW1wb3J0YW50O1xuICAgICAgICAgIGJvcmRlci1zcGFjaW5nOiAwICFpbXBvcnRhbnQ7XG4gICAgICAgICAgd2lkdGg6IDEwMCUgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gQWx0dXJhIGNvbXBhY3RhIHBhcmEgbGFzIGZpbGFzXG4gICAgICAgIC5tYXQtbWRjLXJvdyB7XG4gICAgICAgICAgbWluLWhlaWdodDogMzJweCAhaW1wb3J0YW50O1xuICAgICAgICAgIGhlaWdodDogMzJweCAhaW1wb3J0YW50O1xuICAgICAgICAgIG1heC1oZWlnaHQ6IDMycHggIWltcG9ydGFudDtcbiAgICAgICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgcmdiYSgwLDAsMCwuMTIpICFpbXBvcnRhbnQ7XG4gICAgICAgICAgZGlzcGxheTogdGFibGUtcm93ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICAgIFxuICAgICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2YxZjVmOSAhaW1wb3J0YW50O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLm1hdC1tZGMtaGVhZGVyLXJvdyB7XG4gICAgICAgICAgbWluLWhlaWdodDogMzJweCAhaW1wb3J0YW50O1xuICAgICAgICAgIGhlaWdodDogMzJweCAhaW1wb3J0YW50O1xuICAgICAgICAgIG1heC1oZWlnaHQ6IDMycHggIWltcG9ydGFudDtcbiAgICAgICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgcmdiYSgwLDAsMCwuMTIpICFpbXBvcnRhbnQ7XG4gICAgICAgICAgZGlzcGxheTogdGFibGUtcm93ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2Y4ZmFmYyAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBQYWRkaW5nIGNvbXBhY3RvIHBhcmEgbGFzIGNlbGRhc1xuICAgICAgICAubWF0LW1kYy1jZWxsIHtcbiAgICAgICAgICBwYWRkaW5nOiA0cHggOHB4ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgdmVydGljYWwtYWxpZ246IG1pZGRsZSAhaW1wb3J0YW50O1xuICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxLjIgIWltcG9ydGFudDtcbiAgICAgICAgICBmb250LXNpemU6IDEycHggIWltcG9ydGFudDtcbiAgICAgICAgICBib3JkZXI6IG5vbmUgIWltcG9ydGFudDtcbiAgICAgICAgICBoZWlnaHQ6IDMycHggIWltcG9ydGFudDtcbiAgICAgICAgICBtYXgtaGVpZ2h0OiAzMnB4ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbiAhaW1wb3J0YW50O1xuICAgICAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXAgIWltcG9ydGFudDtcbiAgICAgICAgICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcyAhaW1wb3J0YW50O1xuICAgICAgICAgIHRleHQtYWxpZ246IGxlZnQgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLm1hdC1tZGMtaGVhZGVyLWNlbGwge1xuICAgICAgICAgIHBhZGRpbmc6IDRweCA4cHggIWltcG9ydGFudDtcbiAgICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlICFpbXBvcnRhbnQ7XG4gICAgICAgICAgbGluZS1oZWlnaHQ6IDEuMiAhaW1wb3J0YW50O1xuICAgICAgICAgIGZvbnQtc2l6ZTogMTJweCAhaW1wb3J0YW50O1xuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA1MDAgIWltcG9ydGFudDtcbiAgICAgICAgICBib3JkZXI6IG5vbmUgIWltcG9ydGFudDtcbiAgICAgICAgICBoZWlnaHQ6IDMycHggIWltcG9ydGFudDtcbiAgICAgICAgICBtYXgtaGVpZ2h0OiAzMnB4ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbiAhaW1wb3J0YW50O1xuICAgICAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXAgIWltcG9ydGFudDtcbiAgICAgICAgICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcyAhaW1wb3J0YW50O1xuICAgICAgICAgIHRleHQtYWxpZ246IGxlZnQgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gRWxpbWluYXIgY3VhbHF1aWVyIGVzcGFjaWFkbyBleHRyYVxuICAgICAgICAubWF0LW1kYy1jZWxsLCAubWF0LW1kYy1oZWFkZXItY2VsbCB7XG4gICAgICAgICAgbWFyZ2luOiAwICFpbXBvcnRhbnQ7XG4gICAgICAgICAgYm9yZGVyLXNwYWNpbmc6IDAgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBFc3RpbG9zIGVzcGVjw4PCrWZpY29zIHBhcmEgZWxlbWVudG9zIHF1ZSBwdWVkYW4gZXN0YXIgY2F1c2FuZG8gZGlmZXJlbmNpYXNcbiAgICAgIC5tYXQtbWRjLXRhYmxlLWNvbnRhaW5lciB7XG4gICAgICAgIG92ZXJmbG93OiBoaWRkZW4gIWltcG9ydGFudDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLm1hdC1tZGMtdGFibGUtd3JhcHBlciB7XG4gICAgICAgIG92ZXJmbG93OiBoaWRkZW4gIWltcG9ydGFudDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gRXN0aWxvcyBlc3BlY8ODwq1maWNvcyBwYXJhIGVsZW1lbnRvcyBpbnRlcm5vc1xuICAgICAgLm1hdC1tZGMtY2VsbCBkaXYsXG4gICAgICAubWF0LW1kYy1jZWxsIHNwYW4sXG4gICAgICAubWF0LW1kYy1oZWFkZXItY2VsbCBkaXYsXG4gICAgICAubWF0LW1kYy1oZWFkZXItY2VsbCBzcGFuIHtcbiAgICAgICAgbGluZS1oZWlnaHQ6IDEuMiAhaW1wb3J0YW50O1xuICAgICAgICBtYXJnaW46IDAgIWltcG9ydGFudDtcbiAgICAgICAgcGFkZGluZzogMCAhaW1wb3J0YW50O1xuICAgICAgICBmb250LXNpemU6IDEycHggIWltcG9ydGFudDtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gRXN0aWxvcyBwYXJhIGVsIGRpw4PCoWxvZ29cbiAgICAuZGlhbG9nLWNvbnRlbnQge1xuICAgICAgbWF4LWhlaWdodDogNzB2aDtcbiAgICAgIG92ZXJmbG93LXk6IGF1dG87XG4gICAgfVxuICAgIFxuICAgIC5jbGllbnQtaW5mbyB7XG4gICAgICBmb250LXNpemU6IDEycHg7XG4gICAgICBsaW5lLWhlaWdodDogMS4yO1xuICAgIH1cbiAgICBcbiAgICAuY2xpZW50LW5hbWUge1xuICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgIGNvbG9yOiAjMWYyOTM3O1xuICAgIH1cbiAgICBcbiAgICAuY2xpZW50LXJmYyB7XG4gICAgICBjb2xvcjogIzZiNzI4MDtcbiAgICAgIGZvbnQtc2l6ZTogMTFweDtcbiAgICB9XG4gICAgXG4gICAgLy8gRXN0aWxvcyBlc3BlY8ODwq1maWNvcyBwYXJhIGNvbHVtbmFzXG4gICAgOmhvc3QgOjpuZy1kZWVwIHtcbiAgICAgIC8vIEhhY2VyIGxhIGNvbHVtbmEgY2xpZW50ZSBtw4PCoXMgYW5jaGFcbiAgICAgIG1hdC10YWJsZSB7XG4gICAgICAgIC5tYXQtY29sdW1uLWNsaWVudGUge1xuICAgICAgICAgIG1pbi13aWR0aDogMzAwcHggIWltcG9ydGFudDtcbiAgICAgICAgICBtYXgtd2lkdGg6IDQwMHB4ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgd2lkdGg6IDM1JSAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAubWF0LWNvbHVtbi1uZENsaWVudGUge1xuICAgICAgICAgIG1pbi13aWR0aDogMTIwcHggIWltcG9ydGFudDtcbiAgICAgICAgICB3aWR0aDogMTUlICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC5tYXQtY29sdW1uLXJmYyB7XG4gICAgICAgICAgbWluLXdpZHRoOiAxNTBweCAhaW1wb3J0YW50O1xuICAgICAgICAgIHdpZHRoOiAyMCUgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLm1hdC1jb2x1bW4tZW1haWwge1xuICAgICAgICAgIG1pbi13aWR0aDogMjAwcHggIWltcG9ydGFudDtcbiAgICAgICAgICB3aWR0aDogMzAlICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICJdLCJzb3VyY2VSb290IjoiIn0= */"]
  });
}

/***/ }),

/***/ 47784:
/*!*********************************************************************!*\
  !*** ./src/app/pages/procesos/integracion/integracion.component.ts ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IntegracionComponent: () => (/* binding */ IntegracionComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/forms */ 28849);
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/card */ 18497);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/progress-spinner */ 33910);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/snack-bar */ 49409);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/form-field */ 51333);
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material/select */ 96355);
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/material/tooltip */ 60702);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/material/input */ 10026);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/dialog */ 17401);
/* harmony import */ var _angular_material_table__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/material/table */ 46798);
/* harmony import */ var _angular_material_menu__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @angular/material/menu */ 78128);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 72513);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 20274);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common/http */ 54860);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../environments/environment */ 20553);
/* harmony import */ var _client_selection_dialog_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./client-selection-dialog.component */ 91427);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _core_services_default_agency_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../core/services/default-agency.service */ 44907);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/material/core */ 55309);




































function IntegracionComponent_mat_option_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "mat-option", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const agency_r6 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("value", agency_r6.Id);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", agency_r6.Name, " ");
  }
}
function IntegracionComponent_button_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "button", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function IntegracionComponent_button_23_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r8);
      const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r7.clearClientSearch());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](1, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2, "clear");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](3, " Limpiar ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_24_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 21)(1, "mat-icon", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2, "search_off");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "p", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](4, "No se encontraron clientes con el t\u00E9rmino de b\u00FAsqueda");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
  }
}
function IntegracionComponent_div_25_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 24)(1, "mat-card", 2)(2, "mat-card-header", 25)(3, "mat-card-title", 26)(4, "mat-icon", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](5, "person");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](6, " Informaci\u00F3n del Cliente ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](7, "mat-card-content", 3)(8, "div", 28)(9, "div", 29)(10, "label", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](11, "N\u00B0 Cliente");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](12, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](14, "div", 29)(15, "label", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](16, "Raz\u00F3n Social");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](17, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](19, "div", 29)(20, "label", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](21, "RFC");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](22, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](23);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](24, "div", 29)(25, "label", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](26, "Correo");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](27, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](28);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](29, "div", 29)(30, "label", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](31, "Tel\u00E9fono");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](32, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](33);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](34, "div", 29)(35, "label", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](36, "Tel\u00E9fono 2");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](37, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](38);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()()()();
  }
  if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx_r3.selectedClient.ndCliente || "N/A");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx_r3.selectedClient.razonSocial || "N/A");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx_r3.selectedClient.rfc || "N/A");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx_r3.selectedClient.email || "N/A");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx_r3.selectedClient.telefono || "N/A");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx_r3.selectedClient.telefono2 || "N/A");
  }
}
function IntegracionComponent_div_26_button_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "button", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function IntegracionComponent_div_26_button_8_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r14);
      const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r13.agregarPedidoIntegracion());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](1, "mat-icon", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2, "add");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
  }
}
function IntegracionComponent_div_26_div_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](1, "mat-spinner", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_11_th_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "th", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "N\u00B0 Pedido");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_11_td_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "td", 63)(1, "div", 34)(2, "mat-icon", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](3, "receipt");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "span", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const file_r41 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](file_r41.numeroPedido);
  }
}
function IntegracionComponent_div_26_div_11_th_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "th", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "N\u00B0 Inventario");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_11_td_7_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r42 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](file_r42.numeroInventario);
  }
}
function IntegracionComponent_div_26_div_11_td_7_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "Sin inventario");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_11_td_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "td", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, IntegracionComponent_div_26_div_11_td_7_span_1_Template, 2, 1, "span", 66)(2, IntegracionComponent_div_26_div_11_td_7_ng_template_2_Template, 2, 0, "ng-template", null, 67, _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r42 = ctx.$implicit;
    const _r45 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", file_r42.numeroInventario)("ngIfElse", _r45);
  }
}
function IntegracionComponent_div_26_div_11_th_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "th", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "Proceso");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_11_td_10_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r47 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](file_r47.proceso);
  }
}
function IntegracionComponent_div_26_div_11_td_10_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "Sin proceso");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_11_td_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "td", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, IntegracionComponent_div_26_div_11_td_10_span_1_Template, 2, 1, "span", 66)(2, IntegracionComponent_div_26_div_11_td_10_ng_template_2_Template, 2, 0, "ng-template", null, 70, _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r47 = ctx.$implicit;
    const _r50 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", file_r47.proceso)("ngIfElse", _r50);
  }
}
function IntegracionComponent_div_26_div_11_th_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "th", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "Operaci\u00F3n");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_11_td_13_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r52 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](file_r52.operacion);
  }
}
function IntegracionComponent_div_26_div_11_td_13_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "Sin operaci\u00F3n");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_11_td_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "td", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, IntegracionComponent_div_26_div_11_td_13_span_1_Template, 2, 1, "span", 66)(2, IntegracionComponent_div_26_div_11_td_13_ng_template_2_Template, 2, 0, "ng-template", null, 71, _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r52 = ctx.$implicit;
    const _r55 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", file_r52.operacion)("ngIfElse", _r55);
  }
}
function IntegracionComponent_div_26_div_11_th_15_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "th", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "Tipo Cliente");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_11_td_16_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r57 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](file_r57.tipoCliente);
  }
}
function IntegracionComponent_div_26_div_11_td_16_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "Sin tipo");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_11_td_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "td", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, IntegracionComponent_div_26_div_11_td_16_span_1_Template, 2, 1, "span", 66)(2, IntegracionComponent_div_26_div_11_td_16_ng_template_2_Template, 2, 0, "ng-template", null, 72, _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r57 = ctx.$implicit;
    const _r60 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", file_r57.tipoCliente)("ngIfElse", _r60);
  }
}
function IntegracionComponent_div_26_div_11_th_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "th", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "Veh\u00EDculo");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_11_td_19_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r62 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](file_r62.vehiculo);
  }
}
function IntegracionComponent_div_26_div_11_td_19_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "Sin veh\u00EDculo");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_11_td_19_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "td", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, IntegracionComponent_div_26_div_11_td_19_span_1_Template, 2, 1, "span", 66)(2, IntegracionComponent_div_26_div_11_td_19_ng_template_2_Template, 2, 0, "ng-template", null, 73, _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r62 = ctx.$implicit;
    const _r65 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", file_r62.vehiculo)("ngIfElse", _r65);
  }
}
function IntegracionComponent_div_26_div_11_th_21_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "th", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "A\u00F1o");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_11_td_22_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r67 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](file_r67.year);
  }
}
function IntegracionComponent_div_26_div_11_td_22_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "-");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_11_td_22_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "td", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, IntegracionComponent_div_26_div_11_td_22_span_1_Template, 2, 1, "span", 66)(2, IntegracionComponent_div_26_div_11_td_22_ng_template_2_Template, 2, 0, "ng-template", null, 74, _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r67 = ctx.$implicit;
    const _r70 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", file_r67.year)("ngIfElse", _r70);
  }
}
function IntegracionComponent_div_26_div_11_th_24_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "th", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "Modelo");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_11_td_25_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r72 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](file_r72.modelo);
  }
}
function IntegracionComponent_div_26_div_11_td_25_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "Sin modelo");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_11_td_25_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "td", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, IntegracionComponent_div_26_div_11_td_25_span_1_Template, 2, 1, "span", 66)(2, IntegracionComponent_div_26_div_11_td_25_ng_template_2_Template, 2, 0, "ng-template", null, 75, _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r72 = ctx.$implicit;
    const _r75 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", file_r72.modelo)("ngIfElse", _r75);
  }
}
function IntegracionComponent_div_26_div_11_th_27_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "th", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "VIN");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_11_td_28_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 78);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r77 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](file_r77.vin);
  }
}
function IntegracionComponent_div_26_div_11_td_28_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "Sin VIN");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_11_td_28_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "td", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, IntegracionComponent_div_26_div_11_td_28_span_1_Template, 2, 1, "span", 76)(2, IntegracionComponent_div_26_div_11_td_28_ng_template_2_Template, 2, 0, "ng-template", null, 77, _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r77 = ctx.$implicit;
    const _r80 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", file_r77.vin)("ngIfElse", _r80);
  }
}
function IntegracionComponent_div_26_div_11_th_30_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "th", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "Agencia");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_11_td_31_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r82 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](file_r82.agencia);
  }
}
function IntegracionComponent_div_26_div_11_td_31_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "Sin agencia");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_11_td_31_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "td", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, IntegracionComponent_div_26_div_11_td_31_span_1_Template, 2, 1, "span", 66)(2, IntegracionComponent_div_26_div_11_td_31_ng_template_2_Template, 2, 0, "ng-template", null, 79, _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r82 = ctx.$implicit;
    const _r85 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", file_r82.agencia)("ngIfElse", _r85);
  }
}
function IntegracionComponent_div_26_div_11_th_33_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "th", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "Fecha Registro");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_11_td_34_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](2, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r87 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind2"](2, 1, file_r87.fechaRegistro, "dd/MM/yyyy HH:mm"));
  }
}
function IntegracionComponent_div_26_div_11_td_34_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "Sin fecha");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_11_td_34_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "td", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, IntegracionComponent_div_26_div_11_td_34_span_1_Template, 3, 4, "span", 66)(2, IntegracionComponent_div_26_div_11_td_34_ng_template_2_Template, 2, 0, "ng-template", null, 80, _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r87 = ctx.$implicit;
    const _r90 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", file_r87.fechaRegistro)("ngIfElse", _r90);
  }
}
function IntegracionComponent_div_26_div_11_th_36_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "th", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "Acciones");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_11_td_37_button_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "button", 84)(1, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2, "more_vert");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    const _r94 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("matMenuTriggerFor", _r94);
  }
}
function IntegracionComponent_div_26_div_11_td_37_Template(rf, ctx) {
  if (rf & 1) {
    const _r96 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "td", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, IntegracionComponent_div_26_div_11_td_37_button_1_Template, 3, 1, "button", 81);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](2, "mat-menu", null, 82)(4, "button", 83);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function IntegracionComponent_div_26_div_11_td_37_Template_button_click_4_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r96);
      const file_r92 = restoredCtx.$implicit;
      const ctx_r95 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r95.cancelarPedido(file_r92));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](6, "cancel");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](7, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](8, "Cancelar");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](9, "button", 83);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function IntegracionComponent_div_26_div_11_td_37_Template_button_click_9_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r96);
      const file_r92 = restoredCtx.$implicit;
      const ctx_r97 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r97.excepcionPedido(file_r92));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](10, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](11, "warning");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](12, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](13, "Excepci\u00F3n");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const ctx_r38 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx_r38.isManagerOrAdmin);
  }
}
function IntegracionComponent_div_26_div_11_tr_38_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](0, "tr", 85);
  }
}
function IntegracionComponent_div_26_div_11_tr_39_Template(rf, ctx) {
  if (rf & 1) {
    const _r100 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "tr", 86);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function IntegracionComponent_div_26_div_11_tr_39_Template_tr_click_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r100);
      const row_r98 = restoredCtx.$implicit;
      const ctx_r99 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r99.selectFile(row_r98));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 44)(1, "table", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerStart"](2, 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](3, IntegracionComponent_div_26_div_11_th_3_Template, 2, 0, "th", 47)(4, IntegracionComponent_div_26_div_11_td_4_Template, 6, 1, "td", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerStart"](5, 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](6, IntegracionComponent_div_26_div_11_th_6_Template, 2, 0, "th", 47)(7, IntegracionComponent_div_26_div_11_td_7_Template, 4, 2, "td", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerStart"](8, 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](9, IntegracionComponent_div_26_div_11_th_9_Template, 2, 0, "th", 47)(10, IntegracionComponent_div_26_div_11_td_10_Template, 4, 2, "td", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerStart"](11, 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](12, IntegracionComponent_div_26_div_11_th_12_Template, 2, 0, "th", 47)(13, IntegracionComponent_div_26_div_11_td_13_Template, 4, 2, "td", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerStart"](14, 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](15, IntegracionComponent_div_26_div_11_th_15_Template, 2, 0, "th", 47)(16, IntegracionComponent_div_26_div_11_td_16_Template, 4, 2, "td", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerStart"](17, 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](18, IntegracionComponent_div_26_div_11_th_18_Template, 2, 0, "th", 47)(19, IntegracionComponent_div_26_div_11_td_19_Template, 4, 2, "td", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerStart"](20, 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](21, IntegracionComponent_div_26_div_11_th_21_Template, 2, 0, "th", 47)(22, IntegracionComponent_div_26_div_11_td_22_Template, 4, 2, "td", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerStart"](23, 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](24, IntegracionComponent_div_26_div_11_th_24_Template, 2, 0, "th", 47)(25, IntegracionComponent_div_26_div_11_td_25_Template, 4, 2, "td", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerStart"](26, 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](27, IntegracionComponent_div_26_div_11_th_27_Template, 2, 0, "th", 47)(28, IntegracionComponent_div_26_div_11_td_28_Template, 4, 2, "td", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerStart"](29, 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](30, IntegracionComponent_div_26_div_11_th_30_Template, 2, 0, "th", 47)(31, IntegracionComponent_div_26_div_11_td_31_Template, 4, 2, "td", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerStart"](32, 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](33, IntegracionComponent_div_26_div_11_th_33_Template, 2, 0, "th", 47)(34, IntegracionComponent_div_26_div_11_td_34_Template, 4, 2, "td", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerStart"](35, 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](36, IntegracionComponent_div_26_div_11_th_36_Template, 2, 0, "th", 47)(37, IntegracionComponent_div_26_div_11_td_37_Template, 14, 1, "td", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](38, IntegracionComponent_div_26_div_11_tr_38_Template, 1, 0, "tr", 60)(39, IntegracionComponent_div_26_div_11_tr_39_Template, 1, 0, "tr", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("dataSource", ctx_r11.files);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](37);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("matHeaderRowDef", ctx_r11.filesDisplayedColumns);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("matRowDefColumns", ctx_r11.filesDisplayedColumns);
  }
}
function IntegracionComponent_div_26_div_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 87)(1, "mat-icon", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2, "folder_open");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "p", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](4, "No se encontraron pedidos en estatus de integraci\u00F3n para este cliente");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
  }
}
function IntegracionComponent_div_26_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 32)(1, "mat-card", 2)(2, "mat-card-header", 25)(3, "mat-card-title", 33)(4, "div", 34)(5, "mat-icon", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](6, "description");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](7, " Pedidos en Integraci\u00F3n ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](8, IntegracionComponent_div_26_button_8_Template, 3, 0, "button", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](9, "mat-card-content", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](10, IntegracionComponent_div_26_div_10_Template, 2, 0, "div", 37)(11, IntegracionComponent_div_26_div_11_Template, 40, 3, "div", 38)(12, IntegracionComponent_div_26_div_12_Template, 5, 0, "div", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx_r4.isManagerOrAdmin);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx_r4.filesLoading);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", !ctx_r4.filesLoading);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", !ctx_r4.filesLoading && ctx_r4.files.length === 0);
  }
}
function IntegracionComponent_div_27_div_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](1, "mat-spinner", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_27_div_13_div_1_div_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 110);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](2, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const document_r105 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" Vencimiento: ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind2"](2, 1, document_r105.expirationDate, "dd/MM/yyyy"), " ");
  }
}
function IntegracionComponent_div_27_div_13_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r110 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 96)(1, "div", 97)(2, "mat-icon", 98);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "div", 99)(5, "div", 100);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](7, IntegracionComponent_div_27_div_13_div_1_div_7_Template, 3, 4, "div", 101);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](8, "div", 102)(9, "div", 103)(10, "input", 104, 105);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("change", function IntegracionComponent_div_27_div_13_div_1_Template_input_change_10_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r110);
      const document_r105 = restoredCtx.$implicit;
      const ctx_r109 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r109.onFileSelected($event, document_r105.documentId));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](12, "button", 106);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function IntegracionComponent_div_27_div_13_div_1_Template_button_click_12_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r110);
      const _r107 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵreference"](11);
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](_r107.click());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](13, "mat-icon", 107);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](14, "attach_file");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](15);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](16, "button", 108);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function IntegracionComponent_div_27_div_13_div_1_Template_button_click_16_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r110);
      const document_r105 = restoredCtx.$implicit;
      const ctx_r112 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r112.uploadDocument(document_r105));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](17, "mat-icon", 107);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](18, "upload");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](19, " CARGAR ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](20, "button", 109);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function IntegracionComponent_div_27_div_13_div_1_Template_button_click_20_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r110);
      const document_r105 = restoredCtx.$implicit;
      const ctx_r113 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r113.viewDocument(document_r105));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](21, "mat-icon", 107);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](22, "visibility");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](23, " VER ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const document_r105 = ctx.$implicit;
    const ctx_r104 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵclassMap"](ctx_r104.getDocumentStatusColor(document_r105.status, document_r105.idCurrentStatus));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", ctx_r104.getDocumentStatusIcon(document_r105.status, document_r105.idCurrentStatus), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](document_r105.documentName);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", document_r105.hasExpiration === "1" && document_r105.expirationDate);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("id", "file-" + document_r105.documentId);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("disabled", document_r105.idCurrentStatus === "3" || document_r105.idCurrentStatus === "4");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", ctx_r104.selectedFiles[document_r105.documentId] ? ctx_r104.selectedFiles[document_r105.documentId].name : "Seleccionar archivo", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("disabled", !ctx_r104.selectedFiles[document_r105.documentId] || document_r105.idCurrentStatus === "3" || document_r105.idCurrentStatus === "4");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("disabled", !document_r105.filePath);
  }
}
function IntegracionComponent_div_27_div_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 94);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, IntegracionComponent_div_27_div_13_div_1_Template, 24, 10, "div", 95);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r102 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx_r102.requiredDocuments);
  }
}
function IntegracionComponent_div_27_div_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 87)(1, "mat-icon", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2, "folder_open");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "p", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](4, "No se encontraron documentos requeridos para este pedido");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
  }
}
function IntegracionComponent_div_27_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 88)(1, "mat-card", 2)(2, "mat-card-header", 25)(3, "mat-card-title", 89)(4, "div", 90)(5, "mat-icon", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](6, "folder");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](7, "span", 91);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](8, "Documentos Requeridos");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](9, "div", 92);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](11, "mat-card-content", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](12, IntegracionComponent_div_27_div_12_Template, 2, 0, "div", 37)(13, IntegracionComponent_div_27_div_13_Template, 2, 1, "div", 93)(14, IntegracionComponent_div_27_div_14_Template, 5, 0, "div", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate8"](" Pedido ", ctx_r5.selectedFile.numeroPedido, " \u2022 ", ctx_r5.selectedFile.proceso, " \u2022 ", ctx_r5.selectedFile.operacion, " \u2022 ", ctx_r5.selectedFile.tipoCliente, " \u2022 ", ctx_r5.selectedFile.modelo, " ", ctx_r5.selectedFile.vehiculo, " ", ctx_r5.selectedFile.year, " \u2022 VIN: ", ctx_r5.selectedFile.vin, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx_r5.documentsLoading);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", !ctx_r5.documentsLoading);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", !ctx_r5.documentsLoading && ctx_r5.requiredDocuments.length === 0);
  }
}
class IntegracionComponent {
  constructor(snackBar, defaultAgencyService, http, dialog) {
    this.snackBar = snackBar;
    this.defaultAgencyService = defaultAgencyService;
    this.http = http;
    this.dialog = dialog;
    this.loading = false;
    this.integrationStatus = 'inactive'; // inactive, active, error
    this.lastUpdate = new Date();
    // Agency filter properties
    this.agencies = [];
    this.selectedAgencyId = null;
    this.agenciesLoading = true;
    // Client search properties
    this.clientSearchTerm = '';
    this.clients = [];
    this.clientsLoading = false;
    this.showClientResults = false;
    this.selectedClient = null;
    // Files/Pedidos properties
    this.files = [];
    this.filesLoading = false;
    this.filesDisplayedColumns = ['numeroPedido', 'numeroInventario', 'proceso', 'operacion', 'tipoCliente', 'vehiculo', 'year', 'modelo', 'vin', 'agencia', 'fechaRegistro', 'actions'];
    // User permissions
    this.userRole = '';
    this.isManagerOrAdmin = false;
    // Document management properties
    this.selectedFile = null;
    this.requiredDocuments = [];
    this.documentsLoading = false;
    this.selectedFiles = {};
    // Dialog properties
    this.displayedColumns = ['ndCliente', 'cliente', 'rfc', 'email', 'actions'];
    // Process properties - Fixed process for integration
    this.integrationProcessId = 1; // Gestión de Clientes
    this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_4__.Subject();
  }
  ngOnInit() {
    this.loadIntegrationStatus();
    this.loadAgencies();
    this.checkUserPermissions();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  checkUserPermissions() {
    // Obtener el rol del usuario desde el token o servicio de autenticación
    // Por ahora simulamos que es gerente/administrador
    this.userRole = 'manager'; // Cambiar por la lógica real de obtención del rol
    this.isManagerOrAdmin = this.userRole === 'manager' || this.userRole === 'admin';
    // Si no es gerente/admin, quitar la columna de acciones
    if (!this.isManagerOrAdmin) {
      this.filesDisplayedColumns = this.filesDisplayedColumns.filter(col => col !== 'actions');
    }
  }
  loadIntegrationStatus() {
    this.loading = true;
    // Simular carga de estado de integración
    setTimeout(() => {
      this.integrationStatus = 'active';
      this.loading = false;
    }, 1000);
  }
  startIntegration() {
    this.loading = true;
    this.snackBar.open('Iniciando proceso de integración...', 'Cerrar', {
      duration: 3000
    });
    // Simular proceso de integración
    setTimeout(() => {
      this.integrationStatus = 'active';
      this.loading = false;
      this.snackBar.open('Integración completada exitosamente', 'Cerrar', {
        duration: 5000
      });
    }, 3000);
  }
  stopIntegration() {
    this.integrationStatus = 'inactive';
    this.snackBar.open('Integración detenida', 'Cerrar', {
      duration: 3000
    });
  }
  getStatusColor() {
    switch (this.integrationStatus) {
      case 'active':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  }
  getStatusIcon() {
    switch (this.integrationStatus) {
      case 'active':
        return 'check_circle';
      case 'error':
        return 'error';
      default:
        return 'pause_circle';
    }
  }
  getStatusText() {
    switch (this.integrationStatus) {
      case 'active':
        return 'Activa';
      case 'error':
        return 'Error';
      default:
        return 'Inactiva';
    }
  }
  // Agency filter methods
  loadAgencies() {
    this.agenciesLoading = true;
    this.defaultAgencyService.obtenerAgencias().pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_5__.takeUntil)(this.destroy$)).subscribe({
      next: agencias => {
        console.log('🏢 Agencias asignadas al usuario:', agencias);
        this.agencies = agencias;
        this.agenciesLoading = false;
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
        this.agenciesLoading = false;
        this.snackBar.open('Error al cargar las agencias', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }
  onAgencyChange(agencyId) {
    this.selectedAgencyId = agencyId;
    // Aquí puedes agregar lógica adicional cuando cambie la agencia seleccionada
    console.log('Selected agency:', agencyId);
  }
  clearAgencyFilter() {
    this.selectedAgencyId = null;
  }
  hasAgencies() {
    return this.agencies && this.agencies.length > 0;
  }
  trackByAgencyId(index, agency) {
    return agency.Id;
  }
  // Client search methods
  onClientSearchChange() {
    // Ya no buscamos automáticamente, solo limpiamos resultados si el campo está vacío
    if (!this.clientSearchTerm.trim()) {
      this.clients = [];
      this.showClientResults = false;
    }
  }
  searchClients() {
    if (this.clientSearchTerm.trim().length < 3) {
      this.snackBar.open('Debe ingresar al menos 3 caracteres para buscar', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    this.performClientSearch();
  }
  performClientSearch() {
    if (!this.clientSearchTerm.trim()) {
      this.clients = [];
      this.showClientResults = false;
      return;
    }
    // Verificar que tenemos agencia seleccionada
    if (!this.selectedAgencyId) {
      this.snackBar.open('Debe seleccionar una agencia para buscar clientes', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    this.clientsLoading = true;
    this.showClientResults = true;
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_6__.HttpParams();
    params = params.set('id', this.selectedAgencyId.toString());
    params = params.set('search', this.clientSearchTerm.trim());
    params = params.set('limit', '50');
    this.http.get(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiBaseUrl}/api/client/search`, {
      params
    }).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_5__.takeUntil)(this.destroy$)).subscribe({
      next: response => {
        console.log('🔍 Clientes encontrados:', response);
        if (response && response.success && response.data && response.data.clientes) {
          this.clients = response.data.clientes;
          // Si hay múltiples resultados, mostrar diálogo
          if (this.clients.length > 1) {
            this.showClientSelectionDialog();
          } else if (this.clients.length === 1) {
            // Si hay solo un resultado, seleccionarlo automáticamente
            this.selectClient(this.clients[0]);
          } else {
            // Sin resultados
            this.showClientResults = true;
          }
        } else {
          this.clients = [];
          this.showClientResults = true;
        }
        this.clientsLoading = false;
      },
      error: error => {
        console.error('❌ Error buscando clientes:', error);
        this.clients = [];
        this.clientsLoading = false;
        this.snackBar.open('Error al buscar clientes', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }
  clearClientSearch() {
    this.clientSearchTerm = '';
    this.clients = [];
    this.showClientResults = false;
    this.selectedClient = null;
  }
  selectClient(client) {
    console.log('Cliente seleccionado:', client);
    this.selectedClient = client;
    this.showClientResults = false; // Ocultar resultados después de seleccionar
    this.clientSearchTerm = ''; // Limpiar el campo de búsqueda
    // Cargar los files/pedidos del cliente seleccionado
    this.loadClientFiles();
    this.snackBar.open(`Cliente seleccionado: ${client.cliente}`, 'Cerrar', {
      duration: 3000
    });
  }
  showClientSelectionDialog() {
    const dialogRef = this.dialog.open(_client_selection_dialog_component__WEBPACK_IMPORTED_MODULE_1__.ClientSelectionDialogComponent, {
      width: '95vw',
      height: '80vh',
      maxWidth: '1200px',
      data: {
        clients: this.clients
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectClient(result);
      } else {
        // Si se canceló el diálogo, limpiar la búsqueda
        this.clearClientSearch();
      }
    });
  }
  clearClientSelection() {
    this.selectedClient = null;
    this.files = []; // Limpiar también los files
    this.snackBar.open('Selección de cliente limpiada', 'Cerrar', {
      duration: 2000
    });
  }
  loadClientFiles() {
    if (!this.selectedClient || !this.selectedClient.ndCliente) {
      this.files = [];
      return;
    }
    this.filesLoading = true;
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_6__.HttpParams();
    params = params.set('ndCliente', this.selectedClient.ndCliente);
    params = params.set('status', 'Integracion'); // Filtrar por estatus de integración
    params = params.set('limit', '100');
    this.http.get(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiBaseUrl}/api/files/by-client`, {
      params
    }).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_5__.takeUntil)(this.destroy$)).subscribe({
      next: response => {
        console.log('📁 Files encontrados:', response);
        if (response && response.success && response.data && response.data.files) {
          this.files = response.data.files;
        } else {
          this.files = [];
        }
        this.filesLoading = false;
      },
      error: error => {
        console.error('❌ Error cargando files:', error);
        this.files = [];
        this.filesLoading = false;
        this.snackBar.open('Error al cargar los pedidos del cliente', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }
  trackByClientId(index, client) {
    return client.ndCliente;
  }
  // Métodos para acciones de pedidos
  cancelarPedido(file) {
    console.log('Cancelando pedido:', file.numeroPedido);
    // Aquí implementarías la lógica para cancelar el pedido
    this.snackBar.open(`Pedido ${file.numeroPedido} cancelado`, 'Cerrar', {
      duration: 3000
    });
  }
  excepcionPedido(file) {
    console.log('Creando excepción para pedido:', file.numeroPedido);
    // Aquí implementarías la lógica para crear una excepción
    this.snackBar.open(`Excepción creada para pedido ${file.numeroPedido}`, 'Cerrar', {
      duration: 3000
    });
  }
  agregarPedidoIntegracion() {
    console.log('Agregando nuevo pedido de integración para cliente:', this.selectedClient.ndCliente);
    // Aquí implementarías la lógica para agregar un nuevo pedido
    this.snackBar.open(`Agregando nuevo pedido para cliente ${this.selectedClient.ndCliente}`, 'Cerrar', {
      duration: 3000
    });
  }
  // Métodos para manejo de documentos
  selectFile(file) {
    this.selectedFile = file;
    this.loadRequiredDocuments(file.fileId); // Usar fileId en lugar de numeroPedido
  }

  loadRequiredDocuments(fileId) {
    this.documentsLoading = true;
    this.requiredDocuments = [];
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_6__.HttpParams();
    params = params.set('fileId', fileId);
    params = params.set('status', 'Integración'); // Solo documentos para pedidos en integración
    this.http.get(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiBaseUrl}/api/documents/required`, {
      params
    }).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_5__.takeUntil)(this.destroy$)).subscribe({
      next: response => {
        console.log('📄 Documentos requeridos:', response);
        if (response && response.success && response.data && response.data.documents) {
          this.requiredDocuments = response.data.documents;
        } else {
          this.requiredDocuments = [];
        }
        this.documentsLoading = false;
      },
      error: error => {
        console.error('❌ Error cargando documentos:', error);
        this.requiredDocuments = [];
        this.documentsLoading = false;
        this.snackBar.open('Error al cargar documentos requeridos', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }
  onFileSelected(event, documentId) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFiles[documentId] = file;
    }
  }
  uploadDocument(document) {
    if (!this.selectedFiles[document.documentId]) {
      this.snackBar.open('Debe seleccionar un archivo', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    const formData = new FormData();
    formData.append('fileId', this.selectedFile.fileId); // Usar fileId en lugar de numeroPedido
    formData.append('documentTypeId', document.documentId);
    formData.append('document', this.selectedFiles[document.documentId]);
    this.http.post(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiBaseUrl}/api/documents/upload`, formData).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_5__.takeUntil)(this.destroy$)).subscribe({
      next: response => {
        console.log('📤 Documento subido:', response);
        this.snackBar.open(`Documento ${document.documentName} subido exitosamente`, 'Cerrar', {
          duration: 3000
        });
        // Recargar documentos
        this.loadRequiredDocuments(this.selectedFile.fileId); // Usar fileId
        // Limpiar archivo seleccionado
        delete this.selectedFiles[document.documentId];
      },
      error: error => {
        console.error('❌ Error subiendo documento:', error);
        this.snackBar.open('Error al subir documento', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }
  viewDocument(document) {
    if (document.filePath) {
      window.open(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiBaseUrl}/${document.filePath}`, '_blank');
    }
  }
  getDocumentStatusIcon(status, idCurrentStatus) {
    // Si tenemos idCurrentStatus, usamos ese para determinar el icono
    if (idCurrentStatus) {
      switch (idCurrentStatus) {
        case '1':
          return 'fiber_new';
        // Nuevo
        case '2':
          return 'upload_file';
        // Documento cargado
        case '3':
          return 'visibility';
        // En revisión
        case '4':
          return 'check_circle';
        // Revisado y OK
        case '5':
          return 'cancel';
        // Rechazado
        case '6':
          return 'error';
        // Documento no válido
        default:
          return 'help';
      }
    }
    // Fallback al status calculado si no hay idCurrentStatus
    switch (status) {
      case 'uploaded':
        return 'check_circle';
      case 'required':
        return 'info';
      case 'optional':
        return 'help';
      default:
        return 'help';
    }
  }
  getDocumentStatusColor(status, idCurrentStatus) {
    // Si tenemos idCurrentStatus, usamos ese para determinar el color
    if (idCurrentStatus) {
      switch (idCurrentStatus) {
        case '1':
          return 'text-blue-600';
        // Nuevo - Azul
        case '2':
          return 'text-orange-600';
        // Documento cargado - Naranja
        case '3':
          return 'text-yellow-600';
        // En revisión - Amarillo
        case '4':
          return 'text-green-600';
        // Revisado y OK - Verde
        case '5':
          return 'text-red-600';
        // Rechazado - Rojo
        case '6':
          return 'text-red-800';
        // Documento no válido - Rojo oscuro
        default:
          return 'text-gray-600';
      }
    }
    // Fallback al status calculado si no hay idCurrentStatus
    switch (status) {
      case 'uploaded':
        return 'text-green-600';
      case 'required':
        return 'text-yellow-600';
      case 'optional':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  }
  static #_ = this.ɵfac = function IntegracionComponent_Factory(t) {
    return new (t || IntegracionComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_7__.MatSnackBar), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_core_services_default_agency_service__WEBPACK_IMPORTED_MODULE_2__.DefaultAgencyService), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_6__.HttpClient), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_8__.MatDialog));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
    type: IntegracionComponent,
    selectors: [["vex-integracion"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵStandaloneFeature"]],
    decls: 28,
    vars: 12,
    consts: [[1, "integracion-container"], [1, "filters-section", "mb-2"], [1, "bg-white", "rounded-lg", "shadow-sm", "border", "border-gray-200"], [1, "p-2"], [1, "flex", "items-center", "justify-between", "gap-3"], [1, "flex", "items-center", "space-x-3"], ["appearance", "outline", 1, "min-w-48"], [3, "value", "disabled", "selectionChange"], [3, "value"], [3, "value", 4, "ngFor", "ngForOf", "ngForTrackBy"], [1, "flex", "items-center", "space-x-3", "flex-1"], ["appearance", "outline", 1, "flex-1"], ["matInput", "", "placeholder", "Buscar por n\u00FAmero de cliente o nombre completo", "autocomplete", "off", 3, "ngModel", "ngModelChange", "keyup.enter"], [1, "flex", "items-center", "space-x-2"], ["mat-raised-button", "", "color", "primary", "matTooltip", "Buscar cliente", 2, "height", "40px", "min-height", "40px", 3, "disabled", "click"], ["mat-raised-button", "", "color", "warn", "matTooltip", "Limpiar b\u00FAsqueda", "style", "height: 40px; min-height: 40px;", 3, "click", 4, "ngIf"], ["class", "mt-3 text-center py-6", 4, "ngIf"], ["class", "client-info-section mb-2", 4, "ngIf"], ["class", "files-section mb-2", 4, "ngIf"], ["class", "documents-section mb-2", 4, "ngIf"], ["mat-raised-button", "", "color", "warn", "matTooltip", "Limpiar b\u00FAsqueda", 2, "height", "40px", "min-height", "40px", 3, "click"], [1, "mt-3", "text-center", "py-6"], [1, "text-gray-400", "mb-2", 2, "font-size", "40px"], [1, "text-gray-500"], [1, "client-info-section", "mb-2"], [1, "pb-1"], [1, "flex", "items-center", "text-sm"], [1, "mr-1", "text-blue-600", 2, "font-size", "18px"], [1, "grid", "grid-cols-1", "md:grid-cols-3", "gap-2"], [1, "field-group"], [1, "field-label"], [1, "field-value"], [1, "files-section", "mb-2"], [1, "flex", "items-center", "justify-between", "text-sm"], [1, "flex", "items-center"], [1, "mr-1", "text-green-600", 2, "font-size", "18px"], ["mat-icon-button", "", "color", "primary", "matTooltip", "Agregar nuevo pedido de integraci\u00F3n", 3, "click", 4, "ngIf"], ["class", "flex justify-center py-8", 4, "ngIf"], ["class", "overflow-x-auto", 4, "ngIf"], ["class", "text-center py-8", 4, "ngIf"], ["mat-icon-button", "", "color", "primary", "matTooltip", "Agregar nuevo pedido de integraci\u00F3n", 3, "click"], [2, "font-size", "18px"], [1, "flex", "justify-center", "py-8"], ["diameter", "40"], [1, "overflow-x-auto"], ["mat-table", "", 1, "w-full", "files-table", 3, "dataSource"], ["matColumnDef", "numeroPedido"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "numeroInventario"], ["matColumnDef", "proceso"], ["matColumnDef", "operacion"], ["matColumnDef", "tipoCliente"], ["matColumnDef", "vehiculo"], ["matColumnDef", "year"], ["matColumnDef", "modelo"], ["matColumnDef", "vin"], ["matColumnDef", "agencia"], ["matColumnDef", "fechaRegistro"], ["matColumnDef", "actions"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", "class", "hover:bg-gray-50 cursor-pointer", 3, "click", 4, "matRowDef", "matRowDefColumns"], ["mat-header-cell", ""], ["mat-cell", ""], [1, "mr-1", "text-blue-600", 2, "font-size", "14px"], [1, "font-medium"], ["class", "text-sm", 4, "ngIf", "ngIfElse"], ["noInventory", ""], [1, "text-sm"], [1, "text-gray-400", "italic", "text-sm"], ["noProcess", ""], ["noOperation", ""], ["noClientType", ""], ["noVehicle", ""], ["noYear", ""], ["noModel", ""], ["class", "text-sm font-mono", 4, "ngIf", "ngIfElse"], ["noVin", ""], [1, "text-sm", "font-mono"], ["noAgency", ""], ["noDate", ""], ["mat-icon-button", "", "matTooltip", "Opciones del pedido", 3, "matMenuTriggerFor", 4, "ngIf"], ["actionsMenu", "matMenu"], ["mat-menu-item", "", 3, "click"], ["mat-icon-button", "", "matTooltip", "Opciones del pedido", 3, "matMenuTriggerFor"], ["mat-header-row", ""], ["mat-row", "", 1, "hover:bg-gray-50", "cursor-pointer", 3, "click"], [1, "text-center", "py-8"], [1, "documents-section", "mb-2"], [1, "flex", "flex-col", "text-sm"], [1, "flex", "items-center", "mb-1"], [1, "font-semibold"], [1, "text-xs", "text-gray-600", "ml-6"], ["class", "space-y-2", 4, "ngIf"], [1, "space-y-2"], ["class", "document-item flex items-center justify-between p-2 border border-gray-200 rounded hover:bg-gray-50", 4, "ngFor", "ngForOf"], [1, "document-item", "flex", "items-center", "justify-between", "p-2", "border", "border-gray-200", "rounded", "hover:bg-gray-50"], [1, "flex", "items-center", "space-x-2", "flex-1"], [2, "font-size", "16px"], [1, "flex-1"], [1, "font-medium", "text-gray-900", "text-sm"], ["class", "text-xs text-gray-500", 4, "ngIf"], [1, "flex", "items-center", "space-x-1"], [1, "file-input-container"], ["type", "file", "accept", ".pdf,.jpg,.jpeg,.png,.doc,.docx", 1, "hidden", 3, "id", "change"], ["fileInput", ""], ["mat-stroked-button", "", 1, "text-xs", 3, "disabled", "click"], [1, "mr-1", 2, "font-size", "14px"], ["mat-raised-button", "", "color", "primary", 1, "text-xs", 3, "disabled", "click"], ["mat-raised-button", "", "color", "accent", 1, "text-xs", 3, "disabled", "click"], [1, "text-xs", "text-gray-500"]],
    template: function IntegracionComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "mat-card", 2)(3, "mat-card-content", 3)(4, "div", 4)(5, "div", 5)(6, "mat-form-field", 6)(7, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](8, "Agencia");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](9, "mat-select", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("selectionChange", function IntegracionComponent_Template_mat_select_selectionChange_9_listener($event) {
          return ctx.onAgencyChange($event.value);
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](10, "mat-option", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](11, "Todas las agencias");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](12, IntegracionComponent_mat_option_12_Template, 2, 2, "mat-option", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](13, "div", 10)(14, "mat-form-field", 11)(15, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](16, "Buscar Cliente");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](17, "input", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("ngModelChange", function IntegracionComponent_Template_input_ngModelChange_17_listener($event) {
          return ctx.clientSearchTerm = $event;
        })("keyup.enter", function IntegracionComponent_Template_input_keyup_enter_17_listener() {
          return ctx.searchClients();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](18, "div", 13)(19, "button", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function IntegracionComponent_Template_button_click_19_listener() {
          return ctx.searchClients();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](20, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](21, "search");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](22, " Buscar ");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](23, IntegracionComponent_button_23_Template, 4, 0, "button", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](24, IntegracionComponent_div_24_Template, 5, 0, "div", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](25, IntegracionComponent_div_25_Template, 39, 6, "div", 17)(26, IntegracionComponent_div_26_Template, 13, 4, "div", 18)(27, IntegracionComponent_div_27_Template, 15, 11, "div", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](9);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("value", ctx.selectedAgencyId)("disabled", ctx.agenciesLoading || !ctx.hasAgencies());
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("value", null);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx.agencies)("ngForTrackBy", ctx.trackByAgencyId);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngModel", ctx.clientSearchTerm);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("disabled", ctx.clientsLoading || ctx.clientSearchTerm.trim().length < 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.clientSearchTerm);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.showClientResults && ctx.clients.length === 0 && !ctx.clientsLoading);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.selectedClient);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.selectedClient);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.selectedFile);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_9__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_9__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_9__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_9__.DatePipe, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.NgModel, _angular_material_card__WEBPACK_IMPORTED_MODULE_11__.MatCardModule, _angular_material_card__WEBPACK_IMPORTED_MODULE_11__.MatCard, _angular_material_card__WEBPACK_IMPORTED_MODULE_11__.MatCardContent, _angular_material_card__WEBPACK_IMPORTED_MODULE_11__.MatCardHeader, _angular_material_card__WEBPACK_IMPORTED_MODULE_11__.MatCardTitle, _angular_material_button__WEBPACK_IMPORTED_MODULE_12__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_12__.MatButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_12__.MatIconButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_13__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_13__.MatIcon, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_14__.MatProgressSpinnerModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_14__.MatProgressSpinner, _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_7__.MatSnackBarModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_15__.MatFormFieldModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_15__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_15__.MatLabel, _angular_material_select__WEBPACK_IMPORTED_MODULE_16__.MatSelectModule, _angular_material_select__WEBPACK_IMPORTED_MODULE_16__.MatSelect, _angular_material_core__WEBPACK_IMPORTED_MODULE_17__.MatOption, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_18__.MatTooltipModule, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_18__.MatTooltip, _angular_material_input__WEBPACK_IMPORTED_MODULE_19__.MatInputModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_19__.MatInput, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_8__.MatDialogModule, _angular_material_table__WEBPACK_IMPORTED_MODULE_20__.MatTableModule, _angular_material_table__WEBPACK_IMPORTED_MODULE_20__.MatTable, _angular_material_table__WEBPACK_IMPORTED_MODULE_20__.MatHeaderCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_20__.MatHeaderRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_20__.MatColumnDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_20__.MatCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_20__.MatRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_20__.MatHeaderCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_20__.MatCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_20__.MatHeaderRow, _angular_material_table__WEBPACK_IMPORTED_MODULE_20__.MatRow, _angular_material_menu__WEBPACK_IMPORTED_MODULE_21__.MatMenuModule, _angular_material_menu__WEBPACK_IMPORTED_MODULE_21__.MatMenu, _angular_material_menu__WEBPACK_IMPORTED_MODULE_21__.MatMenuItem, _angular_material_menu__WEBPACK_IMPORTED_MODULE_21__.MatMenuTrigger],
    styles: [".integracion-container[_ngcontent-%COMP%] {\n  padding: 0.5rem;\n  width: 100%;\n  min-height: 100vh;\n  margin: 0;\n}\n.integracion-container[_ngcontent-%COMP%]     .mat-mdc-form-field-subscript-wrapper {\n  display: none !important;\n}\n.integracion-container[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%] {\n  margin-bottom: 2rem;\n}\n.integracion-container[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%]   .page-title[_ngcontent-%COMP%] {\n  font-size: 2rem;\n  font-weight: 600;\n  color: #1f2937;\n  margin-bottom: 0.5rem;\n  display: flex;\n  align-items: center;\n}\n.integracion-container[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%]   .page-subtitle[_ngcontent-%COMP%] {\n  color: #6b7280;\n  font-size: 1.1rem;\n  margin: 0;\n}\n.integracion-container[_ngcontent-%COMP%]   .status-section[_ngcontent-%COMP%]   .status-card[_ngcontent-%COMP%] {\n  border-radius: 12px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n  border: 1px solid #e5e7eb;\n}\n.integracion-container[_ngcontent-%COMP%]   .status-section[_ngcontent-%COMP%]   .status-card[_ngcontent-%COMP%]   .status-indicator[_ngcontent-%COMP%] {\n  width: 48px;\n  height: 48px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 50%;\n  background-color: #f3f4f6;\n}\n.integracion-container[_ngcontent-%COMP%]   .status-section[_ngcontent-%COMP%]   .status-card[_ngcontent-%COMP%]   .status-indicator[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 24px;\n}\n.integracion-container[_ngcontent-%COMP%]   .status-section[_ngcontent-%COMP%]   .status-card[_ngcontent-%COMP%]   .status-text[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n  font-weight: 600;\n  margin-bottom: 0.25rem;\n}\n.integracion-container[_ngcontent-%COMP%]   .status-section[_ngcontent-%COMP%]   .status-card[_ngcontent-%COMP%]   .status-description[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n}\n.integracion-container[_ngcontent-%COMP%]   .status-section[_ngcontent-%COMP%]   .status-card[_ngcontent-%COMP%]   .status-actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  margin-left: 0.5rem;\n}\n.integracion-container[_ngcontent-%COMP%]   .metrics-grid[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%] {\n  border-radius: 12px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n  border: 1px solid #e5e7eb;\n  transition: all 0.3s ease;\n}\n.integracion-container[_ngcontent-%COMP%]   .metrics-grid[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%]:hover {\n  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);\n  transform: translateY(-2px);\n}\n.integracion-container[_ngcontent-%COMP%]   .metrics-grid[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%]   .metric-icon[_ngcontent-%COMP%] {\n  width: 48px;\n  height: 48px;\n  border-radius: 12px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.integracion-container[_ngcontent-%COMP%]   .metrics-grid[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%]   .metric-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 24px;\n}\n.integracion-container[_ngcontent-%COMP%]   .metrics-grid[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%]   .metric-value[_ngcontent-%COMP%] {\n  font-size: 1.875rem;\n  font-weight: 700;\n  color: #1f2937;\n  line-height: 1;\n  margin-bottom: 0.25rem;\n}\n.integracion-container[_ngcontent-%COMP%]   .metrics-grid[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%]   .metric-label[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  color: #6b7280;\n  font-weight: 500;\n}\n.integracion-container[_ngcontent-%COMP%]   .config-section[_ngcontent-%COMP%]   mat-card[_ngcontent-%COMP%] {\n  border-radius: 12px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n  border: 1px solid #e5e7eb;\n}\n.integracion-container[_ngcontent-%COMP%]   .config-section[_ngcontent-%COMP%]   mat-card[_ngcontent-%COMP%]   .config-content[_ngcontent-%COMP%]   .config-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 1rem;\n  margin-top: 1rem;\n}\n.integracion-container[_ngcontent-%COMP%]   .loading-overlay[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-color: rgba(255, 255, 255, 0.8);\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000;\n}\n.integracion-container[_ngcontent-%COMP%]   .loading-overlay[_ngcontent-%COMP%]   .loading-text[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n  color: #6b7280;\n  font-size: 1rem;\n}\n.integracion-container[_ngcontent-%COMP%]   .client-info-section[_ngcontent-%COMP%]   .field-group[_ngcontent-%COMP%] {\n  margin-bottom: 0.25rem;\n}\n.integracion-container[_ngcontent-%COMP%]   .client-info-section[_ngcontent-%COMP%]   .field-group[_ngcontent-%COMP%]   .field-label[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 0.7rem;\n  font-weight: 600;\n  color: #374151;\n  margin-bottom: 0.125rem;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n}\n.integracion-container[_ngcontent-%COMP%]   .client-info-section[_ngcontent-%COMP%]   .field-group[_ngcontent-%COMP%]   .field-value[_ngcontent-%COMP%] {\n  background-color: #f9fafb;\n  border: 1px solid #d1d5db;\n  border-radius: 4px;\n  padding: 0.25rem 0.5rem;\n  font-size: 0.75rem;\n  color: #111827;\n  font-weight: 500;\n  min-height: 1.5rem;\n  display: flex;\n  align-items: center;\n  word-break: break-word;\n}\n.integracion-container[_ngcontent-%COMP%]   .client-info-section[_ngcontent-%COMP%]   .field-group[_ngcontent-%COMP%]   .field-value[_ngcontent-%COMP%]:empty::before {\n  content: \"N/A\";\n  color: #9ca3af;\n  font-style: italic;\n}\n.integracion-container[_ngcontent-%COMP%]   .client-card[_ngcontent-%COMP%] {\n  transition: all 0.2s ease;\n  border: 1px solid #e5e7eb;\n}\n.integracion-container[_ngcontent-%COMP%]   .client-card[_ngcontent-%COMP%]:hover {\n  border-color: #3b82f6;\n  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);\n}\n.integracion-container   .files-section   .files-table   [_nghost-%COMP%]     mat-table .mat-mdc-table {\n  border-collapse: separate !important;\n  border-spacing: 0 !important;\n  width: 100% !important;\n}\n.integracion-container   .files-section   .files-table   [_nghost-%COMP%]     mat-table .mat-mdc-row {\n  min-height: 32px !important;\n  height: 32px !important;\n  max-height: 32px !important;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;\n  display: table-row !important;\n}\n.integracion-container   .files-section   .files-table   [_nghost-%COMP%]     mat-table .mat-mdc-row:hover {\n  background-color: #f1f5f9 !important;\n}\n.integracion-container   .files-section   .files-table   [_nghost-%COMP%]     mat-table .mat-mdc-header-row {\n  min-height: 32px !important;\n  height: 32px !important;\n  max-height: 32px !important;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;\n  display: table-row !important;\n  background-color: #f8fafc !important;\n}\n.integracion-container   .files-section   .files-table   [_nghost-%COMP%]     mat-table .mat-mdc-cell {\n  padding: 4px 8px !important;\n  vertical-align: middle !important;\n  line-height: 1.2 !important;\n  font-size: 12px !important;\n  border: none !important;\n  height: 32px !important;\n  max-height: 32px !important;\n  overflow: hidden !important;\n  white-space: nowrap !important;\n  text-overflow: ellipsis !important;\n  text-align: left !important;\n}\n.integracion-container   .files-section   .files-table   [_nghost-%COMP%]     mat-table .mat-mdc-header-cell {\n  padding: 4px 8px !important;\n  vertical-align: middle !important;\n  line-height: 1.2 !important;\n  font-size: 12px !important;\n  font-weight: 500 !important;\n  border: none !important;\n  height: 32px !important;\n  max-height: 32px !important;\n  overflow: hidden !important;\n  white-space: nowrap !important;\n  text-overflow: ellipsis !important;\n  text-align: left !important;\n}\n.integracion-container   .files-section   .files-table   [_nghost-%COMP%]     mat-table .mat-mdc-cell, .integracion-container   .files-section   .files-table   [_nghost-%COMP%]     mat-table .mat-mdc-header-cell {\n  margin: 0 !important;\n  border-spacing: 0 !important;\n}\n.integracion-container   .files-section   .files-table   [_nghost-%COMP%]     .mat-mdc-table-container {\n  overflow: hidden !important;\n}\n.integracion-container   .files-section   .files-table   [_nghost-%COMP%]     .mat-mdc-table-wrapper {\n  overflow: hidden !important;\n}\n.integracion-container   .files-section   .files-table   [_nghost-%COMP%]     .mat-mdc-cell div, .integracion-container   .files-section   .files-table   [_nghost-%COMP%]     .mat-mdc-cell span, .integracion-container   .files-section   .files-table   [_nghost-%COMP%]     .mat-mdc-header-cell div, .integracion-container   .files-section   .files-table   [_nghost-%COMP%]     .mat-mdc-header-cell span {\n  line-height: 1.2 !important;\n  margin: 0 !important;\n  padding: 0 !important;\n  font-size: 12px !important;\n}\n\n@media (max-width: 768px) {\n  .integracion-container[_ngcontent-%COMP%] {\n    padding: 1rem;\n  }\n  .integracion-container[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%]   .page-title[_ngcontent-%COMP%] {\n    font-size: 1.5rem;\n  }\n  .integracion-container[_ngcontent-%COMP%]   .metrics-grid[_ngcontent-%COMP%]   .grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .integracion-container[_ngcontent-%COMP%]   .status-section[_ngcontent-%COMP%]   .status-card[_ngcontent-%COMP%]   mat-card-content[_ngcontent-%COMP%]   .flex[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-start;\n    gap: 1rem;\n  }\n}\n.documents-section[_ngcontent-%COMP%]   .document-item[_ngcontent-%COMP%] {\n  transition: all 0.2s ease;\n}\n.documents-section[_ngcontent-%COMP%]   .document-item[_ngcontent-%COMP%]:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n}\n.documents-section[_ngcontent-%COMP%]   .file-input-container[_ngcontent-%COMP%] {\n  position: relative;\n}\n.documents-section[_ngcontent-%COMP%]   .file-input-container[_ngcontent-%COMP%]   input[type=file][_ngcontent-%COMP%] {\n  position: absolute;\n  opacity: 0;\n  pointer-events: none;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvcHJvY2Vzb3MvaW50ZWdyYWNpb24vaW50ZWdyYWNpb24uY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxlQUFBO0VBQ0EsV0FBQTtFQUNBLGlCQUFBO0VBQ0EsU0FBQTtBQUNGO0FBRUU7RUFDRSx3QkFBQTtBQUFKO0FBR0U7RUFDRSxtQkFBQTtBQURKO0FBR0k7RUFDRSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxjQUFBO0VBQ0EscUJBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7QUFETjtBQUlJO0VBQ0UsY0FBQTtFQUNBLGlCQUFBO0VBQ0EsU0FBQTtBQUZOO0FBT0k7RUFDRSxtQkFBQTtFQUNBLHdDQUFBO0VBQ0EseUJBQUE7QUFMTjtBQU9NO0VBQ0UsV0FBQTtFQUNBLFlBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtFQUNBLGtCQUFBO0VBQ0EseUJBQUE7QUFMUjtBQU9RO0VBQ0UsZUFBQTtBQUxWO0FBU007RUFDRSxrQkFBQTtFQUNBLGdCQUFBO0VBQ0Esc0JBQUE7QUFQUjtBQVVNO0VBQ0UsbUJBQUE7QUFSUjtBQVlRO0VBQ0UsbUJBQUE7QUFWVjtBQWlCSTtFQUNFLG1CQUFBO0VBQ0Esd0NBQUE7RUFDQSx5QkFBQTtFQUNBLHlCQUFBO0FBZk47QUFpQk07RUFDRSwwQ0FBQTtFQUNBLDJCQUFBO0FBZlI7QUFrQk07RUFDRSxXQUFBO0VBQ0EsWUFBQTtFQUNBLG1CQUFBO0VBQ0EsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7QUFoQlI7QUFrQlE7RUFDRSxlQUFBO0FBaEJWO0FBb0JNO0VBQ0UsbUJBQUE7RUFDQSxnQkFBQTtFQUNBLGNBQUE7RUFDQSxjQUFBO0VBQ0Esc0JBQUE7QUFsQlI7QUFxQk07RUFDRSxtQkFBQTtFQUNBLGNBQUE7RUFDQSxnQkFBQTtBQW5CUjtBQXlCSTtFQUNFLG1CQUFBO0VBQ0Esd0NBQUE7RUFDQSx5QkFBQTtBQXZCTjtBQTBCUTtFQUNFLGFBQUE7RUFDQSxTQUFBO0VBQ0EsZ0JBQUE7QUF4QlY7QUE4QkU7RUFDRSxlQUFBO0VBQ0EsTUFBQTtFQUNBLE9BQUE7RUFDQSxRQUFBO0VBQ0EsU0FBQTtFQUNBLDBDQUFBO0VBQ0EsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtFQUNBLGFBQUE7QUE1Qko7QUE4Qkk7RUFDRSxnQkFBQTtFQUNBLGNBQUE7RUFDQSxlQUFBO0FBNUJOO0FBaUNJO0VBQ0Usc0JBQUE7QUEvQk47QUFpQ007RUFDRSxjQUFBO0VBQ0EsaUJBQUE7RUFDQSxnQkFBQTtFQUNBLGNBQUE7RUFDQSx1QkFBQTtFQUNBLHlCQUFBO0VBQ0Esc0JBQUE7QUEvQlI7QUFrQ007RUFDRSx5QkFBQTtFQUNBLHlCQUFBO0VBQ0Esa0JBQUE7RUFDQSx1QkFBQTtFQUNBLGtCQUFBO0VBQ0EsY0FBQTtFQUNBLGdCQUFBO0VBQ0Esa0JBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxzQkFBQTtBQWhDUjtBQWtDUTtFQUNFLGNBQUE7RUFDQSxjQUFBO0VBQ0Esa0JBQUE7QUFoQ1Y7QUFzQ0U7RUFDRSx5QkFBQTtFQUNBLHlCQUFBO0FBcENKO0FBc0NJO0VBQ0UscUJBQUE7RUFDQSwrQ0FBQTtBQXBDTjtBQTZDVTtFQUNFLG9DQUFBO0VBQ0EsNEJBQUE7RUFDQSxzQkFBQTtBQTNDWjtBQStDVTtFQUNFLDJCQUFBO0VBQ0EsdUJBQUE7RUFDQSwyQkFBQTtFQUNBLHVEQUFBO0VBQ0EsNkJBQUE7QUE3Q1o7QUErQ1k7RUFDRSxvQ0FBQTtBQTdDZDtBQWlEVTtFQUNFLDJCQUFBO0VBQ0EsdUJBQUE7RUFDQSwyQkFBQTtFQUNBLHVEQUFBO0VBQ0EsNkJBQUE7RUFDQSxvQ0FBQTtBQS9DWjtBQW1EVTtFQUNFLDJCQUFBO0VBQ0EsaUNBQUE7RUFDQSwyQkFBQTtFQUNBLDBCQUFBO0VBQ0EsdUJBQUE7RUFDQSx1QkFBQTtFQUNBLDJCQUFBO0VBQ0EsMkJBQUE7RUFDQSw4QkFBQTtFQUNBLGtDQUFBO0VBQ0EsMkJBQUE7QUFqRFo7QUFvRFU7RUFDRSwyQkFBQTtFQUNBLGlDQUFBO0VBQ0EsMkJBQUE7RUFDQSwwQkFBQTtFQUNBLDJCQUFBO0VBQ0EsdUJBQUE7RUFDQSx1QkFBQTtFQUNBLDJCQUFBO0VBQ0EsMkJBQUE7RUFDQSw4QkFBQTtFQUNBLGtDQUFBO0VBQ0EsMkJBQUE7QUFsRFo7QUFzRFU7RUFDRSxvQkFBQTtFQUNBLDRCQUFBO0FBcERaO0FBeURRO0VBQ0UsMkJBQUE7QUF2RFY7QUEwRFE7RUFDRSwyQkFBQTtBQXhEVjtBQTREUTs7OztFQUlFLDJCQUFBO0VBQ0Esb0JBQUE7RUFDQSxxQkFBQTtFQUNBLDBCQUFBO0FBMURWOztBQWtFQTtFQUNFO0lBQ0UsYUFBQTtFQS9ERjtFQWtFSTtJQUNFLGlCQUFBO0VBaEVOO0VBcUVJO0lBQ0UsMEJBQUE7RUFuRU47RUEwRVE7SUFDRSxzQkFBQTtJQUNBLHVCQUFBO0lBQ0EsU0FBQTtFQXhFVjtBQUNGO0FBaUZFO0VBQ0UseUJBQUE7QUEvRUo7QUFpRkk7RUFDRSwyQkFBQTtFQUNBLHdDQUFBO0FBL0VOO0FBbUZFO0VBQ0Usa0JBQUE7QUFqRko7QUFtRkk7RUFDRSxrQkFBQTtFQUNBLFVBQUE7RUFDQSxvQkFBQTtBQWpGTiIsInNvdXJjZXNDb250ZW50IjpbIi5pbnRlZ3JhY2lvbi1jb250YWluZXIge1xuICBwYWRkaW5nOiAwLjVyZW07XG4gIHdpZHRoOiAxMDAlO1xuICBtaW4taGVpZ2h0OiAxMDB2aDtcbiAgbWFyZ2luOiAwO1xuXG4gIC8vIE9jdWx0YXIgaGludHMgZGUgZm9ybSBmaWVsZHNcbiAgOjpuZy1kZWVwIC5tYXQtbWRjLWZvcm0tZmllbGQtc3Vic2NyaXB0LXdyYXBwZXIge1xuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgfVxuXG4gIC5wYWdlLWhlYWRlciB7XG4gICAgbWFyZ2luLWJvdHRvbTogMnJlbTtcbiAgICBcbiAgICAucGFnZS10aXRsZSB7XG4gICAgICBmb250LXNpemU6IDJyZW07XG4gICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgY29sb3I6ICMxZjI5Mzc7XG4gICAgICBtYXJnaW4tYm90dG9tOiAwLjVyZW07XG4gICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICB9XG4gICAgXG4gICAgLnBhZ2Utc3VidGl0bGUge1xuICAgICAgY29sb3I6ICM2YjcyODA7XG4gICAgICBmb250LXNpemU6IDEuMXJlbTtcbiAgICAgIG1hcmdpbjogMDtcbiAgICB9XG4gIH1cblxuICAuc3RhdHVzLXNlY3Rpb24ge1xuICAgIC5zdGF0dXMtY2FyZCB7XG4gICAgICBib3JkZXItcmFkaXVzOiAxMnB4O1xuICAgICAgYm94LXNoYWRvdzogMCAycHggOHB4IHJnYmEoMCwgMCwgMCwgMC4xKTtcbiAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNlNWU3ZWI7XG4gICAgICBcbiAgICAgIC5zdGF0dXMtaW5kaWNhdG9yIHtcbiAgICAgICAgd2lkdGg6IDQ4cHg7XG4gICAgICAgIGhlaWdodDogNDhweDtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2YzZjRmNjtcbiAgICAgICAgXG4gICAgICAgIG1hdC1pY29uIHtcbiAgICAgICAgICBmb250LXNpemU6IDI0cHg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgLnN0YXR1cy10ZXh0IHtcbiAgICAgICAgZm9udC1zaXplOiAxLjI1cmVtO1xuICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICBtYXJnaW4tYm90dG9tOiAwLjI1cmVtO1xuICAgICAgfVxuICAgICAgXG4gICAgICAuc3RhdHVzLWRlc2NyaXB0aW9uIHtcbiAgICAgICAgZm9udC1zaXplOiAwLjg3NXJlbTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLnN0YXR1cy1hY3Rpb25zIHtcbiAgICAgICAgYnV0dG9uIHtcbiAgICAgICAgICBtYXJnaW4tbGVmdDogMC41cmVtO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLm1ldHJpY3MtZ3JpZCB7XG4gICAgLm1ldHJpYy1jYXJkIHtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDEycHg7XG4gICAgICBib3gtc2hhZG93OiAwIDJweCA4cHggcmdiYSgwLCAwLCAwLCAwLjEpO1xuICAgICAgYm9yZGVyOiAxcHggc29saWQgI2U1ZTdlYjtcbiAgICAgIHRyYW5zaXRpb246IGFsbCAwLjNzIGVhc2U7XG4gICAgICBcbiAgICAgICY6aG92ZXIge1xuICAgICAgICBib3gtc2hhZG93OiAwIDRweCAxNnB4IHJnYmEoMCwgMCwgMCwgMC4xNSk7XG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMnB4KTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLm1ldHJpYy1pY29uIHtcbiAgICAgICAgd2lkdGg6IDQ4cHg7XG4gICAgICAgIGhlaWdodDogNDhweDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTJweDtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIFxuICAgICAgICBtYXQtaWNvbiB7XG4gICAgICAgICAgZm9udC1zaXplOiAyNHB4O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIC5tZXRyaWMtdmFsdWUge1xuICAgICAgICBmb250LXNpemU6IDEuODc1cmVtO1xuICAgICAgICBmb250LXdlaWdodDogNzAwO1xuICAgICAgICBjb2xvcjogIzFmMjkzNztcbiAgICAgICAgbGluZS1oZWlnaHQ6IDE7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDAuMjVyZW07XG4gICAgICB9XG4gICAgICBcbiAgICAgIC5tZXRyaWMtbGFiZWwge1xuICAgICAgICBmb250LXNpemU6IDAuODc1cmVtO1xuICAgICAgICBjb2xvcjogIzZiNzI4MDtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAuY29uZmlnLXNlY3Rpb24ge1xuICAgIG1hdC1jYXJkIHtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDEycHg7XG4gICAgICBib3gtc2hhZG93OiAwIDJweCA4cHggcmdiYSgwLCAwLCAwLCAwLjEpO1xuICAgICAgYm9yZGVyOiAxcHggc29saWQgI2U1ZTdlYjtcbiAgICAgIFxuICAgICAgLmNvbmZpZy1jb250ZW50IHtcbiAgICAgICAgLmNvbmZpZy1hY3Rpb25zIHtcbiAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgIGdhcDogMXJlbTtcbiAgICAgICAgICBtYXJnaW4tdG9wOiAxcmVtO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLmxvYWRpbmctb3ZlcmxheSB7XG4gICAgcG9zaXRpb246IGZpeGVkO1xuICAgIHRvcDogMDtcbiAgICBsZWZ0OiAwO1xuICAgIHJpZ2h0OiAwO1xuICAgIGJvdHRvbTogMDtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuOCk7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgei1pbmRleDogMTAwMDtcbiAgICBcbiAgICAubG9hZGluZy10ZXh0IHtcbiAgICAgIG1hcmdpbi10b3A6IDFyZW07XG4gICAgICBjb2xvcjogIzZiNzI4MDtcbiAgICAgIGZvbnQtc2l6ZTogMXJlbTtcbiAgICB9XG4gIH1cblxuICAuY2xpZW50LWluZm8tc2VjdGlvbiB7XG4gICAgLmZpZWxkLWdyb3VwIHtcbiAgICAgIG1hcmdpbi1ib3R0b206IDAuMjVyZW07XG4gICAgICBcbiAgICAgIC5maWVsZC1sYWJlbCB7XG4gICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgICBmb250LXNpemU6IDAuN3JlbTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgY29sb3I6ICMzNzQxNTE7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDAuMTI1cmVtO1xuICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4wNWVtO1xuICAgICAgfVxuICAgICAgXG4gICAgICAuZmllbGQtdmFsdWUge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjlmYWZiO1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjZDFkNWRiO1xuICAgICAgICBib3JkZXItcmFkaXVzOiA0cHg7XG4gICAgICAgIHBhZGRpbmc6IDAuMjVyZW0gMC41cmVtO1xuICAgICAgICBmb250LXNpemU6IDAuNzVyZW07XG4gICAgICAgIGNvbG9yOiAjMTExODI3O1xuICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICBtaW4taGVpZ2h0OiAxLjVyZW07XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIHdvcmQtYnJlYWs6IGJyZWFrLXdvcmQ7XG4gICAgICAgIFxuICAgICAgICAmOmVtcHR5OjpiZWZvcmUge1xuICAgICAgICAgIGNvbnRlbnQ6ICdOL0EnO1xuICAgICAgICAgIGNvbG9yOiAjOWNhM2FmO1xuICAgICAgICAgIGZvbnQtc3R5bGU6IGl0YWxpYztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC5jbGllbnQtY2FyZCB7XG4gICAgdHJhbnNpdGlvbjogYWxsIDAuMnMgZWFzZTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjZTVlN2ViO1xuICAgIFxuICAgICY6aG92ZXIge1xuICAgICAgYm9yZGVyLWNvbG9yOiAjM2I4MmY2O1xuICAgICAgYm94LXNoYWRvdzogMCA0cHggMTJweCByZ2JhKDU5LCAxMzAsIDI0NiwgMC4xNSk7XG4gICAgfVxuICB9XG5cbiAgLmZpbGVzLXNlY3Rpb24ge1xuICAgIC5maWxlcy10YWJsZSB7XG4gICAgICAvLyBFc3RpbG9zIGVzcGVjw4PCrWZpY29zIHBhcmEgbGEgdGFibGEgZGUgcGVkaWRvcyAodG9tYWRvcyBkZSB2YWxpZGFjacODwrNuKVxuICAgICAgOmhvc3QgOjpuZy1kZWVwIHtcbiAgICAgICAgbWF0LXRhYmxlIHtcbiAgICAgICAgICAubWF0LW1kYy10YWJsZSB7XG4gICAgICAgICAgICBib3JkZXItY29sbGFwc2U6IHNlcGFyYXRlICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBib3JkZXItc3BhY2luZzogMCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgd2lkdGg6IDEwMCUgIWltcG9ydGFudDtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gQWx0dXJhIGNvbXBhY3RhIHBhcmEgbGFzIGZpbGFzXG4gICAgICAgICAgLm1hdC1tZGMtcm93IHtcbiAgICAgICAgICAgIG1pbi1oZWlnaHQ6IDMycHggIWltcG9ydGFudDtcbiAgICAgICAgICAgIGhlaWdodDogMzJweCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgbWF4LWhlaWdodDogMzJweCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHJnYmEoMCwwLDAsLjEyKSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgZGlzcGxheTogdGFibGUtcm93ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjFmNWY5ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIC5tYXQtbWRjLWhlYWRlci1yb3cge1xuICAgICAgICAgICAgbWluLWhlaWdodDogMzJweCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgaGVpZ2h0OiAzMnB4ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBtYXgtaGVpZ2h0OiAzMnB4ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgcmdiYSgwLDAsMCwuMTIpICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBkaXNwbGF5OiB0YWJsZS1yb3cgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmOGZhZmMgIWltcG9ydGFudDtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gUGFkZGluZyBjb21wYWN0byBwYXJhIGxhcyBjZWxkYXNcbiAgICAgICAgICAubWF0LW1kYy1jZWxsIHtcbiAgICAgICAgICAgIHBhZGRpbmc6IDRweCA4cHggIWltcG9ydGFudDtcbiAgICAgICAgICAgIHZlcnRpY2FsLWFsaWduOiBtaWRkbGUgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxLjIgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTJweCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYm9yZGVyOiBub25lICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBoZWlnaHQ6IDMycHggIWltcG9ydGFudDtcbiAgICAgICAgICAgIG1heC1oZWlnaHQ6IDMycHggIWltcG9ydGFudDtcbiAgICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW4gIWltcG9ydGFudDtcbiAgICAgICAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXAgIWltcG9ydGFudDtcbiAgICAgICAgICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICB0ZXh0LWFsaWduOiBsZWZ0ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIC5tYXQtbWRjLWhlYWRlci1jZWxsIHtcbiAgICAgICAgICAgIHBhZGRpbmc6IDRweCA4cHggIWltcG9ydGFudDtcbiAgICAgICAgICAgIHZlcnRpY2FsLWFsaWduOiBtaWRkbGUgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxLjIgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTJweCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDUwMCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYm9yZGVyOiBub25lICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBoZWlnaHQ6IDMycHggIWltcG9ydGFudDtcbiAgICAgICAgICAgIG1heC1oZWlnaHQ6IDMycHggIWltcG9ydGFudDtcbiAgICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW4gIWltcG9ydGFudDtcbiAgICAgICAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXAgIWltcG9ydGFudDtcbiAgICAgICAgICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICB0ZXh0LWFsaWduOiBsZWZ0ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIC8vIEVsaW1pbmFyIGN1YWxxdWllciBlc3BhY2lhZG8gZXh0cmFcbiAgICAgICAgICAubWF0LW1kYy1jZWxsLCAubWF0LW1kYy1oZWFkZXItY2VsbCB7XG4gICAgICAgICAgICBtYXJnaW46IDAgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGJvcmRlci1zcGFjaW5nOiAwICFpbXBvcnRhbnQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBFc3RpbG9zIGVzcGVjw4PCrWZpY29zIHBhcmEgZWxlbWVudG9zIHF1ZSBwdWVkYW4gZXN0YXIgY2F1c2FuZG8gZGlmZXJlbmNpYXNcbiAgICAgICAgLm1hdC1tZGMtdGFibGUtY29udGFpbmVyIHtcbiAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC5tYXQtbWRjLXRhYmxlLXdyYXBwZXIge1xuICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW4gIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gRXN0aWxvcyBlc3BlY8ODwq1maWNvcyBwYXJhIGVsZW1lbnRvcyBpbnRlcm5vc1xuICAgICAgICAubWF0LW1kYy1jZWxsIGRpdixcbiAgICAgICAgLm1hdC1tZGMtY2VsbCBzcGFuLFxuICAgICAgICAubWF0LW1kYy1oZWFkZXItY2VsbCBkaXYsXG4gICAgICAgIC5tYXQtbWRjLWhlYWRlci1jZWxsIHNwYW4ge1xuICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxLjIgIWltcG9ydGFudDtcbiAgICAgICAgICBtYXJnaW46IDAgIWltcG9ydGFudDtcbiAgICAgICAgICBwYWRkaW5nOiAwICFpbXBvcnRhbnQ7XG4gICAgICAgICAgZm9udC1zaXplOiAxMnB4ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLy8gUmVzcG9uc2l2ZSBhZGp1c3RtZW50c1xuQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gIC5pbnRlZ3JhY2lvbi1jb250YWluZXIge1xuICAgIHBhZGRpbmc6IDFyZW07XG4gICAgXG4gICAgLnBhZ2UtaGVhZGVyIHtcbiAgICAgIC5wYWdlLXRpdGxlIHtcbiAgICAgICAgZm9udC1zaXplOiAxLjVyZW07XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIC5tZXRyaWNzLWdyaWQge1xuICAgICAgLmdyaWQge1xuICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmcjtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLnN0YXR1cy1zZWN0aW9uIHtcbiAgICAgIC5zdGF0dXMtY2FyZCB7XG4gICAgICAgIG1hdC1jYXJkLWNvbnRlbnQge1xuICAgICAgICAgIC5mbGV4IHtcbiAgICAgICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcbiAgICAgICAgICAgIGdhcDogMXJlbTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLy8gRXN0aWxvcyBwYXJhIGxhIHNlY2Npw4PCs24gZGUgZG9jdW1lbnRvc1xuLmRvY3VtZW50cy1zZWN0aW9uIHtcbiAgLmRvY3VtZW50LWl0ZW0ge1xuICAgIHRyYW5zaXRpb246IGFsbCAwLjJzIGVhc2U7XG4gICAgXG4gICAgJjpob3ZlciB7XG4gICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTFweCk7XG4gICAgICBib3gtc2hhZG93OiAwIDJweCA4cHggcmdiYSgwLDAsMCwwLjEpO1xuICAgIH1cbiAgfVxuICBcbiAgLmZpbGUtaW5wdXQtY29udGFpbmVyIHtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgXG4gICAgaW5wdXRbdHlwZT1cImZpbGVcIl0ge1xuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgb3BhY2l0eTogMDtcbiAgICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICAgIH1cbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ })

}]);
//# sourceMappingURL=src_app_pages_procesos_integracion_integracion_component_ts.js.map