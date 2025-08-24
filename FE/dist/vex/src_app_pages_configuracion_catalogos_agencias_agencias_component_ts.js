"use strict";
(self["webpackChunkvex"] = self["webpackChunkvex"] || []).push([["src_app_pages_configuracion_catalogos_agencias_agencias_component_ts"],{

/***/ 2065:
/*!******************************************************************************!*\
  !*** ./src/app/pages/configuracion/catalogos/agencias/agencias.component.ts ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AgenciasComponent: () => (/* binding */ AgenciasComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 6575);
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/card */ 8497);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/icon */ 6515);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/button */ 895);
/* harmony import */ var _angular_material_table__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/table */ 6798);
/* harmony import */ var _angular_material_paginator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/paginator */ 9687);
/* harmony import */ var _angular_material_sort__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/sort */ 7963);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/form-field */ 1333);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/input */ 26);
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/select */ 6355);
/* harmony import */ var _angular_material_chips__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/chips */ 1757);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/dialog */ 7401);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/snack-bar */ 9409);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/core */ 5309);























function AgenciasComponent_th_124_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "th", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "C\u00F3digo");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function AgenciasComponent_td_125_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "td", 58)(1, "div", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const agencia_r16 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", agencia_r16.codigo, " ");
  }
}
function AgenciasComponent_th_127_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "th", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Nombre");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function AgenciasComponent_td_128_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "td", 58)(1, "div", 27)(2, "div", 60)(3, "mat-icon", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, "business");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div")(6, "div", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "div", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const agencia_r17 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](agencia_r17.nombre);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](agencia_r17.direccion);
  }
}
function AgenciasComponent_th_130_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "th", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Tipo");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function AgenciasComponent_td_131_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "td", 58)(1, "mat-chip", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const agencia_r18 = ctx.$implicit;
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("color", ctx_r5.getTipoColor(agencia_r18.tipo));
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", agencia_r18.tipo, " ");
  }
}
function AgenciasComponent_th_133_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "th", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Regi\u00F3n");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function AgenciasComponent_td_134_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "td", 58)(1, "span", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const agencia_r19 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](agencia_r19.region);
  }
}
function AgenciasComponent_th_136_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "th", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Estado");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function AgenciasComponent_td_137_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "td", 58)(1, "span", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const agencia_r20 = ctx.$implicit;
    const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassMap"](ctx_r9.getEstadoClass(agencia_r20.estado));
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", agencia_r20.estado, " ");
  }
}
function AgenciasComponent_th_139_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "th", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "\u00DAltima Actualizaci\u00F3n");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function AgenciasComponent_td_140_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "td", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const agencia_r21 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](agencia_r21.ultimaActualizacion);
  }
}
function AgenciasComponent_th_142_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "th", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Acciones");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function AgenciasComponent_td_143_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "td", 58)(1, "button", 67)(2, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "edit");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "button", 68)(5, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, "visibility");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "button", 69)(8, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "delete");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
  }
}
function AgenciasComponent_tr_144_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "tr", 70);
  }
}
function AgenciasComponent_tr_145_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "tr", 71);
  }
}
class AgenciasComponent {
  getTipoColor(tipo) {
    switch (tipo) {
      case 'Principal':
        return 'warn';
      case 'Sucursal':
        return 'primary';
      case 'Satélite':
        return 'accent';
      case 'Temporal':
        return 'primary';
      default:
        return 'primary';
    }
  }
  getEstadoClass(estado) {
    switch (estado) {
      case 'Activa':
        return 'bg-green-100 text-green-800';
      case 'Inactiva':
        return 'bg-red-100 text-red-800';
      case 'En Suspensión':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
  constructor() {
    this.agencias = [{
      codigo: 'AG-001',
      nombre: 'Agencia Central',
      direccion: 'Av. Principal 123, Centro',
      tipo: 'Principal',
      region: 'Centro',
      estado: 'Activa',
      ultimaActualizacion: 'Hace 2 horas'
    }, {
      codigo: 'AG-002',
      nombre: 'Sucursal Norte',
      direccion: 'Calle Norte 456, Zona Norte',
      tipo: 'Sucursal',
      region: 'Norte',
      estado: 'Activa',
      ultimaActualizacion: 'Hace 1 día'
    }, {
      codigo: 'AG-003',
      nombre: 'Oficina Sur',
      direccion: 'Blvd. Sur 789, Zona Sur',
      tipo: 'Sucursal',
      region: 'Sur',
      estado: 'Activa',
      ultimaActualizacion: 'Hace 3 días'
    }, {
      codigo: 'AG-004',
      nombre: 'Punto Este',
      direccion: 'Calle Este 321, Zona Este',
      tipo: 'Satélite',
      region: 'Este',
      estado: 'En Suspensión',
      ultimaActualizacion: 'Hace 1 semana'
    }, {
      codigo: 'AG-005',
      nombre: 'Oficina Oeste',
      direccion: 'Av. Oeste 654, Zona Oeste',
      tipo: 'Sucursal',
      region: 'Oeste',
      estado: 'Activa',
      ultimaActualizacion: 'Hace 5 días'
    }];
    this.columnasAgencias = ['codigo', 'nombre', 'tipo', 'region', 'estado', 'ultimaActualizacion', 'acciones'];
  }
  static #_ = this.ɵfac = function AgenciasComponent_Factory(t) {
    return new (t || AgenciasComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
    type: AgenciasComponent,
    selectors: [["app-agencias"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵStandaloneFeature"]],
    decls: 159,
    vars: 3,
    consts: [[1, "p-6"], [1, "mb-6"], [1, "text-3xl", "font-bold", "text-gray-800", "mb-2"], [1, "text-gray-600"], ["mat-raised-button", "", "color", "primary", 1, "mr-4"], ["mat-button", "", "color", "accent"], ["mat-button", ""], [1, "p-4"], [1, "grid", "grid-cols-1", "md:grid-cols-4", "gap-4"], [1, "w-full"], ["matInput", "", "placeholder", "Nombre, c\u00F3digo o ubicaci\u00F3n"], ["matSuffix", ""], ["value", "todos"], ["value", "activa"], ["value", "inactiva"], ["value", "suspension"], ["value", "principal"], ["value", "sucursal"], ["value", "satelite"], ["value", "temporal"], ["value", "norte"], ["value", "sur"], ["value", "este"], ["value", "oeste"], ["value", "centro"], [1, "grid", "grid-cols-1", "md:grid-cols-4", "gap-6", "mb-6"], [1, "bg-blue-50", "border-l-4", "border-blue-500"], [1, "flex", "items-center"], [1, "text-blue-600", "mr-3"], [1, "text-2xl", "font-bold", "text-blue-600"], [1, "text-sm", "text-blue-600"], [1, "bg-green-50", "border-l-4", "border-green-500"], [1, "text-green-600", "mr-3"], [1, "text-2xl", "font-bold", "text-green-600"], [1, "text-sm", "text-green-600"], [1, "bg-orange-50", "border-l-4", "border-orange-500"], [1, "text-orange-600", "mr-3"], [1, "text-2xl", "font-bold", "text-orange-600"], [1, "text-sm", "text-orange-600"], [1, "bg-red-50", "border-l-4", "border-red-500"], [1, "text-red-600", "mr-3"], [1, "text-2xl", "font-bold", "text-red-600"], [1, "text-sm", "text-red-600"], [1, "p-0"], ["mat-table", "", 1, "w-full", 3, "dataSource"], ["matColumnDef", "codigo"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "nombre"], ["matColumnDef", "tipo"], ["matColumnDef", "region"], ["matColumnDef", "estado"], ["matColumnDef", "ultimaActualizacion"], ["matColumnDef", "acciones"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", 4, "matRowDef", "matRowDefColumns"], ["mat-button", "", "color", "primary"], ["mat-header-cell", ""], ["mat-cell", ""], [1, "font-mono", "text-sm", "bg-gray-100", "px-2", "py-1", "rounded"], [1, "w-10", "h-10", "bg-blue-100", "rounded-full", "flex", "items-center", "justify-center", "mr-3"], [1, "text-blue-600", "text-lg"], [1, "font-medium"], [1, "text-sm", "text-gray-500"], ["selected", "", 3, "color"], [1, "px-2", "py-1", "bg-gray-100", "rounded", "text-xs"], [1, "px-2", "py-1", "rounded", "text-xs"], ["mat-icon-button", "", "color", "primary", "title", "Editar", 1, "mr-2"], ["mat-icon-button", "", "color", "accent", "title", "Ver Detalles", 1, "mr-2"], ["mat-icon-button", "", "color", "warn", "title", "Eliminar"], ["mat-header-row", ""], ["mat-row", ""]],
    template: function AgenciasComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h1", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Cat\u00E1logo de Agencias");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "p", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Gesti\u00F3n del cat\u00E1logo maestro de agencias del sistema del expediente \u00FAnico");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 1)(7, "button", 4)(8, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "add");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10, " Nueva Agencia ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "button", 5)(12, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "upload");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14, " Importar Cat\u00E1logo ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "button", 6)(16, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, "download");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](18, " Exportar Cat\u00E1logo ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "button", 6)(20, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](21, "refresh");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, " Sincronizar ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "mat-card", 1)(24, "mat-card-content", 7)(25, "div", 8)(26, "mat-form-field", 9)(27, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](28, "Buscar Agencia");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](29, "input", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "mat-icon", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](31, "search");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "mat-form-field", 9)(33, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](34, "Estado");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](35, "mat-select")(36, "mat-option", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](37, "Todas las Agencias");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](38, "mat-option", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](39, "Activa");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](40, "mat-option", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](41, "Inactiva");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](42, "mat-option", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](43, "En Suspensi\u00F3n");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](44, "mat-form-field", 9)(45, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](46, "Tipo de Agencia");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](47, "mat-select")(48, "mat-option", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](49, "Todos los Tipos");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](50, "mat-option", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](51, "Principal");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](52, "mat-option", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](53, "Sucursal");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](54, "mat-option", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](55, "Sat\u00E9lite");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](56, "mat-option", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](57, "Temporal");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](58, "mat-form-field", 9)(59, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](60, "Regi\u00F3n");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](61, "mat-select")(62, "mat-option", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](63, "Todas las Regiones");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](64, "mat-option", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](65, "Norte");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](66, "mat-option", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](67, "Sur");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](68, "mat-option", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](69, "Este");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](70, "mat-option", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](71, "Oeste");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](72, "mat-option", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](73, "Centro");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](74, "div", 25)(75, "mat-card", 26)(76, "mat-card-content", 7)(77, "div", 27)(78, "mat-icon", 28);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](79, "business");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](80, "div")(81, "div", 29);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](82, "156");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](83, "div", 30);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](84, "Total de Agencias");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](85, "mat-card", 31)(86, "mat-card-content", 7)(87, "div", 27)(88, "mat-icon", 32);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](89, "check_circle");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](90, "div")(91, "div", 33);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](92, "142");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](93, "div", 34);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](94, "Agencias Activas");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](95, "mat-card", 35)(96, "mat-card-content", 7)(97, "div", 27)(98, "mat-icon", 36);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](99, "pending");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](100, "div")(101, "div", 37);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](102, "8");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](103, "div", 38);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](104, "En Suspensi\u00F3n");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](105, "mat-card", 39)(106, "mat-card-content", 7)(107, "div", 27)(108, "mat-icon", 40);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](109, "cancel");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](110, "div")(111, "div", 41);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](112, "6");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](113, "div", 42);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](114, "Inactivas");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](115, "mat-card")(116, "mat-card-header")(117, "mat-card-title");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](118, "Lista de Agencias");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](119, "mat-card-subtitle");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](120, "Cat\u00E1logo completo de agencias registradas en el sistema");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](121, "mat-card-content", 43)(122, "table", 44);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](123, 45);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](124, AgenciasComponent_th_124_Template, 2, 0, "th", 46)(125, AgenciasComponent_td_125_Template, 3, 1, "td", 47);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](126, 48);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](127, AgenciasComponent_th_127_Template, 2, 0, "th", 46)(128, AgenciasComponent_td_128_Template, 10, 2, "td", 47);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](129, 49);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](130, AgenciasComponent_th_130_Template, 2, 0, "th", 46)(131, AgenciasComponent_td_131_Template, 3, 2, "td", 47);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](132, 50);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](133, AgenciasComponent_th_133_Template, 2, 0, "th", 46)(134, AgenciasComponent_td_134_Template, 3, 1, "td", 47);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](135, 51);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](136, AgenciasComponent_th_136_Template, 2, 0, "th", 46)(137, AgenciasComponent_td_137_Template, 3, 3, "td", 47);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](138, 52);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](139, AgenciasComponent_th_139_Template, 2, 0, "th", 46)(140, AgenciasComponent_td_140_Template, 2, 1, "td", 47);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](141, 53);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](142, AgenciasComponent_th_142_Template, 2, 0, "th", 46)(143, AgenciasComponent_td_143_Template, 10, 0, "td", 47);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](144, AgenciasComponent_tr_144_Template, 1, 0, "tr", 54)(145, AgenciasComponent_tr_145_Template, 1, 0, "tr", 55);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](146, "mat-card-actions")(147, "button", 56)(148, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](149, "add");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](150, " Agregar Agencia ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](151, "button", 5)(152, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](153, "sync");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](154, " Sincronizar Cat\u00E1logo ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](155, "button", 6)(156, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](157, "report");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](158, " Generar Reporte ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](122);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("dataSource", ctx.agencias);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](22);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("matHeaderRowDef", ctx.columnasAgencias);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("matRowDefColumns", ctx.columnasAgencias);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.CommonModule, _angular_material_card__WEBPACK_IMPORTED_MODULE_2__.MatCardModule, _angular_material_card__WEBPACK_IMPORTED_MODULE_2__.MatCard, _angular_material_card__WEBPACK_IMPORTED_MODULE_2__.MatCardActions, _angular_material_card__WEBPACK_IMPORTED_MODULE_2__.MatCardContent, _angular_material_card__WEBPACK_IMPORTED_MODULE_2__.MatCardHeader, _angular_material_card__WEBPACK_IMPORTED_MODULE_2__.MatCardSubtitle, _angular_material_card__WEBPACK_IMPORTED_MODULE_2__.MatCardTitle, _angular_material_icon__WEBPACK_IMPORTED_MODULE_3__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_3__.MatIcon, _angular_material_button__WEBPACK_IMPORTED_MODULE_4__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_4__.MatButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_4__.MatIconButton, _angular_material_table__WEBPACK_IMPORTED_MODULE_5__.MatTableModule, _angular_material_table__WEBPACK_IMPORTED_MODULE_5__.MatTable, _angular_material_table__WEBPACK_IMPORTED_MODULE_5__.MatHeaderCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_5__.MatHeaderRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_5__.MatColumnDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_5__.MatCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_5__.MatRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_5__.MatHeaderCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_5__.MatCell, _angular_material_table__WEBPACK_IMPORTED_MODULE_5__.MatHeaderRow, _angular_material_table__WEBPACK_IMPORTED_MODULE_5__.MatRow, _angular_material_paginator__WEBPACK_IMPORTED_MODULE_6__.MatPaginatorModule, _angular_material_sort__WEBPACK_IMPORTED_MODULE_7__.MatSortModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__.MatFormFieldModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__.MatFormField, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__.MatLabel, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__.MatSuffix, _angular_material_input__WEBPACK_IMPORTED_MODULE_9__.MatInputModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_9__.MatInput, _angular_material_select__WEBPACK_IMPORTED_MODULE_10__.MatSelectModule, _angular_material_select__WEBPACK_IMPORTED_MODULE_10__.MatSelect, _angular_material_core__WEBPACK_IMPORTED_MODULE_11__.MatOption, _angular_material_chips__WEBPACK_IMPORTED_MODULE_12__.MatChipsModule, _angular_material_chips__WEBPACK_IMPORTED_MODULE_12__.MatChip, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_13__.MatDialogModule, _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_14__.MatSnackBarModule],
    styles: [".grid[_ngcontent-%COMP%] {\n      display: grid;\n    }\n    \n    .grid-cols-1[_ngcontent-%COMP%] {\n      grid-template-columns: repeat(1, minmax(0, 1fr));\n    }\n    \n    .md\\:grid-cols-4[_ngcontent-%COMP%] {\n      grid-template-columns: repeat(4, minmax(0, 1fr));\n    }\n    \n    .gap-4[_ngcontent-%COMP%] {\n      gap: 1rem;\n    }\n    \n    .gap-6[_ngcontent-%COMP%] {\n      gap: 1.5rem;\n    }\n    \n    .w-full[_ngcontent-%COMP%] {\n      width: 100%;\n    }\n    \n    .border-l-4[_ngcontent-%COMP%] {\n      border-left-width: 4px;\n    }\n    \n    .font-mono[_ngcontent-%COMP%] {\n      font-family: ui-monospace, SFMono-Regular, \"SF Mono\", Consolas, \"Liberation Mono\", Menlo, monospace;\n    }\n  \n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvY29uZmlndXJhY2lvbi9jYXRhbG9nb3MvYWdlbmNpYXMvYWdlbmNpYXMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7SUFDSTtNQUNFLGFBQWE7SUFDZjs7SUFFQTtNQUNFLGdEQUFnRDtJQUNsRDs7SUFFQTtNQUNFLGdEQUFnRDtJQUNsRDs7SUFFQTtNQUNFLFNBQVM7SUFDWDs7SUFFQTtNQUNFLFdBQVc7SUFDYjs7SUFFQTtNQUNFLFdBQVc7SUFDYjs7SUFFQTtNQUNFLHNCQUFzQjtJQUN4Qjs7SUFFQTtNQUNFLG1HQUFtRztJQUNyRyIsInNvdXJjZXNDb250ZW50IjpbIlxuICAgIC5ncmlkIHtcbiAgICAgIGRpc3BsYXk6IGdyaWQ7XG4gICAgfVxuICAgIFxuICAgIC5ncmlkLWNvbHMtMSB7XG4gICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgxLCBtaW5tYXgoMCwgMWZyKSk7XG4gICAgfVxuICAgIFxuICAgIC5tZFxcOmdyaWQtY29scy00IHtcbiAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDQsIG1pbm1heCgwLCAxZnIpKTtcbiAgICB9XG4gICAgXG4gICAgLmdhcC00IHtcbiAgICAgIGdhcDogMXJlbTtcbiAgICB9XG4gICAgXG4gICAgLmdhcC02IHtcbiAgICAgIGdhcDogMS41cmVtO1xuICAgIH1cbiAgICBcbiAgICAudy1mdWxsIHtcbiAgICAgIHdpZHRoOiAxMDAlO1xuICAgIH1cbiAgICBcbiAgICAuYm9yZGVyLWwtNCB7XG4gICAgICBib3JkZXItbGVmdC13aWR0aDogNHB4O1xuICAgIH1cbiAgICBcbiAgICAuZm9udC1tb25vIHtcbiAgICAgIGZvbnQtZmFtaWx5OiB1aS1tb25vc3BhY2UsIFNGTW9uby1SZWd1bGFyLCBcIlNGIE1vbm9cIiwgQ29uc29sYXMsIFwiTGliZXJhdGlvbiBNb25vXCIsIE1lbmxvLCBtb25vc3BhY2U7XG4gICAgfVxuICAiXSwic291cmNlUm9vdCI6IiJ9 */"]
  });
}

/***/ }),

/***/ 1757:
/*!***********************************************************!*\
  !*** ./node_modules/@angular/material/fesm2022/chips.mjs ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MAT_CHIP: () => (/* binding */ MAT_CHIP),
/* harmony export */   MAT_CHIPS_DEFAULT_OPTIONS: () => (/* binding */ MAT_CHIPS_DEFAULT_OPTIONS),
/* harmony export */   MAT_CHIP_AVATAR: () => (/* binding */ MAT_CHIP_AVATAR),
/* harmony export */   MAT_CHIP_LISTBOX_CONTROL_VALUE_ACCESSOR: () => (/* binding */ MAT_CHIP_LISTBOX_CONTROL_VALUE_ACCESSOR),
/* harmony export */   MAT_CHIP_REMOVE: () => (/* binding */ MAT_CHIP_REMOVE),
/* harmony export */   MAT_CHIP_TRAILING_ICON: () => (/* binding */ MAT_CHIP_TRAILING_ICON),
/* harmony export */   MatChip: () => (/* binding */ MatChip),
/* harmony export */   MatChipAvatar: () => (/* binding */ MatChipAvatar),
/* harmony export */   MatChipEditInput: () => (/* binding */ MatChipEditInput),
/* harmony export */   MatChipGrid: () => (/* binding */ MatChipGrid),
/* harmony export */   MatChipGridChange: () => (/* binding */ MatChipGridChange),
/* harmony export */   MatChipInput: () => (/* binding */ MatChipInput),
/* harmony export */   MatChipListbox: () => (/* binding */ MatChipListbox),
/* harmony export */   MatChipListboxChange: () => (/* binding */ MatChipListboxChange),
/* harmony export */   MatChipOption: () => (/* binding */ MatChipOption),
/* harmony export */   MatChipRemove: () => (/* binding */ MatChipRemove),
/* harmony export */   MatChipRow: () => (/* binding */ MatChipRow),
/* harmony export */   MatChipSelectionChange: () => (/* binding */ MatChipSelectionChange),
/* harmony export */   MatChipSet: () => (/* binding */ MatChipSet),
/* harmony export */   MatChipTrailingIcon: () => (/* binding */ MatChipTrailingIcon),
/* harmony export */   MatChipsModule: () => (/* binding */ MatChipsModule)
/* harmony export */ });
/* harmony import */ var _angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/cdk/coercion */ 5998);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ 6575);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/core */ 5309);
/* harmony import */ var _angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/cdk/a11y */ 3170);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 2513);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 7835);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ 1527);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs/operators */ 274);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! rxjs/operators */ 5043);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! rxjs/operators */ 1891);
/* harmony import */ var _angular_cdk_keycodes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/cdk/keycodes */ 554);
/* harmony import */ var _angular_cdk_bidi__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/cdk/bidi */ 4565);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/forms */ 8849);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/form-field */ 1333);


















/** Injection token to be used to override the default options for the chips module. */
function MatChip_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojection"](1, 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function MatChip_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojection"](1, 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
const _c0 = ["*", [["mat-chip-avatar"], ["", "matChipAvatar", ""]], [["mat-chip-trailing-icon"], ["", "matChipRemove", ""], ["", "matChipTrailingIcon", ""]]];
const _c1 = ["*", "mat-chip-avatar, [matChipAvatar]", "mat-chip-trailing-icon,[matChipRemove],[matChipTrailingIcon]"];
function MatChipOption_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojection"](1, 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "span", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "svg", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](4, "path", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
  }
}
function MatChipOption_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojection"](1, 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
const _c2 = ".mdc-evolution-chip,.mdc-evolution-chip__cell,.mdc-evolution-chip__action{display:inline-flex;align-items:center}.mdc-evolution-chip{position:relative;max-width:100%}.mdc-evolution-chip .mdc-elevation-overlay{width:100%;height:100%;top:0;left:0}.mdc-evolution-chip__cell,.mdc-evolution-chip__action{height:100%}.mdc-evolution-chip__cell--primary{overflow-x:hidden}.mdc-evolution-chip__cell--trailing{flex:1 0 auto}.mdc-evolution-chip__action{align-items:center;background:none;border:none;box-sizing:content-box;cursor:pointer;display:inline-flex;justify-content:center;outline:none;padding:0;text-decoration:none;color:inherit}.mdc-evolution-chip__action--presentational{cursor:auto}.mdc-evolution-chip--disabled,.mdc-evolution-chip__action:disabled{pointer-events:none}.mdc-evolution-chip__action--primary{overflow-x:hidden}.mdc-evolution-chip__action--trailing{position:relative;overflow:visible}.mdc-evolution-chip__action--primary:before{box-sizing:border-box;content:\"\";height:100%;left:0;position:absolute;pointer-events:none;top:0;width:100%;z-index:1}.mdc-evolution-chip--touch{margin-top:8px;margin-bottom:8px}.mdc-evolution-chip__action-touch{position:absolute;top:50%;height:48px;left:0;right:0;transform:translateY(-50%)}.mdc-evolution-chip__text-label{white-space:nowrap;user-select:none;text-overflow:ellipsis;overflow:hidden}.mdc-evolution-chip__graphic{align-items:center;display:inline-flex;justify-content:center;overflow:hidden;pointer-events:none;position:relative;flex:1 0 auto}.mdc-evolution-chip__checkmark{position:absolute;opacity:0;top:50%;left:50%}.mdc-evolution-chip--selectable:not(.mdc-evolution-chip--selected):not(.mdc-evolution-chip--with-primary-icon) .mdc-evolution-chip__graphic{width:0}.mdc-evolution-chip__checkmark-background{opacity:0}.mdc-evolution-chip__checkmark-svg{display:block}.mdc-evolution-chip__checkmark-path{stroke-width:2px;stroke-dasharray:29.7833385;stroke-dashoffset:29.7833385;stroke:currentColor}.mdc-evolution-chip--selecting .mdc-evolution-chip__graphic{transition:width 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--selecting .mdc-evolution-chip__checkmark{transition:transform 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1);transform:translate(-75%, -50%)}.mdc-evolution-chip--selecting .mdc-evolution-chip__checkmark-path{transition:stroke-dashoffset 150ms 45ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--deselecting .mdc-evolution-chip__graphic{transition:width 100ms 0ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--deselecting .mdc-evolution-chip__checkmark{transition:opacity 50ms 0ms linear,transform 100ms 0ms cubic-bezier(0.4, 0, 0.2, 1);transform:translate(-75%, -50%)}.mdc-evolution-chip--deselecting .mdc-evolution-chip__checkmark-path{stroke-dashoffset:0}.mdc-evolution-chip--selecting-with-primary-icon .mdc-evolution-chip__icon--primary{transition:opacity 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--selecting-with-primary-icon .mdc-evolution-chip__checkmark-path{transition:stroke-dashoffset 150ms 75ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--deselecting-with-primary-icon .mdc-evolution-chip__icon--primary{transition:opacity 150ms 75ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--deselecting-with-primary-icon .mdc-evolution-chip__checkmark{transition:opacity 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1);transform:translate(-50%, -50%)}.mdc-evolution-chip--deselecting-with-primary-icon .mdc-evolution-chip__checkmark-path{stroke-dashoffset:0}.mdc-evolution-chip--selected .mdc-evolution-chip__icon--primary{opacity:0}.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark{transform:translate(-50%, -50%);opacity:1}.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark-path{stroke-dashoffset:0}@keyframes mdc-evolution-chip-enter{from{transform:scale(0.8);opacity:.4}to{transform:scale(1);opacity:1}}.mdc-evolution-chip--enter{animation:mdc-evolution-chip-enter 100ms 0ms cubic-bezier(0, 0, 0.2, 1)}@keyframes mdc-evolution-chip-exit{from{opacity:1}to{opacity:0}}.mdc-evolution-chip--exit{animation:mdc-evolution-chip-exit 75ms 0ms cubic-bezier(0.4, 0, 1, 1)}.mdc-evolution-chip--hidden{opacity:0;pointer-events:none;transition:width 150ms 0ms cubic-bezier(0.4, 0, 1, 1)}.mat-mdc-standard-chip{border-radius:var(--mdc-chip-container-shape-radius);height:var(--mdc-chip-container-height)}.mat-mdc-standard-chip .mdc-evolution-chip__ripple{border-radius:var(--mdc-chip-container-shape-radius)}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary:before{border-radius:var(--mdc-chip-container-shape-radius)}.mat-mdc-standard-chip .mdc-evolution-chip__icon--primary{border-radius:var(--mdc-chip-with-avatar-avatar-shape-radius)}.mat-mdc-standard-chip.mdc-evolution-chip--selectable:not(.mdc-evolution-chip--with-primary-icon){--mdc-chip-graphic-selected-width:var(--mdc-chip-with-avatar-avatar-size)}.mat-mdc-standard-chip .mdc-evolution-chip__graphic{height:var(--mdc-chip-with-avatar-avatar-size);width:var(--mdc-chip-with-avatar-avatar-size);font-size:var(--mdc-chip-with-avatar-avatar-size)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled){background-color:var(--mdc-chip-elevated-container-color)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled{background-color:var(--mdc-chip-elevated-disabled-container-color)}.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled{background-color:var(--mdc-chip-elevated-disabled-container-color)}.mat-mdc-standard-chip .mdc-evolution-chip__text-label{font-family:var(--mdc-chip-label-text-font);line-height:var(--mdc-chip-label-text-line-height);font-size:var(--mdc-chip-label-text-size);font-weight:var(--mdc-chip-label-text-weight);letter-spacing:var(--mdc-chip-label-text-tracking)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__text-label{color:var(--mdc-chip-label-text-color)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__text-label{color:var(--mdc-chip-disabled-label-text-color)}.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled .mdc-evolution-chip__text-label{color:var(--mdc-chip-disabled-label-text-color)}.mat-mdc-standard-chip .mdc-evolution-chip__icon--primary{height:var(--mdc-chip-with-icon-icon-size);width:var(--mdc-chip-with-icon-icon-size);font-size:var(--mdc-chip-with-icon-icon-size)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__icon--primary{color:var(--mdc-chip-with-icon-icon-color)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--primary{color:var(--mdc-chip-with-icon-disabled-icon-color)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__checkmark{color:var(--mdc-chip-with-icon-selected-icon-color)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__checkmark{color:var(--mdc-chip-with-icon-disabled-icon-color)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__icon--trailing{color:var(--mdc-chip-with-trailing-icon-trailing-icon-color)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing{color:var(--mdc-chip-with-trailing-icon-disabled-trailing-icon-color)}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary.mdc-ripple-upgraded--background-focused .mdc-evolution-chip__ripple::before,.mat-mdc-standard-chip .mdc-evolution-chip__action--primary:not(.mdc-ripple-upgraded):focus .mdc-evolution-chip__ripple::before{transition-duration:75ms;opacity:var(--mdc-chip-focus-state-layer-opacity)}.mat-mdc-chip-focus-overlay{background:var(--mdc-chip-focus-state-layer-color);opacity:var(--mdc-chip-focus-state-layer-opacity)}.mat-mdc-standard-chip .mdc-evolution-chip__checkmark{height:20px;width:20px}.mat-mdc-standard-chip .mdc-evolution-chip__icon--trailing{height:18px;width:18px;font-size:18px}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:12px}[dir=rtl] .mat-mdc-standard-chip .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:12px;padding-right:12px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic{padding-left:6px;padding-right:6px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic[dir=rtl]{padding-left:6px;padding-right:6px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary{padding-left:0;padding-right:12px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:12px;padding-right:0}.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing{padding-left:8px;padding-right:8px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing,.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing[dir=rtl]{padding-left:8px;padding-right:8px}.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing{left:8px;right:initial}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing,.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing[dir=rtl]{left:initial;right:8px}.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:0}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:0;padding-right:12px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic{padding-left:6px;padding-right:6px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic[dir=rtl]{padding-left:6px;padding-right:6px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing{padding-left:8px;padding-right:8px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing[dir=rtl]{padding-left:8px;padding-right:8px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing{left:8px;right:initial}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing[dir=rtl]{left:initial;right:8px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:0;padding-right:0}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__checkmark{color:var(--mdc-chip-with-icon-selected-icon-color, currentColor)}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic{padding-left:4px;padding-right:8px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic[dir=rtl]{padding-left:8px;padding-right:4px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary{padding-left:0;padding-right:12px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:12px;padding-right:0}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic{padding-left:4px;padding-right:8px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic[dir=rtl]{padding-left:8px;padding-right:4px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing{padding-left:8px;padding-right:8px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing[dir=rtl]{padding-left:8px;padding-right:8px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing{left:8px;right:initial}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing[dir=rtl]{left:initial;right:8px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:0;padding-right:0}.mat-mdc-standard-chip{-webkit-tap-highlight-color:rgba(0,0,0,0)}.cdk-high-contrast-active .mat-mdc-standard-chip{outline:solid 1px}.cdk-high-contrast-active .mat-mdc-standard-chip .mdc-evolution-chip__checkmark-path{stroke:CanvasText !important}.mat-mdc-standard-chip.mdc-evolution-chip--disabled{opacity:.4}.mat-mdc-standard-chip .mdc-evolution-chip__cell--primary,.mat-mdc-standard-chip .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip .mat-mdc-chip-action-label{overflow:visible}.mat-mdc-standard-chip .mdc-evolution-chip__cell--primary{flex-basis:100%}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary{font:inherit;letter-spacing:inherit;white-space:inherit}.mat-mdc-standard-chip .mat-mdc-chip-graphic,.mat-mdc-standard-chip .mat-mdc-chip-trailing-icon{box-sizing:content-box}.mat-mdc-standard-chip._mat-animation-noopable,.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__graphic,.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__checkmark,.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__checkmark-path{transition-duration:1ms;animation-duration:1ms}.mat-mdc-basic-chip .mdc-evolution-chip__action--primary{font:inherit}.mat-mdc-chip-focus-overlay{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;opacity:0;border-radius:inherit;transition:opacity 150ms linear}._mat-animation-noopable .mat-mdc-chip-focus-overlay{transition:none}.mat-mdc-basic-chip .mat-mdc-chip-focus-overlay{display:none}.mat-mdc-chip:hover .mat-mdc-chip-focus-overlay{opacity:.04}.mat-mdc-chip.cdk-focused .mat-mdc-chip-focus-overlay{opacity:.12}.mat-mdc-chip .mat-ripple.mat-mdc-chip-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:inherit}.mat-mdc-chip-avatar{text-align:center;line-height:1;color:var(--mdc-chip-with-icon-icon-color, currentColor)}.mat-mdc-chip{position:relative;z-index:0}.mat-mdc-chip-action-label{text-align:left;z-index:1}[dir=rtl] .mat-mdc-chip-action-label{text-align:right}.mat-mdc-chip.mdc-evolution-chip--with-trailing-action .mat-mdc-chip-action-label{position:relative}.mat-mdc-chip-action-label .mat-mdc-chip-primary-focus-indicator{position:absolute;top:0;right:0;bottom:0;left:0;pointer-events:none}.mat-mdc-chip-action-label .mat-mdc-focus-indicator::before{margin:calc(calc(var(--mat-mdc-focus-indicator-border-width, 3px) + 2px)*-1)}.mat-mdc-chip-remove{opacity:.54}.mat-mdc-chip-remove:focus{opacity:1}.mat-mdc-chip-remove::before{margin:calc(var(--mat-mdc-focus-indicator-border-width, 3px)*-1);left:8px;right:8px}.mat-mdc-chip-remove .mat-icon{width:inherit;height:inherit;font-size:inherit;box-sizing:content-box}.mat-chip-edit-input{cursor:text;display:inline-block;color:inherit;outline:0}.cdk-high-contrast-active .mat-mdc-chip-selected:not(.mat-mdc-chip-multiple){outline-width:3px}.mat-mdc-chip-action:focus .mat-mdc-focus-indicator::before{content:\"\"}";
function MatChipRow_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "span", 7);
  }
}
function MatChipRow_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojection"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function MatChipRow_Conditional_4_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojection"](0, 1);
  }
}
function MatChipRow_Conditional_4_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "span", 9);
  }
}
function MatChipRow_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](0, MatChipRow_Conditional_4_Conditional_0_Template, 1, 0)(1, MatChipRow_Conditional_4_Conditional_1_Template, 1, 0);
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵconditional"](0, ctx_r2.contentEditInput ? 0 : 1);
  }
}
function MatChipRow_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojection"](0, 2);
  }
}
function MatChipRow_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojection"](1, 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
const _c3 = [[["mat-chip-avatar"], ["", "matChipAvatar", ""]], [["", "matChipEditInput", ""]], "*", [["mat-chip-trailing-icon"], ["", "matChipRemove", ""], ["", "matChipTrailingIcon", ""]]];
const _c4 = ["mat-chip-avatar, [matChipAvatar]", "[matChipEditInput]", "*", "mat-chip-trailing-icon,[matChipRemove],[matChipTrailingIcon]"];
const _c5 = ["*"];
const _c6 = ".mdc-evolution-chip-set{display:flex}.mdc-evolution-chip-set:focus{outline:none}.mdc-evolution-chip-set__chips{display:flex;flex-flow:wrap;min-width:0}.mdc-evolution-chip-set--overflow .mdc-evolution-chip-set__chips{flex-flow:nowrap}.mdc-evolution-chip-set .mdc-evolution-chip-set__chips{margin-left:-8px;margin-right:0}[dir=rtl] .mdc-evolution-chip-set .mdc-evolution-chip-set__chips,.mdc-evolution-chip-set .mdc-evolution-chip-set__chips[dir=rtl]{margin-left:0;margin-right:-8px}.mdc-evolution-chip-set .mdc-evolution-chip{margin-left:8px;margin-right:0}[dir=rtl] .mdc-evolution-chip-set .mdc-evolution-chip,.mdc-evolution-chip-set .mdc-evolution-chip[dir=rtl]{margin-left:0;margin-right:8px}.mdc-evolution-chip-set .mdc-evolution-chip{margin-top:4px;margin-bottom:4px}.mat-mdc-chip-set .mdc-evolution-chip-set__chips{min-width:100%}.mat-mdc-chip-set-stacked{flex-direction:column;align-items:flex-start}.mat-mdc-chip-set-stacked .mat-mdc-chip{width:100%}.mat-mdc-chip-set-stacked .mdc-evolution-chip__graphic{flex-grow:0}.mat-mdc-chip-set-stacked .mdc-evolution-chip__action--primary{flex-basis:100%;justify-content:start}input.mat-mdc-chip-input{flex:1 0 150px;margin-left:8px}[dir=rtl] input.mat-mdc-chip-input{margin-left:0;margin-right:8px}";
const MAT_CHIPS_DEFAULT_OPTIONS = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.InjectionToken('mat-chips-default-options', {
  providedIn: 'root',
  factory: () => ({
    separatorKeyCodes: [_angular_cdk_keycodes__WEBPACK_IMPORTED_MODULE_1__.ENTER]
  })
});
/**
 * Injection token that can be used to reference instances of `MatChipAvatar`. It serves as
 * alternative token to the actual `MatChipAvatar` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
const MAT_CHIP_AVATAR = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.InjectionToken('MatChipAvatar');
/**
 * Injection token that can be used to reference instances of `MatChipTrailingIcon`. It serves as
 * alternative token to the actual `MatChipTrailingIcon` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
const MAT_CHIP_TRAILING_ICON = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.InjectionToken('MatChipTrailingIcon');
/**
 * Injection token that can be used to reference instances of `MatChipRemove`. It serves as
 * alternative token to the actual `MatChipRemove` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
const MAT_CHIP_REMOVE = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.InjectionToken('MatChipRemove');
/**
 * Injection token used to avoid a circular dependency between the `MatChip` and `MatChipAction`.
 */
const MAT_CHIP = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.InjectionToken('MatChip');
class _MatChipActionBase {}
const _MatChipActionMixinBase = (0,_angular_material_core__WEBPACK_IMPORTED_MODULE_2__.mixinTabIndex)(_MatChipActionBase, -1);
/**
 * Section within a chip.
 * @docs-private
 */
class MatChipAction extends _MatChipActionMixinBase {
  /** Whether the action is disabled. */
  get disabled() {
    return this._disabled || this._parentChip.disabled;
  }
  set disabled(value) {
    this._disabled = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_3__.coerceBooleanProperty)(value);
  }
  /**
   * Determine the value of the disabled attribute for this chip action.
   */
  _getDisabledAttribute() {
    // When this chip action is disabled and focusing disabled chips is not permitted, return empty
    // string to indicate that disabled attribute should be included.
    return this.disabled && !this._allowFocusWhenDisabled ? '' : null;
  }
  /**
   * Determine the value of the tabindex attribute for this chip action.
   */
  _getTabindex() {
    return this.disabled && !this._allowFocusWhenDisabled || !this.isInteractive ? null : this.tabIndex.toString();
  }
  constructor(_elementRef, _parentChip) {
    super();
    this._elementRef = _elementRef;
    this._parentChip = _parentChip;
    /** Whether the action is interactive. */
    this.isInteractive = true;
    /** Whether this is the primary action in the chip. */
    this._isPrimary = true;
    this._disabled = false;
    /**
     * Private API to allow focusing this chip when it is disabled.
     */
    this._allowFocusWhenDisabled = false;
    if (_elementRef.nativeElement.nodeName === 'BUTTON') {
      _elementRef.nativeElement.setAttribute('type', 'button');
    }
  }
  focus() {
    this._elementRef.nativeElement.focus();
  }
  _handleClick(event) {
    if (!this.disabled && this.isInteractive && this._isPrimary) {
      event.preventDefault();
      this._parentChip._handlePrimaryActionInteraction();
    }
  }
  _handleKeydown(event) {
    if ((event.keyCode === _angular_cdk_keycodes__WEBPACK_IMPORTED_MODULE_1__.ENTER || event.keyCode === _angular_cdk_keycodes__WEBPACK_IMPORTED_MODULE_1__.SPACE) && !this.disabled && this.isInteractive && this._isPrimary && !this._parentChip._isEditing) {
      event.preventDefault();
      this._parentChip._handlePrimaryActionInteraction();
    }
  }
  static #_ = this.ɵfac = function MatChipAction_Factory(t) {
    return new (t || MatChipAction)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](MAT_CHIP));
  };
  static #_2 = this.ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineDirective"]({
    type: MatChipAction,
    selectors: [["", "matChipAction", ""]],
    hostAttrs: [1, "mdc-evolution-chip__action", "mat-mdc-chip-action"],
    hostVars: 9,
    hostBindings: function MatChipAction_HostBindings(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function MatChipAction_click_HostBindingHandler($event) {
          return ctx._handleClick($event);
        })("keydown", function MatChipAction_keydown_HostBindingHandler($event) {
          return ctx._handleKeydown($event);
        });
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵattribute"]("tabindex", ctx._getTabindex())("disabled", ctx._getDisabledAttribute())("aria-disabled", ctx.disabled);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("mdc-evolution-chip__action--primary", ctx._isPrimary)("mdc-evolution-chip__action--presentational", !ctx.isInteractive)("mdc-evolution-chip__action--trailing", !ctx._isPrimary);
      }
    },
    inputs: {
      disabled: "disabled",
      tabIndex: "tabIndex",
      isInteractive: "isInteractive",
      _allowFocusWhenDisabled: "_allowFocusWhenDisabled"
    },
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵInheritDefinitionFeature"]]
  });
}
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](MatChipAction, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
    args: [{
      selector: '[matChipAction]',
      inputs: ['disabled', 'tabIndex'],
      host: {
        'class': 'mdc-evolution-chip__action mat-mdc-chip-action',
        '[class.mdc-evolution-chip__action--primary]': '_isPrimary',
        '[class.mdc-evolution-chip__action--presentational]': '!isInteractive',
        '[class.mdc-evolution-chip__action--trailing]': '!_isPrimary',
        '[attr.tabindex]': '_getTabindex()',
        '[attr.disabled]': '_getDisabledAttribute()',
        '[attr.aria-disabled]': 'disabled',
        '(click)': '_handleClick($event)',
        '(keydown)': '_handleKeydown($event)'
      }
    }]
  }], () => [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef
  }, {
    type: undefined,
    decorators: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
      args: [MAT_CHIP]
    }]
  }], {
    isInteractive: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    disabled: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    _allowFocusWhenDisabled: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }]
  });
})();

/** Avatar image within a chip. */
class MatChipAvatar {
  static #_ = this.ɵfac = function MatChipAvatar_Factory(t) {
    return new (t || MatChipAvatar)();
  };
  static #_2 = this.ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineDirective"]({
    type: MatChipAvatar,
    selectors: [["mat-chip-avatar"], ["", "matChipAvatar", ""]],
    hostAttrs: ["role", "img", 1, "mat-mdc-chip-avatar", "mdc-evolution-chip__icon", "mdc-evolution-chip__icon--primary"],
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵProvidersFeature"]([{
      provide: MAT_CHIP_AVATAR,
      useExisting: MatChipAvatar
    }])]
  });
}
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](MatChipAvatar, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
    args: [{
      selector: 'mat-chip-avatar, [matChipAvatar]',
      host: {
        'class': 'mat-mdc-chip-avatar mdc-evolution-chip__icon mdc-evolution-chip__icon--primary',
        'role': 'img'
      },
      providers: [{
        provide: MAT_CHIP_AVATAR,
        useExisting: MatChipAvatar
      }]
    }]
  }], null, null);
})();
/** Non-interactive trailing icon in a chip. */
class MatChipTrailingIcon extends MatChipAction {
  constructor() {
    super(...arguments);
    /**
     * MDC considers all trailing actions as a remove icon,
     * but we support non-interactive trailing icons.
     */
    this.isInteractive = false;
    this._isPrimary = false;
  }
  static #_ = this.ɵfac = /* @__PURE__ */(() => {
    let ɵMatChipTrailingIcon_BaseFactory;
    return function MatChipTrailingIcon_Factory(t) {
      return (ɵMatChipTrailingIcon_BaseFactory || (ɵMatChipTrailingIcon_BaseFactory = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetInheritedFactory"](MatChipTrailingIcon)))(t || MatChipTrailingIcon);
    };
  })();
  static #_2 = this.ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineDirective"]({
    type: MatChipTrailingIcon,
    selectors: [["mat-chip-trailing-icon"], ["", "matChipTrailingIcon", ""]],
    hostAttrs: ["aria-hidden", "true", 1, "mat-mdc-chip-trailing-icon", "mdc-evolution-chip__icon", "mdc-evolution-chip__icon--trailing"],
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵProvidersFeature"]([{
      provide: MAT_CHIP_TRAILING_ICON,
      useExisting: MatChipTrailingIcon
    }]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵInheritDefinitionFeature"]]
  });
}
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](MatChipTrailingIcon, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
    args: [{
      selector: 'mat-chip-trailing-icon, [matChipTrailingIcon]',
      host: {
        'class': 'mat-mdc-chip-trailing-icon mdc-evolution-chip__icon mdc-evolution-chip__icon--trailing',
        'aria-hidden': 'true'
      },
      providers: [{
        provide: MAT_CHIP_TRAILING_ICON,
        useExisting: MatChipTrailingIcon
      }]
    }]
  }], null, null);
})();
/**
 * Directive to remove the parent chip when the trailing icon is clicked or
 * when the ENTER key is pressed on it.
 *
 * Recommended for use with the Material Design "cancel" icon
 * available at https://material.io/icons/#ic_cancel.
 *
 * Example:
 *
 * ```
 * <mat-chip>
 *   <mat-icon matChipRemove>cancel</mat-icon>
 * </mat-chip>
 * ```
 */
class MatChipRemove extends MatChipAction {
  constructor() {
    super(...arguments);
    this._isPrimary = false;
  }
  _handleClick(event) {
    if (!this.disabled) {
      event.stopPropagation();
      event.preventDefault();
      this._parentChip.remove();
    }
  }
  _handleKeydown(event) {
    if ((event.keyCode === _angular_cdk_keycodes__WEBPACK_IMPORTED_MODULE_1__.ENTER || event.keyCode === _angular_cdk_keycodes__WEBPACK_IMPORTED_MODULE_1__.SPACE) && !this.disabled) {
      event.stopPropagation();
      event.preventDefault();
      this._parentChip.remove();
    }
  }
  static #_ = this.ɵfac = /* @__PURE__ */(() => {
    let ɵMatChipRemove_BaseFactory;
    return function MatChipRemove_Factory(t) {
      return (ɵMatChipRemove_BaseFactory || (ɵMatChipRemove_BaseFactory = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetInheritedFactory"](MatChipRemove)))(t || MatChipRemove);
    };
  })();
  static #_2 = this.ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineDirective"]({
    type: MatChipRemove,
    selectors: [["", "matChipRemove", ""]],
    hostAttrs: ["role", "button", 1, "mat-mdc-chip-remove", "mat-mdc-chip-trailing-icon", "mat-mdc-focus-indicator", "mdc-evolution-chip__icon", "mdc-evolution-chip__icon--trailing"],
    hostVars: 1,
    hostBindings: function MatChipRemove_HostBindings(rf, ctx) {
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵattribute"]("aria-hidden", null);
      }
    },
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵProvidersFeature"]([{
      provide: MAT_CHIP_REMOVE,
      useExisting: MatChipRemove
    }]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵInheritDefinitionFeature"]]
  });
}
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](MatChipRemove, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
    args: [{
      selector: '[matChipRemove]',
      host: {
        'class': 'mat-mdc-chip-remove mat-mdc-chip-trailing-icon mat-mdc-focus-indicator ' + 'mdc-evolution-chip__icon mdc-evolution-chip__icon--trailing',
        'role': 'button',
        '[attr.aria-hidden]': 'null'
      },
      providers: [{
        provide: MAT_CHIP_REMOVE,
        useExisting: MatChipRemove
      }]
    }]
  }], null, null);
})();
let uid = 0;
/**
 * Boilerplate for applying mixins to MatChip.
 * @docs-private
 */
const _MatChipMixinBase = (0,_angular_material_core__WEBPACK_IMPORTED_MODULE_2__.mixinTabIndex)((0,_angular_material_core__WEBPACK_IMPORTED_MODULE_2__.mixinColor)((0,_angular_material_core__WEBPACK_IMPORTED_MODULE_2__.mixinDisableRipple)((0,_angular_material_core__WEBPACK_IMPORTED_MODULE_2__.mixinDisabled)(class {
  constructor(_elementRef) {
    this._elementRef = _elementRef;
  }
})), 'primary'), -1);
/**
 * Material design styled Chip base component. Used inside the MatChipSet component.
 *
 * Extended by MatChipOption and MatChipRow for different interaction patterns.
 */
class MatChip extends _MatChipMixinBase {
  _hasFocus() {
    return this._hasFocusInternal;
  }
  /**
   * The value of the chip. Defaults to the content inside
   * the `mat-mdc-chip-action-label` element.
   */
  get value() {
    return this._value !== undefined ? this._value : this._textElement.textContent.trim();
  }
  set value(value) {
    this._value = value;
  }
  /**
   * Determines whether or not the chip displays the remove styling and emits (removed) events.
   */
  get removable() {
    return this._removable;
  }
  set removable(value) {
    this._removable = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_3__.coerceBooleanProperty)(value);
  }
  /**
   * Colors the chip for emphasis as if it were selected.
   */
  get highlighted() {
    return this._highlighted;
  }
  set highlighted(value) {
    this._highlighted = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_3__.coerceBooleanProperty)(value);
  }
  /**
   * Reference to the MatRipple instance of the chip.
   * @deprecated Considered an implementation detail. To be removed.
   * @breaking-change 17.0.0
   */
  get ripple() {
    return this._rippleLoader?.getRipple(this._elementRef.nativeElement);
  }
  set ripple(v) {
    this._rippleLoader?.attachRipple(this._elementRef.nativeElement, v);
  }
  constructor(_changeDetectorRef, elementRef, _ngZone, _focusMonitor, _document, animationMode, _globalRippleOptions, tabIndex) {
    super(elementRef);
    this._changeDetectorRef = _changeDetectorRef;
    this._ngZone = _ngZone;
    this._focusMonitor = _focusMonitor;
    this._globalRippleOptions = _globalRippleOptions;
    /** Emits when the chip is focused. */
    this._onFocus = new rxjs__WEBPACK_IMPORTED_MODULE_4__.Subject();
    /** Emits when the chip is blurred. */
    this._onBlur = new rxjs__WEBPACK_IMPORTED_MODULE_4__.Subject();
    /** Role for the root of the chip. */
    this.role = null;
    /** Whether the chip has focus. */
    this._hasFocusInternal = false;
    /** A unique id for the chip. If none is supplied, it will be auto-generated. */
    this.id = `mat-mdc-chip-${uid++}`;
    // TODO(#26104): Consider deprecating and using `_computeAriaAccessibleName` instead.
    // `ariaLabel` may be unnecessary, and `_computeAriaAccessibleName` only supports
    // datepicker's use case.
    /** ARIA label for the content of the chip. */
    this.ariaLabel = null;
    // TODO(#26104): Consider deprecating and using `_computeAriaAccessibleName` instead.
    // `ariaDescription` may be unnecessary, and `_computeAriaAccessibleName` only supports
    // datepicker's use case.
    /** ARIA description for the content of the chip. */
    this.ariaDescription = null;
    /** Id of a span that contains this chip's aria description. */
    this._ariaDescriptionId = `${this.id}-aria-description`;
    this._removable = true;
    this._highlighted = false;
    /** Emitted when a chip is to be removed. */
    this.removed = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    /** Emitted when the chip is destroyed. */
    this.destroyed = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    /** The unstyled chip selector for this component. */
    this.basicChipAttrName = 'mat-basic-chip';
    /**
     * Handles the lazy creation of the MatChip ripple.
     * Used to improve initial load time of large applications.
     */
    this._rippleLoader = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_material_core__WEBPACK_IMPORTED_MODULE_2__.MatRippleLoader);
    this._document = _document;
    this._animationsDisabled = animationMode === 'NoopAnimations';
    if (tabIndex != null) {
      this.tabIndex = parseInt(tabIndex) ?? this.defaultTabIndex;
    }
    this._monitorFocus();
    this._rippleLoader?.configureRipple(this._elementRef.nativeElement, {
      className: 'mat-mdc-chip-ripple',
      disabled: this._isRippleDisabled()
    });
  }
  ngOnInit() {
    // This check needs to happen in `ngOnInit` so the overridden value of
    // `basicChipAttrName` coming from base classes can be picked up.
    const element = this._elementRef.nativeElement;
    this._isBasicChip = element.hasAttribute(this.basicChipAttrName) || element.tagName.toLowerCase() === this.basicChipAttrName;
  }
  ngAfterViewInit() {
    this._textElement = this._elementRef.nativeElement.querySelector('.mat-mdc-chip-action-label');
    if (this._pendingFocus) {
      this._pendingFocus = false;
      this.focus();
    }
  }
  ngAfterContentInit() {
    // Since the styling depends on the presence of some
    // actions, we have to mark for check on changes.
    this._actionChanges = (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.merge)(this._allLeadingIcons.changes, this._allTrailingIcons.changes, this._allRemoveIcons.changes).subscribe(() => this._changeDetectorRef.markForCheck());
  }
  ngDoCheck() {
    this._rippleLoader.setDisabled(this._elementRef.nativeElement, this._isRippleDisabled());
  }
  ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this._elementRef);
    this._rippleLoader?.destroyRipple(this._elementRef.nativeElement);
    this._actionChanges?.unsubscribe();
    this.destroyed.emit({
      chip: this
    });
    this.destroyed.complete();
  }
  /**
   * Allows for programmatic removal of the chip.
   *
   * Informs any listeners of the removal request. Does not remove the chip from the DOM.
   */
  remove() {
    if (this.removable) {
      this.removed.emit({
        chip: this
      });
    }
  }
  /** Whether or not the ripple should be disabled. */
  _isRippleDisabled() {
    return this.disabled || this.disableRipple || this._animationsDisabled || this._isBasicChip || !!this._globalRippleOptions?.disabled;
  }
  /** Returns whether the chip has a trailing icon. */
  _hasTrailingIcon() {
    return !!(this.trailingIcon || this.removeIcon);
  }
  /** Handles keyboard events on the chip. */
  _handleKeydown(event) {
    if (event.keyCode === _angular_cdk_keycodes__WEBPACK_IMPORTED_MODULE_1__.BACKSPACE || event.keyCode === _angular_cdk_keycodes__WEBPACK_IMPORTED_MODULE_1__.DELETE) {
      event.preventDefault();
      this.remove();
    }
  }
  /** Allows for programmatic focusing of the chip. */
  focus() {
    if (!this.disabled) {
      // If `focus` is called before `ngAfterViewInit`, we won't have access to the primary action.
      // This can happen if the consumer tries to focus a chip immediately after it is added.
      // Queue the method to be called again on init.
      if (this.primaryAction) {
        this.primaryAction.focus();
      } else {
        this._pendingFocus = true;
      }
    }
  }
  /** Gets the action that contains a specific target node. */
  _getSourceAction(target) {
    return this._getActions().find(action => {
      const element = action._elementRef.nativeElement;
      return element === target || element.contains(target);
    });
  }
  /** Gets all of the actions within the chip. */
  _getActions() {
    const result = [];
    if (this.primaryAction) {
      result.push(this.primaryAction);
    }
    if (this.removeIcon) {
      result.push(this.removeIcon);
    }
    if (this.trailingIcon) {
      result.push(this.trailingIcon);
    }
    return result;
  }
  /** Handles interactions with the primary action of the chip. */
  _handlePrimaryActionInteraction() {
    // Empty here, but is overwritten in child classes.
  }
  /** Starts the focus monitoring process on the chip. */
  _monitorFocus() {
    this._focusMonitor.monitor(this._elementRef, true).subscribe(origin => {
      const hasFocus = origin !== null;
      if (hasFocus !== this._hasFocusInternal) {
        this._hasFocusInternal = hasFocus;
        if (hasFocus) {
          this._onFocus.next({
            chip: this
          });
        } else {
          // When animations are enabled, Angular may end up removing the chip from the DOM a little
          // earlier than usual, causing it to be blurred and throwing off the logic in the chip list
          // that moves focus not the next item. To work around the issue, we defer marking the chip
          // as not focused until the next time the zone stabilizes.
          this._ngZone.onStable.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_6__.take)(1)).subscribe(() => this._ngZone.run(() => this._onBlur.next({
            chip: this
          })));
        }
      }
    });
  }
  static #_ = this.ɵfac = function MatChip_Factory(t) {
    return new (t || MatChip)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.ChangeDetectorRef), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.NgZone), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_7__.FocusMonitor), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_common__WEBPACK_IMPORTED_MODULE_8__.DOCUMENT), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.ANIMATION_MODULE_TYPE, 8), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_material_core__WEBPACK_IMPORTED_MODULE_2__.MAT_RIPPLE_GLOBAL_OPTIONS, 8), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinjectAttribute"]('tabindex'));
  };
  static #_2 = this.ɵcmp = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
    type: MatChip,
    selectors: [["mat-basic-chip"], ["", "mat-basic-chip", ""], ["mat-chip"], ["", "mat-chip", ""]],
    contentQueries: function MatChip_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵcontentQuery"](dirIndex, MAT_CHIP_AVATAR, 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵcontentQuery"](dirIndex, MAT_CHIP_TRAILING_ICON, 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵcontentQuery"](dirIndex, MAT_CHIP_REMOVE, 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵcontentQuery"](dirIndex, MAT_CHIP_AVATAR, 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵcontentQuery"](dirIndex, MAT_CHIP_TRAILING_ICON, 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵcontentQuery"](dirIndex, MAT_CHIP_REMOVE, 5);
      }
      if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.leadingIcon = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.trailingIcon = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.removeIcon = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx._allLeadingIcons = _t);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx._allTrailingIcons = _t);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx._allRemoveIcons = _t);
      }
    },
    viewQuery: function MatChip_Query(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵviewQuery"](MatChipAction, 5);
      }
      if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.primaryAction = _t.first);
      }
    },
    hostAttrs: [1, "mat-mdc-chip"],
    hostVars: 30,
    hostBindings: function MatChip_HostBindings(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("keydown", function MatChip_keydown_HostBindingHandler($event) {
          return ctx._handleKeydown($event);
        });
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵhostProperty"]("id", ctx.id);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵattribute"]("role", ctx.role)("tabindex", ctx.role ? ctx.tabIndex : null)("aria-label", ctx.ariaLabel);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("mdc-evolution-chip", !ctx._isBasicChip)("mdc-evolution-chip--disabled", ctx.disabled)("mdc-evolution-chip--with-trailing-action", ctx._hasTrailingIcon())("mdc-evolution-chip--with-primary-graphic", ctx.leadingIcon)("mdc-evolution-chip--with-primary-icon", ctx.leadingIcon)("mdc-evolution-chip--with-avatar", ctx.leadingIcon)("mat-mdc-chip-with-avatar", ctx.leadingIcon)("mat-mdc-chip-highlighted", ctx.highlighted)("mat-mdc-chip-disabled", ctx.disabled)("mat-mdc-basic-chip", ctx._isBasicChip)("mat-mdc-standard-chip", !ctx._isBasicChip)("mat-mdc-chip-with-trailing-icon", ctx._hasTrailingIcon())("_mat-animation-noopable", ctx._animationsDisabled);
      }
    },
    inputs: {
      color: "color",
      disabled: "disabled",
      disableRipple: "disableRipple",
      tabIndex: "tabIndex",
      role: "role",
      id: "id",
      ariaLabel: ["aria-label", "ariaLabel"],
      ariaDescription: ["aria-description", "ariaDescription"],
      value: "value",
      removable: "removable",
      highlighted: "highlighted"
    },
    outputs: {
      removed: "removed",
      destroyed: "destroyed"
    },
    exportAs: ["matChip"],
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵProvidersFeature"]([{
      provide: MAT_CHIP,
      useExisting: MatChip
    }]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵInheritDefinitionFeature"]],
    ngContentSelectors: _c1,
    decls: 8,
    vars: 3,
    consts: [[1, "mat-mdc-chip-focus-overlay"], [1, "mdc-evolution-chip__cell", "mdc-evolution-chip__cell--primary"], ["matChipAction", "", 3, "isInteractive"], ["class", "mdc-evolution-chip__graphic mat-mdc-chip-graphic"], [1, "mdc-evolution-chip__text-label", "mat-mdc-chip-action-label"], [1, "mat-mdc-chip-primary-focus-indicator", "mat-mdc-focus-indicator"], ["class", "mdc-evolution-chip__cell mdc-evolution-chip__cell--trailing"], [1, "mdc-evolution-chip__graphic", "mat-mdc-chip-graphic"], [1, "mdc-evolution-chip__cell", "mdc-evolution-chip__cell--trailing"]],
    template: function MatChip_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojectionDef"](_c0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "span", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "span", 1)(2, "span", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](3, MatChip_Conditional_3_Template, 2, 0, "span", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "span", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojection"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](6, "span", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](7, MatChip_Conditional_7_Template, 2, 0, "span", 6);
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("isInteractive", false);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵconditional"](3, ctx.leadingIcon ? 3 : -1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵconditional"](7, ctx._hasTrailingIcon() ? 7 : -1);
      }
    },
    dependencies: [MatChipAction],
    styles: [".mdc-evolution-chip,.mdc-evolution-chip__cell,.mdc-evolution-chip__action{display:inline-flex;align-items:center}.mdc-evolution-chip{position:relative;max-width:100%}.mdc-evolution-chip .mdc-elevation-overlay{width:100%;height:100%;top:0;left:0}.mdc-evolution-chip__cell,.mdc-evolution-chip__action{height:100%}.mdc-evolution-chip__cell--primary{overflow-x:hidden}.mdc-evolution-chip__cell--trailing{flex:1 0 auto}.mdc-evolution-chip__action{align-items:center;background:none;border:none;box-sizing:content-box;cursor:pointer;display:inline-flex;justify-content:center;outline:none;padding:0;text-decoration:none;color:inherit}.mdc-evolution-chip__action--presentational{cursor:auto}.mdc-evolution-chip--disabled,.mdc-evolution-chip__action:disabled{pointer-events:none}.mdc-evolution-chip__action--primary{overflow-x:hidden}.mdc-evolution-chip__action--trailing{position:relative;overflow:visible}.mdc-evolution-chip__action--primary:before{box-sizing:border-box;content:\"\";height:100%;left:0;position:absolute;pointer-events:none;top:0;width:100%;z-index:1}.mdc-evolution-chip--touch{margin-top:8px;margin-bottom:8px}.mdc-evolution-chip__action-touch{position:absolute;top:50%;height:48px;left:0;right:0;transform:translateY(-50%)}.mdc-evolution-chip__text-label{white-space:nowrap;user-select:none;text-overflow:ellipsis;overflow:hidden}.mdc-evolution-chip__graphic{align-items:center;display:inline-flex;justify-content:center;overflow:hidden;pointer-events:none;position:relative;flex:1 0 auto}.mdc-evolution-chip__checkmark{position:absolute;opacity:0;top:50%;left:50%}.mdc-evolution-chip--selectable:not(.mdc-evolution-chip--selected):not(.mdc-evolution-chip--with-primary-icon) .mdc-evolution-chip__graphic{width:0}.mdc-evolution-chip__checkmark-background{opacity:0}.mdc-evolution-chip__checkmark-svg{display:block}.mdc-evolution-chip__checkmark-path{stroke-width:2px;stroke-dasharray:29.7833385;stroke-dashoffset:29.7833385;stroke:currentColor}.mdc-evolution-chip--selecting .mdc-evolution-chip__graphic{transition:width 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--selecting .mdc-evolution-chip__checkmark{transition:transform 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1);transform:translate(-75%, -50%)}.mdc-evolution-chip--selecting .mdc-evolution-chip__checkmark-path{transition:stroke-dashoffset 150ms 45ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--deselecting .mdc-evolution-chip__graphic{transition:width 100ms 0ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--deselecting .mdc-evolution-chip__checkmark{transition:opacity 50ms 0ms linear,transform 100ms 0ms cubic-bezier(0.4, 0, 0.2, 1);transform:translate(-75%, -50%)}.mdc-evolution-chip--deselecting .mdc-evolution-chip__checkmark-path{stroke-dashoffset:0}.mdc-evolution-chip--selecting-with-primary-icon .mdc-evolution-chip__icon--primary{transition:opacity 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--selecting-with-primary-icon .mdc-evolution-chip__checkmark-path{transition:stroke-dashoffset 150ms 75ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--deselecting-with-primary-icon .mdc-evolution-chip__icon--primary{transition:opacity 150ms 75ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--deselecting-with-primary-icon .mdc-evolution-chip__checkmark{transition:opacity 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1);transform:translate(-50%, -50%)}.mdc-evolution-chip--deselecting-with-primary-icon .mdc-evolution-chip__checkmark-path{stroke-dashoffset:0}.mdc-evolution-chip--selected .mdc-evolution-chip__icon--primary{opacity:0}.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark{transform:translate(-50%, -50%);opacity:1}.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark-path{stroke-dashoffset:0}@keyframes mdc-evolution-chip-enter{from{transform:scale(0.8);opacity:.4}to{transform:scale(1);opacity:1}}.mdc-evolution-chip--enter{animation:mdc-evolution-chip-enter 100ms 0ms cubic-bezier(0, 0, 0.2, 1)}@keyframes mdc-evolution-chip-exit{from{opacity:1}to{opacity:0}}.mdc-evolution-chip--exit{animation:mdc-evolution-chip-exit 75ms 0ms cubic-bezier(0.4, 0, 1, 1)}.mdc-evolution-chip--hidden{opacity:0;pointer-events:none;transition:width 150ms 0ms cubic-bezier(0.4, 0, 1, 1)}.mat-mdc-standard-chip{border-radius:var(--mdc-chip-container-shape-radius);height:var(--mdc-chip-container-height)}.mat-mdc-standard-chip .mdc-evolution-chip__ripple{border-radius:var(--mdc-chip-container-shape-radius)}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary:before{border-radius:var(--mdc-chip-container-shape-radius)}.mat-mdc-standard-chip .mdc-evolution-chip__icon--primary{border-radius:var(--mdc-chip-with-avatar-avatar-shape-radius)}.mat-mdc-standard-chip.mdc-evolution-chip--selectable:not(.mdc-evolution-chip--with-primary-icon){--mdc-chip-graphic-selected-width:var(--mdc-chip-with-avatar-avatar-size)}.mat-mdc-standard-chip .mdc-evolution-chip__graphic{height:var(--mdc-chip-with-avatar-avatar-size);width:var(--mdc-chip-with-avatar-avatar-size);font-size:var(--mdc-chip-with-avatar-avatar-size)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled){background-color:var(--mdc-chip-elevated-container-color)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled{background-color:var(--mdc-chip-elevated-disabled-container-color)}.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled{background-color:var(--mdc-chip-elevated-disabled-container-color)}.mat-mdc-standard-chip .mdc-evolution-chip__text-label{font-family:var(--mdc-chip-label-text-font);line-height:var(--mdc-chip-label-text-line-height);font-size:var(--mdc-chip-label-text-size);font-weight:var(--mdc-chip-label-text-weight);letter-spacing:var(--mdc-chip-label-text-tracking)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__text-label{color:var(--mdc-chip-label-text-color)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__text-label{color:var(--mdc-chip-disabled-label-text-color)}.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled .mdc-evolution-chip__text-label{color:var(--mdc-chip-disabled-label-text-color)}.mat-mdc-standard-chip .mdc-evolution-chip__icon--primary{height:var(--mdc-chip-with-icon-icon-size);width:var(--mdc-chip-with-icon-icon-size);font-size:var(--mdc-chip-with-icon-icon-size)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__icon--primary{color:var(--mdc-chip-with-icon-icon-color)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--primary{color:var(--mdc-chip-with-icon-disabled-icon-color)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__checkmark{color:var(--mdc-chip-with-icon-selected-icon-color)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__checkmark{color:var(--mdc-chip-with-icon-disabled-icon-color)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__icon--trailing{color:var(--mdc-chip-with-trailing-icon-trailing-icon-color)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing{color:var(--mdc-chip-with-trailing-icon-disabled-trailing-icon-color)}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary.mdc-ripple-upgraded--background-focused .mdc-evolution-chip__ripple::before,.mat-mdc-standard-chip .mdc-evolution-chip__action--primary:not(.mdc-ripple-upgraded):focus .mdc-evolution-chip__ripple::before{transition-duration:75ms;opacity:var(--mdc-chip-focus-state-layer-opacity)}.mat-mdc-chip-focus-overlay{background:var(--mdc-chip-focus-state-layer-color);opacity:var(--mdc-chip-focus-state-layer-opacity)}.mat-mdc-standard-chip .mdc-evolution-chip__checkmark{height:20px;width:20px}.mat-mdc-standard-chip .mdc-evolution-chip__icon--trailing{height:18px;width:18px;font-size:18px}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:12px}[dir=rtl] .mat-mdc-standard-chip .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:12px;padding-right:12px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic{padding-left:6px;padding-right:6px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic[dir=rtl]{padding-left:6px;padding-right:6px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary{padding-left:0;padding-right:12px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:12px;padding-right:0}.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing{padding-left:8px;padding-right:8px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing,.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing[dir=rtl]{padding-left:8px;padding-right:8px}.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing{left:8px;right:initial}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing,.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing[dir=rtl]{left:initial;right:8px}.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:0}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:0;padding-right:12px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic{padding-left:6px;padding-right:6px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic[dir=rtl]{padding-left:6px;padding-right:6px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing{padding-left:8px;padding-right:8px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing[dir=rtl]{padding-left:8px;padding-right:8px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing{left:8px;right:initial}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing[dir=rtl]{left:initial;right:8px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:0;padding-right:0}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__checkmark{color:var(--mdc-chip-with-icon-selected-icon-color, currentColor)}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic{padding-left:4px;padding-right:8px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic[dir=rtl]{padding-left:8px;padding-right:4px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary{padding-left:0;padding-right:12px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:12px;padding-right:0}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic{padding-left:4px;padding-right:8px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic[dir=rtl]{padding-left:8px;padding-right:4px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing{padding-left:8px;padding-right:8px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing[dir=rtl]{padding-left:8px;padding-right:8px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing{left:8px;right:initial}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing[dir=rtl]{left:initial;right:8px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:0;padding-right:0}.mat-mdc-standard-chip{-webkit-tap-highlight-color:rgba(0,0,0,0)}.cdk-high-contrast-active .mat-mdc-standard-chip{outline:solid 1px}.cdk-high-contrast-active .mat-mdc-standard-chip .mdc-evolution-chip__checkmark-path{stroke:CanvasText !important}.mat-mdc-standard-chip.mdc-evolution-chip--disabled{opacity:.4}.mat-mdc-standard-chip .mdc-evolution-chip__cell--primary,.mat-mdc-standard-chip .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip .mat-mdc-chip-action-label{overflow:visible}.mat-mdc-standard-chip .mdc-evolution-chip__cell--primary{flex-basis:100%}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary{font:inherit;letter-spacing:inherit;white-space:inherit}.mat-mdc-standard-chip .mat-mdc-chip-graphic,.mat-mdc-standard-chip .mat-mdc-chip-trailing-icon{box-sizing:content-box}.mat-mdc-standard-chip._mat-animation-noopable,.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__graphic,.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__checkmark,.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__checkmark-path{transition-duration:1ms;animation-duration:1ms}.mat-mdc-basic-chip .mdc-evolution-chip__action--primary{font:inherit}.mat-mdc-chip-focus-overlay{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;opacity:0;border-radius:inherit;transition:opacity 150ms linear}._mat-animation-noopable .mat-mdc-chip-focus-overlay{transition:none}.mat-mdc-basic-chip .mat-mdc-chip-focus-overlay{display:none}.mat-mdc-chip:hover .mat-mdc-chip-focus-overlay{opacity:.04}.mat-mdc-chip.cdk-focused .mat-mdc-chip-focus-overlay{opacity:.12}.mat-mdc-chip .mat-ripple.mat-mdc-chip-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:inherit}.mat-mdc-chip-avatar{text-align:center;line-height:1;color:var(--mdc-chip-with-icon-icon-color, currentColor)}.mat-mdc-chip{position:relative;z-index:0}.mat-mdc-chip-action-label{text-align:left;z-index:1}[dir=rtl] .mat-mdc-chip-action-label{text-align:right}.mat-mdc-chip.mdc-evolution-chip--with-trailing-action .mat-mdc-chip-action-label{position:relative}.mat-mdc-chip-action-label .mat-mdc-chip-primary-focus-indicator{position:absolute;top:0;right:0;bottom:0;left:0;pointer-events:none}.mat-mdc-chip-action-label .mat-mdc-focus-indicator::before{margin:calc(calc(var(--mat-mdc-focus-indicator-border-width, 3px) + 2px)*-1)}.mat-mdc-chip-remove{opacity:.54}.mat-mdc-chip-remove:focus{opacity:1}.mat-mdc-chip-remove::before{margin:calc(var(--mat-mdc-focus-indicator-border-width, 3px)*-1);left:8px;right:8px}.mat-mdc-chip-remove .mat-icon{width:inherit;height:inherit;font-size:inherit;box-sizing:content-box}.mat-chip-edit-input{cursor:text;display:inline-block;color:inherit;outline:0}.cdk-high-contrast-active .mat-mdc-chip-selected:not(.mat-mdc-chip-multiple){outline-width:3px}.mat-mdc-chip-action:focus .mat-mdc-focus-indicator::before{content:\"\"}"],
    encapsulation: 2,
    changeDetection: 0
  });
}
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](MatChip, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Component,
    args: [{
      selector: 'mat-basic-chip, [mat-basic-chip], mat-chip, [mat-chip]',
      inputs: ['color', 'disabled', 'disableRipple', 'tabIndex'],
      exportAs: 'matChip',
      host: {
        'class': 'mat-mdc-chip',
        '[class.mdc-evolution-chip]': '!_isBasicChip',
        '[class.mdc-evolution-chip--disabled]': 'disabled',
        '[class.mdc-evolution-chip--with-trailing-action]': '_hasTrailingIcon()',
        '[class.mdc-evolution-chip--with-primary-graphic]': 'leadingIcon',
        '[class.mdc-evolution-chip--with-primary-icon]': 'leadingIcon',
        '[class.mdc-evolution-chip--with-avatar]': 'leadingIcon',
        '[class.mat-mdc-chip-with-avatar]': 'leadingIcon',
        '[class.mat-mdc-chip-highlighted]': 'highlighted',
        '[class.mat-mdc-chip-disabled]': 'disabled',
        '[class.mat-mdc-basic-chip]': '_isBasicChip',
        '[class.mat-mdc-standard-chip]': '!_isBasicChip',
        '[class.mat-mdc-chip-with-trailing-icon]': '_hasTrailingIcon()',
        '[class._mat-animation-noopable]': '_animationsDisabled',
        '[id]': 'id',
        '[attr.role]': 'role',
        '[attr.tabindex]': 'role ? tabIndex : null',
        '[attr.aria-label]': 'ariaLabel',
        '(keydown)': '_handleKeydown($event)'
      },
      encapsulation: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ViewEncapsulation.None,
      changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ChangeDetectionStrategy.OnPush,
      providers: [{
        provide: MAT_CHIP,
        useExisting: MatChip
      }],
      template: "<span class=\"mat-mdc-chip-focus-overlay\"></span>\n\n<span class=\"mdc-evolution-chip__cell mdc-evolution-chip__cell--primary\">\n  <span matChipAction [isInteractive]=\"false\">\n    @if (leadingIcon) {\n      <span class=\"mdc-evolution-chip__graphic mat-mdc-chip-graphic\">\n        <ng-content select=\"mat-chip-avatar, [matChipAvatar]\"></ng-content>\n      </span>\n    }\n    <span class=\"mdc-evolution-chip__text-label mat-mdc-chip-action-label\">\n      <ng-content></ng-content>\n      <span class=\"mat-mdc-chip-primary-focus-indicator mat-mdc-focus-indicator\"></span>\n    </span>\n  </span>\n</span>\n\n@if (_hasTrailingIcon()) {\n  <span class=\"mdc-evolution-chip__cell mdc-evolution-chip__cell--trailing\">\n    <ng-content select=\"mat-chip-trailing-icon,[matChipRemove],[matChipTrailingIcon]\"></ng-content>\n  </span>\n}\n",
      styles: [".mdc-evolution-chip,.mdc-evolution-chip__cell,.mdc-evolution-chip__action{display:inline-flex;align-items:center}.mdc-evolution-chip{position:relative;max-width:100%}.mdc-evolution-chip .mdc-elevation-overlay{width:100%;height:100%;top:0;left:0}.mdc-evolution-chip__cell,.mdc-evolution-chip__action{height:100%}.mdc-evolution-chip__cell--primary{overflow-x:hidden}.mdc-evolution-chip__cell--trailing{flex:1 0 auto}.mdc-evolution-chip__action{align-items:center;background:none;border:none;box-sizing:content-box;cursor:pointer;display:inline-flex;justify-content:center;outline:none;padding:0;text-decoration:none;color:inherit}.mdc-evolution-chip__action--presentational{cursor:auto}.mdc-evolution-chip--disabled,.mdc-evolution-chip__action:disabled{pointer-events:none}.mdc-evolution-chip__action--primary{overflow-x:hidden}.mdc-evolution-chip__action--trailing{position:relative;overflow:visible}.mdc-evolution-chip__action--primary:before{box-sizing:border-box;content:\"\";height:100%;left:0;position:absolute;pointer-events:none;top:0;width:100%;z-index:1}.mdc-evolution-chip--touch{margin-top:8px;margin-bottom:8px}.mdc-evolution-chip__action-touch{position:absolute;top:50%;height:48px;left:0;right:0;transform:translateY(-50%)}.mdc-evolution-chip__text-label{white-space:nowrap;user-select:none;text-overflow:ellipsis;overflow:hidden}.mdc-evolution-chip__graphic{align-items:center;display:inline-flex;justify-content:center;overflow:hidden;pointer-events:none;position:relative;flex:1 0 auto}.mdc-evolution-chip__checkmark{position:absolute;opacity:0;top:50%;left:50%}.mdc-evolution-chip--selectable:not(.mdc-evolution-chip--selected):not(.mdc-evolution-chip--with-primary-icon) .mdc-evolution-chip__graphic{width:0}.mdc-evolution-chip__checkmark-background{opacity:0}.mdc-evolution-chip__checkmark-svg{display:block}.mdc-evolution-chip__checkmark-path{stroke-width:2px;stroke-dasharray:29.7833385;stroke-dashoffset:29.7833385;stroke:currentColor}.mdc-evolution-chip--selecting .mdc-evolution-chip__graphic{transition:width 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--selecting .mdc-evolution-chip__checkmark{transition:transform 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1);transform:translate(-75%, -50%)}.mdc-evolution-chip--selecting .mdc-evolution-chip__checkmark-path{transition:stroke-dashoffset 150ms 45ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--deselecting .mdc-evolution-chip__graphic{transition:width 100ms 0ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--deselecting .mdc-evolution-chip__checkmark{transition:opacity 50ms 0ms linear,transform 100ms 0ms cubic-bezier(0.4, 0, 0.2, 1);transform:translate(-75%, -50%)}.mdc-evolution-chip--deselecting .mdc-evolution-chip__checkmark-path{stroke-dashoffset:0}.mdc-evolution-chip--selecting-with-primary-icon .mdc-evolution-chip__icon--primary{transition:opacity 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--selecting-with-primary-icon .mdc-evolution-chip__checkmark-path{transition:stroke-dashoffset 150ms 75ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--deselecting-with-primary-icon .mdc-evolution-chip__icon--primary{transition:opacity 150ms 75ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--deselecting-with-primary-icon .mdc-evolution-chip__checkmark{transition:opacity 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1);transform:translate(-50%, -50%)}.mdc-evolution-chip--deselecting-with-primary-icon .mdc-evolution-chip__checkmark-path{stroke-dashoffset:0}.mdc-evolution-chip--selected .mdc-evolution-chip__icon--primary{opacity:0}.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark{transform:translate(-50%, -50%);opacity:1}.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark-path{stroke-dashoffset:0}@keyframes mdc-evolution-chip-enter{from{transform:scale(0.8);opacity:.4}to{transform:scale(1);opacity:1}}.mdc-evolution-chip--enter{animation:mdc-evolution-chip-enter 100ms 0ms cubic-bezier(0, 0, 0.2, 1)}@keyframes mdc-evolution-chip-exit{from{opacity:1}to{opacity:0}}.mdc-evolution-chip--exit{animation:mdc-evolution-chip-exit 75ms 0ms cubic-bezier(0.4, 0, 1, 1)}.mdc-evolution-chip--hidden{opacity:0;pointer-events:none;transition:width 150ms 0ms cubic-bezier(0.4, 0, 1, 1)}.mat-mdc-standard-chip{border-radius:var(--mdc-chip-container-shape-radius);height:var(--mdc-chip-container-height)}.mat-mdc-standard-chip .mdc-evolution-chip__ripple{border-radius:var(--mdc-chip-container-shape-radius)}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary:before{border-radius:var(--mdc-chip-container-shape-radius)}.mat-mdc-standard-chip .mdc-evolution-chip__icon--primary{border-radius:var(--mdc-chip-with-avatar-avatar-shape-radius)}.mat-mdc-standard-chip.mdc-evolution-chip--selectable:not(.mdc-evolution-chip--with-primary-icon){--mdc-chip-graphic-selected-width:var(--mdc-chip-with-avatar-avatar-size)}.mat-mdc-standard-chip .mdc-evolution-chip__graphic{height:var(--mdc-chip-with-avatar-avatar-size);width:var(--mdc-chip-with-avatar-avatar-size);font-size:var(--mdc-chip-with-avatar-avatar-size)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled){background-color:var(--mdc-chip-elevated-container-color)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled{background-color:var(--mdc-chip-elevated-disabled-container-color)}.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled{background-color:var(--mdc-chip-elevated-disabled-container-color)}.mat-mdc-standard-chip .mdc-evolution-chip__text-label{font-family:var(--mdc-chip-label-text-font);line-height:var(--mdc-chip-label-text-line-height);font-size:var(--mdc-chip-label-text-size);font-weight:var(--mdc-chip-label-text-weight);letter-spacing:var(--mdc-chip-label-text-tracking)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__text-label{color:var(--mdc-chip-label-text-color)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__text-label{color:var(--mdc-chip-disabled-label-text-color)}.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled .mdc-evolution-chip__text-label{color:var(--mdc-chip-disabled-label-text-color)}.mat-mdc-standard-chip .mdc-evolution-chip__icon--primary{height:var(--mdc-chip-with-icon-icon-size);width:var(--mdc-chip-with-icon-icon-size);font-size:var(--mdc-chip-with-icon-icon-size)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__icon--primary{color:var(--mdc-chip-with-icon-icon-color)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--primary{color:var(--mdc-chip-with-icon-disabled-icon-color)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__checkmark{color:var(--mdc-chip-with-icon-selected-icon-color)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__checkmark{color:var(--mdc-chip-with-icon-disabled-icon-color)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__icon--trailing{color:var(--mdc-chip-with-trailing-icon-trailing-icon-color)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing{color:var(--mdc-chip-with-trailing-icon-disabled-trailing-icon-color)}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary.mdc-ripple-upgraded--background-focused .mdc-evolution-chip__ripple::before,.mat-mdc-standard-chip .mdc-evolution-chip__action--primary:not(.mdc-ripple-upgraded):focus .mdc-evolution-chip__ripple::before{transition-duration:75ms;opacity:var(--mdc-chip-focus-state-layer-opacity)}.mat-mdc-chip-focus-overlay{background:var(--mdc-chip-focus-state-layer-color);opacity:var(--mdc-chip-focus-state-layer-opacity)}.mat-mdc-standard-chip .mdc-evolution-chip__checkmark{height:20px;width:20px}.mat-mdc-standard-chip .mdc-evolution-chip__icon--trailing{height:18px;width:18px;font-size:18px}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:12px}[dir=rtl] .mat-mdc-standard-chip .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:12px;padding-right:12px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic{padding-left:6px;padding-right:6px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic[dir=rtl]{padding-left:6px;padding-right:6px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary{padding-left:0;padding-right:12px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:12px;padding-right:0}.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing{padding-left:8px;padding-right:8px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing,.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing[dir=rtl]{padding-left:8px;padding-right:8px}.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing{left:8px;right:initial}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing,.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing[dir=rtl]{left:initial;right:8px}.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:0}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:0;padding-right:12px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic{padding-left:6px;padding-right:6px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic[dir=rtl]{padding-left:6px;padding-right:6px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing{padding-left:8px;padding-right:8px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing[dir=rtl]{padding-left:8px;padding-right:8px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing{left:8px;right:initial}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing[dir=rtl]{left:initial;right:8px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:0;padding-right:0}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__checkmark{color:var(--mdc-chip-with-icon-selected-icon-color, currentColor)}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic{padding-left:4px;padding-right:8px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic[dir=rtl]{padding-left:8px;padding-right:4px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary{padding-left:0;padding-right:12px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:12px;padding-right:0}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic{padding-left:4px;padding-right:8px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic[dir=rtl]{padding-left:8px;padding-right:4px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing{padding-left:8px;padding-right:8px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing[dir=rtl]{padding-left:8px;padding-right:8px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing{left:8px;right:initial}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing[dir=rtl]{left:initial;right:8px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:0;padding-right:0}.mat-mdc-standard-chip{-webkit-tap-highlight-color:rgba(0,0,0,0)}.cdk-high-contrast-active .mat-mdc-standard-chip{outline:solid 1px}.cdk-high-contrast-active .mat-mdc-standard-chip .mdc-evolution-chip__checkmark-path{stroke:CanvasText !important}.mat-mdc-standard-chip.mdc-evolution-chip--disabled{opacity:.4}.mat-mdc-standard-chip .mdc-evolution-chip__cell--primary,.mat-mdc-standard-chip .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip .mat-mdc-chip-action-label{overflow:visible}.mat-mdc-standard-chip .mdc-evolution-chip__cell--primary{flex-basis:100%}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary{font:inherit;letter-spacing:inherit;white-space:inherit}.mat-mdc-standard-chip .mat-mdc-chip-graphic,.mat-mdc-standard-chip .mat-mdc-chip-trailing-icon{box-sizing:content-box}.mat-mdc-standard-chip._mat-animation-noopable,.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__graphic,.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__checkmark,.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__checkmark-path{transition-duration:1ms;animation-duration:1ms}.mat-mdc-basic-chip .mdc-evolution-chip__action--primary{font:inherit}.mat-mdc-chip-focus-overlay{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;opacity:0;border-radius:inherit;transition:opacity 150ms linear}._mat-animation-noopable .mat-mdc-chip-focus-overlay{transition:none}.mat-mdc-basic-chip .mat-mdc-chip-focus-overlay{display:none}.mat-mdc-chip:hover .mat-mdc-chip-focus-overlay{opacity:.04}.mat-mdc-chip.cdk-focused .mat-mdc-chip-focus-overlay{opacity:.12}.mat-mdc-chip .mat-ripple.mat-mdc-chip-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:inherit}.mat-mdc-chip-avatar{text-align:center;line-height:1;color:var(--mdc-chip-with-icon-icon-color, currentColor)}.mat-mdc-chip{position:relative;z-index:0}.mat-mdc-chip-action-label{text-align:left;z-index:1}[dir=rtl] .mat-mdc-chip-action-label{text-align:right}.mat-mdc-chip.mdc-evolution-chip--with-trailing-action .mat-mdc-chip-action-label{position:relative}.mat-mdc-chip-action-label .mat-mdc-chip-primary-focus-indicator{position:absolute;top:0;right:0;bottom:0;left:0;pointer-events:none}.mat-mdc-chip-action-label .mat-mdc-focus-indicator::before{margin:calc(calc(var(--mat-mdc-focus-indicator-border-width, 3px) + 2px)*-1)}.mat-mdc-chip-remove{opacity:.54}.mat-mdc-chip-remove:focus{opacity:1}.mat-mdc-chip-remove::before{margin:calc(var(--mat-mdc-focus-indicator-border-width, 3px)*-1);left:8px;right:8px}.mat-mdc-chip-remove .mat-icon{width:inherit;height:inherit;font-size:inherit;box-sizing:content-box}.mat-chip-edit-input{cursor:text;display:inline-block;color:inherit;outline:0}.cdk-high-contrast-active .mat-mdc-chip-selected:not(.mat-mdc-chip-multiple){outline-width:3px}.mat-mdc-chip-action:focus .mat-mdc-focus-indicator::before{content:\"\"}"]
    }]
  }], () => [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ChangeDetectorRef
  }, {
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef
  }, {
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.NgZone
  }, {
    type: _angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_7__.FocusMonitor
  }, {
    type: undefined,
    decorators: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
      args: [_angular_common__WEBPACK_IMPORTED_MODULE_8__.DOCUMENT]
    }]
  }, {
    type: undefined,
    decorators: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
      args: [_angular_core__WEBPACK_IMPORTED_MODULE_0__.ANIMATION_MODULE_TYPE]
    }]
  }, {
    type: undefined,
    decorators: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
      args: [_angular_material_core__WEBPACK_IMPORTED_MODULE_2__.MAT_RIPPLE_GLOBAL_OPTIONS]
    }]
  }, {
    type: undefined,
    decorators: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Attribute,
      args: ['tabindex']
    }]
  }], {
    role: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    _allLeadingIcons: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ContentChildren,
      args: [MAT_CHIP_AVATAR, {
        descendants: true
      }]
    }],
    _allTrailingIcons: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ContentChildren,
      args: [MAT_CHIP_TRAILING_ICON, {
        descendants: true
      }]
    }],
    _allRemoveIcons: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ContentChildren,
      args: [MAT_CHIP_REMOVE, {
        descendants: true
      }]
    }],
    id: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    ariaLabel: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input,
      args: ['aria-label']
    }],
    ariaDescription: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input,
      args: ['aria-description']
    }],
    value: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    removable: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    highlighted: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    removed: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Output
    }],
    destroyed: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Output
    }],
    leadingIcon: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ContentChild,
      args: [MAT_CHIP_AVATAR]
    }],
    trailingIcon: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ContentChild,
      args: [MAT_CHIP_TRAILING_ICON]
    }],
    removeIcon: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ContentChild,
      args: [MAT_CHIP_REMOVE]
    }],
    primaryAction: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ViewChild,
      args: [MatChipAction]
    }]
  });
})();

/** Event object emitted by MatChipOption when selected or deselected. */
class MatChipSelectionChange {
  constructor( /** Reference to the chip that emitted the event. */
  source, /** Whether the chip that emitted the event is selected. */
  selected, /** Whether the selection change was a result of a user interaction. */
  isUserInput = false) {
    this.source = source;
    this.selected = selected;
    this.isUserInput = isUserInput;
  }
}
/**
 * An extension of the MatChip component that supports chip selection. Used with MatChipListbox.
 *
 * Unlike other chips, the user can focus on disabled chip options inside a MatChipListbox. The
 * user cannot click disabled chips.
 */
class MatChipOption extends MatChip {
  constructor() {
    super(...arguments);
    /** Default chip options. */
    this._defaultOptions = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(MAT_CHIPS_DEFAULT_OPTIONS, {
      optional: true
    });
    /** Whether the chip list is selectable. */
    this.chipListSelectable = true;
    /** Whether the chip list is in multi-selection mode. */
    this._chipListMultiple = false;
    /** Whether the chip list hides single-selection indicator. */
    this._chipListHideSingleSelectionIndicator = this._defaultOptions?.hideSingleSelectionIndicator ?? false;
    this._selectable = true;
    this._selected = false;
    /** The unstyled chip selector for this component. */
    this.basicChipAttrName = 'mat-basic-chip-option';
    /** Emitted when the chip is selected or deselected. */
    this.selectionChange = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
  }
  /**
   * Whether or not the chip is selectable.
   *
   * When a chip is not selectable, changes to its selected state are always
   * ignored. By default an option chip is selectable, and it becomes
   * non-selectable if its parent chip list is not selectable.
   */
  get selectable() {
    return this._selectable && this.chipListSelectable;
  }
  set selectable(value) {
    this._selectable = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_3__.coerceBooleanProperty)(value);
    this._changeDetectorRef.markForCheck();
  }
  /** Whether the chip is selected. */
  get selected() {
    return this._selected;
  }
  set selected(value) {
    this._setSelectedState((0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_3__.coerceBooleanProperty)(value), false, true);
  }
  /**
   * The ARIA selected applied to the chip. Conforms to WAI ARIA best practices for listbox
   * interaction patterns.
   *
   * From [WAI ARIA Listbox authoring practices guide](
   * https://www.w3.org/WAI/ARIA/apg/patterns/listbox/):
   *  "If any options are selected, each selected option has either aria-selected or aria-checked
   *  set to true. All options that are selectable but not selected have either aria-selected or
   *  aria-checked set to false."
   *
   * Set `aria-selected="false"` on not-selected listbox options that are selectable to fix
   * VoiceOver reading every option as "selected" (#25736).
   */
  get ariaSelected() {
    return this.selectable ? this.selected.toString() : null;
  }
  ngOnInit() {
    super.ngOnInit();
    this.role = 'presentation';
  }
  /** Selects the chip. */
  select() {
    this._setSelectedState(true, false, true);
  }
  /** Deselects the chip. */
  deselect() {
    this._setSelectedState(false, false, true);
  }
  /** Selects this chip and emits userInputSelection event */
  selectViaInteraction() {
    this._setSelectedState(true, true, true);
  }
  /** Toggles the current selected state of this chip. */
  toggleSelected(isUserInput = false) {
    this._setSelectedState(!this.selected, isUserInput, true);
    return this.selected;
  }
  _handlePrimaryActionInteraction() {
    if (!this.disabled) {
      // Interacting with the primary action implies that the chip already has focus, however
      // there's a bug in Safari where focus ends up lingering on the previous chip (see #27544).
      // We work around it by explicitly focusing the primary action of the current chip.
      this.focus();
      if (this.selectable) {
        this.toggleSelected(true);
      }
    }
  }
  _hasLeadingGraphic() {
    if (this.leadingIcon) {
      return true;
    }
    // The checkmark graphic communicates selected state for both single-select and multi-select.
    // Include checkmark in single-select to fix a11y issue where selected state is communicated
    // visually only using color (#25886).
    return !this._chipListHideSingleSelectionIndicator || this._chipListMultiple;
  }
  _setSelectedState(isSelected, isUserInput, emitEvent) {
    if (isSelected !== this.selected) {
      this._selected = isSelected;
      if (emitEvent) {
        this.selectionChange.emit({
          source: this,
          isUserInput,
          selected: this.selected
        });
      }
      this._changeDetectorRef.markForCheck();
    }
  }
  static #_ = this.ɵfac = /* @__PURE__ */(() => {
    let ɵMatChipOption_BaseFactory;
    return function MatChipOption_Factory(t) {
      return (ɵMatChipOption_BaseFactory || (ɵMatChipOption_BaseFactory = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetInheritedFactory"](MatChipOption)))(t || MatChipOption);
    };
  })();
  static #_2 = this.ɵcmp = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
    type: MatChipOption,
    selectors: [["mat-basic-chip-option"], ["", "mat-basic-chip-option", ""], ["mat-chip-option"], ["", "mat-chip-option", ""]],
    hostAttrs: [1, "mat-mdc-chip", "mat-mdc-chip-option"],
    hostVars: 37,
    hostBindings: function MatChipOption_HostBindings(rf, ctx) {
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵhostProperty"]("id", ctx.id);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵattribute"]("tabindex", null)("aria-label", null)("aria-description", null)("role", ctx.role);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("mdc-evolution-chip", !ctx._isBasicChip)("mdc-evolution-chip--filter", !ctx._isBasicChip)("mdc-evolution-chip--selectable", !ctx._isBasicChip)("mat-mdc-chip-selected", ctx.selected)("mat-mdc-chip-multiple", ctx._chipListMultiple)("mat-mdc-chip-disabled", ctx.disabled)("mat-mdc-chip-with-avatar", ctx.leadingIcon)("mdc-evolution-chip--disabled", ctx.disabled)("mdc-evolution-chip--selected", ctx.selected)("mdc-evolution-chip--selecting", !ctx._animationsDisabled)("mdc-evolution-chip--with-trailing-action", ctx._hasTrailingIcon())("mdc-evolution-chip--with-primary-icon", ctx.leadingIcon)("mdc-evolution-chip--with-primary-graphic", ctx._hasLeadingGraphic())("mdc-evolution-chip--with-avatar", ctx.leadingIcon)("mat-mdc-chip-highlighted", ctx.highlighted)("mat-mdc-chip-with-trailing-icon", ctx._hasTrailingIcon());
      }
    },
    inputs: {
      color: "color",
      disabled: "disabled",
      disableRipple: "disableRipple",
      tabIndex: "tabIndex",
      selectable: "selectable",
      selected: "selected"
    },
    outputs: {
      selectionChange: "selectionChange"
    },
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵProvidersFeature"]([{
      provide: MatChip,
      useExisting: MatChipOption
    }, {
      provide: MAT_CHIP,
      useExisting: MatChipOption
    }]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵInheritDefinitionFeature"]],
    ngContentSelectors: _c1,
    decls: 10,
    vars: 9,
    consts: [[1, "mat-mdc-chip-focus-overlay"], [1, "mdc-evolution-chip__cell", "mdc-evolution-chip__cell--primary"], ["matChipAction", "", "role", "option", 3, "tabIndex", "_allowFocusWhenDisabled"], ["class", "mdc-evolution-chip__graphic mat-mdc-chip-graphic"], [1, "mdc-evolution-chip__text-label", "mat-mdc-chip-action-label"], [1, "mat-mdc-chip-primary-focus-indicator", "mat-mdc-focus-indicator"], ["class", "mdc-evolution-chip__cell mdc-evolution-chip__cell--trailing"], [1, "cdk-visually-hidden", 3, "id"], [1, "mdc-evolution-chip__graphic", "mat-mdc-chip-graphic"], [1, "mdc-evolution-chip__checkmark"], ["viewBox", "-2 -3 30 30", "focusable", "false", "aria-hidden", "true", 1, "mdc-evolution-chip__checkmark-svg"], ["fill", "none", "stroke", "currentColor", "d", "M1.73,12.91 8.1,19.28 22.79,4.59", 1, "mdc-evolution-chip__checkmark-path"], [1, "mdc-evolution-chip__cell", "mdc-evolution-chip__cell--trailing"]],
    template: function MatChipOption_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojectionDef"](_c0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "span", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "span", 1)(2, "button", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](3, MatChipOption_Conditional_3_Template, 5, 0, "span", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "span", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojection"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](6, "span", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](7, MatChipOption_Conditional_7_Template, 2, 0, "span", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("tabIndex", ctx.tabIndex)("_allowFocusWhenDisabled", true);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵattribute"]("aria-selected", ctx.ariaSelected)("aria-label", ctx.ariaLabel)("aria-describedby", ctx._ariaDescriptionId);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵconditional"](3, ctx._hasLeadingGraphic() ? 3 : -1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵconditional"](7, ctx._hasTrailingIcon() ? 7 : -1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("id", ctx._ariaDescriptionId);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.ariaDescription);
      }
    },
    dependencies: [MatChipAction],
    styles: [_c2],
    encapsulation: 2,
    changeDetection: 0
  });
}
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](MatChipOption, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Component,
    args: [{
      selector: 'mat-basic-chip-option, [mat-basic-chip-option], mat-chip-option, [mat-chip-option]',
      inputs: ['color', 'disabled', 'disableRipple', 'tabIndex'],
      host: {
        'class': 'mat-mdc-chip mat-mdc-chip-option',
        '[class.mdc-evolution-chip]': '!_isBasicChip',
        '[class.mdc-evolution-chip--filter]': '!_isBasicChip',
        '[class.mdc-evolution-chip--selectable]': '!_isBasicChip',
        '[class.mat-mdc-chip-selected]': 'selected',
        '[class.mat-mdc-chip-multiple]': '_chipListMultiple',
        '[class.mat-mdc-chip-disabled]': 'disabled',
        '[class.mat-mdc-chip-with-avatar]': 'leadingIcon',
        '[class.mdc-evolution-chip--disabled]': 'disabled',
        '[class.mdc-evolution-chip--selected]': 'selected',
        // This class enables the transition on the checkmark. Usually MDC adds it when selection
        // starts and removes it once the animation is finished. We don't need to go through all
        // the trouble, because we only care about the selection animation. MDC needs to do it,
        // because they also have an exit animation that we don't care about.
        '[class.mdc-evolution-chip--selecting]': '!_animationsDisabled',
        '[class.mdc-evolution-chip--with-trailing-action]': '_hasTrailingIcon()',
        '[class.mdc-evolution-chip--with-primary-icon]': 'leadingIcon',
        '[class.mdc-evolution-chip--with-primary-graphic]': '_hasLeadingGraphic()',
        '[class.mdc-evolution-chip--with-avatar]': 'leadingIcon',
        '[class.mat-mdc-chip-highlighted]': 'highlighted',
        '[class.mat-mdc-chip-with-trailing-icon]': '_hasTrailingIcon()',
        '[attr.tabindex]': 'null',
        '[attr.aria-label]': 'null',
        '[attr.aria-description]': 'null',
        '[attr.role]': 'role',
        '[id]': 'id'
      },
      providers: [{
        provide: MatChip,
        useExisting: MatChipOption
      }, {
        provide: MAT_CHIP,
        useExisting: MatChipOption
      }],
      encapsulation: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ViewEncapsulation.None,
      changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ChangeDetectionStrategy.OnPush,
      template: "<span class=\"mat-mdc-chip-focus-overlay\"></span>\n\n<span class=\"mdc-evolution-chip__cell mdc-evolution-chip__cell--primary\">\n  <button\n    matChipAction\n    [tabIndex]=\"tabIndex\"\n    [_allowFocusWhenDisabled]=\"true\"\n    [attr.aria-selected]=\"ariaSelected\"\n    [attr.aria-label]=\"ariaLabel\"\n    [attr.aria-describedby]=\"_ariaDescriptionId\"\n    role=\"option\">\n    @if (_hasLeadingGraphic()) {\n      <span class=\"mdc-evolution-chip__graphic mat-mdc-chip-graphic\">\n        <ng-content select=\"mat-chip-avatar, [matChipAvatar]\"></ng-content>\n        <span class=\"mdc-evolution-chip__checkmark\">\n          <svg\n            class=\"mdc-evolution-chip__checkmark-svg\"\n            viewBox=\"-2 -3 30 30\"\n            focusable=\"false\"\n            aria-hidden=\"true\">\n            <path class=\"mdc-evolution-chip__checkmark-path\"\n                  fill=\"none\" stroke=\"currentColor\" d=\"M1.73,12.91 8.1,19.28 22.79,4.59\" />\n          </svg>\n        </span>\n      </span>\n    }\n    <span class=\"mdc-evolution-chip__text-label mat-mdc-chip-action-label\">\n      <ng-content></ng-content>\n      <span class=\"mat-mdc-chip-primary-focus-indicator mat-mdc-focus-indicator\"></span>\n    </span>\n  </button>\n</span>\n\n@if (_hasTrailingIcon()) {\n  <span class=\"mdc-evolution-chip__cell mdc-evolution-chip__cell--trailing\">\n    <ng-content select=\"mat-chip-trailing-icon,[matChipRemove],[matChipTrailingIcon]\"></ng-content>\n  </span>\n}\n\n<span class=\"cdk-visually-hidden\" [id]=\"_ariaDescriptionId\">{{ariaDescription}}</span>\n",
      styles: [".mdc-evolution-chip,.mdc-evolution-chip__cell,.mdc-evolution-chip__action{display:inline-flex;align-items:center}.mdc-evolution-chip{position:relative;max-width:100%}.mdc-evolution-chip .mdc-elevation-overlay{width:100%;height:100%;top:0;left:0}.mdc-evolution-chip__cell,.mdc-evolution-chip__action{height:100%}.mdc-evolution-chip__cell--primary{overflow-x:hidden}.mdc-evolution-chip__cell--trailing{flex:1 0 auto}.mdc-evolution-chip__action{align-items:center;background:none;border:none;box-sizing:content-box;cursor:pointer;display:inline-flex;justify-content:center;outline:none;padding:0;text-decoration:none;color:inherit}.mdc-evolution-chip__action--presentational{cursor:auto}.mdc-evolution-chip--disabled,.mdc-evolution-chip__action:disabled{pointer-events:none}.mdc-evolution-chip__action--primary{overflow-x:hidden}.mdc-evolution-chip__action--trailing{position:relative;overflow:visible}.mdc-evolution-chip__action--primary:before{box-sizing:border-box;content:\"\";height:100%;left:0;position:absolute;pointer-events:none;top:0;width:100%;z-index:1}.mdc-evolution-chip--touch{margin-top:8px;margin-bottom:8px}.mdc-evolution-chip__action-touch{position:absolute;top:50%;height:48px;left:0;right:0;transform:translateY(-50%)}.mdc-evolution-chip__text-label{white-space:nowrap;user-select:none;text-overflow:ellipsis;overflow:hidden}.mdc-evolution-chip__graphic{align-items:center;display:inline-flex;justify-content:center;overflow:hidden;pointer-events:none;position:relative;flex:1 0 auto}.mdc-evolution-chip__checkmark{position:absolute;opacity:0;top:50%;left:50%}.mdc-evolution-chip--selectable:not(.mdc-evolution-chip--selected):not(.mdc-evolution-chip--with-primary-icon) .mdc-evolution-chip__graphic{width:0}.mdc-evolution-chip__checkmark-background{opacity:0}.mdc-evolution-chip__checkmark-svg{display:block}.mdc-evolution-chip__checkmark-path{stroke-width:2px;stroke-dasharray:29.7833385;stroke-dashoffset:29.7833385;stroke:currentColor}.mdc-evolution-chip--selecting .mdc-evolution-chip__graphic{transition:width 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--selecting .mdc-evolution-chip__checkmark{transition:transform 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1);transform:translate(-75%, -50%)}.mdc-evolution-chip--selecting .mdc-evolution-chip__checkmark-path{transition:stroke-dashoffset 150ms 45ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--deselecting .mdc-evolution-chip__graphic{transition:width 100ms 0ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--deselecting .mdc-evolution-chip__checkmark{transition:opacity 50ms 0ms linear,transform 100ms 0ms cubic-bezier(0.4, 0, 0.2, 1);transform:translate(-75%, -50%)}.mdc-evolution-chip--deselecting .mdc-evolution-chip__checkmark-path{stroke-dashoffset:0}.mdc-evolution-chip--selecting-with-primary-icon .mdc-evolution-chip__icon--primary{transition:opacity 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--selecting-with-primary-icon .mdc-evolution-chip__checkmark-path{transition:stroke-dashoffset 150ms 75ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--deselecting-with-primary-icon .mdc-evolution-chip__icon--primary{transition:opacity 150ms 75ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--deselecting-with-primary-icon .mdc-evolution-chip__checkmark{transition:opacity 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1);transform:translate(-50%, -50%)}.mdc-evolution-chip--deselecting-with-primary-icon .mdc-evolution-chip__checkmark-path{stroke-dashoffset:0}.mdc-evolution-chip--selected .mdc-evolution-chip__icon--primary{opacity:0}.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark{transform:translate(-50%, -50%);opacity:1}.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark-path{stroke-dashoffset:0}@keyframes mdc-evolution-chip-enter{from{transform:scale(0.8);opacity:.4}to{transform:scale(1);opacity:1}}.mdc-evolution-chip--enter{animation:mdc-evolution-chip-enter 100ms 0ms cubic-bezier(0, 0, 0.2, 1)}@keyframes mdc-evolution-chip-exit{from{opacity:1}to{opacity:0}}.mdc-evolution-chip--exit{animation:mdc-evolution-chip-exit 75ms 0ms cubic-bezier(0.4, 0, 1, 1)}.mdc-evolution-chip--hidden{opacity:0;pointer-events:none;transition:width 150ms 0ms cubic-bezier(0.4, 0, 1, 1)}.mat-mdc-standard-chip{border-radius:var(--mdc-chip-container-shape-radius);height:var(--mdc-chip-container-height)}.mat-mdc-standard-chip .mdc-evolution-chip__ripple{border-radius:var(--mdc-chip-container-shape-radius)}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary:before{border-radius:var(--mdc-chip-container-shape-radius)}.mat-mdc-standard-chip .mdc-evolution-chip__icon--primary{border-radius:var(--mdc-chip-with-avatar-avatar-shape-radius)}.mat-mdc-standard-chip.mdc-evolution-chip--selectable:not(.mdc-evolution-chip--with-primary-icon){--mdc-chip-graphic-selected-width:var(--mdc-chip-with-avatar-avatar-size)}.mat-mdc-standard-chip .mdc-evolution-chip__graphic{height:var(--mdc-chip-with-avatar-avatar-size);width:var(--mdc-chip-with-avatar-avatar-size);font-size:var(--mdc-chip-with-avatar-avatar-size)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled){background-color:var(--mdc-chip-elevated-container-color)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled{background-color:var(--mdc-chip-elevated-disabled-container-color)}.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled{background-color:var(--mdc-chip-elevated-disabled-container-color)}.mat-mdc-standard-chip .mdc-evolution-chip__text-label{font-family:var(--mdc-chip-label-text-font);line-height:var(--mdc-chip-label-text-line-height);font-size:var(--mdc-chip-label-text-size);font-weight:var(--mdc-chip-label-text-weight);letter-spacing:var(--mdc-chip-label-text-tracking)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__text-label{color:var(--mdc-chip-label-text-color)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__text-label{color:var(--mdc-chip-disabled-label-text-color)}.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled .mdc-evolution-chip__text-label{color:var(--mdc-chip-disabled-label-text-color)}.mat-mdc-standard-chip .mdc-evolution-chip__icon--primary{height:var(--mdc-chip-with-icon-icon-size);width:var(--mdc-chip-with-icon-icon-size);font-size:var(--mdc-chip-with-icon-icon-size)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__icon--primary{color:var(--mdc-chip-with-icon-icon-color)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--primary{color:var(--mdc-chip-with-icon-disabled-icon-color)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__checkmark{color:var(--mdc-chip-with-icon-selected-icon-color)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__checkmark{color:var(--mdc-chip-with-icon-disabled-icon-color)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__icon--trailing{color:var(--mdc-chip-with-trailing-icon-trailing-icon-color)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing{color:var(--mdc-chip-with-trailing-icon-disabled-trailing-icon-color)}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary.mdc-ripple-upgraded--background-focused .mdc-evolution-chip__ripple::before,.mat-mdc-standard-chip .mdc-evolution-chip__action--primary:not(.mdc-ripple-upgraded):focus .mdc-evolution-chip__ripple::before{transition-duration:75ms;opacity:var(--mdc-chip-focus-state-layer-opacity)}.mat-mdc-chip-focus-overlay{background:var(--mdc-chip-focus-state-layer-color);opacity:var(--mdc-chip-focus-state-layer-opacity)}.mat-mdc-standard-chip .mdc-evolution-chip__checkmark{height:20px;width:20px}.mat-mdc-standard-chip .mdc-evolution-chip__icon--trailing{height:18px;width:18px;font-size:18px}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:12px}[dir=rtl] .mat-mdc-standard-chip .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:12px;padding-right:12px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic{padding-left:6px;padding-right:6px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic[dir=rtl]{padding-left:6px;padding-right:6px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary{padding-left:0;padding-right:12px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:12px;padding-right:0}.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing{padding-left:8px;padding-right:8px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing,.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing[dir=rtl]{padding-left:8px;padding-right:8px}.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing{left:8px;right:initial}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing,.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing[dir=rtl]{left:initial;right:8px}.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:0}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:0;padding-right:12px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic{padding-left:6px;padding-right:6px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic[dir=rtl]{padding-left:6px;padding-right:6px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing{padding-left:8px;padding-right:8px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing[dir=rtl]{padding-left:8px;padding-right:8px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing{left:8px;right:initial}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing[dir=rtl]{left:initial;right:8px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:0;padding-right:0}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__checkmark{color:var(--mdc-chip-with-icon-selected-icon-color, currentColor)}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic{padding-left:4px;padding-right:8px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic[dir=rtl]{padding-left:8px;padding-right:4px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary{padding-left:0;padding-right:12px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:12px;padding-right:0}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic{padding-left:4px;padding-right:8px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic[dir=rtl]{padding-left:8px;padding-right:4px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing{padding-left:8px;padding-right:8px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing[dir=rtl]{padding-left:8px;padding-right:8px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing{left:8px;right:initial}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing[dir=rtl]{left:initial;right:8px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:0;padding-right:0}.mat-mdc-standard-chip{-webkit-tap-highlight-color:rgba(0,0,0,0)}.cdk-high-contrast-active .mat-mdc-standard-chip{outline:solid 1px}.cdk-high-contrast-active .mat-mdc-standard-chip .mdc-evolution-chip__checkmark-path{stroke:CanvasText !important}.mat-mdc-standard-chip.mdc-evolution-chip--disabled{opacity:.4}.mat-mdc-standard-chip .mdc-evolution-chip__cell--primary,.mat-mdc-standard-chip .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip .mat-mdc-chip-action-label{overflow:visible}.mat-mdc-standard-chip .mdc-evolution-chip__cell--primary{flex-basis:100%}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary{font:inherit;letter-spacing:inherit;white-space:inherit}.mat-mdc-standard-chip .mat-mdc-chip-graphic,.mat-mdc-standard-chip .mat-mdc-chip-trailing-icon{box-sizing:content-box}.mat-mdc-standard-chip._mat-animation-noopable,.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__graphic,.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__checkmark,.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__checkmark-path{transition-duration:1ms;animation-duration:1ms}.mat-mdc-basic-chip .mdc-evolution-chip__action--primary{font:inherit}.mat-mdc-chip-focus-overlay{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;opacity:0;border-radius:inherit;transition:opacity 150ms linear}._mat-animation-noopable .mat-mdc-chip-focus-overlay{transition:none}.mat-mdc-basic-chip .mat-mdc-chip-focus-overlay{display:none}.mat-mdc-chip:hover .mat-mdc-chip-focus-overlay{opacity:.04}.mat-mdc-chip.cdk-focused .mat-mdc-chip-focus-overlay{opacity:.12}.mat-mdc-chip .mat-ripple.mat-mdc-chip-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:inherit}.mat-mdc-chip-avatar{text-align:center;line-height:1;color:var(--mdc-chip-with-icon-icon-color, currentColor)}.mat-mdc-chip{position:relative;z-index:0}.mat-mdc-chip-action-label{text-align:left;z-index:1}[dir=rtl] .mat-mdc-chip-action-label{text-align:right}.mat-mdc-chip.mdc-evolution-chip--with-trailing-action .mat-mdc-chip-action-label{position:relative}.mat-mdc-chip-action-label .mat-mdc-chip-primary-focus-indicator{position:absolute;top:0;right:0;bottom:0;left:0;pointer-events:none}.mat-mdc-chip-action-label .mat-mdc-focus-indicator::before{margin:calc(calc(var(--mat-mdc-focus-indicator-border-width, 3px) + 2px)*-1)}.mat-mdc-chip-remove{opacity:.54}.mat-mdc-chip-remove:focus{opacity:1}.mat-mdc-chip-remove::before{margin:calc(var(--mat-mdc-focus-indicator-border-width, 3px)*-1);left:8px;right:8px}.mat-mdc-chip-remove .mat-icon{width:inherit;height:inherit;font-size:inherit;box-sizing:content-box}.mat-chip-edit-input{cursor:text;display:inline-block;color:inherit;outline:0}.cdk-high-contrast-active .mat-mdc-chip-selected:not(.mat-mdc-chip-multiple){outline-width:3px}.mat-mdc-chip-action:focus .mat-mdc-focus-indicator::before{content:\"\"}"]
    }]
  }], null, {
    selectable: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    selected: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    selectionChange: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Output
    }]
  });
})();

/**
 * A directive that makes a span editable and exposes functions to modify and retrieve the
 * element's contents.
 */
class MatChipEditInput {
  constructor(_elementRef, _document) {
    this._elementRef = _elementRef;
    this._document = _document;
  }
  initialize(initialValue) {
    this.getNativeElement().focus();
    this.setValue(initialValue);
  }
  getNativeElement() {
    return this._elementRef.nativeElement;
  }
  setValue(value) {
    this.getNativeElement().textContent = value;
    this._moveCursorToEndOfInput();
  }
  getValue() {
    return this.getNativeElement().textContent || '';
  }
  _moveCursorToEndOfInput() {
    const range = this._document.createRange();
    range.selectNodeContents(this.getNativeElement());
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
  static #_ = this.ɵfac = function MatChipEditInput_Factory(t) {
    return new (t || MatChipEditInput)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_common__WEBPACK_IMPORTED_MODULE_8__.DOCUMENT));
  };
  static #_2 = this.ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineDirective"]({
    type: MatChipEditInput,
    selectors: [["span", "matChipEditInput", ""]],
    hostAttrs: ["role", "textbox", "tabindex", "-1", "contenteditable", "true", 1, "mat-chip-edit-input"]
  });
}
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](MatChipEditInput, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
    args: [{
      selector: 'span[matChipEditInput]',
      host: {
        'class': 'mat-chip-edit-input',
        'role': 'textbox',
        'tabindex': '-1',
        'contenteditable': 'true'
      }
    }]
  }], () => [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef
  }, {
    type: undefined,
    decorators: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
      args: [_angular_common__WEBPACK_IMPORTED_MODULE_8__.DOCUMENT]
    }]
  }], null);
})();

/**
 * An extension of the MatChip component used with MatChipGrid and
 * the matChipInputFor directive.
 */
class MatChipRow extends MatChip {
  constructor(changeDetectorRef, elementRef, ngZone, focusMonitor, _document, animationMode, globalRippleOptions, tabIndex) {
    super(changeDetectorRef, elementRef, ngZone, focusMonitor, _document, animationMode, globalRippleOptions, tabIndex);
    this.basicChipAttrName = 'mat-basic-chip-row';
    /**
     * The editing action has to be triggered in a timeout. While we're waiting on it, a blur
     * event might occur which will interrupt the editing. This flag is used to avoid interruptions
     * while the editing action is being initialized.
     */
    this._editStartPending = false;
    this.editable = false;
    /** Emitted when the chip is edited. */
    this.edited = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    this._isEditing = false;
    this.role = 'row';
    this._onBlur.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.takeUntil)(this.destroyed)).subscribe(() => {
      if (this._isEditing && !this._editStartPending) {
        this._onEditFinish();
      }
    });
  }
  _hasTrailingIcon() {
    // The trailing icon is hidden while editing.
    return !this._isEditing && super._hasTrailingIcon();
  }
  /** Sends focus to the first gridcell when the user clicks anywhere inside the chip. */
  _handleFocus() {
    if (!this._isEditing && !this.disabled) {
      this.focus();
    }
  }
  _handleKeydown(event) {
    if (event.keyCode === _angular_cdk_keycodes__WEBPACK_IMPORTED_MODULE_1__.ENTER && !this.disabled) {
      if (this._isEditing) {
        event.preventDefault();
        this._onEditFinish();
      } else if (this.editable) {
        this._startEditing(event);
      }
    } else if (this._isEditing) {
      // Stop the event from reaching the chip set in order to avoid navigating.
      event.stopPropagation();
    } else {
      super._handleKeydown(event);
    }
  }
  _handleDoubleclick(event) {
    if (!this.disabled && this.editable) {
      this._startEditing(event);
    }
  }
  _startEditing(event) {
    if (!this.primaryAction || this.removeIcon && this._getSourceAction(event.target) === this.removeIcon) {
      return;
    }
    // The value depends on the DOM so we need to extract it before we flip the flag.
    const value = this.value;
    this._isEditing = this._editStartPending = true;
    // Starting the editing sequence below depends on the edit input
    // query resolving on time. Trigger a synchronous change detection to
    // ensure that it happens by the time we hit the timeout below.
    this._changeDetectorRef.detectChanges();
    // TODO(crisbeto): this timeout shouldn't be necessary given the `detectChange` call above.
    // Defer initializing the input so it has time to be added to the DOM.
    setTimeout(() => {
      this._getEditInput().initialize(value);
      this._editStartPending = false;
    });
  }
  _onEditFinish() {
    this._isEditing = this._editStartPending = false;
    this.edited.emit({
      chip: this,
      value: this._getEditInput().getValue()
    });
    // If the edit input is still focused or focus was returned to the body after it was destroyed,
    // return focus to the chip contents.
    if (this._document.activeElement === this._getEditInput().getNativeElement() || this._document.activeElement === this._document.body) {
      this.primaryAction.focus();
    }
  }
  _isRippleDisabled() {
    return super._isRippleDisabled() || this._isEditing;
  }
  /**
   * Gets the projected chip edit input, or the default input if none is projected in. One of these
   * two values is guaranteed to be defined.
   */
  _getEditInput() {
    return this.contentEditInput || this.defaultEditInput;
  }
  static #_ = this.ɵfac = function MatChipRow_Factory(t) {
    return new (t || MatChipRow)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.ChangeDetectorRef), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.NgZone), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_7__.FocusMonitor), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_common__WEBPACK_IMPORTED_MODULE_8__.DOCUMENT), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.ANIMATION_MODULE_TYPE, 8), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_material_core__WEBPACK_IMPORTED_MODULE_2__.MAT_RIPPLE_GLOBAL_OPTIONS, 8), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinjectAttribute"]('tabindex'));
  };
  static #_2 = this.ɵcmp = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
    type: MatChipRow,
    selectors: [["mat-chip-row"], ["", "mat-chip-row", ""], ["mat-basic-chip-row"], ["", "mat-basic-chip-row", ""]],
    contentQueries: function MatChipRow_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵcontentQuery"](dirIndex, MatChipEditInput, 5);
      }
      if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.contentEditInput = _t.first);
      }
    },
    viewQuery: function MatChipRow_Query(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵviewQuery"](MatChipEditInput, 5);
      }
      if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.defaultEditInput = _t.first);
      }
    },
    hostAttrs: [1, "mat-mdc-chip", "mat-mdc-chip-row", "mdc-evolution-chip"],
    hostVars: 27,
    hostBindings: function MatChipRow_HostBindings(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("focus", function MatChipRow_focus_HostBindingHandler($event) {
          return ctx._handleFocus($event);
        })("dblclick", function MatChipRow_dblclick_HostBindingHandler($event) {
          return ctx._handleDoubleclick($event);
        });
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵhostProperty"]("id", ctx.id);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵattribute"]("tabindex", ctx.disabled ? null : -1)("aria-label", null)("aria-description", null)("role", ctx.role);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("mat-mdc-chip-with-avatar", ctx.leadingIcon)("mat-mdc-chip-disabled", ctx.disabled)("mat-mdc-chip-editing", ctx._isEditing)("mat-mdc-chip-editable", ctx.editable)("mdc-evolution-chip--disabled", ctx.disabled)("mdc-evolution-chip--with-trailing-action", ctx._hasTrailingIcon())("mdc-evolution-chip--with-primary-graphic", ctx.leadingIcon)("mdc-evolution-chip--with-primary-icon", ctx.leadingIcon)("mdc-evolution-chip--with-avatar", ctx.leadingIcon)("mat-mdc-chip-highlighted", ctx.highlighted)("mat-mdc-chip-with-trailing-icon", ctx._hasTrailingIcon());
      }
    },
    inputs: {
      color: "color",
      disabled: "disabled",
      disableRipple: "disableRipple",
      tabIndex: "tabIndex",
      editable: "editable"
    },
    outputs: {
      edited: "edited"
    },
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵProvidersFeature"]([{
      provide: MatChip,
      useExisting: MatChipRow
    }, {
      provide: MAT_CHIP,
      useExisting: MatChipRow
    }]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵInheritDefinitionFeature"]],
    ngContentSelectors: _c4,
    decls: 10,
    vars: 10,
    consts: [["class", "mat-mdc-chip-focus-overlay"], ["role", "gridcell", "matChipAction", "", 1, "mdc-evolution-chip__cell", "mdc-evolution-chip__cell--primary", 3, "tabIndex", "disabled"], ["class", "mdc-evolution-chip__graphic mat-mdc-chip-graphic"], [1, "mdc-evolution-chip__text-label", "mat-mdc-chip-action-label"], ["aria-hidden", "true", 1, "mat-mdc-chip-primary-focus-indicator", "mat-mdc-focus-indicator"], ["class", "mdc-evolution-chip__cell mdc-evolution-chip__cell--trailing", "role", "gridcell"], [1, "cdk-visually-hidden", 3, "id"], [1, "mat-mdc-chip-focus-overlay"], [1, "mdc-evolution-chip__graphic", "mat-mdc-chip-graphic"], ["matChipEditInput", ""], ["role", "gridcell", 1, "mdc-evolution-chip__cell", "mdc-evolution-chip__cell--trailing"]],
    template: function MatChipRow_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojectionDef"](_c3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](0, MatChipRow_Conditional_0_Template, 1, 0, "span", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "span", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, MatChipRow_Conditional_2_Template, 2, 0, "span", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "span", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](4, MatChipRow_Conditional_4_Template, 2, 1)(5, MatChipRow_Conditional_5_Template, 1, 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](6, "span", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](7, MatChipRow_Conditional_7_Template, 2, 0, "span", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "span", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵconditional"](0, !ctx._isEditing ? 0 : -1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("tabIndex", ctx.tabIndex)("disabled", ctx.disabled);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵattribute"]("aria-label", ctx.ariaLabel)("aria-describedby", ctx._ariaDescriptionId);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵconditional"](2, ctx.leadingIcon ? 2 : -1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵconditional"](4, ctx._isEditing ? 4 : 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵconditional"](7, ctx._hasTrailingIcon() ? 7 : -1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("id", ctx._ariaDescriptionId);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.ariaDescription);
      }
    },
    dependencies: [MatChipAction, MatChipEditInput],
    styles: [_c2],
    encapsulation: 2,
    changeDetection: 0
  });
}
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](MatChipRow, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Component,
    args: [{
      selector: 'mat-chip-row, [mat-chip-row], mat-basic-chip-row, [mat-basic-chip-row]',
      inputs: ['color', 'disabled', 'disableRipple', 'tabIndex'],
      host: {
        'class': 'mat-mdc-chip mat-mdc-chip-row mdc-evolution-chip',
        '[class.mat-mdc-chip-with-avatar]': 'leadingIcon',
        '[class.mat-mdc-chip-disabled]': 'disabled',
        '[class.mat-mdc-chip-editing]': '_isEditing',
        '[class.mat-mdc-chip-editable]': 'editable',
        '[class.mdc-evolution-chip--disabled]': 'disabled',
        '[class.mdc-evolution-chip--with-trailing-action]': '_hasTrailingIcon()',
        '[class.mdc-evolution-chip--with-primary-graphic]': 'leadingIcon',
        '[class.mdc-evolution-chip--with-primary-icon]': 'leadingIcon',
        '[class.mdc-evolution-chip--with-avatar]': 'leadingIcon',
        '[class.mat-mdc-chip-highlighted]': 'highlighted',
        '[class.mat-mdc-chip-with-trailing-icon]': '_hasTrailingIcon()',
        '[id]': 'id',
        // Has to have a negative tabindex in order to capture
        // focus and redirect it to the primary action.
        '[attr.tabindex]': 'disabled ? null : -1',
        '[attr.aria-label]': 'null',
        '[attr.aria-description]': 'null',
        '[attr.role]': 'role',
        '(focus)': '_handleFocus($event)',
        '(dblclick)': '_handleDoubleclick($event)'
      },
      providers: [{
        provide: MatChip,
        useExisting: MatChipRow
      }, {
        provide: MAT_CHIP,
        useExisting: MatChipRow
      }],
      encapsulation: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ViewEncapsulation.None,
      changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ChangeDetectionStrategy.OnPush,
      template: "@if (!_isEditing) {\n  <span class=\"mat-mdc-chip-focus-overlay\"></span>\n}\n\n<span class=\"mdc-evolution-chip__cell mdc-evolution-chip__cell--primary\" role=\"gridcell\"\n    matChipAction\n    [tabIndex]=\"tabIndex\"\n    [disabled]=\"disabled\"\n    [attr.aria-label]=\"ariaLabel\"\n    [attr.aria-describedby]=\"_ariaDescriptionId\">\n  @if (leadingIcon) {\n    <span class=\"mdc-evolution-chip__graphic mat-mdc-chip-graphic\">\n      <ng-content select=\"mat-chip-avatar, [matChipAvatar]\"></ng-content>\n    </span>\n  }\n\n  <span class=\"mdc-evolution-chip__text-label mat-mdc-chip-action-label\">\n    @if (_isEditing) {\n      @if (contentEditInput) {\n        <ng-content select=\"[matChipEditInput]\"></ng-content>\n      } @else {\n        <span matChipEditInput></span>\n      }\n    } @else {\n      <ng-content></ng-content>\n    }\n\n    <span class=\"mat-mdc-chip-primary-focus-indicator mat-mdc-focus-indicator\" aria-hidden=\"true\"></span>\n  </span>\n</span>\n\n@if (_hasTrailingIcon()) {\n  <span\n    class=\"mdc-evolution-chip__cell mdc-evolution-chip__cell--trailing\"\n    role=\"gridcell\">\n    <ng-content select=\"mat-chip-trailing-icon,[matChipRemove],[matChipTrailingIcon]\"></ng-content>\n  </span>\n}\n\n<span class=\"cdk-visually-hidden\" [id]=\"_ariaDescriptionId\">{{ariaDescription}}</span>\n",
      styles: [".mdc-evolution-chip,.mdc-evolution-chip__cell,.mdc-evolution-chip__action{display:inline-flex;align-items:center}.mdc-evolution-chip{position:relative;max-width:100%}.mdc-evolution-chip .mdc-elevation-overlay{width:100%;height:100%;top:0;left:0}.mdc-evolution-chip__cell,.mdc-evolution-chip__action{height:100%}.mdc-evolution-chip__cell--primary{overflow-x:hidden}.mdc-evolution-chip__cell--trailing{flex:1 0 auto}.mdc-evolution-chip__action{align-items:center;background:none;border:none;box-sizing:content-box;cursor:pointer;display:inline-flex;justify-content:center;outline:none;padding:0;text-decoration:none;color:inherit}.mdc-evolution-chip__action--presentational{cursor:auto}.mdc-evolution-chip--disabled,.mdc-evolution-chip__action:disabled{pointer-events:none}.mdc-evolution-chip__action--primary{overflow-x:hidden}.mdc-evolution-chip__action--trailing{position:relative;overflow:visible}.mdc-evolution-chip__action--primary:before{box-sizing:border-box;content:\"\";height:100%;left:0;position:absolute;pointer-events:none;top:0;width:100%;z-index:1}.mdc-evolution-chip--touch{margin-top:8px;margin-bottom:8px}.mdc-evolution-chip__action-touch{position:absolute;top:50%;height:48px;left:0;right:0;transform:translateY(-50%)}.mdc-evolution-chip__text-label{white-space:nowrap;user-select:none;text-overflow:ellipsis;overflow:hidden}.mdc-evolution-chip__graphic{align-items:center;display:inline-flex;justify-content:center;overflow:hidden;pointer-events:none;position:relative;flex:1 0 auto}.mdc-evolution-chip__checkmark{position:absolute;opacity:0;top:50%;left:50%}.mdc-evolution-chip--selectable:not(.mdc-evolution-chip--selected):not(.mdc-evolution-chip--with-primary-icon) .mdc-evolution-chip__graphic{width:0}.mdc-evolution-chip__checkmark-background{opacity:0}.mdc-evolution-chip__checkmark-svg{display:block}.mdc-evolution-chip__checkmark-path{stroke-width:2px;stroke-dasharray:29.7833385;stroke-dashoffset:29.7833385;stroke:currentColor}.mdc-evolution-chip--selecting .mdc-evolution-chip__graphic{transition:width 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--selecting .mdc-evolution-chip__checkmark{transition:transform 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1);transform:translate(-75%, -50%)}.mdc-evolution-chip--selecting .mdc-evolution-chip__checkmark-path{transition:stroke-dashoffset 150ms 45ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--deselecting .mdc-evolution-chip__graphic{transition:width 100ms 0ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--deselecting .mdc-evolution-chip__checkmark{transition:opacity 50ms 0ms linear,transform 100ms 0ms cubic-bezier(0.4, 0, 0.2, 1);transform:translate(-75%, -50%)}.mdc-evolution-chip--deselecting .mdc-evolution-chip__checkmark-path{stroke-dashoffset:0}.mdc-evolution-chip--selecting-with-primary-icon .mdc-evolution-chip__icon--primary{transition:opacity 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--selecting-with-primary-icon .mdc-evolution-chip__checkmark-path{transition:stroke-dashoffset 150ms 75ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--deselecting-with-primary-icon .mdc-evolution-chip__icon--primary{transition:opacity 150ms 75ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--deselecting-with-primary-icon .mdc-evolution-chip__checkmark{transition:opacity 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1);transform:translate(-50%, -50%)}.mdc-evolution-chip--deselecting-with-primary-icon .mdc-evolution-chip__checkmark-path{stroke-dashoffset:0}.mdc-evolution-chip--selected .mdc-evolution-chip__icon--primary{opacity:0}.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark{transform:translate(-50%, -50%);opacity:1}.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark-path{stroke-dashoffset:0}@keyframes mdc-evolution-chip-enter{from{transform:scale(0.8);opacity:.4}to{transform:scale(1);opacity:1}}.mdc-evolution-chip--enter{animation:mdc-evolution-chip-enter 100ms 0ms cubic-bezier(0, 0, 0.2, 1)}@keyframes mdc-evolution-chip-exit{from{opacity:1}to{opacity:0}}.mdc-evolution-chip--exit{animation:mdc-evolution-chip-exit 75ms 0ms cubic-bezier(0.4, 0, 1, 1)}.mdc-evolution-chip--hidden{opacity:0;pointer-events:none;transition:width 150ms 0ms cubic-bezier(0.4, 0, 1, 1)}.mat-mdc-standard-chip{border-radius:var(--mdc-chip-container-shape-radius);height:var(--mdc-chip-container-height)}.mat-mdc-standard-chip .mdc-evolution-chip__ripple{border-radius:var(--mdc-chip-container-shape-radius)}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary:before{border-radius:var(--mdc-chip-container-shape-radius)}.mat-mdc-standard-chip .mdc-evolution-chip__icon--primary{border-radius:var(--mdc-chip-with-avatar-avatar-shape-radius)}.mat-mdc-standard-chip.mdc-evolution-chip--selectable:not(.mdc-evolution-chip--with-primary-icon){--mdc-chip-graphic-selected-width:var(--mdc-chip-with-avatar-avatar-size)}.mat-mdc-standard-chip .mdc-evolution-chip__graphic{height:var(--mdc-chip-with-avatar-avatar-size);width:var(--mdc-chip-with-avatar-avatar-size);font-size:var(--mdc-chip-with-avatar-avatar-size)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled){background-color:var(--mdc-chip-elevated-container-color)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled{background-color:var(--mdc-chip-elevated-disabled-container-color)}.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled{background-color:var(--mdc-chip-elevated-disabled-container-color)}.mat-mdc-standard-chip .mdc-evolution-chip__text-label{font-family:var(--mdc-chip-label-text-font);line-height:var(--mdc-chip-label-text-line-height);font-size:var(--mdc-chip-label-text-size);font-weight:var(--mdc-chip-label-text-weight);letter-spacing:var(--mdc-chip-label-text-tracking)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__text-label{color:var(--mdc-chip-label-text-color)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__text-label{color:var(--mdc-chip-disabled-label-text-color)}.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled .mdc-evolution-chip__text-label{color:var(--mdc-chip-disabled-label-text-color)}.mat-mdc-standard-chip .mdc-evolution-chip__icon--primary{height:var(--mdc-chip-with-icon-icon-size);width:var(--mdc-chip-with-icon-icon-size);font-size:var(--mdc-chip-with-icon-icon-size)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__icon--primary{color:var(--mdc-chip-with-icon-icon-color)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--primary{color:var(--mdc-chip-with-icon-disabled-icon-color)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__checkmark{color:var(--mdc-chip-with-icon-selected-icon-color)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__checkmark{color:var(--mdc-chip-with-icon-disabled-icon-color)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__icon--trailing{color:var(--mdc-chip-with-trailing-icon-trailing-icon-color)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing{color:var(--mdc-chip-with-trailing-icon-disabled-trailing-icon-color)}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary.mdc-ripple-upgraded--background-focused .mdc-evolution-chip__ripple::before,.mat-mdc-standard-chip .mdc-evolution-chip__action--primary:not(.mdc-ripple-upgraded):focus .mdc-evolution-chip__ripple::before{transition-duration:75ms;opacity:var(--mdc-chip-focus-state-layer-opacity)}.mat-mdc-chip-focus-overlay{background:var(--mdc-chip-focus-state-layer-color);opacity:var(--mdc-chip-focus-state-layer-opacity)}.mat-mdc-standard-chip .mdc-evolution-chip__checkmark{height:20px;width:20px}.mat-mdc-standard-chip .mdc-evolution-chip__icon--trailing{height:18px;width:18px;font-size:18px}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:12px}[dir=rtl] .mat-mdc-standard-chip .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:12px;padding-right:12px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic{padding-left:6px;padding-right:6px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic[dir=rtl]{padding-left:6px;padding-right:6px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary{padding-left:0;padding-right:12px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:12px;padding-right:0}.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing{padding-left:8px;padding-right:8px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing,.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing[dir=rtl]{padding-left:8px;padding-right:8px}.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing{left:8px;right:initial}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing,.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing[dir=rtl]{left:initial;right:8px}.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:0}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:0;padding-right:12px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic{padding-left:6px;padding-right:6px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic[dir=rtl]{padding-left:6px;padding-right:6px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing{padding-left:8px;padding-right:8px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing[dir=rtl]{padding-left:8px;padding-right:8px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing{left:8px;right:initial}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing[dir=rtl]{left:initial;right:8px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:0;padding-right:0}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__checkmark{color:var(--mdc-chip-with-icon-selected-icon-color, currentColor)}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic{padding-left:4px;padding-right:8px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic[dir=rtl]{padding-left:8px;padding-right:4px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary{padding-left:0;padding-right:12px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:12px;padding-right:0}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic{padding-left:4px;padding-right:8px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic[dir=rtl]{padding-left:8px;padding-right:4px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing{padding-left:8px;padding-right:8px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--trailing[dir=rtl]{padding-left:8px;padding-right:8px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing{left:8px;right:initial}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__ripple--trailing[dir=rtl]{left:initial;right:8px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary,.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary[dir=rtl]{padding-left:0;padding-right:0}.mat-mdc-standard-chip{-webkit-tap-highlight-color:rgba(0,0,0,0)}.cdk-high-contrast-active .mat-mdc-standard-chip{outline:solid 1px}.cdk-high-contrast-active .mat-mdc-standard-chip .mdc-evolution-chip__checkmark-path{stroke:CanvasText !important}.mat-mdc-standard-chip.mdc-evolution-chip--disabled{opacity:.4}.mat-mdc-standard-chip .mdc-evolution-chip__cell--primary,.mat-mdc-standard-chip .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip .mat-mdc-chip-action-label{overflow:visible}.mat-mdc-standard-chip .mdc-evolution-chip__cell--primary{flex-basis:100%}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary{font:inherit;letter-spacing:inherit;white-space:inherit}.mat-mdc-standard-chip .mat-mdc-chip-graphic,.mat-mdc-standard-chip .mat-mdc-chip-trailing-icon{box-sizing:content-box}.mat-mdc-standard-chip._mat-animation-noopable,.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__graphic,.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__checkmark,.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__checkmark-path{transition-duration:1ms;animation-duration:1ms}.mat-mdc-basic-chip .mdc-evolution-chip__action--primary{font:inherit}.mat-mdc-chip-focus-overlay{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;opacity:0;border-radius:inherit;transition:opacity 150ms linear}._mat-animation-noopable .mat-mdc-chip-focus-overlay{transition:none}.mat-mdc-basic-chip .mat-mdc-chip-focus-overlay{display:none}.mat-mdc-chip:hover .mat-mdc-chip-focus-overlay{opacity:.04}.mat-mdc-chip.cdk-focused .mat-mdc-chip-focus-overlay{opacity:.12}.mat-mdc-chip .mat-ripple.mat-mdc-chip-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:inherit}.mat-mdc-chip-avatar{text-align:center;line-height:1;color:var(--mdc-chip-with-icon-icon-color, currentColor)}.mat-mdc-chip{position:relative;z-index:0}.mat-mdc-chip-action-label{text-align:left;z-index:1}[dir=rtl] .mat-mdc-chip-action-label{text-align:right}.mat-mdc-chip.mdc-evolution-chip--with-trailing-action .mat-mdc-chip-action-label{position:relative}.mat-mdc-chip-action-label .mat-mdc-chip-primary-focus-indicator{position:absolute;top:0;right:0;bottom:0;left:0;pointer-events:none}.mat-mdc-chip-action-label .mat-mdc-focus-indicator::before{margin:calc(calc(var(--mat-mdc-focus-indicator-border-width, 3px) + 2px)*-1)}.mat-mdc-chip-remove{opacity:.54}.mat-mdc-chip-remove:focus{opacity:1}.mat-mdc-chip-remove::before{margin:calc(var(--mat-mdc-focus-indicator-border-width, 3px)*-1);left:8px;right:8px}.mat-mdc-chip-remove .mat-icon{width:inherit;height:inherit;font-size:inherit;box-sizing:content-box}.mat-chip-edit-input{cursor:text;display:inline-block;color:inherit;outline:0}.cdk-high-contrast-active .mat-mdc-chip-selected:not(.mat-mdc-chip-multiple){outline-width:3px}.mat-mdc-chip-action:focus .mat-mdc-focus-indicator::before{content:\"\"}"]
    }]
  }], () => [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ChangeDetectorRef
  }, {
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef
  }, {
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.NgZone
  }, {
    type: _angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_7__.FocusMonitor
  }, {
    type: undefined,
    decorators: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
      args: [_angular_common__WEBPACK_IMPORTED_MODULE_8__.DOCUMENT]
    }]
  }, {
    type: undefined,
    decorators: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
      args: [_angular_core__WEBPACK_IMPORTED_MODULE_0__.ANIMATION_MODULE_TYPE]
    }]
  }, {
    type: undefined,
    decorators: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
      args: [_angular_material_core__WEBPACK_IMPORTED_MODULE_2__.MAT_RIPPLE_GLOBAL_OPTIONS]
    }]
  }, {
    type: undefined,
    decorators: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Attribute,
      args: ['tabindex']
    }]
  }], {
    editable: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    edited: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Output
    }],
    defaultEditInput: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ViewChild,
      args: [MatChipEditInput]
    }],
    contentEditInput: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ContentChild,
      args: [MatChipEditInput]
    }]
  });
})();

/**
 * Boilerplate for applying mixins to MatChipSet.
 * @docs-private
 */
class MatChipSetBase {
  constructor(_elementRef) {}
}
const _MatChipSetMixinBase = (0,_angular_material_core__WEBPACK_IMPORTED_MODULE_2__.mixinTabIndex)(MatChipSetBase);
/**
 * Basic container component for the MatChip component.
 *
 * Extended by MatChipListbox and MatChipGrid for different interaction patterns.
 */
class MatChipSet extends _MatChipSetMixinBase {
  /** Combined stream of all of the child chips' focus events. */
  get chipFocusChanges() {
    return this._getChipStream(chip => chip._onFocus);
  }
  /** Combined stream of all of the child chips' remove events. */
  get chipDestroyedChanges() {
    return this._getChipStream(chip => chip.destroyed);
  }
  /** Whether the chip set is disabled. */
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_3__.coerceBooleanProperty)(value);
    this._syncChipsState();
  }
  /** Whether the chip list contains chips or not. */
  get empty() {
    return !this._chips || this._chips.length === 0;
  }
  /** The ARIA role applied to the chip set. */
  get role() {
    if (this._explicitRole) {
      return this._explicitRole;
    }
    return this.empty ? null : this._defaultRole;
  }
  set role(value) {
    this._explicitRole = value;
  }
  /** Whether any of the chips inside of this chip-set has focus. */
  get focused() {
    return this._hasFocusedChip();
  }
  constructor(_elementRef, _changeDetectorRef, _dir) {
    super(_elementRef);
    this._elementRef = _elementRef;
    this._changeDetectorRef = _changeDetectorRef;
    this._dir = _dir;
    /** Index of the last destroyed chip that had focus. */
    this._lastDestroyedFocusedChipIndex = null;
    /** Subject that emits when the component has been destroyed. */
    this._destroyed = new rxjs__WEBPACK_IMPORTED_MODULE_4__.Subject();
    /** Role to use if it hasn't been overwritten by the user. */
    this._defaultRole = 'presentation';
    this._disabled = false;
    this._explicitRole = null;
    /** Flat list of all the actions contained within the chips. */
    this._chipActions = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.QueryList();
  }
  ngAfterViewInit() {
    this._setUpFocusManagement();
    this._trackChipSetChanges();
    this._trackDestroyedFocusedChip();
  }
  ngOnDestroy() {
    this._keyManager?.destroy();
    this._chipActions.destroy();
    this._destroyed.next();
    this._destroyed.complete();
  }
  /** Checks whether any of the chips is focused. */
  _hasFocusedChip() {
    return this._chips && this._chips.some(chip => chip._hasFocus());
  }
  /** Syncs the chip-set's state with the individual chips. */
  _syncChipsState() {
    if (this._chips) {
      this._chips.forEach(chip => {
        chip.disabled = this._disabled;
        chip._changeDetectorRef.markForCheck();
      });
    }
  }
  /** Dummy method for subclasses to override. Base chip set cannot be focused. */
  focus() {}
  /** Handles keyboard events on the chip set. */
  _handleKeydown(event) {
    if (this._originatesFromChip(event)) {
      this._keyManager.onKeydown(event);
    }
  }
  /**
   * Utility to ensure all indexes are valid.
   *
   * @param index The index to be checked.
   * @returns True if the index is valid for our list of chips.
   */
  _isValidIndex(index) {
    return index >= 0 && index < this._chips.length;
  }
  /**
   * Removes the `tabindex` from the chip set and resets it back afterwards, allowing the
   * user to tab out of it. This prevents the set from capturing focus and redirecting
   * it back to the first chip, creating a focus trap, if it user tries to tab away.
   */
  _allowFocusEscape() {
    if (this.tabIndex !== -1) {
      const previousTabIndex = this.tabIndex;
      this.tabIndex = -1;
      // Note that this needs to be a `setTimeout`, because a `Promise.resolve`
      // doesn't allow enough time for the focus to escape.
      setTimeout(() => this.tabIndex = previousTabIndex);
    }
  }
  /**
   * Gets a stream of events from all the chips within the set.
   * The stream will automatically incorporate any newly-added chips.
   */
  _getChipStream(mappingFunction) {
    return this._chips.changes.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.startWith)(null), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_11__.switchMap)(() => (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.merge)(...this._chips.map(mappingFunction))));
  }
  /** Checks whether an event comes from inside a chip element. */
  _originatesFromChip(event) {
    let currentElement = event.target;
    while (currentElement && currentElement !== this._elementRef.nativeElement) {
      if (currentElement.classList.contains('mat-mdc-chip')) {
        return true;
      }
      currentElement = currentElement.parentElement;
    }
    return false;
  }
  /** Sets up the chip set's focus management logic. */
  _setUpFocusManagement() {
    // Create a flat `QueryList` containing the actions of all of the chips.
    // This allows us to navigate both within the chip and move to the next/previous
    // one using the existing `ListKeyManager`.
    this._chips.changes.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.startWith)(this._chips)).subscribe(chips => {
      const actions = [];
      chips.forEach(chip => chip._getActions().forEach(action => actions.push(action)));
      this._chipActions.reset(actions);
      this._chipActions.notifyOnChanges();
    });
    this._keyManager = new _angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_7__.FocusKeyManager(this._chipActions).withVerticalOrientation().withHorizontalOrientation(this._dir ? this._dir.value : 'ltr').withHomeAndEnd().skipPredicate(action => this._skipPredicate(action));
    // Keep the manager active index in sync so that navigation picks
    // up from the current chip if the user clicks into the list directly.
    this.chipFocusChanges.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.takeUntil)(this._destroyed)).subscribe(({
      chip
    }) => {
      const action = chip._getSourceAction(document.activeElement);
      if (action) {
        this._keyManager.updateActiveItem(action);
      }
    });
    this._dir?.change.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.takeUntil)(this._destroyed)).subscribe(direction => this._keyManager.withHorizontalOrientation(direction));
  }
  /**
   * Determines if key manager should avoid putting a given chip action in the tab index. Skip
   * non-interactive and disabled actions since the user can't do anything with them.
   */
  _skipPredicate(action) {
    // Skip chips that the user cannot interact with. `mat-chip-set` does not permit focusing disabled
    // chips.
    return !action.isInteractive || action.disabled;
  }
  /** Listens to changes in the chip set and syncs up the state of the individual chips. */
  _trackChipSetChanges() {
    this._chips.changes.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.startWith)(null), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.takeUntil)(this._destroyed)).subscribe(() => {
      if (this.disabled) {
        // Since this happens after the content has been
        // checked, we need to defer it to the next tick.
        Promise.resolve().then(() => this._syncChipsState());
      }
      this._redirectDestroyedChipFocus();
    });
  }
  /** Starts tracking the destroyed chips in order to capture the focused one. */
  _trackDestroyedFocusedChip() {
    this.chipDestroyedChanges.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.takeUntil)(this._destroyed)).subscribe(event => {
      const chipArray = this._chips.toArray();
      const chipIndex = chipArray.indexOf(event.chip);
      // If the focused chip is destroyed, save its index so that we can move focus to the next
      // chip. We only save the index here, rather than move the focus immediately, because we want
      // to wait until the chip is removed from the chip list before focusing the next one. This
      // allows us to keep focus on the same index if the chip gets swapped out.
      if (this._isValidIndex(chipIndex) && event.chip._hasFocus()) {
        this._lastDestroyedFocusedChipIndex = chipIndex;
      }
    });
  }
  /**
   * Finds the next appropriate chip to move focus to,
   * if the currently-focused chip is destroyed.
   */
  _redirectDestroyedChipFocus() {
    if (this._lastDestroyedFocusedChipIndex == null) {
      return;
    }
    if (this._chips.length) {
      const newIndex = Math.min(this._lastDestroyedFocusedChipIndex, this._chips.length - 1);
      const chipToFocus = this._chips.toArray()[newIndex];
      if (chipToFocus.disabled) {
        // If we're down to one disabled chip, move focus back to the set.
        if (this._chips.length === 1) {
          this.focus();
        } else {
          this._keyManager.setPreviousItemActive();
        }
      } else {
        chipToFocus.focus();
      }
    } else {
      this.focus();
    }
    this._lastDestroyedFocusedChipIndex = null;
  }
  static #_ = this.ɵfac = function MatChipSet_Factory(t) {
    return new (t || MatChipSet)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.ChangeDetectorRef), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_cdk_bidi__WEBPACK_IMPORTED_MODULE_12__.Directionality, 8));
  };
  static #_2 = this.ɵcmp = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
    type: MatChipSet,
    selectors: [["mat-chip-set"]],
    contentQueries: function MatChipSet_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵcontentQuery"](dirIndex, MatChip, 5);
      }
      if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx._chips = _t);
      }
    },
    hostAttrs: [1, "mat-mdc-chip-set", "mdc-evolution-chip-set"],
    hostVars: 1,
    hostBindings: function MatChipSet_HostBindings(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("keydown", function MatChipSet_keydown_HostBindingHandler($event) {
          return ctx._handleKeydown($event);
        });
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵattribute"]("role", ctx.role);
      }
    },
    inputs: {
      disabled: "disabled",
      role: "role"
    },
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵInheritDefinitionFeature"]],
    ngContentSelectors: _c5,
    decls: 2,
    vars: 0,
    consts: [["role", "presentation", 1, "mdc-evolution-chip-set__chips"]],
    template: function MatChipSet_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojectionDef"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojection"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }
    },
    styles: [".mdc-evolution-chip-set{display:flex}.mdc-evolution-chip-set:focus{outline:none}.mdc-evolution-chip-set__chips{display:flex;flex-flow:wrap;min-width:0}.mdc-evolution-chip-set--overflow .mdc-evolution-chip-set__chips{flex-flow:nowrap}.mdc-evolution-chip-set .mdc-evolution-chip-set__chips{margin-left:-8px;margin-right:0}[dir=rtl] .mdc-evolution-chip-set .mdc-evolution-chip-set__chips,.mdc-evolution-chip-set .mdc-evolution-chip-set__chips[dir=rtl]{margin-left:0;margin-right:-8px}.mdc-evolution-chip-set .mdc-evolution-chip{margin-left:8px;margin-right:0}[dir=rtl] .mdc-evolution-chip-set .mdc-evolution-chip,.mdc-evolution-chip-set .mdc-evolution-chip[dir=rtl]{margin-left:0;margin-right:8px}.mdc-evolution-chip-set .mdc-evolution-chip{margin-top:4px;margin-bottom:4px}.mat-mdc-chip-set .mdc-evolution-chip-set__chips{min-width:100%}.mat-mdc-chip-set-stacked{flex-direction:column;align-items:flex-start}.mat-mdc-chip-set-stacked .mat-mdc-chip{width:100%}.mat-mdc-chip-set-stacked .mdc-evolution-chip__graphic{flex-grow:0}.mat-mdc-chip-set-stacked .mdc-evolution-chip__action--primary{flex-basis:100%;justify-content:start}input.mat-mdc-chip-input{flex:1 0 150px;margin-left:8px}[dir=rtl] input.mat-mdc-chip-input{margin-left:0;margin-right:8px}"],
    encapsulation: 2,
    changeDetection: 0
  });
}
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](MatChipSet, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Component,
    args: [{
      selector: 'mat-chip-set',
      template: `
    <div class="mdc-evolution-chip-set__chips" role="presentation">
      <ng-content></ng-content>
    </div>
  `,
      host: {
        'class': 'mat-mdc-chip-set mdc-evolution-chip-set',
        '(keydown)': '_handleKeydown($event)',
        '[attr.role]': 'role'
      },
      encapsulation: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ViewEncapsulation.None,
      changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ChangeDetectionStrategy.OnPush,
      styles: [".mdc-evolution-chip-set{display:flex}.mdc-evolution-chip-set:focus{outline:none}.mdc-evolution-chip-set__chips{display:flex;flex-flow:wrap;min-width:0}.mdc-evolution-chip-set--overflow .mdc-evolution-chip-set__chips{flex-flow:nowrap}.mdc-evolution-chip-set .mdc-evolution-chip-set__chips{margin-left:-8px;margin-right:0}[dir=rtl] .mdc-evolution-chip-set .mdc-evolution-chip-set__chips,.mdc-evolution-chip-set .mdc-evolution-chip-set__chips[dir=rtl]{margin-left:0;margin-right:-8px}.mdc-evolution-chip-set .mdc-evolution-chip{margin-left:8px;margin-right:0}[dir=rtl] .mdc-evolution-chip-set .mdc-evolution-chip,.mdc-evolution-chip-set .mdc-evolution-chip[dir=rtl]{margin-left:0;margin-right:8px}.mdc-evolution-chip-set .mdc-evolution-chip{margin-top:4px;margin-bottom:4px}.mat-mdc-chip-set .mdc-evolution-chip-set__chips{min-width:100%}.mat-mdc-chip-set-stacked{flex-direction:column;align-items:flex-start}.mat-mdc-chip-set-stacked .mat-mdc-chip{width:100%}.mat-mdc-chip-set-stacked .mdc-evolution-chip__graphic{flex-grow:0}.mat-mdc-chip-set-stacked .mdc-evolution-chip__action--primary{flex-basis:100%;justify-content:start}input.mat-mdc-chip-input{flex:1 0 150px;margin-left:8px}[dir=rtl] input.mat-mdc-chip-input{margin-left:0;margin-right:8px}"]
    }]
  }], () => [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef
  }, {
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ChangeDetectorRef
  }, {
    type: _angular_cdk_bidi__WEBPACK_IMPORTED_MODULE_12__.Directionality,
    decorators: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
    }]
  }], {
    disabled: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    role: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    _chips: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ContentChildren,
      args: [MatChip, {
        // We need to use `descendants: true`, because Ivy will no longer match
        // indirect descendants if it's left as false.
        descendants: true
      }]
    }]
  });
})();

/** Change event object that is emitted when the chip listbox value has changed. */
class MatChipListboxChange {
  constructor( /** Chip listbox that emitted the event. */
  source, /** Value of the chip listbox when the event was emitted. */
  value) {
    this.source = source;
    this.value = value;
  }
}
/**
 * Provider Expression that allows mat-chip-listbox to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 * @docs-private
 */
const MAT_CHIP_LISTBOX_CONTROL_VALUE_ACCESSOR = {
  provide: _angular_forms__WEBPACK_IMPORTED_MODULE_13__.NG_VALUE_ACCESSOR,
  useExisting: (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(() => MatChipListbox),
  multi: true
};
/**
 * An extension of the MatChipSet component that supports chip selection.
 * Used with MatChipOption chips.
 */
class MatChipListbox extends MatChipSet {
  constructor() {
    super(...arguments);
    /**
     * Function when touched. Set as part of ControlValueAccessor implementation.
     * @docs-private
     */
    this._onTouched = () => {};
    /**
     * Function when changed. Set as part of ControlValueAccessor implementation.
     * @docs-private
     */
    this._onChange = () => {};
    // TODO: MDC uses `grid` here
    this._defaultRole = 'listbox';
    /** Default chip options. */
    this._defaultOptions = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(MAT_CHIPS_DEFAULT_OPTIONS, {
      optional: true
    });
    this._multiple = false;
    /** Orientation of the chip list. */
    this.ariaOrientation = 'horizontal';
    this._selectable = true;
    /**
     * A function to compare the option values with the selected values. The first argument
     * is a value from an option. The second is a value from the selection. A boolean
     * should be returned.
     */
    this.compareWith = (o1, o2) => o1 === o2;
    this._required = false;
    this._hideSingleSelectionIndicator = this._defaultOptions?.hideSingleSelectionIndicator ?? false;
    /** Event emitted when the selected chip listbox value has been changed by the user. */
    this.change = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    this._chips = undefined;
  }
  /** Whether the user should be allowed to select multiple chips. */
  get multiple() {
    return this._multiple;
  }
  set multiple(value) {
    this._multiple = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_3__.coerceBooleanProperty)(value);
    this._syncListboxProperties();
  }
  /** The array of selected chips inside the chip listbox. */
  get selected() {
    const selectedChips = this._chips.toArray().filter(chip => chip.selected);
    return this.multiple ? selectedChips : selectedChips[0];
  }
  /**
   * Whether or not this chip listbox is selectable.
   *
   * When a chip listbox is not selectable, the selected states for all
   * the chips inside the chip listbox are always ignored.
   */
  get selectable() {
    return this._selectable;
  }
  set selectable(value) {
    this._selectable = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_3__.coerceBooleanProperty)(value);
    this._syncListboxProperties();
  }
  /** Whether this chip listbox is required. */
  get required() {
    return this._required;
  }
  set required(value) {
    this._required = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_3__.coerceBooleanProperty)(value);
  }
  /** Whether checkmark indicator for single-selection options is hidden. */
  get hideSingleSelectionIndicator() {
    return this._hideSingleSelectionIndicator;
  }
  set hideSingleSelectionIndicator(value) {
    this._hideSingleSelectionIndicator = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_3__.coerceBooleanProperty)(value);
    this._syncListboxProperties();
  }
  /** Combined stream of all of the child chips' selection change events. */
  get chipSelectionChanges() {
    return this._getChipStream(chip => chip.selectionChange);
  }
  /** Combined stream of all of the child chips' blur events. */
  get chipBlurChanges() {
    return this._getChipStream(chip => chip._onBlur);
  }
  /** The value of the listbox, which is the combined value of the selected chips. */
  get value() {
    return this._value;
  }
  set value(value) {
    this.writeValue(value);
    this._value = value;
  }
  ngAfterContentInit() {
    if (this._pendingInitialValue !== undefined) {
      Promise.resolve().then(() => {
        this._setSelectionByValue(this._pendingInitialValue, false);
        this._pendingInitialValue = undefined;
      });
    }
    this._chips.changes.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.startWith)(null), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.takeUntil)(this._destroyed)).subscribe(() => {
      // Update listbox selectable/multiple properties on chips
      this._syncListboxProperties();
    });
    this.chipBlurChanges.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.takeUntil)(this._destroyed)).subscribe(() => this._blur());
    this.chipSelectionChanges.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.takeUntil)(this._destroyed)).subscribe(event => {
      if (!this.multiple) {
        this._chips.forEach(chip => {
          if (chip !== event.source) {
            chip._setSelectedState(false, false, false);
          }
        });
      }
      if (event.isUserInput) {
        this._propagateChanges();
      }
    });
  }
  /**
   * Focuses the first selected chip in this chip listbox, or the first non-disabled chip when there
   * are no selected chips.
   */
  focus() {
    if (this.disabled) {
      return;
    }
    const firstSelectedChip = this._getFirstSelectedChip();
    if (firstSelectedChip && !firstSelectedChip.disabled) {
      firstSelectedChip.focus();
    } else if (this._chips.length > 0) {
      this._keyManager.setFirstItemActive();
    } else {
      this._elementRef.nativeElement.focus();
    }
  }
  /**
   * Implemented as part of ControlValueAccessor.
   * @docs-private
   */
  writeValue(value) {
    if (this._chips) {
      this._setSelectionByValue(value, false);
    } else if (value != null) {
      this._pendingInitialValue = value;
    }
  }
  /**
   * Implemented as part of ControlValueAccessor.
   * @docs-private
   */
  registerOnChange(fn) {
    this._onChange = fn;
  }
  /**
   * Implemented as part of ControlValueAccessor.
   * @docs-private
   */
  registerOnTouched(fn) {
    this._onTouched = fn;
  }
  /**
   * Implemented as part of ControlValueAccessor.
   * @docs-private
   */
  setDisabledState(isDisabled) {
    this.disabled = isDisabled;
  }
  /** Selects all chips with value. */
  _setSelectionByValue(value, isUserInput = true) {
    this._clearSelection();
    if (Array.isArray(value)) {
      value.forEach(currentValue => this._selectValue(currentValue, isUserInput));
    } else {
      this._selectValue(value, isUserInput);
    }
  }
  /** When blurred, marks the field as touched when focus moved outside the chip listbox. */
  _blur() {
    if (!this.disabled) {
      // Wait to see if focus moves to an individual chip.
      setTimeout(() => {
        if (!this.focused) {
          this._markAsTouched();
        }
      });
    }
  }
  _keydown(event) {
    if (event.keyCode === _angular_cdk_keycodes__WEBPACK_IMPORTED_MODULE_1__.TAB) {
      super._allowFocusEscape();
    }
  }
  /** Marks the field as touched */
  _markAsTouched() {
    this._onTouched();
    this._changeDetectorRef.markForCheck();
  }
  /** Emits change event to set the model value. */
  _propagateChanges() {
    let valueToEmit = null;
    if (Array.isArray(this.selected)) {
      valueToEmit = this.selected.map(chip => chip.value);
    } else {
      valueToEmit = this.selected ? this.selected.value : undefined;
    }
    this._value = valueToEmit;
    this.change.emit(new MatChipListboxChange(this, valueToEmit));
    this._onChange(valueToEmit);
    this._changeDetectorRef.markForCheck();
  }
  /**
   * Deselects every chip in the listbox.
   * @param skip Chip that should not be deselected.
   */
  _clearSelection(skip) {
    this._chips.forEach(chip => {
      if (chip !== skip) {
        chip.deselect();
      }
    });
  }
  /**
   * Finds and selects the chip based on its value.
   * @returns Chip that has the corresponding value.
   */
  _selectValue(value, isUserInput) {
    const correspondingChip = this._chips.find(chip => {
      return chip.value != null && this.compareWith(chip.value, value);
    });
    if (correspondingChip) {
      isUserInput ? correspondingChip.selectViaInteraction() : correspondingChip.select();
    }
    return correspondingChip;
  }
  /** Syncs the chip-listbox selection state with the individual chips. */
  _syncListboxProperties() {
    if (this._chips) {
      // Defer setting the value in order to avoid the "Expression
      // has changed after it was checked" errors from Angular.
      Promise.resolve().then(() => {
        this._chips.forEach(chip => {
          chip._chipListMultiple = this.multiple;
          chip.chipListSelectable = this._selectable;
          chip._chipListHideSingleSelectionIndicator = this.hideSingleSelectionIndicator;
          chip._changeDetectorRef.markForCheck();
        });
      });
    }
  }
  /** Returns the first selected chip in this listbox, or undefined if no chips are selected. */
  _getFirstSelectedChip() {
    if (Array.isArray(this.selected)) {
      return this.selected.length ? this.selected[0] : undefined;
    } else {
      return this.selected;
    }
  }
  /**
   * Determines if key manager should avoid putting a given chip action in the tab index. Skip
   * non-interactive actions since the user can't do anything with them.
   */
  _skipPredicate(action) {
    // Override the skip predicate in the base class to avoid skipping disabled chips. Allow
    // disabled chip options to receive focus to align with WAI ARIA recommendation. Normally WAI
    // ARIA's instructions are to exclude disabled items from the tab order, but it makes a few
    // exceptions for compound widgets.
    //
    // From [Developing a Keyboard Interface](
    // https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/):
    //   "For the following composite widget elements, keep them focusable when disabled: Options in a
    //   Listbox..."
    return !action.isInteractive;
  }
  static #_ = this.ɵfac = /* @__PURE__ */(() => {
    let ɵMatChipListbox_BaseFactory;
    return function MatChipListbox_Factory(t) {
      return (ɵMatChipListbox_BaseFactory || (ɵMatChipListbox_BaseFactory = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetInheritedFactory"](MatChipListbox)))(t || MatChipListbox);
    };
  })();
  static #_2 = this.ɵcmp = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
    type: MatChipListbox,
    selectors: [["mat-chip-listbox"]],
    contentQueries: function MatChipListbox_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵcontentQuery"](dirIndex, MatChipOption, 5);
      }
      if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx._chips = _t);
      }
    },
    hostAttrs: [1, "mdc-evolution-chip-set", "mat-mdc-chip-listbox"],
    hostVars: 11,
    hostBindings: function MatChipListbox_HostBindings(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("focus", function MatChipListbox_focus_HostBindingHandler() {
          return ctx.focus();
        })("blur", function MatChipListbox_blur_HostBindingHandler() {
          return ctx._blur();
        })("keydown", function MatChipListbox_keydown_HostBindingHandler($event) {
          return ctx._keydown($event);
        });
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵhostProperty"]("tabIndex", ctx.empty ? -1 : ctx.tabIndex);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵattribute"]("role", ctx.role)("aria-describedby", ctx._ariaDescribedby || null)("aria-required", ctx.role ? ctx.required : null)("aria-disabled", ctx.disabled.toString())("aria-multiselectable", ctx.multiple)("aria-orientation", ctx.ariaOrientation);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("mat-mdc-chip-list-disabled", ctx.disabled)("mat-mdc-chip-list-required", ctx.required);
      }
    },
    inputs: {
      tabIndex: "tabIndex",
      multiple: "multiple",
      ariaOrientation: ["aria-orientation", "ariaOrientation"],
      selectable: "selectable",
      compareWith: "compareWith",
      required: "required",
      hideSingleSelectionIndicator: "hideSingleSelectionIndicator",
      value: "value"
    },
    outputs: {
      change: "change"
    },
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵProvidersFeature"]([MAT_CHIP_LISTBOX_CONTROL_VALUE_ACCESSOR]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵInheritDefinitionFeature"]],
    ngContentSelectors: _c5,
    decls: 2,
    vars: 0,
    consts: [["role", "presentation", 1, "mdc-evolution-chip-set__chips"]],
    template: function MatChipListbox_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojectionDef"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojection"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }
    },
    styles: [_c6],
    encapsulation: 2,
    changeDetection: 0
  });
}
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](MatChipListbox, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Component,
    args: [{
      selector: 'mat-chip-listbox',
      template: `
    <div class="mdc-evolution-chip-set__chips" role="presentation">
      <ng-content></ng-content>
    </div>
  `,
      inputs: ['tabIndex'],
      host: {
        'class': 'mdc-evolution-chip-set mat-mdc-chip-listbox',
        '[attr.role]': 'role',
        '[tabIndex]': 'empty ? -1 : tabIndex',
        // TODO: replace this binding with use of AriaDescriber
        '[attr.aria-describedby]': '_ariaDescribedby || null',
        '[attr.aria-required]': 'role ? required : null',
        '[attr.aria-disabled]': 'disabled.toString()',
        '[attr.aria-multiselectable]': 'multiple',
        '[attr.aria-orientation]': 'ariaOrientation',
        '[class.mat-mdc-chip-list-disabled]': 'disabled',
        '[class.mat-mdc-chip-list-required]': 'required',
        '(focus)': 'focus()',
        '(blur)': '_blur()',
        '(keydown)': '_keydown($event)'
      },
      providers: [MAT_CHIP_LISTBOX_CONTROL_VALUE_ACCESSOR],
      encapsulation: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ViewEncapsulation.None,
      changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ChangeDetectionStrategy.OnPush,
      styles: [".mdc-evolution-chip-set{display:flex}.mdc-evolution-chip-set:focus{outline:none}.mdc-evolution-chip-set__chips{display:flex;flex-flow:wrap;min-width:0}.mdc-evolution-chip-set--overflow .mdc-evolution-chip-set__chips{flex-flow:nowrap}.mdc-evolution-chip-set .mdc-evolution-chip-set__chips{margin-left:-8px;margin-right:0}[dir=rtl] .mdc-evolution-chip-set .mdc-evolution-chip-set__chips,.mdc-evolution-chip-set .mdc-evolution-chip-set__chips[dir=rtl]{margin-left:0;margin-right:-8px}.mdc-evolution-chip-set .mdc-evolution-chip{margin-left:8px;margin-right:0}[dir=rtl] .mdc-evolution-chip-set .mdc-evolution-chip,.mdc-evolution-chip-set .mdc-evolution-chip[dir=rtl]{margin-left:0;margin-right:8px}.mdc-evolution-chip-set .mdc-evolution-chip{margin-top:4px;margin-bottom:4px}.mat-mdc-chip-set .mdc-evolution-chip-set__chips{min-width:100%}.mat-mdc-chip-set-stacked{flex-direction:column;align-items:flex-start}.mat-mdc-chip-set-stacked .mat-mdc-chip{width:100%}.mat-mdc-chip-set-stacked .mdc-evolution-chip__graphic{flex-grow:0}.mat-mdc-chip-set-stacked .mdc-evolution-chip__action--primary{flex-basis:100%;justify-content:start}input.mat-mdc-chip-input{flex:1 0 150px;margin-left:8px}[dir=rtl] input.mat-mdc-chip-input{margin-left:0;margin-right:8px}"]
    }]
  }], null, {
    multiple: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    ariaOrientation: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input,
      args: ['aria-orientation']
    }],
    selectable: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    compareWith: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    required: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    hideSingleSelectionIndicator: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    value: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    change: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Output
    }],
    _chips: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ContentChildren,
      args: [MatChipOption, {
        // We need to use `descendants: true`, because Ivy will no longer match
        // indirect descendants if it's left as false.
        descendants: true
      }]
    }]
  });
})();

/** Change event object that is emitted when the chip grid value has changed. */
class MatChipGridChange {
  constructor( /** Chip grid that emitted the event. */
  source, /** Value of the chip grid when the event was emitted. */
  value) {
    this.source = source;
    this.value = value;
  }
}
/**
 * Boilerplate for applying mixins to MatChipGrid.
 * @docs-private
 */
class MatChipGridBase extends MatChipSet {
  constructor(elementRef, changeDetectorRef, dir, _defaultErrorStateMatcher, _parentForm, _parentFormGroup,
  /**
   * Form control bound to the component.
   * Implemented as part of `MatFormFieldControl`.
   * @docs-private
   */
  ngControl) {
    super(elementRef, changeDetectorRef, dir);
    this._defaultErrorStateMatcher = _defaultErrorStateMatcher;
    this._parentForm = _parentForm;
    this._parentFormGroup = _parentFormGroup;
    this.ngControl = ngControl;
    /**
     * Emits whenever the component state changes and should cause the parent
     * form-field to update. Implemented as part of `MatFormFieldControl`.
     * @docs-private
     */
    this.stateChanges = new rxjs__WEBPACK_IMPORTED_MODULE_4__.Subject();
  }
}
const _MatChipGridMixinBase = (0,_angular_material_core__WEBPACK_IMPORTED_MODULE_2__.mixinErrorState)(MatChipGridBase);
/**
 * An extension of the MatChipSet component used with MatChipRow chips and
 * the matChipInputFor directive.
 */
class MatChipGrid extends _MatChipGridMixinBase {
  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  get disabled() {
    return this.ngControl ? !!this.ngControl.disabled : this._disabled;
  }
  set disabled(value) {
    this._disabled = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_3__.coerceBooleanProperty)(value);
    this._syncChipsState();
  }
  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  get id() {
    return this._chipInput.id;
  }
  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  get empty() {
    return (!this._chipInput || this._chipInput.empty) && (!this._chips || this._chips.length === 0);
  }
  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  get placeholder() {
    return this._chipInput ? this._chipInput.placeholder : this._placeholder;
  }
  set placeholder(value) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  /** Whether any chips or the matChipInput inside of this chip-grid has focus. */
  get focused() {
    return this._chipInput.focused || this._hasFocusedChip();
  }
  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  get required() {
    return this._required ?? this.ngControl?.control?.hasValidator(_angular_forms__WEBPACK_IMPORTED_MODULE_13__.Validators.required) ?? false;
  }
  set required(value) {
    this._required = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_3__.coerceBooleanProperty)(value);
    this.stateChanges.next();
  }
  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  get shouldLabelFloat() {
    return !this.empty || this.focused;
  }
  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  get value() {
    return this._value;
  }
  set value(value) {
    this._value = value;
  }
  /** Combined stream of all of the child chips' blur events. */
  get chipBlurChanges() {
    return this._getChipStream(chip => chip._onBlur);
  }
  constructor(elementRef, changeDetectorRef, dir, parentForm, parentFormGroup, defaultErrorStateMatcher, ngControl) {
    super(elementRef, changeDetectorRef, dir, defaultErrorStateMatcher, parentForm, parentFormGroup, ngControl);
    /**
     * Implemented as part of MatFormFieldControl.
     * @docs-private
     */
    this.controlType = 'mat-chip-grid';
    this._defaultRole = 'grid';
    /**
     * List of element ids to propagate to the chipInput's aria-describedby attribute.
     */
    this._ariaDescribedbyIds = [];
    /**
     * Function when touched. Set as part of ControlValueAccessor implementation.
     * @docs-private
     */
    this._onTouched = () => {};
    /**
     * Function when changed. Set as part of ControlValueAccessor implementation.
     * @docs-private
     */
    this._onChange = () => {};
    this._value = [];
    /** Emits when the chip grid value has been changed by the user. */
    this.change = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    /**
     * Emits whenever the raw value of the chip-grid changes. This is here primarily
     * to facilitate the two-way binding for the `value` input.
     * @docs-private
     */
    this.valueChange = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    this._chips = undefined;
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }
  ngAfterContentInit() {
    this.chipBlurChanges.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.takeUntil)(this._destroyed)).subscribe(() => {
      this._blur();
      this.stateChanges.next();
    });
    (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.merge)(this.chipFocusChanges, this._chips.changes).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.takeUntil)(this._destroyed)).subscribe(() => this.stateChanges.next());
  }
  ngAfterViewInit() {
    super.ngAfterViewInit();
    if (!this._chipInput && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throw Error('mat-chip-grid must be used in combination with matChipInputFor.');
    }
  }
  ngDoCheck() {
    if (this.ngControl) {
      // We need to re-evaluate this on every change detection cycle, because there are some
      // error triggers that we can't subscribe to (e.g. parent form submissions). This means
      // that whatever logic is in here has to be super lean or we risk destroying the performance.
      this.updateErrorState();
    }
  }
  ngOnDestroy() {
    super.ngOnDestroy();
    this.stateChanges.complete();
  }
  /** Associates an HTML input element with this chip grid. */
  registerInput(inputElement) {
    this._chipInput = inputElement;
    this._chipInput.setDescribedByIds(this._ariaDescribedbyIds);
  }
  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  onContainerClick(event) {
    if (!this.disabled && !this._originatesFromChip(event)) {
      this.focus();
    }
  }
  /**
   * Focuses the first chip in this chip grid, or the associated input when there
   * are no eligible chips.
   */
  focus() {
    if (this.disabled || this._chipInput.focused) {
      return;
    }
    if (!this._chips.length || this._chips.first.disabled) {
      // Delay until the next tick, because this can cause a "changed after checked"
      // error if the input does something on focus (e.g. opens an autocomplete).
      Promise.resolve().then(() => this._chipInput.focus());
    } else if (this._chips.length) {
      this._keyManager.setFirstItemActive();
    }
    this.stateChanges.next();
  }
  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  setDescribedByIds(ids) {
    // We must keep this up to date to handle the case where ids are set
    // before the chip input is registered.
    this._ariaDescribedbyIds = ids;
    this._chipInput?.setDescribedByIds(ids);
  }
  /**
   * Implemented as part of ControlValueAccessor.
   * @docs-private
   */
  writeValue(value) {
    // The user is responsible for creating the child chips, so we just store the value.
    this._value = value;
  }
  /**
   * Implemented as part of ControlValueAccessor.
   * @docs-private
   */
  registerOnChange(fn) {
    this._onChange = fn;
  }
  /**
   * Implemented as part of ControlValueAccessor.
   * @docs-private
   */
  registerOnTouched(fn) {
    this._onTouched = fn;
  }
  /**
   * Implemented as part of ControlValueAccessor.
   * @docs-private
   */
  setDisabledState(isDisabled) {
    this.disabled = isDisabled;
    this.stateChanges.next();
  }
  /** When blurred, mark the field as touched when focus moved outside the chip grid. */
  _blur() {
    if (!this.disabled) {
      // Check whether the focus moved to chip input.
      // If the focus is not moved to chip input, mark the field as touched. If the focus moved
      // to chip input, do nothing.
      // Timeout is needed to wait for the focus() event trigger on chip input.
      setTimeout(() => {
        if (!this.focused) {
          this._propagateChanges();
          this._markAsTouched();
        }
      });
    }
  }
  /**
   * Removes the `tabindex` from the chip grid and resets it back afterwards, allowing the
   * user to tab out of it. This prevents the grid from capturing focus and redirecting
   * it back to the first chip, creating a focus trap, if it user tries to tab away.
   */
  _allowFocusEscape() {
    if (!this._chipInput.focused) {
      super._allowFocusEscape();
    }
  }
  /** Handles custom keyboard events. */
  _handleKeydown(event) {
    if (event.keyCode === _angular_cdk_keycodes__WEBPACK_IMPORTED_MODULE_1__.TAB) {
      if (this._chipInput.focused && (0,_angular_cdk_keycodes__WEBPACK_IMPORTED_MODULE_1__.hasModifierKey)(event, 'shiftKey') && this._chips.length && !this._chips.last.disabled) {
        event.preventDefault();
        if (this._keyManager.activeItem) {
          this._keyManager.setActiveItem(this._keyManager.activeItem);
        } else {
          this._focusLastChip();
        }
      } else {
        // Use the super method here since it doesn't check for the input
        // focused state. This allows focus to escape if there's only one
        // disabled chip left in the list.
        super._allowFocusEscape();
      }
    } else if (!this._chipInput.focused) {
      super._handleKeydown(event);
    }
    this.stateChanges.next();
  }
  _focusLastChip() {
    if (this._chips.length) {
      this._chips.last.focus();
    }
  }
  /** Emits change event to set the model value. */
  _propagateChanges() {
    const valueToEmit = this._chips.length ? this._chips.toArray().map(chip => chip.value) : [];
    this._value = valueToEmit;
    this.change.emit(new MatChipGridChange(this, valueToEmit));
    this.valueChange.emit(valueToEmit);
    this._onChange(valueToEmit);
    this._changeDetectorRef.markForCheck();
  }
  /** Mark the field as touched */
  _markAsTouched() {
    this._onTouched();
    this._changeDetectorRef.markForCheck();
    this.stateChanges.next();
  }
  static #_ = this.ɵfac = function MatChipGrid_Factory(t) {
    return new (t || MatChipGrid)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.ChangeDetectorRef), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_cdk_bidi__WEBPACK_IMPORTED_MODULE_12__.Directionality, 8), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_13__.NgForm, 8), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_13__.FormGroupDirective, 8), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_material_core__WEBPACK_IMPORTED_MODULE_2__.ErrorStateMatcher), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_13__.NgControl, 10));
  };
  static #_2 = this.ɵcmp = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
    type: MatChipGrid,
    selectors: [["mat-chip-grid"]],
    contentQueries: function MatChipGrid_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵcontentQuery"](dirIndex, MatChipRow, 5);
      }
      if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx._chips = _t);
      }
    },
    hostAttrs: [1, "mat-mdc-chip-set", "mat-mdc-chip-grid", "mdc-evolution-chip-set"],
    hostVars: 10,
    hostBindings: function MatChipGrid_HostBindings(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("focus", function MatChipGrid_focus_HostBindingHandler() {
          return ctx.focus();
        })("blur", function MatChipGrid_blur_HostBindingHandler() {
          return ctx._blur();
        });
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵhostProperty"]("tabIndex", ctx._chips && ctx._chips.length === 0 ? -1 : ctx.tabIndex);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵattribute"]("role", ctx.role)("aria-disabled", ctx.disabled.toString())("aria-invalid", ctx.errorState);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("mat-mdc-chip-list-disabled", ctx.disabled)("mat-mdc-chip-list-invalid", ctx.errorState)("mat-mdc-chip-list-required", ctx.required);
      }
    },
    inputs: {
      tabIndex: "tabIndex",
      disabled: "disabled",
      placeholder: "placeholder",
      required: "required",
      value: "value",
      errorStateMatcher: "errorStateMatcher"
    },
    outputs: {
      change: "change",
      valueChange: "valueChange"
    },
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵProvidersFeature"]([{
      provide: _angular_material_form_field__WEBPACK_IMPORTED_MODULE_14__.MatFormFieldControl,
      useExisting: MatChipGrid
    }]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵInheritDefinitionFeature"]],
    ngContentSelectors: _c5,
    decls: 2,
    vars: 0,
    consts: [["role", "presentation", 1, "mdc-evolution-chip-set__chips"]],
    template: function MatChipGrid_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojectionDef"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojection"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }
    },
    styles: [_c6],
    encapsulation: 2,
    changeDetection: 0
  });
}
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](MatChipGrid, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Component,
    args: [{
      selector: 'mat-chip-grid',
      template: `
    <div class="mdc-evolution-chip-set__chips" role="presentation">
      <ng-content></ng-content>
    </div>
  `,
      inputs: ['tabIndex'],
      host: {
        'class': 'mat-mdc-chip-set mat-mdc-chip-grid mdc-evolution-chip-set',
        '[attr.role]': 'role',
        '[tabIndex]': '_chips && _chips.length === 0 ? -1 : tabIndex',
        '[attr.aria-disabled]': 'disabled.toString()',
        '[attr.aria-invalid]': 'errorState',
        '[class.mat-mdc-chip-list-disabled]': 'disabled',
        '[class.mat-mdc-chip-list-invalid]': 'errorState',
        '[class.mat-mdc-chip-list-required]': 'required',
        '(focus)': 'focus()',
        '(blur)': '_blur()'
      },
      providers: [{
        provide: _angular_material_form_field__WEBPACK_IMPORTED_MODULE_14__.MatFormFieldControl,
        useExisting: MatChipGrid
      }],
      encapsulation: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ViewEncapsulation.None,
      changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ChangeDetectionStrategy.OnPush,
      styles: [".mdc-evolution-chip-set{display:flex}.mdc-evolution-chip-set:focus{outline:none}.mdc-evolution-chip-set__chips{display:flex;flex-flow:wrap;min-width:0}.mdc-evolution-chip-set--overflow .mdc-evolution-chip-set__chips{flex-flow:nowrap}.mdc-evolution-chip-set .mdc-evolution-chip-set__chips{margin-left:-8px;margin-right:0}[dir=rtl] .mdc-evolution-chip-set .mdc-evolution-chip-set__chips,.mdc-evolution-chip-set .mdc-evolution-chip-set__chips[dir=rtl]{margin-left:0;margin-right:-8px}.mdc-evolution-chip-set .mdc-evolution-chip{margin-left:8px;margin-right:0}[dir=rtl] .mdc-evolution-chip-set .mdc-evolution-chip,.mdc-evolution-chip-set .mdc-evolution-chip[dir=rtl]{margin-left:0;margin-right:8px}.mdc-evolution-chip-set .mdc-evolution-chip{margin-top:4px;margin-bottom:4px}.mat-mdc-chip-set .mdc-evolution-chip-set__chips{min-width:100%}.mat-mdc-chip-set-stacked{flex-direction:column;align-items:flex-start}.mat-mdc-chip-set-stacked .mat-mdc-chip{width:100%}.mat-mdc-chip-set-stacked .mdc-evolution-chip__graphic{flex-grow:0}.mat-mdc-chip-set-stacked .mdc-evolution-chip__action--primary{flex-basis:100%;justify-content:start}input.mat-mdc-chip-input{flex:1 0 150px;margin-left:8px}[dir=rtl] input.mat-mdc-chip-input{margin-left:0;margin-right:8px}"]
    }]
  }], () => [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef
  }, {
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ChangeDetectorRef
  }, {
    type: _angular_cdk_bidi__WEBPACK_IMPORTED_MODULE_12__.Directionality,
    decorators: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
    }]
  }, {
    type: _angular_forms__WEBPACK_IMPORTED_MODULE_13__.NgForm,
    decorators: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
    }]
  }, {
    type: _angular_forms__WEBPACK_IMPORTED_MODULE_13__.FormGroupDirective,
    decorators: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
    }]
  }, {
    type: _angular_material_core__WEBPACK_IMPORTED_MODULE_2__.ErrorStateMatcher
  }, {
    type: _angular_forms__WEBPACK_IMPORTED_MODULE_13__.NgControl,
    decorators: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Self
    }]
  }], {
    disabled: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    placeholder: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    required: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    value: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    errorStateMatcher: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    change: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Output
    }],
    valueChange: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Output
    }],
    _chips: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ContentChildren,
      args: [MatChipRow, {
        // We need to use `descendants: true`, because Ivy will no longer match
        // indirect descendants if it's left as false.
        descendants: true
      }]
    }]
  });
})();

// Increasing integer for generating unique ids.
let nextUniqueId = 0;
/**
 * Directive that adds chip-specific behaviors to an input element inside `<mat-form-field>`.
 * May be placed inside or outside of a `<mat-chip-grid>`.
 */
class MatChipInput {
  /** Register input for chip list */
  set chipGrid(value) {
    if (value) {
      this._chipGrid = value;
      this._chipGrid.registerInput(this);
    }
  }
  /**
   * Whether or not the chipEnd event will be emitted when the input is blurred.
   */
  get addOnBlur() {
    return this._addOnBlur;
  }
  set addOnBlur(value) {
    this._addOnBlur = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_3__.coerceBooleanProperty)(value);
  }
  /** Whether the input is disabled. */
  get disabled() {
    return this._disabled || this._chipGrid && this._chipGrid.disabled;
  }
  set disabled(value) {
    this._disabled = (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_3__.coerceBooleanProperty)(value);
  }
  /** Whether the input is empty. */
  get empty() {
    return !this.inputElement.value;
  }
  constructor(_elementRef, defaultOptions, formField) {
    this._elementRef = _elementRef;
    /** Whether the control is focused. */
    this.focused = false;
    this._addOnBlur = false;
    /** Emitted when a chip is to be added. */
    this.chipEnd = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    /** The input's placeholder text. */
    this.placeholder = '';
    /** Unique id for the input. */
    this.id = `mat-mdc-chip-list-input-${nextUniqueId++}`;
    this._disabled = false;
    this.inputElement = this._elementRef.nativeElement;
    this.separatorKeyCodes = defaultOptions.separatorKeyCodes;
    if (formField) {
      this.inputElement.classList.add('mat-mdc-form-field-input-control');
    }
  }
  ngOnChanges() {
    this._chipGrid.stateChanges.next();
  }
  ngOnDestroy() {
    this.chipEnd.complete();
  }
  ngAfterContentInit() {
    this._focusLastChipOnBackspace = this.empty;
  }
  /** Utility method to make host definition/tests more clear. */
  _keydown(event) {
    if (event) {
      // To prevent the user from accidentally deleting chips when pressing BACKSPACE continuously,
      // We focus the last chip on backspace only after the user has released the backspace button,
      // And the input is empty (see behaviour in _keyup)
      if (event.keyCode === _angular_cdk_keycodes__WEBPACK_IMPORTED_MODULE_1__.BACKSPACE && this._focusLastChipOnBackspace) {
        this._chipGrid._focusLastChip();
        event.preventDefault();
        return;
      } else {
        this._focusLastChipOnBackspace = false;
      }
    }
    this._emitChipEnd(event);
  }
  /**
   * Pass events to the keyboard manager. Available here for tests.
   */
  _keyup(event) {
    // Allow user to move focus to chips next time he presses backspace
    if (!this._focusLastChipOnBackspace && event.keyCode === _angular_cdk_keycodes__WEBPACK_IMPORTED_MODULE_1__.BACKSPACE && this.empty) {
      this._focusLastChipOnBackspace = true;
      event.preventDefault();
    }
  }
  /** Checks to see if the blur should emit the (chipEnd) event. */
  _blur() {
    if (this.addOnBlur) {
      this._emitChipEnd();
    }
    this.focused = false;
    // Blur the chip list if it is not focused
    if (!this._chipGrid.focused) {
      this._chipGrid._blur();
    }
    this._chipGrid.stateChanges.next();
  }
  _focus() {
    this.focused = true;
    this._focusLastChipOnBackspace = this.empty;
    this._chipGrid.stateChanges.next();
  }
  /** Checks to see if the (chipEnd) event needs to be emitted. */
  _emitChipEnd(event) {
    if (!event || this._isSeparatorKey(event)) {
      this.chipEnd.emit({
        input: this.inputElement,
        value: this.inputElement.value,
        chipInput: this
      });
      event?.preventDefault();
    }
  }
  _onInput() {
    // Let chip list know whenever the value changes.
    this._chipGrid.stateChanges.next();
  }
  /** Focuses the input. */
  focus() {
    this.inputElement.focus();
  }
  /** Clears the input */
  clear() {
    this.inputElement.value = '';
    this._focusLastChipOnBackspace = true;
  }
  setDescribedByIds(ids) {
    const element = this._elementRef.nativeElement;
    // Set the value directly in the DOM since this binding
    // is prone to "changed after checked" errors.
    if (ids.length) {
      element.setAttribute('aria-describedby', ids.join(' '));
    } else {
      element.removeAttribute('aria-describedby');
    }
  }
  /** Checks whether a keycode is one of the configured separators. */
  _isSeparatorKey(event) {
    return !(0,_angular_cdk_keycodes__WEBPACK_IMPORTED_MODULE_1__.hasModifierKey)(event) && new Set(this.separatorKeyCodes).has(event.keyCode);
  }
  static #_ = this.ɵfac = function MatChipInput_Factory(t) {
    return new (t || MatChipInput)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](MAT_CHIPS_DEFAULT_OPTIONS), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_material_form_field__WEBPACK_IMPORTED_MODULE_14__.MAT_FORM_FIELD, 8));
  };
  static #_2 = this.ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineDirective"]({
    type: MatChipInput,
    selectors: [["input", "matChipInputFor", ""]],
    hostAttrs: [1, "mat-mdc-chip-input", "mat-mdc-input-element", "mdc-text-field__input", "mat-input-element"],
    hostVars: 6,
    hostBindings: function MatChipInput_HostBindings(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("keydown", function MatChipInput_keydown_HostBindingHandler($event) {
          return ctx._keydown($event);
        })("keyup", function MatChipInput_keyup_HostBindingHandler($event) {
          return ctx._keyup($event);
        })("blur", function MatChipInput_blur_HostBindingHandler() {
          return ctx._blur();
        })("focus", function MatChipInput_focus_HostBindingHandler() {
          return ctx._focus();
        })("input", function MatChipInput_input_HostBindingHandler() {
          return ctx._onInput();
        });
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵhostProperty"]("id", ctx.id);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵattribute"]("disabled", ctx.disabled || null)("placeholder", ctx.placeholder || null)("aria-invalid", ctx._chipGrid && ctx._chipGrid.ngControl ? ctx._chipGrid.ngControl.invalid : null)("aria-required", ctx._chipGrid && ctx._chipGrid.required || null)("required", ctx._chipGrid && ctx._chipGrid.required || null);
      }
    },
    inputs: {
      chipGrid: ["matChipInputFor", "chipGrid"],
      addOnBlur: ["matChipInputAddOnBlur", "addOnBlur"],
      separatorKeyCodes: ["matChipInputSeparatorKeyCodes", "separatorKeyCodes"],
      placeholder: "placeholder",
      id: "id",
      disabled: "disabled"
    },
    outputs: {
      chipEnd: "matChipInputTokenEnd"
    },
    exportAs: ["matChipInput", "matChipInputFor"],
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵNgOnChangesFeature"]]
  });
}
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](MatChipInput, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
    args: [{
      selector: 'input[matChipInputFor]',
      exportAs: 'matChipInput, matChipInputFor',
      host: {
        // TODO: eventually we should remove `mat-input-element` from here since it comes from the
        // non-MDC version of the input. It's currently being kept for backwards compatibility, because
        // the MDC chips were landed initially with it.
        'class': 'mat-mdc-chip-input mat-mdc-input-element mdc-text-field__input mat-input-element',
        '(keydown)': '_keydown($event)',
        '(keyup)': '_keyup($event)',
        '(blur)': '_blur()',
        '(focus)': '_focus()',
        '(input)': '_onInput()',
        '[id]': 'id',
        '[attr.disabled]': 'disabled || null',
        '[attr.placeholder]': 'placeholder || null',
        '[attr.aria-invalid]': '_chipGrid && _chipGrid.ngControl ? _chipGrid.ngControl.invalid : null',
        '[attr.aria-required]': '_chipGrid && _chipGrid.required || null',
        '[attr.required]': '_chipGrid && _chipGrid.required || null'
      }
    }]
  }], () => [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef
  }, {
    type: undefined,
    decorators: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
      args: [MAT_CHIPS_DEFAULT_OPTIONS]
    }]
  }, {
    type: _angular_material_form_field__WEBPACK_IMPORTED_MODULE_14__.MatFormField,
    decorators: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
      args: [_angular_material_form_field__WEBPACK_IMPORTED_MODULE_14__.MAT_FORM_FIELD]
    }]
  }], {
    chipGrid: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input,
      args: ['matChipInputFor']
    }],
    addOnBlur: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input,
      args: ['matChipInputAddOnBlur']
    }],
    separatorKeyCodes: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input,
      args: ['matChipInputSeparatorKeyCodes']
    }],
    chipEnd: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Output,
      args: ['matChipInputTokenEnd']
    }],
    placeholder: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    id: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    disabled: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }]
  });
})();
const CHIP_DECLARATIONS = [MatChip, MatChipAvatar, MatChipEditInput, MatChipGrid, MatChipInput, MatChipListbox, MatChipOption, MatChipRemove, MatChipRow, MatChipSet, MatChipTrailingIcon];
class MatChipsModule {
  static #_ = this.ɵfac = function MatChipsModule_Factory(t) {
    return new (t || MatChipsModule)();
  };
  static #_2 = this.ɵmod = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({
    type: MatChipsModule
  });
  static #_3 = this.ɵinj = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({
    providers: [_angular_material_core__WEBPACK_IMPORTED_MODULE_2__.ErrorStateMatcher, {
      provide: MAT_CHIPS_DEFAULT_OPTIONS,
      useValue: {
        separatorKeyCodes: [_angular_cdk_keycodes__WEBPACK_IMPORTED_MODULE_1__.ENTER]
      }
    }],
    imports: [_angular_material_core__WEBPACK_IMPORTED_MODULE_2__.MatCommonModule, _angular_material_core__WEBPACK_IMPORTED_MODULE_2__.MatRippleModule, _angular_material_core__WEBPACK_IMPORTED_MODULE_2__.MatCommonModule]
  });
}
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](MatChipsModule, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.NgModule,
    args: [{
      imports: [_angular_material_core__WEBPACK_IMPORTED_MODULE_2__.MatCommonModule, _angular_material_core__WEBPACK_IMPORTED_MODULE_2__.MatRippleModule],
      exports: [_angular_material_core__WEBPACK_IMPORTED_MODULE_2__.MatCommonModule, CHIP_DECLARATIONS],
      declarations: [MatChipAction, CHIP_DECLARATIONS],
      providers: [_angular_material_core__WEBPACK_IMPORTED_MODULE_2__.ErrorStateMatcher, {
        provide: MAT_CHIPS_DEFAULT_OPTIONS,
        useValue: {
          separatorKeyCodes: [_angular_cdk_keycodes__WEBPACK_IMPORTED_MODULE_1__.ENTER]
        }
      }]
    }]
  }], null, null);
})();

/**
 * Generated bundle index. Do not edit.
 */



/***/ })

}]);
//# sourceMappingURL=src_app_pages_configuracion_catalogos_agencias_agencias_component_ts.js.map