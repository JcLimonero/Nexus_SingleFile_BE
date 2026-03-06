"use strict";
(self["webpackChunkvex"] = self["webpackChunkvex"] || []).push([["src_app_pages_configuracion_usuarios_usuarios_component_ts"],{

/***/ 94753:
/*!******************************************************!*\
  !*** ./src/app/core/services/user-access.service.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UserAccessService: () => (/* binding */ UserAccessService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ 54860);
/* harmony import */ var _api_base_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api-base.service */ 14461);



class UserAccessService {
  constructor(http, apiBaseService) {
    this.http = http;
    this.apiBaseService = apiBaseService;
    this.API_URL = '';
  }
  // Obtener accesos actuales de un usuario
  getUserAccess(userId) {
    return this.http.get(`${this.apiBaseService.buildApiUrl('user')}/${userId}/access`);
  }
  // Actualizar accesos de un usuario
  updateUserAccess(userId, access) {
    return this.http.put(`${this.apiBaseService.buildApiUrl('user')}/${userId}/access`, access);
  }
  // Obtener todas las agencias activas
  getActiveAgencies() {
    return this.http.get(`${this.apiBaseService.buildApiUrl('agency')}?enabled=1`);
  }
  // Obtener todos los procesos activos
  getActiveProcesses() {
    return this.http.get(`${this.apiBaseService.buildApiUrl('process')}?enabled=1`);
  }
  // Obtener todas las agencias (activas e inactivas)
  getAllAgencies() {
    return this.http.get(`${this.apiBaseService.buildApiUrl('agency')}`);
  }
  // Obtener todos los procesos (activos e inactivos)
  getAllProcesses() {
    return this.http.get(`${this.apiBaseService.buildApiUrl('process')}`);
  }
  // Obtener agencias asignadas a un usuario
  getUserAgencies(userId) {
    return this.http.get(`${this.apiBaseService.buildApiUrl('user')}/${userId}/agencies`);
  }
  // Obtener procesos asignados a un usuario
  getUserProcesses(userId) {
    return this.http.get(`${this.apiBaseService.buildApiUrl('user')}/${userId}/processes`);
  }
  // Asignar agencias a un usuario
  assignAgenciesToUser(userId, agencyIds) {
    return this.http.post(`${this.apiBaseService.buildApiUrl('user')}/${userId}/agencies`, {
      agencies: agencyIds
    });
  }
  // Asignar procesos a un usuario
  assignProcessesToUser(userId, processIds) {
    return this.http.post(`${this.apiBaseService.buildApiUrl('user')}/${userId}/processes`, {
      processes: processIds
    });
  }
  // Remover agencia de un usuario
  removeAgencyFromUser(userId, agencyId) {
    return this.http.delete(`${this.apiBaseService.buildApiUrl('user')}/${userId}/agencies/${agencyId}`);
  }
  // Remover proceso de un usuario
  removeProcessFromUser(userId, processId) {
    return this.http.delete(`${this.apiBaseService.buildApiUrl('user')}/${userId}/processes/${processId}`);
  }
  static #_ = this.ɵfac = function UserAccessService_Factory(t) {
    return new (t || UserAccessService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpClient), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_api_base_service__WEBPACK_IMPORTED_MODULE_0__.ApiBaseService));
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
    token: UserAccessService,
    factory: UserAccessService.ɵfac,
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

/***/ }),

/***/ 49290:
/*!*************************************************************************************************!*\
  !*** ./src/app/pages/configuracion/usuarios/user-access-dialog/user-access-dialog.component.ts ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UserAccessDialogComponent: () => (/* binding */ UserAccessDialogComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ 28849);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/dialog */ 17401);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/snack-bar */ 49409);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/form-field */ 51333);
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/select */ 96355);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/progress-spinner */ 33910);
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/tooltip */ 60702);
/* harmony import */ var _angular_material_chips__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/chips */ 21757);
/* harmony import */ var _angular_material_list__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/list */ 13228);
/* harmony import */ var _angular_material_tabs__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/tabs */ 60989);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _core_services_user_access_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../core/services/user-access.service */ 94753);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/core */ 55309);




























function UserAccessDialogComponent_div_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "mat-spinner", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function UserAccessDialogComponent_div_8_div_15_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 28)(1, "span", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "Correo Electr\u00F3nico:");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "span", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r2.data.user.Email);
  }
}
function UserAccessDialogComponent_div_8_div_19_mat_option_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-option", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const agency_r11 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("value", agency_r11.Id);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", agency_r11.Name, " ");
  }
}
function UserAccessDialogComponent_div_8_div_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 29)(1, "mat-form-field", 30)(2, "mat-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Seleccionar Agencias");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "mat-select", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("selectionChange", function UserAccessDialogComponent_div_8_div_19_Template_mat_select_selectionChange_4_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r13);
      const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r12.onAgencySelectionChange($event.value));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](5, UserAccessDialogComponent_div_8_div_19_mat_option_5_Template, 2, 2, "mat-option", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "mat-hint");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](7, "Selecciona las agencias a las que el usuario tendr\u00E1 acceso");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "div", 33)(9, "button", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function UserAccessDialogComponent_div_8_div_19_Template_button_click_9_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r13);
      const ctx_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r14.assignAllAgencies());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](11, "add_circle");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12, " Asignar Todas ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](13, "button", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function UserAccessDialogComponent_div_8_div_19_Template_button_click_13_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r13);
      const ctx_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r15.removeAllAgencies());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](15, "remove_circle");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](16, " Quitar Todas ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("value", ctx_r3.selectedAgencies);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx_r3.allAgencies);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", ctx_r3.selectedAgencies.length === ctx_r3.allAgencies.length);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", ctx_r3.selectedAgencies.length === 0);
  }
}
function UserAccessDialogComponent_div_8_div_23_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 37)(1, "mat-icon", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "business_center");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "p", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, "No hay agencias asignadas");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
}
function UserAccessDialogComponent_div_8_div_24_mat_chip_2_mat_icon_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-icon", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " cancel ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function UserAccessDialogComponent_div_8_div_24_mat_chip_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-chip", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("removed", function UserAccessDialogComponent_div_8_div_24_mat_chip_2_Template_mat_chip_removed_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r20);
      const agencyId_r17 = restoredCtx.$implicit;
      const ctx_r19 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r19.removeAgency(agencyId_r17));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "mat-icon", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "business");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "span", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](5, UserAccessDialogComponent_div_8_div_24_mat_chip_2_mat_icon_5_Template, 2, 0, "mat-icon", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const agencyId_r17 = ctx.$implicit;
    const ctx_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("removable", !ctx_r16.isReadonly);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r16.getAgencyName(agencyId_r17));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx_r16.isReadonly);
  }
}
function UserAccessDialogComponent_div_8_div_24_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 40)(1, "mat-chip-set");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](2, UserAccessDialogComponent_div_8_div_24_mat_chip_2_Template, 6, 3, "mat-chip", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx_r5.selectedAgencies);
  }
}
function UserAccessDialogComponent_div_8_div_27_mat_option_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-option", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const process_r22 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("value", process_r22.Id);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", process_r22.Name, " ");
  }
}
function UserAccessDialogComponent_div_8_div_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r24 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 29)(1, "mat-form-field", 30)(2, "mat-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Seleccionar Procesos");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "mat-select", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("selectionChange", function UserAccessDialogComponent_div_8_div_27_Template_mat_select_selectionChange_4_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r24);
      const ctx_r23 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r23.onProcessSelectionChange($event.value));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](5, UserAccessDialogComponent_div_8_div_27_mat_option_5_Template, 2, 2, "mat-option", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "mat-hint");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](7, "Selecciona los procesos que el usuario podr\u00E1 gestionar");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "div", 33)(9, "button", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function UserAccessDialogComponent_div_8_div_27_Template_button_click_9_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r24);
      const ctx_r25 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r25.assignAllProcesses());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](11, "add_circle");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12, " Asignar Todos ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](13, "button", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function UserAccessDialogComponent_div_8_div_27_Template_button_click_13_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r24);
      const ctx_r26 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r26.removeAllProcesses());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](15, "remove_circle");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](16, " Quitar Todos ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("value", ctx_r6.selectedProcesses);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx_r6.allProcesses);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", ctx_r6.selectedProcesses.length === ctx_r6.allProcesses.length);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", ctx_r6.selectedProcesses.length === 0);
  }
}
function UserAccessDialogComponent_div_8_div_31_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 37)(1, "mat-icon", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "settings");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "p", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, "No hay procesos asignados");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
}
function UserAccessDialogComponent_div_8_div_32_mat_chip_2_mat_icon_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-icon", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " cancel ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function UserAccessDialogComponent_div_8_div_32_mat_chip_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r31 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-chip", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("removed", function UserAccessDialogComponent_div_8_div_32_mat_chip_2_Template_mat_chip_removed_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r31);
      const processId_r28 = restoredCtx.$implicit;
      const ctx_r30 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r30.removeProcess(processId_r28));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "mat-icon", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "settings");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "span", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](5, UserAccessDialogComponent_div_8_div_32_mat_chip_2_mat_icon_5_Template, 2, 0, "mat-icon", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const processId_r28 = ctx.$implicit;
    const ctx_r27 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("removable", !ctx_r27.isReadonly);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r27.getProcessName(processId_r28));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx_r27.isReadonly);
  }
}
function UserAccessDialogComponent_div_8_div_32_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 40)(1, "mat-chip-set");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](2, UserAccessDialogComponent_div_8_div_32_mat_chip_2_Template, 6, 3, "mat-chip", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx_r8.selectedProcesses);
  }
}
function UserAccessDialogComponent_div_8_button_36_mat_spinner_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "mat-spinner", 50);
  }
}
function UserAccessDialogComponent_div_8_button_36_mat_icon_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "save");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function UserAccessDialogComponent_div_8_button_36_Template(rf, ctx) {
  if (rf & 1) {
    const _r35 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "button", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function UserAccessDialogComponent_div_8_button_36_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r35);
      const ctx_r34 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r34.onSubmit());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, UserAccessDialogComponent_div_8_button_36_mat_spinner_1_Template, 1, 0, "mat-spinner", 48)(2, UserAccessDialogComponent_div_8_button_36_mat_icon_2_Template, 2, 0, "mat-icon", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", ctx_r9.loading);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r9.loading);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx_r9.loading);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx_r9.submitButtonText, " ");
  }
}
function UserAccessDialogComponent_div_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r37 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 8)(1, "div", 9)(2, "h3", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Informaci\u00F3n del Usuario");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 11)(5, "div")(6, "span", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](7, "ID:");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "span", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "div")(11, "span", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12, "Usuario DMS:");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](13, "span", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](15, UserAccessDialogComponent_div_8_div_15_Template, 5, 1, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](16, "mat-tab-group", 16)(17, "mat-tab", 17)(18, "div", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](19, UserAccessDialogComponent_div_8_div_19_Template, 17, 4, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](20, "div", 20)(21, "h4", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](22);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](23, UserAccessDialogComponent_div_8_div_23_Template, 5, 0, "div", 22)(24, UserAccessDialogComponent_div_8_div_24_Template, 3, 1, "div", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](25, "mat-tab", 24)(26, "div", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](27, UserAccessDialogComponent_div_8_div_27_Template, 17, 4, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](28, "div", 20)(29, "h4", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](30);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](31, UserAccessDialogComponent_div_8_div_31_Template, 5, 0, "div", 22)(32, UserAccessDialogComponent_div_8_div_32_Template, 3, 1, "div", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](33, "div", 25)(34, "button", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function UserAccessDialogComponent_div_8_Template_button_click_34_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r37);
      const ctx_r36 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r36.onCancel());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](35, " Cancelar ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](36, UserAccessDialogComponent_div_8_button_36_Template, 4, 4, "button", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r1.data.user.Id);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r1.data.user.User);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r1.data.user.Email);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx_r1.isReadonly);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" Agencias Asignadas (", ctx_r1.selectedAgencies.length, ") ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r1.selectedAgencies.length === 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r1.selectedAgencies.length > 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx_r1.isReadonly);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" Procesos Asignados (", ctx_r1.selectedProcesses.length, ") ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r1.selectedProcesses.length === 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r1.selectedProcesses.length > 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", ctx_r1.loading);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx_r1.isReadonly);
  }
}
class UserAccessDialogComponent {
  constructor(fb, userAccessService, dialogRef, data, snackBar) {
    this.fb = fb;
    this.userAccessService = userAccessService;
    this.dialogRef = dialogRef;
    this.data = data;
    this.snackBar = snackBar;
    this.loading = false;
    // Datos disponibles
    this.allAgencies = [];
    this.allProcesses = [];
    // Datos asignados al usuario
    this.userAgencies = [];
    this.userProcesses = [];
    // Datos temporales para el formulario
    this.selectedAgencies = [];
    this.selectedProcesses = [];
  }
  ngOnInit() {
    this.initializeForm();
    this.loadData();
  }
  initializeForm() {
    this.accessForm = this.fb.group({
      agencies: [[]],
      processes: [[]]
    });
  }
  loadData() {
    this.loading = true;
    // Cargar agencias y procesos disponibles, y los accesos actuales del usuario
    Promise.all([this.userAccessService.getActiveAgencies().toPromise(), this.userAccessService.getActiveProcesses().toPromise(), this.userAccessService.getUserAccess(this.data.user.Id).toPromise()]).then(([agenciesResponse, processesResponse, userAccessResponse]) => {
      // Procesar agencias disponibles
      if (agenciesResponse?.success) {
        this.allAgencies = agenciesResponse.data.agencies || [];
      }
      // Procesar procesos disponibles
      if (processesResponse?.success) {
        this.allProcesses = processesResponse.data.processes || [];
      }
      // Cargar accesos actuales del usuario
      if (userAccessResponse?.success) {
        this.userAgencies = userAccessResponse.data.agencies || [];
        this.userProcesses = userAccessResponse.data.processes || [];
      } else {
        // Si no hay accesos o hay error, inicializar vacío
        this.userAgencies = [];
        this.userProcesses = [];
      }
      // Inicializar selecciones con los datos del usuario
      this.selectedAgencies = [...this.userAgencies];
      this.selectedProcesses = [...this.userProcesses];
      // Actualizar formulario
      this.accessForm.patchValue({
        agencies: this.selectedAgencies,
        processes: this.selectedProcesses
      });
      this.loading = false;
    }).catch(error => {
      this.snackBar.open('Error al cargar datos de acceso', 'Error', {
        duration: 3000
      });
      this.loading = false;
    });
  }
  onAgencySelectionChange(agencies) {
    this.selectedAgencies = agencies;
  }
  onProcessSelectionChange(processes) {
    this.selectedProcesses = processes;
  }
  removeAgency(agencyId) {
    this.selectedAgencies = this.selectedAgencies.filter(id => id !== agencyId);
    this.accessForm.patchValue({
      agencies: this.selectedAgencies
    });
  }
  removeProcess(processId) {
    this.selectedProcesses = this.selectedProcesses.filter(id => id !== processId);
    this.accessForm.patchValue({
      processes: this.selectedProcesses
    });
  }
  /**
   * Asignar todas las agencias disponibles
   */
  assignAllAgencies() {
    this.selectedAgencies = this.allAgencies.map(agency => agency.Id);
    this.accessForm.patchValue({
      agencies: this.selectedAgencies
    });
    this.snackBar.open(`Todas las agencias (${this.allAgencies.length}) han sido asignadas`, 'Éxito', {
      duration: 2000
    });
  }
  /**
   * Quitar todas las agencias asignadas
   */
  removeAllAgencies() {
    this.selectedAgencies = [];
    this.accessForm.patchValue({
      agencies: this.selectedAgencies
    });
    this.snackBar.open('Todas las agencias han sido removidas', 'Info', {
      duration: 2000
    });
  }
  /**
   * Asignar todos los procesos disponibles
   */
  assignAllProcesses() {
    this.selectedProcesses = this.allProcesses.map(process => process.Id);
    this.accessForm.patchValue({
      processes: this.selectedProcesses
    });
    this.snackBar.open(`Todos los procesos (${this.allProcesses.length}) han sido asignados`, 'Éxito', {
      duration: 2000
    });
  }
  /**
   * Quitar todos los procesos asignados
   */
  removeAllProcesses() {
    this.selectedProcesses = [];
    this.accessForm.patchValue({
      processes: this.selectedProcesses
    });
    this.snackBar.open('Todos los procesos han sido removidos', 'Info', {
      duration: 2000
    });
  }
  getAgencyName(agencyId) {
    const agency = this.allAgencies.find(a => a.Id === agencyId);
    return agency?.Name || `Agencia ${agencyId}`;
  }
  getProcessName(processId) {
    const process = this.allProcesses.find(p => p.Id === processId);
    return process?.Name || `Proceso ${processId}`;
  }
  onSubmit() {
    if (this.data.mode === 'view') {
      this.onCancel();
      return;
    }
    this.loading = true;
    const accessData = {
      userId: this.data.user.Id,
      agencies: this.selectedAgencies,
      processes: this.selectedProcesses
    };
    this.userAccessService.updateUserAccess(this.data.user.Id, accessData).subscribe({
      next: response => {
        if (response.success) {
          this.snackBar.open('Accesos actualizados exitosamente', 'Éxito', {
            duration: 2000
          });
          this.dialogRef.close(true);
        } else {
          this.snackBar.open(response.message || 'Error al actualizar accesos', 'Error', {
            duration: 3000
          });
        }
        this.loading = false;
      },
      error: error => {
        this.snackBar.open('Error al actualizar accesos', 'Error', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }
  onCancel() {
    this.dialogRef.close();
  }
  get dialogTitle() {
    return `${this.data.mode === 'view' ? 'Ver' : 'Gestionar'} Accesos - ${this.data.user.Name}`;
  }
  get submitButtonText() {
    return this.data.mode === 'view' ? 'Cerrar' : 'Guardar Cambios';
  }
  get isReadonly() {
    return this.data.mode === 'view';
  }
  static #_ = this.ɵfac = function UserAccessDialogComponent_Factory(t) {
    return new (t || UserAccessDialogComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_core_services_user_access_service__WEBPACK_IMPORTED_MODULE_0__.UserAccessService), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_3__.MatDialogRef), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_3__.MAT_DIALOG_DATA), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_4__.MatSnackBar));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: UserAccessDialogComponent,
    selectors: [["app-user-access-dialog"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵStandaloneFeature"]],
    decls: 9,
    vars: 3,
    consts: [[1, "p-0"], [1, "flex", "items-center", "justify-between", "p-6", "border-b", "border-gray-200"], [1, "text-xl", "font-semibold", "text-gray-900"], ["mat-icon-button", "", "matTooltip", "Cerrar", 3, "click"], ["class", "flex justify-center items-center py-8", 4, "ngIf"], ["class", "p-6", 4, "ngIf"], [1, "flex", "justify-center", "items-center", "py-8"], ["diameter", "40"], [1, "p-6"], [1, "bg-blue-50", "p-4", "rounded-lg", "mb-6"], [1, "text-sm", "font-medium", "text-blue-900", "mb-3"], [1, "grid", "grid-cols-2", "gap-4", "text-sm"], [1, "text-blue-700", "font-medium"], [1, "ml-2", "font-mono", "text-blue-900"], [1, "ml-2", "text-blue-900"], ["class", "col-span-2", 4, "ngIf"], ["animationDuration", "300ms"], ["label", "Agencias Autorizadas"], [1, "py-4"], ["class", "mb-4", 4, "ngIf"], [1, "space-y-2"], [1, "text-sm", "font-medium", "text-gray-700", "mb-3"], ["class", "text-center py-6 text-gray-500", 4, "ngIf"], ["class", "chips-container", 4, "ngIf"], ["label", "Procesos Autorizados"], [1, "flex", "justify-end", "space-x-3", "pt-6", "border-t", "mt-6"], ["type", "button", "mat-button", "", 3, "disabled", "click"], ["type", "button", "mat-raised-button", "", "color", "primary", 3, "disabled", "click", 4, "ngIf"], [1, "col-span-2"], [1, "mb-4"], ["appearance", "outline", 1, "w-full"], ["multiple", "", 3, "value", "selectionChange"], [3, "value", 4, "ngFor", "ngForOf"], [1, "flex", "gap-2", "mt-3"], ["type", "button", "mat-stroked-button", "", "color", "primary", 1, "flex", "items-center", "gap-2", 3, "disabled", "click"], ["type", "button", "mat-stroked-button", "", "color", "warn", 1, "flex", "items-center", "gap-2", 3, "disabled", "click"], [3, "value"], [1, "text-center", "py-6", "text-gray-500"], [1, "text-gray-400", "text-3xl", "mb-2"], [1, "text-sm"], [1, "chips-container"], ["class", "!text-xs !h-7 !px-2", 3, "removable", "removed", 4, "ngFor", "ngForOf"], [1, "!text-xs", "!h-7", "!px-2", 3, "removable", "removed"], ["matChipAvatar", "", 1, "!text-sm", "!w-4", "!h-4"], [1, "!text-xs"], ["matChipRemove", "", "class", "!text-sm !w-4 !h-4", 4, "ngIf"], ["matChipRemove", "", 1, "!text-sm", "!w-4", "!h-4"], ["type", "button", "mat-raised-button", "", "color", "primary", 3, "disabled", "click"], ["diameter", "20", "class", "mr-2", 4, "ngIf"], [4, "ngIf"], ["diameter", "20", 1, "mr-2"]],
    template: function UserAccessDialogComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h2", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "button", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function UserAccessDialogComponent_Template_button_click_4_listener() {
          return ctx.onCancel();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, "close");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](7, UserAccessDialogComponent_div_7_Template, 2, 0, "div", 4)(8, UserAccessDialogComponent_div_8_Template, 37, 13, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx.dialogTitle, " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.loading);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_5__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_5__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.ReactiveFormsModule, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_3__.MatDialogModule, _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_4__.MatSnackBarModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_6__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_6__.MatButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_6__.MatIconButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_7__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_7__.MatIcon, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__.MatFormFieldModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__.MatLabel, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__.MatHint, _angular_material_select__WEBPACK_IMPORTED_MODULE_9__.MatSelectModule, _angular_material_select__WEBPACK_IMPORTED_MODULE_9__.MatSelect, _angular_material_core__WEBPACK_IMPORTED_MODULE_10__.MatOption, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_11__.MatProgressSpinnerModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_11__.MatProgressSpinner, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_12__.MatTooltipModule, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_12__.MatTooltip, _angular_material_chips__WEBPACK_IMPORTED_MODULE_13__.MatChipsModule, _angular_material_chips__WEBPACK_IMPORTED_MODULE_13__.MatChip, _angular_material_chips__WEBPACK_IMPORTED_MODULE_13__.MatChipAvatar, _angular_material_chips__WEBPACK_IMPORTED_MODULE_13__.MatChipRemove, _angular_material_chips__WEBPACK_IMPORTED_MODULE_13__.MatChipSet, _angular_material_list__WEBPACK_IMPORTED_MODULE_14__.MatListModule, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_15__.MatTabsModule, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_15__.MatTab, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_15__.MatTabGroup],
    styles: [".mat-mdc-dialog-container[_ngcontent-%COMP%] {\n  border-radius: 8px;\n  max-width: 800px;\n  width: 90vw;\n}\n\n.mat-mdc-form-field[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.mat-mdc-button[_ngcontent-%COMP%] {\n  text-transform: none;\n}\n\n.mat-mdc-button[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%] {\n  display: inline-block;\n  margin-right: 8px;\n}\n\n.mat-mdc-tab-group[_ngcontent-%COMP%]   .mat-mdc-tab-body-wrapper[_ngcontent-%COMP%] {\n  min-height: 300px;\n}\n\n.mat-mdc-chip-set[_ngcontent-%COMP%]   .mat-mdc-chip[_ngcontent-%COMP%] {\n  font-size: 11px !important;\n  height: 28px !important;\n  min-height: 28px !important;\n  padding: 0 8px !important;\n}\n.mat-mdc-chip-set[_ngcontent-%COMP%]   .mat-mdc-chip[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  font-size: 14px !important;\n  width: 14px !important;\n  height: 14px !important;\n}\n.mat-mdc-chip-set[_ngcontent-%COMP%]   .mat-mdc-chip[_ngcontent-%COMP%]   .mdc-chip__text[_ngcontent-%COMP%] {\n  font-size: 11px !important;\n}\n.mat-mdc-chip-set[_ngcontent-%COMP%]   .mat-mdc-chip[_ngcontent-%COMP%]   .mat-mdc-chip-avatar[_ngcontent-%COMP%] {\n  font-size: 12px !important;\n  width: 16px !important;\n  height: 16px !important;\n  margin-right: 4px !important;\n}\n.mat-mdc-chip-set[_ngcontent-%COMP%]   .mat-mdc-chip[_ngcontent-%COMP%]   .mat-mdc-chip-remove[_ngcontent-%COMP%] {\n  font-size: 14px !important;\n  width: 16px !important;\n  height: 16px !important;\n  margin-left: 4px !important;\n}\n\n.chips-container[_ngcontent-%COMP%] {\n  max-height: 200px;\n  overflow-y: auto;\n  padding: 8px;\n  background-color: #f9fafb;\n  border-radius: 6px;\n  border: 1px solid #e5e7eb;\n}\n.chips-container[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 4px;\n}\n.chips-container[_ngcontent-%COMP%]::-webkit-scrollbar-track {\n  background: #f1f1f1;\n  border-radius: 2px;\n}\n.chips-container[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background: #c1c1c1;\n  border-radius: 2px;\n}\n.chips-container[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover {\n  background: #a8a8a8;\n}\n\n.access-item[_ngcontent-%COMP%] {\n  background-color: #f9fafb;\n  border: 1px solid #e5e7eb;\n  border-radius: 6px;\n  padding: 12px;\n  margin-bottom: 8px;\n  display: flex;\n  align-items: center;\n  justify-content: between;\n}\n.access-item[_ngcontent-%COMP%]   .item-info[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex: 1;\n}\n.access-item[_ngcontent-%COMP%]   .item-info[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  margin-right: 8px;\n  font-size: 20px;\n  width: 20px;\n  height: 20px;\n}\n.access-item[_ngcontent-%COMP%]   .item-info[_ngcontent-%COMP%]   .item-name[_ngcontent-%COMP%] {\n  font-weight: 500;\n  color: #111827;\n}\n.access-item[_ngcontent-%COMP%]   .remove-button[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  font-size: 16px;\n  width: 16px;\n  height: 16px;\n}\n\n.empty-state[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 32px 16px;\n  color: #6b7280;\n}\n.empty-state[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  font-size: 48px;\n  width: 48px;\n  height: 48px;\n  margin-bottom: 8px;\n  color: #d1d5db;\n}\n.empty-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 14px;\n}\n\n.user-info[_ngcontent-%COMP%] {\n  background-color: #eff6ff;\n  border: 1px solid #dbeafe;\n  border-radius: 6px;\n  padding: 16px;\n  margin-bottom: 24px;\n}\n.user-info[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  color: #1e40af;\n  font-size: 14px;\n  font-weight: 600;\n  margin: 0 0 8px 0;\n}\n.user-info[_ngcontent-%COMP%]   .info-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 16px;\n  font-size: 14px;\n}\n.user-info[_ngcontent-%COMP%]   .info-grid[_ngcontent-%COMP%]   .info-item[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {\n  color: #1d4ed8;\n  font-weight: 500;\n}\n.user-info[_ngcontent-%COMP%]   .info-grid[_ngcontent-%COMP%]   .info-item[_ngcontent-%COMP%]   .value[_ngcontent-%COMP%] {\n  margin-left: 8px;\n  color: #1e3a8a;\n}\n.user-info[_ngcontent-%COMP%]   .info-grid[_ngcontent-%COMP%]   .info-item[_ngcontent-%COMP%]   .value.mono[_ngcontent-%COMP%] {\n  font-family: \"Courier New\", monospace;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvY29uZmlndXJhY2lvbi91c3Vhcmlvcy91c2VyLWFjY2Vzcy1kaWFsb2cvdXNlci1hY2Nlc3MtZGlhbG9nLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBO0VBQ0Usa0JBQUE7RUFDQSxnQkFBQTtFQUNBLFdBQUE7QUFGRjs7QUFLQTtFQUNFLFdBQUE7QUFGRjs7QUFLQTtFQUNFLG9CQUFBO0FBRkY7O0FBTUE7RUFDRSxxQkFBQTtFQUNBLGlCQUFBO0FBSEY7O0FBUUU7RUFDRSxpQkFBQTtBQUxKOztBQVdFO0VBQ0UsMEJBQUE7RUFDQSx1QkFBQTtFQUNBLDJCQUFBO0VBQ0EseUJBQUE7QUFSSjtBQVVJO0VBQ0UsMEJBQUE7RUFDQSxzQkFBQTtFQUNBLHVCQUFBO0FBUk47QUFXSTtFQUNFLDBCQUFBO0FBVE47QUFhSTtFQUNFLDBCQUFBO0VBQ0Esc0JBQUE7RUFDQSx1QkFBQTtFQUNBLDRCQUFBO0FBWE47QUFlSTtFQUNFLDBCQUFBO0VBQ0Esc0JBQUE7RUFDQSx1QkFBQTtFQUNBLDJCQUFBO0FBYk47O0FBbUJBO0VBQ0UsaUJBQUE7RUFDQSxnQkFBQTtFQUNBLFlBQUE7RUFDQSx5QkFBQTtFQUNBLGtCQUFBO0VBQ0EseUJBQUE7QUFoQkY7QUFrQkU7RUFDRSxVQUFBO0FBaEJKO0FBbUJFO0VBQ0UsbUJBQUE7RUFDQSxrQkFBQTtBQWpCSjtBQW9CRTtFQUNFLG1CQUFBO0VBQ0Esa0JBQUE7QUFsQko7QUFxQkU7RUFDRSxtQkFBQTtBQW5CSjs7QUF3QkE7RUFDRSx5QkFBQTtFQUNBLHlCQUFBO0VBQ0Esa0JBQUE7RUFDQSxhQUFBO0VBQ0Esa0JBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSx3QkFBQTtBQXJCRjtBQXVCRTtFQUNFLGFBQUE7RUFDQSxtQkFBQTtFQUNBLE9BQUE7QUFyQko7QUF1Qkk7RUFDRSxpQkFBQTtFQUNBLGVBQUE7RUFDQSxXQUFBO0VBQ0EsWUFBQTtBQXJCTjtBQXdCSTtFQUNFLGdCQUFBO0VBQ0EsY0FBQTtBQXRCTjtBQTJCSTtFQUNFLGVBQUE7RUFDQSxXQUFBO0VBQ0EsWUFBQTtBQXpCTjs7QUErQkE7RUFDRSxrQkFBQTtFQUNBLGtCQUFBO0VBQ0EsY0FBQTtBQTVCRjtBQThCRTtFQUNFLGVBQUE7RUFDQSxXQUFBO0VBQ0EsWUFBQTtFQUNBLGtCQUFBO0VBQ0EsY0FBQTtBQTVCSjtBQStCRTtFQUNFLFNBQUE7RUFDQSxlQUFBO0FBN0JKOztBQWtDQTtFQUNFLHlCQUFBO0VBQ0EseUJBQUE7RUFDQSxrQkFBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtBQS9CRjtBQWlDRTtFQUNFLGNBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxpQkFBQTtBQS9CSjtBQWtDRTtFQUNFLGFBQUE7RUFDQSxxQ0FBQTtFQUNBLFNBQUE7RUFDQSxlQUFBO0FBaENKO0FBbUNNO0VBQ0UsY0FBQTtFQUNBLGdCQUFBO0FBakNSO0FBb0NNO0VBQ0UsZ0JBQUE7RUFDQSxjQUFBO0FBbENSO0FBb0NRO0VBQ0UscUNBQUE7QUFsQ1YiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBFc3RpbG9zIGVzcGVjw4PCrWZpY29zIHBhcmEgZWwgZGnDg8KhbG9nbyBkZSBhY2Nlc29zIGRlIHVzdWFyaW9cbi8vIExvcyBlc3RpbG9zIHByaW5jaXBhbGVzIGVzdMODwqFuIG1hbmVqYWRvcyBwb3IgVGFpbHdpbmQgQ1NTXG5cbi5tYXQtbWRjLWRpYWxvZy1jb250YWluZXIge1xuICBib3JkZXItcmFkaXVzOiA4cHg7XG4gIG1heC13aWR0aDogODAwcHg7XG4gIHdpZHRoOiA5MHZ3O1xufVxuXG4ubWF0LW1kYy1mb3JtLWZpZWxkIHtcbiAgd2lkdGg6IDEwMCU7XG59XG5cbi5tYXQtbWRjLWJ1dHRvbiB7XG4gIHRleHQtdHJhbnNmb3JtOiBub25lO1xufVxuXG4vLyBTcGlubmVyIGRlbnRybyBkZWwgYm90w4PCs25cbi5tYXQtbWRjLWJ1dHRvbiBtYXQtc3Bpbm5lciB7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgbWFyZ2luLXJpZ2h0OiA4cHg7XG59XG5cbi8vIEVzdGlsb3MgcGFyYSBsYXMgdGFic1xuLm1hdC1tZGMtdGFiLWdyb3VwIHtcbiAgLm1hdC1tZGMtdGFiLWJvZHktd3JhcHBlciB7XG4gICAgbWluLWhlaWdodDogMzAwcHg7XG4gIH1cbn1cblxuLy8gRXN0aWxvcyBwYXJhIGxvcyBjaGlwcyBjb21wYWN0b3Ncbi5tYXQtbWRjLWNoaXAtc2V0IHtcbiAgLm1hdC1tZGMtY2hpcCB7XG4gICAgZm9udC1zaXplOiAxMXB4ICFpbXBvcnRhbnQ7XG4gICAgaGVpZ2h0OiAyOHB4ICFpbXBvcnRhbnQ7XG4gICAgbWluLWhlaWdodDogMjhweCAhaW1wb3J0YW50O1xuICAgIHBhZGRpbmc6IDAgOHB4ICFpbXBvcnRhbnQ7XG4gICAgXG4gICAgLm1hdC1pY29uIHtcbiAgICAgIGZvbnQtc2l6ZTogMTRweCAhaW1wb3J0YW50O1xuICAgICAgd2lkdGg6IDE0cHggIWltcG9ydGFudDtcbiAgICAgIGhlaWdodDogMTRweCAhaW1wb3J0YW50O1xuICAgIH1cbiAgICBcbiAgICAubWRjLWNoaXBfX3RleHQge1xuICAgICAgZm9udC1zaXplOiAxMXB4ICFpbXBvcnRhbnQ7XG4gICAgfVxuICAgIFxuICAgIC8vIEF2YXRhciBpY29uXG4gICAgLm1hdC1tZGMtY2hpcC1hdmF0YXIge1xuICAgICAgZm9udC1zaXplOiAxMnB4ICFpbXBvcnRhbnQ7XG4gICAgICB3aWR0aDogMTZweCAhaW1wb3J0YW50O1xuICAgICAgaGVpZ2h0OiAxNnB4ICFpbXBvcnRhbnQ7XG4gICAgICBtYXJnaW4tcmlnaHQ6IDRweCAhaW1wb3J0YW50O1xuICAgIH1cbiAgICBcbiAgICAvLyBSZW1vdmUgaWNvblxuICAgIC5tYXQtbWRjLWNoaXAtcmVtb3ZlIHtcbiAgICAgIGZvbnQtc2l6ZTogMTRweCAhaW1wb3J0YW50O1xuICAgICAgd2lkdGg6IDE2cHggIWltcG9ydGFudDtcbiAgICAgIGhlaWdodDogMTZweCAhaW1wb3J0YW50O1xuICAgICAgbWFyZ2luLWxlZnQ6IDRweCAhaW1wb3J0YW50O1xuICAgIH1cbiAgfVxufVxuXG4vLyBDb250ZW5lZG9yIGRlIGNoaXBzIGNvbiBzY3JvbGxcbi5jaGlwcy1jb250YWluZXIge1xuICBtYXgtaGVpZ2h0OiAyMDBweDtcbiAgb3ZlcmZsb3cteTogYXV0bztcbiAgcGFkZGluZzogOHB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjlmYWZiO1xuICBib3JkZXItcmFkaXVzOiA2cHg7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNlNWU3ZWI7XG4gIFxuICAmOjotd2Via2l0LXNjcm9sbGJhciB7XG4gICAgd2lkdGg6IDRweDtcbiAgfVxuICBcbiAgJjo6LXdlYmtpdC1zY3JvbGxiYXItdHJhY2sge1xuICAgIGJhY2tncm91bmQ6ICNmMWYxZjE7XG4gICAgYm9yZGVyLXJhZGl1czogMnB4O1xuICB9XG4gIFxuICAmOjotd2Via2l0LXNjcm9sbGJhci10aHVtYiB7XG4gICAgYmFja2dyb3VuZDogI2MxYzFjMTtcbiAgICBib3JkZXItcmFkaXVzOiAycHg7XG4gIH1cbiAgXG4gICY6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iOmhvdmVyIHtcbiAgICBiYWNrZ3JvdW5kOiAjYThhOGE4O1xuICB9XG59XG5cbi8vIEVzdGlsb3MgcGFyYSBsYXMgbGlzdGFzIGRlIGVsZW1lbnRvcyBhc2lnbmFkb3Ncbi5hY2Nlc3MtaXRlbSB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmOWZhZmI7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNlNWU3ZWI7XG4gIGJvcmRlci1yYWRpdXM6IDZweDtcbiAgcGFkZGluZzogMTJweDtcbiAgbWFyZ2luLWJvdHRvbTogOHB4O1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGJldHdlZW47XG4gIFxuICAuaXRlbS1pbmZvIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZmxleDogMTtcbiAgICBcbiAgICAubWF0LWljb24ge1xuICAgICAgbWFyZ2luLXJpZ2h0OiA4cHg7XG4gICAgICBmb250LXNpemU6IDIwcHg7XG4gICAgICB3aWR0aDogMjBweDtcbiAgICAgIGhlaWdodDogMjBweDtcbiAgICB9XG4gICAgXG4gICAgLml0ZW0tbmFtZSB7XG4gICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgY29sb3I6ICMxMTE4Mjc7XG4gICAgfVxuICB9XG4gIFxuICAucmVtb3ZlLWJ1dHRvbiB7XG4gICAgLm1hdC1pY29uIHtcbiAgICAgIGZvbnQtc2l6ZTogMTZweDtcbiAgICAgIHdpZHRoOiAxNnB4O1xuICAgICAgaGVpZ2h0OiAxNnB4O1xuICAgIH1cbiAgfVxufVxuXG4vLyBFc3RhZG8gdmFjw4PCrW9cbi5lbXB0eS1zdGF0ZSB7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgcGFkZGluZzogMzJweCAxNnB4O1xuICBjb2xvcjogIzZiNzI4MDtcbiAgXG4gIC5tYXQtaWNvbiB7XG4gICAgZm9udC1zaXplOiA0OHB4O1xuICAgIHdpZHRoOiA0OHB4O1xuICAgIGhlaWdodDogNDhweDtcbiAgICBtYXJnaW4tYm90dG9tOiA4cHg7XG4gICAgY29sb3I6ICNkMWQ1ZGI7XG4gIH1cbiAgXG4gIHAge1xuICAgIG1hcmdpbjogMDtcbiAgICBmb250LXNpemU6IDE0cHg7XG4gIH1cbn1cblxuLy8gSW5mb3JtYWNpw4PCs24gZGVsIHVzdWFyaW9cbi51c2VyLWluZm8ge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZWZmNmZmO1xuICBib3JkZXI6IDFweCBzb2xpZCAjZGJlYWZlO1xuICBib3JkZXItcmFkaXVzOiA2cHg7XG4gIHBhZGRpbmc6IDE2cHg7XG4gIG1hcmdpbi1ib3R0b206IDI0cHg7XG4gIFxuICBoMyB7XG4gICAgY29sb3I6ICMxZTQwYWY7XG4gICAgZm9udC1zaXplOiAxNHB4O1xuICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgbWFyZ2luOiAwIDAgOHB4IDA7XG4gIH1cbiAgXG4gIC5pbmZvLWdyaWQge1xuICAgIGRpc3BsYXk6IGdyaWQ7XG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMiwgMWZyKTtcbiAgICBnYXA6IDE2cHg7XG4gICAgZm9udC1zaXplOiAxNHB4O1xuICAgIFxuICAgIC5pbmZvLWl0ZW0ge1xuICAgICAgLmxhYmVsIHtcbiAgICAgICAgY29sb3I6ICMxZDRlZDg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICB9XG4gICAgICBcbiAgICAgIC52YWx1ZSB7XG4gICAgICAgIG1hcmdpbi1sZWZ0OiA4cHg7XG4gICAgICAgIGNvbG9yOiAjMWUzYThhO1xuICAgICAgICBcbiAgICAgICAgJi5tb25vIHtcbiAgICAgICAgICBmb250LWZhbWlseTogJ0NvdXJpZXIgTmV3JywgbW9ub3NwYWNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
  });
}

/***/ }),

/***/ 68600:
/*!*********************************************************************************************!*\
  !*** ./src/app/pages/configuracion/usuarios/user-edit-dialog/user-edit-dialog.component.ts ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UserEditDialogComponent: () => (/* binding */ UserEditDialogComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ 28849);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/dialog */ 17401);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/snack-bar */ 49409);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/form-field */ 51333);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/input */ 10026);
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/select */ 96355);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/progress-spinner */ 33910);
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/tooltip */ 60702);
/* harmony import */ var _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/checkbox */ 56658);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _core_services_user_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../core/services/user.service */ 63934);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/core */ 55309);



























function UserEditDialogComponent_div_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "div", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "span", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    let tmp_0_0;
    let tmp_1_0;
    let tmp_2_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngClass", ((tmp_0_0 = (tmp_0_0 = ctx_r0.userForm.get("Enabled")) == null ? null : tmp_0_0.value) !== null && tmp_0_0 !== undefined ? tmp_0_0 : "1") === "1" ? "bg-green-500" : "bg-red-500");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngClass", ((tmp_1_0 = (tmp_1_0 = ctx_r0.userForm.get("Enabled")) == null ? null : tmp_1_0.value) !== null && tmp_1_0 !== undefined ? tmp_1_0 : "1") === "1" ? "text-green-700" : "text-red-700");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ((tmp_2_0 = (tmp_2_0 = ctx_r0.userForm.get("Enabled")) == null ? null : tmp_2_0.value) !== null && tmp_2_0 !== undefined ? tmp_2_0 : "1") === "1" ? "ACTIVO" : "INACTIVO", " ");
  }
}
function UserEditDialogComponent_mat_error_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " El nombre es requerido ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function UserEditDialogComponent_mat_error_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " El nombre debe tener al menos 3 caracteres ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function UserEditDialogComponent_mat_error_19_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " El nombre no puede exceder 100 caracteres ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function UserEditDialogComponent_mat_error_26_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " El nombre de usuario es requerido ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function UserEditDialogComponent_mat_error_27_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " El nombre de usuario debe tener al menos 3 caracteres ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function UserEditDialogComponent_mat_error_28_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Solo se permiten letras, n\u00FAmeros y guiones bajos ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function UserEditDialogComponent_mat_error_35_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " El correo electr\u00F3nico es requerido ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function UserEditDialogComponent_mat_error_36_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Ingrese un correo electr\u00F3nico v\u00E1lido ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function UserEditDialogComponent_mat_option_41_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-option", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const role_r21 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("value", role_r21.Id);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", role_r21.Name, " ");
  }
}
function UserEditDialogComponent_mat_error_44_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " El rol es requerido ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function UserEditDialogComponent_mat_option_49_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-option", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const agency_r22 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("value", agency_r22.Id);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", agency_r22.Name, " ");
  }
}
function UserEditDialogComponent_mat_error_52_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " La agencia es requerida ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function UserEditDialogComponent_div_53_div_19_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 40)(1, "div", 26)(2, "mat-icon", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "warning");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "span", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5, "Usuario Deshabilitado");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "p", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](7, " Este usuario no podr\u00E1 iniciar sesi\u00F3n en el sistema hasta que sea habilitado nuevamente. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
}
function UserEditDialogComponent_div_53_Template(rf, ctx) {
  if (rf & 1) {
    const _r25 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 30)(1, "label", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "Estado del Usuario");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "div", 32)(4, "button", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function UserEditDialogComponent_div_53_Template_button_click_4_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r25);
      const ctx_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r24.toggleUserStatus());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "div", 34)(10, "mat-checkbox", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("change", function UserEditDialogComponent_div_53_Template_mat_checkbox_change_10_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r25);
      const ctx_r26 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r26.onStatusChange($event.checked));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "span", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12, "Usuario Activo");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](13, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](14, "div", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](15, "span", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](16);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](17, "p", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](19, UserEditDialogComponent_div_53_div_19_Template, 8, 0, "div", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    let tmp_0_0;
    let tmp_1_0;
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    let tmp_5_0;
    let tmp_6_0;
    let tmp_7_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("color", ((tmp_0_0 = ctx_r13.userForm.get("Enabled")) == null ? null : tmp_0_0.value) === "1" ? "warn" : "primary");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](((tmp_1_0 = ctx_r13.userForm.get("Enabled")) == null ? null : tmp_1_0.value) === "1" ? "block" : "check_circle");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](((tmp_2_0 = ctx_r13.userForm.get("Enabled")) == null ? null : tmp_2_0.value) === "1" ? "Deshabilitar Usuario" : "Habilitar Usuario");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("checked", ((tmp_3_0 = ctx_r13.userForm.get("Enabled")) == null ? null : tmp_3_0.value) === "1");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngClass", ((tmp_4_0 = ctx_r13.userForm.get("Enabled")) == null ? null : tmp_4_0.value) === "1" ? "bg-green-500" : "bg-red-500");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ((tmp_5_0 = ctx_r13.userForm.get("Enabled")) == null ? null : tmp_5_0.value) === "1" ? "Activo" : "Inactivo", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ((tmp_6_0 = ctx_r13.userForm.get("Enabled")) == null ? null : tmp_6_0.value) === "1" ? "El usuario puede acceder al sistema" : "El usuario no puede acceder al sistema", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ((tmp_7_0 = ctx_r13.userForm.get("Enabled")) == null ? null : tmp_7_0.value) === "0");
  }
}
function UserEditDialogComponent_mat_error_64_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " La contrase\u00F1a es requerida ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function UserEditDialogComponent_mat_error_65_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " La contrase\u00F1a debe tener al menos 6 caracteres ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function UserEditDialogComponent_mat_error_75_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " La confirmaci\u00F3n de contrase\u00F1a es requerida ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function UserEditDialogComponent_div_76_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Las contrase\u00F1as no coinciden ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function UserEditDialogComponent_div_77_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 45)(1, "h3", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "Informaci\u00F3n del Sistema");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "div", 47)(4, "div", 48)(5, "div")(6, "span", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](7, "ID:");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "span", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "div")(11, "span", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12, "Fecha Registro:");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](13, "span", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](15, "div", 48)(16, "div")(17, "span", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](18, "\u00DAltimo Usuario:");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](19, "span", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](20);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](21, "div")(22, "span", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](23, "\u00DAltima Actualizaci\u00F3n:");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](24, "span", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](25);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()();
  }
  if (rf & 2) {
    const ctx_r18 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r18.data.user.Id);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r18.data.user.RegistrationDate || "N/A");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r18.data.user.LastUserUpdateName || "N/A");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r18.data.user.UpdateDate || "N/A");
  }
}
function UserEditDialogComponent_mat_spinner_82_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "mat-spinner", 52);
  }
}
function UserEditDialogComponent_mat_icon_83_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r20 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r20.data.mode === "edit" ? "save" : "add");
  }
}
class UserEditDialogComponent {
  constructor(fb, userService, dialogRef, data, snackBar) {
    this.fb = fb;
    this.userService = userService;
    this.dialogRef = dialogRef;
    this.data = data;
    this.snackBar = snackBar;
    this.loading = false;
    this.showPassword = false;
    this.showConfirmPassword = false;
    this.roles = [];
    this.agencies = [];
  }
  ngOnInit() {
    this.initializeForm();
    this.loadRoles();
    this.loadAgencies();
    this.populateForm();
  }
  initializeForm() {
    this.userForm = this.fb.group({
      Name: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.minLength(3), _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.maxLength(100)]],
      User: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.minLength(3), _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.maxLength(50), _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
      Mail: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.email, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.maxLength(100)]],
      Pass: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.minLength(6), _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.maxLength(100)]],
      ConfirmPassword: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required]],
      IdUserRol: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required],
      DefaultAgency: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required],
      Enabled: ['1'] // Por defecto activo
    }, {
      validators: this.passwordMatchValidator()
    });
    // En modo edición, la contraseña no es requerida
    if (this.data.mode === 'edit') {
      this.userForm.get('Pass')?.setValidators([_angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.minLength(6), _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.maxLength(100)]);
      this.userForm.get('ConfirmPassword')?.setValidators([]);
    }
  }
  passwordMatchValidator() {
    return control => {
      const password = control.get('Pass');
      const confirmPassword = control.get('ConfirmPassword');
      if (password && confirmPassword && password.value !== confirmPassword.value) {
        return {
          passwordMismatch: true
        };
      }
      return null;
    };
  }
  populateForm() {
    if (this.data.user && this.data.user.Id) {
      this.userForm.patchValue({
        Name: this.data.user.Name,
        User: this.data.user.User,
        Mail: this.data.user.Mail,
        IdUserRol: this.data.user.IdUserRol,
        DefaultAgency: this.data.user.DefaultAgency,
        Enabled: this.data.user.Enabled || '1'
      });
      // Limpiar campos de contraseña en edición
      this.userForm.get('Pass')?.setValue('');
      this.userForm.get('ConfirmPassword')?.setValue('');
    }
  }
  onSubmit() {
    if (this.userForm.valid) {
      this.loading = true;
      if (this.data.mode === 'create') {
        this.createUser();
      } else {
        this.updateUser();
      }
    }
  }
  createUser() {
    const userData = {
      Name: this.userForm.value.Name,
      User: this.userForm.value.User,
      Mail: this.userForm.value.Mail,
      Pass: this.userForm.value.Pass,
      IdUserRol: this.userForm.value.IdUserRol,
      DefaultAgency: this.userForm.value.DefaultAgency,
      Enabled: '1'
    };
    this.userService.createUser(userData).subscribe({
      next: response => {
        if (response.success) {
          this.snackBar.open('Usuario creado exitosamente', 'Éxito', {
            duration: 2000
          });
          this.dialogRef.close(true);
        } else {
          this.snackBar.open(response.message || 'Error al crear usuario', 'Error', {
            duration: 3000
          });
        }
        this.loading = false;
      },
      error: error => {
        this.snackBar.open('Error al crear usuario', 'Error', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }
  updateUser() {
    const userData = {
      Id: this.data.user.Id,
      Name: this.userForm.value.Name,
      User: this.userForm.value.User,
      Mail: this.userForm.value.Mail,
      IdUserRol: this.userForm.value.IdUserRol,
      DefaultAgency: this.userForm.value.DefaultAgency,
      Enabled: this.userForm.value.Enabled
    };
    // Solo incluir contraseña si se proporcionó una nueva
    if (this.userForm.value.Pass) {
      userData.Pass = this.userForm.value.Pass;
    }
    this.userService.updateUser(this.data.user.Id, userData).subscribe({
      next: response => {
        if (response.success) {
          this.snackBar.open('Usuario actualizado exitosamente', 'Éxito', {
            duration: 2000
          });
          this.dialogRef.close(true);
        } else {
          this.snackBar.open(response.message || 'Error al actualizar usuario', 'Error', {
            duration: 3000
          });
        }
        this.loading = false;
      },
      error: error => {
        this.snackBar.open('Error al actualizar usuario', 'Error', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }
  onCancel() {
    this.dialogRef.close();
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  /**
   * Manejar cambio de estado del usuario
   */
  onStatusChange(checked) {
    const enabledValue = checked ? '1' : '0';
    const previousValue = this.userForm.get('Enabled')?.value;
    // Solo mostrar mensaje si realmente cambió el valor
    if (previousValue !== enabledValue) {
      this.userForm.patchValue({
        Enabled: enabledValue
      });
      // Mostrar mensaje informativo
      const statusMessage = checked ? 'Usuario habilitado - Podrá acceder al sistema' : 'Usuario deshabilitado - No podrá acceder al sistema';
      this.snackBar.open(statusMessage, 'Info', {
        duration: 3000,
        panelClass: checked ? 'success-snackbar' : 'warning-snackbar'
      });
    }
  }
  /**
   * Cambiar estado del usuario con confirmación
   */
  toggleUserStatus() {
    const currentStatus = this.userForm.get('Enabled')?.value === '1';
    const newStatus = !currentStatus;
    const actionText = newStatus ? 'habilitar' : 'deshabilitar';
    // Confirmar la acción
    if (confirm(`¿Estás seguro de que quieres ${actionText} al usuario "${this.userForm.get('Name')?.value}"?`)) {
      this.onStatusChange(newStatus);
    }
  }
  loadRoles() {
    this.userService.getUserRoles().subscribe({
      next: response => {
        if (response.success) {
          this.roles = response.data.roles || response.data;
        }
      },
      error: error => {
        // Error loading roles
      }
    });
  }
  loadAgencies() {
    this.userService.getAgencies().subscribe({
      next: response => {
        if (response.success) {
          this.agencies = response.data.agencies || response.data;
        }
      },
      error: error => {
        // Error loading agencies
      }
    });
  }
  static #_ = this.ɵfac = function UserEditDialogComponent_Factory(t) {
    return new (t || UserEditDialogComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_core_services_user_service__WEBPACK_IMPORTED_MODULE_0__.UserService), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_3__.MatDialogRef), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_3__.MAT_DIALOG_DATA), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_4__.MatSnackBar));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: UserEditDialogComponent,
    selectors: [["app-user-edit-dialog"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵStandaloneFeature"]],
    decls: 85,
    vars: 37,
    consts: [[1, "p-0"], [1, "flex", "items-center", "justify-between", "p-6", "border-b", "border-gray-200"], [1, "flex", "items-center", "space-x-3"], [1, "text-xl", "font-semibold", "text-gray-900"], ["class", "flex items-center space-x-2", 4, "ngIf"], ["mat-icon-button", "", "matTooltip", "Cerrar", 3, "click"], [1, "space-y-6", "p-6", 3, "formGroup", "ngSubmit"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-6"], ["appearance", "outline", 1, "w-full"], ["matInput", "", "formControlName", "Name", "placeholder", "Ej: Juan Carlos Limonero", "maxlength", "100"], [4, "ngIf"], ["matInput", "", "formControlName", "User", "placeholder", "Ej: jclimonero", "maxlength", "50"], ["matInput", "", "formControlName", "Mail", "type", "email", "placeholder", "Ej: juan@empresa.com", "maxlength", "100"], ["formControlName", "IdUserRol"], [3, "value", 4, "ngFor", "ngForOf"], ["formControlName", "DefaultAgency"], ["class", "w-full", 4, "ngIf"], ["matInput", "", "formControlName", "Pass", "placeholder", "Ingrese la contrase\u00F1a", "maxlength", "100", 3, "type"], ["type", "button", "mat-icon-button", "", "matSuffix", "", 3, "click"], ["matInput", "", "formControlName", "ConfirmPassword", "placeholder", "Confirme la contrase\u00F1a", "maxlength", "100", 3, "type"], ["class", "text-red-600 text-sm", 4, "ngIf"], ["class", "bg-gray-50 p-4 rounded-lg mt-6", 4, "ngIf"], [1, "flex", "justify-end", "space-x-3", "pt-6", "mt-6", "border-t"], ["type", "button", "mat-button", "", 3, "disabled", "click"], ["type", "submit", "mat-raised-button", "", "color", "primary", 3, "disabled"], ["diameter", "20", "class", "mr-2", 4, "ngIf"], [1, "flex", "items-center", "space-x-2"], [1, "w-3", "h-3", "rounded-full", 3, "ngClass"], [1, "text-sm", "font-medium", 3, "ngClass"], [3, "value"], [1, "w-full"], [1, "block", "text-sm", "font-medium", "text-gray-700", "mb-2"], [1, "mb-3"], ["type", "button", "mat-stroked-button", "", 1, "flex", "items-center", "space-x-2", 3, "color", "click"], [1, "flex", "items-center", "space-x-4"], ["formControlName", "Enabled", 1, "flex", "items-center", 3, "checked", "change"], [1, "ml-2", "text-sm", "text-gray-700"], [1, "text-sm", "text-gray-600"], [1, "text-xs", "text-gray-500", "mt-1"], ["class", "mt-3 p-3 bg-red-50 border border-red-200 rounded-md", 4, "ngIf"], [1, "mt-3", "p-3", "bg-red-50", "border", "border-red-200", "rounded-md"], [1, "text-red-500", "text-sm"], [1, "text-sm", "font-medium", "text-red-700"], [1, "text-xs", "text-red-600", "mt-1"], [1, "text-red-600", "text-sm"], [1, "bg-gray-50", "p-4", "rounded-lg", "mt-6"], [1, "text-sm", "font-medium", "text-gray-700", "mb-3"], [1, "grid", "grid-cols-2", "gap-6", "text-sm"], [1, "space-y-2"], [1, "text-gray-500", "font-medium"], [1, "ml-2", "font-mono"], [1, "ml-2"], ["diameter", "20", 1, "mr-2"]],
    template: function UserEditDialogComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h2", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](5, UserEditDialogComponent_div_5_Template, 4, 3, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "button", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function UserEditDialogComponent_Template_button_click_6_listener() {
          return ctx.onCancel();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8, "close");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "form", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngSubmit", function UserEditDialogComponent_Template_form_ngSubmit_9_listener() {
          return ctx.onSubmit();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "div", 7)(11, "mat-form-field", 8)(12, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](13, "Nombre Completo");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](14, "input", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](15, "mat-hint");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](16, "Nombre completo del usuario (m\u00E1ximo 100 caracteres)");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](17, UserEditDialogComponent_mat_error_17_Template, 2, 0, "mat-error", 10)(18, UserEditDialogComponent_mat_error_18_Template, 2, 0, "mat-error", 10)(19, UserEditDialogComponent_mat_error_19_Template, 2, 0, "mat-error", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](20, "mat-form-field", 8)(21, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](22, "Nombre de Usuario");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](23, "input", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](24, "mat-hint");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](25, "Nombre de usuario para acceso al sistema (m\u00E1ximo 50 caracteres)");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](26, UserEditDialogComponent_mat_error_26_Template, 2, 0, "mat-error", 10)(27, UserEditDialogComponent_mat_error_27_Template, 2, 0, "mat-error", 10)(28, UserEditDialogComponent_mat_error_28_Template, 2, 0, "mat-error", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](29, "mat-form-field", 8)(30, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](31, "Correo Electr\u00F3nico");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](32, "input", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](33, "mat-hint");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](34, "Correo electr\u00F3nico del usuario");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](35, UserEditDialogComponent_mat_error_35_Template, 2, 0, "mat-error", 10)(36, UserEditDialogComponent_mat_error_36_Template, 2, 0, "mat-error", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](37, "mat-form-field", 8)(38, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](39, "Rol de Usuario");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](40, "mat-select", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](41, UserEditDialogComponent_mat_option_41_Template, 2, 2, "mat-option", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](42, "mat-hint");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](43, "Rol que determina los permisos del usuario");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](44, UserEditDialogComponent_mat_error_44_Template, 2, 0, "mat-error", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](45, "mat-form-field", 8)(46, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](47, "Agencia Predeterminada");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](48, "mat-select", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](49, UserEditDialogComponent_mat_option_49_Template, 2, 2, "mat-option", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](50, "mat-hint");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](51, "Agencia predeterminada del usuario");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](52, UserEditDialogComponent_mat_error_52_Template, 2, 0, "mat-error", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](53, UserEditDialogComponent_div_53_Template, 20, 8, "div", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](54, "div", 7)(55, "mat-form-field", 8)(56, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](57);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](58, "input", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](59, "button", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function UserEditDialogComponent_Template_button_click_59_listener() {
          return ctx.togglePasswordVisibility();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](60, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](61);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](62, "mat-hint");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](63);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](64, UserEditDialogComponent_mat_error_64_Template, 2, 0, "mat-error", 10)(65, UserEditDialogComponent_mat_error_65_Template, 2, 0, "mat-error", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](66, "mat-form-field", 8)(67, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](68);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](69, "input", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](70, "button", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function UserEditDialogComponent_Template_button_click_70_listener() {
          return ctx.toggleConfirmPasswordVisibility();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](71, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](72);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](73, "mat-hint");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](74, "Confirme la contrase\u00F1a ingresada");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](75, UserEditDialogComponent_mat_error_75_Template, 2, 0, "mat-error", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](76, UserEditDialogComponent_div_76_Template, 2, 0, "div", 20)(77, UserEditDialogComponent_div_77_Template, 26, 4, "div", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](78, "div", 22)(79, "button", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function UserEditDialogComponent_Template_button_click_79_listener() {
          return ctx.onCancel();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](80, " Cancelar ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](81, "button", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](82, UserEditDialogComponent_mat_spinner_82_Template, 1, 0, "mat-spinner", 25)(83, UserEditDialogComponent_mat_icon_83_Template, 2, 1, "mat-icon", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](84);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
      }
      if (rf & 2) {
        let tmp_3_0;
        let tmp_4_0;
        let tmp_5_0;
        let tmp_6_0;
        let tmp_7_0;
        let tmp_8_0;
        let tmp_9_0;
        let tmp_10_0;
        let tmp_12_0;
        let tmp_14_0;
        let tmp_22_0;
        let tmp_23_0;
        let tmp_29_0;
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx.data.mode === "edit" ? "Editar Usuario" : "Nuevo Usuario", " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.data.mode === "edit");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("formGroup", ctx.userForm);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", (tmp_3_0 = ctx.userForm.get("Name")) == null ? null : tmp_3_0.hasError("required"));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", (tmp_4_0 = ctx.userForm.get("Name")) == null ? null : tmp_4_0.hasError("minlength"));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", (tmp_5_0 = ctx.userForm.get("Name")) == null ? null : tmp_5_0.hasError("maxlength"));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", (tmp_6_0 = ctx.userForm.get("User")) == null ? null : tmp_6_0.hasError("required"));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", (tmp_7_0 = ctx.userForm.get("User")) == null ? null : tmp_7_0.hasError("minlength"));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", (tmp_8_0 = ctx.userForm.get("User")) == null ? null : tmp_8_0.hasError("pattern"));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", (tmp_9_0 = ctx.userForm.get("Mail")) == null ? null : tmp_9_0.hasError("required"));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", (tmp_10_0 = ctx.userForm.get("Mail")) == null ? null : tmp_10_0.hasError("email"));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.roles);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", (tmp_12_0 = ctx.userForm.get("IdUserRol")) == null ? null : tmp_12_0.hasError("required"));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.agencies);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", (tmp_14_0 = ctx.userForm.get("DefaultAgency")) == null ? null : tmp_14_0.hasError("required"));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.data.mode === "edit");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.data.mode === "edit" ? "Nueva Contrase\u00F1a (opcional)" : "Contrase\u00F1a");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("type", ctx.showPassword ? "text" : "password");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵattribute"]("aria-label", "Hide password")("aria-pressed", ctx.showPassword);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.showPassword ? "visibility_off" : "visibility");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.data.mode === "edit" ? "Deje en blanco para mantener la contrase\u00F1a actual" : "M\u00EDnimo 6 caracteres");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ((tmp_22_0 = ctx.userForm.get("Pass")) == null ? null : tmp_22_0.hasError("required")) && ctx.data.mode === "create");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", (tmp_23_0 = ctx.userForm.get("Pass")) == null ? null : tmp_23_0.hasError("minlength"));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.data.mode === "edit" ? "Confirmar Nueva Contrase\u00F1a" : "Confirmar Contrase\u00F1a");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("type", ctx.showConfirmPassword ? "text" : "password");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵattribute"]("aria-label", "Hide password")("aria-pressed", ctx.showConfirmPassword);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.showConfirmPassword ? "visibility_off" : "visibility");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ((tmp_29_0 = ctx.userForm.get("ConfirmPassword")) == null ? null : tmp_29_0.hasError("required")) && ctx.data.mode === "create");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.userForm.hasError("passwordMismatch"));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.data.mode === "edit" && ctx.data.user.Id);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", ctx.userForm.invalid || ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx.data.mode === "edit" ? "Guardar Cambios" : "Crear Usuario", " ");
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_5__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_5__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_5__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.MaxLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormControlName, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_3__.MatDialogModule, _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_4__.MatSnackBarModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_6__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_6__.MatButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_6__.MatIconButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_7__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_7__.MatIcon, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__.MatFormFieldModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__.MatLabel, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__.MatHint, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__.MatError, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__.MatSuffix, _angular_material_input__WEBPACK_IMPORTED_MODULE_9__.MatInputModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_9__.MatInput, _angular_material_select__WEBPACK_IMPORTED_MODULE_10__.MatSelectModule, _angular_material_select__WEBPACK_IMPORTED_MODULE_10__.MatSelect, _angular_material_core__WEBPACK_IMPORTED_MODULE_11__.MatOption, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_12__.MatProgressSpinnerModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_12__.MatProgressSpinner, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_13__.MatTooltipModule, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_13__.MatTooltip, _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_14__.MatCheckboxModule, _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_14__.MatCheckbox],
    styles: [".user-edit-dialog[_ngcontent-%COMP%]   .mat-mdc-dialog-content[_ngcontent-%COMP%] {\n  max-height: 70vh;\n  overflow-y: auto;\n}\n\n.password-field[_ngcontent-%COMP%]   .mat-mdc-form-field-suffix[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  margin-right: -8px;\n}\n\n.system-info[_ngcontent-%COMP%] {\n  background-color: #f9fafb;\n  border-radius: 8px;\n  padding: 16px;\n}\n.system-info[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  color: #374151;\n  font-size: 14px;\n  font-weight: 500;\n  margin-bottom: 8px;\n}\n.system-info[_ngcontent-%COMP%]   .info-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 16px;\n}\n.system-info[_ngcontent-%COMP%]   .info-grid[_ngcontent-%COMP%]   .info-item[_ngcontent-%COMP%] {\n  font-size: 14px;\n}\n.system-info[_ngcontent-%COMP%]   .info-grid[_ngcontent-%COMP%]   .info-item[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {\n  color: #6b7280;\n  font-weight: 400;\n}\n.system-info[_ngcontent-%COMP%]   .info-grid[_ngcontent-%COMP%]   .info-item[_ngcontent-%COMP%]   .value[_ngcontent-%COMP%] {\n  color: #111827;\n  font-weight: 500;\n  margin-left: 8px;\n}\n.system-info[_ngcontent-%COMP%]   .info-grid[_ngcontent-%COMP%]   .info-item[_ngcontent-%COMP%]   .value.mono[_ngcontent-%COMP%] {\n  font-family: \"Monaco\", \"Menlo\", \"Ubuntu Mono\", monospace;\n  font-size: 13px;\n}\n\n.action-buttons[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  gap: 12px;\n  padding-top: 16px;\n  border-top: 1px solid #e5e7eb;\n}\n.action-buttons[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  min-width: 120px;\n}\n\n.form-container[_ngcontent-%COMP%]   .form-row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 16px;\n}\n@media (max-width: 768px) {\n  .form-container[_ngcontent-%COMP%]   .form-row[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.form-container[_ngcontent-%COMP%]   .form-field[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.validation-error[_ngcontent-%COMP%] {\n  color: #dc2626;\n  font-size: 12px;\n  margin-top: 4px;\n  margin-left: 16px;\n}\n\n.mat-mdc-form-field-hint[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: #6b7280;\n}\n\n.mat-mdc-form-field-error[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: #dc2626;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvY29uZmlndXJhY2lvbi91c3Vhcmlvcy91c2VyLWVkaXQtZGlhbG9nL3VzZXItZWRpdC1kaWFsb2cuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUU7RUFDRSxnQkFBQTtFQUNBLGdCQUFBO0FBREo7O0FBUUk7RUFDRSxrQkFBQTtBQUxOOztBQVdBO0VBQ0UseUJBQUE7RUFDQSxrQkFBQTtFQUNBLGFBQUE7QUFSRjtBQVVFO0VBQ0UsY0FBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtFQUNBLGtCQUFBO0FBUko7QUFXRTtFQUNFLGFBQUE7RUFDQSw4QkFBQTtFQUNBLFNBQUE7QUFUSjtBQVdJO0VBQ0UsZUFBQTtBQVROO0FBV007RUFDRSxjQUFBO0VBQ0EsZ0JBQUE7QUFUUjtBQVlNO0VBQ0UsY0FBQTtFQUNBLGdCQUFBO0VBQ0EsZ0JBQUE7QUFWUjtBQVlRO0VBQ0Usd0RBQUE7RUFDQSxlQUFBO0FBVlY7O0FBa0JBO0VBQ0UsYUFBQTtFQUNBLHlCQUFBO0VBQ0EsU0FBQTtFQUNBLGlCQUFBO0VBQ0EsNkJBQUE7QUFmRjtBQWlCRTtFQUNFLGdCQUFBO0FBZko7O0FBcUJFO0VBQ0UsYUFBQTtFQUNBLDhCQUFBO0VBQ0EsU0FBQTtBQWxCSjtBQW9CSTtFQUxGO0lBTUksMEJBQUE7RUFqQko7QUFDRjtBQW9CRTtFQUNFLFdBQUE7QUFsQko7O0FBdUJBO0VBQ0UsY0FBQTtFQUNBLGVBQUE7RUFDQSxlQUFBO0VBQ0EsaUJBQUE7QUFwQkY7O0FBd0JBO0VBQ0UsZUFBQTtFQUNBLGNBQUE7QUFyQkY7O0FBeUJBO0VBQ0UsZUFBQTtFQUNBLGNBQUE7QUF0QkYiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBFc3RpbG9zIGVzcGVjw4PCrWZpY29zIHBhcmEgZWwgZGnDg8KhbG9nbyBkZSBlZGljacODwrNuIGRlIHVzdWFyaW9zXG4udXNlci1lZGl0LWRpYWxvZyB7XG4gIC5tYXQtbWRjLWRpYWxvZy1jb250ZW50IHtcbiAgICBtYXgtaGVpZ2h0OiA3MHZoO1xuICAgIG92ZXJmbG93LXk6IGF1dG87XG4gIH1cbn1cblxuLy8gRXN0aWxvcyBwYXJhIGxvcyBjYW1wb3MgZGUgY29udHJhc2XDg8KxYVxuLnBhc3N3b3JkLWZpZWxkIHtcbiAgLm1hdC1tZGMtZm9ybS1maWVsZC1zdWZmaXgge1xuICAgIGJ1dHRvbiB7XG4gICAgICBtYXJnaW4tcmlnaHQ6IC04cHg7XG4gICAgfVxuICB9XG59XG5cbi8vIEVzdGlsb3MgcGFyYSBsYSBpbmZvcm1hY2nDg8KzbiBkZWwgc2lzdGVtYVxuLnN5c3RlbS1pbmZvIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y5ZmFmYjtcbiAgYm9yZGVyLXJhZGl1czogOHB4O1xuICBwYWRkaW5nOiAxNnB4O1xuICBcbiAgaDMge1xuICAgIGNvbG9yOiAjMzc0MTUxO1xuICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICBmb250LXdlaWdodDogNTAwO1xuICAgIG1hcmdpbi1ib3R0b206IDhweDtcbiAgfVxuICBcbiAgLmluZm8tZ3JpZCB7XG4gICAgZGlzcGxheTogZ3JpZDtcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAxZnI7XG4gICAgZ2FwOiAxNnB4O1xuICAgIFxuICAgIC5pbmZvLWl0ZW0ge1xuICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgXG4gICAgICAubGFiZWwge1xuICAgICAgICBjb2xvcjogIzZiNzI4MDtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDQwMDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLnZhbHVlIHtcbiAgICAgICAgY29sb3I6ICMxMTE4Mjc7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgIG1hcmdpbi1sZWZ0OiA4cHg7XG4gICAgICAgIFxuICAgICAgICAmLm1vbm8ge1xuICAgICAgICAgIGZvbnQtZmFtaWx5OiAnTW9uYWNvJywgJ01lbmxvJywgJ1VidW50dSBNb25vJywgbW9ub3NwYWNlO1xuICAgICAgICAgIGZvbnQtc2l6ZTogMTNweDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vLyBFc3RpbG9zIHBhcmEgbG9zIGJvdG9uZXMgZGUgYWNjacODwrNuXG4uYWN0aW9uLWJ1dHRvbnMge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xuICBnYXA6IDEycHg7XG4gIHBhZGRpbmctdG9wOiAxNnB4O1xuICBib3JkZXItdG9wOiAxcHggc29saWQgI2U1ZTdlYjtcbiAgXG4gIGJ1dHRvbiB7XG4gICAgbWluLXdpZHRoOiAxMjBweDtcbiAgfVxufVxuXG4vLyBFc3RpbG9zIHBhcmEgZWwgZm9ybXVsYXJpb1xuLmZvcm0tY29udGFpbmVyIHtcbiAgLmZvcm0tcm93IHtcbiAgICBkaXNwbGF5OiBncmlkO1xuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDFmcjtcbiAgICBnYXA6IDE2cHg7XG4gICAgXG4gICAgQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmcjtcbiAgICB9XG4gIH1cbiAgXG4gIC5mb3JtLWZpZWxkIHtcbiAgICB3aWR0aDogMTAwJTtcbiAgfVxufVxuXG4vLyBFc3RpbG9zIHBhcmEgbG9zIGVycm9yZXMgZGUgdmFsaWRhY2nDg8KzblxuLnZhbGlkYXRpb24tZXJyb3Ige1xuICBjb2xvcjogI2RjMjYyNjtcbiAgZm9udC1zaXplOiAxMnB4O1xuICBtYXJnaW4tdG9wOiA0cHg7XG4gIG1hcmdpbi1sZWZ0OiAxNnB4O1xufVxuXG4vLyBFc3RpbG9zIHBhcmEgbG9zIGhpbnRzXG4ubWF0LW1kYy1mb3JtLWZpZWxkLWhpbnQge1xuICBmb250LXNpemU6IDEycHg7XG4gIGNvbG9yOiAjNmI3MjgwO1xufVxuXG4vLyBFc3RpbG9zIHBhcmEgbG9zIGVycm9yZXNcbi5tYXQtbWRjLWZvcm0tZmllbGQtZXJyb3Ige1xuICBmb250LXNpemU6IDEycHg7XG4gIGNvbG9yOiAjZGMyNjI2O1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }),

/***/ 99750:
/*!********************************************************************!*\
  !*** ./src/app/pages/configuracion/usuarios/usuarios.component.ts ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UsuariosComponent: () => (/* binding */ UsuariosComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/forms */ 28849);
/* harmony import */ var _angular_material_table__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/table */ 46798);
/* harmony import */ var _angular_material_paginator__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/paginator */ 39687);
/* harmony import */ var _angular_material_sort__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/sort */ 87963);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/dialog */ 17401);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/snack-bar */ 49409);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/form-field */ 51333);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/input */ 10026);
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/select */ 96355);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/material/progress-spinner */ 33910);
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/material/tooltip */ 60702);
/* harmony import */ var _angular_material_chips__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/material/chips */ 21757);
/* harmony import */ var _user_edit_dialog_user_edit_dialog_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./user-edit-dialog/user-edit-dialog.component */ 68600);
/* harmony import */ var _user_access_dialog_user_access_dialog_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./user-access-dialog/user-access-dialog.component */ 49290);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _core_services_user_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../core/services/user.service */ 63934);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material/core */ 55309);


































function UsuariosComponent_mat_icon_29_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "mat-icon", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "refresh");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function UsuariosComponent_mat_icon_30_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "mat-icon", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "\uD83D\uDD0D");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function UsuariosComponent_mat_option_37_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "mat-option", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const role_r32 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("value", role_r32.Id);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", role_r32.Name, " ");
  }
}
function UsuariosComponent_mat_icon_38_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "mat-icon", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "refresh");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function UsuariosComponent_mat_option_45_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "mat-option", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const agency_r33 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("value", agency_r33.Id);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", agency_r33.Name, " ");
  }
}
function UsuariosComponent_mat_icon_46_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "mat-icon", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "refresh");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function UsuariosComponent_mat_option_53_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "mat-option", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const agency_r34 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("value", agency_r34.Id);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", agency_r34.Name, " ");
  }
}
function UsuariosComponent_mat_icon_54_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "mat-icon", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "refresh");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function UsuariosComponent_mat_icon_65_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "mat-icon", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "refresh");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function UsuariosComponent_div_66_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 51)(1, "div", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](2, "mat-spinner", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "span", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](4, "Cargando cat\u00E1logos...");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
  }
}
function UsuariosComponent_div_67_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 55)(1, "div", 56)(2, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](3, "warning");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "span", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](5, "Algunos cat\u00E1logos no se pudieron cargar. Verifica la conexi\u00F3n.");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
  }
}
function UsuariosComponent_th_71_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "th", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " ID ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function UsuariosComponent_td_72_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "td", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const user_r35 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", user_r35.Id, " ");
  }
}
function UsuariosComponent_th_74_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "th", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Nombre ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function UsuariosComponent_td_75_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "td", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const user_r36 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", user_r36.Name, " ");
  }
}
function UsuariosComponent_th_77_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "th", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Usuario DMS ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function UsuariosComponent_td_78_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "td", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const user_r37 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", user_r37.User, " ");
  }
}
function UsuariosComponent_th_80_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "th", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Email ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function UsuariosComponent_td_81_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "td", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const user_r38 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", user_r38.Mail, " ");
  }
}
function UsuariosComponent_th_83_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "th", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Rol ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function UsuariosComponent_td_84_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "td", 63)(1, "span", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const user_r39 = ctx.$implicit;
    const ctx_r20 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", ctx_r20.getRoleName(user_r39.IdUserRol), " ");
  }
}
function UsuariosComponent_th_86_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "th", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Agencia Predeterminada ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function UsuariosComponent_td_87_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "td", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const user_r40 = ctx.$implicit;
    const ctx_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", user_r40.AgencyName || ctx_r22.getAgencyName(user_r40.DefaultAgency), " ");
  }
}
function UsuariosComponent_th_89_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "th", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Agencias Asignadas ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function UsuariosComponent_td_90_span_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Sin agencias ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function UsuariosComponent_td_90_div_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 70)(1, "div", 71)(2, "mat-icon", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](3, "business");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](6, "div", 73)(7, "div", 74)(8, "div", 75);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](9, "Agencias asignadas:");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](10, "div", 76);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](12, "div", 77);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const user_r41 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate2"]("", user_r41.AssignedAgencyNames.length, " agencia", user_r41.AssignedAgencyNames.length !== 1 ? "s" : "", "");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](user_r41.AssignedAgencyNames.join(", "));
  }
}
function UsuariosComponent_td_90_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "td", 61)(1, "div", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](2, UsuariosComponent_td_90_span_2_Template, 2, 0, "span", 67)(3, UsuariosComponent_td_90_div_3_Template, 13, 3, "div", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const user_r41 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", !user_r41.AssignedAgencyNames || user_r41.AssignedAgencyNames.length === 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", user_r41.AssignedAgencyNames && user_r41.AssignedAgencyNames.length > 0);
  }
}
function UsuariosComponent_th_92_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "th", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Estado ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function UsuariosComponent_td_93_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "td", 61)(1, "div", 66)(2, "div", 78)(3, "mat-icon", 79);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const user_r45 = ctx.$implicit;
    const ctx_r26 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngClass", ctx_r26.getUserStatus(user_r45.Enabled).class);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngClass", ctx_r26.getUserStatus(user_r45.Enabled).icon === "check_circle" ? "text-green-600" : "text-red-600");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", ctx_r26.getUserStatus(user_r45.Enabled).icon, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx_r26.getUserStatus(user_r45.Enabled).text);
  }
}
function UsuariosComponent_th_95_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "th", 80);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Acciones ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function UsuariosComponent_td_96_Template(rf, ctx) {
  if (rf & 1) {
    const _r48 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "td", 81)(1, "div", 82)(2, "button", 83);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function UsuariosComponent_td_96_Template_button_click_2_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r48);
      const user_r46 = restoredCtx.$implicit;
      const ctx_r47 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r47.openEditDialog(user_r46));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "mat-icon", 84);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](4, "edit");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "button", 85);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function UsuariosComponent_td_96_Template_button_click_5_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r48);
      const user_r46 = restoredCtx.$implicit;
      const ctx_r49 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r49.openAccessDialog(user_r46));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](6, "mat-icon", 84);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](7, "security");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](8, "button", 86);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function UsuariosComponent_td_96_Template_button_click_8_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r48);
      const user_r46 = restoredCtx.$implicit;
      const ctx_r50 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r50.deleteUser(user_r46));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](9, "mat-icon", 84);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](10, "delete");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()();
  }
}
function UsuariosComponent_tr_97_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](0, "tr", 87);
  }
}
function UsuariosComponent_tr_98_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](0, "tr", 88);
  }
}
function UsuariosComponent_div_99_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 89);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](1, "mat-spinner", 90);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
const _c0 = () => [10, 25, 50, 100];
class UsuariosComponent {
  constructor(userService, dialog, snackBar) {
    this.userService = userService;
    this.dialog = dialog;
    this.snackBar = snackBar;
    this.users = [];
    this.roles = [];
    this.agencies = [];
    this.dataSource = new _angular_material_table__WEBPACK_IMPORTED_MODULE_4__.MatTableDataSource([]);
    this.displayedColumns = ['Id', 'Name', 'User', 'Mail', 'IdUserRol', 'DefaultAgency', 'AssignedAgencies', 'Status', 'acciones'];
    this.loading = false;
    this.loadingCatalogs = false;
    this.searchTerm = '';
    this.roleFilter = '';
    this.agencyFilter = '';
    this.assignedAgencyFilter = '';
    this.statusFilter = '';
  }
  ngOnInit() {
    this.loadUsers();
    this.loadRoles();
    this.loadAgencies();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // Configurar filtro personalizado
    this.dataSource.filterPredicate = (data, filter) => {
      const searchTerm = filter.toLowerCase();
      return data.Name.toLowerCase().includes(searchTerm) || data.User.toLowerCase().includes(searchTerm) || data.Mail.toLowerCase().includes(searchTerm);
    };
  }
  loadUsers() {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: response => {
        if (response.success) {
          this.users = response.data.users;
          // Obtener agencias asignadas para cada usuario
          this.loadUserAgencies();
        } else {
          this.snackBar.open(response.message || 'Error al cargar usuarios', 'Error', {
            duration: 3000
          });
          this.loading = false;
        }
      },
      error: error => {
        this.snackBar.open('Error al cargar usuarios', 'Error', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }
  loadUserAgencies() {
    let usersProcessed = 0;
    const totalUsers = this.users.length;
    if (totalUsers === 0) {
      this.dataSource.data = this.users;
      this.applyFilter();
      this.loading = false;
      return;
    }
    this.users.forEach((user, index) => {
      this.userService.getUserAgencies(user.Id).subscribe({
        next: response => {
          if (response.success) {
            user.AssignedAgencies = response.data.agencies;
            user.AssignedAgencyNames = response.data.agencies_details.map(agency => agency.AgencyName);
          } else {
            user.AssignedAgencies = [];
            user.AssignedAgencyNames = [];
          }
          usersProcessed++;
          // Cuando se han procesado todos los usuarios, actualizar la tabla
          if (usersProcessed === totalUsers) {
            this.dataSource.data = this.users;
            this.applyFilter();
            this.loading = false;
          }
        },
        error: error => {
          console.warn(`Error al cargar agencias para usuario ${user.Id}:`, error);
          user.AssignedAgencies = [];
          user.AssignedAgencyNames = [];
          usersProcessed++;
          if (usersProcessed === totalUsers) {
            this.dataSource.data = this.users;
            this.applyFilter();
            this.loading = false;
          }
        }
      });
    });
  }
  loadRoles() {
    this.loadingCatalogs = true;
    this.userService.getUserRoles().subscribe({
      next: response => {
        if (response.success) {
          this.roles = response.data.roles;
        } else {
          this.snackBar.open(response.message || 'Error al cargar roles', 'Error', {
            duration: 3000
          });
        }
        this.checkCatalogsLoaded();
      },
      error: error => {
        this.snackBar.open('Error al cargar roles', 'Error', {
          duration: 3000
        });
        this.checkCatalogsLoaded();
      }
    });
  }
  loadAgencies() {
    this.loadingCatalogs = true;
    this.userService.getAgencies().subscribe({
      next: response => {
        if (response.success) {
          this.agencies = response.data.agencies.filter(agency => agency.Enabled === '1');
        } else {
          this.snackBar.open(response.message || 'Error al cargar agencias', 'Error', {
            duration: 3000
          });
        }
        this.checkCatalogsLoaded();
      },
      error: error => {
        this.snackBar.open('Error al cargar agencias', 'Error', {
          duration: 3000
        });
        this.checkCatalogsLoaded();
      }
    });
  }
  checkCatalogsLoaded() {
    // Verificar si todos los catálogos han sido procesados
    const totalCatalogs = 2; // roles y agencias
    const catalogsProcessed = (this.roles.length >= 0 ? 1 : 0) + (this.agencies.length >= 0 ? 1 : 0);
    if (catalogsProcessed >= totalCatalogs) {
      this.loadingCatalogs = false;
      console.log('✅ Catálogos procesados - Roles:', this.roles.length, 'Agencias:', this.agencies.length);
      // Si no hay catálogos, mostrar mensaje de error
      if (this.roles.length === 0 && this.agencies.length === 0) {
        this.snackBar.open('No se pudieron cargar los catálogos. Verifica la conexión con el backend.', 'Error', {
          duration: 5000
        });
      }
    }
  }
  applyFilter() {
    const filterValue = this.searchTerm.trim();
    // Aplicar filtros
    let filteredData = this.users;
    // Filtro de rol
    if (this.roleFilter !== '') {
      filteredData = filteredData.filter(user => user.IdUserRol === this.roleFilter);
    }
    // Filtro de agencia predeterminada
    if (this.agencyFilter !== '') {
      filteredData = filteredData.filter(user => user.DefaultAgency === this.agencyFilter);
    }
    // Filtro de agencias asignadas
    if (this.assignedAgencyFilter !== '') {
      filteredData = filteredData.filter(user => user.AssignedAgencies && Array.isArray(user.AssignedAgencies) && user.AssignedAgencies.includes(this.assignedAgencyFilter));
    }
    // Filtro de estado
    if (this.statusFilter !== '') {
      filteredData = filteredData.filter(user => user.Enabled === this.statusFilter);
    }
    // Filtro de búsqueda de texto
    if (filterValue !== '') {
      filteredData = filteredData.filter(user => user.Name.toLowerCase().includes(filterValue.toLowerCase()) || user.User.toLowerCase().includes(filterValue.toLowerCase()) || user.Mail.toLowerCase().includes(filterValue.toLowerCase()));
    }
    this.dataSource.data = filteredData;
    // Reset paginator to first page
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  refreshData() {
    this.loadUsers();
  }
  clearFilters() {
    this.searchTerm = '';
    this.roleFilter = '';
    this.agencyFilter = '';
    this.assignedAgencyFilter = '';
    this.statusFilter = '';
    this.applyFilter();
  }
  openCreateDialog() {
    const dialogData = {
      user: {},
      mode: 'create'
    };
    try {
      const dialogRef = this.dialog.open(_user_edit_dialog_user_edit_dialog_component__WEBPACK_IMPORTED_MODULE_0__.UserEditDialogComponent, {
        width: '700px',
        data: dialogData,
        disableClose: false
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.refreshData();
        }
      });
    } catch (error) {
      // Error opening dialog
    }
  }
  openEditDialog(user) {
    const dialogData = {
      user: user,
      mode: 'edit'
    };
    const dialogRef = this.dialog.open(_user_edit_dialog_user_edit_dialog_component__WEBPACK_IMPORTED_MODULE_0__.UserEditDialogComponent, {
      width: '700px',
      data: dialogData,
      disableClose: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshData();
      }
    });
  }
  openAccessDialog(user) {
    const dialogData = {
      user: {
        Id: user.Id,
        Name: user.Name,
        User: user.User,
        Email: user.Mail
      },
      mode: 'edit'
    };
    const dialogRef = this.dialog.open(_user_access_dialog_user_access_dialog_component__WEBPACK_IMPORTED_MODULE_1__.UserAccessDialogComponent, {
      width: '900px',
      maxWidth: '95vw',
      data: dialogData,
      disableClose: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Accesos actualizados para usuario
      }
    });
  }
  deleteUser(user) {
    const confirmDelete = confirm(`¿Estás seguro de que quieres eliminar el usuario "${user.Name || user.User}"?`);
    if (confirmDelete) {
      this.userService.deleteUser(user.Id).subscribe({
        next: response => {
          if (response && response.success) {
            this.users = this.users.filter(u => u.Id !== user.Id);
            this.applyFilter();
            this.snackBar.open('Usuario eliminado exitosamente', 'Éxito', {
              duration: 2000
            });
          } else {
            this.snackBar.open(response?.message || 'Error al eliminar usuario', 'Error', {
              duration: 3000
            });
          }
        },
        error: error => {
          this.snackBar.open(`Error al eliminar usuario: ${error.message || 'Error desconocido'}`, 'Error', {
            duration: 5000
          });
        }
      });
    }
  }
  getRoleColor(roleId) {
    const roleColors = {
      '1': 'bg-blue-100 text-blue-800',
      '2': 'bg-green-100 text-green-800',
      '3': 'bg-yellow-100 text-yellow-800',
      '4': 'bg-purple-100 text-purple-800',
      '5': 'bg-red-100 text-red-800'
    };
    return roleColors[roleId] || 'bg-gray-100 text-gray-800';
  }
  getRoleName(roleId) {
    const role = this.roles.find(r => r.Id === roleId);
    return role ? role.Name : 'Desconocido';
  }
  getAgencyName(agencyId) {
    const agency = this.agencies.find(a => a.Id === agencyId);
    return agency ? agency.Name : agencyId === '0' ? 'Sin agencia' : `Agencia ${agencyId}`;
  }
  getUserStatus(enabled) {
    if (enabled === '1') {
      return {
        text: 'Activo',
        class: 'bg-green-100 text-green-800 border-green-200',
        icon: 'check_circle'
      };
    } else {
      return {
        text: 'Inactivo',
        class: 'bg-red-100 text-red-800 border-red-200',
        icon: 'cancel'
      };
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
  static #_ = this.ɵfac = function UsuariosComponent_Factory(t) {
    return new (t || UsuariosComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_core_services_user_service__WEBPACK_IMPORTED_MODULE_2__.UserService), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_5__.MatDialog), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_6__.MatSnackBar));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
    type: UsuariosComponent,
    selectors: [["app-usuarios"]],
    viewQuery: function UsuariosComponent_Query(rf, ctx) {
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
    decls: 103,
    vars: 36,
    consts: [[1, "p-6"], [1, "flex", "items-center", "justify-between", "mb-6"], [1, "text-3xl", "font-bold", "text-gray-900"], [1, "text-gray-600", "mt-1"], ["mat-raised-button", "", "color", "primary", 1, "flex", "items-center", "gap-2", 3, "click"], [1, "bg-white", "rounded-lg", "shadow-sm", "border", "p-4", "mb-6"], [1, "flex", "items-center", "justify-between", "mb-4"], [1, "text-lg", "font-medium", "text-gray-900"], [1, "flex", "items-center", "gap-3"], ["mat-stroked-button", "", "color", "warn", "matTooltip", "Limpiar todos los filtros", 1, "flex", "items-center", "gap-2", 3, "disabled", "click"], ["mat-stroked-button", "", "color", "accent", "matTooltip", "Recargar datos", 1, "flex", "items-center", "gap-2", 3, "disabled", "click"], [1, "grid", "grid-cols-1", "md:grid-cols-5", "gap-4"], ["appearance", "outline", 1, "w-full"], ["matInput", "", "placeholder", "Buscar por nombre, usuario o email...", "maxlength", "100", 3, "ngModel", "disabled", "ngModelChange"], ["matSuffix", "", "class", "animate-spin", 4, "ngIf"], ["matSuffix", "", 4, "ngIf"], [3, "ngModel", "disabled", "ngModelChange"], ["value", ""], [3, "value", 4, "ngFor", "ngForOf"], ["value", "1"], ["value", "0"], ["class", "mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg", 4, "ngIf"], ["class", "mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg", 4, "ngIf"], [1, "bg-white", "rounded-lg", "shadow-sm", "border", "overflow-hidden"], ["mat-table", "", "matSort", "", 1, "w-full", 2, "line-height", "1", 3, "dataSource"], ["matColumnDef", "Id"], ["mat-header-cell", "", "mat-sort-header", "", "class", "w-16 text-center py-1 bg-gray-50 text-xs font-medium text-gray-700", 4, "matHeaderCellDef"], ["mat-cell", "", "class", "text-xs font-mono text-gray-600 py-0", 4, "matCellDef"], ["matColumnDef", "Name"], ["mat-header-cell", "", "mat-sort-header", "", "class", "min-w-0 flex-1 py-1 bg-gray-50 text-xs font-medium text-gray-700", 4, "matHeaderCellDef"], ["mat-cell", "", "class", "text-xs py-0", 4, "matCellDef"], ["matColumnDef", "User"], ["mat-cell", "", "class", "text-xs py-0 font-mono", 4, "matCellDef"], ["matColumnDef", "Mail"], ["matColumnDef", "IdUserRol"], ["mat-cell", "", "class", "text-left py-0", 4, "matCellDef"], ["matColumnDef", "DefaultAgency"], ["matColumnDef", "AssignedAgencies"], ["mat-header-cell", "", "class", "min-w-0 flex-1 py-1 bg-gray-50 text-xs font-medium text-gray-700", 4, "matHeaderCellDef"], ["matColumnDef", "Status"], ["matColumnDef", "acciones"], ["mat-header-cell", "", "class", "w-40 text-center py-1 bg-gray-50 text-xs font-medium text-gray-700", 4, "matHeaderCellDef"], ["mat-cell", "", "class", "text-center py-0", 4, "matCellDef"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", "class", "!min-h-0 !h-8", 4, "matRowDef", "matRowDefColumns"], ["class", "flex justify-center items-center py-8", 4, "ngIf"], ["showFirstLastButtons", "", 1, "border-t", 3, "pageSizeOptions", "pageSize", "length"], [1, "mt-4", "text-sm", "text-gray-600", "text-center"], ["matSuffix", "", 1, "animate-spin"], ["matSuffix", ""], [3, "value"], [1, "mt-4", "p-3", "bg-blue-50", "border", "border-blue-200", "rounded-lg"], [1, "flex", "items-center", "gap-2", "text-blue-700"], ["diameter", "20"], [1, "text-sm", "font-medium"], [1, "mt-4", "p-3", "bg-yellow-50", "border", "border-yellow-200", "rounded-lg"], [1, "flex", "items-center", "gap-2", "text-yellow-700"], [1, "text-sm"], ["mat-header-cell", "", "mat-sort-header", "", 1, "w-16", "text-center", "py-1", "bg-gray-50", "text-xs", "font-medium", "text-gray-700"], ["mat-cell", "", 1, "text-xs", "font-mono", "text-gray-600", "py-0"], ["mat-header-cell", "", "mat-sort-header", "", 1, "min-w-0", "flex-1", "py-1", "bg-gray-50", "text-xs", "font-medium", "text-gray-700"], ["mat-cell", "", 1, "text-xs", "py-0"], ["mat-cell", "", 1, "text-xs", "py-0", "font-mono"], ["mat-cell", "", 1, "text-left", "py-0"], [1, "text-xs"], ["mat-header-cell", "", 1, "min-w-0", "flex-1", "py-1", "bg-gray-50", "text-xs", "font-medium", "text-gray-700"], [1, "flex", "justify-center", "items-center"], ["class", "text-gray-400 text-xs italic", 4, "ngIf"], ["class", "relative group", 4, "ngIf"], [1, "text-gray-400", "text-xs", "italic"], [1, "relative", "group"], [1, "flex", "items-center", "gap-1", "px-3", "py-1", "bg-blue-100", "text-blue-800", "rounded-full", "text-xs", "font-medium", "border", "border-blue-200", "hover:bg-blue-200", "transition-colors"], [1, "!text-xs", "!w-3", "!h-3", "text-blue-600"], [1, "absolute", "bottom-full", "left-1/2", "transform", "-translate-x-1/2", "mb-2", "px-3", "py-2", "bg-gray-900", "text-white", "text-xs", "rounded-md", "opacity-0", "group-hover:opacity-100", "transition-opacity", "duration-200", "pointer-events-none", "whitespace-nowrap", "z-10"], [1, "text-center"], [1, "font-medium", "border-b", "border-gray-700", "pb-1", "mb-1"], [1, "text-gray-200"], [1, "absolute", "top-full", "left-1/2", "transform", "-translate-x-1/2", "w-0", "h-0", "border-l-4", "border-r-4", "border-t-4", "border-transparent", "border-t-gray-900"], [1, "flex", "items-center", "gap-1", "px-2", "py-1", "rounded-full", "text-xs", "font-medium", "border", 3, "ngClass"], [1, "!text-xs", "!w-3", "!h-3", 3, "ngClass"], ["mat-header-cell", "", 1, "w-40", "text-center", "py-1", "bg-gray-50", "text-xs", "font-medium", "text-gray-700"], ["mat-cell", "", 1, "text-center", "py-0"], [1, "flex", "gap-0.5", "justify-center", "items-center"], ["mat-icon-button", "", "color", "primary", "matTooltip", "Editar", 1, "!w-6", "!h-6", "!min-h-6", "!p-0", 3, "click"], [1, "!text-sm"], ["mat-icon-button", "", "color", "accent", "matTooltip", "Gestionar Accesos", 1, "!w-6", "!h-6", "!min-h-6", "!p-0", 3, "click"], ["mat-icon-button", "", "color", "warn", "matTooltip", "Eliminar", 1, "!w-6", "!h-6", "!min-h-6", "!p-0", 3, "click"], ["mat-header-row", ""], ["mat-row", "", 1, "!min-h-0", "!h-8"], [1, "flex", "justify-center", "items-center", "py-8"], ["diameter", "40"]],
    template: function UsuariosComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div")(3, "h1", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](4, "Gesti\u00F3n de Usuarios");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "p", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](6, "Administra los usuarios del sistema");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](7, "button", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function UsuariosComponent_Template_button_click_7_listener() {
          return ctx.openCreateDialog();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](8, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](9, "add_circle");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](10, " Nuevo Usuario ");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](11, "div", 5)(12, "div", 6)(13, "h3", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](14, "Filtros de B\u00FAsqueda");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](15, "div", 8)(16, "button", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function UsuariosComponent_Template_button_click_16_listener() {
          return ctx.clearFilters();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](17, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](18, "clear_all");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](19, " Limpiar Selecci\u00F3n ");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](20, "button", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function UsuariosComponent_Template_button_click_20_listener() {
          return ctx.refreshData();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](21, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](22, "refresh");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](23, " Recargar ");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](24, "div", 11)(25, "mat-form-field", 12)(26, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](27, "Buscar usuarios");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](28, "input", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("ngModelChange", function UsuariosComponent_Template_input_ngModelChange_28_listener($event) {
          return ctx.searchTerm = $event;
        })("ngModelChange", function UsuariosComponent_Template_input_ngModelChange_28_listener() {
          return ctx.applyFilter();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](29, UsuariosComponent_mat_icon_29_Template, 2, 0, "mat-icon", 14)(30, UsuariosComponent_mat_icon_30_Template, 2, 0, "mat-icon", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](31, "mat-form-field", 12)(32, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](33, "Rol");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](34, "mat-select", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("ngModelChange", function UsuariosComponent_Template_mat_select_ngModelChange_34_listener($event) {
          return ctx.roleFilter = $event;
        })("ngModelChange", function UsuariosComponent_Template_mat_select_ngModelChange_34_listener() {
          return ctx.applyFilter();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](35, "mat-option", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](36, "Todos los roles");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](37, UsuariosComponent_mat_option_37_Template, 2, 2, "mat-option", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](38, UsuariosComponent_mat_icon_38_Template, 2, 0, "mat-icon", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](39, "mat-form-field", 12)(40, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](41, "Agencia Predeterminada");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](42, "mat-select", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("ngModelChange", function UsuariosComponent_Template_mat_select_ngModelChange_42_listener($event) {
          return ctx.agencyFilter = $event;
        })("ngModelChange", function UsuariosComponent_Template_mat_select_ngModelChange_42_listener() {
          return ctx.applyFilter();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](43, "mat-option", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](44, "Todas las agencias");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](45, UsuariosComponent_mat_option_45_Template, 2, 2, "mat-option", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](46, UsuariosComponent_mat_icon_46_Template, 2, 0, "mat-icon", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](47, "mat-form-field", 12)(48, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](49, "Agencias Asignadas");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](50, "mat-select", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("ngModelChange", function UsuariosComponent_Template_mat_select_ngModelChange_50_listener($event) {
          return ctx.assignedAgencyFilter = $event;
        })("ngModelChange", function UsuariosComponent_Template_mat_select_ngModelChange_50_listener() {
          return ctx.applyFilter();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](51, "mat-option", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](52, "Todas las agencias asignadas");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](53, UsuariosComponent_mat_option_53_Template, 2, 2, "mat-option", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](54, UsuariosComponent_mat_icon_54_Template, 2, 0, "mat-icon", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](55, "mat-form-field", 12)(56, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](57, "Estado");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](58, "mat-select", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("ngModelChange", function UsuariosComponent_Template_mat_select_ngModelChange_58_listener($event) {
          return ctx.statusFilter = $event;
        })("ngModelChange", function UsuariosComponent_Template_mat_select_ngModelChange_58_listener() {
          return ctx.applyFilter();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](59, "mat-option", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](60, "Todos los estados");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](61, "mat-option", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](62, "Activo");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](63, "mat-option", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](64, "Inactivo");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](65, UsuariosComponent_mat_icon_65_Template, 2, 0, "mat-icon", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](66, UsuariosComponent_div_66_Template, 5, 0, "div", 21)(67, UsuariosComponent_div_67_Template, 6, 0, "div", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](68, "div", 23)(69, "table", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerStart"](70, 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](71, UsuariosComponent_th_71_Template, 2, 0, "th", 26)(72, UsuariosComponent_td_72_Template, 2, 1, "td", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerStart"](73, 28);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](74, UsuariosComponent_th_74_Template, 2, 0, "th", 29)(75, UsuariosComponent_td_75_Template, 2, 1, "td", 30);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerStart"](76, 31);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](77, UsuariosComponent_th_77_Template, 2, 0, "th", 29)(78, UsuariosComponent_td_78_Template, 2, 1, "td", 32);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerStart"](79, 33);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](80, UsuariosComponent_th_80_Template, 2, 0, "th", 29)(81, UsuariosComponent_td_81_Template, 2, 1, "td", 30);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerStart"](82, 34);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](83, UsuariosComponent_th_83_Template, 2, 0, "th", 29)(84, UsuariosComponent_td_84_Template, 3, 1, "td", 35);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerStart"](85, 36);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](86, UsuariosComponent_th_86_Template, 2, 0, "th", 29)(87, UsuariosComponent_td_87_Template, 2, 1, "td", 30);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerStart"](88, 37);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](89, UsuariosComponent_th_89_Template, 2, 0, "th", 38)(90, UsuariosComponent_td_90_Template, 4, 2, "td", 30);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerStart"](91, 39);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](92, UsuariosComponent_th_92_Template, 2, 0, "th", 38)(93, UsuariosComponent_td_93_Template, 7, 4, "td", 30);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerStart"](94, 40);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](95, UsuariosComponent_th_95_Template, 2, 0, "th", 41)(96, UsuariosComponent_td_96_Template, 11, 0, "td", 42);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](97, UsuariosComponent_tr_97_Template, 1, 0, "tr", 43)(98, UsuariosComponent_tr_98_Template, 1, 0, "tr", 44);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](99, UsuariosComponent_div_99_Template, 2, 0, "div", 45);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](100, "mat-paginator", 46);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](101, "div", 47);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](102);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](16);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("disabled", !ctx.searchTerm && !ctx.roleFilter && !ctx.agencyFilter && !ctx.assignedAgencyFilter && !ctx.statusFilter);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("disabled", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵclassProp"]("animate-spin", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngModel", ctx.searchTerm)("disabled", ctx.loadingCatalogs);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.loadingCatalogs);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", !ctx.loadingCatalogs);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngModel", ctx.roleFilter)("disabled", ctx.loadingCatalogs);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx.roles);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.loadingCatalogs);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngModel", ctx.agencyFilter)("disabled", ctx.loadingCatalogs);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx.agencies);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.loadingCatalogs);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngModel", ctx.assignedAgencyFilter)("disabled", ctx.loadingCatalogs);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx.agencies);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.loadingCatalogs);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngModel", ctx.statusFilter)("disabled", ctx.loadingCatalogs);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.loadingCatalogs);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.loadingCatalogs);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", !ctx.loadingCatalogs && (ctx.roles.length === 0 || ctx.agencies.length === 0));
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("dataSource", ctx.dataSource);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](28);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("matHeaderRowDef", ctx.displayedColumns);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("matRowDefColumns", ctx.displayedColumns);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("pageSizeOptions", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpureFunction0"](35, _c0))("pageSize", 10)("length", ctx.dataSource.filteredData.length);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate3"](" Mostrando ", ctx.getPageRange(), " de ", ctx.dataSource.filteredData.length, " usuarios visibles (", ctx.users.length, " total) ");
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_9__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_9__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_9__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_9__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.MaxLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.NgModel, _angular_material_table__WEBPACK_IMPORTED_MODULE_4__.MatTableModule, _angular_material_table__WEBPACK_IMPORTED_MODULE_4__.MatTable, _angular_material_table__WEBPACK_IMPORTED_MODULE_4__.MatHeaderCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_4__.MatHeaderRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_4__.MatColumnDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_4__.MatCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_4__.MatRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_4__.MatHeaderCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_4__.MatCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_4__.MatHeaderRow, _angular_material_table__WEBPACK_IMPORTED_MODULE_4__.MatRow, _angular_material_paginator__WEBPACK_IMPORTED_MODULE_7__.MatPaginatorModule, _angular_material_paginator__WEBPACK_IMPORTED_MODULE_7__.MatPaginator, _angular_material_sort__WEBPACK_IMPORTED_MODULE_8__.MatSortModule, _angular_material_sort__WEBPACK_IMPORTED_MODULE_8__.MatSort, _angular_material_sort__WEBPACK_IMPORTED_MODULE_8__.MatSortHeader, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_5__.MatDialogModule, _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_6__.MatSnackBarModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_11__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_11__.MatButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_11__.MatIconButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_12__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_12__.MatIcon, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_13__.MatFormFieldModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_13__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_13__.MatLabel, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_13__.MatSuffix, _angular_material_input__WEBPACK_IMPORTED_MODULE_14__.MatInputModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_14__.MatInput, _angular_material_select__WEBPACK_IMPORTED_MODULE_15__.MatSelectModule, _angular_material_select__WEBPACK_IMPORTED_MODULE_15__.MatSelect, _angular_material_core__WEBPACK_IMPORTED_MODULE_16__.MatOption, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_17__.MatProgressSpinnerModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_17__.MatProgressSpinner, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_18__.MatTooltipModule, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_18__.MatTooltip, _angular_material_chips__WEBPACK_IMPORTED_MODULE_19__.MatChipsModule],
    styles: [".usuarios-container[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 24px;\n}\n.usuarios-container[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 30px;\n  font-weight: 700;\n  color: #111827;\n  margin: 0;\n}\n.usuarios-container[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #6b7280;\n  margin: 4px 0 0 0;\n}\n.usuarios-container[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%]   .new-user-btn[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.usuarios-container[_ngcontent-%COMP%]   .filters[_ngcontent-%COMP%] {\n  background-color: white;\n  border-radius: 8px;\n  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);\n  border: 1px solid #e5e7eb;\n  padding: 16px;\n  margin-bottom: 24px;\n}\n.usuarios-container[_ngcontent-%COMP%]   .filters[_ngcontent-%COMP%]   .filters-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  gap: 16px;\n}\n@media (max-width: 768px) {\n  .usuarios-container[_ngcontent-%COMP%]   .filters[_ngcontent-%COMP%]   .filters-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.usuarios-container[_ngcontent-%COMP%]   .table-container[_ngcontent-%COMP%] {\n  background-color: white;\n  border-radius: 8px;\n  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);\n  border: 1px solid #e5e7eb;\n  overflow: hidden;\n}\n.usuarios-container[_ngcontent-%COMP%]   .table-container[_ngcontent-%COMP%]   table[_ngcontent-%COMP%] {\n  width: 100%;\n  line-height: 1;\n}\n.usuarios-container[_ngcontent-%COMP%]   .table-container[_ngcontent-%COMP%]   table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  background-color: #f9fafb;\n  color: #374151;\n  font-size: 12px;\n  font-weight: 500;\n  padding: 4px 8px;\n  text-align: center;\n  vertical-align: middle;\n}\n.usuarios-container[_ngcontent-%COMP%]   .table-container[_ngcontent-%COMP%]   table[_ngcontent-%COMP%]   th.sortable[_ngcontent-%COMP%] {\n  cursor: pointer;\n}\n.usuarios-container[_ngcontent-%COMP%]   .table-container[_ngcontent-%COMP%]   table[_ngcontent-%COMP%]   th.sortable[_ngcontent-%COMP%]:hover {\n  background-color: #f3f4f6;\n}\n.usuarios-container[_ngcontent-%COMP%]   .table-container[_ngcontent-%COMP%]   table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  font-size: 12px;\n  padding: 0 8px;\n  vertical-align: middle;\n  text-align: center;\n}\n.usuarios-container[_ngcontent-%COMP%]   .table-container[_ngcontent-%COMP%]   table[_ngcontent-%COMP%]   td.text-left[_ngcontent-%COMP%] {\n  text-align: left;\n}\n.usuarios-container[_ngcontent-%COMP%]   .table-container[_ngcontent-%COMP%]   table[_ngcontent-%COMP%]   td.text-center[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.usuarios-container[_ngcontent-%COMP%]   .table-container[_ngcontent-%COMP%]   table[_ngcontent-%COMP%]   td.text-right[_ngcontent-%COMP%] {\n  text-align: right;\n}\n.usuarios-container[_ngcontent-%COMP%]   .table-container[_ngcontent-%COMP%]   table[_ngcontent-%COMP%]   td.font-mono[_ngcontent-%COMP%] {\n  font-family: \"Monaco\", \"Menlo\", \"Ubuntu Mono\", monospace;\n}\n.usuarios-container[_ngcontent-%COMP%]   .table-container[_ngcontent-%COMP%]   table[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%] {\n  min-height: 32px;\n  height: 32px;\n}\n.usuarios-container[_ngcontent-%COMP%]   .table-container[_ngcontent-%COMP%]   table[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover {\n  background-color: #f9fafb;\n}\n.usuarios-container[_ngcontent-%COMP%]   .table-container[_ngcontent-%COMP%]   .loading-spinner[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  padding: 32px;\n}\n.usuarios-container[_ngcontent-%COMP%]   .table-container[_ngcontent-%COMP%]   .pagination[_ngcontent-%COMP%] {\n  border-top: 1px solid #e5e7eb;\n}\n.usuarios-container[_ngcontent-%COMP%]   .results-counter[_ngcontent-%COMP%] {\n  margin-top: 16px;\n  text-align: center;\n  font-size: 14px;\n  color: #6b7280;\n}\n\n.role-chip[_ngcontent-%COMP%] {\n  padding: 4px 8px;\n  border-radius: 9999px;\n  font-size: 12px;\n  font-weight: 500;\n}\n.role-chip.admin[_ngcontent-%COMP%] {\n  background-color: #dbeafe;\n  color: #1e40af;\n}\n.role-chip.user[_ngcontent-%COMP%] {\n  background-color: #dcfce7;\n  color: #166534;\n}\n.role-chip.supervisor[_ngcontent-%COMP%] {\n  background-color: #fef3c7;\n  color: #92400e;\n}\n.role-chip.auditor[_ngcontent-%COMP%] {\n  background-color: #f3e8ff;\n  color: #7c3aed;\n}\n.role-chip.readonly[_ngcontent-%COMP%] {\n  background-color: #fee2e2;\n  color: #991b1b;\n}\n\n.status-indicator[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.status-indicator[_ngcontent-%COMP%]   .status-dot[_ngcontent-%COMP%] {\n  width: 2px;\n  height: 2px;\n  border-radius: 50%;\n  margin-right: 8px;\n}\n.status-indicator[_ngcontent-%COMP%]   .status-dot.active[_ngcontent-%COMP%] {\n  background-color: #10b981;\n}\n.status-indicator[_ngcontent-%COMP%]   .status-dot.inactive[_ngcontent-%COMP%] {\n  background-color: #ef4444;\n}\n.status-indicator[_ngcontent-%COMP%]   .status-badge[_ngcontent-%COMP%] {\n  padding: 2px 6px;\n  border-radius: 9999px;\n  font-size: 12px;\n  font-weight: 500;\n}\n.status-indicator[_ngcontent-%COMP%]   .status-badge.active[_ngcontent-%COMP%] {\n  background-color: #d1fae5;\n  color: #065f46;\n}\n.status-indicator[_ngcontent-%COMP%]   .status-badge.inactive[_ngcontent-%COMP%] {\n  background-color: #fee2e2;\n  color: #991b1b;\n}\n\n.action-buttons[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 2px;\n  justify-content: center;\n  align-items: center;\n}\n.action-buttons[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  width: 24px;\n  height: 24px;\n  min-height: 24px;\n  padding: 0;\n}\n.action-buttons[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 16px;\n  width: 16px;\n  height: 16px;\n}\n\n.filter-field[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.filter-field[_ngcontent-%COMP%]   .mat-mdc-form-field[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.new-user-button[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 8px 16px;\n  border-radius: 6px;\n  font-weight: 500;\n}\n.new-user-button[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 20px;\n  width: 20px;\n  height: 20px;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvY29uZmlndXJhY2lvbi91c3Vhcmlvcy91c3Vhcmlvcy5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFRTtFQUNFLGFBQUE7RUFDQSxtQkFBQTtFQUNBLDhCQUFBO0VBQ0EsbUJBQUE7QUFESjtBQUdJO0VBQ0UsZUFBQTtFQUNBLGdCQUFBO0VBQ0EsY0FBQTtFQUNBLFNBQUE7QUFETjtBQUlJO0VBQ0UsY0FBQTtFQUNBLGlCQUFBO0FBRk47QUFLSTtFQUNFLGFBQUE7RUFDQSxtQkFBQTtFQUNBLFFBQUE7QUFITjtBQU9FO0VBQ0UsdUJBQUE7RUFDQSxrQkFBQTtFQUNBLDBDQUFBO0VBQ0EseUJBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7QUFMSjtBQU9JO0VBQ0UsYUFBQTtFQUNBLGtDQUFBO0VBQ0EsU0FBQTtBQUxOO0FBT007RUFMRjtJQU1JLDBCQUFBO0VBSk47QUFDRjtBQVFFO0VBQ0UsdUJBQUE7RUFDQSxrQkFBQTtFQUNBLDBDQUFBO0VBQ0EseUJBQUE7RUFDQSxnQkFBQTtBQU5KO0FBUUk7RUFDRSxXQUFBO0VBQ0EsY0FBQTtBQU5OO0FBUU07RUFDRSx5QkFBQTtFQUNBLGNBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxnQkFBQTtFQUNBLGtCQUFBO0VBQ0Esc0JBQUE7QUFOUjtBQVFRO0VBQ0UsZUFBQTtBQU5WO0FBUVU7RUFDRSx5QkFBQTtBQU5aO0FBV007RUFDRSxlQUFBO0VBQ0EsY0FBQTtFQUNBLHNCQUFBO0VBQ0Esa0JBQUE7QUFUUjtBQVdRO0VBQ0UsZ0JBQUE7QUFUVjtBQVlRO0VBQ0Usa0JBQUE7QUFWVjtBQWFRO0VBQ0UsaUJBQUE7QUFYVjtBQWNRO0VBQ0Usd0RBQUE7QUFaVjtBQWdCTTtFQUNFLGdCQUFBO0VBQ0EsWUFBQTtBQWRSO0FBZ0JRO0VBQ0UseUJBQUE7QUFkVjtBQW1CSTtFQUNFLGFBQUE7RUFDQSx1QkFBQTtFQUNBLG1CQUFBO0VBQ0EsYUFBQTtBQWpCTjtBQW9CSTtFQUNFLDZCQUFBO0FBbEJOO0FBc0JFO0VBQ0UsZ0JBQUE7RUFDQSxrQkFBQTtFQUNBLGVBQUE7RUFDQSxjQUFBO0FBcEJKOztBQXlCQTtFQUNFLGdCQUFBO0VBQ0EscUJBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7QUF0QkY7QUF3QkU7RUFDRSx5QkFBQTtFQUNBLGNBQUE7QUF0Qko7QUF5QkU7RUFDRSx5QkFBQTtFQUNBLGNBQUE7QUF2Qko7QUEwQkU7RUFDRSx5QkFBQTtFQUNBLGNBQUE7QUF4Qko7QUEyQkU7RUFDRSx5QkFBQTtFQUNBLGNBQUE7QUF6Qko7QUE0QkU7RUFDRSx5QkFBQTtFQUNBLGNBQUE7QUExQko7O0FBK0JBO0VBQ0UsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7QUE1QkY7QUE4QkU7RUFDRSxVQUFBO0VBQ0EsV0FBQTtFQUNBLGtCQUFBO0VBQ0EsaUJBQUE7QUE1Qko7QUE4Qkk7RUFDRSx5QkFBQTtBQTVCTjtBQStCSTtFQUNFLHlCQUFBO0FBN0JOO0FBaUNFO0VBQ0UsZ0JBQUE7RUFDQSxxQkFBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtBQS9CSjtBQWlDSTtFQUNFLHlCQUFBO0VBQ0EsY0FBQTtBQS9CTjtBQWtDSTtFQUNFLHlCQUFBO0VBQ0EsY0FBQTtBQWhDTjs7QUFzQ0E7RUFDRSxhQUFBO0VBQ0EsUUFBQTtFQUNBLHVCQUFBO0VBQ0EsbUJBQUE7QUFuQ0Y7QUFxQ0U7RUFDRSxXQUFBO0VBQ0EsWUFBQTtFQUNBLGdCQUFBO0VBQ0EsVUFBQTtBQW5DSjtBQXFDSTtFQUNFLGVBQUE7RUFDQSxXQUFBO0VBQ0EsWUFBQTtBQW5DTjs7QUF5Q0E7RUFDRSxXQUFBO0FBdENGO0FBd0NFO0VBQ0UsV0FBQTtBQXRDSjs7QUEyQ0E7RUFDRSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxRQUFBO0VBQ0EsaUJBQUE7RUFDQSxrQkFBQTtFQUNBLGdCQUFBO0FBeENGO0FBMENFO0VBQ0UsZUFBQTtFQUNBLFdBQUE7RUFDQSxZQUFBO0FBeENKIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRXN0aWxvcyBlc3BlY8ODwq1maWNvcyBwYXJhIGVsIGNvbXBvbmVudGUgZGUgdXN1YXJpb3Ncbi51c3Vhcmlvcy1jb250YWluZXIge1xuICAuaGVhZGVyIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAgIG1hcmdpbi1ib3R0b206IDI0cHg7XG4gICAgXG4gICAgaDEge1xuICAgICAgZm9udC1zaXplOiAzMHB4O1xuICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgICAgIGNvbG9yOiAjMTExODI3O1xuICAgICAgbWFyZ2luOiAwO1xuICAgIH1cbiAgICBcbiAgICBwIHtcbiAgICAgIGNvbG9yOiAjNmI3MjgwO1xuICAgICAgbWFyZ2luOiA0cHggMCAwIDA7XG4gICAgfVxuICAgIFxuICAgIC5uZXctdXNlci1idG4ge1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICBnYXA6IDhweDtcbiAgICB9XG4gIH1cbiAgXG4gIC5maWx0ZXJzIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcbiAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgYm94LXNoYWRvdzogMCAxcHggM3B4IDAgcmdiYSgwLCAwLCAwLCAwLjEpO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkICNlNWU3ZWI7XG4gICAgcGFkZGluZzogMTZweDtcbiAgICBtYXJnaW4tYm90dG9tOiAyNHB4O1xuICAgIFxuICAgIC5maWx0ZXJzLWdyaWQge1xuICAgICAgZGlzcGxheTogZ3JpZDtcbiAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDFmciAxZnI7XG4gICAgICBnYXA6IDE2cHg7XG4gICAgICBcbiAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmcjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gIC50YWJsZS1jb250YWluZXIge1xuICAgIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xuICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICBib3gtc2hhZG93OiAwIDFweCAzcHggMCByZ2JhKDAsIDAsIDAsIDAuMSk7XG4gICAgYm9yZGVyOiAxcHggc29saWQgI2U1ZTdlYjtcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgIFxuICAgIHRhYmxlIHtcbiAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgbGluZS1oZWlnaHQ6IDE7XG4gICAgICBcbiAgICAgIHRoIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2Y5ZmFmYjtcbiAgICAgICAgY29sb3I6ICMzNzQxNTE7XG4gICAgICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgICAgcGFkZGluZzogNHB4IDhweDtcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICAgICAgICBcbiAgICAgICAgJi5zb3J0YWJsZSB7XG4gICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICAgIFxuICAgICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2YzZjRmNjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgdGQge1xuICAgICAgICBmb250LXNpemU6IDEycHg7XG4gICAgICAgIHBhZGRpbmc6IDAgOHB4O1xuICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICAgIFxuICAgICAgICAmLnRleHQtbGVmdCB7XG4gICAgICAgICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgJi50ZXh0LWNlbnRlciB7XG4gICAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAmLnRleHQtcmlnaHQge1xuICAgICAgICAgIHRleHQtYWxpZ246IHJpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAmLmZvbnQtbW9ubyB7XG4gICAgICAgICAgZm9udC1mYW1pbHk6ICdNb25hY28nLCAnTWVubG8nLCAnVWJ1bnR1IE1vbm8nLCBtb25vc3BhY2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgdHIge1xuICAgICAgICBtaW4taGVpZ2h0OiAzMnB4O1xuICAgICAgICBoZWlnaHQ6IDMycHg7XG4gICAgICAgIFxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjlmYWZiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIC5sb2FkaW5nLXNwaW5uZXIge1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgIHBhZGRpbmc6IDMycHg7XG4gICAgfVxuICAgIFxuICAgIC5wYWdpbmF0aW9uIHtcbiAgICAgIGJvcmRlci10b3A6IDFweCBzb2xpZCAjZTVlN2ViO1xuICAgIH1cbiAgfVxuICBcbiAgLnJlc3VsdHMtY291bnRlciB7XG4gICAgbWFyZ2luLXRvcDogMTZweDtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgZm9udC1zaXplOiAxNHB4O1xuICAgIGNvbG9yOiAjNmI3MjgwO1xuICB9XG59XG5cbi8vIEVzdGlsb3MgcGFyYSBsb3MgY2hpcHMgZGUgcm9sXG4ucm9sZS1jaGlwIHtcbiAgcGFkZGluZzogNHB4IDhweDtcbiAgYm9yZGVyLXJhZGl1czogOTk5OXB4O1xuICBmb250LXNpemU6IDEycHg7XG4gIGZvbnQtd2VpZ2h0OiA1MDA7XG4gIFxuICAmLmFkbWluIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZGJlYWZlO1xuICAgIGNvbG9yOiAjMWU0MGFmO1xuICB9XG4gIFxuICAmLnVzZXIge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNkY2ZjZTc7XG4gICAgY29sb3I6ICMxNjY1MzQ7XG4gIH1cbiAgXG4gICYuc3VwZXJ2aXNvciB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2ZlZjNjNztcbiAgICBjb2xvcjogIzkyNDAwZTtcbiAgfVxuICBcbiAgJi5hdWRpdG9yIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjNlOGZmO1xuICAgIGNvbG9yOiAjN2MzYWVkO1xuICB9XG4gIFxuICAmLnJlYWRvbmx5IHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmVlMmUyO1xuICAgIGNvbG9yOiAjOTkxYjFiO1xuICB9XG59XG5cbi8vIEVzdGlsb3MgcGFyYSBsb3MgZXN0YWRvc1xuLnN0YXR1cy1pbmRpY2F0b3Ige1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgXG4gIC5zdGF0dXMtZG90IHtcbiAgICB3aWR0aDogMnB4O1xuICAgIGhlaWdodDogMnB4O1xuICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICBtYXJnaW4tcmlnaHQ6IDhweDtcbiAgICBcbiAgICAmLmFjdGl2ZSB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMTBiOTgxO1xuICAgIH1cbiAgICBcbiAgICAmLmluYWN0aXZlIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICNlZjQ0NDQ7XG4gICAgfVxuICB9XG4gIFxuICAuc3RhdHVzLWJhZGdlIHtcbiAgICBwYWRkaW5nOiAycHggNnB4O1xuICAgIGJvcmRlci1yYWRpdXM6IDk5OTlweDtcbiAgICBmb250LXNpemU6IDEycHg7XG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICBcbiAgICAmLmFjdGl2ZSB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZDFmYWU1O1xuICAgICAgY29sb3I6ICMwNjVmNDY7XG4gICAgfVxuICAgIFxuICAgICYuaW5hY3RpdmUge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2ZlZTJlMjtcbiAgICAgIGNvbG9yOiAjOTkxYjFiO1xuICAgIH1cbiAgfVxufVxuXG4vLyBFc3RpbG9zIHBhcmEgbG9zIGJvdG9uZXMgZGUgYWNjacODwrNuXG4uYWN0aW9uLWJ1dHRvbnMge1xuICBkaXNwbGF5OiBmbGV4O1xuICBnYXA6IDJweDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIFxuICBidXR0b24ge1xuICAgIHdpZHRoOiAyNHB4O1xuICAgIGhlaWdodDogMjRweDtcbiAgICBtaW4taGVpZ2h0OiAyNHB4O1xuICAgIHBhZGRpbmc6IDA7XG4gICAgXG4gICAgbWF0LWljb24ge1xuICAgICAgZm9udC1zaXplOiAxNnB4O1xuICAgICAgd2lkdGg6IDE2cHg7XG4gICAgICBoZWlnaHQ6IDE2cHg7XG4gICAgfVxuICB9XG59XG5cbi8vIEVzdGlsb3MgcGFyYSBsb3MgZmlsdHJvc1xuLmZpbHRlci1maWVsZCB7XG4gIHdpZHRoOiAxMDAlO1xuICBcbiAgLm1hdC1tZGMtZm9ybS1maWVsZCB7XG4gICAgd2lkdGg6IDEwMCU7XG4gIH1cbn1cblxuLy8gRXN0aWxvcyBwYXJhIGVsIGJvdMODwrNuIGRlIG51ZXZvIHVzdWFyaW9cbi5uZXctdXNlci1idXR0b24ge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBnYXA6IDhweDtcbiAgcGFkZGluZzogOHB4IDE2cHg7XG4gIGJvcmRlci1yYWRpdXM6IDZweDtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgXG4gIG1hdC1pY29uIHtcbiAgICBmb250LXNpemU6IDIwcHg7XG4gICAgd2lkdGg6IDIwcHg7XG4gICAgaGVpZ2h0OiAyMHB4O1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
  });
}

/***/ })

}]);
//# sourceMappingURL=src_app_pages_configuracion_usuarios_usuarios_component_ts.js.map