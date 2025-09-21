"use strict";
(self["webpackChunkvex"] = self["webpackChunkvex"] || []).push([["src_app_pages_apps_social_social-timeline_social-timeline_component_ts"],{

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

/***/ 7745:
/*!***********************************************************************************************************************!*\
  !*** ./src/app/pages/apps/social/social-timeline/components/social-timeline-entry/social-timeline-entry.component.ts ***!
  \***********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SocialTimelineEntryComponent: () => (/* binding */ SocialTimelineEntryComponent)
/* harmony export */ });
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/core */ 55309);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 61699);






function SocialTimelineEntryComponent_div_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "img", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("src", ctx_r0.imageUrl, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
  }
}
const _c0 = ["*"];
class SocialTimelineEntryComponent {
  constructor() {}
  ngOnInit() {}
  static #_ = this.ɵfac = function SocialTimelineEntryComponent_Factory(t) {
    return new (t || SocialTimelineEntryComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
    type: SocialTimelineEntryComponent,
    selectors: [["vex-profile-timeline-entry"]],
    inputs: {
      avatarUrl: "avatarUrl",
      name: "name",
      time: "time",
      imageUrl: "imageUrl",
      likes: "likes",
      comments: "comments"
    },
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵStandaloneFeature"]],
    ngContentSelectors: _c0,
    decls: 18,
    vars: 8,
    consts: [[1, "px-6", "py-4", "flex", "items-center"], ["alt", "User Picture", 1, "flex-none", "avatar", "ltr:mr-4", "rtl:ml-4", 3, "src"], [1, "flex-auto"], [1, "font-medium"], [1, "text-secondary", "font-medium", "text-xs"], [4, "ngIf"], [1, "flex", "justify-between"], ["matRipple", "", 1, "px-6", "py-2", "flex", "flex-row", "cursor-pointer", "select-none", "items-center", "text-pink", "ltr:rounded-bl", "rtl:rounded-br", "relative", "hover:bg-pink/10", "transition", "duration-400", "ease-out-swift", "h-10"], ["svgIcon", "mat:favorite", 1, "icon-sm"], [1, "font-medium", "ltr:ml-2", "rtl:mr-2", "text-sm"], ["matRipple", "", 1, "px-6", "py-2", "flex", "flex-row", "cursor-pointer", "select-none", "items-center", "text-primary-600", "ltr:rounded-br", "rtl:rounded-bl", "relative", "hover:bg-primary-600/10", "transition", "duration-400", "ease-out-swift", "h-10"], ["svgIcon", "mat:comment", 1, "icon-sm"], [3, "src"]],
    template: function SocialTimelineEntryComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojectionDef"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "img", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 2)(3, "p", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "p", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojection"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](8, SocialTimelineEntryComponent_div_8_Template, 2, 1, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "div", 6)(10, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](11, "mat-icon", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "p", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](15, "mat-icon", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "p", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("src", ctx.avatarUrl, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.name);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.time);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.imageUrl);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("border-t", !ctx.imageUrl);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("", ctx.likes, " Likes");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("", ctx.comments, " Comments");
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.NgIf, _angular_material_core__WEBPACK_IMPORTED_MODULE_2__.MatRippleModule, _angular_material_core__WEBPACK_IMPORTED_MODULE_2__.MatRipple, _angular_material_icon__WEBPACK_IMPORTED_MODULE_3__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_3__.MatIcon],
    styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }),

/***/ 37767:
/*!********************************************************************************!*\
  !*** ./src/app/pages/apps/social/social-timeline/social-timeline.component.ts ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SocialTimelineComponent: () => (/* binding */ SocialTimelineComponent)
/* harmony export */ });
/* harmony import */ var _static_data_friend_suggestions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../static-data/friend-suggestions */ 42598);
/* harmony import */ var _vex_animations_fade_in_up_animation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @vex/animations/fade-in-up.animation */ 83951);
/* harmony import */ var _vex_animations_fade_in_right_animation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @vex/animations/fade-in-right.animation */ 95982);
/* harmony import */ var _vex_animations_scale_in_animation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @vex/animations/scale-in.animation */ 62008);
/* harmony import */ var _vex_animations_stagger_animation__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @vex/animations/stagger.animation */ 86820);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/common */ 26575);
/* harmony import */ var _components_social_timeline_entry_social_timeline_entry_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/social-timeline-entry/social-timeline-entry.component */ 7745);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/button */ 90895);
/* harmony import */ var _angular_cdk_text_field__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/cdk/text-field */ 5802);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/icon */ 86515);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/core */ 55309);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 61699);















function SocialTimelineComponent_div_117_button_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "button", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function SocialTimelineComponent_div_117_button_7_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r7);
      const friend_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]().$implicit;
      const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r5.addFriend(friend_r2));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](1, "mat-icon", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
}
function SocialTimelineComponent_div_117_button_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "button", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function SocialTimelineComponent_div_117_button_8_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r10);
      const friend_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]().$implicit;
      const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r8.removeFriend(friend_r2));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](1, "mat-icon", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
}
function SocialTimelineComponent_div_117_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](1, "img", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](2, "div", 1)(3, "h4", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](5, "h5", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](7, SocialTimelineComponent_div_117_button_7_Template, 2, 0, "button", 63)(8, SocialTimelineComponent_div_117_button_8_Template, 2, 0, "button", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const friend_r2 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("@scaleIn", undefined)("src", friend_r2.imageSrc, _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("@fadeInRight", undefined);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](friend_r2.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", friend_r2.friends, " mutual friends ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", !friend_r2.added);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", friend_r2.added);
  }
}
class SocialTimelineComponent {
  constructor() {
    this.suggestions = _static_data_friend_suggestions__WEBPACK_IMPORTED_MODULE_0__.friendSuggestions;
  }
  ngOnInit() {}
  addFriend(friend) {
    friend.added = true;
  }
  removeFriend(friend) {
    friend.added = false;
  }
  trackByName(index, friend) {
    return friend.name;
  }
  static #_ = this.ɵfac = function SocialTimelineComponent_Factory(t) {
    return new (t || SocialTimelineComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineComponent"]({
    type: SocialTimelineComponent,
    selectors: [["vex-social-timeline"]],
    standalone: true,
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵStandaloneFeature"]],
    decls: 118,
    vars: 29,
    consts: [[1, "mt-6", "flex", "flex-col", "md:flex-row", "md:items-start"], [1, "flex-auto"], [1, "flex", "justify-between"], ["matRipple", "", 1, "relative", "flex", "items-center", "cursor-pointer", "select-none", "rounded-full", "px-4", "py-1", "hover:bg-primary-600/10", "transition", "duration-400", "ease-out-swift"], [1, "p-2", "bg-primary-600/10", "text-primary-600", "rounded-full", "ltr:mr-4", "rtl:ml-4"], ["svgIcon", "mat:add", 1, "block"], [1, "font-medium", "text-primary-600"], ["matRipple", "", 1, "relative", "flex", "items-center", "cursor-pointer", "select-none", "rounded-full", "px-4", "py-2", "hover:bg-green-600/10", "transition", "duration-400", "ease-out-swift"], [1, "p-2", "bg-green-600/10", "text-green-600", "rounded-full", "ltr:mr-4", "rtl:ml-4"], ["svgIcon", "mat:add_a_photo", 1, "block"], [1, "font-medium", "text-green-600"], ["matRipple", "", 1, "relative", "flex", "items-center", "cursor-pointer", "select-none", "rounded-full", "px-4", "py-2", "hover:bg-cyan-600/10", "transition", "duration-400", "ease-out-swift"], [1, "p-2", "bg-cyan-600/10", "text-cyan-600", "rounded-full", "ltr:mr-4", "rtl:ml-4"], ["svgIcon", "mat:photo_filter", 1, "block"], [1, "font-medium", "text-cyan-600"], [1, "card", "mt-6"], [1, "bg-foreground", "rounded-t", "flex", 3, "click"], ["placeholder", "Share your thoughts...", 1, "outline-none", "bg-foreground", "p-6", "rounded-t", "flex-auto"], ["textarea", ""], [1, "bg-app-bar", "flex"], ["mat-button", "", "type", "button", 1, "text-secondary", "uppercase", "font-medium", "rounded-none", "ltr:rounded-bl", "rtl:rounded-br"], ["matButtonIcon", "", "svgIcon", "mat:add_a_photo"], [1, "text-xs"], ["mat-button", "", "type", "button", 1, "text-secondary", "uppercase", "font-medium", "rounded-none"], ["matButtonIcon", "", "svgIcon", "mat:attach_file"], [1, "flex-1"], ["color", "primary", "mat-flat-button", "", "type", "button", 1, "uppercase", "font-medium", "rounded-none", "ltr:rounded-br", "rtl:rounded-bl"], ["iconPositionEnd", "", "matButtonIcon", "", "svgIcon", "mat:keyboard_arrow_right"], [1, "flex", "flex-col", "sm:flex-row"], ["avatarUrl", "assets/img/avatars/6.jpg", "comments", "5", "imageUrl", "assets/img/demo/3.jpg", "likes", "16", "name", "Jimmy Fallon", "time", "14 minutes ago"], ["avatarUrl", "assets/img/avatars/7.jpg", "comments", "15", "likes", "62", "name", "Jens Zaracha", "time", "18 minutes ago"], [1, "px-6", "pt-1", "pb-4"], ["avatarUrl", "assets/img/avatars/5.jpg", "comments", "4", "imageUrl", "assets/img/demo/5.jpg", "likes", "48", "name", "Daniela Longcliff", "time", "33 minutes ago"], ["avatarUrl", "assets/img/avatars/10.jpg", "comments", "7", "imageUrl", "assets/img/demo/6.jpg", "likes", "31", "name", "Jack White", "time", "2 hours ago"], [1, "flex-1", "sm:ltr:ml-4", "sm:rtl:mr-4"], ["avatarUrl", "assets/img/avatars/3.jpg", "comments", "2", "likes", "14", "name", "Franklin Treasor", "time", "23 minutes ago"], ["avatarUrl", "assets/img/avatars/2.jpg", "comments", "9", "imageUrl", "assets/img/demo/4.jpg", "likes", "33", "name", "Johnathan McCloud", "time", "48 minutes ago"], ["avatarUrl", "assets/img/avatars/11.jpg", "comments", "7", "imageUrl", "assets/img/demo/7.jpg", "likes", "26", "name", "Peter Proll", "time", "2 hours ago"], ["avatarUrl", "assets/img/avatars/10.jpg", "comments", "15", "likes", "62", "name", "Michael Baltan", "time", "3 hours ago"], [1, "flex-none", "max-w-unset", "md:max-w-xs", "w-full", "md:ltr:ml-6", "md:rtl:mr-6", "mt-6", "md:mt-0"], [1, "card"], [1, "px-6", "py-4", "border-b"], [1, "title", "m-0"], [1, "px-6", "py-3"], [1, "py-3", "flex", "items-center"], [1, "w-10", "h-10", "rounded-full", "bg-primary-600/10", "text-primary-600", "ltr:mr-3", "rtl:ml-3", "flex", "items-center", "justify-center"], ["svgIcon", "mat:phone", 1, "icon-sm"], [1, "m-0", "body-1"], [1, "m-0", "caption", "text-hint"], ["svgIcon", "mat:work", 1, "icon-sm"], ["svgIcon", "mat:mail", 1, "icon-sm"], [1, "w-10", "h-10", "rounded-full", "bgbg-primary-60010", "text-primary-600", "ltr:mr-3", "rtl:ml-3", "flex", "items-center", "justify-center"], ["svgIcon", "mat:access_time", 1, "icon-sm"], [1, "w-10", "h-10", "rounded-full", "bg-gray-600/10", "text-dark", "ltr:mr-3", "rtl:ml-3", "cursor-pointer", "flex", "items-center", "justify-center"], ["svgIcon", "mat:add", 1, "icon-sm"], [1, "m-0", "body-1", "cursor-pointer"], ["svgIcon", "mat:whatshot", 1, "icon-sm"], [1, "px-6", "py-4", "flex", "flex-col", "gap-4"], ["class", "flex items-center", 4, "ngFor", "ngForOf", "ngForTrackBy"], [1, "flex", "items-center"], ["alt", "Profile Picture", 1, "avatar", "ltr:mr-3", "rtl:ml-3", "flex-none", 3, "src"], [1, "body-2", "m-0", "leading-snug"], [1, "text-secondary", "m-0", "caption", "leading-none"], ["color", "primary", "mat-icon-button", "", "type", "button", 3, "click", 4, "ngIf"], ["color", "primary", "mat-icon-button", "", "type", "button", 3, "click"], ["svgIcon", "mat:person_add"], ["svgIcon", "mat:check"]],
    template: function SocialTimelineComponent_Template(rf, ctx) {
      if (rf & 1) {
        const _r11 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](5, "mat-icon", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](6, "p", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](7, " Share your thoughts ");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](8, "div", 7)(9, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](10, "mat-icon", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](11, "p", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](12, "Take a picture");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](13, "div", 11)(14, "div", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](15, "mat-icon", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](16, "p", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](17, "Create a story");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](18, "div", 15)(19, "div", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function SocialTimelineComponent_Template_div_click_19_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r11);
          const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵreference"](21);
          return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](_r0.focus());
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](20, "textarea", 17, 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](22, "div", 19)(23, "button", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](24, "mat-icon", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](25, "span", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](26, "Photo");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](27, "button", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](28, "mat-icon", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](29, "span", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](30, "File/Document");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](31, "span", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](32, "button", 26)(33, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](34, "Post");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](35, "mat-icon", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](36, "div", 28)(37, "div", 25)(38, "div", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](39, "vex-profile-timeline-entry", 29);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](40, "div", 15)(41, "vex-profile-timeline-entry", 30)(42, "p", 31);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](43, " I'm absolutely in love with the new Angular template I bought a few days ago, it's called Vex and it's absolutely gorgeous. ");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](44, "div", 15)(45, "vex-profile-timeline-entry", 32)(46, "p", 31);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](47, " Having fun @work! Anyone want to get a drink later? ");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](48, "div", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](49, "vex-profile-timeline-entry", 33);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](50, "div", 34)(51, "div", 15)(52, "vex-profile-timeline-entry", 35)(53, "p", 31);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](54, " Finally! I managed to get my shiny new PC up & running. Anyone want to meet up and get some hands-on details? ");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](55, "div", 15)(56, "vex-profile-timeline-entry", 36)(57, "p", 31);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](58, " Have you ever seen such a clean workspace? ");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](59, "div", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](60, "vex-profile-timeline-entry", 37);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](61, "div", 15)(62, "vex-profile-timeline-entry", 38)(63, "p", 31);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](64, " Have you ever scrolled so far that you wondered why you landed here? If you're still scrolling and love the template, take a look at the beautiful Scrumboard or the Contacts list! :) ");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](65, "div", 39)(66, "div", 40)(67, "div", 41);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](68, "h2", 42);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](69, "div", 43)(70, "div", 44)(71, "div", 45);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](72, "mat-icon", 46);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](73, "div")(74, "p", 47);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](75, "+1 (930) 502-3182");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](76, "p", 48);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](77, "Business");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](78, "div", 44)(79, "div", 45);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](80, "mat-icon", 49);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](81, "div")(82, "p", 47);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](83, "Web Developer at IceCube");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](84, "p", 48);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](85, "Previously Designer at HotStuff");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](86, "div", 44)(87, "div", 45);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](88, "mat-icon", 50);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](89, "div")(90, "p", 47);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](91, "david.smith@example.com");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](92, "p", 48);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](93, "Business inquiries only");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](94, "div", 44)(95, "div", 51);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](96, "mat-icon", 52);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](97, "div")(98, "p", 47);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](99, "Usually available 9am-5pm");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](100, "p", 48);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](101, "Call +1 (930) 242-5186");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](102, "div", 44)(103, "div", 53);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](104, "mat-icon", 54);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](105, "p", 55);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](106, "Add an address");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](107, "div", 44)(108, "div", 53);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](109, "mat-icon", 56);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](110, "p", 55);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](111, " Add social profiles ");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](112, "div", 15)(113, "div", 41)(114, "h2", 42);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](115, "Friend Suggestions");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](116, "div", 57);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](117, SocialTimelineComponent_div_117_Template, 9, 7, "div", 58);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("@scaleIn", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("@fadeInRight", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("@scaleIn", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("@fadeInRight", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("@fadeInRight", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("@fadeInUp", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](20);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("@fadeInUp", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("@fadeInUp", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("@fadeInUp", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("@fadeInUp", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("@fadeInUp", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("@fadeInUp", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("@fadeInUp", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("@fadeInUp", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](10);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("@scaleIn", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("@fadeInRight", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("@scaleIn", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("@fadeInRight", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("@scaleIn", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("@fadeInRight", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("@scaleIn", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("@fadeInRight", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("@scaleIn", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("@fadeInRight", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("@scaleIn", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("@fadeInRight", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("@stagger", undefined);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngForOf", ctx.suggestions)("ngForTrackBy", ctx.trackByName);
      }
    },
    dependencies: [_angular_material_core__WEBPACK_IMPORTED_MODULE_7__.MatRippleModule, _angular_material_core__WEBPACK_IMPORTED_MODULE_7__.MatRipple, _angular_material_icon__WEBPACK_IMPORTED_MODULE_8__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_8__.MatIcon, _angular_cdk_text_field__WEBPACK_IMPORTED_MODULE_9__.TextFieldModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_10__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_10__.MatButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_10__.MatIconButton, _components_social_timeline_entry_social_timeline_entry_component__WEBPACK_IMPORTED_MODULE_5__.SocialTimelineEntryComponent, _angular_common__WEBPACK_IMPORTED_MODULE_11__.NgFor, _angular_common__WEBPACK_IMPORTED_MODULE_11__.NgIf],
    styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"],
    data: {
      animation: [_vex_animations_fade_in_up_animation__WEBPACK_IMPORTED_MODULE_1__.fadeInUp400ms, _vex_animations_fade_in_right_animation__WEBPACK_IMPORTED_MODULE_2__.fadeInRight400ms, _vex_animations_scale_in_animation__WEBPACK_IMPORTED_MODULE_3__.scaleIn400ms, _vex_animations_stagger_animation__WEBPACK_IMPORTED_MODULE_4__.stagger40ms]
    }
  });
}

/***/ })

}]);
//# sourceMappingURL=src_app_pages_apps_social_social-timeline_social-timeline_component_ts.js.map