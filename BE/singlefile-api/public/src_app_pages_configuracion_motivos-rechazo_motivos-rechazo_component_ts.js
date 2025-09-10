"use strict";
(self["webpackChunkvex"] = self["webpackChunkvex"] || []).push([["src_app_pages_configuracion_motivos-rechazo_motivos-rechazo_component_ts"],{

/***/ 73769:
/*!******************************************************!*\
  !*** ./src/app/core/services/file-reason.service.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FileReasonService: () => (/* binding */ FileReasonService)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ 54860);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../environments/environment */ 20553);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 61699);




class FileReasonService {
  constructor(http) {
    this.http = http;
    this.apiUrl = `${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiBaseUrl}/api/file-reason`;
  }
  /**
   * Obtener todos los motivos de rechazo con filtros y paginación
   */
  getFileReasons(filters = {}) {
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
   * Obtener un motivo de rechazo específico por ID
   */
  getFileReason(id) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  /**
   * Crear un nuevo motivo de rechazo
   */
  createFileReason(fileReason) {
    return this.http.post(this.apiUrl, fileReason);
  }
  /**
   * Actualizar un motivo de rechazo existente
   */
  updateFileReason(id, fileReason) {
    return this.http.put(`${this.apiUrl}/${id}`, fileReason);
  }
  /**
   * Eliminar un motivo de rechazo
   */
  deleteFileReason(id) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  /**
   * Buscar motivos de rechazo
   */
  searchFileReasons(query, limit = 10) {
    const params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpParams().set('q', query).set('limit', limit.toString());
    return this.http.get(`${this.apiUrl}/search`, {
      params
    });
  }
  /**
   * Obtener estadísticas de motivos de rechazo
   */
  getStats() {
    return this.http.get(`${this.apiUrl}/stats`);
  }
  /**
   * Obtener motivos activos
   */
  getActiveFileReasons() {
    return this.http.get(`${this.apiUrl}/active`);
  }
  /**
   * Cambiar estado del motivo
   */
  toggleStatus(id) {
    return this.http.patch(`${this.apiUrl}/${id}/toggle-status`, {});
  }
  static #_ = this.ɵfac = function FileReasonService_Factory(t) {
    return new (t || FileReasonService)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpClient));
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
    token: FileReasonService,
    factory: FileReasonService.ɵfac,
    providedIn: 'root'
  });
}

/***/ }),

/***/ 87823:
/*!********************************************************************************************************!*\
  !*** ./src/app/pages/configuracion/motivos-rechazo/motivo-edit-dialog/motivo-edit-dialog.component.ts ***!
  \********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MotivoEditDialogComponent: () => (/* binding */ MotivoEditDialogComponent)
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
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _core_services_file_reason_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../core/services/file-reason.service */ 73769);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/core */ 55309);





















function MotivoEditDialogComponent_mat_option_20_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-option", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const option_r3 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("value", option_r3.value);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", option_r3.label, " ");
  }
}
function MotivoEditDialogComponent_mat_icon_37_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-icon", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "refresh");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function MotivoEditDialogComponent_mat_icon_38_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r2.isEdit ? "save" : "add");
  }
}
class MotivoEditDialogComponent {
  constructor(dialogRef, data, fileReasonService, snackBar) {
    this.dialogRef = dialogRef;
    this.data = data;
    this.fileReasonService = fileReasonService;
    this.snackBar = snackBar;
    this.motivo = {};
    this.isEdit = false;
    this.loading = false;
    // Opciones para el tipo de razón
    this.tipoRazonOptions = [{
      value: 4,
      label: 'Aprobación'
    }, {
      value: 5,
      label: 'Rechazo'
    }];
    this.isEdit = data.isEdit;
    // Debug: verificar datos recibidos
    console.log('MotivoEditDialog - constructor data:', data);
    if (data.motivo) {
      this.motivo = {
        ...data.motivo,
        // Asegurar que los valores numéricos sean del tipo correcto
        IdTypeReason: Number(data.motivo.IdTypeReason),
        Enabled: Number(data.motivo.Enabled)
      };
      // Debug: verificar valores convertidos
      console.log('MotivoEditDialog - valores convertidos:', {
        original: data.motivo,
        converted: this.motivo
      });
    }
  }
  ngOnInit() {
    // Si es creación, establecer valores por defecto
    if (!this.isEdit) {
      this.motivo = {
        Name: '',
        IdTypeReason: 5,
        Enabled: 1
      };
    }
    // Debug: verificar valores asignados
    console.log('MotivoEditDialog - ngOnInit:', {
      isEdit: this.isEdit,
      motivo: this.motivo,
      IdTypeReason: this.motivo.IdTypeReason,
      Enabled: this.motivo.Enabled,
      IdTypeReasonType: typeof this.motivo.IdTypeReason,
      EnabledType: typeof this.motivo.Enabled
    });
  }
  /**
   * Guardar o actualizar el motivo
   */
  saveMotivo() {
    if (!this.motivo.Name || !this.motivo.Name.trim()) {
      this.snackBar.open('El nombre del motivo es requerido', 'Error', {
        duration: 3000
      });
      return;
    }
    this.loading = true;
    if (this.isEdit) {
      // Actualizar motivo existente
      this.fileReasonService.updateFileReason(this.motivo.Id, this.motivo).subscribe({
        next: response => {
          console.log('Respuesta de actualización:', response);
          this.snackBar.open('Motivo actualizado exitosamente', 'Éxito', {
            duration: 2000
          });
          this.dialogRef.close(true);
        },
        error: error => {
          console.error('Error actualizando motivo:', error);
          this.snackBar.open('Error al actualizar el motivo', 'Error', {
            duration: 3000
          });
          this.loading = false;
        }
      });
    } else {
      // Crear nuevo motivo
      this.fileReasonService.createFileReason(this.motivo).subscribe({
        next: response => {
          this.snackBar.open('Motivo creado exitosamente', 'Éxito', {
            duration: 2000
          });
          this.dialogRef.close(true);
        },
        error: error => {
          console.error('Error creando motivo:', error);
          this.snackBar.open('Error al crear el motivo', 'Error', {
            duration: 3000
          });
          this.loading = false;
        }
      });
    }
  }
  /**
   * Cancelar la operación
   */
  cancel() {
    this.dialogRef.close(false);
  }
  /**
   * Obtener el título del diálogo
   */
  getDialogTitle() {
    return this.isEdit ? 'Editar Motivo' : 'Nuevo Motivo';
  }
  /**
   * Obtener el texto del botón de guardar
   */
  getSaveButtonText() {
    return this.isEdit ? 'Actualizar' : 'Crear';
  }
  static #_ = this.ɵfac = function MotivoEditDialogComponent_Factory(t) {
    return new (t || MotivoEditDialogComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__.MatDialogRef), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__.MAT_DIALOG_DATA), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_core_services_file_reason_service__WEBPACK_IMPORTED_MODULE_0__.FileReasonService), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_3__.MatSnackBar));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: MotivoEditDialogComponent,
    selectors: [["app-motivo-edit-dialog"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵStandaloneFeature"]],
    decls: 40,
    vars: 12,
    consts: [[1, "p-6"], [1, "flex", "items-center", "justify-between", "mb-6"], [1, "text-2xl", "font-bold", "text-gray-900"], ["mat-icon-button", "", 1, "text-gray-400", "hover:text-gray-600", 3, "click"], [1, "space-y-6", 3, "ngSubmit"], ["appearance", "outline", 1, "w-full"], ["matInput", "", "name", "name", "placeholder", "Ingrese el nombre del motivo", "maxlength", "500", "required", "", 3, "ngModel", "ngModelChange"], ["matSuffix", ""], ["name", "idTypeReason", "required", "", 3, "ngModel", "ngModelChange"], [3, "value", 4, "ngFor", "ngForOf"], ["name", "enabled", 3, "ngModel", "ngModelChange"], [3, "value"], [1, "flex", "justify-end", "gap-3", "pt-4"], ["type", "button", "mat-stroked-button", "", 3, "disabled", "click"], ["type", "submit", "mat-raised-button", "", "color", "primary", 3, "disabled"], ["class", "animate-spin", 4, "ngIf"], [4, "ngIf"], [1, "animate-spin"]],
    template: function MotivoEditDialogComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h2", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "button", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function MotivoEditDialogComponent_Template_button_click_4_listener() {
          return ctx.cancel();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, "close");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "form", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngSubmit", function MotivoEditDialogComponent_Template_form_ngSubmit_7_listener() {
          return ctx.saveMotivo();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "mat-form-field", 5)(9, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](10, "Nombre del Motivo");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "input", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function MotivoEditDialogComponent_Template_input_ngModelChange_11_listener($event) {
          return ctx.motivo.Name = $event;
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "mat-icon", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](13, "description");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "mat-hint");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](15, "M\u00E1ximo 500 caracteres");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](16, "mat-form-field", 5)(17, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](18, "Tipo de Raz\u00F3n");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](19, "mat-select", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function MotivoEditDialogComponent_Template_mat_select_ngModelChange_19_listener($event) {
          return ctx.motivo.IdTypeReason = $event;
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](20, MotivoEditDialogComponent_mat_option_20_Template, 2, 2, "mat-option", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](21, "mat-icon", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](22, "category");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](23, "mat-form-field", 5)(24, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](25, "Estado");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](26, "mat-select", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function MotivoEditDialogComponent_Template_mat_select_ngModelChange_26_listener($event) {
          return ctx.motivo.Enabled = $event;
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](27, "mat-option", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](28, "Habilitado");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](29, "mat-option", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](30, "Deshabilitado");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](31, "mat-icon", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](32, "toggle_on");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](33, "div", 12)(34, "button", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function MotivoEditDialogComponent_Template_button_click_34_listener() {
          return ctx.cancel();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](35, " Cancelar ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](36, "button", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](37, MotivoEditDialogComponent_mat_icon_37_Template, 2, 0, "mat-icon", 15)(38, MotivoEditDialogComponent_mat_icon_38_Template, 2, 1, "mat-icon", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](39);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.getDialogTitle());
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx.motivo.Name);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx.motivo.IdTypeReason);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.tipoRazonOptions);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx.motivo.Enabled);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("value", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("value", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", ctx.loading || !(ctx.motivo.Name == null ? null : ctx.motivo.Name.trim()));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx.getSaveButtonText(), " ");
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_5__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.MaxLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgModel, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgForm, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__.MatDialogModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__.MatFormFieldModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__.MatLabel, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__.MatHint, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__.MatSuffix, _angular_material_input__WEBPACK_IMPORTED_MODULE_7__.MatInputModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_7__.MatInput, _angular_material_select__WEBPACK_IMPORTED_MODULE_8__.MatSelectModule, _angular_material_select__WEBPACK_IMPORTED_MODULE_8__.MatSelect, _angular_material_core__WEBPACK_IMPORTED_MODULE_9__.MatOption, _angular_material_button__WEBPACK_IMPORTED_MODULE_10__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_10__.MatButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_10__.MatIconButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_11__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_11__.MatIcon, _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_3__.MatSnackBarModule],
    styles: [".mat-mdc-dialog-container[_ngcontent-%COMP%]   .mat-mdc-dialog-surface[_ngcontent-%COMP%] {\n  border-radius: 12px;\n  overflow: hidden;\n}\n\nbutton[_ngcontent-%COMP%] {\n  transition: all 0.2s ease-in-out;\n}\nbutton[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n\nmat-form-field[_ngcontent-%COMP%]   .mat-mdc-form-field-wrapper[_ngcontent-%COMP%] {\n  padding-bottom: 0;\n}\n\n.mat-icon-button[_ngcontent-%COMP%]:hover {\n  background-color: rgba(0, 0, 0, 0.04);\n}\n\nbutton[type=submit][_ngcontent-%COMP%] {\n  min-width: 120px;\n}\nbutton[type=submit][_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  margin-right: 8px;\n}\n\n@media (max-width: 640px) {\n  .p-6[_ngcontent-%COMP%] {\n    padding: 1rem;\n  }\n  .text-2xl[_ngcontent-%COMP%] {\n    font-size: 1.5rem;\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvY29uZmlndXJhY2lvbi9tb3Rpdm9zLXJlY2hhem8vbW90aXZvLWVkaXQtZGlhbG9nL21vdGl2by1lZGl0LWRpYWxvZy5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHRTtFQUNFLG1CQUFBO0VBQ0EsZ0JBQUE7QUFGSjs7QUFPQTtFQUNFLGdDQUFBO0FBSkY7QUFNRTtFQUNFLFlBQUE7RUFDQSxtQkFBQTtBQUpKOztBQVVFO0VBQ0UsaUJBQUE7QUFQSjs7QUFhRTtFQUNFLHFDQUFBO0FBVko7O0FBZUE7RUFDRSxnQkFBQTtBQVpGO0FBY0U7RUFDRSxpQkFBQTtBQVpKOztBQWlCQTtFQUNFO0lBQ0UsYUFBQTtFQWRGO0VBaUJBO0lBQ0UsaUJBQUE7RUFmRjtBQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRXN0aWxvcyBwYXJhIGVsIGRpw4PCoWxvZ28gZGUgZWRpY2nDg8Kzbi9jcmVhY2nDg8KzbiBkZSBtb3Rpdm9zXG5cbi5tYXQtbWRjLWRpYWxvZy1jb250YWluZXIge1xuICAubWF0LW1kYy1kaWFsb2ctc3VyZmFjZSB7XG4gICAgYm9yZGVyLXJhZGl1czogMTJweDtcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xuICB9XG59XG5cbi8vIEFuaW1hY2lvbmVzIHBhcmEgbG9zIGJvdG9uZXNcbmJ1dHRvbiB7XG4gIHRyYW5zaXRpb246IGFsbCAwLjJzIGVhc2UtaW4tb3V0O1xuICBcbiAgJjpkaXNhYmxlZCB7XG4gICAgb3BhY2l0eTogMC42O1xuICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gIH1cbn1cblxuLy8gRXN0aWxvcyBwYXJhIGxvcyBjYW1wb3MgZGVsIGZvcm11bGFyaW9cbm1hdC1mb3JtLWZpZWxkIHtcbiAgLm1hdC1tZGMtZm9ybS1maWVsZC13cmFwcGVyIHtcbiAgICBwYWRkaW5nLWJvdHRvbTogMDtcbiAgfVxufVxuXG4vLyBFc3RpbG9zIHBhcmEgZWwgYm90w4PCs24gZGUgY2VycmFyXG4ubWF0LWljb24tYnV0dG9uIHtcbiAgJjpob3ZlciB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjA0KTtcbiAgfVxufVxuXG4vLyBFc3RpbG9zIHBhcmEgZWwgYm90w4PCs24gZGUgZ3VhcmRhclxuYnV0dG9uW3R5cGU9XCJzdWJtaXRcIl0ge1xuICBtaW4td2lkdGg6IDEyMHB4O1xuICBcbiAgbWF0LWljb24ge1xuICAgIG1hcmdpbi1yaWdodDogOHB4O1xuICB9XG59XG5cbi8vIFJlc3BvbnNpdmVcbkBtZWRpYSAobWF4LXdpZHRoOiA2NDBweCkge1xuICAucC02IHtcbiAgICBwYWRkaW5nOiAxcmVtO1xuICB9XG4gIFxuICAudGV4dC0yeGwge1xuICAgIGZvbnQtc2l6ZTogMS41cmVtO1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
  });
}

/***/ }),

/***/ 93497:
/*!**********************************************************************************!*\
  !*** ./src/app/pages/configuracion/motivos-rechazo/motivos-rechazo.component.ts ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MotivosRechazoComponent: () => (/* binding */ MotivosRechazoComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/forms */ 28849);
/* harmony import */ var _angular_material_table__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/table */ 46798);
/* harmony import */ var _angular_material_paginator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/paginator */ 39687);
/* harmony import */ var _angular_material_sort__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/sort */ 87963);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/form-field */ 51333);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/input */ 10026);
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/select */ 96355);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material/progress-spinner */ 33910);
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/material/tooltip */ 60702);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/snack-bar */ 49409);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/dialog */ 17401);
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/material/card */ 18497);
/* harmony import */ var _motivo_edit_dialog_motivo_edit_dialog_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./motivo-edit-dialog/motivo-edit-dialog.component */ 87823);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _core_services_file_reason_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../core/services/file-reason.service */ 73769);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/core */ 55309);

































function MotivosRechazoComponent_div_42_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "mat-spinner", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function MotivosRechazoComponent_th_45_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "th", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " ID ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function MotivosRechazoComponent_td_46_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "td", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const reason_r14 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", reason_r14.Id, " ");
  }
}
function MotivosRechazoComponent_th_48_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "th", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Nombre ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function MotivosRechazoComponent_td_49_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "td", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const reason_r15 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", reason_r15.Name, " ");
  }
}
function MotivosRechazoComponent_th_51_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "th", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Tipo de Raz\u00F3n ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function MotivosRechazoComponent_td_52_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "td", 47)(1, "span", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const reason_r16 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", reason_r16.IdTypeReason == 4 ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", reason_r16.TypeReasonLabel, " ");
  }
}
function MotivosRechazoComponent_th_54_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "th", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Estado ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function MotivosRechazoComponent_td_55_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "td", 47)(1, "span", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const reason_r17 = ctx.$implicit;
    const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", ctx_r8.isEnabled(reason_r17.Enabled) ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", ctx_r8.isEnabled(reason_r17.Enabled) ? "Habilitado" : "Deshabilitado", " ");
  }
}
function MotivosRechazoComponent_th_57_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "th", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Acciones ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function MotivosRechazoComponent_td_58_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "td", 51)(1, "div", 52)(2, "button", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function MotivosRechazoComponent_td_58_Template_button_click_2_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r20);
      const reason_r18 = restoredCtx.$implicit;
      const ctx_r19 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r19.editFileReason(reason_r18));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "mat-icon", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4, "edit");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "button", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function MotivosRechazoComponent_td_58_Template_button_click_5_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r20);
      const reason_r18 = restoredCtx.$implicit;
      const ctx_r21 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r21.deleteFileReason(reason_r18));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "mat-icon", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](7, "delete");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()();
  }
}
function MotivosRechazoComponent_tr_59_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "tr", 56);
  }
}
function MotivosRechazoComponent_tr_60_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "tr", 57);
  }
}
function MotivosRechazoComponent_div_61_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 58)(1, "mat-icon", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2, "inbox");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "p", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4, "No se encontraron motivos de rechazo");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "p", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6, "Intenta ajustar los filtros o crear un nuevo motivo");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
}
const _c0 = () => [10, 25, 50, 100];
class MotivosRechazoComponent {
  constructor(fileReasonService, snackBar, dialog) {
    this.fileReasonService = fileReasonService;
    this.snackBar = snackBar;
    this.dialog = dialog;
    this.displayedColumns = ['id', 'name', 'idTypeReason', 'enabled', 'actions'];
    this.dataSource = new _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatTableDataSource([]);
    this.loading = false;
    // Filtros
    this.filters = {
      search: '',
      id_type_reason: undefined,
      sort_by: 'Name',
      sort_order: 'ASC'
    };
    // Paginación
    this.totalReasons = 0;
    this.pageSize = 10;
    this.pageSizeOptions = [10, 25, 50, 100];
  }
  ngOnInit() {
    this.loadData();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  /**
   * Cargar datos con filtros aplicados
   */
  loadData() {
    this.loading = true;
    this.fileReasonService.getFileReasons(this.filters).subscribe({
      next: response => {
        console.log('Respuesta de la API:', response);
        console.log('Datos de motivos:', response.data.file_reasons);
        // Debuggear cada motivo individualmente
        response.data.file_reasons.forEach((reason, index) => {
          console.log(`Motivo ${index + 1}:`, {
            Id: reason.Id,
            Name: reason.Name,
            IdTypeReason: reason.IdTypeReason,
            TypeReasonLabel: reason.TypeReasonLabel,
            IdTypeReasonType: typeof reason.IdTypeReason,
            Comparison4: reason.IdTypeReason == 4,
            Comparison5: reason.IdTypeReason == 5,
            Enabled: reason.Enabled,
            EnabledType: typeof reason.Enabled,
            EnabledComparison: reason.Enabled == 1
          });
        });
        this.dataSource.data = response.data.file_reasons;
        this.totalReasons = response.data.total;
        this.loading = false;
      },
      error: error => {
        console.error('Error cargando motivos:', error);
        this.snackBar.open('Error al cargar los motivos', 'Error', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }
  /**
   * Aplicar filtros
   */
  applyFilters() {
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.loadData();
  }
  /**
   * Limpiar filtros
   */
  clearFilters() {
    this.filters = {
      search: '',
      id_type_reason: undefined,
      sort_by: 'Name',
      sort_order: 'ASC'
    };
    this.applyFilters();
  }
  /**
   * Cambio de página
   */
  onPageChange(event) {
    // Implementar si se necesita paginación del lado del servidor
  }
  /**
   * Ordenamiento
   */
  onSortChange(event) {
    this.filters.sort_by = event.active;
    this.filters.sort_order = event.direction;
    this.loadData();
  }
  /**
   * Agregar nuevo motivo
   */
  addFileReason() {
    const dialogRef = this.dialog.open(_motivo_edit_dialog_motivo_edit_dialog_component__WEBPACK_IMPORTED_MODULE_0__.MotivoEditDialogComponent, {
      width: '500px',
      data: {
        motivo: undefined,
        isEdit: false
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Diálogo de creación cerrado con éxito, recargando datos...');
        this.loadData();
      }
    });
  }
  /**
   * Editar motivo
   */
  editFileReason(fileReason) {
    const dialogRef = this.dialog.open(_motivo_edit_dialog_motivo_edit_dialog_component__WEBPACK_IMPORTED_MODULE_0__.MotivoEditDialogComponent, {
      width: '500px',
      data: {
        motivo: fileReason,
        isEdit: true
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Diálogo de edición cerrado con éxito, recargando datos...');
        this.loadData();
      }
    });
  }
  /**
   * Eliminar motivo
   */
  deleteFileReason(fileReason) {
    if (confirm(`¿Estás seguro de que quieres eliminar el motivo "${fileReason.Name}"?`)) {
      this.fileReasonService.deleteFileReason(fileReason.Id).subscribe({
        next: response => {
          this.snackBar.open('Motivo eliminado exitosamente', 'Éxito', {
            duration: 2000
          });
          this.loadData();
        },
        error: error => {
          console.error('Error eliminando motivo:', error);
          this.snackBar.open('Error al eliminar el motivo', 'Error', {
            duration: 3000
          });
        }
      });
    }
  }
  /**
   * Cambiar estado del motivo
   */
  toggleStatus(fileReason) {
    this.fileReasonService.toggleStatus(fileReason.Id).subscribe({
      next: response => {
        this.snackBar.open('Estado del motivo cambiado exitosamente', 'Éxito', {
          duration: 2000
        });
        this.loadData();
      },
      error: error => {
        console.error('Error cambiando estado:', error);
        this.snackBar.open('Error al cambiar el estado del motivo', 'Error', {
          duration: 3000
        });
      }
    });
  }
  /**
   * Obtener color del tipo de razón
   */
  getTypeReasonColor(idTypeReason) {
    if (idTypeReason === 4) return 'emerald'; // Aprobación - verde
    if (idTypeReason === 5) return 'amber'; // Rechazo - naranja/ámbar
    return 'gray'; // Tipo desconocido
  }
  /**
   * Refrescar datos
   */
  refreshData() {
    this.loadData();
  }
  /**
   * Verificar si un motivo está habilitado
   */
  isEnabled(enabledValue) {
    // Convertir a string y comparar para manejar diferentes tipos de datos
    const enabledStr = String(enabledValue).trim();
    return enabledStr === '1' || enabledStr === 'true' || enabledValue === true || enabledValue === 1;
  }
  /**
   * Obtener rango de página actual para mostrar en el contador
   */
  getPageRange() {
    if (!this.dataSource.paginator) return '0-0';
    const start = this.dataSource.paginator.pageIndex * this.dataSource.paginator.pageSize + 1;
    const end = Math.min(start + this.dataSource.paginator.pageSize - 1, this.dataSource.filteredData.length);
    return `${start}-${end}`;
  }
  static #_ = this.ɵfac = function MotivosRechazoComponent_Factory(t) {
    return new (t || MotivosRechazoComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_core_services_file_reason_service__WEBPACK_IMPORTED_MODULE_1__.FileReasonService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_4__.MatSnackBar), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_5__.MatDialog));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
    type: MotivosRechazoComponent,
    selectors: [["app-motivos-rechazo"]],
    viewQuery: function MotivosRechazoComponent_Query(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵviewQuery"](_angular_material_paginator__WEBPACK_IMPORTED_MODULE_6__.MatPaginator, 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵviewQuery"](_angular_material_sort__WEBPACK_IMPORTED_MODULE_7__.MatSort, 5);
      }
      if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵloadQuery"]()) && (ctx.paginator = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵloadQuery"]()) && (ctx.sort = _t.first);
      }
    },
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵStandaloneFeature"]],
    decls: 65,
    vars: 18,
    consts: [[1, "p-6"], [1, "flex", "items-center", "justify-between", "mb-4"], [1, "text-3xl", "font-bold", "text-gray-900"], [1, "text-gray-600", "mt-1"], ["mat-raised-button", "", "color", "primary", 1, "flex", "items-center", "gap-2", 3, "click"], [1, "bg-white", "rounded-lg", "shadow-sm", "border", "p-4", "mb-6"], [1, "flex", "items-center", "gap-3"], ["mat-stroked-button", "", "color", "warn", "matTooltip", "Limpiar filtros", 1, "flex", "items-center", "gap-2", 3, "disabled", "click"], ["mat-stroked-button", "", "color", "accent", "matTooltip", "Recargar datos", 1, "flex", "items-center", "gap-2", 3, "disabled", "click"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-4"], ["appearance", "outline", 1, "w-full"], ["matInput", "", "placeholder", "Buscar por nombre...", "maxlength", "500", 3, "ngModel", "ngModelChange"], ["matSuffix", ""], [3, "ngModel", "ngModelChange"], ["value", ""], ["value", "4"], ["value", "5"], [1, "bg-white", "rounded-lg", "shadow-sm", "border", "overflow-hidden"], [1, "relative"], ["class", "absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10", 4, "ngIf"], ["mat-table", "", "matSort", "", 1, "w-full", 2, "line-height", "1", 3, "dataSource"], ["matColumnDef", "id"], ["mat-header-cell", "", "mat-sort-header", "", "class", "w-16 text-center py-1 bg-gray-50 text-xs font-medium text-gray-700 whitespace-nowrap", 4, "matHeaderCellDef"], ["mat-cell", "", "class", "text-xs font-mono text-gray-600 py-0", 4, "matCellDef"], ["matColumnDef", "name"], ["mat-header-cell", "", "mat-sort-header", "", "class", "min-w-0 flex-1 py-1 bg-gray-50 text-xs font-medium text-gray-700 whitespace-nowrap", 4, "matHeaderCellDef"], ["mat-cell", "", "class", "text-xs py-0", 4, "matCellDef"], ["matColumnDef", "idTypeReason"], ["mat-header-cell", "", "mat-sort-header", "", "class", "w-32 text-center py-1 bg-gray-50 text-xs font-medium text-gray-700", 4, "matHeaderCellDef"], ["mat-cell", "", "class", "text-center", 4, "matCellDef"], ["matColumnDef", "enabled"], ["mat-header-cell", "", "mat-sort-header", "", "class", "w-28 text-center py-1 bg-gray-50 text-xs font-medium text-gray-700", 4, "matHeaderCellDef"], ["matColumnDef", "actions"], ["mat-header-cell", "", "class", "w-28 text-center py-1 bg-gray-50 text-xs font-medium text-gray-700", 4, "matHeaderCellDef"], ["mat-cell", "", "class", "text-center py-0", 4, "matCellDef"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", "class", "!min-h-0 !h-8", 4, "matRowDef", "matRowDefColumns"], ["class", "p-8 text-center", 4, "ngIf"], ["showFirstLastButtons", "", 1, "border-t", 3, "pageSizeOptions", "pageSize", "length"], [1, "mt-4", "text-sm", "text-gray-600", "text-center"], [1, "absolute", "inset-0", "bg-white", "bg-opacity-75", "flex", "items-center", "justify-center", "z-10"], ["diameter", "40"], ["mat-header-cell", "", "mat-sort-header", "", 1, "w-16", "text-center", "py-1", "bg-gray-50", "text-xs", "font-medium", "text-gray-700", "whitespace-nowrap"], ["mat-cell", "", 1, "text-xs", "font-mono", "text-gray-600", "py-0"], ["mat-header-cell", "", "mat-sort-header", "", 1, "min-w-0", "flex-1", "py-1", "bg-gray-50", "text-xs", "font-medium", "text-gray-700", "whitespace-nowrap"], ["mat-cell", "", 1, "text-xs", "py-0"], ["mat-header-cell", "", "mat-sort-header", "", 1, "w-32", "text-center", "py-1", "bg-gray-50", "text-xs", "font-medium", "text-gray-700"], ["mat-cell", "", 1, "text-center"], [1, "px-1.5", "py-0.5", "rounded-full", "text-xs", "font-medium", 3, "ngClass"], ["mat-header-cell", "", "mat-sort-header", "", 1, "w-28", "text-center", "py-1", "bg-gray-50", "text-xs", "font-medium", "text-gray-700"], ["mat-header-cell", "", 1, "w-28", "text-center", "py-1", "bg-gray-50", "text-xs", "font-medium", "text-gray-700"], ["mat-cell", "", 1, "text-center", "py-0"], [1, "flex", "gap-0.5", "justify-center", "items-center"], ["mat-icon-button", "", "color", "primary", "matTooltip", "Editar", 1, "!w-6", "!h-6", "!min-h-6", "!p-0", 3, "click"], [1, "!text-sm"], ["mat-icon-button", "", "color", "warn", "matTooltip", "Eliminar", 1, "!w-6", "!h-6", "!min-h-6", "!p-0", 3, "click"], ["mat-header-row", ""], ["mat-row", "", 1, "!min-h-0", "!h-8"], [1, "p-8", "text-center"], [1, "text-gray-400", "text-6xl", "mb-4"], [1, "text-gray-500", "text-lg"], [1, "text-gray-400"]],
    template: function MotivosRechazoComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div")(3, "h1", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4, "Motivos de Aprobaci\u00F3n y Rechazo");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "p", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6, "Gesti\u00F3n de motivos de aprobaci\u00F3n y rechazo para archivos del sistema");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "button", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function MotivosRechazoComponent_Template_button_click_7_listener() {
          return ctx.addFileReason();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](9, "add_circle");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](10, " Nuevo Motivo ");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](11, "div", 5)(12, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](13, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](14, "div", 6)(15, "button", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function MotivosRechazoComponent_Template_button_click_15_listener() {
          return ctx.clearFilters();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](16, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](17, "clear_all");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](18, " Limpiar Filtros ");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](19, "button", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function MotivosRechazoComponent_Template_button_click_19_listener() {
          return ctx.refreshData();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](20, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](21, "refresh");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](22, " Recargar ");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](23, "div", 9)(24, "mat-form-field", 10)(25, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](26, "Buscar motivos");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](27, "input", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function MotivosRechazoComponent_Template_input_ngModelChange_27_listener($event) {
          return ctx.filters.search = $event;
        })("ngModelChange", function MotivosRechazoComponent_Template_input_ngModelChange_27_listener() {
          return ctx.applyFilters();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](28, "mat-icon", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](29, "\uD83D\uDD0D");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](30, "mat-form-field", 10)(31, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](32, "Tipo de Raz\u00F3n");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](33, "mat-select", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function MotivosRechazoComponent_Template_mat_select_ngModelChange_33_listener($event) {
          return ctx.filters.id_type_reason = $event;
        })("ngModelChange", function MotivosRechazoComponent_Template_mat_select_ngModelChange_33_listener() {
          return ctx.applyFilters();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](34, "mat-option", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](35, "Todos los tipos");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](36, "mat-option", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](37, "Aprobaci\u00F3n");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](38, "mat-option", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](39, "Rechazo");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](40, "div", 17)(41, "div", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](42, MotivosRechazoComponent_div_42_Template, 2, 0, "div", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](43, "table", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](44, 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](45, MotivosRechazoComponent_th_45_Template, 2, 0, "th", 22)(46, MotivosRechazoComponent_td_46_Template, 2, 1, "td", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](47, 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](48, MotivosRechazoComponent_th_48_Template, 2, 0, "th", 25)(49, MotivosRechazoComponent_td_49_Template, 2, 1, "td", 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](50, 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](51, MotivosRechazoComponent_th_51_Template, 2, 0, "th", 28)(52, MotivosRechazoComponent_td_52_Template, 3, 2, "td", 29);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](53, 30);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](54, MotivosRechazoComponent_th_54_Template, 2, 0, "th", 31)(55, MotivosRechazoComponent_td_55_Template, 3, 2, "td", 29);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](56, 32);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](57, MotivosRechazoComponent_th_57_Template, 2, 0, "th", 33)(58, MotivosRechazoComponent_td_58_Template, 8, 0, "td", 34);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](59, MotivosRechazoComponent_tr_59_Template, 1, 0, "tr", 35)(60, MotivosRechazoComponent_tr_60_Template, 1, 0, "tr", 36);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](61, MotivosRechazoComponent_div_61_Template, 7, 0, "div", 37);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](62, "mat-paginator", 38);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](63, "div", 39);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](64);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](15);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("disabled", !ctx.filters.search && !ctx.filters.id_type_reason);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("disabled", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("animate-spin", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngModel", ctx.filters.search);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngModel", ctx.filters.id_type_reason);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](9);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("dataSource", ctx.dataSource);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](16);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("matHeaderRowDef", ctx.displayedColumns);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("matRowDefColumns", ctx.displayedColumns);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx.loading && ctx.dataSource.data.length === 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("pageSizeOptions", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](17, _c0))("pageSize", 10)("length", ctx.dataSource.filteredData.length);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate3"](" Mostrando ", ctx.getPageRange(), " de ", ctx.dataSource.filteredData.length, " motivos visibles (", ctx.totalReasons, " total) ");
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_8__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_8__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_8__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.MaxLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgModel, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatTableModule, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatTable, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatHeaderCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatHeaderRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatColumnDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatHeaderCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatHeaderRow, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatRow, _angular_material_paginator__WEBPACK_IMPORTED_MODULE_6__.MatPaginatorModule, _angular_material_paginator__WEBPACK_IMPORTED_MODULE_6__.MatPaginator, _angular_material_sort__WEBPACK_IMPORTED_MODULE_7__.MatSortModule, _angular_material_sort__WEBPACK_IMPORTED_MODULE_7__.MatSort, _angular_material_sort__WEBPACK_IMPORTED_MODULE_7__.MatSortHeader, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_10__.MatFormFieldModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_10__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_10__.MatLabel, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_10__.MatSuffix, _angular_material_input__WEBPACK_IMPORTED_MODULE_11__.MatInputModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_11__.MatInput, _angular_material_select__WEBPACK_IMPORTED_MODULE_12__.MatSelectModule, _angular_material_select__WEBPACK_IMPORTED_MODULE_12__.MatSelect, _angular_material_core__WEBPACK_IMPORTED_MODULE_13__.MatOption, _angular_material_button__WEBPACK_IMPORTED_MODULE_14__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_14__.MatButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_14__.MatIconButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_15__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_15__.MatIcon, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_16__.MatProgressSpinnerModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_16__.MatProgressSpinner, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_17__.MatTooltipModule, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_17__.MatTooltip, _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_4__.MatSnackBarModule, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_5__.MatDialogModule, _angular_material_card__WEBPACK_IMPORTED_MODULE_18__.MatCardModule],
    styles: [".mat-mdc-table[_ngcontent-%COMP%]   .mat-mdc-header-cell[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: #374151;\n  background-color: #f9fafb;\n  border-bottom: 1px solid #e5e7eb;\n}\n.mat-mdc-table[_ngcontent-%COMP%]   .mat-mdc-cell[_ngcontent-%COMP%] {\n  padding: 8px 16px;\n  border-bottom: 1px solid #f3f4f6;\n}\n.mat-mdc-table[_ngcontent-%COMP%]   .mat-mdc-row[_ngcontent-%COMP%]:hover {\n  background-color: #f9fafb;\n}\n\n.type-reason-chip[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  padding: 4px 8px;\n  border-radius: 9999px;\n  font-size: 0.75rem;\n  font-weight: 500;\n  border: 1px solid;\n}\n.type-reason-chip.blue[_ngcontent-%COMP%] {\n  background-color: #dbeafe;\n  border-color: #93c5fd;\n  color: #1e40af;\n}\n.type-reason-chip.green[_ngcontent-%COMP%] {\n  background-color: #d1fae5;\n  border-color: #6ee7b7;\n  color: #047857;\n}\n.type-reason-chip.orange[_ngcontent-%COMP%] {\n  background-color: #fed7aa;\n  border-color: #fdba74;\n  color: #c2410c;\n}\n.type-reason-chip.red[_ngcontent-%COMP%] {\n  background-color: #fecaca;\n  border-color: #f87171;\n  color: #dc2626;\n}\n.type-reason-chip.gray[_ngcontent-%COMP%] {\n  background-color: #f3f4f6;\n  border-color: #d1d5db;\n  color: #374151;\n}\n\n.action-button[_ngcontent-%COMP%] {\n  min-width: 32px;\n  width: 32px;\n  height: 32px;\n  line-height: 32px;\n}\n.action-button[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  font-size: 16px;\n  width: 16px;\n  height: 16px;\n  line-height: 16px;\n}\n\n.stats-card[_ngcontent-%COMP%] {\n  transition: all 0.2s ease-in-out;\n}\n.stats-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);\n}\n\n.filters-container[_ngcontent-%COMP%]   .mat-mdc-form-field[_ngcontent-%COMP%]   .mat-mdc-form-field-wrapper[_ngcontent-%COMP%] {\n  padding-bottom: 0;\n}\n\n@media (max-width: 768px) {\n  .mat-mdc-table[_ngcontent-%COMP%]   .mat-mdc-header-cell[_ngcontent-%COMP%], .mat-mdc-table[_ngcontent-%COMP%]   .mat-mdc-cell[_ngcontent-%COMP%] {\n    padding: 4px 8px;\n    font-size: 0.75rem;\n  }\n  .stats-card[_ngcontent-%COMP%] {\n    padding: 1rem;\n  }\n  .stats-card[_ngcontent-%COMP%]   .text-2xl[_ngcontent-%COMP%] {\n    font-size: 1.25rem;\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvY29uZmlndXJhY2lvbi9tb3Rpdm9zLXJlY2hhem8vbW90aXZvcy1yZWNoYXpvLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdFO0VBQ0UsZ0JBQUE7RUFDQSxjQUFBO0VBQ0EseUJBQUE7RUFDQSxnQ0FBQTtBQUZKO0FBS0U7RUFDRSxpQkFBQTtFQUNBLGdDQUFBO0FBSEo7QUFNRTtFQUNFLHlCQUFBO0FBSko7O0FBU0E7RUFDRSxvQkFBQTtFQUNBLG1CQUFBO0VBQ0EsZ0JBQUE7RUFDQSxxQkFBQTtFQUNBLGtCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxpQkFBQTtBQU5GO0FBUUU7RUFDRSx5QkFBQTtFQUNBLHFCQUFBO0VBQ0EsY0FBQTtBQU5KO0FBU0U7RUFDRSx5QkFBQTtFQUNBLHFCQUFBO0VBQ0EsY0FBQTtBQVBKO0FBVUU7RUFDRSx5QkFBQTtFQUNBLHFCQUFBO0VBQ0EsY0FBQTtBQVJKO0FBV0U7RUFDRSx5QkFBQTtFQUNBLHFCQUFBO0VBQ0EsY0FBQTtBQVRKO0FBWUU7RUFDRSx5QkFBQTtFQUNBLHFCQUFBO0VBQ0EsY0FBQTtBQVZKOztBQWVBO0VBQ0UsZUFBQTtFQUNBLFdBQUE7RUFDQSxZQUFBO0VBQ0EsaUJBQUE7QUFaRjtBQWNFO0VBQ0UsZUFBQTtFQUNBLFdBQUE7RUFDQSxZQUFBO0VBQ0EsaUJBQUE7QUFaSjs7QUFpQkE7RUFDRSxnQ0FBQTtBQWRGO0FBZ0JFO0VBQ0UsMkJBQUE7RUFDQSxxRkFBQTtBQWRKOztBQXFCSTtFQUNFLGlCQUFBO0FBbEJOOztBQXdCQTtFQUVJOztJQUVFLGdCQUFBO0lBQ0Esa0JBQUE7RUF0Qko7RUEwQkE7SUFDRSxhQUFBO0VBeEJGO0VBMEJFO0lBQ0Usa0JBQUE7RUF4Qko7QUFDRiIsInNvdXJjZXNDb250ZW50IjpbIi8vIEVzdGlsb3MgZXNwZWPDg8KtZmljb3MgcGFyYSBlbCBjb21wb25lbnRlIGRlIG1vdGl2b3MgZGUgcmVjaGF6b1xuXG4ubWF0LW1kYy10YWJsZSB7XG4gIC5tYXQtbWRjLWhlYWRlci1jZWxsIHtcbiAgICBmb250LXdlaWdodDogNjAwO1xuICAgIGNvbG9yOiAjMzc0MTUxO1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNmOWZhZmI7XG4gICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNlNWU3ZWI7XG4gIH1cblxuICAubWF0LW1kYy1jZWxsIHtcbiAgICBwYWRkaW5nOiA4cHggMTZweDtcbiAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2YzZjRmNjtcbiAgfVxuXG4gIC5tYXQtbWRjLXJvdzpob3ZlciB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2Y5ZmFmYjtcbiAgfVxufVxuXG4vLyBFc3RpbG9zIHBhcmEgbG9zIGNoaXBzIGRlIHRpcG8gZGUgcmF6w4PCs25cbi50eXBlLXJlYXNvbi1jaGlwIHtcbiAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIHBhZGRpbmc6IDRweCA4cHg7XG4gIGJvcmRlci1yYWRpdXM6IDk5OTlweDtcbiAgZm9udC1zaXplOiAwLjc1cmVtO1xuICBmb250LXdlaWdodDogNTAwO1xuICBib3JkZXI6IDFweCBzb2xpZDtcbiAgXG4gICYuYmx1ZSB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2RiZWFmZTtcbiAgICBib3JkZXItY29sb3I6ICM5M2M1ZmQ7XG4gICAgY29sb3I6ICMxZTQwYWY7XG4gIH1cbiAgXG4gICYuZ3JlZW4ge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNkMWZhZTU7XG4gICAgYm9yZGVyLWNvbG9yOiAjNmVlN2I3O1xuICAgIGNvbG9yOiAjMDQ3ODU3O1xuICB9XG4gIFxuICAmLm9yYW5nZSB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2ZlZDdhYTtcbiAgICBib3JkZXItY29sb3I6ICNmZGJhNzQ7XG4gICAgY29sb3I6ICNjMjQxMGM7XG4gIH1cbiAgXG4gICYucmVkIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmVjYWNhO1xuICAgIGJvcmRlci1jb2xvcjogI2Y4NzE3MTtcbiAgICBjb2xvcjogI2RjMjYyNjtcbiAgfVxuICBcbiAgJi5ncmF5IHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjNmNGY2O1xuICAgIGJvcmRlci1jb2xvcjogI2QxZDVkYjtcbiAgICBjb2xvcjogIzM3NDE1MTtcbiAgfVxufVxuXG4vLyBFc3RpbG9zIHBhcmEgbG9zIGJvdG9uZXMgZGUgYWNjacODwrNuXG4uYWN0aW9uLWJ1dHRvbiB7XG4gIG1pbi13aWR0aDogMzJweDtcbiAgd2lkdGg6IDMycHg7XG4gIGhlaWdodDogMzJweDtcbiAgbGluZS1oZWlnaHQ6IDMycHg7XG4gIFxuICAubWF0LWljb24ge1xuICAgIGZvbnQtc2l6ZTogMTZweDtcbiAgICB3aWR0aDogMTZweDtcbiAgICBoZWlnaHQ6IDE2cHg7XG4gICAgbGluZS1oZWlnaHQ6IDE2cHg7XG4gIH1cbn1cblxuLy8gRXN0aWxvcyBwYXJhIGxhcyB0YXJqZXRhcyBkZSBlc3RhZMODwq1zdGljYXNcbi5zdGF0cy1jYXJkIHtcbiAgdHJhbnNpdGlvbjogYWxsIDAuMnMgZWFzZS1pbi1vdXQ7XG4gIFxuICAmOmhvdmVyIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTJweCk7XG4gICAgYm94LXNoYWRvdzogMCAxMHB4IDI1cHggLTVweCByZ2JhKDAsIDAsIDAsIDAuMSksIDAgMTBweCAxMHB4IC01cHggcmdiYSgwLCAwLCAwLCAwLjA0KTtcbiAgfVxufVxuXG4vLyBFc3RpbG9zIHBhcmEgbG9zIGZpbHRyb3Ncbi5maWx0ZXJzLWNvbnRhaW5lciB7XG4gIC5tYXQtbWRjLWZvcm0tZmllbGQge1xuICAgIC5tYXQtbWRjLWZvcm0tZmllbGQtd3JhcHBlciB7XG4gICAgICBwYWRkaW5nLWJvdHRvbTogMDtcbiAgICB9XG4gIH1cbn1cblxuLy8gRXN0aWxvcyBwYXJhIGxhIHRhYmxhIHJlc3BvbnNpdmFcbkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICAubWF0LW1kYy10YWJsZSB7XG4gICAgLm1hdC1tZGMtaGVhZGVyLWNlbGwsXG4gICAgLm1hdC1tZGMtY2VsbCB7XG4gICAgICBwYWRkaW5nOiA0cHggOHB4O1xuICAgICAgZm9udC1zaXplOiAwLjc1cmVtO1xuICAgIH1cbiAgfVxuICBcbiAgLnN0YXRzLWNhcmQge1xuICAgIHBhZGRpbmc6IDFyZW07XG4gICAgXG4gICAgLnRleHQtMnhsIHtcbiAgICAgIGZvbnQtc2l6ZTogMS4yNXJlbTtcbiAgICB9XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
  });
}

/***/ })

}]);
//# sourceMappingURL=src_app_pages_configuracion_motivos-rechazo_motivos-rechazo_component_ts.js.map