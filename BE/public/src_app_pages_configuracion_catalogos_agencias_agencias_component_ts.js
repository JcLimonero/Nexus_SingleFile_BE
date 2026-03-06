"use strict";
(self["webpackChunkvex"] = self["webpackChunkvex"] || []).push([["src_app_pages_configuracion_catalogos_agencias_agencias_component_ts"],{

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

/***/ 11748:
/*!*************************************************************************************************************!*\
  !*** ./src/app/pages/configuracion/catalogos/agencias/agencia-edit-dialog/agencia-edit-dialog.component.ts ***!
  \*************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AgenciaEditDialogComponent: () => (/* binding */ AgenciaEditDialogComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ 28849);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/dialog */ 17401);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/form-field */ 51333);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/input */ 10026);
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/select */ 96355);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/snack-bar */ 49409);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/progress-spinner */ 33910);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _core_services_agency_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../core/services/agency.service */ 92883);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/core */ 55309);























function AgenciaEditDialogComponent_mat_error_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " El nombre es requerido ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function AgenciaEditDialogComponent_mat_error_15_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " El nombre debe tener al menos 3 caracteres ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function AgenciaEditDialogComponent_mat_error_22_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " El c\u00F3digo es requerido ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function AgenciaEditDialogComponent_mat_error_23_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " El c\u00F3digo debe tener al menos 1 car\u00E1cter ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function AgenciaEditDialogComponent_div_34_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 17)(1, "h3", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "Informaci\u00F3n del Sistema");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "div", 19)(4, "div")(5, "span", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, "ID:");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "span", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "div")(10, "span", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](11, "\u00DAltimo Usuario:");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "span", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "div")(15, "span", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](16, "Fecha Registro:");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](17, "span", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](19, "div")(20, "span", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](21, "\u00DAltima Actualizaci\u00F3n:");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](22, "span", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](23);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r4.data.agencia.Id);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r4.data.agencia.LastUserUpdateName || "N/A");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r4.data.agencia.RegistrationDate || "N/A");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r4.data.agencia.UpdateDate || "N/A");
  }
}
function AgenciaEditDialogComponent_mat_spinner_39_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "mat-spinner", 23);
  }
}
function AgenciaEditDialogComponent_mat_icon_40_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r6.data.mode === "edit" ? "save" : "add");
  }
}
class AgenciaEditDialogComponent {
  constructor(fb, agencyService, snackBar, dialogRef, data) {
    this.fb = fb;
    this.agencyService = agencyService;
    this.snackBar = snackBar;
    this.dialogRef = dialogRef;
    this.data = data;
    this.loading = false;
    this.initializeForm();
  }
  ngOnInit() {
    if (this.data.mode === 'edit') {
      this.populateForm();
    }
  }
  initializeForm() {
    this.agenciaForm = this.fb.group({
      Name: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.minLength(3)]],
      IdAgency: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.minLength(1)]],
      Enabled: ['1', _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required]
    });
  }
  populateForm() {
    if (this.data.agencia) {
      this.agenciaForm.patchValue({
        Name: this.data.agencia.Name,
        IdAgency: this.data.agencia.IdAgency,
        Enabled: this.data.agencia.Enabled
      });
    }
  }
  onSubmit() {
    if (this.agenciaForm.valid) {
      this.loading = true;
      if (this.data.mode === 'edit') {
        this.updateAgencia();
      } else {
        this.createAgencia();
      }
    } else {
      this.markFormGroupTouched();
    }
  }
  updateAgencia() {
    const updateData = {
      Id: this.data.agencia.Id,
      ...this.agenciaForm.value
    };
    this.agencyService.updateAgency(Number(updateData.Id), updateData).subscribe({
      next: response => {
        this.loading = false;
        if (response.success) {
          this.snackBar.open('Agencia actualizada exitosamente', 'Éxito', {
            duration: 3000
          });
          this.dialogRef.close(true);
        } else {
          this.snackBar.open(response.message || 'Error al actualizar agencia', 'Error', {
            duration: 3000
          });
        }
      },
      error: error => {
        this.loading = false;
        this.snackBar.open('Error de conexión al actualizar agencia', 'Error', {
          duration: 3000
        });
      }
    });
  }
  createAgencia() {
    const createData = this.agenciaForm.value;
    this.agencyService.createAgency(createData).subscribe({
      next: response => {
        this.loading = false;
        if (response.success) {
          this.snackBar.open('Agencia creada exitosamente', 'Éxito', {
            duration: 3000
          });
          this.dialogRef.close(true);
        } else {
          this.snackBar.open(response.message || 'Error al crear agencia', 'Error', {
            duration: 3000
          });
        }
      },
      error: error => {
        this.loading = false;
        this.snackBar.open('Error de conexión al crear agencia', 'Error', {
          duration: 3000
        });
      }
    });
  }
  markFormGroupTouched() {
    Object.keys(this.agenciaForm.controls).forEach(key => {
      const control = this.agenciaForm.get(key);
      control?.markAsTouched();
    });
  }
  onCancel() {
    this.dialogRef.close(false);
  }
  static #_ = this.ɵfac = function AgenciaEditDialogComponent_Factory(t) {
    return new (t || AgenciaEditDialogComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_core_services_agency_service__WEBPACK_IMPORTED_MODULE_0__.AgencyService), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_3__.MatSnackBar), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_4__.MatDialogRef), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_4__.MAT_DIALOG_DATA));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: AgenciaEditDialogComponent,
    selectors: [["app-agencia-edit-dialog"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵStandaloneFeature"]],
    decls: 42,
    vars: 12,
    consts: [[1, "p-6", "min-w-[500px]"], [1, "flex", "items-center", "justify-between", "mb-6"], [1, "text-2xl", "font-bold", "text-gray-900"], ["mat-icon-button", "", "matTooltip", "Cerrar", 3, "click"], [1, "space-y-4", 3, "formGroup", "ngSubmit"], ["appearance", "outline", 1, "w-full"], ["matInput", "", "formControlName", "Name", "placeholder", "Ej: HONDA GALERIAS", "maxlength", "100"], [4, "ngIf"], ["matInput", "", "formControlName", "IdAgency", "placeholder", "Ej: 10017", "maxlength", "20"], ["formControlName", "Enabled"], ["value", "1"], ["value", "0"], ["class", "bg-gray-50 p-4 rounded-lg", 4, "ngIf"], [1, "flex", "justify-end", "space-x-3", "pt-4", "border-t"], ["type", "button", "mat-button", "", 3, "disabled", "click"], ["type", "submit", "mat-raised-button", "", "color", "primary", 3, "disabled"], ["diameter", "20", "class", "mr-2", 4, "ngIf"], [1, "bg-gray-50", "p-4", "rounded-lg"], [1, "text-sm", "font-medium", "text-gray-700", "mb-2"], [1, "grid", "grid-cols-2", "gap-4", "text-sm"], [1, "text-gray-500"], [1, "ml-2", "font-mono"], [1, "ml-2"], ["diameter", "20", 1, "mr-2"]],
    template: function AgenciaEditDialogComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h2", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "button", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function AgenciaEditDialogComponent_Template_button_click_4_listener() {
          return ctx.onCancel();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, "close");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "form", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngSubmit", function AgenciaEditDialogComponent_Template_form_ngSubmit_7_listener() {
          return ctx.onSubmit();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "mat-form-field", 5)(9, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](10, "Nombre de la Agencia");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](11, "input", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "mat-hint");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](13, "Nombre completo de la agencia");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](14, AgenciaEditDialogComponent_mat_error_14_Template, 2, 0, "mat-error", 7)(15, AgenciaEditDialogComponent_mat_error_15_Template, 2, 0, "mat-error", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](16, "mat-form-field", 5)(17, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](18, "Nd de Agencia");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](19, "input", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](20, "mat-hint");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](21, "C\u00F3digo \u00FAnico de identificaci\u00F3n");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](22, AgenciaEditDialogComponent_mat_error_22_Template, 2, 0, "mat-error", 7)(23, AgenciaEditDialogComponent_mat_error_23_Template, 2, 0, "mat-error", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](24, "mat-form-field", 5)(25, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](26, "Estado");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](27, "mat-select", 9)(28, "mat-option", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](29, "Activo");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](30, "mat-option", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](31, "Inactivo");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](32, "mat-hint");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](33, "Estado actual de la agencia");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](34, AgenciaEditDialogComponent_div_34_Template, 24, 4, "div", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](35, "div", 13)(36, "button", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function AgenciaEditDialogComponent_Template_button_click_36_listener() {
          return ctx.onCancel();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](37, " Cancelar ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](38, "button", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](39, AgenciaEditDialogComponent_mat_spinner_39_Template, 1, 0, "mat-spinner", 16)(40, AgenciaEditDialogComponent_mat_icon_40_Template, 2, 1, "mat-icon", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](41);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
      }
      if (rf & 2) {
        let tmp_2_0;
        let tmp_3_0;
        let tmp_4_0;
        let tmp_5_0;
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx.data.mode === "edit" ? "Editar Agencia" : "Nueva Agencia", " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("formGroup", ctx.agenciaForm);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", (tmp_2_0 = ctx.agenciaForm.get("Name")) == null ? null : tmp_2_0.hasError("required"));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", (tmp_3_0 = ctx.agenciaForm.get("Name")) == null ? null : tmp_3_0.hasError("minlength"));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", (tmp_4_0 = ctx.agenciaForm.get("IdAgency")) == null ? null : tmp_4_0.hasError("required"));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", (tmp_5_0 = ctx.agenciaForm.get("IdAgency")) == null ? null : tmp_5_0.hasError("minlength"));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.data.mode === "edit");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", ctx.agenciaForm.invalid || ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx.data.mode === "edit" ? "Guardar Cambios" : "Crear Agencia", " ");
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_5__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.MaxLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormControlName, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_4__.MatDialogModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__.MatFormFieldModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__.MatLabel, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__.MatHint, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__.MatError, _angular_material_input__WEBPACK_IMPORTED_MODULE_7__.MatInputModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_7__.MatInput, _angular_material_select__WEBPACK_IMPORTED_MODULE_8__.MatSelectModule, _angular_material_select__WEBPACK_IMPORTED_MODULE_8__.MatSelect, _angular_material_core__WEBPACK_IMPORTED_MODULE_9__.MatOption, _angular_material_button__WEBPACK_IMPORTED_MODULE_10__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_10__.MatButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_10__.MatIconButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_11__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_11__.MatIcon, _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_3__.MatSnackBarModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_12__.MatProgressSpinnerModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_12__.MatProgressSpinner],
    encapsulation: 2
  });
}

/***/ }),

/***/ 12065:
/*!******************************************************************************!*\
  !*** ./src/app/pages/configuracion/catalogos/agencias/agencias.component.ts ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AgenciasComponent: () => (/* binding */ AgenciasComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/forms */ 28849);
/* harmony import */ var _angular_material_table__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/table */ 46798);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/dialog */ 17401);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/form-field */ 51333);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/input */ 10026);
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/select */ 96355);
/* harmony import */ var _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/material/checkbox */ 56658);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/snack-bar */ 49409);
/* harmony import */ var _angular_material_paginator__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/paginator */ 39687);
/* harmony import */ var _angular_material_sort__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/sort */ 87963);
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/material/tooltip */ 60702);
/* harmony import */ var _angular_material_chips__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/material/chips */ 21757);
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/material/card */ 18497);
/* harmony import */ var _angular_material_divider__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @angular/material/divider */ 69400);
/* harmony import */ var _agencia_edit_dialog_agencia_edit_dialog_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./agencia-edit-dialog/agencia-edit-dialog.component */ 11748);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _core_services_agency_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../core/services/agency.service */ 92883);
/* harmony import */ var _core_services_auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../core/services/auth.service */ 90304);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material/core */ 55309);



































function AgenciasComponent_th_43_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "th", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " ID ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function AgenciasComponent_td_44_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "td", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const agencia_r12 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", agencia_r12.Id, " ");
  }
}
function AgenciasComponent_th_46_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "th", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " C\u00F3digo ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function AgenciasComponent_td_47_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "td", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const agencia_r13 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", agencia_r13.IdAgency, " ");
  }
}
function AgenciasComponent_th_49_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "th", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Nombre ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function AgenciasComponent_td_50_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "td", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const agencia_r14 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", agencia_r14.Name, " ");
  }
}
function AgenciasComponent_th_52_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "th", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Estado ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function AgenciasComponent_td_53_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "td", 45)(1, "span", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const agencia_r15 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngClass", agencia_r15.Enabled === "1" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", agencia_r15.Enabled === "1" ? "Activa" : "Inactiva", " ");
  }
}
function AgenciasComponent_th_55_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "th", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Acciones ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function AgenciasComponent_td_56_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "td", 48)(1, "div", 49)(2, "button", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function AgenciasComponent_td_56_Template_button_click_2_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r18);
      const agencia_r16 = restoredCtx.$implicit;
      const ctx_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r17.openEditDialog(agencia_r16));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "mat-icon", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](4, "edit");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "button", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function AgenciasComponent_td_56_Template_button_click_5_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r18);
      const agencia_r16 = restoredCtx.$implicit;
      const ctx_r19 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r19.deleteAgencia(agencia_r16));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](6, "mat-icon", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](7, "delete");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()();
  }
}
function AgenciasComponent_tr_57_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](0, "tr", 53);
  }
}
function AgenciasComponent_tr_58_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](0, "tr", 54);
  }
}
const _c0 = () => [10, 25, 50, 100];
class AgenciasComponent {
  constructor(agencyService, authService, dialog, snackBar, cdr) {
    this.agencyService = agencyService;
    this.authService = authService;
    this.dialog = dialog;
    this.snackBar = snackBar;
    this.cdr = cdr;
    this.agencias = [];
    this.dataSource = new _angular_material_table__WEBPACK_IMPORTED_MODULE_4__.MatTableDataSource([]);
    this.totalAgencias = 0;
    this.searchTerm = '';
    this.statusFilter = '';
    this.displayedColumns = ['Id', 'IdAgency', 'Name', 'Enabled', 'acciones'];
    this.loading = false;
  }
  ngOnInit() {
    // Verificar autenticación antes de cargar datos
    if (this.checkAuthentication()) {
      this.loadAgencias();
    }
  }
  /**
   * Verificar si el usuario está autenticado
   */
  checkAuthentication() {
    const isAuthenticated = this.authService.isAuthenticated();
    const token = this.authService.getToken();
    if (!isAuthenticated || !token) {
      this.snackBar.open('Debes iniciar sesión para acceder a esta funcionalidad', 'Error', {
        duration: 5000
      });
      // Aquí podrías redirigir al login
      // this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // Configurar filtro personalizado
    this.dataSource.filterPredicate = (data, filter) => {
      const searchTerm = filter.toLowerCase();
      const matches = data.Name.toLowerCase().includes(searchTerm) || (data.IdAgency ? data.IdAgency.toLowerCase().includes(searchTerm) : false);
      return matches;
    };
  }
  loadAgencias() {
    this.loading = true;
    this.agencyService.getAgencies().subscribe({
      next: response => {
        if (response.success && response.data?.agencies) {
          // Convertir a array si no lo es
          const agenciasArray = Array.isArray(response.data.agencies) ? response.data.agencies : Object.values(response.data.agencies);
          this.agencias = agenciasArray;
          this.totalAgencias = response.data.total;
          // Asignar al DataSource usando setData o creando un nuevo DataSource
          this.dataSource = new _angular_material_table__WEBPACK_IMPORTED_MODULE_4__.MatTableDataSource(this.agencias);
          // Reconfigurar paginator y sort
          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          }
          if (this.sort) {
            this.dataSource.sort = this.sort;
          }
          this.applyFilter();
        } else {
          this.snackBar.open(response.message || 'Error al cargar agencias', 'Error', {
            duration: 3000
          });
        }
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: error => {
        this.snackBar.open('Error de conexión al cargar agencias', 'Error', {
          duration: 3000
        });
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }
  applyFilter() {
    // Combinar filtros
    let filterValue = '';
    if (this.searchTerm) {
      filterValue = this.searchTerm;
    }
    // Aplicar filtro de búsqueda
    this.dataSource.filter = filterValue.trim().toLowerCase();
    // Aplicar filtro de estado si existe
    if (this.statusFilter !== '') {
      const status = this.statusFilter === 'true' ? 1 : 0;
      this.dataSource.data = this.agencias.filter(agencia => agencia.Enabled === status && (filterValue === '' || agencia.Name.toLowerCase().includes(filterValue.toLowerCase()) || agencia.IdAgency && agencia.IdAgency.toLowerCase().includes(filterValue.toLowerCase())));
    } else {
      this.dataSource.data = this.agencias;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    // Reset paginator to first page
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  refreshData() {
    // Mostrar mensaje de recarga
    this.snackBar.open('Recargando datos...', 'Info', {
      duration: 1000
    });
    // Recargar datos
    this.loadAgencias();
  }
  /**
   * Limpiar todos los filtros aplicados
   */
  clearFilters() {
    // Verificar si hay filtros activos
    const hasActiveFilters = this.searchTerm || this.statusFilter;
    if (!hasActiveFilters) {
      this.snackBar.open('No hay filtros activos para limpiar', 'Info', {
        duration: 2000
      });
      return;
    }
    // Limpiar filtros
    this.searchTerm = '';
    this.statusFilter = '';
    // Resetear la tabla a su estado original
    this.dataSource.data = this.agencias;
    this.dataSource.filter = '';
    // Resetear paginador a la primera página
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    // Mostrar mensaje de confirmación
    this.snackBar.open('Filtros limpiados exitosamente', 'Éxito', {
      duration: 2000
    });
    // Forzar detección de cambios
    this.cdr.markForCheck();
  }
  /**
   * Verificar si hay filtros activos
   */
  hasActiveFilters() {
    return !!(this.searchTerm || this.statusFilter);
  }
  /**
   * Recargar datos con confirmación
   */
  refreshDataWithConfirmation() {
    if (confirm('¿Estás seguro de que quieres recargar los datos? Esto sobrescribirá cualquier cambio no guardado.')) {
      this.refreshData();
    }
  }
  /**
   * Recargar datos silenciosamente (sin mensajes)
   */
  refreshDataSilent() {
    this.loadAgencias();
  }
  openCreateDialog() {
    const dialogData = {
      agencia: {},
      mode: 'create'
    };
    const dialogRef = this.dialog.open(_agencia_edit_dialog_agencia_edit_dialog_component__WEBPACK_IMPORTED_MODULE_0__.AgenciaEditDialogComponent, {
      width: '600px',
      data: dialogData,
      disableClose: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshData();
      }
    });
  }
  openEditDialog(agencia) {
    const dialogData = {
      agencia: agencia,
      mode: 'edit'
    };
    const dialogRef = this.dialog.open(_agencia_edit_dialog_agencia_edit_dialog_component__WEBPACK_IMPORTED_MODULE_0__.AgenciaEditDialogComponent, {
      width: '600px',
      data: dialogData,
      disableClose: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshData();
      }
    });
  }
  deleteAgencia(agencia) {
    if (confirm(`¿Estás seguro de que quieres eliminar PERMANENTEMENTE la agencia "${agencia.Name}"?\n\nEsta acción no se puede deshacer.`)) {
      console.log('🗑️ Intentando eliminar agencia:', agencia);
      this.agencyService.deleteAgency(Number(agencia.Id), true).subscribe({
        next: response => {
          console.log('📡 Respuesta del API:', response);
          if (response.success) {
            console.log('✅ Agencia eliminada exitosamente');
            this.agencias = this.agencias.filter(a => a.Id !== agencia.Id);
            this.applyFilter();
            this.snackBar.open('Agencia eliminada exitosamente', 'Éxito', {
              duration: 2000
            });
          } else {
            console.log('❌ Error en la respuesta:', response.message);
            this.snackBar.open(response.message || 'Error al eliminar agencia', 'Error', {
              duration: 3000
            });
          }
        },
        error: error => {
          console.log('💥 Error en la petición:', error);
          this.snackBar.open('Error al eliminar agencia', 'Error', {
            duration: 3000
          });
        }
      });
    }
  }
  getPageRange() {
    if (!this.paginator || this.dataSource.filteredData.length === 0) {
      return '0-0';
    }
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize + 1;
    const endIndex = Math.min(startIndex + this.paginator.pageSize - 1, this.dataSource.filteredData.length);
    return `${startIndex}-${endIndex}`;
  }
  static #_ = this.ɵfac = function AgenciasComponent_Factory(t) {
    return new (t || AgenciasComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_core_services_agency_service__WEBPACK_IMPORTED_MODULE_1__.AgencyService), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_core_services_auth_service__WEBPACK_IMPORTED_MODULE_2__.AuthService), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_5__.MatDialog), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_6__.MatSnackBar), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_3__.ChangeDetectorRef));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
    type: AgenciasComponent,
    selectors: [["app-agencias"]],
    viewQuery: function AgenciasComponent_Query(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵviewQuery"](_angular_material_paginator__WEBPACK_IMPORTED_MODULE_7__.MatPaginator, 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵviewQuery"](_angular_material_sort__WEBPACK_IMPORTED_MODULE_8__.MatSort, 5);
      }
      if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵloadQuery"]()) && (ctx.paginator = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵloadQuery"]()) && (ctx.sort = _t.first);
      }
    },
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵStandaloneFeature"]],
    decls: 62,
    vars: 16,
    consts: [[1, "p-6"], [1, "flex", "items-center", "justify-between", "mb-4"], [1, "text-3xl", "font-bold", "text-gray-900"], [1, "text-gray-600", "mt-1"], ["mat-raised-button", "", "color", "primary", 1, "flex", "items-center", "gap-2", 3, "click"], [1, "bg-white", "rounded-lg", "shadow-sm", "border", "p-4", "mb-6"], [1, "flex", "items-center", "gap-3"], ["mat-stroked-button", "", "color", "warn", "matTooltip", "Limpiar filtros", 1, "flex", "items-center", "gap-2", 3, "disabled", "click"], ["mat-stroked-button", "", "color", "accent", "matTooltip", "Recargar datos", 1, "flex", "items-center", "gap-2", 3, "disabled", "click"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-4"], ["appearance", "outline", 1, "w-full"], ["matInput", "", "placeholder", "Buscar por nombre o c\u00F3digo...", "maxlength", "100", 3, "ngModel", "ngModelChange"], ["matSuffix", ""], [3, "ngModel", "ngModelChange"], ["value", ""], ["value", "1"], ["value", "0"], [1, "bg-white", "rounded-lg", "shadow-sm", "border", "overflow-hidden"], ["mat-table", "", "matSort", "", 1, "w-full", 2, "line-height", "1", 3, "dataSource"], ["matColumnDef", "Id"], ["mat-header-cell", "", "mat-sort-header", "", "class", "w-16 text-center py-1 bg-gray-50 text-xs font-medium text-gray-700", 4, "matHeaderCellDef"], ["mat-cell", "", "class", "text-xs font-mono text-gray-600 py-0", 4, "matCellDef"], ["matColumnDef", "IdAgency"], ["mat-header-cell", "", "mat-sort-header", "", "class", "w-32 py-1 bg-gray-50 text-xs font-medium text-gray-700", 4, "matHeaderCellDef"], ["mat-cell", "", "class", "px-1.5 py-0 rounded-full text-xs font-medium", 4, "matCellDef"], ["matColumnDef", "Name"], ["mat-header-cell", "", "mat-sort-header", "", "class", "min-w-0 flex-1 py-1 bg-gray-50 text-xs font-medium text-gray-700", 4, "matHeaderCellDef"], ["mat-cell", "", "class", "text-xs py-0", 4, "matCellDef"], ["matColumnDef", "Enabled"], ["mat-header-cell", "", "mat-sort-header", "", "class", "w-24 text-center py-1 bg-gray-50 text-xs font-medium text-gray-700", 4, "matHeaderCellDef"], ["mat-cell", "", "class", "text-center", 4, "matCellDef"], ["matColumnDef", "acciones"], ["mat-header-cell", "", "class", "w-28 text-center py-1 bg-gray-50 text-xs font-medium text-gray-700", 4, "matHeaderCellDef"], ["mat-cell", "", "class", "text-center py-0", 4, "matCellDef"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", "class", "!min-h-0 !h-8", 4, "matRowDef", "matRowDefColumns"], ["showFirstLastButtons", "", 1, "border-t", 3, "pageSizeOptions", "pageSize", "length"], [1, "mt-4", "text-sm", "text-gray-600", "text-center"], ["mat-header-cell", "", "mat-sort-header", "", 1, "w-16", "text-center", "py-1", "bg-gray-50", "text-xs", "font-medium", "text-gray-700"], ["mat-cell", "", 1, "text-xs", "font-mono", "text-gray-600", "py-0"], ["mat-header-cell", "", "mat-sort-header", "", 1, "w-32", "py-1", "bg-gray-50", "text-xs", "font-medium", "text-gray-700"], ["mat-cell", "", 1, "px-1.5", "py-0", "rounded-full", "text-xs", "font-medium"], ["mat-header-cell", "", "mat-sort-header", "", 1, "min-w-0", "flex-1", "py-1", "bg-gray-50", "text-xs", "font-medium", "text-gray-700"], ["mat-cell", "", 1, "text-xs", "py-0"], ["mat-header-cell", "", "mat-sort-header", "", 1, "w-24", "text-center", "py-1", "bg-gray-50", "text-xs", "font-medium", "text-gray-700"], ["mat-cell", "", 1, "text-center"], [1, "px-1.5", "py-0.5", "rounded-full", "text-xs", "font-medium", 3, "ngClass"], ["mat-header-cell", "", 1, "w-28", "text-center", "py-1", "bg-gray-50", "text-xs", "font-medium", "text-gray-700"], ["mat-cell", "", 1, "text-center", "py-0"], [1, "flex", "gap-0.5", "justify-center", "items-center"], ["mat-icon-button", "", "color", "primary", "matTooltip", "Editar", 1, "!w-6", "!h-6", "!min-h-6", "!p-0", 3, "click"], [1, "!text-sm"], ["mat-icon-button", "", "color", "warn", "matTooltip", "Eliminar", 1, "!w-6", "!h-6", "!min-h-6", "!p-0", 3, "click"], ["mat-header-row", ""], ["mat-row", "", 1, "!min-h-0", "!h-8"]],
    template: function AgenciasComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div")(3, "h1", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](4, "Gesti\u00F3n de Agencias");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "p", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](6, "Administra las agencias del sistema");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](7, "button", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function AgenciasComponent_Template_button_click_7_listener() {
          return ctx.openCreateDialog();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](8, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](9, "add_circle");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](10, " Nueva Agencia ");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](11, "div", 5)(12, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](13, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](14, "div", 6)(15, "button", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function AgenciasComponent_Template_button_click_15_listener() {
          return ctx.clearFilters();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](16, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](17, "clear_all");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](18, " Limpiar Filtros ");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](19, "button", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function AgenciasComponent_Template_button_click_19_listener() {
          return ctx.refreshData();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](20, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](21, "refresh");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](22, " Recargar ");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](23, "div", 9)(24, "mat-form-field", 10)(25, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](26, "Buscar agencias");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](27, "input", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("ngModelChange", function AgenciasComponent_Template_input_ngModelChange_27_listener($event) {
          return ctx.searchTerm = $event;
        })("ngModelChange", function AgenciasComponent_Template_input_ngModelChange_27_listener() {
          return ctx.applyFilter();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](28, "mat-icon", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](29, "\uD83D\uDD0D");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](30, "mat-form-field", 10)(31, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](32, "Estado");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](33, "mat-select", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("ngModelChange", function AgenciasComponent_Template_mat_select_ngModelChange_33_listener($event) {
          return ctx.statusFilter = $event;
        })("ngModelChange", function AgenciasComponent_Template_mat_select_ngModelChange_33_listener() {
          return ctx.applyFilter();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](34, "mat-option", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](35, "Todos");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](36, "mat-option", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](37, "Activas");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](38, "mat-option", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](39, "Inactivas");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](40, "div", 17)(41, "table", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerStart"](42, 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](43, AgenciasComponent_th_43_Template, 2, 0, "th", 20)(44, AgenciasComponent_td_44_Template, 2, 1, "td", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerStart"](45, 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](46, AgenciasComponent_th_46_Template, 2, 0, "th", 23)(47, AgenciasComponent_td_47_Template, 2, 1, "td", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerStart"](48, 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](49, AgenciasComponent_th_49_Template, 2, 0, "th", 26)(50, AgenciasComponent_td_50_Template, 2, 1, "td", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerStart"](51, 28);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](52, AgenciasComponent_th_52_Template, 2, 0, "th", 29)(53, AgenciasComponent_td_53_Template, 3, 2, "td", 30);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerStart"](54, 31);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](55, AgenciasComponent_th_55_Template, 2, 0, "th", 32)(56, AgenciasComponent_td_56_Template, 8, 0, "td", 33);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](57, AgenciasComponent_tr_57_Template, 1, 0, "tr", 34)(58, AgenciasComponent_tr_58_Template, 1, 0, "tr", 35);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](59, "mat-paginator", 36);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](60, "div", 37);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](61);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](15);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("disabled", !ctx.searchTerm && !ctx.statusFilter);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("disabled", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵclassProp"]("animate-spin", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngModel", ctx.searchTerm);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngModel", ctx.statusFilter);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("dataSource", ctx.dataSource);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](16);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("matHeaderRowDef", ctx.displayedColumns);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("matRowDefColumns", ctx.displayedColumns);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("pageSizeOptions", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpureFunction0"](15, _c0))("pageSize", 10)("length", ctx.dataSource.filteredData.length);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate3"](" Mostrando ", ctx.getPageRange(), " de ", ctx.dataSource.filteredData.length, " agencias visibles (", ctx.agencias.length, " total) ");
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_9__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_9__.NgClass, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.MaxLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.NgModel, _angular_material_table__WEBPACK_IMPORTED_MODULE_4__.MatTableModule, _angular_material_table__WEBPACK_IMPORTED_MODULE_4__.MatTable, _angular_material_table__WEBPACK_IMPORTED_MODULE_4__.MatHeaderCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_4__.MatHeaderRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_4__.MatColumnDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_4__.MatCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_4__.MatRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_4__.MatHeaderCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_4__.MatCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_4__.MatHeaderRow, _angular_material_table__WEBPACK_IMPORTED_MODULE_4__.MatRow, _angular_material_button__WEBPACK_IMPORTED_MODULE_11__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_11__.MatButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_11__.MatIconButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_12__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_12__.MatIcon, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_5__.MatDialogModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_13__.MatFormFieldModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_13__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_13__.MatLabel, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_13__.MatSuffix, _angular_material_input__WEBPACK_IMPORTED_MODULE_14__.MatInputModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_14__.MatInput, _angular_material_select__WEBPACK_IMPORTED_MODULE_15__.MatSelectModule, _angular_material_select__WEBPACK_IMPORTED_MODULE_15__.MatSelect, _angular_material_core__WEBPACK_IMPORTED_MODULE_16__.MatOption, _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_17__.MatCheckboxModule, _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_6__.MatSnackBarModule, _angular_material_paginator__WEBPACK_IMPORTED_MODULE_7__.MatPaginatorModule, _angular_material_paginator__WEBPACK_IMPORTED_MODULE_7__.MatPaginator, _angular_material_sort__WEBPACK_IMPORTED_MODULE_8__.MatSortModule, _angular_material_sort__WEBPACK_IMPORTED_MODULE_8__.MatSort, _angular_material_sort__WEBPACK_IMPORTED_MODULE_8__.MatSortHeader, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_18__.MatTooltipModule, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_18__.MatTooltip, _angular_material_chips__WEBPACK_IMPORTED_MODULE_19__.MatChipsModule, _angular_material_card__WEBPACK_IMPORTED_MODULE_20__.MatCardModule, _angular_material_divider__WEBPACK_IMPORTED_MODULE_21__.MatDividerModule],
    encapsulation: 2
  });
}

/***/ })

}]);
//# sourceMappingURL=src_app_pages_configuracion_catalogos_agencias_agencias_component_ts.js.map