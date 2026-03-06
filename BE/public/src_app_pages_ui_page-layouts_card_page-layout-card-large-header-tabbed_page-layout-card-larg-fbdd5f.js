"use strict";
(self["webpackChunkvex"] = self["webpackChunkvex"] || []).push([["src_app_pages_ui_page-layouts_card_page-layout-card-large-header-tabbed_page-layout-card-larg-fbdd5f"],{

/***/ 27788:
/*!****************************************************************************************!*\
  !*** ./src/@vex/components/vex-breadcrumbs/vex-breadcrumb/vex-breadcrumb.component.ts ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VexBreadcrumbComponent: () => (/* binding */ VexBreadcrumbComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 61699);

const _c0 = ["*"];
class VexBreadcrumbComponent {
  static #_ = this.ɵfac = function VexBreadcrumbComponent_Factory(t) {
    return new (t || VexBreadcrumbComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
    type: VexBreadcrumbComponent,
    selectors: [["vex-breadcrumb"]],
    hostAttrs: [1, "vex-breadcrumb", "body-2", "text-hint", "leading-none", "hover:text-primary-600", "no-underline", "transition", "duration-400", "ease-out-swift"],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵStandaloneFeature"]],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function VexBreadcrumbComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojectionDef"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojection"](0);
      }
    },
    encapsulation: 2
  });
}

/***/ }),

/***/ 19806:
/*!**************************************************************************!*\
  !*** ./src/@vex/components/vex-breadcrumbs/vex-breadcrumbs.component.ts ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VexBreadcrumbsComponent: () => (/* binding */ VexBreadcrumbsComponent)
/* harmony export */ });
/* harmony import */ var _utils_track_by__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/track-by */ 47637);
/* harmony import */ var _vex_breadcrumb_vex_breadcrumb_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./vex-breadcrumb/vex-breadcrumb.component */ 27788);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 27947);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 61699);







const _c0 = () => [];
function VexBreadcrumbsComponent_ng_container_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "vex-breadcrumb")(3, "a", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const crumb_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](2, _c0));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](crumb_r1);
  }
}
const _c1 = () => ["/"];
class VexBreadcrumbsComponent {
  constructor() {
    this.crumbs = [];
    this.trackByValue = _utils_track_by__WEBPACK_IMPORTED_MODULE_0__.trackByValue;
  }
  static #_ = this.ɵfac = function VexBreadcrumbsComponent_Factory(t) {
    return new (t || VexBreadcrumbsComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
    type: VexBreadcrumbsComponent,
    selectors: [["vex-breadcrumbs"]],
    inputs: {
      crumbs: "crumbs"
    },
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵStandaloneFeature"]],
    decls: 5,
    vars: 4,
    consts: [[1, "flex", "items-center", "gap-2"], [3, "routerLink"], ["svgIcon", "mat:home", 1, "icon-sm"], [4, "ngFor", "ngForOf", "ngForTrackBy"], [1, "w-1", "h-1", "bg-gray-600", "rounded-full"]],
    template: function VexBreadcrumbsComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0)(1, "vex-breadcrumb")(2, "a", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](3, "mat-icon", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](4, VexBreadcrumbsComponent_ng_container_4_Template, 5, 3, "ng-container", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](3, _c1));
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx.crumbs)("ngForTrackBy", ctx.trackByValue);
      }
    },
    dependencies: [_vex_breadcrumb_vex_breadcrumb_component__WEBPACK_IMPORTED_MODULE_1__.VexBreadcrumbComponent, _angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterLink, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgFor, _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__.MatIcon],
    encapsulation: 2
  });
}

/***/ }),

/***/ 22543:
/*!***********************************************************************************************************************************!*\
  !*** ./src/app/pages/ui/page-layouts/card/page-layout-card-large-header-tabbed/page-layout-card-large-header-tabbed.component.ts ***!
  \***********************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PageLayoutCardLargeHeaderTabbedComponent: () => (/* binding */ PageLayoutCardLargeHeaderTabbedComponent)
/* harmony export */ });
/* harmony import */ var _page_layout_demo_page_layout_demo_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../page-layout-demo/page-layout-demo.component */ 94504);
/* harmony import */ var _angular_material_tabs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/tabs */ 60989);
/* harmony import */ var _vex_components_vex_page_layout_vex_page_layout_content_directive__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @vex/components/vex-page-layout/vex-page-layout-content.directive */ 5292);
/* harmony import */ var _vex_components_vex_breadcrumbs_vex_breadcrumbs_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @vex/components/vex-breadcrumbs/vex-breadcrumbs.component */ 19806);
/* harmony import */ var _vex_components_vex_page_layout_vex_page_layout_header_directive__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @vex/components/vex-page-layout/vex-page-layout-header.directive */ 72369);
/* harmony import */ var _vex_components_vex_page_layout_vex_page_layout_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @vex/components/vex-page-layout/vex-page-layout.component */ 60306);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 61699);








const _c0 = () => ["Page Layouts", "Card", "Large Header & Tabbed"];
class PageLayoutCardLargeHeaderTabbedComponent {
  constructor() {}
  ngOnInit() {}
  static #_ = this.ɵfac = function PageLayoutCardLargeHeaderTabbedComponent_Factory(t) {
    return new (t || PageLayoutCardLargeHeaderTabbedComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineComponent"]({
    type: PageLayoutCardLargeHeaderTabbedComponent,
    selectors: [["vex-page-layout-card-large-header-tabbed"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵStandaloneFeature"]],
    decls: 18,
    vars: 2,
    consts: [["mode", "card"], [1, "flex", "flex-col", "items-start", "justify-center"], [1, "container"], [1, "title", "m-0"], [3, "crumbs"], [1, "card"], ["label", "Main Tab"], [1, "p-6"], ["label", "Side Tab"], ["label", "Extra Tab"]],
    template: function PageLayoutCardLargeHeaderTabbedComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "vex-page-layout", 0)(1, "vex-page-layout-header", 1)(2, "div", 2)(3, "h2", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](4, "Card - Large Header & Tabbed");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](5, "vex-breadcrumbs", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](6, "vex-page-layout-content", 2)(7, "div", 5)(8, "mat-tab-group")(9, "mat-tab", 6)(10, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](11, "vex-page-layout-demo");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](12, "mat-tab", 8)(13, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](14, "vex-page-layout-demo");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](15, "mat-tab", 9)(16, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](17, "vex-page-layout-demo");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()()()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("crumbs", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpureFunction0"](1, _c0));
      }
    },
    dependencies: [_vex_components_vex_page_layout_vex_page_layout_component__WEBPACK_IMPORTED_MODULE_4__.VexPageLayoutComponent, _vex_components_vex_page_layout_vex_page_layout_header_directive__WEBPACK_IMPORTED_MODULE_3__.VexPageLayoutHeaderDirective, _vex_components_vex_breadcrumbs_vex_breadcrumbs_component__WEBPACK_IMPORTED_MODULE_2__.VexBreadcrumbsComponent, _vex_components_vex_page_layout_vex_page_layout_content_directive__WEBPACK_IMPORTED_MODULE_1__.VexPageLayoutContentDirective, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_6__.MatTabsModule, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_6__.MatTab, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_6__.MatTabGroup, _page_layout_demo_page_layout_demo_component__WEBPACK_IMPORTED_MODULE_0__.PageLayoutDemoComponent],
    styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ })

}]);
//# sourceMappingURL=src_app_pages_ui_page-layouts_card_page-layout-card-large-header-tabbed_page-layout-card-larg-fbdd5f.js.map