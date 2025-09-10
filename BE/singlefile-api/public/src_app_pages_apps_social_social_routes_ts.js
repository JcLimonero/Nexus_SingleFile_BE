"use strict";
(self["webpackChunkvex"] = self["webpackChunkvex"] || []).push([["src_app_pages_apps_social_social_routes_ts"],{

/***/ 95982:
/*!********************************************************!*\
  !*** ./src/@vex/animations/fade-in-right.animation.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fadeInRight400ms: () => (/* binding */ fadeInRight400ms),
/* harmony export */   fadeInRightAnimation: () => (/* binding */ fadeInRightAnimation)
/* harmony export */ });
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/animations */ 12501);

function fadeInRightAnimation(duration) {
  return (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.trigger)('fadeInRight', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.transition)(':enter', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
    transform: 'translateX(-20px)',
    opacity: 0
  }), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.animate)(`${duration}ms cubic-bezier(0.35, 0, 0.25, 1)`, (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
    transform: 'translateX(0)',
    opacity: 1
  }))])]);
}
const fadeInRight400ms = fadeInRightAnimation(400);

/***/ }),

/***/ 62008:
/*!***************************************************!*\
  !*** ./src/@vex/animations/scale-in.animation.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   scaleIn400ms: () => (/* binding */ scaleIn400ms),
/* harmony export */   scaleInAnimation: () => (/* binding */ scaleInAnimation)
/* harmony export */ });
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/animations */ 12501);

function scaleInAnimation(duration) {
  return (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.trigger)('scaleIn', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.transition)(':enter', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
    transform: 'scale(0)'
  }), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.animate)(`${duration}ms cubic-bezier(0.35, 0, 0.25, 1)`, (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
    transform: 'scale(1)'
  }))])]);
}
const scaleIn400ms = scaleInAnimation(400);

/***/ }),

/***/ 32058:
/*!*******************************************************!*\
  !*** ./src/app/pages/apps/social/social.component.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SocialComponent: () => (/* binding */ SocialComponent)
/* harmony export */ });
/* harmony import */ var _vex_animations_scale_in_animation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vex/animations/scale-in.animation */ 62008);
/* harmony import */ var _vex_animations_fade_in_right_animation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @vex/animations/fade-in-right.animation */ 95982);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ 27947);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_material_tabs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/tabs */ 60989);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 61699);







const _c0 = () => ({
  exact: false
});
function SocialComponent_a_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "a", 13, 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const link_r2 = ctx.$implicit;
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](1);
    let tmp_1_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("active", _r3.isActive)("disabled", (tmp_1_0 = link_r2.disabled) !== null && tmp_1_0 !== undefined ? tmp_1_0 : false)("routerLinkActiveOptions", link_r2.routerLinkActiveOptions || _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](5, _c0))("routerLink", link_r2.route);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", link_r2.label, " ");
  }
}
class SocialComponent {
  constructor() {
    this.links = [{
      label: '',
      route: './',
      routerLinkActiveOptions: {
        exact: true
      }
    }];
  }
  ngOnInit() {}
  static #_ = this.ɵfac = function SocialComponent_Factory(t) {
    return new (t || SocialComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
    type: SocialComponent,
    selectors: [["vex-social"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵStandaloneFeature"]],
    decls: 15,
    vars: 3,
    consts: [[1, "container", "py-6"], [1, "card", "overflow-hidden"], [1, "h-64", "relative", "overflow-hidden"], ["src", "assets/img/demo/landscape.jpg", 1, "w-full", "h-full", "object-cover"], [1, "absolute", "bg-black", "opacity-25", "top-0", "right-0", "bottom-0", "left-0", "w-full", "h-full", "z-0"], ["src", "assets/img/avatars/1.jpg", 1, "avatar", "h-24", "w-24", "absolute", "top-6", "ltr:left-4", "rtl:right-4", "sm:hidden"], [1, "z-10", "relative", "-mt-16", "px-6", "flex", "items-center"], ["src", "assets/img/avatars/1.jpg", 1, "avatar", "h-24", "w-24", "flex-none", "align-start", "hidden", "sm:block", "border-2", "border-white"], [1, "max-w-full", "flex-auto", "sm:ltr:ml-6", "sm:rtl:mr-6"], [1, "h-16", "flex", "items-end"], ["mat-tab-nav-bar", "", 1, "border-0", 3, "tabPanel"], ["mat-tab-link", "", "queryParamsHandling", "preserve", "routerLinkActive", "", 3, "active", "disabled", "routerLinkActiveOptions", "routerLink", 4, "ngFor", "ngForOf"], ["tabPanel", ""], ["mat-tab-link", "", "queryParamsHandling", "preserve", "routerLinkActive", "", 3, "active", "disabled", "routerLinkActiveOptions", "routerLink"], ["rla", "routerLinkActive"]],
    template: function SocialComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](3, "img", 3)(4, "div", 4)(5, "img", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](7, "img", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](9, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](10, "nav", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](11, SocialComponent_a_11_Template, 3, 6, "a", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](12, "mat-tab-nav-panel", null, 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](14, "router-outlet");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      }
      if (rf & 2) {
        const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](13);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("@scaleIn", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("tabPanel", _r1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx.links);
      }
    },
    dependencies: [_angular_material_tabs__WEBPACK_IMPORTED_MODULE_3__.MatTabsModule, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_3__.MatTabNav, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_3__.MatTabNavPanel, _angular_material_tabs__WEBPACK_IMPORTED_MODULE_3__.MatTabLink, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgFor, _angular_router__WEBPACK_IMPORTED_MODULE_5__.RouterLinkActive, _angular_router__WEBPACK_IMPORTED_MODULE_5__.RouterLink, _angular_router__WEBPACK_IMPORTED_MODULE_5__.RouterOutlet],
    styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"],
    data: {
      animation: [_vex_animations_scale_in_animation__WEBPACK_IMPORTED_MODULE_0__.scaleIn400ms, _vex_animations_fade_in_right_animation__WEBPACK_IMPORTED_MODULE_1__.fadeInRight400ms]
    }
  });
}

/***/ }),

/***/ 45466:
/*!****************************************************!*\
  !*** ./src/app/pages/apps/social/social.routes.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _social_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./social.component */ 32058);

const routes = [{
  path: '',
  component: _social_component__WEBPACK_IMPORTED_MODULE_0__.SocialComponent,
  data: {
    toolbarShadowEnabled: true
  },
  children: [{
    path: '',
    loadComponent: () => Promise.all(/*! import() */[__webpack_require__.e("common"), __webpack_require__.e("src_app_pages_apps_social_social-profile_social-profile_component_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./social-profile/social-profile.component */ 10250)).then(m => m.SocialProfileComponent)
  }, {
    path: 'timeline',
    loadComponent: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_angular_cdk_fesm2022_text-field_mjs"), __webpack_require__.e("common"), __webpack_require__.e("src_app_pages_apps_social_social-timeline_social-timeline_component_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./social-timeline/social-timeline.component */ 37767)).then(m => m.SocialTimelineComponent)
  }]
}];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (routes);

/***/ })

}]);
//# sourceMappingURL=src_app_pages_apps_social_social_routes_ts.js.map