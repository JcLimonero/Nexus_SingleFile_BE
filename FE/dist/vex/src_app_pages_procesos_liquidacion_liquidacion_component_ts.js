"use strict";
(self["webpackChunkvex"] = self["webpackChunkvex"] || []).push([["src_app_pages_procesos_liquidacion_liquidacion_component_ts"],{

/***/ 35226:
/*!*********************************************************************!*\
  !*** ./src/app/pages/procesos/liquidacion/liquidacion.component.ts ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LiquidacionComponent: () => (/* binding */ LiquidacionComponent)
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
/* harmony import */ var _integracion_client_selection_dialog_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../integracion/client-selection-dialog.component */ 91427);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _core_services_default_agency_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../core/services/default-agency.service */ 44907);
/* harmony import */ var _core_services_client_search_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../core/services/client-search.service */ 14759);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/material/core */ 55309);







































function LiquidacionComponent_mat_option_12_Template(rf, ctx) {
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
function LiquidacionComponent_button_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "button", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function LiquidacionComponent_button_23_Template_button_click_0_listener() {
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
function LiquidacionComponent_div_24_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 21)(1, "mat-icon", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2, "search_off");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "p", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](4, "No se encontraron clientes con el t\u00E9rmino de b\u00FAsqueda");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
}
function LiquidacionComponent_div_25_Template(rf, ctx) {
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
function LiquidacionComponent_div_26_button_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "button", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function LiquidacionComponent_div_26_button_16_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r15);
      const ctx_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r14.clearOrderSearch());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](1, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2, "clear");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
}
function LiquidacionComponent_div_26_div_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](1, "mat-spinner", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function LiquidacionComponent_div_26_div_19_th_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "N\u00B0 Pedido");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function LiquidacionComponent_div_26_div_19_td_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 66)(1, "div", 34)(2, "mat-icon", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3, "receipt");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "span", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const file_r43 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](file_r43.numeroPedido);
  }
}
function LiquidacionComponent_div_26_div_19_th_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "N\u00B0 Inventario");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function LiquidacionComponent_div_26_div_19_td_7_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r44 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](file_r44.numeroInventario);
  }
}
function LiquidacionComponent_div_26_div_19_td_7_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "Sin inventario");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function LiquidacionComponent_div_26_div_19_td_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, LiquidacionComponent_div_26_div_19_td_7_span_1_Template, 2, 1, "span", 69)(2, LiquidacionComponent_div_26_div_19_td_7_ng_template_2_Template, 2, 0, "ng-template", null, 70, _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r44 = ctx.$implicit;
    const _r47 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", file_r44.numeroInventario)("ngIfElse", _r47);
  }
}
function LiquidacionComponent_div_26_div_19_th_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "Proceso");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function LiquidacionComponent_div_26_div_19_td_10_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r49 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](file_r49.proceso);
  }
}
function LiquidacionComponent_div_26_div_19_td_10_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "Sin proceso");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function LiquidacionComponent_div_26_div_19_td_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, LiquidacionComponent_div_26_div_19_td_10_span_1_Template, 2, 1, "span", 69)(2, LiquidacionComponent_div_26_div_19_td_10_ng_template_2_Template, 2, 0, "ng-template", null, 73, _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r49 = ctx.$implicit;
    const _r52 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", file_r49.proceso)("ngIfElse", _r52);
  }
}
function LiquidacionComponent_div_26_div_19_th_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "Operaci\u00F3n");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function LiquidacionComponent_div_26_div_19_td_13_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r54 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](file_r54.operacion);
  }
}
function LiquidacionComponent_div_26_div_19_td_13_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "Sin operaci\u00F3n");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function LiquidacionComponent_div_26_div_19_td_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, LiquidacionComponent_div_26_div_19_td_13_span_1_Template, 2, 1, "span", 69)(2, LiquidacionComponent_div_26_div_19_td_13_ng_template_2_Template, 2, 0, "ng-template", null, 74, _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r54 = ctx.$implicit;
    const _r57 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", file_r54.operacion)("ngIfElse", _r57);
  }
}
function LiquidacionComponent_div_26_div_19_th_15_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "Tipo Cliente");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function LiquidacionComponent_div_26_div_19_td_16_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r59 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](file_r59.tipoCliente);
  }
}
function LiquidacionComponent_div_26_div_19_td_16_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "Sin tipo");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function LiquidacionComponent_div_26_div_19_td_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, LiquidacionComponent_div_26_div_19_td_16_span_1_Template, 2, 1, "span", 69)(2, LiquidacionComponent_div_26_div_19_td_16_ng_template_2_Template, 2, 0, "ng-template", null, 75, _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r59 = ctx.$implicit;
    const _r62 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", file_r59.tipoCliente)("ngIfElse", _r62);
  }
}
function LiquidacionComponent_div_26_div_19_th_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "Veh\u00EDculo");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function LiquidacionComponent_div_26_div_19_td_19_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r64 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](file_r64.vehiculo);
  }
}
function LiquidacionComponent_div_26_div_19_td_19_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "Sin veh\u00EDculo");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function LiquidacionComponent_div_26_div_19_td_19_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, LiquidacionComponent_div_26_div_19_td_19_span_1_Template, 2, 1, "span", 69)(2, LiquidacionComponent_div_26_div_19_td_19_ng_template_2_Template, 2, 0, "ng-template", null, 76, _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r64 = ctx.$implicit;
    const _r67 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", file_r64.vehiculo)("ngIfElse", _r67);
  }
}
function LiquidacionComponent_div_26_div_19_th_21_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "A\u00F1o");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function LiquidacionComponent_div_26_div_19_td_22_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r69 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](file_r69.year);
  }
}
function LiquidacionComponent_div_26_div_19_td_22_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "-");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function LiquidacionComponent_div_26_div_19_td_22_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, LiquidacionComponent_div_26_div_19_td_22_span_1_Template, 2, 1, "span", 69)(2, LiquidacionComponent_div_26_div_19_td_22_ng_template_2_Template, 2, 0, "ng-template", null, 77, _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r69 = ctx.$implicit;
    const _r72 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", file_r69.year)("ngIfElse", _r72);
  }
}
function LiquidacionComponent_div_26_div_19_th_24_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "Modelo");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function LiquidacionComponent_div_26_div_19_td_25_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r74 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](file_r74.modelo);
  }
}
function LiquidacionComponent_div_26_div_19_td_25_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "Sin modelo");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function LiquidacionComponent_div_26_div_19_td_25_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, LiquidacionComponent_div_26_div_19_td_25_span_1_Template, 2, 1, "span", 69)(2, LiquidacionComponent_div_26_div_19_td_25_ng_template_2_Template, 2, 0, "ng-template", null, 78, _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r74 = ctx.$implicit;
    const _r77 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", file_r74.modelo)("ngIfElse", _r77);
  }
}
function LiquidacionComponent_div_26_div_19_th_27_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "VIN");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function LiquidacionComponent_div_26_div_19_td_28_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 81);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r79 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](file_r79.vin);
  }
}
function LiquidacionComponent_div_26_div_19_td_28_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "Sin VIN");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function LiquidacionComponent_div_26_div_19_td_28_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, LiquidacionComponent_div_26_div_19_td_28_span_1_Template, 2, 1, "span", 79)(2, LiquidacionComponent_div_26_div_19_td_28_ng_template_2_Template, 2, 0, "ng-template", null, 80, _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r79 = ctx.$implicit;
    const _r82 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", file_r79.vin)("ngIfElse", _r82);
  }
}
function LiquidacionComponent_div_26_div_19_th_30_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "Agencia");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function LiquidacionComponent_div_26_div_19_td_31_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r84 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](file_r84.agencia);
  }
}
function LiquidacionComponent_div_26_div_19_td_31_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "Sin agencia");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function LiquidacionComponent_div_26_div_19_td_31_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, LiquidacionComponent_div_26_div_19_td_31_span_1_Template, 2, 1, "span", 69)(2, LiquidacionComponent_div_26_div_19_td_31_ng_template_2_Template, 2, 0, "ng-template", null, 82, _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r84 = ctx.$implicit;
    const _r87 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", file_r84.agencia)("ngIfElse", _r87);
  }
}
function LiquidacionComponent_div_26_div_19_th_33_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "Fecha Registro");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function LiquidacionComponent_div_26_div_19_td_34_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](2, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r89 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind2"](2, 1, file_r89.fechaRegistro, "dd/MM/yyyy HH:mm"));
  }
}
function LiquidacionComponent_div_26_div_19_td_34_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "Sin fecha");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function LiquidacionComponent_div_26_div_19_td_34_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, LiquidacionComponent_div_26_div_19_td_34_span_1_Template, 3, 4, "span", 69)(2, LiquidacionComponent_div_26_div_19_td_34_ng_template_2_Template, 2, 0, "ng-template", null, 83, _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const file_r89 = ctx.$implicit;
    const _r92 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", file_r89.fechaRegistro)("ngIfElse", _r92);
  }
}
function LiquidacionComponent_div_26_div_19_th_36_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "Acciones");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function LiquidacionComponent_div_26_div_19_td_37_button_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "button", 87)(1, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2, "more_vert");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    const _r96 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("matMenuTriggerFor", _r96);
  }
}
function LiquidacionComponent_div_26_div_19_td_37_Template(rf, ctx) {
  if (rf & 1) {
    const _r98 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, LiquidacionComponent_div_26_div_19_td_37_button_1_Template, 3, 1, "button", 84);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](2, "mat-menu", null, 85)(4, "button", 86);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function LiquidacionComponent_div_26_div_19_td_37_Template_button_click_4_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r98);
      const file_r94 = restoredCtx.$implicit;
      const ctx_r97 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r97.liquidarPedido(file_r94));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](5, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6, "account_balance");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](7, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](8, "Liquidar");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](9, "button", 86);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function LiquidacionComponent_div_26_div_19_td_37_Template_button_click_9_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r98);
      const file_r94 = restoredCtx.$implicit;
      const ctx_r99 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r99.revisarPedido(file_r94));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](10, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](11, "visibility");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](12, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](13, "Revisar");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const ctx_r39 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r39.isManagerOrAdmin);
  }
}
function LiquidacionComponent_div_26_div_19_tr_38_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](0, "tr", 88);
  }
}
function LiquidacionComponent_div_26_div_19_tr_39_Template(rf, ctx) {
  if (rf & 1) {
    const _r102 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "tr", 89);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function LiquidacionComponent_div_26_div_19_tr_39_Template_tr_click_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r102);
      const row_r100 = restoredCtx.$implicit;
      const ctx_r101 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r101.selectFile(row_r100));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
const _c0 = () => [5, 10, 25, 50];
function LiquidacionComponent_div_26_div_19_mat_paginator_40_Template(rf, ctx) {
  if (rf & 1) {
    const _r104 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "mat-paginator", 90);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("page", function LiquidacionComponent_div_26_div_19_mat_paginator_40_Template_mat_paginator_page_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r104);
      const ctx_r103 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r103.onPageChange($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r42 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("length", ctx_r42.totalItems)("pageSize", ctx_r42.pageSize)("pageIndex", ctx_r42.currentPage)("pageSizeOptions", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction0"](5, _c0))("showFirstLastButtons", true);
  }
}
function LiquidacionComponent_div_26_div_19_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 46)(1, "table", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](2, 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](3, LiquidacionComponent_div_26_div_19_th_3_Template, 2, 0, "th", 49)(4, LiquidacionComponent_div_26_div_19_td_4_Template, 6, 1, "td", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](5, 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](6, LiquidacionComponent_div_26_div_19_th_6_Template, 2, 0, "th", 49)(7, LiquidacionComponent_div_26_div_19_td_7_Template, 4, 2, "td", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](8, 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](9, LiquidacionComponent_div_26_div_19_th_9_Template, 2, 0, "th", 49)(10, LiquidacionComponent_div_26_div_19_td_10_Template, 4, 2, "td", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](11, 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](12, LiquidacionComponent_div_26_div_19_th_12_Template, 2, 0, "th", 49)(13, LiquidacionComponent_div_26_div_19_td_13_Template, 4, 2, "td", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](14, 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](15, LiquidacionComponent_div_26_div_19_th_15_Template, 2, 0, "th", 49)(16, LiquidacionComponent_div_26_div_19_td_16_Template, 4, 2, "td", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](17, 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](18, LiquidacionComponent_div_26_div_19_th_18_Template, 2, 0, "th", 49)(19, LiquidacionComponent_div_26_div_19_td_19_Template, 4, 2, "td", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](20, 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](21, LiquidacionComponent_div_26_div_19_th_21_Template, 2, 0, "th", 49)(22, LiquidacionComponent_div_26_div_19_td_22_Template, 4, 2, "td", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](23, 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](24, LiquidacionComponent_div_26_div_19_th_24_Template, 2, 0, "th", 49)(25, LiquidacionComponent_div_26_div_19_td_25_Template, 4, 2, "td", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](26, 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](27, LiquidacionComponent_div_26_div_19_th_27_Template, 2, 0, "th", 49)(28, LiquidacionComponent_div_26_div_19_td_28_Template, 4, 2, "td", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](29, 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](30, LiquidacionComponent_div_26_div_19_th_30_Template, 2, 0, "th", 49)(31, LiquidacionComponent_div_26_div_19_td_31_Template, 4, 2, "td", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](32, 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](33, LiquidacionComponent_div_26_div_19_th_33_Template, 2, 0, "th", 49)(34, LiquidacionComponent_div_26_div_19_td_34_Template, 4, 2, "td", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](35, 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](36, LiquidacionComponent_div_26_div_19_th_36_Template, 2, 0, "th", 49)(37, LiquidacionComponent_div_26_div_19_td_37_Template, 14, 1, "td", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](38, LiquidacionComponent_div_26_div_19_tr_38_Template, 1, 0, "tr", 62)(39, LiquidacionComponent_div_26_div_19_tr_39_Template, 1, 0, "tr", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](40, LiquidacionComponent_div_26_div_19_mat_paginator_40_Template, 1, 6, "mat-paginator", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("dataSource", ctx_r11.paginatedFiles);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](37);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("matHeaderRowDef", ctx_r11.filesDisplayedColumns);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("matRowDefColumns", ctx_r11.filesDisplayedColumns);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", !ctx_r11.filesLoading && ctx_r11.totalItems > 0);
  }
}
function LiquidacionComponent_div_26_div_20_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 91)(1, "mat-icon", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2, "folder_open");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "p", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](4, "No se encontraron pedidos en estatus de liquidaci\u00F3n para este cliente");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
}
function LiquidacionComponent_div_26_div_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r106 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 91)(1, "mat-icon", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2, "search_off");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "p", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](4, "No se encontraron pedidos que coincidan con la b\u00FAsqueda");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](5, "button", 92);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function LiquidacionComponent_div_26_div_21_Template_button_click_5_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r106);
      const ctx_r105 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r105.clearOrderSearch());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6, " Limpiar b\u00FAsqueda ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
}
function LiquidacionComponent_div_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r108 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 32)(1, "mat-card", 2)(2, "mat-card-header", 25)(3, "mat-card-title", 33)(4, "div", 34)(5, "mat-icon", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6, "account_balance");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](7, " Pedidos en Liquidaci\u00F3n ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](8, "div", 36)(9, "div", 13)(10, "mat-form-field", 11)(11, "mat-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](12, "Buscar pedido");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](13, "input", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("ngModelChange", function LiquidacionComponent_div_26_Template_input_ngModelChange_13_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r108);
      const ctx_r107 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r107.orderSearchTerm = $event);
    })("input", function LiquidacionComponent_div_26_Template_input_input_13_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r108);
      const ctx_r109 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r109.onOrderSearchChange());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](14, "mat-icon", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](15, "search");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](16, LiquidacionComponent_div_26_button_16_Template, 3, 0, "button", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](17, "mat-card-content", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](18, LiquidacionComponent_div_26_div_18_Template, 2, 0, "div", 40)(19, LiquidacionComponent_div_26_div_19_Template, 41, 4, "div", 41)(20, LiquidacionComponent_div_26_div_20_Template, 5, 0, "div", 42)(21, LiquidacionComponent_div_26_div_21_Template, 7, 0, "div", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](13);
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
function LiquidacionComponent_div_27_div_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](1, "mat-spinner", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function LiquidacionComponent_div_27_div_18_div_1_div_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 118);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](2, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const document_r114 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" Vencimiento: ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind2"](2, 1, document_r114.expirationDate, "dd/MM/yyyy"), " ");
  }
}
function LiquidacionComponent_div_27_div_18_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r119 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 105)(1, "div", 106)(2, "mat-icon", 107);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "div", 108)(5, "div", 109);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](7, LiquidacionComponent_div_27_div_18_div_1_div_7_Template, 3, 4, "div", 110);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](8, "div", 111)(9, "div", 112)(10, "input", 113, 114);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("change", function LiquidacionComponent_div_27_div_18_div_1_Template_input_change_10_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r119);
      const document_r114 = restoredCtx.$implicit;
      const ctx_r118 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r118.onFileSelected($event, document_r114.fileDocumentId));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](12, "button", 115);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function LiquidacionComponent_div_27_div_18_div_1_Template_button_click_12_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r119);
      const _r116 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](11);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](_r116.click());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](13, "mat-icon", 101);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](14, "attach_file");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](15);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](16, "button", 116);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function LiquidacionComponent_div_27_div_18_div_1_Template_button_click_16_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r119);
      const document_r114 = restoredCtx.$implicit;
      const ctx_r121 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r121.uploadDocument(document_r114));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](17, "mat-icon", 101);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](18, "upload");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](19);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](20, "button", 117);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function LiquidacionComponent_div_27_div_18_div_1_Template_button_click_20_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r119);
      const document_r114 = restoredCtx.$implicit;
      const ctx_r122 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r122.viewDocument(document_r114));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](21, "mat-icon", 101);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](22, "visibility");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](23, " VER ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const document_r114 = ctx.$implicit;
    const ctx_r113 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵclassMap"](ctx_r113.getDocumentStatusColor(document_r114.status, document_r114.idCurrentStatus));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", ctx_r113.getDocumentStatusIcon(document_r114.status, document_r114.idCurrentStatus), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](document_r114.fileName || document_r114.documentName);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", document_r114.hasExpiration === "1" && document_r114.expirationDate);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("id", "file-" + document_r114.fileDocumentId);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("disabled", document_r114.idCurrentStatus === "3" || document_r114.idCurrentStatus === "4");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", ctx_r113.selectedFiles[document_r114.fileDocumentId] ? ctx_r113.selectedFiles[document_r114.fileDocumentId].name : document_r114.idCurrentStatus === "2" ? "Reemplazar archivo" : "Seleccionar archivo", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("disabled", !ctx_r113.selectedFiles[document_r114.fileDocumentId == null ? null : document_r114.fileDocumentId.toString()] || document_r114.idCurrentStatus === "3" || document_r114.idCurrentStatus === "4");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", document_r114.idCurrentStatus === "2" ? "REEMPLAZAR" : "CARGAR", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("disabled", !document_r114.documentContainer);
  }
}
function LiquidacionComponent_div_27_div_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 103);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, LiquidacionComponent_div_27_div_18_div_1_Template, 24, 11, "div", 104);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r111 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx_r111.requiredDocuments);
  }
}
function LiquidacionComponent_div_27_div_19_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 91)(1, "mat-icon", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2, "folder_open");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "p", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](4, "No se encontraron documentos requeridos para este pedido");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
}
function LiquidacionComponent_div_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r124 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 93)(1, "mat-card", 2)(2, "mat-card-header", 94)(3, "mat-card-title", 95)(4, "div", 96)(5, "mat-icon", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6, "folder");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](7, "span", 97);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](8, "Documentos Requeridos para Liquidaci\u00F3n");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](9, "div", 98);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](11, "div", 99)(12, "button", 100);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function LiquidacionComponent_div_27_Template_button_click_12_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r124);
      const ctx_r123 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r123.agregarDocumentoLiquidacion());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](13, "mat-icon", 101);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](14, "add");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](15);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](16, "mat-card-content", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](17, LiquidacionComponent_div_27_div_17_Template, 2, 0, "div", 40)(18, LiquidacionComponent_div_27_div_18_Template, 2, 1, "div", 102)(19, LiquidacionComponent_div_27_div_19_Template, 5, 0, "div", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate8"](" Pedido ", ctx_r5.selectedFile.numeroPedido, " \u2022 ", ctx_r5.selectedFile.proceso, " \u2022 ", ctx_r5.selectedFile.operacion, " \u2022 ", ctx_r5.selectedFile.tipoCliente, " \u2022 ", ctx_r5.selectedFile.modelo, " ", ctx_r5.selectedFile.vehiculo, " ", ctx_r5.selectedFile.year, " \u2022 VIN: ", ctx_r5.selectedFile.vin, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("disabled", ctx_r5.addingLiquidationDocument || ctx_r5.documentsLoading);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", ctx_r5.addingLiquidationDocument ? "Agregando..." : "Agregar documento", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r5.documentsLoading);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", !ctx_r5.documentsLoading);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", !ctx_r5.documentsLoading && ctx_r5.requiredDocuments.length === 0);
  }
}
class LiquidacionComponent {
  constructor(snackBar, defaultAgencyService, http, dialog, clientSearchService) {
    this.snackBar = snackBar;
    this.defaultAgencyService = defaultAgencyService;
    this.http = http;
    this.dialog = dialog;
    this.clientSearchService = clientSearchService;
    this.loading = false;
    this.liquidationStatus = 'inactive'; // inactive, active, error
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
    this.addingLiquidationDocument = false;
    // Process properties - Fixed process for liquidation
    this.liquidationProcessId = 2; // Liquidación
    this.LIQUIDACION_STATE_ID = 2;
    this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_5__.Subject();
  }
  ngOnInit() {
    console.log('🚀 LiquidacionComponent inicializado');
    this.loadLiquidationStatus();
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
  loadLiquidationStatus() {
    this.loading = true;
    // Simular carga de estado de liquidación
    setTimeout(() => {
      this.liquidationStatus = 'active';
      this.loading = false;
    }, 1000);
  }
  startLiquidation() {
    this.loading = true;
    this.snackBar.open('Iniciando proceso de liquidación...', 'Cerrar', {
      duration: 3000
    });
    // Simular proceso de liquidación
    setTimeout(() => {
      this.liquidationStatus = 'active';
      this.loading = false;
      this.snackBar.open('Liquidación completada exitosamente', 'Cerrar', {
        duration: 5000
      });
    }, 3000);
  }
  stopLiquidation() {
    this.liquidationStatus = 'inactive';
    this.snackBar.open('Liquidación detenida', 'Cerrar', {
      duration: 3000
    });
  }
  getStatusColor() {
    switch (this.liquidationStatus) {
      case 'active':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  }
  getStatusIcon() {
    switch (this.liquidationStatus) {
      case 'active':
        return 'check_circle';
      case 'error':
        return 'error';
      default:
        return 'pause_circle';
    }
  }
  getStatusText() {
    switch (this.liquidationStatus) {
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
    // Si el campo está vacío, limpiar resultados
    if (!this.clientSearchTerm.trim()) {
      this.clients = [];
      this.showClientResults = false;
    } else {
      // Si el usuario empieza a escribir y ya hay un cliente seleccionado, limpiar todos los datos
      if (this.selectedClient) {
        this.clearAllClientData();
      }
    }
  }
  searchClients() {
    if (this.clientSearchTerm.trim().length < 1) {
      this.snackBar.open('Debe ingresar al menos 1 carácter para buscar', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    // Si ya hay un cliente seleccionado y se busca otro, limpiar todos los datos
    if (this.selectedClient) {
      this.clearAllClientData();
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
    this.clientSearchService.searchClients(this.selectedAgencyId, this.clientSearchTerm.trim(), 50, this.LIQUIDACION_STATE_ID).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_6__.takeUntil)(this.destroy$)).subscribe({
      next: response => {
        console.log('🔍 Clientes en liquidación encontrados:', response);
        if (response && response.success && response.data && response.data.clientes) {
          this.clients = response.data.clientes;
          if (this.clients.length > 1) {
            this.showClientSelectionDialog();
          } else if (this.clients.length === 1) {
            this.selectClient(this.clients[0]);
          } else {
            this.snackBar.open('No se encontraron clientes con pedidos en Liquidación', 'Cerrar', {
              duration: 3000
            });
          }
        } else {
          this.clients = [];
          this.snackBar.open('No se encontraron clientes con pedidos en Liquidación', 'Cerrar', {
            duration: 3000
          });
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
    // Limpiar documentos requeridos cuando se limpia la búsqueda de cliente
    this.requiredDocuments = [];
    this.selectedFile = null;
    this.selectedFiles = {};
  }
  clearAllClientData() {
    console.log('🧹 Limpiando todos los datos del cliente anterior...');
    // Limpiar datos del cliente
    this.selectedClient = null;
    this.clients = [];
    this.showClientResults = false;
    // Limpiar archivos/pedidos
    this.files = [];
    this.filteredFiles = [];
    this.paginatedFiles = [];
    this.selectedFile = null;
    this.filesLoading = false;
    // Limpiar documentos
    this.requiredDocuments = [];
    this.selectedFiles = {};
    this.documentsLoading = false;
    // Limpiar estado de carga
    this.clientsLoading = false;
    // Limpiar búsqueda de pedidos
    this.orderSearchTerm = '';
    this.currentPage = 0;
    this.totalItems = 0;
    console.log('✅ Todos los datos del cliente anterior han sido limpiados');
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
    // Cargar automáticamente los pedidos de liquidación del cliente seleccionado
    this.loadClientFiles();
    this.snackBar.open(`Cliente seleccionado: ${client.cliente}`, 'Cerrar', {
      duration: 3000
    });
  }
  showClientSelectionDialog() {
    const dialogRef = this.dialog.open(_integracion_client_selection_dialog_component__WEBPACK_IMPORTED_MODULE_1__.ClientSelectionDialogComponent, {
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
    params = params.set('statusId', '2'); // ID para Liquidación
    // Cargar pedidos de liquidación
    this.http.get(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiBaseUrl}/api/files/by-agency-client`, {
      params
    }).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_6__.takeUntil)(this.destroy$)).subscribe({
      next: response => {
        console.log('📁 Files de liquidación encontrados:', response);
        if (response && response.success && response.data && response.data.files) {
          this.files = response.data.files;
        } else {
          this.files = [];
        }
        this.updateFilesDisplay();
        this.filesLoading = false;
      },
      error: error => {
        console.error('❌ Error cargando files de liquidación:', error);
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
  liquidarPedido(file) {
    console.log('Liquidando pedido:', file.numeroPedido);
    // Aquí implementarías la lógica para liquidar el pedido
    this.snackBar.open(`Pedido ${file.numeroPedido} liquidado exitosamente`, 'Cerrar', {
      duration: 3000
    });
  }
  revisarPedido(file) {
    console.log('Revisando pedido:', file.numeroPedido);
    // Aquí implementarías la lógica para revisar el pedido
    this.snackBar.open(`Pedido ${file.numeroPedido} enviado a revisión`, 'Cerrar', {
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
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_7__.HttpParams();
    params = params.set('fileId', fileId);
    params = params.set('idProcessType', '2'); // Filtro por liquidación usando ID = 2
    this.http.get(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiBaseUrl}/api/documents/required`, {
      params
    }).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_6__.takeUntil)(this.destroy$)).subscribe({
      next: response => {
        console.log('📄 Documentos requeridos para liquidación:', response);
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
  agregarDocumentoLiquidacion() {
    if (!this.selectedFile || !this.selectedFile.fileId) {
      this.snackBar.open('Selecciona un pedido antes de agregar documentos', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    if (this.addingLiquidationDocument) {
      return;
    }
    const fileId = this.selectedFile.fileId;
    this.addingLiquidationDocument = true;
    this.http.post(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiBaseUrl}/api/clients-validation/documentos/liquidacion`, {
      idFile: fileId
    }).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_6__.takeUntil)(this.destroy$)).subscribe({
      next: response => {
        const message = response?.message || 'Documento de Liquidación agregado';
        this.snackBar.open(message, 'Cerrar', {
          duration: 3000
        });
        this.loadRequiredDocuments(fileId);
      },
      error: error => {
        console.error('❌ Error agregando documento de liquidación:', error);
        const errorMessage = error?.error?.message || 'No se pudo agregar el documento de Liquidación';
        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 4000
        });
        this.addingLiquidationDocument = false;
      },
      complete: () => {
        this.addingLiquidationDocument = false;
      }
    });
  }
  onFileSelected(event, documentFileId) {
    const file = event.target.files[0];
    if (file) {
      const key = documentFileId.toString();
      this.selectedFiles[key] = file;
    }
  }
  uploadDocument(document) {
    const documentKey = document.fileDocumentId?.toString();
    if (!documentKey || !this.selectedFiles[documentKey]) {
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
    formData.append('file', this.selectedFiles[documentKey]); // File: Archivo a subir
    formData.append('idSingleFile', this.selectedFile.fileId.toString()); // Integer: ID del archivo en tabla (IdFile)
    formData.append('idDocumentFile', document.fileDocumentId.toString()); // Integer: ID del documento (fileDocumentId)
    // Usar API de Vanguardia (el proxy agregará X-Provider-Token automáticamente)
    this.http.post(_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.vanguardia.uploadApiUrl, formData).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_6__.takeUntil)(this.destroy$)).subscribe({
      next: response => {
        console.log('📤 Documento subido exitosamente a Vanguardia:', response);
        this.snackBar.open(`Documento ${document.documentName} ${actionText} exitosamente`, 'Cerrar', {
          duration: 3000
        });
        // Recargar documentos
        this.loadRequiredDocuments(this.selectedFile.fileId);
        // Limpiar archivo seleccionado
        delete this.selectedFiles[documentKey];
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
    const url = `${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.vanguardia.uploadApiUrl.replace('/upload', '')}/get-private-url?${params.toString()}`;
    console.log('🔗 URL completa:', url);
    // El proxy agregará X-Provider-Token automáticamente
    this.http.get(url).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_6__.takeUntil)(this.destroy$)).subscribe({
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
  static #_ = this.ɵfac = function LiquidacionComponent_Factory(t) {
    return new (t || LiquidacionComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_8__.MatSnackBar), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_core_services_default_agency_service__WEBPACK_IMPORTED_MODULE_2__.DefaultAgencyService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_7__.HttpClient), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_9__.MatDialog), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_core_services_client_search_service__WEBPACK_IMPORTED_MODULE_3__.ClientSearchService));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({
    type: LiquidacionComponent,
    selectors: [["vex-liquidacion"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵStandaloneFeature"]],
    decls: 28,
    vars: 12,
    consts: [[1, "liquidacion-container"], [1, "filters-section", "mb-2"], [1, "bg-white", "rounded-lg", "shadow-sm", "border", "border-gray-200"], [1, "p-2"], [1, "flex", "items-center", "justify-between", "gap-3"], [1, "flex", "items-center", "space-x-3"], ["appearance", "outline", 1, "min-w-48"], [3, "value", "disabled", "selectionChange"], [3, "value"], [3, "value", 4, "ngFor", "ngForOf", "ngForTrackBy"], [1, "flex", "items-center", "space-x-3", "flex-1"], ["appearance", "outline", 1, "flex-1"], ["matInput", "", "placeholder", "Buscar por n\u00FAmero de cliente o nombre completo", "autocomplete", "off", 3, "ngModel", "ngModelChange", "keyup.enter"], [1, "flex", "items-center", "space-x-2"], ["mat-raised-button", "", "color", "primary", "matTooltip", "Buscar cliente", 2, "height", "40px", "min-height", "40px", 3, "disabled", "click"], ["mat-raised-button", "", "color", "warn", "matTooltip", "Limpiar b\u00FAsqueda", "style", "height: 40px; min-height: 40px;", 3, "click", 4, "ngIf"], ["class", "mt-3 text-center py-6", 4, "ngIf"], ["class", "client-info-section mb-2", 4, "ngIf"], ["class", "files-section mb-2", 4, "ngIf"], ["class", "documents-section mb-2", 4, "ngIf"], ["mat-raised-button", "", "color", "warn", "matTooltip", "Limpiar b\u00FAsqueda", 2, "height", "40px", "min-height", "40px", 3, "click"], [1, "mt-3", "text-center", "py-6"], [1, "text-gray-400", "mb-2", 2, "font-size", "40px"], [1, "text-gray-500"], [1, "client-info-section", "mb-2"], [1, "pb-1"], [1, "flex", "items-center", "text-sm"], [1, "mr-1", "text-blue-600", 2, "font-size", "18px"], [1, "grid", "grid-cols-1", "md:grid-cols-3", "gap-2"], [1, "field-group"], [1, "field-label"], [1, "field-value"], [1, "files-section", "mb-2"], [1, "flex", "items-center", "justify-between", "text-sm"], [1, "flex", "items-center"], [1, "mr-1", "text-green-600", 2, "font-size", "18px"], [1, "px-2", "pb-2"], ["matInput", "", "placeholder", "Buscar por n\u00FAmero de pedido, inventario, proceso, operaci\u00F3n, veh\u00EDculo, modelo, VIN o agencia", "autocomplete", "off", 3, "ngModel", "ngModelChange", "input"], ["matSuffix", ""], ["mat-icon-button", "", "color", "warn", "matTooltip", "Limpiar b\u00FAsqueda", 3, "click", 4, "ngIf"], ["class", "flex justify-center py-8", 4, "ngIf"], ["class", "overflow-x-auto", 4, "ngIf"], ["class", "text-center py-8", 4, "ngIf"], ["mat-icon-button", "", "color", "warn", "matTooltip", "Limpiar b\u00FAsqueda", 3, "click"], [1, "flex", "justify-center", "py-8"], ["diameter", "40"], [1, "overflow-x-auto"], ["mat-table", "", 1, "w-full", "files-table", 3, "dataSource"], ["matColumnDef", "numeroPedido"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "numeroInventario"], ["matColumnDef", "proceso"], ["matColumnDef", "operacion"], ["matColumnDef", "tipoCliente"], ["matColumnDef", "vehiculo"], ["matColumnDef", "year"], ["matColumnDef", "modelo"], ["matColumnDef", "vin"], ["matColumnDef", "agencia"], ["matColumnDef", "fechaRegistro"], ["matColumnDef", "actions"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", "class", "hover:bg-gray-50 cursor-pointer", 3, "click", 4, "matRowDef", "matRowDefColumns"], ["class", "mt-2", 3, "length", "pageSize", "pageIndex", "pageSizeOptions", "showFirstLastButtons", "page", 4, "ngIf"], ["mat-header-cell", ""], ["mat-cell", ""], [1, "mr-1", "text-blue-600", 2, "font-size", "14px"], [1, "font-medium"], ["class", "text-sm", 4, "ngIf", "ngIfElse"], ["noInventory", ""], [1, "text-sm"], [1, "text-gray-400", "italic", "text-sm"], ["noProcess", ""], ["noOperation", ""], ["noClientType", ""], ["noVehicle", ""], ["noYear", ""], ["noModel", ""], ["class", "text-sm font-mono", 4, "ngIf", "ngIfElse"], ["noVin", ""], [1, "text-sm", "font-mono"], ["noAgency", ""], ["noDate", ""], ["mat-icon-button", "", "matTooltip", "Opciones del pedido", 3, "matMenuTriggerFor", 4, "ngIf"], ["actionsMenu", "matMenu"], ["mat-menu-item", "", 3, "click"], ["mat-icon-button", "", "matTooltip", "Opciones del pedido", 3, "matMenuTriggerFor"], ["mat-header-row", ""], ["mat-row", "", 1, "hover:bg-gray-50", "cursor-pointer", 3, "click"], [1, "mt-2", 3, "length", "pageSize", "pageIndex", "pageSizeOptions", "showFirstLastButtons", "page"], [1, "text-center", "py-8"], ["mat-button", "", "color", "primary", 1, "mt-2", 3, "click"], [1, "documents-section", "mb-2"], [1, "pb-1", "flex", "flex-col", "md:flex-row", "md:items-center", "md:justify-between", "gap-2"], [1, "flex", "flex-col", "text-sm"], [1, "flex", "items-center", "mb-1"], [1, "font-semibold"], [1, "text-xs", "text-gray-600", "ml-6"], [1, "flex", "items-center", "md:ml-4"], ["mat-stroked-button", "", "color", "primary", 1, "text-xs", 3, "disabled", "click"], [1, "mr-1", 2, "font-size", "14px"], ["class", "space-y-2", 4, "ngIf"], [1, "space-y-2"], ["class", "document-item flex items-center justify-between p-2 border border-gray-200 rounded hover:bg-gray-50", 4, "ngFor", "ngForOf"], [1, "document-item", "flex", "items-center", "justify-between", "p-2", "border", "border-gray-200", "rounded", "hover:bg-gray-50"], [1, "flex", "items-center", "space-x-2", "flex-1"], [2, "font-size", "16px"], [1, "flex-1"], [1, "font-medium", "text-gray-900", "text-sm"], ["class", "text-xs text-gray-500", 4, "ngIf"], [1, "flex", "items-center", "space-x-1"], [1, "file-input-container"], ["type", "file", "accept", ".pdf,.jpg,.jpeg,.png,.doc,.docx", 1, "hidden", 3, "id", "change"], ["fileInput", ""], ["mat-stroked-button", "", 1, "text-xs", 3, "disabled", "click"], ["mat-raised-button", "", "color", "primary", 1, "text-xs", 3, "disabled", "click"], ["mat-raised-button", "", "color", "accent", 1, "text-xs", 3, "disabled", "click"], [1, "text-xs", "text-gray-500"]],
    template: function LiquidacionComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "mat-card", 2)(3, "mat-card-content", 3)(4, "div", 4)(5, "div", 5)(6, "mat-form-field", 6)(7, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](8, "Agencia");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](9, "mat-select", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("selectionChange", function LiquidacionComponent_Template_mat_select_selectionChange_9_listener($event) {
          return ctx.onAgencyChange($event.value);
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](10, "mat-option", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](11, "Todas las agencias");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](12, LiquidacionComponent_mat_option_12_Template, 2, 2, "mat-option", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](13, "div", 10)(14, "mat-form-field", 11)(15, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](16, "Buscar Cliente");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](17, "input", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("ngModelChange", function LiquidacionComponent_Template_input_ngModelChange_17_listener($event) {
          return ctx.clientSearchTerm = $event;
        })("keyup.enter", function LiquidacionComponent_Template_input_keyup_enter_17_listener() {
          return ctx.searchClients();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](18, "div", 13)(19, "button", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function LiquidacionComponent_Template_button_click_19_listener() {
          return ctx.searchClients();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](20, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](21, "search");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](22, " Buscar ");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](23, LiquidacionComponent_button_23_Template, 4, 0, "button", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](24, LiquidacionComponent_div_24_Template, 5, 0, "div", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](25, LiquidacionComponent_div_25_Template, 39, 6, "div", 17)(26, LiquidacionComponent_div_26_Template, 22, 6, "div", 18)(27, LiquidacionComponent_div_27_Template, 20, 13, "div", 19);
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
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("disabled", ctx.clientsLoading || ctx.clientSearchTerm.trim().length < 1);
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
    styles: [".liquidacion-container[_ngcontent-%COMP%] {\n  padding: 16px;\n  max-width: 100%;\n  margin: 0 auto;\n}\n\n.filters-section[_ngcontent-%COMP%]   .mat-card[_ngcontent-%COMP%] {\n  border-radius: 8px;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);\n}\n.filters-section[_ngcontent-%COMP%]   .mat-form-field[_ngcontent-%COMP%]   .mat-form-field-wrapper[_ngcontent-%COMP%] {\n  padding-bottom: 0;\n}\n\n.client-info-section[_ngcontent-%COMP%]   .mat-card[_ngcontent-%COMP%] {\n  border-radius: 8px;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);\n}\n.client-info-section[_ngcontent-%COMP%]   .field-group[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n.client-info-section[_ngcontent-%COMP%]   .field-label[_ngcontent-%COMP%] {\n  font-size: 12px;\n  font-weight: 500;\n  color: #6b7280;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n}\n.client-info-section[_ngcontent-%COMP%]   .field-value[_ngcontent-%COMP%] {\n  font-size: 14px;\n  color: #111827;\n  font-weight: 500;\n}\n\n.files-section[_ngcontent-%COMP%]   .mat-card[_ngcontent-%COMP%] {\n  border-radius: 8px;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);\n}\n.files-section[_ngcontent-%COMP%]   .files-table[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.files-section[_ngcontent-%COMP%]   .files-table[_ngcontent-%COMP%]   .mat-header-cell[_ngcontent-%COMP%] {\n  font-weight: 600;\n  font-size: 12px;\n  color: #374151;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n  border-bottom: 2px solid #e5e7eb;\n}\n.files-section[_ngcontent-%COMP%]   .files-table[_ngcontent-%COMP%]   .mat-cell[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: #111827;\n  border-bottom: 1px solid #f3f4f6;\n  padding: 8px 12px;\n}\n.files-section[_ngcontent-%COMP%]   .files-table[_ngcontent-%COMP%]   .mat-row[_ngcontent-%COMP%] {\n  transition: background-color 0.2s ease;\n}\n.files-section[_ngcontent-%COMP%]   .files-table[_ngcontent-%COMP%]   .mat-row[_ngcontent-%COMP%]:hover {\n  background-color: #f9fafb;\n}\n.files-section[_ngcontent-%COMP%]   .mat-paginator[_ngcontent-%COMP%] {\n  background-color: transparent;\n  border-top: 1px solid #e5e7eb;\n}\n.files-section[_ngcontent-%COMP%]   .mat-paginator[_ngcontent-%COMP%]   .mat-paginator-page-size-label[_ngcontent-%COMP%], .files-section[_ngcontent-%COMP%]   .mat-paginator[_ngcontent-%COMP%]   .mat-paginator-range-label[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: #6b7280;\n}\n\n.documents-section[_ngcontent-%COMP%]   .mat-card[_ngcontent-%COMP%] {\n  border-radius: 8px;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);\n}\n.documents-section[_ngcontent-%COMP%]   .document-item[_ngcontent-%COMP%] {\n  transition: all 0.2s ease;\n  border-radius: 6px;\n}\n.documents-section[_ngcontent-%COMP%]   .document-item[_ngcontent-%COMP%]:hover {\n  background-color: #f9fafb;\n  border-color: #d1d5db;\n}\n.documents-section[_ngcontent-%COMP%]   .file-input-container[_ngcontent-%COMP%] {\n  position: relative;\n}\n.documents-section[_ngcontent-%COMP%]   .file-input-container[_ngcontent-%COMP%]   input[type=file][_ngcontent-%COMP%] {\n  position: absolute;\n  opacity: 0;\n  pointer-events: none;\n}\n\n.mat-raised-button[_ngcontent-%COMP%] {\n  border-radius: 6px;\n  font-weight: 500;\n  text-transform: none;\n}\n.mat-raised-button.mat-primary[_ngcontent-%COMP%] {\n  background-color: #3b82f6;\n  color: white;\n}\n.mat-raised-button.mat-primary[_ngcontent-%COMP%]:hover {\n  background-color: #2563eb;\n}\n.mat-raised-button.mat-warn[_ngcontent-%COMP%] {\n  background-color: #ef4444;\n  color: white;\n}\n.mat-raised-button.mat-warn[_ngcontent-%COMP%]:hover {\n  background-color: #dc2626;\n}\n\n.mat-stroked-button[_ngcontent-%COMP%] {\n  border-radius: 6px;\n  font-weight: 500;\n  text-transform: none;\n  border-color: #d1d5db;\n  color: #374151;\n}\n.mat-stroked-button[_ngcontent-%COMP%]:hover {\n  background-color: #f9fafb;\n  border-color: #9ca3af;\n}\n\n.mat-icon-button[_ngcontent-%COMP%] {\n  border-radius: 6px;\n}\n.mat-icon-button[_ngcontent-%COMP%]:hover {\n  background-color: #f3f4f6;\n}\n\n.text-blue-600[_ngcontent-%COMP%] {\n  color: #2563eb !important;\n}\n\n.text-green-600[_ngcontent-%COMP%] {\n  color: #16a34a !important;\n}\n\n.text-yellow-600[_ngcontent-%COMP%] {\n  color: #ca8a04 !important;\n}\n\n.text-orange-600[_ngcontent-%COMP%] {\n  color: #ea580c !important;\n}\n\n.text-red-600[_ngcontent-%COMP%] {\n  color: #dc2626 !important;\n}\n\n.text-red-800[_ngcontent-%COMP%] {\n  color: #991b1b !important;\n}\n\n.text-gray-400[_ngcontent-%COMP%] {\n  color: #9ca3af !important;\n}\n\n.text-gray-500[_ngcontent-%COMP%] {\n  color: #6b7280 !important;\n}\n\n.text-gray-600[_ngcontent-%COMP%] {\n  color: #4b5563 !important;\n}\n\n@media (max-width: 768px) {\n  .liquidacion-container[_ngcontent-%COMP%] {\n    padding: 8px;\n  }\n  .filters-section[_ngcontent-%COMP%]   .flex[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 12px;\n  }\n  .filters-section[_ngcontent-%COMP%]   .mat-form-field[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n  .client-info-section[_ngcontent-%COMP%]   .grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .files-section[_ngcontent-%COMP%]   .files-table[_ngcontent-%COMP%] {\n    font-size: 12px;\n  }\n  .files-section[_ngcontent-%COMP%]   .files-table[_ngcontent-%COMP%]   .mat-cell[_ngcontent-%COMP%] {\n    padding: 6px 8px;\n  }\n  .documents-section[_ngcontent-%COMP%]   .document-item[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: stretch;\n    gap: 8px;\n  }\n  .documents-section[_ngcontent-%COMP%]   .document-item[_ngcontent-%COMP%]   .flex[_ngcontent-%COMP%] {\n    justify-content: space-between;\n  }\n}\n.mat-spinner[_ngcontent-%COMP%] {\n  margin: 0 auto;\n}\n\n.text-center[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%] {\n  opacity: 0.6;\n}\n.text-center[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 8px 0;\n}\n\n.mat-tooltip[_ngcontent-%COMP%] {\n  font-size: 12px;\n  background-color: #374151;\n  color: white;\n  border-radius: 4px;\n  padding: 4px 8px;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvcHJvY2Vzb3MvbGlxdWlkYWNpb24vbGlxdWlkYWNpb24uY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxhQUFBO0VBQ0EsZUFBQTtFQUNBLGNBQUE7QUFDRjs7QUFHRTtFQUNFLGtCQUFBO0VBQ0Esd0NBQUE7QUFBSjtBQUlJO0VBQ0UsaUJBQUE7QUFGTjs7QUFRRTtFQUNFLGtCQUFBO0VBQ0Esd0NBQUE7QUFMSjtBQVFFO0VBQ0UsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsUUFBQTtBQU5KO0FBU0U7RUFDRSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxjQUFBO0VBQ0EseUJBQUE7RUFDQSxzQkFBQTtBQVBKO0FBVUU7RUFDRSxlQUFBO0VBQ0EsY0FBQTtFQUNBLGdCQUFBO0FBUko7O0FBYUU7RUFDRSxrQkFBQTtFQUNBLHdDQUFBO0FBVko7QUFhRTtFQUNFLFdBQUE7QUFYSjtBQWFJO0VBQ0UsZ0JBQUE7RUFDQSxlQUFBO0VBQ0EsY0FBQTtFQUNBLHlCQUFBO0VBQ0Esc0JBQUE7RUFDQSxnQ0FBQTtBQVhOO0FBY0k7RUFDRSxlQUFBO0VBQ0EsY0FBQTtFQUNBLGdDQUFBO0VBQ0EsaUJBQUE7QUFaTjtBQWVJO0VBQ0Usc0NBQUE7QUFiTjtBQWVNO0VBQ0UseUJBQUE7QUFiUjtBQWtCRTtFQUNFLDZCQUFBO0VBQ0EsNkJBQUE7QUFoQko7QUFrQkk7O0VBRUUsZUFBQTtFQUNBLGNBQUE7QUFoQk47O0FBc0JFO0VBQ0Usa0JBQUE7RUFDQSx3Q0FBQTtBQW5CSjtBQXNCRTtFQUNFLHlCQUFBO0VBQ0Esa0JBQUE7QUFwQko7QUFzQkk7RUFDRSx5QkFBQTtFQUNBLHFCQUFBO0FBcEJOO0FBd0JFO0VBQ0Usa0JBQUE7QUF0Qko7QUF3Qkk7RUFDRSxrQkFBQTtFQUNBLFVBQUE7RUFDQSxvQkFBQTtBQXRCTjs7QUE0QkE7RUFDRSxrQkFBQTtFQUNBLGdCQUFBO0VBQ0Esb0JBQUE7QUF6QkY7QUEyQkU7RUFDRSx5QkFBQTtFQUNBLFlBQUE7QUF6Qko7QUEyQkk7RUFDRSx5QkFBQTtBQXpCTjtBQTZCRTtFQUNFLHlCQUFBO0VBQ0EsWUFBQTtBQTNCSjtBQTZCSTtFQUNFLHlCQUFBO0FBM0JOOztBQWdDQTtFQUNFLGtCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxvQkFBQTtFQUNBLHFCQUFBO0VBQ0EsY0FBQTtBQTdCRjtBQStCRTtFQUNFLHlCQUFBO0VBQ0EscUJBQUE7QUE3Qko7O0FBaUNBO0VBQ0Usa0JBQUE7QUE5QkY7QUFnQ0U7RUFDRSx5QkFBQTtBQTlCSjs7QUFtQ0E7RUFDRSx5QkFBQTtBQWhDRjs7QUFtQ0E7RUFDRSx5QkFBQTtBQWhDRjs7QUFtQ0E7RUFDRSx5QkFBQTtBQWhDRjs7QUFtQ0E7RUFDRSx5QkFBQTtBQWhDRjs7QUFtQ0E7RUFDRSx5QkFBQTtBQWhDRjs7QUFtQ0E7RUFDRSx5QkFBQTtBQWhDRjs7QUFtQ0E7RUFDRSx5QkFBQTtBQWhDRjs7QUFtQ0E7RUFDRSx5QkFBQTtBQWhDRjs7QUFtQ0E7RUFDRSx5QkFBQTtBQWhDRjs7QUFvQ0E7RUFDRTtJQUNFLFlBQUE7RUFqQ0Y7RUFxQ0U7SUFDRSxzQkFBQTtJQUNBLFNBQUE7RUFuQ0o7RUFzQ0U7SUFDRSxXQUFBO0VBcENKO0VBeUNFO0lBQ0UsMEJBQUE7RUF2Q0o7RUE0Q0U7SUFDRSxlQUFBO0VBMUNKO0VBNENJO0lBQ0UsZ0JBQUE7RUExQ047RUFnREU7SUFDRSxzQkFBQTtJQUNBLG9CQUFBO0lBQ0EsUUFBQTtFQTlDSjtFQWdESTtJQUNFLDhCQUFBO0VBOUNOO0FBQ0Y7QUFvREE7RUFDRSxjQUFBO0FBbERGOztBQXVERTtFQUNFLFlBQUE7QUFwREo7QUF1REU7RUFDRSxhQUFBO0FBckRKOztBQTBEQTtFQUNFLGVBQUE7RUFDQSx5QkFBQTtFQUNBLFlBQUE7RUFDQSxrQkFBQTtFQUNBLGdCQUFBO0FBdkRGIiwic291cmNlc0NvbnRlbnQiOlsiLmxpcXVpZGFjaW9uLWNvbnRhaW5lciB7XHJcbiAgcGFkZGluZzogMTZweDtcclxuICBtYXgtd2lkdGg6IDEwMCU7XHJcbiAgbWFyZ2luOiAwIGF1dG87XHJcbn1cclxuXHJcbi5maWx0ZXJzLXNlY3Rpb24ge1xyXG4gIC5tYXQtY2FyZCB7XHJcbiAgICBib3JkZXItcmFkaXVzOiA4cHg7XHJcbiAgICBib3gtc2hhZG93OiAwIDFweCAzcHggcmdiYSgwLCAwLCAwLCAwLjEpO1xyXG4gIH1cclxuICBcclxuICAubWF0LWZvcm0tZmllbGQge1xyXG4gICAgLm1hdC1mb3JtLWZpZWxkLXdyYXBwZXIge1xyXG4gICAgICBwYWRkaW5nLWJvdHRvbTogMDtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi5jbGllbnQtaW5mby1zZWN0aW9uIHtcclxuICAubWF0LWNhcmQge1xyXG4gICAgYm9yZGVyLXJhZGl1czogOHB4O1xyXG4gICAgYm94LXNoYWRvdzogMCAxcHggM3B4IHJnYmEoMCwgMCwgMCwgMC4xKTtcclxuICB9XHJcbiAgXHJcbiAgLmZpZWxkLWdyb3VwIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgZ2FwOiA0cHg7XHJcbiAgfVxyXG4gIFxyXG4gIC5maWVsZC1sYWJlbCB7XHJcbiAgICBmb250LXNpemU6IDEycHg7XHJcbiAgICBmb250LXdlaWdodDogNTAwO1xyXG4gICAgY29sb3I6ICM2YjcyODA7XHJcbiAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgbGV0dGVyLXNwYWNpbmc6IDAuMDVlbTtcclxuICB9XHJcbiAgXHJcbiAgLmZpZWxkLXZhbHVlIHtcclxuICAgIGZvbnQtc2l6ZTogMTRweDtcclxuICAgIGNvbG9yOiAjMTExODI3O1xyXG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcclxuICB9XHJcbn1cclxuXHJcbi5maWxlcy1zZWN0aW9uIHtcclxuICAubWF0LWNhcmQge1xyXG4gICAgYm9yZGVyLXJhZGl1czogOHB4O1xyXG4gICAgYm94LXNoYWRvdzogMCAxcHggM3B4IHJnYmEoMCwgMCwgMCwgMC4xKTtcclxuICB9XHJcbiAgXHJcbiAgLmZpbGVzLXRhYmxlIHtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgXHJcbiAgICAubWF0LWhlYWRlci1jZWxsIHtcclxuICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAgICAgZm9udC1zaXplOiAxMnB4O1xyXG4gICAgICBjb2xvcjogIzM3NDE1MTtcclxuICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMDVlbTtcclxuICAgICAgYm9yZGVyLWJvdHRvbTogMnB4IHNvbGlkICNlNWU3ZWI7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC5tYXQtY2VsbCB7XHJcbiAgICAgIGZvbnQtc2l6ZTogMTNweDtcclxuICAgICAgY29sb3I6ICMxMTE4Mjc7XHJcbiAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZjNmNGY2O1xyXG4gICAgICBwYWRkaW5nOiA4cHggMTJweDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLm1hdC1yb3cge1xyXG4gICAgICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuMnMgZWFzZTtcclxuICAgICAgXHJcbiAgICAgICY6aG92ZXIge1xyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmOWZhZmI7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgLm1hdC1wYWdpbmF0b3Ige1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XHJcbiAgICBib3JkZXItdG9wOiAxcHggc29saWQgI2U1ZTdlYjtcclxuICAgIFxyXG4gICAgLm1hdC1wYWdpbmF0b3ItcGFnZS1zaXplLWxhYmVsLFxyXG4gICAgLm1hdC1wYWdpbmF0b3ItcmFuZ2UtbGFiZWwge1xyXG4gICAgICBmb250LXNpemU6IDEycHg7XHJcbiAgICAgIGNvbG9yOiAjNmI3MjgwO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLmRvY3VtZW50cy1zZWN0aW9uIHtcclxuICAubWF0LWNhcmQge1xyXG4gICAgYm9yZGVyLXJhZGl1czogOHB4O1xyXG4gICAgYm94LXNoYWRvdzogMCAxcHggM3B4IHJnYmEoMCwgMCwgMCwgMC4xKTtcclxuICB9XHJcbiAgXHJcbiAgLmRvY3VtZW50LWl0ZW0ge1xyXG4gICAgdHJhbnNpdGlvbjogYWxsIDAuMnMgZWFzZTtcclxuICAgIGJvcmRlci1yYWRpdXM6IDZweDtcclxuICAgIFxyXG4gICAgJjpob3ZlciB7XHJcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmOWZhZmI7XHJcbiAgICAgIGJvcmRlci1jb2xvcjogI2QxZDVkYjtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgLmZpbGUtaW5wdXQtY29udGFpbmVyIHtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgIFxyXG4gICAgaW5wdXRbdHlwZT1cImZpbGVcIl0ge1xyXG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgIG9wYWNpdHk6IDA7XHJcbiAgICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLy8gRXN0aWxvcyBwYXJhIGJvdG9uZXNcclxuLm1hdC1yYWlzZWQtYnV0dG9uIHtcclxuICBib3JkZXItcmFkaXVzOiA2cHg7XHJcbiAgZm9udC13ZWlnaHQ6IDUwMDtcclxuICB0ZXh0LXRyYW5zZm9ybTogbm9uZTtcclxuICBcclxuICAmLm1hdC1wcmltYXJ5IHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICMzYjgyZjY7XHJcbiAgICBjb2xvcjogd2hpdGU7XHJcbiAgICBcclxuICAgICY6aG92ZXIge1xyXG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMjU2M2ViO1xyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICAmLm1hdC13YXJuIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICNlZjQ0NDQ7XHJcbiAgICBjb2xvcjogd2hpdGU7XHJcbiAgICBcclxuICAgICY6aG92ZXIge1xyXG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZGMyNjI2O1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLm1hdC1zdHJva2VkLWJ1dHRvbiB7XHJcbiAgYm9yZGVyLXJhZGl1czogNnB4O1xyXG4gIGZvbnQtd2VpZ2h0OiA1MDA7XHJcbiAgdGV4dC10cmFuc2Zvcm06IG5vbmU7XHJcbiAgYm9yZGVyLWNvbG9yOiAjZDFkNWRiO1xyXG4gIGNvbG9yOiAjMzc0MTUxO1xyXG4gIFxyXG4gICY6aG92ZXIge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2Y5ZmFmYjtcclxuICAgIGJvcmRlci1jb2xvcjogIzljYTNhZjtcclxuICB9XHJcbn1cclxuXHJcbi5tYXQtaWNvbi1idXR0b24ge1xyXG4gIGJvcmRlci1yYWRpdXM6IDZweDtcclxuICBcclxuICAmOmhvdmVyIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICNmM2Y0ZjY7XHJcbiAgfVxyXG59XHJcblxyXG4vLyBFc3RpbG9zIHBhcmEgaWNvbm9zIGRlIGVzdGFkb1xyXG4udGV4dC1ibHVlLTYwMCB7XHJcbiAgY29sb3I6ICMyNTYzZWIgIWltcG9ydGFudDtcclxufVxyXG5cclxuLnRleHQtZ3JlZW4tNjAwIHtcclxuICBjb2xvcjogIzE2YTM0YSAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4udGV4dC15ZWxsb3ctNjAwIHtcclxuICBjb2xvcjogI2NhOGEwNCAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4udGV4dC1vcmFuZ2UtNjAwIHtcclxuICBjb2xvcjogI2VhNTgwYyAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4udGV4dC1yZWQtNjAwIHtcclxuICBjb2xvcjogI2RjMjYyNiAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4udGV4dC1yZWQtODAwIHtcclxuICBjb2xvcjogIzk5MWIxYiAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4udGV4dC1ncmF5LTQwMCB7XHJcbiAgY29sb3I6ICM5Y2EzYWYgIWltcG9ydGFudDtcclxufVxyXG5cclxuLnRleHQtZ3JheS01MDAge1xyXG4gIGNvbG9yOiAjNmI3MjgwICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbi50ZXh0LWdyYXktNjAwIHtcclxuICBjb2xvcjogIzRiNTU2MyAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4vLyBSZXNwb25zaXZlIGRlc2lnblxyXG5AbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcclxuICAubGlxdWlkYWNpb24tY29udGFpbmVyIHtcclxuICAgIHBhZGRpbmc6IDhweDtcclxuICB9XHJcbiAgXHJcbiAgLmZpbHRlcnMtc2VjdGlvbiB7XHJcbiAgICAuZmxleCB7XHJcbiAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICAgIGdhcDogMTJweDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLm1hdC1mb3JtLWZpZWxkIHtcclxuICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIC5jbGllbnQtaW5mby1zZWN0aW9uIHtcclxuICAgIC5ncmlkIHtcclxuICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIC5maWxlcy1zZWN0aW9uIHtcclxuICAgIC5maWxlcy10YWJsZSB7XHJcbiAgICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgICAgXHJcbiAgICAgIC5tYXQtY2VsbCB7XHJcbiAgICAgICAgcGFkZGluZzogNnB4IDhweDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICAuZG9jdW1lbnRzLXNlY3Rpb24ge1xyXG4gICAgLmRvY3VtZW50LWl0ZW0ge1xyXG4gICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgICBhbGlnbi1pdGVtczogc3RyZXRjaDtcclxuICAgICAgZ2FwOiA4cHg7XHJcbiAgICAgIFxyXG4gICAgICAuZmxleCB7XHJcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vLyBMb2FkaW5nIHN0YXRlc1xyXG4ubWF0LXNwaW5uZXIge1xyXG4gIG1hcmdpbjogMCBhdXRvO1xyXG59XHJcblxyXG4vLyBFbXB0eSBzdGF0ZXNcclxuLnRleHQtY2VudGVyIHtcclxuICAubWF0LWljb24ge1xyXG4gICAgb3BhY2l0eTogMC42O1xyXG4gIH1cclxuICBcclxuICBwIHtcclxuICAgIG1hcmdpbjogOHB4IDA7XHJcbiAgfVxyXG59XHJcblxyXG4vLyBUb29sdGlwIHN0eWxlc1xyXG4ubWF0LXRvb2x0aXAge1xyXG4gIGZvbnQtc2l6ZTogMTJweDtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzc0MTUxO1xyXG4gIGNvbG9yOiB3aGl0ZTtcclxuICBib3JkZXItcmFkaXVzOiA0cHg7XHJcbiAgcGFkZGluZzogNHB4IDhweDtcclxufVxyXG5cclxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ })

}]);
//# sourceMappingURL=src_app_pages_procesos_liquidacion_liquidacion_component_ts.js.map