"use strict";
(self["webpackChunkvex"] = self["webpackChunkvex"] || []).push([["src_app_pages_documentation_changelog_changelog_component_ts"],{

/***/ 33794:
/*!**********************************************************************!*\
  !*** ./src/app/pages/documentation/changelog/changelog.component.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ChangelogComponent: () => (/* binding */ ChangelogComponent)
/* harmony export */ });
/* harmony import */ var _vex_components_vex_showdown_vex_showdown_source_directive__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vex/components/vex-showdown/vex-showdown-source.directive */ 4068);
/* harmony import */ var _vex_components_vex_showdown_vex_showdown_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @vex/components/vex-showdown/vex-showdown.component */ 39515);
/* harmony import */ var _vex_components_vex_page_layout_vex_page_layout_content_directive__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @vex/components/vex-page-layout/vex-page-layout-content.directive */ 5292);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _vex_components_vex_breadcrumbs_vex_breadcrumbs_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @vex/components/vex-breadcrumbs/vex-breadcrumbs.component */ 19806);
/* harmony import */ var _vex_components_vex_secondary_toolbar_vex_secondary_toolbar_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component */ 99565);
/* harmony import */ var _vex_components_vex_page_layout_vex_page_layout_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @vex/components/vex-page-layout/vex-page-layout.component */ 60306);
/* harmony import */ var _markdown_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../markdown.module */ 73701);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 61699);












const _c0 = () => ["Documentation", "Changelog"];
class ChangelogComponent {
  constructor() {}
  ngOnInit() {}
  static #_ = this.ɵfac = function ChangelogComponent_Factory(t) {
    return new (t || ChangelogComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineComponent"]({
    type: ChangelogComponent,
    selectors: [["vex-changelog"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵStandaloneFeature"]],
    decls: 8,
    vars: 2,
    consts: [["current", "Documentation"], [1, "flex-auto", 3, "crumbs"], ["color", "primary", "mat-icon-button", "", "type", "button", 1, "ml-2"], ["svgIcon", "mat:more_vert"], [1, "prose", "dark:prose-invert", "mx-auto", "card", "p-6", "relative"], ["src", "/CHANGELOG.md"]],
    template: function ChangelogComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "vex-page-layout")(1, "vex-secondary-toolbar", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](2, "vex-breadcrumbs", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](3, "button", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](4, "mat-icon", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](5, "vex-page-layout-content")(6, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](7, "vex-showdown", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("crumbs", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpureFunction0"](1, _c0));
      }
    },
    dependencies: [_vex_components_vex_page_layout_vex_page_layout_component__WEBPACK_IMPORTED_MODULE_5__.VexPageLayoutComponent, _vex_components_vex_secondary_toolbar_vex_secondary_toolbar_component__WEBPACK_IMPORTED_MODULE_4__.VexSecondaryToolbarComponent, _vex_components_vex_breadcrumbs_vex_breadcrumbs_component__WEBPACK_IMPORTED_MODULE_3__.VexBreadcrumbsComponent, _angular_material_button__WEBPACK_IMPORTED_MODULE_8__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_8__.MatIconButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_9__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_9__.MatIcon, _vex_components_vex_page_layout_vex_page_layout_content_directive__WEBPACK_IMPORTED_MODULE_2__.VexPageLayoutContentDirective, _vex_components_vex_showdown_vex_showdown_component__WEBPACK_IMPORTED_MODULE_1__.VexShowdownComponent, _vex_components_vex_showdown_vex_showdown_source_directive__WEBPACK_IMPORTED_MODULE_0__.VexShowdownSourceDirective, _markdown_module__WEBPACK_IMPORTED_MODULE_6__.MarkdownModule],
    styles: ["vex-changelog vex-secondary-toolbar h1,   vex-changelog vex-secondary-toolbar h2 {\n  border: none;\n  margin: 0;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvZG9jdW1lbnRhdGlvbi9jaGFuZ2Vsb2cvY2hhbmdlbG9nLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVJOztFQUVFLFlBQUE7RUFDQSxTQUFBO0FBRE4iLCJzb3VyY2VzQ29udGVudCI6WyI6Om5nLWRlZXAgdmV4LWNoYW5nZWxvZyB7XG4gIHZleC1zZWNvbmRhcnktdG9vbGJhciB7XG4gICAgaDEsXG4gICAgaDIge1xuICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgbWFyZ2luOiAwO1xuICAgIH1cbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ })

}]);
//# sourceMappingURL=src_app_pages_documentation_changelog_changelog_component_ts.js.map