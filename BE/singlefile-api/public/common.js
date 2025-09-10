"use strict";
(self["webpackChunkvex"] = self["webpackChunkvex"] || []).push([["common"],{

/***/ 72369:
/*!*********************************************************************************!*\
  !*** ./src/@vex/components/vex-page-layout/vex-page-layout-header.directive.ts ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VexPageLayoutHeaderDirective: () => (/* binding */ VexPageLayoutHeaderDirective)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 61699);

class VexPageLayoutHeaderDirective {
  constructor() {}
  static #_ = this.ɵfac = function VexPageLayoutHeaderDirective_Factory(t) {
    return new (t || VexPageLayoutHeaderDirective)();
  };
  static #_2 = this.ɵdir = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineDirective"]({
    type: VexPageLayoutHeaderDirective,
    selectors: [["", "vexPageLayoutHeader", ""], ["vex-page-layout-header"]],
    hostAttrs: [1, "vex-page-layout-header"],
    standalone: true
  });
}

/***/ }),

/***/ 99565:
/*!**************************************************************************************!*\
  !*** ./src/@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component.ts ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VexSecondaryToolbarComponent: () => (/* binding */ VexSecondaryToolbarComponent)
/* harmony export */ });
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ 79736);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _config_vex_config_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../config/vex-config.service */ 50376);




function VexSecondaryToolbarComponent_h1_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "h1", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx_r0.current, " ");
  }
}
const _c0 = (a0, a1) => ({
  fixed: a0,
  "w-full": a1
});
const _c1 = ["*"];
class VexSecondaryToolbarComponent {
  constructor(configService) {
    this.configService = configService;
    this.fixed$ = this.configService.config$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(config => config.toolbar.fixed));
    this.isVerticalLayout$ = this.configService.select(config => config.layout).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(layout => layout === 'vertical'));
  }
  static #_ = this.ɵfac = function VexSecondaryToolbarComponent_Factory(t) {
    return new (t || VexSecondaryToolbarComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_config_vex_config_service__WEBPACK_IMPORTED_MODULE_0__.VexConfigService));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: VexSecondaryToolbarComponent,
    selectors: [["vex-secondary-toolbar"]],
    inputs: {
      current: "current"
    },
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵStandaloneFeature"]],
    ngContentSelectors: _c1,
    decls: 9,
    vars: 13,
    consts: [[1, "secondary-toolbar-placeholder"], [1, "secondary-toolbar", "py-1", "z-40", "border-t", "flex", 3, "ngClass"], [1, "px-6", "flex", "items-center", "flex-auto"], ["class", "subheading-2 font-medium m-0 ltr:pr-3 rtl:pl-3 ltr:border-r rtl:border-l ltr:mr-3 rtl:ml-3 flex-none", 4, "ngIf"], [1, "subheading-2", "font-medium", "m-0", "ltr:pr-3", "rtl:pl-3", "ltr:border-r", "rtl:border-l", "ltr:mr-3", "rtl:ml-3", "flex-none"]],
    template: function VexSecondaryToolbarComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵprojectionDef"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "\u00A0");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](3, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](4, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](6, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](7, VexSecondaryToolbarComponent_h1_7_Template, 2, 1, "h1", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵprojection"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction2"](10, _c0, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind1"](3, 4, ctx.fixed$), !_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind1"](4, 6, ctx.fixed$)));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassProp"]("container", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind1"](6, 8, ctx.isVerticalLayout$));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.current);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_3__.AsyncPipe],
    styles: [".secondary-toolbar[_ngcontent-%COMP%] {\n  border-bottom-width: 1px;\n  --tw-shadow: 0 10px 30px 0 rgba(82,63,104,.06);\n  --tw-shadow-colored: 0 10px 30px 0 var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n  --tw-backdrop-blur: blur(8px);\n  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);\n          backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);\n  background: var(--vex-secondary-toolbar-background);\n  height: var(--vex-secondary-toolbar-height);\n  margin-top: calc(var(--vex-secondary-toolbar-height) * -1);\n}\n.secondary-toolbar.fixed[_ngcontent-%COMP%] {\n  width: var(--vex-toolbar-width);\n}\n\n.secondary-toolbar-placeholder[_ngcontent-%COMP%] {\n  height: var(--vex-secondary-toolbar-height);\n}\n\n  vex-breadcrumbs {\n  display: none;\n}\n@media (min-width: 600px) {\n    vex-breadcrumbs {\n    display: block;\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9AdmV4L2NvbXBvbmVudHMvdmV4LXNlY29uZGFyeS10b29sYmFyL3ZleC1zZWNvbmRhcnktdG9vbGJhci5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDRTtFQUFBLHdCQUFBO0VBQUEsOENBQUE7RUFBQSx5REFBQTtFQUFBLHVHQUFBO0VBQUEsNkJBQUE7RUFBQSwrUUFBQTtVQUFBLHVRQUFBO0VBQ0EsbURBQUE7RUFDQSwyQ0FBQTtFQUNBO0FBSEE7QUFLQTtFQUNFLCtCQUFBO0FBQ0o7O0FBR0E7RUFDRSwyQ0FBQTtBQUFGOztBQUtJO0VBQUE7QUFBQTtBQUdGO0VBRUk7SUFBQTtFQUFBO0FBRE4iLCJzb3VyY2VzQ29udGVudCI6WyIuc2Vjb25kYXJ5LXRvb2xiYXIge1xuICBAYXBwbHkgYmFja2Ryb3AtYmx1ciBib3JkZXItYiBzaGFkb3ctYjtcbiAgYmFja2dyb3VuZDogdmFyKC0tdmV4LXNlY29uZGFyeS10b29sYmFyLWJhY2tncm91bmQpO1xuICBoZWlnaHQ6IHZhcigtLXZleC1zZWNvbmRhcnktdG9vbGJhci1oZWlnaHQpO1xuICBtYXJnaW4tdG9wOiBjYWxjKHZhcigtLXZleC1zZWNvbmRhcnktdG9vbGJhci1oZWlnaHQpICogLTEpO1xuXG4gICYuZml4ZWQge1xuICAgIHdpZHRoOiB2YXIoLS12ZXgtdG9vbGJhci13aWR0aCk7XG4gIH1cbn1cblxuLnNlY29uZGFyeS10b29sYmFyLXBsYWNlaG9sZGVyIHtcbiAgaGVpZ2h0OiB2YXIoLS12ZXgtc2Vjb25kYXJ5LXRvb2xiYXItaGVpZ2h0KTtcbn1cblxuOjpuZy1kZWVwIHtcbiAgdmV4LWJyZWFkY3J1bWJzIHtcbiAgICBAYXBwbHkgaGlkZGVuO1xuICB9XG5cbiAgQHNjcmVlbiBzbSB7XG4gICAgdmV4LWJyZWFkY3J1bWJzIHtcbiAgICAgIEBhcHBseSBibG9jaztcbiAgICB9XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
  });
}

/***/ }),

/***/ 12143:
/*!********************************************************!*\
  !*** ./src/app/core/services/costumer-type.service.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CostumerTypeService: () => (/* binding */ CostumerTypeService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ 54860);
/* harmony import */ var _api_base_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api-base.service */ 14461);



class CostumerTypeService {
  constructor(http, apiBaseService) {
    this.http = http;
    this.apiBaseService = apiBaseService;
    this.API_URL = 'costumer-type';
  }
  getCostumerTypes(limit) {
    const params = limit ? `?limit=${limit}` : '';
    return this.http.get(`${this.apiBaseService.buildApiUrl(this.API_URL)}${params}`);
  }
  getAllCostumerTypes() {
    return this.http.get(this.apiBaseService.buildApiUrl(this.API_URL));
  }
  getCostumerTypesByStatus(enabled) {
    return this.http.get(`${this.apiBaseService.buildApiUrl(this.API_URL)}?enabled=${enabled}`);
  }
  getCostumerTypeById(id) {
    return this.http.get(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}`);
  }
  createCostumerType(costumerType) {
    return this.http.post(this.apiBaseService.buildApiUrl(this.API_URL), costumerType);
  }
  updateCostumerType(id, costumerType) {
    return this.http.put(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}`, costumerType);
  }
  deleteCostumerType(id) {
    return this.http.delete(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}`);
  }
  toggleStatus(id) {
    return this.http.patch(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}/toggle-status`, {});
  }
  searchCostumerTypes(query) {
    return this.http.get(`${this.apiBaseService.buildApiUrl(this.API_URL)}/search?q=${query}`);
  }
  getStats() {
    return this.http.get(`${this.apiBaseService.buildApiUrl(this.API_URL)}/stats`);
  }
  getActiveCostumerTypes() {
    return this.http.get(`${this.apiBaseService.buildApiUrl(this.API_URL)}/active`);
  }
  static #_ = this.ɵfac = function CostumerTypeService_Factory(t) {
    return new (t || CostumerTypeService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpClient), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_api_base_service__WEBPACK_IMPORTED_MODULE_0__.ApiBaseService));
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
    token: CostumerTypeService,
    factory: CostumerTypeService.ɵfac,
    providedIn: 'root'
  });
}

/***/ }),

/***/ 5709:
/*!********************************************************!*\
  !*** ./src/app/core/services/document-type.service.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DocumentTypeService: () => (/* binding */ DocumentTypeService)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ 54860);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _api_base_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api-base.service */ 14461);




class DocumentTypeService {
  constructor(http, apiBaseService) {
    this.http = http;
    this.apiBaseService = apiBaseService;
    this.API_URL = 'document-type';
  }
  /**
   * Obtener todos los tipos de documento con filtros y paginación
   */
  getDocumentTypes(params) {
    let httpParams = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }
    return this.http.get(this.apiBaseService.buildApiUrl(this.API_URL), {
      params: httpParams
    });
  }
  /**
   * Obtener un tipo de documento específico por ID
   */
  getDocumentType(id) {
    return this.http.get(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}`);
  }
  /**
   * Crear un nuevo tipo de documento
   */
  createDocumentType(documentType) {
    return this.http.post(this.apiBaseService.buildApiUrl(this.API_URL), documentType);
  }
  /**
   * Actualizar un tipo de documento existente
   */
  updateDocumentType(id, documentType) {
    return this.http.put(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}`, documentType);
  }
  /**
   * Eliminar un tipo de documento
   */
  deleteDocumentType(id) {
    return this.http.delete(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}`);
  }
  /**
   * Cambiar estado (habilitado/deshabilitado) de un tipo de documento
   */
  toggleStatus(id) {
    return this.http.patch(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}/toggle-status`, {});
  }
  /**
   * Obtener solo los tipos de documento activos
   */
  getActiveDocumentTypes() {
    return this.http.get(`${this.apiBaseService.buildApiUrl(this.API_URL)}/active`);
  }
  /**
   * Buscar tipos de documento por nombre
   */
  searchDocumentTypes(query, limit) {
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpParams().set('q', query);
    if (limit) {
      params = params.set('limit', limit);
    }
    return this.http.get(`${this.apiBaseService.buildApiUrl(this.API_URL)}/search`, {
      params
    });
  }
  /**
   * Obtener estadísticas de los tipos de documento
   */
  getStats() {
    return this.http.get(`${this.apiBaseService.buildApiUrl(this.API_URL)}/stats`);
  }
  /**
   * Obtener todos los tipos de documento sin paginación
   */
  getAllDocumentTypes() {
    return this.getDocumentTypes({
      limit: 'all'
    });
  }
  /**
   * Obtener tipos de documento habilitados
   */
  getEnabledDocumentTypes() {
    return this.getDocumentTypes({
      enabled: '1',
      limit: 'all'
    });
  }
  /**
   * Obtener tipos de documento deshabilitados
   */
  getDisabledDocumentTypes() {
    return this.getDocumentTypes({
      enabled: '0',
      limit: 'all'
    });
  }
  /**
   * Obtener estados de archivo activos (File_Status)
   */
  getActiveFileStatuses() {
    return this.http.get(`${this.apiBaseService.buildApiUrl('file-status/active')}`);
  }
  /**
   * Obtener subestados de archivo activos (File_SubStatus)
   */
  getActiveSubProcesses() {
    return this.http.get(`${this.apiBaseService.buildApiUrl('file-sub-status/active')}`);
  }
  static #_ = this.ɵfac = function DocumentTypeService_Factory(t) {
    return new (t || DocumentTypeService)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpClient), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_api_base_service__WEBPACK_IMPORTED_MODULE_0__.ApiBaseService));
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
    token: DocumentTypeService,
    factory: DocumentTypeService.ɵfac,
    providedIn: 'root'
  });
}

/***/ }),

/***/ 2554:
/*!********************************************************************!*\
  !*** ./src/app/core/services/file-extraordinary-reason.service.ts ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FileExtraordinaryReasonService: () => (/* binding */ FileExtraordinaryReasonService)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ 54860);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../environments/environment */ 20553);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 61699);




class FileExtraordinaryReasonService {
  constructor(http) {
    this.http = http;
    this.apiUrl = `${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiBaseUrl}/api/file-extraordinary-reason`;
  }
  /**
   * Obtener todos los motivos extraordinarios con filtros y paginación
   */
  getFileExtraordinaryReasons(filters = {}) {
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpParams();
    if (filters.search) {
      params = params.set('search', filters.search);
    }
    if (filters.id_type_reason !== undefined) {
      params = params.set('id_type_reason', filters.id_type_reason.toString());
    }
    if (filters.sort_by) {
      params = params.set('sort_by', filters.sort_by);
    }
    if (filters.sort_order) {
      params = params.set('sort_order', filters.sort_order);
    }
    if (filters.limit) {
      params = params.set('limit', filters.limit.toString());
    }
    if (filters.offset) {
      params = params.set('offset', filters.offset.toString());
    }
    return this.http.get(this.apiUrl, {
      params
    });
  }
  /**
   * Obtener un motivo extraordinario específico por ID
   */
  getFileExtraordinaryReason(id) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  /**
   * Crear un nuevo motivo extraordinario
   */
  createFileExtraordinaryReason(fileExtraordinaryReason) {
    console.log('🔍 Datos a enviar al backend:', fileExtraordinaryReason);
    return this.http.post(this.apiUrl, fileExtraordinaryReason);
  }
  /**
   * Actualizar un motivo extraordinario existente
   */
  updateFileExtraordinaryReason(id, fileExtraordinaryReason) {
    return this.http.put(`${this.apiUrl}/${id}`, fileExtraordinaryReason);
  }
  /**
   * Eliminar un motivo extraordinario
   */
  deleteFileExtraordinaryReason(id) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  /**
   * Buscar motivos extraordinarios
   */
  searchFileExtraordinaryReasons(query, limit = 10) {
    const params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpParams().set('q', query).set('limit', limit.toString());
    return this.http.get(`${this.apiUrl}/search`, {
      params
    });
  }
  /**
   * Obtener estadísticas de motivos extraordinarios
   */
  getStats() {
    return this.http.get(`${this.apiUrl}/stats`);
  }
  /**
   * Obtener motivos extraordinarios activos
   */
  getActiveFileExtraordinaryReasons() {
    return this.http.get(`${this.apiUrl}/active`);
  }
  /**
   * Cambiar estado del motivo extraordinario
   */
  toggleStatus(id) {
    return this.http.patch(`${this.apiUrl}/${id}/toggle-status`, {});
  }
  static #_ = this.ɵfac = function FileExtraordinaryReasonService_Factory(t) {
    return new (t || FileExtraordinaryReasonService)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpClient));
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
    token: FileExtraordinaryReasonService,
    factory: FileExtraordinaryReasonService.ɵfac,
    providedIn: 'root'
  });
}

/***/ }),

/***/ 16425:
/*!**************************************************!*\
  !*** ./src/app/core/services/proceso.service.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ProcesoService: () => (/* binding */ ProcesoService)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ 54860);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _api_base_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api-base.service */ 14461);




class ProcesoService {
  constructor(http, apiBaseService) {
    this.http = http;
    this.apiBaseService = apiBaseService;
    this.API_URL = 'process';
  }
  getProcesos() {
    return this.http.get(this.apiBaseService.buildApiUrl(this.API_URL));
  }
  getProceso(id) {
    return this.http.get(this.apiBaseService.buildApiUrl(`${this.API_URL}/${id}`));
  }
  createProceso(proceso) {
    return this.http.post(this.apiBaseService.buildApiUrl(this.API_URL), proceso);
  }
  updateProceso(proceso) {
    return this.http.put(this.apiBaseService.buildApiUrl(`${this.API_URL}/${proceso.Id}`), proceso);
  }
  deleteProceso(id, force = false) {
    const params = force ? new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpParams().set('force', 'true') : new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpParams();
    return this.http.delete(this.apiBaseService.buildApiUrl(`${this.API_URL}/${id}`), {
      params
    });
  }
  toggleEstado(id, estado) {
    return this.http.patch(this.apiBaseService.buildApiUrl(`${this.API_URL}/${id}/estado`), {
      estado
    });
  }
  static #_ = this.ɵfac = function ProcesoService_Factory(t) {
    return new (t || ProcesoService)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpClient), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_api_base_service__WEBPACK_IMPORTED_MODULE_0__.ApiBaseService));
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
    token: ProcesoService,
    factory: ProcesoService.ɵfac,
    providedIn: 'root'
  });
}

/***/ }),

/***/ 15591:
/*!*********************************************************!*\
  !*** ./src/app/core/services/tipo-operacion.service.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TipoOperacionService: () => (/* binding */ TipoOperacionService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ 54860);
/* harmony import */ var _api_base_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api-base.service */ 14461);



class TipoOperacionService {
  constructor(http, apiBaseService) {
    this.http = http;
    this.apiBaseService = apiBaseService;
    this.API_URL = 'operation-type';
  }
  getTiposOperacion() {
    return this.http.get(this.apiBaseService.buildApiUrl(this.API_URL));
  }
  getTiposOperacionByStatus(enabled) {
    return this.http.get(`${this.apiBaseService.buildApiUrl(this.API_URL)}?enabled=${enabled}`);
  }
  createTipoOperacion(tipoOperacion) {
    return this.http.post(this.apiBaseService.buildApiUrl(this.API_URL), tipoOperacion);
  }
  updateTipoOperacion(id, tipoOperacion) {
    return this.http.put(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}`, tipoOperacion);
  }
  deleteTipoOperacion(id) {
    return this.http.delete(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}`);
  }
  toggleEstado(id) {
    return this.http.patch(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}/estado`, {});
  }
  searchTiposOperacion(query) {
    return this.http.get(`${this.apiBaseService.buildApiUrl(this.API_URL)}/search?q=${query}`);
  }
  getStats() {
    return this.http.get(this.apiBaseService.buildApiUrl(`${this.API_URL}/stats`));
  }
  static #_ = this.ɵfac = function TipoOperacionService_Factory(t) {
    return new (t || TipoOperacionService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpClient), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_api_base_service__WEBPACK_IMPORTED_MODULE_0__.ApiBaseService));
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
    token: TipoOperacionService,
    factory: TipoOperacionService.ɵfac,
    providedIn: 'root'
  });
}

/***/ }),

/***/ 56230:
/*!***************************************************************************************************************************************************!*\
  !*** ./src/app/pages/ui/components/components-overview/components/components-overview-autocomplete/components-overview-autocomplete.component.ts ***!
  \***************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ComponentsOverviewAutocompleteComponent: () => (/* binding */ ComponentsOverviewAutocompleteComponent)
/* harmony export */ });
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ 28849);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ 75043);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ 79736);
/* harmony import */ var _vex_components_vex_highlight_vex_highlight_directive__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vex/components/vex-highlight/vex-highlight.directive */ 26010);
/* harmony import */ var _angular_material_tabs__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/tabs */ 60989);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/core */ 55309);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_material_autocomplete__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/autocomplete */ 99892);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/input */ 10026);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/form-field */ 51333);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);




















function ComponentsOverviewAutocompleteComponent_mat_option_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-option", 17)(1, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](2, "img", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "span", 20)(4, "span", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "span", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const state_r4 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("value", state_r4.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("src", state_r4.flag, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](state_r4.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("Population: ", state_r4.population, "");
  }
}
function ComponentsOverviewAutocompleteComponent_button_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "button", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ComponentsOverviewAutocompleteComponent_button_12_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r6);
      const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r5.stateCtrl.reset());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "mat-icon", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function ComponentsOverviewAutocompleteComponent_button_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "button", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "mat-icon", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
class ComponentsOverviewAutocompleteComponent {
  constructor() {
    // noinspection AngularInvalidTemplateReferenceVariable,AngularMissingRequiredDirectiveInputBinding
    this.autocompleteHTML = `<mat-input-container>
  <mat-label>State</mat-label>
  <input type="text" matInput [matAutocomplete]="auto" [formControl]="stateCtrl">
  <mat-autocomplete #auto="matAutocomplete">
    <mat-option *ngFor="let option of options" [value]="option">
      {{ option }}
    </mat-option>
  </mat-autocomplete>
</mat-input-container>
`;
    this.stateCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_2__.UntypedFormControl();
    this.filteredStates$ = this.stateCtrl.valueChanges.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.startWith)(''), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.map)(state => state ? this.filterStates(state) : this.states.slice()));
    this.states = [{
      name: 'Arkansas',
      population: '2.978M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_Arkansas.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arkansas.svg'
    }, {
      name: 'California',
      population: '39.14M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_California.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_California.svg'
    }, {
      name: 'Florida',
      population: '20.27M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_Florida.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Florida.svg'
    }, {
      name: 'Texas',
      population: '27.47M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_Texas.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Texas.svg'
    }];
  }
  filterStates(name) {
    return this.states.filter(state => state.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
  static #_ = this.ɵfac = function ComponentsOverviewAutocompleteComponent_Factory(t) {
    return new (t || ComponentsOverviewAutocompleteComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: ComponentsOverviewAutocompleteComponent,
    selectors: [["vex-components-overview-autocomplete"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵStandaloneFeature"]],
    decls: 41,
    vars: 8,
    consts: [[1, "card", "flex", "flex-col", "sm:flex-row"], [1, "p-6", "md:min-w-[300px]", "flex-none"], [1, "title", "mt-0", "mb-4"], [1, "w-300", "max-w-full"], ["matInput", "", 3, "formControl", "matAutocomplete"], ["auto", "matAutocomplete"], [3, "value", 4, "ngFor", "ngForOf"], ["mat-icon-button", "", "matIconSuffix", "", "type", "button", 3, "click", 4, "ngIf"], ["mat-icon-button", "", "matIconSuffix", "", "type", "button", 4, "ngIf"], [1, "border-l", "flex-auto"], [1, "p-6"], [1, "body-2", "text-secondary", "m-0"], ["label", "DESCRIPTION"], [1, "m-0"], [1, "font-medium"], ["label", "SOURCE CODE"], [3, "vexHighlight"], [3, "value"], [1, "flex", "items-center"], [1, "align-middle", "mr-4", "shadow-lg", "h-6", "inline-block", 3, "src"], [1, "flex", "flex-col"], [1, "body-1", "leading-snug"], [1, "caption", "text-secondary", "leading-none"], ["mat-icon-button", "", "matIconSuffix", "", "type", "button", 3, "click"], ["svgIcon", "mat:close"], ["mat-icon-button", "", "matIconSuffix", "", "type", "button"], ["svgIcon", "mat:arrow_drop_down"]],
    template: function ComponentsOverviewAutocompleteComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h2", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Preview");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "mat-form-field", 3)(5, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, "Select a State");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](7, "input", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "mat-autocomplete", null, 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](10, ComponentsOverviewAutocompleteComponent_mat_option_10_Template, 8, 4, "mat-option", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](11, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](12, ComponentsOverviewAutocompleteComponent_button_12_Template, 2, 0, "button", 7)(13, ComponentsOverviewAutocompleteComponent_button_13_Template, 2, 0, "button", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "mat-hint");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](15, "Add this hint for a better UX!");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](16, "div", 9)(17, "div", 10)(18, "h2", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](19, "Autocomplete");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](20, "h4", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](21, "<mat-autocomplete>");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](22, "mat-tab-group")(23, "mat-tab", 12)(24, "div", 10)(25, "p", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](26, " Input text can be used with autocomplete to help users who have limited literacy or who write in a foreign language. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](27, "br")(28, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](29, "span", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](30, "For example, autocomplete can:");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](31, "ul")(32, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](33, " Suggest input as it\u2019s typed (refreshing suggestions with each keystroke) ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](34, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](35, "Fill a field with default input text");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](36, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](37, " Pressing the return button accepts the current autocomplete suggestion. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](38, "mat-tab", 15)(39, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](40, "code", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()();
      }
      if (rf & 2) {
        const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("formControl", ctx.stateCtrl)("matAutocomplete", _r0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind1"](11, 6, ctx.filteredStates$));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.stateCtrl.value);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.stateCtrl.value);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](27);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("vexHighlight", ctx.autocompleteHTML);
      }
    },
    dependencies: [_angular_material_form_field__WEBPACK_IMPORTED_MODULE_5__.MatFormFieldModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_5__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_5__.MatLabel, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_5__.MatHint, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_5__.MatSuffix, _angular_material_input__WEBPACK_IMPORTED_MODULE_6__.MatInputModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_6__.MatInput, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormControlDirective, _angular_material_autocomplete__WEBPACK_IMPORTED_MODULE_7__.MatAutocompleteModule, _angular_material_autocomplete__WEBPACK_IMPORTED_MODULE_7__.MatAutocomplete, _angular_material_core__WEBPACK_IMPORTED_MODULE_8__.MatOption, _angular_material_autocomplete__WEBPACK_IMPORTED_MODULE_7__.MatAutocompleteTrigger, _angular_common__WEBPACK_IMPORTED_MODULE_9__.NgFor, _angular_material_core__WEBPACK_IMPORTED_MODULE_8__.MatOptionModule, _angular_common__WEBPACK_IMPORTED_MODULE_9__.NgIf, _angular_material_button__WEBPACK_IMPORTED_MODULE_10__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_10__.MatIconButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_11__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_11__.MatIcon, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_12__.MatTabsModule, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_12__.MatTab, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_12__.MatTabGroup, _vex_components_vex_highlight_vex_highlight_directive__WEBPACK_IMPORTED_MODULE_0__.VexHighlightDirective, _angular_common__WEBPACK_IMPORTED_MODULE_9__.AsyncPipe],
    styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }),

/***/ 21640:
/*!*************************************************************************************************************************************!*\
  !*** ./src/app/pages/ui/components/components-overview/components/components-overview-cards/components-overview-cards.component.ts ***!
  \*************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ComponentsOverviewCardsComponent: () => (/* binding */ ComponentsOverviewCardsComponent)
/* harmony export */ });
/* harmony import */ var _vex_components_vex_highlight_vex_highlight_directive__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vex/components/vex-highlight/vex-highlight.directive */ 26010);
/* harmony import */ var _angular_material_tabs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/tabs */ 60989);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/card */ 18497);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);










class ComponentsOverviewCardsComponent {
  constructor() {
    this.cardHTML = `<mat-card>
  <mat-card-header>
    <img mat-card-avatar src="assets/img/avatars/3.jpg">
    <mat-card-title>Gerald Morris</mat-card-title>
    <mat-card-subtitle>Yesterday</mat-card-subtitle>
  </mat-card-header>
  <img mat-card-image src="assets/img/backgrounds/1.jpg">
  <mat-card-content>
    <p>Piqued favour stairs it enable exeter as seeing. Remainder met improving but engrossed sincerity age. Better but length gay denied abroad are. Attachment astonished to on appearance imprudence so collecting in excellence. Tiled way blind lived whose new. The for fully had she there leave merit enjoy forth. </p>
  </mat-card-content>
  <mat-divider></mat-divider>
  <mat-card-actions>
    <div class="flex">
      <button mat-icon-button>
        <mat-icon>share</mat-icon>
      </button>
      <button mat-icon-button>
        <mat-icon>favorite</mat-icon>
      </button>
      <span class="flex-1"></span>
      <button mat-button>
        More Info
      </button>
      <button mat-button>
        Save as
      </button>
    </div>
  </mat-card-actions>
</mat-card>`;
  }
  ngOnInit() {}
  static #_ = this.ɵfac = function ComponentsOverviewCardsComponent_Factory(t) {
    return new (t || ComponentsOverviewCardsComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: ComponentsOverviewCardsComponent,
    selectors: [["vex-components-overview-cards"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵStandaloneFeature"]],
    decls: 38,
    vars: 1,
    consts: [[1, "card", "overflow-hidden", "flex", "flex-col", "sm:flex-row"], [1, "p-6", "md:min-w-[300px]", "bg-app-bar"], [1, "title", "mt-0", "mb-4"], [1, "max-w-full"], ["mat-card-avatar", "", "src", "assets/img/avatars/3.jpg"], ["mat-card-image", "", "src", "assets/img/demo/mountain-cinematic.jpg"], [1, "my-4"], ["color", "primary", "mat-icon-button", ""], ["svgIcon", "mat:share"], ["color", "accent", "mat-icon-button", ""], ["svgIcon", "mat:favorite"], [1, "flex-1"], ["mat-button", "", 1, "hidden", "sm:inline-block"], ["color", "primary", "mat-button", ""], [1, "border-l", "flex-1"], [1, "p-6"], [1, "body-2", "text-secondary", "m-0"], ["label", "DESCRIPTION"], [1, "p-6", "m-0"], ["label", "SOURCE CODE"], [3, "vexHighlight"]],
    template: function ComponentsOverviewCardsComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h2", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Preview");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "mat-card", 3)(5, "mat-card-header");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](6, "img", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "mat-card-title");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8, "Gerald Morris");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "mat-card-subtitle");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](10, "Yesterday");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](11, "img", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "mat-card-content")(13, "p", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](14, " Piqued favour stairs it enable exeter as seeing. Remainder met improving but engrossed sincerity age. Better but length gay denied abroad are. Attachment astonished to on appearance imprudence so collecting in excellence. Tiled way blind lived whose new. The for fully had she there leave merit enjoy forth. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](15, "mat-card-actions")(16, "button", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](17, "mat-icon", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](18, "button", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](19, "mat-icon", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](20, "span", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](21, "button", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](22, "MORE INFO");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](23, "button", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](24, "SAVE AS");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](25, "div", 14)(26, "div", 15)(27, "h2", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](28, "Cards");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](29, "h4", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](30, "<mat-card>");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](31, "mat-tab-group")(32, "mat-tab", 17)(33, "p", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](34, " Cards may contain a photo, text, and a link about a single subject. They may display content containing elements of varying size, such as photos with captions of variable length. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](35, "mat-tab", 19)(36, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](37, "code", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](37);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("vexHighlight", ctx.cardHTML);
      }
    },
    dependencies: [_angular_material_card__WEBPACK_IMPORTED_MODULE_2__.MatCardModule, _angular_material_card__WEBPACK_IMPORTED_MODULE_2__.MatCard, _angular_material_card__WEBPACK_IMPORTED_MODULE_2__.MatCardActions, _angular_material_card__WEBPACK_IMPORTED_MODULE_2__.MatCardAvatar, _angular_material_card__WEBPACK_IMPORTED_MODULE_2__.MatCardContent, _angular_material_card__WEBPACK_IMPORTED_MODULE_2__.MatCardHeader, _angular_material_card__WEBPACK_IMPORTED_MODULE_2__.MatCardImage, _angular_material_card__WEBPACK_IMPORTED_MODULE_2__.MatCardSubtitle, _angular_material_card__WEBPACK_IMPORTED_MODULE_2__.MatCardTitle, _angular_material_button__WEBPACK_IMPORTED_MODULE_3__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_3__.MatButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_3__.MatIconButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_4__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_4__.MatIcon, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_5__.MatTabsModule, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_5__.MatTab, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_5__.MatTabGroup, _vex_components_vex_highlight_vex_highlight_directive__WEBPACK_IMPORTED_MODULE_0__.VexHighlightDirective],
    styles: [".mat-mdc-card[_ngcontent-%COMP%] {\n  max-width: 500px;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvdWkvY29tcG9uZW50cy9jb21wb25lbnRzLW92ZXJ2aWV3L2NvbXBvbmVudHMvY29tcG9uZW50cy1vdmVydmlldy1jYXJkcy9jb21wb25lbnRzLW92ZXJ2aWV3LWNhcmRzLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsZ0JBQUE7QUFDRiIsInNvdXJjZXNDb250ZW50IjpbIi5tYXQtbWRjLWNhcmQge1xuICBtYXgtd2lkdGg6IDUwMHB4O1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }),

/***/ 34783:
/*!*******************************************************************************************************************************************!*\
  !*** ./src/app/pages/ui/components/components-overview/components/components-overview-checkbox/components-overview-checkbox.component.ts ***!
  \*******************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ComponentsOverviewCheckboxComponent: () => (/* binding */ ComponentsOverviewCheckboxComponent)
/* harmony export */ });
/* harmony import */ var _vex_components_vex_highlight_vex_highlight_directive__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vex/components/vex-highlight/vex-highlight.directive */ 26010);
/* harmony import */ var _angular_material_tabs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/tabs */ 60989);
/* harmony import */ var _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/checkbox */ 56658);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);






class ComponentsOverviewCheckboxComponent {
  constructor() {
    this.checkboxHTML = `<mat-checkbox>Checkbox</mat-checkbox>
<mat-checkbox color="primary" [checked]="true">Primary</mat-checkbox>
<mat-checkbox color="accent" [checked]="true">Accent</mat-checkbox>
<mat-checkbox color="warn" [checked]="true">Warn</mat-checkbox>
<mat-checkbox disabled [checked]="true">Disabled</mat-checkbox>
<mat-checkbox [indeterminate]="true">Indeterminate</mat-checkbox>`;
  }
  ngOnInit() {}
  static #_ = this.ɵfac = function ComponentsOverviewCheckboxComponent_Factory(t) {
    return new (t || ComponentsOverviewCheckboxComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: ComponentsOverviewCheckboxComponent,
    selectors: [["vex-components-overview-checkbox"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵStandaloneFeature"]],
    decls: 32,
    vars: 6,
    consts: [[1, "card", "flex", "flex-col", "sm:flex-row"], [1, "p-6", "md:min-w-[300px]"], [1, "title", "mt-0", "mb-4"], [1, "flex", "flex-col", "gap-3"], ["color", "primary", 3, "checked"], ["color", "accent", 3, "checked"], ["color", "warn", 3, "checked"], ["disabled", "", 3, "checked"], [3, "indeterminate"], [1, "border-l", "flex-1"], [1, "p-6"], [1, "body-2", "text-secondary", "m-0"], ["label", "DESCRIPTION"], ["label", "SOURCE CODE"], [3, "vexHighlight"]],
    template: function ComponentsOverviewCheckboxComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h2", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Preview");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 3)(5, "mat-checkbox", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, "Primary");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "mat-checkbox", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8, "Accent");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "mat-checkbox", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](10, "Warn");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "mat-checkbox", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12, "Disabled");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](13, "mat-checkbox", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](14, "Indeterminate");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](15, "div", 9)(16, "div", 10)(17, "h2", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](18, "Checkbox");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](19, "h4", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](20, "<mat-checkbox>");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](21, "mat-tab-group")(22, "mat-tab", 12)(23, "p", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](24, " Checkboxes allow the user to select multiple options from a set. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](25, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](26, "If you have multiple options appearing in a list, you can preserve space by using checkboxes instead of on/off switches. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](27, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](28, "If you have a single option, avoid using a checkbox and use an on/off switch instead. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](29, "mat-tab", 13)(30, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](31, "code", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("checked", true);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("checked", true);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("checked", true);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("checked", true);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("indeterminate", true);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](18);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("vexHighlight", ctx.checkboxHTML);
      }
    },
    dependencies: [_angular_material_checkbox__WEBPACK_IMPORTED_MODULE_2__.MatCheckboxModule, _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_2__.MatCheckbox, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_3__.MatTabsModule, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_3__.MatTab, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_3__.MatTabGroup, _vex_components_vex_highlight_vex_highlight_directive__WEBPACK_IMPORTED_MODULE_0__.VexHighlightDirective],
    styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }),

/***/ 3022:
/*!*****************************************************************************************************************************************!*\
  !*** ./src/app/pages/ui/components/components-overview/components/components-overview-dialogs/components-overview-dialogs.component.ts ***!
  \*****************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ComponentsOverviewDialogsComponent: () => (/* binding */ ComponentsOverviewDialogsComponent),
/* harmony export */   DemoDialogComponent: () => (/* binding */ DemoDialogComponent)
/* harmony export */ });
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/dialog */ 17401);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _vex_components_vex_highlight_vex_highlight_directive__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vex/components/vex-highlight/vex-highlight.directive */ 26010);
/* harmony import */ var _angular_material_tabs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/tabs */ 60989);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);











function ComponentsOverviewDialogsComponent_p_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("You answered with: ", ctx_r0.result, "");
  }
}
class ComponentsOverviewDialogsComponent {
  constructor(dialog) {
    this.dialog = dialog;
    this.dialogHTML = `<button mat-raised-button type="button" (click)="openDialog()" color="primary">Open Dialog</button>
<p *ngIf="result">You chose: {{ result }}</p>
`;
  }
  openDialog() {
    this.dialog.open(DemoDialogComponent, {
      disableClose: false,
      width: '400px'
    }).afterClosed().subscribe(result => {
      this.result = result;
    });
  }
  static #_ = this.ɵfac = function ComponentsOverviewDialogsComponent_Factory(t) {
    return new (t || ComponentsOverviewDialogsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__.MatDialog));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: ComponentsOverviewDialogsComponent,
    selectors: [["vex-components-overview-dialogs"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵStandaloneFeature"]],
    decls: 37,
    vars: 2,
    consts: [[1, "card", "flex", "flex-col", "sm:flex-row"], [1, "p-6", "md:min-w-[300px]"], [1, "title", "mt-0", "mb-4"], [1, "flex", "flex-col", "items-center", "gap-6"], ["color", "primary", "mat-raised-button", "", "type", "button", 3, "click"], [4, "ngIf"], [1, "border-l", "flex-1"], [1, "p-6"], [1, "body-2", "text-secondary", "m-0"], ["label", "DESCRIPTION"], [1, "semi-bold"], ["label", "SOURCE CODE"], [3, "vexHighlight"]],
    template: function ComponentsOverviewDialogsComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h2", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Preview");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 3)(5, "button", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ComponentsOverviewDialogsComponent_Template_button_click_5_listener() {
          return ctx.openDialog();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, " Open Dialog ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](7, ComponentsOverviewDialogsComponent_p_7_Template, 2, 1, "p", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "div", 6)(9, "div", 7)(10, "h2", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](11, "Dialogs");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "h4", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](13, "<mat-dialog>");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "mat-tab-group")(15, "mat-tab", 9)(16, "p", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](17, " Dialogs contain text and UI controls. They retain focus until dismissed or a required action has been taken. Use dialogs sparingly because they are interruptive. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](18, "br")(19, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](20, "span", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](21, "Some dialog types include:");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](22, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](23, "span", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](24, "Alerts");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](25, " are urgent interruptions that inform about a situation and require acknowledgement. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](26, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](27, "span", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](28, "Simple menus");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](29, " display options for list items, whereas simple dialogs can provide details or actions about a list item. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](30, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](31, "span", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](32, "Confirmation dialogs");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](33, " require users to explicitly confirm a choice. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](34, "mat-tab", 11)(35, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](36, "code", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.result);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](29);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("vexHighlight", ctx.dialogHTML);
      }
    },
    dependencies: [_angular_material_button__WEBPACK_IMPORTED_MODULE_3__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_3__.MatButton, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgIf, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_5__.MatTabsModule, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_5__.MatTab, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_5__.MatTabGroup, _vex_components_vex_highlight_vex_highlight_directive__WEBPACK_IMPORTED_MODULE_0__.VexHighlightDirective],
    styles: ["[_nghost-%COMP%] {\n  display: block;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvdWkvY29tcG9uZW50cy9jb21wb25lbnRzLW92ZXJ2aWV3L2NvbXBvbmVudHMvY29tcG9uZW50cy1vdmVydmlldy1kaWFsb2dzL2NvbXBvbmVudHMtb3ZlcnZpZXctZGlhbG9ncy5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGNBQUE7QUFDRiIsInNvdXJjZXNDb250ZW50IjpbIjpob3N0IHtcbiAgZGlzcGxheTogYmxvY2s7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
  });
}
class DemoDialogComponent {
  constructor(dialogRef) {
    this.dialogRef = dialogRef;
  }
  close(answer) {
    this.dialogRef.close(answer);
  }
  static #_ = this.ɵfac = function DemoDialogComponent_Factory(t) {
    return new (t || DemoDialogComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__.MatDialogRef));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: DemoDialogComponent,
    selectors: [["vex-components-overview-demo-dialog"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵStandaloneFeature"]],
    decls: 13,
    vars: 0,
    consts: [["mat-dialog-title", "", 1, "flex", "items-center", "justify-between"], ["type", "button", "mat-icon-button", "", "tabindex", "-1", 3, "click"], ["svgIcon", "mat:close"], ["align", "end"], ["mat-button", "", 3, "click"], ["mat-button", "", "color", "primary", 3, "click"]],
    template: function DemoDialogComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "Question");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "button", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function DemoDialogComponent_Template_button_click_3_listener() {
          return ctx.close("No answer");
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](4, "mat-icon", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "mat-dialog-content")(6, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](7, "Do you like Pizza?");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "mat-dialog-actions", 3)(9, "button", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function DemoDialogComponent_Template_button_click_9_listener() {
          return ctx.close("No");
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](10, "No");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "button", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function DemoDialogComponent_Template_button_click_11_listener() {
          return ctx.close("Yes");
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12, "Yes");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
      }
    },
    dependencies: [_angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__.MatDialogModule, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__.MatDialogTitle, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__.MatDialogActions, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__.MatDialogContent, _angular_material_button__WEBPACK_IMPORTED_MODULE_3__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_3__.MatButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_3__.MatIconButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_6__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_6__.MatIcon],
    encapsulation: 2
  });
}

/***/ }),

/***/ 36924:
/*!*************************************************************************************************************************************!*\
  !*** ./src/app/pages/ui/components/components-overview/components/components-overview-input/components-overview-input.component.ts ***!
  \*************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ComponentsOverviewInputComponent: () => (/* binding */ ComponentsOverviewInputComponent)
/* harmony export */ });
/* harmony import */ var _vex_components_vex_highlight_vex_highlight_directive__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vex/components/vex-highlight/vex-highlight.directive */ 26010);
/* harmony import */ var _angular_material_tabs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/tabs */ 60989);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/input */ 10026);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/form-field */ 51333);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);













function ComponentsOverviewInputComponent_button_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "button", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ComponentsOverviewInputComponent_button_6_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r5);
      const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r4.show());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "mat-icon", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function ComponentsOverviewInputComponent_button_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "button", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ComponentsOverviewInputComponent_button_7_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r7);
      const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r6.hide());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "mat-icon", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function ComponentsOverviewInputComponent_button_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "button", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ComponentsOverviewInputComponent_button_11_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r9);
      const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r8.show());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "mat-icon", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function ComponentsOverviewInputComponent_button_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "button", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ComponentsOverviewInputComponent_button_12_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r11);
      const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r10.hide());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "mat-icon", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
class ComponentsOverviewInputComponent {
  constructor(cd) {
    this.cd = cd;
    this.inputHTML = `<mat-form-field>
  <button *ngIf="!visible" type="button" mat-icon-button matIconPrefix (click)="show()">
    <mat-icon>lock</mat-icon>
  </button>
  <button *ngIf="visible" type="button" mat-icon-button matIconPrefix (click)="hide()">
    <mat-icon>lock_open</mat-icon>
  </button>
  <mat-label>Password</mat-label>
  <input matInput [type]="inputType">
  <button *ngIf="!visible" type="button" mat-icon-button matIconSuffix (click)="show()">
    <mat-icon>visibility</mat-icon>
  </button>
  <button *ngIf="visible" type="button" mat-icon-button matIconSuffix (click)="hide()">
    <mat-icon>visibility_off</mat-icon>
  </button>
</mat-form-field>`;
    this.inputType = 'password';
    this.visible = false;
  }
  ngOnInit() {}
  show() {
    this.inputType = 'text';
    this.visible = true;
    this.cd.markForCheck();
  }
  hide() {
    this.inputType = 'password';
    this.visible = false;
    this.cd.markForCheck();
  }
  static #_ = this.ɵfac = function ComponentsOverviewInputComponent_Factory(t) {
    return new (t || ComponentsOverviewInputComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_1__.ChangeDetectorRef));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: ComponentsOverviewInputComponent,
    selectors: [["vex-components-overview-input"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵStandaloneFeature"]],
    decls: 28,
    vars: 6,
    consts: [[1, "card", "flex", "flex-col", "sm:flex-row"], [1, "p-6", "md:min-w-[300px]"], [1, "title", "mt-0", "mb-4"], [1, "flex", "flex-col"], ["mat-icon-button", "", "matIconPrefix", "", "type", "button", 3, "click", 4, "ngIf"], ["matInput", "", "value", "Hello!", 3, "type"], ["mat-icon-button", "", "matIconSuffix", "", "type", "button", 3, "click", 4, "ngIf"], [1, "border-l", "flex-1"], [1, "p-6"], [1, "body-2", "text-secondary", "m-0"], ["label", "DESCRIPTION"], ["label", "SOURCE CODE"], [3, "vexHighlight"], ["mat-icon-button", "", "matIconPrefix", "", "type", "button", 3, "click"], ["svgIcon", "mat:lock"], ["svgIcon", "mat:lock_open"], ["mat-icon-button", "", "matIconSuffix", "", "type", "button", 3, "click"], ["svgIcon", "mat:visibility"], ["svgIcon", "mat:visibility_off"]],
    template: function ComponentsOverviewInputComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h2", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Preview");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 3)(5, "mat-form-field");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](6, ComponentsOverviewInputComponent_button_6_Template, 2, 0, "button", 4)(7, ComponentsOverviewInputComponent_button_7_Template, 2, 0, "button", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](9, "Password");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](10, "input", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](11, ComponentsOverviewInputComponent_button_11_Template, 2, 0, "button", 6)(12, ComponentsOverviewInputComponent_button_12_Template, 2, 0, "button", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](13, "mat-hint");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](14, "Try clicking the eye or the lock to toggle the visibility. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](15, "div", 7)(16, "div", 8)(17, "h2", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](18, "Input");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](19, "h4", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](20, "<mat-input>");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](21, "mat-tab-group")(22, "mat-tab", 10)(23, "p", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](24, " Text fields typically reside in forms but can appear in other places, like dialog boxes and search. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](25, "mat-tab", 11)(26, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](27, "code", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.visible);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.visible);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("type", ctx.inputType);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.visible);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.visible);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](15);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("vexHighlight", ctx.inputHTML);
      }
    },
    dependencies: [_angular_material_form_field__WEBPACK_IMPORTED_MODULE_2__.MatFormFieldModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_2__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_2__.MatLabel, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_2__.MatHint, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_2__.MatPrefix, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_2__.MatSuffix, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgIf, _angular_material_button__WEBPACK_IMPORTED_MODULE_4__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_4__.MatIconButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__.MatIcon, _angular_material_input__WEBPACK_IMPORTED_MODULE_6__.MatInputModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_6__.MatInput, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_7__.MatTabsModule, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_7__.MatTab, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_7__.MatTabGroup, _vex_components_vex_highlight_vex_highlight_directive__WEBPACK_IMPORTED_MODULE_0__.VexHighlightDirective],
    styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }),

/***/ 53827:
/*!*************************************************************************************************************************************!*\
  !*** ./src/app/pages/ui/components/components-overview/components/components-overview-lists/components-overview-lists.component.ts ***!
  \*************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ComponentsOverviewListsComponent: () => (/* binding */ ComponentsOverviewListsComponent)
/* harmony export */ });
/* harmony import */ var _vex_components_vex_highlight_vex_highlight_directive__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vex/components/vex-highlight/vex-highlight.directive */ 26010);
/* harmony import */ var _angular_material_tabs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/tabs */ 60989);
/* harmony import */ var _angular_material_divider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/divider */ 69400);
/* harmony import */ var _angular_material_list__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/list */ 13228);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);








class ComponentsOverviewListsComponent {
  constructor() {
    this.listHTML = `<mat-list class="list mat-elevation-z1">
  <h3 mat-subheader>Contacts</h3>
  <mat-list-item>
    <img mat-list-avatar src="assets/img/avatars/1.jpg">
    <h3 matLine>John</h3>
    <p matLine>
      <span>Brunch?</span>
      <span class="subline">-- Did you want to go on Sunday? I was thinking</span>
    </p>
  </mat-list-item>
  <mat-list-item>
    <img mat-list-avatar src="assets/img/avatars/2.jpg">
    <h3 matLine>Peter</h3>
    <p matLine>
      <span>Summer BBQ</span>
      <span class="subline">-- Wish I could come, but I have some special</span>
    </p>
  </mat-list-item>
  <mat-list-item>
    <img mat-list-avatar src="assets/img/avatars/3.jpg">
    <h3 matLine>Nancy</h3>
    <p matLine>
      <span>Oui oui</span>
      <span class="subline">-- Have you booked the Paris trip?</span>
    </p>
  </mat-list-item>
  <mat-divider></mat-divider>
  <h3 mat-subheader>Other</h3>
  <mat-list-item>
    <img mat-list-avatar src="assets/img/avatars/4.jpg">
    <h3 matLine>Frank</h3>
    <p matLine>
      <span>Pretty decent!</span>
      <span class="subline">-- You look pretty... decent!</span>
    </p>
  </mat-list-item>
  <mat-list-item>
    <img mat-list-avatar src="assets/img/avatars/5.jpg">
    <h3 matLine>Donald</h3>
    <p matLine>
      <span>That's great!</span>
      <span class="subline">-- Great work mate!</span>
    </p>
  </mat-list-item>
</mat-list>`;
  }
  ngOnInit() {}
  static #_ = this.ɵfac = function ComponentsOverviewListsComponent_Factory(t) {
    return new (t || ComponentsOverviewListsComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: ComponentsOverviewListsComponent,
    selectors: [["vex-components-overview-lists"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵStandaloneFeature"]],
    decls: 83,
    vars: 1,
    consts: [[1, "card", "flex", "flex-col", "sm:flex-row"], [1, "p-6", "md:min-w-[300px]", "bg-app-bar"], [1, "card", "max-w-full", "overflow-hidden", "w-300"], ["mat-subheader", ""], ["matListItemAvatar", "", "src", "assets/img/avatars/1.jpg"], ["matListItemTitle", ""], ["matListItemLine", ""], [1, "text-secondary"], ["matListItemAvatar", "", "src", "assets/img/avatars/2.jpg"], ["matListItemAvatar", "", "src", "assets/img/avatars/3.jpg"], ["matListItemAvatar", "", "src", "assets/img/avatars/4.jpg"], ["matListItemAvatar", "", "src", "assets/img/avatars/5.jpg"], [1, "border-l", "flex-1"], [1, "p-6"], [1, "title", "mt-0", "mb-4"], [1, "body-2", "text-secondary", "m-0"], ["label", "DESCRIPTION"], [1, "semi-bold"], ["label", "SOURCE CODE"], [3, "vexHighlight"]],
    template: function ComponentsOverviewListsComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "mat-list", 2)(3, "h3", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, "Contacts");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "mat-list-item");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](6, "img", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "h3", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8, "John");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "p", 6)(10, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](11, "Brunch?");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](13, "-- Did you want to go on Sunday? I was thinking");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "mat-list-item");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](15, "img", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](16, "h3", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](17, "Peter");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](18, "p", 6)(19, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](20, "Summer BBQ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](21, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](22, "-- Wish I could come, but I have some special");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](23, "mat-list-item");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](24, "img", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](25, "h3", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](26, "Nancy");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](27, "p", 6)(28, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](29, "Oui oui");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](30, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](31, "-- Have you booked the Paris trip?");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](32, "mat-divider");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](33, "h3", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](34, "Other");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](35, "mat-list-item");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](36, "img", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](37, "h3", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](38, "Frank");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](39, "p", 6)(40, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](41, "Pretty decent!");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](42, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](43, "-- You look pretty... decent!");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](44, "mat-list-item");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](45, "img", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](46, "h3", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](47, "Donald");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](48, "p", 6)(49, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](50, "That's great!");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](51, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](52, "-- Great work mate!");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](53, "div", 12)(54, "div", 13)(55, "h2", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](56, "Lists");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](57, "h4", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](58, "<mat-list>");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](59, "mat-tab-group")(60, "mat-tab", 16)(61, "p", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](62, " Lists are made up of a continuous column of rows. Each row contains a tile. Primary actions fill the tile, and supplemental actions are represented by icons and text. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](63, "br")(64, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](65, "Lists are best suited to presenting a homogeneous data type or sets of data types, such as images and text. They are optimized for reading comprehension while differentiating either between similar data types, or qualities within a single data type. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](66, "br")(67, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](68, "span", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](69, "List alternatives:");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](70, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](71, "If more than three lines of text need to be shown in list tiles, use cards instead ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](72, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](73, "If the primary distinguishing content consists of images, use a grid list ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](74, "br")(75, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](76, "span", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](77, "Density");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](78, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](79, "When the mouse and keyboard are the primary input methods, measurements may be condensed to accommodate denser layouts. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](80, "mat-tab", 18)(81, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](82, "code", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](82);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("vexHighlight", ctx.listHTML);
      }
    },
    dependencies: [_angular_material_list__WEBPACK_IMPORTED_MODULE_2__.MatListModule, _angular_material_list__WEBPACK_IMPORTED_MODULE_2__.MatList, _angular_material_list__WEBPACK_IMPORTED_MODULE_2__.MatListItem, _angular_material_list__WEBPACK_IMPORTED_MODULE_2__.MatListItemAvatar, _angular_material_list__WEBPACK_IMPORTED_MODULE_2__.MatListSubheaderCssMatStyler, _angular_material_divider__WEBPACK_IMPORTED_MODULE_3__.MatDivider, _angular_material_list__WEBPACK_IMPORTED_MODULE_2__.MatListItemLine, _angular_material_list__WEBPACK_IMPORTED_MODULE_2__.MatListItemTitle, _angular_material_divider__WEBPACK_IMPORTED_MODULE_3__.MatDividerModule, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_4__.MatTabsModule, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_4__.MatTab, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_4__.MatTabGroup, _vex_components_vex_highlight_vex_highlight_directive__WEBPACK_IMPORTED_MODULE_0__.VexHighlightDirective],
    styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }),

/***/ 31709:
/*!***********************************************************************************************************************************!*\
  !*** ./src/app/pages/ui/components/components-overview/components/components-overview-menu/components-overview-menu.component.ts ***!
  \***********************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ComponentsOverviewMenuComponent: () => (/* binding */ ComponentsOverviewMenuComponent)
/* harmony export */ });
/* harmony import */ var _vex_components_vex_highlight_vex_highlight_directive__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vex/components/vex-highlight/vex-highlight.directive */ 26010);
/* harmony import */ var _angular_material_tabs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/tabs */ 60989);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_menu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/menu */ 78128);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);










class ComponentsOverviewMenuComponent {
  constructor() {
    this.menuHTML = `<button mat-icon-button [mdMenuTriggerFor]="menu">
  <mat-icon>more_vert</mat-icon>
</button>

<mat-menu #menu="mdMenu">
  <button mat-menu-item>
    <mat-icon> dialpad </mat-icon>
    <span> Redial </span>
  </button>
  <button mat-menu-item disabled>
    <mat-icon> voicemail </mat-icon>
    <span> Check voicemail </span>
  </button>
  <button mat-menu-item>
    <mat-icon> notifications_off </mat-icon>
    <span> Disable alerts </span>
  </button>
</mat-menu>`;
  }
  ngOnInit() {}
  static #_ = this.ɵfac = function ComponentsOverviewMenuComponent_Factory(t) {
    return new (t || ComponentsOverviewMenuComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: ComponentsOverviewMenuComponent,
    selectors: [["vex-components-overview-menu"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵStandaloneFeature"]],
    decls: 34,
    vars: 2,
    consts: [[1, "card", "flex", "flex-col", "sm:flex-row"], [1, "p-6", "md:min-w-[300px]"], [1, "title", "mt-0", "mb-4"], [1, "flex", "flex-col", "items-center", "justify-center", "gap-6"], ["mat-icon-button", "", 3, "matMenuTriggerFor"], ["svgIcon", "mat:more_vert"], ["menu", "matMenu"], ["mat-menu-item", ""], ["svgIcon", "mat:dialpad"], ["disabled", "", "mat-menu-item", ""], ["svgIcon", "mat:voicemail"], ["svgIcon", "mat:notifications_off"], [1, "border-l", "flex-1"], [1, "p-6"], [1, "body-2", "text-secondary", "m-0"], ["label", "DESCRIPTION"], ["label", "SOURCE CODE"], [3, "vexHighlight"]],
    template: function ComponentsOverviewMenuComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h2", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Preview");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 3)(5, "button", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](6, "mat-icon", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "mat-menu", null, 6)(9, "button", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](10, "mat-icon", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12, " Redial ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](13, "button", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](14, "mat-icon", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](15, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](16, " Check voicemail ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](17, "button", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](18, "mat-icon", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](19, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](20, " Disable alerts ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](21, "div", 12)(22, "div", 13)(23, "h2", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](24, "Menu");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](25, "h4", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](26, "<mat-menu>");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](27, "mat-tab-group")(28, "mat-tab", 15)(29, "p", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](30, " Menus offer a list of options that are displayed when triggered. The position (before, after) and (above, below) is automatically decided, but can be overridden with e.g. x-position='before'. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](31, "mat-tab", 16)(32, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](33, "code", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()();
      }
      if (rf & 2) {
        const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("matMenuTriggerFor", _r0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](28);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("vexHighlight", ctx.menuHTML);
      }
    },
    dependencies: [_angular_material_button__WEBPACK_IMPORTED_MODULE_2__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_2__.MatIconButton, _angular_material_menu__WEBPACK_IMPORTED_MODULE_3__.MatMenuModule, _angular_material_menu__WEBPACK_IMPORTED_MODULE_3__.MatMenu, _angular_material_menu__WEBPACK_IMPORTED_MODULE_3__.MatMenuItem, _angular_material_menu__WEBPACK_IMPORTED_MODULE_3__.MatMenuTrigger, _angular_material_icon__WEBPACK_IMPORTED_MODULE_4__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_4__.MatIcon, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_5__.MatTabsModule, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_5__.MatTab, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_5__.MatTabGroup, _vex_components_vex_highlight_vex_highlight_directive__WEBPACK_IMPORTED_MODULE_0__.VexHighlightDirective],
    styles: ["[_nghost-%COMP%] {\n  display: block;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvdWkvY29tcG9uZW50cy9jb21wb25lbnRzLW92ZXJ2aWV3L2NvbXBvbmVudHMvY29tcG9uZW50cy1vdmVydmlldy1tZW51L2NvbXBvbmVudHMtb3ZlcnZpZXctbWVudS5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGNBQUE7QUFDRiIsInNvdXJjZXNDb250ZW50IjpbIjpob3N0IHtcbiAgZGlzcGxheTogYmxvY2s7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
  });
}

/***/ }),

/***/ 55449:
/*!***********************************************************************************************************************************************************!*\
  !*** ./src/app/pages/ui/components/components-overview/components/components-overview-progress-spinner/components-overview-progress-spinner.component.ts ***!
  \***********************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ComponentsOverviewProgressSpinnerComponent: () => (/* binding */ ComponentsOverviewProgressSpinnerComponent)
/* harmony export */ });
/* harmony import */ var _vex_components_vex_highlight_vex_highlight_directive__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vex/components/vex-highlight/vex-highlight.directive */ 26010);
/* harmony import */ var _angular_material_tabs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/tabs */ 60989);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/progress-spinner */ 33910);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);






class ComponentsOverviewProgressSpinnerComponent {
  constructor() {
    this.progressSpinnerHTML = `<mat-progress-spinner mode="determinate" [value]="40"></mat-progress-spinner>
<mat-progress-spinner mode="indeterminate" color="accent"></mat-progress-spinner>`;
  }
  ngOnInit() {}
  static #_ = this.ɵfac = function ComponentsOverviewProgressSpinnerComponent_Factory(t) {
    return new (t || ComponentsOverviewProgressSpinnerComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: ComponentsOverviewProgressSpinnerComponent,
    selectors: [["vex-components-overview-progress-spinner"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵStandaloneFeature"]],
    decls: 25,
    vars: 2,
    consts: [[1, "card", "flex", "flex-col", "sm:flex-row"], [1, "p-6", "md:min-w-[300px]"], [1, "title", "mt-0", "mb-4"], [1, "flex", "flex-col", "items-center", "gap-6"], ["mode", "determinate", 3, "value"], ["color", "accent", "mode", "indeterminate"], [1, "border-l", "flex-1"], [1, "p-6"], [1, "body-2", "text-secondary", "m-0"], ["label", "DESCRIPTION"], ["label", "SOURCE CODE"], [3, "vexHighlight"]],
    template: function ComponentsOverviewProgressSpinnerComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h2", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Preview");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](5, "mat-progress-spinner", 4)(6, "mat-progress-spinner", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "div", 6)(8, "div", 7)(9, "h2", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](10, "Progress Spinner");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "h4", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12, "<mat-progress-spinner>");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](13, "mat-tab-group")(14, "mat-tab", 9)(15, "p", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](16, " A single visual indicator should be used to represent each type of operation. For example, a refresh operation should display either a refresh bar or an activity circle, but not both. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](17, "br")(18, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](19, "Determinate indicators display how long an operation will take. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](20, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](21, "Indeterminate indicators visualize an unspecified wait time. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](22, "mat-tab", 10)(23, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](24, "code", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("value", 80);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](19);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("vexHighlight", ctx.progressSpinnerHTML);
      }
    },
    dependencies: [_angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_2__.MatProgressSpinnerModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_2__.MatProgressSpinner, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_3__.MatTabsModule, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_3__.MatTab, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_3__.MatTabGroup, _vex_components_vex_highlight_vex_highlight_directive__WEBPACK_IMPORTED_MODULE_0__.VexHighlightDirective],
    styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }),

/***/ 17937:
/*!*******************************************************************************************************************************************!*\
  !*** ./src/app/pages/ui/components/components-overview/components/components-overview-progress/components-overview-progress.component.ts ***!
  \*******************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ComponentsOverviewProgressComponent: () => (/* binding */ ComponentsOverviewProgressComponent)
/* harmony export */ });
/* harmony import */ var _vex_components_vex_highlight_vex_highlight_directive__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vex/components/vex-highlight/vex-highlight.directive */ 26010);
/* harmony import */ var _angular_material_tabs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/tabs */ 60989);
/* harmony import */ var _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/progress-bar */ 78173);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);






class ComponentsOverviewProgressComponent {
  constructor() {
    this.progressHTML = `<mat-progress-bar mode="determinate" [value]="40"></mat-progress-bar>
<mat-progress-bar mode="indeterminate" color="primary"></mat-progress-bar>
<mat-progress-bar mode="buffer" color="accent"></mat-progress-bar>
<mat-progress-bar mode="query" color="warn"></mat-progress-bar>`;
  }
  ngOnInit() {}
  static #_ = this.ɵfac = function ComponentsOverviewProgressComponent_Factory(t) {
    return new (t || ComponentsOverviewProgressComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: ComponentsOverviewProgressComponent,
    selectors: [["vex-components-overview-progress"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵStandaloneFeature"]],
    decls: 24,
    vars: 2,
    consts: [[1, "card", "flex", "flex-col", "sm:flex-row"], [1, "p-6", "md:min-w-[300px]"], [1, "title", "mt-0", "mb-4"], [1, "flex", "flex-col", "items-center", "gap-6"], ["mode", "determinate", 3, "value"], ["color", "accent", "mode", "indeterminate"], ["color", "accent", "mode", "buffer"], ["color", "warn", "mode", "query"], [1, "border-l", "flex-1"], [1, "p-6"], [1, "body-2", "text-secondary", "m-0"], ["label", "DESCRIPTION"], ["label", "SOURCE CODE"], [3, "vexHighlight"]],
    template: function ComponentsOverviewProgressComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h2", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Preview");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](5, "mat-progress-bar", 4)(6, "mat-progress-bar", 5)(7, "mat-progress-bar", 6)(8, "mat-progress-bar", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "div", 8)(10, "div", 9)(11, "h2", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12, "Progress Bar");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](13, "h4", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](14, "<mat-progress-bar>");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](15, "mat-tab-group")(16, "mat-tab", 11)(17, "p", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](18, " A linear progress indicator should always fill from 0% to 100% and never decrease in value. It should be represented by bars on the edge of a header or sheet that appear and disappear. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](19, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](20, "For multiple operations happening in sequence, use the indicator to represent the progress as a whole, and not each individual operation. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](21, "mat-tab", 12)(22, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](23, "code", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("value", 40);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](18);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("vexHighlight", ctx.progressHTML);
      }
    },
    dependencies: [_angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_2__.MatProgressBarModule, _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_2__.MatProgressBar, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_3__.MatTabsModule, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_3__.MatTab, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_3__.MatTabGroup, _vex_components_vex_highlight_vex_highlight_directive__WEBPACK_IMPORTED_MODULE_0__.VexHighlightDirective],
    styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }),

/***/ 33165:
/*!*************************************************************************************************************************************!*\
  !*** ./src/app/pages/ui/components/components-overview/components/components-overview-radio/components-overview-radio.component.ts ***!
  \*************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ComponentsOverviewRadioComponent: () => (/* binding */ ComponentsOverviewRadioComponent)
/* harmony export */ });
/* harmony import */ var _vex_components_vex_highlight_vex_highlight_directive__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vex/components/vex-highlight/vex-highlight.directive */ 26010);
/* harmony import */ var _angular_material_tabs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/tabs */ 60989);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ 28849);
/* harmony import */ var _angular_material_radio__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/radio */ 92106);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);









function ComponentsOverviewRadioComponent_mat_radio_button_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-radio-button", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const season_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("value", season_r1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", season_r1, " ");
  }
}
class ComponentsOverviewRadioComponent {
  constructor() {
    this.radioHTML = `<mat-radio-group [(ngModel)]="favoriteSeason">
  <mat-radio-button class="radio" *ngFor="let season of seasons" [value]="season">
    {{ season }}
  </mat-radio-button>
</mat-radio-group>`;
    this.seasons = ['Winter', 'Spring', 'Summer', 'Autumn'];
    this.favoriteSeason = this.seasons[2];
  }
  ngOnInit() {}
  static #_ = this.ɵfac = function ComponentsOverviewRadioComponent_Factory(t) {
    return new (t || ComponentsOverviewRadioComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: ComponentsOverviewRadioComponent,
    selectors: [["vex-components-overview-radio"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵStandaloneFeature"]],
    decls: 22,
    vars: 3,
    consts: [[1, "card", "flex", "flex-col", "sm:flex-row"], [1, "p-6", "md:min-w-[300px]"], [1, "title", "mt-0", "mb-4"], [1, "flex", "flex-col", "items-center", "gap-6"], ["color", "primary", 1, "radio", 3, "ngModel", "ngModelChange"], ["class", "example-radio-button", 3, "value", 4, "ngFor", "ngForOf"], [1, "border-l", "flex-1"], [1, "p-6"], [1, "body-2", "text-secondary", "m-0"], ["label", "DESCRIPTION"], ["label", "SOURCE CODE"], [3, "vexHighlight"], [1, "example-radio-button", 3, "value"]],
    template: function ComponentsOverviewRadioComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h2", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Preview");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 3)(5, "mat-radio-group", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function ComponentsOverviewRadioComponent_Template_mat_radio_group_ngModelChange_5_listener($event) {
          return ctx.favoriteSeason = $event;
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](6, ComponentsOverviewRadioComponent_mat_radio_button_6_Template, 2, 2, "mat-radio-button", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "div", 6)(8, "div", 7)(9, "h2", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](10, "Radio");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "h4", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12, "<mat-radio-group>");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](13, "mat-tab-group")(14, "mat-tab", 9)(15, "p", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](16, " Radio buttons allow the user to select one option from a set. Use radio buttons for exclusive selection if you think that the user needs to see all available options side-by-side. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](17, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](18, "Otherwise, consider a dropdown, which uses less space than displaying all options. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](19, "mat-tab", 10)(20, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](21, "code", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx.favoriteSeason);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.seasons);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](15);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("vexHighlight", ctx.radioHTML);
      }
    },
    dependencies: [_angular_material_radio__WEBPACK_IMPORTED_MODULE_2__.MatRadioModule, _angular_material_radio__WEBPACK_IMPORTED_MODULE_2__.MatRadioGroup, _angular_material_radio__WEBPACK_IMPORTED_MODULE_2__.MatRadioButton, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgModel, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgFor, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_5__.MatTabsModule, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_5__.MatTab, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_5__.MatTabGroup, _vex_components_vex_highlight_vex_highlight_directive__WEBPACK_IMPORTED_MODULE_0__.VexHighlightDirective],
    styles: [".radio[_ngcontent-%COMP%] {\n  display: inline-flex;\n  flex-direction: column;\n}\n.radio[_ngcontent-%COMP%]   .mat-mdc-radio-button[_ngcontent-%COMP%] {\n  margin-bottom: 12px;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvdWkvY29tcG9uZW50cy9jb21wb25lbnRzLW92ZXJ2aWV3L2NvbXBvbmVudHMvY29tcG9uZW50cy1vdmVydmlldy1yYWRpby9jb21wb25lbnRzLW92ZXJ2aWV3LXJhZGlvLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0Usb0JBQUE7RUFDQSxzQkFBQTtBQUNGO0FBQ0U7RUFDRSxtQkFBQTtBQUNKIiwic291cmNlc0NvbnRlbnQiOlsiLnJhZGlvIHtcbiAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG5cbiAgLm1hdC1tZGMtcmFkaW8tYnV0dG9uIHtcbiAgICBtYXJnaW4tYm90dG9tOiAxMnB4O1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
  });
}

/***/ }),

/***/ 23568:
/*!***************************************************************************************************************************************************!*\
  !*** ./src/app/pages/ui/components/components-overview/components/components-overview-slide-toggle/components-overview-slide-toggle.component.ts ***!
  \***************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ComponentsOverviewSlideToggleComponent: () => (/* binding */ ComponentsOverviewSlideToggleComponent)
/* harmony export */ });
/* harmony import */ var _vex_components_vex_highlight_vex_highlight_directive__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vex/components/vex-highlight/vex-highlight.directive */ 26010);
/* harmony import */ var _angular_material_tabs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/tabs */ 60989);
/* harmony import */ var _angular_material_slide_toggle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/slide-toggle */ 59293);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);






class ComponentsOverviewSlideToggleComponent {
  constructor() {
    this.slideToggleHTML = `<mat-slide-toggle [checked]="true"></mat-slide-toggle>
<mat-slide-toggle color="primary" [checked]="true"></mat-slide-toggle>
<mat-slide-toggle color="accent" [checked]="true"></mat-slide-toggle>
<mat-slide-toggle color="warn" [checked]="true"></mat-slide-toggle>
<mat-slide-toggle disabled></mat-slide-toggle>`;
  }
  ngOnInit() {}
  static #_ = this.ɵfac = function ComponentsOverviewSlideToggleComponent_Factory(t) {
    return new (t || ComponentsOverviewSlideToggleComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: ComponentsOverviewSlideToggleComponent,
    selectors: [["vex-components-overview-slide-toggle"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵStandaloneFeature"]],
    decls: 22,
    vars: 4,
    consts: [[1, "card", "flex", "flex-col", "sm:flex-row"], [1, "p-6", "md:min-w-[300px]"], [1, "title", "mt-0", "mb-4"], [1, "flex", "flex-col", "items-center", "gap-6"], ["color", "primary", 3, "checked"], ["color", "accent", 3, "checked"], ["color", "warn", 3, "checked"], ["disabled", ""], [1, "border-l", "flex-1"], [1, "p-6"], [1, "body-2", "text-secondary", "m-0"], ["label", "DESCRIPTION"], ["label", "SOURCE CODE"], [3, "vexHighlight"]],
    template: function ComponentsOverviewSlideToggleComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h2", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Preview");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](5, "mat-slide-toggle", 4)(6, "mat-slide-toggle", 5)(7, "mat-slide-toggle", 6)(8, "mat-slide-toggle", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "div", 8)(10, "div", 9)(11, "h2", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12, "Slide Toggle");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](13, "h4", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](14, "<mat-slide-toggle>");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](15, "mat-tab-group")(16, "mat-tab", 11)(17, "p", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](18, " On/off switches toggle the state of a single settings option. The option that the switch controls, as well as the state it\u2019s in, should be made clear from the corresponding inline label. Switches take on the same visual properties of the radio button. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](19, "mat-tab", 12)(20, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](21, "code", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("checked", true);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("checked", true);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("checked", true);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](14);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("vexHighlight", ctx.slideToggleHTML);
      }
    },
    dependencies: [_angular_material_slide_toggle__WEBPACK_IMPORTED_MODULE_2__.MatSlideToggleModule, _angular_material_slide_toggle__WEBPACK_IMPORTED_MODULE_2__.MatSlideToggle, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_3__.MatTabsModule, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_3__.MatTab, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_3__.MatTabGroup, _vex_components_vex_highlight_vex_highlight_directive__WEBPACK_IMPORTED_MODULE_0__.VexHighlightDirective],
    styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }),

/***/ 91375:
/*!***************************************************************************************************************************************!*\
  !*** ./src/app/pages/ui/components/components-overview/components/components-overview-slider/components-overview-slider.component.ts ***!
  \***************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ComponentsOverviewSliderComponent: () => (/* binding */ ComponentsOverviewSliderComponent)
/* harmony export */ });
/* harmony import */ var _vex_components_vex_highlight_vex_highlight_directive__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vex/components/vex-highlight/vex-highlight.directive */ 26010);
/* harmony import */ var _angular_material_tabs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/tabs */ 60989);
/* harmony import */ var _angular_material_slider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/slider */ 70549);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);






class ComponentsOverviewSliderComponent {
  constructor() {
    this.sliderHTML = `<mat-slider min="1" max="10" thumbLabel tickInterval="1"></mat-slider>`;
  }
  ngOnInit() {}
  static #_ = this.ɵfac = function ComponentsOverviewSliderComponent_Factory(t) {
    return new (t || ComponentsOverviewSliderComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: ComponentsOverviewSliderComponent,
    selectors: [["vex-components-overview-slider"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵStandaloneFeature"]],
    decls: 27,
    vars: 1,
    consts: [[1, "card", "flex", "flex-col", "sm:flex-row"], [1, "p-6", "md:min-w-[300px]"], [1, "title", "mt-0", "mb-4"], [1, "flex", "flex-col", "gap-4"], ["color", "primary", "discrete", "", "max", "10", "min", "1"], ["matSliderThumb", "", "value", "7"], ["color", "accent", "discrete", "", "max", "10", "min", "1", "showTickMarks", ""], ["matSliderThumb", "", "value", "2"], ["color", "warn", "max", "10", "min", "1"], ["matSliderThumb", "", "value", "8"], [1, "border-l", "flex-1"], [1, "p-6"], [1, "body-2", "text-secondary", "m-0"], ["label", "DESCRIPTION"], ["label", "SOURCE CODE"], [3, "vexHighlight"]],
    template: function ComponentsOverviewSliderComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h2", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Preview");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 3)(5, "mat-slider", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](6, "input", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "mat-slider", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](8, "input", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "mat-slider", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](10, "input", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "div", 10)(12, "div", 11)(13, "h2", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](14, "Slider");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](15, "h4", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](16, "<mat-slider>");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](17, "mat-tab-group")(18, "mat-tab", 13)(19, "p", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](20, " Sliders are ideal components for adjusting settings that reflect intensity levels, such as volume, brightness, or color saturation. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](21, "br")(22, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](23, "Sliders may have icons on both ends of the bar that reflect the value intensity. Place the smallest value for the slider range on the left and the largest value on the right. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](24, "mat-tab", 14)(25, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](26, "code", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](26);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("vexHighlight", ctx.sliderHTML);
      }
    },
    dependencies: [_angular_material_slider__WEBPACK_IMPORTED_MODULE_2__.MatSliderModule, _angular_material_slider__WEBPACK_IMPORTED_MODULE_2__.MatSlider, _angular_material_slider__WEBPACK_IMPORTED_MODULE_2__.MatSliderThumb, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_3__.MatTabsModule, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_3__.MatTab, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_3__.MatTabGroup, _vex_components_vex_highlight_vex_highlight_directive__WEBPACK_IMPORTED_MODULE_0__.VexHighlightDirective],
    styles: ["[_nghost-%COMP%] {\n  display: block;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvdWkvY29tcG9uZW50cy9jb21wb25lbnRzLW92ZXJ2aWV3L2NvbXBvbmVudHMvY29tcG9uZW50cy1vdmVydmlldy1zbGlkZXIvY29tcG9uZW50cy1vdmVydmlldy1zbGlkZXIuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxjQUFBO0FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyI6aG9zdCB7XG4gIGRpc3BsYXk6IGJsb2NrO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }),

/***/ 42498:
/*!*********************************************************************************************************************************************!*\
  !*** ./src/app/pages/ui/components/components-overview/components/components-overview-snack-bar/components-overview-snack-bar.component.ts ***!
  \*********************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ComponentsOverviewSnackBarComponent: () => (/* binding */ ComponentsOverviewSnackBarComponent)
/* harmony export */ });
/* harmony import */ var _vex_components_vex_highlight_vex_highlight_directive__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vex/components/vex-highlight/vex-highlight.directive */ 26010);
/* harmony import */ var _angular_material_tabs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/tabs */ 60989);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/snack-bar */ 49409);







class ComponentsOverviewSnackBarComponent {
  constructor(snackBar) {
    this.snackBar = snackBar;
    this.snackbarHTML = `<button mat-raised-button (click)="openSnackbar()">TRIGGER SNACKBAR</button>`;
  }
  ngOnInit() {}
  openSnackbar() {
    this.snackBar.open("I'm a notification!", 'CLOSE', {
      duration: 3000,
      horizontalPosition: 'right'
    });
  }
  static #_ = this.ɵfac = function ComponentsOverviewSnackBarComponent_Factory(t) {
    return new (t || ComponentsOverviewSnackBarComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_2__.MatSnackBar));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: ComponentsOverviewSnackBarComponent,
    selectors: [["vex-components-overview-snack-bar"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵStandaloneFeature"]],
    decls: 20,
    vars: 1,
    consts: [[1, "card", "flex", "flex-col", "sm:flex-row"], [1, "p-6", "md:min-w-[300px]"], [1, "title", "mt-0", "mb-4"], [1, "flex", "flex-col", "items-center", "gap-6"], ["color", "primary", "mat-raised-button", "", "type", "button", 3, "click"], [1, "border-l", "flex-1"], [1, "p-6"], [1, "body-2", "text-secondary", "m-0"], ["label", "DESCRIPTION"], ["label", "SOURCE CODE"], [3, "vexHighlight"]],
    template: function ComponentsOverviewSnackBarComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h2", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Preview");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 3)(5, "button", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ComponentsOverviewSnackBarComponent_Template_button_click_5_listener() {
          return ctx.openSnackbar();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, " TRIGGER SNACKBAR ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "div", 5)(8, "div", 6)(9, "h2", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](10, "Snack Bar");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "h4", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12, "<mat-snack-bar>");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](13, "mat-tab-group")(14, "mat-tab", 8)(15, "p", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](16, " Snackbars contain a single line of text directly related to the operation performed. They may contain a text action, but no icons. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](17, "mat-tab", 9)(18, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](19, "code", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](19);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("vexHighlight", ctx.snackbarHTML);
      }
    },
    dependencies: [_angular_material_button__WEBPACK_IMPORTED_MODULE_3__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_3__.MatButton, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_4__.MatTabsModule, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_4__.MatTab, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_4__.MatTabGroup, _vex_components_vex_highlight_vex_highlight_directive__WEBPACK_IMPORTED_MODULE_0__.VexHighlightDirective],
    styles: ["[_nghost-%COMP%] {\n  display: block;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvdWkvY29tcG9uZW50cy9jb21wb25lbnRzLW92ZXJ2aWV3L2NvbXBvbmVudHMvY29tcG9uZW50cy1vdmVydmlldy1zbmFjay1iYXIvY29tcG9uZW50cy1vdmVydmlldy1zbmFjay1iYXIuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxjQUFBO0FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyI6aG9zdCB7XG4gIGRpc3BsYXk6IGJsb2NrO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }),

/***/ 10595:
/*!*****************************************************************************************************************************************!*\
  !*** ./src/app/pages/ui/components/components-overview/components/components-overview-tooltip/components-overview-tooltip.component.ts ***!
  \*****************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ComponentsOverviewTooltipComponent: () => (/* binding */ ComponentsOverviewTooltipComponent)
/* harmony export */ });
/* harmony import */ var _vex_components_vex_highlight_vex_highlight_directive__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vex/components/vex-highlight/vex-highlight.directive */ 26010);
/* harmony import */ var _angular_material_tabs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/tabs */ 60989);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/tooltip */ 60702);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);










class ComponentsOverviewTooltipComponent {
  constructor() {
    this.tooltipHTML = `<button mat-icon-button matTooltip="Favorite this">
  <mat-icon>favorite</mat-icon>
</button>`;
  }
  ngOnInit() {}
  static #_ = this.ɵfac = function ComponentsOverviewTooltipComponent_Factory(t) {
    return new (t || ComponentsOverviewTooltipComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: ComponentsOverviewTooltipComponent,
    selectors: [["vex-components-overview-tooltip"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵStandaloneFeature"]],
    decls: 22,
    vars: 1,
    consts: [[1, "card", "flex", "flex-col", "sm:flex-row"], [1, "p-6", "md:min-w-[300px]"], [1, "title", "mt-0", "mb-4"], [1, "flex", "flex-col", "items-center", "gap-6"], ["mat-icon-button", "", "matTooltip", "Favorite this"], ["svgIcon", "mat:favorite"], [1, "border-l", "flex-1"], [1, "p-6"], [1, "body-2", "text-secondary", "m-0"], ["label", "DESCRIPTION"], ["label", "SOURCE CODE"], [3, "vexHighlight"]],
    template: function ComponentsOverviewTooltipComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h2", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Preview");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 3)(5, "button", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](6, "mat-icon", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "div", 6)(8, "div", 7)(9, "h2", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](10, "Tooltip");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "h4", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12, "<mat-snack-bar>");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](13, "mat-tab-group")(14, "mat-tab", 9)(15, "p", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](16, " Tooltips identify an element when they are activated. They may contain brief helper text about its function. For example, they may contain text information about actionable icons. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](17, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](18, "Tooltip labels do not receive input focus. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](19, "mat-tab", 10)(20, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](21, "code", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](21);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("vexHighlight", ctx.tooltipHTML);
      }
    },
    dependencies: [_angular_material_button__WEBPACK_IMPORTED_MODULE_2__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_2__.MatIconButton, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_3__.MatTooltipModule, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_3__.MatTooltip, _angular_material_icon__WEBPACK_IMPORTED_MODULE_4__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_4__.MatIcon, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_5__.MatTabsModule, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_5__.MatTab, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_5__.MatTabGroup, _vex_components_vex_highlight_vex_highlight_directive__WEBPACK_IMPORTED_MODULE_0__.VexHighlightDirective],
    styles: ["[_nghost-%COMP%] {\n  display: block;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvdWkvY29tcG9uZW50cy9jb21wb25lbnRzLW92ZXJ2aWV3L2NvbXBvbmVudHMvY29tcG9uZW50cy1vdmVydmlldy10b29sdGlwL2NvbXBvbmVudHMtb3ZlcnZpZXctdG9vbHRpcC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGNBQUE7QUFDRiIsInNvdXJjZXNDb250ZW50IjpbIjpob3N0IHtcbiAgZGlzcGxheTogYmxvY2s7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
  });
}

/***/ }),

/***/ 42598:
/*!***********************************************!*\
  !*** ./src/static-data/friend-suggestions.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   friendSuggestions: () => (/* binding */ friendSuggestions)
/* harmony export */ });
const friendSuggestions = [{
  name: 'Fannie Wilson',
  imageSrc: 'assets/img/avatars/1.jpg',
  friends: 6,
  added: false
}, {
  name: 'Priscilla Ayala',
  imageSrc: 'assets/img/avatars/2.jpg',
  friends: 3,
  added: false
}, {
  name: 'Margaret Farley',
  imageSrc: 'assets/img/avatars/3.jpg',
  friends: 3,
  added: true
}, {
  name: 'Alston Tucker',
  imageSrc: 'assets/img/avatars/4.jpg',
  friends: 1,
  added: true
}, {
  name: 'Frye Humphrey',
  imageSrc: 'assets/img/avatars/5.jpg',
  friends: 1,
  added: true
}, {
  name: 'Jannie Cochran',
  imageSrc: 'assets/img/avatars/6.jpg',
  friends: 5,
  added: false
}, {
  name: 'Perkins Doyle',
  imageSrc: 'assets/img/avatars/7.jpg',
  friends: 7,
  added: false
}, {
  name: 'Marci Boyd',
  imageSrc: 'assets/img/avatars/8.jpg',
  friends: 2,
  added: false
}];

/***/ })

}]);
//# sourceMappingURL=common.js.map