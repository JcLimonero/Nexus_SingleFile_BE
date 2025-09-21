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
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/forms */ 28849);
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/card */ 18497);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/progress-spinner */ 33910);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/snack-bar */ 49409);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material/form-field */ 51333);
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/material/select */ 96355);
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/material/tooltip */ 60702);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/material/input */ 10026);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/dialog */ 17401);
/* harmony import */ var _angular_material_table__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @angular/material/table */ 46798);
/* harmony import */ var _angular_material_menu__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @angular/material/menu */ 78128);
/* harmony import */ var _angular_material_paginator__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @angular/material/paginator */ 39687);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 72513);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ 20274);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common/http */ 54860);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../environments/environment */ 20553);
/* harmony import */ var _client_selection_dialog_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./client-selection-dialog.component */ 91427);
/* harmony import */ var _order_selection_dialog_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./order-selection-dialog.component */ 6411);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _core_services_default_agency_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../core/services/default-agency.service */ 44907);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/material/core */ 55309);







































function IntegracionComponent_mat_option_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "mat-option", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const agency_r6 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("value", agency_r6.Id);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", agency_r6.Name, " ");
  }
}
function IntegracionComponent_button_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "button", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function IntegracionComponent_button_23_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r8);
      const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r7.clearClientSearch());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](1, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2, "clear");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3, " Limpiar ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_24_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 21)(1, "mat-icon", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2, "search_off");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "p", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](4, "No se encontraron clientes con el t\u00E9rmino de b\u00FAsqueda");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
}
function IntegracionComponent_div_25_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 24)(1, "mat-card", 2)(2, "mat-card-header", 25)(3, "mat-card-title", 26)(4, "mat-icon", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](5, "person");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6, " Informaci\u00F3n del Cliente ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](7, "mat-card-content", 3)(8, "div", 28)(9, "div", 29)(10, "label", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](11, "N\u00B0 Cliente");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](12, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](14, "div", 29)(15, "label", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](16, "Raz\u00F3n Social");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](17, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](19, "div", 29)(20, "label", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](21, "RFC");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](22, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](23);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](24, "div", 29)(25, "label", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](26, "Correo");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](27, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](28);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](29, "div", 29)(30, "label", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](31, "Tel\u00E9fono");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](32, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](33);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](34, "div", 29)(35, "label", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](36, "Tel\u00E9fono 2");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](37, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](38);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()()()();
  }
  if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx_r3.selectedClient.ndCliente || "N/A");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx_r3.selectedClient.razonSocial || "N/A");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx_r3.selectedClient.rfc || "N/A");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx_r3.selectedClient.email || "N/A");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx_r3.selectedClient.telefono || "N/A");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx_r3.selectedClient.telefono2 || "N/A");
  }
}
function IntegracionComponent_div_26_button_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "button", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function IntegracionComponent_div_26_button_8_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r16);
      const ctx_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r15.agregarPedidoIntegracion());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](1, "mat-icon", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2, "add");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
}
function IntegracionComponent_div_26_button_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "button", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function IntegracionComponent_div_26_button_17_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r18);
      const ctx_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r17.clearOrderSearch());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](1, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2, "clear");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
}
function IntegracionComponent_div_26_div_19_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](1, "mat-spinner", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_20_th_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "N\u00B0 Pedido");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_20_td_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 69)(1, "div", 34)(2, "mat-icon", 70);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3, "receipt");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "span", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const file_r46 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](file_r46.numeroPedido);
  }
}
function IntegracionComponent_div_26_div_20_th_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "N\u00B0 Inventario");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_20_td_7_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 74);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r47 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](file_r47.numeroInventario);
  }
}
function IntegracionComponent_div_26_div_20_td_7_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 75);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "Sin inventario");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_20_td_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, IntegracionComponent_div_26_div_20_td_7_span_1_Template, 2, 1, "span", 72)(2, IntegracionComponent_div_26_div_20_td_7_ng_template_2_Template, 2, 0, "ng-template", null, 73, _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r47 = ctx.$implicit;
    const _r50 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", file_r47.numeroInventario)("ngIfElse", _r50);
  }
}
function IntegracionComponent_div_26_div_20_th_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "Proceso");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_20_td_10_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 74);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r52 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](file_r52.proceso);
  }
}
function IntegracionComponent_div_26_div_20_td_10_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 75);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "Sin proceso");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_20_td_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, IntegracionComponent_div_26_div_20_td_10_span_1_Template, 2, 1, "span", 72)(2, IntegracionComponent_div_26_div_20_td_10_ng_template_2_Template, 2, 0, "ng-template", null, 76, _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r52 = ctx.$implicit;
    const _r55 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", file_r52.proceso)("ngIfElse", _r55);
  }
}
function IntegracionComponent_div_26_div_20_th_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "Operaci\u00F3n");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_20_td_13_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 74);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r57 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](file_r57.operacion);
  }
}
function IntegracionComponent_div_26_div_20_td_13_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 75);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "Sin operaci\u00F3n");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_20_td_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, IntegracionComponent_div_26_div_20_td_13_span_1_Template, 2, 1, "span", 72)(2, IntegracionComponent_div_26_div_20_td_13_ng_template_2_Template, 2, 0, "ng-template", null, 77, _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r57 = ctx.$implicit;
    const _r60 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", file_r57.operacion)("ngIfElse", _r60);
  }
}
function IntegracionComponent_div_26_div_20_th_15_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "Tipo Cliente");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_20_td_16_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 74);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r62 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](file_r62.tipoCliente);
  }
}
function IntegracionComponent_div_26_div_20_td_16_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 75);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "Sin tipo");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_20_td_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, IntegracionComponent_div_26_div_20_td_16_span_1_Template, 2, 1, "span", 72)(2, IntegracionComponent_div_26_div_20_td_16_ng_template_2_Template, 2, 0, "ng-template", null, 78, _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r62 = ctx.$implicit;
    const _r65 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", file_r62.tipoCliente)("ngIfElse", _r65);
  }
}
function IntegracionComponent_div_26_div_20_th_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "Veh\u00EDculo");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_20_td_19_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 74);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r67 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](file_r67.vehiculo);
  }
}
function IntegracionComponent_div_26_div_20_td_19_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 75);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "Sin veh\u00EDculo");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_20_td_19_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, IntegracionComponent_div_26_div_20_td_19_span_1_Template, 2, 1, "span", 72)(2, IntegracionComponent_div_26_div_20_td_19_ng_template_2_Template, 2, 0, "ng-template", null, 79, _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r67 = ctx.$implicit;
    const _r70 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", file_r67.vehiculo)("ngIfElse", _r70);
  }
}
function IntegracionComponent_div_26_div_20_th_21_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "A\u00F1o");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_20_td_22_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 74);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r72 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](file_r72.year);
  }
}
function IntegracionComponent_div_26_div_20_td_22_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 75);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "-");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_20_td_22_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, IntegracionComponent_div_26_div_20_td_22_span_1_Template, 2, 1, "span", 72)(2, IntegracionComponent_div_26_div_20_td_22_ng_template_2_Template, 2, 0, "ng-template", null, 80, _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r72 = ctx.$implicit;
    const _r75 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", file_r72.year)("ngIfElse", _r75);
  }
}
function IntegracionComponent_div_26_div_20_th_24_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "Modelo");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_20_td_25_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 74);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r77 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](file_r77.modelo);
  }
}
function IntegracionComponent_div_26_div_20_td_25_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 75);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "Sin modelo");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_20_td_25_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, IntegracionComponent_div_26_div_20_td_25_span_1_Template, 2, 1, "span", 72)(2, IntegracionComponent_div_26_div_20_td_25_ng_template_2_Template, 2, 0, "ng-template", null, 81, _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r77 = ctx.$implicit;
    const _r80 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", file_r77.modelo)("ngIfElse", _r80);
  }
}
function IntegracionComponent_div_26_div_20_th_27_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "VIN");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_20_td_28_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 84);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r82 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](file_r82.vin);
  }
}
function IntegracionComponent_div_26_div_20_td_28_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 75);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "Sin VIN");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_20_td_28_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, IntegracionComponent_div_26_div_20_td_28_span_1_Template, 2, 1, "span", 82)(2, IntegracionComponent_div_26_div_20_td_28_ng_template_2_Template, 2, 0, "ng-template", null, 83, _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r82 = ctx.$implicit;
    const _r85 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", file_r82.vin)("ngIfElse", _r85);
  }
}
function IntegracionComponent_div_26_div_20_th_30_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "Agencia");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_20_td_31_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 74);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r87 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](file_r87.agencia);
  }
}
function IntegracionComponent_div_26_div_20_td_31_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 75);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "Sin agencia");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_20_td_31_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, IntegracionComponent_div_26_div_20_td_31_span_1_Template, 2, 1, "span", 72)(2, IntegracionComponent_div_26_div_20_td_31_ng_template_2_Template, 2, 0, "ng-template", null, 85, _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r87 = ctx.$implicit;
    const _r90 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", file_r87.agencia)("ngIfElse", _r90);
  }
}
function IntegracionComponent_div_26_div_20_th_33_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "Fecha Registro");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_20_td_34_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 74);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](2, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r92 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind2"](2, 1, file_r92.fechaRegistro, "dd/MM/yyyy HH:mm"));
  }
}
function IntegracionComponent_div_26_div_20_td_34_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 75);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "Sin fecha");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_20_td_34_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, IntegracionComponent_div_26_div_20_td_34_span_1_Template, 3, 4, "span", 72)(2, IntegracionComponent_div_26_div_20_td_34_ng_template_2_Template, 2, 0, "ng-template", null, 86, _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r92 = ctx.$implicit;
    const _r95 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", file_r92.fechaRegistro)("ngIfElse", _r95);
  }
}
function IntegracionComponent_div_26_div_20_th_36_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "Acciones");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_26_div_20_td_37_button_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "button", 92)(1, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2, "more_vert");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    const _r99 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("matMenuTriggerFor", _r99);
  }
}
function IntegracionComponent_div_26_div_20_td_37_Template(rf, ctx) {
  if (rf & 1) {
    const _r101 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, IntegracionComponent_div_26_div_20_td_37_button_1_Template, 3, 1, "button", 87);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](2, "mat-menu", null, 88)(4, "button", 89);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function IntegracionComponent_div_26_div_20_td_37_Template_button_click_4_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r101);
      const file_r97 = restoredCtx.$implicit;
      const ctx_r100 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r100.cancelarPedido(file_r97));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](5, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6, "cancel");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](7, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](8, "Cancelar");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](9, "button", 89);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function IntegracionComponent_div_26_div_20_td_37_Template_button_click_9_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r101);
      const file_r97 = restoredCtx.$implicit;
      const ctx_r102 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r102.excepcionPedido(file_r97));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](10, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](11, "warning");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](12, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](13, "Excepci\u00F3n");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](14, "button", 90);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function IntegracionComponent_div_26_div_20_td_37_Template_button_click_14_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r101);
      const file_r97 = restoredCtx.$implicit;
      const ctx_r103 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r103.eliminarPedido(file_r97));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](15, "mat-icon", 91);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](16, "delete");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](17, "span", 91);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](18, "Eliminar");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const ctx_r42 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r42.isManagerOrAdmin);
  }
}
function IntegracionComponent_div_26_div_20_tr_38_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](0, "tr", 93);
  }
}
function IntegracionComponent_div_26_div_20_tr_39_Template(rf, ctx) {
  if (rf & 1) {
    const _r106 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "tr", 94);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function IntegracionComponent_div_26_div_20_tr_39_Template_tr_click_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r106);
      const row_r104 = restoredCtx.$implicit;
      const ctx_r105 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r105.selectFile(row_r104));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
const _c0 = () => [5, 10, 25, 50];
function IntegracionComponent_div_26_div_20_mat_paginator_40_Template(rf, ctx) {
  if (rf & 1) {
    const _r108 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "mat-paginator", 95);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("page", function IntegracionComponent_div_26_div_20_mat_paginator_40_Template_mat_paginator_page_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r108);
      const ctx_r107 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r107.onPageChange($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r45 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("length", ctx_r45.totalItems)("pageSize", ctx_r45.pageSize)("pageIndex", ctx_r45.currentPage)("pageSizeOptions", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction0"](5, _c0))("showFirstLastButtons", true);
  }
}
function IntegracionComponent_div_26_div_20_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 49)(1, "table", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](2, 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](3, IntegracionComponent_div_26_div_20_th_3_Template, 2, 0, "th", 52)(4, IntegracionComponent_div_26_div_20_td_4_Template, 6, 1, "td", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](5, 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](6, IntegracionComponent_div_26_div_20_th_6_Template, 2, 0, "th", 52)(7, IntegracionComponent_div_26_div_20_td_7_Template, 4, 2, "td", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](8, 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](9, IntegracionComponent_div_26_div_20_th_9_Template, 2, 0, "th", 52)(10, IntegracionComponent_div_26_div_20_td_10_Template, 4, 2, "td", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](11, 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](12, IntegracionComponent_div_26_div_20_th_12_Template, 2, 0, "th", 52)(13, IntegracionComponent_div_26_div_20_td_13_Template, 4, 2, "td", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](14, 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](15, IntegracionComponent_div_26_div_20_th_15_Template, 2, 0, "th", 52)(16, IntegracionComponent_div_26_div_20_td_16_Template, 4, 2, "td", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](17, 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](18, IntegracionComponent_div_26_div_20_th_18_Template, 2, 0, "th", 52)(19, IntegracionComponent_div_26_div_20_td_19_Template, 4, 2, "td", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](20, 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](21, IntegracionComponent_div_26_div_20_th_21_Template, 2, 0, "th", 52)(22, IntegracionComponent_div_26_div_20_td_22_Template, 4, 2, "td", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](23, 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](24, IntegracionComponent_div_26_div_20_th_24_Template, 2, 0, "th", 52)(25, IntegracionComponent_div_26_div_20_td_25_Template, 4, 2, "td", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](26, 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](27, IntegracionComponent_div_26_div_20_th_27_Template, 2, 0, "th", 52)(28, IntegracionComponent_div_26_div_20_td_28_Template, 4, 2, "td", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](29, 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](30, IntegracionComponent_div_26_div_20_th_30_Template, 2, 0, "th", 52)(31, IntegracionComponent_div_26_div_20_td_31_Template, 4, 2, "td", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](32, 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](33, IntegracionComponent_div_26_div_20_th_33_Template, 2, 0, "th", 52)(34, IntegracionComponent_div_26_div_20_td_34_Template, 4, 2, "td", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](35, 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](36, IntegracionComponent_div_26_div_20_th_36_Template, 2, 0, "th", 52)(37, IntegracionComponent_div_26_div_20_td_37_Template, 19, 1, "td", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](38, IntegracionComponent_div_26_div_20_tr_38_Template, 1, 0, "tr", 65)(39, IntegracionComponent_div_26_div_20_tr_39_Template, 1, 0, "tr", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](40, IntegracionComponent_div_26_div_20_mat_paginator_40_Template, 1, 6, "mat-paginator", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("dataSource", ctx_r12.paginatedFiles);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](37);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("matHeaderRowDef", ctx_r12.filesDisplayedColumns);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("matRowDefColumns", ctx_r12.filesDisplayedColumns);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", !ctx_r12.filesLoading && ctx_r12.totalItems > 0);
  }
}
function IntegracionComponent_div_26_div_21_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 96)(1, "mat-icon", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2, "folder_open");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "p", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](4, "No se encontraron pedidos en estatus de integraci\u00F3n para este cliente");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
}
function IntegracionComponent_div_26_div_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r110 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 96)(1, "mat-icon", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2, "search_off");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "p", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](4, "No se encontraron pedidos que coincidan con la b\u00FAsqueda");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](5, "button", 97);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function IntegracionComponent_div_26_div_22_Template_button_click_5_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r110);
      const ctx_r109 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r109.clearOrderSearch());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6, " Limpiar b\u00FAsqueda ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
}
function IntegracionComponent_div_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r112 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 32)(1, "mat-card", 2)(2, "mat-card-header", 25)(3, "mat-card-title", 33)(4, "div", 34)(5, "mat-icon", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6, "description");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](7, " Pedidos en Integraci\u00F3n ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](8, IntegracionComponent_div_26_button_8_Template, 3, 0, "button", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](9, "div", 37)(10, "div", 13)(11, "mat-form-field", 11)(12, "mat-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](13, "Buscar pedido");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](14, "input", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("ngModelChange", function IntegracionComponent_div_26_Template_input_ngModelChange_14_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r112);
      const ctx_r111 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r111.orderSearchTerm = $event);
    })("input", function IntegracionComponent_div_26_Template_input_input_14_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r112);
      const ctx_r113 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r113.onOrderSearchChange());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](15, "mat-icon", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](16, "search");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](17, IntegracionComponent_div_26_button_17_Template, 3, 0, "button", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](18, "mat-card-content", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](19, IntegracionComponent_div_26_div_19_Template, 2, 0, "div", 41)(20, IntegracionComponent_div_26_div_20_Template, 41, 4, "div", 42)(21, IntegracionComponent_div_26_div_21_Template, 5, 0, "div", 43)(22, IntegracionComponent_div_26_div_22_Template, 7, 0, "div", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r4.isManagerOrAdmin);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngModel", ctx_r4.orderSearchTerm);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r4.orderSearchTerm);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r4.filesLoading);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", !ctx_r4.filesLoading);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", !ctx_r4.filesLoading && ctx_r4.files.length === 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", !ctx_r4.filesLoading && ctx_r4.files.length > 0 && ctx_r4.filteredFiles.length === 0);
  }
}
function IntegracionComponent_div_27_div_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](1, "mat-spinner", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function IntegracionComponent_div_27_div_13_div_1_div_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 120);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](2, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const document_r118 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" Vencimiento: ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind2"](2, 1, document_r118.expirationDate, "dd/MM/yyyy"), " ");
  }
}
function IntegracionComponent_div_27_div_13_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r123 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 106)(1, "div", 107)(2, "mat-icon", 108);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "div", 109)(5, "div", 110);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](7, IntegracionComponent_div_27_div_13_div_1_div_7_Template, 3, 4, "div", 111);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](8, "div", 112)(9, "div", 113)(10, "input", 114, 115);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("change", function IntegracionComponent_div_27_div_13_div_1_Template_input_change_10_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r123);
      const document_r118 = restoredCtx.$implicit;
      const ctx_r122 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r122.onFileSelected($event, document_r118.documentId));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](12, "button", 116);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function IntegracionComponent_div_27_div_13_div_1_Template_button_click_12_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r123);
      const _r120 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](11);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](_r120.click());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](13, "mat-icon", 117);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](14, "attach_file");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](15);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](16, "button", 118);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function IntegracionComponent_div_27_div_13_div_1_Template_button_click_16_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r123);
      const document_r118 = restoredCtx.$implicit;
      const ctx_r125 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r125.uploadDocument(document_r118));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](17, "mat-icon", 117);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](18, "upload");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](19);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](20, "button", 119);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function IntegracionComponent_div_27_div_13_div_1_Template_button_click_20_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r123);
      const document_r118 = restoredCtx.$implicit;
      const ctx_r126 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r126.viewDocument(document_r118));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](21, "mat-icon", 117);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](22, "visibility");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](23, " VER ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const document_r118 = ctx.$implicit;
    const ctx_r117 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵclassMap"](ctx_r117.getDocumentStatusColor(document_r118.status, document_r118.idCurrentStatus));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", ctx_r117.getDocumentStatusIcon(document_r118.status, document_r118.idCurrentStatus), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](document_r118.documentName);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", document_r118.hasExpiration === "1" && document_r118.expirationDate);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("id", "file-" + document_r118.documentId);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("disabled", document_r118.idCurrentStatus === "3" || document_r118.idCurrentStatus === "4");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", ctx_r117.selectedFiles[document_r118.documentId] ? ctx_r117.selectedFiles[document_r118.documentId].name : document_r118.idCurrentStatus === "2" ? "Reemplazar archivo" : "Seleccionar archivo", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("disabled", !ctx_r117.selectedFiles[document_r118.documentId] || document_r118.idCurrentStatus === "3" || document_r118.idCurrentStatus === "4");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", document_r118.idCurrentStatus === "2" ? "REEMPLAZAR" : "CARGAR", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("disabled", !document_r118.documentContainer);
  }
}
function IntegracionComponent_div_27_div_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 104);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, IntegracionComponent_div_27_div_13_div_1_Template, 24, 11, "div", 105);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r115 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx_r115.requiredDocuments);
  }
}
function IntegracionComponent_div_27_div_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 96)(1, "mat-icon", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2, "folder_open");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "p", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](4, "No se encontraron documentos requeridos para este pedido");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
}
function IntegracionComponent_div_27_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 98)(1, "mat-card", 2)(2, "mat-card-header", 25)(3, "mat-card-title", 99)(4, "div", 100)(5, "mat-icon", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6, "folder");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](7, "span", 101);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](8, "Documentos Requeridos");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](9, "div", 102);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](11, "mat-card-content", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](12, IntegracionComponent_div_27_div_12_Template, 2, 0, "div", 41)(13, IntegracionComponent_div_27_div_13_Template, 2, 1, "div", 103)(14, IntegracionComponent_div_27_div_14_Template, 5, 0, "div", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate8"](" Pedido ", ctx_r5.selectedFile.numeroPedido, " \u2022 ", ctx_r5.selectedFile.proceso, " \u2022 ", ctx_r5.selectedFile.operacion, " \u2022 ", ctx_r5.selectedFile.tipoCliente, " \u2022 ", ctx_r5.selectedFile.modelo, " ", ctx_r5.selectedFile.vehiculo, " ", ctx_r5.selectedFile.year, " \u2022 VIN: ", ctx_r5.selectedFile.vin, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r5.documentsLoading);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", !ctx_r5.documentsLoading);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", !ctx_r5.documentsLoading && ctx_r5.requiredDocuments.length === 0);
  }
}
class IntegracionComponent {
  // Headers para Backblaze
  getBackblazeHeaders() {
    return {
      'X-Provider-Token': _environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.backblaze.providerToken
    };
  }
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
    this.selectedAgency = null;
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
    // Paginación y búsqueda de pedidos
    this.orderSearchTerm = '';
    this.filteredFiles = [];
    this.paginatedFiles = [];
    this.pageSize = 5;
    this.currentPage = 0;
    this.totalItems = 0;
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
    this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_5__.Subject();
  }
  ngOnInit() {
    console.log('🚀 IntegracionComponent inicializado');
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
    this.defaultAgencyService.obtenerAgencias().pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_6__.takeUntil)(this.destroy$)).subscribe({
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
    // Encontrar y guardar el objeto agencia completo
    this.selectedAgency = this.agencies.find(agency => agency.Id === agencyId) || null;
    // Aquí puedes agregar lógica adicional cuando cambie la agencia seleccionada
    console.log('Selected agency:', agencyId, 'Agency object:', this.selectedAgency);
  }
  clearAgencyFilter() {
    this.selectedAgencyId = null;
    this.selectedAgency = null;
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
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_7__.HttpParams();
    params = params.set('id', this.selectedAgencyId.toString());
    params = params.set('search', this.clientSearchTerm.trim());
    params = params.set('limit', '50');
    this.http.get(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiBaseUrl}/api/client/search`, {
      params
    }).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_6__.takeUntil)(this.destroy$)).subscribe({
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
            // Sin resultados en el sistema local, buscar en Vanguardia
            this.searchClientInVanguardia();
          }
        } else {
          // Sin resultados en el sistema local, buscar en Vanguardia
          this.searchClientInVanguardia();
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
  searchClientInVanguardia() {
    console.log('🔍 Buscando cliente en Vanguardia...');
    // Verificar que tenemos la agencia seleccionada
    if (!this.selectedAgency || !this.selectedAgency.IdAgency) {
      this.snackBar.open('Error: No se encontró la información de IdAgency de la agencia seleccionada', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_7__.HttpParams();
    params = params.set('idAgency', this.selectedAgency.IdAgency);
    params = params.set('ndDMS', this.clientSearchTerm.trim());
    this.http.get(_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.vanguardia.apiUrl, {
      params,
      headers: this.getBackblazeHeaders()
    }).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_6__.takeUntil)(this.destroy$)).subscribe({
      next: response => {
        console.log('🔍 Cliente encontrado en Vanguardia:', response);
        if (response && response.success && response.data) {
          // Convertir respuesta de Vanguardia al formato esperado
          const vanguardiaClient = {
            ndCliente: response.data.ndCliente || response.data.id,
            cliente: response.data.cliente || response.data.nombre || response.data.name,
            rfc: response.data.rfc || '',
            email: response.data.email || '',
            telefono: response.data.telefono || response.data.phone || '',
            direccion: response.data.direccion || response.data.address || '',
            // Marcar como cliente de Vanguardia para referencia
            isVanguardiaClient: true,
            vanguardiaData: response.data
          };
          this.clients = [vanguardiaClient];
          this.selectClient(vanguardiaClient);
          this.snackBar.open(`Cliente encontrado en Vanguardia: ${vanguardiaClient.cliente}`, 'Cerrar', {
            duration: 3000
          });
        } else {
          this.clients = [];
          this.showClientResults = true;
          this.snackBar.open('Cliente no encontrado en el sistema ni en Vanguardia', 'Cerrar', {
            duration: 3000
          });
        }
      },
      error: error => {
        console.error('❌ Error buscando cliente en Vanguardia:', error);
        this.clients = [];
        this.showClientResults = true;
        let errorMessage = 'Error desconocido al buscar en Vanguardia';
        if (error.status === 0) {
          errorMessage = 'Error de CORS: No se puede conectar con el servidor de Vanguardia.';
        } else if (error.status === 400) {
          errorMessage = 'Error 400: Solicitud inválida a Vanguardia.';
        } else if (error.status === 401) {
          errorMessage = 'Error 401: Token de autenticación inválido para Vanguardia.';
        } else if (error.status === 403) {
          errorMessage = 'Error 403: Acceso denegado a Vanguardia.';
        } else if (error.status === 404) {
          errorMessage = 'Error 404: Endpoint de Vanguardia no encontrado.';
        } else if (error.status === 500) {
          errorMessage = 'Error 500: Error interno del servidor de Vanguardia.';
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        this.snackBar.open(`Error buscando en Vanguardia: ${errorMessage}`, 'Cerrar', {
          duration: 5000
        });
      }
    });
  }
  clearClientSearch() {
    this.clientSearchTerm = '';
    this.clients = [];
    this.showClientResults = false;
    this.selectedClient = null;
    // Limpiar documentos requeridos cuando se limpia la búsqueda de cliente
    this.requiredDocuments = [];
    this.selectedFile = null;
    this.selectedFiles = {};
  }
  selectClient(client) {
    console.log('Cliente seleccionado:', client);
    this.selectedClient = client;
    this.showClientResults = false; // Ocultar resultados después de seleccionar
    this.clientSearchTerm = ''; // Limpiar el campo de búsqueda
    // Limpiar documentos requeridos al cambiar de cliente
    this.requiredDocuments = [];
    this.selectedFile = null;
    this.selectedFiles = {};
    // Limpiar búsqueda y paginación de pedidos
    this.orderSearchTerm = '';
    this.currentPage = 0;
    // Cargar automáticamente los pedidos de integración del cliente seleccionado
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
    // Limpiar documentos requeridos cuando se limpia la selección de cliente
    this.requiredDocuments = [];
    this.selectedFile = null;
    this.selectedFiles = {};
    // Limpiar búsqueda y paginación
    this.orderSearchTerm = '';
    this.currentPage = 0;
    this.updateFilesDisplay();
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
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_7__.HttpParams();
    params = params.set('agencyId', this.selectedAgency.IdAgency);
    params = params.set('ndCliente', this.selectedClient.ndCliente);
    params = params.set('statusId', '1'); // ID para Integración
    // Cargar solo pedidos que ya están en la tabla de file (no desde Vanguardia)
    this.http.get(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiBaseUrl}/api/files/by-agency`, {
      params
    }).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_6__.takeUntil)(this.destroy$)).subscribe({
      next: response => {
        console.log('📁 Files encontrados en tabla file:', response);
        if (response && response.success && response.data && response.data.files) {
          this.files = response.data.files;
        } else {
          this.files = [];
        }
        this.updateFilesDisplay();
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
    console.log('🚀 Iniciando proceso de agregar pedidos...');
    console.log('📊 Cliente seleccionado:', this.selectedClient);
    console.log('📊 Agencia seleccionada:', this.selectedAgency);
    // Verificar que tenemos cliente y agencia seleccionados
    if (!this.selectedClient || !this.selectedClient.ndCliente) {
      console.log('❌ No hay cliente seleccionado');
      this.snackBar.open('Debe seleccionar un cliente primero', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    if (!this.selectedAgency || !this.selectedAgency.IdAgency) {
      console.log('❌ No hay agencia seleccionada');
      this.snackBar.open('Debe seleccionar una agencia primero', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    console.log('✅ Validaciones pasadas, cargando pedidos desde Vanguardia...');
    // Llamar al API de Vanguardia para obtener pedidos
    this.loadOrdersFromVanguardia();
  }
  // MÉTODO TEMPORAL PARA PRUEBAS
  testOrderDialog() {
    console.log('🧪 Probando diálogo con datos de prueba...');
    const testOrders = [{
      numeroPedido: 'TEST-001',
      numeroInventario: 'INV-001',
      proceso: 'Integración',
      operacion: 'Venta',
      tipoCliente: 'Individual',
      vehiculo: 'Sedán',
      year: '2024',
      modelo: 'Modelo Test',
      vin: 'VIN123456789',
      agencia: 'Agencia Test',
      fechaRegistro: new Date(),
      fileId: 'file-test-1',
      isVanguardiaOrder: true
    }, {
      numeroPedido: 'TEST-002',
      numeroInventario: 'INV-002',
      proceso: 'Integración',
      operacion: 'Compra',
      tipoCliente: 'Empresarial',
      vehiculo: 'SUV',
      year: '2024',
      modelo: 'Modelo Test 2',
      vin: 'VIN987654321',
      agencia: 'Agencia Test',
      fechaRegistro: new Date(),
      fileId: 'file-test-2',
      isVanguardiaOrder: true
    }];
    this.showOrderSelectionDialog(testOrders);
  }
  loadOrdersFromVanguardia() {
    console.log('🔍 Cargando pedidos desde Vanguardia...');
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_7__.HttpParams();
    params = params.set('customerDMS', this.selectedClient.ndCliente);
    params = params.set('idAgency', this.selectedAgency.IdAgency);
    params = params.set('perpage', '1000'); // Traer todos los registros de una vez
    this.http.get(_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.vanguardia.ordersApiUrl, {
      params,
      headers: this.getBackblazeHeaders()
    }).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_6__.takeUntil)(this.destroy$)).subscribe({
      next: response => {
        console.log('🔍 Respuesta completa de Vanguardia:', response);
        // Verificar diferentes estructuras de respuesta posibles
        let ordersData = null;
        if (response && response.success && response.data) {
          // Estructura estándar: { success: true, data: [...] }
          ordersData = response.data;
        } else if (response && response.status === 200 && response.data) {
          // Estructura de Vanguardia: { status: 200, message: "...", data: [...] }
          console.log('📊 Detectada estructura de Vanguardia, data:', response.data);
          // Verificar si data contiene un array de pedidos
          if (Array.isArray(response.data)) {
            console.log('✅ Data es array directo, cantidad:', response.data.length);
            ordersData = response.data;
          } else if (response.data && Array.isArray(response.data.orders)) {
            console.log('✅ Data contiene orders, cantidad:', response.data.orders.length);
            ordersData = response.data.orders;
          } else if (response.data && Array.isArray(response.data.data)) {
            console.log('✅ Data contiene data, cantidad:', response.data.data.length);
            console.log('📊 Total de registros disponibles:', response.data.total_rows);
            ordersData = response.data.data;
          } else if (response.data && Array.isArray(response.data.results)) {
            console.log('✅ Data contiene results, cantidad:', response.data.results.length);
            ordersData = response.data.results;
          } else {
            console.log('⚠️ Data es objeto único, convirtiendo a array');
            ordersData = [response.data];
          }
        } else if (response && Array.isArray(response)) {
          // Estructura directa: [...]
          ordersData = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          // Estructura con data directa: { data: [...] }
          ordersData = response.data;
        } else if (response && response.orders && Array.isArray(response.orders)) {
          // Estructura con orders: { orders: [...] }
          ordersData = response.orders;
        } else if (response && response.results && Array.isArray(response.results)) {
          // Estructura con results: { results: [...] }
          ordersData = response.results;
        }
        if (ordersData && Array.isArray(ordersData) && ordersData.length > 0) {
          console.log('📁 Datos de pedidos encontrados:', ordersData);
          console.log('📊 Cantidad total de pedidos:', ordersData.length);
          // Mostrar directamente el diálogo con todos los datos
          this.showOrderSelectionDialogDirectly(ordersData);
          this.snackBar.open(`${ordersData.length} pedidos encontrados en Vanguardia`, 'Cerrar', {
            duration: 3000
          });
        } else {
          console.log('⚠️ No se encontraron pedidos válidos en la respuesta:', response);
          this.snackBar.open('No se encontraron pedidos en Vanguardia para este cliente', 'Cerrar', {
            duration: 3000
          });
        }
      },
      error: error => {
        console.error('❌ Error cargando pedidos desde Vanguardia:', error);
        let errorMessage = 'Error desconocido al cargar pedidos desde Vanguardia';
        if (error.status === 0) {
          errorMessage = 'Error de CORS: No se puede conectar con el servidor de Vanguardia.';
        } else if (error.status === 400) {
          errorMessage = 'Error 400: Solicitud inválida a Vanguardia.';
        } else if (error.status === 401) {
          errorMessage = 'Error 401: Token de autenticación inválido para Vanguardia.';
        } else if (error.status === 403) {
          errorMessage = 'Error 403: Acceso denegado a Vanguardia.';
        } else if (error.status === 404) {
          errorMessage = 'Error 404: Endpoint de Vanguardia no encontrado.';
        } else if (error.status === 500) {
          errorMessage = 'Error 500: Error interno del servidor de Vanguardia.';
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        this.snackBar.open(`Error cargando pedidos: ${errorMessage}`, 'Cerrar', {
          duration: 5000
        });
      }
    });
  }
  processVanguardiaOrders(ordersData) {
    console.log('🔄 Iniciando procesamiento de pedidos de Vanguardia...');
    console.log('📊 Datos recibidos para procesar:', ordersData);
    console.log('📊 Tipo de datos:', typeof ordersData);
    console.log('📊 Es array?', Array.isArray(ordersData));
    // Convertir los pedidos de Vanguardia al formato esperado por el sistema
    let processedOrders = [];
    if (Array.isArray(ordersData)) {
      console.log('📋 Procesando array de pedidos, cantidad:', ordersData.length);
      processedOrders = ordersData.map((order, index) => {
        console.log(`📋 Procesando pedido ${index + 1}:`, order);
        return {
          numeroPedido: order.numeroPedido || order.orderNumber || order.id || `PED-${index + 1}`,
          numeroInventario: order.numeroInventario || order.inventoryNumber || '',
          proceso: order.proceso || order.process || 'Integración',
          operacion: order.operacion || order.operation || '',
          tipoCliente: order.tipoCliente || order.clientType || '',
          vehiculo: order.vehiculo || order.vehicle || '',
          year: order.year || order.year || '',
          modelo: order.modelo || order.model || '',
          vin: order.vin || order.vin || '',
          agencia: order.agencia || order.agency || this.selectedAgency?.Name || 'Sin agencia',
          fechaRegistro: order.fechaRegistro || order.registrationDate || new Date(),
          fileId: order.fileId || order.id || `file-${index + 1}`,
          // Marcar como pedido de Vanguardia
          isVanguardiaOrder: true,
          vanguardiaData: order
        };
      });
    } else if (ordersData && typeof ordersData === 'object') {
      console.log('📋 Procesando objeto único:', ordersData);
      // Si es un solo pedido
      processedOrders = [{
        numeroPedido: ordersData.numeroPedido || ordersData.orderNumber || ordersData.id || 'PED-1',
        numeroInventario: ordersData.numeroInventario || ordersData.inventoryNumber || '',
        proceso: ordersData.proceso || ordersData.process || 'Integración',
        operacion: ordersData.operacion || ordersData.operation || '',
        tipoCliente: ordersData.tipoCliente || ordersData.clientType || '',
        vehiculo: ordersData.vehiculo || ordersData.vehicle || '',
        year: ordersData.year || ordersData.year || '',
        modelo: ordersData.modelo || ordersData.model || '',
        vin: ordersData.vin || ordersData.vin || '',
        agencia: ordersData.agencia || ordersData.agency || this.selectedAgency?.Name || 'Sin agencia',
        fechaRegistro: ordersData.fechaRegistro || ordersData.registrationDate || new Date(),
        fileId: ordersData.fileId || ordersData.id || 'file-1',
        // Marcar como pedido de Vanguardia
        isVanguardiaOrder: true,
        vanguardiaData: ordersData
      }];
    } else {
      console.error('❌ Datos de pedidos no válidos:', ordersData);
      this.snackBar.open('Error: Formato de datos de pedidos no válido', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    console.log('✅ Pedidos procesados exitosamente:', processedOrders);
    console.log('📊 Cantidad de pedidos procesados:', processedOrders.length);
    // Cargar pedidos existentes en file para comparar
    this.loadClientFilesForComparison(processedOrders);
  }
  loadClientFilesForComparison(vanguardiaOrders) {
    console.log('🔄 Iniciando comparación con pedidos existentes...');
    console.log('📊 Pedidos de Vanguardia recibidos:', vanguardiaOrders);
    console.log('📊 Cliente seleccionado:', this.selectedClient);
    if (!this.selectedClient || !this.selectedClient.ndCliente) {
      console.log('⚠️ No hay cliente seleccionado, mostrando todos los pedidos de Vanguardia');
      // Si no hay cliente seleccionado, mostrar todos los pedidos de Vanguardia
      this.showOrderSelectionDialog(vanguardiaOrders);
      return;
    }
    console.log('🔍 Cliente seleccionado:', this.selectedClient.ndCliente);
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_7__.HttpParams();
    params = params.set('agencyId', this.selectedAgency.IdAgency);
    params = params.set('ndCliente', this.selectedClient.ndCliente);
    params = params.set('statusId', '1'); // ID para Integración
    console.log('🌐 Consultando API de files existentes...');
    this.http.get(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiBaseUrl}/api/files/by-agency`, {
      params
    }).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_6__.takeUntil)(this.destroy$)).subscribe({
      next: response => {
        console.log('📁 Respuesta de files existentes:', response);
        let existingFiles = [];
        if (response && response.success && response.data && response.data.files) {
          existingFiles = response.data.files;
        }
        console.log('📊 Files existentes encontrados:', existingFiles);
        console.log('📊 Cantidad de files existentes:', existingFiles.length);
        // Filtrar pedidos de Vanguardia que no existen en la tabla de file
        const newOrders = this.filterNewOrders(vanguardiaOrders, existingFiles);
        console.log('📊 Pedidos nuevos después del filtrado:', newOrders);
        console.log('📊 Cantidad de pedidos nuevos:', newOrders.length);
        if (newOrders.length > 0) {
          console.log('✅ Hay pedidos nuevos, mostrando diálogo...');
          this.showOrderSelectionDialog(newOrders);
        } else {
          console.log('ℹ️ No hay pedidos nuevos, todos ya existen');
          this.snackBar.open('Todos los pedidos de Vanguardia ya existen en el sistema', 'Cerrar', {
            duration: 3000
          });
          // Cargar pedidos existentes en la tabla
          this.loadClientFiles();
        }
      },
      error: error => {
        console.error('❌ Error cargando files para comparación:', error);
        console.log('⚠️ Error en comparación, mostrando todos los pedidos de Vanguardia');
        // Si hay error, mostrar todos los pedidos de Vanguardia
        this.showOrderSelectionDialog(vanguardiaOrders);
      }
    });
  }
  filterNewOrders(vanguardiaOrders, existingFiles) {
    // Crear un Set con los números de pedido existentes para búsqueda rápida
    const existingOrderNumbers = new Set(existingFiles.map(file => file.numeroPedido?.toString().toLowerCase()));
    // Filtrar pedidos de Vanguardia que no existen en la tabla de file
    return vanguardiaOrders.filter(order => {
      const orderNumber = order.numeroPedido?.toString().toLowerCase();
      return !existingOrderNumbers.has(orderNumber);
    });
  }
  showOrderSelectionDialogDirectly(apiOrders) {
    console.log('🎯 Mostrando diálogo directamente con datos del API...');
    console.log('📊 Datos originales del API:', apiOrders);
    console.log('📊 Cantidad de pedidos:', apiOrders?.length || 0);
    console.log('📊 Primer pedido (ejemplo):', apiOrders?.[0]);
    if (!apiOrders || apiOrders.length === 0) {
      console.error('❌ No hay pedidos del API para mostrar');
      this.snackBar.open('No hay pedidos disponibles para mostrar', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    console.log('✅ Datos válidos, verificando pedidos existentes antes de mostrar diálogo...');
    // Verificar qué pedidos ya existen en la base de datos
    this.checkExistingOrders(apiOrders);
  }
  checkExistingOrders(apiOrders) {
    console.log('🔍 Verificando pedidos existentes en la base de datos...');
    const requestData = {
      orders: apiOrders,
      agencyId: this.selectedAgencyId
    };
    this.http.post(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiBaseUrl}/api/files/check-existing-orders`, requestData).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_6__.takeUntil)(this.destroy$)).subscribe({
      next: response => {
        console.log('✅ Respuesta de verificación de pedidos:', response);
        if (response.success && response.data) {
          const {
            existingOrders,
            newOrders,
            existingCount,
            newCount
          } = response.data;
          console.log(`📊 Resultado: ${existingCount} pedidos existentes, ${newCount} pedidos nuevos`);
          if (existingCount > 0) {
            console.log('📋 Pedidos existentes:', existingOrders);
            this.snackBar.open(`${existingCount} pedidos ya existen en el sistema. Se mostrarán solo los ${newCount} pedidos nuevos.`, 'Cerrar', {
              duration: 4000
            });
          }
          if (newOrders.length === 0) {
            console.log('ℹ️ No hay pedidos nuevos para mostrar');
            this.snackBar.open('Todos los pedidos de Vanguardia ya existen en el sistema', 'Cerrar', {
              duration: 3000
            });
            return;
          }
          // Mostrar solo los pedidos nuevos en el diálogo
          this.openOrderSelectionDialog(newOrders);
        } else {
          console.error('❌ Error en la respuesta de verificación:', response);
          this.snackBar.open('Error al verificar pedidos existentes', 'Cerrar', {
            duration: 3000
          });
        }
      },
      error: error => {
        console.error('❌ Error verificando pedidos existentes:', error);
        this.snackBar.open('Error al verificar pedidos existentes', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }
  openOrderSelectionDialog(orders) {
    console.log('🚀 Abriendo diálogo con pedidos filtrados:', orders.length, 'pedidos nuevos');
    try {
      const dialogRef = this.dialog.open(_order_selection_dialog_component__WEBPACK_IMPORTED_MODULE_2__.OrderSelectionDialogComponent, {
        width: 'auto',
        height: 'auto',
        maxWidth: '90vw',
        maxHeight: '80vh',
        data: {
          orders: orders,
          agencyId: this.selectedAgencyId,
          ndCliente: this.selectedClient?.ndCliente
        }
      });
      console.log('✅ Diálogo abierto exitosamente');
      dialogRef.afterClosed().subscribe(result => {
        console.log('🔚 Diálogo cerrado, resultado:', result);
        if (result && result.length > 0) {
          console.log('✅ Pedidos seleccionados:', result);
          // Procesar los pedidos seleccionados antes de agregarlos
          const processedOrders = this.processSelectedOrders(result);
          this.addSelectedOrdersToTable(processedOrders);
          this.snackBar.open(`${result.length} pedidos agregados exitosamente`, 'Cerrar', {
            duration: 3000
          });
        } else {
          console.log('❌ Diálogo cancelado o sin selección');
          // Si se canceló el diálogo, cargar pedidos existentes
          this.loadClientFiles();
        }
      });
    } catch (error) {
      console.error('❌ Error abriendo diálogo:', error);
      this.snackBar.open('Error al abrir el diálogo de selección', 'Cerrar', {
        duration: 3000
      });
    }
  }
  showOrderSelectionDialog(orders) {
    console.log('🎯 Intentando mostrar diálogo de selección de pedidos...');
    console.log('📊 Pedidos para mostrar en diálogo:', orders);
    console.log('📊 Cantidad de pedidos:', orders?.length || 0);
    if (!orders || orders.length === 0) {
      console.error('❌ No hay pedidos para mostrar en el diálogo');
      this.snackBar.open('No hay pedidos disponibles para mostrar', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    try {
      console.log('🚀 Abriendo diálogo de selección...');
      const dialogRef = this.dialog.open(_order_selection_dialog_component__WEBPACK_IMPORTED_MODULE_2__.OrderSelectionDialogComponent, {
        width: 'auto',
        height: 'auto',
        maxWidth: '90vw',
        maxHeight: '80vh',
        data: {
          orders: orders,
          agencyId: this.selectedAgencyId,
          ndCliente: this.selectedClient?.ndCliente
        }
      });
      console.log('✅ Diálogo abierto exitosamente');
      dialogRef.afterClosed().subscribe(result => {
        console.log('🔚 Diálogo cerrado, resultado:', result);
        if (result && result.success) {
          // File creado exitosamente
          console.log('✅ File creado exitosamente:', result);
          this.snackBar.open(`File creado exitosamente con ${result.documentsCreated} documentos`, 'Cerrar', {
            duration: 5000
          });
          // Recargar los files del cliente para mostrar el nuevo file
          this.loadClientFiles();
        } else if (result && result.success === false) {
          // Error al crear el file
          console.error('❌ Error al crear file:', result.message);
          this.snackBar.open(`Error: ${result.message}`, 'Cerrar', {
            duration: 5000
          });
        } else if (result && result.length > 0) {
          // Formato anterior (pedidos seleccionados directamente)
          console.log('✅ Pedidos seleccionados:', result);
          this.addSelectedOrdersToTable(result);
          this.snackBar.open(`${result.length} pedidos agregados exitosamente`, 'Cerrar', {
            duration: 3000
          });
        } else {
          // Diálogo cancelado
          console.log('❌ Diálogo cancelado o sin selección');
          this.loadClientFiles();
        }
      });
    } catch (error) {
      console.error('❌ Error abriendo diálogo:', error);
      this.snackBar.open('Error al abrir el diálogo de selección', 'Cerrar', {
        duration: 3000
      });
    }
  }
  processSelectedOrders(selectedOrders) {
    console.log('🔄 Procesando pedidos seleccionados...');
    console.log('📊 Pedidos seleccionados:', selectedOrders);
    return selectedOrders.map((order, index) => {
      console.log(`📋 Procesando pedido seleccionado ${index + 1}:`, order);
      return {
        numeroPedido: order.numeroPedido || order.orderNumber || order.id || `PED-${index + 1}`,
        numeroInventario: order.numeroInventario || order.inventoryNumber || '',
        proceso: order.proceso || order.process || 'Integración',
        operacion: order.operacion || order.operation || '',
        tipoCliente: order.tipoCliente || order.clientType || '',
        vehiculo: order.vehiculo || order.vehicle || '',
        year: order.year || order.year || '',
        modelo: order.modelo || order.model || '',
        vin: order.vin || order.vin || '',
        agencia: order.agencia || order.agency || this.selectedAgency?.Name || 'Sin agencia',
        fechaRegistro: order.fechaRegistro || order.registrationDate || new Date(),
        fileId: order.fileId || order.id || `file-${index + 1}`,
        // Marcar como pedido de Vanguardia
        isVanguardiaOrder: true,
        vanguardiaData: order
      };
    });
  }
  addSelectedOrdersToTable(selectedOrders) {
    console.log('📁 Agregando pedidos seleccionados a la tabla...');
    console.log('📊 Pedidos a agregar:', selectedOrders);
    // Recargar los pedidos desde el servidor para obtener la lista actualizada sin duplicados
    this.loadClientFiles();
  }
  // Métodos para manejo de documentos
  selectFile(file) {
    this.selectedFile = file;
    this.loadRequiredDocuments(file.fileId); // Usar fileId en lugar de numeroPedido
  }

  loadRequiredDocuments(fileId) {
    this.documentsLoading = true;
    this.requiredDocuments = [];
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_7__.HttpParams();
    params = params.set('fileId', fileId);
    params = params.set('idProcessType', '1'); // Filtro por integración usando ID = 1
    this.http.get(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiBaseUrl}/api/documents/required`, {
      params
    }).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_6__.takeUntil)(this.destroy$)).subscribe({
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
    // Mostrar mensaje diferente si se está reemplazando
    const isReplacing = document.idCurrentStatus === '2';
    const actionText = isReplacing ? 'reemplazando' : 'cargando';
    // Preparar datos para Backblaze según documentación API
    const formData = new FormData();
    formData.append('file', this.selectedFiles[document.documentId]); // File: Archivo a subir
    formData.append('idSingleFile', this.selectedFile.fileId.toString()); // Integer: ID del archivo en tabla (IdFile)
    formData.append('idDocumentFile', document.documentId.toString()); // Integer: ID del documento (IdDocumentByFile)
    // Usar API de Backblaze con header de autenticación
    this.http.post(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.backblaze.apiUrl}/upload`, formData, {
      headers: this.getBackblazeHeaders()
    }).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_6__.takeUntil)(this.destroy$)).subscribe({
      next: response => {
        console.log('📤 Documento subido a Backblaze:', response);
        // Guardar información del archivo en Backblaze en la base de datos local
        this.saveDocumentInfo(document, response);
        this.snackBar.open(`Documento ${document.documentName} ${actionText} exitosamente`, 'Cerrar', {
          duration: 3000
        });
        // Recargar documentos
        this.loadRequiredDocuments(this.selectedFile.fileId);
        // Limpiar archivo seleccionado
        delete this.selectedFiles[document.documentId];
      },
      error: error => {
        console.error('❌ Error subiendo documento a Backblaze:', error);
        let errorMessage = 'Error desconocido';
        if (error.status === 0) {
          errorMessage = 'Error de CORS: No se puede conectar con el servidor de Backblaze. Verifique la configuración del servidor.';
        } else if (error.status === 400) {
          errorMessage = 'Error 400: Solicitud inválida. Verifique los parámetros enviados.';
        } else if (error.status === 401) {
          errorMessage = 'Error 401: Token de autenticación inválido.';
        } else if (error.status === 403) {
          errorMessage = 'Error 403: Acceso denegado.';
        } else if (error.status === 404) {
          errorMessage = 'Error 404: Endpoint no encontrado.';
        } else if (error.status === 500) {
          errorMessage = 'Error 500: Error interno del servidor.';
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        this.snackBar.open(`Error subiendo documento: ${errorMessage}`, 'Cerrar', {
          duration: 8000
        });
      }
    });
  }
  saveDocumentInfo(document, backblazeResponse) {
    const documentData = {
      fileId: this.selectedFile.fileId,
      documentTypeId: document.documentId,
      fileName: backblazeResponse.fileName || this.selectedFiles[document.documentId].name,
      filePath: backblazeResponse.filePath,
      backblazeFileId: backblazeResponse.fileId,
      backblazeUrl: backblazeResponse.url,
      uploadDate: new Date().toISOString(),
      status: 'uploaded'
    };
    this.http.post(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiBaseUrl}/api/documents/save-backblaze-info`, documentData).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_6__.takeUntil)(this.destroy$)).subscribe({
      next: response => {
        console.log('📝 Información del documento guardada:', response);
      },
      error: error => {
        console.error('❌ Error guardando información del documento:', error);
      }
    });
  }
  viewDocument(document) {
    console.log('🖱️ CLICK EN BOTÓN VER - viewDocument ejecutándose');
    console.log('🔍 viewDocument llamado con:', document);
    if (document.documentContainer) {
      console.log('📁 Usando documentContainer:', document.documentContainer);
      // Usar documentContainer para obtener URL privada de Backblaze
      this.getBackblazePrivateUrl(document.documentContainer, document);
    } else {
      console.log('❌ No hay documentContainer disponible');
      this.snackBar.open('No se puede visualizar el documento', 'Cerrar', {
        duration: 3000
      });
    }
  }
  getBackblazePrivateUrl(fileName, document) {
    console.log('🔍 getBackblazePrivateUrl llamado con:', {
      fileName,
      document
    });
    const duration = 3600; // 1 hora por defecto
    const params = new URLSearchParams({
      file: fileName,
      duration: duration.toString()
    });
    const url = `${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.backblaze.apiUrl}/get-private-url?${params.toString()}`;
    console.log('🔗 URL completa:', url);
    console.log('🔑 Headers:', this.getBackblazeHeaders());
    this.http.get(url, {
      headers: this.getBackblazeHeaders()
    }).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_6__.takeUntil)(this.destroy$)).subscribe({
      next: response => {
        console.log('🔗 URL privada obtenida:', response);
        if (response.data && response.data.url) {
          console.log('🌐 Abriendo URL en nueva pestaña:', response.data.url);
          const newWindow = window.open(response.data.url, '_blank');
          if (newWindow) {
            console.log('✅ Nueva pestaña abierta correctamente');
          } else {
            console.error('❌ No se pudo abrir nueva pestaña (posible bloqueador de pop-ups)');
            this.snackBar.open('No se pudo abrir el documento. Verifica que no tengas bloqueado el navegador de pop-ups.', 'Cerrar', {
              duration: 5000
            });
          }
        } else {
          console.error('❌ Respuesta sin URL válida:', response);
          this.snackBar.open('No se pudo obtener la URL del documento', 'Cerrar', {
            duration: 3000
          });
        }
      },
      error: error => {
        console.error('❌ Error obteniendo URL privada de Backblaze:', error);
        this.snackBar.open('Error al obtener URL del documento', 'Cerrar', {
          duration: 3000
        });
      }
    });
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
  // Métodos para paginación y búsqueda de pedidos
  onOrderSearchChange() {
    this.currentPage = 0; // Resetear a la primera página
    this.filterAndPaginateFiles();
  }
  clearOrderSearch() {
    this.orderSearchTerm = '';
    this.currentPage = 0;
    this.filterAndPaginateFiles();
  }
  onPageChange(event) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.filterAndPaginateFiles();
  }
  filterAndPaginateFiles() {
    // Eliminar duplicados basándose en numeroPedido antes de filtrar
    const uniqueFiles = this.files.filter((file, index, self) => index === self.findIndex(f => f.numeroPedido === file.numeroPedido));
    // Filtrar archivos por término de búsqueda
    if (this.orderSearchTerm.trim()) {
      this.filteredFiles = uniqueFiles.filter(file => file.numeroPedido?.toString().toLowerCase().includes(this.orderSearchTerm.toLowerCase()) || file.numeroInventario?.toString().toLowerCase().includes(this.orderSearchTerm.toLowerCase()) || file.proceso?.toLowerCase().includes(this.orderSearchTerm.toLowerCase()) || file.operacion?.toLowerCase().includes(this.orderSearchTerm.toLowerCase()) || file.tipoCliente?.toLowerCase().includes(this.orderSearchTerm.toLowerCase()) || file.vehiculo?.toLowerCase().includes(this.orderSearchTerm.toLowerCase()) || file.modelo?.toLowerCase().includes(this.orderSearchTerm.toLowerCase()) || file.vin?.toLowerCase().includes(this.orderSearchTerm.toLowerCase()) || file.agencia?.toLowerCase().includes(this.orderSearchTerm.toLowerCase()));
    } else {
      this.filteredFiles = [...uniqueFiles];
    }
    // Actualizar total de elementos
    this.totalItems = this.filteredFiles.length;
    // Calcular elementos para la página actual
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedFiles = this.filteredFiles.slice(startIndex, endIndex);
  }
  updateFilesDisplay() {
    this.filterAndPaginateFiles();
  }
  eliminarPedido(file) {
    console.log('🗑️ Eliminando pedido:', file);
    console.log('🔍 File ID encontrado:', file.fileId);
    if (!file.fileId) {
      console.error('❌ No se encontró fileId en el objeto file');
      this.snackBar.open('Error: No se pudo identificar el ID del pedido', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    // Confirmar eliminación
    const confirmMessage = `¿Estás seguro de que deseas eliminar el pedido ${file.numeroPedido}?\n\nEsta acción eliminará:\n- El file completo\n- Todos los documentos asociados\n- El registro en OrderByCar\n\nEsta acción no se puede deshacer.`;
    if (confirm(confirmMessage)) {
      this.deleteFileFromServer(file.fileId);
    }
  }
  deleteFileFromServer(fileId) {
    console.log('🔄 Eliminando file del servidor:', fileId);
    const requestData = {
      fileId: fileId
    };
    this.http.post(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiBaseUrl}/api/files/delete`, requestData).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_6__.takeUntil)(this.destroy$)).subscribe({
      next: response => {
        console.log('✅ File eliminado exitosamente:', response);
        if (response.success) {
          this.snackBar.open(`Pedido eliminado exitosamente. Documentos eliminados: ${response.data.documentsDeleted}`, 'Cerrar', {
            duration: 4000
          });
          // Recargar la lista de files
          this.loadClientFiles();
        } else {
          this.snackBar.open(`Error al eliminar el pedido: ${response.message}`, 'Cerrar', {
            duration: 4000
          });
        }
      },
      error: error => {
        console.error('❌ Error eliminando file:', error);
        let errorMessage = 'Error desconocido al eliminar el pedido';
        if (error.status === 403) {
          errorMessage = 'No tienes permisos para eliminar pedidos';
        } else if (error.status === 401) {
          errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente';
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        this.snackBar.open(`Error: ${errorMessage}`, 'Cerrar', {
          duration: 5000
        });
      }
    });
  }
  static #_ = this.ɵfac = function IntegracionComponent_Factory(t) {
    return new (t || IntegracionComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_8__.MatSnackBar), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_core_services_default_agency_service__WEBPACK_IMPORTED_MODULE_3__.DefaultAgencyService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_7__.HttpClient), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_9__.MatDialog));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({
    type: IntegracionComponent,
    selectors: [["vex-integracion"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵStandaloneFeature"]],
    decls: 28,
    vars: 12,
    consts: [[1, "integracion-container"], [1, "filters-section", "mb-2"], [1, "bg-white", "rounded-lg", "shadow-sm", "border", "border-gray-200"], [1, "p-2"], [1, "flex", "items-center", "justify-between", "gap-3"], [1, "flex", "items-center", "space-x-3"], ["appearance", "outline", 1, "min-w-48"], [3, "value", "disabled", "selectionChange"], [3, "value"], [3, "value", 4, "ngFor", "ngForOf", "ngForTrackBy"], [1, "flex", "items-center", "space-x-3", "flex-1"], ["appearance", "outline", 1, "flex-1"], ["matInput", "", "placeholder", "Buscar por n\u00FAmero de cliente o nombre completo", "autocomplete", "off", 3, "ngModel", "ngModelChange", "keyup.enter"], [1, "flex", "items-center", "space-x-2"], ["mat-raised-button", "", "color", "primary", "matTooltip", "Buscar cliente", 2, "height", "40px", "min-height", "40px", 3, "disabled", "click"], ["mat-raised-button", "", "color", "warn", "matTooltip", "Limpiar b\u00FAsqueda", "style", "height: 40px; min-height: 40px;", 3, "click", 4, "ngIf"], ["class", "mt-3 text-center py-6", 4, "ngIf"], ["class", "client-info-section mb-2", 4, "ngIf"], ["class", "files-section mb-2", 4, "ngIf"], ["class", "documents-section mb-2", 4, "ngIf"], ["mat-raised-button", "", "color", "warn", "matTooltip", "Limpiar b\u00FAsqueda", 2, "height", "40px", "min-height", "40px", 3, "click"], [1, "mt-3", "text-center", "py-6"], [1, "text-gray-400", "mb-2", 2, "font-size", "40px"], [1, "text-gray-500"], [1, "client-info-section", "mb-2"], [1, "pb-1"], [1, "flex", "items-center", "text-sm"], [1, "mr-1", "text-blue-600", 2, "font-size", "18px"], [1, "grid", "grid-cols-1", "md:grid-cols-3", "gap-2"], [1, "field-group"], [1, "field-label"], [1, "field-value"], [1, "files-section", "mb-2"], [1, "flex", "items-center", "justify-between", "text-sm"], [1, "flex", "items-center"], [1, "mr-1", "text-green-600", 2, "font-size", "18px"], ["mat-icon-button", "", "color", "primary", "matTooltip", "Agregar nuevo pedido de integraci\u00F3n", 3, "click", 4, "ngIf"], [1, "px-2", "pb-2"], ["matInput", "", "placeholder", "Buscar por n\u00FAmero de pedido, inventario, proceso, operaci\u00F3n, veh\u00EDculo, modelo, VIN o agencia", "autocomplete", "off", 3, "ngModel", "ngModelChange", "input"], ["matSuffix", ""], ["mat-icon-button", "", "color", "warn", "matTooltip", "Limpiar b\u00FAsqueda", 3, "click", 4, "ngIf"], ["class", "flex justify-center py-8", 4, "ngIf"], ["class", "overflow-x-auto", 4, "ngIf"], ["class", "text-center py-8", 4, "ngIf"], ["mat-icon-button", "", "color", "primary", "matTooltip", "Agregar nuevo pedido de integraci\u00F3n", 3, "click"], [2, "font-size", "18px"], ["mat-icon-button", "", "color", "warn", "matTooltip", "Limpiar b\u00FAsqueda", 3, "click"], [1, "flex", "justify-center", "py-8"], ["diameter", "40"], [1, "overflow-x-auto"], ["mat-table", "", 1, "w-full", "files-table", 3, "dataSource"], ["matColumnDef", "numeroPedido"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "numeroInventario"], ["matColumnDef", "proceso"], ["matColumnDef", "operacion"], ["matColumnDef", "tipoCliente"], ["matColumnDef", "vehiculo"], ["matColumnDef", "year"], ["matColumnDef", "modelo"], ["matColumnDef", "vin"], ["matColumnDef", "agencia"], ["matColumnDef", "fechaRegistro"], ["matColumnDef", "actions"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", "class", "hover:bg-gray-50 cursor-pointer", 3, "click", 4, "matRowDef", "matRowDefColumns"], ["class", "mt-2", 3, "length", "pageSize", "pageIndex", "pageSizeOptions", "showFirstLastButtons", "page", 4, "ngIf"], ["mat-header-cell", ""], ["mat-cell", ""], [1, "mr-1", "text-blue-600", 2, "font-size", "14px"], [1, "font-medium"], ["class", "text-sm", 4, "ngIf", "ngIfElse"], ["noInventory", ""], [1, "text-sm"], [1, "text-gray-400", "italic", "text-sm"], ["noProcess", ""], ["noOperation", ""], ["noClientType", ""], ["noVehicle", ""], ["noYear", ""], ["noModel", ""], ["class", "text-sm font-mono", 4, "ngIf", "ngIfElse"], ["noVin", ""], [1, "text-sm", "font-mono"], ["noAgency", ""], ["noDate", ""], ["mat-icon-button", "", "matTooltip", "Opciones del pedido", 3, "matMenuTriggerFor", 4, "ngIf"], ["actionsMenu", "matMenu"], ["mat-menu-item", "", 3, "click"], ["mat-menu-item", "", 1, "text-red-600", 3, "click"], [1, "text-red-600"], ["mat-icon-button", "", "matTooltip", "Opciones del pedido", 3, "matMenuTriggerFor"], ["mat-header-row", ""], ["mat-row", "", 1, "hover:bg-gray-50", "cursor-pointer", 3, "click"], [1, "mt-2", 3, "length", "pageSize", "pageIndex", "pageSizeOptions", "showFirstLastButtons", "page"], [1, "text-center", "py-8"], ["mat-button", "", "color", "primary", 1, "mt-2", 3, "click"], [1, "documents-section", "mb-2"], [1, "flex", "flex-col", "text-sm"], [1, "flex", "items-center", "mb-1"], [1, "font-semibold"], [1, "text-xs", "text-gray-600", "ml-6"], ["class", "space-y-2", 4, "ngIf"], [1, "space-y-2"], ["class", "document-item flex items-center justify-between p-2 border border-gray-200 rounded hover:bg-gray-50", 4, "ngFor", "ngForOf"], [1, "document-item", "flex", "items-center", "justify-between", "p-2", "border", "border-gray-200", "rounded", "hover:bg-gray-50"], [1, "flex", "items-center", "space-x-2", "flex-1"], [2, "font-size", "16px"], [1, "flex-1"], [1, "font-medium", "text-gray-900", "text-sm"], ["class", "text-xs text-gray-500", 4, "ngIf"], [1, "flex", "items-center", "space-x-1"], [1, "file-input-container"], ["type", "file", "accept", ".pdf,.jpg,.jpeg,.png,.doc,.docx", 1, "hidden", 3, "id", "change"], ["fileInput", ""], ["mat-stroked-button", "", 1, "text-xs", 3, "disabled", "click"], [1, "mr-1", 2, "font-size", "14px"], ["mat-raised-button", "", "color", "primary", 1, "text-xs", 3, "disabled", "click"], ["mat-raised-button", "", "color", "accent", 1, "text-xs", 3, "disabled", "click"], [1, "text-xs", "text-gray-500"]],
    template: function IntegracionComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "mat-card", 2)(3, "mat-card-content", 3)(4, "div", 4)(5, "div", 5)(6, "mat-form-field", 6)(7, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](8, "Agencia");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](9, "mat-select", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("selectionChange", function IntegracionComponent_Template_mat_select_selectionChange_9_listener($event) {
          return ctx.onAgencyChange($event.value);
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](10, "mat-option", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](11, "Todas las agencias");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](12, IntegracionComponent_mat_option_12_Template, 2, 2, "mat-option", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](13, "div", 10)(14, "mat-form-field", 11)(15, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](16, "Buscar Cliente");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](17, "input", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("ngModelChange", function IntegracionComponent_Template_input_ngModelChange_17_listener($event) {
          return ctx.clientSearchTerm = $event;
        })("keyup.enter", function IntegracionComponent_Template_input_keyup_enter_17_listener() {
          return ctx.searchClients();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](18, "div", 13)(19, "button", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function IntegracionComponent_Template_button_click_19_listener() {
          return ctx.searchClients();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](20, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](21, "search");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](22, " Buscar ");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](23, IntegracionComponent_button_23_Template, 4, 0, "button", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](24, IntegracionComponent_div_24_Template, 5, 0, "div", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](25, IntegracionComponent_div_25_Template, 39, 6, "div", 17)(26, IntegracionComponent_div_26_Template, 23, 7, "div", 18)(27, IntegracionComponent_div_27_Template, 15, 11, "div", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](9);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("value", ctx.selectedAgencyId)("disabled", ctx.agenciesLoading || !ctx.hasAgencies());
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("value", null);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx.agencies)("ngForTrackBy", ctx.trackByAgencyId);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngModel", ctx.clientSearchTerm);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("disabled", ctx.clientsLoading || ctx.clientSearchTerm.trim().length < 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.clientSearchTerm);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.showClientResults && ctx.clients.length === 0 && !ctx.clientsLoading);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.selectedClient);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.selectedClient);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.selectedFile);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_10__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_10__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_10__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_10__.DatePipe, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.NgModel, _angular_material_card__WEBPACK_IMPORTED_MODULE_12__.MatCardModule, _angular_material_card__WEBPACK_IMPORTED_MODULE_12__.MatCard, _angular_material_card__WEBPACK_IMPORTED_MODULE_12__.MatCardContent, _angular_material_card__WEBPACK_IMPORTED_MODULE_12__.MatCardHeader, _angular_material_card__WEBPACK_IMPORTED_MODULE_12__.MatCardTitle, _angular_material_button__WEBPACK_IMPORTED_MODULE_13__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_13__.MatButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_13__.MatIconButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_14__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_14__.MatIcon, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_15__.MatProgressSpinnerModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_15__.MatProgressSpinner, _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_8__.MatSnackBarModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_16__.MatFormFieldModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_16__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_16__.MatLabel, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_16__.MatSuffix, _angular_material_select__WEBPACK_IMPORTED_MODULE_17__.MatSelectModule, _angular_material_select__WEBPACK_IMPORTED_MODULE_17__.MatSelect, _angular_material_core__WEBPACK_IMPORTED_MODULE_18__.MatOption, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_19__.MatTooltipModule, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_19__.MatTooltip, _angular_material_input__WEBPACK_IMPORTED_MODULE_20__.MatInputModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_20__.MatInput, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_9__.MatDialogModule, _angular_material_table__WEBPACK_IMPORTED_MODULE_21__.MatTableModule, _angular_material_table__WEBPACK_IMPORTED_MODULE_21__.MatTable, _angular_material_table__WEBPACK_IMPORTED_MODULE_21__.MatHeaderCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_21__.MatHeaderRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_21__.MatColumnDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_21__.MatCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_21__.MatRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_21__.MatHeaderCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_21__.MatCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_21__.MatHeaderRow, _angular_material_table__WEBPACK_IMPORTED_MODULE_21__.MatRow, _angular_material_menu__WEBPACK_IMPORTED_MODULE_22__.MatMenuModule, _angular_material_menu__WEBPACK_IMPORTED_MODULE_22__.MatMenu, _angular_material_menu__WEBPACK_IMPORTED_MODULE_22__.MatMenuItem, _angular_material_menu__WEBPACK_IMPORTED_MODULE_22__.MatMenuTrigger, _angular_material_paginator__WEBPACK_IMPORTED_MODULE_23__.MatPaginatorModule, _angular_material_paginator__WEBPACK_IMPORTED_MODULE_23__.MatPaginator],
    styles: [".integracion-container[_ngcontent-%COMP%] {\n  padding: 0.5rem;\n  width: 100%;\n  min-height: 100vh;\n  margin: 0;\n}\n.integracion-container[_ngcontent-%COMP%]     .mat-mdc-form-field-subscript-wrapper {\n  display: none !important;\n}\n.integracion-container[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%] {\n  margin-bottom: 2rem;\n}\n.integracion-container[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%]   .page-title[_ngcontent-%COMP%] {\n  font-size: 2rem;\n  font-weight: 600;\n  color: #1f2937;\n  margin-bottom: 0.5rem;\n  display: flex;\n  align-items: center;\n}\n.integracion-container[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%]   .page-subtitle[_ngcontent-%COMP%] {\n  color: #6b7280;\n  font-size: 1.1rem;\n  margin: 0;\n}\n.integracion-container[_ngcontent-%COMP%]   .status-section[_ngcontent-%COMP%]   .status-card[_ngcontent-%COMP%] {\n  border-radius: 12px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n  border: 1px solid #e5e7eb;\n}\n.integracion-container[_ngcontent-%COMP%]   .status-section[_ngcontent-%COMP%]   .status-card[_ngcontent-%COMP%]   .status-indicator[_ngcontent-%COMP%] {\n  width: 48px;\n  height: 48px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 50%;\n  background-color: #f3f4f6;\n}\n.integracion-container[_ngcontent-%COMP%]   .status-section[_ngcontent-%COMP%]   .status-card[_ngcontent-%COMP%]   .status-indicator[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 24px;\n}\n.integracion-container[_ngcontent-%COMP%]   .status-section[_ngcontent-%COMP%]   .status-card[_ngcontent-%COMP%]   .status-text[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n  font-weight: 600;\n  margin-bottom: 0.25rem;\n}\n.integracion-container[_ngcontent-%COMP%]   .status-section[_ngcontent-%COMP%]   .status-card[_ngcontent-%COMP%]   .status-description[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n}\n.integracion-container[_ngcontent-%COMP%]   .status-section[_ngcontent-%COMP%]   .status-card[_ngcontent-%COMP%]   .status-actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  margin-left: 0.5rem;\n}\n.integracion-container[_ngcontent-%COMP%]   .metrics-grid[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%] {\n  border-radius: 12px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n  border: 1px solid #e5e7eb;\n  transition: all 0.3s ease;\n}\n.integracion-container[_ngcontent-%COMP%]   .metrics-grid[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%]:hover {\n  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);\n  transform: translateY(-2px);\n}\n.integracion-container[_ngcontent-%COMP%]   .metrics-grid[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%]   .metric-icon[_ngcontent-%COMP%] {\n  width: 48px;\n  height: 48px;\n  border-radius: 12px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.integracion-container[_ngcontent-%COMP%]   .metrics-grid[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%]   .metric-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 24px;\n}\n.integracion-container[_ngcontent-%COMP%]   .metrics-grid[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%]   .metric-value[_ngcontent-%COMP%] {\n  font-size: 1.875rem;\n  font-weight: 700;\n  color: #1f2937;\n  line-height: 1;\n  margin-bottom: 0.25rem;\n}\n.integracion-container[_ngcontent-%COMP%]   .metrics-grid[_ngcontent-%COMP%]   .metric-card[_ngcontent-%COMP%]   .metric-label[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  color: #6b7280;\n  font-weight: 500;\n}\n.integracion-container[_ngcontent-%COMP%]   .config-section[_ngcontent-%COMP%]   mat-card[_ngcontent-%COMP%] {\n  border-radius: 12px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n  border: 1px solid #e5e7eb;\n}\n.integracion-container[_ngcontent-%COMP%]   .config-section[_ngcontent-%COMP%]   mat-card[_ngcontent-%COMP%]   .config-content[_ngcontent-%COMP%]   .config-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 1rem;\n  margin-top: 1rem;\n}\n.integracion-container[_ngcontent-%COMP%]   .loading-overlay[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-color: rgba(255, 255, 255, 0.8);\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000;\n}\n.integracion-container[_ngcontent-%COMP%]   .loading-overlay[_ngcontent-%COMP%]   .loading-text[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n  color: #6b7280;\n  font-size: 1rem;\n}\n.integracion-container[_ngcontent-%COMP%]   .client-info-section[_ngcontent-%COMP%]   .field-group[_ngcontent-%COMP%] {\n  margin-bottom: 0.25rem;\n}\n.integracion-container[_ngcontent-%COMP%]   .client-info-section[_ngcontent-%COMP%]   .field-group[_ngcontent-%COMP%]   .field-label[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 0.7rem;\n  font-weight: 600;\n  color: #374151;\n  margin-bottom: 0.125rem;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n}\n.integracion-container[_ngcontent-%COMP%]   .client-info-section[_ngcontent-%COMP%]   .field-group[_ngcontent-%COMP%]   .field-value[_ngcontent-%COMP%] {\n  background-color: #f9fafb;\n  border: 1px solid #d1d5db;\n  border-radius: 4px;\n  padding: 0.25rem 0.5rem;\n  font-size: 0.75rem;\n  color: #111827;\n  font-weight: 500;\n  min-height: 1.5rem;\n  display: flex;\n  align-items: center;\n  word-break: break-word;\n}\n.integracion-container[_ngcontent-%COMP%]   .client-info-section[_ngcontent-%COMP%]   .field-group[_ngcontent-%COMP%]   .field-value[_ngcontent-%COMP%]:empty::before {\n  content: \"N/A\";\n  color: #9ca3af;\n  font-style: italic;\n}\n.integracion-container[_ngcontent-%COMP%]   .client-card[_ngcontent-%COMP%] {\n  transition: all 0.2s ease;\n  border: 1px solid #e5e7eb;\n}\n.integracion-container[_ngcontent-%COMP%]   .client-card[_ngcontent-%COMP%]:hover {\n  border-color: #3b82f6;\n  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);\n}\n.integracion-container   .files-section   .files-table   [_nghost-%COMP%]     mat-table .mat-mdc-table {\n  border-collapse: separate !important;\n  border-spacing: 0 !important;\n  width: 100% !important;\n}\n.integracion-container   .files-section   .files-table   [_nghost-%COMP%]     mat-table .mat-mdc-row {\n  min-height: 32px !important;\n  height: 32px !important;\n  max-height: 32px !important;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;\n  display: table-row !important;\n}\n.integracion-container   .files-section   .files-table   [_nghost-%COMP%]     mat-table .mat-mdc-row:hover {\n  background-color: #f1f5f9 !important;\n}\n.integracion-container   .files-section   .files-table   [_nghost-%COMP%]     mat-table .mat-mdc-header-row {\n  min-height: 32px !important;\n  height: 32px !important;\n  max-height: 32px !important;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;\n  display: table-row !important;\n  background-color: #f8fafc !important;\n}\n.integracion-container   .files-section   .files-table   [_nghost-%COMP%]     mat-table .mat-mdc-cell {\n  padding: 4px 8px !important;\n  vertical-align: middle !important;\n  line-height: 1.2 !important;\n  font-size: 12px !important;\n  border: none !important;\n  height: 32px !important;\n  max-height: 32px !important;\n  overflow: hidden !important;\n  white-space: nowrap !important;\n  text-overflow: ellipsis !important;\n  text-align: left !important;\n}\n.integracion-container   .files-section   .files-table   [_nghost-%COMP%]     mat-table .mat-mdc-header-cell {\n  padding: 4px 8px !important;\n  vertical-align: middle !important;\n  line-height: 1.2 !important;\n  font-size: 12px !important;\n  font-weight: 500 !important;\n  border: none !important;\n  height: 32px !important;\n  max-height: 32px !important;\n  overflow: hidden !important;\n  white-space: nowrap !important;\n  text-overflow: ellipsis !important;\n  text-align: left !important;\n}\n.integracion-container   .files-section   .files-table   [_nghost-%COMP%]     mat-table .mat-mdc-cell, .integracion-container   .files-section   .files-table   [_nghost-%COMP%]     mat-table .mat-mdc-header-cell {\n  margin: 0 !important;\n  border-spacing: 0 !important;\n}\n.integracion-container   .files-section   .files-table   [_nghost-%COMP%]     .mat-mdc-table-container {\n  overflow: hidden !important;\n}\n.integracion-container   .files-section   .files-table   [_nghost-%COMP%]     .mat-mdc-table-wrapper {\n  overflow: hidden !important;\n}\n.integracion-container   .files-section   .files-table   [_nghost-%COMP%]     .mat-mdc-cell div, .integracion-container   .files-section   .files-table   [_nghost-%COMP%]     .mat-mdc-cell span, .integracion-container   .files-section   .files-table   [_nghost-%COMP%]     .mat-mdc-header-cell div, .integracion-container   .files-section   .files-table   [_nghost-%COMP%]     .mat-mdc-header-cell span {\n  line-height: 1.2 !important;\n  margin: 0 !important;\n  padding: 0 !important;\n  font-size: 12px !important;\n}\n\n@media (max-width: 768px) {\n  .integracion-container[_ngcontent-%COMP%] {\n    padding: 1rem;\n  }\n  .integracion-container[_ngcontent-%COMP%]   .page-header[_ngcontent-%COMP%]   .page-title[_ngcontent-%COMP%] {\n    font-size: 1.5rem;\n  }\n  .integracion-container[_ngcontent-%COMP%]   .metrics-grid[_ngcontent-%COMP%]   .grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .integracion-container[_ngcontent-%COMP%]   .status-section[_ngcontent-%COMP%]   .status-card[_ngcontent-%COMP%]   mat-card-content[_ngcontent-%COMP%]   .flex[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-start;\n    gap: 1rem;\n  }\n}\n.documents-section[_ngcontent-%COMP%]   .document-item[_ngcontent-%COMP%] {\n  transition: all 0.2s ease;\n}\n.documents-section[_ngcontent-%COMP%]   .document-item[_ngcontent-%COMP%]:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n}\n.documents-section[_ngcontent-%COMP%]   .file-input-container[_ngcontent-%COMP%] {\n  position: relative;\n}\n.documents-section[_ngcontent-%COMP%]   .file-input-container[_ngcontent-%COMP%]   input[type=file][_ngcontent-%COMP%] {\n  position: absolute;\n  opacity: 0;\n  pointer-events: none;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvcHJvY2Vzb3MvaW50ZWdyYWNpb24vaW50ZWdyYWNpb24uY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxlQUFBO0VBQ0EsV0FBQTtFQUNBLGlCQUFBO0VBQ0EsU0FBQTtBQUNGO0FBRUU7RUFDRSx3QkFBQTtBQUFKO0FBR0U7RUFDRSxtQkFBQTtBQURKO0FBR0k7RUFDRSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxjQUFBO0VBQ0EscUJBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7QUFETjtBQUlJO0VBQ0UsY0FBQTtFQUNBLGlCQUFBO0VBQ0EsU0FBQTtBQUZOO0FBT0k7RUFDRSxtQkFBQTtFQUNBLHdDQUFBO0VBQ0EseUJBQUE7QUFMTjtBQU9NO0VBQ0UsV0FBQTtFQUNBLFlBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtFQUNBLGtCQUFBO0VBQ0EseUJBQUE7QUFMUjtBQU9RO0VBQ0UsZUFBQTtBQUxWO0FBU007RUFDRSxrQkFBQTtFQUNBLGdCQUFBO0VBQ0Esc0JBQUE7QUFQUjtBQVVNO0VBQ0UsbUJBQUE7QUFSUjtBQVlRO0VBQ0UsbUJBQUE7QUFWVjtBQWlCSTtFQUNFLG1CQUFBO0VBQ0Esd0NBQUE7RUFDQSx5QkFBQTtFQUNBLHlCQUFBO0FBZk47QUFpQk07RUFDRSwwQ0FBQTtFQUNBLDJCQUFBO0FBZlI7QUFrQk07RUFDRSxXQUFBO0VBQ0EsWUFBQTtFQUNBLG1CQUFBO0VBQ0EsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7QUFoQlI7QUFrQlE7RUFDRSxlQUFBO0FBaEJWO0FBb0JNO0VBQ0UsbUJBQUE7RUFDQSxnQkFBQTtFQUNBLGNBQUE7RUFDQSxjQUFBO0VBQ0Esc0JBQUE7QUFsQlI7QUFxQk07RUFDRSxtQkFBQTtFQUNBLGNBQUE7RUFDQSxnQkFBQTtBQW5CUjtBQXlCSTtFQUNFLG1CQUFBO0VBQ0Esd0NBQUE7RUFDQSx5QkFBQTtBQXZCTjtBQTBCUTtFQUNFLGFBQUE7RUFDQSxTQUFBO0VBQ0EsZ0JBQUE7QUF4QlY7QUE4QkU7RUFDRSxlQUFBO0VBQ0EsTUFBQTtFQUNBLE9BQUE7RUFDQSxRQUFBO0VBQ0EsU0FBQTtFQUNBLDBDQUFBO0VBQ0EsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtFQUNBLGFBQUE7QUE1Qko7QUE4Qkk7RUFDRSxnQkFBQTtFQUNBLGNBQUE7RUFDQSxlQUFBO0FBNUJOO0FBaUNJO0VBQ0Usc0JBQUE7QUEvQk47QUFpQ007RUFDRSxjQUFBO0VBQ0EsaUJBQUE7RUFDQSxnQkFBQTtFQUNBLGNBQUE7RUFDQSx1QkFBQTtFQUNBLHlCQUFBO0VBQ0Esc0JBQUE7QUEvQlI7QUFrQ007RUFDRSx5QkFBQTtFQUNBLHlCQUFBO0VBQ0Esa0JBQUE7RUFDQSx1QkFBQTtFQUNBLGtCQUFBO0VBQ0EsY0FBQTtFQUNBLGdCQUFBO0VBQ0Esa0JBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxzQkFBQTtBQWhDUjtBQWtDUTtFQUNFLGNBQUE7RUFDQSxjQUFBO0VBQ0Esa0JBQUE7QUFoQ1Y7QUFzQ0U7RUFDRSx5QkFBQTtFQUNBLHlCQUFBO0FBcENKO0FBc0NJO0VBQ0UscUJBQUE7RUFDQSwrQ0FBQTtBQXBDTjtBQTZDVTtFQUNFLG9DQUFBO0VBQ0EsNEJBQUE7RUFDQSxzQkFBQTtBQTNDWjtBQStDVTtFQUNFLDJCQUFBO0VBQ0EsdUJBQUE7RUFDQSwyQkFBQTtFQUNBLHVEQUFBO0VBQ0EsNkJBQUE7QUE3Q1o7QUErQ1k7RUFDRSxvQ0FBQTtBQTdDZDtBQWlEVTtFQUNFLDJCQUFBO0VBQ0EsdUJBQUE7RUFDQSwyQkFBQTtFQUNBLHVEQUFBO0VBQ0EsNkJBQUE7RUFDQSxvQ0FBQTtBQS9DWjtBQW1EVTtFQUNFLDJCQUFBO0VBQ0EsaUNBQUE7RUFDQSwyQkFBQTtFQUNBLDBCQUFBO0VBQ0EsdUJBQUE7RUFDQSx1QkFBQTtFQUNBLDJCQUFBO0VBQ0EsMkJBQUE7RUFDQSw4QkFBQTtFQUNBLGtDQUFBO0VBQ0EsMkJBQUE7QUFqRFo7QUFvRFU7RUFDRSwyQkFBQTtFQUNBLGlDQUFBO0VBQ0EsMkJBQUE7RUFDQSwwQkFBQTtFQUNBLDJCQUFBO0VBQ0EsdUJBQUE7RUFDQSx1QkFBQTtFQUNBLDJCQUFBO0VBQ0EsMkJBQUE7RUFDQSw4QkFBQTtFQUNBLGtDQUFBO0VBQ0EsMkJBQUE7QUFsRFo7QUFzRFU7RUFDRSxvQkFBQTtFQUNBLDRCQUFBO0FBcERaO0FBeURRO0VBQ0UsMkJBQUE7QUF2RFY7QUEwRFE7RUFDRSwyQkFBQTtBQXhEVjtBQTREUTs7OztFQUlFLDJCQUFBO0VBQ0Esb0JBQUE7RUFDQSxxQkFBQTtFQUNBLDBCQUFBO0FBMURWOztBQWtFQTtFQUNFO0lBQ0UsYUFBQTtFQS9ERjtFQWtFSTtJQUNFLGlCQUFBO0VBaEVOO0VBcUVJO0lBQ0UsMEJBQUE7RUFuRU47RUEwRVE7SUFDRSxzQkFBQTtJQUNBLHVCQUFBO0lBQ0EsU0FBQTtFQXhFVjtBQUNGO0FBaUZFO0VBQ0UseUJBQUE7QUEvRUo7QUFpRkk7RUFDRSwyQkFBQTtFQUNBLHdDQUFBO0FBL0VOO0FBbUZFO0VBQ0Usa0JBQUE7QUFqRko7QUFtRkk7RUFDRSxrQkFBQTtFQUNBLFVBQUE7RUFDQSxvQkFBQTtBQWpGTiIsInNvdXJjZXNDb250ZW50IjpbIi5pbnRlZ3JhY2lvbi1jb250YWluZXIge1xuICBwYWRkaW5nOiAwLjVyZW07XG4gIHdpZHRoOiAxMDAlO1xuICBtaW4taGVpZ2h0OiAxMDB2aDtcbiAgbWFyZ2luOiAwO1xuXG4gIC8vIE9jdWx0YXIgaGludHMgZGUgZm9ybSBmaWVsZHNcbiAgOjpuZy1kZWVwIC5tYXQtbWRjLWZvcm0tZmllbGQtc3Vic2NyaXB0LXdyYXBwZXIge1xuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgfVxuXG4gIC5wYWdlLWhlYWRlciB7XG4gICAgbWFyZ2luLWJvdHRvbTogMnJlbTtcbiAgICBcbiAgICAucGFnZS10aXRsZSB7XG4gICAgICBmb250LXNpemU6IDJyZW07XG4gICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgY29sb3I6ICMxZjI5Mzc7XG4gICAgICBtYXJnaW4tYm90dG9tOiAwLjVyZW07XG4gICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICB9XG4gICAgXG4gICAgLnBhZ2Utc3VidGl0bGUge1xuICAgICAgY29sb3I6ICM2YjcyODA7XG4gICAgICBmb250LXNpemU6IDEuMXJlbTtcbiAgICAgIG1hcmdpbjogMDtcbiAgICB9XG4gIH1cblxuICAuc3RhdHVzLXNlY3Rpb24ge1xuICAgIC5zdGF0dXMtY2FyZCB7XG4gICAgICBib3JkZXItcmFkaXVzOiAxMnB4O1xuICAgICAgYm94LXNoYWRvdzogMCAycHggOHB4IHJnYmEoMCwgMCwgMCwgMC4xKTtcbiAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNlNWU3ZWI7XG4gICAgICBcbiAgICAgIC5zdGF0dXMtaW5kaWNhdG9yIHtcbiAgICAgICAgd2lkdGg6IDQ4cHg7XG4gICAgICAgIGhlaWdodDogNDhweDtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2YzZjRmNjtcbiAgICAgICAgXG4gICAgICAgIG1hdC1pY29uIHtcbiAgICAgICAgICBmb250LXNpemU6IDI0cHg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgLnN0YXR1cy10ZXh0IHtcbiAgICAgICAgZm9udC1zaXplOiAxLjI1cmVtO1xuICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICBtYXJnaW4tYm90dG9tOiAwLjI1cmVtO1xuICAgICAgfVxuICAgICAgXG4gICAgICAuc3RhdHVzLWRlc2NyaXB0aW9uIHtcbiAgICAgICAgZm9udC1zaXplOiAwLjg3NXJlbTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLnN0YXR1cy1hY3Rpb25zIHtcbiAgICAgICAgYnV0dG9uIHtcbiAgICAgICAgICBtYXJnaW4tbGVmdDogMC41cmVtO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLm1ldHJpY3MtZ3JpZCB7XG4gICAgLm1ldHJpYy1jYXJkIHtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDEycHg7XG4gICAgICBib3gtc2hhZG93OiAwIDJweCA4cHggcmdiYSgwLCAwLCAwLCAwLjEpO1xuICAgICAgYm9yZGVyOiAxcHggc29saWQgI2U1ZTdlYjtcbiAgICAgIHRyYW5zaXRpb246IGFsbCAwLjNzIGVhc2U7XG4gICAgICBcbiAgICAgICY6aG92ZXIge1xuICAgICAgICBib3gtc2hhZG93OiAwIDRweCAxNnB4IHJnYmEoMCwgMCwgMCwgMC4xNSk7XG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMnB4KTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLm1ldHJpYy1pY29uIHtcbiAgICAgICAgd2lkdGg6IDQ4cHg7XG4gICAgICAgIGhlaWdodDogNDhweDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTJweDtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIFxuICAgICAgICBtYXQtaWNvbiB7XG4gICAgICAgICAgZm9udC1zaXplOiAyNHB4O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIC5tZXRyaWMtdmFsdWUge1xuICAgICAgICBmb250LXNpemU6IDEuODc1cmVtO1xuICAgICAgICBmb250LXdlaWdodDogNzAwO1xuICAgICAgICBjb2xvcjogIzFmMjkzNztcbiAgICAgICAgbGluZS1oZWlnaHQ6IDE7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDAuMjVyZW07XG4gICAgICB9XG4gICAgICBcbiAgICAgIC5tZXRyaWMtbGFiZWwge1xuICAgICAgICBmb250LXNpemU6IDAuODc1cmVtO1xuICAgICAgICBjb2xvcjogIzZiNzI4MDtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAuY29uZmlnLXNlY3Rpb24ge1xuICAgIG1hdC1jYXJkIHtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDEycHg7XG4gICAgICBib3gtc2hhZG93OiAwIDJweCA4cHggcmdiYSgwLCAwLCAwLCAwLjEpO1xuICAgICAgYm9yZGVyOiAxcHggc29saWQgI2U1ZTdlYjtcbiAgICAgIFxuICAgICAgLmNvbmZpZy1jb250ZW50IHtcbiAgICAgICAgLmNvbmZpZy1hY3Rpb25zIHtcbiAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgIGdhcDogMXJlbTtcbiAgICAgICAgICBtYXJnaW4tdG9wOiAxcmVtO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLmxvYWRpbmctb3ZlcmxheSB7XG4gICAgcG9zaXRpb246IGZpeGVkO1xuICAgIHRvcDogMDtcbiAgICBsZWZ0OiAwO1xuICAgIHJpZ2h0OiAwO1xuICAgIGJvdHRvbTogMDtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuOCk7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgei1pbmRleDogMTAwMDtcbiAgICBcbiAgICAubG9hZGluZy10ZXh0IHtcbiAgICAgIG1hcmdpbi10b3A6IDFyZW07XG4gICAgICBjb2xvcjogIzZiNzI4MDtcbiAgICAgIGZvbnQtc2l6ZTogMXJlbTtcbiAgICB9XG4gIH1cblxuICAuY2xpZW50LWluZm8tc2VjdGlvbiB7XG4gICAgLmZpZWxkLWdyb3VwIHtcbiAgICAgIG1hcmdpbi1ib3R0b206IDAuMjVyZW07XG4gICAgICBcbiAgICAgIC5maWVsZC1sYWJlbCB7XG4gICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgICBmb250LXNpemU6IDAuN3JlbTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgY29sb3I6ICMzNzQxNTE7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDAuMTI1cmVtO1xuICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4wNWVtO1xuICAgICAgfVxuICAgICAgXG4gICAgICAuZmllbGQtdmFsdWUge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjlmYWZiO1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjZDFkNWRiO1xuICAgICAgICBib3JkZXItcmFkaXVzOiA0cHg7XG4gICAgICAgIHBhZGRpbmc6IDAuMjVyZW0gMC41cmVtO1xuICAgICAgICBmb250LXNpemU6IDAuNzVyZW07XG4gICAgICAgIGNvbG9yOiAjMTExODI3O1xuICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICBtaW4taGVpZ2h0OiAxLjVyZW07XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIHdvcmQtYnJlYWs6IGJyZWFrLXdvcmQ7XG4gICAgICAgIFxuICAgICAgICAmOmVtcHR5OjpiZWZvcmUge1xuICAgICAgICAgIGNvbnRlbnQ6ICdOL0EnO1xuICAgICAgICAgIGNvbG9yOiAjOWNhM2FmO1xuICAgICAgICAgIGZvbnQtc3R5bGU6IGl0YWxpYztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC5jbGllbnQtY2FyZCB7XG4gICAgdHJhbnNpdGlvbjogYWxsIDAuMnMgZWFzZTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjZTVlN2ViO1xuICAgIFxuICAgICY6aG92ZXIge1xuICAgICAgYm9yZGVyLWNvbG9yOiAjM2I4MmY2O1xuICAgICAgYm94LXNoYWRvdzogMCA0cHggMTJweCByZ2JhKDU5LCAxMzAsIDI0NiwgMC4xNSk7XG4gICAgfVxuICB9XG5cbiAgLmZpbGVzLXNlY3Rpb24ge1xuICAgIC5maWxlcy10YWJsZSB7XG4gICAgICAvLyBFc3RpbG9zIGVzcGVjw4PCrWZpY29zIHBhcmEgbGEgdGFibGEgZGUgcGVkaWRvcyAodG9tYWRvcyBkZSB2YWxpZGFjacODwrNuKVxuICAgICAgOmhvc3QgOjpuZy1kZWVwIHtcbiAgICAgICAgbWF0LXRhYmxlIHtcbiAgICAgICAgICAubWF0LW1kYy10YWJsZSB7XG4gICAgICAgICAgICBib3JkZXItY29sbGFwc2U6IHNlcGFyYXRlICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBib3JkZXItc3BhY2luZzogMCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgd2lkdGg6IDEwMCUgIWltcG9ydGFudDtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gQWx0dXJhIGNvbXBhY3RhIHBhcmEgbGFzIGZpbGFzXG4gICAgICAgICAgLm1hdC1tZGMtcm93IHtcbiAgICAgICAgICAgIG1pbi1oZWlnaHQ6IDMycHggIWltcG9ydGFudDtcbiAgICAgICAgICAgIGhlaWdodDogMzJweCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgbWF4LWhlaWdodDogMzJweCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHJnYmEoMCwwLDAsLjEyKSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgZGlzcGxheTogdGFibGUtcm93ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjFmNWY5ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIC5tYXQtbWRjLWhlYWRlci1yb3cge1xuICAgICAgICAgICAgbWluLWhlaWdodDogMzJweCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgaGVpZ2h0OiAzMnB4ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBtYXgtaGVpZ2h0OiAzMnB4ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgcmdiYSgwLDAsMCwuMTIpICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBkaXNwbGF5OiB0YWJsZS1yb3cgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmOGZhZmMgIWltcG9ydGFudDtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gUGFkZGluZyBjb21wYWN0byBwYXJhIGxhcyBjZWxkYXNcbiAgICAgICAgICAubWF0LW1kYy1jZWxsIHtcbiAgICAgICAgICAgIHBhZGRpbmc6IDRweCA4cHggIWltcG9ydGFudDtcbiAgICAgICAgICAgIHZlcnRpY2FsLWFsaWduOiBtaWRkbGUgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxLjIgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTJweCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYm9yZGVyOiBub25lICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBoZWlnaHQ6IDMycHggIWltcG9ydGFudDtcbiAgICAgICAgICAgIG1heC1oZWlnaHQ6IDMycHggIWltcG9ydGFudDtcbiAgICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW4gIWltcG9ydGFudDtcbiAgICAgICAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXAgIWltcG9ydGFudDtcbiAgICAgICAgICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICB0ZXh0LWFsaWduOiBsZWZ0ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIC5tYXQtbWRjLWhlYWRlci1jZWxsIHtcbiAgICAgICAgICAgIHBhZGRpbmc6IDRweCA4cHggIWltcG9ydGFudDtcbiAgICAgICAgICAgIHZlcnRpY2FsLWFsaWduOiBtaWRkbGUgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxLjIgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTJweCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDUwMCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYm9yZGVyOiBub25lICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBoZWlnaHQ6IDMycHggIWltcG9ydGFudDtcbiAgICAgICAgICAgIG1heC1oZWlnaHQ6IDMycHggIWltcG9ydGFudDtcbiAgICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW4gIWltcG9ydGFudDtcbiAgICAgICAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXAgIWltcG9ydGFudDtcbiAgICAgICAgICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICB0ZXh0LWFsaWduOiBsZWZ0ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIC8vIEVsaW1pbmFyIGN1YWxxdWllciBlc3BhY2lhZG8gZXh0cmFcbiAgICAgICAgICAubWF0LW1kYy1jZWxsLCAubWF0LW1kYy1oZWFkZXItY2VsbCB7XG4gICAgICAgICAgICBtYXJnaW46IDAgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGJvcmRlci1zcGFjaW5nOiAwICFpbXBvcnRhbnQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBFc3RpbG9zIGVzcGVjw4PCrWZpY29zIHBhcmEgZWxlbWVudG9zIHF1ZSBwdWVkYW4gZXN0YXIgY2F1c2FuZG8gZGlmZXJlbmNpYXNcbiAgICAgICAgLm1hdC1tZGMtdGFibGUtY29udGFpbmVyIHtcbiAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC5tYXQtbWRjLXRhYmxlLXdyYXBwZXIge1xuICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW4gIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gRXN0aWxvcyBlc3BlY8ODwq1maWNvcyBwYXJhIGVsZW1lbnRvcyBpbnRlcm5vc1xuICAgICAgICAubWF0LW1kYy1jZWxsIGRpdixcbiAgICAgICAgLm1hdC1tZGMtY2VsbCBzcGFuLFxuICAgICAgICAubWF0LW1kYy1oZWFkZXItY2VsbCBkaXYsXG4gICAgICAgIC5tYXQtbWRjLWhlYWRlci1jZWxsIHNwYW4ge1xuICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxLjIgIWltcG9ydGFudDtcbiAgICAgICAgICBtYXJnaW46IDAgIWltcG9ydGFudDtcbiAgICAgICAgICBwYWRkaW5nOiAwICFpbXBvcnRhbnQ7XG4gICAgICAgICAgZm9udC1zaXplOiAxMnB4ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLy8gUmVzcG9uc2l2ZSBhZGp1c3RtZW50c1xuQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gIC5pbnRlZ3JhY2lvbi1jb250YWluZXIge1xuICAgIHBhZGRpbmc6IDFyZW07XG4gICAgXG4gICAgLnBhZ2UtaGVhZGVyIHtcbiAgICAgIC5wYWdlLXRpdGxlIHtcbiAgICAgICAgZm9udC1zaXplOiAxLjVyZW07XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIC5tZXRyaWNzLWdyaWQge1xuICAgICAgLmdyaWQge1xuICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmcjtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLnN0YXR1cy1zZWN0aW9uIHtcbiAgICAgIC5zdGF0dXMtY2FyZCB7XG4gICAgICAgIG1hdC1jYXJkLWNvbnRlbnQge1xuICAgICAgICAgIC5mbGV4IHtcbiAgICAgICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcbiAgICAgICAgICAgIGdhcDogMXJlbTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLy8gRXN0aWxvcyBwYXJhIGxhIHNlY2Npw4PCs24gZGUgZG9jdW1lbnRvc1xuLmRvY3VtZW50cy1zZWN0aW9uIHtcbiAgLmRvY3VtZW50LWl0ZW0ge1xuICAgIHRyYW5zaXRpb246IGFsbCAwLjJzIGVhc2U7XG4gICAgXG4gICAgJjpob3ZlciB7XG4gICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTFweCk7XG4gICAgICBib3gtc2hhZG93OiAwIDJweCA4cHggcmdiYSgwLDAsMCwwLjEpO1xuICAgIH1cbiAgfVxuICBcbiAgLmZpbGUtaW5wdXQtY29udGFpbmVyIHtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgXG4gICAgaW5wdXRbdHlwZT1cImZpbGVcIl0ge1xuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgb3BhY2l0eTogMDtcbiAgICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICAgIH1cbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }),

/***/ 6411:
/*!********************************************************************************!*\
  !*** ./src/app/pages/procesos/integracion/order-selection-dialog.component.ts ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OrderSelectionDialogComponent: () => (/* binding */ OrderSelectionDialogComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/dialog */ 17401);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_material_table__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/table */ 46798);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/checkbox */ 56658);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/form-field */ 51333);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/input */ 10026);
/* harmony import */ var _angular_material_paginator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/paginator */ 39687);
/* harmony import */ var _angular_material_radio__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/radio */ 92106);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/progress-spinner */ 33910);
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/select */ 96355);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/forms */ 28849);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ 54860);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../environments/environment */ 20553);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/core */ 55309);






























function OrderSelectionDialogComponent_div_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "mat-spinner", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "p", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Verificando pedidos existentes...");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
}
function OrderSelectionDialogComponent_div_7_th_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "th", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Seleccionar");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function OrderSelectionDialogComponent_div_7_td_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r22 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "td", 37)(1, "mat-radio-button", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("change", function OrderSelectionDialogComponent_div_7_td_14_Template_mat_radio_button_change_1_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r22);
      const order_r20 = restoredCtx.$implicit;
      const ctx_r21 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r21.selectOrder(order_r20));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const order_r20 = ctx.$implicit;
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("value", order_r20)("checked", ctx_r4.selectedOrder === order_r20);
  }
}
function OrderSelectionDialogComponent_div_7_th_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "th", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Order DMS");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function OrderSelectionDialogComponent_div_7_td_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "td", 37)(1, "div", 39)(2, "mat-icon", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "receipt");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "span", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const order_r23 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](order_r23.order_dms || order_r23.orderDMS || order_r23.numeroPedido || "N/A");
  }
}
function OrderSelectionDialogComponent_div_7_th_19_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "th", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "A\u00F1o");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function OrderSelectionDialogComponent_div_7_td_20_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const order_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](order_r24.year);
  }
}
function OrderSelectionDialogComponent_div_7_td_20_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "-");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function OrderSelectionDialogComponent_div_7_td_20_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "td", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, OrderSelectionDialogComponent_div_7_td_20_span_1_Template, 2, 1, "span", 42)(2, OrderSelectionDialogComponent_div_7_td_20_ng_template_2_Template, 2, 0, "ng-template", null, 43, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const order_r24 = ctx.$implicit;
    const _r27 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", order_r24.year)("ngIfElse", _r27);
  }
}
function OrderSelectionDialogComponent_div_7_th_22_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "th", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Modelo");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function OrderSelectionDialogComponent_div_7_td_23_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const order_r29 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](order_r29.model);
  }
}
function OrderSelectionDialogComponent_div_7_td_23_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Sin modelo");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function OrderSelectionDialogComponent_div_7_td_23_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "td", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, OrderSelectionDialogComponent_div_7_td_23_span_1_Template, 2, 1, "span", 42)(2, OrderSelectionDialogComponent_div_7_td_23_ng_template_2_Template, 2, 0, "ng-template", null, 46, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const order_r29 = ctx.$implicit;
    const _r32 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", order_r29.model)("ngIfElse", _r32);
  }
}
function OrderSelectionDialogComponent_div_7_th_25_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "th", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Versi\u00F3n");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function OrderSelectionDialogComponent_div_7_td_26_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const order_r34 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](order_r34.version);
  }
}
function OrderSelectionDialogComponent_div_7_td_26_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Sin versi\u00F3n");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function OrderSelectionDialogComponent_div_7_td_26_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "td", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, OrderSelectionDialogComponent_div_7_td_26_span_1_Template, 2, 1, "span", 42)(2, OrderSelectionDialogComponent_div_7_td_26_ng_template_2_Template, 2, 0, "ng-template", null, 47, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const order_r34 = ctx.$implicit;
    const _r37 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", order_r34.version)("ngIfElse", _r37);
  }
}
function OrderSelectionDialogComponent_div_7_th_28_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "th", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Color Exterior");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function OrderSelectionDialogComponent_div_7_td_29_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const order_r39 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", order_r39.external_color, " ");
  }
}
function OrderSelectionDialogComponent_div_7_td_29_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Sin color");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function OrderSelectionDialogComponent_div_7_td_29_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "td", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, OrderSelectionDialogComponent_div_7_td_29_span_1_Template, 2, 1, "span", 42)(2, OrderSelectionDialogComponent_div_7_td_29_ng_template_2_Template, 2, 0, "ng-template", null, 48, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const order_r39 = ctx.$implicit;
    const _r42 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", order_r39.external_color)("ngIfElse", _r42);
  }
}
function OrderSelectionDialogComponent_div_7_th_31_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "th", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Color Interior");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function OrderSelectionDialogComponent_div_7_td_32_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const order_r44 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", order_r44.internal_color, " ");
  }
}
function OrderSelectionDialogComponent_div_7_td_32_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Sin color");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function OrderSelectionDialogComponent_div_7_td_32_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "td", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, OrderSelectionDialogComponent_div_7_td_32_span_1_Template, 2, 1, "span", 42)(2, OrderSelectionDialogComponent_div_7_td_32_ng_template_2_Template, 2, 0, "ng-template", null, 49, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const order_r44 = ctx.$implicit;
    const _r47 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", order_r44.internal_color)("ngIfElse", _r47);
  }
}
function OrderSelectionDialogComponent_div_7_tr_33_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "tr", 50);
  }
}
function OrderSelectionDialogComponent_div_7_tr_34_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "tr", 51);
  }
}
function OrderSelectionDialogComponent_div_7_div_36_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 52)(1, "mat-icon", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "check_circle");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "p", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, "Todos los pedidos de Vanguardia ya existen en el sistema");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "p", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, "No hay pedidos nuevos para agregar");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
}
const _c0 = () => [5, 10, 20, 50];
function OrderSelectionDialogComponent_div_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r51 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div")(1, "div", 16)(2, "mat-form-field", 17)(3, "mat-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, "Buscar por n\u00FAmero de orden");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "input", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function OrderSelectionDialogComponent_div_7_Template_input_ngModelChange_5_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r51);
      const ctx_r50 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r50.searchTerm = $event);
    })("input", function OrderSelectionDialogComponent_div_7_Template_input_input_5_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r51);
      const ctx_r52 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r52.applyFilter());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "mat-icon", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](7, "search");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "p", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "div", 21)(11, "table", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerStart"](12, 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](13, OrderSelectionDialogComponent_div_7_th_13_Template, 2, 0, "th", 24)(14, OrderSelectionDialogComponent_div_7_td_14_Template, 2, 2, "td", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerStart"](15, 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](16, OrderSelectionDialogComponent_div_7_th_16_Template, 2, 0, "th", 24)(17, OrderSelectionDialogComponent_div_7_td_17_Template, 6, 1, "td", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerStart"](18, 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](19, OrderSelectionDialogComponent_div_7_th_19_Template, 2, 0, "th", 24)(20, OrderSelectionDialogComponent_div_7_td_20_Template, 4, 2, "td", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerStart"](21, 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](22, OrderSelectionDialogComponent_div_7_th_22_Template, 2, 0, "th", 24)(23, OrderSelectionDialogComponent_div_7_td_23_Template, 4, 2, "td", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerStart"](24, 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](25, OrderSelectionDialogComponent_div_7_th_25_Template, 2, 0, "th", 24)(26, OrderSelectionDialogComponent_div_7_td_26_Template, 4, 2, "td", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerStart"](27, 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](28, OrderSelectionDialogComponent_div_7_th_28_Template, 2, 0, "th", 24)(29, OrderSelectionDialogComponent_div_7_td_29_Template, 4, 2, "td", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerStart"](30, 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](31, OrderSelectionDialogComponent_div_7_th_31_Template, 2, 0, "th", 24)(32, OrderSelectionDialogComponent_div_7_td_32_Template, 4, 2, "td", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](33, OrderSelectionDialogComponent_div_7_tr_33_Template, 1, 0, "tr", 32)(34, OrderSelectionDialogComponent_div_7_tr_34_Template, 1, 0, "tr", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](35, "mat-paginator", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("page", function OrderSelectionDialogComponent_div_7_Template_mat_paginator_page_35_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r51);
      const ctx_r53 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r53.onPageChange($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](36, OrderSelectionDialogComponent_div_7_div_36_Template, 7, 0, "div", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx_r1.searchTerm);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" Se encontraron ", ctx_r1.filteredOrders.length, " pedidos nuevos disponibles. Selecciona uno: ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("dataSource", ctx_r1.paginatedOrders);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](22);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("matHeaderRowDef", ctx_r1.displayedColumns);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("matRowDefColumns", ctx_r1.displayedColumns);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("length", ctx_r1.filteredOrders.length)("pageSize", ctx_r1.pageSize)("pageSizeOptions", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction0"](9, _c0));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx_r1.loading && ctx_r1.filteredOrders.length === 0);
  }
}
function OrderSelectionDialogComponent_div_8_mat_option_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-option", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const process_r58 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("value", process_r58);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", process_r58.Name, " ");
  }
}
function OrderSelectionDialogComponent_div_8_mat_option_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-option", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const costumerType_r59 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("value", costumerType_r59);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", costumerType_r59.Name, " ");
  }
}
function OrderSelectionDialogComponent_div_8_mat_option_24_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-option", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const operationType_r60 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("value", operationType_r60);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", operationType_r60.Name, " ");
  }
}
function OrderSelectionDialogComponent_div_8_div_47_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 70)(1, "mat-icon", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "check_circle");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "span", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, "Configuraci\u00F3n v\u00E1lida");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
}
function OrderSelectionDialogComponent_div_8_div_47_div_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 73)(1, "mat-icon", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "error");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "span", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, "Esta combinaci\u00F3n no est\u00E1 habilitada");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
}
function OrderSelectionDialogComponent_div_8_div_47_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, OrderSelectionDialogComponent_div_8_div_47_div_1_Template, 5, 0, "div", 68)(2, OrderSelectionDialogComponent_div_8_div_47_div_2_Template, 5, 0, "div", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r57 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r57.isConfigurationValid());
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx_r57.isConfigurationValid());
  }
}
function OrderSelectionDialogComponent_div_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r64 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 56)(1, "h3", 57)(2, "mat-icon", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "settings");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, " Configuraci\u00F3n del File ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "div", 58)(6, "mat-form-field", 17)(7, "mat-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8, "Proceso");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "mat-select", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function OrderSelectionDialogComponent_div_8_Template_mat_select_ngModelChange_9_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r64);
      const ctx_r63 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r63.selectedProcess = $event);
    })("selectionChange", function OrderSelectionDialogComponent_div_8_Template_mat_select_selectionChange_9_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r64);
      const ctx_r65 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r65.onProcessChange());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](10, OrderSelectionDialogComponent_div_8_mat_option_10_Template, 2, 2, "mat-option", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "mat-icon", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12, "business");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](13, "mat-form-field", 17)(14, "mat-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](15, "Tipo de Cliente");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](16, "mat-select", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function OrderSelectionDialogComponent_div_8_Template_mat_select_ngModelChange_16_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r64);
      const ctx_r66 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r66.selectedCostumerType = $event);
    })("selectionChange", function OrderSelectionDialogComponent_div_8_Template_mat_select_selectionChange_16_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r64);
      const ctx_r67 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r67.onCostumerTypeChange());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](17, OrderSelectionDialogComponent_div_8_mat_option_17_Template, 2, 2, "mat-option", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](18, "mat-icon", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](19, "person");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](20, "mat-form-field", 17)(21, "mat-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](22, "Tipo de Operaci\u00F3n");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](23, "mat-select", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function OrderSelectionDialogComponent_div_8_Template_mat_select_ngModelChange_23_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r64);
      const ctx_r68 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r68.selectedOperationType = $event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](24, OrderSelectionDialogComponent_div_8_mat_option_24_Template, 2, 2, "mat-option", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](25, "mat-icon", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](26, "build");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](27, "div", 62)(28, "h4", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](29, "Resumen de configuraci\u00F3n:");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](30, "div", 64)(31, "p")(32, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](33, "Pedido:");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](34);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](35, "p")(36, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](37, "Proceso:");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](38);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](39, "p")(40, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](41, "Tipo Cliente:");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](42);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](43, "p")(44, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](45, "Operaci\u00F3n:");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](46);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](47, OrderSelectionDialogComponent_div_8_div_47_Template, 3, 2, "div", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx_r2.selectedProcess);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx_r2.processes);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx_r2.selectedCostumerType);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx_r2.availableCostumerTypes);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx_r2.selectedOperationType);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx_r2.availableOperationTypes);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx_r2.selectedOrder.order_dms || ctx_r2.selectedOrder.orderDMS || ctx_r2.selectedOrder.numeroPedido, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", (ctx_r2.selectedProcess == null ? null : ctx_r2.selectedProcess.Name) || "No seleccionado", "");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", (ctx_r2.selectedCostumerType == null ? null : ctx_r2.selectedCostumerType.Name) || "No seleccionado", "");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", (ctx_r2.selectedOperationType == null ? null : ctx_r2.selectedOperationType.Name) || "No seleccionado", "");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r2.selectedProcess && ctx_r2.selectedCostumerType && ctx_r2.selectedOperationType);
  }
}
class OrderSelectionDialogComponent {
  constructor(dialogRef, data, http) {
    this.dialogRef = dialogRef;
    this.data = data;
    this.http = http;
    this.displayedColumns = ['select', 'order_dms', 'year', 'model', 'version', 'colorExterior', 'colorInterior'];
    this.selectedOrder = null;
    this.searchTerm = '';
    this.filteredOrders = [];
    this.paginatedOrders = [];
    this.pageSize = 5;
    this.currentPage = 0;
    this.loading = true;
    this.originalOrders = [];
    // Datos para los combos
    this.processes = [];
    this.costumerTypes = [];
    this.operationTypes = [];
    this.allConfigurations = []; // Todas las configuraciones habilitadas
    // Selecciones del usuario
    this.selectedProcess = null;
    this.selectedCostumerType = null;
    this.selectedOperationType = null;
    // Opciones filtradas disponibles
    this.availableCostumerTypes = [];
    this.availableOperationTypes = [];
  }
  ngOnInit() {
    console.log('🎯 OrderSelectionDialogComponent ngOnInit');
    console.log('📊 Datos recibidos en el diálogo:', this.data);
    console.log('📊 Cantidad de orders:', this.data.orders?.length || 0);
    console.log('📊 Agency ID:', this.data.agencyId);
    console.log('📊 Primer order (ejemplo):', this.data.orders?.[0]);
    this.originalOrders = [...this.data.orders];
    this.loading = true;
    // Cargar datos para los combos
    this.loadComboData();
    // Verificar pedidos existentes antes de mostrar la tabla
    this.checkExistingOrders();
  }
  checkExistingOrders() {
    console.log('🔍 Verificando pedidos existentes en la tabla file...');
    // Obtener todos los pedidos existentes para la agencia
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpParams();
    params = params.set('agencyId', this.data.agencyId.toString());
    params = params.set('statusId', '1'); // ID para Integración
    params = params.set('ndCliente', this.data.ndCliente || '');
    this.http.get(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiBaseUrl}/api/files/by-agency`, {
      params
    }).subscribe({
      next: response => {
        console.log('📁 Files existentes encontrados:', response);
        let existingFiles = [];
        if (response && response.success && response.data && response.data.files) {
          existingFiles = response.data.files;
        }
        console.log('📊 Files existentes:', existingFiles.length);
        // Filtrar pedidos de Vanguardia que no existen en la tabla de file
        const newOrders = this.filterNewOrders(existingFiles);
        console.log('📊 Pedidos nuevos después del filtrado:', newOrders.length);
        this.filteredOrders = newOrders;
        this.loading = false;
        this.updatePaginatedOrders();
      },
      error: error => {
        console.error('❌ Error verificando pedidos existentes:', error);
        // Si hay error, mostrar todos los pedidos
        this.filteredOrders = [...this.originalOrders];
        this.loading = false;
        this.updatePaginatedOrders();
      }
    });
  }
  filterNewOrders(existingFiles) {
    // Crear un Set con los order_dms existentes para búsqueda rápida
    const existingOrderDms = new Set(existingFiles.map(file => file.order_dms?.toString().toLowerCase()));
    // Filtrar pedidos de Vanguardia que no existen en la tabla de file
    return this.originalOrders.filter(order => {
      const orderDms = (order.order_dms || order.orderDMS || order.numeroPedido || '').toString().toLowerCase();
      return !existingOrderDms.has(orderDms);
    });
  }
  applyFilter() {
    if (!this.searchTerm.trim()) {
      this.filteredOrders = [...this.originalOrders];
    } else {
      const searchLower = this.searchTerm.toLowerCase();
      this.filteredOrders = this.originalOrders.filter(order => {
        const orderDms = (order.order_dms || order.orderDMS || order.numeroPedido || '').toString().toLowerCase();
        return orderDms.includes(searchLower);
      });
    }
    this.currentPage = 0;
    this.updatePaginatedOrders();
  }
  updatePaginatedOrders() {
    console.log('🔄 Actualizando pedidos paginados...');
    console.log('📊 CurrentPage:', this.currentPage);
    console.log('📊 PageSize:', this.pageSize);
    console.log('📊 FilteredOrders length:', this.filteredOrders.length);
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    console.log('📊 StartIndex:', startIndex);
    console.log('📊 EndIndex:', endIndex);
    this.paginatedOrders = this.filteredOrders.slice(startIndex, endIndex);
    console.log('📊 PaginatedOrders result:', this.paginatedOrders.length);
    console.log('📊 PaginatedOrders data:', this.paginatedOrders);
  }
  onPageChange(event) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedOrders();
  }
  selectOrder(order) {
    this.selectedOrder = order;
  }
  onCancel() {
    this.dialogRef.close();
  }
  loadComboData() {
    console.log('🔄 Cargando configuraciones habilitadas...');
    // Cargar configuraciones habilitadas filtradas por agencia
    const url = `${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiBaseUrl}/api/configuration-process/enabled-by-agency/${this.data.agencyId}`;
    this.http.get(url).subscribe({
      next: response => {
        if (response && response.success && response.data) {
          this.processes = response.data.processes || [];
          this.costumerTypes = response.data.costumerTypes || [];
          this.operationTypes = response.data.operationTypes || [];
          this.allConfigurations = response.data.configurations || [];
          // Inicializar opciones disponibles
          this.availableCostumerTypes = [...this.costumerTypes];
          this.availableOperationTypes = [...this.operationTypes];
          console.log('✅ Configuraciones cargadas:');
          console.log('  - Procesos:', this.processes.length);
          console.log('  - Tipos de cliente:', this.costumerTypes.length);
          console.log('  - Tipos de operación:', this.operationTypes.length);
          console.log('  - Configuraciones totales:', this.allConfigurations.length);
        }
      },
      error: error => {
        console.error('❌ Error cargando configuraciones:', error);
        // Fallback: cargar datos individuales si falla el endpoint de configuraciones
        this.loadIndividualComboData();
      }
    });
  }
  loadIndividualComboData() {
    console.log('🔄 Cargando datos individuales como fallback...');
    // Cargar procesos
    this.http.get(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiBaseUrl}/api/process?enabled=1`).subscribe({
      next: response => {
        if (response && response.success && response.data) {
          this.processes = response.data.processes || response.data;
          console.log('✅ Procesos cargados:', this.processes.length);
        }
      },
      error: error => {
        console.error('❌ Error cargando procesos:', error);
      }
    });
    // Cargar tipos de cliente
    this.http.get(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiBaseUrl}/api/costumer-type?enabled=1`).subscribe({
      next: response => {
        if (response && response.success && response.data) {
          this.costumerTypes = response.data.costumerTypes || response.data;
          console.log('✅ Tipos de cliente cargados:', this.costumerTypes.length);
        }
      },
      error: error => {
        console.error('❌ Error cargando tipos de cliente:', error);
      }
    });
    // Cargar tipos de operación
    this.http.get(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiBaseUrl}/api/operation-type?enabled=1`).subscribe({
      next: response => {
        if (response && response.success && response.data) {
          this.operationTypes = response.data.operationTypes || response.data;
          console.log('✅ Tipos de operación cargados:', this.operationTypes.length);
        }
      },
      error: error => {
        console.error('❌ Error cargando tipos de operación:', error);
      }
    });
  }
  onProcessChange() {
    console.log('🔄 Proceso seleccionado:', this.selectedProcess);
    // Limpiar selecciones dependientes
    this.selectedCostumerType = null;
    this.selectedOperationType = null;
    // Filtrar tipos de cliente disponibles para este proceso
    this.filterCostumerTypesByProcess();
    // Resetear tipos de operación
    this.availableOperationTypes = [];
  }
  onCostumerTypeChange() {
    console.log('🔄 Tipo de cliente seleccionado:', this.selectedCostumerType);
    // Limpiar selección de operación
    this.selectedOperationType = null;
    // Filtrar tipos de operación disponibles para esta combinación proceso + tipo cliente
    this.filterOperationTypesByProcessAndCostumerType();
  }
  filterCostumerTypesByProcess() {
    if (!this.selectedProcess) {
      this.availableCostumerTypes = [...this.costumerTypes];
      return;
    }
    // Buscar configuraciones que tengan este proceso
    const configurationsWithProcess = this.allConfigurations.filter(config => config.IdProcess === this.selectedProcess.Id);
    // Extraer tipos de cliente únicos
    const costumerTypeIds = [...new Set(configurationsWithProcess.map(config => config.IdCostumerType))];
    // Filtrar tipos de cliente disponibles
    this.availableCostumerTypes = this.costumerTypes.filter(costumerType => costumerTypeIds.includes(costumerType.Id));
    console.log(`📋 Tipos de cliente disponibles para proceso "${this.selectedProcess.Name}":`, this.availableCostumerTypes.length);
  }
  filterOperationTypesByProcessAndCostumerType() {
    if (!this.selectedProcess || !this.selectedCostumerType) {
      this.availableOperationTypes = [...this.operationTypes];
      return;
    }
    // Buscar configuraciones que tengan esta combinación proceso + tipo cliente
    const configurationsWithProcessAndCostumer = this.allConfigurations.filter(config => config.IdProcess === this.selectedProcess.Id && config.IdCostumerType === this.selectedCostumerType.Id);
    // Extraer tipos de operación únicos
    const operationTypeIds = [...new Set(configurationsWithProcessAndCostumer.map(config => config.IdOperationType))];
    // Filtrar tipos de operación disponibles
    this.availableOperationTypes = this.operationTypes.filter(operationType => operationTypeIds.includes(operationType.Id));
    console.log(`📋 Tipos de operación disponibles para "${this.selectedProcess.Name}" + "${this.selectedCostumerType.Name}":`, this.availableOperationTypes.length);
  }
  isFormValid() {
    return this.selectedOrder && this.selectedProcess && this.selectedCostumerType && this.selectedOperationType && this.isConfigurationValid();
  }
  isConfigurationValid() {
    if (!this.selectedProcess || !this.selectedCostumerType || !this.selectedOperationType) {
      return false;
    }
    // Verificar que esta combinación existe en las configuraciones habilitadas
    const validConfiguration = this.allConfigurations.find(config => config.IdProcess === this.selectedProcess.Id && config.IdCostumerType === this.selectedCostumerType.Id && config.IdOperationType === this.selectedOperationType.Id);
    return !!validConfiguration;
  }
  onConfirm() {
    if (this.isFormValid()) {
      this.createFileFromVanguardia();
    }
  }
  createFileFromVanguardia() {
    console.log('🔄 Creando file desde Vanguardia...');
    const requestData = {
      order: this.selectedOrder,
      process: this.selectedProcess,
      costumerType: this.selectedCostumerType,
      operationType: this.selectedOperationType,
      clientId: this.data.ndCliente,
      agencyId: this.data.agencyId // ID de la agencia
    };

    console.log('📤 Datos enviados:', requestData);
    this.http.post(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiBaseUrl}/api/files/create-from-vanguardia-new`, requestData).subscribe({
      next: response => {
        if (response && response.success) {
          console.log('✅ File creado exitosamente:', response.data);
          this.dialogRef.close({
            success: true,
            fileId: response.data.fileId,
            documentsCreated: response.data.documentsCreated,
            message: response.message
          });
        } else {
          console.error('❌ Error en la respuesta:', response);
          this.dialogRef.close({
            success: false,
            message: response.message || 'Error al crear el file'
          });
        }
      },
      error: error => {
        console.error('❌ Error al crear file:', error);
        this.dialogRef.close({
          success: false,
          message: error.error?.message || 'Error de conexión al crear el file'
        });
      }
    });
  }
  static #_ = this.ɵfac = function OrderSelectionDialogComponent_Factory(t) {
    return new (t || OrderSelectionDialogComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_3__.MatDialogRef), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_3__.MAT_DIALOG_DATA), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpClient));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: OrderSelectionDialogComponent,
    selectors: [["app-order-selection-dialog"]],
    viewQuery: function OrderSelectionDialogComponent_Query(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵviewQuery"](_angular_material_paginator__WEBPACK_IMPORTED_MODULE_4__.MatPaginator, 5);
      }
      if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵloadQuery"]()) && (ctx.paginator = _t.first);
      }
    },
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵStandaloneFeature"]],
    decls: 21,
    vars: 5,
    consts: [[1, "dialog-container"], ["mat-dialog-title", "", 1, "text-xl", "font-semibold", "mb-4"], [1, "mr-2"], ["mat-dialog-content", "", 1, "mb-6", "dialog-content"], ["class", "flex justify-center py-8", 4, "ngIf"], [4, "ngIf"], ["class", "mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200", 4, "ngIf"], ["mat-dialog-actions", "", 1, "flex", "justify-between", "items-center"], [1, "text-sm", "text-gray-600"], [1, "flex", "gap-2"], ["mat-button", "", 1, "text-sm", 3, "click"], [1, "mr-1", 2, "font-size", "16px"], ["mat-raised-button", "", "color", "primary", 1, "text-sm", 3, "disabled", "click"], [1, "flex", "justify-center", "py-8"], ["diameter", "40"], [1, "ml-4", "text-gray-600"], [1, "mb-4"], ["appearance", "outline", 1, "w-full"], ["matInput", "", "placeholder", "Ingresa el n\u00FAmero de orden para buscar", "autocomplete", "off", 3, "ngModel", "ngModelChange", "input"], ["matSuffix", ""], [1, "text-gray-600", "mb-4", "order-info"], [1, "overflow-x-auto", "table-container"], ["mat-table", "", 1, "w-full", 3, "dataSource"], ["matColumnDef", "select"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "order_dms"], ["matColumnDef", "year"], ["matColumnDef", "model"], ["matColumnDef", "version"], ["matColumnDef", "colorExterior"], ["matColumnDef", "colorInterior"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", "class", "hover:bg-gray-50", 4, "matRowDef", "matRowDefColumns"], ["showFirstLastButtons", "", 3, "length", "pageSize", "pageSizeOptions", "page"], ["class", "text-center py-8", 4, "ngIf"], ["mat-header-cell", ""], ["mat-cell", ""], [3, "value", "checked", "change"], [1, "flex", "items-center", "order-info"], [1, "mr-1", "text-blue-600", 2, "font-size", "14px"], [1, "font-medium"], ["class", "order-info", 4, "ngIf", "ngIfElse"], ["noYear", ""], [1, "order-info"], [1, "text-gray-400", "italic", "order-info"], ["noModel", ""], ["noVersion", ""], ["noColorExterior", ""], ["noColorInterior", ""], ["mat-header-row", ""], ["mat-row", "", 1, "hover:bg-gray-50"], [1, "text-center", "py-8"], [1, "text-gray-400", "mb-2", 2, "font-size", "40px"], [1, "text-gray-500"], [1, "text-sm", "text-gray-400", "mt-2"], [1, "mt-6", "p-4", "bg-blue-50", "rounded-lg", "border", "border-blue-200"], [1, "text-lg", "font-semibold", "text-blue-800", "mb-4", "flex", "items-center"], [1, "grid", "grid-cols-1", "md:grid-cols-3", "gap-4"], ["required", "", 3, "ngModel", "ngModelChange", "selectionChange"], [3, "value", 4, "ngFor", "ngForOf"], ["required", "", 3, "ngModel", "ngModelChange"], [1, "mt-4", "p-3", "bg-white", "rounded", "border"], [1, "font-medium", "text-gray-700", "mb-2"], [1, "text-sm", "text-gray-600", "space-y-1"], ["class", "mt-3 pt-2 border-t", 4, "ngIf"], [3, "value"], [1, "mt-3", "pt-2", "border-t"], ["class", "flex items-center text-green-600", 4, "ngIf"], ["class", "flex items-center text-red-600", 4, "ngIf"], [1, "flex", "items-center", "text-green-600"], [1, "mr-2", 2, "font-size", "16px"], [1, "text-sm", "font-medium"], [1, "flex", "items-center", "text-red-600"]],
    template: function OrderSelectionDialogComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "h2", 1)(2, "mat-icon", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "receipt");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, " Seleccionar Pedido ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](6, OrderSelectionDialogComponent_div_6_Template, 4, 0, "div", 4)(7, OrderSelectionDialogComponent_div_7_Template, 37, 10, "div", 5)(8, OrderSelectionDialogComponent_div_8_Template, 48, 11, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "div", 7)(10, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "div", 9)(13, "button", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function OrderSelectionDialogComponent_Template_button_click_13_listener() {
          return ctx.onCancel();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "mat-icon", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](15, "close");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](16, " Cancelar ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](17, "button", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function OrderSelectionDialogComponent_Template_button_click_17_listener() {
          return ctx.onConfirm();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](18, "mat-icon", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](19, "add");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](20, " Crear File ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.selectedOrder && !ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx.selectedOrder ? "1 pedido seleccionado" : "Ning\u00FAn pedido seleccionado", " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", !ctx.isFormValid());
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_5__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_5__.NgIf, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_3__.MatDialogModule, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_3__.MatDialogTitle, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_3__.MatDialogActions, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_3__.MatDialogContent, _angular_material_button__WEBPACK_IMPORTED_MODULE_6__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_6__.MatButton, _angular_material_table__WEBPACK_IMPORTED_MODULE_7__.MatTableModule, _angular_material_table__WEBPACK_IMPORTED_MODULE_7__.MatTable, _angular_material_table__WEBPACK_IMPORTED_MODULE_7__.MatHeaderCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_7__.MatHeaderRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_7__.MatColumnDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_7__.MatCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_7__.MatRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_7__.MatHeaderCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_7__.MatCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_7__.MatHeaderRow, _angular_material_table__WEBPACK_IMPORTED_MODULE_7__.MatRow, _angular_material_icon__WEBPACK_IMPORTED_MODULE_8__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_8__.MatIcon, _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_9__.MatCheckboxModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_10__.MatFormFieldModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_10__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_10__.MatLabel, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_10__.MatSuffix, _angular_material_input__WEBPACK_IMPORTED_MODULE_11__.MatInputModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_11__.MatInput, _angular_material_paginator__WEBPACK_IMPORTED_MODULE_4__.MatPaginatorModule, _angular_material_paginator__WEBPACK_IMPORTED_MODULE_4__.MatPaginator, _angular_material_radio__WEBPACK_IMPORTED_MODULE_12__.MatRadioModule, _angular_material_radio__WEBPACK_IMPORTED_MODULE_12__.MatRadioButton, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_13__.MatProgressSpinnerModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_13__.MatProgressSpinner, _angular_material_select__WEBPACK_IMPORTED_MODULE_14__.MatSelectModule, _angular_material_select__WEBPACK_IMPORTED_MODULE_14__.MatSelect, _angular_material_core__WEBPACK_IMPORTED_MODULE_15__.MatOption, _angular_forms__WEBPACK_IMPORTED_MODULE_16__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_16__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_16__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_16__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_16__.NgModel],
    styles: [".mat-mdc-dialog-container[_ngcontent-%COMP%] {\n      --mdc-dialog-container-color: white;\n    }\n    \n    //[_ngcontent-%COMP%]   Contenedor[_ngcontent-%COMP%]   principal[_ngcontent-%COMP%]   del[_ngcontent-%COMP%]   di\u00E1logo[_ngcontent-%COMP%]   .dialog-container[_ngcontent-%COMP%] {\n      width: 100%;\n      min-width: 800px;\n      max-width: 1200px;\n      padding: 0;\n      display: flex;\n      flex-direction: column;\n    }\n    \n    //[_ngcontent-%COMP%]   Contenedor[_ngcontent-%COMP%]   de[_ngcontent-%COMP%]   contenido[_ngcontent-%COMP%]   .dialog-content[_ngcontent-%COMP%] {\n      flex: 1;\n      overflow: hidden;\n      display: flex;\n      flex-direction: column;\n    }\n    \n    //[_ngcontent-%COMP%]   Contenedor[_ngcontent-%COMP%]   de[_ngcontent-%COMP%]   la[_ngcontent-%COMP%]   tabla[_ngcontent-%COMP%]   .table-container[_ngcontent-%COMP%] {\n      flex: 1;\n      overflow: auto;\n      min-height: 0;\n    }\n    \n    //   Estilos   espec\u00EDficos   para   las   tablas   [_nghost-%COMP%]     {\n      mat-table {\n        .mat-mdc-table {\n          border-collapse: separate !important;\n          border-spacing: 0 !important;\n          width: 100% !important;\n        }\n        \n        // Altura compacta para las filas\n        .mat-mdc-row {\n          min-height: 32px !important;\n          height: 32px !important;\n          max-height: 32px !important;\n          border-bottom: 1px solid rgba(0,0,0,.12) !important;\n          display: table-row !important;\n          \n          &:hover {\n            background-color: #f1f5f9 !important;\n          }\n        }\n        \n        .mat-mdc-header-row {\n          min-height: 32px !important;\n          height: 32px !important;\n          max-height: 32px !important;\n          border-bottom: 1px solid rgba(0,0,0,.12) !important;\n          display: table-row !important;\n          background-color: #f8fafc !important;\n        }\n        \n        // Padding compacto para las celdas\n        .mat-mdc-cell {\n          padding: 4px 8px !important;\n          vertical-align: middle !important;\n          line-height: 1.2 !important;\n          font-size: 12px !important;\n          border: none !important;\n          height: 32px !important;\n          max-height: 32px !important;\n          overflow: hidden !important;\n          white-space: nowrap !important;\n          text-overflow: ellipsis !important;\n          text-align: left !important;\n        }\n        \n        .mat-mdc-header-cell {\n          padding: 4px 8px !important;\n          vertical-align: middle !important;\n          line-height: 1.2 !important;\n          font-size: 12px !important;\n          font-weight: 500 !important;\n          border: none !important;\n          height: 32px !important;\n          max-height: 32px !important;\n          overflow: hidden !important;\n          white-space: nowrap !important;\n          text-overflow: ellipsis !important;\n          text-align: left !important;\n        }\n        \n        // Eliminar cualquier espaciado extra\n        .mat-mdc-cell, .mat-mdc-header-cell {\n          margin: 0 !important;\n          border-spacing: 0 !important;\n        }\n      }\n      \n      // Estilos espec\u00EDficos para elementos que puedan estar causando diferencias\n      .mat-mdc-table-container {\n        overflow: hidden !important;\n      }\n      \n      .mat-mdc-table-wrapper {\n        overflow: hidden !important;\n      }\n      \n      // Estilos espec\u00EDficos para elementos internos\n      .mat-mdc-cell div,\n      .mat-mdc-cell span,\n      .mat-mdc-header-cell div,\n      .mat-mdc-header-cell span {\n        line-height: 1.2 !important;\n        margin: 0 !important;\n        padding: 0 !important;\n        font-size: 12px !important;\n      }\n    }\n    \n    //[_ngcontent-%COMP%]   Estilos[_ngcontent-%COMP%]   para[_ngcontent-%COMP%]   el[_ngcontent-%COMP%]   di\u00E1logo[_ngcontent-%COMP%]   .dialog-content[_ngcontent-%COMP%] {\n      max-height: 60vh;\n      min-height: 400px;\n      overflow-y: auto;\n    }\n    \n    .order-info[_ngcontent-%COMP%] {\n      font-size: 12px;\n      line-height: 1.2;\n    }\n    \n    //   Estilos   espec\u00EDficos   para   columnas   [_nghost-%COMP%]     {\n      mat-table {\n        .mat-column-select {\n          min-width: 50px !important;\n          width: 8% !important;\n        }\n        \n        .mat-column-order_dms {\n          min-width: 120px !important;\n          width: 20% !important;\n        }\n        \n        .mat-column-year {\n          min-width: 80px !important;\n          width: 12% !important;\n        }\n        \n        .mat-column-model {\n          min-width: 120px !important;\n          width: 18% !important;\n        }\n        \n        .mat-column-version {\n          min-width: 100px !important;\n          width: 15% !important;\n        }\n        \n        .mat-column-colorExterior {\n          min-width: 120px !important;\n          width: 15% !important;\n        }\n        \n        .mat-column-colorInterior {\n          min-width: 120px !important;\n          width: 15% !important;\n        }\n      }\n    }\n  \n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvcHJvY2Vzb3MvaW50ZWdyYWNpb24vb3JkZXItc2VsZWN0aW9uLWRpYWxvZy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtJQUNJO01BQ0UsbUNBQW1DO0lBQ3JDOztJQUVBOztNQUVFLFdBQVc7TUFDWCxnQkFBZ0I7TUFDaEIsaUJBQWlCO01BQ2pCLFVBQVU7TUFDVixhQUFhO01BQ2Isc0JBQXNCO0lBQ3hCOztJQUVBOztNQUVFLE9BQU87TUFDUCxnQkFBZ0I7TUFDaEIsYUFBYTtNQUNiLHNCQUFzQjtJQUN4Qjs7SUFFQTs7TUFFRSxPQUFPO01BQ1AsY0FBYztNQUNkLGFBQWE7SUFDZjs7SUFFQTs7TUFFRTtRQUNFO1VBQ0Usb0NBQW9DO1VBQ3BDLDRCQUE0QjtVQUM1QixzQkFBc0I7UUFDeEI7O1FBRUE7O1VBRUUsMkJBQTJCO1VBQzNCLHVCQUF1QjtVQUN2QiwyQkFBMkI7VUFDM0IsbURBQW1EO1VBQ25ELDZCQUE2Qjs7VUFFN0I7WUFDRSxvQ0FBb0M7VUFDdEM7UUFDRjs7UUFFQTtVQUNFLDJCQUEyQjtVQUMzQix1QkFBdUI7VUFDdkIsMkJBQTJCO1VBQzNCLG1EQUFtRDtVQUNuRCw2QkFBNkI7VUFDN0Isb0NBQW9DO1FBQ3RDOztRQUVBOztVQUVFLDJCQUEyQjtVQUMzQixpQ0FBaUM7VUFDakMsMkJBQTJCO1VBQzNCLDBCQUEwQjtVQUMxQix1QkFBdUI7VUFDdkIsdUJBQXVCO1VBQ3ZCLDJCQUEyQjtVQUMzQiwyQkFBMkI7VUFDM0IsOEJBQThCO1VBQzlCLGtDQUFrQztVQUNsQywyQkFBMkI7UUFDN0I7O1FBRUE7VUFDRSwyQkFBMkI7VUFDM0IsaUNBQWlDO1VBQ2pDLDJCQUEyQjtVQUMzQiwwQkFBMEI7VUFDMUIsMkJBQTJCO1VBQzNCLHVCQUF1QjtVQUN2Qix1QkFBdUI7VUFDdkIsMkJBQTJCO1VBQzNCLDJCQUEyQjtVQUMzQiw4QkFBOEI7VUFDOUIsa0NBQWtDO1VBQ2xDLDJCQUEyQjtRQUM3Qjs7UUFFQTs7VUFFRSxvQkFBb0I7VUFDcEIsNEJBQTRCO1FBQzlCO01BQ0Y7O01BRUE7O1FBRUUsMkJBQTJCO01BQzdCOztNQUVBO1FBQ0UsMkJBQTJCO01BQzdCOztNQUVBOzs7OztRQUtFLDJCQUEyQjtRQUMzQixvQkFBb0I7UUFDcEIscUJBQXFCO1FBQ3JCLDBCQUEwQjtNQUM1QjtJQUNGOztJQUVBOztNQUVFLGdCQUFnQjtNQUNoQixpQkFBaUI7TUFDakIsZ0JBQWdCO0lBQ2xCOztJQUVBO01BQ0UsZUFBZTtNQUNmLGdCQUFnQjtJQUNsQjs7SUFFQTs7TUFFRTtRQUNFO1VBQ0UsMEJBQTBCO1VBQzFCLG9CQUFvQjtRQUN0Qjs7UUFFQTtVQUNFLDJCQUEyQjtVQUMzQixxQkFBcUI7UUFDdkI7O1FBRUE7VUFDRSwwQkFBMEI7VUFDMUIscUJBQXFCO1FBQ3ZCOztRQUVBO1VBQ0UsMkJBQTJCO1VBQzNCLHFCQUFxQjtRQUN2Qjs7UUFFQTtVQUNFLDJCQUEyQjtVQUMzQixxQkFBcUI7UUFDdkI7O1FBRUE7VUFDRSwyQkFBMkI7VUFDM0IscUJBQXFCO1FBQ3ZCOztRQUVBO1VBQ0UsMkJBQTJCO1VBQzNCLHFCQUFxQjtRQUN2QjtNQUNGO0lBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJcbiAgICAubWF0LW1kYy1kaWFsb2ctY29udGFpbmVyIHtcbiAgICAgIC0tbWRjLWRpYWxvZy1jb250YWluZXItY29sb3I6IHdoaXRlO1xuICAgIH1cbiAgICBcbiAgICAvLyBDb250ZW5lZG9yIHByaW5jaXBhbCBkZWwgZGnDg8KhbG9nb1xuICAgIC5kaWFsb2ctY29udGFpbmVyIHtcbiAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgbWluLXdpZHRoOiA4MDBweDtcbiAgICAgIG1heC13aWR0aDogMTIwMHB4O1xuICAgICAgcGFkZGluZzogMDtcbiAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIH1cbiAgICBcbiAgICAvLyBDb250ZW5lZG9yIGRlIGNvbnRlbmlkb1xuICAgIC5kaWFsb2ctY29udGVudCB7XG4gICAgICBmbGV4OiAxO1xuICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIH1cbiAgICBcbiAgICAvLyBDb250ZW5lZG9yIGRlIGxhIHRhYmxhXG4gICAgLnRhYmxlLWNvbnRhaW5lciB7XG4gICAgICBmbGV4OiAxO1xuICAgICAgb3ZlcmZsb3c6IGF1dG87XG4gICAgICBtaW4taGVpZ2h0OiAwO1xuICAgIH1cbiAgICBcbiAgICAvLyBFc3RpbG9zIGVzcGVjw4PCrWZpY29zIHBhcmEgbGFzIHRhYmxhc1xuICAgIDpob3N0IDo6bmctZGVlcCB7XG4gICAgICBtYXQtdGFibGUge1xuICAgICAgICAubWF0LW1kYy10YWJsZSB7XG4gICAgICAgICAgYm9yZGVyLWNvbGxhcHNlOiBzZXBhcmF0ZSAhaW1wb3J0YW50O1xuICAgICAgICAgIGJvcmRlci1zcGFjaW5nOiAwICFpbXBvcnRhbnQ7XG4gICAgICAgICAgd2lkdGg6IDEwMCUgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gQWx0dXJhIGNvbXBhY3RhIHBhcmEgbGFzIGZpbGFzXG4gICAgICAgIC5tYXQtbWRjLXJvdyB7XG4gICAgICAgICAgbWluLWhlaWdodDogMzJweCAhaW1wb3J0YW50O1xuICAgICAgICAgIGhlaWdodDogMzJweCAhaW1wb3J0YW50O1xuICAgICAgICAgIG1heC1oZWlnaHQ6IDMycHggIWltcG9ydGFudDtcbiAgICAgICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgcmdiYSgwLDAsMCwuMTIpICFpbXBvcnRhbnQ7XG4gICAgICAgICAgZGlzcGxheTogdGFibGUtcm93ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgXG4gICAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjFmNWY5ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAubWF0LW1kYy1oZWFkZXItcm93IHtcbiAgICAgICAgICBtaW4taGVpZ2h0OiAzMnB4ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgaGVpZ2h0OiAzMnB4ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgbWF4LWhlaWdodDogMzJweCAhaW1wb3J0YW50O1xuICAgICAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCByZ2JhKDAsMCwwLC4xMikgIWltcG9ydGFudDtcbiAgICAgICAgICBkaXNwbGF5OiB0YWJsZS1yb3cgIWltcG9ydGFudDtcbiAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjhmYWZjICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIFBhZGRpbmcgY29tcGFjdG8gcGFyYSBsYXMgY2VsZGFzXG4gICAgICAgIC5tYXQtbWRjLWNlbGwge1xuICAgICAgICAgIHBhZGRpbmc6IDRweCA4cHggIWltcG9ydGFudDtcbiAgICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlICFpbXBvcnRhbnQ7XG4gICAgICAgICAgbGluZS1oZWlnaHQ6IDEuMiAhaW1wb3J0YW50O1xuICAgICAgICAgIGZvbnQtc2l6ZTogMTJweCAhaW1wb3J0YW50O1xuICAgICAgICAgIGJvcmRlcjogbm9uZSAhaW1wb3J0YW50O1xuICAgICAgICAgIGhlaWdodDogMzJweCAhaW1wb3J0YW50O1xuICAgICAgICAgIG1heC1oZWlnaHQ6IDMycHggIWltcG9ydGFudDtcbiAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuICFpbXBvcnRhbnQ7XG4gICAgICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcCAhaW1wb3J0YW50O1xuICAgICAgICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzICFpbXBvcnRhbnQ7XG4gICAgICAgICAgdGV4dC1hbGlnbjogbGVmdCAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAubWF0LW1kYy1oZWFkZXItY2VsbCB7XG4gICAgICAgICAgcGFkZGluZzogNHB4IDhweCAhaW1wb3J0YW50O1xuICAgICAgICAgIHZlcnRpY2FsLWFsaWduOiBtaWRkbGUgIWltcG9ydGFudDtcbiAgICAgICAgICBsaW5lLWhlaWdodDogMS4yICFpbXBvcnRhbnQ7XG4gICAgICAgICAgZm9udC1zaXplOiAxMnB4ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDUwMCAhaW1wb3J0YW50O1xuICAgICAgICAgIGJvcmRlcjogbm9uZSAhaW1wb3J0YW50O1xuICAgICAgICAgIGhlaWdodDogMzJweCAhaW1wb3J0YW50O1xuICAgICAgICAgIG1heC1oZWlnaHQ6IDMycHggIWltcG9ydGFudDtcbiAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuICFpbXBvcnRhbnQ7XG4gICAgICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcCAhaW1wb3J0YW50O1xuICAgICAgICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzICFpbXBvcnRhbnQ7XG4gICAgICAgICAgdGV4dC1hbGlnbjogbGVmdCAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBFbGltaW5hciBjdWFscXVpZXIgZXNwYWNpYWRvIGV4dHJhXG4gICAgICAgIC5tYXQtbWRjLWNlbGwsIC5tYXQtbWRjLWhlYWRlci1jZWxsIHtcbiAgICAgICAgICBtYXJnaW46IDAgIWltcG9ydGFudDtcbiAgICAgICAgICBib3JkZXItc3BhY2luZzogMCAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIEVzdGlsb3MgZXNwZWPDg8KtZmljb3MgcGFyYSBlbGVtZW50b3MgcXVlIHB1ZWRhbiBlc3RhciBjYXVzYW5kbyBkaWZlcmVuY2lhc1xuICAgICAgLm1hdC1tZGMtdGFibGUtY29udGFpbmVyIHtcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbiAhaW1wb3J0YW50O1xuICAgICAgfVxuICAgICAgXG4gICAgICAubWF0LW1kYy10YWJsZS13cmFwcGVyIHtcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbiAhaW1wb3J0YW50O1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBFc3RpbG9zIGVzcGVjw4PCrWZpY29zIHBhcmEgZWxlbWVudG9zIGludGVybm9zXG4gICAgICAubWF0LW1kYy1jZWxsIGRpdixcbiAgICAgIC5tYXQtbWRjLWNlbGwgc3BhbixcbiAgICAgIC5tYXQtbWRjLWhlYWRlci1jZWxsIGRpdixcbiAgICAgIC5tYXQtbWRjLWhlYWRlci1jZWxsIHNwYW4ge1xuICAgICAgICBsaW5lLWhlaWdodDogMS4yICFpbXBvcnRhbnQ7XG4gICAgICAgIG1hcmdpbjogMCAhaW1wb3J0YW50O1xuICAgICAgICBwYWRkaW5nOiAwICFpbXBvcnRhbnQ7XG4gICAgICAgIGZvbnQtc2l6ZTogMTJweCAhaW1wb3J0YW50O1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBFc3RpbG9zIHBhcmEgZWwgZGnDg8KhbG9nb1xuICAgIC5kaWFsb2ctY29udGVudCB7XG4gICAgICBtYXgtaGVpZ2h0OiA2MHZoO1xuICAgICAgbWluLWhlaWdodDogNDAwcHg7XG4gICAgICBvdmVyZmxvdy15OiBhdXRvO1xuICAgIH1cbiAgICBcbiAgICAub3JkZXItaW5mbyB7XG4gICAgICBmb250LXNpemU6IDEycHg7XG4gICAgICBsaW5lLWhlaWdodDogMS4yO1xuICAgIH1cbiAgICBcbiAgICAvLyBFc3RpbG9zIGVzcGVjw4PCrWZpY29zIHBhcmEgY29sdW1uYXNcbiAgICA6aG9zdCA6Om5nLWRlZXAge1xuICAgICAgbWF0LXRhYmxlIHtcbiAgICAgICAgLm1hdC1jb2x1bW4tc2VsZWN0IHtcbiAgICAgICAgICBtaW4td2lkdGg6IDUwcHggIWltcG9ydGFudDtcbiAgICAgICAgICB3aWR0aDogOCUgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLm1hdC1jb2x1bW4tb3JkZXJfZG1zIHtcbiAgICAgICAgICBtaW4td2lkdGg6IDEyMHB4ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgd2lkdGg6IDIwJSAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAubWF0LWNvbHVtbi15ZWFyIHtcbiAgICAgICAgICBtaW4td2lkdGg6IDgwcHggIWltcG9ydGFudDtcbiAgICAgICAgICB3aWR0aDogMTIlICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC5tYXQtY29sdW1uLW1vZGVsIHtcbiAgICAgICAgICBtaW4td2lkdGg6IDEyMHB4ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgd2lkdGg6IDE4JSAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAubWF0LWNvbHVtbi12ZXJzaW9uIHtcbiAgICAgICAgICBtaW4td2lkdGg6IDEwMHB4ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgd2lkdGg6IDE1JSAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAubWF0LWNvbHVtbi1jb2xvckV4dGVyaW9yIHtcbiAgICAgICAgICBtaW4td2lkdGg6IDEyMHB4ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgd2lkdGg6IDE1JSAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAubWF0LWNvbHVtbi1jb2xvckludGVyaW9yIHtcbiAgICAgICAgICBtaW4td2lkdGg6IDEyMHB4ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgd2lkdGg6IDE1JSAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAiXSwic291cmNlUm9vdCI6IiJ9 */"]
  });
}

/***/ })

}]);
//# sourceMappingURL=src_app_pages_procesos_integracion_integracion_component_ts.js.map