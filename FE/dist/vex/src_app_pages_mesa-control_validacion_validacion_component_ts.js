"use strict";
(self["webpackChunkvex"] = self["webpackChunkvex"] || []).push([["src_app_pages_mesa-control_validacion_validacion_component_ts"],{

/***/ 61037:
/*!********************************************!*\
  !*** ./src/app/core/constants/catalogs.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FASES_CATALOG: () => (/* binding */ FASES_CATALOG),
/* harmony export */   getFaseIdByValue: () => (/* binding */ getFaseIdByValue),
/* harmony export */   getFaseNameById: () => (/* binding */ getFaseNameById),
/* harmony export */   getFaseValueById: () => (/* binding */ getFaseValueById),
/* harmony export */   getFasesForFilter: () => (/* binding */ getFasesForFilter)
/* harmony export */ });
/**
 * Catálogos fijos del sistema
 * Contiene datos que no cambian frecuentemente y se usan en múltiples componentes
 */
/**
 * Catálogo de fases del sistema
 * Mapea los IdCurrentState con sus nombres correspondientes
 */
const FASES_CATALOG = [{
  id: 1,
  name: 'Integración',
  value: '1'
}, {
  id: 2,
  name: 'Liquidación',
  value: '2'
}, {
  id: 3,
  name: 'Liberación',
  value: '3'
}, {
  id: 4,
  name: 'Liberado',
  value: '4'
}, {
  id: 5,
  name: 'Cancelado',
  value: '5'
}, {
  id: 6,
  name: 'Liberado por Excepción',
  value: '6'
}];
/**
 * Obtener el nombre de una fase por su ID
 */
function getFaseNameById(id) {
  const fase = FASES_CATALOG.find(f => f.id === id);
  return fase ? fase.name : 'Desconocido';
}
/**
 * Obtener el valor de una fase por su ID
 */
function getFaseValueById(id) {
  const fase = FASES_CATALOG.find(f => f.id === id);
  return fase ? fase.value || '' : '';
}
/**
 * Obtener el ID de una fase por su valor
 */
function getFaseIdByValue(value) {
  const fase = FASES_CATALOG.find(f => f.value === value);
  return fase ? fase.id : 0;
}
/**
 * Obtener todas las fases para usar en filtros
 */
function getFasesForFilter() {
  return FASES_CATALOG.map(fase => ({
    id: fase.id,
    name: fase.name,
    value: fase.value
  }));
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

/***/ 64293:
/*!**************************************************************************************************************!*\
  !*** ./src/app/pages/mesa-control/validacion/aprobar-documento-dialog/aprobar-documento-dialog.component.ts ***!
  \**************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AprobarDocumentoDialogComponent: () => (/* binding */ AprobarDocumentoDialogComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ 28849);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/dialog */ 17401);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/form-field */ 51333);
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/select */ 96355);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/input */ 10026);
/* harmony import */ var _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/datepicker */ 82226);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/core */ 55309);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 61699);





















function AprobarDocumentoDialogComponent_mat_option_46_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "mat-option", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const opcion_r3 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("value", opcion_r3.value);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", opcion_r3.label, " ");
  }
}
function AprobarDocumentoDialogComponent_mat_form_field_47_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "mat-form-field", 10)(1, "mat-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Fecha de expiraci\u00F3n");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "input", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function AprobarDocumentoDialogComponent_mat_form_field_47_Template_input_ngModelChange_3_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r6);
      const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r5.fechaExpiracion = $event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](4, "mat-datepicker-toggle", 19)(5, "mat-datepicker", null, 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "mat-hint");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "Este documento requiere fecha de expiraci\u00F3n");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](6);
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("matDatepicker", _r4)("ngModel", ctx_r1.fechaExpiracion);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("for", _r4);
  }
}
function AprobarDocumentoDialogComponent_mat_form_field_48_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "mat-form-field", 10)(1, "mat-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Comentario");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "textarea", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function AprobarDocumentoDialogComponent_mat_form_field_48_Template_textarea_ngModelChange_3_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r8);
      const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r7.comentario = $event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "mat-hint");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "El comentario es obligatorio para documentos rechazados");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx_r2.comentario);
  }
}
class AprobarDocumentoDialogComponent {
  constructor(dialogRef, data) {
    this.dialogRef = dialogRef;
    this.data = data;
    this.estatusSeleccionado = '';
    this.comentario = '';
    this.fechaExpiracion = null;
    this.opcionesEstatus = [{
      value: 'aprobado',
      label: 'Aprobado'
    }, {
      value: 'rechazado',
      label: 'Rechazado'
    }];
  }
  onCancelar() {
    this.dialogRef.close();
  }
  onConfirmar() {
    if (!this.estatusSeleccionado) {
      return;
    }
    // Si el documento requiere expiración y está siendo aprobado, validar fecha
    if (this.requiereExpiracion && this.estatusSeleccionado === 'aprobado' && !this.fechaExpiracion) {
      return;
    }
    // Si está siendo rechazado, validar comentario
    if (this.estatusSeleccionado === 'rechazado' && !this.comentario.trim()) {
      return;
    }
    const result = {
      aprobado: this.estatusSeleccionado === 'aprobado',
      estatus: this.estatusSeleccionado,
      comentario: this.comentario.trim() || undefined,
      fechaExpiracion: this.fechaExpiracion || undefined
    };
    this.dialogRef.close(result);
  }
  get puedeConfirmar() {
    if (!this.estatusSeleccionado) {
      return false;
    }
    // Si requiere expiración y está siendo aprobado, debe tener fecha
    if (this.requiereExpiracion && this.estatusSeleccionado === 'aprobado') {
      return this.fechaExpiracion !== null;
    }
    // Si está siendo rechazado, debe tener comentario
    if (this.estatusSeleccionado === 'rechazado') {
      return this.comentario.trim() !== '';
    }
    return true;
  }
  get requiereExpiracion() {
    return this.data.documento.ReqExpiration == 1 || this.data.documento.ReqExpiration === "1";
  }
  static #_ = this.ɵfac = function AprobarDocumentoDialogComponent_Factory(t) {
    return new (t || AprobarDocumentoDialogComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__.MatDialogRef), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__.MAT_DIALOG_DATA));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
    type: AprobarDocumentoDialogComponent,
    selectors: [["app-aprobar-documento-dialog"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵStandaloneFeature"]],
    decls: 54,
    vars: 12,
    consts: [[1, "p-6"], [1, "flex", "items-center", "justify-between", "mb-6"], [1, "text-xl", "font-semibold", "text-gray-800"], ["mat-icon-button", "", 1, "text-gray-500", "hover:text-gray-700", 3, "click"], [1, "mb-6", "p-4", "bg-gray-50", "rounded-lg"], [1, "text-sm", "font-medium", "text-gray-600", "mb-2"], [1, "grid", "grid-cols-2", "gap-4", "text-sm"], [1, "font-medium", "text-gray-700"], [1, "ml-2", "text-gray-600"], [1, "space-y-4"], ["appearance", "outline", 1, "w-full"], ["required", "", 3, "ngModel", "ngModelChange"], [3, "value", 4, "ngFor", "ngForOf"], ["appearance", "outline", "class", "w-full", 4, "ngIf"], [1, "flex", "justify-end", "mt-6", "pt-4", "border-t", "border-gray-200", "space-x-3"], ["mat-button", "", 1, "text-gray-600", 3, "click"], ["mat-raised-button", "", "color", "primary", 3, "disabled", "click"], [3, "value"], ["matInput", "", "placeholder", "Seleccionar fecha de expiraci\u00F3n", "required", "", 3, "matDatepicker", "ngModel", "ngModelChange"], ["matIconSuffix", "", 3, "for"], ["picker", ""], ["matInput", "", "rows", "3", "placeholder", "Agregar comentario sobre el rechazo...", "required", "", 3, "ngModel", "ngModelChange"]],
    template: function AprobarDocumentoDialogComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h2", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Aprobar/Rechazar Documento");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "button", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function AprobarDocumentoDialogComponent_Template_button_click_4_listener() {
          return ctx.onCancelar();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, "close");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 4)(8, "h3", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "Documento a evaluar:");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div", 6)(11, "div")(12, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "Documento:");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "span", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "div")(17, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](18, "Proceso:");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "span", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "div")(22, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23, "Fase:");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "span", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](25);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "div")(27, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](28, "Fecha:");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "span", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](30);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "div")(32, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](33, "Requerido:");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](34, "span", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](35);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](36, "div")(37, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](38, "Requiere Expiraci\u00F3n:");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](39, "span", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](40);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](41, "div", 9)(42, "mat-form-field", 10)(43, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](44, "Estatus");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](45, "mat-select", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function AprobarDocumentoDialogComponent_Template_mat_select_ngModelChange_45_listener($event) {
          return ctx.estatusSeleccionado = $event;
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](46, AprobarDocumentoDialogComponent_mat_option_46_Template, 2, 2, "mat-option", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](47, AprobarDocumentoDialogComponent_mat_form_field_47_Template, 9, 3, "mat-form-field", 13)(48, AprobarDocumentoDialogComponent_mat_form_field_48_Template, 6, 1, "mat-form-field", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](49, "div", 14)(50, "button", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function AprobarDocumentoDialogComponent_Template_button_click_50_listener() {
          return ctx.onCancelar();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](51, " Cancelar ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](52, "button", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function AprobarDocumentoDialogComponent_Template_button_click_52_listener() {
          return ctx.onConfirmar();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](53);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.data.documento.documento);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.data.documento.proceso);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.data.documento.fase);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.data.documento.fecha);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.data.documento.requerido == 1 ? "S\u00ED" : "No");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.data.documento.ReqExpiration == 1 || ctx.data.documento.ReqExpiration === "1" ? "S\u00ED" : "No");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.estatusSeleccionado);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.opcionesEstatus);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.requiereExpiracion && ctx.estatusSeleccionado === "aprobado");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.estatusSeleccionado === "rechazado");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", !ctx.puedeConfirmar);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx.estatusSeleccionado === "aprobado" ? "Aprobar" : ctx.estatusSeleccionado === "rechazado" ? "Rechazar" : "Confirmar", " ");
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgModel, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__.MatDialogModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_4__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_4__.MatButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_4__.MatIconButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__.MatIcon, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__.MatFormFieldModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__.MatLabel, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__.MatHint, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__.MatSuffix, _angular_material_select__WEBPACK_IMPORTED_MODULE_7__.MatSelectModule, _angular_material_select__WEBPACK_IMPORTED_MODULE_7__.MatSelect, _angular_material_core__WEBPACK_IMPORTED_MODULE_8__.MatOption, _angular_material_input__WEBPACK_IMPORTED_MODULE_9__.MatInputModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_9__.MatInput, _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_10__.MatDatepickerModule, _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_10__.MatDatepicker, _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_10__.MatDatepickerInput, _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_10__.MatDatepickerToggle, _angular_material_core__WEBPACK_IMPORTED_MODULE_8__.MatNativeDateModule],
    styles: [".mat-dialog-container[_ngcontent-%COMP%] {\n  padding: 0 !important;\n}\n\nmat-icon[_ngcontent-%COMP%] {\n  font-size: 20px;\n  width: 20px;\n  height: 20px;\n}\n\ntextarea[_ngcontent-%COMP%] {\n  resize: vertical;\n  min-height: 80px;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvbWVzYS1jb250cm9sL3ZhbGlkYWNpb24vYXByb2Jhci1kb2N1bWVudG8tZGlhbG9nL2Fwcm9iYXItZG9jdW1lbnRvLWRpYWxvZy5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtFQUNFLHFCQUFBO0FBQUY7O0FBSUE7RUFDRSxlQUFBO0VBQ0EsV0FBQTtFQUNBLFlBQUE7QUFERjs7QUFLQTtFQUNFLGdCQUFBO0VBQ0EsZ0JBQUE7QUFGRiIsInNvdXJjZXNDb250ZW50IjpbIi8vIEVzdGlsb3MgZXNwZWPDg8KtZmljb3MgcGFyYSBlbCBkaWFsb2cgZGUgYXByb2JhciBkb2N1bWVudG9cbi5tYXQtZGlhbG9nLWNvbnRhaW5lciB7XG4gIHBhZGRpbmc6IDAgIWltcG9ydGFudDtcbn1cblxuLy8gQXNlZ3VyYXIgcXVlIGxvcyBpY29ub3MgdGVuZ2FuIGVsIHRhbWHDg8KxbyBjb3JyZWN0b1xubWF0LWljb24ge1xuICBmb250LXNpemU6IDIwcHg7XG4gIHdpZHRoOiAyMHB4O1xuICBoZWlnaHQ6IDIwcHg7XG59XG5cbi8vIEVzdGlsb3MgcGFyYSBlbCB0ZXh0YXJlYVxudGV4dGFyZWEge1xuICByZXNpemU6IHZlcnRpY2FsO1xuICBtaW4taGVpZ2h0OiA4MHB4O1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }),

/***/ 27391:
/*!**********************************************************************************************************!*\
  !*** ./src/app/pages/mesa-control/validacion/cambiar-estatus-dialog/cambiar-estatus-dialog.component.ts ***!
  \**********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CambiarEstatusDialogComponent: () => (/* binding */ CambiarEstatusDialogComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ 28849);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/dialog */ 17401);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/form-field */ 51333);
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/select */ 96355);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/snack-bar */ 49409);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/progress-spinner */ 33910);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/core */ 55309);




















function CambiarEstatusDialogComponent_mat_option_37_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "mat-option", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const fase_r7 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("value", fase_r7.id);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", fase_r7.nombre, " ");
  }
}
function CambiarEstatusDialogComponent_mat_error_40_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Debes seleccionar una fase");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function CambiarEstatusDialogComponent_mat_error_41_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Debes seleccionar una fase diferente a la actual");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function CambiarEstatusDialogComponent_p_50_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "p")(1, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Nueva fase:");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r4.nombreFaseSeleccionada, " ");
  }
}
function CambiarEstatusDialogComponent_mat_spinner_55_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "mat-spinner", 25);
  }
}
function CambiarEstatusDialogComponent_mat_icon_56_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "mat-icon", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "swap_horiz");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
class CambiarEstatusDialogComponent {
  constructor(dialogRef, data, snackBar) {
    this.dialogRef = dialogRef;
    this.data = data;
    this.snackBar = snackBar;
    this.fasesDisponibles = [{
      nombre: 'Integración',
      id: 1
    }, {
      nombre: 'Liberación',
      id: 4
    }, {
      nombre: 'Liquidación',
      id: 7
    }];
    this.faseSeleccionada = null;
    this.loading = false;
  }
  ngOnInit() {
    // Establecer la fase actual como seleccionada por defecto
    this.faseSeleccionada = parseInt(this.data.cliente.IdCurrentState);
  }
  /**
   * Obtener el ID del estado actual como número
   */
  get estadoActualId() {
    return parseInt(this.data.cliente.IdCurrentState);
  }
  /**
   * Obtener el nombre de la fase seleccionada
   */
  get nombreFaseSeleccionada() {
    if (!this.faseSeleccionada) {
      return 'No seleccionada';
    }
    const fase = this.fasesDisponibles.find(f => f.id === this.faseSeleccionada);
    return fase ? fase.nombre : 'No seleccionada';
  }
  /**
   * Verificar si el formulario es válido para habilitar el botón
   */
  get isFormValid() {
    return this.faseSeleccionada !== null && this.faseSeleccionada !== undefined && this.faseSeleccionada !== this.estadoActualId;
  }
  onCancelar() {
    this.dialogRef.close();
  }
  onConfirmar() {
    if (!this.faseSeleccionada) {
      this.snackBar.open('Por favor selecciona una fase', 'Error', {
        duration: 3000
      });
      return;
    }
    if (this.faseSeleccionada === this.estadoActualId) {
      this.snackBar.open('Debes seleccionar una fase diferente a la actual', 'Error', {
        duration: 3000
      });
      return;
    }
    this.loading = true;
    // Simular procesamiento
    setTimeout(() => {
      this.loading = false;
      const faseSeleccionadaObj = this.fasesDisponibles.find(f => f.id === this.faseSeleccionada);
      this.dialogRef.close({
        nuevoEstatus: faseSeleccionadaObj?.nombre || '',
        nuevoIdCurrentState: this.faseSeleccionada
      });
    }, 1000);
  }
  static #_ = this.ɵfac = function CambiarEstatusDialogComponent_Factory(t) {
    return new (t || CambiarEstatusDialogComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__.MatDialogRef), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__.MAT_DIALOG_DATA), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_2__.MatSnackBar));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
    type: CambiarEstatusDialogComponent,
    selectors: [["app-cambiar-estatus-dialog"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵStandaloneFeature"]],
    decls: 58,
    vars: 15,
    consts: [[1, "p-6"], [1, "flex", "items-center", "mb-6"], [1, "text-blue-600", "mr-3"], [1, "text-xl", "font-semibold", "text-gray-800"], [1, "bg-gray-50", "rounded-lg", "p-4", "mb-6"], [1, "text-sm", "font-medium", "text-gray-700", "mb-2"], [1, "grid", "grid-cols-2", "gap-4", "text-sm"], [1, "font-medium", "text-gray-600"], [1, "ml-2"], [3, "ngSubmit"], ["statusForm", "ngForm"], [1, "space-y-4"], ["appearance", "outline", 1, "w-full"], ["name", "fase", "required", "", 3, "ngModel", "ngModelChange"], [3, "value", 4, "ngFor", "ngForOf"], [4, "ngIf"], [1, "bg-blue-50", "border", "border-blue-200", "rounded-lg", "p-4"], [1, "text-sm", "font-medium", "text-blue-700", "mb-2"], [1, "text-sm", "text-blue-600"], [1, "flex", "justify-end", "gap-3", "mt-6", "pt-4", "border-t"], ["type", "button", "mat-button", "", 3, "disabled", "click"], ["type", "submit", "mat-raised-button", "", "color", "primary", 3, "disabled"], ["diameter", "16", "class", "mr-2", 4, "ngIf"], ["class", "mr-2", 4, "ngIf"], [3, "value"], ["diameter", "16", 1, "mr-2"], [1, "mr-2"]],
    template: function CambiarEstatusDialogComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "mat-icon", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "swap_horiz");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "h2", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Cambiar Estatus del Pedido");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 4)(7, "h3", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "Informaci\u00F3n del Pedido");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "div", 6)(10, "div")(11, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, "Cliente:");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "span", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "div")(16, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, "No. Pedido:");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "span", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](19);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "div")(21, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, "Proceso:");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "span", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](24);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "div")(26, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](27, "Fase Actual:");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "span", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](29);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "form", 9, 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngSubmit", function CambiarEstatusDialogComponent_Template_form_ngSubmit_30_listener() {
          return ctx.onConfirmar();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "div", 11)(33, "mat-form-field", 12)(34, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](35, "Nueva Fase");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](36, "mat-select", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function CambiarEstatusDialogComponent_Template_mat_select_ngModelChange_36_listener($event) {
          return ctx.faseSeleccionada = $event;
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](37, CambiarEstatusDialogComponent_mat_option_37_Template, 2, 2, "mat-option", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](38, "mat-hint");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](39, "Selecciona la nueva fase para el pedido");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](40, CambiarEstatusDialogComponent_mat_error_40_Template, 2, 0, "mat-error", 15)(41, CambiarEstatusDialogComponent_mat_error_41_Template, 2, 0, "mat-error", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](42, "div", 16)(43, "h4", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](44, "Informaci\u00F3n de Cambio");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](45, "div", 18)(46, "p")(47, "strong");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](48, "Fase actual:");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](49);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](50, CambiarEstatusDialogComponent_p_50_Template, 4, 1, "p", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](51, "div", 19)(52, "button", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function CambiarEstatusDialogComponent_Template_button_click_52_listener() {
          return ctx.onCancelar();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](53, " Cancelar ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](54, "button", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](55, CambiarEstatusDialogComponent_mat_spinner_55_Template, 1, 0, "mat-spinner", 22)(56, CambiarEstatusDialogComponent_mat_icon_56_Template, 2, 0, "mat-icon", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](57);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.data.cliente.cliente);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.data.cliente.ndPedido);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.data.cliente.proceso);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.data.cliente.fase);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.faseSeleccionada);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.fasesDisponibles);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx.faseSeleccionada);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.faseSeleccionada === ctx.estadoActualId);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx.data.cliente.fase, "");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.faseSeleccionada);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", !ctx.isFormValid || ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx.loading ? "Procesando..." : "Confirmar Cambio", " ");
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgModel, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgForm, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__.MatDialogModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_5__.MatFormFieldModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_5__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_5__.MatLabel, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_5__.MatHint, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_5__.MatError, _angular_material_select__WEBPACK_IMPORTED_MODULE_6__.MatSelectModule, _angular_material_select__WEBPACK_IMPORTED_MODULE_6__.MatSelect, _angular_material_core__WEBPACK_IMPORTED_MODULE_7__.MatOption, _angular_material_button__WEBPACK_IMPORTED_MODULE_8__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_8__.MatButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_9__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_9__.MatIcon, _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_2__.MatSnackBarModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_10__.MatProgressSpinnerModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_10__.MatProgressSpinner],
    styles: [".mat-mdc-dialog-container[_ngcontent-%COMP%]   .mat-mdc-dialog-title[_ngcontent-%COMP%] {\n  color: #2563eb;\n}\n\n.mat-mdc-raised-button.mat-primary[_ngcontent-%COMP%] {\n  background-color: #2563eb;\n  color: white;\n}\n.mat-mdc-raised-button.mat-primary[_ngcontent-%COMP%]:hover {\n  background-color: #1d4ed8;\n}\n.mat-mdc-raised-button.mat-primary[_ngcontent-%COMP%]:disabled {\n  background-color: #9ca3af;\n  color: #6b7280;\n}\n\n.text-blue-600[_ngcontent-%COMP%] {\n  color: #2563eb;\n}\n\n.bg-blue-50[_ngcontent-%COMP%] {\n  background-color: #eff6ff;\n}\n\n.border-blue-200[_ngcontent-%COMP%] {\n  border-color: #bfdbfe;\n}\n\n.text-blue-700[_ngcontent-%COMP%] {\n  color: #1d4ed8;\n}\n\n.text-blue-600[_ngcontent-%COMP%] {\n  color: #2563eb;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvbWVzYS1jb250cm9sL3ZhbGlkYWNpb24vY2FtYmlhci1lc3RhdHVzLWRpYWxvZy9jYW1iaWFyLWVzdGF0dXMtZGlhbG9nLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVFO0VBQ0UsY0FBQTtBQURKOztBQU1BO0VBQ0UseUJBQUE7RUFDQSxZQUFBO0FBSEY7QUFLRTtFQUNFLHlCQUFBO0FBSEo7QUFNRTtFQUNFLHlCQUFBO0VBQ0EsY0FBQTtBQUpKOztBQVNBO0VBQ0UsY0FBQTtBQU5GOztBQVVBO0VBQ0UseUJBQUE7QUFQRjs7QUFVQTtFQUNFLHFCQUFBO0FBUEY7O0FBVUE7RUFDRSxjQUFBO0FBUEY7O0FBVUE7RUFDRSxjQUFBO0FBUEYiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBFc3RpbG9zIGVzcGVjw4PCrWZpY29zIHBhcmEgZWwgZGnDg8KhbG9nbyBkZSBjYW1iaW8gZGUgZXN0YXR1c1xuLm1hdC1tZGMtZGlhbG9nLWNvbnRhaW5lciB7XG4gIC5tYXQtbWRjLWRpYWxvZy10aXRsZSB7XG4gICAgY29sb3I6ICMyNTYzZWI7IC8vIENvbG9yIGF6dWwgcGFyYSBjYW1iaW8gZGUgZXN0YXR1c1xuICB9XG59XG5cbi8vIEVzdGlsb3MgcGFyYSBlbCBib3TDg8KzbiBkZSBjb25maXJtYWNpw4PCs25cbi5tYXQtbWRjLXJhaXNlZC1idXR0b24ubWF0LXByaW1hcnkge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMjU2M2ViO1xuICBjb2xvcjogd2hpdGU7XG4gIFxuICAmOmhvdmVyIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMWQ0ZWQ4O1xuICB9XG4gIFxuICAmOmRpc2FibGVkIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjOWNhM2FmO1xuICAgIGNvbG9yOiAjNmI3MjgwO1xuICB9XG59XG5cbi8vIEVzdGlsb3MgcGFyYSBlbCBpY29ubyBkZSBjYW1iaW9cbi50ZXh0LWJsdWUtNjAwIHtcbiAgY29sb3I6ICMyNTYzZWI7XG59XG5cbi8vIEVzdGlsb3MgcGFyYSBlbCBwYW5lbCBkZSBpbmZvcm1hY2nDg8KzblxuLmJnLWJsdWUtNTAge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZWZmNmZmO1xufVxuXG4uYm9yZGVyLWJsdWUtMjAwIHtcbiAgYm9yZGVyLWNvbG9yOiAjYmZkYmZlO1xufVxuXG4udGV4dC1ibHVlLTcwMCB7XG4gIGNvbG9yOiAjMWQ0ZWQ4O1xufVxuXG4udGV4dC1ibHVlLTYwMCB7XG4gIGNvbG9yOiAjMjU2M2ViO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }),

/***/ 13270:
/*!**********************************************************************************************************!*\
  !*** ./src/app/pages/mesa-control/validacion/cancelar-pedido-dialog/cancelar-pedido-dialog.component.ts ***!
  \**********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CancelarPedidoDialogComponent: () => (/* binding */ CancelarPedidoDialogComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ 28849);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/dialog */ 17401);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/form-field */ 51333);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/input */ 10026);
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/select */ 96355);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/snack-bar */ 49409);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/progress-spinner */ 33910);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _core_services_file_extraordinary_reason_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../core/services/file-extraordinary-reason.service */ 2554);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/core */ 55309);























function CancelarPedidoDialogComponent_mat_option_37_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-option", 23)(1, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](2, "mat-spinner", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, " Cargando motivos... ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
}
function CancelarPedidoDialogComponent_mat_option_38_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-option", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " No hay motivos disponibles ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function CancelarPedidoDialogComponent_mat_option_39_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-option", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const motivo_r8 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("value", motivo_r8.Id);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", motivo_r8.Name, " ");
  }
}
function CancelarPedidoDialogComponent_mat_error_42_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Debes seleccionar un motivo de cancelaci\u00F3n");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function CancelarPedidoDialogComponent_mat_error_50_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Debes escribir un comentario explicando la cancelaci\u00F3n");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function CancelarPedidoDialogComponent_mat_spinner_55_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "mat-spinner", 25);
  }
}
function CancelarPedidoDialogComponent_mat_icon_56_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-icon", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "cancel");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
class CancelarPedidoDialogComponent {
  constructor(dialogRef, data, fileExtraordinaryReasonService, snackBar) {
    this.dialogRef = dialogRef;
    this.data = data;
    this.fileExtraordinaryReasonService = fileExtraordinaryReasonService;
    this.snackBar = snackBar;
    this.motivos = [];
    this.motivoSeleccionado = null;
    this.comentario = '';
    this.loading = false;
    this.loadingMotivos = true;
  }
  ngOnInit() {
    this.cargarMotivos();
  }
  cargarMotivos() {
    this.loadingMotivos = true;
    // Cargar motivos extraordinarios con IdTypeReason = 2 (motivos de cancelación)
    this.fileExtraordinaryReasonService.getFileExtraordinaryReasons({
      id_type_reason: 2,
      limit: 1000 // Obtener todos los motivos de cancelación
    }).subscribe({
      next: response => {
        this.motivos = response.data.file_extraordinary_reasons;
        this.loadingMotivos = false;
        console.log('Motivos extraordinarios de cancelación cargados:', this.motivos);
      },
      error: error => {
        console.error('Error cargando motivos extraordinarios de cancelación:', error);
        this.snackBar.open('Error al cargar los motivos de cancelación', 'Error', {
          duration: 3000
        });
        this.loadingMotivos = false;
      }
    });
  }
  /**
   * Verificar si el formulario es válido para habilitar el botón
   */
  get isFormValid() {
    return this.motivoSeleccionado !== null && this.motivoSeleccionado !== undefined && this.comentario.trim().length > 0;
  }
  onCancelar() {
    this.dialogRef.close();
  }
  onConfirmar() {
    if (!this.motivoSeleccionado) {
      this.snackBar.open('Por favor selecciona un motivo', 'Error', {
        duration: 3000
      });
      return;
    }
    if (!this.comentario.trim()) {
      this.snackBar.open('Por favor ingresa un comentario', 'Error', {
        duration: 3000
      });
      return;
    }
    this.loading = true;
    const result = {
      motivoId: this.motivoSeleccionado,
      comentario: this.comentario.trim()
    };
    // Simular procesamiento
    setTimeout(() => {
      this.loading = false;
      this.dialogRef.close(result);
    }, 1000);
  }
  getMotivoSeleccionado() {
    const motivo = this.motivos.find(m => m.Id === this.motivoSeleccionado);
    return motivo ? motivo.Name : '';
  }
  static #_ = this.ɵfac = function CancelarPedidoDialogComponent_Factory(t) {
    return new (t || CancelarPedidoDialogComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__.MatDialogRef), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__.MAT_DIALOG_DATA), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_core_services_file_extraordinary_reason_service__WEBPACK_IMPORTED_MODULE_0__.FileExtraordinaryReasonService), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_3__.MatSnackBar));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: CancelarPedidoDialogComponent,
    selectors: [["app-cancelar-pedido-dialog"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵStandaloneFeature"]],
    decls: 58,
    vars: 18,
    consts: [[1, "p-6"], [1, "flex", "items-center", "mb-6"], [1, "text-red-600", "mr-3"], [1, "text-xl", "font-semibold", "text-gray-800"], [1, "bg-gray-50", "rounded-lg", "p-4", "mb-6"], [1, "text-sm", "font-medium", "text-gray-700", "mb-2"], [1, "grid", "grid-cols-2", "gap-4", "text-sm"], [1, "font-medium", "text-gray-600"], [1, "ml-2"], [3, "ngSubmit"], ["cancelForm", "ngForm"], [1, "space-y-4"], ["appearance", "outline", 1, "w-full"], ["name", "motivo", "required", "", 3, "ngModel", "disabled", "ngModelChange"], ["value", "", "disabled", "", 4, "ngIf"], [3, "value", 4, "ngFor", "ngForOf"], [4, "ngIf"], ["matInput", "", "name", "comentario", "required", "", "rows", "4", "placeholder", "Describe los detalles de la cancelaci\u00F3n...", "maxlength", "500", 3, "ngModel", "ngModelChange"], [1, "flex", "justify-end", "gap-3", "mt-6", "pt-4", "border-t"], ["type", "button", "mat-button", "", 3, "disabled", "click"], ["type", "submit", "mat-raised-button", "", "color", "warn", 3, "disabled"], ["diameter", "16", "class", "mr-2", 4, "ngIf"], ["class", "mr-2", 4, "ngIf"], ["value", "", "disabled", ""], [1, "flex", "items-center"], ["diameter", "16", 1, "mr-2"], [3, "value"], [1, "mr-2"]],
    template: function CancelarPedidoDialogComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "mat-icon", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "cancel");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "h2", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5, "Cancelar Pedido");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "div", 4)(7, "h3", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8, "Informaci\u00F3n del Pedido");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "div", 6)(10, "div")(11, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12, "Cliente:");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](13, "span", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](14);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](15, "div")(16, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](17, "No. Pedido:");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](18, "span", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](19);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](20, "div")(21, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](22, "Proceso:");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](23, "span", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](24);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](25, "div")(26, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](27, "Fase Actual:");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](28, "span", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](29);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](30, "form", 9, 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngSubmit", function CancelarPedidoDialogComponent_Template_form_ngSubmit_30_listener() {
          return ctx.onConfirmar();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](32, "div", 11)(33, "mat-form-field", 12)(34, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](35, "Motivo de Cancelaci\u00F3n");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](36, "mat-select", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function CancelarPedidoDialogComponent_Template_mat_select_ngModelChange_36_listener($event) {
          return ctx.motivoSeleccionado = $event;
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](37, CancelarPedidoDialogComponent_mat_option_37_Template, 4, 0, "mat-option", 14)(38, CancelarPedidoDialogComponent_mat_option_38_Template, 2, 0, "mat-option", 14)(39, CancelarPedidoDialogComponent_mat_option_39_Template, 2, 2, "mat-option", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](40, "mat-hint");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](41, "Selecciona el motivo por el cual se cancela el pedido");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](42, CancelarPedidoDialogComponent_mat_error_42_Template, 2, 0, "mat-error", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](43, "mat-form-field", 12)(44, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](45, "Comentario");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](46, "textarea", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function CancelarPedidoDialogComponent_Template_textarea_ngModelChange_46_listener($event) {
          return ctx.comentario = $event;
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](47, "        ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](48, "mat-hint");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](49);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](50, CancelarPedidoDialogComponent_mat_error_50_Template, 2, 0, "mat-error", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](51, "div", 18)(52, "button", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function CancelarPedidoDialogComponent_Template_button_click_52_listener() {
          return ctx.onCancelar();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](53, " Cancelar ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](54, "button", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](55, CancelarPedidoDialogComponent_mat_spinner_55_Template, 1, 0, "mat-spinner", 21)(56, CancelarPedidoDialogComponent_mat_icon_56_Template, 2, 0, "mat-icon", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](57);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](14);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.data.cliente.cliente);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.data.cliente.ndPedido);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.data.cliente.proceso);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.data.cliente.fase);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx.motivoSeleccionado)("disabled", ctx.loadingMotivos);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.loadingMotivos);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.loadingMotivos && ctx.motivos.length === 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.motivos);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.motivoSeleccionado && !ctx.loadingMotivos);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx.comentario);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("", ctx.comentario.length, "/500 caracteres");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.comentario.trim());
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", !ctx.isFormValid || ctx.loading || ctx.loadingMotivos);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx.loading ? "Procesando..." : "Confirmar Cancelaci\u00F3n", " ");
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_5__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.MaxLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgModel, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgForm, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__.MatDialogModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__.MatFormFieldModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__.MatLabel, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__.MatHint, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__.MatError, _angular_material_input__WEBPACK_IMPORTED_MODULE_7__.MatInputModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_7__.MatInput, _angular_material_select__WEBPACK_IMPORTED_MODULE_8__.MatSelectModule, _angular_material_select__WEBPACK_IMPORTED_MODULE_8__.MatSelect, _angular_material_core__WEBPACK_IMPORTED_MODULE_9__.MatOption, _angular_material_button__WEBPACK_IMPORTED_MODULE_10__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_10__.MatButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_11__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_11__.MatIcon, _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_3__.MatSnackBarModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_12__.MatProgressSpinnerModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_12__.MatProgressSpinner],
    styles: [".mat-mdc-dialog-container[_ngcontent-%COMP%] {\n  max-width: 600px;\n  width: 100%;\n}\n\n.mat-mdc-form-field[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.mat-mdc-text-field-wrapper[_ngcontent-%COMP%] {\n  background-color: white;\n}\n\n.bg-gray-50[_ngcontent-%COMP%] {\n  background-color: #f9fafb;\n}\n\n.mat-mdc-button[_ngcontent-%COMP%], .mat-mdc-raised-button[_ngcontent-%COMP%] {\n  min-width: 120px;\n}\n\n.mat-mdc-raised-button[color=warn][_ngcontent-%COMP%] {\n  background-color: #dc2626;\n  color: white;\n}\n\n.mat-mdc-raised-button[color=warn][_ngcontent-%COMP%]:hover {\n  background-color: #b91c1c;\n}\n\n.mat-mdc-progress-spinner[_ngcontent-%COMP%] {\n  display: inline-block;\n}\n\n.mat-mdc-form-field-hint[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  color: #6b7280;\n}\n\ntextarea.mat-mdc-input-element[_ngcontent-%COMP%] {\n  resize: vertical;\n  min-height: 80px;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvbWVzYS1jb250cm9sL3ZhbGlkYWNpb24vY2FuY2VsYXItcGVkaWRvLWRpYWxvZy9jYW5jZWxhci1wZWRpZG8tZGlhbG9nLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0VBQ0UsZ0JBQUE7RUFDQSxXQUFBO0FBQUY7O0FBR0E7RUFDRSxXQUFBO0FBQUY7O0FBR0E7RUFDRSx1QkFBQTtBQUFGOztBQUlBO0VBQ0UseUJBQUE7QUFERjs7QUFLQTs7RUFFRSxnQkFBQTtBQUZGOztBQUtBO0VBQ0UseUJBQUE7RUFDQSxZQUFBO0FBRkY7O0FBS0E7RUFDRSx5QkFBQTtBQUZGOztBQU1BO0VBQ0UscUJBQUE7QUFIRjs7QUFPQTtFQUNFLGtCQUFBO0VBQ0EsY0FBQTtBQUpGOztBQVFBO0VBQ0UsZ0JBQUE7RUFDQSxnQkFBQTtBQUxGIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRXN0aWxvcyBlc3BlY8ODwq1maWNvcyBwYXJhIGVsIGRpw4PCoWxvZ28gZGUgY2FuY2VsYXIgcGVkaWRvXG4ubWF0LW1kYy1kaWFsb2ctY29udGFpbmVyIHtcbiAgbWF4LXdpZHRoOiA2MDBweDtcbiAgd2lkdGg6IDEwMCU7XG59XG5cbi5tYXQtbWRjLWZvcm0tZmllbGQge1xuICB3aWR0aDogMTAwJTtcbn1cblxuLm1hdC1tZGMtdGV4dC1maWVsZC13cmFwcGVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XG59XG5cbi8vIEVzdGlsb3MgcGFyYSBlbCDDg8KhcmVhIGRlIGluZm9ybWFjacODwrNuIGRlbCBjbGllbnRlXG4uYmctZ3JheS01MCB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmOWZhZmI7XG59XG5cbi8vIEVzdGlsb3MgcGFyYSBsb3MgYm90b25lc1xuLm1hdC1tZGMtYnV0dG9uLFxuLm1hdC1tZGMtcmFpc2VkLWJ1dHRvbiB7XG4gIG1pbi13aWR0aDogMTIwcHg7XG59XG5cbi5tYXQtbWRjLXJhaXNlZC1idXR0b25bY29sb3I9XCJ3YXJuXCJdIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2RjMjYyNjtcbiAgY29sb3I6IHdoaXRlO1xufVxuXG4ubWF0LW1kYy1yYWlzZWQtYnV0dG9uW2NvbG9yPVwid2FyblwiXTpob3ZlciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNiOTFjMWM7XG59XG5cbi8vIEVzdGlsb3MgcGFyYSBlbCBzcGlubmVyXG4ubWF0LW1kYy1wcm9ncmVzcy1zcGlubmVyIHtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xufVxuXG4vLyBFc3RpbG9zIHBhcmEgZWwgaGludFxuLm1hdC1tZGMtZm9ybS1maWVsZC1oaW50IHtcbiAgZm9udC1zaXplOiAwLjc1cmVtO1xuICBjb2xvcjogIzZiNzI4MDtcbn1cblxuLy8gRXN0aWxvcyBwYXJhIGVsIHRleHRhcmVhXG50ZXh0YXJlYS5tYXQtbWRjLWlucHV0LWVsZW1lbnQge1xuICByZXNpemU6IHZlcnRpY2FsO1xuICBtaW4taGVpZ2h0OiA4MHB4O1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }),

/***/ 25308:
/*!**********************************************************************************************************!*\
  !*** ./src/app/pages/mesa-control/validacion/eliminar-pedido-dialog/eliminar-pedido-dialog.component.ts ***!
  \**********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EliminarPedidoDialogComponent: () => (/* binding */ EliminarPedidoDialogComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/dialog */ 17401);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/snack-bar */ 49409);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/progress-spinner */ 33910);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 61699);













function EliminarPedidoDialogComponent_mat_spinner_49_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "mat-spinner", 19);
  }
}
function EliminarPedidoDialogComponent_mat_icon_50_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "mat-icon", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "delete_forever");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
class EliminarPedidoDialogComponent {
  constructor(dialogRef, data, snackBar) {
    this.dialogRef = dialogRef;
    this.data = data;
    this.snackBar = snackBar;
    this.loading = false;
  }
  onCancelar() {
    this.dialogRef.close({
      confirmado: false
    });
  }
  onConfirmar() {
    this.loading = true;
    // Simular procesamiento
    setTimeout(() => {
      this.loading = false;
      this.dialogRef.close({
        confirmado: true
      });
    }, 1000);
  }
  static #_ = this.ɵfac = function EliminarPedidoDialogComponent_Factory(t) {
    return new (t || EliminarPedidoDialogComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__.MatDialogRef), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__.MAT_DIALOG_DATA), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_2__.MatSnackBar));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
    type: EliminarPedidoDialogComponent,
    selectors: [["app-eliminar-pedido-dialog"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵStandaloneFeature"]],
    decls: 52,
    vars: 9,
    consts: [[1, "p-6"], [1, "flex", "items-center", "mb-6"], [1, "text-red-600", "mr-3"], [1, "text-xl", "font-semibold", "text-gray-800"], [1, "bg-red-50", "border", "border-red-200", "rounded-lg", "p-4", "mb-6"], [1, "text-sm", "font-medium", "text-red-700", "mb-2"], [1, "grid", "grid-cols-2", "gap-4", "text-sm"], [1, "font-medium", "text-gray-600"], [1, "ml-2"], [1, "bg-gray-50", "rounded-lg", "p-4", "mb-6"], [1, "text-sm", "text-gray-700", "mb-2"], [1, "text-sm", "text-gray-600"], [1, "text-sm", "text-gray-600", "mt-2", "ml-4", "list-disc"], [1, "text-sm", "text-red-600", "font-medium", "mt-3"], [1, "flex", "justify-end", "gap-3"], ["type", "button", "mat-button", "", 3, "disabled", "click"], ["type", "button", "mat-raised-button", "", "color", "warn", 3, "disabled", "click"], ["diameter", "16", "class", "mr-2", 4, "ngIf"], ["class", "mr-2", 4, "ngIf"], ["diameter", "16", 1, "mr-2"], [1, "mr-2"]],
    template: function EliminarPedidoDialogComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "mat-icon", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "delete_forever");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "h2", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Eliminar Pedido");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 4)(7, "h3", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "\u26A0\uFE0F Advertencia: Acci\u00F3n Irreversible");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "div", 6)(10, "div")(11, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, "Cliente:");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "span", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "div")(16, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, "No. Pedido:");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "span", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](19);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "div")(21, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, "Proceso:");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "span", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](24);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "div")(26, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](27, "Fase Actual:");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "span", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](29);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "div", 9)(31, "p", 10)(32, "strong");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](33, "\u00BFEst\u00E1s seguro de que deseas eliminar este pedido?");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](34, "p", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](35, " Esta acci\u00F3n eliminar\u00E1 permanentemente: ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](36, "ul", 12)(37, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](38, "El registro del pedido en la tabla File");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](39, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](40, "Todos los documentos asociados (document_by_file)");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](41, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](42, "Toda la informaci\u00F3n relacionada");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](43, "p", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](44, " \u26A0\uFE0F Esta acci\u00F3n no se puede deshacer. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](45, "div", 14)(46, "button", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EliminarPedidoDialogComponent_Template_button_click_46_listener() {
          return ctx.onCancelar();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](47, " Cancelar ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](48, "button", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function EliminarPedidoDialogComponent_Template_button_click_48_listener() {
          return ctx.onConfirmar();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](49, EliminarPedidoDialogComponent_mat_spinner_49_Template, 1, 0, "mat-spinner", 17)(50, EliminarPedidoDialogComponent_mat_icon_50_Template, 2, 0, "mat-icon", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](51);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.data.cliente.cliente);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.data.cliente.ndPedido);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.data.cliente.proceso);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.data.cliente.fase);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](17);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx.loading ? "Eliminando..." : "Confirmar Eliminaci\u00F3n", " ");
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgIf, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__.MatDialogModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_4__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_4__.MatButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__.MatIcon, _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_2__.MatSnackBarModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_6__.MatProgressSpinnerModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_6__.MatProgressSpinner],
    styles: [".mat-mdc-dialog-container[_ngcontent-%COMP%]   .mat-mdc-dialog-title[_ngcontent-%COMP%] {\n  color: #dc2626;\n}\n\n.mat-mdc-raised-button.mat-warn[_ngcontent-%COMP%] {\n  background-color: #dc2626;\n  color: white;\n}\n.mat-mdc-raised-button.mat-warn[_ngcontent-%COMP%]:hover {\n  background-color: #b91c1c;\n}\n.mat-mdc-raised-button.mat-warn[_ngcontent-%COMP%]:disabled {\n  background-color: #9ca3af;\n  color: #6b7280;\n}\n\n.text-red-600[_ngcontent-%COMP%] {\n  color: #dc2626;\n}\n\n.bg-red-50[_ngcontent-%COMP%] {\n  background-color: #fef2f2;\n}\n\n.border-red-200[_ngcontent-%COMP%] {\n  border-color: #fecaca;\n}\n\n.text-red-700[_ngcontent-%COMP%] {\n  color: #b91c1c;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvbWVzYS1jb250cm9sL3ZhbGlkYWNpb24vZWxpbWluYXItcGVkaWRvLWRpYWxvZy9lbGltaW5hci1wZWRpZG8tZGlhbG9nLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVFO0VBQ0UsY0FBQTtBQURKOztBQU1BO0VBQ0UseUJBQUE7RUFDQSxZQUFBO0FBSEY7QUFLRTtFQUNFLHlCQUFBO0FBSEo7QUFNRTtFQUNFLHlCQUFBO0VBQ0EsY0FBQTtBQUpKOztBQVNBO0VBQ0UsY0FBQTtBQU5GOztBQVVBO0VBQ0UseUJBQUE7QUFQRjs7QUFVQTtFQUNFLHFCQUFBO0FBUEY7O0FBVUE7RUFDRSxjQUFBO0FBUEYiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBFc3RpbG9zIGVzcGVjw4PCrWZpY29zIHBhcmEgZWwgZGnDg8KhbG9nbyBkZSBlbGltaW5hY2nDg8KzblxuLm1hdC1tZGMtZGlhbG9nLWNvbnRhaW5lciB7XG4gIC5tYXQtbWRjLWRpYWxvZy10aXRsZSB7XG4gICAgY29sb3I6ICNkYzI2MjY7IC8vIENvbG9yIHJvam8gcGFyYSBlbGltaW5hY2nDg8KzblxuICB9XG59XG5cbi8vIEVzdGlsb3MgcGFyYSBlbCBib3TDg8KzbiBkZSBjb25maXJtYWNpw4PCs25cbi5tYXQtbWRjLXJhaXNlZC1idXR0b24ubWF0LXdhcm4ge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZGMyNjI2O1xuICBjb2xvcjogd2hpdGU7XG4gIFxuICAmOmhvdmVyIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjYjkxYzFjO1xuICB9XG4gIFxuICAmOmRpc2FibGVkIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjOWNhM2FmO1xuICAgIGNvbG9yOiAjNmI3MjgwO1xuICB9XG59XG5cbi8vIEVzdGlsb3MgcGFyYSBlbCBpY29ubyBkZSBlbGltaW5hY2nDg8KzblxuLnRleHQtcmVkLTYwMCB7XG4gIGNvbG9yOiAjZGMyNjI2O1xufVxuXG4vLyBFc3RpbG9zIHBhcmEgZWwgcGFuZWwgZGUgYWR2ZXJ0ZW5jaWFcbi5iZy1yZWQtNTAge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmVmMmYyO1xufVxuXG4uYm9yZGVyLXJlZC0yMDAge1xuICBib3JkZXItY29sb3I6ICNmZWNhY2E7XG59XG5cbi50ZXh0LXJlZC03MDAge1xuICBjb2xvcjogI2I5MWMxYztcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
  });
}

/***/ }),

/***/ 8016:
/*!************************************************************************************************************!*\
  !*** ./src/app/pages/mesa-control/validacion/excepcion-pedido-dialog/excepcion-pedido-dialog.component.ts ***!
  \************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ExcepcionPedidoDialogComponent: () => (/* binding */ ExcepcionPedidoDialogComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ 28849);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/dialog */ 17401);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/form-field */ 51333);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/input */ 10026);
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/select */ 96355);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/snack-bar */ 49409);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/progress-spinner */ 33910);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _core_services_file_extraordinary_reason_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../core/services/file-extraordinary-reason.service */ 2554);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/core */ 55309);























function ExcepcionPedidoDialogComponent_mat_option_37_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-option", 23)(1, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](2, "mat-spinner", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, " Cargando motivos... ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
}
function ExcepcionPedidoDialogComponent_mat_option_38_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-option", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " No hay motivos disponibles ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function ExcepcionPedidoDialogComponent_mat_option_39_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-option", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const motivo_r8 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("value", motivo_r8.Id);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", motivo_r8.Name, " ");
  }
}
function ExcepcionPedidoDialogComponent_mat_error_42_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Debes seleccionar un motivo de excepci\u00F3n");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function ExcepcionPedidoDialogComponent_mat_error_50_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Debes escribir un comentario explicando la excepci\u00F3n");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function ExcepcionPedidoDialogComponent_mat_spinner_55_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "mat-spinner", 25);
  }
}
function ExcepcionPedidoDialogComponent_mat_icon_56_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-icon", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "warning");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
class ExcepcionPedidoDialogComponent {
  constructor(dialogRef, data, fileExtraordinaryReasonService, snackBar) {
    this.dialogRef = dialogRef;
    this.data = data;
    this.fileExtraordinaryReasonService = fileExtraordinaryReasonService;
    this.snackBar = snackBar;
    this.motivos = [];
    this.motivoSeleccionado = null;
    this.comentario = '';
    this.loading = false;
    this.loadingMotivos = true;
  }
  ngOnInit() {
    this.cargarMotivos();
  }
  cargarMotivos() {
    this.loadingMotivos = true;
    // Cargar motivos extraordinarios con IdTypeReason = 1 (motivos de excepción)
    this.fileExtraordinaryReasonService.getFileExtraordinaryReasons({
      id_type_reason: 1,
      limit: 1000 // Obtener todos los motivos de excepción
    }).subscribe({
      next: response => {
        this.motivos = response.data.file_extraordinary_reasons;
        this.loadingMotivos = false;
        console.log('Motivos extraordinarios de excepción cargados:', this.motivos);
      },
      error: error => {
        console.error('Error cargando motivos extraordinarios de excepción:', error);
        this.snackBar.open('Error al cargar los motivos de excepción', 'Error', {
          duration: 3000
        });
        this.loadingMotivos = false;
      }
    });
  }
  /**
   * Verificar si el formulario es válido para habilitar el botón
   */
  get isFormValid() {
    return this.motivoSeleccionado !== null && this.motivoSeleccionado !== undefined && this.comentario.trim().length > 0;
  }
  onCancelar() {
    this.dialogRef.close();
  }
  onConfirmar() {
    if (!this.motivoSeleccionado) {
      this.snackBar.open('Por favor selecciona un motivo', 'Error', {
        duration: 3000
      });
      return;
    }
    if (!this.comentario.trim()) {
      this.snackBar.open('Por favor escribe un comentario', 'Error', {
        duration: 3000
      });
      return;
    }
    this.loading = true;
    // Simular procesamiento
    setTimeout(() => {
      this.loading = false;
      this.dialogRef.close({
        motivoId: this.motivoSeleccionado,
        comentario: this.comentario.trim()
      });
    }, 1000);
  }
  static #_ = this.ɵfac = function ExcepcionPedidoDialogComponent_Factory(t) {
    return new (t || ExcepcionPedidoDialogComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__.MatDialogRef), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__.MAT_DIALOG_DATA), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_core_services_file_extraordinary_reason_service__WEBPACK_IMPORTED_MODULE_0__.FileExtraordinaryReasonService), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_3__.MatSnackBar));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: ExcepcionPedidoDialogComponent,
    selectors: [["app-excepcion-pedido-dialog"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵStandaloneFeature"]],
    decls: 58,
    vars: 18,
    consts: [[1, "p-6"], [1, "flex", "items-center", "mb-6"], [1, "text-orange-600", "mr-3"], [1, "text-xl", "font-semibold", "text-gray-800"], [1, "bg-gray-50", "rounded-lg", "p-4", "mb-6"], [1, "text-sm", "font-medium", "text-gray-700", "mb-2"], [1, "grid", "grid-cols-2", "gap-4", "text-sm"], [1, "font-medium", "text-gray-600"], [1, "ml-2"], [3, "ngSubmit"], ["exceptionForm", "ngForm"], [1, "space-y-4"], ["appearance", "outline", 1, "w-full"], ["name", "motivo", "required", "", 3, "ngModel", "disabled", "ngModelChange"], ["value", "", "disabled", "", 4, "ngIf"], [3, "value", 4, "ngFor", "ngForOf"], [4, "ngIf"], ["matInput", "", "name", "comentario", "required", "", "rows", "4", "placeholder", "Describe los detalles de la excepci\u00F3n...", "maxlength", "500", 3, "ngModel", "ngModelChange"], [1, "flex", "justify-end", "gap-3", "mt-6", "pt-4", "border-t"], ["type", "button", "mat-button", "", 3, "disabled", "click"], ["type", "submit", "mat-raised-button", "", "color", "accent", 3, "disabled"], ["diameter", "16", "class", "mr-2", 4, "ngIf"], ["class", "mr-2", 4, "ngIf"], ["value", "", "disabled", ""], [1, "flex", "items-center"], ["diameter", "16", 1, "mr-2"], [3, "value"], [1, "mr-2"]],
    template: function ExcepcionPedidoDialogComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "mat-icon", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "warning");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "h2", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5, "Excepci\u00F3n en el Pedido");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "div", 4)(7, "h3", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8, "Informaci\u00F3n del Pedido");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "div", 6)(10, "div")(11, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12, "Cliente:");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](13, "span", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](14);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](15, "div")(16, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](17, "No. Pedido:");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](18, "span", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](19);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](20, "div")(21, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](22, "Proceso:");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](23, "span", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](24);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](25, "div")(26, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](27, "Fase Actual:");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](28, "span", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](29);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](30, "form", 9, 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngSubmit", function ExcepcionPedidoDialogComponent_Template_form_ngSubmit_30_listener() {
          return ctx.onConfirmar();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](32, "div", 11)(33, "mat-form-field", 12)(34, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](35, "Motivo de Excepci\u00F3n");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](36, "mat-select", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function ExcepcionPedidoDialogComponent_Template_mat_select_ngModelChange_36_listener($event) {
          return ctx.motivoSeleccionado = $event;
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](37, ExcepcionPedidoDialogComponent_mat_option_37_Template, 4, 0, "mat-option", 14)(38, ExcepcionPedidoDialogComponent_mat_option_38_Template, 2, 0, "mat-option", 14)(39, ExcepcionPedidoDialogComponent_mat_option_39_Template, 2, 2, "mat-option", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](40, "mat-hint");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](41, "Selecciona el motivo por el cual se crea la excepci\u00F3n");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](42, ExcepcionPedidoDialogComponent_mat_error_42_Template, 2, 0, "mat-error", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](43, "mat-form-field", 12)(44, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](45, "Comentario");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](46, "textarea", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function ExcepcionPedidoDialogComponent_Template_textarea_ngModelChange_46_listener($event) {
          return ctx.comentario = $event;
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](47, "        ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](48, "mat-hint");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](49);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](50, ExcepcionPedidoDialogComponent_mat_error_50_Template, 2, 0, "mat-error", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](51, "div", 18)(52, "button", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ExcepcionPedidoDialogComponent_Template_button_click_52_listener() {
          return ctx.onCancelar();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](53, " Cancelar ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](54, "button", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](55, ExcepcionPedidoDialogComponent_mat_spinner_55_Template, 1, 0, "mat-spinner", 21)(56, ExcepcionPedidoDialogComponent_mat_icon_56_Template, 2, 0, "mat-icon", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](57);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](14);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.data.cliente.cliente);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.data.cliente.ndPedido);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.data.cliente.proceso);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.data.cliente.fase);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx.motivoSeleccionado)("disabled", ctx.loadingMotivos);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.loadingMotivos);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.loadingMotivos && ctx.motivos.length === 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.motivos);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.motivoSeleccionado && !ctx.loadingMotivos);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx.comentario);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("", ctx.comentario.length, "/500 caracteres");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.comentario.trim());
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", !ctx.isFormValid || ctx.loading || ctx.loadingMotivos);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx.loading ? "Procesando..." : "Confirmar Excepci\u00F3n", " ");
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_5__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.MaxLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgModel, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgForm, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__.MatDialogModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__.MatFormFieldModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__.MatLabel, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__.MatHint, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__.MatError, _angular_material_input__WEBPACK_IMPORTED_MODULE_7__.MatInputModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_7__.MatInput, _angular_material_select__WEBPACK_IMPORTED_MODULE_8__.MatSelectModule, _angular_material_select__WEBPACK_IMPORTED_MODULE_8__.MatSelect, _angular_material_core__WEBPACK_IMPORTED_MODULE_9__.MatOption, _angular_material_button__WEBPACK_IMPORTED_MODULE_10__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_10__.MatButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_11__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_11__.MatIcon, _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_3__.MatSnackBarModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_12__.MatProgressSpinnerModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_12__.MatProgressSpinner],
    styles: [".mat-mdc-dialog-container[_ngcontent-%COMP%]   .mat-mdc-dialog-title[_ngcontent-%COMP%] {\n  color: #f59e0b;\n}\n\n.mat-mdc-raised-button.mat-accent[_ngcontent-%COMP%] {\n  background-color: #f59e0b;\n  color: white;\n}\n.mat-mdc-raised-button.mat-accent[_ngcontent-%COMP%]:hover {\n  background-color: #d97706;\n}\n.mat-mdc-raised-button.mat-accent[_ngcontent-%COMP%]:disabled {\n  background-color: #9ca3af;\n  color: #6b7280;\n}\n\n.text-orange-600[_ngcontent-%COMP%] {\n  color: #ea580c;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvbWVzYS1jb250cm9sL3ZhbGlkYWNpb24vZXhjZXBjaW9uLXBlZGlkby1kaWFsb2cvZXhjZXBjaW9uLXBlZGlkby1kaWFsb2cuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUU7RUFDRSxjQUFBO0FBREo7O0FBTUE7RUFDRSx5QkFBQTtFQUNBLFlBQUE7QUFIRjtBQUtFO0VBQ0UseUJBQUE7QUFISjtBQU1FO0VBQ0UseUJBQUE7RUFDQSxjQUFBO0FBSko7O0FBU0E7RUFDRSxjQUFBO0FBTkYiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBFc3RpbG9zIGVzcGVjw4PCrWZpY29zIHBhcmEgZWwgZGnDg8KhbG9nbyBkZSBleGNlcGNpw4PCs25cbi5tYXQtbWRjLWRpYWxvZy1jb250YWluZXIge1xuICAubWF0LW1kYy1kaWFsb2ctdGl0bGUge1xuICAgIGNvbG9yOiAjZjU5ZTBiOyAvLyBDb2xvciBuYXJhbmphIHBhcmEgZXhjZXBjacODwrNuXG4gIH1cbn1cblxuLy8gRXN0aWxvcyBwYXJhIGVsIGJvdMODwrNuIGRlIGNvbmZpcm1hY2nDg8KzblxuLm1hdC1tZGMtcmFpc2VkLWJ1dHRvbi5tYXQtYWNjZW50IHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y1OWUwYjtcbiAgY29sb3I6IHdoaXRlO1xuICBcbiAgJjpob3ZlciB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2Q5NzcwNjtcbiAgfVxuICBcbiAgJjpkaXNhYmxlZCB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzljYTNhZjtcbiAgICBjb2xvcjogIzZiNzI4MDtcbiAgfVxufVxuXG4vLyBFc3RpbG9zIHBhcmEgZWwgaWNvbm8gZGUgYWR2ZXJ0ZW5jaWFcbi50ZXh0LW9yYW5nZS02MDAge1xuICBjb2xvcjogI2VhNTgwYztcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
  });
}

/***/ }),

/***/ 28562:
/*!****************************************************************************************************************!*\
  !*** ./src/app/pages/mesa-control/validacion/rechazar-documento-dialog/rechazar-documento-dialog.component.ts ***!
  \****************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RechazarDocumentoDialogComponent: () => (/* binding */ RechazarDocumentoDialogComponent)
/* harmony export */ });
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/dialog */ 17401);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ 28849);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/form-field */ 51333);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/input */ 10026);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 61699);















function RechazarDocumentoDialogComponent_mat_error_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, " El motivo es obligatorio. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
class RechazarDocumentoDialogComponent {
  constructor(dialogRef, data, fb) {
    this.dialogRef = dialogRef;
    this.data = data;
    this.fb = fb;
    this.form = this.fb.group({
      comentario: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.required]
    });
  }
  onNoClick() {
    this.dialogRef.close({
      rechazado: false,
      comentario: ''
    });
  }
  onConfirm() {
    if (this.form.valid) {
      this.dialogRef.close({
        rechazado: true,
        comentario: this.form.value.comentario
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
  static #_ = this.ɵfac = function RechazarDocumentoDialogComponent_Factory(t) {
    return new (t || RechazarDocumentoDialogComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__.MatDialogRef), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__.MAT_DIALOG_DATA), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormBuilder));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
    type: RechazarDocumentoDialogComponent,
    selectors: [["vex-rechazar-documento-dialog"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵStandaloneFeature"]],
    decls: 23,
    vars: 4,
    consts: [[1, "p-6"], [1, "flex", "items-center", "justify-between", "mb-6"], [1, "text-xl", "font-semibold", "text-gray-800"], ["mat-icon-button", "", 1, "text-gray-500", "hover:text-gray-700", 3, "click"], [1, "mb-4", "text-gray-700"], [3, "formGroup", "ngSubmit"], ["appearance", "outline", 1, "w-full", "mb-4"], ["matInput", "", "formControlName", "comentario", "rows", "3", "required", ""], [4, "ngIf"], [1, "flex", "justify-end", "gap-2"], ["mat-button", "", "type", "button", 3, "click"], ["mat-flat-button", "", "color", "warn", "type", "submit", 3, "disabled"]],
    template: function RechazarDocumentoDialogComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h2", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Rechazar Documento");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "button", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function RechazarDocumentoDialogComponent_Template_button_click_4_listener() {
          return ctx.onNoClick();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, "close");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "p", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, " \u00BFEst\u00E1s seguro de que deseas rechazar el documento ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "strong");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "? Por favor, proporciona un motivo. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "form", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngSubmit", function RechazarDocumentoDialogComponent_Template_form_ngSubmit_12_listener() {
          return ctx.onConfirm();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "mat-form-field", 6)(14, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "Motivo del rechazo");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](16, "textarea", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](17, RechazarDocumentoDialogComponent_mat_error_17_Template, 2, 0, "mat-error", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "div", 9)(19, "button", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function RechazarDocumentoDialogComponent_Template_button_click_19_listener() {
          return ctx.onNoClick();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, "Cancelar");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "button", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, "Rechazar");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
      }
      if (rf & 2) {
        let tmp_2_0;
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.data.documento.documento);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formGroup", ctx.form);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", (tmp_2_0 = ctx.form.get("comentario")) == null ? null : tmp_2_0.hasError("required"));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx.form.invalid);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgIf, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__.MatDialogModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_4__.MatFormFieldModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_4__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_4__.MatLabel, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_4__.MatError, _angular_material_input__WEBPACK_IMPORTED_MODULE_5__.MatInputModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_5__.MatInput, _angular_material_button__WEBPACK_IMPORTED_MODULE_6__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_6__.MatButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_6__.MatIconButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_7__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_7__.MatIcon, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormControlName],
    styles: ["\n\n.mat-mdc-dialog-container[_ngcontent-%COMP%] {\n  max-width: 500px;\n}\n\n.mat-mdc-form-field[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.mat-mdc-textarea[_ngcontent-%COMP%] {\n  resize: vertical;\n  min-height: 80px;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvbWVzYS1jb250cm9sL3ZhbGlkYWNpb24vcmVjaGF6YXItZG9jdW1lbnRvLWRpYWxvZy9yZWNoYXphci1kb2N1bWVudG8tZGlhbG9nLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLG1EQUFBO0FBQ0E7RUFDRSxnQkFBQTtBQUNGOztBQUVBO0VBQ0UsV0FBQTtBQUNGOztBQUVBO0VBQ0UsZ0JBQUE7RUFDQSxnQkFBQTtBQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyogRXN0aWxvcyBwYXJhIGVsIGRpYWxvZyBkZSByZWNoYXpvIGRlIGRvY3VtZW50byAqL1xuLm1hdC1tZGMtZGlhbG9nLWNvbnRhaW5lciB7XG4gIG1heC13aWR0aDogNTAwcHg7XG59XG5cbi5tYXQtbWRjLWZvcm0tZmllbGQge1xuICB3aWR0aDogMTAwJTtcbn1cblxuLm1hdC1tZGMtdGV4dGFyZWEge1xuICByZXNpemU6IHZlcnRpY2FsO1xuICBtaW4taGVpZ2h0OiA4MHB4O1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }),

/***/ 6223:
/*!***********************************************************************!*\
  !*** ./src/app/pages/mesa-control/validacion/validacion.component.ts ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ValidacionComponent: () => (/* binding */ ValidacionComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @angular/forms */ 28849);
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! @angular/material/card */ 18497);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! @angular/material/progress-spinner */ 33910);
/* harmony import */ var _angular_material_table__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/table */ 46798);
/* harmony import */ var _angular_material_paginator__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! @angular/material/paginator */ 39687);
/* harmony import */ var _angular_material_sort__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @angular/material/sort */ 87963);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! @angular/material/form-field */ 51333);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! @angular/material/input */ 10026);
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! @angular/material/select */ 96355);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/material/snack-bar */ 49409);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/material/dialog */ 17401);
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! @angular/material/tooltip */ 60702);
/* harmony import */ var _angular_material_chips__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! @angular/material/chips */ 21757);
/* harmony import */ var _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! @angular/material/checkbox */ 56658);
/* harmony import */ var _angular_material_menu__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! @angular/material/menu */ 78128);
/* harmony import */ var _angular_material_slide_toggle__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! @angular/material/slide-toggle */ 59293);
/* harmony import */ var _cancelar_pedido_dialog_cancelar_pedido_dialog_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cancelar-pedido-dialog/cancelar-pedido-dialog.component */ 13270);
/* harmony import */ var _excepcion_pedido_dialog_excepcion_pedido_dialog_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./excepcion-pedido-dialog/excepcion-pedido-dialog.component */ 8016);
/* harmony import */ var _eliminar_pedido_dialog_eliminar_pedido_dialog_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./eliminar-pedido-dialog/eliminar-pedido-dialog.component */ 25308);
/* harmony import */ var _cambiar_estatus_dialog_cambiar_estatus_dialog_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./cambiar-estatus-dialog/cambiar-estatus-dialog.component */ 27391);
/* harmony import */ var _aprobar_documento_dialog_aprobar_documento_dialog_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./aprobar-documento-dialog/aprobar-documento-dialog.component */ 64293);
/* harmony import */ var _rechazar_documento_dialog_rechazar_documento_dialog_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./rechazar-documento-dialog/rechazar-documento-dialog.component */ 28562);
/* harmony import */ var _core_constants_catalogs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../core/constants/catalogs */ 61037);
/* harmony import */ var _angular_cdk_scrolling__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! @angular/cdk/scrolling */ 50275);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! rxjs */ 20274);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! rxjs */ 64148);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! rxjs */ 72513);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! rxjs */ 2389);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! rxjs */ 84980);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../environments/environment */ 20553);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _validacion_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./validacion.service */ 17741);
/* harmony import */ var _core_services_default_agency_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../core/services/default-agency.service */ 44907);
/* harmony import */ var _core_services_auth_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../core/services/auth.service */ 90304);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/common/http */ 54860);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! @angular/material/core */ 55309);





















































function ValidacionComponent_mat_option_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "mat-option", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](1, "mat-spinner", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](2, " Cargando agencias... ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ValidacionComponent_mat_option_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "mat-option", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1, " No hay agencias disponibles (debugging) ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ValidacionComponent_mat_option_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "mat-option", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const agencia_r14 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("value", agencia_r14.Id);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", agencia_r14.Name, " ");
  }
}
function ValidacionComponent_mat_option_15_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "mat-option", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](1, "mat-spinner", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](2, " Cargando procesos... ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ValidacionComponent_mat_option_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "mat-option", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1, " No hay procesos disponibles ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ValidacionComponent_mat_option_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "mat-option", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const proceso_r15 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("value", proceso_r15.Id);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", proceso_r15.Name, " ");
  }
}
function ValidacionComponent_mat_option_24_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "mat-option", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const fase_r16 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("value", fase_r16.value);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", fase_r16.name, " ");
  }
}
function ValidacionComponent_button_32_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "button", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function ValidacionComponent_button_32_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r18);
      const ctx_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r17.clearSearch());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](1, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](2, "clear");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
}
function ValidacionComponent_div_40_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate2"](" Mostrando ", ctx_r8.clientesDataSource.data.length, " de ", ctx_r8.totalRecords, " registros ");
  }
}
function ValidacionComponent_div_43_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](1, "mat-spinner", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ValidacionComponent_table_45_th_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "th", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1, " ND Cliente ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ValidacionComponent_table_45_td_3_span_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "span", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1, "\u2605");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ValidacionComponent_table_45_td_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "td", 62)(1, "div", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](2, ValidacionComponent_table_45_td_3_span_2_Template, 2, 0, "span", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const item_r39 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", item_r39.tieneDocumentosPendientes == 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", item_r39.ndCliente, " ");
  }
}
function ValidacionComponent_table_45_th_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "th", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1, " ND Pedido ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ValidacionComponent_table_45_td_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "td", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r41 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", item_r41.ndPedido, " ");
  }
}
function ValidacionComponent_table_45_th_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "th", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1, " Cliente ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ValidacionComponent_table_45_td_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "td", 68)(1, "span", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const item_r42 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("matTooltip", item_r42.cliente);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", item_r42.cliente, " ");
  }
}
function ValidacionComponent_table_45_th_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "th", 70);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1, " Proceso ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ValidacionComponent_table_45_td_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "td", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r43 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", item_r43.proceso, " ");
  }
}
function ValidacionComponent_table_45_th_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "th", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1, " Operaci\u00F3n ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ValidacionComponent_table_45_td_15_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "td", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r44 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", item_r44.operacion, " ");
  }
}
function ValidacionComponent_table_45_th_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "th", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1, " Fase ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
const _c0 = (a0, a1, a2, a3, a4) => ({
  "bg-green-100 text-green-800": a0,
  "bg-blue-100 text-blue-800": a1,
  "bg-purple-100 text-purple-800": a2,
  "bg-red-100 text-red-800": a3,
  "bg-indigo-100 text-indigo-800": a4
});
function ValidacionComponent_table_45_td_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "td", 73)(1, "span", 74);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const item_r45 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpureFunction5"](2, _c0, item_r45.fase === "Integraci\u00F3n", item_r45.fase === "Liquidaci\u00F3n", item_r45.fase === "Liberaci\u00F3n", item_r45.fase === "Excepci\u00F3n", item_r45.fase === "Liberado"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", item_r45.fase, " ");
  }
}
function ValidacionComponent_table_45_th_20_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "th", 75);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1, " Fecha de Liberaci\u00F3n ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ValidacionComponent_table_45_td_21_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "td", 76);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](2, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r46 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind2"](2, 1, item_r46.fechaLiberacion, "yyyy-MM-dd"), " ");
  }
}
function ValidacionComponent_table_45_th_23_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "th", 77);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1, " Registro ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ValidacionComponent_table_45_td_24_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "td", 76);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r47 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", item_r47.registro, " ");
  }
}
function ValidacionComponent_table_45_th_26_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "th", 78)(1, "span", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](2, "Acciones");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
}
function ValidacionComponent_table_45_td_27_button_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r56 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "button", 82);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function ValidacionComponent_table_45_td_27_button_11_Template_button_click_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r56);
      const item_r48 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
      const ctx_r54 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2);
      ctx_r54.onCancelar(item_r48);
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"]($event.stopPropagation());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](1, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](2, "cancel");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](3, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](4, "Cancelar pedido");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
}
function ValidacionComponent_table_45_td_27_button_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r59 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "button", 82);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function ValidacionComponent_table_45_td_27_button_12_Template_button_click_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r59);
      const item_r48 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
      const ctx_r57 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2);
      ctx_r57.onExcepcion(item_r48);
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"]($event.stopPropagation());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](1, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](2, "warning");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](3, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](4, "Excepci\u00F3n en el pedido");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
}
function ValidacionComponent_table_45_td_27_button_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "button", 86)(1, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](2, "admin_panel_settings");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](3, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](4, "Administrar");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](5, "mat-icon", 87);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](6, "keyboard_arrow_right");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    const _r53 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵreference"](15);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("matMenuTriggerFor", _r53);
  }
}
function ValidacionComponent_table_45_td_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r61 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "td", 73)(1, "button", 79);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function ValidacionComponent_table_45_td_27_Template_button_click_1_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r61);
      const ctx_r60 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r60.onActionsClick($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](2, "mat-icon", 80);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](3, "more_vert");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](4, "mat-menu", null, 81)(6, "button", 82);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function ValidacionComponent_table_45_td_27_Template_button_click_6_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r61);
      const item_r48 = restoredCtx.$implicit;
      const ctx_r62 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2);
      ctx_r62.onDescargarArchivo(item_r48);
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"]($event.stopPropagation());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](7, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](8, "download");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](9, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](10, "Descargar archivo");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](11, ValidacionComponent_table_45_td_27_button_11_Template, 5, 0, "button", 83)(12, ValidacionComponent_table_45_td_27_button_12_Template, 5, 0, "button", 83)(13, ValidacionComponent_table_45_td_27_button_13_Template, 7, 1, "button", 84);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](14, "mat-menu", null, 85)(16, "button", 82);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function ValidacionComponent_table_45_td_27_Template_button_click_16_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r61);
      const item_r48 = restoredCtx.$implicit;
      const ctx_r63 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2);
      ctx_r63.onEliminar(item_r48);
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"]($event.stopPropagation());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](17, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](18, "delete");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](19, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](20, "Eliminar");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](21, "button", 82);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function ValidacionComponent_table_45_td_27_Template_button_click_21_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r61);
      const item_r48 = restoredCtx.$implicit;
      const ctx_r64 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2);
      ctx_r64.onCambiarEstatus(item_r48);
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"]($event.stopPropagation());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](22, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](23, "swap_horiz");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](24, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](25, "Cambiar estatus");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()()()();
  }
  if (rf & 2) {
    const item_r48 = ctx.$implicit;
    const _r49 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵreference"](5);
    const ctx_r36 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("matMenuTriggerFor", _r49);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", item_r48.fase !== "Liberado");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", item_r48.fase !== "Liberado");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r36.isManagerOrAdmin);
  }
}
function ValidacionComponent_table_45_tr_28_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](0, "tr", 88);
  }
}
const _c1 = a1 => ({
  "!min-h-0 !h-10 cursor-pointer hover:bg-blue-50 transition-colors": true,
  "bg-blue-100 border-l-4 border-blue-500": a1
});
function ValidacionComponent_table_45_tr_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r67 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "tr", 89);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function ValidacionComponent_table_45_tr_29_Template_tr_click_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r67);
      const row_r65 = restoredCtx.$implicit;
      const ctx_r66 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r66.onClienteSelect(row_r65));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const row_r65 = ctx.$implicit;
    const ctx_r38 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpureFunction1"](1, _c1, (ctx_r38.selectedCliente == null ? null : ctx_r38.selectedCliente.idFile) === row_r65.idFile));
  }
}
function ValidacionComponent_table_45_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "table", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerStart"](1, 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](2, ValidacionComponent_table_45_th_2_Template, 2, 0, "th", 38)(3, ValidacionComponent_table_45_td_3_Template, 4, 2, "td", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerStart"](4, 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](5, ValidacionComponent_table_45_th_5_Template, 2, 0, "th", 41)(6, ValidacionComponent_table_45_td_6_Template, 2, 1, "td", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerStart"](7, 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](8, ValidacionComponent_table_45_th_8_Template, 2, 0, "th", 43)(9, ValidacionComponent_table_45_td_9_Template, 3, 2, "td", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerStart"](10, 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](11, ValidacionComponent_table_45_th_11_Template, 2, 0, "th", 46)(12, ValidacionComponent_table_45_td_12_Template, 2, 1, "td", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerStart"](13, 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](14, ValidacionComponent_table_45_th_14_Template, 2, 0, "th", 48)(15, ValidacionComponent_table_45_td_15_Template, 2, 1, "td", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerStart"](16, 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](17, ValidacionComponent_table_45_th_17_Template, 2, 0, "th", 50)(18, ValidacionComponent_table_45_td_18_Template, 3, 8, "td", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerStart"](19, 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](20, ValidacionComponent_table_45_th_20_Template, 2, 0, "th", 53)(21, ValidacionComponent_table_45_td_21_Template, 3, 4, "td", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerStart"](22, 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](23, ValidacionComponent_table_45_th_23_Template, 2, 0, "th", 56)(24, ValidacionComponent_table_45_td_24_Template, 2, 1, "td", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerStart"](25, 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](26, ValidacionComponent_table_45_th_26_Template, 3, 0, "th", 58)(27, ValidacionComponent_table_45_td_27_Template, 26, 4, "td", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](28, ValidacionComponent_table_45_tr_28_Template, 1, 0, "tr", 59)(29, ValidacionComponent_table_45_tr_29_Template, 1, 3, "tr", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("dataSource", ctx_r10.clientesDataSource);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](28);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("matHeaderRowDef", ctx_r10.clientesDisplayedColumns);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("matRowDefColumns", ctx_r10.clientesDisplayedColumns);
  }
}
function ValidacionComponent_div_49_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 90)(1, "div", 91)(2, "mat-icon", 92);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](3, "info");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](4, "p", 80);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](5, "Selecciona un cliente/pedido de la tabla superior para ver sus documentos");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
  }
}
function ValidacionComponent_div_50_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](1, "mat-spinner", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ValidacionComponent_div_51_table_3_th_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "th", 115);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1, " Proceso ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ValidacionComponent_div_51_table_3_td_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "td", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r100 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", item_r100.proceso, " ");
  }
}
function ValidacionComponent_div_51_table_3_th_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "th", 78);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1, " Fase ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ValidacionComponent_div_51_table_3_td_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "td", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r101 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", item_r101.fase, " ");
  }
}
function ValidacionComponent_div_51_table_3_th_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "th", 116);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1, " Documento ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ValidacionComponent_div_51_table_3_td_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "td", 62)(1, "span", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const item_r102 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("matTooltip", item_r102.documento);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", item_r102.documento, " ");
  }
}
function ValidacionComponent_div_51_table_3_th_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "th", 117);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1, " Estatus ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ValidacionComponent_div_51_table_3_td_12_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 122)(1, "mat-icon", 123);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](2, "pending_actions");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
}
function ValidacionComponent_div_51_table_3_td_12_div_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 124)(1, "mat-icon", 125);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](2, "verified");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
}
function ValidacionComponent_div_51_table_3_td_12_div_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 126)(1, "mat-icon", 127);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](2, "cancel");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
}
function ValidacionComponent_div_51_table_3_td_12_div_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 128)(1, "mat-icon", 129);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](2, "hourglass_empty");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
}
function ValidacionComponent_div_51_table_3_td_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "td", 73);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](1, ValidacionComponent_div_51_table_3_td_12_div_1_Template, 3, 0, "div", 118)(2, ValidacionComponent_div_51_table_3_td_12_div_2_Template, 3, 0, "div", 119)(3, ValidacionComponent_div_51_table_3_td_12_div_3_Template, 3, 0, "div", 120)(4, ValidacionComponent_div_51_table_3_td_12_div_4_Template, 3, 0, "div", 121);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r103 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", item_r103.idEstatus === "2");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", item_r103.idEstatus === "4");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", item_r103.idEstatus === "5");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", item_r103.idEstatus !== "2" && item_r103.idEstatus !== "4" && item_r103.idEstatus !== "5");
  }
}
function ValidacionComponent_div_51_table_3_th_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "th", 130);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1, " Ver ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ValidacionComponent_div_51_table_3_td_15_button_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r113 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "button", 133);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function ValidacionComponent_div_51_table_3_td_15_button_1_Template_button_click_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r113);
      const item_r108 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
      const ctx_r111 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](3);
      ctx_r111.onVerDocumento(item_r108);
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"]($event.stopPropagation());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](1, "mat-icon", 134);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](2, "visibility");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
}
function ValidacionComponent_div_51_table_3_td_15_span_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "span", 135);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1, "-");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ValidacionComponent_div_51_table_3_td_15_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "td", 73);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](1, ValidacionComponent_div_51_table_3_td_15_button_1_Template, 3, 0, "button", 131)(2, ValidacionComponent_div_51_table_3_td_15_span_2_Template, 2, 0, "span", 132);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r108 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", item_r108.documentContainer);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", !item_r108.documentContainer);
  }
}
function ValidacionComponent_div_51_table_3_th_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "th", 117);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1, " Validar ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ValidacionComponent_div_51_table_3_td_18_div_1_mat_icon_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "mat-icon", 140);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1, "check_circle");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ValidacionComponent_div_51_table_3_td_18_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r120 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 137)(1, "button", 138);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function ValidacionComponent_div_51_table_3_td_18_div_1_Template_button_click_1_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r120);
      const item_r114 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
      const ctx_r118 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](3);
      ctx_r118.onValidarDocumento(item_r114);
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"]($event.stopPropagation());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](2, "mat-icon", 134);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](3, "mail");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](4, ValidacionComponent_div_51_table_3_td_18_div_1_mat_icon_4_Template, 2, 0, "mat-icon", 139);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r114 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", item_r114.validado);
  }
}
function ValidacionComponent_div_51_table_3_td_18_span_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "span", 135);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1, "-");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ValidacionComponent_div_51_table_3_td_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "td", 73);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](1, ValidacionComponent_div_51_table_3_td_18_div_1_Template, 5, 1, "div", 136)(2, ValidacionComponent_div_51_table_3_td_18_span_2_Template, 2, 0, "span", 132);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r114 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", item_r114.idEstatus === "3");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", item_r114.idEstatus !== "3");
  }
}
function ValidacionComponent_div_51_table_3_th_20_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "th", 117);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1, " Rechazar ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ValidacionComponent_div_51_table_3_td_21_button_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r127 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "button", 142);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function ValidacionComponent_div_51_table_3_td_21_button_1_Template_button_click_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r127);
      const item_r122 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
      const ctx_r125 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](3);
      ctx_r125.rechazarDocumento(item_r122);
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"]($event.stopPropagation());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](1, "mat-icon", 134);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](2, "close");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
}
function ValidacionComponent_div_51_table_3_td_21_span_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "span", 135);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1, "-");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ValidacionComponent_div_51_table_3_td_21_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "td", 73);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](1, ValidacionComponent_div_51_table_3_td_21_button_1_Template, 3, 0, "button", 141)(2, ValidacionComponent_div_51_table_3_td_21_span_2_Template, 2, 0, "span", 132);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r122 = ctx.$implicit;
    const ctx_r83 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r83.isManagerOrAdmin && item_r122.idEstatus === "4");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", !ctx_r83.isManagerOrAdmin || item_r122.idEstatus !== "4");
  }
}
function ValidacionComponent_div_51_table_3_th_23_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "th", 117);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1, " Eliminar ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ValidacionComponent_div_51_table_3_td_24_button_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "button", 144)(1, "mat-icon", 134);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](2, "remove_circle");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
}
function ValidacionComponent_div_51_table_3_td_24_span_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "span", 135);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1, "-");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ValidacionComponent_div_51_table_3_td_24_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "td", 73);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](1, ValidacionComponent_div_51_table_3_td_24_button_1_Template, 3, 0, "button", 143)(2, ValidacionComponent_div_51_table_3_td_24_span_2_Template, 2, 0, "span", 132);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r85 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r85.isManagerOrAdmin);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", !ctx_r85.isManagerOrAdmin);
  }
}
function ValidacionComponent_div_51_table_3_th_26_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "th", 78);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1, " Requerido ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ValidacionComponent_div_51_table_3_td_27_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "td", 73)(1, "span", 145);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const item_r131 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngClass", item_r131.requerido == 1 ? "text-green-600" : "text-gray-400");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", item_r131.requerido == 1 ? "S\u00ED" : "No", " ");
  }
}
function ValidacionComponent_div_51_table_3_th_29_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "th", 146);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1, " Requiere Expiraci\u00F3n ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ValidacionComponent_div_51_table_3_td_30_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "td", 73)(1, "span", 147);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const item_r132 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵclassMap"](item_r132.ReqExpiration == 1 || item_r132.ReqExpiration === "1" ? "bg-orange-100 text-orange-800" : "bg-gray-100 text-gray-800");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", item_r132.ReqExpiration == 1 || item_r132.ReqExpiration === "1" ? "S\u00ED" : "No", " ");
  }
}
function ValidacionComponent_div_51_table_3_th_32_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "th", 148);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1, " Fecha ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ValidacionComponent_div_51_table_3_td_33_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "td", 62)(1, "span", 149);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const item_r133 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("matTooltip", item_r133.fecha);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", item_r133.fecha, " ");
  }
}
function ValidacionComponent_div_51_table_3_th_35_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "th", 148);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1, " Fecha Expiraci\u00F3n ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ValidacionComponent_div_51_table_3_td_36_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "span", 152);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](2, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r134 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
    const ctx_r135 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("matTooltip", ctx_r135.getFechaExpiracionTooltip(item_r134.fechaExpiracion));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind2"](2, 2, item_r134.fechaExpiracion, "dd/MM/yyyy"), " ");
  }
}
function ValidacionComponent_div_51_table_3_td_36_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "span", 153);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1, "-");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ValidacionComponent_div_51_table_3_td_36_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "td", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](1, ValidacionComponent_div_51_table_3_td_36_span_1_Template, 3, 5, "span", 150)(2, ValidacionComponent_div_51_table_3_td_36_ng_template_2_Template, 2, 0, "ng-template", null, 151, _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r134 = ctx.$implicit;
    const _r137 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", item_r134.fechaExpiracion)("ngIfElse", _r137);
  }
}
function ValidacionComponent_div_51_table_3_th_38_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "th", 154);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1, " Comentario ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ValidacionComponent_div_51_table_3_td_39_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "td", 62)(1, "span", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const item_r139 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("matTooltip", item_r139.comentario);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", item_r139.comentario, " ");
  }
}
function ValidacionComponent_div_51_table_3_th_41_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "th", 155);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1, " Asignado ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ValidacionComponent_div_51_table_3_td_42_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "td", 62)(1, "span", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const item_r140 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("matTooltip", item_r140.asignado);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", item_r140.asignado, " ");
  }
}
function ValidacionComponent_div_51_table_3_tr_43_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](0, "tr", 88);
  }
}
function ValidacionComponent_div_51_table_3_tr_44_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](0, "tr", 156);
  }
}
function ValidacionComponent_div_51_table_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "table", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerStart"](1, 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](2, ValidacionComponent_div_51_table_3_th_2_Template, 2, 0, "th", 94)(3, ValidacionComponent_div_51_table_3_td_3_Template, 2, 1, "td", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerStart"](4, 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](5, ValidacionComponent_div_51_table_3_th_5_Template, 2, 0, "th", 58)(6, ValidacionComponent_div_51_table_3_td_6_Template, 2, 1, "td", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerStart"](7, 95);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](8, ValidacionComponent_div_51_table_3_th_8_Template, 2, 0, "th", 96)(9, ValidacionComponent_div_51_table_3_td_9_Template, 3, 2, "td", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerStart"](10, 97);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](11, ValidacionComponent_div_51_table_3_th_11_Template, 2, 0, "th", 98)(12, ValidacionComponent_div_51_table_3_td_12_Template, 5, 4, "td", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerStart"](13, 99);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](14, ValidacionComponent_div_51_table_3_th_14_Template, 2, 0, "th", 100)(15, ValidacionComponent_div_51_table_3_td_15_Template, 3, 2, "td", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerStart"](16, 101);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](17, ValidacionComponent_div_51_table_3_th_17_Template, 2, 0, "th", 98)(18, ValidacionComponent_div_51_table_3_td_18_Template, 3, 2, "td", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerStart"](19, 102);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](20, ValidacionComponent_div_51_table_3_th_20_Template, 2, 0, "th", 98)(21, ValidacionComponent_div_51_table_3_td_21_Template, 3, 2, "td", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerStart"](22, 103);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](23, ValidacionComponent_div_51_table_3_th_23_Template, 2, 0, "th", 98)(24, ValidacionComponent_div_51_table_3_td_24_Template, 3, 2, "td", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerStart"](25, 104);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](26, ValidacionComponent_div_51_table_3_th_26_Template, 2, 0, "th", 58)(27, ValidacionComponent_div_51_table_3_td_27_Template, 3, 2, "td", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerStart"](28, 105);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](29, ValidacionComponent_div_51_table_3_th_29_Template, 2, 0, "th", 106)(30, ValidacionComponent_div_51_table_3_td_30_Template, 3, 3, "td", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerStart"](31, 107);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](32, ValidacionComponent_div_51_table_3_th_32_Template, 2, 0, "th", 108)(33, ValidacionComponent_div_51_table_3_td_33_Template, 3, 2, "td", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerStart"](34, 109);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](35, ValidacionComponent_div_51_table_3_th_35_Template, 2, 0, "th", 108)(36, ValidacionComponent_div_51_table_3_td_36_Template, 4, 2, "td", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerStart"](37, 110);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](38, ValidacionComponent_div_51_table_3_th_38_Template, 2, 0, "th", 111)(39, ValidacionComponent_div_51_table_3_td_39_Template, 3, 2, "td", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerStart"](40, 112);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](41, ValidacionComponent_div_51_table_3_th_41_Template, 2, 0, "th", 113)(42, ValidacionComponent_div_51_table_3_td_42_Template, 3, 2, "td", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](43, ValidacionComponent_div_51_table_3_tr_43_Template, 1, 0, "tr", 59)(44, ValidacionComponent_div_51_table_3_tr_44_Template, 1, 0, "tr", 114);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r68 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("dataSource", ctx_r68.documentosDataSource);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](43);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("matHeaderRowDef", ctx_r68.documentosDisplayedColumns);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("matRowDefColumns", ctx_r68.documentosDisplayedColumns);
  }
}
function ValidacionComponent_div_51_div_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 90)(1, "div", 91)(2, "mat-icon", 92);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](3, "folder_open");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](4, "p", 80);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](5, "No hay documentos disponibles para este cliente y pedido");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
  }
}
function ValidacionComponent_div_51_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div")(1, "div", 93);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](3, ValidacionComponent_div_51_table_3_Template, 45, 3, "table", 24)(4, ValidacionComponent_div_51_div_4_Template, 6, 0, "div", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate3"](" Mostrando ", ctx_r13.documentosDataSource.length, " documentos para el cliente ", ctx_r13.selectedCliente.cliente, " (Pedido: ", ctx_r13.selectedCliente.ndPedido, ") ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r13.documentosDataSource.length > 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r13.documentosDataSource.length === 0);
  }
}
class ValidacionComponent {
  // Verificar si el usuario es gerente o administrador
  get isManagerOrAdmin() {
    const user = this.authService.getCurrentUser();
    if (!user) return false;
    // Gerente (role_id = '6') o Administrador (role_id = '7')
    return user.role_id === '6' || user.role_id === '7';
  }
  // Método auxiliar para el tooltip de fecha de expiración
  getFechaExpiracionTooltip(fechaExpiracion) {
    return fechaExpiracion ? fechaExpiracion : '';
  }
  // Métodos para las acciones del menú
  onDescargarArchivo(cliente) {
    console.log('Descargar archivo para cliente:', cliente);
    // Implementar lógica de descarga
    this.snackBar.open(`Descargando archivo para ${cliente.cliente}`, 'Cerrar', {
      duration: 3000
    });
  }
  /**
   * Validar documento - abrir dialog para aprobar/rechazar
   */
  onValidarDocumento(documento) {
    console.log('Validar documento:', documento);
    // Verificar que el estatus actual sea "3"
    if (documento.idEstatus !== '3') {
      this.snackBar.open('Solo se pueden validar documentos con estatus listo para validar', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    // Crear dialog para aprobar/rechazar documento
    const dialogData = {
      documento: documento
    };
    const dialogRef = this.dialog.open(_aprobar_documento_dialog_aprobar_documento_dialog_component__WEBPACK_IMPORTED_MODULE_4__.AprobarDocumentoDialogComponent, {
      width: '600px',
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Resultado del dialog:', result);
        this.procesarAprobacionDocumento(documento, result);
      }
    });
  }
  /**
   * Ver documento - abrir el archivo directamente
   */
  onVerDocumento(documento) {
    console.log('🖱️ CLICK EN BOTÓN VER - onVerDocumento ejecutándose');
    console.log('🔍 Ver documento:', documento);
    // Verificar si hay un documentContainer (nombre del archivo)
    if (!documento.documentContainer) {
      console.log('❌ No hay documentContainer disponible');
      this.snackBar.open('No se puede visualizar el documento. No hay archivo asociado.', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    console.log('📁 Usando documentContainer:', documento.documentContainer);
    // Si el documento está en estatus 2 (Documento Cargado), cambiar a estatus 3 (En revisión)
    if (documento.idEstatus === '2') {
      console.log('📝 Documento en estatus 2, cambiando a estatus 3 (En revisión)...');
      this.validacionService.prepararDocumento(documento.idDocumentByFile).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_12__.takeUntil)(this.destroy$)).subscribe({
        next: () => {
          console.log('✅ Estatus cambiado a 3 (En revisión)');
          // Actualizar el estatus local del documento
          documento.idEstatus = '3';
          // Abrir el documento
          this.getBackblazePrivateUrl(documento.documentContainer, documento);
          // Recargar documentos para reflejar el cambio
          if (this.selectedCliente) {
            this.cargarDocumentosCliente(this.selectedCliente.idFile);
          }
        },
        error: error => {
          console.error('❌ Error al cambiar estatus del documento:', error);
          // Aún así abrir el documento, el cambio de estatus no debe bloquear la visualización
          this.snackBar.open('Advertencia: No se pudo cambiar el estatus del documento', 'Cerrar', {
            duration: 3000
          });
          this.getBackblazePrivateUrl(documento.documentContainer, documento);
        }
      });
    } else {
      // Si ya está en otro estatus, solo abrir el documento
      console.log('📄 Documento en estatus', documento.idEstatus, '- abriendo directamente');
      this.getBackblazePrivateUrl(documento.documentContainer, documento);
    }
  }
  /**
   * Obtener URL privada de Backblaze y abrir el documento en nueva pestaña
   */
  getBackblazePrivateUrl(fileName, documento) {
    console.log('🔍 getBackblazePrivateUrl llamado con:', {
      fileName,
      documento
    });
    const duration = 3600; // 1 hora por defecto
    const params = new URLSearchParams({
      file: fileName,
      duration: duration.toString()
    });
    const url = `${_environments_environment__WEBPACK_IMPORTED_MODULE_7__.environment.vanguardia.uploadApiUrl.replace('/upload', '')}/get-private-url?${params.toString()}`;
    console.log('🔗 URL completa:', url);
    const headers = {
      'Content-Type': 'application/json',
      'X-Provider-Token': 'b26e88c4-ddbe-4adb-a214-4667f454824a'
    };
    this.http.get(url, {
      headers
    }).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_12__.takeUntil)(this.destroy$)).subscribe({
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
  /**
   * Procesar aprobación/rechazo de documento
   */
  procesarAprobacionDocumento(documento, resultado) {
    console.log('Procesando aprobación de documento:', documento, resultado);
    const nuevoEstatus = resultado.aprobado ? 4 : 5; // 4 = Aprobado, 5 = Rechazado
    this.validacionService.aprobarDocumento(documento.idDocumentByFile, nuevoEstatus, resultado.comentario, resultado.fechaExpiracion).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_12__.takeUntil)(this.destroy$), (0,rxjs__WEBPACK_IMPORTED_MODULE_13__.timeout)(10000)).subscribe({
      next: response => {
        console.log('✅ Documento procesado exitosamente:', response);
        const mensaje = resultado.aprobado ? 'Documento aprobado exitosamente' : 'Documento rechazado exitosamente';
        this.snackBar.open(mensaje, 'Cerrar', {
          duration: 3000
        });
        // Recargar documentos para reflejar el cambio
        if (this.selectedCliente) {
          this.cargarDocumentosCliente(this.selectedCliente.idFile);
        }
      },
      error: error => {
        console.error('❌ Error procesando documento:', error);
        this.snackBar.open(`Error al procesar el documento: ${error.message || 'Error desconocido'}`, 'Cerrar', {
          duration: 5000
        });
      }
    });
  }
  /**
   * Método interno para preparar documento (reutilizable)
   */
  validarDocumentoInterno(documento) {
    console.log('Preparando documento desde botón Ver:', documento);
    this.validacionService.prepararDocumento(documento.idDocumentByFile).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_12__.takeUntil)(this.destroy$), (0,rxjs__WEBPACK_IMPORTED_MODULE_13__.timeout)(10000)).subscribe({
      next: response => {
        console.log('✅ Documento preparado exitosamente desde botón Ver:', response);
        this.snackBar.open('Documento preparado para validación exitosamente', 'Cerrar', {
          duration: 3000
        });
        // Recargar documentos para reflejar el cambio
        if (this.selectedCliente) {
          this.cargarDocumentosCliente(this.selectedCliente.idFile);
        }
      },
      error: error => {
        console.error('❌ Error preparando documento desde botón Ver:', error);
        this.snackBar.open(`Error al preparar el documento: ${error.message || 'Error desconocido'}`, 'Cerrar', {
          duration: 5000
        });
      }
    });
  }
  // Método para prevenir la propagación del evento en el botón de acciones
  onActionsClick(event) {
    event.stopPropagation();
    event.preventDefault();
  }
  // Método para manejar el toggle de pedidos cancelados
  onToggleCancelledOrders() {
    console.log('🔄 ValidacionComponent - Toggle pedidos cancelados:', this.showCancelledOrders);
    this.cargarClientes();
  }
  onCancelar(cliente) {
    console.log('Cancelar para cliente:', cliente);
    const dialogData = {
      cliente: cliente
    };
    const dialogRef = this.dialog.open(_cancelar_pedido_dialog_cancelar_pedido_dialog_component__WEBPACK_IMPORTED_MODULE_0__.CancelarPedidoDialogComponent, {
      width: '600px',
      data: dialogData,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Resultado de cancelación:', result);
        this.procesarCancelacion(cliente, result);
      }
    });
  }
  procesarCancelacion(cliente, result) {
    console.log('Procesando cancelación:', {
      cliente: cliente,
      motivoId: result.motivoId,
      comentario: result.comentario
    });
    // Llamar al servicio para cancelar el pedido
    this.validacionService.cancelarPedido(cliente.idFile, result.motivoId, result.comentario).subscribe({
      next: response => {
        console.log('Pedido cancelado exitosamente:', response);
        this.snackBar.open(`Pedido ${cliente.ndPedido} cancelado exitosamente`, 'Cerrar', {
          duration: 5000
        });
        // Recargar los datos para reflejar el cambio
        this.cargarClientes();
      },
      error: error => {
        console.error('Error cancelando pedido:', error);
        this.snackBar.open(`Error al cancelar el pedido: ${error.message || 'Error desconocido'}`, 'Cerrar', {
          duration: 5000
        });
      }
    });
  }
  onExcepcion(cliente) {
    console.log('Excepción para cliente:', cliente);
    const dialogData = {
      cliente: cliente
    };
    const dialogRef = this.dialog.open(_excepcion_pedido_dialog_excepcion_pedido_dialog_component__WEBPACK_IMPORTED_MODULE_1__.ExcepcionPedidoDialogComponent, {
      width: '600px',
      data: dialogData,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Resultado de excepción:', result);
        this.procesarExcepcion(cliente, result);
      }
    });
  }
  procesarExcepcion(cliente, result) {
    console.log('Procesando excepción:', {
      cliente: cliente,
      motivoId: result.motivoId,
      comentario: result.comentario
    });
    // Llamar al servicio para crear la excepción
    this.validacionService.excepcionPedido(cliente.idFile, result.motivoId, result.comentario).subscribe({
      next: response => {
        console.log('Excepción creada exitosamente:', response);
        this.snackBar.open(`Excepción creada para el pedido ${cliente.ndPedido}`, 'Cerrar', {
          duration: 5000
        });
        // Recargar los datos para reflejar el cambio
        this.cargarClientes();
      },
      error: error => {
        console.error('Error creando excepción:', error);
        this.snackBar.open(`Error al crear la excepción: ${error.message || 'Error desconocido'}`, 'Cerrar', {
          duration: 5000
        });
      }
    });
  }
  onAdministrar(cliente) {
    console.log('Administrar para cliente:', cliente);
    // Este método ya no se usa directamente, ahora abre el submenú
  }

  onEliminar(cliente) {
    console.log('Eliminar para cliente:', cliente);
    const dialogData = {
      cliente: cliente
    };
    const dialogRef = this.dialog.open(_eliminar_pedido_dialog_eliminar_pedido_dialog_component__WEBPACK_IMPORTED_MODULE_2__.EliminarPedidoDialogComponent, {
      width: '600px',
      data: dialogData,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.confirmado) {
        console.log('Confirmación de eliminación:', result);
        this.procesarEliminacion(cliente);
      }
    });
  }
  procesarEliminacion(cliente) {
    console.log('Procesando eliminación:', cliente);
    // Llamar al servicio para eliminar el pedido
    this.validacionService.eliminarPedido(cliente.idFile).subscribe({
      next: response => {
        console.log('Pedido eliminado exitosamente:', response);
        this.snackBar.open(`Pedido ${cliente.ndPedido} eliminado exitosamente`, 'Cerrar', {
          duration: 5000
        });
        // Recargar los datos para reflejar el cambio
        this.cargarClientes();
      },
      error: error => {
        console.error('Error eliminando pedido:', error);
        this.snackBar.open(`Error al eliminar el pedido: ${error.message || 'Error desconocido'}`, 'Cerrar', {
          duration: 5000
        });
      }
    });
  }
  onCambiarEstatus(cliente) {
    console.log('Cambiar estatus para cliente:', cliente);
    const dialogData = {
      cliente: cliente
    };
    const dialogRef = this.dialog.open(_cambiar_estatus_dialog_cambiar_estatus_dialog_component__WEBPACK_IMPORTED_MODULE_3__.CambiarEstatusDialogComponent, {
      width: '600px',
      data: dialogData,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Resultado de cambio de estatus:', result);
        this.procesarCambioEstatus(cliente, result);
      }
    });
  }
  procesarCambioEstatus(cliente, result) {
    console.log('Procesando cambio de estatus:', {
      cliente: cliente,
      nuevoEstatus: result.nuevoEstatus,
      nuevoIdCurrentState: result.nuevoIdCurrentState
    });
    // Llamar al servicio para cambiar el estatus
    this.validacionService.cambiarEstatus(cliente.idFile, result.nuevoIdCurrentState).subscribe({
      next: response => {
        console.log('Estatus cambiado exitosamente:', response);
        this.snackBar.open(`Estatus del pedido ${cliente.ndPedido} cambiado a ${result.nuevoEstatus}`, 'Cerrar', {
          duration: 5000
        });
        // Recargar los datos para reflejar el cambio
        this.cargarClientes();
      },
      error: error => {
        console.error('Error cambiando estatus:', error);
        this.snackBar.open(`Error al cambiar el estatus: ${error.message || 'Error desconocido'}`, 'Cerrar', {
          duration: 5000
        });
      }
    });
  }
  // Método temporal para obtener el rol del usuario
  getCurrentUserRole() {
    // Implementar la lógica real para obtener el rol del usuario
    // Por ahora retorno 'gerente' para mostrar la opción
    return 'gerente';
  }
  // Verificar si las opciones de cancelar y excepción están disponibles
  canCancelOrCreateException(cliente) {
    return cliente.IdCurrentState !== 3; // Liberado
  }

  constructor(validacionService, defaultAgencyService, snackBar, dialog, authService, http) {
    this.validacionService = validacionService;
    this.defaultAgencyService = defaultAgencyService;
    this.snackBar = snackBar;
    this.dialog = dialog;
    this.authService = authService;
    this.http = http;
    this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_14__.Subject();
    // Estado del componente
    this.loading = false;
    this.loadingAgencias = false;
    this.loadingProcesos = false; // Specific loading state for processes
    this.error = '';
    // Filtros principales
    this.selectedAgency = null;
    this.selectedProcess = null;
    this.selectedFase = '';
    this.showCancelledOrders = false;
    // Datos de filtros disponibles
    this.agencias = [];
    this.procesos = [];
    this.fases = _core_constants_catalogs__WEBPACK_IMPORTED_MODULE_6__.FASES_CATALOG;
    // Tabla de clientes
    this.clientesDisplayedColumns = ['ndCliente', 'ndPedido', 'cliente', 'proceso', 'operacion', 'fase', 'fechaLiberacion', 'registro', 'acciones'];
    this.clientesDataSource = new _angular_material_table__WEBPACK_IMPORTED_MODULE_15__.MatTableDataSource([]);
    // Paginación
    this.pageSize = 7;
    this.pageSizeOptions = [5, 7, 10, 25, 50];
    this.currentPage = 0;
    this.totalRecords = 0;
    this.allClientes = []; // Todos los clientes para paginación local
    this.clientesOriginales = []; // Copia de respaldo de todos los clientes originales
    // Tabla de documentos
    this.documentosDisplayedColumns = ['proceso', 'fase', 'documento', 'estatus', 'ver', 'validar', 'rechazar', 'eliminar', 'requerido', 'requiereExpiracion', 'fecha', 'fechaExpiracion', 'comentario', 'asignado'];
    this.documentosDataSource = [];
    // Cliente seleccionado
    this.selectedCliente = null;
    // Búsqueda
    this.searchTerm = '';
    console.log('🔧 ValidacionComponent - Constructor ejecutado');
  }
  ngOnInit() {
    console.log('🔧 ValidacionComponent - ngOnInit ejecutado');
    this.cargarAgencias();
    this.cargarProcesos();
    this.loadData();
    // Suscribirse a los cambios de agencia del servicio compartido
    this.defaultAgencyService.selectedAgency$.subscribe(agenciaId => {
      if (agenciaId !== null) {
        this.selectedAgency = agenciaId;
        console.log('🔄 ValidacionComponent - Agencia actualizada desde servicio:', agenciaId);
        // Si hay proceso seleccionado, cargar clientes
        if (this.selectedProcess !== null) {
          this.cargarClientes();
        }
      }
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  ngAfterViewInit() {
    // Configurar ordenamiento después de que la vista esté inicializada
    console.log('🔧 ValidacionComponent - ngAfterViewInit ejecutado');
    console.log('🔧 ValidacionComponent - MatSort disponible:', this.sort);
    console.log('🔧 ValidacionComponent - Tipo de MatSort:', typeof this.sort);
    console.log('🔧 ValidacionComponent - MatSort propiedades:', Object.keys(this.sort || {}));
    if (this.sort) {
      console.log('✅ ValidacionComponent - MatSort configurado correctamente');
      console.log('🔧 ValidacionComponent - Configurando suscripción a sortChange...');
      this.sort.sortChange.subscribe(sortEvent => {
        console.log('🔄 ValidacionComponent - Evento de ordenamiento detectado:', sortEvent);
        console.log('🔧 ValidacionComponent - Evento completo:', JSON.stringify(sortEvent));
        this.aplicarOrdenamiento();
      });
      console.log('✅ ValidacionComponent - Suscripción a sortChange configurada');
      // Conectar MatSort al MatTableDataSource
      this.clientesDataSource.sort = this.sort;
      console.log('✅ ValidacionComponent - MatSort conectado al MatTableDataSource');
      // Configurar ordenamiento automático
      this.clientesDataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'ndCliente':
            return item.idFile;
          case 'ndPedido':
            return item.ndPedido;
          case 'cliente':
            return item.cliente;
          case 'proceso':
            return item.proceso;
          case 'operacion':
            return item.operacion;
          case 'fase':
            return item.fase;
          case 'registro':
            return new Date(item.registro);
          case 'fechaLiberacion':
            return new Date(item.fechaLiberacion);
          default:
            return item[property];
        }
      };
    } else {
      console.error('❌ ValidacionComponent - MatSort no está disponible');
    }
  }
  /**
   * Manejar la selección de un cliente de la tabla superior
   */
  onClienteSelect(cliente) {
    console.log('🔍 ValidacionComponent - Cliente seleccionado:', cliente);
    // Guardar el cliente seleccionado
    this.selectedCliente = cliente;
    // Cargar los documentos del archivo específico
    this.cargarDocumentosCliente(cliente.idFile);
  }
  /**
   * Seleccionar cliente programáticamente (para selección automática)
   */
  seleccionarCliente(cliente) {
    console.log('🤖 ValidacionComponent - Selección automática del primer cliente:', cliente);
    this.onClienteSelect(cliente);
  }
  /**
   * Limpiar la selección del cliente
   */
  clearSelection() {
    console.log('🧹 ValidacionComponent - Limpiando selección de cliente');
    this.selectedCliente = null;
    this.documentosDataSource = [];
  }
  /**
   * Cargar documentos de un archivo específico
   */
  cargarDocumentosCliente(idFile) {
    console.log('📄 ValidacionComponent - Cargando documentos para archivo:', idFile);
    this.loading = true;
    this.validacionService.cargarDocumentos(idFile).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_12__.takeUntil)(this.destroy$), (0,rxjs__WEBPACK_IMPORTED_MODULE_13__.timeout)(10000)).subscribe({
      next: documentos => {
        console.log('📥 ValidacionComponent - Documentos recibidos:', documentos);
        this.documentosDataSource = documentos;
        this.loading = false;
      },
      error: error => {
        console.error('❌ ValidacionComponent - Error cargando documentos:', error);
        this.mostrarError('Error cargando documentos del archivo');
        this.documentosDataSource = [];
        this.loading = false;
      }
    });
  }
  /**
   * Cargar procesos desde la API
   */
  cargarProcesos() {
    console.log('🔄 ValidacionComponent - Iniciando carga de procesos...');
    this.loadingProcesos = true;
    this.validacionService.cargarProcesos().pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_12__.takeUntil)(this.destroy$), (0,rxjs__WEBPACK_IMPORTED_MODULE_13__.timeout)(10000),
    // 10 segundos de timeout
    (0,rxjs__WEBPACK_IMPORTED_MODULE_16__.catchError)(error => {
      if (error.name === 'TimeoutError') {
        console.error('⏰ ValidacionComponent - Timeout cargando procesos');
        this.mostrarError('Timeout: La carga de procesos tardó demasiado');
      } else {
        console.error('❌ ValidacionComponent - Error cargando procesos:', error);
        this.mostrarError('Error cargando procesos');
      }
      this.procesos = [];
      this.loadingProcesos = false;
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_17__.of)([]);
    })).subscribe({
      next: procesos => {
        console.log('📥 ValidacionComponent - Respuesta de procesos recibida:', procesos);
        // Verificar que procesos sea un array
        if (!Array.isArray(procesos)) {
          console.error('❌ ValidacionComponent - La respuesta no es un array:', procesos);
          this.procesos = [];
          this.loadingProcesos = false;
          return;
        }
        console.log('📊 ValidacionComponent - Total de procesos recibidos:', procesos.length);
        // Debug: mostrar el estado de cada proceso
        procesos.forEach((proceso, index) => {
          console.log(`🔍 Proceso ${index}:`, {
            id: proceso.Id,
            name: proceso.Name,
            enabled: proceso.Enabled,
            enabledType: typeof proceso.Enabled,
            enabledString: String(proceso.Enabled),
            enabledBoolean: Boolean(proceso.Enabled),
            enabledNumber: Number(proceso.Enabled),
            allFields: proceso
          });
        });
        // TEMPORAL: Mostrar todos los procesos para debugging
        this.procesos = procesos.filter(proceso => proceso);
        // ORIGINAL: Mostrar solo procesos habilitados (Enabled = 1)
        // this.procesos = procesos.filter(proceso => proceso && proceso.Enabled === 1);
        console.log('✅ ValidacionComponent - Procesos mostrados (todos):', this.procesos);
        console.log('📊 ValidacionComponent - Total de procesos mostrados:', this.procesos.length);
        // Seleccionar el primer proceso por defecto si hay alguno
        if (this.procesos.length > 0) {
          this.selectedProcess = this.procesos[0].Id;
          console.log('🎯 ValidacionComponent - Proceso seleccionado por defecto:', this.selectedProcess);
          // Si ya hay agencia seleccionada, cargar clientes automáticamente
          if (this.selectedAgency !== null) {
            console.log('🔄 ValidacionComponent - Cargando clientes automáticamente con proceso seleccionado');
            this.cargarClientes();
          }
        } else {
          console.warn('⚠️ ValidacionComponent - No se encontraron procesos habilitados');
          this.selectedProcess = null;
        }
        this.loadingProcesos = false;
      },
      error: error => {
        console.error('❌ ValidacionComponent - Error en subscribe de procesos:', error);
        this.procesos = [];
        this.selectedProcess = null;
        this.loadingProcesos = false;
      }
    });
  }
  /**
   * Cargar agencias desde la API usando el servicio compartido
   */
  cargarAgencias() {
    console.log('🔄 ValidacionComponent - Iniciando carga de agencias...');
    this.loadingAgencias = true;
    this.defaultAgencyService.obtenerAgencias().pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_12__.takeUntil)(this.destroy$), (0,rxjs__WEBPACK_IMPORTED_MODULE_13__.timeout)(10000) // 10 segundos de timeout
    ).subscribe({
      next: agencias => {
        console.log('📥 ValidacionComponent - Agencias cargadas desde servicio compartido:', agencias);
        this.agencias = agencias;
        this.loadingAgencias = false;
        // Esperar un momento para asegurar que las agencias estén disponibles en el servicio
        setTimeout(() => {
          // Establecer agencia predeterminada usando el servicio compartido
          this.defaultAgencyService.establecerAgenciaPredeterminada(true).subscribe({
            next: agenciaId => {
              if (agenciaId) {
                console.log('✅ ValidacionComponent - Agencia predeterminada establecida:', agenciaId);
              } else {
                console.warn('⚠️ ValidacionComponent - No se pudo establecer agencia predeterminada');
              }
            },
            error: error => {
              console.error('❌ ValidacionComponent - Error estableciendo agencia predeterminada:', error);
              // Si falla, intentar seleccionar la primera agencia disponible
              if (this.agencias.length > 0) {
                const primeraAgencia = this.agencias[0];
                console.log('🔄 ValidacionComponent - Seleccionando primera agencia disponible como fallback:', primeraAgencia);
                this.selectedAgency = primeraAgencia.Id;
                this.defaultAgencyService.seleccionarAgencia(primeraAgencia.Id);
              }
            }
          });
        }, 100);
      },
      error: error => {
        console.error('❌ ValidacionComponent - Error cargando agencias:', error);
        this.mostrarError('Error cargando agencias');
        this.agencias = [];
        this.selectedAgency = null;
        this.loadingAgencias = false;
      }
    });
  }
  /**
   * Recargar todos los datos del componente
   */
  recargarDatos() {
    console.log('🔄 ValidacionComponent - Recargando todos los datos...');
    // Resetear estados de carga
    this.loading = true;
    this.loadingAgencias = true;
    this.loadingProcesos = true;
    // Limpiar datos existentes
    this.allClientes = [];
    this.clientesOriginales = [];
    this.clientesDataSource.data = [];
    this.procesos = [];
    this.selectedAgency = null;
    this.selectedProcess = null;
    this.selectedFase = '';
    this.searchTerm = '';
    // Recargar agencias y procesos
    this.cargarAgencias();
    this.cargarProcesos();
    // Limpiar selección de cliente y documentos
    this.clearSelection();
    // Mostrar mensaje de recarga
    this.snackBar.open('Recargando datos...', 'Cerrar', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
  loadData() {
    // Los datos se cargarán cuando se seleccione agencia y proceso
    console.log('🔄 ValidacionComponent - loadData() llamado, esperando selección de agencia y proceso');
  }
  // Métodos para estadísticas
  getIntegradosCount() {
    return this.clientesDataSource.data.filter(item => item.integracion).length;
  }
  getPendientesCount() {
    return this.clientesDataSource.data.filter(item => !item.integracion).length;
  }
  // Métodos de acción
  validarDocumento(id) {
    console.log('Validando documento:', id);
    // Implementar lógica de validación
  }

  rechazarDocumento(documento) {
    console.log('Rechazando documento:', documento);
    // Verificar que el documento esté en estatus 4 (aprobado)
    if (documento.idEstatus !== '4') {
      this.snackBar.open('Solo se pueden rechazar documentos aprobados', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    // Crear dialog de confirmación
    const dialogRef = this.dialog.open(_rechazar_documento_dialog_rechazar_documento_dialog_component__WEBPACK_IMPORTED_MODULE_5__.RechazarDocumentoDialogComponent, {
      width: '500px',
      data: {
        documento: documento
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.rechazado) {
        console.log('Procesando rechazo:', result);
        this.procesarRechazoDocumento(documento, result);
      }
    });
  }
  procesarRechazoDocumento(documento, resultado) {
    console.log('Procesando rechazo de documento:', documento, resultado);
    this.validacionService.aprobarDocumento(documento.idDocumentByFile, 5,
    // 5 = Rechazado
    resultado.comentario || undefined).subscribe({
      next: response => {
        console.log('Documento rechazado exitosamente:', response);
        this.snackBar.open(`Documento ${documento.documento} rechazado exitosamente`, 'Cerrar', {
          duration: 3000
        });
        // Recargar documentos para mostrar el estado actualizado
        this.cargarDocumentosCliente(this.selectedCliente.idFile);
      },
      error: error => {
        console.error('Error rechazando documento:', error);
        this.snackBar.open(`Error al rechazar documento: ${error.message || 'Error desconocido'}`, 'Cerrar', {
          duration: 5000
        });
      }
    });
  }
  descargarArchivo() {
    console.log('Descargando archivo...');
    // Implementar lógica de descarga
  }

  cancelarProceso() {
    console.log('Cancelando proceso...');
    // Implementar lógica de cancelación
  }

  crearExcepcion() {
    console.log('Creando excepción...');
    // Implementar lógica de excepción
  }
  /**
   * Manejar cambio en la selección de agencia
   */
  onAgenciaChange() {
    console.log('🏢 ValidacionComponent - Agencia seleccionada:', this.selectedAgency);
    // Limpiar filtros y búsqueda cuando se cambia la agencia
    this.selectedFase = '';
    this.searchTerm = '';
    // Actualizar la agencia en el servicio compartido
    if (this.selectedAgency !== null) {
      this.defaultAgencyService.seleccionarAgencia(this.selectedAgency);
    }
    // Si ya hay un proceso seleccionado, cargar clientes
    if (this.selectedProcess) {
      this.cargarClientes();
    }
    // Limpiar selección de cliente y documentos
    this.clearSelection();
  }
  /**
   * Manejar cambio en la selección de proceso
   */
  onProcesoChange() {
    console.log('⚙️ ValidacionComponent - Proceso seleccionado:', this.selectedProcess);
    // Limpiar filtros y búsqueda cuando se cambia el proceso
    this.selectedFase = '';
    this.searchTerm = '';
    if (this.selectedProcess !== null) {
      this.cargarClientes();
    }
    // Limpiar selección de cliente y documentos
    this.clearSelection();
  }
  /**
   * Manejar cambio en la selección de fase
   */
  onFaseChange() {
    console.log('🔄 ValidacionComponent - Fase seleccionada:', this.selectedFase);
    console.log('🔄 ValidacionComponent - Tipo de fase seleccionada:', typeof this.selectedFase);
    console.log('🔄 ValidacionComponent - Clientes originales disponibles:', this.clientesOriginales.length);
    console.log('🔄 ValidacionComponent - Búsqueda activa:', this.searchTerm);
    // Si hay búsqueda activa, aplicar búsqueda (que incluye filtro de fase)
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      console.log('🔄 ValidacionComponent - Aplicando búsqueda con filtro de fase');
      this.aplicarBusqueda();
    } else {
      // Solo aplicar filtro de fase
      console.log('🔄 ValidacionComponent - Aplicando solo filtro de fase');
      this.aplicarFiltroFase();
    }
    // Si hay un cliente seleccionado, recargar sus documentos
    if (this.selectedCliente) {
      this.cargarDocumentosCliente(this.selectedCliente.idFile);
    }
  }
  /**
   * Aplicar filtro de fase a la tabla de clientes
   */
  aplicarFiltroFase() {
    console.log('🔍 ValidacionComponent - Aplicando filtro de fase:', this.selectedFase);
    console.log('🔍 ValidacionComponent - Clientes originales:', this.clientesOriginales.length);
    if (!this.selectedFase || this.selectedFase === '') {
      console.log('🔍 ValidacionComponent - Sin filtro de fase, restaurando todos los clientes');
      // Sin filtro, restaurar todos los clientes originales
      let clientesRestaurados = [...this.clientesOriginales];
      // Aplicar filtro de cancelados
      if (this.showCancelledOrders) {
        // Solo mostrar cancelados
        clientesRestaurados = clientesRestaurados.filter(cliente => String(cliente.IdCurrentState) === '5');
        console.log('🔍 ValidacionComponent - Mostrando solo cancelados (sin filtro de fase):', clientesRestaurados.length);
      } else {
        // Excluir cancelados
        clientesRestaurados = clientesRestaurados.filter(cliente => String(cliente.IdCurrentState) !== '5');
        console.log('🔍 ValidacionComponent - Excluyendo cancelados (sin filtro de fase):', clientesRestaurados.length);
      }
      this.allClientes = clientesRestaurados;
      this.totalRecords = this.allClientes.length;
      this.currentPage = 0;
      this.updatePaginatedData();
      // Seleccionar automáticamente el primer registro si hay clientes
      if (this.allClientes.length > 0) {
        this.seleccionarCliente(this.allClientes[0]);
      } else {
        this.selectedCliente = null;
      }
      return;
    }
    console.log('🔍 ValidacionComponent - Filtrando clientes por fase:', this.selectedFase);
    // Filtrar clientes por fase desde los datos originales usando ID
    const clientesFiltrados = this.clientesOriginales.filter(cliente => {
      console.log(`🔍 ValidacionComponent - Cliente ${cliente.idFile} - IdCurrentState: ${cliente.IdCurrentState} (tipo: ${typeof cliente.IdCurrentState})`);
      // Aplicar filtro de cancelados
      if (this.showCancelledOrders) {
        // Solo mostrar cancelados
        if (String(cliente.IdCurrentState) !== '5') {
          console.log(`🔍 ValidacionComponent - Excluyendo cliente no cancelado ${cliente.idFile} (toggle activado)`);
          return false;
        }
      } else {
        // Excluir cancelados
        if (String(cliente.IdCurrentState) === '5') {
          console.log(`🔍 ValidacionComponent - Excluyendo cliente cancelado ${cliente.idFile} (toggle desactivado)`);
          return false;
        }
      }
      let resultado = false;
      switch (this.selectedFase) {
        case '1':
          resultado = String(cliente.IdCurrentState) === '1'; // Integración
          console.log(`🔍 ValidacionComponent - Integración: ${cliente.IdCurrentState} === '1' = ${resultado}`);
          break;
        case '2':
          resultado = String(cliente.IdCurrentState) === '2'; // Liquidación
          console.log(`🔍 ValidacionComponent - Liquidación: ${cliente.IdCurrentState} === '2' = ${resultado}`);
          break;
        case '3':
          resultado = String(cliente.IdCurrentState) === '3'; // Liberación
          console.log(`🔍 ValidacionComponent - Liberación: ${cliente.IdCurrentState} === '3' = ${resultado}`);
          break;
        case '4':
          resultado = String(cliente.IdCurrentState) === '4'; // Liberado
          console.log(`🔍 ValidacionComponent - Liberado: ${cliente.IdCurrentState} === '4' = ${resultado}`);
          break;
        case '5':
          resultado = String(cliente.IdCurrentState) === '5'; // Cancelado
          console.log(`🔍 ValidacionComponent - Cancelado: ${cliente.IdCurrentState} === '5' = ${resultado}`);
          break;
        case '6':
          resultado = String(cliente.IdCurrentState) === '6'; // Liberado por Excepción
          console.log(`🔍 ValidacionComponent - Excepción: ${cliente.IdCurrentState} === '6' = ${resultado}`);
          break;
        default:
          resultado = true;
          console.log(`🔍 ValidacionComponent - Default: ${resultado}`);
          break;
      }
      return resultado;
    });
    console.log('📊 ValidacionComponent - Clientes filtrados:', clientesFiltrados.length, 'de', this.clientesOriginales.length);
    // Actualizar los datos filtrados y aplicar paginación
    this.allClientes = [...clientesFiltrados];
    this.totalRecords = clientesFiltrados.length;
    this.currentPage = 0; // Volver a la primera página
    this.updatePaginatedData(); // Aplicar paginación con el tamaño de página configurado
    // Seleccionar automáticamente el primer registro filtrado si hay resultados
    if (clientesFiltrados.length > 0) {
      this.seleccionarCliente(clientesFiltrados[0]);
    } else {
      this.selectedCliente = null;
    }
  }
  /**
   * Cargar clientes desde la API
   */
  cargarClientes() {
    if (this.selectedAgency === null || this.selectedProcess === null) {
      console.log('⚠️ ValidacionComponent - No se puede cargar clientes: agencia o proceso no seleccionado');
      return;
    }
    console.log('🔄 ValidacionComponent - Cargando clientes para agencia:', this.selectedAgency, 'proceso:', this.selectedProcess);
    this.loading = true;
    const filtros = {
      agencia: this.selectedAgency,
      proceso: this.selectedProcess,
      showCancelled: this.showCancelledOrders
    };
    this.validacionService.cargarClientes(filtros).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_12__.takeUntil)(this.destroy$), (0,rxjs__WEBPACK_IMPORTED_MODULE_13__.timeout)(10000), (0,rxjs__WEBPACK_IMPORTED_MODULE_16__.catchError)(error => {
      console.error('❌ ValidacionComponent - Error cargando clientes:', error);
      this.mostrarError('Error cargando clientes');
      this.clientesDataSource.data = [];
      this.loading = false;
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_17__.of)([]);
    })).subscribe({
      next: clientes => {
        console.log('✅ ValidacionComponent - Clientes cargados:', clientes);
        console.log('🔍 ValidacionComponent - Primer cliente (si existe):', clientes.length > 0 ? clientes[0] : 'No hay clientes');
        console.log('🔍 ValidacionComponent - Campos del primer cliente:', clientes.length > 0 ? Object.keys(clientes[0]) : 'No hay clientes');
        // Verificar específicamente el campo IdCurrentState
        if (clientes.length > 0) {
          console.log('🔍 ValidacionComponent - IdCurrentState del primer cliente:', clientes[0].IdCurrentState);
          console.log('🔍 ValidacionComponent - Tipo de IdCurrentState:', typeof clientes[0].IdCurrentState);
          // Mostrar todos los IdCurrentState únicos
          const estadosUnicos = [...new Set(clientes.map(c => c.IdCurrentState))];
          console.log('🔍 ValidacionComponent - Estados únicos encontrados:', estadosUnicos);
        }
        this.clientesOriginales = [...clientes]; // Guardar copia de respaldo
        this.allClientes = [...clientes]; // Guardar todos los clientes
        this.currentPage = 0; // Volver a la primera página
        // Aplicar filtro de fase si está seleccionado
        if (this.selectedFase && this.selectedFase !== '') {
          this.aplicarFiltroFase();
        } else {
          // Aplicar filtro de cancelados
          if (this.showCancelledOrders) {
            // Solo mostrar cancelados
            this.allClientes = this.allClientes.filter(cliente => String(cliente.IdCurrentState) === '5');
            console.log('🔍 ValidacionComponent - Mostrando solo cancelados:', this.allClientes.length);
          } else {
            // Excluir cancelados
            this.allClientes = this.allClientes.filter(cliente => String(cliente.IdCurrentState) !== '5');
            console.log('🔍 ValidacionComponent - Excluyendo cancelados:', this.allClientes.length);
          }
          this.updatePaginatedData(); // Aplicar paginación normal
        }
        // Seleccionar automáticamente el primer registro si hay clientes (usar datos filtrados)
        if (this.allClientes.length > 0) {
          this.seleccionarCliente(this.allClientes[0]);
        } else {
          this.selectedCliente = null;
        }
        this.loading = false;
      },
      error: error => {
        console.error('❌ ValidacionComponent - Error en subscribe de clientes:', error);
        this.clientesDataSource.data = [];
        this.loading = false;
      }
    });
  }
  /**
   * Mostrar mensaje de error
   */
  mostrarError(mensaje) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
  /**
   * Manejar cambio de página
   */
  onPageChange(event) {
    console.log('🔄 ValidacionComponent - Cambio de página:', event);
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    console.log('📊 ValidacionComponent - Nueva página:', this.currentPage, 'Tamaño:', this.pageSize);
    this.updatePaginatedData();
  }
  /**
   * Actualizar datos paginados
   */
  updatePaginatedData() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.clientesDataSource.data = this.allClientes.slice(startIndex, endIndex);
    this.totalRecords = this.allClientes.length;
    // Aplicar ordenamiento si está configurado
    if (this.sort) {
      this.clientesDataSource.sort = this.sort;
    }
  }
  /**
   * Cambiar tamaño de página
   */
  onPageSizeChange(event) {
    this.pageSize = event.value;
    this.currentPage = 0; // Volver a la primera página
    this.updatePaginatedData();
  }
  /**
   * Aplicar ordenamiento a los datos
   */
  aplicarOrdenamiento() {
    console.log('🔄 ValidacionComponent - Aplicando ordenamiento...');
    console.log('🔧 ValidacionComponent - MatSort disponible:', !!this.sort);
    console.log('🔧 ValidacionComponent - Total de clientes:', this.allClientes.length);
    if (!this.sort || !this.allClientes.length) {
      console.warn('⚠️ ValidacionComponent - No se puede aplicar ordenamiento:', {
        sort: !!this.sort,
        clientes: this.allClientes.length
      });
      return;
    }
    const direction = this.sort.direction;
    const active = this.sort.active;
    console.log('🔧 ValidacionComponent - Columna activa:', active);
    console.log('🔧 ValidacionComponent - Dirección:', direction);
    if (direction === '') {
      console.log('🔄 ValidacionComponent - Sin dirección, actualizando paginación');
      this.updatePaginatedData();
      return;
    }
    console.log('🔄 ValidacionComponent - Iniciando ordenamiento de', this.allClientes.length, 'registros');
    // Ordenar todos los datos
    this.allClientes.sort((a, b) => {
      let aValue = this.getSortValue(a, active);
      let bValue = this.getSortValue(b, active);
      if (aValue === null || aValue === undefined) aValue = '';
      if (bValue === null || bValue === undefined) bValue = '';
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    console.log('✅ ValidacionComponent - Ordenamiento completado');
    console.log('🔧 ValidacionComponent - Primer registro después del ordenamiento:', this.allClientes[0]);
    console.log('🔧 ValidacionComponent - Último registro después del ordenamiento:', this.allClientes[this.allClientes.length - 1]);
    // Actualizar datos paginados
    this.currentPage = 0;
    this.updatePaginatedData();
  }
  /**
   * Obtener valor para ordenamiento de una columna específica
   */
  getSortValue(item, column) {
    switch (column) {
      case 'ndCliente':
        return item.idFile;
      case 'ndPedido':
        return item.ndPedido;
      case 'cliente':
        return item.cliente;
      case 'proceso':
        return item.proceso;
      case 'operacion':
        return item.operacion;
      case 'fase':
        return item.fase;
      case 'registro':
        return new Date(item.registro);
      case 'fechaLiberacion':
        return new Date(item.fechaLiberacion);
      default:
        return item[column];
    }
  }
  /**
   * Método de prueba para verificar que el ordenamiento funciona
   */
  probarOrdenamiento() {
    console.log('🧪 ValidacionComponent - Probando ordenamiento...');
    console.log('🔧 ValidacionComponent - MatSort disponible:', !!this.sort);
    console.log('🔧 ValidacionComponent - Total de clientes:', this.allClientes.length);
    if (this.sort) {
      // Simular un evento de ordenamiento
      console.log('🧪 ValidacionComponent - Simulando ordenamiento por ND Cliente ascendente');
      // Opción 1: Intentar con el método sort
      try {
        this.sort.sort({
          id: 'ndCliente',
          start: 'asc',
          disableClear: false
        });
        console.log('✅ ValidacionComponent - Método sort() ejecutado');
      } catch (error) {
        console.error('❌ ValidacionComponent - Error en sort():', error);
      }
      // Opción 2: Llamar directamente al método de ordenamiento
      console.log('🧪 ValidacionComponent - Llamando directamente a aplicarOrdenamiento()');
      this.aplicarOrdenamiento();
    } else {
      console.error('❌ ValidacionComponent - MatSort no está disponible para la prueba');
    }
    // Mostrar información sobre la selección actual
    if (this.selectedCliente) {
      console.log('👤 ValidacionComponent - Cliente seleccionado:', this.selectedCliente);
      console.log('📄 ValidacionComponent - Documentos cargados:', this.documentosDataSource.length);
      console.log('🔍 ValidacionComponent - Filtros aplicados: File ID:', this.selectedCliente.idFile, 'Pedido ID:', this.selectedCliente.ndPedido);
    } else {
      console.log('ℹ️ ValidacionComponent - No hay cliente seleccionado');
    }
  }
  /**
   * Manejar cambio en el término de búsqueda
   */
  onSearchChange() {
    console.log('🔍 ValidacionComponent - Término de búsqueda:', this.searchTerm);
    this.aplicarBusqueda();
  }
  /**
   * Limpiar búsqueda
   */
  clearSearch() {
    console.log('🧹 ValidacionComponent - Limpiando búsqueda');
    this.searchTerm = '';
    this.aplicarBusqueda();
  }
  /**
   * Aplicar búsqueda a los datos
   */
  aplicarBusqueda() {
    console.log('🔍 ValidacionComponent - Aplicando búsqueda:', this.searchTerm);
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      // Sin búsqueda, aplicar solo filtro de fase si existe
      if (this.selectedFase && this.selectedFase !== '') {
        this.aplicarFiltroFase();
      } else {
        this.updatePaginatedData();
      }
      return;
    }
    const terminoBusqueda = this.searchTerm.toLowerCase().trim();
    console.log('🔍 ValidacionComponent - Término de búsqueda normalizado:', terminoBusqueda);
    // Filtrar clientes por término de búsqueda
    let clientesFiltrados = this.clientesOriginales.filter(cliente => {
      // Buscar en ID de archivo
      const idFile = String(cliente.idFile).toLowerCase();
      if (idFile.includes(terminoBusqueda)) {
        return true;
      }
      // Buscar en número de pedido
      const ndPedido = String(cliente.ndPedido).toLowerCase();
      if (ndPedido.includes(terminoBusqueda)) {
        return true;
      }
      // Buscar en nombre del cliente
      const nombreCliente = cliente.cliente.toLowerCase();
      if (nombreCliente.includes(terminoBusqueda)) {
        return true;
      }
      return false;
    });
    console.log('📊 ValidacionComponent - Clientes encontrados en búsqueda:', clientesFiltrados.length);
    // Si hay filtro de fase, aplicarlo también
    if (this.selectedFase && this.selectedFase !== '') {
      clientesFiltrados = clientesFiltrados.filter(cliente => {
        // Aplicar filtro de cancelados
        if (this.showCancelledOrders) {
          // Solo mostrar cancelados
          if (String(cliente.IdCurrentState) !== '5') {
            return false;
          }
        } else {
          // Excluir cancelados
          if (String(cliente.IdCurrentState) === '5') {
            return false;
          }
        }
        switch (this.selectedFase) {
          case '1':
            return String(cliente.IdCurrentState) === '1';
          // Integración
          case '2':
            return String(cliente.IdCurrentState) === '2';
          // Liquidación
          case '3':
            return String(cliente.IdCurrentState) === '3';
          // Liberación
          case '4':
            return String(cliente.IdCurrentState) === '4';
          // Liberado
          case '5':
            return String(cliente.IdCurrentState) === '5';
          // Cancelado
          case '6':
            return String(cliente.IdCurrentState) === '6';
          // Liberado por Excepción
          default:
            return true;
        }
      });
      console.log('📊 ValidacionComponent - Clientes después de filtro de fase:', clientesFiltrados.length);
    } else {
      // Si no hay filtro de fase, aplicar filtro de cancelados
      if (this.showCancelledOrders) {
        // Solo mostrar cancelados
        clientesFiltrados = clientesFiltrados.filter(cliente => String(cliente.IdCurrentState) === '5');
        console.log('📊 ValidacionComponent - Mostrando solo cancelados (sin filtro de fase):', clientesFiltrados.length);
      } else {
        // Excluir cancelados
        clientesFiltrados = clientesFiltrados.filter(cliente => String(cliente.IdCurrentState) !== '5');
        console.log('📊 ValidacionComponent - Excluyendo cancelados (sin filtro de fase):', clientesFiltrados.length);
      }
    }
    // Actualizar datos paginados con los resultados de búsqueda
    this.allClientes = [...clientesFiltrados];
    this.totalRecords = clientesFiltrados.length;
    this.currentPage = 0; // Volver a la primera página
    this.updatePaginatedData();
  }
  static #_ = this.ɵfac = function ValidacionComponent_Factory(t) {
    return new (t || ValidacionComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_validacion_service__WEBPACK_IMPORTED_MODULE_8__.ValidacionService), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_core_services_default_agency_service__WEBPACK_IMPORTED_MODULE_9__.DefaultAgencyService), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_18__.MatSnackBar), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_19__.MatDialog), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_core_services_auth_service__WEBPACK_IMPORTED_MODULE_10__.AuthService), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_20__.HttpClient));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdefineComponent"]({
    type: ValidacionComponent,
    selectors: [["vex-validacion"]],
    viewQuery: function ValidacionComponent_Query(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵviewQuery"](_angular_material_sort__WEBPACK_IMPORTED_MODULE_21__.MatSort, 5);
      }
      if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵloadQuery"]()) && (ctx.sort = _t.first);
      }
    },
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵStandaloneFeature"]],
    decls: 52,
    vars: 28,
    consts: [[1, "min-h-screen", "bg-gray-50", "p-2"], [1, "mb-2"], [1, "bg-white", "rounded-lg", "shadow-sm", "border", "mb-1", "filtro-container", 2, "padding", "20px !important", "min-height", "80px"], [1, "flex", "flex-wrap", "items-center", "justify-between", "gap-3", "filtro-grid"], ["appearance", "outline", 1, "min-w-0", "mr-2.5", "compact-field", 2, "width", "250px"], [3, "ngModel", "disabled", "ngModelChange", "selectionChange"], ["value", "", "disabled", "", 4, "ngIf"], [3, "value", 4, "ngFor", "ngForOf"], ["appearance", "outline", 1, "min-w-0", "mr-2.5", "compact-field", 2, "width", "206px"], [3, "ngModel", "ngModelChange", "selectionChange"], ["value", ""], ["appearance", "outline", 1, "flex-1", "min-w-0", "mr-2.5", "compact-field"], ["matInput", "", "placeholder", "Pedido, cliente o nombre", 1, "text-sm", 3, "ngModel", "ngModelChange", "input"], ["matSuffix", "", 1, "text-gray-400"], [1, "flex", "items-center", "justify-center", "gap-2"], ["mat-icon-button", "", "class", "text-gray-500 hover:text-red-600 !w-8 !h-8", "matTooltip", "Limpiar b\u00FAsqueda", 3, "click", 4, "ngIf"], [1, "flex", "items-center", "mr-3"], [1, "text-sm", 3, "ngModel", "ngModelChange", "change"], [1, "ml-2", "text-xs", "text-gray-600"], ["mat-icon-button", "", "matTooltip", "Recargar datos", 1, "text-gray-600", "hover:text-blue-600", "transition-colors", 3, "disabled", "click"], ["class", "text-xs text-gray-500 mt-1 px-1", 4, "ngIf"], [1, "p-2"], ["class", "flex justify-center items-center py-8", 4, "ngIf"], ["matSort", ""], ["mat-table", "", "class", "w-full compact-table", 3, "dataSource", 4, "ngIf"], ["showFirstLastButtons", "", "aria-label", "Seleccionar p\u00E1gina de clientes", 3, "length", "pageSize", "pageSizeOptions", "pageIndex", "page", "pageSizeChange"], [1, "mb-4"], ["class", "flex justify-center items-center py-8 text-gray-500", 4, "ngIf"], [4, "ngIf"], ["value", "", "disabled", ""], ["diameter", "16", 1, "inline", "mr-2"], [3, "value"], ["mat-icon-button", "", "matTooltip", "Limpiar b\u00FAsqueda", 1, "text-gray-500", "hover:text-red-600", "!w-8", "!h-8", 3, "click"], [1, "text-xs", "text-gray-500", "mt-1", "px-1"], [1, "flex", "justify-center", "items-center", "py-8"], ["diameter", "40"], ["mat-table", "", 1, "w-full", "compact-table", 3, "dataSource"], ["matColumnDef", "ndCliente"], ["mat-header-cell", "", "mat-sort-header", "ndCliente", "class", "w-40 py-2 bg-gray-50 text-xs font-medium text-gray-700 text-center", 4, "matHeaderCellDef"], ["mat-cell", "", "class", "py-2 text-xs font-medium text-gray-700 text-center", 4, "matCellDef"], ["matColumnDef", "ndPedido"], ["mat-header-cell", "", "mat-sort-header", "ndPedido", "class", "w-40 py-2 bg-gray-50 text-xs font-medium text-gray-700 text-center", 4, "matHeaderCellDef"], ["matColumnDef", "cliente"], ["mat-header-cell", "", "mat-sort-header", "cliente", "class", "min-w-0 flex-1 py-2 bg-gray-50 text-xs font-medium text-gray-700 text-center", 4, "matHeaderCellDef"], ["mat-cell", "", "class", "py-2 text-xs text-gray-700 text-center", 4, "matCellDef"], ["matColumnDef", "proceso"], ["mat-header-cell", "", "mat-sort-header", "proceso", "class", "w-40 py-2 bg-gray-50 text-xs font-medium text-gray-700 text-center", 4, "matHeaderCellDef"], ["matColumnDef", "operacion"], ["mat-header-cell", "", "mat-sort-header", "operacion", "class", "w-40 py-2 bg-gray-50 text-xs font-medium text-gray-700 text-center", 4, "matHeaderCellDef"], ["matColumnDef", "fase"], ["mat-header-cell", "", "mat-sort-header", "fase", "class", "w-48 py-2 bg-gray-50 text-xs font-medium text-gray-700 text-center", 4, "matHeaderCellDef"], ["mat-cell", "", "class", "py-2 text-center", 4, "matCellDef"], ["matColumnDef", "fechaLiberacion"], ["mat-header-cell", "", "mat-sort-header", "fechaLiberacion", "class", "w-48 py-2 bg-gray-50 text-xs font-medium text-gray-700 text-left", 4, "matHeaderCellDef"], ["mat-cell", "", "class", "py-2 text-xs text-gray-700 text-left", 4, "matCellDef"], ["matColumnDef", "registro"], ["mat-header-cell", "", "mat-sort-header", "registro", "class", "w-48 py-2 bg-gray-50 text-xs font-medium text-gray-700 text-left", 4, "matHeaderCellDef"], ["matColumnDef", "acciones"], ["mat-header-cell", "", "class", "w-24 py-2 bg-gray-50 text-xs font-medium text-gray-700 text-center", 4, "matHeaderCellDef"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", 3, "ngClass", "click", 4, "matRowDef", "matRowDefColumns"], ["mat-header-cell", "", "mat-sort-header", "ndCliente", 1, "w-40", "py-2", "bg-gray-50", "text-xs", "font-medium", "text-gray-700", "text-center"], ["mat-cell", "", 1, "py-2", "text-xs", "font-medium", "text-gray-700", "text-center"], [1, "flex", "items-center"], ["class", "text-yellow-500 mr-1", 4, "ngIf"], [1, "text-yellow-500", "mr-1"], ["mat-header-cell", "", "mat-sort-header", "ndPedido", 1, "w-40", "py-2", "bg-gray-50", "text-xs", "font-medium", "text-gray-700", "text-center"], ["mat-header-cell", "", "mat-sort-header", "cliente", 1, "min-w-0", "flex-1", "py-2", "bg-gray-50", "text-xs", "font-medium", "text-gray-700", "text-center"], ["mat-cell", "", 1, "py-2", "text-xs", "text-gray-700", "text-center"], ["matTooltipPosition", "above", 1, "block", "truncate", 3, "matTooltip"], ["mat-header-cell", "", "mat-sort-header", "proceso", 1, "w-40", "py-2", "bg-gray-50", "text-xs", "font-medium", "text-gray-700", "text-center"], ["mat-header-cell", "", "mat-sort-header", "operacion", 1, "w-40", "py-2", "bg-gray-50", "text-xs", "font-medium", "text-gray-700", "text-center"], ["mat-header-cell", "", "mat-sort-header", "fase", 1, "w-48", "py-2", "bg-gray-50", "text-xs", "font-medium", "text-gray-700", "text-center"], ["mat-cell", "", 1, "py-2", "text-center"], [1, "px-2", "py-1", "rounded-full", "text-xs", "font-medium", 3, "ngClass"], ["mat-header-cell", "", "mat-sort-header", "fechaLiberacion", 1, "w-48", "py-2", "bg-gray-50", "text-xs", "font-medium", "text-gray-700", "text-left"], ["mat-cell", "", 1, "py-2", "text-xs", "text-gray-700", "text-left"], ["mat-header-cell", "", "mat-sort-header", "registro", 1, "w-48", "py-2", "bg-gray-50", "text-xs", "font-medium", "text-gray-700", "text-left"], ["mat-header-cell", "", 1, "w-24", "py-2", "bg-gray-50", "text-xs", "font-medium", "text-gray-700", "text-center"], ["mat-icon-button", "", 1, "text-gray-600", "hover:text-blue-600", 3, "matMenuTriggerFor", "click"], [1, "text-sm"], ["actionsMenu", "matMenu"], ["mat-menu-item", "", 3, "click"], ["mat-menu-item", "", 3, "click", 4, "ngIf"], ["mat-menu-item", "", 3, "matMenuTriggerFor", 4, "ngIf"], ["adminSubMenu", "matMenu"], ["mat-menu-item", "", 3, "matMenuTriggerFor"], [1, "ml-auto"], ["mat-header-row", ""], ["mat-row", "", 3, "ngClass", "click"], [1, "flex", "justify-center", "items-center", "py-8", "text-gray-500"], [1, "text-center"], [1, "text-gray-400", "text-4xl", "mb-2"], [1, "mb-3", "px-2", "py-1", "bg-gray-50", "border-b", "text-sm", "text-gray-600"], ["mat-header-cell", "", "class", "w-32 py-2 bg-gray-50 text-xs font-medium text-gray-700 text-center", 4, "matHeaderCellDef"], ["matColumnDef", "documento"], ["mat-header-cell", "", "class", "min-w-0 flex-1 py-2 bg-gray-50 text-xs font-medium text-gray-700 text-center", 4, "matHeaderCellDef"], ["matColumnDef", "estatus"], ["mat-header-cell", "", "class", "w-20 py-2 bg-gray-50 text-xs font-medium text-gray-700 text-center", 4, "matHeaderCellDef"], ["matColumnDef", "ver"], ["mat-header-cell", "", "class", "w-16 py-2 bg-gray-50 text-xs font-medium text-gray-700 text-center", 4, "matHeaderCellDef"], ["matColumnDef", "validar"], ["matColumnDef", "rechazar"], ["matColumnDef", "eliminar"], ["matColumnDef", "requerido"], ["matColumnDef", "requiereExpiracion"], ["mat-header-cell", "", "class", "w-28 py-2 bg-gray-50 text-xs font-medium text-gray-700 text-center", 4, "matHeaderCellDef"], ["matColumnDef", "fecha"], ["mat-header-cell", "", "class", "w-34 py-2 bg-gray-50 text-xs font-medium text-gray-700 text-center", 4, "matHeaderCellDef"], ["matColumnDef", "fechaExpiracion"], ["matColumnDef", "comentario"], ["mat-header-cell", "", "class", "w-51 py-2 bg-gray-50 text-xs font-medium text-gray-700 text-center", 4, "matHeaderCellDef"], ["matColumnDef", "asignado"], ["mat-header-cell", "", "class", "w-45 py-2 bg-gray-50 text-xs font-medium text-gray-700 text-center", 4, "matHeaderCellDef"], ["mat-row", "", "class", "!min-h-0 !h-10", 4, "matRowDef", "matRowDefColumns"], ["mat-header-cell", "", 1, "w-32", "py-2", "bg-gray-50", "text-xs", "font-medium", "text-gray-700", "text-center"], ["mat-header-cell", "", 1, "min-w-0", "flex-1", "py-2", "bg-gray-50", "text-xs", "font-medium", "text-gray-700", "text-center"], ["mat-header-cell", "", 1, "w-20", "py-2", "bg-gray-50", "text-xs", "font-medium", "text-gray-700", "text-center"], ["class", "flex items-center justify-center mx-auto cursor-help", "matTooltip", "Documento pendiente de validaci\u00F3n", "matTooltipPosition", "above", 4, "ngIf"], ["class", "flex items-center justify-center mx-auto cursor-help", "matTooltip", "Documento validado y aprobado", "matTooltipPosition", "above", 4, "ngIf"], ["class", "flex items-center justify-center mx-auto cursor-help", "matTooltip", "Documento rechazado", "matTooltipPosition", "above", 4, "ngIf"], ["class", "flex items-center justify-center mx-auto cursor-help", "matTooltip", "Documento en proceso de revisi\u00F3n", "matTooltipPosition", "above", 4, "ngIf"], ["matTooltip", "Documento pendiente de validaci\u00F3n", "matTooltipPosition", "above", 1, "flex", "items-center", "justify-center", "mx-auto", "cursor-help"], [1, "text-orange-500", 2, "font-size", "20px", "width", "20px", "height", "20px"], ["matTooltip", "Documento validado y aprobado", "matTooltipPosition", "above", 1, "flex", "items-center", "justify-center", "mx-auto", "cursor-help"], [1, "text-green-500", 2, "font-size", "20px", "width", "20px", "height", "20px"], ["matTooltip", "Documento rechazado", "matTooltipPosition", "above", 1, "flex", "items-center", "justify-center", "mx-auto", "cursor-help"], [1, "text-red-500", 2, "font-size", "20px", "width", "20px", "height", "20px"], ["matTooltip", "Documento en proceso de revisi\u00F3n", "matTooltipPosition", "above", 1, "flex", "items-center", "justify-center", "mx-auto", "cursor-help"], [1, "text-blue-500", 2, "font-size", "20px", "width", "20px", "height", "20px"], ["mat-header-cell", "", 1, "w-16", "py-2", "bg-gray-50", "text-xs", "font-medium", "text-gray-700", "text-center"], ["mat-icon-button", "", "color", "primary", "class", "!w-6 !h-6 !min-h-6 !p-0", "matTooltip", "Ver documento", 3, "click", 4, "ngIf"], ["class", "text-xs text-gray-400", 4, "ngIf"], ["mat-icon-button", "", "color", "primary", "matTooltip", "Ver documento", 1, "!w-6", "!h-6", "!min-h-6", "!p-0", 3, "click"], [1, "!text-sm"], [1, "text-xs", "text-gray-400"], ["class", "relative", 4, "ngIf"], [1, "relative"], ["mat-icon-button", "", "matTooltip", "Validar documento", 1, "!w-6", "!h-6", "!min-h-6", "!p-0", "text-gray-400", 3, "click"], ["class", "absolute -top-1 -right-1 text-green-600 text-sm", 4, "ngIf"], [1, "absolute", "-top-1", "-right-1", "text-green-600", "text-sm"], ["mat-icon-button", "", "color", "warn", "class", "!w-6 !h-6 !min-h-6 !p-0", "matTooltip", "Rechazar documento", 3, "click", 4, "ngIf"], ["mat-icon-button", "", "color", "warn", "matTooltip", "Rechazar documento", 1, "!w-6", "!h-6", "!min-h-6", "!p-0", 3, "click"], ["mat-icon-button", "", "color", "warn", "class", "!w-6 !h-6 !min-h-6 !p-0", 4, "ngIf"], ["mat-icon-button", "", "color", "warn", 1, "!w-6", "!h-6", "!min-h-6", "!p-0"], [1, "text-xs", "font-medium", 3, "ngClass"], ["mat-header-cell", "", 1, "w-28", "py-2", "bg-gray-50", "text-xs", "font-medium", "text-gray-700", "text-center"], [1, "px-2", "py-1", "rounded-full", "text-xs", "font-medium"], ["mat-header-cell", "", 1, "w-34", "py-2", "bg-gray-50", "text-xs", "font-medium", "text-gray-700", "text-center"], ["matTooltipPosition", "above", 1, "truncate", "block", 3, "matTooltip"], ["class", "text-blue-600 font-medium truncate block", "matTooltipPosition", "above", 3, "matTooltip", 4, "ngIf", "ngIfElse"], ["noFechaExpiracion", ""], ["matTooltipPosition", "above", 1, "text-blue-600", "font-medium", "truncate", "block", 3, "matTooltip"], [1, "text-gray-400"], ["mat-header-cell", "", 1, "w-51", "py-2", "bg-gray-50", "text-xs", "font-medium", "text-gray-700", "text-center"], ["mat-header-cell", "", 1, "w-45", "py-2", "bg-gray-50", "text-xs", "font-medium", "text-gray-700", "text-center"], ["mat-row", "", 1, "!min-h-0", "!h-10"]],
    template: function ValidacionComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](2, "div", 2)(3, "div", 3)(4, "mat-form-field", 4)(5, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](6, "Agencia");
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](7, "mat-select", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("ngModelChange", function ValidacionComponent_Template_mat_select_ngModelChange_7_listener($event) {
          return ctx.selectedAgency = $event;
        })("selectionChange", function ValidacionComponent_Template_mat_select_selectionChange_7_listener() {
          return ctx.onAgenciaChange();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](8, ValidacionComponent_mat_option_8_Template, 3, 0, "mat-option", 6)(9, ValidacionComponent_mat_option_9_Template, 2, 0, "mat-option", 6)(10, ValidacionComponent_mat_option_10_Template, 2, 2, "mat-option", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](11, "mat-form-field", 8)(12, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](13, "Proceso");
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](14, "mat-select", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("ngModelChange", function ValidacionComponent_Template_mat_select_ngModelChange_14_listener($event) {
          return ctx.selectedProcess = $event;
        })("selectionChange", function ValidacionComponent_Template_mat_select_selectionChange_14_listener() {
          return ctx.onProcesoChange();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](15, ValidacionComponent_mat_option_15_Template, 3, 0, "mat-option", 6)(16, ValidacionComponent_mat_option_16_Template, 2, 0, "mat-option", 6)(17, ValidacionComponent_mat_option_17_Template, 2, 2, "mat-option", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](18, "mat-form-field", 8)(19, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](20, "Fase");
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](21, "mat-select", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("ngModelChange", function ValidacionComponent_Template_mat_select_ngModelChange_21_listener($event) {
          return ctx.selectedFase = $event;
        })("selectionChange", function ValidacionComponent_Template_mat_select_selectionChange_21_listener() {
          return ctx.onFaseChange();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](22, "mat-option", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](23, "Todas las fases");
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](24, ValidacionComponent_mat_option_24_Template, 2, 2, "mat-option", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](25, "mat-form-field", 11)(26, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](27, "Buscar");
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](28, "input", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("ngModelChange", function ValidacionComponent_Template_input_ngModelChange_28_listener($event) {
          return ctx.searchTerm = $event;
        })("input", function ValidacionComponent_Template_input_input_28_listener() {
          return ctx.onSearchChange();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](29, "mat-icon", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](30, "search");
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](31, "div", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](32, ValidacionComponent_button_32_Template, 3, 0, "button", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](33, "div", 16)(34, "mat-slide-toggle", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("ngModelChange", function ValidacionComponent_Template_mat_slide_toggle_ngModelChange_34_listener($event) {
          return ctx.showCancelledOrders = $event;
        })("change", function ValidacionComponent_Template_mat_slide_toggle_change_34_listener() {
          return ctx.onToggleCancelledOrders();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](35, "span", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](36, "Mostrar cancelados");
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](37, "button", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function ValidacionComponent_Template_button_click_37_listener() {
          return ctx.recargarDatos();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](38, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](39, "refresh");
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](40, ValidacionComponent_div_40_Template, 2, 2, "div", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](41, "mat-card", 1)(42, "div", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](43, ValidacionComponent_div_43_Template, 2, 0, "div", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](44, "div", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](45, ValidacionComponent_table_45_Template, 30, 3, "table", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](46, "mat-paginator", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("page", function ValidacionComponent_Template_mat_paginator_page_46_listener($event) {
          return ctx.onPageChange($event);
        })("pageSizeChange", function ValidacionComponent_Template_mat_paginator_pageSizeChange_46_listener($event) {
          return ctx.onPageSizeChange($event);
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](47, "mat-card", 26)(48, "div", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](49, ValidacionComponent_div_49_Template, 6, 0, "div", 27)(50, ValidacionComponent_div_50_Template, 2, 0, "div", 22)(51, ValidacionComponent_div_51_Template, 5, 5, "div", 28);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngModel", ctx.selectedAgency)("disabled", ctx.loadingAgencias || ctx.agencias.length === 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx.loadingAgencias);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", !ctx.loadingAgencias && ctx.agencias.length === 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngForOf", ctx.agencias);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngModel", ctx.selectedProcess)("disabled", ctx.loadingProcesos || ctx.procesos.length === 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx.loadingProcesos);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", !ctx.loadingProcesos && ctx.procesos.length === 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngForOf", ctx.procesos);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngModel", ctx.selectedFase);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngForOf", ctx.fases);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngModel", ctx.searchTerm);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx.searchTerm);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngModel", ctx.showCancelledOrders);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("disabled", ctx.loading || ctx.loadingAgencias || ctx.loadingProcesos);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵclassProp"]("animate-spin", ctx.loading || ctx.loadingAgencias || ctx.loadingProcesos);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx.searchTerm);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", !ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("length", ctx.totalRecords)("pageSize", ctx.pageSize)("pageSizeOptions", ctx.pageSizeOptions)("pageIndex", ctx.currentPage);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", !ctx.selectedCliente);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx.loading && ctx.selectedCliente);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx.selectedCliente && !ctx.loading);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_22__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_22__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_22__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_22__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_22__.DatePipe, _angular_forms__WEBPACK_IMPORTED_MODULE_23__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_23__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_23__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_23__.NgModel, _angular_forms__WEBPACK_IMPORTED_MODULE_23__.ReactiveFormsModule, _angular_material_card__WEBPACK_IMPORTED_MODULE_24__.MatCardModule, _angular_material_card__WEBPACK_IMPORTED_MODULE_24__.MatCard, _angular_material_button__WEBPACK_IMPORTED_MODULE_25__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_25__.MatIconButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_26__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_26__.MatIcon, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_27__.MatProgressSpinnerModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_27__.MatProgressSpinner, _angular_material_table__WEBPACK_IMPORTED_MODULE_15__.MatTableModule, _angular_material_table__WEBPACK_IMPORTED_MODULE_15__.MatTable, _angular_material_table__WEBPACK_IMPORTED_MODULE_15__.MatHeaderCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_15__.MatHeaderRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_15__.MatColumnDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_15__.MatCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_15__.MatRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_15__.MatHeaderCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_15__.MatCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_15__.MatHeaderRow, _angular_material_table__WEBPACK_IMPORTED_MODULE_15__.MatRow, _angular_material_paginator__WEBPACK_IMPORTED_MODULE_28__.MatPaginatorModule, _angular_material_paginator__WEBPACK_IMPORTED_MODULE_28__.MatPaginator, _angular_material_sort__WEBPACK_IMPORTED_MODULE_21__.MatSortModule, _angular_material_sort__WEBPACK_IMPORTED_MODULE_21__.MatSort, _angular_material_sort__WEBPACK_IMPORTED_MODULE_21__.MatSortHeader, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_29__.MatFormFieldModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_29__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_29__.MatLabel, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_29__.MatSuffix, _angular_material_input__WEBPACK_IMPORTED_MODULE_30__.MatInputModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_30__.MatInput, _angular_material_select__WEBPACK_IMPORTED_MODULE_31__.MatSelectModule, _angular_material_select__WEBPACK_IMPORTED_MODULE_31__.MatSelect, _angular_material_core__WEBPACK_IMPORTED_MODULE_32__.MatOption, _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_18__.MatSnackBarModule, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_19__.MatDialogModule, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_33__.MatTooltipModule, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_33__.MatTooltip, _angular_material_chips__WEBPACK_IMPORTED_MODULE_34__.MatChipsModule, _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_35__.MatCheckboxModule, _angular_material_menu__WEBPACK_IMPORTED_MODULE_36__.MatMenuModule, _angular_material_menu__WEBPACK_IMPORTED_MODULE_36__.MatMenu, _angular_material_menu__WEBPACK_IMPORTED_MODULE_36__.MatMenuItem, _angular_material_menu__WEBPACK_IMPORTED_MODULE_36__.MatMenuTrigger, _angular_material_slide_toggle__WEBPACK_IMPORTED_MODULE_37__.MatSlideToggleModule, _angular_material_slide_toggle__WEBPACK_IMPORTED_MODULE_37__.MatSlideToggle, _angular_cdk_scrolling__WEBPACK_IMPORTED_MODULE_38__.ScrollingModule],
    styles: [".space-y-6[_ngcontent-%COMP%]    > [_ngcontent-%COMP%]:not([hidden])    ~ [_ngcontent-%COMP%]:not([hidden]) {\n  margin-top: 1.5rem;\n}\n\n.space-y-6[_ngcontent-%COMP%]    > [_ngcontent-%COMP%]:first-child {\n  margin-top: 0;\n}\n\n.mat-mdc-icon-button[_ngcontent-%COMP%] {\n  transition: all 0.2s ease-in-out;\n}\n.mat-mdc-icon-button[_ngcontent-%COMP%]:hover {\n  transform: scale(1.1);\n}\n\n.mat-mdc-card[_ngcontent-%COMP%] {\n  transition: all 0.2s ease-in-out;\n}\n.mat-mdc-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);\n}\n\n.estado-chip[_ngcontent-%COMP%] {\n  transition: all 0.2s ease-in-out;\n}\n.estado-chip[_ngcontent-%COMP%]:hover {\n  transform: scale(1.05);\n}\n\n.py-2[_ngcontent-%COMP%] {\n  padding-top: 0px !important;\n  padding-bottom: 0px !important;\n}\n\n.text-xs[_ngcontent-%COMP%] {\n  font-size: 12px !important;\n  line-height: 1 !important;\n}\n\n[_nghost-%COMP%]     mat-table .mat-mdc-table {\n  border-collapse: separate !important;\n  border-spacing: 0 !important;\n  width: 100% !important;\n}\n[_nghost-%COMP%]     mat-table .mat-mdc-row {\n  min-height: 8px !important;\n  height: 8px !important;\n  max-height: 8px !important;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;\n  display: table-row !important;\n}\n[_nghost-%COMP%]     mat-table .mat-mdc-header-row {\n  min-height: 8px !important;\n  height: 8px !important;\n  max-height: 8px !important;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;\n  display: table-row !important;\n}\n[_nghost-%COMP%]     mat-table .mat-mdc-cell {\n  padding: 0px !important;\n  vertical-align: middle !important;\n  line-height: 1 !important;\n  font-size: 12px !important;\n  border: none !important;\n  height: 8px !important;\n  max-height: 8px !important;\n  overflow: hidden !important;\n  white-space: nowrap !important;\n  text-overflow: ellipsis !important;\n  text-align: left !important;\n}\n[_nghost-%COMP%]     mat-table .mat-mdc-header-cell {\n  padding: 0px !important;\n  vertical-align: middle !important;\n  line-height: 1 !important;\n  font-size: 12px !important;\n  font-weight: 500 !important;\n  border: none !important;\n  height: 8px !important;\n  max-height: 8px !important;\n  overflow: hidden !important;\n  white-space: nowrap !important;\n  text-overflow: ellipsis !important;\n  text-align: left !important;\n}\n[_nghost-%COMP%]     mat-table .mat-mdc-cell, [_nghost-%COMP%]     mat-table .mat-mdc-header-cell {\n  margin: 0 !important;\n  border-spacing: 0 !important;\n}\n[_nghost-%COMP%]     .mat-mdc-table-container {\n  overflow: hidden !important;\n}\n[_nghost-%COMP%]     .mat-mdc-table-wrapper {\n  overflow: hidden !important;\n}\n[_nghost-%COMP%]     .mat-mdc-cell div, [_nghost-%COMP%]     .mat-mdc-cell span, [_nghost-%COMP%]     .mat-mdc-header-cell div, [_nghost-%COMP%]     .mat-mdc-header-cell span {\n  line-height: 1 !important;\n  margin: 0 !important;\n  padding: 0 !important;\n  font-size: 12px !important;\n}\n\n[_nghost-%COMP%]     .mat-mdc-row, [_nghost-%COMP%]     .mat-mdc-header-row {\n  height: 8px !important;\n  min-height: 8px !important;\n  max-height: 8px !important;\n}\n[_nghost-%COMP%]     .mat-mdc-cell, [_nghost-%COMP%]     .mat-mdc-header-cell {\n  height: 8px !important;\n  min-height: 8px !important;\n  max-height: 8px !important;\n  padding: 0px !important;\n  margin: 0px !important;\n  text-align: left !important;\n}\n[_nghost-%COMP%]     .mat-mdc-cell *, [_nghost-%COMP%]     .mat-mdc-header-cell * {\n  height: auto !important;\n  min-height: auto !important;\n  max-height: auto !important;\n  line-height: 1 !important;\n  margin: 0px !important;\n  padding: 0px !important;\n}\n[_nghost-%COMP%]     .mat-mdc-cell:nth-child(4), [_nghost-%COMP%]     .mat-mdc-cell:nth-child(5), [_nghost-%COMP%]     .mat-mdc-cell:nth-child(6), [_nghost-%COMP%]     .mat-mdc-cell:nth-child(7), [_nghost-%COMP%]     .mat-mdc-cell:nth-child(8), [_nghost-%COMP%]     .mat-mdc-cell:nth-child(9), [_nghost-%COMP%]     .mat-mdc-header-cell:nth-child(4), [_nghost-%COMP%]     .mat-mdc-header-cell:nth-child(5), [_nghost-%COMP%]     .mat-mdc-header-cell:nth-child(6), [_nghost-%COMP%]     .mat-mdc-header-cell:nth-child(7), [_nghost-%COMP%]     .mat-mdc-header-cell:nth-child(8), [_nghost-%COMP%]     .mat-mdc-header-cell:nth-child(9) {\n  text-align: center !important;\n}\n\n[_nghost-%COMP%]     .mat-mdc-cell:nth-child(4), [_nghost-%COMP%]     .mat-mdc-cell:nth-child(5), [_nghost-%COMP%]     .mat-mdc-cell:nth-child(6), [_nghost-%COMP%]     .mat-mdc-cell:nth-child(7), [_nghost-%COMP%]     .mat-mdc-cell:nth-child(8), [_nghost-%COMP%]     .mat-mdc-header-cell:nth-child(4), [_nghost-%COMP%]     .mat-mdc-header-cell:nth-child(5), [_nghost-%COMP%]     .mat-mdc-header-cell:nth-child(6), [_nghost-%COMP%]     .mat-mdc-header-cell:nth-child(7), [_nghost-%COMP%]     .mat-mdc-header-cell:nth-child(8) {\n  text-align: left !important;\n}\n[_nghost-%COMP%]     .mat-sort-header-arrow {\n  opacity: 1 !important;\n  visibility: visible !important;\n  display: inline-block !important;\n}\n[_nghost-%COMP%]     .mat-sort-header-stem {\n  opacity: 1 !important;\n  visibility: visible !important;\n}\n[_nghost-%COMP%]     .mat-sort-header-indicator {\n  opacity: 1 !important;\n  visibility: visible !important;\n}\n[_nghost-%COMP%]     .mat-sort-header-button {\n  display: flex !important;\n  align-items: center !important;\n  justify-content: center !important;\n}\n\n  .mat-mdc-paginator {\n  min-height: 48px !important;\n  height: 48px !important;\n  margin-top: 0 !important;\n  padding: 0 8px !important;\n}\n  .mat-mdc-paginator .mat-mdc-paginator-container {\n  min-height: 48px !important;\n  height: 48px !important;\n}\n  .mat-mdc-paginator .mat-mdc-paginator-page-size {\n  min-height: 48px !important;\n  height: 48px !important;\n}\n  .mat-mdc-paginator .mat-mdc-paginator-range-label {\n  min-height: 48px !important;\n  height: 48px !important;\n  line-height: 48px !important;\n}\n  .mat-mdc-paginator .mat-mdc-paginator-navigation-previous,   .mat-mdc-paginator .mat-mdc-paginator-navigation-next {\n  min-height: 48px !important;\n  height: 48px !important;\n}\n\n.compact-table[_ngcontent-%COMP%]   .mat-mdc-row[_ngcontent-%COMP%] {\n  min-height: 32px !important;\n  height: 32px !important;\n  max-height: 32px !important;\n}\n.compact-table[_ngcontent-%COMP%]   .mat-mdc-header-row[_ngcontent-%COMP%] {\n  min-height: 32px !important;\n  height: 32px !important;\n  max-height: 32px !important;\n}\n.compact-table[_ngcontent-%COMP%]   .mat-mdc-cell[_ngcontent-%COMP%] {\n  padding: 4px 8px !important;\n  vertical-align: middle !important;\n  line-height: 1.2 !important;\n}\n.compact-table[_ngcontent-%COMP%]   .mat-mdc-header-cell[_ngcontent-%COMP%] {\n  padding: 4px 8px !important;\n  vertical-align: middle !important;\n  line-height: 1.2 !important;\n}\n.compact-table[_ngcontent-%COMP%]   .mat-mdc-cell[_ngcontent-%COMP%], .compact-table[_ngcontent-%COMP%]   .mat-mdc-header-cell[_ngcontent-%COMP%] {\n  overflow: hidden !important;\n  white-space: nowrap !important;\n}\n@media (min-width: 1440px) {\n  .compact-table[_ngcontent-%COMP%]   .mat-mdc-row[_ngcontent-%COMP%] {\n    min-height: 32px !important;\n    height: 32px !important;\n    max-height: 32px !important;\n  }\n  .compact-table[_ngcontent-%COMP%]   .mat-mdc-header-row[_ngcontent-%COMP%] {\n    min-height: 32px !important;\n    height: 32px !important;\n    max-height: 32px !important;\n  }\n  .compact-table[_ngcontent-%COMP%]   .mat-mdc-cell[_ngcontent-%COMP%] {\n    padding: 4px 8px !important;\n    vertical-align: middle !important;\n    line-height: 1.2 !important;\n  }\n  .compact-table[_ngcontent-%COMP%]   .mat-mdc-header-cell[_ngcontent-%COMP%] {\n    padding: 4px 8px !important;\n    vertical-align: middle !important;\n    line-height: 1.2 !important;\n  }\n}\n\n.filtro-container[_ngcontent-%COMP%] {\n  padding: 20px !important;\n  min-height: 80px !important;\n  box-sizing: border-box !important;\n}\n.filtro-container[_ngcontent-%COMP%]   .compact-field[_ngcontent-%COMP%]   .mat-mdc-form-field-infix[_ngcontent-%COMP%] {\n  min-height: 44px !important;\n  padding: 8px 0 !important;\n}\n.filtro-container[_ngcontent-%COMP%]   .compact-field[_ngcontent-%COMP%]   .mat-mdc-form-field-subscript-wrapper[_ngcontent-%COMP%] {\n  margin-top: 2px !important;\n  min-height: 0 !important;\n  display: none !important;\n}\n.filtro-container[_ngcontent-%COMP%]   .compact-field[_ngcontent-%COMP%]   .mat-mdc-text-field-wrapper[_ngcontent-%COMP%] {\n  padding: 0 8px !important;\n}\n.filtro-container[_ngcontent-%COMP%]   .compact-field[_ngcontent-%COMP%]   .mat-mdc-form-field-flex[_ngcontent-%COMP%] {\n  align-items: center !important;\n}\n@media (min-width: 1024px) {\n  .filtro-container[_ngcontent-%COMP%]   .compact-field[_ngcontent-%COMP%]   .mat-mdc-form-field-infix[_ngcontent-%COMP%] {\n    min-height: 40px !important;\n    padding: 6px 0 !important;\n  }\n  .filtro-container[_ngcontent-%COMP%]   .compact-field[_ngcontent-%COMP%]   .mat-mdc-form-field-subscript-wrapper[_ngcontent-%COMP%] {\n    margin-top: 1px !important;\n    display: none !important;\n  }\n  .filtro-container[_ngcontent-%COMP%]   .compact-field[_ngcontent-%COMP%]   .mat-mdc-text-field-wrapper[_ngcontent-%COMP%] {\n    padding: 0 6px !important;\n  }\n}\n@media (min-width: 1440px) {\n  .filtro-container[_ngcontent-%COMP%]   .compact-field[_ngcontent-%COMP%]   .mat-mdc-form-field-infix[_ngcontent-%COMP%] {\n    min-height: 36px !important;\n    padding: 4px 0 !important;\n  }\n  .filtro-container[_ngcontent-%COMP%]   .compact-field[_ngcontent-%COMP%]   .mat-mdc-form-field-subscript-wrapper[_ngcontent-%COMP%] {\n    margin-top: 0px !important;\n    display: none !important;\n  }\n  .filtro-container[_ngcontent-%COMP%]   .compact-field[_ngcontent-%COMP%]   .mat-mdc-text-field-wrapper[_ngcontent-%COMP%] {\n    padding: 0 4px !important;\n  }\n}\n.filtro-container[_ngcontent-%COMP%]   .mat-mdc-icon-button[_ngcontent-%COMP%] {\n  width: 36px !important;\n  height: 36px !important;\n  line-height: 36px !important;\n}\n@media (min-width: 1024px) {\n  .filtro-container[_ngcontent-%COMP%]   .mat-mdc-icon-button[_ngcontent-%COMP%] {\n    width: 32px !important;\n    height: 32px !important;\n    line-height: 32px !important;\n  }\n}\n@media (min-width: 1440px) {\n  .filtro-container[_ngcontent-%COMP%]   .mat-mdc-icon-button[_ngcontent-%COMP%] {\n    width: 28px !important;\n    height: 28px !important;\n    line-height: 28px !important;\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvbWVzYS1jb250cm9sL3ZhbGlkYWNpb24vdmFsaWRhY2lvbi5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtFQUNFLGtCQUFBO0FBQUY7O0FBR0E7RUFDRSxhQUFBO0FBQUY7O0FBSUE7RUFDRSxnQ0FBQTtBQURGO0FBR0U7RUFDRSxxQkFBQTtBQURKOztBQU1BO0VBQ0UsZ0NBQUE7QUFIRjtBQUtFO0VBQ0UsMkJBQUE7RUFDQSxxRkFBQTtBQUhKOztBQVFBO0VBQ0UsZ0NBQUE7QUFMRjtBQU9FO0VBQ0Usc0JBQUE7QUFMSjs7QUFVQTtFQUNFLDJCQUFBO0VBQ0EsOEJBQUE7QUFQRjs7QUFVQTtFQUNFLDBCQUFBO0VBQ0EseUJBQUE7QUFQRjs7QUFjSTtFQUNFLG9DQUFBO0VBQ0EsNEJBQUE7RUFDQSxzQkFBQTtBQVhOO0FBZUk7RUFDRSwwQkFBQTtFQUNBLHNCQUFBO0VBQ0EsMEJBQUE7RUFDQSx1REFBQTtFQUNBLDZCQUFBO0FBYk47QUFnQkk7RUFDRSwwQkFBQTtFQUNBLHNCQUFBO0VBQ0EsMEJBQUE7RUFDQSx1REFBQTtFQUNBLDZCQUFBO0FBZE47QUFrQkk7RUFDRSx1QkFBQTtFQUNBLGlDQUFBO0VBQ0EseUJBQUE7RUFDQSwwQkFBQTtFQUNBLHVCQUFBO0VBQ0Esc0JBQUE7RUFDQSwwQkFBQTtFQUNBLDJCQUFBO0VBQ0EsOEJBQUE7RUFDQSxrQ0FBQTtFQUNBLDJCQUFBO0FBaEJOO0FBbUJJO0VBQ0UsdUJBQUE7RUFDQSxpQ0FBQTtFQUNBLHlCQUFBO0VBQ0EsMEJBQUE7RUFDQSwyQkFBQTtFQUNBLHVCQUFBO0VBQ0Esc0JBQUE7RUFDQSwwQkFBQTtFQUNBLDJCQUFBO0VBQ0EsOEJBQUE7RUFDQSxrQ0FBQTtFQUNBLDJCQUFBO0FBakJOO0FBcUJJO0VBQ0Usb0JBQUE7RUFDQSw0QkFBQTtBQW5CTjtBQXdCRTtFQUNFLDJCQUFBO0FBdEJKO0FBeUJFO0VBQ0UsMkJBQUE7QUF2Qko7QUEyQkU7Ozs7RUFJRSx5QkFBQTtFQUNBLG9CQUFBO0VBQ0EscUJBQUE7RUFDQSwwQkFBQTtBQXpCSjs7QUFnQ0U7O0VBRUUsc0JBQUE7RUFDQSwwQkFBQTtFQUNBLDBCQUFBO0FBN0JKO0FBaUNFOztFQUVFLHNCQUFBO0VBQ0EsMEJBQUE7RUFDQSwwQkFBQTtFQUNBLHVCQUFBO0VBQ0Esc0JBQUE7RUFDQSwyQkFBQTtBQS9CSjtBQW1DRTs7RUFFRSx1QkFBQTtFQUNBLDJCQUFBO0VBQ0EsMkJBQUE7RUFDQSx5QkFBQTtFQUNBLHNCQUFBO0VBQ0EsdUJBQUE7QUFqQ0o7QUFxQ0U7Ozs7Ozs7Ozs7OztFQVlFLDZCQUFBO0FBbkNKOztBQTBDRTs7Ozs7Ozs7OztFQVVFLDJCQUFBO0FBdkNKO0FBMkNFO0VBQ0UscUJBQUE7RUFDQSw4QkFBQTtFQUNBLGdDQUFBO0FBekNKO0FBNENFO0VBQ0UscUJBQUE7RUFDQSw4QkFBQTtBQTFDSjtBQTZDRTtFQUNFLHFCQUFBO0VBQ0EsOEJBQUE7QUEzQ0o7QUErQ0U7RUFDRSx3QkFBQTtFQUNBLDhCQUFBO0VBQ0Esa0NBQUE7QUE3Q0o7O0FBa0RBO0VBQ0UsMkJBQUE7RUFDQSx1QkFBQTtFQUNBLHdCQUFBO0VBQ0EseUJBQUE7QUEvQ0Y7QUFpREU7RUFDRSwyQkFBQTtFQUNBLHVCQUFBO0FBL0NKO0FBa0RFO0VBQ0UsMkJBQUE7RUFDQSx1QkFBQTtBQWhESjtBQW1ERTtFQUNFLDJCQUFBO0VBQ0EsdUJBQUE7RUFDQSw0QkFBQTtBQWpESjtBQW9ERTs7RUFFRSwyQkFBQTtFQUNBLHVCQUFBO0FBbERKOztBQXlERTtFQUNFLDJCQUFBO0VBQ0EsdUJBQUE7RUFDQSwyQkFBQTtBQXRESjtBQXlERTtFQUNFLDJCQUFBO0VBQ0EsdUJBQUE7RUFDQSwyQkFBQTtBQXZESjtBQTBERTtFQUNFLDJCQUFBO0VBQ0EsaUNBQUE7RUFDQSwyQkFBQTtBQXhESjtBQTJERTtFQUNFLDJCQUFBO0VBQ0EsaUNBQUE7RUFDQSwyQkFBQTtBQXpESjtBQTZERTtFQUNFLDJCQUFBO0VBQ0EsOEJBQUE7QUEzREo7QUErREU7RUFDRTtJQUNFLDJCQUFBO0lBQ0EsdUJBQUE7SUFDQSwyQkFBQTtFQTdESjtFQWdFRTtJQUNFLDJCQUFBO0lBQ0EsdUJBQUE7SUFDQSwyQkFBQTtFQTlESjtFQWlFRTtJQUNFLDJCQUFBO0lBQ0EsaUNBQUE7SUFDQSwyQkFBQTtFQS9ESjtFQWtFRTtJQUNFLDJCQUFBO0lBQ0EsaUNBQUE7SUFDQSwyQkFBQTtFQWhFSjtBQUNGOztBQXFFQTtFQUVFLHdCQUFBO0VBQ0EsMkJBQUE7RUFHQSxpQ0FBQTtBQXJFRjtBQTBFSTtFQUNFLDJCQUFBO0VBQ0EseUJBQUE7QUF4RU47QUEyRUk7RUFDRSwwQkFBQTtFQUNBLHdCQUFBO0VBQ0Esd0JBQUE7QUF6RU47QUE0RUk7RUFDRSx5QkFBQTtBQTFFTjtBQTZFSTtFQUNFLDhCQUFBO0FBM0VOO0FBK0VJO0VBQ0U7SUFDRSwyQkFBQTtJQUNBLHlCQUFBO0VBN0VOO0VBZ0ZJO0lBQ0UsMEJBQUE7SUFDQSx3QkFBQTtFQTlFTjtFQWlGSTtJQUNFLHlCQUFBO0VBL0VOO0FBQ0Y7QUFtRkk7RUFDRTtJQUNFLDJCQUFBO0lBQ0EseUJBQUE7RUFqRk47RUFvRkk7SUFDRSwwQkFBQTtJQUNBLHdCQUFBO0VBbEZOO0VBcUZJO0lBQ0UseUJBQUE7RUFuRk47QUFDRjtBQXdGRTtFQUNFLHNCQUFBO0VBQ0EsdUJBQUE7RUFDQSw0QkFBQTtBQXRGSjtBQXdGSTtFQUxGO0lBTUksc0JBQUE7SUFDQSx1QkFBQTtJQUNBLDRCQUFBO0VBckZKO0FBQ0Y7QUF1Rkk7RUFYRjtJQVlJLHNCQUFBO0lBQ0EsdUJBQUE7SUFDQSw0QkFBQTtFQXBGSjtBQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRXN0aWxvcyBlc3BlY8ODwq1maWNvcyBwYXJhIGVsIGNvbXBvbmVudGUgZGUgdmFsaWRhY2nDg8KzblxuLnNwYWNlLXktNiA+IDpub3QoW2hpZGRlbl0pIH4gOm5vdChbaGlkZGVuXSkge1xuICBtYXJnaW4tdG9wOiAxLjVyZW07XG59XG5cbi5zcGFjZS15LTYgPiA6Zmlyc3QtY2hpbGQge1xuICBtYXJnaW4tdG9wOiAwO1xufVxuXG4vLyBFc3RpbG9zIHBhcmEgbG9zIGJvdG9uZXMgZGUgYWNjacODwrNuXG4ubWF0LW1kYy1pY29uLWJ1dHRvbiB7XG4gIHRyYW5zaXRpb246IGFsbCAwLjJzIGVhc2UtaW4tb3V0O1xuICBcbiAgJjpob3ZlciB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxLjEpO1xuICB9XG59XG5cbi8vIEVzdGlsb3MgcGFyYSBsYXMgdGFyamV0YXMgZGUgZXN0YWTDg8Ktc3RpY2FzXG4ubWF0LW1kYy1jYXJkIHtcbiAgdHJhbnNpdGlvbjogYWxsIDAuMnMgZWFzZS1pbi1vdXQ7XG4gIFxuICAmOmhvdmVyIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTJweCk7XG4gICAgYm94LXNoYWRvdzogMCAxMHB4IDI1cHggLTVweCByZ2JhKDAsIDAsIDAsIDAuMSksIDAgMTBweCAxMHB4IC01cHggcmdiYSgwLCAwLCAwLCAwLjA0KTtcbiAgfVxufVxuXG4vLyBFc3RpbG9zIHBhcmEgbG9zIGNoaXBzIGRlIGVzdGFkb1xuLmVzdGFkby1jaGlwIHtcbiAgdHJhbnNpdGlvbjogYWxsIDAuMnMgZWFzZS1pbi1vdXQ7XG4gIFxuICAmOmhvdmVyIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEuMDUpO1xuICB9XG59XG5cbi8vIEVzdGlsb3MgZGlyZWN0b3MgcGFyYSBsYXMgY2xhc2VzIGRlbCBIVE1MXG4ucHktMiB7XG4gIHBhZGRpbmctdG9wOiAwcHggIWltcG9ydGFudDtcbiAgcGFkZGluZy1ib3R0b206IDBweCAhaW1wb3J0YW50O1xufVxuXG4udGV4dC14cyB7XG4gIGZvbnQtc2l6ZTogMTJweCAhaW1wb3J0YW50O1xuICBsaW5lLWhlaWdodDogMSAhaW1wb3J0YW50O1xufVxuXG4vLyBFc3RpbG9zIGVzcGVjw4PCrWZpY29zIHBhcmEgbGFzIHRhYmxhc1xuOmhvc3QgOjpuZy1kZWVwIHtcbiAgLy8gQXBsaWNhciBhIFRPREFTIGxhcyB0YWJsYXMgZGVsIGNvbXBvbmVudGVcbiAgbWF0LXRhYmxlIHtcbiAgICAubWF0LW1kYy10YWJsZSB7XG4gICAgICBib3JkZXItY29sbGFwc2U6IHNlcGFyYXRlICFpbXBvcnRhbnQ7XG4gICAgICBib3JkZXItc3BhY2luZzogMCAhaW1wb3J0YW50O1xuICAgICAgd2lkdGg6IDEwMCUgIWltcG9ydGFudDtcbiAgICB9XG4gICAgXG4gICAgLy8gQWx0dXJhIHVsdHJhLXBlcXVlw4PCsWEgcGFyYSBUT0RBUyBsYXMgZmlsYXNcbiAgICAubWF0LW1kYy1yb3cge1xuICAgICAgbWluLWhlaWdodDogOHB4ICFpbXBvcnRhbnQ7XG4gICAgICBoZWlnaHQ6IDhweCAhaW1wb3J0YW50O1xuICAgICAgbWF4LWhlaWdodDogOHB4ICFpbXBvcnRhbnQ7XG4gICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgcmdiYSgwLDAsMCwuMTIpICFpbXBvcnRhbnQ7XG4gICAgICBkaXNwbGF5OiB0YWJsZS1yb3cgIWltcG9ydGFudDtcbiAgICB9XG4gICAgXG4gICAgLm1hdC1tZGMtaGVhZGVyLXJvdyB7XG4gICAgICBtaW4taGVpZ2h0OiA4cHggIWltcG9ydGFudDtcbiAgICAgIGhlaWdodDogOHB4ICFpbXBvcnRhbnQ7XG4gICAgICBtYXgtaGVpZ2h0OiA4cHggIWltcG9ydGFudDtcbiAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCByZ2JhKDAsMCwwLC4xMikgIWltcG9ydGFudDtcbiAgICAgIGRpc3BsYXk6IHRhYmxlLXJvdyAhaW1wb3J0YW50O1xuICAgIH1cbiAgICBcbiAgICAvLyBQYWRkaW5nIGNlcm8gcGFyYSBUT0RBUyBsYXMgY2VsZGFzXG4gICAgLm1hdC1tZGMtY2VsbCB7XG4gICAgICBwYWRkaW5nOiAwcHggIWltcG9ydGFudDtcbiAgICAgIHZlcnRpY2FsLWFsaWduOiBtaWRkbGUgIWltcG9ydGFudDtcbiAgICAgIGxpbmUtaGVpZ2h0OiAxICFpbXBvcnRhbnQ7XG4gICAgICBmb250LXNpemU6IDEycHggIWltcG9ydGFudDtcbiAgICAgIGJvcmRlcjogbm9uZSAhaW1wb3J0YW50O1xuICAgICAgaGVpZ2h0OiA4cHggIWltcG9ydGFudDtcbiAgICAgIG1heC1oZWlnaHQ6IDhweCAhaW1wb3J0YW50O1xuICAgICAgb3ZlcmZsb3c6IGhpZGRlbiAhaW1wb3J0YW50O1xuICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcCAhaW1wb3J0YW50O1xuICAgICAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXMgIWltcG9ydGFudDtcbiAgICAgIHRleHQtYWxpZ246IGxlZnQgIWltcG9ydGFudDtcbiAgICB9XG4gICAgXG4gICAgLm1hdC1tZGMtaGVhZGVyLWNlbGwge1xuICAgICAgcGFkZGluZzogMHB4ICFpbXBvcnRhbnQ7XG4gICAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlICFpbXBvcnRhbnQ7XG4gICAgICBsaW5lLWhlaWdodDogMSAhaW1wb3J0YW50O1xuICAgICAgZm9udC1zaXplOiAxMnB4ICFpbXBvcnRhbnQ7XG4gICAgICBmb250LXdlaWdodDogNTAwICFpbXBvcnRhbnQ7XG4gICAgICBib3JkZXI6IG5vbmUgIWltcG9ydGFudDtcbiAgICAgIGhlaWdodDogOHB4ICFpbXBvcnRhbnQ7XG4gICAgICBtYXgtaGVpZ2h0OiA4cHggIWltcG9ydGFudDtcbiAgICAgIG92ZXJmbG93OiBoaWRkZW4gIWltcG9ydGFudDtcbiAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXAgIWltcG9ydGFudDtcbiAgICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzICFpbXBvcnRhbnQ7XG4gICAgICB0ZXh0LWFsaWduOiBsZWZ0ICFpbXBvcnRhbnQ7XG4gICAgfVxuICAgIFxuICAgIC8vIEVsaW1pbmFyIGN1YWxxdWllciBlc3BhY2lhZG8gZXh0cmFcbiAgICAubWF0LW1kYy1jZWxsLCAubWF0LW1kYy1oZWFkZXItY2VsbCB7XG4gICAgICBtYXJnaW46IDAgIWltcG9ydGFudDtcbiAgICAgIGJvcmRlci1zcGFjaW5nOiAwICFpbXBvcnRhbnQ7XG4gICAgfVxuICB9XG4gIFxuICAvLyBFc3RpbG9zIGVzcGVjw4PCrWZpY29zIHBhcmEgZWxlbWVudG9zIHF1ZSBwdWVkYW4gZXN0YXIgY2F1c2FuZG8gZGlmZXJlbmNpYXNcbiAgLm1hdC1tZGMtdGFibGUtY29udGFpbmVyIHtcbiAgICBvdmVyZmxvdzogaGlkZGVuICFpbXBvcnRhbnQ7XG4gIH1cbiAgXG4gIC5tYXQtbWRjLXRhYmxlLXdyYXBwZXIge1xuICAgIG92ZXJmbG93OiBoaWRkZW4gIWltcG9ydGFudDtcbiAgfVxuICBcbiAgLy8gRXN0aWxvcyBlc3BlY8ODwq1maWNvcyBwYXJhIGVsZW1lbnRvcyBpbnRlcm5vcyBxdWUgcHVlZGFuIGVzdGFyIGFmZWN0YW5kbyBsYSBhbHR1cmFcbiAgLm1hdC1tZGMtY2VsbCBkaXYsXG4gIC5tYXQtbWRjLWNlbGwgc3BhbixcbiAgLm1hdC1tZGMtaGVhZGVyLWNlbGwgZGl2LFxuICAubWF0LW1kYy1oZWFkZXItY2VsbCBzcGFuIHtcbiAgICBsaW5lLWhlaWdodDogMSAhaW1wb3J0YW50O1xuICAgIG1hcmdpbjogMCAhaW1wb3J0YW50O1xuICAgIHBhZGRpbmc6IDAgIWltcG9ydGFudDtcbiAgICBmb250LXNpemU6IDEycHggIWltcG9ydGFudDtcbiAgfVxufVxuXG4vLyBFc3RpbG9zIGFkaWNpb25hbGVzIHBhcmEgZm9yemFyIGFsdHVyYSBlc3BlY8ODwq1maWNhXG46aG9zdCA6Om5nLWRlZXAge1xuICAvLyBGb3J6YXIgYWx0dXJhIGVzcGVjw4PCrWZpY2EgZW4gdG9kYXMgbGFzIGZpbGFzIGRlIHRhYmxhXG4gIC5tYXQtbWRjLXJvdyxcbiAgLm1hdC1tZGMtaGVhZGVyLXJvdyB7XG4gICAgaGVpZ2h0OiA4cHggIWltcG9ydGFudDtcbiAgICBtaW4taGVpZ2h0OiA4cHggIWltcG9ydGFudDtcbiAgICBtYXgtaGVpZ2h0OiA4cHggIWltcG9ydGFudDtcbiAgfVxuICBcbiAgLy8gRm9yemFyIGFsdHVyYSBlc3BlY8ODwq1maWNhIGVuIHRvZGFzIGxhcyBjZWxkYXNcbiAgLm1hdC1tZGMtY2VsbCxcbiAgLm1hdC1tZGMtaGVhZGVyLWNlbGwge1xuICAgIGhlaWdodDogOHB4ICFpbXBvcnRhbnQ7XG4gICAgbWluLWhlaWdodDogOHB4ICFpbXBvcnRhbnQ7XG4gICAgbWF4LWhlaWdodDogOHB4ICFpbXBvcnRhbnQ7XG4gICAgcGFkZGluZzogMHB4ICFpbXBvcnRhbnQ7XG4gICAgbWFyZ2luOiAwcHggIWltcG9ydGFudDtcbiAgICB0ZXh0LWFsaWduOiBsZWZ0ICFpbXBvcnRhbnQ7XG4gIH1cbiAgXG4gIC8vIEVzdGlsb3MgZXNwZWPDg8KtZmljb3MgcGFyYSBlbGVtZW50b3MgcXVlIHB1ZWRhbiBlc3RhciBjYXVzYW5kbyBhbHR1cmEgZXh0cmFcbiAgLm1hdC1tZGMtY2VsbCAqLFxuICAubWF0LW1kYy1oZWFkZXItY2VsbCAqIHtcbiAgICBoZWlnaHQ6IGF1dG8gIWltcG9ydGFudDtcbiAgICBtaW4taGVpZ2h0OiBhdXRvICFpbXBvcnRhbnQ7XG4gICAgbWF4LWhlaWdodDogYXV0byAhaW1wb3J0YW50O1xuICAgIGxpbmUtaGVpZ2h0OiAxICFpbXBvcnRhbnQ7XG4gICAgbWFyZ2luOiAwcHggIWltcG9ydGFudDtcbiAgICBwYWRkaW5nOiAwcHggIWltcG9ydGFudDtcbiAgfVxuICBcbiAgLy8gQ2VudHJhciBjb250ZW5pZG8gZGUgY29sdW1uYXMgZXNwZWPDg8KtZmljYXMgKHNvbG8gaWNvbm9zIHkgdmFsb3JlcyBTw4PCrS9ObyBkZSBsYSB0YWJsYSBkZSBkb2N1bWVudG9zKVxuICAubWF0LW1kYy1jZWxsOm50aC1jaGlsZCg0KSwgLy8gZXN0YXR1cyAodGFibGEgZG9jdW1lbnRvcylcbiAgLm1hdC1tZGMtY2VsbDpudGgtY2hpbGQoNSksIC8vIHZlciAodGFibGEgZG9jdW1lbnRvcylcbiAgLm1hdC1tZGMtY2VsbDpudGgtY2hpbGQoNiksIC8vIHZhbGlkYXIgKHRhYmxhIGRvY3VtZW50b3MpXG4gIC5tYXQtbWRjLWNlbGw6bnRoLWNoaWxkKDcpLCAvLyBlbGltaW5hciAodGFibGEgZG9jdW1lbnRvcylcbiAgLm1hdC1tZGMtY2VsbDpudGgtY2hpbGQoOCksIC8vIHJlcXVlcmlkbyAodGFibGEgZG9jdW1lbnRvcylcbiAgLm1hdC1tZGMtY2VsbDpudGgtY2hpbGQoOSksIC8vIHJlcXVpZXJlRXhwaXJhY2lvbiAodGFibGEgZG9jdW1lbnRvcylcbiAgLm1hdC1tZGMtaGVhZGVyLWNlbGw6bnRoLWNoaWxkKDQpLCAvLyBlc3RhdHVzIGhlYWRlciAodGFibGEgZG9jdW1lbnRvcylcbiAgLm1hdC1tZGMtaGVhZGVyLWNlbGw6bnRoLWNoaWxkKDUpLCAvLyB2ZXIgaGVhZGVyICh0YWJsYSBkb2N1bWVudG9zKVxuICAubWF0LW1kYy1oZWFkZXItY2VsbDpudGgtY2hpbGQoNiksIC8vIHZhbGlkYXIgaGVhZGVyICh0YWJsYSBkb2N1bWVudG9zKVxuICAubWF0LW1kYy1oZWFkZXItY2VsbDpudGgtY2hpbGQoNyksIC8vIGVsaW1pbmFyIGhlYWRlciAodGFibGEgZG9jdW1lbnRvcylcbiAgLm1hdC1tZGMtaGVhZGVyLWNlbGw6bnRoLWNoaWxkKDgpLCAvLyByZXF1ZXJpZG8gaGVhZGVyICh0YWJsYSBkb2N1bWVudG9zKVxuICAubWF0LW1kYy1oZWFkZXItY2VsbDpudGgtY2hpbGQoOSkgeyAvLyByZXF1aWVyZUV4cGlyYWNpb24gaGVhZGVyICh0YWJsYSBkb2N1bWVudG9zKVxuICAgIHRleHQtYWxpZ246IGNlbnRlciAhaW1wb3J0YW50O1xuICB9XG59XG5cbi8vIEVzdGlsb3MgZXNwZWPDg8KtZmljb3MgcGFyYSBsYSB0YWJsYSBkZSBjbGllbnRlcyAodGFibGEgc3VwZXJpb3IpXG46aG9zdCA6Om5nLWRlZXAge1xuICAvLyBBbGluZWFyIGEgbGEgaXpxdWllcmRhIGxhcyBjb2x1bW5hcyBkZSB0ZXh0byBlbiBsYSB0YWJsYSBkZSBjbGllbnRlc1xuICAubWF0LW1kYy1jZWxsOm50aC1jaGlsZCg0KSwgLy8gcHJvY2VzbyAodGFibGEgY2xpZW50ZXMpXG4gIC5tYXQtbWRjLWNlbGw6bnRoLWNoaWxkKDUpLCAvLyBvcGVyYWNpw4PCs24gKHRhYmxhIGNsaWVudGVzKVxuICAubWF0LW1kYy1jZWxsOm50aC1jaGlsZCg2KSwgLy8gZmFzZSAodGFibGEgY2xpZW50ZXMpXG4gIC5tYXQtbWRjLWNlbGw6bnRoLWNoaWxkKDcpLCAvLyBmZWNoYUxpYmVyYWNpb24gKHRhYmxhIGNsaWVudGVzKVxuICAubWF0LW1kYy1jZWxsOm50aC1jaGlsZCg4KSwgLy8gcmVnaXN0cm8gKHRhYmxhIGNsaWVudGVzKVxuICAubWF0LW1kYy1oZWFkZXItY2VsbDpudGgtY2hpbGQoNCksIC8vIHByb2Nlc28gaGVhZGVyICh0YWJsYSBjbGllbnRlcylcbiAgLm1hdC1tZGMtaGVhZGVyLWNlbGw6bnRoLWNoaWxkKDUpLCAvLyBvcGVyYWNpw4PCs24gaGVhZGVyICh0YWJsYSBjbGllbnRlcylcbiAgLm1hdC1tZGMtaGVhZGVyLWNlbGw6bnRoLWNoaWxkKDYpLCAvLyBmYXNlIGhlYWRlciAodGFibGEgY2xpZW50ZXMpXG4gIC5tYXQtbWRjLWhlYWRlci1jZWxsOm50aC1jaGlsZCg3KSwgLy8gZmVjaGFMaWJlcmFjaW9uIGhlYWRlciAodGFibGEgY2xpZW50ZXMpXG4gIC5tYXQtbWRjLWhlYWRlci1jZWxsOm50aC1jaGlsZCg4KSB7IC8vIHJlZ2lzdHJvIGhlYWRlciAodGFibGEgY2xpZW50ZXMpXG4gICAgdGV4dC1hbGlnbjogbGVmdCAhaW1wb3J0YW50O1xuICB9XG4gIFxuICAvLyBNb3N0cmFyIGljb25vcyBkZSBvcmRlbmFtaWVudG8gZW4gbG9zIGhlYWRlcnNcbiAgLm1hdC1zb3J0LWhlYWRlci1hcnJvdyB7XG4gICAgb3BhY2l0eTogMSAhaW1wb3J0YW50O1xuICAgIHZpc2liaWxpdHk6IHZpc2libGUgIWltcG9ydGFudDtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2sgIWltcG9ydGFudDtcbiAgfVxuICBcbiAgLm1hdC1zb3J0LWhlYWRlci1zdGVtIHtcbiAgICBvcGFjaXR5OiAxICFpbXBvcnRhbnQ7XG4gICAgdmlzaWJpbGl0eTogdmlzaWJsZSAhaW1wb3J0YW50O1xuICB9XG4gIFxuICAubWF0LXNvcnQtaGVhZGVyLWluZGljYXRvciB7XG4gICAgb3BhY2l0eTogMSAhaW1wb3J0YW50O1xuICAgIHZpc2liaWxpdHk6IHZpc2libGUgIWltcG9ydGFudDtcbiAgfVxuICBcbiAgLy8gRXN0aWxvcyBwYXJhIGxvcyBpY29ub3MgZGUgb3JkZW5hbWllbnRvXG4gIC5tYXQtc29ydC1oZWFkZXItYnV0dG9uIHtcbiAgICBkaXNwbGF5OiBmbGV4ICFpbXBvcnRhbnQ7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlciAhaW1wb3J0YW50O1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyICFpbXBvcnRhbnQ7XG4gIH1cbn1cblxuLy8gRXN0aWxvcyBlc3BlY8ODwq1maWNvcyBwYXJhIGVsIHBhZ2luYWRvciBwYXJhIHF1ZSBubyBhZmVjdGUgbGEgdGFibGFcbjo6bmctZGVlcCAubWF0LW1kYy1wYWdpbmF0b3Ige1xuICBtaW4taGVpZ2h0OiA0OHB4ICFpbXBvcnRhbnQ7XG4gIGhlaWdodDogNDhweCAhaW1wb3J0YW50O1xuICBtYXJnaW4tdG9wOiAwICFpbXBvcnRhbnQ7XG4gIHBhZGRpbmc6IDAgOHB4ICFpbXBvcnRhbnQ7XG4gIFxuICAubWF0LW1kYy1wYWdpbmF0b3ItY29udGFpbmVyIHtcbiAgICBtaW4taGVpZ2h0OiA0OHB4ICFpbXBvcnRhbnQ7XG4gICAgaGVpZ2h0OiA0OHB4ICFpbXBvcnRhbnQ7XG4gIH1cbiAgXG4gIC5tYXQtbWRjLXBhZ2luYXRvci1wYWdlLXNpemUge1xuICAgIG1pbi1oZWlnaHQ6IDQ4cHggIWltcG9ydGFudDtcbiAgICBoZWlnaHQ6IDQ4cHggIWltcG9ydGFudDtcbiAgfVxuICBcbiAgLm1hdC1tZGMtcGFnaW5hdG9yLXJhbmdlLWxhYmVsIHtcbiAgICBtaW4taGVpZ2h0OiA0OHB4ICFpbXBvcnRhbnQ7XG4gICAgaGVpZ2h0OiA0OHB4ICFpbXBvcnRhbnQ7XG4gICAgbGluZS1oZWlnaHQ6IDQ4cHggIWltcG9ydGFudDtcbiAgfVxuICBcbiAgLm1hdC1tZGMtcGFnaW5hdG9yLW5hdmlnYXRpb24tcHJldmlvdXMsXG4gIC5tYXQtbWRjLXBhZ2luYXRvci1uYXZpZ2F0aW9uLW5leHQge1xuICAgIG1pbi1oZWlnaHQ6IDQ4cHggIWltcG9ydGFudDtcbiAgICBoZWlnaHQ6IDQ4cHggIWltcG9ydGFudDtcbiAgfVxufVxuXG4vLyBFc3RpbG9zIHBhcmEgdGFibGEgY29tcGFjdGEgLSBhcGxpY2FyIGEgYW1iYXMgdGFibGFzXG4uY29tcGFjdC10YWJsZSB7XG4gIC8vIEZvcnphciBhbHR1cmEgdW5pZm9ybWUgcGFyYSB0b2RhcyBsYXMgZmlsYXNcbiAgLm1hdC1tZGMtcm93IHtcbiAgICBtaW4taGVpZ2h0OiAzMnB4ICFpbXBvcnRhbnQ7XG4gICAgaGVpZ2h0OiAzMnB4ICFpbXBvcnRhbnQ7XG4gICAgbWF4LWhlaWdodDogMzJweCAhaW1wb3J0YW50O1xuICB9XG4gIFxuICAubWF0LW1kYy1oZWFkZXItcm93IHtcbiAgICBtaW4taGVpZ2h0OiAzMnB4ICFpbXBvcnRhbnQ7XG4gICAgaGVpZ2h0OiAzMnB4ICFpbXBvcnRhbnQ7XG4gICAgbWF4LWhlaWdodDogMzJweCAhaW1wb3J0YW50O1xuICB9XG4gIFxuICAubWF0LW1kYy1jZWxsIHtcbiAgICBwYWRkaW5nOiA0cHggOHB4ICFpbXBvcnRhbnQ7XG4gICAgdmVydGljYWwtYWxpZ246IG1pZGRsZSAhaW1wb3J0YW50O1xuICAgIGxpbmUtaGVpZ2h0OiAxLjIgIWltcG9ydGFudDtcbiAgfVxuICBcbiAgLm1hdC1tZGMtaGVhZGVyLWNlbGwge1xuICAgIHBhZGRpbmc6IDRweCA4cHggIWltcG9ydGFudDtcbiAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlICFpbXBvcnRhbnQ7XG4gICAgbGluZS1oZWlnaHQ6IDEuMiAhaW1wb3J0YW50O1xuICB9XG4gIFxuICAvLyBGb3J6YXIgcXVlIGVsIGNvbnRlbmlkbyBubyBoYWdhIGNyZWNlciBsYXMgZmlsYXNcbiAgLm1hdC1tZGMtY2VsbCwgLm1hdC1tZGMtaGVhZGVyLWNlbGwge1xuICAgIG92ZXJmbG93OiBoaWRkZW4gIWltcG9ydGFudDtcbiAgICB3aGl0ZS1zcGFjZTogbm93cmFwICFpbXBvcnRhbnQ7XG4gIH1cbiAgXG4gIC8vIEVuIHBhbnRhbGxhcyBtdXkgZ3JhbmRlcywgbWFudGVuZXIgZWwgbWlzbW8gdGFtYcODwrFvXG4gIEBtZWRpYSAobWluLXdpZHRoOiAxNDQwcHgpIHtcbiAgICAubWF0LW1kYy1yb3cge1xuICAgICAgbWluLWhlaWdodDogMzJweCAhaW1wb3J0YW50O1xuICAgICAgaGVpZ2h0OiAzMnB4ICFpbXBvcnRhbnQ7XG4gICAgICBtYXgtaGVpZ2h0OiAzMnB4ICFpbXBvcnRhbnQ7XG4gICAgfVxuICAgIFxuICAgIC5tYXQtbWRjLWhlYWRlci1yb3cge1xuICAgICAgbWluLWhlaWdodDogMzJweCAhaW1wb3J0YW50O1xuICAgICAgaGVpZ2h0OiAzMnB4ICFpbXBvcnRhbnQ7XG4gICAgICBtYXgtaGVpZ2h0OiAzMnB4ICFpbXBvcnRhbnQ7XG4gICAgfVxuICAgIFxuICAgIC5tYXQtbWRjLWNlbGwge1xuICAgICAgcGFkZGluZzogNHB4IDhweCAhaW1wb3J0YW50O1xuICAgICAgdmVydGljYWwtYWxpZ246IG1pZGRsZSAhaW1wb3J0YW50O1xuICAgICAgbGluZS1oZWlnaHQ6IDEuMiAhaW1wb3J0YW50O1xuICAgIH1cbiAgICBcbiAgICAubWF0LW1kYy1oZWFkZXItY2VsbCB7XG4gICAgICBwYWRkaW5nOiA0cHggOHB4ICFpbXBvcnRhbnQ7XG4gICAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlICFpbXBvcnRhbnQ7XG4gICAgICBsaW5lLWhlaWdodDogMS4yICFpbXBvcnRhbnQ7XG4gICAgfVxuICB9XG59XG5cbi8vIEVzdGlsb3MgcGFyYSBmaWx0cm9zIGNvbXBhY3Rvc1xuLmZpbHRyby1jb250YWluZXIge1xuICAvLyBQYWRkaW5nIGRlbCBjb250ZW5lZG9yIGF1bWVudGFkbyBwYXJhIHF1ZSBzZWEgbcODwqFzIGdyYW5kZSBxdWUgbG9zIGZpbHRyb3NcbiAgcGFkZGluZzogMjBweCAhaW1wb3J0YW50O1xuICBtaW4taGVpZ2h0OiA4MHB4ICFpbXBvcnRhbnQ7XG4gIFxuICAvLyBBc2VndXJhciBxdWUgZWwgY29udGVuZWRvciBzZWEgdmlzaWJsZW1lbnRlIG3Dg8KhcyBncmFuZGVcbiAgYm94LXNpemluZzogYm9yZGVyLWJveCAhaW1wb3J0YW50O1xuICBcbiAgLy8gSGFjZXIgbG9zIG1hdC1mb3JtLWZpZWxkIG3Dg8KhcyBjb21wYWN0b3MgY29uIG1heW9yIGVzcGVjaWZpY2lkYWRcbiAgLmNvbXBhY3QtZmllbGQge1xuICAgIC8vIFJlZHVjaXIgYWx0dXJhIGlubWVkaWF0YW1lbnRlIHZpc2libGVcbiAgICAubWF0LW1kYy1mb3JtLWZpZWxkLWluZml4IHtcbiAgICAgIG1pbi1oZWlnaHQ6IDQ0cHggIWltcG9ydGFudDtcbiAgICAgIHBhZGRpbmc6IDhweCAwICFpbXBvcnRhbnQ7XG4gICAgfVxuICAgIFxuICAgIC5tYXQtbWRjLWZvcm0tZmllbGQtc3Vic2NyaXB0LXdyYXBwZXIge1xuICAgICAgbWFyZ2luLXRvcDogMnB4ICFpbXBvcnRhbnQ7XG4gICAgICBtaW4taGVpZ2h0OiAwICFpbXBvcnRhbnQ7XG4gICAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gICAgfVxuICAgIFxuICAgIC5tYXQtbWRjLXRleHQtZmllbGQtd3JhcHBlciB7XG4gICAgICBwYWRkaW5nOiAwIDhweCAhaW1wb3J0YW50O1xuICAgIH1cbiAgICBcbiAgICAubWF0LW1kYy1mb3JtLWZpZWxkLWZsZXgge1xuICAgICAgYWxpZ24taXRlbXM6IGNlbnRlciAhaW1wb3J0YW50O1xuICAgIH1cbiAgICBcbiAgICAvLyBSZWR1Y2lyIGFsdHVyYSBlbiBwYW50YWxsYXMgZ3JhbmRlc1xuICAgIEBtZWRpYSAobWluLXdpZHRoOiAxMDI0cHgpIHtcbiAgICAgIC5tYXQtbWRjLWZvcm0tZmllbGQtaW5maXgge1xuICAgICAgICBtaW4taGVpZ2h0OiA0MHB4ICFpbXBvcnRhbnQ7XG4gICAgICAgIHBhZGRpbmc6IDZweCAwICFpbXBvcnRhbnQ7XG4gICAgICB9XG4gICAgICBcbiAgICAgIC5tYXQtbWRjLWZvcm0tZmllbGQtc3Vic2NyaXB0LXdyYXBwZXIge1xuICAgICAgICBtYXJnaW4tdG9wOiAxcHggIWltcG9ydGFudDtcbiAgICAgICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICAgICAgfVxuICAgICAgXG4gICAgICAubWF0LW1kYy10ZXh0LWZpZWxkLXdyYXBwZXIge1xuICAgICAgICBwYWRkaW5nOiAwIDZweCAhaW1wb3J0YW50O1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBFbiBwYW50YWxsYXMgbXV5IGdyYW5kZXMsIGhhY2VyIGHDg8K6biBtw4PCoXMgY29tcGFjdG9cbiAgICBAbWVkaWEgKG1pbi13aWR0aDogMTQ0MHB4KSB7XG4gICAgICAubWF0LW1kYy1mb3JtLWZpZWxkLWluZml4IHtcbiAgICAgICAgbWluLWhlaWdodDogMzZweCAhaW1wb3J0YW50O1xuICAgICAgICBwYWRkaW5nOiA0cHggMCAhaW1wb3J0YW50O1xuICAgICAgfVxuICAgICAgXG4gICAgICAubWF0LW1kYy1mb3JtLWZpZWxkLXN1YnNjcmlwdC13cmFwcGVyIHtcbiAgICAgICAgbWFyZ2luLXRvcDogMHB4ICFpbXBvcnRhbnQ7XG4gICAgICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLm1hdC1tZGMtdGV4dC1maWVsZC13cmFwcGVyIHtcbiAgICAgICAgcGFkZGluZzogMCA0cHggIWltcG9ydGFudDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gIC8vIFJlZHVjaXIgdGFtYcODwrFvIGRlIGJvdG9uZXNcbiAgLm1hdC1tZGMtaWNvbi1idXR0b24ge1xuICAgIHdpZHRoOiAzNnB4ICFpbXBvcnRhbnQ7XG4gICAgaGVpZ2h0OiAzNnB4ICFpbXBvcnRhbnQ7XG4gICAgbGluZS1oZWlnaHQ6IDM2cHggIWltcG9ydGFudDtcbiAgICBcbiAgICBAbWVkaWEgKG1pbi13aWR0aDogMTAyNHB4KSB7XG4gICAgICB3aWR0aDogMzJweCAhaW1wb3J0YW50O1xuICAgICAgaGVpZ2h0OiAzMnB4ICFpbXBvcnRhbnQ7XG4gICAgICBsaW5lLWhlaWdodDogMzJweCAhaW1wb3J0YW50O1xuICAgIH1cbiAgICBcbiAgICBAbWVkaWEgKG1pbi13aWR0aDogMTQ0MHB4KSB7XG4gICAgICB3aWR0aDogMjhweCAhaW1wb3J0YW50O1xuICAgICAgaGVpZ2h0OiAyOHB4ICFpbXBvcnRhbnQ7XG4gICAgICBsaW5lLWhlaWdodDogMjhweCAhaW1wb3J0YW50O1xuICAgIH1cbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */", "\n\n    .mat-mdc-form-field-subscript-wrapper[_ngcontent-%COMP%], .mat-mdc-form-field-hint-wrapper[_ngcontent-%COMP%], .mat-mdc-form-field-hint-spacer[_ngcontent-%COMP%], .mat-mdc-form-field-bottom-align[_ngcontent-%COMP%] {\n      display: none !important;\n      height: 0 !important;\n      min-height: 0 !important;\n      max-height: 0 !important;\n      margin: 0 !important;\n      padding: 0 !important;\n      overflow: hidden !important;\n      visibility: hidden !important;\n      opacity: 0 !important;\n      position: absolute !important;\n      pointer-events: none !important;\n      display: none !important;\n    }\n    \n    \n\n    .mat-mdc-form-field[_ngcontent-%COMP%] {\n      margin-bottom: 0 !important;\n      padding-bottom: 0 !important;\n    }\n    \n    \n\n    .mat-mdc-form-field-infix[_ngcontent-%COMP%] {\n      padding-top: 4px !important;\n      padding-bottom: 4px !important;\n      min-height: 16px !important;\n    }\n    \n    \n\n    .py-2[_ngcontent-%COMP%] {\n      padding-top: 0 !important;\n      padding-bottom: 0 !important;\n    }\n    \n    \n\n    th.mat-header-cell[_ngcontent-%COMP%], td.mat-cell[_ngcontent-%COMP%] {\n      padding-top: 0 !important;\n      padding-bottom: 0 !important;\n    }\n    \n    \n\n    .filtro-container[_ngcontent-%COMP%]   .mat-mdc-form-field-infix[_ngcontent-%COMP%] {\n      padding-top: 1px !important;\n      padding-bottom: 1px !important;\n      min-height: 8px !important;\n      height: 8px !important;\n      max-height: 8px !important;\n    }\n    \n    \n\n    .filtro-container[_ngcontent-%COMP%]   .mat-mdc-form-field[_ngcontent-%COMP%] {\n      height: 32px !important;\n      min-height: 32px !important;\n      max-height: 32px !important;\n    }\n    \n    \n\n    .filtro-container[_ngcontent-%COMP%]   .mat-mdc-text-field-wrapper[_ngcontent-%COMP%] {\n      height: 32px !important;\n      min-height: 32px !important;\n      max-height: 32px !important;\n      padding-top: 0 !important;\n      padding-bottom: 0 !important;\n    }\n    \n    \n\n    .filtro-container[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%] {\n      height: 24px !important;\n      min-height: 24px !important;\n      max-height: 24px !important;\n      line-height: 24px !important;\n    }\n    \n    \n\n    .filtro-container[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%] {\n      height: 28px !important;\n      min-height: 28px !important;\n      max-height: 28px !important;\n      line-height: 28px !important;\n    }\n    \n    \n\n    .combo-fase[_ngcontent-%COMP%]   .mat-mdc-form-field-infix[_ngcontent-%COMP%] {\n      padding-top: 1px !important;\n      padding-bottom: 1px !important;\n      min-height: 8px !important;\n      height: 8px !important;\n      max-height: 8px !important;\n    }\n    \n    .combo-fase[_ngcontent-%COMP%]   .mat-mdc-form-field[_ngcontent-%COMP%] {\n      height: 32px !important;\n      min-height: 32px !important;\n      max-height: 32px !important;\n    }\n\n    \n\n    .animate-spin[_ngcontent-%COMP%] {\n      animation: _ngcontent-%COMP%_spin 1s linear infinite;\n    }\n    \n    @keyframes _ngcontent-%COMP%_spin {\n      from {\n        transform: rotate(0deg);\n      }\n      to {\n        transform: rotate(360deg);\n      }\n    }\n    \n    .combo-fase[_ngcontent-%COMP%]   .mat-mdc-text-field-wrapper[_ngcontent-%COMP%] {\n      height: 32px !important;\n      min-height: 32px !important;\n      max-height: 32px !important;\n      padding-top: 0 !important;\n      padding-bottom: 0 !important;\n    }\n    \n    .combo-fase[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%] {\n      height: 24px !important;\n      min-height: 24px !important;\n      max-height: 24px !important;\n      line-height: 24px !important;\n    }\n    \n    .combo-fase[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%] {\n      height: 28px !important;\n      min-height: 28px !important;\n      max-height: 28px !important;\n      line-height: 28px !important;\n    }\n    \n    \n\n    .filtros-estado[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n      font-size: 14px !important;\n      width: 14px !important;\n      height: 14px !important;\n      line-height: 14px !important;\n    }\n    \n    .filtros-estado[_ngcontent-%COMP%]   .mat-icon-button[_ngcontent-%COMP%] {\n      width: 24px !important;\n      height: 24px !important;\n      min-width: 24px !important;\n      min-height: 24px !important;\n      line-height: 24px !important;\n    }\n    \n    \n\n    .filtro-container[_ngcontent-%COMP%] {\n      padding: 8px !important;\n      margin-bottom: 16px !important;\n    }\n    \n    \n\n    .filtro-grid[_ngcontent-%COMP%] {\n      gap: 1px !important;\n    }\n    \n    \n\n    .filtro-container[_ngcontent-%COMP%]   .mat-mdc-form-field-infix[_ngcontent-%COMP%] {\n      padding-top: 1px !important;\n      padding-bottom: 1px !important;\n      min-height: 8px !important;\n      height: 8px !important;\n      max-height: 8px !important;\n    }\n    \n    .filtro-container[_ngcontent-%COMP%]   .mat-mdc-form-field[_ngcontent-%COMP%] {\n      height: 32px !important;\n      min-height: 32px !important;\n      max-height: 32px !important;\n    }\n    \n    .filtro-container[_ngcontent-%COMP%]   .mat-mdc-text-field-wrapper[_ngcontent-%COMP%] {\n      height: 32px !important;\n      min-height: 32px !important;\n      max-height: 32px !important;\n      padding-top: 0 !important;\n      padding-bottom: 0 !important;\n    }\n    \n    .filtro-container[_ngcontent-%COMP%]   .mat-mdc-select[_ngcontent-%COMP%] {\n      height: 24px !important;\n      min-height: 24px !important;\n      max-height: 24px !important;\n      line-height: 24px !important;\n    }\n    \n    .filtro-container[_ngcontent-%COMP%]   .mat-mdc-option[_ngcontent-%COMP%] {\n      height: 28px !important;\n      min-height: 28px !important;\n      max-height: 28px !important;\n      line-height: 28px !important;\n    }"]
  });
}

/***/ }),

/***/ 17741:
/*!*********************************************************************!*\
  !*** ./src/app/pages/mesa-control/validacion/validacion.service.ts ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ValidacionService: () => (/* binding */ ValidacionService)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ 54860);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 58071);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ 79736);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ 2389);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../environments/environment */ 20553);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 61699);






class ValidacionService {
  constructor(http) {
    this.http = http;
    this.apiUrl = _environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiBaseUrl;
    // BehaviorSubjects para mantener el estado de los datos
    this.clientesSubject = new rxjs__WEBPACK_IMPORTED_MODULE_1__.BehaviorSubject([]);
    this.documentosSubject = new rxjs__WEBPACK_IMPORTED_MODULE_1__.BehaviorSubject([]);
    this.loadingSubject = new rxjs__WEBPACK_IMPORTED_MODULE_1__.BehaviorSubject(false);
    // Observables públicos
    this.clientes$ = this.clientesSubject.asObservable();
    this.documentos$ = this.documentosSubject.asObservable();
    this.loading$ = this.loadingSubject.asObservable();
  }
  /**
   * Cargar agencias disponibles (solo activas y con permisos del usuario)
   */
  cargarAgencias() {
    const url = `${this.apiUrl}/api/agency`;
    return this.http.get(url).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => {
      if (response && response.success && response.data && response.data.agencies) {
        return response.data.agencies;
      } else if (response && Array.isArray(response)) {
        return response;
      } else if (response && response.agencies) {
        return response.agencies;
      } else {
        return [];
      }
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
   * Cargar clientes/procesos con filtros
   */
  cargarClientes(filtros = {}) {
    this.loadingSubject.next(true);
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpParams();
    if (filtros.agencia) params = params.set('id', filtros.agencia);
    if (filtros.proceso) params = params.set('idProcess', filtros.proceso);
    if (filtros.showCancelled !== undefined) params = params.set('showCancelled', filtros.showCancelled.toString());
    params = params.set('page', '1');
    params = params.set('limit', '10000'); // Obtener más registros para paginación local
    return this.http.get(`${this.apiUrl}/api/clients-validation/clientes`, {
      params
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => {
      console.log('🔍 ValidacionService - Respuesta completa del API:', response);
      console.log('🔍 ValidacionService - URL llamada:', `${this.apiUrl}/api/clients-validation/clientes`);
      console.log('🔍 ValidacionService - Parámetros:', params.toString());
      if (response && response.success && response.data && response.data.clientes) {
        console.log('✅ ValidacionService - Clientes extraídos:', response.data.clientes);
        console.log('🔍 ValidacionService - Primer cliente:', response.data.clientes.length > 0 ? response.data.clientes[0] : 'No hay clientes');
        return response.data.clientes;
      }
      console.log('⚠️ ValidacionService - No se encontraron clientes en la respuesta');
      return [];
    }));
  }
  /**
   * Cargar documentos de un archivo específico
   */
  cargarDocumentos(idFile) {
    this.loadingSubject.next(true);
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpParams();
    params = params.set('idFile', idFile.toString());
    return this.http.get(`${this.apiUrl}/api/clients-validation/documentos`, {
      params
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => {
      if (response && response.success && response.data) {
        return response.data;
      }
      return [];
    }));
  }
  /**
   * Cargar procesos disponibles
   */
  cargarProcesos() {
    const url = `${this.apiUrl}/api/process`;
    return this.http.get(url).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => {
      if (response && response.success && response.data && response.data.processes) {
        return response.data.processes;
      } else if (response && Array.isArray(response)) {
        return response;
      } else if (response && response.processes) {
        return response.processes;
      } else {
        return [];
      }
    }));
  }
  /**
   * Cargar fases disponibles
   */
  cargarFases() {
    return this.http.get(`${this.apiUrl}/api/validacion/fases`);
  }
  /**
   * Validar un documento - cambiar estatus de "2" a "3"
   */
  validarDocumento(idDocumentByFile) {
    const data = {
      idDocumentByFile: idDocumentByFile
    };
    return this.http.post(`${this.apiUrl}/api/clients-validation/validar-documento`, data).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => {
      if (response && response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Error al validar el documento');
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.catchError)(error => {
      console.error('Error en validarDocumento:', error);
      throw error;
    }));
  }
  /**
   * Preparar documento para validación - cambiar estatus de "2" a "3"
   */
  prepararDocumento(idDocumentByFile) {
    const data = {
      idDocumentByFile: idDocumentByFile
    };
    return this.http.post(`${this.apiUrl}/api/clients-validation/preparar-documento`, data).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => {
      if (response && response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Error al preparar el documento');
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.catchError)(error => {
      console.error('Error en prepararDocumento:', error);
      throw error;
    }));
  }
  /**
   * Aprobar/Rechazar documento - cambiar estatus a "4" (aprobado) o "5" (rechazado)
   */
  aprobarDocumento(idDocumentByFile, nuevoEstatus, comentario, fechaExpiracion) {
    const data = {
      idDocumentByFile: idDocumentByFile,
      nuevoEstatus: nuevoEstatus,
      comentario: comentario
    };
    // Si hay fecha de expiración, agregarla al payload
    if (fechaExpiracion) {
      data.fechaExpiracion = fechaExpiracion.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    }

    return this.http.post(`${this.apiUrl}/api/clients-validation/aprobar-documento`, data).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => {
      if (response && response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Error al procesar el documento');
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.catchError)(error => {
      console.error('Error en aprobarDocumento:', error);
      throw error;
    }));
  }
  /**
   * Rechazar un documento
   */
  rechazarDocumento(documentoId, motivo, comentario) {
    return this.http.post(`${this.apiUrl}/api/validacion/rechazar`, {
      documentoId,
      motivo,
      comentario
    });
  }
  /**
   * Descargar archivo
   */
  descargarArchivo(documentoId) {
    return this.http.get(`${this.apiUrl}/api/validacion/descargar/${documentoId}`, {
      responseType: 'blob'
    });
  }
  /**
   * Cancelar proceso
   */
  cancelarProceso(clienteId, motivo) {
    return this.http.post(`${this.apiUrl}/api/validacion/cancelar`, {
      clienteId,
      motivo
    });
  }
  /**
   * Cancelar pedido
   */
  cancelarPedido(clienteId, motivoId, comentario) {
    const data = {
      clienteId: clienteId,
      motivoId: motivoId,
      comentario: comentario
    };
    return this.http.post(`${this.apiUrl}/api/clients-validation/cancelar-pedido`, data).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => {
      if (response && response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Error al cancelar el pedido');
      }
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.catchError)(error => {
      console.error('Error cancelando pedido:', error);
      throw error;
    }));
  }
  /**
   * Crear excepción en pedido
   */
  excepcionPedido(clienteId, motivoId, comentario) {
    const data = {
      clienteId: clienteId,
      motivoId: motivoId,
      comentario: comentario
    };
    return this.http.post(`${this.apiUrl}/api/clients-validation/excepcion-pedido`, data).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => {
      if (response && response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Error al crear la excepción');
      }
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.catchError)(error => {
      console.error('Error creando excepción:', error);
      throw error;
    }));
  }
  /**
   * Eliminar pedido y sus relaciones
   */
  eliminarPedido(clienteId) {
    const data = {
      clienteId: clienteId
    };
    return this.http.delete(`${this.apiUrl}/api/clients-validation/eliminar-pedido`, {
      body: data
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => {
      if (response && response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Error al eliminar el pedido');
      }
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.catchError)(error => {
      console.error('Error eliminando pedido:', error);
      throw error;
    }));
  }
  /**
   * Cambiar estatus del pedido
   */
  cambiarEstatus(clienteId, nuevoIdCurrentState) {
    const data = {
      clienteId: clienteId,
      nuevoIdCurrentState: nuevoIdCurrentState
    };
    return this.http.put(`${this.apiUrl}/api/clients-validation/cambiar-estatus`, data).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => {
      if (response && response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Error al cambiar el estatus');
      }
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.catchError)(error => {
      console.error('Error cambiando estatus:', error);
      throw error;
    }));
  }
  /**
   * Crear excepción (método legacy)
   */
  crearExcepcion(clienteId, datos) {
    return this.http.post(`${this.apiUrl}/api/validacion/excepcion`, {
      clienteId,
      ...datos
    });
  }
  /**
   * Actualizar datos locales
   */
  actualizarClientes(clientes) {
    this.clientesSubject.next(clientes);
  }
  actualizarDocumentos(documentos) {
    this.documentosSubject.next(documentos);
  }
  setLoading(loading) {
    this.loadingSubject.next(loading);
  }
  /**
   * Obtener estadísticas
   */
  obtenerEstadisticas(filtros = {}) {
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpParams();
    if (filtros.agencia) params = params.set('id', filtros.agencia);
    if (filtros.proceso) params = params.set('idProcess', filtros.proceso);
    return this.http.get(`${this.apiUrl}/api/clients-validation/estadisticas`, {
      params
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => {
      if (response && response.success && response.data) {
        return response.data;
      }
      return [];
    }));
  }
  static #_ = this.ɵfac = function ValidacionService_Factory(t) {
    return new (t || ValidacionService)(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpClient));
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineInjectable"]({
    token: ValidacionService,
    factory: ValidacionService.ɵfac,
    providedIn: 'root'
  });
}

/***/ }),

/***/ 64148:
/*!******************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm/internal/operators/timeout.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TimeoutError: () => (/* binding */ TimeoutError),
/* harmony export */   timeout: () => (/* binding */ timeout)
/* harmony export */ });
/* harmony import */ var _scheduler_async__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../scheduler/async */ 97777);
/* harmony import */ var _util_isDate__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/isDate */ 38442);
/* harmony import */ var _util_lift__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util/lift */ 34114);
/* harmony import */ var _observable_innerFrom__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../observable/innerFrom */ 60384);
/* harmony import */ var _util_createErrorClass__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/createErrorClass */ 81566);
/* harmony import */ var _OperatorSubscriber__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./OperatorSubscriber */ 35678);
/* harmony import */ var _util_executeSchedule__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../util/executeSchedule */ 29701);







const TimeoutError = (0,_util_createErrorClass__WEBPACK_IMPORTED_MODULE_0__.createErrorClass)(_super => function TimeoutErrorImpl(info = null) {
  _super(this);
  this.message = 'Timeout has occurred';
  this.name = 'TimeoutError';
  this.info = info;
});
function timeout(config, schedulerArg) {
  const {
    first,
    each,
    with: _with = timeoutErrorFactory,
    scheduler = schedulerArg !== null && schedulerArg !== void 0 ? schedulerArg : _scheduler_async__WEBPACK_IMPORTED_MODULE_1__.asyncScheduler,
    meta = null
  } = (0,_util_isDate__WEBPACK_IMPORTED_MODULE_2__.isValidDate)(config) ? {
    first: config
  } : typeof config === 'number' ? {
    each: config
  } : config;
  if (first == null && each == null) {
    throw new TypeError('No timeout provided.');
  }
  return (0,_util_lift__WEBPACK_IMPORTED_MODULE_3__.operate)((source, subscriber) => {
    let originalSourceSubscription;
    let timerSubscription;
    let lastValue = null;
    let seen = 0;
    const startTimer = delay => {
      timerSubscription = (0,_util_executeSchedule__WEBPACK_IMPORTED_MODULE_4__.executeSchedule)(subscriber, scheduler, () => {
        try {
          originalSourceSubscription.unsubscribe();
          (0,_observable_innerFrom__WEBPACK_IMPORTED_MODULE_5__.innerFrom)(_with({
            meta,
            lastValue,
            seen
          })).subscribe(subscriber);
        } catch (err) {
          subscriber.error(err);
        }
      }, delay);
    };
    originalSourceSubscription = source.subscribe((0,_OperatorSubscriber__WEBPACK_IMPORTED_MODULE_6__.createOperatorSubscriber)(subscriber, value => {
      timerSubscription === null || timerSubscription === void 0 ? void 0 : timerSubscription.unsubscribe();
      seen++;
      subscriber.next(lastValue = value);
      each > 0 && startTimer(each);
    }, undefined, undefined, () => {
      if (!(timerSubscription === null || timerSubscription === void 0 ? void 0 : timerSubscription.closed)) {
        timerSubscription === null || timerSubscription === void 0 ? void 0 : timerSubscription.unsubscribe();
      }
      lastValue = null;
    }));
    !seen && startTimer(first != null ? typeof first === 'number' ? first : +first - scheduler.now() : each);
  });
}
function timeoutErrorFactory(info) {
  throw new TimeoutError(info);
}

/***/ })

}]);
//# sourceMappingURL=src_app_pages_mesa-control_validacion_validacion_component_ts.js.map