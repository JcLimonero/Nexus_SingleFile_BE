"use strict";
(self["webpackChunkvex"] = self["webpackChunkvex"] || []).push([["src_app_pages_configuracion_catalogos_tipos-operacion_tipos-operacion_component_ts"],{

/***/ 43288:
/*!**********************************************************************************************************************************!*\
  !*** ./src/app/pages/configuracion/catalogos/tipos-operacion/tipo-operacion-edit-dialog/tipo-operacion-edit-dialog.component.ts ***!
  \**********************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TipoOperacionEditDialogComponent: () => (/* binding */ TipoOperacionEditDialogComponent)
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
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _core_services_tipo_operacion_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../core/services/tipo-operacion.service */ 15591);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/core */ 55309);


























function TipoOperacionEditDialogComponent_mat_error_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " El nombre es requerido ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function TipoOperacionEditDialogComponent_mat_error_15_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " El nombre debe tener al menos 3 caracteres ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function TipoOperacionEditDialogComponent_mat_error_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " El nombre no puede exceder 600 caracteres ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function TipoOperacionEditDialogComponent_div_27_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 16)(1, "h3", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "Informaci\u00F3n del Sistema");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "div", 18)(4, "div")(5, "span", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, "ID:");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "span", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "div")(10, "span", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](11, "\u00DAltimo Usuario:");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "span", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "div")(15, "span", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](16, "Fecha Registro:");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](17, "span", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](19, "div")(20, "span", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](21, "\u00DAltima Actualizaci\u00F3n:");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](22, "span", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](23);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r3.data.tipoOperacion.Id);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r3.data.tipoOperacion.LastUserUpdateName || "N/A");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r3.data.tipoOperacion.RegistrationDate || "N/A");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r3.data.tipoOperacion.UpdateDate || "N/A");
  }
}
function TipoOperacionEditDialogComponent_mat_spinner_32_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "mat-spinner", 22);
  }
}
function TipoOperacionEditDialogComponent_mat_icon_33_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r5.data.mode === "edit" ? "save" : "add");
  }
}
class TipoOperacionEditDialogComponent {
  constructor(fb, tipoOperacionService, dialogRef, data, snackBar) {
    this.fb = fb;
    this.tipoOperacionService = tipoOperacionService;
    this.dialogRef = dialogRef;
    this.data = data;
    this.snackBar = snackBar;
    this.loading = false;
  }
  ngOnInit() {
    this.initializeForm();
    this.populateForm();
  }
  initializeForm() {
    this.tipoOperacionForm = this.fb.group({
      Name: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.minLength(3), _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.maxLength(600)]],
      Enabled: ['1', _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required]
    });
  }
  populateForm() {
    if (this.data.tipoOperacion) {
      this.tipoOperacionForm.patchValue({
        Name: this.data.tipoOperacion.Name,
        Enabled: this.data.tipoOperacion.Enabled
      });
    }
  }
  onSubmit() {
    if (this.tipoOperacionForm.valid) {
      this.loading = true;
      if (this.data.mode === 'create') {
        this.createTipoOperacion();
      } else {
        this.updateTipoOperacion();
      }
    }
  }
  createTipoOperacion() {
    const tipoOperacionData = {
      Name: this.tipoOperacionForm.value.Name,
      Enabled: this.tipoOperacionForm.value.Enabled
    };
    this.tipoOperacionService.createTipoOperacion(tipoOperacionData).subscribe({
      next: response => {
        if (response.success) {
          this.snackBar.open('Tipo de operación creado exitosamente', 'Éxito', {
            duration: 2000
          });
          this.dialogRef.close(true);
        } else {
          this.snackBar.open(response.message || 'Error al crear tipo de operación', 'Error', {
            duration: 3000
          });
        }
        this.loading = false;
      },
      error: error => {
        this.snackBar.open('Error al crear tipo de operación', 'Error', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }
  updateTipoOperacion() {
    const tipoOperacionData = {
      Id: this.data.tipoOperacion.Id,
      Name: this.tipoOperacionForm.value.Name,
      Enabled: this.tipoOperacionForm.value.Enabled
    };
    this.tipoOperacionService.updateTipoOperacion(this.data.tipoOperacion.Id, tipoOperacionData).subscribe({
      next: response => {
        if (response.success) {
          this.snackBar.open('Tipo de operación actualizado exitosamente', 'Éxito', {
            duration: 2000
          });
          this.dialogRef.close(true);
        } else {
          this.snackBar.open(response.message || 'Error al actualizar tipo de operación', 'Error', {
            duration: 3000
          });
        }
        this.loading = false;
      },
      error: error => {
        this.snackBar.open('Error al actualizar tipo de operación', 'Error', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }
  onCancel() {
    this.dialogRef.close();
  }
  static #_ = this.ɵfac = function TipoOperacionEditDialogComponent_Factory(t) {
    return new (t || TipoOperacionEditDialogComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_core_services_tipo_operacion_service__WEBPACK_IMPORTED_MODULE_0__.TipoOperacionService), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_3__.MatDialogRef), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_3__.MAT_DIALOG_DATA), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_4__.MatSnackBar));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: TipoOperacionEditDialogComponent,
    selectors: [["app-tipo-operacion-edit-dialog"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵStandaloneFeature"]],
    decls: 35,
    vars: 11,
    consts: [[1, "p-0"], [1, "flex", "items-center", "justify-between", "p-6", "border-b", "border-gray-200"], [1, "text-xl", "font-semibold", "text-gray-900"], ["mat-icon-button", "", "matTooltip", "Cerrar", 3, "click"], [1, "space-y-4", "p-6", 3, "formGroup", "ngSubmit"], ["appearance", "outline", 1, "w-full"], ["matInput", "", "formControlName", "Name", "placeholder", "Ej: CONTADO, FINANCIAMIENTO", "maxlength", "600"], [4, "ngIf"], ["formControlName", "Enabled"], ["value", "1"], ["value", "0"], ["class", "bg-gray-50 p-4 rounded-lg", 4, "ngIf"], [1, "flex", "justify-end", "space-x-3", "pt-4", "border-t"], ["type", "button", "mat-button", "", 3, "disabled", "click"], ["type", "submit", "mat-raised-button", "", "color", "primary", 3, "disabled"], ["diameter", "20", "class", "mr-2", 4, "ngIf"], [1, "bg-gray-50", "p-4", "rounded-lg"], [1, "text-sm", "font-medium", "text-gray-700", "mb-2"], [1, "grid", "grid-cols-2", "gap-4", "text-sm"], [1, "text-gray-500"], [1, "ml-2", "font-mono"], [1, "ml-2"], ["diameter", "20", 1, "mr-2"]],
    template: function TipoOperacionEditDialogComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h2", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "button", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function TipoOperacionEditDialogComponent_Template_button_click_4_listener() {
          return ctx.onCancel();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, "close");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "form", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngSubmit", function TipoOperacionEditDialogComponent_Template_form_ngSubmit_7_listener() {
          return ctx.onSubmit();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "mat-form-field", 5)(9, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](10, "Nombre del Tipo de Operaci\u00F3n");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](11, "input", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "mat-hint");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](13, "Nombre completo del tipo de operaci\u00F3n (m\u00E1ximo 600 caracteres)");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](14, TipoOperacionEditDialogComponent_mat_error_14_Template, 2, 0, "mat-error", 7)(15, TipoOperacionEditDialogComponent_mat_error_15_Template, 2, 0, "mat-error", 7)(16, TipoOperacionEditDialogComponent_mat_error_16_Template, 2, 0, "mat-error", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](17, "mat-form-field", 5)(18, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](19, "Estado");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](20, "mat-select", 8)(21, "mat-option", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](22, "Activo");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](23, "mat-option", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](24, "Inactivo");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](25, "mat-hint");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](26, "Estado actual del tipo de operaci\u00F3n");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](27, TipoOperacionEditDialogComponent_div_27_Template, 24, 4, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](28, "div", 12)(29, "button", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function TipoOperacionEditDialogComponent_Template_button_click_29_listener() {
          return ctx.onCancel();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](30, " Cancelar ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](31, "button", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](32, TipoOperacionEditDialogComponent_mat_spinner_32_Template, 1, 0, "mat-spinner", 15)(33, TipoOperacionEditDialogComponent_mat_icon_33_Template, 2, 1, "mat-icon", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](34);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
      }
      if (rf & 2) {
        let tmp_2_0;
        let tmp_3_0;
        let tmp_4_0;
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx.data.mode === "edit" ? "Editar Tipo de Operaci\u00F3n" : "Nuevo Tipo de Operaci\u00F3n", " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("formGroup", ctx.tipoOperacionForm);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", (tmp_2_0 = ctx.tipoOperacionForm.get("Name")) == null ? null : tmp_2_0.hasError("required"));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", (tmp_3_0 = ctx.tipoOperacionForm.get("Name")) == null ? null : tmp_3_0.hasError("minlength"));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", (tmp_4_0 = ctx.tipoOperacionForm.get("Name")) == null ? null : tmp_4_0.hasError("maxlength"));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.data.mode === "edit");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", ctx.tipoOperacionForm.invalid || ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx.data.mode === "edit" ? "Guardar Cambios" : "Crear Tipo de Operaci\u00F3n", " ");
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_5__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.MaxLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormControlName, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_3__.MatDialogModule, _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_4__.MatSnackBarModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_6__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_6__.MatButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_6__.MatIconButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_7__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_7__.MatIcon, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__.MatFormFieldModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__.MatLabel, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__.MatHint, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__.MatError, _angular_material_input__WEBPACK_IMPORTED_MODULE_9__.MatInputModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_9__.MatInput, _angular_material_select__WEBPACK_IMPORTED_MODULE_10__.MatSelectModule, _angular_material_select__WEBPACK_IMPORTED_MODULE_10__.MatSelect, _angular_material_core__WEBPACK_IMPORTED_MODULE_11__.MatOption, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_12__.MatProgressSpinnerModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_12__.MatProgressSpinner, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_13__.MatTooltipModule, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_13__.MatTooltip],
    styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }),

/***/ 52135:
/*!********************************************************************************************!*\
  !*** ./src/app/pages/configuracion/catalogos/tipos-operacion/tipos-operacion.component.ts ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TiposOperacionComponent: () => (/* binding */ TiposOperacionComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/forms */ 28849);
/* harmony import */ var _angular_material_table__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/table */ 46798);
/* harmony import */ var _angular_material_paginator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/paginator */ 39687);
/* harmony import */ var _angular_material_sort__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/sort */ 87963);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/dialog */ 17401);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/snack-bar */ 49409);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/form-field */ 51333);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/input */ 10026);
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/select */ 96355);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material/progress-spinner */ 33910);
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/material/tooltip */ 60702);
/* harmony import */ var _tipo_operacion_edit_dialog_tipo_operacion_edit_dialog_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tipo-operacion-edit-dialog/tipo-operacion-edit-dialog.component */ 43288);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _core_services_tipo_operacion_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../core/services/tipo-operacion.service */ 15591);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/core */ 55309);































function TiposOperacionComponent_th_43_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "th", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " ID ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function TiposOperacionComponent_td_44_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "td", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const tipoOperacion_r10 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", tipoOperacion_r10.Id, " ");
  }
}
function TiposOperacionComponent_th_46_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "th", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Nombre ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function TiposOperacionComponent_td_47_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "td", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const tipoOperacion_r11 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", tipoOperacion_r11.Name, " ");
  }
}
function TiposOperacionComponent_th_49_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "th", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Estado ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function TiposOperacionComponent_td_50_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "td", 40)(1, "span", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const tipoOperacion_r12 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", tipoOperacion_r12.Enabled === "1" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", tipoOperacion_r12.Enabled === "1" ? "Activo" : "Inactivo", " ");
  }
}
function TiposOperacionComponent_th_52_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "th", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Acciones ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function TiposOperacionComponent_td_53_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "td", 43)(1, "div", 44)(2, "button", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function TiposOperacionComponent_td_53_Template_button_click_2_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r15);
      const tipoOperacion_r13 = restoredCtx.$implicit;
      const ctx_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r14.openEditDialog(tipoOperacion_r13));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "mat-icon", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4, "edit");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "button", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function TiposOperacionComponent_td_53_Template_button_click_5_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r15);
      const tipoOperacion_r13 = restoredCtx.$implicit;
      const ctx_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r16.deleteTipoOperacion(tipoOperacion_r13));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "mat-icon", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](7, "delete");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()();
  }
}
function TiposOperacionComponent_tr_54_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "tr", 48);
  }
}
function TiposOperacionComponent_tr_55_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "tr", 49);
  }
}
const _c0 = () => [10, 25, 50, 100];
class TiposOperacionComponent {
  constructor(tipoOperacionService, dialog, snackBar) {
    this.tipoOperacionService = tipoOperacionService;
    this.dialog = dialog;
    this.snackBar = snackBar;
    this.tiposOperacion = [];
    this.dataSource = new _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatTableDataSource([]);
    this.displayedColumns = ['Id', 'Name', 'Enabled', 'acciones'];
    this.loading = false;
    this.searchTerm = '';
    this.statusFilter = '';
  }
  ngOnInit() {
    this.loadTiposOperacion();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // Configurar filtro personalizado
    this.dataSource.filterPredicate = (data, filter) => {
      const searchTerm = filter.toLowerCase();
      return data.Name.toLowerCase().includes(searchTerm);
    };
  }
  loadTiposOperacion() {
    this.loading = true;
    this.tipoOperacionService.getTiposOperacion().subscribe({
      next: response => {
        if (response.success) {
          this.tiposOperacion = response.data.operationTypes;
          this.dataSource.data = this.tiposOperacion;
          this.applyFilter();
        } else {
          this.snackBar.open(response.message || 'Error al cargar tipos de operación', 'Error', {
            duration: 3000
          });
        }
        this.loading = false;
      },
      error: error => {
        this.snackBar.open('Error al cargar tipos de operación', 'Error', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }
  applyFilter() {
    const filterValue = this.searchTerm.trim();
    // Aplicar filtro de estado si existe
    if (this.statusFilter !== '') {
      const status = this.statusFilter === 'true' ? '1' : '0';
      this.dataSource.data = this.tiposOperacion.filter(tipoOperacion => tipoOperacion.Enabled === status && (filterValue === '' || tipoOperacion.Name.toLowerCase().includes(filterValue.toLowerCase())));
    } else {
      this.dataSource.data = this.tiposOperacion;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    // Reset paginator to first page
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  refreshData() {
    this.loadTiposOperacion();
  }
  clearFilters() {
    this.searchTerm = '';
    this.statusFilter = '';
    this.applyFilter();
    this.snackBar.open('Filtros limpiados', 'Info', {
      duration: 2000
    });
  }
  openCreateDialog() {
    const dialogData = {
      tipoOperacion: {},
      mode: 'create'
    };
    const dialogRef = this.dialog.open(_tipo_operacion_edit_dialog_tipo_operacion_edit_dialog_component__WEBPACK_IMPORTED_MODULE_0__.TipoOperacionEditDialogComponent, {
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
  openEditDialog(tipoOperacion) {
    const dialogData = {
      tipoOperacion: tipoOperacion,
      mode: 'edit'
    };
    const dialogRef = this.dialog.open(_tipo_operacion_edit_dialog_tipo_operacion_edit_dialog_component__WEBPACK_IMPORTED_MODULE_0__.TipoOperacionEditDialogComponent, {
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
  deleteTipoOperacion(tipoOperacion) {
    if (confirm(`¿Estás seguro de que quieres eliminar el tipo de operación "${tipoOperacion.Name}"?`)) {
      this.tipoOperacionService.deleteTipoOperacion(tipoOperacion.Id).subscribe({
        next: response => {
          if (response.success) {
            this.tiposOperacion = this.tiposOperacion.filter(t => t.Id !== tipoOperacion.Id);
            this.applyFilter();
            this.snackBar.open('Tipo de operación eliminado exitosamente', 'Éxito', {
              duration: 2000
            });
          } else {
            this.snackBar.open(response.message || 'Error al eliminar tipo de operación', 'Error', {
              duration: 3000
            });
          }
        },
        error: error => {
          this.snackBar.open('Error al eliminar tipo de operación', 'Error', {
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
  static #_ = this.ɵfac = function TiposOperacionComponent_Factory(t) {
    return new (t || TiposOperacionComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_core_services_tipo_operacion_service__WEBPACK_IMPORTED_MODULE_1__.TipoOperacionService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_4__.MatDialog), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_5__.MatSnackBar));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
    type: TiposOperacionComponent,
    selectors: [["app-tipos-operacion"]],
    viewQuery: function TiposOperacionComponent_Query(rf, ctx) {
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
    decls: 59,
    vars: 16,
    consts: [[1, "p-6"], [1, "flex", "items-center", "justify-between", "mb-4"], [1, "text-3xl", "font-bold", "text-gray-900"], [1, "text-gray-600", "mt-1"], ["mat-raised-button", "", "color", "primary", 1, "flex", "items-center", "gap-2", 3, "click"], [1, "bg-white", "rounded-lg", "shadow-sm", "border", "p-4", "mb-6"], [1, "flex", "items-center", "gap-3"], ["mat-stroked-button", "", "color", "warn", "matTooltip", "Limpiar filtros", 1, "flex", "items-center", "gap-2", 3, "disabled", "click"], ["mat-stroked-button", "", "color", "accent", "matTooltip", "Recargar datos", 1, "flex", "items-center", "gap-2", 3, "disabled", "click"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-4"], ["appearance", "outline", 1, "w-full"], ["matInput", "", "placeholder", "Buscar por nombre...", "maxlength", "100", 3, "ngModel", "ngModelChange"], ["matSuffix", ""], [3, "ngModel", "ngModelChange"], ["value", ""], ["value", "1"], ["value", "0"], [1, "bg-white", "rounded-lg", "shadow-sm", "border", "overflow-hidden"], ["mat-table", "", "matSort", "", 1, "w-full", 2, "line-height", "1", 3, "dataSource"], ["matColumnDef", "Id"], ["mat-header-cell", "", "mat-sort-header", "", "class", "w-16 text-center py-1 bg-gray-50 text-xs font-medium text-gray-700", 4, "matHeaderCellDef"], ["mat-cell", "", "class", "text-xs font-mono text-gray-600 py-0", 4, "matCellDef"], ["matColumnDef", "Name"], ["mat-header-cell", "", "mat-sort-header", "", "class", "min-w-0 flex-1 py-1 bg-gray-50 text-xs font-medium text-gray-700", 4, "matHeaderCellDef"], ["mat-cell", "", "class", "text-xs py-0", 4, "matCellDef"], ["matColumnDef", "Enabled"], ["mat-header-cell", "", "mat-sort-header", "", "class", "w-24 text-center py-1 bg-gray-50 text-xs font-medium text-gray-700", 4, "matHeaderCellDef"], ["mat-cell", "", "class", "text-center", 4, "matCellDef"], ["matColumnDef", "acciones"], ["mat-header-cell", "", "class", "w-28 text-center py-1 bg-gray-50 text-xs font-medium text-gray-700", 4, "matHeaderCellDef"], ["mat-cell", "", "class", "text-center py-0", 4, "matCellDef"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", "class", "!min-h-0 !h-8", 4, "matRowDef", "matRowDefColumns"], ["showFirstLastButtons", "", 1, "border-t", 3, "pageSizeOptions", "pageSize", "length"], [1, "mt-4", "text-sm", "text-gray-600", "text-center"], ["mat-header-cell", "", "mat-sort-header", "", 1, "w-16", "text-center", "py-1", "bg-gray-50", "text-xs", "font-medium", "text-gray-700"], ["mat-cell", "", 1, "text-xs", "font-mono", "text-gray-600", "py-0"], ["mat-header-cell", "", "mat-sort-header", "", 1, "min-w-0", "flex-1", "py-1", "bg-gray-50", "text-xs", "font-medium", "text-gray-700"], ["mat-cell", "", 1, "text-xs", "py-0"], ["mat-header-cell", "", "mat-sort-header", "", 1, "w-24", "text-center", "py-1", "bg-gray-50", "text-xs", "font-medium", "text-gray-700"], ["mat-cell", "", 1, "text-center"], [1, "px-1.5", "py-0.5", "rounded-full", "text-xs", "font-medium", 3, "ngClass"], ["mat-header-cell", "", 1, "w-28", "text-center", "py-1", "bg-gray-50", "text-xs", "font-medium", "text-gray-700"], ["mat-cell", "", 1, "text-center", "py-0"], [1, "flex", "gap-0.5", "justify-center", "items-center"], ["mat-icon-button", "", "color", "primary", "matTooltip", "Editar", 1, "!w-6", "!h-6", "!min-h-6", "!p-0", 3, "click"], [1, "!text-sm"], ["mat-icon-button", "", "color", "warn", "matTooltip", "Eliminar", 1, "!w-6", "!h-6", "!min-h-6", "!p-0", 3, "click"], ["mat-header-row", ""], ["mat-row", "", 1, "!min-h-0", "!h-8"]],
    template: function TiposOperacionComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div")(3, "h1", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4, "Gesti\u00F3n de Tipos de Operaci\u00F3n");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "p", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6, "Administra los tipos de operaci\u00F3n del sistema");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "button", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function TiposOperacionComponent_Template_button_click_7_listener() {
          return ctx.openCreateDialog();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](9, "add_circle");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](10, " Nuevo Tipo de Operaci\u00F3n ");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](11, "div", 5)(12, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](13, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](14, "div", 6)(15, "button", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function TiposOperacionComponent_Template_button_click_15_listener() {
          return ctx.clearFilters();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](16, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](17, "clear_all");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](18, " Limpiar Filtros ");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](19, "button", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function TiposOperacionComponent_Template_button_click_19_listener() {
          return ctx.refreshData();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](20, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](21, "refresh");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](22, " Recargar ");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](23, "div", 9)(24, "mat-form-field", 10)(25, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](26, "Buscar tipos de operaci\u00F3n");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](27, "input", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function TiposOperacionComponent_Template_input_ngModelChange_27_listener($event) {
          return ctx.searchTerm = $event;
        })("ngModelChange", function TiposOperacionComponent_Template_input_ngModelChange_27_listener() {
          return ctx.applyFilter();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](28, "mat-icon", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](29, "\uD83D\uDD0D");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](30, "mat-form-field", 10)(31, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](32, "Estado");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](33, "mat-select", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function TiposOperacionComponent_Template_mat_select_ngModelChange_33_listener($event) {
          return ctx.statusFilter = $event;
        })("ngModelChange", function TiposOperacionComponent_Template_mat_select_ngModelChange_33_listener() {
          return ctx.applyFilter();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](34, "mat-option", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](35, "Todos");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](36, "mat-option", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](37, "Activos");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](38, "mat-option", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](39, "Inactivos");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](40, "div", 17)(41, "table", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](42, 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](43, TiposOperacionComponent_th_43_Template, 2, 0, "th", 20)(44, TiposOperacionComponent_td_44_Template, 2, 1, "td", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](45, 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](46, TiposOperacionComponent_th_46_Template, 2, 0, "th", 23)(47, TiposOperacionComponent_td_47_Template, 2, 1, "td", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](48, 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](49, TiposOperacionComponent_th_49_Template, 2, 0, "th", 26)(50, TiposOperacionComponent_td_50_Template, 3, 2, "td", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](51, 28);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](52, TiposOperacionComponent_th_52_Template, 2, 0, "th", 29)(53, TiposOperacionComponent_td_53_Template, 8, 0, "td", 30);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](54, TiposOperacionComponent_tr_54_Template, 1, 0, "tr", 31)(55, TiposOperacionComponent_tr_55_Template, 1, 0, "tr", 32);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](56, "mat-paginator", 33);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](57, "div", 34);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](58);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](15);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("disabled", !ctx.searchTerm && !ctx.statusFilter);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("disabled", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("animate-spin", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngModel", ctx.searchTerm);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngModel", ctx.statusFilter);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("dataSource", ctx.dataSource);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](13);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("matHeaderRowDef", ctx.displayedColumns);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("matRowDefColumns", ctx.displayedColumns);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("pageSizeOptions", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](15, _c0))("pageSize", 10)("length", ctx.dataSource.filteredData.length);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate3"](" Mostrando ", ctx.getPageRange(), " de ", ctx.dataSource.filteredData.length, " tipos de operaci\u00F3n visibles (", ctx.tiposOperacion.length, " total) ");
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_8__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_8__.NgClass, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.MaxLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgModel, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatTableModule, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatTable, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatHeaderCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatHeaderRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatColumnDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatHeaderCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatHeaderRow, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatRow, _angular_material_paginator__WEBPACK_IMPORTED_MODULE_6__.MatPaginatorModule, _angular_material_paginator__WEBPACK_IMPORTED_MODULE_6__.MatPaginator, _angular_material_sort__WEBPACK_IMPORTED_MODULE_7__.MatSortModule, _angular_material_sort__WEBPACK_IMPORTED_MODULE_7__.MatSort, _angular_material_sort__WEBPACK_IMPORTED_MODULE_7__.MatSortHeader, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_4__.MatDialogModule, _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_5__.MatSnackBarModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_10__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_10__.MatButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_10__.MatIconButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_11__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_11__.MatIcon, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_12__.MatFormFieldModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_12__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_12__.MatLabel, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_12__.MatSuffix, _angular_material_input__WEBPACK_IMPORTED_MODULE_13__.MatInputModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_13__.MatInput, _angular_material_select__WEBPACK_IMPORTED_MODULE_14__.MatSelectModule, _angular_material_select__WEBPACK_IMPORTED_MODULE_14__.MatSelect, _angular_material_core__WEBPACK_IMPORTED_MODULE_15__.MatOption, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_16__.MatProgressSpinnerModule, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_17__.MatTooltipModule, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_17__.MatTooltip],
    styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ })

}]);
//# sourceMappingURL=src_app_pages_configuracion_catalogos_tipos-operacion_tipos-operacion_component_ts.js.map