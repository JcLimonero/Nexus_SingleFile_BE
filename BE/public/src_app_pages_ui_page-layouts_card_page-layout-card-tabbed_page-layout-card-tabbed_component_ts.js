"use strict";
(self["webpackChunkvex"] = self["webpackChunkvex"] || []).push([["src_app_pages_ui_page-layouts_card_page-layout-card-tabbed_page-layout-card-tabbed_component_ts"],{

/***/ 61882:
/*!*********************************************************************************************************!*\
  !*** ./src/app/pages/ui/page-layouts/card/page-layout-card-tabbed/page-layout-card-tabbed.component.ts ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PageLayoutCardTabbedComponent: () => (/* binding */ PageLayoutCardTabbedComponent)
/* harmony export */ });
/* harmony import */ var _page_layout_demo_page_layout_demo_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../page-layout-demo/page-layout-demo.component */ 94504);
/* harmony import */ var _angular_material_tabs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/tabs */ 60989);
/* harmony import */ var _vex_components_vex_page_layout_vex_page_layout_content_directive__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @vex/components/vex-page-layout/vex-page-layout-content.directive */ 5292);
/* harmony import */ var _vex_components_vex_page_layout_vex_page_layout_header_directive__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @vex/components/vex-page-layout/vex-page-layout-header.directive */ 72369);
/* harmony import */ var _vex_components_vex_page_layout_vex_page_layout_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @vex/components/vex-page-layout/vex-page-layout.component */ 60306);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 61699);







class PageLayoutCardTabbedComponent {
  constructor() {}
  ngOnInit() {}
  static #_ = this.ɵfac = function PageLayoutCardTabbedComponent_Factory(t) {
    return new (t || PageLayoutCardTabbedComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({
    type: PageLayoutCardTabbedComponent,
    selectors: [["vex-page-layout-card-tabbed"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵStandaloneFeature"]],
    decls: 32,
    vars: 0,
    consts: [["mode", "card"], [1, "h-6"], [1, "container"], [1, "card"], ["label", "Main Tab"], [1, "p-6"], ["label", "Side Tab"], ["label", "Extra Tab"], ["label", "Additional Tab"], ["label", "Another Tab"], ["label", "One More Tab"], ["label", "Definitely the last Tab"], ["label", "Whoops another Tab"], ["label", "And one last Tab"]],
    template: function PageLayoutCardTabbedComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "vex-page-layout", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](1, "vex-page-layout-header", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](2, "vex-page-layout-content", 2)(3, "div", 3)(4, "mat-tab-group")(5, "mat-tab", 4)(6, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](7, "vex-page-layout-demo");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](8, "mat-tab", 6)(9, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](10, "vex-page-layout-demo");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](11, "mat-tab", 7)(12, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](13, "vex-page-layout-demo");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](14, "mat-tab", 8)(15, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](16, "vex-page-layout-demo");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](17, "mat-tab", 9)(18, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](19, "vex-page-layout-demo");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](20, "mat-tab", 10)(21, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](22, "vex-page-layout-demo");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](23, "mat-tab", 11)(24, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](25, "vex-page-layout-demo");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](26, "mat-tab", 12)(27, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](28, "vex-page-layout-demo");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](29, "mat-tab", 13)(30, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](31, "vex-page-layout-demo");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()()()();
      }
    },
    dependencies: [_vex_components_vex_page_layout_vex_page_layout_component__WEBPACK_IMPORTED_MODULE_3__.VexPageLayoutComponent, _vex_components_vex_page_layout_vex_page_layout_header_directive__WEBPACK_IMPORTED_MODULE_2__.VexPageLayoutHeaderDirective, _vex_components_vex_page_layout_vex_page_layout_content_directive__WEBPACK_IMPORTED_MODULE_1__.VexPageLayoutContentDirective, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_5__.MatTabsModule, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_5__.MatTab, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_5__.MatTabGroup, _page_layout_demo_page_layout_demo_component__WEBPACK_IMPORTED_MODULE_0__.PageLayoutDemoComponent],
    styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ })

}]);
//# sourceMappingURL=src_app_pages_ui_page-layouts_card_page-layout-card-tabbed_page-layout-card-tabbed_component_ts.js.map