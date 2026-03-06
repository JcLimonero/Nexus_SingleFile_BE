"use strict";
(self["webpackChunkvex"] = self["webpackChunkvex"] || []).push([["default-src_app_pages_ui_components_components-overview_components_components-overview-button-6ca3dc"],{

/***/ 29594:
/*!*****************************************************************************************************************************************!*\
  !*** ./src/app/pages/ui/components/components-overview/components/components-overview-buttons/components-overview-buttons.component.ts ***!
  \*****************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ComponentsOverviewButtonsComponent: () => (/* binding */ ComponentsOverviewButtonsComponent)
/* harmony export */ });
/* harmony import */ var _vex_components_vex_highlight_vex_highlight_directive__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vex/components/vex-highlight/vex-highlight.directive */ 26010);
/* harmony import */ var _angular_material_tabs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/tabs */ 60989);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 61699);








class ComponentsOverviewButtonsComponent {
  constructor() {
    this.flatButtonsHTML = `<button mat-button>Button</button>
<button mat-button color="primary">Primary</button>
<button mat-button color="accent">Accent</button>
<button mat-button color="warn">Warn</button>
<button mat-button disabled="true">Disabled</button>`;
    this.raisedButtonsHTML = `<button mat-raised-button>Button</button>
<button mat-raised-button color="primary">Primary</button>
<button mat-raised-button color="accent">Accent</button>
<button mat-raised-button color="warn">Warn</button>
<button mat-raised-button disabled="true">Disabled</button>`;
    this.fabHTML = `<button mat-fab color="primary"><mat-icon>grade</mat-icon></button>
<button mat-fab color="accent"><mat-icon>favorite</mat-icon></button>
<button mat-fab color="warn"><mat-icon>build</mat-icon></button>
<button mat-fab disabled="true"><mat-icon>lock</mat-icon></button>
<button mat-mini-fab color="primary"><mat-icon>favorite</mat-icon></button>
<button mat-mini-fab color="accent"><mat-icon>thumb_up</mat-icon></button>
<button mat-mini-fab color="warn"><mat-icon>build</mat-icon></button>
<button mat-mini-fab disabled="true"><mat-icon>lock</mat-icon></button>`;
    this.iconButtonHTML = `<button mat-icon-button><mat-icon>menu</mat-icon></button>
<button mat-icon-button color="primary"><mat-icon>grade</mat-icon></button>
<button mat-icon-button color="accent"><mat-icon>favorite</mat-icon></button>
<button mat-icon-button color="warn"><mat-icon>build</mat-icon></button>
<button mat-icon-button disabled="true"><mat-icon>lock</mat-icon></button>`;
  }
  ngOnInit() {}
  static #_ = this.ɵfac = function ComponentsOverviewButtonsComponent_Factory(t) {
    return new (t || ComponentsOverviewButtonsComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: ComponentsOverviewButtonsComponent,
    selectors: [["vex-components-overview-buttons"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵStandaloneFeature"]],
    decls: 106,
    vars: 4,
    consts: [[1, "card", "flex", "flex-col", "sm:flex-row"], [1, "p-6", "md:min-w-[300px]"], [1, "title", "mt-0", "mb-4"], [1, "flex", "flex-col", "sm:flex-row", "items-center", "justify-center", "gap-6"], [1, "flex", "flex-col", "gap-2"], ["mat-button", ""], ["color", "primary", "mat-button", ""], ["color", "accent", "mat-button", ""], ["color", "warn", "mat-button", ""], ["disabled", "", "mat-button", ""], ["mat-stroked-button", ""], ["color", "primary", "mat-stroked-button", ""], ["color", "accent", "mat-stroked-button", ""], ["color", "warn", "mat-stroked-button", ""], ["disabled", "", "mat-stroked-button", ""], ["mat-raised-button", ""], ["color", "primary", "mat-raised-button", ""], ["color", "accent", "mat-raised-button", ""], ["color", "warn", "mat-raised-button", ""], ["disabled", "", "mat-raised-button", ""], [1, "mt-6", "flex", "flex-col", "items-center", "justify-center", "gap-2"], ["color", "primary", "mat-icon-button", ""], ["svgIcon", "mat:favorite"], ["color", "accent", "mat-icon-button", ""], ["color", "warn", "mat-icon-button", ""], ["disabled", "", "mat-icon-button", ""], ["color", "primary", "mat-mini-fab", ""], ["color", "accent", "mat-mini-fab", ""], ["color", "warn", "mat-mini-fab", ""], ["disabled", "", "mat-mini-fab", ""], ["color", "primary", "mat-fab", ""], ["color", "accent", "mat-fab", ""], ["color", "warn", "mat-fab", ""], ["disabled", "", "mat-fab", ""], [1, "border-l", "flex-1"], [1, "p-6"], [1, "title", "mt-0"], [1, "body-2", "text-secondary", "m-0"], ["label", "DESCRIPTION"], [1, "semi-bold"], ["label", "Source Code"], [3, "vexHighlight"]],
    template: function ComponentsOverviewButtonsComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h2", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Preview");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 3)(5, "div", 4)(6, "button", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](7, "Button");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "button", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](9, "Primary");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "button", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](11, "Accent");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "button", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](13, "Warn");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "button", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](15, "Disabled");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](16, "div", 4)(17, "button", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](18, "Button");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](19, "button", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](20, "Primary");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](21, "button", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](22, "Accent");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](23, "button", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](24, "Warn");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](25, "button", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](26, "Disabled");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](27, "div", 4)(28, "button", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](29, "Button");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](30, "button", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](31, "Primary");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](32, "button", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](33, "Accent");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](34, "button", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](35, "Warn");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](36, "button", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](37, "Disabled");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](38, "div", 20)(39, "button", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](40, "mat-icon", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](41, "button", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](42, "mat-icon", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](43, "button", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](44, "mat-icon", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](45, "button", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](46, "mat-icon", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](47, "div", 20)(48, "button", 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](49, "mat-icon", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](50, "button", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](51, "mat-icon", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](52, "button", 28);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](53, "mat-icon", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](54, "button", 29);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](55, "mat-icon", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](56, "div", 20)(57, "button", 30);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](58, "mat-icon", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](59, "button", 31);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](60, "mat-icon", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](61, "button", 32);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](62, "mat-icon", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](63, "button", 33);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](64, "mat-icon", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](65, "div", 34)(66, "div", 35)(67, "h2", 36);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](68, "Buttons");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](69, "h4", 37);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](70, "[mat-button]");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](71, "mat-tab-group")(72, "mat-tab", 38)(73, "div", 35)(74, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](75, " Material buttons trigger an ink reaction on press. They may display text, imagery, or both. Flat buttons and raised buttons are the most commonly used types. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](76, "br")(77, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](78, "span", 39);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](79, "Flat buttons:");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](80, "ul")(81, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](82, "Flat buttons are text-only buttons.");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](83, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](84, "They may be used in dialogs, toolbars, or inline.");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](85, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](86, "They do not lift, but fill with color on press.");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](87, "p")(88, "span", 39);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](89, "Raised buttons:");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](90, "ul")(91, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](92, "Raised buttons are rectangular-shaped buttons.");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](93, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](94, "They may be used inline.");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](95, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](96, "They lift and display ink reactions on press.");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](97, "mat-tab", 40)(98, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](99, "code", 41);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](100, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](101, "code", 41);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](102, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](103, "code", 41);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](104, "pre");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](105, "code", 41);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](99);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("vexHighlight", ctx.flatButtonsHTML);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("vexHighlight", ctx.raisedButtonsHTML);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("vexHighlight", ctx.iconButtonHTML);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("vexHighlight", ctx.fabHTML);
      }
    },
    dependencies: [_angular_material_button__WEBPACK_IMPORTED_MODULE_2__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_2__.MatButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_2__.MatIconButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_2__.MatMiniFabButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_2__.MatFabButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_3__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_3__.MatIcon, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_4__.MatTabsModule, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_4__.MatTab, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_4__.MatTabGroup, _vex_components_vex_highlight_vex_highlight_directive__WEBPACK_IMPORTED_MODULE_0__.VexHighlightDirective],
    styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ })

}]);
//# sourceMappingURL=default-src_app_pages_ui_components_components-overview_components_components-overview-button-6ca3dc.js.map