"use strict";
(self["webpackChunkvex"] = self["webpackChunkvex"] || []).push([["src_app_pages_pages_guides_guides_component_ts"],{

/***/ 83951:
/*!*****************************************************!*\
  !*** ./src/@vex/animations/fade-in-up.animation.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fadeInUp400ms: () => (/* binding */ fadeInUp400ms),
/* harmony export */   fadeInUpAnimation: () => (/* binding */ fadeInUpAnimation)
/* harmony export */ });
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/animations */ 12501);

function fadeInUpAnimation(duration) {
  return (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.trigger)('fadeInUp', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.transition)(':enter', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
    transform: 'translateY(20px)',
    opacity: 0
  }), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.animate)(`${duration}ms cubic-bezier(0.35, 0, 0.25, 1)`, (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
    transform: 'translateY(0)',
    opacity: 1
  }))])]);
}
const fadeInUp400ms = fadeInUpAnimation(400);

/***/ }),

/***/ 86820:
/*!**************************************************!*\
  !*** ./src/@vex/animations/stagger.animation.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   stagger20ms: () => (/* binding */ stagger20ms),
/* harmony export */   stagger40ms: () => (/* binding */ stagger40ms),
/* harmony export */   stagger60ms: () => (/* binding */ stagger60ms),
/* harmony export */   stagger80ms: () => (/* binding */ stagger80ms),
/* harmony export */   staggerAnimation: () => (/* binding */ staggerAnimation)
/* harmony export */ });
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/animations */ 12501);

function staggerAnimation(timing) {
  return (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.trigger)('stagger', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.transition)('* => *', [
  // each time the binding value changes
  (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.query)(':enter', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.stagger)(timing, (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.animateChild)()), {
    optional: true
  })])]);
}
const stagger80ms = staggerAnimation(80);
const stagger60ms = staggerAnimation(60);
const stagger40ms = staggerAnimation(40);
const stagger20ms = staggerAnimation(20);

/***/ }),

/***/ 49685:
/*!********************************************************!*\
  !*** ./src/app/pages/pages/guides/guides.component.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GuidesComponent: () => (/* binding */ GuidesComponent)
/* harmony export */ });
/* harmony import */ var _apps_help_center_help_center_guides_help_center_guides_guide_help_center_guides_guide_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../apps/help-center/help-center-guides/help-center-guides-guide/help-center-guides-guide.component */ 21307);
/* harmony import */ var _apps_help_center_help_center_guides_help_center_guides_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../apps/help-center/help-center-guides/help-center-guides.component */ 78538);
/* harmony import */ var _vex_utils_track_by__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @vex/utils/track-by */ 47637);
/* harmony import */ var _vex_animations_stagger_animation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @vex/animations/stagger.animation */ 86820);
/* harmony import */ var _vex_animations_fade_in_up_animation__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @vex/animations/fade-in-up.animation */ 83951);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_material_list__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/list */ 13228);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 61699);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/dialog */ 17401);














function GuidesComponent_a_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "a", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function GuidesComponent_a_15_Template_a_click_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r6);
      const guide_r4 = restoredCtx.$implicit;
      return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](guide_r4.onClick(guide_r4));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](1, "mat-icon", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](2, "span", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const guide_r4 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("svgIcon", guide_r4.icon);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](guide_r4.label);
  }
}
function GuidesComponent_a_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "a", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function GuidesComponent_a_20_Template_a_click_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r9);
      const guide_r7 = restoredCtx.$implicit;
      return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](guide_r7.onClick(guide_r7));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](1, "mat-icon", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](2, "span", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const guide_r7 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("svgIcon", guide_r7.icon);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](guide_r7.label);
  }
}
function GuidesComponent_a_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "a", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function GuidesComponent_a_25_Template_a_click_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r12);
      const guide_r10 = restoredCtx.$implicit;
      return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](guide_r10.onClick(guide_r10));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](1, "mat-icon", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](2, "span", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const guide_r10 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("svgIcon", guide_r10.icon);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](guide_r10.label);
  }
}
function GuidesComponent_a_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "a", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function GuidesComponent_a_30_Template_a_click_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r15);
      const guide_r13 = restoredCtx.$implicit;
      return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](guide_r13.onClick(guide_r13));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](1, "mat-icon", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](2, "span", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const guide_r13 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("svgIcon", guide_r13.icon);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](guide_r13.label);
  }
}
class GuidesComponent {
  constructor(dialog) {
    this.dialog = dialog;
    this.guides = [{
      id: 1,
      label: 'How secure is my password?',
      icon: 'mat:description',
      category: _apps_help_center_help_center_guides_help_center_guides_component__WEBPACK_IMPORTED_MODULE_1__.GuideCategory.accountSettings,
      onClick: guide => this.openDialog(guide)
    }, {
      id: 2,
      label: 'Can I change my username?',
      icon: 'mat:description',
      category: _apps_help_center_help_center_guides_help_center_guides_component__WEBPACK_IMPORTED_MODULE_1__.GuideCategory.accountSettings,
      onClick: guide => this.openDialog(guide)
    }, {
      id: 3,
      label: 'How do I change my email?',
      icon: 'mat:movie_filter',
      category: _apps_help_center_help_center_guides_help_center_guides_component__WEBPACK_IMPORTED_MODULE_1__.GuideCategory.accountSettings,
      onClick: guide => this.openDialog(guide)
    }, {
      id: 4,
      label: 'Where can I change my timezone?',
      icon: 'mat:description',
      category: _apps_help_center_help_center_guides_help_center_guides_component__WEBPACK_IMPORTED_MODULE_1__.GuideCategory.accountSettings,
      onClick: guide => this.openDialog(guide)
    }, {
      id: 5,
      label: 'How do I change my password?',
      icon: 'mat:movie_filter',
      category: _apps_help_center_help_center_guides_help_center_guides_component__WEBPACK_IMPORTED_MODULE_1__.GuideCategory.accountSettings,
      onClick: guide => this.openDialog(guide)
    }, {
      id: 6,
      label: 'Which technologies are used?',
      icon: 'mat:description',
      category: _apps_help_center_help_center_guides_help_center_guides_component__WEBPACK_IMPORTED_MODULE_1__.GuideCategory.apiHelp,
      onClick: guide => this.openDialog(guide)
    }, {
      id: 7,
      label: 'How do I make a request?',
      icon: 'mat:movie_filter',
      category: _apps_help_center_help_center_guides_help_center_guides_component__WEBPACK_IMPORTED_MODULE_1__.GuideCategory.apiHelp,
      onClick: guide => this.openDialog(guide)
    }, {
      id: 8,
      label: 'What are the API Limits?',
      icon: 'mat:description',
      category: _apps_help_center_help_center_guides_help_center_guides_component__WEBPACK_IMPORTED_MODULE_1__.GuideCategory.apiHelp,
      onClick: guide => this.openDialog(guide)
    }, {
      id: 9,
      label: 'How can I apply for the API?',
      icon: 'mat:movie_filter',
      category: _apps_help_center_help_center_guides_help_center_guides_component__WEBPACK_IMPORTED_MODULE_1__.GuideCategory.apiHelp,
      onClick: guide => this.openDialog(guide)
    }, {
      id: 10,
      label: 'When can I start developing?',
      icon: 'mat:description',
      category: _apps_help_center_help_center_guides_help_center_guides_component__WEBPACK_IMPORTED_MODULE_1__.GuideCategory.apiHelp,
      onClick: guide => this.openDialog(guide)
    }, {
      id: 11,
      label: 'Can I get a refund?',
      icon: 'mat:description',
      category: _apps_help_center_help_center_guides_help_center_guides_component__WEBPACK_IMPORTED_MODULE_1__.GuideCategory.billing,
      onClick: guide => this.openDialog(guide)
    }, {
      id: 12,
      label: 'How do I pay?',
      icon: 'mat:movie_filter',
      category: _apps_help_center_help_center_guides_help_center_guides_component__WEBPACK_IMPORTED_MODULE_1__.GuideCategory.billing,
      onClick: guide => this.openDialog(guide)
    }, {
      id: 13,
      label: 'Which payment methods are supported?',
      icon: 'mat:movie_filter',
      category: _apps_help_center_help_center_guides_help_center_guides_component__WEBPACK_IMPORTED_MODULE_1__.GuideCategory.billing,
      onClick: guide => this.openDialog(guide)
    }, {
      id: 14,
      label: 'Do I need to pay VAT?',
      icon: 'mat:description',
      category: _apps_help_center_help_center_guides_help_center_guides_component__WEBPACK_IMPORTED_MODULE_1__.GuideCategory.billing,
      onClick: guide => this.openDialog(guide)
    }, {
      id: 15,
      label: 'Where do I find my purchase code?',
      icon: 'mat:description',
      category: _apps_help_center_help_center_guides_help_center_guides_component__WEBPACK_IMPORTED_MODULE_1__.GuideCategory.billing,
      onClick: guide => this.openDialog(guide)
    }, {
      id: 16,
      label: 'How do I download the template?',
      icon: 'mat:description',
      category: _apps_help_center_help_center_guides_help_center_guides_component__WEBPACK_IMPORTED_MODULE_1__.GuideCategory.firstSteps,
      onClick: guide => this.openDialog(guide)
    }, {
      id: 17,
      label: 'Installation Guide',
      icon: 'mat:movie_filter',
      category: _apps_help_center_help_center_guides_help_center_guides_component__WEBPACK_IMPORTED_MODULE_1__.GuideCategory.firstSteps,
      onClick: guide => this.openDialog(guide)
    }, {
      id: 18,
      label: 'Creating your first page',
      icon: 'mat:movie_filter',
      category: _apps_help_center_help_center_guides_help_center_guides_component__WEBPACK_IMPORTED_MODULE_1__.GuideCategory.firstSteps,
      onClick: guide => this.openDialog(guide)
    }, {
      id: 19,
      label: 'Customizing your template',
      icon: 'mat:description',
      category: _apps_help_center_help_center_guides_help_center_guides_component__WEBPACK_IMPORTED_MODULE_1__.GuideCategory.firstSteps,
      onClick: guide => this.openDialog(guide)
    }, {
      id: 20,
      label: 'How do I contact support?',
      icon: 'mat:description',
      category: _apps_help_center_help_center_guides_help_center_guides_component__WEBPACK_IMPORTED_MODULE_1__.GuideCategory.firstSteps,
      onClick: guide => this.openDialog(guide)
    }];
    this.accountSettings = this.guides.filter(guide => guide.category === _apps_help_center_help_center_guides_help_center_guides_component__WEBPACK_IMPORTED_MODULE_1__.GuideCategory.accountSettings);
    this.apiHelp = this.guides.filter(guide => guide.category === _apps_help_center_help_center_guides_help_center_guides_component__WEBPACK_IMPORTED_MODULE_1__.GuideCategory.apiHelp);
    this.billing = this.guides.filter(guide => guide.category === _apps_help_center_help_center_guides_help_center_guides_component__WEBPACK_IMPORTED_MODULE_1__.GuideCategory.billing);
    this.firstSteps = this.guides.filter(guide => guide.category === _apps_help_center_help_center_guides_help_center_guides_component__WEBPACK_IMPORTED_MODULE_1__.GuideCategory.firstSteps);
    this.trackById = _vex_utils_track_by__WEBPACK_IMPORTED_MODULE_2__.trackById;
  }
  ngOnInit() {}
  openDialog(guide) {
    this.dialog.open(_apps_help_center_help_center_guides_help_center_guides_guide_help_center_guides_guide_component__WEBPACK_IMPORTED_MODULE_0__.HelpCenterGuidesGuideComponent, {
      data: guide,
      width: '600px'
    });
  }
  static #_ = this.ɵfac = function GuidesComponent_Factory(t) {
    return new (t || GuidesComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_6__.MatDialog));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineComponent"]({
    type: GuidesComponent,
    selectors: [["vex-guides"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵStandaloneFeature"]],
    decls: 49,
    vars: 16,
    consts: [[1, "text-center", "p-6", "pb-24", "header"], [1, "container"], [1, "display-2", "mt-16", "mb-8"], [1, "border", "rounded-full", "bg-foreground", "py-2", "pl-6", "pr-3", "text-secondary", "max-w-xl", "mx-auto", "shadow-xl", "flex", "items-center"], ["svgIcon", "mat:search", 1, "flex-none"], ["placeholder", "Search for answers...", "type", "text", 1, "border-0", "ml-4", "placeholder:text-secondary", "subheading-2", "outline-none", "font-medium", "w-0", "bg-foreground", "flex-auto"], ["color", "primary", "mat-raised-button", "", "type", "button", 1, "rounded-full", "flex-none"], [1, "text-left", "mt-24", "mb-12", "container", "grid", "grid-cols-1", "sm:grid-cols-2", "gap-6"], [1, "card", "max-w-full", "overflow-hidden", "p-3"], ["mat-subheader", ""], ["class", "rounded overflow-hidden", "mat-list-item", "", 3, "click", 4, "ngFor", "ngForOf", "ngForTrackBy"], [1, "bg-foreground", "py-16", "px-6", "footer"], [1, "display-1", "mt-0", "mb-4", "text-center"], [1, "subheading-2", "text-hint", "text-center", "max-w-lg", "mx-auto", "m-0"], [1, "mt-16", "max-w-3xl", "mx-auto", "flex", "flex-col", "sm:flex-row", "gap-6"], [1, "text-center", "p-6", "border", "rounded", "flex-1"], ["svgIcon", "mat:phone", 1, "text-hint", "icon-4xl"], [1, "title", "mb-0", "mt-4"], [1, "subheading-2", "m-0", "text-hint"], ["svgIcon", "mat:mail", 1, "text-hint", "icon-4xl"], ["mat-list-item", "", 1, "rounded", "overflow-hidden", 3, "click"], ["matListItemIcon", "", 3, "svgIcon"], ["matListItemTitle", ""]],
    template: function GuidesComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div")(1, "div", 0)(2, "div", 1)(3, "h2", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](4, "Hello, how can we help?");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](5, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](6, "mat-icon", 4)(7, "input", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](8, "button", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](9, " Search ");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](10, "div", 7)(11, "div", 8)(12, "mat-nav-list")(13, "h3", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](14, "First Steps");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](15, GuidesComponent_a_15_Template, 4, 2, "a", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](16, "div", 8)(17, "mat-nav-list")(18, "h3", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](19, "API Help");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](20, GuidesComponent_a_20_Template, 4, 2, "a", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](21, "div", 8)(22, "mat-nav-list")(23, "h3", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](24, "Billing");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](25, GuidesComponent_a_25_Template, 4, 2, "a", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](26, "div", 8)(27, "mat-nav-list")(28, "h3", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](29, "First Steps");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](30, GuidesComponent_a_30_Template, 4, 2, "a", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](31, "div", 11)(32, "h2", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](33, "Still have questions?");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](34, "h3", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](35, " A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](36, "div", 14)(37, "div", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](38, "mat-icon", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](39, "h3", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](40, "+1 (840) 423-3404");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](41, "h4", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](42, " Call us anytime for a quick solution ");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](43, "div", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](44, "mat-icon", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](45, "h3", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](46, "support@example.com");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](47, "h4", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](48, " Send us a mail to resolve your issue ");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("@stagger", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("@fadeInUp", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("@fadeInUp", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("@fadeInUp", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngForOf", ctx.accountSettings)("ngForTrackBy", ctx.trackById);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("@fadeInUp", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngForOf", ctx.apiHelp)("ngForTrackBy", ctx.trackById);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("@fadeInUp", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngForOf", ctx.billing)("ngForTrackBy", ctx.trackById);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("@fadeInUp", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngForOf", ctx.firstSteps)("ngForTrackBy", ctx.trackById);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("@fadeInUp", undefined);
      }
    },
    dependencies: [_angular_material_icon__WEBPACK_IMPORTED_MODULE_7__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_7__.MatIcon, _angular_material_button__WEBPACK_IMPORTED_MODULE_8__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_8__.MatButton, _angular_material_list__WEBPACK_IMPORTED_MODULE_9__.MatListModule, _angular_material_list__WEBPACK_IMPORTED_MODULE_9__.MatNavList, _angular_material_list__WEBPACK_IMPORTED_MODULE_9__.MatListItem, _angular_material_list__WEBPACK_IMPORTED_MODULE_9__.MatListItemIcon, _angular_material_list__WEBPACK_IMPORTED_MODULE_9__.MatListSubheaderCssMatStyler, _angular_material_list__WEBPACK_IMPORTED_MODULE_9__.MatListItemTitle, _angular_common__WEBPACK_IMPORTED_MODULE_10__.NgFor],
    styles: [".header[_ngcontent-%COMP%] {\n  background-color: var(--vex-background-background);\n  background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='%23e6e6e6' stroke-width='1'%3E%3Cpath d='M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63'/%3E%3Cpath d='M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764'/%3E%3Cpath d='M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880'/%3E%3Cpath d='M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382'/%3E%3Cpath d='M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269'/%3E%3C/g%3E%3Cg fill='%23e6e6e6'%3E%3Ccircle cx='769' cy='229' r='5'/%3E%3Ccircle cx='539' cy='269' r='5'/%3E%3Ccircle cx='603' cy='493' r='5'/%3E%3Ccircle cx='731' cy='737' r='5'/%3E%3Ccircle cx='520' cy='660' r='5'/%3E%3Ccircle cx='309' cy='538' r='5'/%3E%3Ccircle cx='295' cy='764' r='5'/%3E%3Ccircle cx='40' cy='599' r='5'/%3E%3Ccircle cx='102' cy='382' r='5'/%3E%3Ccircle cx='127' cy='80' r='5'/%3E%3Ccircle cx='370' cy='105' r='5'/%3E%3Ccircle cx='578' cy='42' r='5'/%3E%3Ccircle cx='237' cy='261' r='5'/%3E%3Ccircle cx='390' cy='382' r='5'/%3E%3C/g%3E%3C/svg%3E\");\n}\n\n.footer[_ngcontent-%COMP%] {\n  background-image: url(\"/assets/img/illustrations/it_support.svg\");\n  background-position: bottom right;\n  background-repeat: no-repeat;\n  background-size: 250px;\n  padding-bottom: 250px;\n}\n@media (min-width: 960px) {\n  .footer[_ngcontent-%COMP%] {\n    padding-bottom: 1rem;\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFnZXMvcGFnZXMvZ3VpZGVzL2d1aWRlcy5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGtEQUFBO0VBQ0EsNjVDQUFBO0FBQ0Y7O0FBRUE7RUFDRSxpRUFBQTtFQUNBLGlDQUFBO0VBQ0EsNEJBQUE7RUFDQSxzQkFBQTtFQUNBLHFCQUFBO0FBQ0Y7QUFDRTtFQUNFO0lBQUE7RUFBQTtBQUdKIiwic291cmNlc0NvbnRlbnQiOlsiLmhlYWRlciB7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXZleC1iYWNrZ3JvdW5kLWJhY2tncm91bmQpO1xuICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJkYXRhOmltYWdlL3N2Zyt4bWwsJTNDc3ZnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zycgd2lkdGg9JzQwMCcgaGVpZ2h0PSc0MDAnIHZpZXdCb3g9JzAgMCA4MDAgODAwJyUzRSUzQ2cgZmlsbD0nbm9uZScgc3Ryb2tlPSclMjNlNmU2ZTYnIHN0cm9rZS13aWR0aD0nMSclM0UlM0NwYXRoIGQ9J003NjkgMjI5TDEwMzcgMjYwLjlNOTI3IDg4MEw3MzEgNzM3IDUyMCA2NjAgMzA5IDUzOCA0MCA1OTkgMjk1IDc2NCAxMjYuNSA4NzkuNSA0MCA1OTktMTk3IDQ5MyAxMDIgMzgyLTMxIDIyOSAxMjYuNSA3OS41LTY5LTYzJy8lM0UlM0NwYXRoIGQ9J00tMzEgMjI5TDIzNyAyNjEgMzkwIDM4MiA2MDMgNDkzIDMwOC41IDUzNy41IDEwMS41IDM4MS41TTM3MCA5MDVMMjk1IDc2NCcvJTNFJTNDcGF0aCBkPSdNNTIwIDY2MEw1NzggODQyIDczMSA3MzcgODQwIDU5OSA2MDMgNDkzIDUyMCA2NjAgMjk1IDc2NCAzMDkgNTM4IDM5MCAzODIgNTM5IDI2OSA3NjkgMjI5IDU3Ny41IDQxLjUgMzcwIDEwNSAyOTUgLTM2IDEyNi41IDc5LjUgMjM3IDI2MSAxMDIgMzgyIDQwIDU5OSAtNjkgNzM3IDEyNyA4ODAnLyUzRSUzQ3BhdGggZD0nTTUyMC0xNDBMNTc4LjUgNDIuNSA3MzEtNjNNNjAzIDQ5M0w1MzkgMjY5IDIzNyAyNjEgMzcwIDEwNU05MDIgMzgyTDUzOSAyNjlNMzkwIDM4MkwxMDIgMzgyJy8lM0UlM0NwYXRoIGQ9J00tMjIyIDQyTDEyNi41IDc5LjUgMzcwIDEwNSA1MzkgMjY5IDU3Ny41IDQxLjUgOTI3IDgwIDc2OSAyMjkgOTAyIDM4MiA2MDMgNDkzIDczMSA3MzdNMjk1LTM2TDU3Ny41IDQxLjVNNTc4IDg0MkwyOTUgNzY0TTQwLTIwMUwxMjcgODBNMTAyIDM4MkwtMjYxIDI2OScvJTNFJTNDL2clM0UlM0NnIGZpbGw9JyUyM2U2ZTZlNiclM0UlM0NjaXJjbGUgY3g9Jzc2OScgY3k9JzIyOScgcj0nNScvJTNFJTNDY2lyY2xlIGN4PSc1MzknIGN5PScyNjknIHI9JzUnLyUzRSUzQ2NpcmNsZSBjeD0nNjAzJyBjeT0nNDkzJyByPSc1Jy8lM0UlM0NjaXJjbGUgY3g9JzczMScgY3k9JzczNycgcj0nNScvJTNFJTNDY2lyY2xlIGN4PSc1MjAnIGN5PSc2NjAnIHI9JzUnLyUzRSUzQ2NpcmNsZSBjeD0nMzA5JyBjeT0nNTM4JyByPSc1Jy8lM0UlM0NjaXJjbGUgY3g9JzI5NScgY3k9Jzc2NCcgcj0nNScvJTNFJTNDY2lyY2xlIGN4PSc0MCcgY3k9JzU5OScgcj0nNScvJTNFJTNDY2lyY2xlIGN4PScxMDInIGN5PSczODInIHI9JzUnLyUzRSUzQ2NpcmNsZSBjeD0nMTI3JyBjeT0nODAnIHI9JzUnLyUzRSUzQ2NpcmNsZSBjeD0nMzcwJyBjeT0nMTA1JyByPSc1Jy8lM0UlM0NjaXJjbGUgY3g9JzU3OCcgY3k9JzQyJyByPSc1Jy8lM0UlM0NjaXJjbGUgY3g9JzIzNycgY3k9JzI2MScgcj0nNScvJTNFJTNDY2lyY2xlIGN4PSczOTAnIGN5PSczODInIHI9JzUnLyUzRSUzQy9nJTNFJTNDL3N2ZyUzRVwiKTtcbn1cblxuLmZvb3RlciB7XG4gIGJhY2tncm91bmQtaW1hZ2U6IHVybChcIi9hc3NldHMvaW1nL2lsbHVzdHJhdGlvbnMvaXRfc3VwcG9ydC5zdmdcIik7XG4gIGJhY2tncm91bmQtcG9zaXRpb246IGJvdHRvbSByaWdodDtcbiAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcbiAgYmFja2dyb3VuZC1zaXplOiAyNTBweDtcbiAgcGFkZGluZy1ib3R0b206IDI1MHB4O1xuXG4gIEBzY3JlZW4gbWQge1xuICAgIEBhcHBseSBwYi00O1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"],
    data: {
      animation: [_vex_animations_stagger_animation__WEBPACK_IMPORTED_MODULE_3__.stagger60ms, _vex_animations_fade_in_up_animation__WEBPACK_IMPORTED_MODULE_4__.fadeInUp400ms]
    }
  });
}

/***/ })

}]);
//# sourceMappingURL=src_app_pages_pages_guides_guides_component_ts.js.map