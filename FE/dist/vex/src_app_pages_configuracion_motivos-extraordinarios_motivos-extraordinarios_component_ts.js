"use strict";
(self["webpackChunkvex"] = self["webpackChunkvex"] || []).push([["src_app_pages_configuracion_motivos-extraordinarios_motivos-extraordinarios_component_ts"],{

/***/ 62761:
/*!**********************************************************************************************************************************************!*\
  !*** ./src/app/pages/configuracion/motivos-extraordinarios/motivo-extraordinario-edit-dialog/motivo-extraordinario-edit-dialog.component.ts ***!
  \**********************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MotivoExtraordinarioEditDialogComponent: () => (/* binding */ MotivoExtraordinarioEditDialogComponent)
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























function MotivoExtraordinarioEditDialogComponent_mat_error_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "El nombre del motivo es requerido");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function MotivoExtraordinarioEditDialogComponent_mat_option_19_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-option", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const option_r6 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("value", option_r6.value);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", option_r6.label, " ");
  }
}
function MotivoExtraordinarioEditDialogComponent_mat_error_20_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "El tipo de raz\u00F3n es requerido");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function MotivoExtraordinarioEditDialogComponent_mat_error_29_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "El estado es requerido");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function MotivoExtraordinarioEditDialogComponent_mat_spinner_34_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "mat-spinner", 17);
  }
}
function MotivoExtraordinarioEditDialogComponent_mat_icon_35_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-icon", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx_r5.isEdit ? "save" : "add", " ");
  }
}
class MotivoExtraordinarioEditDialogComponent {
  constructor(dialogRef, data, fileExtraordinaryReasonService, snackBar) {
    this.dialogRef = dialogRef;
    this.data = data;
    this.fileExtraordinaryReasonService = fileExtraordinaryReasonService;
    this.snackBar = snackBar;
    this.motivo = {};
    this.isEdit = false;
    this.loading = false;
    this.tipoRazonOptions = [{
      value: 2,
      label: 'Excepción'
    }, {
      value: 1,
      label: 'Cancelación'
    }];
    this.isEdit = data.isEdit;
    if (data.motivo) {
      this.motivo = {
        ...data.motivo,
        // Asegurar que los valores numéricos sean del tipo correcto
        IdTypeReason: Number(data.motivo.IdTypeReason),
        Enabled: Number(data.motivo.Enabled),
        // Formatear nombre existente
        Name: this.formatName(data.motivo.Name || '')
      };
    }
  }
  ngOnInit() {
    if (!this.isEdit) {
      this.motivo = {
        Name: '',
        IdTypeReason: 2,
        Enabled: 1
      };
    }
  }
  saveMotivo() {
    if (!this.motivo.Name || !this.motivo.Name.trim()) {
      this.snackBar.open('El nombre del motivo es requerido', 'Error', {
        duration: 3000
      });
      return;
    }
    // Convertir nombre a formato de mayúsculas y minúsculas
    this.motivo.Name = this.formatName(this.motivo.Name.trim());
    this.loading = true;
    if (this.isEdit) {
      this.fileExtraordinaryReasonService.updateFileExtraordinaryReason(this.motivo.Id, this.motivo).subscribe({
        next: response => {
          this.snackBar.open('Motivo extraordinario actualizado exitosamente', 'Éxito', {
            duration: 2000
          });
          this.dialogRef.close(true);
        },
        error: error => {
          console.error('Error actualizando motivo extraordinario:', error);
          // Obtener mensaje de error más descriptivo
          let errorMessage = 'Error al actualizar el motivo extraordinario';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          // Mostrar mensaje de error completo
          this.snackBar.open(errorMessage, 'Error', {
            duration: 5000
          });
          // Log adicional para debug
          if (error.error && error.error.debug_info) {
            console.log('Debug info del error:', error.error.debug_info);
          }
          this.loading = false;
        }
      });
    } else {
      this.fileExtraordinaryReasonService.createFileExtraordinaryReason(this.motivo).subscribe({
        next: response => {
          this.snackBar.open('Motivo extraordinario creado exitosamente', 'Éxito', {
            duration: 2000
          });
          this.dialogRef.close(true);
        },
        error: error => {
          console.error('Error creando motivo extraordinario:', error);
          // Obtener mensaje de error más descriptivo
          let errorMessage = 'Error al crear el motivo extraordinario';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          // Mostrar mensaje de error completo
          this.snackBar.open(errorMessage, 'Error', {
            duration: 5000
          });
          // Log adicional para debug
          if (error.error && error.error.debug_info) {
            console.log('Debug info del error:', error.error.debug_info);
          }
          this.loading = false;
        }
      });
    }
  }
  cancel() {
    this.dialogRef.close();
  }
  /**
   * Formatear nombre a mayúsculas y minúsculas
   * Ejemplo: "hola mundo" -> "Hola Mundo"
   */
  formatName(name) {
    if (!name) return name;
    // Dividir por espacios y convertir cada palabra
    return name.toLowerCase().split(' ').map(word => {
      if (word.length === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  }
  static #_ = this.ɵfac = function MotivoExtraordinarioEditDialogComponent_Factory(t) {
    return new (t || MotivoExtraordinarioEditDialogComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__.MatDialogRef), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__.MAT_DIALOG_DATA), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_core_services_file_extraordinary_reason_service__WEBPACK_IMPORTED_MODULE_0__.FileExtraordinaryReasonService), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_3__.MatSnackBar));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: MotivoExtraordinarioEditDialogComponent,
    selectors: [["app-motivo-extraordinario-edit-dialog"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵStandaloneFeature"]],
    decls: 37,
    vars: 15,
    consts: [[1, "p-6"], [1, "flex", "items-center", "justify-between", "mb-6"], [1, "text-xl", "font-semibold", "text-gray-900"], ["mat-icon-button", "", 1, "text-gray-400", "hover:text-gray-600", 3, "click"], [1, "space-y-4", 3, "ngSubmit"], [1, "w-full"], ["matInput", "", "name", "name", "placeholder", "Ingrese el nombre del motivo", "required", "", "maxlength", "500", 3, "ngModel", "ngModelChange"], [4, "ngIf"], ["name", "idTypeReason", "required", "", 3, "ngModel", "ngModelChange"], [3, "value", 4, "ngFor", "ngForOf"], ["name", "enabled", "required", "", 3, "ngModel", "ngModelChange"], [3, "value"], [1, "flex", "justify-end", "gap-3", "pt-4"], ["type", "button", "mat-stroked-button", "", 3, "disabled", "click"], ["type", "submit", "mat-raised-button", "", "color", "primary", 3, "disabled"], ["diameter", "20", "class", "mr-2", 4, "ngIf"], ["class", "mr-2", 4, "ngIf"], ["diameter", "20", 1, "mr-2"], [1, "mr-2"]],
    template: function MotivoExtraordinarioEditDialogComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h2", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "button", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function MotivoExtraordinarioEditDialogComponent_Template_button_click_4_listener() {
          return ctx.cancel();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, "close");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "form", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngSubmit", function MotivoExtraordinarioEditDialogComponent_Template_form_ngSubmit_7_listener() {
          return ctx.saveMotivo();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "mat-form-field", 5)(9, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](10, "Nombre del Motivo");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "input", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function MotivoExtraordinarioEditDialogComponent_Template_input_ngModelChange_11_listener($event) {
          return ctx.motivo.Name = $event;
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "mat-hint");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](13, "M\u00E1ximo 500 caracteres");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](14, MotivoExtraordinarioEditDialogComponent_mat_error_14_Template, 2, 0, "mat-error", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](15, "mat-form-field", 5)(16, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](17, "Tipo de Raz\u00F3n");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](18, "mat-select", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function MotivoExtraordinarioEditDialogComponent_Template_mat_select_ngModelChange_18_listener($event) {
          return ctx.motivo.IdTypeReason = $event;
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](19, MotivoExtraordinarioEditDialogComponent_mat_option_19_Template, 2, 2, "mat-option", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](20, MotivoExtraordinarioEditDialogComponent_mat_error_20_Template, 2, 0, "mat-error", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](21, "mat-form-field", 5)(22, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](23, "Estado");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](24, "mat-select", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function MotivoExtraordinarioEditDialogComponent_Template_mat_select_ngModelChange_24_listener($event) {
          return ctx.motivo.Enabled = $event;
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](25, "mat-option", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](26, "Habilitado");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](27, "mat-option", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](28, "Deshabilitado");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](29, MotivoExtraordinarioEditDialogComponent_mat_error_29_Template, 2, 0, "mat-error", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](30, "div", 12)(31, "button", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function MotivoExtraordinarioEditDialogComponent_Template_button_click_31_listener() {
          return ctx.cancel();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](32, " Cancelar ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](33, "button", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](34, MotivoExtraordinarioEditDialogComponent_mat_spinner_34_Template, 1, 0, "mat-spinner", 15)(35, MotivoExtraordinarioEditDialogComponent_mat_icon_35_Template, 2, 1, "mat-icon", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](36);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx.isEdit ? "Editar" : "Crear", " Motivo Extraordinario ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx.motivo.Name);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.motivo.Name);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx.motivo.IdTypeReason);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.tipoRazonOptions);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.motivo.IdTypeReason);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx.motivo.Enabled);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("value", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("value", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.motivo.Enabled === undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", ctx.loading || !(ctx.motivo.Name == null ? null : ctx.motivo.Name.trim()));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx.isEdit ? "Actualizar" : "Crear", " ");
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_5__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.MaxLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgModel, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgForm, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__.MatDialogModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__.MatFormFieldModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__.MatLabel, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__.MatHint, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__.MatError, _angular_material_input__WEBPACK_IMPORTED_MODULE_7__.MatInputModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_7__.MatInput, _angular_material_select__WEBPACK_IMPORTED_MODULE_8__.MatSelectModule, _angular_material_select__WEBPACK_IMPORTED_MODULE_8__.MatSelect, _angular_material_core__WEBPACK_IMPORTED_MODULE_9__.MatOption, _angular_material_button__WEBPACK_IMPORTED_MODULE_10__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_10__.MatButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_10__.MatIconButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_11__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_11__.MatIcon, _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_3__.MatSnackBarModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_12__.MatProgressSpinnerModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_12__.MatProgressSpinner],
    styles: [".mat-mdc-form-field[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.mat-mdc-form-field[_ngcontent-%COMP%]   .mat-mdc-form-field-wrapper[_ngcontent-%COMP%] {\n  padding-bottom: 0;\n}\n\n.mat-mdc-button[_ngcontent-%COMP%] {\n  min-width: 100px;\n}\n.mat-mdc-button.mat-mdc-raised-button[_ngcontent-%COMP%] {\n  padding: 8px 24px;\n}\n\n.mat-mdc-progress-spinner[_ngcontent-%COMP%] {\n  display: inline-block;\n}\n\n@media (max-width: 600px) {\n  .p-6[_ngcontent-%COMP%] {\n    padding: 1rem;\n  }\n  .flex.justify-end[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 0.5rem;\n  }\n  .mat-mdc-button[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n}\n.form-field[_ngcontent-%COMP%] {\n  transition: all 0.3s ease;\n}\n.form-field[_ngcontent-%COMP%]:focus-within {\n  transform: translateY(-2px);\n}\n\nh2[_ngcontent-%COMP%] {\n  color: #1f2937;\n  font-weight: 600;\n}\n\n.mat-mdc-form-field-hint[_ngcontent-%COMP%], .mat-mdc-form-field-error[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n}\n\n.mat-mdc-form-field-error[_ngcontent-%COMP%] {\n  color: #dc2626;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvY29uZmlndXJhY2lvbi9tb3Rpdm9zLWV4dHJhb3JkaW5hcmlvcy9tb3Rpdm8tZXh0cmFvcmRpbmFyaW8tZWRpdC1kaWFsb2cvbW90aXZvLWV4dHJhb3JkaW5hcmlvLWVkaXQtZGlhbG9nLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBO0VBQ0UsV0FBQTtBQUZGO0FBSUU7RUFDRSxpQkFBQTtBQUZKOztBQU9BO0VBQ0UsZ0JBQUE7QUFKRjtBQU1FO0VBQ0UsaUJBQUE7QUFKSjs7QUFTQTtFQUNFLHFCQUFBO0FBTkY7O0FBVUE7RUFDRTtJQUNFLGFBQUE7RUFQRjtFQVVBO0lBQ0Usc0JBQUE7SUFDQSxXQUFBO0VBUkY7RUFXQTtJQUNFLFdBQUE7RUFURjtBQUNGO0FBYUE7RUFDRSx5QkFBQTtBQVhGO0FBYUU7RUFDRSwyQkFBQTtBQVhKOztBQWdCQTtFQUNFLGNBQUE7RUFDQSxnQkFBQTtBQWJGOztBQWlCQTs7RUFFRSxrQkFBQTtBQWRGOztBQWlCQTtFQUNFLGNBQUE7QUFkRiIsInNvdXJjZXNDb250ZW50IjpbIi8vIEVzdGlsb3MgcGFyYSBlbCBkacODwqFsb2dvIGRlIGVkaWNpw4PCs24gZGUgbW90aXZvcyBleHRyYW9yZGluYXJpb3NcblxuLy8gUGVyc29uYWxpemFjacODwrNuIGRlIGNhbXBvcyBkZSBmb3JtdWxhcmlvXG4ubWF0LW1kYy1mb3JtLWZpZWxkIHtcbiAgd2lkdGg6IDEwMCU7XG4gIFxuICAubWF0LW1kYy1mb3JtLWZpZWxkLXdyYXBwZXIge1xuICAgIHBhZGRpbmctYm90dG9tOiAwO1xuICB9XG59XG5cbi8vIEVzdGlsb3MgcGFyYSBsb3MgYm90b25lc1xuLm1hdC1tZGMtYnV0dG9uIHtcbiAgbWluLXdpZHRoOiAxMDBweDtcbiAgXG4gICYubWF0LW1kYy1yYWlzZWQtYnV0dG9uIHtcbiAgICBwYWRkaW5nOiA4cHggMjRweDtcbiAgfVxufVxuXG4vLyBFc3RpbG9zIHBhcmEgZWwgc3Bpbm5lciBkZSBjYXJnYVxuLm1hdC1tZGMtcHJvZ3Jlc3Mtc3Bpbm5lciB7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbn1cblxuLy8gUmVzcG9uc2l2ZSBhZGp1c3RtZW50c1xuQG1lZGlhIChtYXgtd2lkdGg6IDYwMHB4KSB7XG4gIC5wLTYge1xuICAgIHBhZGRpbmc6IDFyZW07XG4gIH1cbiAgXG4gIC5mbGV4Lmp1c3RpZnktZW5kIHtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGdhcDogMC41cmVtO1xuICB9XG4gIFxuICAubWF0LW1kYy1idXR0b24ge1xuICAgIHdpZHRoOiAxMDAlO1xuICB9XG59XG5cbi8vIEFuaW1hY2lvbmVzXG4uZm9ybS1maWVsZCB7XG4gIHRyYW5zaXRpb246IGFsbCAwLjNzIGVhc2U7XG4gIFxuICAmOmZvY3VzLXdpdGhpbiB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0ycHgpO1xuICB9XG59XG5cbi8vIEVzdGlsb3MgcGFyYSBlbCBoZWFkZXJcbmgyIHtcbiAgY29sb3I6ICMxZjI5Mzc7XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG59XG5cbi8vIEVzdGlsb3MgcGFyYSBsb3MgaGludHMgeSBlcnJvcmVzXG4ubWF0LW1kYy1mb3JtLWZpZWxkLWhpbnQsXG4ubWF0LW1kYy1mb3JtLWZpZWxkLWVycm9yIHtcbiAgZm9udC1zaXplOiAwLjc1cmVtO1xufVxuXG4ubWF0LW1kYy1mb3JtLWZpZWxkLWVycm9yIHtcbiAgY29sb3I6ICNkYzI2MjY7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
  });
}

/***/ }),

/***/ 34801:
/*!**************************************************************************************************!*\
  !*** ./src/app/pages/configuracion/motivos-extraordinarios/motivos-extraordinarios.component.ts ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MotivosExtraordinariosComponent: () => (/* binding */ MotivosExtraordinariosComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/forms */ 28849);
/* harmony import */ var _angular_material_table__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/table */ 46798);
/* harmony import */ var _angular_material_paginator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/paginator */ 39687);
/* harmony import */ var _angular_material_sort__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/sort */ 87963);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/snack-bar */ 49409);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/dialog */ 17401);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/form-field */ 51333);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/input */ 10026);
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/select */ 96355);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material/progress-spinner */ 33910);
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/material/tooltip */ 60702);
/* harmony import */ var _angular_material_chips__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/material/chips */ 21757);
/* harmony import */ var _motivo_extraordinario_edit_dialog_motivo_extraordinario_edit_dialog_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./motivo-extraordinario-edit-dialog/motivo-extraordinario-edit-dialog.component */ 62761);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var src_app_core_services_file_extraordinary_reason_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/core/services/file-extraordinary-reason.service */ 2554);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/core */ 55309);

































function MotivosExtraordinariosComponent_div_41_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "mat-spinner", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function MotivosExtraordinariosComponent_table_42_th_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "th", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " ID ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function MotivosExtraordinariosComponent_table_42_td_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "td", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const reason_r15 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", reason_r15.Id, " ");
  }
}
function MotivosExtraordinariosComponent_table_42_th_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "th", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Nombre ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function MotivosExtraordinariosComponent_table_42_td_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "td", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const reason_r16 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", reason_r16.Name, " ");
  }
}
function MotivosExtraordinariosComponent_table_42_th_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "th", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Tipo de Raz\u00F3n ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function MotivosExtraordinariosComponent_table_42_td_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "td", 46)(1, "span", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const reason_r17 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", reason_r17.IdTypeReason == 2 ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", reason_r17.TypeReasonLabel, " ");
  }
}
function MotivosExtraordinariosComponent_table_42_th_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "th", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Estado ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function MotivosExtraordinariosComponent_table_42_td_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "td", 46)(1, "span", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const reason_r18 = ctx.$implicit;
    const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", ctx_r10.isEnabled(reason_r18.Enabled) ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", ctx_r10.isEnabled(reason_r18.Enabled) ? "Habilitado" : "Deshabilitado", " ");
  }
}
function MotivosExtraordinariosComponent_table_42_th_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "th", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Acciones ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function MotivosExtraordinariosComponent_table_42_td_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "td", 46)(1, "div", 50)(2, "button", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function MotivosExtraordinariosComponent_table_42_td_15_Template_button_click_2_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r21);
      const reason_r19 = restoredCtx.$implicit;
      const ctx_r20 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r20.editFileExtraordinaryReason(reason_r19));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "mat-icon", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4, "edit");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "button", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function MotivosExtraordinariosComponent_table_42_td_15_Template_button_click_5_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r21);
      const reason_r19 = restoredCtx.$implicit;
      const ctx_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r22.deleteFileExtraordinaryReason(reason_r19));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "mat-icon", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](7, "delete");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()();
  }
}
function MotivosExtraordinariosComponent_table_42_tr_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "tr", 54);
  }
}
function MotivosExtraordinariosComponent_table_42_tr_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "tr", 55);
  }
}
function MotivosExtraordinariosComponent_table_42_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "table", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](1, 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, MotivosExtraordinariosComponent_table_42_th_2_Template, 2, 0, "th", 27)(3, MotivosExtraordinariosComponent_table_42_td_3_Template, 2, 1, "td", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](4, 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](5, MotivosExtraordinariosComponent_table_42_th_5_Template, 2, 0, "th", 30)(6, MotivosExtraordinariosComponent_table_42_td_6_Template, 2, 1, "td", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](7, 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](8, MotivosExtraordinariosComponent_table_42_th_8_Template, 2, 0, "th", 33)(9, MotivosExtraordinariosComponent_table_42_td_9_Template, 3, 2, "td", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](10, 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](11, MotivosExtraordinariosComponent_table_42_th_11_Template, 2, 0, "th", 36)(12, MotivosExtraordinariosComponent_table_42_td_12_Template, 3, 2, "td", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](13, 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](14, MotivosExtraordinariosComponent_table_42_th_14_Template, 2, 0, "th", 38)(15, MotivosExtraordinariosComponent_table_42_td_15_Template, 8, 0, "td", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](16, MotivosExtraordinariosComponent_table_42_tr_16_Template, 1, 0, "tr", 39)(17, MotivosExtraordinariosComponent_table_42_tr_17_Template, 1, 0, "tr", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("dataSource", ctx_r1.dataSource);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](16);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("matHeaderRowDef", ctx_r1.displayedColumns);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("matRowDefColumns", ctx_r1.displayedColumns);
  }
}
function MotivosExtraordinariosComponent_div_43_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 56)(1, "mat-icon", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2, "inbox");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "p", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4, "No se encontraron motivos extraordinarios");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "p", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6, "Intenta ajustar los filtros o crear un nuevo motivo");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
}
const _c0 = () => [10, 25, 50, 100];
class MotivosExtraordinariosComponent {
  constructor(fileExtraordinaryReasonService, snackBar, dialog) {
    this.fileExtraordinaryReasonService = fileExtraordinaryReasonService;
    this.snackBar = snackBar;
    this.dialog = dialog;
    this.displayedColumns = ['id', 'name', 'idTypeReason', 'enabled', 'actions'];
    this.dataSource = new _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatTableDataSource();
    this.loading = false;
    this.totalItems = 0;
    this.filters = {
      search: '',
      id_type_reason: undefined,
      sort_by: 'Name',
      sort_order: 'ASC',
      limit: 0,
      offset: 0
    };
  }
  ngOnInit() {
    this.loadData();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // Configurar filtro personalizado para búsqueda
    this.dataSource.filterPredicate = (data, filter) => {
      const searchTerm = filter.toLowerCase();
      return data.Name.toLowerCase().includes(searchTerm);
    };
  }
  /**
   * Cargar datos de motivos extraordinarios
   */
  loadData() {
    this.loading = true;
    // Crear filtros para obtener todos los datos
    const loadFilters = {
      ...this.filters,
      limit: 0,
      offset: 0
    };
    this.fileExtraordinaryReasonService.getFileExtraordinaryReasons(loadFilters).subscribe({
      next: response => {
        this.dataSource.data = response.data.file_extraordinary_reasons;
        this.totalItems = response.data.total;
        // Aplicar filtros locales
        this.applyLocalFilters();
        this.loading = false;
      },
      error: error => {
        console.error('Error cargando motivos extraordinarios:', error);
        this.snackBar.open('Error al cargar los motivos extraordinarios', 'Error', {
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
    this.applyLocalFilters();
  }
  /**
   * Aplicar filtros locales (paginación del cliente)
   */
  applyLocalFilters() {
    // Aplicar filtro de búsqueda
    if (this.filters.search) {
      this.dataSource.filter = this.filters.search.trim().toLowerCase();
    } else {
      this.dataSource.filter = '';
    }
    // Aplicar filtro de tipo de razón
    if (this.filters.id_type_reason !== undefined) {
      this.dataSource.data = this.dataSource.data.filter(reason => reason.IdTypeReason === this.filters.id_type_reason);
    }
    // Resetear paginador a primera página
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  /**
   * Resetear paginación
   */
  resetPagination() {
    this.filters.offset = 0;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
  }
  /**
   * Verificar estado actual de la paginación
   */
  getCurrentPaginationState() {
    if (!this.paginator) return null;
    return {
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize,
      length: this.paginator.length,
      filters: {
        ...this.filters
      },
      totalItems: this.totalItems
    };
  }
  /**
   * Limpiar filtros
   */
  clearFilters() {
    this.filters = {
      search: '',
      id_type_reason: undefined,
      sort_by: 'Name',
      sort_order: 'ASC',
      limit: 0,
      offset: 0
    };
    // Aplicar filtros locales
    this.applyLocalFilters();
  }
  // Nota: onPageChange ya no se necesita con paginación del cliente
  /**
   * Manejar cambio de ordenamiento
   */
  onSortChange(event) {
    this.filters.sort_by = event.active;
    this.filters.sort_order = event.direction;
    this.loadData();
  }
  /**
   * Agregar nuevo motivo extraordinario
   */
  addFileExtraordinaryReason() {
    const dialogRef = this.dialog.open(_motivo_extraordinario_edit_dialog_motivo_extraordinario_edit_dialog_component__WEBPACK_IMPORTED_MODULE_0__.MotivoExtraordinarioEditDialogComponent, {
      width: '500px',
      data: {
        motivo: undefined,
        isEdit: false
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }
  /**
   * Editar motivo extraordinario
   */
  editFileExtraordinaryReason(fileExtraordinaryReason) {
    const dialogRef = this.dialog.open(_motivo_extraordinario_edit_dialog_motivo_extraordinario_edit_dialog_component__WEBPACK_IMPORTED_MODULE_0__.MotivoExtraordinarioEditDialogComponent, {
      width: '500px',
      data: {
        motivo: fileExtraordinaryReason,
        isEdit: true
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }
  /**
   * Eliminar motivo extraordinario
   */
  deleteFileExtraordinaryReason(fileExtraordinaryReason) {
    if (confirm(`¿Estás seguro de que quieres eliminar el motivo "${fileExtraordinaryReason.Name}"?`)) {
      this.fileExtraordinaryReasonService.deleteFileExtraordinaryReason(fileExtraordinaryReason.Id).subscribe({
        next: response => {
          this.snackBar.open('Motivo extraordinario eliminado exitosamente', 'Éxito', {
            duration: 2000
          });
          this.loadData();
        },
        error: error => {
          console.error('Error eliminando motivo extraordinario:', error);
          this.snackBar.open('Error al eliminar el motivo extraordinario', 'Error', {
            duration: 3000
          });
        }
      });
    }
  }
  /**
   * Cambiar estado del motivo extraordinario
   */
  toggleStatus(fileExtraordinaryReason) {
    this.fileExtraordinaryReasonService.toggleStatus(fileExtraordinaryReason.Id).subscribe({
      next: response => {
        this.snackBar.open('Estado del motivo extraordinario cambiado exitosamente', 'Éxito', {
          duration: 2000
        });
        this.loadData();
      },
      error: error => {
        console.error('Error cambiando estado:', error);
        this.snackBar.open('Error al cambiar el estado del motivo extraordinario', 'Error', {
          duration: 3000
        });
        this.loading = false;
      }
    });
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
   * Refrescar datos
   */
  refreshData() {
    this.loadData();
  }
  /**
   * Obtener rango de página actual para mostrar en el contador
   */
  getPageRange() {
    if (!this.paginator) return '0-0';
    const start = this.paginator.pageIndex * this.paginator.pageSize + 1;
    const end = Math.min(start + this.paginator.pageSize - 1, this.totalItems);
    return `${start}-${end}`;
  }
  /**
   * Obtener el índice de página actual
   */
  getCurrentPageIndex() {
    if (!this.filters.offset || !this.filters.limit) return 0;
    const pageIndex = Math.floor(this.filters.offset / this.filters.limit);
    // Asegurar que el índice esté dentro de los límites válidos
    return Math.max(0, Math.min(pageIndex, Math.ceil(this.totalItems / this.filters.limit) - 1));
  }
  /**
   * Validar y corregir el estado del paginador
   */
  validatePaginatorState() {
    if (!this.paginator) return;
    const maxPageIndex = Math.ceil(this.totalItems / this.paginator.pageSize) - 1;
    const currentPageIndex = this.paginator.pageIndex;
    // Si el índice de página está fuera de rango, corregirlo
    if (currentPageIndex > maxPageIndex) {
      console.log('validatePaginatorState - Corrigiendo pageIndex:', {
        current: currentPageIndex,
        max: maxPageIndex,
        totalItems: this.totalItems,
        pageSize: this.paginator.pageSize
      });
      this.paginator.pageIndex = Math.max(0, maxPageIndex);
      this.filters.offset = this.paginator.pageIndex * this.paginator.pageSize;
    }
  }
  static #_ = this.ɵfac = function MotivosExtraordinariosComponent_Factory(t) {
    return new (t || MotivosExtraordinariosComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](src_app_core_services_file_extraordinary_reason_service__WEBPACK_IMPORTED_MODULE_1__.FileExtraordinaryReasonService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_4__.MatSnackBar), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_5__.MatDialog));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
    type: MotivosExtraordinariosComponent,
    selectors: [["app-motivos-extraordinarios"]],
    viewQuery: function MotivosExtraordinariosComponent_Query(rf, ctx) {
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
    decls: 47,
    vars: 16,
    consts: [[1, "p-6"], [1, "flex", "items-center", "justify-between", "mb-4"], [1, "text-3xl", "font-bold", "text-gray-900"], [1, "text-gray-600", "mt-1"], ["mat-raised-button", "", "color", "primary", 1, "flex", "items-center", "gap-2", 3, "click"], [1, "bg-white", "rounded-lg", "shadow-sm", "border", "p-4", "mb-6"], [1, "flex", "items-center", "gap-3"], ["mat-stroked-button", "", "color", "warn", "matTooltip", "Limpiar filtros", 1, "flex", "items-center", "gap-2", 3, "disabled", "click"], ["mat-stroked-button", "", "color", "accent", "matTooltip", "Recargar datos", 1, "flex", "items-center", "gap-2", 3, "disabled", "click"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-4"], ["appearance", "outline", 1, "w-full"], ["matInput", "", "placeholder", "Buscar por nombre...", "maxlength", "100", 3, "ngModel", "ngModelChange"], ["matSuffix", ""], [3, "ngModel", "ngModelChange"], ["value", ""], ["value", "2"], ["value", "1"], [1, "bg-white", "rounded-lg", "shadow-sm", "border", "overflow-hidden"], ["class", "flex justify-center items-center py-8", 4, "ngIf"], ["mat-table", "", "matSort", "", "class", "w-full", "style", "line-height: 1;", 3, "dataSource", 4, "ngIf"], ["class", "p-8 text-center", 4, "ngIf"], ["showFirstLastButtons", "", 1, "border-t", 3, "pageSizeOptions", "pageSize", "length"], [1, "mt-4", "text-sm", "text-sm", "text-gray-600", "text-center"], [1, "flex", "justify-center", "items-center", "py-8"], ["diameter", "40"], ["mat-table", "", "matSort", "", 1, "w-full", 2, "line-height", "1", 3, "dataSource"], ["matColumnDef", "id"], ["mat-header-cell", "", "mat-sort-header", "", "class", "w-16 text-center py-1 bg-gray-50 text-xs font-medium text-gray-700 whitespace-nowrap", 4, "matHeaderCellDef"], ["mat-cell", "", "class", "text-xs font-mono text-gray-600 py-0", 4, "matCellDef"], ["matColumnDef", "name"], ["mat-header-cell", "", "mat-sort-header", "", "class", "min-w-0 flex-1 py-1 bg-gray-50 text-xs font-medium text-gray-700 whitespace-nowrap", 4, "matHeaderCellDef"], ["mat-cell", "", "class", "text-xs py-0", 4, "matCellDef"], ["matColumnDef", "idTypeReason"], ["mat-header-cell", "", "mat-sort-header", "", "class", "w-32 text-center py-1 bg-gray-50 text-xs font-medium text-gray-700", 4, "matHeaderCellDef"], ["mat-cell", "", "class", "text-center py-0", 4, "matCellDef"], ["matColumnDef", "enabled"], ["mat-header-cell", "", "mat-sort-header", "", "class", "w-28 text-center py-1 bg-gray-50 text-xs font-medium text-gray-700", 4, "matHeaderCellDef"], ["matColumnDef", "actions"], ["mat-header-cell", "", "class", "w-28 text-center py-1 bg-gray-50 text-xs font-medium text-gray-700", 4, "matHeaderCellDef"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", "class", "!min-h-0 !h-8", 4, "matRowDef", "matRowDefColumns"], ["mat-header-cell", "", "mat-sort-header", "", 1, "w-16", "text-center", "py-1", "bg-gray-50", "text-xs", "font-medium", "text-gray-700", "whitespace-nowrap"], ["mat-cell", "", 1, "text-xs", "font-mono", "text-gray-600", "py-0"], ["mat-header-cell", "", "mat-sort-header", "", 1, "min-w-0", "flex-1", "py-1", "bg-gray-50", "text-xs", "font-medium", "text-gray-700", "whitespace-nowrap"], ["mat-cell", "", 1, "text-xs", "py-0"], ["mat-header-cell", "", "mat-sort-header", "", 1, "w-32", "text-center", "py-1", "bg-gray-50", "text-xs", "font-medium", "text-gray-700"], ["mat-cell", "", 1, "text-center", "py-0"], [1, "px-1.5", "py-0.5", "rounded-full", "text-xs", "font-medium", 3, "ngClass"], ["mat-header-cell", "", "mat-sort-header", "", 1, "w-28", "text-center", "py-1", "bg-gray-50", "text-xs", "font-medium", "text-gray-700"], ["mat-header-cell", "", 1, "w-28", "text-center", "py-1", "bg-gray-50", "text-xs", "font-medium", "text-gray-700"], [1, "flex", "gap-0.5", "justify-center", "items-center"], ["mat-icon-button", "", "color", "primary", "matTooltip", "Editar", 1, "!w-6", "!h-6", "!min-h-6", "!p-0", 3, "click"], [1, "!text-sm"], ["mat-icon-button", "", "color", "warn", "matTooltip", "Eliminar", 1, "!w-6", "!h-6", "!min-h-6", "!p-0", 3, "click"], ["mat-header-row", ""], ["mat-row", "", 1, "!min-h-0", "!h-8"], [1, "p-8", "text-center"], [1, "text-gray-400", "text-6xl", "mb-4"], [1, "text-gray-500", "text-lg"], [1, "text-gray-400"]],
    template: function MotivosExtraordinariosComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div")(3, "h1", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4, "Motivos Extraordinarios");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "p", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6, "Gesti\u00F3n de motivos de excepci\u00F3n y cancelaci\u00F3n");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "button", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function MotivosExtraordinariosComponent_Template_button_click_7_listener() {
          return ctx.addFileExtraordinaryReason();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](9, "add_circle");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](10, " Nuevo Motivo ");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](11, "div", 5)(12, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](13, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](14, "div", 6)(15, "button", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function MotivosExtraordinariosComponent_Template_button_click_15_listener() {
          return ctx.clearFilters();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](16, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](17, "clear_all");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](18, " Limpiar Filtros ");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](19, "button", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function MotivosExtraordinariosComponent_Template_button_click_19_listener() {
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
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function MotivosExtraordinariosComponent_Template_input_ngModelChange_27_listener($event) {
          return ctx.filters.search = $event;
        })("ngModelChange", function MotivosExtraordinariosComponent_Template_input_ngModelChange_27_listener() {
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
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngModelChange", function MotivosExtraordinariosComponent_Template_mat_select_ngModelChange_33_listener($event) {
          return ctx.filters.id_type_reason = $event;
        })("ngModelChange", function MotivosExtraordinariosComponent_Template_mat_select_ngModelChange_33_listener() {
          return ctx.applyFilters();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](34, "mat-option", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](35, "Todos");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](36, "mat-option", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](37, "Excepci\u00F3n");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](38, "mat-option", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](39, "Cancelaci\u00F3n");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](40, "div", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](41, MotivosExtraordinariosComponent_div_41_Template, 2, 0, "div", 18)(42, MotivosExtraordinariosComponent_table_42_Template, 18, 3, "table", 19)(43, MotivosExtraordinariosComponent_div_43_Template, 7, 0, "div", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](44, "mat-paginator", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](45, "div", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](46);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
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
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx.loading && ctx.dataSource.data.length === 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("pageSizeOptions", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](15, _c0))("pageSize", 10)("length", ctx.dataSource.filteredData.length);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate3"](" Mostrando ", ctx.getPageRange(), " de ", ctx.dataSource.filteredData.length, " motivos visibles (", ctx.totalItems, " total) ");
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_8__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_8__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_8__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.MaxLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.NgModel, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatTableModule, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatTable, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatHeaderCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatHeaderRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatColumnDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatHeaderCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatHeaderRow, _angular_material_table__WEBPACK_IMPORTED_MODULE_3__.MatRow, _angular_material_paginator__WEBPACK_IMPORTED_MODULE_6__.MatPaginatorModule, _angular_material_paginator__WEBPACK_IMPORTED_MODULE_6__.MatPaginator, _angular_material_sort__WEBPACK_IMPORTED_MODULE_7__.MatSortModule, _angular_material_sort__WEBPACK_IMPORTED_MODULE_7__.MatSort, _angular_material_sort__WEBPACK_IMPORTED_MODULE_7__.MatSortHeader, _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_4__.MatSnackBarModule, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_5__.MatDialogModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_10__.MatFormFieldModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_10__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_10__.MatLabel, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_10__.MatSuffix, _angular_material_input__WEBPACK_IMPORTED_MODULE_11__.MatInputModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_11__.MatInput, _angular_material_select__WEBPACK_IMPORTED_MODULE_12__.MatSelectModule, _angular_material_select__WEBPACK_IMPORTED_MODULE_12__.MatSelect, _angular_material_core__WEBPACK_IMPORTED_MODULE_13__.MatOption, _angular_material_button__WEBPACK_IMPORTED_MODULE_14__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_14__.MatButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_14__.MatIconButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_15__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_15__.MatIcon, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_16__.MatProgressSpinnerModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_16__.MatProgressSpinner, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_17__.MatTooltipModule, _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_17__.MatTooltip, _angular_material_chips__WEBPACK_IMPORTED_MODULE_18__.MatChipsModule],
    styles: [".mat-mdc-table[_ngcontent-%COMP%]   .mat-mdc-header-row[_ngcontent-%COMP%] {\n  background-color: #f9fafb;\n}\n.mat-mdc-table[_ngcontent-%COMP%]   .mat-mdc-header-row[_ngcontent-%COMP%]   .mat-mdc-header-cell[_ngcontent-%COMP%] {\n  font-weight: 500;\n  color: #374151;\n  border-bottom: 1px solid #e5e7eb;\n}\n.mat-mdc-table[_ngcontent-%COMP%]   .mat-mdc-row[_ngcontent-%COMP%]:hover {\n  background-color: #f9fafb;\n}\n.mat-mdc-table[_ngcontent-%COMP%]   .mat-mdc-row[_ngcontent-%COMP%]   .mat-mdc-cell[_ngcontent-%COMP%] {\n  border-bottom: 1px solid #f3f4f6;\n  padding: 8px 16px;\n}\n\n.tipo-excepcion[_ngcontent-%COMP%] {\n  background-color: #dbeafe;\n  color: #1e40af;\n  border: 1px solid #93c5fd;\n}\n\n.tipo-cancelacion[_ngcontent-%COMP%] {\n  background-color: #f3e8ff;\n  color: #7c3aed;\n  border: 1px solid #c4b5fd;\n}\n\n.mat-mdc-icon-button[_ngcontent-%COMP%] {\n  transition: all 0.2s ease;\n}\n.mat-mdc-icon-button[_ngcontent-%COMP%]:hover {\n  transform: scale(1.1);\n}\n\n@media (max-width: 768px) {\n  .flex-wrap[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: stretch;\n  }\n  .min-w-48[_ngcontent-%COMP%] {\n    min-width: auto;\n  }\n  .w-48[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n}\n.estado-habilitado[_ngcontent-%COMP%] {\n  background-color: #dcfce7;\n  color: #166534;\n}\n\n.estado-deshabilitado[_ngcontent-%COMP%] {\n  background-color: #fee2e2;\n  color: #991b1b;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvY29uZmlndXJhY2lvbi9tb3Rpdm9zLWV4dHJhb3JkaW5hcmlvcy9tb3Rpdm9zLWV4dHJhb3JkaW5hcmlvcy5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJRTtFQUNFLHlCQUFBO0FBSEo7QUFLSTtFQUNFLGdCQUFBO0VBQ0EsY0FBQTtFQUNBLGdDQUFBO0FBSE47QUFRSTtFQUNFLHlCQUFBO0FBTk47QUFTSTtFQUNFLGdDQUFBO0VBQ0EsaUJBQUE7QUFQTjs7QUFhQTtFQUNFLHlCQUFBO0VBQ0EsY0FBQTtFQUNBLHlCQUFBO0FBVkY7O0FBYUE7RUFDRSx5QkFBQTtFQUNBLGNBQUE7RUFDQSx5QkFBQTtBQVZGOztBQWNBO0VBQ0UseUJBQUE7QUFYRjtBQWFFO0VBQ0UscUJBQUE7QUFYSjs7QUFnQkE7RUFDRTtJQUNFLHNCQUFBO0lBQ0Esb0JBQUE7RUFiRjtFQWdCQTtJQUNFLGVBQUE7RUFkRjtFQWlCQTtJQUNFLFdBQUE7RUFmRjtBQUNGO0FBbUJBO0VBQ0UseUJBQUE7RUFDQSxjQUFBO0FBakJGOztBQW9CQTtFQUNFLHlCQUFBO0VBQ0EsY0FBQTtBQWpCRiIsInNvdXJjZXNDb250ZW50IjpbIi8vIEVzdGlsb3MgZXNwZWPDg8KtZmljb3MgcGFyYSBlbCBjb21wb25lbnRlIGRlIG1vdGl2b3MgZXh0cmFvcmRpbmFyaW9zXG5cbi8vIFBlcnNvbmFsaXphY2nDg8KzbiBkZSBsYSB0YWJsYVxuLm1hdC1tZGMtdGFibGUge1xuICAubWF0LW1kYy1oZWFkZXItcm93IHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjlmYWZiO1xuICAgIFxuICAgIC5tYXQtbWRjLWhlYWRlci1jZWxsIHtcbiAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICBjb2xvcjogIzM3NDE1MTtcbiAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZTVlN2ViO1xuICAgIH1cbiAgfVxuICBcbiAgLm1hdC1tZGMtcm93IHtcbiAgICAmOmhvdmVyIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmOWZhZmI7XG4gICAgfVxuICAgIFxuICAgIC5tYXQtbWRjLWNlbGwge1xuICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNmM2Y0ZjY7XG4gICAgICBwYWRkaW5nOiA4cHggMTZweDtcbiAgICB9XG4gIH1cbn1cblxuLy8gRXN0aWxvcyBwYXJhIGxvcyBjaGlwcyBkZSB0aXBvIGRlIHJhesODwrNuXG4udGlwby1leGNlcGNpb24ge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZGJlYWZlO1xuICBjb2xvcjogIzFlNDBhZjtcbiAgYm9yZGVyOiAxcHggc29saWQgIzkzYzVmZDtcbn1cblxuLnRpcG8tY2FuY2VsYWNpb24ge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjNlOGZmO1xuICBjb2xvcjogIzdjM2FlZDtcbiAgYm9yZGVyOiAxcHggc29saWQgI2M0YjVmZDtcbn1cblxuLy8gRXN0aWxvcyBwYXJhIGxvcyBib3RvbmVzIGRlIGFjY2nDg8KzblxuLm1hdC1tZGMtaWNvbi1idXR0b24ge1xuICB0cmFuc2l0aW9uOiBhbGwgMC4ycyBlYXNlO1xuICBcbiAgJjpob3ZlciB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxLjEpO1xuICB9XG59XG5cbi8vIFJlc3BvbnNpdmUgYWRqdXN0bWVudHNcbkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICAuZmxleC13cmFwIHtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGFsaWduLWl0ZW1zOiBzdHJldGNoO1xuICB9XG4gIFxuICAubWluLXctNDgge1xuICAgIG1pbi13aWR0aDogYXV0bztcbiAgfVxuICBcbiAgLnctNDgge1xuICAgIHdpZHRoOiAxMDAlO1xuICB9XG59XG5cbi8vIEVzdGlsb3MgcGFyYSBlbCBlc3RhZG9cbi5lc3RhZG8taGFiaWxpdGFkbyB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNkY2ZjZTc7XG4gIGNvbG9yOiAjMTY2NTM0O1xufVxuXG4uZXN0YWRvLWRlc2hhYmlsaXRhZG8ge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmVlMmUyO1xuICBjb2xvcjogIzk5MWIxYjtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
  });
}

/***/ })

}]);
//# sourceMappingURL=src_app_pages_configuracion_motivos-extraordinarios_motivos-extraordinarios_component_ts.js.map