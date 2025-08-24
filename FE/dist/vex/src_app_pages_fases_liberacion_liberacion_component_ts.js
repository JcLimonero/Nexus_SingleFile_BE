"use strict";
(self["webpackChunkvex"] = self["webpackChunkvex"] || []).push([["src_app_pages_fases_liberacion_liberacion_component_ts"],{

/***/ 8469:
/*!****************************************************************!*\
  !*** ./src/app/pages/fases/liberacion/liberacion.component.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LiberacionComponent: () => (/* binding */ LiberacionComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 6575);
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/card */ 8497);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/icon */ 6515);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/button */ 895);
/* harmony import */ var _vex_components_vex_page_layout_vex_page_layout_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vex/components/vex-page-layout/vex-page-layout.component */ 306);
/* harmony import */ var _vex_components_vex_page_layout_vex_page_layout_header_directive__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @vex/components/vex-page-layout/vex-page-layout-header.directive */ 2369);
/* harmony import */ var _vex_components_vex_page_layout_vex_page_layout_content_directive__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @vex/components/vex-page-layout/vex-page-layout-content.directive */ 5292);
/* harmony import */ var _vex_components_vex_breadcrumbs_vex_breadcrumbs_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @vex/components/vex-breadcrumbs/vex-breadcrumbs.component */ 9806);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 1699);












const _c0 = () => ["Fases", "Liberaci\u00F3n"];
class LiberacionComponent {
  constructor() {}
  static #_ = this.ɵfac = function LiberacionComponent_Factory(t) {
    return new (t || LiberacionComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({
    type: LiberacionComponent,
    selectors: [["app-liberacion"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵStandaloneFeature"]],
    decls: 66,
    vars: 2,
    consts: [[1, "pb-16", "flex", "flex-col", "items-start", "justify-center"], [3, "crumbs"], [1, "title", "mt-6", "mb-4"], [1, "body-2", "max-w-2xl"], [1, "-mt-6"], [1, "card", "overflow-hidden"], [1, "bg-app-bar", "px-6", "h-16", "border-b", "sticky", "top-0", "flex", "items-center"], [1, "title", "my-0", "ltr:pr-4", "rtl:pl-4", "ltr:mr-4", "rtl:ml-4", "ltr:border-r", "rtl:border-l", "flex", "items-center", "gap-4", "flex-none"], ["svgIcon", "mat:check_circle"], [1, "px-6", "py-6"], [1, "mb-4"], [1, "list-disc", "list-inside", "mt-4", "space-y-2"], ["mat-raised-button", "", "color", "primary"], ["mat-button", ""], [1, "mt-4", "p-4", "bg-green-50", "rounded"], [1, "flex", "items-center", "gap-2"], [1, "text-green-600"], [1, "font-medium"], ["mat-raised-button", "", "color", "accent"]],
    template: function LiberacionComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "vex-page-layout")(1, "vex-page-layout-header", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](2, "vex-breadcrumbs", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "h1", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](4, "Liberaci\u00F3n");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](5, "p", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6, " Gesti\u00F3n de la fase de liberaci\u00F3n del expediente \u00FAnico. Aqu\u00ED se finaliza el proceso y se autoriza la liberaci\u00F3n de mercanc\u00EDas o servicios. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](7, "vex-page-layout-content", 4)(8, "div", 5)(9, "div", 6)(10, "h2", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](11, "mat-icon", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](12, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](13, "Fase de Liberaci\u00F3n");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](14, "div", 9)(15, "mat-card", 10)(16, "mat-card-header")(17, "mat-card-title");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](18, "Autorizaci\u00F3n de Liberaci\u00F3n");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](19, "mat-card-subtitle");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](20, "Finalizaci\u00F3n del proceso del expediente");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](21, "mat-card-content")(22, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](23, "En esta fase final se autoriza la liberaci\u00F3n una vez completados todos los requisitos y pagos correspondientes.");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](24, "ul", 11)(25, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](26, "Verificaci\u00F3n de documentos completos");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](27, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](28, "Confirmaci\u00F3n de pagos realizados");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](29, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](30, "Validaci\u00F3n de cumplimiento normativo");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](31, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](32, "Autorizaci\u00F3n de liberaci\u00F3n final");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](33, "mat-card-actions")(34, "button", 12)(35, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](36, "verified");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](37, " Autorizar Liberaci\u00F3n ");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](38, "button", 13)(39, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](40, "checklist");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](41, " Verificar Requisitos ");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](42, "mat-card")(43, "mat-card-header")(44, "mat-card-title");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](45, "Estado de Liberaci\u00F3n");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](46, "mat-card-subtitle");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](47, "Seguimiento del proceso final");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](48, "mat-card-content")(49, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](50, "Aqu\u00ED se muestra el estado actual del proceso de liberaci\u00F3n.");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](51, "div", 14)(52, "div", 15)(53, "mat-icon", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](54, "check_circle");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](55, "span", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](56, "Estado: Pendiente de liberaci\u00F3n");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](57, "mat-card-actions")(58, "button", 18)(59, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](60, "assignment_turned_in");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](61, " Completar Proceso ");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](62, "button", 13)(63, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](64, "history");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](65, " Ver Historial ");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()()()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("crumbs", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction0"](1, _c0));
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.CommonModule, _angular_material_card__WEBPACK_IMPORTED_MODULE_6__.MatCardModule, _angular_material_card__WEBPACK_IMPORTED_MODULE_6__.MatCard, _angular_material_card__WEBPACK_IMPORTED_MODULE_6__.MatCardActions, _angular_material_card__WEBPACK_IMPORTED_MODULE_6__.MatCardContent, _angular_material_card__WEBPACK_IMPORTED_MODULE_6__.MatCardHeader, _angular_material_card__WEBPACK_IMPORTED_MODULE_6__.MatCardSubtitle, _angular_material_card__WEBPACK_IMPORTED_MODULE_6__.MatCardTitle, _angular_material_icon__WEBPACK_IMPORTED_MODULE_7__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_7__.MatIcon, _angular_material_button__WEBPACK_IMPORTED_MODULE_8__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_8__.MatButton, _vex_components_vex_page_layout_vex_page_layout_component__WEBPACK_IMPORTED_MODULE_0__.VexPageLayoutComponent, _vex_components_vex_page_layout_vex_page_layout_header_directive__WEBPACK_IMPORTED_MODULE_1__.VexPageLayoutHeaderDirective, _vex_components_vex_page_layout_vex_page_layout_content_directive__WEBPACK_IMPORTED_MODULE_2__.VexPageLayoutContentDirective, _vex_components_vex_breadcrumbs_vex_breadcrumbs_component__WEBPACK_IMPORTED_MODULE_3__.VexBreadcrumbsComponent],
    styles: [".title[_ngcontent-%COMP%] {\n      font-size: 2rem;\n      font-weight: 600;\n      line-height: 1.2;\n    }\n    \n    .body-2[_ngcontent-%COMP%] {\n      font-size: 0.875rem;\n      line-height: 1.5;\n      color: rgb(var(--vex-foreground-secondary-text-rgb));\n    }\n  \n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvZmFzZXMvbGliZXJhY2lvbi9saWJlcmFjaW9uLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0lBQ0k7TUFDRSxlQUFlO01BQ2YsZ0JBQWdCO01BQ2hCLGdCQUFnQjtJQUNsQjs7SUFFQTtNQUNFLG1CQUFtQjtNQUNuQixnQkFBZ0I7TUFDaEIsb0RBQW9EO0lBQ3REIiwic291cmNlc0NvbnRlbnQiOlsiXG4gICAgLnRpdGxlIHtcbiAgICAgIGZvbnQtc2l6ZTogMnJlbTtcbiAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICBsaW5lLWhlaWdodDogMS4yO1xuICAgIH1cbiAgICBcbiAgICAuYm9keS0yIHtcbiAgICAgIGZvbnQtc2l6ZTogMC44NzVyZW07XG4gICAgICBsaW5lLWhlaWdodDogMS41O1xuICAgICAgY29sb3I6IHJnYih2YXIoLS12ZXgtZm9yZWdyb3VuZC1zZWNvbmRhcnktdGV4dC1yZ2IpKTtcbiAgICB9XG4gICJdLCJzb3VyY2VSb290IjoiIn0= */"]
  });
}

/***/ })

}]);
//# sourceMappingURL=src_app_pages_fases_liberacion_liberacion_component_ts.js.map