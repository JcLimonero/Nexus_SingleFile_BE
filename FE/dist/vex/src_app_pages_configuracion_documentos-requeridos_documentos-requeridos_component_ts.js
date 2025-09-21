"use strict";
(self["webpackChunkvex"] = self["webpackChunkvex"] || []).push([["src_app_pages_configuracion_documentos-requeridos_documentos-requeridos_component_ts"],{

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

/***/ 13146:
/*!**************************************************************!*\
  !*** ./src/app/core/services/documento-requerido.service.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DocumentoRequeridoService: () => (/* binding */ DocumentoRequeridoService)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ 54860);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _api_base_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api-base.service */ 14461);




class DocumentoRequeridoService {
  constructor(http, apiBaseService) {
    this.http = http;
    this.apiBaseService = apiBaseService;
    this.API_URL = 'documento-requerido';
  }
  /**
   * Obtener todos los documentos requeridos con filtros y paginación
   */
  getDocumentosRequeridos(filters) {
    let httpParams = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpParams();
    if (filters) {
      if (filters.IdProcess) httpParams = httpParams.set('IdProcess', filters.IdProcess);
      if (filters.IdAgency) httpParams = httpParams.set('IdAgency', filters.IdAgency);
      if (filters.IdCostumerType) httpParams = httpParams.set('IdCostumerType', filters.IdCostumerType);
      if (filters.IdOperationType) httpParams = httpParams.set('IdOperationType', filters.IdOperationType);
      if (filters.IdDocumentType) httpParams = httpParams.set('IdDocumentType', filters.IdDocumentType);
      if (filters.Required !== undefined) httpParams = httpParams.set('Required', filters.Required.toString());
      if (filters.Enabled !== undefined) httpParams = httpParams.set('Enabled', filters.Enabled.toString());
      if (filters.limit) httpParams = httpParams.set('limit', filters.limit.toString());
      if (filters.offset) httpParams = httpParams.set('offset', filters.offset.toString());
      if (filters.sort_by) httpParams = httpParams.set('sort_by', filters.sort_by);
      if (filters.sort_order) httpParams = httpParams.set('sort_order', filters.sort_order);
    }
    const url = this.apiBaseService.buildApiUrl(this.API_URL);
    return this.http.get(url, {
      params: httpParams
    });
  }
  /**
   * Obtener un documento requerido por ID
   */
  getDocumentoRequeridoById(id) {
    const url = this.apiBaseService.buildApiUrl(`${this.API_URL}/${id}`);
    return this.http.get(url);
  }
  /**
   * Crear un nuevo documento requerido
   */
  createDocumentoRequerido(data) {
    const url = this.apiBaseService.buildApiUrl(this.API_URL);
    return this.http.post(url, data);
  }
  /**
   * Actualizar un documento requerido existente
   */
  updateDocumentoRequerido(id, data) {
    const url = this.apiBaseService.buildApiUrl(`${this.API_URL}/${id}`);
    return this.http.put(url, data);
  }
  /**
   * Eliminar un documento requerido
   */
  deleteDocumentoRequerido(id) {
    const url = this.apiBaseService.buildApiUrl(`${this.API_URL}/${id}`);
    return this.http.delete(url);
  }
  /**
   * Obtener estadísticas de documentos requeridos
   */
  getDocumentosRequeridosStats() {
    const url = this.apiBaseService.buildApiUrl(`${this.API_URL}/stats`);
    return this.http.get(url);
  }
  /**
   * Obtener documentos requeridos por configuración específica
   */
  getDocumentosByConfiguracion(idProcess, idAgency, idCostumerType, idOperationType) {
    const filters = {
      IdProcess: idProcess,
      IdAgency: idAgency,
      IdCostumerType: idCostumerType,
      IdOperationType: idOperationType,
      Enabled: true
    };
    return this.getDocumentosRequeridos(filters);
  }
  /**
   * Reordenar documentos requeridos
   */
  reorderDocumentosRequeridos(documentos) {
    const url = this.apiBaseService.buildApiUrl(`${this.API_URL}/reorder`);
    return this.http.put(url, {
      documentos
    });
  }
  /**
   * Duplicar configuración de documentos requeridos
   */
  duplicateConfiguracion(sourceConfig, targetConfig) {
    const url = this.apiBaseService.buildApiUrl(`${this.API_URL}/duplicate`);
    return this.http.post(url, {
      source: sourceConfig,
      target: targetConfig
    });
  }
  /**
   * Exportar configuración de documentos requeridos
   */
  exportConfiguracion(filters) {
    let httpParams = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpParams();
    if (filters) {
      if (filters.IdProcess) httpParams = httpParams.set('IdProcess', filters.IdProcess);
      if (filters.IdAgency) httpParams = httpParams.set('IdAgency', filters.IdAgency);
      if (filters.IdCostumerType) httpParams = httpParams.set('IdCostumerType', filters.IdCostumerType);
      if (filters.IdOperationType) httpParams = httpParams.set('IdOperationType', filters.IdOperationType);
    }
    const url = this.apiBaseService.buildApiUrl(`${this.API_URL}/export`);
    return this.http.get(url, {
      params: httpParams,
      responseType: 'blob'
    });
  }
  static #_ = this.ɵfac = function DocumentoRequeridoService_Factory(t) {
    return new (t || DocumentoRequeridoService)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpClient), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_api_base_service__WEBPACK_IMPORTED_MODULE_0__.ApiBaseService));
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
    token: DocumentoRequeridoService,
    factory: DocumentoRequeridoService.ɵfac,
    providedIn: 'root'
  });
}

/***/ }),

/***/ 95302:
/*!****************************************************************************************************************************************!*\
  !*** ./src/app/pages/configuracion/documentos-requeridos/documento-requerido-edit-dialog/documento-requerido-edit-dialog.component.ts ***!
  \****************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DocumentoRequeridoEditDialogComponent: () => (/* binding */ DocumentoRequeridoEditDialogComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/forms */ 28849);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/dialog */ 17401);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/snack-bar */ 49409);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/form-field */ 51333);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/input */ 10026);
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/select */ 96355);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/material/progress-spinner */ 33910);
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/material/tooltip */ 60702);
/* harmony import */ var _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/material/checkbox */ 56658);
/* harmony import */ var _angular_material_slide_toggle__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/material/slide-toggle */ 59293);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _core_services_documento_requerido_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../core/services/documento-requerido.service */ 13146);
/* harmony import */ var _core_services_proceso_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../core/services/proceso.service */ 16425);
/* harmony import */ var _core_services_agency_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../core/services/agency.service */ 92883);
/* harmony import */ var _core_services_costumer_type_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../core/services/costumer-type.service */ 12143);
/* harmony import */ var _core_services_tipo_operacion_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../core/services/tipo-operacion.service */ 15591);
/* harmony import */ var _core_services_document_type_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../core/services/document-type.service */ 5709);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material/core */ 55309);


































function DocumentoRequeridoEditDialogComponent_div_47_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](1, "mat-spinner", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](2, "span", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3, "Cargando tipos de documento...");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
  }
}
function DocumentoRequeridoEditDialogComponent_div_48_button_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "button", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function DocumentoRequeridoEditDialogComponent_div_48_button_12_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r17);
      const ctx_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r16.clearSearch());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](1, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2, "close");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
  }
}
function DocumentoRequeridoEditDialogComponent_div_48_mat_option_19_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "mat-option", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const phase_r18 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("value", phase_r18);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", phase_r18, " ");
  }
}
function DocumentoRequeridoEditDialogComponent_div_48_mat_option_26_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "mat-option", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const subPhase_r19 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("value", subPhase_r19);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", subPhase_r19, " ");
  }
}
function DocumentoRequeridoEditDialogComponent_div_48_button_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "button", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function DocumentoRequeridoEditDialogComponent_div_48_button_27_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r21);
      const ctx_r20 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r20.clearAllFilters());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](1, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2, "clear_all");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
  }
}
function DocumentoRequeridoEditDialogComponent_div_48_div_31_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 59)(1, "mat-icon", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2, "search_off");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](3, "p", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](4, "No se encontraron resultados");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](5, "p", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](6, "Intenta con otros t\u00E9rminos de b\u00FAsqueda");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
  }
}
function DocumentoRequeridoEditDialogComponent_div_48_div_32_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 59)(1, "mat-icon", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2, "description");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](3, "p", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](4, "No hay tipos de documento disponibles");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](5, "p", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](6, "Verifica la conexi\u00F3n con el servidor");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
  }
}
function DocumentoRequeridoEditDialogComponent_div_48_div_33_div_2_span_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "span", 73)(1, "mat-icon", 74);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2, "schedule");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const tipo_r23 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", tipo_r23.ProcessTypeName, " ");
  }
}
function DocumentoRequeridoEditDialogComponent_div_48_div_33_div_2_span_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "span", 75)(1, "mat-icon", 76);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2, "subdirectory_arrow_right");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const tipo_r23 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", tipo_r23.SubProcessName, " ");
  }
}
function DocumentoRequeridoEditDialogComponent_div_48_div_33_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r29 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 66)(1, "mat-checkbox", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("change", function DocumentoRequeridoEditDialogComponent_div_48_div_33_div_2_Template_mat_checkbox_change_1_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r29);
      const tipo_r23 = restoredCtx.$implicit;
      const ctx_r28 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r28.onDocumentTypeChange($event, tipo_r23.Id));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](2, "div", 68)(3, "div", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](5, "div", 70);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](6, DocumentoRequeridoEditDialogComponent_div_48_div_33_div_2_span_6_Template, 4, 1, "span", 71)(7, DocumentoRequeridoEditDialogComponent_div_48_div_33_div_2_span_7_Template, 4, 1, "span", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const tipo_r23 = ctx.$implicit;
    const ctx_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("value", tipo_r23.Id)("checked", ctx_r22.isDocumentTypeSelected(tipo_r23.Id));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](tipo_r23.Name);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", tipo_r23.ProcessTypeName);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", tipo_r23.SubProcessName);
  }
}
function DocumentoRequeridoEditDialogComponent_div_48_div_33_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 63)(1, "div", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](2, DocumentoRequeridoEditDialogComponent_div_48_div_33_div_2_Template, 8, 5, "div", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngForOf", ctx_r11.filteredTiposDocumento);
  }
}
function DocumentoRequeridoEditDialogComponent_div_48_div_34_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 77);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1, " Debes seleccionar al menos un tipo de documento ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
}
function DocumentoRequeridoEditDialogComponent_div_48_span_38_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "span", 78);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" (", ctx_r13.filteredTiposDocumento.length, " filtrados) ");
  }
}
function DocumentoRequeridoEditDialogComponent_div_48_span_39_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "span", 79);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1, " \u2022 Solo seleccionados ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
}
function DocumentoRequeridoEditDialogComponent_div_48_div_40_span_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r35 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "span", 85);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](2, "button", 86);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function DocumentoRequeridoEditDialogComponent_div_48_div_40_span_3_Template_button_click_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r35);
      const ctx_r34 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r34.clearSearch());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3, "\u00D7");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r30 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" \"", ctx_r30.searchTerm, "\" ");
  }
}
function DocumentoRequeridoEditDialogComponent_div_48_div_40_span_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r37 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "span", 87);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](2, "button", 88);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function DocumentoRequeridoEditDialogComponent_div_48_div_40_span_4_Template_button_click_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r37);
      const ctx_r36 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](3);
      ctx_r36.selectedPhase = "";
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r36.onPhaseChange(""));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3, "\u00D7");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r31 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", ctx_r31.selectedPhase, " ");
  }
}
function DocumentoRequeridoEditDialogComponent_div_48_div_40_span_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r39 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "span", 89);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](2, "button", 90);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function DocumentoRequeridoEditDialogComponent_div_48_div_40_span_5_Template_button_click_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r39);
      const ctx_r38 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](3);
      ctx_r38.selectedSubPhase = "";
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r38.onSubPhaseChange(""));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3, "\u00D7");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r32 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", ctx_r32.selectedSubPhase, " ");
  }
}
function DocumentoRequeridoEditDialogComponent_div_48_div_40_span_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r41 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "span", 87);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1, " Solo seleccionados ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](2, "button", 88);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function DocumentoRequeridoEditDialogComponent_div_48_div_40_span_6_Template_button_click_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r41);
      const ctx_r40 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r40.clearShowOnlySelectedFilter());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3, "\u00D7");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
  }
}
function DocumentoRequeridoEditDialogComponent_div_48_div_40_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 80)(1, "span", 81);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2, "Filtros:");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](3, DocumentoRequeridoEditDialogComponent_div_48_div_40_span_3_Template, 4, 1, "span", 82)(4, DocumentoRequeridoEditDialogComponent_div_48_div_40_span_4_Template, 4, 1, "span", 83)(5, DocumentoRequeridoEditDialogComponent_div_48_div_40_span_5_Template, 4, 1, "span", 84)(6, DocumentoRequeridoEditDialogComponent_div_48_div_40_span_6_Template, 4, 0, "span", 83);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r15.searchTerm);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r15.selectedPhase);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r15.selectedSubPhase);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r15.showOnlySelected);
  }
}
function DocumentoRequeridoEditDialogComponent_div_48_Template(rf, ctx) {
  if (rf & 1) {
    const _r43 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 32)(1, "div", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2, " Selecciona los tipos de documento requeridos: ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](3, "div", 34)(4, "div", 35)(5, "div", 36)(6, "mat-form-field", 37)(7, "mat-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](8, "Buscar");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](9, "input", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("ngModelChange", function DocumentoRequeridoEditDialogComponent_div_48_Template_input_ngModelChange_9_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r43);
      const ctx_r42 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r42.searchTerm = $event);
    })("ngModelChange", function DocumentoRequeridoEditDialogComponent_div_48_Template_input_ngModelChange_9_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r43);
      const ctx_r44 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r44.onSearchChange($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](10, "mat-icon", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](11, "search");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](12, DocumentoRequeridoEditDialogComponent_div_48_button_12_Template, 3, 0, "button", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](13, "mat-form-field", 41)(14, "mat-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](15, "Fase");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](16, "mat-select", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("ngModelChange", function DocumentoRequeridoEditDialogComponent_div_48_Template_mat_select_ngModelChange_16_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r43);
      const ctx_r45 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r45.selectedPhase = $event);
    })("ngModelChange", function DocumentoRequeridoEditDialogComponent_div_48_Template_mat_select_ngModelChange_16_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r43);
      const ctx_r46 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r46.onPhaseChange($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](17, "mat-option", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](18, "Todas");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](19, DocumentoRequeridoEditDialogComponent_div_48_mat_option_19_Template, 2, 2, "mat-option", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](20, "mat-form-field", 41)(21, "mat-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](22, "Subfase");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](23, "mat-select", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("ngModelChange", function DocumentoRequeridoEditDialogComponent_div_48_Template_mat_select_ngModelChange_23_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r43);
      const ctx_r47 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r47.selectedSubPhase = $event);
    })("ngModelChange", function DocumentoRequeridoEditDialogComponent_div_48_Template_mat_select_ngModelChange_23_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r43);
      const ctx_r48 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r48.onSubPhaseChange($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](24, "mat-option", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](25, "Todas");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](26, DocumentoRequeridoEditDialogComponent_div_48_mat_option_26_Template, 2, 2, "mat-option", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](27, DocumentoRequeridoEditDialogComponent_div_48_button_27_Template, 3, 0, "button", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](28, "div", 47)(29, "mat-slide-toggle", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("change", function DocumentoRequeridoEditDialogComponent_div_48_Template_mat_slide_toggle_change_29_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r43);
      const ctx_r49 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r49.onShowOnlySelectedChange($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](30, " Solo seleccionados ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](31, DocumentoRequeridoEditDialogComponent_div_48_div_31_Template, 7, 0, "div", 49)(32, DocumentoRequeridoEditDialogComponent_div_48_div_32_Template, 7, 0, "div", 49)(33, DocumentoRequeridoEditDialogComponent_div_48_div_33_Template, 3, 1, "div", 50)(34, DocumentoRequeridoEditDialogComponent_div_48_div_34_Template, 2, 0, "div", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](35, "div", 52)(36, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](37);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](38, DocumentoRequeridoEditDialogComponent_div_48_span_38_Template, 2, 1, "span", 53)(39, DocumentoRequeridoEditDialogComponent_div_48_span_39_Template, 2, 0, "span", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](40, DocumentoRequeridoEditDialogComponent_div_48_div_40_Template, 7, 4, "div", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    let tmp_12_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngModel", ctx_r1.searchTerm);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r1.searchTerm);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngModel", ctx_r1.selectedPhase);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngForOf", ctx_r1.availablePhases);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngModel", ctx_r1.selectedSubPhase)("disabled", !ctx_r1.selectedPhase);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngForOf", ctx_r1.availableSubPhases);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r1.hasActiveFilters());
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("checked", ctx_r1.showOnlySelected);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r1.filteredTiposDocumento.length === 0 && ctx_r1.searchTerm);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r1.filteredTiposDocumento.length === 0 && !ctx_r1.searchTerm);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r1.filteredTiposDocumento.length > 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ((tmp_12_0 = ctx_r1.documentoForm.get("selectedDocumentTypes")) == null ? null : tmp_12_0.hasError("required")) && ((tmp_12_0 = ctx_r1.documentoForm.get("selectedDocumentTypes")) == null ? null : tmp_12_0.touched));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate2"](" ", ctx_r1.getSelectedDocumentTypesCount(), " de ", ctx_r1.tiposDocumento.length, " seleccionados ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r1.hasActiveFilters());
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r1.showOnlySelected);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r1.hasActiveFilters());
  }
}
function DocumentoRequeridoEditDialogComponent_button_50_Template(rf, ctx) {
  if (rf & 1) {
    const _r51 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "button", 91);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function DocumentoRequeridoEditDialogComponent_button_50_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r51);
      const ctx_r50 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r50.debugFormState());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1, " Debug Form ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
}
function DocumentoRequeridoEditDialogComponent_mat_spinner_54_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](0, "mat-spinner", 92);
  }
}
function DocumentoRequeridoEditDialogComponent_mat_icon_55_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "mat-icon", 93);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](ctx_r4.data.mode === "edit" ? "save" : "add");
  }
}
class DocumentoRequeridoEditDialogComponent {
  constructor(fb, documentoRequeridoService, procesoService, agencyService, costumerTypeService, tipoOperacionService, documentTypeService, dialogRef, data, snackBar) {
    this.fb = fb;
    this.documentoRequeridoService = documentoRequeridoService;
    this.procesoService = procesoService;
    this.agencyService = agencyService;
    this.costumerTypeService = costumerTypeService;
    this.tipoOperacionService = tipoOperacionService;
    this.documentTypeService = documentTypeService;
    this.dialogRef = dialogRef;
    this.data = data;
    this.snackBar = snackBar;
    this.loading = false;
    this.loadingCatalogs = false;
    // Contador de catálogos procesados
    this.catalogsProcessed = 0;
    this.totalCatalogs = 5;
    // Catálogos
    this.procesos = [];
    this.agencias = [];
    this.tiposCliente = [];
    this.tiposOperacion = [];
    this.tiposDocumento = [];
    // Buscador y filtros
    this.searchTerm = '';
    this.selectedPhase = '';
    this.selectedSubPhase = '';
    this.filteredTiposDocumento = [];
    this.availablePhases = [];
    this.availableSubPhases = [];
    // Propiedad para manejar los tipos de documento seleccionados
    this.selectedDocumentTypes = [];
    // Filtro para mostrar solo seleccionados
    this.showOnlySelected = false;
  }
  ngOnInit() {
    this.initializeForm();
    this.loadCatalogs();
    // Timeout de seguridad para quitar el loading después de 5 segundos
    setTimeout(() => {
      this.loadingCatalogs = false;
    }, 5000);
  }
  initializeForm() {
    this.documentoForm = this.fb.group({
      IdProcess: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_7__.Validators.required],
      IdAgency: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_7__.Validators.required],
      IdCostumerType: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_7__.Validators.required],
      IdOperationType: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_7__.Validators.required],
      enabled: [true] // Estado de la configuración (habilitada por defecto)
    });
    // Si estamos en modo edición, poblar el formulario
    if (this.data.mode === 'edit' && this.data.documento) {
      this.documentoForm.patchValue({
        IdProcess: this.data.documento.IdProcess,
        IdAgency: this.data.documento.IdAgency,
        IdCostumerType: this.data.documento.IdCostumerType,
        IdOperationType: this.data.documento.IdOperationType,
        enabled: this.data.documento.Enabled === '1' // Convertir string a boolean
      });
    }
    // Si tenemos configuración predefinida, aplicarla
    if (this.data.configuracion) {
      this.documentoForm.patchValue({
        IdProcess: this.data.configuracion.IdProcess,
        IdAgency: this.data.configuracion.IdAgency,
        IdCostumerType: this.data.configuracion.IdCostumerType,
        IdOperationType: this.data.configuracion.IdOperationType
      });
    }
  }
  loadExistingDocuments() {
    console.log('🔄 Cargando documentos existentes...');
    console.log('📋 Configuración:', this.data.configuracion);
    console.log('📄 Tipos de documento disponibles:', this.tiposDocumento?.length || 0);
    // Cargar documentos existentes para esta configuración
    if (this.data.configuracion) {
      const filters = {
        IdProcess: this.data.configuracion.IdProcess,
        IdAgency: this.data.configuracion.IdAgency,
        IdCostumerType: this.data.configuracion.IdCostumerType,
        IdOperationType: this.data.configuracion.IdOperationType
      };
      console.log('🔍 Filtros para buscar documentos:', filters);
      this.documentoRequeridoService.getDocumentosRequeridos(filters).subscribe({
        next: response => {
          console.log('✅ Respuesta del servicio:', response);
          if (response?.success && response.data?.documentos) {
            // Extraer los IDs de los tipos de documento ya configurados
            const existingDocumentTypeIds = response.data.documentos.map(doc => doc.IdDocumentType);
            console.log('📋 IDs de documentos existentes:', existingDocumentTypeIds);
            console.log('📋 Número de documentos encontrados:', response.data.documentos.length);
            console.log('📋 Primeros 3 documentos:', response.data.documentos.slice(0, 3));
            // Actualizar el formulario con los documentos existentes
            console.log('🔄 Antes de actualizar el formulario:');
            console.log('📝 selectedDocumentTypes actual:', this.selectedDocumentTypes);
            this.selectedDocumentTypes = existingDocumentTypeIds;
            console.log('🔄 Después de actualizar el formulario:');
            console.log('📝 selectedDocumentTypes nuevo:', this.selectedDocumentTypes);
            console.log('✅ Formulario actualizado con documentos existentes');
            console.log('📝 Estado del formulario:', this.documentoForm.value.selectedDocumentTypes);
            console.log('📝 Valor del control selectedDocumentTypes:', this.documentoForm.get('selectedDocumentTypes')?.value);
            // Verificar que el formulario se actualizó correctamente
            setTimeout(() => {
              console.log('🔄 Verificación después de 100ms:');
              console.log('📝 Estado del formulario:', this.documentoForm.value.selectedDocumentTypes);
              console.log('📝 Valor del control selectedDocumentTypes:', this.documentoForm.get('selectedDocumentTypes')?.value);
              this.debugFormState();
            }, 100);
            // Actualizar la lista filtrada
            this.filteredTiposDocumento = [...this.tiposDocumento];
            this.applyFilters();
          } else {
            console.log('⚠️ No se encontraron documentos existentes o respuesta inválida');
          }
        },
        error: error => {
          console.error('❌ Error cargando documentos existentes:', error);
        }
      });
    } else {
      console.log('⚠️ No hay configuración disponible para cargar documentos existentes');
    }
  }
  loadCatalogs() {
    this.loadingCatalogs = true;
    this.catalogsProcessed = 0; // Resetear contador
    // Cargar procesos
    this.procesoService.getProcesos().subscribe({
      next: response => {
        if (response?.success && response.data) {
          this.procesos = response.data.processes || [];
        }
        this.checkCatalogsLoaded();
      },
      error: error => {
        console.error('Error cargando procesos:', error);
        this.checkCatalogsLoaded();
      }
    });
    // Cargar agencias
    this.agencyService.getAgencies({}).subscribe({
      next: response => {
        if (response?.success && response.data) {
          this.agencias = response.data.agencies || [];
        }
        this.checkCatalogsLoaded();
      },
      error: error => {
        console.error('Error cargando agencias:', error);
        this.checkCatalogsLoaded();
      }
    });
    // Cargar tipos de cliente
    this.costumerTypeService.getCostumerTypes().subscribe({
      next: response => {
        if (response?.success && response.data) {
          this.tiposCliente = response.data.costumer_types || [];
        }
        this.checkCatalogsLoaded();
      },
      error: error => {
        console.error('Error cargando tipos de cliente:', error);
        this.checkCatalogsLoaded();
      }
    });
    // Cargar tipos de operación
    this.tipoOperacionService.getTiposOperacion().subscribe({
      next: response => {
        if (response?.success && response.data) {
          this.tiposOperacion = response.data.operationTypes || [];
        }
        this.checkCatalogsLoaded();
      },
      error: error => {
        console.error('Error cargando tipos de operación:', error);
        this.checkCatalogsLoaded();
      }
    });
    // Cargar tipos de documento
    this.documentTypeService.getDocumentTypes().subscribe({
      next: response => {
        if (response?.success && response.data) {
          this.tiposDocumento = response.data.document_types || [];
          this.filteredTiposDocumento = [...this.tiposDocumento]; // Inicializar filtrado
          // Extraer fases y subfases únicas disponibles
          this.extractAvailablePhases();
          // NOTA: loadExistingDocuments() se llama desde checkCatalogsLoaded() 
          // cuando todos los catálogos estén listos para evitar problemas de timing
        }

        this.checkCatalogsLoaded();
      },
      error: error => {
        console.error('Error cargando tipos de documento:', error);
        this.checkCatalogsLoaded();
      }
    });
  }
  checkCatalogsLoaded() {
    this.catalogsProcessed++;
    console.log(`📊 Catálogo procesado: ${this.catalogsProcessed}/${this.totalCatalogs}`);
    // Si todos los catálogos han sido procesados, quitar el loading
    if (this.catalogsProcessed >= this.totalCatalogs) {
      console.log('✅ Todos los catálogos han sido cargados');
      this.loadingCatalogs = false;
      // Si estamos en modo edición, cargar documentos existentes DESPUÉS de que todos los catálogos estén listos
      if (this.data.mode === 'edit') {
        console.log('🔄 Modo edición detectado, cargando documentos existentes...');
        console.log('📋 Configuración disponible:', this.data.configuracion);
        this.loadExistingDocuments();
      } else {
        console.log('🆕 Modo creación detectado, no se cargan documentos existentes');
      }
    }
  }
  onSubmit() {
    if (this.documentoForm.valid && this.selectedDocumentTypes.length > 0) {
      this.loading = true;
      if (this.data.mode === 'create') {
        this.createDocumentoRequerido();
      } else {
        this.updateDocumentoRequerido();
      }
    } else if (this.selectedDocumentTypes.length === 0) {
      this.snackBar.open('Debes seleccionar al menos un tipo de documento', 'Error', {
        duration: 3000
      });
    }
  }
  createDocumentoRequerido() {
    if (this.selectedDocumentTypes.length === 0) {
      this.snackBar.open('Debes seleccionar al menos un tipo de documento', 'Error', {
        duration: 3000
      });
      this.loading = false;
      return;
    }
    // Crear múltiples documentos, uno por cada tipo seleccionado
    let createdCount = 0;
    let errorCount = 0;
    const totalToCreate = this.selectedDocumentTypes.length;
    this.selectedDocumentTypes.forEach((documentTypeId, index) => {
      const documentoData = {
        IdProcess: this.documentoForm.value.IdProcess,
        IdAgency: this.documentoForm.value.IdAgency,
        IdCostumerType: this.documentoForm.value.IdCostumerType,
        IdOperationType: this.documentoForm.value.IdOperationType,
        IdDocumentType: documentTypeId
      };
      this.documentoRequeridoService.createDocumentoRequerido(documentoData).subscribe({
        next: response => {
          if (response.success) {
            createdCount++;
          } else {
            errorCount++;
          }
          // Verificar si todos los documentos han sido procesados
          if (createdCount + errorCount === totalToCreate) {
            if (errorCount === 0) {
              this.snackBar.open(`${createdCount} configuraciones creadas exitosamente`, 'Éxito', {
                duration: 3000
              });
              this.dialogRef.close(true);
            } else {
              this.snackBar.open(`${createdCount} configuraciones creadas, ${errorCount} errores`, 'Advertencia', {
                duration: 3000
              });
              this.dialogRef.close(true);
            }
            this.loading = false;
          }
        },
        error: error => {
          errorCount++;
          // Verificar si todos los documentos han sido procesados
          if (createdCount + errorCount === totalToCreate) {
            if (createdCount > 0) {
              this.snackBar.open(`${createdCount} configuraciones creadas, ${errorCount} errores`, 'Advertencia', {
                duration: 3000
              });
              this.dialogRef.close(true);
            } else {
              this.snackBar.open('Error al crear configuraciones', 'Error', {
                duration: 3000
              });
            }
            this.loading = false;
          }
        }
      });
    });
  }
  updateDocumentoRequerido() {
    if (!this.data.documento) return;
    if (this.selectedDocumentTypes.length === 0) {
      this.snackBar.open('Debes seleccionar al menos un tipo de documento', 'Error', {
        duration: 3000
      });
      this.loading = false;
      return;
    }
    // Para edición, solo actualizamos el primer tipo seleccionado (compatibilidad)
    const documentoData = {
      Id: this.data.documento.Id,
      IdProcess: this.documentoForm.value.IdProcess,
      IdAgency: this.documentoForm.value.IdAgency,
      IdCostumerType: this.documentoForm.value.IdCostumerType,
      IdOperationType: this.documentoForm.value.IdOperationType,
      IdDocumentType: this.selectedDocumentTypes[0],
      Enabled: this.documentoForm.value.enabled ? '1' : '0' // Convertir boolean a string
    };

    this.documentoRequeridoService.updateDocumentoRequerido(this.data.documento.Id, documentoData).subscribe({
      next: response => {
        if (response.success) {
          this.snackBar.open('Configuración actualizada exitosamente', 'Éxito', {
            duration: 2000
          });
          this.dialogRef.close(true);
        } else {
          this.snackBar.open(response.message || 'Error al actualizar configuración', 'Error', {
            duration: 3000
          });
        }
        this.loading = false;
      },
      error: error => {
        this.snackBar.open('Error al actualizar configuración', 'Error', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }
  onCancel() {
    this.dialogRef.close();
  }
  getTitle() {
    return this.data.mode === 'edit' ? 'Editar Configuración de Documentos' : 'Nueva Configuración';
  }
  getSubmitButtonText() {
    return this.data.mode === 'edit' ? 'Guardar Cambios' : 'Crear Configuración';
  }
  // Método para verificar si un tipo de documento está seleccionado
  isDocumentTypeSelected(documentTypeId) {
    const isSelected = this.selectedDocumentTypes.includes(documentTypeId);
    // Solo mostrar logs para los primeros 5 documentos para no saturar la consola
    if (parseInt(documentTypeId) <= 5) {
      console.log(`🔍 Verificando si ${documentTypeId} está seleccionado: ${isSelected}`);
      console.log(`📋 Tipos seleccionados actuales:`, this.selectedDocumentTypes);
      console.log(`📝 Tipo de selectedTypes:`, typeof this.selectedDocumentTypes, Array.isArray(this.selectedDocumentTypes));
      console.log(`📝 documentTypeId:`, documentTypeId, typeof documentTypeId);
      console.log(`📝 Comparación:`, this.selectedDocumentTypes.includes(documentTypeId));
    }
    return isSelected;
  }
  // Método para manejar cambios en los checkboxes
  onDocumentTypeChange(event, documentTypeId) {
    if (event.checked) {
      // Agregar el documento si no está ya seleccionado
      if (!this.selectedDocumentTypes.includes(documentTypeId)) {
        this.selectedDocumentTypes.push(documentTypeId);
      }
    } else {
      // Remover el documento si está seleccionado
      const index = this.selectedDocumentTypes.indexOf(documentTypeId);
      if (index > -1) {
        this.selectedDocumentTypes.splice(index, 1);
      }
    }
    console.log('🔄 Documento cambiado:', documentTypeId, 'checked:', event.checked);
    console.log('📋 Tipos seleccionados actualizados:', this.selectedDocumentTypes);
    // Reaplicar filtros después del cambio
    this.applyFilters();
  }
  // Método para manejar el cambio en el filtro de solo seleccionados
  onShowOnlySelectedChange(event) {
    this.showOnlySelected = event.checked;
    console.log('🔄 Filtro "Solo seleccionados" cambiado:', this.showOnlySelected);
    console.log('📋 Tipos seleccionados actuales:', this.selectedDocumentTypes);
    console.log('📄 Total de tipos de documento:', this.tiposDocumento.length);
    this.applyFilters();
  }
  // Método para limpiar solo el filtro de seleccionados
  clearShowOnlySelectedFilter() {
    this.showOnlySelected = false;
    console.log('🔄 Filtro "Solo seleccionados" limpiado');
    this.applyFilters();
  }
  // Método para obtener el conteo de tipos de documento seleccionados
  getSelectedDocumentTypesCount() {
    return this.selectedDocumentTypes.length;
  }
  // Métodos para obtener textos de solo lectura
  getProcessText() {
    const processId = this.documentoForm.get('IdProcess')?.value;
    const process = this.procesos.find(p => p.Id === processId);
    return process ? process.Name : 'No seleccionado';
  }
  getAgencyText() {
    const agencyId = this.documentoForm.get('IdAgency')?.value;
    const agency = this.agencias.find(a => a.Id === agencyId);
    return agency ? agency.Name : 'No seleccionado';
  }
  getCustomerTypeText() {
    const customerTypeId = this.documentoForm.get('IdCostumerType')?.value;
    const customerType = this.tiposCliente.find(t => t.Id === customerTypeId);
    return customerType ? customerType.Name : 'No seleccionado';
  }
  getOperationTypeText() {
    const operationTypeId = this.documentoForm.get('IdOperationType')?.value;
    const operationType = this.tiposOperacion.find(t => t.Id === operationTypeId);
    return operationType ? operationType.Name : 'No seleccionado';
  }
  // Método temporal para debuggear el estado del formulario
  debugFormState() {
    console.log('🔍 DEBUG - Estado del formulario:');
    console.log('📝 selectedDocumentTypes:', this.selectedDocumentTypes);
    console.log('📝 Tipo de selectedDocumentTypes:', typeof this.selectedDocumentTypes);
    console.log('📝 Es array:', Array.isArray(this.selectedDocumentTypes));
    console.log('📝 Longitud:', this.selectedDocumentTypes.length);
    console.log('📝 Estado completo del formulario:', this.documentoForm.value);
  }
  // Método para filtrar tipos de documento
  onSearchChange(searchTerm) {
    this.searchTerm = searchTerm;
    this.applyFilters();
  }
  // Método para cambiar filtro de fase
  onPhaseChange(phase) {
    this.selectedPhase = phase;
    this.selectedSubPhase = ''; // Resetear subfase cuando cambia la fase
    this.updateAvailableSubPhases();
    this.applyFilters();
  }
  // Método para cambiar filtro de subfase
  onSubPhaseChange(subPhase) {
    this.selectedSubPhase = subPhase;
    this.applyFilters();
  }
  // Método para limpiar búsqueda
  clearSearch() {
    this.searchTerm = '';
    this.applyFilters();
  }
  // Método para limpiar todos los filtros
  clearAllFilters() {
    this.searchTerm = '';
    this.selectedPhase = '';
    this.selectedSubPhase = '';
    this.showOnlySelected = false;
    this.applyFilters();
  }
  // Método para verificar si hay filtros activos
  hasActiveFilters() {
    return this.searchTerm.trim() !== '' || this.selectedPhase !== '' || this.selectedSubPhase !== '' || this.showOnlySelected;
  }
  // Método para extraer fases y subfases disponibles
  extractAvailablePhases() {
    const phases = new Set();
    const subPhases = new Set();
    this.tiposDocumento.forEach(tipo => {
      if (tipo.ProcessTypeName) {
        phases.add(tipo.ProcessTypeName);
      }
      if (tipo.SubProcessName) {
        subPhases.add(tipo.SubProcessName);
      }
    });
    this.availablePhases = Array.from(phases).sort();
    this.availableSubPhases = Array.from(subPhases).sort();
  }
  // Método para actualizar subfases disponibles según la fase seleccionada
  updateAvailableSubPhases() {
    if (!this.selectedPhase) {
      this.availableSubPhases = Array.from(new Set(this.tiposDocumento.filter(tipo => tipo.SubProcessName).map(tipo => tipo.SubProcessName))).sort();
      return;
    }
    const subPhases = new Set();
    this.tiposDocumento.forEach(tipo => {
      if (tipo.ProcessTypeName === this.selectedPhase && tipo.SubProcessName) {
        subPhases.add(tipo.SubProcessName);
      }
    });
    this.availableSubPhases = Array.from(subPhases).sort();
  }
  // Método para aplicar todos los filtros
  applyFilters() {
    console.log('🔍 Aplicando filtros...');
    console.log('📝 showOnlySelected:', this.showOnlySelected);
    console.log('📝 selectedDocumentTypes:', this.selectedDocumentTypes);
    let filtered = [...this.tiposDocumento];
    console.log('📄 Total inicial:', filtered.length);
    // Filtro por nombre
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(tipo => tipo.Name.toLowerCase().includes(searchLower));
      console.log('🔍 Después de filtro por nombre:', filtered.length);
    }
    // Filtro por fase
    if (this.selectedPhase) {
      filtered = filtered.filter(tipo => tipo.ProcessTypeName === this.selectedPhase);
      console.log('🔍 Después de filtro por fase:', filtered.length);
    }
    // Filtro por subfase
    if (this.selectedSubPhase) {
      filtered = filtered.filter(tipo => tipo.SubProcessName === this.selectedSubPhase);
      console.log('🔍 Después de filtro por subfase:', filtered.length);
    }
    // Filtro por solo seleccionados
    if (this.showOnlySelected) {
      const beforeFilter = filtered.length;
      filtered = filtered.filter(tipo => this.selectedDocumentTypes.includes(tipo.Id));
      console.log('🔍 Después de filtro "Solo seleccionados":', filtered.length, '(antes:', beforeFilter, ')');
      console.log('🔍 IDs seleccionados:', this.selectedDocumentTypes);
      console.log('🔍 Tipos filtrados:', filtered.map(t => ({
        id: t.Id,
        name: t.Name
      })));
    }
    this.filteredTiposDocumento = filtered;
    console.log('✅ Filtrado final:', this.filteredTiposDocumento.length);
  }
  static #_ = this.ɵfac = function DocumentoRequeridoEditDialogComponent_Factory(t) {
    return new (t || DocumentoRequeridoEditDialogComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_7__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_core_services_documento_requerido_service__WEBPACK_IMPORTED_MODULE_0__.DocumentoRequeridoService), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_core_services_proceso_service__WEBPACK_IMPORTED_MODULE_1__.ProcesoService), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_core_services_agency_service__WEBPACK_IMPORTED_MODULE_2__.AgencyService), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_core_services_costumer_type_service__WEBPACK_IMPORTED_MODULE_3__.CostumerTypeService), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_core_services_tipo_operacion_service__WEBPACK_IMPORTED_MODULE_4__.TipoOperacionService), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_core_services_document_type_service__WEBPACK_IMPORTED_MODULE_5__.DocumentTypeService), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_8__.MatDialogRef), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_8__.MAT_DIALOG_DATA), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_9__.MatSnackBar));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineComponent"]({
    type: DocumentoRequeridoEditDialogComponent,
    selectors: [["app-documento-requerido-edit-dialog"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵStandaloneFeature"]],
    decls: 57,
    vars: 17,
    consts: [[1, "p-0"], [1, "flex", "items-center", "justify-between", "p-6", "border-b", "border-gray-200"], [1, "text-xl", "font-semibold", "text-gray-900"], ["mat-icon-button", "", "matTooltip", "Cerrar", 3, "click"], [1, "space-y-6", "p-6", 3, "formGroup", "ngSubmit"], [1, "bg-blue-50", "border", "border-blue-200", "rounded-lg", "p-3"], [1, "flex", "items-center", "justify-between", "mb-2"], [1, "text-sm", "font-medium", "text-blue-900"], [1, "flex", "items-center", "space-x-3"], [1, "flex", "items-center", "space-x-2"], [1, "text-xs", "font-medium", "text-yellow-700", "uppercase", "tracking-wide"], [1, "text-sm", "text-gray-800", "font-medium", "bg-white", "px-2", "py-0.5", "rounded", "border", "border-yellow-200", "shadow-sm"], ["formControlName", "enabled", "color", "primary", 1, "scale-90", 3, "disabled"], [1, "text-xs", "text-yellow-600"], [1, "flex", "flex-wrap", "gap-x-6", "gap-y-1"], [1, "flex", "items-center", "space-x-1"], [1, "text-xs", "font-medium", "text-blue-700", "uppercase", "tracking-wide", "min-w-12"], [1, "text-sm", "text-gray-800", "font-medium", "bg-white", "px-2", "py-0.5", "rounded", "border", "border-blue-200", "shadow-sm"], [1, "text-xs", "text-gray-500", "mt-2", "italic"], [1, "bg-green-50", "border", "border-green-200", "rounded-lg", "p-3"], [1, "text-sm", "font-medium", "text-green-900", "mb-2"], ["class", "flex items-center justify-center py-4", 4, "ngIf"], ["class", "space-y-2", 4, "ngIf"], [1, "flex", "justify-end", "space-x-3", "pt-4", "mt-4", "border-t"], ["type", "button", "mat-button", "", "class", "mr-auto", 3, "click", 4, "ngIf"], ["type", "button", "mat-button", "", 3, "disabled", "click"], ["type", "submit", "mat-raised-button", "", "color", "primary", 3, "disabled"], ["diameter", "18", "class", "mr-2", 4, "ngIf"], ["class", "text-sm", 4, "ngIf"], [1, "flex", "items-center", "justify-center", "py-4"], ["diameter", "32"], [1, "ml-2", "text-gray-600", "text-sm"], [1, "space-y-2"], [1, "text-xs", "text-gray-600", "mb-2"], [1, "mb-3"], [1, "flex", "flex-wrap", "items-center", "gap-2", "mb-2"], [1, "flex-1", "min-w-48"], ["appearance", "outline", 1, "w-full"], ["matInput", "", "placeholder", "Nombre del documento...", 1, "text-sm", 3, "ngModel", "ngModelChange"], ["matSuffix", "", 1, "text-gray-400"], ["matSuffix", "", "mat-icon-button", "", "class", "text-gray-400 hover:text-gray-600", 3, "click", 4, "ngIf"], ["appearance", "outline", 1, "w-40"], [3, "ngModel", "ngModelChange"], ["value", ""], [3, "value", 4, "ngFor", "ngForOf"], [3, "ngModel", "disabled", "ngModelChange"], ["type", "button", "mat-icon-button", "", "class", "text-blue-600 hover:text-blue-800", "matTooltip", "Limpiar filtros", 3, "click", 4, "ngIf"], [1, "flex", "items-center", "space-x-2", "ml-2"], ["color", "primary", 1, "text-sm", 3, "checked", "change"], ["class", "text-center py-4 text-gray-500", 4, "ngIf"], ["class", "max-h-48 overflow-y-auto", 4, "ngIf"], ["class", "text-red-600 text-sm mt-2", 4, "ngIf"], [1, "flex", "items-center", "justify-between", "text-xs", "text-gray-500", "mt-2"], ["class", "text-blue-600 ml-1", 4, "ngIf"], ["class", "text-green-600 ml-1", 4, "ngIf"], ["class", "flex items-center gap-1", 4, "ngIf"], ["matSuffix", "", "mat-icon-button", "", 1, "text-gray-400", "hover:text-gray-600", 3, "click"], [3, "value"], ["type", "button", "mat-icon-button", "", "matTooltip", "Limpiar filtros", 1, "text-blue-600", "hover:text-blue-800", 3, "click"], [1, "text-center", "py-4", "text-gray-500"], [1, "text-2xl", "mb-1", "text-gray-300"], [1, "text-sm", "font-medium"], [1, "text-xs"], [1, "max-h-48", "overflow-y-auto"], [1, "grid", "grid-cols-1", "gap-1"], ["class", "flex items-center space-x-2 p-2 bg-white rounded border border-gray-200 hover:bg-gray-50", 4, "ngFor", "ngForOf"], [1, "flex", "items-center", "space-x-2", "p-2", "bg-white", "rounded", "border", "border-gray-200", "hover:bg-gray-50"], ["color", "primary", 1, "flex-shrink-0", 3, "value", "checked", "change"], [1, "flex-1", "min-w-0"], [1, "text-sm", "font-medium", "text-gray-700", "truncate"], [1, "text-xs", "text-gray-500", "flex", "flex-wrap", "gap-2", "mt-1"], ["class", "inline-flex items-center bg-blue-50 px-2 py-1 rounded", 4, "ngIf"], ["class", "inline-flex items-center bg-green-50 px-2 py-1 rounded", 4, "ngIf"], [1, "inline-flex", "items-center", "bg-blue-50", "px-2", "py-1", "rounded"], [1, "text-xs", "mr-1", "text-blue-600"], [1, "inline-flex", "items-center", "bg-green-50", "px-2", "py-1", "rounded"], [1, "text-xs", "mr-1", "text-green-600"], [1, "text-red-600", "text-sm", "mt-2"], [1, "text-blue-600", "ml-1"], [1, "text-green-600", "ml-1"], [1, "flex", "items-center", "gap-1"], [1, "text-blue-600"], ["class", "inline-flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs", 4, "ngIf"], ["class", "inline-flex items-center bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs", 4, "ngIf"], ["class", "inline-flex items-center bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs", 4, "ngIf"], [1, "inline-flex", "items-center", "bg-blue-100", "text-blue-700", "px-2", "py-1", "rounded-full", "text-xs"], [1, "ml-1", "text-blue-500", "hover:text-blue-700", 3, "click"], [1, "inline-flex", "items-center", "bg-green-100", "text-green-700", "px-2", "py-1", "rounded-full", "text-xs"], [1, "ml-1", "text-green-500", "hover:text-green-700", 3, "click"], [1, "inline-flex", "items-center", "bg-purple-100", "text-purple-700", "px-2", "py-1", "rounded-full", "text-xs"], [1, "ml-1", "text-purple-500", "hover:text-purple-700", 3, "click"], ["type", "button", "mat-button", "", 1, "mr-auto", 3, "click"], ["diameter", "18", 1, "mr-2"], [1, "text-sm"]],
    template: function DocumentoRequeridoEditDialogComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h2", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](4, "button", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function DocumentoRequeridoEditDialogComponent_Template_button_click_4_listener() {
          return ctx.onCancel();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](5, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](6, "close");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](7, "form", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("ngSubmit", function DocumentoRequeridoEditDialogComponent_Template_form_ngSubmit_7_listener() {
          return ctx.onSubmit();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](8, "div", 5)(9, "div", 6)(10, "h3", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](11, "Configuraci\u00F3n del Proceso");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](12, "div", 8)(13, "div", 9)(14, "span", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](15, "Estado:");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](16, "span", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](17);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](18, "mat-slide-toggle", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](19, "span", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](20);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](21, "div", 14)(22, "div", 15)(23, "span", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](24, "Proceso:");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](25, "span", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](26);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](27, "div", 15)(28, "span", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](29, "Agencia:");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](30, "span", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](31);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](32, "div", 15)(33, "span", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](34, "Cliente:");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](35, "span", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](36);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](37, "div", 15)(38, "span", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](39, "Operaci\u00F3n:");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](40, "span", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](41);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](42, "p", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](43, " Una configuraci\u00F3n deshabilitada no se aplicar\u00E1 a nuevos procesos ");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](44, "div", 19)(45, "h3", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](46, "Tipos de Documento Requeridos");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](47, DocumentoRequeridoEditDialogComponent_div_47_Template, 4, 0, "div", 21)(48, DocumentoRequeridoEditDialogComponent_div_48_Template, 41, 18, "div", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](49, "div", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](50, DocumentoRequeridoEditDialogComponent_button_50_Template, 2, 0, "button", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](51, "button", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function DocumentoRequeridoEditDialogComponent_Template_button_click_51_listener() {
          return ctx.onCancel();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](52, " Cancelar ");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](53, "button", 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](54, DocumentoRequeridoEditDialogComponent_mat_spinner_54_Template, 1, 0, "mat-spinner", 27)(55, DocumentoRequeridoEditDialogComponent_mat_icon_55_Template, 2, 1, "mat-icon", 28);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](56);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()()();
      }
      if (rf & 2) {
        let tmp_2_0;
        let tmp_4_0;
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", ctx.getTitle(), " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("formGroup", ctx.documentoForm);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](10);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", ((tmp_2_0 = ctx.documentoForm.get("enabled")) == null ? null : tmp_2_0.value) ? "Habilitada" : "Deshabilitada", " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("disabled", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", ((tmp_4_0 = ctx.documentoForm.get("enabled")) == null ? null : tmp_4_0.value) ? "Activa" : "Inactiva", " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](ctx.getProcessText());
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](ctx.getAgencyText());
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](ctx.getCustomerTypeText());
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](ctx.getOperationTypeText());
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx.loadingCatalogs);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", !ctx.loadingCatalogs);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx.data.mode === "edit");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("disabled", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("disabled", ctx.documentoForm.invalid || ctx.loading || ctx.loadingCatalogs);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", !ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", ctx.getSubmitButtonText(), " ");
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_10__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_10__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_10__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_7__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_7__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.FormControlName, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.NgModel, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_8__.MatDialogModule, _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_9__.MatSnackBarModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_11__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_11__.MatButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_11__.MatIconButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_12__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_12__.MatIcon, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_13__.MatFormFieldModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_13__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_13__.MatLabel, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_13__.MatSuffix, _angular_material_input__WEBPACK_IMPORTED_MODULE_14__.MatInputModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_14__.MatInput, _angular_material_select__WEBPACK_IMPORTED_MODULE_15__.MatSelectModule, _angular_material_select__WEBPACK_IMPORTED_MODULE_15__.MatSelect, _angular_material_core__WEBPACK_IMPORTED_MODULE_16__.MatOption, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_17__.MatProgressSpinnerModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_17__.MatProgressSpinner, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_18__.MatTooltipModule, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_18__.MatTooltip, _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_19__.MatCheckboxModule, _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_19__.MatCheckbox, _angular_material_slide_toggle__WEBPACK_IMPORTED_MODULE_20__.MatSlideToggleModule, _angular_material_slide_toggle__WEBPACK_IMPORTED_MODULE_20__.MatSlideToggle],
    styles: [".bg-blue-50[_ngcontent-%COMP%]   .bg-blue-50[_ngcontent-%COMP%] {\n  background-color: #eff6ff;\n}\n.bg-blue-50[_ngcontent-%COMP%]   .border-blue-200[_ngcontent-%COMP%] {\n  border-color: #bfdbfe;\n}\n.bg-blue-50[_ngcontent-%COMP%]   .text-blue-900[_ngcontent-%COMP%] {\n  color: #1e3a8a;\n}\n\n.bg-green-50[_ngcontent-%COMP%]   .bg-green-50[_ngcontent-%COMP%] {\n  background-color: #f0fdf4;\n}\n.bg-green-50[_ngcontent-%COMP%]   .border-green-200[_ngcontent-%COMP%] {\n  border-color: #bbf7d0;\n}\n.bg-green-50[_ngcontent-%COMP%]   .text-green-900[_ngcontent-%COMP%] {\n  color: #14532d;\n}\n\n.bg-amber-50[_ngcontent-%COMP%]   .bg-amber-50[_ngcontent-%COMP%] {\n  background-color: #fffbeb;\n}\n.bg-amber-50[_ngcontent-%COMP%]   .border-amber-200[_ngcontent-%COMP%] {\n  border-color: #fde68a;\n}\n.bg-amber-50[_ngcontent-%COMP%]   .text-amber-900[_ngcontent-%COMP%] {\n  color: #78350f;\n}\n\n.bg-gray-50[_ngcontent-%COMP%]   .bg-gray-50[_ngcontent-%COMP%] {\n  background-color: #f9fafb;\n}\n.bg-gray-50[_ngcontent-%COMP%]   .border-gray-200[_ngcontent-%COMP%] {\n  border-color: #e5e7eb;\n}\n.bg-gray-50[_ngcontent-%COMP%]   .text-gray-900[_ngcontent-%COMP%] {\n  color: #111827;\n}\n\n.mat-mdc-slide-toggle[_ngcontent-%COMP%]   .mdc-switch[_ngcontent-%COMP%] {\n  --mdc-switch-selected-track-color: #3b82f6;\n  --mdc-switch-selected-handle-color: #ffffff;\n  --mdc-switch-unselected-track-color: #d1d5db;\n  --mdc-switch-unselected-handle-color: #ffffff;\n}\n.mat-mdc-slide-toggle.mat-warn[_ngcontent-%COMP%]   .mdc-switch[_ngcontent-%COMP%] {\n  --mdc-switch-selected-track-color: #f59e0b;\n}\n\n.mat-mdc-form-field[_ngcontent-%COMP%]   .mat-mdc-form-field-flex[_ngcontent-%COMP%] {\n  background-color: #ffffff;\n}\n.mat-mdc-form-field.mat-focused[_ngcontent-%COMP%]   .mat-mdc-form-field-flex[_ngcontent-%COMP%] {\n  background-color: #f8fafc;\n}\n\n.mat-mdc-raised-button[_ngcontent-%COMP%] {\n  border-radius: 6px;\n  font-weight: 500;\n}\n.mat-mdc-raised-button.mat-primary[_ngcontent-%COMP%] {\n  background-color: #3b82f6;\n  color: #ffffff;\n}\n.mat-mdc-raised-button.mat-primary[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background-color: #2563eb;\n}\n.mat-mdc-raised-button.mat-primary[_ngcontent-%COMP%]:disabled {\n  background-color: #9ca3af;\n  color: #6b7280;\n}\n\n.mat-mdc-button[_ngcontent-%COMP%] {\n  border-radius: 6px;\n  font-weight: 500;\n}\n.mat-mdc-button[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background-color: #f3f4f6;\n}\n\n.animate-spin[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_spin 1s linear infinite;\n}\n\n@keyframes _ngcontent-%COMP%_spin {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n@media (max-width: 768px) {\n  .grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .space-y-6[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%]    + *[_ngcontent-%COMP%] {\n    margin-top: 1.5rem;\n  }\n  .p-6[_ngcontent-%COMP%] {\n    padding: 1rem;\n  }\n}\n.transition-colors[_ngcontent-%COMP%] {\n  transition: all 0.2s ease-in-out;\n}\n\n.hover\\:bg-gray-50[_ngcontent-%COMP%]:hover {\n  background-color: #f9fafb;\n}\n\n.mat-mdc-form-field.mat-form-field-disabled[_ngcontent-%COMP%] {\n  opacity: 0.6;\n}\n.mat-mdc-form-field.mat-form-field-disabled[_ngcontent-%COMP%]   .mat-mdc-form-field-flex[_ngcontent-%COMP%] {\n  background-color: #f3f4f6;\n}\n\n.mat-mdc-form-field-error[_ngcontent-%COMP%] {\n  color: #dc2626;\n  font-size: 0.75rem;\n  margin-top: 0.25rem;\n}\n\n.mat-mdc-form-field-hint[_ngcontent-%COMP%] {\n  color: #6b7280;\n  font-size: 0.75rem;\n  margin-top: 0.25rem;\n}\n\ntextarea[_ngcontent-%COMP%]    + .mat-mdc-form-field-hint[_ngcontent-%COMP%] {\n  text-align: right;\n  font-size: 0.75rem;\n  color: #9ca3af;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvY29uZmlndXJhY2lvbi9kb2N1bWVudG9zLXJlcXVlcmlkb3MvZG9jdW1lbnRvLXJlcXVlcmlkby1lZGl0LWRpYWxvZy9kb2N1bWVudG8tcmVxdWVyaWRvLWVkaXQtZGlhbG9nLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUlFO0VBQ0UseUJBQUE7QUFISjtBQU1FO0VBQ0UscUJBQUE7QUFKSjtBQU9FO0VBQ0UsY0FBQTtBQUxKOztBQVdFO0VBQ0UseUJBQUE7QUFSSjtBQVdFO0VBQ0UscUJBQUE7QUFUSjtBQVlFO0VBQ0UsY0FBQTtBQVZKOztBQWdCRTtFQUNFLHlCQUFBO0FBYko7QUFnQkU7RUFDRSxxQkFBQTtBQWRKO0FBaUJFO0VBQ0UsY0FBQTtBQWZKOztBQXFCRTtFQUNFLHlCQUFBO0FBbEJKO0FBcUJFO0VBQ0UscUJBQUE7QUFuQko7QUFzQkU7RUFDRSxjQUFBO0FBcEJKOztBQTBCRTtFQUNFLDBDQUFBO0VBQ0EsMkNBQUE7RUFDQSw0Q0FBQTtFQUNBLDZDQUFBO0FBdkJKO0FBMEJFO0VBQ0UsMENBQUE7QUF4Qko7O0FBOEJFO0VBQ0UseUJBQUE7QUEzQko7QUE4QkU7RUFDRSx5QkFBQTtBQTVCSjs7QUFpQ0E7RUFDRSxrQkFBQTtFQUNBLGdCQUFBO0FBOUJGO0FBZ0NFO0VBQ0UseUJBQUE7RUFDQSxjQUFBO0FBOUJKO0FBZ0NJO0VBQ0UseUJBQUE7QUE5Qk47QUFpQ0k7RUFDRSx5QkFBQTtFQUNBLGNBQUE7QUEvQk47O0FBb0NBO0VBQ0Usa0JBQUE7RUFDQSxnQkFBQTtBQWpDRjtBQW1DRTtFQUNFLHlCQUFBO0FBakNKOztBQXNDQTtFQUNFLGtDQUFBO0FBbkNGOztBQXNDQTtFQUNFO0lBQ0UsdUJBQUE7RUFuQ0Y7RUFxQ0E7SUFDRSx5QkFBQTtFQW5DRjtBQUNGO0FBdUNBO0VBQ0U7SUFDRSwwQkFBQTtFQXJDRjtFQXdDQTtJQUNFLGtCQUFBO0VBdENGO0VBeUNBO0lBQ0UsYUFBQTtFQXZDRjtBQUNGO0FBMkNBO0VBQ0UsZ0NBQUE7QUF6Q0Y7O0FBNkNBO0VBQ0UseUJBQUE7QUExQ0Y7O0FBOENBO0VBQ0UsWUFBQTtBQTNDRjtBQTZDRTtFQUNFLHlCQUFBO0FBM0NKOztBQWdEQTtFQUNFLGNBQUE7RUFDQSxrQkFBQTtFQUNBLG1CQUFBO0FBN0NGOztBQWlEQTtFQUNFLGNBQUE7RUFDQSxrQkFBQTtFQUNBLG1CQUFBO0FBOUNGOztBQWtEQTtFQUNFLGlCQUFBO0VBQ0Esa0JBQUE7RUFDQSxjQUFBO0FBL0NGIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRXN0aWxvcyBlc3BlY8ODwq1maWNvcyBwYXJhIGVsIGRpw4PCoWxvZ28gZGUgZG9jdW1lbnRvcyByZXF1ZXJpZG9zXG5cbi8vIENvbmZpZ3VyYWNpw4PCs24gZGUgcHJvY2Vzb1xuLmJnLWJsdWUtNTAge1xuICAuYmctYmx1ZS01MCB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2VmZjZmZjtcbiAgfVxuICBcbiAgLmJvcmRlci1ibHVlLTIwMCB7XG4gICAgYm9yZGVyLWNvbG9yOiAjYmZkYmZlO1xuICB9XG4gIFxuICAudGV4dC1ibHVlLTkwMCB7XG4gICAgY29sb3I6ICMxZTNhOGE7XG4gIH1cbn1cblxuLy8gQ29uZmlndXJhY2nDg8KzbiBkZWwgZG9jdW1lbnRvXG4uYmctZ3JlZW4tNTAge1xuICAuYmctZ3JlZW4tNTAge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNmMGZkZjQ7XG4gIH1cbiAgXG4gIC5ib3JkZXItZ3JlZW4tMjAwIHtcbiAgICBib3JkZXItY29sb3I6ICNiYmY3ZDA7XG4gIH1cbiAgXG4gIC50ZXh0LWdyZWVuLTkwMCB7XG4gICAgY29sb3I6ICMxNDUzMmQ7XG4gIH1cbn1cblxuLy8gQ29uZmlndXJhY2lvbmVzIGFkaWNpb25hbGVzXG4uYmctYW1iZXItNTAge1xuICAuYmctYW1iZXItNTAge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmZiZWI7XG4gIH1cbiAgXG4gIC5ib3JkZXItYW1iZXItMjAwIHtcbiAgICBib3JkZXItY29sb3I6ICNmZGU2OGE7XG4gIH1cbiAgXG4gIC50ZXh0LWFtYmVyLTkwMCB7XG4gICAgY29sb3I6ICM3ODM1MGY7XG4gIH1cbn1cblxuLy8gRXN0YWRvIGRlbCBkb2N1bWVudG9cbi5iZy1ncmF5LTUwIHtcbiAgLmJnLWdyYXktNTAge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNmOWZhZmI7XG4gIH1cbiAgXG4gIC5ib3JkZXItZ3JheS0yMDAge1xuICAgIGJvcmRlci1jb2xvcjogI2U1ZTdlYjtcbiAgfVxuICBcbiAgLnRleHQtZ3JheS05MDAge1xuICAgIGNvbG9yOiAjMTExODI3O1xuICB9XG59XG5cbi8vIFNsaWRlIHRvZ2dsZXNcbi5tYXQtbWRjLXNsaWRlLXRvZ2dsZSB7XG4gIC5tZGMtc3dpdGNoIHtcbiAgICAtLW1kYy1zd2l0Y2gtc2VsZWN0ZWQtdHJhY2stY29sb3I6ICMzYjgyZjY7XG4gICAgLS1tZGMtc3dpdGNoLXNlbGVjdGVkLWhhbmRsZS1jb2xvcjogI2ZmZmZmZjtcbiAgICAtLW1kYy1zd2l0Y2gtdW5zZWxlY3RlZC10cmFjay1jb2xvcjogI2QxZDVkYjtcbiAgICAtLW1kYy1zd2l0Y2gtdW5zZWxlY3RlZC1oYW5kbGUtY29sb3I6ICNmZmZmZmY7XG4gIH1cbiAgXG4gICYubWF0LXdhcm4gLm1kYy1zd2l0Y2gge1xuICAgIC0tbWRjLXN3aXRjaC1zZWxlY3RlZC10cmFjay1jb2xvcjogI2Y1OWUwYjtcbiAgfVxufVxuXG4vLyBDYW1wb3MgZGUgZm9ybXVsYXJpb1xuLm1hdC1tZGMtZm9ybS1maWVsZCB7XG4gIC5tYXQtbWRjLWZvcm0tZmllbGQtZmxleCB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjtcbiAgfVxuICBcbiAgJi5tYXQtZm9jdXNlZCAubWF0LW1kYy1mb3JtLWZpZWxkLWZsZXgge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNmOGZhZmM7XG4gIH1cbn1cblxuLy8gQm90b25lc1xuLm1hdC1tZGMtcmFpc2VkLWJ1dHRvbiB7XG4gIGJvcmRlci1yYWRpdXM6IDZweDtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgXG4gICYubWF0LXByaW1hcnkge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICMzYjgyZjY7XG4gICAgY29sb3I6ICNmZmZmZmY7XG4gICAgXG4gICAgJjpob3Zlcjpub3QoOmRpc2FibGVkKSB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMjU2M2ViO1xuICAgIH1cbiAgICBcbiAgICAmOmRpc2FibGVkIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICM5Y2EzYWY7XG4gICAgICBjb2xvcjogIzZiNzI4MDtcbiAgICB9XG4gIH1cbn1cblxuLm1hdC1tZGMtYnV0dG9uIHtcbiAgYm9yZGVyLXJhZGl1czogNnB4O1xuICBmb250LXdlaWdodDogNTAwO1xuICBcbiAgJjpob3Zlcjpub3QoOmRpc2FibGVkKSB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2YzZjRmNjtcbiAgfVxufVxuXG4vLyBJY29ub3MgZGUgY2FyZ2Fcbi5hbmltYXRlLXNwaW4ge1xuICBhbmltYXRpb246IHNwaW4gMXMgbGluZWFyIGluZmluaXRlO1xufVxuXG5Aa2V5ZnJhbWVzIHNwaW4ge1xuICBmcm9tIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgwZGVnKTtcbiAgfVxuICB0byB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKTtcbiAgfVxufVxuXG4vLyBSZXNwb25zaXZlXG5AbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcbiAgLmdyaWQge1xuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyO1xuICB9XG4gIFxuICAuc3BhY2UteS02ID4gKiArICoge1xuICAgIG1hcmdpbi10b3A6IDEuNXJlbTtcbiAgfVxuICBcbiAgLnAtNiB7XG4gICAgcGFkZGluZzogMXJlbTtcbiAgfVxufVxuXG4vLyBUcmFuc2ljaW9uZXNcbi50cmFuc2l0aW9uLWNvbG9ycyB7XG4gIHRyYW5zaXRpb246IGFsbCAwLjJzIGVhc2UtaW4tb3V0O1xufVxuXG4vLyBFc3RhZG9zIGRlIGhvdmVyXG4uaG92ZXJcXDpiZy1ncmF5LTUwOmhvdmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y5ZmFmYjtcbn1cblxuLy8gRXN0aWxvcyBwYXJhIGNhbXBvcyBkZXNoYWJpbGl0YWRvc1xuLm1hdC1tZGMtZm9ybS1maWVsZC5tYXQtZm9ybS1maWVsZC1kaXNhYmxlZCB7XG4gIG9wYWNpdHk6IDAuNjtcbiAgXG4gIC5tYXQtbWRjLWZvcm0tZmllbGQtZmxleCB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2YzZjRmNjtcbiAgfVxufVxuXG4vLyBFc3RpbG9zIHBhcmEgbWVuc2FqZXMgZGUgZXJyb3Jcbi5tYXQtbWRjLWZvcm0tZmllbGQtZXJyb3Ige1xuICBjb2xvcjogI2RjMjYyNjtcbiAgZm9udC1zaXplOiAwLjc1cmVtO1xuICBtYXJnaW4tdG9wOiAwLjI1cmVtO1xufVxuXG4vLyBFc3RpbG9zIHBhcmEgaGludHNcbi5tYXQtbWRjLWZvcm0tZmllbGQtaGludCB7XG4gIGNvbG9yOiAjNmI3MjgwO1xuICBmb250LXNpemU6IDAuNzVyZW07XG4gIG1hcmdpbi10b3A6IDAuMjVyZW07XG59XG5cbi8vIEVzdGlsb3MgcGFyYSBlbCBjb250YWRvciBkZSBjYXJhY3RlcmVzXG50ZXh0YXJlYSArIC5tYXQtbWRjLWZvcm0tZmllbGQtaGludCB7XG4gIHRleHQtYWxpZ246IHJpZ2h0O1xuICBmb250LXNpemU6IDAuNzVyZW07XG4gIGNvbG9yOiAjOWNhM2FmO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }),

/***/ 77394:
/*!**********************************************************************************************!*\
  !*** ./src/app/pages/configuracion/documentos-requeridos/documentos-requeridos.component.ts ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DocumentosRequeridosComponent: () => (/* binding */ DocumentosRequeridosComponent)
/* harmony export */ });
/* harmony import */ var _angular_material_table__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/table */ 46798);
/* harmony import */ var _angular_material_paginator__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/paginator */ 39687);
/* harmony import */ var _angular_material_sort__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/sort */ 87963);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/forms */ 28849);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/form-field */ 51333);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material/input */ 10026);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/snack-bar */ 49409);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/dialog */ 17401);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/material/progress-spinner */ 33910);
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/material/select */ 96355);
/* harmony import */ var _documento_requerido_edit_dialog_documento_requerido_edit_dialog_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./documento-requerido-edit-dialog/documento-requerido-edit-dialog.component */ 95302);
/* harmony import */ var _duplicate_configuration_dialog_duplicate_configuration_dialog_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./duplicate-configuration-dialog/duplicate-configuration-dialog.component */ 15915);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _core_services_proceso_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../core/services/proceso.service */ 16425);
/* harmony import */ var _core_services_agency_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../core/services/agency.service */ 92883);
/* harmony import */ var _core_services_costumer_type_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../core/services/costumer-type.service */ 12143);
/* harmony import */ var _core_services_tipo_operacion_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../core/services/tipo-operacion.service */ 15591);
/* harmony import */ var _core_services_documento_requerido_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../core/services/documento-requerido.service */ 13146);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @angular/material/core */ 55309);





































function DocumentosRequeridosComponent_div_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](1, "mat-spinner", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](2, "span", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](3, "Cargando...");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
}
function DocumentosRequeridosComponent_mat_option_33_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "mat-option", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const agency_r33 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("value", agency_r33.Id);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", agency_r33.Name, " ");
  }
}
function DocumentosRequeridosComponent_mat_icon_34_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "mat-icon", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, "refresh");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
}
function DocumentosRequeridosComponent_mat_option_41_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "mat-option", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const process_r34 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("value", process_r34.Id);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", process_r34.Name, " ");
  }
}
function DocumentosRequeridosComponent_mat_icon_42_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "mat-icon", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, "refresh");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
}
function DocumentosRequeridosComponent_mat_option_49_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "mat-option", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const customerType_r35 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("value", customerType_r35.Id);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", customerType_r35.Name, " ");
  }
}
function DocumentosRequeridosComponent_mat_icon_50_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "mat-icon", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, "refresh");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
}
function DocumentosRequeridosComponent_mat_option_57_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "mat-option", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const operationType_r36 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("value", operationType_r36.Id);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", operationType_r36.Name, " ");
  }
}
function DocumentosRequeridosComponent_mat_icon_58_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "mat-icon", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, "refresh");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
}
function DocumentosRequeridosComponent_div_64_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, " Para modificar: selecciona todos los filtros ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
}
function DocumentosRequeridosComponent_div_65_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 52)(1, "div", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](2, "mat-spinner", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](3, "span", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](4, "Cargando cat\u00E1logos...");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
  }
}
function DocumentosRequeridosComponent_div_66_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 55)(1, "div", 56)(2, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](3, "warning");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](4, "span", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](5, "Algunos cat\u00E1logos no se pudieron cargar. Verifica la conexi\u00F3n.");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
  }
}
function DocumentosRequeridosComponent_div_68_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" Mostrando ", ctx_r12.dataSource.data.length, " registros ");
  }
}
function DocumentosRequeridosComponent_div_70_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](1, "mat-spinner", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
}
function DocumentosRequeridosComponent_th_73_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "th", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, " ID ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
}
function DocumentosRequeridosComponent_td_74_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "td", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const element_r37 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", element_r37.Id, " ");
  }
}
function DocumentosRequeridosComponent_th_76_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "th", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, " Agencia ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
}
function DocumentosRequeridosComponent_td_77_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "td", 63)(1, "span", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const element_r38 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](element_r38.AgenciaName || "N/A");
  }
}
function DocumentosRequeridosComponent_th_79_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "th", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, " Proceso ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
}
function DocumentosRequeridosComponent_td_80_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "td", 63)(1, "span", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const element_r39 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](element_r39.ProcesoName || "N/A");
  }
}
function DocumentosRequeridosComponent_th_82_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "th", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, " Tipo Cliente ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
}
function DocumentosRequeridosComponent_td_83_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "td", 63)(1, "span", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const element_r40 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](element_r40.TipoClienteName || "N/A");
  }
}
function DocumentosRequeridosComponent_th_85_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "th", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, " Tipo Operaci\u00F3n ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
}
function DocumentosRequeridosComponent_td_86_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "td", 63)(1, "span", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const element_r41 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](element_r41.TipoOperacionName || "N/A");
  }
}
function DocumentosRequeridosComponent_th_88_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "th", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, " Tipo de Documento ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
}
function DocumentosRequeridosComponent_td_89_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "td", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const element_r42 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", element_r42.TipoDocumentoName, " ");
  }
}
function DocumentosRequeridosComponent_th_91_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "th", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, " Requerido ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
}
function DocumentosRequeridosComponent_td_92_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "td", 67)(1, "span", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const element_r43 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngClass", element_r43.Required === "1" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", element_r43.Required === "1" ? "S\u00ED" : "No", " ");
  }
}
function DocumentosRequeridosComponent_th_94_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "th", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, " Expiraci\u00F3n ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
}
function DocumentosRequeridosComponent_td_95_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "td", 67)(1, "span", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const element_r44 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngClass", element_r44.ReqExpiration === "1" ? "bg-orange-100 text-orange-800" : "bg-gray-100 text-gray-800");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", element_r44.ReqExpiration === "1" ? "S\u00ED" : "No", " ");
  }
}
function DocumentosRequeridosComponent_tr_96_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](0, "tr", 70);
  }
}
function DocumentosRequeridosComponent_tr_97_Template(rf, ctx) {
  if (rf & 1) {
    const _r47 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "tr", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function DocumentosRequeridosComponent_tr_97_Template_tr_click_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r47);
      const row_r45 = restoredCtx.$implicit;
      const ctx_r46 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r46.onRowClick(row_r45));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const row_r45 = ctx.$implicit;
    const ctx_r31 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵclassProp"]("bg-blue-50", (ctx_r31.selectedItem == null ? null : ctx_r31.selectedItem.Id) === row_r45.Id);
  }
}
function DocumentosRequeridosComponent_div_98_p_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "p", 77)(1, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](2, "Para comenzar:");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](3, " Selecciona filtros espec\u00EDficos, deja en \"Seleccionar todos\" para ver todos los documentos, o crea una nueva configuraci\u00F3n ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
}
function DocumentosRequeridosComponent_div_98_p_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "p", 77);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, " Haz clic en \"Nueva Configuraci\u00F3n\" para agregar la primera configuraci\u00F3n de documentos ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
}
function DocumentosRequeridosComponent_div_98_div_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 78)(1, "p", 79);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](2, "Estado de los cat\u00E1logos:");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](3, "ul", 80)(4, "li");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](6, "li");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](8, "li");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](10, "li");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r50 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"]("\u2022 Agencias: ", ctx_r50.agencies.length, " cargadas");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"]("\u2022 Procesos: ", ctx_r50.processes.length, " cargados");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"]("\u2022 Tipos de Cliente: ", ctx_r50.customerTypes.length, " cargados");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"]("\u2022 Tipos de Operaci\u00F3n: ", ctx_r50.operationTypes.length, " cargados");
  }
}
function DocumentosRequeridosComponent_div_98_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 72)(1, "mat-icon", 73);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](2, "description");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](3, "p", 74);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](4, "No hay documentos requeridos configurados");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](5, DocumentosRequeridosComponent_div_98_p_5_Template, 4, 0, "p", 75)(6, DocumentosRequeridosComponent_div_98_p_6_Template, 2, 0, "p", 75)(7, DocumentosRequeridosComponent_div_98_div_7_Template, 12, 4, "div", 76);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r32 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", !ctx_r32.isConfigurationSelected());
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx_r32.isConfigurationSelected());
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", !ctx_r32.isConfigurationSelected());
  }
}
const _c0 = () => [10, 25, 50, 100, 200, 500, 1000];
class DocumentosRequeridosComponent {
  constructor(snackBar, dialog, procesoService, agencyService, costumerTypeService, tipoOperacionService, documentoRequeridoService) {
    this.snackBar = snackBar;
    this.dialog = dialog;
    this.procesoService = procesoService;
    this.agencyService = agencyService;
    this.costumerTypeService = costumerTypeService;
    this.tipoOperacionService = tipoOperacionService;
    this.documentoRequeridoService = documentoRequeridoService;
    this.displayedColumns = ['id', 'agencia', 'proceso', 'tipoCliente', 'tipoOperacion', 'tipoDocumento', 'requerido', 'requiereExpiracion'];
    this.dataSource = new _angular_material_table__WEBPACK_IMPORTED_MODULE_8__.MatTableDataSource([]);
    this.loading = false;
    this.loadingCatalogs = false;
    this.selectedProcess = '';
    this.selectedAgency = '';
    this.selectedCustomerType = '';
    this.selectedOperationType = '';
    // Datos para los dropdowns usando interfaces existentes
    this.processes = [];
    this.agencies = [];
    this.customerTypes = [];
    this.operationTypes = [];
    // Item seleccionado para edición
    this.selectedItem = null;
    // Estadísticas
    this.stats = null;
  }
  ngOnInit() {
    this.loadCatalogs();
    this.loadData();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  loadCatalogs() {
    this.loadingCatalogs = true;
    console.log('🔄 Iniciando carga de catálogos...');
    // Cargar procesos
    console.log('🔄 Cargando procesos...');
    this.procesoService.getProcesos().subscribe({
      next: response => {
        console.log('📋 Respuesta de procesos:', response);
        if (response?.success && response.data) {
          this.processes = response.data.processes || [];
          console.log('✅ Procesos cargados:', this.processes.length);
        } else {
          console.error('❌ Error cargando procesos:', response);
          this.snackBar.open('Error al cargar procesos', 'Error', {
            duration: 3000
          });
        }
        this.checkCatalogsLoaded();
      },
      error: error => {
        console.error('❌ Error cargando procesos:', error);
        this.snackBar.open('Error al cargar procesos', 'Error', {
          duration: 3000
        });
        this.checkCatalogsLoaded();
      }
    });
    // Cargar agencias con debug detallado
    console.log('🔄 Cargando agencias...');
    console.log('🏢 AgencyService disponible:', !!this.agencyService);
    // Verificar la URL que se va a construir
    const testUrl = this.agencyService['apiBaseService'].buildApiUrl('agency');
    console.log('🔗 URL que se va a construir para agencias:', testUrl);
    console.log('🔗 URL incluye localhost:8080:', testUrl.includes('localhost:8080'));
    // Usar método más simple sin parámetros
    this.agencyService.getAgencies({}).subscribe({
      next: response => {
        console.log('📋 Respuesta completa de agencias:', response);
        console.log('📋 Response.success:', response?.success);
        console.log('📋 Response.data:', response?.data);
        console.log('📋 Response.data.agencies:', response?.data?.agencies);
        if (response?.success && response.data) {
          this.agencies = response.data.agencies || [];
          console.log('✅ Agencias cargadas:', this.agencies.length);
          console.log('✅ Primeras 3 agencias:', this.agencies.slice(0, 3));
        } else {
          console.error('❌ Error cargando agencias - Respuesta inválida:', response);
          this.snackBar.open('Error al cargar agencias: Respuesta inválida', 'Error', {
            duration: 3000
          });
        }
        this.checkCatalogsLoaded();
      },
      error: error => {
        console.error('❌ Error cargando agencias:', error);
        console.error('❌ Error status:', error.status);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error error:', error.error);
        this.snackBar.open(`Error al cargar agencias: ${error.message || 'Error desconocido'}`, 'Error', {
          duration: 3000
        });
        this.checkCatalogsLoaded();
      }
    });
    // Cargar tipos de cliente
    console.log('🔄 Cargando tipos de cliente...');
    this.costumerTypeService.getCostumerTypes().subscribe({
      next: response => {
        console.log('📋 Respuesta de tipos de cliente:', response);
        if (response?.success && response.data) {
          this.customerTypes = response.data.costumer_types || [];
          console.log('✅ Tipos de cliente cargados:', this.customerTypes.length);
        } else {
          console.error('❌ Error cargando tipos de cliente:', response);
          this.snackBar.open('Error al cargar tipos de cliente', 'Error', {
            duration: 3000
          });
        }
        this.checkCatalogsLoaded();
      },
      error: error => {
        console.error('❌ Error cargando tipos de cliente:', error);
        this.snackBar.open('Error al cargar tipos de cliente', 'Error', {
          duration: 3000
        });
        this.checkCatalogsLoaded();
      }
    });
    // Cargar tipos de operación
    console.log('🔄 Cargando tipos de operación...');
    this.tipoOperacionService.getTiposOperacion().subscribe({
      next: response => {
        console.log('📋 Respuesta de tipos de operación:', response);
        if (response?.success && response.data) {
          this.operationTypes = response.data.operationTypes || [];
          console.log('✅ Tipos de operación cargados:', this.operationTypes.length);
        } else {
          console.error('❌ Error cargando tipos de operación:', response);
          this.snackBar.open('Error al cargar tipos de operación', 'Error', {
            duration: 3000
          });
        }
        this.checkCatalogsLoaded();
      },
      error: error => {
        console.error('❌ Error cargando tipos de operación:', error);
        this.snackBar.open('Error al cargar tipos de operación', 'Error', {
          duration: 3000
        });
        this.checkCatalogsLoaded();
      }
    });
  }
  checkCatalogsLoaded() {
    // Verificar si todos los catálogos han sido procesados (aunque estén vacíos)
    const totalCatalogs = 4; // procesos, agencias, tipos de cliente, tipos de operación
    const catalogsProcessed = (this.processes.length >= 0 ? 1 : 0) + (this.agencies.length >= 0 ? 1 : 0) + (this.customerTypes.length >= 0 ? 1 : 0) + (this.operationTypes.length >= 0 ? 1 : 0);
    if (catalogsProcessed >= totalCatalogs) {
      this.loadingCatalogs = false;
      console.log('✅ Catálogos procesados - Procesos:', this.processes.length, 'Agencias:', this.agencies.length, 'Tipos Cliente:', this.customerTypes.length, 'Tipos Operación:', this.operationTypes.length);
      // Si no hay catálogos, mostrar mensaje de error
      if (this.processes.length === 0 && this.agencies.length === 0 && this.customerTypes.length === 0 && this.operationTypes.length === 0) {
        this.snackBar.open('No se pudieron cargar los catálogos. Verifica la conexión con el backend.', 'Error', {
          duration: 5000
        });
      }
    }
  }
  loadData() {
    if (!this.isConfigurationSelected()) {
      this.dataSource.data = [];
      return;
    }
    this.loading = true;
    // Construir filtros solo con los valores seleccionados
    const filters = {};
    // Solo agregar filtros que estén seleccionados
    if (this.selectedProcess) filters.IdProcess = this.selectedProcess;
    if (this.selectedAgency) filters.IdAgency = this.selectedAgency;
    if (this.selectedCustomerType) filters.IdCostumerType = this.selectedCustomerType;
    if (this.selectedOperationType) filters.IdOperationType = this.selectedOperationType;
    this.documentoRequeridoService.getDocumentosRequeridos(filters).subscribe({
      next: response => {
        if (response.success && response.data) {
          this.dataSource.data = response.data.documentos || [];
        } else {
          this.snackBar.open(response.message || 'Error al cargar documentos', 'Error', {
            duration: 3000
          });
          this.dataSource.data = [];
        }
        this.loading = false;
      },
      error: error => {
        console.error('Error cargando documentos requeridos:', error);
        this.snackBar.open('Error al cargar documentos requeridos', 'Error', {
          duration: 3000
        });
        this.dataSource.data = [];
        this.loading = false;
      }
    });
  }
  onConfigurationChange() {
    // Cargar datos cuando cambia cualquier selección
    this.loadData();
    // Limpiar el item seleccionado cuando cambian los filtros
    this.selectedItem = null;
  }
  isConfigurationSelected() {
    // Si no hay ninguna selección, considerar como si estuviera todo seleccionado (ver todos los datos)
    if (!this.selectedProcess && !this.selectedAgency && !this.selectedCustomerType && !this.selectedOperationType) {
      return true;
    }
    // Si hay al menos una selección, permitir mostrar datos
    return true;
  }
  hasDataForConfiguration() {
    // Para modificar la configuración, solo se requiere que TODOS los filtros estén seleccionados
    // No es necesario que haya datos, porque se modifica la configuración base
    return !!(this.selectedProcess && this.selectedAgency && this.selectedCustomerType && this.selectedOperationType);
  }
  clearFilters() {
    this.selectedProcess = '';
    this.selectedAgency = '';
    this.selectedCustomerType = '';
    this.selectedOperationType = '';
    this.selectedItem = null; // También limpiar el item seleccionado
    this.loadData(); // Recargar todos los datos después de limpiar filtros
    this.snackBar.open('Filtros limpiados', 'Info', {
      duration: 2000
    });
  }
  refreshData() {
    this.loadData();
  }
  addDocumentoRequerido() {
    // Para crear una nueva configuración, no es necesario tener filtros seleccionados
    // Se puede crear con valores por defecto o vacíos
    const configuracion = {
      IdProcess: this.selectedProcess || '',
      IdAgency: this.selectedAgency || '',
      IdCostumerType: this.selectedCustomerType || '',
      IdOperationType: this.selectedOperationType || ''
    };
    const dialogRef = this.dialog.open(_documento_requerido_edit_dialog_documento_requerido_edit_dialog_component__WEBPACK_IMPORTED_MODULE_0__.DocumentoRequeridoEditDialogComponent, {
      width: '800px',
      data: {
        mode: 'create',
        configuracion: configuracion
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
        this.snackBar.open('Documento requerido creado exitosamente', 'Éxito', {
          duration: 2000
        });
      }
    });
  }
  editDocumentoRequerido(item) {
    if (!item) {
      this.snackBar.open('Selecciona un documento para editar la configuración', 'Warning', {
        duration: 3000
      });
      return;
    }
    const dialogRef = this.dialog.open(_documento_requerido_edit_dialog_documento_requerido_edit_dialog_component__WEBPACK_IMPORTED_MODULE_0__.DocumentoRequeridoEditDialogComponent, {
      width: '800px',
      data: {
        mode: 'edit',
        documento: item
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
        this.snackBar.open('Configuración actualizada exitosamente', 'Éxito', {
          duration: 2000
        });
      }
    });
  }
  editConfiguration() {
    // Crear objeto de configuración con los filtros seleccionados
    const configuracion = {
      IdProcess: this.selectedProcess,
      IdAgency: this.selectedAgency,
      IdCostumerType: this.selectedCustomerType,
      IdOperationType: this.selectedOperationType
    };
    const dialogRef = this.dialog.open(_documento_requerido_edit_dialog_documento_requerido_edit_dialog_component__WEBPACK_IMPORTED_MODULE_0__.DocumentoRequeridoEditDialogComponent, {
      width: '800px',
      data: {
        mode: 'edit',
        configuracion: configuracion
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
        this.snackBar.open('Configuración general actualizada exitosamente', 'Éxito', {
          duration: 2000
        });
      }
    });
  }
  // Método para seleccionar un item de la tabla
  onRowClick(element) {
    this.selectedItem = element;
    console.log('Item seleccionado:', element);
  }
  // Método para verificar si se puede duplicar la configuración
  canDuplicateConfiguration() {
    // Solo se puede duplicar si TODOS los filtros están seleccionados
    // y hay datos para esa configuración
    return this.hasDataForConfiguration() && this.dataSource.data.length > 0;
  }
  // Método para abrir el diálogo de duplicación
  duplicateConfiguration() {
    if (!this.canDuplicateConfiguration()) {
      this.snackBar.open('Selecciona una configuración completa para duplicar', 'Warning', {
        duration: 3000
      });
      return;
    }
    // Obtener nombres de los elementos seleccionados
    const currentAgency = this.agencies.find(a => a.Id.toString() === this.selectedAgency);
    const currentProcess = this.processes.find(p => p.Id.toString() === this.selectedProcess);
    const currentCustomerType = this.customerTypes.find(c => c.Id.toString() === this.selectedCustomerType);
    const currentOperationType = this.operationTypes.find(o => o.Id.toString() === this.selectedOperationType);
    if (!currentAgency || !currentProcess || !currentCustomerType || !currentOperationType) {
      this.snackBar.open('Error obteniendo información de la configuración', 'Error', {
        duration: 3000
      });
      return;
    }
    // Crear objeto de configuración con los filtros seleccionados
    const configuracion = {
      IdProcess: this.selectedProcess,
      IdAgency: parseInt(this.selectedAgency),
      IdCostumerType: this.selectedCustomerType,
      IdOperationType: this.selectedOperationType
    };
    const dialogRef = this.dialog.open(_duplicate_configuration_dialog_duplicate_configuration_dialog_component__WEBPACK_IMPORTED_MODULE_1__.DuplicateConfigurationDialogComponent, {
      width: '800px',
      data: {
        configuracion: configuracion,
        currentAgencyName: currentAgency.Name,
        processName: currentProcess.Name,
        customerTypeName: currentCustomerType.Name,
        operationTypeName: currentOperationType.Name
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.loadData();
        this.snackBar.open(`Configuración duplicada exitosamente a ${result.agenciesCount} agencia(s)`, 'Éxito', {
          duration: 3000
        });
      }
    });
  }
  static #_ = this.ɵfac = function DocumentosRequeridosComponent_Factory(t) {
    return new (t || DocumentosRequeridosComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_9__.MatSnackBar), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_10__.MatDialog), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_core_services_proceso_service__WEBPACK_IMPORTED_MODULE_2__.ProcesoService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_core_services_agency_service__WEBPACK_IMPORTED_MODULE_3__.AgencyService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_core_services_costumer_type_service__WEBPACK_IMPORTED_MODULE_4__.CostumerTypeService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_core_services_tipo_operacion_service__WEBPACK_IMPORTED_MODULE_5__.TipoOperacionService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_core_services_documento_requerido_service__WEBPACK_IMPORTED_MODULE_6__.DocumentoRequeridoService));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineComponent"]({
    type: DocumentosRequeridosComponent,
    selectors: [["app-documentos-requeridos"]],
    viewQuery: function DocumentosRequeridosComponent_Query(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵviewQuery"](_angular_material_paginator__WEBPACK_IMPORTED_MODULE_11__.MatPaginator, 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵviewQuery"](_angular_material_sort__WEBPACK_IMPORTED_MODULE_12__.MatSort, 5);
      }
      if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵloadQuery"]()) && (ctx.paginator = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵloadQuery"]()) && (ctx.sort = _t.first);
      }
    },
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵStandaloneFeature"]],
    decls: 100,
    vars: 36,
    consts: [[1, "p-6"], [1, "flex", "items-center", "justify-between", "mb-4"], [1, "flex", "items-center", "gap-3"], ["mat-raised-button", "", "color", "primary", "matTooltip", "Agregar nueva configuraci\u00F3n de documentos", 1, "flex", "items-center", "gap-2", 3, "disabled", "click"], ["mat-raised-button", "", "color", "accent", "matTooltip", "Duplicar configuraci\u00F3n a otras agencias", 1, "flex", "items-center", "gap-2", 3, "disabled", "click"], ["class", "flex items-center gap-2 text-blue-600", 4, "ngIf"], [1, "bg-white", "rounded-lg", "shadow-sm", "border", "p-4", "mb-6"], [1, "text-lg", "font-medium", "text-gray-900"], ["mat-stroked-button", "", "color", "warn", "matTooltip", "Limpiar selecci\u00F3n", 1, "flex", "items-center", "gap-2", 3, "disabled", "click"], ["mat-stroked-button", "", "color", "accent", "matTooltip", "Recargar datos", 1, "flex", "items-center", "gap-2", 3, "disabled", "click"], [1, "grid", "grid-cols-1", "md:grid-cols-5", "gap-4"], ["appearance", "outline", 1, "w-full"], [3, "ngModel", "disabled", "ngModelChange"], ["value", ""], [3, "value", 4, "ngFor", "ngForOf"], ["matSuffix", "", "class", "animate-spin", 4, "ngIf"], [1, "flex", "flex-col", "items-start"], ["mat-stroked-button", "", "color", "accent", "matTooltip", "Modificar configuraci\u00F3n general de esta combinaci\u00F3n de filtros", 1, "flex", "items-center", "gap-2", "w-full", 3, "disabled", "click"], ["class", "mt-1 text-xs text-gray-500 text-center w-full", 4, "ngIf"], ["class", "mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg", 4, "ngIf"], ["class", "mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg", 4, "ngIf"], [1, "bg-white", "rounded-lg", "shadow-sm", "border", "overflow-hidden"], ["class", "px-4 py-2 bg-gray-50 border-b text-sm text-gray-600", 4, "ngIf"], [1, "relative"], ["class", "absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10", 4, "ngIf"], ["mat-table", "", "matSort", "", 1, "w-full", "compact-table", 2, "line-height", "1", 3, "dataSource"], ["matColumnDef", "id"], ["mat-header-cell", "", "mat-sort-header", "", "class", "w-12 text-center py-1 bg-gray-50 text-xs font-medium text-gray-700", 4, "matHeaderCellDef"], ["mat-cell", "", "class", "text-center text-xs font-mono text-gray-600 py-0", 4, "matCellDef"], ["matColumnDef", "agencia"], ["mat-header-cell", "", "mat-sort-header", "", "class", "w-40 py-1 bg-gray-50 text-xs font-medium text-gray-700", 4, "matHeaderCellDef"], ["mat-cell", "", "class", "py-0", 4, "matCellDef"], ["matColumnDef", "proceso"], ["matColumnDef", "tipoCliente"], ["matColumnDef", "tipoOperacion"], ["matColumnDef", "tipoDocumento"], ["mat-cell", "", "class", "px-1.5 py-0 text-sm text-gray-900", 4, "matCellDef"], ["matColumnDef", "requerido"], ["mat-header-cell", "", "class", "w-20 text-center py-1 bg-gray-50 text-xs font-medium text-gray-700", 4, "matHeaderCellDef"], ["mat-cell", "", "class", "text-center py-0", 4, "matCellDef"], ["matColumnDef", "requiereExpiracion"], ["mat-header-cell", "", "class", "w-24 text-center py-1 bg-gray-50 text-xs font-medium text-gray-700", 4, "matHeaderCellDef"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", "class", "cursor-pointer hover:bg-gray-50 transition-colors !min-h-0 !h-8", 3, "bg-blue-50", "click", 4, "matRowDef", "matRowDefColumns"], ["class", "text-center py-8", 4, "ngIf"], ["showFirstLastButtons", "", "aria-label", "Seleccionar p\u00E1gina de documentos requeridos", 3, "pageSizeOptions", "pageSize"], [1, "flex", "items-center", "gap-2", "text-blue-600"], ["diameter", "20"], [1, "text-sm"], [3, "value"], ["matSuffix", "", 1, "animate-spin"], [1, "mt-1", "text-xs", "text-gray-500", "text-center", "w-full"], [1, "mt-4", "p-3", "bg-blue-50", "border", "border-blue-200", "rounded-lg"], [1, "flex", "items-center", "gap-2", "text-blue-700"], [1, "text-sm", "font-medium"], [1, "mt-4", "p-3", "bg-yellow-50", "border", "border-yellow-200", "rounded-lg"], [1, "flex", "items-center", "gap-2", "text-yellow-700"], [1, "px-4", "py-2", "bg-gray-50", "border-b", "text-sm", "text-gray-600"], [1, "absolute", "inset-0", "bg-white", "bg-opacity-75", "flex", "items-center", "justify-center", "z-10"], ["diameter", "50"], ["mat-header-cell", "", "mat-sort-header", "", 1, "w-12", "text-center", "py-1", "bg-gray-50", "text-xs", "font-medium", "text-gray-700"], ["mat-cell", "", 1, "text-center", "text-xs", "font-mono", "text-gray-600", "py-0"], ["mat-header-cell", "", "mat-sort-header", "", 1, "w-40", "py-1", "bg-gray-50", "text-xs", "font-medium", "text-gray-700"], ["mat-cell", "", 1, "py-0"], [1, "text-xs", "text-gray-700"], ["mat-cell", "", 1, "px-1.5", "py-0", "text-sm", "text-gray-900"], ["mat-header-cell", "", 1, "w-20", "text-center", "py-1", "bg-gray-50", "text-xs", "font-medium", "text-gray-700"], ["mat-cell", "", 1, "text-center", "py-0"], [1, "inline-flex", "items-center", "px-2", "py-1", "rounded-full", "text-xs", "font-medium", 3, "ngClass"], ["mat-header-cell", "", 1, "w-24", "text-center", "py-1", "bg-gray-50", "text-xs", "font-medium", "text-gray-700"], ["mat-header-row", ""], ["mat-row", "", 1, "cursor-pointer", "hover:bg-gray-50", "transition-colors", "!min-h-0", "!h-8", 3, "click"], [1, "text-center", "py-8"], [1, "text-gray-400", "text-6xl", "mb-4"], [1, "text-gray-500", "text-lg"], ["class", "text-gray-400", 4, "ngIf"], ["class", "mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-md mx-auto", 4, "ngIf"], [1, "text-gray-400"], [1, "mt-4", "p-4", "bg-blue-50", "border", "border-blue-200", "rounded-lg", "max-w-md", "mx-auto"], [1, "text-blue-700", "text-sm", "font-medium"], [1, "text-blue-600", "text-sm", "mt-2", "space-y-1"]],
    template: function DocumentosRequeridosComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 0)(1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](2, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](3, "div", 2)(4, "button", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function DocumentosRequeridosComponent_Template_button_click_4_listener() {
          return ctx.addDocumentoRequerido();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](5, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](6, "add");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](7, " Nueva Configuraci\u00F3n ");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](8, "button", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function DocumentosRequeridosComponent_Template_button_click_8_listener() {
          return ctx.duplicateConfiguration();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](9, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](10, "content_copy");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](11, " Duplicar Configuraci\u00F3n ");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](12, DocumentosRequeridosComponent_div_12_Template, 4, 0, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](13, "div", 6)(14, "div", 1)(15, "h3", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](16, "Selecci\u00F3n de Configuraci\u00F3n");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](17, "div", 2)(18, "button", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function DocumentosRequeridosComponent_Template_button_click_18_listener() {
          return ctx.clearFilters();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](19, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](20, "clear_all");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](21, " Limpiar Selecci\u00F3n ");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](22, "button", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function DocumentosRequeridosComponent_Template_button_click_22_listener() {
          return ctx.refreshData();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](23, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](24, "refresh");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](25, " Recargar ");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](26, "div", 10)(27, "mat-form-field", 11)(28, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](29, "Agencia");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](30, "mat-select", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("ngModelChange", function DocumentosRequeridosComponent_Template_mat_select_ngModelChange_30_listener($event) {
          return ctx.selectedAgency = $event;
        })("ngModelChange", function DocumentosRequeridosComponent_Template_mat_select_ngModelChange_30_listener() {
          return ctx.onConfigurationChange();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](31, "mat-option", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](32, "Seleccionar todas las agencias");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](33, DocumentosRequeridosComponent_mat_option_33_Template, 2, 2, "mat-option", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](34, DocumentosRequeridosComponent_mat_icon_34_Template, 2, 0, "mat-icon", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](35, "mat-form-field", 11)(36, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](37, "Proceso");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](38, "mat-select", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("ngModelChange", function DocumentosRequeridosComponent_Template_mat_select_ngModelChange_38_listener($event) {
          return ctx.selectedProcess = $event;
        })("ngModelChange", function DocumentosRequeridosComponent_Template_mat_select_ngModelChange_38_listener() {
          return ctx.onConfigurationChange();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](39, "mat-option", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](40, "Seleccionar todos los procesos");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](41, DocumentosRequeridosComponent_mat_option_41_Template, 2, 2, "mat-option", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](42, DocumentosRequeridosComponent_mat_icon_42_Template, 2, 0, "mat-icon", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](43, "mat-form-field", 11)(44, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](45, "Tipo de Cliente");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](46, "mat-select", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("ngModelChange", function DocumentosRequeridosComponent_Template_mat_select_ngModelChange_46_listener($event) {
          return ctx.selectedCustomerType = $event;
        })("ngModelChange", function DocumentosRequeridosComponent_Template_mat_select_ngModelChange_46_listener() {
          return ctx.onConfigurationChange();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](47, "mat-option", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](48, "Seleccionar todos los tipos de cliente");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](49, DocumentosRequeridosComponent_mat_option_49_Template, 2, 2, "mat-option", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](50, DocumentosRequeridosComponent_mat_icon_50_Template, 2, 0, "mat-icon", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](51, "mat-form-field", 11)(52, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](53, "Tipo Operaci\u00F3n");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](54, "mat-select", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("ngModelChange", function DocumentosRequeridosComponent_Template_mat_select_ngModelChange_54_listener($event) {
          return ctx.selectedOperationType = $event;
        })("ngModelChange", function DocumentosRequeridosComponent_Template_mat_select_ngModelChange_54_listener() {
          return ctx.onConfigurationChange();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](55, "mat-option", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](56, "Seleccionar todos los tipos de operaci\u00F3n");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](57, DocumentosRequeridosComponent_mat_option_57_Template, 2, 2, "mat-option", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](58, DocumentosRequeridosComponent_mat_icon_58_Template, 2, 0, "mat-icon", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](59, "div", 16)(60, "button", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function DocumentosRequeridosComponent_Template_button_click_60_listener() {
          return ctx.editConfiguration();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](61, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](62, "edit");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](63, " Modificar ");
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](64, DocumentosRequeridosComponent_div_64_Template, 2, 0, "div", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](65, DocumentosRequeridosComponent_div_65_Template, 5, 0, "div", 19)(66, DocumentosRequeridosComponent_div_66_Template, 6, 0, "div", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](67, "div", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](68, DocumentosRequeridosComponent_div_68_Template, 2, 1, "div", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](69, "div", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](70, DocumentosRequeridosComponent_div_70_Template, 2, 0, "div", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](71, "table", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerStart"](72, 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](73, DocumentosRequeridosComponent_th_73_Template, 2, 0, "th", 27)(74, DocumentosRequeridosComponent_td_74_Template, 2, 1, "td", 28);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerStart"](75, 29);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](76, DocumentosRequeridosComponent_th_76_Template, 2, 0, "th", 30)(77, DocumentosRequeridosComponent_td_77_Template, 3, 1, "td", 31);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerStart"](78, 32);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](79, DocumentosRequeridosComponent_th_79_Template, 2, 0, "th", 30)(80, DocumentosRequeridosComponent_td_80_Template, 3, 1, "td", 31);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerStart"](81, 33);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](82, DocumentosRequeridosComponent_th_82_Template, 2, 0, "th", 30)(83, DocumentosRequeridosComponent_td_83_Template, 3, 1, "td", 31);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerStart"](84, 34);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](85, DocumentosRequeridosComponent_th_85_Template, 2, 0, "th", 30)(86, DocumentosRequeridosComponent_td_86_Template, 3, 1, "td", 31);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerStart"](87, 35);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](88, DocumentosRequeridosComponent_th_88_Template, 2, 0, "th", 30)(89, DocumentosRequeridosComponent_td_89_Template, 2, 1, "td", 36);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerStart"](90, 37);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](91, DocumentosRequeridosComponent_th_91_Template, 2, 0, "th", 38)(92, DocumentosRequeridosComponent_td_92_Template, 3, 2, "td", 39);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerStart"](93, 40);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](94, DocumentosRequeridosComponent_th_94_Template, 2, 0, "th", 41)(95, DocumentosRequeridosComponent_td_95_Template, 3, 2, "td", 39);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](96, DocumentosRequeridosComponent_tr_96_Template, 1, 0, "tr", 42)(97, DocumentosRequeridosComponent_tr_97_Template, 1, 2, "tr", 43);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](98, DocumentosRequeridosComponent_div_98_Template, 8, 3, "div", 44);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](99, "mat-paginator", 45);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("disabled", !ctx.isConfigurationSelected() || ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("disabled", !ctx.canDuplicateConfiguration() || ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("disabled", !ctx.selectedProcess && !ctx.selectedAgency && !ctx.selectedCustomerType && !ctx.selectedOperationType);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("disabled", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵclassProp"]("animate-spin", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngModel", ctx.selectedAgency)("disabled", ctx.loadingCatalogs);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngForOf", ctx.agencies);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.loadingCatalogs);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngModel", ctx.selectedProcess)("disabled", ctx.loadingCatalogs);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngForOf", ctx.processes);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.loadingCatalogs);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngModel", ctx.selectedCustomerType)("disabled", ctx.loadingCatalogs);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngForOf", ctx.customerTypes);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.loadingCatalogs);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngModel", ctx.selectedOperationType)("disabled", ctx.loadingCatalogs);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngForOf", ctx.operationTypes);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.loadingCatalogs);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("disabled", !ctx.hasDataForConfiguration());
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", !ctx.hasDataForConfiguration());
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.loadingCatalogs);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", !ctx.loadingCatalogs && (ctx.processes.length === 0 || ctx.agencies.length === 0 || ctx.customerTypes.length === 0 || ctx.operationTypes.length === 0));
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", !ctx.loading && ctx.dataSource.data.length > 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("dataSource", ctx.dataSource);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](25);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("matHeaderRowDef", ctx.displayedColumns);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("matRowDefColumns", ctx.displayedColumns);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.dataSource.data.length === 0 && !ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("pageSizeOptions", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpureFunction0"](35, _c0))("pageSize", 10);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_13__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_13__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_13__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_13__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_14__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_14__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_14__.NgModel, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_15__.MatFormFieldModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_15__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_15__.MatLabel, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_15__.MatSuffix, _angular_material_input__WEBPACK_IMPORTED_MODULE_16__.MatInputModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_17__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_17__.MatButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_18__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_18__.MatIcon, _angular_material_table__WEBPACK_IMPORTED_MODULE_8__.MatTableModule, _angular_material_table__WEBPACK_IMPORTED_MODULE_8__.MatTable, _angular_material_table__WEBPACK_IMPORTED_MODULE_8__.MatHeaderCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_8__.MatHeaderRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_8__.MatColumnDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_8__.MatCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_8__.MatRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_8__.MatHeaderCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_8__.MatCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_8__.MatHeaderRow, _angular_material_table__WEBPACK_IMPORTED_MODULE_8__.MatRow, _angular_material_paginator__WEBPACK_IMPORTED_MODULE_11__.MatPaginatorModule, _angular_material_paginator__WEBPACK_IMPORTED_MODULE_11__.MatPaginator, _angular_material_sort__WEBPACK_IMPORTED_MODULE_12__.MatSortModule, _angular_material_sort__WEBPACK_IMPORTED_MODULE_12__.MatSort, _angular_material_sort__WEBPACK_IMPORTED_MODULE_12__.MatSortHeader, _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_9__.MatSnackBarModule, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_10__.MatDialogModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_19__.MatProgressSpinnerModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_19__.MatProgressSpinner, _angular_material_select__WEBPACK_IMPORTED_MODULE_20__.MatSelectModule, _angular_material_select__WEBPACK_IMPORTED_MODULE_20__.MatSelect, _angular_material_core__WEBPACK_IMPORTED_MODULE_21__.MatOption],
    styles: [".mat-mdc-table[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.compact-table[_ngcontent-%COMP%]   .mat-mdc-header-cell[_ngcontent-%COMP%] {\n  padding: 4px 8px;\n  font-size: 0.75rem;\n  line-height: 1;\n}\n.compact-table[_ngcontent-%COMP%]   .mat-mdc-cell[_ngcontent-%COMP%] {\n  padding: 0 8px;\n  font-size: 0.75rem;\n  line-height: 1;\n}\n.compact-table[_ngcontent-%COMP%]   .mat-mdc-row[_ngcontent-%COMP%] {\n  height: 32px !important;\n  min-height: 32px !important;\n}\n.compact-table[_ngcontent-%COMP%]   .mat-mdc-header-row[_ngcontent-%COMP%] {\n  height: 32px !important;\n  min-height: 32px !important;\n}\n\n.mat-mdc-header-cell[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: #374151;\n  background-color: #f9fafb;\n}\n\n.mat-mdc-row[_ngcontent-%COMP%]:hover {\n  background-color: #f3f4f6;\n}\n\n.animate-spin[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_spin 1s linear infinite;\n}\n\n@keyframes _ngcontent-%COMP%_spin {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n.mat-mdc-form-field[_ngcontent-%COMP%] {\n  margin-bottom: 0;\n}\n\n.mat-mdc-icon-button[_ngcontent-%COMP%] {\n  transition: all 0.2s ease-in-out;\n}\n\n.mat-mdc-icon-button[_ngcontent-%COMP%]:hover {\n  transform: scale(1.1);\n}\n\n.no-data-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 2rem;\n  color: #6b7280;\n}\n\n@media (max-width: 768px) {\n  .container[_ngcontent-%COMP%] {\n    padding: 1rem;\n  }\n  .grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .flex.items-center.justify-between[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 1rem;\n    align-items: stretch;\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvY29uZmlndXJhY2lvbi9kb2N1bWVudG9zLXJlcXVlcmlkb3MvZG9jdW1lbnRvcy1yZXF1ZXJpZG9zLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0VBQ0UsV0FBQTtBQUFGOztBQUtFO0VBQ0UsZ0JBQUE7RUFDQSxrQkFBQTtFQUNBLGNBQUE7QUFGSjtBQUtFO0VBQ0UsY0FBQTtFQUNBLGtCQUFBO0VBQ0EsY0FBQTtBQUhKO0FBTUU7RUFDRSx1QkFBQTtFQUNBLDJCQUFBO0FBSko7QUFPRTtFQUNFLHVCQUFBO0VBQ0EsMkJBQUE7QUFMSjs7QUFTQTtFQUNFLGdCQUFBO0VBQ0EsY0FBQTtFQUNBLHlCQUFBO0FBTkY7O0FBU0E7RUFDRSx5QkFBQTtBQU5GOztBQVVBO0VBQ0Usa0NBQUE7QUFQRjs7QUFVQTtFQUNFO0lBQ0UsdUJBQUE7RUFQRjtFQVNBO0lBQ0UseUJBQUE7RUFQRjtBQUNGO0FBV0E7RUFDRSxnQkFBQTtBQVRGOztBQWFBO0VBQ0UsZ0NBQUE7QUFWRjs7QUFhQTtFQUNFLHFCQUFBO0FBVkY7O0FBY0E7RUFDRSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0VBQ0EsYUFBQTtFQUNBLGNBQUE7QUFYRjs7QUFlQTtFQUNFO0lBQ0UsYUFBQTtFQVpGO0VBZUE7SUFDRSwwQkFBQTtFQWJGO0VBZ0JBO0lBQ0Usc0JBQUE7SUFDQSxTQUFBO0lBQ0Esb0JBQUE7RUFkRjtBQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRXN0aWxvcyBlc3BlY8ODwq1maWNvcyBwYXJhIGVsIGNvbXBvbmVudGUgZGUgZG9jdW1lbnRvcyByZXF1ZXJpZG9zXG4ubWF0LW1kYy10YWJsZSB7XG4gIHdpZHRoOiAxMDAlO1xufVxuXG4vLyBUYWJsYSBjb21wYWN0YSAtIG1pc21vIGVzdGlsbyBxdWUgdXN1YXJpb3Ncbi5jb21wYWN0LXRhYmxlIHtcbiAgLm1hdC1tZGMtaGVhZGVyLWNlbGwge1xuICAgIHBhZGRpbmc6IDRweCA4cHg7XG4gICAgZm9udC1zaXplOiAwLjc1cmVtO1xuICAgIGxpbmUtaGVpZ2h0OiAxO1xuICB9XG4gIFxuICAubWF0LW1kYy1jZWxsIHtcbiAgICBwYWRkaW5nOiAwIDhweDtcbiAgICBmb250LXNpemU6IDAuNzVyZW07XG4gICAgbGluZS1oZWlnaHQ6IDE7XG4gIH1cbiAgXG4gIC5tYXQtbWRjLXJvdyB7XG4gICAgaGVpZ2h0OiAzMnB4ICFpbXBvcnRhbnQ7XG4gICAgbWluLWhlaWdodDogMzJweCAhaW1wb3J0YW50O1xuICB9XG4gIFxuICAubWF0LW1kYy1oZWFkZXItcm93IHtcbiAgICBoZWlnaHQ6IDMycHggIWltcG9ydGFudDtcbiAgICBtaW4taGVpZ2h0OiAzMnB4ICFpbXBvcnRhbnQ7XG4gIH1cbn1cblxuLm1hdC1tZGMtaGVhZGVyLWNlbGwge1xuICBmb250LXdlaWdodDogNjAwO1xuICBjb2xvcjogIzM3NDE1MTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y5ZmFmYjtcbn1cblxuLm1hdC1tZGMtcm93OmhvdmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2YzZjRmNjtcbn1cblxuLy8gQW5pbWFjacODwrNuIHBhcmEgZWwgc3Bpbm5lciBkZSBjYXJnYVxuLmFuaW1hdGUtc3BpbiB7XG4gIGFuaW1hdGlvbjogc3BpbiAxcyBsaW5lYXIgaW5maW5pdGU7XG59XG5cbkBrZXlmcmFtZXMgc3BpbiB7XG4gIGZyb20ge1xuICAgIHRyYW5zZm9ybTogcm90YXRlKDBkZWcpO1xuICB9XG4gIHRvIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpO1xuICB9XG59XG5cbi8vIEVzdGlsb3MgcGFyYSBsb3MgZmlsdHJvc1xuLm1hdC1tZGMtZm9ybS1maWVsZCB7XG4gIG1hcmdpbi1ib3R0b206IDA7XG59XG5cbi8vIEVzdGlsb3MgcGFyYSBsb3MgYm90b25lcyBkZSBhY2Npw4PCs25cbi5tYXQtbWRjLWljb24tYnV0dG9uIHtcbiAgdHJhbnNpdGlvbjogYWxsIDAuMnMgZWFzZS1pbi1vdXQ7XG59XG5cbi5tYXQtbWRjLWljb24tYnV0dG9uOmhvdmVyIHtcbiAgdHJhbnNmb3JtOiBzY2FsZSgxLjEpO1xufVxuXG4vLyBFc3RpbG9zIHBhcmEgZWwgbWVuc2FqZSBkZSBubyBkYXRvc1xuLm5vLWRhdGEtY29udGFpbmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIHBhZGRpbmc6IDJyZW07XG4gIGNvbG9yOiAjNmI3MjgwO1xufVxuXG4vLyBSZXNwb25zaXZlIGRlc2lnblxuQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gIC5jb250YWluZXIge1xuICAgIHBhZGRpbmc6IDFyZW07XG4gIH1cbiAgXG4gIC5ncmlkIHtcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmcjtcbiAgfVxuICBcbiAgLmZsZXguaXRlbXMtY2VudGVyLmp1c3RpZnktYmV0d2VlbiB7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBnYXA6IDFyZW07XG4gICAgYWxpZ24taXRlbXM6IHN0cmV0Y2g7XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
  });
}

/***/ }),

/***/ 15915:
/*!**************************************************************************************************************************************!*\
  !*** ./src/app/pages/configuracion/documentos-requeridos/duplicate-configuration-dialog/duplicate-configuration-dialog.component.ts ***!
  \**************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DuplicateConfigurationDialogComponent: () => (/* binding */ DuplicateConfigurationDialogComponent)
/* harmony export */ });
/* harmony import */ var _Users_jclimonero_Documents_Developer_SingleFile_FE_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 71670);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/forms */ 28849);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/dialog */ 17401);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/form-field */ 51333);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/input */ 10026);
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/select */ 96355);
/* harmony import */ var _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/checkbox */ 56658);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/progress-spinner */ 33910);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/snack-bar */ 49409);
/* harmony import */ var _angular_material_chips__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/chips */ 21757);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _core_services_agency_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../core/services/agency.service */ 92883);
/* harmony import */ var _core_services_documento_requerido_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../core/services/documento-requerido.service */ 13146);



























function DuplicateConfigurationDialogComponent_div_53_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](1, "mat-spinner", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](2, "span", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](3, "Cargando agencias...");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
  }
}
function DuplicateConfigurationDialogComponent_div_54_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 38)(1, "mat-icon", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2, "business");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "p", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](4, "No hay agencias disponibles");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "p", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](6, "Todas las agencias ya tienen esta configuraci\u00F3n o no hay agencias para mostrar.");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
  }
}
function DuplicateConfigurationDialogComponent_div_55_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 44)(1, "mat-checkbox", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("change", function DuplicateConfigurationDialogComponent_div_55_div_1_Template_mat_checkbox_change_1_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r9);
      const agency_r7 = restoredCtx.$implicit;
      const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r8.onAgencySelectionChange(agency_r7.Id, $event.checked));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](2, "div", 46)(3, "div", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const agency_r7 = ctx.$implicit;
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("checked", ctx_r6.isAgencySelected(agency_r7.Id))("disabled", ctx_r6.loading);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](agency_r7.Name);
  }
}
function DuplicateConfigurationDialogComponent_div_55_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, DuplicateConfigurationDialogComponent_div_55_div_1_Template, 5, 3, "div", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx_r2.filteredAgencies);
  }
}
function DuplicateConfigurationDialogComponent_div_61_mat_chip_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "mat-chip", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const agencyId_r12 = ctx.$implicit;
    const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", ctx_r10.getAgencyName(agencyId_r12), " ");
  }
}
function DuplicateConfigurationDialogComponent_div_61_span_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" +", ctx_r11.selectedAgencies.length - 4, " m\u00E1s ");
  }
}
function DuplicateConfigurationDialogComponent_div_61_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, DuplicateConfigurationDialogComponent_div_61_mat_chip_1_Template, 2, 1, "mat-chip", 49)(2, DuplicateConfigurationDialogComponent_div_61_span_2_Template, 2, 1, "span", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx_r3.selectedAgencies.slice(0, 4));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx_r3.selectedAgencies.length > 4);
  }
}
function DuplicateConfigurationDialogComponent_mat_spinner_66_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](0, "mat-spinner", 53);
  }
}
function DuplicateConfigurationDialogComponent_mat_icon_67_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "content_copy");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
class DuplicateConfigurationDialogComponent {
  constructor(dialogRef, data, agencyService, documentoRequeridoService, snackBar) {
    this.dialogRef = dialogRef;
    this.data = data;
    this.agencyService = agencyService;
    this.documentoRequeridoService = documentoRequeridoService;
    this.snackBar = snackBar;
    this.loading = false;
    this.agencies = [];
    this.availableAgencies = [];
    this.selectedAgencies = [];
    this.searchTerm = '';
  }
  ngOnInit() {
    this.loadAgencies();
  }
  loadAgencies() {
    var _this = this;
    return (0,_Users_jclimonero_Documents_Developer_SingleFile_FE_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this.loading = true;
      try {
        // Cargar todas las agencias
        const response = yield _this.agencyService.getAgencies().toPromise();
        _this.agencies = response?.data?.agencies || [];
        // Filtrar agencias disponibles (excluyendo la actual)
        _this.availableAgencies = _this.agencies.filter(agency => agency.Id !== _this.data.configuracion.IdAgency);
        // Verificar qué agencias ya tienen esta configuración
        yield _this.checkExistingConfigurations();
      } catch (error) {
        console.error('Error cargando agencias:', error);
        _this.snackBar.open('Error cargando agencias', 'Error', {
          duration: 3000
        });
      } finally {
        _this.loading = false;
      }
    })();
  }
  checkExistingConfigurations() {
    var _this2 = this;
    return (0,_Users_jclimonero_Documents_Developer_SingleFile_FE_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        // Para cada agencia disponible, verificar si ya tiene esta configuración
        const promises = _this2.availableAgencies.map( /*#__PURE__*/function () {
          var _ref = (0,_Users_jclimonero_Documents_Developer_SingleFile_FE_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (agency) {
            // Verificar si existe configuración para esta agencia
            const hasConfig = yield _this2.documentoRequeridoService.getDocumentosRequeridos({
              IdProcess: _this2.data.configuracion.IdProcess,
              IdAgency: agency.Id.toString(),
              IdCostumerType: _this2.data.configuracion.IdCostumerType,
              IdOperationType: _this2.data.configuracion.IdOperationType
            }).toPromise();
            return {
              agency,
              hasConfig: hasConfig?.success && hasConfig.data?.documentos?.length > 0
            };
          });
          return function (_x) {
            return _ref.apply(this, arguments);
          };
        }());
        const results = yield Promise.all(promises);
        // Solo mostrar agencias que NO tienen esta configuración
        _this2.availableAgencies = results.filter(result => !result.hasConfig).map(result => result.agency);
      } catch (error) {
        console.error('Error verificando configuraciones existentes:', error);
        // En caso de error, mostrar todas las agencias disponibles
      }
    })();
  }

  onAgencySelectionChange(agencyId, checked) {
    if (checked) {
      if (!this.selectedAgencies.includes(agencyId)) {
        this.selectedAgencies.push(agencyId);
      }
    } else {
      this.selectedAgencies = this.selectedAgencies.filter(id => id !== agencyId);
    }
  }
  isAgencySelected(agencyId) {
    return this.selectedAgencies.includes(agencyId);
  }
  getAgencyName(agencyId) {
    const agency = this.agencies.find(a => a.Id === agencyId);
    return agency ? agency.Name : `Agencia ${agencyId}`;
  }
  selectAllAgencies() {
    this.selectedAgencies = this.availableAgencies.map(agency => agency.Id);
  }
  deselectAllAgencies() {
    this.selectedAgencies = [];
  }
  get filteredAgencies() {
    if (!this.searchTerm) {
      return this.availableAgencies;
    }
    return this.availableAgencies.filter(agency => agency.Name.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }
  canDuplicate() {
    return this.selectedAgencies.length > 0 && !this.loading;
  }
  duplicateConfiguration() {
    var _this3 = this;
    return (0,_Users_jclimonero_Documents_Developer_SingleFile_FE_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!_this3.canDuplicate()) {
        return;
      }
      _this3.loading = true;
      try {
        // Duplicar la configuración para cada agencia seleccionada
        const promises = _this3.selectedAgencies.map( /*#__PURE__*/function () {
          var _ref2 = (0,_Users_jclimonero_Documents_Developer_SingleFile_FE_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (agencyId) {
            const sourceConfig = {
              IdProcess: _this3.data.configuracion.IdProcess,
              IdAgency: _this3.data.configuracion.IdAgency.toString(),
              IdCostumerType: _this3.data.configuracion.IdCostumerType,
              IdOperationType: _this3.data.configuracion.IdOperationType
            };
            const targetConfig = {
              IdProcess: _this3.data.configuracion.IdProcess,
              IdAgency: agencyId.toString(),
              IdCostumerType: _this3.data.configuracion.IdCostumerType,
              IdOperationType: _this3.data.configuracion.IdOperationType
            };
            return _this3.documentoRequeridoService.duplicateConfiguracion(sourceConfig, targetConfig).toPromise();
          });
          return function (_x2) {
            return _ref2.apply(this, arguments);
          };
        }());
        yield Promise.all(promises);
        _this3.snackBar.open(`Configuración duplicada exitosamente a ${_this3.selectedAgencies.length} agencia(s)`, 'Éxito', {
          duration: 3000
        });
        _this3.dialogRef.close({
          success: true,
          agenciesCount: _this3.selectedAgencies.length
        });
      } catch (error) {
        console.error('Error duplicando configuración:', error);
        _this3.snackBar.open('Error duplicando configuración', 'Error', {
          duration: 3000
        });
      } finally {
        _this3.loading = false;
      }
    })();
  }
  cancel() {
    this.dialogRef.close();
  }
  static #_ = this.ɵfac = function DuplicateConfigurationDialogComponent_Factory(t) {
    return new (t || DuplicateConfigurationDialogComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_4__.MatDialogRef), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_4__.MAT_DIALOG_DATA), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_core_services_agency_service__WEBPACK_IMPORTED_MODULE_1__.AgencyService), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_core_services_documento_requerido_service__WEBPACK_IMPORTED_MODULE_2__.DocumentoRequeridoService), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_5__.MatSnackBar));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
    type: DuplicateConfigurationDialogComponent,
    selectors: [["app-duplicate-configuration-dialog"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵStandaloneFeature"]],
    decls: 69,
    vars: 20,
    consts: [[1, "p-6"], [1, "flex", "items-center", "justify-between", "mb-6"], [1, "text-2xl", "font-bold", "text-gray-900"], [1, "text-gray-600", "mt-1"], ["mat-icon-button", "", 1, "text-gray-400", "hover:text-gray-600", 3, "click"], [1, "bg-blue-50", "border", "border-blue-200", "rounded-lg", "p-3", "mb-6"], [1, "text-sm", "font-medium", "text-blue-900", "mb-2"], [1, "flex", "flex-wrap", "gap-x-6", "gap-y-1"], [1, "flex", "items-center", "space-x-1"], [1, "text-xs", "font-medium", "text-blue-700", "uppercase", "tracking-wide", "min-w-12"], [1, "text-sm", "text-gray-800", "font-medium", "bg-white", "px-2", "py-0.5", "rounded", "border", "border-blue-200", "shadow-sm"], [1, "text-xs", "text-gray-500", "mt-2", "italic"], [1, "bg-white", "border", "border-gray-200", "rounded-lg", "p-4", "mb-6"], [1, "flex", "items-center", "justify-between", "mb-3"], [1, "text-lg", "font-medium", "text-gray-900"], [1, "flex", "items-center", "gap-2"], ["mat-stroked-button", "", "color", "primary", 1, "text-xs", "px-3", "py-1", 3, "disabled", "click"], ["mat-stroked-button", "", "color", "warn", 1, "text-xs", "px-3", "py-1", 3, "disabled", "click"], [1, "mb-3"], ["appearance", "outline", 1, "w-full"], ["matInput", "", "placeholder", "Escribe para filtrar agencias...", 1, "text-sm", 3, "ngModel", "ngModelChange"], ["matSuffix", ""], [1, "max-h-96", "overflow-y-auto", "border", "border-gray-200", "rounded-lg"], ["class", "flex items-center justify-center p-6", 4, "ngIf"], ["class", "p-6 text-center text-gray-500", 4, "ngIf"], ["class", "divide-y divide-gray-100", 4, "ngIf"], [1, "mt-2", "flex", "items-center", "justify-between"], [1, "text-xs", "text-gray-600"], [1, "font-medium"], ["class", "flex items-center gap-1", 4, "ngIf"], [1, "flex", "items-center", "justify-end", "gap-3", "pt-4", "border-t", "border-gray-200"], ["mat-stroked-button", "", 1, "px-6", 3, "disabled", "click"], ["mat-raised-button", "", "color", "primary", 1, "px-6", "flex", "items-center", "gap-2", 3, "disabled", "click"], ["diameter", "20", 4, "ngIf"], [4, "ngIf"], [1, "flex", "items-center", "justify-center", "p-6"], ["diameter", "24"], [1, "ml-2", "text-gray-600", "text-sm"], [1, "p-6", "text-center", "text-gray-500"], [1, "text-3xl", "text-gray-300", "mb-2"], [1, "text-base", "font-medium"], [1, "text-xs"], [1, "divide-y", "divide-gray-100"], ["class", "flex items-center p-2 hover:bg-gray-50 transition-colors", 4, "ngFor", "ngForOf"], [1, "flex", "items-center", "p-2", "hover:bg-gray-50", "transition-colors"], ["color", "primary", 1, "mr-2", "scale-90", 3, "checked", "disabled", "change"], [1, "flex-1", "min-w-0"], [1, "font-medium", "text-gray-900", "text-sm", "truncate"], [1, "flex", "items-center", "gap-1"], ["class", "text-xs scale-90", 4, "ngFor", "ngForOf"], ["class", "text-xs text-gray-500", 4, "ngIf"], [1, "text-xs", "scale-90"], [1, "text-xs", "text-gray-500"], ["diameter", "20"]],
    template: function DuplicateConfigurationDialogComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div")(3, "h2", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](4, "Duplicar Configuraci\u00F3n");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "p", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](6, "Replicar configuraci\u00F3n de documentos a otras agencias");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](7, "button", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function DuplicateConfigurationDialogComponent_Template_button_click_7_listener() {
          return ctx.cancel();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](8, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](9, "close");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](10, "div", 5)(11, "h3", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](12, "Configuraci\u00F3n a Duplicar");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](13, "div", 7)(14, "div", 8)(15, "span", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](16, "Proceso:");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](17, "span", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](18);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](19, "div", 8)(20, "span", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](21, "Agencia:");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](22, "span", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](23);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](24, "div", 8)(25, "span", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](26, "Cliente:");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](27, "span", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](28);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](29, "div", 8)(30, "span", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](31, "Operaci\u00F3n:");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](32, "span", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](33);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](34, "p", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](35, " Esta configuraci\u00F3n ser\u00E1 replicada a las agencias seleccionadas ");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](36, "div", 12)(37, "div", 13)(38, "h3", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](39, "Agencias Destino");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](40, "div", 15)(41, "button", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function DuplicateConfigurationDialogComponent_Template_button_click_41_listener() {
          return ctx.selectAllAgencies();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](42, " Seleccionar Todas ");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](43, "button", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function DuplicateConfigurationDialogComponent_Template_button_click_43_listener() {
          return ctx.deselectAllAgencies();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](44, " Deseleccionar Todas ");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](45, "div", 18)(46, "mat-form-field", 19)(47, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](48, "Buscar agencias");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](49, "input", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("ngModelChange", function DuplicateConfigurationDialogComponent_Template_input_ngModelChange_49_listener($event) {
          return ctx.searchTerm = $event;
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](50, "mat-icon", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](51, "search");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](52, "div", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](53, DuplicateConfigurationDialogComponent_div_53_Template, 4, 0, "div", 23)(54, DuplicateConfigurationDialogComponent_div_54_Template, 7, 0, "div", 24)(55, DuplicateConfigurationDialogComponent_div_55_Template, 2, 1, "div", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](56, "div", 26)(57, "div", 27)(58, "span", 28);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](59);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](60);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](61, DuplicateConfigurationDialogComponent_div_61_Template, 3, 2, "div", 29);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](62, "div", 30)(63, "button", 31);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function DuplicateConfigurationDialogComponent_Template_button_click_63_listener() {
          return ctx.cancel();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](64, " Cancelar ");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](65, "button", 32);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function DuplicateConfigurationDialogComponent_Template_button_click_65_listener() {
          return ctx.duplicateConfiguration();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](66, DuplicateConfigurationDialogComponent_mat_spinner_66_Template, 1, 0, "mat-spinner", 33)(67, DuplicateConfigurationDialogComponent_mat_icon_67_Template, 2, 0, "mat-icon", 34);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](68);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](18);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx.data.processName);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx.data.currentAgencyName);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx.data.customerTypeName);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx.data.operationTypeName);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("disabled", ctx.loading || ctx.availableAgencies.length === 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("disabled", ctx.loading || ctx.selectedAgencies.length === 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngModel", ctx.searchTerm);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", !ctx.loading && ctx.filteredAgencies.length === 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", !ctx.loading && ctx.filteredAgencies.length > 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx.selectedAgencies.length);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" de ", ctx.availableAgencies.length, " agencias seleccionadas ");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.selectedAgencies.length > 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("disabled", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵclassProp"]("loading", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("disabled", !ctx.canDuplicate());
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", !ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", ctx.loading ? "Duplicando..." : "Duplicar Configuraci\u00F3n", " ");
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.NgModel, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_4__.MatDialogModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_8__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_8__.MatButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_8__.MatIconButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_9__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_9__.MatIcon, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_10__.MatFormFieldModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_10__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_10__.MatLabel, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_10__.MatSuffix, _angular_material_input__WEBPACK_IMPORTED_MODULE_11__.MatInputModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_11__.MatInput, _angular_material_select__WEBPACK_IMPORTED_MODULE_12__.MatSelectModule, _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_13__.MatCheckboxModule, _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_13__.MatCheckbox, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_14__.MatProgressSpinnerModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_14__.MatProgressSpinner, _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_5__.MatSnackBarModule, _angular_material_chips__WEBPACK_IMPORTED_MODULE_15__.MatChipsModule, _angular_material_chips__WEBPACK_IMPORTED_MODULE_15__.MatChip],
    styles: [".loading[_ngcontent-%COMP%] {\n  opacity: 0.7;\n  pointer-events: none;\n}\n\n.max-h-\\__ph-0__[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_slideIn 0.3s ease-out;\n}\n\n@keyframes _ngcontent-%COMP%_slideIn {\n  from {\n    opacity: 0;\n    transform: translateY(-20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\nmat-checkbox[_ngcontent-%COMP%]   .mat-checkbox-frame[_ngcontent-%COMP%] {\n  border-color: #3b82f6;\n}\nmat-checkbox[_ngcontent-%COMP%]   .mat-checkbox-checkmark-path[_ngcontent-%COMP%] {\n  stroke: #3b82f6;\n}\n\nmat-chip[_ngcontent-%COMP%] {\n  background-color: #dbeafe;\n  color: #1e40af;\n  border: 1px solid #93c5fd;\n}\nmat-chip[_ngcontent-%COMP%]:hover {\n  background-color: #bfdbfe;\n}\n\n.hover\\:bg-gray-50[_ngcontent-%COMP%]:hover {\n  background-color: #f9fafb;\n  transition: background-color 0.2s ease;\n}\n\nbutton[mat-raised-button][_ngcontent-%COMP%] {\n  transition: all 0.2s ease;\n}\nbutton[mat-raised-button][_ngcontent-%COMP%]:hover:not(:disabled) {\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n}\n\nmat-spinner[_ngcontent-%COMP%]   .mat-progress-spinner-circle[_ngcontent-%COMP%] {\n  stroke: #3b82f6;\n}\n\nmat-form-field[_ngcontent-%COMP%]   .mat-form-field-outline[_ngcontent-%COMP%] {\n  color: #d1d5db;\n}\nmat-form-field[_ngcontent-%COMP%]   .mat-form-field-outline-thick[_ngcontent-%COMP%] {\n  color: #3b82f6;\n}\n\n.bg-blue-50[_ngcontent-%COMP%] {\n  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);\n}\n\n.text-sm[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n}\n\n.overflow-y-auto[_ngcontent-%COMP%] {\n  scrollbar-width: thin;\n  scrollbar-color: #d1d5db #f9fafb;\n}\n.overflow-y-auto[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 6px;\n}\n.overflow-y-auto[_ngcontent-%COMP%]::-webkit-scrollbar-track {\n  background: #f9fafb;\n  border-radius: 3px;\n}\n.overflow-y-auto[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background: #d1d5db;\n  border-radius: 3px;\n}\n.overflow-y-auto[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover {\n  background: #9ca3af;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvY29uZmlndXJhY2lvbi9kb2N1bWVudG9zLXJlcXVlcmlkb3MvZHVwbGljYXRlLWNvbmZpZ3VyYXRpb24tZGlhbG9nL2R1cGxpY2F0ZS1jb25maWd1cmF0aW9uLWRpYWxvZy5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtFQUNFLFlBQUE7RUFDQSxvQkFBQTtBQUFGOztBQUlBO0VBQ0UsZ0NBQUE7QUFERjs7QUFJQTtFQUNFO0lBQ0UsVUFBQTtJQUNBLDRCQUFBO0VBREY7RUFHQTtJQUNFLFVBQUE7SUFDQSx3QkFBQTtFQURGO0FBQ0Y7QUFNRTtFQUNFLHFCQUFBO0FBSko7QUFPRTtFQUNFLGVBQUE7QUFMSjs7QUFVQTtFQUNFLHlCQUFBO0VBQ0EsY0FBQTtFQUNBLHlCQUFBO0FBUEY7QUFTRTtFQUNFLHlCQUFBO0FBUEo7O0FBWUE7RUFDRSx5QkFBQTtFQUNBLHNDQUFBO0FBVEY7O0FBYUE7RUFDRSx5QkFBQTtBQVZGO0FBWUU7RUFDRSwyQkFBQTtFQUNBLDBDQUFBO0FBVko7O0FBZ0JFO0VBQ0UsZUFBQTtBQWJKOztBQW1CRTtFQUNFLGNBQUE7QUFoQko7QUFtQkU7RUFDRSxjQUFBO0FBakJKOztBQXNCQTtFQUNFLDZEQUFBO0FBbkJGOztBQXVCQTtFQUNFLG1CQUFBO0VBQ0Esb0JBQUE7QUFwQkY7O0FBd0JBO0VBQ0UscUJBQUE7RUFDQSxnQ0FBQTtBQXJCRjtBQXVCRTtFQUNFLFVBQUE7QUFyQko7QUF3QkU7RUFDRSxtQkFBQTtFQUNBLGtCQUFBO0FBdEJKO0FBeUJFO0VBQ0UsbUJBQUE7RUFDQSxrQkFBQTtBQXZCSjtBQXlCSTtFQUNFLG1CQUFBO0FBdkJOIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRXN0aWxvcyBwYXJhIGVsIGRpw4PCoWxvZ28gZGUgZHVwbGljYWNpw4PCs25cbi5sb2FkaW5nIHtcbiAgb3BhY2l0eTogMC43O1xuICBwb2ludGVyLWV2ZW50czogbm9uZTtcbn1cblxuLy8gQW5pbWFjaW9uZXMgcGFyYSBsb3MgZWxlbWVudG9zIGRlbCBkacODwqFsb2dvXG4ubWF4LWgtXFxbODB2aFxcXSB7XG4gIGFuaW1hdGlvbjogc2xpZGVJbiAwLjNzIGVhc2Utb3V0O1xufVxuXG5Aa2V5ZnJhbWVzIHNsaWRlSW4ge1xuICBmcm9tIHtcbiAgICBvcGFjaXR5OiAwO1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMjBweCk7XG4gIH1cbiAgdG8ge1xuICAgIG9wYWNpdHk6IDE7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xuICB9XG59XG5cbi8vIEVzdGlsb3MgcGFyYSBsb3MgY2hlY2tib3hlc1xubWF0LWNoZWNrYm94IHtcbiAgLm1hdC1jaGVja2JveC1mcmFtZSB7XG4gICAgYm9yZGVyLWNvbG9yOiAjM2I4MmY2O1xuICB9XG4gIFxuICAubWF0LWNoZWNrYm94LWNoZWNrbWFyay1wYXRoIHtcbiAgICBzdHJva2U6ICMzYjgyZjY7XG4gIH1cbn1cblxuLy8gRXN0aWxvcyBwYXJhIGxvcyBjaGlwcyBkZSBhZ2VuY2lhcyBzZWxlY2Npb25hZGFzXG5tYXQtY2hpcCB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNkYmVhZmU7XG4gIGNvbG9yOiAjMWU0MGFmO1xuICBib3JkZXI6IDFweCBzb2xpZCAjOTNjNWZkO1xuICBcbiAgJjpob3ZlciB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2JmZGJmZTtcbiAgfVxufVxuXG4vLyBFc3RpbG9zIHBhcmEgZWwgaG92ZXIgZGUgbGFzIGFnZW5jaWFzXG4uaG92ZXJcXDpiZy1ncmF5LTUwOmhvdmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y5ZmFmYjtcbiAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjJzIGVhc2U7XG59XG5cbi8vIEVzdGlsb3MgcGFyYSBsb3MgYm90b25lcyBkZSBhY2Npw4PCs25cbmJ1dHRvblttYXQtcmFpc2VkLWJ1dHRvbl0ge1xuICB0cmFuc2l0aW9uOiBhbGwgMC4ycyBlYXNlO1xuICBcbiAgJjpob3Zlcjpub3QoOmRpc2FibGVkKSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0xcHgpO1xuICAgIGJveC1zaGFkb3c6IDAgNHB4IDEycHggcmdiYSgwLCAwLCAwLCAwLjE1KTtcbiAgfVxufVxuXG4vLyBFc3RpbG9zIHBhcmEgZWwgc3Bpbm5lciBkZSBjYXJnYVxubWF0LXNwaW5uZXIge1xuICAubWF0LXByb2dyZXNzLXNwaW5uZXItY2lyY2xlIHtcbiAgICBzdHJva2U6ICMzYjgyZjY7XG4gIH1cbn1cblxuLy8gRXN0aWxvcyBwYXJhIGVsIGNhbXBvIGRlIGLDg8K6c3F1ZWRhXG5tYXQtZm9ybS1maWVsZCB7XG4gIC5tYXQtZm9ybS1maWVsZC1vdXRsaW5lIHtcbiAgICBjb2xvcjogI2QxZDVkYjtcbiAgfVxuICBcbiAgLm1hdC1mb3JtLWZpZWxkLW91dGxpbmUtdGhpY2sge1xuICAgIGNvbG9yOiAjM2I4MmY2O1xuICB9XG59XG5cbi8vIEVzdGlsb3MgcGFyYSBsYSBpbmZvcm1hY2nDg8KzbiBkZSBjb25maWd1cmFjacODwrNuXG4uYmctYmx1ZS01MCB7XG4gIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxMzVkZWcsICNlZmY2ZmYgMCUsICNkYmVhZmUgMTAwJSk7XG59XG5cbi8vIEVzdGlsb3MgcGFyYSBsb3MgY29udGFkb3Jlc1xuLnRleHQtc20ge1xuICBmb250LXNpemU6IDAuODc1cmVtO1xuICBsaW5lLWhlaWdodDogMS4yNXJlbTtcbn1cblxuLy8gRXN0aWxvcyBwYXJhIGVsIHNjcm9sbCBwZXJzb25hbGl6YWRvXG4ub3ZlcmZsb3cteS1hdXRvIHtcbiAgc2Nyb2xsYmFyLXdpZHRoOiB0aGluO1xuICBzY3JvbGxiYXItY29sb3I6ICNkMWQ1ZGIgI2Y5ZmFmYjtcbiAgXG4gICY6Oi13ZWJraXQtc2Nyb2xsYmFyIHtcbiAgICB3aWR0aDogNnB4O1xuICB9XG4gIFxuICAmOjotd2Via2l0LXNjcm9sbGJhci10cmFjayB7XG4gICAgYmFja2dyb3VuZDogI2Y5ZmFmYjtcbiAgICBib3JkZXItcmFkaXVzOiAzcHg7XG4gIH1cbiAgXG4gICY6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcbiAgICBiYWNrZ3JvdW5kOiAjZDFkNWRiO1xuICAgIGJvcmRlci1yYWRpdXM6IDNweDtcbiAgICBcbiAgICAmOmhvdmVyIHtcbiAgICAgIGJhY2tncm91bmQ6ICM5Y2EzYWY7XG4gICAgfVxuICB9XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
  });
}

/***/ })

}]);
//# sourceMappingURL=src_app_pages_configuracion_documentos-requeridos_documentos-requeridos_component_ts.js.map